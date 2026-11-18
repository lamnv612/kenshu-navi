/* vue-comp の4シーン（コンポーネントって？／props／emit／v-model の「どんな困りごと？」）を
   K.vs.versus（ない場合 ⇄ ある場合を左右に並べる）で作り直す */
(function () {
  'use strict';
  const K = window.KENSHU;
  const SCENES = ['コンポーネントって？', 'props：どんな困りごと？', 'emit：どんな困りごと？', 'v-model：どんな困りごと？'];
  let tries = 0;
  (function wait() {
    const L = K && K.lessons && K.lessons['vue-comp'];
    if (L && K.W && K.vs && SCENES.every((t) => L.scenes.some((s) => s.t === t))) return init(L);
    if (++tries < 400) setTimeout(wait, 50);
  })();

  function init(L) {
    if (L.__vsB) return; L.__vsB = 1;
    const { h, style } = K.W;
    style('vsB', `
    .vsB .vs-code{max-height:520px}
    .vsB .vs-ui{min-height:230px}
    .vsB-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px}
    .vsB-card{background:#fff;border:2px solid #d7dbe8;border-radius:12px;padding:10px;display:grid;gap:8px;justify-items:start;transition:.3s;min-width:0}
    .vsB-card b{font:800 .95rem var(--font);overflow-wrap:anywhere}
    .vsB-card .vsB-file{font:800 .8rem var(--mono);color:#556;background:#eef1f8;border-radius:6px;padding:.1em .5em;overflow-wrap:anywhere}
    .vsB-card.miss{border-color:#ff9a3c;box-shadow:0 0 0 3px #ff9a3c55}
    .vsB-card.new{border-style:dashed;border-color:var(--bad)}
    .vsB-card.fade{opacity:0;transform:scale(.6);pointer-events:none}
    .vsB-card.gone{display:none}
    .vsB-card.shake{animation:vsBs .4s}
    .vsB-card[hidden]{display:none}
    @keyframes vsBs{25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}
    .vsB-btn{font:800 .85rem var(--font);padding:.35em .8em;border-radius:8px;background:#8b93a8;color:#fff;border:0;transition:.3s;cursor:pointer}
    .vsB-btn.blue{background:#2f7bff}
    .vsB-btn.del{background:#ff6b81}.vsB-btn.ren{background:#8b93a8}
    .vsB-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
    .vsB-cnt{display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:10px;background:#fff;border:2px solid #d7dbe8;font:800 .95rem var(--font);transition:.3s}
    .vsB-cnt .n{font:900 1.6rem var(--font);line-height:1}
    .vsB-cnt.bad .n{color:#e0364d}.vsB-cnt.good .n{color:#14a37f}
    .vsB-cnt.bad{border-color:#e0364d66}
    .vsB-chip{font:800 .85rem var(--mono);background:#fff;border:2px dashed #99a;border-radius:8px;padding:.3em .6em;color:#334}
    .vsB-warn{font:700 .8rem/1.4 var(--mono);color:#b3261e;background:#fdecea;border:1px solid #f5b5ae;border-radius:8px;padding:6px 10px;overflow-wrap:anywhere}
    .vsB-in{padding:.5em .7em;border-radius:8px;border:2px solid #99a;width:100%;box-sizing:border-box;font:700 .95rem var(--font);background:#fff;color:#1f2a44;transition:.2s}
    .vsB-in.rej{border-color:#e0364d;animation:vsBs .35s}
    .vsB-lab{font:800 .85rem var(--font);color:#556}
    .vsB-fld{display:grid;gap:4px}
    `);
    const CARD = ['離婚の相談', '相続の相談', '労働の相談'];
    const KEY = ['divorce', 'inherit', 'labor'];
    const FILE = ['CaseCardDivorce', 'CaseCardInherit', 'CaseCardLabor'];
    const RED = 'var(--bad)', GRN = 'var(--ok)', TEAM = 'var(--team)';
    const bar = (a, b) => [{ label: a[0], primary: true, onclick: a[1] }].concat(b ? [{ label: b[0], onclick: b[1] }] : [], [{ label: '⟲ 最初から', ghost: true, onclick: (c) => c.reset() }]);
    const wrap = (root) => { root.classList.add('vsB'); return root; };
    const cnt = (cls, label, n, unit) => { const nn = h('span', { class: 'n' }, String(n)); const el = h('div', { class: 'vsB-cnt ' + cls }, label, nn, unit); el.set = (v, c) => { nn.textContent = String(v); if (c) el.className = 'vsB-cnt ' + c; }; return el; };
    const insertLines = (pre, texts, before) => texts.map((t) => { const s = h('span', { class: 'ln on' }, t); before ? pre.insertBefore(s, before) : pre.append(s); return s; });
    const clearAdded = (arr) => { arr.splice(0).forEach((n) => n.remove()); };
    const scrollEnd = (pre) => { const b = pre.closest('.vs-code'); if (b) b.scrollTop = b.scrollHeight; };
    const typeInto = async (ctx, inp, text, ok) => {
      for (const ch of text) {
        inp.value += ch; inp.dispatchEvent(new Event('input', { bubbles: true }));
        await ctx.sleep(ok ? 380 : 450);
      }
    };
    const vanish = (el) => { el.classList.add('fade'); setTimeout(() => el.classList.add('gone'), 350); };
    const SEP = (f) => `<!-- ${f} -->`;
    const CARDSRC = (i) => `${SEP(FILE[i] + '.vue')}\n<template>\n  <div class="card">\n    <h3>${CARD[i]}</h3>\n    <button class="btn" @click="consult('${KEY[i]}')">相談する</button>\n  </div>\n</template>`;
    const leftKeys = () => { const o = {}; CARD.forEach((t, i) => { o['d' + i] = [t, `consult('${KEY[i]}')`]; }); return o; };
    const CALLS = CARD.map((t) => `<CaseCard title="${t}" />`);
    const RIGHT_CARD = `<script setup lang="ts">\ndefineProps<{ title: string }>()\n</script>\n\n<template>\n  <div class="card">\n    <h3>{{ title }}</h3>\n    <button class="btn">相談する</button>\n  </div>\n</template>\n\n${SEP('CaseListPage.vue')}\n<template>\n${CALLS.map((c) => '  ' + c).join('\n')}\n</template>`;
    const rightKeys = () => { const o = { show: ['{{ title }}'], btn: ['<button class="btn"'] }; CARD.forEach((t, i) => { o['t' + i] = [`title="${t}"`]; }); return o; };

    /* ================= ① コンポーネントって？ ================= */
    function compScene() {
      let tok = 0;
      const lSrc = `<template>\n${CARD.map((t, i) => `  <div class="card">\n    <h3>${t}</h3>\n    <button class="btn" @click="consult('${KEY[i]}')">相談する</button>\n  </div>`).join('\n')}\n</template>`;
      let Lc, Rc, Lcnt, Rcnt;
      const left = {
        title: 'ない場合：同じ形をコピペ ×3', file: 'CaseListPage.vue', lang: 'vue', src: lSrc, keys: leftKeys(),
        ui: () => {
          Lc = CARD.map((t, i) => h('div', { class: 'vsB-card', 'data-k': 'd' + i }, h('b', t), h('span', { class: 'vsB-btn' }, '相談する')));
          Lcnt = cnt('bad', '✏️ 直す場所 ', 3, ' か所');
          return { el: h('div', { style: { display: 'grid', gap: '10px' } }, h('div', { class: 'vsB-grid' }, ...Lc), Lcnt), reset() { Lc.forEach((c) => { c.classList.remove('miss'); c.querySelector('.vsB-btn').classList.remove('blue'); }); Lcnt.set(3, 'bad'); } };
        },
      };
      const right = {
        title: 'ある場合：CaseCard を1つ作る', file: 'CaseCard.vue ＋ CaseListPage.vue', lang: 'vue', src: RIGHT_CARD, keys: rightKeys(),
        ui: () => {
          Rc = CARD.map((t, i) => h('div', { class: 'vsB-card' }, h('b', { 'data-k': 't' + i }, t), h('span', { class: 'vsB-btn', 'data-k': 'btn' }, '相談する')));
          Rcnt = cnt('good', '✏️ 直す場所 ', 1, ' か所');
          return { el: h('div', { style: { display: 'grid', gap: '10px' } }, h('div', { class: 'vsB-grid' }, ...Rc), Rcnt), reset() { Rc.forEach((c) => c.querySelector('.vsB-btn').classList.remove('blue')); Rcnt.set(1, 'good'); } };
        },
      };
      const demo = async (ctx) => {
        ctx.reset(); const me = ++tok; const ok = () => me === tok;
        ctx.banner('ボタンを青にしたい。直す場所は…？', 'warn');
        await ctx.sleep(500);
        for (let i = 0; i < 2 && ok(); i++) {
          ctx.hi('without', [`consult('${KEY[i]}')`]);
          await ctx.fly(Lcnt, Lc[i].querySelector('.vsB-btn'), '🎨 青に', '#5b9dff');
          Lc[i].querySelector('.vsB-btn').classList.add('blue'); ctx.bump(Lc[i]);
        }
        if (!ok()) return;
        ctx.hi('without', null); Lc[2].classList.add('miss');
        ctx.banner('✖ 3枚目だけ直し忘れ！（オレンジ枠）枚数が増えるほど、増える。', 'bad');
        await ctx.sleep(1700); if (!ok()) return;
        ctx.hi('with', ['<button class="btn"']);
        ctx.banner('', 'warn');
        await ctx.fly(Rcnt, Rc[1].querySelector('.vsB-btn'), '🎨 青に', '#5b9dff');
        Rc.forEach((c, i) => setTimeout(() => { c.querySelector('.vsB-btn').classList.add('blue'); ctx.bump(c); }, i * 150));
        await ctx.sleep(700); if (!ok()) return;
        ctx.banner('✓ CaseCard.vue の1行だけ。3枚ぜんぶ青になった。', 'ok');
      };
      return wrap(K.vs.versus({
        banner: '同じ形のカードを3枚。ボタンの色を変えるとき、何か所直す？',
        bar: bar(['🎨 ボタンを青にしたい', demo]),
        without: left, with: right,
      }));
    }

    /* ================= ② props ================= */
    function propsScene() {
      let tok = 0, Lc, Rc, Lcnt, Rcnt, Lnew, Rnew, chip; const addedL = [], addedR = [];
      const left = {
        title: 'ない場合：1種類ごとにファイル', file: 'CaseCardDivorce.vue ほか3つ', lang: 'vue', src: [0, 1, 2].map(CARDSRC).join('\n'), keys: leftKeys(),
        ui: () => {
          Lc = CARD.map((t, i) => h('div', { class: 'vsB-card', 'data-k': 'd' + i }, h('b', t), h('span', { class: 'vsB-file' }, FILE[i] + '.vue')));
          Lnew = h('div', { class: 'vsB-card new', hidden: true }, h('b', '交通事故の相談'), h('span', { class: 'vsB-file' }, 'CaseCardTraffic.vue'));
          Lcnt = cnt('bad', '📄 ファイル ', 3, ' 個');
          return { el: h('div', { style: { display: 'grid', gap: '10px' } }, h('div', { class: 'vsB-grid' }, ...Lc, Lnew), Lcnt), reset() { Lnew.hidden = true; Lcnt.set(3, 'bad'); clearAdded(addedL); } };
        },
      };
      const right = {
        title: 'ある場合：props で名前だけ渡す', file: 'CaseCard.vue ＋ CaseListPage.vue', lang: 'vue', src: RIGHT_CARD, keys: rightKeys(),
        ui: () => {
          Rc = CARD.map((t, i) => h('div', { class: 'vsB-card' }, h('b', { 'data-k': 't' + i }, t), h('span', { class: 'vsB-btn' }, '相談する')));
          Rnew = h('div', { class: 'vsB-card', hidden: true }, h('b', '交通事故の相談'), h('span', { class: 'vsB-btn' }, '相談する'));
          chip = h('span', { class: 'vsB-chip' }, 'title="交通事故の相談"');
          Rcnt = cnt('good', '📄 ファイル ', 1, ' 個');
          return { el: h('div', { style: { display: 'grid', gap: '10px' } }, h('div', { class: 'vsB-row' }, h('span', { class: 'vsB-lab' }, '親が渡す'), chip), h('div', { class: 'vsB-grid' }, ...Rc, Rnew), Rcnt), reset() { Rnew.hidden = true; Rcnt.set(1, 'good'); clearAdded(addedR); } };
        },
      };
      const demo = async (ctx) => {
        ctx.reset(); const me = ++tok; const ok = () => me === tok;
        ctx.banner('4つ目「交通事故の相談」を足したい。', 'warn');
        await ctx.sleep(400);
        ctx.hi('without', CARD);
        await ctx.sleep(900); if (!ok()) return;
        Lnew.hidden = false;
        await ctx.fly(Lc[2], Lnew, '📄 コピペ', '#ff8a5b');
        insertLines(ctx.pre.without, [SEP('CaseCardTraffic.vue'), '<template>', '  <div class="card">', '    <h3>交通事故の相談</h3>', '    <button class="btn" @click="consult(\'traffic\')">相談する</button>', '  </div>', '</template>'].map((s) => s)).forEach((n) => addedL.push(n));
        scrollEnd(ctx.pre.without); ctx.hi('without', null);
        ctx.bump(Lnew); Lcnt.set(4, 'bad');
        ctx.banner('✖ 足すたび、ファイルが1つ増える。直す場所も増える。', 'bad');
        await ctx.sleep(1700); if (!ok()) return;
        ctx.banner('', 'warn');
        Rnew.hidden = false;
        await ctx.fly(chip, Rnew, 'title', '#2fd4a4');
        const tpl = ctx.pre.with.lines[ctx.pre.with.lines.length - 1];
        insertLines(ctx.pre.with, ['  ' + '<CaseCard title="交通事故の相談" />'], tpl).forEach((n) => addedR.push(n));
        ctx.bump(Rnew); ctx.bump(Rcnt);
        ctx.banner('✓ 呼ぶ行を1つ足すだけ。ファイルは増えない。', 'ok');
      };
      return wrap(K.vs.versus({
        banner: '案件カードを3種類。中身（名前）が違うだけ。さて、どう作る？',
        bar: bar(['➕ 「交通事故の相談」を足したい', demo]),
        without: left, with: right,
      }));
    }

    /* ================= ③ emit ================= */
    const EMIT_PAGE = `${SEP('CaseListPage.vue')}\n<template>\n  <p>全 {{ cases.length }} 件</p>\n  <CaseCard\n    v-for="(c, i) in cases"\n    :title="c"\n    @remove="cases.splice(i, 1)"\n  />\n</template>`;
    const EMIT_BAD_PAGE = `${SEP('CaseListPage.vue')}\n<template>\n  <p>全 {{ cases.length }} 件</p>\n  <CaseCard v-for="c in cases" :title="c" />\n</template>`;
    function emitScene() {
      let tok = 0, Lc, Rc, Lcnt, Rcnt, Lwarn, Lreal, Rn = 3, Ln = 3, shown = 3;
      const left = {
        title: 'ない場合：子が勝手に消す', file: 'CaseCard.vue ＋ CaseListPage.vue', lang: 'vue',
        src: `<script setup lang="ts">\nimport { ref } from 'vue'\nconst props = defineProps<{ title: string }>()\nconst alive = ref(true)\n</script>\n\n<template>\n  <div v-if="alive" class="card">\n    <h3>{{ title }}</h3>\n    <button @click="alive = false">削除</button>\n    <button @click="props.title = ''">改名</button>\n  </div>\n</template>\n\n${EMIT_BAD_PAGE}`,
        keys: { show: ['{{ title }}'], count: ['cases.length'], del: ['alive = false'], ren: ['props.title'] },
        ui: (ctx) => {
          const fresh = () => {
            Lc = CARD.map((t, i) => {
              const del = h('span', { class: 'vsB-btn del', 'data-k': 'del' }, '🗑 削除'), ren = h('span', { class: 'vsB-btn ren', 'data-k': 'ren' }, '✏️ 改名');
              const c = h('div', { class: 'vsB-card' }, h('b', { 'data-k': 'show' }, t), h('span', { class: 'vsB-row' }, del, ren));
              del.onclick = () => leftDel(ctx, i); ren.onclick = () => leftRen(ctx, i);
              return c;
            });
          };
          fresh();
          Lcnt = h('span', { class: 'vsB-cnt bad', 'data-k': 'count' }, '親のリスト：全 ', h('span', { class: 'n' }, '3'), ' 件');
          Lreal = h('span', { class: 'vsB-lab' }, '画面：3 枚');
          Lwarn = h('div', { class: 'vsB-warn', hidden: true });
          return { el: h('div', { style: { display: 'grid', gap: '10px' } }, h('div', { class: 'vsB-row' }, Lcnt, Lreal), h('div', { class: 'vsB-grid' }, ...Lc), Lwarn), reset() { Lc.forEach((c) => c.classList.remove('fade', 'gone', 'shake')); Ln = 3; shown = 3; Lcnt.className = 'vsB-cnt bad'; Lcnt.querySelector('.n').textContent = '3'; Lreal.textContent = '画面：3 枚'; Lwarn.hidden = true; } };
        },
      };
      const right = {
        title: 'ある場合：emit で親に頼む', file: 'CaseCard.vue ＋ CaseListPage.vue', lang: 'vue',
        src: `<script setup lang="ts">\ndefineProps<{ title: string }>()\nconst emit = defineEmits<{ remove: [] }>()\n</script>\n\n<template>\n  <div class="card">\n    <h3>{{ title }}</h3>\n    <button @click="emit('remove')">削除</button>\n  </div>\n</template>\n\n${EMIT_PAGE}`,
        keys: { show: ['{{ title }}'], emit: ["emit('remove')", 'defineEmits'], handler: ['@remove'], count: ['cases.length'] },
        ui: (ctx) => {
          Rc = CARD.map((t, i) => {
            const del = h('span', { class: 'vsB-btn del', 'data-k': 'emit' }, '🗑 削除');
            const c = h('div', { class: 'vsB-card' }, h('b', { 'data-k': 'show' }, t), del);
            del.onclick = () => rightDel(ctx, i);
            return c;
          });
          Rcnt = h('span', { class: 'vsB-cnt good', 'data-k': 'count' }, '親のリスト：全 ', h('span', { class: 'n' }, '3'), ' 件');
          return { el: h('div', { style: { display: 'grid', gap: '10px' } }, h('div', { class: 'vsB-row' }, Rcnt, h('span', { class: 'vsB-lab' }, '画面：いつも同じ数')), h('div', { class: 'vsB-grid' }, ...Rc)), reset() { Rc.forEach((c) => c.classList.remove('fade', 'gone')); Rn = 3; Rcnt.querySelector('.n').textContent = '3'; } };
        },
      };
      const leftDel = (ctx, i) => {
        if (Lc[i].classList.contains('fade')) return;
        vanish(Lc[i]); shown--; Lreal.textContent = '画面：' + shown + ' 枚';
        ctx.bump(Lcnt); ctx.banner('✖ 子が自分を隠しただけ。親は「全3件」のまま。', 'bad');
      };
      const leftRen = (ctx, i) => {
        Lc[i].classList.remove('shake'); void Lc[i].offsetWidth; Lc[i].classList.add('shake');
        Lwarn.hidden = false; Lwarn.textContent = '[Vue warn] Set operation on key "title" failed: target is readonly.';
        ctx.banner('✖ props は読み取り専用。子が書き換えても、親には伝わらない。', 'bad');
      };
      const rightDel = async (ctx, i) => {
        if (Rc[i].classList.contains('fade') || ctx.__busy) return;
        ctx.__busy = true;
        ctx.hi('with', ["emit('remove')"]);
        await ctx.fly(Rc[i].querySelector('.vsB-btn'), Rcnt, 'remove', '#ffb454');
        ctx.hi('with', ['@remove']); await ctx.sleep(450);
        vanish(Rc[i]); Rn--; Rcnt.querySelector('.n').textContent = String(Rn);
        ctx.hi('with', ['cases.length']); ctx.bump(Rcnt);
        ctx.banner('✓ 子は知らせるだけ。消すのは親。件数も合う。', 'ok');
        await ctx.sleep(500); ctx.hi('with', null); ctx.__busy = false;
      };
      const demo = async (ctx) => {
        ctx.reset(); const me = ++tok; ctx.__busy = false;
        ctx.banner('1枚目の「🗑 削除」を押す…', 'warn'); await ctx.sleep(500);
        ctx.hi('without', ['alive = false']); leftDel(ctx, 0);
        await ctx.sleep(1800); if (me !== tok) return;
        ctx.hi('without', null); ctx.banner('同じ操作を、emit の方で…', 'warn'); await ctx.sleep(500);
        if (me !== tok) return; await rightDel(ctx, 0);
      };
      return wrap(K.vs.versus({
        banner: '「🗑 削除」を押したい。でもリストを持っているのは親。子が消していい？',
        bar: bar(['▶ 🗑 を押してみる', demo], ['✏️ 子が title を書き換える', (ctx) => { ctx.reset(); tok++; leftRen(ctx, 0); }]),
        without: left, with: right,
      }));
    }

    /* ================= ④ v-model ================= */
    function modelScene() {
      let tok = 0, kw = '', kr = '', A, B, Kv, M1, M2, KvR;
      const syncL = () => { A.value = kw; B.value = kw; Kv.textContent = kw || '（空）'; };
      const syncR = () => { M1.value = kr; M2.value = kr; KvR.textContent = kr || '（空）'; };
      const left = {
        title: 'ない場合：:value と @input を毎回', file: 'SearchBox.vue ＋ CaseListPage.vue', lang: 'vue',
        src: `<script setup lang="ts">\ndefineProps<{ value: string }>()\nconst emit = defineEmits<{ input: [value: string] }>()\n</script>\n\n<template>\n  <input\n    :value="value"\n    @input="emit('input', ($event.target as HTMLInputElement).value)"\n  />\n</template>\n\n${SEP('CaseListPage.vue')}\n<template>\n  <SearchBox :value="keyword" @input="keyword = $event" />\n  <SearchBox :value="keyword" />\n  <p>検索中：{{ keyword }}</p>\n</template>`,
        keys: { wired: ['@input="keyword = $event"'], forgot: ['<SearchBox :value="keyword" />'], kw: ['{{ keyword }}'], child: [':value="value"', "emit('input'"] },
        ui: () => {
          A = h('input', { class: 'vsB-in', placeholder: '案件名で検索', 'data-k': 'wired' });
          B = h('input', { class: 'vsB-in', placeholder: '案件名で検索', 'data-k': 'forgot' });
          Kv = h('b', '（空）');
          A.addEventListener('input', () => { kw = A.value; syncL(); });
          B.addEventListener('input', () => { B.classList.remove('rej'); void B.offsetWidth; B.classList.add('rej'); setTimeout(() => { B.value = kw; B.classList.remove('rej'); }, 330); });
          return { el: h('div', { style: { display: 'grid', gap: '10px' } },
            h('div', { class: 'vsB-fld' }, h('span', { class: 'vsB-lab' }, '① @input あり'), A),
            h('div', { class: 'vsB-fld' }, h('span', { class: 'vsB-lab' }, '② @input を書き忘れ'), B),
            h('div', { class: 'vsB-cnt bad', 'data-k': 'kw' }, '親の keyword = ', Kv)), reset() { kw = ''; syncL(); } };
        },
      };
      const right = {
        title: 'ある場合：v-model 1行', file: 'SearchBox.vue ＋ CaseListPage.vue', lang: 'vue',
        src: `<script setup lang="ts">\nconst model = defineModel<string>()\n</script>\n\n<template>\n  <input v-model="model" />\n</template>\n\n${SEP('CaseListPage.vue')}\n<template>\n  <SearchBox v-model="keyword" />\n  <SearchBox v-model="keyword" />\n  <p>検索中：{{ keyword }}</p>\n</template>`,
        keys: { child: ['defineModel', 'v-model="model"'], kw: ['{{ keyword }}'], vm: ['<SearchBox v-model="keyword" />'] },
        ui: () => {
          M1 = h('input', { class: 'vsB-in', placeholder: '案件名で検索', 'data-k': 'vm' });
          M2 = h('input', { class: 'vsB-in', placeholder: '案件名で検索', 'data-k': 'vm' });
          KvR = h('b', '（空）');
          [M1, M2].forEach((m) => m.addEventListener('input', () => { kr = m.value; syncR(); }));
          return { el: h('div', { style: { display: 'grid', gap: '10px' } },
            h('div', { class: 'vsB-fld' }, h('span', { class: 'vsB-lab' }, '① v-model'), M1),
            h('div', { class: 'vsB-fld' }, h('span', { class: 'vsB-lab' }, '② v-model'), M2),
            h('div', { class: 'vsB-cnt good', 'data-k': 'kw' }, '親の keyword = ', KvR)), reset() { kr = ''; syncR(); } };
        },
      };
      const demo = async (ctx) => {
        ctx.reset(); const me = ++tok; const ok = () => me === tok;
        ctx.banner('「相続」と入力してみる。', 'warn'); await ctx.sleep(400);
        ctx.hi('without', ['@input="keyword = $event"']);
        await typeInto(ctx, A, '相続', true); if (!ok()) return;
        await ctx.sleep(500); ctx.hi('without', ['<SearchBox :value="keyword" />']);
        ctx.banner('② にも「の」を打ってみる…', 'warn'); await ctx.sleep(500);
        B.value = kw + 'の'; B.dispatchEvent(new Event('input')); await ctx.sleep(900); if (!ok()) return;
        ctx.banner('✖ ② は @input を書き忘れ。打っても元に戻る。（use のたび2行）', 'bad');
        await ctx.sleep(1800); if (!ok()) return;
        ctx.hi('without', null);
        ctx.hi('with', ['<SearchBox v-model="keyword" />']); ctx.banner('v-model なら…', 'warn'); await ctx.sleep(500);
        for (const ch of '相続') {
          if (!ok()) return;
          M1.value += ch; kr = M1.value; M2.value = kr;
          const fl = ctx.fly(M1, KvR, ch, '#2fd4a4'); await ctx.sleep(450); KvR.textContent = kr; ctx.bump(M2); await fl;
        }
        ctx.banner('✓ v-model 1行で、どの入力欄も親と同じ値。', 'ok');
      };
      return wrap(K.vs.versus({
        banner: '入力欄を部品にした。親と子で「同じ値」を保ちたい。',
        bar: bar(['⌨ 「相続」と入力してみる', demo]),
        without: left, with: right,
      }));
    }

    /* ================= シーンを差し替え ================= */
    const MAP = {
      'コンポーネントって？': ['COMPONENT', '同じ形を何回も使うなら、<b>1つの部品</b>に。', compScene],
      'props：どんな困りごと？': ['props ⬇', '<b>中身だけ違う</b>カード。左は困る、右は props。', propsScene],
      'emit：どんな困りごと？': ['emit ⬆', '子が<b>勝手に消す</b>と困る。右は emit で親に頼む。', emitScene],
      'v-model：どんな困りごと？': ['v-model ⇅', '<b>:value と @input</b>を毎回書くのは大変。右は v-model。', modelScene],
    };
    L.scenes.forEach((s) => {
      const m = MAP[s.t]; if (!m) return;
      delete s.why;
      s.tag = s.tag || m[0]; s.lead = m[1];
      s.render = (el) => { el.append(m[2]()); };
    });
  }
})();
