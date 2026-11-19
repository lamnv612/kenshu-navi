/* 補足 Vue「store と eventBus」（x-vue-store）のレッスン最終テスト。K.vueTestTools.web で作る。
   x-vue-state（お知らせ・既読）とは別の題材：相談メニューのカート ＋ cart:added の合図（追加ログ）。
   ファイル：ConsultCartPage（ページ）＋ ConsultMenu / CartBadge / CartLog ＋ cartStore.ts / eventBus.ts / types.ts
   本物の Pinia はプレビューに入っていないので、同じ使い方の手書き版（関数の外の ref / reactive、Map と Set）を使う。
   初級×3（store から読む・store を呼ぶ・bus で聞く）・中級×2（bus で送る・storeToRefs）・上級×1（onUnmounted で解除）。 */
(function () {
  const K = window.KENSHU;
  if (!K || !K.vueTestTools) return;
  const { web, nt } = K.vueTestTools;
  const lock = (id, test) => Object.defineProperty(K.tests, id, { get: () => test, set: () => {}, configurable: true, enumerable: true });

  const TYPES = `// メニュー 1 つぶんの「形」
export interface MenuItem {
  id: number
  name: string
  price: number
}
`;

  const BUS = `// 部品どうしを直接つながずに、合図だけを送る「共有の連絡係」（on / off / emit の 3 つ。count はテスト用）
type Events = {
  'cart:added': { name: string }
}

type Handler<K extends keyof Events> = (payload: Events[K]) => void

const handlers = new Map<keyof Events, Set<Handler<never>>>()

export const bus = {
  on<K extends keyof Events>(type: K, fn: Handler<K>): void {
    const set = handlers.get(type) ?? new Set<Handler<never>>()
    set.add(fn as Handler<never>)
    handlers.set(type, set)
  },
  off<K extends keyof Events>(type: K, fn: Handler<K>): void {
    handlers.get(type)?.delete(fn as Handler<never>)
  },
  emit<K extends keyof Events>(type: K, payload: Events[K]): void {
    handlers.get(type)?.forEach((fn) => (fn as Handler<K>)(payload))
  },
  count(type: keyof Events): number {
    return handlers.get(type)?.size ?? 0
  },
}
`;

  const STORE = `import { ref, computed, reactive, toRefs } from 'vue'
import type { MenuItem } from './types'

// 関数の外に置くので、どの部品から呼んでも「同じ 1 つ」を使う（Pinia の store と同じ）
const items = ref<MenuItem[]>([])

const count = computed<number>(() => items.value.length)
const total = computed<number>(() => items.value.reduce((sum, i) => sum + i.price, 0))

function add(item: MenuItem): void {
  items.value.push(item)
}

const store = reactive({ items, count, total, add })

export function useCartStore() {
  return store
}

// state と getters を分割代入するときは、これで包む（Pinia の storeToRefs と同じ）
export function storeToRefs<T extends object>(source: T) {
  return toRefs(source)
}
`;

  const APP = `<script setup lang="ts">
import { ref } from 'vue'
import CartBadge from './CartBadge.vue'
import ConsultMenu from './ConsultMenu.vue'
import CartLog from './CartLog.vue'

// props を 1 つも渡していない：3 つの部品は、store と bus を通して話す
const showLog = ref<boolean>(true)
</script>

<template>
  <h3>相談メニュー</h3>
  <CartBadge />
  <ConsultMenu />
  <label class="log-switch">
    <input v-model="showLog" type="checkbox" />
    追加ログを表示
  </label>
  <CartLog v-if="showLog" />
</template>

<style scoped>
.badge { background: #e6f4ea; border-radius: 10px; padding: 0 10px; font-size: 13px; }
.log { background: #eef2ff; color: #1f2a44; border-radius: 8px; padding: 4px 12px; min-height: 1.6em; }
li { margin: 4px 0; }
button { margin-left: 8px; }
</style>
`;

  const MENU = `<script setup lang="ts">
import { ref } from 'vue'
import type { MenuItem } from './types'
import { useCartStore } from './cartStore'
import { bus } from './eventBus'

const menu = ref<MenuItem[]>([
  { id: 1, name: '初回相談', price: 5500 },
  { id: 2, name: '書類作成', price: 11000 },
  { id: 3, name: '電話相談', price: 3300 },
])

// ① useCartStore() から add を取り出す

function addToCart(item: MenuItem): void {
  // ① add(item) を呼んで、カートに入れる
  // ④ bus.emit('cart:added', { name: item.name }) も送る
}
</script>

<template>
  <ul>
    <li v-for="item in menu" :key="item.id">
      {{ item.name }}（{{ item.price }} 円）
      <button @click="addToCart(item)">追加</button>
    </li>
  </ul>
</template>
`;

  const BADGE = `<script setup lang="ts">
import { useCartStore, storeToRefs } from './cartStore'

// ② useCartStore() から count と total を取り出す
// ⑤ ② の取り出し方を、カートが増えたら画面も変わる形に直す（storeToRefs）
</script>

<template>
  <span class="badge">カート {{ count }} 個 / 合計 {{ total }} 円</span>
</template>
`;

  const LOGC = `<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { bus } from './eventBus'

const last = ref<string>('（まだなし）')

// ③ bus.on('cart:added', show) で聞いて、last に e.name を入れる
// ⑥ 画面から消えるとき（onUnmounted）に、bus.off('cart:added', show) で解除する
</script>

<template>
  <p class="log">最後に追加：{{ last }}</p>
</template>
`;

  lock('x-vue-store', web({
    height: 340,
    alias: { 'App.vue': 'ConsultCartPage.vue' },
    paths: {
      'App.vue': 'src/pages/ConsultCartPage.vue',
      'CartBadge.vue': 'src/components/CartBadge.vue',
      'ConsultMenu.vue': 'src/components/ConsultMenu.vue',
      'CartLog.vue': 'src/components/CartLog.vue',
      'cartStore.ts': 'src/stores/cartStore.ts',
      'eventBus.ts': 'src/lib/eventBus.ts',
      'types.ts': 'src/types.ts',
    },
    fileNotes: {
      'App.vue': 'ページ：3 つの部品を並べるだけ（データは渡さない）',
      'CartBadge.vue': '部品：カートの個数と合計（store を読む）',
      'ConsultMenu.vue': '部品：メニュー一覧。追加で store を書き換え、bus で合図を送る',
      'CartLog.vue': '部品：bus の合図を聞いて、最後に追加した名前を出す',
      'cartStore.ts': 'store：カートの置き場（Pinia と同じ使い方の手書き版）',
      'eventBus.ts': 'bus：共有の連絡係（on / off / emit の手書き版）',
      'types.ts': '型：MenuItem',
    },
    starter: { 'App.vue': APP, 'CartBadge.vue': BADGE, 'ConsultMenu.vue': MENU, 'CartLog.vue': LOGC, 'cartStore.ts': STORE, 'eventBus.ts': BUS, 'types.ts': TYPES },
    steps: [
      {
        key: 'm1', level: 1, file: 'ConsultMenu.vue',
        label: 'ConsultMenu.vue で、store の add を取り出して呼ぶ（画面：追加を押すとカートに入る）',
        hint: ['部品は、props を受け取らず、store（<code>useCartStore()</code>）から直接取り出して書き換える。', '<code>const { add } = useCartStore()</code> と、<code>addToCart</code> の中の <code>add(item)</code>。'],
        edits: [
          ['// ① useCartStore() から add を取り出す\n', 'const { add } = useCartStore()\n'],
          ['  // ① add(item) を呼んで、カートに入れる\n', '  add(item)\n'],
        ],
      },
      {
        key: 'm2', level: 1, file: 'CartBadge.vue',
        label: 'CartBadge.vue で、store から count と total を取り出して表示する（画面：カート 0 個 / 合計 0 円）',
        hint: ['バッジとメニューは親子ではないが、同じ store を見る。', '<code>const { count, total } = useCartStore()</code>'],
        edits: [['// ② useCartStore() から count と total を取り出す\n', 'const { count, total } = useCartStore()\n']],
      },
      {
        key: 'm3', level: 1, file: 'CartLog.vue',
        label: 'CartLog.vue で、bus.on で cart:added を聞いて、名前を出す（画面：合図が来ると「最後に追加」が変わる）',
        hint: ['聞く側は、合図が来たときに動く関数を <code>bus.on</code> で登録する。', "<code>function show(e: { name: string }): void { last.value = e.name }</code> を作り、<code>bus.on('cart:added', show)</code>。"],
        edits: [['// ③ bus.on(\'cart:added\', show) で聞いて、last に e.name を入れる\n', "function show(e: { name: string }): void {\n  last.value = e.name\n}\n\nbus.on('cart:added', show)\n"]],
      },
      {
        key: 'm4', level: 2, file: 'ConsultMenu.vue',
        label: 'ConsultMenu.vue で、追加したら bus.emit で cart:added の合図を送る（ログに「初回相談」が出る）',
        hint: ['送る側は、誰が聞いているかを知らなくてよい。', "<code>bus.emit('cart:added', { name: item.name })</code>。<code>addToCart</code> の中に書く。"],
        edits: [['  // ④ bus.emit(\'cart:added\', { name: item.name }) も送る\n', "  bus.emit('cart:added', { name: item.name })\n"]],
      },
      {
        key: 'm5', level: 2, file: 'CartBadge.vue',
        label: 'CartBadge.vue で、storeToRefs で count と total を取り出す（画面：カートが増えたら、バッジも変わる）',
        hint: ['<code>const { count } = useCartStore()</code> は、その時の値のコピー。増えても変わらない。', 'state と getters を分割代入するときは、<code>storeToRefs</code> で包む。', '<code>const { count, total } = storeToRefs(useCartStore())</code>'],
        edits: [['const { count, total } = useCartStore()\n// ⑤ ② の取り出し方を、カートが増えたら画面も変わる形に直す（storeToRefs）\n', 'const { count, total } = storeToRefs(useCartStore())\n']],
      },
      {
        key: 'm6', level: 3, file: 'CartLog.vue',
        label: 'CartLog.vue で、onMounted で登録し、onUnmounted で bus.off して解除する（チェックを外すと聞く人が 0）',
        hint: ['表示されたとき（<code>onMounted</code>）に <code>bus.on</code>、消えるとき（<code>onUnmounted</code>）に <code>bus.off</code>。', 'on と off には、同じ関数（<code>show</code>）を渡す。外し忘れると、消えた部品にも合図が届き続ける。', "<code>onMounted(() =&gt; { bus.on('cart:added', show) })</code> と <code>onUnmounted(() =&gt; { bus.off('cart:added', show) })</code>。"],
        edits: [["bus.on('cart:added', show)\n// ⑥ 画面から消えるとき（onUnmounted）に、bus.off('cart:added', show) で解除する\n", "onMounted(() => {\n  bus.on('cart:added', show)\n})\n\nonUnmounted(() => {\n  bus.off('cart:added', show)\n})\n"]],
      },
    ],
    /* 順番：最初のバッジ → cart:added を送る → メニューを押す（store と bus）→ store を直接増やす（バッジの更新）→ チェックを外す（解除） */
    probe: async (win, doc) => {
      const out = {};
      const txt = (s) => { const e = doc.querySelector(s); return e ? e.textContent.replace(/\s+/g, ' ').trim() : ''; };
      let store = null, bus = null;
      try { store = win.eval('useCartStore()'); bus = win.eval('bus'); } catch (e) { store = null; bus = null; }
      out.m2 = /カート\s*0\s*個/.test(txt('.badge')) && /合計\s*0\s*円/.test(txt('.badge'));
      if (bus) { try { bus.emit('cart:added', { name: 'テスト通知' }); } catch (e) { /* 聞く人がいなくてよい */ } await nt(win); }
      out.m3 = txt('.log').includes('テスト通知');
      const got = [];
      const spy = (e) => { got.push(e.name); };
      if (bus) bus.on('cart:added', spy);
      const btn = doc.querySelector('li button');
      if (btn) { try { btn.click(); } catch (e) { /* 未実装でもよい */ } await nt(win); }
      if (bus) bus.off('cart:added', spy);
      out.m1 = !!store && store.items.length === 1;
      out.m4 = got.some((m) => /初回相談/.test(m));
      if (store) { try { store.add({ id: 9, name: '電話相談', price: 3300 }); } catch (e) { /* 何もしない */ } await nt(win); }
      const n = store ? store.items.length : -1;
      out.m5 = n >= 1 && new RegExp('カート\\s*' + n + '\\s*個').test(txt('.badge')) && /合計\s*[\d,]*[1-9][\d,]*\s*円/.test(txt('.badge'));
      const sw = doc.querySelector('.log-switch input');
      let onN = -1, offN = -1;
      if (sw && bus) {
        try { onN = bus.count('cart:added'); } catch (e) { onN = -1; }
        sw.click(); await nt(win);
        try { offN = bus.count('cart:added'); } catch (e) { offN = -1; }
        sw.click(); await nt(win);
        let again = -1; try { again = bus.count('cart:added'); } catch (e) { again = -1; }
        out.m6 = onN === 1 && offN === 0 && again === 1;
      } else out.m6 = false;
      return out;
    },
  }));
})();
