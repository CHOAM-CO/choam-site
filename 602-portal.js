/* Shared portal script for 602/download.html and 602/docs.html (loaded after main.js). */
(() => {
  const htmlEl = document.documentElement;
  const getLang = () => {
    const l = htmlEl.lang;
    return l === 'ko' || l === 'ja' ? l : 'en';
  };
  const L = (en, ko, ja) => {
    const l = getLang();
    return l === 'ko' ? ko : l === 'ja' ? ja : en;
  };

  const onLangChange = [];

  /* ---------- 1. Code Copy Buttons (pre.p602-code & .p602-page pre.inst-code) ---------- */
  const copyBtns = [];
  const labelCopyBtn = btn => {
    const copied = btn.classList.contains('is-copied');
    btn.textContent = copied
      ? L('Copied', '복사됨', 'コピー済み')
      : L('Copy', '복사', 'コピー');
    btn.setAttribute(
      'aria-label',
      copied
        ? L('Copied to clipboard', '클립보드에 복사됨', 'クリップボードにコピーしました')
        : L('Copy code snippet', '코드 복사', 'コードをコピー')
    );
  };

  const copyText = async text => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  };

  document.querySelectorAll('pre.p602-code, .p602-page pre.inst-code').forEach(pre => {
    if (pre.querySelector('.p602-copy-btn')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'p602-copy-btn';
    labelCopyBtn(btn);
    let timer = 0;
    btn.addEventListener('click', async () => {
      const code = pre.querySelector('code');
      let raw = '';
      if (code) {
        raw = code.textContent;
      } else {
        const clone = pre.cloneNode(true);
        clone.querySelectorAll('.p602-copy-btn').forEach(b => b.remove());
        raw = clone.textContent;
      }
      try {
        await copyText(raw.replace(/^\n+|\n+$/g, ''));
        clearTimeout(timer);
        btn.classList.add('is-copied');
        labelCopyBtn(btn);
        timer = setTimeout(() => {
          btn.classList.remove('is-copied');
          labelCopyBtn(btn);
        }, 1800);
      } catch (err) {
        /* clipboard blocked */
      }
    });
    pre.appendChild(btn);
    copyBtns.push(btn);
  });

  onLangChange.push(() => copyBtns.forEach(labelCopyBtn));

  /* ---------- 2. Download Archive & License Gate (602/download.html) ---------- */
  const agreeBox = document.querySelector('[data-602-agree]');
  const pkgContainer = document.querySelector('[data-602-packages]');
  const statusBanner = document.querySelector('[data-602-rel-status]');
  const dlLinks = [...document.querySelectorAll('[data-602-dl]')];
  const shaLinks = [...document.querySelectorAll('[data-602-sha]')];

  if (agreeBox || pkgContainer || dlLinks.length) {
    const REL_REPO = 'https://github.com/CHOAM-CO/602-releases';
    const REL_DL_PREFIX = 'https://github.com/CHOAM-CO/602-releases/releases/download/';
    const REL_API = 'https://api.github.com/repos/CHOAM-CO/602-releases/releases/latest';
    const REL_JSON = (() => {
      const relUrl = new URL('../602-release.json', location.href).href;
      if (location.pathname.endsWith('/')) {
        return new URL('../../602-release.json', location.href).href;
      }
      return relUrl;
    })();

    const DEFAULT_ENGINE_TAG = 'v1.2.1';
    const DEFAULT_EDITOR_TAG = 'v0.1.6';
    const DEFAULT_RELEASE_LABEL = `Engine ${DEFAULT_ENGINE_TAG} · Editor ${DEFAULT_EDITOR_TAG}`;

    const ASSETS = [
      { key: 'engine-macos-arm64', os: 'mac',       defaultName: `story-engine-${DEFAULT_ENGINE_TAG}-macos-arm64.zip`, file: /^story-engine-v[0-9][0-9A-Za-z.+-]*-macos-arm64\.zip$/ },
      { key: 'engine-macos-x64',   os: 'mac-intel', defaultName: `story-engine-${DEFAULT_ENGINE_TAG}-macos-x64.zip`,   file: /^story-engine-v[0-9][0-9A-Za-z.+-]*-macos-x64\.zip$/ },
      { key: 'engine-windows-x64', os: 'win',       defaultName: `story-engine-${DEFAULT_ENGINE_TAG}-windows-x64.zip`, file: /^story-engine-v[0-9][0-9A-Za-z.+-]*-windows-x64\.zip$/ },
      { key: 'engine-linux-x64',   os: 'linux',     defaultName: `story-engine-${DEFAULT_ENGINE_TAG}-linux-x64.zip`,   file: /^story-engine-v[0-9][0-9A-Za-z.+-]*-linux-x64\.zip$/ },
      { key: 'editor-macos-arm64', os: 'mac',       defaultName: `story-editor-${DEFAULT_EDITOR_TAG}-macos-arm64.zip`, file: /^story-editor-v[0-9][0-9A-Za-z.+-]*-macos-arm64\.zip$/ },
      { key: 'editor-windows-x64', os: 'win',       defaultName: `story-editor-${DEFAULT_EDITOR_TAG}-windows-x64.zip`, file: /^story-editor-v[0-9][0-9A-Za-z.+-]*-windows-x64\.zip$/ },
      { key: 'editor-linux-x64',   os: 'linux',     defaultName: `story-editor-${DEFAULT_EDITOR_TAG}-linux-x64.zip`,   file: /^story-editor-v[0-9][0-9A-Za-z.+-]*-linux-x64\.zip$/ }
    ];

    let detectedOS = (() => {
      const n = navigator;
      const ua = (n.userAgent || '').toLowerCase();
      const pf = ((n.userAgentData && n.userAgentData.platform) || n.platform || '').toLowerCase();
      if (/android|iphone|ipad|ipod|cros/.test(ua) || /android|chrome os|ios/.test(pf) || (/mac/.test(pf) && n.maxTouchPoints > 1)) return '';
      if (/^win/.test(pf) || /windows nt/.test(ua)) return 'win';
      if (/mac/.test(pf) || /mac os x/.test(ua)) return 'mac';
      if (/linux/.test(pf) || /linux/.test(ua)) return 'linux';
      return '';
    })();

    const rel = {
      state: 'idle', /* idle -> loading -> ok | staged */
      tag: '',
      urls: {},
      shas: {},
      names: {}
    };

    const validUrl = (u, name) =>
      typeof u === 'string' &&
      u.startsWith(REL_DL_PREFIX) &&
      (!name || u.endsWith('/' + name));

    const parseReleasePayload = data => {
      const pool = [];
      if (data && Array.isArray(data.assets)) pool.push(...data.assets);
      if (data && Array.isArray(data.releases)) {
        data.releases.forEach(r => {
          if (r && Array.isArray(r.assets)) pool.push(...r.assets);
        });
      }
      const urls = {};
      const shas = {};
      const names = {};
      ASSETS.forEach(spec => {
        const asset = pool.find(
          x =>
            x &&
            typeof x.name === 'string' &&
            spec.file.test(x.name) &&
            (!x.state || x.state === 'uploaded') &&
            validUrl(x.browser_download_url, x.name)
        );
        if (asset) {
          urls[spec.key] = asset.browser_download_url;
          names[spec.key] = asset.name;
          const shaName = asset.name + '.sha256';
          const shaAsset = pool.find(
            x =>
              x &&
              x.name === shaName &&
              (!x.state || x.state === 'uploaded') &&
              validUrl(x.browser_download_url, x.name)
          );
          if (shaAsset) shas[spec.key] = shaAsset.browser_download_url;
        }
      });
      if (!Object.keys(urls).length) throw new Error('no 602 assets');
      rel.urls = urls;
      rel.shas = shas;
      rel.names = names;
      rel.tag =
        data && typeof data.tag_name === 'string' && data.tag_name
          ? data.tag_name
          : DEFAULT_RELEASE_LABEL;
      rel.state = 'ok';
    };

    let relPromise = null;
    const loadRelease = () => {
      if (rel.state !== 'idle') return relPromise;
      rel.state = 'loading';
      const ctl = 'AbortController' in window ? new AbortController() : null;
      const timer = ctl ? setTimeout(() => ctl.abort(), 9000) : 0;
      const fetchJson = u =>
        fetch(u, ctl ? { signal: ctl.signal } : {}).then(r => {
          if (!r.ok) throw new Error(String(r.status));
          return r.json();
        });
      relPromise = fetchJson(REL_JSON)
        .then(parseReleasePayload)
        .catch(() => fetchJson(REL_API).then(parseReleasePayload))
        .catch(() => {
          rel.state = 'staged';
          rel.urls = {};
          rel.shas = {};
        })
        .finally(() => {
          clearTimeout(timer);
          renderDownloadState();
        });
      return relPromise;
    };

    const focusGate = () => {
      if (!agreeBox) return;
      const label = agreeBox.closest('.p602-agree') || agreeBox;
      label.scrollIntoView({ behavior: 'smooth', block: 'center' });
      agreeBox.focus({ preventScroll: true });
      label.classList.add('is-attention');
      setTimeout(() => label.classList.remove('is-attention'), 1200);
    };

    const renderDownloadState = () => {
      const unlocked = !!(agreeBox && agreeBox.checked);
      if (pkgContainer) {
        pkgContainer.classList.toggle('is-unlocked', unlocked);
        pkgContainer.classList.toggle('is-live', unlocked && rel.state === 'ok');
        pkgContainer.classList.toggle('is-staged', unlocked && rel.state === 'staged');
      }

      /* Highlight recommended rows & pills */
      dlLinks.forEach(a => {
        const key = a.getAttribute('data-602-dl') || '';
        const spec = ASSETS.find(s => s.key === key);
        const isRec = !!(spec && detectedOS && spec.os === detectedOS);
        const row = a.closest('.p602-dl-row');
        if (row) {
          row.classList.toggle('is-rec', isRec);
          const pill = row.querySelector('[data-602-rec]');
          if (pill) {
            pill.hidden = !isRec;
            pill.textContent = L('Recommended', '추천', 'おすすめ');
          }
          const fn = row.querySelector('[data-602-filename]');
          if (fn) {
            const resolvedName = rel.names[key] || (spec ? spec.defaultName : '');
            if (resolvedName) fn.textContent = resolvedName;
          }
        } else {
          a.classList.toggle('is-rec', isRec);
        }

        const liveUrl = rel.urls[key] || '';
        const labelSpan = a.querySelector('[data-602-dl-label]') || a;

        if (!unlocked) {
          a.href = '#p602-agree-check';
          a.setAttribute('aria-disabled', 'true');
          a.classList.add('is-locked');
          a.classList.remove('is-ready', 'is-staged');
          labelSpan.textContent = L('Accept License', '동의 후 다운로드', '同意してダウンロード');
        } else if (liveUrl) {
          a.href = liveUrl;
          a.setAttribute('aria-disabled', 'false');
          a.classList.add('is-ready');
          a.classList.remove('is-locked', 'is-staged');
          labelSpan.textContent = L('Download .zip', '.zip 다운로드', '.zip をダウンロード');
        } else if (rel.state === 'loading') {
          a.href = '#';
          a.setAttribute('aria-disabled', 'true');
          a.classList.add('is-staged');
          a.classList.remove('is-locked', 'is-ready');
          labelSpan.textContent = L('Checking…', '확인 중…', '確認中…');
        } else {
          a.href = '#';
          a.setAttribute('aria-disabled', 'true');
          a.classList.add('is-staged');
          a.classList.remove('is-locked', 'is-ready');
          labelSpan.textContent = L('Staged for Release', '릴리스 게시 대기', '公開準備中');
        }
      });

      shaLinks.forEach(a => {
        const key = a.getAttribute('data-602-sha') || '';
        const spec = ASSETS.find(s => s.key === key);
        const shaTargetName = rel.names[key] || (spec ? spec.defaultName : '');
        if (shaTargetName) {
          a.setAttribute('aria-label', `SHA-256 checksum for ${shaTargetName}`);
        }
        const shaUrl = rel.shas[key] || '';
        if (!unlocked) {
          a.href = '#p602-agree-check';
          a.setAttribute('aria-disabled', 'true');
          a.classList.add('is-locked');
          a.classList.remove('is-ready', 'is-staged');
        } else if (shaUrl) {
          a.href = shaUrl;
          a.setAttribute('aria-disabled', 'false');
          a.classList.add('is-ready');
          a.classList.remove('is-locked', 'is-staged');
        } else {
          a.href = '#';
          a.setAttribute('aria-disabled', 'true');
          a.classList.add('is-staged');
          a.classList.remove('is-locked', 'is-ready');
        }
      });

      if (statusBanner) {
        if (!unlocked) {
          statusBanner.dataset.state = 'locked';
          statusBanner.textContent = L(
            'Check the CHOAM 602 License Agreement & Third-Party Notices box above to unlock archive downloads.',
            '위의 CHOAM 602 라이선스 계약 및 오픈소스 고지 동의란에 체크하면 아카이브 다운로드가 잠금 해제됩니다.',
            '上の CHOAM 602 ライセンス契約およびオープンソース告知に同意（チェック）すると、アーカイブのダウンロードが有効になります。'
          );
        } else if (rel.state === 'loading' || rel.state === 'idle') {
          statusBanner.dataset.state = 'loading';
          statusBanner.textContent = L(
            'Checking CHOAM-CO/602-releases for published binary archives…',
            '배포 저장소(CHOAM-CO/602-releases)에서 공개 바이너리 아카이브 정보를 확인하는 중입니다…',
            '配布リポジトリ（CHOAM-CO/602-releases）の公開バイナリ情報を確認しています…'
          );
        } else if (rel.state === 'ok') {
          statusBanner.dataset.state = 'ok';
          const tagNote = rel.tag ? ` (${rel.tag})` : '';
          statusBanner.innerHTML = '';
          const msg = document.createElement('span');
          msg.textContent = L(
            `License accepted${tagNote} · Direct .zip archives and .sha256 checksums are ready below. `,
            `라이선스 동의 완료${tagNote} · 아래에서 운영체제별 .zip 아카이브와 .sha256 체크섬을 바로 받을 수 있습니다. `,
            `ライセンス同意済み${tagNote} · 下の一覧から OS 別の .zip アーカイブと .sha256 チェックサムを直接ダウンロードできます。 `
          );
          const repoLink = document.createElement('a');
          repoLink.href = `${REL_REPO}/releases`;
          repoLink.target = '_blank';
          repoLink.rel = 'noopener';
          repoLink.textContent = L('Release notes', '릴리스 노트', 'リリースノート');
          statusBanner.append(msg, repoLink);
        } else {
          statusBanner.dataset.state = 'staged';
          statusBanner.innerHTML = '';
          const msg = document.createElement('span');
          msg.textContent = L(
            'License accepted · Public binary distribution (CHOAM-CO/602-releases) is staged for launch. Direct .zip and .sha256 buttons below will light up automatically as soon as the release tag goes live; all archive filenames, target specs, verification commands, and ',
            '라이선스 동의 완료 · 공개 바이너리 배포 저장소(CHOAM-CO/602-releases)는 현재 릴리스 게시 준비 단계입니다. 태그가 공개되면 아래 .zip 및 .sha256 버튼이 자동으로 활성화되며, 패키지 파일명·타깃 사양·체크섬 검증 명령어 및 ',
            'ライセンス同意済み · 公開バイナリ配布（CHOAM-CO/602-releases）は現在リリース公開の準備段階です。タグが公開され次第、下の .zip および .sha256 ボタンが自動的に有効になります。アーカイブ名・対象環境・検証コマンドおよび '
          );
          const docLink = document.createElement('a');
          docLink.href = 'docs';
          docLink.textContent = L('technical documentation (/602/docs)', '기술 문서(/602/docs)', '技術ドキュメント（/602/docs）');
          const tail = document.createElement('span');
          tail.textContent = L(
            ' are available to inspect right now.',
            '는 지금 바로 확인할 수 있습니다.',
            'は今すぐ確認できます。'
          );
          statusBanner.append(msg, docLink, tail);
        }
      }
    };

    if (detectedOS === 'mac' && navigator.userAgentData && typeof navigator.userAgentData.getHighEntropyValues === 'function') {
      navigator.userAgentData
        .getHighEntropyValues(['architecture'])
        .then(info => {
          if (info && info.architecture === 'x86') {
            detectedOS = 'mac-intel';
            renderDownloadState();
          }
        })
        .catch(() => {});
    }

    if (agreeBox) {
      agreeBox.addEventListener('change', () => {
        if (agreeBox.checked) loadRelease();
        renderDownloadState();
      });
    }

    const guardLinkClick = e => {
      const a = e.currentTarget;
      const unlocked = !!(agreeBox && agreeBox.checked);
      if (!unlocked) {
        e.preventDefault();
        focusGate();
        return;
      }
      if (a.getAttribute('aria-disabled') === 'true') {
        e.preventDefault();
        if (statusBanner) {
          statusBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    };

    dlLinks.forEach(a => a.addEventListener('click', guardLinkClick));
    shaLinks.forEach(a => a.addEventListener('click', guardLinkClick));

    onLangChange.push(renderDownloadState);
    renderDownloadState();
    loadRelease();
  }

  /* ---------- 3. Documentation Sidebar, ScrollSpy & Live Filter (602/docs.html) ---------- */
  const sidebar = document.querySelector('[data-doc-sidebar]');
  const tocToggle = document.querySelector('[data-doc-toc-toggle]');
  const filterInput = document.querySelector('input[data-doc-filter]');
  const tocLinks = [...document.querySelectorAll('[data-doc-link]')];

  if (sidebar || tocLinks.length || filterInput) {
    const linkIdOf = a => {
      const raw = (a.getAttribute('data-doc-link') || '').replace(/^#/, '').trim();
      if (raw) return raw;
      const href = a.getAttribute('href') || '';
      const idx = href.indexOf('#');
      return idx >= 0 ? decodeURIComponent(href.slice(idx + 1)).trim() : '';
    };

    const setDrawer = (open, returnFocus = false) => {
      if (!sidebar) return;
      sidebar.classList.toggle('is-open', open);
      if (tocToggle) {
        tocToggle.setAttribute('aria-expanded', String(open));
        if (!open && returnFocus) tocToggle.focus();
      }
    };

    if (tocToggle && sidebar) {
      tocToggle.addEventListener('click', () => {
        setDrawer(!sidebar.classList.contains('is-open'));
      });
      document.addEventListener('click', e => {
        if (!sidebar.classList.contains('is-open')) return;
        if (sidebar.contains(e.target) || tocToggle.contains(e.target)) return;
        setDrawer(false);
      });
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && sidebar.classList.contains('is-open')) {
          e.preventDefault();
          setDrawer(false, true);
        }
      });
      matchMedia('(max-width: 960px)').addEventListener('change', mq => {
        if (!mq.matches) setDrawer(false);
      });
    }

    tocLinks.forEach(a => {
      a.addEventListener('click', () => {
        if (sidebar && sidebar.classList.contains('is-open')) setDrawer(false);
      });
    });

    /* ScrollSpy via IntersectionObserver on .p602-sec[id] */
    const sections = [...document.querySelectorAll('.p602-sec[id]')];
    if (sections.length && tocLinks.length) {
      let activeId = sections[0].id;
      const visibleSet = new Set();

      const applyActive = id => {
        if (!id) return;
        activeId = id;
        tocLinks.forEach(a => {
          const on = linkIdOf(a) === activeId;
          a.classList.toggle('is-active', on);
          if (on) a.setAttribute('aria-current', 'location');
          else a.removeAttribute('aria-current');
        });
      };

      const pickCurrentSection = () => {
        const liveSections = sections.filter(s => s.offsetParent !== null);
        if (!liveSections.length) return;
        let chosen = '';
        for (const sec of liveSections) {
          if (sec.getBoundingClientRect().top <= 148) {
            chosen = sec.id;
          }
        }
        if (!chosen) {
          const firstVis = liveSections.find(s => visibleSet.has(s.id));
          chosen = firstVis ? firstVis.id : liveSections[0].id;
        }
        applyActive(chosen);
      };

      const spy = new IntersectionObserver(
        entries => {
          entries.forEach(en => {
            if (en.isIntersecting) visibleSet.add(en.target.id);
            else visibleSet.delete(en.target.id);
          });
          pickCurrentSection();
        },
        { rootMargin: '-110px 0px -55% 0px', threshold: [0, 0.1] }
      );
      sections.forEach(s => spy.observe(s));

      let scrollRaf = 0;
      addEventListener(
        'scroll',
        () => {
          if (!scrollRaf) {
            scrollRaf = requestAnimationFrame(() => {
              scrollRaf = 0;
              pickCurrentSection();
            });
          }
        },
        { passive: true }
      );
      pickCurrentSection();
    }

    /* Live TOC Filter */
    if (filterInput) {
      const entries = tocLinks.map(a => {
        const id = linkIdOf(a);
        const item = a.closest('li') || a;
        const sec = id ? document.getElementById(id) : null;
        const headings = sec
          ? [...sec.querySelectorAll('.p602-h1, .p602-h2, .p602-h3, h1, h2, h3')]
              .map(h => h.textContent)
              .join(' ')
          : '';
        const corpus = [
          id,
          a.textContent,
          a.dataset.keywords || '',
          item.dataset ? item.dataset.keywords || '' : '',
          sec && sec.dataset ? sec.dataset.keywords || '' : '',
          headings
        ]
          .join(' ')
          .toLowerCase();
        return { a, item, corpus };
      });

      const tocRoot = sidebar ? sidebar.querySelector('.p602-toc') || sidebar : document.body;
      let emptyEl = tocRoot.querySelector('.p602-toc-empty');
      if (!emptyEl && tocRoot !== document.body) {
        emptyEl = document.createElement('p');
        emptyEl.className = 'p602-toc-empty';
        emptyEl.hidden = true;
        tocRoot.appendChild(emptyEl);
      }

      const updateFilterLabels = () => {
        filterInput.placeholder = L(
          'Filter sections…',
          '섹션·키워드 검색…',
          'セクションを検索…'
        );
        filterInput.setAttribute(
          'aria-label',
          L('Filter documentation sections', '문서 섹션 검색', 'ドキュメントのセクションを絞り込む')
        );
        if (emptyEl) {
          emptyEl.textContent = L('No matching sections.', '일치하는 섹션이 없습니다.', '一致するセクションがありません。');
        }
      };

      const runFilter = () => {
        const q = filterInput.value.trim().toLowerCase();
        const tokens = q ? q.split(/\s+/) : [];
        let shownCount = 0;
        entries.forEach(({ item, corpus }) => {
          const hit = !tokens.length || tokens.every(t => corpus.includes(t));
          item.hidden = !hit;
          if (hit) shownCount++;
        });
        /* Hide group lists/headings whose items are all filtered out */
        if (tocRoot !== document.body) {
          tocRoot.querySelectorAll('ol, ul').forEach(list => {
            const lis = [...list.children].filter(el => el.tagName === 'LI');
            if (!lis.length) return;
            const anyVisible = lis.some(li => !li.hidden);
            list.hidden = !anyVisible;
            const prev = list.previousElementSibling;
            if (prev && /^H[2-4]$/.test(prev.tagName)) prev.hidden = !anyVisible;
          });
        }
        if (emptyEl) emptyEl.hidden = shownCount > 0;
      };

      filterInput.addEventListener('input', runFilter);
      onLangChange.push(updateFilterLabels);
      updateFilterLabels();
    }
  }

  /* ---------- 4. Observe <html lang> Mutations ---------- */
  new MutationObserver(() => {
    onLangChange.forEach(fn => fn());
  }).observe(htmlEl, { attributes: true, attributeFilter: ['lang'] });
})();
