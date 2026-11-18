/* Vue.js 紹介 を「基礎 → 少しずつ」の順に組み直す。
   vue.js の後に読み込み、K.lessons['vue-intro'] の scenes を差し替える。
   旧シーン（データを変えるだけ／リアクティブの仕組み／Options と Composition）は、ドリルとの対応があるので名前を変えずに残す。 */
(function () {
  'use strict';
  const K = window.KENSHU;
  if (!K || !K.lessons || !K.lessons['vue-intro']) return;
  const { h, code, stepper, lbl, style, sleep } = K.W;
  const C = 'var(--vue)';

  style('vi', `
  .vi-eq{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px;align-items:stretch}
  .vi-eq .vc-do small,.vi-eq .vc-dont small{font-size:.84rem;line-height:1.7}
  .vi-eq .vc-do,.vi-eq .vc-dont{padding:14px}
  .vi-log:empty::before{content:'ボタンを押すと、ここに流れが順番に並ぶ';color:var(--mute);font-weight:700;font-size:.86rem;padding:.4em .2em}
  @media(max-width:980px){.vi-eq{grid-template-columns:1fr}}
  .vi-panel{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:14px;display:grid;gap:10px;align-content:start;min-width:0}
  .vi-panel>*{min-width:0;max-width:100%}.vi-panel pre.code{max-width:100%;overflow-x:auto}
  .vi-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
  .vi-row>.btn{min-height:40px;display:inline-flex;align-items:center;justify-content:center}
  .vi-chip{display:inline-flex;align-items:center;gap:.4em;padding:.35em .9em;border-radius:8px;font:800 .84rem var(--font);border:2px solid var(--cc,var(--line));background:color-mix(in srgb,var(--cc,var(--line)) 14%,var(--card2));cursor:pointer;transition:.2s;user-select:none}
  .vi-chip.off{opacity:.45;border-style:dashed}
  .vi-map{display:flex;flex-wrap:wrap;gap:8px;align-items:stretch}
  .vi-nd{all:unset;cursor:pointer;box-sizing:border-box;padding:12px 14px;border-radius:12px;border:2px solid var(--line);background:var(--card);display:grid;gap:3px;justify-items:center;text-align:center;font-weight:800;font-size:.85rem;flex:1 1 0;min-width:130px;transition:.3s}
  .vi-nd b{font-size:1.9rem}.vi-nd small{color:var(--mute);font-weight:700;font-size:.78rem}
  .vi-nd.on{border-color:var(--vue);background:color-mix(in srgb,var(--vue) 18%,var(--card));transform:translateY(-4px);box-shadow:0 12px 24px -12px var(--vue)}
  .vi-nd.me{outline:3px dashed var(--team);outline-offset:3px}
  .vi-ar{align-self:center;color:var(--mute);font-weight:900;font-size:1.2rem}
  .vi-box{padding:10px 12px;border-radius:8px;border:1px solid var(--line);background:var(--card2);display:grid;gap:3px;font-size:.88rem;line-height:1.7}
  .vi-box small{color:var(--mute);font-weight:800;font-size:.8rem}
  .vi-msg{padding:.55em .9em;border-radius:8px;font-weight:800;font-size:.86rem;background:var(--card2);border:1px solid var(--line)}
  .vi-msg.ok{color:var(--ok)}.vi-msg.ng{color:var(--bad)}.vi-msg.w{color:var(--team)}
  .vi-log{display:grid;gap:4px;min-height:140px;align-content:start}
  .vi-log div{padding:.4em .8em;border-radius:6px;background:var(--card2);border:1px solid var(--line);font-size:.84rem;font-weight:700;animation:capin .35s both}
  .vi-lb{font:800 .78rem var(--font);color:var(--mute)}
  .vi-scr{background:#fff;color:#222;border-radius:10px;padding:18px;display:grid;gap:10px;justify-items:start;min-height:150px;border:1px solid var(--line);align-content:start}
  .vi-st{flex:1 1 0;padding:1em;border-radius:8px;border:2px solid var(--line);background:var(--card2);text-align:center;min-width:120px;transition:.3s}
  .vi-st small{display:block;font:700 .78rem var(--mono);color:var(--mute)}.vi-st b{font:900 1.6rem var(--mono)}
  .vi-st.lit{border-color:var(--vue);box-shadow:0 0 22px -6px var(--vue);transform:scale(1.06)}
  .vi-st.stale{border-color:var(--bad)}
  .vi-pg{border:2px solid var(--line);border-radius:12px;padding:10px;display:grid;gap:8px;background:var(--bg2)}
  .vi-pg>div{padding:8px 10px;border-radius:8px;border:2px dashed var(--mute);background:var(--card);font-weight:800;font-size:.84rem;transition:.25s}
  .vi-pg .lit{border-style:solid;border-color:var(--vue);background:color-mix(in srgb,var(--vue) 22%,var(--card));transform:scale(1.02)}
  .vi-pg .pop{animation:vipop .5s}
  @keyframes vipop{40%{transform:scale(1.07);box-shadow:0 0 22px var(--vue)}}
  `);

  const chip = (t, c, on, f) => h('span', { class: 'vi-chip' + (on ? '' : ' off'), style: { '--cc': c }, onclick: f }, t);
  const note = (t, c) => h('div', { class: 'vi-msg ' + (c || 'w') }, t);
  /* UI ⇄ コードの hover 連動（K.vs.link）。コードを作り直すシーン用：pre は毎回 getPre() から引き、再描画のたびに返り値 run() を呼ぶ */
  const linkLive = (root, getPre, map, rest) => {
    const px = { get lines() { const p = getPre(); return p ? p.lines : []; }, setHi: (a, c) => { const p = getPre(); if (p) p.setHi(a, c); } };
    return () => { if (K.vs && K.vs.link && root) K.vs.link(root, px, map, { rest }); };
  };
  const multiPre = (pres) => ({ get lines() { return pres().flatMap((p) => p.lines); }, setHi(arr, cls) { let o = 0; pres().forEach((p) => { const n = p.lines.length; p.setHi((arr || []).filter((i) => i > o && i <= o + n).map((i) => i - o), cls); o += n; }); } });
  const tag = (el, k) => { if (el && el.setAttribute) el.setAttribute('data-k', k); return el; };

  /* ① フロントエンドって何？ */
  function feMap() {
    const N = [
      ['user', '🙋', 'ユーザー', '相談したい人', 'ブラウザを開き、画面を見て、ボタンを押す人。', 'お客さん'],
      ['fe', '🖥️', 'フロントエンド', 'HTML・CSS・JavaScript', 'ユーザーの目の前の「画面」。見た目を作り、押されたときの動きを決める。ブラウザの中で動く。★この研修で作る部分', 'ホール係（注文を聞く・料理を出す）'],
      ['be', '⚙️', 'バックエンド', 'サーバーのプログラム', '「この日は空いてる？」に答え、予約のルールを守る裏方。ユーザーからは見えない。', '厨房（注文を作る）'],
      ['db', '🗄️', 'データベース', '予約・ユーザーのデータ', 'データを保存しておく倉庫。', '食材の倉庫'],
    ];
    let cur = 1, tk = 0;
    const map = h('div', { class: 'vi-map' }), det = h('div'), log = h('div', { class: 'vi-log' });
    const draw = () => {
      map.replaceChildren(...N.flatMap((n, i) => [h('button', { class: 'vi-nd' + (i === cur ? ' on' : '') + (n[0] === 'fe' ? ' me' : ''), onclick: () => { tk++; cur = i; draw(); } }, h('b', n[1]), n[2], h('small', n[3])), i < N.length - 1 ? h('span', { class: 'vi-ar' }, '⇄') : null].filter(Boolean)));
      const n = N[cur];
      det.replaceChildren(h('div', { class: 'vi-box' }, h('small', n[2]), n[4], h('small', { style: { marginTop: '4px' } }, '🍽 レストランでたとえると：' + n[5])));
    };
    const STEPS = [[1, '🖱 ① 予約ボタンが押される（フロント）'], [2, '📨 ② 「この日時で予約して」とサーバーにお願い（API）'], [3, '💾 ③ データベースに保存'], [2, '✅ ④ 「保存できたよ」とサーバーが返事'], [1, '🖥 ⑤ 返事を受けて、画面に「予約しました」と表示（フロント）']];
    const run = async () => {
      const my = ++tk; log.replaceChildren();
      for (const [i, t] of STEPS) { if (my !== tk) return; cur = i; draw(); log.append(h('div', t)); await sleep(950); }
    };
    draw();
    return h('div', { style: { display: 'grid', gap: '12px' } },
      h('div', { class: 'vi-panel' }, lbl('Web アプリは4つの登場人物でできている（押して役割を見る）'), map, det),
      h('div', { class: 'vi-eq' },
        h('div', { class: 'vi-panel' }, lbl('「予約する」を押すと、何が起きる？'), h('div', { class: 'vi-row' }, h('button', { class: 'btn primary', style: { '--c': C }, onclick: run }, '▶ 予約ボタンを押す')), log),
        h('div', { class: 'vi-panel' }, lbl('フロントエンドの仕事は3つ'), h('div', { class: 'vi-box' }, h('b', '① 見せる'), '画面の形と見た目を作る（HTML・CSS）'), h('div', { class: 'vi-box' }, h('b', '② 動かす'), 'クリックや入力に反応する（JavaScript）'), h('div', { class: 'vi-box' }, h('b', '③ つなぐ'), 'サーバーとデータをやりとりして、結果を画面に出す（API）'), note('この研修では、TypeScript と Vue.js で「②動かす」を作る。'))));
  }

  /* ② HTML・CSS・JavaScript の役割 */
  function layers() {
    let lv = 0, n = 0;
    const SRC = [
      '<!-- index.html -->\n<h3>弁護士に相談</h3>\n<p>初回は30分無料です。</p>\n<button>予約する</button>',
      '<!-- index.html -->\n<h3>弁護士に相談</h3>\n<p>初回は30分無料です。</p>\n<button>予約する</button>\n\n/* style.css */\nbutton {\n  background: #2fd4a4;\n  border-radius: 8px;\n  padding: 10px 20px;\n}',
      '<!-- index.html -->\n<h3>弁護士に相談</h3>\n<p>初回は30分無料です。</p>\n<button id="btn">予約する</button>\n\n/* style.css */\nbutton { background: #2fd4a4; border-radius: 8px; }\n\n// main.js\nbtn.onclick = () => {\n  btn.textContent = "予約しました ✓"\n}',
    ];
    const SAY = ['<b>HTML ＝ 骨組み</b>。何が書いてあるか（見出し・文章・ボタン）を決める。見た目は素っ気ない。', '<b>CSS ＝ 内装</b>。色・形・余白で見た目を整える。ボタンが「ボタンらしく」なった。', '<b>JavaScript ＝ 電気</b>。押したときの動き。ボタンを押してみよう。'];
    const host = h('div'), scr = h('div', { class: 'vi-scr' }), say = h('div', { class: 'vi-msg w' });
    let curPre = null, run = null;
    const draw = () => {
      host.replaceChildren(curPre = code(SRC[lv], 'html', { color: C, file: ['HTML だけ', 'HTML ＋ CSS', 'HTML ＋ CSS ＋ JavaScript'][lv] }));
      const b = h('button', lv === 0 ? {} : { style: { background: '#2fd4a4', borderRadius: '8px', padding: '10px 20px', border: 'none', fontWeight: 800, cursor: lv === 2 ? 'pointer' : 'default' } }, '予約する');
      if (lv === 2) b.onclick = () => { b.textContent = '予約しました ✓'; b.animate([{ transform: 'scale(1.15)' }, { transform: 'scale(1)' }], { duration: 250 }); };
      scr.replaceChildren(tag(h('h3', { style: lv ? { color: '#0a7' } : {} }, '弁護士に相談'), 'h3'), tag(h('p', '初回は30分無料です。'), 'p'), tag(b, 'btn'));
      say.innerHTML = SAY[lv];
      run && run();
    };
    draw();
    const root = h('div', { class: 'vi-eq' },
      h('div', { class: 'vi-panel' }, lbl('① 1つずつ足していく'), h('div', { class: 'vi-row' }, ...['HTML だけ', '＋ CSS', '＋ JavaScript'].map((t, i) => chip(t, ['var(--basic)', 'var(--pink)', 'var(--team)'][i], true, () => { lv = i; draw(); }))), host, say),
      h('div', { class: 'vi-panel' }, lbl('② 画面（ブラウザで見ると）'), scr, note('3つは「役割分担」。1つでも欠けると、見た目だけ／動かない／骨組みだけ、になる。')));
    run = linkLive(root, () => curPre, { h3: ['<h3>'], p: ['<p>'], btn: ['<button', 'button {', 'background', 'border-radius', 'padding', 'btn.onclick', 'btn.textContent'] }, () => []); run();
    return root;
  }

  /* ⓪ JS の基本：変数・関数・よく使う道具（<script setup lang="ts"> の中で） */
  function jsBasics() {
    const T = ['変数（const / let）', '関数', 'よく使う道具'];
    let tab = 0, n = 5, ti = 0;
    const root = h('div', { style: { display: 'grid', gap: '12px' } });
    const tabs = () => h('div', { class: 'vi-row' }, ...T.map((t, i) => h('span', { class: 'vi-chip' + (i === tab ? '' : ' off'), style: { '--cc': C }, onclick: () => { tab = i; draw(); } }, ['📦', '⚙️', '🧰'][i] + ' ' + t)));
    const VAR = "<script setup lang=\"ts\">\nconst title = '相談ナビ'\nconst slots = 3\nconst tags = ['離婚', '相続']\nconst user = { name: 'Lam', age: 30 }\n\nlet count = 0\n</script>\n\n<template>\n  <h1>{{ title }}</h1>\n  <p>残り {{ slots }} 枠</p>\n  <p>{{ tags[0] }} ／ {{ user.name }}</p>\n  <p>count：{{ count }}</p>\n</template>";
    const varTab = () => {
      const G = [['文字（string）', [2, 11], 'h', 'var(--pink)'], ['数（number）', [3, 12], 's', 'var(--ts)'], ['配列（array）', [4, 13], 't', 'var(--basic)'], ['オブジェクト', [5, 13], 't', 'var(--team)'], ['let ＝ 書き換える値', [7, 14], 'c', 'var(--violet)']];
      const pre = code(VAR, 'vue', { color: C, file: 'Basics.vue', dim: true });
      const el = {}; const pv = h('div', { class: 'vi-scr' }, el.h = h('h1', { style: { margin: 0, fontSize: '1.3rem' } }, '相談ナビ'), el.s = h('p', { style: { margin: 0 } }, '残り 3 枠'), el.t = h('p', { style: { margin: 0 } }, '離婚 ／ Lam'), el.c = h('p', { style: { margin: 0 } }, 'count：0'));
      const hi = (g) => { pre.setHi(g ? g[1] : []); Object.values(el).forEach((e) => { e.style.outline = 'none'; }); if (g) { el[g[2]].style.outline = '3px solid ' + g[3]; el[g[2]].style.outlineOffset = '2px'; } };
      [['h', 'title'], ['s', 'slots'], ['t', 'tags'], ['c', 'count']].forEach(([e, k]) => tag(el[e], k));
      const out = h('div', { class: 'vi-eq' }, h('div', { class: 'vi-panel' }, pre, h('div', { class: 'vi-row' }, ...G.map((g) => h('span', { class: 'vi-chip', style: { '--cc': g[3] }, onmouseenter: () => hi(g), onmouseleave: () => hi(null), onclick: () => hi(g) }, g[0])))),
        h('div', { class: 'vi-panel' }, lbl('画面に出る結果（種類を押すと光る）'), pv, h('div', { class: 'vi-eq' }, h('div', { class: 'vc-do' }, h('b', '✓ const が基本'), h('small', '変えない値は const。迷ったら const')), h('div', { class: 'vc-dont' }, h('b', '✖ let は必要なときだけ'), h('small', '書き換える値だけ。var は使わない'))), h('div', { class: 'vi-msg w' }, '⚠ let の count を変えても、画面は変わらない → 次の「ref」で解決')));
      linkLive(out, () => pre, { title: ['const title', '{{ title }}'], slots: ['const slots', '{{ slots }}'], tags: ['const tags', 'const user', '{{ tags[0] }}'], count: ['let count', '{{ count }}'] }, () => [])();
      return out;
    };
    const fnTab = () => {
      const src = () => `<script setup lang="ts">\nfunction double(n: number): number {\n  return n * 2\n}\n\nconst triple = (n: number) => n * 3\n</script>\n\n<template>\n  <p>double(${n}) ＝ {{ double(${n}) }}</p>\n  <p>triple(${n}) ＝ {{ triple(${n}) }}</p>\n</template>`;
      const host = h('div'), out = h('div', { class: 'vi-scr', style: { minHeight: 0 } }), flow = h('div', { class: 'vi-row', style: { justifyContent: 'center', fontWeight: 900, fontSize: '1.1rem' } });
      let fPre = null, fRun = null;
      const inp = h('input', { type: 'number', value: n, style: { width: '90px', padding: '.4em .6em', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--bg2)', color: 'var(--text)', font: '800 1rem var(--mono)' }, oninput: (e) => { n = +e.target.value || 0; paint(true); } });
      tag(inp, 'arg');
      const paint = (pop) => {
        const pre = fPre = code(src(), 'vue', { color: C, file: 'Func.vue', dim: true, hi: [2, 3, 4, 6] }); host.replaceChildren(pre);
        out.replaceChildren(tag(h('p', { style: { margin: 0, fontWeight: 800 } }, `double(${n}) ＝ ${n * 2}`), 'double'), tag(h('p', { style: { margin: 0, fontWeight: 800 } }, `triple(${n}) ＝ ${n * 3}`), 'triple'));
        flow.replaceChildren(tag(h('span', { class: 'vi-chip', style: { '--cc': 'var(--ts)' } }, '入力 ' + n), 'arg'), '➜', tag(h('span', { class: 'vi-chip', style: { '--cc': C } }, '⚙ double'), 'double'), '➜', h('span', { class: 'vi-chip', style: { '--cc': 'var(--ok)' } }, '出力 ' + n * 2));
        if (pop) flow.animate([{ transform: 'scale(1.06)' }, { transform: 'none' }], { duration: 250 });
        fRun && fRun();
      };
      paint();
      const fRoot = h('div', { class: 'vi-eq' }, h('div', { class: 'vi-panel' }, host, h('div', { class: 'vi-row' }, h('span', { class: 'vi-lb' }, 'n ＝'), inp, h('span', { class: 'vi-lb' }, '← 数を変えてみる'))),
        h('div', { class: 'vi-panel' }, lbl('入力 ➜ 関数 ➜ 出力'), flow, lbl('画面に出る結果'), out,
          h('div', { class: 'vi-eq' }, h('div', { class: 'vc-do' }, h('b', '✓ 関数'), h('small', '同じ処理を名前で呼べる。template でも使える')), h('div', { class: 'vc-dont' }, h('b', '✖ 長い関数'), h('small', '20行をこえたら分ける。名前は動詞で'))),
          h('div', { class: 'vi-box' }, h('small', '2つの書き方'), h('b', 'function 名前() {}　＝　const 名前 = () => {}　どちらも同じ働き'))));
      fRun = linkLive(fRoot, () => fPre, { double: ['function double', 'return n * 2', '<p>double('], triple: ['const triple', '<p>triple('], arg: ['(n: number)'] }, () => [2, 3, 4, 6]); fRun();
      return fRoot;
    };
    const TOOL = [
      ['数える（length）', 'cases.length', '3', '配列の件数'],
      ['絞り込む（filter）', 'cases.filter((c) => !c.done)', '離婚の相談／相続の相談', '条件に合うものだけ'],
      ['取り出す（map）', 'cases.map((c) => c.title)', '離婚の相談／相続の相談／労働の相談', '1件ずつ変換'],
      ['文字をつなぐ', '`残り ${slots} 枠`', '残り 3 枠', 'バッククォート ＋ ${ }'],
      ['数を整える', '(1234567).toLocaleString()', '1,234,567', '3桁カンマ'],
    ];
    const toolTab = () => {
      const t = TOOL[ti];
      const src = `<script setup lang="ts">\nconst cases = [\n  { title: '離婚の相談', done: false },\n  { title: '相続の相談', done: false },\n  { title: '労働の相談', done: true },\n]\nconst slots = 3\n\nconst result = ${t[1]}\n</script>\n\n<template>\n  <p>{{ result }}</p>\n</template>`;
      const tp = code(src, 'vue', { color: C, file: 'Tools.vue', dim: true, hi: [9, 13] });
      const tRoot = h('div', { class: 'vi-eq' }, h('div', { class: 'vi-panel' }, tp, h('div', { class: 'vi-row' }, ...TOOL.map((x, i) => h('span', { class: 'vi-chip' + (i === ti ? '' : ' off'), style: { '--cc': C }, onclick: () => { ti = i; draw(); } }, x[0])))),
        h('div', { class: 'vi-panel' }, lbl('画面に出る結果'), h('div', { class: 'vi-scr', style: { minHeight: 0 } }, tag(h('p', { style: { margin: 0, fontWeight: 900, fontSize: '1.1rem' } }, t[2]), 'result')), tag(h('div', { class: 'vi-box' }, h('small', 'この道具は'), h('b', t[3])), 'tool'),
          h('div', { class: 'vi-eq' }, h('div', { class: 'vc-do' }, h('b', '✓ 配列を使うとき'), h('small', 'データを1つの配列に。filter / map で加工')), h('div', { class: 'vc-dont' }, h('b', '✖ 元の配列を直接書き換え'), h('small', '画面が変わらないことがある。新しい配列を作る')))));
      linkLive(tRoot, () => tp, { result: ['{{ result }}'], tool: ['const result'], data: ['const cases', 'const slots'] }, () => [9, 13])();
      return tRoot;
    };
    function draw() { root.replaceChildren(tabs(), [varTab, fnTab, toolTab][tab]()); }
    draw();
    return root;
  }

  /* ③ データを変えるだけ：データが3か所の画面へ届く様子（手で直す vs Vue） */
  style('vi3', `
  .v3-data{justify-self:center;display:inline-flex;align-items:center;gap:12px;height:56px;padding:0 22px;border-radius:14px;border:3px solid var(--vue);background:color-mix(in srgb,var(--vue) 16%,var(--card));text-align:center;font-weight:900;transition:.3s}
  .v3-data small{display:block;font:800 .82rem var(--mono);color:var(--mute)}.v3-data b{font:900 1.9rem/1 var(--mono);min-width:1.2ch}
  .v3-bar{display:flex;gap:12px;align-items:stretch;justify-content:center;flex-wrap:wrap}
  .v3-bar>.btn{height:56px;padding:0 1.5em;font-size:1rem;display:inline-flex;align-items:center;gap:.5em}
  .v3-data.pop{animation:v3p .6s}@keyframes v3p{40%{transform:scale(1.18);box-shadow:0 0 30px var(--vue)}}
  .v3-pt{position:relative;padding:10px 12px;border-radius:10px;border:2px solid #cfd4e2;background:#fff;color:#223;display:flex;gap:10px;align-items:center;font-weight:800;transition:.3s}
  .v3-pt>i{font-style:normal;width:26px;height:26px;border-radius:50%;background:var(--n);color:#06101f;display:grid;place-items:center;font-weight:900;font-size:.8rem;flex:none}
  .v3-pt.flash{animation:v3f .7s}@keyframes v3f{40%{background:#cdf5e6;border-color:#0a7}}
  .v3-pt.stale{border-color:#e33;background:#fff0f0}
  .v3-pt.stale::after{content:'古い！';position:absolute;right:8px;top:-9px;background:#e33;color:#fff;font:900 .66rem var(--font);padding:.1em .6em;border-radius:6px}
  .v3-ln{display:flex;gap:8px;align-items:center;padding:5px 10px;border-radius:6px;border-left:5px solid var(--n);background:var(--card2);font:700 .78rem var(--mono);cursor:pointer;transition:.25s}
  .v3-ln.off{border-left-style:dashed;opacity:.5;background:color-mix(in srgb,var(--bad) 14%,var(--card2))}
  .v3-ln.run{background:color-mix(in srgb,var(--n) 30%,var(--card2));opacity:1}
  .v3-ln input{accent-color:var(--vue)}
  `);
  style('vi3b', `
  pre.code .ln.h1{background:rgba(255,107,157,.24);border-left-color:#ff6b9d}pre.code .ln.h2{background:rgba(91,157,255,.24);border-left-color:#5b9dff}pre.code .ln.h3{background:rgba(255,180,84,.26);border-left-color:#ffb454}pre.code .ln.hd{background:rgba(47,212,164,.26);border-left-color:#2fd4a4}
  pre.code.dim .ln.h1,pre.code.dim .ln.h2,pre.code.dim .ln.h3,pre.code.dim .ln.hd{opacity:1}
  .v3-tg{display:inline-flex;gap:.4em;align-items:center;padding:.25em .8em;border-radius:8px;border:2px solid var(--n);font:800 .78rem var(--font);cursor:pointer;background:color-mix(in srgb,var(--n) 14%,var(--card2));transition:.2s}
  .v3-tg.off{border-style:dashed;opacity:.6;background:color-mix(in srgb,var(--bad) 18%,var(--card2))}
  .v3-pt:hover,.v3-data:hover{outline:3px solid var(--n,var(--vue));outline-offset:2px;cursor:pointer}
  `);
  function liveCompare() {
    const MAX = 3; let n = MAX, busy = false;
    const COL = ['#ff6b9d', '#5b9dff', '#ffb454'];
    const host = h('div', { style: { position: 'relative', display: 'grid', gap: '12px' } });
    const wrote = [true, true, false];   // ③ は最初は「書き忘れ」
    const HTML = '<p id="remain">残り 3 枠</p>\n<span id="badge">受付中</span>\n<button id="btn">予約する</button>\n\n<script src="main.js"></script>';
    const jsSrc = () => {
      const L = ["remainEl.textContent = '残り ' + slots + ' 枠'", "badgeEl.textContent = slots === 0 ? '満席' : '受付中'", 'btnEl.disabled = slots === 0'].map((t, i) => (wrote[i] ? '  ' : '  // ') + t);
      return `const remainEl = document.getElementById('remain')\nconst badgeEl = document.getElementById('badge')\nconst btnEl = document.getElementById('btn')\n\nlet slots = 3\n\nfunction reserve(): void {\n  slots--\n${L.join('\n')}\n}\n\nbtnEl.addEventListener('click', reserve)`;
    };
    const VUE = "<script setup lang=\"ts\">\nimport { ref } from 'vue'\n\nconst slots = ref(3)\n\nfunction reserve(): void {\n  slots.value--\n}\n</script>\n\n<template>\n  <p>残り {{ slots }} 枠</p>\n  <span>{{ slots === 0 ? '満席' : '受付中' }}</span>\n  <button :disabled=\"slots === 0\" @click=\"reserve\">予約する</button>\n</template>";
    const KEYS = { m_html: [['id="remain"'], ['id="badge"'], ['id="btn"']], m_js: [['remainEl'], ['badgeEl'], ['btnEl']], v: [['{{ slots }}'], ["slots === 0 ? '満席'"], [':disabled']] };
    const DATA = { m_js: ['let slots', 'slots--'], v: ['ref(3)', 'slots.value--'] };
    const lines = (src, keys) => { const o = []; src.split('\n').forEach((l, i) => { if (keys.some((k) => l.includes(k))) o.push(i + 1); }); return o; };
    let htmlPre, jsPre, vuePre;
    const setAll = (which) => {   // which: null=3色すべて、0/1/2=その1つだけ、'd'=データ
      const apply = (pre, src, kk, dk) => { if (!pre) return; ['h1', 'h2', 'h3', 'hd'].forEach((c) => pre.setHi([], c)); if (which === 'd') { pre.setHi(lines(src, dk || []), 'hd'); return; } [0, 1, 2].forEach((i) => { if (which === null || which === i) pre.setHi(lines(src, kk[i]), 'h' + (i + 1)); }); };
      apply(htmlPre, HTML, KEYS.m_html); apply(jsPre, jsSrc(), KEYS.m_js, DATA.m_js); apply(vuePre, VUE, KEYS.v, DATA.v);
    };
    const mkCard = () => {
      const remain = h('span'), badge = h('span', { style: { padding: '.1em .8em', borderRadius: '999px', fontSize: '.8rem' } }), btn = h('button', { style: { padding: '.4em 1.2em', borderRadius: '8px', border: 'none', fontWeight: 800, background: '#2fd4a4', color: '#06101f' } });
      const row = (i, el) => { const r = h('div', { class: 'v3-pt', 'data-k': 'p' + i, style: { '--n': COL[i], '--c': COL[i] }, onmouseenter: () => setAll(i), onmouseleave: () => setAll(null) }, h('i', String(i + 1)), el); return r; };
      const P = [row(0, remain), row(1, badge), row(2, btn)];
      const paint = (i, v) => { if (i === 0) remain.textContent = '残り ' + v + ' 枠'; if (i === 1) { badge.textContent = v === 0 ? '満席' : '受付中'; badge.style.background = v === 0 ? '#ffd0d6' : '#cdf5e6'; } if (i === 2) { btn.textContent = v === 0 ? '予約できません' : '予約する'; btn.disabled = v === 0; btn.style.opacity = v === 0 ? .35 : 1; } };
      [0, 1, 2].forEach((i) => paint(i, MAX));
      return { el: h('div', { class: 'vi-scr', style: { gap: '10px', justifyItems: 'stretch', minHeight: 0 } }, ...P), P, paint, flash: (i) => { P[i].classList.remove('flash', 'stale'); void P[i].offsetWidth; P[i].classList.add('flash'); }, stale: (i, on) => P[i].classList.toggle('stale', on) };
    };
    const M = mkCard(), V = mkCard();
    const jsHost = h('div'), togs = h('div', { class: 'vi-row' });
    /* コードの行にカーソル → 対応する ①②③ の画面部品も光る（UI → コードは既存の setAll） */
    const fromCode = (pre, which) => { if (!pre || pre.__v3) return; pre.__v3 = 1; pre.lines.forEach((ln) => {
      ln.addEventListener('mouseenter', () => { const t = ln.textContent; const i = [0, 1, 2].find((k) => KEYS[which][k].some((x) => t.includes(x))); if (i === undefined) return; setAll(i); [M, V].forEach((c) => c.P[i].classList.add('vs-hot')); });
      ln.addEventListener('mouseleave', () => { setAll(null); [M, V].forEach((c) => c.P.forEach((p) => p.classList.remove('vs-hot'))); });
    }); };
    const drawJs = () => { jsPre = code(jsSrc(), 'js', { color: C, file: 'main.js（Vue なし）', dim: true }); jsHost.replaceChildren(jsPre); setAll(null); fromCode(jsPre, 'm_js'); };
    const drawTogs = () => togs.replaceChildren(h('span', { class: 'vi-lb' }, '書く行：'), ...[0, 1, 2].map((i) => h('span', { class: 'v3-tg' + (wrote[i] ? '' : ' off'), style: { '--n': COL[i] }, title: '押すと、その行を書く／書き忘れる', onclick: () => { wrote[i] = !wrote[i]; drawTogs(); drawJs(); } }, ['①', '②', '③'][i] + (wrote[i] ? ' 書いた' : ' 書き忘れ'))));
    htmlPre = code(HTML, 'html', { color: C, file: 'index.html（Vue なし）', dim: true });
    vuePre = code(VUE, 'vue', { color: C, file: 'Reserve.vue（Vue あり）', dim: true });
    drawJs(); drawTogs(); fromCode(htmlPre, 'm_html'); fromCode(vuePre, 'v');
    const dataBox = h('div', { class: 'v3-data', style: { '--n': '#2fd4a4' }, onmouseenter: () => setAll('d'), onmouseleave: () => setAll(null) }, h('small', 'データ（slots）＝'), h('b', String(MAX)));
    const stat = h('div', { class: 'vi-msg w', style: { textAlign: 'center' } }, '👇 ボタンを押して、2つを比べよう（色が同じ所は つながっている）');
    const pk = (a, b, t, c) => { if (!a || !b) return Promise.resolve(); const H = host.getBoundingClientRect(), A = a.getBoundingClientRect(), B = b.getBoundingClientRect(); const ax = A.left - H.left + A.width / 2, ay = A.top - H.top + A.height / 2; const p = h('div', { style: { position: 'absolute', zIndex: 9, padding: '.1em .7em', borderRadius: '8px', font: '800 .72rem var(--mono)', background: c, color: '#06101f', pointerEvents: 'none', left: ax + 'px', top: ay + 'px', whiteSpace: 'nowrap' } }, t); host.append(p); const dx = B.left - H.left + B.width / 2 - ax, dy = B.top - H.top + B.height / 2 - ay; return p.animate([{ transform: 'translate(-50%,-50%) scale(.6)', opacity: 0 }, { transform: 'translate(-50%,-50%)', opacity: 1, offset: .15 }, { transform: `translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px))`, opacity: 1, offset: .85 }, { transform: `translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(.6)`, opacity: 0 }], { duration: 750, easing: 'ease-in-out' }).finished.catch(() => {}).then(() => p.remove()); };
    const reset = () => { n = MAX; dataBox.lastChild.textContent = n; [0, 1, 2].forEach((i) => { M.paint(i, n); V.paint(i, n); M.stale(i, false); }); stat.textContent = '👇 ボタンを押して、2つを比べよう（色が同じ所は つながっている）'; stat.className = 'vi-msg w'; setAll(null); };
    const go = async () => {
      if (busy || n === 0) return; busy = true; n--;
      dataBox.lastChild.textContent = n; dataBox.classList.remove('pop'); void dataBox.offsetWidth; dataBox.classList.add('pop'); setAll('d');
      const ms = [0, 1, 2].map((i) => (async () => { if (wrote[i]) { await pk(dataBox, M.P[i], '①②③'[i] + ' 書いた行', COL[i]); M.paint(i, n); M.flash(i); } else { await pk(dataBox, M.P[i], '✖ 書き忘れ', '#ff6b6b'); M.stale(i, true); } })());
      const vs = pk(dataBox, V.el, 'Vue が検知', '#2fd4a4').then(() => Promise.all([0, 1, 2].map((i) => pk(V.el, V.P[i], '自動', COL[i]).then(() => { V.paint(i, n); V.flash(i); }))));
      await Promise.all(ms.concat([vs]));
      const bad = [0, 1, 2].filter((i) => !wrote[i]).length;
      stat.className = 'vi-msg ' + (bad ? 'ng' : 'ok'); stat.textContent = bad ? '✖ 手で直す方：書き忘れた所が古いまま（赤）。Vue は1行 slots.value-- だけ' : '✓ 3行書けば手でも直る。でも毎回、全部書く必要がある。Vue は1行だけ';
      setAll(null); busy = false;
    };
    host.append(
      h('div', { class: 'v3-bar' }, dataBox, h('button', { class: 'btn primary', style: { '--c': C, fontSize: '1rem' }, onclick: go }, '👤 予約が入る（−1）'), h('button', { class: 'btn', onclick: reset }, '↺ 最初から')),
      stat,
      h('div', { class: 'vi-eq' },
        h('div', { class: 'vi-panel' }, lbl('✖ Vue なし：HTML と JavaScript'), M.el, htmlPre, jsHost, togs),
        h('div', { class: 'vi-panel' }, lbl('✓ Vue あり：1つの .vue ファイル'), V.el, vuePre, h('div', { class: 'vi-msg ok' }, '画面の ①②③ に当たる所は、template の中に「書いてあるだけ」。データを変える行は1つ'))));
    return host;
  }

  /* ④ フレームワークって？ */
  function fwChoose() {
    const TOOLS = [['🪵', '素の JS', 'var(--team)'], ['🧰', 'ライブラリ', 'var(--ts)'], ['🏠', 'Vue など', C]];
    const P = [
      { e: '📰', n: '会社紹介の1ページ', d: '文字と画像だけ', v: [[2, '十分'], [2, '十分'], [0, '大げさ']] },
      { e: '✉️', n: 'お問い合わせフォーム1つ', d: '入力欄が数個', v: [[2, '書ける'], [1, '少し楽'], [1, 'どちらでも']] },
      { e: '📅', n: '予約の管理画面', d: '一覧・詳細・編集', v: [[0, '直し忘れが出る'], [1, '一部だけ楽'], [2, '得意']] },
      { e: '📊', n: '社内ダッシュボード', d: '更新が多く、部品も多い', v: [[0, '手に負えない'], [0, '足りない'], [2, '向いている']] },
    ];
    let cur = 2, n = 12;
    const sel = h('div', { class: 'vi-row' }), verdict = h('div', { style: { display: 'grid', gap: '8px' } });
    const MARK = ['✖', '△', '✓'], COL = ['var(--bad)', 'var(--team)', 'var(--ok)'];
    const drawV = () => {
      sel.replaceChildren(...P.map((p, i) => h('span', { class: 'vi-chip' + (i === cur ? '' : ' off'), style: { '--cc': C }, onclick: () => { cur = i; drawV(); } }, p.e + ' ' + p.n)));
      const p = P[cur];
      verdict.replaceChildren(h('div', { style: { color: 'var(--mute)', fontWeight: 700, fontSize: '.84rem' } }, p.e + ' ' + p.d), ...TOOLS.map((t, i) => { const [m, why] = p.v[i]; return h('div', { class: 'vi-box', style: { gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', display: 'grid', gap: '10px', borderColor: COL[m] } }, h('b', { style: { fontSize: '1.5rem' } }, t[0]), h('span', { style: { fontWeight: 800 } }, t[1]), h('span', { style: { color: COL[m], fontWeight: 900 } }, MARK[m] + ' ' + why)); }));
    };
    drawV();
    /* 画面が増えるほどの手間（アニメーションのグラフ） */
    const W = 360, H = 170, X = (v) => 20 + v / 30 * (W - 30), Y = (c) => H - 18 - Math.min(c, 60) / 60 * (H - 34);
    const mCost = (v) => Math.pow(v, 1.6) * .5 + 1, fCost = (v) => 8 + v * 1.1;
    const pts = (f) => Array.from({ length: 31 }, (_, v) => X(v) + ',' + Y(f(v))).join(' ');
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.style.width = '100%';
    svg.innerHTML = `<line x1="20" y1="${H - 18}" x2="${W - 8}" y2="${H - 18}" stroke="var(--line)"/><line x1="20" y1="8" x2="20" y2="${H - 18}" stroke="var(--line)"/>
      <polyline points="${pts(mCost)}" fill="none" stroke="var(--team)" stroke-width="3"/><polyline points="${pts(fCost)}" fill="none" stroke="var(--vue)" stroke-width="3"/>
      <text x="${W - 8}" y="${Y(mCost(30)) + 12}" text-anchor="end" fill="var(--team)" font-size="11" font-weight="800">手で書く</text><text x="${W - 8}" y="${Y(fCost(30)) - 6}" text-anchor="end" fill="var(--vue)" font-size="11" font-weight="800">Vue</text>
      <text x="${W / 2}" y="${H - 3}" text-anchor="middle" fill="var(--mute)" font-size="10">画面・機能の数 →</text><text x="4" y="14" fill="var(--mute)" font-size="10">手間</text>
      <circle id="vm" r="6" fill="var(--team)"/><circle id="vf" r="6" fill="var(--vue)"/>`;
    const msg = h('div', { class: 'vi-msg w' });
    const upd = () => { const m = svg.querySelector('#vm'), f = svg.querySelector('#vf'); m.setAttribute('cx', X(n)); m.setAttribute('cy', Y(mCost(n))); f.setAttribute('cx', X(n)); f.setAttribute('cy', Y(fCost(n))); const cheap = mCost(n) < fCost(n); msg.className = 'vi-msg ' + (cheap ? 'w' : 'ok'); msg.textContent = cheap ? `画面 ${n} 個：手で書くほうが軽い（Vue は準備の分だけ重い）` : `画面 ${n} 個：Vue のほうが楽。手作業は増えるほどつらい`; };
    const rg = h('input', { type: 'range', min: 1, max: 30, value: n, style: { width: '100%' }, oninput: (e) => { n = +e.target.value; cnt.textContent = n; upd(); } }), cnt = h('b', String(n));
    upd();
    return h('div', { class: 'vi-eq' },
      h('div', { class: 'vi-panel' }, lbl('① 画面が増えると？（スライダーを動かす）'), h('div', { class: 'vi-row', style: { justifyContent: 'space-between' } }, h('span', { class: 'vi-lb' }, '画面・機能の数'), cnt), rg, svg, msg),
      h('div', { class: 'vi-panel' }, lbl('② こんなとき、どれを使う？'), sel, verdict, h('div', { class: 'vi-row', style: { marginTop: '4px' } }, ...[['📖', '学びやすい'], ['🪜', '少しずつ導入'], ['🧩', '部品にできる'], ['🔄', '画面が自動で変わる']].map(([e, t]) => h('span', { class: 'vi-chip', style: { '--cc': C } }, e + ' ' + t)))));
  }

  /* ④ フレームワークって？（全体像 → なぜ使う？ → どれを使う？） */
  style('vfw', `
  .fw-stack{display:grid;gap:5px}
  .fw-bl{padding:8px 12px;border-radius:8px;font-weight:800;font-size:.82rem;display:flex;gap:8px;align-items:center;transition:.5s;border:2px solid var(--line)}
  .fw-bl.diy{border:2px dashed var(--bad);background:color-mix(in srgb,var(--bad) 12%,var(--card2))}
  .fw-bl.in{border-color:var(--ok);background:color-mix(in srgb,var(--ok) 12%,var(--card2));padding:4px 12px;font-size:.74rem;opacity:.85}
  .fw-bl.app{border-color:var(--vue);background:color-mix(in srgb,var(--vue) 24%,var(--card));font-size:.95rem}
  .fw-bl small{margin-left:auto;font-size:.66rem;color:var(--mute)}
  .fw-bar{height:14px;border-radius:7px;background:var(--bg2);overflow:hidden;display:flex}
  .fw-bar i{display:block;height:100%;width:0;transition:width 1.3s ease}
  .fw-rs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
  @media(max-width:900px){.fw-rs{grid-template-columns:1fr}}
  .fw-rc{border:1px solid var(--line);border-radius:14px;background:var(--card);padding:12px;display:grid;gap:8px;align-content:start;min-width:0}
  .fw-rc>h4{font:900 .95rem var(--font)}
  .fw-pair{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  .fw-side{border-radius:10px;padding:8px;display:grid;gap:5px;font-size:.78rem;font-weight:800;min-width:0}
  .fw-side.x{border:2px dashed var(--bad);background:color-mix(in srgb,var(--bad) 8%,var(--card2))}
  .fw-side.o{border:2px solid var(--ok);background:color-mix(in srgb,var(--ok) 8%,var(--card2))}
  .fw-side>b{font-size:.7rem}
  .fw-cell{padding:5px 8px;border-radius:6px;background:#fff;color:#223;transition:.3s;position:relative}
  .fw-cell.stale{background:#ffe3e3;outline:2px solid #e33}
  .fw-cell.stale::after{content:'古い';position:absolute;right:4px;top:-8px;background:#e33;color:#fff;font:900 .6rem var(--font);padding:0 .5em;border-radius:5px}
  .fw-cell.fl{animation:v3f .7s}
  .fw-f{padding:3px 8px;border-radius:5px;background:var(--card);border:1px solid var(--line);font:700 .72rem var(--mono);transition:.25s}
  .fw-f.on{background:color-mix(in srgb,var(--bad) 30%,var(--card));border-color:var(--bad)}.fw-f.ok{background:color-mix(in srgb,var(--ok) 30%,var(--card));border-color:var(--ok)}
  `);
  function fwScene() {
    const TABS = ['① 全体像', '② なぜ使う？ 4つの理由', '③ どれを使う？'];
    let tab = 0;
    const root = h('div', { style: { display: 'grid', gap: '12px' } });
    const tabsEl = () => h('div', { class: 'vi-row' }, ...TABS.map((t, i) => h('span', { class: 'vi-chip' + (i === tab ? '' : ' off'), style: { '--cc': C }, onclick: () => { tab = i; draw(); } }, t)));

    /* ① 全体像：アプリを作るとき、自分で用意するもの vs 最初から入っているもの */
    const overview = () => {
      const LAY = [['🔄', '画面を自動で更新する仕組み'], ['🧩', '画面を部品に分ける仕組み'], ['📦', 'データをまとめて管理する仕組み'], ['🧭', 'ページ移動（URL）の仕組み'], ['🧪', 'テストの道具'], ['📏', 'チームの書き方ルール']];
      const bA = h('i', { style: { background: 'var(--bad)' } }), bB = h('i', { style: { background: 'var(--ok)' } }), bA2 = h('i', { style: { background: 'var(--vue)' } }), bB2 = h('i', { style: { background: 'var(--vue)' } });
      const lblA = h('small', { style: { color: 'var(--mute)', fontWeight: 800 } }, '土台づくり 6 / アプリ本体 1'), lblB = h('small', { style: { color: 'var(--mute)', fontWeight: 800 } }, '土台づくり 1 / アプリ本体 6');
      const play = () => { [bA, bB, bA2, bB2].forEach((b) => { b.style.transition = 'none'; b.style.width = '0'; }); void bA.offsetWidth; [bA, bB, bA2, bB2].forEach((b) => { b.style.transition = ''; }); bA.style.width = '60%'; bA2.style.width = '10%'; bB.style.width = '9%'; bB2.style.width = '61%'; };
      return h('div', { style: { display: 'grid', gap: '12px' } },
        h('div', { class: 'vi-eq' },
          h('div', { class: 'vi-panel', style: { borderColor: 'var(--bad)' } }, lbl('🪵 素の JavaScript：全部、自分で用意する'), h('div', { class: 'fw-stack' }, ...LAY.map(([e, t]) => h('div', { class: 'fw-bl diy' }, e, t, h('small', '自分で作る'))), h('div', { class: 'fw-bl app' }, '📱 あなたのアプリ', h('small', '作りたいもの'))),
            h('div', { class: 'fw-bar' }, bA, bA2), lblA),
          h('div', { class: 'vi-panel', style: { borderColor: 'var(--ok)' } }, lbl('🏠 フレームワーク（Vue）：土台は最初から入っている'), h('div', { class: 'fw-stack' }, ...LAY.map(([e, t]) => h('div', { class: 'fw-bl in' }, e, t, h('small', '✓ 入っている'))), h('div', { class: 'fw-bl app', style: { padding: '26px 12px' } }, '📱 あなたのアプリ', h('small', '時間はここに使える'))),
            h('div', { class: 'fw-bar' }, bB, bB2), lblB)),
        h('div', { class: 'vi-row', style: { justifyContent: 'center' } }, h('button', { class: 'btn primary', style: { '--c': C }, onclick: play }, '▶ 時間の使い方を比べる'), h('span', { class: 'vi-lb' }, '赤＝土台づくり　緑＝アプリ本体（どちらも同じ長さの時間）')));
    };

    /* ② なぜ使う？ 4つの理由（それぞれ押して試せる） */
    const reasons = () => {
      const card = (ttl, desc, left, right, btn, act, reset) => h('div', { class: 'fw-rc' }, h('h4', ttl), h('div', { class: 'vi-lb' }, desc), h('div', { class: 'fw-pair' }, h('div', { class: 'fw-side x' }, h('b', '✖ フレームワークなし'), left), h('div', { class: 'fw-side o' }, h('b', '✓ Vue'), right)), h('div', { class: 'vi-row' }, h('button', { class: 'btn primary', style: { '--c': C }, onclick: act }, btn), h('button', { class: 'btn', onclick: reset }, '↺')));
      /* R1 */
      const mk1 = () => { let n = 3; const L1 = h('div', { class: 'fw-cell' }), L2 = h('div', { class: 'fw-cell' }), R1 = h('div', { class: 'fw-cell' }), R2 = h('div', { class: 'fw-cell' });
        const paint = (a, b, v, upd2) => { a.textContent = '残り ' + v + ' 枠'; if (upd2) b.textContent = v === 0 ? '満席' : '受付中'; };
        const rs = () => { n = 3; paint(L1, L2, 3, true); paint(R1, R2, 3, true); [L1, L2, R1, R2].forEach((x) => x.classList.remove('stale', 'fl')); }; rs();
        const act = () => { if (n === 0) return; n--; paint(L1, L2, n, false); L1.classList.add('fl'); setTimeout(() => L1.classList.remove('fl'), 700); if (n === 0) L2.classList.add('stale'); paint(R1, R2, n, true); [R1, R2].forEach((x) => { x.classList.remove('fl'); void x.offsetWidth; x.classList.add('fl'); }); };
        return card('① 画面が自動で変わる', 'データを変えたとき、画面の直し忘れが起きる？', h('div', { class: 'fw-stack' }, L1, L2), h('div', { class: 'fw-stack' }, R1, R2), '予約（−1）を3回', act, rs); };
      /* R2 */
      const mk2 = () => { const mkC = () => h('div', { class: 'fw-cell' }, '🎫 相談カード'); const L = [mkC(), mkC(), mkC()], R = [mkC(), mkC(), mkC()];
        const rs = () => { [...L, ...R].forEach((c) => { c.textContent = '🎫 相談カード'; c.classList.remove('stale', 'fl'); }); };
        const act = () => { L[0].textContent = '⭐ 相談カード'; L[0].classList.add('fl'); L.slice(1).forEach((c) => c.classList.add('stale')); R.forEach((c) => { c.textContent = '⭐ 相談カード'; c.classList.remove('fl'); void c.offsetWidth; c.classList.add('fl'); }); };
        return card('② 部品を使い回せる', 'カードのデザインを1か所直したい', h('div', { class: 'fw-stack' }, ...L), h('div', { class: 'fw-stack' }, ...R), '⭐ デザインを直す（1か所）', act, rs); };
      /* R3 */
      const mk3 = () => { const L = h('div', { class: 'fw-stack' }), R = h('div', { class: 'fw-stack' });
        const rs = () => { L.replaceChildren(...[['👩 A', 'for で書いた'], ['👨 B', 'while で書いた'], ['🧑 C', '自分流のルールで書いた']].map(([a, b]) => h('div', { class: 'fw-cell' }, a + '：' + b))); R.replaceChildren(...['👩 A', '👨 B', '🧑 C'].map((a) => h('div', { class: 'fw-cell' }, a + '：同じ書き方 ✓'))); };
        rs(); const act = () => { [...L.children].forEach((c, i) => { c.classList.add('stale'); }); [...R.children].forEach((c) => { c.classList.remove('fl'); void c.offsetWidth; c.classList.add('fl'); }); };
        return card('③ チームで書き方が揃う', '3人が同じ機能を書くと、読みやすさは？', L, R, '3人で書いて比べる', act, () => { rs(); }); };
      /* R4 */
      const mk4 = () => { const FL = ['index.html', 'main.js', 'app.js', 'utils.js', 'button.js', 'styles.css', 'old.js'], FR = ['views/', 'components/', '  AppButton.vue', '  CaseCard.vue', 'router/', 'main.ts'];
        const L = h('div', { class: 'fw-stack' }, ...FL.map((f) => h('div', { class: 'fw-f' }, f))), R = h('div', { class: 'fw-stack' }, ...FR.map((f) => h('div', { class: 'fw-f' }, f)));
        const rs = () => [...L.children, ...R.children].forEach((e) => e.classList.remove('on', 'ok'));
        const act = async () => { rs(); const rc = R.children[2]; rc.classList.add('ok'); for (const e of [...L.children]) { e.classList.add('on'); await sleep(260); e.classList.remove('on'); } L.children[4].classList.add('ok'); };
        return card('④ 大きくなっても迷子にならない', 'ボタンの色を直したい。どのファイル？', L, R, '「ボタン」を探す', act, rs); };
      return h('div', { class: 'fw-rs' }, mk1(), mk2(), mk3(), mk4());
    };

    function draw() { root.replaceChildren(tabsEl(), [overview, reasons, fwChoose][tab]()); }
    draw();
    return root;
  }

  /* ⑤ Vue の考え方：3ステップ */
  function threeSteps() {
    const lns = (src, keys) => { const L = src.split('\n'), out = []; L.forEach((l, i) => { if (keys.some((k) => l.includes(k))) out.push(i + 1); }); return out; };
    const EX = [
      { k: '👋 あいさつ', note: '1ファイルで完結する、いちばん小さな例',
        files: [{ n: 'Hello.vue', src: "<script setup lang=\"ts\">\nimport { ref } from 'vue'\n\nconst name = ref('Lam')\n</script>\n\n<template>\n  <input v-model=\"name\" />\n  <p>こんにちは、{{ name }} さん</p>\n</template>", hi: [['const name'], ['{{ name }}'], ['v-model']] }],
        keys: { data: ['const name'], model: ['v-model'], show: ['{{ name }}'] },
        links: [], pv(st, S) { return st === 0 ? [h('div', { style: { color: '#889' } }, '（画面にはまだ何も出ていない）'), tag(h('div', { style: { font: '800 1rem var(--mono)', color: '#0a7' } }, 'name ＝ "Lam"'), 'data')] : [st === 2 ? S.inp : null, S.p].filter(Boolean); } },
      { k: '🎫 予約カード（2ファイル）', note: '親がデータを持ち、子が表示する。ボタンの知らせは子 → 親へ戻る',
        files: [{ n: 'ReservePage.vue（親）', src: "<script setup lang=\"ts\">\nimport { ref } from 'vue'\nimport ReserveCard from './ReserveCard.vue'\n\nconst slots = ref(3)\n</script>\n\n<template>\n  <ReserveCard :slots=\"slots\" @reserve=\"slots--\" />\n</template>", hi: [['const slots'], [':slots='], ['@reserve']] },
          { n: 'ReserveCard.vue（子）', src: "<script setup lang=\"ts\">\ndefineProps<{ slots: number }>()\ndefineEmits<{ reserve: [] }>()\n</script>\n\n<template>\n  <div class=\"card\">\n    <p>残り {{ slots }} 枠</p>\n    <button :disabled=\"slots === 0\" @click=\"$emit('reserve')\">予約する</button>\n  </div>\n</template>", hi: [[], ['defineProps', '{{ slots }}'], ['@click', 'defineEmits']] }],
        keys: { data: ['const slots'], child: ['<ReserveCard', ':slots='], show: ['{{ slots }}', 'defineProps'], click: ['@click=', 'defineEmits', '@reserve'] },
        links: ['親 → 子　:slots（props）', '子 → 親　@reserve（emit）'], pv(st, S) { return st === 0 ? [tag(h('div', { style: { color: '#889' } }, '（親が slots ＝ 3 を持っただけ。画面にはまだ出ない）'), 'data')] : [S.card]; } },
      { k: '🔍 相談検索（3ファイル）', note: '入力 → 親のデータ → 一覧。3つのファイルが1つのデータでつながる',
        files: [{ n: 'SearchPage.vue（親）', src: "<script setup lang=\"ts\">\nimport { ref, computed } from 'vue'\nimport SearchBox from './SearchBox.vue'\nimport CaseList from './CaseList.vue'\n\nconst keyword = ref('')\nconst cases = ['離婚の相談', '相続の相談', '労働の相談', '交通事故の相談']\nconst hits = computed<string[]>(() => cases.filter((c) => c.includes(keyword.value)))\n</script>\n\n<template>\n  <SearchBox v-model=\"keyword\" />\n  <CaseList :items=\"hits\" />\n</template>", hi: [['const keyword', 'const cases'], [':items='], ['v-model', 'computed']] },
          { n: 'SearchBox.vue', src: "<script setup lang=\"ts\">\nconst keyword = defineModel<string>()\n</script>\n\n<template>\n  <input v-model=\"keyword\" placeholder=\"分野で検索\" />\n</template>", hi: [[], [], ['v-model', 'defineModel']] },
          { n: 'CaseList.vue', src: "<script setup lang=\"ts\">\ndefineProps<{ items: string[] }>()\n</script>\n\n<template>\n  <ul>\n    <li v-for=\"c in items\" :key=\"c\">{{ c }}</li>\n  </ul>\n</template>", hi: [[], ['defineProps', '{{ c }}', 'v-for'], []] }],
        keys: { data: ['const keyword', 'const cases'], model: ['v-model', 'defineModel'], list: ['<CaseList', 'v-for', 'defineProps', 'const hits', ':items='] },
        links: ['親 → 子　:items（props）', '子 ⇄ 親　v-model（入力とデータ）'], pv(st, S) { return st === 0 ? [tag(h('div', { style: { color: '#889' } }, '（keyword と cases を親が持っただけ。画面にはまだ出ない）'), 'data')] : [st === 2 ? S.search : null, S.list].filter(Boolean); } },
    ];
    let cur = 0;
    const root = h('div', { style: { display: 'grid', gap: '12px' } });
    const mount = () => {
      const ex = EX[cur], stage = { v: 0 };
      const S = {};
      const codes = ex.files.map((f) => ({ f, el: code(f.src, 'vue', { color: C, file: f.n, dim: true }) }));
      const scr = h('div', { class: 'vi-scr' }), cap = h('div', { class: 'vi-msg w' });
      const MSG = ['① まず「データ」を用意する（箱に値を入れる）', '② データを画面に埋める（{{ }} や props で届ける）', '③ データが変わると、画面も自動で変わる。操作してみよう'];
      /* 部品づくり */
      if (cur === 0) { let val = 'Lam'; S.p = tag(h('p', { style: { fontWeight: 800, margin: 0 } }, 'こんにちは、Lam さん'), 'show'); S.inp = tag(h('input', { value: 'Lam', style: { padding: '.4em .6em', borderRadius: '6px', border: '1px solid #99a' }, oninput: (e) => { val = e.target.value; S.p.textContent = 'こんにちは、' + val + ' さん'; } }), 'model'); }
      if (cur === 1) { let n = 3; const rem = tag(h('p', { style: { margin: 0 } }), 'show'), btn = tag(h('button', { style: { padding: '.5em 1.2em', borderRadius: '8px', border: 'none', fontWeight: 800, background: '#2fd4a4', cursor: 'pointer' }, onclick: () => { if (n > 0) { n--; draw2(); codes[1].el.setHi(lns(ex.files[1].src, ["$emit('reserve')", 'defineEmits'])); codes[0].el.setHi(lns(ex.files[0].src, ['@reserve', 'const slots'])); } } }, '予約する'), 'click'); const draw2 = () => { rem.textContent = '残り ' + n + ' 枠'; btn.disabled = n === 0; btn.style.opacity = n === 0 ? .35 : 1; }; draw2(); S.card = tag(h('div', { style: { display: 'grid', gap: '8px', justifyItems: 'start', padding: '12px', border: '1px solid #ccd', borderRadius: '8px' } }, rem, btn), 'child'); }
      if (cur === 2) { const F = ['離婚の相談', '相続の相談', '労働の相談', '交通事故の相談']; const ul = h('ul', { style: { margin: 0, paddingLeft: '1.2em' } }); const drawL = (kw) => ul.replaceChildren(...F.filter((c) => c.includes(kw)).map((c) => h('li', c))); S.list = tag(ul, 'list'); S.search = tag(h('input', { placeholder: '分野で検索', style: { padding: '.4em .7em', borderRadius: '6px', border: '1px solid #99a' }, oninput: (e) => { drawL(e.target.value); codes[1].el.setHi(lns(ex.files[1].src, ['v-model', 'defineModel'])); codes[0].el.setHi(lns(ex.files[0].src, ['v-model', 'computed', ':items='])); } }), 'model'); drawL(''); }
      let rel = null;
      const restLines = () => { let o = 0; const r = []; codes.forEach(({ f }) => { const hs = f.hi[stage.v] || []; lns(f.src, hs).forEach((i) => r.push(o + i)); o += f.src.split('\n').length; }); return r; };
      const upd = (st) => { stage.v = st; codes.forEach(({ f, el }, i) => el.setHi(lns(f.src, f.hi[st][i === undefined ? 0 : 0] === undefined ? [] : f.hi[st]))); scr.replaceChildren(...ex.pv(st, S)); cap.textContent = MSG[st]; rel && rel(); };
      const stp = stepper({ color: C, steps: [{ say: '<b>① データを用意</b>。値を入れておく「箱」。' }, { say: '<b>② 画面に埋める</b>。箱の名前を書くだけ。' }, { say: '<b>③ 変わると追いかける</b>。画面を操作してみよう。' }], init(vis) { vis.append(h('div', { style: { display: 'grid', gap: '8px' } }, ...codes.map((c) => c.el), ex.links.length ? h('div', { class: 'vi-row' }, ...ex.links.map((t) => h('span', { class: 'vi-chip', style: { '--cc': 'var(--team)' } }, '↔ ' + t))) : null)); }, update(n) { upd(n); } });
      root.replaceChildren(h('div', { class: 'vi-row' }, h('span', { class: 'vi-lb' }, '例：'), ...EX.map((e, i) => h('span', { class: 'vi-chip' + (i === cur ? '' : ' off'), style: { '--cc': C }, onclick: () => { cur = i; mount(); } }, e.k))),
        h('div', { class: 'vi-eq' }, h('div', { class: 'vi-panel' }, stp), h('div', { class: 'vi-panel' }, lbl('できあがる画面'), scr, cap, h('div', { style: { color: 'var(--mute)', fontSize: '.8rem', fontWeight: 700 } }, ex.note))));
      rel = linkLive(root, () => multiPre(() => codes.map((c) => c.el)), ex.keys, restLines);
      rel();
    };
    mount();
    return root;
  }

  /* ⑥ ref を1つずつ */
  function refSteps() {
    const SFC = (script, tpl) => `<script setup lang="ts">\n${script}\n</script>\n\n<template>\n${tpl}\n</template>`;
    const TPL = '  <p>{{ count }}</p>\n  <button @click="add">+1</button>';
    const ST = [
      { say: '<b>① ふつうの変数</b>。<code>let</code> で作った変数は、変えても画面は変わらない。', code: SFC('let count = 0\n\nfunction add() {\n  count++\n}', TPL), hi: [2, 5], mode: 'mem', n: '変数は 1 になった。でも画面は 0 のまま…（Vue は変わったことに気づけない）' },
      { say: '<b>② ref で包む</b>。「変わったら画面を直してね」と Vue に頼める箱にする。', code: SFC("import { ref } from 'vue'\n\nconst count = ref(0)\n\nfunction add(): void {\n  count.value++\n}", TPL), hi: [2, 4, 7], mode: 'auto', n: '画面が自動で変わった。画面を書き換える行は、1行も書いていない。' },
      { say: '<b>③ .value は script の中だけ</b>。template では {{ count }} と書くだけ。', code: SFC("import { ref } from 'vue'\n\nconst count = ref(0)\n\nfunction add(): void {\n  count.value++\n}", TPL), hi: [7, 12], mode: 'auto', n: 'script は count.value、template は count。これだけ覚えれば OK。' },
      { say: '<b>④ 箱の中身が .value</b>。console.log で見ると、箱と中身の違いが分かる。', code: SFC("import { ref } from 'vue'\n\nconst count = ref(0)\nconsole.log(count)         // { value: 0 }  ← 箱\nconsole.log(count.value)   // 0             ← 中身\n\nfunction add(): void {\n  count.value++\n}", TPL), hi: [4, 5, 6], box: true, mode: 'auto', n: '箱（ref）の中に value がある。script では .value で中身をさわる。' },
    ];
    let mem = 0, scr = 0, stage = 0;
    const host = h('div'), memB = h('div', { class: 'vi-st' }), scrB = h('div', { class: 'vi-st' }), msg = note('', 'w');
    const paint = () => {
      const s = ST[stage];
      memB.replaceChildren(h('small', s.box ? 'count（ref の箱）' : 'count（変数）'), h('b', s.box ? `{ value: ${mem} }` : String(mem)));
      scrB.replaceChildren(h('small', '画面（DOM）'), h('b', String(scr)));
      scrB.classList.toggle('stale', scr !== mem);
    };
    const click = async () => {
      const s = ST[stage]; mem++; memB.classList.add('lit'); paint();
      if (s.mode === 'mem') { msg.textContent = '✖ ' + s.n; msg.className = 'vi-msg ng'; setTimeout(() => memB.classList.remove('lit'), 500); return; }
      await sleep(s.mode === 'auto' ? 350 : 150); scr = mem; scrB.classList.add('lit'); paint();
      msg.textContent = '✓ ' + s.n; msg.className = 'vi-msg ok'; setTimeout(() => { memB.classList.remove('lit'); scrB.classList.remove('lit'); }, 500);
    };
    const reset = () => { mem = 0; scr = 0; msg.textContent = '「count を +1 する」を押して、画面の動きを見よう'; msg.className = 'vi-msg w'; paint(); };
    reset();
    return h('div', { class: 'vi-eq' },
      h('div', { class: 'vi-panel' }, lbl('1段ずつ進める（左のコードが変わる）'),
        stepper({ color: C, steps: ST.map((s) => ({ say: s.say })), init(vis) { vis.append(host); }, update(n) { stage = n; host.replaceChildren(code(ST[n].code, 'vue', { color: C, file: 'Counter.vue', hi: ST[n].hi })); reset(); } })),
      h('div', { class: 'vi-panel' }, lbl('実際に動かす'), h('div', { class: 'vi-row' }, memB, h('span', { class: 'vi-ar' }, '➜'), scrB), h('div', { class: 'vi-row' }, h('button', { class: 'btn primary', style: { '--c': C }, onclick: click }, '＋ count を +1 する'), h('button', { class: 'btn', onclick: reset }, '↺ 0 に戻す')), msg));
  }

  /* ⑧ 部品に分ける */
  function comps() {
    const P = [['hd', 'AppHeader', 'ロゴとメニュー'], ['sb', 'SearchBox', '検索欄'], ['c1', 'CaseCard', '相談カード'], ['c2', 'CaseCard', '相談カード'], ['c3', 'CaseCard', '相談カード'], ['ft', 'AppFooter', 'フッター']];
    const els = {}, info = note('部品にマウスを乗せよう', 'w');
    const pg = h('div', { class: 'vi-pg' }, ...P.map(([k, n, d]) => { const e = h('div', { onmouseenter: () => { Object.values(els).forEach((x) => x.classList.remove('lit')); (n === 'CaseCard' ? ['c1', 'c2', 'c3'] : [k]).forEach((z) => els[z].classList.add('lit')); info.textContent = `<${n}> ＝ ${d}` + (n === 'CaseCard' ? '（同じ部品を3回使っている）' : ''); }, onmouseleave: () => Object.values(els).forEach((x) => x.classList.remove('lit')) }, `<${n} />　${d}`); els[k] = e; return e; }));
    const fix = h('button', { class: 'btn primary', style: { '--c': C }, onclick: () => { ['c1', 'c2', 'c3'].forEach((k) => { els[k].classList.remove('pop'); void els[k].offsetWidth; els[k].classList.add('pop'); els[k].textContent = els[k].textContent.includes('★') ? els[k].textContent.replace('★ ', '') : '★ ' + els[k].textContent; }); info.textContent = '✓ CaseCard を1か所直しただけで、3枚とも変わった'; } }, '✏️ CaseCard を1か所だけ直す');
    return h('div', { class: 'vi-eq' },
      h('div', { class: 'vi-panel' }, lbl('1つの画面は、部品の組み合わせ'), pg, h('div', { class: 'vi-row' }, fix), info),
      h('div', { class: 'vi-panel' }, lbl('コードで書くと'), code("<script setup lang=\"ts\">\nimport { ref } from 'vue'\nimport AppHeader from './AppHeader.vue'\nimport SearchBox from './SearchBox.vue'\nimport CaseCard from './CaseCard.vue'\nimport AppFooter from './AppFooter.vue'\n\nconst keyword = ref('')\nconst cases = ref([\n  { id: 1, title: '離婚の相談' },\n  { id: 2, title: '相続の相談' },\n])\n</script>\n\n<template>\n  <AppHeader />\n  <SearchBox v-model=\"keyword\" />\n\n  <CaseCard v-for=\"c in cases\" :key=\"c.id\" :item=\"c\" />\n  <AppFooter />\n</template>", 'vue', { color: C, file: 'CaseListPage.vue' }),
        h('div', { class: 'vi-box' }, h('b', '部品にすると'), '・同じ見た目を何度でも使い回せる', h('br'), '・直すのは1か所だけ', h('br'), '・チームで「ここは私が作る」と分担しやすい'), note('部品1つが .vue ファイル1つ。次のシーンで、そのファイルの中身を見てみよう。')));
  }

  /* .vue の3つの箱が、Webページに何をもたらすか（スイッチで足し引き） */
  style('vsl', `
  .sl-sw{display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center;min-height:84px;padding:10px 12px;border-radius:12px;border:2px solid var(--line);background:var(--card);cursor:pointer;transition:.25s}
  .sl-sw.on{border-color:var(--n);background:color-mix(in srgb,var(--n) 14%,var(--card))}
  .sl-sw>i{font-style:normal;font-size:1.7rem}
  .sl-sw b{display:block;font-size:.9rem}.sl-sw small{display:block;color:var(--mute);font-weight:700;font-size:.74rem;line-height:1.5}
  .sl-tg{justify-self:end;width:42px;height:22px;border-radius:999px;background:var(--line);position:relative;transition:.25s}
  .sl-tg::after{content:'';position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:#fff;transition:.25s}
  .sl-sw.on .sl-tg{background:var(--n)}.sl-sw.on .sl-tg::after{left:23px}
  .sl-eq{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px;align-items:stretch}@media(max-width:980px){.sl-eq{grid-template-columns:1fr}}
  .sl-pv{background:#fff;color:#223;border-radius:12px;padding:20px;min-height:300px;display:grid;place-items:center;border:1px solid var(--line);position:relative}
  .sl-cap{position:absolute;left:10px;top:8px;font:800 .7rem var(--mono);color:#889}
  .sl-add{padding:.5em .9em;border-radius:8px;background:var(--card2);font-weight:800;font-size:.82rem;border-left:5px solid var(--n)}
  `);
  function sfcLayers() {
    const B = [
      { k: 'tp', ic: '🧱', n: 'template（形）', c: '#5b9dff', d: '何を表示するか。タイトル・説明・ボタンの「骨組み」', off: '外すと → 画面に何も出ない', add: '🧱 タイトル・説明・ボタンが画面に出た' },
      { k: 'st', ic: '🎨', n: 'style（見た目）', c: '#c07bff', d: '色・枠・余白。見た目を整える', off: '外すと → 動くけれど、素っ気ない見た目', add: '🎨 枠・色・余白がついて、カードらしくなった' },
      { k: 'sc', ic: '⚙️', n: 'script（動き）', c: '#ffb454', d: 'ボタンを押したときの動き・データ', off: '外すと → 見た目だけ。押しても何も起きない', add: '⚙️ ボタンを押すと「完了」に変わるようになった' },
    ];
    const on = { tp: true, st: false, sc: false };
    const pv = h('div', { class: 'sl-pv' }), add = h('div', { class: 'sl-add' }), sws = h('div', { style: { display: 'grid', gap: '8px' } });
    let done = false, last = null;
    const draw = () => {
      pv.replaceChildren(h('div', { class: 'sl-cap' }, '🌐 ブラウザの画面'));
      if (!on.tp) { pv.append(h('div', { style: { color: '#99a', fontWeight: 800, textAlign: 'center' } }, '（template が無いので、何も表示されない）')); }
      else {
        const card = h('div', { style: on.st ? { padding: '14px 16px', border: '1px solid #ccd', borderRadius: '10px', boxShadow: '0 6px 16px -8px #0006', display: 'grid', gap: '8px', minWidth: '240px', transition: '.3s', opacity: done && on.sc ? .55 : 1 } : { display: 'grid', gap: '4px', justifyItems: 'start' } });
        const btn = h('button', on.st ? { style: { padding: '.45em 1em', borderRadius: '8px', border: 'none', background: '#2fd4a4', fontWeight: 800, cursor: on.sc ? 'pointer' : 'not-allowed', justifySelf: 'start' } } : {});
        btn.textContent = on.sc && done ? '✓ 完了' : '完了にする';
        btn.onclick = () => { if (on.sc) { done = !done; draw(); } else { btn.animate([{ transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'none' }], { duration: 250 }); } };
        card.append(h('h3', { style: { margin: 0, fontSize: on.st ? '1rem' : '1.17rem' } }, '離婚の相談'), h('p', { style: { margin: 0, color: on.st ? '#556' : 'inherit' } }, '来週までに返事が必要'), btn);
        pv.append(card);
      }
      sws.replaceChildren(...B.map((b) => h('div', { class: 'sl-sw' + (on[b.k] ? ' on' : ''), style: { '--n': b.c }, onclick: () => { on[b.k] = !on[b.k]; last = on[b.k] ? b : null; if (!on.sc) done = false; draw(); } }, h('i', b.ic), h('span', h('b', b.n), h('small', on[b.k] ? b.d : b.off)), h('div', { class: 'sl-tg' }))));
      add.style.setProperty('--n', last ? last.c : 'var(--vue)'); add.textContent = last ? '＋ ' + last.add : '👆 スイッチを入れて、1つずつ足してみよう';
    };
    draw();
    return h('div', { class: 'vi-panel' }, lbl('3つの箱は、Webページに何をもたらす？（スイッチで足し引き）'), h('div', { class: 'sl-eq' }, pv, h('div', { style: { display: 'grid', gap: '10px', alignContent: 'stretch' } }, sws, add)));
  }

  /* script の lang="ts" ：なぜ書く？ */
  function whyTs() {
    let ts = true, tried = false;
    const BODY = (lang) => `<script setup${lang}>\nimport { ref } from 'vue'\n\nconst count = ref(0)\n\nfunction reset() {\n  count.value = 'ゼロ'\n}\n</script>\n\n<template>\n  <p>{{ count }}</p>\n  <button @click="reset">リセット</button>\n</template>`;
    const host = h('div'), res = tag(h('div', { class: 'vi-scr', style: { minHeight: 0, gap: '8px' } }), 'bad'), msg = h('div', { class: 'vi-msg w' });
    let wPre = null, wRun = null;
    const draw = () => {
      const pre = wPre = code(BODY(ts ? ' lang="ts"' : ''), 'vue', { color: C, file: 'Counter.vue', dim: true, hi: ts ? [1, 7] : [7] });
      host.replaceChildren(pre); wRun && wRun();
      if (ts && tried) pre.lines[6].style.textDecoration = 'wavy underline #ff6b6b';
      res.replaceChildren();
      if (!tried) { res.append(h('div', { style: { color: '#889' } }, '👆「保存して動かす」を押そう')); msg.className = 'vi-msg w'; msg.textContent = 'count は数（ref(0)）。7行目で文字 \'ゼロ\' を入れてしまった'; return; }
      if (ts) { res.append(h('div', { style: { color: '#c22', fontWeight: 800 } }, '✖ 赤い波線（エディタ）'), h('code', { style: { fontSize: '.78rem' } }, "Type 'string' is not assignable to type 'number'"), h('div', { style: { color: '#0a7', fontWeight: 800 } }, '→ 動かす前に、書いた瞬間に気づける')); msg.className = 'vi-msg ok'; msg.textContent = 'lang="ts" があると、間違いが「書いている最中」に見つかる'; }
      else { res.append(h('div', { style: { fontWeight: 800 } }, 'ゼロ'), h('div', { style: { color: '#c80', fontWeight: 800 } }, '△ 何のエラーも出ない'), h('div', { style: { color: '#c22', fontWeight: 800 } }, '→ 数のはずの所に文字。本番で気づく危険'));  msg.className = 'vi-msg ng'; msg.textContent = 'lang="ts" が無いと、間違いは動かしてみるまで分からない'; }
    };
    draw();
    const seg = h('div', { class: 'vi-row' }, ...[['✓ lang="ts" あり', true], ['✖ lang="ts" なし', false]].map(([t, v]) => h('span', { class: 'vi-chip', style: { '--cc': v ? 'var(--ok)' : 'var(--bad)' }, onclick: () => { ts = v; draw(); seg.querySelectorAll('.vi-chip').forEach((x, i) => x.classList.toggle('off', (i === 0) !== v)); } }, t)));
    seg.lastChild.classList.add('off');
    [...seg.children].forEach((c) => tag(c, 'lang'));
    const GO = h('button', { class: 'btn primary', style: { '--c': C }, onclick: () => { tried = true; draw(); } }, '▶ 保存して動かす');
    const wRoot = h('div', { style: { display: 'grid', gap: '12px' } },
      h('div', { class: 'vi-eq' },
        h('div', { class: 'vi-panel' }, lbl('同じコード。違うのは、1行目の lang="ts" だけ'), seg, host, h('div', { class: 'vi-row' }, GO, h('button', { class: 'btn', onclick: () => { tried = false; draw(); } }, '↺'))),
        h('div', { class: 'vi-panel' }, lbl('結果'), res, msg,
          h('div', { class: 'vi-box' }, h('small', '覚え方'), h('b', 'lang="ts" ＝ 型チェックをオンにするスイッチ（TypeScript）')))),
      h('div', { class: 'vi-eq' }, h('div', { class: 'vc-do' }, h('b', '✓ このプロジェクトのルール'), h('small', 'script は必ず <script setup lang="ts"> で書く。全員そろえる'), h('small', 'npm create vue で「TypeScript」を選ぶと、最初から入る')), h('div', { class: 'vc-dont' }, h('b', '✖ 混ぜない'), h('small', 'ファイルごとに lang="ts" があったり無かったりしない'), h('small', '型の恩恵（赤線・補完）が部分的になってしまう'))));
    wRun = linkLive(wRoot, () => wPre, { lang: ['<script setup'], bad: ["count.value = 'ゼロ'"] }, () => (ts ? [1, 7] : [7])); wRun();
    return wRoot;
  }

  /* ⑨ .vue ファイルの解剖（実例を3つ・ブロックごとに光らせる） */
  function vueFile() {
    const EX = [
      { k: 'お気に入りボタン', use: '一覧のカード、記事ページ、商品ページ…「♥」を押す場所はどこにでもある', src: '<template>\n  <button class="fav" @click="count++">\n    ♥ お気に入り {{ count }}\n  </button>\n</template>\n\n<script setup lang="ts">\nimport { ref } from \'vue\'\n\nconst count = ref(0)\n</script>\n\n<style scoped>\n.fav { color: hotpink; border: 2px solid hotpink; }\n</style>', demo: 'fav' },
      { k: '相談カード', use: '相談の一覧。親から「どの相談か」をもらい、押されたら親に知らせる（props / emit）', src: '<template>\n  <article class="card" :class="{ done: item.done }">\n    <h3>{{ item.title }}</h3>\n    <p v-if="item.note">{{ item.note }}</p>\n    <button @click="toggle">\n      {{ item.done ? \'✓ 完了\' : \'完了にする\' }}\n    </button>\n  </article>\n</template>\n\n<script setup lang="ts">\ninterface Item { title: string; note?: string; done: boolean }\n\nconst props = defineProps<{ item: Item }>()\nconst emit = defineEmits<{ (e: \'toggle\', title: string): void }>()\n\nconst toggle = () => emit(\'toggle\', props.item.title)\n</script>\n\n<style scoped>\n.card { padding: 12px; border: 1px solid #ccd; }\n.card.done { opacity: .5; }\n</style>', demo: 'card' },
      { k: '検索ボックス', use: '案件検索・名簿の絞り込み。入力に合わせて一覧がその場で変わる（v-model / computed）', src: '<template>\n  <input v-model="keyword" placeholder="分野で検索" />\n  <ul>\n    <li v-for="f in hits" :key="f">{{ f }}</li>\n  </ul>\n  <p v-if="!hits.length">見つかりません</p>\n</template>\n\n<script setup lang="ts">\nimport { ref, computed } from \'vue\'\n\nconst fields = [\'離婚\', \'相続\', \'労働\', \'交通事故\']\nconst keyword = ref(\'\')\nconst hits = computed<string[]>(() =>\n  fields.filter((f) => f.includes(keyword.value))\n)\n</script>\n\n<style scoped>\ninput { padding: 6px 10px; }\n</style>', demo: 'search' },
    ];
    let cur = 1;
    const lineRanges = (src) => { const L = src.split('\n'), r = { template: [], script: [], style: [] }; let b = null; L.forEach((l, i) => { if (/^<template>/.test(l)) b = 'template'; if (/^<script/.test(l)) b = 'script'; if (/^<style/.test(l)) b = 'style'; if (b) r[b].push(i + 1); if (/^<\/(template|script|style)>/.test(l)) b = null; }); return r; };
    const COL = { template: ['var(--basic)', '🧱 <b>template</b>：画面の形を HTML で書く。{{ }}・v-if・@click など、データと結びつく印を書き足せる'], script: ['var(--ts)', '⚙️ <b>script</b>：データ（ref）・受け取る値（props）・動き（関数）。ここで書いた名前を template で使う'], style: ['var(--pink)', '🎨 <b>style scoped</b>：この部品の中だけに効く CSS。他の部品の見た目を壊さない'] };
    const picks = h('div', { class: 'vi-row' }), codeHost = h('div'), prev = h('div', { class: 'vi-scr' }), blocks = h('div', { class: 'vi-row' }), say = note('ブロックにマウスを乗せると、コードが光る', 'w'), useB = h('div', { class: 'vi-box' });
    let pre = null, R = null, curHi = [], vRun = null;
    const VK = {
      fav: { btn: ['<button class="fav"', '@click="count++"', '{{ count }}'], count: ['const count'] },
      card: { card: ['<article'], title: ['<h3>'], note: ['v-if="item.note"', '{{ item.note }}', 'interface Item'], btn: ['<button', 'const toggle', '{{ item.done'], emit: ['defineEmits', 'emit('] },
      search: { model: ['v-model="keyword"', 'const keyword'], list: ['v-for="f in hits"', 'const hits', 'fields.filter'], none: ['v-if="!hits.length"'] },
    };
    const lit = (k) => { if (!pre) return; curHi = k ? R[k] : []; pre.setHi(curHi); say.innerHTML = k ? COL[k][1] : 'ブロックにマウスを乗せると、コードが光る'; };
    const demos = {
      fav() { let n = 0; const b = tag(h('button', { style: { font: '800 1.05rem var(--font)', padding: '.5em 1.2em', borderRadius: '8px', border: '2px solid hotpink', background: '#fff', color: 'hotpink', cursor: 'pointer' }, onclick: () => { n++; b.textContent = '♥ お気に入り ' + n; lit('script'); b.animate([{ transform: 'scale(1.2)' }, { transform: 'scale(1)' }], { duration: 250 }); } }, '♥ お気に入り 0'), 'btn'); return [b, h('small', { style: { color: '#778' } }, '押すと script の count が増えて、template に出る')]; },
      card() { const it = { title: '離婚の相談', note: '来週までに返事が必要', done: false }; const log = tag(h('small', { style: { color: '#778', fontFamily: 'var(--mono)' } }, '（親への知らせ：まだなし）'), 'emit'); const t = tag(h('h3', { style: { margin: 0 } }), 'title'), p = tag(h('p', { style: { margin: 0 } }, it.note), 'note'), b = tag(h('button', { style: { padding: '.4em 1em', borderRadius: '6px', border: '1px solid #99a', cursor: 'pointer' } }), 'btn'), box = tag(h('div', { style: { padding: '12px', border: '1px solid #ccd', borderRadius: '8px', display: 'grid', gap: '6px', transition: '.3s' } }, t, p, b), 'card'); const dr = () => { t.textContent = it.title; b.textContent = it.done ? '✓ 完了' : '完了にする'; box.style.opacity = it.done ? .5 : 1; }; b.onclick = () => { it.done = !it.done; dr(); log.textContent = `emit('toggle', "${it.title}")  → 親が受け取る`; lit('script'); }; dr(); return [box, log]; },
      search() { const F = ['離婚', '相続', '労働', '交通事故']; const ul = tag(h('ul', { style: { margin: 0, paddingLeft: '1.2em' } }), 'list'), none = tag(h('p', { style: { margin: 0, color: '#c33' } }, '見つかりません'), 'none'); const i = tag(h('input', { placeholder: '分野で検索', style: { padding: '.4em .7em', borderRadius: '6px', border: '1px solid #99a' }, oninput: () => dr() }), 'model'); const dr = () => { const hit = F.filter((f) => f.includes(i.value)); ul.replaceChildren(...hit.map((x) => h('li', x))); none.style.display = hit.length ? 'none' : ''; lit('script'); }; dr(); return [i, ul, none, h('small', { style: { color: '#778' } }, '「相」「事」などを打ってみよう')]; },
    };
    const draw = () => {
      picks.replaceChildren(lbl2('例：'), ...EX.map((e, i) => chip(e.k, C, i === cur, () => { cur = i; draw(); })));
      const e = EX[cur]; R = lineRanges(e.src);
      pre = code(e.src, 'vue', { color: C, file: e.k + '.vue', dim: true }); codeHost.replaceChildren(pre);
      blocks.replaceChildren(...Object.keys(COL).map((k) => h('button', { class: 'btn', style: { '--c': COL[k][0] }, onmouseenter: () => lit(k), onfocus: () => lit(k), onmouseleave: () => lit(null), onclick: () => lit(k) }, k)));
      curHi = []; prev.replaceChildren(...demos[e.demo]());
      useB.replaceChildren(h('small', '現場ではこんな所に使う'), e.use);
      vRun && vRun(VK[e.demo]);
    };
    const lbl2 = (t) => h('span', { style: { fontWeight: 800, fontSize: '.84rem', color: 'var(--mute)' } }, t);
    draw();
    const vRoot = h('div', { style: { display: 'grid', gap: '12px' } }, picks,
      h('div', { class: 'vi-eq' }, h('div', { class: 'vi-panel' }, codeHost, blocks, say), h('div', { class: 'vi-panel' }, lbl('動かしてみる'), prev, useB,
        note('1ファイル ＝ 1部品。template（形）・script（動き）・style（見た目）が1つにまとまる。'))));
    const vpx = { get lines() { return pre ? pre.lines : []; }, setHi: (a, c) => { if (pre) pre.setHi(a, c); } };
    vRun = (map) => { if (K.vs && K.vs.link) K.vs.link(vRoot, vpx, map, { rest: () => curHi }); };
    vRun(VK[EX[cur].demo]);
    return vRoot;
  }

  const L = K.lessons['vue-intro'], old = {};
  L.scenes.forEach((s) => { old[s.t] = s; });
  const S = (t, tag, lead, fn) => ({ t, tag, lead, render(el) { el.append(fn()); } });

  /* ---------- 補足：Options API と Composition API（任意） ---------- */
  function apiWhat() {
    const SF = (imp, body, tpl) => `<script setup lang="ts">\nimport { ${imp} } from 'vue'\n\n${body}\n</script>\n\n<template>\n  ${tpl}\n</template>`;
    const R = [['ref', '🔢', 'データを入れる「箱」を作る', SF('ref', 'const count = ref(0)', '<p>{{ count }}</p>')], ['computed', '🧮', '材料から答えを自動で出す', SF('ref, computed', 'const price = ref(500)\nconst qty = ref(2)\nconst total = computed<number>(() => price.value * qty.value)', '<p>{{ total }} 円</p>')], ['onMounted', '🚪', '画面が出た直後に1回やる', SF('ref, onMounted', "const msg = ref('読み込み中…')\n\nonMounted(() => {\n  msg.value = '取得完了'\n})", '<p>{{ msg }}</p>')], ['watch', '👀', '値が変わったら何かする', SF('ref, watch', "const keyword = ref('')\nconst count = ref(0)\n\nwatch(keyword, () => {\n  count.value++\n})", '<input v-model="keyword" /><p>変更 {{ count }} 回</p>')]];
    let cur = 0; const row = h('div', { class: 'vi-row' }), box = h('div', { style: { display: 'grid', gap: '8px' } });
    const draw = () => {
      row.replaceChildren(...R.map((r, i) => chip(r[1] + ' ' + r[0], C, i === cur, () => { cur = i; draw(); })));
      const r = R[cur]; box.replaceChildren(h('div', { class: 'vi-box' }, h('small', 'ボタン「' + r[0] + '」を押すと'), r[2]), code(r[3], 'vue', { color: C, file: 'Sample.vue' }));
    };
    draw();
    return h('div', { class: 'vi-eq' },
      h('div', { class: 'vi-panel' }, lbl('API ＝ 道具の「使い方」'), h('div', { class: 'vi-box' }, '🎮 <b>リモコン</b>でたとえると', h('br'), 'テレビの中身が分からなくても、ボタン（音量・チャンネル）の使い方さえ知っていれば操作できる。この「ボタンの使い方のルール」が <b>API</b>。'.replace(/<\/?b>/g, '')), h('div', { class: 'vi-box' }, 'Vue の API ＝ Vue を操作するための<b>関数と書き方</b>（ref・computed・onMounted…）。'.replace(/<\/?b>/g, '')), lbl('押して確かめる（Vue のリモコン）'), row, box),
      h('div', { class: 'vi-panel' }, lbl('じゃあ「Options」と「Composition」は？'), h('div', { class: 'vi-box', style: { borderColor: 'var(--team)' } }, h('b', 'Options API'), '「データはここ、動きはここ」と、種類ごとの棚に分けて書く。Vue 2 の頃からの書き方。'), h('div', { class: 'vi-box', style: { borderColor: C } }, h('b', 'Composition API'), '「お気に入り機能」「検索機能」と、機能ごとにまとめて書く。この研修で使う書き方。'), note('どちらも同じ Vue。「同じことを、2通りの書き方でできる」だけ。次のシーンで同じカウンターを2通りで書いて比べよう。')));
  }
  function twoStyles() {
    const OP = "<script>\nexport default {\n  data() {            // ① データ\n    return { count: 0 }\n  },\n  methods: {          // ② 動き\n    add() { this.count++ }\n  },\n  computed: {         // ③ 計算された値\n    double() { return this.count * 2 }\n  }\n}\n</script>\n\n<template>\n  <button @click=\"add\">＋1</button>\n  <p>{{ count }} / {{ double }}</p>\n</template>";
    const CO = "<script setup lang=\"ts\">\nimport { ref, computed } from 'vue'\n\nconst count = ref(0)                           // ① データ\nconst add = () => count.value++                // ② 動き\nconst double = computed<number>(() => count.value * 2) // ③ 計算された値\n</script>\n\n<template>\n  <button @click=\"add\">＋1</button>\n  <p>{{ count }} / {{ double }}</p>\n</template>";
    const G = { 'データ': [[3, 4, 5], [4], 'var(--basic)'], '動き': [[6, 7, 8], [5], 'var(--team)'], '計算された値': [[9, 10, 11], [6], 'var(--pink)'] };
    const a = code(OP, 'vue', { color: 'var(--team)', file: 'Options API', dim: true }), b = code(CO, 'vue', { color: C, file: 'Composition API（script setup）', dim: true });
    let n = 0; const val = h('b', '0'), dbl = h('b', '0');
    const btn = h('button', { class: 'btn primary', style: { '--c': C }, onclick: () => { n++; val.textContent = n; dbl.textContent = n * 2; } }, '＋1');
    const hi = (k) => { a.setHi(k ? G[k][0] : []); b.setHi(k ? G[k][1] : []); };
    return h('div', { style: { display: 'grid', gap: '12px' } },
      h('div', { class: 'vi-panel' }, lbl('同じ「カウンター」を2通りで（役割の名前にマウスを乗せる）'), h('div', { class: 'vi-row' }, ...Object.keys(G).map((k) => h('span', { class: 'vi-chip', style: { '--cc': G[k][2] }, onmouseenter: () => hi(k), onmouseleave: () => hi(null), onclick: () => hi(k) }, k)))),
      h('div', { class: 'vi-eq' }, a, b),
      h('div', { class: 'vi-panel' }, lbl('動かすと、どちらも同じ'), h('div', { class: 'vi-row' }, btn, h('span', 'count ＝ '), val, h('span', '　double ＝ '), dbl), note('違うのは「書く場所」だけ。Options は棚（data / methods / computed）に分け、Composition は役割ごとに1行ずつ並べる。')));
  }
  const apiOld = old['Options API と Composition API'];
  if (apiOld) apiOld.lead = '機能が増えると差が出る。Options は<b>種類ごと</b>に離れ、Composition は<b>機能ごと</b>にまとまる。';
  K.reg({
    id: 'x-vue-style', track: 'extra', title: 'Options API と Composition API', sub: '【任意】2つの書き方の違い', emoji: '🔀',
    meta: { cat: 'vue', day: '4日目', when: '【任意】Vue 基礎のあと、時間が余ったとき。古いコードを読む前の予備知識', mins: 10, order: 33, level: '任意', after: 'vue-intro', why: '現場には2つの書き方が混ざっている。違いが分かれば、どちらのコードも怖くない' },
    scenes: [S('API ってなに？', 'API', '<b>API</b> は「道具の使い方」。Options / Composition は、その<b>2種類の書き方</b>。', apiWhat), S('同じものを2通りで', 'COMPARE', '<b>カウンター</b>を両方で書いて、<b>役割ごとの対応</b>を見よう。', twoStyles), apiOld].filter(Boolean),
  });

  /* ---------- 組み直し ---------- */
  const keep = (t, lead) => { const s = old[t]; if (s && lead) s.lead = lead; return s; };
  const vueFileScene = Object.assign({}, old['.vue ファイルの解剖'] || {}, { t: '.vue ファイルの解剖', tag: 'SFC', lead: '<b>1ファイル＝1部品</b>。3つのブロックにマウスを乗せると、コードが光る。例を3つ切り替えて、実際の形を見よう。', render(el) { el.append(sfcLayers()); const sp = K.tsAnatSpecs && K.tsAnatSpecs['.vue ファイルの解剖']; if (sp && K.tsAnatBuild) el.append(h('div', { style: { height: '14px' } }), K.tsAnatBuild(sp)); el.append(h('div', { style: { height: '14px' } }), vueFile()); } });
  delete vueFileScene.ref; delete vueFileScene.why; delete vueFileScene.answer;
  const list = [
    S('フロントエンドって何？', 'FRONT-END', 'まずは全体像。Web アプリは<b>4つの登場人物</b>でできている。Vue.js が担当するのは、そのうちの<b>フロントエンド</b>。', feMap),
    S('HTML・CSS・JavaScript', 'BASICS', 'フロントエンドの<b>3つの材料</b>。1つずつ足して、画面がどう変わるか見よう。', layers),
    S('script の lang="ts" って？', 'lang=ts', '<code>&lt;script setup lang="ts"&gt;</code> の <b>lang="ts"</b> は何のため？ あり／なしで比べよう。', whyTs),
    S('JS の基本：変数と関数', 'JS BASICS', '<b>変数</b>・<b>関数</b>・よく使う<b>道具</b>。Vue の前に、<code>&lt;script setup&gt;</code> の中の書き方を知ろう。', jsBasics),
    (() => { const x = old['データを変えるだけ']; if (!x) return null; x.tag = '自動で更新'; x.lead = '予約が入ると、画面の<b>3か所</b>を直す。手で書く？ Vue に任せる？ 押して比べよう。'; x.render = (el) => { el.append(liveCompare()); }; return x; })(),
    S('フレームワークって？', 'FRAMEWORK', '素の JavaScript・ライブラリ・フレームワーク。<b>家づくり</b>でたとえて違いを見よう。', fwScene),
    S('Vue の考え方：3ステップ', 'IDEA', '<b>データ → 画面に埋める → 変わると追いかける</b>。この3つだけで Vue の基本が分かる。', threeSteps),
    S('ref を1つずつ', 'ref', '<b>ふつうの変数</b>から始めて、なぜ ref が要るのか、<b>.value</b> は何かを、1段ずつ。', refSteps),
    keep('リアクティブの仕組み', '【発展】ここまでの「画面が自動で変わる」の<b>中身</b>。分からなくても、先に進んで大丈夫。'),
    S('部品に分ける', 'COMPONENT', '画面は<b>部品の組み合わせ</b>。同じ部品を何度も使えて、直すのも1か所で済む。', comps),
    vueFileScene,
  ].filter(Boolean);
  /* 紹介は「さわりだけ」。手を動かす内容は、環境設定のあと（Vue 基礎の冒頭）へ */
  const MOVE_T = ['script の lang="ts" って？', 'JS の基本：変数と関数', 'データを変えるだけ', 'Vue の考え方：3ステップ', 'ref を1つずつ', 'リアクティブの仕組み', '部品に分ける', '.vue ファイルの解剖'];
  const moved = list.filter((x) => MOVE_T.includes(x.t));
  L.scenes = list.filter((x) => !MOVE_T.includes(x.t));
  const BASICS = K.lessons['vue-basics'];
  if (BASICS) {
    /* 基礎は、やさしい順：ファイルの形 → 変数と関数 → データと画面 → ref → 各ディレクティブ → 実践 → 発展 */
    const all = {}; moved.concat(BASICS.scenes).forEach((x) => { all[x.t] = x; });
    const ORDER = ['.vue ファイルの解剖', 'script の lang="ts" って？', 'JS の基本：変数と関数', 'データを変えるだけ', 'Vue の考え方：3ステップ', 'ref を1つずつ', 'ref：状態と画面', 'イベント処理 @click', 'v-if と v-show', ':class と v-for', 'v-model：双方向', '実践：ミニTodo', 'リアクティブの仕組み'];
    BASICS.scenes = ORDER.map((t) => all[t]).filter(Boolean);
  } else L.scenes = list;
})();
