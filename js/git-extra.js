/* 本編から外して「補足（任意）」へ移すシーン。元に戻すときは該当の scenes を [] にする */
(function () {
  const K = window.KENSHU;
  if (!K || !K.lessons || !K.reg) return;
  const MOVES = [
    { from: 'git', id: 'x-git-scenarios', scenes: ['コンフリクトを解決しよう', 'レビュー指摘に対応', '作業を一時退避：stash', '履歴を調べる', 'リリースとタグ'],   // 実践（Git）で使う「ミスを取り消す」は本編に残す。stash は任意へ
      title: '任意：Git 実践シナリオ', sub: '現場で必ず起きる場面と、その対処', emoji: '🧭',
      meta: { cat: 'basic', day: '1日目', when: 'Git 実習のあと、余った時間や、現場で困ったときに', mins: 15, order: 13.5, level: '応用', after: 'git', why: '衝突・レビュー対応・取り消し・退避・履歴調べ・リリースは、現場で毎週起きる。慌てず直せるようになる' } },
    { from: 'html', id: 'x-html-deep', scenes: ['HTML は「木」'],   // 実践（HTML）で nav を使うので「なぜ意味のあるタグ？」は本編に残す
      
      title: '任意：DOM ツリー', sub: 'DOM ツリー（ブラウザが見ている木）', emoji: '🔍',
      meta: { cat: 'basic', day: '1日目', when: 'HTML 実習のあと、時間が余ったとき', mins: 10, order: 10.5, level: '応用', after: 'html', why: 'ブラウザが見ている「木」を知ると、CSS・JS・SEO・読み上げのどれも理解しやすくなる' } },
    { from: 'css', id: 'x-css-optional', scenes: ['z-index：重なり順', 'Sass（プラスα）'],   // 実践（CSS）で flex を使うので Flexbox は本編に残す
      title: '任意：CSS をもう一歩深く', sub: 'z-index と Sass', emoji: '🎨',
      meta: { cat: 'basic', day: '1日目', when: 'CSS 実習のあと、時間が余ったとき', mins: 15, order: 14.5, level: '応用', after: 'css', why: '横並び・重なり・変数と入れ子は、実務の CSS でほぼ毎回使う。基本が固まったら挑戦' } },
  ];
  MOVES.forEach((m) => {
    const L = K.lessons[m.from]; if (!L) return;
    const moved = m.scenes.map((t) => L.scenes.find((s) => s.t === t)).filter(Boolean);
    if (!moved.length) return;
    L.scenes = L.scenes.filter((s) => !moved.includes(s));
    K.drills = K.drills || {}; K.drills[m.id] = K.drills[m.id] || {};
    moved.forEach((s) => { if (K.drills[m.from] && K.drills[m.from][s.t]) K.drills[m.id][s.t] = K.drills[m.from][s.t]; });   // 元の場所にも残す（検証用スクリプトとの互換）
    K.reg({ id: m.id, track: 'extra', title: m.title, sub: m.sub, emoji: m.emoji, meta: m.meta, scenes: moved });
  });
})();
