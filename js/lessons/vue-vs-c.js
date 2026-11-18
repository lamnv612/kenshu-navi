/* vue-router / vue-test / vue-env の概念導入シーンを、K.vs.versus（ない場合 ⇄ ある場合）で作り直す。
   URL・履歴はすべてウィジェットの中だけで持つ（アプリ本体の location.hash には触れない）。 */
(function () {
  'use strict';
  const K = window.KENSHU;
  if (!K || !K.W) return;
  const { h, style, sleep } = K.W;

  style('vsC', `
  .vsC-br{border:2px solid #c3cbe0;border-radius:10px;background:#fff;overflow:hidden;color:#1f2a44}
  .vsC-tb{display:flex;gap:6px;align-items:center;padding:6px 8px;background:#e6eaf4}
  .vsC-nb{width:36px;height:32px;border-radius:7px;border:1px solid #b3bdd6;background:#fff;color:#1f2a44;font:800 .9rem var(--font);cursor:pointer}
  .vsC-nb:disabled{opacity:.35;cursor:default}
  .vsC-url{flex:1;min-width:0;height:32px;display:flex;align-items:center;padding:0 12px;border-radius:99px;background:#fff;border:1px solid #b3bdd6;font:700 .9rem var(--mono);overflow:hidden;white-space:nowrap;transition:.25s}
  .vsC-url.bad{border-color:var(--bad);color:var(--bad)}.vsC-url.ok{border-color:var(--ok);color:var(--ok)}
  .vsC-menu{display:flex;gap:6px;padding:7px 10px;border-bottom:1px solid #dfe4f1;background:#f6f8fd}
  .vsC-m{padding:.3em .8em;border-radius:99px;border:1px solid #b3bdd6;background:#fff;color:#1f2a44;font:800 .85rem var(--font);cursor:pointer}
  .vsC-m.on{background:#2f7bff;border-color:#2f7bff;color:#fff}
  .vsC-v{min-height:176px;padding:12px;display:grid;gap:6px;align-content:start;transition:.25s}
  .vsC-v.bad{background:color-mix(in srgb,var(--bad) 14%,#fff)}.vsC-v.ok{background:color-mix(in srgb,var(--ok) 14%,#fff)}
  .vsC-pgt{font:900 1.05rem var(--font)}
  .vsC-row{padding:.4em .7em;border-radius:8px;background:#eef1f9;font:700 .88rem var(--font)}
  .vsC-msg{padding:.5em .7em;border-radius:8px;font:800 .9rem/1.5 var(--font);border:2px solid var(--bad);color:var(--bad);background:#fff}
  .vsC-msg.ok{border-color:var(--ok);color:var(--ok)}
  .vsC-chips{display:flex;gap:6px;flex-wrap:wrap;align-items:center;min-height:42px;align-content:center}
  .vsC-c{padding:.3em .75em;border-radius:99px;border:2px solid #b3bdd6;background:#fff;font:800 .85rem var(--mono);color:#1f2a44;transition:.2s}
  .vsC-c.bad{border-color:var(--bad);color:var(--bad)}.vsC-c.ok{border-color:var(--ok);color:var(--ok)}
  .vsC-c.hit{background:#2f7bff;border-color:#2f7bff;color:#fff}
  .vsC-c.off{opacity:.45}
  .vsC-tbl{display:grid;gap:5px;min-height:118px;align-content:start}
  .vsC-r{padding:.35em .7em;border-radius:8px;border:2px solid #cfd6e8;background:#fff;font:800 .85rem var(--mono);color:#1f2a44;transition:.2s}
  .vsC-r.hit{background:#2f7bff;border-color:#2f7bff;color:#fff}.vsC-r.bad{border-color:var(--bad);color:var(--bad);border-style:dashed}
  .vsC-in{width:100%;box-sizing:border-box;padding:.5em .7em;border:2px solid #b3bdd6;border-radius:8px;font:700 .9rem var(--font);background:#fff;color:#1f2a44;resize:none}
  .vsC-btn{padding:.5em 1em;border-radius:8px;border:0;background:#2f7bff;color:#fff;font:900 .9rem var(--font);cursor:pointer;justify-self:start}
  .vsC-ck{display:grid;gap:5px}
  .vsC-ck div{padding:.35em .7em;border-radius:8px;background:#fff;border:2px solid #cfd6e8;font:800 .85rem var(--font);color:#1f2a44;transition:.2s}
  .vsC-ck div.ok{border-color:var(--ok);color:var(--ok)}.vsC-ck div.bad{border-color:var(--bad);color:var(--bad)}.vsC-ck div.run{border-color:#2f7bff}
  .vsC-load{height:5px;background:#2f7bff;width:0;transition:width 1.1s linear}
  .vsC-dim{opacity:.35}
  `);

  const pages = {
    home: ['トップ', ['相談ナビへようこそ']],
    cases: ['相談一覧', ['離婚の慰謝料について', '相続の手続きについて', '交通事故の示談について']],
    apply: ['相談の申込', ['お名前（仮）', '相談内容']],
  };
  const pageView = (p) => h('div', { style: { display: 'grid', gap: '6px' } }, h('b', { class: 'vsC-pgt' }, pages[p][0]), ...pages[p][1].map((t) => h('div', { class: 'vsC-row' }, t)));
  const mini = (url, menu) => {
    const back = h('button', { class: 'vsC-nb' }, '◀'), urlEl = h('div', { class: 'vsC-url' }, url);
    const view = h('div', { class: 'vsC-v' });
    const menuEl = menu ? h('div', { class: 'vsC-menu' }) : null;
    const el = h('div', { class: 'vsC-br' }, h('div', { class: 'vsC-tb' }, back, urlEl), menuEl, view);
    return { el, back, urlEl, view, menuEl };
  };
  const flash = (el, cls, ms) => { el.classList.add(cls); setTimeout(() => el.classList.remove(cls), ms || 1300); };
  const lineOf = (src, s, from) => { const a = src.split('\n'); for (let i = from || 0; i < a.length; i++) if (a[i].includes(s)) return i + 1; return 0; };

  /* 導入シーンの先頭に自動で出る「解剖図」は、この比較図と重複するので、これらのシーンでは出さない */
  const MINE = new Set(['URL ↔ コンポーネント', '動的ルート /users/:id', 'ナビゲーションガード', 'mount → find → trigger → expect', '開発サーバーと自動更新（HMR）']);
  if (K.anatFor && !K.anatFor.vsC) { const o = K.anatFor; K.anatFor = (t) => (MINE.has(t) ? null : o(t)); K.anatFor.vsC = true; }

  function reg(id, title, lead, build) {
    let tries = 0;
    (function wait() {
      const L = K.lessons && K.lessons[id];
      const sc = L && L.scenes && L.scenes.find((s) => s.t === title);
      if (sc) { sc.lead = lead; delete sc.why; sc.render = (el) => el.append(build()); return; }
      if (++tries < 200) setTimeout(wait, 50);
    })();
  }

  /* ───────── vue-router ① URL ↔ コンポーネント ───────── */
  reg('vue-router', 'URL ↔ コンポーネント', '<b>URL が変わらない</b>と、戻る・直リンクが使えない。', () => {
    const SRC_NO = `<script setup lang="ts">
import { ref } from 'vue'
import HomeView from '@/views/HomeView.vue'
import CaseList from '@/views/CaseList.vue'
import ApplyForm from '@/views/ApplyForm.vue'

type Page = 'home' | 'cases' | 'apply'
const page = ref<Page>('home')
</script>

<template>
  <nav>
    <button @click="page = 'cases'">相談一覧</button>
    <button @click="page = 'apply'">申込</button>
  </nav>
  <CaseList v-if="page === 'cases'" />
  <ApplyForm v-else-if="page === 'apply'" />
  <HomeView v-else />
</template>`;
    const SRC_OK = `import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CaseList from '@/views/CaseList.vue'
import ApplyForm from '@/views/ApplyForm.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', component: HomeView },
  { path: '/cases', component: CaseList },
  { path: '/apply', component: ApplyForm },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})`;
    const ui = (ok) => (ctx) => {
      const b = mini(ok ? '/' : '/', true);
      const hist = h('span', { class: 'vsC-c', 'data-k': ok ? 'hist' : 'state' });
      let page = 'home', stack = ['/'], idx = 0, outside = false;
      const menu = {};
      [['cases', '相談一覧'], ['apply', '申込']].forEach(([p, t]) => { menu[p] = h('button', { class: 'vsC-m', 'data-k': 'nav', onclick: () => api.go(p) }, t); b.menuEl.append(menu[p]); });
      const paint = () => {
        b.view.className = 'vsC-v';
        if (outside) { b.view.replaceChildren(h('div', { class: 'vsC-msg' }, '🔍 前に見ていた検索サイトに出てしまった')); b.view.classList.add('bad'); }
        else { b.view.replaceChildren(pageView(page)); b.view.dataset.k = ''; }
        b.view.setAttribute('data-k', 'view');
        Object.entries(menu).forEach(([p, e]) => e.classList.toggle('on', !outside && p === page));
        if (ok) { b.urlEl.textContent = outside ? 'search.example/?q=相談' : stack[idx]; { const from = Math.max(0, stack.length - 4); hist.textContent = '履歴 ' + (from > 0 ? '… › ' : '') + stack.map((s, i) => (i === idx ? '[' + s + ']' : s)).slice(from).join(' › '); } }
        else { b.urlEl.textContent = outside ? 'search.example/?q=相談' : '/'; hist.textContent = "page = '" + page + "'"; }
        b.back.disabled = ok ? (idx === 0 || outside) : outside;
      };
      const api = {
        go(p) { outside = false; page = p; if (ok) { stack = stack.slice(0, idx + 1).concat('/' + p); idx = stack.length - 1; } paint(); ctx.bump(b.urlEl); flash(b.urlEl, ok ? 'ok' : 'bad'); },
        back() {
          if (ok) { if (idx > 0) { idx--; page = stack[idx] === '/' ? 'home' : stack[idx].slice(1); paint(); ctx.bump(b.view); } }
          else { outside = true; paint(); }
        },
        async open(p) {
          await ctx.fly(b.urlEl, b.view, ok ? '/' + p : '/', ok ? '#2fd4a4' : '#ff6b9d');
          outside = false; if (ok) { page = p; stack = ['/' + p]; idx = 0; } else page = 'home'; paint(); ctx.bump(b.view);
        },
        reset() { page = 'home'; stack = ['/']; idx = 0; outside = false; paint(); },
      };
      b.back.onclick = () => api.back();
      api.reset();
      return { el: h('div', { style: { display: 'grid', gap: '8px' } }, b.el, h('div', { class: 'vsC-chips' }, hist)), reset: api.reset, api };
    };
    return K.vs.versus({
      banner: 'ページを切り替えても、URL は変わらない？',
      bar: [
        { label: '① 相談一覧を開く', primary: true, onclick: (c) => { c.ui.without.api.go('cases'); c.ui.with.api.go('cases'); c.banner('左は URL が「/」のまま。', 'bad'); } },
        { label: '② ◀ 戻る', onclick: (c) => { c.ui.without.api.back(); c.ui.with.api.back(); c.banner('左は、前のサイトまで戻ってしまう。', 'bad'); } },
        { label: '③ 🔗 URL を送って開く', onclick: async (c) => { c.banner('相手が /cases の URL を開くと…', 'warn'); await Promise.all([c.ui.without.api.open('cases'), c.ui.with.api.open('cases')]); c.banner('左は相談一覧ではなく、トップが開く。', 'bad'); } },
        { label: '⟲ 最初から', onclick: (c) => c.reset() },
      ],
      without: { title: 'ない場合：page 変数で切り替え', file: 'AppShell.vue', lang: 'vue', src: SRC_NO, ui: ui(false), keys: { state: ["const page"], nav: ["page = '"], view: ['v-if', 'v-else'] } },
      with: { title: 'ある場合：URL とコンポーネントの表', file: 'router/index.ts', lang: 'ts', src: SRC_OK, ui: ui(true), keys: { hist: ['createWebHistory'], nav: ["path: '/cases'", "path: '/apply'"], view: ['component:'] } },
    });
  });

  /* ───────── vue-router ② 動的ルート ───────── */
  reg('vue-router', '動的ルート /users/:id', '案件が<b>1件増えるたびにルートを足す</b>のは無理。', () => {
    const SRC_NO = `import { type RouteRecordRaw } from 'vue-router'
import CaseDetail12 from '@/views/CaseDetail12.vue'
import CaseDetail57 from '@/views/CaseDetail57.vue'

const routes: RouteRecordRaw[] = [
  { path: '/cases/12', component: CaseDetail12 },
  { path: '/cases/57', component: CaseDetail57 },
]`;
    const SRC_OK = `// router/index.ts
const routes: RouteRecordRaw[] = [
  { path: '/cases/:id', component: CaseDetail },
]

// CaseDetail.vue
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const caseId = computed<number>(() => Number(route.params.id))
</script>`;
    const NAMES = { 12: '離婚の慰謝料について', 57: '相続の手続きについて', 301: '交通事故の示談について' };
    const ui = (ok) => (ctx) => {
      const b = mini('/cases', false);
      const tbl = h('div', { class: 'vsC-tbl' });
      const rows = {};
      const mk = (path, k) => { rows[path] = h('div', { class: 'vsC-r', 'data-k': k }, path); tbl.append(rows[path]); };
      if (ok) mk('/cases/:id', 'path'); else { mk('/cases/12', 'r12'); mk('/cases/57', 'r57'); }
      const fix = h('div', { class: 'vsC-r bad' }, '＋ /cases/301 と CaseDetail301.vue を作る…'); fix.style.display = 'none';
      if (!ok) tbl.append(fix);
      const idChip = h('span', { class: 'vsC-c off', 'data-k': 'param' }, 'params.id = –');
      const blank = () => { b.view.className = 'vsC-v'; b.view.replaceChildren(h('div', { class: 'vsC-pgt' }, '案件を選んでください')); };
      const api = {
        async open(id) {
          Object.values(rows).forEach((r) => r.classList.remove('hit'));
          b.urlEl.textContent = '/cases/' + id; b.urlEl.className = 'vsC-url';
          const hitRow = ok ? rows['/cases/:id'] : rows['/cases/' + id];
          await ctx.fly(b.urlEl, hitRow || tbl, ok ? 'id=' + id : '/cases/' + id, ok ? '#2fd4a4' : '#ff6b9d');
          if (hitRow) {
            hitRow.classList.add('hit'); ctx.bump(hitRow);
            b.view.className = 'vsC-v' + (ok ? ' ok' : ''); b.view.replaceChildren(h('b', { class: 'vsC-pgt', 'data-k': 'param' }, '案件 #' + id), h('div', { class: 'vsC-row' }, NAMES[id]));
            idChip.textContent = 'params.id = ' + id; idChip.classList.remove('off'); ctx.bump(b.view);
          } else {
            b.view.className = 'vsC-v bad'; b.view.replaceChildren(h('div', { class: 'vsC-msg' }, '404 ページが見つかりません')); b.urlEl.classList.add('bad'); fix.style.display = ''; ctx.bump(fix);
          }
        },
        reset() { Object.values(rows).forEach((r) => r.classList.remove('hit')); fix.style.display = 'none'; b.urlEl.textContent = '/cases'; b.urlEl.className = 'vsC-url'; idChip.textContent = 'params.id = –'; idChip.classList.add('off'); blank(); },
      };
      api.reset();
      return { el: h('div', { style: { display: 'grid', gap: '8px' } }, b.el, tbl, ok ? h('div', { class: 'vsC-chips' }, idChip) : h('div', { class: 'vsC-chips' }, h('span', { class: 'vsC-c off' }, '案件 100 件 → ルート 100 個'))), reset: api.reset, api };
    };
    const open = (id) => async (c) => {
      c.banner('', ''); await Promise.all([c.ui.without.api.open(id), c.ui.with.api.open(id)]);
      c.banner(id === 301 ? '左は 404。ルートを書き足すまで開けない。' : '開けた。右は 1 行で、どの番号でも開ける。', id === 301 ? 'bad' : 'ok');
    };
    return K.vs.versus({
      banner: '案件の数だけ、ルートを書くの？',
      bar: [
        { label: '案件 #12 を開く', primary: true, onclick: open(12) },
        { label: '案件 #57 を開く', onclick: open(57) },
        { label: '新しい案件 #301 を開く', onclick: open(301) },
        { label: '⟲ 最初から', onclick: (c) => c.reset() },
      ],
      without: { title: 'ない場合：案件ごとにルート', file: 'router/index.ts', lang: 'ts', src: SRC_NO, ui: ui(false), keys: { r12: ["'/cases/12'"], r57: ["'/cases/57'"] } },
      with: { title: 'ある場合：/cases/:id 1 行', file: 'router/index.ts + CaseDetail.vue', lang: 'vue', src: SRC_OK, ui: ui(true), keys: { path: ["'/cases/:id'"], param: ['route.params.id', 'useRoute()'] } },
    });
  });

  /* ───────── vue-router ③ ナビゲーションガード ───────── */
  reg('vue-router', 'ナビゲーションガード', '<b>ログイン確認を 1 か所書き忘れる</b>と、管理画面が丸見え。', () => {
    const SRC_NO = `// CaseList.vue
<script setup lang="ts">
const auth = useAuthStore()
if (!auth.isLoggedIn) router.push('/login')
</script>

// ApplyForm.vue
<script setup lang="ts">
const auth = useAuthStore()
if (!auth.isLoggedIn) router.push('/login')
</script>

// AdminView.vue
<script setup lang="ts">
const cases = await fetchAllCases()
</script>`;
    const SRC_OK = `const routes: RouteRecordRaw[] = [
  { path: '/cases', component: CaseList },
  { path: '/apply', component: ApplyForm },
  { path: '/admin', component: AdminView },
  { path: '/login', component: LoginView },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!auth.isLoggedIn && to.path !== '/login') return '/login'
})`;
    const ui = (ok) => (ctx) => {
      const b = mini('/', false);
      const chips = h('div', { class: 'vsC-chips' });
      const chip = {};
      if (ok) { chip.gate = h('span', { class: 'vsC-c', 'data-k': 'guard' }, '🛡 router.beforeEach → 全ページ'); chips.append(chip.gate); }
      else [['cases', 'CaseList ✓確認'], ['apply', 'ApplyForm ✓確認'], ['admin', 'AdminView ✗確認なし']].forEach(([k, t]) => { chip[k] = h('span', { class: 'vsC-c' + (k === 'admin' ? ' bad' : ''), 'data-k': k }, t); chips.append(chip[k]); });
      const api = {
        async open(p) {
          b.urlEl.textContent = '/' + p; b.urlEl.className = 'vsC-url';
          const gate = ok ? chip.gate : chip[p];
          await ctx.fly(b.urlEl, gate, ok ? '/' + p + '?' : '確認?', ok ? '#2fd4a4' : '#ffb454');
          ctx.bump(gate);
          const leak = !ok && p === 'admin';
          if (leak) { b.view.className = 'vsC-v bad'; b.view.replaceChildren(h('b', { class: 'vsC-pgt' }, '管理画面'), h('div', { class: 'vsC-msg' }, '未ログインなのに、全相談が見える'), h('div', { class: 'vsC-row' }, '離婚の慰謝料について')); b.urlEl.classList.add('bad'); }
          else { b.urlEl.textContent = '/login'; b.urlEl.classList.add('ok'); b.view.className = 'vsC-v ok'; b.view.replaceChildren(h('b', { class: 'vsC-pgt' }, 'ログイン'), h('div', { class: 'vsC-msg ok' }, '未ログイン → /login へ戻された')); }
          return leak;
        },
        reset() { b.urlEl.textContent = '/'; b.urlEl.className = 'vsC-url'; b.view.className = 'vsC-v'; b.view.replaceChildren(h('div', { class: 'vsC-pgt' }, '（未ログイン）')); },
      };
      api.reset();
      return { el: h('div', { style: { display: 'grid', gap: '8px' } }, b.el, chips), reset: api.reset, api };
    };
    const open = (p) => async (c) => {
      c.banner('未ログインのまま /' + p + ' を開く…', 'warn');
      const [l] = await Promise.all([c.ui.without.api.open(p), c.ui.with.api.open(p)]);
      c.banner(l ? '左：AdminView だけ確認を書き忘れて、丸見え。' : '左右とも /login に戻された。', l ? 'bad' : 'ok');
    };
    return K.vs.versus({
      banner: 'ログイン確認を、全ページに書き写す？',
      bar: [
        { label: '/cases を開く', primary: true, onclick: open('cases') },
        { label: '/apply を開く', onclick: open('apply') },
        { label: '/admin を開く', onclick: open('admin') },
        { label: '⟲ 最初から', onclick: (c) => c.reset() },
      ],
      without: { title: 'ない場合：ページごとにコピペ', file: '各ページ.vue', lang: 'vue', src: SRC_NO, ui: ui(false), keys: { cases: ['// CaseList', 'isLoggedIn'], apply: ['// ApplyForm'], admin: ['// AdminView', 'fetchAllCases'] } },
      with: { title: 'ある場合：beforeEach 1 か所', file: 'router/index.ts', lang: 'ts', src: SRC_OK, ui: ui(true), keys: { guard: ['beforeEach', 'isLoggedIn', "return '/login'"] } },
    });
  });

  /* ───────── vue-test：mount → find → trigger → expect ───────── */
  reg('vue-test', 'mount → find → trigger → expect', '直すたびに<b>手で全部確認</b>するのは、必ず漏れる。', () => {
    const SRC_NO = `<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{ submit: [body: string] }>()
const body = ref<string>('')

function onSend(): void {
  emit('submit', body.value.trim())
}
</script>

<template>
  <form @submit.prevent="onSend">
    <textarea v-model="body" placeholder="相談内容" />
    <button type="submit">送信</button>
  </form>
</template>`;
    const SRC_OK = `import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ConsultForm from '@/components/ConsultForm.vue'

describe('ConsultForm', () => {
  it('内容を入れて送信できる', async () => {
    const wrapper = mount(ConsultForm)
    await wrapper.find('textarea').setValue('相続の手続きについて')
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('submit')).toHaveLength(1)
  })

  it('空のままでは送信されない', async () => {
    const wrapper = mount(ConsultForm)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('submit')).toBeUndefined()
  })
})`;
    const noUi = (ctx) => {
      const ta = h('textarea', { class: 'vsC-in', rows: '2', placeholder: '相談内容', 'data-k': 'body' });
      const send = h('button', { class: 'vsC-btn', 'data-k': 'send' }, '送信');
      const ck = h('div', { class: 'vsC-ck' });
      const items = ['① 画面を開く', '② 文字を入れて送信 → 届いた', '③ 空のまま送信 → ？'].map((t) => h('div', {}, t));
      ck.append(...items);
      const out = h('div', { class: 'vsC-msg ok', style: { visibility: 'hidden' } }, '—');
      const api = {
        async run() {
          api.reset();
          for (let i = 0; i < 2; i++) {
            items[i].className = 'run'; await sleep(450);
            if (i === 1) { for (const ch of '相続の手続き') { ta.value += ch; await sleep(90); } ctx.bump(send); await sleep(400); }
            items[i].className = 'ok';
          }
          items[2].textContent = '③ 空のまま送信 → 確認し忘れ'; items[2].style.opacity = '.55';
          await sleep(500);
          out.style.visibility = ''; out.className = 'vsC-msg'; out.textContent = 'リリース後：空の相談が届いてしまった';
          ctx.bump(out);
        },
        reset() { ta.value = ''; items.forEach((e, i) => { e.className = ''; e.style.opacity = ''; e.textContent = ['① 画面を開く', '② 文字を入れて送信 → 届いた', '③ 空のまま送信 → ？'][i]; }); out.style.visibility = 'hidden'; },
      };
      return { el: h('div', { style: { display: 'grid', gap: '8px' } }, ta, send, ck, out), reset: api.reset, api };
    };
    const okUi = (ctx) => {
      const stages = ['mount', 'find', 'trigger', 'expect'];
      const st = {}; const sbar = h('div', { class: 'vsC-chips' });
      stages.forEach((s, i) => { st[s] = h('span', { class: 'vsC-c', 'data-k': s }, s + (s === 'mount' ? '' : '')); sbar.append(st[s]); if (i < 3) sbar.append(h('span', { style: { color: '#6b7794' } }, '→')); });
      const r1 = h('div', { class: 'vsC-r', 'data-k': 't1' }, '○ 内容を入れて送信できる');
      const r2 = h('div', { class: 'vsC-r', 'data-k': 't2' }, '○ 空のままでは送信されない');
      const out = h('div', { class: 'vsC-msg', style: { visibility: 'hidden' } }, '—');
      const L = { t1: [lineOf(SRC_OK, 'mount(Con'), lineOf(SRC_OK, 'setValue'), lineOf(SRC_OK, "trigger('click')"), lineOf(SRC_OK, 'toHaveLength')], t2: [] };
      const m2 = lineOf(SRC_OK, 'mount(Con', L.t1[0]);
      L.t2 = [m2, m2 + 1, m2 + 1, lineOf(SRC_OK, 'toBeUndefined')];
      const runOne = async (row, lines, pass) => {
        row.className = 'vsC-r'; row.textContent = '… ' + row.textContent.slice(2);
        for (let i = 0; i < 4; i++) {
          Object.values(st).forEach((e) => e.classList.remove('hit')); st[stages[i]].classList.add('hit');
          ctx.pre.with.setHi([lines[i]]); await sleep(550);
        }
        Object.values(st).forEach((e) => e.classList.remove('hit')); ctx.pre.with.setHi([]);
        row.textContent = (pass ? '✓ ' : '✗ ') + row.textContent.slice(2); row.classList.add(pass ? 'hit' : 'bad'); row.style.background = pass ? 'var(--ok)' : ''; row.style.borderColor = pass ? 'var(--ok)' : ''; row.style.borderStyle = 'solid'; ctx.bump(row);
      };
      const api = {
        async run() {
          api.reset();
          await runOne(r1, L.t1, true); await sleep(250);
          await runOne(r2, L.t2, false);
          out.style.visibility = ''; out.textContent = 'Expected: undefined / Received: [ [ "" ] ]'; ctx.bump(out);
        },
        reset() { [[r1, '内容を入れて送信できる'], [r2, '空のままでは送信されない']].forEach(([r, t]) => { r.className = 'vsC-r'; r.removeAttribute('style'); r.textContent = '○ ' + t; }); out.style.visibility = 'hidden'; Object.values(st).forEach((e) => e.classList.remove('hit')); ctx.pre.with && ctx.pre.with.setHi([]); },
      };
      return { el: h('div', { style: { display: 'grid', gap: '8px' } }, sbar, h('div', { class: 'vsC-tbl', style: { minHeight: '0' } }, r1, r2), out), reset: () => api.reset(), api };
    };
    return K.vs.versus({
      banner: '直したあと、毎回ぜんぶ手で確認する？',
      bar: [
        { label: '▶ 変更を確認する', primary: true, onclick: async (c) => { c.banner('リファクタ後の確認…', 'warn'); await Promise.all([c.ui.without.api.run(), c.ui.with.api.run()]); c.banner('左は漏れて本番へ。右はテストが赤で止めた。', 'bad'); } },
        { label: '⟲ 最初から', onclick: (c) => c.reset() },
      ],
      without: { title: 'ない場合：手で触って目で見る', file: 'ConsultForm.vue', lang: 'vue', src: SRC_NO, ui: noUi, keys: { body: ['v-model="body"'], send: ['type="submit"', 'emit('] } },
      with: { title: 'ある場合：テストが確認する', file: 'ConsultForm.test.ts', lang: 'ts', src: SRC_OK, ui: okUi, keys: { mount: ['mount(Con'], find: ['.find('], trigger: ['.trigger('], expect: ['expect('], t1: ['内容を入れて送信できる'], t2: ['空のままでは送信されない'] } },
    });
  });

  /* ───────── vue-env：開発サーバーと自動更新（HMR） ───────── */
  reg('vue-env', '開発サーバーと自動更新（HMR）', '保存のたびに<b>リロード</b>すると、入力が消える。', () => {
    const SRC_NO = `{
  "name": "kenshu-consult",
  "scripts": {
    "build": "vue-tsc && rollup -c",
    "start": "open dist/index.html"
  }
}`;
    const SRC_OK = `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    hmr: true,
  },
})`;
    const T = ['相談フォーム', 'ご相談フォーム'];
    const ui = (ok) => (ctx) => {
      let v = 0;
      const edit = h('div', { class: 'vsC-chips' });
      const code = h('span', { class: 'vsC-c', 'data-k': 'edit' }, '');
      const save = h('span', { class: 'vsC-c off' }, '💾 保存前');
      edit.append(code, save);
      const b = mini('localhost:5173', false);
      b.urlEl.textContent = ok ? 'localhost:5173' : 'file:///dist/index.html';
      const ta = h('textarea', { class: 'vsC-in', rows: '3', 'data-k': 'state' });
      const head = h('b', { class: 'vsC-pgt', 'data-k': 'view' }, '');
      const load = h('div', { class: 'vsC-load' });
      const note = h('div', { class: 'vsC-msg', style: { visibility: 'hidden' } }, '—');
      b.el.insertBefore(load, b.view);
      b.view.append(head, ta, note);
      const steps = h('div', { class: 'vsC-chips' });
      const paint = () => { code.textContent = '<h2>' + T[v] + '</h2>'; head.textContent = T[v]; };
      const api = {
        async save() {
          v = 1 - v; code.textContent = '<h2>' + T[v] + '</h2>'; ctx.bump(code); save.className = 'vsC-c'; save.textContent = '💾 保存した'; setTimeout(() => { save.className = 'vsC-c off'; save.textContent = '💾 保存前'; }, 1600);
          note.style.visibility = 'hidden';
          if (ok) {
            steps.replaceChildren(h('span', { class: 'vsC-c ok', 'data-k': 'hmr' }, '⚡ HMR：変わった部分だけ差し替え'));
            await ctx.fly(code, head, '差分だけ', '#2fd4a4'); head.textContent = T[v]; ctx.bump(head);
            note.className = 'vsC-msg ok'; note.textContent = '入力は残ったまま'; note.style.visibility = '';
          } else {
            steps.replaceChildren(h('span', { class: 'vsC-c' }, '① npm run build'), h('span', { class: 'vsC-c' }, '② ブラウザで F5'));
            steps.children[0].classList.add('hit'); load.style.transition = 'none'; load.style.width = '0'; void load.offsetWidth; load.style.transition = 'width 1.1s linear'; load.style.width = '100%';
            b.view.classList.add('bad'); await sleep(1100); steps.children[0].classList.remove('hit'); steps.children[1].classList.add('hit'); await sleep(500);
            ta.value = ''; head.textContent = T[v]; b.view.classList.remove('bad'); load.style.transition = 'none'; load.style.width = '0'; ctx.bump(b.view);
            note.className = 'vsC-msg'; note.textContent = '入力が消えた。また打ち直し…'; note.style.visibility = '';
          }
        },
        reset() { v = 0; paint(); ta.value = '相続の手続きについて相談したい'; note.style.visibility = 'hidden'; b.view.classList.remove('bad'); load.style.width = '0'; steps.replaceChildren(h('span', { class: 'vsC-c off' }, ok ? '⚡ 保存すると自動で反映' : '① build → ② F5 を毎回')); },
      };
      api.reset();
      return { el: h('div', { style: { display: 'grid', gap: '8px' } }, edit, b.el, steps), reset: api.reset, api };
    };
    return K.vs.versus({
      banner: 'ここまで打った入力は、保存するとどうなる？',
      bar: [
        { label: '💾 保存する', primary: true, onclick: async (c) => { c.banner('ConsultForm.vue を保存…', 'warn'); await Promise.all([c.ui.without.api.save(), c.ui.with.api.save()]); c.banner('左は入力が消えた。右は残った。', 'bad'); } },
        { label: '⟲ 最初から', onclick: (c) => c.reset() },
      ],
      without: { title: 'ない場合：build して F5', file: 'package.json', lang: 'json', src: SRC_NO, ui: ui(false), keys: { edit: ['"build"'], view: ['"start"'], state: ['"start"'] } },
      with: { title: 'ある場合：開発サーバー（HMR）', file: 'vite.config.ts', lang: 'ts', src: SRC_OK, ui: ui(true), keys: { edit: ['vue()'], view: ['hmr: true'], state: ['hmr: true'], hmr: ['hmr: true'] } },
    });
  });
})();
