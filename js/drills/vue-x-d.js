/* 練習の作り直し：vue-life / vue-router / vue-test の全シーン（.vue ＋ 型つき、初級3・中級1〜2・上級1、すべて必須）。
   vue.js の drills を上書きする。App.vue という名前は画面に出さず、alias で実在しそうな名前に見せる。 */
(function () {
  const K = window.KENSHU;
  const D = K.drills;
  const { multi, T, VUE, VROUTER } = K.vueDrillTools;
  const A = 'App.vue';

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const nt = async (win, ms) => { await win.Vue.nextTick(); await sleep(ms == null ? 40 : ms); };
  const step = async (out, key, fn) => { try { out[key] = !!(await fn()); } catch (e) { out[key] = false; } };
  const txt = (doc) => (doc.body.textContent || '').replace(/\s+/g, ' ');
  const num = (s) => +String(s).replace(/[^\d-]/g, '');
  const typeInto = async (win, el, value) => { el.value = value; el.dispatchEvent(new win.Event('input', { bubbles: true })); await nt(win); };

  const typeFast = async (win, el, value) => { el.value = value; el.dispatchEvent(new win.Event('input', { bubbles: true })); await win.Vue.nextTick(); };

  /* starter の文字列に（1回だけ現れる）置換を当てて solution を作る */
  const edit = (src, pairs) => pairs.reduce((s, p) => {
    if (s.split(p[0]).length !== 2) throw new Error('drill edit: not unique -> ' + p[0].slice(0, 50));
    return s.replace(p[0], () => p[1]);
  }, src);

  /* 1 つの練習を組み立てる。cfg: files（starter）/ edits（solution にする置換）/ tasks / probe / libs / alias / paths / fileNotes */
  const drill = (cfg) => {
    const sol = {};
    Object.keys(cfg.edits).forEach((n) => { sol[n] = edit(cfg.files[n], cfg.edits[n]); });
    const libs = cfg.libs || [VUE];
    const probe = cfg.probe ? K.vueTools.makeProbe(cfg.probe, libs) : null;
    return multi(cfg.files, sol, (v, c) => {
      const d = c.doc && c.doc();
      const ifr = d && d.defaultView && d.defaultView.frameElement;
      if (probe && ifr) probe.kick(v, ifr);
      const R = probe ? probe.res : {};
      return cfg.tasks.map((t) => {
        let ok = false;
        try { ok = !!t.ok(v, R, c); } catch (e) { ok = false; }
        const lg = t.lang || 'vue';
        const hs = [].concat(t.hint);
        const hint = [hs[0].replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')];
        if (hs[1] && hs[1] !== t.ans) hint.push({ code: hs[1], lang: lg });
        hint.push({ code: t.ans, lang: lg });
        return T(t.label, t.lv, ok, hint, t.at);
      });
    }, { libs, height: cfg.height || 300, alias: cfg.alias, paths: cfg.paths, fileNotes: cfg.fileNotes });
  };
  const t = (lv, label, hint, ans, at, ok, lang) => ({ lv, label, hint, ans, at, ok, lang });

  /* =============================== vue-life =============================== */
  const LIFE = D['vue-life'];
  const CASE_API = `// 案件 API の代わり（本番では fetch('/api/cases') になる場所）
export interface Case {
  id: number
  title: string
  area: string
}

const CASES: Case[] = [
  { id: 1, title: '未払い残業代の請求', area: '労働' },
  { id: 2, title: '賃貸の敷金返還', area: '不動産' },
  { id: 3, title: '相続放棄の手続き', area: '相続' },
]

export async function fetchCases(): Promise<Case[]> {
  await new Promise((resolve) => setTimeout(resolve, 80))
  if ((window as any).__apiDown) throw new Error('API error')
  return CASES
}
`;

  /* ---- ライフサイクル：CaseLoader.vue ---- */
  const LOADER = `<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchCases } from './api'
import type { Case } from './api'

// ① cases に「Case の配列」という型を付ける
const cases = ref([])
const status = ref<'loading' | 'done' | 'error'>('loading')
const updatedAt = ref('')

async function load(): Promise<void> {
  // ③ 取得の前に status を 'loading'、取得できたら 'done' にする
  // ⑤ 取得に失敗したら status を 'error' にする（try / catch）
  cases.value = await fetchCases()
  // ④ 取得できた時刻を updatedAt に入れる（例：'10:30:15'）
}

// ② 画面が表示された直後（onMounted）に load を呼ぶ
</script>

<template>
  <h2>相談案件</h2>
  <!-- ⑥ 読み込み中は「再読み込み」を押せなくする（:disabled） -->
  <button :disabled="false" @click="load">再読み込み</button>
  <p v-if="status === 'loading'">読み込み中…</p>
  <p v-else-if="status === 'error'">取得に失敗しました。もう一度お試しください。</p>
  <p v-if="updatedAt">最終更新 {{ updatedAt }}</p>
  <ul>
    <li v-for="c in cases" :key="c.id">[{{ c.area }}] {{ c.title }}</li>
  </ul>
</template>
`;
  LIFE['ライフサイクル'] = drill({
    height: 330,
    alias: { [A]: 'CaseLoader.vue' },
    paths: { [A]: 'src/components/CaseLoader.vue', 'api.ts': 'src/api.ts' },
    fileNotes: { [A]: '一覧を読み込む部品', 'api.ts': '案件 API の代わり（触らない）' },
    files: { [A]: LOADER, 'api.ts': CASE_API },
    edits: { [A]: [
      ['// ① cases に「Case の配列」という型を付ける\nconst cases = ref([])', 'const cases = ref<Case[]>([])'],
      ["  // ③ 取得の前に status を 'loading'、取得できたら 'done' にする\n  // ⑤ 取得に失敗したら status を 'error' にする（try / catch）\n  cases.value = await fetchCases()\n  // ④ 取得できた時刻を updatedAt に入れる（例：'10:30:15'）\n}",
        "  status.value = 'loading'\n  try {\n    cases.value = await fetchCases()\n    status.value = 'done'\n    updatedAt.value = new Date().toLocaleTimeString('ja-JP')\n  } catch {\n    status.value = 'error'\n  }\n}"],
      ['// ② 画面が表示された直後（onMounted）に load を呼ぶ', 'onMounted(load)'],
      ['<!-- ⑥ 読み込み中は「再読み込み」を押せなくする（:disabled） -->\n  <button :disabled="false"', '<button :disabled="status === \'loading\'"'],
    ] },
    probe: async (win, doc) => {
      const o = {}; const btn = () => doc.querySelector('button'); const lis = () => doc.querySelectorAll('li').length;
      await nt(win, 220);
      await step(o, 'm2', () => lis() === 3);
      await step(o, 'm3', async () => {
        const gone = !txt(doc).includes('読み込み中'); btn().click(); await nt(win, 0);
        const during = txt(doc).includes('読み込み中'); const dis = btn().disabled; await nt(win, 220);
        o.m5 = dis && !btn().disabled; return gone && during && !txt(doc).includes('読み込み中');
      });
      await step(o, 'm4', () => /最終更新\s*\d{1,2}:\d{2}:\d{2}/.test(txt(doc)));
      await step(o, 'm6', async () => {
        win.__apiDown = true; btn().click(); await nt(win, 220);
        const err = txt(doc).includes('取得に失敗'); win.__apiDown = false; btn().click(); await nt(win, 220);
        return err && lis() === 3 && !txt(doc).includes('取得に失敗');
      });
      return o;
    },
    tasks: [
      t(1, 'cases に型を付ける：ref<Case[]>([]) にする', ['ref の < > の中に、中に入れる値の型を書く。Case は api.ts で作ってある。', 'ref<Case[]>([])'], 'const cases = ref<Case[]>([])', { file: A, find: ['① '] }, (v) => /cases\s*=\s*ref\s*<\s*Case\s*\[\s*\]\s*>\s*\(\s*\[\s*\]\s*\)/.test(v[A]), 'ts'),
      t(1, '画面が表示された直後（onMounted）に load を呼び、案件が 3 件並ぶようにする', ['onMounted は「画面に出た直後に1回」呼ばれるフック。load を渡す。', 'onMounted(load)'], 'onMounted(load)', { file: A, find: ['② '] }, (v, R) => /onMounted\s*\(/.test(v[A]) && R.m2, 'ts'),
      t(1, 'load の最初で status を「loading」、取得できたら「done」にして、読み込み中の表示を消す', ['status.value を書き換える。await の前が loading、後が done。', "status.value = 'loading'\n// ... await fetchCases() ...\nstatus.value = 'done'"], "status.value = 'loading'\ncases.value = await fetchCases()\nstatus.value = 'done'", { file: A, find: ['③ '] }, (v, R) => R.m3, 'ts'),
      t(2, '取得できた時刻を updatedAt に入れて「最終更新 10:30:15」の形で表示する', ['script の中では ref に .value を付けて代入する。', "updatedAt.value = new Date().toLocaleTimeString('ja-JP')"], "updatedAt.value = new Date().toLocaleTimeString('ja-JP')", { file: A, find: ['④ '] }, (v, R) => R.m4, 'ts'),
      t(2, '読み込み中だけ「再読み込み」ボタンを押せなくする（:disabled）', ["属性に式を渡すのは :disabled=\"...\"。条件は status === 'loading'。", ':disabled="status === \'loading\'"'], '<button :disabled="status === \'loading\'" @click="load">再読み込み</button>', { file: A, find: ['⑥ '] }, (v, R) => /:disabled\s*=\s*["'][^"']*status/.test(v[A]) && R.m5),
      t(3, 'API が失敗したら status を「error」にして失敗の文を出し、再読み込みで復帰できるようにする（try / catch）', ['await が失敗すると例外になる。try { ... } catch { ... } で受け止める。', "try {\n  ...\n} catch {\n  status.value = 'error'\n}"], "try {\n  cases.value = await fetchCases()\n  status.value = 'done'\n} catch {\n  status.value = 'error'\n}", { file: A, find: ['⑤ '] }, (v, R) => /try\s*\{/.test(v[A]) && /catch/.test(v[A]) && R.m6, 'ts'),
    ],
  });

  /* ---- computed：CartTotal.vue ---- */
  const CART_TYPES = `// カートの 1 行分
export interface CartItem {
  id: number
  name: string
  price: number
  qty: number
}

// 画面に出す行（小計つき）
export interface CartLine extends CartItem {
  lineTotal: number
}
`;
  const CART = `<script setup lang="ts">
import { computed, ref } from 'vue'
import type { CartItem, CartLine } from './types'

const items = ref<CartItem[]>([
  { id: 1, name: '契約書テンプレート', price: 1800, qty: 1 },
  { id: 2, name: '内容証明の作成代行', price: 4400, qty: 1 },
  { id: 3, name: '法律書籍（民法入門）', price: 2200, qty: 1 },
])
const coupon = ref('')

const yen = (n: number): string => '¥' + n.toLocaleString('ja-JP')
const inc = (id: number): void => {
  const item = items.value.find((i) => i.id === id)
  if (item) item.qty++
}
const dec = (id: number): void => {
  const item = items.value.find((i) => i.id === id)
  if (item) item.qty = Math.max(0, item.qty - 1)
}

// ① subtotal：全商品の price × qty の合計（computed<number>）
const subtotal = ref(0)
// ② tax：小計の 10%（小数は切り捨て）
const tax = ref(0)
// ③ total：小計 + 消費税 + 送料 - 割引
const total = ref(0)
// ④ shipping：小計が 5,000 円以上なら 0 円、未満なら 550 円
const shipping = ref(0)
// ⑤ discount：coupon が 'WELCOME10' のとき 500 円引き、それ以外は 0 円
const discount = ref(0)
// ⑥ qty が 1 以上の行だけを、行の小計（lineTotal）が高い順に並べる
const visibleItems = computed<CartLine[]>(() =>
  items.value.map((item) => ({ ...item, lineTotal: item.price * item.qty })),
)
</script>

<template>
  <h2>カート</h2>
  <ul>
    <li v-for="line in visibleItems" :key="line.id">
      {{ line.name }} × {{ line.qty }} = {{ yen(line.lineTotal) }}
      <button @click="dec(line.id)">−</button>
      <button @click="inc(line.id)">＋</button>
    </li>
  </ul>
  <input v-model="coupon" placeholder="クーポンコード" />
  <p>小計：{{ yen(subtotal) }}</p>
  <p>消費税（10%）：{{ yen(tax) }}</p>
  <p>送料：{{ yen(shipping) }}</p>
  <p v-if="discount > 0">クーポン割引：-{{ yen(discount) }}</p>
  <p class="total">合計：{{ yen(total) }}</p>
</template>
`;
  LIFE['computed：賢い計算'] = drill({
    height: 340,
    alias: { [A]: 'CartTotal.vue' },
    paths: { [A]: 'src/components/CartTotal.vue', 'types.ts': 'src/types.ts' },
    fileNotes: { [A]: 'カートの合計を出す部品', 'types.ts': '行の型（触らない）' },
    files: { [A]: CART, 'types.ts': CART_TYPES },
    edits: { [A]: [
      ['// ① subtotal：全商品の price × qty の合計（computed<number>）\nconst subtotal = ref(0)', 'const subtotal = computed<number>(() =>\n  items.value.reduce((sum, item) => sum + item.price * item.qty, 0),\n)'],
      ['// ② tax：小計の 10%（小数は切り捨て）\nconst tax = ref(0)', 'const tax = computed<number>(() => Math.floor(subtotal.value * 0.1))'],
      ['// ③ total：小計 + 消費税 + 送料 - 割引\nconst total = ref(0)', 'const total = computed<number>(\n  () => subtotal.value + tax.value + shipping.value - discount.value,\n)'],
      ['// ④ shipping：小計が 5,000 円以上なら 0 円、未満なら 550 円\nconst shipping = ref(0)', 'const shipping = computed<number>(() => (subtotal.value >= 5000 ? 0 : 550))'],
      ["// ⑤ discount：coupon が 'WELCOME10' のとき 500 円引き、それ以外は 0 円\nconst discount = ref(0)", "const discount = computed<number>(() => (coupon.value === 'WELCOME10' ? 500 : 0))"],
      ['// ⑥ qty が 1 以上の行だけを、行の小計（lineTotal）が高い順に並べる\nconst visibleItems = computed<CartLine[]>(() =>\n  items.value.map((item) => ({ ...item, lineTotal: item.price * item.qty })),\n)',
        '// ⑥ 数量 1 以上だけを、行の小計が高い順に並べた新しい配列\nconst visibleItems = computed<CartLine[]>(() =>\n  items.value\n    .filter((item) => item.qty > 0)\n    .map((item) => ({ ...item, lineTotal: item.price * item.qty }))\n    .sort((a, b) => b.lineTotal - a.lineTotal),\n)'],
    ] },
    probe: async (win, doc) => {
      const o = {}; const g = (re) => { const m = txt(doc).match(re); return m ? num(m[1]) : -1; };
      const rowBtn = (name, label) => [...doc.querySelectorAll('li')].find((li) => li.textContent.includes(name)).querySelectorAll('button')[label === '−' ? 0 : 1];
      await nt(win, 60);
      await step(o, 'm1', () => g(/小計：¥([\d,]+)/) === 8400);
      await step(o, 'm2', () => g(/消費税（10%）：¥([\d,]+)/) === 840);
      await step(o, 'm3', () => g(/合計：¥([\d,]+)/) === 9240);
      await step(o, 'm5', async () => {
        const inp = doc.querySelector('input'); await typeInto(win, inp, 'WELCOME10');
        const ok = g(/クーポン割引：-¥([\d,]+)/) === 500 && g(/合計：¥([\d,]+)/) === 8740;
        await typeInto(win, inp, ''); return ok && !txt(doc).includes('クーポン割引');
      });
      await step(o, 'm6', async () => {
        const first = doc.querySelector('li').textContent.includes('内容証明');
        rowBtn('内容証明', '−').click(); await nt(win);
        const gone = ![...doc.querySelectorAll('li')].some((li) => li.textContent.includes('内容証明'));
        o.m4 = g(/小計：¥([\d,]+)/) === 4000 && g(/送料：¥([\d,]+)/) === 550 && g(/合計：¥([\d,]+)/) === 4950;
        return first && gone && doc.querySelectorAll('li').length === 2;
      });
      return o;
    },
    tasks: [
      t(1, '小計 subtotal を computed<number> で作る（全商品の 価格 × 数量 の合計）', ['合計は reduce で足していく。材料（items）が変わると自動で計算し直される。', 'items.value.reduce((sum, item) => sum + item.price * item.qty, 0)'], 'const subtotal = computed<number>(() =>\n  items.value.reduce((sum, item) => sum + item.price * item.qty, 0),\n)', { file: A, find: ['① '] }, (v, R) => /subtotal\s*=\s*computed\s*<\s*number\s*>\s*\(/.test(v[A]) && R.m1, 'ts'),
      t(1, '消費税 tax を computed で作る（小計の 10%、小数は切り捨て）', ['別の computed（subtotal）を材料にしてよい。script では subtotal.value。', 'Math.floor(subtotal.value * 0.1)'], 'const tax = computed<number>(() => Math.floor(subtotal.value * 0.1))', { file: A, find: ['② '] }, (v, R) => /tax\s*=\s*computed/.test(v[A]) && R.m2, 'ts'),
      t(1, '合計 total を computed で作る（小計 + 消費税 + 送料 - 割引）', ['材料は subtotal / tax / shipping / discount。すべて .value を付けて足し引きする。', 'subtotal.value + tax.value + shipping.value - discount.value'], 'const total = computed<number>(\n  () => subtotal.value + tax.value + shipping.value - discount.value,\n)', { file: A, find: ['③ '] }, (v, R) => /total\s*=\s*computed/.test(v[A]) && R.m3, 'ts'),
      t(2, '送料 shipping を computed にする（小計 5,000 円以上は無料、未満は 550 円）。数量を減らすと送料が追従する', ['条件で値を選ぶのは三項演算子（条件 ? A : B）。', 'subtotal.value >= 5000 ? 0 : 550'], 'const shipping = computed<number>(() => (subtotal.value >= 5000 ? 0 : 550))', { file: A, find: ['④ '] }, (v, R) => /shipping\s*=\s*computed/.test(v[A]) && R.m4, 'ts'),
      t(2, 'クーポン割引 discount を computed にする（WELCOME10 を入れると 500 円引き、合計も追従）', ['coupon は ref なので、script では coupon.value。', "coupon.value === 'WELCOME10' ? 500 : 0"], "const discount = computed<number>(() => (coupon.value === 'WELCOME10' ? 500 : 0))", { file: A, find: ['⑤ '] }, (v, R) => /discount\s*=\s*computed/.test(v[A]) && R.m5, 'ts'),
      t(3, '表示する行 visibleItems を、数量 1 以上だけ・行の小計が高い順に並べる（元の items は変えない）', ['filter で絞り、.sort((a, b) => b.lineTotal - a.lineTotal) で大きい順。', 'items.value\n  .filter((item) => item.qty > 0)\n  .map(...)\n  .sort((a, b) => b.lineTotal - a.lineTotal)'], 'const visibleItems = computed<CartLine[]>(() =>\n  items.value\n    .filter((item) => item.qty > 0)\n    .map((item) => ({ ...item, lineTotal: item.price * item.qty }))\n    .sort((a, b) => b.lineTotal - a.lineTotal),\n)', { file: A, find: ['⑥ '] }, (v, R) => /\.filter\(/.test(v[A]) && /\.sort\(/.test(v[A]) && R.m6, 'ts'),
    ],
  });

  /* ---- watch / watchEffect：KeywordSearch.vue ---- */
  const KS_TYPES = `// 相談 1 件分
export interface Case {
  id: number
  title: string
}
`;
  const KS = `<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue'
import type { Case } from './types'

const cases: Case[] = [
  { id: 1, title: '契約書の確認相談' },
  { id: 2, title: '賃貸契約の更新' },
  { id: 3, title: '業務委託契約のトラブル' },
  { id: 4, title: '未払い残業代の請求' },
  { id: 5, title: '交通事故の示談' },
  { id: 6, title: '相続放棄の手続き' },
]

const keyword = ref('')
const sort = ref<'newest' | 'oldest'>('newest')
const page = ref(1)
const label = ref('')
const changeNote = ref('')
const searched = ref('')
const searchCount = ref(0)

const filtered = computed<Case[]>(() => {
  const list = cases.filter((c) => c.title.includes(keyword.value))
  return sort.value === 'newest' ? list.slice().reverse() : list
})

// ① keyword が変わったら、page を 1 に戻す（watch）

// ② keyword や件数が変わるたびに、label を「「契約」の検索結果 3 件」に直す（watchEffect）。空のときは「全 6 件」

// ③ keyword が 20 文字を超えたら、先頭の 20 文字に切り詰める（watch で自分自身を書き換える）

// ④ sort を変えたときも page を 1 に戻す（keyword と sort を、まとめて監視）

// ⑤ keyword が変わったら、changeNote を「「前の語」→「今の語」」にする（引数に型を付ける）

// ⑥ 入力が止まって 200ms 経ってから searched を更新し、searchCount を 1 増やす（途中の入力では呼ばない）
</script>

<template>
  <h2>相談を探す</h2>
  <input v-model="keyword" placeholder="キーワードで相談を探す" />
  <select v-model="sort">
    <option value="newest">新しい順</option>
    <option value="oldest">古い順</option>
  </select>
  <p>{{ label }}</p>
  <p v-if="changeNote">変更：{{ changeNote }}</p>
  <ul>
    <li v-for="c in filtered" :key="c.id">{{ c.title }}</li>
  </ul>
  <button :disabled="page <= 1" @click="page--">前へ</button>
  ページ {{ page }}
  <button @click="page++">次へ</button>
  <p>検索 API：{{ searchCount }} 回（最後の語：{{ searched }}）</p>
</template>
`;
  LIFE['watch / watchEffect'] = drill({
    height: 360,
    alias: { [A]: 'KeywordSearch.vue' },
    paths: { [A]: 'src/components/KeywordSearch.vue', 'types.ts': 'src/types.ts' },
    fileNotes: { [A]: 'キーワード検索の部品', 'types.ts': '相談の型（触らない）' },
    files: { [A]: KS, 'types.ts': KS_TYPES },
    edits: { [A]: [
      ['// ① keyword が変わったら、page を 1 に戻す（watch）\n', "watch(keyword, () => {\n  page.value = 1\n})\n"],
      ['// ② keyword や件数が変わるたびに、label を「「契約」の検索結果 3 件」に直す（watchEffect）。空のときは「全 6 件」\n',
        "watchEffect(() => {\n  label.value = keyword.value\n    ? '「' + keyword.value + '」の検索結果 ' + filtered.value.length + ' 件'\n    : '全 ' + cases.length + ' 件'\n})\n"],
      ['// ③ keyword が 20 文字を超えたら、先頭の 20 文字に切り詰める（watch で自分自身を書き換える）\n', "watch(keyword, (next: string) => {\n  if (next.length > 20) keyword.value = next.slice(0, 20)\n})\n"],
      ['// ④ sort を変えたときも page を 1 に戻す（keyword と sort を、まとめて監視）\n', "watch([keyword, sort], () => {\n  page.value = 1\n})\n"],
      ['// ⑤ keyword が変わったら、changeNote を「「前の語」→「今の語」」にする（引数に型を付ける）\n', "watch(keyword, (next: string, prev: string) => {\n  changeNote.value = '「' + prev + '」→「' + next + '」'\n})\n"],
      ['// ⑥ 入力が止まって 200ms 経ってから searched を更新し、searchCount を 1 増やす（途中の入力では呼ばない）\n',
        "watch(keyword, (next: string, _prev: string, onCleanup) => {\n  const id = setTimeout(() => {\n    searched.value = next\n    searchCount.value++\n  }, 200)\n  onCleanup(() => clearTimeout(id))\n})\n"],
    ] },
    probe: async (win, doc) => {
      const o = {}; const inp = () => doc.querySelector('input'); const btn = (s) => [...doc.querySelectorAll('button')].find((b) => b.textContent.includes(s));
      await nt(win, 60);
      await step(o, 'm1', async () => {
        btn('次へ').click(); btn('次へ').click(); await nt(win, 0);
        const three = /ページ 3/.test(txt(doc)); await typeInto(win, inp(), 'a'); return three && /ページ 1/.test(txt(doc));
      });
      await step(o, 'm2', async () => {
        await typeInto(win, inp(), '契約'); const a = txt(doc).includes('「契約」の検索結果 3 件');
        await typeInto(win, inp(), ''); return a && txt(doc).includes('全 6 件');
      });
      await step(o, 'm3', async () => { await typeInto(win, inp(), 'あ'.repeat(25)); await nt(win, 0); return inp().value.length === 20; });
      await step(o, 'm4', async () => {
        await typeInto(win, inp(), ''); btn('次へ').click(); btn('次へ').click(); await nt(win, 0);
        const s = doc.querySelector('select'); s.value = 'oldest'; s.dispatchEvent(new win.Event('change', { bubbles: true })); await nt(win, 0);
        return /ページ 1/.test(txt(doc));
      });
      await step(o, 'm5', async () => { await typeInto(win, inp(), 'あ'); await typeInto(win, inp(), 'あい'); return txt(doc).includes('変更：「あ」→「あい」'); });
      await step(o, 'm6', async () => {
        await typeInto(win, inp(), ''); await nt(win, 350);
        const base = +(txt(doc).match(/検索 API：(\d+) 回/) || [0, -1])[1];
        await typeInto(win, inp(), '契'); await typeInto(win, inp(), '契約'); await typeInto(win, inp(), '契約書');
        const mid = +(txt(doc).match(/検索 API：(\d+) 回/)[1]); await nt(win, 400);
        const t = txt(doc); return mid === base && +(t.match(/検索 API：(\d+) 回/)[1]) === base + 1 && t.includes('最後の語：契約書');
      });
      return o;
    },
    tasks: [
      t(1, 'keyword が変わったら page を 1 に戻す（watch）。3 ページ目で検索しても 1 ページ目から', ['「この値が変わったら○○する」は watch。第1引数に監視する ref、第2引数にやること。', 'watch(keyword, () => {\n  page.value = 1\n})'], 'watch(keyword, () => {\n  page.value = 1\n})', { file: A, find: ['① '] }, (v, R) => /watch\s*\(\s*keyword/.test(v[A]) && R.m1, 'ts'),
      t(1, 'watchEffect で label を作る（「「契約」の検索結果 3 件」。空なら「全 6 件」）', ['watchEffect の中で使った ref は自動で監視される。keyword と filtered の両方が材料。', "watchEffect(() => {\n  label.value = keyword.value ? '「' + keyword.value + '」の検索結果 ' + filtered.value.length + ' 件' : '全 ' + cases.length + ' 件'\n})"], "watchEffect(() => {\n  label.value = keyword.value\n    ? '「' + keyword.value + '」の検索結果 ' + filtered.value.length + ' 件'\n    : '全 ' + cases.length + ' 件'\n})", { file: A, find: ['② '] }, (v, R) => /watchEffect\s*\(/.test(v[A]) && R.m2, 'ts'),
      t(1, 'keyword が 20 文字を超えたら、先頭の 20 文字に切り詰める（watch の中で keyword を書き換える）', ['watch の引数 1 つ目が新しい値。超えたら keyword.value = next.slice(0, 20)。', 'watch(keyword, (next: string) => {\n  if (next.length > 20) keyword.value = next.slice(0, 20)\n})'], 'watch(keyword, (next: string) => {\n  if (next.length > 20) keyword.value = next.slice(0, 20)\n})', { file: A, find: ['③ '] }, (v, R) => /slice\s*\(\s*0\s*,\s*20\s*\)/.test(v[A]) && R.m3, 'ts'),
      t(2, 'sort を変えたときも page を 1 に戻す（watch([keyword, sort], …) で 2 つをまとめて監視）', ['watch の第 1 引数に配列を渡すと、どれかが変わったときに呼ばれる。', 'watch([keyword, sort], () => {\n  page.value = 1\n})'], 'watch([keyword, sort], () => {\n  page.value = 1\n})', { file: A, find: ['④ '] }, (v, R) => /watch\s*\(\s*\[\s*keyword\s*,\s*sort\s*\]/.test(v[A]) && R.m4, 'ts'),
      t(2, 'watch の引数に型を付け、changeNote を「「前の語」→「今の語」」にする（next: string, prev: string）', ['watch の関数は (新しい値, 古い値) の順で受け取る。どちらも string と型を書く。', "watch(keyword, (next: string, prev: string) => {\n  changeNote.value = '「' + prev + '」→「' + next + '」'\n})"], "watch(keyword, (next: string, prev: string) => {\n  changeNote.value = '「' + prev + '」→「' + next + '」'\n})", { file: A, find: ['⑤ '] }, (v, R) => /\(\s*\w+\s*:\s*string\s*,\s*\w+\s*:\s*string\s*[,)]/.test(v[A]) && R.m5, 'ts'),
      t(3, '入力が止まって 200ms 後に searched を更新し、searchCount を 1 増やす（打っている途中は呼ばない）', ['watch の第 3 引数 onCleanup は「次に呼ばれる前」に実行される。そこで前のタイマーを止める。', 'watch(keyword, (next: string, _prev: string, onCleanup) => {\n  const id = setTimeout(() => { ... }, 200)\n  onCleanup(() => clearTimeout(id))\n})'], "watch(keyword, (next: string, _prev: string, onCleanup) => {\n  const id = setTimeout(() => {\n    searched.value = next\n    searchCount.value++\n  }, 200)\n  onCleanup(() => clearTimeout(id))\n})", { file: A, find: ['⑥ '] }, (v, R) => /onCleanup/.test(v[A]) && /clearTimeout/.test(v[A]) && R.m6, 'ts'),
    ],
  });

  /* ---- 使い分け：ReservationForm.vue ---- */
  const RES_API = `// 弁護士・空き時間 API の代わり
export interface Lawyer {
  id: number
  name: string
}

const SLOTS: Record<number, string[]> = {
  1: ['10:00', '14:00'],
  2: ['11:00', '16:00'],
}

export async function fetchLawyers(): Promise<Lawyer[]> {
  await new Promise((resolve) => setTimeout(resolve, 60))
  return [
    { id: 1, name: '佐藤 弁護士' },
    { id: 2, name: '鈴木 弁護士' },
  ]
}

export async function fetchSlots(lawyerId: number): Promise<string[]> {
  await new Promise((resolve) => setTimeout(resolve, 60))
  return SLOTS[lawyerId] ?? []
}
`;
  const RES = `<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { fetchLawyers, fetchSlots } from './api'
import type { Lawyer } from './api'

const lawyers = ref<Lawyer[]>([])
const lawyerId = ref(0)
const date = ref('')
const time = ref('')
const minutes = ref(30)
const slots = ref<string[]>([])
const loadingSlots = ref(false)
const reservations = ref<string[]>([])

const yen = (n: number): string => '¥' + n.toLocaleString('ja-JP')

// ① 【computed】相談料金 fee：minutes ÷ 30 × 5,500 円（材料が変わったときだけ計算し直す）
const fee = ref(0)

// ② 【method】「予約する」を押したとき：reservations に「日付 時間」の文字列を 1 件足す
function reserve(): void {}

// ③ 【onMounted】画面が表示された直後に 1 回だけ、fetchLawyers() の結果を lawyers に入れる

// ④ 【watch】日付 date が変わったら、選んでいた時間 time を '' に戻す

// ⑤ 【computed】canSubmit：弁護士・日付・時間の 3 つがそろっているときだけ true
const canSubmit = ref(true)

// ⑥ 【watch】弁護士 lawyerId が変わったら fetchSlots で slots を取り直す（取り直している間は loadingSlots を true）
</script>

<template>
  <h2>相談の予約</h2>
  <select v-model.number="lawyerId">
    <option :value="0" disabled>弁護士を選ぶ</option>
    <option v-for="l in lawyers" :key="l.id" :value="l.id">{{ l.name }}</option>
  </select>
  <input v-model="date" type="date" />
  <input v-model="time" type="time" />
  <select v-model.number="minutes">
    <option :value="30">30分</option>
    <option :value="60">60分</option>
  </select>
  <p v-if="loadingSlots">空き時間を確認中…</p>
  <p v-else-if="slots.length">空き時間：{{ slots.join(' / ') }}</p>
  <p>相談料金：{{ yen(fee) }}</p>
  <button :disabled="!canSubmit" @click="reserve">予約する</button>
  <ul>
    <li v-for="r in reservations" :key="r">{{ r }}</li>
  </ul>
</template>
`;
  const setSel = async (win, el, val) => { el.value = String(val); el.dispatchEvent(new win.Event('change', { bubbles: true })); await nt(win, 0); };
  LIFE['使い分け：computed / method / watch / フック'] = drill({
    height: 380,
    alias: { [A]: 'ReservationForm.vue' },
    paths: { [A]: 'src/components/ReservationForm.vue', 'api.ts': 'src/api.ts' },
    fileNotes: { [A]: '相談予約フォーム', 'api.ts': '弁護士・空き時間 API の代わり（触らない）' },
    files: { [A]: RES, 'api.ts': RES_API },
    edits: { [A]: [
      ['// ① 【computed】相談料金 fee：minutes ÷ 30 × 5,500 円（材料が変わったときだけ計算し直す）\nconst fee = ref(0)', 'const fee = computed<number>(() => (minutes.value / 30) * 5500)'],
      ['function reserve(): void {}', 'function reserve(): void {\n  reservations.value.push(date.value + \' \' + time.value)\n}'],
      ['// ③ 【onMounted】画面が表示された直後に 1 回だけ、fetchLawyers() の結果を lawyers に入れる\n', 'onMounted(async () => {\n  lawyers.value = await fetchLawyers()\n})\n'],
      ["// ④ 【watch】日付 date が変わったら、選んでいた時間 time を '' に戻す\n", "watch(date, () => {\n  time.value = ''\n})\n"],
      ['// ⑤ 【computed】canSubmit：弁護士・日付・時間の 3 つがそろっているときだけ true\nconst canSubmit = ref(true)', "const canSubmit = computed<boolean>(\n  () => lawyerId.value !== 0 && date.value !== '' && time.value !== '',\n)"],
      ['// ⑥ 【watch】弁護士 lawyerId が変わったら fetchSlots で slots を取り直す（取り直している間は loadingSlots を true）\n', 'watch(lawyerId, async (id: number) => {\n  loadingSlots.value = true\n  try {\n    slots.value = await fetchSlots(id)\n  } finally {\n    loadingSlots.value = false\n  }\n})\n'],
    ] },
    probe: async (win, doc) => {
      const o = {}; const sels = () => doc.querySelectorAll('select'); const btn = () => doc.querySelector('button');
      const inp = (type) => doc.querySelector('input[type=' + type + ']');
      await nt(win, 200);
      await step(o, 'm3', () => sels()[0].options.length === 3 && sels()[0].textContent.includes('鈴木'));
      await step(o, 'm1', async () => {
        const a = txt(doc).includes('相談料金：¥5,500'); await setSel(win, sels()[1], 60); return a && txt(doc).includes('相談料金：¥11,000');
      });
      await step(o, 'm5', async () => {
        const off = btn().disabled; await setSel(win, sels()[0], 1); await typeInto(win, inp('date'), '2026-12-01'); const half = btn().disabled;
        await typeInto(win, inp('time'), '10:00'); return off && half && !btn().disabled;
      });
      await step(o, 'm2', async () => { btn().click(); await nt(win); return doc.querySelectorAll('li').length === 1 && doc.querySelector('li').textContent.trim() === '2026-12-01 10:00'; });
      await step(o, 'm4', async () => { const a = inp('time').value === '10:00'; await typeInto(win, inp('date'), '2026-12-02'); return a && inp('time').value === ''; });
      await step(o, 'm6', async () => {
        await setSel(win, sels()[0], 2); const during = txt(doc).includes('確認中'); await nt(win, 200);
        return during && txt(doc).includes('空き時間：11:00 / 16:00') && !txt(doc).includes('確認中');
      });
      return o;
    },
    tasks: [
      t(1, '【computed】相談料金 fee を computed にする（minutes ÷ 30 × 5,500 円。30分 → 60分で ¥11,000）', ['表示用の計算は computed。材料の minutes が変わると自動で計算し直される。', '(minutes.value / 30) * 5500'], 'const fee = computed<number>(() => (minutes.value / 30) * 5500)', { file: A, find: ['① '] }, (v, R) => /fee\s*=\s*computed/.test(v[A]) && R.m1, 'ts'),
      t(1, '【method】reserve で、予約を「2026-12-01 10:00」の形で reservations に足す', ['ボタンを押したときの処理は、ふつうの関数（method）でよい。配列に足すのは push。', "reservations.value.push(date.value + ' ' + time.value)"], "function reserve(): void {\n  reservations.value.push(date.value + ' ' + time.value)\n}", { file: A, find: ['② '] }, (v, R) => /reservations\.value\.push\s*\(/.test(v[A]) && R.m2, 'ts'),
      t(1, '【onMounted】画面が表示された直後に fetchLawyers() を呼び、弁護士の選択肢を出す', ['「表示された直後に 1 回だけ」は onMounted。await を使うなら async の関数を渡す。', 'onMounted(async () => {\n  lawyers.value = await fetchLawyers()\n})'], 'onMounted(async () => {\n  lawyers.value = await fetchLawyers()\n})', { file: A, find: ['③ '] }, (v, R) => /onMounted\s*\(/.test(v[A]) && R.m3, 'ts'),
      t(2, '【watch】日付 date が変わったら、選んでいた時間 time を空に戻す（値の変化に反応する副作用）', ['「変わったら○○する」は watch。時間を空にするのは time.value = \'\'。', "watch(date, () => {\n  time.value = ''\n})"], "watch(date, () => {\n  time.value = ''\n})", { file: A, find: ['④ '] }, (v, R) => /watch\s*\(\s*date/.test(v[A]) && R.m4, 'ts'),
      t(2, '【computed】canSubmit を作り、弁護士・日付・時間がそろうまで「予約する」を押せなくする', ['true / false を返す computed を、:disabled="!canSubmit" が使っている。', "computed<boolean>(\n  () => lawyerId.value !== 0 && date.value !== '' && time.value !== '',\n)"], "const canSubmit = computed<boolean>(\n  () => lawyerId.value !== 0 && date.value !== '' && time.value !== '',\n)", { file: A, find: ['⑤ '] }, (v, R) => /canSubmit\s*=\s*computed/.test(v[A]) && R.m5, 'ts'),
      t(3, '【watch】弁護士を変えたら fetchSlots で空き時間を取り直し、取得中は「空き時間を確認中…」を出す', ['watch の関数も async にできる。try / finally で、成功しても失敗しても loadingSlots を false に戻す。', 'watch(lawyerId, async (id: number) => {\n  loadingSlots.value = true\n  try {\n    slots.value = await fetchSlots(id)\n  } finally {\n    loadingSlots.value = false\n  }\n})'], 'watch(lawyerId, async (id: number) => {\n  loadingSlots.value = true\n  try {\n    slots.value = await fetchSlots(id)\n  } finally {\n    loadingSlots.value = false\n  }\n})', { file: A, find: ['⑥ '] }, (v, R) => /watch\s*\(\s*lawyerId/.test(v[A]) && /fetchSlots/.test(v[A].replace(/import[^\n]*\n/, '')) && R.m6, 'ts'),
    ],
  });

  /* ---- 実例：相談一覧が開く瞬間（CasePageHost.vue ＋ CaseListPage.vue） ---- */
  const LP_API = `// 案件 API の代わり（150ms かかる。window.__empty が true のときは 0 件）
export interface Case {
  id: number
  title: string
}

export async function fetchCases(): Promise<Case[]> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  if ((window as any).__empty) return []
  return [
    { id: 1, title: '未払い残業代の請求' },
    { id: 2, title: '賃貸の敷金返還' },
    { id: 3, title: '相続放棄の手続き' },
  ]
}
`;
  const LP_HOST = `<script setup lang="ts">
import { ref } from 'vue'
import CaseListPage from './CaseListPage.vue'

// タブの題名の「元の値」。一覧を閉じたら、これに戻したい
document.title = '研修ナビ'

const open = ref<boolean>(true)
</script>

<template>
  <button @click="open = !open">{{ open ? '一覧を閉じる' : '一覧を開く' }}</button>
  <CaseListPage v-if="open" />
</template>
`;
  const LP = `<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { fetchCases } from './api'
import type { Case } from './api'

const cases = ref<Case[]>([])
const loading = ref(true)

// ⑥ 画面を閉じたかどうかの目印 alive を作り、onUnmounted で false にする

async function load(): Promise<void> {
  // ② 取得が終わったら loading を false にする（失敗しても必ず戻す：try / finally）
  cases.value = await fetchCases()
  // ③ 取得できたら、タブの題名（document.title）を「相談一覧（3件）」にする
  // ⑥ 閉じたあとに結果が届いたときは、何も更新しない
}

// ① 画面が表示された直後に load を呼ぶ

// ④ 画面を閉じるとき、タブの題名を元の「研修ナビ」に戻す
</script>

<template>
  <h2>相談一覧</h2>
  <p v-if="loading">読み込み中…</p>
  <!-- ⑤ 取得が終わって 0 件のときは「相談はまだありません」を出す -->
  <ul>
    <li v-for="c in cases" :key="c.id">{{ c.title }}</li>
  </ul>
</template>
`;
  const click = async (win, el, ms) => { el.click(); await nt(win, ms == null ? 0 : ms); };
  LIFE['実例：相談一覧が開く瞬間'] = drill({
    height: 360,
    alias: { [A]: 'CasePageHost.vue' },
    paths: { [A]: 'src/CasePageHost.vue', 'CaseListPage.vue': 'src/pages/CaseListPage.vue', 'api.ts': 'src/api.ts' },
    fileNotes: { [A]: '一覧を開く / 閉じる（触らない）', 'CaseListPage.vue': '相談一覧のページ', 'api.ts': '案件 API の代わり（触らない）' },
    files: { [A]: LP_HOST, 'CaseListPage.vue': LP, 'api.ts': LP_API },
    edits: { 'CaseListPage.vue': [
      ['// ⑥ 画面を閉じたかどうかの目印 alive を作り、onUnmounted で false にする\n', 'let alive = true\nonUnmounted(() => {\n  alive = false\n})\n'],
      ["async function load(): Promise<void> {\n  // ② 取得が終わったら loading を false にする（失敗しても必ず戻す：try / finally）\n  cases.value = await fetchCases()\n  // ③ 取得できたら、タブの題名（document.title）を「相談一覧（3件）」にする\n  // ⑥ 閉じたあとに結果が届いたときは、何も更新しない\n}",
        "async function load(): Promise<void> {\n  try {\n    const result = await fetchCases()\n    if (!alive) return\n    cases.value = result\n    document.title = '相談一覧（' + result.length + '件）'\n  } finally {\n    if (alive) loading.value = false\n  }\n}"],
      ['// ① 画面が表示された直後に load を呼ぶ\n', 'onMounted(load)\n'],
      ["// ④ 画面を閉じるとき、タブの題名を元の「研修ナビ」に戻す\n", "onUnmounted(() => {\n  document.title = '研修ナビ'\n})\n"],
      ['<!-- ⑤ 取得が終わって 0 件のときは「相談はまだありません」を出す -->', '<p v-if="!loading && cases.length === 0">相談はまだありません</p>'],
    ] },
    probe: async (win, doc) => {
      const o = {}; const toggle = () => doc.querySelector('button');
      await nt(win, 330);
      await step(o, 'm1', () => doc.querySelectorAll('li').length === 3);
      await step(o, 'm2', () => doc.querySelectorAll('li').length === 3 && !txt(doc).includes('読み込み中'));
      await step(o, 'm3', () => doc.title === '相談一覧（3件）');
      await step(o, 'm4', async () => { await click(win, toggle()); return doc.title === '研修ナビ' && doc.querySelectorAll('li').length === 0; });
      await step(o, 'm5', async () => { win.__empty = true; await click(win, toggle(), 330); const r = txt(doc).includes('相談はまだありません'); win.__empty = false; return r; });
      await step(o, 'm6', async () => {
        await click(win, toggle()); doc.title = '研修ナビ';
        await click(win, toggle(), 20); await click(win, toggle(), 0);
        await nt(win, 400); return doc.title === '研修ナビ' && txt(doc).includes('一覧を開く');
      });
      return o;
    },
    tasks: [
      t(1, '画面が表示された直後（onMounted）に load を呼び、相談 3 件を出す', ['ページが開いた瞬間に 1 回だけ読み込むのは onMounted。', 'onMounted(load)'], 'onMounted(load)', { file: 'CaseListPage.vue', find: ['① '] }, (v, R) => /onMounted\s*\(/.test(v['CaseListPage.vue']) && R.m1, 'ts'),
      t(1, '取得が終わったら loading を false にして「読み込み中…」を消す（失敗しても必ず戻す：finally）', ['try { ... } finally { ... } の finally は、成功しても失敗しても必ず実行される。', 'try {\n  cases.value = await fetchCases()\n} finally {\n  loading.value = false\n}'], 'try {\n  cases.value = await fetchCases()\n} finally {\n  loading.value = false\n}', { file: 'CaseListPage.vue', find: ['② '] }, (v, R) => /finally/.test(v['CaseListPage.vue']) && R.m2, 'ts'),
      t(1, '取得できたら、タブの題名を「相談一覧（3件）」にする（document.title）', ['件数は取得した配列の length。文字は + でつなぐ。', "document.title = '相談一覧（' + cases.value.length + '件）'"], "document.title = '相談一覧（' + result.length + '件）'", { file: 'CaseListPage.vue', find: ['③ '] }, (v, R) => /document\.title\s*=/.test(v['CaseListPage.vue']) && R.m3, 'ts'),
      t(2, '一覧を閉じたとき（onUnmounted）に、タブの題名を元の「研修ナビ」に戻す', ['画面が消える直前に呼ばれるのが onUnmounted。後片付けはここ。', "onUnmounted(() => {\n  document.title = '研修ナビ'\n})"], "onUnmounted(() => {\n  document.title = '研修ナビ'\n})", { file: 'CaseListPage.vue', find: ['④ '] }, (v, R) => /onUnmounted\s*\([^)]*document\.title|onUnmounted\s*\(\s*\(\s*\)\s*=>\s*\{[^}]*document\.title/.test(v['CaseListPage.vue']) && R.m4, 'ts'),
      t(2, '取得が終わって 0 件のときだけ「相談はまだありません」を出す（読み込み中は出さない）', ['v-if に「読み込みが終わっている かつ 件数が 0」の条件を書く。', '<p v-if="!loading && cases.length === 0">相談はまだありません</p>'], '<p v-if="!loading && cases.length === 0">相談はまだありません</p>', { file: 'CaseListPage.vue', find: ['⑤ '] }, (v, R) => /v-if\s*=\s*["'][^"']*cases\.length\s*===?\s*0/.test(v['CaseListPage.vue']) && R.m5),
      t(3, '一覧を閉じたあとに届いた結果では、題名や一覧を更新しない（alive の目印で守る）', ['onUnmounted で alive を false にし、await のあとに if (!alive) return。', 'let alive = true\nonUnmounted(() => {\n  alive = false\n})\n// await のあと\nif (!alive) return'], 'let alive = true\nonUnmounted(() => {\n  alive = false\n})', { file: 'CaseListPage.vue', find: ['⑥ 画面を閉じた', '⑥ 閉じたあと'] }, (v, R) => /alive/.test(v['CaseListPage.vue']) && /if\s*\(\s*!\s*alive\s*\)/.test(v['CaseListPage.vue']) && R.m6, 'ts'),
    ],
  });

  /* ---- 実例：入力のたびに API？（CaseSearchHost.vue ＋ CaseSearch.vue） ---- */
  const CS_API = `// 検索 API と下書き保存の代わり
export interface Case {
  id: number
  title: string
}

const ALL: Case[] = [
  { id: 1, title: '契約書の確認相談' },
  { id: 2, title: '賃貸契約の更新' },
  { id: 3, title: '業務委託契約のトラブル' },
  { id: 4, title: '未払い残業代の請求' },
  { id: 5, title: '相続放棄の手続き' },
]

// 1 文字の検索は絞れないので遅く（500ms）、2 文字以上は速い（40ms）。実際の API でもよくある
export async function searchCases(q: string): Promise<Case[]> {
  const w = window as any
  w.__searchCalls = (w.__searchCalls || 0) + 1
  await new Promise((resolve) => setTimeout(resolve, q.length === 1 ? 500 : 40))
  return ALL.filter((c) => c.title.includes(q))
}

export function saveDraft(text: string): void {
  const w = window as any
  w.__saves = (w.__saves || 0) + 1
  w.__draft = text
}
`;
  const CS_HOST = `<script setup lang="ts">
import { ref } from 'vue'
import CaseSearch from './CaseSearch.vue'

const open = ref<boolean>(true)
</script>

<template>
  <button @click="open = !open">{{ open ? '検索を閉じる' : '検索を開く' }}</button>
  <CaseSearch v-if="open" />
</template>
`;
  const CS = `<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { saveDraft, searchCases } from './api'
import type { Case } from './api'

const keyword = ref('')
const results = ref<Case[]>([])
const searching = ref(false)

// 下書き保存のタイマー番号（止めるために覚えておく）
let timer: ReturnType<typeof setInterval> | undefined

// ① keyword が変わったら searchCases(keyword) を呼び、results に入れる（watch）
// ② 検索している間は searching を true にして「検索中…」を出す
// ③ keyword が空（空白だけも）のときは API を呼ばず、results を空にする
// ④ 打つたびに API を呼ばない：入力が止まって 200ms 待ってから呼ぶ（setTimeout。前のタイマーは onCleanup で止める）

// ⑤ 画面が表示されたら 100ms ごとに saveDraft(keyword.value) で下書きを保存し、画面を離れたら止める（setInterval / onUnmounted + clearInterval）

// ⑥ 上の watch を直す：前の検索の結果が後から届いても、results を上書きしない（古い検索は捨てる）
</script>

<template>
  <h2>相談を検索</h2>
  <input v-model="keyword" placeholder="キーワード" />
  <p v-if="searching">検索中…</p>
  <ul>
    <li v-for="c in results" :key="c.id">{{ c.title }}</li>
  </ul>
</template>
`;
  const seen = async (win, doc, word, ms) => { for (let i = 0; i < ms / 10; i++) { if (txt(doc).includes(word)) return true; await sleep(10); } return false; };
  LIFE['実例：入力のたびに API？'] = drill({
    height: 400,
    alias: { [A]: 'CaseSearchHost.vue' },
    paths: { [A]: 'src/CaseSearchHost.vue', 'CaseSearch.vue': 'src/pages/CaseSearch.vue', 'api.ts': 'src/api.ts' },
    fileNotes: { [A]: '検索を開く / 閉じる（触らない）', 'CaseSearch.vue': '相談検索ページ', 'api.ts': '検索 API の代わり（触らない）' },
    files: { [A]: CS_HOST, 'CaseSearch.vue': CS, 'api.ts': CS_API },
    edits: { 'CaseSearch.vue': [
      ['// ① keyword が変わったら searchCases(keyword) を呼び、results に入れる（watch）\n// ② 検索している間は searching を true にして「検索中…」を出す\n// ③ keyword が空（空白だけも）のときは API を呼ばず、results を空にする\n// ④ 打つたびに API を呼ばない：入力が止まって 200ms 待ってから呼ぶ（setTimeout。前のタイマーは onCleanup で止める）\n',
        "watch(keyword, (next: string, _prev: string, onCleanup) => {\n  if (next.trim() === '') {\n    results.value = []\n    searching.value = false\n    return\n  }\n  let stale = false\n  const id = setTimeout(async () => {\n    searching.value = true\n    const found = await searchCases(next)\n    if (stale) return\n    results.value = found\n    searching.value = false\n  }, 200)\n  onCleanup(() => {\n    stale = true\n    clearTimeout(id)\n  })\n})\n"],
      ['// ⑤ 画面が表示されたら 100ms ごとに saveDraft(keyword.value) で下書きを保存し、画面を離れたら止める（setInterval / onUnmounted + clearInterval）\n', 'onMounted(() => {\n  timer = setInterval(() => saveDraft(keyword.value), 100)\n})\n\nonUnmounted(() => {\n  clearInterval(timer)\n})\n'],
      ['\n// ⑥ 上の watch を直す：前の検索の結果が後から届いても、results を上書きしない（古い検索は捨てる）\n', ''],
    ] },
    probe: async (win, doc) => {
      const o = {}; const inp = () => doc.querySelector('input'); const toggle = () => doc.querySelector('button'); const lis = () => doc.querySelectorAll('li').length;
      await nt(win, 40);
      await step(o, 'm1', async () => { await typeFast(win, inp(), '契約'); await nt(win, 400); return lis() === 3; });
      await step(o, 'm3', async () => {
        await typeFast(win, inp(), ''); await nt(win, 300); const emptyOk = lis() === 0;
        const before = win.__searchCalls || 0; await typeFast(win, inp(), '  '); await nt(win, 300);
        return emptyOk && (win.__searchCalls || 0) === before && lis() === 0;
      });
      await step(o, 'm2', async () => {
        await typeFast(win, inp(), '契約'); const during = await seen(win, doc, '検索中', 500); await nt(win, 150);
        return during && !txt(doc).includes('検索中') && lis() === 3;
      });
      await step(o, 'm4', async () => {
        await typeFast(win, inp(), ''); await nt(win, 300); const before = win.__searchCalls || 0;
        await typeFast(win, inp(), '契'); await typeFast(win, inp(), '契約'); await typeFast(win, inp(), '契約書'); await nt(win, 400);
        return (win.__searchCalls || 0) === before + 1 && lis() === 1;
      });
      await step(o, 'm5', async () => {
        const a = win.__saves || 0; await nt(win, 250); const grew = (win.__saves || 0) >= a + 2 && /契約書/.test(win.__draft || '');
        const mid = win.__searchCalls || 0; toggle().click(); await nt(win, 30); const b = win.__saves; await nt(win, 250);
        return grew && typeof b === 'number' && win.__saves === b && lis() === 0 && (win.__searchCalls || 0) === mid;
      });
      await step(o, 'm6', async () => {
        toggle().click(); await nt(win, 30);
        await typeFast(win, inp(), '契'); await nt(win, 250); await typeFast(win, inp(), '契約書'); await nt(win, 800);
        return lis() === 1 && doc.querySelector('li').textContent.includes('契約書');
      });
      return o;
    },
    tasks: [
      t(1, 'keyword が変わったら searchCases を呼び、結果を results に入れる（「契約」で 3 件）', ['値の変化に反応するのは watch。searchCases は Promise を返すので await する。', 'watch(keyword, async (next: string) => {\n  results.value = await searchCases(next)\n})'], 'watch(keyword, async (next: string) => {\n  results.value = await searchCases(next)\n})', { file: 'CaseSearch.vue', find: ['① '] }, (v, R) => /watch\s*\(\s*keyword/.test(v['CaseSearch.vue']) && R.m1, 'ts'),
      t(1, '検索している間は searching を true にして「検索中…」を出し、終わったら消す', ['await の前で true、結果を入れたあとで false。', 'searching.value = true\nresults.value = await searchCases(next)\nsearching.value = false'], 'searching.value = true\nconst found = await searchCases(next)\nresults.value = found\nsearching.value = false', { file: 'CaseSearch.vue', find: ['② '] }, (v, R) => /searching\.value\s*=\s*true/.test(v['CaseSearch.vue']) && /searching\.value\s*=\s*false/.test(v['CaseSearch.vue']) && R.m2, 'ts'),
      t(1, 'keyword が空（空白だけも）のときは API を呼ばず、results を空にする', ['trim() で前後の空白を取ってから、空文字か調べる。空なら early return。', "if (next.trim() === '') {\n  results.value = []\n  return\n}"], "if (next.trim() === '') {\n  results.value = []\n  return\n}", { file: 'CaseSearch.vue', find: ['③ '] }, (v, R) => /trim\s*\(\s*\)/.test(v['CaseSearch.vue']) && R.m3, 'ts'),
      t(2, '「契」「契約」「契約書」と続けて打っても API は 1 回だけ（入力が止まって 200ms 待つ。setTimeout + onCleanup）', ['watch の第 3 引数 onCleanup は、次に watch が動く前に呼ばれる。そこで前のタイマーを止める。', 'const id = setTimeout(async () => {\n  ...\n}, 200)\nonCleanup(() => clearTimeout(id))'], 'const id = setTimeout(async () => {\n  searching.value = true\n  const found = await searchCases(next)\n  results.value = found\n  searching.value = false\n}, 200)\nonCleanup(() => {\n  clearTimeout(id)\n})', { file: 'CaseSearch.vue', find: ['④ '] }, (v, R) => /setTimeout/.test(v['CaseSearch.vue']) && /onCleanup/.test(v['CaseSearch.vue']) && R.m4, 'ts'),
      t(2, '画面が表示されたら 100ms ごとに下書きを保存し（setInterval）、画面を離れたらタイマーを止める（onUnmounted + clearInterval）', ['止め忘れたタイマーは、画面が消えても動き続ける（通信やメモリの無駄・バグのもと）。', 'onMounted(() => {\n  timer = setInterval(() => saveDraft(keyword.value), 100)\n})\n\nonUnmounted(() => {\n  clearInterval(timer)\n})'], 'onMounted(() => {\n  timer = setInterval(() => saveDraft(keyword.value), 100)\n})\n\nonUnmounted(() => {\n  clearInterval(timer)\n})', { file: 'CaseSearch.vue', find: ['⑤ '] }, (v, R) => /onMounted\s*\(/.test(v['CaseSearch.vue']) && /setInterval/.test(v['CaseSearch.vue']) && /clearInterval\s*\(\s*timer/.test(v['CaseSearch.vue']) && R.m5, 'ts'),
      t(3, '「契」（1 文字は遅い）のあとに「契約書」を打ったとき、遅れて届く前の結果で上書きされないようにする（古い検索を捨てる）', ['古い検索かどうかの目印 stale を作り、onCleanup で true にする。await のあとで if (stale) return。', 'let stale = false\nonCleanup(() => {\n  stale = true\n})\n// await のあと\nif (stale) return'], 'let stale = false\nconst id = setTimeout(async () => {\n  searching.value = true\n  const found = await searchCases(next)\n  if (stale) return\n  results.value = found\n  searching.value = false\n}, 200)\nonCleanup(() => {\n  stale = true\n  clearTimeout(id)\n})', { file: 'CaseSearch.vue', find: ['⑥ '] }, (v, R) => /stale|cancel|latest|token/i.test(v['CaseSearch.vue']) && R.m6, 'ts'),
    ],
  });

  /* ---- 実践：ライフサイクル+計算（PriceBoard.vue） ---- */
  const PB_API = `// 弁護士と 30 分あたりの相談料 API の代わり
export interface Lawyer {
  id: number
  name: string
  rate: number
}

export async function fetchLawyers(): Promise<Lawyer[]> {
  await new Promise((resolve) => setTimeout(resolve, 60))
  return [
    { id: 1, name: '佐藤', rate: 5500 },
    { id: 2, name: '鈴木', rate: 8800 },
  ]
}
`;
  const PB = `<script setup lang="ts">
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { fetchLawyers } from './api'
import type { Lawyer } from './api'

const lawyers = ref<Lawyer[]>([])
const lawyerId = ref<number>(1)
const minutes = ref<number>(60)

const yen = (n: number): string => '¥' + n.toLocaleString('ja-JP')

// ① 画面が表示された直後に fetchLawyers() を呼び、lawyers に入れる（onMounted）

// ② selected：lawyers から lawyerId の人を探す（見つからなければ undefined。computed）
const selected = ref<Lawyer | undefined>(undefined)

// ③ fee：selected の rate × (minutes ÷ 30)。まだ取得できていないときは 0（computed）
const fee = ref(0)

// ④ feeWithTax：fee の 1.1 倍（小数は切り捨て。computed）
const feeWithTax = ref(0)

// ⑤ minutes が 30 未満なら 30、180 より大きければ 180 に戻す（watch）

// ⑥ 料金が変わるたびに、タブの題名を「見積 ¥12,100（税込）」にする（watchEffect）
</script>

<template>
  <h2>相談料金の見積もり</h2>
  <select v-model.number="lawyerId">
    <option v-for="l in lawyers" :key="l.id" :value="l.id">{{ l.name }} 弁護士</option>
  </select>
  <input v-model.number="minutes" type="number" step="30" />
  <p>担当：{{ selected ? selected.name : '—' }} 弁護士</p>
  <p>相談料金：{{ yen(fee) }}</p>
  <p>税込：{{ yen(feeWithTax) }}</p>
</template>
`;
  LIFE['実践：ライフサイクル+計算'] = drill({
    height: 380,
    alias: { [A]: 'PriceBoard.vue' },
    paths: { [A]: 'src/components/PriceBoard.vue', 'api.ts': 'src/api.ts' },
    fileNotes: { [A]: '相談料金の見積もり画面', 'api.ts': '弁護士 API の代わり（触らない）' },
    files: { [A]: PB, 'api.ts': PB_API },
    edits: { [A]: [
      ['// ① 画面が表示された直後に fetchLawyers() を呼び、lawyers に入れる（onMounted）\n', 'onMounted(async () => {\n  lawyers.value = await fetchLawyers()\n})\n'],
      ['// ② selected：lawyers から lawyerId の人を探す（見つからなければ undefined。computed）\nconst selected = ref<Lawyer | undefined>(undefined)', 'const selected = computed<Lawyer | undefined>(() =>\n  lawyers.value.find((l) => l.id === lawyerId.value),\n)'],
      ['// ③ fee：selected の rate × (minutes ÷ 30)。まだ取得できていないときは 0（computed）\nconst fee = ref(0)', 'const fee = computed<number>(() =>\n  selected.value ? selected.value.rate * (minutes.value / 30) : 0,\n)'],
      ['// ④ feeWithTax：fee の 1.1 倍（小数は切り捨て。computed）\nconst feeWithTax = ref(0)', 'const feeWithTax = computed<number>(() => Math.floor(fee.value * 1.1))'],
      ['// ⑤ minutes が 30 未満なら 30、180 より大きければ 180 に戻す（watch）\n', 'watch(minutes, (m: number) => {\n  if (m < 30) minutes.value = 30\n  else if (m > 180) minutes.value = 180\n})\n'],
      ['// ⑥ 料金が変わるたびに、タブの題名を「見積 ¥12,100（税込）」にする（watchEffect）\n', "watchEffect(() => {\n  document.title = '見積 ' + yen(feeWithTax.value) + '（税込）'\n})\n"],
    ] },
    probe: async (win, doc) => {
      const o = {}; const sel = () => doc.querySelector('select'); const inp = () => doc.querySelector('input');
      await nt(win, 220);
      await step(o, 'm1', () => sel().options.length === 2);
      await step(o, 'm2', () => txt(doc).includes('担当：佐藤 弁護士'));
      await step(o, 'm3', async () => { const a = txt(doc).includes('相談料金：¥11,000'); await setSel(win, sel(), 2); return a && txt(doc).includes('相談料金：¥17,600'); });
      await step(o, 'm4', () => txt(doc).includes('税込：¥19,360'));
      await step(o, 'm6', async () => { const a = doc.title === '見積 ¥19,360（税込）'; await typeInto(win, inp(), '30'); return a && doc.title === '見積 ¥9,680（税込）'; });
      await step(o, 'm5', async () => {
        await typeInto(win, inp(), '10'); await nt(win, 0); const lo = inp().value === '30';
        await typeInto(win, inp(), '500'); await nt(win, 0); return lo && inp().value === '180';
      });
      return o;
    },
    tasks: [
      t(1, '画面が表示された直後（onMounted）に fetchLawyers() を呼び、弁護士の選択肢を出す', ['最初に 1 回だけデータを取りに行くのは onMounted。', 'onMounted(async () => {\n  lawyers.value = await fetchLawyers()\n})'], 'onMounted(async () => {\n  lawyers.value = await fetchLawyers()\n})', { file: A, find: ['① '] }, (v, R) => /onMounted\s*\(/.test(v[A]) && R.m1, 'ts'),
      t(1, 'selected を computed<Lawyer | undefined> で作る（lawyerId の人を lawyers から探す）', ['配列から 1 件探すのは find。見つからないと undefined なので、型にも | undefined を付ける。', 'lawyers.value.find((l) => l.id === lawyerId.value)'], 'const selected = computed<Lawyer | undefined>(() =>\n  lawyers.value.find((l) => l.id === lawyerId.value),\n)', { file: A, find: ['② '] }, (v, R) => /selected\s*=\s*computed\s*<\s*Lawyer\s*\|\s*undefined\s*>/.test(v[A]) && R.m2, 'ts'),
      t(1, '相談料金 fee を computed にする（rate × minutes ÷ 30。未取得なら 0）。弁護士を変えると追従する', ['selected は computed なので、script では selected.value。未取得（undefined）のときは 0。', 'selected.value ? selected.value.rate * (minutes.value / 30) : 0'], 'const fee = computed<number>(() =>\n  selected.value ? selected.value.rate * (minutes.value / 30) : 0,\n)', { file: A, find: ['③ '] }, (v, R) => /fee\s*=\s*computed/.test(v[A]) && R.m3, 'ts'),
      t(2, '税込 feeWithTax を computed にする（fee の 1.1 倍、小数は切り捨て）', ['computed の材料に、別の computed（fee）を使ってよい。', 'Math.floor(fee.value * 1.1)'], 'const feeWithTax = computed<number>(() => Math.floor(fee.value * 1.1))', { file: A, find: ['④ '] }, (v, R) => /feeWithTax\s*=\s*computed/.test(v[A]) && R.m4, 'ts'),
      t(2, '分数 minutes が 30 未満なら 30、180 より大きければ 180 に戻す（watch）', ['watch の中で、監視している minutes 自身を書き換えて範囲に収める。', 'watch(minutes, (m: number) => {\n  if (m < 30) minutes.value = 30\n  else if (m > 180) minutes.value = 180\n})'], 'watch(minutes, (m: number) => {\n  if (m < 30) minutes.value = 30\n  else if (m > 180) minutes.value = 180\n})', { file: A, find: ['⑤ '] }, (v, R) => /watch\s*\(\s*minutes/.test(v[A]) && R.m5, 'ts'),
      t(3, '料金が変わるたびに、タブの題名を「見積 ¥19,360（税込）」にそろえる（watchEffect。最初の 1 回も動く）', ['watchEffect は最初に 1 回動き、中で読んだ値が変わるたびにまた動く。', "watchEffect(() => {\n  document.title = '見積 ' + yen(feeWithTax.value) + '（税込）'\n})"], "watchEffect(() => {\n  document.title = '見積 ' + yen(feeWithTax.value) + '（税込）'\n})", { file: A, find: ['⑥ '] }, (v, R) => /watchEffect\s*\(/.test(v[A]) && /document\.title/.test(v[A]) && R.m6, 'ts'),
    ],
  });

  /* =============================== vue-router =============================== */
  const ROUTER = D['vue-router'];
  const RLIBS = [VUE, VROUTER];
  const rgo = async (win, p, ms) => { await win.eval('router.push(' + JSON.stringify(p) + ')'); await nt(win, ms == null ? 30 : ms); };
  const rfull = (win) => win.eval('router.currentRoute.value.fullPath');
  const rq = (win) => win.eval('router.currentRoute.value.query');
  const link = (doc, href) => doc.querySelector('a[href="' + href + '"]');
  const rclick = async (win, el, ms) => { el.click(); await nt(win, ms == null ? 40 : ms); };
  const RV = (h2, body) => '<script setup lang="ts">\n</script>\n\n<template>\n  <h2>' + h2 + '</h2>\n' + (body ? '  ' + body + '\n' : '') + '</template>\n';
  const RIMP = "import { createRouter, createMemoryHistory } from 'vue-router'\nimport type { RouteRecordRaw } from 'vue-router'\n";
  const RTAIL = '\nconst router = createRouter({\n  history: createMemoryHistory(),\n  routes,\n})\n';
  const SHELL = (nav, extra) => '<script setup lang="ts">\n' + (extra || '') + '</script>\n\n<template>\n  <nav>\n' + nav + '\n  </nav>\n  <RouterView />\n</template>\n';
  const rdrill = (cfg) => drill(Object.assign({ libs: RLIBS, height: 360 }, cfg));

  /* ---- URL ↔ コンポーネント：SiteLayout.vue ---- */
  const R1_ROUTER = RIMP + "import HomeView from './HomeView.vue'\nimport CaseList from './CaseList.vue'\nimport ContactView from './ContactView.vue'\nimport NotFoundView from './NotFoundView.vue'\n\n" +
    "const routes: RouteRecordRaw[] = [\n  { path: '/', component: HomeView },\n  // ① /cases を CaseList に結ぶ\n  // ② /contact を ContactView に結ぶ（④ で使う name: 'contact' も付けておく）\n  // ⑤ 古い URL /consult を /contact へ転送する（redirect）\n  // ⑥ どの URL にも合わないときは NotFoundView（path は '/:pathMatch(.*)*'）\n]\n" + RTAIL + '\nexport default router\n';
  const R1_NAV = '    <RouterLink to="/">ホーム</RouterLink>\n    <!-- ③ 案件一覧（/cases）へのリンクを RouterLink で作る -->\n    <!-- ④ お問い合わせへのリンクを、パスではなく名前（:to="{ name: \'contact\' }"）で作る -->';
  ROUTER['URL ↔ コンポーネント'] = rdrill({
    alias: { [A]: 'SiteLayout.vue' },
    paths: { [A]: 'src/layouts/SiteLayout.vue', 'router.ts': 'src/router/index.ts', 'HomeView.vue': 'src/views/HomeView.vue', 'CaseList.vue': 'src/views/CaseList.vue', 'ContactView.vue': 'src/views/ContactView.vue', 'NotFoundView.vue': 'src/views/NotFoundView.vue' },
    fileNotes: { [A]: 'メニューと画面の入れ物', 'router.ts': 'URL と画面の対応表' },
    files: { 'router.ts': R1_ROUTER, [A]: SHELL(R1_NAV), 'HomeView.vue': RV('ホーム｜法律相談ナビ'), 'CaseList.vue': RV('相談案件の一覧'), 'ContactView.vue': RV('お問い合わせフォーム'), 'NotFoundView.vue': RV('ページが見つかりません（404）') },
    edits: {
      'router.ts': [["  // ① /cases を CaseList に結ぶ\n  // ② /contact を ContactView に結ぶ（④ で使う name: 'contact' も付けておく）\n  // ⑤ 古い URL /consult を /contact へ転送する（redirect）\n  // ⑥ どの URL にも合わないときは NotFoundView（path は '/:pathMatch(.*)*'）\n",
        "  { path: '/cases', component: CaseList },\n  { path: '/contact', name: 'contact', component: ContactView },\n  { path: '/consult', redirect: '/contact' },\n  { path: '/:pathMatch(.*)*', component: NotFoundView },\n"]],
      [A]: [[R1_NAV, '    <RouterLink to="/">ホーム</RouterLink>\n    <RouterLink to="/cases">案件一覧</RouterLink>\n    <RouterLink :to="{ name: \'contact\' }">お問い合わせ</RouterLink>']],
    },
    probe: async (win, doc) => {
      const o = {}; await nt(win, 120);
      await step(o, 'm1', async () => { await rgo(win, '/cases'); return txt(doc).includes('相談案件の一覧'); });
      await step(o, 'm2', async () => { await rgo(win, '/contact'); return txt(doc).includes('お問い合わせフォーム'); });
      await step(o, 'm3', async () => { await rgo(win, '/'); const a = link(doc, '/cases'); if (!a) return false; await rclick(win, a); return (await rfull(win)) === '/cases' && txt(doc).includes('相談案件の一覧'); });
      await step(o, 'm4', async () => { const a = link(doc, '/contact'); if (!a) return false; await rgo(win, '/'); await rclick(win, a); return (await rfull(win)) === '/contact'; });
      await step(o, 'm5', async () => { await rgo(win, '/consult'); return (await rfull(win)) === '/contact' && txt(doc).includes('お問い合わせフォーム'); });
      await step(o, 'm6', async () => { await rgo(win, '/no-such-page'); return txt(doc).includes('404'); });
      return o;
    },
    tasks: [
      t(1, 'router.ts に、/cases と CaseList 画面を結ぶルートを足す', ['routes は「URL（path）と画面（component）の対応表」。1 行が 1 組。', "{ path: '/cases', component: CaseList }"], "{ path: '/cases', component: CaseList },", { file: 'router.ts', find: ['① '] }, (v, R) => /path\s*:\s*['"]\/cases['"][^}]*component\s*:\s*CaseList/.test(v['router.ts']) && R.m1, 'ts'),
      t(1, 'router.ts に、/contact と ContactView 画面を結ぶルートを足す（name: \'contact\' も付ける）', ['書き方は /cases と同じ。name は後でリンクに使う、このルートの「あだ名」。', "{ path: '/contact', name: 'contact', component: ContactView }"], "{ path: '/contact', name: 'contact', component: ContactView },", { file: 'router.ts', find: ['② '] }, (v, R) => /path\s*:\s*['"]\/contact['"][^}]*component\s*:\s*ContactView/.test(v['router.ts']) && R.m2, 'ts'),
      t(1, 'メニューに、RouterLink で /cases への「案件一覧」リンクを作る', ['普通の <a> ではなく RouterLink を使うと、ページを読み込み直さずに画面だけ切り替わる。', '<RouterLink to="/cases">案件一覧</RouterLink>'], '<RouterLink to="/cases">案件一覧</RouterLink>', { file: A, find: ['③ '] }, (v, R) => /<RouterLink[^>]*\sto\s*=\s*["']\/cases["']/.test(v[A]) && R.m3),
      t(2, 'お問い合わせのリンクを、パスではなくルートの名前で作る（:to="{ name: \'contact\' }"）', ['to に オブジェクトを渡すと、name で行き先を指定できる。パスを書き換えてもリンクが壊れにくい。', '<RouterLink :to="{ name: \'contact\' }">お問い合わせ</RouterLink>'], '<RouterLink :to="{ name: \'contact\' }">お問い合わせ</RouterLink>', { file: A, find: ['④ '] }, (v, R) => /name\s*:\s*['"]contact['"]/.test(v['router.ts']) && /:to\s*=\s*["']\{\s*name\s*:\s*['"]contact['"]/.test(v[A]) && R.m4),
      t(2, '古い URL /consult を開いたら、/contact へ転送する（redirect）', ['ルートに component の代わりに redirect を書くと、別の URL に転送される。', "{ path: '/consult', redirect: '/contact' }"], "{ path: '/consult', redirect: '/contact' },", { file: 'router.ts', find: ['⑤ '] }, (v, R) => /redirect\s*:/.test(v['router.ts']) && R.m5, 'ts'),
      t(3, 'どの URL にも合わないときは NotFoundView（404）を出す（path は \'/:pathMatch(.*)*\'。いちばん最後に置く）', ['(.*)* は「何でも合う」の印。ルートは上から順に探されるので、最後に置く。', "{ path: '/:pathMatch(.*)*', component: NotFoundView }"], "{ path: '/:pathMatch(.*)*', component: NotFoundView },", { file: 'router.ts', find: ['⑥ '] }, (v, R) => /pathMatch\(\.\*\)\*/.test(v['router.ts']) && R.m6, 'ts'),
    ],
  });

  /* ---- 動的ルート：CaseShell.vue ＋ CaseDetail.vue ---- */
  const R2_DATA = `// 案件 API の代わり
export interface Case {
  id: number
  title: string
  area: string
}

const CASES: Case[] = [
  { id: 1, title: '未払い残業代の請求', area: '労働' },
  { id: 2, title: '賃貸の敷金返還', area: '不動産' },
  { id: 3, title: '相続放棄の手続き', area: '相続' },
]

export async function fetchCase(id: number): Promise<Case | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 40))
  return CASES.find((c) => c.id === id)
}

export const ALL_CASES: Case[] = CASES
`;
  const R2_ROUTER = RIMP + "import CaseList from './CaseList.vue'\nimport CaseDetail from './CaseDetail.vue'\n\nconst routes: RouteRecordRaw[] = [\n  { path: '/', component: CaseList },\n  // ① /cases/:id を CaseDetail に結ぶ（:id は URL の一部を受け取る変数）\n]\n" + RTAIL + '\nexport default router\n';
  const R2_LIST = `<script setup lang="ts">
import { ALL_CASES } from './data'
import type { Case } from './data'

const cases: Case[] = ALL_CASES
</script>

<template>
  <h2>相談案件</h2>
  <ul>
    <!-- ③ 案件ごとに、/cases/案件番号 への RouterLink を作る（v-for と :key も） -->
    <li>未払い残業代の請求</li>
    <li>賃貸の敷金返還</li>
    <li>相続放棄の手続き</li>
  </ul>
</template>
`;
  const R2_DETAIL = `<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchCase } from './data'
import type { Case } from './data'

const route = useRoute()
const detail = ref<Case | null>(null)
const loading = ref(true)

async function load(id: number): Promise<void> {
  loading.value = true
  detail.value = (await fetchCase(id)) ?? null
  loading.value = false
}

// ④ 画面が表示されたら、URL の id（数値にする）で load を呼ぶ（onMounted）
// ⑥ 「次の案件へ」で id だけ変わっても、案件が入れ替わるようにする（URL の id を watch）
</script>

<template>
  <h2>案件詳細</h2>
  <!-- ② URL の :id（route.params.id）を表示する -->
  <p>案件番号：</p>
  <p v-if="loading">読み込み中…</p>
  <!-- ⑤ 取得が終わって detail が無いときは「案件が見つかりません」 -->
  <p v-else-if="detail">件名：{{ detail.title }}（{{ detail.area }}）</p>
  <RouterLink :to="'/cases/' + (Number(route.params.id) + 1)">次の案件へ</RouterLink>
</template>
`;
  const R2_SHELL = SHELL('    <RouterLink to="/">案件一覧</RouterLink>');
  ROUTER['動的ルート /users/:id'] = rdrill({
    height: 380,
    alias: { [A]: 'CaseShell.vue' },
    paths: { [A]: 'src/CaseShell.vue', 'router.ts': 'src/router/index.ts', 'CaseList.vue': 'src/views/CaseList.vue', 'CaseDetail.vue': 'src/views/CaseDetail.vue', 'data.ts': 'src/data.ts' },
    fileNotes: { [A]: '共通メニュー（触らない）', 'router.ts': 'URL と画面の対応表', 'CaseDetail.vue': '案件の詳細ページ', 'data.ts': '案件 API の代わり（触らない）' },
    files: { 'router.ts': R2_ROUTER, [A]: R2_SHELL, 'CaseList.vue': R2_LIST, 'CaseDetail.vue': R2_DETAIL, 'data.ts': R2_DATA },
    edits: {
      'router.ts': [["  // ① /cases/:id を CaseDetail に結ぶ（:id は URL の一部を受け取る変数）\n", "  { path: '/cases/:id', component: CaseDetail },\n"]],
      'CaseList.vue': [['    <!-- ③ 案件ごとに、/cases/案件番号 への RouterLink を作る（v-for と :key も） -->\n    <li>未払い残業代の請求</li>\n    <li>賃貸の敷金返還</li>\n    <li>相続放棄の手続き</li>', '    <li v-for="c in cases" :key="c.id">\n      <RouterLink :to="\'/cases/\' + c.id">{{ c.title }}</RouterLink>\n    </li>']],
      'CaseDetail.vue': [
        ['// ④ 画面が表示されたら、URL の id（数値にする）で load を呼ぶ（onMounted）\n// ⑥ 「次の案件へ」で id だけ変わっても、案件が入れ替わるようにする（URL の id を watch）\n', "onMounted(() => load(Number(route.params.id)))\n\nwatch(\n  () => route.params.id,\n  (id) => load(Number(id)),\n)\n"],
        ['  <!-- ② URL の :id（route.params.id）を表示する -->\n  <p>案件番号：</p>', '  <p>案件番号：{{ route.params.id }}</p>'],
        ['  <!-- ⑤ 取得が終わって detail が無いときは「案件が見つかりません」 -->\n', '  <p v-else-if="!detail">案件が見つかりません</p>\n'],
      ],
    },
    probe: async (win, doc) => {
      const o = {}; await nt(win, 120);
      await step(o, 'm1', async () => { await rgo(win, '/cases/2', 100); return (await rfull(win)) === '/cases/2' && txt(doc).includes('案件詳細'); });
      await step(o, 'm2', async () => { await rgo(win, '/cases/3', 100); return txt(doc).includes('案件番号：3'); });
      await step(o, 'm3', async () => {
        await rgo(win, '/'); const hs = [...doc.querySelectorAll('li a')].map((a) => a.getAttribute('href'));
        if (hs.join() !== '/cases/1,/cases/2,/cases/3') return false;
        await rclick(win, doc.querySelectorAll('li a')[1], 120); return (await rfull(win)) === '/cases/2';
      });
      await step(o, 'm4', async () => { await rgo(win, '/'); await rgo(win, '/cases/2', 150); return txt(doc).includes('件名：賃貸の敷金返還（不動産）'); });
      await step(o, 'm5', async () => { await rgo(win, '/'); await rgo(win, '/cases/99', 150); return txt(doc).includes('案件が見つかりません') && !txt(doc).includes('読み込み中'); });
      await step(o, 'm6', async () => {
        await rgo(win, '/'); await rgo(win, '/cases/1', 150); const a = txt(doc).includes('件名：未払い残業代の請求');
        await rclick(win, [...doc.querySelectorAll('a')].find((x) => x.textContent.includes('次の案件')), 150);
        return a && (await rfull(win)) === '/cases/2' && txt(doc).includes('件名：賃貸の敷金返還') && txt(doc).includes('案件番号：2');
      });
      return o;
    },
    tasks: [
      t(1, 'router.ts に、/cases/:id と CaseDetail 画面を結ぶルートを足す（:id は URL の一部を受け取る変数）', ['path の中の :id は「何が入ってもよい場所」。/cases/1 でも /cases/2 でも同じ画面に届く。', "{ path: '/cases/:id', component: CaseDetail }"], "{ path: '/cases/:id', component: CaseDetail },", { file: 'router.ts', find: ['① '] }, (v, R) => /path\s*:\s*['"]\/cases\/:id['"][^}]*component\s*:\s*CaseDetail/.test(v['router.ts']) && R.m1, 'ts'),
      t(1, 'CaseDetail.vue に、URL の id を「案件番号：3」の形で表示する（route.params.id）', ['useRoute() で今の URL の情報が取れる。route.params.id が :id の中身。', '<p>案件番号：{{ route.params.id }}</p>'], '<p>案件番号：{{ route.params.id }}</p>', { file: 'CaseDetail.vue', find: ['② '] }, (v, R) => /\{\{\s*route\.params\.id\s*\}\}/.test(v['CaseDetail.vue']) && R.m2),
      t(1, 'CaseList.vue で、案件ごとに /cases/案件番号 への RouterLink を作る（v-for + :key）', ['リンク先は文字をつなげて作る：\'/cases/\' + c.id。属性に式を渡すので :to。', '<li v-for="c in cases" :key="c.id">\n  <RouterLink :to="\'/cases/\' + c.id">{{ c.title }}</RouterLink>\n</li>'], '<li v-for="c in cases" :key="c.id">\n  <RouterLink :to="\'/cases/\' + c.id">{{ c.title }}</RouterLink>\n</li>', { file: 'CaseList.vue', find: ['③ '] }, (v, R) => /v-for/.test(v['CaseList.vue']) && /:to\s*=/.test(v['CaseList.vue']) && R.m3),
      t(2, '画面が表示されたら、URL の id を数値にして load に渡し、件名を表示する（onMounted）', ['route.params.id は文字列。Number(...) で数値にしてから load へ。', 'onMounted(() => load(Number(route.params.id)))'], 'onMounted(() => load(Number(route.params.id)))', { file: 'CaseDetail.vue', find: ['④ '] }, (v, R) => /Number\s*\(/.test(v['CaseDetail.vue']) && R.m4, 'ts'),
      t(2, '存在しない案件（/cases/99）のときは「案件が見つかりません」を出す', ['読み込みが終わって detail が null のとき。v-if / v-else-if / v-else-if と続けて書く。', '<p v-else-if="!detail">案件が見つかりません</p>'], '<p v-else-if="!detail">案件が見つかりません</p>', { file: 'CaseDetail.vue', find: ['⑤ '] }, (v, R) => R.m5),
      t(3, '「次の案件へ」で /cases/1 → /cases/2 に進んだとき、同じ画面のまま中身が入れ替わるようにする（route.params.id を watch）', ['同じ部品のまま id だけ変わる移動では、onMounted は再び呼ばれない。URL の id を watch して load し直す。', 'watch(\n  () => route.params.id,\n  (id) => load(Number(id)),\n)'], 'watch(\n  () => route.params.id,\n  (id) => load(Number(id)),\n)', { file: 'CaseDetail.vue', find: ['⑥ '] }, (v, R) => /watch\s*\(/.test(v['CaseDetail.vue']) && /params\.id/.test(v['CaseDetail.vue']) && R.m6, 'ts'),
    ],
  });

  /* ---- ナビゲーションガード：MemberLayout.vue ---- */
  const R3_AUTH = `// ログイン状態（本当はサーバーのセッションで確認する）
export interface AuthState {
  loggedIn: boolean
  role: 'client' | 'lawyer'
}

export const auth = reactive<AuthState>({ loggedIn: false, role: 'client' })

export function login(role: 'client' | 'lawyer'): void {
  auth.loggedIn = true
  auth.role = role
}

export function logout(): void {
  auth.loggedIn = false
  auth.role = 'client'
}
`;
  const R3_ROUTER = RIMP + "import { auth } from './auth'\nimport HomeView from './HomeView.vue'\nimport MyPageView from './MyPageView.vue'\nimport AdminView from './AdminView.vue'\nimport LoginView from './LoginView.vue'\nimport ForbiddenView from './ForbiddenView.vue'\n\n" +
    "const routes: RouteRecordRaw[] = [\n  { path: '/', component: HomeView },\n  { path: '/mypage', component: MyPageView }, // ② meta: { requiresAuth: true } を付ける\n  { path: '/admin', component: AdminView }, // ② ⑥ meta に requiresAuth と、role: 'lawyer'（弁護士だけ）を付ける\n  { path: '/login', component: LoginView },\n  { path: '/forbidden', component: ForbiddenView },\n]\n" + RTAIL +
    "\n// ① 関所（beforeEach）：未ログイン（auth.loggedIn が false）の人が /admin に入ろうとしたら '/login' へ戻す\n// ② ① を広げる：path ではなく to.meta.requiresAuth を見て判定する\n// ④ ログイン済みの人が /login を開こうとしたら '/' へ戻す\n// ⑥ ロール：to.meta.role があり、auth.role と違うなら '/forbidden' へ\n\nexport default router\n";
  const R3_SHELL = `<script setup lang="ts">
import { useRouter } from 'vue-router'
import { auth, logout } from './auth'

const router = useRouter()
const state = auth

// ⑤ ログアウト：logout() を呼んで、'/login' へ移動する
function signOut(): void {}
</script>

<template>
  <nav>
    <RouterLink to="/">ホーム</RouterLink>
    <RouterLink to="/mypage">マイページ</RouterLink>
    <RouterLink to="/admin">管理画面</RouterLink>
    <button v-if="state.loggedIn" @click="signOut">ログアウト</button>
  </nav>
  <RouterView />
</template>
`;
  const R3_LOGIN = `<script setup lang="ts">
import { useRouter } from 'vue-router'
import { login } from './auth'

const router = useRouter()

function signIn(): void {
  // ③ 依頼者（'client'）としてログインし、マイページ（/mypage）へ移動する
}
</script>

<template>
  <h2>ログイン</h2>
  <button @click="signIn">依頼者としてログイン</button>
</template>
`;
  ROUTER['ナビゲーションガード'] = rdrill({
    height: 400,
    alias: { [A]: 'MemberLayout.vue' },
    paths: { [A]: 'src/layouts/MemberLayout.vue', 'router.ts': 'src/router/index.ts', 'auth.ts': 'src/auth.ts', 'LoginView.vue': 'src/views/LoginView.vue', 'HomeView.vue': 'src/views/HomeView.vue', 'MyPageView.vue': 'src/views/MyPageView.vue', 'AdminView.vue': 'src/views/AdminView.vue', 'ForbiddenView.vue': 'src/views/ForbiddenView.vue' },
    fileNotes: { [A]: 'メニューとログアウト', 'router.ts': '関所（ガード）を書く場所', 'auth.ts': 'ログイン状態（触らない）', 'LoginView.vue': 'ログイン画面' },
    files: { 'router.ts': R3_ROUTER, [A]: R3_SHELL, 'LoginView.vue': R3_LOGIN, 'auth.ts': R3_AUTH, 'HomeView.vue': RV('ホーム'), 'MyPageView.vue': RV('マイページ（依頼中の相談）'), 'AdminView.vue': RV('管理画面（弁護士専用）'), 'ForbiddenView.vue': RV('この画面を開く権限がありません（403）') },
    edits: {
      'router.ts': [
        ["  { path: '/mypage', component: MyPageView }, // ② meta: { requiresAuth: true } を付ける\n  { path: '/admin', component: AdminView }, // ② ⑥ meta に requiresAuth と、role: 'lawyer'（弁護士だけ）を付ける\n",
          "  { path: '/mypage', component: MyPageView, meta: { requiresAuth: true } },\n  { path: '/admin', component: AdminView, meta: { requiresAuth: true, role: 'lawyer' } },\n"],
        ["// ① 関所（beforeEach）：未ログイン（auth.loggedIn が false）の人が /admin に入ろうとしたら '/login' へ戻す\n// ② ① を広げる：path ではなく to.meta.requiresAuth を見て判定する\n// ④ ログイン済みの人が /login を開こうとしたら '/' へ戻す\n// ⑥ ロール：to.meta.role があり、auth.role と違うなら '/forbidden' へ\n",
          "router.beforeEach((to) => {\n  if (to.path === '/login' && auth.loggedIn) return '/'\n  if (to.meta.requiresAuth && !auth.loggedIn) return '/login'\n  if (to.meta.role && to.meta.role !== auth.role) return '/forbidden'\n})\n"],
      ],
      [A]: [['// ⑤ ログアウト：logout() を呼んで、\'/login\' へ移動する\nfunction signOut(): void {}', "function signOut(): void {\n  logout()\n  router.push('/login')\n}"]],
      'LoginView.vue': [["  // ③ 依頼者（'client'）としてログインし、マイページ（/mypage）へ移動する\n", "  login('client')\n  router.push('/mypage')\n"]],
    },
    probe: async (win, doc) => {
      const o = {}; await nt(win, 120);
      const btn = (s) => [...doc.querySelectorAll('button')].find((b) => b.textContent.includes(s));
      await step(o, 'm1', async () => { await rgo(win, '/admin'); return (await rfull(win)) === '/login'; });
      await step(o, 'm2', async () => { await rgo(win, '/'); await rgo(win, '/mypage'); const a = (await rfull(win)) === '/login'; await rgo(win, '/'); return a && (await rfull(win)) === '/'; });
      await step(o, 'm3', async () => { await rgo(win, '/login'); await rclick(win, btn('ログイン')); return (await rfull(win)) === '/mypage' && txt(doc).includes('マイページ'); });
      await step(o, 'm4', async () => { await rgo(win, '/login'); return (await rfull(win)) === '/'; });
      let forb = false;
      await step(o, 'm6a', async () => { await rgo(win, '/admin'); forb = (await rfull(win)) === '/forbidden' && txt(doc).includes('403'); return forb; });
      await step(o, 'm5', async () => { await rclick(win, btn('ログアウト')); return (await rfull(win)) === '/login' && !(await win.eval('auth.loggedIn')); });
      await step(o, 'm6', async () => { await win.eval("login('lawyer')"); await rgo(win, '/admin'); return forb && (await rfull(win)) === '/admin' && txt(doc).includes('管理画面（弁護士専用）'); });
      return o;
    },
    tasks: [
      t(1, 'router.beforeEach で関所を作り、未ログインの人が /admin を開こうとしたら /login へ戻す', ['beforeEach は、ページを移動する直前に毎回呼ばれる。文字列を return すると、そこへ行き先が変わる。', "router.beforeEach((to) => {\n  if (to.path === '/admin' && !auth.loggedIn) return '/login'\n})"], "router.beforeEach((to) => {\n  if (to.path === '/admin' && !auth.loggedIn) return '/login'\n})", { file: 'router.ts', find: ['① '] }, (v, R) => /router\.beforeEach\s*\(/.test(v['router.ts']) && R.m1, 'ts'),
      t(1, 'ルートに meta: { requiresAuth: true } を付け、ガードは to.meta.requiresAuth で判定する（/mypage も守られる）', ['meta はルートに付ける「メモ」。ページが増えても、メモを付けるだけで守れる。', "{ path: '/mypage', component: MyPageView, meta: { requiresAuth: true } }\n// ガード側\nif (to.meta.requiresAuth && !auth.loggedIn) return '/login'"], "{ path: '/mypage', component: MyPageView, meta: { requiresAuth: true } },\n// ガード側\nif (to.meta.requiresAuth && !auth.loggedIn) return '/login'", { file: 'router.ts', find: ['// ② meta', '② ① を広げる'] }, (v, R) => /meta\s*:\s*\{[^}]*requiresAuth/.test(v['router.ts']) && /to\.meta\.requiresAuth/.test(v['router.ts']) && R.m2, 'ts'),
      t(1, 'LoginView の「ログイン」で login(\'client\') を呼び、/mypage へ移動する（router.push）', ['ボタンを押したときなど「コードで移動する」ときは、useRouter() の router.push。', "login('client')\nrouter.push('/mypage')"], "login('client')\nrouter.push('/mypage')", { file: 'LoginView.vue', find: ['③ '] }, (v, R) => /router\.push\s*\(/.test(v['LoginView.vue']) && R.m3, 'ts'),
      t(2, 'ログイン済みの人が /login を開こうとしたら、/ へ戻す', ['条件は「行き先が /login」かつ「auth.loggedIn が true」。', "if (to.path === '/login' && auth.loggedIn) return '/'"], "if (to.path === '/login' && auth.loggedIn) return '/'", { file: 'router.ts', find: ['④ '] }, (v, R) => R.m4, 'ts'),
      t(2, 'ログアウトで logout() を呼び、/login へ移動する（その後は /mypage も開けない）', ['logout() は auth をログアウト状態に戻す関数。そのあとコードで /login へ。', "logout()\nrouter.push('/login')"], "function signOut(): void {\n  logout()\n  router.push('/login')\n}", { file: A, find: ['⑤ '] }, (v, R) => /logout\s*\(\s*\)/.test(v[A].replace('import { auth, logout }', '')) && R.m5, 'ts'),
      t(3, '弁護士だけの画面：meta に role: \'lawyer\' を付け、依頼者が /admin を開いたら /forbidden（403）へ。弁護士なら入れる', ['to.meta.role と auth.role を比べる。違えば /forbidden。ログイン済みでも権限が足りない、を区別する。', "if (to.meta.role && to.meta.role !== auth.role) return '/forbidden'"], "{ path: '/admin', component: AdminView, meta: { requiresAuth: true, role: 'lawyer' } },\n// ガード側\nif (to.meta.role && to.meta.role !== auth.role) return '/forbidden'", { file: 'router.ts', find: ['// ② ⑥ meta', '⑥ ロール'] }, (v, R) => /role\s*:\s*['"]lawyer['"]/.test(v['router.ts']) && /to\.meta\.role/.test(v['router.ts']) && R.m6, 'ts'),
    ],
  });

  /* ---- 使い分け：ConsultShell.vue ---- */
  const R4_STATE = `// 相談フォームの入力状態
export interface ConsultFormState {
  title: string
  dirty: boolean
}

export const consultForm = reactive<ConsultFormState>({ title: '', dirty: false })

// 保存して、新しい案件番号を返す（本当は API）
export function saveCase(): number {
  consultForm.title = ''
  consultForm.dirty = false
  return 4
}

export function login(): void {
  // 本当はサーバーに認証を依頼する
}
`;
  const R4_ROUTER = RIMP + "import { consultForm } from './state'\nimport CaseList from './CaseList.vue'\nimport CaseDetail from './CaseDetail.vue'\nimport ConsultForm from './ConsultForm.vue'\nimport LoginView from './LoginView.vue'\n\n" +
    "const routes: RouteRecordRaw[] = [\n  { path: '/', component: CaseList },\n  { path: '/cases/:id', name: 'case', component: CaseDetail },\n  { path: '/new', component: ConsultForm },\n  { path: '/login', component: LoginView },\n]\n" + RTAIL +
    "\n// ⑥ 未保存（consultForm.dirty が true）のまま /new から他のページへ出ようとしたら、移動を止める（beforeEach で false を return）\n\nexport default router\n";
  const R4_SHELL = SHELL('    <RouterLink to="/">案件一覧</RouterLink>\n    <!-- ① 「新規相談」（/new）へ移動するメニューを RouterLink で作る -->\n    <RouterLink to="/login">ログイン</RouterLink>');
  const R4_FORM = `<script setup lang="ts">
import { useRouter } from 'vue-router'
import { consultForm, saveCase } from './state'

const router = useRouter()
const form = consultForm

function save(): void {
  const id = saveCase()
  // ② 保存できたら、コードで /cases/案件番号 へ移動する（router.push）
  // ④ ② を、パスの文字列ではなく名前つきルート（name: 'case' と params: { id }）で書き直す
}

function goBack(): void {
  // ③ 1つ前のページへ戻る（router.back）
}
</script>

<template>
  <h2>新規相談</h2>
  <input v-model="form.title" placeholder="相談の件名" @input="form.dirty = true" />
  <button @click="save">保存する</button>
  <button @click="goBack">戻る</button>
</template>
`;
  const R4_LOGIN = `<script setup lang="ts">
import { useRouter } from 'vue-router'
import { login } from './state'

const router = useRouter()

function signIn(): void {
  login()
  // ⑤ /new へ移動する。ただし「戻る」でこのログイン画面に戻れないよう、履歴を置き換える（router.replace）
}
</script>

<template>
  <h2>ログイン</h2>
  <button @click="signIn">ログインして相談する</button>
</template>
`;
  ROUTER['使い分け：RouterLink と push'] = rdrill({
    height: 400,
    alias: { [A]: 'ConsultShell.vue' },
    paths: { [A]: 'src/ConsultShell.vue', 'router.ts': 'src/router/index.ts', 'state.ts': 'src/state.ts', 'ConsultForm.vue': 'src/views/ConsultForm.vue', 'LoginView.vue': 'src/views/LoginView.vue', 'CaseList.vue': 'src/views/CaseList.vue', 'CaseDetail.vue': 'src/views/CaseDetail.vue' },
    fileNotes: { [A]: 'メニュー（人が押す）', 'ConsultForm.vue': '新規相談フォーム', 'LoginView.vue': 'ログイン画面', 'state.ts': 'フォームの状態（触らない）' },
    files: { 'router.ts': R4_ROUTER, [A]: R4_SHELL, 'ConsultForm.vue': R4_FORM, 'LoginView.vue': R4_LOGIN, 'state.ts': R4_STATE, 'CaseList.vue': RV('案件一覧'), 'CaseDetail.vue': '<script setup lang="ts">\nimport { useRoute } from \'vue-router\'\n\nconst route = useRoute()\n</script>\n\n<template>\n  <h2>案件 {{ route.params.id }} の詳細</h2>\n</template>\n' },
    edits: {
      'router.ts': [["// ⑥ 未保存（consultForm.dirty が true）のまま /new から他のページへ出ようとしたら、移動を止める（beforeEach で false を return）\n",
        "router.beforeEach((to, from) => {\n  if (consultForm.dirty && from.path === '/new' && to.path !== '/new') return false\n})\n"]],
      [A]: [['    <!-- ① 「新規相談」（/new）へ移動するメニューを RouterLink で作る -->', '    <RouterLink to="/new">新規相談</RouterLink>']],
      'ConsultForm.vue': [
        ["  // ② 保存できたら、コードで /cases/案件番号 へ移動する（router.push）\n  // ④ ② を、パスの文字列ではなく名前つきルート（name: 'case' と params: { id }）で書き直す\n", "  router.push({ name: 'case', params: { id } })\n"],
        ['  // ③ 1つ前のページへ戻る（router.back）\n', '  router.back()\n'],
      ],
      'LoginView.vue': [["  // ⑤ /new へ移動する。ただし「戻る」でこのログイン画面に戻れないよう、履歴を置き換える（router.replace）\n", "  router.replace('/new')\n"]],
    },
    probe: async (win, doc) => {
      const o = {}; await nt(win, 120);
      const btn = (s) => [...doc.querySelectorAll('button')].find((b) => b.textContent.includes(s));
      await step(o, 'm1', async () => { const a = link(doc, '/new'); if (!a) return false; await rclick(win, a); return (await rfull(win)) === '/new' && txt(doc).includes('新規相談'); });
      await step(o, 'm3', async () => { await rgo(win, '/'); await rgo(win, '/new'); await rclick(win, btn('戻る')); return (await rfull(win)) === '/'; });
      await step(o, 'm2', async () => { await rgo(win, '/new'); await rclick(win, btn('保存')); return (await rfull(win)) === '/cases/4' && txt(doc).includes('案件 4 の詳細'); });
      await step(o, 'm5', async () => {
        await rgo(win, '/'); await rgo(win, '/login'); await rclick(win, btn('ログイン')); const a = (await rfull(win)) === '/new';
        await win.eval('router.back()'); await nt(win, 40); return a && (await rfull(win)) === '/';
      });
      await step(o, 'm6', async () => {
        await rgo(win, '/'); await rgo(win, '/new'); await typeFast(win, doc.querySelector('input'), '相続の相談'); await nt(win, 10);
        await rgo(win, '/'); const stay = (await rfull(win)) === '/new';
        await rclick(win, btn('保存'), 60); return stay && (await rfull(win)) === '/cases/4';
      });
      return o;
    },
    tasks: [
      t(1, '人が押すメニューに、RouterLink で /new（新規相談）へのリンクを作る', ['メニューのように「人がクリックして移動する」ものは RouterLink。', '<RouterLink to="/new">新規相談</RouterLink>'], '<RouterLink to="/new">新規相談</RouterLink>', { file: A, find: ['① '] }, (v, R) => /<RouterLink[^>]*\sto\s*=\s*["']\/new["']/.test(v[A]) && R.m1),
      t(1, '保存できたら、コードで /cases/4 へ移動する（router.push）', ['「保存が終わったら移動する」のようにコードが決める移動は router.push。', "router.push('/cases/' + id)"], "router.push('/cases/' + id)", { file: 'ConsultForm.vue', find: ['② '] }, (v, R) => /router\.push\s*\(/.test(v['ConsultForm.vue']) && R.m2, 'ts'),
      t(1, '「戻る」ボタンで、1つ前のページへ戻る（router.back）', ['履歴をさかのぼるのは router.back()。進む場所を指定する push とは別物。', 'router.back()'], 'router.back()', { file: 'ConsultForm.vue', find: ['③ '] }, (v, R) => /router\.back\s*\(\s*\)|router\.go\s*\(\s*-1\s*\)/.test(v['ConsultForm.vue']) && R.m3, 'ts'),
      t(2, '保存後の移動を、名前つきルートで書く（router.push({ name: \'case\', params: { id } })）', ['パスの文字列を組み立てる代わりに、ルートの name と params を渡す。URL の形を変えても壊れにくい。', "router.push({ name: 'case', params: { id } })"], "router.push({ name: 'case', params: { id } })", { file: 'ConsultForm.vue', find: ['④ '] }, (v, R) => /router\.push\s*\(\s*\{[^}]*name\s*:\s*['"]case['"][\s\S]*params\s*:/.test(v['ConsultForm.vue']) && R.m2, 'ts'),
      t(2, 'ログイン後は /new へ移動するが、「戻る」でログイン画面に戻れないようにする（router.replace）', ['push は履歴に積む。replace は今の履歴を置き換える。ログイン画面は履歴に残したくない。', "router.replace('/new')"], "router.replace('/new')", { file: 'LoginView.vue', find: ['⑤ '] }, (v, R) => /router\.replace\s*\(/.test(v['LoginView.vue']) && R.m5, 'ts'),
      t(3, '入力途中（未保存）のまま他のページへ出ようとしたら、移動を止める。保存すれば移動できる', ['beforeEach で false を return すると、その移動はキャンセルされる。from は「今いる場所」。', "router.beforeEach((to, from) => {\n  if (consultForm.dirty && from.path === '/new' && to.path !== '/new') return false\n})"], "router.beforeEach((to, from) => {\n  if (consultForm.dirty && from.path === '/new' && to.path !== '/new') return false\n})", { file: 'router.ts', find: ['⑥ '] }, (v, R) => /beforeEach/.test(v['router.ts']) && /dirty/.test(v['router.ts']) && R.m6, 'ts'),
    ],
  });

  const rpath = (win) => win.eval('router.currentRoute.value.path');

  /* ---- 実例：URLとルート表（PortalLayout.vue ＋ 子ルート） ---- */
  const R5_ROUTER = RIMP + "import CaseList from './CaseList.vue'\nimport CaseLayout from './CaseLayout.vue'\nimport CaseSummary from './CaseSummary.vue'\nimport CaseHistory from './CaseHistory.vue'\nimport NotFoundView from './NotFoundView.vue'\n\n" +
    "const routes: RouteRecordRaw[] = [\n  { path: '/', component: CaseList, meta: { title: '相談案件の一覧' } },\n  // ① /cases/:id を CaseLayout に結ぶ（案件ページの枠）。meta の title は '案件の詳細'\n  //   ② 子ルート '' を CaseSummary に結ぶ（/cases/2 に出る概要）\n  //   ③ 子ルート 'history' を CaseHistory に結ぶ（/cases/2/history に出る履歴）\n  //   ⑤ :id は数字だけにする（path を '/cases/:id(\\\\d+)' に。/cases/abc は NotFoundView へ落ちる）\n  { path: '/:pathMatch(.*)*', component: NotFoundView, meta: { title: 'ページが見つかりません' } },\n]\n" + RTAIL +
    "\n// ⑥ ページを移動し終えるたびに、タブの題名を「meta.title | 研修ナビ」にする（router.afterEach）\n\nexport default router\n";
  const R5_LAYOUT = `<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <h2>案件 {{ route.params.id }}</h2>
  <!-- ④ 「概要」と「履歴」のタブを RouterLink で作る（/cases/番号 と /cases/番号/history） -->
  <RouterView />
</template>
`;
  const R5_LIST = `<script setup lang="ts">
</script>

<template>
  <h2>相談案件の一覧</h2>
  <ul>
    <li><RouterLink to="/cases/1">未払い残業代の請求</RouterLink></li>
    <li><RouterLink to="/cases/2">賃貸の敷金返還</RouterLink></li>
  </ul>
</template>
`;
  ROUTER['実例：URLとルート表'] = rdrill({
    height: 420,
    alias: { [A]: 'PortalLayout.vue' },
    paths: { [A]: 'src/layouts/PortalLayout.vue', 'router.ts': 'src/router/index.ts', 'CaseList.vue': 'src/views/CaseList.vue', 'CaseLayout.vue': 'src/views/case/CaseLayout.vue', 'CaseSummary.vue': 'src/views/case/CaseSummary.vue', 'CaseHistory.vue': 'src/views/case/CaseHistory.vue', 'NotFoundView.vue': 'src/views/NotFoundView.vue' },
    fileNotes: { [A]: '共通メニュー（触らない）', 'router.ts': 'ルート表（親と子）', 'CaseLayout.vue': '案件ページの枠（中に子ページが入る）' },
    files: { 'router.ts': R5_ROUTER, [A]: SHELL('    <RouterLink to="/">案件一覧</RouterLink>\n    <RouterLink to="/cases/2">案件 2</RouterLink>\n    <RouterLink to="/cases/abc">不正な URL</RouterLink>'), 'CaseList.vue': R5_LIST, 'CaseLayout.vue': R5_LAYOUT,
      'CaseSummary.vue': RV('概要', '<p>この案件の概要です。</p>'), 'CaseHistory.vue': RV('履歴', '<p>この案件の更新履歴です。</p>'), 'NotFoundView.vue': RV('ページが見つかりません（404）') },
    edits: {
      'router.ts': [
        ["  // ① /cases/:id を CaseLayout に結ぶ（案件ページの枠）。meta の title は '案件の詳細'\n  //   ② 子ルート '' を CaseSummary に結ぶ（/cases/2 に出る概要）\n  //   ③ 子ルート 'history' を CaseHistory に結ぶ（/cases/2/history に出る履歴）\n  //   ⑤ :id は数字だけにする（path を '/cases/:id(\\\\d+)' に。/cases/abc は NotFoundView へ落ちる）\n",
          "  {\n    path: '/cases/:id(\\\\d+)',\n    component: CaseLayout,\n    meta: { title: '案件の詳細' },\n    children: [\n      { path: '', component: CaseSummary },\n      { path: 'history', component: CaseHistory },\n    ],\n  },\n"],
        ['// ⑥ ページを移動し終えるたびに、タブの題名を「meta.title | 研修ナビ」にする（router.afterEach）\n', "router.afterEach((to) => {\n  document.title = (to.meta.title as string) + ' | 研修ナビ'\n})\n"],
      ],
      'CaseLayout.vue': [['  <!-- ④ 「概要」と「履歴」のタブを RouterLink で作る（/cases/番号 と /cases/番号/history） -->\n', '  <nav>\n    <RouterLink :to="\'/cases/\' + route.params.id">概要</RouterLink>\n    <RouterLink :to="\'/cases/\' + route.params.id + \'/history\'">履歴</RouterLink>\n  </nav>\n']],
    },
    probe: async (win, doc) => {
      const o = {}; await nt(win, 120);
      await step(o, 'm1', async () => { await rgo(win, '/cases/2'); return txt(doc).includes('案件 2') && (await rpath(win)) === '/cases/2'; });
      await step(o, 'm2', async () => { await rgo(win, '/cases/2'); return txt(doc).includes('この案件の概要です'); });
      await step(o, 'm3', async () => { await rgo(win, '/cases/2/history'); return txt(doc).includes('この案件の更新履歴です') && !txt(doc).includes('この案件の概要です'); });
      await step(o, 'm4', async () => {
        await rgo(win, '/cases/2'); const h = link(doc, '/cases/2/history'), s = link(doc, '/cases/2'); if (!h || !s) return false;
        await rclick(win, h); const okH = txt(doc).includes('更新履歴') && h.classList.contains('router-link-exact-active') && !s.classList.contains('router-link-exact-active');
        await rclick(win, link(doc, '/cases/2')); return okH && txt(doc).includes('この案件の概要です');
      });
      await step(o, 'm5', async () => { await rgo(win, '/cases/12'); const a = txt(doc).includes('案件 12'); await rgo(win, '/cases/abc'); return a && txt(doc).includes('404') && !txt(doc).includes('案件 abc'); });
      await step(o, 'm6', async () => { await rgo(win, '/'); const a = doc.title === '相談案件の一覧 | 研修ナビ'; await rgo(win, '/cases/2'); const b = doc.title === '案件の詳細 | 研修ナビ'; await rgo(win, '/zzz'); return a && b && doc.title === 'ページが見つかりません | 研修ナビ'; });
      return o;
    },
    tasks: [
      t(1, '/cases/:id を CaseLayout（案件ページの枠）に結ぶ。/cases/2 で「案件 2」と出る', ['親ルートは「枠」になる画面。:id でどの案件か受け取る。', "{ path: '/cases/:id', component: CaseLayout }"], "{ path: '/cases/:id', component: CaseLayout, ... }", { file: 'router.ts', find: ['① '] }, (v, R) => /path\s*:\s*['"]\/cases\/:id[^'"]*['"][\s\S]{0,80}component\s*:\s*CaseLayout/.test(v['router.ts']) && R.m1, 'ts'),
      t(1, '子ルート \'\' を CaseSummary に結ぶ（/cases/2 の枠の中に「概要」が出る）', ['children の中に書く。path が空文字 \'\' の子は「親と同じ URL のとき」に出る。', "children: [\n  { path: '', component: CaseSummary },\n]"], "children: [\n  { path: '', component: CaseSummary },\n]", { file: 'router.ts', find: ['② '] }, (v, R) => /children/.test(v['router.ts']) && /path\s*:\s*['"]['"][^}]*component\s*:\s*CaseSummary/.test(v['router.ts']) && R.m2, 'ts'),
      t(1, '子ルート \'history\' を CaseHistory に結ぶ（/cases/2/history に「更新履歴」が出る）', ['子の path は、先頭の / を付けずに書く。親の URL の後ろにつながる。', "{ path: 'history', component: CaseHistory }"], "{ path: 'history', component: CaseHistory },", { file: 'router.ts', find: ['③ '] }, (v, R) => /path\s*:\s*['"]history['"][^}]*component\s*:\s*CaseHistory/.test(v['router.ts']) && R.m3, 'ts'),
      t(2, '案件ページに「概要」「履歴」のタブを RouterLink で作る（今いるタブには自動で router-link-exact-active が付く）', ['リンク先は文字をつないで作る：\'/cases/\' + route.params.id。履歴は後ろに /history。', '<RouterLink :to="\'/cases/\' + route.params.id">概要</RouterLink>\n<RouterLink :to="\'/cases/\' + route.params.id + \'/history\'">履歴</RouterLink>'], '<nav>\n  <RouterLink :to="\'/cases/\' + route.params.id">概要</RouterLink>\n  <RouterLink :to="\'/cases/\' + route.params.id + \'/history\'">履歴</RouterLink>\n</nav>', { file: 'CaseLayout.vue', find: ['④ '] }, (v, R) => (v['CaseLayout.vue'].match(/<RouterLink/g) || []).length >= 2 && R.m4),
      t(2, ':id を数字だけにする（\'/cases/:id(\\\\d+)\'）。/cases/abc は案件ページではなく 404 になる', ['path の :id のあとに (正規表現) を付けると、合う文字だけ受け付ける。TS の文字列では \\\\d と書く。', "path: '/cases/:id(\\\\d+)'"], "path: '/cases/:id(\\\\d+)',", { file: 'router.ts', find: ['⑤ '] }, (v, R) => /:id\((\\\\d|\[0-9\])\+\)/.test(v['router.ts']) && R.m5, 'ts'),
      t(3, 'ページを移動し終えるたびに、タブの題名を「案件の詳細 | 研修ナビ」のように更新する（meta.title と router.afterEach）', ['afterEach は移動が終わった後に呼ばれる。to.meta.title は、各ルートに付けたメモ。', "router.afterEach((to) => {\n  document.title = (to.meta.title as string) + ' | 研修ナビ'\n})"], "router.afterEach((to) => {\n  document.title = (to.meta.title as string) + ' | 研修ナビ'\n})", { file: 'router.ts', find: ['⑥ '] }, (v, R) => /router\.afterEach\s*\(/.test(v['router.ts']) && /meta\s*:\s*\{\s*title\s*:\s*['"]案件の詳細['"]/.test(v['router.ts']) && R.m6, 'ts'),
    ],
  });

  /* ---- 実例：ガードで /login へ（PortalLayout.vue） ---- */
  const R6_API = `// セッション確認 API の代わり（window.__session が true ならログイン済み）
export async function checkSession(): Promise<boolean> {
  const w = window as any
  w.__checks = (w.__checks || 0) + 1
  await new Promise((resolve) => setTimeout(resolve, 30))
  if (w.__sessionDown) throw new Error('network error')
  return Boolean(w.__session)
}

export function startSession(): void {
  const w = window as any
  w.__session = true
}
`;
  const R6_ROUTER = RIMP + "import { checkSession } from './api'\nimport HomeView from './HomeView.vue'\nimport CaseList from './CaseList.vue'\nimport LoginView from './LoginView.vue'\nimport ErrorView from './ErrorView.vue'\n\n" +
    "const routes: RouteRecordRaw[] = [\n  { path: '/', component: HomeView, meta: { public: true } },\n  { path: '/cases', component: CaseList },\n  { path: '/login', component: LoginView, meta: { public: true } },\n  { path: '/error', component: ErrorView, meta: { public: true } },\n]\n" + RTAIL +
    "\n// ① 関所（async の beforeEach）：await checkSession() が false なら '/login' へ。ただし /login 自身は通す（無限ループ防止）\n// ② ① の行き先を { path: '/login', query: { redirect: to.fullPath } } にして、「元の行き先」を覚えておく\n// ④ ① の「/login は通す」を path ではなく to.meta.public の判定に変える（/ や /error はセッション確認もしない）\n// ⑥ checkSession が失敗（通信エラー）したら、/login ではなく '/error' へ（try / catch）\n\nexport default router\n";
  const R6_LOGIN = `<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { startSession } from './api'

const route = useRoute()
const router = useRouter()

// ③ ログイン後に戻る先：route.query.redirect を文字列として取り出す（無ければ '/'）。computed<string>
const target = '/'

function signIn(): void {
  startSession()
  // ⑤ ログインできたら、target へ移動する（router.push）
}
</script>

<template>
  <h2>ログイン</h2>
  <p>ログイン後に戻る先：{{ target }}</p>
  <button @click="signIn">ログイン</button>
</template>
`;
  ROUTER['実例：ガードで /login へ'] = rdrill({
    height: 420,
    alias: { [A]: 'PortalLayout.vue' },
    paths: { [A]: 'src/layouts/PortalLayout.vue', 'router.ts': 'src/router/index.ts', 'api.ts': 'src/api.ts', 'LoginView.vue': 'src/views/LoginView.vue', 'HomeView.vue': 'src/views/HomeView.vue', 'CaseList.vue': 'src/views/CaseList.vue', 'ErrorView.vue': 'src/views/ErrorView.vue' },
    fileNotes: { [A]: '共通メニュー（触らない）', 'router.ts': '関所（ガード）を書く場所', 'api.ts': 'セッション確認 API の代わり（触らない）', 'LoginView.vue': 'ログイン画面' },
    files: { 'router.ts': R6_ROUTER, [A]: SHELL('    <RouterLink to="/">ホーム</RouterLink>\n    <RouterLink to="/cases">自分の相談</RouterLink>'), 'LoginView.vue': R6_LOGIN, 'api.ts': R6_API,
      'HomeView.vue': RV('ホーム（誰でも見られる）'), 'CaseList.vue': RV('自分の相談一覧'), 'ErrorView.vue': RV('通信エラーが発生しました', '<p>しばらくしてからやり直してください。</p>') },
    edits: {
      'router.ts': [["// ① 関所（async の beforeEach）：await checkSession() が false なら '/login' へ。ただし /login 自身は通す（無限ループ防止）\n// ② ① の行き先を { path: '/login', query: { redirect: to.fullPath } } にして、「元の行き先」を覚えておく\n// ④ ① の「/login は通す」を path ではなく to.meta.public の判定に変える（/ や /error はセッション確認もしない）\n// ⑥ checkSession が失敗（通信エラー）したら、/login ではなく '/error' へ（try / catch）\n",
        "router.beforeEach(async (to) => {\n  if (to.meta.public) return\n  try {\n    const ok = await checkSession()\n    if (!ok) return { path: '/login', query: { redirect: to.fullPath } }\n  } catch {\n    return '/error'\n  }\n})\n"]],
      'LoginView.vue': [
        ["// ③ ログイン後に戻る先：route.query.redirect を文字列として取り出す（無ければ '/'）。computed<string>\nconst target = '/'", "const target = computed<string>(() => (route.query.redirect as string) || '/')"],
        ['  // ⑤ ログインできたら、target へ移動する（router.push）\n', '  router.push(target.value)\n'],
      ],
    },
    probe: async (win, doc) => {
      const o = {}; await nt(win, 120);
      await step(o, 'm1', async () => { await rgo(win, '/cases', 100); return (await rpath(win)) === '/login'; });
      await step(o, 'm2', async () => { const q = await rq(win); return q.redirect === '/cases'; });
      await step(o, 'm3', async () => txt(doc).includes('ログイン後に戻る先：/cases'));
      await step(o, 'm4', async () => {
        const a = win.__checks; await rgo(win, '/'); await rgo(win, '/login'); await rgo(win, '/error');
        return a > 0 && win.__checks === a && (await rpath(win)) === '/error';
      });
      await step(o, 'm5', async () => {
        await rgo(win, '/cases', 100); const b = [...doc.querySelectorAll('button')].find((x) => x.textContent.includes('ログイン'));
        await rclick(win, b, 120); return (await rpath(win)) === '/cases' && txt(doc).includes('自分の相談一覧');
      });
      await step(o, 'm6', async () => {
        win.__session = false; win.__sessionDown = true; await rgo(win, '/'); await rgo(win, '/cases', 100);
        const r = (await rpath(win)) === '/error' && txt(doc).includes('通信エラー'); win.__sessionDown = false; return r;
      });
      return o;
    },
    tasks: [
      t(1, 'async の beforeEach で checkSession() を await し、ログインしていなければ /login へ戻す（/login 自身は通す）', ['ガードも async にできる。サーバーに聞いて答えを待ってから、行き先を決める。', "router.beforeEach(async (to) => {\n  if (to.path === '/login') return\n  const ok = await checkSession()\n  if (!ok) return '/login'\n})"], "router.beforeEach(async (to) => {\n  if (to.path === '/login') return\n  const ok = await checkSession()\n  if (!ok) return '/login'\n})", { file: 'router.ts', find: ['① '] }, (v, R) => /beforeEach\s*\(\s*async/.test(v['router.ts']) && /await\s+checkSession/.test(v['router.ts']) && R.m1, 'ts'),
      t(1, '/login へ戻すとき、元の行き先を query.redirect に入れる（{ path: \'/login\', query: { redirect: to.fullPath } }）', ['文字列の代わりに { path, query } のオブジェクトを return できる。to.fullPath が「行こうとした URL」。', "return { path: '/login', query: { redirect: to.fullPath } }"], "return { path: '/login', query: { redirect: to.fullPath } }", { file: 'router.ts', find: ['② '] }, (v, R) => /query\s*:\s*\{\s*redirect\s*:\s*to\.fullPath/.test(v['router.ts']) && R.m2, 'ts'),
      t(1, 'LoginView で「ログイン後に戻る先：/cases」と表示する（route.query.redirect を computed<string> で取り出す）', ['route.query は URL の ?redirect=… の部分。型は文字列かもしれない扱いなので、as string で絞る。', "const target = computed<string>(() => (route.query.redirect as string) || '/')"], "const target = computed<string>(() => (route.query.redirect as string) || '/')", { file: 'LoginView.vue', find: ['③ '] }, (v, R) => /target\s*=\s*computed\s*<\s*string\s*>/.test(v['LoginView.vue']) && R.m3, 'ts'),
      t(2, '/ や /error など公開ページはセッション確認をしない（path ではなく to.meta.public で判定する）', ['ルートに付けた meta.public を見る。公開ページを増やしても、ガードは書き換えなくてよい。', 'if (to.meta.public) return'], 'if (to.meta.public) return', { file: 'router.ts', find: ['④ '] }, (v, R) => /to\.meta\.public/.test(v['router.ts'].replace(/\/\/.*$/gm, '')) && R.m4, 'ts'),
      t(2, 'ログインしたら、元の行き先（target）へ戻る（router.push）', ['target は computed なので、script の中では target.value。', 'router.push(target.value)'], 'router.push(target.value)', { file: 'LoginView.vue', find: ['⑤ '] }, (v, R) => /router\.push\s*\(\s*target/.test(v['LoginView.vue']) && R.m5, 'ts'),
      t(3, 'セッション確認が通信エラーで失敗したら、/login ではなく /error へ送る（try / catch）', ['await が失敗すると例外になる。ガードの中でも try / catch で受け止められる。', "try {\n  const ok = await checkSession()\n  if (!ok) return { path: '/login', query: { redirect: to.fullPath } }\n} catch {\n  return '/error'\n}"], "try {\n  const ok = await checkSession()\n  if (!ok) return { path: '/login', query: { redirect: to.fullPath } }\n} catch {\n  return '/error'\n}", { file: 'router.ts', find: ['⑥ '] }, (v, R) => /try\s*\{/.test(v['router.ts']) && /catch/.test(v['router.ts']) && /['"]\/error['"]/.test(v['router.ts'].split('export default')[0].split('const router')[1] || '') && R.m6, 'ts'),
    ],
  });

  /* ---- 実践：ルーターを動かす（BookingLayout.vue） ---- */
  const R7_AUTH = `// ログイン状態（本当はサーバーで確認する）
export interface AuthState {
  loggedIn: boolean
}

export const auth = reactive<AuthState>({ loggedIn: false })

export function login(): void {
  auth.loggedIn = true
}
`;
  const R7_ROUTER = RIMP + "import { auth } from './auth'\nimport HomeView from './HomeView.vue'\nimport CaseList from './CaseList.vue'\nimport CaseDetail from './CaseDetail.vue'\nimport BookView from './BookView.vue'\nimport LoginView from './LoginView.vue'\nimport NotFoundView from './NotFoundView.vue'\n\n" +
    "const routes: RouteRecordRaw[] = [\n  { path: '/', component: HomeView },\n  // ① /cases を CaseList に結ぶ\n  // ② /cases/:id を CaseDetail に結ぶ\n  { path: '/book', component: BookView }, // ⑤ meta: { requiresAuth: true } を付ける\n  { path: '/login', component: LoginView },\n  // ④ どの URL にも合わないときは NotFoundView に（path は '/:pathMatch(.*)*'。最後に置く）\n]\n" + RTAIL +
    "\n// ⑤ requiresAuth が付いたページは、未ログイン（auth.loggedIn が false）なら /login へ（beforeEach）\n// ⑥ ⑤ の行き先に { path: '/login', query: { redirect: to.fullPath } } と書いて、元の行き先を覚えておく\n\nexport default router\n";
  const R7_LOGIN = `<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { login } from './auth'

const route = useRoute()
const router = useRouter()

function signIn(): void {
  login()
  // ⑥ ログイン後は、いつも / ではなく、query.redirect（元の行き先）へ戻る
  router.push('/')
}
</script>

<template>
  <h2>ログイン</h2>
  <button @click="signIn">ログイン</button>
</template>
`;
  ROUTER['実践：ルーターを動かす'] = rdrill({
    height: 440,
    alias: { [A]: 'BookingLayout.vue' },
    paths: { [A]: 'src/layouts/BookingLayout.vue', 'router.ts': 'src/router/index.ts', 'auth.ts': 'src/auth.ts', 'LoginView.vue': 'src/views/LoginView.vue', 'HomeView.vue': 'src/views/HomeView.vue', 'CaseList.vue': 'src/views/CaseList.vue', 'CaseDetail.vue': 'src/views/CaseDetail.vue', 'BookView.vue': 'src/views/BookView.vue', 'NotFoundView.vue': 'src/views/NotFoundView.vue' },
    fileNotes: { [A]: 'メニューの入れ物', 'router.ts': 'ルート表と関所', 'auth.ts': 'ログイン状態（触らない）' },
    files: { 'router.ts': R7_ROUTER, [A]: SHELL('    <RouterLink to="/">ホーム</RouterLink>\n    <!-- ③ 「案件一覧」（/cases）と「相談を予約する」（/book）へのリンクを RouterLink で作る -->'), 'LoginView.vue': R7_LOGIN, 'auth.ts': R7_AUTH,
      'HomeView.vue': RV('法律相談ナビ'), 'CaseList.vue': RV('案件一覧'), 'BookView.vue': RV('相談のご予約'), 'NotFoundView.vue': RV('ページが見つかりません（404）'),
      'CaseDetail.vue': '<script setup lang="ts">\nimport { useRoute } from \'vue-router\'\n\nconst route = useRoute()\n</script>\n\n<template>\n  <h2>案件番号：{{ route.params.id }}</h2>\n</template>\n' },
    edits: {
      'router.ts': [
        ["  // ① /cases を CaseList に結ぶ\n  // ② /cases/:id を CaseDetail に結ぶ\n  { path: '/book', component: BookView }, // ⑤ meta: { requiresAuth: true } を付ける\n  { path: '/login', component: LoginView },\n  // ④ どの URL にも合わないときは NotFoundView に（path は '/:pathMatch(.*)*'。最後に置く）\n",
          "  { path: '/cases', component: CaseList },\n  { path: '/cases/:id', component: CaseDetail },\n  { path: '/book', component: BookView, meta: { requiresAuth: true } },\n  { path: '/login', component: LoginView },\n  { path: '/:pathMatch(.*)*', component: NotFoundView },\n"],
        ["// ⑤ requiresAuth が付いたページは、未ログイン（auth.loggedIn が false）なら /login へ（beforeEach）\n// ⑥ ⑤ の行き先に { path: '/login', query: { redirect: to.fullPath } } と書いて、元の行き先を覚えておく\n",
          "router.beforeEach((to) => {\n  if (to.meta.requiresAuth && !auth.loggedIn) {\n    return { path: '/login', query: { redirect: to.fullPath } }\n  }\n})\n"],
      ],
      [A]: [['    <!-- ③ 「案件一覧」（/cases）と「相談を予約する」（/book）へのリンクを RouterLink で作る -->', '    <RouterLink to="/cases">案件一覧</RouterLink>\n    <RouterLink to="/book">相談を予約する</RouterLink>']],
      'LoginView.vue': [["  // ⑥ ログイン後は、いつも / ではなく、query.redirect（元の行き先）へ戻る\n  router.push('/')", "  router.push((route.query.redirect as string) || '/')"]],
    },
    probe: async (win, doc) => {
      const o = {}; await nt(win, 120);
      await step(o, 'm1', async () => { await rgo(win, '/cases'); return txt(doc).includes('案件一覧') && (await rpath(win)) === '/cases'; });
      await step(o, 'm2', async () => { await rgo(win, '/cases/7'); return txt(doc).includes('案件番号：7'); });
      await step(o, 'm3', async () => { await rgo(win, '/'); const a = link(doc, '/cases'), b = link(doc, '/book'); if (!a || !b) return false; await rclick(win, a); return (await rpath(win)) === '/cases'; });
      await step(o, 'm4', async () => { await rgo(win, '/no-such'); return txt(doc).includes('404'); });
      await step(o, 'm5', async () => { await rgo(win, '/'); await rgo(win, '/book'); return (await rpath(win)) === '/login' && !txt(doc).includes('相談のご予約'); });
      await step(o, 'm6', async () => {
        const q = await rq(win); const a = q.redirect === '/book';
        await rclick(win, [...doc.querySelectorAll('button')].find((x) => x.textContent.includes('ログイン')), 60);
        return a && (await rpath(win)) === '/book' && txt(doc).includes('相談のご予約');
      });
      return o;
    },
    tasks: [
      t(1, 'router.ts に、/cases と CaseList 画面を結ぶルートを足す', ['routes は「URL と画面の対応表」。', "{ path: '/cases', component: CaseList }"], "{ path: '/cases', component: CaseList },", { file: 'router.ts', find: ['① '] }, (v, R) => /path\s*:\s*['"]\/cases['"][^}]*component\s*:\s*CaseList/.test(v['router.ts']) && R.m1, 'ts'),
      t(1, 'router.ts に、/cases/:id と CaseDetail 画面を結ぶルートを足す（/cases/7 で「案件番号：7」）', [':id は URL の一部を受け取る変数。画面では route.params.id で読める。', "{ path: '/cases/:id', component: CaseDetail }"], "{ path: '/cases/:id', component: CaseDetail },", { file: 'router.ts', find: ['② '] }, (v, R) => /path\s*:\s*['"]\/cases\/:id['"][^}]*component\s*:\s*CaseDetail/.test(v['router.ts']) && R.m2, 'ts'),
      t(1, 'メニューに、RouterLink で「案件一覧」（/cases）と「相談を予約する」（/book）のリンクを作る', ['普通の <a> ではなく RouterLink。to に行き先のパスを渡す。', '<RouterLink to="/cases">案件一覧</RouterLink>\n<RouterLink to="/book">相談を予約する</RouterLink>'], '<RouterLink to="/cases">案件一覧</RouterLink>\n<RouterLink to="/book">相談を予約する</RouterLink>', { file: A, find: ['③ '] }, (v, R) => /<RouterLink[^>]*\sto\s*=\s*["']\/cases["']/.test(v[A]) && /<RouterLink[^>]*\sto\s*=\s*["']\/book["']/.test(v[A]) && R.m3),
      t(2, 'どの URL にも合わないときは NotFoundView（404）を出す（\'/:pathMatch(.*)*\' をいちばん最後に）', ['ルートは上から順に探される。何でも合うルートは最後。', "{ path: '/:pathMatch(.*)*', component: NotFoundView }"], "{ path: '/:pathMatch(.*)*', component: NotFoundView },", { file: 'router.ts', find: ['④ '] }, (v, R) => /pathMatch\(\.\*\)\*/.test(v['router.ts']) && R.m4, 'ts'),
      t(2, '/book は未ログインだと /login へ戻す（meta: { requiresAuth: true } と beforeEach）', ['meta はルートに付けるメモ。beforeEach で to.meta を見て判定する。', "router.beforeEach((to) => {\n  if (to.meta.requiresAuth && !auth.loggedIn) return '/login'\n})"], "{ path: '/book', component: BookView, meta: { requiresAuth: true } },\n// ガード側\nrouter.beforeEach((to) => {\n  if (to.meta.requiresAuth && !auth.loggedIn) return '/login'\n})", { file: 'router.ts', find: ['// ⑤ meta', '⑤ requiresAuth が付いた'] }, (v, R) => /requiresAuth/.test(v['router.ts']) && /router\.beforeEach/.test(v['router.ts']) && R.m5, 'ts'),
      t(3, 'ログインしたら、いつも / ではなく、元の行き先（/book）へ戻る（query.redirect を行き先に覚えさせ、LoginView で router.push）', ['ガードで { path: \'/login\', query: { redirect: to.fullPath } } を return。LoginView では route.query.redirect を読む。', "router.push((route.query.redirect as string) || '/')"], "router.push((route.query.redirect as string) || '/')", { file: 'LoginView.vue', find: ['⑥ '] }, (v, R) => /query\s*:\s*\{\s*redirect\s*:\s*to\.fullPath/.test(v['router.ts']) && /route\.query\.redirect/.test(v['LoginView.vue']) && R.m6, 'ts'),
    ],
  });

  /* =============================== vue-test =============================== */
  /* ブラウザの中でテストを動かす簡易ランナー（vitest ＋ @vue/test-utils の小さな互換）。
     describe / it / expect と、mount → find → trigger / setValue → emitted が使える。
     プレビューにテスト結果を出し、window.__kt に結果（各 expect の中身も）を残す。 */
  function ktShim() {
    var R = (window.__kt = { done: false, tests: [] });
    var queue = [], prefix = [], hooks = [], boxes = [], cur = null;
    var fmt = function (x) { try { return x === undefined ? 'undefined' : JSON.stringify(x); } catch (e) { return String(x); } };
    var matchers = function (recv, neg) {
      var chk = function (name, pass, exp) {
        var ok = neg ? !pass : pass;
        if (cur) cur.expects.push({ m: (neg ? 'not.' : '') + name, recv: recv, exp: exp, pass: ok });
        if (!ok) throw new Error('expect(' + fmt(recv) + ').' + (neg ? 'not.' : '') + name + '(' + (exp === undefined ? '' : fmt(exp)) + ') が成り立ちません');
      };
      return {
        toBe: function (e) { chk('toBe', Object.is(recv, e), e); },
        toEqual: function (e) { chk('toEqual', fmt(recv) === fmt(e), e); },
        toContain: function (e) { chk('toContain', recv != null && recv.indexOf(e) >= 0, e); },
        toMatch: function (e) { chk('toMatch', typeof recv === 'string' && new RegExp(e).test(recv), String(e)); },
        toBeTruthy: function () { chk('toBeTruthy', !!recv); },
        toBeFalsy: function () { chk('toBeFalsy', !recv); },
        toBeDefined: function () { chk('toBeDefined', recv !== undefined); },
        toBeUndefined: function () { chk('toBeUndefined', recv === undefined); },
        toBeNull: function () { chk('toBeNull', recv === null); },
        toHaveLength: function (n) { chk('toHaveLength', recv != null && recv.length === n, n); },
        toBeGreaterThan: function (n) { chk('toBeGreaterThan', recv > n, n); },
      };
    };
    window.expect = function (r) { var m = matchers(r, false); m.not = matchers(r, true); return m; };
    window.describe = function (name, fn) { prefix.push(name); try { fn(); } finally { prefix.pop(); } };
    window.it = window.test = function (name, fn) { queue.push({ name: prefix.concat(name).join(' › '), fn: fn }); };
    window.it.each = function (cases) {
      return function (name, fn) {
        cases.forEach(function (c) {
          var args = [].concat(c), k = 0;
          var nm = String(name).replace(/%[sdj]/g, function () { return String(args[k++]); });
          window.it(nm, function () { return fn.apply(null, args); });
        });
      };
    };
    window.beforeEach = function (fn) { hooks.push(fn); };
    window.flushPromises = function () { return new Promise(function (r) { setTimeout(r, 0); }).then(function () { return Vue.nextTick(); }); };
    var dom = function (el) {
      var need = function () { if (!el) throw new Error('要素が見つかりません（find のセレクターを確かめてください）'); };
      return {
        element: el,
        exists: function () { return !!el; },
        text: function () { need(); return el.textContent.trim(); },
        html: function () { need(); return el.outerHTML; },
        attributes: function (n) { need(); if (n) return el.hasAttribute(n) ? el.getAttribute(n) : undefined; var o = {}; [].forEach.call(el.attributes, function (a) { o[a.name] = a.value; }); return o; },
        classes: function (n) { need(); var l = [].slice.call(el.classList); return n ? l.indexOf(n) >= 0 : l; },
        trigger: function (type) {
          need(); if (el.disabled) return Vue.nextTick();
          el.dispatchEvent(/^(click|mouse)/.test(type) ? new MouseEvent(type, { bubbles: true, cancelable: true }) : new Event(type, { bubbles: true, cancelable: true }));
          return Vue.nextTick();
        },
        setValue: function (v) {
          need();
          if (el.type === 'checkbox') { el.checked = !!v; el.dispatchEvent(new Event('change', { bubbles: true })); }
          else { el.value = v; el.dispatchEvent(new Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true })); }
          return Vue.nextTick();
        },
      };
    };
    window.mount = function (Comp, opts) {
      opts = opts || {};
      var state = Vue.reactive(Object.assign({}, opts.props || {})), emitted = {}, inst = null, handlers = {};
      (Comp.emits || []).forEach(function (ev) {
        handlers['on' + ev.charAt(0).toUpperCase() + ev.slice(1)] = function () { (emitted[ev] = emitted[ev] || []).push([].slice.call(arguments)); };
      });
      var box = document.createElement('div'); document.body.appendChild(box);
      var app = Vue.createApp({ render: function () { return Vue.h(Comp, Object.assign({}, state, handlers, { ref: function (i) { inst = i; } })); } });
      app.mount(box); boxes.push({ box: box, app: app });
      var w = dom(box);
      return {
        vm: inst, element: box,
        text: w.text, html: function () { return box.innerHTML; }, exists: function () { return true; },
        find: function (sel) { return dom(box.querySelector(sel)); },
        findAll: function (sel) { return [].map.call(box.querySelectorAll(sel), dom); },
        emitted: function (n) { return n ? emitted[n] : emitted; },
        props: function () { return Object.assign({}, state); },
        setProps: function (p) { Object.assign(state, p); return Vue.nextTick(); },
        unmount: function () { app.unmount(); },
      };
    };
    var finish = function () {
      var ok = R.tests.filter(function (t) { return t.pass; }).length;
      var out = document.createElement('div'); out.id = 'kt-out';
      out.style.cssText = 'font:13px/1.7 system-ui,"Hiragino Sans",sans-serif;border:1px solid #c9cfe0;border-radius:10px;padding:8px 12px;background:#fff;color:#223';
      var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
      out.innerHTML = '<b>テスト結果　' + ok + ' / ' + R.tests.length + ' 件 成功</b>' + (R.tests.length ? '' : '<div style="color:#778">テストがまだありません</div>') +
        R.tests.map(function (t) { return '<div style="color:' + (t.pass ? '#1a8f4a' : '#c0392b') + '">' + (t.pass ? '✓ ' : '✗ ') + esc(t.name) + (t.pass ? '' : '<div style="margin-left:1.4em;color:#778;font-size:12px">' + esc(t.error) + '</div>') + '</div>'; }).join('');
      document.body.insertBefore(out, document.body.firstChild);
      R.done = true;
      try { if (window.frameElement) window.frameElement.dispatchEvent(new Event('load')); } catch (e) { /* ignore */ }
    };
    var run = function () {
      var i = 0;
      var next = function () {
        if (i >= queue.length) return finish();
        var q = queue[i++], rec = { name: q.name, pass: false, error: '', expects: [] };
        cur = rec; R.tests.push(rec);
        Promise.race([
          Promise.resolve().then(function () { hooks.forEach(function (h) { h(); }); return q.fn(); }),
          new Promise(function (_, rej) { setTimeout(function () { rej(new Error('時間切れ（await の付け忘れなど）')); }, 1500); }),
        ]).then(function () {
          if (!rec.expects.length) throw new Error('expect が 1 つもありません（確かめていないテストは成功にしません）');
          rec.pass = true;
        }).catch(function (e) { rec.error = String((e && e.message) || e); })
          .then(function () { cur = null; boxes.splice(0).forEach(function (b) { try { b.app.unmount(); } catch (e) { /* ignore */ } b.box.remove(); }); next(); });
      };
      next();
    };
    window.addEventListener('load', function () { setTimeout(run, 0); });
  }
  const KT_LIB = 'data:text/javascript;charset=utf-8,' + encodeURIComponent('(' + ktShim.toString() + ')()');
  const ktRes = (c) => { const d = c && c.doc && c.doc(); const w = d && d.defaultView; return w && w.__kt && w.__kt.done ? w.__kt : null; };
  const ktTests = (c, no) => { const k = ktRes(c); return k ? k.tests.filter((x) => x.name.split(' › ').pop().indexOf(no) === 0) : []; };
  const ktOk = (c, no, f) => { const ts = ktTests(c, no); return ts.length > 0 && ts.every((x) => x.pass) && (!f || f(ts[0], ts)); };
  const hasE = (x, f) => x.expects.some((e) => e.pass && f(e));
  const ex = (e) => String(e.exp);
  /* it('① …') の中身（次の it までの文字列）を取り出す */
  const itBody = (src, no) => { const i = src.indexOf("it('" + no); if (i < 0) return ''; const j = src.indexOf('\n  it', i + 5); const k = src.indexOf('\n  })', i); return src.slice(i, j > 0 && j < (k > 0 ? k : 1e9) ? j : k > 0 ? k : src.length); };
  const tdrill = (cfg) => drill(Object.assign({ libs: [VUE, KT_LIB], height: 420 }, cfg));
  const VT_IMPORTS = "import { describe, it, expect } from 'vitest'\nimport { mount } from '@vue/test-utils'\n";

  /* ---- mount → find → trigger → expect：ConsultSlot ---- */
  const T1_VUE = `<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{ initial?: number }>()
const emit = defineEmits<{ (e: 'reserved', remaining: number): void }>()

const slots = ref<number>(props.initial ?? 3)
const soldOut = computed<boolean>(() => slots.value === 0)

function reserve(): void {
  if (slots.value === 0) return
  slots.value--
  emit('reserved', slots.value)
}
</script>

<template>
  <section>
    <p data-testid="remaining">残り {{ slots }} 枠</p>
    <button :disabled="soldOut" @click="reserve">{{ soldOut ? '満席です' : '予約する' }}</button>
  </section>
</template>
`;
  const T1_TEST = VT_IMPORTS + `import ConsultSlot from './ConsultSlot.vue'

describe('ConsultSlot（相談の予約枠）', () => {
  it('① 初期表示：「残り 3 枠」と出る', () => {
    // ① mount して、wrapper.text() に「残り 3 枠」が含まれることを確かめる
  })

  it('② 予約ボタンを押すと「残り 2 枠」になる', async () => {
    // ② mount → find('button') → trigger('click')（await を付ける）→ 「残り 2 枠」を確かめる
  })

  it('③ ボタンの文字は「予約する」', () => {
    // ③ find('button').text() が「予約する」と等しいことを確かめる
  })

  it('④ 3 回押すと満席になり、ボタンが押せなくなる', async () => {
    // ④ 3 回 click して、ボタンの disabled 属性があることと、文字が「満席です」になることを確かめる
  })

  it('⑤ props の initial を渡すと、その枠数から始まる', () => {
    // ⑤ mount(ConsultSlot, { props: { initial: 1 } }) で「残り 1 枠」になることを確かめる
  })

  it('⑥ 予約すると reserved が emit され、残り枠数が付いてくる', async () => {
    // ⑥ 1 回 click して、wrapper.emitted('reserved') が 1 回で、中身が [2] であることを確かめる
  })
})
`;
  const T1_EDITS = [
    ["    // ① mount して、wrapper.text() に「残り 3 枠」が含まれることを確かめる\n", "    const wrapper = mount(ConsultSlot)\n    expect(wrapper.text()).toContain('残り 3 枠')\n"],
    ["    // ② mount → find('button') → trigger('click')（await を付ける）→ 「残り 2 枠」を確かめる\n", "    const wrapper = mount(ConsultSlot)\n    await wrapper.find('button').trigger('click')\n    expect(wrapper.text()).toContain('残り 2 枠')\n"],
    ["    // ③ find('button').text() が「予約する」と等しいことを確かめる\n", "    const wrapper = mount(ConsultSlot)\n    expect(wrapper.find('button').text()).toBe('予約する')\n"],
    ["    // ④ 3 回 click して、ボタンの disabled 属性があることと、文字が「満席です」になることを確かめる\n", "    const wrapper = mount(ConsultSlot)\n    const button = wrapper.find('button')\n    for (let i = 0; i < 3; i++) {\n      await button.trigger('click')\n    }\n    expect(button.attributes('disabled')).toBeDefined()\n    expect(button.text()).toBe('満席です')\n"],
    ["    // ⑤ mount(ConsultSlot, { props: { initial: 1 } }) で「残り 1 枠」になることを確かめる\n", "    const wrapper = mount(ConsultSlot, { props: { initial: 1 } })\n    expect(wrapper.text()).toContain('残り 1 枠')\n"],
    ["    // ⑥ 1 回 click して、wrapper.emitted('reserved') が 1 回で、中身が [2] であることを確かめる\n", "    const wrapper = mount(ConsultSlot)\n    await wrapper.find('button').trigger('click')\n    expect(wrapper.emitted('reserved')).toHaveLength(1)\n    expect(wrapper.emitted('reserved')?.[0]).toEqual([2])\n"],
  ];

  const TEST = D['vue-test'];
  const TPATH = (n) => ({ [n + '.vue']: 'src/components/' + n + '.vue', [n + '.test.ts']: 'src/components/__tests__/' + n + '.test.ts' });
  TEST['mount → find → trigger → expect'] = tdrill({
    height: 460,
    paths: TPATH('ConsultSlot'),
    fileNotes: { 'ConsultSlot.test.ts': 'ここにテストを書く', 'ConsultSlot.vue': 'テストされる部品（触らない）' },
    files: { 'ConsultSlot.test.ts': T1_TEST, 'ConsultSlot.vue': T1_VUE },
    edits: { 'ConsultSlot.test.ts': T1_EDITS },
    tasks: [
      t(1, '① mount して、最初の表示に「残り 3 枠」が含まれると expect で確かめる', ['mount(部品) で部品を作り、wrapper.text() で画面の文字を取る。それを expect(...).toContain(...) で確かめる。', "const wrapper = mount(ConsultSlot)\nexpect(wrapper.text()).toContain('残り 3 枠')"], "const wrapper = mount(ConsultSlot)\nexpect(wrapper.text()).toContain('残り 3 枠')", { file: 'ConsultSlot.test.ts', find: ['// ① '] }, (v, R, c) => ktOk(c, '①', (x) => hasE(x, (e) => /残り 3 枠/.test(ex(e)))) && /mount\s*\(\s*ConsultSlot/.test(itBody(v['ConsultSlot.test.ts'], '①')), 'ts'),
      t(1, '② ボタンを find して trigger(\'click\') で押し、「残り 2 枠」になると確かめる', ["find('button') でボタンを探し、trigger('click') で押す。押したあとの画面を見るので await を付ける。", "const wrapper = mount(ConsultSlot)\nawait wrapper.find('button').trigger('click')\nexpect(wrapper.text()).toContain('残り 2 枠')"], "const wrapper = mount(ConsultSlot)\nawait wrapper.find('button').trigger('click')\nexpect(wrapper.text()).toContain('残り 2 枠')", { file: 'ConsultSlot.test.ts', find: ['// ② '] }, (v, R, c) => ktOk(c, '②', (x) => hasE(x, (e) => /残り 2 枠/.test(ex(e)))) && /await[^\n]*trigger\s*\(\s*['"]click['"]/.test(itBody(v['ConsultSlot.test.ts'], '②')), 'ts'),
      t(1, '③ find(\'button\').text() が「予約する」と等しいと確かめる（toBe）', ['text() は要素の文字を返す。ぴったり等しいことは toBe で確かめる。', "expect(wrapper.find('button').text()).toBe('予約する')"], "const wrapper = mount(ConsultSlot)\nexpect(wrapper.find('button').text()).toBe('予約する')", { file: 'ConsultSlot.test.ts', find: ['// ③ '] }, (v, R, c) => ktOk(c, '③', (x) => hasE(x, (e) => e.m === 'toBe' && e.exp === '予約する')), 'ts'),
      t(2, '④ 3 回押して満席にし、ボタンの disabled 属性があることと、文字が「満席です」になることを確かめる', ["attributes('disabled') は、disabled が付いていれば値が返り、無ければ undefined。toBeDefined() で「付いている」を確かめる。", "for (let i = 0; i < 3; i++) {\n  await button.trigger('click')\n}\nexpect(button.attributes('disabled')).toBeDefined()\nexpect(button.text()).toBe('満席です')"], "const wrapper = mount(ConsultSlot)\nconst button = wrapper.find('button')\nfor (let i = 0; i < 3; i++) {\n  await button.trigger('click')\n}\nexpect(button.attributes('disabled')).toBeDefined()\nexpect(button.text()).toBe('満席です')", { file: 'ConsultSlot.test.ts', find: ['// ④ '] }, (v, R, c) => ktOk(c, '④', (x) => hasE(x, (e) => /満席/.test(ex(e))) && hasE(x, (e) => e.m === 'toBeDefined')) && /disabled/.test(itBody(v['ConsultSlot.test.ts'], '④')), 'ts'),
      t(2, '⑤ mount の 2 つ目の引数で props（initial: 1）を渡し、「残り 1 枠」から始まると確かめる', ['mount(部品, { props: { ... } }) の形で、親から渡す値（props）を決められる。', "mount(ConsultSlot, { props: { initial: 1 } })"], "const wrapper = mount(ConsultSlot, { props: { initial: 1 } })\nexpect(wrapper.text()).toContain('残り 1 枠')", { file: 'ConsultSlot.test.ts', find: ['// ⑤ '] }, (v, R, c) => ktOk(c, '⑤', (x) => hasE(x, (e) => /残り 1 枠/.test(ex(e)))) && /props\s*:\s*\{\s*initial\s*:\s*1/.test(itBody(v['ConsultSlot.test.ts'], '⑤')), 'ts'),
      t(3, '⑥ 予約したとき emit された reserved を emitted() で調べる（1 回だけ・中身は残り枠数の [2]）', ["wrapper.emitted('reserved') は、emit された回数ぶんの配列。1 回目の引数は ?.[0]。", "expect(wrapper.emitted('reserved')).toHaveLength(1)\nexpect(wrapper.emitted('reserved')?.[0]).toEqual([2])"], "const wrapper = mount(ConsultSlot)\nawait wrapper.find('button').trigger('click')\nexpect(wrapper.emitted('reserved')).toHaveLength(1)\nexpect(wrapper.emitted('reserved')?.[0]).toEqual([2])", { file: 'ConsultSlot.test.ts', find: ['// ⑥ '] }, (v, R, c) => ktOk(c, '⑥', (x) => hasE(x, (e) => e.m === 'toHaveLength' && e.exp === 1) && hasE(x, (e) => JSON.stringify(e.exp) === '[2]')) && /emitted\s*\(\s*['"]reserved['"]/.test(itBody(v['ConsultSlot.test.ts'], '⑥')), 'ts'),
    ],
  });

  /* ---- 実例：リファクタでテストが赤くなる：CaseCard ---- */
  const T2_TYPES = `// CaseCard が受け取る props の形
export interface CaseCardProps {
  title: string
  detail: string
  urgent?: boolean
}
`;
  const T2_VUE = `<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ title: string; detail: string; urgent?: boolean }>()

const open = ref<boolean>(false)
</script>

<template>
  <article data-testid="case-card">
    <h3 data-testid="case-title">{{ title }}</h3>
    <span v-if="urgent" data-testid="urgent-badge">急ぎ</span>
    <button data-testid="toggle" @click="open = !open">{{ open ? '閉じる' : '詳細を見る' }}</button>
    <p v-if="open" data-testid="detail">{{ detail }}</p>
  </article>
</template>
`;
  const T2_TEST = VT_IMPORTS + `import CaseCard from './CaseCard.vue'
import type { CaseCardProps } from './types'

// リファクタ（class を data-testid に整理）のあと、古いテストが赤くなっている。
// 「見た目の作り」ではなく「利用者に見える結果」で確かめ直そう。
// ⑥ 共通の mountCard(props: Partial<CaseCardProps>) を作り、各テストで使う（毎回の mount の重複をなくす）

describe('CaseCard（案件カード）', () => {
  it('① タイトルが表示される', () => {
    const wrapper = mount(CaseCard, { props: { title: '未払い残業代の請求', detail: '2年分の請求です' } })
    // ① .title は無くなった。data-testid="case-title" で探す
    expect(wrapper.find('.title').text()).toBe('未払い残業代の請求')
  })

  it('② urgent のとき「急ぎ」バッジが出る', () => {
    const wrapper = mount(CaseCard, { props: { title: '交通事故の示談', detail: '示談交渉', urgent: true } })
    // ② .badge は無くなった。data-testid="urgent-badge" で探す
    expect(wrapper.find('.badge').exists()).toBe(true)
  })

  it('③ 「詳細を見る」を押すと詳細が出る', async () => {
    const wrapper = mount(CaseCard, { props: { title: '相続の相談', detail: '遺産分割の相談です' } })
    // ③ .btn と .detail は無くなった。data-testid="toggle" と "detail" で探す
    await wrapper.find('.btn').trigger('click')
    expect(wrapper.find('.detail').text()).toBe('遺産分割の相談です')
  })

  it('④ 押すとボタンの文字が「閉じる」に変わる', async () => {
    const wrapper = mount(CaseCard, { props: { title: '賃貸の敷金返還', detail: '敷金の返還請求' } })
    await wrapper.find('[data-testid="toggle"]').trigger('click')
    // ④ 内部の変数 open ではなく、利用者に見えるボタンの文字で確かめる（wrapper.vm は使わない）
    expect((wrapper.vm as any).open).toBe(true)
  })

  it('⑤ urgent を渡さないと「急ぎ」バッジは出ない', () => {
    // ⑤ urgent なしで mount し、バッジが存在しない（exists() が false）ことを確かめる
  })

  it('⑥ 2 回押すと、詳細が閉じて元に戻る', async () => {
    // ⑥ mountCard を使って、2 回 click したあと、詳細が無く、ボタンの文字が「詳細を見る」であることを確かめる
  })
})
`;
  TEST['実例：リファクタでテストが赤くなる'] = tdrill({
    height: 480,
    paths: Object.assign(TPATH('CaseCard'), { 'types.ts': 'src/components/types.ts' }),
    fileNotes: { 'CaseCard.test.ts': '赤くなったテストを直す', 'CaseCard.vue': 'リファクタ済みの部品（触らない）', 'types.ts': 'props の型（触らない）' },
    files: { 'CaseCard.test.ts': T2_TEST, 'CaseCard.vue': T2_VUE, 'types.ts': T2_TYPES },
    edits: { 'CaseCard.test.ts': [
      ['// ⑥ 共通の mountCard(props: Partial<CaseCardProps>) を作り、各テストで使う（毎回の mount の重複をなくす）\n',
        "const base: CaseCardProps = { title: '未払い残業代の請求', detail: '2年分の請求です' }\n\nfunction mountCard(props: Partial<CaseCardProps> = {}) {\n  return mount(CaseCard, { props: { ...base, ...props } })\n}\n"],
      ["    const wrapper = mount(CaseCard, { props: { title: '未払い残業代の請求', detail: '2年分の請求です' } })\n    // ① .title は無くなった。data-testid=\"case-title\" で探す\n    expect(wrapper.find('.title').text())", "    const wrapper = mountCard()\n    expect(wrapper.find('[data-testid=\"case-title\"]').text())"],
      ["    const wrapper = mount(CaseCard, { props: { title: '交通事故の示談', detail: '示談交渉', urgent: true } })\n    // ② .badge は無くなった。data-testid=\"urgent-badge\" で探す\n    expect(wrapper.find('.badge').exists())", "    const wrapper = mountCard({ urgent: true })\n    expect(wrapper.find('[data-testid=\"urgent-badge\"]').exists())"],
      ["    const wrapper = mount(CaseCard, { props: { title: '相続の相談', detail: '遺産分割の相談です' } })\n    // ③ .btn と .detail は無くなった。data-testid=\"toggle\" と \"detail\" で探す\n    await wrapper.find('.btn').trigger('click')\n    expect(wrapper.find('.detail').text()).toBe('遺産分割の相談です')", "    const wrapper = mountCard({ detail: '遺産分割の相談です' })\n    await wrapper.find('[data-testid=\"toggle\"]').trigger('click')\n    expect(wrapper.find('[data-testid=\"detail\"]').text()).toBe('遺産分割の相談です')"],
      ["    const wrapper = mount(CaseCard, { props: { title: '賃貸の敷金返還', detail: '敷金の返還請求' } })\n    await wrapper.find('[data-testid=\"toggle\"]').trigger('click')\n    // ④ 内部の変数 open ではなく、利用者に見えるボタンの文字で確かめる（wrapper.vm は使わない）\n    expect((wrapper.vm as any).open).toBe(true)", "    const wrapper = mountCard()\n    await wrapper.find('[data-testid=\"toggle\"]').trigger('click')\n    expect(wrapper.find('[data-testid=\"toggle\"]').text()).toBe('閉じる')"],
      ["    // ⑤ urgent なしで mount し、バッジが存在しない（exists() が false）ことを確かめる\n", "    const wrapper = mountCard()\n    expect(wrapper.find('[data-testid=\"urgent-badge\"]').exists()).toBe(false)\n"],
      ["    // ⑥ mountCard を使って、2 回 click したあと、詳細が無く、ボタンの文字が「詳細を見る」であることを確かめる\n", "    const wrapper = mountCard()\n    const toggle = wrapper.find('[data-testid=\"toggle\"]')\n    await toggle.trigger('click')\n    await toggle.trigger('click')\n    expect(wrapper.find('[data-testid=\"detail\"]').exists()).toBe(false)\n    expect(toggle.text()).toBe('詳細を見る')\n"],
    ] },
    tasks: [
      t(1, '① タイトルのテストを直す：消えた .title ではなく、data-testid="case-title" で探す', ['find のセレクターを、リファクタ後の部品に合わせる。属性セレクターは [data-testid="名前"]。', "wrapper.find('[data-testid=\"case-title\"]').text()"], "expect(wrapper.find('[data-testid=\"case-title\"]').text()).toBe('未払い残業代の請求')", { file: 'CaseCard.test.ts', find: ['// ① '] }, (v, R, c) => ktOk(c, '①', (x) => hasE(x, (e) => e.m === 'toBe' && e.exp === '未払い残業代の請求')) && /data-testid="case-title"/.test(itBody(v['CaseCard.test.ts'], '①')), 'ts'),
      t(1, '② 「急ぎ」バッジのテストを直す：消えた .badge ではなく、data-testid="urgent-badge" で探す', ['利用者に見える「急ぎ」バッジを、data-testid で探す。見つかれば exists() は true。', "wrapper.find('[data-testid=\"urgent-badge\"]').exists()"], "expect(wrapper.find('[data-testid=\"urgent-badge\"]').exists()).toBe(true)", { file: 'CaseCard.test.ts', find: ['// ② '] }, (v, R, c) => ktOk(c, '②', (x) => hasE(x, (e) => e.m === 'toBe' && e.exp === true)) && /data-testid="urgent-badge"/.test(itBody(v['CaseCard.test.ts'], '②')), 'ts'),
      t(1, '③ 詳細を開くテストを直す：ボタンも詳細も、data-testid（toggle / detail）で探す', ['.btn と .detail は無くなった。ボタンは "toggle"、詳細は "detail"。', "await wrapper.find('[data-testid=\"toggle\"]').trigger('click')\nexpect(wrapper.find('[data-testid=\"detail\"]').text()).toBe('遺産分割の相談です')"], "await wrapper.find('[data-testid=\"toggle\"]').trigger('click')\nexpect(wrapper.find('[data-testid=\"detail\"]').text()).toBe('遺産分割の相談です')", { file: 'CaseCard.test.ts', find: ['// ③ '] }, (v, R, c) => ktOk(c, '③', (x) => hasE(x, (e) => e.exp === '遺産分割の相談です')) && /data-testid="detail"/.test(itBody(v['CaseCard.test.ts'], '③')) && /data-testid="toggle"/.test(itBody(v['CaseCard.test.ts'], '③')), 'ts'),
      t(2, '④ 内部の変数 wrapper.vm.open を見るのをやめ、ボタンの文字が「閉じる」になることで確かめる', ['内部の作りを見るテストは、リファクタで壊れやすい。利用者に見える文字で確かめる。', "expect(wrapper.find('[data-testid=\"toggle\"]').text()).toBe('閉じる')"], "expect(wrapper.find('[data-testid=\"toggle\"]').text()).toBe('閉じる')", { file: 'CaseCard.test.ts', find: ['// ④ '] }, (v, R, c) => ktOk(c, '④', (x) => hasE(x, (e) => e.exp === '閉じる')) && !/\.vm\b/.test(itBody(v['CaseCard.test.ts'], '④')), 'ts'),
      t(2, '⑤ urgent を渡さないときは「急ぎ」バッジが無い（exists() が false）と確かめる', ['出ないことを確かめるときも、まず find で探してから exists() を見る。', "expect(wrapper.find('[data-testid=\"urgent-badge\"]').exists()).toBe(false)"], "const wrapper = mountCard()\nexpect(wrapper.find('[data-testid=\"urgent-badge\"]').exists()).toBe(false)", { file: 'CaseCard.test.ts', find: ['// ⑤ '] }, (v, R, c) => ktOk(c, '⑤', (x) => hasE(x, (e) => e.m === 'toBe' && e.exp === false)) && /exists\s*\(\s*\)/.test(itBody(v['CaseCard.test.ts'], '⑤')), 'ts'),
      t(3, '⑥ 共通の mountCard(props: Partial<CaseCardProps>) を作って 3 つ以上のテストで使い、2 回押すと閉じるテストを書く', ['Partial<型> は「型の一部だけ渡せばよい」。基本の props に、テストごとの差分を重ねて mount する。', "function mountCard(props: Partial<CaseCardProps> = {}) {\n  return mount(CaseCard, { props: { ...base, ...props } })\n}"], "const base: CaseCardProps = { title: '未払い残業代の請求', detail: '2年分の請求です' }\n\nfunction mountCard(props: Partial<CaseCardProps> = {}) {\n  return mount(CaseCard, { props: { ...base, ...props } })\n}", { file: 'CaseCard.test.ts', find: ['// ⑥ 共通の', '// ⑥ mountCard'] }, (v, R, c) => { const s = v['CaseCard.test.ts'].replace(/\/\/.*$/gm, ''); return ktOk(c, '⑥', (x) => hasE(x, (e) => e.exp === '詳細を見る') && hasE(x, (e) => e.m === 'toBe' && e.exp === false)) && /Partial\s*<\s*CaseCardProps\s*>/.test(s) && (s.match(/mountCard\s*\(/g) || []).length >= 4 && (itBody(s, '⑥').match(/trigger\s*\(/g) || []).length >= 2; }, 'ts'),
    ],
  });

  /* ---- 実例：何をテストする？：FeeForm ---- */
  const T3_VUE = `<script setup lang="ts">
import { computed, ref } from 'vue'

const emit = defineEmits<{ (e: 'submit', amount: number): void }>()

const raw = ref<string>('')
const amount = computed<number>(() => Number(raw.value))
const error = computed<string>(() => {
  if (raw.value === '') return ''
  if (!Number.isInteger(amount.value) || amount.value < 1) return '1円以上の整数で入力してください'
  return ''
})
const valid = computed<boolean>(() => raw.value !== '' && error.value === '')
const withTax = computed<number>(() => Math.floor(amount.value * 1.1))

function submit(): void {
  if (!valid.value) return
  emit('submit', amount.value)
}
</script>

<template>
  <div>
    <input v-model="raw" data-testid="amount" placeholder="相談料（円）" />
    <p v-if="error" data-testid="error">{{ error }}</p>
    <p v-if="valid" data-testid="with-tax">税込 {{ withTax.toLocaleString('ja-JP') }} 円</p>
    <button data-testid="submit" :disabled="!valid" @click="submit">申し込む</button>
  </div>
</template>
`;
  const T3_TEST = VT_IMPORTS + `import FeeForm from './FeeForm.vue'

// 見た目の細部ではなく、「利用者にとって大事な結果」「境界」「異常」をテストする
describe('FeeForm（相談料の申し込み）', () => {
  it('① 10000 円を入れると、税込「11,000」が出る', async () => {
    // ① amount 欄に setValue('10000') して、with-tax の文字に「11,000」が含まれることを確かめる
  })

  it('② 何も入れていないとき、申し込むボタンは押せない', () => {
    // ② submit ボタンに disabled 属性があることを確かめる
  })

  it('③ 正しい金額で申し込むと、submit が金額つきで emit される', async () => {
    // ③ 10000 を入れて submit を押し、emitted('submit') の 1 回目が [10000] であることを確かめる
  })

  it('④ 境界値：0 円はエラー、1 円は OK', async () => {
    // ④ 0 を入れるとエラー文（1円以上…）が出て、1 を入れるとエラーが消えることを確かめる
  })

  it('⑤ 異常系：-1・1.5・文字はエラーになり、submit されない', async () => {
    // ⑤ 3 つの値それぞれで、エラーが出ること、submit が emit されない（emitted('submit') が undefined）ことを確かめる
  })

  // ⑥ it.each で、金額と税込の組（端数は切り捨て）を 3 つ以上テストする（例：100 → 110、105 → 115、999 → 1,098）
})
`;
  TEST['実例：何をテストする？'] = tdrill({
    height: 480,
    paths: TPATH('FeeForm'),
    fileNotes: { 'FeeForm.test.ts': 'ここにテストを書く', 'FeeForm.vue': 'テストされる部品（触らない）' },
    files: { 'FeeForm.test.ts': T3_TEST, 'FeeForm.vue': T3_VUE },
    edits: { 'FeeForm.test.ts': [
      ["    // ① amount 欄に setValue('10000') して、with-tax の文字に「11,000」が含まれることを確かめる\n", "    const wrapper = mount(FeeForm)\n    await wrapper.find('[data-testid=\"amount\"]').setValue('10000')\n    expect(wrapper.find('[data-testid=\"with-tax\"]').text()).toContain('11,000')\n"],
      ["    // ② submit ボタンに disabled 属性があることを確かめる\n", "    const wrapper = mount(FeeForm)\n    expect(wrapper.find('[data-testid=\"submit\"]').attributes('disabled')).toBeDefined()\n"],
      ["    // ③ 10000 を入れて submit を押し、emitted('submit') の 1 回目が [10000] であることを確かめる\n", "    const wrapper = mount(FeeForm)\n    await wrapper.find('[data-testid=\"amount\"]').setValue('10000')\n    await wrapper.find('[data-testid=\"submit\"]').trigger('click')\n    expect(wrapper.emitted('submit')?.[0]).toEqual([10000])\n"],
      ["    // ④ 0 を入れるとエラー文（1円以上…）が出て、1 を入れるとエラーが消えることを確かめる\n", "    const wrapper = mount(FeeForm)\n    const input = wrapper.find('[data-testid=\"amount\"]')\n    await input.setValue('0')\n    expect(wrapper.find('[data-testid=\"error\"]').text()).toContain('1円以上')\n    await input.setValue('1')\n    expect(wrapper.find('[data-testid=\"error\"]').exists()).toBe(false)\n"],
      ["    // ⑤ 3 つの値それぞれで、エラーが出ること、submit が emit されない（emitted('submit') が undefined）ことを確かめる\n", "    const wrapper = mount(FeeForm)\n    const input = wrapper.find('[data-testid=\"amount\"]')\n    for (const value of ['-1', '1.5', 'abc']) {\n      await input.setValue(value)\n      expect(wrapper.find('[data-testid=\"error\"]').exists()).toBe(true)\n      await wrapper.find('[data-testid=\"submit\"]').trigger('click')\n    }\n    expect(wrapper.emitted('submit')).toBeUndefined()\n"],
      ["  // ⑥ it.each で、金額と税込の組（端数は切り捨て）を 3 つ以上テストする（例：100 → 110、105 → 115、999 → 1,098）\n",
        "  it.each([\n    [100, '110'],\n    [105, '115'],\n    [999, '1,098'],\n  ])('⑥ 税込（端数は切り捨て）：%d 円 → %s 円', async (amount: number, expected: string) => {\n    const wrapper = mount(FeeForm)\n    await wrapper.find('[data-testid=\"amount\"]').setValue(String(amount))\n    expect(wrapper.find('[data-testid=\"with-tax\"]').text()).toContain(expected)\n  })\n"],
    ] },
    tasks: [
      t(1, '① 10000 円を入力（setValue）すると、税込に「11,000」が出ると確かめる（利用者に見える結果）', ["入力欄には setValue('値') で文字を入れる。入れたあとの画面は await してから見る。", "await wrapper.find('[data-testid=\"amount\"]').setValue('10000')\nexpect(wrapper.find('[data-testid=\"with-tax\"]').text()).toContain('11,000')"], "const wrapper = mount(FeeForm)\nawait wrapper.find('[data-testid=\"amount\"]').setValue('10000')\nexpect(wrapper.find('[data-testid=\"with-tax\"]').text()).toContain('11,000')", { file: 'FeeForm.test.ts', find: ['// ① '] }, (v, R, c) => ktOk(c, '①', (x) => hasE(x, (e) => /11,000/.test(ex(e)))) && /setValue\s*\(\s*['"]10000['"]/.test(itBody(v['FeeForm.test.ts'], '①')), 'ts'),
      t(1, '② 何も入力していないとき、申し込むボタンが押せない（disabled）と確かめる', ["attributes('disabled') は、付いていれば値、無ければ undefined。", "expect(wrapper.find('[data-testid=\"submit\"]').attributes('disabled')).toBeDefined()"], "const wrapper = mount(FeeForm)\nexpect(wrapper.find('[data-testid=\"submit\"]').attributes('disabled')).toBeDefined()", { file: 'FeeForm.test.ts', find: ['// ② '] }, (v, R, c) => ktOk(c, '②', (x) => hasE(x, (e) => e.m === 'toBeDefined')) && /disabled/.test(itBody(v['FeeForm.test.ts'], '②')), 'ts'),
      t(1, '③ 10000 円で申し込むと、submit が金額（[10000]）つきで emit されると確かめる', ["emitted('submit') は emit された回数ぶんの配列。1 回目の引数は ?.[0] で取れる。", "expect(wrapper.emitted('submit')?.[0]).toEqual([10000])"], "const wrapper = mount(FeeForm)\nawait wrapper.find('[data-testid=\"amount\"]').setValue('10000')\nawait wrapper.find('[data-testid=\"submit\"]').trigger('click')\nexpect(wrapper.emitted('submit')?.[0]).toEqual([10000])", { file: 'FeeForm.test.ts', find: ['// ③ '] }, (v, R, c) => ktOk(c, '③', (x) => hasE(x, (e) => JSON.stringify(e.exp) === '[10000]')) && /emitted\s*\(\s*['"]submit['"]/.test(itBody(v['FeeForm.test.ts'], '③')), 'ts'),
      t(2, '④ 境界値のテスト：0 円は「1円以上…」のエラー、1 円は OK（エラーが消える）', ['不具合は境界（ぎりぎり）で起きやすい。0 と 1 の両方を同じテストで確かめる。', "await input.setValue('0')\nexpect(error.text()).toContain('1円以上')\nawait input.setValue('1')\nexpect(error.exists()).toBe(false)"], "const wrapper = mount(FeeForm)\nconst input = wrapper.find('[data-testid=\"amount\"]')\nawait input.setValue('0')\nexpect(wrapper.find('[data-testid=\"error\"]').text()).toContain('1円以上')\nawait input.setValue('1')\nexpect(wrapper.find('[data-testid=\"error\"]').exists()).toBe(false)", { file: 'FeeForm.test.ts', find: ['// ④ '] }, (v, R, c) => ktOk(c, '④', (x) => hasE(x, (e) => /1円以上/.test(ex(e))) && hasE(x, (e) => e.m === 'toBe' && e.exp === false)) && /setValue\s*\(\s*['"]0['"]/.test(itBody(v['FeeForm.test.ts'], '④')) && /setValue\s*\(\s*['"]1['"]/.test(itBody(v['FeeForm.test.ts'], '④')), 'ts'),
      t(2, '⑤ 異常系のテスト：-1・1.5・文字の入力はエラーになり、submit は emit されない', ['配列と for…of で、値ごとに同じ確かめをくり返せる。emit されなければ emitted(\'submit\') は undefined。', "for (const value of ['-1', '1.5', 'abc']) {\n  await input.setValue(value)\n  expect(error.exists()).toBe(true)\n}\nexpect(wrapper.emitted('submit')).toBeUndefined()"], "const wrapper = mount(FeeForm)\nconst input = wrapper.find('[data-testid=\"amount\"]')\nfor (const value of ['-1', '1.5', 'abc']) {\n  await input.setValue(value)\n  expect(wrapper.find('[data-testid=\"error\"]').exists()).toBe(true)\n  await wrapper.find('[data-testid=\"submit\"]').trigger('click')\n}\nexpect(wrapper.emitted('submit')).toBeUndefined()", { file: 'FeeForm.test.ts', find: ['// ⑤ '] }, (v, R, c) => { const b = itBody(v['FeeForm.test.ts'], '⑤'); return ktOk(c, '⑤', (x) => hasE(x, (e) => e.m === 'toBeUndefined') && x.expects.filter((e) => e.pass && e.m === 'toBe' && e.exp === true).length >= 3) && /['"]-1['"]/.test(b) && /1\.5/.test(b); }, 'ts'),
      t(3, '⑥ it.each で、金額と税込の組を 3 つ以上まとめてテストする（端数は切り捨て：999 円 → 1,098 円 など）', ['it.each([[入力, 期待], …])(\'名前 %d → %s\', (入力, 期待) => { … }) で、表のようにケースを並べられる。', "it.each([\n  [100, '110'],\n  [105, '115'],\n  [999, '1,098'],\n])('⑥ 税込：%d 円 → %s 円', async (amount: number, expected: string) => {\n  ...\n})"], "it.each([\n  [100, '110'],\n  [105, '115'],\n  [999, '1,098'],\n])('⑥ 税込（端数は切り捨て）：%d 円 → %s 円', async (amount: number, expected: string) => {\n  const wrapper = mount(FeeForm)\n  await wrapper.find('[data-testid=\"amount\"]').setValue(String(amount))\n  expect(wrapper.find('[data-testid=\"with-tax\"]').text()).toContain(expected)\n})", { file: 'FeeForm.test.ts', find: ['// ⑥ '] }, (v, R, c) => { const ts = ktTests(c, '⑥'); return ts.length >= 3 && ts.every((x) => x.pass) && /it\.each\s*\(/.test(v['FeeForm.test.ts'].replace(/\/\/.*$/gm, '')); }, 'ts'),
    ],
  });
})();
