/* Scheherazade voice feature illustration. */
(() => {
  const assets = new URL('assets/', document.currentScript.src);
  const copy = {
    en: {
      title: 'Tired of typing today?\nJust call her out loud.',
      lead: 'Talk with her three ways, like calling out to a friend at the next desk: Call to chat and brainstorm in the app or a Discord voice room, Voice input to toss out thoughts without touching the keyboard, and Read aloud to keep your eyes on your work while listening to her reply from a small companion window.',
      labels: ['Call', 'Voice input', 'Read aloud'],
      hints: ['In-app or Discord voice', 'Speak instead of typing', 'Eyes on your work, ears on Sera'],
      choose: 'Explore the three voice features',
      note: 'Illustrative view',
      modes: ['Voice call', 'Voice input', 'Read aloud'],
      sampleLabels: ['Brainstorm out loud', 'Say what’s on your mind', 'Hear Sera’s reply'],
      samples: ['“Want to bounce around that idea from yesterday out loud?”', '“Pull out just the three key lines from the notes I was looking at.”', '“All done with your three-line summary! Keep your screen up, I’ll read it out to you.”'],
      captions: ['Talk with Sera', 'Speak a chat message', 'Listen to Sera’s reply'],
      details: [
        ['Chat and brainstorm in the app or a Discord voice room.', 'Tap the phone button in the app or call Sera into a Discord voice channel to talk through ideas out loud instead of typing.'],
        ['Toss out thoughts as they come to mind.', 'Say what you want to send and Sera turns your spoken words straight into a clean message.'],
        ['Keep your eyes on your work while listening to her voice.', 'Leave the small companion window beside your work and hear Sera’s reply without switching screens.']
      ],
      setup: 'Voice input and read-aloud support Korean and download voice files once on first use. Depending on the call mode, an account connection and internet are required.'    },
    ko: {
      title: '타자 치기 귀찮은 날엔,\n그냥 말로 편하게 부르세요.',
      lead: '옆자리 단짝에게 말 걸듯 세 가지 방식으로 목소리를 섞을 수 있습니다. 앱이나 Discord 음성방에서 수다 떨듯 상의하는 ‘통화하기’, 생각나는 대로 말로 툭 던지는 ‘음성 입력’, 내 작업 화면을 보면서 작은 컴패니언 창으로 세라의 목소리를 듣는 ‘읽어주기’입니다.',
      labels: ['통화하기', '음성 입력', '읽어주기'],
      hints: ['앱 · Discord 음성방 대화', '생각나는 대로 말로 던지기', '눈은 화면에, 귀는 세라에게'],
      choose: '세 가지 음성 기능 살펴보기',
      note: '화면 예시',
      modes: ['음성 통화', '음성 입력', '읽어주기'],
      sampleLabels: ['목소리로 편하게 상의하기', '생각난 말 그대로 던지기', '세라의 목소리로 답 듣기'],
      samples: ['“어제 말한 그 아이디어, 지금 목소리로 같이 굴려 볼래?”', '“아까 보던 자료 중에서 핵심만 세 줄로 추려 줘.”', '“부탁한 세 줄 요약 다 끝났어! 화면 안 바꿔도 내가 읽어 줄게.”'],
      captions: ['세라와 음성으로 대화하기', '말로 채팅 메시지 쓰기', '세라의 답변 소리로 듣기'],
      details: [
        ['앱이나 Discord 음성방에서 수다 떨듯 상의합니다.', '채팅창 위 전화 버튼을 누르거나 Discord 음성 채널에 세라를 불러, 타자 치는 대신 목소리로 아이디어를 굴리고 할 일을 함께 정리합니다.'],
        ['생각나는 대로 말로 툭 던져 보냅니다.', '채팅창에 적고 싶은 말을 그대로 소리 내어 건네면 키보드에 손대지 않아도 깔끔한 메시지로 옮겨 줍니다.'],
        ['내 화면을 본 채로 세라의 목소리를 듣습니다.', '작은 컴패니언 창을 곁에 띄워 두고, 하던 작업이나 게임을 멈추지 않은 채 세라의 답을 귀로 편하게 들을 수 있습니다.']
      ],
      setup: '음성 입력과 읽어주기는 한국어를 지원하며 처음 한 번 음성 파일을 받습니다. 통화 방식에 따라 계정 연결과 인터넷이 필요합니다.'
    },
    ja: {
      title: 'タイピングが面倒な日は、\nそのまま声で気軽に呼んでください。',
      lead: '隣の相棒に話しかけるように3つの方法で声を交わせます。アプリや Discord のボイス部屋でおしゃべり感覚で相談する「通話する」、思いついたまま声で投げる「音声入力」、作業画面を見たまま小さなコンパニオン窓でセラの声を聞く「読み上げ」です。',
      labels: ['通話する', '音声入力', '読み上げ'],
      hints: ['アプリ・Discord 通話', '入力の代わりに声で', '目は作業に、耳はセラに'],
      choose: '3つの音声機能を見る',
      note: '画面イメージ',
      modes: ['音声通話', '音声入力', '読み上げ'],
      sampleLabels: ['声で気軽に相談する', '思いついた言葉をそのまま', 'セラの声で返事を聞く'],
      samples: ['「昨日話してたあのアイデア、今声で一緒に転がしてみない？」', '「さっき見てた資料から要点だけ3行で抜いて」', '「頼まれた3行要約できたよ！画面はそのままで私が読み上げるね」'],
      captions: ['セラと音声で話す', '声でチャットのメッセージを書く', 'セラの返事を声で聞く'],
      details: [
        ['アプリや Discord のボイス部屋で気軽に相談。', 'チャット上部の電話ボタンを押すか Discord のボイスチャンネルに呼んで、文字を打つ代わりに声でアイデアを転がせます。'],
        ['思いついたまま声で投げます。', '送りたい言葉をそのまま口に出せば、キーボードに触れずにメッセージへ書き起こします。'],
        ['自分の画面を見たままセラの声を聞きます。', '小さなコンパニオン窓を横に置いたまま、画面を切り替えずにセラの返事を耳で聞けます。']
      ],
      setup: '音声入力と読み上げは韓国語に対応しており、初回のみ音声ファイルをダウンロードします。通話方式によってはアカウント接続とインターネットが必要です。'    }
  };
  const glyphs = [
    '<path d="M7 3 4 5c-2 5 5 13 10 15l3-3-4-4-2 2c-3-1-5-3-6-6l2-2Z"/>',
    '<rect x="8" y="2" width="8" height="13" rx="4"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8"/>',
    '<path d="m4 9 4 0 5-4v14l-5-4H4ZM17 8a6 6 0 0 1 0 8M20 5a10 10 0 0 1 0 14"/>'
  ];
  const icon = k => `<svg viewBox="0 0 24 24" aria-hidden="true">${glyphs[k]}</svg>`;
  const choices = new WeakMap();
  const language = lang => copy[lang] || copy.en;
  const choiceOf = sec => choices.get(sec) || 0;
  const paintChoice = (sec, lang) => {
    const c = language(lang), choice = choiceOf(sec);
    sec.querySelectorAll('[data-voice-choice]').forEach((b, k) => b.setAttribute('aria-pressed', String(choice === k)));
    sec.querySelector('.voice-detail h3').textContent = c.details[choice][0];
    sec.querySelector('.voice-detail p').textContent = c.details[choice][1];
    sec.dataset.voiceExample = ['call', 'input', 'read'][choice];
    labelVisual(sec.querySelector('.voiceviz'), lang);
  };
  function labelVisual(figure, lang) {
    const c = language(lang), choice = choiceOf(figure.closest('.prod'));
    figure.setAttribute('aria-label', c.captions[choice]);
    figure.querySelector('.voice-mode').textContent = c.modes[choice];
    figure.querySelector('.voice-example small').textContent = c.sampleLabels[choice];
    figure.querySelector('.voice-example p').textContent = c.samples[choice];
    figure.querySelector('figcaption').textContent = c.note;
  }
  window.CHOAMVoice = {
    extend(p) {
      const index = p.panels.length;
      p.panels.push({ kind: 'voice' });
      p.art.push(index);
      [p.description, p.ko.description, p.ja.description].forEach(rows => rows.push([]));
    },
    visual(on, index) {
      return `<figure class="media vis voiceviz${on}" data-art="${index}">
        <div class="voice-call">
          <div class="voice-orbit"><img src="${new URL('scheherazade-256.png', assets)}" alt="" width="112" height="112"></div>
          <p class="voice-name">Sera</p><p class="voice-mode"></p>
          <div class="voice-wave" aria-hidden="true">${[10, 20, 14, 32, 46, 26, 16, 34, 50, 38, 18, 28, 42, 22, 12, 24, 14].map(h => `<i style="--bar:${h}px"></i>`).join('')}</div>
          <div class="voice-example"><small></small><p></p></div>
          <div class="voice-illustrated-controls" aria-hidden="true"><span>${icon(1)}</span><span class="voice-hangup">${icon(0)}</span><span>${icon(2)}</span></div>
        </div><figcaption></figcaption>
      </figure>`;
    },
    labelSlide(slide, sec, lang) {
      const c = language(lang);
      slide.classList.add('voice-slide');
      slide.innerHTML = `<p class="display voice-title"></p><p class="voice-lead"></p>
        <div class="voice-choices" role="group">${[0, 1, 2].map(k => `<button type="button" data-voice-choice="${k}" aria-controls="voice-detail"><span class="voice-choice-icon">${icon(k)}</span><span data-voice-label="${k}"></span><small data-voice-hint="${k}"></small></button>`).join('')}</div>
        <div class="voice-detail" id="voice-detail" aria-live="polite"><h3></h3><p></p></div><p class="voice-setup"></p>`;
      slide.querySelector('.voice-title').textContent = c.title.replace('\n', ' ');
      slide.querySelector('.voice-lead').textContent = c.lead;
      slide.querySelector('.voice-setup').textContent = c.setup;
      slide.querySelector('.voice-choices').setAttribute('aria-label', c.choose);
      slide.querySelectorAll('[data-voice-choice]').forEach((button, k) => {
        button.querySelector('[data-voice-label]').textContent = c.labels[k];
        button.querySelector('[data-voice-hint]').textContent = c.hints[k];
        button.addEventListener('click', () => { choices.set(sec, k); paintChoice(sec, document.documentElement.lang); });
      });
      paintChoice(sec, lang);
    },
    labelVisual
  };
})();
