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
    const I = tk(['interface：形チェッカー', 'extends と merge', 'interface vs type', '実践：型を設計しよう']);
    const A = tk(['type：型に名前をつける']);
    if (!U.length || !I.length || !A.length) return;
    const dr = (K.drills && K.drills['ts-types']) || {};
    const gv = (id, sc) => { K.drills = K.drills || {}; K.drills[id] = K.drills[id] || {}; sc.forEach((s) => { if (dr[s.t]) K.drills[id][s.t] = dr[s.t]; }); };
    T.scenes = U; T.title = '型の構文'; T.sub = 'Union / Enum'; gv('ts-types', U);
    K.reg({ id: 'ts-interface', track: 'ts', title: 'インタフェース', sub: 'interface ＋ type との比較', emoji: '📐', scenes: I }); gv('ts-interface', I);
    K.reg({ id: 'ts-alias', track: 'ts', title: 'Type：型エイリアス', sub: '型に名前をつける', emoji: '🏷️', scenes: A }); gv('ts-alias', A);
    if (K.tests && K.tests['ts-types']) { K.tests['ts-interface'] = K.tests['ts-types']; delete K.tests['ts-types']; }
    Object.values(K.lessons).forEach((l) => { if (l.meta && l.meta.after === 'ts-types') l.meta.after = 'ts-interface'; });
    (window.KENSHU_PRACTICE || []).forEach((p) => { if (p.lesson === 'ts-types') p.lesson = (p.scene === 'Enum：名前の付いた定数') ? 'ts-types' : (p.scene === 'type：型に名前をつける') ? 'ts-alias' : 'ts-interface'; });
  })();

  /* ---- クラス：今日の最後の1時間（設計図・アクセス修飾子）と翌日（getter・継承・実践）に分ける ---- */
  (function () {
    const C = K.lessons['ts-class']; if (!C) return;
    const ck = (ts) => ts.map((t) => C.scenes.find((s) => s.t === t)).filter(Boolean);
    const P1 = ck(['クラス = 設計図、new = スタンプ', 'アクセス修飾子：誰が触れる？', 'readonly：書き換え禁止']);
    const P2 = C.scenes.filter((s) => !P1.includes(s));
    if (!P1.length || !P2.length) return;
    const dr = (K.drills && K.drills['ts-class']) || {};
    const gv = (id, sc) => { K.drills = K.drills || {}; K.drills[id] = K.drills[id] || {}; sc.forEach((s) => { if (dr[s.t]) K.drills[id][s.t] = dr[s.t]; }); };
    C.scenes = P1; C.title = 'クラス ①'; C.sub = '設計図・アクセス修飾子'; gv('ts-class', P1);
    K.reg({ id: 'ts-class2', track: 'ts', title: 'クラス ②', sub: 'getter・継承・実践', emoji: '🏭', scenes: P2 }); gv('ts-class2', P2);
    if (K.tests && K.tests['ts-class']) { K.tests['ts-class2'] = K.tests['ts-class']; delete K.tests['ts-class']; }
    (window.KENSHU_PRACTICE || []).forEach((p) => { if (p.lesson === 'ts-class' && p.scene && !P1.some((s) => s.t === p.scene)) p.lesson = 'ts-class2'; });
  })();
})();
