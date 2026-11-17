/* イベントの種類（Vue 基礎）と、修飾子 .prevent .stop .once .enter（補足・任意） */
(function () {
  'use strict';
  const K = window.KENSHU;
  if (!K || !K.lessons || !K.lessons['vue-basics']) return;
  const { h, code, lbl, style } = K.W;
  const C = 'var(--vue)';
  const lns = (src, keys) => { const o = []; src.split('\n').forEach((l, i) => { if (keys.some((k) => l.includes(k))) o.push(i + 1); }); return o; };
  const sfc = (script, tpl) => `<script setup lang="ts">\n${script}\n</script>\n\n<template>\n${tpl}\n</template>`;

  style('ve2', `
  .ev-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px;align-items:start}
  @media(max-width:980px){.ev-grid{grid-template-columns:1fr}}
  .ev-stage{display:grid;gap:10px;background:#fff;color:#223;border-radius:12px;padding:14px;border:1px solid var(--line)}
  .ev-row{display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:center;padding:8px 10px;border-radius:10px;border:2px solid #dfe3ee;transition:.2s}
  .ev-row.on{border-color:var(--n);background:color-mix(in srgb,var(--n) 12%,#fff)}
  .ev-tag{font:800 .72rem var(--mono);padding:.2em .6em;border-radius:6px;background:var(--n);color:#06101f;white-space:nowrap}
  .ev-log{display:grid;gap:4px;min-height:120px;align-content:start;max-height:210px;overflow:auto}
  .ev-log div{padding:.35em .7em;border-radius:6px;background:var(--card2);border-left:4px solid var(--n,var(--vue));font:700 .78rem var(--mono);animation:capin .3s both}
  .ev-nest{padding:18px;border-radius:12px;border:3px solid var(--n);background:color-mix(in srgb,var(--n) 14%,#fff);display:grid;gap:10px;transition:.25s}
  .ev-nest.hit{box-shadow:0 0 0 4px var(--n)}
  .ev-key{display:inline-block;padding:.2em .7em;border-radius:6px;border:2px solid var(--line);font:800 .8rem var(--mono);background:var(--card2)}
  `);
  const cl = (n) => ({ '--n': n });
  const note = (t, c) => h('div', { class: 'vi-msg ' + (c || 'w') }, t);
  const dd = (ok, ng) => h('div', { class: 'vi-eq' },
    h('div', { class: 'vc-do' }, h('b', '✓ 使う場面'), ...ok.map((t) => h('small', t))),
    h('div', { class: 'vc-dont' }, h('b', '✖ 使わない場面'), ...ng.map((t) => h('small', t))));

  /* ===== 基礎：イベントの種類 ===== */
  function kinds() {
    const COL = { click: '#ff6b9d', input: '#5b9dff', change: '#2fd4a4', submit: '#ffb454', enter: '#a98bff', hover: '#ff8f7a' };
    const log = h('div', { class: 'ev-log' }, h('div', '👆 左の部品を操作してみよう'));
    const src = sfc("import { ref } from 'vue'\n\nconst text = ref('')\nconst fruit = ref('りんご')\n\nfunction onClick(): void {}\nfunction onSubmit(): void {}\nfunction search(): void {}\nfunction onHover(): void {}",
      '  <button @click="onClick">押す</button>\n  <input v-model="text" @input="onInput" />\n  <select v-model="fruit" @change="onChange">…</select>\n  <form @submit.prevent="onSubmit">…</form>\n  <input @keyup.enter="search" />\n  <div @mouseenter="onHover">乗せる</div>');
    const pre = code(src, 'vue', { color: C, file: 'Events.vue', dim: true });
    const rows = {};
    const fire = (k, attr, msg) => { Object.values(rows).forEach((r) => r.classList.remove('on')); rows[k].classList.add('on'); pre.setHi(lns(src, [attr])); log.prepend(h('div', { style: { '--n': COL[k] } }, '▶ ' + msg)); while (log.children.length > 8) log.lastChild.remove(); if (log.children.length > 1 && /操作してみよう/.test(log.lastChild.textContent)) log.lastChild.remove(); };
    const row = (k, tag, node) => { const r = h('div', { class: 'ev-row', style: cl(COL[k]) }, h('span', { class: 'ev-tag' }, tag), node); rows[k] = r; return r; };
    const inp = h('input', { placeholder: '文字を打つ', style: { padding: '.4em .6em', borderRadius: '6px', border: '1px solid #99a', minWidth: 0 }, oninput: (e) => fire('input', '@input', `input：「${e.target.value}」（1文字ごと）`) });
    const sel = h('select', { style: { padding: '.4em', borderRadius: '6px', border: '1px solid #99a' }, onchange: (e) => fire('change', '@change', `change：「${e.target.value}」を選んだ（選び終わった時）`) }, ...['りんご', 'みかん', 'ぶどう'].map((t) => h('option', t)));
    const frm = h('form', { style: { display: 'flex', gap: '6px' }, onsubmit: (e) => { e.preventDefault(); fire('submit', '@submit', 'submit：フォームを送信（.prevent でページ再読込を止めた）'); } }, h('input', { placeholder: '件名', style: { padding: '.4em .6em', borderRadius: '6px', border: '1px solid #99a', minWidth: 0, flex: 1 } }), h('button', { type: 'submit', style: { padding: '.4em 1em', borderRadius: '6px', border: 'none', background: '#ffb454', fontWeight: 800, cursor: 'pointer' } }, '送信'));
    const ent = h('input', { placeholder: '打って Enter', style: { padding: '.4em .6em', borderRadius: '6px', border: '1px solid #99a', minWidth: 0 }, onkeyup: (e) => { if (e.key === 'Enter') fire('enter', '@keyup.enter', `keyup.enter：Enter を押した →「${e.target.value}」を検索`); } });
    const box = h('div', { style: { padding: '.5em 1em', borderRadius: '8px', background: '#eef1f8', fontWeight: 800 }, onmouseenter: () => fire('hover', '@mouseenter', 'mouseenter：マウスが乗った') }, '🖱 ここに乗せる');
    const btn = h('button', { style: { padding: '.4em 1em', borderRadius: '6px', border: 'none', background: '#ff6b9d', fontWeight: 800, cursor: 'pointer', justifySelf: 'start' }, onclick: () => fire('click', '@click', 'click：ボタンが押された') }, '押す');
    return h('div', { style: { display: 'grid', gap: '12px' } },
      h('div', { class: 'ev-grid' },
        h('div', { class: 'vi-panel' }, lbl('① 部品を操作する（どのイベントが起きる？）'), h('div', { class: 'ev-stage' }, row('click', '@click', btn), row('input', '@input', inp), row('change', '@change', sel), row('submit', '@submit', frm), row('enter', '@keyup.enter', ent), row('hover', '@mouseenter', box)), lbl('② 起きたイベント'), log),
        h('div', { class: 'vi-panel' }, lbl('③ 書き方（操作した行が光る）'), pre)),
      h('div', { class: 'vi-eq' },
        h('div', { class: 'vi-box' }, h('small', '覚え方'), h('b', '@イベント名="呼ぶ関数"　（v-on:イベント名 の省略形）')),
        h('div', { class: 'vi-box' }, h('small', 'input と change の違い'), h('b', 'input ＝ 打つたびに／change ＝ 入力が終わったら（選択・フォーカスを外す）'))),
      dd(['@click：ボタン・カードを押す', '@input：入力に合わせて、すぐ結果を変える（検索）', '@submit：フォームの送信', '@keyup.enter：Enter で確定'], ['@mousemove のように回数が多すぎるもの（重くなる）', '@click を div に付けて、キーボードで操作できなくする（ボタンは <button> を使う）']));
  }

  /* ===== 補足：修飾子 ===== */
  function prevent() {
    let on = true, reloads = 0;
    const src = (p) => sfc("import { ref } from 'vue'\n\nconst title = ref('')\n\nfunction save(): void {\n  // 保存の処理\n}", `  <form @submit${p ? '.prevent' : ''}="save">\n    <input v-model="title" />\n    <button>送信</button>\n  </form>`);
    const codeH = h('div'), view = h('div'), msg = h('div', { class: 'vi-msg w' });
    const draw = () => {
      codeH.replaceChildren(code(src(on), 'vue', { color: on ? 'var(--ok)' : 'var(--bad)', file: 'Form.vue', dim: true, hi: [12] }));
      const inp = h('input', { placeholder: '件名を入力してから送信', style: { padding: '.4em .6em', borderRadius: '6px', border: '1px solid #99a', flex: 1, minWidth: 0 } }), pg = h('div', { style: { color: '#889', fontSize: '.8rem' } }, '（画面）');
      const f = h('form', { style: { display: 'flex', gap: '6px' }, onsubmit: (e) => { if (on) { e.preventDefault(); msg.className = 'vi-msg ok'; msg.textContent = '✓ .prevent があるので、ページはそのまま。save() だけが動いた'; } else { e.preventDefault(); reloads++; inp.value = ''; pg.textContent = `🔄 ページが再読み込みされた（${reloads}回目）→ 入力が消えた！`; pg.style.color = '#c22'; pg.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400 }); msg.className = 'vi-msg ng'; msg.textContent = '✖ .prevent が無いと、ブラウザの「ふだんの動き（送信してページを読み込み直す）」が起きる'; } } }, inp, h('button', { type: 'submit', style: { padding: '.4em 1em', borderRadius: '6px', border: 'none', background: '#ffb454', fontWeight: 800, cursor: 'pointer' } }, '送信'));
      view.replaceChildren(h('div', { class: 'ev-stage' }, f, pg));
      msg.className = 'vi-msg w'; msg.textContent = '👆 入力して「送信」を押してみよう';
    };
    draw();
    const seg = h('div', { class: 'vi-row' }, ...[['✓ .prevent あり', true, 'var(--ok)'], ['✖ .prevent なし', false, 'var(--bad)']].map(([t, v, c]) => h('span', { class: 'vi-chip' + (v === on ? '' : ' off'), style: { '--cc': c }, onclick: () => { on = v; seg.querySelectorAll('.vi-chip').forEach((x, i) => x.classList.toggle('off', (i === 0) !== v)); draw(); } }, t)));
    return h('div', { style: { display: 'grid', gap: '12px' } }, seg, h('div', { class: 'ev-grid' }, h('div', { class: 'vi-panel' }, lbl('書き方'), codeH), h('div', { class: 'vi-panel' }, lbl('動かす'), view, msg)),
      h('div', { class: 'vi-box' }, h('small', '.prevent ＝ preventDefault()'), h('b', 'ブラウザが勝手にやる「ふだんの動き」を止める（フォーム送信・リンク移動）')),
      dd(['フォームを送信して、自分の処理（API 呼び出し）を動かすとき', '<a href="#"> を押してもページ先頭に飛ばしたくないとき'], ['送信そのものをブラウザに任せたい（普通の HTML フォーム）とき']));
  }
  function stop() {
    let on = true;
    const log = h('div', { class: 'ev-log' }, h('div', '👆 内側の「子」を押してみよう'));
    const src = (s) => sfc("function onParent(): void {}\nfunction onChild(): void {}", `  <div @click="onParent">\n    親\n    <button @click${s ? '.stop' : ''}="onChild">子</button>\n  </div>`);
    const codeH = h('div'), view = h('div');
    const draw = () => {
      codeH.replaceChildren(code(src(on), 'vue', { color: on ? 'var(--ok)' : 'var(--bad)', file: 'Bubble.vue', dim: true, hi: [7, 9] }));
      log.replaceChildren(h('div', '👆 内側の「子」を押してみよう'));
      const par = h('div', { class: 'ev-nest', style: cl('#5b9dff'), onclick: () => { par.classList.add('hit'); setTimeout(() => par.classList.remove('hit'), 300); log.prepend(h('div', { style: cl('#5b9dff') }, '▶ 親 onParent が動いた（クリックが「上へ伝わった」）')); } }, h('b', '親（div）'), h('button', { style: { padding: '.5em 1em', borderRadius: '8px', border: 'none', background: '#ff6b9d', fontWeight: 800, cursor: 'pointer', justifySelf: 'start' }, onclick: (e) => { if (on) e.stopPropagation(); log.prepend(h('div', { style: cl('#ff6b9d') }, '▶ 子 onChild が動いた')); } }, '子（button）'));
      view.replaceChildren(h('div', { class: 'ev-stage' }, par), log);
    };
    draw();
    const seg = h('div', { class: 'vi-row' }, ...[['✓ .stop あり', true, 'var(--ok)'], ['✖ .stop なし', false, 'var(--bad)']].map(([t, v, c]) => h('span', { class: 'vi-chip' + (v === on ? '' : ' off'), style: { '--cc': c }, onclick: () => { on = v; seg.querySelectorAll('.vi-chip').forEach((x, i) => x.classList.toggle('off', (i === 0) !== v)); draw(); } }, t)));
    return h('div', { style: { display: 'grid', gap: '12px' } }, seg, h('div', { class: 'ev-grid' }, h('div', { class: 'vi-panel' }, lbl('書き方'), codeH), h('div', { class: 'vi-panel' }, lbl('動かす'), view)),
      h('div', { class: 'vi-box' }, h('small', '.stop ＝ stopPropagation()'), h('b', 'クリックが外側（親）へ伝わるのを止める。何も付けないと、子を押すと親の @click も動く')),
      dd(['カードの中のボタン（削除）を押したとき、カード全体の @click（詳細表示）を動かしたくない'], ['親のイベントも動かしたいとき（付けない）']));
  }
  function keys() {
    const log = h('div', { class: 'ev-log' }, h('div', '👆 入力欄で Enter / Esc を押してみよう'));
    const src = sfc("import { ref } from 'vue'\n\nconst word = ref('')\nconst count = ref(0)\n\nfunction search(): void {}\nfunction clear(): void {}\nfunction once(): void {}", '  <input v-model="word" @keyup.enter="search" @keyup.esc="clear" />\n  <button @click.once="once">1回だけ</button>');
    const pre = code(src, 'vue', { color: C, file: 'Keys.vue', dim: true });
    const say = (k, t) => { pre.setHi(lns(src, [k])); log.prepend(h('div', { style: cl('#a98bff') }, '▶ ' + t)); if (/押してみよう/.test(log.lastChild.textContent)) log.lastChild.remove(); };
    const inp = h('input', { placeholder: 'ここで Enter / Esc', style: { padding: '.5em .7em', borderRadius: '8px', border: '1px solid #99a', width: '100%', boxSizing: 'border-box' }, onkeyup: (e) => { if (e.key === 'Enter') say('@keyup.enter', 'Enter → search() が動いた（検索）'); else if (e.key === 'Escape') { say('@keyup.esc', 'Esc → clear() が動いた（入力を消す）'); e.target.value = ''; } else log.prepend(h('div', { style: cl('#888') }, `（${e.key} → 何も起きない。修飾子で絞っているから）`)); } });
    let used = false;
    const once = h('button', { style: { padding: '.5em 1em', borderRadius: '8px', border: 'none', background: '#2fd4a4', fontWeight: 800, cursor: 'pointer', justifySelf: 'start' }, onclick: () => { if (used) { log.prepend(h('div', { style: cl('#888') }, '（2回目 → 何も起きない）')); return; } used = true; say('@click.once', '1回目だけ once() が動いた'); once.textContent = '使用済み'; once.style.opacity = .4; } }, '1回だけ');
    const rs = h('button', { class: 'btn', onclick: () => { used = false; once.textContent = '1回だけ'; once.style.opacity = 1; } }, '↺ ボタンを戻す');
    return h('div', { style: { display: 'grid', gap: '12px' } }, h('div', { class: 'ev-grid' },
      h('div', { class: 'vi-panel' }, lbl('操作する'), h('div', { class: 'ev-stage' }, inp, once), rs, log),
      h('div', { class: 'vi-panel' }, lbl('書き方'), pre)),
      h('div', { class: 'vi-eq' }, h('div', { class: 'vi-box' }, h('small', 'キーの修飾子'), h('b', '.enter  .esc  .tab  .space　など。キー名を付けるだけ')), h('div', { class: 'vi-box' }, h('small', 'そのほか'), h('b', '.once（1回だけ）　.self（自分自身を押した時だけ）'))),
      dd(['検索ボックスで Enter 確定、Esc でキャンセル', '二重送信を避けたいボタン（.once）'], ['キーを自分で if 判定するより、修飾子で書く方が短くて読みやすい']));
  }

  /* ---- 基礎：イベント処理 @click のあとに「イベントの種類」を追加 ---- */
  const BASICS = K.lessons['vue-basics'];
  const i = BASICS.scenes.findIndex((s) => s.t === 'イベント処理 @click');
  const scene = { t: 'イベントの種類', tag: 'EVENTS', lead: '<b>@click だけじゃない</b>。操作の種類ごとに、イベントの名前がある。部品を触って、<b>どれが起きるか</b>を見よう。', render(el) { el.append(kinds()); } };
  if (i >= 0) BASICS.scenes.splice(i + 1, 0, scene); else BASICS.scenes.push(scene);



  /* 部品（チップ）にカーソルを乗せると、対応するコードの行が色付きで光る */
  const CLS = ['h1', 'h2', 'h3', 'hd'], CLR = ['#ff6b9d', '#5b9dff', '#ffb454', '#2fd4a4'];
  const partChips = (pres, parts) => {
    const set = (i) => { pres.forEach(([pre, src]) => { CLS.forEach((c) => pre.setHi([], c)); if (i != null) pre.setHi(lns(src, parts[i][1]), CLS[i % 4]); }); };
    return h('div', { class: 'vi-row' }, h('span', { class: 'vi-lb' }, '👆 部分にカーソルを乗せる：'), ...parts.map((x, i) => h('span', { class: 'vi-chip', style: { '--cc': CLR[i % 4] }, onmouseenter: () => set(i), onmouseleave: () => set(null), onclick: () => set(i) }, x[0])));
  };

  /* ===== 基礎：ref と reactive ／ 型（interface / type）の置き場所 ===== */
  function refReactive() {
    const TABS = ['① 普通の値は ref', '② オブジェクトは？ ref / reactive', '③ 型（interface）はどこに書く？'];
    let tab = 0, which = 0, place = 0;
    const root = h('div', { style: { display: 'grid', gap: '12px' } });
    const tabs = () => h('div', { class: 'vi-row' }, ...TABS.map((t, i) => h('span', { class: 'vi-chip' + (i === tab ? '' : ' off'), style: { '--cc': C }, onclick: () => { tab = i; draw(); } }, t)));

    /* ① 普通の値 */
    const prim = () => {
      const ROWS = [['数', "const count = ref(0)", 'count.value++', '{{ count }}', 'number'], ['文字', "const name = ref('Lam')", "name.value = 'Aki'", '{{ name }}', 'string'], ['真偽', 'const open = ref(false)', 'open.value = !open.value', '{{ open }}', 'boolean'], ['配列', "const tags = ref<string[]>([])", "tags.value.push('離婚')", '{{ tags }}', 'string[]']];
      const src = sfc(ROWS.map((r) => r[1]).join('\n') + '\n\nfunction update(): void {\n' + ROWS.map((r) => '  ' + r[2]).join('\n') + '\n}', ROWS.map((r) => '  <p>' + r[3] + '</p>').join('\n'));
      const pre = code(src, 'vue', { color: C, file: 'Values.vue', dim: true });
      const cards = ROWS.map((r, i) => h('div', { class: 'ev-row', style: cl(['#ff6b9d', '#5b9dff', '#2fd4a4', '#ffb454'][i]), onmouseenter: () => pre.setHi(lns(src, [r[1], r[2], r[3]])), onmouseleave: () => pre.setHi([]) }, h('span', { class: 'ev-tag' }, r[4]), h('span', { style: { fontWeight: 800 } }, r[0] + 'の ref')));
      return h('div', { class: 'ev-grid' }, h('div', { class: 'vi-panel' }, lbl('数・文字・真偽・配列：どれも ref（型は ref<型>() で書ける）'), ...cards, note('型は多くの場合、初期値から自動で決まる（ref(0) → number）。空の配列だけ ref<string[]>([]) と書く')), h('div', { class: 'vi-panel' }, lbl('カードにカーソルを乗せる → 対応する行が光る'), pre));
    };

    /* ② オブジェクト */
    const obj = () => {
      const TYPE = "interface Case {\n  id: number\n  title: string\n  done: boolean\n}\n";
      const S = [
        { n: 'ref（おすすめ）', c: 'var(--ok)', script: TYPE + "\nconst item = ref<Case>({ id: 1, title: '離婚の相談', done: false })\n\nfunction finish(): void {\n  item.value.done = true\n}\n\nfunction replace(): void {\n  item.value = { id: 2, title: '相続の相談', done: false }\n}", tpl: '  <p>{{ item.title }}</p>', note: 'script では .value を付ける。丸ごと入れ替えても、画面は追いかける', rep: true },
        { n: 'reactive', c: 'var(--team)', script: TYPE + "\nconst item = reactive<Case>({ id: 1, title: '離婚の相談', done: false })\n\nfunction finish(): void {\n  item.done = true\n}\n\nfunction replace(): void {\n  item = { id: 2, title: '相続の相談', done: false }   // ✖ 書き換えられない\n}", tpl: '  <p>{{ item.title }}</p>', note: '.value は不要で、少し書きやすい。でも「丸ごと入れ替え」ができない（画面が追いかけなくなる）', rep: false },
      ];
      const x = S[which];
      const src = sfc((which ? "import { reactive } from 'vue'\n" : "import { ref } from 'vue'\n") + '\n' + x.script, x.tpl);
      const pre = code(src, 'vue', { color: x.c, file: 'Item.vue', dim: true });
      const chips = partChips([[pre, src]], [['① 型を決める（interface）', ['interface Case', 'id: number', 'title: string', 'done: boolean']], ['② 箱を作る', ['const item =']], ['③ 中身を変える', ['item.value.done = true', 'item.done = true', 'function finish']], ['④ 丸ごと入れ替える', ['function replace', 'item.value = {', 'item = {']], ['⑤ 画面に出す', ['{{ item.title }}']]]);
      const st = { title: '離婚の相談', done: false }, view = h('div', { class: 'ev-stage' }), msg = note('👆 ボタンを押して、画面の変化を見よう', 'w');
      const paint = () => view.replaceChildren(h('div', { style: { display: 'grid', gap: '4px' } }, h('b', st.title), h('span', { style: { color: st.done ? '#0a7' : '#889' } }, st.done ? '✓ 完了' : '未完了')));
      paint(); view.onmouseenter = () => { CLS.forEach((c) => pre.setHi([], c)); pre.setHi(lns(src, ['{{ item.title }}']), 'hd'); }; view.onmouseleave = () => pre.setHi([], 'hd');
      const btn = (t, f, c) => h('button', { class: 'btn primary', style: { '--c': c || C }, onclick: f }, t);
      const mod = btn('✏️ done を true にする（中身の変更）', () => { st.done = true; paint(); pre.setHi(lns(src, ['done = true'])); msg.className = 'vi-msg ok'; msg.textContent = '✓ どちらでも、中身の変更は画面に反映される'; });
      const rep = btn('🔁 別の案件に丸ごと入れ替える', () => { pre.setHi(lns(src, ['function replace', 'item = {', 'item.value = {'])); if (x.rep) { st.title = '相続の相談'; st.done = false; paint(); msg.className = 'vi-msg ok'; msg.textContent = '✓ ref なら、丸ごと入れ替えてもちゃんと画面が変わる'; } else { msg.className = 'vi-msg ng'; msg.textContent = '✖ reactive は丸ごと入れ替えると、画面とのつながりが切れる（const なのでエラーにもなる）'; } }, 'var(--team)');
      const rs = h('button', { class: 'btn', onclick: () => { st.title = '離婚の相談'; st.done = false; paint(); msg.className = 'vi-msg w'; msg.textContent = '👆 ボタンを押して、画面の変化を見よう'; pre.setHi([]); } }, '↺');
      const seg = h('div', { class: 'vi-row' }, ...S.map((y, i) => h('span', { class: 'vi-chip' + (i === which ? '' : ' off'), style: { '--cc': y.c }, onclick: () => { which = i; draw(); } }, y.n)));
      return h('div', { style: { display: 'grid', gap: '12px' } }, seg, h('div', { class: 'ev-grid' }, h('div', { class: 'vi-panel' }, lbl('書き方'), chips, pre), h('div', { class: 'vi-panel' }, lbl('動かす'), view, h('div', { class: 'vi-row' }, mod, rep, rs), msg, note(x.note, 'w'))),
        dd(['ふつうは ref だけでOK（数も文字もオブジェクトも）', '.value を付ける、と1つのルールで統一できる', 'オブジェクトは interface で形を決めてから ref<Case>(...)'], ['reactive は「入れ替えない」と決めたオブジェクトだけ。迷ったら ref', 'reactive の中身を分割代入（const { title } = item）で取り出すと、つながりが切れる']));
    };

    /* ③ 型の置き場所 */
    const types = () => {
      const SAME = sfc("import { ref } from 'vue'\n\ninterface Case {\n  id: number\n  title: string\n  done: boolean\n}\n\nconst item = ref<Case>({ id: 1, title: '離婚の相談', done: false })", '  <p>{{ item.title }}</p>');
      const T = "export interface Case {\n  id: number\n  title: string\n  done: boolean\n}\n\nexport type Status = '未着手' | '進行中' | '完了'\n";
      const A = sfc("import { ref } from 'vue'\nimport type { Case } from '@/types/case'\n\nconst item = ref<Case>({ id: 1, title: '離婚の相談', done: false })", '  <p>{{ item.title }}</p>');
      const B = sfc("import type { Case } from '@/types/case'\n\ndefineProps<{ item: Case }>()", '  <p>{{ item.title }}</p>');
      const seg = h('div', { class: 'vi-row' }, ...[['📄 同じファイルに書く', 'var(--basic)'], ['📁 別ファイル（types/）に出す', 'var(--ts)']].map(([t, c], i) => h('span', { class: 'vi-chip' + (i === place ? '' : ' off'), style: { '--cc': c }, onclick: () => { place = i; draw(); } }, t)));
      let body;
      if (place === 0) body = h('div', { class: 'ev-grid' }, h('div', { class: 'vi-panel' }, lbl('CaseCard.vue（型もこの中）'), code(SAME, 'vue', { color: 'var(--basic)', file: 'CaseCard.vue', dim: true, hi: [4, 5, 6, 7, 8] })), h('div', { class: 'vi-panel' }, lbl('こんな時に'), dd(['その部品の中だけで使う型', 'まだ型が小さい・1か所でしか使わない'], ['同じ型を、別のファイルにもコピペし始めたら、出すサイン']).childNodes[0], note('interface は「object の形の設計図」。名前は大文字始まり（Case）', 'w')));
      else { const pa = code(T, 'ts', { color: 'var(--ts)', file: 'src/types/case.ts', dim: true }), ca = code(A, 'vue', { color: C, file: 'CaseList.vue', dim: true }), cb = code(B, 'vue', { color: C, file: 'CaseCard.vue', dim: true });
        const lk = partChips([[pa, T], [ca, A], [cb, B]], [['① export（公開）', ['export interface', 'export type']], ['② import type（借りる）', ["import type"]], ['③ 型を使う', ['ref<Case>', 'item: Case']]]);
        body = h('div', { style: { display: 'grid', gap: '12px' } }, lk, h('div', { class: 'vi-eq' }, h('div', { class: 'vi-panel' }, lbl('① 型を1か所に書いて export'), pa, note('type は、候補を並べる型（Status）に便利', 'w')), h('div', { style: { display: 'grid', gap: '12px', minWidth: 0 } }, h('div', { class: 'vi-panel' }, lbl('② 使う側で import type'), ca), h('div', { class: 'vi-panel' }, lbl('② 別の部品も、同じ型を import'), cb))),
          h('div', { class: 'vi-box' }, h('small', '覚え方'), h('b', 'import type { 型名 } from "パス" ＝ 型だけを借りる（実行時には消える）')), dd(['複数のファイルで同じ型を使う', 'API の返り値の形（共通の約束）', 'types/ にまとめる（case.ts のようにテーマごと）'], ['すべての型を1つの巨大ファイルに入れる', '部品の中でしか使わない型まで外に出す'])); }
      return h('div', { style: { display: 'grid', gap: '12px' } }, seg, body);
    };
    function draw() { root.replaceChildren(tabs(), [prim, obj, types][tab]()); }
    draw();
    return root;
  }
  const iR = BASICS.scenes.findIndex((s) => s.t === 'ref：状態と画面');
  const rrScene = { t: 'ref と reactive・型（interface）', tag: 'ref / interface', lead: '値の種類で<b>書き方が変わる</b>。普通の値・オブジェクト・型の置き場所を、順に見よう。', render(el) { el.append(refReactive()); } };
  if (iR >= 0) BASICS.scenes.splice(iR + 1, 0, rrScene); else BASICS.scenes.push(rrScene);

  /* ---- 補足（任意）：修飾子 ---- */
  K.reg({
    id: 'x-vue-event', track: 'extra', title: 'イベントの修飾子', sub: '【任意】.prevent / .stop / .enter / .once', emoji: '🎛️',
    meta: { cat: 'vue', day: '4日目', when: '【任意】イベント処理のあと、時間が余ったとき', mins: 10, order: 34, level: '任意', after: 'vue-basics', why: 'フォーム送信でページが読み込み直される、など「あれ？」を防ぐ。知っていると、バグ調査が早い' },
    scenes: [
      { t: '.prevent：ふだんの動きを止める', tag: '.prevent', lead: 'フォームを送信すると、ブラウザは<b>ページを読み込み直す</b>。これを止めるのが <code>.prevent</code>。', render(el) { el.append(prevent()); } },
      { t: '.stop：上へ伝わるのを止める', tag: '.stop', lead: 'クリックは<b>外側の部品へも伝わる</b>。止めたいときは <code>.stop</code>。', render(el) { el.append(stop()); } },
      { t: 'キーと .once', tag: '.enter .once', lead: '<code>.enter</code> <code>.esc</code> でキーを絞る。<code>.once</code> は<b>1回だけ</b>動く。', render(el) { el.append(keys()); } },
    ],
  });
})();
