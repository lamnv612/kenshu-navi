/* vue-life「ライフサイクル」：全体の流れ。段階を1つずつ押して、画面・状態・コードの変化を見る */
(function () {
  'use strict';
  const K = window.KENSHU;
  if (!K) return;
  let tries = 0;
  (function wait() { if (K.lessons && K.lessons['vue-life'] && K.W && K.vs) return init(); if (++tries < 200) setTimeout(wait, 50); })();

  function init() {
    const L = K.lessons['vue-life'];
    const base = L.scenes.find((s) => s.t === 'ライフサイクル');
    if (!base || base.__flow) return; base.__flow = 1;
    const { h, code, style } = K.W;

    style('vlf', `
    .vlf{display:grid;gap:14px;min-width:0}
    .vlf-bar{display:flex;gap:10px;flex-wrap:wrap;align-items:stretch}
    .vlf-bar .btn{height:46px;padding:0 1.3em;display:inline-flex;align-items:center;gap:.5em}
    .vlf-flow{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:8px;position:relative}
    @media(max-width:1000px){.vlf-flow{grid-template-columns:repeat(3,minmax(0,1fr))}}
    .vlf-st{all:unset;cursor:pointer;box-sizing:border-box;display:grid;gap:3px;padding:10px 12px;border-radius:12px;border:2px solid var(--line);background:var(--card);transition:.2s;min-width:0}
    .vlf-st b{font:900 .88rem var(--mono);display:flex;align-items:center;gap:8px}
    .vlf-st b i{font-style:normal;flex:none;width:1.7em;height:1.7em;border-radius:50%;display:grid;place-items:center;background:var(--line);font:900 .75rem var(--font)}
    .vlf-st small{font:700 .78rem/1.4 var(--font);color:var(--mute)}
    .vlf-st .star{font:800 .72rem var(--font);color:var(--team)}
    .vlf-st.past{border-color:color-mix(in srgb,var(--ok) 55%,var(--line))}.vlf-st.past b i{background:var(--ok);color:#06101f}
    .vlf-st.on{border-color:var(--c);background:color-mix(in srgb,var(--c) 16%,var(--card));box-shadow:0 0 0 3px color-mix(in srgb,var(--c) 28%,transparent);transform:translateY(-2px)}
    .vlf-st.on b i{background:var(--c);color:#06101f}
    .vlf-st.vs-hot{outline:2px solid var(--c);outline-offset:2px}
    .vlf-mid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px;align-items:stretch}
    @media(max-width:980px){.vlf-mid{grid-template-columns:1fr}}
    .vlf-ui{position:relative;border-radius:14px;background:#f4f6fb;color:#1f2a44;padding:14px;display:grid;gap:10px;align-content:start;min-height:330px;min-width:0}
    .vlf-state{display:flex;gap:8px;flex-wrap:wrap}
    .vlf-chip{padding:.25em .7em;border-radius:8px;background:#fff;border:1px solid #cfd8ee;font:800 .82rem var(--mono)}
    .vlf-chip b{color:#2f6df0}
    .vlf-chip.run b{color:#d97706}
    .vlf-page{border:2px solid #cfd4e2;border-radius:12px;background:#fff;overflow:hidden;transition:.5s;min-height:210px}
    .vlf-page.gone{opacity:0;transform:scale(.92)}
    .vlf-page.fade{opacity:.5}
    .vlf-hd{display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:#1d2b53;color:#fff;font:900 .9rem var(--font)}
    .vlf-pb{padding:12px;display:grid;gap:8px}
    .vlf-empty{display:grid;place-items:center;min-height:200px;border:2px dashed #b9c0d6;border-radius:12px;color:#8a93ad;font:800 .95rem var(--font);text-align:center;padding:10px}
    .vlf-in{border:2px solid #cfd4e2;border-radius:8px;padding:.45em .7em;font:700 .9rem var(--font);display:flex;gap:6px;align-items:center;min-height:2.4em}
    .vlf-sp{display:flex;gap:10px;align-items:center;justify-content:center;padding:1.6em 0;color:#667;font-weight:800}
    .vlf-sp i{width:26px;height:26px;border-radius:50%;border:4px solid #dde;border-top-color:#2fd4a4;animation:vlfs .8s linear infinite}
    @keyframes vlfs{to{transform:rotate(360deg)}}
    .vlf-it{padding:.5em .8em;border:1px solid #dde;border-radius:8px;font:700 .9rem var(--font);background:#f7f8fc;animation:vlfi .4s both}
    @keyframes vlfi{from{opacity:0;transform:translateY(6px)}}
    .vlf-tm{display:flex;align-items:center;gap:8px;font:800 .8rem var(--mono);padding:.35em .8em;border-radius:8px;background:#eef6ee;color:#1b7a3a}
    .vlf-tm i{width:9px;height:9px;border-radius:50%;background:#2fb34a;animation:vlfb 1s infinite}
    .vlf-tm.off{background:#eee;color:#888}.vlf-tm.off i{background:#aaa;animation:none}
    .vlf-tm.leak{background:#fde8e8;color:#c33}.vlf-tm.leak i{background:#e33}
    @keyframes vlfb{50%{opacity:.25}}
    .vlf-pkt{position:absolute;left:0;top:0;z-index:9;padding:.2em .85em;border-radius:99px;color:#06101f;font:900 .82rem var(--mono);box-shadow:0 6px 18px rgba(0,0,0,.35);pointer-events:none;white-space:nowrap}
    .vlf-info{border:2px solid var(--c);border-radius:14px;background:var(--card);padding:16px 18px;display:grid;gap:12px;align-content:start;min-width:0;transition:border-color .3s}
    .vlf-hk{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap}.vlf-hk b{font:900 1.35rem var(--mono);color:var(--c)}.vlf-hk span{font:800 .88rem var(--font);color:var(--mute)}
    .vlf-row{display:grid;gap:3px}.vlf-row small{font:900 .8rem var(--font);color:var(--mute)}
    .vlf-row p{margin:0;font:800 1.02rem/1.65 var(--font)}
    .vlf-do{display:flex;gap:8px;flex-wrap:wrap}
    .vlf-do span{padding:.3em .8em;border-radius:99px;background:color-mix(in srgb,var(--c) 18%,transparent);border:1px solid color-mix(in srgb,var(--c) 55%,transparent);font:800 .88rem var(--font)}
    .vlf-bad{border-left:5px solid var(--bad);padding:.5em .8em;border-radius:8px;background:color-mix(in srgb,var(--bad) 10%,var(--card));font:800 .92rem/1.6 var(--font)}
    .vlf-code{min-width:0}.vlf-code pre.code{margin:0;font-size:.95rem}
    .vlf [data-k]{cursor:default}
    `);

    const SRC = [
      '<script setup lang="ts">',
      "import { ref, onBeforeMount, onMounted, onUpdated, onBeforeUnmount, onUnmounted } from 'vue'",
      "import { fetchCases } from '@/api/cases'",
      "import type { Case } from '@/types/case'",
      '',
      'const cases = ref<Case[]>([])',
      'const loading = ref(true)',
      'let timer: number | undefined',
      'const refresh = async (): Promise<void> => { cases.value = await fetchCases() }',
      '',
      'onBeforeMount(() => {',
      "  console.log('画面ができる直前')",
      '})',
      '',
      'onMounted(async () => {',
      '  await refresh()',
      '  loading.value = false',
      '  timer = window.setInterval(refresh, 30000)',
      '})',
      '',
      'onUpdated(() => {',
      "  console.log('データが変わり、画面が描き直された')",
      '})',
      '',
      'onBeforeUnmount(() => {',
      "  console.log('画面から消える直前')",
      '})',
      '',
      'onUnmounted(() => {',
      '  clearInterval(timer)',
      '})',
      '</script' + '>',
    ].join('\n');
    const STEPS = [
      { k: 'setup', hk: 'setup', yomi: 'セットアップ', c: 'var(--ts)', star: '★★★', sub: '作られた瞬間', when: 'コンポーネントが作られた瞬間に、1回だけ実行される。まだ画面（DOM）はない。', todo: ['ref でデータを用意', '関数を宣言'], bad: 'ここで画面の部品を探すと、まだ無いので null になる。', toks: ['const cases', 'const loading', 'let timer', 'const refresh'] },
      { k: 'beforeMount', hk: 'onBeforeMount', yomi: 'オンビフォアマウント', c: 'var(--mute)', star: '★', sub: '画面ができる直前', when: '画面（DOM）を作る直前。', todo: ['ほとんど使わない'], bad: '', toks: ['onBeforeMount', '画面ができる直前'] },
      { k: 'mounted', hk: 'onMounted', yomi: 'オンマウンテッド', c: 'var(--vue)', star: '★★★', sub: '画面が出た！', when: '画面が出た直後に、1回だけ。やっと DOM が使える。', todo: ['API で一覧を取る', 'タイマーを始める', '入力欄にフォーカス'], bad: '画面が出る前に API を呼ぶと、結果を入れる先が無くて失敗する。', toks: ['onMounted', 'await refresh', 'loading.value = false', 'setInterval'] },
      { k: 'updated', hk: 'onUpdated', yomi: 'オンアップデーテッド', c: 'var(--team)', star: '★★', sub: '再描画のあと', when: 'データが変わって、画面が描き直された直後。何回でも呼ばれる。', todo: ['描画後にスクロール位置を直す', '大きさを測る'], bad: 'ここでデータを変えると、また再描画 → ここ…と無限ループになる。', toks: ['onUpdated', '描き直された'] },
      { k: 'beforeUnmount', hk: 'onBeforeUnmount', yomi: 'オンビフォアアンマウント', c: 'var(--pink)', star: '★', sub: '消える直前', when: '画面から消える直前。まだ DOM は残っている。', todo: ['未保存の確認', '後片付けの準備'], bad: '', toks: ['onBeforeUnmount', '消える直前'] },
      { k: 'unmounted', hk: 'onUnmounted', yomi: 'オンアンマウンテッド', c: 'var(--bad)', star: '★★★', sub: '消えたあと', when: '画面が消えたあと。後片付けの場所。', todo: ['setInterval を止める', 'イベントを外す'], bad: '止め忘れると、見えないページの裏で通信が続く（メモリも通信も無駄）。', toks: ['onUnmounted', 'clearInterval'] },
    ];

    const NAMES = ['離婚の相談', '相続の相談', '労働の相談', '養育費の相談'];
    function render(el) {
      let cur = 0, auto = null, busy = 0;
      const lnOf = (toks) => { const o = []; SRC.split('\n').forEach((l, i) => { if (toks.some((t) => l.includes(t))) o.push(i + 1); }); return o; };
      const pre = code(SRC, 'vue', { color: 'var(--vue)', file: 'CaseListPage.vue（全部の段階）', dim: true, edit: false });
      const stepBtns = STEPS.map((s, i) => { const b = h('button', { class: 'vlf-st', 'data-k': s.k, style: { '--c': s.c }, onclick: () => { stop(); go(i); } }, h('b', h('i', String(i + 1)), s.hk), h('small', s.sub), h('span', { class: 'star' }, '使う頻度 ' + s.star)); return b; });
      const flow = h('div', { class: 'vlf-flow' }, ...stepBtns);
      const ui = h('div', { class: 'vlf-ui' }), info = h('div', { class: 'vlf-info' });
      const stage = h('div', { class: 'vlf-mid' }, ui, info);
      const play = h('button', { class: 'btn primary', style: { '--c': 'var(--vue)' }, onclick: () => (auto ? stop() : start()) }, '▶ 自動で流す');
      const stop = () => { clearInterval(auto); auto = null; play.textContent = '▶ 自動で流す'; };
      const start = () => { if (cur >= STEPS.length - 1) go(0); play.textContent = '⏸ 止める'; auto = setInterval(() => { if (!el.isConnected || cur >= STEPS.length - 1) return stop(); go(cur + 1); }, 3000); };
      const bar = h('div', { class: 'vlf-bar' }, h('button', { class: 'btn', onclick: () => { stop(); go(Math.max(0, cur - 1)); } }, '◀ 戻る'), h('button', { class: 'btn primary', style: { '--c': 'var(--vue)' }, onclick: () => { stop(); go(Math.min(STEPS.length - 1, cur + 1)); } }, '次の段階 ▶'), play, h('button', { class: 'btn ghost', onclick: () => { stop(); go(0); } }, '⟲ 最初から'));
      const root = h('div', { class: 'vlf' }, bar, flow, stage, h('div', { class: 'vlf-code' }, pre));
      const fly = async (from, to, text, col) => {
        if (!from || !to || !from.isConnected || !to.isConnected) return;
        const hr = ui.getBoundingClientRect(), a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
        const p = h('span', { class: 'vlf-pkt', style: { background: col } }, text); ui.append(p);
        const w = p.offsetWidth, hh = p.offsetHeight, pt = (r) => ({ x: r.left - hr.left + r.width / 2 - w / 2, y: r.top - hr.top + r.height / 2 - hh / 2 }), A = pt(a), B = pt(b);
        try { await p.animate([{ transform: `translate(${A.x}px,${A.y}px) scale(.6)`, opacity: 0 }, { transform: `translate(${A.x}px,${A.y}px)`, opacity: 1, offset: .15 }, { transform: `translate(${B.x}px,${B.y}px)`, opacity: 1, offset: .85 }, { transform: `translate(${B.x}px,${B.y}px) scale(.6)`, opacity: 0 }], { duration: 1000, easing: 'ease-in-out' }).finished; } catch (e) { /* ok */ }
        p.remove();
      };
      const state = (loading, n, timer, upd) => h('div', { class: 'vlf-state', 'data-k': 'setup' },
        h('span', { class: 'vlf-chip' }, 'loading = ', h('b', String(loading))), h('span', { class: 'vlf-chip' }, 'cases.length = ', h('b', String(n))),
        h('span', { class: 'vlf-chip' + (timer === '動作中' ? ' run' : '') }, 'timer = ', h('b', timer)), h('span', { class: 'vlf-chip' }, '再描画 ', h('b', upd + '回')));
      function draw(i) {
        const nodes = [];
        const s = STEPS[i];
        if (i === 0) { nodes.push(state(true, 0, '—', 0), h('div', { class: 'vlf-empty', 'data-k': 'setup' }, '（まだ画面はない）\nデータの入れ物だけ作られた')); }
        else if (i === 1) { nodes.push(state(true, 0, '—', 0), h('div', { class: 'vlf-empty', 'data-k': 'beforeMount' }, '画面を作ろうとしている…')); }
        else if (i === 2) {
          const sp = h('div', { class: 'vlf-sp', 'data-k': 'mounted' }, h('i'), '読み込み中…'), list = h('div', { class: 'vlf-pb' });
          const pg = h('div', { class: 'vlf-page' }, h('div', { class: 'vlf-hd' }, '相談一覧'), list);
          const st = h('div'); st.append(state(true, 0, '—', 0));
          list.append(sp); nodes.push(st, pg);
          const api = h('div', { class: 'vlf-chip', style: { justifySelf: 'end' } }, '☁ API サーバー'); nodes.push(api);
          const my = ++busy;
          setTimeout(async () => { if (my !== busy) return; await fly(sp, api, 'fetchCases()', '#2fd4a4'); if (my !== busy) return; await fly(api, list, '4件', '#5b9dff'); if (my !== busy) return; list.replaceChildren(...NAMES.map((t, k) => h('div', { class: 'vlf-it', 'data-k': 'mounted', style: { animationDelay: k * 90 + 'ms' } }, t))); st.replaceChildren(state(false, 4, '動作中', 0)); K.vs.link(root, pre, MAP, { rest: () => lnOf(STEPS[cur].toks) }); }, 350);
        }
        else if (i === 3) {
          nodes.push(state(false, 4, '動作中', 1), h('div', { class: 'vlf-page' }, h('div', { class: 'vlf-hd' }, '相談一覧'), h('div', { class: 'vlf-pb' }, h('div', { class: 'vlf-in', 'data-k': 'updated' }, '🔎 ', h('b', '相続'), '　← 入力が変わった'), h('div', { class: 'vlf-it', 'data-k': 'updated' }, '相続の相談'), h('div', { class: 'vlf-it', 'data-k': 'updated' }, '相続放棄の相談'))));
        }
        else if (i === 4) {
          nodes.push(state(false, 4, '動作中', 1), h('div', { class: 'vlf-page fade' }, h('div', { class: 'vlf-hd' }, '相談一覧　→　別のページへ移動中…'), h('div', { class: 'vlf-pb' }, ...NAMES.slice(0, 2).map((t) => h('div', { class: 'vlf-it' }, t)), h('div', { class: 'vlf-tm', 'data-k': 'beforeUnmount' }, h('i'), '30秒ごとの更新：動作中'))));
        }
        else {
          const pg = h('div', { class: 'vlf-page' }, h('div', { class: 'vlf-hd' }, '相談一覧'), h('div', { class: 'vlf-pb' }, ...NAMES.slice(0, 2).map((t) => h('div', { class: 'vlf-it' }, t))));
          const tm = h('div', { class: 'vlf-tm leak', 'data-k': 'unmounted' }, h('i'), '更新タイマー：まだ動いている…');
          nodes.push(state(false, 4, '動作中', 1), pg, tm);
          const my = ++busy;
          setTimeout(() => { if (my !== busy) return; pg.classList.add('gone'); }, 150);
          setTimeout(async () => { if (my !== busy) return; await fly(pg, tm, 'clearInterval', '#ff6b6b'); if (my !== busy) return; tm.className = 'vlf-tm off'; tm.lastChild.textContent = '更新タイマー：停止 ✓（後片付け済み）'; ui.firstChild && ui.firstChild.replaceWith(state(false, 4, '停止', 1)); }, 700);
        }
        ui.replaceChildren(...nodes);
      }
      const MAP = {}; STEPS.forEach((s) => { MAP[s.k] = s.toks; });
      function go(i) {
        cur = i; const s = STEPS[i]; busy++;
        stepBtns.forEach((b, j) => { b.classList.toggle('on', j === i); b.classList.toggle('past', j < i); });
        info.style.setProperty('--c', s.c);
        info.replaceChildren(
          h('div', { class: 'vlf-hk' }, h('b', s.hk), h('span', s.yomi), h('span', '使う頻度 ' + s.star)),
          h('div', { class: 'vlf-row' }, h('small', '⏱ いつ？'), h('p', s.when)),
          h('div', { class: 'vlf-row' }, h('small', '🛠 ここでよくやること'), h('div', { class: 'vlf-do' }, ...s.todo.map((t) => h('span', t)))),
          ...(s.bad ? [h('div', { class: 'vlf-bad' }, '⚠ ' + s.bad)] : []));
        pre.setHi(lnOf(s.toks), 'on');
        draw(i);
        K.vs.link(root, pre, MAP, { rest: () => lnOf(STEPS[cur].toks) });
      }
      el.append(root);
      go(0);
    }

    // 旧版（知らないと困る例）は、次のシーンとして残す
    const oldRender = base.render, oldLead = base.lead, oldTag = base.tag;
    const nxt = Object.assign({}, base, { t: 'ライフサイクル：いつ呼ぶ？', tag: oldTag, lead: oldLead, render: oldRender });
    delete nxt.__flow;
    base.render = render; base.lead = '<b>setup → onMounted → onUpdated → onUnmounted</b>。段階を1つずつ押して、画面の変化を見よう。'; base.tag = 'LIFECYCLE';
    const i = L.scenes.indexOf(base); L.scenes.splice(i + 1, 0, nxt);
    if (K.sceneTerms && K.sceneTerms['ライフサイクル']) K.sceneTerms[nxt.t] = K.sceneTerms['ライフサイクル'];
  }
})();
