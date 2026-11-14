/* シーンごとの練習（基礎トラック）: KENSHU.drills[レッスンID][シーン名] = spec
   spec は js/tests と同じ形式。シーン名は lessons の t と完全に同じにする。 */
(function () {
  const D = (window.KENSHU.drills = window.KENSHU.drills || {});

  /* ---------- helpers ---------- */
  const ln = (v) => String(v || '').split('\n').map((x) => x.trim()).filter((x) => x && !x.startsWith('#') && !x.startsWith('//'));
  const find = (L, re, from) => { for (let i = from || 0; i < L.length; i++) if (re.test(L[i])) return i; return -1; };
  const seq = (L, res) => { let f = 0; for (const re of res) { const i = find(L, re, f); if (i < 0) return false; f = i + 1; } return true; };
  const Q = (d, s) => (d ? [...d.querySelectorAll(s)] : []);
  const cs = (d, el) => (d && el ? d.defaultView.getComputedStyle(el) : null);
  const px = (v) => parseFloat(v) || 0;
  const T = (level, label, ok, hint, ans, lang) => ({ level, label, ok: !!ok, hint: [].concat(hint), answer: { code: ans, lang: lang || 'sh', mode: 'append' } });

  // text drill: 1 file, lines are checked
  const txt = (o) => {
    const name = o.name || 'memo.txt';
    return {
      mode: 'text', height: o.h || 190,
      files: [{ name, lang: o.lang || 'sh', code: o.start || '' }],
      note: o.note, solution: o.sol,
      tasks: (v) => o.tasks(ln(v[name]), String(v[name] || '')),
    };
  };
  // web drill: html/css(/js) preview, DOM checked
  const web = (o) => ({
    mode: 'web', height: o.h || 230, files: o.files, solution: o.sol,
    tasks: (v, c) => o.tasks(c.doc && c.doc(), v, c),
  });
  const H = (code) => ({ name: 'index.html', lang: 'html', code });
  const C = (code) => ({ name: 'style.css', lang: 'css', code });
  const J = (code) => ({ name: 'main.js', lang: 'js', code });
  const hasRe = (src, re) => re.test(String(src || ''));
  const same = (a, b) => Math.abs(a - b) <= 1.5;
  const lum = (rgb) => { const m = String(rgb).match(/[\d.]+/g); if (!m) return 0; const f = m.slice(0, 3).map((x) => { x = +x / 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }); return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2]; };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const note = (s) => '<b>やること</b><br>' + s + '<br>下のミッションが自動で ✓ になります。';

  /* ================= intro ================= */
  D.intro = {
    '学習計画表': txt({
      lang: 'text', start: '# 1行に1つずつ書こう\n',
      note: note('学習計画表を見て、<b>学ぶ技術</b>と<b>日ごとの流れ</b>を書き出す。'),
      sol: 'HTML\nTypeScript\nVue.js\n1日目：HTML と CSS\n最終日：成果発表',
      tasks: (L, raw) => [
        T(1, '研修で学ぶ技術を3つ書く（HTML・TypeScript・Vue.js など）', ['HTML', 'CSS', 'Git', 'TypeScript', 'Vue'].filter((k) => new RegExp(k, 'i').test(raw)).length >= 3, ['計画表に出てくる技術名をそのまま書けば OK。'], 'HTML\nTypeScript\nVue.js', 'text'),
        T(2, '「1日目：〜」と「最終日：〜」を1行ずつ書く', find(L, /^1日目\s*[:：]\s*\S+/) >= 0 && find(L, /^最終日\s*[:：]\s*\S+/) >= 0, ['「1日目：HTML と CSS」のように、日にちと内容を「：」でつなぐ。'], '1日目：HTML と CSS\n最終日：成果発表', 'text'),
      ],
    }),
    '講義のゴール': txt({
      lang: 'text', start: '# 1行に1つずつ書こう\n',
      note: note('最終日のゴールを、自分の言葉で書いてみる。'),
      sol: '最終日に、自分らしいWEBサイトを作って発表する\n・HTML と CSS で形を作る\n・TypeScript で安全に書く\n・Vue.js で動かす',
      tasks: (L) => [
        T(1, '最終日に作るものを1行で書く（例：自分らしいWEBサイトを作る）', L.some((x) => x.length >= 8 && /作る|作り|サイト|アプリ|発表/.test(x)), ['「〜を作る」「〜を発表する」の形で書くと分かりやすい。'], '最終日に、自分らしいWEBサイトを作って発表する', 'text'),
        T(2, 'ゴールに必要なスキルを、「・」で始まる行で3つ書く', L.filter((x) => /^[・\-]\s*\S+/.test(x)).length >= 3, ['行の頭に「・」を付けて、スキルを3行書く。'], '・HTML と CSS で形を作る\n・TypeScript で安全に書く\n・Vue.js で動かす', 'text'),
      ],
    }),
    '学習の進め方': txt({
      lang: 'text', start: '# 1行に1つずつ書こう\n',
      note: note('各ページの進め方と、困ったときの動きを書く。'),
      sol: '見る → 動かす → 作る\n分からないときは、まず自分で試す。それでもだめならヒントを見る。',
      tasks: (L, raw) => [
        T(1, '各ページの3ステップを、順番どおりに書く（見る → 動かす → 作る）', /見る[\s\S]*動かす[\s\S]*作る/.test(raw), ['「見る → 動かす → 作る」と、この順に1行で書けば OK。'], '見る → 動かす → 作る', 'text'),
        T(2, '分からないときの動きを1行で書く（「ヒント」か「答え」を入れる）', L.some((x) => x.length >= 8 && /ヒント|答え/.test(x)), ['まず自分で試して、ヒントや答えを見る流れを書こう。'], '分からないときは、まず自分で試す。それでもだめならヒントを見る。', 'text'),
      ],
    }),
    '準備チェック': txt({
      lang: 'text', start: '# 1行に1つずつ書こう\n',
      note: note('研修に必要なものを書き出して、準備の状況を書く。'),
      sol: 'パソコン\nGitHub アカウント\nVisual Studio Code\nZoom / Slack\n全部OK',
      tasks: (L, raw) => [
        T(1, '研修に必要なものを3つ書く（パソコン・GitHub・VS Code・Zoom・Slack）', [/パソコン|PC/i, /GitHub/i, /VS ?Code|Visual Studio Code/i, /Zoom/i, /Slack/i].filter((r) => r.test(raw)).length >= 3, ['チェックリストに出ていたものを3つ書けば OK。'], 'パソコン\nGitHub アカウント\nVisual Studio Code', 'text'),
        T(2, '準備の状況を書く（できていなければ「未：〇〇」、全部できたら「全部OK」）', find(L, /^(未\s*[:：]\s*\S+|全部\s*OK)$/i) >= 0, ['足りないものがあれば「未：Zoom」、全部そろっていれば「全部OK」。'], '全部OK', 'text'),
      ],
    }),
  };

  /* ================= html ================= */
  D.html = {
    'HTML・CSS・JS の役割': web({
      files: [H('<h1 id="title">こんにちは</h1>\n<button id="btn">押す</button>'), C('/* CSS：見た目 */\n'), J('// JS：動き\n')],
      sol: { 'index.html': '<h1 id="title">こんにちは</h1>\n<button id="btn">押す</button>', 'style.css': 'h1 { color: tomato; }', 'main.js': 'document.getElementById("btn").addEventListener("click", () => {\n  document.getElementById("title").textContent = "押したね！";\n});' },
      tasks: (d, v) => [
        T(1, 'CSS：見出し（h1）の文字色を、黒以外に変える', d && Q(d, 'h1')[0] && cs(d, Q(d, 'h1')[0]).color !== 'rgb(0, 0, 0)', ['色は CSS の役目。style.css に h1 { color: ○○; } と書く。'], 'h1 { color: tomato; }', 'css'),
        T(2, 'JS：ボタンを押すと、見出しの文字が変わるようにする', hasRe(v['main.js'], /addEventListener|onclick/) && hasRe(v['main.js'], /textContent|innerText|innerHTML/), ['動きは JS の役目。クリックを待ち受けて（addEventListener）、textContent を書き換える。'], 'document.getElementById("btn").addEventListener("click", () => {\n  document.getElementById("title").textContent = "押したね！";\n});', 'js'),
      ],
    }),
    'タグの解剖': web({
      files: [H('<!-- ① 段落：開始タグ <p> と終了タグ </p> ではさむ -->\n\n<!-- ② リンク：<a href="行き先">表示する文字</a> -->\n')],
      sol: { 'index.html': '<p>はじめまして</p>\n<a href="https://example.com">サンプルへ</a>' },
      tasks: (d, v) => [
        T(1, '開始タグと終了タグではさんだ段落（<p>…</p>）を書く', Q(d, 'p').some((p) => p.textContent.trim().length > 0) && hasRe(v['index.html'], /<\/p>/), ['<code>&lt;p&gt;文字&lt;/p&gt;</code> のように、前後をタグではさむ。'], '<p>はじめまして</p>', 'html'),
        T(2, '属性（href）を付けたリンク（<a href="…">…</a>）を書く', Q(d, 'a[href]').some((a) => a.getAttribute('href').trim().length > 0 && a.textContent.trim().length > 0), ['属性は開始タグの中に <code>名前="値"</code> で書く。'], '<a href="https://example.com">サンプルへ</a>', 'html'),
      ],
    }),
    'HTML は「木」': web({
      files: [H('<!-- ① ul の中に li を3つ（特長リスト：初回無料・ビデオ通話OK・土日も対応） -->\n\n<!-- ② 「料金」の li の中に、さらに ul と li（30分 5,500円）を入れる -->\n')],
      sol: { 'index.html': '<ul>\n  <li>初回無料</li>\n  <li>ビデオ通話OK</li>\n  <li>料金\n    <ul>\n      <li>30分 5,500円</li>\n    </ul>\n  </li>\n</ul>' },
      tasks: (d) => [
        T(1, 'ul（親）の中に li（子）を3つ入れる', Q(d, 'ul > li').length >= 3, ['<code>&lt;ul&gt;</code> の中に <code>&lt;li&gt;…&lt;/li&gt;</code> を3行。'], '<ul>\n  <li>初回無料</li>\n  <li>ビデオ通話OK</li>\n  <li>土日も対応</li>\n</ul>', 'html'),
        T(2, 'li の中に、さらに ul と li を入れる（木の枝が増える。CSS の「li li」で当てられる形）', Q(d, 'ul li ul li').length >= 1, ['li の閉じタグ <code>&lt;/li&gt;</code> の前に、もう1つ ul を書く。入れ子にしても閉じ忘れないように。'], '<ul>\n  <li>料金\n    <ul>\n      <li>30分 5,500円</li>\n    </ul>\n  </li>\n</ul>', 'html'),
      ],
    }),
    'なぜ意味のあるタグ？': web({
      files: [H('<!-- div だらけの予約ページ → 意味のあるタグに直そう（見た目は変えない） -->\n<div>さくら相談室</div>\n<div>\n  <a href="#a">ホーム</a>\n  <a href="#b">料金</a>\n</div>\n<div>\n  <div>オンライン相談を予約する</div>\n  <div>初回30分は無料です。</div>\n  <div onclick="book()">予約する</div>\n</div>\n<div>© さくら相談室</div>')],
      sol: { 'index.html': '<header>さくら相談室</header>\n<nav>\n  <a href="#a">ホーム</a>\n  <a href="#b">料金</a>\n</nav>\n<main>\n  <h1>オンライン相談を予約する</h1>\n  <p>初回30分は無料です。</p>\n  <button type="button">予約する</button>\n</main>\n<footer>© さくら相談室</footer>' },
      tasks: (d) => [
        T(1, 'header・main・footer を使う（読み上げで「ここが本文」とジャンプできる）', Q(d, 'header').length > 0 && Q(d, 'main').length > 0 && Q(d, 'footer').length > 0, ['上 = header、中 = main、下 = footer に置き換える。'], '<header>さくら相談室</header>\n<main>…</main>\n<footer>© さくら相談室</footer>', 'html'),
        T(2, 'ナビのリンクを nav に、題名を h1 にする（検索結果と目次に効く）', Q(d, 'nav a').length >= 2 && Q(d, 'h1').length === 1, ['リンクをまとめている div を <code>&lt;nav&gt;</code> に。題名は <code>&lt;h1&gt;</code>。'], '<nav>\n  <a href="#a">ホーム</a>\n  <a href="#b">料金</a>\n</nav>\n<h1>オンライン相談を予約する</h1>', 'html'),
        T(3, '「予約する」を button にして、Tab キーで届くようにする（onclick の div はやめる）', Q(d, 'button').some((b) => /予約/.test(b.textContent)) && Q(d, '[onclick]').length === 0, ['<code>&lt;div onclick&gt;</code> ではなく <code>&lt;button&gt;</code> を使う。'], '<button type="button">予約する</button>', 'html'),
      ],
    }),
    'ページの骨組み': web({
      h: 260,
      files: [H('<!-- ページの骨組みを完成させよう -->\n<!DOCTYPE html>\n<html>\n<head>\n  <!-- ① 文字コードとタイトル -->\n</head>\n<body>\n  <header>…</header>\n  <main>…</main>\n  <footer>…</footer>\n</body>\n</html>')],
      sol: { 'index.html': '<!DOCTYPE html>\n<html lang="ja">\n<head>\n  <meta charset="UTF-8">\n  <title>マイページ</title>\n</head>\n<body>\n  <header>…</header>\n  <main>…</main>\n  <footer>…</footer>\n</body>\n</html>' },
      tasks: (d, v) => [
        T(1, '<html> に lang="ja" を付ける（言語を伝える）', hasRe(v['index.html'], /<html[^>]*\blang=["']ja["']/i), ['開始タグ <code>&lt;html&gt;</code> の中に <code>lang="ja"</code> を足す。'], '<html lang="ja">', 'html'),
        T(2, '<head> の中に、文字コード（meta charset）と <title>（中身あり）を書く', hasRe(v['index.html'], /<meta[^>]*charset=["']?utf-8/i) && hasRe(v['index.html'], /<title>[^<]+<\/title>/i), ['<code>&lt;meta charset="UTF-8"&gt;</code> と <code>&lt;title&gt;ページ名&lt;/title&gt;</code> を head の中に。'], '<meta charset="UTF-8">\n<title>マイページ</title>', 'html'),
      ],
    }),
    'よく使うタグ図鑑': web({
      files: [H('<!-- ① 画像：<img src="…" alt="説明"> -->\n\n<!-- ② 表：2行2列の table -->\n')],
      sol: { 'index.html': '<img src="cat.jpg" alt="ねこの写真">\n<table>\n  <tr><th>名前</th><th>年齢</th></tr>\n  <tr><td>たろう</td><td>20</td></tr>\n</table>' },
      tasks: (d) => [
        T(1, '画像（img）に src と alt（説明）を付ける', Q(d, 'img').some((i) => (i.getAttribute('src') || '').trim() && (i.getAttribute('alt') || '').trim()), ['img は閉じタグ無し。<code>&lt;img src="cat.jpg" alt="ねこの写真"&gt;</code>'], '<img src="cat.jpg" alt="ねこの写真">', 'html'),
        T(2, '2行2列の表（table / tr / th・td）を作る', Q(d, 'table tr').length >= 2 && Q(d, 'table tr').every((r) => r.querySelectorAll('th,td').length >= 2), ['<code>&lt;tr&gt;</code> が1行。その中に <code>&lt;th&gt;</code> か <code>&lt;td&gt;</code> を2つ。'], '<table>\n  <tr><th>名前</th><th>年齢</th></tr>\n  <tr><td>たろう</td><td>20</td></tr>\n</table>', 'html'),
      ],
    }),
    'リスト：ul / ol / dl': web({
      files: [H('<!-- ① 申込の手順（順番あり）を ol で3つ：日時を選ぶ → ビデオ通話 → 見積りを確認 -->\n\n<!-- ② 料金表を dl で：dt（項目）と dd（金額）のペアを2組 -->\n')],
      sol: { 'index.html': '<ol>\n  <li>日時を選ぶ</li>\n  <li>ビデオ通話</li>\n  <li>見積りを確認</li>\n</ol>\n<dl>\n  <dt>初回30分</dt><dd>無料</dd>\n  <dt>2回目以降</dt><dd>5,500円</dd>\n</dl>' },
      tasks: (d) => [
        T(1, '番号つきリスト（ol）に、手順（li）を3つ入れる', Q(d, 'ol > li').length >= 3, ['順番に意味があるときは ol。中は <code>&lt;li&gt;</code>。途中に足しても番号は自動で直る。'], '<ol>\n  <li>日時を選ぶ</li>\n  <li>ビデオ通話</li>\n  <li>見積りを確認</li>\n</ol>', 'html'),
        T(2, '料金表を dl で作る：用語（dt）と説明（dd）のペアを2組', Q(d, 'dl > dt').length >= 2 && Q(d, 'dl > dd').length >= 2, ['<code>&lt;dt&gt;項目&lt;/dt&gt;&lt;dd&gt;金額&lt;/dd&gt;</code> を2組。'], '<dl>\n  <dt>初回30分</dt><dd>無料</dd>\n  <dt>2回目以降</dt><dd>5,500円</dd>\n</dl>', 'html'),
      ],
    }),
    'フォーム：データを送る': web({
      h: 240,
      files: [H('<form>\n  <!-- ① label と input を for / id でペアにする -->\n\n  <!-- ② 送信ボタン -->\n</form>')],
      sol: { 'index.html': '<form>\n  <label for="nm">お名前</label>\n  <input id="nm" name="name" type="text">\n  <button type="submit">申し込む</button>\n</form>' },
      tasks: (d) => [
        T(1, 'label の for と input の id を同じにしてペアにする', Q(d, 'label[for]').some((l) => l.getAttribute('for') && d.getElementById(l.getAttribute('for')) && /^(input|select|textarea)$/i.test(d.getElementById(l.getAttribute('for')).tagName)), ['<code>&lt;label for="nm"&gt;</code> と <code>&lt;input id="nm"&gt;</code> の名前を合わせる。'], '<label for="nm">名前</label>\n<input id="nm" name="name" type="text">', 'html'),
        T(2, 'input に name を付け、form の中に送信ボタンを置く', Q(d, 'form input[name]').length >= 1 && Q(d, 'form button, form input[type=submit]').some((b) => !b.getAttribute('type') || /submit/i.test(b.getAttribute('type'))), ['送るデータの名前は name。ボタンは <code>&lt;button type="submit"&gt;</code>。'], '<button type="submit">送信</button>', 'html'),
      ],
    }),
    '作ってみよう：企画と公開': web({
      h: 240,
      files: [H('<!-- 企画書サイトの最初のひな形 -->\n<!-- ① タイトル（h1）と、誰のためのサービスか（p） -->\n\n<!-- ② ページ内メニュー：nav にリンク2つ（#id）と、飛び先の id -->\n')],
      sol: { 'index.html': '<h1>勉強メモアプリ</h1>\n<p>毎日の学びを残したい学生のためのサービスです。</p>\n<nav>\n  <a href="#why">なぜ作る？</a>\n  <a href="#how">どう作る？</a>\n</nav>\n<h2 id="why">なぜ作る？</h2>\n<h2 id="how">どう作る？</h2>' },
      tasks: (d) => [
        T(1, 'タイトル（h1）と、サービスの説明の段落（p）を書く', Q(d, 'h1').some((x) => x.textContent.trim().length >= 2) && Q(d, 'p').some((x) => x.textContent.trim().length >= 5), ['h1 にサービス名、p に「誰の何を助けるか」を書く。'], '<h1>勉強メモアプリ</h1>\n<p>毎日の学びを残したい学生のためのサービスです。</p>', 'html'),
        T(2, 'nav に #id のリンクを2つ作り、飛び先の見出しにも id を付ける', (() => { const hs = Q(d, 'nav a[href^="#"]').map((a) => a.getAttribute('href').slice(1)).filter((x) => x); return hs.length >= 2 && hs.filter((id) => d.getElementById(id)).length >= 2; })(), ['<code>&lt;a href="#why"&gt;</code> の行き先は <code>&lt;h2 id="why"&gt;</code>。'], '<nav>\n  <a href="#why">なぜ作る？</a>\n  <a href="#how">どう作る？</a>\n</nav>\n<h2 id="why">なぜ作る？</h2>\n<h2 id="how">どう作る？</h2>', 'html'),
      ],
    }),
  };

  /* ================= cuivim ================= */
  const VIMNOTE = note('Vim で<b>押すキー</b>を、1行に1つずつ書く。例：<code>i</code> → 挿入モード / <code>Esc</code> → ノーマルへ / 文字は、そのまま書く。');
  D.cuivim = {
    'なぜターミナル？': txt({
      start: '# 1行に1コマンドで書こう\n',
      note: note('30枚の写真に <code>trip_</code> を付ける作業を、<b>命令</b>で行う。'),
      sol: 'mv photo1.jpg trip_photo1.jpg\nfor f in photo*.jpg; do mv "$f" "trip_$f"; done',
      tasks: (L, raw) => [
        T(1, 'mv で photo1.jpg を trip_photo1.jpg に名前変更する', find(L, /^mv\s+photo1\.jpg\s+trip_photo1\.jpg$/) >= 0, ['名前変更は <code>mv 元の名前 新しい名前</code>。'], 'mv photo1.jpg trip_photo1.jpg'),
        T(2, 'for で photo*.jpg ぜんぶを、1行でまとめて trip_ 付きに改名する', /for\s+\w+\s+in\s+\S*\*\S*\s*;\s*do\s+mv\s+.*trip_.*;\s*done/.test(raw.replace(/\n/g, ' ')), ['<code>for f in photo*.jpg; do …; done</code> の「…」に mv を書く。'], 'for f in photo*.jpg; do mv "$f" "trip_$f"; done'),
      ],
    }),
    'ターミナルを触ってみよう': txt({
      start: '# 1行に1コマンドで書こう\n',
      note: note('いまの場所を知って、フォルダを行き来する命令を書く。'),
      sol: 'pwd\nls\ncd docs\ncd ..',
      tasks: (L) => [
        T(1, 'pwd で今の場所を見て、ls で中身を見る（この順）', seq(L, [/^pwd$/, /^ls(\s+-\w+)*$/]), ['まず「どこ？」= pwd、次に「何がある？」= ls。'], 'pwd\nls'),
        T(2, 'cd docs で入って、cd .. で1つ上に戻る（この順）', seq(L, [/^cd\s+docs\/?$/, /^cd\s+\.\.\/?$/]), ['<code>..</code> は1つ上のフォルダ。'], 'cd docs\ncd ..'),
      ],
    }),
    'Vim：3つのモード': txt({
      name: 'keys.txt', lang: 'text', h: 220, start: '# 押すキーを1行ずつ\n', note: VIMNOTE,
      sol: 'i\nhello\nEsc\ndd\np\n:wq',
      tasks: (L) => { const a = find(L, /^[iao]$/), e = a < 0 ? -1 : find(L, /^esc$/i, a + 1); return [
        T(1, 'i で挿入モードに入り、文字を書いて、Esc でノーマルモードに戻る', a >= 0 && e > a + 1, ['書く前に <code>i</code>、書き終わったら <code>Esc</code>。間に書く文字を1行入れる。'], 'i\nhello\nEsc', 'text'),
        T(2, 'Esc のあと :wq で保存して終了する', seq(L, [/^esc$/i, /^(:wq|ZZ)$/]), ['コマンドは Esc で戻ってから。<code>:wq</code> = 保存して終了。'], 'Esc\n:wq', 'text'),
        T(3, 'ノーマルモードで dd（行を消す）→ p（貼り付け）をする', seq(L, [/^esc$/i, /^dd$/, /^p$/]), ['dd は行ごと消してコピーも兼ねる。p でカーソルの下に貼る。'], 'Esc\ndd\np', 'text'),
      ]; },
    }),
  };

  /* ================= git ================= */
  D.git = {
    'なぜ Git？': txt({
      start: '# 1行に1コマンドで書こう\n',
      note: note('履歴（誰が・いつ・なぜ）を残して、あとで見るまでの流れ。'),
      sol: 'git init\ngit add .\ngit commit -m "最初の版"\ngit log',
      tasks: (L) => [
        T(1, 'git init → git add . → git commit -m "…" の順に書く（履歴を1つ残す）', seq(L, [/^git init$/, /^git add\s+\S+/, /^git commit\s+-m\s+["'].+["']$/]), ['作る（init）→ 選ぶ（add）→ 記録する（commit -m "メッセージ"）。'], 'git init\ngit add .\ngit commit -m "最初の版"'),
        T(2, 'commit のあとに git log で、履歴（誰が・いつ・なぜ）を見る', seq(L, [/^git commit\b/, /^git log\b/]), ['履歴を見るのは <code>git log</code>。'], 'git log'),
      ],
    }),
    '4つの場所とコマンド': txt({
      start: '# 1行に1コマンドで書こう（a.html だけ記録したい）\n',
      note: note('作りかけの <code>b.html</code> は<b>記録せず</b>、<code>a.html</code> だけ記録して送る。'),
      sol: 'git status\ngit add a.html\ngit commit -m "feat: a.html を追加"\ngit push -u origin feature/a-page',
      tasks: (L) => [
        T(1, 'a.html だけを add して commit する（git add . は使わない）', seq(L, [/^git add\s+a\.html$/, /^git commit\s+-m\s+["'].+["']$/]) && find(L, /^git add\s+(\.|-A|--all)$/) < 0, ['add のあとに、記録したいファイル名だけを書く。'], 'git add a.html\ngit commit -m "a.html を追加"'),
        T(2, 'git status → add → commit のあと、自分の枝（feature/…）を git push -u origin で GitHub に送る（main へは直接送らない）', seq(L, [/^git status$/, /^git add\b/, /^git commit\b/, /^git push\s+-u\s+origin\s+feature\/\S+$/]) && find(L, /^git push\b.*\bmain\b/) < 0, ['作業フォルダ → ステージ → ローカル → リモート の順に進む。送るのは自分の作業用の枝。'], 'git status\ngit add a.html\ngit commit -m "feat: a.html を追加"\ngit push -u origin feature/a-page'),
      ],
    }),
    'ブランチとマージ': txt({
      h: 230, start: '# 1行に1コマンドで書こう\n',
      note: note('main は直接触らない。<b>最新の main から自分の枝を作り</b>、GitHub に push して、<b>Pull Request で合流</b>する流れ。（merge ボタンは GitHub の画面で押すので、コマンドは書かない）'),
      sol: 'git checkout main\ngit pull\ngit checkout -b feature/login\ngit add .\ngit commit -m "ログイン画面を追加"\ngit push -u origin feature/login\ngit checkout main\ngit pull',
      tasks: (L) => [
        T(1, 'main を最新にして（checkout main → pull）、git checkout -b feature/login で自分の枝を作る', seq(L, [/^git checkout\s+main$/, /^git pull\b/, /^git checkout\s+-b\s+feature\/\S+$/]), ['枝は「最新の main」から作る。作る前に pull。'], 'git checkout main\ngit pull\ngit checkout -b feature/login'),
        T(2, 'add → commit のあと、git push -u origin feature/login で GitHub に送る（ここで Pull Request を作る）', seq(L, [/^git checkout\s+-b\s+(feature\/\S+)$/, /^git add\b/, /^git commit\s+-m\s+["'].+["']$/, /^git push\s+-u\s+origin\s+feature\/\S+$/]), ['初めて送る枝には <code>-u origin 枝の名前</code>。'], 'git add .\ngit commit -m "ログイン画面を追加"\ngit push -u origin feature/login'),
        T(3, 'GitHub で merge したあと、main に戻って git pull で取り込む（この順）', seq(L, [/^git push\s+-u\s+origin\s+\S+$/, /^git checkout\s+main$/, /^git pull\b/]) && find(L, /^git merge\b/) < 0, ['merge は GitHub 上で済んでいる。手元の main は pull で追いつくだけ。'], 'git checkout main\ngit pull'),
      ],
    }),
    'コンフリクトを解決しよう': {
      mode: 'text', height: 260,
      files: [
        { name: 'index.html', lang: 'html', code: '<h1>\n<<<<<<< HEAD\nこんにちは（自分の変更）\n=======\nHello（main の変更）\n>>>>>>> main\n</h1>' },
        { name: 'commands.sh', lang: 'sh', code: '# 自分の枝（feature/title）が main とぶつかった場面。\n# main を取り込むところから、送るところまでのコマンドを順番に書こう\n' },
      ],
      note: note('<code>index.html</code> に残った<b>印</b>（&lt;&lt;&lt;&lt;&lt;&lt;&lt; / ======= / &gt;&gt;&gt;&gt;&gt;&gt;&gt;）を手で消して、最終的な内容にする。そのあと <code>commands.sh</code> に、<b>main を最新にして自分の枝に取り込み、解決して送る</b>までのコマンドを書く。'),
      solution: { 'index.html': '<h1>\nこんにちは（自分の変更）\nHello（main の変更）\n</h1>', 'commands.sh': 'git checkout main\ngit pull\ngit checkout feature/title\ngit merge main\ngit add index.html\ngit commit -m "main を取り込んでコンフリクトを解決"\ngit push' },
      tasks: (v) => {
        const h = String(v['index.html'] || ''), L = ln(v['commands.sh']);
        const clean = !/<<<<<<<|=======|>>>>>>>/.test(h);
        const body = h.replace(/<\/?h1>/g, '').trim();
        return [
          T(1, '印（<<<<<<< / ======= / >>>>>>>）を3行とも全部消す（中身は残す）', clean && body.length >= 5, ['印の3行は Git が付けた目印。ファイルに残したままだと、そのままコードとして扱われてしまう。'], '<h1>\nこんにちは（自分の変更）\n</h1>', 'html'),
          T(2, '自分の行も main の行も、両方残す（印は全部消す）', clean && /こんにちは/.test(h) && /Hello/.test(h), ['どちらを残すかは人が決める。今回は両方の行を、印なしで残そう。'], '<h1>\nこんにちは（自分の変更）\nHello（main の変更）\n</h1>', 'html'),
          T(3, 'git checkout main → git pull → git checkout feature/… → git merge main → git add → git commit → git push の順に書く', seq(L, [/^git checkout\s+main$/, /^git pull\b/, /^git checkout\s+feature\/\S+$/, /^git merge\s+main$/, /^git add\s+(index\.html|\.)$/, /^git commit\s+-m\s+["'].+["']$/, /^git push\b/]), ['最新の main を取り込む（pull → 自分の枝に戻る → merge main）。直したら add → commit → push。'], 'git checkout main\ngit pull\ngit checkout feature/title\ngit merge main\ngit add index.html\ngit commit -m "main を取り込んでコンフリクトを解決"\ngit push'),
        ];
      },
    },
    'コミットの書き方・PR の書き方': txt({
      h: 250, name: 'message.txt', start: '# コミットのコマンドと、PR の説明を書こう\n',
      note: note('<b>履歴は未来の自分とチームへの手紙</b>。「種類: 何をした」で commit を書き、PR には「何を・なぜ・確認方法」を書く。'),
      sol: 'git commit -m "feat: 案件検索を追加"\ngit commit -m "fix: 書面作成の金額を 25,000 円に直す"\n\n## 何を\n案件一覧に検索ボックスを追加\n## なぜ\n件数が増えて探しにくいため\n## 確認方法\n案件一覧で「山田」と入力して、該当の案件だけが出ること',
      tasks: (L, raw) => {
        const msgs = L.map((x) => x.match(/^git commit\s+-m\s+["'](feat|fix|docs|refactor|test|chore)(\([^)]*\))?:\s*(.{4,})["']$/)).filter(Boolean);
        const sec = (n) => new RegExp('^##\\s*' + n + '[^\\n]*\\n\\s*\\S', 'm').test(raw);
        return [
          T(1, '「feat: ○○」か「fix: ○○」の形で、commit のコマンドを 1 つ書く', msgs.length >= 1, ['<code>git commit -m "feat: 案件検索を追加"</code> のように、先頭に「種類:」を付ける。'], 'git commit -m "feat: 案件検索を追加"'),
          T(2, '種類の違う commit を 2 つ書く（例：feat と fix）。1 つの commit に 2 つのことを混ぜない', new Set(msgs.map((m) => m[1])).size >= 2, ['新しい機能は feat、バグ修正は fix。別々の commit にする。'], 'git commit -m "fix: 書面作成の金額を 25,000 円に直す"'),
          T(3, 'PR の説明に「## 何を」「## なぜ」「## 確認方法」の 3 つの見出しを書き、それぞれに 1 行以上の文章を書く', sec('何を') && sec('なぜ') && sec('確認方法'), ['見出しの次の行に、1 文でよいので書く。レビューする人が迷わないための 3 点。'], '## 何を\n案件一覧に検索ボックスを追加\n## なぜ\n件数が増えて探しにくいため\n## 確認方法\n案件一覧で「山田」と入力して、該当だけが出る'),
        ];
      },
    }),
    'レビュー指摘に対応': txt({
      h: 230, start: '# 1行に1コマンドで書こう（いまは feature/search の上。PR にコメントが付いた）\n',
      note: note('PR のレビューで「空のとき全件が出る」と指摘された。<b>同じ枝のまま</b>直して push する（PR は出し直さない）。'),
      sol: 'git add search.html\ngit commit -m "fix: 空のときは検索しない"\ngit push\ngit checkout main\ngit pull\ngit branch -d feature/search',
      tasks: (L) => [
        T(1, '直したファイルを add して、「fix: …」で commit する', seq(L, [/^git add\s+\S+/, /^git commit\s+-m\s+["']fix(\([^)]*\))?:\s*.{3,}["']$/]), ['直した内容がわかるメッセージにする。種類は fix。'], 'git add search.html\ngit commit -m "fix: 空のときは検索しない"'),
        T(2, '同じ枝へ git push する（-u は不要）。新しい枝を作って PR を出し直さない', seq(L, [/^git commit\b/, /^git push$/]) && find(L, /^git checkout\s+-b\b/) < 0, ['もう upstream は設定済み。<code>git push</code> だけで、PR に commit が追加される。'], 'git push'),
        T(3, 'Merge されたら、main に戻って pull し、役目を終えた枝を git branch -d で消す', seq(L, [/^git push$/, /^git checkout\s+main$/, /^git pull\b/, /^git branch\s+-d\s+feature\/\S+$/]), ['merge は GitHub 上で済んでいる。手元は pull で追いつく → 枝を掃除。'], 'git checkout main\ngit pull\ngit branch -d feature/search'),
      ],
    }),
    'ミスを取り消す': txt({
      h: 250, start: '# 場面ごとに、使うコマンドを書こう\n',
      note: note('<b>push 前</b>と<b>push 後</b>で使うコマンドが違う。みんなが見ている履歴は<b>書き換えない</b>。'),
      sol: '# 1) push 前：メッセージの誤字\ngit commit --amend -m "feat: 料金表を追加"\n# 2) push 前：余計なファイルを入れた\ngit reset --soft HEAD~1\ngit restore --staged debug.log\ngit commit -m "feat: 料金表を更新"\n# 3) push 済みの誤り\ngit revert a1b2c3d\ngit push',
      tasks: (L) => [
        T(1, '【push 前】直前の commit のメッセージの誤字を、git commit --amend -m "…" で直す', find(L, /^git commit\s+--amend\s+-m\s+["'].+["']$/) >= 0, ['直前の commit を作り直す。<code>--amend</code>。'], 'git commit --amend -m "feat: 料金表を追加"'),
        T(2, '【push 前】余計なファイルを入れた commit を、reset --soft HEAD~1 で取り消し、restore --staged で外し、commit し直す（この順）', seq(L, [/^git reset\s+--soft\s+HEAD~1$/, /^git restore\s+--staged\s+\S+$/, /^git commit\s+-m\s+["'].+["']$/]), ['取り消す（変更は残す）→ 余計なファイルだけステージから外す → 正しい中身で commit。'], 'git reset --soft HEAD~1\ngit restore --staged debug.log\ngit commit -m "feat: 料金表を更新"'),
        T(3, '【push 済み】git revert <ハッシュ> で取り消して push する。--force や reset --hard は使わない', seq(L, [/^git revert\s+\S+/, /^git push\b/]) && find(L, /--force|\s-f(\s|$)|reset\s+--hard/) < 0, ['みんなが見ている履歴は、書き換えず「取り消す commit」を足す。'], 'git revert a1b2c3d\ngit push'),
      ],
    }),
    '作業を一時退避：stash': txt({
      h: 250, start: '# いまは feature/price-table で作業中（commit していない）。本番の誤字を急ぎで直す\n',
      note: note('作業を<b>stash でしまう</b> → main から hotfix の枝で直す → 元の枝に戻って<b>取り出す</b>。'),
      sol: 'git stash\ngit checkout main\ngit checkout -b hotfix/price-typo\ngit add price.html\ngit commit -m "fix: 料金表の誤字を直す"\ngit push -u origin hotfix/price-typo\ngit checkout feature/price-table\ngit stash pop',
      tasks: (L) => [
        T(1, 'git stash で作業をしまってから、git checkout main で移る（この順）', seq(L, [/^git stash(\s+push)?$/, /^git checkout\s+main$/]), ['commit したくない作業中の変更は <code>git stash</code>。'], 'git stash\ngit checkout main'),
        T(2, 'main から hotfix/… の枝を作り、add → commit → git push -u origin hotfix/… で送る', seq(L, [/^git checkout\s+main$/, /^git checkout\s+-b\s+hotfix\/\S+$/, /^git add\b/, /^git commit\s+-m\s+["'].+["']$/, /^git push\s+-u\s+origin\s+hotfix\/\S+$/]), ['緊急の修正は、最新の main から別の枝で行う。'], 'git checkout -b hotfix/price-typo\ngit add price.html\ngit commit -m "fix: 料金表の誤字を直す"\ngit push -u origin hotfix/price-typo'),
        T(3, '元の枝に戻って git stash pop でしまった作業を取り出す（push のあとに）', seq(L, [/^git push\b/, /^git checkout\s+feature\/\S+$/, /^git stash pop$/]), ['枝を戻してから <code>git stash pop</code>。'], 'git checkout feature/price-table\ngit stash pop'),
      ],
    }),
    '履歴を調べる': txt({
      h: 230, start: '# 「書面作成の金額を、誰が・いつ・なぜ変えた？」を調べよう\n',
      note: note('<code>log</code>（いつ）→ <code>blame</code>（誰が）→ <code>show</code>（なぜ・何を）→ <code>diff</code>（2点の差）。'),
      sol: 'git log --oneline price.html\ngit blame price.html\ngit show a1b2c3d\ngit diff a1b2c3d e5d4c3b',
      tasks: (L) => [
        T(1, 'git log --oneline price.html で、このファイルの履歴だけを見る', find(L, /^git log\s+--oneline\s+(--\s+)?price\.html$/) >= 0, ['ファイル名を付けると、そのファイルを変えた commit だけが出る。'], 'git log --oneline price.html'),
        T(2, 'git blame price.html で行ごとの持ち主を見て、git show <ハッシュ> で中身を見る（この順）', seq(L, [/^git blame\s+price\.html$/, /^git show\s+\S+$/]), ['blame は 1 行ごとに最後に変えた commit。show でメッセージ（なぜ）が分かる。'], 'git blame price.html\ngit show a1b2c3d'),
        T(3, 'git diff <古い> <新しい> で、2つの時点を比べる', find(L, /^git diff\s+\S+\s+\S+$|^git diff\s+\S+\.\.\S+$/) >= 0, ['<code>git diff 古いハッシュ 新しいハッシュ</code>。「先週」と「いま」を比べる。'], 'git diff a1b2c3d e5d4c3b'),
      ],
    }),
    'リリースとタグ': txt({
      h: 250, start: '# develop → main の PR を Merge したあと、本番リリースの印を付けよう\n',
      note: note('本番に出した版に<b>名前（タグ）</b>を付けておくと、「いま本番はどの版？」「どこに戻す？」に答えられる。'),
      sol: 'git checkout main\ngit pull\ngit tag v1.2.0\ngit push origin v1.2.0\ngit revert a1b2c3d\ngit push\ngit tag v1.2.1\ngit push origin v1.2.1',
      tasks: (L) => [
        T(1, 'main を最新にして、git tag v1.2.0 のように「v 数字.数字.数字」でタグを付ける', seq(L, [/^git checkout\s+main$/, /^git pull\b/, /^git tag\s+v\d+\.\d+\.\d+$/]), ['タグは「v主.副.修正」。いまの commit に名前を付ける。'], 'git checkout main\ngit pull\ngit tag v1.2.0'),
        T(2, 'タグを GitHub に送る（git push origin v1.2.0）。push だけではタグは送られない', find(L, /^git push\s+origin\s+v\d+\.\d+\.\d+$/) >= 0, ['<code>git push origin タグ名</code>。'], 'git push origin v1.2.0'),
        T(3, '本番でバグ → git revert <ハッシュ> → push → 新しいタグ（v1.2.1）を付けて送る', seq(L, [/^git tag\s+v\d+\.\d+\.\d+$/, /^git revert\s+\S+/, /^git push\b/, /^git tag\s+v\d+\.\d+\.\d+$/, /^git push\s+origin\s+v\d+\.\d+\.\d+$/]), ['直した版には新しいタグ。古いタグは消さない（記録として残す）。'], 'git revert a1b2c3d\ngit push\ngit tag v1.2.1\ngit push origin v1.2.1'),
      ],
    }),
    '秘密情報を commit してしまった': txt({
      h: 260, start: '# .env（API キー入り）を push してしまった。やる順番を書こう\n',
      note: note('<b>最優先はキーの無効化</b>。そのあと、二度と Git に入らないようにする。'),
      sol: '# 先にサービスの管理画面でキーを無効化して、新しいキーを発行した\necho ".env" >> .gitignore\ngit rm --cached .env\ngit add .gitignore\ngit commit -m "chore: .env を Git の管理から外す"\ngit push',
      tasks: (L, raw) => [
        T(1, '最初に「# …キーを無効化…」のメモ行を書く（コマンドより前に）', /^#.*(無効|ローテ|rotate|revoke|再発行)/mi.test(raw) && (raw.search(/^#.*(無効|ローテ|rotate|revoke|再発行)/mi) < (raw.search(/^git |^echo /m) < 0 ? 1e9 : raw.search(/^git |^echo /m))), ['push した秘密は「漏れた前提」。ファイルを消す前に、サービス側でキーを無効にして新しいキーを発行する。'], '# 先にサービスの管理画面でキーを無効化して、新しいキーを発行した', 'text'),
        T(2, '.gitignore に .env を書き、git rm --cached .env で Git の管理から外す（ファイルは手元に残る）', seq(L, [/^echo\s+["']?\.env["']?\s*>>\s*\.gitignore$/, /^git rm\s+--cached\s+\.env$/]), ['<code>echo ".env" &gt;&gt; .gitignore</code>。<code>--cached</code> を付けると、実ファイルは消えない。'], 'echo ".env" >> .gitignore\ngit rm --cached .env'),
        T(3, '.gitignore を add → commit → push で反映する', seq(L, [/^git rm\s+--cached\b/, /^git add\s+\.gitignore$/, /^git commit\s+-m\s+["'].+["']$/, /^git push\b/]), ['.gitignore 自体も Git で管理する。'], 'git add .gitignore\ngit commit -m "chore: .env を Git の管理から外す"\ngit push'),
      ],
    }),
    'GitHub と SSH でつなぐ': txt({
      h: 200, start: '# 1行に1コマンドで書こう\n',
      note: note('パスワードの代わりに<b>鍵のペア</b>で GitHub につなぐ手順。'),
      sol: 'ssh-keygen -t ed25519\ncat ~/.ssh/id_ed25519.pub\nssh -T git@github.com',
      tasks: (L) => [
        T(1, 'ssh-keygen -t ed25519 で、鍵のペアを作る', find(L, /^ssh-keygen\s+-t\s+ed25519\b/) >= 0, ['鍵づくりは <code>ssh-keygen</code>。種類は <code>-t ed25519</code>。'], 'ssh-keygen -t ed25519'),
        T(2, 'cat で公開鍵（.pub）を表示し、ssh -T git@github.com で接続テストする（この順）', seq(L, [/^cat\s+\S*\.pub$/, /^ssh\s+-T\s+git@github\.com$/]), ['GitHub に登録するのは「公開鍵（.pub）」だけ。秘密鍵は見せない。'], 'cat ~/.ssh/id_ed25519.pub\nssh -T git@github.com'),
      ],
    }),
  };

  /* ================= css ================= */
  D.css = {
    'CSS の付け方 3 通り': web({
      files: [H('<!-- ① head の中の link で style.css を読み込む -->\n<h1>見出し</h1>\n<p>本文</p>\n<!-- ② p の style 属性（インライン）で色を変える -->'), C('/* ③ 外部ファイル：h1 の色を変える */\n')],
      sol: { 'index.html': '<link rel="stylesheet" href="style.css">\n<h1>見出し</h1>\n<p style="color: green;">本文</p>', 'style.css': 'h1 { color: tomato; }' },
      tasks: (d, v) => [
        T(1, 'link タグで style.css を読み込む', /<link[^>]*rel=["']stylesheet["'][^>]*href=["']style\.css["']|<link[^>]*href=["']style\.css["'][^>]*rel=["']stylesheet["']/i.test(v['index.html']), ['<code>&lt;link rel="stylesheet" href="style.css"&gt;</code> を書く。'], '<link rel="stylesheet" href="style.css">', 'html'),
        T(2, '外部ファイル（style.css）で、h1 の文字色を黒以外にする', d && Q(d, 'h1')[0] && cs(d, Q(d, 'h1')[0]).color !== 'rgb(0, 0, 0)', ['<code>h1 { color: tomato; }</code>'], 'h1 { color: tomato; }', 'css'),
        T(3, 'インライン（style 属性）で、p の文字色を変える', Q(d, 'p[style]').some((p) => /color/i.test(p.getAttribute('style'))), ['タグの中に <code>style="color: green;"</code>。'], '<p style="color: green;">本文</p>', 'html'),
      ],
    }),
    'セレクタと強さ': web({
      files: [H('<form class="form">\n  <button class="btn-submit">申込む</button>\n</form>'), C('button { background: gray; }\n.form button { background: red; }\n/* ↓ ボタンを青にしたい */\n.btn-submit { background: blue; }\n')],
      sol: { 'index.html': '<form class="form">\n  <button class="btn-submit">申込む</button>\n</form>', 'style.css': 'button { background: gray; }\n.form button { background: red; }\n.form .btn-submit { background: blue; }\n' },
      tasks: (d, v) => { const b = d && d.querySelector('button'); const c = b ? cs(d, b).backgroundColor : ''; const m = String(c).match(/\d+/g) || []; const blue = m.length >= 3 && +m[2] > 150 && +m[2] > +m[0] + 60; const css = String(v['style.css'] || '').replace(/\/\*[\s\S]*?\*\//g, '');
        return [
          T(1, 'ボタンを青にする（今は .form button の赤に負けている）', blue, ['<code>.form button</code> は「クラス1＋タグ1」。自分のルールも同じかそれ以上に強くする。'], '.form .btn-submit { background: blue; }', 'css'),
          T(2, '!important と #id を使わずに、青にする', blue && !/!important/.test(css) && !/(^|[\s,}])#[\w-]+\s*[{,]/.test(css), ['クラスを1つ足すだけ：<code>.form .btn-submit</code>'], '.form .btn-submit { background: blue; }', 'css'),
          T(3, '.form button と同じ強さにして、それより下の行に書き、青にする', blue && /\.form\s+\.btn-submit/.test(css) && css.indexOf('.form .btn-submit') > css.indexOf('.form button'), ['<code>.form .btn-submit</code> を <code>.form button</code> より下の行に書く。'], '.form .btn-submit { background: blue; }', 'css'),
        ]; },
    }),
    '文字のスタイル': web({
      files: [H('<h1>タイトル</h1>\n<p>本文の文章です。行間が詰まっていると読みにくくなります。</p>'), C('/* 強弱をつけよう */\n')],
      sol: { 'index.html': '<h1>タイトル</h1>\n<p>本文の文章です。行間が詰まっていると読みにくくなります。</p>', 'style.css': 'h1 { font-size: 2.5rem; font-weight: 800; }\np { line-height: 1.8; }' },
      tasks: (d) => { const h1 = Q(d, 'h1')[0], p = Q(d, 'p')[0]; return [
        T(1, 'h1 の font-size を 40px（2.5rem）以上にして、太さ（font-weight）を 800 以上にする', h1 && px(cs(d, h1).fontSize) >= 40 && +cs(d, h1).fontWeight >= 800, ['<code>font-size: 2.5rem; font-weight: 800;</code>'], 'h1 { font-size: 2.5rem; font-weight: 800; }', 'css'),
        T(2, 'p の line-height を、文字の大きさの 1.8 倍以上にして、ゆったりさせる', p && px(cs(d, p).lineHeight) / px(cs(d, p).fontSize) >= 1.79, ['<code>line-height: 1.8;</code>（単位なしの数字が使いやすい）'], 'p { line-height: 1.8; }', 'css'),
      ]; },
    }),
    'ボックスモデル': web({
      files: [H('<div class="box">箱</div>'), C('.box {\n  width: 200px;\n  background: #cde;\n}\n/* padding・border・margin を足そう */\n')],
      sol: { 'index.html': '<div class="box">箱</div>', 'style.css': '.box {\n  width: 200px;\n  background: #cde;\n  padding: 20px;\n  border: 2px solid #345;\n  margin: 24px auto;\n  box-sizing: border-box;\n}' },
      tasks: (d) => { const b = Q(d, '.box')[0], s = b && cs(d, b); return [
        T(1, 'padding（内側の余白）を 20px にする', s && px(s.paddingTop) === 20 && px(s.paddingLeft) === 20, ['内側 = padding。<code>padding: 20px;</code>'], '.box { padding: 20px; }', 'css'),
        T(2, 'border を 2px 以上、margin（外側の余白）を 24px 以上にする', s && px(s.borderTopWidth) >= 2 && px(s.marginTop) >= 24, ['外側 = margin。<code>border: 2px solid #345; margin: 24px;</code>'], '.box { border: 2px solid #345; margin: 24px; }', 'css'),
        T(3, 'box-sizing: border-box にして、padding と border を足しても全体の幅を 200px にする', b && same(b.getBoundingClientRect().width, 200) && px(s.paddingLeft) >= 20 && px(s.borderLeftWidth) >= 2, ['border-box にすると、padding と border が width の中に入る。'], '.box { box-sizing: border-box; }', 'css'),
        Object.assign(T(3, '横の中央に置く（幅は 200px のまま、左右の margin を auto にする）', b && same(b.getBoundingClientRect().width, 200) && px(s.marginTop) >= 24 && Math.abs(b.getBoundingClientRect().left + b.getBoundingClientRect().width / 2 - d.documentElement.clientWidth / 2) <= 3, ['左右の margin を <code>auto</code> にすると、余りの幅を左右で等分して中央になる。', '<code>margin: 24px auto;</code>（上下 24px・左右 auto）'], '.box { margin: 24px auto; }', 'css'), { optional: true }),
      ]; },
    }),
    'display：inline / block': web({
      files: [H('<span class="tag">A</span>\n<span class="tag">B</span>\n<div class="items">\n<div class="item">1</div>\n<div class="item">2</div>\n<div class="item">3</div>\n</div>'), C('.tag { background: #fd9; width: 80px; }\n.item { background: #cde; width: 60px; }\n')],
      sol: { 'index.html': '<span class="tag">A</span>\n<span class="tag">B</span>\n<div class="items">\n<div class="item">1</div>\n<div class="item">2</div>\n<div class="item">3</div>\n</div>', 'style.css': '.tag { background: #fd9; width: 80px; display: inline-block; }\n.item { background: #cde; width: 60px; display: inline-block; }' },
      tasks: (d) => { const t = Q(d, '.tag')[0], it = Q(d, '.item'); return [
        T(1, '.tag の width: 80px が効くようにする（display を変える）', t && same(t.getBoundingClientRect().width, 80), ['inline には width が効かない。<code>display: inline-block;</code> にする。'], '.tag { display: inline-block; }', 'css'),
        T(2, '.item の3つを、width を保ったまま横1列に並べる', it.length === 3 && it.every((e) => same(e.getBoundingClientRect().top, it[0].getBoundingClientRect().top) && same(e.getBoundingClientRect().width, 60)), ['block は縦に積まれる。<code>display: inline-block;</code> で横に並ぶ。'], '.item { display: inline-block; }', 'css'),
      ]; },
    }),
    'Flexbox で並べる': web({
      files: [H('<div class="row">\n  <div class="item">1</div>\n  <div class="item">2</div>\n  <div class="item">3</div>\n</div>'), C('.row { height: 120px; background: #eef; }\n.item { background: #cde; padding: 8px 16px; }\n')],
      sol: { 'index.html': '<div class="row">\n  <div class="item">1</div>\n  <div class="item">2</div>\n  <div class="item">3</div>\n</div>', 'style.css': '.row { height: 120px; background: #eef; display: flex; justify-content: center; align-items: center; }\n.item { background: #cde; padding: 8px 16px; }' },
      tasks: (d) => { const r = Q(d, '.row')[0], it = Q(d, '.item'); return [
        T(1, '.row を display: flex にして、3つを横1列に並べる', r && cs(d, r).display === 'flex' && it.length === 3 && it.every((e) => same(e.getBoundingClientRect().top, it[0].getBoundingClientRect().top)), ['並べ方は親に書く。<code>display: flex;</code>'], '.row { display: flex; }', 'css'),
        T(2, 'justify-content と align-items を center にして、真ん中に集める', r && cs(d, r).justifyContent === 'center' && cs(d, r).alignItems === 'center', ['主軸（横）= justify-content、交差軸（縦）= align-items。'], '.row { justify-content: center; align-items: center; }', 'css'),
      ]; },
    }),
    'position：重ねる・ずらす': web({
      files: [H('<div class="bell">\n  通知\n  <span class="badge">3</span>\n  <span class="dot"></span>\n</div>'), C('.bell { display: inline-block; padding: 10px 22px; margin: 24px; background: #e2e8f0; border-radius: 10px; font-weight: 700; }\n.badge { background: #ef4444; color: #fff; border-radius: 999px; padding: 0 .55em; font-size: .75rem; }\n.dot { width: 10px; height: 10px; border-radius: 50%; background: #16a34a; }\n')],
      sol: { 'index.html': '<div class="bell">\n  通知\n  <span class="badge">3</span>\n  <span class="dot"></span>\n</div>', 'style.css': '.bell { display: inline-block; padding: 10px 22px; margin: 24px; background: #e2e8f0; border-radius: 10px; font-weight: 700; position: relative; }\n.badge { background: #ef4444; color: #fff; border-radius: 999px; padding: 0 .55em; font-size: .75rem; position: absolute; top: -6px; right: -6px; }\n.dot { width: 10px; height: 10px; border-radius: 50%; background: #16a34a; position: absolute; bottom: -4px; left: -4px; }\n' },
      tasks: (d) => { const p = Q(d, '.bell')[0], b = Q(d, '.badge')[0], t = Q(d, '.dot')[0]; const pr = p && p.getBoundingClientRect(), br = b && b.getBoundingClientRect(), tr = t && t.getBoundingClientRect(); return [
        T(1, '親 .bell を position: relative、赤い数字 .badge を position: absolute にする（基準を決める）', p && b && cs(d, p).position === 'relative' && cs(d, b).position === 'absolute', ['親が基準（relative）、子が貼りつく側（absolute）。'], '.bell { position: relative; }\n.badge { position: absolute; }', 'css'),
        T(2, '赤い数字を、ベルの右上の角に 6px はみ出して貼る（top: -6px; right: -6px）', p && b && cs(d, b).position === 'absolute' && same(br.top, pr.top - 6) && same(br.right, pr.right + 6), ['top と right に負の値を入れると、角から外へはみ出す。'], '.badge { position: absolute; top: -6px; right: -6px; }', 'css'),
        Object.assign(T(3, '緑の点 .dot を、ベルの左下の角に 4px はみ出して置く（bottom: -4px; left: -4px）', p && t && cs(d, t).position === 'absolute' && same(tr.bottom, pr.bottom + 4) && same(tr.left, pr.left - 4), ['同じ「親 relative ＋ 子 absolute」。下と左を使う。'], '.dot { position: absolute; bottom: -4px; left: -4px; }', 'css'), { optional: true }),
      ]; },
    }),
    'fixed と sticky': web({
      h: 240,
      files: [H('<header class="head">ヘッダー</header>\n<main>\n  <p>本文</p><p>本文</p><p>本文</p><p>本文</p><p>本文</p><p>本文</p><p>本文</p><p>本文</p>\n</main>\n<a class="totop" href="#">↑</a>'), C('.head { background: #345; color: #fff; padding: 12px; }\n.totop { background: #fd9; padding: 8px 12px; }\n')],
      sol: { 'index.html': '<header class="head">ヘッダー</header>\n<main>\n  <p>本文</p><p>本文</p><p>本文</p><p>本文</p><p>本文</p><p>本文</p><p>本文</p><p>本文</p>\n</main>\n<a class="totop" href="#">↑</a>', 'style.css': '.head { background: #345; color: #fff; padding: 12px; position: sticky; top: 0; }\n.totop { background: #fd9; padding: 8px 12px; position: fixed; right: 16px; bottom: 16px; }' },
      tasks: (d) => { const h = Q(d, '.head')[0], t = Q(d, '.totop')[0]; return [
        T(1, 'ヘッダーを position: sticky; top: 0; にして、スクロールしても上に残す', h && cs(d, h).position === 'sticky' && px(cs(d, h).top) === 0, ['スクロールで止まる = sticky。止まる位置は <code>top: 0;</code>'], '.head { position: sticky; top: 0; }', 'css'),
        T(2, '「↑」を position: fixed; right: 16px; bottom: 16px; で、画面の右下に固定する', t && cs(d, t).position === 'fixed' && px(cs(d, t).right) === 16 && px(cs(d, t).bottom) === 16, ['画面に固定 = fixed。位置は right と bottom で決める。'], '.totop { position: fixed; right: 16px; bottom: 16px; }', 'css'),
      ]; },
    }),
    'z-index：重なり順': web({
      files: [H('<div class="a">A</div>\n<div class="b">B</div>\n<div class="popup">ポップアップ</div>'), C('.a, .b { position: absolute; width: 100px; height: 80px; }\n.a { left: 10px; top: 10px; background: #fa8; }\n.b { left: 50px; top: 40px; background: #8af; }\n.popup { position: absolute; left: 30px; top: 30px; padding: 10px; background: #fd9; }\n')],
      sol: { 'index.html': '<div class="a">A</div>\n<div class="b">B</div>\n<div class="popup">ポップアップ</div>', 'style.css': '.a, .b { position: absolute; width: 100px; height: 80px; }\n.a { left: 10px; top: 10px; background: #fa8; z-index: 2; }\n.b { left: 50px; top: 40px; background: #8af; z-index: 1; }\n.popup { position: absolute; left: 30px; top: 30px; padding: 10px; background: #fd9; z-index: 100; }' },
      tasks: (d) => { const a = Q(d, '.a')[0], b = Q(d, '.b')[0], p = Q(d, '.popup')[0]; const z = (e) => parseInt(cs(d, e).zIndex, 10); return [
        T(1, '.a を .b より手前に出す（.a の z-index を大きくする）', a && b && !isNaN(z(a)) && !isNaN(z(b)) && z(a) > z(b), ['数字が大きいほど手前。<code>.a { z-index: 2; } .b { z-index: 1; }</code>'], '.a { z-index: 2; }\n.b { z-index: 1; }', 'css'),
        T(2, '.popup の z-index を 100 以上にして、一番手前に出す', p && z(p) >= 100 && cs(d, p).position !== 'static' && (!a || z(p) > z(a)), ['position を付けた要素にだけ z-index が効く。popup は position 済み。'], '.popup { z-index: 100; }', 'css'),
      ]; },
    }),
    'Sass（プラスα）': txt({
      name: 'style.scss', lang: 'css', h: 220, start: '// SCSS で書こう\n',
      note: note('SCSS の<b>変数・入れ子・&amp;</b>を使って書く。（ブラウザが読む CSS には変換されます）'),
      sol: '$main: #3b82f6;\n.card {\n  color: $main;\n  .title {\n    border-color: $main;\n  }\n  &:hover {\n    opacity: .8;\n  }\n}',
      tasks: (L, raw) => [
        T(1, '変数 $main を作り、2か所以上で使う', /\$main\s*:/.test(raw) && (raw.match(/\$main\b/g) || []).length >= 3, ['<code>$main: #3b82f6;</code> を作って、色の所に <code>$main</code> と書く。'], '$main: #3b82f6;\n.card { color: $main; border: 1px solid $main; }', 'css'),
        T(2, '.card の中に .title を入れ子で書く', /\.card\s*\{[\s\S]*\.title\s*\{[\s\S]*\}[\s\S]*\}/.test(raw), ['{ } の中に、さらに { } を書ける。'], '.card {\n  .title { font-weight: bold; }\n}', 'css'),
        T(3, '& を使って、.card:hover を入れ子で書く', /&:hover\s*\{/.test(raw), ['& は「いま書いている親」のこと。<code>&amp;:hover { … }</code>'], '.card {\n  &:hover { opacity: .8; }\n}', 'css'),
      ],
    }),
  };

  /* ================= x-terminal ================= */
  D['x-terminal'] = {
    '困った：手作業の限界': txt({
      start: '# app.log から ERROR を探そう\n',
      note: note('<code>app.log</code> の中の <b>ERROR</b> を、目で数えずに<b>命令</b>で調べる。'),
      sol: 'grep -c ERROR app.log\ngrep -n ERROR app.log',
      tasks: (L) => [
        T(1, 'grep で、app.log の ERROR の行数を数える（-c、または | wc -l）', find(L, /^grep\s+(-c\s+ERROR|ERROR\s+-c)\s+app\.log$/) >= 0 || find(L, /^grep\s+ERROR\s+app\.log\s*\|\s*wc\s+-l$/) >= 0, ['<code>grep -c</code> は一致した行数を数える。'], 'grep -c ERROR app.log'),
        T(2, 'grep -n で、ERROR の行を行番号つきで表示する', find(L, /^grep\s+(-n\s+ERROR|ERROR\s+-n)\s+app\.log$/) >= 0, ['<code>-n</code> で行番号つき。'], 'grep -n ERROR app.log'),
      ],
    }),
    'キーボード便利技': txt({
      lang: 'text', start: '# キーの名前と役目を、1行に1つずつ（例：Tab = 名前の続きを補完）\n',
      note: note('打ち直さず<b>呼ぶ・動く・戻す</b>ための、キーの役目を書く。'),
      sol: '↑ = 前に打ったコマンドを呼び出す\nTab = 名前の続きを補完する\nCtrl+R = 履歴から検索する',
      tasks: (L) => [
        T(1, '「↑」と「Tab」の役目を、1行ずつ書く', find(L, /↑.*\S/) >= 0 && find(L, /Tab.*\S/i) >= 0 && L.some((x) => /↑/.test(x) && /履歴|前|呼/.test(x)) && L.some((x) => /Tab/i.test(x) && /補完|続き/.test(x)), ['↑ は履歴、Tab は補完。「＝」でつないで書く。'], '↑ = 前に打ったコマンドを呼び出す\nTab = 名前の続きを補完する', 'text'),
        T(2, '「Ctrl+R」の役目（履歴の検索）を書く', L.some((x) => /Ctrl\s*\+\s*R/i.test(x) && /検索|さが|探/.test(x)), ['Ctrl+R は、履歴の途中の文字から探せる。'], 'Ctrl+R = 履歴から検索する', 'text'),
      ],
    }),
    'パイプ ( | )：コマンドをつなぐ': txt({
      start: '# 障害対応：access.log（本番のアクセスログ）から、エラー(500)の多い URL を出す\n# 各行は「/consults 500」の形（URL ステータス）\n',
      note: note('<code>|</code> で、前の命令の出力を次の命令に渡す。<br>ログ → エラーだけ → URL だけ → 数える → 多い順。'),
      sol: 'cat access.log | grep " 500"\ncat access.log | grep " 500" | cut -d" " -f1 | sort | uniq -c | sort -rn',
      tasks: (L) => [
        T(1, 'access.log から、500 の行だけを取り出す（cat と grep を | でつなぐ）', find(L, /^cat\s+access\.log\s*\|\s*grep\s+["']\s?500["']\s*$/) >= 0 || find(L, /^grep\s+["']\s?500["']\s+access\.log\s*$/) >= 0, ['<code>cat access.log | grep " 500"</code>'], 'cat access.log | grep " 500"'),
        T(2, 'エラーの URL だけを取り出し、sort → uniq -c → sort -rn で「多い順」の数を出す', find(L, /^(cat\s+access\.log\s*\|\s*)?grep\s+["']\s?500["'](\s+access\.log)?\s*\|\s*(cut|awk)[^|]*\|\s*sort\s*\|\s*uniq\s+-c\s*\|\s*sort\s+-r?n/) >= 0, ['grep で 500 → cut で URL（1つ目）→ sort で並べる → uniq -c で数える → sort -rn で多い順。'], 'cat access.log | grep " 500" | cut -d" " -f1 | sort | uniq -c | sort -rn'),
      ],
    }),
    'リダイレクト と grep': txt({
      start: '# 障害対応：app.log（本番ログ）から原因の行を探して、メモに残す\n',
      note: note('結果を<b>ファイルに残す（&gt;）</b>、<b>足す（&gt;&gt;）</b>、<b>探す（grep）</b>。<br>ログには ERROR も error も混ざっている。'),
      sol: 'grep ERROR app.log > errors.txt\necho "13:00 原因を調査" >> memo.txt\ngrep -i error app.log',
      tasks: (L) => [
        T(1, 'app.log から ERROR の行だけを探して、errors.txt に保存する（>）', find(L, /^grep\s+(-\w+\s+)*["']?ERROR["']?\s+app\.log\s*>\s*errors\.txt$/) >= 0, ['探すのは grep、保存は <code>&gt;</code>。'], 'grep ERROR app.log > errors.txt'),
        T(2, '作業メモ memo.txt に echo で1行を足す（>>）。そのあと、小文字の error も拾う grep -i で探す', seq(L, [/^echo\s+.+>>\s*memo\.txt$/, /^grep\s+-\w*i\w*\s+["']?error["']?\s+app\.log$/]), ['<code>&gt;&gt;</code> は追記。大文字小文字を無視するのは <code>-i</code>。'], 'echo "13:00 原因を調査" >> memo.txt\ngrep -i error app.log'),
      ],
    }),
    'oh-my-zsh：短縮 alias': txt({
      start: '# alias を書こう\n',
      note: note('長い命令に<b>短いあだ名</b>（alias）を付ける。'),
      sol: "alias gs='git status'\nalias ll='ls -l'",
      tasks: (L) => [
        T(1, "alias gs='git status' を書く", find(L, /^alias\s+gs=(['"])git status\1$/) >= 0, ["形は <code>alias 短い名前='長い命令'</code>。"], "alias gs='git status'"),
        T(2, 'alias を、もう1つ別の名前で作る（合計2つ以上）', new Set(L.filter((x) => /^alias\s+[\w.-]+=(['"]).+\1$/.test(x)).map((x) => x.match(/^alias\s+([\w.-]+)=/)[1])).size >= 2, ["例：<code>alias ll='ls -l'</code>"], "alias ll='ls -l'"),
      ],
    }),
    'どれを使う？：ターミナル編': txt({
      start: '# 目的に合う記号・コマンドを1行ずつ書こう\n',
      note: note('<b>絞る</b>（grep）・<b>つなぐ</b>（|）・<b>残す</b>（&gt;）・<b>足す</b>（&gt;&gt;）。目的ごとに1行ずつ書く。'),
      sol: 'grep ERROR app.log\ncat app.log | sort\nls > list.txt\necho "end" >> list.txt',
      tasks: (L) => [
        T(1, '絞る（grep）と、つなぐ（|）を使った行を1つずつ書く', L.some((x) => /^grep\b/.test(x) && !/\|/.test(x)) && L.some((x) => /\|/.test(x) && !/>/.test(x)), ['grep は探す。| は次の命令に渡す。'], 'grep ERROR app.log\ncat app.log | sort'),
        T(2, '残す（>）と、足す（>>）を使った行を1つずつ書く', L.some((x) => /[^>]>[^>]/.test(x) && !/>>/.test(x)) && L.some((x) => />>/.test(x)), ['> は上書き、>> は追記。'], 'ls > list.txt\necho "end" >> list.txt'),
      ],
    }),
  };

  /* ================= x-vscode ================= */
  D['x-vscode'] = {
    'マルチカーソル & ショートカット': txt({
      name: 'main.js', lang: 'js', h: 220,
      start: '// 次の行の apple を、すべて item に直そう（マルチカーソルなら一瞬）\nconst apple = 1;\nconsole.log(apple);\nconst total = apple + 1;\n',
      note: note('同じ単語を<b>一度にまとめて</b>直す。<code>⌘D</code>（Windows は <code>Ctrl+D</code>）で次の同じ単語が選ばれる。'),
      sol: '// マルチカーソル：Cmd+D で選んで、まとめて書き換える\nconst item = 1;\nconsole.log(item);\nconst total = item + 1;\n',
      tasks: (L, raw) => [
        T(1, 'apple を、すべて item に書き換える（apple が1つも残らない）', !/apple/.test(raw.replace(/^\s*\/\/.*$/gm, '')) && (raw.replace(/^\s*\/\/.*$/gm, '').match(/\bitem\b/g) || []).length >= 3, ['⌘D を押すたびに、次の同じ単語が選ばれる。全部選んでから打てば一度に直る。'], 'const item = 1;\nconsole.log(item);\nconst total = item + 1;', 'js'),
        T(2, 'コメントに、次の同じ単語を選ぶショートカット（Cmd+D か Ctrl+D）を書く', /\/\/.*(Cmd|Ctrl|⌘)\s*\+?\s*D\b/i.test(raw), ['先頭に <code>// マルチカーソル：Cmd+D</code> のように書く。'], '// マルチカーソル：Cmd+D', 'js'),
      ],
    }),
    '保存するだけで整う': txt({
      name: 'main.js', lang: 'js', h: 220,
      start: "const fee=3300\nfunction calcTotal(n){\nconsole.log('合計 '+fee*n)\n}\ncalcTotal(2)\n",
      note: note('Prettier が保存で整えるのと同じ形に、手でそろえてみる。（インデント 2、ダブルクォート、文末 ;）'),
      sol: 'const fee = 3300;\nfunction calcTotal(n) {\n  console.log("合計 " + fee * n);\n}\ncalcTotal(2);\n',
      tasks: (L, raw) => [
        T(1, '{ } の中の行を、スペース2つでインデントする', /\n {2}console\.log/.test(raw), ['console.log の行の頭に、スペースを2つ。'], 'function calcTotal(n) {\n  console.log("合計 " + fee * n);\n}', 'js'),
        T(2, '文字列を、ダブルクォート " にそろえる（シングルクォートを残さない）', !/'/.test(raw) && /"/.test(raw), ["'合計 ' を \"合計 \" に。"], 'console.log("合計 " + fee * n);', 'js'),
        T(3, 'const・console.log・calcTotal(2) の行の終わりに ; を付ける', L.filter((x) => /^(const|console|calcTotal\(2)/.test(x)).length >= 3 && L.filter((x) => /^(const|console|calcTotal\(2)/.test(x)).every((x) => /;$/.test(x)), ['文のおわりは ;。function の { } の行は不要。'], 'const fee = 3300;', 'js'),
      ],
    }),
    '拡張機能を入れよう': txt({
      lang: 'sh', start: '# ターミナルで拡張機能を入れるコマンドを、1行ずつ書こう\n',
      note: note('拡張機能は、画面からでも、<b>ターミナルのコマンド</b>でも入れられる。ID は <code>発行元.名前</code> の形。'),
      sol: '# 拡張機能の画面を開く：Cmd+Shift+X\ncode --install-extension esbenp.prettier-vscode\ncode --install-extension dbaeumer.vscode-eslint\ncode --install-extension eamodio.gitlens\n',
      tasks: (L, raw) => [
        T(1, 'Prettier を入れるコマンド（code --install-extension esbenp.prettier-vscode）を書く', find(L, /^code\s+--install-extension\s+esbenp\.prettier-vscode\s*$/) >= 0, ['<code>code --install-extension</code> のあとに、拡張機能の ID を書く。'], 'code --install-extension esbenp.prettier-vscode', 'sh'),
        T(2, '拡張機能の画面を開くショートカット（Cmd+Shift+X か Ctrl+Shift+X）を、コメントに書く', /(Cmd|Ctrl|⌘)\s*\+?\s*(Shift|⇧)\s*\+?\s*X/i.test(raw), ['先頭に <code># 拡張機能の画面：Cmd+Shift+X</code> のように書く。'], '# 拡張機能の画面を開く：Cmd+Shift+X', 'sh'),
        T(3, 'ESLint（dbaeumer.vscode-eslint）と GitLens（eamodio.gitlens）も、1行ずつ入れるコマンドを書く', find(L, /^code\s+--install-extension\s+dbaeumer\.vscode-eslint\s*$/) >= 0 && find(L, /^code\s+--install-extension\s+eamodio\.gitlens\s*$/) >= 0, ['1行に1つずつ。ID の綴りに注意（発行元.名前）。'], 'code --install-extension dbaeumer.vscode-eslint\ncode --install-extension eamodio.gitlens', 'sh'),
      ],
    }),
    'Markdown プレビュー': txt({
      name: 'README.md', lang: 'text', h: 260,
      start: '# 相談予約アプリ\n\n（ここに、プレビューで確かめながら README を書こう）\n',
      note: note('<kbd>⌘</kbd><kbd>⇧</kbd><kbd>V</kbd> のプレビューで<b>仕上がる形</b>になるように Markdown を書く。見出し・リスト・表・チェックリスト。'),
      sol: '# 相談予約アプリ\n\n## 使い方\n- 日時を選ぶ\n- 内容を書く\n\n## 料金\n| プラン | 時間 | 料金 |\n|---|---|---|\n| 初回 | 30分 | 0円 |\n| 通常 | 30分 | 5,500円 |\n\n## 公開前チェック\n- [x] テストが通る\n- [ ] README を更新する\n',
      tasks: (L, raw) => [
        T(1, '「## 」の見出しを1つと、「- 」で始まるリスト項目を2つ書く', /^##\s+\S/m.test(raw) && L.filter((x) => /^-\s+(?!\[)\S/.test(x)).length >= 2, ['見出しは <code>## 使い方</code>、リストは <code>- 日時を選ぶ</code>。'], '## 使い方\n- 日時を選ぶ\n- 内容を書く', 'text'),
        T(2, '表を書く：見出し行・区切り行（|---|---|---|）・データ行を、この順に', (() => { const i = find(L, /^\|.+\|$/); return i >= 0 && /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?$/.test(L[i + 1] || '') && /^\|.+\|$/.test(L[i + 2] || ''); })(), ['見出し行の<b>すぐ下</b>に、<code>|---|---|---|</code> が要る。これが無いと表にならない。'], '| プラン | 時間 | 料金 |\n|---|---|---|\n| 初回 | 30分 | 0円 |', 'text'),
        T(3, 'チェックリストを書く：「- [x] 」（済み）と「- [ ] 」（まだ）を1つずつ', find(L, /^-\s+\[x\]\s+\S/i) >= 0 && find(L, /^-\s+\[ \]\s+\S/) >= 0, ['<code>- [x] テストが通る</code> と <code>- [ ] README を更新する</code>。'], '- [x] テストが通る\n- [ ] README を更新する', 'text'),
      ],
    }),
    '括弧の色分け：Rainbow': txt({
      name: 'price.ts', lang: 'ts', h: 250,
      start: '// settings.json に書く設定を、この下に1行で書こう（括弧の色分けを ON）\n\nfunction calcTotal(items, tax) {\n  return items\n    .filter((i) => (i.qty > 0 && (i.price > 0))\n    .map((i) => ({ name: i.name, sum: i.qty * (i.price + tax(i.price)) )\n}\n',
      note: note('色分けで<b>対にならない括弧</b>が見つかったつもりで、コードを直す。設定の書き方も覚えよう。'),
      sol: '// settings.json\n"editor.bracketPairColorization.enabled": true\n\nfunction calcTotal(items, tax) {\n  return items\n    .filter((i) => (i.qty > 0 && (i.price > 0)))\n    .map((i) => ({ name: i.name, sum: i.qty * (i.price + tax(i.price)) }))\n}\n',
      tasks: (L, raw) => {
        const code = raw.replace(/^\s*\/\/.*$/gm, '').replace(/"[^"\n]*"/g, '""');
        const bal = (src, o, c) => { let d = 0; for (const ch of src) { if (ch === o) d++; else if (ch === c) { d--; if (d < 0) return false; } } return d === 0; };
        const nested = (src) => { const st = []; const P = { ')': '(', ']': '[', '}': '{' }; for (const ch of src) { if ('([{'.includes(ch)) st.push(ch); else if (')]}'.includes(ch)) { if (st.pop() !== P[ch]) return false; } } return st.length === 0; };
        return [
          T(1, '設定を書く：「editor.bracketPairColorization.enabled」を true にする行', /"editor\.bracketPairColorization\.enabled"\s*:\s*true/.test(raw), ['<code>"editor.bracketPairColorization.enabled": true</code> の1行。'], '"editor.bracketPairColorization.enabled": true', 'ts'),
          T(2, '3行目の filter の行を、( ) が過不足なく対になるように直す', (() => { const fl = code.split('\n').find((l) => /\.filter\(/.test(l)); return !!fl && bal(fl, '(', ')'); })(), ['3行目は、<code>(</code> が1つ多く開いたまま。最後に <code>)</code> を足す。'], '.filter((i) => (i.qty > 0 && (i.price > 0)))', 'ts'),
          T(3, '4行目の map も直して、すべての括弧が正しい入れ子で閉じる', nested(code) && /\.map\(/.test(code), ['4行目は、<code>{ ... }</code> を閉じる位置と、<code>)</code> の数を確かめる。<code>({ ... })</code> の形。'], '.map((i) => ({ name: i.name, sum: i.qty * (i.price + tax(i.price)) }))', 'ts'),
        ];
      },
    }),
    'エラーと履歴を見える化': txt({
      lang: 'sh', start: '# Error Lens と GitLens を入れて、同じ調べものをコマンドでもやってみよう\n',
      note: note('GitLens が行の横に出す情報は、<b>git のコマンド</b>でも調べられる。'),
      sol: 'code --install-extension usernamehw.errorlens\ncode --install-extension eamodio.gitlens\ngit blame -L 3,3 src/price.ts\ngit log --oneline -- src/price.ts\n',
      tasks: (L) => [
        T(1, 'Error Lens（usernamehw.errorlens）と GitLens（eamodio.gitlens）を入れるコマンドを書く', find(L, /^code\s+--install-extension\s+usernamehw\.errorlens\s*$/) >= 0 && find(L, /^code\s+--install-extension\s+eamodio\.gitlens\s*$/) >= 0, ['1行に1つずつ。ID は <code>発行元.名前</code>。'], 'code --install-extension usernamehw.errorlens\ncode --install-extension eamodio.gitlens', 'sh'),
        T(2, 'src/price.ts の3行目を、誰が変えたか調べるコマンド（git blame -L 3,3）を書く', find(L, /^git\s+blame\s+-L\s*3,3\s+(\.\/)?src\/price\.ts\s*$/) >= 0, ['<code>git blame -L 開始行,終了行 ファイル</code>。'], 'git blame -L 3,3 src/price.ts', 'sh'),
        T(3, 'src/price.ts が、どんなコミットで変わってきたかを一覧するコマンドを書く', find(L, /^git\s+log\s+(--oneline\s+)?--\s+(\.\/)?src\/price\.ts\s*$|^git\s+log\s+--oneline\s+(\.\/)?src\/price\.ts\s*$/) >= 0, ['<code>git log --oneline -- ファイル名</code>。1つのファイルだけの履歴になる。'], 'git log --oneline -- src/price.ts', 'sh'),
      ],
    }),
    '小さな事故を減らす拡張': txt({
      name: 'accidents.txt', lang: 'text', h: 260,
      start: '// ① スペルミスを直そう\n// customer recieve the mail\nconst adress = user.adress\n\n// ② 終了タグを、開始タグに合わせよう\n<section class="card">\n  <h2>相談する</h2>\n</div>\n\n// ③ パスの打ち間違いを直そう（ファイルは price.ts）\nimport { calcTotal } from "./utils/prise"\n',
      note: note('拡張機能が<b>先に見つけてくれる</b>小さな事故を、手で直してみる。'),
      sol: '// customer receive the mail\nconst address = user.address\n\n<section class="card">\n  <h2>相談する</h2>\n</section>\n\nimport { calcTotal } from "./utils/price"\n',
      tasks: (L, raw) => [
        T(1, 'スペルミス（recieve / adress）を、receive / address に直す', !/recieve|adress/.test(raw) && /receive/.test(raw) && /address/.test(raw), ['<code>recieve</code> → <code>receive</code>、<code>adress</code> → <code>address</code>（2か所あるので全部）。'], 'const address = user.address', 'text'),
        T(2, '終了タグを </section> にそろえる（</div> を残さない）', /<section[^>]*>/.test(raw) && /<\/section>/.test(raw) && !/<\/div>/.test(raw), ['開始が <code>&lt;section&gt;</code> なら、終了も <code>&lt;/section&gt;</code>。'], '</section>', 'text'),
        T(3, 'import のパスを、本当にあるファイル（./utils/price）に直す', /from\s+"\.\/utils\/price"/.test(raw) && !/prise/.test(raw), ['<code>prise</code> は打ち間違い。<code>price</code> が正しい。'], 'import { calcTotal } from "./utils/price"', 'text'),
      ],
    }),
    'Vue・TypeScript・ESLint': txt({
      name: 'CaseCard.vue', lang: 'text', h: 280,
      start: '<!-- ① テンプレートの打ち間違いを直す -->\n<p>{{ item.prise }} 円</p>\n\n// ② ESLint が自動で直す形に、手で直す\nvar fee = 3300\nif (fee == 0) {\n  console.log("無料")\n}\n\n// ③ settings.json：保存で ESLint を自動修正する設定を書く\n',
      note: note('<b>Vue - Official</b> が見つけるミスと、<b>ESLint</b> が保存で直す形。最後に、その設定も書く。'),
      sol: '<p>{{ item.price }} 円</p>\n\nconst fee = 3300\nif (fee === 0) {\n  console.log("無料")\n}\n\n"editor.codeActionsOnSave": {\n  "source.fixAll.eslint": "explicit"\n}\n',
      tasks: (L, raw) => [
        T(1, 'テンプレートの item.prise を item.price に直す', !/prise/.test(raw) && /\{\{\s*item\.price\s*\}\}/.test(raw), ['<code>prise</code> は <code>price</code> の打ち間違い。'], '<p>{{ item.price }} 円</p>', 'text'),
        T(2, 'var を const に、== を === に直す（ESLint が自動で直すのと同じ形）', !/\bvar\b/.test(raw) && /\bconst\s+fee\b/.test(raw) && /fee\s*===\s*0/.test(raw) && !/fee\s*==\s*0/.test(raw), ['<code>var fee</code> → <code>const fee</code>、<code>fee == 0</code> → <code>fee === 0</code>。'], 'const fee = 3300\nif (fee === 0) {', 'text'),
        T(3, '保存で ESLint を自動修正する設定（editor.codeActionsOnSave の source.fixAll.eslint）を書く', /"editor\.codeActionsOnSave"\s*:\s*\{[^}]*"source\.fixAll\.eslint"\s*:\s*"(explicit|true|always)"/.test(raw.replace(/\n/g, ' ')), ['<code>"editor.codeActionsOnSave": { "source.fixAll.eslint": "explicit" }</code>。'], '"editor.codeActionsOnSave": {\n  "source.fixAll.eslint": "explicit"\n}', 'text'),
      ],
    }),
    '快適にする拡張と AI': txt({
      lang: 'sh', start: '# 日本語化と、アイコンの拡張機能を入れるコマンド。そのあとに AI のルールを書こう\n',
      note: note('入れ方はどの拡張機能も同じ。AI のルールは、<b>「〜する」「〜しない」の形</b>で書く。'),
      sol: 'code --install-extension MS-CEINTL.vscode-language-pack-ja\ncode --install-extension PKief.material-icon-theme\nAI の提案は、全部読んで確認する\nパスワードやキーなどの秘密情報は、AI に入力しない\nAI が書いたコードも、テストで確かめる\n',
      tasks: (L, raw) => [
        T(1, '日本語化（MS-CEINTL.vscode-language-pack-ja）を入れるコマンドを書く', find(L, /^code\s+--install-extension\s+MS-CEINTL\.vscode-language-pack-ja\s*$/i) >= 0, ['ID は <code>MS-CEINTL.vscode-language-pack-ja</code>。'], 'code --install-extension MS-CEINTL.vscode-language-pack-ja', 'sh'),
        T(2, 'Material Icon Theme（PKief.material-icon-theme）を入れるコマンドを書く', find(L, /^code\s+--install-extension\s+PKief\.material-icon-theme\s*$/i) >= 0, ['ID は <code>PKief.material-icon-theme</code>。'], 'code --install-extension PKief.material-icon-theme', 'sh'),
        T(3, 'AI を使うときのルールを3行書く（確認する・秘密を入れない・テストする、の考え方）', L.filter((x) => !/^code\s/.test(x)).some((x) => /読|確認|レビュー|チェック/.test(x)) && L.filter((x) => !/^code\s/.test(x)).some((x) => /秘密|パスワード|キー|個人情報/.test(x)) && L.filter((x) => !/^code\s/.test(x)).some((x) => /テスト/.test(x)), ['3行：①提案は読んで確認 ②秘密情報は入力しない ③テストで確かめる。'], 'AI の提案は、全部読んで確認する\nパスワードやキーなどの秘密情報は、AI に入力しない\nAI が書いたコードも、テストで確かめる', 'text'),
      ],
    }),
    'おすすめ拡張機能一覧': txt({
      name: 'extensions.json', lang: 'json', h: 260,
      start: '// .vscode/extensions.json を、リポジトリに入れる形で書こう\n{\n  "recommendations": [\n  ]\n}\n',
      note: note('チームに<b>おすすめを知らせる</b>ファイル。ID を文字列で並べる。'),
      sol: '{\n  "recommendations": [\n    "esbenp.prettier-vscode",\n    "dbaeumer.vscode-eslint",\n    "Vue.volar",\n    "eamodio.gitlens",\n    "usernamehw.errorlens"\n  ]\n}\n',
      tasks: (L, raw) => {
        let j = null; try { j = JSON.parse(raw.replace(/^\s*\/\/.*$/gm, '')); } catch (e) { j = null; }
        const R = (j && Array.isArray(j.recommendations)) ? j.recommendations : [];
        return [
          T(1, '正しい JSON で、recommendations に拡張機能を1つ以上入れる', R.length >= 1, ['JSON は最後の項目のあとに , を付けない。<code>"recommendations": [ "ID" ]</code>。'], '{\n  "recommendations": [\n    "esbenp.prettier-vscode"\n  ]\n}', 'json'),
          T(2, 'Prettier（esbenp.prettier-vscode）と ESLint（dbaeumer.vscode-eslint）を入れる', R.includes('esbenp.prettier-vscode') && R.includes('dbaeumer.vscode-eslint'), ['どのプロジェクトでも、まず入れる2つ。'], '"esbenp.prettier-vscode",\n"dbaeumer.vscode-eslint"', 'json'),
          T(3, 'Vue.volar と eamodio.gitlens も加えて、5つ以上にする', R.length >= 5 && R.includes('Vue.volar') && R.includes('eamodio.gitlens'), ['Vue を書くなら <code>Vue.volar</code>、履歴を見るなら <code>eamodio.gitlens</code>。'], '"Vue.volar",\n"eamodio.gitlens",\n"usernamehw.errorlens"', 'json'),
        ];
      },
    }),
  };

  /* ================= x-devtools ================= */
  D['x-devtools'] = {
    'Elements：その場で書き換える': web({
      files: [H('<button class="btn">購入する</button>\n<p class="msg">在庫あり</p>'), C('.btn { display: none; padding: 8px 16px; }\n.msg { color: #fff; background: #fff; }\n')],
      sol: { 'index.html': '<button class="btn">購入する</button>\n<p class="msg">在庫あり</p>', 'style.css': '.btn { display: inline-block; padding: 8px 16px; }\n.msg { color: #345; background: #fff; }' },
      tasks: (d) => { const b = Q(d, '.btn')[0], m = Q(d, '.msg')[0]; return [
        T(1, 'ボタン .btn が見えない。display: none を直して、表示する', b && cs(d, b).display !== 'none', ['Elements パネルで ☑ を外すのと同じ。<code>display: none</code> をやめる。'], '.btn { display: inline-block; }', 'css'),
        T(2, '.msg が読めない（文字と背景が同じ色）。文字色を背景と違う色にする', m && cs(d, m).color !== cs(d, m).backgroundColor, ['<code>.msg { color: #345; }</code> のように、違う色を指定する。'], '.msg { color: #345; }', 'css'),
      ]; },
    }),
    'Console と Network': web({
      files: [H('<p id="out">…</p>'), J('const msg = "こんにちは";\nconsole.log(mesage); // ← Console に ReferenceError が出る\n\n// ② 通信：fetch で /api/data を呼ぶコードを書こう\n')],
      sol: { 'index.html': '<p id="out">…</p>', 'main.js': 'const msg = "こんにちは";\nconsole.log(msg);\n\nfetch("/api/data")\n  .then((res) => res.json())\n  .then((data) => console.log(data))\n  .catch((e) => console.log("通信に失敗", e.message));' },
      tasks: (d, v) => [
        T(1, 'Console のエラー（mesage のつづり違い）を直す：console.log(msg) にする', hasRe(v['main.js'], /console\.log\(\s*msg\s*\)/) && !hasRe(v['main.js'].replace(/\/\/.*$/gm, ''), /\bmesage\b/), ['エラーの名前と行番号から、つづり違いを探そう。'], 'console.log(msg);', 'js'),
        T(2, 'fetch("/api/data") で通信し、結果（then か await）を受け取る', hasRe(v['main.js'], /fetch\(\s*["'`]\/api\/data["'`]\s*\)/) && hasRe(v['main.js'], /\.then\(|await\s/), ['通信は Network パネルに1行出る。<code>fetch(...).then(...)</code>'], 'fetch("/api/data")\n  .then((res) => res.json())\n  .then((data) => console.log(data))\n  .catch((e) => console.log("通信に失敗", e.message));', 'js'),
      ],
    }),
    'Device mode：スマホで見る': web({
      h: 250,
      files: [H('<div class="cols">\n  <div class="col">A</div>\n  <div class="col">B</div>\n</div>'), C('.cols { display: flex; gap: 8px; }\n.col { flex: 1; background: #cde; padding: 12px; }\n/* ② スマホ幅（600px 以下）では縦に積む */\n')],
      sol: { 'index.html': '<meta name="viewport" content="width=device-width, initial-scale=1">\n<div class="cols">\n  <div class="col">A</div>\n  <div class="col">B</div>\n</div>', 'style.css': '.cols { display: flex; gap: 8px; }\n.col { flex: 1; background: #cde; padding: 12px; }\n@media (max-width: 600px) {\n  .cols { flex-direction: column; }\n}' },
      tasks: (d, v) => [
        T(1, 'meta viewport（width=device-width）を書いて、スマホで正しい幅にする', hasRe(v['index.html'], /<meta[^>]*name=["']viewport["'][^>]*content=["'][^"']*width=device-width/i), ['<code>&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;</code>'], '<meta name="viewport" content="width=device-width, initial-scale=1">', 'html'),
        T(2, '@media (max-width: …px) の中で、.cols を縦（column）にする', /@media[^{]*max-width\s*:\s*\d+px[^{]*\{[\s\S]*\.cols[\s\S]*(flex-direction\s*:\s*column|display\s*:\s*block)/.test(v['style.css']), ['<code>@media (max-width: 600px) { .cols { flex-direction: column; } }</code>'], '@media (max-width: 600px) {\n  .cols { flex-direction: column; }\n}', 'css'),
      ],
    }),
  };

  /* ================= x-bem ================= */
  D['x-bem'] = {
    'Block · Element · Modifier': web({
      h: 250,
      files: [H('<div class="card">\n  <h2 class="title">離婚の相談</h2>\n  <p class="text">初回30分は無料です</p>\n  <button class="btn">予約する</button>\n</div>'), C('.card { padding: 12px; }\n')],
      sol: { 'index.html': '<div class="card card--featured">\n  <h2 class="card__title">離婚の相談</h2>\n  <p class="card__text">初回30分は無料です</p>\n  <button class="card__btn">予約する</button>\n</div>', 'style.css': '.card { padding: 12px; }\n.card--featured { background: #fd9; }' },
      tasks: (d) => { const c = Q(d, '.card')[0]; return [
        T(1, 'クラス名を BEM（ブロック__エレメント）に直す：card__title・card__text・card__btn', Q(d, '.card__title').length > 0 && Q(d, '.card__text').length > 0 && Q(d, '.card__btn').length > 0, ['部品名 + __ + 中身の名前。<code>title</code> → <code>card__title</code>'], '<h2 class="card__title">離婚の相談</h2>\n<p class="card__text">初回30分は無料です</p>\n<button class="card__btn">予約する</button>', 'html'),
        T(2, 'Modifier：.card に card--featured を付けて、CSS で背景色を付ける', c && c.classList.contains('card--featured') && cs(d, c).backgroundColor !== 'rgba(0, 0, 0, 0)', ['状態は <code>--</code>。<code>.card--featured { background: #fd9; }</code>'], '.card--featured { background: #fd9; }', 'css'),
      ]; },
    }),
    '置き場所を変えても崩れない': web({
      files: [H('<div class="main">\n  <div class="box">A</div>\n</div>\n<div class="sidebar"></div>'), C('.main .box { background: #cde; padding: 12px; }\n')],
      sol: { 'index.html': '<div class="main"></div>\n<div class="sidebar">\n  <div class="box">A</div>\n</div>', 'style.css': '.box { background: #cde; padding: 12px; }' },
      tasks: (d, v) => { const b = Q(d, '.box')[0]; return [
        T(1, '子孫セレクタ（.main .box）をやめて、.box だけで背景色を付ける', b && cs(d, b).backgroundColor !== 'rgba(0, 0, 0, 0)' && !/\.[\w-]+\s+\.[\w-]+\s*[{,]/.test(v['style.css']), ['場所に頼らず、クラスに直接スタイルを付ける。<code>.box { … }</code>'], '.box { background: #cde; padding: 12px; }', 'css'),
        T(2, '.box を .sidebar の中に移しても、同じ背景色のまま崩れない', Q(d, '.sidebar .box').length === 1 && cs(d, Q(d, '.sidebar .box')[0]).backgroundColor !== 'rgba(0, 0, 0, 0)', ['HTML で .box を .sidebar の中に動かして、見た目が変わらないか確かめる。'], '<div class="sidebar">\n  <div class="box">A</div>\n</div>', 'html'),
      ]; },
    }),
    '命名の使い分け': txt({
      lang: 'text', start: '# クラス名を1行に1つずつ（ドットは付けなくてOK）\n',
      note: note('BEM の<b>部品・中身・状態</b>が、名前の形で見分けられるように書く。'),
      sol: 'card\ncard__title\ncard--featured',
      tasks: (L) => [
        T(1, '中身（エレメント）の名前 card__title と、状態（モディファイア）の名前 card--featured を書く', find(L, /^\.?card__title$/) >= 0 && find(L, /^\.?card--featured$/) >= 0, ['中身は <code>__</code>、状態は <code>--</code>。'], 'card__title\ncard--featured', 'text'),
        T(2, '読みにくい card__title__text を、card__title の形に直して書く（__ を重ねない）', find(L, /^\.?card__title$/) >= 0 && L.every((x) => !/__.*__/.test(x)), ['BEM では、エレメントの中にエレメントを重ねず、ブロックの直下に並べる。'], 'card__title', 'text'),
      ],
    }),
  };

  /* ================= x-css-plus ================= */
  D['x-css-plus'] = {
    'CSS 変数 var()': web({
      files: [H('<h1>見出し</h1>\n<button class="btn">ボタン</button>'), C('/* ① :root に --main を決めて、② var(--main) で使う */\n')],
      sol: { 'index.html': '<h1>見出し</h1>\n<button class="btn">ボタン</button>', 'style.css': ':root { --main: #3b82f6; }\nh1 { color: var(--main); }\n.btn { background: var(--main); color: #fff; }' },
      tasks: (d, v) => { const h = Q(d, 'h1')[0], b = Q(d, '.btn')[0]; return [
        T(1, ':root に --main を決めて、h1 の color に var(--main) で使う', /--main\s*:/.test(v['style.css']) && /h1\s*\{[^}]*var\(--main\)/.test(v['style.css']) && h && cs(d, h).color !== 'rgb(0, 0, 0)', ['<code>:root { --main: #3b82f6; }</code> と <code>color: var(--main);</code>'], ':root { --main: #3b82f6; }\nh1 { color: var(--main); }', 'css'),
        T(2, '.btn の background にも var(--main) を使い、h1 と同じ色にする（1か所で全部変わる）', h && b && cs(d, b).backgroundColor === cs(d, h).color && (v['style.css'].match(/var\(--main\)/g) || []).length >= 2, ['同じ変数を2か所で使えば、色を変えるのは1か所だけ。'], '.btn { background: var(--main); color: #fff; }', 'css'),
      ]; },
    }),
    'Sass(SCSS)：書き方 → CSS': txt({
      name: 'style.scss', lang: 'css', h: 220, start: '// SCSS で書こう\n',
      note: note('SCSS の<b>変数と入れ子</b>で、くりかえしを減らして書く。'),
      sol: '$gap: 16px;\n.nav {\n  padding: $gap;\n  a {\n    margin-right: $gap;\n  }\n}',
      tasks: (L, raw) => [
        T(1, '変数 $gap を作り、2か所以上で使う', /\$gap\s*:/.test(raw) && (raw.match(/\$gap\b/g) || []).length >= 3, ['<code>$gap: 16px;</code> を作って、<code>padding: $gap;</code> のように使う。'], '$gap: 16px;\n.nav { padding: $gap; margin: $gap; }', 'css'),
        T(2, '.nav の中に a を入れ子で書く（.nav a { } を1つの塊で）', /\.nav\s*\{[\s\S]*\ba\s*\{[\s\S]*\}[\s\S]*\}/.test(raw), ['外側 { } の中に、<code>a { … }</code> を書く。'], '.nav {\n  a { color: #345; }\n}', 'css'),
      ],
    }),
    'レスポンシブ：幅で変わる': web({
      h: 250,
      files: [H('<div class="cols">\n  <div class="col">1</div>\n  <div class="col">2</div>\n  <div class="col">3</div>\n</div>'), C('.col { background: #cde; padding: 12px; }\n/* PC：3列の grid / スマホ（600px 以下）：1列 */\n')],
      sol: { 'index.html': '<div class="cols">\n  <div class="col">1</div>\n  <div class="col">2</div>\n  <div class="col">3</div>\n</div>', 'style.css': '.col { background: #cde; padding: 12px; }\n.cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }\n@media (max-width: 600px) {\n  .cols { grid-template-columns: 1fr; }\n}' },
      tasks: (d, v) => { const c = Q(d, '.cols')[0]; return [
        T(1, '.cols を display: grid にして、3列（repeat(3, 1fr)）にする', /\.cols\s*\{[^}]*display\s*:\s*grid/.test(v['style.css']) && /grid-template-columns\s*:\s*(repeat\(\s*3\s*,\s*1fr\s*\)|1fr\s+1fr\s+1fr)/.test(v['style.css']), ['<code>display: grid; grid-template-columns: repeat(3, 1fr);</code>'], '.cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }', 'css'),
        T(2, '@media (max-width: …px) の中で、.cols を1列（1fr）にする', /@media[^{]*max-width\s*:\s*\d+px[^{]*\{[\s\S]*\.cols[\s\S]*grid-template-columns\s*:\s*1fr\b/.test(v['style.css']), ['幅が狭いときだけ、列を1つにする。'], '@media (max-width: 600px) {\n  .cols { grid-template-columns: 1fr; }\n}', 'css'),
      ]; },
    }),
    '動きと重なり': web({
      files: [H('<div class="card">カード</div>\n<div class="popup">ポップアップ</div>'), C('.card { width: 120px; padding: 16px; background: #cde; }\n.popup { position: absolute; left: 20px; top: 20px; padding: 10px; background: #fd9; }\n')],
      sol: { 'index.html': '<div class="card">カード</div>\n<div class="popup">ポップアップ</div>', 'style.css': '.card { width: 120px; padding: 16px; background: #cde; transition: transform .2s; }\n.card:hover { transform: translateY(-4px); }\n.popup { position: absolute; left: 20px; top: 20px; padding: 10px; background: #fd9; z-index: 10; }' },
      tasks: (d, v) => { const c = Q(d, '.card')[0], p = Q(d, '.popup')[0]; return [
        T(1, '.card に transition（0.5秒以内）を付け、:hover で transform を動かす', c && px(cs(d, c).transitionDuration) > 0 && px(cs(d, c).transitionDuration) <= 0.5 && /\.card:hover\s*\{[^}]*transform/.test(v['style.css']), ['<code>transition: transform .2s;</code> と <code>.card:hover { transform: translateY(-4px); }</code>'], '.card { transition: transform .2s; }\n.card:hover { transform: translateY(-4px); }', 'css'),
        T(2, '.popup に z-index を付けて、手前に出す（z-index 1 以上）', p && parseInt(cs(d, p).zIndex, 10) >= 1 && cs(d, p).position !== 'static', ['position を付けた要素に <code>z-index: 10;</code>'], '.popup { z-index: 10; }', 'css'),
      ]; },
    }),
    'はみ出しと高さをそろえる': web({
      h: 280,
      files: [H('<div class="list">\n  <div class="card"><div class="thumb" style="--h:50px"></div><h3 class="title">【至急】取引先からの契約解除通知の内容確認と、今後の対応方針について、至急ご相談したいです</h3><a class="btn">詳しく見る</a></div>\n  <div class="card"><div class="thumb" style="--h:100px"></div><h3 class="title">離婚の相談</h3><a class="btn">詳しく見る</a></div>\n  <div class="card"><div class="thumb" style="--h:70px"></div><h3 class="title">相続手続きの進め方</h3><a class="btn">詳しく見る</a></div>\n</div>'), C('.list { display: flex; gap: 8px; align-items: flex-start; }\n.card { flex: 1; min-width: 0; border: 2px solid #5b9dff; padding: 8px; box-sizing: border-box; }\n.thumb { height: var(--h); background: #cfe0ff; }\n.title { font-size: 14px; margin: 6px 0; }\n.btn { display: block; background: #5b9dff; color: #fff; text-align: center; padding: 4px; }\n/* ① .title を2行で省略  ② 高さをそろえて .btn を下に  ③ .thumb を 16 / 9 に */\n')],
      sol: { 'index.html': '<div class="list">\n  <div class="card"><div class="thumb" style="--h:50px"></div><h3 class="title">【至急】取引先からの契約解除通知の内容確認と、今後の対応方針について、至急ご相談したいです</h3><a class="btn">詳しく見る</a></div>\n  <div class="card"><div class="thumb" style="--h:100px"></div><h3 class="title">離婚の相談</h3><a class="btn">詳しく見る</a></div>\n  <div class="card"><div class="thumb" style="--h:70px"></div><h3 class="title">相続手続きの進め方</h3><a class="btn">詳しく見る</a></div>\n</div>', 'style.css': '.list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }\n.card { min-width: 0; display: flex; flex-direction: column; border: 2px solid #5b9dff; padding: 8px; box-sizing: border-box; }\n.thumb { aspect-ratio: 16 / 9; background: #cfe0ff; }\n.title { font-size: 14px; margin: 6px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }\n.btn { margin-top: auto; display: block; background: #5b9dff; color: #fff; text-align: center; padding: 4px; }' },
      tasks: (d) => { const cards = Q(d, '.card'), ts = Q(d, '.title'), th = Q(d, '.thumb'), bt = Q(d, '.btn'); const R = (e) => e.getBoundingClientRect(); const near = (a, b) => Math.abs(a - b) <= 2; return [
        T(1, '長い題名を2行で省略する（-webkit-line-clamp: 2 と overflow: hidden）', ts[0] && cs(d, ts[0]).overflow === 'hidden' && (cs(d, ts[0]).webkitLineClamp === '2' || (cs(d, ts[0]).textOverflow === 'ellipsis' && cs(d, ts[0]).whiteSpace === 'nowrap')), ['<code>display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;</code>'], '.title { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }', 'css'),
        T(2, 'カードの高さをそろえ、「詳しく見る」ボタンを3枚とも同じ高さ（下）に置く', cards.length === 3 && cards.every((c) => near(R(c).height, R(cards[0]).height)) && bt.length === 3 && bt.every((b) => near(R(b).bottom, R(bt[0]).bottom)), ['親を <code>display: grid</code>（3列）、カードを <code>display: flex; flex-direction: column;</code>、ボタンに <code>margin-top: auto;</code>'], '.list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }\n.card { display: flex; flex-direction: column; }\n.btn { margin-top: auto; }', 'css'),
        T(3, 'サムネイルの形を 16 : 9 にそろえる（aspect-ratio）', th.length === 3 && th.every((t) => { const r = R(t); return r.height > 0 && Math.abs(r.width / r.height - 16 / 9) < 0.1; }), ['<code>.thumb</code> の <code>height</code> をやめて、<code>aspect-ratio: 16 / 9;</code> を付ける。'], '.thumb { aspect-ratio: 16 / 9; }', 'css'),
      ]; },
    }),
    'どれを選ぶ？：CSS 編': web({
      files: [H('<div class="grid">\n  <div class="cell">1</div>\n  <div class="cell">2</div>\n  <div class="cell">3</div>\n  <div class="cell">4</div>\n  <div class="cell">5</div>\n  <div class="cell">6</div>\n</div>\n<p class="lead">文字は rem で</p>'), C('.cell { background: #cde; padding: 10px; }\n.lead { font-size: 18px; }\n')],
      sol: { 'index.html': '<div class="grid">\n  <div class="cell">1</div>\n  <div class="cell">2</div>\n  <div class="cell">3</div>\n  <div class="cell">4</div>\n  <div class="cell">5</div>\n  <div class="cell">6</div>\n</div>\n<p class="lead">文字は rem で</p>', 'style.css': '.cell { background: #cde; padding: 10px; }\n.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }\n.lead { font-size: 1.25rem; }' },
      tasks: (d, v) => { const g = Q(d, '.grid')[0]; return [
        T(1, '6個のマスを3列の格子にしたい → Grid を選ぶ（display: grid と3列）', g && cs(d, g).display === 'grid' && cs(d, g).gridTemplateColumns.split(' ').length === 3, ['格子（行も列も）は Grid、1方向の並びは Flex。'], '.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }', 'css'),
        T(2, '文字サイズは px ではなく rem で書く（.lead の font-size を rem に）', /\.lead\s*\{[^}]*font-size\s*:\s*[\d.]+rem/.test(v['style.css']), ['rem は、ふつうの文字サイズの何倍か。<code>1.25rem</code>'], '.lead { font-size: 1.25rem; }', 'css'),
      ]; },
    }),
  };

  /* ================= x-a11y ================= */
  D['x-a11y'] = {
    'セマンティックHTML：読み上げ視点': web({
      h: 240,
      files: [H('<!-- div だらけ → 意味のあるタグに直そう -->\n<div class="title">ページの題名</div>\n<div class="menu"><a href="#a">ホーム</a> <a href="#b">お問い合わせ</a></div>\n<div class="send">送信</div>')],
      sol: { 'index.html': '<h1 class="title">ページの題名</h1>\n<nav class="menu"><a href="#a">ホーム</a> <a href="#b">お問い合わせ</a></nav>\n<button class="send">送信</button>' },
      tasks: (d) => [
        T(1, '題名の div を h1 に、メニューの div を nav に変える', Q(d, 'h1').some((x) => x.textContent.trim()) && Q(d, 'nav a').length >= 2, ['見出し = h1、ナビ = nav。見た目はあとで CSS で整える。'], '<h1 class="title">ページの題名</h1>\n<nav class="menu"><a href="#a">ホーム</a> <a href="#b">お問い合わせ</a></nav>', 'html'),
        T(3 - 1, '「送信」の div を button タグにする（ボタンだと読み上げに伝わる）', Q(d, 'button').some((b) => /送信/.test(b.textContent)), ['押せるものは <code>&lt;button&gt;</code>。'], '<button class="send">送信</button>', 'html'),
      ],
    }),
    'コントラストと色覚': web({
      files: [H('<p class="msg">この文字が読みにくい</p>\n<p class="err">入力に誤りがあります</p>'), C('body { background: #fff; }\n.msg { color: #bbb; }\n.err { color: red; }\n')],
      sol: { 'index.html': '<p class="msg">この文字が読みにくい</p>\n<p class="err">エラー：入力に誤りがあります</p>', 'style.css': 'body { background: #fff; }\n.msg { color: #333; }\n.err { color: red; }' },
      tasks: (d) => { const m = Q(d, '.msg')[0], e = Q(d, '.err')[0]; return [
        T(1, '.msg の文字色を、白い背景とのコントラスト比 4.5 以上にする', m && ratio(cs(d, m).color, 'rgb(255, 255, 255)') >= 4.5, ['薄いグレーは読みにくい。濃い色（<code>#333</code> など）にする。'], '.msg { color: #333; }', 'css'),
        T(2, '色（赤）だけに頼らず、.err の文章にも「エラー」と書いて伝える', e && /エラー|error/i.test(e.textContent), ['色が見分けにくい人にも伝わるよう、文字でも「エラー：」と書く。'], '<p class="err">エラー：入力に誤りがあります</p>', 'html'),
      ]; },
    }),
    'キーボードだけで操作': web({
      h: 240,
      files: [H('<!-- div や span で作ったボタン・リンクを、標準のタグに直そう -->\n<div class="btn" onclick="alert(1)">開く</div>\n<span class="link" onclick="location.href=\'#top\'">詳細</span>')],
      sol: { 'index.html': '<button class="btn" onclick="alert(1)">開く</button>\n<a class="link" href="#top">詳細</a>' },
      tasks: (d) => [
        T(1, '「開く」を button にする（Tab で止まれる）', Q(d, 'button').some((b) => /開く/.test(b.textContent)) && Q(d, 'div.btn').length === 0, ['div にはキーで止まれない。<code>&lt;button&gt;</code> は最初からキー対応。'], '<button class="btn" onclick="alert(1)">開く</button>', 'html'),
        T(2, '「詳細」を a タグ（href 付き）にする', Q(d, 'a[href]').some((a) => /詳細/.test(a.textContent)) && Q(d, 'span.link').length === 0, ['リンクは <code>&lt;a href="…"&gt;</code>。'], '<a class="link" href="#top">詳細</a>', 'html'),
      ],
    }),
    'アイコンボタンと代替テキスト': web({
      h: 240,
      files: [H('<!-- アイコンだけのボタンと、説明のない画像を、読み上げに伝わるように直そう -->\n<button class="search"><svg width="16" height="16"><circle cx="7" cy="7" r="5" fill="none" stroke="#333"/></svg></button>\n<img class="chart" width="120" height="60" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">\n<img class="line" width="120" height="4" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">')],
      sol: { 'index.html': '<button class="search" aria-label="検索"><svg width="16" height="16" aria-hidden="true"><circle cx="7" cy="7" r="5" fill="none" stroke="#333"/></svg></button>\n<img class="chart" alt="相談件数は4月120件から6月210件に増えた" width="120" height="60" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">\n<img class="line" alt="" width="120" height="4" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">' },
      tasks: (d) => { const b = Q(d, 'button.search')[0], c = Q(d, 'img.chart')[0], l = Q(d, 'img.line')[0]; return [
        T(1, 'アイコンだけの検索ボタンに、aria-label で名前を付ける', b && (b.getAttribute('aria-label') || '').trim().length >= 1, ['文字がないボタンは、読み上げが名前を言えない。<code>aria-label="検索"</code>'], '<button class="search" aria-label="検索">', 'html'),
        T(2, 'グラフ画像に、結論が分かる alt を付ける（数字を入れる）', c && (c.getAttribute('alt') || '').trim().length >= 8 && /[0-9０-９]/.test(c.getAttribute('alt')), ['「グラフです」ではなく、言いたいこと。<code>alt="相談件数は4月120件から6月210件に増えた"</code>'], '<img class="chart" alt="相談件数は4月120件から6月210件に増えた">', 'html'),
        T(3, '飾りだけの線の画像は、alt を空（alt=""）にして読み飛ばす', l && l.hasAttribute('alt') && l.getAttribute('alt') === '', ['意味のない飾りは、読み上げに言わせない。<code>alt=""</code>（属性は残して中身を空に）'], '<img class="line" alt="">', 'html'),
      ]; },
    }),
    'どれが正しい？': web({
      h: 240,
      files: [H('<!-- 見た目は同じ。伝わる書き方に直そう -->\n<img src="cat.jpg">\n<div>名前</div>\n<input id="nm" type="text">')],
      sol: { 'index.html': '<img src="cat.jpg" alt="ねこの写真">\n<label for="nm">名前</label>\n<input id="nm" type="text">' },
      tasks: (d) => [
        T(1, '画像に、内容が分かる alt を付ける', Q(d, 'img').some((i) => (i.getAttribute('alt') || '').trim().length >= 2), ['読み上げは alt を読む。<code>alt="ねこの写真"</code>'], '<img src="cat.jpg" alt="ねこの写真">', 'html'),
        T(2, '「名前」を label にして、for で input（id="nm"）とつなぐ', Q(d, 'label[for]').some((l) => l.getAttribute('for') === 'nm' && /名前/.test(l.textContent)), ['<code>&lt;label for="nm"&gt;名前&lt;/label&gt;</code>'], '<label for="nm">名前</label>', 'html'),
      ],
    }),
  };
})();
