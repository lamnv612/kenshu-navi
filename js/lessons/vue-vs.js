/* K.vs — 「ない場合」と「ある場合」を左右に並べる共通部品（新しい概念の導入シーン用）
   使い方:
     el.append(K.vs.versus({
       banner: '最初の一言（困りごと）',
       bar: [{ label: '▶ 押してみる', primary: true, onclick: (ctx) => { … } }, { label: '⟲ 最初から', onclick: (ctx) => ctx.reset() }],
       without: { title: 'ない場合：…', file: 'main.js', lang: 'js', src: '…', ui: (ctx) => ({ el, reset }) , keys: { name: ['token', …] } },
       with:    { title: 'ある場合：…', file: 'CaseList.vue', lang: 'vue', src: '…', ui: (ctx) => ({ el, reset }), keys: { … } },
     }))
   UI の中の部品には data-k="name" を付ける → カーソルを乗せると、対応するコードの行が光る（逆に、コードの行に乗せると UI 部品が光る）。
   ctx: { banner(text, kind 'bad'|'ok'|'warn'|''), hi(side, keyOrTokens|null), fly(fromEl, toEl, text, color), pre:{without,with}, ui:{without,with}, reset(), sleep(ms), bump(el) } */
(function () {
  'use strict';
  const K = window.KENSHU;
  if (!K || !K.W) return;
  const { h, code, style } = K.W;
  style('vsx', `
  .vs{display:grid;gap:14px;min-width:0}
  .vs-bar{display:flex;gap:10px;align-items:stretch;flex-wrap:wrap}
  .vs-bar .btn{height:46px;padding:0 1.3em;display:inline-flex;align-items:center;gap:.5em;font-size:.95rem}
  .vs-banner{flex:1;min-width:240px;display:flex;align-items:center;padding:0 16px;min-height:46px;border-radius:12px;border:2px solid var(--line);background:var(--card);font:800 .98rem/1.5 var(--font);transition:.25s}
  .vs-banner.bad{border-color:var(--bad);background:color-mix(in srgb,var(--bad) 12%,var(--card));color:var(--bad)}
  .vs-banner.ok{border-color:var(--ok);background:color-mix(in srgb,var(--ok) 12%,var(--card));color:var(--ok)}
  .vs-banner.warn{border-color:var(--team);background:color-mix(in srgb,var(--team) 12%,var(--card));color:var(--team)}
  .vs-cols{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px;align-items:stretch}
  @supports (grid-template-rows:subgrid){@media(min-width:981px){
    .vs-cols{grid-template-rows:auto auto 1fr;row-gap:0}
    .vs-side{grid-row:1/4;grid-template-rows:subgrid;row-gap:10px}
  }}
  @media(max-width:980px){.vs-cols{grid-template-columns:1fr}}
  .vs-side{position:relative;display:grid;grid-template-rows:auto auto 1fr;gap:10px;padding:12px;border-radius:14px;border:2px solid var(--line);background:var(--card);min-width:0}
  .vs-side.no{border-color:color-mix(in srgb,var(--bad) 55%,var(--line))}.vs-side.yes{border-color:color-mix(in srgb,var(--ok) 55%,var(--line))}
  .vs-tt{display:flex;align-items:center;gap:8px;font:900 1rem var(--font)}
  .vs-side.no .vs-tt{color:var(--bad)}.vs-side.yes .vs-tt{color:var(--ok)}
  .vs-side.vue{border-color:color-mix(in srgb,var(--vue) 60%,var(--line))}.vs-side.vue .vs-tt{color:var(--vue)}
  .vs-side.react{border-color:color-mix(in srgb,#61dafb 60%,var(--line))}.vs-side.react .vs-tt{color:#61dafb}
  .vs-ui{position:relative;border-radius:12px;background:#f4f6fb;color:#1f2a44;padding:14px;min-height:190px;display:grid;gap:8px;align-content:start;min-width:0}
  .vs-ui [data-k]{border-radius:8px;outline:2px solid transparent;outline-offset:2px;transition:outline-color .15s,background .15s;cursor:default}
  .vs-ui [data-k].vs-hot{outline-color:var(--c,#2f7bff)}
  .vs-ui [data-k].vs-hot:not(button):not(input):not(select):not(textarea):not([class*='pin']):not([class*='badge']):not([class*='chip']){background:color-mix(in srgb,var(--c,#2f7bff) 14%,transparent)}
  .vs-code{min-width:0;max-height:360px;overflow:auto;border-radius:10px;display:flex;flex-direction:column}
  .vs-code>pre.code{flex:1 1 auto}
  .vs-fold{display:block;cursor:pointer;color:var(--mute);font-style:italic;padding:3px 0;opacity:.85;user-select:none}.vs-fold:hover{color:var(--text);opacity:1}
  .vs-tg{all:unset;cursor:pointer;margin-left:auto;padding:.25em .8em;border-radius:99px;border:1px solid var(--line);background:var(--card2);color:var(--mute);font:800 .78rem var(--font)}.vs-tg:hover{color:var(--text);border-color:var(--ts)}
  .vs-code pre.code{margin:0;font-size:.92rem}
  .vs-pkt{position:absolute;left:0;top:0;z-index:9;padding:.2em .85em;border-radius:99px;color:#06101f;font:900 .82rem var(--mono);box-shadow:0 6px 18px rgba(0,0,0,.35);pointer-events:none;white-space:nowrap}
  .vs-bump{animation:vsb .7s}@keyframes vsb{30%{transform:scale(1.08);box-shadow:0 0 0 5px color-mix(in srgb,var(--ok) 45%,transparent)}}
  `);
  const lns = (src, toks) => { const o = []; src.split('\n').forEach((l, i) => { if ((toks || []).some((t) => l.includes(t))) o.push(i + 1); }); return o; };
  const COLORS = ['#ff6b9d', '#5b9dff', '#ffb454', '#2fd4a4', '#a98bff', '#ff8a5b'];
  style('vsHotLink', `
  [data-k].vs-hot{outline:2px solid var(--c,#2f7bff)!important;outline-offset:2px;box-shadow:0 0 0 5px color-mix(in srgb,var(--c,#2f7bff) 22%,transparent)}
  [data-k].vs-hot:not(button):not(input):not(select):not(textarea):not(.btn):not([class*='pin']):not([class*='badge']):not([class*='chip']){background-color:color-mix(in srgb,var(--c,#2f7bff) 14%,transparent)}
  [data-k].vs-hot[class*='pin']{background:var(--c,#2f7bff)!important;color:#06101f!important;transform:scale(1.2)}
  button[data-k].vs-hot,[data-k].vs-hot button{filter:none!important;opacity:1!important}
  `);
  K.vs = {
    /* 既存のシーンにも「UI にカーソル → 対応するコードの行が光る（逆も）」を付ける。
       link(root, pre, map, opts): root 内の [data-k="キー"] 部品 ⇄ pre（code() の結果）の行。map = { キー: [行に含まれる文字列, …] }
       opts.rest: カーソルを外したとき、元の強調に戻す関数（行番号の配列 or () => 行番号の配列）。省略時は全部消す。 */
    link(root, pre, map, opts) {
      opts = opts || {};
      if (!root || !pre || !pre.lines) return;
      const keys = Object.keys(map), txt = () => pre.lines.map((l) => l.textContent);
      const lines = (toks) => { const o = []; txt().forEach((l, i) => { if ((toks || []).some((t) => l.includes(t))) o.push(i + 1); }); return o; };
      const rest = () => { const r = typeof opts.rest === 'function' ? opts.rest() : (opts.rest || []); pre.setHi(r || [], opts.cls || 'on'); };
      const on = (k) => { pre.setHi(lines(map[k]), opts.cls || 'on'); root.querySelectorAll('[data-k]').forEach((n) => n.classList.toggle('vs-hot', n.getAttribute('data-k') === k)); };
      const off = () => { rest(); root.querySelectorAll('[data-k].vs-hot').forEach((n) => n.classList.remove('vs-hot')); };
      const COLS = ['#ff6b9d', '#5b9dff', '#ffb454', '#2fd4a4', '#a98bff', '#ff8a5b'];
      keys.forEach((k, i) => {
        root.querySelectorAll('[data-k="' + k + '"]').forEach((n) => { if (n.__vsl) return; n.__vsl = 1; n.style.setProperty('--c', COLS[i % COLS.length]); n.addEventListener('mouseenter', () => on(k)); n.addEventListener('mouseleave', off); });
      });
      pre.lines.forEach((ln) => { if (ln.__vsl) return; ln.__vsl = 1; ln.addEventListener('mouseenter', () => { const k = keys.find((kk) => (map[kk] || []).some((t) => ln.textContent.includes(t))); if (k) on(k); }); ln.addEventListener('mouseleave', off); });
    },
    versus(o) {
      const ctx = { pre: {}, ui: {}, keys: {}, srcs: {} };
      const side = (name, cfg, cls) => {
        const pre = code(cfg.src, cfg.lang || 'vue', { color: cls === 'no' ? 'var(--bad)' : cls === 'vue' ? 'var(--vue)' : cls === 'react' ? '#61dafb' : 'var(--ok)', file: cfg.file, dim: true, edit: false });
        ctx.pre[name] = pre; ctx.srcs[name] = cfg.src; ctx.keys[name] = cfg.keys || {};
        const u = cfg.ui(ctx) || {}; ctx.ui[name] = u;
        const uiBox = h('div', { class: 'vs-ui' }, u.el);
        // UI ⇄ コード の hover 連動
        const keys = Object.keys(ctx.keys[name]);
        keys.forEach((k, i) => { const col = COLORS[i % COLORS.length]; uiBox.querySelectorAll('[data-k="' + k + '"]').forEach((n) => { n.style.setProperty('--c', col); n.addEventListener('mouseenter', () => ctx.hi(name, k)); n.addEventListener('mouseleave', () => ctx.hi(name, null)); }); });
        if (pre.lines) pre.lines.forEach((ln, idx) => { ln.addEventListener('mouseenter', () => { const k = keys.find((kk) => (ctx.keys[name][kk] || []).some((t) => ln.textContent.includes(t))); if (k) ctx.hi(name, k); }); ln.addEventListener('mouseleave', () => ctx.hi(name, null)); });
        /* コードは「要点だけ」を初期表示にする（import や宣言など、いまの説明に関係ない行はたたむ。押すと全部見える） */
        const srcLines = cfg.src.split('\n'), keep = new Set(), anchors = cfg.show || [].concat(...Object.values(cfg.keys || {}));
        srcLines.forEach((l, i) => { if (anchors.some((t) => l.includes(t))) { keep.add(i - 1); keep.add(i); keep.add(i + 1); } });
        const hiddenN = srcLines.filter((_, i) => !keep.has(i)).length;
        const canFold = cfg.fold !== false && pre.lines && hiddenN >= 3 && keep.size > 0;
        let folded = canFold;
        const tg = h('button', { class: 'vs-tg', type: 'button', title: 'コードの表示を切り替える' });
        const applyFold = () => {
          pre.querySelectorAll('.vs-fold').forEach((n) => n.remove());
          pre.lines.forEach((ln, i) => { ln.style.display = folded && !keep.has(i) ? 'none' : ''; });
          if (folded) {
            let i = 0; while (i < srcLines.length) { if (!keep.has(i)) { let j = i; while (j < srcLines.length && !keep.has(j)) j++; const m = h('span', { class: 'ln vs-fold', onclick: () => { folded = false; applyFold(); } }, '⋯ ' + (j - i) + ' 行 省略（クリックで全部見る）'); pre.lines[i].before(m); i = j; } else i++; }
          }
          tg.textContent = folded ? '全部のコードを見る' : '要点だけにする';
        };
        tg.onclick = () => { folded = !folded; applyFold(); };
        if (canFold) applyFold();
        return h('div', { class: 'vs-side ' + cls }, h('div', { class: 'vs-tt' }, (cls === 'no' ? '✖ ' : cls === 'yes' ? '✓ ' : (cfg.icon ? cfg.icon + ' ' : '')) + cfg.title, canFold ? tg : null), uiBox, h('div', { class: 'vs-code' }, pre));
      };
      ctx.hi = (name, key) => {
        const pre = ctx.pre[name], box = pre && pre.closest('.vs-side'); if (!pre) return;
        let toks = []; let k = null;
        if (Array.isArray(key)) toks = key; else if (key) { toks = ctx.keys[name][key] || []; k = key; }
        pre.setHi(lns(ctx.srcs[name], toks));
        if (box) box.querySelectorAll('.vs-ui [data-k]').forEach((n) => n.classList.toggle('vs-hot', !!k && n.getAttribute('data-k') === k));
      };
      const banner = h('div', { class: 'vs-banner' }, o.banner || '');
      ctx.banner = (t, kind) => { banner.className = 'vs-banner ' + (kind || ''); banner.textContent = t; };
      ctx.sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      ctx.bump = (el) => { if (!el) return; el.classList.remove('vs-bump'); void el.offsetWidth; el.classList.add('vs-bump'); };
      ctx.fly = async (from, to, text, col) => {
        if (!from || !to) return;
        const host = from.closest('.vs-ui') || ctx.root, hr = host.getBoundingClientRect(), a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
        const el = h('span', { class: 'vs-pkt', style: { background: col || '#2fd4a4' } }, text); host.append(el);
        const w = el.offsetWidth, hh = el.offsetHeight, pt = (r) => ({ x: r.left - hr.left + r.width / 2 - w / 2, y: r.top - hr.top + r.height / 2 - hh / 2 });
        const A = pt(a), B = pt(b);
        try { await el.animate([{ transform: `translate(${A.x}px,${A.y}px) scale(.6)`, opacity: 0 }, { transform: `translate(${A.x}px,${A.y}px) scale(1)`, opacity: 1, offset: .15 }, { transform: `translate(${B.x}px,${B.y}px) scale(1)`, opacity: 1, offset: .85 }, { transform: `translate(${B.x}px,${B.y}px) scale(.6)`, opacity: 0 }], { duration: 1000, easing: 'ease-in-out' }).finished; } catch (e) { /* 途中で消えてもよい */ }
        el.remove();
      };
      ctx.reset = () => { ['without', 'with'].forEach((n) => { ctx.ui[n] && ctx.ui[n].reset && ctx.ui[n].reset(); ctx.hi(n, null); }); ctx.banner(o.banner || '', ''); };
      const left = side('without', o.without, o.neutral ? (o.without.tone || 'vue') : 'no'), right = side('with', o.with, o.neutral ? (o.with.tone || 'react') : 'yes');
      const bar = h('div', { class: 'vs-bar' }, ...(o.bar || []).map((b) => h('button', { class: 'btn' + (b.primary ? ' primary' : (b.ghost ? ' ghost' : '')), style: b.primary ? { '--c': 'var(--vue)' } : {}, onclick: () => b.onclick(ctx) }, b.label)), banner);
      const root = h('div', { class: 'vs' }, bar, h('div', { class: 'vs-cols' }, left, right));
      ctx.root = root;
      return root;
    },
  };
})();
