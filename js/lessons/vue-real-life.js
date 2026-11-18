/* 実例：vue-life — ① 一覧が開くまでの4ステップ ② 入力のたびに API を呼ぶ問題（debounce）を、触って体験する */
(function () {
  'use strict';
  const K = window.KENSHU;
  if (!K) return;
  let tries = 0;
  (function wait() {
    if (K.lessons && K.lessons['vue-life'] && K.W) return init();
    if (++tries < 200) setTimeout(wait, 50);
  })();

  function init() {
    const L = K.lessons['vue-life'];
    if (L.__vrL) return; L.__vrL = 1;
    const { h, code, style } = K.W;

    style('vrL', `
    .vrL-col{display:grid;gap:12px;min-width:0}.vrL-col>*{min-width:0}
    .vrL-steps{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
    .vrL-st{display:flex;align-items:center;gap:8px;padding:.5em 1em;border-radius:999px;border:2px solid var(--c);color:var(--c);font:800 .88rem var(--font);cursor:pointer;opacity:.55;transition:.2s;background:transparent}
    .vrL-st em{font-style:normal;width:1.6em;height:1.6em;border-radius:50%;display:grid;place-items:center;background:var(--c);color:#06101f;font:900 .75rem var(--font)}
    .vrL-st.on{opacity:1;background:color-mix(in srgb,var(--c) 18%,transparent);box-shadow:0 0 0 3px color-mix(in srgb,var(--c) 25%,transparent)}
    .vrL-bro{border:2px solid #cfd4e2;border-radius:12px;background:#fff;color:#223;overflow:hidden}
    .vrL-url{display:flex;align-items:center;gap:6px;padding:6px 10px;background:#e9edf6;font:700 .75rem var(--mono);color:#556}
    .vrL-url i{width:9px;height:9px;border-radius:50%;background:#f66;box-shadow:14px 0 #fc4,28px 0 #5c8;margin-right:34px}
    .vrL-pg{padding:14px;display:grid;gap:8px;min-height:260px;align-content:start}
    .vrL-pg h3{margin:0;font-size:1.05rem}
    .vrL-empty{display:grid;place-items:center;min-height:170px;color:#aab;font-weight:800;border:2px dashed #dde;border-radius:10px}
    .vrL-sp{display:flex;align-items:center;gap:10px;font-weight:800;color:#667;padding:2.4em 0;justify-content:center}
    .vrL-sp i{width:28px;height:28px;border-radius:50%;border:4px solid #dde;border-top-color:var(--vue);animation:vrLs .8s linear infinite}
    @keyframes vrLs{to{transform:rotate(360deg)}}
    .vrL-it{padding:.55em .8em;border:1px solid #dde;border-radius:8px;font-size:.9rem;font-weight:700;background:#f7f8fc;animation:vrLi .4s both}
    @keyframes vrLi{from{opacity:0;transform:translateY(6px)}}
    .vrL-cnt{font-weight:900;font-size:.9rem;padding:.2em .7em;border-radius:8px;background:#eef1f8;width:max-content}
    .vrL-note{border-left:5px solid var(--vue);background:var(--card);border-radius:10px;padding:12px 16px;display:grid;gap:4px}
    .vrL-note b{font:900 1.1rem/1.6 var(--font)}.vrL-note span{color:var(--vue);font:800 .95rem/1.6 var(--font)}
    .vrL-ctl{display:flex;gap:8px;align-items:center}
    .vrL-in{width:100%;box-sizing:border-box;padding:.65em .9em;border-radius:10px;border:2px solid var(--line);background:#fff;color:#223;font:700 1rem var(--font)}
    .vrL-in:focus{outline:none;border-color:var(--vue)}
    .vrL-api{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .vrL-bx{padding:12px;border-radius:12px;border:2px solid var(--line);background:var(--card);display:grid;gap:6px;justify-items:center}
    .vrL-bx.r{border-color:var(--bad)}.vrL-bx.g{border-color:var(--ok)}
    .vrL-bx small{font-weight:800;font-size:.8rem;color:var(--mute);text-align:center}
    .vrL-bx b{font:900 2.4rem/1 var(--mono)}.vrL-bx.r b{color:var(--bad)}.vrL-bx.g b{color:var(--ok)}
    .vrL-bx .bar{height:8px;border-radius:4px;background:var(--bad);transition:width .3s}.vrL-bx.g .bar{background:var(--ok)}
    .vrL-bx.flash b{animation:vrLp .5s}@keyframes vrLp{40%{transform:scale(1.4)}}
    .vrL-state{padding:.7em 1em;border-radius:10px;background:var(--card2);border:1px solid var(--line);font:800 .95rem var(--font);min-height:1.5em}
    .vrL-state.fire{border-color:var(--ok);color:var(--ok)}
    .vrL-state.wait{border-color:var(--team);color:var(--team)}
    .vrL-code pre.code{margin:0;max-width:100%;overflow-x:auto}
    `);

    /* ---------- ① 一覧が開くまで（4ステップ） ---------- */
    const SRC_A = [
      '<script setup lang="ts">',
      'const cases = ref<Case[]>([])',
      'const loading = ref(true)',
      '',
      'onMounted(async () => {',
      '  cases.value = await fetchCases()',
      '  loading.value = false',
      '})',
      '</script' + '>',
      '',
      '<template>',
      '  <Spinner v-if="loading" />',
      '  <CaseList v-else :items="cases" />',
      '</template>',
    ].join('\n');
    const lnOf = (src, keys) => { const o = []; src.split('\n').forEach((l, i) => { if (keys.some((k) => l.includes(k))) o.push(i + 1); }); return o; };
    const TITLES = ['相続放棄の期限について', '遺産分割の進め方', '離婚時の財産分与', '養育費の算定'];
    const STEPS = [
      { t: 'setup', c: 'var(--ts)', hi: ['const cases', 'const loading'], what: 'まず、空の入れ物を作る。', why: 'この時点では、画面もデータも空っぽ。', ph: 'empty' },
      { t: 'onMounted', c: 'var(--team)', hi: ['onMounted', 'await fetchCases'], what: '画面ができた直後に、1回だけ動く。', why: 'ここで API にデータを取りに行く。', ph: 'spin' },
      { t: 'データが届く', c: 'var(--pink)', hi: ['cases.value ='], what: '届いた4件を cases に入れる。', why: 'ref に入れるだけ。画面の書き換えは書かない。', ph: 'spin', n: 4 },
      { t: '一覧が出る', c: 'var(--ok)', hi: ['loading.value = false', 'v-if="loading"', 'v-else'], what: 'loading を false にすると、一覧に切り替わる。', why: 'ref を変えるだけで、画面が自動で変わる。', ph: 'list', n: 4 },
    ];
    function sceneA(el) {
      let cur = 0, tm = null;
      const stepsEl = h('div', { class: 'vrL-steps' });
      const chips = STEPS.map((s, i) => { const c = h('button', { class: 'vrL-st', style: { '--c': s.c }, onclick: () => { stop(); go(i); } }, h('em', String(i + 1)), s.t); return c; });
      stepsEl.append(...chips);
      const page = h('div', { class: 'vrL-pg' }), noteEl = h('div', { class: 'vrL-note' });
      const pre = code(SRC_A, 'vue', { color: 'var(--vue)', file: 'CaseListPage.vue', dim: true, edit: false });
      const play = h('button', { class: 'btn primary', style: { '--c': 'var(--vue)' }, onclick: () => (tm ? stop() : start()) }, '▶ 自動再生');
      const stop = () => { clearInterval(tm); tm = null; play.textContent = '▶ 自動再生'; };
      const start = () => { if (cur >= STEPS.length - 1) go(0); play.textContent = '⏸ 止める'; tm = setInterval(() => { if (!el.isConnected || cur >= STEPS.length - 1) return stop(); go(cur + 1); }, 2200); };
      function go(i) {
        cur = i; const s = STEPS[i];
        chips.forEach((c, j) => c.classList.toggle('on', j === i));
        pre.setHi(lnOf(SRC_A, s.hi));
        const kids = [h('h3', '相談一覧'), h('div', { class: 'vrL-cnt' }, '全 ' + (s.n || 0) + ' 件')];
        if (s.ph === 'empty') kids.push(h('div', { class: 'vrL-empty' }, '（まだ何も表示されていない）'));
        else if (s.ph === 'spin') kids.push(h('div', { class: 'vrL-sp' }, h('i'), '読み込み中…'));
        else TITLES.forEach((t, k) => kids.push(h('div', { class: 'vrL-it', style: { animationDelay: k * 90 + 'ms' } }, t)));
        page.replaceChildren(...kids);
        noteEl.style.borderColor = s.c;
        noteEl.replaceChildren(h('b', s.what), h('span', '→ ' + s.why));
      }
      el.append(h('div', { class: 'vrL-col' }, h('div', { class: 'vrL-ctl' }, stepsEl, h('span', { style: { flex: 1 } }), play),
        h('div', { class: 'vi-eq' },
          h('div', { class: 'vrL-col' }, h('div', { class: 'vrL-bro' }, h('div', { class: 'vrL-url' }, h('i'), 'https://sodan.example.jp/cases'), page), noteEl),
          h('div', { class: 'vrL-code' }, pre))));
      go(0);
    }

    /* ---------- ② 入力のたびに API？（debounce） ---------- */
    const SRC_B = [
      'const keyword = ref(\'\')',
      'let timer: number | undefined',
      '',
      'watch(keyword, (kw) => {',
      '  clearTimeout(timer)',
      '  timer = window.setTimeout(async () => {',
      '    cases.value = await fetchCases(kw)',
      '  }, 300)',
      '})',
    ].join('\n');
    function sceneB(el) {
      let no = 0, de = 0, timer = null, auto = null;
      const inp = h('input', { class: 'vrL-in', placeholder: '分野で検索（例：相続放棄の期限）' });
      const state = h('div', { class: 'vrL-state' }, '入力してみよう。または右のボタンで自動入力。');
      const pre = code(SRC_B, 'ts', { color: 'var(--vue)', file: 'CaseListPage.vue（watch の部分）', dim: true, edit: false });
      const bx = (cls, lab) => { const b = h('b', '0'), bar = h('div', { class: 'bar', style: { width: '0%' } }), el2 = h('div', { class: 'vrL-bx ' + cls }, h('small', lab), b, bar); el2.set = (n) => { b.textContent = n; bar.style.width = Math.min(100, n / 12 * 100) + '%'; el2.classList.remove('flash'); void el2.offsetWidth; el2.classList.add('flash'); }; return el2; };
      const boxNo = bx('r', '✖ そのまま呼ぶ\nAPIを呼んだ回数'), boxDe = bx('g', '✓ watch ＋ 300ms待つ\nAPIを呼んだ回数');
      [boxNo, boxDe].forEach((b) => (b.firstChild.style.whiteSpace = 'pre-line'));
      const onType = () => {
        no++; boxNo.set(no);
        pre.setHi(lnOf(SRC_B, ['watch(keyword', 'clearTimeout']));
        state.className = 'vrL-state wait'; state.textContent = '⏳ まだ打っている？ 前の予約を取り消して、300ms 待つ…';
        clearTimeout(timer);
        timer = setTimeout(() => { de++; boxDe.set(de); pre.setHi(lnOf(SRC_B, ['setTimeout', 'await fetchCases', '}, 300)'])); state.className = 'vrL-state fire'; state.textContent = '🚀 300ms 静止 → ここで初めて API を呼ぶ！'; }, 300);
      };
      inp.addEventListener('input', onType);
      const reset = () => { clearInterval(auto); clearTimeout(timer); inp.value = ''; no = de = 0; boxNo.set(0); boxDe.set(0); [boxNo, boxDe].forEach((b) => b.classList.remove('flash')); pre.setHi([]); state.className = 'vrL-state'; state.textContent = '入力してみよう。または右のボタンで自動入力。'; };
      const typeBtn = h('button', { class: 'btn primary', style: { '--c': 'var(--vue)' }, onclick: () => {
        reset(); const txt = '相続放棄の期限'; let i = 0; inp.focus();
        auto = setInterval(() => { if (!el.isConnected || i >= txt.length) return clearInterval(auto); inp.value = txt.slice(0, ++i); onType(); }, 160);
      } }, '▶ 「相続放棄の期限」を自動入力');
      el.append(h('div', { class: 'vi-eq' },
        h('div', { class: 'vrL-col' }, inp, h('div', { class: 'vrL-ctl' }, typeBtn, h('button', { class: 'btn ghost', onclick: reset }, '⟲ リセット')), h('div', { class: 'vrL-api' }, boxNo, boxDe), state),
        h('div', { class: 'vrL-code' }, pre)));
    }

    const A = { t: '実例：相談一覧が開く瞬間', tag: '実例', lead: '<b>setup → onMounted → 一覧</b>。4ステップで、順番を見る。', render(el) { sceneA(el); } };
    const B = { t: '実例：入力のたびに API？', tag: '実例', lead: '打つたびに通信すると<b>無駄</b>。<code>watch</code> ＋ 待つ、で減らす。', render(el) { sceneB(el); } };
    const sc = L.scenes; let at = sc.findIndex((s) => s.t === '実践：ライフサイクル+計算'); if (at < 0) at = sc.length;
    sc.splice(at, 0, A, B);
  }
})();
