/* vue-intro のテスト（初級×3・中級×1・上級×1）。K.vueTestTools.web で作る。
   紹介レッスンの範囲だけ：1つの .vue（ReservePage.vue）に、<template> の文字・{{ }}・ref だけを使う。
   部品・props・型ファイル・@click・v-if は、まだ習っていないので出さない */
(function () {
  const K = window.KENSHU;
  if (!K || !K.vueTestTools) return;
  const { web } = K.vueTestTools;

  const APP = [
    '<script setup>',
    "import { ref } from 'vue'",
    '',
    '// ③ 残り枠 slots を ref(3) で作る',
    '</script>',
    '',
    '<template>',
    '  <!-- ① h2 に「初回相談の予約」と書く -->',
    '  <h2>（見出し）</h2>',
    '  <!-- ② p に「弁護士が30分、無料でうかがいます」と書く -->',
    '  <p>（説明）</p>',
    '  <!-- ③ p に「残り枠：{{ slots }}」と書く -->',
    '  <p>残り枠：（未設定）</p>',
    '  <!-- ④ 枠が 5 に増えた。上の script の slots を書き換える -->',
    '  <!-- ⑤ 全 10 枠のうち予約済みの数を、{{ 10 - slots }} の式で計算して出す -->',
    '  <p>予約済み：（未設定）</p>',
    '</template>',
    '',
  ].join('\n');

  K.tests['vue-intro'] = web({
    height: 300,
    alias: { 'App.vue': 'ReservePage.vue' },
    paths: { 'App.vue': 'src/App.vue' },
    fileNotes: { 'App.vue': '画面。データ（slots）を script に置き、template の {{ }} で出す' },
    starter: { 'App.vue': APP },
    steps: [
      { key: 'm1', level: 1, file: 'App.vue', label: 'ReservePage.vue で、h2 に「初回相談の予約」と書く（画面：初回相談の予約）', hint: ['画面の形は、template に HTML の文字を書いて作る。', '<code>&lt;h2&gt;初回相談の予約&lt;/h2&gt;</code>'], edits: [['<h2>（見出し）</h2>', '<h2>初回相談の予約</h2>']] },
      { key: 'm2', level: 1, file: 'App.vue', label: 'ReservePage.vue で、p に「弁護士が30分、無料でうかがいます」と書く（画面：その文）', hint: ['文字はそのまま p の中に書けばよい。', '<code>&lt;p&gt;弁護士が30分、無料でうかがいます&lt;/p&gt;</code>'], edits: [['<p>（説明）</p>', '<p>弁護士が30分、無料でうかがいます</p>']] },
      { key: 'm3', level: 1, file: 'App.vue', label: 'ReservePage.vue で、slots を ref(3) で作り、p に「残り枠：{{ slots }}」と書く（画面：残り枠：3）', hint: ['データは script に <code>const slots = ref(3)</code>。', 'template では <code>{{ slots }}</code> と書く（.value は付けない）。'], edits: [['// ③ 残り枠 slots を ref(3) で作る', 'const slots = ref(3)'], ['<p>残り枠：（未設定）</p>', '<p>残り枠：{{ slots }}</p>']] },
      { key: 'm4', level: 2, file: 'App.vue', label: 'ReservePage.vue で、slots の数字を 5 に書き換える（画面：残り枠：5）', hint: ['template は触らずに、データだけ書き換える。', '<code>const slots = ref(5)</code>'], edits: [['const slots = ref(3)', 'const slots = ref(5)']] },
      { key: 'm5', level: 3, file: 'App.vue', label: 'ReservePage.vue で、{{ 10 - slots }} の式で、「予約済み：◯ 枠（全 10 枠）」と表示する（画面：予約済み：5 枠）', hint: ['{{ }} の中には、引き算などの式も書ける。', '<code>&lt;p&gt;予約済み：{{ 10 - slots }} 枠（全 10 枠）&lt;/p&gt;</code>'], edits: [['<p>予約済み：（未設定）</p>', '<p>予約済み：{{ 10 - slots }} 枠（全 10 枠）</p>']] },
    ],
    probe: async (win, doc) => {
      const out = {};
      const h2 = doc.querySelector('h2');
      out.m1 = !!h2 && h2.textContent.trim() === '初回相談の予約';
      const body = (doc.querySelector('#app') || doc.body).textContent;
      out.m2 = body.includes('弁護士が30分、無料でうかがいます');
      const m = body.match(/残り枠：\s*(\d+)/);
      const n = m ? +m[1] : -1;
      out.m3 = n >= 0;
      out.m4 = n === 5;
      const r = body.match(/予約済み：\s*(\d+)\s*枠（全 10 枠）/);
      out.m5 = !!r && n >= 0 && +r[1] === 10 - n;
      return out;
    },
  });
})();
