/* vue-comp「使い分け：どう渡す？」を、部品ツリー＋データが走るアニメ＋実コードの形に差し替える */
(function () {
  'use strict';
  const K = window.KENSHU;
  const TITLE = '使い分け：どう渡す？';
  let tries = 0;
  (function wait() {
    const L = K && K.lessons && K.lessons['vue-comp'];
    if (L && K.W && L.scenes.some((s) => s.t === TITLE)) return init(L);
    if (++tries < 300) setTimeout(wait, 50);
  })();

  function init(L) {
    const { h, code, style } = K.W;
    const NS = 'http://www.w3.org/2000/svg';
    const TS = 'var(--ts)', TEAM = 'var(--team)', VUE = 'var(--vue)';
    const OPT = {
      p: ['props ⬇', TS, '親 → 子'],
      e: ['emit ⬆', TEAM, '子 → 親'],
      m: ['v-model ⇅', VUE, '両方向'],
      l: ['親に持ち上げ', 'var(--violet)', '兄弟どうし'],
      i: ['provide / inject', 'var(--pink)', '遠い子孫'],
    };
    const chip = (r, k, v) => { const b = h('b', v); r[k] = b; return h('span', { class: 'vzA-st', 'data-k': 'state' }, k + ' = ', b); };

    /* ---------- 5つの場面 ---------- */
    const SC = [
      {
        short: '親 → 子', who: 'CaseListPage → CaseCard', t: '案件名を、案件カードに表示したい', ans: 'p', hgt: 330,
        nodes: [
          { id: 'page', name: 'CaseListPage', root: 1, x: 50, y: 6, w: 70, body: (r) => h('div', { class: 'vzA-sts' }, chip(r, 'title', '"相続の相談"')) },
          { id: 'card', name: 'CaseCard', x: 50, y: 190, w: 70, body: (r) => h('div', { class: 'vzA-card' }, h('span', { class: 'av' }, '📁'), r.slot = h('b', { class: 'slot', 'data-k': 'slot' }), h('span', { class: 'bd' }, '相談中')) },
        ],
        edges: [['page', 'card']], focus: ['page', 'card'],
        init: (r) => { r.slot.textContent = '（まだ表示されない）'; r.slot.classList.add('empty'); },
        done: (r) => { r.slot.textContent = '相続の相談'; r.slot.classList.remove('empty'); },
        run: async (c) => { await c.fly([c.pos('page'), c.pos('card')], 'title', TS); c.bump(c.r.slot); c.done(); },
        data: 'title ＝ "相続の相談"', why: '親が持つ値を、子は見せるだけ。一方通行。',
        ng: { e: '向きが逆。子は値をもらって見せる側。', m: '子が書き換える必要はない。大げさ。', l: '兄弟の話ではない。親から子へ渡せば足りる。', i: '隣の子に渡すだけ。provide は遠い子孫向け。' },
        fill: ':title="title"', file: 'CaseListPage.vue',
        par: "<script setup lang=\"ts\">\nimport { ref } from 'vue'\nimport CaseCard from './CaseCard.vue'\n\nconst title = ref<string>('相続の相談')\n</script>\n\n<template>\n  <CaseCard ◆ />\n</template>", pHi: 9,
        cfile: 'CaseCard.vue', child: "<script setup lang=\"ts\">\nconst props = defineProps<{ title: string }>()\n</script>\n\n<template>\n  <b>{{ props.title }}</b>\n</template>", cHi: 2,
      },
      {
        short: '子 → 親', who: 'CaseCard → CaseListPage', t: '削除ボタンが押されたと、一覧に知らせたい', ans: 'e', hgt: 330,
        nodes: [
          { id: 'page', name: 'CaseListPage', root: 1, x: 50, y: 6, w: 70, body: (r) => h('div', { class: 'vzA-sts' }, chip(r, 'cases', '3件')) },
          { id: 'card', name: 'CaseCard', x: 50, y: 190, w: 70, body: (r) => h('div', { class: 'vzA-card' }, r.row = h('b', { class: 'slot', 'data-k': 'slot' }, '契約書'), r.btn = h('button', { class: 'vzA-btn', 'data-k': 'btn' }, '削除')) },
        ],
        edges: [['page', 'card']], focus: ['page', 'card'],
        init: (r) => { r.cases.textContent = '3件'; r.row.classList.remove('gone'); },
        done: (r) => { r.cases.textContent = '2件'; r.row.classList.add('gone'); },
        run: async (c) => { c.bump(c.r.btn); await c.fly([c.pos('card', 'btn'), c.pos('page')], "emit('remove')", TEAM); c.done(); c.bump(c.r.cases); },
        data: "emit('remove', '契約書')", why: '消すかどうか決めるのは親。子は「押された」と知らせる。',
        ng: { p: '向きが逆。⬇は親から子。今回は子から親へ。', m: '値を共有したいのではない。知らせるだけ。', l: '状態はもう親にある。持ち上げは不要。', i: '隣の親子に provide は大げさ。' },
        fill: '@remove="remove"', file: 'CaseListPage.vue',
        par: "<script setup lang=\"ts\">\nimport { ref } from 'vue'\nimport CaseCard from './CaseCard.vue'\n\nconst cases = ref<string[]>(['相続', '離婚', '契約書'])\nconst remove = (name: string) => {\n  cases.value = cases.value.filter((c) => c !== name)\n}\n</script>\n\n<template>\n  <CaseCard v-for=\"c in cases\" :key=\"c\" :title=\"c\" ◆ />\n</template>", pHi: 12,
        cfile: 'CaseCard.vue', child: "<script setup lang=\"ts\">\nconst props = defineProps<{ title: string }>()\nconst emit = defineEmits<{ remove: [name: string] }>()\n</script>\n\n<template>\n  <button @click=\"emit('remove', props.title)\">削除</button>\n</template>", cHi: 7, cHi2: 3,
      },
      {
        short: '入力欄を共有', who: 'CaseListPage ⇅ NameInput', t: '入力欄の値を、親とも共有したい', ans: 'm', hgt: 330,
        nodes: [
          { id: 'page', name: 'CaseListPage', root: 1, x: 50, y: 6, w: 70, body: (r) => h('div', { class: 'vzA-sts' }, chip(r, 'name', '""')) },
          { id: 'inp', name: 'NameInput', x: 50, y: 190, w: 70, body: (r) => h('div', { class: 'vzA-card' }, h('small', null, '氏名'), r.inp = h('span', { class: 'vzA-inp', 'data-k': 'field' })) },
        ],
        edges: [['page', 'inp']], focus: ['page', 'inp'],
        init: (r) => { r.name.textContent = '""'; r.inp.textContent = '氏名を入力'; r.inp.classList.remove('on'); },
        done: (r) => { r.name.textContent = '"山田 太郎"'; r.inp.textContent = '山田 太郎'; r.inp.classList.add('on'); },
        run: async (c) => {
          c.r.inp.textContent = '山田 太郎'; c.r.inp.classList.add('on'); c.bump(c.r.inp);
          await c.fly([c.pos('inp'), c.pos('page')], 'update', TEAM); c.r.name.textContent = '"山田 太郎"'; c.bump(c.r.name);
          if (!c.alive()) return;
          await c.fly([c.pos('page'), c.pos('inp')], 'name', TS); c.bump(c.r.inp);
        },
        data: 'name ＝ "山田 太郎"', why: '子が書き換え、親も使う。両方向だから v-model。',
        ng: { p: '⬇だけでは、入力した値が親に戻らない。', e: '⬆だけでは、親の値が入力欄に届かない。', l: '親子の間なので、持ち上げなくても v-model で足りる。', i: '隣の親子に provide は大げさ。' },
        fill: 'v-model="name"', file: 'CaseListPage.vue',
        par: "<script setup lang=\"ts\">\nimport { ref } from 'vue'\nimport NameInput from './NameInput.vue'\n\nconst name = ref<string>('')\n</script>\n\n<template>\n  <NameInput ◆ />\n</template>", pHi: 9,
        cfile: 'NameInput.vue', child: "<script setup lang=\"ts\">\nconst name = defineModel<string>({ required: true })\n</script>\n\n<template>\n  <input v-model=\"name\" placeholder=\"氏名を入力\" />\n</template>", cHi: 2,
      },
      {
        short: '兄弟どうし', who: 'FilterPanel ⇢ ResultList', t: '絞り込みの結果を、隣の一覧に反映したい', ans: 'l', hgt: 470,
        nodes: [
          { id: 'page', name: 'CaseListPage', root: 1, x: 50, y: 6, w: 62, body: (r) => h('div', { class: 'vzA-sts' }, chip(r, 'field', '"すべて"')) },
          { id: 'flt', name: 'FilterPanel', x: 25, y: 235, w: 46, body: (r) => h('div', { class: 'vzA-card col' }, ...['すべて', '相続', '離婚'].map((t) => { const b = h('span', { class: 'vzA-tab', 'data-k': 'tab' }, t); (r.tabs = r.tabs || {})[t] = b; return b; })) },
          { id: 'lst', name: 'ResultList', x: 75, y: 235, w: 46, body: (r) => h('div', { class: 'vzA-card col' }, ...[['山田 太郎', '相続'], ['佐藤 花子', '離婚'], ['鈴木 一郎', '相続']].map(([n, f]) => { const d = h('span', { class: 'vzA-row', 'data-k': 'row' }, '👨‍⚖️ ' + n, h('small', null, f)); (r.rows = r.rows || []).push([d, f]); return d; })) },
        ],
        edges: [['page', 'flt'], ['page', 'lst']], focus: ['flt', 'lst'], hot: ['page-flt', 'page-lst'],
        init: (r) => { r.field.textContent = '"すべて"'; Object.entries(r.tabs).forEach(([k, b]) => b.classList.toggle('on', k === 'すべて')); r.rows.forEach(([d]) => d.classList.remove('dim')); },
        done: (r) => { r.field.textContent = '"相続"'; Object.entries(r.tabs).forEach(([k, b]) => b.classList.toggle('on', k === '相続')); r.rows.forEach(([d, f]) => d.classList.toggle('dim', f !== '相続')); },
        run: async (c) => {
          c.r.tabs['すべて'].classList.remove('on'); c.r.tabs['相続'].classList.add('on'); c.bump(c.r.tabs['相続']);
          await c.fly([c.pos('flt'), c.pos('page')], 'field', TEAM); c.r.field.textContent = '"相続"'; c.bump(c.r.field);
          if (!c.alive()) return;
          await c.fly([c.pos('page'), c.pos('lst')], 'field', TS); c.done(); c.bump(c.pos.el('lst'));
        },
        wrong: async (c) => { await c.block(c.pos('flt', 'r'), c.pos('lst', 'l'), 'field'); },
        data: 'field ＝ "相続"', why: '兄弟どうしは直接つながらない。親が持てば、両方に届く。',
        ng: { p: 'props は親から子。横（兄弟）へは渡せない。', e: 'emit は親まで。兄弟には届かない。', m: 'v-model は親子の1対1。兄弟はつながっていない。', i: '2部品だけなら大げさ。親に置けば足りる。' },
        fill: "ref<string>('すべて')", file: 'CaseListPage.vue',
        par: "<script setup lang=\"ts\">\nimport { ref } from 'vue'\nimport FilterPanel from './FilterPanel.vue'\nimport ResultList from './ResultList.vue'\n\nconst field = ◆\n</script>\n\n<template>\n  <FilterPanel v-model=\"field\" />\n  <ResultList :field=\"field\" />\n</template>", pHi: 6, pHi2: [10, 11],
        cfile: 'ResultList.vue', child: "<script setup lang=\"ts\">\nconst props = defineProps<{ field: string }>()\n</script>\n\n<template>\n  <p>分野：{{ props.field }}</p>\n</template>", cHi: 2,
      },
      {
        short: '遠い子孫', who: 'AppShell ⇢ UserBadge', t: 'ログイン中の人を、深い所の部品でも使いたい', ans: 'i', hgt: 500,
        nodes: [
          { id: 'root', name: 'AppShell', root: 1, x: 33, y: 6, w: 52, body: (r) => h('div', { class: 'vzA-sts' }, chip(r, 'user', '"山田 太郎"')) },
          { id: 'lay', name: 'PageLayout', x: 33, y: 140, w: 52, body: () => h('div', { class: 'vzA-card sm' }, '使わない') },
          { id: 'pg', name: 'CaseListPage', x: 33, y: 270, w: 52, body: () => h('div', { class: 'vzA-card sm' }, '使わない') },
          { id: 'bdg', name: 'UserBadge', x: 33, y: 400, w: 52, body: (r) => h('div', { class: 'vzA-card sm' }, '👤 ', r.slot = h('b', { class: 'slot', 'data-k': 'slot' })) },
        ],
        edges: [['root', 'lay'], ['lay', 'pg'], ['pg', 'bdg'], ['root', 'bdg', 'dash']], focus: ['root', 'bdg'], hot: ['root-bdg'],
        init: (r) => { r.slot.textContent = '（未表示）'; r.slot.classList.add('empty'); },
        done: (r) => { r.slot.textContent = '山田 太郎'; r.slot.classList.remove('empty'); },
        run: async (c) => { await c.fly(c.curve('root', 'bdg'), 'user', 'var(--pink)', 1500); c.done(); c.bump(c.r.slot); },
        wrong: async (c) => {
          const ids = ['root', 'lay', 'pg', 'bdg'];
          for (let i = 0; i < 3; i++) { if (!c.alive()) return; await c.fly([c.pos(ids[i]), c.pos(ids[i + 1])], 'user', 'var(--bad)', 700); c.bump(c.pos.el(ids[i + 1]), 'bad'); }
        },
        data: "provide('user', user) → inject('user')", why: '途中を飛ばして直接届く。Pinia のストアでも同じ。',
        ng: { p: '使わない部品まで毎回受け渡し。バケツリレーになる。', e: '知らせたいのではない。値を届けたい。', m: '書き換え共有ではない。読むだけ。', l: '持ち上げても、深さは変わらず結局リレー。' },
        fill: "provide<Ref<string>>('user', user)", file: 'AppShell.vue',
        par: "<script setup lang=\"ts\">\nimport { provide, ref } from 'vue'\nimport type { Ref } from 'vue'\n\nconst user = ref<string>('山田 太郎')\n◆\n</script>", pHi: 6,
        cfile: 'UserBadge.vue', child: "<script setup lang=\"ts\">\nimport { inject } from 'vue'\nimport type { Ref } from 'vue'\n\nconst user = inject<Ref<string>>('user')\n</script>\n\n<template>\n  <b>{{ user }}</b>\n</template>", cHi: 5,
      },
    ];

    /* UI の部品(data-k) ⇄ コードの行：親コード(par)・子コード(chd) */
    const LK = [
      { par: { page: ['const title'], state: ['const title'], card: ['<CaseCard'], slot: ['<CaseCard'] }, chd: { card: ['defineProps'], slot: ['{{ props.title }}'] } },
      { par: { page: ['const cases'], state: ['const cases'], card: ['<CaseCard'], slot: ['<CaseCard'], btn: ['const remove', 'cases.value =', '@remove'] }, chd: { card: ['defineProps'], slot: ['defineProps'], btn: ["emit('remove'", 'defineEmits'] } },
      { par: { page: ['const name'], state: ['const name'], inp: ['<NameInput'], field: ['<NameInput'] }, chd: { inp: ['defineModel'], field: ['<input'] } },
      { par: { page: ['const field'], state: ['const field'], flt: ['<FilterPanel'], tab: ['<FilterPanel'], lst: ['<ResultList'], row: ['<ResultList'] }, chd: { lst: ['defineProps'], row: ['{{ props.field }}'] } },
      { par: { root: ['const user'], state: ['const user'], bdg: ['provide<', '【？】'], slot: ['provide<', '【？】'] }, chd: { bdg: ['inject<'], slot: ['{{ user }}'] } },
    ];

    /* ---------- 画面 ---------- */
    function scene() {
      const solved = SC.map(() => false);
      let cur = 0, tok = 0, busy = false, live = null, root = null, pP = null, cP = null, pRest = [], cRest = [];
      const stageHost = h('div'), qBox = h('div', { class: 'vzA-q' }), codeHost = h('div', { class: 'vzA-codes' }), mapEl = h('div', { class: 'vzA-map' });

      const loadStage = () => {
        const S = SC[cur], r = {}, nodeEl = {}, edgeEl = {};
        const stage = h('div', { class: 'vzA-stage', style: { height: S.hgt + 'px' } });
        const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'vzA-svg'); stage.append(svg);
        S.nodes.forEach((n) => {
          const el = h('div', { class: 'vzA-n' + (n.root ? ' root' : ''), 'data-k': n.id, style: { left: n.x + '%', top: n.y + 'px', width: n.w + '%' } },
            h('div', { class: 'vzA-nm' }, '🧩 ' + n.name + (n.root ? '　親' : '')), n.body(r));
          nodeEl[n.id] = el; stage.append(el);
        });
        const rel = (el) => { const a = el.getBoundingClientRect(), s = stage.getBoundingClientRect(); return { l: a.left - s.left, t: a.top - s.top, w: a.width, hh: a.height }; };
        const pos = (id, side) => {
          const el = side && r[side] ? r[side] : nodeEl[id], q = rel(el);
          if (side === 'r') return { x: q.l + q.w, y: q.t + q.hh / 2 };
          if (side === 'l') return { x: q.l, y: q.t + q.hh / 2 };
          return { x: q.l + q.w / 2, y: q.t + q.hh / 2 };
        };
        pos.el = (id) => nodeEl[id];
        const bez = (a, b) => {
          const s = stage.getBoundingClientRect(), A = pos(a, 'r'), B = pos(b, 'r'), cx = Math.max(A.x, B.x) + (s.width - Math.max(A.x, B.x)) * 0.9;
          return { A, B, cx };
        };
        const curve = (a, b) => {
          const { A, B, cx } = bez(a, b), pts = [];
          for (let k = 0; k <= 8; k++) { const t = k / 8, u = 1 - t; pts.push({ x: u * u * u * A.x + 3 * u * u * t * cx + 3 * u * t * t * cx + t * t * t * B.x, y: u * u * u * A.y + 3 * u * u * t * A.y + 3 * u * t * t * B.y + t * t * t * B.y }); }
          return pts;
        };
        const draw = () => {
          svg.replaceChildren();
          S.edges.forEach(([a, b, dash]) => {
            let el;
            if (dash) { const { A, B, cx } = bez(a, b); el = document.createElementNS(NS, 'path'); el.setAttribute('d', `M${A.x},${A.y} C${cx},${A.y} ${cx},${B.y} ${B.x},${B.y}`); el.setAttribute('fill', 'none'); }
            else { const A = rel(nodeEl[a]), B = rel(nodeEl[b]), x1 = A.l + A.w / 2, y1 = A.t + A.hh, x2 = B.l + B.w / 2, y2 = B.t; el = document.createElementNS(NS, 'line'); el.setAttribute('x1', x1); el.setAttribute('y1', y1); el.setAttribute('x2', x2); el.setAttribute('y2', y2); }
            el.setAttribute('class', 'vzA-ed' + (dash ? ' dash' : '') + (solved[cur] && (S.hot || [a + '-' + b]).includes(a + '-' + b) ? ' hot' : ''));
            edgeEl[a + '-' + b] = el; svg.append(el);
          });
          const tg = stage.querySelector('.vzA-tag');
          if (tg && S.edges.some((e) => e[2])) { const { A, B, cx } = bez('root', 'bdg'); tg.style.left = (A.x + (cx - A.x) * 0.55) + 'px'; tg.style.top = ((A.y + B.y) / 2 - 14) + 'px'; }
        };
        if (cur === 4) stage.append(h('div', { class: 'vzA-tag' }, 'provide / inject')); // 位置は draw で決める
        if (solved[cur]) S.done(r); else { S.init(r); S.focus.forEach((id) => nodeEl[id].classList.add('cur')); }
        if (solved[cur]) S.focus.forEach((id) => nodeEl[id].classList.add('ok'));
        stageHost.replaceChildren(stage);
        requestAnimationFrame(draw);
        new ResizeObserver(draw).observe(stage);
        const myTok = tok;
        const bump = (el, cls) => { if (!el) return; const k = 'bump' + (cls ? ' ' + cls : ''); el.classList.remove('bump', 'bad'); void el.offsetWidth; el.className += ' ' + k; if (cls) setTimeout(() => el.classList.remove('bad'), 1500); };
        const fly = async (pts, text, col, dur) => {
          if (myTok !== tok) return;
          const el = h('span', { class: 'vzA-pkt', style: { background: col } }, text); stage.append(el);
          const w = el.offsetWidth, hh = el.offsetHeight, P = pts.map((p) => `translate(${p.x - w / 2}px,${p.y - hh / 2}px)`), n = P.length;
          const fr = [{ transform: P[0] + ' scale(.6)', opacity: 0, offset: 0 }];
          P.forEach((t, k) => fr.push({ transform: t + ' scale(1)', opacity: 1, offset: 0.1 + 0.8 * k / (n - 1) }));
          fr.push({ transform: P[n - 1] + ' scale(.6)', opacity: 0, offset: 1 });
          try { await el.animate(fr, { duration: dur || 1000 * (n > 3 ? 1 : 1), easing: 'ease-in-out' }).finished; } catch (e) { /* 消えてもよい */ }
          el.remove();
        };
        const block = async (a, b, text) => {
          const m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
          await fly([a, m], text, 'var(--bad)', 700);
          if (myTok !== tok) return;
          const x = h('span', { class: 'vzA-x', style: { left: m.x + 'px', top: m.y + 'px' } }, '✖ 届かない'); stage.append(x); setTimeout(() => x.remove(), 1400);
        };
        const ctx = {
          r, pos, bump, fly, block, curve, alive: () => myTok === tok,
          done: () => S.done(r),
          hot: () => { Object.entries(edgeEl).forEach(([k, e]) => { if ((S.hot || Object.keys(edgeEl)).includes(k)) e.classList.add('hot'); }); },
        };
        live = ctx;
      };

      const drawQ = () => {
        const S = SC[cur];
        qBox.replaceChildren(
          h('div', { class: 'vzA-qh' }, h('span', { class: 'n' }, String(cur + 1)), h('b', S.who)),
          h('div', { class: 'vzA-qt' }, S.t),
          h('div', { class: 'vzA-ans' }, ...Object.keys(OPT).map((k) => {
            const b = h('button', { class: 'vzA-a' + (solved[cur] && k === S.ans ? ' on' : ''), style: { '--c': OPT[k][1] } }, h('b', OPT[k][0]), h('small', OPT[k][2]));
            b.onclick = () => answer(k, b); return b;
          })),
          h('div', { class: 'vzA-fb' + (solved[cur] ? ' ok' : '') }, solved[cur] ? '✓ ' + S.why : '光っている部品の間を、どう渡す？'),
          ...(solved[cur] ? [h('div', { class: 'vzA-data' }, h('small', null, '流れたデータ'), h('code', null, S.data))] : []));
      };
      const drawCode = () => {
        const S = SC[cur], sv = solved[cur];
        const p = code(S.par.replace('◆', sv ? S.fill : '【？】'), 'vue', { color: TS, file: S.file + '（親）', dim: true, edit: false });
        p.setHi(sv ? [S.pHi].concat(S.pHi2 || []) : [S.pHi], 'on');
        const c = code(S.child, 'vue', { color: TEAM, file: S.cfile + '（子）', dim: sv, edit: false });
        c.setHi(sv ? [S.cHi].concat(S.cHi2 || []) : [], 'on');
        codeHost.replaceChildren(p, c);
        pP = p; cP = c; pRest = sv ? [S.pHi].concat(S.pHi2 || []) : [S.pHi]; cRest = sv ? [S.cHi].concat(S.cHi2 || []) : [];
        relink();
      };
      const relink = () => { if (!root || !K.vs || !K.vs.link) return; root.querySelectorAll('[data-k]').forEach((n) => { n.__vsl = 0; }); K.vs.link(root, pP, LK[cur].par, { rest: () => pRest }); root.querySelectorAll('[data-k]').forEach((n) => { n.__vsl = 0; }); K.vs.link(root, cP, LK[cur].chd, { rest: () => cRest }); };
      const drawMap = () => {
        mapEl.replaceChildren(h('div', { class: 'vzA-mt' }, '場面ごとの選び方'), ...SC.map((s, i) => h('div', { class: 'vzA-mr' + (i === cur ? ' cur' : '') + (solved[i] ? ' ok' : ''), onclick: () => go(i) },
          h('span', { class: 'n' }, solved[i] ? '✓' : String(i + 1)), h('b', s.short), h('span', { class: 'ar', style: solved[i] ? { color: OPT[s.ans][1] } : null }, solved[i] ? OPT[s.ans][0] : '？'))),
          h('div', { class: 'vzA-mp' }, solved.every(Boolean) ? '🎉 全部の場面、選べた！' : solved.filter(Boolean).length + ' / ' + SC.length));
      };
      const paint = () => { tok++; busy = false; loadStage(); drawQ(); drawCode(); drawMap(); };
      const go = (i) => { cur = i; paint(); };
      const answer = async (k, b) => {
        const S = SC[cur];
        if (solved[cur] || busy) return;
        if (k === S.ans) {
          solved[cur] = true; busy = true;
          const ctx = live, my = tok;
          ctx.r && S.focus.forEach((id) => { const n = ctx.pos.el(id); n.classList.remove('cur'); n.classList.add('ok'); });
          drawQ(); drawCode(); drawMap();
          await S.run(ctx); ctx.hot(); busy = false;
          const nx = solved.findIndex((v) => !v);
          if (nx >= 0) setTimeout(() => { if (tok === my && cur === SC.indexOf(S)) go(nx); }, 2200);
        } else {
          b.classList.add('x'); const fb = qBox.querySelector('.vzA-fb'); fb.className = 'vzA-fb ng'; fb.textContent = '✖ ' + S.ng[k];
          qBox.classList.remove('shake'); void qBox.offsetWidth; qBox.classList.add('shake');
          const ctx = live;
          if (S.wrong && (cur !== 4 || k === 'p' || k === 'l') && (cur === 3 || cur === 4)) { busy = true; await S.wrong(ctx); busy = false; }
        }
      };
      const reset = h('button', { class: 'btn ghost', onclick: () => { solved.fill(false); cur = 0; paint(); } }, '⟲ やり直す');
      paint();
      root = h('div', { class: 'vzA-wrap' },
        h('div', { class: 'vzA-bar' }, h('span', { class: 'vzA-hint' }, '部品ツリー：箱＝部品、線＝つながり。選ぶとデータが走る'), reset),
        h('div', { class: 'vi-eq' },
          h('div', { class: 'vzA-wrap' }, stageHost, mapEl),
          h('div', { class: 'vzA-wrap' }, qBox, codeHost)));
      relink(); return root;
    }

    style('vzA', `
    .vzA-wrap{display:grid;gap:10px;min-width:0;align-content:start}
    .vzA-bar{display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap}
    .vzA-hint{font:700 .9rem var(--font);color:var(--mute)}
    .vzA-stage{position:relative;background:#f4f6fb;color:#223;border-radius:14px;min-width:0;overflow:hidden}
    .vzA-svg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
    .vzA-ed{stroke:#9aa3c7;stroke-width:3;transition:stroke .3s}
    .vzA-ed.dash{stroke-dasharray:8 7;stroke:#c25a8a}
    .vzA-ed.hot{stroke:#1f9d55;stroke-width:5}.vzA-ed.dash.hot{stroke:#e0408a}
    .vzA-n{position:absolute;transform:translateX(-50%);background:#fff;border:2px solid #cdd3e3;border-radius:12px;overflow:visible;transition:outline-color .2s,background .2s;outline:3px solid transparent;outline-offset:3px}
    .vzA-n.root{border-color:var(--ts);background:#eef4ff}
    .vzA-n.cur{outline-color:var(--ts);animation:vzAp 1.3s ease-in-out infinite}
    .vzA-n.ok{outline-color:#1f9d55;animation:none}
    @keyframes vzAp{50%{outline-color:transparent}}
    .vzA-nm{padding:6px 12px;background:#e4e9f7;border-radius:10px 10px 0 0;font:900 .95rem var(--mono);color:#1d2b53}
    .vzA-n.root .vzA-nm{background:#d3e2ff}
    .vzA-sts{display:flex;gap:8px;flex-wrap:wrap;padding:10px 12px}
    .vzA-st{padding:.25em .7em;border-radius:8px;background:#fff;border:1px solid #c7d4f5;color:#1d2b53;font:800 .95rem var(--mono)}
    .vzA-st b{color:#2f6df0}
    .vzA-card{display:flex;gap:10px;align-items:center;padding:12px;font-size:.95rem;font-weight:800;flex-wrap:wrap}
    .vzA-card.col{flex-direction:column;align-items:stretch;gap:6px}
    .vzA-card.sm{color:#778;font-weight:700;font-size:.9rem;padding:10px 12px}
    .vzA-card .av{font-size:1.4rem}
    .vzA-card .slot{font:900 1.05rem var(--font);color:#1d2b53;flex:1}
    .vzA-card .slot.empty{color:#aab;font-weight:700;font-size:.88rem}
    .vzA-card .slot.gone{text-decoration:line-through;opacity:.4}
    .vzA-card .bd{padding:.15em .7em;border-radius:99px;background:#dff5e8;color:#17653a;font-size:.8rem}
    .vzA-btn{border:0;border-radius:8px;padding:.5em 1.1em;background:#e5484d;color:#fff;font:900 .9rem var(--font)}
    .vzA-inp{flex:1;min-width:8em;padding:.5em .8em;border:2px solid #cdd3e3;border-radius:8px;background:#fff;color:#99a;font:700 .95rem var(--font)}
    .vzA-inp.on{color:#1d2b53;border-color:#2f7bff}
    .vzA-tab{padding:.45em .8em;border-radius:8px;background:#eef1f8;border:1px solid #cdd3e3;font:800 .9rem var(--font);color:#445}
    .vzA-tab.on{background:#2f7bff;border-color:#2f7bff;color:#fff}
    .vzA-row{display:flex;justify-content:space-between;gap:6px;padding:.45em .7em;border-radius:8px;background:#f7f8fc;border:1px solid #dde;font:800 .88rem var(--font);transition:opacity .4s}
    .vzA-row small{color:#778;font-weight:700}
    .vzA-row.dim{opacity:.25}
    .vzA-tag{position:absolute;padding:.2em .8em;border-radius:99px;background:#e0408a;color:#fff;font:900 .85rem var(--mono);white-space:nowrap;transform:translateX(-50%)}
    .vzA-pkt{position:absolute;left:0;top:0;z-index:9;padding:.3em .95em;border-radius:99px;color:#06101f;font:900 .9rem var(--mono);box-shadow:0 6px 18px rgba(0,0,0,.35);pointer-events:none;white-space:nowrap}
    .vzA-x{position:absolute;z-index:9;transform:translate(-50%,-50%);padding:.3em .9em;border-radius:8px;background:var(--bad);color:#fff;font:900 .95rem var(--font);white-space:nowrap;animation:vzAs .35s}
    @keyframes vzAs{25%{margin-left:-7px}75%{margin-left:7px}}
    .bump{animation:vzAb .7s}
    .bump.bad{animation:vzAbad 1.2s}
    @keyframes vzAb{30%{transform:scale(1.1);box-shadow:0 0 0 5px color-mix(in srgb,var(--ok) 45%,transparent)}}
    @keyframes vzAbad{30%{box-shadow:0 0 0 5px color-mix(in srgb,var(--bad) 60%,transparent)}100%{}}
    .vzA-n.bump{animation:vzAb2 .7s}
    @keyframes vzAb2{30%{box-shadow:0 0 0 6px color-mix(in srgb,var(--ok) 45%,transparent)}}
    .vzA-n.bump.bad{animation:vzAbad 1.2s}
    .vzA-map{border:1px solid var(--line);border-radius:12px;background:var(--card);padding:10px 12px;display:grid;gap:6px}
    .vzA-mt{font:900 .95rem var(--font)}
    .vzA-mr{display:flex;align-items:center;gap:10px;padding:.45em .7em;border-radius:9px;border:2px solid transparent;cursor:pointer;background:var(--card2)}
    .vzA-mr.cur{border-color:var(--ts)}
    .vzA-mr .n{width:24px;height:24px;border-radius:50%;background:var(--line);display:grid;place-items:center;font:900 .85rem var(--font)}
    .vzA-mr.ok .n{background:var(--ok);color:#06101f}
    .vzA-mr b{flex:1;font:800 .95rem var(--font)}
    .vzA-mr .ar{font:900 .95rem var(--mono);color:var(--mute)}
    .vzA-mp{font:900 .9rem var(--mono);color:var(--mute)}
    .vzA-q{border:2px solid var(--ts);border-radius:14px;background:var(--card);padding:16px 18px;display:grid;gap:12px}
    .vzA-q.shake{animation:vzAq .35s}@keyframes vzAq{25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}
    .vzA-qh{display:flex;gap:10px;align-items:center}
    .vzA-qh .n{width:30px;height:30px;border-radius:50%;background:var(--ts);color:#06101f;display:grid;place-items:center;font:900 1rem var(--font)}
    .vzA-qh b{font:900 1.05rem var(--mono)}
    .vzA-qt{font:800 1.25rem/1.6 var(--font)}
    .vzA-ans{display:grid;grid-template-columns:repeat(auto-fit,minmax(135px,1fr));gap:10px}
    .vzA-a{display:grid;gap:2px;justify-items:center;padding:.75em .4em;border-radius:12px;border:2px solid var(--c);background:transparent;color:var(--c);cursor:pointer;transition:.15s}
    .vzA-a b{font:900 1rem var(--font)}.vzA-a small{font:700 .85rem var(--font);opacity:.85}
    .vzA-a:hover{background:color-mix(in srgb,var(--c) 16%,transparent)}
    .vzA-a.on{background:var(--c);color:#06101f}
    .vzA-a.x{opacity:.35;text-decoration:line-through}
    .vzA-fb{font:800 .95rem/1.6 var(--font);color:var(--mute);min-height:1.6em}
    .vzA-fb.ok{color:var(--ok)}.vzA-fb.ng{color:var(--bad)}
    .vzA-data{display:grid;gap:4px}.vzA-data small{font:800 .85rem var(--font);color:var(--mute)}
    .vzA-data code{padding:.5em .8em;border-radius:8px;background:var(--code);color:#d8dcff;font:700 .95rem var(--mono)}
    .vzA-codes{display:grid;gap:10px;min-width:0}
    `);

    L.scenes.forEach((s) => {
      if (s.t !== TITLE) return;
      delete s.why;
      s.tag = '選び方';
      s.lead = '「<b>誰から誰へ</b>」で選ぶ。流れを選ぶと、データが部品の間を走る。';
      s.render = function (el) { el.append(scene()); };
    });
  }
})();
