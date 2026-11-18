/* vue-router のテスト（初級×3・中級×1・上級×1）。K.vueTestTools.web で作る */
(function () {
  const K = window.KENSHU;
  if (!K || !K.vueTestTools) return;
  const { web, nt, VUE, VROUTER } = K.vueTestTools;
  const T = (K.tests = K.tests || {});

  const ROUTER = `import { createRouter, createMemoryHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from './views/HomeView.vue'
import AdminView from './views/AdminView.vue'
import SettingsView from './views/SettingsView.vue'
import CaseDetail from './views/CaseDetail.vue'
import NotFoundView from './views/NotFoundView.vue'

// ログイン中かどうか（本当は API で確認する。ここでは false 固定）
const loggedIn: boolean = false

const routes: RouteRecordRaw[] = [
  { path: '/', component: HomeView },
  { path: '/admin', component: AdminView, meta: { requiresAuth: true } },
  { path: '/settings', component: SettingsView, meta: { requiresAuth: true } },
  // ① /cases/:id のルートを足す（CaseDetail）
  // ④ どれにも合わない URL は NotFoundView に（path は '/:pathMatch(.*)*'）
]

// このページの中で動かすので createMemoryHistory を使う（本番は createWebHistory）
const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

// ⑤ requiresAuth の付いたページは、ログインしていないとき / に戻す（beforeEach）

export default router
`;
  const APP = `<script setup lang="ts">
</script>

<template>
  <nav>
    <RouterLink to="/">Home</RouterLink> |
    <RouterLink to="/cases/7">案件 7</RouterLink> |
    <RouterLink to="/cases/42">案件 42</RouterLink> |
    <RouterLink to="/admin">管理</RouterLink> |
    <RouterLink to="/settings">設定</RouterLink> |
    <RouterLink to="/oops">存在しないページ</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>
`;
  const HOME = `<script setup lang="ts">
import type { Case } from '../types'

const cases: Case[] = [
  { id: 7, title: '未払い残業代の相談' },
  { id: 42, title: '契約書チェックの依頼' },
  { id: 105, title: '相続の相談' },
]
</script>

<template>
  <h2>Home</h2>
  <!-- ③ cases を RouterLink で並べる（押すと、その案件の画面へ） -->
</template>
`;
  const SIMPLE = (name) => `<script setup lang="ts">
</script>

<template>
  <h2>${name}</h2>
</template>
`;
  const DETAIL = `<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
// ② URL の :id を、string の id に取り出す（route.params.id を使う。7 → 42 に移っても追いかけるよう computed で）
</script>

<template>
  <h2>案件</h2>
</template>
`;
  const TYPES = `export interface Case {
  id: number
  title: string
}
`;

  T['vue-router'] = web({
    alias: { 'App.vue': 'CaseLayout.vue' },
    libs: [VUE, VROUTER], height: 320,
    paths: {
      'router.ts': 'src/router/index.ts', 'App.vue': 'src/App.vue', 'types.ts': 'src/types.ts',
      'HomeView.vue': 'src/views/HomeView.vue', 'AdminView.vue': 'src/views/AdminView.vue', 'SettingsView.vue': 'src/views/SettingsView.vue',
      'CaseDetail.vue': 'src/views/CaseDetail.vue', 'NotFoundView.vue': 'src/views/NotFoundView.vue',
    },
    fileNotes: {
      'router.ts': 'URL と画面の対応表（ここに足す）', 'App.vue': 'メニュー（RouterLink）と表示場所（RouterView）',
      'types.ts': '案件の型 Case', 'HomeView.vue': '/ の画面：案件の一覧', 'AdminView.vue': '/admin：要ログイン',
      'SettingsView.vue': '/settings：要ログイン', 'CaseDetail.vue': '/cases/:id：案件の詳細', 'NotFoundView.vue': '見つからないとき',
    },
    starter: {
      'router.ts': ROUTER, 'App.vue': APP, 'types.ts': TYPES,
      'HomeView.vue': HOME, 'AdminView.vue': SIMPLE('管理画面'), 'SettingsView.vue': SIMPLE('設定画面'),
      'CaseDetail.vue': DETAIL, 'NotFoundView.vue': SIMPLE('ページが見つかりません'),
    },
    steps: [
      { key: 'm1', level: 1, file: 'router.ts', label: '「案件 7」を押すと、案件の画面が出る（/cases/:id のルートを足す）', hint: ['URL の一部を変数にするには、path に <code>:id</code> と書く。', '<code>{ path: \'/cases/:id\', component: CaseDetail }</code> を routes に足す。'], edits: [['  // ① /cases/:id のルートを足す（CaseDetail）\n', "  { path: '/cases/:id', component: CaseDetail },\n"]] },
      { key: 'm2', level: 1, file: 'CaseDetail.vue', label: '案件の画面に URL の id が出る（7 を押せば 7、42 を押せば 42）', hint: ['今の URL の値は <code>route.params.id</code>。7 → 42 と移っても同じ部品が使い回されるので、<code>computed</code> で追いかける。', '<code>const id = computed&lt;string&gt;(() =&gt; String(route.params.id))</code> を書き、template を <code>&lt;h2&gt;案件 {{ id }}&lt;/h2&gt;</code> に。'], edits: [['// ② URL の :id を、string の id に取り出す（route.params.id を使う。7 → 42 に移っても追いかけるよう computed で）\n', 'const id = computed<string>(() => String(route.params.id))\n'], ['  <h2>案件</h2>', '  <h2>案件 {{ id }}</h2>']] },
      { key: 'm3', level: 1, file: 'HomeView.vue', label: 'Home に案件の一覧が3件出て、それぞれが /cases/… へのリンクになる', hint: ['リンクは <code>RouterLink</code>。<code>:to</code> に文字列を組み立てて渡す。', '<code>&lt;li v-for="c in cases" :key="c.id"&gt;&lt;RouterLink :to="`/cases/${c.id}`"&gt;{{ c.title }}&lt;/RouterLink&gt;&lt;/li&gt;</code>'], edits: [['  <!-- ③ cases を RouterLink で並べる（押すと、その案件の画面へ） -->', '  <ul>\n    <li v-for="c in cases" :key="c.id">\n      <RouterLink :to="`/cases/${c.id}`">{{ c.title }}</RouterLink>\n    </li>\n  </ul>']] },
      { key: 'm4', level: 2, file: 'router.ts', label: '「存在しないページ」を押すと「ページが見つかりません」が出る（catch-all）', hint: ['どれにも合わない URL は、最後の受け皿ルートで受ける。', "<code>{ path: '/:pathMatch(.*)*', component: NotFoundView }</code>"], edits: [["  // ④ どれにも合わない URL は NotFoundView に（path は '/:pathMatch(.*)*'）\n", "  { path: '/:pathMatch(.*)*', component: NotFoundView },\n"]] },
      { key: 'm5', level: 3, file: 'router.ts', label: 'ログインしていないと「管理」も「設定」も入れず Home に戻る（meta.requiresAuth ＋ beforeEach）。案件の画面は今までどおり開く', hint: ['ページごとに if を書かず、<code>to.meta.requiresAuth</code> で判定する。', "<code>router.beforeEach((to) =&gt; { if (to.meta.requiresAuth &amp;&amp; !loggedIn) return '/' })</code>"], edits: [['// ⑤ requiresAuth の付いたページは、ログインしていないとき / に戻す（beforeEach）\n', "router.beforeEach((to) => {\n  if (to.meta.requiresAuth && !loggedIn) return '/'\n})\n"]] },
    ],
    probe: async (win, doc) => {
      const out = {};
      const view = () => ((doc.querySelector('main h2') || doc.querySelector('h2') || {}).textContent || '').trim();
      const go = async (href) => { const a = [...doc.querySelectorAll('a')].find((x) => x.getAttribute('href') === href); if (a) { a.click(); await nt(win, 150); } };
      await nt(win, 200);
      const links = [...doc.querySelectorAll('main a')].map((a) => a.getAttribute('href'));
      out.m3 = view() === 'Home' && links.length === 3 && ['/cases/7', '/cases/42', '/cases/105'].every((h) => links.includes(h));
      await go('/cases/7');
      const v7 = view();
      out.m1 = /案件/.test(v7);
      await go('/cases/42');
      const v42 = view();
      out.m2 = /7/.test(v7) && /42/.test(v42) && !/7/.test(v42);
      await go('/oops');
      out.m4 = /見つかりません/.test(view());
      await go('/admin');
      const a1 = view();
      await go('/settings');
      const a2 = view();
      await go('/cases/7');
      out.m5 = a1 === 'Home' && a2 === 'Home' && /案件/.test(view());
      return out;
    },
  });
})();
