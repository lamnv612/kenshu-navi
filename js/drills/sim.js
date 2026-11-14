/* シミュレータ型の練習・最終チャレンジ（本物のターミナル／Vim／Git 練習場で、状態を見て判定する）
   形式は js/test-ui.js の buildSim を参照。ファイルに「コマンドの文字」を書くタイプはここで置き換えた。 */
(function () {
  const K = window.KENSHU;
  const D = (K.drills = K.drills || {}), TT = (K.tests = K.tests || {});
  const FILES = { 'index.html': '<h1>研修ナビ</h1>\n', 'README.md': '# app\n', 'style.css': 'h1 { color: #333; }\n' };
  const m = (level, label, ok, hint, ans) => ({ level, label, ok: !!ok, hint: [].concat(hint || []), answer: ans ? { code: ans, lang: 'sh' } : undefined });
  const hasRan = (S, re) => S.ran.some((r) => re.test(r.line));
  const seqRan = (S, res) => { let f = 0; for (const re of res) { const i = S.ran.findIndex((r, k) => k >= f && re.test(r.line)); if (i < 0) return false; f = i + 1; } return true; };
  const newCommits = (S, base) => [...S.q.ancestors(S.q.tip())].filter((x) => !S.q.ancestors(base).has(x));
  const semver = /^v\d+\.\d+\.\d+$/;
  const SC = [
              { id: 'feat', t: '新機能をチームに出す', sub: '初級〜上級',
                story: 'あなたは「ログイン画面」の担当になった。出社したら、GitHub の main には同僚の変更が入っているらしい。<b>最新の main から枝を作って、PR で取り込んでもらおう</b>。',
                gh: ['merge:main', 'colleague:main'],
                seed(sim) { sim.seed({ commits: [{ msg: 'first commit', files: FILES, push: true }, { msg: 'README を整える', files: { 'README.md': '# app\nログインは未実装\n' }, push: true }], remoteOnly: [{ msg: '同僚: フッターを追加', files: { 'footer.html': '<footer>team</footer>\n' } }] }); },
                ms: [
                  { lv: 1, l: 'GitHub の最新を取り込んで、手元の main を最新にする', ok: (s) => s.S.branches.main === s.S.remote.main, hint: '同僚の変更は GitHub の main にある。それを手元に取り込むコマンドは？', ans: 'git pull' },
                  { lv: 1, l: 'feature/ で始まる名前の枝を作って、そこに移る', ok: (s) => s.S.head.startsWith('feature/'), hint: '枝を作って移動する 1 つのコマンドは <code>git checkout -b 名前</code>', ans: 'git checkout -b feature/login' },
                  { lv: 2, l: 'その枝で、ファイルを変えて <b>2 回</b> commit する', ok: (s) => s.S.head.startsWith('feature/') && s.q.ahead(s.q.tip(), s.S.branches.main) >= 2, hint: '変更は <code>echo "..." &gt;&gt; index.html</code>（&gt;&gt; は追記）。そのあと add → commit を 2 回', ans: 'echo "<form></form>" >> index.html\ngit add index.html\ngit commit -m "ログインフォームを追加"\necho "<button>送信</button>" >> index.html\ngit add index.html\ngit commit -m "送信ボタンを追加"' },
                  { lv: 2, l: 'GitHub に送る（次から git push だけで済むよう <code>-u</code> も付ける）', ok: (s) => s.S.head.startsWith('feature/') && s.S.remote[s.S.head] === s.q.tip() && s.S.upstream[s.S.head], hint: '<code>git push -u origin 枝の名前</code>', ans: 'git push -u origin feature/login' },
                  { lv: 3, l: '上の「GitHub」ボタンで PR を Merge したあと、手元の main を最新にして、変更を手に入れる', ok: (s) => { const f = s.S.lastPush; return !!f && s.S.branches[f] && s.q.isAnc(s.S.branches[f], s.S.remote.main) && s.S.branches.main === s.S.remote.main && s.q.isAnc(s.S.branches[f], s.S.branches.main); }, hint: 'GitHub で Merge しても、手元の main は古いまま。<code>git checkout main</code> → <code>git pull</code>', ans: '# 上の「PR を Merge」ボタンを押したあと\ngit checkout main\ngit pull' },
                ] },
              { id: 'hot', t: '本番の不具合（hotfix）', sub: '初級〜上級',
                story: '本番で「ログイイン画面」と<b>誤字</b>が出ていると連絡が来た。develop には開発中の変更が入っていて、まだ出せない。<b>main から枝を作って直し、develop にも同じ修正を入れよう</b>。',
                gh: ['merge:main', 'merge:develop'],
                seed(sim) { sim.seed({ commits: [{ msg: 'first commit', files: { 'index.html': '<h1>ログイイン画面</h1>\n', 'README.md': '# app\n' }, push: true }, { msg: 'dev: 検索機能（開発中）', files: { 'search.html': '<input>\n' }, branch: 'develop', push: true }], head: 'main' }); },
                ms: [
                  { lv: 1, l: '<b>main から</b> hotfix/ で始まる枝を作って、そこに移る', ok: (s) => s.S.head.startsWith('hotfix/') && s.q.isAnc(s.S.branches.main, s.q.tip()) && !s.q.isAnc(s.S.branches.develop, s.q.tip()), hint: 'いまは main にいる。そのまま <code>git checkout -b hotfix/名前</code>（develop の開発中の変更は含めない）', ans: 'git checkout -b hotfix/login-typo' },
                  { lv: 1, l: '誤字（ログイイン）を直して commit する', ok: (s) => { const h = s.S.head.startsWith('hotfix/') && s.q.ahead(s.q.tip(), s.S.branches.main) >= 1; const t = s.q.headTree()['index.html'] || ''; return h && /ログイン/.test(t) && !/ログイイン/.test(t); }, hint: '<code>echo "<h1>…</h1>" &gt; index.html</code> で書き換え（&gt; は上書き）→ add → commit', ans: 'echo "<h1>ログイン画面</h1>" > index.html\ngit add index.html\ngit commit -m "fix: ログインの誤字を修正"' },
                  { lv: 2, l: '修正を GitHub に送る', ok: (s) => s.S.head.startsWith('hotfix/') && s.S.remote[s.S.head] === s.q.tip(), hint: '新しい枝の最初の push は <code>-u origin 枝名</code>', ans: 'git push -u origin hotfix/login-typo' },
                  { lv: 2, l: '「GitHub」ボタンで PR を <b>main</b> に Merge →（本番に反映）→ 手元の main も最新にする', ok: (s) => { const f = s.S.lastPush; return !!f && s.q.isAnc(s.S.branches[f] || '', s.S.remote.main) && s.S.branches.main === s.S.remote.main && /ログイン画面/.test((s.q.C(s.S.branches.main).tree['index.html']) || ''); }, hint: 'ボタンを押す → <code>git checkout main</code> → <code>git pull</code>', ans: '# 「PR を Merge（→ main）」を押したあと\ngit checkout main\ngit pull' },
                  { lv: 3, l: '<b>同じ修正を develop にも</b>入れる（「PR を Merge（→ develop）」ボタン）', ok: (s) => { const f = s.S.lastPush; return !!f && s.q.isAnc(s.S.branches[f] || '', s.S.remote.develop); }, hint: '忘れると、次のリリースで誤字が復活する。develop にも PR を Merge しよう', ans: '# GitHub の「PR を Merge（→ develop）」ボタン' },
                ] },
              { id: 'oops', t: '間違えた（まだ push 前）', sub: 'amend / reset',
                story: 'ログイン画面を commit したあとで、<b>メッセージに誤字（typoo）</b>と<b>デバッグ用の console.log</b>に気づいた。まだ push していないので、<b>履歴を作り直して</b>OK。',
                gh: [],
                seed(sim) { sim.seed({ commits: [{ msg: 'first commit', files: { 'index.html': '<h1>研修ナビ</h1>\n', 'README.md': '# app\n' }, push: true }, { msg: 'ログイン画面をつくる（typoo）', files: { 'login.html': '<form></form>\nconsole.log("debug")\n' }, branch: 'feature/login' }], head: 'feature/login' }); sim.S.marks = { base: sim.S.branches.main }; },
                ms: [
                  { lv: 1, l: '直前の commit の<b>メッセージ</b>の誤字を直す（commit の数は増やさない）', ok: (s) => { const c = s.q.C(s.q.tip()); return c.parents[0] === s.S.marks.base && /ログイン画面/.test(c.msg) && !/typoo/.test(c.msg); }, hint: '直前の commit を作り直す: <code>git commit --amend -m "新しいメッセージ"</code>', ans: 'git commit --amend -m "ログイン画面をつくる"' },
                  { lv: 2, l: '直前の commit を<b>取り消して</b>、変更は<b>ステージに残す</b>', ok: (s) => s.q.tip() === s.S.marks.base && s.S.index['login.html'] !== undefined, hint: '<code>git reset --soft HEAD~1</code>（HEAD~1 ＝ ひとつ前）。soft は変更を残す', ans: 'git reset --soft HEAD~1' },
                  { lv: 3, l: 'console.log を<b>消して</b>、正しいメッセージで commit し直す', ok: (s) => { const c = s.q.C(s.q.tip()); const f = c.tree['login.html'] || ''; return c.parents[0] === s.S.marks.base && f.length > 0 && !/console\.log/.test(f) && !/typoo/.test(c.msg); }, hint: 'reset --soft で戻す → <code>echo "…" &gt; login.html</code> で書き直す → add → commit', ans: 'git reset --soft HEAD~1\necho "<form></form>" > login.html\ngit add login.html\ngit commit -m "ログイン画面をつくる"' },
                ] },
              { id: 'revert', t: '間違えた（push 済み）', sub: 'revert',
                story: '<b>デバッグを有効にした commit</b>を、もう GitHub に push してしまった。他の人もそれを pull しているかもしれない。<b>履歴を書き換えず</b>に取り消そう。',
                gh: [],
                seed(sim) { sim.seed({ commits: [{ msg: 'first commit', files: { 'index.html': '<h1>研修ナビ</h1>\n', 'config.js': 'DEBUG=false\n' }, push: true }, { msg: 'デバッグを有効にした', files: { 'config.js': 'DEBUG=true\n' }, push: true }, { msg: '見出しを変更', files: { 'index.html': '<h1>研修ナビ 2</h1>\n' }, push: true }] }); sim.S.marks = { bad: sim.q.rev('HEAD~1') }; },
                ms: [
                  { lv: 1, l: 'git log で履歴を見て、問題の commit（デバッグを有効にした）を探す', ok: (s) => !!s.S.did.log, hint: '<code>git log --oneline</code> が短くて見やすい', ans: 'git log --oneline' },
                  { lv: 2, l: '問題の commit を <b>revert</b> で取り消す（元の commit は残る）', ok: (s) => /DEBUG=false/.test(s.q.headTree()['config.js'] || '') && s.q.isAnc(s.S.marks.bad, s.q.tip()) && [...s.q.ancestors(s.q.tip())].some((x) => /^Revert/.test(s.q.C(x).msg)), hint: '<code>git revert 問題のハッシュ</code>。履歴は消さず、取り消す commit が 1 つ増える', ans: (s) => 'git log --oneline\ngit revert ' + s.S.marks.bad },
                  { lv: 3, l: '取り消した結果を GitHub に送る', ok: (s) => s.S.remote.main === s.q.tip() && [...s.q.ancestors(s.q.tip())].some((x) => /^Revert/.test(s.q.C(x).msg)), hint: '<code>git push</code>。push 済みの履歴は reset ではなく revert で直す（他の人の履歴を壊さない）', ans: 'git push' },
                ] },
              { id: 'stash', t: '作業中に急ぎの依頼', sub: 'stash',
                story: 'feature/login で<b>作業中（まだ commit していない）</b>のとき、「main の緊急修正をお願い」と頼まれた。<b>いまの作業を一時的にしまって</b>対応し、あとで<b>元に戻そう</b>。',
                gh: [],
                seed(sim) { sim.seed({ commits: [{ msg: 'first commit', files: { 'index.html': '<h1>研修ナビ</h1>\n', 'README.md': '# app\n' }, push: true }, { msg: 'ログイン画面', files: { 'login.html': '<form></form>\n' }, branch: 'feature/login', push: true }, { msg: 'main: 見出しを更新', files: { 'index.html': '<h1>研修ナビ v2</h1>\n' }, branch: 'main', push: true }], head: 'feature/login', work: { 'index.html': '<h1>研修ナビ（作業中）</h1>\n' } }); },
                ms: [
                  { lv: 1, l: 'まず main に移ってみる（変更が残っているのでエラーになる）→ 作業を<b>一時的にしまう</b>', ok: (s) => (s.S.maxStash || 0) >= 1, hint: 'エラーの通り「commit か stash」が必要。commit したくないときは <code>git stash</code>', ans: 'git checkout main\ngit stash' },
                  { lv: 2, l: 'main から hotfix/ の枝を作り、緊急修正を commit する', ok: (s) => Object.keys(s.S.branches).some((b) => b.startsWith('hotfix/') && s.S.branches[b] !== s.S.branches.main && s.q.isAnc(s.S.branches.main, s.S.branches[b])), hint: '<code>git checkout main</code> → <code>git checkout -b hotfix/名前</code> → 修正 → add → commit', ans: 'git checkout main\ngit checkout -b hotfix/urgent\necho "緊急修正" >> README.md\ngit add README.md\ngit commit -m "fix: 緊急対応"' },
                  { lv: 3, l: 'feature/login に戻って、しまった作業を<b>取り出す</b>', ok: (s) => s.S.head === 'feature/login' && (s.S.maxStash || 0) >= 1 && s.S.stash.length === 0 && /作業中/.test(s.q.work()['index.html'] || ''), hint: '枝を戻したら <code>git stash pop</code>（取り出して、stash から消す）', ans: 'git checkout feature/login\ngit stash pop' },
                ] },
            ];
  const SCN = {}; SC.forEach((x) => { SCN[x.id] = x; });
  const fromSC = (id, extra) => Object.assign({ kind: 'git', note: SCN[id].story, gh: SCN[id].gh, seed: SCN[id].seed,
    solution: (S) => SCN[id].ms.map((x) => (typeof x.ans === 'function' ? x.ans(S.git) : x.ans)).join('\n').replace(/^# 上の「PR を Merge」ボタンを押したあと$/m, '@merge:main').replace(/^# 「PR を Merge（→ main）」を押したあと$/m, '@merge:main').replace(/^# GitHub の「PR を Merge（→ develop）」ボタン$/m, '@merge:develop'),
    tasks: (S) => SCN[id].ms.map((x) => m(x.lv, x.l, x.ok(S.git), x.hint, typeof x.ans === 'function' ? x.ans(S.git) : x.ans)) }, extra || {});

  const NOTE = (t) => '<b>やること</b><br>' + t + '<br>下のミッションが、<b>実際の操作の結果</b>で ✓ になります。';

  /* ================= cuivim ================= */
  D.cuivim = Object.assign(D.cuivim || {}, {
    'なぜターミナル？': {
      kind: 'term', files: { 'photo1.jpg': '', 'photo2.jpg': '', 'photo3.jpg': '', 'photo4.jpg': '', 'photo5.jpg': '', 'photo6.jpg': '' },
      note: NOTE('写真 6 枚に <code>trip_</code> を付ける。まず 1 枚だけ手で。そのあと「1 行でまとめて」を体験しよう。'),
      solution: 'mv photo1.jpg trip_photo1.jpg\nfor f in photo*.jpg; do mv "$f" "trip_$f"; done',
      tasks: (S) => [
        m(1, 'mv で photo1.jpg を trip_photo1.jpg に名前変更する', S.exists('/trip_photo1.jpg') && !S.exists('/photo1.jpg'), ['名前変更は <code>mv 元の名前 新しい名前</code>。'], 'mv photo1.jpg trip_photo1.jpg'),
        m(2, 'for を使って、残りの photo*.jpg を <b>1 行で</b>ぜんぶ trip_ 付きにする', [2, 3, 4, 5, 6].every((n) => S.exists('/trip_photo' + n + '.jpg') && !S.exists('/photo' + n + '.jpg')) && S.ran.some((r) => r.cmd === 'for'), ['<code>for f in photo*.jpg; do …; done</code> の「…」に mv を書く。', '$f が 1 枚ずつ入れ替わる。名前は <code>"trip_$f"</code>。'], 'for f in photo*.jpg; do mv "$f" "trip_$f"; done'),
      ],
    },
    'ターミナルを触ってみよう': {
      kind: 'term', note: NOTE('いまの場所を知って、フォルダを行き来する。'),
      solution: 'pwd\nls\ncd docs\ncd ..',
      tasks: (S) => [
        m(1, 'pwd で今の場所を見て、ls で中身を見る（この順）', seqRan(S, [/^pwd$/, /^ls\b/]), ['まず「どこ？」= pwd、次に「何がある？」= ls。'], 'pwd\nls'),
        m(2, 'cd docs で入って、cd .. で 1 つ上に戻る（この順。最後はホームにいる）', seqRan(S, [/^cd\s+docs\/?$/, /^cd\s+\.\.\/?$/]) && S.cwd().length === 0, ['<code>..</code> は 1 つ上のフォルダ。'], 'cd docs\ncd ..'),
      ],
    },
    'Vim：3つのモード': {
      kind: 'vim', note: NOTE('本番サーバーの設定 <code>app.conf</code> の <code>debug = true</code> を <b>false に直して保存</b>する。エディタをクリックして、キーボードで操作。'),
      solution: 'j\nj\nw\nw\nx\nx\nx\nx\ni\nfalse\nEsc\n:wq',
      tasks: (S) => {
        const ix = (n) => S.hist.indexOf(n), lastType = S.hist.lastIndexOf('type'), edited = /^debug = false\b/.test(S.lines[2] || '');
        return [
          m(1, 'i で INSERT モードに入り、文字を打って、Esc で NORMAL モードに戻る', ix('i') >= 0 && S.hist.indexOf('type', ix('i')) > ix('i') && S.hist.indexOf('Esc', S.hist.indexOf('type')) > 0 && S.mode === 'NORMAL', ['書く前に <kbd>i</kbd>、書き終わったら <kbd>Esc</kbd>。間に何か打つ。'], 'i\nX\nEsc'),
          m(2, '<code>debug = true</code> の true を false に直す（j で下へ、w で単語ごとに右へ、x で 1 文字消して、i で書く）', edited, ['3 行目まで <kbd>j</kbd> を 2 回。<kbd>w</kbd> を 2 回で true の頭。<kbd>x</kbd> を 4 回で true が消える。', '<kbd>i</kbd> → false と打つ → <kbd>Esc</kbd>。'], 'j\nj\nw\nw\nx\nx\nx\nx\ni\nfalse\nEsc'),
          m(3, 'Esc のあと :wq で、直した設定を保存して終了する', edited && S.hist.lastIndexOf('wq') > lastType && lastType >= 0, ['コマンドは <kbd>Esc</kbd> で戻ってから。<code>:wq</code> ＋ Enter ＝ 保存して終了。'], ':wq'),
        ];
      },
    },
  });

  /* ================= git ================= */
  const gitSeedPrice = (sim) => { sim.seed({ commits: [{ msg: '料金表を作成', files: { 'price.html': '<p>基本 25,000円</p>\n' }, push: true }], work: { 'price.html': '<p>基本 35,000円（値上げ）</p>\n' } }); sim.S.marks = { base: sim.tip() }; };
  const mergedFix = (S, f) => !!S.S.lastPush && S.q.isAnc(S.S.branches[S.S.lastPush] || '', S.S.remote.main);
  D.git = Object.assign(D.git || {}, {
    'なぜ Git？': {
      kind: 'git', seed: gitSeedPrice, note: NOTE('<code>price.html</code> の料金を直した。変更を<b>履歴</b>に残して、あとで見返す。'),
      solution: 'git status\ngit add price.html\ngit commit -m "料金表を35,000円に更新"\ngit log --oneline',
      tasks: (S) => [
        m(1, '変更した price.html を add して、commit で履歴に残す', S.q.tip() !== S.S.marks.base && /35,000/.test(S.q.headTree()['price.html'] || ''), ['選ぶ（add）→ 記録する（commit -m "メッセージ"）。先に git status で、何が変わったか見てもいい。'], 'git add price.html\ngit commit -m "料金表を35,000円に更新"'),
        m(2, 'commit のあとに git log で、履歴（誰が・いつ・なぜ）を見る', S.q.tip() !== S.S.marks.base && !!S.did.log, ['履歴を見るのは <code>git log</code>（<code>--oneline</code> で短く）。'], 'git log --oneline'),
      ],
    },
    '4つの場所とコマンド': {
      kind: 'git', note: NOTE('作りかけの <code>b.html</code> は<b>記録せず</b>、<code>a.html</code> だけ記録して、自分の枝を GitHub に送る。'),
      seed(sim) { sim.seed({ commits: [{ msg: 'first commit', files: FILES, push: true }, { msg: 'feature/a-page を作る', files: {}, branch: 'feature/a-page' }], head: 'feature/a-page', work: { 'a.html': '<h1>A</h1>\n', 'b.html': '<h1>B（作りかけ）</h1>\n' } }); sim.S.marks = { main0: sim.S.remote.main }; },
      solution: 'git status\ngit add a.html\ngit commit -m "feat: a.html を追加"\ngit push -u origin feature/a-page',
      tasks: (S) => { const t = S.q.headTree(); return [
        m(1, 'a.html だけを add して commit する（git add . は使わない）', !!t['a.html'] && !t['b.html'], ['add のあとに、記録したいファイル名だけを書く。<code>git status</code> で、何がどこにあるか確かめられる。'], 'git add a.html\ngit commit -m "feat: a.html を追加"'),
        m(2, '自分の枝（feature/a-page）を git push -u origin で GitHub に送る（main へは直接送らない）', S.S.remote['feature/a-page'] === S.q.tip() && !!S.S.upstream['feature/a-page'] && S.S.remote.main === S.S.marks.main0, ['作業フォルダ → ステージ → ローカル → リモート の順に進む。送るのは自分の作業用の枝。'], 'git push -u origin feature/a-page'),
      ]; },
    },
    'ブランチとマージ': fromSC('feat'),
    'コミットの書き方・PR の書き方': {
      kind: 'git', note: NOTE('2 つのファイルを直した。<b>1 つの commit に 1 つのこと</b>。種類（feat: / fix:）を付けて、別々に commit する。'),
      seed(sim) { sim.seed({ commits: [{ msg: '料金ページを作成', files: { 'price.html': '<p>書面 25,000円</p>\n', 'search.html': '<h1>案件検索</h1>\n' }, push: true }], work: { 'price.html': '<p>書面 35,000円</p>\n', 'search.html': '<h1>案件検索</h1>\n<input>\n' } }); sim.S.marks = { base: sim.tip() }; },
      solution: 'git add price.html\ngit commit -m "fix: 書面の金額を 35,000 円に直す"\ngit add search.html\ngit commit -m "feat: 案件検索ボックスを追加"',
      tasks: (S) => { const ids = newCommits(S, S.S.marks.base), msgs = ids.map((id) => S.q.C(id).msg); return [
        m(1, '「feat: ○○」の形で commit する', msgs.some((x) => /^feat(\([^)]*\))?:\s*\S.{2,}/.test(x)), ['<code>git commit -m "feat: 案件検索ボックスを追加"</code> のように、先頭に「種類:」を付ける。'], 'git add search.html\ngit commit -m "feat: 案件検索ボックスを追加"'),
        m(2, '「fix: ○○」の commit も作る（種類の違うものは別々に）', msgs.some((x) => /^fix(\([^)]*\))?:\s*\S.{2,}/.test(x)), ['バグ修正は fix、新しい機能は feat。'], 'git add price.html\ngit commit -m "fix: 書面の金額を 35,000 円に直す"'),
        m(3, 'price.html と search.html を、<b>別々の commit</b> にする（1 つの commit に 1 つのファイル）', ids.length >= 2 && ids.every((id) => S.q.changed(id).length === 1), ['<code>git add .</code> でまとめず、ファイル名を指定して add → commit を 2 回。'], 'git add price.html\ngit commit -m "fix: 書面の金額を直す"\ngit add search.html\ngit commit -m "feat: 案件検索を追加"'),
      ]; },
    },
    'レビュー指摘に対応': {
      kind: 'git', gh: ['merge:main'], note: NOTE('PR のレビューで「空のとき全件が出る」と指摘された。<b>同じ枝のまま</b>直して push する（PR は出し直さない）。'),
      seed(sim) { sim.seed({ commits: [{ msg: 'first commit', files: FILES, push: true }, { msg: 'feat: 案件検索', files: { 'search.html': '<input>\n' }, branch: 'feature/search', push: true }], head: 'feature/search', work: { 'search.html': '<input>\n<!-- 空のときは検索しない -->\n' } }); sim.S.marks = { pushed: sim.tip() }; },
      solution: 'git add search.html\ngit commit -m "fix: 空のときは検索しない"\ngit push\n@merge:main\ngit checkout main\ngit pull\ngit branch -d feature/search',
      tasks: (S) => { const c = S.q.C(S.q.tip()); return [
        m(1, '直したファイルを add して、「fix: …」で commit する（同じ枝の上に）', S.q.tip() !== S.S.marks.pushed && c.parents[0] === S.S.marks.pushed && /^fix(\([^)]*\))?:\s*\S.{2,}/.test(c.msg), ['直した内容がわかるメッセージにする。種類は fix。'], 'git add search.html\ngit commit -m "fix: 空のときは検索しない"'),
        m(2, '同じ枝へ git push する（-u は不要）。新しい枝を作って PR を出し直さない', S.q.tip() !== S.S.marks.pushed && S.S.remote['feature/search'] === S.q.tip() && Object.keys(S.S.branches).length === 2, ['もう upstream は設定済み。<code>git push</code> だけで、PR に commit が追加される。'], 'git push'),
        m(3, '上の「GitHub」ボタンで Merge したら、main に戻って pull し、役目を終えた枝を git branch -d で消す', S.S.head === 'main' && S.S.branches.main === S.S.remote.main && !S.S.branches['feature/search'] && /空のとき/.test(S.q.headTree()['search.html'] || ''), ['Merge は GitHub 上で済んでいる。手元は pull で追いつく → 枝を掃除。'], '# 上の「PR を Merge」ボタンを押したあと\ngit checkout main\ngit pull\ngit branch -d feature/search'),
      ]; },
    },
    'ミスを取り消す': {
      kind: 'git', note: NOTE('<b>push 前</b>と<b>push 後</b>で使うコマンドが違う。みんなが見ている履歴は<b>書き換えず</b>、取り消す commit を足す。'),
      seed(sim) { sim.seed({ commits: [{ msg: 'first commit', files: { 'index.html': '<h1>研修ナビ</h1>\n', 'config.js': 'DEBUG=false\n' }, push: true }, { msg: 'デバッグを有効にした', files: { 'config.js': 'DEBUG=true\n' }, push: true }, { msg: 'ログイン画面をつくる（typoo）', files: { 'login.html': '<form></form>\nconsole.log("debug")\n' } }] }); sim.S.marks = { bad: sim.q.rev('HEAD~1'), base: sim.q.rev('HEAD~1') }; },
      solution: (S) => 'git commit --amend -m "ログイン画面をつくる"\ngit reset --soft HEAD~1\necho "<form></form>" > login.html\ngit add login.html\ngit commit -m "ログイン画面をつくる"\ngit revert ' + S.S.marks.bad + '\ngit push',
      tasks: (S) => { const c = S.q.C(S.q.tip()), lg = S.q.headTree()['login.html'] || ''; return [
        m(1, '【push 前】直前の commit の<b>メッセージ</b>の誤字（typoo）を直す（commit の数は増やさない）', c.parents[0] === S.S.marks.base && /ログイン画面/.test(c.msg) && !/typoo/.test(c.msg), ['直前の commit を作り直す：<code>git commit --amend -m "新しいメッセージ"</code>'], 'git commit --amend -m "ログイン画面をつくる"'),
        m(2, '【push 前】console.log を<b>消して</b>、きれいな中身で commit し直す（reset --soft HEAD~1 → 直す → commit）', c.parents[0] === S.S.marks.base && lg.length > 0 && !/console\.log/.test(lg), ['<code>git reset --soft HEAD~1</code> で取り消し（変更は残る）→ <code>echo "…" &gt; login.html</code> で書き直す → add → commit。'], 'git reset --soft HEAD~1\necho "<form></form>" > login.html\ngit add login.html\ngit commit -m "ログイン画面をつくる"'),
        m(3, '【push 済み】「デバッグを有効にした」を git revert で取り消して、GitHub に送る（reset や --force は使わない）', /DEBUG=false/.test(S.q.headTree()['config.js'] || '') && S.q.isAnc(S.S.marks.bad, S.q.tip()) && [...S.q.ancestors(S.q.tip())].some((x) => /^Revert/.test(S.q.C(x).msg)) && S.S.remote.main === S.q.tip(), ['<code>git log --oneline</code> でハッシュを探して <code>git revert ハッシュ</code> → <code>git push</code>。履歴は消さず、取り消す commit が 1 つ増える。'], (S2) => 'git revert ' + S.S.marks.bad + '\ngit push'),
      ]; },
    },
    '作業を一時退避：stash': fromSC('stash'),
    '履歴を調べる': {
      kind: 'git', note: NOTE('「書面の金額を、<b>誰が・いつ・なぜ</b>変えた？」を調べる。<code>log</code>（いつ）→ <code>blame</code>（誰が）→ <code>show</code>（何を）→ <code>diff</code>（2 点の差）。'),
      seed(sim) { sim.seed({ commits: [{ msg: '料金ページを作成', files: { 'price.html': '基本 15,000円\n相談 5,000円\n' }, push: true }, { msg: '基本料金を 20,000 円に変更（改定）', files: { 'price.html': '基本 20,000円\n相談 5,000円\n' }, push: true }, { msg: '書面作成の金額を追加', files: { 'price.html': '基本 20,000円\n相談 5,000円\n書面 25,000円\n' }, push: true }, { msg: '基本料金を 25,000 円に変更（再改定）', files: { 'price.html': '基本 25,000円\n相談 5,000円\n書面 25,000円\n' }, push: true }] }); },
      solution: 'git log --oneline price.html\ngit blame price.html\ngit show HEAD~1\ngit diff HEAD~3 HEAD',
      tasks: (S) => [
        m(1, 'git log --oneline price.html で、このファイルの履歴だけを見る', hasRan(S, /^git log\b.*price\.html/) && !!S.did.log, ['ファイル名を付けると、そのファイルを変えた commit だけが出る。'], 'git log --oneline price.html'),
        m(2, 'git blame price.html で行ごとの持ち主を見て、git show で commit の中身を見る（この順）', seqRan(S, [/^git blame\s+price\.html/, /^git show\b/]) && !!S.did.blame && !!S.did.show, ['blame は 1 行ごとに「最後に変えた commit」。show に ID（または <code>HEAD~1</code>）を渡す。'], 'git blame price.html\ngit show HEAD~1'),
        m(3, 'git diff で、2 つの時点（古い・新しい）を比べる', hasRan(S, /^git diff\s+\S+\s+\S+/) && !!S.did.diff, ['<code>git diff 古い 新しい</code>。例：<code>git diff HEAD~3 HEAD</code>（3 つ前といま）。'], 'git diff HEAD~3 HEAD'),
      ],
    },
    'リリースとタグ': {
      kind: 'git', note: NOTE('本番に出した版に<b>名前（タグ）</b>を付けておくと、「いま本番はどの版？」「どこに戻す？」に答えられる。'),
      seed(sim) { sim.seed({ commits: [{ msg: 'first commit', files: FILES, push: true }, { msg: 'feat: 案件検索', files: { 'search.html': '<input>\n' }, push: true }, { msg: 'fix: 誤字を直す', files: { 'index.html': '<h1>研修ナビ v2</h1>\n' }, push: true }] }); },
      solution: 'git tag v1.2.0\ngit push origin v1.2.0\ngit revert HEAD\ngit push\ngit tag v1.2.1\ngit push origin v1.2.1',
      tasks: (S) => { const tags = Object.keys(S.S.tags).filter((x) => semver.test(x)), pushed = S.ran.filter((r) => /^git push\s+origin\s+v\d+\.\d+\.\d+$/.test(r.line)); return [
        m(1, 'いまの版に、git tag v1.2.0 のように「v 数字.数字.数字」でタグを付ける', tags.length >= 1, ['タグは「v主.副.修正」。いまの commit に名前を付ける。'], 'git tag v1.2.0'),
        m(2, 'タグを GitHub に送る（git push origin v1.2.0）。push だけではタグは送られない', pushed.length >= 1, ['<code>git push origin タグ名</code>。'], 'git push origin v1.2.0'),
        m(3, '本番でバグ → git revert して push、新しいタグ（v1.2.1）を付けて送る', tags.length >= 2 && tags.some((x) => S.S.tags[x] === S.q.tip()) && [...S.q.ancestors(S.q.tip())].some((x) => /^Revert/.test(S.q.C(x).msg)) && S.S.remote.main === S.q.tip() && pushed.length >= 2, ['直した版には新しいタグ。古いタグは消さない（記録として残す）。'], 'git revert HEAD\ngit push\ngit tag v1.2.1\ngit push origin v1.2.1'),
      ]; },
    },
    '秘密情報を commit してしまった': {
      kind: 'git', note: NOTE('<b>.env（API キー入り）を push してしまった</b>。最優先は<b>サービス側でキーを無効化</b>（新しいキーを発行）。そのあと、二度と Git に入らないようにする。'),
      seed(sim) { sim.seed({ commits: [{ msg: 'first commit', files: { 'index.html': '<h1>研修ナビ</h1>\n', '.env': 'API_KEY=sk-live-xxxx\n' }, push: true }] }); },
      solution: 'echo ".env" >> .gitignore\ngit rm --cached .env\ngit add .gitignore\ngit commit -m "chore: .env を Git の管理から外す"\ngit push',
      tasks: (S) => [
        m(1, '.gitignore に .env を書く（echo ".env" >> .gitignore）', /^\.env$/m.test(S.file('/.gitignore') || ''), ['<code>echo ".env" &gt;&gt; .gitignore</code>。&gt;&gt; は追記。'], 'echo ".env" >> .gitignore'),
        m(2, 'git rm --cached .env で、Git の管理から外す（手元の .env ファイルは残る）', S.S.index['.env'] === undefined && S.file('/.env') !== null, ['<code>--cached</code> を付けると、実ファイルは消えず、Git の管理だけ外れる。'], 'git rm --cached .env'),
        m(3, '.gitignore を add → commit → push する', S.S.remote.main === S.q.tip() && S.q.headTree()['.env'] === undefined && S.q.headTree()['.gitignore'] !== undefined, ['.gitignore 自体も Git で管理する。'], 'git add .gitignore\ngit commit -m "chore: .env を Git の管理から外す"\ngit push'),
      ],
    },
    'GitHub と SSH でつなぐ': {
      kind: 'term', note: NOTE('パスワードの代わりに<b>鍵のペア</b>で GitHub につなぐ。作る → 公開鍵を GitHub に登録 → 接続テスト。'),
      solution: 'ssh-keygen -t ed25519\ncat ~/.ssh/id_ed25519.pub\nssh -T git@github.com',
      tasks: (S) => [
        m(1, 'ssh-keygen -t ed25519 で、鍵のペアを作る', !!S.exists('/.ssh/id_ed25519') && !!S.exists('/.ssh/id_ed25519.pub'), ['鍵づくりは <code>ssh-keygen</code>。種類は <code>-t ed25519</code>。'], 'ssh-keygen -t ed25519'),
        m(2, 'cat で公開鍵（.pub）を表示して（GitHub に貼り付ける）、ssh -T git@github.com で接続テストに成功する', S.st.registered > 0 && S.st.ssh > 0, ['GitHub に登録するのは「公開鍵（.pub）」だけ。秘密鍵は見せない。', '最後は <code>ssh -T git@github.com</code>。'], 'cat ~/.ssh/id_ed25519.pub\nssh -T git@github.com'),
      ],
    },
    'コンフリクトを解決しよう': {
      mode: 'text', height: 220,
      files: [{ name: 'index.html', lang: 'html', code: '<h1>\n<<<<<<< HEAD\nこんにちは（自分の変更）\n=======\nHello（main の変更）\n>>>>>>> main\n</h1>' }],
      note: NOTE('<code>git merge main</code> のあと、ファイルに残った<b>印</b>（&lt;&lt;&lt;&lt;&lt;&lt;&lt; / ======= / &gt;&gt;&gt;&gt;&gt;&gt;&gt;）を手で消して、最終的な内容にする。'),
      solution: '<h1>\nこんにちは（自分の変更）\nHello（main の変更）\n</h1>',
      tasks: (v) => { const t = String(v['index.html'] || ''), clean = !/<<<<<<<|=======|>>>>>>>/.test(t), body = t.replace(/<\/?h1>/g, '').trim(); return [
        { level: 1, label: '印（<<<<<<< / ======= / >>>>>>>）を 3 行とも全部消す（中身は残す）', ok: clean && body.length >= 5, hint: ['印の 3 行は Git が付けた目印。残したままだと、そのままコードとして扱われる。'], answer: { code: '<h1>\nこんにちは（自分の変更）\n</h1>', lang: 'html' } },
        { level: 2, label: '自分の行も main の行も、両方残す（印は全部消す）', ok: clean && /こんにちは/.test(t) && /Hello/.test(t), hint: ['どちらを残すかは人が決める。今回は両方の行を、印なしで残そう。'], answer: { code: '<h1>\nこんにちは（自分の変更）\nHello（main の変更）\n</h1>', lang: 'html' } },
      ]; },
    },
  });

  /* ================= x-terminal ================= */
  const APPLOG = 'INFO server started\nERROR E1001 DB connection failed\nerror retry 1\nINFO connected\nError E2040 timeout\nERROR E1001 DB connection failed\n';
  const ACCESS = '/consults 200\n/consults 500\n/price 200\n/cases 500\n/consults 500\n/cases 200\n/consults 500\n/cases 500\n';
  D['x-terminal'] = Object.assign(D['x-terminal'] || {}, {
    '困った：手作業の限界': {
      kind: 'term', files: { 'app.log': APPLOG }, note: NOTE('<code>app.log</code> の中の <b>ERROR</b> を、目で数えずに<b>命令</b>で調べる。'),
      solution: 'grep -c ERROR app.log\ngrep -n ERROR app.log',
      tasks: (S) => [
        m(1, 'grep で、app.log の ERROR の行数を数える（-c、または | wc -l）', hasRan(S, /^grep\s+(-c\s+ERROR|ERROR\s+-c)\s+app\.log$/) || hasRan(S, /^grep\s+ERROR\s+app\.log\s*\|\s*wc\s+-l$/), ['<code>grep -c</code> は一致した行数を数える。'], 'grep -c ERROR app.log'),
        m(2, 'grep -n で、ERROR の行を行番号つきで表示する', hasRan(S, /^grep\s+(-n\s+ERROR|ERROR\s+-n)\s+app\.log$/), ['<code>-n</code> で行番号つき。'], 'grep -n ERROR app.log'),
      ],
    },
    'キーボード便利技': {
      kind: 'term', files: { 'app.log': APPLOG }, note: NOTE('<b>打ち直さない</b>ためのキー。<kbd>↑</kbd> で前のコマンドを呼び出す、<kbd>Tab</kbd> で名前の続きを補完する。入力欄で実際に押してみよう。'),
      solution: 'ls\nls\ncat ap<Tab>',
      tasks: (S) => [
        m(1, '何かコマンド（例：ls）を打って、入力欄で ↑ を押して、同じコマンドをもう一度実行する', S.lines.some((x, i) => i > 0 && x.trim() && x.trim() === S.lines[i - 1].trim()), ['<kbd>↑</kbd> で 1 つ前に打ったコマンドが出る。そのまま Enter。'], 'ls\nls'),
        m(2, '<code>cat ap</code> まで打って <kbd>Tab</kbd> を押し、app.log に補完して実行する', S.st.tabs > 0 && hasRan(S, /^cat\s+app\.log$/), ['長いファイル名は、頭の数文字＋ <kbd>Tab</kbd>。候補が 1 つなら、残りを自動で書いてくれる。'], 'cat ap<Tab>'),
      ],
    },
    'パイプ ( | )：コマンドをつなぐ': {
      kind: 'term', files: { 'access.log': ACCESS }, note: NOTE('障害対応。<code>access.log</code>（各行は「URL ステータス」）から、<b>エラー（500）の多い URL</b> を出す。<code>|</code> で前の命令の出力を次に渡す。'),
      solution: 'cat access.log | grep " 500"\ncat access.log | grep " 500" | cut -d" " -f1 | sort | uniq -c | sort -rn\ncat access.log | grep " 500" | cut -d" " -f1 | sort | uniq -c | sort -rn > worst.txt',
      tasks: (S) => [
        m(1, 'access.log から、500 の行だけを取り出す（cat と grep を | でつなぐ）', S.ran.some((r) => r.pipe && /^cat\s+access\.log\s*\|\s*grep\s+["']\s?500["']\s*$/.test(r.line)) || hasRan(S, /^grep\s+["']\s?500["']\s+access\.log\s*$/), ['<code>cat access.log | grep " 500"</code>'], 'cat access.log | grep " 500"'),
        m(2, 'エラーの URL だけを取り出し、sort → uniq -c → sort -rn で「多い順」の数を出す', S.ran.some((r) => r.segs && /grep.*cut.*sort.*uniq.*sort/.test(r.segs.join(' '))), ['grep で 500 → cut で URL（1 つ目）→ sort で並べる → uniq -c で数える → sort -rn で多い順。'], 'cat access.log | grep " 500" | cut -d" " -f1 | sort | uniq -c | sort -rn'),
        m(3, 'その結果を > で worst.txt に保存する', /^\s*3\s+\/consults/m.test(S.file('/worst.txt') || '') && /^\s*2\s+\/cases/m.test(S.file('/worst.txt') || ''), ['最後に <code>&gt; worst.txt</code> を付ける。'], 'cat access.log | grep " 500" | cut -d" " -f1 | sort | uniq -c | sort -rn > worst.txt'),
      ],
    },
    'リダイレクト と grep': {
      kind: 'term', files: { 'app.log': APPLOG, 'memo.txt': '12:40 障害の連絡を受けた\n' }, note: NOTE('障害対応。<code>app.log</code> から原因の行を探して<b>ファイルに残し</b>、作業メモに<b>足す</b>。ログには ERROR も error も混ざっている。'),
      solution: 'grep ERROR app.log > errors.txt\necho "13:00 原因を調査" >> memo.txt\ngrep -i error app.log',
      tasks: (S) => { const ef = S.file('/errors.txt') || '', n = (APPLOG.match(/ERROR/g) || []).length; return [
        m(1, 'app.log から ERROR の行だけを探して、errors.txt に保存する（>）', ef.split('\n').filter(Boolean).length === n && ef.split('\n').filter(Boolean).every((x) => /ERROR/.test(x)), ['探すのは grep、保存は <code>&gt;</code>。'], 'grep ERROR app.log > errors.txt'),
        m(2, '作業メモ memo.txt に echo で 1 行を足す（>>）。そのあと、小文字の error も拾う grep -i で探す', (S.file('/memo.txt') || '').split('\n').filter(Boolean).length >= 2 && seqRan(S, [/^echo\s+.+>>\s*memo\.txt$/, /^grep\s+-\w*i\w*\s+["']?error["']?\s+app\.log$/]), ['<code>&gt;&gt;</code> は追記。大文字小文字を無視するのは <code>-i</code>。'], 'echo "13:00 原因を調査" >> memo.txt\ngrep -i error app.log'),
      ]; },
    },
    'oh-my-zsh：短縮 alias': {
      kind: 'git', seed: (sim) => { sim.seed({ commits: [{ msg: 'first commit', files: FILES, push: true }], work: { 'index.html': '<h1>研修ナビ 2</h1>\n' } }); },
      note: NOTE('長い命令に<b>短いあだ名</b>（alias）を付ける。付けたら、実際に使ってみる。'),
      solution: "alias gs='git status'\ngs\nalias ll='ls -l'\nll",
      tasks: (S) => [
        m(1, "alias gs='git status' を作って、gs と打って使う", S.aliases.gs === 'git status' && hasRan(S, /^gs$/), ["形は <code>alias 短い名前='長い命令'</code>。作ったら <code>gs</code> と打つだけで git status が動く。"], "alias gs='git status'\ngs"),
        m(2, 'alias を、もう 1 つ別の名前で作る（合計 2 つ以上）', Object.keys(S.aliases).length >= 2, ["例：<code>alias ll='ls -l'</code>"], "alias ll='ls -l'"),
      ],
    },
  });
  delete D['x-terminal']['どれを使う？：ターミナル編'];

  /* ================= dev / x-vue-workflow / vue-env ================= */
  const devTasks = (S) => [
    m(1, 'main を最新にして（checkout main → pull）、feature/○○ の枝を作って移る', S.S.head.startsWith('feature/') && S.q.isAnc(S.S.remote.main, S.q.tip()), ['新しい作業は、いつも最新の main から。<code>checkout main</code> → <code>pull</code> → <code>checkout -b feature/名前</code>。'], 'git checkout main\ngit pull\ngit checkout -b feature/login'),
    m(2, 'add → commit（メッセージは「feat: …」）→ git push -u origin 枝名 で送る', S.S.head.startsWith('feature/') && /^feat(\([^)]*\))?:\s*\S.{2,}/.test(S.q.C(S.q.tip()).msg) && S.S.remote[S.S.head] === S.q.tip() && !!S.S.upstream[S.S.head], ['コミットは <code>feat:</code> などで始める。初めて送る枝は <code>-u origin 枝名</code>。'], 'echo "<form></form>" >> index.html\ngit add index.html\ngit commit -m "feat: ログイン画面を追加"\ngit push -u origin feature/login'),
    m(3, '上の「GitHub」ボタンで PR を Merge したあと、main に戻って pull する', mergedFix(S) && S.S.head === 'main' && S.S.branches.main === S.S.remote.main, ['Merge は GitHub 上で行うので、手元の main は古いまま。<code>git checkout main</code> → <code>git pull</code>。'], '# 上の「PR を Merge」ボタンを押したあと\ngit checkout main\ngit pull'),
  ];
  const devSpec = {
    kind: 'git', gh: ['merge:main'], note: NOTE('1 つの機能を作って、見てもらうまで。<b>最新の main から枝</b> → commit → push → PR を Merge → main に戻って pull。'),
    seed: SCN.feat.seed, solution: 'git checkout main\ngit pull\ngit checkout -b feature/login\necho "<form></form>" >> index.html\ngit add index.html\ngit commit -m "feat: ログイン画面を追加"\ngit push -u origin feature/login\n@merge:main\ngit checkout main\ngit pull', tasks: devTasks,
  };
  D.dev = Object.assign(D.dev || {}, { '1日の流れ と Git': devSpec });
  TT.dev = devSpec;

  const WF = (sim) => { sim.seed({ commits: [{ msg: 'first commit', files: { 'app.js': 'const a={x:1}\n', 'index.html': '<div id="app"></div>\n' }, push: true }], work: { 'app.js': 'const a={x:1}\nconst b = 2\n' } }); };
  TT['x-vue-workflow'] = {
    kind: 'git', seed: WF, note: NOTE('機能を 1 つ作って、<b>コミットするまで</b>。ブランチ名は <code>feat/名前</code>、コミットの頭は <code>feat:</code>、コミット前に <b>Prettier</b>（整形）と <b>ESLint</b>（チェック）。'),
    solution: 'git checkout -b feat/login\nnpx prettier --write .\nnpx eslint .\ngit add .\ngit commit -m "feat: ログイン画面を追加"',
    tasks: (S) => { const ids = newCommits(S, S.S.remote.main); return [
      m(1, '作業用ブランチを feat/○○ の名前で作る（半角英数とハイフン）', /^(feat|fix)\/[a-z0-9]+(-[a-z0-9]+)*$/.test(S.S.head), ['<code>git checkout -b feat/login</code>', 'feat/ か fix/ で始めて、あとは小文字の英数字とハイフン。'], 'git checkout -b feat/login'),
      m(2, 'add → commit する。コミットメッセージの頭に feat: を付ける', ids.some((id) => /^(feat|fix|docs|refactor|test|chore):\s*\S.{2,}/.test(S.q.C(id).msg)), ['<code>git add .</code> のあとに <code>git commit -m "feat: …"</code>。'], 'git add .\ngit commit -m "feat: ログイン画面を追加"'),
      m(3, 'コミットの前に、Prettier（整形）と ESLint（チェック）を実行する', seqRan(S, [/^npx\s+prettier\b/, /^npx\s+eslint\b/, /^git commit\b/]), ['<code>npx prettier --write .</code> と <code>npx eslint .</code>', 'どちらも git commit より前に実行する。'], 'npx prettier --write .\nnpx eslint .'),
    ]; },
  };

  const PJ = JSON.stringify({ name: 'consult-app', version: '0.0.0', scripts: { dev: 'vite', build: 'vite build', test: 'vitest', lint: 'eslint .' }, dependencies: { vue: '^3.4.0' } }, null, 2) + '\n';
  D['vue-env'] = Object.assign(D['vue-env'] || {}, {
    'プロジェクトを作る': {
      kind: 'term', files: { 'README.md': '# 作業フォルダ\n' }, note: NOTE('Vue のプロジェクトを作って、動かす。プロジェクト名は <code>consult-app</code>。<b>作る → フォルダに入る → 部品を入れる → 起動</b>。'),
      solution: 'npm create vue@latest consult-app\ncd consult-app\nnpm install\nnpm run dev',
      tasks: (S) => [
        m(1, 'Vue のプロジェクトを作る（npm create vue@latest consult-app）', S.st.created.length > 0 && !!S.exists('/' + S.st.created[0] + '/package.json'), ['<code>npm create vue@latest</code> のあとに、プロジェクト名。'], 'npm create vue@latest consult-app'),
        m(2, 'cd でフォルダに入り、npm install で部品を入れ、npm run dev で起動する（この順）', seqRan(S, [/^npm\s+create\s+vue/, /^cd\s+\S+/, /^npm\s+(install|i)$/, /^npm\s+run\s+dev$/]) && S.st.installed.length > 0 && S.st.dev > 0, ['<code>cd consult-app</code> → <code>npm install</code> → <code>npm run dev</code>。', 'フォルダに入らずに npm install すると、package.json が無くてエラーになる。'], 'cd consult-app\nnpm install\nnpm run dev'),
      ],
    },
    '開発サーバーとHMR': {
      kind: 'term', files: { 'consult-app/package.json': PJ, 'consult-app/index.html': '<div id="app"></div>\n', 'consult-app/src/main.ts': 'createApp(App).mount("#app")\n', 'consult-app/node_modules/vue/index.js': '' },
      note: NOTE('プロジェクト <code>consult-app</code>（部品のインストールは済み）を、<b>開発用</b>に起動し、公開前に<b>本番用ファイル</b>を作る。<br><b>HMR</b> ＝ 保存するだけで、リロードなしで画面が変わる（開発サーバーの機能）。'),
      solution: 'cd consult-app\nnpm run dev\nnpm run build',
      tasks: (S) => [
        m(1, 'consult-app に入って、開発サーバーを起動する（npm run dev）', S.st.dev > 0, ['<code>cd consult-app</code> → <code>npm run dev</code>。', '起動すると <code>http://localhost:5173/</code> が出る。'], 'cd consult-app\nnpm run dev'),
        m(2, '公開前に、本番用のファイルを作る（npm run build）。dist フォルダができる', S.st.built > 0 && !!S.exists('/consult-app/dist'), ['本番用は <code>npm run build</code>。できたファイルは <code>dist/</code> に入る。'], 'npm run build'),
      ],
    },
  });
  TT['vue-env'] = {
    kind: 'term', files: { 'README.md': '# 作業フォルダ\n' }, note: NOTE('Vue のプロジェクト <code>consult-app</code> を作って、動かし、公開用に build する。'),
    solution: 'npm create vue@latest consult-app\ncd consult-app\nnpm install\nnpm run dev\nnpm run build',
    tasks: (S) => [
      m(1, 'Vue のプロジェクトを作る（npm create vue@latest）', S.st.created.length > 0, ['コマンドは npm create で始まる。作るのは vue。最新版なら vue@latest。'], 'npm create vue@latest consult-app'),
      m(2, 'プロジェクトのフォルダに入って、部品（依存）をインストールする', seqRan(S, [/^npm\s+create\s+vue/, /^cd\s+\S+/, /^npm\s+(install|i)$/]) && S.st.installed.length > 0, ['フォルダに入るのは cd。そのあと npm install。', '順番：作る → cd → install。'], 'cd consult-app\nnpm install'),
      m(3, '開発サーバーを起動し、そのあと本番用ファイルを作る（build）', seqRan(S, [/^npm\s+run\s+dev$/, /^npm\s+run\s+build$/]) && S.st.dev > 0 && S.st.built > 0, ['開発サーバーは npm run dev。本番用ファイルは npm run build。dev のあとに実行する。'], 'npm run dev\nnpm run build'),
    ],
  };

  /* ================= 最終チャレンジ（cuivim / git / x-terminal） ================= */
  TT.cuivim = {
    kind: 'term', files: { 'README.txt': '研修メモ置き場\n' }, note: NOTE('フォルダ <code>work</code> を作って入り、メモ <code>memo.txt</code> を作って、<b>Vim で書いて保存</b>する。'),
    solution: 'mkdir work\ncd work\ntouch memo.txt\nvim memo.txt\ni\nhello\nEsc\n:wq',
    tasks: (S) => [
      m(1, 'work という名前のフォルダを作る', !!S.exists('/work') && S.exists('/work').t === 'd', ['フォルダを作るコマンドは <code>mkdir</code>。'], 'mkdir work'),
      m(2, 'work に入って、空の memo.txt を作る（この順番で）', seqRan(S, [/^mkdir\s+work$/, /^cd\s+work$/, /^touch\s+memo\.txt$/]) && !!S.exists('/work/memo.txt'), ['mkdir → cd → touch の順。'], 'cd work\ntouch memo.txt'),
      m(3, 'Vim で memo.txt を開き、i で書いて、Esc で戻り、:wq で保存して終了する（ファイルに文字が残る）', S.st.vimLog.some((v) => v.saved && /memo\.txt$/.test(v.file) && v.hist.includes('type')) && ((S.file('/work/memo.txt') || '').trim().length > 0), ['開く：<code>vim memo.txt</code>。書く：<kbd>i</kbd>。戻る：<kbd>Esc</kbd>。', '保存して終了は <code>:wq</code>（Enter）。Vim の中は、キーボードで直接打つ。'], 'vim memo.txt\ni\nhello\nEsc\n:wq'),
    ],
  };
  TT.git = {
    kind: 'git', gh: ['merge:main'], note: NOTE('<b>現場の流れ</b>：最新の main から作業用の枝を作る → 枝で commit して GitHub に push → PR を Merge したあと、手元の main を最新にして枝を消す。'),
    seed: (sim) => { SCN.feat.seed(sim); sim.S.marks = { m0: sim.S.remote.main }; }, solution: 'git checkout main\ngit pull\ngit checkout -b feature/login\necho "<form></form>" >> index.html\ngit add index.html\ngit commit -m "feat: ログイン画面を追加"\ngit push -u origin feature/login\n@merge:main\ngit checkout main\ngit pull\ngit branch -d feature/login',
    tasks: (S) => [
      m(1, '作業を始める：main を最新にして（pull）、feature/ の枝を作って移る', S.S.head.startsWith('feature/') && S.q.isAnc(S.S.remote.main, S.q.tip()), ['新しい作業は、いつも最新の main から。<code>checkout main</code> → <code>pull</code> → <code>checkout -b feature/名前</code>。'], 'git checkout main\ngit pull\ngit checkout -b feature/login'),
      m(2, 'その枝で add → commit して、<code>-u</code> 付きで GitHub に push する', S.S.head.startsWith('feature/') && S.q.ahead(S.q.tip(), S.S.remote.main) >= 1 && S.S.remote[S.S.head] === S.q.tip() && !!S.S.upstream[S.S.head], ['枝の名前は同じものを使う。最初の push は <code>git push -u origin feature/名前</code>。'], 'echo "<form></form>" >> index.html\ngit add index.html\ngit commit -m "feat: ログイン画面を追加"\ngit push -u origin feature/login'),
      m(3, 'PR が Merge されたあと、main に戻って pull し、役目を終えた枝を git branch -d で消す', S.q.C(S.S.remote.main).parents.length > 1 && S.S.head === 'main' && S.S.branches.main === S.S.remote.main && !Object.keys(S.S.branches).some((b) => b.startsWith('feature/')), ['Merge は GitHub 上で行うので、手元の main は古いまま。', '<code>git checkout main</code> → <code>git pull</code> → <code>git branch -d 枝の名前</code>。'], '# 上の「PR を Merge」ボタンを押したあと\ngit checkout main\ngit pull\ngit branch -d feature/login'),
    ],
  };
  TT['x-terminal'] = {
    kind: 'term', files: { 'codes.txt': 'timeout\nauth\ntimeout\ndisk\ntimeout\nauth\n' }, note: NOTE('<code>codes.txt</code>（エラーコードが 1 行ずつ）の<b>種類ごとの数</b>を数える。パイプ <code>|</code> とリダイレクト <code>&gt;</code> を使う。'),
    solution: 'sort codes.txt | uniq\nsort codes.txt | uniq -c\nsort codes.txt | uniq -c | sort -rn | head -2 > top.txt',
    tasks: (S) => [
      m(1, 'codes.txt を並べ替えて（sort）、重複を 1 つにする（uniq）', S.ran.some((r) => r.pipe && /^(cat\s+codes\.txt\s*\|\s*)?sort(\s+codes\.txt)?\s*\|\s*uniq\s*$/.test(r.line)) || hasRan(S, /^sort\s+-u\s+codes\.txt$/), ['<code>sort ファイル | uniq</code>。uniq は隣り合う同じ行しか消せないので、先に sort。'], 'sort codes.txt | uniq'),
      m(2, '種類ごとの件数を数える（uniq -c）', S.ran.some((r) => r.pipe && /\|\s*uniq\s+-c\b/.test(r.line)), ['<code>uniq -c</code> は、同じ行が何回続いたかを頭に付ける。'], 'sort codes.txt | uniq -c'),
      m(3, '件数の多い順に並べ（sort -rn）、上位 2 つ（head -2）を top.txt に保存する', /^\s*3\s+timeout/m.test(S.file('/top.txt') || '') && /^\s*2\s+auth/m.test(S.file('/top.txt') || '') && (S.file('/top.txt') || '').split('\n').filter(Boolean).length === 2, ['数字の大きい順は <code>sort -rn</code>。先頭だけ取るのは <code>head -2</code>。', '最後に <code>&gt; top.txt</code> でファイルへ。'], 'sort codes.txt | uniq -c | sort -rn | head -2 > top.txt'),
    ],
  };
})();
