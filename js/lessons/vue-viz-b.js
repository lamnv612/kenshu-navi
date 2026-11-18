/* 使い分け：computed / method / watch / フック — 画面・コード・アニメーションで選ぶ */
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
    if (L.__vzB) return;
    const scene = L.scenes.find((s) => s.t === '使い分け：computed / method / watch / フック');
    if (!scene) return;
    L.__vzB = 1;
    const { h, code, style } = K.W;
    const yen = (n) => n.toLocaleString('ja-JP') + '円';
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const RATE = 5500;

    /* ---- シナリオ ---- */
    const OPT = {
      computed: ['computed', '値を作る', 'var(--vue)'],
      method: ['method', '押したら実行', 'var(--pink)'],
      watch: ['watch', '変わったら反応', 'var(--ts)'],
      hook: ['フック', '出る・消えるとき', 'var(--team)'],
    };
    const Q = [
      { t: '人数を変えたら、合計金額も自動で変わってほしい', ans: 'computed', reg: 'total', ph: '// ①  ？？？', line: 'const total = computed(() => people.value * hours.value * RATE)', why: '人数・時間から「作る値」。材料が変わると自動で再計算される。',
        ng: { method: '関数は呼ばれたときだけ動く。人数を変えても合計は古いまま。', watch: '動くけれど遠回り。値を作るだけなら computed が一番短い。', hook: '表示した瞬間に1回だけ。人数を変えても合計は変わらない。' } },
      { t: '「保存」ボタンを押したら、見積りを保存したい', ans: 'method', reg: 'save', ph: '// ②  ？？？', line: 'const save = () => api.saveEstimate(total.value)', why: '押されたときに動かす処理は、ただの関数（method）。',
        ng: { computed: 'computed は値を返すだけ。押しても何も実行されない。', watch: 'watch は「値の変化」を見るもの。ボタンは見ていない。', hook: '画面ができた瞬間に動く。押していないのに保存されてしまう。' } },
      { t: '検索ワードが変わったら、API を呼びたい', ans: 'watch', reg: 'list', ph: '// ③  ？？？', line: 'watch(keyword, (kw) => searchApi(kw))', why: '「変わったら、ついでに処理」は watch。通信は computed に書かない。',
        ng: { computed: 'computed は値を作るだけ。通信（副作用）は置かない。API は呼ばれない。', method: '誰も呼ばないと動かない。入力が変わっても API は 0 回のまま。', hook: '開いた直後の1回だけ。ワードを変えても再検索されない。' } },
      { t: '画面が開いた直後に、弁護士の一覧を取得したい', ans: 'hook', sub: 'onMounted', reg: 'list', ph: '// ④  ？？？', line: 'onMounted(async () => { lawyers.value = await fetchAll() })', why: '画面にできた直後に1回だけ動く。',
        ng: { computed: '誰も取得を呼ばない。一覧は空のまま。', method: '関数は呼ばれて初めて動く。開いただけでは空のまま。', watch: '値が変わるまで動かない。開いただけでは空のまま。' } },
      { t: '画面を離れるとき、ポーリングのタイマーを止めたい', ans: 'hook', sub: 'onUnmounted', reg: 'timer', ph: '// ⑤  ？？？', line: 'onUnmounted(() => clearInterval(timerId))', why: '消えるときに後片付け。止め忘れると裏で動き続ける。',
        ng: { computed: '離れるタイミングを知らない。タイマーは動き続ける。', method: '誰も呼ばない。離れてもタイマーは動き続ける。', watch: '値が変わらなければ動かない。タイマーは動き続ける。' } },
    ];
    const SUBNG = { 3: 'onUnmounted は「消えるとき」。開いた直後は onMounted。', 4: 'onMounted は「できたとき」。離れるときは onUnmounted。' };
    const NUM = '①②③④⑤';
    const lawyers = ['山田 太郎　相続・遺言', '佐藤 花子　相続・離婚', '鈴木 一郎　労働・相続'];

    const S = {}; const solved = Q.map(() => false);
    let cur = 0, busy = false, seen = false;
    const resetState = () => { Object.assign(S, { people: 2, hours: 1, shown: 2 * 1 * RATE, saved: '未保存', keyword: '', calls: 0, list: [], timer: 'idle', ticks: 0, left: false }); };
    resetState();
    const setup = (i) => {
      if (i === 0) { S.people = 2; S.hours = 1; S.shown = 2 * RATE; }
      if (i === 1) S.saved = '未保存';
      if (i === 2) { S.keyword = ''; S.list = []; S.calls = 0; }
      if (i === 3) { S.keyword = ''; S.list = []; }
      if (i === 4) { S.timer = 'run'; S.left = false; }
    };

    /* ---- 左：見積りページ ---- */
    const regs = {}, pins = [];
    const reg = (key, i, cls, ...kids) => {
      const p = h('span', { class: 'vzB-pin', onclick: () => go(i) }, NUM[i]); pins[i] = p;
      const r = h('div', { class: 'vzB-r ' + cls, 'data-k': key }, ...kids, p); regs[key] = r; return r;
    };
    const el = {};
    const mk = (k, tag, cls, txt) => { const e = h(tag, { class: cls }, txt); el[k] = e; return e; };
    const stepper = (label, key, min, max) => h('div', { class: 'vzB-num', 'data-k': key }, h('small', label),
      h('div', null, h('button', { onclick: () => poke(key, -1, min, max) }, '−'), mk(key, 'b', '', ''), h('button', { onclick: () => poke(key, 1, min, max) }, '＋')));
    const poke = (key, d, min, max) => {
      if (busy) return;
      S[key] = Math.max(min, Math.min(max, S[key] + d));
      if (solved[0]) { S.shown = S.people * S.hours * RATE; bump(el.shown); }
      bump(el[key]); view();
    };
    const hdUrl = mk('url', 'span', 'vzB-url', 'kenshu.example/estimate');
    const total = reg('total', 0, 'tt', h('small', '合計金額'), mk('shown', 'b', 'vzB-big', ''), mk('stale', 'em', 'vzB-stale', ''));
    const save = reg('save', 1, 'sv', h('button', { class: 'vzB-btn', onclick: () => { if (!busy) { bump(save); } } }, '保存'), mk('saved', 'span', 'vzB-sd', ''));
    const search = h('div', { class: 'vzB-in', 'data-k': 'kw' }, h('span', '🔎 '), mk('kw', 'b', '', ''), mk('kwph', 'span', 'ph', '弁護士を検索'));
    const list = reg('list', 2, 'ls', h('div', { class: 'vzB-lh' }, search, mk('calls', 'small', 'vzB-calls', '')), mk('items', 'div', 'vzB-items', ''));
    const timer = reg('timer', 4, 'tm', h('span', '🔄 新着チェック（1秒ごと）'), mk('tick', 'b', 'vzB-tk', ''));
    el.items.setAttribute('data-k', 'items'); regs.list.removeAttribute('data-k');
    list.dataset.n = '③④'; /* 一覧は ③④ 共用 */
    const pin4 = h('span', { class: 'vzB-pin p2', onclick: () => go(3) }, NUM[3]); pins[3] = pin4; list.append(pin4);
    const body = h('div', { class: 'vzB-body' },
      h('div', { class: 'vzB-two' }, stepper('人数', 'people', 1, 9), stepper('時間', 'hours', 1, 9)), total, save, list, timer);
    const gone = h('div', { class: 'vzB-gone' }, '→ 別のページへ移動しました');
    const pg = h('div', { class: 'vzB-pg' },
      h('div', { class: 'vzB-hd' }, '⚖ 相談の料金見積り', hdUrl), body, gone);
    const strip = h('div', { class: 'vzB-strip' });
    const chip = (k, v, c) => h('span', { class: 'vzB-chip' + (c ? ' ' + c : '') }, k + ' = ', h('b', v));
    const view = () => {
      el.people.textContent = S.people; el.hours.textContent = S.hours;
      el.shown.textContent = yen(S.shown);
      const real = S.people * S.hours * RATE, st = S.shown !== real;
      el.stale.textContent = st ? '⚠ 古い値！ 本当は ' + yen(real) : '';
      regs.total.classList.toggle('stale', st);
      el.saved.textContent = S.saved; el.saved.classList.toggle('ok', S.saved !== '未保存');
      el.kw.textContent = S.keyword; el.kwph.style.display = S.keyword ? 'none' : '';
      el.calls.textContent = 'API ' + S.calls + ' 回';
      el.items.replaceChildren(...(S.list.length ? S.list.map((t) => h('div', { class: 'vzB-it' }, '👨‍⚖️ ' + t)) : [h('div', { class: 'vzB-it none' }, '（まだ空）')]));
      el.tick.textContent = S.timer === 'run' ? '● 動作中 ' + S.ticks + ' 回' : S.timer === 'stop' ? '■ 停止 ' + S.ticks + ' 回' : '待機中';
      el.tick.className = 'vzB-tk ' + S.timer;
      body.classList.toggle('left', S.left); gone.classList.toggle('on', S.left);
      strip.replaceChildren(chip('people', S.people), chip('total(表示)', yen(S.shown), st ? 'bad' : ''), chip('saved', S.saved === '未保存' ? 'false' : 'true'), chip('keyword', '"' + S.keyword + '"'), chip('api', S.calls + '回'), chip('lawyers', S.list.length + '件'), chip('timer', S.timer === 'run' ? '動作中' : S.timer === 'stop' ? '停止' : '—', S.timer === 'run' && S.left ? 'bad' : ''));
    };
    const tickId = setInterval(() => {
      if (pg.isConnected) seen = true; else if (seen) { clearInterval(tickId); return; }
      if (S.timer === 'run') { S.ticks++; view(); }
    }, 1000);

    /* ---- アニメ部品（techniques from 実例：どの部品に何を渡す？） ---- */
    const bump = (e) => { if (!e) return; e.classList.remove('bump'); void e.offsetWidth; e.classList.add('bump'); };
    const pop = (r, text, bad) => { r.dataset.pop = text; r.classList.remove('popOk', 'popNg'); void r.offsetWidth; r.classList.add(bad ? 'popNg' : 'popOk'); setTimeout(() => r.classList.remove('popOk', 'popNg'), 2300); };
    const fly = async (from, to, text, col) => {
      const pr = pg.getBoundingClientRect(), a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
      const e = h('span', { class: 'vzB-pkt', style: { background: col } }, text); pg.append(e);
      const w = e.offsetWidth, hh = e.offsetHeight;
      const pt = (r) => ({ x: r.left - pr.left + r.width / 2 - w / 2, y: r.top - pr.top + r.height / 2 - hh / 2 });
      const A = pt(a), B = pt(b);
      try { await e.animate([{ transform: `translate(${A.x}px,${A.y}px) scale(.6)`, opacity: 0 }, { transform: `translate(${A.x}px,${A.y}px) scale(1)`, opacity: 1, offset: .15 }, { transform: `translate(${B.x}px,${B.y}px) scale(1)`, opacity: 1, offset: .85 }, { transform: `translate(${B.x}px,${B.y}px) scale(.6)`, opacity: 0 }], { duration: 1000, easing: 'ease-in-out' }).finished; } catch (x) { /* 途中で消えてもよい */ }
      e.remove();
    };
    const typeKw = async () => { for (const c of ['相', '相続']) { S.keyword = c; view(); await sleep(260); } };
    const items = async () => { for (let i = 1; i <= 3; i++) { S.list = lawyers.slice(0, i); view(); await sleep(260); } };

    /* ---- 正解のデモ ---- */
    const good = {
      0: async () => { S.people = 3; bump(el.people); view(); await fly(el.people, el.shown, '人数 = 3', 'var(--vue)'); S.shown = 3 * RATE; view(); bump(regs.total); pop(regs.total, '自動で再計算 ✓'); },
      1: async () => { bump(regs.save); await fly(regs.save.querySelector('button'), el.saved, 'save()', 'var(--pink)'); S.saved = '✓ 保存しました'; view(); bump(el.saved); pop(regs.save, '押したら実行 ✓'); },
      2: async () => { await typeKw(); await fly(regs.list.querySelector('.vzB-in'), el.items, "searchApi('相続')", 'var(--ts)'); S.calls++; S.list = lawyers.slice(0, 2); view(); bump(regs.list); pop(regs.list, 'ワードが変わるたび自動で検索 ✓'); },
      3: async () => { await fly(hdUrl, el.items, 'fetchAll()', 'var(--team)'); await items(); bump(regs.list); pop(regs.list, '開いた直後に1回 ✓'); },
      4: async () => { S.left = true; view(); await sleep(500); await fly(gone, el.tick, 'clearInterval', 'var(--team)'); S.timer = 'stop'; view(); bump(regs.timer); pop(regs.timer, '離れるとき止まった ✓'); await sleep(900); S.left = false; view(); },
    };
    /* ---- 不正解のデモ：画面で何が困るかを見せる ---- */
    const staleDemo = async () => { const o = S.people; S.people = 3; bump(el.people); view(); bump(regs.total); pop(regs.total, '合計が変わらない ✖', 1); await sleep(2300); S.people = o; view(); };
    const bad = {
      '0.method': staleDemo, '0.hook': staleDemo,
      '0.watch': async () => { bump(regs.total); },
      '1.computed': async () => { bump(regs.save); pop(regs.save, '押しても何も起きない ✖', 1); },
      '1.watch': async () => { bump(regs.save); pop(regs.save, '押しても何も起きない ✖', 1); },
      '1.hook': async () => { S.saved = '✓ 勝手に保存'; view(); pop(regs.save, '押してないのに保存 ✖', 1); await sleep(2300); S.saved = '未保存'; view(); },
      '2.computed': async () => { await typeKw(); pop(regs.list, 'API 0回 → 検索されない ✖', 1); await sleep(2100); S.keyword = ''; view(); },
      '2.method': async () => { await typeKw(); pop(regs.list, 'API 0回 → 検索されない ✖', 1); await sleep(2100); S.keyword = ''; view(); },
      '2.hook': async () => { await typeKw(); pop(regs.list, 'ワードを変えても再検索なし ✖', 1); await sleep(2100); S.keyword = ''; view(); },
      '3.computed': async () => { pop(regs.list, '誰も取得しない → 空のまま ✖', 1); },
      '3.method': async () => { pop(regs.list, '誰も呼ばない → 空のまま ✖', 1); },
      '3.watch': async () => { pop(regs.list, '値が変わらない → 空のまま ✖', 1); },
      '4': async () => { S.left = true; view(); pop(regs.timer, '離れても動き続ける ✖', 1); await sleep(2500); S.left = false; view(); },
    };
    const badFor = (i, k) => bad[i + '.' + k] || bad[String(i)];

    /* ---- 右：問題 ---- */
    const qBox = h('div', { class: 'vzB-q' }), codeHost = h('div'), dots = h('div', { class: 'vzB-dots' });
    let picked = null; /* フックを選んだあとの2択 */
    const SRC = () => {
      const f = (i) => (solved[i] ? Q[i].line : Q[i].ph);
      return ['<script setup lang="ts">', "import { ref, computed, watch, onMounted, onUnmounted } from 'vue'", "import type { Lawyer } from '@/types/lawyer'", '', 'const people = ref(2)', 'const hours = ref(1)', 'const RATE = 5500', "const keyword = ref('')", 'const lawyers = ref<Lawyer[]>([])', 'let timerId = 0', '', f(0), f(1), f(2), f(3), 'onMounted(() => { timerId = window.setInterval(poll, 1000) })', f(4), '</scr' + 'ipt>'].join('\n');
    };
    const LN = [12, 13, 14, 15, 17];
    const cp = { cur: null, get lines() { return this.cur.lines; }, setHi(a, c) { this.cur.setHi(a, c); } };
    const MAP = { people: ['const people'], hours: ['const hours'], total: ['const total', '// ①'], save: ['const save', '// ②'], kw: ['const keyword', 'watch(keyword', '// ③'], items: ['const lawyers', 'onMounted(async', '// ④'], timer: ['let timerId', 'setInterval', 'onUnmounted(', '// ⑤'] };
    const draw = () => {
      const q = Q[cur], ok = solved[cur];
      const btn = (k) => {
        const b = h('button', { class: 'vzB-a' + (ok && k === q.ans ? ' on' : ''), style: { '--c': OPT[k][2] } }, h('b', OPT[k][0]), h('small', OPT[k][1]));
        b.onclick = () => answer(k, b); return b;
      };
      const sub = picked === 'hook' && !ok ? h('div', { class: 'vzB-sub' }, h('span', 'どのフック？'), ...['onMounted', 'onUnmounted'].map((n) => h('button', { class: 'vzB-s', onclick: () => answerSub(n) }, n))) : null;
      qBox.replaceChildren(
        h('div', { class: 'vzB-qh' }, h('span', { class: 'n' }, NUM[cur]), h('small', 'こう したい →')),
        h('div', { class: 'vzB-qt' }, q.t),
        h('div', { class: 'vzB-ans' }, ...['computed', 'method', 'watch', 'hook'].map(btn)),
        ...(sub ? [sub] : []),
        h('div', { class: 'vzB-fb' + (ok ? ' ok' : '') }, ok ? '✓ ' + (q.sub ? q.sub + '：' : '') + q.why : '左の ' + NUM[cur] + ' を見て、道具を選ぼう'));
      const np = code(SRC(), 'ts', { color: 'var(--ts)', file: 'EstimatePage.vue', dim: true, edit: false });
      np.setHi([LN[cur]], 'on'); codeHost.replaceChildren(np); cp.cur = np;
      K.vs.link(pg, cp, MAP, { rest: () => [LN[cur]] });
    };
    const paint = () => {
      pins.forEach((p, i) => { p.className = 'vzB-pin' + (i === 3 ? ' p2' : '') + (solved[i] ? ' ok' : '') + (i === cur ? ' cur' : ''); });
      Object.keys(regs).forEach((k) => { const r = regs[k], idx = Q.findIndex((q) => q.reg === k); const ids = Q.map((q, i) => q.reg === k ? i : -1).filter((i) => i >= 0); r.classList.toggle('cur', ids.includes(cur)); r.classList.toggle('ok', ids.every((i) => solved[i])); void idx; });
      dots.replaceChildren(...Q.map((_, i) => h('i', { class: (solved[i] ? 'ok ' : '') + (i === cur ? 'cur' : ''), onclick: () => go(i) })), h('span', solved.every(Boolean) ? '🎉 全部そろった！' : solved.filter(Boolean).length + ' / ' + Q.length));
      view(); draw();
    };
    const go = (i) => { if (busy) return; cur = i; picked = null; if (!solved[i]) setup(i); paint(); };
    const win = async () => {
      busy = true; solved[cur] = true; picked = null; paint();
      const i = cur; try { await good[i](); } catch (e) { /* ignore */ }
      busy = false; view();
      const nx = solved.findIndex((v) => !v);
      if (nx >= 0) setTimeout(() => { if (cur === i && !busy) go(nx); }, 1200);
    };
    const fail = async (msg, i, k, b) => {
      b && b.classList.add('x');
      const fb = qBox.querySelector('.vzB-fb'); fb.className = 'vzB-fb ng'; fb.textContent = '✖ ' + msg;
      qBox.classList.remove('shake'); void qBox.offsetWidth; qBox.classList.add('shake');
      const d = k && badFor(i, k); if (d) { busy = true; try { await d(); } catch (e) { /* ignore */ } busy = false; view(); }
    };
    const answer = (k, b) => {
      if (solved[cur] || busy) return;
      const q = Q[cur];
      if (k === 'hook' && q.ans === 'hook') { picked = 'hook'; draw(); return; }
      if (k === q.ans) return win();
      fail(q.ng[k], cur, k, b);
    };
    const answerSub = (n) => {
      if (busy) return; const q = Q[cur];
      if (n === q.sub) return win();
      fail(SUBNG[cur], cur, cur === 4 ? 'hook' : null, null);
    };
    const reset = h('button', { class: 'btn ghost', onclick: () => { if (busy) return; solved.fill(false); resetState(); cur = 0; picked = null; paint(); } }, '⟲ やり直す');
    const render = (host) => {
      host.append(h('div', { class: 'vzB-wrap' }, h('div', { class: 'vzB-bar' }, dots, h('span', { style: { flex: 1 } }), reset),
        h('div', { class: 'vi-eq' },
          h('div', { class: 'vzB-wrap vzB-left' }, h('div', { class: 'vi-lb' }, '👀 見積りページ（ピン ①〜⑤ が場面）'), pg, strip),
          h('div', { class: 'vzB-wrap' }, qBox, codeHost))));
      paint();
    };

    style('vslHot', '[data-k].vs-hot{outline:2px solid var(--c,#2f7bff)!important;outline-offset:2px;background-color:color-mix(in srgb,var(--c,#2f7bff) 14%,transparent)}');
    style('vzB', `
    .vzB-wrap{display:grid;gap:12px;min-width:0}.vzB-wrap>*{min-width:0}
    .vzB-left{align-self:start}
    .vzB-bar{display:flex;align-items:center;gap:10px}
    .vzB-pg{position:relative;background:#f4f6fb;color:#223;border-radius:14px;padding:14px;display:grid;gap:12px}
    .vzB-hd{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-radius:10px;background:#1d2b53;color:#fff;font:900 1rem var(--font)}
    .vzB-url{font:700 .85rem var(--mono);opacity:.8}
    .vzB-body{display:grid;gap:14px;transition:.3s}
    .vzB-body.left{opacity:.3;filter:grayscale(.7)}
    .vzB-body.left .vzB-r.tm{opacity:1;filter:none}
    .vzB-gone{display:none;position:absolute;left:14px;right:14px;top:62px;padding:.5em 1em;border-radius:10px;background:#1d2b53;color:#fff;font:900 .95rem var(--font);text-align:center;z-index:4}
    .vzB-gone.on{display:block}
    .vzB-two{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .vzB-num{background:#fff;border:1px solid #d7dbe8;border-radius:10px;padding:8px 12px;display:grid;gap:4px}
    .vzB-num small{font:800 .85rem var(--font);color:#667}
    .vzB-num div{display:flex;align-items:center;justify-content:space-between}
    .vzB-num b{font:900 1.5rem var(--mono)}
    .vzB-num button{width:34px;height:34px;border-radius:8px;border:1px solid #cdd3e3;background:#eef1f8;color:#223;font:900 1.1rem var(--font);cursor:pointer}
    .vzB-r{position:relative;border-radius:10px;outline:2px dashed transparent;outline-offset:3px;transition:outline-color .2s,background .2s}
    .vzB-r.cur{outline-color:var(--ts);animation:vzBp 1.4s ease-in-out infinite}
    .vzB-r.ok{outline:2px solid var(--ok);animation:none}
    @keyframes vzBp{50%{outline-color:transparent}}
    .vzB-r.tt{background:#fff;border:1px solid #d7dbe8;padding:10px 14px;display:flex;align-items:baseline;gap:12px;flex-wrap:wrap}
    .vzB-r.tt small{font:800 .9rem var(--font);color:#667}
    .vzB-big{font:900 1.9rem var(--mono);color:#1d2b53}
    .vzB-stale{display:none;font:900 .9rem var(--font);color:#fff;background:var(--bad);border-radius:99px;padding:.15em .8em;font-style:normal}
    .vzB-r.stale .vzB-stale{display:inline-block}.vzB-r.stale .vzB-big{color:var(--bad);text-decoration:line-through}
    .vzB-r.sv{display:flex;align-items:center;gap:14px;padding:4px}
    .vzB-btn{border:0;border-radius:10px;padding:.7em 1.8em;background:#2f7bff;color:#fff;font:900 1.05rem var(--font);cursor:pointer}
    .vzB-sd{font:900 .95rem var(--font);color:#889}.vzB-sd.ok{color:#18915a}
    .vzB-r.ls{background:#fff;border:1px solid #d7dbe8;padding:12px;display:grid;gap:10px}
    .vzB-lh{display:flex;gap:10px;align-items:center;justify-content:space-between}
    .vzB-in{flex:1;display:flex;gap:4px;align-items:center;padding:.5em .8em;border:1px solid #cdd3e3;border-radius:8px;font:700 1rem var(--font);background:#f7f8fc}
    .vzB-in .ph{color:#99a;font-size:.9rem}
    .vzB-calls{font:900 .85rem var(--mono);color:#556;padding:.2em .6em;border-radius:7px;background:#eef1f8}
    .vzB-items{display:grid;gap:6px}
    .vzB-it{padding:.5em .8em;border-radius:8px;background:#f1f4fb;border:1px solid #dde;font:800 .9rem var(--font);animation:vzBi .35s both}
    .vzB-it.none{color:#99a;background:transparent;border-style:dashed}
    @keyframes vzBi{from{opacity:0;transform:translateY(5px)}}
    .vzB-r.tm{display:flex;justify-content:space-between;align-items:center;background:#fff;border:1px solid #d7dbe8;padding:10px 14px;font:800 .95rem var(--font)}
    .vzB-tk{font:900 .95rem var(--mono);padding:.15em .7em;border-radius:99px;background:#eef1f8;color:#556}
    .vzB-tk.run{background:#dff5e8;color:#18915a}.vzB-tk.stop{background:#e4e6ee;color:#556}
    .vzB-body.left .vzB-tk.run{background:var(--bad);color:#fff}
    .vzB-pin{position:absolute;top:-11px;right:-8px;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:#8a93ad;color:#fff;font:900 .8rem var(--font);cursor:pointer;z-index:2;transition:.2s}
    .vzB-pin.p2{right:20px}
    .vzB-pin.cur{background:var(--ts);transform:scale(1.2);box-shadow:0 0 0 4px color-mix(in srgb,var(--ts) 30%,transparent)}
    .vzB-pin.ok{background:var(--ok);transform:none;box-shadow:none}
    .vzB-r.popOk::after,.vzB-r.popNg::after{content:attr(data-pop);position:absolute;left:50%;top:-34px;transform:translateX(-50%);padding:.2em .9em;border-radius:99px;font:900 .9rem var(--font);white-space:nowrap;z-index:5;animation:vzBf 2.3s both;color:#06101f}
    .vzB-r.popOk::after{background:var(--ok)}.vzB-r.popNg::after{background:var(--bad);color:#fff}
    @keyframes vzBf{0%{opacity:0;margin-top:10px}12%{opacity:1;margin-top:0}85%{opacity:1}100%{opacity:0}}
    .vzB-pkt{position:absolute;left:0;top:0;z-index:9;padding:.3em 1em;border-radius:99px;color:#06101f;font:900 .9rem var(--mono);box-shadow:0 6px 18px rgba(0,0,0,.35);pointer-events:none;white-space:nowrap}
    .bump{animation:vzBb .7s}@keyframes vzBb{30%{transform:scale(1.1);box-shadow:0 0 0 5px color-mix(in srgb,var(--ok) 45%,transparent)}}
    .vzB-strip{display:flex;flex-wrap:wrap;gap:8px}
    .vzB-chip{padding:.25em .7em;border-radius:8px;background:var(--card);border:1px solid var(--line);font:700 .85rem var(--mono);color:var(--mute)}
    .vzB-chip b{color:var(--ts)}.vzB-chip.bad{border-color:var(--bad)}.vzB-chip.bad b{color:var(--bad)}
    .vzB-dots{display:flex;gap:8px;align-items:center}
    .vzB-dots i{width:14px;height:14px;border-radius:50%;background:var(--line);cursor:pointer;transition:.2s}
    .vzB-dots i.cur{background:var(--ts);transform:scale(1.3)}.vzB-dots i.ok{background:var(--ok)}
    .vzB-dots span{margin-left:8px;font:900 .9rem var(--mono);color:var(--mute)}
    .vzB-q{border:2px solid var(--ts);border-radius:14px;background:var(--card);padding:16px 18px;display:grid;gap:12px}
    .vzB-q.shake{animation:vzBs .35s}@keyframes vzBs{25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}
    .vzB-qh{display:flex;gap:10px;align-items:center}.vzB-qh .n{width:30px;height:30px;border-radius:50%;background:var(--ts);color:#06101f;display:grid;place-items:center;font:900 1rem var(--font)}
    .vzB-qh small{font:800 .9rem var(--font);color:var(--mute)}
    .vzB-qt{font:900 1.3rem/1.6 var(--font)}
    .vzB-ans{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
    .vzB-a{display:grid;gap:2px;justify-items:center;padding:.8em .4em;border-radius:12px;border:2px solid var(--c);background:transparent;color:var(--c);cursor:pointer;transition:.15s}
    .vzB-a b{font:900 1.2rem var(--mono)}.vzB-a small{font:700 .85rem var(--font);opacity:.9}
    .vzB-a:hover{background:color-mix(in srgb,var(--c) 16%,transparent)}
    .vzB-a.on{background:var(--c);color:#06101f}
    .vzB-a.x{opacity:.35;text-decoration:line-through}
    .vzB-sub{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
    .vzB-sub span{font:800 .9rem var(--font);color:var(--mute)}
    .vzB-s{padding:.45em 1.1em;border-radius:99px;border:2px solid var(--team);background:transparent;color:var(--team);font:900 .95rem var(--mono);cursor:pointer}
    .vzB-s:hover{background:color-mix(in srgb,var(--team) 16%,transparent)}
    .vzB-fb{font:800 .95rem/1.6 var(--font);color:var(--mute);min-height:1.6em}
    .vzB-fb.ok{color:var(--ok)}.vzB-fb.ng{color:var(--bad)}
    `);

    scene.lead = '場面ごとに、<b>computed / method / watch / フック</b> から選ぶ。外れると、画面で何が困るかが見える。';
    scene.tag = '選び方';
    delete scene.why; delete scene.pickQuiz; delete scene.quiz;
    scene.render = (host) => render(host);
  }
})();
