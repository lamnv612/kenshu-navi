/* コンポーネント（vue-comp）を「親と子の2ファイル」で見せる形に組み直す。
   どのシーンも：親のファイル全文 ⇄ 子のファイル全文、間をデータが動く。ふつうの書き方／やってはいけない書き方 も並べる。 */
(function () {
  'use strict';
  const K = window.KENSHU;
  if (!K || !K.lessons || !K.lessons['vue-comp']) return;
  const { h, code, style, sleep } = K.W;
  const C = 'var(--vue)';

  style('vc', `
  .vc-stage{display:grid;grid-template-columns:minmax(0,1fr) 120px minmax(0,1fr);gap:10px;align-items:stretch;position:relative}
  @media(max-width:1000px){.vc-stage{grid-template-columns:1fr}.vc-mid{min-height:70px}}
  .vc-file{display:flex;flex-direction:column;gap:6px;min-width:0}.vc-file>pre.code{flex:1;margin:0}
  .vc-file>.vc-tag{display:flex;align-items:center;gap:6px;font:900 .8rem var(--font);padding:.3em .8em;border-radius:8px;width:max-content}
  .vc-file.p>.vc-tag{background:color-mix(in srgb,var(--ts) 22%,var(--card2));color:var(--ts)}
  .vc-file.c>.vc-tag{background:color-mix(in srgb,var(--vue) 22%,var(--card2));color:var(--vue)}
  .vc-mid{display:grid;align-content:center;justify-items:center;gap:10px;font-weight:900;font-size:.72rem;color:var(--mute);text-align:center}
  .vc-mid .dn{color:var(--ts)}.vc-mid .up{color:var(--team)}
  .vc-mid i{font-style:normal;font-size:1.7rem;line-height:1}
  .vc-pkt{position:absolute;z-index:6;padding:.15em .8em;border-radius:8px;font:800 .75rem var(--mono);background:var(--pc);color:#06101f;box-shadow:0 6px 18px -4px var(--pc);pointer-events:none;white-space:nowrap}
  .vc-file pre.code,.vi-panel pre.code{max-width:100%;overflow-x:auto}.vi-panel>*{min-width:0}
  .vc-grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
  @media(max-width:900px){.vc-grid3{grid-template-columns:1fr}}
  .vc-do,.vc-dont{padding:12px;border-radius:12px;border:2px solid var(--line);background:var(--card);display:grid;gap:6px;align-content:start;min-width:0}
  .vc-do{border-color:var(--ok)}.vc-dont{border-color:var(--bad)}
  .vc-do>b{color:var(--ok)}.vc-dont>b{color:var(--bad)}
  .vc-do small,.vc-dont small{color:var(--mute);font-weight:700;font-size:.74rem}
  .vc-card{padding:10px 12px;border-radius:10px;border:2px solid #cfd4e2;background:#fff;color:#223;display:grid;gap:6px;transition:.3s;min-width:0}
  .vc-card h3{margin:0;font-size:.95rem}
  .vc-card.done{opacity:.55}.vc-card.flash{animation:vcf .7s}
  @keyframes vcf{40%{box-shadow:0 0 0 4px var(--vue);transform:scale(1.03)}}
  .vc-cards{display:grid;gap:8px;background:#f4f6fb;border-radius:12px;padding:12px;min-width:0}
  .vc-log{font:700 .78rem var(--mono);padding:.5em .8em;border-radius:8px;background:var(--card2);border:1px solid var(--line);min-height:2.4em}
  .vc-nd{padding:6px 10px;border-radius:8px;border:2px dashed var(--mute);background:var(--card);font-weight:800;font-size:.8rem;cursor:pointer;transition:.25s}
  .vc-nd.on{border-style:solid;border-color:var(--vue);background:color-mix(in srgb,var(--vue) 24%,var(--card));transform:scale(1.02)}
  .vc-tr{display:grid;gap:5px;font:800 .8rem var(--mono)}
  `);

  const note = (t, c) => h('div', { class: 'vi-msg ' + (c || 'w') }, t);
  const tab = (list, cur, on) => h('div', { class: 'vi-row' }, ...list.map((t, i) => h('span', { class: 'vi-chip' + (i === cur ? '' : ' off'), style: { '--cc': C }, onclick: () => on(i) }, t)));

  /* host の中で、from → to へ小さなラベルが飛ぶ */
  async function pulse(host, a, b, text, color, ms) {
    if (!host.isConnected || !a || !b) return;
    const H = host.getBoundingClientRect(), A = a.getBoundingClientRect(), B = b.getBoundingClientRect();
    const p = h('div', { class: 'vc-pkt', style: { '--pc': color || 'var(--vue)' } }, text); host.append(p);
    if (!p.animate) { p.remove(); return; }
    const ax = A.left - H.left + A.width / 2, ay = A.top - H.top + A.height / 2;
    const dx = B.left - H.left + B.width / 2 - ax, dy = B.top - H.top + B.height / 2 - ay;
    p.style.left = ax + 'px'; p.style.top = ay + 'px';
    const tr = (k) => `translate(calc(-50% + ${dx * k}px),calc(-50% + ${dy * k}px))`;
    try { await p.animate([{ transform: tr(0) + ' scale(.6)', opacity: 0 }, { transform: tr(0), opacity: 1, offset: .12 }, { transform: tr(1), opacity: 1, offset: .88 }, { transform: tr(1) + ' scale(.6)', opacity: 0 }], { duration: ms || 800, easing: 'ease-in-out' }).finished; } catch (e) { /* cancelled */ }
    p.remove();
  }
  const lns = (src, keys) => { const o = []; src.split('\n').forEach((l, i) => { if (keys.some((k) => l.includes(k))) o.push(i + 1); }); return o; };
  const SRC = {
    app: "<script setup lang=\"ts\">\nimport { ref } from 'vue'\nimport AppHeader from './AppHeader.vue'\nimport SearchBox from './SearchBox.vue'\nimport CaseList from './CaseList.vue'\nimport AppFooter from './AppFooter.vue'\n\nconst keyword = ref('')\nconst cases = ref<Case[]>([\n  { id: 1, title: '離婚の相談', done: false },\n  { id: 2, title: '相続の相談', done: true },\n])\n</script>\n\n<template>\n  <AppHeader title=\"相談ナビ\" />\n  <SearchBox v-model=\"keyword\" />\n  <CaseList :items=\"cases\" />\n  <AppFooter />\n</template>",
    hd: "<script setup lang=\"ts\">\ndefineProps<{ title: string }>()\n</script>\n\n<template>\n  <header>\n    <h1>{{ title }}</h1>\n  </header>\n</template>",
    sb: "<script setup lang=\"ts\">\nconst model = defineModel<string>()\n</script>\n\n<template>\n  <input v-model=\"model\" placeholder=\"分野で検索\" />\n</template>",
    ls: "<script setup lang=\"ts\">\nimport CaseCard from './CaseCard.vue'\n\ndefineProps<{ items: Case[] }>()\nconst emit = defineEmits<{ toggle: [id: number] }>()\n</script>\n\n<template>\n  <CaseCard\n    v-for=\"c in items\"\n    :key=\"c.id\"\n    :item=\"c\"\n    @toggle=\"emit('toggle', $event)\"\n  />\n</template>",
    cd: "<script setup lang=\"ts\">\ndefineProps<{ item: Case }>()\nconst emit = defineEmits<{ toggle: [id: number] }>()\n</script>\n\n<template>\n  <article class=\"card\">\n    <h3>{{ item.title }}</h3>\n    <button @click=\"emit('toggle', item.id)\">\n      {{ item.done ? '✓ 完了' : '完了にする' }}\n    </button>\n  </article>\n</template>",
  };
  const TYPES = "export interface Case {\n  id: number\n  title: string\n  done: boolean\n}\n";
  const FILES = { './AppHeader.vue': ['AppHeader.vue', SRC.hd], './SearchBox.vue': ['SearchBox.vue', SRC.sb], './CaseList.vue': ['CaseList.vue', SRC.ls], './CaseCard.vue': ['CaseCard.vue', SRC.cd], './AppFooter.vue': ['AppFooter.vue', "<script setup lang=\"ts\">\n</script>\n\n<template>\n  <footer>© 相談ナビ</footer>\n</template>"], '@/types/case': ['types/case.ts', TYPES, 'ts'] };
  const fileBox = (kind, name, src, extra) => { const pre = code(src, 'vue', { color: kind === 'p' ? 'var(--ts)' : C, file: name, dim: true }); K.linkFiles && K.linkFiles(pre, FILES); const chips = K.linkChips ? K.linkChips(pre, FILES) : null; extra = extra || chips; return { pre, el: h('div', { class: 'vc-file ' + kind }, h('div', { class: 'vc-tag' }, kind === 'p' ? '👨 親' : '👶 子', ' ', name), pre, extra || null) }; };
  const dosDonts = (ok, ng) => h('div', { class: 'vi-eq' },
    h('div', { class: 'vc-do' }, h('b', '✓ こうするとよい'), ...ok.map(([t, s]) => h('div', null, t, s ? h('small', ' ' + s) : null))),
    h('div', { class: 'vc-dont' }, h('b', '✖ こうしない'), ...ng.map(([t, s]) => h('div', null, t, s ? h('small', ' ' + s) : null))));

  /* ============ ① コンポーネントって？ ============ */
  function whatIs() {
    const N = [
      { k: 'app', n: 'App.vue', d: 0, role: '一番上の親。ページ全体を組み立てる', pr: '—', em: '—', st: 'cases / keyword' },
      { k: 'hd', n: 'AppHeader.vue', d: 1, role: 'ロゴとメニュー', pr: 'title', em: '—', st: '—' },
      { k: 'sb', n: 'SearchBox.vue', d: 1, role: '検索欄', pr: 'modelValue', em: 'update:modelValue', st: '—' },
      { k: 'ls', n: 'CaseList.vue', d: 1, role: '相談カードを並べる', pr: 'items', em: 'toggle', st: '—' },
      { k: 'cd', n: 'CaseCard.vue', d: 2, role: '相談1件ぶんのカード（3枚ぶん使い回す）', pr: 'item', em: 'toggle', st: '—' },
    ];
    const FILE = { app: 'App.vue', hd: 'AppHeader.vue', sb: 'SearchBox.vue', ls: 'CaseList.vue', cd: 'CaseCard.vue' };
    const PARENT = { hd: 'app', sb: 'app', ls: 'app', cd: 'ls' };
    const USE = { hd: ['<AppHeader'], sb: ['<SearchBox'], ls: ['<CaseList'], cd: [':item=', 'v-for', '@toggle', '<CaseCard'] };
    const IO = ['defineProps', 'defineModel', 'defineEmits', 'emit('];
    const codeHost = h('div', { class: 'vc-stage' });
    let cur = 4;
    const detail = h('div', { class: 'vc-grid3' }), tree = h('div', { class: 'vc-tr' }), page = h('div', { class: 'vi-pg' });
    const els = {};
    const sel = (k) => { cur = N.findIndex((x) => x.k === k); draw(); };
    const drawCode = () => {
      const x = N[cur], me = fileBox('c', FILE[x.k], SRC[x.k]); me.pre.setHi(x.k === 'app' ? lns(SRC.app, ['<script', 'ref(']) : lns(SRC[x.k], IO));
      if (!PARENT[x.k]) { codeHost.replaceChildren(me.el); codeHost.style.gridTemplateColumns = '1fr'; return; }
      const par = fileBox('p', FILE[PARENT[x.k]], SRC[PARENT[x.k]]); par.pre.setHi(lns(SRC[PARENT[x.k]], USE[x.k]));
      codeHost.style.gridTemplateColumns = '';
      codeHost.replaceChildren(par.el, h('div', { class: 'vc-mid' }, h('span', { class: 'dn' }, '使う（タグ）'), h('i', { class: 'dn' }, '➜'), h('span', { class: 'up' }, '部品の中身')), me.el);
    };
    const draw = () => {
      const x = N[cur];
      drawCode();
      Object.entries(els).forEach(([k, e]) => e.classList.toggle('on', k === x.k || (x.k === 'ls' && k === 'cd') || x.k === 'app'));
      tree.replaceChildren(...N.map((n) => h('div', { class: 'vc-nd' + (n.k === x.k ? ' on' : ''), style: { marginLeft: n.d * 22 + 'px' }, onclick: () => sel(n.k) }, '📄 ' + n.n)));
      detail.replaceChildren(
        h('div', { class: 'vi-box', style: { borderColor: 'var(--ts)' } }, h('small', '⬇ props（親から受け取る）'), h('b', x.pr)),
        h('div', { class: 'vi-box', style: { borderColor: 'var(--team)' } }, h('small', '⬆ emit（親へ知らせる）'), h('b', x.em)),
        h('div', { class: 'vi-box', style: { borderColor: 'var(--ok)' } }, h('small', '📦 自分で持つデータ'), h('b', x.st)));
    };
    const mk = (k, label, kids) => { const e = h('div', { class: 'vc-nd', onclick: () => sel(k) }, label, ...(kids || [])); els[k] = e; return e; };
    page.append(mk('app', '<App />　ページ全体', [
      h('div', { style: { display: 'grid', gap: '6px', marginTop: '6px' } }, mk('hd', '<AppHeader />'), mk('sb', '<SearchBox />'),
        mk('ls', '<CaseList />', [h('div', { style: { display: 'grid', gap: '4px', marginTop: '6px' } }, ...[1, 2, 3].map(() => h('div', { class: 'vc-nd', style: { cursor: 'inherit' } }, '<CaseCard />')))]))]));
    page.querySelectorAll('.vc-nd').forEach((e) => { if (e.textContent.startsWith('<CaseCard')) { e.onclick = (ev) => { ev.stopPropagation(); sel('cd'); }; } });
    els.cd = [...page.querySelectorAll('.vc-nd')].find((e) => e.textContent.startsWith('<CaseCard'));
    const host = h('div', { style: { position: 'relative' } });
    const flow = async () => { const a = els.app, l = els.ls, c = els.cd, s = els.sb; await pulse(host, a, l, '⬇ items', 'var(--ts)'); await pulse(host, l, c, '⬇ item', 'var(--ts)'); await pulse(host, c, l, '⬆ toggle', 'var(--team)'); await pulse(host, l, a, '⬆ toggle', 'var(--team)'); };
    draw();
    host.append(h('div', { class: 'vi-eq' },
      h('div', { class: 'vi-panel' }, h('div', { class: 'vi-lb' }, '① 画面は、部品（コンポーネント）の入れ子（押して選ぶ）'), page, h('div', { class: 'vi-row' }, h('button', { class: 'btn primary', style: { '--c': C }, onclick: flow }, '▶ データの流れを見る'))),
      h('div', { class: 'vi-panel' }, h('div', { class: 'vi-lb' }, '② 部品 ＝ 1ファイル。木のようにつながる'), tree, h('div', { class: 'vi-lb', style: { marginTop: '6px' } }, '③ 選んだ部品の「入口・出口・持ち物」'), detail)));
    return h('div', { style: { display: 'grid', gap: '12px' } }, host,
      h('div', { class: 'vi-panel' }, h('div', { class: 'vi-lb' }, '④ 選んだ部品のコード（左：親でどう使うか ➜ 右：部品の中身。光る所が入口・出口）'), codeHost),
      dosDonts([['同じ見た目を2回以上使う', '（相談カード 3枚）'], ['名前を1つ付けられる役割', '（検索欄・ヘッダー）'], ['ファイルが長くなってきた', '（100行をこえたら分けどき）']],
        [['1か所だけ・3行の表示', '→ 分けると逆に読みにくい'], ['親のデータを何十個も受け渡すだけ', '→ 分け方を見直す'], ['ファイルを細かく分けすぎる', '→ 迷子になる']]),
      note('データは「親 → 子」へ下りる（props ⬇）。子から親へは「知らせる」だけ（emit ⬆）。この2本の道が、すべての基本。', 'w'));
  }

  /* ============ ② props ============ */
  function propsScene() {
    const P = "<script setup lang=\"ts\">\nimport { ref } from 'vue'\nimport CaseCard from './CaseCard.vue'\n\nimport type { Case } from '@/types/case'\n\nconst cases = ref<Case[]>([\n  { id: 1, title: '離婚の相談', done: false },\n  { id: 2, title: '相続の相談', done: true },\n])\n</script>\n\n<template>\n  <CaseCard v-for=\"c in cases\" :key=\"c.id\" :item=\"c\" />\n</template>";
    const Ch = "<script setup lang=\"ts\">\nimport type { Case } from '@/types/case'\n\ndefineProps<{ item: Case }>()\n</script>\n\n<template>\n  <article class=\"card\">\n    <h3>{{ item.title }}</h3>\n    <span v-if=\"item.done\">✓ 完了</span>\n  </article>\n</template>";
    const NG = "<script setup lang=\"ts\">\nimport type { Case } from '@/types/case'\n\nconst props = defineProps<{ item: Case }>()\n\n// ✖ 子で props を書き換える\nprops.item.done = true\n</script>\n\n<template>\n  <article class=\"card\">{{ item.title }}</article>\n</template>";
    let mode = 0;
    const data = [{ id: 1, title: '離婚の相談', done: false }, { id: 2, title: '相続の相談', done: true }];
    const pf = fileBox('p', 'CaseList.vue', P), cf = fileBox('c', 'CaseCard.vue', Ch);
    const stage = h('div', { class: 'vc-stage' }); const cards = h('div', { class: 'vc-cards' }), log = h('div', { class: 'vc-log' }, '親のデータを変えてみよう');
    const cardEls = data.map((d) => { const t = h('h3'), s = h('span', { style: { color: '#0a7', fontWeight: 800 } }), el = h('div', { class: 'vc-card' }, t, s); el.paint = () => { t.textContent = d.title; s.textContent = d.done ? '✓ 完了' : ''; el.classList.toggle('done', d.done); }; el.paint(); return el; });
    cards.append(...cardEls);
    const mid = h('div', { class: 'vc-mid' }, h('span', { class: 'dn' }, ':item'), h('i', { class: 'dn' }, '➜'), h('span', { class: 'dn' }, 'props'), h('span', { style: { fontSize: '.64rem' } }, '（読むだけ）'));
    const change = async (i, f, txt) => { f(data[i]); pf.pre.setHi(lns(P, ['const cases', ':item=']));  await pulse(stage, pf.pre, cf.pre, '⬇ ' + txt, 'var(--ts)'); cf.pre.setHi(lns(Ch, ['defineProps', '{{ item.title }}'])); cardEls[i].paint(); cardEls[i].classList.remove('flash'); void cardEls[i].offsetWidth; cardEls[i].classList.add('flash'); log.textContent = '親の cases[' + i + '] が変わった → 子のカードが自動で変わった'; };
    const ng = h('div', { class: 'vi-msg ng', style: { display: 'none' } });
    const live = h('div', { class: 'vi-panel' }, h('div', { class: 'vi-lb' }, '子が表示しているカード（親のデータを受け取っただけ）'), cards, h('div', { class: 'vi-row' },
      h('button', { class: 'btn primary', style: { '--c': C }, onclick: () => change(0, (d) => { d.title = d.title.endsWith('！') ? '離婚の相談' : '離婚の相談！'; }, 'title') }, '✏️ 親：1件目の title を変える'),
      h('button', { class: 'btn primary', style: { '--c': C }, onclick: () => change(1, (d) => { d.done = !d.done; }, 'done') }, '✏️ 親：2件目の done を反転')), log);
    const render = () => {
      const pair = mode === 0 ? [pf, cf] : [pf, fileBox('c', 'CaseCard.vue（✖ 悪い例）', NG)];
      stage.replaceChildren(pair[0].el, mid, pair[1].el);
      if (mode === 1) { pair[1].pre.setHi(lns(NG, ['props.item.done'])); ng.style.display = ''; ng.textContent = '⚠ [Vue warn] Set operation on key "done" failed: target is readonly。props は「読むだけ」。変えたいなら emit で親に頼む（次のシーン）'; } else ng.style.display = 'none';
      cf.pre = pair[1].pre;
    };
    render();
    return h('div', { style: { display: 'grid', gap: '12px' } }, tab(['✓ ふつうの書き方（読むだけ）', '✖ やってはいけない（子で書き換え）'], mode, (i) => { mode = i; render(); }), stage, ng, live,
      dosDonts([['親が持つデータを、:名前 で渡す', '（:item="c"）'], ['子は defineProps で宣言して、表示に使う'], ['渡す値が変わると、子も自動で変わる']],
        [['子で props を書き換える', '（警告が出る・親と食い違う）'], ['同じデータを子にも ref で持つ', '（コピーがズレる）'], ['名前を親と子で変える', '（:item と item を揃える）']]));
  }

  /* ============ ③ emit ============ */
  function emitScene() {
    const P = "<script setup lang=\"ts\">\nimport { ref } from 'vue'\nimport CaseCard from './CaseCard.vue'\n\nimport type { Case } from '@/types/case'\n\nconst cases = ref<Case[]>([\n  { id: 1, title: '離婚の相談', done: false },\n  { id: 2, title: '相続の相談', done: false },\n])\n\nfunction toggle(id: number) {\n  const c = cases.value.find((x) => x.id === id)\n  c.done = !c.done\n}\n</script>\n\n<template>\n  <CaseCard v-for=\"c in cases\" :key=\"c.id\" :item=\"c\" @toggle=\"toggle\" />\n</template>";
    const Ch = "<script setup lang=\"ts\">\nimport type { Case } from '@/types/case'\n\ndefineProps<{ item: Case }>()\nconst emit = defineEmits<{ toggle: [id: number] }>()\n</script>\n\n<template>\n  <article class=\"card\">\n    <h3>{{ item.title }}</h3>\n    <button @click=\"emit('toggle', item.id)\">\n      {{ item.done ? '✓ 完了' : '完了にする' }}\n    </button>\n  </article>\n</template>";
    const data = [{ id: 1, title: '離婚の相談', done: false }, { id: 2, title: '相続の相談', done: false }];
    const pf = fileBox('p', 'CaseList.vue', P), cf = fileBox('c', 'CaseCard.vue', Ch);
    const stage = h('div', { class: 'vc-stage' }, pf.el, h('div', { class: 'vc-mid' }, h('span', { class: 'up' }, '@toggle'), h('i', { class: 'up' }, '➜'), h('span', { class: 'up' }, 'emit'), h('span', { style: { fontSize: '.64rem' } }, '（知らせるだけ）')), cf.el);
    const log = h('div', { class: 'vc-log' }, '子のボタンを押してみよう');
    const cardEls = data.map((d, i) => { const t = h('h3'), b = h('button', { style: { padding: '.35em .9em', borderRadius: '6px', border: '1px solid #99a', cursor: 'pointer', justifySelf: 'start' } }), el = h('div', { class: 'vc-card' }, t, b); el.paint = () => { t.textContent = d.title; b.textContent = d.done ? '✓ 完了' : '完了にする'; el.classList.toggle('done', d.done); }; b.onclick = async () => {
      cf.pre.setHi(lns(Ch, ["emit('toggle'", 'defineEmits'])); log.textContent = `① 子：emit('toggle', ${d.id}) で親に知らせる`;
      await pulse(stage, cf.pre, pf.pre, `⬆ toggle(${d.id})`, 'var(--team)', 700);
      pf.pre.setHi(lns(P, ['function toggle', 'c.done', '@toggle'])); log.textContent = `② 親：toggle(${d.id}) が動き、親のデータ（done）を書き換えた`;
      d.done = !d.done; await sleep(450);
      await pulse(stage, pf.pre, cf.pre, '⬇ item', 'var(--ts)', 700); el.paint(); el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); log.textContent = '③ 親のデータが変わったので、props 経由で子の表示も変わった（⬇）';
    }; el.paint(); return el; });
    const cards = h('div', { class: 'vc-cards' }, ...cardEls);
    return h('div', { style: { display: 'grid', gap: '12px' } }, stage,
      h('div', { class: 'vi-panel' }, h('div', { class: 'vi-lb' }, '子のカード（ボタンを押す → ⬆ 知らせる → 親が書き換える → ⬇ 表示が変わる）'), cards, log),
      h('div', { class: 'vc-grid3' },
        ...[['① 子', '押された！と emit で知らせる', 'var(--team)'], ['② 親', 'toggle が動いてデータを書き換える', 'var(--ts)'], ['③ 子', 'props で新しいデータを受け取る', C]].map(([a, b, c]) => h('div', { class: 'vi-box', style: { borderColor: c } }, h('small', a), h('b', b)))),
      dosDonts([['子は「押された」と知らせるだけ', "（emit('toggle', id)）"], ['データを書き換えるのは持ち主（親）'], ['イベント名は動詞で（toggle・close・save）']],
        [['子が props.item.done を書き換える', '（親と食い違う）'], ['親の関数を子に直接渡して呼ばせる', '（部品が使い回せなくなる）'], ['emit する値が多すぎる', '（id か、まとまった1つだけ）']]));
  }

  /* ============ ④ v-model を部品に ============ */
  function modelScene() {
    const P = "<script setup lang=\"ts\">\nimport { ref } from 'vue'\nimport SearchBox from './SearchBox.vue'\n\nconst keyword = ref('')\n</script>\n\n<template>\n  <SearchBox v-model=\"keyword\" />\n  <p>検索ワード：{{ keyword }}</p>\n</template>";
    const SH = "<script setup lang=\"ts\">\nconst model = defineModel<string>()\n</script>\n\n<template>\n  <input v-model=\"model\" placeholder=\"分野で検索\" />\n</template>";
    const LG = "<script setup lang=\"ts\">\ndefineProps<{ modelValue: string }>()\nconst emit = defineEmits<{ 'update:modelValue': [value: string] }>()\n</script>\n\n<template>\n  <input\n    :value=\"modelValue\"\n    @input=\"emit('update:modelValue', $event.target.value)\"\n    placeholder=\"分野で検索\"\n  />\n</template>";
    let long = false, val = '';
    const pf = fileBox('p', 'App.vue', P); let cf = fileBox('c', 'SearchBox.vue', SH);
    const stage = h('div', { class: 'vc-stage' });
    const inp = h('input', { placeholder: '分野で検索', style: { padding: '.5em .8em', borderRadius: '8px', border: '1px solid #99a', width: '100%', boxSizing: 'border-box' } }), shown = h('b', { style: { fontSize: '1.1rem' } }, '（空）');
    const log = h('div', { class: 'vc-log' }, '子の入力欄に打つ ⬆、親のボタンで読み込む ⬇');
    let busy = false;
    inp.addEventListener('input', async () => { val = inp.value; cf.pre.setHi(lns(long ? LG : SH, long ? ['@input', 'update:modelValue'] : ['defineModel', 'v-model'])); if (busy) { shown.textContent = val || '（空）'; return; } busy = true; log.textContent = '⬆ 子が親へ（update:modelValue）'; await pulse(stage, cf.pre, pf.pre, '⬆ ' + (val || '空'), 'var(--team)', 600); pf.pre.setHi(lns(P, ['const keyword', 'v-model', '{{ keyword }}'])); shown.textContent = val || '（空）'; busy = false; });
    const load = async () => { const v = ['離婚', '相続', '労働'][Math.floor(Math.random() * 3)]; pf.pre.setHi(lns(P, ['const keyword'])); log.textContent = '⬇ 親が keyword を変えた → 子の入力欄へ（modelValue）'; await pulse(stage, pf.pre, cf.pre, '⬇ ' + v, 'var(--ts)', 700); val = v; inp.value = v; shown.textContent = v; cf.pre.setHi(lns(long ? LG : SH, long ? [':value'] : ['v-model'])); };
    const render = () => {
      cf = fileBox('c', long ? 'SearchBox.vue（長い書き方）' : 'SearchBox.vue（短い書き方）', long ? LG : SH);
      stage.replaceChildren(pf.el, h('div', { class: 'vc-mid' }, h('span', { class: 'dn' }, ':modelValue'), h('i', { class: 'dn' }, '⬇'), h('i', { class: 'up' }, '⬆'), h('span', { class: 'up' }, '@update:modelValue')), cf.el);
    };
    render();
    return h('div', { style: { display: 'grid', gap: '12px' } }, tab(['✓ 短い書き方（defineModel）', '長い書き方（props ＋ emit）'], long ? 1 : 0, (i) => { long = i === 1; render(); }), stage,
      h('div', { class: 'vi-eq' },
        h('div', { class: 'vi-panel' }, h('div', { class: 'vi-lb' }, '👶 子：SearchBox の入力欄'), inp, h('button', { class: 'btn', onclick: load }, '👨 親：下書きを読み込む')),
        h('div', { class: 'vi-panel' }, h('div', { class: 'vi-lb' }, '👨 親が持つ keyword'), h('div', { class: 'vi-scr', style: { minHeight: 0, justifyItems: 'center' } }, shown), log)),
      h('div', { class: 'vi-box' }, h('small', '覚え方'), h('b', 'v-model ＝ props（⬇ modelValue）＋ emit（⬆ update:modelValue）の合体')),
      dosDonts([['入力欄・スイッチ・セレクトなど、値を1つ持つ部品', '（SearchBox・ToggleSwitch）'], ['親は v-model="変数" と書くだけ'], ['値が1つなら defineModel の1行で済む']],
        [['値が複数あり、イベントも種類が多い部品', '→ props と emit を分ける'], ['子が自分で ref を作って親に写し直す', '（2つがズレる）'], ['親でも子でも同じ値を書き換える', '（持ち主は1人）']]));
  }

  const L = K.lessons['vue-comp'];
  const old = {}; L.scenes.forEach((s) => { old[s.t] = s; });
  const rebuild = (t, tag, lead, fn) => { const o = old[t] || {}; return Object.assign({}, o, { t, tag, lead, render(el) { el.append(fn()); } }); };
  const first = { t: 'コンポーネントって？', tag: 'COMPONENT', lead: '画面は<b>部品の入れ子</b>。部品を押すと、<b>入口・出口・持ち物</b>が見える。', render(el) { el.append(whatIs()); } };
  L.scenes = [first,
    rebuild('props：親から子へ', 'props ⬇', '<b>親</b>のデータを、<b>子</b>が受け取る。2つのファイルと、間を流れるデータを見よう。', propsScene),
    rebuild('emit：子から親へ', 'emit ⬆', '子は<b>知らせる</b>だけ。書き換えるのは<b>親</b>。ボタンを押して、流れを追おう。', emitScene),
    rebuild('v-model を部品に', 'v-model ⇅', '<b>props ⬇ と emit ⬆</b> のセットが v-model。入力して、両方向を見よう。', modelScene),
  ].concat(L.scenes.filter((s) => !['props：親から子へ', 'emit：子から親へ', 'v-model を部品に'].includes(s.t)));
})();
