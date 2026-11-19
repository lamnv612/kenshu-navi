/* 補足 Vue「三項演算子と矢印関数」（x-vue-arrow）のレッスン最終テスト。K.vueTestTools.web で作る。
   1 つの .vue だけ（<script setup lang="ts">）。初級×3・中級×2・上級×1。
   三項演算子（文字・class・:disabled）／ 矢印関数（filter・setTimeout・map でオブジェクトを返す） */
(function () {
  const K = window.KENSHU;
  if (!K || !K.vueTestTools) return;
  const { web, nt } = K.vueTestTools;
  const lock = (id, test) => Object.defineProperty(K.tests, id, { get: () => test, set: () => {}, configurable: true, enumerable: true });

  const APP = `<script setup lang="ts">
import { ref } from 'vue'

interface Case {
  id: number
  title: string
  done: boolean
}

interface Row {
  id: number
  label: string
}

const slots = ref<number>(3)
const sent = ref<boolean>(false)
const cases = ref<Case[]>([
  { id: 1, title: '離婚の相談', done: false },
  { id: 2, title: '相続の相談', done: true },
  { id: 3, title: '労働の相談', done: false },
])

const reserve = (): void => {
  if (slots.value > 0) {
    slots.value--
  }
}

const toggle = (c: Case): void => {
  c.done = !c.done
}

// ⑤ 送信ボタン：sent を false にして、300ms 後に true にする（setTimeout と矢印関数）
const send = (): void => {
  sent.value = false
  // ここに書く
}

// ⑥ 一覧の行 rows を、cases から map と矢印関数で作る（{ id: 案件の id, label: '1. 離婚の相談' } の形。id と title をつなぐ）
const rows: Row[] = []
</script>

<template>
  <h2>相談デスク</h2>

  <!-- ③ 残りが 1 枠以下のとき、class に is-urgent を付ける（三項演算子） -->
  <div class="slot">残り {{ slots }} 枠</div>

  <!-- ① 状態の文字を、三項演算子で出す（0 枠なら「満席」、それ以外は「受付中」） -->
  <p class="status">状態：</p>

  <!-- ② 0 枠のとき、予約ボタンを押せなくする（:disabled に条件だけ） -->
  <button class="reserve" @click="reserve">予約する</button>

  <!-- ④ 未完了の件数を、filter と矢印関数で出す（done が false のものだけ数える） -->
  <p class="open">未完了：{{ cases.length }} 件</p>
  <ul>
    <li v-for="c in cases" :key="c.id">
      <button class="toggle" @click="toggle(c)">{{ c.done ? '済' : '未' }} {{ c.title }}</button>
    </li>
  </ul>

  <ul class="rows">
    <li v-for="r in rows" :key="r.id" class="row">{{ r.label }}</li>
  </ul>

  <button class="send" @click="send">送信</button>
  <p class="sent" v-if="sent">送信しました</p>
</template>
`;

  lock('x-vue-arrow', web({
    height: 360,
    alias: { 'App.vue': 'ConsultDeskPage.vue' },
    paths: { 'App.vue': 'src/views/ConsultDeskPage.vue' },
    fileNotes: { 'App.vue': '相談デスク。三項演算子と矢印関数で、短く書く' },
    starter: { 'App.vue': APP },
    steps: [
      {
        key: 'm1', level: 1, file: 'App.vue',
        label: 'ConsultDeskPage.vue で、状態の文字を三項演算子で出す（0 枠なら「満席」、それ以外は「受付中」。画面：状態：受付中）',
        hint: ['三項演算子は「条件 ? 本当のとき : ウソのとき」。{{ }} の中に書ける。', '<code>{{ slots === 0 ? \'満席\' : \'受付中\' }}</code>'],
        edits: [['<!-- ① 状態の文字を、三項演算子で出す（0 枠なら「満席」、それ以外は「受付中」） -->\n  <p class="status">状態：</p>', '<p class="status">状態：{{ slots === 0 ? \'満席\' : \'受付中\' }}</p>']],
      },
      {
        key: 'm2', level: 1, file: 'App.vue',
        label: 'ConsultDeskPage.vue で、0 枠になったら予約ボタンを押せなくする（:disabled に条件だけ書く）',
        hint: ['<code>:disabled</code> には true / false が入る。条件そのものが true / false なので、三項演算子は要らない。', '<code>&lt;button class="reserve" :disabled="slots === 0" …&gt;</code>'],
        edits: [['<!-- ② 0 枠のとき、予約ボタンを押せなくする（:disabled に条件だけ） -->\n  <button class="reserve" @click="reserve">', '<button class="reserve" :disabled="slots === 0" @click="reserve">']],
      },
      {
        key: 'm3', level: 1, file: 'App.vue',
        label: 'ConsultDeskPage.vue で、残りが 1 枠以下のとき class に is-urgent が付くようにする（:class と三項演算子）',
        hint: ['class の切り替えも、三項演算子 1 行。付けないときは空の文字 <code>\'\'</code>。', '<code>&lt;div class="slot" :class="slots &lt;= 1 ? \'is-urgent\' : \'\'"&gt;</code>'],
        edits: [['<!-- ③ 残りが 1 枠以下のとき、class に is-urgent を付ける（三項演算子） -->\n  <div class="slot">', '<div class="slot" :class="slots <= 1 ? \'is-urgent\' : \'\'">']],
      },
      {
        key: 'm4', level: 2, file: 'App.vue',
        label: 'ConsultDeskPage.vue で、未完了の件数を filter と矢印関数で出す（画面：未完了：2 件。案件を押して「済」にすると 1 件に減る）',
        hint: ['filter は、配列の 1 件ずつに「残すか？」を聞く。矢印関数がその質問。', '<code>cases.filter((c) =&gt; !c.done).length</code>（template では cases に .value は付けない）'],
        edits: [['<!-- ④ 未完了の件数を、filter と矢印関数で出す（done が false のものだけ数える） -->\n  <p class="open">未完了：{{ cases.length }} 件</p>', '<p class="open">未完了：{{ cases.filter((c) => !c.done).length }} 件</p>']],
      },
      {
        key: 'm5', level: 2, file: 'App.vue',
        label: 'ConsultDeskPage.vue で、送信ボタンを押して 300ms 後に「送信しました」が出るようにする（setTimeout に矢印関数を渡す）',
        hint: ['setTimeout は「あとで呼ぶ関数」を渡す。矢印関数でその場で書ける。', '<code>setTimeout(() =&gt; { sent.value = true }, 300)</code>　（script では .value）'],
        edits: [['  // ここに書く\n', '  setTimeout(() => {\n    sent.value = true\n  }, 300)\n']],
      },
      {
        key: 'm6', level: 3, file: 'App.vue',
        label: 'ConsultDeskPage.vue で、rows を map と矢印関数で作り、「1. 離婚の相談」の形で一覧に出す（オブジェクトは ( ) で包む）',
        hint: ['map は、1 件ずつを別の値に変えて、新しい配列にする。ここでは { id, label } のオブジェクトにする。', '矢印のあとでオブジェクトを返すときは、<code>({ … })</code> のように ( ) で包む。包まないと { } がブロックになる。', '<code>cases.value.map((c) =&gt; ({ id: c.id, label: c.id + \'. \' + c.title }))</code>'],
        edits: [['// ⑥ 一覧の行 rows を、cases から map と矢印関数で作る（{ id: 案件の id, label: \'1. 離婚の相談\' } の形。id と title をつなぐ）\nconst rows: Row[] = []', 'const rows: Row[] = cases.value.map((c) => ({ id: c.id, label: c.id + \'. \' + c.title }))']],
      },
    ],
    /* 順番：最初の状態 → 案件を「済」にする → 送信 → 予約 2 回（1 枠）→ もう 1 回（0 枠） */
    probe: async (win, doc) => {
      const out = {};
      const $ = (s) => doc.querySelector(s);
      const txt = (s) => (($(s) || {}).textContent || '').replace(/\s+/g, ' ').trim();
      const click = async (el, ms) => { if (el) { el.click(); await nt(win, ms); } };
      await nt(win);
      /* m4：最初は 2 件。1 件目を済にすると 1 件 */
      const open0 = txt('.open') === '未完了：2 件';
      await click($('.toggle'));
      out.m4 = open0 && txt('.open') === '未完了：1 件';
      /* m6 */
      out.m6 = [...doc.querySelectorAll('.row')].map((x) => x.textContent.trim()).join('|') === '1. 離婚の相談|2. 相続の相談|3. 労働の相談';
      /* m5 */
      await click($('.send'), 0);
      const before = !$('.sent');
      await nt(win, 450);
      out.m5 = before && !!$('.sent');
      /* m1・m2・m3 */
      const st0 = txt('.status') === '状態：受付中';
      const dis0 = !!$('.reserve') && $('.reserve').disabled === false;
      const urg0 = !!$('.slot') && !$('.slot').classList.contains('is-urgent');
      await click($('.reserve')); await click($('.reserve'));
      out.m3 = urg0 && !!$('.slot') && $('.slot').classList.contains('is-urgent');
      await click($('.reserve'));
      out.m1 = st0 && txt('.status') === '状態：満席';
      out.m2 = dis0 && !!$('.reserve') && $('.reserve').disabled === true;
      return out;
    },
  }));
})();
