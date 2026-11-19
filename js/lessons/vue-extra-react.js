/* 補足：Vue と React の違い（同じ画面を、2通りで書いてみる）
   K.vs.versus の neutral モード：左 = Vue（緑）／右 = React（青）。一般的・基本だけ。深追いしない。 */
(function () {
  'use strict';
  const K = window.KENSHU;
  if (!K || !K.W || !K.vs || !K.reg) return;
  const { h, style } = K.W;

  style('vxR', `
  .vxR-all{display:grid;gap:14px;min-width:0}
  .vxR-roles{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
  .vxR-roles>span.t{font:900 .9rem var(--font);color:var(--mute);margin-right:4px}
  .vxR-rc{all:unset;cursor:pointer;padding:.3em .9em;border-radius:99px;border:2px solid var(--rc);color:var(--text);font:800 .9rem var(--font);transition:.2s}
  .vxR-rc:hover,.vxR-rc.on{background:var(--rc);color:#06101f;transform:translateY(-1px)}
  .vxR-cap{min-height:2.6em;display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:8px 14px;border-radius:12px;border:2px dashed var(--line);font:700 .92rem/1.5 var(--font);color:var(--mute);transition:.2s}
  .vxR-cap.on{border-style:solid;border-color:var(--rc);color:var(--text)}
  .vxR-cap code{font:800 .9rem var(--mono);padding:.1em .5em;border-radius:6px;background:var(--card2)}
  .vxR-cap .vv{color:var(--vue)}.vxR-cap .rr{color:#61dafb}
  .vxR-sd{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;align-items:stretch}
  @media(max-width:760px){.vxR-sd{grid-template-columns:1fr}}
  .vxR-sd>div{border-radius:14px;border:2px solid var(--line);background:var(--card);padding:12px;display:grid;gap:8px;align-content:start}
  .vxR-sd>div.same{border-color:color-mix(in srgb,var(--ok) 50%,var(--line))}
  .vxR-sd>div.diff{border-color:color-mix(in srgb,var(--team) 55%,var(--line))}
  .vxR-sd h5{margin:0;font:900 .95rem var(--font)}
  .vxR-sd .same h5{color:var(--ok)}.vxR-sd .diff h5{color:var(--team)}
  .vxR-sd .cc{padding:.4em .8em;border-radius:10px;background:var(--card2);font:700 .92rem/1.5 var(--font)}
  .vxR-sd .cc b{color:var(--text);font-weight:900}
  .vs-code .ln.vxR-rl{background:color-mix(in srgb,var(--rc) 16%,transparent);box-shadow:inset 4px 0 0 var(--rc)}
  .vxR-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
  .vxR-col{display:grid;gap:10px;align-content:start}
  .vxR-btn{border:0;border-radius:10px;padding:.55em 1.1em;background:#1f2a44;color:#fff;font:800 .95rem var(--font);cursor:pointer;transition:.2s}
  .vxR-btn:hover{transform:translateY(-1px)}.vxR-btn:active{transform:scale(.96)}
  .vxR-btn.vs-hot{background:#1f2a44!important;color:#fff!important}
  .vxR-btn.sm{padding:.35em .8em;font-size:.85rem}
  .vxR-chip{display:inline-flex;align-items:center;gap:.5em;padding:.4em .8em;border-radius:10px;background:#fff;border:2px dashed #99a3bd;font:800 .9rem var(--mono);color:#1f2a44;transition:.3s}
  .vxR-chip small{font:800 .8rem var(--font);color:#667}
  .vxR-chip.v{border-color:#42b883}.vxR-chip.r{border-color:#61dafb}
  .vxR-disp{background:#fff;border:2px solid #d7dbe8;border-radius:12px;padding:.7em 1em;font:900 1.15rem var(--font);color:#1f2a44;transition:.3s}
  .vxR-run{display:flex;align-items:center;gap:10px;padding:.5em .9em;border-radius:10px;border:2px solid #d7dbe8;background:#fff;font:800 .9rem var(--font);color:#334;transition:.3s}
  .vxR-run b{font:900 1.5rem var(--font);line-height:1;color:#14a37f}
  .vxR-run.re b{color:#2a8fd0}
  .vxR-run.hit{background:#e8f9ff}
  .vxR-card{background:#fff;border:2px solid #d7dbe8;border-radius:12px;padding:10px 12px;display:grid;gap:8px;min-width:0;transition:.3s}
  .vxR-card>.vxR-tt{font:800 .8rem var(--font);color:#667}
  .vxR-li{padding:.45em .8em;border-radius:8px;background:#fff;border:2px solid #d7dbe8;font:800 .95rem var(--font);color:#1f2a44;display:flex;align-items:center;gap:8px;animation:vxRin .35s both}
  .vxR-li i{margin-left:auto;font:800 .8rem var(--mono);color:#667;background:#eef1f8;border-radius:6px;padding:.05em .5em;font-style:normal}
  .vxR-empty{padding:.7em 1em;border-radius:10px;border:2px dashed #e0364d;color:#b3261e;background:#fdecea;font:800 .95rem var(--font);animation:vxRin .35s both}
  .vxR-badge{font:900 .8rem var(--font);padding:.1em .7em;border-radius:99px;background:#14a37f;color:#fff;animation:vxRin .35s both}
  .vxR-wait{color:#667;font:800 .95rem var(--font);animation:vxRp 1s infinite}
  @keyframes vxRin{from{opacity:0;transform:translateY(8px)}}
  @keyframes vxRp{50%{opacity:.35}}
  .vxR-sum{display:grid;gap:14px}
  .vxR-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
  @media(max-width:760px){.vxR-grid{grid-template-columns:1fr}}
  .vxR-g{border:2px solid var(--line);border-radius:14px;background:var(--card);padding:14px;display:grid;gap:10px;animation:vxRin .5s both;transition:.25s}
  .vxR-g:hover{transform:translateY(-3px);border-color:var(--ts)}
  .vxR-g h4{margin:0;font:900 1.05rem var(--font)}
  .vxR-g .two{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .vxR-g .two>div{border-radius:10px;padding:10px;font:700 .95rem/1.5 var(--font);border:2px solid var(--line);transition:.25s}
  .vxR-g .two>div:hover{transform:scale(1.03)}
  .vxR-g .two .v{border-color:color-mix(in srgb,var(--vue) 60%,var(--line));background:color-mix(in srgb,var(--vue) 9%,var(--card))}
  .vxR-g .two .r{border-color:color-mix(in srgb,#61dafb 60%,var(--line));background:color-mix(in srgb,#61dafb 9%,var(--card))}
  .vxR-g .two b{display:block;font:900 .85rem var(--font);margin-bottom:.2em}
  .vxR-g .two .v b{color:var(--vue)}.vxR-g .two .r b{color:#61dafb}
  .vxR-pick{display:flex;align-items:center;gap:12px;padding:14px 18px;border-radius:14px;border:2px solid var(--vue);background:color-mix(in srgb,var(--vue) 12%,var(--card));font:900 1.05rem/1.5 var(--font);animation:vxRin .6s .5s both}
  `);

  const VC = '#42b883', RC = '#61dafb';
  const el = (tag, cls, k, ...c) => { const a = { class: 'vxR-' + cls }; if (k) a['data-k'] = k; return h(tag, a, ...c); };
  const both = (ctx, fn, ...a) => Promise.all(['without', 'with'].map((s) => ctx.ui[s][fn] && ctx.ui[s][fn](...a)));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const rbtn = (label, fn, primary) => ({ label, primary, onclick: fn });
  const resetBtn = { label: '⟲ 最初から', ghost: true, onclick: (c) => c.reset() };
  const vcfg = (o) => Object.assign({ title: 'Vue', icon: '💚', tone: 'vue', lang: 'vue' }, o);
  const rcfg = (o) => Object.assign({ title: 'React', icon: '⚛', tone: 'react', lang: 'vue' }, o);
  const vs = (o) => K.vs.versus(Object.assign({ neutral: true }, o));


  const RCOL = ['#ff6b9d', '#5b9dff', '#ffb454', '#2fd4a4', '#a98bff'];
  /* 左右のコードを「役割」で色分けし、役割・UI・コード行のどれに乗せても、左右の対応行が同時に光る。
     ana = { roles:[{k,label,vue,react,mean}], same:[html], diff:[html] } */
  const vsA = (cfg, ana) => {
    const cap = {};
    ['without', 'with'].forEach((sd) => { const u = cfg[sd].ui; cfg[sd].ui = (c) => { cap.c = c; return u(c); }; });
    const root = vs(cfg), ctx = cap.c, SIDES = ['without', 'with'];
    const roles = ana.roles.map((r, i) => Object.assign({ c: RCOL[i % RCOL.length] }, r));
    const isCm = (t) => /^\s*(\/\/|<!--)/.test(t);
    const roleOf = (side, text) => isCm(text) ? null : roles.find((r) => (ctx.keys[side][r.k] || []).some((t) => text.includes(t)));
    SIDES.forEach((sd) => { ctx.pre[sd].lines.forEach((ln) => { const r = roleOf(sd, ln.textContent); if (r) { ln.classList.add('vxR-rl'); ln.style.setProperty('--rc', r.c); } }); });
    const capEl = h('div', { class: 'vxR-cap' }, '色つきの名前・コード・画面に カーソルを乗せる → 左右の対応する行が光る');
    const chips = roles.map((r) => { const b = h('button', { type: 'button', class: 'vxR-rc', style: { '--rc': r.c } }, r.label); b.dataset.role = r.k; return b; });
    const on = (k) => {
      const r = roles.find((x) => x.k === k);
      SIDES.forEach((sd) => ctx.hi(sd, k));
      chips.forEach((b) => b.classList.toggle('on', b.dataset.role === k));
      if (!r) return;
      capEl.classList.add('on'); capEl.style.setProperty('--rc', r.c);
      capEl.replaceChildren(h('b', r.label + '：'), h('span', { class: 'vv' }, 'Vue '), h('code', r.vue), ' ⇄ ', h('span', { class: 'rr' }, 'React '), h('code', r.react), h('span', {}, '　' + r.mean));
    };
    const off = () => { SIDES.forEach((sd) => ctx.hi(sd, null)); chips.forEach((b) => b.classList.remove('on')); capEl.classList.remove('on'); capEl.textContent = '色つきの名前・コード・画面に カーソルを乗せる → 左右の対応する行が光る'; };
    chips.forEach((b) => { b.addEventListener('mouseenter', () => on(b.dataset.role)); b.addEventListener('mouseleave', off); b.addEventListener('focus', () => on(b.dataset.role)); b.addEventListener('blur', off); });
    root.addEventListener('mouseover', (e) => { const n = e.target.closest && e.target.closest('.vs-ui [data-k]'); if (n && roles.some((r) => r.k === n.dataset.k)) on(n.dataset.k); });
    root.addEventListener('mouseout', (e) => { if (e.target.closest && e.target.closest('.vs-ui [data-k]')) off(); });
    SIDES.forEach((sd) => { const pre = ctx.pre[sd]; pre.lines.forEach((ln) => { ln.addEventListener('mouseenter', () => { const r = roleOf(sd, ln.textContent); if (r) on(r.k); }); ln.addEventListener('mouseleave', off); }); });
    const col = (cls, t, list) => h('div', { class: cls }, h('h5', t), ...list.map((x) => { const c = h('div', { class: 'cc' }); c.innerHTML = x; return c; }));
    return h('div', { class: 'vxR-all' }, root, h('div', { class: 'vxR-roles' }, h('span', { class: 't' }, 'コードの対応'), ...chips), capEl, h('div', { class: 'vxR-sd' }, col('same', '＝ 同じ点', ana.same), col('diff', '≠ ちがう点', ana.diff)));
  };

  const ANA0 = { roles: [{ k: 'state', label: '状態を作る', vue: 'ref(0)', react: 'useState(0)', mean: '初期値 0 の状態' }, { k: 'btn', label: '操作を受ける', vue: '@click', react: 'onClick', mean: '押されたときの処理' }, { k: 'show', label: '画面に出す', vue: '{{ count }}', react: '{count}', mean: '状態を表示する' }], same: ['状態が変わると<b>画面が自動で</b>変わる','画面は<b>状態から</b>つくる','押されたら<b>関数を呼ぶ</b>'], diff: ['<b>ref(0)</b> ⇄ <b>useState(0)</b>','<b>@click</b> ⇄ <b>onClick</b>','<b>{{ }}</b> ⇄ <b>{ }</b>'] };
  const ANA1 = { roles: [{ k: 'state', label: '状態を作る', vue: 'ref(0)', react: 'useState(0)', mean: '状態の入れ物' }, { k: 'write', label: '値を変える', vue: 'count.value++', react: 'setCount(count + 1)', mean: '書き換える ⇄ 新しい値を渡す' }, { k: 'run', label: '関数が動く', vue: '<script setup>', react: 'Counter()', mean: 'Vue は 1回、React は更新のたび' }, { k: 'show', label: '画面に出す', vue: '{{ count }}', react: '{count}', mean: '状態を表示する' }], same: ['値が変わると<b>画面も更新</b>される','変える関数を<b>ボタンに渡す</b>'], diff: ['<b>.value++</b> で書き換え ⇄ <b>setCount</b> に新しい値','関数は <b>1回だけ</b> ⇄ <b>毎回</b> もう一度動く'] };
  const ANA2 = { roles: [{ k: 'items', label: '状態を作る', vue: 'ref<Consult[]>', react: 'useState<Consult[]>', mean: '相談の配列' }, { k: 'if', label: '条件で出す', vue: 'v-if', react: 'items.length === 0 &&', mean: '0件のときだけ表示' }, { k: 'list', label: '繰り返す', vue: 'v-for', react: 'items.map', mean: '配列の数だけ li を作る' }, { k: 'key', label: '目印を付ける', vue: ':key', react: 'key={c.id}', mean: '1件ずつを見分ける' }], same: ['<b>配列</b>の数だけ並べる','<b>条件</b>で出し分ける','繰り返しには <b>key</b> が要る'], diff: ['<b>v-if / v-for</b> ⇄ <b>&amp;&amp; / .map()</b>','HTML に<b>属性</b> ⇄ JS の<b>式</b>','<b>:key</b> ⇄ <b>key=</b>'] };
  const ANA3 = { roles: [{ k: 'send', label: '子へ渡す', vue: ':done="done"', react: 'done={done}', mean: '親から子へ値を渡す' }, { k: 'recv', label: '子が受け取る', vue: 'defineProps', react: 'props（引数）', mean: '子の入口' }, { k: 'emit', label: '親に知らせる', vue: "emit('toggle')", react: 'onClick={onToggle}', mean: '子から親への合図' }, { k: 'listen', label: '親が待つ', vue: '@toggle', react: 'onToggle={() =>', mean: '合図で状態を変える' }], same: ['データは<b>親から子へ</b>','変えるのは<b>親だけ</b>','子は<b>部品</b>として使い回せる'], diff: ['<b>defineProps</b> ⇄ <b>引数</b>で受ける','<b>emit(\'toggle\')</b> ⇄ <b>onToggle()</b> を呼ぶ','<b>@toggle</b> ⇄ <b>onToggle=</b>'] };
  const ANA4 = { roles: [{ k: 'state', label: '状態を作る', vue: 'ref<Case[]>', react: 'useState<Case[]>', mean: '取得したデータの入れ物' }, { k: 'derived', label: '計算する', vue: 'computed(…)', react: 'cases.filter(…)', mean: '件数を数える' }, { k: 'fetch', label: '取得する', vue: 'onMounted', react: 'useEffect', mean: '画面が出た直後に1回' }, { k: 'show', label: '画面に出す', vue: '{{ openCount }}', react: '{openCount}', mean: '計算結果を表示' }], same: ['<b>元のデータ</b>から計算する','表示は<b>状態</b>から','取得は<b>画面が出た後</b>'], diff: ['<b>computed</b> ⇄ <b>ふつうの式</b>','<b>onMounted</b> ⇄ <b>useEffect</b>(…, [])','<b>.value</b> が要る ⇄ 要らない'] };

  /* ================= ① 全体像：同じカウンター ================= */
  function sceneCounter() {
    let tok = 0;
    const mk = (react) => (ctx) => {
      const col = react ? RC : VC;
      let n = 0;
      const btn = el('button', 'btn', 'btn', '予約する');
      const st = el('div', 'chip ' + (react ? 'r' : 'v'), 'state', '🗄 count = ', h('b', '0'));
      const disp = el('div', 'disp', 'show', '予約 0 件');
      const set = () => { st.querySelector('b').textContent = n; disp.textContent = '予約 ' + n + ' 件'; };
      const press = async () => {
        const me = ++tok; n++;
        await ctx.fly(btn, st, react ? 'setCount' : '+1', col);
        st.querySelector('b').textContent = n; ctx.bump(st);
        await ctx.fly(st, disp, String(n), col);
        disp.textContent = '予約 ' + n + ' 件'; ctx.bump(disp);
        return me;
      };
      btn.onclick = press;
      return { el: h('div', { class: 'vxR-col' }, btn, st, disp), press, reset() { n = 0; set(); } };
    };
    return vsA({
      banner: '同じカウンターを、2通りで。',
      bar: [rbtn('▶ 3回 押す', async (ctx) => { ctx.reset(); ctx.banner('押す → 状態が変わる → 画面が変わる。流れは同じ。', 'warn'); for (let i = 0; i < 3; i++) { await both(ctx, 'press'); await sleep(250); } ctx.banner('✓ どちらも「状態 → 画面」。書き方が違うだけ。', 'ok'); }, true), resetBtn],
      without: vcfg({
        file: 'Counter.vue', ui: mk(false),
        src: `<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">予約する</button>
  <p>予約 {{ count }} 件</p>
</template>`,
        keys: { state: ['ref(0)'], btn: ['@click'], show: ['{{ count }}'] },
      }),
      with: rcfg({
        file: 'Counter.tsx', ui: mk(true),
        src: `import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)

  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        予約する
      </button>
      <p>予約 {count} 件</p>
    </>
  )
}`,
        keys: { state: ['useState(0)'], btn: ['onClick'], show: ['{count}'] },
      }),
    }, ANA0);
  }

  /* ================= ② 状態を変える ================= */
  function sceneState() {
    const mk = (react) => (ctx) => {
      const col = react ? RC : VC;
      let n = 0, runs = 1, gen = 0;
      const btn = el('button', 'btn', 'btn', '予約する');
      const st = el('div', 'chip ' + (react ? 'r' : 'v'), 'write', react ? '📦 新しい値を渡す　count = ' : '✏️ 書き換える　count = ', h('b', '0'));
      const run = el('div', 'run' + (react ? ' re' : ''), 'run', react ? '🔁 Counter() の実行回数' : '🔁 setup の実行回数', h('b', '1'), '回');
      const disp = el('div', 'disp', 'show', '予約 0 件');
      const paint = () => { st.querySelector('b').textContent = n; run.querySelector('b').textContent = runs; disp.textContent = '予約 ' + n + ' 件'; };
      const press = async () => {
        const g = ++gen; n++;
        await ctx.fly(btn, st, react ? 'setCount(' + n + ')' : 'count.value++', col);
        if (g !== gen) return;
        st.querySelector('b').textContent = n; ctx.bump(st);
        if (react) { await ctx.fly(st, run, '再実行！', col); if (g !== gen) return; runs++; run.querySelector('b').textContent = runs; ctx.bump(run); }
        await ctx.fly(react ? run : st, disp, '更新', col);
        if (g !== gen) return;
        disp.textContent = '予約 ' + n + ' 件'; ctx.bump(disp);
      };
      btn.onclick = press;
      return { el: h('div', { class: 'vxR-col' }, btn, st, run, disp), press, reset() { gen++; n = 0; runs = 1; paint(); } };
    };
    return vsA({
      banner: '押すたびに、関数は何回 動く？',
      bar: [rbtn('▶ 3回 押す', async (ctx) => { ctx.reset(); ctx.banner('Vue は 1回だけ。React は押すたびに 関数ごと もう一度。', 'warn'); for (let i = 0; i < 3; i++) { await both(ctx, 'press'); await sleep(250); } ctx.banner('✓ Vue：1回　React：4回（最初＋3回）。どちらも画面は同じ。', 'ok'); }, true), resetBtn],
      without: vcfg({
        file: 'Counter.vue', ui: mk(false),
        src: `<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

function add(): void {
  count.value++
}
</script>

<template>
  <button @click="add">予約する</button>
  <p>予約 {{ count }} 件</p>
</template>`,
        keys: { state: ['ref(0)'], run: ['<script setup'], write: ['count.value++'], show: ['{{ count }}'] },
      }),
      with: rcfg({
        file: 'Counter.tsx', ui: mk(true),
        src: `import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)

  function add(): void {
    setCount(count + 1)
  }

  return (
    <>
      <button onClick={add}>予約する</button>
      <p>予約 {count} 件</p>
    </>
  )
}`,
        keys: { state: ['useState(0)'], run: ['export function Counter'], write: ['setCount(count + 1)'], show: ['{count}'] },
      }),
    }, ANA1);
  }

  /* ================= ③ 画面の書き方：if と 繰り返し ================= */
  function sceneList() {
    const DATA = ['離婚の相談', '相続の相談', '労働の相談'];
    const mk = (react) => (ctx) => {
      const col = react ? RC : VC;
      let gen = 0, items = DATA.slice();
      const src = el('div', 'chip ' + (react ? 'r' : 'v'), 'items', '🗄 items = ', h('b', String(items.length)), ' 件');
      const emptyMsg = el('div', 'empty', 'if', '相談はありません');
      const ul = el('div', 'col', 'list');
      const area = h('div', { class: 'vxR-col' }, ul);
      const render = (anim) => {
        src.querySelector('b').textContent = items.length;
        ul.replaceChildren(...items.map((t, i) => { const li = el('div', 'li', 'list', t, el('i', 'k', 'key', (react ? 'key=' : ':key=') + (i + 1))); if (!anim) li.style.animation = 'none'; return li; }));
        if (!items.length) { if (!emptyMsg.isConnected) area.prepend(emptyMsg); } else emptyMsg.remove();
      };
      const clear = async () => {
        const g = ++gen;
        await ctx.fly(src, ul, react ? 'setItems([])' : 'items = []', col);
        if (g !== gen) return;
        items = []; render(true); ctx.bump(src);
      };
      const fill = async () => {
        const g = ++gen; items = []; render(false);
        for (const t of DATA) {
          await ctx.fly(src, ul, t.slice(0, 2), col);
          if (g !== gen) return;
          items.push(t); render(false);
          const last = ul.lastChild; if (last) ctx.bump(last);
        }
      };
      render(false);
      return { el: h('div', { class: 'vxR-col' }, src, area), clear, fill, reset() { gen++; items = DATA.slice(); render(false); } };
    };
    return vsA({
      banner: '配列の数に合わせて、画面を出す。',
      bar: [
        rbtn('✕ 全部消す', async (ctx) => { await both(ctx, 'clear'); ctx.banner('0件のとき「ありません」。条件で出し分けている。', 'warn'); }, true),
        rbtn('＋ もどす', async (ctx) => { await both(ctx, 'fill'); ctx.banner('✓ 配列の数だけ、<li> が並ぶ（key が目印）。', 'ok'); }),
        resetBtn],
      without: vcfg({
        file: 'ConsultList.vue', ui: mk(false),
        src: `<script setup lang="ts">
import { ref } from 'vue'

type Consult = { id: number; title: string }
const items = ref<Consult[]>([
  { id: 1, title: '離婚の相談' },
  { id: 2, title: '相続の相談' },
])
</script>

<template>
  <p v-if="items.length === 0">相談はありません</p>
  <ul>
    <li v-for="c in items" :key="c.id">
      {{ c.title }}
    </li>
  </ul>
</template>`,
        keys: { items: ['ref<Consult[]>'], if: ['v-if'], list: ['v-for'], key: [':key'] },
      }),
      with: rcfg({
        file: 'ConsultList.tsx', ui: mk(true),
        src: `import { useState } from 'react'

type Consult = { id: number; title: string }

export function ConsultList() {
  const [items] = useState<Consult[]>([
    { id: 1, title: '離婚の相談' },
    { id: 2, title: '相続の相談' },
  ])

  return (
    <>
      {items.length === 0 && <p>相談はありません</p>}
      <ul>
        {items.map((c) => (
          <li key={c.id}>{c.title}</li>
        ))}
      </ul>
    </>
  )
}`,
        keys: { items: ['useState<Consult[]>'], if: ['items.length === 0 &&'], list: ['items.map'], key: ['key={c.id}'] },
      }),
    }, ANA2);
  }

  /* ================= ④ 親と子 ================= */
  function sceneParentChild() {
    const mk = (react) => (ctx) => {
      const col = react ? RC : VC;
      let done = false, gen = 0;
      const stateChip = el('div', 'chip ' + (react ? 'r' : 'v'), 'state', '🗄 done = ', h('b', 'false'));
      const send = el('div', 'chip ' + (react ? 'r' : 'v'), 'send', '↓ ', react ? 'done={done}' : ':done="done"');
      const listen = el('div', 'chip ' + (react ? 'r' : 'v'), 'listen', '↑ ', react ? 'onToggle={…}' : '@toggle="…"');
      const badge = el('span', 'badge', null, '済'); badge.hidden = true;
      const title = el('div', 'li', 'recv', '離婚の相談', badge);
      title.style.animation = 'none';
      const btn = el('button', 'btn sm', 'emit', '切り替え');
      const paint = () => { stateChip.querySelector('b').textContent = done; badge.hidden = !done; };
      const press = async () => {
        const g = ++gen;
        await ctx.fly(btn, listen, react ? 'onToggle()' : "emit('toggle')", '#ffb454');
        if (g !== gen) return;
        done = !done; stateChip.querySelector('b').textContent = done; ctx.bump(stateChip);
        await ctx.fly(stateChip, send, 'done=' + done, col);
        if (g !== gen) return;
        await ctx.fly(send, title, 'props', col);
        if (g !== gen) return;
        paint(); ctx.bump(title);
      };
      btn.onclick = press;
      return {
        el: h('div', { class: 'vxR-col' },
          h('div', { class: 'vxR-card' }, h('div', { class: 'vxR-tt' }, '親 ' + (react ? 'ConsultPage' : 'ConsultPage.vue')), stateChip, h('div', { class: 'vxR-row' }, send, listen)),
          h('div', { class: 'vxR-card' }, h('div', { class: 'vxR-tt' }, '子 ' + (react ? 'ConsultCard' : 'ConsultCard.vue')), title, h('div', { class: 'vxR-row' }, btn))),
        press, reset() { gen++; done = false; paint(); },
      };
    };
    return vsA({
      banner: '親 → 子は「渡す」。子 → 親は「知らせる」。',
      bar: [rbtn('▶ 子のボタンを押す', async (ctx) => { ctx.reset(); ctx.banner('① 子が親に知らせる　② 親が状態を変える　③ 新しい値が子に届く', 'warn'); await both(ctx, 'press'); ctx.banner('✓ 子は自分では変えない。親に頼む。Vue も React も同じ。', 'ok'); }, true), resetBtn],
      without: vcfg({
        file: 'ConsultCard.vue ＋ ConsultPage.vue', ui: mk(false),
        src: `<!-- ConsultCard.vue（子） -->
<script setup lang="ts">
defineProps<{ title: string; done: boolean }>()
const emit = defineEmits<{ toggle: [] }>()
</script>

<template>
  <h3>{{ title }}<span v-if="done">済</span></h3>
  <button @click="emit('toggle')">切り替え</button>
</template>

<!-- ConsultPage.vue（親） -->
<script setup lang="ts">
import { ref } from 'vue'
import ConsultCard from './ConsultCard.vue'

const done = ref(false)
</script>

<template>
  <ConsultCard
    title="離婚の相談"
    :done="done"
    @toggle="done = !done"
  />
</template>`,
        keys: { recv: ['defineProps'], emit: ["emit('toggle')", 'defineEmits'], state: ['ref(false)'], send: [':done="done"'], listen: ['@toggle'] },
      }),
      with: rcfg({
        file: 'ConsultCard.tsx ＋ ConsultPage.tsx', ui: mk(true),
        src: `type Props = {
  title: string
  done: boolean
  onToggle: () => void
}

export function ConsultCard(props: Props) {
  const { title, done, onToggle } = props

  return (
    <>
      <h3>{title}{done && '済'}</h3>
      <button onClick={onToggle}>切り替え</button>
    </>
  )
}

export function ConsultPage() {
  const [done, setDone] = useState(false)

  return (
    <ConsultCard
      title="離婚の相談"
      done={done}
      onToggle={() => setDone(!done)}
    />
  )
}`,
        keys: { recv: ['{ title, done, onToggle }'], emit: ['onClick={onToggle}'], state: ['useState(false)'], send: ['done={done}'], listen: ['onToggle={() =>'] },
      }),
    }, ANA3);
  }

  /* ================= ⑤ 計算と副作用 ================= */
  function sceneEffect() {
    const mk = (react) => (ctx) => {
      const col = react ? RC : VC;
      let gen = 0;
      const cls = react ? 'r' : 'v';
      const api = el('div', 'chip ' + cls, 'fetch', '🌐 ', react ? 'useEffect' : 'onMounted', react ? el('small', 'x', 'deps', '[] = 最初の1回だけ') : el('small', 'x', null, '画面に出たとき1回'));
      const cases = el('div', 'chip ' + cls, 'state', '🗄 cases = ', h('b', '[ ]'));
      const open = el('div', 'chip ' + cls, 'derived', react ? '🧮 openCount（毎回 計算）= ' : '🧮 openCount（computed）= ', h('b', '–'));
      const disp = el('div', 'disp', 'show', h('span', { class: 'vxR-wait' }, '読み込み中…'));
      const reset = () => { gen++; cases.querySelector('b').textContent = '[ ]'; open.querySelector('b').textContent = '–'; disp.replaceChildren(h('span', { class: 'vxR-wait' }, '読み込み中…')); };
      const mount = async () => {
        const g = ++gen; reset(); gen = g;
        await ctx.fly(disp, api, 'mount', '#ffb454');
        if (g !== gen) return;
        ctx.bump(api); await sleep(700); if (g !== gen) return;
        await ctx.fly(api, cases, '5件', col);
        if (g !== gen) return;
        cases.querySelector('b').textContent = '5 件'; ctx.bump(cases);
        await ctx.fly(cases, open, 'open だけ', col);
        if (g !== gen) return;
        open.querySelector('b').textContent = '3'; ctx.bump(open);
        await ctx.fly(open, disp, '3', col);
        if (g !== gen) return;
        disp.textContent = '受付中 3 件'; ctx.bump(disp);
      };
      return { el: h('div', { class: 'vxR-col' }, api, cases, open, disp, react ? h('div', { style: { font: '800 .8rem var(--font)', color: '#667' } }, '※ 重い計算だけ useMemo で包む（ふつうは不要）') : null), mount, reset };
    };
    return vsA({
      banner: '画面が開いたとき、データを取って、数える。',
      bar: [rbtn('▶ 画面を開く', async (ctx) => { ctx.banner('① 画面に出る → ② データを取る → ③ 数える → ④ 表示', 'warn'); await both(ctx, 'mount'); ctx.banner('✓ 「取る」は onMounted / useEffect、「数える」は computed / ふつうの式。', 'ok'); }, true), resetBtn],
      without: vcfg({
        file: 'CaseSummary.vue', ui: mk(false),
        src: `<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { fetchCases, type Case } from './api'

const cases = ref<Case[]>([])
const openCount = computed(
  () => cases.value.filter((c) => c.open).length,
)

onMounted(async () => {
  cases.value = await fetchCases()
})
</script>

<template>
  <p>受付中 {{ openCount }} 件</p>
</template>`,
        keys: { state: ['ref<Case[]>'], derived: ['computed(', 'cases.value.filter'], fetch: ['onMounted('], show: ['{{ openCount }}'] },
      }),
      with: rcfg({
        file: 'CaseSummary.tsx', ui: mk(true),
        src: `import { useEffect, useState } from 'react'
import { fetchCases, type Case } from './api'

export function CaseSummary() {
  const [cases, setCases] = useState<Case[]>([])
  const openCount = cases.filter((c) => c.open).length

  useEffect(() => {
    fetchCases().then(setCases)
  }, [])

  return <p>受付中 {openCount} 件</p>
}`,
        keys: { state: ['useState<Case[]>'], derived: ['const openCount'], fetch: ['useEffect('], deps: ['}, [])'], show: ['{openCount}'] },
      }),
    }, ANA4);
  }

  /* ================= ⑥ まとめ ================= */
  function sceneSummary() {
    const ROWS = [
      ['✍️ 書き方', 'テンプレート（HTML に近い）に書き足す', 'JavaScript の中に、画面（JSX）を書く'],
      ['📘 学びやすさ', '決まった型があり、迷いにくい', 'JavaScript の知識が、そのまま効く'],
      ['🧰 周辺ツール', '公式が用意（Router・Pinia など）', '選択肢が多い（Next.js など）'],
      ['🎯 向いている場面', 'チームで書き方をそろえたい画面づくり', '大規模開発・スマホアプリ（React Native）にも広げたい'],
    ];
    const root = h('div', { class: 'vxR-sum' },
      h('div', { class: 'vxR-grid' }, ...ROWS.map((r, i) => h('div', { class: 'vxR-g', style: { animationDelay: i * 0.15 + 's' } },
        h('h4', r[0]),
        h('div', { class: 'two' }, h('div', { class: 'v' }, h('b', '💚 Vue'), r[1]), h('div', { class: 'r' }, h('b', '⚛ React'), r[2]))))),
      h('div', { class: 'vxR-pick' }, h('span', { style: { fontSize: '1.6rem' } }, '💚'), h('span', {}, 'どちらも「状態が変わると、画面が変わる」。この研修は ', h('b', { style: { color: 'var(--vue)' } }, 'Vue'), ' で進める。')));
    return root;
  }

  const S = (t, lead, render) => ({ t, lead, render(el) { el.append(render()); } });
  K.reg({
    id: 'x-vue-react', track: 'extra', title: 'Vue と React の違い', sub: '同じ画面を、2通りで書いてみる', emoji: '⚖️',
    meta: { cat: 'vue', day: '4日目', when: 'Vue 紹介のあと（他のフレームワークも気になったとき）', mins: 15, order: 31, level: '任意', after: 'vue-intro', why: '現場では React の人と話す機会がある。同じ画面を並べて、考え方は同じ・書き方が違うことだけつかむ' },
    scenes: [
      S('全体像：同じカウンター', 'Vue は <b>テンプレート</b>に書き足す。React は <b>JavaScript の中</b>に画面を書く。', sceneCounter),
      S('状態を変える', 'Vue は値を<b>書き換える</b>。React は<b>新しい値を渡す</b>（関数ごと もう一度動く）。', sceneState),
      S('画面の書き方', 'Vue は <b>v-if / v-for</b> をタグに付ける。React は <b>&amp;&amp; / .map()</b> を JavaScript で書く。', sceneList),
      S('親と子', 'Vue は <b>emit</b> で知らせる。React は<b>関数を props で渡して</b>呼んでもらう。', sceneParentChild),
      S('計算と副作用', '計算は Vue が <b>computed</b>、React は<b>ふつうの式</b>。画面が出た直後は <b>onMounted</b> と <b>useEffect</b>。', sceneEffect),
      S('まとめ：どう選ぶ？', 'どちらが上ではなく、<b>向き不向き</b>。考え方は同じ。', sceneSummary),
    ],
  });
})();
