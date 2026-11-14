#!/usr/bin/env python3
"""
Idempotent font subsetter for choam.studio (P-12).

Scans all UTF-8 text files (.html, .js, .css, .svg, .json, .txt, .md) in the
site repository, collects all unique codepoints plus ASCII (0x20..0x7E) and
essential punctuation/numeric/technical symbols, and builds a WOFF2 subset from
assets/PretendardVariable.woff2 using fontTools.subset.

Usage:
  python3 tools/subset-fonts.py --output /tmp/test-choam-subset.woff2
  python3 tools/subset-fonts.py  # writes assets/choam-sans-subset.woff2
"""

from __future__ import annotations

import argparse
import html
import os
import re
import sys
import tempfile
from pathlib import Path

from fontTools.subset import Options, Subsetter, load_font, save_font

TEXT_EXTENSIONS = {".html", ".js", ".css", ".svg", ".json", ".txt", ".md"}
SKIP_DIRS = {".git", "node_modules", "__pycache__", ".venv", "venv"}

# Essential baseline ranges:
# - Basic ASCII: 0x0020..0x007E
# - Latin-1 Supplement & Latin Extended-A: 0x00A0..0x017F
# - General Punctuation, Superscripts/Subscripts, Currency: 0x2000..0x20CF
# - Letterlike, Number Forms, Arrows, Math Operators: 0x2100..0x22FF
# - Misc Technical & Box Drawing & Geometric Shapes (┌ ┘ ⊘ ✓ × · etc.): 0x2300..0x25FF, 0x2700..0x27BF
# - CJK Symbols & Punctuation (《》 『』 「」 ・ 、 。): 0x3000..0x303F
BASE_RANGES: list[tuple[int, int]] = [
    (0x0020, 0x007E),
    (0x00A0, 0x017F),
    (0x2000, 0x20CF),
    (0x2100, 0x22FF),
    (0x2300, 0x25FF),
    (0x2700, 0x27BF),
    (0x3000, 0x303F),
    (0xFE30, 0xFE4F),
    (0xFF01, 0xFF60),
]

JS_UNICODE_ESCAPE_RE = re.compile(r"\\u([0-9a-fA-F]{4})|\\u\{([0-9a-fA-F]{1,6})\}")


def collect_base_codepoints() -> set[int]:
    cps: set[int] = set()
    for start, end in BASE_RANGES:
        cps.update(range(start, end + 1))
    return cps


def extract_codepoints_from_text(text: str) -> set[int]:
    cps: set[int] = set()
    # Raw characters
    for ch in text:
        cp = ord(ch)
        if cp >= 0x20 and not (0xD800 <= cp <= 0xDFFF):
            cps.add(cp)
    # Unescaped HTML entities (e.g. &middot;, &#x2192;, &copy;)
    unescaped = html.unescape(text)
    for ch in unescaped:
        cp = ord(ch)
        if cp >= 0x20 and not (0xD800 <= cp <= 0xDFFF):
            cps.add(cp)
    # JS/CSS \uXXXX or \u{XXXXX} escapes
    for m in JS_UNICODE_ESCAPE_RE.finditer(text):
        hex_str = m.group(1) or m.group(2)
        cp = int(hex_str, 16)
        if 0x20 <= cp <= 0x10FFFF and not (0xD800 <= cp <= 0xDFFF):
            cps.add(cp)
    return cps


def iter_site_text_files(site_root: Path) -> list[Path]:
    files: list[Path] = []
    for root, dirs, filenames in os.walk(site_root):
        dirs[:] = sorted(d for d in dirs if d not in SKIP_DIRS)
        root_path = Path(root)
        # Skip tools/ internal scripts so validator forbidden-word strings do not pollute font glyphs
        if root_path == site_root / "tools":
            dirs[:] = []
            continue
        for fn in sorted(filenames):
            p = root_path / fn
            if p.suffix.lower() in TEXT_EXTENSIONS:
                files.append(p)
    return files


def format_unicode_range(codepoints: list[int]) -> str:
    if not codepoints:
        return ""
    sorted_cps = sorted(set(codepoints))
    ranges: list[str] = []
    start = prev = sorted_cps[0]
    for cp in sorted_cps[1:]:
        if cp == prev + 1:
            prev = cp
        else:
            ranges.append(
                f"U+{start:04X}" if start == prev else f"U+{start:04X}-{prev:04X}"
            )
            start = prev = cp
    ranges.append(f"U+{start:04X}" if start == prev else f"U+{start:04X}-{prev:04X}")
    return ", ".join(ranges)


def build_subset(site_root: Path, input_font: Path, output_font: Path) -> dict[str, int | str]:
    if not input_font.is_file():
        raise FileNotFoundError(f"Input font not found: {input_font}")

    codepoints = collect_base_codepoints()
    scanned_files = iter_site_text_files(site_root)
    for fp in scanned_files:
        text = fp.read_text(encoding="utf-8", errors="replace")
        codepoints.update(extract_codepoints_from_text(text))

    font = load_font(str(input_font), Options())
    cmap = font.getBestCmap() or {}
    supported_cps = sorted(cp for cp in codepoints if cp in cmap)
    hangul_cps = [cp for cp in supported_cps if 0xAC00 <= cp <= 0xD7A3]

    options = Options()
    options.flavor = "woff2"
    options.layout_features = ["*"]
    options.name_IDs = ["*"]
    options.name_legacy = True
    options.name_languages = ["*"]
    options.notdef_outline = True
    options.recalc_bounds = True
    options.recalc_timestamp = False
    options.canonical_order = True

    subsetter = Subsetter(options=options)
    subsetter.populate(unicodes=supported_cps)
    subsetter.subset(font)

    output_font.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(
        dir=str(output_font.parent), suffix=".woff2", delete=False
    ) as tmp:
        tmp_path = Path(tmp.name)
    try:
        save_font(font, str(tmp_path), options)
        os.replace(tmp_path, output_font)
    finally:
        if tmp_path.exists():
            tmp_path.unlink(missing_ok=True)
        font.close()

    return {
        "scanned_files": len(scanned_files),
        "requested_codepoints": len(codepoints),
        "included_codepoints": len(supported_cps),
        "hangul_syllables": len(hangul_cps),
        "size_bytes": output_font.stat().st_size,
        "unicode_range": format_unicode_range(supported_cps),
    }


def main() -> int:
    repo_default = Path(__file__).resolve().parent.parent
    parser = argparse.ArgumentParser(
        description="Build deterministic WOFF2 font subset from all site UTF-8 text."
    )
    parser.add_argument(
        "--root",
        type=Path,
        default=repo_default,
        help="Site root directory (default: parent of tools/)",
    )
    parser.add_argument(
        "--input",
        type=Path,
        default=None,
        help="Source variable WOFF2 font (default: <root>/assets/PretendardVariable.woff2)",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=None,
        help="Output subset WOFF2 path (default: <root>/assets/choam-sans-subset.woff2)",
    )
    parser.add_argument(
        "--print-unicode-range",
        action="store_true",
        help="Print the exact CSS unicode-range descriptor covering included glyphs",
    )
    parser.add_argument(
        "--sync-css",
        type=Path,
        default=None,
        help="Optional CSS file whose choam-sans-subset.woff2 @font-face unicode-range should be synced",
    )
    args = parser.parse_args()

    site_root = args.root.resolve()
    input_font = (args.input or (site_root / "assets" / "PretendardVariable.woff2")).resolve()
    output_font = (args.output or (site_root / "assets" / "choam-sans-subset.woff2")).resolve()

    stats = build_subset(site_root, input_font, output_font)
    size_kb = int(stats["size_bytes"]) / 1024.0
    print(
        f"[subset-fonts] OK -> {output_font} "
        f"({size_kb:.1f} KB / {stats['size_bytes']} bytes | "
        f"files={stats['scanned_files']}, "
        f"glyphs={stats['included_codepoints']}, "
        f"hangul={stats['hangul_syllables']})"
    )
    if args.sync_css:
        css_path = args.sync_css.resolve()
        css_text = css_path.read_text(encoding="utf-8")
        pattern = re.compile(
            r"(@font-face\s*\{[^}]*choam-sans-subset\.woff2[^}]*?unicode-range:\s*)([^;]+)(;)",
            re.DOTALL,
        )
        new_css, count = pattern.subn(rf"\g<1>{stats['unicode_range']}\g<3>", css_text, count=1)
        if count:
            css_path.write_text(new_css, encoding="utf-8")
            print(f"[subset-fonts] Synced unicode-range in {css_path}")
    if args.print_unicode_range:
        print(f"unicode-range: {stats['unicode_range']};")
    return 0


if __name__ == "__main__":
    sys.exit(main())
