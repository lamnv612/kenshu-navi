/* Supplement lessons (補足) — Vue: x-vue-api / slots / dynamic / composables / state / render / workflow */
(function () {
  'use strict';
  const K = window.KENSHU, { h, code, stepper, playground, quiz, lbl, style, sleep, icon, esc } = K.W;
  const VUE = 'https://unpkg.com/vue@3.4.27/dist/vue.global.prod.js';
  const C = 'var(--vue)';

  style('xv', `
  .xv-split{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;align-items:stretch}
  .xv-split>pre.code{margin:0}
  .xv-pane{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:16px;display:flex;flex-direction:column;gap:10px;justify-content:center;min-width:0}
  .xv-pane.light{background:#fff;color:#222}
  .xv-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
  .xv-chip{display:inline-flex;gap:.4em;align-items:center;padding:.15em .8em;border-radius:6px;font:700 .75rem var(--mono);background:var(--bg2);border:1px solid var(--line);color:var(--text);transition:.3s}
  .xv-chip.on{background:var(--c,var(--vue));border-color:var(--c,var(--vue));color:#06101f}
  .xv-chip.flash{animation:xvflash .7s}
  @keyframes xvflash{30%{transform:scale(1.18);box-shadow:0 0 22px var(--c,var(--vue))}}
  .xv-btn{all:unset;cursor:pointer;padding:.35em 1em;border-radius:6px;border:2px solid var(--line);font-weight:800;font-size:.875rem;transition:.2s;text-align:center}
  .xv-btn:hover{border-color:var(--c,var(--vue));transform:translateY(-1px)}
  .xv-btn.on{background:var(--c,var(--vue));border-color:var(--c,var(--vue));color:#06101f}
  .xv-btn.big{background:linear-gradient(135deg,var(--vue),var(--ts));border:0;color:#06101f;padding:.5em 1.4em;font-size:1rem;box-shadow:0 8px 20px -8px var(--vue)}
  .xv-btn[disabled]{opacity:.4;pointer-events:none}
  .xv-stage{position:relative;border-radius:8px;background:var(--code);border:1px solid var(--line);overflow:hidden}
  .xv-node{position:absolute;transform:translate(-50%,-50%);padding:.25em .8em;border-radius:8px;border:2px solid var(--nc,var(--line));background:var(--bg2);font:800 .75rem var(--mono);white-space:nowrap;transition:.3s;z-index:2;color:var(--text)}
  .xv-node.hit{background:var(--nc);color:#06101f;transform:translate(-50%,-50%) scale(1.18);box-shadow:0 0 22px var(--nc)}
  .xv-pkt{position:absolute;z-index:5;transform:translate(-50%,-50%);padding:.1em .7em;border-radius:6px;font:800 .75rem var(--mono);background:var(--pc,var(--vue));color:#06101f;box-shadow:0 6px 16px -4px var(--pc,var(--vue));transition:left .55s ease-in-out,top .55s ease-in-out,opacity .3s;white-space:nowrap}
  .xv-ui{border-radius:8px;background:#fff;color:#222;padding:12px;min-height:200px;border:1px solid var(--line)}
  .xv-ui .sk{height:44px;border-radius:6px;margin:8px 0;background:linear-gradient(90deg,#eceff7 25%,#f7f8fc 50%,#eceff7 75%);background-size:200% 100%;animation:xvsk 1.1s linear infinite}
  @keyframes xvsk{to{background-position:-200% 0}}
  .xv-ui .post{padding:8px 10px;border:1px solid #e3e6f2;border-radius:6px;margin:6px 0;animation:pop .4s both;font-size:.875rem}
  .xv-ui .post b{color:#2fa57f}
  .xv-ui .err{padding:14px;border-radius:8px;background:#fff0f0;border:2px solid #ff6b7a;color:#b3202f;font-weight:800;animation:shake .4s}
  .xv-branch{display:flex;gap:6px;flex-wrap:wrap}
  .xv-branch span{font:700 .68rem var(--mono);padding:.1em .6em;border-radius:8px;background:#eef;color:#667;transition:.3s}
  .xv-branch span.on{background:#2fd4a4;color:#06101f;transform:scale(1.08)}
  .xv-range{display:flex;align-items:center;gap:10px;font-weight:800;font-size:.875rem}
  .xv-range input{flex:1;accent-color:var(--vue)}
  .xv-hole{min-height:56px;border-radius:8px;border:2px dashed var(--hc);display:grid;place-items:center;color:var(--hc);font:700 .75rem var(--mono);transition:.25s;cursor:pointer;position:relative;padding:6px;text-align:center}
  .xv-hole.want{animation:pulse 1s infinite;background:color-mix(in srgb,var(--hc) 14%,transparent)}
  .xv-hole.over{background:color-mix(in srgb,var(--hc) 30%,transparent);transform:scale(1.02)}
  .xv-hole.full{border-style:solid;color:#222;background:#fff;font-family:var(--font);font-weight:400;text-align:left;place-items:stretch;animation:pop .4s both}
  .xv-hole.full::after{content:attr(data-n);position:absolute;right:6px;top:-9px;font:700 .62rem var(--mono);background:var(--hc);color:#06101f;padding:0 .5em;border-radius:6px}
  .xv-card{border-radius:8px;background:#f7f8fd;padding:10px;display:grid;gap:8px;color:#222}
  .xv-pal{display:flex;gap:6px;flex-wrap:wrap}
  .xv-pal button{all:unset;cursor:grab;padding:.25em .8em;border-radius:6px;font-weight:800;font-size:.875rem;background:var(--card2);border:1px solid var(--line);transition:.2s}
  .xv-pal button:hover{transform:translateY(-2px)}.xv-pal button.sel{background:var(--vue);color:#06101f;border-color:var(--vue);transform:translateY(-3px) rotate(-2deg)}
  .xv-badge{display:inline-block;padding:.05em .7em;border-radius:6px;background:#5b9dff;color:#fff;font-weight:800;font-size:.75rem}
  .xv-fruit{display:flex;align-items:center;gap:8px;padding:.3em .7em;border-radius:6px;background:var(--bg2);border:1px solid var(--line);font-weight:800;transition:.3s}
  `);

  style('vref', ".vref{width:100%;border-collapse:collapse;font-size:.875rem}.vref th,.vref td{padding:.5em .7em;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}.vref th{color:var(--mute);font-size:.75rem;font-weight:800;letter-spacing:.06em}.vref td:first-child{font-weight:800;white-space:nowrap}.vref code{font-family:var(--mono);font-size:.85em;background:var(--card2);padding:.05em .35em;border-radius:5px}");
  const sp = (a, b) => h('div', { class: 'xv-split' }, a, b);
  const pane = (...k) => h('div', { class: 'xv-pane' }, ...k);
  const flash = (e) => { e.classList.remove('flash'); void e.offsetWidth; e.classList.add('flash'); };
  const chip = (t) => h('span', { class: 'xv-chip' }, t);
  const demo = (title, html, js, tasks) => playground({ title, mode: 'web', libs: [VUE], files: [{ name: 'index.html', lang: 'html', code: html }, { name: 'main.js', lang: 'js', code: js }], tasks });
  const gh = (label, path) => ({ label, path });
  const pickQuiz = (el, title, qs) => el.append(h('div', { class: 'xv-pane', style: { marginTop: '14px' } }, lbl(title || '使い分けクイズ'), h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '18px 22px' } }, qs.map(([q, opts, ans, why]) => quiz({ q, options: opts, answer: ans, why })))));
  const reg = (o) => K.reg(Object.assign({ track: 'extra' }, o));

  /* ====================================================== x-vue-api */
  reg({
    id: 'x-vue-api', title: 'API 呼び出し', sub: 'loading / error / data の3状態', emoji: '🌐',
    gh: [gh('vuejs/11_api', 'vuejs/11_api')],
    meta: { cat: 'vue', day: '24日(火)', when: 'Life Cycle の後・Vue Router の前（onMounted を学んだ直後）', mins: 15, order: 30, level: '応用', after: 'vue-life', why: 'スライドに無いが、実務の画面は必ず「通信中・失敗・成功」を扱う' },
    scenes: [
      {
        t: 'fetch と3つの状態', ref: [{"title": "ステータス早見", "icon": "table", "html": "<table class=\"vref\"><thead><tr><th>番号</th><th>意味</th></tr></thead><tbody><tr><td>200</td><td>成功</td></tr><tr><td>404</td><td>見つからない</td></tr><tr><td>500</td><td>サーバーの失敗</td></tr><tr><td><code>res.ok</code></td><td>200番台のとき true</td></tr></tbody></table>"}], why: {"pv": {"k": "code", "file": "Posts.vue", "lang": "ts", "text": "const res = await fetch(url)\nposts.value = await res.json()\n// 遅い・失敗 → 真っ白のまま", "err": [3], "keys": {"1": "state"}}, "iv": {"k": "code", "file": "Posts.vue", "lang": "ts", "text": "const loading = ref(true)\nconst error = ref(null)\nconst data = ref(null)\n// 1つだけ表示する", "idea": [1, 2, 3], "keys": {"1": "state"}}, "av": {"k": "code", "file": "Posts.vue", "lang": "ts", "text": "try { data.value = await load() }\ncatch (e) { error.value = e }\nfinally { loading.value = false }", "ok": [1, 2, 3], "keys": {"3": "state"}}, "problem": "通信は遅く、失敗もする", "idea": "<b>読込中・エラー・成功</b>の1つだけ表示", "answer": "loading / error / data + try / catch", "when": [["初回表示のデータ", "onMounted で取得"], ["ボタンで更新", "クリックで fetchPosts"], ["入力に合わせて何度も取得", "watch + デバウンス"]]}, tag: 'API', lead: '通信は<b>遅い</b>し、<b>失敗</b>もする。だから画面は「読み込み中 / エラー / 成功」を切り替える。スライダーとスイッチで試そう。',
        render(el, ctx) {
          const src = `const fetchPosts = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
    posts.value = await res.json()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
onMounted(fetchPosts)`;
          const pre = code(src, 'ts', { dim: true, color: C, file: 'fetchPosts.ts' });
          const titles = ['sunt aut facere', 'qui est esse', 'ea molestias quasi', 'eum et est occaecati', 'nesciunt quas odio'];
          const S = { loading: false, error: null, posts: [], count: 0 };
          const chips = { loading: chip(''), error: chip(''), posts: chip(''), count: chip('') };
          const br = ['v-if="loading"', 'v-else-if="error"', 'v-else-if="posts.length"'].map((t) => h('span', t));
          const view = h('div', { class: 'xv-ui' });
          let latency = 1.2, mode = 'ok', busy = false, alive = true;
          const prev = {};
          function paint() {
            const vals = { loading: 'loading: ' + S.loading, error: 'error: ' + (S.error ? '"' + S.error + '"' : 'null'), posts: 'posts: [' + S.posts.length + ']', count: 'fetch ' + S.count + '回目' };
            for (const k in chips) { chips[k].textContent = vals[k]; if (prev[k] !== undefined && prev[k] !== vals[k]) flash(chips[k]); prev[k] = vals[k]; }
            chips.loading.classList.toggle('on', S.loading);
            const b = S.loading ? 0 : S.error ? 1 : S.posts.length ? 2 : -1;
            br.forEach((e, i) => e.classList.toggle('on', i === b));
            view.replaceChildren(...(S.loading ? [h('div', { class: 'sk' }), h('div', { class: 'sk' }), h('div', { class: 'sk' }), h('div', { style: { color: '#889', fontSize: '.75rem' } }, 'データを取得中…')]
              : S.error ? [h('div', { class: 'err' }, '⚠ エラー: ' + S.error)]
                : S.posts.length ? S.posts.map((p, i) => h('div', { class: 'post', style: { animationDelay: i * 60 + 'ms' } }, h('b', '#' + p.id + ' '), p.title))
                  : [h('div', { style: { color: '#999' } }, 'データがありません')]));
          }
          async function run() {
            if (busy) return; busy = true; go.disabled = true;
            const hi = async (ls, ms = 420) => { pre.setHi(ls); await sleep(ms); };
            S.count++; await hi([1, 2, 3]); S.loading = true; S.error = null; paint();
            await hi([4, 5]);
            await sleep(latency * 1000);
            if (!alive) return;
            if (mode === 'net') { await hi([5]); await hi([8, 9]); S.error = 'Failed to fetch'; }
            else if (mode === '500') { await hi([5, 6]); await hi([8, 9]); S.error = 'HTTP 500'; }
            else { await hi([5, 6, 7]); S.posts = titles.map((t, i) => ({ id: i + 1, title: t })); }
            await hi([11]); S.loading = false; paint(); await sleep(500); pre.setHi([]);
            busy = false; go.disabled = false;
          }
          const go = h('button', { class: 'xv-btn big', onclick: run }, '▶ データを取得（fetchPosts）');
          const lat = h('input', { type: 'range', min: 3, max: 30, value: 12, oninput: (e) => { latency = e.target.value / 10; lt.textContent = latency.toFixed(1) + ' 秒'; } });
          const lt = h('b', '1.2 秒');
          const modes = [['ok', '成功 200'], ['500', 'サーバー 500'], ['net', '通信エラー']];
          const mb = modes.map(([k, t]) => h('button', { class: 'xv-btn' + (k === 'ok' ? ' on' : ''), onclick: () => { mode = k; mb.forEach((b, i) => b.classList.toggle('on', modes[i][0] === k)); } }, t));
          el.append(sp(
            pane(pre, h('div', { class: 'xv-row' }, chip('onMounted(fetchPosts)'), chip('try / catch / finally'))),
            pane(h('div', { class: 'xv-row' }, chips.loading, chips.error, chips.posts, chips.count),
              h('div', { class: 'xv-branch' }, br), view,
              h('div', { class: 'xv-range' }, '遅さ', lat, lt), h('div', { class: 'xv-row' }, '結果：', mb), go)));
          paint();
          pickQuiz(el, '使い分けクイズ', [['「読み込み中」の表示を出さないと、どうなる？', ['ユーザーが固まったと思って、何度も押してしまう', '特に問題ない', 'エラーになる'], 0, '待っていることを見せる。ボタンを押せなくするのもセットで。'], ['一覧を最初に1回取得する定番の場所は？', ['onMounted', 'computed', 'template の中'], 0, '初回取得は onMounted。入力に合わせて何度も取るなら watch。']]);
          return () => { alive = false; };
        },
      },
      {
        t: 'リクエストの旅', why: {"pv": {"k": "code", "file": "Posts.vue", "lang": "ts", "text": "btn.onclick = async () => {\n  const r = await fetch(url)\n  show(r)   // いつ何が起きた？\n}", "err": [2, 3], "keys": {"1": "req"}}, "iv": {"k": "code", "file": "流れ", "lang": "ts", "text": "① loading = true\n② await fetch(url)  // 送信→待つ\n③ data = await res.json()\n④ finally: loading = false", "idea": [2], "keys": {"2": "req"}}, "av": {"k": "code", "file": "Posts.vue", "lang": "ts", "text": "loading.value = true\nawait fetch(url)\nloading.value = false", "ok": [1, 2, 3], "keys": {"2": "req"}}, "problem": "クリックから表示まで、見えない", "idea": "順に追う：<b>待つ → 送る → 結果</b>", "answer": "async / await と状態の切替", "when": [["成功（200）", "res.ok → データを代入"], ["失敗（500・通信エラー）", "throw → catch → エラー表示"]]}, tag: 'flow', lead: '「次へ」で、クリックから画面が変わるまでを追う。右上のスイッチで、失敗した場合も見られる。',
        render(el) {
          let fail = false, api, ui, st;
          const mk = (cls, x, t, c) => h('div', { class: 'xv-node', style: { left: x + '%', top: '30%', '--nc': c, fontSize: '.875rem' } }, t);
          const nUI = mk('', 18, '画面', 'var(--ts)'), nJS = mk('', 50, 'fetch()', 'var(--vue)'), nSv = mk('', 82, 'サーバー', 'var(--team)');
          const pk = h('div', { class: 'xv-pkt', style: { left: '18%', top: '58%' } }, 'click');
          const lineSvg = `<svg viewBox="0 0 100 60" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%"><line x1="18" y1="18" x2="82" y2="18" stroke="rgba(255,255,255,.2)" stroke-width=".4" stroke-dasharray="2 2"/></svg>`;
          const state = h('div', { class: 'xv-row', style: { position: 'absolute', left: '12px', right: '12px', bottom: '10px' } });
          const stage = h('div', { class: 'xv-stage', style: { height: '230px' } });
          stage.insertAdjacentHTML('beforeend', lineSvg);
          stage.append(nUI, nJS, nSv, pk, state);
          const tgl = h('button', { class: 'xv-btn', onclick: () => { fail = !fail; tgl.classList.toggle('on', fail); tgl.textContent = fail ? '失敗ルート ON (500)' : '失敗ルート OFF'; api.go(api.cur); } }, '失敗ルート OFF');
          const view = h('div', { class: 'xv-ui', style: { minHeight: '120px' } });
          const hiList = [[], [2, 3], [5], [5], [6, 8, 9], [11]];
          const pre = code('async () => {\n  loading.value = true\n  error.value = null\n  try {\n    const res = await fetch(url)\n    if (!res.ok) throw new Error(...)\n    posts.value = await res.json()\n  } catch (err) {\n    error.value = err.message\n  } finally {\n    loading.value = false\n  }\n}', 'ts', { dim: true, color: C });
          const steps = [
            { say: '<b>クリック</b>：ユーザーが「取得」ボタンを押した。' },
            { say: '<b>loading = true</b>：まず画面を「読み込み中」にする（スケルトン表示）。' },
            { say: '<b>リクエスト送信</b>：fetch が サーバーへ。ここから先は待つしかない。' },
            { say: '<b>サーバーが処理中</b>：データを探している。その間も画面は止まらない（非同期）。' },
            { say: fail ? '<b>500 が返った</b>：res.ok が false → throw → <b>catch</b> に飛ぶ。' : '<b>200 が返った</b>：res.ok が true → json() を posts に代入。' },
            { say: '<b>finally</b>：成功でも失敗でも必ず loading=false。画面が結果に切り替わる。' },
          ];
          function paintAt(i) {
            nUI.classList.toggle('hit', i === 0 || i === 5); nJS.classList.toggle('hit', i === 1 || i === 2 || i === 4); nSv.classList.toggle('hit', i === 3);
            const pos = [18, 18, 82, 82, 50, 18][i];
            pk.style.left = pos + '%'; pk.textContent = ['click', 'loading', 'GET /posts', '…DB', fail ? '500' : '200 OK', fail ? 'エラー表示' : '一覧表示'][i];
            pk.style.setProperty('--pc', i === 4 && fail || i === 5 && fail ? '#ff6b7a' : i === 4 || i === 5 ? '#4ade80' : 'var(--vue)');
            state.replaceChildren(chip('loading: ' + (i >= 1 && i < 5)), chip('error: ' + (i === 5 && fail ? '"HTTP 500"' : 'null')), chip('posts: ' + (i === 5 && !fail ? 5 : 0)));
            view.replaceChildren(...(i >= 1 && i < 5 ? [h('div', { class: 'sk' }), h('div', { class: 'sk' })] : i === 5 ? (fail ? [h('div', { class: 'err' }, '⚠ HTTP 500')] : [h('div', { class: 'post' }, h('b', '#1 '), 'sunt aut facere'), h('div', { class: 'post' }, h('b', '#2 '), 'qui est esse')]) : [h('div', { style: { color: '#999' } }, '（まだ何も表示されていない）')]));
            pre.setHi(i === 4 ? (fail ? [6, 8, 9] : [6, 7]) : i === 5 ? [10, 11] : hiList[i]);
          }
          el.append(h('div', { class: 'xv-row', style: { justifyContent: 'flex-end', marginBottom: '8px' } }, tgl));
          el.append(stepper({
            color: C, steps,
            init(vis, a) { api = a; vis.append(sp(h('div', { class: 'col', style: { display: 'grid', gap: '12px' } }, stage, view), pre)); },
            update(i, s) { s.say = steps[i].say; paintAt(i); },
          }));
        },
      },
      {
        t: '実践：3状態の画面を作る', tag: 'PRACTICE', lead: "ニセの API（fakeFetch）で、失敗しても止まらない画面にしよう。TODO コメントを書き換える。",
        render(el, ctx) {
          K.vueTools.practice(el, ctx, { title: "API", starter: {"index.html": "<div id=\"app\">\n  <button @click=\"fetchPosts(false)\" :disabled=\"loading\">取得</button>\n  <button @click=\"fetchPosts(true)\" :disabled=\"loading\">わざと失敗</button>\n  <p v-if=\"loading\">読み込み中…</p>\n  <!-- ② 失敗したときの表示を足す -->\n  <ul v-else>\n    <li v-for=\"p in posts\" :key=\"p.id\">{{ p.title }}</li>\n  </ul>\n</div>", "main.js": "const { createApp, ref, onMounted } = Vue\n\n// ニセの API：0.8秒後に返事。fail が true なら失敗する\nconst fakeFetch = (fail) => new Promise((resolve, reject) => {\n  setTimeout(() => {\n    if (fail) reject(new Error('通信エラー'))\n    else resolve([{ id: 1, title: 'りんご' }, { id: 2, title: 'みかん' }])\n  }, 800)\n})\n\ncreateApp({\n  setup() {\n    const posts = ref([])\n    const loading = ref(false)\n    const error = ref(null)\n\n    const fetchPosts = async (fail) => {\n      loading.value = true\n      // ① ここを try / catch / finally で包む\n      posts.value = await fakeFetch(fail)\n      loading.value = false\n    }\n\n    // ③ 最初に1回、自動で取得する（onMounted）\n    return { posts, loading, error, fetchPosts }\n  },\n}).mount('#app')"}, steps: [
      Object.assign({"file": "main.js", "label": "「わざと失敗」を押しても、「読み込み中…」のまま止まらない（try / catch / finally）", "hint": ["失敗しても必ず「読み込み中」を終わらせたい。<code>try / catch / finally</code> が使える。", "<code>finally { loading.value = false }</code> を忘れずに。catch では <code>error.value = e.message</code>。"], "edits": [["      // ① ここを try / catch / finally で包む\n      posts.value = await fakeFetch(fail)\n      loading.value = false\n", "      error.value = null\n      try {\n        posts.value = await fakeFetch(fail)\n      } catch (e) {\n        error.value = e.message\n      } finally {\n        loading.value = false\n      }\n"]]}, { ok: (R) => R.m1 }),
      Object.assign({"file": "index.html", "label": "失敗したら、画面に「エラー」と出る（v-else-if）", "hint": ["error があるときの表示を、<code>v-if</code> の仲間 <code>v-else-if</code> で足す。", "<code>&lt;p v-else-if=\"error\"&gt;エラー：{{ error }}&lt;/p&gt;</code>"], "edits": [["  <!-- ② 失敗したときの表示を足す -->\n", "  <p v-else-if=\"error\">エラー：{{ error }}</p>\n"]]}, { ok: (R) => R.m2 }),
      Object.assign({"file": "main.js", "label": "ページを開くと、自動で一覧が出る（onMounted）", "hint": ["表示された直後に動かすのは <code>onMounted</code>。", "<code>onMounted(() => fetchPosts(false))</code>"], "edits": [["    // ③ 最初に1回、自動で取得する（onMounted）\n", "    onMounted(() => fetchPosts(false))\n"]]}, { ok: (R) => R.m3 }),
      Object.assign({"file": "index.html", "label": "エラーのとき「もう一度」ボタンを出し、押すと取得し直す", "hint": ["エラー表示の中にボタンを置く。2つ並べるときは <code>&lt;div&gt;</code> で包む。", "<code>&lt;button @click=\"fetchPosts(false)\"&gt;もう一度&lt;/button&gt;</code>"], "edits": [["  <p v-else-if=\"error\">エラー：{{ error }}</p>\n", "  <div v-else-if=\"error\">\n    <p>エラー：{{ error }}</p>\n    <button @click=\"fetchPosts(false)\">もう一度</button>\n  </div>\n"]], "optional": true}, { ok: (R) => R.o1 }),
    ], probe: async (win, doc) => {
      const wait = (ms) => new Promise((r) => setTimeout(r, ms));
      const out = {};
      await wait(1200);
      out.m3 = doc.querySelectorAll('li').length >= 1;
      const btns = doc.querySelectorAll('button');
      if (btns[1] && !btns[1].disabled) {
        btns[1].click(); await wait(1500);
        const t = doc.getElementById('app').textContent;
        out.m1 = !t.includes('読み込み中'); out.m2 = t.includes('エラー');
        const retry = [...doc.querySelectorAll('button')].find((b) => b.textContent.includes('もう一度'));
        if (retry) { retry.click(); await wait(1500); out.o1 = doc.querySelectorAll('li').length >= 1 && !doc.getElementById('app').textContent.includes('エラー'); }
      } else { out.m1 = false; out.m2 = false; }
      return out;
    } });
        },
      },
    ],
  });

  /* ====================================================== x-vue-slots */
  reg({
    id: 'x-vue-slots', title: 'スロット (Slots)', sub: '部品に「穴」を空ける', emoji: '🧩',
    gh: [gh('99_bonus/Slots.md', 'vuejs/99_bonus/Slots.md'), gh('03_props', 'vuejs/03_props')],
    meta: { cat: 'vue', day: '19日(木)', when: 'コンポーネント(props/emit)の直後、時間が余ったら', mins: 10, order: 31, level: '応用', after: 'vue-comp', why: 'props では渡せない「見た目（HTML）」を、使う人が差し込める' },
    scenes: [
      {
        t: '穴あきカード', ref: [{"title": "slot の書き方", "icon": "table", "html": "<table class=\"vref\"><thead><tr><th>書き方</th><th>意味</th></tr></thead><tbody><tr><td><code>&lt;slot /&gt;</code></td><td>何も名前がない穴（default）</td></tr><tr><td><code>&lt;slot name=\"header\" /&gt;</code></td><td>名前付きの穴</td></tr><tr><td><code>#header</code></td><td>名前付きの穴に入れる</td></tr><tr><td><code>&lt;slot&gt;代わり&lt;/slot&gt;</code></td><td>何も入らないときの表示</td></tr></tbody></table>"}], why: {"pv": {"k": "code", "file": "Page.vue", "lang": "html", "text": "<Card title=\"見出し\" />\n// 見出しにボタンを入れたい…\n// props は文字しか渡せない", "err": [2, 3], "keys": {"1": "slot"}}, "iv": {"k": "code", "file": "Card.vue", "lang": "html", "text": "<div class=\"card\">\n  <slot name=\"header\" />\n  <slot />\n</div>", "idea": [2], "keys": {"2": "slot"}}, "av": {"k": "code", "file": "Page.vue", "lang": "html", "text": "<Card>\n  <template #header>\n    <button>編集</button>\n  </template>\n</Card>", "ok": [2, 3], "keys": {"2": "slot"}}, "problem": "props では自由な中身を渡せない", "idea": "部品は<b>穴だけ</b>。中身は使う人が入れる", "answer": "<b>&lt;slot&gt;</b>（名前付きも可）", "when": [["文字・数値などのデータ", "props"], ["HTML・部品そのもの（見た目）", "slot"], ["複数の場所に差し込む", "名前付き slot"]]}, tag: 'slot', lead: '部品に<b>穴（slot）</b>を空けておくと、使う人が中身を入れられる。パーツを選んで、穴をクリック（ドラッグも可）。',
        render(el) {
          const parts = [
            ['title', '見出し', '<h3 style="margin:0">春の新商品</h3>'], ['img', '画像', '<div style="height:42px;border-radius:8px;background:linear-gradient(135deg,#ff6b9d,#5b9dff)"></div>'],
            ['text', '本文', '<p style="margin:0;font-size:.875rem">やさしい甘さの限定ドリンク。</p>'], ['btn', 'ボタン', '<button style="padding:.2em 1em;border-radius:6px;border:0;background:#2fd4a4;font-weight:800">購入</button>'],
            ['note', '注意書き', '<small style="color:#a66">※数量限定</small>'],
          ];
          const holes = { header: null, default: null, footer: null };
          const meta = { header: ['<slot name="header">', 'var(--ts)', '#header'], default: ['<slot />', 'var(--vue)', '(default)'], footer: ['<slot name="footer">', 'var(--pink)', '#footer'] };
          let sel = null;
          const hel = {};
          const card = h('div', { class: 'xv-card' });
          const codeBox = h('div');
          const pal = h('div', { class: 'xv-pal' });
          function fill(k, pid) { holes[k] = pid; sel = null; draw(); }
          Object.keys(holes).forEach((k) => {
            const e = h('div', { class: 'xv-hole', style: { '--hc': meta[k][1] }, ondragover: (ev) => { ev.preventDefault(); e.classList.add('over'); }, ondragleave: () => e.classList.remove('over'),
              ondrop: (ev) => { ev.preventDefault(); fill(k, ev.dataTransfer.getData('text/plain')); }, onclick: () => { if (sel) fill(k, sel); else if (holes[k]) fill(k, null); }, title: '空にするにはクリック' });
            hel[k] = e; card.append(e);
          });
          parts.forEach(([id, t]) => pal.append(h('button', { draggable: 'true', 'data-id': id, ondragstart: (ev) => ev.dataTransfer.setData('text/plain', id), onclick: () => { sel = sel === id ? null : id; draw(); } }, t)));
          function draw() {
            pal.querySelectorAll('button').forEach((b) => b.classList.toggle('sel', b.dataset.id === sel));
            for (const k in holes) {
              const e = hel[k], p = parts.find((x) => x[0] === holes[k]);
              e.className = 'xv-hole' + (p ? ' full' : sel ? ' want' : '');
              e.dataset.n = meta[k][2];
              e.innerHTML = p ? p[2] : esc(meta[k][0]);
            }
            const use = ['<Card>']; const ind = '  ';
            const piece = (k) => { const p = parts.find((x) => x[0] === holes[k]); return p ? p[2].replace(/ style="[^"]*"/g, '') : null; };
            if (holes.header) use.push(ind + '<template #header>', ind + ind + piece('header'), ind + '</template>');
            if (holes.default) use.push(ind + piece('default'));
            if (holes.footer) use.push(ind + '<template #footer>', ind + ind + piece('footer'), ind + '</template>');
            if (use.length === 1) use.push(ind + '<!-- 穴を埋めるとここに増える -->');
            use.push('</Card>');
            codeBox.replaceChildren(code('<!-- Card.vue（部品側） -->\n<div class="card">\n  <slot name="header" />\n  <slot />\n  <slot name="footer" />\n</div>', 'html', { color: C, hi: [3, 4, 5].filter((n) => [holes.header, holes.default, holes.footer][n - 3]), dim: true }),
              h('div', { style: { height: '10px' } }), code(use.join('\n'), 'html', { color: C, file: '使う側' }));
          }
          el.append(sp(pane(lbl('パーツ（クリックで選択 / ドラッグ）'), pal, lbl('Card の中身（穴）'), card, h('small', { style: { color: 'var(--mute)' } }, '埋めた穴をクリックすると空に戻ります')), pane(codeBox)));
          draw();
          pickQuiz(el, '使い分けクイズ：props？ slot？', [['カードの<b>見出しの文字だけ</b>を変えたい。', ['props', 'slot', 'emit'], 0, 'ただのデータ（文字）は props が簡単。'], ['カードの中に、ボタンや画像など<b>自由な HTML</b> を入れたい。', ['props', 'slot', 'emit'], 1, '見た目（HTML・部品）を差し込むのが slot。']]);
        },
      },
      {
        t: 'スコープ付きスロット', why: {"pv": {"k": "code", "file": "Page.vue", "lang": "html", "text": "// 子 FruitList が items を持つ\n// 親は見せ方を変えたい\n<FruitList />  <!-- 見えない -->", "err": [3], "keys": {"3": "scope"}}, "iv": {"k": "code", "file": "FruitList.vue", "lang": "html", "text": "<li v-for=\"item in items\">\n  <slot :item=\"item\" />\n</li>", "idea": [2], "keys": {"2": "scope"}}, "av": {"k": "code", "file": "Page.vue", "lang": "html", "text": "<FruitList v-slot=\"{ item }\">\n  <b>{{ item.name }}</b>\n</FruitList>", "ok": [1, 2], "keys": {"1": "scope"}}, "problem": "データは子、見せ方は親が決めたい", "idea": "子が slot で<b>データを渡す</b>", "answer": "<b>v-slot=\"{ item }\"</b>", "when": [["描き方を使い手に任せたい", "スコープ付き slot"], ["見た目が固定", "普通の v-for"]]}, tag: 'scoped', lead: 'データは子が持っているけれど、<b>見せ方は親が決めたい</b>とき。子が slot にデータを渡し、親が受け取る。',
        render(el) {
          let style_ = 0;
          const items = ['りんご', 'みかん', 'ぶどう'];
          const emo = ['🍎', '🍊', '🍇'];
          const pc = h('div', { class: 'xv-pane', style: { '--c': 'var(--ts)' } });
          const cc = h('div', { class: 'xv-pane' });
          const out = h('div', { style: { display: 'grid', gap: '6px' } });
          const pk = items.map((t, i) => h('div', { class: 'xv-pkt', style: { left: '75%', top: '50%', opacity: 0, '--pc': 'var(--team)' } }, '{ item: "' + t + '" }'));
          const host = h('div', { style: { position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '48px 16px', alignItems: 'start' } });
          const parentCode = h('div'), childCode = h('div');
          const tg = [0, 1].map((i) => h('button', { class: 'xv-btn' + (i === 0 ? ' on' : ''), onclick: () => { style_ = i; tg.forEach((b, j) => b.classList.toggle('on', j === i)); api.go(api.cur); } }, ['バッジ風', '太字リスト'][i]));
          let api;
          const draw = (n) => {
            parentCode.replaceChildren(code(`<FruitList v-slot="{ item }">\n  ${style_ === 0 ? '<span class="badge">{{ item }}</span>' : '<b>◆ {{ item }}</b>'}\n</FruitList>`, 'html', { color: 'var(--ts)', dim: true, file: '親', hi: n >= 2 ? [1, 2] : [] }));
            childCode.replaceChildren(code('<ul>\n  <li v-for="item in items">\n    <slot :item="item" />\n  </li>\n</ul>', 'html', { color: C, dim: true, file: '子 FruitList.vue', hi: n >= 1 ? [3] : n === 0 ? [2] : [] }));
            pk.forEach((p, i) => { p.style.opacity = n === 1 ? 1 : 0; p.style.top = n === 1 ? 14 + i * 16 + '%' : '50%'; p.style.left = n === 1 ? '50%' : '75%'; });
            out.replaceChildren(...(n >= 3 ? items.map((t, i) => h('div', { class: 'xv-fruit', style: { animation: 'pop .4s both', animationDelay: i * 90 + 'ms' } }, style_ === 0 ? h('span', { class: 'xv-badge' }, emo[i] + ' ' + t) : h('b', '◆ ' + t))) : n === 0 ? items.map((t) => h('div', { class: 'xv-fruit', style: { opacity: .5 } }, '(データだけ) ' + t)) : [h('div', { style: { color: 'var(--mute)' } }, n === 1 ? '…パケットが親へ' : '親が見た目を決定中…')]));
          };
          const steps = [
            { say: '子 <b>FruitList</b> は items データだけ持っている。見た目はまだ決まっていない。' },
            { say: '<b>&lt;slot :item="item" /&gt;</b>：子が「これ使って」と、データを slot に渡す。' },
            { say: '親が <b>v-slot="{ item }"</b> で受け取り、描き方を決める。（下のボタンで変更！）' },
            { say: '子の <b>v-for</b> が回るたび、親のテンプレートで描かれる → 完成。' },
          ];
          el.append(h('div', { class: 'xv-row', style: { marginBottom: '8px' } }, '親の描き方：', tg));
          el.append(stepper({
            color: C, steps,
            init(vis, a) { api = a; host.append(h('div', null, parentCode), h('div', null, childCode), h('div', { style: { gridColumn: '1 / -1' } }, out), ...pk); vis.append(host); },
            update(n) { draw(n); },
          }));
        },
      },
      {
        t: '実践：名前付きスロットのカード', tag: 'PRACTICE', lead: "my-card には 3つの穴（header / 本文 / footer）がある。全部に中身を入れよう。",
        render(el, ctx) {
          K.vueTools.practice(el, ctx, { title: "Slots", starter: {"index.html": "<div id=\"app\">\n  <my-card>\n    <!-- ① 見出しの穴に入れる：<template #header>…</template> -->\n    <!-- ② 本文の穴には、そのまま文章を書く -->\n    <!-- ③ フッターの穴に入れる：<template #footer>…</template> -->\n  </my-card>\n</div>", "main.js": "const { createApp } = Vue\nconst app = createApp({\n  data: () => ({ n: 0 }),   // 任意チャレンジで使う\n})\n\napp.component('my-card', {\n  template: `\n    <div class=\"card\">\n      <header><slot name=\"header\">（見出しなし）</slot></header>\n      <section><slot /></section>\n      <footer><slot name=\"footer\"></slot></footer>\n    </div>`,\n})\napp.mount('#app')"}, steps: [
      Object.assign({"file": "index.html", "label": "見出しの穴（header）に、自分の見出しが入る", "hint": ["名前付きの穴に入れるのは <code>&lt;template #名前&gt;</code>。", "<code>&lt;template #header&gt;はじめての Slot&lt;/template&gt;</code>"], "edits": [["    <!-- ① 見出しの穴に入れる：<template #header>…</template> -->\n", "    <template #header>はじめての Slot</template>\n"]]}, { ok: (R, d) => { const e = d && d.querySelector('header'); const t = e ? e.textContent.trim() : ''; return !!t && t !== '（見出しなし）'; } }),
      Object.assign({"file": "index.html", "label": "本文の穴に、文章が入る", "hint": ["名前のない穴（default）には、そのまま書けばよい。", "<code>&lt;p&gt;ここは本文です。&lt;/p&gt;</code> を <code>&lt;my-card&gt;</code> の中に書く。"], "edits": [["    <!-- ② 本文の穴には、そのまま文章を書く -->\n", "    <p>ここは本文（default）です。</p>\n"]]}, { ok: (R, d) => { const e = d && d.querySelector('section'); return !!e && e.textContent.trim().length > 0; } }),
      Object.assign({"file": "index.html", "label": "フッターの穴（footer）に、文字が入る", "hint": ["header と同じ書き方。名前だけ変える。", "<code>&lt;template #footer&gt;© 研修ナビ&lt;/template&gt;</code>"], "edits": [["    <!-- ③ フッターの穴に入れる：<template #footer>…</template> -->\n", "    <template #footer>© 研修ナビ</template>\n"]]}, { ok: (R, d) => { const e = d && d.querySelector('footer'); return !!e && e.textContent.trim().length > 0; } }),
      Object.assign({"file": "index.html", "label": "フッターに「👍 回数」ボタンを入れる（slot の中でも親のデータが使える）", "hint": ["slot に入れた中身は「親」の持ち物。親の <code>n</code> がそのまま使える（js に n が用意してある）。", "フッターを <code>&lt;button @click=\"n++\"&gt;👍 {{ n }}&lt;/button&gt;</code> にする。"], "edits": [["    <template #footer>© 研修ナビ</template>\n", "    <template #footer>\n      <button @click=\"n++\">👍 {{ n }}</button>\n    </template>\n"]], "optional": true}, { ok: (R) => R.o1 }),
    ], probe: async (win, doc) => {
      const nt = async () => { await win.Vue.nextTick(); await new Promise((r) => setTimeout(r, 40)); };
      const out = {};
      const b = doc.querySelector('footer button');
      if (b) { b.click(); await nt(); b.click(); await nt(); out.o1 = doc.querySelector('footer button') && /2/.test(doc.querySelector('footer button').textContent); }
      return out;
    } });
        },
      },
    ],
  });

  /* ====================================================== x-vue-dynamic */
  style('xv-dyn', `
  .xv-tabs{display:flex;gap:6px;margin-bottom:8px}.xv-tabs button{all:unset;cursor:pointer;padding:.3em 1em;border-radius:10px 10px 0 0;font-weight:800;font-size:.875rem;background:#e8ebf6;color:#556;transition:.2s}
  .xv-tabs button.on{background:#2fd4a4;color:#06101f}
  .xv-dview{min-height:96px;padding:12px;border-radius:0 12px 12px 12px;background:#f5f7fd;border:1px solid #dde;color:#222;display:grid;gap:8px;align-content:start}
  .xv-dview input{font:inherit;padding:.3em .6em;border-radius:8px;border:1px solid #bbc}
  .xv-dview .cnt{font:700 .75rem var(--mono);color:#889}
  .xv-vb{padding:.5em 1.3em;border-radius:8px;border:2px solid transparent;font-weight:800;background:#e5e8f4;color:#334;transition:.3s;font-size:1rem}
  .xv-vb.act{background:var(--bc);color:#06101f;box-shadow:0 8px 18px -8px var(--bc)}.xv-vb.err{border-color:#ff6b7a;animation:shake .4s}
  .xv-vb.sm{font-size:.75rem}.xv-vb.lg{font-size:1.25rem;padding:.7em 1.8em}.xv-vb[disabled]{opacity:.45}
  `);
  reg({
    id: 'x-vue-dynamic', title: '動的コンポーネントと v-bind', sub: ':is / :class / :style / v-bind', emoji: '🔀',
    gh: [gh('99_bonus/DynamicComponents.md', 'vuejs/99_bonus/DynamicComponents.md'), gh('99_bonus/v-bind.md', 'vuejs/99_bonus/v-bind.md'), gh('07_css-binding', 'vuejs/07_css-binding')],
    meta: { cat: 'vue', day: '19日(木)', when: '基礎（:class バインド）の直後。タブ UI を作るとき', mins: 10, order: 32, level: '応用', after: 'vue-basics', why: 'v-if の連打より <component :is> のほうが短く安全。v-bind の全パターンも整理' },
    scenes: [
      {
        t: '<component :is> で切り替え', ref: [{"title": "KeepAlive のメモ", "icon": "book-open", "html": "<table class=\"vref\"><thead><tr><th>書き方</th><th>意味</th></tr></thead><tbody><tr><td><code>&lt;KeepAlive&gt;</code></td><td>切り替えても状態を覚える</td></tr><tr><td><code>include=\"Profile\"</code></td><td>覚える部品を絞る</td></tr><tr><td><code>max=\"3\"</code></td><td>覚える数の上限</td></tr></tbody></table>"}], why: {"pv": {"k": "code", "file": "App.vue", "lang": "html", "text": "<A v-if=\"tab == 1\" />\n<B v-else-if=\"tab == 2\" />\n<C v-else-if=\"tab == 3\" />", "err": [1, 2, 3], "keys": {"2": "is"}}, "iv": {"k": "code", "file": "App.vue", "lang": "ts", "text": "const current = shallowRef(TabA)\n// current を変えれば部品も変わる", "idea": [1], "keys": {"1": "is"}}, "av": {"k": "code", "file": "App.vue", "lang": "html", "text": "<button @click=\"current = TabB\">\n<component :is=\"current\" />", "ok": [2], "keys": {"2": "is"}}, "problem": "タブが増えるたび v-if を書き足す", "idea": "<b>出す部品を変数</b>にする", "answer": "<b>&lt;component :is&gt;</b>", "when": [["同じ場所で切り替えるタブ・ウィザード", "component :is"], ["URL を伴う画面切替", "Router"], ["入力途中を残したい", "KeepAlive"]]}, tag: ':is', lead: 'タブを切り替えて、<b>KeepAlive</b> の ON / OFF を比べよう。プロフィール欄に文字を入れてから切り替えると…？',
        render(el) {
          let cur = 0, keep = false, mounted = 0, unmounted = 0;
          const names = ['Profile', 'Posts', 'Settings'];
          const cache = {};
          const make = (i) => {
            mounted++;
            if (i === 0) return h('div', null, h('label', 'お名前 ', h('input', { placeholder: '入力してみて' })), h('div', { class: 'cnt' }, '← この入力はこの部品の state'));
            if (i === 1) return h('div', null, ['記事 A', '記事 B', '記事 C'].map((t) => h('div', '・' + t)));
            const cb = h('input', { type: 'checkbox' }); return h('div', null, h('label', cb, ' 通知を受け取る'));
          };
          const view = h('div', { class: 'xv-dview' });
          const log = h('div', { class: 'xv-row' });
          const tabs = h('div', { class: 'xv-tabs' }, names.map((n, i) => h('button', { onclick: () => sw(i) }, n)));
          const codeBox = h('div');
          function sw(i) {
            const old = view.firstChild;
            if (old && cur !== undefined) { if (keep) { cache[cur] = old; } else unmounted++; }
            cur = i; view.replaceChildren();
            const node = keep && cache[i] ? cache[i] : make(i);
            view.append(node); draw();
          }
          function draw() {
            tabs.querySelectorAll('button').forEach((b, i) => b.classList.toggle('on', i === cur));
            log.replaceChildren(chip('mounted ×' + mounted), chip('unmounted ×' + unmounted), chip(keep ? '状態は保持される' : '切替で state が消える'));
            codeBox.replaceChildren(code(`<script setup>\nconst current = shallowRef(${names[cur]})\n</script>\n\n<template>\n${keep ? '  <KeepAlive>\n    <component :is="current" />\n  </KeepAlive>' : '  <component :is="current" />'}\n</template>`, 'html', { color: C, file: 'Tabs.vue', hi: keep ? [6, 7, 8] : [6] }));
          }
          const kb = h('button', { class: 'xv-btn', onclick: () => { keep = !keep; kb.classList.toggle('on', keep); kb.textContent = keep ? 'KeepAlive ON' : 'KeepAlive OFF'; mounted = 0; unmounted = 0; Object.keys(cache).forEach((k) => delete cache[k]); sw(cur); } }, 'KeepAlive OFF');
          el.append(sp(pane(h('div', { class: 'xv-row' }, kb), h('div', { class: 'xv-ui', style: { minHeight: '0', padding: '10px' } }, tabs, view), log), pane(codeBox, h('div', { class: 'xv-row' }, chip('用途: タブ'), chip('ウィザード（段階入力）'), chip('ページ切替は Router')))));
          sw(0);
          pickQuiz(el, '使い分けクイズ', [['タブが 10 個に増えそう。表示切替の書き方は？', ['v-if / v-else-if を 10 本', '<code>&lt;component :is&gt;</code> 1 か所', 'どれも同じ'], 1, '部品名を変数にすれば、タブが増えても表示のコードは増えない。'], ['タブを切り替えても、入力途中の文字を残したい。', ['KeepAlive で包む', 'v-show を使うしかない', '不可能'], 0, 'KeepAlive は、入力途中の状態も覚えておく。']]);
        },
      },
      {
        t: 'v-bind をぜんぶ', why: {"pv": {"k": "code", "file": "Btn.vue", "lang": "ts", "text": ":class=\"'btn ' + (a ? 'on' : '')\"\n// スペース・typo でミス", "err": [1, 2], "keys": {"1": "obj"}}, "iv": {"k": "code", "file": "Btn.vue", "lang": "ts", "text": ":class=\"{ on: a, big: b }\"\n// true のキーだけ class に付く", "idea": [1], "keys": {"1": "obj"}}, "av": {"k": "code", "file": "Btn.vue", "lang": "html", "text": "<button :class=\"{ on: isActive }\"\n        :style=\"{ color }\"\n        v-bind=\"attrs\">", "ok": [1, 2, 3], "keys": {"1": "obj"}}, "problem": "class を文字でつなぐとミスしやすい", "idea": "<b>オブジェクト</b>で書く。true だけ付く", "answer": ":class / :style / v-bind", "when": [["条件で付け外し", "オブジェクト構文"], ["固定の見た目", "普通の class"], ["属性をまとめて渡す", "v-bind=\"obj\""]]}, tag: 'v-bind', lead: 'スイッチを動かすと、見た目とコードが同時に変わる。class・style・属性をまとめて渡す <code>v-bind="obj"</code> も試そう。',
        render(el) {
          const S = { active: true, error: false, size: 'md', color: '#2fd4a4', attrs: false };
          const btn = h('button', { class: 'xv-vb' }, '送信');
          const codeBox = h('div');
          const tg = (k, t) => { const b = h('button', { class: 'xv-btn' + (S[k] ? ' on' : ''), onclick: () => { S[k] = !S[k]; b.classList.toggle('on', S[k]); draw(); } }, t); return b; };
          const sizes = ['sm', 'md', 'lg'].map((z) => h('button', { class: 'xv-btn' + (z === 'md' ? ' on' : ''), onclick: () => { S.size = z; sizes.forEach((b) => b.classList.toggle('on', b.textContent === z)); draw(); } }, z));
          const col = h('input', { type: 'color', value: S.color, oninput: (e) => { S.color = e.target.value; draw(); }, style: { width: '44px', height: '30px', border: 0, background: 'none' } });
          function draw() {
            btn.className = 'xv-vb ' + [S.active ? 'act' : '', S.error ? 'err' : '', S.size].join(' ');
            btn.style.setProperty('--bc', S.color);
            if (S.attrs) { btn.disabled = true; btn.title = '送信中…'; } else { btn.disabled = false; btn.removeAttribute('title'); }
            if (S.error) { btn.classList.remove('err'); void btn.offsetWidth; btn.classList.add('err'); }
            codeBox.replaceChildren(code(`<button\n  :class="{\n    'btn-act': isActive,${S.active ? '' : '   // false → 付かない'}\n    'btn-err': hasError,${S.error ? '' : '   // false → 付かない'}\n    [\`btn-\${size}\`]: true,   // → btn-${S.size}\n  }"\n  :style="{ '--bc': color }"   // → ${S.color}\n  ${S.attrs ? 'v-bind="attrs"          // → disabled, title がまとめて付く' : '<!-- v-bind="attrs" を ON にすると… -->'}\n>送信</button>`, 'html', { color: C, file: 'Button.vue' }));
          }
          el.append(sp(pane(h('div', { style: { display: 'grid', placeItems: 'center', minHeight: '90px' } }, btn),
            h('div', { class: 'xv-row' }, tg('active', 'isActive'), tg('error', 'hasError'), tg('attrs', 'v-bind="attrs"')), h('div', { class: 'xv-row' }, 'size', sizes, '色', col)), pane(codeBox)));
          draw();
          el.append(h('div', { class: 'xv-pane', style: { marginTop: '14px' } }, lbl('Vue 3.2+ : <style> の中でも v-bind()'), code('<script setup>\nconst primary = ref(\'#2fd4a4\')\n</script>\n<style scoped>\nbutton { background: v-bind(primary); }\n</style>', 'html', { color: C })));
        },
      },
      {
        t: '実践：タブ切り替え', tag: 'PRACTICE', lead: "<b>&lt;component :is&gt;</b> でタブを作ろう。書くのは基本1行だけ。",
        render(el, ctx) {
          K.vueTools.practice(el, ctx, { title: ":is", starter: {"index.html": "<div id=\"app\">\n  <button v-for=\"(c, name) in tabs\" :key=\"name\" @click=\"current = name\">{{ name }}</button>\n  <hr>\n  <!-- ① ここに <component :is=\"...\"> を書く -->\n</div>", "main.js": "const { createApp, ref } = Vue\n\nconst Home = { template: '<div><h2>Home</h2><input placeholder=\"入力してみて\"></div>' }\nconst About = { template: '<div><h2>About</h2></div>' }\n\ncreateApp({\n  setup() {\n    const tabs = { Home, About }\n    const current = ref('Home')   // 文字列のキーで切り替える\n    return { tabs, current }\n  },\n}).mount('#app')"}, steps: [
      Object.assign({"file": "index.html", "label": "最初に「Home」の画面が出る", "hint": ["表示する部品を切り替えるのは <code>&lt;component :is=\"…\"&gt;</code>。tabs[current] を渡す。", "<code>&lt;component :is=\"tabs[current]\"&gt;&lt;/component&gt;</code>"], "edits": [["  <!-- ① ここに <component :is=\"...\"> を書く -->\n", "  <component :is=\"tabs[current]\"></component>\n"]]}, { ok: (R) => R.m1 }),
      Object.assign({"file": "index.html", "label": "「About」ボタンを押すと「About」に切り替わる", "hint": ["ボタンは current を書き換える。:is が current についていけば OK。", "① が書けていれば、自動で切り替わる。"], "edits": []}, { ok: (R) => R.m2 }),
      Object.assign({"file": "index.html", "label": "「Home」ボタンで「Home」に戻る", "hint": ["About のときと同じ仕組み。", "① が書けていれば、自然に戻れる。"], "edits": []}, { ok: (R) => R.m3 }),
      Object.assign({"file": "index.html", "label": "Home の入力欄に書いた文字が、タブを往復しても消えない（KeepAlive）", "hint": ["切り替えるたびに部品は作り直される。作り直さずに「覚えておく」部品があった。", "<code>&lt;keep-alive&gt;</code> で <code>&lt;component&gt;</code> を包む。"], "edits": [["  <component :is=\"tabs[current]\"></component>\n", "  <keep-alive>\n    <component :is=\"tabs[current]\"></component>\n  </keep-alive>\n"]], "optional": true}, { ok: (R) => R.o1 }),
    ], probe: async (win, doc) => {
      const nt = async () => { await win.Vue.nextTick(); await new Promise((r) => setTimeout(r, 40)); };
      const out = {};
      const h2 = () => (doc.querySelector('h2') ? doc.querySelector('h2').textContent : '');
      const btn = (t) => [...doc.querySelectorAll('button')].find((b) => b.textContent.trim() === t);
      out.m1 = h2().includes('Home');
      if (btn('About')) {
        const inp = doc.querySelector('input');
        if (inp) { inp.value = 'abc'; inp.dispatchEvent(new win.Event('input', { bubbles: true })); }
        btn('About').click(); await nt(); out.m2 = h2().includes('About');
        if (out.m2 && btn('Home')) { btn('Home').click(); await nt(); out.m3 = h2().includes('Home');
          const i2 = doc.querySelector('input'); out.o1 = !!i2 && i2.value === 'abc'; }
      }
      return out;
    } });
        },
      },
    ],
  });

  /* ====================================================== x-vue-composables */
  style('xv-comp', `
  .xv-dup{font:.75rem/1.5 var(--mono);padding:8px 10px;border-radius:6px;background:var(--code);color:#cfd5ff;transition:.5s;overflow:hidden}
  .xv-dup.red{background:#3a1520;outline:2px solid #ff6b7a}
  .xv-dup.gone{max-height:0;padding:0 10px;opacity:0}
  .xv-cmp{border-radius:8px;border:2px solid var(--vue);padding:10px;background:var(--card);display:grid;gap:6px;text-align:center;transition:.4s}
  .xv-cmp b{font:900 1.5rem var(--mono);color:var(--vue)}
  .xv-plug{border-radius:8px;border:2px dashed var(--ts);padding:10px;text-align:center;font:800 .875rem var(--mono);color:var(--ts);background:color-mix(in srgb,var(--ts) 12%,transparent);transition:.5s}
  .xv-pad{height:150px;border-radius:8px;background:repeating-linear-gradient(45deg,var(--card),var(--card) 10px,var(--card2) 10px,var(--card2) 20px);border:2px dashed var(--vue);position:relative;overflow:hidden;cursor:crosshair}
  .xv-pad i{position:absolute;width:14px;height:14px;border-radius:50%;background:var(--vue);transform:translate(-50%,-50%);box-shadow:0 0 18px var(--vue);pointer-events:none}
  .xv-vu{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px}
  .xv-vu button{all:unset;cursor:pointer;padding:.5em .8em;border-radius:8px;background:var(--card);border:1px solid var(--line);font:800 .75rem var(--mono);text-align:center;transition:.2s}
  .xv-vu button:hover{transform:translateY(-3px)}.xv-vu button.on{background:var(--vue);color:#06101f;border-color:var(--vue)}
  `);
  reg({
    id: 'x-vue-composables', title: 'Composables と VueUse', sub: 'ロジックを部品から切り出す', emoji: '🧰',
    gh: [gh('99_bonus/Composables.md', 'vuejs/99_bonus/Composables.md'), gh('99_bonus/VueUse.md', 'vuejs/99_bonus/VueUse.md'), gh('99_bonus/Async.md', 'vuejs/99_bonus/Async.md')],
    meta: { cat: 'vue', day: '24日(火)', when: 'Computed / Watcher の後、チーム開発の前', mins: 15, order: 33, level: '応用', after: 'vue-life', why: '同じロジックのコピペをやめる。実務の Vue ではよく使う' },
    scenes: [
      {
        t: 'コピペをやめよう', ref: [{"title": "composable のルール", "icon": "book-open", "html": "<table class=\"vref\"><thead><tr><th>ルール</th><th>例</th></tr></thead><tbody><tr><td>名前は use で始める</td><td><code>useCounter</code></td></tr><tr><td>ref を返す</td><td>状態も一緒に共有できる</td></tr><tr><td>後片付けは onUnmounted</td><td>タイマー・リスナー</td></tr></tbody></table>"}], why: {"pv": {"k": "code", "file": "3つの部品", "lang": "ts", "text": "// A.vue  const count = ref(0) …\n// B.vue  const count = ref(0) …\n// C.vue  const count = ref(0) …", "err": [1, 2, 3], "keys": {"2": "use"}}, "iv": {"k": "code", "file": "useCounter.ts", "lang": "ts", "text": "export function useCounter() {\n  const count = ref(0)\n  const inc = () => count.value++\n  return { count, inc }\n}", "idea": [1, 4], "keys": {"1": "use"}}, "av": {"k": "code", "file": "A.vue / B.vue / C.vue", "lang": "ts", "text": "// どの部品でも1行\nconst { count, inc } = useCounter()", "ok": [2], "keys": {"2": "use"}}, "problem": "同じ処理を3部品にコピペ", "idea": "<b>ロジックだけ</b>を関数に切り出す", "answer": "<b>composable</b>（useXxx）", "when": [["状態 + ロジックを共有", "composable"], ["見た目も含めて共有", "コンポーネント"], ["状態を持たない計算", "普通の関数"]]}, tag: 'composable', lead: '3つの部品に、同じコードがある…。「次へ」で、1か所にまとめて<b>差し込む</b>流れを見よう。',
        render(el) {
          let step = 0;
          const logic = 'const count = ref(0)\nconst inc = () => count.value++';
          const cmps = ['ProductCard', 'CartItem', 'LikeButton'].map((n, i) => {
            const cnt = h('b', '0'); let c = 0;
            const dup = h('div', { class: 'xv-dup' }, logic);
            const use = h('div', { class: 'xv-dup gone' }, 'const { count, inc } = useCounter()');
            const btn = h('button', { class: 'xv-btn', onclick: () => { c++; cnt.textContent = c; flash(cnt.parentElement.querySelector('b')); } }, '+1');
            return { box: h('div', { class: 'xv-cmp' }, h('small', { style: { fontFamily: 'var(--mono)', color: 'var(--mute)' } }, n), cnt, btn, dup, use), dup, use, reset: () => { c = 0; cnt.textContent = 0; } };
          });
          const plug = h('div', { class: 'xv-plug', style: { opacity: .15, transform: 'scale(.9)' } }, 'composables/useCounter.ts', h('pre', { class: 'code', style: { textAlign: 'left', marginTop: '8px', fontSize: '.75rem', padding: '8px 12px' } }, 'export function useCounter() {\n  const count = ref(0)\n  const inc = () => count.value++\n  return { count, inc }\n}'));
          const row = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '10px' } }, cmps.map((c) => c.box));
          const steps = [
            { say: '3つの部品が、<b>それぞれ同じロジック</b>を書いている。' },
            { say: '同じコードが3つ…。直すときは <b>3か所</b>。バグの温床。' },
            { say: '同じ部分を <b>useCounter()</b> という関数にまとめる。名前は <b>use</b> で始めるのが決まり。' },
            { say: '各部品は <b>1行で呼ぶだけ</b>。状態は部品ごとに独立（+1 を押してみて！）。' },
          ];
          el.append(stepper({
            color: C, steps,
            init(vis) { vis.append(h('div', { style: { display: 'grid', gap: '14px' } }, plug, row)); },
            update(n) {
              plug.style.opacity = n >= 2 ? 1 : .15; plug.style.transform = n >= 2 ? 'none' : 'scale(.9)';
              cmps.forEach((c) => { c.dup.classList.toggle('red', n === 1); c.dup.classList.toggle('gone', n >= 3); c.use.classList.toggle('gone', n < 3); if (n < 3) c.reset(); });
            },
          }));
        },
      },
      {
        t: 'useMouse とクリーンアップ', why: {"pv": {"k": "code", "file": "useMouse.ts", "lang": "ts", "text": "window.addEventListener('move', f)\n// 部品を消しても…\n// f は動き続ける（メモリ漏れ）", "err": [1, 3], "keys": {"1": "clean"}}, "iv": {"k": "code", "file": "useMouse.ts", "lang": "ts", "text": "onMounted(() => {\n  window.addEventListener(…)\n})\nonUnmounted(() => {\n  window.removeEventListener(…)\n})", "idea": [4, 5, 6], "keys": {"5": "clean"}}, "av": {"k": "code", "file": "useMouse.ts", "lang": "ts", "text": "onUnmounted(() => {\n  window.removeEventListener(…)\n})\n// 始めた人が片付ける", "ok": [1, 2, 3], "keys": {"2": "clean"}}, "problem": "消し忘れで動き続ける", "idea": "<b>始めた人が片付ける</b>", "answer": "<b>onUnmounted</b> で解除", "when": [["addEventListener・タイマー", "必ず onUnmounted で解除"], ["ref の変化だけ", "自動で片付く"]]}, tag: 'onUnmounted', lead: '同じ composable を何か所で使っても、それぞれ別々に動く。部品を消すとき、<b>onUnmounted</b> で片付けないと…？',
        render(el, ctx) {
          let leak = false, listeners = 0, leaked = 0, uid = 0;
          const pad = h('div', { class: 'xv-pad' }, h('i', { style: { left: '50%', top: '50%' } }));
          const dot = pad.firstChild;
          const subs = new Set();
          pad.addEventListener('mousemove', (e) => { const r = pad.getBoundingClientRect(); const x = Math.round(e.clientX - r.left), y = Math.round(e.clientY - r.top); dot.style.left = x + 'px'; dot.style.top = y + 'px'; subs.forEach((f) => f(x, y)); });
          const list = h('div', { class: 'xv-row' });
          const status = h('div', { class: 'xv-row' });
          const comps = [];
          function add() {
            const id = ++uid; const out = h('b', { style: { fontFamily: 'var(--mono)' } }, 'x:0 y:0');
            const f = (x, y) => { out.textContent = `x:${x} y:${y}`; };
            subs.add(f); listeners++;
            const box = h('div', { class: 'xv-chip', style: { '--c': 'var(--vue)', animation: 'pop .4s both' } }, 'Comp' + id, ' ', out);
            comps.push({ id, f, box }); list.append(box); draw();
          }
          function rem() {
            const c = comps.pop(); if (!c) return;
            c.box.remove();
            if (leak) { leaked++; c.box.classList.add('x'); }
            else { subs.delete(c.f); listeners--; }
            draw();
          }
          function draw() {
            status.replaceChildren(chip('リスナー: ' + listeners), h('span', { class: 'xv-chip', style: { background: leaked ? '#ff6b7a' : '', color: leaked ? '#06101f' : '' } }, leaked ? 'リーク: ' + leaked + ' ⚠' : 'リーク: 0'));
            cd.replaceChildren(code(`export function useMouse() {\n  const x = ref(0), y = ref(0)\n  const move = (e) => { x.value = e.pageX; y.value = e.pageY }\n  onMounted(() => addEventListener('mousemove', move))\n${leak ? '  // onUnmounted を書き忘れた！' : '  onUnmounted(() => removeEventListener(\'mousemove\', move))'}\n  return { x, y }\n}`, 'ts', { color: leak ? '#ff6b7a' : C, file: 'useMouse.ts', hi: leak ? [5] : [4, 5] }));
          }
          const cd = h('div');
          const lb = h('button', { class: 'xv-btn', onclick: () => { leak = !leak; lb.classList.toggle('on', leak); lb.textContent = leak ? 'onUnmounted を忘れる: ON' : 'onUnmounted を忘れる: OFF'; draw(); } }, 'onUnmounted を忘れる: OFF');
          el.append(sp(pane(pad, h('div', { class: 'xv-row' }, h('button', { class: 'xv-btn big', onclick: add }, '＋ 部品を追加'), h('button', { class: 'xv-btn', onclick: rem }, '－ 部品を削除'), lb), list, status), pane(cd, h('small', { style: { color: 'var(--mute)' } }, 'パッドの上でマウスを動かしてみよう。追加した部品の数だけ座標が同時に更新されます。'))));
          add(); add();
          return () => subs.clear();
        },
      },
      {
        t: 'VueUse ツアー', why: {"pv": {"k": "code", "file": "Copy.vue", "lang": "ts", "text": "// コピー機能を自作…\nnavigator.clipboard.writeText(t)\n// 失敗時・非対応・状態も自作?", "err": [3], "keys": {"1": "vu"}}, "iv": {"k": "code", "file": "手順", "lang": "ts", "text": "// 1. まず vueuse.org で探す\n// 2. あれば import するだけ", "idea": [1, 2], "keys": {"1": "vu"}}, "av": {"k": "code", "file": "Copy.vue", "lang": "ts", "text": "import { useClipboard }\n  from '@vueuse/core'\nconst { copy } = useClipboard()", "ok": [1, 2, 3], "keys": {"3": "vu"}}, "problem": "よくある処理を毎回自作してバグる", "idea": "まず<b>出来合いの部品</b>を探す", "answer": "<b>VueUse</b>（200+ の composable）", "when": [["よくある機能", "まず VueUse を探す"], ["自社固有のロジック", "自作 composable"]]}, tag: 'VueUse', lead: '自分で書く前に、<b>VueUse</b>（出来合いの composable が 200 以上）を探そう。カードを選んで試す。',
        render(el, ctx) {
          const demos = {
            useWindowSize: { code: "const { width, height } = useWindowSize()", mk() { const o = h('b', { style: { fontSize: '1.5rem', fontFamily: 'var(--mono)' } }); const f = () => (o.textContent = innerWidth + ' × ' + innerHeight); addEventListener('resize', f); f(); ctx.cleanups.push(() => removeEventListener('resize', f)); return [h('div', 'ウィンドウサイズ（リサイズしてみて）'), o]; } },
            useLocalStorage: { code: "const name = useLocalStorage('user-name', '名無し')", mk() { let v = '名無し'; try { v = localStorage.getItem('xv.name') || v; } catch {} const i = h('input', { value: v, oninput: (e) => { try { localStorage.setItem('xv.name', e.target.value); } catch {} }, style: { padding: '.4em .8em', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--bg2)', color: 'var(--text)', font: 'inherit' } }); return [h('div', '入力してリロード → 残る！'), i]; } },
            useDebounceFn: { code: "const run = useDebounceFn(search, 500)", mk() { let calls = 0, runs = 0, t; const o = h('div', { class: 'xv-row' }, chip('入力 0 回'), chip('実行 0 回')); const i = h('input', { placeholder: '素早く打ってみて', oninput: () => { calls++; clearTimeout(t); t = setTimeout(() => { runs++; paint(); flash(o.lastChild); }, 500); paint(); }, style: { padding: '.4em .8em', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--bg2)', color: 'var(--text)', font: 'inherit' } }); const paint = () => { o.firstChild.textContent = '入力 ' + calls + ' 回'; o.lastChild.textContent = '実行 ' + runs + ' 回'; }; return [i, o, h('small', { style: { color: 'var(--mute)' } }, '打ち終わって 0.5 秒後に1回だけ実行')]; } },
            useClipboard: { code: "const { copy, copied } = useClipboard()", mk() { const m = h('b', 'コピーはまだ'); const b = h('button', { class: 'xv-btn big', onclick: async () => { try { await navigator.clipboard.writeText('npm i @vueuse/core'); m.textContent = '✔ copied!'; } catch { m.textContent = '✔ copied!（デモ）'; } flash(m); } }, 'npm i @vueuse/core をコピー'); return [b, m]; } },
          };
          const keys = Object.keys(demos);
          const grid = h('div', { class: 'xv-vu' });
          const stage = h('div', { style: { display: 'grid', gap: '10px', alignContent: 'center', minHeight: '110px' } });
          const cd = h('div');
          keys.forEach((k, i) => grid.append(h('button', { onclick: () => show(k) }, k)));
          function show(k) {
            grid.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.textContent === k));
            stage.replaceChildren(...demos[k].mk());
            cd.replaceChildren(code(`import { ${k} } from '@vueuse/core'\n\n${demos[k].code}`, 'ts', { color: C }));
          }
          el.append(sp(pane(lbl('よく使う composable'), grid, stage), pane(cd, h('div', { class: 'xv-row' }, chip('npm i @vueuse/core'), chip('Tree-shaking 対応'), chip('TypeScript 完全対応')))));
          show(keys[0]);
          pickQuiz(el, '使い分けクイズ：どこに書く？', [['3つの部品で<b>状態 + ロジック</b>（カウンター）を共有したい。', ['composable（useCounter）', 'コンポーネント', '普通の関数'], 0, '状態（ref）を持つロジックは composable。'], ['見た目も含めて使い回したい（ボタン部品）。', ['composable', 'コンポーネント', 'VueUse'], 1, '見た目（テンプレート）があるならコンポーネント。'], ['税込金額を計算するだけ（状態なし）。', ['composable', 'コンポーネント', '普通の関数（utils）'], 2, '状態がない計算は、ふつうの関数で十分。']]);
        },
      },
    ],
  });

  /* ====================================================== x-vue-state */
  style('xv-state', `
  .xv-tree{position:relative;height:320px}
  .xv-tree svg{position:absolute;inset:0;width:100%;height:100%}
  .xv-tree svg line{stroke:rgba(255,255,255,.18);stroke-width:.5}
  .xv-tree svg path{fill:none;stroke:var(--lc,var(--vue));stroke-width:.9;stroke-dasharray:2 1.6;opacity:.9}
  `);
  reg({
    id: 'x-vue-state', title: '部品どうしの通信', sub: 'props/emit · Event Bus · 共有ステート', emoji: '📦',
    gh: [gh('99_bonus/EventBus.md', 'vuejs/99_bonus/EventBus.md'), gh('03_props', 'vuejs/03_props'), gh('04_model', 'vuejs/04_model')],
    meta: { cat: 'vue', day: '24日(火)', when: 'コンポーネント復習の後 / チーム開発前の設計相談で', mins: 10, order: 34, level: '応用', after: 'vue-comp', why: 'props を何段も渡さずに済む方法を知る' },
    scenes: [
      {
        t: '誰が誰に話しかける？', ref: [{"title": "Pinia の最小コード", "icon": "database", "html": "<pre class=\"code\" style=\"margin:0\">export const useCart = defineStore('cart', () => {\n  const count = ref(0)\n  const add = () => count.value++\n  return { count, add }\n})</pre>"}], why: {"pv": {"k": "code", "file": "Card.vue", "lang": "html", "text": "<Header :badge=\"n\" />\n  <!-- props を何段も中継… -->\n<Card @add=\"$emit('add')\" />", "err": [2, 3], "keys": {"1": "store"}}, "iv": {"k": "code", "file": "stores/cart.ts", "lang": "ts", "text": "export const useCart =\n  defineStore('cart', () => {\n    const n = ref(0)\n    return { n }\n  })", "idea": [3, 4], "keys": {"3": "store"}}, "av": {"k": "code", "file": "Header / Card", "lang": "ts", "text": "const cart = useCart()  // Header\ncart.n++                // Card", "ok": [1, 2], "keys": {"1": "store"}}, "problem": "離れた部品で状態をどう共有する？", "idea": "<b>共通の置き場</b>を1つ作る", "answer": "props/emit・Bus・<b>共有ステート</b>", "when": [["親子の近い関係", "props / emit"], ["離れた部品が同じ状態を読む", "共有ステート（Pinia）"], ["一回きりの通知", "Event Bus（off を忘れずに）"]]}, tag: 'pattern', lead: '「カードの<b>カート追加</b> → ヘッダーのバッジ +1」。方式を選んで ▶ を押すと、データの通り道が変わる。',
        render(el, ctx) {
          const N = { App: [50, 9, 'var(--ts)'], Header: [16, 34, 'var(--pink)'], Main: [72, 34, 'var(--ts)'], List: [60, 58, 'var(--ts)'], Cart: [90, 58, 'var(--ts)'], Card: [60, 86, 'var(--vue)'], Hub: [28, 66, 'var(--team)'] };
          const P = {
            props: { label: 'props / emit', path: ['Card', 'List', 'Main', 'App', 'Header'], hub: null, tags: ['4回の受け渡し', 'つながり: 強い', '追いやすい'], tips: ['親子の道のりを全部通る（バケツリレー）', 'emit ×3 → props ×1。中継する部品も修正が必要'], lc: 'var(--ts)' },
            bus: { label: 'Event Bus (mitt)', path: ['Card', 'Hub', 'Header'], hub: 'Event Bus', tags: ['2回', 'つながり: 弱い', 'たどりにくい'], tips: ['emit("cart:add") → bus → on("cart:add")', 'onUnmounted で off() を忘れずに'], lc: 'var(--team)' },
            store: { label: '共有ステート (Pinia)', path: ['Card', 'Hub', 'Header'], hub: 'Store (Pinia)', tags: ['2回', 'つながり: 弱い', 'DevToolsで追える'], tips: ['Card: store.add() で書く / Header: store.count を読む', '「状態」を共有するならこれが基本'], lc: '#2fd4a4' },
          };
          let pat = 'props', running = false, n = 0, alive = true;
          const stage = h('div', { class: 'xv-stage xv-tree' });
          const svg = h('div');
          const els = {};
          Object.entries(N).forEach(([k, [x, y, c]]) => { const e = h('div', { class: 'xv-node', style: { left: x + '%', top: y + '%', '--nc': c } }, k); els[k] = e; stage.append(e); });
          const badge = h('span', { class: 'xv-chip', style: { marginLeft: '6px' } }, 'cart 0');
          els.Header.append(badge);
          const pkt = h('div', { class: 'xv-pkt', style: { opacity: 0, '--pc': 'var(--vue)' } }, '');
          stage.append(pkt);
          const info = h('div', { class: 'st-cap' });
          const tags = h('div', { class: 'xv-row' });
          const cd = h('div');
          const codes = {
            props: '// Card\nemit(\'add\', item)\n// List / Main … 中継して emit\n// App → <Header :count="count" />',
            bus: '// Card\nbus.emit(\'cart:add\', item)\n// Header\nbus.on(\'cart:add\', () => count.value++)\nonUnmounted(() => bus.off(...))',
            store: '// stores/cart.ts\nexport const useCart = defineStore(\'cart\', () => {\n  const count = ref(0)\n  const add = () => count.value++\n  return { count, add }\n})\n// Card: cart.add()   Header: cart.count',
          };
          function draw() {
            const p = P[pat];
            Object.entries(els).forEach(([k, e]) => { if (k === 'Hub') { e.style.display = p.hub ? '' : 'none'; e.firstChild.textContent = p.hub || ''; e.style.setProperty('--nc', pat === 'bus' ? 'var(--team)' : '#2fd4a4'); } });
            const pts = p.path.map((k) => N[k].slice(0, 2));
            const lines = Object.entries({ App: ['Header', 'Main'], Main: ['List', 'Cart'], List: ['Card'] }).flatMap(([a, bs]) => bs.map((b) => `<line x1="${N[a][0]}" y1="${N[a][1]}" x2="${N[b][0]}" y2="${N[b][1]}"/>`)).join('');
            svg.innerHTML = `<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%">${lines}<path d="M ${pts.map((q) => q.join(' ')).join(' L ')}" style="--lc:${p.lc}"/></svg>`;
            tags.replaceChildren(...p.tags.map(chip));
            info.innerHTML = p.tips.map((t) => '・' + t).join('<br>');
            cd.replaceChildren(code(codes[pat], 'ts', { color: p.lc }));
            if (!stage.contains(svg.firstChild)) stage.prepend(svg.firstChild); else stage.replaceChild(svg.firstChild, stage.querySelector('svg'));
          }
          async function play() {
            if (running) return; running = true; go.disabled = true;
            const p = P[pat]; pkt.style.opacity = 1; pkt.style.setProperty('--pc', p.lc === 'var(--ts)' ? 'var(--vue)' : p.lc);
            let from = p.path[0]; pkt.style.transition = 'none'; pkt.style.left = N[from][0] + '%'; pkt.style.top = N[from][1] + '%'; void pkt.offsetWidth; pkt.style.transition = '';
            for (let i = 0; i < p.path.length; i++) {
              const k = p.path[i]; pkt.style.left = N[k][0] + '%'; pkt.style.top = N[k][1] + '%';
              pkt.textContent = pat === 'props' ? (i === p.path.length - 1 ? 'props:count' : 'emit:add') : pat === 'bus' ? (i === 1 ? 'cart:add' : 'add') : (i === 1 ? 'state' : 'add');
              await sleep(620); if (!alive) return;
              els[k].classList.add('hit'); setTimeout(() => els[k].classList.remove('hit'), 500);
            }
            n++; badge.textContent = 'cart ' + n; flash(badge);
            await sleep(500); pkt.style.opacity = 0; running = false; go.disabled = false;
          }
          const go = h('button', { class: 'xv-btn big', onclick: play }, '▶ 「カートに入れる」');
          const sel = Object.entries(P).map(([k, v]) => h('button', { class: 'xv-btn' + (k === 'props' ? ' on' : ''), onclick: () => { if (running) return; pat = k; n = 0; badge.textContent = 'cart 0'; sel.forEach((b, i) => b.classList.toggle('on', Object.keys(P)[i] === k)); draw(); } }, v.label));
          el.append(h('div', { class: 'xv-row', style: { marginBottom: '10px' } }, sel, go));
          el.append(sp(pane(stage, tags), pane(info, cd)));
          draw();
          return () => { alive = false; };
        },
      },
      {
        t: '使い分けクイズ', why: {"pv": {"k": "code", "file": "どれ？", "lang": "ts", "text": "// 状態? 通知? 近い? 遠い?\n// props / Bus / Pinia …\n// 現場でどれを選ぶ？", "err": [3], "keys": {"2": "pick"}}, "iv": {"k": "code", "file": "選び方", "lang": "ts", "text": "親子で近い     → props / emit\n離れて読む     → Pinia\n離れて一回通知 → Event Bus", "idea": [1, 2, 3], "keys": {"2": "pick"}}, "av": {"k": "code", "file": "例", "lang": "ts", "text": "const cart = useCart()\n<Child :title=\"t\" @add=\"onAdd\" />\nbus.emit('saved')", "ok": [1, 2, 3], "keys": {"1": "pick"}}, "problem": "違いは分かった。現場で選べる？", "idea": "<b>近さ・読む人数・通知か状態か</b>", "answer": "迷ったら props/emit → 増えたら共有", "when": [["親子 1 回", "props"], ["多くの画面が読む状態", "共有ステート"], ["離れた一回きりの通知", "Event Bus"]]}, lead: '場面に合う方式を選ぼう。',
        render(el) {
          el.append(h('div', { class: 'card', style: { display: 'grid', gap: '18px' } },
            quiz({ q: '親 → 子 に1回だけ値を渡す。いちばん素直なのは？', options: ['props', 'Event Bus', 'Pinia'], answer: 0, why: '親子の関係なら props / emit が基本。' }),
            quiz({ q: 'ログイン中ユーザー情報を、10個の画面・部品が読む。', options: ['props のバケツリレー', 'Event Bus', '共有ステート (Pinia)'], answer: 2, why: 'みんなが読むデータはストアに置く。DevTools でも追える。' }),
            quiz({ q: '「通知を出して」を離れた部品に1回だけ伝えたい（状態は持たない）。', options: ['props', 'Event Bus (mitt)', 'v-model'], answer: 1, why: '1回きりの通知なら Bus も使える。off() を忘れずに。' })));
        },
      },
    ],
  });

  /* ====================================================== x-vue-render */
  style('xv-render', `
  .xv-tl{position:relative;border-radius:8px;background:var(--code);border:1px solid var(--line);padding:8px 10px 8px 78px;overflow:hidden}
  .xv-lane{position:relative;height:50px;margin-right:6px;border-bottom:1px dashed rgba(255,255,255,.1)}.xv-lane:last-of-type{border-bottom:0}
  .xv-lane>span.ln{position:absolute;left:-70px;top:14px;width:64px;font:800 .68rem var(--mono);color:#8e97c4;text-align:right}
  .xv-ev{position:absolute;transform:translateX(-4px);padding:.1em .6em;border-radius:8px;font:700 .68rem var(--mono);background:var(--ec);color:#06101f;white-space:nowrap;opacity:0;scale:.6;transition:.35s}
  .xv-ev.show{opacity:1;scale:1}
  .xv-now{position:absolute;top:0;bottom:0;width:2px;background:var(--pink);left:78px;box-shadow:0 0 10px var(--pink);z-index:3}
  .xv-scr{border-radius:8px;background:#fff;border:1px solid var(--line);min-height:150px;padding:10px;color:#222;position:relative;overflow:hidden}
  .xv-scr .bar{height:12px;border-radius:6px;background:#e3e6f2;margin:8px 0;transition:.5s}
  .xv-scr.blank .bar{opacity:0}.xv-scr.content .bar{background:linear-gradient(90deg,#5b9dff,#2fd4a4)}
  .xv-scr .lbl{position:absolute;right:8px;top:6px;font:800 .66rem var(--mono);color:#889}
  .xv-scr h4{font-size:1rem;transition:.4s}.xv-scr.blank h4{opacity:.1}
  `);
  const MODES = {
    SPA: { desc: '空の HTML + JS を受け取り、ブラウザが API を呼んで描画', col: '#5b9dff', ev: [[0, 0, 'GET /'], [90, 1, '空のHTML + JS'], [260, 0, 'JS実行'], [330, 0, 'GET /api'], [420, 2, 'DB…'], [640, 2, 'JSON'], [760, 0, '描画']], scr: [[0, 'blank'], [760, 'content']], fcp: 760, tti: 760, seo: '△ 空HTML', fresh: '常に最新' },
    SSR: { desc: 'リクエストのたびにサーバーが HTML を作って返す', col: '#ffb454', ev: [[0, 0, 'GET /'], [60, 2, 'API+HTML生成…'], [440, 2, '完成HTML'], [520, 0, '表示'], [820, 0, 'hydrate']], scr: [[0, 'blank'], [520, 'content']], fcp: 520, tti: 820, seo: '◎ 中身入り', fresh: '常に最新' },
    SSG: { desc: 'ビルド時に HTML を作り置き。CDN が即返す', col: '#4ade80', ev: [[0, 0, 'GET /'], [60, 1, 'HTML(作り置き)'], [140, 0, '表示'], [420, 0, 'hydrate']], scr: [[0, 'blank'], [140, 'content']], fcp: 140, tti: 420, seo: '◎ 中身入り', fresh: 'ビルド時点' },
    ISR: { desc: 'SSG + 一定時間ごとに裏で再生成して差し替え', col: '#a98bff', ev: [[0, 0, 'GET /'], [60, 1, 'HTML(キャッシュ)'], [140, 0, '表示'], [420, 0, 'hydrate'], [560, 2, '裏で再生成'], [820, 1, '新HTMLに更新']], scr: [[0, 'blank'], [140, 'content']], fcp: 140, tti: 420, seo: '◎ 中身入り', fresh: '設定した時間ぶん遅れる' },
  };
  reg({
    id: 'x-vue-render', title: 'SPA / SSR / SSG / ISR と Nuxt', sub: '描画のタイミングを選ぶ', emoji: '🚀',
    gh: [gh('99_bonus/SPA・SSR・SSG・ISR.md', 'vuejs/99_bonus/SPA・SSR・SSG・ISR.md'), gh('99_bonus/Nuxt.md', 'vuejs/99_bonus/Nuxt.md')],
    meta: { cat: 'vue', day: '25日(水)', when: '開発の合間 / 発表前の「次に学ぶこと」として', mins: 15, order: 35, level: '応用', after: 'vue-router', why: '今回作る SPA の「次のステップ」。Nuxt が何を助けてくれるか分かる' },
    scenes: [
      {
        t: '誰がいつ HTML を作る？', ref: [{"title": "4方式の比較表", "icon": "table", "html": "<table class=\"vref\"><thead><tr><th></th><th>SPA</th><th>SSR</th><th>SSG</th><th>ISR</th></tr></thead><tbody><tr><td>HTML を作る人</td><td>ブラウザ</td><td>サーバー</td><td>ビルド時</td><td>ビルド時 + 裏で作り直し</td></tr><tr><td>検索（SEO）</td><td>△</td><td>◎</td><td>◎</td><td>◎</td></tr><tr><td>内容の新しさ</td><td>最新</td><td>最新</td><td>ビルド時点</td><td>少し遅れる</td></tr></tbody></table>"}], why: {"pv": {"k": "code", "file": "SPA の HTML", "lang": "html", "text": "<!-- 最初に届く HTML -->\n<div id=\"app\"></div>\n<!-- 中身は空 → 検索に見えない -->", "err": [2, 3], "keys": {"2": "html"}}, "iv": {"k": "code", "file": "方式", "lang": "ts", "text": "SPA : ブラウザが作る\nSSR : サーバーが毎回作る\nSSG : ビルド時に作っておく", "idea": [1, 2, 3], "keys": {"2": "html"}}, "av": {"k": "code", "file": "SSR の HTML", "lang": "html", "text": "<div id=\"app\">\n  <h1>商品一覧</h1> …", "ok": [1, 2], "keys": {"1": "html"}}, "problem": "SPA は最初が空で検索に弱い", "idea": "<b>誰が・いつ</b> HTML を作るか選ぶ", "answer": "<b>SPA / SSR / SSG / ISR</b>", "when": [["ログイン後の管理画面", "SPA"], ["毎回内容が変わる + SEO", "SSR"], ["ほぼ更新しない + 速さ", "SSG"], ["更新はあるが速さも欲しい", "ISR"]]}, tag: 'rendering', lead: '方式を選んで ▶ を押そう。ブラウザ・CDN・サーバーのやりとりと、<b>画面がいつ見えるか</b>を比べる。',
        render(el, ctx) {
          let mode = 'SPA', raf = 0, t0 = 0, playing = false;
          const T = 1000, DUR = 4200, LANES = ['ブラウザ', 'CDN', 'サーバー'];
          const tl = h('div', { class: 'xv-tl' });
          const lanes = LANES.map((n) => { const l = h('div', { class: 'xv-lane' }, h('span', { class: 'ln' }, n)); tl.append(l); return l; });
          const now = h('div', { class: 'xv-now' }); tl.append(now);
          const scr = h('div', { class: 'xv-scr blank' }, h('div', { class: 'lbl' }, '画面'), h('h4', 'おすすめ記事'), h('div', { class: 'bar', style: { width: '90%' } }), h('div', { class: 'bar', style: { width: '70%' } }), h('div', { class: 'bar', style: { width: '80%' } }));
          const met = h('div', { class: 'xv-row' });
          const desc = h('div', { class: 'st-cap' });
          let evEls = [];
          const tabs = Object.keys(MODES).map((k) => h('button', { class: 'xv-btn' + (k === mode ? ' on' : ''), style: { '--c': MODES[k].col }, onclick: () => { mode = k; tabs.forEach((b) => b.classList.toggle('on', b.textContent === k)); build(); } }, k));
          function build() {
            cancelAnimationFrame(raf); playing = false;
            const m = MODES[mode];
            evEls.forEach((e) => e.remove()); evEls = [];
            m.ev.forEach(([t, ln, lb], i) => { const e = h('div', { class: 'xv-ev', style: { left: (t / T * 100) + '%', top: (i % 2 ? 26 : 4) + 'px', '--ec': m.col, translate: t > 700 ? '-100% 0' : '0 0' } }, lb); lanes[ln].append(e); evEls.push(e); });
            now.style.left = '78px'; scr.className = 'xv-scr blank'; scr.querySelector('.lbl').textContent = '画面：まだ真っ白';
            desc.innerHTML = '<b>' + mode + '</b>：' + m.desc;
            met.replaceChildren(chip('初回表示 —'), chip('操作可能 —'), chip('SEO ' + m.seo), chip('鮮度: ' + m.fresh));
          }
          function tick(ts) {
            if (!t0) t0 = ts; const k = Math.min(1, (ts - t0) / DUR), t = k * T, m = MODES[mode];
            const w = tl.clientWidth - 88; now.style.left = 78 + k * w + 'px';
            m.ev.forEach(([et], i) => evEls[i].classList.toggle('show', et <= t));
            let st = 'blank'; m.scr.forEach(([st_t, s]) => { if (t >= st_t) st = s; });
            scr.className = 'xv-scr ' + st; scr.querySelector('.lbl').textContent = st === 'blank' ? '画面：まだ真っ白' : t >= m.tti ? '画面：操作できる ✔' : '画面：見える（まだ操作不可）';
            met.children[0].textContent = '初回表示 ' + (t >= m.fcp ? m.fcp + 'ms' : '—'); met.children[1].textContent = '操作可能 ' + (t >= m.tti ? m.tti + 'ms' : '—');
            if (k < 1) raf = requestAnimationFrame(tick); else { playing = false; go.disabled = false; flash(met.children[0]); }
          }
          const go = h('button', { class: 'xv-btn big', onclick: () => { build(); go.disabled = true; playing = true; t0 = 0; raf = requestAnimationFrame(tick); } }, '▶ アクセスしてみる');
          el.append(h('div', { class: 'xv-row', style: { marginBottom: '10px' } }, tabs, go));
          el.append(pane(tl, desc), h('div', { style: { height: '14px' } }), sp(pane(scr), pane(met)));
          build();
          return () => cancelAnimationFrame(raf);
        },
      },
      {
        t: 'Nuxt が自動でやること', ref: [{"title": "主なフォルダ", "icon": "folder-tree", "html": "<table class=\"vref\"><thead><tr><th>場所</th><th>役割</th></tr></thead><tbody><tr><td><code>pages/</code></td><td>ファイル = URL</td></tr><tr><td><code>components/</code></td><td>自動で読み込み</td></tr><tr><td><code>server/api/</code></td><td>自分の API</td></tr><tr><td><code>nuxt.config.ts</code></td><td>設定</td></tr></tbody></table>"}], why: {"pv": {"k": "code", "file": "router.ts", "lang": "ts", "text": "// 1ページごとに登録…\n{ path: '/about', component: … }\n// SSR もデータ取得も自前", "err": [1, 2, 3], "keys": {"2": "file"}}, "iv": {"k": "code", "file": "Nuxt", "lang": "sh", "text": "pages/\n├─ index.vue   → /\n└─ about.vue   → /about", "idea": [3], "keys": {"3": "file"}}, "av": {"k": "code", "file": "Nuxt", "lang": "sh", "text": "pages/about.vue  →  /about\n# routeRules で方式を選ぶ", "ok": [1], "keys": {"1": "file"}}, "problem": "SSR・ルーティングを全部自作は大変", "idea": "<b>ファイルを置くだけ</b>で URL ができる", "answer": "<b>Nuxt</b>（ファイル = URL）", "when": [["SEO・初回の速さが重要", "Nuxt"], ["社内ツール・管理画面", "Vite + Vue（SPA）で十分"]]}, tag: 'Nuxt', lead: '<b>Nuxt</b> は Vue に、ページ移動・SSR/SSG・データ取得を全部足したもの。ファイルを選ぶと URL が決まり、ページごとに方式も選べる。',
        render(el) {
          const files = [['pages/index.vue', '/'], ['pages/about.vue', '/about'], ['pages/posts/[id].vue', '/posts/:id']];
          const modes = ['/', '/about', '/posts/:id'].map(() => 'ssr');
          const rules = { ssr: 'ssr: true', ssg: 'prerender: true', isr: 'isr: 60', spa: 'ssr: false' };
          const names = { ssr: 'SSR', ssg: 'SSG', isr: 'ISR', spa: 'SPA' };
          let sel = 0;
          const url = h('div', { class: 'xv-chip', style: { fontSize: '1rem' } });
          const fl = files.map(([f], i) => h('button', { class: 'xv-btn', style: { textAlign: 'left', fontFamily: 'var(--mono)' }, onclick: () => { sel = i; draw(); } }, f));
          const ms = Object.keys(rules).map((k) => h('button', { class: 'xv-btn', onclick: () => { modes[sel] = k; draw(); } }, names[k]));
          const cd = h('div');
          function draw() {
            fl.forEach((b, i) => b.classList.toggle('on', i === sel));
            ms.forEach((b, i) => b.classList.toggle('on', Object.keys(rules)[i] === modes[sel]));
            url.textContent = 'https://example.com' + files[sel][1].replace(':id', '42'); flash(url);
            cd.replaceChildren(code(`export default defineNuxtConfig({\n  routeRules: {\n${files.map(([, u], i) => '    \'' + u + '\': { ' + rules[modes[i]] + ' },' + (i === sel ? '   // ← 選択中' : '')).join('\n')}\n  },\n})`, 'ts', { color: C, file: 'nuxt.config.ts', hi: [3 + sel] }));
          }
          el.append(sp(pane(lbl('① ファイル = URL（自動ルーティング）'), h('div', { style: { display: 'grid', gap: '6px' } }, fl), url, lbl('② ルートごとに描画方式'), h('div', { class: 'xv-row' }, ms)),
            pane(cd, h('div', { class: 'xv-row' }, chip('useFetch / useAsyncData'), chip('auto-import'), chip('server/api'), chip('<head> / SEO')))));
          draw();
        },
      },
      {
        t: '方式えらびクイズ', why: {"pv": {"k": "code", "file": "要件", "lang": "ts", "text": "// 要件: SEO あり・毎日更新\n// → SPA? SSR? SSG? ISR?", "err": [2], "keys": {"2": "pick"}}, "iv": {"k": "code", "file": "3つの質問", "lang": "ts", "text": "検索に出す? いいえ → SPA\n更新は多い? 少ない → SSG\n人ごと違う? はい   → SSR", "idea": [1, 2, 3], "keys": {"1": "pick"}}, "av": {"k": "code", "file": "要件 → 方式", "lang": "ts", "text": "// 要件 → 方式\nSEO不要・操作多い → SPA\n更新少・速さ命   → SSG\n更新あり・アクセス多 → ISR", "ok": [2, 3, 4], "keys": {"1": "pick"}}, "problem": "特徴は分かった。要件から選べる？", "idea": "<b>3つの質問</b>で順に絞る", "answer": "要件から方式を引き出す", "when": [["SEO 不要・操作が多い", "SPA"], ["更新少・速さ命", "SSG"], ["更新あり・アクセス多", "ISR"], ["人ごとに変わる + SEO", "SSR"]]}, lead: '要件に合う方式はどれ？',
        render(el) {
          el.append(h('div', { class: 'card', style: { display: 'grid', gap: '18px' } },
            quiz({ q: '管理画面（ログイン後のみ・SEO 不要・操作が多い）', options: ['SPA', 'SSG', 'ISR'], answer: 0, why: '検索に出す必要がなければ SPA がシンプル。' }),
            quiz({ q: '会社の紹介ページ。ほぼ更新せず、速さと SEO が命。', options: ['SSR', 'SSG', 'SPA'], answer: 1, why: '作り置きの HTML を CDN から即返せる。' }),
            quiz({ q: 'ニュース一覧。数分遅れでよいが、アクセスが多く速くしたい。', options: ['ISR', 'SPA', 'SSG のみ'], answer: 0, why: 'キャッシュ + 裏で再生成。速さと鮮度のバランス。' }),
            quiz({ q: 'ユーザーごとに内容が変わり、SEO も必要なページ。', options: ['SSG', 'SSR', 'ISR'], answer: 1, why: 'リクエストごとに生成できる SSR が向く。' })));
        },
      },
    ],
  });

  /* ====================================================== x-vue-workflow */
  style('xv-wf', `
  .xv-pipe{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
  .xv-pipe .st{padding:.35em .8em;border-radius:8px;border:2px solid var(--line);font-weight:800;font-size:.75rem;transition:.35s;background:var(--card);display:flex;gap:.4em;align-items:center}
  .xv-pipe .st.done{border-color:var(--vue);color:var(--vue)}
  .xv-pipe .st.cur{background:var(--vue);border-color:var(--vue);color:#06101f;transform:translateY(-4px) scale(1.07);box-shadow:0 10px 22px -8px var(--vue)}
  .xv-pipe .st.bad{background:#ff6b7a;border-color:#ff6b7a;color:#06101f;animation:shake .4s}
  .xv-pipe .ar{color:var(--mute)}
  .xv-term2{background:var(--code);border-radius:8px;border:1px solid var(--line);padding:12px 14px;font:.875rem/1.75 var(--mono);color:#cfd5ff;min-height:190px}
  .xv-term2 div{animation:capin .3s both;white-space:pre-wrap}.xv-term2 .p{color:var(--vue)}.xv-term2 .g{color:#9be58b}.xv-term2 .r{color:#ff8f9a}.xv-term2 .m{color:#6d779f}
  .xv-cm{display:grid;gap:8px}
  .xv-cm .opt{display:flex;gap:8px;margin-top:6px}
  `);
  reg({
    id: 'x-vue-workflow', title: '開発フローとコードの書き方', sub: 'Issue → PR → Merge · Prettier · コメント', emoji: '🧭',
    gh: [gh('99_bonus/DevelopmenWorkflow.md', 'vuejs/99_bonus/DevelopmenWorkflow.md'), gh('99_bonus/prettier.md', 'vuejs/99_bonus/prettier.md'), gh('99_bonus/CommentCode.md', 'vuejs/99_bonus/CommentCode.md')],
    meta: { cat: 'vue', day: '25日(水)', when: 'チーム開発（開発）の開始前 15 分', mins: 15, order: 36, level: '入門', after: 'vue-test', why: 'チーム開発の「進め方」と、読みやすいコードの約束事（整形・コメント）' },
    scenes: [
      {
        t: '1 つの機能ができるまで', ref: [{"title": "コミットメッセージの頭", "icon": "table", "html": "<table class=\"vref\"><thead><tr><th>頭</th><th>意味</th></tr></thead><tbody><tr><td><code>feat:</code></td><td>新しい機能</td></tr><tr><td><code>fix:</code></td><td>バグ修正</td></tr><tr><td><code>docs:</code></td><td>文書</td></tr><tr><td><code>refactor:</code></td><td>整理（動きは同じ）</td></tr><tr><td><code>test:</code></td><td>テスト</td></tr><tr><td><code>chore:</code></td><td>雑用</td></tr></tbody></table>"}], why: {"pv": {"k": "code", "file": "ターミナル", "lang": "sh", "text": "$ git checkout main\n$ vim App.vue   # 直接編集\n$ git push      # 全員に影響", "err": [2, 3], "keys": {"3": "flow"}}, "iv": {"k": "code", "file": "ターミナル", "lang": "sh", "text": "$ git switch -c feat/cart\n$ git commit -m \"feat: cart\"\n$ git push -u origin feat/cart", "idea": [1], "keys": {"1": "flow"}}, "av": {"k": "code", "file": "GitHub", "lang": "sh", "text": "feat/cart → PR → Review → main\n  ✓ テスト通過  ✓ 承認", "ok": [1, 2], "keys": {"1": "flow"}}, "problem": "main に直接書くと壊れる", "idea": "<b>小さく分けて、確認してから</b>取り込む", "answer": "Branch → PR → Review → Merge", "when": [["新機能", "feat/ ブランチ"], ["バグ修正", "fix/ ブランチ"], ["ちょっとした修正", "小さな PR でも省略しない"]]}, tag: 'workflow', lead: 'Issue からマージまでを<b>1周</b>する。「テスト失敗」をオンにすると、戻って直す流れも見られる。',
        render(el) {
          let fail = false, api;
          const stp = [
            ['Issue', 'clipboard-list', '# Issue #12  ログイン画面を作る\n# 担当: 自分 / 期限: 明日', '機能の目的と<b>受け入れ条件</b>を決める。'],
            ['Branch', 'git-branch', '$ git switch -c feat/login', 'main から<b>作業用ブランチ</b>を切る。main には直接書かない。'],
            ['Code', 'pencil', '$ git add .\n$ git commit -m "feat: add login form"', '小さく書いて<b>こまめにコミット</b>。メッセージは feat: / fix: / docs: から始める。'],
            ['Format', 'sparkles', '$ npm run lint\n$ npx prettier --write src/', '<b>ESLint</b>（バグの種）と <b>Prettier</b>（見た目）を通す。保存時に自動でもOK。'],
            ['Test', 'flask-conical', '$ npm run test:unit', '壊していないか<b>自動で確認</b>。ここが赤ならコードに戻る。'],
            ['PR', 'git-pull-request', '$ git push -u origin feat/login\n# GitHub で Pull Request を作成', '<b>Pull Request</b>：変更内容と目的を書いてレビュー依頼。'],
            ['Review', 'message-circle', '💬 「null のとき落ちませんか？」\n→ 修正して再 push', 'チームが<b>読んで</b>指摘。直すのは恥ずかしいことではない。'],
            ['Merge', 'git-merge', 'Merged #12 into main ✔\n$ git branch -d feat/login', '承認されたら<b>マージ</b>。ブランチは削除して次の Issue へ。'],
          ];
          const pipe = h('div', { class: 'xv-pipe' }); const nodes = stp.map(([n, ic], i) => { const e = h('span', { class: 'st' }, icon(ic), n); pipe.append(e); if (i < stp.length - 1) pipe.append(h('span', { class: 'ar' }, '→')); return e; });
          const term = h('div', { class: 'xv-term2' });
          const tgl = h('button', { class: 'xv-btn', onclick: () => { fail = !fail; tgl.classList.toggle('on', fail); tgl.textContent = fail ? 'テスト失敗: ON' : 'テスト失敗: OFF'; api.go(api.cur); } }, 'テスト失敗: OFF');
          const steps = stp.map((s) => ({ say: s[3] }));
          el.append(h('div', { class: 'xv-row', style: { justifyContent: 'flex-end', marginBottom: '8px' } }, tgl));
          el.append(stepper({
            color: C, steps,
            init(vis, a) { api = a; vis.append(h('div', { style: { display: 'grid', gap: '14px' } }, pipe, term, h('div', { class: 'xv-row' }, ['feat:', 'fix:', 'docs:', 'refactor:', 'test:', 'chore:'].map(chip)))); },
            update(i) {
              nodes.forEach((n, k) => { n.classList.toggle('done', k < i); n.classList.toggle('cur', k === i && !(fail && i === 4)); n.classList.toggle('bad', fail && i === 4 && k === 4); });
              if (fail && i === 4) nodes[2].classList.add('cur');
              const lines = []; for (let k = 0; k <= i; k++) { const t = stp[k][2]; lines.push(...t.split('\n').map((l) => [l.startsWith('$') ? 'p' : l.startsWith('#') || l.startsWith('💬') ? 'm' : 'g', l])); }
              if (fail && i >= 4) { const idx = lines.findIndex(([, l]) => l === '$ npm run test:unit'); lines.splice(idx + 1, 0, ['r', '✖ login.spec.ts  1 failed'], ['r', '  → Code に戻って修正（↩）']); }
              term.replaceChildren(...lines.slice(-9).map(([c, l]) => h('div', { class: c }, l)));
            },
          }));
        },
      },
      {
        t: 'Prettier：保存で整う', ref: [{"title": "設定ファイルのメモ", "icon": "settings", "html": "<table class=\"vref\"><thead><tr><th>項目</th><th>意味</th></tr></thead><tbody><tr><td><code>semi</code></td><td>行末に ; を付ける</td></tr><tr><td><code>singleQuote</code></td><td>文字を ' で囲む</td></tr><tr><td><code>tabWidth</code></td><td>インデントの幅</td></tr></tbody></table>"}], why: {"pv": {"k": "code", "file": "App.ts", "lang": "ts", "text": "const a='x' ;\nif(a){return}\nfunction f( ){}", "err": [1, 2, 3], "keys": {"1": "fmt"}}, "iv": {"k": "code", "file": ".prettierrc", "lang": "ts", "text": "// 保存すると自動で整形\n{ \"semi\": false,\n  \"singleQuote\": true }", "idea": [2, 3], "keys": {"2": "fmt"}}, "av": {"k": "code", "file": "App.ts", "lang": "ts", "text": "const a = 'x'\nif (a) return\nfunction f() {}", "ok": [1, 2, 3], "keys": {"1": "fmt"}}, "problem": "書き方がバラバラで差分が荒れる", "idea": "<b>整形は機械</b>に任せる", "answer": "<b>Prettier</b>（整形）+ <b>ESLint</b>", "when": [["見た目（空白・引用符・セミコロン）", "Prettier"], ["バグの種（未使用変数など）", "ESLint"]]}, tag: 'Prettier', lead: '人によってバラバラな書き方も、<b>保存すると全員同じ見た目</b>になる。右のオプションを変えて確かめよう。',
        render(el) {
          const O = { semi: false, single: true, tab: 2 };
          const messy = 'const name="Taro" ;const age = 25\nfunction greet(n:string){return "Hello, "+n}\nconst user={name,age,greet}';
          const out = h('div'), rc = h('div'), left = h('div');
          left.append(code(messy, 'ts', { color: '#ff6b7a', file: 'Before（バラバラ）' }));
          left.append(h('div', { style: { height: '10px' } }), code('if(user){console.log( "ok" )}\nelse{ return }', 'ts', { color: '#ff6b7a', file: 'Before（別の人のコード）' }), h('div', { style: { height: '10px' } }), h('div', { class: 'xv-row' }, ['空白・改行', '引用符', 'セミコロン', 'インデント'].map((t) => chip('✔ ' + t + ' をそろえる'))));
          const fmt = () => {
            const q = (s) => O.single ? "'" + s + "'" : '"' + s + '"', sm = O.semi ? ';' : '', ind = ' '.repeat(O.tab);
            return `const name = ${q('Taro')}${sm}\nconst age = 25${sm}\nfunction greet(n: string) {\n${ind}return ${q('Hello, ')} + n${sm}\n}\nconst user = { name, age, greet }${sm}`;
          };
          function run() {
            out.replaceChildren(code(fmt(), 'ts', { color: C, file: 'After（Prettier 実行後）' }));
            out.firstChild.lines.forEach((l, i) => { l.style.animation = 'pop .4s both'; l.style.animationDelay = i * 70 + 'ms'; });
            rc.replaceChildren(code(`{\n  "semi": ${O.semi},\n  "singleQuote": ${O.single},\n  "tabWidth": ${O.tab}\n}`, 'json', { color: 'var(--ts)', file: '.prettierrc.json' }));
          }
          const tg = (k, t) => { const b = h('button', { class: 'xv-btn' + (O[k] ? ' on' : ''), onclick: () => { O[k] = !O[k]; b.classList.toggle('on', O[k]); run(); } }, t); return b; };
          const tabs = [2, 4].map((n) => h('button', { class: 'xv-btn' + (n === 2 ? ' on' : ''), onclick: () => { O.tab = n; tabs.forEach((b) => b.classList.toggle('on', b.textContent === n + ' スペース')); run(); } }, n + ' スペース'));
          const save = h('button', { class: 'xv-btn big', onclick: run }, '💾 保存（Prettier 実行）');
          el.append(sp(pane(left, h('div', { class: 'xv-row' }, chip('ESLint = バグの種を探す'), chip('Prettier = 見た目を揃える'))), pane(out, h('div', { class: 'xv-row' }, save, tg('semi', 'semi ;'), tg('single', "singleQuote '"), tabs), rc)));
          run();
          pickQuiz(el, '使い分けクイズ：Prettier？ ESLint？', [['セミコロン・引用符・インデントをそろえたい。', ['Prettier', 'ESLint', 'どちらも不要'], 0, '見た目をそろえるのは Prettier（整形）。'], ['使っていない変数や、未定義の変数を見つけたい。', ['Prettier', 'ESLint', 'どちらも不要'], 1, 'バグになりそうな所を探すのは ESLint。']]);
        },
      },
      {
        t: 'コメント：「なぜ」を書く', ref: [{"title": "JSDoc のタグ", "icon": "table", "html": "<table class=\"vref\"><thead><tr><th>タグ</th><th>意味</th></tr></thead><tbody><tr><td><code>@param</code></td><td>引数の説明</td></tr><tr><td><code>@returns</code></td><td>戻り値の説明</td></tr><tr><td><code>@example</code></td><td>使い方の例</td></tr></tbody></table>"}], why: {"pv": {"k": "code", "file": "Form.ts", "lang": "ts", "text": "i++  // i を 1 増やす\nbtn.disabled = true", "err": [1, 2], "keys": {"2": "why"}}, "iv": {"k": "code", "file": "考え方", "lang": "ts", "text": "// 「何を」はコードで分かる\n// 見て分からない「なぜ」を書く", "idea": [2], "keys": {"2": "why"}}, "av": {"k": "code", "file": "Form.ts", "lang": "ts", "text": "// 二重送信を防ぐため無効化\nbtn.disabled = true", "ok": [1], "keys": {"1": "why"}}, "problem": "無駄な説明も、無言も読みにくい", "idea": "分からない<b>「なぜ」</b>だけ書く", "answer": "<b>「なぜ」コメント</b> + JSDoc", "when": [["「何を」", "命名でコードを読みやすく"], ["「なぜ」", "コメントに書く"], ["関数の使い方", "JSDoc"]]}, tag: 'comment', lead: 'コードを見れば分かる「何を」より、見ても分からない<b>「なぜ」</b>を書く。4つのコメントは、良い？ 悪い？',
        render(el) {
          const Q = [
            ['// i を 1 増やす\ni++', false, 'コードを読めば分かる「何を」。ノイズになる。'],
            ['// 二重送信を防ぐため、通信中はボタンを無効化する\nbtn.disabled = true', true, '「なぜ」が書いてある。後から読む人が助かる。'],
            ['/**\n * 税込み価格を返す\n * @param price 税抜き価格（円）\n */\nfunction withTax(price: number) {}', true, 'JSDoc は VS Code でホバー表示される。関数の説明に最適。'],
            ['// TODO: 後で直す\nfetchAll()', false, '誰が・いつ・何を？が不明。「// TODO(lam): #123 ページング対応」のように。'],
          ];
          let score = 0, answered = 0;
          const res = h('div', { class: 'st-cap' }, '4 問すべて答えよう');
          const cards = Q.map(([src, good, why], i) => {
            const fb = h('div', { style: { minHeight: '1.4em', fontSize: '.875rem', color: 'var(--mute)' } });
            const row = h('div', { class: 'opt' });
            const mk = (lbl_, val, ic) => h('button', { class: 'xv-btn', onclick: () => {
              if (row.dataset.done) return; row.dataset.done = 1; answered++;
              const ok = val === good; if (ok) score++;
              fb.innerHTML = (ok ? '✅ 正解！ ' : '❌ おしい。') + why; fb.style.color = ok ? 'var(--ok)' : 'var(--bad)';
              row.querySelectorAll('button').forEach((b) => b.classList.remove('on')); row.querySelectorAll('button')[val ? 0 : 1].classList.add('on');
              if (answered === Q.length) { res.innerHTML = '結果 <b>' + score + ' / ' + Q.length + '</b>' + (score === Q.length ? ' — 完璧！' : ''); if (score === Q.length) K.W.celebrate(); }
            } }, ic + lbl_);
            row.append(mk('良い', true, '👍 '), mk('悪い', false, '👎 '));
            return h('div', { class: 'xv-pane xv-cm' }, code(src, 'ts', { color: C }), row, fb);
          });
          el.append(h('div', { class: 'xv-split' }, cards), h('div', { style: { height: '12px' } }), res);
        },
      },
    ],
  });
})();
