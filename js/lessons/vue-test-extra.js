/* Vue 単体テスト：コマンドの使い方（メイン教材 vue-test の一部。2番目に入る）
   Vim レッスンと同じ見せ方：コマンドを「キーカード」にして並べ、押すと、ライブの砂場（にせものの部品 ＋ テストファイル ＋ 実行結果）で動く。
   砂場の wrapper は、このファイルの中の手書きの「にせもの」（VTU 2 / Vitest と同じ API 名）。実物のテストは動かさない。
   シーン：描く / 探す / 操作する / 確かめる / にせものを使う / 骨組み / 実践 */
(function () {
  'use strict';
  const K = window.KENSHU;
  if (!K || !K.W || !K.reg) return;
  const { h, code, style } = K.W;
  const reg = (o) => K.reg(Object.assign({ track: 'extra' }, o));
  const TS = 'var(--ts)', PINK = 'var(--pink)', TEAM = 'var(--team)', VUE = 'var(--vue)';

  style('vxU', `
  .vxU{display:grid;gap:14px;min-width:0}
  .vxU code{font:800 .86rem var(--mono);color:var(--vue)}
  .vxU-bar{display:flex;gap:10px;flex-wrap:wrap;align-items:stretch}
  .vxU-bar .btn{height:42px;padding:0 1.1em;font-size:.88rem}
  .vxU-say{flex:1;min-width:240px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;min-height:42px;padding:6px 16px;border-radius:12px;border:2px solid var(--line);background:var(--card);font:800 .88rem/1.55 var(--font);transition:.25s}
  .vxU-say.bad{border-color:var(--bad);color:var(--bad)}.vxU-say.ok{border-color:var(--ok)}
  .vxU-stage{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:14px;align-items:stretch}
  @media(max-width:980px){.vxU-stage{grid-template-columns:1fr}}
  .vxU-box{border:2px solid var(--line);border-radius:14px;background:var(--card);padding:12px;display:flex;flex-direction:column;gap:10px;min-width:0}
  .vxU-tt{font:900 .92rem var(--font);display:flex;gap:8px;align-items:center;flex-wrap:wrap}
  pre.code .ln.vxU-hot,.vxU-hot{outline:3px solid var(--hc,#ff6b9d)!important;outline-offset:2px}
  pre.code.dim .ln.vxU-hot{opacity:1}
  pre.code .ln.vxU-cur{opacity:1;background:color-mix(in srgb,var(--c,#ffb454) 26%,transparent);border-left-color:var(--c,#ffb454)}
  pre.code .ln[data-k]{cursor:pointer}
  .vxU-ui{border-radius:12px;background:#f4f6fb;color:#1f2a44;padding:12px;display:flex;flex-direction:column;gap:8px;min-width:0;flex:1;position:relative}
  .vxU-ui.off{opacity:.4}
  .vxU-ui h2{margin:0;font:900 1rem var(--font)}
  .vxU-ui p{margin:0;font:800 .95rem var(--font)}
  .vxU-ui .rp-s{font:700 .8rem var(--font);color:#5b6788}
  .vxU-ui input{font:700 .9rem var(--font);padding:.4em .7em;border-radius:8px;border:2px solid #b8c4e4;background:#fff;color:#1f2a44;min-width:0;box-sizing:border-box}
  .vxU-ui button{border:0;border-radius:8px;padding:.5em 1em;background:#2f7bff;color:#fff;font:800 .9rem var(--font);width:fit-content}
  .vxU-ui button:disabled{background:#b9c2dc}
  .vxU-ui ul{margin:0;padding:0;list-style:none;display:flex;gap:6px;flex-wrap:wrap;min-height:2em}
  .vxU-ui li{padding:.25em .8em;border-radius:99px;background:#fff;border:2px solid #cdd6ee;font:800 .85rem var(--mono)}
  .vxU-ui slot-item-stub{display:inline-block;padding:.25em .6em;border-radius:8px;border:2px dashed #b9a2e6;background:#f5f0ff;color:#7b3fd1;font:800 .75rem var(--mono)}
  .vxU-ui footer{font:700 .8rem var(--font);color:#c27a00}
  .vxU-log{display:flex;gap:6px;flex-wrap:wrap;align-items:center;font:800 .78rem var(--mono)}
  .vxU-log i{font-style:normal;padding:.1em .6em;border-radius:99px;background:var(--card2);border:1px solid var(--line)}
  .vxU-run{border-radius:10px;background:var(--code);color:#d8dcff;padding:10px 14px;font:600 .8rem/1.7 var(--mono);min-height:9.5em;max-height:13.5em;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere}
  .vxU-run .ok{color:#2fd4a4}.vxU-run .ng{color:#ff8f9a}.vxU-run .mu{color:#8e97c4}.vxU-run div{animation:vxUin .3s}
  @keyframes vxUin{from{opacity:0;transform:translateY(-3px)}}
  .vxU-sw{all:unset;cursor:pointer;box-sizing:border-box;padding:.35em .9em;border-radius:99px;border:2px solid var(--line);background:var(--card2);font:800 .82rem var(--mono);color:var(--text);display:inline-flex;align-items:center;height:36px}
  .vxU-sw.on{background:var(--vue);border-color:var(--vue);color:#06101f}.vxU-sw.x.on{background:var(--bad);border-color:var(--bad);color:#fff}
  .vxU-lb{font:900 .85rem var(--font);color:var(--mute);display:flex;gap:8px;align-items:center}
  .vxU-wrap{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.vxU-g.full{grid-column:1/-1}.vxU-g.full .vxU-grid{grid-template-columns:repeat(var(--cols,5),minmax(0,1fr))}
  @media(max-width:900px){.vxU-wrap{grid-template-columns:1fr}.vxU-g.full .vxU-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
  .vxU-g{background:var(--card);border:1px solid color-mix(in srgb,var(--c) 35%,var(--line));border-radius:10px;padding:14px 14px 12px;position:relative}
  .vxU-g::before{content:"";position:absolute;left:14px;right:14px;top:0;height:3px;border-radius:0 0 4px 4px;background:var(--c)}
  .vxU-g h4{font-size:1rem;font-weight:900;display:flex;align-items:baseline;gap:.6em;margin-bottom:10px;color:var(--c)}
  .vxU-g h4 small{font:700 .68rem var(--mono);color:var(--mute);letter-spacing:.04em}
  .vxU-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
  .vxU-k{all:unset;box-sizing:border-box;position:relative;cursor:pointer;display:grid;gap:3px;padding:9px 10px;border-radius:8px;background:var(--card2);border:1px solid var(--line);transition:transform .18s,border-color .18s,background .18s,box-shadow .18s;align-content:start}
  .vxU-k:hover,.vxU-k.vxU-hot{transform:translateY(-3px);border-color:var(--cc);box-shadow:0 10px 22px -12px var(--cc)}
  .vxU-k.vxU-hot{outline:none!important}
  .vxU-k:active,.vxU-k.hit{transform:translateY(1px);background:color-mix(in srgb,var(--cc) 24%,var(--card2));border-color:var(--cc)}
  .vxU-k .kc{display:flex;gap:4px;align-items:center;flex-wrap:wrap;min-height:30px}
  .vxU-k .kc i{font:800 .86rem var(--mono);font-style:normal;min-width:28px;height:28px;padding:0 .55em;display:grid;place-items:center;border-radius:8px;background:var(--bg2);color:var(--text);border:1px solid var(--line);border-bottom-width:3px}
  .vxU-k .en{font:600 .75rem var(--mono);color:var(--mute)}
  .vxU-k .en b{color:var(--cc);font-weight:900;font-size:.95em;text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:2px}
  .vxU-k .jp{font-weight:800;font-size:.78rem;line-height:1.35}
  .vxU-note{padding:.7em 1em;border-radius:8px;background:color-mix(in srgb,var(--violet) 12%,transparent);border:1px dashed color-mix(in srgb,var(--violet) 40%,transparent);font:700 .86rem/1.7 var(--font)}
  .vxU-mis{display:grid;gap:6px}
  .vxU-mi{display:flex;gap:8px;align-items:center;padding:.4em .7em;border-radius:10px;border:2px solid var(--line);background:var(--card2);font:800 .85rem var(--font);transition:.3s}
  .vxU-mi.done{border-color:var(--ok);background:color-mix(in srgb,var(--ok) 14%,var(--card))}
  .vxU-link{display:grid;gap:3px;padding:.7em 1em;border-radius:12px;border:2px solid var(--line);background:var(--card);text-decoration:none;color:var(--text);transition:.2s}
  .vxU-link:hover{border-color:var(--ts);transform:translateY(-2px)}.vxU-link b{font:900 .92rem var(--font)}.vxU-link small{font:700 .8rem var(--font);color:var(--mute)}
  .vxU-three{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}@media(max-width:900px){.vxU-three{grid-template-columns:1fr}}
  .vxU-tree{font:700 .84rem/1.7 var(--mono);margin:0;padding:10px 12px;border-radius:10px;background:var(--code);color:#d8dcff;white-space:pre}.vxU-tree b{color:var(--vue)}
  `);

  const fmt = (v) => {
    if (v === undefined) return 'undefined';
    if (v && v.__w) return v.exists() ? 'DOMWrapper（exists: true）' : 'DOMWrapper（exists: false）';
    if (typeof v === 'string') return "'" + v.replace(/\n\s*/g, ' ') + "'";
    if (Array.isArray(v)) return v.length ? '[ ' + v.map(fmt).join(', ') + ' ]' : '[]';
    if (v && typeof v === 'object') { const ks = Object.keys(v); return ks.length ? '{ ' + ks.map((k) => k + ': ' + fmt(v[k])).join(', ') + ' }' : '{}'; }
    return String(v);
  };
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const FILE = 'src/components/__tests__/ReservePanel.test.ts';
  const BASE = () => ({ props: false, slots: false, stubs: false, global: false, attach: false, shallow: false });

  /* ============================================================
     砂場：にせものの部品（ReservePanel）＋ にせものの VTU wrapper ＋ テストファイル ＋ 実行結果
     ============================================================ */
  function sandbox(cfg) {
    cfg = cfg || {};
    const S = { opts: BASE(), top: [], pre: [], body: [], awaitOn: true, w: null, panel: null, results: [], api: { mocked: false, result: undefined, calls: [] }, spy: null, fake: false, busy: false, cards: {}, defs: {}, lastN: 0 };
    let nn = 0, pre = null;
    const ui = h('div', { class: 'vxU-ui off', style: { flex: 'none', minHeight: '210px' } });
    const logBar = h('div', { class: 'vxU-log' });
    const run = h('div', { class: 'vxU-run' });
    const sum = h('span', { style: { font: '900 .8rem var(--mono)' } });
    const fileBox = h('div', { style: { display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 } });

    /* ---- にせものの部品 ---- */
    const makePanel = () => {
      const o = S.opts;
      const st = { slots: o.props ? 1 : 3, name: '', loading: true, times: cfg.api ? [] : ['10:00', '11:00', '14:00'], emitted: {}, dirty: false, gone: false, key: '' };
      const footer = o.slots ? '※当日の変更はできません' : '';
      const rem = h('p', { 'data-test': 'remaining' }), status = h('p', { class: 'rp-s', 'data-test': 'status' });
      const inp = h('input', { 'data-test': 'name', placeholder: '氏名' }), btn = h('button', { 'data-test': 'reserve' });
      const ul = h('ul'), foot = h('footer', { 'data-test': 'footer' });
      const root = h('section', { 'data-test': 'panel' }, h('h2', '相談予約'), rem, status, inp, btn, ul, foot);
      const shallow = o.shallow || o.stubs;
      const patch = () => {
        rem.textContent = '残り ' + st.slots + ' 枠'; btn.disabled = st.slots === 0; btn.textContent = st.slots === 0 ? '満席です' : '予約する';
        if (document.activeElement !== inp) inp.value = st.name;
        status.textContent = st.loading ? '空き枠を確認中…' : '確認済み';
        foot.textContent = footer; foot.style.display = footer ? '' : 'none';
        const key = st.times.join() + shallow;
        if (key !== st.key) { st.key = key; ul.replaceChildren(...st.times.map((t) => (shallow ? h('slot-item-stub', { time: t }) : h('li', { class: 'slot-item', 'data-comp': 'SlotItem' }, t)))); }
        st.dirty = false; drawLog();
      };
      const reserve = () => { if (st.slots <= 0) return; st.slots--; st.dirty = true; (st.emitted.reserve = st.emitted.reserve || []).push([st.slots]); if (S.spy) S.spy.calls.push([st.slots]); };
      btn.addEventListener('click', reserve);
      inp.addEventListener('input', () => { st.name = inp.value; st.dirty = true; });
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') reserve(); });
      const tick = () => { if (st.dirty) patch(); };
      const later = () => { if (S.awaitOn) return Promise.resolve().then(tick); setTimeout(tick, 2600); return Promise.resolve(); };
      if (cfg.api) { S.api.calls.push(['2025-04-01']); if (S.api.mocked) Promise.resolve(S.api.result).then((r) => { st.got = r || []; st.has = true; }); }
      patch();
      return { st, root, patch, tick, later };
    };
    const drawLog = () => {
      const p = S.panel; if (!p) { logBar.replaceChildren(h('i', 'まだ mount していない')); return; }
      const em = p.st.emitted;
      logBar.replaceChildren(h('span', 'emitted:'), ...(Object.keys(em).length ? Object.keys(em).map((k) => h('i', k + ' ' + fmt(em[k]))) : [h('i', '（なし）')]), ...(S.spy ? [h('span', ' onReserve:'), h('i', S.spy.calls.length + ' 回 ' + (S.spy.calls.length ? fmt(S.spy.calls) : ''))] : []));
    };

    /* ---- にせものの VTU wrapper（API 名は本物と同じ） ---- */
    const dw = (el) => {
      const need = () => { if (!el) throw new Error('Cannot call method on an empty DOMWrapper.'); };
      const p = S.panel;
      return {
        __w: 1, element: el, exists: () => !!el,
        text: () => { need(); return el.textContent.trim(); }, html: () => { need(); return el.outerHTML; },
        classes: (n) => { need(); const l = [...el.classList]; return n ? l.includes(n) : l; },
        attributes: (n) => { need(); if (n) return el.hasAttribute(n) ? el.getAttribute(n) : undefined; const o = {}; [...el.attributes].forEach((a) => { o[a.name] = a.value; }); return o; },
        isVisible: () => { need(); return el.isConnected && getComputedStyle(el).display !== 'none'; },
        trigger: (t) => { need(); if (el.disabled) return Promise.resolve(); el.dispatchEvent(/^key/.test(t) ? new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }) : new MouseEvent(t, { bubbles: true })); return p.later(); },
        setValue: (v) => { need(); el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); return p.later(); },
        find: (s) => dw(el ? el.querySelector(s) : null), findAll: (s) => [...(el ? el.querySelectorAll(s) : [])].map(dw),
        get: (s) => { const r = el && el.querySelector(s); if (!r) throw new Error('Unable to get ' + s + ' within: <section data-test="panel">…'); return dw(r); },
      };
    };
    const mkWrapper = () => {
      const p = S.panel, root = p.root, base = dw(root);
      const comp = (n) => root.querySelectorAll('[data-comp="' + n + '"]');
      const w = Object.assign(base, {
        props: (k) => { const o = { slots: p.st.slots }; return k ? o[k] : o; },
        emitted: (n) => (n ? p.st.emitted[n] : p.st.emitted),
        setProps: (o) => { if ('slots' in o) p.st.slots = o.slots; p.st.dirty = true; return p.later(); },
        setData: (o) => { if ('name' in o) p.st.name = o.name; p.st.dirty = true; return p.later(); },
        findComponent: (c) => dw(comp(c.name)[0] || null), findAllComponents: (c) => [...comp(c.name)].map(dw),
        getComponent: (c) => { if (!comp(c.name)[0]) throw new Error('Unable to get component ' + c.name); return dw(comp(c.name)[0]); },
        unmount: () => { ui.classList.add('off'); },
      });
      Object.defineProperty(w, 'vm', { get: () => ({ slots: p.st.slots, name: p.st.name }) });
      return w;
    };
    S.SlotItem = { name: 'SlotItem' };
    S.tickAll = () => { if (S.panel) S.panel.tick(); };
    S.flush = async () => { await new Promise((r) => setTimeout(r, 0)); if (S.panel) { if (!cfg.api) S.panel.st.loading = false; else if (S.panel.st.has) { S.panel.st.times = S.panel.st.got; S.panel.st.loading = false; } S.panel.st.dirty = true; S.panel.tick(); } };
    S.mount = () => { S.panel = makePanel(); S.w = mkWrapper(); ui.classList.remove('off'); ui.replaceChildren(S.panel.root); drawLog(); };

    /* ---- テストファイル ---- */
    const mountLine = () => {
      const o = S.opts, fn = o.shallow ? 'shallowMount' : 'mount', parts = [];
      const pr = [].concat(o.props ? ['slots: 1'] : [], S.pre.some((l) => l.id === 'vifn') ? ['onReserve'] : []);
      if (pr.length) parts.push('props: { ' + pr.join(', ') + ' },');
      if (o.slots) parts.push("slots: { footer: '※当日の変更はできません' },");
      if (o.stubs) parts.push('global: { stubs: { SlotItem: true } },');
      if (o.global) parts.push('global: { plugins: [router], provide: { userId: 7 } },');
      if (o.attach) parts.push('attachTo: document.body,');
      return parts.length ? ['const wrapper = ' + fn + '(ReservePanel, {'].concat(parts.map((x) => '  ' + x), ['})']) : ['const wrapper = ' + fn + '(ReservePanel)'];
    };
    const fileLines = () => {
      const all = S.top.concat(S.pre, S.body).map((l) => l.text).join('\n');
      const vt = ['describe', 'it', 'expect'].concat(/\bvi\./.test(all) ? ['vi'] : []);
      const vtu = [S.opts.shallow ? 'shallowMount' : 'mount'].concat(/flushPromises/.test(all) ? ['flushPromises'] : []);
      const L = [{ t: 'import { ' + vt.join(', ') + " } from 'vitest'" }, { t: 'import { ' + vtu.join(', ') + " } from '@vue/test-utils'" }];
      if (/nextTick/.test(all)) L.push({ t: "import { nextTick } from 'vue'" });
      L.push({ t: "import ReservePanel from '../ReservePanel.vue'" });
      if (cfg.api) L.push({ t: "import { fetchSlots } from '@/api/slots'" });
      if (/SlotItem\b/.test(all)) L.push({ t: "import SlotItem from '../SlotItem.vue'" });
      L.push({ t: '' });
      S.top.forEach((l) => L.push({ t: l.text, id: l.id, n: l.n }));
      if (S.top.length) L.push({ t: '' });
      L.push({ t: "describe('ReservePanel', () => {" }, { t: "  it('予約できる', async () => {" });
      S.pre.forEach((l) => l.text.split('\n').forEach((x) => L.push({ t: '    ' + x, id: l.id, body: 1, n: l.n })));
      if (S.panel) mountLine().forEach((x) => L.push({ t: '    ' + x, id: 'mount', body: 1, n: -1 }));
      else if (!S.pre.length && !S.body.length) L.push({ t: '    // 下のカードを押すと、ここに 1 行ずつ増える' });
      S.body.forEach((l) => l.text.split('\n').forEach((x) => L.push({ t: '    ' + x, id: l.id, body: 1, n: l.n })));
      L.push({ t: '  })' }, { t: '})' });
      return L;
    };
    S.drawFile = (cur) => {
      const L = fileLines();
      pre = code(L.map((l) => l.t).join('\n'), 'ts', { dim: true, color: VUE, file: FILE, edit: false });
      pre.style.cssText = 'margin:0;flex:1;font-size:.82rem;white-space:pre-wrap;overflow-wrap:anywhere';
      const hi = [];
      L.forEach((l, i) => {
        const ln = pre.lines[i];
        if (l.body) hi.push(i + 1);
        if (l.id) { ln.setAttribute('data-k', l.id); ln.addEventListener('mouseenter', () => S.hover(l.id, true)); ln.addEventListener('mouseleave', () => S.hover(l.id, false)); ln.addEventListener('click', () => { const d = S.defs[l.id]; if (d && S.cards[l.id]) S.cards[l.id].scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }); }
        if (cur && l.id === cur && l.n === S.lastN) ln.classList.add('vxU-cur');
      });
      pre.setHi(hi);
      fileBox.replaceChildren(pre);
    };

    /* ---- 実行結果 ---- */
    const say = (c, t) => { run.append(h('div', { class: c }, t)); run.scrollTop = run.scrollHeight; };
    const drawSum = () => { const ok = S.results.filter(Boolean).length, ng = S.results.length - ok; sum.textContent = S.results.length ? '結果：' + ok + ' ✓　' + ng + ' ✖' : ''; sum.style.color = ng ? 'var(--bad)' : 'var(--ok)'; };
    S.say = say;
    S.judge = (a, M, e, calls) => {
      let pass, msg;
      if (M === 'toBe') { pass = Object.is(a, e); msg = 'expected ' + fmt(a) + ' to be ' + fmt(e) + ' // Object.is equality'; }
      else if (M === 'toEqual') { pass = same(a, e); msg = 'expected ' + fmt(a) + ' to deeply equal ' + fmt(e); }
      else if (M === 'toContain') { pass = a != null && a.includes(e); msg = 'expected ' + fmt(a) + ' to contain ' + fmt(e); }
      else if (M === 'toBeTruthy') { pass = !!a; msg = 'expected ' + fmt(a) + ' to be truthy'; }
      else if (M === 'toHaveLength') { pass = a != null && a.length === e; msg = 'expected ' + fmt(a) + ' to have a length of ' + e + ' but got ' + (a ? a.length : 0); }
      else if (M === 'toBeUndefined') { pass = a === undefined; msg = 'expected ' + fmt(a) + ' to be undefined'; }
      else if (M === 'toHaveBeenCalledTimes') { pass = calls.length === e; msg = 'expected spy to be called ' + e + ' times, but got ' + calls.length + ' times'; }
      else { pass = calls.some((c) => same(c, [].concat(e))); msg = 'expected spy to be called with arguments: ' + fmt([].concat(e)) + ' / Received: ' + (calls.length ? fmt(calls) : 'Number of calls: 0'); }
      return { pass, msg };
    };

    /* ---- カード ⇄ コードの行 ⇄ 部品 の連動 ---- */
    S.hover = (id, on) => {
      const card = S.cards[id], def = S.defs[id];
      if (card) card.classList.toggle('vxU-hot', on);
      if (S.panel && def && def.ui) S.panel.root.querySelectorAll(def.ui).forEach((n) => { n.classList.toggle('vxU-hot', on); n.style.setProperty('--hc', (card && card.style.getPropertyValue('--cc')) || '#ff6b9d'); });
      if (pre) pre.querySelectorAll('.ln[data-k="' + id + '"]').forEach((n) => { n.classList.toggle('vxU-hot', on); n.style.setProperty('--hc', (card && card.style.getPropertyValue('--cc')) || '#ff6b9d'); });
    };

    /* ---- カードを押す ---- */
    S.press = async (def) => {
      if (S.busy) return; S.busy = true;
      try {
        if (def.mount) {
          if (def.mount === 'unmount') {
            if (!S.w) { say('ng', '✖ まだ mount していない'); return; }
            S.w.unmount(); S.body.push({ id: def.id, text: 'wrapper.unmount()', n: ++nn }); S.lastN = nn; S.drawFile(def.id); say('mu', '▶ wrapper.unmount()'); say('ok', '→ 部品を外した（タイマーやイベントも片付く）'); return;
          }
          S.opts = Object.assign(BASE(), def.mount); S.body = []; S.results = []; run.replaceChildren(); S.mount(); S.drawFile('mount');
          say('mu', '▶ ' + mountLine().join(' ').replace(/\s+/g, ' ')); say('ok', '→ ' + (S.opts.shallow || S.opts.stubs ? 'wrapper（子の SlotItem はスタブ）' : 'wrapper（子の SlotItem まで描画）') + (def.note ? '　' + def.note : '')); drawSum(); return;
        }
        const phase = def.phase || 'body';
        if (phase === 'body' && !S.w) { S.mount(); say('mu', '（先に mount を 1 行足した）'); }
        if (def.beforeRun) def.beforeRun(S);
        const n = ++nn; S.lastN = n;
        const entry = { id: def.id, text: typeof def.line === 'function' ? def.line(S) : def.line, n };
        (phase === 'top' ? S.top : phase === 'pre' ? S.pre : S.body).push(entry);
        S.drawFile(def.id);
        say('mu', '▶ ' + entry.text.replace(/\n\s*/g, ' '));
        let r; try { r = await def.fn(S); } catch (e) { r = { err: e.message }; }
        if (r && r.err) { say('ng', '✖ ' + r.err); S.results.push(false); }
        else if (r && r.pass !== undefined) { S.results.push(r.pass); say(r.pass ? 'ok' : 'ng', r.pass ? '✓ passed' : '✖ AssertionError: ' + r.msg); if (!r.pass && r.hint) say('mu', '　' + r.hint); }
        else say('ok', '→ ' + (r && 'v' in r ? fmt(r.v) : '（戻り値なし）') + (r && r.note ? '　' + r.note : ''));
        S.tickAll(); drawSum(); drawLog();
        if (S.panel && def.ui) S.panel.root.querySelectorAll(def.ui).forEach((x) => { x.animate && x.animate([{ boxShadow: '0 0 0 6px #ffb454' }, { boxShadow: '0 0 0 0 transparent' }], { duration: 700 }); });
      } finally { S.busy = false; }
    };
    S.reset = () => { S.opts = BASE(); S.top = []; S.pre = []; S.body = []; S.w = null; S.panel = null; S.results = []; S.spy = null; S.api = { mocked: false, result: undefined, calls: [] }; S.fake = false; run.replaceChildren(); ui.className = 'vxU-ui off'; ui.replaceChildren(h('p', { style: { color: '#8a93ad', margin: 'auto' } }, 'mount すると、ここに部品が出る')); drawLog(); drawSum(); S.drawFile(); };

    const sw = h('button', { class: 'vxU-sw on', title: 'await を付ける／付けない', onclick: () => { S.awaitOn = !S.awaitOn; sw.classList.toggle('on', S.awaitOn); sw.classList.toggle('x', !S.awaitOn); sw.textContent = S.awaitOn ? '✓ await あり' : '✖ await なし'; if (S.awaitOn) S.tickAll(); } }, '✓ await あり');
    S.el = h('div', { class: 'vxU-stage' },
      h('div', { class: 'vxU-box' }, h('div', { class: 'vxU-tt' }, '🖼 にせもの部品 ReservePanel'), ui, logBar, h('div', { class: 'vxU-tt' }, '▶ 実行結果 ', sum), run, h('div', { class: 'vxU-bar' }, h('button', { class: 'btn ghost', onclick: () => S.reset(), style: { height: '36px', fontSize: '.8rem' } }, '⟲ 最初から'), sw)),
      h('div', { class: 'vxU-box' }, h('div', { class: 'vxU-tt' }, '✍ ReservePanel.test.ts（カードを押すと 1 行ずつ増える）'), fileBox));
    S.reset();
    return S;
  }

  /* ---- キーカードの組み立て（Vim レッスンと同じ） ---- */
  const cardEl = (S, c, g) => {
    const b = h('button', { class: 'vxU-k', 'data-tip': c.tip, onclick: () => { b.classList.add('hit'); setTimeout(() => b.classList.remove('hit'), 220); S.press(c); } },
      h('span', { class: 'kc' }, c.caps.map((x) => h('i', x))), h('span', { class: 'en', html: c.en }), h('span', { class: 'jp' }, c.jp));
    b.style.setProperty('--cc', g.c);
    b.addEventListener('mouseenter', () => S.hover(c.id, true)); b.addEventListener('mouseleave', () => S.hover(c.id, false));
    S.cards[c.id] = b; S.defs[c.id] = c;
    return b;
  };
  const board = (S, G) => h('div', { class: 'vxU-wrap' }, G.map((g) => h('section', { class: 'vxU-g' + (g.full ? ' full' : ''), style: { '--c': g.c, '--cols': g.full || 2 } },
    h('h4', g.t, h('small', g.en)), h('div', { class: 'vxU-grid' }, g.keys.map((k) => cardEl(S, k, g))))));
  const NOTE = (...html) => h('div', { class: 'vxU-note', html: html.join(' ') });
  const LB = (t) => h('div', { class: 'vxU-lb' }, t);
  const A = (id, caps, en, jp, tip, line, ui, fn, more) => Object.assign({ id, caps, en, jp, tip, line, ui, fn }, more || {});
  /* expect(読んだ値).matcher(期待値) のカード */
  const X = (id, caps, en, jp, tip, src, get, M, e, ui, more) => {
    more = more || {};
    const arg = e === undefined ? '' : (typeof e === 'string' ? "'" + e + "'" : JSON.stringify(e));
    return A(id, caps, en, jp, tip, 'expect(' + src + ')\n  .' + M + '(' + arg + ')', ui, (S) => {
      if (more.needMock && !S.api.mocked) return { err: "TypeError: fetchSlots is not a spy or a call to a spy!（先に vi.mock）" };
      const calls = /Called/.test(M) ? (more.calls ? more.calls(S) : (S.spy ? S.spy.calls : [])) : null;
      return Object.assign(S.judge(get(S), M, e, calls), { hint: more.hint || '' });
    }, more);
  };

  /* ============================================================ 1. 描く */
  function sceneMount(el) {
    const S = sandbox({});
    const m = (id, caps, en, jp, tip, mount, ui, note) => ({ id, caps, en, jp, tip, mount, ui, note });
    const G = [
      { t: '部品を描く', en: 'MOUNT', c: TS, full: 3, keys: [
        m('m-mount', ['mount', '(部品)'], '<b>mount</b> = 取り付ける', '部品を作って、画面に出す', 'mount＝取り付ける。子コンポーネントも含めて、本物と同じように描く。テストの最初の 1 行。戻り値が wrapper（以降の操作の入り口）', {}, '[data-test="panel"]'),
        m('m-shallow', ['shallowMount', '(部品)'], '<b>shallow</b>Mount = 浅く取り付ける', '子はスタブ（代役）にして出す', 'shallow＝浅い。子を <slot-item-stub> に置き換え、この部品だけを見る。子が重い／別のテストで確認済みのときに使う', { shallow: true }, 'ul'),
        { id: 'm-un', caps: ['wrapper', '.unmount()'], en: '<b>un</b>mount = 取り外す', jp: '部品を外して後片付け', tip: 'unmount＝取り外す。タイマーやイベントの後片付け。毎回やるなら enableAutoUnmount(afterEach) で自動化できる', mount: 'unmount', ui: '[data-test="panel"]' },
      ] },
      { t: 'mount の 2 つ目の引数（オプション）', en: 'OPTIONS', c: PINK, full: 5, keys: [
        m('o-props', ['props'], '<b>props</b> = 親から渡す値', 'props: { slots: 1 }', 'props＝親から子へ渡す値。「残り 1 枠」のような特定の状態から始めたいときに使う', { props: true }, '[data-test="remaining"]'),
        m('o-slots', ['slots'], '<b>slots</b> = 差し込み口', "slots: { footer: '…' }", 'slot＝差し込み口。親が中身を入れる場所（<slot name="footer">）に、文字や部品を入れて描く', { slots: true }, '[data-test="footer"]'),
        m('o-stubs', ['global', '.stubs'], '<b>stubs</b> = 代役', '一部の子だけ、スタブに', 'stub＝代役。shallowMount は全部の子が代役、stubs は名前を指定した子だけ代役にできる', { stubs: true }, 'ul'),
        m('o-global', ['global', '.plugins', '.provide'], '<b>global</b> = アプリ全体の設定', 'router・Pinia・provide を入れる', 'global＝全体。部品が router / Pinia / provide を使うとき、テストにも用意する。この部品では見た目は変わらない', { global: true }, null, '（見た目は変わらない）'),
        m('o-attach', ['attachTo'], '<b>attach</b>To = 本物の DOM に付ける', 'attachTo: document.body', 'attach＝付ける。フォーカスや表示の確認など、本物の DOM が要るときだけ。使ったら unmount を忘れない', { attach: true }, null, '（document.body に付いた）'),
      ] },
    ];
    el.append(h('div', { class: 'vxU' }, S.el, LB('🎹 カードを押す → テストファイルが変わり、部品が出る（カーソルを乗せると解説）'), board(S, G), NOTE('下線の太字が、名前の由来になる英単語。<b>mount</b> は「取り付ける」。覚えると忘れにくい。')));
  }

  /* ============================================================ 2. 探す */
  function sceneFind(el) {
    const S = sandbox({});
    const f = (id, caps, en, jp, tip, line, ui, fn) => A(id, caps, en, jp, tip, line, ui, fn);
    const G = [
      { t: '1 つ・全部・無いとき', en: 'FIND', c: TS, full: 5, keys: [
        f('f-find', ['find', "('…')"], '<b>find</b> = 見つける', '要素を 1 つ探す', 'find＝見つける。CSS セレクターで探して、先頭の 1 つの wrapper を返す。無くても止まらず、exists() が false になる', "const button = wrapper.find('button')", '[data-test="reserve"]', (S) => ({ v: S.w.find('button') })),
        f('f-all', ['findAll', "('…')"], '<b>find</b><b>All</b> = 全部見つける', '一致する全部を配列で', 'findAll＝全部。配列で返る。無ければ空配列（[]）。数を確かめたいときは toHaveLength', "const items = wrapper.findAll('li')", 'li', (S) => ({ v: S.w.findAll('li'), note: '→ ' + S.w.findAll('li').length + ' 個' })),
        f('f-get', ['get', "('…')"], '<b>get</b> = 取る（無ければ叫ぶ）', '必ずある要素。無いと例外', 'get＝取る。あるはずの要素に使う。無いと「Unable to get …」と例外を投げて、テストがそこで止まる。タイプミスにすぐ気づける', "const input = wrapper.get('input')", '[data-test="name"]', (S) => ({ v: S.w.get('input') })),
        f('f-get404', ['get', "('.cancel')"], '<b>get</b> = 無いものを取る', '無い要素を get すると…', '存在しない .cancel を get した例。find なら exists() が false になるだけだが、get は例外。「無いこと」を確かめたいなら find().exists()', "wrapper.get('.cancel')", null, (S) => { S.w.get('.cancel'); return {}; }),
        f('f-exists', ['find().exists', '()'], '<b>exists</b> = 存在する？', '要素があるか true / false', 'exists＝存在する。find の結果に付ける。「バッジが出ていない」を確かめるなら expect(…exists()).toBe(false)', "wrapper.find('.cancel').exists()", null, (S) => ({ v: S.w.find('.cancel').exists() })),
      ] },
      { t: '子コンポーネント・data-test', en: 'COMPONENT', c: PINK, full: 4, keys: [
        f('c-comp', ['findComponent', '(部品)'], '<b>findComponent</b> = 部品を見つける', '子コンポーネントを 1 つ', 'findComponent＝部品を探す。タグや class ではなく部品そのものを渡して探す。props() で子へ渡した値も確かめられる', 'const item = wrapper.findComponent(SlotItem)', 'li', (S) => ({ v: S.w.findComponent(S.SlotItem) })),
        f('c-comps', ['findAllComponents', '(部品)'], '<b>findAll</b>Components = 部品を全部', '子コンポーネントを全部', 'findAllComponents＝部品を全部。一覧の件数を、子の数で確かめたいときに', 'const items = wrapper.findAllComponents(SlotItem)', 'li', (S) => ({ v: S.w.findAllComponents(S.SlotItem), note: '→ ' + S.w.findAllComponents(S.SlotItem).length + ' 個' })),
        f('c-gcomp', ['getComponent', '(部品)'], '<b>get</b>Component = 部品を取る（無ければ叫ぶ）', '必ずある子コンポーネント', 'getComponent＝部品版の get。無ければ例外。shallowMount でも探せる（スタブにも一致する）', 'const item = wrapper.getComponent(SlotItem)', 'li', (S) => ({ v: S.w.getComponent(S.SlotItem) })),
        f('c-dt', ['find', '(\'[data-test="…"]\')'], '<b>data-test</b> = テスト用の目印', '見た目が変わっても探せる', 'data-test（data-testid でも可）は、テストが探すための目印。class や文言が変わってもテストが壊れにくい。チームで 1 つに決める', "wrapper.find('[data-test=\"reserve\"]')", '[data-test]', (S) => ({ v: S.w.find('[data-test="reserve"]') })),
      ] },
    ];
    el.append(h('div', { class: 'vxU' }, S.el, LB('🎹 どれかを押すと、自動で mount が足される。「無い要素を get」のカードも試そう'), board(S, G), NOTE('<b>find</b> は黙って空を返し、<b>get</b> は叫ぶ。あるはずの要素は <b>get</b>、無いことを確かめるなら <b>find().exists()</b>。')));
  }

  /* ============================================================ 3. 操作する */
  function sceneAct(el) {
    const S = sandbox({});
    const aw = (S) => (S.awaitOn ? 'await ' : '');
    const NOTEAW = (S) => (S.awaitOn ? { note: '→ 画面を更新してから、次へ' } : { note: '⚠ await が無い：画面はまだ古い（数秒あとに変わる）。この直後の expect は古い画面を見る' });
    const act = (id, caps, en, jp, tip, line, ui, fn) => A(id, caps, en, jp, tip, (S) => aw(S) + line, ui, async (S) => { const p = fn(S); if (S.awaitOn) await p; return NOTEAW(S); });
    const G = [
      { t: '部品を操作する', en: 'ACT', c: TS, full: 4, keys: [
        act('a-trig', ['trigger', "('click')"], '<b>trig</b>ger = 引き金を引く', 'クリックなどのイベントを起こす', 'trigger＝引き金を引く。click・input・submit・keydown.enter など。DOM の更新は非同期なので await を付ける（付けないと、古い画面を読む）', "wrapper.find('[data-test=\"reserve\"]').trigger('click')", '[data-test="reserve"]', (S) => S.w.find('[data-test="reserve"]').trigger('click')),
        act('a-enter', ['trigger', "('keydown.enter')"], '<b>trig</b>ger = キーも押せる', 'Enter キーを押す', "trigger('keydown.enter') のように、キー名も付けられる。入力欄で Enter を押したときの動きを確かめる", "wrapper.find('input').trigger('keydown.enter')", '[data-test="name"]', (S) => S.w.find('input').trigger('keydown.enter')),
        act('a-val', ['setValue', "('…')"], '<b>set</b>Value = 値をセット', '入力欄に打ち込む', 'setValue＝値をセット。input・textarea・select・checkbox に使う。v-model に値が届き、画面が更新される', "wrapper.find('input').setValue('山田 太郎')", '[data-test="name"]', (S) => S.w.find('input').setValue('山田 太郎')),
        act('a-props', ['setProps', '({…})'], '<b>set</b>Props = 親の値を変える', 'props をあとから変える', 'setProps＝props をセット。mount したあとで親が値を変えた場面を再現する（残り枠が 5 に増えた、など）', 'wrapper.setProps({ slots: 5 })', '[data-test="remaining"]', (S) => S.w.setProps({ slots: 5 })),
      ] },
      { t: '待つ・直接変える', en: 'WAIT', c: TEAM, full: 3, keys: [
        A('w-nt', ['await', 'nextTick()'], '<b>next</b>Tick = 次の更新', '次の画面更新まで待つ', 'nextTick＝次の更新。vue から import する。trigger / setValue は中で待ってくれるので、自分で待つのは「部品の外から値を変えた」ときなど', (S) => aw(S) + 'nextTick()', '[data-test="remaining"]', async (S) => { S.tickAll(); return { note: '→ 次の更新まで待った' }; }),
        A('w-fp', ['flushPromises', '()'], 'flush<b>Promises</b> = 約束を流し切る', 'API の返事（Promise）を待つ', 'flushPromises＝Promise を流し切る。@vue/test-utils から import。mockResolvedValue した API の返事を、画面に反映させたいときに使う。本物の通信までは待たない', (S) => aw(S) + 'flushPromises()', '[data-test="status"]', async (S) => { await S.flush(); return { note: '→ 「確認中…」が「確認済み」に' }; }),
        A('a-set', ['setData', '({…})'], '<b>set</b>Data = データを直接変える', 'Options API 向け', 'setData＝データをセット。Options API の data() を直接書き換える。<script setup> の部品では使えない（setValue や setProps で、利用者と同じ操作をする方がよい）', (S) => aw(S) + "wrapper.setData({ name: '山田 太郎' })", '[data-test="name"]', async (S) => { const p = S.w.setData({ name: '山田 太郎' }); if (S.awaitOn) await p; return { note: '→ （Options API の部品の場合）' }; }),
      ] },
    ];
    el.append(h('div', { class: 'vxU' }, S.el, LB('🎹 コマンドを押す → 部品が動く。左下の「await」を外して、もう一度押そう'), board(S, G), NOTE('<b>trigger</b> は <b>await</b> 付きが基本。await を外すと、<b>画面の更新が間に合わず</b>、次の expect が古い値を読む。')));
  }

  /* ============================================================ 4. 確かめる */
  function sceneAssert(el) {
    const S = sandbox({});
    const sp = (S) => { if (!S.spy) { S.spy = { calls: [] }; S.pre.push({ id: 'vifn', text: 'const onReserve = vi.fn()', n: 0 }); } };
    const btn = (S) => S.w.find('[data-test="reserve"]');
    const rd = (id, caps, en, jp, tip, line, ui, get) => A(id, caps, en, jp, tip, line, ui, (S) => ({ v: get(S) }));
    const G = [
      { t: '状態を読む（wrapper のメソッド）', en: 'READ', c: TS, full: 4, keys: [
        rd('r-text', ['wrapper', '.text()'], '<b>text</b> = 文字', '画面の文字を取り出す', 'text＝文字。前後の空白を除いた、見えている文字。いちばん使う読み方', 'const text = wrapper.text()', '[data-test="panel"]', (S) => S.w.text()),
        rd('r-html', ['find().html', '()'], '<b>html</b> = HTML', 'HTML の文字列', 'html＝HTML。タグまで確かめたいときに。多用するとデザイン変更で壊れる', "const html = wrapper.find('button').html()", '[data-test="reserve"]', (S) => btn(S).html()),
        rd('r-cls', ['wrapper', '.classes()'], '<b>class</b>es = クラスの一覧', 'class を配列で', "classes＝class の一覧。classes('is-full') と名前を渡すと true / false", 'const classes = wrapper.classes()', '[data-test="panel"]', (S) => S.w.classes()),
        rd('r-attr', ['attributes', "('disabled')"], '<b>attr</b>ibutes = 属性', 'disabled などの属性', 'attributes＝属性。disabled が付いていれば値、無ければ undefined。属性の有無は toBeDefined / toBeUndefined で確かめる', "const disabled = button.attributes('disabled')", '[data-test="reserve"]', (S) => btn(S).attributes('disabled')),
        rd('r-props', ['wrapper', '.props()'], '<b>props</b> = 受け取った値', '親から渡された props', 'props＝受け取った値。親が渡した値や、setProps した値を確かめる。引数に名前を渡すと 1 つだけ取れる', 'const props = wrapper.props()', '[data-test="remaining"]', (S) => S.w.props()),
        rd('r-vis', ['isVisible', '()'], '<b>is</b>Visible = 見えている？', '表示されているか', "isVisible＝見えているか。v-show や display:none の確認に。v-if で消えたものは exists() の方で確かめる", "const visible = wrapper.find('footer').isVisible()", '[data-test="footer"]', (S) => S.w.find('[data-test="footer"]').isVisible()),
        rd('r-emit', ['emitted', "('reserve')"], '<b>emit</b>ted = 発信された記録', 'emit の回数と引数', "emitted＝発信された記録。[[2], [1]] のように、呼ばれた回数ぶんの配列で、中身は引数の配列。1 回目は ?.[0]", "const events = wrapper.emitted('reserve')", '[data-test="reserve"]', (S) => S.w.emitted('reserve')),
        rd('r-vm', ['wrapper', '.vm'], '<b>vm</b> = 部品の中身', '内部の変数をのぞく（最後の手段）', 'vm＝コンポーネントのインスタンス。内部の実装をのぞける。リファクタで壊れやすいので、まず text() など「見える結果」で確かめる', 'const inner = wrapper.vm', '[data-test="panel"]', (S) => S.w.vm),
      ] },
      { t: '確かめる（Vitest の matcher）', en: 'EXPECT', c: PINK, full: 4, keys: [
        X('e-be', ['toBe'], '<b>toBe</b> = 〜である（同じ値）', '文字・数・真偽を、ぴったり比べる', 'toBe＝である。文字・数・true/false に使う。オブジェクトや配列は「同じ物か」を見るので、中身の比較は toEqual', "wrapper.find('[data-test=\"reserve\"]').text()", (S) => btn(S).text(), 'toBe', '予約する', '[data-test="reserve"]', { hint: '3 回予約すると、ボタンの文字は「満席です」に変わる' }),
        X('e-eq', ['toEqual'], '<b>toEqual</b> = 中身が等しい', 'オブジェクト・配列を、中身で比べる', "toEqual＝等しい。{ } や [ ] を中身で比べる。emitted('reserve')?.[0] のような「引数の配列」は toEqual", "wrapper.emitted('reserve')?.[0]", (S) => (S.w.emitted('reserve') || [])[0], 'toEqual', [2], '[data-test="reserve"]', { hint: '先に予約ボタンを 1 回押してから確かめる（emit の引数は [残り枠]）' }),
        X('e-cont', ['toContain'], '<b>toContain</b> = 〜を含む', '文字や配列に、含まれるか', 'toContain＝含む。text() の一部だけ確かめたいときに便利。配列に要素があるかにも使う', 'wrapper.text()', (S) => S.w.text(), 'toContain', '残り 3 枠', '[data-test="remaining"]', { hint: '予約したあとは「残り 2 枠」になっている' }),
        X('e-true', ['toBeTruthy'], '<b>toBe</b><b>Truthy</b> = 真っぽい', 'true・値あり、なら成功', 'toBeTruthy＝真っぽい。exists() の結果などに。true だけを確かめたいなら toBe(true) の方が厳密', "wrapper.find('[data-test=\"reserve\"]').exists()", (S) => btn(S).exists(), 'toBeTruthy', undefined, '[data-test="reserve"]'),
        X('e-len', ['toHaveLength'], '<b>toHave</b><b>Length</b> = 長さが〜', '配列・文字の長さ', "toHaveLength＝長さ。findAll('li') の件数や、emitted の回数に使う", "wrapper.findAll('li')", (S) => S.w.findAll('li'), 'toHaveLength', 3, 'li'),
        X('e-undef', ['toBeUndefined'], '<b>toBe</b><b>Undefined</b> = undefined である', '「まだ起きていない」を確かめる', "toBeUndefined＝undefined。まだ emit されていない（emitted('reserve') が undefined）、属性が無い、などに使う", "wrapper.emitted('reserve')", (S) => S.w.emitted('reserve'), 'toBeUndefined', undefined, '[data-test="reserve"]', { hint: 'すでに予約した（emit した）あとなので undefined ではない' }),
        X('e-called', ['toHaveBeenCalledWith'], '<b>toHaveBeen</b><b>CalledWith</b> = 〜で呼ばれた', 'vi.fn() が、この引数で呼ばれた', 'toHaveBeenCalledWith＝この引数で呼ばれた。vi.fn() 専用。emit を props の onReserve として受けると、emit の引数が記録される', 'onReserve', () => [], 'toHaveBeenCalledWith', 2, '[data-test="reserve"]', { hint: '予約ボタンを 1 回押してから確かめる（3 → 2）', beforeRun: sp }),
      ] },
    ];
    el.append(h('div', { class: 'vxU' }, S.el, LB('🎹 まず「読む」で値を見て、「確かめる」で比べる。失敗するカードも試そう（予約を押したあとなど）'), board(S, G), NOTE('<b>読む</b>：wrapper のメソッド → <b>比べる</b>：expect(…).matcher(期待値)。オブジェクトや配列は <b>toEqual</b>、文字・数は <b>toBe</b>。')));
  }

  /* ============================================================ 5. にせもの */
  function sceneMock(el) {
    const S = sandbox({ api: true });
    const mk = (id, caps, en, jp, tip, line, phase, fn, more) => A(id, caps, en, jp, tip, line, null, fn, Object.assign({ phase }, more || {}));
    const needMock = (S) => { if (!S.api.mocked) { S.top.push({ id: 'vimock', text: "vi.mock('@/api/slots')", n: 0 }); S.api.mocked = true; S.say('mu', '（先に vi.mock を足した）'); } };
    const G = [
      { t: 'にせものを作る', en: 'FAKE', c: TS, full: 4, keys: [
        mk('vifn', ['vi.fn', '()'], '<b>vi</b>.<b>fn</b> = にせもの関数', '呼ばれたかを記録する関数', 'fn＝function。呼ばれた回数と引数を覚えている、にせもの関数。props のコールバックや、emit の受け取り（onReserve）に渡す', 'const onReserve = vi.fn()', 'pre', async (S) => { S.spy = { calls: [] }; return { note: '→ calls: []' }; }),
        mk('vimock', ['vi.mock', "('@/api/slots')"], '<b>vi</b>.<b>mock</b> = 丸ごとにせものに', 'import ごと、にせものに替える', "vi.mock＝モジュールをにせものに替える。ファイルの先頭に書く（Vitest が自動で一番上に持ち上げる）。中の関数は全部 vi.fn() になり、戻り値は undefined", "vi.mock('@/api/slots')", 'top', async (S) => { S.api.mocked = true; if (S.w) S.mount(); return { note: '→ fetchSlots は vi.fn() になった（本物の通信はしない）' }; }),
        mk('resolved', ['mockResolvedValue', '(x)'], '<b>mock</b><b>Resolved</b>Value = 約束どおり返す', 'await すると x が返る', "mockResolvedValue＝解決する値。async 関数のにせもの。vi.mocked(fetchSlots) は「これは vi.fn です」と TypeScript に教える。mount より前に書く", "vi.mocked(fetchSlots)\n  .mockResolvedValue(['10:00', '11:00'])", 'pre', async (S) => { S.api.result = ['10:00', '11:00']; if (S.w) S.mount(); return { note: '→ 呼ぶと、すぐ [10:00, 11:00] が返る' }; }, { beforeRun: needMock }),
        mk('spyon', ['vi.spyOn', "(api, 'fetchSlots')"], '<b>spy</b>On = こっそり見張る', '本物の関数を、呼ばれ方だけ見張る', "spyOn＝見張る。本物のまま呼び出しを記録する。.mockResolvedValue(…) を続ければ、にせものにも替えられる。後片付けは vi.restoreAllMocks()", "const spy = vi.spyOn(api, 'fetchSlots')", 'pre', async () => ({ note: '→ fetchSlots を見張り始めた' })),
      ] },
      { t: '呼ばれ方・待つ・時間', en: 'CHECK', c: PINK, full: 5, keys: [
        X('calledwith', ['toHaveBeenCalledWith'], '<b>toHaveBeen</b><b>CalledWith</b> = 〜で呼ばれた', 'この引数で呼ばれたか', 'toHaveBeenCalledWith＝この引数で呼ばれた。「どの日付で取りに行ったか」を確かめる', 'fetchSlots', () => [], 'toHaveBeenCalledWith', '2025-04-01', '[data-test="status"]', { needMock: true, calls: (S) => S.api.calls, hint: 'vi.mock したあとに mount すると、呼ばれたことが記録される' }),
        X('calledtimes', ['toHaveBeenCalledTimes'], '<b>toHaveBeen</b><b>CalledTimes</b> = 〜回呼ばれた', '呼ばれた回数', 'toHaveBeenCalledTimes＝何回。「1 回だけ取りに行く」を確かめる。多すぎる通信も見つけられる', 'fetchSlots', () => [], 'toHaveBeenCalledTimes', 1, '[data-test="status"]', { needMock: true, calls: (S) => S.api.calls }),
        A('flush', ['flushPromises', '()'], 'flush<b>Promises</b> = 約束を流し切る', '返事を画面に反映する', 'flushPromises＝Promise を流し切る。mockResolvedValue の返事が、画面に出るまで待つ。これが無いと、一覧は空のまま', 'await flushPromises()', '[data-test="status"]', async (S) => { await S.flush(); return { note: '→ 一覧は ' + S.w.findAll('li').length + ' 件' }; }),
        A('fake', ['vi.useFakeTimers', '()'], '<b>use</b>Fake<b>Timers</b> = 時計をにせものに', 'setTimeout を待たずに進める', 'useFakeTimers＝時計のにせもの。vi.advanceTimersByTime(ms) で、待たずに時間を進められる。終わったら vi.useRealTimers() で戻す', 'vi.useFakeTimers()', null, async (S) => { S.fake = true; return { note: '→ 時計を止めた。進めるのは advanceTimersByTime' }; }, { phase: 'pre' }),
        A('adv', ['vi.advanceTimersByTime', '(1500)'], 'advance<b>Timers</b>ByTime = 時間を進める', '1.5 秒、一瞬で進める', 'advanceTimersByTime＝時間を進める。useFakeTimers の後だけ使える。無しで呼ぶと「Timers are not mocked」と怒られる', 'vi.advanceTimersByTime(1500)', null, async (S) => (S.fake ? { note: '→ 1.5 秒ぶん、タイマーが動いた' } : { err: 'Timers are not mocked. Try calling "vi.useFakeTimers()" first.' })),
      ] },
    ];
    el.append(h('div', { class: 'vxU' }, S.el, h('div', { class: 'vxU-bar' }, h('button', { class: 'btn primary', style: { '--c': 'var(--vue)' }, onclick: () => S.press({ id: 'mount', mount: {}, ui: '[data-test="panel"]' }) }, '▶ mount（部品を描く）'), h('div', { class: 'vxU-say' }, '順番：vi.mock → mockResolvedValue → mount → flushPromises → toHaveBeenCalledWith')), board(S, G), NOTE('本物の通信は<b>遅くて不安定</b>。にせものなら<b>速くて毎回同じ</b>。<b>vi.mock</b> はファイルの先頭、<b>mockResolvedValue</b> は mount より前に書く。')));
  }

  /* ============================================================ 6. 骨組み（Vim の「保存・終了」にあたる） */
  function sceneFile(el) {
    const st = { imp: false, imp2: false, desc: false, it: false, exp: false, be: false, name: 'ReservePanel.test.ts', dir: '__tests__' };
    const tree = h('pre', { class: 'vxU-tree' }), codeHost = h('div', { style: { display: 'flex', flexDirection: 'column', flex: 1 } }), out = h('div', { class: 'vxU-run' });
    const T = { imp: "import { describe, it, expect, vi } from 'vitest'", imp2: "import { mount } from '@vue/test-utils'\nimport ReservePanel from '../ReservePanel.vue'", desc: "describe('ReservePanel', () => {", be: '  beforeEach(() => {\n    vi.clearAllMocks()\n  })', it: "  it('予約すると、残り枠が 1 減る', async () => {", mount: '    const wrapper = mount(ReservePanel)', exp: "    expect(wrapper.text()).toContain('残り 3 枠')" };
    const draw = (cur) => {
      const L = [];
      const add = (id, t) => t.split('\n').forEach((x) => L.push({ id, t: x }));
      if (st.imp) add('imp', T.imp); if (st.imp2) add('imp2', T.imp2);
      if (L.length) L.push({ t: '' });
      if (st.desc) add('desc', T.desc);
      if (st.desc && st.be) add('be', T.be);
      if (st.desc && st.it) { if (st.be) L.push({ t: '' }); add('it', T.it); if (st.exp) { add('exp', T.mount); add('exp', T.exp); } L.push({ id: 'it', t: '  })' }); }
      if (st.desc) L.push({ id: 'desc', t: '})' });
      const p = code(L.length ? L.map((l) => l.t).join('\n') : '// 下のカードを押すと、ここにファイルの部品が足される', 'ts', { color: VUE, file: 'src/components/' + (st.dir ? st.dir + '/' : '') + st.name, edit: false });
      p.style.cssText = 'margin:0;flex:1;font-size:.82rem';
      if (L.length) { const hi = []; L.forEach((l, i) => { if (l.id) { p.lines[i].setAttribute('data-k', l.id); if (cur && l.id === cur) hi.push(i + 1); } }); p.setHi(hi, 'on'); p.classList.add('dim'); }
      codeHost.replaceChildren(p);
      const nm = (t) => t.replace(/(\S+\.(test|spec)\.ts|ReservePanel\.ts$)/, '<b>$1</b>');
      tree.replaceChildren(...['src/', '└─ components/', '   ├─ ReservePanel.vue'].concat(st.dir ? ['   └─ ' + st.dir + '/', '      └─ ' + st.name] : ['   └─ ' + st.name]).map((l) => h('div', { html: nm(l) })));
    };
    const say = (c, t) => { out.append(h('div', { class: c }, t)); out.scrollTop = out.scrollHeight; };
    const named = () => /\.(test|spec)\./.test(st.name);
    const exec = (mode) => {
      say('mu', '$ ' + mode);
      if (!named()) { say('ng', 'No test files found, exiting with code 1'); say('mu', '　→ 名前に .test. か .spec. が必要（' + st.name + '）'); return; }
      if (!st.desc || !st.it || !st.exp) { say('ng', 'No test suite found in file ' + st.name); say('mu', '　→ describe / it / expect が揃っていない'); return; }
      if (!st.imp || !st.imp2) { say('ng', 'ReferenceError: describe is not defined（または mount）'); say('mu', '　→ import が足りない'); return; }
      say('ok', ' ✓ ' + st.name + ' (1)'); say('ok', '   ✓ ReservePanel > 予約すると、残り枠が 1 減る'); say('ok', ' Tests  1 passed (1)');
      say('mu', mode === 'vitest run' ? '（1 回だけ実行して、終了した）' : ' Waiting for file changes…（監視モード。q で終了）');
    };
    const C = (id, caps, en, jp, tip, press) => ({ id, caps, en, jp, tip, press });
    const need = (ok, msg, f) => () => { if (!ok()) { say('ng', '✖ ' + msg); return; } f(); };
    const G = [
      { t: 'ファイルの部品', en: 'STRUCTURE', c: TS, full: 3, keys: [
        C('imp', ['import', '{ describe, it, expect, vi }'], '<b>import</b> = 取り込む', 'vitest から道具を借りる', 'import＝取り込む。describe・it・expect（と、モックなら vi）を vitest から。設定で globals を有効にすれば、import なしでも使える', () => { st.imp = true; draw('imp'); }),
        C('imp2', ['import', '{ mount }'], '<b>import</b> = 部品と mount', '@vue/test-utils と、部品を取り込む', 'mount・shallowMount・flushPromises は @vue/test-utils から。テストする部品（.vue）も import する', () => { st.imp2 = true; draw('imp2'); }),
        C('desc', ['describe', "('部品名', () => {})"], '<b>describe</b> = 説明する', '1 つの部品のテストをまとめる箱', 'describe＝説明する。部品名を付けて、その部品のテストをまとめる。入れ子にもできる', () => { st.desc = true; draw('desc'); }),
        C('it', ['it', "('〜すると〜になる', () => {})"], '<b>it</b> = それは〜', '1 つの確認（test でも同じ）', 'it＝それ。「it（それは）〜する」と読む。test と同じ。名前は日本語で「〜すると〜になる」。1 つの it で 1 つの振る舞い', need(() => st.desc, 'it は describe の中に書く（先に describe）', () => { st.it = true; draw('it'); })),
        C('exp', ['expect', '(値).toBe(期待)'], '<b>expect</b> = 期待する', '結果を確かめる', 'expect＝期待する。expect が 1 つも無いテストは、何も確かめていないので意味がない（成功扱いになってしまう）', need(() => st.it, 'expect は it の中に書く（先に it）', () => { st.exp = true; draw('exp'); })),
        C('be', ['beforeEach', '(() => {})'], '<b>before</b><b>Each</b> = 毎回の前に', '各テストの前の準備', 'beforeEach＝毎回の前に。モックのリセット（vi.clearAllMocks）など、毎回やる準備をまとめる。後片付けは afterEach', need(() => st.desc, '先に describe', () => { st.be = true; draw('be'); })),
      ] },
      { t: '動かす（ターミナル）', en: 'RUN', c: TEAM, full: 3, keys: [
        C('run1', ['npx', 'vitest'], '<b>vitest</b> = 監視モード', '保存するたび、自動で再実行', 'npx vitest。開発中の基本。ファイルを保存するたびに、変えた部分のテストだけ走る', () => exec('npx vitest')),
        C('run2', ['vitest', 'run'], 'vitest <b>run</b> = 1 回だけ', '1 回だけ実行して終わる', 'vitest run。CI（自動チェック）向け。終わったら終了コードを返す', () => exec('vitest run')),
        C('run3', ['npm', 'run', 'test'], '<b>npm run test</b> = 登録した名前で', 'package.json の "test" を実行', 'package.json の scripts に "test": "vitest" と書いてあれば、npm run test で動く。チームではこの形で統一する', () => exec('npm run test')),
      ] },
      { t: 'ファイルの名前と場所', en: 'NAMING', c: PINK, full: 4, keys: [
        C('n1', ['*.test.ts'], '<b>.test.</b> = テスト', 'ReservePanel.test.ts', 'ファイル名に .test. か .spec. が入っていれば、Vitest が自動で見つけて実行する', () => { st.name = 'ReservePanel.test.ts'; draw(); }),
        C('n2', ['*.spec.ts'], '<b>.spec.</b> = 仕様', 'ReservePanel.spec.ts', 'spec＝specification（仕様）。.test. と同じ意味。チームでどちらかに統一する', () => { st.name = 'ReservePanel.spec.ts'; draw(); }),
        C('n3', ['__tests__/'], '<b>__tests__</b> = テスト置き場', 'テスト専用フォルダに置く／出す', '部品と同じ階層に __tests__ フォルダを作って置く方式。部品のとなりに置く方式でも動く。押すたびに切り替わる', () => { st.dir = st.dir ? '' : '__tests__'; draw(); }),
        C('n4', ['ReservePanel.ts'], '<b>名前が違う</b> = 見つからない', '.test. も .spec. も無い名前', '拡張子の前に .test. も .spec. も無いと、Vitest は「テストファイル」と思わず、No test files found になる。実行カードで確かめよう', () => { st.name = 'ReservePanel.ts'; draw(); }),
      ] },
    ];
    const S = { cards: {}, defs: {}, press: async (c) => { c.press(); }, hover: (id, on) => { const p = codeHost.querySelector('pre'); if (p) p.querySelectorAll('.ln[data-k="' + id + '"]').forEach((n) => { n.classList.toggle('vxU-hot', on); n.style.setProperty('--hc', '#ff6b9d'); }); if (S.cards[id]) S.cards[id].classList.toggle('vxU-hot', on); } };
    draw();
    el.append(h('div', { class: 'vxU' }, h('div', { class: 'vxU-stage' },
      h('div', { class: 'vxU-box' }, h('div', { class: 'vxU-tt' }, '📁 ファイルの置き場'), tree, h('div', { class: 'vxU-tt' }, '💻 実行結果（「動かす」のカードを押す）'), out),
      h('div', { class: 'vxU-box' }, h('div', { class: 'vxU-tt' }, '✍ テストファイル（カードを押すと部品が足される）'), codeHost)),
    LB('🎹 上から順に押して、最後に「動かす」。足りないときのエラーも見てみよう'), board(S, G), NOTE('動かすコマンドは <b>vitest</b>。名前に <b>.test.</b> か <b>.spec.</b>。<b>describe</b> の中に <b>it</b>、その中に <b>expect</b>。')));
  }

  /* ============================================================ 7. 実践 */
  function scenePractice(el) {
    const S = sandbox({});
    const aw = (S) => (S.awaitOn ? 'await ' : '');
    const bs = '[data-test="reserve"]';
    const G = [
      { t: 'Arrange（準備）', en: 'ARRANGE', c: TS, keys: [
        { id: 'p-mount', caps: ['mount', '(ReservePanel)'], en: '<b>mount</b> = 取り付ける', jp: '部品を出す', tip: '最初の 1 行。部品を出して wrapper を受け取る', mount: {}, ui: '[data-test="panel"]' },
        { id: 'p-shallow', caps: ['shallowMount', '(ReservePanel)'], en: '<b>shallow</b>Mount', jp: '子をスタブにして出す', tip: '今回の目的（残り枠の確認）には不要。子まで描く mount で十分', mount: { shallow: true }, ui: 'ul' },
      ] },
      { t: 'Act（操作）', en: 'ACT', c: TEAM, keys: [
        A('p-trig', ['trigger', "('click')"], '<b>trig</b>ger = 引き金を引く', '予約ボタンを押す', 'await を付けて、画面の更新を待つ', (S) => aw(S) + "wrapper.find('" + bs + "').trigger('click')", bs, async (S) => { const p = S.w.find(bs).trigger('click'); if (S.awaitOn) await p; return { note: S.awaitOn ? '→ 画面を更新した' : '⚠ await が無い：画面はまだ古い' }; }),
        A('p-val', ['setValue', "('山田 太郎')"], '<b>set</b>Value', '氏名を入力する', '今回の目的（残り枠）とは関係ない操作。不要な操作は書かない', (S) => aw(S) + "wrapper.find('input').setValue('山田 太郎')", '[data-test="name"]', async (S) => { const p = S.w.find('input').setValue('山田 太郎'); if (S.awaitOn) await p; return {}; }),
      ] },
      { t: 'Assert（確認）', en: 'ASSERT', c: PINK, full: 4, keys: [
        X('p-text', ['toContain'], '<b>toContain</b> = 〜を含む', '「残り 2 枠」になった', 'text() に「残り 2 枠」が含まれるか。予約を 1 回押したあとの画面を確かめる', 'wrapper.text()', (S) => S.w.text(), 'toContain', '残り 2 枠', '[data-test="remaining"]', { hint: 'trigger に await が無いと、画面は古い（残り 3 枠）のまま' }),
        X('p-emit', ['emitted'], '<b>emit</b>ted = 発信された記録', 'reserve が [2] で emit された', "emitted('reserve')?.[0] が [2]（残り枠）か。emit は同期なので、await が無くても読める", "wrapper.emitted('reserve')?.[0]", (S) => (S.w.emitted('reserve') || [])[0], 'toEqual', [2], bs, { hint: '先に予約ボタンを押す' }),
        X('p-btn', ['toBe'], '<b>toBe</b> = ぴったり', 'ボタンの文字は「予約する」', '押す前は「予約する」。1 回押しただけなら、まだ満席ではない', "wrapper.find('" + bs + "').text()", (S) => S.w.find(bs).text(), 'toBe', '予約する', bs),
        X('p-bad', ['toContain'], '<b>toContain</b>（まちがい例）', '押したあとで「残り 3 枠」', 'わざと間違えた期待値。押したあとなのに「残り 3 枠」と書くと ✖ になる。✖ の読み方（expected … to contain …）を覚える', 'wrapper.text()', (S) => S.w.text(), 'toContain', '残り 3 枠', '[data-test="remaining"]'),
      ] },
    ];
    const MI = [
      ['① Arrange：mount で部品を出す', (S) => !!S.w],
      ['② Act：予約ボタンを trigger（await あり）', (S) => S.body.some((l) => /await .*trigger\('click'\)/.test(l.text))],
      ['③ Assert：「残り 2 枠」を expect で確かめて ✓', (S) => S.body.some((l) => /残り 2 枠/.test(l.text)) && S.results[S.results.length - 1] === true],
      ['④ 順番が Arrange → Act → Assert', (S) => { const t = S.body.map((l) => l.text).join('\n'); const a = t.search(/trigger/), b = t.search(/expect/); return !!S.w && a >= 0 && b > a; }],
    ];
    const mis = h('div', { class: 'vxU-mis' }), verdict = h('div', { class: 'vxU-say' }, '下のカードを、Arrange → Act → Assert の順に押そう');
    const upd = () => {
      mis.replaceChildren(...MI.map(([t, f]) => h('div', { class: 'vxU-mi' + (f(S) ? ' done' : '') }, (f(S) ? '✓ ' : '・ ') + t)));
      const all = MI.every(([, f]) => f(S)), bad = S.results.includes(false);
      verdict.className = 'vxU-say' + (all ? ' ok' : bad ? ' bad' : '');
      verdict.textContent = all ? '🎉 完成！ このテストは緑（passed）。そのままコピーして使える形' : bad ? '✖ 赤いテスト：expected / received を見比べて直そう（⟲ 最初から）' : '下のカードを、Arrange → Act → Assert の順に押そう';
    };
    const orig = S.press; S.press = async (c) => { await orig(c); upd(); };
    const rs = S.reset; S.reset = () => { rs(); upd(); };
    const REF = [['Vue Test Utils', 'https://test-utils.vuejs.org/', '公式ガイド。mount と wrapper の使い方'], ['VTU API リファレンス', 'https://test-utils.vuejs.org/api/', 'find・trigger・emitted などの一覧'], ['Vitest ガイド', 'https://vitest.dev/guide/', 'テストランナー。describe・expect・vi の説明']];
    el.append(h('div', { class: 'vxU' }, S.el, h('div', { class: 'vxU-bar' }, verdict), h('div', { class: 'vxU-box' }, h('div', { class: 'vxU-tt' }, '🎯 ミッション'), mis), board(S, G),
      LB('📖 公式（詳しい API の一覧）'), h('div', { class: 'vxU-three' }, ...REF.map(([t, u, d]) => h('a', { class: 'vxU-link', href: u, target: '_blank', rel: 'noopener' }, h('b', t + ' ↗'), h('small', d))))));
    upd();
  }
  const REFPANEL = [{ title: '公式の参考リンク', icon: 'book-open', html: '<div style="display:grid;gap:8px"><a href="https://test-utils.vuejs.org/" target="_blank" rel="noopener"><b>Vue Test Utils</b></a><span style="font-size:.85rem;opacity:.8">公式ガイド</span><a href="https://test-utils.vuejs.org/api/" target="_blank" rel="noopener"><b>VTU API</b></a><span style="font-size:.85rem;opacity:.8">wrapper のメソッド一覧</span><a href="https://vitest.dev/guide/" target="_blank" rel="noopener"><b>Vitest ガイド</b></a><span style="font-size:.85rem;opacity:.8">テストランナー</span></div>' }];

  /* メイン教材の一部として、vue-test の 2 番目（「mount → find → trigger → expect」の次）へ入れる */
  const NEWSCENES = [
      { t: '描く：mount と shallowMount', tag: 'MOUNT', lead: '<b>mount</b> で部品を画面に出し、<b>オプション</b>で状態を決める。', render: sceneMount },
      { t: '探す：find と get', tag: 'FIND', lead: '<b>find</b> は無くても止まらず、<b>get</b> は無いと<b>例外</b>。', render: sceneFind },
      { t: '操作する：trigger と setValue', tag: 'ACT', lead: '<b>trigger</b> や <b>setValue</b> で操作し、更新は <b>await</b> で待つ。', render: sceneAct },
      { t: '確かめる：expect と matcher', tag: 'ASSERT', lead: '<b>text()</b> などで値を読み、<b>expect</b> の matcher で確かめる。', render: sceneAssert },
      { t: 'にせものを使う：vi.fn と vi.mock', tag: 'MOCK', lead: '<b>vi.fn</b> と <b>vi.mock</b> で通信を<b>にせもの</b>に替え、速く・毎回同じ結果にする。', render: sceneMock },
      { t: 'テストの骨組み：describe と it', tag: 'FILE', lead: '<b>describe</b> の中に <b>it</b>、その中に <b>expect</b>。<b>vitest</b> で動かす。', render: sceneFile },
      { t: '実践：1本のテストを組み立てる', tag: 'PRACTICE', lead: '<b>Arrange → Act → Assert</b> の順にカードを押して、緑のテストを完成させる。', render: scenePractice, ref: REFPANEL },
  ];
  (function wait(n) {
    const L = K.lessons && K.lessons['vue-test'];
    if (!L) { if (n < 200) setTimeout(() => wait(n + 1), 50); return; }
    if (L.__cmdIns) return; L.__cmdIns = 1;
    const at = Math.max(1, L.scenes.findIndex((x) => x.t === 'mount → find → trigger → expect') + 1);
    L.scenes.splice(at, 0, ...NEWSCENES);
  })(0);
})();
