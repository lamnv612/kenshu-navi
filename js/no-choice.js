/* 選択式のクイズは出さない（実践は各シーンの「練習」アイコンへ）。戻すときは ON を false に。 */
(function () {
  const K = window.KENSHU, ON = true;
  if (!ON) return;
  /* 選択式だけで出来ているシーンは丸ごと隠す */
  const DROP = {
    'vue-test': ['確認クイズ'], idea: ['広げる？ 絞る？ どっち？'], dev: ['進め方の判断'], prep: ['資料と本番の判断'], demo: ['発表を聞く側の判断'], qa: ['質問の仕方'],
    'x-terminal': ['どれを使う？：ターミナル編'], 'x-vscode': ['どのツールを使う？'], 'x-bem': ['命名の使い分け'], 'x-css-plus': ['どれを選ぶ？：CSS 編'], 'x-a11y': ['どれが正しい？', 'コントラストと色覚', 'キーボードだけで操作'],
    'x-vue-state': ['使い分けクイズ'], 'x-vue-render': ['方式えらびクイズ'],
  };
  Object.entries(DROP).forEach(([id, ts]) => { const L = K.lessons[id]; if (L) L.scenes = L.scenes.filter((sc) => !ts.includes(sc.t)); });
  /* シーンの中に混ざった選択式クイズ（と、空になった枠・見出し）を取り除く */
  const EMPTY_OK = (n) => { for (const c of n.children) { if (!c.classList.contains('label') && !/^H[1-6]$/.test(c.tagName)) return false; } return !n.querySelector('p,pre,svg,canvas,table,ul,ol,img') && !(n.childNodes.length && [...n.childNodes].some((x) => x.nodeType === 3 && x.nodeValue.trim())); };
  K.stripChoiceQuiz = function (root) {
    root.querySelectorAll('.quiz').forEach((q) => {
      let p = q.parentElement; q.remove();
      while (p && p !== root && EMPTY_OK(p)) { const up = p.parentElement; p.remove(); p = up; }
    });
  };
})();
