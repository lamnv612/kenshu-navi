/* Lessons: intro (コース紹介) + html */
(function () {
  'use strict';
  const K = window.KENSHU, { h, code, stepper, playground, quiz, lbl, style, store, esc } = K.W;

  style('intro-html', `
  .mock{border-radius:8px;overflow:hidden;background:#fff;color:#222;border:1px solid var(--line);box-shadow:var(--shadow)}
  .mock .bar{display:flex;gap:6px;align-items:center;padding:8px 12px;background:#eceef6}
  .mock .bar i{width:10px;height:10px;border-radius:50%;background:#ff5f57}.mock .bar i:nth-child(2){background:#febc2e}.mock .bar i:nth-child(3){background:#28c840}
  .mock .bar span{flex:1;margin-left:8px;background:#fff;border-radius:6px;padding:1px 12px;font:.75rem var(--mono);color:#777}
  .mock .page{padding:22px;min-height:190px;font-family:serif;transition:all .6s}
  .mock .page h1{font-size:1.5rem;transition:all .6s}.mock .page p{margin:.4em 0 .8em}
  .mock .page button{font:inherit;padding:.3em .8em;transition:all .5s}
  .mock .page.css{font-family:var(--font);background:linear-gradient(135deg,#fff5fa,#eef4ff)}
  .mock .page.css h1{font-size:2.1rem;font-weight:900;background:linear-gradient(90deg,#ff6b9d,#5b9dff);-webkit-background-clip:text;background-clip:text;color:transparent}
  .mock .page.css button{background:#5b9dff;color:#fff;border:0;border-radius:6px;padding:.5em 1.3em;font-weight:800;box-shadow:0 8px 18px -8px #5b9dff;cursor:pointer}
  .mock .page.js button:hover{transform:scale(1.1)}
  .mock .page.js button:active{transform:scale(.9)}
  .fold{overflow:hidden;max-height:0;opacity:0;transition:max-height .6s ease,opacity .5s}.fold.open{max-height:420px;opacity:1}
  .anat{font:700 clamp(1rem,2.4vw,1.6rem) var(--mono);display:flex;flex-wrap:wrap;justify-content:center;padding:34px 12px;background:var(--code);border-radius:8px;gap:0;color:#d8dcff}
  .anat .tk{padding:6px 2px;border-radius:8px;transition:.25s;cursor:pointer;white-space:pre;border-bottom:3px solid transparent}
  .anat .tk.lit{background:color-mix(in srgb,var(--pc) 28%,transparent);border-bottom-color:var(--pc);transform:translateY(-6px);box-shadow:0 10px 24px -10px var(--pc)}
  .anat.dim .tk:not(.lit){opacity:.3}
  .parts{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:14px}
  .parts button{all:unset;cursor:pointer;padding:.35em 1em;border-radius:6px;font-weight:800;border:2px solid var(--pc);color:var(--pc);transition:.2s}
  .parts button:hover,.parts button.lit{background:var(--pc);color:#06101f;transform:translateY(-2px)}
  .tree{display:grid;gap:6px;font-family:var(--mono);font-size:.875rem}
  .tn{animation:pop .45s both}
  .tn>.nm{display:inline-block;padding:.15em .7em;border-radius:6px;font-weight:700;background:color-mix(in srgb,var(--d) 25%,transparent);border:1px solid var(--d);color:var(--text)}
  .tn.tx>.nm{background:var(--card2);border:1px dashed var(--line);color:var(--mute);font-family:var(--font);font-weight:400}
  .tn>.kids{margin:5px 0 3px 16px;padding-left:14px;border-left:2px solid var(--line);display:grid;gap:6px}
  .wire{display:grid;gap:8px;padding:14px;background:var(--card);border:1px solid var(--line);border-radius:8px;min-height:320px;grid-template-rows:auto 1fr auto}
  .wire{position:relative}
  .wire .rg{border-radius:8px;border:2px dashed var(--rc);background:color-mix(in srgb,var(--rc) 10%,transparent);display:grid;place-items:center;font:700 .875rem var(--mono);color:color-mix(in srgb,var(--rc) 70%,var(--text));padding:.6em;opacity:.38;transform:scale(.97);transition:.45s cubic-bezier(.2,.9,.3,1.4);cursor:pointer;text-align:center}
  .wire .rg.show{opacity:1;transform:none;color:var(--text);background:color-mix(in srgb,var(--rc) 22%,transparent)}.wire .rg.hov{background:var(--rc);color:#06101f}
  .wire .wph{position:absolute;inset:0;display:grid;place-content:center;justify-items:center;gap:.5em;text-align:center;font:700 .875rem var(--mono);color:var(--text);pointer-events:none;transition:opacity .4s;z-index:3;background:radial-gradient(closest-side,color-mix(in srgb,var(--bg) 70%,transparent),transparent)}.wire .wph .ic{width:30px;height:30px;color:var(--basic)}.wire.has .wph{opacity:0}
  .wire .mainrow{display:grid;grid-template-columns:2fr 1fr;gap:8px}
  .wire .mainrow>.rg{min-height:110px}
  .wire .mainwrap{border-radius:8px;border:2px dashed var(--rc);padding:8px;position:relative;opacity:.38;transition:.45s}
  .wire .mainwrap.show{opacity:1}
  .wire .mainwrap>b{position:absolute;top:-.8em;left:12px;font:700 .75rem var(--mono);background:var(--bg2);padding:0 .6em;color:var(--rc)}
  .zoo{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:8px}
  .zoo button{all:unset;cursor:pointer;text-align:center;padding:.6em .4em;border-radius:8px;background:var(--card);border:1px solid var(--line);transition:.2s;font-weight:700}
  .zoo button:hover{transform:translateY(-3px) rotate(-1deg);border-color:var(--c);background:var(--card2)}
  .zoo button b{display:block;font:800 1rem var(--mono);color:var(--c)}.zoo button small{color:var(--mute);font-size:.75rem}
  .tagzoo>.col:last-child .stage{flex:1;max-height:520px;overflow:auto}
  .tagzoo pre.code{max-height:270px;flex:1}
  .stage{background:#fff;color:#222;border-radius:8px;padding:16px;min-height:300px;font-family:var(--font);border:1px solid var(--line)}
  .stage .pc{position:relative;padding:6px 8px 6px 8px;margin:6px 0;border-radius:8px;animation:pop .5s both;outline:1px dashed transparent;transition:.2s}
  .stage .pc:hover{outline-color:#5b9dff;background:#f0f5ff}
  .stage .pc em{position:absolute;right:4px;top:-9px;font:700 .62rem var(--mono);background:#5b9dff;color:#fff;padding:0 .5em;border-radius:6px;font-style:normal}
  .stage table{border-collapse:collapse}.stage td,.stage th{border:1px solid #bbb;padding:.2em .8em}.stage th{background:#eef}
  .stage:empty::before{content:"← タグをクリックして追加";color:#999}
  .fgrid{display:grid;grid-template-columns:1fr 60px 1fr;gap:12px;align-items:stretch;position:relative}
  .fgrid .srv{display:grid;place-items:center;text-align:center;background:var(--card);border:2px solid var(--line);border-radius:8px;padding:14px;transition:.4s}
  .fgrid .srv.got{border-color:var(--ok);box-shadow:0 0 30px -6px var(--ok)}
  .fgrid .srv pre{font:.75rem/1.6 var(--mono);text-align:left;color:var(--text);white-space:pre-wrap}
  .env{position:absolute;font-size:2rem;left:0;top:44%;pointer-events:none;opacity:0;z-index:3}
  .fm{display:grid;gap:10px;background:var(--card);border:1px solid var(--line);padding:14px;border-radius:8px}
  .fm label{font-weight:800;font-size:.875rem;display:grid;gap:3px}.fm label small{font:500 .68rem var(--mono);color:var(--mute)}
  .fm input{font:inherit;padding:.5em .8em;border-radius:6px;border:1px solid var(--line);background:var(--bg2);color:var(--text);outline:none;transition:.2s}
  .fm input:focus{border-color:var(--c);box-shadow:0 0 0 3px color-mix(in srgb,var(--c) 30%,transparent)}
  .road{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin-bottom:12px}
  .road .rd{position:relative;padding:10px 8px;border-radius:8px;background:var(--card);border:1px solid var(--line);text-align:center;opacity:.35;transform:scale(.94);transition:.5s}
  .road .rd.on{opacity:1;transform:none;border-color:var(--rc);background:linear-gradient(160deg,color-mix(in srgb,var(--rc) 22%,var(--card)),var(--card))}
  .road .rd b{display:block;font-size:1.25rem}.road .rd span{font-size:.75rem;font-weight:800;color:var(--mute)}
  @media(max-width:760px){.road{grid-template-columns:repeat(3,minmax(0,1fr))}.road .rd{padding:8px 4px}}
  .web{border-radius:8px;background:#fff;color:#222;padding:18px;min-height:170px;position:relative;overflow:hidden;border:1px solid var(--line)}
  .web .layer{position:absolute;inset:0;display:grid;place-items:center;font-size:2.6rem;opacity:0;transition:.6s}
  .web .skel{display:grid;gap:8px;transition:.6s}.web .skel i{display:block;height:14px;border-radius:7px;background:#dde1ef;transition:.6s}
  .check{display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:8px;border:1px solid var(--line);background:var(--card);cursor:pointer;transition:.25s;font-weight:800}
  .check:hover{transform:translateX(5px)}
  .check .bx{width:28px;height:28px;border-radius:6px;border:2px solid var(--line);display:grid;place-items:center;transition:.3s;flex:none}
  .check.ok{border-color:var(--ok)}.check.ok .bx{background:var(--ok);border-color:var(--ok);color:#052e16;transform:rotate(360deg)}
  .check small{display:block;color:var(--mute);font-weight:500}
  `);

  /* ===== gap-fill scenes (plan / goal / list / mini project) ===== */
  style('gap-html', `
  .gap-days{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;position:relative}
  .gap-day{all:unset;cursor:pointer;display:grid;gap:2px;padding:12px 8px;border-radius:8px;border:1px solid color-mix(in srgb,var(--dc) 40%,var(--line));background:linear-gradient(170deg,color-mix(in srgb,var(--dc) 22%,var(--card)),var(--card));text-align:center;transition:.3s cubic-bezier(.2,.9,.3,1.4);position:relative;animation:pop .5s both}
  .gap-day:hover{transform:translateY(-4px)}
  .gap-day.on{transform:translateY(-8px) scale(1.04);border-color:var(--dc);box-shadow:0 16px 30px -14px var(--dc)}
  .gap-day b{font:900 1.5rem var(--mono);line-height:1}.gap-day small{color:var(--mute);font-weight:800;font-size:.75rem}
  .gap-day span{font-weight:800;font-size:.75rem;color:var(--dc)}
  .gap-detail{margin-top:14px;padding:16px;border-radius:10px;border:2px solid var(--dc,var(--line));background:linear-gradient(160deg,color-mix(in srgb,var(--dc,#888) 14%,var(--card)),var(--card));display:grid;gap:10px;animation:capin .4s both}
  .gap-detail a.chip{text-decoration:none;font-size:.875rem;transition:.2s}.gap-detail a.chip:hover{transform:translateY(-2px);background:var(--c);color:#06101f}
  .gap-site{border-radius:8px;background:#fff;color:#223;padding:20px;border:1px solid var(--line);min-height:230px;display:grid;gap:10px;align-content:start;overflow:hidden;transition:all .6s;position:relative}
  .gap-site .nav{display:flex;gap:10px;font:800 .75rem var(--mono);color:#556;opacity:.25;transition:.6s;margin:0;border:0;padding:0}
  .gap-site h4{font-size:1.5rem;margin:0;transition:.6s}.gap-site p{margin:0;color:#556;transition:.6s}
  .gap-site .skel{height:12px;border-radius:6px;background:#e3e6f2;transition:.6s}
  .gap-site .tsb{position:absolute;right:12px;bottom:12px;font:800 .75rem var(--mono);background:#3178c6;color:#fff;padding:.1em .7em;border-radius:6px;opacity:0;transform:scale(.6);transition:.5s}
  .gap-site button{font:inherit;padding:.4em 1em;border:0;border-radius:6px;background:#e3e6f2;width:max-content;transition:.5s}
  .gap-site.s1 h4,.gap-site.s1 p{color:#223}
  .gap-site.s2{background:linear-gradient(135deg,#fff5fa,#eef4ff)}.gap-site.s2 h4{background:linear-gradient(90deg,#ff6b9d,#5b9dff);-webkit-background-clip:text;background-clip:text;color:transparent}
  .gap-site.s2 .nav{opacity:1}.gap-site.s2 button{background:#5b9dff;color:#fff;box-shadow:0 8px 16px -8px #5b9dff}
  .gap-site.s3 .tsb{opacity:1;transform:none}
  .gap-site.s5{box-shadow:0 0 0 3px #fff,0 0 0 6px #6fdc7c,0 20px 40px -16px #6fdc7c}
  .gap-ol{background:#fff;color:#222;padding:14px 18px;border-radius:8px;min-height:170px;font-size:1rem}
  .gap-ol ul,.gap-ol ol,.gap-ol dl{margin:0;padding-left:1.5em}.gap-ol li{animation:pop .4s both;padding:2px 0}.gap-ol dt{font-weight:900;color:#2563eb;animation:pop .4s both}.gap-ol dd{margin:0 0 .5em 1.2em;color:#556}
  .gap-ol ul ul,.gap-ol ol ol{margin-top:2px;font-size:.92em}
  .gap-items{display:flex;gap:6px;flex-wrap:wrap}
  .gap-items span{display:inline-flex;gap:.4em;align-items:center;padding:.2em .4em .2em .8em;border-radius:6px;background:var(--card2);border:1px solid var(--line);font-weight:700;font-size:.875rem}
  .gap-items span button{all:unset;cursor:pointer;width:20px;height:20px;border-radius:50%;display:grid;place-items:center;background:var(--line);font-size:.75rem}.gap-items span button:hover{background:var(--bad);color:#fff}
  .gap-tl{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;position:relative}
  .gap-tl .pt{all:unset;cursor:pointer;text-align:center;padding:10px 6px;border-radius:8px;border:2px dashed var(--line);background:var(--card);transition:.35s;font-weight:800;font-size:.875rem}
  .gap-tl .pt b{display:block;font:900 1rem var(--mono);color:var(--mute)}
  .gap-tl .pt.ok{border:2px solid var(--ok);background:color-mix(in srgb,var(--ok) 15%,var(--card));transform:translateY(-3px)}.gap-tl .pt.ok b{color:var(--ok)}
  .gap-plan label{font-weight:800;font-size:.875rem;display:grid;gap:3px}
  .gap-plan input[type=text],.gap-plan textarea{font:inherit;padding:.45em .8em;border-radius:6px;border:1px solid var(--line);background:var(--bg2);color:var(--text);outline:none;resize:vertical}
  .gap-plan input[type=text]:focus,.gap-plan textarea:focus{border-color:var(--basic);box-shadow:0 0 0 3px color-mix(in srgb,var(--basic) 28%,transparent)}
  .gap-sw{display:flex;gap:6px}.gap-sw button{all:unset;cursor:pointer;width:28px;height:28px;border-radius:50%;border:3px solid transparent;transition:.2s}.gap-sw button.on{border-color:var(--text);transform:scale(1.15)}
  @media(max-width:900px){.gap-days{grid-template-columns:repeat(3,1fr)}.gap-tl{grid-template-columns:repeat(2,1fr)}}
  `);

  const DAYS = [
    { d: '1', w: '', c: 'var(--basic)', t: 'HTML/CSS · CUI · Git', k: [['コース紹介', 'intro'], ['CUI・Vim', 'cuivim'], ['Git', 'git'], ['HTML', 'html'], ['CSS', 'css']], m: '開発の土台。ターミナル・バージョン管理・Webの骨組みと見た目。' },
    { d: '2', w: '', c: 'var(--ts)', t: 'TypeScript ①', k: [['紹介', 'ts-intro'], ['基礎文法・データ型', 'ts-basic'], ['型の構文', 'ts-types'], ['クラス', 'ts-class']], m: '型で「バグを書く前に気づく」力を付ける。' },
    { d: '3', w: '', c: 'var(--ts)', t: 'TypeScript ②', k: [['interface・Type', 'ts-types'], ['ジェネリクス', 'ts-generics'], ['単体テスト入門', 'ts-test']], m: '型を設計し、テストで守る。' },
    { d: '4', w: '', c: 'var(--vue)', t: 'Vue.js ①', k: [['紹介', 'vue-intro'], ['環境設定', 'vue-env'], ['基礎', 'vue-basics'], ['コンポーネント', 'vue-comp']], m: '画面が「データに反応して」動く感覚をつかむ。' },
    { d: '5', w: '', c: 'var(--vue)', t: 'Vue.js ②', k: [['アイデア発想', 'idea'], ['Lifecycle・Computed・Watcher', 'vue-life'], ['Vue Router', 'vue-router'], ['単体テスト', 'ts-test'], ['Q&A', 'qa']], m: '応用機能を学び、チーム開発のテーマを決める。' },
    { d: '6', w: '', c: 'var(--team)', t: '開発・発表', k: [['アイデア→発表', 'idea'], ['開発', 'dev'], ['準備', 'prep'], ['成果発表', 'demo']], m: '作る → 見せる。あなたらしいWebサイトを完成させる日。' },
  ];

  function planScene(el) {
    const row = h('div', { class: 'gap-days' }), det = h('div', { class: 'gap-detail' });
    const btns = DAYS.map((D, i) => h('button', { class: 'gap-day', style: { '--dc': D.c, animationDelay: i * 70 + 'ms' }, onclick: () => show(i) }, h('small', 'DAY'), h('b', D.d), h('span', D.t)));
    row.append(...btns);
    function show(i) {
      const D = DAYS[i]; btns.forEach((b, k) => b.classList.toggle('on', k === i));
      det.style.setProperty('--dc', D.c); det.style.animation = 'none'; void det.offsetWidth; det.style.animation = '';
      det.replaceChildren(h('div', { style: { fontWeight: 900, fontSize: '1.25rem' } }, `${D.d}日目　${D.t}`), h('div', { style: { color: 'var(--mute)' } }, D.m), h('div', { class: 'row' }, D.k.map(([t, id]) => h('a', { class: 'chip', style: { '--c': D.c }, href: '#/lesson/' + id }, t + ' →'))));
    }
    el.append(row, det, h('p', { style: { color: 'var(--mute)', fontSize: '.875rem', marginTop: '10px' } }, '※ 進み方は人によって違って OK。日付をクリック → 各テーマへジャンプ。'));
    show(0);
  }

  function goalScene(el) {
    const site = h('div', { class: 'gap-site' }, h('span', { class: 'tsb' }, 'TypeScript'), h('div', { class: 'nav' }, h('span', 'Home'), h('span', 'About'), h('span', 'Works')), h('h4', 'あなたらしいWebサイト'), h('p', '好きなこと・作りたいものを形にしよう。'), h('div', { class: 'skel', style: { width: '80%' } }), h('div', { class: 'skel', style: { width: '55%' } }));
    const btn = h('button', '👍 0'); site.append(btn); let n = 0, live = false;
    btn.onclick = () => { if (!live) return; n++; btn.textContent = '👍 ' + n; btn.animate([{ transform: 'scale(1.35)' }, { transform: 'none' }], { duration: 250 }); };
    const SK = [['HTML', 'var(--basic)'], ['CSS', 'var(--basic)'], ['TypeScript', 'var(--ts)'], ['Vue.js', 'var(--vue)'], ['公開', 'var(--pink)']];
    const chips = h('div', { class: 'row' }, SK.map(([t, c]) => h('span', { class: 'chip', style: { '--c': c, opacity: .3, transition: '.4s' } }, t)));
    el.append(stepper({
      color: 'var(--pink)', interval: 2000,
      steps: [{ say: '<b>HTML</b>：まずは骨組み。見出しと文章だけでもサイトの第一歩。' }, { say: '<b>CSS</b>：色・角丸・影で、一気に「自分のサイト」らしく。' }, { say: '<b>TypeScript</b>：型で守られた、バグに強いコードへ。' }, { say: '<b>Vue.js</b>：ボタンを押して！ データに反応する動くUIに。' }, { say: '<b>公開！</b> 難しいことは後回し。まず基本をしっかり、で大丈夫。' }],
      init(vis) { vis.append(h('div', { class: 'split wide-l' }, site, h('div', { class: 'col' }, lbl('身につくスキル'), chips, h('div', { class: 'card', style: { fontWeight: 800 } }, 'ゴール：最終日', h('div', { style: { color: 'var(--mute)', fontWeight: 500, fontSize: '.875rem', marginTop: '.3em' } }, 'Vue.js と TypeScript を使って、簡単なサイトを作れるようになる。'))))); },
      update(i) {
        [...chips.children].forEach((c, k) => (c.style.opacity = k <= i ? 1 : .3));
        site.classList.toggle('s1', i >= 0); site.classList.toggle('s2', i >= 1); site.classList.toggle('s3', i >= 2); site.classList.toggle('s5', i >= 4);
        live = i >= 3; btn.classList.toggle('pulse', i === 3); btn.style.cursor = live ? 'pointer' : 'default';
        if (i < 3) { n = 0; btn.textContent = '👍 0'; }
        site.querySelectorAll('.skel').forEach((s, k) => (s.style.background = i >= 1 ? ['#ffd3e4', '#d6e4ff'][k] : ''));
      },
    }));
  }

  function listScene(el) {
    const S = { t: 'ul', items: ['初回30分は無料', 'ビデオ通話OK', '土日も対応'], nest: false };
    const stage = h('div', { class: 'gap-ol' }), cd = h('div'), chips = h('div', { class: 'gap-items' }), note = h('div', { class: 'st-cap' });
    const NOTE = { ul: '<b>ul</b> = Unordered List（順番なし）。●が付く。<b>メニュー・特長の一覧</b>向き。読み上げが「リスト 3項目」と数まで教えてくれる。', ol: '<b>ol</b> = Ordered List（順番あり）。1,2,3…が自動で振られる。<b>申込の手順・ランキング</b>向き。途中に足しても番号は自動で直る。', dl: '<b>dl</b> = 用語（dt）と説明（dd）のセット。<b>料金表・よくある質問</b>向き。' };
    function html(e = (v) => v) {
      if (S.t === 'dl') return '<dl>\n' + S.items.map((x) => `  <dt>${e(x)}</dt>\n  <dd>${e(x)}の説明</dd>`).join('\n') + '\n</dl>';
      return `<${S.t}>\n` + S.items.map((x, i) => `  <li>${e(x)}` + (S.nest && i === 0 ? `\n    <${S.t}>\n      <li>${e(x)}の補足</li>\n    </${S.t}>\n  ` : '') + '</li>').join('\n') + `\n</${S.t}>`;
    }
    const draw = () => {
      const src = html(); stage.innerHTML = html(esc); cd.replaceChildren(code(src, 'html', { file: 'list.html', color: BASIC_C }));
      chips.replaceChildren(...S.items.map((x, i) => h('span', x, h('button', { title: '削除', onclick: () => { S.items.splice(i, 1); draw(); } }, '✕'))));
      note.innerHTML = NOTE[S.t]; kinds.forEach((b) => b.classList.toggle('on', b.dataset.v === S.t)); nestBtn.style.display = S.t === 'dl' ? 'none' : '';
    };
    const kinds = ['ul', 'ol', 'dl'].map((v) => h('button', { class: 'gap-chip', 'data-v': v, onclick: () => { S.t = v; draw(); } }, '<' + v + '>'));
    const inp = h('input', { type: 'text', placeholder: '項目を追加…', style: { font: 'inherit', padding: '.35em .8em', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--bg2)', color: 'var(--text)', minWidth: '0', flex: 1 }, onkeydown: (e) => { if (e.key === 'Enter') add(); } });
    const add = () => { if (inp.value.trim()) { S.items.push(inp.value.trim()); inp.value = ''; draw(); } };
    const nestBtn = h('button', { class: 'gap-chip', onclick: () => { S.nest = !S.nest; nestBtn.classList.toggle('on', S.nest); draw(); } }, 'ネスト（入れ子）');
    el.append(h('div', { class: 'split' }, h('div', { class: 'col' }, lbl('リストの種類'), h('div', { class: 'gap-chips' }, kinds, nestBtn), lbl('項目'), chips, h('div', { class: 'row', style: { flexWrap: 'nowrap' } }, inp, h('button', { class: 'btn', onclick: add }, '＋ 追加')), cd), h('div', { class: 'col' }, lbl('結果'), stage, note)));
    el.append(h('div', { class: 'card', style: { marginTop: '16px' } }, h('div', { class: 'quiz' }, ...[['レシピの手順（①切る ②焼く ③盛る）', 1], ['今日の持ち物（財布・鍵・スマホ）', 0], ['人気ランキング TOP3', 1]].map(([q, a], i) => h('div', { class: 'row', style: { justifyContent: 'space-between', padding: '4px 0' } }, h('b', q), h('div', { class: 'row' }, ['ul', 'ol'].map((v, k) => { const b = h('button', { class: 'btn', onclick: () => { b.classList.add(k === a ? 'primary' : 'shake'); b.style.setProperty('--c', k === a ? 'var(--ok)' : 'var(--bad)'); setTimeout(() => b.classList.remove('shake'), 400); } }, '<' + v + '>'); return b; })))))));
    draw();
  }
  const BASIC_C = 'var(--basic)';

  function planProject(el) {
    const P = Object.assign({ name: 'Lam の趣味ログ', purpose: '好きなことを紹介する', why: '自分を知ってもらいたい', hours: 4, color: '#5b9dff', js: false, opinion: '写真ギャラリーがあると嬉しい' }, store.get('gap.plan', {}));
    const frame = h('iframe', { sandbox: 'allow-scripts', style: { width: '100%', height: '430px', border: '1px solid var(--line)', borderRadius: '8px', background: '#fff' } });
    const eff = h('output', { style: { font: '800 .85rem var(--mono)', color: 'var(--basic)' } });
    const draw = () => {
      store.set('gap.plan', P); eff.textContent = P.hours + ' 時間';
      const e = (s) => esc(s || '…');
      frame.srcdoc = `<style>*{box-sizing:border-box}body{margin:0;font-family:system-ui,'Hiragino Sans',sans-serif;color:#223}header{background:${P.color};color:#fff;padding:22px 20px}header h1{margin:0;font-size:1.5rem}main{padding:16px 20px;display:grid;gap:12px}section{border-left:5px solid ${P.color};padding:2px 12px}h2{margin:0;font-size:.75rem;color:${P.color};letter-spacing:.1em}p{margin:.2em 0}button{border:0;background:${P.color};color:#fff;padding:.4em 1.1em;border-radius:6px;font:inherit}footer{padding:10px 20px;font-size:.75rem;color:#889}</style><header><h1>${e(P.name)}</h1></header><main><section><h2>目的</h2><p>${e(P.purpose)}</p></section><section><h2>作りたい理由</h2><p>${e(P.why)}</p></section><section><h2>工数の目安</h2><p>${P.hours} 時間${P.hours > 6 ? '（JS も挑戦！）' : ''}</p></section><section><h2>みんなの意見</h2><p>${e(P.opinion)}</p></section>${P.js ? '<button id=b>👍 0</button>' : ''}</main><footer>© ${e(P.name)}</footer>` + (P.js ? '<script>var n=0;b.onclick=function(){b.textContent="👍 "+(++n)}<\/script>' : '');
    };
    const tx = (label, key, area) => { const f = h(area ? 'textarea' : 'input', Object.assign({ rows: 2, oninput: (e) => { P[key] = e.target.value; draw(); } }, area ? {} : { type: 'text' })); f.value = P[key]; return h('label', label, f); };
    const fields = [tx('① ウェブサイト名', 'name'), tx('② 内容・目的', 'purpose'), tx('③ 開発したい理由', 'why')];
    const hours = h('label', '④ 工数（時間）', h('div', { class: 'gap-row', style: { gridTemplateColumns: '1fr 70px' } }, h('input', { type: 'range', min: 1, max: 10, value: P.hours, oninput: (e) => { P.hours = +e.target.value; draw(); } }), eff));
    const sw = h('div', { class: 'gap-sw' }, ['#5b9dff', '#ff6b9d', '#2fd4a4', '#ffb454', '#a98bff'].map((c) => h('button', { style: { background: c }, class: P.color === c ? 'on' : '', onclick: (e) => { P.color = c; [...sw.children].forEach((b) => b.classList.toggle('on', b === e.currentTarget)); draw(); } })));
    const jsT = h('label', { style: { display: 'flex', alignItems: 'center', gap: '.5em', cursor: 'pointer' } }, h('input', { type: 'checkbox', checked: P.js, onchange: (e) => { P.js = e.target.checked; draw(); } }), 'JavaScript を使う（任意）');
    const form = h('div', { class: 'col gap-plan' }, ...fields, hours, h('label', '⑤ デザイン（任意）', sw), jsT, tx('⑥ 他の方の意見', 'opinion', true));
    el.append(h('div', { class: 'split' }, form, h('div', { class: 'col' }, lbl('ライブプレビュー（あなたの企画書）'), frame)));
    // 30-min report + pages deploy
    const CK = store.get('gap.report', [false, false, false, false]);
    const tl = h('div', { class: 'gap-tl' }, ['企画を決める', 'HTML で骨組み', 'CSS で見た目', 'GitHub に push'].map((t, i) => h('button', { class: 'pt' + (CK[i] ? ' ok' : ''), onclick: (e) => { CK[i] = !CK[i]; e.currentTarget.classList.toggle('ok', CK[i]); store.set('gap.report', CK); } }, h('b', `${(i + 1) * 30} 分`), t)));
    el.append(h('div', { style: { marginTop: '18px' } }, lbl('30分ごとに進捗報告（Github に push → コメントをもらう）'), tl));
    const dp = stepper({
      color: 'var(--basic)',
      steps: [{ say: '<b>① push</b>：作ったファイルを GitHub のリポジトリへ。' }, { say: '<b>② Settings → Pages</b>：公開する branch（main）を選んで Save。' }, { say: '<b>③ URL が発行</b>：数分待つと、世界中から見られるサイトに！' }],
      init(vis) { vis.append(h('div', { class: 'gap-pg' })); },
      update(i, s, vis) {
        const L = ['$ git add .\n$ git commit -m "first site"\n$ git push origin main', 'Settings  >  Pages\n  Source : Deploy from a branch\n  Branch : main  /  (root)      [ Save ]', '✓ Your site is live at\nhttps://<ユーザー名>.github.io/<リポジトリ名>/'];
        vis.firstChild.replaceChildren(code(L[i], 'sh', { file: ['Terminal', 'GitHub', 'GitHub Pages'][i], color: BASIC_C }));
      },
    });
    el.append(h('div', { style: { marginTop: '18px' } }, lbl('GitHub Pages で公開'), dp));
    draw();
  }

  /* ================= intro ================= */
  K.reg({
    id: 'intro', track: 'basic', title: 'コース紹介', sub: '全体像とゴール', emoji: '🚀',
    scenes: [
      {
        t: 'この研修で作るもの', lead: '6日間で <b>HTML/CSS → TypeScript → Vue.js</b> と積み上げ、最後に自分たちのWebアプリを発表します。「次へ ▶」で完成までの道のりを見てみよう。',
        render(el) {
          const rd = [['🧱', 'HTML', '骨組み', 'var(--basic)'], ['🎨', 'CSS', '見た目', 'var(--basic)'], ['📘', 'TypeScript', '型で安全に', 'var(--ts)'], ['💚', 'Vue.js', '動くUI', 'var(--vue)'], ['💡', 'アイデア', '発想', 'var(--team)'], ['🏆', '発表', 'Demo Day', 'var(--pink)']];
          const road = h('div', { class: 'road' }, rd.map(([e, a, b, c]) => h('div', { class: 'rd', style: { '--rc': c } }, h('b', e), h('strong', a), h('br'), h('span', b))));
          const skel = h('div', { class: 'skel' }, [60, 100, 80, 40].map((w) => h('i', { style: { width: w + '%' } })));
          const layer = h('div', { class: 'layer' });
          const web = h('div', { class: 'web' }, skel, layer);
          const caps = [
            ['まず<b>HTML</b>で、ページの骨組みを作ります。', 1, '', 0],
            ['<b>CSS</b>で色・形・レイアウトを与えます。', 2, '🎨', .2],
            ['<b>TypeScript</b>で、バグを事前に見つける「型」の力を手に入れます。', 3, '🛡️', .4],
            ['<b>Vue.js</b>でクリックに反応する“生きた”UIへ。', 4, '⚡', .6],
            ['チームで<b>アイデア</b>を出して、課題を決めます。', 5, '💡', .8],
            ['<b>あなたらしいWebサイト</b>を発表！ 🎉', 6, '🏆', 1],
          ];
          el.append(stepper({
            color: 'var(--basic)', interval: 2200,
            steps: caps.map((c) => ({ say: c[0] })),
            init(vis) { vis.append(road, web); },
            update(n) {
              road.querySelectorAll('.rd').forEach((r, i) => r.classList.toggle('on', i <= n));
              const [, , em, p] = caps[n];
              skel.querySelectorAll('i').forEach((b, i) => {
                b.style.background = n >= 1 ? `hsl(${210 + i * 40 + n * 12} 80% ${88 - n * 4}%)` : '#dde1ef';
                b.style.height = n >= 1 ? 14 + n * 5 + 'px' : '14px';
                b.style.borderRadius = n >= 1 ? 7 + n * 3 + 'px' : '7px';
              });
              web.style.boxShadow = `0 0 ${p * 60}px -8px hsl(${n * 55} 90% 60%)`;
              layer.textContent = em; layer.style.opacity = em ? 1 : 0; layer.style.fontSize = (em ? 2.4 + n * 0.25 : 1.5) + 'rem';
            },
          }));
        },
      },
      { t: '学習計画表', tag: '6日間', lead: '6日間の流れ。<b>日付をクリック</b>すると、その日のテーマ（→ 各ページ）が開きます。', render: planScene },
      { t: '講義のゴール', tag: '最終日', lead: '最終日に作るのは<b>あなたらしいWEBサイト</b>。「次へ ▶」で、スキルが積み上がる様子を見よう。', render: goalScene },
      {
        t: '学習の進め方', lead: '各ページは「<b>見る → 動かす → 作る</b>」の順番。図を<b>クリック</b>して理解 → 最後の「実践」で自分のコードを書いて確認します。',
        render(el) {
          const cards = [['👀', '見る', '図とアニメで「なぜ」をつかむ'], ['👆', '動かす', 'スライダーやボタンで挙動を確かめる'], ['⌨️', '作る', 'ブラウザ上で書いて、即プレビュー']];
          el.append(h('div', { class: 'split', style: { gridTemplateColumns: 'repeat(3,1fr)' } }, cards.map(([e, a, b], i) => h('div', { class: 'card', style: { animation: `pop .6s ${i * .15}s both`, textAlign: 'center' } }, h('div', { style: { fontSize: '2.6rem' } }, e), h('h3', a), h('p', { style: { color: 'var(--mute)', fontSize: '.875rem' } }, b)))));
          el.append(h('div', { class: 'card', style: { marginTop: '16px' } }, lbl('キーボード'), h('div', { class: 'row' }, h('kbd', '→'), '次のステップ', h('kbd', '←'), '前のステップ', h('kbd', 'Space'), '次へ', h('kbd', 'Tab'), 'エディタ内でインデント')));
        },
      },
      {
        t: '準備チェック', lead: '研修前に必要なものを確認しましょう。タップでチェック（ブラウザに保存されます）。',
        render(el) {
          const items = [['💻', 'パソコン', '充電器も忘れずに'], ['🐙', 'GitHub アカウント', '研修用の Organization に参加'], ['🧰', 'Visual Studio Code', 'テキストエディタ'], ['💬', 'Zoom / Slack', '質問はいつでも気軽に']];
          const saved = store.get('prep', {});
          const list = h('div', { class: 'col' });
          const pg = h('div', { style: { height: '10px', background: 'var(--line)', borderRadius: '6px', overflow: 'hidden', marginTop: '16px' } }, h('i', { style: { display: 'block', height: '100%', width: '0%', background: 'linear-gradient(90deg,var(--basic),var(--ts))', transition: 'width .5s' } }));
          const upd = () => { const n = items.filter((_, i) => saved[i]).length; pg.firstChild.style.width = (n / items.length) * 100 + '%'; if (n === items.length) K.W.celebrate(); };
          items.forEach(([e, a, b], i) => {
            const c = h('div', { class: 'check' + (saved[i] ? ' ok' : ''), onclick: () => { saved[i] = !saved[i]; c.classList.toggle('ok', !!saved[i]); store.set('prep', saved); upd(); } },
              h('span', { class: 'bx' }, '✓'), h('span', { style: { fontSize: '1.5rem' } }, e), h('div', a, h('small', b)));
            list.append(c);
          });
          el.append(list, pg); upd.call(null);
          pg.firstChild.style.width = (items.filter((_, i) => saved[i]).length / items.length) * 100 + '%';
        },
      },
    ],
  });

  /* ================= html ================= */
  const anat = [
    { s: '<a', p: ['name', 'start'] }, { s: ' ', p: ['start'] }, { s: 'href', p: ['attr', 'aname', 'start'] }, { s: '=', p: ['attr', 'start'] },
    { s: '"/reserve"', p: ['attr', 'aval', 'start'] }, { s: '>', p: ['start'] }, { s: '予約する', p: ['content'] }, { s: '</a>', p: ['end', 'name2'] },
  ];
  const partInfo = {
    el: ['要素 (element)', 'var(--basic)', '開始タグ〜閉じタグまで全部ひっくるめて「要素」', null],
    start: ['開始タグ', 'var(--ts)', 'ここから始まるよ、の合図。ブラウザへの命令', 'start'],
    attr: ['属性', 'var(--team)', '要素に付ける追加情報。ここでは「リンク先はどこ？」を渡している', 'attr'],
    aname: ['属性名', 'var(--pink)', '何の情報か（リンク先なら href、画像なら src、目印なら class …）', 'aname'],
    aval: ['属性値', 'var(--violet)', '情報の中身。"" で囲んで書くのが基本', 'aval'],
    content: ['コンテンツ', 'var(--vue)', '画面に表示される中身', 'content'],
    end: ['閉じタグ', 'var(--ts)', 'ここで終わり。<b>/</b>が付く', 'end'],
  };

  /* ============================================================
     html/2  HTML は「木」 — ページ ↔ 木 を行き来して、実際の使われ方まで見る
  ============================================================ */
  style('tr2', `
  .tr2-wrap{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px;align-items:start}
  .tr2-pane{border:1px solid var(--line);border-radius:10px;background:var(--card);overflow:hidden}
  .tr2-hd{display:flex;align-items:center;gap:8px;padding:8px 12px;border-bottom:1px solid var(--line);font-weight:800;font-size:.875rem}
  .tr2-hd .ic{width:16px;height:16px;color:var(--c,var(--basic))}.tr2-hd small{margin-left:auto;font-weight:600;color:var(--mute);font-size:.75rem}
  .tr2-prev{display:block;width:100%;height:230px;border:0;background:#fff}
  .tr2-tree{padding:10px 12px;font:.8125rem/1.5 var(--mono);max-height:520px;overflow:auto}
  .tr2-n{margin-left:14px;border-left:1px dashed var(--line);padding-left:8px;position:relative}.tr2-tree>.tr2-n{margin-left:0;border:0;padding-left:0}
  .tr2-row{display:flex;align-items:center;gap:6px;padding:1px 4px;border-radius:6px;cursor:default;width:fit-content;max-width:100%}
  .tr2-row .nm{padding:0 .45em;border-radius:6px;border:1px solid color-mix(in srgb,var(--d) 55%,transparent);background:color-mix(in srgb,var(--d) 14%,transparent);color:var(--text);font-weight:700}
  .tr2-row.tx .nm{border-style:dashed;background:transparent;font-weight:400;color:var(--mute)}
  .tr2-row .cl{color:var(--mute);font-size:.75rem}
  .tr2-row .txt{padding:.05em .55em;border-radius:6px;background:color-mix(in srgb,var(--d) 22%,var(--bg2));border:1px dashed color-mix(in srgb,var(--d) 70%,transparent);font-weight:700;color:var(--text)}
  .tr2-row .nm.cls{opacity:.75;font-weight:500}
  .tr2-row.cls-row{opacity:.8}.tr2-row.cls-row .nm{background:transparent;border-style:dotted;font-weight:500}
  .tr2-row .act{display:none;gap:3px;margin-left:4px}.tr2-row:hover .act,.tr2-row.hl .act{display:inline-flex}
  .tr2-row .act button{all:unset;cursor:pointer;width:20px;height:20px;border-radius:6px;display:grid;place-items:center;color:var(--mute);border:1px solid var(--line);background:var(--bg2)}
  .tr2-row .act button:hover{color:var(--text);border-color:var(--c,var(--basic))}.tr2-row .act .ic{width:12px;height:12px}
  .tr2-row.hl{background:color-mix(in srgb,var(--pink) 20%,transparent);outline:1px solid var(--pink)}
  .tr2-row.hit .nm{box-shadow:0 0 0 2px var(--ok)}
  .tr2-tools{display:grid;gap:12px;margin-top:14px}
  .tr2-use{border:1px solid var(--line);border-radius:10px;background:var(--card);padding:12px 14px;display:grid;gap:8px}
  .tr2-use h4{display:flex;align-items:center;gap:8px;font-size:.9375rem;font-weight:900}.tr2-use h4 .ic{width:18px;height:18px;color:var(--c)}
  .tr2-use p{color:var(--mute);font-size:.875rem;line-height:1.7;margin:0}
  .tr2-sel{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
  .tr2-sel input{flex:1;min-width:140px;font:700 .875rem var(--mono);padding:.4em .8em;border-radius:8px;border:1px solid var(--line);background:var(--bg2);color:var(--text)}
  .tr2-chip{all:unset;cursor:pointer;font:700 .75rem var(--mono);padding:.25em .7em;border-radius:6px;border:1px solid var(--line);background:var(--bg2);transition:.15s}.tr2-chip:hover{border-color:var(--c,var(--basic));color:var(--c,var(--basic))}
  .tr2-res{font-weight:800;font-size:.875rem;min-height:1.4em}.tr2-res.ok{color:var(--ok)}.tr2-res.bad{color:var(--bad)}
  .tr2-cmp{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  .tr2-cmp>div{border:1px solid var(--line);border-radius:8px;padding:8px 10px;font:.8125rem/1.6 var(--mono);background:var(--bg2)}
  .tr2-cmp b{display:block;font:800 .75rem var(--font);color:var(--mute);margin-bottom:2px}
  .br-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.br-src{margin:0;padding:10px 12px;border-radius:8px;background:var(--code);color:#d8dcff;font:.8125rem/1.7 var(--mono);white-space:pre-wrap;min-height:84px}.br-prev{width:100%;height:110px;border:1px solid var(--line);border-radius:8px;background:#fff}.br-cap{font-size:.875rem;line-height:1.7;padding:8px 12px;border-radius:8px;border:1px solid var(--line)}.br-cap.ok{border-color:var(--ok)}.br-cap.bad{border-color:var(--bad)}.tr2-chip.on{border-color:var(--c,var(--basic));color:var(--text);background:color-mix(in srgb,var(--basic) 14%,var(--bg2))}@media (max-width:700px){.br-grid{grid-template-columns:1fr}}
  .lb2{display:grid;gap:4px;font-weight:700}.lb2 small{color:var(--mute);font-weight:400}
  .tr2-cmp .bad{border-color:var(--bad)}.tr2-cmp .bad b{color:var(--bad)}.tr2-cmp .ok{border-color:var(--ok)}.tr2-cmp .ok b{color:var(--ok)}
  @media (max-width:900px){.tr2-wrap{grid-template-columns:1fr}.tr2-cmp{grid-template-columns:1fr}}
  `);

  const TREE_INIT = '<article class="card">\n  <h2>オンライン相談</h2>\n  <p>初回 <b>30分</b> 無料</p>\n  <ul>\n    <li>ビデオ通話OK</li>\n    <li>土日も対応</li>\n  </ul>\n  <button>予約する</button>\n</article>\n';
  const TREE_CSS = 'body{font-family:system-ui,"Hiragino Sans",sans-serif;margin:12px;line-height:1.6;color:#223}.card{border:1px solid #cdd6e4;border-radius:10px;padding:10px 14px;max-width:320px}h2{font-size:17px;margin:.1em 0 .3em}ul{margin:.4em 0;padding-left:1.3em}button{background:#e8590c;color:#fff;border:0;border-radius:8px;padding:6px 16px;font:700 13px system-ui}.kn-hl{outline:3px solid #ff6b9d!important;outline-offset:2px;background:rgba(255,107,157,.18)!important}.kn-hit{outline:3px solid #34c77b!important;outline-offset:2px}';
  const VOID = new Set(['br', 'hr', 'img', 'input', 'meta', 'link']);
  /* DOM → 読みやすい HTML 文字列（インデント付き） */
  function prettyHTML(nodes, d = 0) {
    const pad = '  '.repeat(d), out = [];
    nodes.forEach((n) => {
      if (n.nodeType === 3) { const t = n.textContent.replace(/\s+/g, ' ').trim(); if (t) out.push(pad + t.replace(/</g, '&lt;')); return; }
      if (n.nodeType !== 1) return;
      const tg = n.tagName.toLowerCase();
      const attrs = [...n.attributes].filter((a) => !/^data-kn/.test(a.name) && !(a.name === 'class' && /kn-(hl|hit)/.test(a.value) && !a.value.replace(/kn-(hl|hit)/g, '').trim())).map((a) => ` ${a.name}="${a.value.replace(/\s*kn-(hl|hit)/g, '')}"`).join('');
      if (VOID.has(tg)) { out.push(`${pad}<${tg}${attrs}>`); return; }
      const kids = [...n.childNodes];
      const onlyInline = kids.every((k) => k.nodeType === 3 || (k.nodeType === 1 && /^(b|i|strong|em|span|a|code|small)$/i.test(k.tagName) && k.children.length === 0));
      if (onlyInline) out.push(`${pad}<${tg}${attrs}>${kids.map((k) => (k.nodeType === 3 ? k.textContent.replace(/\s+/g, ' ').replace(/</g, '&lt;') : k.outerHTML)).join('').trim()}</${tg}>`);
      else out.push(`${pad}<${tg}${attrs}>`, prettyHTML(kids, d + 1), `${pad}</${tg}>`);
    });
    return out.filter((x) => x !== '').join('\n');
  }

  function treeScene(el) {
    const I = K.W.icon;
    const colors = ['var(--basic)', 'var(--ts)', 'var(--vue)', 'var(--team)', 'var(--pink)', 'var(--violet)'];
    let curDoc = null, rowOf = new Map(), elOf = new Map(), lockEd = false;
    const tree = h('div', { class: 'tr2-tree' });
    const prev = h('iframe', { class: 'tr2-prev', sandbox: 'allow-same-origin', title: 'ページ' });
    const result = h('div', { class: 'tr2-res' });

    function drawTree() {
      rowOf = new Map(); elOf = new Map();
      const mk = (n, d) => {
        if (n.nodeType === 3) {
          const t = n.textContent.trim(); if (!t) return null;
          const row = h('div', { class: 'tr2-row tx' }, h('span', { class: 'nm' }, '“' + (t.length > 12 ? t.slice(0, 12) + '…' : t) + '”'));
          row.style.setProperty('--d', 'var(--mute)');
          return h('div', { class: 'tr2-n' }, row);
        }
        if (n.nodeType !== 1) return null;
        const raw = [...n.childNodes];
        const tg = n.tagName.toLowerCase();
        const isVoid = /^(img|input|br|hr|meta|link)$/.test(tg);
        const textOnly = !isVoid && raw.length > 0 && raw.every((k) => k.nodeType === 3) && n.textContent.trim() !== '';
        const kids = textOnly ? [] : raw.map((c) => mk(c, d + 1)).filter(Boolean);
        const cls = n.getAttribute('class');
        const act = h('span', { class: 'act' },
          h('button', { title: 'このノードをコピー（兄弟として追加）', onclick: (e) => { e.stopPropagation(); const c = n.cloneNode(true); n.after(c); sync(); } }, I('copy-plus')),
          h('button', { title: 'このノードを消す', onclick: (e) => { e.stopPropagation(); n.remove(); sync(); } }, I('trash-2')));
        const row = h('div', { class: 'tr2-row', style: { '--d': colors[d % colors.length] } }, h('span', { class: 'nm' }, '<' + tg + '>'), cls ? h('span', { class: 'cl' }, '.' + cls.split(/\s+/)[0]) : null,
          textOnly ? h('span', { class: 'txt' }, n.textContent.replace(/\s+/g, ' ').trim()) : null,
          textOnly ? h('span', { class: 'nm cls' }, '</' + tg + '>') : null, act);
        row.addEventListener('mouseenter', () => mark(n, true)); row.addEventListener('mouseleave', () => mark(n, false));
        rowOf.set(n, row);
        const closeRow = !textOnly && !isVoid ? h('div', { class: 'tr2-row cls-row', style: { '--d': colors[d % colors.length] } }, h('span', { class: 'nm' }, '</' + tg + '>')) : null;
        if (closeRow) { closeRow.addEventListener('mouseenter', () => mark(n, true)); closeRow.addEventListener('mouseleave', () => mark(n, false)); (rowOf.get(n) || row); }
        return h('div', { class: 'tr2-n' }, row, ...kids, closeRow);
      };
      const body = h('div', { class: 'tr2-n' }, (() => { const r = h('div', { class: 'tr2-row', style: { '--d': 'var(--mute)' } }, h('span', { class: 'nm' }, 'body')); return r; })(), ...[...curDoc.body.childNodes].map((c) => mk(c, 0)).filter(Boolean));
      tree.replaceChildren(body);
    }
    const pathOf = (n, root) => { const p = []; for (let x = n; x && x !== root; x = x.parentElement) p.unshift([...x.parentElement.children].indexOf(x)); return p; };
    const walkTo = (p, root) => { let x = root; for (const i of p) x = x && x.children[i]; return x; };
    function mark(n, on, fromPage) { // n は 木側(curDoc)のノード。fromPage のときは iframe 側の要素
      const d = prev.__d; if (!d || !curDoc) return;
      const tn = fromPage ? walkTo(pathOf(n, d.body), curDoc.body) : n;
      const pe = fromPage ? n : walkTo(pathOf(n, curDoc.body), d.body);
      const r = tn && rowOf.get(tn); if (r) r.classList.toggle('hl', on);
      if (pe && pe.classList) pe.classList.toggle('kn-hl', on);
    }

    function loadPrev(html) {
      prev.onload = () => {
        const d = prev.contentDocument; if (!d) return;
        // 画面側 → 木（ホバー）
        d.body.addEventListener('mouseover', (e) => { if (e.target !== d.body) mark(e.target, true, true); });
        d.body.addEventListener('mouseout', (e) => { if (e.target !== d.body) mark(e.target, false, true); });
        prev.__d = d; runSelector(false);
      };
      prev.srcdoc = `<!doctype html><meta charset="utf-8"><style>${TREE_CSS}</style><body>${html}</body>`;
    }
    function parse(html) { curDoc = new DOMParser().parseFromString('<body>' + html + '</body>', 'text/html'); }
    let lastHtml = '';
    function draw(v, fromTree) { lastHtml = v; parse(v); drawTree(); loadPrev(v); }
    const ed = K.W.codeEditor(TREE_INIT, 'html', (v) => { if (!lockEd) draw(v); });
    ed.style.minHeight = '250px'; ed.style.maxHeight = '300px';
    function sync() { // 木の操作 → エディタを書き換える
      const src = prettyHTML([...curDoc.body.childNodes]);
      lockEd = true; ed.set(src + '\n'); lockEd = false; draw(src);
    }

    /* ---- 使われ方 ① CSS セレクタ ---- */
    const selIn = h('input', { value: '.card li', spellcheck: 'false', 'aria-label': 'CSS セレクタ' });
    function runSelector(msg = true) {
      const d = prev.__d; if (!d || !curDoc) return;
      d.querySelectorAll('.kn-hit').forEach((x) => x.classList.remove('kn-hit'));
      rowOf.forEach((r) => r.classList.remove('hit'));
      let hits = [];
      try { hits = [...d.body.querySelectorAll(selIn.value.trim() || ':not(*)')]; } catch { result.className = 'tr2-res bad'; result.textContent = 'セレクタの書き方が正しくありません'; return; }
      // d の要素 → curDoc の対応ノードを「位置」で引く
      const path = (n) => { const p = []; for (let x = n; x && x !== d.body; x = x.parentElement) p.unshift([...x.parentElement.children].indexOf(x)); return p; };
      const find = (p) => { let x = curDoc.body; for (const i of p) x = x && x.children[i]; return x; };
      hits.forEach((x) => { x.classList.add('kn-hit'); const n = find(path(x)); const r = n && rowOf.get(n); if (r) r.classList.add('hit'); });
      result.className = 'tr2-res ' + (hits.length ? 'ok' : 'bad');
      result.textContent = hits.length ? `${hits.length} 個にヒット（画面は緑の枠、木は緑の囲み）` : 'ヒットなし：木にその形の枝がありません';
    }
    selIn.addEventListener('input', () => runSelector());
    const chips = ['li', '.card li', '.card > button', 'h2 + p', 'li:nth-child(2)', 'b'].map((s) => h('button', { class: 'tr2-chip', onclick: () => { selIn.value = s; runSelector(); } }, s));

    /* ---- 使われ方 ② JavaScript（木を書き換える → 画面が変わる） ---- */
    const JS = [
      ['見出しを変える', "document.querySelector('h2').textContent = '無料相談の予約'", (d) => { const t = d.querySelector('h2'); if (t) t.textContent = '無料相談の予約'; }],
      ['項目を1つ足す', "const li = document.createElement('li')\nli.textContent = '夜間もOK'\ndocument.querySelector('ul').append(li)", (d) => { const u = d.querySelector('ul'); if (u) { const li = d.createElement('li'); li.textContent = '夜間もOK'; u.append(li); } }],
      ['ボタンを消す', "document.querySelector('button').remove()", (d) => { const b = d.querySelector('button'); if (b) b.remove(); }],
    ];
    const jsCode = h('pre', { style: { display: 'block', margin: 0, whiteSpace: 'pre-wrap', border: '1px solid var(--line)', borderRadius: '8px', padding: '8px 10px', background: 'var(--code)', color: '#d8dcff', font: '.8125rem/1.6 var(--mono)' } }, JS[0][1]);
    let jsI = 0;
    const jsBtns = JS.map(([t], i) => h('button', { class: 'tr2-chip', onclick: () => { jsI = i; jsCode.textContent = JS[i][1]; jsBtns.forEach((b, k) => b.classList.toggle('on', k === i)); } }, t));
    const runJs = h('button', { class: 'btn primary', style: { '--c': 'var(--ts)' }, onclick: () => { JS[jsI][2](curDoc); sync(); } }, I('play'), '実行する');
    const resetBtn = h('button', { class: 'btn ghost', onclick: () => { lockEd = true; ed.set(TREE_INIT); lockEd = false; draw(TREE_INIT); } }, I('rotate-ccw'), '元に戻す');

    /* ---- 使われ方 ③ わざと壊す ---- */
    const BREAK = [
      { t: '閉じタグを忘れる', src: '<ul>\n  <li>ビデオ通話OK\n  <li>土日も対応\n</ul>\n<p>初回 30分 無料</p>', exp: 'li が2つ並ぶ', got: '<li> は自動で閉じられて並ぶ。ここは助かる…でも <b>閉じ忘れが大きな枠で起きると</b>、下の p まで飲み込まれる。' },
      { t: 'p の中に div', src: '<p>お知らせ\n  <div>初回無料</div>\n</p>', exp: 'p の子に div', got: '<p> の中に <div> は置けない。ブラウザが p を勝手に閉じ、<div> は<b>外の兄弟</b>になる。余分な空 <code>&lt;p&gt;</code> もできる。' },
      { t: 'ul の外に li', src: '<ul>\n  <li>A</li>\n</ul>\n<li>B</li>', exp: 'li は2つとも ul の中', got: '最後の <li> は ul の<b>外</b>。リストの中身として扱われず、読み上げでも「リスト 1項目」と言われる。' },
    ];
    const brkOut = h('div', { class: 'tr2-cmp' });
    const brk = BREAK.map((b) => h('button', { class: 'tr2-chip', onclick: () => {
      lockEd = true; ed.set(b.src + '\n'); lockEd = false; draw(b.src);
      brkOut.replaceChildren(h('div', { class: 'ok' }, h('b', 'あなたの意図'), b.exp), h('div', { class: 'bad' }, h('b', 'ブラウザの木（右上を見よう）'), h('span', { html: b.got })));
    } }, b.t));

    /* 下の操作ボタンを押したとき、結果（木とページ）が画面の外なら、見えるところまで戻す */
    const revealTop = () => { const w = el.querySelector('.tr2-wrap'); if (!w) return; const r = w.getBoundingClientRect(); if (r.bottom < 90 || r.top > innerHeight - 90) w.scrollIntoView({ block: 'center', behavior: 'smooth' }); };
    const use = (ic, c, title, ...kids) => h('div', { class: 'tr2-use', style: { '--c': c } }, h('h4', I(ic), title), ...kids);
    el.append(
      h('div', { class: 'tr2-wrap' },
        h('div', { class: 'tr2-pane' }, h('div', { class: 'tr2-hd', style: { '--c': 'var(--ts)' } }, I('file-code'), 'HTML（書き換えてみよう）'), ed,
          h('div', { class: 'tr2-hd', style: { '--c': 'var(--vue)', borderTop: '1px solid var(--line)' } }, I('monitor'), 'ページ', h('small', 'カーソルを乗せると、木と連動')), prev),
        h('div', { class: 'tr2-pane' }, h('div', { class: 'tr2-hd', style: { '--c': 'var(--basic)' } }, I('git-fork'), 'DOM ツリー', h('small', '行にカーソル → ページで光る / コピー・削除もできる')), tree)),
      h('div', { class: 'tr2-tools', onclick: (e) => { if (e.target.closest('button')) setTimeout(revealTop, 80); } },
        use('crosshair', 'var(--pink)', 'ほんとうの使われ方 ① CSS は、木をたどって「当てる相手」を探す',
          h('p', { html: '「このボタンだけ赤く」「リストの2番目だけ太く」。CSS は<b>セレクタ</b>で木の中の相手を探します。書き換えて、ヒットする相手を見よう。' }),
          h('div', { class: 'tr2-sel' }, h('code', 'セレクタ'), selIn), h('div', { class: 'tr2-sel' }, chips), result),
        use('braces', 'var(--ts)', 'ほんとうの使われ方 ② JavaScript は、木を書き換えて画面を変える',
          h('p', { html: '押したら文字が変わる・項目が増える。実は <b>JS が木を書き換えている</b>だけ。ボタンで試すと、木・ページ・HTML が一緒に変わります。' }),
          h('div', { class: 'tr2-sel' }, jsBtns), jsCode, h('div', { class: 'row' }, runJs, resetBtn)),
        use('triangle-alert', 'var(--bad)', 'ほんとうの使われ方 ③ 書き方を間違えると、木が思った形にならない',
          h('p', { html: '見た目は何となく表示されても、<b>木の形が変わる</b>と CSS も JS も読み上げも狂います。わざと壊して、木を見てみよう。' }),
          h('div', { class: 'tr2-sel' }, brk), brkOut),
        h('p', { class: 'tr2-use', style: { color: 'var(--mute)', fontSize: '.875rem' } }, I('search'), h('span', { html: '本物のページでも同じ木が見られます。<b>F12 → Elements タブ</b>がこの木そのもの。ホバーでページが光り、右クリックの「検証」で一発。' }))));
    draw(TREE_INIT);
    jsBtns[0].classList.add('on');
  }

  /* ============================================================
     html/3  なぜ意味のあるタグ？ — 同じ見た目を「ロボットの目」で解析する
  ============================================================ */
  style('sm2', `
  .an-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px}
  .an-tab{all:unset;cursor:pointer;display:flex;align-items:center;gap:.5em;padding:.5em 1em;border-radius:8px;font-weight:800;font-size:.875rem;background:var(--card);border:1px solid var(--line);transition:.2s}
  .an-tab .ic{width:16px;height:16px;color:var(--c)}.an-tab.on{border-color:var(--c);background:color-mix(in srgb,var(--c) 16%,var(--card))}
  .an-story{display:flex;gap:10px;align-items:flex-start;padding:10px 14px;border-radius:10px;background:color-mix(in srgb,var(--bad) 9%,var(--card));border:1px solid color-mix(in srgb,var(--bad) 40%,var(--line));font-size:.875rem;line-height:1.7;margin-bottom:12px}
  .an-story .ic{width:18px;height:18px;color:var(--bad);flex:none;margin-top:3px}
  .an-grid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,6fr);gap:14px;align-items:start}
  .an-pane{border:1px solid var(--line);border-radius:10px;background:var(--card);overflow:hidden}
  .an-hd{display:flex;align-items:center;gap:8px;padding:8px 12px;border-bottom:1px solid var(--line);font-weight:800;font-size:.875rem}.an-hd .ic{width:16px;height:16px;color:var(--c,var(--ts))}.an-hd small{margin-left:auto;color:var(--mute);font-weight:600;font-size:.75rem}
  .an-mode{display:flex;gap:6px;padding:8px 12px;border-bottom:1px solid var(--line)}
  .an-mode button{all:unset;cursor:pointer;flex:1;text-align:center;padding:.4em .6em;border-radius:8px;font-weight:800;font-size:.8125rem;border:1px solid var(--line);color:var(--mute);transition:.2s}
  .an-mode button.on.div{color:var(--bad);border-color:var(--bad);background:color-mix(in srgb,var(--bad) 12%,transparent)}.an-mode button.on.sem{color:var(--ok);border-color:var(--ok);background:color-mix(in srgb,var(--ok) 12%,transparent)}
  .an-prev{display:block;width:100%;height:290px;border:0;background:#fff}
  .an-bar{display:flex;gap:8px;align-items:center;padding:8px 12px;border-top:1px solid var(--line);flex-wrap:wrap}.an-bar .say{flex:1;min-width:150px;font-size:.8125rem;font-weight:700;color:var(--mute)}.an-bar .say.bad{color:var(--bad)}.an-bar .say.ok{color:var(--ok)}
  .an-cards{display:grid;gap:12px}
  .an-card{border:1px solid var(--line);border-radius:10px;background:var(--card);padding:10px 12px;display:grid;gap:8px}
  .an-card h4{display:flex;align-items:center;gap:8px;font-size:.875rem;font-weight:900}.an-card h4 .ic{width:16px;height:16px;color:var(--c)}.an-card h4 small{margin-left:auto;font-weight:700;color:var(--mute);font-size:.75rem}
  .an-lm{display:flex;gap:6px;flex-wrap:wrap}.an-lm span{font:800 .75rem var(--mono);padding:.2em .6em;border-radius:6px;border:1px solid var(--ok);color:var(--ok);background:color-mix(in srgb,var(--ok) 10%,transparent)}
  .an-none{font-size:.8125rem;font-weight:800;color:var(--bad);display:flex;gap:6px;align-items:center}.an-none .ic{width:15px;height:15px}
  .an-ol{display:grid;gap:2px;font-size:.8125rem}.an-ol div{padding:1px 0}.an-ol .h1{font-weight:900}.an-ol .h2{padding-left:14px;font-weight:700}.an-ol .h3{padding-left:28px}
  .an-ol .lv{font:800 .6875rem var(--mono);color:var(--mute);margin-right:6px}
  .an-read{display:grid;gap:3px;max-height:190px;overflow:auto;font-size:.8125rem}
  .an-read div{display:flex;gap:8px;align-items:baseline;animation:anIn .35s both}.an-read .rl{flex:none;font:800 .6875rem var(--mono);padding:.1em .5em;border-radius:5px;border:1px solid var(--ok);color:var(--ok);min-width:5.2em;text-align:center}
  .an-read .rl.x{border-color:var(--bad);color:var(--bad)}.an-read .rl.n{border-style:dashed;border-color:var(--line);color:var(--mute)}
  @keyframes anIn{from{opacity:0;transform:translateX(-6px)}to{opacity:1;transform:none}}
  .an-serp{border:1px solid var(--line);border-radius:8px;padding:10px 12px;background:var(--bg2)}.an-serp .u{font-size:.75rem;color:var(--mute)}.an-serp .t{font-size:1rem;font-weight:800;color:#5b9dff;margin:2px 0}.an-serp .d{font-size:.8125rem;line-height:1.6}
  .an-serp .d.bad{color:var(--bad)}.an-serp mark{background:color-mix(in srgb,var(--bad) 28%,transparent);color:inherit;border-radius:3px}
  .an-toc{display:grid;gap:2px;font-size:.8125rem}.an-toc div{padding-left:calc(var(--i,0)*14px)}.an-toc a{color:var(--ts);font-weight:700}
  .an-score{border:1px solid var(--line);border-radius:10px;background:var(--card);margin-top:14px;overflow:hidden}
  .an-score table{width:100%;border-collapse:collapse;font-size:.8125rem}.an-score th,.an-score td{padding:7px 12px;text-align:left;border-top:1px solid var(--line)}.an-score th{font-weight:700;color:var(--mute);border-top:0;background:var(--bg2)}
  .an-score td.d{color:var(--bad);font-weight:800}.an-score td.s{color:var(--ok);font-weight:900}.an-score td.k{font-weight:700}
  @media (max-width:900px){.an-grid{grid-template-columns:1fr}.an-prev{height:250px}.an-score table{font-size:.75rem}.an-score th,.an-score td{padding:6px 8px}}
  `);

  const AN_CSS = '*{box-sizing:border-box}body{margin:0;font:14px/1.7 system-ui,"Hiragino Sans",sans-serif;color:#223;background:#fff}.hd{display:flex;align-items:center;gap:16px;padding:10px 14px;background:#1f3a5f;color:#fff}.hd .logo{font-weight:800;color:#fff;text-decoration:none;margin-right:auto}.nv{display:flex;gap:12px}.nv a,.nv .lnk{color:#cfe3ff;text-decoration:none;cursor:pointer;font-size:13px}.mn{padding:12px 14px;max-width:640px}.h1,h1{font-size:20px;font-weight:800;margin:.2em 0}.h2,h2{font-size:16px;font-weight:800;margin:.9em 0 .25em;color:#1f3a5f}p{margin:.3em 0}.btn,button.btn{display:inline-block;padding:7px 18px;border-radius:8px;background:#e8590c;color:#fff;font:700 14px system-ui;border:0;cursor:pointer;margin-top:6px}.ft{padding:9px 14px;background:#eef2f7;color:#556;font-size:12px}.ft a,.ft .lnk{color:#556;margin-left:8px;cursor:pointer}.meta{color:#667;font-size:12px}.side{border:1px dashed #b8c4d6;border-radius:8px;padding:6px 12px;margin:10px 14px;font-size:13px}.side a,.side .lnk{display:block;color:#1f5fbf;cursor:pointer}.lb,label{display:block;font-weight:700;font-size:13px;margin:.6em 0 .15em}input[type=text],input[type=email],input:not([type]){width:100%;padding:6px 9px;border:1px solid #b8c4d6;border-radius:6px;font:inherit}fieldset{border:0;padding:0;margin:.6em 0}legend,.lg{font-weight:700;font-size:13px;padding:0}.opt,label.opt{display:inline-block;margin-right:12px;font-size:13px;font-weight:400}ol{margin:.3em 0;padding-left:1.4em}[data-kn]{outline:2px solid #5b9dff;outline-offset:2px;position:relative}[data-kn]::after{content:attr(data-kn);position:absolute;top:-11px;left:-9px;min-width:17px;height:17px;border-radius:9px;background:#5b9dff;color:#fff;font:800 10px/17px system-ui;text-align:center;z-index:2}[data-kn].cur{outline-color:#ff6b9d;background:rgba(255,107,157,.18)}[data-kn].cur::after{background:#ff6b9d}[data-kx]{outline:2px dashed #e5484d;outline-offset:2px;position:relative}[data-kx]::after{content:"×";position:absolute;top:-11px;left:-9px;width:17px;height:17px;border-radius:9px;background:#e5484d;color:#fff;font:800 11px/17px system-ui;text-align:center;z-index:2}';
  const AN_SC = [
    { k: 'book', ic: 'calendar-check', c: 'var(--ts)', t: '相談予約ページ', title: 'オンライン相談を予約する | さくら相談室',
      story: '<b>div だけで作ると：</b>キーボードや読み上げで使う人は「予約する」ボタンに<b>たどり着けません</b>（クリックしか受け付けないため）。予約が取れず、そのまま機会損失に。',
      sem: '<header class="hd">\n  <a class="logo" href="/">さくら相談室</a>\n  <nav class="nv"><a href="/">ホーム</a><a href="/price">料金</a><a href="/faq">よくある質問</a></nav>\n</header>\n<main class="mn">\n  <h1>オンライン相談を予約する</h1>\n  <p>初回30分は無料。自宅からビデオ通話で相談できます。</p>\n  <section>\n    <h2>相談の流れ</h2>\n    <ol><li>日時を選んで予約</li><li>届いたURLでビデオ通話</li><li>見積りを確認して依頼</li></ol>\n  </section>\n  <section>\n    <h2>料金</h2>\n    <p>初回無料。2回目以降は30分 5,500円です。</p>\n  </section>\n  <button class="btn" type="button">予約する</button>\n</main>\n<footer class="ft"><small>© さくら相談室</small><a href="/privacy">プライバシー</a></footer>',
      div: '<div class="hd">\n  <div class="logo">さくら相談室</div>\n  <div class="nv"><div class="lnk" onclick="go(\'/\')">ホーム</div><div class="lnk" onclick="go(\'/price\')">料金</div><div class="lnk" onclick="go(\'/faq\')">よくある質問</div></div>\n</div>\n<div class="mn">\n  <div class="h1">オンライン相談を予約する</div>\n  <div>初回30分は無料。自宅からビデオ通話で相談できます。</div>\n  <div class="h2">相談の流れ</div>\n  <div>① 日時を選んで予約</div><div>② 届いたURLでビデオ通話</div><div>③ 見積りを確認して依頼</div>\n  <div class="h2">料金</div>\n  <div>初回無料。2回目以降は30分 5,500円です。</div>\n  <div class="btn" onclick="book()">予約する</div>\n</div>\n<div class="ft">© さくら相談室<span class="lnk" onclick="go(\'/privacy\')">プライバシー</span></div>' },
    { k: 'article', ic: 'newspaper', c: 'var(--vue)', t: '記事ページ', title: '賃貸の退去費用、どこまで払う？ | さくらコラム',
      story: '<b>div だけで作ると：</b>検索結果に出る説明文が<b>メニューの文字だらけ</b>になり、クリックされません。見出しがないので、長い記事の<b>目次も自動では作れません</b>。',
      sem: '<header class="hd">\n  <a class="logo" href="/">さくらコラム</a>\n  <nav class="nv"><a href="/">記事一覧</a><a href="/about">運営について</a></nav>\n</header>\n<main class="mn">\n  <article>\n    <h1>賃貸の退去費用、どこまで払う？</h1>\n    <p class="meta">読了 4 分</p>\n    <p>退去時の請求で迷いやすいポイントを3つにまとめました。</p>\n    <h2>原状回復の考え方</h2>\n    <p>普通に住んでできた傷みは、基本的に貸主の負担です。</p>\n    <h2>請求書のチェック項目</h2>\n    <p>単価と数量、経過年数による減額が入っているかを見ます。</p>\n    <h2>払う前に相談すべきケース</h2>\n    <p>金額が敷金を大きく超えるときは、支払う前に相談を。</p>\n  </article>\n</main>\n<aside class="side"><a href="/a">敷金は戻る？</a><a href="/b">更新料は払うべき？</a></aside>\n<footer class="ft"><small>© さくらコラム</small></footer>',
      div: '<div class="hd">\n  <div class="logo">さくらコラム</div>\n  <div class="nv"><div class="lnk" onclick="go(\'/\')">記事一覧</div><div class="lnk" onclick="go(\'/about\')">運営について</div></div>\n</div>\n<div class="mn">\n  <div class="h1">賃貸の退去費用、どこまで払う？</div>\n  <div class="meta">読了 4 分</div>\n  <div>退去時の請求で迷いやすいポイントを3つにまとめました。</div>\n  <div class="h2">原状回復の考え方</div>\n  <div>普通に住んでできた傷みは、基本的に貸主の負担です。</div>\n  <div class="h2">請求書のチェック項目</div>\n  <div>単価と数量、経過年数による減額が入っているかを見ます。</div>\n  <div class="h2">払う前に相談すべきケース</div>\n  <div>金額が敷金を大きく超えるときは、支払う前に相談を。</div>\n</div>\n<div class="side"><div class="lnk" onclick="go(\'/a\')">敷金は戻る？</div><div class="lnk" onclick="go(\'/b\')">更新料は払うべき？</div></div>\n<div class="ft">© さくらコラム</div>' },
    { k: 'form', ic: 'file-pen-line', c: 'var(--pink)', t: '申込フォーム', title: '無料相談の申込み | さくら相談室',
      story: '<b>div だけで作ると：</b>入力欄に<b>名前が付かず</b>、読み上げは「入力欄」としか言えません。ラベルをクリックしても入力欄が選ばれず、<b>入力ミスと離脱</b>が増えます。',
      sem: '<header class="hd"><a class="logo" href="/">さくら相談室</a></header>\n<main class="mn">\n  <h1>無料相談の申込み</h1>\n  <form>\n    <label for="nm">お名前</label>\n    <input id="nm" name="name" autocomplete="name">\n    <label for="ml">メールアドレス</label>\n    <input id="ml" type="email" name="mail">\n    <fieldset>\n      <legend>相談したい内容</legend>\n      <label class="opt"><input type="radio" name="k" checked> 家族・相続</label>\n      <label class="opt"><input type="radio" name="k"> 仕事・お金</label>\n    </fieldset>\n    <button class="btn" type="submit">申し込む</button>\n  </form>\n</main>\n<footer class="ft"><small>© さくら相談室</small></footer>',
      div: '<div class="hd"><div class="logo">さくら相談室</div></div>\n<div class="mn">\n  <div class="h1">無料相談の申込み</div>\n  <div class="lb">お名前</div>\n  <input placeholder="山田 太郎">\n  <div class="lb">メールアドレス</div>\n  <input placeholder="you@example.com">\n  <div class="lg">相談したい内容</div>\n  <div><span class="opt">○ 家族・相続</span><span class="opt">○ 仕事・お金</span></div>\n  <div class="btn" onclick="send()">申し込む</div>\n</div>\n<div class="ft">© さくら相談室</div>' },
  ];
  const NATIVE = 'a[href],button:not([disabled]),input:not([type=hidden]),select,textarea,summary,[tabindex]:not([tabindex="-1"])';
  const txt = (n) => (n.textContent || '').replace(/\s+/g, ' ').trim();
  function accName(n, doc) {
    const aria = n.getAttribute('aria-label'); if (aria) return { name: aria, ok: true };
    if (n.id) { const l = doc.querySelector(`label[for="${n.id}"]`); if (l) return { name: txt(l), ok: true }; }
    const w = n.closest('label'); if (w) { const t = txt(w); if (t) return { name: t, ok: true }; }
    const ph = n.getAttribute('placeholder'); if (ph) return { name: ph, ok: false, ph: true };
    return { name: '', ok: false };
  }
  function analyze(html) {
    const doc = new DOMParser().parseFromString('<body>' + html + '</body>', 'text/html'), b = doc.body;
    const LM = [['header', 'バナー'], ['nav', 'ナビゲーション'], ['main', 'メイン'], ['aside', '補足'], ['footer', 'フッター情報'], ['form', 'フォーム']];
    const landmarks = []; LM.forEach(([tg, jp]) => b.querySelectorAll(tg).forEach(() => landmarks.push(jp)));
    const headings = [...b.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((x) => ({ lv: +x.tagName[1], text: txt(x) }));
    const radios = new Set();
    const tab = [...b.querySelectorAll(NATIVE)].filter((x) => { if (x.type === 'radio') { if (radios.has(x.name)) return false; radios.add(x.name); } return true; });
    const clickOnly = [...b.querySelectorAll('[onclick]')].filter((x) => !x.matches(NATIVE));
    const inputs = [...b.querySelectorAll('input:not([type=hidden]),select,textarea')].map((x) => Object.assign({ el: x }, accName(x, doc)));
    // 読み上げ台本（文書順）
    const script = [];
    const walk = (n) => {
      [...n.childNodes].forEach((c) => {
        if (c.nodeType === 3) { const t = c.textContent.replace(/\s+/g, ' ').trim(); if (t) script.push({ role: '', text: t }); return; }
        if (c.nodeType !== 1) return;
        const tg = c.tagName.toLowerCase();
        if (tg === 'header') { script.push({ role: 'バナー', text: '' }); walk(c); return; }
        if (tg === 'nav') { script.push({ role: 'ナビ', text: '' }); walk(c); return; }
        if (tg === 'main') { script.push({ role: 'メイン', text: '' }); walk(c); return; }
        if (tg === 'aside') { script.push({ role: '補足', text: '' }); walk(c); return; }
        if (tg === 'footer') { script.push({ role: 'フッター', text: '' }); walk(c); return; }
        if (/^h[1-6]$/.test(tg)) { script.push({ role: '見出し' + tg[1], text: txt(c) }); return; }
        if (tg === 'a' && c.hasAttribute('href')) { script.push({ role: 'リンク', text: txt(c) }); return; }
        if (tg === 'button') { script.push({ role: 'ボタン', text: txt(c) }); return; }
        if (tg === 'input') { const a = accName(c, doc); script.push({ role: c.type === 'radio' ? 'ラジオ' : '入力欄', text: a.ok ? a.name : '（名前なし）', bad: !a.ok }); return; }
        if (tg === 'label' && c.querySelector('input')) { walk(c); return; }
        if (tg === 'label') { return; }
        if (c.matches('[onclick]')) { script.push({ role: '（文字）', text: txt(c), x: true }); return; }
        if (tg === 'li') { script.push({ role: '項目', text: txt(c) }); return; }
        if (tg === 'legend') { script.push({ role: 'グループ', text: txt(c) }); return; }
        if (/^(p|div|span|small|section|article|form|fieldset|ol|ul|time)$/.test(tg) && c.children.length) { walk(c); return; }
        const t = txt(c); if (t) script.push({ role: '', text: t });
      });
    };
    walk(b);
    const main = b.querySelector('main');
    const total = txt(b).length, mainLen = main ? txt(main).length : 0;
    const desc = main ? txt(main.querySelector('p') || main) : txt(b);
    return { landmarks, headings, tab, clickOnly, inputs, script, main: !!main, share: total ? Math.round((mainLen / total) * 100) : 0, desc, flat: txt(b), h1: (headings.find((x) => x.lv === 1) || {}).text || '' };
  }

  function semanticScene(el) {
    const I = K.W.icon;
    const st = { sc: 0, mode: 'div', tabI: -1 };
    const AN = AN_SC.map((s) => ({ div: analyze(s.div), sem: analyze(s.sem) }));
    const tabsEl = h('div', { class: 'an-tabs' });
    const story = h('div', { class: 'an-story' });
    const prev = h('iframe', { class: 'an-prev', sandbox: 'allow-same-origin', title: 'ページ' });
    const say = h('div', { class: 'say' }), modeEl = h('div', { class: 'an-mode' });
    const cards = h('div', { class: 'an-cards' }), score = h('div', { class: 'an-score' });
    const codeBox = h('div', { style: { marginTop: '10px' } });

    const tabBtn = h('button', { class: 'btn', onclick: () => stepTab() }, I('keyboard'), 'Tab キーを押す');
    const readBtn = h('button', { class: 'btn', onclick: () => draw(true) }, I('volume-2'), '読み上げを聞く');
    function mark() { // Tab 順の番号を画面に表示
      const d = prev.contentDocument; if (!d) return;
      const s = AN_SC[st.sc], doc = d.body;
      doc.querySelectorAll('[data-kn],[data-kx]').forEach((x) => { x.removeAttribute('data-kn'); x.removeAttribute('data-kx'); x.classList.remove('cur'); });
      const radios = new Set(); let n = 0;
      doc.querySelectorAll(NATIVE).forEach((x) => { if (x.type === 'radio') { if (radios.has(x.name)) return; radios.add(x.name); } n++; x.setAttribute('data-kn', String(n)); });
      doc.querySelectorAll('[data-onclick]').forEach((x) => { if (!x.matches(NATIVE)) x.setAttribute('data-kx', '1'); });
      st.tabN = n;
    }
    function stepTab() {
      const d = prev.contentDocument; if (!d) return;
      const a = AN[st.sc][st.mode];
      if (!a.tab.length) { say.className = 'say bad'; say.textContent = 'Tab を押しても、どこにも止まらない…（×印は、クリックしか受け付けない部品）'; return; }
      st.tabI = (st.tabI + 1) % (a.tab.length + 1);
      d.querySelectorAll('.cur').forEach((x) => x.classList.remove('cur'));
      if (st.tabI === a.tab.length) { say.className = 'say'; say.textContent = '一周しました。最初に戻る'; return; }
      const e = d.querySelector(`[data-kn="${st.tabI + 1}"]`); if (e) { e.classList.add('cur'); e.scrollIntoView({ block: 'nearest' }); }
      const t = a.tab[st.tabI]; const nm = t.matches('input') ? (accName(t, new DOMParser().parseFromString('<body>' + AN_SC[st.sc][st.mode] + '</body>', 'text/html')).name || '名前なし') : txt(t);
      say.className = 'say ok'; say.textContent = `Tab ${st.tabI + 1} 回目：${nm || '（名前なし）'}`;
    }
    function load() {
      const s = AN_SC[st.sc];
      prev.onload = () => { mark(); };
      prev.srcdoc = `<!doctype html><meta charset="utf-8"><title>${s.title}</title><style>${AN_CSS}</style><body>${s[st.mode].replace(/ onclick=/g, ' data-onclick=')}</body>`;
    }
    function draw(speak) {
      const s = AN_SC[st.sc], A = AN[st.sc][st.mode], isD = st.mode === 'div';
      tabsEl.replaceChildren(...AN_SC.map((x, i) => h('button', { class: 'an-tab' + (i === st.sc ? ' on' : ''), style: { '--c': x.c }, onclick: () => { st.sc = i; st.tabI = -1; say.textContent = ''; say.className = 'say'; load(); draw(); } }, I(x.ic), x.t)));
      story.replaceChildren(I('triangle-alert'), h('div', { html: s.story }));
      modeEl.replaceChildren(
        h('button', { class: 'div' + (isD ? ' on' : ''), onclick: () => { st.mode = 'div'; st.tabI = -1; say.textContent = ''; say.className = 'say'; load(); draw(); } }, 'div だけで作った'),
        h('button', { class: 'sem' + (!isD ? ' on' : ''), onclick: () => { st.mode = 'sem'; st.tabI = -1; say.textContent = ''; say.className = 'say'; load(); draw(); } }, '意味のあるタグで作った'));
      codeBox.replaceChildren(code(s[st.mode], 'html', { file: 'index.html', color: isD ? 'var(--bad)' : 'var(--ok)' }));
      // --- 読み上げ ---
      const lm = A.landmarks.length ? h('div', { class: 'an-lm' }, A.landmarks.map((x) => h('span', x))) : h('div', { class: 'an-none' }, I('circle-x'), 'ジャンプ先が 0 個（上から全部読むしかない）');
      const outline = A.headings.length ? h('div', { class: 'an-ol' }, A.headings.map((x) => h('div', { class: 'h' + Math.min(3, x.lv) }, h('span', { class: 'lv' }, 'H' + x.lv), x.text))) : h('div', { class: 'an-none' }, I('circle-x'), '見出しが 0 個（飛んで読めない）');
      const lines = A.script.slice(0, 14);
      const read = h('div', { class: 'an-read' }, lines.map((l, i) => h('div', { style: { animationDelay: (speak ? i * 0.12 : 0) + 's' } }, h('span', { class: 'rl' + (l.x || l.bad ? ' x' : l.role ? '' : ' n') }, l.role || '文字'), h('span', l.text))));
      const c1 = h('div', { class: 'an-card', style: { '--c': 'var(--ts)' } }, h('h4', I('volume-2'), '読み上げ（スクリーンリーダー）', h('small', '目の不自由な人・運転中の人も使う')), h('div', { class: 'label' }, 'ジャンプできる場所（ランドマーク）'), lm, h('div', { class: 'label' }, '見出しの一覧（これで飛べる）'), outline, h('div', { class: 'label' }, '読み上げの台本（先頭から）'), read);
      // --- 検索 ---
      const snip = isD ? A.flat.slice(0, 70) : A.desc.slice(0, 70);
      const c2 = h('div', { class: 'an-card', style: { '--c': 'var(--vue)' } }, h('h4', I('search'), '検索エンジン', h('small', 'ロボットが読んで、検索結果の説明文にする')),
        h('div', { class: 'an-serp' }, h('div', { class: 'u' }, 'sakura.example › ' + s.k), h('div', { class: 't' }, s.title), h('div', { class: 'd' + (isD ? ' bad' : '') }, isD ? [h('mark', snip), '…'] : snip + '…')),
        h('div', { class: 'an-none', style: { color: isD ? 'var(--bad)' : 'var(--ok)' } }, I(isD ? 'circle-x' : 'circle-check'), isD ? `本文がどこか分からず、先頭の文字（メニュー等）を拾う。h1：${A.h1 ? A.h1 : 'なし'}` : `<main> の本文だけを拾えた（本文は全体の ${A.share}%）。h1：${A.h1}`));
      // --- 目次 ---
      const toc = A.headings.filter((x) => x.lv >= 2);
      const c3 = h('div', { class: 'an-card', style: { '--c': 'var(--basic)' } }, h('h4', I('list-tree'), '自動の目次', h('small', '見出しタグがあれば、ツールが作ってくれる')),
        toc.length ? h('div', { class: 'an-toc' }, toc.map((x) => h('div', { style: { '--i': x.lv - 2 } }, h('a', x.text)))) : h('div', { class: 'an-none' }, I('circle-x'), s.k === 'form' ? 'このページに目次は要らないが、見出し（h1）がないと「何のページか」も伝わらない' : '見出しが無いので目次を作れない。手で書き続けることになる'));
      // --- キーボード ---
      const nTab = A.tab.length, nGoal = AN[st.sc].sem.tab.length;
      const c4 = h('div', { class: 'an-card', style: { '--c': 'var(--pink)' } }, h('h4', I('keyboard'), 'キーボード（Tab キー）', h('small', 'マウスを使えない人・手が離せない人')),
        h('div', { class: 'an-none', style: { color: nTab >= nGoal ? 'var(--ok)' : 'var(--bad)' } }, I(nTab >= nGoal ? 'circle-check' : 'circle-x'), `Tab で届く操作：${nTab} / ${nGoal}　`, h('span', { style: { color: 'var(--mute)', fontWeight: 600 } }, A.clickOnly.length ? `（画面の × の ${A.clickOnly.length} か所は届かない）` : '（左の青い番号の順に止まる）')));
      cards.replaceChildren(c1, c2, c3, c4);
      // --- スコア ---
      const D = AN[st.sc].div, S = AN[st.sc].sem;
      const row = (lbl2, d, sm, k) => h('tr', null, h('td', { class: 'k' }, lbl2), h('td', { class: 'd' }, d), h('td', { class: 's' }, sm));
      const okIn = (a) => a.inputs.length ? `${a.inputs.filter((x) => x.ok).length} / ${a.inputs.length}` : '—';
      score.replaceChildren(h('div', { class: 'an-hd', style: { '--c': 'var(--ok)' } }, I('scale'), 'ロボットに伝わる情報（見た目は同じなのに）'),
        h('table', null, h('thead', null, h('tr', null, h('th', '項目'), h('th', 'div だけ'), h('th', '意味のあるタグ'))), h('tbody', null,
          row('ジャンプできる場所', D.landmarks.length + ' 個', S.landmarks.length + ' 個'),
          row('見出し（飛べる・目次になる）', D.headings.length + ' 個', S.headings.length + ' 個'),
          row('Tab で届く操作', `${D.tab.length} / ${S.tab.length}`, `${S.tab.length} / ${S.tab.length}`),
          row('名前が読める入力欄', okIn(D), okIn(S)),
          row('本文（main）を特定', D.main ? 'できる' : 'できない', S.main ? 'できる' : 'できない'))));
    }
    el.append(tabsEl, story, h('div', { class: 'an-grid' },
      h('div', { class: 'an-pane' }, h('div', { class: 'an-hd', style: { '--c': 'var(--ts)' } }, I('monitor'), '見た目（どちらも同じ）', h('small', '青い番号 = Tab の順番')), modeEl, prev,
        h('div', { class: 'an-bar' }, tabBtn, readBtn, say), h('div', { style: { padding: '0 12px 12px' } }, codeBox)),
      cards), score);
    load(); draw();
  }

  K.reg({
    id: 'html', track: 'basic', title: 'HTML', sub: 'ページの骨組みをつくる', emoji: '🧱',
    scenes: [
      {
        t: 'HTML・CSS・JS の役割', lead: 'Webページは3つの技術の<b>チームプレー</b>。1つずつ足して、同じページがどう変わるか見てみよう。',
        render(el) {
          const html = code('<h1>こんにちは、研修！</h1>\n<p>はじめてのWebページ</p>\n<button id="b">👍 0</button>', 'html', { file: 'index.html', color: 'var(--basic)' });
          const css = code('h1 {\n  font-size: 2.1rem;\n  color: hotpink;\n}\nbutton { border-radius: 6px; }', 'css', { file: 'style.css', color: 'var(--ts)' });
          const js = code('const b = document.getElementById("b");\nlet n = 0;\nb.onclick = () => {\n  n++;\n  b.textContent = `👍 ${n}`;\n};', 'js', { file: 'main.js', color: 'var(--vue)' });
          const fc = h('div', { class: 'fold' }, h('div', { style: { paddingTop: '10px' } }, css));
          const fj = h('div', { class: 'fold' }, h('div', { style: { paddingTop: '10px' } }, js));
          const page = h('div', { class: 'page' }, h('h1', 'こんにちは、研修！'), h('p', 'はじめてのWebページ'), h('button', { id: 'b' }, '👍 0'));
          let n = 0, live = false;
          const btn = page.querySelector('button');
          btn.onclick = () => { if (!live) return; n++; btn.textContent = '👍 ' + n; btn.animate([{ transform: 'scale(1.4)' }, { transform: 'scale(1)' }], { duration: 250 }); };
          const mock = h('div', { class: 'mock' }, h('div', { class: 'bar' }, h('i'), h('i'), h('i'), h('span', 'localhost / index.html')), page);
          el.append(stepper({
            color: 'var(--basic)',
            steps: [
              { say: '<b>HTML</b> だけ：見出し・文章・ボタンという「中身と構造」。見た目はブラウザ任せ。' },
              { say: '<b>CSS</b> を足す：同じHTMLなのに、色・形・フォントが一気に変わった！' },
              { say: '<b>JavaScript</b> を足す：ボタンを押してみて 👆 クリックに反応する“動き”が付いた。' },
            ],
            init(vis) { vis.append(h('div', { class: 'split' }, h('div', null, html, fc, fj), mock)); },
            update(i) {
              fc.classList.toggle('open', i >= 1); fj.classList.toggle('open', i >= 2);
              page.classList.toggle('css', i >= 1); page.classList.toggle('js', i >= 2);
              live = i >= 2; btn.style.cursor = live ? 'pointer' : 'default';
              if (i === 2) btn.classList.add('pulse'); else btn.classList.remove('pulse');
              if (i < 2) { n = 0; btn.textContent = '👍 0'; }
            },
          }));
        },
      },
      {
        t: 'タグの解剖', lead: '予約ボタンのリンク1つで、パーツの名前を覚えよう。<b>ホバー / クリック</b>で光ります。その下で、わざと書き間違えて<b>画面がどうなるか</b>も見てみよう。',
        render(el) {
          const box = h('div', { class: 'anat' });
          const toks = anat.map((t) => h('span', { class: 'tk', html: K.W.esc(t.s) }));
          box.append(...toks);
          const info = h('div', { class: 'st-cap', style: { marginTop: '14px' } }, 'パーツにカーソルを乗せてね');
          const parts = h('div', { class: 'parts' });
          const lit = (key) => {
            const [name, color, desc] = key ? partInfo[key] : [];
            box.classList.toggle('dim', !!key);
            toks.forEach((tk, i) => {
              let on = false;
              if (key === 'el') on = true; else if (key) on = anat[i].p.includes(key);
              tk.classList.toggle('lit', on); tk.style.setProperty('--pc', color || 'var(--ts)');
            });
            parts.querySelectorAll('button').forEach((b) => b.classList.toggle('lit', b.dataset.k === key));
            info.innerHTML = key ? `<b>${name}</b>：${desc}` : 'パーツにカーソルを乗せてね';
          };
          Object.entries(partInfo).forEach(([k, [n, c]]) => parts.append(h('button', { 'data-k': k, style: { '--pc': c }, onmouseenter: () => lit(k), onfocus: () => lit(k), onclick: () => lit(k) }, n)));
          toks.forEach((tk, i) => tk.addEventListener('mouseenter', () => { const k = anat[i].p[anat[i].p.length - 1 === 0 ? 0 : 0]; lit(({ name: 'start', name2: 'end' })[k] || k); }));
          box.addEventListener('mouseleave', () => lit(null));
          el.append(box, parts, info);
          /* 壊してみよう：書き間違いが、画面でどうなるか */
          const BR = [
            { t: '正しく書く', src: '<a href="/reserve">予約する</a>\n<p>初回30分は無料です。</p>', cap: '予約するは<b>リンク</b>になり、押すと予約ページへ。Tab キーでも選べる。', ok: 1 },
            { t: '閉じタグを忘れる', src: '<a href="/reserve">予約する\n<p>初回30分は無料です。</p>', cap: 'エラーは出ない。でも下の文章まで<b>全部リンクになる</b>（青い下線）。押すつもりのない所も予約ページへ飛ぶ。' },
            { t: 'href を書かない', src: '<a>予約する</a>\n<p>初回30分は無料です。</p>', cap: '見た目は文字のまま。<b>押しても何も起きない</b>。Tab キーでも止まらず、読み上げも「リンク」と言わない。' },
            { t: '属性名の打ち間違い', src: '<a hrf="/reserve">予約する</a>\n<p>初回30分は無料です。</p>', cap: '<code>href</code> を <code>hrf</code> と打つと、ブラウザは<b>黙って無視</b>。エラーも出ないので、気づくまでに時間がかかる。' },
            { t: '"" を忘れる', src: '<a href="/reserve>予約する</a>\n<p>初回30分は無料です。</p>', cap: '属性値の閉じ <code>"</code> が無いと、<b>以降の文字が全部、値の一部</b>に。予約するが消えて、リンクも壊れる。' },
          ];
          const bsrc = h('pre', { class: 'br-src' }), bcap = h('div', { class: 'br-cap' });
          const bprev = h('iframe', { class: 'br-prev', sandbox: 'allow-same-origin', title: '結果' });
          const bbtns = BR.map((b, i) => h('button', { class: 'tr2-chip' + (i === 0 ? ' on' : ''), onclick: () => showBr(i) }, b.t));
          function showBr(i) {
            const b = BR[i]; bbtns.forEach((x, k) => x.classList.toggle('on', k === i));
            bsrc.textContent = b.src; bcap.className = 'br-cap' + (b.ok ? ' ok' : ' bad'); bcap.innerHTML = b.cap;
            bprev.srcdoc = '<meta charset="utf-8"><style>body{font:14px/1.7 system-ui,sans-serif;margin:12px;color:#223}a{color:#1f5fbf}</style>' + b.src;
          }
          showBr(0);
          el.append(h('div', { class: 'tr2-use', style: { marginTop: '18px', '--c': 'var(--bad)' } }, h('h4', K.W.icon('triangle-alert'), '壊してみよう：書き間違いは、画面でどうなる？'),
            h('p', { html: 'HTML は間違えても<b>エラーを出さず</b>、静かに壊れます。だから「どこが何か」を知っておくのが大事。' }),
            h('div', { class: 'tr2-sel' }, bbtns),
            h('div', { class: 'br-grid' }, bsrc, bprev), bcap));
        },
      },
      {
        t: 'HTML は「木」', tag: 'DOM', lead: 'ブラウザはHTMLを読んで<b>木構造（DOMツリー）</b>に変換します。<b>ページの部品</b>と<b>木の枝</b>は1対1。カーソルを乗せると、どちらでも相手が光ります。',
        render: treeScene,
      },
      {
        t: 'ページの骨組み', lead: 'ほとんどのサイトはこの形。「次へ」で組み立て、<b>色の付いた部品にカーソル</b>を乗せるとコードが光ります。',
        render(el) {
          const src = '<body>\n  <header>サイトヘッダー</header>\n  <main>\n    <article>メインコンテンツ</article>\n    <aside>サブコンテンツ</aside>\n  </main>\n  <footer>フッター</footer>\n</body>';
          const pre = code(src, 'html', { dim: true, color: 'var(--basic)' });
          const R = (cls, text, color, lines) => { const e = h('div', { class: 'rg ' + cls, style: { '--rc': color } }, text); e.lines = lines; return e; };
          const rh = R('', '<header>', 'var(--ts)', [2]), ra = R('', '<article>', 'var(--basic)', [4]), rs = R('', '<aside>', 'var(--team)', [5]), rf = R('', '<footer>', 'var(--pink)', [7]);
          const mw = h('div', { class: 'mainwrap', style: { '--rc': 'var(--vue)' } }, h('b', '<main>'), h('div', { class: 'mainrow' }, ra, rs));
          mw.lines = [3, 6];
          const wph = h('div', { class: 'wph' }, K.W.icon('layout-template'), '<body> はまだ空っぽ', h('small', { style: { fontWeight: 500, color: 'var(--mute)' } }, '「次へ」で部品を置いていこう'));
          const wire = h('div', { class: 'wire' }, rh, mw, rf, wph);
          const stepLines = [[1, 8], [2], [3, 6], [4, 5], [7]];
          const stepShow = [[], [rh], [rh, mw], [rh, mw, ra, rs], [rh, mw, ra, rs, rf]];
          let cur = 0;
          const base = () => { const n = cur; const ls = []; for (let i = 0; i <= n; i++) ls.push(...stepLines[i]); pre.setHi(ls); };
          [rh, ra, rs, rf, mw].forEach((r) => {
            r.addEventListener('mouseenter', () => { r.classList.add('hov'); pre.setHi(r.lines.concat([1, 8]), 'on'); });
            r.addEventListener('mouseleave', () => { r.classList.remove('hov'); base(); });
          });
          el.append(stepper({
            color: 'var(--basic)',
            steps: [
              { say: 'まずは空の <b>&lt;body&gt;</b>。画面に見える部分は全部この中に入る。' },
              { say: '<b>&lt;header&gt;</b>：サイトの顔。ロゴやナビゲーションを置く場所。' },
              { say: '<b>&lt;main&gt;</b>：そのページの主役エリア（1ページに1つ）。' },
              { say: '中には <b>&lt;article&gt;</b>（本文）と <b>&lt;aside&gt;</b>（補足）。意味のあるタグを選ぶと、読み上げソフトやGoogleにも優しい。' },
              { say: '<b>&lt;footer&gt;</b>：ページの足元。著作権やリンク集。完成！' },
            ],
            init(vis) { vis.append(h('div', { class: 'split' }, pre, wire)); },
            update(n) { cur = n; wire.classList.toggle('has', n >= 1); stepShow.flat().forEach((e) => e.classList.remove('show')); stepShow[n].forEach((e) => e.classList.add('show')); base(); },
          }));
        },
      },
      {
        t: 'よく使うタグ図鑑', lead: 'カードを<b>クリック</b>して、ページに部品を積み上げよう。右の「結果」と左下のHTMLが同時に増えていきます。',
        render(el) {
          const svg = "data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="70"><defs><linearGradient id="g"><stop stop-color="#ff6b9d"/><stop offset="1" stop-color="#5b9dff"/></linearGradient></defs><rect width="120" height="70" rx="6" fill="url(#g)"/><text x="60" y="42" text-anchor="middle" fill="#fff" font-size="22" font-family="sans-serif">img</text></svg>');
          const Z = [
            ['h1', '見出し', '<h1>オンライン相談のご案内</h1>', 'var(--ts)', 'ページの題名。<b>1ページに1つ</b>。検索結果のタイトルや読み上げのジャンプ先になる'],
            ['p', '段落', '<p>初回30分は無料。自宅からビデオ通話で相談できます。</p>', 'var(--basic)', '文章のまとまり。改行ではなく<b>段落</b>で区切ると、読み上げも自然に区切る'],
            ['a', 'リンク', '<a href="#">料金を見る</a>', 'var(--pink)', '別ページへ移動。<b>href が無いと、ただの文字</b>。Tab キーでも選べる'],
            ['img', '画像', `<img src="${svg}" alt="相談室の外観">`, 'var(--violet)', '<b>alt（代わりの文章）</b>が必須。読み上げ・画像が出ない時・検索に効く'],
            ['ul', 'リスト', '<ul><li>初回30分は無料</li><li>ビデオ通話OK</li><li>土日も対応</li></ul>', 'var(--team)', '特長・メニューの並び。読み上げが<b>「リスト 3項目」</b>と数を教える'],
            ['table', '表', '<table><tr><th>相談時間</th><th>料金</th></tr><tr><td>30分</td><td>5,500円</td></tr></table>', 'var(--vue)', '縦横の<b>データ</b>用（レイアウトには使わない）。見出しセル th で意味が伝わる'],
            ['button', 'ボタン', '<button>予約する</button>', 'var(--ts)', '押して<b>何かを実行</b>（送信・開く）。リンクとは役目がちがう。Tab・Enter で使える'],
            ['input', '入力欄', '<input type="text" placeholder="お名前">', 'var(--basic)', 'ユーザーの入力。本当は <b>label とセット</b>にするのが正解（フォームの回で）'],
          ];
          const stage = h('div', { class: 'stage' });
          const cd = h('div');
          const list = [];
          const redraw = () => { cd.replaceChildren(code(list.length ? list.map((i) => Z[i][2].replace(/src="data:[^"]+"/, 'src="photo.png"')).join('\n') : '<!-- ここにHTMLが増えていく -->', 'html', { file: 'index.html', color: 'var(--basic)' })); };
          const useBox = h('div', { class: 'st-cap', style: { minHeight: '3.2em' } }, 'カードを押すと、そのタグを使う場面が出ます');
          const zoo = h('div', { class: 'zoo' }, Z.map(([t, jp, , c], i) => h('button', { style: { '--c': c }, onclick: () => {
            list.push(i); useBox.innerHTML = '<b>&lt;' + t + '&gt; の使いどころ</b>：' + Z[i][4];
            const pc = h('div', { class: 'pc' }, h('em', '<' + t + '>'));
            pc.insertAdjacentHTML('beforeend', Z[i][2]);
            stage.append(pc); redraw(); requestAnimationFrame(() => stage.scrollTo({ top: stage.scrollHeight, behavior: 'smooth' }));
          } }, h('b', '<' + t + '>'), h('small', jp))));
          const clr = h('button', { class: 'btn ghost', style: { justifySelf: 'start' }, onclick: () => { list.length = 0; stage.replaceChildren(); redraw(); } }, K.W.icon('trash-2'), 'クリア');
          cd.style.cssText = 'display:flex;flex-direction:column;flex:1;min-height:0';
          el.append(h('div', { class: 'split tagzoo' },
            h('div', { class: 'col' }, lbl('タグを選ぶ（クリックで追加）'), zoo, useBox, h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, h('span', { style: { color: 'var(--mute)', fontSize: '.875rem', fontWeight: 700 } }, '積み上げたタグ → 右の結果と下のHTMLにも出る'), clr), lbl('できあがる HTML'), cd),
            h('div', { class: 'col' }, lbl('結果'), stage)));
          redraw();
        },
      },
      { t: 'リスト：ul / ol / dl', tag: 'list', lead: '種類を切り替えて、<b>見た目とコード</b>の違いを確かめよう。項目の追加・削除・入れ子もできます。', render: listScene },
      {
        t: 'フォーム：データを送る', tag: 'form', lead: '相談の申込フォームを作りながら、<b>label・type・name</b> の3つを付けたり外したりして、実際に何が困るのか確かめよう。<b>送信</b>で封筒が飛びます。',
        render(el) {
          const I = K.W.icon;
          const st = { label: true, email: true, name: true };
          const data = { name: '', email: '', topic: '' };
          const FIELDS = [['name', 'お名前', 'text', '山田 太郎'], ['email', 'メールアドレス', 'email', 'you@example.com'], ['topic', 'ご相談内容', 'text', '例：賃貸の退去費用について']];
          const fmBox = h('div'), out = h('pre'), codeBox = h('div'), warn = h('div', { class: 'st-cap', style: { minHeight: '3.2em', marginTop: '12px' } });
          const srv = h('div', { class: 'srv' }, h('div', h('div', { style: { marginBottom: '6px' } }, I('server', { size: '2rem' })), h('b', 'サーバー'), out));
          const env = h('div', { class: 'env' }, I('mail', { size: '1.6rem' }));
          const grid = h('div', { class: 'fgrid' }, fmBox, h('div'), srv, env);
          const reqLine = h('div', { class: 'st-cap', style: { marginTop: '14px' } });
          const tog = (key, on, off, ic) => { const b = h('button', { class: 'tr2-chip', onclick: () => { st[key] = !st[key]; build(); } }); b.__t = { key, on, off, ic }; return b; };
          const tgs = [tog('label', 'label を付けた', 'label を付けない'), tog('email', 'type="email"', 'type="text"'), tog('name', 'name を付けた', 'name を付けない')];
          const tgBar = h('div', { class: 'tr2-sel', style: { margin: '6px 0 12px' } }, tgs);
          function show() {
            const sent = FIELDS.filter(([k]) => k !== 'name' || st.name).map(([k]) => k + '=' + encodeURIComponent(data[k]));
            const lost = !st.name ? ['お名前（name が無いので届かない）'] : [];
            out.textContent = 'POST /apply\n\n' + sent.join('&') + (lost.length ? '\n\n× ' + lost[0] : '');
          }
          function hint() {
            const em = fmBox.querySelector('input[name=email]');
            if (!em) return;
            const bad = data.email && !em.checkValidity();
            warn.className = 'st-cap' + (bad ? ' bad' : '');
            warn.innerHTML = bad ? '<b>ブラウザが止めてくれる</b>：メールアドレスの形ではありません。送信ボタンを押しても、サーバーには届きません（type="email" のおかげ）。' : (st.email ? '<b>type="email"</b>：メールアドレスの形かどうかを、ブラウザが自動でチェック。「abc」と打ってみよう。' : '<b>type="text"</b>：何を打っても通ってしまう。入力ミスのメールが、そのままサーバーへ。');
          }
          function build() {
            tgs.forEach((b) => { const { key, on, off } = b.__t; b.textContent = st[key] ? on : off; b.classList.toggle('on', st[key]); });
            const fm = h('form', { class: 'fm', onsubmit: (e) => { e.preventDefault(); send(); } },
              FIELDS.map(([k, jp, ty, ph], n) => {
                const id = 'fm-' + k, type = k === 'email' && !st.email ? 'text' : ty;
                const inp = h('input', { type, id, placeholder: ph, value: data[k], oninput: (e) => { data[k] = e.target.value; show(); hint(); } });
                if (st.name || k !== 'name') inp.name = k;
                return st.label ? h('label', { for: id }, jp, h('small', `for="${id}"`), inp) : h('div', { class: 'lb2' }, jp, h('small', 'label なし'), inp);
              }),
              h('button', { class: 'btn primary', type: 'submit', style: { justifyContent: 'center' } }, '送信 (submit)'));
            fmBox.replaceChildren(fm);
            const lines = ['<form action="/apply" method="POST">'];
            FIELDS.forEach(([k, jp, ty]) => {
              const type = k === 'email' && !st.email ? 'text' : ty, nm = st.name || k !== 'name' ? ` name="${k}"` : '';
              if (st.label) lines.push(`  <label for="fm-${k}">${jp}</label>`);
              else lines.push(`  <div>${jp}</div>`);
              lines.push(`  <input type="${type}" id="fm-${k}"${nm}>`);
            });
            lines.push('  <button type="submit">送信</button>', '</form>');
            codeBox.replaceChildren(code(lines.join('\n'), 'html', { file: 'apply.html', color: 'var(--basic)' }));
            show(); hint();
            reqLine.innerHTML = st.label ? '<b>label</b>：項目名の文字を押しても、入力欄が選ばれる（スマホで特に大事）。読み上げも「お名前、入力欄」と名前を言える。' : '<b>label なし</b>：「お名前」の文字を押しても何も起きない。読み上げは「入力欄」としか言えない。';
          }
          async function send() {
            const a = fmBox.getBoundingClientRect(), b = srv.getBoundingClientRect(), g = grid.getBoundingClientRect();
            env.style.opacity = 1;
            await env.animate([{ transform: `translate(${a.width - 30}px,0) scale(.6)`, opacity: 0 }, { transform: `translate(${a.width}px,-30px) scale(1.2)`, opacity: 1, offset: .3 }, { transform: `translate(${b.left - g.left}px,-10px) scale(.8)`, opacity: 1 }], { duration: 900, easing: 'ease-in-out' }).finished;
            env.style.opacity = 0; srv.classList.add('got');
            reqLine.innerHTML = st.name ? '<b>name 属性</b>がキー、入力値がバリューになってサーバーに届きました。' : '<b>name が無い項目は、お名前の欄に書いても届きません</b>。画面では入力できているのに、データが空になる、よくある事故です。';
            setTimeout(() => srv.classList.remove('got'), 1400);
          }
          el.append(h('div', { class: 'label' }, '3つのスイッチで、書き方を変えてみよう'), tgBar, grid, warn, reqLine, codeBox);
          build();
        },
      },
      { t: '作ってみよう：企画と公開', tag: 'PROJECT', lead: 'スライドの「簡単なWebサイトを作ってみよう」。左を埋めると、右に<b>企画書サイト</b>が育ちます。', render: planProject },
      {
        t: '実践：自己紹介ページ', tag: 'PRACTICE', lead: '右のプレビューを見ながら、<b>3か所</b>だけ書き足そう（目安 5分）。✓が3つ付いたらクリア！',
        hint: '<p>慣れてきたら、こんなものも足してみよう（ミッションには入っていません）。</p><ul style="line-height:1.9"><li>画像：<code>&lt;img src="…" alt="説明"&gt;</code>（alt は必ず書く）</li><li>表：<code>&lt;table&gt;&lt;tr&gt;&lt;th&gt;…&lt;/th&gt;&lt;/tr&gt;&lt;/table&gt;</code></li><li>見出しの下に <code>&lt;h2&gt;</code> をもう1つ</li></ul><p style="color:var(--mute);font-size:.875rem">チャレンジは3段階（初級・中級・上級）。中級はフォーム、上級はページ内ジャンプ。</p>',
        render(el) {
          el.append(playground({
            title: 'HTML', mode: 'web',
            solution: { 'index.html': '<!-- 自己紹介ページ（答えの一例） -->\n<h1>私の自己紹介</h1>\n<p>はじめまして！</p>\n<p>趣味はコードを書くことです。</p>\n\n<h2>好きなもの</h2>\n<ul>\n  <li>好きな色: 青</li>\n  <li>好きな食べ物: ラーメン</li>\n  <li>趣味: コード</li>\n</ul>\n\n<h2>リンク</h2>\n<a href="https://github.com/">研修リポジトリ</a>\n\n<!-- 任意チャレンジ：画像と表 -->\n<img src="https://placehold.co/160x100" alt="好きな風景">\n<table border="1">\n  <tr><th>曜日</th><th>予定</th></tr>\n  <tr><td>月</td><td>HTML / CSS</td></tr>\n</table>\n\n<!-- 中級：フォーム -->\n<form action="/signup" method="POST">\n  <label for="nick">ニックネーム</label>\n  <input type="text" id="nick" name="nick">\n  <button type="submit">送信</button>\n</form>\n\n<!-- 上級：ページ内ジャンプ -->\n<nav>\n  <a href="#likes">好きなもの</a>\n  <a href="#links">リンク</a>\n</nav>\n<h2 id="likes">好きなもの（ジャンプ先）</h2>\n<h2 id="links">リンク（ジャンプ先）</h2>\n' },
            files: [{ name: 'index.html', lang: 'html', code: '<!-- 自己紹介ページを完成させよう -->\n<h1>私の自己紹介</h1>\n<p>はじめまして！</p>\n\n<!-- ① 段落をもう1つ。趣味などを <p> と </p> ではさんで書く -->\n\n\n<h2>好きなもの</h2>\n<!-- ② リスト：<ul> の中に <li>…</li> を3つ -->\n<ul>\n\n</ul>\n\n<h2>リンク</h2>\n<!-- ③ リンク：<a href="https://…">文字</a> -->\n\n<!-- 任意チャレンジ（初級）：画像（<img>）と表（<table>）\n     中級：フォーム　上級：ページ内ジャンプ -->\n' }],
            tasks: (v, c) => {
              const d = c.doc && c.doc();
              const q = (s) => (d ? d.querySelectorAll(s).length : 0);
              const link = d ? [...d.querySelectorAll('a')].some((a) => (a.getAttribute('href') || '').trim().length > 1) : false;
              return [
                { label: '段落（<p>）が2つ以上ある', ok: q('p') >= 2, hint: ['段落は <code>&lt;p&gt;</code> と <code>&lt;/p&gt;</code> ではさんで書く。①のコメントの下に書こう。', '<code>&lt;p&gt;趣味はコードを書くことです。&lt;/p&gt;</code> のように1行書けば OK。'], answer: { code: '<p>趣味はコードを書くことです。</p>', lang: 'html', mode: 'append' } },
                { label: 'リスト（<ul> か <ol>）に、項目（<li>）が3つ以上ある', ok: q('ul li, ol li') >= 3, hint: ['<code>&lt;ul&gt;</code> の中に、項目ごとに <code>&lt;li&gt;…&lt;/li&gt;</code> を書く。', '<code>&lt;li&gt;</code> を3行。<code>&lt;ul&gt;</code> と <code>&lt;/ul&gt;</code> の「間」に書くよ。'], answer: { code: '<ul>\n  <li>好きな色: 青</li>\n  <li>好きな食べ物: ラーメン</li>\n  <li>趣味: コード</li>\n</ul>', lang: 'html', mode: 'append' } },
                { label: 'リンク（<a href="…">）が1つある', ok: link, hint: ['リンクは <code>&lt;a href="行き先のURL"&gt;表示する文字&lt;/a&gt;</code> の形。', '例：<code>&lt;a href="https://example.com"&gt;リンク&lt;/a&gt;</code>'], answer: { code: '<a href="https://github.com/">研修リポジトリ</a>', lang: 'html', mode: 'append' } },
                { optional: true, level: 1, label: '画像（<img>、alt 付き）と、2行の表（<table>）を足す', ok: (() => { if (!d) return false; const im = [...d.querySelectorAll('img')].some((i) => (i.getAttribute('alt') || '').trim() && (i.getAttribute('src') || '').trim()); const tb = [...d.querySelectorAll('table')].some((t) => t.querySelectorAll('tr').length >= 2 && t.querySelector('tr td, tr th')); return im && tb; })(), hint: ['画像は <code>&lt;img src="画像のURL" alt="説明"&gt;</code>。alt（説明文）を必ず付ける。', '表は <code>&lt;table&gt;</code> の中に、行 <code>&lt;tr&gt;</code> を2つ。行の中は <code>&lt;th&gt;</code>（見出し）や <code>&lt;td&gt;</code>（データ）。'], answer: { code: '<img src="https://placehold.co/160x100" alt="好きな風景">\n<table border="1">\n  <tr><th>曜日</th><th>予定</th></tr>\n  <tr><td>月</td><td>HTML / CSS</td></tr>\n</table>', lang: 'html', mode: 'append' } },
                { optional: true, level: 2, label: 'フォームを作る：<label for> と <input id> をペアにして、送信ボタンも付ける', ok: (() => { if (!d) return false; const fs = [...d.querySelectorAll('form')]; const lab = fs.some((f) => [...f.querySelectorAll('label[for]')].some((l) => { const i = d.getElementById(l.getAttribute('for')); return !!i && f.contains(i) && /^(input|select|textarea)$/i.test(i.tagName); })); const sub = fs.some((f) => f.querySelector('input[type=submit], button:not([type=button]):not([type=reset])')); return lab && sub; })(), hint: ['入れ物は <code>&lt;form&gt;</code>。中に、ラベルと入力欄をペアで置く。', '<code>&lt;label for="nick"&gt;</code> の <code>for</code> と、<code>&lt;input id="nick"&gt;</code> の <code>id</code> を<b>同じ名前</b>にする。最後に <code>&lt;button type="submit"&gt;送信&lt;/button&gt;</code>。'], answer: { code: '<form action="/signup" method="POST">\n  <label for="nick">ニックネーム</label>\n  <input type="text" id="nick" name="nick">\n  <button type="submit">送信</button>\n</form>', lang: 'html', mode: 'append' } },
                { optional: true, level: 3, label: 'ページ内ジャンプ：<nav> にリンク（href="#…"）を2つ作り、飛び先の見出しに id を付ける', ok: (() => { if (!d) return false; const hs = [...d.querySelectorAll('nav a[href^="#"]')].map((a) => a.getAttribute('href')).filter((x) => x.length > 1).filter((x) => { const t = d.getElementById(x.slice(1)); return !!t && /^H[1-6]$/.test(t.tagName); }); return new Set(hs).size >= 2; })(), hint: ['ページの中へ飛ぶリンクは <code>&lt;a href="#名前"&gt;</code>。<code>#</code> が目印。', '飛び先の見出しに <code>id="名前"</code> を付ける（<code>&lt;h2 id="likes"&gt;</code>）。リンクは <code>&lt;nav&gt;</code> でまとめる。'], answer: { code: '<nav>\n  <a href="#likes">好きなもの</a>\n  <a href="#links">リンク</a>\n</nav>\n<h2 id="likes">好きなもの（ジャンプ先）</h2>\n<h2 id="links">リンク（ジャンプ先）</h2>', lang: 'html', mode: 'append' } },
              ];
            },
          }));
        },
      },
    ],
  });

  /* ============================================================
     Q1: 問題 → 考え方 → 解決 (why) / extra demos for intro + html
  ============================================================ */
  style('q1h', `
  .sm-wrap{display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:stretch}
  .sm-tabs{display:flex;gap:6px;margin-bottom:10px}.sm-tab{all:unset;cursor:pointer;padding:.3em 1em;border-radius:8px;font-weight:800;font-size:.85rem;background:var(--card);border:1px solid var(--line);transition:.2s}.sm-tab.on{background:var(--c);border-color:var(--c);color:#fff}
  .sm-page{align-content:stretch!important;display:grid;grid-template-rows:auto auto 1fr auto;gap:6px;padding:10px;border-radius:10px;background:var(--card);border:1px solid var(--line);min-height:200px}
  .sm-r{display:grid;place-items:center;padding:.5em;border-radius:8px;border:2px dashed var(--rc);background:color-mix(in srgb,var(--rc) 14%,transparent);font-weight:800;font-size:.85rem;transition:.3s}
  .sm-r.pulse{animation:pulse 1s 2}
  .sm-robot{display:flex;flex-direction:column;gap:6px;padding:12px;border-radius:10px;background:var(--code);color:#cfd5ff;min-height:200px}
  .sm-robot .hd{display:flex;gap:.5em;align-items:center;font-weight:900;font-size:.85rem;color:#9aa3c7}
  .sm-row{display:grid;grid-template-columns:5.6em 1fr;gap:.6em;font:600 .8rem var(--mono);padding:.25em .5em;border-radius:6px;background:rgba(255,255,255,.05)}
  .sm-row .tg{color:#ff8f7a}.sm-row .mn{color:#9be58b}.sm-row .mn.q{color:#6d779f}
  .sm-msg{margin-top:auto;padding:.5em .8em;border-radius:8px;font-weight:800;font-size:.85rem;display:flex;gap:.5em;align-items:center;min-height:2.6em}
  .sm-msg.bad{background:rgba(255,84,112,.15);color:#ff9aa5;animation:shake .4s}.sm-msg.ok{background:rgba(74,222,128,.15);color:#9be58b}
  .q1-mq{display:grid;gap:12px;margin-top:18px}.q1-mq .card{display:grid;gap:10px}
  @media(max-width:900px){.sm-wrap{grid-template-columns:1fr}}
  `);
  const sceneSemantic = {
    t: 'なぜ意味のあるタグ？', tag: 'semantic',
    lead: '<b>見た目は同じ</b>の2つのページ。でも読み上げ・検索エンジン・キーボードから見ると、<b>使えるか使えないか</b>が変わります。切り替えて、右の結果と一番下の表を見比べよう。',
    why: {
      problem: '<code>&lt;div&gt;</code> だけで作ると、見た目は同じでも<b>どこが本文か誰にも分からない</b>',
      idea: '見た目ではなく<b>「役割」を表すタグ</b>を選ぶ → 読み上げ・検索エンジンが構造を理解できる',
      answer: '<code>header</code> / <code>nav</code> / <code>main</code> / <code>footer</code>',
      when: [['ページの上部（ロゴ・見出し）', '&lt;header&gt;'], ['メニュー', '&lt;nav&gt;'], ['主役の内容（1ページに1つ）', '&lt;main&gt;'], ['役割のない枠・CSS の都合だけ', '&lt;div&gt;']],
    },
    render: semanticScene,
  };

  (function attachHtml() {
    const L = K.lessons;
    const ins = (lid, scene, before) => { const a = L[lid].scenes; if (a.some((s) => s.t === scene.t)) return; const i = a.findIndex((s) => s.t === before); a.splice(i < 0 ? a.length - 1 : i, 0, scene); };
    ins('html', sceneSemantic, 'ページの骨組み');
    const F = (items, loop, cap) => ({ k: 'flow', items, loop, cap });
    const C = (text, o = {}) => Object.assign({ k: 'code', lang: 'html', text }, o);
    const VS = (a, b, cap) => ({ k: 'vs', a, b, cap });
    const ST = (items, cap) => ({ k: 'stack', items, cap });
    const CH = (items, cap) => ({ k: 'chips', items, cap });
    const BG = (i, t, cap) => ({ k: 'big', i, t, cap });
    const ME = (items, cap) => ({ k: 'meter', items, cap });
    const bad = (i, t) => ({ i, t, c: 'bad' }), warn = (i, t) => ({ i, t, c: 'warn' });
    const WHY = {
      intro: {
        'この研修で作るもの': {
          problem: '「何のために学ぶの？」<b>ゴールが見えない</b>と続かない',
          idea: '<b>完成品から逆算</b>して、小さな部品を順に積み上げる',
          answer: 'HTML → CSS → TypeScript → Vue.js → 発表',
          when: [['見た目と構造', 'HTML / CSS'], ['安全なコード', 'TypeScript'], ['動くUI・アプリ', 'Vue.js']],
          pv: F([warn('book-open', '学ぶ'), bad('circle-help', 'なんのため？'), bad('x', 'やめる')]),
          iv: F(['flag|完成品', 'list-ordered|小さく分ける', 'footprints|順に積む']),
          av: F(['file-code|HTML', 'palette|CSS', 'shield-check|TS', 'zap|Vue', 'trophy|発表']),
        },
        '学習計画表': {
          problem: '全体の流れが見えず、<b>今どこにいるか</b>迷う',
          idea: '日ごとのテーマを<b>地図</b>にして、先につかんでおく',
          answer: '6日間の計画表（日付クリックでジャンプ）',
          pv: BG('map-pin-off', '今どこ？'),
          iv: F(['calendar|日ごとのテーマ', 'map|地図にする']),
          av: CH(['1日目 HTML・CSS', '2日目 TS', '4日目 Vue', '6日目 発表']),
        },
        '講義のゴール': {
          problem: 'いきなり難しいことから始めて<b>挫折</b>しがち',
          idea: '小さな成功を重ねて、最後に<b>1つ作り切る</b>',
          answer: '最終日に「あなたらしいWebサイト」を発表',
          pv: F([bad('mountain', 'いきなり難しい'), bad('x', '挫折')]),
          iv: F(['check|小さな成功', 'repeat|重ねる', 'trophy|作り切る']),
          av: BG('globe', '自分のサイトを公開'),
        },
        '学習の進め方': {
          problem: '読むだけだと、<b>翌日には忘れて</b>しまう',
          idea: '見る → 動かす → 作る。<b>手を動かすほど</b>記憶に残る',
          answer: '各ページ：図で理解 → 操作 → 実践',
          when: [['まず全体を理解したい', '図のステップを「次へ」'], ['自分で確かめたい', 'スライダー・ボタンを触る'], ['身につけたい', '最後の「実践」']],
          pv: ME([{ t: '読むだけ', v: 0.2, c: 'bad' }, { t: '手を動かす', v: 0.8, c: 'ok' }], '翌日に覚えている量'),
          iv: F(['eye|見る', 'mouse-pointer-click|動かす', 'pencil|作る']),
          av: CH(['図で見る', '触って試す', '実践で書く']),
        },
        '準備チェック': {
          problem: '当日に環境が無くて、<b>最初の30分</b>が消える',
          idea: '前日までに<b>チェックリスト</b>で済ませておく',
          answer: 'PC / GitHub / VS Code / Zoom・Slack',
          pv: F([warn('laptop', '当日'), bad('download', '設定中…'), bad('clock', '30分消える')]),
          iv: F(['calendar-check|前日に', 'list-checks|確認', 'smile|当日はラク']),
          av: CH(['PC', 'GitHub', 'VS Code', 'Slack']),
        },
      },
      html: {
        'HTML・CSS・JS の役割': {
          problem: '全部を1か所に書くと、<b>どこを直せばいいか</b>分からなくなる',
          idea: '<b>役割で分ける</b>：構造・見た目・動き',
          answer: 'HTML ＝ 骨組み ／ CSS ＝ 見た目 ／ JS ＝ 動き',
          when: [['何を表示する？（文章・画像）', 'HTML'], ['どう見せる？（色・配置）', 'CSS'], ['どう動く？（クリックに反応）', 'JavaScript']],
          pv: C('<h1 style="color:red"\n    onclick="alert()">Hi</h1>', { err: [1, 2] }),
          iv: F(['blocks|構造 HTML', 'palette|見た目 CSS', 'zap|動き JS'], null, '役割で分ける'),
          av: C('<h1>Hi</h1>\n<link rel="stylesheet" href="a.css">\n<script src="a.js"></script>', { ok: [1, 2, 3] }),
        },
        'タグの解剖': {
          problem: 'ブラウザは「<b>どこからどこまでがリンク？</b>」を推測できない。書き間違えても<b>エラーは出ず</b>、静かに壊れる',
          idea: '開始タグと閉じタグで<b>範囲をはさみ</b>、属性で追加情報を渡す',
          answer: '<code>&lt;要素 属性="値"&gt;中身&lt;/要素&gt;</code>',
          when: [['範囲と種類を伝える', 'タグ（要素名）'], ['追加情報（リンク先・目印）', '属性（href, class, src …）']],
          pv: C('予約する\n初回30分は無料です。\n', { err: [1, 2] }),
          iv: F(['brackets|開始タグ', 'type|中身', 'brackets|閉じタグ'], null, 'はさんで範囲を伝える'),
          av: C('<a href="/home">Home</a>', { ok: [1] }),
        },
        'HTML は「木」': {
          problem: 'タグの入れ子を間違えると、<b>表示が崩れ</b>て CSS・JS も効かない',
          idea: 'HTML は<b>親子関係の木</b>。インデントの深さ＝木の深さ',
          answer: 'DOM ツリー（ブラウザが作る構造）',
          when: [['要素の中に別の要素', '子（入れ子）'], ['同じ階層に並ぶ', '兄弟']],
          pv: C('<ul>\n  <li>初回30分は無料\n</ul>', { err: [2] }),
          iv: F(['file|body', 'corner-down-right|ul', 'corner-down-right|li'], null, '親 → 子の木'),
          av: BG('network', 'ブラウザが木にして扱う'),
        },
        'なぜ意味のあるタグ？': null,
        'ページの骨組み': {
          problem: '部品の置き場がバラバラで、<b>ページごとに構造が違う</b>',
          idea: 'サイトの<b>定番の形</b>（上・中・下）に合わせる',
          answer: 'header → main（article + aside）→ footer',
          when: [['ページ上部', 'header'], ['本文', 'article'], ['補足・関連', 'aside'], ['ページ下部', 'footer']],
          pv: ST(['layout-dashboard|ページA：上に本文', 'layout-dashboard|ページB：下に本文'], 'ページごとに違う'),
          iv: F(['panel-top|上', 'square|中', 'panel-bottom|下'], null, '定番の3段'),
          av: C('<header>…</header>\n<main>…</main>\n<footer>…</footer>', { ok: [1, 2, 3] }),
        },
        'よく使うタグ図鑑': {
          problem: '書きたい内容があるのに、<b>どのタグか分からない</b>',
          idea: '「伝えたい<b>内容の種類</b>」からタグを選ぶ',
          answer: '見出し h / 段落 p / リンク a / 画像 img / リスト ul / 表 table',
          when: [['項目の羅列', 'ul / ol'], ['行と列のあるデータ', 'table（レイアウト目的では使わない）'], ['別のページへ移動', 'a href']],
          pv: CH([warn('circle-help', '大きい文字は？'), warn('circle-help', '文章は？'), warn('circle-help', '画像は？')]),
          iv: F(['message-square|内容の種類', 'search|を見て', 'tag|タグを選ぶ']),
          av: CH(['h1 見出し', 'p 段落', 'a リンク', 'img 画像', 'ul リスト']),
        },
        'リスト：ul / ol / dl': {
          problem: '「・」や番号を<b>手で打つ</b>と、増やしたり並べ替えたりするたび崩れる',
          idea: '「リスト」という<b>意味</b>を付ければ、記号や番号はブラウザが自動で付ける',
          answer: '<code>ul</code> / <code>ol</code> / <code>dl</code> と <code>li</code>',
          when: [['順番に意味なし（買い物リスト）', 'ul'], ['順番に意味あり（手順・ランキング）', 'ol'], ['用語と説明のセット', 'dl']],
          pv: C('・初回30分は無料\n・ビデオ通話OK\n・土日も対応', { err: [1, 2, 3], lang: 'text' }),
          iv: F(['list|リストと伝える', 'wand-sparkles|記号は自動']),
          av: C('<ul>\n  <li>初回30分は無料</li>\n</ul>', { ok: [1, 2, 3] }),
        },
        'フォーム：データを送る': {
          problem: '利用者の入力を<b>サーバーに渡す</b>方法が必要',
          idea: '入力欄に<b>名前（name）</b>を付け、まとめて送り先（action）へ送る',
          answer: '<code>&lt;form action method&gt;</code> ＋ <code>&lt;input name&gt;</code>',
          when: [['検索など・URL に出てよい', 'GET'], ['パスワード・登録・更新', 'POST']],
          pv: F([warn('keyboard', '入力した'), bad('ban', '届かない'), 'server|サーバー']),
          iv: F(['tag|name を付ける', 'send|まとめて送る', 'server|action へ']),
          av: C('<form action="/save"\n      method="POST">\n  <input name="email">', { ok: [1, 2, 3] }),
        },
        '作ってみよう：企画と公開': {
          problem: '作り始めると<b>何を作るか迷って</b>手が止まる',
          idea: '先に<b>企画（目的・かかる時間）</b>を決め、30分ごとに進み具合を確かめる',
          answer: '企画書 → HTML → CSS → push → 公開',
          when: [['まず決める', '名前・目的・理由'], ['進め方', '30分ごとに push して報告']],
          pv: F([warn('file-question', '何を作る？'), bad('clock', '手が止まる')]),
          iv: F(['clipboard-list|先に企画', 'timer|30分ごとに確認']),
          av: F(['clipboard-list|企画', 'file-code|HTML', 'palette|CSS', 'upload|push', 'globe|公開']),
        },
      },
    };
    Object.assign(sceneSemantic.why, {
      pv: C('<div>ロゴ</div>\n<div>メニュー</div>\n<div>本文</div>', { err: [1, 2, 3] }),
      iv: VS({ i: 'box', t: 'div', s: '意味なし' }, { i: 'tag', t: 'header / main', s: '役割あり' }),
      av: C('<header>ロゴ</header>\n<nav>メニュー</nav>\n<main>本文</main>', { ok: [1, 2, 3] }),
    });
    Object.keys(WHY.html).forEach((k) => { if (!WHY.html[k]) delete WHY.html[k]; });
    Object.entries(WHY).forEach(([lid, m]) => L[lid].scenes.forEach((s) => { if (m[s.t]) s.why = m[s.t]; }));

    // clarity pass: short, concrete wording (overrides the earlier text)
    const TXT = {
      intro: {
        'この研修で作るもの': { lead: '6日間で HTML/CSS → TypeScript → Vue.js と順に学んで、最後にみんなで作ったWebアプリを発表します。「次へ」で道のりを見てみよう。', idea: '<b>できあがり</b>を先に見て、そこから小さく分けて、順に作る' },
        '学習計画表': { idea: '日ごとに<b>何をやるか</b>、先に地図で見ておく' },
        '講義のゴール': { problem: 'いきなり難しいことから始めると、<b>途中でイヤになる</b>', idea: '小さな「できた！」を重ねて、最後に<b>1つ完成</b>させる' },
        '学習の進め方': { lead: '各ページは「見る → 動かす → 作る」の順。まず図で分かって、最後の「実践」で自分のコードを書きます。', idea: '見て、触って、書く。<b>手を動かすほど</b>覚えやすい' },
        '準備チェック': { idea: '前の日までに、<b>リストを見ながら</b>準備しておく' },
      },
      html: {
        'HTML・CSS・JS の役割': { idea: '<b>役割ごとに分ける</b>：形（HTML）・見た目（CSS）・動き（JS）' },
        'タグの解剖': { idea: '始まりと終わりのタグで<b>「ここからここまで」</b>を示す。細かい設定は属性で足す' },
        'HTML は「木」': { lead: 'ブラウザは HTML を読んで、<b>木の形（DOM ツリー）</b>にして覚えます。ページの部品と木の枝は1対1。<b>カーソルを乗せる</b>と、どちらでも相手が光ります。', problem: '「ボタンだけ赤くしたいのに効かない」「JS が要素を見つけられない」。原因は<b>タグの入れ方（木の形）</b>のことが多い', idea: 'タグは「<b>親の中に子が入る</b>」形。字下げの深さ＝木の深さ。CSS も JS もこの木をたどって相手を探す', answer: '<b>DOM ツリー</b>：CSS・JS・開発者ツールが見ている、ページの本当の姿' },
        'なぜ意味のあるタグ？': { lead: '見た目は同じ2つのページ。でも、読み上げ・検索エンジン・キーボードから見ると<b>使えるか使えないか</b>が変わります。切り替えて、右の結果と一番下の表を見比べよう。', problem: '<code>&lt;div&gt;</code> だけだと、見た目は同じでも<b>予約ボタンにキーボードで届かない・検索の説明文がメニューだらけ・目次が作れない</b>', idea: '<b>「何の部分か」</b>を表すタグを選ぶだけで、読み上げのジャンプ・検索の説明文・自動の目次・Tab 操作が最初から働く', answer: '<code>header / nav / main</code>・<code>h1〜h3</code>・<code>button</code>・<code>a</code>・<code>label</code>' },
        'ページの骨組み': { lead: 'ほとんどのサイトはこの形。「次へ」で組み立てよう。色の付いた部品にカーソルを乗せると、コードが光ります。', problem: '部品の置き場所がページごとにバラバラで、<b>探しにくい</b>' },
        'よく使うタグ図鑑': { idea: '<b>「何を書きたいか」</b>から、タグを選ぶ' },
        'リスト：ul / ol / dl': { problem: '「・」や番号を<b>手で打つ</b>と、項目を増やすたびに直すことになる', idea: '<b>「これはリスト」</b>と伝えれば、記号や番号はブラウザが付けてくれる' },
        'フォーム：データを送る': { problem: '入力してもらった内容を、<b>サーバーに送りたい</b>' },
        '作ってみよう：企画と公開': { idea: '先に<b>「何を作るか・どれくらいかかるか」</b>を決めて、30分ごとに進み具合を見る' },
      },
    };
    Object.entries(TXT).forEach(([lid, m]) => L[lid].scenes.forEach((s) => { const t = m[s.t]; if (!t) return; if (t.lead) s.lead = t.lead; ['problem', 'idea', 'answer'].forEach((k) => { if (t[k] && s.why) s.why[k] = t[k]; }); }));

    /* Q5: realistic code visuals + linked keys (same key in pv / iv / av is joined by arrows) */
    const cd = (file, lang, text, o = {}) => Object.assign({ k: 'code', file, lang, text }, o);
    const over = (lid, title, o) => { const s = L[lid].scenes.find((x) => x.t === title); if (!s) return; s.why = Object.assign(s.why || {}, o); };
    over('intro', 'この研修で作るもの', {
      problem: '何のために学ぶのか見えない', idea: '完成品から逆算して積む', answer: '最後に Web アプリを発表',
      pv: cd('memo.txt', 'text', 'HTML? CSS? TS? Vue?\n→ で、何を作るの？\n→ 何の役に立つの？', { err: [2, 3], keys: { 2: 'goal' } }),
      iv: cd('ゴール', 'text', '完成 = Web アプリ\n└ Vue.js    動く画面\n  └ TypeScript 安全\n    └ HTML/CSS 形', { idea: [1], keys: { 1: 'goal' } }),
      av: cd('course.md', 'text', '1 HTML/CSS    形\n2 TypeScript  安全\n3 Vue.js       動く\n4 発表      完成', { ok: [4], keys: { 4: 'goal' } }),
    });
    over('intro', '学習計画表', {
      problem: '今どこか分からず迷う', idea: '日ごとの地図を先に見る', answer: '6日間の計画表',
      pv: cd('memo.txt', 'text', '1日目 ？\n2日目 ？\n4日目 ？  ← 何をやる？', { err: [1, 2, 3], keys: { 3: 'plan' } }),
      iv: cd('地図', 'text', '1日目 HTML / CSS / Git\n2日目 TypeScript\n4日目 Vue.js\n6日目 発表', { idea: [1, 2, 3, 4], keys: { 1: 'plan' } }),
      av: cd('schedule', 'text', '16 月 HTML/CSS・CUI・Git\n17 火 TypeScript\n19 木 Vue.js\n25 月 発表', { ok: [4], keys: { 4: 'plan' } }),
    });
    over('intro', '講義のゴール', {
      problem: 'いきなり難しくてイヤになる', idea: '小さな「できた」を重ねる', answer: '最後に1つ完成させる',
      pv: cd('day1.txt', 'text', 'いきなり 型 + Vue + Git…\n→ 分からない\n→ やめたい', { err: [2, 3], keys: { 2: 'step' } }),
      iv: cd('steps.md', 'text', '1日目 小さな「できた」\n2日目 もう1つ「できた」\n…\n最後 1つ完成', { idea: [1, 2, 4], keys: { 1: 'step' } }),
      av: cd('goal.md', 'text', '最終日 発表\n自分のサイトを公開', { ok: [1, 2], keys: { 1: 'step' } }),
    });
    over('intro', '学習の進め方', {
      problem: '読むだけだと忘れる', idea: '見る → 触る → 書く', answer: '最後の「実践」で書く',
      pv: cd('memo.txt', 'text', '読む → 読む → 読む\n翌日 → 忘れた', { err: [2], keys: { 2: 'hands' } }),
      iv: cd('rule.md', 'text', '見る    図で理解\n動かす  触って確認\n書く    自分のコード', { idea: [2, 3], keys: { 3: 'hands' } }),
      av: cd('ページの流れ', 'text', '図 → 操作 → 実践\n            └ ここで書く', { ok: [1, 2], keys: { 2: 'hands' } }),
    });
    over('intro', '準備チェック', {
      problem: '当日に環境がなくて遅れる', idea: '前日までにリストで確認', answer: 'コマンドが動けば準備OK',
      pv: cd('terminal', 'text', '$ git --version\ncommand not found: git\n→ 設定で30分が消える', { err: [2, 3], keys: { 2: 'prep' } }),
      iv: cd('checklist.md', 'text', '[x] PC\n[x] GitHub\n[x] VS Code\n[x] Slack / Zoom', { idea: [1, 2, 3, 4], keys: { 3: 'prep' } }),
      av: cd('terminal', 'sh', '$ git --version\ngit version 2.x\n$ code --version\n1.x', { ok: [1, 2], keys: { 1: 'prep' } }),
    });

    over('html', 'HTML・CSS・JS の役割', {
      problem: 'ぜんぶ1か所で直しにくい', idea: '役割で分ける', answer: 'HTML 形・CSS 色・JS 動き',
      pv: cd('index.html', 'html', '<h1 style="color:red"\n    onclick="go()">Hi</h1>\n<p style="margin:8px">…</p>', { err: [1, 2, 3], keys: { 1: 'role' } }),
      iv: cd('3つの役割', 'text', 'HTML → <h1>Hi</h1>\nCSS  → h1 { color: red }\nJS   → onclick で動く', { idea: [1, 2, 3], keys: { 1: 'role' } }),
      av: cd('index.html', 'html', '<h1>Hi</h1>\n<link rel="stylesheet"\n      href="a.css">\n<script src="a.js"></script>', { ok: [2, 3, 4], keys: { 1: 'role' } }),
    });
    over('html', 'タグの解剖', {
      problem: 'どこまでがリンクか不明', idea: 'タグで範囲をはさむ', answer: '<code>&lt;a href&gt;…&lt;/a&gt;</code>',
      pv: cd('index.html', 'text', '予約する\n初回30分は無料です。', { err: [1, 2], keys: { 1: 'tag' } }),
      iv: cd('index.html', 'html', '<a href="/reserve">\n  予約する\n</a>', { idea: [1, 3], keys: { 1: 'tag' } }),
      av: cd('index.html', 'html', '<a href="/home">Home</a>\n<img src="me.png" alt="私">', { ok: [1, 2], keys: { 1: 'tag' } }),
    });
    over('html', 'HTML は「木」', {
      problem: '閉じ忘れで表示が崩れる', idea: '親の中に子が入る「木」', answer: 'ブラウザが木にして扱う',
      pv: cd('index.html', 'html', '<ul>\n  <li>初回30分は無料\n</ul>', { err: [2], keys: { 2: 'tree' } }),
      iv: cd('DOM ツリー', 'text', 'ul\n├ li  初回30分は無料\n├ li  ビデオ通話OK\n└ li  土日も対応', { idea: [2, 3, 4], keys: { 1: 'tree' } }),
      av: cd('index.html', 'html', '<ul>\n  <li>初回30分は無料</li>\n  <li>ビデオ通話OK</li>\n</ul>', { ok: [2, 3], keys: { 2: 'tree' } }),
    });
    over('html', 'なぜ意味のあるタグ？', {
      problem: 'どこが本文か機械に伝わらない', idea: '役割を表すタグを選ぶ', answer: 'header / nav / main',
      pv: cd('index.html', 'html', '<div>ロゴ</div>\n<div>メニュー</div>\n<div>本文</div>', { err: [1, 2, 3], keys: { 3: 'role' } }),
      iv: cd('役割', 'text', '<header>  ← ロゴ\n<nav>     ← メニュー\n<main>    ← 本文', { idea: [3], keys: { 3: 'role' } }),
      av: cd('index.html', 'html', '<header>ロゴ</header>\n<nav>メニュー</nav>\n<main>本文</main>', { ok: [3], keys: { 3: 'role' } }),
    });
    over('html', 'ページの骨組み', {
      problem: '置き場がページごとに違う', idea: '上・中・下の定番の形', answer: 'header → main → footer',
      pv: cd('memo.txt', 'text', 'A: main → header → footer\nB: footer → main → header\nC: …バラバラ', { err: [1, 2, 3], keys: { 3: 'frame' } }),
      iv: cd('index.html', 'html', '<header>…</header>\n<main>\n  <article>…</article>\n  <aside>…</aside>\n</main>\n<footer>…</footer>', { idea: [1, 2, 6], keys: { 2: 'frame' } }),
      av: cd('index.html', 'html', '<header>…</header>\n<main>…</main>\n<footer>…</footer>', { ok: [1, 2, 3], keys: { 2: 'frame' } }),
    });
    over('html', 'よく使うタグ図鑑', {
      problem: '書きたいのにタグが分からない', idea: '内容の種類でタグを選ぶ', answer: '見出し h・段落 p・リンク a',
      pv: cd('memo.txt', 'text', '大きい文字は？ → ?\n文章は？ → ?\nリンクは？ → ?', { err: [1, 2, 3], keys: { 1: 'pick' } }),
      iv: cd('図鑑', 'text', '見出し → h1〜h6\n段落   → p\nリンク → a\n画像   → img\nリスト → ul / ol', { idea: [1, 2, 3], keys: { 1: 'pick' } }),
      av: cd('index.html', 'html', '<h1>見出し</h1>\n<p>文章</p>\n<a href="/">リンク</a>\n<img src="a.png" alt="写真">', { ok: [1, 2, 3, 4], keys: { 1: 'pick' } }),
    });
    over('html', 'リスト：ul / ol / dl', {
      problem: '「・」を手で打つと崩れる', idea: '「リスト」と伝える', answer: 'ul / ol と li',
      pv: cd('index.html', 'text', '・初回30分は無料\n・ビデオ通話OK\n・土日も対応', { err: [1, 2, 3], keys: { 1: 'list' } }),
      iv: cd('index.html', 'html', '<ul>\n  <li>初回30分は無料</li>\n</ul>\n<!-- 「・」は自動で付く -->', { idea: [1, 2], keys: { 1: 'list' } }),
      av: cd('index.html', 'html', '<ul>\n  <li>初回30分は無料</li>\n  <li>ビデオ通話OK</li>\n</ul>\n<ol><li>手順1</li></ol>', { ok: [1, 5], keys: { 1: 'list' } }),
    });
    over('html', 'フォーム：データを送る', {
      problem: '入力しても届かない', idea: 'name を付けてまとめて送る', answer: 'form + input の name',
      pv: cd('index.html', 'html', '<input type="text">\n<button>送信</button>\n<!-- 送信しても届かない -->', { err: [1, 2], keys: { 1: 'name' } }),
      iv: cd('リクエスト', 'text', 'POST /save\n\nname=Lam&age=20', { idea: [3], keys: { 3: 'name' } }),
      av: cd('index.html', 'html', '<form action="/save" method="POST">\n  <input name="name">\n  <button>送信</button>\n</form>', { ok: [1, 2], keys: { 2: 'name' } }),
    });
    over('html', '作ってみよう：企画と公開', {
      problem: '何を作るか決まらず止まる', idea: '先に企画を書いて進める', answer: 'push して公開',
      pv: cd('memo.txt', 'text', '何を作ろう…\nうーん…\n（30分経過）', { err: [1, 2, 3], keys: { 1: 'plan' } }),
      iv: cd('plan.md', 'text', '名前: Lam の趣味ログ\n目的: 好きなことを紹介\n時間: 4h HTML→CSS→公開', { idea: [1, 2, 3], keys: { 1: 'plan' } }),
      av: cd('terminal', 'sh', 'git add .\ngit commit -m "完成"\ngit push', { ok: [3], keys: { 3: 'plan' } }),
    });

    const plan = L.html.scenes.find((x) => x.t === '作ってみよう：企画と公開');
    if (plan) plan.answer = { html: '<p style="color:var(--mute);font-size:.875rem;margin-bottom:.6em">企画の書き方の一例です。</p><ul style="line-height:1.9"><li><b>① サイト名</b>：Lam の趣味ログ</li><li><b>② 内容・目的</b>：好きなことを写真と文章で紹介する</li><li><b>③ 作りたい理由</b>：自分を知ってもらいたい</li><li><b>④ かかる時間</b>：4時間（HTML 1h → CSS 2h → 公開 1h）</li><li><b>⑤ デザイン</b>：青を基調にシンプルに</li><li><b>⑥ 他の人の意見</b>：写真ギャラリーがあると嬉しい</li></ul>' };
    // secondary content lives in header-icon modals (ref), not in the page body
    const K_ = K.W; const I_ = K_.icon;
    const extra = (lid, title, fn) => { const s = L[lid].scenes.find((x) => x.t === title); if (!s) return; (s.ref = s.ref || []).push({ title: 'どれを使う？ クイズ', icon: 'list-checks', node: () => { const box = h('div'); fn(box); return box.firstChild || box; } }); };
    const pull = (lid, title, find, rtitle, ric) => {
      const s = L[lid].scenes.find((x) => x.t === title); if (!s) return;
      const holder = {}; (s.ref = s.ref || []).push({ title: rtitle, icon: ric, node: () => (holder.n ? holder.n.cloneNode(true) : h('div')) });
      const o = s.render; s.render = function (el, ctx) { const r = o.call(this, el, ctx); const n = find(el); if (n) { holder.n = n; n.remove(); } return r; };
    };
    pull('html', 'HTML は「木」', (el) => [...el.querySelectorAll('p.lead')].find((p) => /試そう/.test(p.textContent)), 'ためしてみよう', 'lightbulb');
    pull('html', 'フォーム：データを送る', (el) => el.querySelector('pre.code[data-file="form.html"]'), 'フォームの HTML', 'file-code');
    const pickQuiz = (el, title, items) => { const w = h('div', { class: 'q1-mq' }, lbl(title)); items.forEach((it) => w.append(h('div', { class: 'card' }, quiz(it)))); el.append(w); };
    extra('html', 'よく使うタグ図鑑', (el) => pickQuiz(el, 'どのタグを使う？', [
      { q: '<b>見出し</b>ごとに文字を大きくしたい。どうする？', options: ['<code class="i">&lt;p&gt;</code> を font-size で大きくする', '<code class="i">&lt;h1&gt;〜&lt;h6&gt;</code> を使う', '<code class="i">&lt;br&gt;</code> を重ねる'], answer: 1, why: '見出しは「意味」で選ぶ。大きさは CSS で後から調整できる。' },
      { q: 'ページを<b>2列に並べたい</b>から &lt;table&gt; を使おう…これは？', options: ['OK、表なら何でも', 'NG。table は「行列のあるデータ」用。配置は CSS（flex/grid）で'], answer: 1, why: 'レイアウトのための table は古い手法。意味と見た目は分ける。' },
    ]));
    extra('html', 'フォーム：データを送る', (el) => pickQuiz(el, 'どっちで送る？', [
      { q: 'パスワードを入力する<b>ログインフォーム</b>。method は？', options: ['GET', 'POST'], answer: 1, why: 'GET は入力値が URL に出てしまう。パスワードや登録は POST。' },
    ]));
  })();
})();
