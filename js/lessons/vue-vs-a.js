/* vue-life の導入3場面（ライフサイクル / computed / watch）を、「ない場合 ⇄ ある場合」の左右比較（K.vs.versus）に差し替える */
(function () {
  'use strict';
  const K = window.KENSHU;
  if (!K) return;
  const TITLES = ['ライフサイクル', 'computed：賢い計算', 'watch / watchEffect'];
  let tries = 0;
  (function wait() {
    const L = K.lessons && K.lessons['vue-life'];
    if (L && K.W && K.vs && TITLES.every((t) => L.scenes.some((s) => s.t === t))) return init(L);
    if (++tries < 300) setTimeout(wait, 50);
  })();

  function init(L) {
    if (L.__vsA) return; L.__vsA = 1;
    const { h, style } = K.W;
    const BAD = 'var(--bad)', OK = 'var(--ok)';
    style('vsA', `
    .vsA-chip{display:inline-flex;align-items:center;gap:.4em;padding:.3em .8em;border-radius:99px;border:2px solid var(--line);background:#fff;color:#1f2a44;font:800 .85rem var(--mono);width:fit-content}
    .vsA-chip.on{border-color:var(--team);background:color-mix(in srgb,var(--team) 22%,#fff)}
    .vsA-chip.ok{border-color:var(--ok);background:color-mix(in srgb,var(--ok) 20%,#fff)}
    .vsA-chip.bad{border-color:var(--bad);background:color-mix(in srgb,var(--bad) 16%,#fff)}
    .vsA-fld{padding:.55em .8em;border-radius:10px;border:2px solid #c9d2e6;background:#fff;color:#1f2a44;font:800 .95rem/1.5 var(--font);min-height:42px;display:flex;align-items:center;gap:.6em;flex-wrap:wrap}
    .vsA-fld.bad{border-color:var(--bad);background:color-mix(in srgb,var(--bad) 12%,#fff);color:var(--bad)}
    .vsA-fld.ok{border-color:var(--ok);background:color-mix(in srgb,var(--ok) 12%,#fff)}
    .vsA-fld small{font:700 .85rem var(--font);opacity:.75}
    .vsA-fld .big{font:900 1.35rem var(--mono)}
    .vsA-row{display:flex;gap:8px;flex-wrap:wrap;align-items:stretch}
    .vsA-row>.vsA-fld{flex:1;min-width:120px}
    .vsA-li{display:flex;gap:8px;align-items:center;padding:.15em 0;font:800 .95rem var(--font)}
    .vsA-note{font:800 .88rem/1.5 var(--font);padding:.45em .8em;border-radius:10px;min-height:40px;display:flex;align-items:center}
    .vsA-note.bad{color:var(--bad);background:color-mix(in srgb,var(--bad) 10%,#fff)}
    .vsA-note.ok{color:#127a5c;background:color-mix(in srgb,var(--ok) 14%,#fff)}
    `);
    const div = (cls, k, ...kids) => h('div', { class: cls, 'data-k': k || null }, ...kids);
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const yen = (n) => n.toLocaleString('ja-JP') + '円';
    const cls = (e, c) => { e.className = e.className.replace(/ ?\b(ok|bad|on)\b/g, ''); if (c) e.className += ' ' + c; };

    /* ============ 1. ライフサイクル ============ */
    const lifeSrcNo = [
      "const box = document.querySelector('#search')",
      "const list = document.querySelector('#list')",
      '',
      'box.focus()',
      '',
      'setTimeout(() => {',
      '  fetchLawyers().then((rows) => {',
      "    list.innerHTML = rows.map(toItem).join('')",
      '  })',
      '}, 100)',
    ].join('\n');
    const lifeSrcYes = [
      '<script setup lang="ts">',
      "import { ref, onMounted } from 'vue'",
      'const lawyers = ref<Lawyer[]>([])',
      'const searchBox = ref<HTMLInputElement | null>(null)',
      'onMounted(async () => {',
      '  searchBox.value?.focus()',
      '  lawyers.value = await fetchLawyers()',
      '})',
      '</' + 'script>',
      '',
      '<template>',
      '  <input ref="searchBox" />',
      '  <li v-for="l in lawyers" :key="l.id">…</li>',
      '</template>',
    ].join('\n');

    const lifeUI = (yes) => (ctx) => {
      const side = yes ? 'with' : 'without';
      const hook = div('vsA-chip', yes ? 'hook' : 'wait', yes ? 'onMounted' : '⏱ 100ms 待つ');
      const box = div('vsA-fld', 'box');
      const list = div('vsA-fld', 'list');
      const note = div('vsA-note ' + (yes ? 'ok' : 'bad'), '', yes ? '使いどころ：画面が出た直後に 1 回だけやる処理' : '困る：画面より先に動くと、部品が null');
      const el = h('div', { style: { display: 'grid', gap: '8px' } }, hook, box, list, note);
      const reset = () => {
        cls(hook, ''); cls(box, ''); cls(list, '');
        box.textContent = '🔍 検索ボックス　未実行'; list.textContent = '📋 弁護士一覧　未取得';
      };
      reset();
      const run = async () => {
        if (!yes) {
          ctx.banner('JS が先に動く。画面はまだ無い…', 'warn');
          await sleep(500);
          cls(box, 'bad'); box.textContent = '💥 box は null → focus() でエラー'; ctx.bump(box);
          await sleep(900);
          cls(hook, 'on'); ctx.bump(hook);
          await ctx.fly(hook, list, 'fetch', '#ffb454');
          cls(list, 'bad'); list.textContent = '❌ list も null → 一覧は出ない'; ctx.bump(list);
        } else {
          ctx.banner('setup が動く → 画面ができる…', 'warn');
          await sleep(1100);
          cls(hook, 'ok'); ctx.bump(hook);
          cls(box, 'ok'); box.textContent = '✅ focus 済み（部品がある）'; ctx.bump(box);
          await ctx.fly(hook, list, 'fetch', '#2fd4a4');
          cls(list, 'ok'); list.replaceChildren(h('div', null, ...['山田 太郎　相続', '佐藤 花子　離婚'].map((n) => h('div', { class: 'vsA-li' }, '👤 ' + n)))); ctx.bump(list);
        }
      };
      return { el, reset, run };
    };

    /* ============ 2. computed ============ */
    const RATE = 5500;
    const cmpSrcNo = [
      'let people = 2',
      'let hours = 1',
      'let total = calc()',
      'function calc() { return people * hours * 5500 }',
      'function addPerson() {',
      '  people++',
      '  total = calc()',
      '}',
      'function addHour() {',
      '  hours++',
      '}',
    ].join('\n');
    const cmpSrcYes = [
      '<script setup lang="ts">',
      "import { ref, computed } from 'vue'",
      'const people = ref(2)',
      'const hours = ref(1)',
      'const total = computed(() =>',
      '  people.value * hours.value * 5500',
      ')',
      '</' + 'script>',
      '<template>',
      '  <p>合計 {{ total }} 円</p>',
      '</template>',
    ].join('\n');

    const cmpUI = (yes) => (ctx) => {
      const S = { people: 2, hours: 1, shown: 2 * RATE };
      const real = () => S.people * S.hours * RATE;
      const pv = h('b', { class: 'big' }), hv = h('b', { class: 'big' }), tv = h('b', { class: 'big' }), hint = h('small');
      const fp = div('vsA-fld', 'people', h('small', '相談人数'), pv);
      const fh = div('vsA-fld', 'hours', h('small', '時間'), hv);
      const ft = div('vsA-fld', 'total', h('small', '合計'), tv, hint);
      const note = div('vsA-note ' + (yes ? 'ok' : 'bad'), '', yes ? '使いどころ：材料から「作る値」。手で更新しない' : '困る：更新を 1 か所忘れると、合計が古いまま');
      const el = h('div', { style: { display: 'grid', gap: '8px' } }, h('div', { class: 'vsA-row' }, fp, fh), ft, note);
      const draw = () => { pv.textContent = S.people + ' 人'; hv.textContent = S.hours + ' 時間'; tv.textContent = yen(yes ? real() : S.shown); const stale = !yes && S.shown !== real(); hint.textContent = stale ? '← 古い！ 正しくは ' + yen(real()) : ''; cls(ft, stale ? 'bad' : ''); };
      const reset = () => { Object.assign(S, { people: 2, hours: 1, shown: 2 * RATE }); draw(); };
      reset();
      const act = async (what) => {
        const src = what === 'people' ? fp : fh;
        S[what]++; draw(); ctx.bump(src);
        await sleep(250);
        if (yes || what === 'people') {
          await ctx.fly(src, ft, what === 'people' ? 'people' : 'hours', what === 'people' ? '#5b9dff' : '#ffb454');
          S.shown = real(); draw(); ctx.bump(ft);
        }
      };
      return { el, reset, act };
    };

    /* ============ 3. watch ============ */
    const DB = { '相': ['山田 太郎', '佐藤 花子'], '相続': ['山田 太郎', '佐藤 花子'], '労働': ['鈴木 一郎', '高橋 美咲'] };
    const watSrcNo = [
      "let keyword = ''",
      '',
      'function onInput(e: Event) {',
      '  keyword = (e.target as HTMLInputElement).value',
      '  searchLawyers(keyword)',
      '}',
      'function onPickTag(tag: string) {',
      '  keyword = tag',
      '}',
    ].join('\n');
    const watSrcYes = [
      '<script setup lang="ts">',
      "import { ref, watch } from 'vue'",
      "const keyword = ref('')",
      'const lawyers = ref<Lawyer[]>([])',
      'watch(keyword, async (kw) => {',
      '  lawyers.value = await searchLawyers(kw)',
      '})',
      '</' + 'script>',
      '<template>',
      '  <input v-model="keyword" />',
      "  <button @click=\"keyword = '労働'\">労働</button>",
      '</template>',
    ].join('\n');

    const watUI = (yes) => (ctx) => {
      const S = { kw: '', calls: 0, list: null };
      const kv = h('b', { class: 'big' }), cv = h('b', { class: 'big' });
      const inp = div('vsA-fld', 'input', h('small', '検索'), kv);
      const tag = div('vsA-fld', 'tag', h('small', 'タグ'), '🏷 労働');
      const api = div('vsA-fld', 'api', h('small', 'API 呼び出し'), cv);
      const list = div('vsA-fld', 'list');
      const note = div('vsA-note ' + (yes ? 'ok' : 'bad'), '', yes ? '使いどころ：「変わったら、ついでに通信」' : '困る：呼ぶ場所が増えるほど、呼び忘れる');
      const el = h('div', { style: { display: 'grid', gap: '8px' } }, h('div', { class: 'vsA-row' }, inp, tag), api, list, note);
      const draw = () => {
        kv.textContent = S.kw ? '「' + S.kw + '」' : '（空）'; cv.textContent = S.calls + ' 回';
        const stale = !yes && S.kw && S.list !== S.kw;
        if (stale) { cls(list, 'bad'); list.textContent = '❌ 古いまま：' + (S.list ? '「' + S.list + '」の結果' : '（検索前）'); }
        else if (S.list) { cls(list, 'ok'); list.replaceChildren(...DB[S.list].map((n) => h('span', { class: 'vsA-li' }, '👤 ' + n))); }
        else { cls(list, ''); list.textContent = '📋 弁護士一覧　未検索'; }
      };
      const reset = () => { Object.assign(S, { kw: '', calls: 0, list: null }); draw(); };
      reset();
      const call = async (from) => { S.calls++; draw(); ctx.bump(api); await ctx.fly(from, list, 'API', yes ? '#2fd4a4' : '#ffb454'); S.list = S.kw; draw(); ctx.bump(list); };
      const act = async (what) => {
        if (what === 'type') {
          for (const v of ['相', '相続']) { S.kw = v; draw(); ctx.bump(inp); await sleep(300); await call(inp); }
        } else {
          S.kw = '労働'; draw(); ctx.bump(tag);
          await sleep(400);
          if (yes) await call(tag);
          else { ctx.banner('タグで変えたのに、検索が呼ばれていない…', 'bad'); }
        }
      };
      return { el, reset, act };
    };

    /* ============ 組み立て ============ */
    let busy = false;
    const guard = (fn) => async (ctx) => { if (busy) return; busy = true; try { await fn(ctx); } finally { busy = false; } };
    const both = (fn) => (ctx) => Promise.all(['without', 'with'].map((s) => fn(ctx.ui[s], s)));

    const SCENES = {
      'ライフサイクル': {
        lead: '画面が開いた直後に処理したい。<b>「いつ」呼ぶか</b>を Vue に任せる。',
        build: () => K.vs.versus({
          banner: '画面が開いた直後に、弁護士の一覧を取りたい。でも「いつ」呼べばいい？',
          bar: [
            { label: '▶ 画面を開く', primary: true, onclick: guard(async (ctx) => { ctx.reset(); await both((u) => u.run())(ctx); ctx.banner('左は勘で呼ぶから null。右は「できた直後」に確実に動く。', 'ok'); }) },
            { label: '⟲ 最初から', onclick: (ctx) => ctx.reset() },
          ],
          without: { title: 'ない場合：自分でタイミングを探す', file: 'lawyers.js', lang: 'js', src: lifeSrcNo, ui: lifeUI(false), keys: { box: ['box.focus()', "const box"], wait: ['setTimeout', '}, 100)'], list: ['fetchLawyers', 'list.innerHTML', 'const list'] } },
          with: { title: 'ある場合：onMounted', file: 'LawyerList.vue', lang: 'vue', src: lifeSrcYes, ui: lifeUI(true), keys: { box: ['searchBox'], hook: ['onMounted', '})'], list: ['lawyers'] } },
        }),
      },
      'computed：賢い計算': {
        lead: '材料から作る値は、<b>手で更新しない</b>。computed が自動で最新にする。',
        build: () => K.vs.versus({
          banner: '人数や時間を変えたら、合計金額も変わってほしい。手で計算し直す？',
          bar: [
            { label: '＋ 人数を増やす', primary: true, onclick: guard(async (ctx) => { await both((u) => u.act('people'))(ctx); ctx.banner('人数のほうは、どちらも合計が変わった。', ''); }) },
            { label: '＋ 時間を増やす', primary: true, onclick: guard(async (ctx) => { await both((u) => u.act('hours'))(ctx); ctx.banner('左だけ合計が古い。更新を忘れた関数があった。', 'bad'); }) },
            { label: '⟲ 最初から', onclick: (ctx) => ctx.reset() },
          ],
          without: { title: 'ない場合：毎回、手で再計算', file: 'estimate.ts', lang: 'ts', src: cmpSrcNo, ui: cmpUI(false), keys: { people: ['let people', 'people++'], hours: ['let hours', 'hours++'], total: ['total = calc()', 'return people'] } },
          with: { title: 'ある場合：computed', file: 'EstimateBox.vue', lang: 'vue', src: cmpSrcYes, ui: cmpUI(true), keys: { people: ['const people'], hours: ['const hours'], total: ['computed', '{{ total }}'] } },
        }),
      },
      'watch / watchEffect': {
        lead: '値が変わったら、ついでに通信。<b>呼び忘れ</b>を watch がなくす。',
        build: () => K.vs.versus({
          banner: '検索ワードが変わったら、API を呼びたい。変える場所ごとに手で呼ぶ？',
          bar: [
            { label: '⌨ 「相続」と入力', primary: true, onclick: guard(async (ctx) => { ctx.reset(); await both((u) => u.act('type'))(ctx); ctx.banner('入力のときは、どちらも検索できた。', ''); }) },
            { label: '🏷 タグ「労働」を押す', primary: true, onclick: guard(async (ctx) => { await both((u) => u.act('tag'))(ctx); await sleep(1300); ctx.banner('左だけ検索されない。onPickTag に呼び出しを書き忘れた。', 'bad'); }) },
            { label: '⟲ 最初から', onclick: (ctx) => ctx.reset() },
          ],
          without: { title: 'ない場合：変える所ごとに手で呼ぶ', file: 'search.ts', lang: 'ts', src: watSrcNo, ui: watUI(false), keys: { input: ['onInput', 'keyword = (e'], tag: ['onPickTag', 'keyword = tag'], api: ['searchLawyers'], list: ['searchLawyers'] } },
          with: { title: 'ある場合：watch', file: 'LawyerSearch.vue', lang: 'vue', src: watSrcYes, ui: watUI(true), keys: { input: ['v-model'], tag: ['@click'], api: ['watch(', 'searchLawyers'], list: ['lawyers.value'] } },
        }),
      },
    };

    TITLES.forEach((t) => {
      const sc = L.scenes.find((s) => s.t === t), def = SCENES[t];
      sc.lead = def.lead; sc.tag = sc.tag || { 'ライフサイクル': 'hooks', 'computed：賢い計算': 'computed', 'watch / watchEffect': 'watch' }[t];
      if (K.tsAnatSpecs) delete K.tsAnatSpecs[t];   /* 「まるごと解剖」が問題より先に出ないようにする */
      delete sc.why; delete sc.pickQuiz; delete sc.quiz; delete sc.gate;
      sc.render = (host) => { host.append(def.build()); };
    });
  }
})();
