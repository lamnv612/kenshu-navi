/* 登録された解剖図を、各シーンの先頭へ差し込む（最後に読み込む）。SKIP に入れたシーンだけ出さない。 */
(function () {
  const K = window.KENSHU;
  if (!K || !K.tsAnatBuild) return;
  /* 解剖図を出さないシーン（概念の説明だけ・すでに別の図解がある・構文の部品が無い） */
  const SKIP = new Set([
    'そのバグ、どこで見つかる？',
    'TS は JS に変換される',
    'interface vs type',
    'テストの種類',
    'ユニットテストの流れ',
    '4つの書き方',
    '名前をつけよう',
  ]);
  Object.values(K.lessons || {}).forEach((L) => {
    (L.scenes || []).forEach((sc) => {
      const spec = K.tsAnatSpecs[sc.t];
      if (!spec || SKIP.has(sc.t) || sc.__anat || !sc.render) return;
      sc.__anat = true;
      const orig = sc.render;
      sc.render = function (el, ...rest) {
        const r = orig.call(this, el, ...rest);
        el.prepend(K.tsAnatBuild(spec));
        return r;
      };
    });
  });
})();
