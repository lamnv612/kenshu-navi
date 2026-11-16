/* 基礎文法・データ型を、時間割のマス（11:00 / 13-14時 / 15-16時）に合わせて3つのレッスンに分ける */
(function () {
  const K = window.KENSHU;
  const L = K && K.lessons && K.lessons['ts-basic']; if (!L) return;
  const take = (ts) => ts.map((t) => L.scenes.find((s) => s.t === t)).filter(Boolean);
  const A = take(['基礎文法の公式', '型アノテーションの読み方']);
  const B = take(['型の箱に値を入れよう', 'const / let と型推論', '型推論：どこまで書く？']);
  const C = take(['配列・タプル・オブジェクト', 'any と unknown', '値がない型：void / undefined / null', '実践：型エラーを全部直そう']);
  if (!A.length || !B.length || !C.length) return;
  const drills = (K.drills && K.drills['ts-basic']) || {};
  const give = (id, scenes) => { K.drills = K.drills || {}; K.drills[id] = K.drills[id] || {}; scenes.forEach((s) => { if (drills[s.t]) K.drills[id][s.t] = drills[s.t]; }); };
  L.scenes = A; L.title = '基礎文法'; L.sub = '宣言の公式'; give('ts-basic', A);
  K.reg({ id: 'ts-basic2', track: 'ts', title: '基礎文法：型の指定', sub: '型の指定', emoji: '📘', scenes: B }); give('ts-basic2', B);
  K.reg({ id: 'ts-data', track: 'ts', title: 'データ型', sub: '配列・タプル・Object', emoji: '🧩', scenes: C }); give('ts-data', C);
  // 実践テストはデータ型のレッスンへ
  if (K.tests && K.tests['ts-basic']) { K.tests['ts-data'] = K.tests['ts-basic']; delete K.tests['ts-basic']; }
  // 補足（任意）は「データ型」のあとへ
  Object.values(K.lessons).forEach((l) => { if (l.meta && l.meta.after === 'ts-basic' && /^x-ts-narrow$/.test(l.id)) l.meta.after = 'ts-data'; });
  // 練習ファイル（スライド連動）も付け替え
  (window.KENSHU_PRACTICE || []).forEach((p) => { if (p.lesson === 'ts-basic') p.lesson = 'ts-data'; });

  /* ---- 型の構文 / インタフェース / Type：3つのマスを3つのレッスンに ---- */
  (function () {
    const T = K.lessons['ts-types']; if (!T) return;
    const tk = (ts) => ts.map((t) => T.scenes.find((s) => s.t === t)).filter(Boolean);
    const U = tk(['Union：どれか1つ', 'Enum：名前の付いた定数']);
    const I = tk(['interface：形チェッカー', 'extends と merge']);
    const A = tk(['interface vs type', '実践：型を設計しよう']);
    if (!U.length || !I.length || !A.length) return;
    const dr = (K.drills && K.drills['ts-types']) || {};
    const gv = (id, sc) => { K.drills = K.drills || {}; K.drills[id] = K.drills[id] || {}; sc.forEach((s) => { if (dr[s.t]) K.drills[id][s.t] = dr[s.t]; }); };
    T.scenes = U; T.title = '型の構文'; T.sub = 'Union / Enum'; gv('ts-types', U);
    K.reg({ id: 'ts-interface', track: 'ts', title: 'インタフェース', sub: 'interface', emoji: '📐', scenes: I }); gv('ts-interface', I);
    K.reg({ id: 'ts-alias', track: 'ts', title: 'Type：型エイリアス', sub: 'interface との比較', emoji: '🏷️', scenes: A }); gv('ts-alias', A);
    if (K.tests && K.tests['ts-types']) { K.tests['ts-alias'] = K.tests['ts-types']; delete K.tests['ts-types']; }
    Object.values(K.lessons).forEach((l) => { if (l.meta && l.meta.after === 'ts-types') l.meta.after = 'ts-alias'; });
    (window.KENSHU_PRACTICE || []).forEach((p) => { if (p.lesson === 'ts-types') p.lesson = (p.scene === 'extends と merge') ? 'ts-interface' : (p.scene === 'Enum：名前の付いた定数') ? 'ts-types' : 'ts-alias'; });
  })();
})();
