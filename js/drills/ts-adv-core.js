/* TypeScript の各練習に「上級（level 3）」を足すための道具。
   K.drillAdv('シーン名', { label, hint, starter, solution, ok })
   - label    : ミッション文（1行）
   - hint     : ヒントの配列（短い文を1〜3個）
   - starter  : 練習の最初のコードの末尾に足す文字列（上級用の足場。コメントで「③ 上級：ここに書く」など）
   - solution : 「答えを見る」の最後に足す文字列（starter に対する答え）
   - ok       : (s, c, raw) => boolean   s はコメントを消したコード、c = { errors, logs }
   同じシーン名が複数のレッスンにあっても、1回だけ足される。 */
(function () {
  const K = window.KENSHU;
  const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  K.drillAdv = function (title, e) {
    Object.values(K.drills || {}).forEach((L) => {
      const d = L && L[title];
      if (!d || d.__adv) return;
      d.__adv = true;
      const old = d.tasks;
      d.tasks = (v, c) => {
        const base = old(v, c);
        const raw = (v['main.ts'] || '');
        return base.concat([{ level: 3, label: e.label, hint: e.hint || [], ok: !!e.ok(strip(raw), c || { errors: [], logs: [] }, raw) }]);
      };
      if (e.starter) d.files[0].code += e.starter;
      if (e.solution) d.solution += e.solution;
    });
  };
})();
