/* 解剖図 vue：Vue の主なシーンに「1ファイルまるごとのコード」を出し、部品にカーソルを乗せると光る（左＝全文／右＝部品の説明）。
   ⟦キー|文字⟧ で光らせる範囲を指定（キーはカンマで複数可）。コードは省略せず、必ず1ファイル分を書く。 */
(function () {
  const K = window.KENSHU;
  if (!K || !K.tsAnat) return;
  const C = { kw: 'var(--pink)', name: 'var(--vue)', type: 'var(--basic)', val: 'var(--team)', sym: 'var(--mute)', vi: 'var(--violet)', ts: 'var(--ts)' };
  const tk = (src) => { const out = []; let last = 0; src.replace(/⟦([^|⟧]*)\|([^⟧]*)⟧/g, (m, k, t, i) => { if (i > last) out.push([src.slice(last, i), []]); out.push([t, k.split(',').map((x) => x.trim()).filter(Boolean)]); last = i + m.length; return m; }); if (last < src.length) out.push([src.slice(last), []]); return out; };
  const sp = (title, src, parts, extra) => Object.assign({ title, tokens: tk(src), parts, split: true }, extra || {});

  /* ---------- ref ---------- */
  K.tsAnat('ref：状態と画面', sp('🔍 Counter.vue まるごと：ref の部品',
    `⟦sc|<script setup lang="ts">⟧
import { ⟦ri|ref⟧ } from 'vue'

⟦kw|const⟧ ⟦name|count⟧ = ⟦ref|ref⟧(⟦init|0⟧)

function add() {
  count⟦value|.value⟧++
}
</script>

<template>
  <p>参加人数：⟦mus|{{ count }}⟧ 名</p>
  <button ⟦ev|@click⟧="add">＋1</button>
</template>

<style scoped>
button { padding: 6px 14px; }
</style>
`, {
      ri: ['import { ref }', C.ts, 'Vue から ref を借りてくる。使う前に必ず書く'],
      kw: ['const', C.kw, '変数の宣言。ref の箱そのものは作り替えないので const'],
      name: ['変数名（count）', C.name, '状態の名前。template からもこの名前で呼ぶ'],
      ref: ['ref', C.type, '「この値が変わったら画面も更新して」と Vue に頼める箱を作る関数'],
      init: ['初期値（0）', C.val, '最初に入れておく値。型もここから自動で決まる（number）'],
      value: ['.value', C.vi, 'script の中で、箱の中身を読み書きする入口。ここを変えると画面が動く'],
      mus: ['{{ }}（マスタッシュ）', C.ts, 'template に値を表示する書き方。.value は付けない'],
      ev: ['@click', C.kw, 'クリックされたら add を呼ぶ。ボタンと関数を結ぶ印'],
    }));

  /* ---------- v-if ---------- */
  K.tsAnat('v-if と v-show', sp('🔍 AdminMenu.vue まるごと：v-if と v-show',
    `<script setup lang="ts">
import { ref } from 'vue'

const ⟦cond|show⟧ = ref(true)
</script>

<template>
  <button ⟦ev|@click⟧="show = !show">切替</button>

  <p ⟦dir|v-if⟧="show">管理メニュー</p>
  <p ⟦vs|v-show⟧="show">料金タブ</p>
</template>

<style scoped>
p { margin: 8px 0; }
</style>
`, {
      cond: ['条件（show）', C.name, 'true / false になる値。ref で作った変数をそのまま書く（.value は不要）'],
      ev: ['@click', C.kw, 'クリックで show を反転（true ⇄ false）'],
      dir: ['v-if', C.type, '条件が false のとき、DOM ごと作らない（消える）。めったに切り替えない所向き'],
      vs: ['v-show', C.val, '条件が false のとき、display: none で隠すだけ。何度も切り替える所向き'],
    }));

  /* ---------- v-model ---------- */
  K.tsAnat('v-model：双方向', sp('🔍 TitleInput.vue まるごと：v-model の部品',
    `<script setup lang="ts">
import { ref } from 'vue'

const ⟦var|title⟧ = ⟦ref|ref⟧('')
</script>

<template>
  <input ⟦dir|v-model⟧="⟦var2|title⟧" placeholder="件名" maxlength="30" />
  <p>件名：{{ title }}（{{ title.length }}/30）</p>
</template>

<style scoped>
input { width: 100%; padding: 6px 10px; }
</style>
`, {
      var: ['変数（title）', C.name, '入力された文字を入れておく箱。最初は空文字'],
      ref: ['ref("")', C.type, '空文字から始まる箱。入力のたびに中身が置き換わる'],
      dir: ['v-model', C.kw, '「入力欄 ⇄ 変数」を両方向につなぐ。打てば変数が変わり、変数が変われば欄も変わる'],
      var2: ['つなぐ相手（title）', C.val, 'v-model に書く名前。ref の変数名を書く（.value は不要）'],
    }));

  /* ---------- @click ---------- */
  K.tsAnat('イベント処理 @click', sp('🔍 ReserveButton.vue まるごと：@click の部品',
    `<script setup lang="ts">
import { ref } from 'vue'

const slots = ref(3)

function ⟦fn|reserve⟧() {
  ⟦act|slots.value--⟧
}
</script>

<template>
  <button ⟦ev|@click⟧="⟦fn2|reserve⟧" ⟦bind|:disabled⟧="slots === 0">予約する</button>
  <p>残り {{ slots }} 枠</p>
</template>

<style scoped>
button:disabled { opacity: .4; }
</style>
`, {
      fn: ['関数（reserve）', C.name, '起きたときにやりたい処理を、名前をつけた関数にしておく'],
      act: ['中身（slots.value--）', C.val, 'script では .value で箱の中身を減らす。減ると画面も自動で変わる'],
      ev: ['@click', C.kw, '「クリックされたら」の印。v-on:click の省略形。@input・@submit も同じ形'],
      fn2: ['呼ぶ関数', C.type, '名前だけ書く（reserve）。() を付けないのが基本'],
      bind: [':disabled', C.vi, '「:」は属性を式で決める印。slots が 0 のときボタンを押せなくする'],
    }));

  /* ---------- v-for / :class ---------- */
  K.tsAnat(':class と v-for', sp('🔍 CaseList.vue まるごと：v-for と :class の部品',
    `<script setup lang="ts">
import { ref } from 'vue'

const cases = ⟦list|ref([
  { id: 1, title: '未払い残業代の相談', done: false },
  { id: 2, title: '契約書チェックの依頼', done: true },
])⟧
</script>

<template>
  <ul>
    <li
      ⟦dir|v-for⟧="⟦item|c⟧ ⟦in|in⟧ cases"
      ⟦key|:key="c.id"⟧
      ⟦cls|:class="{ done: c.done }"⟧
      @click="c.done = !c.done"
    >
      {{ c.title }}
    </li>
  </ul>
</template>

<style scoped>
.done { text-decoration: line-through; color: #999; }
</style>
`, {
      list: ['配列（cases）', C.type, '繰り返す元のデータ。増減すると画面も増減する'],
      dir: ['v-for', C.kw, '配列の要素の数だけ、このタグを繰り返し作る'],
      item: ['1件（c）', C.name, '今回ぶんの要素。{{ c.title }} のように使える'],
      in: ['in', C.sym, '「〜の中から1件ずつ」の区切り'],
      key: [':key（c.id）', C.val, '各行を見分ける目印。重複しない id を渡す（index は避ける）'],
      cls: [':class', C.vi, 'クラス名を条件で付け外し。done が true の行だけ .done が付く'],
    }));

  /* ---------- props ---------- */
  K.tsAnat('props：親から子へ', sp('🔍 子 CaseCard.vue まるごと：props を受け取る',
    `<script setup lang="ts">
interface Item { title: string; done: boolean }

const props = ⟦dp|defineProps⟧<{ ⟦pn|item⟧: ⟦pt|Item⟧ }>()
</script>

<template>
  <article class="card">
    <h3>{{ ⟦use|props.item.title⟧ }}</h3>
    <span v-if="props.item.done">✓ 完了</span>
  </article>
</template>

<style scoped>
.card { padding: 12px; border: 1px solid #ccd; }
</style>
`, {
      dp: ['defineProps', C.kw, '「この部品は、こんな値を受け取ります」という宣言'],
      pn: ['名前（item）', C.name, '親が書く属性名と同じにする'],
      pt: ['型（Item）', C.type, '渡していい値の形。違うと親側に赤線が出る'],
      use: ['使う側（props.item）', C.val, 'template では props. を省略して item.title とも書ける'],
    }, {
      tab: '子（受け取る側）', more: [sp('🔍 親 CaseListPage.vue まるごと：props を渡す',
        `<script setup lang="ts">
import { ref } from 'vue'
⟦imp|import CaseCard from './CaseCard.vue'⟧

const cases = ref([
  { id: 1, title: '離婚の相談', done: false },
  { id: 2, title: '相続の相談', done: true },
])
</script>

<template>
  <CaseCard
    v-for="c in cases"
    :key="c.id"
    ⟦pn|:item⟧="⟦pv|c⟧"
  />
</template>

<style scoped>
</style>
`, {
          imp: ['import（部品を読み込む）', C.ts, '使いたい部品を import する。<script setup> なら登録の手間なし'],
          pn: [':item', C.vi, '子の props の名前。「:」を付けると、文字ではなく変数を渡せる'],
          pv: ['渡す値（c）', C.val, '親が子に渡す中身。変わると子の画面も自動で変わる'],
        }, { tab: '親（渡す側）' })],
    }));

  /* ---------- emit ---------- */
  K.tsAnat('emit：子から親へ', sp('🔍 子 ConfirmModal.vue まるごと：emit で知らせる',
    `<script setup lang="ts">
const emit = ⟦de|defineEmits⟧<{ (e: ⟦en|'close'⟧): void }>()
</script>

<template>
  <div class="modal">
    <p>本当に閉じますか？</p>
    <button ⟦ev|@click⟧="⟦em|emit('close')⟧">閉じる</button>
  </div>
</template>

<style scoped>
.modal { padding: 16px; border: 2px solid #ccd; }
</style>
`, {
      de: ['defineEmits', C.kw, '「この部品は、こんな知らせを出します」という宣言'],
      en: ['イベント名（close）', C.name, '子と親で同じ名前にする'],
      ev: ['@click', C.sym, '押されたときに右の emit を呼ぶ'],
      em: ['emit(…)', C.type, '子が親に「閉じたいです」と知らせる呼び出し'],
    }, {
      tab: '子（知らせる側）', more: [sp('🔍 親 App.vue まるごと：知らせを受け取る',
        `<script setup lang="ts">
import { ref } from 'vue'
import ConfirmModal from './ConfirmModal.vue'

const open = ref(true)
⟦hf|function hide() {
  open.value = false
}⟧
</script>

<template>
  <ConfirmModal v-if="open" ⟦ls|@close⟧="⟦hn|hide⟧" />
</template>

<style scoped>
</style>
`, {
          ls: ['@close', C.vi, '親が知らせを受け取る窓口。子の emit("close") と同じ名前'],
          hn: ['呼ぶ関数（hide）', C.val, '知らせが来たとき、親の側で動く処理'],
          hf: ['親の関数', C.name, 'open を false にして、モーダルを消す。状態を持っているのは親'],
        }, { tab: '親（受け取る側）' })],
    }));

  /* ---------- computed ---------- */
  K.tsAnat('computed：賢い計算', sp('🔍 CartTotal.vue まるごと：computed の部品',
    `<script setup lang="ts">
import { ref, ⟦ci|computed⟧ } from 'vue'

const ⟦dep1|price⟧ = ref(500)
const ⟦dep2|qty⟧ = ref(2)

const ⟦name|total⟧ = ⟦cp|computed⟧(⟦arrow|() =>⟧ ⟦dep|price.value * qty.value⟧)
</script>

<template>
  <input v-model.number="qty" type="number" min="0" />
  <p>合計：{{ total }} 円</p>
</template>

<style scoped>
input { width: 80px; }
</style>
`, {
      ci: ['import { computed }', C.ts, 'computed も Vue から借りる'],
      dep1: ['材料（price）', C.val, '計算に使う ref。変わると total も再計算される'],
      dep2: ['材料（qty）', C.val, '個数。入力欄で変えると、合計も自動で変わる'],
      name: ['名前（total）', C.name, '計算結果の名前。template でそのまま {{ total }} と使える'],
      cp: ['computed', C.type, '「材料から自動で答えを出す」関数。結果は覚えておき、材料が変わった時だけ計算し直す'],
      arrow: ['アロー関数', C.vi, '答えを返す関数を渡す。return を省略した短い書き方'],
      dep: ['計算式', C.val, 'script では .value が必要。使った ref を Vue が覚えてくれる'],
    }));

  /* ---------- watch ---------- */
  K.tsAnat('watch / watchEffect', sp('🔍 SearchBox.vue まるごと：watch の部品',
    `<script setup lang="ts">
import { ref, ⟦wi|watch⟧ } from 'vue'

const ⟦src|keyword⟧ = ref('')
const results = ref<string[]>([])

⟦wt|watch⟧(keyword, ⟦args|(newVal, oldVal)⟧ => {
  ⟦act|results.value = search(newVal)⟧
})

function search(word: string) {
  return ['離婚', '相続', '労働'].filter((f) => f.includes(word))
}
</script>

<template>
  <input v-model="keyword" placeholder="分野で検索" />
  <ul><li v-for="r in results" :key="r">{{ r }}</li></ul>
</template>

<style scoped>
</style>
`, {
      wi: ['import { watch }', C.ts, 'watch を Vue から借りる'],
      src: ['見張る対象（keyword）', C.name, 'ref や computed。.value は付けない'],
      wt: ['watch', C.kw, '「この値が変わったら、この処理をして」と見張りを頼む'],
      args: ['(新しい値, 前の値)', C.type, '変わった後と前の値が入る。使わなければ省略できる'],
      act: ['やること', C.val, '変わるたびに動く処理。API 呼び出しや保存など「副作用」を書く'],
    }));

  /* ---------- lifecycle ---------- */
  K.tsAnat('ライフサイクル', sp('🔍 CaseListPage.vue まるごと：onMounted の部品',
    `<script setup lang="ts">
import { ref, ⟦oi|onMounted⟧ } from 'vue'

const cases = ref<string[]>([])
const loading = ref(true)

⟦hook|onMounted⟧(⟦arrow|async () =>⟧ {
  ⟦act|cases.value = await fetchCases()⟧
  loading.value = false
})

async function fetchCases() {
  return ['離婚の相談', '相続の相談']
}
</script>

<template>
  <p v-if="loading">読み込み中…</p>
  <ul v-else><li v-for="c in cases" :key="c">{{ c }}</li></ul>
</template>

<style scoped>
</style>
`, {
      oi: ['import { onMounted }', C.ts, 'フックも Vue から借りる。on〜 の仲間は時点が違う'],
      hook: ['onMounted', C.kw, '「画面に出た直後」に1回動くフック'],
      arrow: ['関数', C.vi, 'その時になったら呼んでもらう関数を渡す（今すぐは動かない）。await を使うなら async を付ける'],
      act: ['やること', C.val, '最初のデータ取得・タイマー開始など。片づけは onUnmounted に書く'],
    }));

  /* ---------- 動的ルート ---------- */
  K.tsAnat('動的ルート /users/:id', sp('🔍 router/index.ts まるごと：動的ルートの定義',
    `import { createRouter, createWebHistory } from 'vue-router'
import UserView from '../views/UserView.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { ⟦pk|path⟧: '⟦fixed|/users/⟧⟦dyn|:id⟧', ⟦ck|component⟧: ⟦comp|UserView⟧ },
  ],
})
`, {
      pk: ['path', C.kw, 'URL のパターン。これにあうと右の部品が出る'],
      fixed: ['固定部分（/users/）', C.sym, 'そのまま一致する文字'],
      dyn: [':id（動く部分）', C.val, '「なんでも入る穴」。/users/42 の 42 が入る'],
      ck: ['component', C.type, 'そのパスで表示する部品'],
      comp: ['部品（UserView）', C.name, '画面になる .vue ファイル'],
    }, {
      tab: 'ルーター設定', more: [sp('🔍 UserView.vue まるごと：URL から id を取り出す',
        `<script setup lang="ts">
import { useRoute } from 'vue-router'

const ⟦rt|route⟧ = ⟦ur|useRoute⟧()
const id = ⟦pm|route.params.id⟧   // "/users/42" → "42"
</script>

<template>
  <h2>ユーザー {{ id }} のページ</h2>
</template>

<style scoped>
</style>
`, {
          ur: ['useRoute()', C.type, '「今の URL」の情報を持つオブジェクトを取り出す関数'],
          rt: ['route', C.name, '今のページの情報。path・params・query が入っている'],
          pm: ['route.params.id', C.val, '穴（:id）の値を取り出す。常に文字列（string）。数値が欲しければ Number() で変換'],
        }, { tab: '部品側（id を読む）' })],
    }));

  /* ---------- テスト ---------- */
  K.tsAnat('mount → find → trigger → expect', sp('🔍 Counter.spec.ts まるごと：テスト1本の部品',
    `import { describe, it, expect } from 'vitest'
import { ⟦mt0|mount⟧ } from '@vue/test-utils'
import Counter from './Counter.vue'

describe('Counter', () => {
  it('ボタンを押すと 1 増える', ⟦aw0|async⟧ () => {
    const w = ⟦mt|mount⟧(⟦cmp|Counter⟧)
    ⟦aw|await⟧ w.⟦fd|find⟧(⟦sel|'button'⟧).⟦tg|trigger⟧(⟦sel2|'click'⟧)
    ⟦ex|expect⟧(w.text()).⟦mc|toContain⟧(⟦val|'1'⟧)
  })
})
`, {
      mt0: ['import { mount }', C.ts, 'テスト用ツール（@vue/test-utils）から mount を借りる'],
      aw0: ['async', C.vi, 'await を使う関数には async を付ける'],
      mt: ['mount', C.kw, 'テスト用に部品を画面なしで組み立てる'],
      cmp: ['部品（Counter）', C.name, 'テストしたい .vue ファイル'],
      fd: ['find', C.type, '部品の中から探す（CSS セレクタ）'],
      sel: ['セレクタ', C.sym, "'button' や '.item' など、探す相手"],
      tg: ['trigger', C.vi, '本物のユーザーのようにクリックなどを起こす'],
      sel2: ['イベント名', C.sym, "'click' や 'input' など、起こす操作"],
      aw: ['await', C.ts, '画面の更新が終わるまで待つ。付け忘れると結果が古いまま'],
      ex: ['expect', C.kw, '「こうなるはず」と書く。最後の確認'],
      mc: ['マッチャー', C.val, 'toContain などで期待する中身を指定する'],
      val: ['期待する値', C.val, "'1' が表示されていれば合格"],
    }));

  /* ---------- .vue ファイルの解剖（全体 ＋ 中身の詳細タブ） ---------- */
  const CARD = {
    all: `⟦sc|<script setup lang="ts">
import { computed } from 'vue'

interface Item { title: string; note?: string; done: boolean }

const props = defineProps<{ item: Item }>()
const emit = defineEmits<{ (e: 'toggle', title: string): void }>()

const label = computed(() => (props.item.done ? '✓ 完了' : '完了にする'))
const toggle = () => emit('toggle', props.item.title)
</script>⟧

⟦tp|<template>
  <article class="card" :class="{ done: item.done }">
    <h3>{{ item.title }}</h3>
    <p v-if="item.note">{{ item.note }}</p>
    <button @click="toggle">{{ label }}</button>
  </article>
</template>⟧

⟦st|<style scoped>
.card { padding: 12px; border: 1px solid #ccd; }
.card.done { opacity: .5; }
</style>⟧
`,
  };
  K.tsAnat('.vue ファイルの解剖', sp('🔍 CaseCard.vue まるごと：3つのブロック（ブロックごと光る）', CARD.all, {
    sc: ['① <script setup>（動き）', C.ts, 'データ・受け取る値・関数を書く箱。ここに書いた名前は、そのまま template で使える'],
    tp: ['② <template>（形）', C.type, '画面の HTML を書く箱。{{ }}・v-if・@click で、script の名前とつながる'],
    st: ['③ <style scoped>（見た目）', C.vi, 'この部品にだけ効く CSS の箱。scoped が付くと、他の部品の見た目を壊さない'],
  }, {
    flow: { title: '3つの箱は、こうつながる', nodes: [['sc', '⚙️', 'script', 'データ・関数をつくる'], ['tp', '🧱', 'template', '画面の形に埋め込む'], ['st', '🎨', 'style', '見た目を付ける']], edges: ['名前を渡す　{{ }} ・ v-if ・ @click で使う', 'class 名で対応　.card ← class="card"'], order: '書く順番：script → template → style（上から。読む人も上から読む）' },
    tab: '全体：3つの箱',
    more: [
      sp('🔍 template の中身：どこが何をしている？', `<script setup lang="ts">
// （省略せず本当は上に script がある）
</script>

<template>
  <⟦tag|article⟧ ⟦cls|class="card"⟧ ⟦bind|:class="{ done: item.done }"⟧>
    <h3>⟦mus|{{ item.title }}⟧</h3>
    <p ⟦vif|v-if="item.note"⟧>{{ item.note }}</p>
    <button ⟦ev|@click="toggle"⟧>{{ label }}</button>
  </article>
</template>

<style scoped>
.card { padding: 12px; border: 1px solid #ccd; }
</style>
`, {
        tag: ['タグ（article）', C.type, 'ふつうの HTML タグ。部品の一番外側は1つにまとめるのが基本（Vue 3 は複数でも可）'],
        cls: ['class="card"', C.sym, 'ふつうの HTML 属性。いつも付く固定のクラス'],
        bind: [':class="{ … }"', C.vi, '先頭の「:」は「文字ではなく式」の印。done が true のときだけ .done が付く'],
        mus: ['{{ }}', C.ts, 'データを文字として画面に出す。式は書けるが、if や for などの「文」は書けない'],
        vif: ['v-if', C.kw, '条件で出し分け。note が空ならこの行は DOM に存在しない'],
        ev: ['@click', C.val, 'クリックで script の toggle 関数を呼ぶ'],
      }, { tab: 'template の中' }),
      sp('🔍 script の中身：書く順番と役割', `<script setup lang="ts">
⟦im|import { computed } from 'vue'⟧

⟦ty|interface Item { title: string; note?: string; done: boolean }⟧

⟦pr|const props = defineProps<{ item: Item }>()⟧
⟦em|const emit = defineEmits<{ (e: 'toggle', title: string): void }>()⟧

⟦cp|const label = computed(() => (props.item.done ? '✓ 完了' : '完了にする'))⟧
⟦fn|const toggle = () => emit('toggle', props.item.title)⟧
</script>

<template>
  <button @click="toggle">{{ label }}</button>
</template>

<style scoped>
</style>
`, {
        im: ['① import', C.ts, '一番上。使う道具・部品を借りてくる（Vue・他の .vue・自作の関数）'],
        ty: ['② 型（interface）', C.type, 'データの形。props や ref の型に使う'],
        pr: ['③ props', C.kw, '親から受け取る値の宣言。部品の「入口」'],
        em: ['④ emit', C.vi, '親に知らせるイベントの宣言。部品の「出口」'],
        cp: ['⑤ computed', C.name, '材料から作る値。ref や props から自動で計算'],
        fn: ['⑥ 関数', C.val, 'クリックなどで動く処理。最後にまとめて書く（ref → computed → 関数 の順が読みやすい）'],
      }, { tab: 'script の中' }),
      sp('🔍 style の中身：書き方', `<script setup lang="ts">
</script>

<template>
  <article class="card"><p>...</p></article>
</template>

<style ⟦sc|scoped⟧>
⟦sel|.card⟧ { ⟦pr|padding⟧: ⟦pv|12px⟧; border: 1px solid #ccd; }
⟦sel2|.card.done⟧ { opacity: .5; }
</style>
`, {
        sc: ['scoped', C.kw, 'この部品の中だけに効かせる印。付け忘れると、同じ class 名の他の部品にも効いてしまう'],
        sel: ['セレクタ（.card）', C.name, 'どの要素に効かせるか。template の class と対応させる'],
        sel2: ['状態のセレクタ', C.vi, ':class で付け外しするクラスの見た目もここに書く'],
        pr: ['プロパティ', C.type, '何を変えるか（余白・色など）'],
        pv: ['値', C.val, 'どう変えるか'],
      }, { tab: 'style の中' }),
    ],
  }));
})();
