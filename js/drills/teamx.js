/* この回の練習：チーム開発系 (idea / dev / prep / demo) + Vue 補足 (x-vue-*)
   KENSHU.drills[lessonId][シーン名] = { mode, files, note, solution, tasks } */
(function () {
  const D = (window.KENSHU.drills = window.KENSHU.drills || {});
  const VUE = 'https://unpkg.com/vue@3.4.27/dist/vue.global.prod.js';

  /* ---------- 共通ヘルパー ---------- */
  const lines = (s) => (s || '').split('\n').map((x) => x.trim()).filter((x) => x && !/^(#|\/\/)/.test(x));
  const noCmt = (s) => (s || '').replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
  const part = (L, name) => { for (const x of L) { const m = x.match(new RegExp('^' + name + '\\s*[｜|:：]\\s*(.*)$')); if (m) return m[1].trim(); } return null; };
  const filled = (v, n) => v != null && v.length >= (n || 2);
  const arrow = (L, key) => { for (const x of L) { const i = x.indexOf('→'); if (i > 0 && x.slice(0, i).includes(key)) return x.slice(i + 1).trim(); } return ''; };
  const idx = (L, re, from) => { for (let i = from || 0; i < L.length; i++) if (re.test(L[i])) return i; return -1; };
  const doc = (c) => (c && c.doc ? c.doc() : null);
  const q1 = (d, s) => (d ? d.querySelector(s) : null);
  const qa = (d, s) => (d ? [...d.querySelectorAll(s)] : []);
  const tx = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
  const win = (d) => (d && d.defaultView) || null;

  const text = (file, code, note, solution, tasks, height) => ({ mode: 'text', height: height || 230, files: [{ name: file, lang: file.endsWith('.js') ? 'js' : 'txt', code }], note, solution, tasks });
  const web = (js, solution, tasks, html) => ({
    mode: 'web', libs: [VUE], height: 330,
    files: [{ name: 'index.html', lang: 'html', code: html || '<div id="app"></div>' }, { name: 'main.js', lang: 'js', code: js }],
    solution: { 'main.js': solution }, tasks,
  });
  /* tasks 用: [level, label, ok関数, hint[], answer(全体) ] を整形 */
  const mk = (file, lang, sol, rows) => (vals, ctx) => rows.map(([level, label, ok, hint]) => {
    let r = false; try { r = !!ok(vals[file] || '', vals, ctx); } catch (e) { r = false; }
    return { level, label, ok: r, hint, answer: { code: sol, lang } };
  });

  /* ========================================================= idea */
  const SOL_BRAIN = '★スマホで学習を記録するアプリ\nチームの進み具合が見えるボード\n毎日の振り返りメモ\n質問をためておく箱\nクイズで復習できるアプリ\n学習時間をグラフにする\nバッジがもらえる連続日数\n友だちと進み具合を比べる\n今日やることを通知する\n分からない用語の辞書';
  const ideaBrain = text('ideas.txt', '# アイデアを1行に1つ書こう\n', '<b>ブレストのルール</b><br>・まず<b>数</b>を出す<br>・<b>否定しない</b>（「無理」は禁止）<br>・最後に、いちばん良い案の頭に <code>★</code> を1つだけ付ける', SOL_BRAIN,
    mk('ideas.txt', 'txt', SOL_BRAIN, [
      [1, 'アイデアを5つ以上、1行ずつ書く', (s) => lines(s).length >= 5, ['1行に1つ。質より量。', 'とにかく5つ書いてみよう。']],
      [2, '10個以上書く。「無理」「ダメ」「できない」は使わない', (s) => lines(s).length >= 10 && !lines(s).some((x) => /無理|ムリ|ダメ|だめ|できない|むり/.test(x)), ['広げる時間は否定しない。', '思いついたら、評価せずにどんどん足す。']],
      [3, 'いちばん良い案の頭に ★ を1つだけ付ける', (s) => lines(s).length >= 5 && lines(s).filter((x) => x.startsWith('★')).length === 1, ['絞る時間になったら、基準で1つ選ぶ。', '★ を付けるのは1行だけ。']],
    ]), 260);

  const SOL_CANVAS = 'Who｜新入社員（プログラミング初心者）\nProblem｜学んだことが続かず、成長が見えない\nSolution｜毎日の学習を記録して、成長をグラフで見せる\nFeatures｜ログ入力';
  const ideaCanvas = text('canvas.txt', '# 4つの箱を埋めよう（パート名｜内容）\nWho｜\nProblem｜\nSolution｜\nFeatures｜\n', '<b>アイデアキャンバス</b><br><code>Who</code> 誰の<br><code>Problem</code> 困りごと<br><code>Solution</code> 解決<br><code>Features</code> 機能（<b>最小の1つ</b>）', SOL_CANVAS,
    mk('canvas.txt', 'txt', SOL_CANVAS, [
      [1, '4つの箱（Who / Problem / Solution / Features）をすべて埋める', (s) => { const L = lines(s); return ['Who', 'Problem', 'Solution', 'Features'].every((k) => filled(part(L, k), 3)); }, ['「パート名｜内容」の形で、4行とも書く。']],
      [2, 'Features は「最小の1つ」だけにする（30文字以内、区切りなし）', (s) => { const L = lines(s); const f = part(L, 'Features'); return filled(f, 2) && f.length <= 30 && !/[、,，・\/]/.test(f) && ['Who', 'Problem', 'Solution'].every((k) => filled(part(L, k), 3)); }, ['機能は欲張らない。まず1つだけ。', '「、」や「・」で並べないのがコツ。']],
    ]), 230);

  const SOL_PITCH = '課題｜新入社員は、学んだことが続かず、自分の成長が見えなくて困っています。\n解決｜毎日の学習を記録して、成長をグラフで見せるアプリを作りました。\nデモ｜今日の学習を入力すると、グラフが伸びて、連続日数のバッジがもらえます。\n学び｜型があるとバグが減ると分かりました。次は通知機能を作りたいです。';
  const ideaPitch = text('pitch.txt', '# 30秒ピッチ（パート名｜内容）\n課題｜\n解決｜\nデモ｜\n学び｜\n', '<b>30秒ピッチ</b>は4パート。<br><code>課題 → 解決 → デモ → 学び</code><br>全部で<b>80〜170文字</b>が目安です。', SOL_PITCH,
    mk('pitch.txt', 'txt', SOL_PITCH, [
      [1, '4パート（課題 / 解決 / デモ / 学び）をすべて書く', (s) => { const L = lines(s); return ['課題', '解決', 'デモ', '学び'].every((k) => filled(part(L, k), 5)); }, ['1パート1文でOK。', '「パート名｜内容」の形にする。']],
      [2, '全部で 80〜170 文字におさめる（パート名は数えない）', (s) => { const L = lines(s); const ps = ['課題', '解決', 'デモ', '学び'].map((k) => part(L, k)); if (!ps.every((p) => filled(p, 5))) return false; const n = ps.join('').length; return n >= 80 && n <= 170; }, ['短すぎず、長すぎず。話して30秒の量。', '1パートはだいたい20〜40文字。']],
    ]), 230);

  const SOL_WIDEN = '案が足りない → 広げる\n案が20個ある → 絞る\n途中で「それは無理」と言いたくなった → 広げる\n基準｜誰の困りごとか・実現できるか・面白いか を決めて投票する';
  const ideaWiden = text('mode.txt', '# 「広げる」か「絞る」を → のあとに書こう\n案が足りない → \n案が20個ある → \n途中で「それは無理」と言いたくなった → \n\n# 最後に「基準｜…」の行で、絞るときの基準を書く\n', '<b>広げる</b>＝量を出す・否定しない<br><b>絞る</b>＝基準を決めて選ぶ', SOL_WIDEN,
    mk('mode.txt', 'txt', SOL_WIDEN, [
      [1, '「案が足りない」と「案が20個ある」を、広げる / 絞る で答える', (s) => { const L = lines(s); return /広げ/.test(arrow(L, '足りない')) && /絞/.test(arrow(L, '20個')); }, ['足りないなら増やす。多すぎるなら選ぶ。']],
      [2, '「それは無理と言いたくなった」ときの答えと、絞る基準を書く', (s) => { const L = lines(s); const k = part(L, '基準'); return /広げ/.test(arrow(L, '無理')) && !!k && (k.match(/誰|困りごと|実現|面白|投票|効果/g) || []).length >= 2; }, ['評価は絞る時間まで我慢する。', '基準は「誰の困りごとか」「実現できるか」など。2つ以上。']],
    ]), 230);

  /* ---------- 追加シーン用 ---------- */
  const SOL_PROB = '誰が｜初めて法律相談をする人\nいつ｜夜に困りごとを思いついたとき\n困りごと｜予約の電話が平日の昼しかつながらず\n結果｜相談をあきらめてしまう';
  const ideaProblem = text('problem.txt', '# 課題文を書こう（パート名｜内容）\n誰が｜\nいつ｜\n困りごと｜\n結果｜\n', '<b>あいまいな願い</b>「もっと相談しやすくしたい」を、<br><code>誰が → いつ → 困りごと → 結果</code> の4つで具体的にする。<br>解決策（アプリ・機能・AI）は<b>まだ書かない</b>。', SOL_PROB,
    mk('problem.txt', 'txt', SOL_PROB, [
      [1, '4パート（誰が / いつ / 困りごと / 結果）をすべて書く', (s) => { const L = lines(s); return ['誰が', 'いつ', '困りごと', '結果'].every((k) => filled(part(L, k), 3)); }, ['「パート名｜内容」の形で4行。']],
      [2, '「誰が」を具体的に（みんな・ユーザーだけはNG）、「いつ」を場面で書く（8文字以上）', (s) => { const L = lines(s); const w = part(L, '誰が'), n = part(L, 'いつ'); return filled(w, 5) && !/^(みんな|ユーザー|お客さん|お客様|人|全員|誰でも)$/.test(w) && filled(n, 8) && !/^(いつでも|いつも|常に)$/.test(n); }, ['「初めて法律相談をする人」のように、顔が思い浮かぶ言葉。', '「夜に困りごとを思いついたとき」のように、場面を書く。']],
      [3, '解決策の言葉（アプリ・システム・機能・AI・チャット・作る）を入れず、「〜しにくい」だけで終わらせない', (s) => { const L = lines(s); const all = ['誰が', 'いつ', '困りごと', '結果'].map((k) => part(L, k)); return all.every((x) => filled(x, 3)) && !/(アプリ|システム|サービス|サイト|機能|AI|チャット|を作|作りたい|導入)/.test(all.join('')) && !/(しにくい|使いにくい|分かりにくい|わかりにくい|不便)/.test(all[2] + all[3]) && all[2].length >= 10; }, ['解決策はブレストで考える。ここでは困りごとだけ。', '「何が起きたか」を書く。例：予約の電話が平日の昼しかつながらず']],
    ]), 230);

  const SOL_PR = 'PR1｜feat: ログイン画面を作る｜220\nPR2｜feat: ログイン API をつなぐ｜260\nPR3｜test: ログインのテストを書く｜220\nPR4｜docs: README に手順を書く｜100';
  const prRows = (s) => lines(s).filter((x) => /^PR\d+[｜|]/.test(x)).map((x) => x.split(/[｜|]/).map((y) => y.trim())).map(([id, t, n]) => ({ id, t: t || '', n: parseInt(n, 10) || 0 }));
  const devPr = text('prs.txt', '# 元の変更：ログイン機能（800行）。小さな PR に分けよう\n# PR番号｜題名｜行数\nPR1｜｜\n', '<b>PR は小さく</b>（1つで1つのこと・300行以内）<br>題名は <code>feat:</code> <code>fix:</code> <code>test:</code> <code>docs:</code> のどれかで始める。', SOL_PR,
    mk('prs.txt', 'txt', SOL_PR, [
      [1, '800行のログイン機能を、3つ以上の PR に分ける（題名と行数を書く）', (s) => prRows(s).filter((r) => r.t.length >= 4 && r.n > 0).length >= 3, ['「PR1｜題名｜行数」の形で、3行以上。', '画面・API・テストなど、1つずつ。']],
      [2, 'どの PR も 300 行以内にして、題名を feat: / fix: / test: / docs: などで始める', (s) => { const R = prRows(s); return R.length >= 3 && R.every((r) => r.n > 0 && r.n <= 300 && /^(feat|fix|test|refactor|docs|chore):/.test(r.t)); }, ['300行を超えたら、さらに分ける。', '題名の頭に <code>feat:</code> のような種類を付ける。']],
      [3, 'テストだけの PR（test: ）を1つ分け、全部で 700〜900 行（元の800行）にする', (s) => { const R = prRows(s); const sum = R.reduce((a, r) => a + r.n, 0); return R.length >= 3 && R.some((r) => /^test:/.test(r.t)) && sum >= 700 && sum <= 900; }, ['テストは別 PR にすると、レビューしやすい。', '行数の合計が、元の800行くらいになるように。']],
    ]), 230);

  const SOL_RUN = '導入・課題｜30｜A｜\n解決の説明｜45｜A｜\nデモ① 入力｜60｜B｜録画を流す\nデモ② グラフ｜60｜B｜スクショ3枚を見せる\nまとめ・学び｜45｜A｜\n質疑応答｜60｜全員｜';
  const runRows = (s) => lines(s).filter((x) => /[｜|]/.test(x)).map((x) => x.split(/[｜|]/).map((y) => y.trim())).map(([n, sec, w, pb]) => ({ n: n || '', s: parseInt(sec, 10) || 0, w: w || '', pb: pb || '' }));
  const prepRun = text('runsheet.txt', '# 内容｜秒数｜担当｜Plan B（デモのときだけ）\n導入・課題｜90｜A｜\n解決の説明｜60｜A｜\nデモ① 入力｜40｜B｜\nデモ② グラフ｜30｜B｜\nまとめ・学び｜40｜A｜\n', '<b>5分の進行表</b>：合計 270〜330秒<br>デモは全体の <b>4割以上</b>、デモ行には <b>Plan B</b>（動かないときの代わり）、最後に<b>質疑 60秒</b>。', SOL_RUN,
    mk('runsheet.txt', 'txt', SOL_RUN, [
      [1, '5行以上で、合計を 270〜330 秒（約5分）にする', (s) => { const R = runRows(s); const t = R.reduce((a, r) => a + r.s, 0); return R.length >= 5 && t >= 270 && t <= 330; }, ['今の合計を足してみよう。長い導入を削る。']],
      [2, '「デモ」の行の合計が、全体の 4 割以上になる', (s) => { const R = runRows(s); const t = R.reduce((a, r) => a + r.s, 0); const d = R.filter((r) => /デモ/.test(r.n)).reduce((a, r) => a + r.s, 0); return t > 0 && d / t >= 0.4; }, ['見せたいのはデモ。導入を30秒にして、デモを60秒ずつに。']],
      [3, 'デモの全行に Plan B（4文字以上）を書く。最後は「質疑」60秒以上で、全員に担当を決める', (s) => { const R = runRows(s); const demos = R.filter((r) => /デモ/.test(r.n)); const last = R[R.length - 1]; return demos.length >= 1 && demos.every((r) => r.pb.length >= 4) && !!last && /質疑|質問|Q/.test(last.n) && last.s >= 60 && R.every((r) => r.w); }, ['Plan B の例：録画を流す / スクショ3枚。', '最後の行は「質疑応答｜60｜全員｜」。']],
    ]), 260);

  const ansOf = (s) => lines(s).filter((x) => /^答え[｜|:：]/.test(x)).map((x) => x.replace(/^答え[｜|:：]\s*/, ''));
  const SOL_QA = 'Q1｜なぜ、その技術を選びましたか？\n答え｜型でミスを早く見つけたかったからです。画面を部品に分けると、直す場所が分かりやすいと考えました。\nQ2｜いちばん大変だったことは？\n答え｜グラフが更新されないバグです。ref の .value を忘れていたのが原因で、チームで画面を見ながら直しました。\nQ3｜デモが動かなくなったら？\n答え｜発表を止めないために、録画した動画で見せます。動かない理由はあとで調べて共有します。';
  const demoQa = text('qa.txt', '# 答えを「答え｜…」の形で書こう（30秒＝25〜90文字・結論→理由）\nQ1｜なぜ、その技術を選びましたか？\n答え｜\nQ2｜いちばん大変だったことは？\n答え｜\nQ3｜デモが動かなくなったら？\n答え｜\n', '<b>Q&A は先に用意</b><br>結論 → 理由 の順で、<b>25〜90文字</b>（30秒で言い切れる量）。', SOL_QA,
    mk('qa.txt', 'txt', SOL_QA, [
      [1, '3つの質問すべてに、25文字以上の答えを書く', (s) => { const A = ansOf(s); return A.length >= 3 && A.slice(0, 3).every((a) => a.length >= 25); }, ['「答え｜」のあとに、結論と理由を書く。']],
      [2, 'どの答えも 90 文字以内で、理由（から / ため / ので / ことで / 原因）が入っている', (s) => { const A = ansOf(s); return A.length >= 3 && A.slice(0, 3).every((a) => a.length >= 25 && a.length <= 90 && /から|ため|ので|ことで|原因/.test(a)); }, ['長いと30秒を超える。90文字まで。', '「〜からです」「〜のために」と理由を足す。']],
      [3, 'Q3（デモが動かなくなったら）に、代わりの手段（録画・動画・スクショ・バックアップ）を書く', (s) => { const A = ansOf(s); return A.length >= 3 && /録画|動画|スクショ|バックアップ|代わり/.test(A[2]) && A[2].length >= 25; }, ['Plan B は、動かなくても発表を止めないための準備。']],
    ]), 280);

  const SOL_CM = '良かった点｜デモで数量を変えると、合計金額がすぐ変わった\n理由｜使い方が見ただけで伝わったから\n提案｜入力ミスのエラー画面も見せると、安心感が増すと思います';
  const demoComment = text('comment.txt', '# コメントを書こう（パート名｜内容）\n良かった点｜\n理由｜\n提案｜\n', '<b>よいコメント</b>＝<br>見たこと（事実）→ 理由 → 次への提案', SOL_CM,
    mk('comment.txt', 'txt', SOL_CM, [
      [1, '3パート（良かった点 / 理由 / 提案）をすべて書く', (s) => { const L = lines(s); return ['良かった点', '理由', '提案'].every((k) => filled(part(L, k), 3)); }, ['「パート名｜内容」の形で3行。']],
      [2, '良かった点を具体的に（12文字以上・「良かった」だけはNG）、理由に「から / ため / ので」を入れる', (s) => { const L = lines(s); const f = part(L, '良かった点'), r = part(L, '理由'); return filled(f, 12) && !/^(良かった|よかった|面白かった|すごかった)(です)?[！!。]?$/.test(f) && filled(r, 8) && /から|ため|ので/.test(r); }, ['何を見てそう思ったか（画面・数字・場面）を書く。']],
      [3, '提案を10文字以上で、「〜すると」「〜してみては」などの形で書く', (s) => { const L = lines(s); const n = part(L, '提案'); return filled(n, 10) && /すると|してみ|してはどう|したい|してほしい|はどうでしょう|と思います/.test(n); }, ['悪い点だけでなく、次の一歩を一緒に出す。']],
    ]), 230);

  D['idea'] = { 'ブレスト・ウォール': ideaBrain, 'あいまいな願いを課題文にする': ideaProblem, 'アイデアキャンバス': ideaCanvas, '30秒ピッチ': ideaPitch, '広げる？ 絞る？ どっち？': ideaWiden };

  /* ========================================================= dev */
  const secs = (s) => { const o = { Todo: [], Doing: [], Done: [] }; let cur = null; (s || '').split('\n').forEach((x) => { const m = x.match(/^##\s*(Todo|Doing|Done)/i); if (m) { cur = m[1][0].toUpperCase() + m[1].slice(1).toLowerCase(); return; } const t = x.replace(/^\s*[-*]\s*/, '').trim(); if (cur && t && !x.trim().startsWith('#') && /^\s*[-*]/.test(x)) o[cur].push(t); }); return o; };
  const SOL_KB = '## Todo\n- API をつなぐ\n## Doing\n- ログイン画面を作る\n## Done\n- README を書く';
  const devKanban = text('board.md', '# タスクの行を、ドラッグの代わりに移そう\n## Todo\n- ログイン画面を作る\n- API をつなぐ\n- README を書く\n## Doing\n## Done\n', '<b>カンバン</b><br><code>Todo → Doing → Done</code><br>Doing は<b>1〜2個</b>まで（同時に抱えすぎない）', SOL_KB,
    mk('board.md', 'txt', SOL_KB, [
      [1, '「ログイン画面を作る」を Doing に移す（Todo には残さない）', (s) => { const b = secs(s); return b.Doing.some((x) => /ログイン画面/.test(x)) && !b.Todo.some((x) => /ログイン画面/.test(x)); }, ['行ごと、## Doing の下へ。']],
      [2, '「README を書く」を Done に移し、Doing は 2 個以下にする', (s) => { const b = secs(s); return b.Done.some((x) => /README/.test(x)) && !b.Todo.some((x) => /README/.test(x)) && b.Doing.length >= 1 && b.Doing.length <= 2; }, ['終わったものは Done へ。', 'Doing を増やしすぎない。']],
    ]), 260);

  const SOL_FLOW = 'git checkout main\ngit pull\ngit checkout -b feature/login\ngit add .\ngit commit -m "feat: ログイン画面を追加"\ngit push -u origin feature/login';
  const devFlow = text('flow.sh', '# 1日の流れを、コマンドで書こう（1行に1コマンド）\n', '<b>流れ</b><br>最新にする → 枝を切る → 保存（add・commit）→ 送る（push）<br>コミットは <code>feat:</code> などで始める', SOL_FLOW,
    mk('flow.sh', 'sh', SOL_FLOW, [
      [1, 'branch を切り（checkout -b）、add → commit → push の順に書く', (s) => { const L = lines(s); const a = idx(L, /^git checkout -b\s+\S+/), b = idx(L, /^git add\b/, a + 1), c = idx(L, /^git commit\b/, b + 1), d = idx(L, /^git push\b/, c + 1); return a >= 0 && b > a && c > b && d > c; }, ['branch → add → commit → push の順。', '枝は git checkout -b 名前 で作る。']],
      [2, '先に main を最新にして、枝名は feature/○○、コミットは feat: で始める', (s) => { const L = lines(s); const m = idx(L, /^git checkout main$/), p = idx(L, /^git pull\b/, m + 1), a = idx(L, /^git checkout -b\s+(feature|feat)\/\S+/, p + 1); return m >= 0 && p > m && a > p && L.some((x) => /^git commit\s+-m\s+["'](feat|fix|docs|chore):\s*\S+/.test(x)); }, ['朝の最初は main に戻って pull。', 'git commit -m "feat: ○○" の形。']],
    ]), 260);

  const SOL_STUCK = 'やったこと｜Vue の ref を使って画面に数を出そうとして、script に count を書きました。\n期待｜ボタンを押したら数が1ずつ増えること。\n実際｜ボタンを押しても数が変わらず、エラーも出ません。';
  const devStuck = text('question.txt', '# 10分悩んだら、3点セットで相談しよう（ラベル｜内容）\nやったこと｜\n期待｜\n実際｜\n', '<b>質問の3点セット</b><br>やったこと・期待・実際<br>これだけで、答える側がぐっと楽になります。', SOL_STUCK,
    mk('question.txt', 'txt', SOL_STUCK, [
      [1, '「やったこと」「期待」「実際」の3行を書く', (s) => { const L = lines(s); return ['やったこと', '期待', '実際'].every((k) => filled(part(L, k), 5)); }, ['「ラベル｜内容」の形にする。', 'どれも1文でOK。']],
      [2, '各行を10文字以上にして、「実際」には何が起きているか（エラー・表示・動き）を書く', (s) => { const L = lines(s); const a = part(L, 'やったこと'), b = part(L, '期待'), c = part(L, '実際'); return filled(a, 10) && filled(b, 10) && filled(c, 10) && /エラー|Error|表示|出ない|動かない|変わらない|空|真っ白|undefined|NaN/i.test(c); }, ['「実際」は事実だけ。気持ちは書かない。', '例：「ボタンを押しても数が変わらない」']],
    ]), 230);

  const SOL_DEVTHINK = 'Doing に5つ入っている → 1つ完了させてから次に着手する\n小さな修正を main に直接入れたい → branch を切って PR にする\n15分悩んで解決しない → やったこと・期待・実際を整理して相談する';
  const devThink = text('rules.txt', '# 迷ったときの行動を、→ のあとに書こう\nDoing に5つ入っている → \n小さな修正を main に直接入れたい → \n15分悩んで解決しない → \n', '<b>3つの原則</b><br>・同時進行（WIP）を減らす<br>・main には直接書かず、branch + PR<br>・悩んだら早めに相談', SOL_DEVTHINK,
    mk('rules.txt', 'txt', SOL_DEVTHINK, [
      [1, '「Doing に5つ」→ どうする？', (s) => /1つ|ひとつ|完了|終わら|減ら/.test(arrow(lines(s), 'Doing')), ['同時に進めるほど、どれも終わらない。']],
      [2, '「main に直接入れたい」→ どうする？', (s) => /branch|ブランチ|枝|PR|プルリク/i.test(arrow(lines(s), 'main')), ['小さくても、枝を切って PR にする。']],
      [3, '「15分悩んだ」→ どうする？', (s) => /整理|相談|やったこと|期待|実際|聞く|質問/.test(arrow(lines(s), '15分')), ['ひとりで抱え込まず、情報をまとめて聞く。']],
    ]), 230);

  D['dev'] = { 'カンバンボード': devKanban, '1日の流れ と Git': devFlow, 'PR は小さく・早くレビュー': devPr, '詰まったら？': devStuck, '進め方の判断': devThink };

  /* ========================================================= prep */
  const SOL_SLIDES = 'タイトル｜学習トラッカー／チーム A\n課題｜学んだことが続かず、見えない\n解決策｜毎日の記録をグラフで見せる\nデモ｜①入力 ②グラフが伸びる ③バッジがもらえる\n技術と工夫｜型でバグを減らし、部品に分けた\n学びと今後｜型が助けになった。次は通知機能';
  const slideKeys = ['タイトル', '課題', '解決策', 'デモ', '技術と工夫', '学びと今後'];
  const prepSlides = text('slides.md', '# 6枚の資料。1枚で伝えることは1つ（ラベル｜内容）\nタイトル｜\n課題｜\n解決策｜\nデモ｜\n技術と工夫｜\n学びと今後｜\n', '<b>6枚の目安</b><br>タイトル / 課題 / 解決策 / デモ / 技術と工夫 / 学びと今後<br>1枚は<b>40文字以内</b>、デモは<b>3ステップ</b>', SOL_SLIDES,
    mk('slides.md', 'txt', SOL_SLIDES, [
      [1, '6枚すべてに内容を書く', (s) => { const L = lines(s); return slideKeys.every((k) => filled(part(L, k), 3)); }, ['「ラベル｜内容」の形で、6行とも。']],
      [2, '1枚の内容は 40 文字以内にする（1枚1メッセージ）', (s) => { const L = lines(s); return slideKeys.every((k) => filled(part(L, k), 3) && part(L, k).length <= 40); }, ['長くなったら、いちばん伝えたい1つに絞る。']],
      [3, 'デモは ①②③ の3ステップで書く', (s) => { const d = part(lines(s), 'デモ'); return !!d && /①/.test(d) && /②/.test(d) && /③/.test(d); }, ['見せる順番に、①入力 ②結果 ③おまけ のように。']],
    ]), 260);

  const num = (v) => { const m = (v || '').match(/(\d+)\s*秒/); return m ? +m[1] : null; };
  const SOL_REH = '課題｜30秒\n解決｜40秒\nデモ｜80秒\n学び｜30秒';
  const prepReh = text('timing.txt', '# 3分（180秒）に収まる配分を書こう（ラベル｜○○秒）\n課題｜\n解決｜\nデモ｜\n学び｜\n', '<b>持ち時間は3分（180秒）</b><br>見せ場の <b>デモ</b> をいちばん長く。<br>合計が180秒を超えないように。', SOL_REH,
    mk('timing.txt', 'txt', SOL_REH, [
      [1, '4パートそれぞれに「○○秒」を書く', (s) => { const L = lines(s); return ['課題', '解決', 'デモ', '学び'].every((k) => num(part(L, k)) > 0); }, ['例：課題｜30秒']],
      [2, '合計を180秒以内にして、デモをいちばん長くする', (s) => { const L = lines(s); const v = ['課題', '解決', 'デモ', '学び'].map((k) => num(part(L, k))); if (v.some((x) => !(x > 0))) return false; const sum = v.reduce((a, b) => a + b, 0); return sum <= 180 && v[2] === Math.max(...v) && v.filter((x) => x === v[2]).length === 1; }, ['合計を計算してみよう。', 'デモが一番、他は短めに。']],
    ]), 230);

  const SOL_DAY = 'ネット｜会場の Wi-Fi が不安なので、スマホのテザリングも用意する\nアプリ｜npm run dev を先に起動して、タブは3つだけにする\nバックアップ｜デモの画面録画とスクショをデスクトップに置く\n担当｜話す人・操作する人・時間を見る人を決める';
  const prepDay = text('checklist.txt', '# 本番で慌てないための準備を書こう（ラベル｜内容）\nネット｜\nアプリ｜\nバックアップ｜\n担当｜\n', '<b>本番前に潰すこと</b><br>ネット・アプリ・バックアップ・担当<br>「落ちたらどうする？」を先に決める', SOL_DAY,
    mk('checklist.txt', 'txt', SOL_DAY, [
      [1, '4項目（ネット / アプリ / バックアップ / 担当）をすべて書く', (s) => { const L = lines(s); return ['ネット', 'アプリ', 'バックアップ', '担当'].every((k) => filled(part(L, k), 5)); }, ['1項目1行で、具体的に。']],
      [2, 'ネットは予備（テザリング等）、バックアップは録画やスクショを書く', (s) => { const L = lines(s); return /テザリング|予備|有線|ホットスポット|スマホ/.test(part(L, 'ネット') || '') && /録画|動画|スクショ|スクリーンショット/.test(part(L, 'バックアップ') || ''); }, ['ネットが落ちたときの代わりは？', '動かなかったときに見せるものは？']],
      [3, '担当に「話す」「操作する」「時間を見る」の3役を書く', (s) => { const t = part(lines(s), '担当') || ''; return /話/.test(t) && /操作/.test(t) && /時間/.test(t); }, ['3つの役割を、メンバーに割り当てる。']],
    ]), 230);

  const SOL_PREPTHINK = 'スライドに機能を10個載せたい → 一番伝えたい1つに絞って、残りはデモで見せる\nライブデモが不安 → 録画した動画をバックアップに用意する\nリハーサルで3分半かかった → デモの見せ場を絞って削る';
  const prepThink = text('rules.txt', '# 迷ったときの行動を、→ のあとに書こう\nスライドに機能を10個載せたい → \nライブデモが不安 → \nリハーサルで3分半かかった（持ち時間は3分） → \n', '<b>聞き手の立場で</b><br>・1枚1メッセージ<br>・失敗は本番の前に防ぐ<br>・時間は早口でなく、内容で調整', SOL_PREPTHINK,
    mk('rules.txt', 'txt', SOL_PREPTHINK, [
      [1, '「機能を10個載せたい」→ どうする？', (s) => /1つ|ひとつ|絞|デモ/.test(arrow(lines(s), '10個')), ['全部は伝わらない。']],
      [2, '「ライブデモが不安」→ どうする？', (s) => /録画|動画|バックアップ|スクショ/.test(arrow(lines(s), 'ライブ')), ['動かなくても止まらない準備を。']],
      [3, '「3分半かかった」→ どうする？', (s) => /削|絞|減ら|短く/.test(arrow(lines(s), '3分半')) && !/早口/.test(arrow(lines(s), '3分半')), ['早口にするより、内容を減らす。']],
    ]), 230);

  D['prep'] = { '資料の構成': prepSlides, 'デモ進行表（5分）': prepRun, 'リハーサル・タイマー': prepReh, '本番前チェック': prepDay, '資料と本番の判断': prepThink };

  /* ========================================================= demo */
  const uniqNames = (s) => { const out = []; lines(s).forEach((x) => { const m = x.match(/^(\d+)\s*番\s*[｜|:：]\s*(.+)$/); if (m) out.push([+m[1], m[2].trim()]); }); return out; };
  const SOL_DRAW = '1番｜チーム A\n2番｜チーム B\n3番｜チーム C\n4番｜チーム D\n5番｜チーム E\n6番｜チーム F';
  const demoDraw = text('order.txt', '# 発表順を決めて書こう（N番｜チーム名）\n', '<b>発表順</b><br>1番から順に、チーム名を書く。<br>同じチームは1回だけ。', SOL_DRAW,
    mk('order.txt', 'txt', SOL_DRAW, [
      [1, '3チーム以上を、1番から順に書く', (s) => { const a = uniqNames(s); return a.length >= 3 && a.every(([n], i) => n === i + 1); }, ['「1番｜チーム A」「2番｜チーム B」…']],
      [2, '6チームを書く。同じ名前は使わない', (s) => { const a = uniqNames(s); return a.length >= 6 && a.every(([n], i) => n === i + 1) && new Set(a.map((x) => x[1])).size === a.length; }, ['チーム名がかぶらないように。']],
    ]), 230);

  const SOL_TIMER = '発表｜3分\n質疑｜2分\n入れ替え｜1分\n合計｜6分\n全体（6チーム）｜36分';
  const mins = (v) => { const m = (v || '').match(/(\d+)\s*分/); return m ? +m[1] : null; };
  const demoTimer = text('time.txt', '# 1チームの持ち時間と、全体の時間を書こう（ラベル｜○分）\n発表｜\n質疑｜\n入れ替え｜\n合計｜\n全体（6チーム）｜\n', '<b>時間の組み立て</b><br>発表 + 質疑 + 入れ替え = 1チーム<br>1チーム × 6チーム = 全体', SOL_TIMER,
    mk('time.txt', 'txt', SOL_TIMER, [
      [1, '発表・質疑・入れ替えに「○分」を書く（それぞれ1分以上）', (s) => { const L = lines(s); return ['発表', '質疑', '入れ替え'].every((k) => mins(part(L, k)) >= 1); }, ['例：発表｜3分']],
      [2, '合計を「3つの足し算」、全体を「合計 × 6チーム」にする', (s) => { const L = lines(s); const v = ['発表', '質疑', '入れ替え'].map((k) => mins(part(L, k))); if (v.some((x) => !(x >= 1))) return false; const sum = v.reduce((a, b) => a + b, 0); return mins(part(L, '合計')) === sum && mins(part(L, '全体（6チーム）')) === sum * 6; }, ['合計は3つの足し算。', '全体は 合計 × 6。']],
    ]), 230);

  const stars = (v) => ((v || '').match(/[★⭐]/g) || []).length;
  const SOL_VOTE = 'アイデア｜★★★★\n技術｜★★★\nデザイン｜★★★★\n発表｜★★★★★\nコメント｜説明が分かりやすかった。デモが動いていたので、イメージできた。次はスマホ表示も見てみたい。';
  const demoVote = text('review.txt', '# 4つの観点を ★（1〜5個）で評価しよう\nアイデア｜\n技術｜\nデザイン｜\n発表｜\nコメント｜\n', '<b>評価の観点</b><br>アイデア・技術・デザイン・発表<br>★ は <b>1〜5個</b>。最後に一言コメント。', SOL_VOTE,
    mk('review.txt', 'txt', SOL_VOTE, [
      [1, '4つの観点すべてに ★ を1〜5個付ける', (s) => { const L = lines(s); return ['アイデア', '技術', 'デザイン', '発表'].every((k) => { const n = stars(part(L, k)); return n >= 1 && n <= 5; }); }, ['★ を並べて書く。例：技術｜★★★']],
      [2, 'コメントを30文字以上で書き、「理由（から・ので・ため）」を入れる', (s) => { const c = part(lines(s), 'コメント') || ''; return c.length >= 30 && /から|ので|ため|おかげ|分かりやすかった|動いていた/.test(c); }, ['良かったことには、理由を添える。']],
    ]), 260);

  const SOL_DEMOTHINK = '事実｜デモでグラフがすぐ表示されていました\n理由｜画面を見て、何をするアプリかすぐ分かったからです\n提案｜スマホの画面でも表示を見せると、もっと良くなります\n進行が押している → 質疑を短くして時間を守る';
  const demoThink = text('feedback.txt', '# 「良かったです」だけにならないフィードバックを書こう\n事実｜\n理由｜\n提案｜\n\n# 最後に1行：進行が押している → ○○\n進行が押している → \n', '<b>良いフィードバック</b><br>事実（見たこと）+ 理由 + 提案<br>進行が押したら、<b>全チームのために</b>時間を守る', SOL_DEMOTHINK,
    mk('feedback.txt', 'txt', SOL_DEMOTHINK, [
      [1, '「事実」「理由」「提案」の3行を書く（各10文字以上）', (s) => { const L = lines(s); return ['事実', '理由', '提案'].every((k) => filled(part(L, k), 10)); }, ['見たこと → なぜそう思う → こうすると良い。']],
      [2, '「進行が押している」ときの行動を書く', (s) => /質疑|短く|時間|守る|巻く/.test(arrow(lines(s), '押している')), ['時間を守るのも、公平さのため。']],
    ]), 260);

  D['demo'] = { '発表順ルーレット': demoDraw, '発表タイマー': demoTimer, 'Q&A に備える': demoQa, 'フィードバック': demoVote, 'コメントの書き方': demoComment, '発表を聞く側の判断': demoThink };

  /* ========================================================= x-vue-api */
  const SOL_API3 = `const { createApp } = Vue;
const Box = {
  props: ['state'],
  data() { return { items: ['未払い残業代の相談', '契約書チェックの依頼'], message: '通信に失敗しました' }; },
  template: \`
    <div class="box">
      <p v-if="state === 'loading'">読み込み中…</p>
      <p v-else-if="state === 'error'">{{ message }}</p>
      <ul v-else><li v-for="i in items" :key="i">{{ i }}</li></ul>
    </div>\`,
};
createApp(Box, { state: 'loading' }).mount('#a');
createApp(Box, { state: 'error' }).mount('#b');
createApp(Box, { state: 'success' }).mount('#c');`;
  const API3_START = SOL_API3.replace(/      <p v-if[\s\S]*?<\/ul>\n/, '      <!-- ここに3つの状態を書く（v-if / v-else-if / v-else） -->\n');
  const apiState = web(API3_START, SOL_API3, (v, c) => {
    const d = doc(c), src = v['main.js'] || '';
    const A = q1(d, '#a'), B = q1(d, '#b'), C = q1(d, '#c');
    const rows = [
      [1, '読み込み中（左の箱）に「読み込み中…」だけを出す', () => /読み込み/.test(tx(A)) && !/未払い|失敗/.test(tx(A)) && /v-if/.test(src), ['v-if="state === \'loading\'" を使う。']],
      [2, 'エラー（中の箱）に、message を表示する', () => /失敗/.test(tx(B)) && !/読み込み中|未払い/.test(tx(B)) && /v-else-if|v-if/.test(src), ['v-else-if="state === \'error\'" で {{ message }}。']],
      [3, '成功（右の箱）に、items を li で並べる（v-for + :key）', () => qa(C, 'li').length === 2 && /v-for/.test(src) && !/読み込み中|失敗/.test(tx(C)), ['それ以外（v-else）で ul > li v-for。']],
    ];
    return rows.map(([level, label, f, hint]) => { let ok = false; try { ok = !!f(); } catch (e) { ok = false; } return { level, label, ok, hint, answer: { code: SOL_API3, lang: 'js' } }; });
  }, '<div id="a"></div>\n<div id="b"></div>\n<div id="c"></div>');

  const SOL_JOURNEY = 'async function load() {\n  loading.value = true;\n  try {\n    items.value = await fakeFetch();\n  } catch (e) {\n    error.value = e.message;\n  } finally {\n    loading.value = false;\n  }\n}';
  const apiJourney = text('load.js', 'async function load() {\n  // ① 読み込み中にする（loading.value = true）\n  // ② 通信する（await fakeFetch()）\n  // ③ 失敗したら error.value に入れる（catch）\n  // ④ 最後に必ず読み込み中を終わらせる（finally）\n}\n', '<b>リクエストの旅</b><br>①開始 → ②通信 → ③失敗なら error → ④<b>必ず</b>終了<br>④は <code>finally</code> に書くと、成功でも失敗でも動きます。', SOL_JOURNEY,
    mk('load.js', 'js', SOL_JOURNEY, [
      [1, '通信の前に loading.value = true、await fakeFetch() で通信する（この順）', (s) => { const c = noCmt(s); const a = c.search(/loading\.value\s*=\s*true/), b = c.search(/await\s+fakeFetch/); return a >= 0 && b > a; }, ['先に「読み込み中」にしてから通信する。']],
      [2, 'try / catch / finally を書き、catch で error.value、finally で loading.value = false', (s) => { const c = noCmt(s); const t = c.search(/\btry\b/), ca = c.search(/\bcatch\b/), f = c.search(/\bfinally\b/); return t >= 0 && ca > t && f > ca && /error\.value\s*=/.test(c.slice(ca, f)) && /loading\.value\s*=\s*false/.test(c.slice(f)); }, ['失敗しても止まらないように finally。', 'catch (e) { error.value = e.message }']],
    ]), 260);

  D['x-vue-api'] = { 'fetch と3つの状態': apiState, 'リクエストの旅': apiJourney };

  /* ========================================================= x-vue-slots */
  const SOL_SLOT1 = `const { createApp } = Vue;
const MyCard = {
  template: \`<div class="card"><slot>相談内容は未入力です</slot></div>\`,
};
createApp({
  components: { MyCard },
  template: \`
    <my-card>労働問題の相談</my-card>
    <my-card></my-card>
  \`,
}).mount('#app');`;
  const SLOT1_START = SOL_SLOT1.replace('<slot>相談内容は未入力です</slot>', '<slot></slot>').replace('<my-card>労働問題の相談</my-card>', '<my-card></my-card>');
  const slotsHole = web(SLOT1_START, SOL_SLOT1, (v, c) => {
    const d = doc(c), src = v['main.js'] || ''; const cards = qa(d, '.card');
    const rows = [
      [1, '1つ目のカードに、中身（slot に入れる文字）を入れる', () => cards.length >= 2 && tx(cards[0]).length > 0, ['<my-card>ここに文字</my-card> のように、タグの間に書く。']],
      [2, '空のカードには「相談内容は未入力です」のような代わりの文字（slot の初期値）を出す', () => cards.length >= 2 && tx(cards[1]).length > 0 && /<slot[^>\/]*>[^<]*\S[^<]*<\/slot>/.test(src), ['<slot>代わりの文字</slot> と書くと、中身が無いときだけ出る。']],
    ];
    return rows.map(([level, label, f, hint]) => { let ok = false; try { ok = !!f(); } catch (e) { ok = false; } return { level, label, ok, hint, answer: { code: SOL_SLOT1, lang: 'js' } }; });
  });

  const SOL_SLOT2 = `const { createApp } = Vue;
const CaseList = {
  data() { return { cases: [{ id: 1, name: '労働問題' }, { id: 2, name: '契約トラブル' }, { id: 3, name: '交通事故' }] }; },
  template: \`<ul><li v-for="t in cases" :key="t.id"><slot :item="t">{{ t.name }}</slot></li></ul>\`,
};
createApp({
  components: { CaseList },
  template: \`<case-list v-slot="{ item }"><b>{{ item.name }}</b></case-list>\`,
}).mount('#app');`;
  const SLOT2_START = SOL_SLOT2.replace('<slot :item="t">', '<slot>').replace('<case-list v-slot="{ item }"><b>{{ item.name }}</b></case-list>', '<case-list></case-list>');
  const slotsScoped = web(SLOT2_START, SOL_SLOT2, (v, c) => {
    const d = doc(c), src = v['main.js'] || ''; const bs = qa(d, 'li b');
    const rows = [
      [1, '子（CaseList）の slot から、データを渡す（:item="t"）', () => /<slot[^>]*:item\s*=\s*"t"/.test(src), ['<slot :item="t"> のように、子が親へデータを渡す。']],
      [2, '親が v-slot="{ item }" で受け取り、li の中を <b> で表示する（3件）', () => bs.length === 3 && tx(bs[0]) === '労働問題' && /v-slot\s*=\s*"\{\s*item\s*\}"|#default\s*=\s*"\{\s*item\s*\}"/.test(src), ['<case-list v-slot="{ item }"> の中に <b>{{ item.name }}</b>。']],
    ];
    return rows.map(([level, label, f, hint]) => { let ok = false; try { ok = !!f(); } catch (e) { ok = false; } return { level, label, ok, hint, answer: { code: SOL_SLOT2, lang: 'js' } }; });
  });

  D['x-vue-slots'] = { '穴あきカード': slotsHole, 'スコープ付きスロット': slotsScoped };

  /* ========================================================= x-vue-dynamic */
  const SOL_IS = `const { createApp, ref } = Vue;
const Cases = { template: '<p>案件一覧の画面</p>' };
const Settings = { template: '<p>設定の画面</p>' };
createApp({
  components: { Cases, Settings },
  setup() { const tab = ref('Cases'); return { tab }; },
  template: \`
    <button @click="tab = 'Cases'">案件一覧</button>
    <button @click="tab = 'Settings'">設定</button>
    <KeepAlive>
      <component :is="tab"></component>
    </KeepAlive>
  \`,
}).mount('#app');`;
  const IS_START = SOL_IS.replace(/    <KeepAlive>\n      <component :is="tab"><\/component>\n    <\/KeepAlive>\n/, '    <!-- ここに、今のタブを出す -->\n');
  const dynIs = web(IS_START, SOL_IS, (v, c) => {
    const d = doc(c), src = v['main.js'] || '';
    const rows = [
      [1, '<component :is="tab"> で、今のタブ（案件一覧の画面）を表示する', () => /案件一覧の画面/.test(tx(d && d.body)) && /(:is|v-bind:is)\s*=/.test(src), ['<component :is="tab"></component> を1行書く。']],
      [2, '<KeepAlive> で包んで、タブを切り替えても状態が消えないようにする', () => /案件一覧の画面/.test(tx(d && d.body)) && /<(KeepAlive|keep-alive)[\s>][\s\S]*(:is|v-bind:is)[\s\S]*<\/(KeepAlive|keep-alive)>/.test(src), ['<KeepAlive> ... </KeepAlive> の中に <component> を入れる。']],
    ];
    return rows.map(([level, label, f, hint]) => { let ok = false; try { ok = !!f(); } catch (e) { ok = false; } return { level, label, ok, hint, answer: { code: SOL_IS, lang: 'js' } }; });
  });

  const SOL_BIND = `const { createApp, ref } = Vue;
createApp({
  setup() {
    const attrs = { class: 'primary', title: '保存します', type: 'button' };
    const color = ref('tomato');
    return { attrs, color };
  },
  template: \`
    <button id="b1" v-bind="attrs">保存</button>
    <button id="b2" :style="{ color: color }">キャンセル</button>
  \`,
}).mount('#app');`;
  const BIND_START = SOL_BIND.replace(' v-bind="attrs"', '').replace(' :style="{ color: color }"', '');
  const dynBind = web(BIND_START, SOL_BIND, (v, c) => {
    const d = doc(c), src = v['main.js'] || ''; const b1 = q1(d, '#b1'), b2 = q1(d, '#b2');
    const rows = [
      [1, 'v-bind="attrs" で、class と title をまとめて渡す', () => !!b1 && b1.classList.contains('primary') && b1.getAttribute('title') === '保存します' && /v-bind\s*=\s*"attrs"/.test(src), ['<button v-bind="attrs"> と書くと、オブジェクトの中身が全部つく。']],
      [2, ':style で、color の値を文字色にする（tomato）', () => !!b2 && b2.style.color === 'tomato' && /:style\s*=/.test(src), [':style="{ color: color }"']],
    ];
    return rows.map(([level, label, f, hint]) => { let ok = false; try { ok = !!f(); } catch (e) { ok = false; } return { level, label, ok, hint, answer: { code: SOL_BIND, lang: 'js' } }; });
  });

  D['x-vue-dynamic'] = { '<component :is> で切り替え': dynIs, 'v-bind をぜんぶ': dynBind };

  /* ========================================================= x-vue-composables */
  const SOL_COMP = `const { createApp, ref } = Vue;
function useCounter() {
  const count = ref(0);
  const inc = () => { count.value++; };
  return { count, inc };
}
const Estimate = { setup() { return useCounter(); }, template: '<p>見積: {{ count }} <button @click="inc">+1</button></p>' };
const Booking = { setup() { return useCounter(); }, template: '<p>予約: {{ count }} <button @click="inc">+1</button></p>' };
createApp(Estimate).mount('#a');
createApp(Booking).mount('#b');`;
  const COMP_START = SOL_COMP.replace(/  const count = ref\(0\);\n  const inc = \(\) => \{ count.value\+\+; \};\n  return \{ count, inc \};/, '  // ref を作って、{ count, inc } を返そう\n  return {};');
  const compCounter = web(COMP_START, SOL_COMP, (v, c) => {
    const d = doc(c), w = win(d);
    const rows = [
      [1, 'useCounter が count を返し、見積も予約も「0」と表示される', () => /見積:\s*0/.test(tx(q1(d, '#a'))) && /予約:\s*0/.test(tx(q1(d, '#b'))), ['const count = ref(0) を作って return { count } する。']],
      [2, 'inc で count が1増える。見積と予約は別々のカウンター', () => { const r1 = w.useCounter(), r2 = w.useCounter(); if (typeof r1.inc !== 'function' || !r1.count) return false; r1.inc(); return r1.count.value === 1 && r2.count.value === 0 && r1.count !== r2.count; }, ['inc = () => { count.value++ } も返す。', '呼ぶたびに新しい ref を作るので、別々になる。']],
    ];
    return rows.map(([level, label, f, hint]) => { let ok = false; try { ok = !!f(); } catch (e) { ok = false; } return { level, label, ok, hint, answer: { code: SOL_COMP, lang: 'js' } }; });
  }, '<div id="a"></div>\n<div id="b"></div>');

  const SOL_MOUSE = 'function useMouse() {\n  const x = ref(0);\n  const y = ref(0);\n  function update(e) {\n    x.value = e.clientX;\n    y.value = e.clientY;\n  }\n  onMounted(() => window.addEventListener(\'mousemove\', update));\n  onUnmounted(() => window.removeEventListener(\'mousemove\', update));\n  return { x, y };\n}';
  const compMouse = text('useMouse.js', 'function useMouse() {\n  const x = ref(0);\n  const y = ref(0);\n  // ① マウスが動いたら x, y を更新する関数を作る\n  // ② onMounted で addEventListener する\n  // ③ onUnmounted で removeEventListener する\n  return { x, y };\n}\n', '<b>後片付け</b><br>付けたイベントは、部品が消えるときに<b>外す</b>。<br>外すには<b>同じ関数</b>（名前を付けた関数）が必要です。', SOL_MOUSE,
    mk('useMouse.js', 'js', SOL_MOUSE, [
      [1, '名前を付けた関数で x, y を更新し、onMounted で mousemove に addEventListener する', (s) => { const c = noCmt(s); const f = c.match(/function\s+(\w+)\s*\(\s*\w*\s*\)\s*\{[^}]*x\.value[\s\S]*?\}/) || c.match(/const\s+(\w+)\s*=\s*\(?\s*\w*\s*\)?\s*=>\s*\{[^}]*x\.value[\s\S]*?\}/); return !!f && /onMounted\s*\([\s\S]*addEventListener\s*\(\s*['"]mousemove['"]\s*,\s*\w+/.test(c); }, ['function update(e) { x.value = e.clientX ... }', 'onMounted(() => window.addEventListener(\'mousemove\', update))']],
      [2, 'onUnmounted で、同じ関数を removeEventListener する', (s) => { const c = noCmt(s); const a = c.match(/addEventListener\s*\(\s*['"]mousemove['"]\s*,\s*(\w+)/); const r = c.match(/onUnmounted\s*\([\s\S]*removeEventListener\s*\(\s*['"]mousemove['"]\s*,\s*(\w+)/); return !!a && !!r && a[1] === r[1]; }, ['add と remove に、同じ名前の関数を渡す。']],
    ]), 300);

  const SOL_USE = 'マウスの位置｜useMouse\nウィンドウの幅と高さ｜useWindowSize\nローカルストレージに保存｜useLocalStorage\nクリップボードにコピー｜useClipboard';
  const compUse = text('vueuse.txt', '# やりたいことに合う VueUse の関数名を書こう\nマウスの位置｜\nウィンドウの幅と高さ｜\nローカルストレージに保存｜\nクリップボードにコピー｜\n', '<b>VueUse</b>は、出来合いの composable 集。<br>名前は <code>use○○</code> の形。<br>自分で書く前に、まず探そう。', SOL_USE,
    mk('vueuse.txt', 'txt', SOL_USE, [
      [1, '「マウスの位置」と「ウィンドウの幅と高さ」に合う関数名を書く', (s) => { const L = lines(s); return /^useMouse\b/i.test(part(L, 'マウスの位置') || '') && /^useWindowSize\b/i.test(part(L, 'ウィンドウの幅と高さ') || ''); }, ['use + やりたいこと（英語）。', 'useMouse / useWindowSize']],
      [2, '「ローカルストレージに保存」と「クリップボードにコピー」の関数名も書く', (s) => { const L = lines(s); return /^useLocalStorage\b/i.test(part(L, 'ローカルストレージに保存') || '') && /^useClipboard\b/i.test(part(L, 'クリップボードにコピー') || ''); }, ['useLocalStorage / useClipboard']],
    ]), 230);

  D['x-vue-composables'] = { 'コピペをやめよう': compCounter, 'useMouse とクリーンアップ': compMouse, 'VueUse ツアー': compUse };

  /* ========================================================= x-vue-state */
  const SOL_STORE = `const { createApp, reactive } = Vue;
const notice = reactive({ count: 0 });
const NoticeItem = {
  template: '<button @click="add">既読にする</button>',
  setup() { const add = () => { notice.count++; }; return { add }; },
};
const Header = {
  template: '<span>既読 {{ notice.count }}</span>',
  setup() { return { notice }; },
};
window.vms = { card: createApp(NoticeItem).mount('#a'), header: createApp(Header).mount('#b') };`;
  const STORE_START = SOL_STORE.replace('const notice = reactive({ count: 0 });', '// ① 共有ストア。reactive({ count: 0 }) にしよう\nconst notice = {};');
  const stateStore = web(STORE_START, SOL_STORE, (v, c) => {
    const d = doc(c), w = win(d); const vm = w && w.vms;
    const rows = [
      [1, '共有ストア notice を reactive({ count: 0 }) にする', () => !!vm && w.Vue.isReactive(vm.header.notice) && vm.header.notice.count === 0, ['reactive で包むと、変更が画面に伝わる。', 'const notice = reactive({ count: 0 })']],
      [2, 'Card と Header が、同じ notice を使っている（共有）', () => !!vm && vm.card.add && vm.header.notice && typeof vm.header.notice.count === 'number' && w.Vue.isReactive(vm.header.notice) && /notice\.count\+\+|notice\.count\s*\+=|notice\.count\s*=\s*notice\.count\s*\+/.test(v['main.js'] || ''), ['Card は notice.count++ を実行、Header は notice.count を表示する。']],
    ];
    return rows.map(([level, label, f, hint]) => { let ok = false; try { ok = !!f(); } catch (e) { ok = false; } return { level, label, ok, hint, answer: { code: SOL_STORE, lang: 'js' } }; });
  }, '<div id="a"></div>\n<div id="b"></div>');

  const SOL_PICK = '親から子に1回だけ値を渡す → props\nログイン中ユーザーを10個の画面が読む → Pinia\n離れた部品に「通知」を1回だけ伝える → Event Bus';
  const statePick = text('pick.txt', '# 場面に合う方式を書こう（props / Pinia / Event Bus）\n親から子に1回だけ値を渡す → \nログイン中ユーザーを10個の画面が読む → \n離れた部品に「通知」を1回だけ伝える → \n', '<b>選び方</b><br>親子で近い → <code>props / emit</code><br>みんなが読む → <code>Pinia（共有ステート）</code><br>離れて1回通知 → <code>Event Bus</code>', SOL_PICK,
    mk('pick.txt', 'txt', SOL_PICK, [
      [1, '「親から子に1回だけ値を渡す」', (s) => /props/i.test(arrow(lines(s), '親から子')), ['親子の関係なら基本はこれ。']],
      [2, '「ログイン中ユーザーを10個の画面が読む」', (s) => /pinia|ストア|store|共有ステート/i.test(arrow(lines(s), 'ログイン中')), ['みんなが読むデータは、1か所のストアに。']],
      [3, '「離れた部品に通知を1回だけ伝える」', (s) => /bus|mitt|イベントバス/i.test(arrow(lines(s), '通知')), ['状態を持たない、1回きりの通知。']],
    ]), 230);

  D['x-vue-state'] = { '誰が誰に話しかける？': stateStore, '使い分けクイズ': statePick };

  /* ========================================================= x-vue-render */
  const SOL_WHO = 'ブラウザが JS を実行して HTML を作る → SPA\nビルドのときに HTML を全部作っておく → SSG\nリクエストのたびにサーバーが HTML を作る → SSR';
  const renderWho = text('render.txt', '# 誰がいつ HTML を作るか。方式の名前（SPA / SSG / SSR）を書こう\nブラウザが JS を実行して HTML を作る → \nビルドのときに HTML を全部作っておく → \nリクエストのたびにサーバーが HTML を作る → \n', '<b>3つの方式</b><br><code>SPA</code> ブラウザで作る<br><code>SSG</code> ビルド時に作っておく<br><code>SSR</code> リクエストごとにサーバーで作る', SOL_WHO,
    mk('render.txt', 'txt', SOL_WHO, [
      [1, '「ブラウザが JS で HTML を作る」方式', (s) => /^SPA\b/i.test(arrow(lines(s), 'ブラウザが')), ['Single Page Application。']],
      [2, '「ビルドのときに HTML を全部作る」方式', (s) => /^SSG\b/i.test(arrow(lines(s), 'ビルドのとき')), ['Static Site Generation。']],
      [3, '「リクエストのたびにサーバーが HTML を作る」方式', (s) => /^SSR\b/i.test(arrow(lines(s), 'リクエストのたび')), ['Server Side Rendering。']],
    ]), 230);

  const SOL_NUXT = 'pages/index.vue → /\npages/price.vue → /price\npages/cases/[id].vue → /cases/:id';
  const renderNuxt = text('routes.txt', '# Nuxt は、ファイルの場所から URL が決まる。URL を書こう\npages/index.vue → \npages/price.vue → \npages/cases/[id].vue → \n', '<b>ファイルベースルーティング</b><br><code>pages/</code> の中のファイルが、そのまま URL になる。<br><code>[id]</code> は「変わる部分」。', SOL_NUXT,
    mk('routes.txt', 'txt', SOL_NUXT, [
      [1, 'index.vue の URL は？', (s) => /^\/$/.test(arrow(lines(s), 'index.vue')), ['index はトップページ（/）。']],
      [2, 'price.vue の URL は？', (s) => /^\/price\/?$/.test(arrow(lines(s), 'price.vue')), ['ファイル名がそのまま URL。']],
      [3, 'cases/[id].vue の URL は？（変わる部分を :id などで書く）', (s) => /^\/cases\/(:id|\[id\]|\{id\}|<id>|\d+)$/.test(arrow(lines(s), '[id]')), ['[id] の部分に、案件ごとの値が入る。']],
    ]), 230);

  const SOL_MODE = '社内ツール（ログイン後だけ見える） → SPA\nランディングページ（ほぼ更新なし・表示速度重視） → SSG\nニュースサイト（記事が毎分増える・検索に出したい） → SSR';
  const renderPick = text('mode.txt', '# 要件に合う方式（SPA / SSG / SSR）を書こう\n社内ツール（ログイン後だけ見える） → \nランディングページ（ほぼ更新なし・表示速度重視） → \nニュースサイト（記事が毎分増える・検索に出したい） → \n', '<b>選び方</b><br>SEO 不要・操作が多い → SPA<br>更新が少ない・速さ重視 → SSG<br>常に新しい・SEO 重要 → SSR', SOL_MODE,
    mk('mode.txt', 'txt', SOL_MODE, [
      [1, '社内ツール（ログイン後だけ）', (s) => /^SPA\b/i.test(arrow(lines(s), '社内ツール')), ['検索エンジンに載せなくてよく、操作が多い。']],
      [2, 'ランディングページ（ほぼ更新なし）', (s) => /^SSG\b/i.test(arrow(lines(s), 'ランディング')), ['先に作っておけば、いちばん速い。']],
      [3, 'ニュースサイト（記事が毎分増える・検索に出したい）', (s) => /^(SSR|ISR)\b/i.test(arrow(lines(s), 'ニュース')), ['新しい内容を、検索エンジンにも見せたい。']],
    ]), 230);

  D['x-vue-render'] = { '誰がいつ HTML を作る？': renderWho, 'Nuxt が自動でやること': renderNuxt, '方式えらびクイズ': renderPick };

  /* ========================================================= x-vue-workflow */
  const SOL_WF = 'Issue を作る\nBranch を切る\nコードを書く\nCommit する\nPR を出す\nReview を受ける\nテストが失敗したので修正する\nMerge する';
  const wfFlow = text('flow.txt', '# 1つの機能ができるまでの順番を、1行ずつ書こう\n# （Issue / Branch / コード / Commit / PR / Review / Merge）\n', '<b>1周の流れ</b><br>Issue → Branch → コード → Commit → PR → Review → Merge<br>テストが失敗したら、<b>直してから</b>マージ。', SOL_WF,
    mk('flow.txt', 'txt', SOL_WF, [
      [1, 'Issue → Branch → PR → Merge の順に書く', (s) => { const L = lines(s); const a = idx(L, /issue/i), b = idx(L, /branch|ブランチ|枝/i, a + 1), c = idx(L, /\bPR\b|プルリク|pull request/i, b + 1), d = idx(L, /merge|マージ/i, c + 1); return a >= 0 && b > a && c > b && d > c; }, ['Issue から始めて、Merge で終わる。']],
      [2, 'コード・Commit・Review も入れて、7つの順番に並べる', (s) => { const L = lines(s); let p = -1; for (const re of [/issue/i, /branch|ブランチ|枝/i, /コード|実装|書く/, /commit|コミット/i, /\bPR\b|プルリク|pull request/i, /review|レビュー/i, /merge|マージ/i]) { const i = idx(L, re, p + 1); if (i < 0) return false; p = i; } return true; }, ['PR のあとに Review、最後に Merge。']],
      [3, 'テストが失敗した場合の「修正する」行を、Review と Merge の間に入れる', (s) => { const L = lines(s); const r = idx(L, /review|レビュー/i), f = idx(L, /修正|直す|fix/i, r + 1), m = idx(L, /merge|マージ/i, f + 1); return r >= 0 && f > r && m > f; }, ['失敗したら戻って直し、もう一度チェックしてから Merge。']],
    ]), 260);

  const SOL_PRETTIER = "const plan = { name: 'basic', fee: 5000 };\nfunction calcTotal(p) {\n  return p.fee * 1.1;\n}\nconsole.log(calcTotal(plan));";
  const wfPrettier = text('app.js', 'const plan = {name:"basic",fee:5000}\nfunction calcTotal(p){\nreturn p.fee * 1.1\n}\nconsole.log(calcTotal(plan))\n', '<b>Prettier のルール</b><br>・文字は <code>\'シングル\'</code> クォート<br>・文の終わりに <code>;</code><br>・インデントは<b>スペース2つ</b><br>・<code>{ name: 1 }</code> のように、記号のあとに空白', SOL_PRETTIER,
    mk('app.js', 'js', SOL_PRETTIER, [
      [1, '文字列を、シングルクォート（\'）にそろえる', (s) => !/"/.test(s) && /'basic'/.test(s), ['"basic" → \'basic\'']],
      [2, '文の終わりに ; を付ける（const / return / console.log）', (s) => lines(s).filter((x) => /^(const|let|return|console)\b/.test(x)).every((x) => /;$/.test(x)) && /^\s*return\b/m.test(s), ['行の最後に ; を足す。']],
      [3, 'return の行を、スペース2つでインデントし、{ name: \'basic\', fee: 5000 } と空白を入れる', (s) => /^ {2}return\b/m.test(s) && /\{ name: 'basic', fee: 5000 \}/.test(s), ['タブや4つではなく、スペース2つ。', '{ のあとと } の前、: と , のあとに空白。']],
    ]), 280);

  const SOL_CMT = 'const TAX_RATE = 1.1; // 消費税10%（法律で決まっている）\nconst total = price * TAX_RATE;\n// 在庫が無い商品は、注文できないので何もせずに戻る\nif (stock === 0) return;\ni++;';
  const wfComment = text('shop.js', '// i を 1 増やす\ni++;\n// 税込み価格を計算する\nconst total = price * 1.1;\n// 在庫が 0 のとき\nif (stock === 0) return;\n', '<b>「何を」ではなく「なぜ」</b><br>コードを見れば分かることは書かない。<br>見ても分からない<b>理由</b>を書く。<br>数字の意味は、<b>名前を付ける</b>と伝わる。', SOL_CMT,
    mk('shop.js', 'js', SOL_CMT, [
      [1, '見れば分かるコメント「i を 1 増やす」を消す', (s) => /\bi\+\+/.test(s) && !/i を 1 増やす/.test(s), ['コードがそのまま説明になっているコメントは要らない。']],
      [2, 'if (stock === 0) の直前に、「なぜ」を書くコメント（ため・ので・から など）を入れる', (s) => { const L = (s || '').split('\n').map((x) => x.trim()); const i = L.findIndex((x) => /^if\s*\(\s*stock\s*===\s*0/.test(x)); return i > 0 && /^\/\//.test(L[i - 1]) && /ため|ので|から|理由|なぜ/.test(L[i - 1]) && !/^\/\/\s*在庫が 0 のとき$/.test(L[i - 1]); }, ['「在庫が0のとき」は何を（what）。', '「注文できないので戻る」が、なぜ（why）。']],
      [3, '1.1 に名前を付ける（const TAX_RATE = 1.1）。total はその名前を使う', (s) => { const c = noCmt(s); return /const\s+TAX\w*\s*=\s*1\.1/.test(c) && /total\s*=\s*price\s*\*\s*TAX\w*/.test(c) && !/\*\s*1\.1/.test(c); }, ['意味のある数字は、名前を付けて定数にする。']],
    ]), 260);

  D['x-vue-workflow'] = { '1 つの機能ができるまで': wfFlow, 'Prettier：保存で整う': wfPrettier, 'コメント：「なぜ」を書く': wfComment };
})();
