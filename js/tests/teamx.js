/* 実践テスト：チーム開発系 + Vue 補足（各3問 = 初級 / 中級 / 上級） */
(function () {
  const T = (window.KENSHU.tests = window.KENSHU.tests || {});
  const VUE = 'https://unpkg.com/vue@3.4.27/dist/vue.global.prod.js';

  /* コメント以外の行だけ取り出す */
  const lines = (s) => (s || '').split('\n').map((x) => x.trim()).filter((x) => x && !/^(#|\/\/)/.test(x));
  const at = (L, re, from) => { for (let i = from == null ? 0 : from; i < L.length; i++) if (re.test(L[i])) return i; return -1; };
  const noCmt = (s) => (s || '').replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
  const part = (L, name) => { for (const x of L) { const m = x.match(new RegExp('^' + name + '\\s*[｜|:：]\\s*(.+)$')); if (m) return m[1].trim(); } return null; };
  const txt = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');

  /* ================= idea ================= */
  T['idea'] = {
    mode: 'text', height: 240,
    files: [{ name: 'pitch.txt', lang: 'txt', code: '# 30秒ピッチを書こう（1行に1パート）\n# 形：パート名｜内容\n' }],
    note: '<b>30秒ピッチ</b>を書く。<br>形は <code>パート名｜内容</code>。<br>パートは <b>課題 / 解決 / デモ / 学び</b> の4つ。<br><small>30秒は、全部で150文字くらいが目安。</small>',
    solution: '課題｜初めて相談する人は、夜に電話がつながらず、相談をあきらめて困っています。\n解決｜そこで、夜でも予約できるオンライン相談フォームを作りました。\nデモ｜ここで日時を選ぶと、空き枠がすぐ表示されます。\n学び｜TypeScript の型で、入力ミスを早く見つけられました。',
    tasks: (v) => {
      const L = lines(v['pitch.txt']);
      const P = ['課題', '解決', 'デモ', '学び'].map((n) => part(L, n));
      const idx = ['課題', '解決', 'デモ', '学び'].map((n) => at(L, new RegExp('^' + n + '\\s*[｜|:：]')));
      const ordered = idx.every((i) => i >= 0) && idx.every((x, i) => i === 0 || x > idx[i - 1]);
      const total = P.every(Boolean) ? P.join('').length : 999;
      return [
        { level: 1, label: '「課題｜」の行を書く（「〇〇な人は、△△で困っています」の形）', ok: !!P[0] && P[0].length >= 8 && /困/.test(P[0]), hint: ['「課題｜」のあとに、誰が何に困っているかを1文で。', '「困っています」という言葉を入れよう。'] },
        { level: 2, label: '「解決｜」を「そこで」で始めて、「デモ｜」の行も書く', ok: !!P[1] && /^そこで/.test(P[1]) && P[1].length >= 10 && !!P[2] && P[2].length >= 6, hint: ['解決は「そこで□□を作りました」の形。', 'デモは「ここを押すと…」のように動きを書く。'] },
        { level: 3, label: '4パートを順番に書き、全部で 20〜150 文字に収める（30秒）', ok: ordered && total >= 20 && total <= 150, hint: ['順番は 課題 → 解決 → デモ → 学び。', '1パート40文字くらいまでなら、4つで収まる。'] },
      ];
    },
  };

  /* ================= dev ================= */
  T['dev'] = {
    mode: 'text', height: 240,
    files: [{ name: 'flow.sh', lang: 'sh', code: '# 機能を1つ作って、見てもらうまで（1行に1コマンド）\n' }],
    note: '<b>1つの機能の流れ</b><br>main を最新に → branch → commit → push → PR → Merge のあと pull<br>・ブランチ名は <code>feature/名前</code><br>・PR のタイトルは <code>PR｜タイトル</code> の形で書く<br>・Merge は GitHub でするので、あとで <code>git checkout main</code> と <code>git pull</code>',
    solution: 'git checkout main\ngit pull\ngit checkout -b feature/login\ngit add .\ngit commit -m "ログイン画面を追加"\ngit push -u origin feature/login\nPR｜ログイン画面を追加（フォームと入力チェック）\ngit checkout main\ngit pull',
    tasks: (v) => {
      const L = lines(v['flow.sh']);
      const b = at(L, /^git\s+(checkout\s+-b|switch\s+-c)\s+feature\/[\w-]+$/);
      const up = b >= 0 && at(L.slice(0, b), /^git\s+(checkout|switch)\s+main$/) >= 0 && at(L.slice(0, b), /^git\s+pull(\s+origin\s+main)?$/) >= 0;
      const name = b >= 0 ? L[b].split(/\s+/).pop() : '';
      const a = at(L, /^git\s+add\s+\S+/, b + 1);
      const cm = at(L, /^git\s+commit\s+-m\s+(["'])(?!\1).{3,}\1$/, a + 1);
      const ps = cm >= 0 ? at(L, new RegExp('^git\\s+push\\s+-u\\s+origin\\s+' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'), cm + 1) : -1;
      const pr = ps >= 0 ? part(L.slice(ps + 1), 'PR') : null;
      return [
        { level: 1, label: 'main を最新にして（checkout main → pull）、作業用のブランチ feature/〇〇 を作って移る', ok: b >= 0 && up, hint: ['git checkout main → git pull → git checkout -b feature/名前', '新しい作業は、いつも最新の main から。ブランチ名は feature/ で始める。'] },
        { level: 2, label: 'add → commit で保存する（メッセージは3文字以上）', ok: b >= 0 && a >= 0 && cm >= 0, hint: ['git add . のあとに git commit -m "…"。', 'メッセージは何をしたかが分かる言葉で。'] },
        { level: 3, label: '同じブランチを push -u origin で送り、PR のタイトルを書く。Merge のあと main に戻って pull する', ok: ps >= 0 && !!pr && pr.length >= 8 && (() => { const pi = L.findIndex((x, i) => i > ps && /^PR[｜|]/.test(x)); return pi >= 0 && at(L, /^git\s+(checkout|switch)\s+main$/, pi + 1) >= 0 && at(L, /^git\s+pull(\s+origin\s+main)?$/, pi + 1) >= 0; })(), hint: ['git push -u origin feature/名前（作ったブランチ名と同じ）。', '「PR｜…」で8文字以上のタイトルを書く。Merge は GitHub 上なので、そのあと git checkout main → git pull。'] },
      ];
    },
  };

  /* ================= prep ================= */
  T['prep'] = {
    mode: 'text', height: 240,
    files: [{ name: 'slides.txt', lang: 'txt', code: '# 発表の資料を、1枚1行で書こう\n# 形：スライド名｜持ち時間（秒）\n' }],
    note: '<b>6枚の構成</b><br>タイトル / 課題 / 解決策 / デモ / 技術と工夫 / 学びと今後<br>・1行に1枚<br>・形は <code>スライド名｜30秒</code><br>・持ち時間は <b>全部で 2〜3分</b>',
    solution: 'タイトル｜10秒\n課題｜25秒\n解決策｜25秒\nデモ｜60秒\n技術と工夫｜30秒\n学びと今後｜20秒',
    tasks: (v) => {
      const L = lines(v['slides.txt']);
      const S = L.map((x) => { const m = x.match(/^(.+?)\s*[｜|]\s*(\d+)\s*秒$/); return m ? { n: m[1], s: +m[2] } : null; }).filter(Boolean);
      const NAMES = ['タイトル', '課題', '解決策', 'デモ', '技術と工夫', '学びと今後'];
      const inOrder = (k) => NAMES.slice(0, k).every((n, i) => S[i] && S[i].n.includes(n));
      const sum = S.reduce((a, b) => a + b.s, 0);
      const demo = S.find((x) => x.n.includes('デモ'));
      return [
        { level: 1, label: '最初の3枚を「タイトル → 課題 → 解決策」の順で書く', ok: inOrder(3), hint: ['1行目：タイトル｜10秒', '2行目が課題、3行目が解決策。'] },
        { level: 2, label: '6枚そろえる（タイトル・課題・解決策・デモ・技術と工夫・学びと今後）', ok: S.length === 6 && inOrder(6), hint: ['4枚目がデモ、5枚目が技術と工夫、6枚目が学びと今後。', '「スライド名｜秒数」の形を守る。'] },
        { level: 3, label: '合計を 120〜180 秒に収め、デモをいちばん長くする', ok: S.length === 6 && inOrder(6) && sum >= 120 && sum <= 180 && !!demo && S.every((x) => x === demo || x.s < demo.s), hint: ['6枚の秒数を足して、2〜3分（120〜180秒）にする。', '見せたいのはデモ。デモの秒数を最大にしよう。'] },
      ];
    },
  };

  /* ================= demo ================= */
  const STAR = (s) => (s.match(/★/g) || []).length;
  T['demo'] = {
    mode: 'text', height: 260,
    files: [{ name: 'feedback.txt', lang: 'txt', code: '# 発表へのフィードバックを書こう（1行に1つ）\n# 形：観点｜★の数｜コメント\n' }],
    note: '<b>4つの観点</b><br>アイデア / 技術 / デザイン / 発表<br>・形は <code>観点｜★★★★｜コメント</code>（★は1〜5個）<br>・「良かったです」だけは NG。理由を書く<br>・最後に <code>提案｜…</code> で、次の一歩を書く',
    solution: 'アイデア｜★★★★｜課題が具体的で、誰が困っているか分かった\n技術｜★★★｜入力チェックに型が使われていて安心できた\nデザイン｜★★★★★｜配色がそろっていて見やすかった\n発表｜★★★★｜30秒に収まっていて聞きやすかった\n提案｜次は、エラー時の画面も見せると、さらに良いです',
    tasks: (v) => {
      const L = lines(v['feedback.txt']);
      const AX = ['アイデア', '技術', 'デザイン', '発表'];
      const row = (n) => { for (const x of L) { const m = x.match(new RegExp('^' + n + '\\s*[｜|]\\s*(★{1,5})\\s*[｜|]\\s*(.+)$')); if (m) return { s: STAR(m[1]), c: m[2].trim() }; } return null; };
      const R = AX.map(row);
      const prop = part(L, '提案');
      const bad = (c) => /^(良かった|よかった|面白かった|すごかった)(です)?[！!。]*$/.test(c);
      return [
        { level: 1, label: '「アイデア｜★…｜コメント」を1行書く（コメントは4文字以上）', ok: !!R[0] && R[0].c.length >= 4, hint: ['アイデア｜★★★★｜課題が具体的', '★は1〜5個、そのあとに ｜ でコメント。'] },
        { level: 2, label: '4つの観点すべてに、★と理由つきのコメント（8文字以上）を書く', ok: R.every((r) => r && r.c.length >= 8 && !bad(r.c)), hint: ['アイデア・技術・デザイン・発表の順に1行ずつ。', '「良かった」だけにせず、何が良かったかを書く。'] },
        { level: 3, label: '「提案｜…」で、次の一歩を書く（10文字以上）', ok: R.every((r) => r && r.c.length >= 8 && !bad(r.c)) && !!prop && prop.length >= 10 && /(すると|してみ|してほしい|良い|よい|いい)/.test(prop), hint: ['提案｜次は、〇〇すると、さらに良いです', '直してほしいことを、やさしく提案の形で。'] },
      ];
    },
  };

  /* ================= x-vue-api ================= */
  T['x-vue-api'] = {
    mode: 'web', libs: [VUE], height: 340,
    files: [
      { name: 'index.html', lang: 'html', code: '<div id="app">\n  <button @click="fetchCases(false)" :disabled="loading">取得</button>\n  <button @click="fetchCases(true)" :disabled="loading">わざと失敗</button>\n  <p v-if="loading">読み込み中…</p>\n  <!-- ② 失敗したときの表示を足す（error を使う） -->\n  <ul v-else>\n    <li v-for="c in cases" :key="c.id">{{ c.title }}</li>\n  </ul>\n</div>' },
      { name: 'main.js', lang: 'js', code: 'const { createApp, ref, onMounted } = Vue\n\n// ニセの API：0.8秒後に返事。fail が true なら失敗する\nconst fakeFetch = (fail) => new Promise((resolve, reject) => {\n  setTimeout(() => {\n    if (fail) reject(new Error(\'通信エラー\'))\n    else resolve([{ id: 1, title: \'未払い残業代の相談\' }, { id: 2, title: \'契約書チェックの依頼\' }])\n  }, 800)\n})\n\ncreateApp({\n  setup() {\n    const cases = ref([])\n    const loading = ref(false)\n    const error = ref(null)\n\n    const fetchCases = async (fail) => {\n      loading.value = true\n      // ① try / catch / finally で包む（失敗しても loading を戻す）\n      cases.value = await fakeFetch(fail)\n      loading.value = false\n    }\n\n    // ③ 最初に1回、自動で取得する（onMounted）\n    return { cases, loading, error, fetchCases }\n  },\n}).mount(\'#app\')' },
    ],
    solution: {
      'index.html': '<div id="app">\n  <button @click="fetchCases(false)" :disabled="loading">取得</button>\n  <button @click="fetchCases(true)" :disabled="loading">わざと失敗</button>\n  <p v-if="loading">読み込み中…</p>\n  <p v-else-if="error" class="err">{{ error }}</p>\n  <ul v-else>\n    <li v-for="c in cases" :key="c.id">{{ c.title }}</li>\n  </ul>\n</div>',
      'main.js': 'const { createApp, ref, onMounted } = Vue\n\nconst fakeFetch = (fail) => new Promise((resolve, reject) => {\n  setTimeout(() => {\n    if (fail) reject(new Error(\'通信エラー\'))\n    else resolve([{ id: 1, title: \'未払い残業代の相談\' }, { id: 2, title: \'契約書チェックの依頼\' }])\n  }, 800)\n})\n\ncreateApp({\n  setup() {\n    const cases = ref([])\n    const loading = ref(false)\n    const error = ref(null)\n\n    const fetchCases = async (fail) => {\n      loading.value = true\n      error.value = null\n      try {\n        cases.value = await fakeFetch(fail)\n      } catch (e) {\n        error.value = e.message\n      } finally {\n        loading.value = false\n      }\n    }\n\n    onMounted(() => fetchCases(false))\n    return { cases, loading, error, fetchCases }\n  },\n}).mount(\'#app\')',
    },
    tasks: (v) => {
      const js = noCmt(v['main.js']), html = noCmt(v['index.html']);
      return [
        { level: 1, label: 'fetchCases を try / catch / finally で包み、finally で loading を false に戻す', ok: /\btry\s*\{[\s\S]*\}\s*catch\b[\s\S]*\bfinally\s*\{[^}]*loading\.value\s*=\s*false/.test(js), hint: ['try { await … } catch (e) { … } finally { … }', 'loading を戻すのは finally の中。成功でも失敗でも必ず通る。'] },
        { level: 2, label: '失敗したとき、error をエラー用の表示（v-else-if="error"）で画面に出す', ok: /\bcatch\b[^}]*error\.value\s*=/.test(js) && /v-(else-)?if\s*=\s*"\s*error\b/.test(html) && /\{\{\s*error\b/.test(html), hint: ['catch の中で error.value = e.message。', '<p v-else-if="error">{{ error }}</p> を v-else の前に置く。'] },
        { level: 3, label: 'ページを開いたとき、onMounted で自動的に1回取得する', ok: /onMounted\s*\(\s*(\(\s*\)\s*=>\s*(\{[^}]*)?\s*fetchCases\s*\(|fetchCases\s*\))/.test(js), hint: ['onMounted(() => fetchCases(false))', 'onMounted は import 済み（上の分割代入にある）。'] },
      ];
    },
  };

  /* ================= x-vue-slots ================= */
  T['x-vue-slots'] = {
    mode: 'web', libs: [VUE], height: 340,
    files: [
      { name: 'index.html', lang: 'html', code: '<div id="app">\n  <my-card>\n    <!-- ① 本文の穴：文章をそのまま書く -->\n    <!-- ② 見出しとフッターの穴：<template #header> / <template #footer> -->\n  </my-card>\n\n  <case-list>\n    <!-- ③ 子のデータを受け取る：<template v-slot="{ item }"> で <strong> に包む -->\n  </case-list>\n</div>' },
      { name: 'main.js', lang: 'js', code: 'const { createApp } = Vue\nconst app = createApp({})\n\napp.component(\'my-card\', {\n  template: `<div class="card">\n    <div class="head"><slot name="header">（見出しなし）</slot></div>\n    <div class="body"><slot>（本文なし）</slot></div>\n    <div class="foot"><slot name="footer">（フッターなし）</slot></div>\n  </div>`,\n})\n\napp.component(\'case-list\', {\n  data() { return { items: [{ id: 1, name: \'労働問題\' }, { id: 2, name: \'契約トラブル\' }] } },\n  template: `<ul class="case-list">\n    <li v-for="item in items" :key="item.id"><slot :item="item">{{ item.name }}</slot></li>\n  </ul>`,\n})\n\napp.mount(\'#app\')' },
    ],
    solution: {
      'index.html': '<div id="app">\n  <my-card>\n    <template #header>本日の相談</template>\n    <p>未払い残業代の相談を受け付けます。</p>\n    <template #footer>予約制</template>\n  </my-card>\n\n  <case-list>\n    <template v-slot="{ item }"><strong>{{ item.name }}</strong></template>\n  </case-list>\n</div>',
    },
    tasks: (v, c) => {
      const d = c.doc && c.doc();
      const q = (s) => (d ? d.querySelector(s) : null);
      const body = txt(q('.card .body')), head = txt(q('.card .head')), foot = txt(q('.card .foot'));
      const st = d ? d.querySelectorAll('.case-list li strong') : [];
      return [
        { level: 1, label: 'デフォルトの穴（本文）に、文章を入れる', ok: !!body && body !== '（本文なし）', hint: ['<my-card> の中に、そのまま <p>…</p> を書く。', '名前のない穴には、タグの中身がそのまま入る。'] },
        { level: 2, label: '名前付きの穴（見出しとフッター）に、<template #header> と <template #footer> で入れる', ok: !!head && head !== '（見出しなし）' && !!foot && foot !== '（フッターなし）', hint: ['<template #header>見出し</template>', '<template #footer>フッター</template> も同じ形。'] },
        { level: 3, label: 'case-list のスロットで item を受け取り、名前を <strong> で表示する', ok: st.length >= 2 && /労働問題/.test(txt(st[0])) && /契約トラブル/.test(txt(st[1])), hint: ['<template v-slot="{ item }">…</template>', '中に <strong>{{ item.name }}</strong> を書く。'] },
      ];
    },
  };

  /* ================= x-vue-dynamic ================= */
  T['x-vue-dynamic'] = {
    mode: 'web', libs: [VUE], height: 340,
    files: [
      { name: 'index.html', lang: 'html', code: '<div id="app">\n  <button v-for="(c, name) in tabs" :key="name" @click="current = name">{{ name }}</button>\n  <hr>\n  <!-- ① <component :is="tabs[current]"> を書く -->\n  <!-- ② KeepAlive で包む（タグは <keep-alive>） -->\n  <!-- ③ 外側の <div> に v-bind="boxAttrs" を付ける -->\n</div>' },
      { name: 'main.js', lang: 'js', code: 'const { createApp, ref, markRaw } = Vue\n\nconst CaseTab = { template: \'<div class="tab-cases">案件一覧 <input placeholder="検索キーワード"></div>\' }\nconst SettingsTab = { template: \'<div class="tab-settings">設定</div>\' }\n\ncreateApp({\n  setup() {\n    const tabs = { 案件一覧: markRaw(CaseTab), 設定: markRaw(SettingsTab) }\n    const current = ref(\'案件一覧\')\n    // まとめて渡す属性（v-bind="boxAttrs"）\n    const boxAttrs = { class: \'box\', id: \'main-box\', \'data-role\': \'tab\' }\n    return { tabs, current, boxAttrs }\n  },\n}).mount(\'#app\')' },
    ],
    solution: {
      'index.html': '<div id="app">\n  <button v-for="(c, name) in tabs" :key="name" @click="current = name">{{ name }}</button>\n  <hr>\n  <div v-bind="boxAttrs">\n    <keep-alive>\n      <component :is="tabs[current]"></component>\n    </keep-alive>\n  </div>\n</div>',
    },
    tasks: (v, c) => {
      const d = c.doc && c.doc();
      const html = noCmt(v['index.html']);
      const box = d && d.getElementById('main-box');
      return [
        { level: 1, label: '<component :is="tabs[current]"> で、選んだタブを表示する', ok: !!(d && d.querySelector('.tab-cases')) && /<component[^>]+:is\s*=/.test(html), hint: ['<component :is="tabs[current]"></component>', 'tabs[current] が、いま表示する部品になる。'] },
        { level: 2, label: '<keep-alive> で包んで、切り替えても入力が消えないようにする', ok: /<keep-alive[\s>][\s\S]*<component[\s\S]*<\/keep-alive>/i.test(html), hint: ['<keep-alive> … </keep-alive> で <component> を包む。', 'DOM 内のテンプレートでは、タグは小文字ハイフンの keep-alive。'] },
        { level: 3, label: '外側の <div> に v-bind="boxAttrs" を付けて、class・id・data 属性をまとめて渡す', ok: !!box && box.classList.contains('box') && box.getAttribute('data-role') === 'tab' && !!box.querySelector('.tab-cases, .tab-settings'), hint: ['<div v-bind="boxAttrs"> で、オブジェクトの中身が属性になる。', 'その div の中に <component> を入れる。'] },
      ];
    },
  };

  /* ================= x-vue-composables ================= */
  const CMP_HTML = '<div id="app">\n  <estimate-qty></estimate-qty>\n  <booking-qty></booking-qty>\n</div>';
  T['x-vue-composables'] = {
    mode: 'web', libs: [VUE], height: 340,
    files: [
      { name: 'index.html', lang: 'html', code: CMP_HTML },
      { name: 'main.js', lang: 'js', code: 'const { createApp, ref } = Vue\n\n// ① useCounter(initial = 0) を作る：count と increment を返す\n// ② 見積と予約の setup は、同じコードのコピー。useCounter を呼ぶだけにする\n// ③ 予約は useCounter(10) で 10 から始める\n\nconst EstimateQty = {\n  setup() {\n    const count = ref(0)\n    const increment = () => count.value++\n    return { count, increment }\n  },\n  template: \'<button class="a" @click="increment">見積: {{ count }}</button>\',\n}\nconst BookingQty = {\n  setup() {\n    const count = ref(0)\n    const increment = () => count.value++\n    return { count, increment }\n  },\n  template: \'<button class="b" @click="increment">予約: {{ count }}</button>\',\n}\n\ncreateApp({ components: { EstimateQty, BookingQty } }).mount(\'#app\')' },
    ],
    solution: {
      'main.js': 'const { createApp, ref } = Vue\n\nfunction useCounter(initial = 0) {\n  const count = ref(initial)\n  const increment = () => count.value++\n  return { count, increment }\n}\n\nconst EstimateQty = {\n  setup() { return useCounter() },\n  template: \'<button class="a" @click="increment">見積: {{ count }}</button>\',\n}\nconst BookingQty = {\n  setup() { return useCounter(10) },\n  template: \'<button class="b" @click="increment">予約: {{ count }}</button>\',\n}\n\ncreateApp({ components: { EstimateQty, BookingQty } }).mount(\'#app\')',
    },
    tasks: (v, c) => {
      const js = noCmt(v['main.js']);
      const d = c.doc && c.doc();
      const def = /(function\s+useCounter\s*\([^)]*\)|(const|let)\s+useCounter\s*=\s*(\([^)]*\)|\w+)\s*=>)/.test(js);
      const ret = def && /useCounter[\s\S]*?return\s*\{[^}]*\bcount\b[^}]*\bincrement\b[^}]*\}|useCounter[\s\S]*?return\s*\{[^}]*\bincrement\b[^}]*\bcount\b[^}]*\}/.test(js);
      const calls = (js.match(/\buseCounter\s*\(/g) || []).length;
      const a = txt(d && d.querySelector('.a')), b = txt(d && d.querySelector('.b'));
      return [
        { level: 1, label: 'useCounter 関数を作り、count と increment を返す', ok: ret, hint: ['function useCounter(initial = 0) { … }', '中で ref を作り、return { count, increment }。'] },
        { level: 2, label: '見積と予約の setup が、どちらも useCounter を呼ぶ（コピーをやめる）', ok: def && calls >= 3 && !!a && !!b, hint: ['setup() { return useCounter() }', '見積も予約も同じ呼び方。定義と合わせて useCounter( が3回出る。'] },
        { level: 3, label: '予約は useCounter(10) で 10 から始まり、見積は 0 のまま（別々の状態）', ok: def && /\b10\b/.test(b) && /\b0\b/.test(a) && !/\b10\b/.test(a), hint: ['useCounter に初期値を渡せるようにする（initial = 0）。', '予約の setup で useCounter(10)。'] },
      ];
    },
  };

  /* ================= x-vue-state ================= */
  T['x-vue-state'] = {
    mode: 'web', libs: [VUE], height: 340,
    files: [
      { name: 'index.html', lang: 'html', code: '<div id="app">\n  <p>未読：<span class="badge">3</span></p>\n  <!-- ① 親から name を渡す -->\n  <!-- ③ 子の add を受け取って、count を増やす（バッジは {{ count }}） -->\n  <notice-item></notice-item>\n</div>' },
      { name: 'main.js', lang: 'js', code: 'const { createApp, ref } = Vue\n\nconst NoticeItem = {\n  // ① props: [\'name\'] で、親からの name を受け取る\n  props: [],\n  // ② ボタンを押したら、親へ \'add\' を知らせる（$emit）\n  template: `<div class="pc"><b class="pc-name">{{ name || \'（件名なし）\' }}</b> <button class="pc-btn">既読にする</button></div>`,\n}\n\ncreateApp({\n  components: { NoticeItem },\n  setup() {\n    const count = ref(3)\n    return { count }\n  },\n}).mount(\'#app\')' },
    ],
    solution: {
      'index.html': '<div id="app">\n  <p>未読：<span class="badge">{{ count }}</span></p>\n  <notice-item name="契約書の確認が届きました" @add="count--"></notice-item>\n</div>',
      'main.js': 'const { createApp, ref } = Vue\n\nconst NoticeItem = {\n  props: [\'name\'],\n  emits: [\'add\'],\n  template: `<div class="pc"><b class="pc-name">{{ name || \'（件名なし）\' }}</b> <button class="pc-btn" @click="$emit(\'add\')">既読にする</button></div>`,\n}\n\ncreateApp({\n  components: { NoticeItem },\n  setup() {\n    const count = ref(3)\n    return { count }\n  },\n}).mount(\'#app\')',
    },
    tasks: (v, c) => {
      const js = noCmt(v['main.js']), html = noCmt(v['index.html']);
      const d = c.doc && c.doc();
      const nm = txt(d && d.querySelector('.pc-name'));
      return [
        { level: 1, label: '親から子へ name を渡す（props）。カードに通知の件名が出る', ok: !!nm && nm !== '（件名なし）' && /props\s*:\s*(\[[^\]]*['"]name['"]|\{[^}]*\bname\b)/.test(js), hint: ['子：props: [\'name\']', '親：<notice-item name="契約書の確認が届きました">'] },
        { level: 2, label: '子のボタンを押したら、親へ \'add\' を知らせる（$emit）', ok: /(\$emit|emit)\s*\(\s*['"]add['"]/.test(js) && /@click\s*=/.test(js), hint: ['ボタンに @click="$emit(\'add\')"。', 'イベント名は add。'] },
        { level: 3, label: '親が @add で受け取って count を減らし、バッジに {{ count }} を出す（未読が減る）', ok: /<notice-item[^>]*@add\s*=\s*"[^"]+"/.test(html) && /class\s*=\s*"badge"[^>]*>\s*\{\{\s*count\s*\}\}/.test(html), hint: ['<notice-item @add="count--">', '<span class="badge">{{ count }}</span>'] },
      ];
    },
  };

  /* ================= x-vue-render ================= */
  T['x-vue-render'] = {
    mode: 'text', height: 260,
    files: [{ name: 'nuxt.config.ts', lang: 'ts', code: 'export default defineNuxtConfig({\n  routeRules: {\n    // ここに、ページごとの方式を書く\n  },\n})\n' }],
    note: '<b>ページごとに方式を選ぶ</b>（routeRules）<br>・<code>/admin/**</code>：管理画面。SEO は不要 → <b>SPA</b>（<code>ssr: false</code>）<br>・<code>/</code>：トップ。ほぼ変わらない → <b>SSG</b>（<code>prerender: true</code>）<br>・<code>/blog/**</code>：記事。60秒ごとに更新 → <b>ISR</b>（<code>isr: 60</code>）',
    solution: 'export default defineNuxtConfig({\n  routeRules: {\n    \'/\': { prerender: true },\n    \'/blog/**\': { isr: 60 },\n    \'/admin/**\': { ssr: false },\n  },\n})\n',
    tasks: (v) => {
      const L = (v['nuxt.config.ts'] || '').split('\n').map((x) => x.trim()).filter((x) => x && !x.startsWith('//'));
      const rule = (path) => L.find((x) => new RegExp('^[\'"`]' + path.replace(/[*/]/g, '\\$&') + '[\'"`]\\s*:').test(x)) || '';
      return [
        { level: 1, label: '管理画面 /admin/** を SPA にする（ssr: false）', ok: /ssr\s*:\s*false/.test(rule('/admin/**')), hint: ["'/admin/**': { ssr: false }", 'SPA は、ブラウザで画面を作る方式。'] },
        { level: 2, label: 'トップ / を SSG にする（ビルド時に作る：prerender: true）', ok: /prerender\s*:\s*true/.test(rule('/')), hint: ["'/': { prerender: true }", 'SSG は、ビルドのときに HTML を作っておく方式。'] },
        { level: 3, label: 'ブログ /blog/** を ISR にして、60秒ごとに作り直す（isr: 60）', ok: /isr\s*:\s*60\b/.test(rule('/blog/**')), hint: ["'/blog/**': { isr: 60 }", 'ISR は、一定時間ごとに作り直す方式。'] },
      ];
    },
  };

  /* ================= x-vue-workflow ================= */
  T['x-vue-workflow'] = {
    mode: 'text', height: 240,
    files: [{ name: 'workflow.sh', lang: 'sh', code: '# 機能を1つ作って、コミットするまで（1行に1コマンド）\n' }],
    note: '<b>1 つの機能ができるまで</b><br>Issue → Branch → 整える → commit → PR<br>・ブランチ名は <code>feat/名前</code>（半角英数とハイフン）<br>・コミットの頭は <code>feat:</code> や <code>fix:</code><br>・コミット前に <b>Prettier</b>（整形）と <b>ESLint</b>（チェック）',
    solution: 'git checkout -b feat/login\nnpx prettier --write .\nnpx eslint .\ngit add .\ngit commit -m "feat: ログイン画面を追加"',
    tasks: (v) => {
      const L = lines(v['workflow.sh']);
      const b = at(L, /^git\s+(checkout\s+-b|switch\s+-c)\s+(feat|fix)\/[a-z0-9]+(-[a-z0-9]+)*$/);
      const a = at(L, /^git\s+add\s+\S+/, b + 1);
      const cm = a >= 0 ? at(L, /^git\s+commit\s+-m\s+(["'])(feat|fix|docs|refactor|test|chore):\s*\S.{2,}\1$/, a + 1) : -1;
      const pr = at(L, /^(npx\s+)?prettier\s+(--write|-w)\b|^npm\s+run\s+format\b/, b + 1);
      const es = at(L, /^(npx\s+)?eslint\b|^npm\s+run\s+lint\b/, b + 1);
      return [
        { level: 1, label: '作業用ブランチを feat/〇〇 の名前で作る（半角英数とハイフン）', ok: b >= 0, hint: ['git checkout -b feat/login', 'feat/ か fix/ で始めて、あとは小文字の英数字とハイフン。'] },
        { level: 2, label: 'add → commit する。コミットメッセージの頭に feat: を付ける', ok: b >= 0 && cm >= 0, hint: ['git add . のあとに git commit -m "feat: …"', '頭は「feat:」+ 半角スペース + 内容。'] },
        { level: 3, label: 'コミットの前に、Prettier（整形）と ESLint（チェック）を実行する', ok: cm >= 0 && pr >= 0 && es >= 0 && pr < cm && es < cm, hint: ['npx prettier --write . と npx eslint .', 'どちらも git commit より前の行に書く。'] },
      ];
    },
  };
})();
