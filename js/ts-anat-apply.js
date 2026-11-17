/* 登録された解剖図のうち、「構文が複数のパーツでできていて、初めて見る」シーンにだけ、先頭へ差し込む（最後に読み込む）。
   すでに図解や公式がある・概念の説明だけ・書き方が単純なシーンは対象外。
   増やしたい時は KEEP にシーン名を足す（データは ts-anat-*.js に全部ある）。 */
(function () {
  const K = window.KENSHU;
  if (!K || !K.tsAnatBuild) return;
  const KEEP = new Set([
    '型アノテーションの読み方',
    'interface：形チェッカー',
    'type：型に名前をつける',
    'クラス = 設計図、new = スタンプ',
    'アクセス修飾子：誰が触れる？',
    'getter / setter：門番を置く',
    'super()：親を呼ぶ',
    'Box<T> マシン',
    'identity<T>：入れた型が出てくる',
    '?. と ??',
    'describe / it / expect 早見表',
  ]);
  Object.values(K.lessons || {}).forEach((L) => {
    (L.scenes || []).forEach((sc) => {
      const spec = K.tsAnatSpecs[sc.t];
      if (!spec || !KEEP.has(sc.t) || sc.__anat || !sc.render) return;
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
