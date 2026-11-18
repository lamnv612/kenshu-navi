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
    const P = "<script setup lang=\"ts\">\nimport { ref } from 'vue'\nimport SearchBox from './SearchBox.vue'\n\nconst keyword = ref<string>('')\n</script>\n\n<template>\n  <SearchBox v-model=\"keyword\" />\n  <p>検索ワード：{{ keyword }}</p>\n</template>";
    const S0 = "<script setup lang=\"ts\">\n// まだ何もつながっていない\n</script>\n\n<template>\n  <input placeholder=\"分野で検索\" />\n</template>";
    const S1 = "<script setup lang=\"ts\">\nconst model = defineModel<string>()\n</script>\n\n<template>\n  <input placeholder=\"分野で検索\" />\n</template>";
    const S2 = "<script setup lang=\"ts\">\nconst model = defineModel<string>()\n</script>\n\n<template>\n  <input v-model=\"model\" placeholder=\"分野で検索\" />\n</template>";
    const S3 = "<script setup lang=\"ts\">\ndefineProps<{ modelValue: string }>()\nconst emit = defineEmits<{ 'update:modelValue': [value: string] }>()\n</script>\n\n<template>\n  <input\n    :value=\"modelValue\"\n    @input=\"emit('update:modelValue', ($event.target as HTMLInputElement).value)\"\n    placeholder=\"分野で検索\"\n  />\n</template>";
    const STEPS = [
      { tab: '① 親が使う', src: S0, file: 'SearchBox.vue（空）', pHi: ['v-model'], cHi: [], log: '① 親は v-model と書くだけ。でも子がまだ空なので、入力しても親に届かない。' },
      { tab: '② 子が受け取る', src: S1, file: 'SearchBox.vue', pHi: ['v-model'], cHi: ['defineModel'], log: '② 子に defineModel を1行足す。親の keyword と、子の model がつながった。' },
      { tab: '③ 入力欄につなぐ', src: S2, file: 'SearchBox.vue', pHi: ['v-model', '{{ keyword }}'], cHi: ['defineModel', 'v-model'], log: '③ input に v-model="model"。これで完成。入力 ⬆ と、読み込み ⬇ を試そう。' },
      { tab: '（参考）長い書き方', src: S3, file: 'SearchBox.vue（長い書き方）', pHi: ['v-model'], cHi: ['defineProps', 'defineEmits', ':value', '@input'], log: '同じ動き。②③を props ＋ emit で書くと、この長さになる。' },
    ];
    let step = 0, val = '';
    const stage = h('div', { class: 'vc-stage' });
    const pf = fileBox('p', 'SearchPage.vue', P);
    const inp = h('input', { placeholder: '分野で検索', style: { padding: '.5em .8em', borderRadius: '8px', border: '1px solid #99a', width: '100%', boxSizing: 'border-box' } }), shown = h('b', { style: { fontSize: '1.1rem' } }, '（空）');
    const log = h('div', { class: 'vc-log' });
    const ready = () => step >= 2;
    let cf, busy = false;
    const render = () => {
      const s = STEPS[step];
      cf = fileBox('c', s.file, s.src);
      stage.replaceChildren(pf.el, h('div', { class: 'vc-mid' }, h('span', { class: 'dn' }, ':modelValue'), h('i', { class: 'dn' }, '⬇'), h('i', { class: 'up' }, '⬆'), h('span', { class: 'up' }, '@update:modelValue')), cf.el);
      pf.pre.setHi(lns(P, s.pHi)); cf.pre.setHi(s.cHi.length ? lns(s.src, s.cHi) : []);
      inp.disabled = !ready(); inp.style.opacity = ready() ? 1 : .45; inp.placeholder = ready() ? '分野で検索' : '（子がまだつながっていない）';
      log.textContent = s.log;
    };
    inp.addEventListener('input', async () => {
      val = inp.value; cf.pre.setHi(lns(STEPS[step].src, STEPS[step].cHi));
      if (busy) { shown.textContent = val || '（空）'; return; } busy = true;
      await pulse(stage, cf.pre, pf.pre, '⬆ ' + (val || '空'), 'var(--team)', 600);
      pf.pre.setHi(lns(P, ['const keyword', 'v-model', '{{ keyword }}'])); shown.textContent = val || '（空）'; busy = false;
    });
    const load = h('button', { class: 'btn', onclick: async () => {
      if (!ready()) { log.textContent = '子がまだつながっていないので、親が値を変えても届かない。② ③ へ進もう。'; return; }
      const v = ['離婚', '相続', '労働'][Math.floor(Math.random() * 3)];
      pf.pre.setHi(lns(P, ['const keyword'])); await pulse(stage, pf.pre, cf.pre, '⬇ ' + v, 'var(--ts)', 700);
      val = v; inp.value = v; shown.textContent = v; cf.pre.setHi(lns(STEPS[step].src, STEPS[step].cHi));
    } }, '👨 親：「検索ワード」を書き換える');
    render();
    let chips = [];
    const tabEl = tab(STEPS.map((s) => s.tab), 0, (i) => { step = i; render(); chips.forEach((c, j) => c.classList.toggle('off', j !== i)); });
    chips = [...tabEl.children];
    return h('div', { style: { display: 'grid', gap: '12px' } }, tabEl, stage,
      h('div', { class: 'vi-eq' },
        h('div', { class: 'vi-panel' }, h('div', { class: 'vi-lb' }, '👶 子：SearchBox の入力欄'), inp, load),
        h('div', { class: 'vi-panel' }, h('div', { class: 'vi-lb' }, '👨 親が持つ keyword'), h('div', { class: 'vi-scr', style: { minHeight: 0, justifyItems: 'center' } }, shown), log)));
  }

  const L = K.lessons['vue-comp'];
  const old = {}; L.scenes.forEach((s) => { old[s.t] = s; });
  const rebuild = (t, tag, lead, fn) => { const o = Object.assign({}, old[t] || {}); delete o.why; return Object.assign(o, { t, tag, lead, render(el) { el.append(fn()); } }); };

  /* ============ ⓪ コンポーネントって？（なし ⇄ あり を比べる） ============ */
  style('vc2', `
  .vw{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:14px;align-items:start}
  @media(max-width:980px){.vw{grid-template-columns:1fr}}
  .vw-col{display:grid;gap:10px;min-width:0}
  .vw-prev{background:#f4f6fb;border-radius:14px;padding:12px;display:grid;gap:8px}
  .vw-card{background:#fff;color:#223;border:2px solid #d7dbe8;border-radius:10px;padding:8px 12px;display:flex;align-items:center;justify-content:space-between;gap:8px;transition:.3s}
  .vw-card b{font-size:.95rem}
  .vw-btn{border:0;border-radius:8px;padding:.35em .9em;font:800 .8rem var(--font);color:#fff;background:#8d96ad;transition:.35s}
  .vw-btn.blue{background:#2f7bff}
  .vw-card.flash{animation:vwf .8s}
  @keyframes vwf{40%{box-shadow:0 0 0 4px #2f7bff;transform:scale(1.03)}}
  .vw-card.miss{border-color:#ff9f43;animation:vwm 1s infinite}
  @keyframes vwm{50%{box-shadow:0 0 0 3px #ff9f4366}}
  .vw-card.new{animation:vwn .5s}
  @keyframes vwn{from{opacity:0;transform:translateY(-8px)}}
  .vw-cnt{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:12px;background:var(--card);border:2px solid var(--line)}
  .vw-cnt .n{font:900 2rem var(--font);line-height:1;transition:.3s}
  .vw-cnt .n.bad{color:var(--bad)}.vw-cnt .n.good{color:var(--ok)}
  .vw-cnt small{color:var(--mute);font-weight:800}
  .vw-act{display:flex;gap:8px;flex-wrap:wrap}
  .vw-lbrick{display:flex;gap:6px;flex-wrap:wrap;align-items:center;font-size:1.4rem}
  `);
  function whyComponent() {
    const TITLES = ['離婚の相談', '相続の相談', '労働の相談', '交通事故の相談', '債務整理の相談'];
    let mode = 0, n = 3, fixed = [], blue = false, last = -1, msg = '';
    const B = {};
    const prev = h('div', { class: 'vw-prev' }), codes = h('div', { class: 'vw-col' }), cnt = h('div', { class: 'vw-cnt' }), log = h('div', { class: 'vc-log' });
    const bFix = h('button', { class: 'btn' }), bAdd = h('button', { class: 'btn ghost' }, '➕ カードを1枚ふやす'), bReset = h('button', { class: 'btn ghost' }, '⟲ もどす');
    const srcNo = () => '<template>\n' + TITLES.slice(0, n).map((t, i) => `  <div class="card">\n    <h3>${t}</h3>\n    <button class="btn${fixed[i] ? ' blue' : ''}">相談する</button>\n  </div>`).join('\n') + '\n</template>';
    const srcCard = () => `<script setup lang="ts">\ndefineProps<{ title: string }>()\n</script>\n\n<template>\n  <div class="card">\n    <h3>{{ title }}</h3>\n    <button class="btn${blue ? ' blue' : ''}">相談する</button>\n  </div>\n</template>`;
    const srcApp = () => `<script setup lang="ts">\nimport CaseCard from './CaseCard.vue'\n</script>\n\n<template>\n` + TITLES.slice(0, n).map((t) => `  <CaseCard title="${t}" />`).join('\n') + '\n</template>';
    const box = (name, src, hi, color) => { const pre = code(src, 'vue', { color, file: name, dim: true }); pre.setHi && pre.setHi(hi || []); return pre; };
    const draw = (flashAll) => {
      const left = fixed.filter(Boolean).length;
      prev.replaceChildren(...TITLES.slice(0, n).map((t, i) => {
        const on = mode === 0 ? fixed[i] : blue;
        const miss = mode === 0 && left > 0 && left < n && !fixed[i];
        return h('div', { class: 'vw-card' + (miss ? ' miss' : '') + ((flashAll || (mode === 0 && i === last)) ? ' flash' : ''), style: { animationDelay: flashAll ? i * 120 + 'ms' : '0ms' } }, h('b', t), h('span', { class: 'vw-btn' + (on ? ' blue' : '') }, '相談する'));
      }));
      if (mode === 0) { B.no = box('CaseListPage.vue（同じ形を、コピペで何枚も）', srcNo(), last >= 0 ? [4 + 4 * last] : [], 'var(--ts)'); codes.replaceChildren(B.no); }
      else { B.card = box('CaseCard.vue（部品：1回だけ書く）', srcCard(), blue ? [8] : [], C); B.app = box('CaseListPage.vue（部品を呼ぶだけ）', srcApp(), [], 'var(--ts)'); codes.replaceChildren(B.card, B.app); }
      /* カードにカーソル → 対応するコードの行が光る */
      [...prev.children].forEach((cardEl, i) => {
        cardEl.style.cursor = 'help';
        cardEl.addEventListener('mouseenter', () => {
          if (mode === 0) B.no.setHi([2 + 4 * i, 3 + 4 * i, 4 + 4 * i, 5 + 4 * i], 'h2');
          else { B.card.setHi([6, 7, 8, 9], 'h2'); B.app.setHi([6 + i], 'h2'); }
        });
        cardEl.addEventListener('mouseleave', () => { if (mode === 0) B.no.setHi([], 'h2'); else { B.card.setHi([], 'h2'); B.app.setHi([], 'h2'); } });
      });
      const need = mode === 0 ? n : 1;
      cnt.replaceChildren(h('span', null, '✏️ 直す場所'), h('span', { class: 'n ' + (mode === 0 ? 'bad' : 'good') }, String(need)), h('small', 'か所'));
      bFix.textContent = mode === 0 ? (left >= n ? '✅ 全部直した' : `🎨 ボタンを青にしたい（あと ${n - left} か所）`) : (blue ? '✅ 直した' : '🎨 ボタンを青にしたい');
      log.textContent = msg || (mode === 0 ? '同じコードが何枚分もある。1枚ずつ直すしかない…' : '見た目は CaseCard.vue の1か所だけ。CaseListPage.vue は「呼ぶだけ」。');
    };
    const reset = (m) => { mode = m; fixed = TITLES.map(() => false); blue = false; last = -1; msg = ''; draw(); chips.forEach((c, j) => c.classList.toggle('off', j !== m)); };
    bFix.onclick = () => {
      if (mode === 0) {
        const i = fixed.slice(0, n).findIndex((x) => !x); if (i < 0) return;
        fixed[i] = true; last = i; const left = fixed.slice(0, n).filter(Boolean).length;
        msg = left < n ? `${left} / ${n} か所だけ直した。残りは「直し忘れ」！（オレンジの枠）` : `やっと ${n} か所ぜんぶ…。カードが増えるほど大変になる。`;
        draw();
      } else { if (blue) return; blue = true; msg = '1か所直しただけで、ぜんぶのカードが青になった ✨'; draw(true); }
    };
    bAdd.onclick = () => { if (n >= TITLES.length) return; n++; msg = mode === 0 ? `コピペで ${n} 枚目。コードが 4 行ふえた。（直す場所も ${n} か所に）` : `${n} 枚目は <CaseCard … /> を 1 行足すだけ。`; draw(); };
    bReset.onclick = () => reset(mode);
    let chips = [];
    const tabEl = tab(['😖 部品なし（コピペ）', '✨ 部品あり（CaseCard.vue）'], 0, (i) => reset(i));
    chips = [...tabEl.children];
    reset(0);
    return h('div', { style: { display: 'grid', gap: '14px' } },
      tabEl,
      h('div', { class: 'vw' },
        h('div', { class: 'vw-col' }, h('div', { class: 'vi-lb' }, '👀 画面（カードにカーソルを乗せる → 対応する行が光る）'), prev, cnt, h('div', { class: 'vw-act' }, bFix, bAdd, bReset), log),
        h('div', { class: 'vw-col' }, h('div', { class: 'vi-lb' }, '📄 ファイルの中身'), codes)),
      dosDonts([['同じ見た目が何回も出る（カード・ボタン・入力欄）', '→ 1つの部品に'], ['中身だけ違う（案件名など）', '→ props で渡す']], [['同じコードをコピペで増やす', '（直す場所が増える）'], ['1回しか使わない小さな部分まで分けすぎる']]));
  }


  /* ============ props / emit / v-model：その前の「困りごと → 解決」アニメ ============ */
  style('vc3', `
  .vq-prob{display:flex;gap:10px;align-items:center;padding:12px 16px;border-radius:12px;border:2px solid var(--bad);background:color-mix(in srgb,var(--bad) 10%,var(--card));font-weight:800}
  .vq-prob.ok{border-color:var(--ok);background:color-mix(in srgb,var(--ok) 10%,var(--card))}
  .vq-prob .e{font-size:1.6rem}
  .vq-stage{position:relative;display:grid;gap:12px;padding:14px;border-radius:14px;background:var(--card);border:2px solid var(--line);min-width:0}
  .vq-box{border:2px dashed var(--mute);border-radius:12px;padding:10px 12px;display:grid;gap:8px;min-width:0;transition:.3s}
  .vq-box>b{font:900 .78rem var(--mono);color:var(--mute)}
  .vq-box.p{border-color:var(--ts)}.vq-box.p>b{color:var(--ts)}
  .vq-box.c{border-color:var(--vue)}.vq-box.c>b{color:var(--vue)}
  .vq-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px}
  .vq-card{background:#fff;color:#223;border:2px solid #d7dbe8;border-radius:10px;padding:8px 10px;display:flex;justify-content:space-between;align-items:center;gap:6px;transition:.35s;font-weight:800}
  .vq-card.fill{border-color:var(--vue);box-shadow:0 0 0 3px #2fd4a455}
  .vq-card.gone{opacity:0;transform:scale(.6);height:0;padding:0;margin:0;border-width:0;overflow:hidden}
  .vq-card.shake{animation:vqs .4s}
  @keyframes vqs{25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
  .vq-card.empty{color:#aab;border-style:dashed}
  .vq-file{font:800 .7rem var(--mono);color:#556;background:#eef1f8;border-radius:6px;padding:.1em .5em}
  .vq-del{border:0;background:#ff6b81;color:#fff;border-radius:7px;padding:.25em .6em;font-weight:800;cursor:pointer}
  .vq-big{display:flex;align-items:center;gap:10px;font-weight:900}.vq-big .n{font:900 2rem var(--font);line-height:1}
  .vq-big .n.bad{color:var(--bad)}.vq-big .n.good{color:var(--ok)}
  .vq-in{padding:.5em .8em;border-radius:8px;border:1px solid #99a;width:100%;box-sizing:border-box}
  `);
  const NAMES = ['離婚の相談', '相続の相談', '労働の相談', '交通事故の相談', '債務整理の相談'];

  /* 共通の外枠：① 困りごと → ② 解決（タブで切り替え）。上に「いま何を解決したいか」を1行で出す */
  function whyShell(problem, solved, draw) {
    let step = 0;
    const banner = h('div', { class: 'vq-prob' }), body = h('div'), chipsBox = [];
    const render = () => {
      banner.className = 'vq-prob' + (step ? ' ok' : '');
      banner.replaceChildren(h('span', { class: 'e' }, step ? '✅' : '😖'), h('span', { html: step ? solved : problem }));
      body.replaceChildren(draw(step));
      chipsBox.forEach((c, j) => c.classList.toggle('off', j !== step));
    };
    const t = tab(['① こまった…（まだ無い）', '② 解決！（これがあると）'], 0, (i) => { step = i; render(); });
    chipsBox.push(...t.children);
    render();
    return h('div', { style: { display: 'grid', gap: '12px' } }, banner, t, body);
  }

  /* ---- props の前：なぜ必要？ ---- */
  function propsWhy() {
    return whyShell('案件カードを3種類出したい。<b>中身だけ違う</b>のに、カードごとに別のファイルを作る…？',
      '<b>1つの CaseCard.vue</b> を作り、<b>親が中身（title）を渡す</b>。これが props。',
      (step) => {
        let n = 3;
        const stage = h('div', { class: 'vq-stage' }), cnt = h('div', { class: 'vq-big' }), log = h('div', { class: 'vc-log' });
        const bGo = h('button', { class: 'btn' }, step ? '▶ 親が title を渡す' : '▶ 1枚足す（ファイルを作る）'), bAdd = h('button', { class: 'btn ghost' }, '＋ 案件を足す');
        const draw = () => {
          if (!step) {
            stage.replaceChildren(h('div', { class: 'vq-row' }, ...NAMES.slice(0, n).map((t, i) => h('div', { class: 'vq-card' }, h('span', t), h('span', { class: 'vq-file' }, 'Card' + (i + 1) + '.vue')))));
            cnt.replaceChildren(h('span', 'ファイル数'), h('span', { class: 'n bad' }, String(n)), h('small', '個（カードが増えるたび増える）'));
            log.textContent = '見た目は同じなのに、文字だけ違うファイルが何個も…。';
          } else {
            stage.replaceChildren(
              h('div', { class: 'vq-box p' }, h('b', '親 CaseList.vue（データを持つ）'), h('div', { class: 'vq-row' }, ...NAMES.slice(0, n).map((t) => h('div', { class: 'vq-card' }, h('span', t), h('span', { class: 'vq-file' }, ':title'))))),
              h('div', { class: 'vq-box c' }, h('b', '子 CaseCard.vue（1ファイルを使い回す）'), h('div', { class: 'vq-row' }, ...NAMES.slice(0, n).map(() => h('div', { class: 'vq-card empty' }, h('span', '…'))))));
            cnt.replaceChildren(h('span', 'ファイル数'), h('span', { class: 'n good' }, '1'), h('small', '個（何枚でも CaseCard.vue だけ）'));
            log.textContent = '「▶ 親が title を渡す」を押してみよう。';
          }
        };
        bAdd.onclick = () => { if (n < NAMES.length) { n++; draw(); } };
        bGo.onclick = async () => {
          if (!step) { n = Math.min(n + 1, NAMES.length); draw(); log.textContent = '新しい案件のたびに、ファイルをコピーして作る…'; return; }
          const parents = [...stage.querySelectorAll('.vq-box.p .vq-card')], kids = [...stage.querySelectorAll('.vq-box.c .vq-card')];
          log.textContent = '親から子へ、title を渡している…';
          for (let i = 0; i < kids.length; i++) { pulse(stage, parents[i], kids[i], ':title', 'var(--ts)', 650); await sleep(180); }
          await sleep(550);
          kids.forEach((k, i) => { k.classList.remove('empty'); k.classList.add('fill'); k.replaceChildren(h('span', NAMES[i])); });
          log.textContent = '同じ CaseCard.vue が、渡された title で別々の表示になった ✨';
        };
        draw();
        return h('div', { style: { display: 'grid', gap: '10px' } }, stage, cnt, h('div', { class: 'vw-act' }, bGo, bAdd), log);
      });
  }

  /* ---- emit の前：なぜ必要？ ---- */
  function emitWhy() {
    return whyShell('カードの「🗑 削除」を押したい。でも<b>リストを持っているのは親</b>。子が勝手に消してよい…？',
      '子は <b>emit で「消して」とお願い</b>するだけ。<b>消すのは、リストの持ち主（親）</b>。',
      (step) => {
        let items = NAMES.slice(0, 3).map((t, i) => ({ id: i + 1, t }));
        const stage = h('div', { class: 'vq-stage' }), log = h('div', { class: 'vc-log' });
        const reset = h('button', { class: 'btn ghost' }, '⟲ もどす');
        const draw = () => {
          const head = h('b', null, '親 CaseList.vue（リストを持つ）'), list = h('div', { style: { display: 'grid', gap: '8px' } });
          items.forEach((it) => {
            const card = h('div', { class: 'vq-card', 'data-id': it.id }, h('span', it.t));
            const btn = h('button', { class: 'vq-del' }, '🗑 削除');
            btn.onclick = async () => {
              if (!step) {
                card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake');
                log.textContent = '🚫 子は親のリスト（props）を書き換えられない。直接消すと「誰が消したか」が追えなくなる。';
              } else {
                log.textContent = '子 → 親：emit("remove", ' + it.id + ') 「消して！」';
                await pulse(stage, btn, head, "emit('remove')", 'var(--pink)', 700);
                card.classList.add('gone'); log.textContent = '✅ 親が「消して」を受け取り、親のリストから ' + it.t + ' を削除した。';
                await sleep(400); items = items.filter((x) => x.id !== it.id); draw();
              }
            };
            card.append(btn); list.append(card);
          });
          stage.replaceChildren(h('div', { class: 'vq-box p' }, head, list, items.length ? null : h('div', { style: { color: 'var(--mute)', fontWeight: 800 } }, '（空になった。もどすで復活）')));
        };
        reset.onclick = () => { items = NAMES.slice(0, 3).map((t, i) => ({ id: i + 1, t })); log.textContent = step ? '🗑 を押してみよう。' : '🗑 を押してみよう。'; draw(); };
        draw(); log.textContent = '🗑 を押してみよう。';
        return h('div', { style: { display: 'grid', gap: '10px' } }, stage, h('div', { class: 'vw-act' }, reset), log);
      });
  }

  /* ---- v-model の前：なぜ必要？ ---- */
  function modelWhy() {
    return whyShell('入力欄を部品にした。<b>親と子で同じ値</b>を保ちたい。そのたび <b>props と emit を2本ずつ</b>書く…？',
      '<b>v-model 1行</b>で、「親 ⇄ 子」の両方向がつながる。入力欄・スイッチなどの部品で大活躍。',
      (step) => {
        let kw = '';
        const stage = h('div', { class: 'vq-stage' }), log = h('div', { class: 'vc-log' });
        const val = h('b', { style: { fontSize: '1.1rem' } }, '（空）');
        const inp = h('input', { class: 'vq-in', placeholder: '分野で検索（子の入力欄）' });
        const parent = h('div', { class: 'vq-box p' }, h('b', '親 SearchPage.vue（keyword を持つ）'), h('div', null, 'keyword = ', val));
        const child = h('div', { class: 'vq-box c' }, h('b', '子 SearchBox.vue'), inp);
        const mid = h('div', { style: { display: 'grid', gap: '4px', justifyItems: 'center', font: '800 .75rem var(--mono)', color: 'var(--mute)' } },
          step ? h('span', null, '↕ v-model（1本）') : h('span', null, '↓ :modelValue ／ ↑ @update:modelValue（2本）'));
        const code1 = code(step ? '<SearchBox v-model="keyword" />' : '<SearchBox\n  :modelValue="keyword"\n  @update:modelValue="keyword = $event"\n/>', 'vue', { color: 'var(--ts)', file: 'SearchPage.vue', dim: true });
        code1.setHi && code1.setHi(step ? [1] : [2, 3]);
        stage.replaceChildren(parent, mid, child, code1);
        let busy = false;
        inp.addEventListener('input', async () => {
          kw = inp.value; if (busy) { val.textContent = kw || '（空）'; return; } busy = true;
          log.textContent = '子 → 親：update:modelValue（' + (kw || '空') + '）';
          await pulse(stage, child, parent, '⬆ ' + (kw || '空'), 'var(--team)', 600);
          val.textContent = kw || '（空）'; busy = false;
        });
        const load = h('button', { class: 'btn' }, '👨 親：「相続」を書き込む');
        load.onclick = async () => { log.textContent = '親 → 子：:modelValue（相続）'; await pulse(stage, parent, child, '⬇ 相続', 'var(--ts)', 650); kw = '相続'; inp.value = kw; val.textContent = kw; };
        log.textContent = '入力欄に打つ → 親の keyword が変わる。親のボタン → 入力欄が変わる。';
        return h('div', { style: { display: 'grid', gap: '10px' } }, stage, h('div', { class: 'vw-act' }, load), log);
      });
  }


  /* ============ v-model 強化：正体 / 入力部品カタログ / 落とし穴 ============ */
  style('vc4', `
  .vm-line{display:flex;flex-wrap:wrap;gap:6px;align-items:center;font:700 .95rem var(--mono);padding:10px 14px;border-radius:10px;background:var(--code);border:1px solid var(--line)}
  .vm-tk{padding:.15em .55em;border-radius:7px;border:2px solid transparent;transition:.3s}
  .vm-tk.dn{color:var(--ts);background:color-mix(in srgb,var(--ts) 16%,transparent);border-color:color-mix(in srgb,var(--ts) 50%,transparent)}
  .vm-tk.up{color:var(--team);background:color-mix(in srgb,var(--team) 16%,transparent);border-color:color-mix(in srgb,var(--team) 50%,transparent)}
  .vm-tk.vm{color:var(--vue);background:color-mix(in srgb,var(--vue) 16%,transparent);border-color:color-mix(in srgb,var(--vue) 55%,transparent)}
  .vm-tk.glow{box-shadow:0 0 0 3px var(--vue);transform:scale(1.05)}
  .vm-ex{overflow:hidden;transition:max-height .5s,opacity .5s;display:grid;gap:6px}
  .vm-pipe{display:grid;grid-template-columns:1fr auto 1fr;gap:12px;align-items:center}
  @media(max-width:800px){.vm-pipe{grid-template-columns:1fr}}
  .vm-wire{display:grid;gap:4px;justify-items:center;font:800 .75rem var(--mono)}
  .vm-wire i{font-style:normal;font-size:1.6rem;line-height:1;transition:.3s}
  .vm-wire .a{color:var(--ts)}.vm-wire .b{color:var(--team)}.vm-wire .off{opacity:.15}
  .vm-val{background:#fff;color:#223;border-radius:10px;padding:10px 14px;text-align:center;font-weight:900;font-size:1.15rem;min-height:1.6em;transition:.3s}
  .vm-val.flash{animation:vmf .6s}
  @keyframes vmf{40%{box-shadow:0 0 0 4px var(--vue);transform:scale(1.04)}}
  .vm-ui{display:flex;gap:10px;align-items:center;justify-content:center;flex-wrap:wrap;padding:14px;border-radius:10px;background:#fff;color:#223;min-height:3em}
  .vm-ui input{padding:.4em .7em;border-radius:8px;border:1px solid #99a;font:inherit}
  .vm-sw{border:0;border-radius:999px;padding:.4em 1.1em;font:900 .9rem var(--font);background:#aab;color:#fff;transition:.3s;cursor:pointer}.vm-sw.on{background:#2fd4a4}
  .vm-st{font-size:1.7rem;cursor:pointer;color:#f5a623;user-select:none}
  .vm-num{font:900 1.3rem var(--font);min-width:2ch;text-align:center}
  .vm-bt{border:0;border-radius:8px;background:#2f7bff;color:#fff;font:900 1.1rem var(--font);width:2.2em;height:2.2em;cursor:pointer}
  .vm-warn{font:700 .8rem var(--mono);padding:.5em .8em;border-radius:8px;background:color-mix(in srgb,var(--bad) 14%,var(--card));border:1px solid var(--bad);color:var(--bad)}
  .vm-good{font:700 .8rem var(--mono);padding:.5em .8em;border-radius:8px;background:color-mix(in srgb,var(--ok) 14%,var(--card));border:1px solid var(--ok);color:var(--ok)}
  `);

  /* ---- v-model の正体：1本の管 ⇄ 2本の管（図だけで見せる） ---- */
  style('vc5', `
  .vt{display:grid;grid-template-columns:minmax(0,1fr) minmax(180px,1.1fr) minmax(0,1fr);gap:0;align-items:center}
  @media(max-width:800px){.vt{grid-template-columns:1fr;gap:12px}}
  .vt-node{border-radius:14px;padding:14px;display:grid;gap:8px;border:3px solid;background:var(--card);min-width:0}
  .vt-node.p{border-color:var(--ts)}.vt-node.c{border-color:var(--vue)}
  .vt-node>b{font-size:.95rem}
  .vt-pipes{display:grid;gap:12px;padding:0 4px;position:relative}
  .vt-tube{position:relative;height:34px;border-radius:999px;display:flex;align-items:center;justify-content:center;font:800 .72rem var(--mono);color:#fff;transition:opacity .4s,transform .4s,height .4s;overflow:hidden;cursor:default}
  .vt-tube.dn{background:var(--ts)}.vt-tube.up{background:#e8912d}.vt-tube.one{background:var(--vue);height:44px}
  .vt-tube.hide{opacity:0;height:0;transform:scaleY(.2);pointer-events:none;margin:-6px 0}
  .vt-tube .ar{position:absolute;font-size:1.1rem;opacity:.85}
  .vt-tube.dn .ar{right:10px}.vt-tube.up .ar{left:10px}.vt-tube.one .ar{right:10px}
  .vt-tube.one .al{position:absolute;left:10px;font-size:1.1rem;opacity:.85}
  .vt-dot{position:absolute;top:50%;transform:translateY(-50%);background:#fff;color:#223;border-radius:999px;padding:.05em .7em;font:900 .75rem var(--font);box-shadow:0 2px 8px rgba(0,0,0,.4);pointer-events:none}
  .vt-tube.glow{box-shadow:0 0 0 4px #fff8}
  .vt-code{display:flex;flex-wrap:wrap;gap:6px;align-items:center;font:700 1rem var(--mono);padding:12px 16px;border-radius:12px;background:var(--code);border:1px solid var(--line)}
  .vt-code .tk{padding:.12em .55em;border-radius:7px;border:2px solid transparent;transition:.3s;cursor:default}
  .vt-code .tk.one{color:var(--vue);border-color:var(--vue);background:color-mix(in srgb,var(--vue) 16%,transparent)}
  .vt-code .tk.dn{color:#7fb0ff;border-color:var(--ts);background:color-mix(in srgb,var(--ts) 16%,transparent)}
  .vt-code .tk.up{color:#ffb866;border-color:#e8912d;background:color-mix(in srgb,#e8912d 16%,transparent)}
  .vt-code .tk.glow{transform:scale(1.06);box-shadow:0 0 0 3px #fff6}
  .vt-code .tk.hide{display:none}
  `);
  function modelDesugar() {
    let open = false, val = '';
    const flow = async (tube, dir, text) => {
      tube.classList.add('glow');
      const d = h('span', { class: 'vt-dot' }, text); tube.append(d);
      const W = tube.clientWidth, dw = 70;
      const from = dir > 0 ? 6 : W - dw - 6, to = dir > 0 ? W - dw - 6 : 6;
      if (d.animate) { try { await d.animate([{ left: from + 'px', opacity: 0 }, { left: from + 'px', opacity: 1, offset: .1 }, { left: to + 'px', opacity: 1, offset: .9 }, { left: to + 'px', opacity: 0 }], { duration: 900, easing: 'ease-in-out' }).finished; } catch (e) { /* 途中で消えてもよい */ } }
      d.remove(); tube.classList.remove('glow');
    };
    const pv = h('div', { class: 'vm-val' }, '（空）');
    const inp = h('input', { placeholder: '子の入力欄', style: { padding: '.5em .8em', borderRadius: '8px', border: '1px solid #99a', width: '100%', boxSizing: 'border-box', font: 'inherit' } });
    const one = h('div', { class: 'vt-tube one' }, h('span', { class: 'al' }, '◀'), 'v-model', h('span', { class: 'ar' }, '▶'));
    const dn = h('div', { class: 'vt-tube dn hide' }, ':modelValue', h('span', { class: 'ar' }, '▶'));
    const up = h('div', { class: 'vt-tube up hide' }, h('span', { class: 'ar' }, '◀'), '@update:modelValue');
    const tkOne = h('span', { class: 'tk one' }, 'v-model="keyword"');
    const tkDn = h('span', { class: 'tk dn hide' }, ':modelValue="keyword"'), tkUp = h('span', { class: 'tk up hide' }, '@update:modelValue="keyword = $event"');
    const link = (tube, tk) => { const on = (v) => () => { tube.classList.toggle('glow', v); tk.classList.toggle('glow', v); }; [tube, tk].forEach((e) => { e.addEventListener('mouseenter', on(true)); e.addEventListener('mouseleave', on(false)); }); };
    link(dn, tkDn); link(up, tkUp); link(one, tkOne);
    const vt = h('div', { class: 'vt' },
      h('div', { class: 'vt-node p' }, h('b', '👨 親'), pv),
      h('div', { class: 'vt-pipes' }, one, dn, up),
      h('div', { class: 'vt-node c' }, h('b', '👶 子'), inp));
    const sync = () => {
      one.classList.toggle('hide', open); dn.classList.toggle('hide', !open); up.classList.toggle('hide', !open);
      tkOne.classList.toggle('hide', open); tkDn.classList.toggle('hide', !open); tkUp.classList.toggle('hide', !open);
      tog.textContent = open ? '◀ 1本にもどす' : '✂ 2本に分ける';
      code1a.textContent = '<SearchBox'; 
    };
    const tog = h('button', { class: 'btn', onclick: () => { open = !open; sync(); } });
    const code1a = h('span');
    const flash = () => { pv.classList.remove('flash'); void pv.offsetWidth; pv.classList.add('flash'); };
    inp.addEventListener('input', async () => { val = inp.value; await flow(open ? up : one, -1, val || '空'); pv.textContent = val || '（空）'; flash(); });
    const load = h('button', { class: 'btn ghost', onclick: async () => { await flow(open ? dn : one, 1, '相続'); val = '相続'; inp.value = val; pv.textContent = val; flash(); } }, '👨 → 👶 「相続」を入れる');
    sync();
    return h('div', { style: { display: 'grid', gap: '14px' } },
      h('div', { class: 'vt-code' }, h('span', '<SearchBox'), tkOne, tkDn, tkUp, h('span', '/>')),
      vt,
      h('div', { class: 'vw-act' }, tog, load));
  }

  /* ---- 入力部品カタログ：型ごとの defineModel を触って確かめる ---- */
  const PARTS = [
    { k: 'search', tab: '🔎 SearchBox', type: 'string', file: 'SearchBox.vue', ref: 'keyword', init: "''", preset: '相続', fmt: (v) => v || '（空）', show: '検索: {{ keyword }}',
      child: "<script setup lang=\"ts\">\nconst keyword = defineModel<string>({ default: '' })\n</script>\n\n<template>\n  <input v-model=\"keyword\" placeholder=\"分野で検索\" />\n</template>",
      build(set) { const i = h('input', { placeholder: '分野で検索' }); i.addEventListener('input', () => set(i.value)); return { el: h('div', { class: 'vm-ui' }, i), apply(v) { i.value = v; } }; } },
    { k: 'toggle', tab: '🔘 ToggleSwitch', type: 'boolean', file: 'ToggleSwitch.vue', ref: 'urgent', init: 'false', preset: true, fmt: (v) => (v ? '急ぎ：ON' : '急ぎ：OFF'), show: '急ぎ: {{ urgent ? "ON" : "OFF" }}',
      child: "<script setup lang=\"ts\">\nconst on = defineModel<boolean>({ default: false })\n</script>\n\n<template>\n  <button :class=\"{ on }\" @click=\"on = !on\">\n    {{ on ? 'ON' : 'OFF' }}\n  </button>\n</template>",
      build(set) { let on = false; const b = h('button', { class: 'vm-sw' }, 'OFF'); const ap = (v) => { on = v; b.classList.toggle('on', on); b.textContent = on ? 'ON' : 'OFF'; }; b.onclick = () => { ap(!on); set(on); }; return { el: h('div', { class: 'vm-ui' }, b), apply: ap }; } },
    { k: 'step', tab: '➖➕ QuantityStepper', type: 'number', file: 'QuantityStepper.vue', ref: 'people', init: '1', preset: 4, fmt: (v) => v + ' 名', show: '参加人数: {{ people }} 名',
      child: "<script setup lang=\"ts\">\nconst count = defineModel<number>({ default: 1 })\n</script>\n\n<template>\n  <button @click=\"count = Math.max(1, count - 1)\">−</button>\n  <span>{{ count }}</span>\n  <button @click=\"count++\">＋</button>\n</template>",
      build(set) { let n = 1; const num = h('span', { class: 'vm-num' }, '1'); const ap = (v) => { n = v; num.textContent = v; }; const m = h('button', { class: 'vm-bt', onclick: () => { ap(Math.max(1, n - 1)); set(n); } }, '−'), p = h('button', { class: 'vm-bt', onclick: () => { ap(n + 1); set(n); } }, '＋'); return { el: h('div', { class: 'vm-ui' }, m, num, p), apply: ap }; } },
    { k: 'stars', tab: '⭐ RatingStars', type: 'number', file: 'RatingStars.vue', ref: 'rating', init: '0', preset: 4, fmt: (v) => '★'.repeat(v) + '☆'.repeat(5 - v) + '（' + v + '）', show: '評価: {{ rating }} / 5',
      child: "<script setup lang=\"ts\">\nconst rating = defineModel<number>({ default: 0 })\n</script>\n\n<template>\n  <span v-for=\"n in 5\" :key=\"n\" @click=\"rating = n\">\n    {{ n <= rating ? '★' : '☆' }}\n  </span>\n</template>",
      build(set) { let r = 0; const st = [1, 2, 3, 4, 5].map((n) => h('span', { class: 'vm-st', onclick: () => { ap(n); set(n); } }, '☆')); const ap = (v) => { r = v; st.forEach((e, i) => (e.textContent = i < v ? '★' : '☆')); }; return { el: h('div', { class: 'vm-ui' }, ...st), apply: ap }; } },
    { k: 'multi', tab: '👥 複数の v-model', type: 'string', file: 'NameForm.vue', multi: true, ref: 'last', init: "''", preset: { last: '山田', first: '太郎' }, fmt: (v) => (v.last || '（姓）') + ' ' + (v.first || '（名）'), show: 'お名前: {{ last }} {{ first }}',
      child: "<script setup lang=\"ts\">\nconst last = defineModel<string>('last', { default: '' })\nconst first = defineModel<string>('first', { default: '' })\n</script>\n\n<template>\n  <input v-model=\"last\" placeholder=\"姓\" />\n  <input v-model=\"first\" placeholder=\"名\" />\n</template>",
      build(set) { const st = { last: '', first: '' }; const a = h('input', { placeholder: '姓' }), b = h('input', { placeholder: '名' }); a.addEventListener('input', () => { st.last = a.value; set({ ...st }); }); b.addEventListener('input', () => { st.first = b.value; set({ ...st }); }); return { el: h('div', { class: 'vm-ui' }, a, b), apply(v) { st.last = v.last; st.first = v.first; a.value = v.last; b.value = v.first; } }; } },
  ];
  const parentSrc = (p) => p.multi
    ? "<script setup lang=\"ts\">\nimport { ref } from 'vue'\nimport NameForm from './NameForm.vue'\n\nconst last = ref<string>('')\nconst first = ref<string>('')\n</script>\n\n<template>\n  <NameForm v-model:last=\"last\" v-model:first=\"first\" />\n  <p>" + p.show + "</p>\n</template>"
    : "<script setup lang=\"ts\">\nimport { ref } from 'vue'\nimport " + p.file.replace('.vue', '') + " from './" + p.file + "'\n\nconst " + p.ref + " = ref<" + p.type + ">(" + p.init + ")\n</script>\n\n<template>\n  <" + p.file.replace('.vue', '') + " v-model=\"" + p.ref + "\" />\n  <p>" + p.show + "</p>\n</template>";

  const CAPS = { search: 'string：打った文字が、そのまま親の keyword へ。', toggle: 'boolean：押すたびに true ⇄ false が入れ替わる。', step: 'number：＋ − で増減。1 未満にはならない。', stars: 'number：押した星の数が、親の rating になる。', multi: '値が2つ：v-model:last / v-model:first と名前を付ける。' };
  style('vc7', `
  .vm-cat{display:grid;gap:12px;min-width:0}
  .vm-cat .vq-stage{grid-template-columns:minmax(0,1fr) 120px minmax(0,1fr);align-items:center}
  @media(max-width:900px){.vm-cat .vq-stage{grid-template-columns:1fr}}
  .vm-capRow{display:flex;gap:12px;align-items:center;flex-wrap:wrap}.vm-capRow .vm-cap{flex:1;min-width:220px}
  .vm-catL{display:grid;gap:12px;align-content:start;min-width:0}
  .vm-catR{display:grid;gap:12px;align-content:start;min-width:0}
  .vm-cat .vq-stage{padding:16px;gap:10px}
  .vm-cat .vq-box>b{font-size:.92rem}
  .vm-cat .vm-val{font-size:1.7rem;padding:18px 14px;min-height:2em}
  .vm-cat .vm-ui{padding:22px 14px;min-height:5em;font-size:1.1rem}
  .vm-cat .vm-ui input{font-size:1.05rem;padding:.55em .9em}
  .vm-cat .vm-ui .vm-st{font-size:2.1rem}
  .vm-cat .vm-wire{gap:10px;justify-items:center;font-size:.9rem}
  .vm-cap{border-left:5px solid var(--vue);background:var(--card);border-radius:10px;padding:10px 14px;font:800 1rem/1.6 var(--font)}
  .vm-cat .vi-panel pre.code{font-size:.95rem}
  `);
  function modelCatalog() {
    let cur = 0;
    const host = h('div', { style: { display: 'grid', gap: '12px' } });
    const draw = () => {
      const p = PARTS[cur];
      let val = typeof p.preset === 'object' ? { last: '', first: '' } : (typeof p.preset === 'boolean' ? false : (typeof p.preset === 'number' ? (p.k === 'step' ? 1 : 0) : ''));
      const stage = h('div', { class: 'vq-stage' }), pv = h('div', { class: 'vm-val' }, p.fmt(val));
      const comp = p.build(async (v) => { val = v; await pulse(stage, comp.el, pv, '⬆', 'var(--team)', 450); pv.textContent = p.fmt(val); pv.classList.remove('flash'); void pv.offsetWidth; pv.classList.add('flash'); cpre.setHi(lns(p.child, ['defineModel'])); });
      const parent = h('div', { class: 'vq-box p' }, h('b', '親 ConsultForm.vue が持つ値'), pv), child = h('div', { class: 'vq-box c' }, h('b', '子 ' + p.file + '（' + (p.multi ? 'defineModel を2つ' : 'defineModel<' + p.type + '>') + '）'), comp.el);
      stage.append(parent, h('div', { class: 'vm-wire' }, h('span', { class: 'a' }, '⬇ 値'), h('span', { class: 'b' }, '⬆ 変更')), child);
      const cpre = code(p.child, 'vue', { color: C, file: p.file, dim: true }), ppre = code(parentSrc(p), 'vue', { color: 'var(--ts)', file: 'ConsultForm.vue', dim: true });
      cpre.setHi(lns(p.child, ['defineModel'])); ppre.setHi(lns(parentSrc(p), ['v-model']));
      const load = h('button', { class: 'btn', onclick: async () => { await pulse(stage, pv, comp.el, '⬇', 'var(--ts)', 500); val = p.preset; comp.apply(val); pv.textContent = p.fmt(val); pv.classList.remove('flash'); void pv.offsetWidth; pv.classList.add('flash'); } }, '👨 親から値を入れる');
      host.replaceChildren(h('div', { class: 'vm-cat' }, stage, h('div', { class: 'vm-capRow' }, h('div', { class: 'vm-cap' }, CAPS[p.k]), load), h('div', { class: 'vi-eq' }, h('div', { class: 'vi-panel' }, h('div', { class: 'vi-lb' }, '👨 親（使う側）'), ppre), h('div', { class: 'vi-panel' }, h('div', { class: 'vi-lb' }, '👶 子（部品）'), cpre))));
    };
    let chips = [];
    const tabEl = tab(PARTS.map((p) => p.tab), 0, (i) => { cur = i; draw(); chips.forEach((c, j) => c.classList.toggle('off', j !== i)); });
    chips = [...tabEl.children];
    draw();
    return h('div', { style: { display: 'grid', gap: '12px' } }, tabEl, host);
  }

  /* ---- 落とし穴：✖ と ✓ を触って比べる ---- */
  const PIT = [
    { tab: '① props を書き換える', bad: "<script setup lang=\"ts\">\nconst props = defineProps<{ modelValue: string }>()\n\n// ✖ 子で props を書き換えても、親には届かない\nfunction change(v: string): void {\n  props.modelValue = v\n}\n</script>", good: "<script setup lang=\"ts\">\n// ✓ defineModel なら、書き換えが親へ届く\nconst model = defineModel<string>()\n</script>",
      hb:['props.modelValue = v'], hg:['defineModel'], badMsg: '⚠ Vue warn: Attempting to mutate prop "modelValue". Props are readonly.', badNote: '親の値は変わらない（props は読み取り専用）', goodNote: '親の値も変わった' },
    { tab: '② emit を忘れる', bad: "<template>\n  <!-- ✖ :value だけ。入力しても親に知らせていない -->\n  <input :value=\"modelValue\" />\n</template>", good: "<template>\n  <!-- ✓ @input で update:modelValue を emit -->\n  <input\n    :value=\"modelValue\"\n    @input=\"emit('update:modelValue', $event.target.value)\"\n  />\n</template>",
      hb:[':value="modelValue"'], hg:['@input','update:modelValue'], badMsg: '入力しても、すぐ元に戻る（親の値が変わらないから）', badNote: '入力欄が元に戻る', goodNote: '親の値が変わり、入力もそのまま' },
    { tab: '③ 型がちがう', bad: "<!-- 子：defineModel<number>() -->\n<script setup lang=\"ts\">\nimport { ref } from 'vue'\n\nconst people = ref<string>('')   // ✖ string を渡している\n</script>\n\n<template>\n  <QuantityStepper v-model=\"people\" />\n</template>", good: "<script setup lang=\"ts\">\nimport { ref } from 'vue'\n\nconst people = ref<number>(1)   // ✓ 子と同じ number\n</script>\n\n<template>\n  <QuantityStepper v-model=\"people\" />\n</template>",
      hb:['ref<string>'], hg:['ref<number>'], badMsg: "🔴 Type 'Ref<string>' is not assignable to type 'number'.", badNote: 'エディタが赤線で教えてくれる（実行前に気づける）', goodNote: '型が合っていて、赤線なし' },
  ];
  function modelPitfalls() {
    let cur = 0, good = false;
    const host = h('div', { style: { display: 'grid', gap: '12px' } });
    const draw = () => {
      const p = PIT[cur], stage = h('div', { class: 'vq-stage' }), pv = h('div', { class: 'vm-val' }, '（空）'), msg = h('div', { class: good ? 'vm-good' : 'vm-warn' }, good ? '✓ ' + p.goodNote : '✖ ' + p.badNote);
      let val = '';
      const inp = h('input', { class: 'vq-in', placeholder: '子の入力欄に打ってみよう' });
      inp.addEventListener('input', async () => {
        const v = inp.value;
        if (good) { await pulse(stage, inp, pv, '⬆', 'var(--team)', 400); val = v; pv.textContent = v || '（空）'; pv.classList.remove('flash'); void pv.offsetWidth; pv.classList.add('flash'); msg.textContent = '✓ ' + p.goodNote; msg.className = 'vm-good'; }
        else { msg.textContent = p.badMsg; msg.className = 'vm-warn'; if (cur === 1) setTimeout(() => { inp.value = val; }, 160); else if (cur === 0) { pv.classList.remove('flash'); } }
      });
      stage.append(h('div', { class: 'vq-box p' }, h('b', '親が持つ値'), pv), h('div', { class: 'vq-box c' }, h('b', '子の入力欄'), inp), msg);
      const pre = code(good ? p.good : p.bad, 'vue', { color: good ? 'var(--ok)' : 'var(--bad)', file: good ? '✓ こう直す' : '✖ こう書くと困る', dim: true });
      pre.setHi && pre.setHi(lns(good ? p.good : p.bad, good ? p.hg : p.hb), good ? 'ok' : 'err');
      host.replaceChildren(h('div', { class: 'vi-eq', style: { alignItems: 'start' } }, stage, pre));
    };
    let chips = [], gchips = [];
    const tabEl = tab(PIT.map((p) => p.tab), 0, (i) => { cur = i; draw(); chips.forEach((c, j) => c.classList.toggle('off', j !== i)); });
    chips = [...tabEl.children];
    const gEl = tab(['✖ こう書くと困る', '✓ こう直す'], 0, (i) => { good = i === 1; draw(); gchips.forEach((c, j) => c.classList.toggle('off', j !== i)); });
    gchips = [...gEl.children];
    draw();
    return h('div', { style: { display: 'grid', gap: '12px' } }, h('div', { style: { display: 'flex', gap: '18px', flexWrap: 'wrap', alignItems: 'center' } }, tabEl, gEl), host);
  }

  /* ============ 書き方の分解（HTML の「要素・属性」と同じ形式）：部品をクリック → 意味 ＋ 対応するコード行 ============ */
  style('vc6', `
  .va{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.05fr);gap:14px;align-items:start}
  @media(max-width:980px){.va{grid-template-columns:1fr}}
  .va-l{display:grid;gap:12px;min-width:0}
  .va-row{display:grid;gap:4px}
  .va-row>small{font:900 .72rem var(--font);color:var(--mute)}
  .va-line{display:flex;flex-wrap:wrap;align-items:center;padding:14px 16px;border-radius:12px;background:var(--code);border:1px solid var(--line);font:700 1.02rem/2.1 var(--mono);white-space:pre-wrap}
  .va-tk{padding:.05em .1em;border-radius:7px;border:2px solid transparent;opacity:.45;cursor:pointer;transition:.2s}
  .va-tk.on{opacity:1;color:var(--c);border-color:var(--c);background:color-mix(in srgb,var(--c) 18%,transparent);box-shadow:0 0 0 3px color-mix(in srgb,var(--c) 28%,transparent)}
  .va-tk.plain{opacity:.6;cursor:default}
  .va-chips{display:flex;flex-wrap:wrap;gap:8px}
  .va-chip{padding:.35em .9em;border-radius:9px;border:2px solid var(--c);color:var(--c);font:800 .82rem var(--font);cursor:pointer;background:transparent;transition:.2s}
  .va-chip.on{background:var(--c);color:#06101f}
  .va-info{border-left:5px solid var(--c);background:var(--card);border-radius:10px;padding:12px 14px;display:grid;gap:8px;min-height:70px}
  .va-info>b{color:var(--c);font-size:.98rem}.va-info>span{font-weight:700}
  .va-info pre.code{margin:0}
  .va-r{min-width:0}
  `);
  function anatomy(spec) {
    let cur = Object.keys(spec.parts)[0];
    const lines = [], chips = [], info = h('div', { class: 'va-info' }), right = h('div', { class: 'va-r' });
    const rows = spec.rows.map((r) => h('div', { class: 'va-row' }, h('small', r.label), h('div', { class: 'va-line' }, ...r.tokens.map((t) => {
      const el = h('span', { class: 'va-tk' + (t.p ? '' : ' plain') }, t.s);
      if (t.p) { lines.push([el, t.p]); el.onmouseenter = () => set(t.p); el.onclick = () => set(t.p); }
      return el;
    }))));
    const set = (k) => {
      cur = k; const p = spec.parts[k];
      lines.forEach(([el, kk]) => { const on = kk === k; el.classList.toggle('on', on); if (on) el.style.setProperty('--c', p.color); });
      chips.forEach(([el, kk]) => el.classList.toggle('on', kk === k));
      info.style.setProperty('--c', p.color);
      info.replaceChildren(h('b', p.name), h('span', p.line), p.expand ? code(p.expand, 'vue', { color: p.color, file: p.xl || '展開すると', dim: true }) : null);
      const f = spec.files[p.f]; const pre = code(f.src, 'vue', { color: p.f ? C : 'var(--ts)', file: f.file, dim: true });
      pre.setHi && pre.setHi(lns(f.src, p.hi)); right.replaceChildren(pre);
    };
    Object.entries(spec.parts).forEach(([k, p]) => { const el = h('span', { class: 'va-chip' }, p.name.split('（')[0]); el.style.setProperty('--c', p.color); el.onclick = () => set(k); el.onmouseenter = () => set(k); chips.push([el, k]); });
    set(cur);
    return h('div', { class: 'va' }, h('div', { class: 'va-l' }, ...rows, h('div', { class: 'va-chips' }, ...chips.map((c) => c[0])), info), right);
  }
  const TS = 'var(--ts)', TM = 'var(--team)', VU = 'var(--vue)', PK = 'var(--pink)', VI = 'var(--violet)', OK = 'var(--ok)';
  const CASE_P = "<script setup lang=\"ts\">\nimport { ref } from 'vue'\nimport CaseCard from './CaseCard.vue'\nimport type { Case } from '@/types/case'\n\nconst cases = ref<Case[]>([\n  { id: 1, title: '離婚の相談', done: false },\n])\n\nfunction toggle(id: number): void {\n  const c = cases.value.find((x) => x.id === id)\n  if (c) c.done = !c.done\n}\n</script>\n\n<template>\n  <CaseCard\n    v-for=\"c in cases\"\n    :key=\"c.id\"\n    :item=\"c\"\n    @toggle=\"toggle\"\n  />\n</template>";
  const CASE_C = "<script setup lang=\"ts\">\nimport type { Case } from '@/types/case'\n\ndefineProps<{ item: Case }>()\nconst emit = defineEmits<{ toggle: [id: number] }>()\n</script>\n\n<template>\n  <h3>{{ item.title }}</h3>\n  <button @click=\"emit('toggle', item.id)\">\n    完了にする\n  </button>\n</template>";
  const CASE_TYPE = "interface Case {\n  id: number\n  title: string\n  done: boolean\n}";
  const T1 = (s, p) => ({ s, p });
  const propsAnatomy = () => anatomy({
    files: [{ file: 'CaseList.vue（親）', src: CASE_P }, { file: 'CaseCard.vue（子）', src: CASE_C }],
    rows: [
      { label: '👨 親：渡す側', tokens: [T1('<CaseCard', 'comp'), T1(' '), T1(':', 'colon'), T1('item', 'name'), T1('='), T1('"c"', 'val'), T1(' />', 'comp')] },
      { label: '👶 子：受け取る側', tokens: [T1('defineProps', 'dp'), T1('<{ '), T1('item', 'name'), T1(': '), T1('Case', 'type'), T1(' }>()')] },
    ],
    parts: {
      comp: { name: '部品名（CaseCard）', color: TS, line: 'import した子を、HTML のタグのように置く', f: 0, hi: ['import CaseCard', '<CaseCard'] },
      colon: { name: ':（コロン）', color: TM, line: '「文字」ではなく「変数」を渡す印', f: 0, hi: [':item="c"'], expand: 'item="c"    // 文字列 "c" そのもの\n:item="c"   // 変数 c の中身', xl: '有り・無しの違い' },
      name: { name: 'props 名（item）', color: PK, line: '親と子で、同じ綴り。子では item.title のように使える', f: 1, hi: ['defineProps', 'item.title'] },
      val: { name: '値（"c"）', color: VI, line: '親が持つデータ。v-for の c が、そのまま子へ流れる', f: 0, hi: ['v-for', ':item="c"'] },
      dp: { name: 'defineProps', color: VU, line: 'import 不要。「受け取る口」を宣言するマクロ', f: 1, hi: ['defineProps'] },
      type: { name: '型（Case）', color: OK, line: '渡す値の形。ちがう形を渡すと、実行前に赤線', f: 1, hi: ['defineProps', "import type { Case }"], expand: CASE_TYPE, xl: 'types/case.ts' },
    },
  });
  const emitAnatomy = () => anatomy({
    files: [{ file: 'CaseList.vue（親）', src: CASE_P }, { file: 'CaseCard.vue（子）', src: CASE_C }],
    rows: [
      { label: '👨 親：受け取る側', tokens: [T1('<CaseCard', 'comp'), T1(' '), T1('@', 'at'), T1('toggle', 'ev'), T1('='), T1('"toggle"', 'fn'), T1(' />', 'comp')] },
      { label: '👶 子：宣言する', tokens: [T1('const emit', 'emit'), T1(' = '), T1('defineEmits', 'de'), T1('<{ '), T1('toggle', 'ev'), T1(': ['), T1('id: number', 'pl'), T1('] }>()')] },
      { label: '👶 子：知らせる', tokens: [T1('emit', 'emit'), T1('('), T1("'toggle'", 'ev'), T1(', '), T1('item.id', 'pl'), T1(')')] },
    ],
    parts: {
      comp: { name: '部品名（CaseCard）', color: TS, line: '知らせを受け取る側。親が子のタグを置く場所', f: 0, hi: ['<CaseCard'] },
      at: { name: '@（v-on）', color: TM, line: '「〜が起きたら」の印。@click と同じ仲間', f: 0, hi: ['@toggle'], expand: '@toggle="toggle"\n// = v-on:toggle="toggle"', xl: '省略しない形' },
      ev: { name: 'イベント名（toggle）', color: PK, line: '子が叫ぶ名前。親の @ の後ろと同じ綴り。動詞で付ける', f: 1, hi: ['defineEmits', "emit('toggle'"] },
      fn: { name: '親の関数（"toggle"）', color: VI, line: 'イベントが届いたら動く。データを書き換えるのは親', f: 0, hi: ['@toggle', 'function toggle', 'c.done'] },
      de: { name: 'defineEmits', color: VU, line: 'import 不要。「知らせる種類」を宣言するマクロ', f: 1, hi: ['defineEmits'] },
      pl: { name: '渡す値（id）', color: OK, line: '一緒に運ぶ値と型。親の関数の引数になる', f: 1, hi: ['defineEmits', "emit('toggle'"], expand: 'function toggle(id: number): void {\n  …\n}', xl: '親が受け取る側' },
      emit: { name: 'emit（呼び出し）', color: TS, line: '押された瞬間に呼ぶ。知らせるだけで、書き換えない', f: 1, hi: ["emit('toggle'", 'const emit'] },
    },
  });
  const SB_P = "<script setup lang=\"ts\">\nimport { ref } from 'vue'\nimport SearchBox from './SearchBox.vue'\n\nconst keyword = ref<string>('')\n</script>\n\n<template>\n  <SearchBox v-model=\"keyword\" />\n  <p>検索ワード：{{ keyword }}</p>\n</template>";
  const SB_C = "<script setup lang=\"ts\">\nconst model = defineModel<string>()\n</script>\n\n<template>\n  <input v-model=\"model\" placeholder=\"分野で検索\" />\n</template>";
  const modelAnatomy = () => anatomy({
    files: [{ file: 'SearchPage.vue（親）', src: SB_P }, { file: 'SearchBox.vue（子）', src: SB_C }],
    rows: [
      { label: '👨 親：使う側', tokens: [T1('<SearchBox', 'comp'), T1(' '), T1('v-model', 'vm'), T1('='), T1('"keyword"', 'val'), T1(' />', 'comp')] },
      { label: '👶 子：defineModel', tokens: [T1('const model', 'mv'), T1(' = '), T1('defineModel', 'dm'), T1('<string>', 'type'), T1('()', 'dm')] },
      { label: '👶 子：入力欄につなぐ', tokens: [T1('<input '), T1('v-model', 'vm2'), T1('='), T1('"model"', 'mv'), T1(' />')] },
    ],
    parts: {
      comp: { name: '部品名（SearchBox）', color: TS, line: 'import した子を、タグのように置く', f: 0, hi: ['import SearchBox', '<SearchBox'] },
      vm: { name: 'v-model（親）', color: VU, line: '「親 ⇄ 子」を1行でつなぐ印。裏では2本の管に分かれる', f: 0, hi: ['<SearchBox'], expand: ':modelValue="keyword"\n@update:modelValue="keyword = $event"', xl: '展開すると（2本の管）' },
      val: { name: '値（keyword）', color: VI, line: '親が持つ ref。子の入力は、ここへ書き込まれる', f: 0, hi: ['const keyword', '<SearchBox'] },
      dm: { name: 'defineModel', color: TM, line: 'import 不要。親の v-model を受ける「口」を作るマクロ', f: 1, hi: ['defineModel'], expand: "defineProps<{ modelValue: string }>()\ndefineEmits<{ 'update:modelValue': [string] }>()", xl: '長い書き方（これと同じ）' },
      type: { name: '型（<string>）', color: OK, line: '親の ref<string> と同じ型にする。ちがうと赤線', f: 1, hi: ['defineModel'] },
      mv: { name: '変数（model）', color: PK, line: 'ref のように読み書きできる変数。書き換えると、親にも届く', f: 1, hi: ['const model', 'v-model="model"'] },
      vm2: { name: 'v-model（子）', color: VU, line: '入力欄と model をつなぐ。打つ → model が変わる → 親も変わる', f: 1, hi: ['v-model="model"'] },
    },
  });

  const first = { t: 'コンポーネントって？', tag: 'COMPONENT', lead: '同じ形を何回も使うなら、<b>1つの部品</b>にまとめる。<b>なし</b>と<b>あり</b>で、直す場所の数を比べよう。', render(el) { el.append(whyComponent()); } };
  L.scenes = [first,
    { t: 'props：どんな困りごと？', tag: 'props ⬇', lead: 'まず<b>困りごと</b>、次に<b>解決</b>。ボタンを押して、props がなぜ必要か見よう。', render(el) { el.append(propsWhy()); } },
    { t: 'props の書き方', tag: 'props ⬇', lead: '<b>部品をクリック</b>。親と子の対応する場所が光る。', render(el) { el.append(propsAnatomy()); } },
    rebuild('props：親から子へ', 'props ⬇', '<b>親</b>のデータを、<b>子</b>が受け取る。2つのファイルと、間を流れるデータを見よう。', propsScene),
    { t: 'emit：どんな困りごと？', tag: 'emit ⬆', lead: 'まず<b>困りごと</b>、次に<b>解決</b>。🗑 を押して、emit がなぜ必要か見よう。', render(el) { el.append(emitWhy()); } },
    { t: 'emit の書き方', tag: 'emit ⬆', lead: '<b>部品をクリック</b>。親と子の対応する場所が光る。', render(el) { el.append(emitAnatomy()); } },
    rebuild('emit：子から親へ', 'emit ⬆', '子は<b>知らせる</b>だけ。書き換えるのは<b>親</b>。ボタンを押して、流れを追おう。', emitScene),
    { t: 'v-model：どんな困りごと？', tag: 'v-model ⇅', lead: 'まず<b>困りごと</b>、次に<b>解決</b>。入力して、v-model がなぜ必要か見よう。', render(el) { el.append(modelWhy()); } },
    { t: 'v-model の正体：2本の管', tag: 'v-model ⇅', lead: '<b>1本</b>を<b>2本</b>に分けて、動かそう。', render(el) { el.append(modelDesugar()); } },
    { t: 'v-model の書き方', tag: 'v-model ⇅', lead: '<b>部品をクリック</b>。親と子の対応する場所が光る。', render(el) { el.append(modelAnatomy()); } },
    rebuild('v-model を部品に', 'v-model ⇅', '空の <b>SearchBox</b> に、1行ずつ足して<b>親とつなぐ</b>。', modelScene),
    { t: '入力部品カタログ', tag: 'defineModel', lead: '<b>型</b>がちがえば部品もちがう。5つを触って、親の値がどう動くか見よう。', render(el) { el.append(modelCatalog()); } },
    { t: 'v-model のつまずき', tag: '落とし穴', lead: '<b>✖</b> と <b>✓</b> を切り替えて、入力欄に打ってみよう。何が困るか、体で分かる。', render(el) { el.append(modelPitfalls()); } },
  ].concat(L.scenes.filter((s) => !['props：親から子へ', 'emit：子から親へ', 'v-model を部品に'].includes(s.t)));
})();
