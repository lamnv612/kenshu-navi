/* 各レッスンの実践テスト（アイコンから開く）。
   データは js/tests/*.js → KENSHU.tests[lessonId] = { mode:'web'|'ts'|'text', files, libs, note, height, solution, tasks:(vals,ctx)=>[{label, ok, level:1|2|3, hint, answer}] } */
(function () {
  const K = window.KENSHU, W = K.W, h = W.h, I = W.icon;
  K.tests = K.tests || {};

  const done = (id) => ((W.store.get('tests', {}) || {})[id] || {}).d;
  function save(id) { const all = W.store.get('tests', {}) || {}; all[id] = { d: 1 }; W.store.set('tests', all); }
  K.testOf = (id) => (K.tests[id] && K.tests[id].tasks && !(K.lessons[id] && K.lessons[id].noTest) ? K.tests[id] : null);

  K.openTest = function (id) {
    const L = K.lessons[id], T = K.testOf(id);
    if (!L || !T) return null;
    const holder = { m: null };
    const pg = W.playground(Object.assign({}, T, {
      title: '最終チャレンジ',
      onDone() { save(id); K.refreshTestBadges && K.refreshTestBadges(); },
    }));
    holder.m = W.modal({ title: L.title + ' ・ 最終チャレンジ', icon: 'trophy', wide: true, content: pg });
    return holder.m;
  };

  /* シーンごとの練習: KENSHU.drills[lessonId][シーン名] = spec（tests と同じ形式） */
  K.drills = K.drills || {};
  const drillDone = (id, t) => (((W.store.get('drills', {}) || {})[id] || {})[t] || 0);
  K.drillOf = (id, t) => (K.drills[id] && K.drills[id][t] && K.drills[id][t].tasks) || null ? K.drills[id][t] : null;
  K.openDrill = function (id, t) {
    const L = K.lessons[id], D = K.drillOf(id, t);
    if (!L || !D) return null;
    const pg = W.playground(Object.assign({}, D, {
      title: 'この回の練習',
      onDone() { const all = W.store.get('drills', {}) || {}; (all[id] ||= {})[t] = 1; W.store.set('drills', all); K.refreshTestBadges && K.refreshTestBadges(); },
    }));
    return W.modal({ title: t + ' ・ 練習', icon: 'dumbbell', wide: true, content: pg });
  };
  K.drillButton = function (id, t) {
    if (!K.drillOf(id, t)) return null;
    const b = h('button', { class: 'tool-ico', 'data-tip': 'この回の練習（コードを書いて確かめる）', 'aria-label': 'この回の練習', onclick: () => K.openDrill(id, t) }, I('dumbbell'));
    const sync = () => b.classList.toggle('tst-done', !!drillDone(id, t));
    sync(); b.__sync = sync;
    return b;
  };

  /* アイコンボタン（最終チャレンジ） */
  K.testButton = function (id, cls) {
    if (!K.testOf(id)) return null;
    const b = h('button', { class: cls || 'tool-ico', 'data-tip': '最終チャレンジ（このレッスンの総まとめ）', 'aria-label': '最終チャレンジ', onclick: () => K.openTest(id) }, I('trophy'));
    const sync = () => b.classList.toggle('tst-done', !!done(id));
    sync(); b.__sync = sync;
    return b;
  };
  K.refreshTestBadges = () => document.querySelectorAll('[aria-label="最終チャレンジ"],[aria-label="この回の練習"]').forEach((b) => b.__sync && b.__sync());
})();
