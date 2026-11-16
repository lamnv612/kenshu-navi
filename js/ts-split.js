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
})();
