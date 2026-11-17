/* 登録された解剖図を、各シーンの先頭に差し込む（最後に読み込む） */
(function () {
  const K = window.KENSHU;
  if (!K || !K.tsAnatBuild) return;
  Object.values(K.lessons || {}).forEach((L) => {
    (L.scenes || []).forEach((sc) => {
      const spec = K.tsAnatSpecs[sc.t];
      if (!spec || sc.__anat || !sc.render) return;
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
