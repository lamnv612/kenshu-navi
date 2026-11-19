/* 補足 Vue「ref と .value のひみつ」（x-vue-ref）のレッスン最終テスト。K.vueTestTools.web で作る。
   1 つの .vue だけ（<script setup lang="ts">）。初級×3・中級×2・上級×1。
   script では .value、template では .value なし／取り出すと切れる／ref の配列・object */
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
}

const cases: Case[] = [
  { id: 1, title: '離婚の相談' },
  { id: 2, title: '相続の相談' },
  { id: 3, title: '労働の相談' },
]

// ① 受付件数 received を ref<number>(0) にして、receive で 1 増やす（.value を付ける）
let received: number = 0
const receive = (): void => {
  received++
}

// ② 選んだ案件 selected を ref<Case | null>(null) にして、select で入れる
let selected: Case | null = null
const select = (c: Case): void => {
  selected = c
}

// ③ 相談分野の一覧 areas を ref<string[]>([]) で作り、addArea で追加する（push）
const addArea = (name: string): void => {
  // ここに書く
}

// ④ 選択を外す関数 clearSelected を作る（selected.value = null）

// ⑤ 全部をリセットする関数 resetAll を作る（received は 0、selected は null、areas は空の配列に）

// ⑥ stats には ref をそのまま入れてある。template 側の書き方を直す
const stats = { received }
</script>

<template>
  <h2>相談デスク</h2>

  <p class="received">受付：{{ received }} 件</p>
  <button class="receive" @click="receive">受付</button>
  <p class="next">次の受付番号：{{ stats.received + 1 }}</p>

  <ul class="cases">
    <li v-for="c in cases" :key="c.id" @click="select(c)">{{ c.title }}</li>
  </ul>
  <p class="selected">選択中：{{ selected ? selected.title : 'なし' }}</p>
  <button class="unselect" @click="clearSelected">選択を外す</button>

  <button class="area" @click="addArea('離婚')">離婚</button>
  <button class="area" @click="addArea('相続')">相続</button>
  <ul class="areas">
    <li v-for="a in areas" :key="a">{{ a }}</li>
  </ul>

  <button class="reset" @click="resetAll">リセット</button>
</template>
`;

  lock('x-vue-ref', web({
    height: 340,
    alias: { 'App.vue': 'ConsultDeskPage.vue' },
    paths: { 'App.vue': 'src/views/ConsultDeskPage.vue' },
    fileNotes: { 'App.vue': '相談デスク。script では .value、template では .value なし' },
    starter: { 'App.vue': APP },
    steps: [
      {
        key: 'm1', level: 1, file: 'App.vue',
        label: 'ConsultDeskPage.vue で、received を ref にして、受付ボタンで 1 増やす（画面：受付：1 件）',
        hint: ['ふつうの変数（let）は、増やしても画面が変わらない。ref にして、script では .value で増やす。', '<code>const received = ref&lt;number&gt;(0)</code> と <code>received.value++</code>。'],
        edits: [['// ① 受付件数 received を ref<number>(0) にして、receive で 1 増やす（.value を付ける）\nlet received: number = 0\nconst receive = (): void => {\n  received++\n}', 'const received = ref<number>(0)\nconst receive = (): void => {\n  received.value++\n}']],
      },
      {
        key: 'm2', level: 1, file: 'App.vue',
        label: 'ConsultDeskPage.vue で、selected を ref<Case | null> にして、案件を押すと「選択中：離婚の相談」と出す',
        hint: ['「まだ選んでいない」は null で表す。型は <code>Case | null</code>。', '<code>const selected = ref&lt;Case | null&gt;(null)</code>、select の中は <code>selected.value = c</code>。template の <code>selected</code> に .value は付けない。'],
        edits: [['// ② 選んだ案件 selected を ref<Case | null>(null) にして、select で入れる\nlet selected: Case | null = null\nconst select = (c: Case): void => {\n  selected = c\n}', 'const selected = ref<Case | null>(null)\nconst select = (c: Case): void => {\n  selected.value = c\n}']],
      },
      {
        key: 'm3', level: 1, file: 'App.vue',
        label: 'ConsultDeskPage.vue で、areas を ref<string[]> にして、分野ボタンを押すと一覧に並ぶ（push）',
        hint: ['配列の ref は、中身の型も書く：<code>ref&lt;string[]&gt;([])</code>。', 'script では <code>areas.value.push(name)</code>。template の v-for は <code>areas</code> のまま。'],
        edits: [['// ③ 相談分野の一覧 areas を ref<string[]>([]) で作り、addArea で追加する（push）\nconst addArea = (name: string): void => {\n  // ここに書く\n}', 'const areas = ref<string[]>([])\nconst addArea = (name: string): void => {\n  areas.value.push(name)\n}']],
      },
      {
        key: 'm4', level: 2, file: 'App.vue',
        label: 'ConsultDeskPage.vue で、clearSelected を作り、「選択を外す」で「選択中：なし」に戻す',
        hint: ['ref に null を代入して、「何も選んでいない」に戻す。', '<code>const clearSelected = (): void =&gt; { selected.value = null }</code>'],
        edits: [['// ④ 選択を外す関数 clearSelected を作る（selected.value = null）', 'const clearSelected = (): void => {\n  selected.value = null\n}']],
      },
      {
        key: 'm5', level: 2, file: 'App.vue',
        label: 'ConsultDeskPage.vue で、resetAll を作り、受付・選択・分野を最初の状態に戻す',
        hint: ['3 つの ref を、それぞれ .value で元に戻す。', '配列は丸ごと入れ替えてよい：<code>areas.value = []</code>。（<code>areas = []</code> では箱ごと別物になってしまう）'],
        edits: [['// ⑤ 全部をリセットする関数 resetAll を作る（received は 0、selected は null、areas は空の配列に）', 'const resetAll = (): void => {\n  received.value = 0\n  selected.value = null\n  areas.value = []\n}']],
      },
      {
        key: 'm6', level: 3, file: 'App.vue',
        label: 'ConsultDeskPage.vue の template で、stats.received に .value を付ける（画面：次の受付番号：2）',
        hint: ['自動で .value が外れるのは、script setup の一番外側の ref だけ。stats のような object の中の ref は、箱のまま。', '<code>{{ stats.received.value + 1 }}</code>'],
        edits: [['{{ stats.received + 1 }}', '{{ stats.received.value + 1 }}']],
      },
    ],
    /* 順番：受付 → 次の番号 → 案件を選ぶ → 外す → 選び直す → 分野を2つ → リセット */
    probe: async (win, doc) => {
      const out = {};
      const $ = (s) => doc.querySelector(s);
      const txt = (s) => (($(s) || {}).textContent || '').replace(/\s+/g, ' ').trim();
      const click = async (el) => { if (el) { el.click(); await nt(win); } };
      await click($('.receive'));
      out.m1 = txt('.received') === '受付：1 件';
      out.m6 = txt('.next') === '次の受付番号：2';
      await click($('.cases li'));
      const sel1 = txt('.selected') === '選択中：離婚の相談';
      out.m2 = sel1;
      await click($('.unselect'));
      out.m4 = sel1 && txt('.selected') === '選択中：なし';
      await click($('.cases li:nth-child(2)'));
      const areaBtns = [...doc.querySelectorAll('.area')];
      await click(areaBtns[0]); await click(areaBtns[1]);
      const items = [...doc.querySelectorAll('.areas li')].map((x) => x.textContent.trim());
      out.m3 = items.join(',') === '離婚,相続';
      const before = txt('.received') === '受付：1 件' && txt('.selected') === '選択中：相続の相談' && items.length === 2;
      await click($('.reset'));
      out.m5 = before && txt('.received') === '受付：0 件' && txt('.selected') === '選択中：なし' && doc.querySelectorAll('.areas li').length === 0;
      return out;
    },
  }));
})();
