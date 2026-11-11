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
    { d: '3', w: '', c: 'var(--ts)', t: 'TypeScript ②', k: [['interface・Type', 'ts-types'], ['ジェネリクス', 'ts-generics'], ['単体テスト入門', 'ts-test'], ['復習', 'review']], m: '型を設計し、テストで守る。' },
    { d: '4', w: '', c: 'var(--vue)', t: 'Vue.js ①', k: [['紹介', 'vue-intro'], ['環境設定', 'vue-env'], ['基礎', 'vue-basics'], ['コンポーネント', 'vue-comp']], m: '画面が「データに反応して」動く感覚をつかむ。' },
    { d: '5', w: '', c: 'var(--vue)', t: 'Vue.js ②', k: [['復習', 'review'], ['アイデア発想', 'idea'], ['Lifecycle・Computed・Watcher', 'vue-life'], ['Vue Router', 'vue-router'], ['単体テスト', 'ts-test'], ['Q&A', 'qa']], m: '応用機能を学び、チーム開発のテーマを決める。' },
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
    const S = { t: 'ul', items: ['りんご', 'みかん', 'ぶどう'], nest: false };
    const stage = h('div', { class: 'gap-ol' }), cd = h('div'), chips = h('div', { class: 'gap-items' }), note = h('div', { class: 'st-cap' });
    const NOTE = { ul: '<b>ul</b> = Unordered List（順番なし）。●が付く。買い物リスト・メニュー向き。', ol: '<b>ol</b> = Ordered List（順番あり）。1,2,3…が自動で振られる。手順・ランキング向き。', dl: '<b>dl</b> = 用語（dt）と説明（dd）のセット。' };
    function html() {
      if (S.t === 'dl') return '<dl>\n' + S.items.map((x) => `  <dt>${x}</dt>\n  <dd>${x}の説明</dd>`).join('\n') + '\n</dl>';
      return `<${S.t}>\n` + S.items.map((x, i) => `  <li>${x}` + (S.nest && i === 0 ? `\n    <${S.t}>\n      <li>${x}の仲間</li>\n    </${S.t}>\n  ` : '') + '</li>').join('\n') + `\n</${S.t}>`;
    }
    const draw = () => {
      const src = html(); stage.innerHTML = src; cd.replaceChildren(code(src, 'html', { file: 'list.html', color: BASIC_C }));
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
          const items = [['💻', 'パソコン', '充電器も忘れずに'], ['🐙', 'GitHub アカウント', '研修用の Organization に参加'], ['🧰', 'Visual Studio Code', 'テキストエディタ'], ['💬', 'Zoom / Slack', '質問はいつでも気軽に'], ['🤖', 'ChatGPT', '調べ学習の相棒']];
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
    { s: '<p', p: ['name', 'start'] }, { s: ' ', p: ['start'] }, { s: 'class', p: ['attr', 'aname', 'start'] }, { s: '=', p: ['attr', 'start'] },
    { s: '"title"', p: ['attr', 'aval', 'start'] }, { s: '>', p: ['start'] }, { s: 'コンテンツ', p: ['content'] }, { s: '</p>', p: ['end', 'name2'] },
  ];
  const partInfo = {
    el: ['要素 (element)', 'var(--basic)', '開始タグ〜閉じタグまで全部ひっくるめて「要素」', null],
    start: ['開始タグ', 'var(--ts)', 'ここから始まるよ、の合図。ブラウザへの命令', 'start'],
    attr: ['属性', 'var(--team)', '要素に付ける追加情報。「名前="値"」の形', 'attr'],
    aname: ['属性名', 'var(--pink)', '何の情報か（class, id, src, href …）', 'aname'],
    aval: ['属性値', 'var(--violet)', '情報の中身。"" で囲んで書くのが基本', 'aval'],
    content: ['コンテンツ', 'var(--vue)', '画面に表示される中身', 'content'],
    end: ['閉じタグ', 'var(--ts)', 'ここで終わり。<b>/</b>が付く', 'end'],
  };

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
        t: 'タグの解剖', lead: '下のパーツを<b>ホバー / クリック</b>してみよう。コードのどこが何なのかが光ります。',
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
          el.append(h('div', { class: 'card', style: { marginTop: '18px' } }, quiz({
            q: '閉じタグ <code class="i">&lt;/p&gt;</code> を書き忘れると？', options: ['エラーで何も表示されない', 'ブラウザが推測して表示するが、意図しない崩れが起きやすい', '自動で正しく補完されて問題ない'], answer: 1,
            why: 'HTMLは寛容ですが、思わぬレイアウト崩れの元。必ず閉じよう。',
          })));
        },
      },
      {
        t: 'HTML は「木」', tag: 'DOM', lead: 'ブラウザはHTMLを読んで<b>木構造（DOMツリー）</b>に変換します。左のコードを書き換えると、右の木がリアルタイムで育ちます。',
        render(el) {
          const init = '<h1>私の自己紹介</h1>\n<p>名前は <b>Lam</b> です。</p>\n<ul>\n  <li>好きな色: 青</li>\n  <li>趣味: コード</li>\n</ul>\n';
          const tree = h('div', { class: 'tree' });
          const prev = h('iframe', { style: { width: '100%', height: '150px', border: '1px solid var(--line)', borderRadius: '8px', background: '#fff' }, sandbox: '' });
          const colors = ['var(--basic)', 'var(--ts)', 'var(--vue)', 'var(--team)', 'var(--pink)', 'var(--violet)'];
          function node(n, d) {
            if (n.nodeType === 3) { const t = n.textContent.trim(); return t ? h('div', { class: 'tn tx' }, h('span', { class: 'nm' }, '“' + (t.length > 14 ? t.slice(0, 14) + '…' : t) + '”')) : null; }
            if (n.nodeType !== 1) return null;
            const kids = [...n.childNodes].map((c) => node(c, d + 1)).filter(Boolean);
            return h('div', { class: 'tn', style: { '--d': colors[d % colors.length] } }, h('span', { class: 'nm' }, '<' + n.tagName.toLowerCase() + '>'), kids.length ? h('div', { class: 'kids' }, kids) : null);
          }
          function draw(v) {
            const doc = new DOMParser().parseFromString('<body>' + v + '</body>', 'text/html');
            tree.replaceChildren(h('div', { class: 'tn', style: { '--d': 'var(--mute)' } }, h('span', { class: 'nm' }, 'body'), h('div', { class: 'kids' }, [...doc.body.childNodes].map((c) => node(c, 0)).filter(Boolean))));
            prev.srcdoc = '<body style="font-family:sans-serif;margin:10px">' + v;
          }
          const ed = K.W.codeEditor(init, 'html', draw);
          ed.style.borderRadius = '14px'; ed.style.minHeight = '330px';
          el.append(h('div', { class: 'split' }, h('div', { class: 'col' }, lbl('HTML（編集できるよ）'), ed, prev), h('div', { class: 'col' }, lbl('DOMツリー'), h('div', { class: 'card' }, tree))));
          draw(init);
          el.append(h('p', { class: 'lead', style: { marginTop: '14px' }, html: '💡 試そう：<code class="i">&lt;li&gt;</code> を1つ増やす／<code class="i">&lt;ul&gt;</code> を <code class="i">&lt;ol&gt;</code> に変える。<b>親子関係</b>＝インデントの深さ、に注目！' }));
        },
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
            ['h1', '見出し', '<h1>大見出し</h1>', 'var(--ts)'], ['p', '段落', '<p>これは段落です。</p>', 'var(--basic)'], ['a', 'リンク', '<a href="#">リンクをクリック</a>', 'var(--pink)'],
            ['img', '画像', `<img src="${svg}" alt="サンプル画像">`, 'var(--violet)'], ['ul', 'リスト', '<ul><li>りんご</li><li>みかん</li></ul>', 'var(--team)'],
            ['table', '表', '<table><tr><th>名前</th><th>点</th></tr><tr><td>Lam</td><td>100</td></tr></table>', 'var(--vue)'], ['button', 'ボタン', '<button>押してね</button>', 'var(--ts)'], ['input', '入力欄', '<input type="text" placeholder="入力してね">', 'var(--basic)'],
          ];
          const stage = h('div', { class: 'stage' });
          const cd = h('div');
          const list = [];
          const redraw = () => { cd.replaceChildren(code(list.length ? list.map((i) => Z[i][2].replace(/src="data:[^"]+"/, 'src="photo.png"')).join('\n') : '<!-- ここにHTMLが増えていく -->', 'html', { file: 'index.html', color: 'var(--basic)' })); };
          const zoo = h('div', { class: 'zoo' }, Z.map(([t, jp, , c], i) => h('button', { style: { '--c': c }, onclick: () => {
            list.push(i);
            const pc = h('div', { class: 'pc' }, h('em', '<' + t + '>'));
            pc.insertAdjacentHTML('beforeend', Z[i][2]);
            stage.append(pc); redraw(); requestAnimationFrame(() => stage.scrollTo({ top: stage.scrollHeight, behavior: 'smooth' }));
          } }, h('b', '<' + t + '>'), h('small', jp))));
          const clr = h('button', { class: 'btn ghost', style: { justifySelf: 'start' }, onclick: () => { list.length = 0; stage.replaceChildren(); redraw(); } }, K.W.icon('trash-2'), 'クリア');
          cd.style.cssText = 'display:flex;flex-direction:column;flex:1;min-height:0';
          el.append(h('div', { class: 'split tagzoo' },
            h('div', { class: 'col' }, lbl('タグを選ぶ（クリックで追加）'), zoo, h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, h('span', { style: { color: 'var(--mute)', fontSize: '.875rem', fontWeight: 700 } }, '積み上げたタグ → 右の結果と下のHTMLにも出る'), clr), lbl('できあがる HTML'), cd),
            h('div', { class: 'col' }, lbl('結果'), stage)));
          redraw();
        },
      },
      { t: 'リスト：ul / ol / dl', tag: 'list', lead: '種類を切り替えて、<b>見た目とコード</b>の違いを確かめよう。項目の追加・削除・入れ子もできます。', render: listScene },
      {
        t: 'フォーム：データを送る', tag: 'form', lead: '入力欄に書くと、サーバーに送られるデータ（<b>名前=値</b> の組）がリアルタイムで変わります。<b>送信</b>を押すと封筒が飛んでいきます。',
        render(el) {
          const data = { name: '', email: '', password: '' };
          const inputs = {};
          const fm = h('form', { class: 'fm', onsubmit: (e) => { e.preventDefault(); send(); } },
            [['name', 'お名前', 'text'], ['email', 'メール', 'email'], ['password', 'パスワード', 'password']].map(([k, jp, ty]) =>
              h('label', jp, h('small', `name="${k}" type="${ty}"`), inputs[k] = h('input', { type: ty, name: k, placeholder: jp, oninput: (e) => { data[k] = e.target.value; show(); } }))),
            h('button', { class: 'btn primary', type: 'submit', style: { justifyContent: 'center' } }, '送信 (submit)'));
          const out = h('pre');
          const srv = h('div', { class: 'srv' }, h('div', h('div', { style: { fontSize: '2rem' } }, '🖥️'), h('b', 'サーバー'), out));
          const env = h('div', { class: 'env' }, '✉️');
          const grid = h('div', { class: 'fgrid' }, fm, h('div'), srv, env);
          const reqLine = h('div', { class: 'st-cap', style: { marginTop: '14px' } });
          function show() { out.textContent = 'POST /signup\n\n' + Object.entries({ ...data, password: data.password ? '●'.repeat(data.password.length) : '' }).map(([k, v]) => k + '=' + (k === 'password' ? v : encodeURIComponent(v))).join('&'); }
          async function send() {
            const a = fm.getBoundingClientRect(), b = srv.getBoundingClientRect(), g = grid.getBoundingClientRect();
            env.style.opacity = 1;
            await env.animate([{ transform: `translate(${a.width - 30}px,0) scale(.6)`, opacity: 0 }, { transform: `translate(${a.width}px,-30px) scale(1.2)`, opacity: 1, offset: .3 }, { transform: `translate(${b.left - g.left}px,-10px) scale(.8)`, opacity: 1 }], { duration: 900, easing: 'ease-in-out' }).finished;
            env.style.opacity = 0; srv.classList.add('got');
            reqLine.innerHTML = '✅ サーバーが受け取りました！ <b>name 属性</b>がキー、入力値がバリューになります。';
            setTimeout(() => srv.classList.remove('got'), 1400);
          }
          show();
          reqLine.innerHTML = '👆 入力して「送信」を押してみよう。<b>name 属性</b>が無いと、そのデータは送られません。';
          el.append(grid, reqLine);
          el.append(code('<form action="/signup" method="POST">\n  <label for="name">お名前</label>\n  <input type="text" id="name" name="name">\n  <input type="submit" value="送信">\n</form>', 'html', { file: 'form.html', color: 'var(--basic)', hi: [1, 3, 4] }));
        },
      },
      { t: '作ってみよう：企画と公開', tag: 'PROJECT', lead: 'スライドの「簡単なWebサイトを作ってみよう」。左を埋めると、右に<b>企画書サイト</b>が育ちます。', render: planProject },
      {
        t: '実践：自己紹介ページ', tag: 'PRACTICE', lead: '右のプレビューを見ながら、<b>3か所</b>だけ書き足そう（目安 5分）。✓が3つ付いたらクリア！',
        hint: '<p>慣れてきたら、こんなものも足してみよう（ミッションには入っていません）。</p><ul style="line-height:1.9"><li>画像：<code>&lt;img src="…" alt="説明"&gt;</code>（alt は必ず書く）</li><li>表：<code>&lt;table&gt;&lt;tr&gt;&lt;th&gt;…&lt;/th&gt;&lt;/tr&gt;&lt;/table&gt;</code></li><li>見出しの下に <code>&lt;h2&gt;</code> をもう1つ</li></ul>',
        render(el) {
          el.append(playground({
            title: 'HTML', mode: 'web',
            solution: { 'index.html': '<!-- 自己紹介ページ（答えの一例） -->\n<h1>私の自己紹介</h1>\n<p>はじめまして！</p>\n<p>趣味はコードを書くことです。</p>\n\n<h2>好きなもの</h2>\n<ul>\n  <li>好きな色: 青</li>\n  <li>好きな食べ物: ラーメン</li>\n  <li>趣味: コード</li>\n</ul>\n\n<h2>リンク</h2>\n<a href="https://github.com/">研修リポジトリ</a>\n\n<!-- 任意チャレンジ：画像と表 -->\n<img src="https://placehold.co/160x100" alt="好きな風景">\n<table border="1">\n  <tr><th>曜日</th><th>予定</th></tr>\n  <tr><td>月</td><td>HTML / CSS</td></tr>\n</table>\n' },
            files: [{ name: 'index.html', lang: 'html', code: '<!-- 自己紹介ページを完成させよう -->\n<h1>私の自己紹介</h1>\n<p>はじめまして！</p>\n\n<!-- ① 段落をもう1つ。趣味などを <p> と </p> ではさんで書く -->\n\n\n<h2>好きなもの</h2>\n<!-- ② リスト：<ul> の中に <li>…</li> を3つ -->\n<ul>\n\n</ul>\n\n<h2>リンク</h2>\n<!-- ③ リンク：<a href="https://…">文字</a> -->\n\n<!-- 任意チャレンジ：画像（<img>）と表（<table>）を足してみよう -->\n' }],
            tasks: (v, c) => {
              const d = c.doc && c.doc();
              const q = (s) => (d ? d.querySelectorAll(s).length : 0);
              const link = d ? [...d.querySelectorAll('a')].some((a) => (a.getAttribute('href') || '').trim().length > 1) : false;
              return [
                { label: '段落（<p>）が2つ以上ある', ok: q('p') >= 2, hint: ['段落は <code>&lt;p&gt;</code> と <code>&lt;/p&gt;</code> ではさんで書く。①のコメントの下に書こう。', '<code>&lt;p&gt;趣味はコードを書くことです。&lt;/p&gt;</code> のように1行書けば OK。'], answer: { code: '<p>趣味はコードを書くことです。</p>', lang: 'html', mode: 'append' } },
                { label: 'リスト（<ul> か <ol>）に、項目（<li>）が3つ以上ある', ok: q('ul li, ol li') >= 3, hint: ['<code>&lt;ul&gt;</code> の中に、項目ごとに <code>&lt;li&gt;…&lt;/li&gt;</code> を書く。', '<code>&lt;li&gt;</code> を3行。<code>&lt;ul&gt;</code> と <code>&lt;/ul&gt;</code> の「間」に書くよ。'], answer: { code: '<ul>\n  <li>好きな色: 青</li>\n  <li>好きな食べ物: ラーメン</li>\n  <li>趣味: コード</li>\n</ul>', lang: 'html', mode: 'append' } },
                { label: 'リンク（<a href="…">）が1つある', ok: link, hint: ['リンクは <code>&lt;a href="行き先のURL"&gt;表示する文字&lt;/a&gt;</code> の形。', '例：<code>&lt;a href="https://example.com"&gt;リンク&lt;/a&gt;</code>'], answer: { code: '<a href="https://github.com/">研修リポジトリ</a>', lang: 'html', mode: 'append' } },
                { optional: true, label: '画像（<img>、alt 付き）と、2行の表（<table>）を足す', ok: (() => { if (!d) return false; const im = [...d.querySelectorAll('img')].some((i) => (i.getAttribute('alt') || '').trim() && (i.getAttribute('src') || '').trim()); const tb = [...d.querySelectorAll('table')].some((t) => t.querySelectorAll('tr').length >= 2 && t.querySelector('tr td, tr th')); return im && tb; })(), hint: ['画像は <code>&lt;img src="画像のURL" alt="説明"&gt;</code>。alt（説明文）を必ず付ける。', '表は <code>&lt;table&gt;</code> の中に、行 <code>&lt;tr&gt;</code> を2つ。行の中は <code>&lt;th&gt;</code>（見出し）や <code>&lt;td&gt;</code>（データ）。'], answer: { code: '<img src="https://placehold.co/160x100" alt="好きな風景">\n<table border="1">\n  <tr><th>曜日</th><th>予定</th></tr>\n  <tr><td>月</td><td>HTML / CSS</td></tr>\n</table>', lang: 'html', mode: 'append' } },
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
    lead: '<b>見た目は同じ</b>の2つのページ。でも「ロボットの目」で見ると世界が違います。切り替えて<b>ジャンプ</b>を押してみよう。',
    why: {
      problem: '<code>&lt;div&gt;</code> だけで作ると、見た目は同じでも<b>どこが本文か誰にも分からない</b>',
      idea: '見た目ではなく<b>「役割」を表すタグ</b>を選ぶ → 読み上げ・検索エンジンが構造を理解できる',
      answer: '<code>header</code> / <code>nav</code> / <code>main</code> / <code>footer</code>',
      when: [['ページの上部（ロゴ・見出し）', '&lt;header&gt;'], ['メニュー', '&lt;nav&gt;'], ['主役の内容（1ページに1つ）', '&lt;main&gt;'], ['役割のない枠・CSS の都合だけ', '&lt;div&gt;']],
    },
    render(el) {
      const REG = [['header', 'サイトの顔', 'var(--ts)', 'ヘッダー'], ['nav', 'メニュー', 'var(--basic)', 'ナビ'], ['main', '主役の内容', 'var(--vue)', '本文'], ['footer', '足元', 'var(--pink)', 'フッター']];
      const SRC = {
        div: REG.map(([, t]) => `<div class="box">${t}</div>`).join('\n'),
        sem: REG.map(([tg, t]) => `<${tg}>${t}</${tg}>`).join('\n'),
      };
      let mode = 'div';
      const I = K.W.icon;
      const tabs = ['div', 'sem'].map((k) => h('button', { class: 'sm-tab', style: { '--c': k === 'div' ? 'var(--team)' : 'var(--ok)' }, onclick: () => { mode = k; msg.className = 'sm-msg'; msg.replaceChildren(); draw(); } }, k === 'div' ? 'div だけ' : '意味つきタグ'));
      const regs = REG.map(([, t, c]) => h('div', { class: 'sm-r', style: { '--rc': c } }, t));
      const page = h('div', { class: 'sm-page' }, regs);
      const cd = h('div'), list = h('div', { style: { display: 'grid', gap: '6px' } });
      const msg = h('div', { class: 'sm-msg' });
      const jump = h('button', { class: 'btn primary', style: { '--c': 'var(--ts)', justifyContent: 'center' }, onclick: () => {
        if (mode === 'div') { msg.className = 'sm-msg bad'; msg.replaceChildren(I('circle-x'), '本文が見つからない…全部ただの div。上から順に読むしかない'); }
        else { regs[2].classList.remove('pulse'); void regs[2].offsetWidth; regs[2].classList.add('pulse'); msg.className = 'sm-msg ok'; msg.replaceChildren(I('circle-check'), '<main> へ一発ジャンプ！ 検索エンジンも「ここが本文」と理解'); }
      } }, I('bot'), 'スクリーンリーダー：本文へジャンプ');
      function draw() {
        tabs.forEach((t, i) => t.classList.toggle('on', (i === 0) === (mode === 'div')));
        cd.replaceChildren(code(SRC[mode], 'html', { file: 'index.html', color: mode === 'div' ? 'var(--team)' : 'var(--ok)' }));
        list.replaceChildren(...REG.map(([tg, t, , jp]) => h('div', { class: 'sm-row' }, h('span', { class: 'tg' }, mode === 'div' ? '<div>' : '<' + tg + '>'), h('span', { class: 'mn' + (mode === 'div' ? ' q' : '') }, mode === 'div' ? '？（役割は不明）' : jp + '（' + t + '）'))));
      }
      el.append(h('div', { class: 'sm-tabs' }, tabs), h('div', { class: 'sm-wrap' },
        h('div', { class: 'col' }, lbl('見た目（どちらも同じ）'), page, cd),
        h('div', { class: 'sm-robot' }, h('div', { class: 'hd' }, I('bot'), 'ロボットの目（読み上げ・検索）'), list, jump, msg)));
      draw();
    },
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
          av: CH(['16日 HTML・CSS', '17日 TS', '19日 Vue', '25日 発表']),
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
          answer: 'PC / GitHub / VS Code / Zoom・Slack / ChatGPT',
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
          problem: 'ブラウザは「<b>どこからどこまでが見出し？</b>」を推測できない',
          idea: '開始タグと閉じタグで<b>範囲をはさみ</b>、属性で追加情報を渡す',
          answer: '<code>&lt;要素 属性="値"&gt;中身&lt;/要素&gt;</code>',
          when: [['範囲と種類を伝える', 'タグ（要素名）'], ['追加情報（リンク先・目印）', '属性（href, class, src …）']],
          pv: C('私の自己紹介\n名前は Lam です。\n', { err: [1, 2] }),
          iv: F(['brackets|開始タグ', 'type|中身', 'brackets|閉じタグ'], null, 'はさんで範囲を伝える'),
          av: C('<a href="/home">Home</a>', { ok: [1] }),
        },
        'HTML は「木」': {
          problem: 'タグの入れ子を間違えると、<b>表示が崩れ</b>て CSS・JS も効かない',
          idea: 'HTML は<b>親子関係の木</b>。インデントの深さ＝木の深さ',
          answer: 'DOM ツリー（ブラウザが作る構造）',
          when: [['要素の中に別の要素', '子（入れ子）'], ['同じ階層に並ぶ', '兄弟']],
          pv: C('<ul>\n  <li>りんご\n</ul>', { err: [2] }),
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
          pv: C('・りんご\n・みかん\n・ぶどう', { err: [1, 2, 3], lang: 'text' }),
          iv: F(['list|リストと伝える', 'wand-sparkles|記号は自動']),
          av: C('<ul>\n  <li>りんご</li>\n</ul>', { ok: [1, 2, 3] }),
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
        'HTML は「木」': { lead: 'ブラウザは HTML を読んで、<b>木の形（DOM ツリー）</b>にして覚えます。左を書き換えると、右の木もすぐ変わります。', problem: 'タグの入れ方を間違えると<b>表示が崩れる</b>。CSS や JS も効かなくなる', idea: 'タグは「<b>親の中に子が入る</b>」形。字下げの深さ＝木の深さ', answer: 'DOM ツリー（ブラウザが頭の中に作る木）' },
        'なぜ意味のあるタグ？': { lead: '見た目は同じ2つのページ。でも、ロボット（読み上げ・検索）から見ると全然ちがいます。切り替えて、ジャンプを押してみよう。', problem: '<code>&lt;div&gt;</code> だけだと、見た目は同じでも<b>「どこが本文か」を機械が分からない</b>', idea: '<b>「何の部分か」</b>を表すタグを選ぶ。読み上げソフトや検索エンジンにも伝わる' },
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
      pv: cd('memo.txt', 'text', '16日 ？\n17日 ？\n19日 ？  ← 何をやる？', { err: [1, 2, 3], keys: { 3: 'plan' } }),
      iv: cd('地図', 'text', '16日 HTML / CSS / Git\n17日 TypeScript\n19日 Vue.js\n25日 発表', { idea: [1, 2, 3, 4], keys: { 1: 'plan' } }),
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
      problem: 'どこまでが見出しか不明', idea: 'タグで範囲をはさむ', answer: '<code>&lt;a href&gt;…&lt;/a&gt;</code>',
      pv: cd('index.html', 'text', '私の自己紹介\n名前は Lam です。', { err: [1, 2], keys: { 1: 'tag' } }),
      iv: cd('index.html', 'html', '<h1 class="title">\n  私の紹介\n</h1>', { idea: [1, 3], keys: { 1: 'tag' } }),
      av: cd('index.html', 'html', '<a href="/home">Home</a>\n<img src="me.png" alt="私">', { ok: [1, 2], keys: { 1: 'tag' } }),
    });
    over('html', 'HTML は「木」', {
      problem: '閉じ忘れで表示が崩れる', idea: '親の中に子が入る「木」', answer: 'ブラウザが木にして扱う',
      pv: cd('index.html', 'html', '<ul>\n  <li>りんご\n</ul>', { err: [2], keys: { 2: 'tree' } }),
      iv: cd('DOM ツリー', 'text', 'ul\n├ li  りんご\n├ li  みかん\n└ li  ぶどう', { idea: [2, 3, 4], keys: { 1: 'tree' } }),
      av: cd('index.html', 'html', '<ul>\n  <li>りんご</li>\n  <li>みかん</li>\n</ul>', { ok: [2, 3], keys: { 2: 'tree' } }),
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
      pv: cd('index.html', 'text', '・りんご\n・みかん\n・ぶどう', { err: [1, 2, 3], keys: { 1: 'list' } }),
      iv: cd('index.html', 'html', '<ul>\n  <li>りんご</li>\n</ul>\n<!-- 「・」は自動で付く -->', { idea: [1, 2], keys: { 1: 'list' } }),
      av: cd('index.html', 'html', '<ul>\n  <li>りんご</li>\n  <li>みかん</li>\n</ul>\n<ol><li>手順1</li></ol>', { ok: [1, 5], keys: { 1: 'list' } }),
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
