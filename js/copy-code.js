/* コードブロックの右上にホバーでコピーボタンを出す（全ブロック共通・1個を使い回し） */
(function () {
  const { h, icon, style } = window.KENSHU.W;
  style('cpbtn', `
  .cpbtn{position:fixed;z-index:99999;width:32px;height:32px;display:none;place-items:center;border-radius:8px;border:1px solid rgba(255,255,255,.25);background:rgba(30,34,70,.92);color:#d8dcff;cursor:pointer;padding:0;transition:background .15s,color .15s}
  .cpbtn.show{display:grid}.cpbtn:hover{background:var(--ts);color:#fff}.cpbtn.ok{background:var(--ok);color:#fff;border-color:var(--ok)}
  .cpbtn .ic{width:16px;height:16px}`);
  const btn = h('button', { class: 'cpbtn', type: 'button', title: 'コードをコピー', 'aria-label': 'コードをコピー' }, icon('copy'));
  document.body.append(btn);
  let cur = null, timer = null;
  const target = (el) => (el && el.closest ? el.closest('pre.code, .ed') : null);
  const textOf = (b) => {
    const ta = b.querySelector && b.querySelector('textarea');
    if (ta) return ta.value;
    const ln = b.querySelectorAll('.ln');
    return ln.length ? [...ln].map((x) => x.textContent.replace(/ /g, '')).join('\n') : b.textContent;
  };
  const place = () => {
    if (!cur || !cur.isConnected) return hide();
    const r = cur.getBoundingClientRect();
    if (r.bottom < 40 || r.top > innerHeight || r.width < 80) return hide();
    btn.style.top = Math.max(r.top, 0) + 6 + 'px';
    btn.style.left = Math.min(r.right, innerWidth) - 38 + 'px';
    btn.classList.add('show');
  };
  const hide = () => { btn.classList.remove('show', 'ok'); btn.replaceChildren(icon('copy')); cur = null; };
  document.addEventListener('mouseover', (e) => {
    if (e.target === btn || btn.contains(e.target)) { clearTimeout(timer); return; }
    const t = target(e.target);
    if (t) { clearTimeout(timer); if (t !== cur) { cur = t; btn.classList.remove('ok'); btn.replaceChildren(icon('copy')); } place(); }
    else if (cur) { clearTimeout(timer); timer = setTimeout(hide, 250); }
  });
  document.addEventListener('pointerdown', (e) => { if (e.pointerType === 'touch') { const t = target(e.target); if (t) { cur = t; place(); } } }, true);
  window.addEventListener('scroll', () => cur && place(), true);
  window.addEventListener('resize', () => cur && place());
  btn.addEventListener('click', async (e) => {
    e.stopPropagation();
    if (!cur) return;
    const txt = textOf(cur);
    try { await navigator.clipboard.writeText(txt); }
    catch (_) { const ta = h('textarea', { style: { position: 'fixed', opacity: 0 } }); ta.value = txt; document.body.append(ta); ta.select(); try { document.execCommand('copy'); } catch (__) {} ta.remove(); }
    btn.classList.add('ok'); btn.replaceChildren(icon('check')); btn.title = 'コピーしました';
    clearTimeout(timer); timer = setTimeout(() => { btn.classList.remove('ok'); btn.replaceChildren(icon('copy')); btn.title = 'コードをコピー'; }, 1400);
  });
})();
