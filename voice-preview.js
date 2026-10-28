/* Scheherazade voice feature illustration. */
(() => {
  const assets = new URL('assets/', document.currentScript.src);
  const copy = {
    en: {
      title: 'Same Sera.\nJust say it out loud.',
      lead: 'Typing is a hassle? Talk it through with Sera, speak a message, or listen to her reply while you get on with something else.',
      labels: ['Call', 'Voice input', 'Read aloud'],
      hints: ['Talk it through', 'Say it instead of type it', 'Listen while you work'],
      choose: 'Explore the three voice features',
      note: 'Illustrative view',
      modes: ['Voice call', 'Voice input', 'Read aloud'],
      sampleLabels: ['Talk it through', 'Say what’s on your mind', 'Hear the reply'],
      samples: ['“Can we talk through the next step?”', '“Put the next step into a checklist.”', '“Here is the checklist for your next step.”'],
      captions: ['Talk with Sera', 'Speak a chat message', 'Listen to Sera’s reply'],
      details: [
        ['Ask the way you would ask a friend.', 'Tap the phone button above the chat, or invite Sera into a Discord voice channel. Ask out loud instead of typing, and talk through what comes next together.'],
        ['A thought comes to mind. Say it.', 'Say what you want to put in the chat. Sera turns your words into a message, without your having to type it all out.'],
        ['Keep your eyes on what you’re doing.', 'Listen to Sera’s replies while you carry on. Keep the little companion nearby to see and hear her answers without switching back to the chat.']
      ],
      setup: 'Voice input and read-aloud use Korean. Download voice files once to get started; some call options need an account connection and internet.'    },
    ko: {
      title: '늘 대화하던 세라,\n이제 말로 불러보세요.',
      lead: '타자가 번거로우면 친구에게 말하듯 툭 건네보세요. 통화로 함께 얘기하고, 말로 메시지를 쓰고, 하던 일을 이어가며 답변을 들을 수 있어요.',
      labels: ['통화하기', '음성 입력', '읽어주기'],
      hints: ['친구에게 전화하듯', '타이핑 대신 말로', '하던 일을 하면서 듣기'],
      choose: '세 가지 음성 기능 살펴보기',
      note: '화면 예시',
      modes: ['음성 통화', '음성 입력', '읽어주기'],
      sampleLabels: ['말로 함께 정리하기', '생각난 말 그대로', '세라의 답변 듣기'],
      samples: ['“다음 단계, 같이 얘기해 볼까?”', '“다음 단계를 체크리스트로 정리해줘.”', '“다음 단계 체크리스트를 정리했어.”'],
      captions: ['세라와 음성으로 대화하기', '말로 채팅 메시지 쓰기', '세라의 답변 소리로 듣기'],
      details: [
        ['친구에게 전화하듯, 편하게 물어보세요.', '채팅 위 전화 버튼을 누르거나 Discord 음성 채널에 세라를 초대해 보세요. 타이핑 대신 말로 물어보고, 함께 다음 일을 정리해 보세요.'],
        ['생각난 말을, 길게 타이핑할 필요 없이.', '채팅창에 쓰고 싶은 말을 그대로 건네보세요. 길게 타이핑하지 않아도 메시지로 옮겨줘요.'],
        ['눈은 하던 일에, 귀는 세라에게.', '답변을 들으며 하던 일을 이어가세요. 작은 컴패니언을 곁에 띄워두면, 채팅창으로 돌아오지 않고도 세라의 답변을 보고 들을 수 있어요.']
      ],
      setup: '음성 입력과 읽어주기는 한국어를 지원해요. 처음 사용할 때 음성 파일을 한 번 내려받아요. 통화 방식에 따라 계정 연결과 인터넷이 필요해요.'    },
    ja: {
      title: 'いつものセラに、\n声をかけてみてください。',
      lead: '文字を打つのが面倒なら、友だちに話すようにひと言。通話で相談したり、声でメッセージを書いたり、作業を続けながら返事を聞いたりできます。',
      labels: ['通話する', '音声入力', '読み上げ'],
      hints: ['友だちに電話するように', '入力する代わりに話す', '作業をしながら聞く'],
      choose: '3つの音声機能を見る',
      note: '画面イメージ',
      modes: ['音声通話', '音声入力', '読み上げ'],
      sampleLabels: ['声で一緒に考える', '思いついた言葉をそのまま', 'セラの返事を聞く'],
      samples: ['「次のステップ、一緒に話してみようか」', '「次のステップをチェックリストにして」', '「次のステップのチェックリストをまとめたよ」'],
      captions: ['セラと音声で話す', '声でチャットのメッセージを書く', 'セラの返事を声で聞く'],
      details: [
        ['友だちに電話するように、気軽に。', 'チャット上部の電話ボタンを押すか、Discordのボイスチャンネルにセラを招待してみてください。文字を打つ代わりに声をかけて、次にやることを一緒に考えられます。'],
        ['思いついたことを、長く打ち込まなくても。', 'チャットに書きたいことを、そのまま話してみてください。長く打ち込まなくても、話した言葉をメッセージにしてくれます。'],
        ['目は作業に。耳はセラに。', '返事を聞きながら、作業を続けられます。小さなコンパニオンをそばに置けば、チャットに戻らずにセラの返事を見たり、声で聞いたりできます。']
      ],
      setup: '音声入力と読み上げは韓国語に対応しています。初回に音声ファイルをダウンロードします。通話方式によってはアカウントの接続とインターネットが必要です。'    }
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
