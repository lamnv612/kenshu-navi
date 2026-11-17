/* 登録された解剖図を、各シーンの「先頭（導入カードの直後）」に出す。導入ストーリー中でも見える。
   出したくないシーンは SKIP に名前を足す。 */
(function () {
  const K = window.KENSHU;
  if (!K || !K.tsAnatBuild) return;
  const SKIP = new Set(['.vue ファイルの解剖']);   // この解剖図は、シーンの中で自分で並べる
  K.anatFor = (title) => { const spec = K.tsAnatSpecs[title]; return spec && !SKIP.has(title) ? K.tsAnatBuild(spec) : null; };
})();
