/* vue-vs-d：vue-basics と x-vue-* の「新しい概念の導入シーン」を、
   「ない場合（左）」と「ある場合（右）」の左右比較（K.vs.versus）に置き換える。
   対象: vue-basics（ref を1つずつ / イベント処理 @click / v-model：双方向）
         x-vue-slots / x-vue-dynamic / x-vue-composables / x-vue-state / x-vue-api / x-vue-event(.prevent, .stop) */
(function () {
  'use strict';
  const K = window.KENSHU;
  const done = {};
  let tries = 0;
  (function wait() {
    if (K && K.lessons && K.W && K.vs && !done.go) { done.go = 1; install(); }
    if (!done.go && ++tries < 400) setTimeout(wait, 50);
  })();

  function install() {
    const { h, style } = K.W;
    style('vsD', `
    .vsD-box{background:#fff;border:2px solid #d5dcef;border-radius:10px;padding:10px 12px;display:grid;gap:8px;min-width:0}
    .vsD-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap;min-width:0}
    .vsD-lab{font:800 .85rem var(--font);color:#5b6788}
    .vsD-chip{font:800 .9rem var(--mono);padding:.25em .65em;border-radius:6px;background:#eef2fb;border:1.5px solid #cdd6ee;color:#1f2a44}
    .vsD-btn{border:0;border-radius:8px;padding:.5em 1em;background:#2f7bff;color:#fff;font:800 .9rem var(--font);cursor:pointer}
    .vsD-btn:hover{filter:brightness(1.1)}
    .vsD-btn.sub{background:#fff;color:#2f7bff;border:2px solid #2f7bff;padding:.4em .9em}
    .vsD-btn.red{background:#e5484d}
    .vsD-btn.on{background:#1d2b53}
    .vsD-in{font:700 .95rem var(--font);padding:.45em .7em;border-radius:8px;border:2px solid #b8c4e4;background:#fff;color:#1f2a44;min-width:0;width:100%;box-sizing:border-box}
    .vsD-raw{font:700 .85rem var(--mono);color:#c0262d;background:#fdecec;border-radius:6px;padding:.3em .5em;word-break:break-all}
    .vsD-badge{background:#ff6b6b;color:#fff;border-radius:99px;padding:.05em .6em;font:900 .8rem var(--font);margin-left:.4em}
    .vsD-li{padding:.35em .7em;border-radius:6px;background:#eef2fb;font:700 .92rem var(--font)}
    .vsD-bad{color:#c0262d;font-weight:900}.vsD-ok{color:#13805f;font-weight:900}
    .vsD-big{font:900 1.1rem var(--font)}
    .vsD-blank{min-height:84px;border:2px dashed #cdd6ee;border-radius:8px;display:grid;place-items:center;color:#8a93ad;font:700 .9rem var(--font);padding:8px;text-align:center}
    .vsD-cmp{border:2px dashed #9aa8cc;border-radius:10px;padding:8px;display:grid;gap:6px;background:#f9fbff;min-width:0}
    .vsD-tag{font:900 .85rem var(--mono);color:#1d2b53;padding:.1em .5em;border-radius:6px;background:#e1e8fb;justify-self:start}
    .vsD-tab{border:2px solid #b8c4e4;background:#fff;color:#1f2a44;border-radius:8px 8px 0 0;padding:.4em .9em;font:800 .9rem var(--font);cursor:pointer}
    .vsD-tab.on{background:#2f7bff;border-color:#2f7bff;color:#fff}
    .vsD-flash{animation:vsDf .8s}@keyframes vsDf{0%,60%{background:#fdecec;box-shadow:0 0 0 4px #e5484d}100%{}}
    `);

    const L = {};
    /* 他ファイルがシーン object を作り直すことがあるので、しばらく見張って、差し替わっていたら当て直す */
    const mine = new Set();
    if (K.anatFor) {
      if (K.anatFor.mine) { /* vue-viz-d の包みに相乗り */ K.anatFor.vsD = mine; const add = K.anatFor.mine; mine.add = (t) => add.add(t); }
      else { const orig = K.anatFor; K.anatFor = function (t) { return mine.has(t) ? null : orig.apply(this, arguments); }; K.anatFor.mine = mine; }
    }
    const swap = (id, title, patch) => {
      mine.add(title);
      let n = 0;
      (function go() {
        const les = K.lessons[id];
        const sc = les && les.scenes.find((s) => s.t === title);
        if (sc && sc.render !== patch.render) {
          delete sc.why; delete sc.gate; delete sc.pickQuiz; delete sc.quiz;
          Object.assign(sc, patch);
        }
        if (++n < 120) setTimeout(go, 100);
      })();
    };
    const J = (...a) => a.join('\n');
    const vs = (cfg) => (el) => el.append(K.vs.versus(cfg()));
    const bump = (ctx, n) => ctx.bump(n);
    const both = (ctx, m, ...a) => Promise.all([ctx.ui.without[m](...a), ctx.ui.with[m](...a)]);
    const resetBtn = { label: '⟲ 最初から', ghost: true, onclick: (ctx) => ctx.reset() };

    /* ============ vue-basics：ref を1つずつ ============ */
    swap('vue-basics', 'ref を1つずつ', {
      lead: '値を <code>ref</code> で包まないと、画面は変わらない。',
      render: vs(() => {
        const mk = (isRef) => (ctx) => {
          let n = 3;
          const view = h('b', { 'data-k': 'view', class: 'vsD-big' }, '3');
          const mem = h('span', { 'data-k': 'var', class: 'vsD-chip' }, '3');
          const btn = h('button', { 'data-k': 'btn', class: 'vsD-btn' }, '予約する');
          const press = async () => {
            if (n <= 0) return;
            n--; mem.textContent = n; ctx.bump(mem);
            await ctx.fly(btn, mem, '−1', '#ffb454');
            if (isRef) { await ctx.fly(mem, view, '再描画', '#2fd4a4'); view.textContent = n; ctx.bump(view); }
          };
          btn.onclick = press;
          return {
            press, n: () => n,
            reset() { n = 3; view.textContent = 3; mem.textContent = 3; },
            el: h('div', { class: 'vsD-box' },
              h('div', { class: 'vsD-row' }, h('span', { class: 'vsD-lab' }, '画面'), h('span', { class: 'vsD-big' }, '残り ', view, ' 枠')),
              h('div', { class: 'vsD-row' }, h('span', { class: 'vsD-lab' }, '値 slots'), mem),
              btn),
          };
        };
        return {
          banner: '値を減らしたのに、画面の「残り」が変わらない？',
          bar: [
            { label: '▶ 予約する を押す', primary: true, onclick: async (ctx) => { await both(ctx, 'press'); const n = ctx.ui.without.n(); ctx.banner('左：値は ' + n + ' なのに、画面は 3 のまま。右：画面も ' + n, 'warn'); } },
            resetBtn,
          ],
          without: {
            title: 'ない場合：ふつうの変数', file: 'ReservePage.vue', lang: 'vue',
            src: J('<script setup lang="ts">', 'let slots: number = 3', '', 'const take = (): void => {', '  slots = slots - 1', '}', '</script>', '', '<template>', '  <p>残り {{ slots }} 枠</p>', '  <button @click="take">予約する</button>', '</template>'),
            ui: mk(false),
            keys: { var: ['let slots'], btn: ['@click', 'slots = slots - 1'], view: ['{{ slots }}'] },
          },
          with: {
            title: 'ある場合：ref で包む', file: 'ReservePage.vue', lang: 'vue',
            src: J('<script setup lang="ts">', 'import { ref } from \'vue\'', '', 'const slots = ref<number>(3)', '', 'const take = (): void => {', '  slots.value--', '}', '</script>', '', '<template>', '  <p>残り {{ slots }} 枠</p>', '  <button @click="take">予約する</button>', '</template>'),
            ui: mk(true),
            keys: { var: ['ref<number>'], btn: ['@click', 'slots.value--'], view: ['{{ slots }}'] },
          },
        };
      }),
    });

    /* ============ vue-basics：イベント処理 @click ============ */
    swap('vue-basics', 'イベント処理 @click', {
      lead: 'ボタンの動きを、HTML に直接書ける。',
      render: vs(() => {
        const mk = (vue) => (ctx) => {
          let n = 0;
          const cnt = h('b', { 'data-k': 'count', class: 'vsD-big' }, '0');
          const add = h('button', { 'data-k': 'add', class: 'vsD-btn' }, '予約する');
          const sub = h('button', { 'data-k': 'sub', class: 'vsD-btn sub' }, '取り消す');
          const lamp = (b) => ctx.bump(b);
          const go = async (btn, d, alive) => {
            lamp(btn);
            if (!alive) { btn.classList.remove('vsD-flash'); void btn.offsetWidth; btn.classList.add('vsD-flash'); return false; }
            n = Math.max(0, n + d); cnt.textContent = n; await ctx.fly(btn, cnt, d > 0 ? '+1' : '−1', d > 0 ? '#2fd4a4' : '#ffb454'); ctx.bump(cnt); return true;
          };
          add.onclick = () => go(add, 1, true);
          sub.onclick = () => go(sub, -1, vue);
          return {
            press: async () => { await go(add, 1, true); await ctx.sleep(300); return go(sub, -1, vue); },
            reset() { n = 0; cnt.textContent = 0; },
            el: h('div', { class: 'vsD-box' },
              h('div', { class: 'vsD-row' }, h('span', { class: 'vsD-lab' }, '画面'), h('span', { class: 'vsD-big' }, '予約 ', cnt, ' 件')),
              h('div', { class: 'vsD-row' }, add, sub)),
          };
        };
        return {
          banner: 'ボタンを2つ。「取り消す」も動かしたい。',
          bar: [
            { label: '▶ 予約する → 取り消す', primary: true, onclick: async (ctx) => { await both(ctx, 'press'); ctx.banner('左：「取り消す」だけ無反応（書き足していない）。右：どちらも動く', 'warn'); } },
            resetBtn,
          ],
          without: {
            title: 'ない場合：id を探して登録', file: 'main.ts', lang: 'ts',
            src: J('const addBtn = document.getElementById(\'add-btn\')', 'const label = document.getElementById(\'count\')', 'let count: number = 0', '', 'addBtn?.addEventListener(\'click\', () => {', '  count++', '  label!.textContent = String(count)', '})'),
            ui: mk(false),
            keys: { add: ['getElementById(\'add-btn\')', 'addEventListener'], count: ['getElementById(\'count\')', 'textContent'], sub: [] },
          },
          with: {
            title: 'ある場合：@click', file: 'ReservePage.vue', lang: 'vue',
            src: J('<script setup lang="ts">', 'import { ref } from \'vue\'', '', 'const count = ref<number>(0)', '</script>', '', '<template>', '  <p>予約 {{ count }} 件</p>', '  <button @click="count++">予約する</button>', '  <button @click="count--">取り消す</button>', '</template>'),
            ui: mk(true),
            keys: { add: ['count++'], sub: ['count--'], count: ['{{ count }}'] },
          },
        };
      }),
    });

    /* ============ vue-basics：v-model ============ */
    swap('vue-basics', 'v-model：双方向', {
      lead: '入力欄と変数を、1行でつなぐ。',
      render: vs(() => {
        const mk = (vm) => (ctx) => {
          let val = '';
          const inp = h('input', { class: 'vsD-in', 'data-k': 'input', placeholder: 'お名前' });
          const mem = h('span', { class: 'vsD-chip', 'data-k': 'var' }, '""');
          const out = h('b', { 'data-k': 'out' }, '　');
          const sync = () => { mem.textContent = JSON.stringify(val); out.textContent = val || '　'; };
          inp.addEventListener('input', () => { val = inp.value; sync(); });
          const typeIn = async (text) => {
            inp.value = ''; val = ''; sync();
            for (let i = 1; i <= text.length; i++) { inp.value = text.slice(0, i); val = inp.value; sync(); await ctx.sleep(120); }
            ctx.bump(mem);
            await ctx.fly(inp, mem, vm ? 'v-model' : '@input', '#5b9dff');
            ctx.bump(out);
          };
          const setVar = async (text) => {
            val = text; sync(); ctx.bump(mem);
            await ctx.fly(mem, inp, vm ? 'v-model' : ':value', '#ff6b9d');
            inp.value = text; ctx.bump(inp);
          };
          const wires = vm ? h('div', { class: 'vsD-row' }, h('span', { class: 'vsD-lab' }, '配線'), h('span', { class: 'vsD-chip' }, 'v-model ⇄ 1本'))
            : h('div', { class: 'vsD-row' }, h('span', { class: 'vsD-lab' }, '配線'), h('span', { class: 'vsD-chip' }, '@input → 変数'), h('span', { class: 'vsD-chip' }, ':value → 入力欄'));
          return {
            typeIn, setVar,
            reset() { inp.value = ''; val = ''; sync(); },
            el: h('div', { class: 'vsD-box' }, inp, h('div', { class: 'vsD-row' }, h('span', { class: 'vsD-lab' }, '変数 name'), mem), h('div', { class: 'vsD-big' }, out, ' さん、ご相談ですね'), wires),
          };
        };
        return {
          banner: '入力欄と変数を、どうやって同期させる？',
          bar: [
            { label: '▶ 入力欄に「山田 太郎」', primary: true, onclick: async (ctx) => { await both(ctx, 'typeIn', '山田 太郎'); ctx.banner('入力 → 変数。左は @input を自分で書いた', 'warn'); } },
            { label: '変数を「田中 花子」に', onclick: async (ctx) => { await both(ctx, 'setVar', '田中 花子'); ctx.banner('変数 → 入力欄。左は :value も書いた。右は同じ v-model', 'ok'); } },
            resetBtn,
          ],
          without: {
            title: 'ない場合：2本の配線を手書き', file: 'NameForm.vue', lang: 'vue',
            src: J('<script setup lang="ts">', 'import { ref } from \'vue\'', '', 'const name = ref<string>(\'\')', '', 'const onInput = (e: Event): void => {', '  name.value = (e.target as HTMLInputElement).value', '}', '</script>', '', '<template>', '  <input', '    :value="name"', '    @input="onInput"', '  />', '  <p>{{ name }} さん、ご相談ですね</p>', '</template>'),
            ui: mk(false),
            keys: { input: [':value="name"', '@input="onInput"', 'const onInput', 'e.target'], var: ['ref<string>'], out: ['{{ name }}'] },
          },
          with: {
            title: 'ある場合：v-model', file: 'NameForm.vue', lang: 'vue',
            src: J('<script setup lang="ts">', 'import { ref } from \'vue\'', '', 'const name = ref<string>(\'\')', '</script>', '', '<template>', '  <input v-model="name" />', '  <p>{{ name }} さん、ご相談ですね</p>', '</template>'),
            ui: mk(true),
            keys: { input: ['v-model="name"'], var: ['ref<string>'], out: ['{{ name }}'] },
          },
        };
      }),
    });

    /* ============ x-vue-slots：穴あきカード ============ */
    swap('x-vue-slots', '穴あきカード', {
      lead: '見た目（HTML）は、props では渡せない。',
      render: vs(() => {
        const mk = (slot) => (ctx) => {
          const title = h('h3', { 'data-k': 'title', style: { margin: 0, font: '900 1.05rem var(--font)' } }, '労働問題の相談');
          const foot = h('div', { 'data-k': 'footer', class: 'vsD-row', style: { minHeight: '34px' } }, h('span', { class: 'vsD-lab' }, '（フッターは空）'));
          const pass = h('span', { 'data-k': 'pass', class: 'vsD-chip' }, '<b>NEW</b> ＋ <button>×2</button>');
          const card = h('div', { class: 'vsD-box', 'data-k': 'card', style: { borderColor: '#2f7bff' } }, title, h('p', { style: { margin: 0, font: '700 .9rem var(--font)' } }, '未払い残業代について、弁護士に相談できます。'), foot);
          return {
            put: async () => {
              await ctx.fly(pass, card, 'HTML', slot ? '#2fd4a4' : '#ff6b9d');
              if (slot) {
                title.replaceChildren('労働問題の相談', h('span', { class: 'vsD-badge' }, 'NEW'));
                foot.replaceChildren(h('button', { class: 'vsD-btn' }, '相談する'), h('button', { class: 'vsD-btn sub' }, '予約する'));
              } else {
                title.replaceChildren('労働問題の相談 ', h('span', { class: 'vsD-raw' }, '<b>NEW</b>'));
                foot.replaceChildren(h('span', { class: 'vsD-raw' }, '<button>相談する</button><button>予約する</button>'));
              }
              ctx.bump(card);
            },
            reset() { title.textContent = '労働問題の相談'; foot.replaceChildren(h('span', { class: 'vsD-lab' }, '（フッターは空）')); },
            el: h('div', { class: 'vsD-box', style: { background: 'transparent', border: 0, padding: 0 } }, h('div', { class: 'vsD-row' }, h('span', { class: 'vsD-lab' }, '渡したい'), pass), card),
          };
        };
        return {
          banner: 'カードに「NEW バッジ」と「ボタン2つ」を入れたい。',
          bar: [
            { label: '▶ カードに渡す', primary: true, onclick: async (ctx) => { await both(ctx, 'put'); ctx.banner('左：HTML が文字のまま出た。右：そのまま差し込めた', 'warn'); } },
            resetBtn,
          ],
          without: {
            title: 'ない場合：props（文字列）で渡す', file: 'CaseCard.vue ＋ 使う側', lang: 'vue',
            src: J('<script setup lang="ts">', 'defineProps<{ title: string; action: string }>()', '</script>', '', '<template>', '  <h3>{{ title }}</h3>', '  <div>{{ action }}</div>', '</template>', '', '<CaseCard', '  title="労働問題の相談 <b>NEW</b>"', '  action="<button>相談する</button>"', '/>'),
            ui: mk(false),
            keys: { title: ['{{ title }}', 'title="労働'], footer: ['{{ action }}', 'action="<button>'], pass: ['<b>NEW</b>'], card: ['defineProps'] },
          },
          with: {
            title: 'ある場合：slot（穴）を空ける', file: 'CaseCard.vue ＋ 使う側', lang: 'vue',
            src: J('<template>', '  <h3><slot name="title" /></h3>', '  <div><slot name="footer" /></div>', '</template>', '', '<CaseCard>', '  <template #title>', '    労働問題の相談 <b>NEW</b>', '  </template>', '  <template #footer>', '    <button>相談する</button>', '  </template>', '</CaseCard>'),
            ui: mk(true),
            keys: { title: ['<slot name="title" />', '<template #title>', '<b>NEW</b>'], footer: ['<slot name="footer" />', '<template #footer>', '<button>'], pass: ['<b>NEW</b>'], card: ['<CaseCard>'] },
          },
        };
      }),
    });

    /* ============ x-vue-dynamic：<component :is> ============ */
    swap('x-vue-dynamic', '<component :is> で切り替え', {
      lead: 'タブが増えるたびに、v-if を書き足す？',
      render: vs(() => {
        const TABS = ['プロフィール', '相談一覧', '設定', '請求'];
        const BODY = ['お名前・連絡先', '未払い残業代の相談 ほか', '通知の受け取り', '今月のご請求'];
        const mk = (isIs) => (ctx) => {
          let cur = 0;
          const body = h('div', { 'data-k': 'view', class: 'vsD-blank', style: { color: '#1f2a44' } }, BODY[0]);
          const tabs = TABS.map((t, i) => h('button', { 'data-k': 'tabs', class: 'vsD-tab' + (i === 0 ? ' on' : '') }, t));
          const select = async (i) => {
            cur = i; tabs.forEach((b, j) => b.classList.toggle('on', j === i));
            await ctx.fly(tabs[i], body, ['v-if', ':is'][+isIs], isIs ? '#2fd4a4' : '#ffb454');
            if (!isIs && i === 3) { body.textContent = '（空白）v-if の行がない'; body.className = 'vsD-blank vsD-bad'; }
            else { body.textContent = BODY[i]; body.className = 'vsD-blank'; body.style.color = '#1f2a44'; }
            ctx.bump(body);
          };
          tabs.forEach((b, i) => { b.onclick = () => select(i); });
          return {
            run: async () => { for (let i = 0; i < 4; i++) { await select(i); await ctx.sleep(250); } },
            reset() { cur = 0; tabs.forEach((b, j) => b.classList.toggle('on', j === 0)); body.textContent = BODY[0]; body.className = 'vsD-blank'; },
            el: h('div', { class: 'vsD-box' }, h('div', { class: 'vsD-row', style: { gap: '4px' } }, ...tabs), body),
          };
        };
        return {
          banner: '4つ目のタブ「請求」を足した。ちゃんと動く？',
          bar: [
            { label: '▶ タブを順に押す', primary: true, onclick: async (ctx) => { await both(ctx, 'run'); ctx.banner('左：「請求」だけ空白（v-if を足し忘れ）。右：map に1行で済んだ', 'warn'); } },
            resetBtn,
          ],
          without: {
            title: 'ない場合：v-if の連打', file: 'TabPage.vue', lang: 'vue',
            src: J('<script setup lang="ts">', 'import { ref } from \'vue\'', 'const tab = ref<string>(\'Profile\')', '</script>', '', '<template>', '  <ProfileTab v-if="tab === \'Profile\'" />', '  <CasesTab v-else-if="tab === \'Cases\'" />', '  <SettingsTab v-else-if="tab === \'Settings\'" />', '</template>'),
            ui: mk(false),
            keys: { tabs: ['v-if="tab', 'v-else-if="tab === \'Cases\'"', 'v-else-if="tab === \'Settings\'"'], view: ['<ProfileTab', '<CasesTab', '<SettingsTab'] },
          },
          with: {
            title: 'ある場合：<component :is>', file: 'TabPage.vue', lang: 'vue',
            src: J('<script setup lang="ts">', 'import { ref } from \'vue\'', '', 'const tabs = {', '  Profile: ProfileTab,', '  Cases: CasesTab,', '  Settings: SettingsTab,', '  Billing: BillingTab,', '}', 'const tab = ref<keyof typeof tabs>(\'Profile\')', '</script>', '', '<template>', '  <component :is="tabs[tab]" />', '</template>'),
            ui: mk(true),
            keys: { tabs: ['Profile: ProfileTab', 'Cases: CasesTab', 'Settings: SettingsTab', 'Billing: BillingTab'], view: ['<component :is'] },
          },
        };
      }),
    });

    /* ============ x-vue-composables：コピペをやめよう ============ */
    swap('x-vue-composables', 'コピペをやめよう', {
      lead: '同じロジックをコピペすると、直すのも2回。',
      render: vs(() => {
        const mk = (shared) => (ctx) => {
          const steps = shared ? [2, 2] : [2, 1];
          const cmps = ['見積の数量', '予約の人数'].map((n, i) => {
            const cnt = h('b', { class: 'vsD-big' }, '0'); let c = 0;
            const btn = h('button', { 'data-k': 'c' + i, class: 'vsD-btn' }, '＋');
            const press = async () => { c += steps[i]; cnt.textContent = c; ctx.bump(cnt); await ctx.fly(btn, cnt, '+' + steps[i], steps[i] === 2 ? '#2fd4a4' : '#ff6b9d'); };
            btn.onclick = press;
            return { press, reset() { c = 0; cnt.textContent = 0; }, el: h('div', { class: 'vsD-box', style: { justifyItems: 'start' } }, h('span', { class: 'vsD-lab' }, n), h('div', { class: 'vsD-row' }, cnt, btn)) };
          });
          return {
            run: async () => { await Promise.all(cmps.map((c) => c.press())); },
            reset() { cmps.forEach((c) => c.reset()); },
            el: h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '10px' } }, ...cmps.map((c) => c.el)),
          };
        };
        return {
          banner: '仕様変更：「＋」は 1回で 2 増やす。直したのに…？',
          bar: [
            { label: '▶ 両方の「＋」を押す', primary: true, onclick: async (ctx) => { await both(ctx, 'run'); ctx.banner('左：直し忘れで 2 と 1。右：1か所の修正で、どちらも 2', 'warn'); } },
            resetBtn,
          ],
          without: {
            title: 'ない場合：部品ごとにコピペ', file: 'QuoteCounter.vue ／ GuestCounter.vue', lang: 'vue',
            src: J('// QuoteCounter.vue', 'const count = ref<number>(0)', 'const inc = (): void => { count.value += 2 }', '', '// GuestCounter.vue', 'const count = ref<number>(0)', 'const inc = (): void => { count.value += 1 }'),
            ui: mk(false),
            keys: { c0: ['count.value += 2'], c1: ['count.value += 1'] },
          },
          with: {
            title: 'ある場合：composable に切り出す', file: 'useCounter.ts ＋ 2つの部品', lang: 'ts',
            src: J('// composables/useCounter.ts', 'export const useCounter = () => {', '  const count = ref<number>(0)', '  const inc = (): void => { count.value += 2 }', '  return { count, inc }', '}', '', '// QuoteCounter.vue ／ GuestCounter.vue', 'const { count, inc } = useCounter()'),
            ui: mk(true),
            keys: { c0: ['count.value += 2', 'const { count, inc }'], c1: ['count.value += 2', 'const { count, inc }'] },
          },
        };
      }),
    });

    /* ============ x-vue-state：部品どうしの通信 ============ */
    swap('x-vue-state', '誰が誰に話しかける？', {
      lead: '遠くの部品に伝えるのに、何回バケツリレーする？',
      render: vs(() => {
        const mk = (store) => (ctx) => {
          let n = 3;
          const num = h('b', { 'data-k': 'header', class: 'vsD-chip' }, '未読 3');
          const tag = (t, k) => h('span', { class: 'vsD-tag', 'data-k': k }, t);
          const tApp = tag('App', 'app'), tMain = tag('Main', 'relay'), tList = tag('NoticeList', 'relay'), tItem = tag('NoticeItem', 'item');
          const btn = h('button', { 'data-k': 'item', class: 'vsD-btn' }, '既読にする');
          const tStore = h('span', { class: 'vsD-tag', 'data-k': 'store', style: { background: '#ffe9bf' } }, 'Store (Pinia)');
          const header = h('div', { class: 'vsD-cmp', style: { alignSelf: 'start' } }, tag('Header', 'header'), num);
          const nest = h('div', { class: 'vsD-cmp' }, tMain, h('div', { class: 'vsD-cmp' }, tList, h('div', { class: 'vsD-cmp' }, tItem, btn)));
          const app = h('div', { class: 'vsD-cmp' }, store ? h('div', { class: 'vsD-row' }, tApp, tStore) : tApp, h('div', { style: { display: 'grid', gridTemplateColumns: 'minmax(0,.7fr) minmax(0,1.3fr)', gap: '8px' } }, header, nest));
          const press = async () => {
            if (n <= 0) return;
            n--;
            const upd = () => { num.textContent = '未読 ' + n; ctx.bump(num); };
            if (store) {
              const a = ctx.fly(btn, tStore, 'read()', '#ffb454'); await ctx.sleep(500);
              await a; await ctx.fly(tStore, num, 'unread', '#2fd4a4'); upd();
            } else {
              const hops = [[btn, tList, 'emit'], [tList, tMain, 'emit'], [tMain, tApp, 'emit'], [tApp, num, 'props']];
              let last;
              for (const [a, b, t] of hops) { last = ctx.fly(a, b, t, t === 'props' ? '#2fd4a4' : '#ffb454'); await ctx.sleep(550); }
              await last; upd();
            }
          };
          btn.onclick = press;
          return { press, hops: () => 0, reset() { n = 3; num.textContent = '未読 3'; }, el: app };
        };
        return {
          banner: '「既読にする」を押すと、遠くの Header の件数を減らしたい。',
          bar: [
            { label: '▶ 既読にする', primary: true, onclick: async (ctx) => { await both(ctx, 'press'); ctx.banner('左：4回の受け渡し（中継の2部品も修正が必要）。右：2回', 'warn'); } },
            resetBtn,
          ],
          without: {
            title: 'ない場合：props / emit のバケツリレー', file: '4つの部品', lang: 'vue',
            src: J('// NoticeItem.vue', 'const emit = defineEmits<{ read: [] }>()', '<button @click="emit(\'read\')">既読にする</button>', '', '// NoticeList.vue ／ Main.vue（中継するだけ）', 'const emit = defineEmits<{ read: [] }>()', '<NoticeItem @read="emit(\'read\')" />', '', '// App.vue', 'const unread = ref<number>(3)', '<Header :unread="unread" />', '<Main @read="unread--" />'),
            ui: mk(false),
            keys: { item: ['<button @click="emit(\'read\')">'], relay: ['<NoticeItem @read="emit(\'read\')" />'], app: ['const unread', '@read="unread--"'], header: ['<Header :unread'] },
          },
          with: {
            title: 'ある場合：共有ステート（Pinia）', file: '3つのファイル', lang: 'vue',
            src: J('// stores/notice.ts', 'export const useNotice = defineStore(\'notice\', () => {', '  const unread = ref<number>(3)', '  const read = (): void => { unread.value-- }', '  return { unread, read }', '})', '', '// NoticeItem.vue', '<button @click="notice.read()">既読にする</button>', '', '// Header.vue', '<span>未読 {{ notice.unread }}</span>'),
            ui: mk(true),
            keys: { item: ['notice.read()'], store: ['defineStore', 'unread.value--'], header: ['{{ notice.unread }}'] },
          },
        };
      }),
    });

    /* ============ x-vue-api：fetch と3つの状態 ============ */
    swap('x-vue-api', 'fetch と3つの状態', {
      lead: '通信中・失敗のとき、画面は何を出す？',
      render: vs(() => {
        const TITLES = ['未払い残業代の相談', '契約書チェックの依頼', '交通事故の示談'];
        const mk = (safe) => (ctx) => {
          let gen = 0;
          const btn = h('button', { 'data-k': 'btn', class: 'vsD-btn' }, '相談を取得');
          const srv = h('span', { 'data-k': 'server', class: 'vsD-chip' }, 'サーバー');
          const area = h('div', { 'data-k': 'list', class: 'vsD-blank', style: { alignContent: 'start', justifyItems: 'stretch', textAlign: 'left' } });
          const con = h('div', { class: 'vsD-bad', style: { fontSize: '.85rem', lineHeight: '1.5', minHeight: '1.5em' } });
          const show = (kind, node) => { area.className = 'vsD-blank'; area.style.color = kind === 'err' ? '#c0262d' : '#1f2a44'; if (kind === 'list') { area.className = 'vsD-box'; area.style.border = '0'; area.style.padding = '0'; } if (kind !== 'list') area.style.border = ''; area.replaceChildren(node); };
          const clear = () => { area.className = 'vsD-blank'; area.style.border = ''; area.style.color = ''; area.replaceChildren('（なにも出ていない）'); con.textContent = ''; };
          const load = async (ok) => {
            const g = ++gen; con.textContent = '';
            if (safe) { area.dataset.state = 'loading'; const l = h('span', { 'data-k': 'loading', class: 'vsD-big' }, '読み込み中…'); show('x', l); } else clear();
            await ctx.fly(btn, srv, '/api/cases', '#5b9dff');
            await ctx.sleep(700); if (g !== gen) return;
            await ctx.fly(srv, area, ok ? '200' : '500', ok ? '#2fd4a4' : '#ff6b6b');
            if (g !== gen) return;
            if (ok) { show('list', h('div', { style: { display: 'grid', gap: '6px' } }, ...TITLES.map((t) => h('div', { class: 'vsD-li' }, t)))); }
            else if (safe) { const er = h('span', { 'data-k': 'error', class: 'vsD-bad' }, '失敗：HTTP 500'); show('err', er); }
            else { clear(); con.textContent = 'Uncaught (in promise) — 画面は空のまま'; }
            ctx.bump(area);
          };
          return {
            ok: () => load(true), ng: () => load(false),
            reset() { gen++; clear(); },
            el: h('div', { class: 'vsD-box' }, h('div', { class: 'vsD-row' }, btn, srv), area, con),
            init: clear,
          };
        };
        return {
          banner: '「相談を取得」を押したあと、通信中・失敗のとき画面は？',
          bar: [
            { label: '▶ 取得する（成功）', primary: true, onclick: async (ctx) => { ctx.banner('左：待つあいだ画面が空。右：「読み込み中…」が出る', 'warn'); await both(ctx, 'ok'); ctx.banner('どちらも取得できた。次は失敗を試そう', 'ok'); } },
            { label: '✕ 取得する（失敗）', onclick: async (ctx) => { await both(ctx, 'ng'); ctx.banner('左：失敗に気づけない。右：失敗の表示が出る', 'warn'); } },
            resetBtn,
          ],
          without: {
            title: 'ない場合：結果を待つだけ', file: 'CaseList.vue', lang: 'vue',
            src: J('<script setup lang="ts">', 'const cases = ref<Case[]>([])', '', 'const load = async (): Promise<void> => {', '  const res = await fetch(\'/api/cases\')', '  cases.value = await res.json()', '}', '</script>', '', '<template>', '  <button @click="load">相談を取得</button>', '  <ul>', '    <li v-for="c in cases" :key="c.id">{{ c.title }}</li>', '  </ul>', '</template>'),
            ui: (ctx) => { const u = mk(false)(ctx); u.init(); return u; },
            keys: { btn: ['@click="load"'], server: ['fetch(\'/api/cases\')'], list: ['v-for="c in cases"', 'cases.value ='] },
          },
          with: {
            title: 'ある場合：loading / error / data', file: 'CaseList.vue', lang: 'vue',
            src: J('<script setup lang="ts">', 'const cases = ref<Case[]>([])', 'const loading = ref<boolean>(false)', 'const error = ref<string | null>(null)', '', 'const load = async (): Promise<void> => {', '  loading.value = true', '  error.value = null', '  try {', '    const res = await fetch(\'/api/cases\')', '    if (!res.ok) throw new Error(`HTTP ${res.status}`)', '    cases.value = await res.json()', '  } catch (e) {', '    error.value = e instanceof Error ? e.message : \'失敗\'', '  } finally {', '    loading.value = false', '  }', '}', '</script>', '', '<template>', '  <button @click="load">相談を取得</button>', '  <p v-if="loading">読み込み中…</p>', '  <p v-else-if="error">失敗：{{ error }}</p>', '  <ul v-else>', '    <li v-for="c in cases" :key="c.id">{{ c.title }}</li>', '  </ul>', '</template>'),
            ui: (ctx) => { const u = mk(true)(ctx); u.init(); return u; },
            keys: { btn: ['@click="load"'], server: ['fetch(\'/api/cases\')', 'res.ok'], loading: ['v-if="loading"', 'loading.value ='], error: ['v-else-if="error"', 'error.value ='], list: ['<ul v-else>', 'cases.value ='] },
          },
        };
      }),
    });

    /* ============ x-vue-event：.prevent / .stop ============ */
    swap('x-vue-event', '.prevent：ふだんの動きを止める', {
      lead: 'フォームを送ると、ブラウザはページを読み込み直す。',
      render: vs(() => {
        const mk = (prevent) => (ctx) => {
          let items = [];
          const inp = h('input', { class: 'vsD-in', placeholder: '相談内容' });
          const send = h('button', { 'data-k': 'form', class: 'vsD-btn', type: 'submit' }, '送信');
          const list = h('div', { 'data-k': 'list', style: { display: 'grid', gap: '6px', minHeight: '56px', alignContent: 'start' } });
          const stamp = h('div', { class: 'vsD-bad', style: { minHeight: '1.5em', lineHeight: '1.5', fontSize: '.9rem' } });
          const draw = () => { list.replaceChildren(...(items.length ? items.map((t) => h('div', { class: 'vsD-li' }, '受付：' + t)) : [h('span', { class: 'vsD-lab' }, '（まだ受付なし）')])); };
          draw();
          const box = h('div', { class: 'vsD-box' });
          const form = h('form', { class: 'vsD-row', style: { flexWrap: 'nowrap' }, onsubmit: (e) => { e.preventDefault(); submit(); } }, inp, send);
          const submit = async () => {
            const t = inp.value.trim(); if (!t) return;
            await ctx.fly(send, list, '送信', prevent ? '#2fd4a4' : '#ffb454');
            if (prevent) { items.push(t); inp.value = ''; draw(); ctx.bump(list); stamp.textContent = ''; }
            else { stamp.textContent = '↻ ページが再読み込みされた'; box.classList.remove('vsD-flash'); void box.offsetWidth; box.classList.add('vsD-flash'); inp.value = ''; items = []; draw(); }
          };
          box.append(form, list, stamp);
          return {
            run: async () => { for (const t of ['残業代の相談', '契約書の確認']) { inp.value = t; await ctx.sleep(300); await submit(); await ctx.sleep(300); } },
            reset() { items = []; inp.value = ''; draw(); stamp.textContent = ''; },
            el: box,
          };
        };
        return {
          banner: '「送信」を押したら、入力も一覧も消えた。',
          bar: [
            { label: '▶ 2件、送信する', primary: true, onclick: async (ctx) => { await both(ctx, 'run'); ctx.banner('左：送るたびに再読み込みで一覧が消える。右：一覧が残る', 'warn'); } },
            resetBtn,
          ],
          without: {
            title: 'ない場合：そのまま送信', file: 'ConsultForm.vue', lang: 'vue',
            src: J('<script setup lang="ts">', 'const items = ref<string[]>([])', 'const text = ref<string>(\'\')', '', 'const send = (): void => {', '  items.value.push(text.value)', '}', '</script>', '', '<template>', '  <form @submit="send">', '    <input v-model="text" />', '    <button type="submit">送信</button>', '  </form>', '</template>'),
            ui: mk(false),
            keys: { form: ['<form @submit="send">'], list: ['items.value.push'] },
          },
          with: {
            title: 'ある場合：.prevent', file: 'ConsultForm.vue', lang: 'vue',
            src: J('<script setup lang="ts">', 'const items = ref<string[]>([])', 'const text = ref<string>(\'\')', '', 'const send = (): void => {', '  items.value.push(text.value)', '}', '</script>', '', '<template>', '  <form @submit.prevent="send">', '    <input v-model="text" />', '    <button type="submit">送信</button>', '  </form>', '</template>'),
            ui: mk(true),
            keys: { form: ['<form @submit.prevent="send">'], list: ['items.value.push'] },
          },
        };
      }),
    });

    swap('x-vue-event', '.stop：上へ伝わるのを止める', {
      lead: '内側のボタンを押すと、外側のクリックまで動く。',
      render: vs(() => {
        const mk = (stop) => (ctx) => {
          let del = 0, opened = 0;
          const dc = h('b', {}, '0'), oc = h('b', {}, '0');
          const btn = h('button', { 'data-k': 'btn', class: 'vsD-btn red' }, '削除');
          const title = h('span', { class: 'vsD-big' }, '未払い残業代の相談');
          const card = h('div', { 'data-k': 'card', class: 'vsD-row', style: { justifyContent: 'space-between', padding: '10px 12px', border: '2px solid #b8c4e4', borderRadius: '10px', background: '#f9fbff' } }, title, btn);
          const detail = h('div', { class: 'vsD-chip' }, '詳細を開いた回数 ', oc);
          const dele = h('div', { class: 'vsD-chip' }, '削除した回数 ', dc);
          const press = async () => {
            del++; dc.textContent = del; ctx.bump(dc);
            if (!stop) { await ctx.fly(btn, card, '↑ 伝わる', '#ff6b6b'); opened++; oc.textContent = opened; ctx.bump(detail); detail.classList.remove('vsD-flash'); void detail.offsetWidth; detail.classList.add('vsD-flash'); }
          };
          btn.onclick = press;
          return { press, reset() { del = opened = 0; dc.textContent = 0; oc.textContent = 0; }, el: h('div', { class: 'vsD-box' }, card, h('div', { class: 'vsD-row' }, dele, detail)) };
        };
        return {
          banner: '「削除」だけ押したいのに、詳細まで開いてしまう。',
          bar: [
            { label: '▶ 「削除」を押す', primary: true, onclick: async (ctx) => { await both(ctx, 'press'); ctx.banner('左：詳細も開いた（クリックが外側へ伝わる）。右：削除だけ', 'warn'); } },
            resetBtn,
          ],
          without: {
            title: 'ない場合：そのまま', file: 'CaseRow.vue', lang: 'vue',
            src: J('<template>', '  <li @click="openDetail(c)">', '    {{ c.title }}', '    <button @click="remove(c)">削除</button>', '  </li>', '</template>'),
            ui: mk(false),
            keys: { btn: ['@click="remove(c)"'], card: ['@click="openDetail(c)"'] },
          },
          with: {
            title: 'ある場合：.stop', file: 'CaseRow.vue', lang: 'vue',
            src: J('<template>', '  <li @click="openDetail(c)">', '    {{ c.title }}', '    <button @click.stop="remove(c)">削除</button>', '  </li>', '</template>'),
            ui: mk(true),
            keys: { btn: ['@click.stop="remove(c)"'], card: ['@click="openDetail(c)"'] },
          },
        };
      }),
    });
  }
})();
