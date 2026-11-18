/* vue-basics のテスト（初級×3・中級×1・上級×1）。CaseForm.vue ＋ types.ts ＋ data.ts の3ファイル構成 */
(function () {
  const K = window.KENSHU;
  if (!K || !K.vueTestTools) return;
  const { web, nt, type } = K.vueTestTools;

  const APP = [
    '<script setup lang="ts">',
    "import { ref } from 'vue'",
    "import type { Case } from './types'",
    "import { initialCases } from './data'",
    '',
    "const title = ref<string>('')",
    'const showTips = ref<boolean>(false)',
    'const slots = ref<number>(3)',
    'const onlyUrgent = ref<boolean>(false)',
    'const cases = ref<Case[]>(initialCases)',
    '',
    '// ③ 「予約する」で slots を 1 減らす関数 reserve を作る',
    '// ⑤ onlyUrgent が true のときは、urgent の案件だけの shown を computed で作る',
    '</script>',
    '',
    '<template>',
    '  <!-- ① 件名欄と title をつなぐ -->',
    '  <input placeholder="相談の件名">',
    '  <p>件名：{{ title }}</p>',
    '',
    '  <button @click="showTips = !showTips">入力のコツ</button>',
    '  <!-- ② showTips が true のときだけ見せる -->',
    '  <p>具体的な日付や金額を書くと、回答が早くなります</p>',
    '',
    '  <!-- ③ 予約ボタンで残り枠が減る -->',
    '  <p>残り枠：{{ slots }}</p>',
    '  <button>予約する</button>',
    '',
    '  <!-- ⑤ チェックを onlyUrgent とつなぎ、一覧を shown にする -->',
    '  <label><input type="checkbox"> 急ぎだけ表示</label>',
    '  <!-- ④ cases を並べ、urgent が true の案件に class="urgent" を付ける -->',
    '  <ul>',
    '    <li>（ここを書き換える）</li>',
    '  </ul>',
    '</template>',
    '',
    '<style scoped>',
    '.urgent { color: #e11; font-weight: 700; }',
    '</style>',
    '',
  ].join('\n');

  const TYPES = [
    '// 案件の「形」を決める型。CaseForm.vue と data.ts から import type { Case } で借りる',
    'export interface Case {',
    '  id: number',
    '  title: string',
    '  urgent: boolean',
    '}',
    '',
  ].join('\n');

  const DATA = [
    "import type { Case } from './types'",
    '',
    '// 画面に出す案件データ（本物では API から取る）',
    'export const initialCases: Case[] = [',
    "  { id: 1, title: '未払い残業代の相談', urgent: true },",
    "  { id: 2, title: '契約書チェックの依頼', urgent: false },",
    "  { id: 3, title: '交通事故の示談', urgent: true },",
    ']',
    '',
  ].join('\n');

  K.tests['vue-basics'] = web({
    height: 300,
    alias: { 'App.vue': 'CaseForm.vue' },
    fileNotes: { 'App.vue': '画面（ここを直す）', 'types.ts': '型 Case', 'data.ts': '案件データ' },
    starter: { 'App.vue': APP, 'types.ts': TYPES, 'data.ts': DATA },
    steps: [
      { key: 'm1', level: 1, file: 'App.vue', label: '入力した件名が「件名：◯◯」に出る（v-model）', hint: ['入力欄とデータをつなぐのは <code>v-model</code>。', '<code>&lt;input v-model="title" placeholder="相談の件名"&gt;</code>'], edits: [['<input placeholder="相談の件名">', '<input v-model="title" placeholder="相談の件名">']] },
      { key: 'm2', level: 1, file: 'App.vue', label: '入力のコツは最初は見えず、「入力のコツ」ボタンで出る（v-if）', hint: ['出したり消したりは <code>v-if</code>（または v-show）。条件は showTips。', '<code>&lt;p v-if="showTips"&gt;具体的な日付や金額を…&lt;/p&gt;</code>'], edits: [['<p>具体的な日付や金額を書くと、回答が早くなります</p>', '<p v-if="showTips">具体的な日付や金額を書くと、回答が早くなります</p>']] },
      { key: 'm3', level: 1, file: 'App.vue', label: '「予約する」を押すたびに、残り枠が 3 → 2 → 1 と減る（@click ＋ 型付きの関数）', hint: ['script に <code>function reserve(): void { slots.value-- }</code> を書く。', 'ボタンは <code>&lt;button @click="reserve"&gt;予約する&lt;/button&gt;</code>。script の中では <code>.value</code> が要る。'], edits: [['// ③ 「予約する」で slots を 1 減らす関数 reserve を作る', 'function reserve(): void {\n  slots.value--\n}'], ['<button>予約する</button>', '<button @click="reserve">予約する</button>']] },
      { key: 'm4', level: 2, file: 'App.vue', label: '相談を3件並べ、急ぎの2件だけ赤くする（v-for ＋ :class。型は types.ts の Case）', hint: ['並べるのは <code>v-for="c in cases" :key="c.id"</code>。cases の型は types.ts の <code>Case</code>。', '赤くするのは <code>:class="{ urgent: c.urgent }"</code>。'], edits: [['<li>（ここを書き換える）</li>', '<li v-for="c in cases" :key="c.id" :class="{ urgent: c.urgent }">{{ c.title }}</li>']] },
      { key: 'm5', level: 3, file: 'App.vue', label: '「急ぎだけ表示」にチェックすると、急ぎの2件だけに絞られる（computed<Case[]> ＋ v-model）', hint: ['<code>const shown = computed&lt;Case[]&gt;(() =&gt; onlyUrgent.value ? cases.value.filter((c) =&gt; c.urgent) : cases.value)</code>。computed は import が必要。', 'チェックは <code>v-model="onlyUrgent"</code>、一覧は <code>v-for="c in shown"</code>。'], edits: [["import { ref } from 'vue'", "import { ref, computed } from 'vue'"], ['// ⑤ onlyUrgent が true のときは、urgent の案件だけの shown を computed で作る', 'const shown = computed<Case[]>(() =>\n  onlyUrgent.value ? cases.value.filter((c) => c.urgent) : cases.value,\n)'], ['<label><input type="checkbox"> 急ぎだけ表示</label>', '<label><input type="checkbox" v-model="onlyUrgent"> 急ぎだけ表示</label>'], ['v-for="c in cases"', 'v-for="c in shown"']] },
    ],
    probe: async (win, doc) => {
      const out = {};
      const vis = (el) => !!el && win.getComputedStyle(el).display !== 'none';
      const secret = () => [...doc.querySelectorAll('p')].find((x) => x.textContent.includes('具体的な日付'));
      const btnOf = (t) => [...doc.querySelectorAll('button')].find((b) => b.textContent.includes(t));
      const slotsText = () => { const p = [...doc.querySelectorAll('p')].find((x) => x.textContent.includes('残り枠')); const m = p && p.textContent.match(/\d+/); return m ? +m[0] : -1; };
      const pre = !vis(secret());
      const inp = doc.querySelector('input');
      if (inp) { await type(win, inp, '契約の相談'); out.m1 = doc.body.textContent.includes('件名：契約の相談'); }
      const tip = btnOf('入力のコツ');
      if (tip) { tip.click(); await nt(win); }
      out.m2 = pre && vis(secret());
      const rb = btnOf('予約する'), s0 = slotsText();
      if (rb) { rb.click(); await nt(win); }
      const s1 = slotsText();
      if (rb) { rb.click(); await nt(win); }
      out.m3 = !!rb && s0 === 3 && s1 === 2 && slotsText() === 1;
      const names = () => [...doc.querySelectorAll('li')].map((l) => l.textContent.trim());
      const reds = () => [...doc.querySelectorAll('li')].filter((l) => l.classList.contains('urgent')).map((l) => l.textContent.trim());
      out.m4 = names().join(',') === '未払い残業代の相談,契約書チェックの依頼,交通事故の示談' && reds().join(',') === '未払い残業代の相談,交通事故の示談';
      const chk = doc.querySelector('input[type=checkbox]');
      out.m5 = false;
      if (chk && out.m4) {
        const before = names().length;
        chk.click(); await nt(win);
        const on = names().join(',');
        chk.click(); await nt(win);
        out.m5 = before === 3 && on === '未払い残業代の相談,交通事故の示談' && names().length === 3;
      }
      return out;
    },
  });
})();
