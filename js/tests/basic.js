/* 実践テスト：基礎・補足（html / css / cuivim / git / x-terminal / x-vscode / x-devtools / x-bem / x-css-plus / x-a11y）
   各レッスン 3 問（初級 / 中級 / 上級）。コードを書くと自動で ✓ が付く。 */
(function () {
  const T = (window.KENSHU.tests = window.KENSHU.tests || {});

  /* ---- 共通ヘルパー ---- */
  const lines = (v, f) => (v[f] || '').split('\n').map((x) => x.trim()).filter((x) => x && !x.startsWith('#'));
  const first = (L, re, from) => { for (let i = from == null ? 0 : from; i < L.length; i++) if (re.test(L[i])) return i; return -1; };
  const seq = (L, res) => { let at = -1; for (const re of res) { at = first(L, re, at + 1); if (at < 0) return false; } return true; };
  const doc = (ctx) => { try { return ctx.doc(); } catch (e) { return null; } };
  const body = (ctx) => { const d = doc(ctx); return d && d.body && d.body.childElementCount !== undefined ? d : null; };
  const css = (el, p) => el.ownerDocument.defaultView.getComputedStyle(el)[p];
  const clear = (c) => !c || c === 'transparent' || c === 'rgba(0, 0, 0, 0)';
  const px = (s) => parseFloat(s) || 0;
  const txt = (el) => (el ? el.textContent.trim() : '');
  const safe = (fn) => { try { return !!fn(); } catch (e) { return false; } };
  const lv = (level, label, ok, hint, answer) => ({ level, label, ok, hint, answer });

  /* ================= html ================= */
  T['html'] = {
    mode: 'web', height: 260,
    files: [{ name: 'index.html', lang: 'html', code: '<!-- ここに HTML を書こう -->\n' }],
    solution: '<h1>じこしょうかい</h1>\n<ul>\n  <li>名前：たろう</li>\n  <li>好きな食べ物：カレー</li>\n  <li>趣味：読書</li>\n</ul>\n<form>\n  <label for="nick">ニックネーム</label>\n  <input type="text" id="nick" name="nick">\n  <button type="submit">送信</button>\n</form>\n',
    tasks: (v, ctx) => {
      const d = body(ctx);
      return [
        lv(1, '見出し（h1）を1つ作って、文字を入れる', safe(() => d.querySelectorAll('h1').length === 1 && txt(d.querySelector('h1'))),
          ['見出しは <code>&lt;h1&gt;</code>。開始タグと終了タグで文字をはさむ。'], { code: '<h1>じこしょうかい</h1>', lang: 'html', mode: 'append' }),
        lv(2, 'リスト（ul）を作って、li を3つ以上入れる', safe(() => { const u = d.querySelector('ul'); return u && u.querySelectorAll(':scope > li').length >= 3; }),
          ['<code>&lt;ul&gt;</code> の中に <code>&lt;li&gt;</code> を並べる。'], { code: '<ul>\n  <li>名前：たろう</li>\n  <li>好きな食べ物：カレー</li>\n  <li>趣味：読書</li>\n</ul>', lang: 'html', mode: 'append' }),
        lv(3, 'フォームを作る：label と input（for と id でつなぐ）と、送信ボタン', safe(() => {
          const f = d.querySelector('form'); if (!f) return false;
          const i = f.querySelector('input[type=text],input:not([type])'); if (!i || !i.id) return false;
          const l = f.querySelector('label[for="' + i.id + '"]');
          const b = f.querySelector('button:not([type=button]),input[type=submit]');
          return !!(l && txt(l) && b);
        }), ['<code>&lt;label for="x"&gt;</code> と <code>&lt;input id="x"&gt;</code> の名前をそろえる。', '送信は <code>&lt;button type="submit"&gt;</code>。'],
        { code: '<form>\n  <label for="nick">ニックネーム</label>\n  <input type="text" id="nick" name="nick">\n  <button type="submit">送信</button>\n</form>', lang: 'html', mode: 'append' }),
      ];
    },
  };

  /* ================= css ================= */
  T['css'] = {
    mode: 'web', height: 280,
    files: [
      { name: 'index.html', lang: 'html', code: '<div class="card">\n  <h2>カード</h2>\n  <p>CSS で見た目を整えよう。</p>\n</div>\n' },
      { name: 'style.css', lang: 'css', code: '/* .card のスタイルを書こう */\n' },
    ],
    solution: { 'style.css': 'body {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 80vh;\n}\n.card {\n  background: #e8f0ff;\n  padding: 16px 24px;\n  border-radius: 8px;\n}\n' },
    tasks: (v, ctx) => {
      const d = body(ctx); const c = d && d.querySelector('.card');
      return [
        lv(1, '.card に背景色をつける', safe(() => !clear(css(c, 'backgroundColor'))),
          ['<code>background: 色;</code> を書く。'], { code: '.card {\n  background: #e8f0ff;\n}', lang: 'css', mode: 'append' }),
        lv(2, '.card に余白（padding 8px 以上）と角丸（border-radius）をつける', safe(() => px(css(c, 'paddingTop')) >= 8 && px(css(c, 'paddingLeft')) >= 8 && px(css(c, 'borderTopLeftRadius')) > 0),
          ['内側の余白は <code>padding</code>、角の丸みは <code>border-radius</code>。'], { code: '.card {\n  padding: 16px 24px;\n  border-radius: 8px;\n}', lang: 'css', mode: 'append' }),
        lv(3, 'body を Flexbox にして、.card を横も縦も中央に置く', safe(() => { const b = d.body; return css(b, 'display') === 'flex' && css(b, 'justifyContent') === 'center' && css(b, 'alignItems') === 'center'; }),
          ['<code>display: flex</code> と、横は <code>justify-content</code>、縦は <code>align-items</code>。', '縦に中央へ置くには、body に高さ（min-height）も必要。'],
          { code: 'body {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 80vh;\n}', lang: 'css', mode: 'append' }),
      ];
    },
  };

  /* ================= cuivim ================= */
  T['cuivim'] = {
    mode: 'text', height: 240,
    files: [{ name: 'commands.sh', lang: 'sh', code: '# 1行に1つ、実際に打つコマンドやキーを書こう\n' }],
    note: '<b>やること</b><br>左に、打つコマンドを<b>1行ずつ順番に</b>書く。<br>Vim の中の操作も、キーを1行に1つ書く（例：<code>i</code> / <code>Esc</code> / <code>:wq</code>）。<br>下のミッションが自動で ✓ になります。',
    solution: 'mkdir work\ncd work\ntouch memo.txt\nvim memo.txt\ni\nEsc\n:wq\n',
    tasks: (v) => {
      const L = lines(v, 'commands.sh');
      return [
        lv(1, 'work という名前のフォルダを作る', first(L, /^mkdir\s+work$/) >= 0,
          ['フォルダを作るコマンドは <code>mkdir</code>。'], { code: 'mkdir work', lang: 'sh', mode: 'append' }),
        lv(2, 'work に入って、空の memo.txt を作る（この順番で）', seq(L, [/^mkdir\s+work$/, /^cd\s+work$/, /^touch\s+memo\.txt$/]),
          ['mkdir → cd → touch の順。'], { code: 'mkdir work\ncd work\ntouch memo.txt', lang: 'sh' }),
        lv(3, 'Vim で memo.txt を開き、書き込みモードに入って、ノーマルモードに戻り、保存して終了する', seq(L, [/^cd\s+work$/, /^vim\s+memo\.txt$/, /^i$/, /^esc(ape)?$/i, /^:wq$|^:x$|^ZZ$/]),
          ['開く：<code>vim memo.txt</code>。書く：<code>i</code>。戻る：<code>Esc</code>。', '保存して終了は <code>:wq</code>。'],
          { code: 'mkdir work\ncd work\ntouch memo.txt\nvim memo.txt\ni\nEsc\n:wq', lang: 'sh' }),
      ];
    },
  };

  /* ================= git ================= */
  T['git'] = {
    mode: 'text', height: 260,
    files: [{ name: 'commands.sh', lang: 'sh', code: '# 1行に1コマンド、順番どおりに書こう\n# あなたは「ログイン画面」の担当。いまは別の枝にいるかもしれない。\n' }],
    note: '<b>現場の流れ</b><br>① 最新の main から作業用の枝を作る<br>② 枝で commit して GitHub に push<br>③ GitHub で PR を Merge したあと、手元の main を最新にして枝を消す<br>枝の移動は <code>git checkout</code> を使います。',
    solution: 'git checkout main\ngit pull\ngit checkout -b feature/login\ngit add .\ngit commit -m "feat: ログイン画面を追加"\ngit push -u origin feature/login\n# GitHub で Pull Request を作る → レビュー → Merge\ngit checkout main\ngit pull\ngit branch -d feature/login\n',
    tasks: (v) => {
      const L = lines(v, 'commands.sh');
      const A = /^git\s+add\s+\S+/, commit = /^git\s+commit\s+.*-m\s*("[^"]+"|'[^']+'|\S+)/;
      const bi = L.findIndex((x) => /^git\s+checkout\s+-b\s+feature\/\S+$/.test(x));
      const name = bi >= 0 ? L[bi].split(/\s+/)[3] : null;
      const esc = (t) => t.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&');
      const pushRe = name && new RegExp('^git\\s+push\\s+(-u|--set-upstream)\\s+origin\\s+' + esc(name) + '$');
      const pj = name ? L.findIndex((x, i) => i > bi && pushRe.test(x)) : -1;
      return [
        lv(1, '作業を始める：main を最新にして（pull）、feature/ の枝を作って移る', seq(L, [/^git\s+checkout\s+main$/, /^git\s+pull(\s+origin\s+main)?$/, /^git\s+checkout\s+-b\s+feature\/\S+$/]),
          ['新しい作業は、いつも最新の main から。<code>checkout main</code> → <code>pull</code> → <code>checkout -b feature/名前</code>。'], { code: 'git checkout main\ngit pull\ngit checkout -b feature/login', lang: 'sh' }),
        lv(2, 'その枝で add → commit して、<code>-u</code> 付きで GitHub に push する', !!name && seq(L.slice(bi), [A, commit, pushRe]),
          ['枝の名前は同じものを使う。', '最初の push は <code>git push -u origin feature/名前</code>。'], { code: 'git checkout main\ngit pull\ngit checkout -b feature/login\ngit add .\ngit commit -m "feat: ログイン画面を追加"\ngit push -u origin feature/login', lang: 'sh' }),
        lv(3, 'PR が Merge されたあと、main に戻って pull し、役目を終えた枝を消す', pj >= 0 && seq(L.slice(pj + 1), [/^git\s+checkout\s+main$/, /^git\s+pull(\s+origin\s+main)?$/, new RegExp('^git\\s+branch\\s+-d\\s+' + esc(name) + '$')]),
          ['Merge は GitHub 上で行うので、手元の main は古いまま。', '<code>git checkout main</code> → <code>git pull</code> → <code>git branch -d 枝の名前</code>。'],
          { code: 'git checkout main\ngit pull\ngit branch -d feature/login', lang: 'sh', mode: 'append' }),
      ];
    },
  };

  /* ================= x-terminal ================= */
  T['x-terminal'] = {
    mode: 'text', height: 240,
    files: [{ name: 'commands.sh', lang: 'sh', code: '# codes.txt にエラーコードが1行ずつ入っている。\n# 1行に1コマンドで書こう\n' }],
    note: '<b>codes.txt の中身</b><pre>timeout\nauth\ntimeout\ndisk\ntimeout\nauth</pre><b>やること</b><br>パイプ <code>|</code> とリダイレクト <code>&gt;</code> を使って、種類ごとの数を数える。',
    solution: 'sort codes.txt | uniq\nsort codes.txt | uniq -c\nsort codes.txt | uniq -c | sort -rn | head -2 > top.txt\n',
    tasks: (v) => {
      const L = lines(v, 'commands.sh');
      const norm = (s) => s.replace(/\s*\|\s*/g, ' | ').replace(/\s+/g, ' ');
      const N = L.map(norm);
      return [
        lv(1, 'codes.txt を並べ替えて（sort）、重複を1つにする（uniq）', N.some((x) => /^sort codes\.txt \| uniq$/.test(x) || /^cat codes\.txt \| sort \| uniq$/.test(x) || /^sort -u codes\.txt$/.test(x)),
          ['<code>sort ファイル | uniq</code> と、パイプでつなぐ。uniq は隣り合う同じ行しか消せないので、先に sort。'], { code: 'sort codes.txt | uniq', lang: 'sh', mode: 'append' }),
        lv(2, '種類ごとの件数を数える（uniq -c）', N.some((x) => /^(sort codes\.txt|cat codes\.txt \| sort) \| uniq -c$/.test(x)),
          ['<code>uniq -c</code> は、同じ行が何回続いたかを頭に付ける。'], { code: 'sort codes.txt | uniq -c', lang: 'sh', mode: 'append' }),
        lv(3, '件数の多い順に並べ（sort -rn）、上位2つ（head -2）を top.txt に保存する', N.some((x) => /^(sort codes\.txt|cat codes\.txt \| sort) \| uniq -c \| sort -rn \| head -2 > top\.txt$/.test(x) || /^(sort codes\.txt|cat codes\.txt \| sort) \| uniq -c \| sort -nr \| head -2 > top\.txt$/.test(x)),
          ['数字の大きい順は <code>sort -rn</code>。先頭だけ取るのは <code>head -2</code>。', '最後に <code>&gt; top.txt</code> でファイルへ。'], { code: 'sort codes.txt | uniq -c | sort -rn | head -2 > top.txt', lang: 'sh', mode: 'append' }),
      ];
    },
  };

  /* ================= x-vscode（設定と拡張機能） ================= */
  T['x-vscode'] = {
    mode: 'text', height: 280,
    note: '<b>やること</b><br>チームの VS Code を<b>そろえる2つのファイル</b>を書く。<br>settings.json（設定）と extensions.json（おすすめ拡張機能）。<br>下のミッションが自動で ✓ になります。',
    files: [
      { name: 'settings.json', lang: 'json', code: '{\n  \n}\n' },
      { name: 'extensions.json', lang: 'json', code: '{\n  "recommendations": [\n    \n  ]\n}\n' },
    ],
    solution: {
      'settings.json': '{\n  "editor.formatOnSave": true,\n  "editor.defaultFormatter": "esbenp.prettier-vscode",\n  "editor.bracketPairColorization.enabled": true,\n  "editor.codeActionsOnSave": {\n    "source.fixAll.eslint": "explicit"\n  }\n}\n',
      'extensions.json': '{\n  "recommendations": [\n    "esbenp.prettier-vscode",\n    "dbaeumer.vscode-eslint",\n    "Vue.volar",\n    "eamodio.gitlens",\n    "usernamehw.errorlens"\n  ]\n}\n',
    },
    tasks: (v) => {
      const J = (f) => { try { return JSON.parse((v[f] || '').replace(/^\s*\/\/.*$/gm, '')); } catch (e) { return null; } };
      const S = J('settings.json') || {}, E = J('extensions.json') || {};
      const R = Array.isArray(E.recommendations) ? E.recommendations : [];
      return [
        lv(1, 'settings.json：保存で整形する（formatOnSave を true、整形ツールは esbenp.prettier-vscode）', S['editor.formatOnSave'] === true && S['editor.defaultFormatter'] === 'esbenp.prettier-vscode',
          ['<code>"editor.formatOnSave": true</code> と <code>"editor.defaultFormatter": "esbenp.prettier-vscode"</code>。'], null),
        lv(2, 'settings.json：括弧の色分けを ON にして、保存で ESLint を自動修正する（source.fixAll.eslint）', S['editor.bracketPairColorization.enabled'] === true && !!S['editor.codeActionsOnSave'] && ['explicit', true, 'always'].includes(S['editor.codeActionsOnSave']['source.fixAll.eslint']),
          ['<code>"editor.bracketPairColorization.enabled": true</code>。<code>"editor.codeActionsOnSave": { "source.fixAll.eslint": "explicit" }</code>。'], null),
        lv(3, 'extensions.json：Prettier・ESLint・Vue.volar・eamodio.gitlens を含む、5つ以上のおすすめを書く', R.length >= 5 && ['esbenp.prettier-vscode', 'dbaeumer.vscode-eslint', 'Vue.volar', 'eamodio.gitlens'].every((x) => R.includes(x)),
          ['<code>"recommendations": [ ... ]</code> に ID を並べる。最後の項目のあとに , は付けない。'], null),
      ];
    },
  };

  /* ================= x-devtools ================= */
  T['x-devtools'] = {
    mode: 'web', height: 300,
    files: [
      { name: 'index.html', lang: 'html', code: '<h1 id="title">Hello</h1>\n<button id="btn">押す</button>\n<p id="out"></p>\n<div class="cards">\n  <div class="card">A</div>\n  <div class="card">B</div>\n</div>\n' },
      { name: 'style.css', lang: 'css', code: '.cards { display: flex; gap: 8px; }\n.card { padding: 12px; background: #ddd; }\n' },
      { name: 'main.js', lang: 'js', code: "// Console にエラーが出ている。原因を探して直そう\nconst btn = document.getElementById('bnt');\nbtn.addEventListener('click', () => {\n  document.getElementById('out').textContent = 'クリックされた';\n});\n" },
    ],
    solution: {
      'index.html': '<h1 id="title">こんにちは</h1>\n<button id="btn">押す</button>\n<p id="out"></p>\n<div class="cards">\n  <div class="card">A</div>\n  <div class="card">B</div>\n</div>\n',
      'style.css': '.cards { display: flex; gap: 8px; }\n.card { padding: 12px; background: #ddd; }\n@media (max-width: 600px) {\n  .cards { flex-direction: column; }\n}\n',
      'main.js': "const btn = document.getElementById('btn');\nbtn.addEventListener('click', () => {\n  document.getElementById('out').textContent = 'クリックされた';\n});\n",
    },
    tasks: (v, ctx) => {
      const d = body(ctx);
      return [
        lv(1, 'Elements：見出し（#title）の文字を「こんにちは」に書き換える', safe(() => txt(d.getElementById('title')) === 'こんにちは'),
          ['Elements パネルで文字をダブルクリックして直すのと同じ。HTML の h1 の中身を変える。'], { code: '<h1 id="title">こんにちは</h1>', lang: 'html' }),
        lv(2, 'Console：エラーを直して、ボタンを押すと #out に「クリックされた」と出るようにする', safe(() => { const b = d.getElementById('btn'); b.click(); return txt(d.getElementById('out')) === 'クリックされた'; }),
          ['Console に「Cannot read properties of null」。id の綴りを HTML と見比べよう。'], { code: "const btn = document.getElementById('btn');\nbtn.addEventListener('click', () => {\n  document.getElementById('out').textContent = 'クリックされた';\n});", lang: 'js' }),
        lv(3, 'Device mode：幅 600px 以下で、.cards が縦に並ぶ（flex-direction: column）ように @media を書く', safe(() => { const c = (v['style.css'] || '').replace(/\/\*[\s\S]*?\*\//g, ''); return /@media[^{]*max-width\s*:\s*\d+px[^{]*\{[^}]*\.cards\s*\{[^}]*flex-direction\s*:\s*column/.test(c); }),
          ['<code>@media (max-width: 600px) { .cards { ... } }</code> の形。', 'スマホの幅でだけ効くルールになる。'],
          { code: '@media (max-width: 600px) {\n  .cards { flex-direction: column; }\n}', lang: 'css', mode: 'append' }),
      ];
    },
  };

  /* ================= x-bem ================= */
  T['x-bem'] = {
    mode: 'web', height: 300,
    files: [
      { name: 'index.html', lang: 'html', code: '<div class="card">\n  <h2 class="title">離婚の相談</h2>\n  <p class="text">初回30分は無料です</p>\n  <a class="btn" href="#">予約する</a>\n</div>\n' },
      { name: 'style.css', lang: 'css', code: '.card { border: 1px solid #aaa; padding: 12px; }\n.title { margin: 0 0 4px; }\n.btn { display: inline-block; padding: 6px 12px; border: 0; }\n' },
    ],
    solution: {
      'index.html': '<div class="card">\n  <h2 class="card__title">離婚の相談</h2>\n  <p class="card__text">初回30分は無料です</p>\n  <a class="card__btn card__btn--primary" href="#">予約する</a>\n</div>\n',
      'style.css': '.card { border: 1px solid #aaa; padding: 12px; }\n.card__title { margin: 0 0 4px; }\n.card__btn { display: inline-block; padding: 6px 12px; border: 0; }\n.card__btn--primary { background: #2f6fed; color: #fff; }\n',
    },
    tasks: (v, ctx) => {
      const d = body(ctx);
      const sel = (v['style.css'] || '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\{[^}]*\}/g, '\n').split(/[\n,]/).map((x) => x.trim()).filter(Boolean);
      return [
        lv(1, 'ブロック card の「要素」の名前にする：見出しは card__title、本文は card__text', safe(() => d.querySelector('.card .card__title') && d.querySelector('.card .card__text')),
          ['要素の名前は <code>ブロック名__要素名</code>（アンダースコア2つ）。'], { code: '<div class="card">\n  <h2 class="card__title">離婚の相談</h2>\n  <p class="card__text">初回30分は無料です</p>\n  <a class="btn" href="#">予約する</a>\n</div>', lang: 'html' }),
        lv(2, 'ボタンを card__btn にして、さらに「修飾子」card__btn--primary も付ける（両方）', safe(() => d.querySelector('a.card__btn.card__btn--primary')),
          ['修飾子は <code>要素名--名前</code>（ハイフン2つ）。元の名前と一緒に付ける。'], { code: '<div class="card">\n  <h2 class="card__title">離婚の相談</h2>\n  <p class="card__text">初回30分は無料です</p>\n  <a class="card__btn card__btn--primary" href="#">予約する</a>\n</div>', lang: 'html' }),
        lv(3, 'CSS も BEM に合わせ、.card__btn--primary の背景色を変える（セレクタはクラス1つだけ。1・2 のあとに）', safe(() => { const b = d.querySelector('.card__btn--primary'); return b && !clear(css(b, 'backgroundColor')) && sel.length && sel.every((s) => /^\.[a-z][a-z0-9-]*(__[a-z0-9-]+)?(--[a-z0-9-]+)?$/.test(s)) && sel.some((s) => s === '.card__btn--primary'); }),
          ['セレクタはクラス1つだけ（<code>.card .title</code> のような入れ子は使わない）。', '<code>.card__btn--primary { background: ...; }</code>'],
          { code: '.card__btn--primary { background: #2f6fed; color: #fff; }', lang: 'css', mode: 'append' }),
      ];
    },
  };

  /* ================= x-css-plus ================= */
  T['x-css-plus'] = {
    mode: 'web', height: 300,
    files: [
      { name: 'index.html', lang: 'html', code: '<div class="box">相談30分　5,500円</div>\n' },
      { name: 'style.css', lang: 'css', code: '.box {\n  padding: 16px;\n  color: #fff;\n}\n/* 料金プランのカードに、変数・動き・スマホ幅の指定を足そう */\n' },
    ],
    solution: { 'style.css': ':root { --main: #2f6fed; }\n.box {\n  padding: 16px;\n  color: #fff;\n  background: var(--main);\n  transition: transform .3s;\n}\n.box:hover { transform: scale(1.05); }\n@media (max-width: 600px) {\n  .box { padding: 8px; }\n}\n' },
    tasks: (v, ctx) => {
      const d = body(ctx); const b = d && d.querySelector('.box');
      const c = (v['style.css'] || '').replace(/\/\*[\s\S]*?\*\//g, '');
      return [
        lv(1, 'CSS 変数：:root に --main を作り、.box の背景色を var(--main) で指定する', safe(() => /:root\s*\{[^}]*--main\s*:/.test(c) && /var\(\s*--main\s*\)/.test(c) && !clear(css(b, 'backgroundColor'))),
          ['定義は <code>--main: 色;</code>、使うときは <code>var(--main)</code>。'], { code: ':root { --main: #2f6fed; }\n.box { background: var(--main); }', lang: 'css', mode: 'append' }),
        lv(2, '動き：.box に transition をつけて、:hover で transform を変える', safe(() => px(css(b, 'transitionDuration')) > 0 && /\.box\s*:hover\s*\{[^}]*transform\s*:/.test(c)),
          ['<code>transition: transform .3s;</code> と、<code>.box:hover { transform: scale(1.05); }</code>'], { code: '.box { transition: transform .3s; }\n.box:hover { transform: scale(1.05); }', lang: 'css', mode: 'append' }),
        lv(3, 'レスポンシブ：幅 600px 以下で .box の padding を 8px にする（@media）', safe(() => /@media[^{]*max-width\s*:\s*600px[^{]*\{[^{}]*\.box\s*\{[^}]*padding\s*:\s*8px/.test(c)),
          ['<code>@media (max-width: 600px) { .box { padding: 8px; } }</code>'], { code: '@media (max-width: 600px) {\n  .box { padding: 8px; }\n}', lang: 'css', mode: 'append' }),
      ];
    },
  };

  /* ================= x-a11y ================= */
  T['x-a11y'] = {
    mode: 'web', height: 300,
    files: [{ name: 'index.html', lang: 'html', code: '<img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=">\n<input type="text" id="name" placeholder="お名前">\n<div class="btn" onclick="alert(1)">予約する</div>\n' }],
    solution: '<main>\n  <img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="事務所のロゴ">\n  <label for="name">お名前</label>\n  <input type="text" id="name" placeholder="例：山田花子">\n  <button type="button">予約する</button>\n</main>\n',
    tasks: (v, ctx) => {
      const d = body(ctx);
      return [
        lv(1, '画像（img）に、内容を伝える alt（代替テキスト）を付ける', safe(() => { const i = d.querySelector('img'); return i && (i.getAttribute('alt') || '').trim().length > 0; }),
          ['<code>&lt;img src="..." alt="説明"&gt;</code>。読み上げソフトが alt を読む。'], { code: '<img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="事務所のロゴ">', lang: 'html' }),
        lv(2, '入力欄（#name）に、label を for/id でつなぐ（placeholder だけにしない）', safe(() => { const l = d.querySelector('label[for="name"]'); return l && txt(l) && d.getElementById('name'); }),
          ['<code>&lt;label for="name"&gt;名前&lt;/label&gt;</code> と、input の <code>id="name"</code>。'], { code: '<label for="name">お名前</label>', lang: 'html', mode: 'append' }),
        lv(3, '送信の div を button に直し、ページ全体を main でくくる', safe(() => !d.querySelector('div[onclick]') && txt(d.querySelector('button')) && d.querySelector('main button') && d.querySelector('main input')),
          ['クリックできるものは <code>&lt;button&gt;</code>。キーボードでも押せて、役割も伝わる。', '中身全体を <code>&lt;main&gt;…&lt;/main&gt;</code> で囲む。'],
          { code: '<main>\n  <img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="事務所のロゴ">\n  <label for="name">お名前</label>\n  <input type="text" id="name">\n  <button type="button">予約する</button>\n</main>', lang: 'html' }),
      ];
    },
  };
})();
