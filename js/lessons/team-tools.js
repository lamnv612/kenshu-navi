/* Lessons (team workshop tools): idea, dev, prep, demo, qa */
(function () {
  'use strict';
  const K = window.KENSHU, { h, code, stepper, quiz, lbl, style, store, celebrate, clamp } = K.W;
  const uid = () => Math.random().toString(36).slice(2, 8);
  const pad = (n) => String(Math.floor(n)).padStart(2, '0');
  const mmss = (s) => pad(s / 60) + ':' + pad(s % 60);
  const cl = (ctx, f) => ctx && ctx.cleanups && ctx.cleanups.push(f);
  const quizScene = (t, tag, lead, why, Q) => ({
    t, tag, lead, why,
    render(el) { el.append(h('div', { class: 'tt-qz' }, Q.map(([q, o, a, w]) => h('div', { class: 'card' }, quiz({ q, options: o, answer: a, why: w }))))); },
  });
  style('tt-q', `
  .tt-qz{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;align-items:start}
  @media(max-width:900px){.tt-qz{grid-template-columns:1fr}}
  .tt-wip{margin-top:6px;padding:.5em .8em;border-radius:8px;background:color-mix(in srgb,var(--bad) 16%,transparent);border:1px solid var(--bad);color:#ffb3bc;font-weight:800;font-size:.8rem;animation:shake .4s}
  `);

  style('tt', `
  .tt-timer{display:flex;align-items:center;gap:18px;flex-wrap:wrap;padding:14px 18px;border-radius:var(--r);background:var(--card);border:1px solid var(--line)}
  .tt-ring{position:relative;width:128px;height:128px;flex:none}
  .tt-ring svg{width:100%;height:100%;transform:rotate(-90deg)}
  .tt-ring circle{fill:none;stroke-width:9;stroke-linecap:round}
  .tt-ring .bg{stroke:var(--line)}.tt-ring .fg{stroke:var(--c,var(--team));transition:stroke-dashoffset .3s linear;filter:drop-shadow(0 0 6px var(--c,var(--team)))}
  .tt-time{position:absolute;inset:0;display:grid;place-items:center;font:800 1.5rem var(--mono)}
  .tt-timer.big .tt-ring{width:260px;height:260px}.tt-timer.big .tt-time{font-size:3.6rem}
  .tt-timer.ended .tt-ring{animation:pulse 1s ease-in-out 4}.tt-timer.ended .tt-time{color:var(--pink)}
  .tt-msg{font-weight:800;min-height:1.5em;color:var(--mute)}
  .tt-timer.ended .tt-msg{color:var(--pink)}
  .tt-wall{position:relative;height:440px;border-radius:var(--r);border:2px dashed var(--line);background:radial-gradient(circle at 1px 1px,var(--line) 1px,transparent 0) 0 0/22px 22px;overflow:hidden;touch-action:none}
  .tt-note{position:absolute;width:156px;min-height:96px;padding:10px 12px 30px;border-radius:6px 6px 14px 6px;color:#1b1b2f;font-weight:700;font-size:.875rem;line-height:1.4;cursor:grab;box-shadow:0 10px 18px -8px rgba(0,0,0,.5);transform:rotate(var(--rot,0deg));transition:box-shadow .2s,transform .2s;animation:pop .45s both;user-select:none;word-break:break-word}
  .tt-note.drag{cursor:grabbing;box-shadow:0 24px 30px -10px rgba(0,0,0,.6);transform:rotate(0) scale(1.07);z-index:50}
  .tt-note .ft{position:absolute;left:8px;right:8px;bottom:4px;display:flex;justify-content:space-between;align-items:center}
  .tt-note button{all:unset;cursor:pointer;font-size:.75rem;padding:1px 7px;border-radius:6px;background:rgba(0,0,0,.12);font-weight:800;transition:.15s}
  .tt-note button:hover{background:rgba(0,0,0,.28);transform:scale(1.12)}
  .tt-note .x{position:absolute;top:2px;right:4px;font-size:.75rem;opacity:.5}
  .tt-cats{display:flex;gap:6px;flex-wrap:wrap}
  .tt-cat{all:unset;cursor:pointer;padding:.25em .8em;border-radius:6px;font-weight:800;font-size:.875rem;border:2px solid var(--cc);color:var(--cc);transition:.2s}
  .tt-cat.on,.tt-cat:hover{background:var(--cc);color:#1b1b2f;transform:translateY(-2px)}
  .tt-in{font:inherit;padding:.55em .9em;border-radius:8px;border:1px solid var(--line);background:var(--bg2);color:var(--text);outline:none;transition:.2s;width:100%}
  .tt-in:focus{border-color:var(--c,var(--team));box-shadow:0 0 0 3px color-mix(in srgb,var(--c,var(--team)) 30%,transparent)}
  textarea.tt-in{resize:vertical;min-height:70px}
  .tt-canvas{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .tt-canvas label{display:grid;gap:4px;font-weight:800;font-size:.875rem}
  .tt-prev{border-radius:10px;padding:22px;color:#fff;background:linear-gradient(135deg,var(--a,#ff6b9d),var(--b,#5b9dff));box-shadow:0 24px 50px -22px var(--b,#5b9dff);display:grid;gap:12px;position:sticky;top:76px;transition:background .5s}
  .tt-prev h3{font-size:1.5rem;line-height:1.2;font-weight:900}
  .tt-prev .sec{background:rgba(255,255,255,.18);border-radius:8px;padding:.6em .9em;backdrop-filter:blur(4px);font-size:.875rem;white-space:pre-wrap}
  .tt-prev .sec b{display:block;font-size:.68rem;letter-spacing:.14em;opacity:.85}
  .tt-seg{display:flex;gap:4px;height:46px;border-radius:8px;overflow:hidden}
  .tt-seg div{display:grid;place-items:center;font-weight:800;font-size:.75rem;background:color-mix(in srgb,var(--sc) 20%,var(--card));color:var(--mute);transition:.5s;flex-basis:0;min-width:0;overflow:hidden;white-space:nowrap;position:relative}
  .tt-seg div.on{background:var(--sc);color:#06101f;transform:scaleY(1.12);box-shadow:0 8px 22px -8px var(--sc)}
  .tt-seg div i{position:absolute;left:0;bottom:0;height:4px;background:rgba(255,255,255,.8);width:0}
  .tt-quote{padding:14px 18px;border-radius:8px;background:var(--card2);border-left:5px solid var(--c);font-weight:700;margin-top:10px;animation:capin .4s both}
  .tt-kb{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
  .tt-col{border-radius:var(--r);background:var(--card);border:2px solid var(--line);padding:10px;min-height:260px;transition:.2s;display:flex;flex-direction:column;gap:8px}
  .tt-col.over{border-color:var(--cc);background:color-mix(in srgb,var(--cc) 12%,var(--card));transform:scale(1.015)}
  .tt-col h4{display:flex;justify-content:space-between;color:var(--cc);font-weight:900}
  .tt-card{padding:.6em .8em;border-radius:8px;background:var(--card2);border:1px solid var(--line);cursor:grab;font-weight:700;font-size:.875rem;display:flex;gap:8px;align-items:center;animation:pop .35s both;transition:.2s}
  .tt-card:hover{transform:translateY(-2px);border-color:var(--cc)}.tt-card.dragging{opacity:.4}
  .tt-card span{flex:1;word-break:break-word}
  .tt-card button{all:unset;cursor:pointer;opacity:.5;padding:0 4px}.tt-card button:hover{opacity:1;color:var(--cc)}
  .tt-prog{display:flex;align-items:center;gap:16px}
  .tt-flow{display:flex;gap:4px;flex-wrap:nowrap;align-items:center;justify-content:center;padding:18px;border-radius:var(--r);background:var(--card);border:1px solid var(--line)}
  .tt-fn{padding:.8em 1em;border-radius:8px;text-align:center;font-weight:900;background:var(--card2);border:2px solid var(--line);opacity:.4;transition:.5s;min-width:0;flex:1 1 0;font-size:.8rem;padding:.7em .3em}
  .tt-fn b{display:block;font-size:1.25rem}.tt-fn.on{opacity:1;border-color:var(--c);transform:translateY(-6px) scale(1.06);box-shadow:0 14px 26px -12px var(--c)}
  .tt-ar{color:var(--mute);font-weight:900;transition:.4s}.tt-ar.on{color:var(--c);transform:scale(1.4)}
  .tt-tree{display:grid;gap:12px}
  .tt-crumb{display:flex;gap:6px;flex-wrap:wrap}
  .tt-crumb span{font-size:.75rem;font-weight:800;padding:.1em .7em;border-radius:6px;background:var(--card2);border:1px solid var(--line);color:var(--mute)}
  .tt-q{font-size:1.25rem;font-weight:900;animation:slide .4s both}
  .tt-opt{all:unset;cursor:pointer;display:block;padding:.8em 1.1em;border-radius:8px;border:1px solid var(--line);background:var(--card);font-weight:800;transition:.2s;margin-bottom:8px}
  .tt-opt:hover{transform:translateX(8px);border-color:var(--c);background:var(--card2)}
  .tt-leaf{padding:18px;border-radius:var(--r);background:linear-gradient(135deg,color-mix(in srgb,var(--ok) 20%,var(--card)),var(--card));border:1px solid var(--ok);animation:pop .5s both}
  .tt-leaf li{margin:.3em 0 .3em 1.2em}
  .tt-bar{height:10px;background:var(--line);border-radius:6px;overflow:hidden}.tt-bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--c,var(--team)),var(--pink));transition:width .6s cubic-bezier(.2,.9,.3,1.2)}
  .tt-splits{display:flex;height:54px;border-radius:8px;overflow:hidden;gap:3px}
  .tt-splits div{position:relative;display:grid;place-items:center;background:color-mix(in srgb,var(--sc) 18%,var(--card));font-weight:800;font-size:.75rem;overflow:hidden;text-align:center;line-height:1.2}
  .tt-splits div i{position:absolute;inset:0;background:var(--sc);opacity:.85;transform-origin:left;transform:scaleX(0)}
  .tt-splits div span{position:relative;color:var(--text);mix-blend-mode:normal}
  .tt-splits div.on span{color:#06101f}
  .tt-slot{font:900 clamp(2rem,6vw,3.6rem) var(--font);text-align:center;padding:26px 14px;border-radius:var(--r);background:var(--code);color:#fff;min-height:120px;display:grid;place-items:center;border:2px solid var(--line);overflow:hidden}
  .tt-slot.spin{border-color:var(--pink);box-shadow:0 0 34px -8px var(--pink)}
  .tt-order{display:grid;gap:8px;counter-reset:o}
  .tt-order div{counter-increment:o;display:flex;gap:12px;align-items:center;padding:.6em 1em;border-radius:8px;background:var(--card);border:1px solid var(--line);font-weight:800;animation:pop .5s both}
  .tt-order div::before{content:counter(o);width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:var(--team);color:#06101f;font-weight:900}
  .tt-order div.cur{border-color:var(--team);background:color-mix(in srgb,var(--team) 20%,var(--card));transform:scale(1.03)}
  .tt-order div.past{opacity:.4}
  .tt-stars{display:flex;gap:2px}.tt-stars button{all:unset;cursor:pointer;font-size:1.5rem;filter:grayscale(1) brightness(.7);transition:.2s}
  .tt-stars button.on{filter:none;transform:scale(1.12)}.tt-stars button:hover{transform:scale(1.35) rotate(12deg)}
  .tt-ax{display:grid;grid-template-columns:90px 1fr 48px;gap:10px;align-items:center;font-weight:800;margin:6px 0}
  .tt-ax b{font:800 1rem var(--mono);text-align:right}
  .tt-q{display:flex;gap:12px;align-items:flex-start;padding:12px 14px;border-radius:8px;background:var(--card);border:1px solid var(--line);animation:pop .4s both;transition:.3s}
  .tt-q.done{opacity:.55;border-color:var(--ok)}.tt-q.done .qt{text-decoration:line-through}
  .tt-q .qt{flex:1;font-weight:700;word-break:break-word}
  .tt-up{all:unset;cursor:pointer;text-align:center;padding:.3em .6em;border-radius:8px;border:2px solid var(--vue);color:var(--vue);font-weight:900;min-width:48px;transition:.2s}
  .tt-up:hover{background:var(--vue);color:#06101f;transform:translateY(-3px)}
  .tt-acc{border-radius:8px;border:1px solid var(--line);background:var(--card);margin-bottom:8px;overflow:hidden}
  .tt-acc>button{all:unset;cursor:pointer;display:flex;justify-content:space-between;width:100%;box-sizing:border-box;padding:.8em 1.1em;font-weight:800}
  .tt-acc>button::after{content:"＋";transition:.3s;color:var(--vue)}.tt-acc.open>button::after{transform:rotate(135deg)}
  .tt-set{display:flex;align-items:center;gap:6px;color:var(--mute);font-weight:700}.tt-min{width:4.2em;padding:8px 8px;border-radius:8px;border:1px solid var(--line);background:var(--card);color:var(--text);font:inherit;text-align:center}
  .tt-acc .bd{display:grid;grid-template-rows:0fr;transition:grid-template-rows .35s}.tt-acc.open .bd{grid-template-rows:1fr}
  .tt-acc .bd>div{overflow:hidden}.tt-acc .bd p{padding:0 1.1em 1em;color:var(--mute)}
  @media(max-width:700px){.tt-kb,.tt-canvas{grid-template-columns:1fr}}
  `);

  /* ---------- shared widgets ---------- */
  function timer(ctx, o = {}) {
    const color = o.color || 'var(--team)';
    let total = o.secs || 300, left = total, run = false, end = 0, iv = null;
    const C = 2 * Math.PI * 52;
    const fg = h('circle', { class: 'fg', cx: 60, cy: 60, r: 52 });
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 120 120');
    const mk = (cls) => { const c = document.createElementNS(NS, 'circle'); c.setAttribute('class', cls); c.setAttribute('cx', 60); c.setAttribute('cy', 60); c.setAttribute('r', 52); return c; };
    const bg = mk('bg'), f = mk('fg'); f.style.strokeDasharray = C; svg.append(bg, f);
    const disp = h('div', { class: 'tt-time' });
    const msg = h('div', { class: 'tt-msg' }, 'スタートで開始');
    const root = h('div', { class: 'tt-timer' + (o.big ? ' big' : ''), style: { '--c': color } });
    const go = h('button', { class: 'btn primary', onclick: () => (run ? pause() : start()) }, '▶ スタート');
    function draw() {
      disp.textContent = mmss(Math.ceil(left));
      f.style.strokeDashoffset = C * (1 - left / total);
      go.textContent = run ? '⏸ 一時停止' : left < total && left > 0 ? '▶ 再開' : '▶ スタート';
    }
    function tick() {
      left = Math.max(0, (end - Date.now()) / 1000); draw();
      if (o.warn && left <= o.warn && left > 0) msg.textContent = '⏰ 残りわずか！';
      if (left <= 0) { stop(); root.classList.add('ended'); msg.textContent = '🔔 時間です！おつかれさま'; o.onEnd && o.onEnd(); }
    }
    function start() { if (left <= 0) reset(); root.classList.remove('ended'); run = true; end = Date.now() + left * 1000; iv = setInterval(tick, 200); msg.textContent = o.runMsg || '集中！'; draw(); }
    function stop() { run = false; clearInterval(iv); draw(); }
    function pause() { stop(); msg.textContent = '一時停止中'; }
    function reset(s) { stop(); if (s) total = s; left = total; root.classList.remove('ended'); msg.textContent = 'スタートで開始'; draw(); }
    const presets = (o.presets || []).map((m) => h('button', { class: 'btn ghost', onclick: () => reset(m * 60) }, m + '分'));
    const cust = h('input', { class: 'tt-min', type: 'number', min: 1, max: 180, value: Math.round(total / 60), 'aria-label': '分' });
    const setMin = () => { const v = Math.max(1, Math.min(180, parseInt(cust.value, 10) || 0)); if (!v) return; cust.value = v; reset(v * 60); };
    cust.addEventListener('keydown', (e) => { if (e.key === 'Enter') setMin(); });
    const custBox = h('div', { class: 'tt-set' }, cust, h('span', '分'), h('button', { class: 'btn ghost', onclick: setMin }, '設定'));
    root.append(h('div', { class: 'tt-ring' }, svg, disp), h('div', { class: 'col', style: { flex: 1, minWidth: '160px' } },
      o.label ? h('b', o.label) : null, msg, h('div', { class: 'row' }, go, h('button', { class: 'btn ghost', onclick: () => reset() }, '⟲'), presets, custBox)));
    draw(); cl(ctx, () => clearInterval(iv));
    root.reset = reset;
    return root;
  }

  function checklist(key, items, color) {
    const saved = store.get(key, {});
    const bar = h('div', { class: 'tt-bar', style: { '--c': color || 'var(--team)', marginTop: '14px' } }, h('i'));
    const num = h('b', { style: { fontFamily: 'var(--mono)' } });
    const isOpt = (it) => !!(it[3] && it[3].opt);
    const reqIdx = items.map((_, i) => i).filter((i) => !isOpt(items[i]));
    let fired = false;
    const upd = () => {
      const n = reqIdx.filter((i) => saved[i]).length;
      bar.firstChild.style.width = (n / reqIdx.length) * 100 + '%'; num.textContent = `${n} / ${reqIdx.length}`;
      if (n === reqIdx.length && !fired) { fired = true; celebrate(); } else if (n < reqIdx.length) fired = false;
    };
    const row = ([e, a, b, x], i) => {
      const c = h('div', { class: 'check' + (saved[i] ? ' ok' : '') + (x && x.opt ? ' opt' : ''), onclick: () => { saved[i] = !saved[i]; c.classList.toggle('ok', !!saved[i]); store.set(key, saved); upd(); } },
        h('span', { class: 'bx' }, '✓'), h('span', { style: { fontSize: '1.5rem' } }, e), h('div', { style: { flex: 1 } }, a, b ? h('small', b) : null), x ? K.W.hintButton({ label: a, hint: x.hint, answer: x.answer }) : null);
      return c;
    };
    const list = h('div', { class: 'col' }, reqIdx.map((i) => row(items[i], i)));
    const optIdx = items.map((_, i) => i).filter((i) => isOpt(items[i]));
    const optBox = optIdx.length ? h('div', { class: 'col', style: { marginTop: '10px' } }, h('div', { class: 'mission-opt-head' }, h('span', { class: 'opt-badge' }, '任意'), h('b', 'チャレンジ'), h('small', 'もっと挑戦したい人だけ。やらなくても OK')), optIdx.map((i) => row(items[i], i))) : null;
    const root = h('div', null, list, optBox, h('div', { class: 'row', style: { marginTop: '10px', justifyContent: 'space-between' } }, lbl('達成度（必須のみ）'), num), bar);
    fired = reqIdx.every((i) => saved[i]); upd();
    return root;
  }

  function stars(val, onchange) {
    const root = h('div', { class: 'tt-stars' });
    const draw = (v) => [...root.children].forEach((b, i) => b.classList.toggle('on', i < v));
    for (let i = 1; i <= 5; i++) root.append(h('button', { type: 'button', onclick: () => { draw(i); root.value = i; onchange && onchange(i); } }, '⭐'));
    root.value = val; draw(val);
    root.set = (v) => { root.value = v; draw(v); };
    return root;
  }

  /* ================= idea ================= */
  const CATS = [['💡 アイデア', '#ffe066'], ['❗ 課題', '#ff9ec4'], ['🧑 ユーザー', '#8ec5ff'], ['⚙️ 技術', '#a7f0c0']];

  K.reg({
    id: 'idea', track: 'team', title: 'アイデア発想 → 発表', sub: 'ブレスト・企画・ピッチ', emoji: '💡',
    scenes: [
      {
        t: 'ブレスト・ウォール', tag: 'BRAINSTORM', lead: 'まず数を出そう。<b>否定しない</b>。付箋は<b>ドラッグ</b>で動かせる。❤️で投票もできる。',
        why: {pv: {"k": "flow", "items": [{"i": "message-square", "t": "最初の案", "c": "bad"}, {"i": "x", "t": "「無理」と評価", "c": "bad"}, {"i": "ban", "t": "他の案が止まる", "c": "bad"}]}, iv: {"k": "flow", "items": ["expand|広げる（否定しない）", "filter|絞る（基準で選ぶ）"]}, av: {"k": "chips", "items": ["sticky-note|1人1枚 同時に", "heart|投票"]}, "problem": "最初に出た案に引っぱられて、他の案が出てこない", "idea": "まず数を出す。選ぶのはそのあと。出している間は否定しない。", "answer": "1枚1案の付箋を全員で同時に書く → ❤️で投票", "when": [["アイデアを増やす", "広げる（否定しない）"], ["絞り込む", "絞る（基準を決めて投票）"]]},
        answer: { html: '<p style="color:var(--mute);font-size:.875rem;margin-bottom:.6em">例：付箋の出し方</p><ul><li><b>困りごと</b>：勉強が続かない／ToDo がたまる／質問しづらい</li><li><b>アイデア</b>：学習ログ／タイマー／ごほうびバッジ／チームの進捗ボード</li><li>ポイント：「無理」と言わない。まず数を出して、あとで ❤️ で選ぶ。</li></ul>' },
        render(el, ctx) {
          let notes = store.get('tt.idea.notes', null);
          if (!notes) notes = [
            { id: uid(), t: '勉強の進捗を見える化', c: 0, x: 24, y: 24, v: 1 }, { id: uid(), t: 'ToDoが続かない', c: 1, x: 220, y: 70, v: 0 }, { id: uid(), t: '新入社員の私たち', c: 2, x: 420, y: 30, v: 0 }];
          const save = () => store.set('tt.idea.notes', notes);
          let cat = 0;
          const wall = h('div', { class: 'tt-wall' });
          const wallTop = { z: 1 };
          function draw() {
            wall.replaceChildren();
            notes.forEach((n) => {
              const col = CATS[n.c][1];
              const vote = h('button', { onclick: (e) => { e.stopPropagation(); n.v++; save(); draw(); } }, '❤️ ' + n.v);
              const note = h('div', { class: 'tt-note', style: { left: n.x + 'px', top: n.y + 'px', background: col, '--rot': ((n.id.charCodeAt(0) % 7) - 3) + 'deg' } },
                h('span', n.t), h('div', { class: 'ft' }, h('small', CATS[n.c][0].split(' ')[0]), vote),
                h('button', { class: 'x', title: '削除', onclick: () => { notes = notes.filter((x) => x !== n); save(); draw(); } }, '✕'));
              let ox = 0, oy = 0, drag = false;
              note.addEventListener('pointerdown', (e) => {
                if (e.target.closest('button')) return;
                drag = true; const r = note.getBoundingClientRect(); ox = e.clientX - r.left; oy = e.clientY - r.top;
                note.classList.add('drag'); note.style.zIndex = ++wallTop.z + 50;
                note.setPointerCapture && note.setPointerCapture(e.pointerId);
              });
              note.addEventListener('pointermove', (e) => {
                if (!drag) return; const r = wall.getBoundingClientRect();
                n.x = clamp(e.clientX - r.left - ox, 0, r.width - 156); n.y = clamp(e.clientY - r.top - oy, 0, r.height - 100);
                note.style.left = n.x + 'px'; note.style.top = n.y + 'px';
              });
              const up = () => { if (!drag) return; drag = false; note.classList.remove('drag'); save(); };
              note.addEventListener('pointerup', up); note.addEventListener('pointercancel', up);
              wall.append(note);
            });
          }
          const inp = h('input', { class: 'tt-in', placeholder: 'アイデアを書いて Enter', maxlength: 40, onkeydown: (e) => { if (e.key === 'Enter') add(); } });
          const add = () => {
            const t = inp.value.trim(); if (!t) return;
            notes.push({ id: uid(), t, c: cat, x: 30 + Math.random() * 520, y: 20 + Math.random() * 280, v: 0 }); inp.value = ''; save(); draw();
          };
          const cats = h('div', { class: 'tt-cats' }, CATS.map(([n, c], i) => h('button', { class: 'tt-cat' + (i === 0 ? ' on' : ''), style: { '--cc': c }, onclick: (e) => { cat = i; cats.querySelectorAll('.tt-cat').forEach((b, k) => b.classList.toggle('on', k === i)); } }, n)));
          el.append(timer(ctx, { secs: 600, presets: [5, 10, 15], label: '⏱ ブレスト タイマー', warn: 30 }),
            h('div', { class: 'col', style: { marginTop: '14px' } }, cats, h('div', { class: 'row' }, h('div', { style: { flex: 1, minWidth: '200px' } }, inp), h('button', { class: 'btn primary', onclick: add }, '＋ 貼る')), wall,
              h('div', { class: 'row' }, h('button', { class: 'btn ghost', onclick: () => { notes = []; save(); draw(); } }, '🗑 全部はがす'),
                h('span', { style: { color: 'var(--mute)', fontSize: '.875rem' } }, '❤️が多い付箋が、次のステップの候補！'))));
          draw();
        },
      },
      {
        t: 'アイデアキャンバス', tag: 'CANVAS', lead: '4つの箱を埋めると<b>企画カード</b>ができる。右のカードは、そのまま発表に使える。',
        why: {pv: {"k": "flow", "items": [{"i": "lightbulb", "t": "良さそうな案", "c": "bad"}, {"i": "circle-help", "t": "誰の困りごと？", "c": "bad"}, {"i": "map", "t": "作って迷子", "c": "bad"}]}, iv: {"k": "flow", "items": ["user|誰の", "triangle-alert|どんな困りごと", "circle-check|どう解く"]}, av: {"k": "chips", "items": ["Who", "Problem", "Solution", "Features"]}, "problem": "良さそうな案でも「誰の何の困りごとか」が曖昧で、作り始めて迷子になる", "idea": "作る前に「誰の・何の困りごとを・どう解くか」を1枚に書く。", "answer": "4つの箱（Who / Problem / Solution / Features）", "when": [["Problem が書けない", "まだ作らず、調べ直す"], ["機能が多すぎる", "最小の1機能に絞る"]]},
        answer: { html: '<p style="color:var(--mute);font-size:.875rem;margin-bottom:.6em">例：学習トラッカー</p><ul><li><b>Who（誰の）</b>：新入社員（プログラミング初心者）</li><li><b>Problem（困りごと）</b>：学んだことが続かない・見えない</li><li><b>Solution（解決）</b>：毎日の学習を記録して、成長をグラフで見せる</li><li><b>Features（機能）</b>：ログ入力 / グラフ表示 / 連続日数バッジ</li></ul>' },
        render(el) {
          const d = Object.assign({ name: '学習トラッカー', who: '新入社員', problem: '学んだことが続かない・見えない', sol: '毎日の学習を記録して成長を見える化', feat: 'ログ入力\nグラフ表示\n連続日数バッジ' }, store.get('tt.idea.canvas', {}));
          const palettes = [['#ff6b9d', '#5b9dff'], ['#6fdc7c', '#2fd4a4'], ['#ffb454', '#ff6b9d'], ['#a98bff', '#5b9dff']];
          let pi = d.pi || 0;
          const prev = h('div', { class: 'tt-prev' });
          const draw = () => {
            prev.style.setProperty('--a', palettes[pi][0]); prev.style.setProperty('--b', palettes[pi][1]);
            prev.replaceChildren(h('h3', d.name || '（アプリ名）'),
              ...[['WHO ・ 誰の', d.who], ['PROBLEM ・ 課題', d.problem], ['SOLUTION ・ 解決', d.sol], ['FEATURES ・ 機能', (d.feat || '').split('\n').filter(Boolean).map((x) => '✦ ' + x).join('\n')]].map(([a, b]) => h('div', { class: 'sec' }, h('b', a), b || '…')));
            d.pi = pi; store.set('tt.idea.canvas', d);
          };
          const field = (k, jp, tag, ph) => h('label', jp, tag === 'ta' ? h('textarea', { class: 'tt-in', placeholder: ph, oninput: (e) => { d[k] = e.target.value; draw(); } }, d[k]) : h('input', { class: 'tt-in', value: d[k], placeholder: ph, oninput: (e) => { d[k] = e.target.value; draw(); } }));
          const sw = h('div', { class: 'row' }, h('span', { style: { fontWeight: 800, fontSize: '.875rem' } }, 'カラー'), palettes.map(([a, b], i) => h('button', { class: 'btn ghost', style: { padding: '.3em .9em', background: `linear-gradient(135deg,${a},${b})`, border: 0, width: '46px', height: '28px' }, onclick: () => { pi = i; draw(); } })));
          el.append(h('div', { class: 'split wide-l' },
            h('div', { class: 'col' }, h('div', { class: 'tt-canvas' }, field('name', 'アプリ名', 'in', '例: StudyLog'), field('who', '👤 誰の？', 'in', 'ターゲット'), field('problem', '❗ 課題', 'ta', '困っていること'), field('sol', '💡 解決策', 'ta', 'どう解決する？')), field('feat', '🧩 主な機能（1行に1つ）', 'ta', '機能を3つ'), sw),
            prev));
          draw();
        },
      },
      {
        t: '30秒ピッチ', tag: 'PITCH', lead: 'ピッチは<b>4つのパート</b>だけでいい。「次へ」で流れを見て、3分タイマーで練習しよう。',
        why: {pv: {"k": "flow", "items": [{"i": "mic", "t": "長い説明", "c": "bad"}, {"i": "circle-help", "t": "「で、何が言いたいの？」", "c": "bad"}]}, iv: {"k": "flow", "items": ["ear|聞き手の頭の順序に", "list-ordered|話す順番を合わせる"]}, av: {"k": "chips", "items": ["課題 8秒", "解決 8秒", "デモ 10秒", "学び 4秒"]}, "problem": "説明が長くて「で、何が言いたいの？」と思われる", "idea": "聞く人が知りたい順に話す。困りごと → 解決 → デモ → 学び。", "answer": "4つのパートで30秒（課題・解決・デモ・学び）", "when": [["時間が短い", "課題と解決だけ残す"], ["技術が主役", "学びを厚く"]]},
        answer: { html: '<p style="color:var(--mute);font-size:.875rem;margin-bottom:.6em">例：学習トラッカー（30秒）</p><ul><li><b>課題（8秒）</b>：新入社員は、学んだことが続かなくて困っています。</li><li><b>解決（8秒）</b>：そこで、毎日の学習を記録して成長が見えるアプリを作りました。</li><li><b>デモ（10秒）</b>：ここで入力すると、グラフが伸びます。</li><li><b>学び（4秒）</b>：TypeScript の型が、いちばん助けになりました。</li></ul>' },
        render(el, ctx) {
          const P = [['課題', 8, 'var(--pink)', '❗', '「〇〇な人は、△△で困っています。」'], ['解決', 8, 'var(--ts)', '💡', '「そこで□□というアプリを作りました。」'], ['デモ', 10, 'var(--vue)', '🎬', '「実際に動かしてみます。ここを押すと…」'], ['学び', 4, 'var(--team)', '🌱', '「TypeScriptの型が一番助けになりました。」']];
          const seg = h('div', { class: 'tt-seg' }, P.map(([n, s, c, e]) => h('div', { style: { '--sc': c, flexGrow: s } }, e + ' ' + n + ' ' + s + '秒', h('i'))));
          const quote = h('div', { class: 'tt-quote', style: { '--c': 'var(--team)' } });
          el.append(stepper({
            color: 'var(--team)',
            steps: [{ say: '30秒ピッチ全体。<b>短く・1つのメッセージ</b>。' }, ...P.map(([n, s, , , ex]) => ({ say: `<b>${n}</b>（${s}秒）— ${ex}` }))],
            init(vis) { vis.style.minHeight = '120px'; vis.append(seg, quote); },
            update(n) {
              [...seg.children].forEach((d, i) => d.classList.toggle('on', n === 0 ? false : i === n - 1));
              quote.style.setProperty('--c', n ? P[n - 1][2] : 'var(--team)');
              quote.textContent = n ? P[n - 1][4] : '🎤 4パートを順番に話すだけ！';
            },
          }));
          el.append(h('div', { style: { marginTop: '18px' } }, lbl('本番 3分タイマー'), timer(ctx, { secs: 180, presets: [1, 3, 5], label: '🎤 発表', warn: 20, color: 'var(--pink)' })));
        },
      },
      quizScene('広げる？ 絞る？ どっち？', 'THINK', 'ブレストは<b>2つのモード</b>を切り替えるゲーム。今どっち？ を判断してみよう。',
        { pv: {"k": "flow", "items": [{"i": "message-square", "t": "途中で評価", "c": "bad"}, {"i": "x", "t": "案がしぼむ", "c": "bad"}]}, iv: {"k": "flow", "items": ["expand|広げる", "filter|絞る"]}, av: {"k": "chips", "items": ["否定しない", "基準で投票"]}, problem: '案出しの途中で評価を始めて、アイデアがしぼむ。逆に、絞らず全部作ろうとして終わらない', idea: '「増やす時間」と「選ぶ時間」を分ける。', answer: '広げる時間は否定しない／絞る時間は基準を決めて投票', when: [['案が足りない', '広げる：量を出す'], ['案が多すぎる', '絞る：基準で選ぶ'], ['誰の困りごとか不明', 'キャンバスで言葉にする']] },
        [['ブレスト中、誰かの案に「それは無理」と言いたくなった。', ['すぐ指摘する', '評価は後。まず別の案を足す', '黙って聞くだけ'], 1, '広げる時間のルールは「否定しない」。評価は絞る時間にまとめてやる。'],
          ['アイデアが20個出た。次にやることは？', ['全部作る', '基準（誰の・実現性・面白さ）を決めて投票する', '最初の案に決める'], 1, '基準を決めてから絞ると、納得感が出る。'],
          ['キャンバスの Problem 欄が書けない。', ['とりあえず作り始める', '誰の困りごとか、調べ直す', '機能欄を増やす'], 1, '困りごとが曖昧なまま作ると、迷子になる。']]),
    ],
  });

  /* ================= dev ================= */
  const KB = [['todo', '📝 Todo', 'var(--ts)'], ['doing', '🔥 Doing', 'var(--team)'], ['done', '✅ Done', 'var(--ok)']];
  const DEBUG = {
    start: { q: '何が起きている？', o: [['画面が真っ白／エラーが出る', 'err'], ['動くけど結果が違う', 'wrong'], ['書き方が分からない', 'how'], ['変更が反映されない', 'nochange']] },
    err: { q: 'ブラウザのコンソール（F12）に赤いエラーは出てる？', o: [['出てる', 'readerr'], ['何も出ない', 'nologs']] },
    readerr: { tip: '🔍 エラー文は最高のヒント', items: ['赤い文を<b>1行目から</b>読む', '<code class="i">ファイル名:行番号</code> をクリックして該当行へ', 'エラー文をそのままコピーして検索 / AI に聞く'] },
    nologs: { tip: '🕵️ 目に見えない原因を探す', items: ['<b>Elements</b> タブで要素が存在するか確認', '<b>Network</b> タブでリクエスト失敗がないか確認', '<code class="i">console.log("ここまで来た")</code> を置いて通過確認'] },
    wrong: { q: '入力値（変数の中身）は期待どおり？', o: [['console.log したら正しい', 'logic'], ['値がそもそもおかしい', 'val'], ['まだ確認してない', 'val']] },
    logic: { tip: '🧮 ロジックを疑う', items: ['条件式（<code class="i">===</code> と <code class="i">==</code>、<code class="i">&&</code> と <code class="i">||</code>）を見直す', '紙に処理の流れを書いてみる', '期待値と実際の値を並べて比較'] },
    val: { tip: '📍 値の流れを遡る', items: ['<code class="i">console.log(変数)</code> を<b>入口</b>と<b>出口</b>に置く', '型は合ってる？ <code class="i">typeof</code> で確認', 'どこで値が変わったか、半分ずつ絞り込む'] },
    how: { q: '調べたり AI に聞いたりした？', o: [['まだ', 'search'], ['聞いたけど解決しない', 'ask']] },
    search: { tip: '🔎 まず言葉にする', items: ['「<b>何を</b>したいか」を1文で書く', '公式ドキュメント / MDN で検索', 'AI に <b>やりたいこと + 今のコード + エラー</b> を渡す'] },
    ask: { tip: '🙋 10分悩んだら声をかけよう', items: ['隣のメンバーに画面を見せて<b>説明</b>（説明するだけで解決することも！）', '講師に気軽に質問', '質問は「やったこと・期待・実際」の3点セットで'] },
    nochange: { tip: '♻️ 反映されない時の定番', items: ['ファイルを<b>保存</b>した？（⌘S）', 'ブラウザを<b>強制リロード</b>（⌘⇧R）', '開発サーバーは動いてる？ ターミナルを確認', 'ファイルパス・ファイル名の打ち間違いチェック'] },
  };

  K.reg({
    id: 'dev', track: 'team', title: '開発', sub: 'チーム開発の進め方', emoji: '👩‍💻',
    scenes: [
      {
        t: 'カンバンボード', tag: 'KANBAN', lead: 'タスクを<b>ドラッグ</b>して Todo → Doing → Done へ動かそう。チームの今の状況が、ひと目で分かる。',
        why: {pv: {"k": "flow", "items": [{"i": "users", "t": "見えない", "c": "bad"}, {"i": "copy", "t": "かぶる", "c": "bad"}, {"i": "triangle-alert", "t": "止まる", "c": "bad"}]}, iv: {"k": "flow", "items": ["eye|見える化", "gauge|同時進行を絞る"]}, av: {"k": "flow", "items": ["list|Todo", "loader|Doing", "check|Done"]}, "problem": "誰が何をやっているか見えず、作業がかぶる。止まっていても気づけない", "idea": "作業を板に貼って見えるようにする。同時にやる数は少なくする。", "answer": "Todo / Doing / Done のボード", "when": [["Doing が3つ以上", "まず1つ完了させる"], ["詰まった", "Doing に置いたまま相談"]]},
        answer: { html: '<p style="color:var(--mute);font-size:.875rem;margin-bottom:.6em">例：いい感じの板</p><ul><li><b>Todo</b>：README を書く／デザインを整える</li><li><b>Doing</b>：ref でカウンターを作る（<b>1〜2枚まで</b>）</li><li><b>Done</b>：画面のワイヤーフレーム</li></ul><p>ポイント：Doing を増やしすぎない。1枚終わってから次を引く。</p>' },
        render(el) {
          let tasks = store.get('tt.dev.tasks', [{ id: uid(), t: '画面のワイヤーフレーム', s: 'done' }, { id: uid(), t: 'ref でカウンターを作る', s: 'doing' }, { id: uid(), t: 'コンポーネントを分割', s: 'todo' }, { id: uid(), t: 'README を書く', s: 'todo' }]);
          const save = () => store.set('tt.dev.tasks', tasks);
          const NSs = 'http://www.w3.org/2000/svg';
          const ringBox = h('div', { class: 'tt-prog' });
          const board = h('div', { class: 'tt-kb' });
          const inp = h('input', { class: 'tt-in', placeholder: '新しいタスクを追加 → Enter', onkeydown: (e) => { if (e.key === 'Enter' && inp.value.trim()) { tasks.push({ id: uid(), t: inp.value.trim(), s: 'todo' }); inp.value = ''; save(); draw(); } } });
          const move = (id, s) => { const t = tasks.find((x) => x.id === id); if (t) { t.s = s; save(); draw(); } };
          function ring() {
            const p = tasks.length ? tasks.filter((t) => t.s === 'done').length / tasks.length : 0, C = 2 * Math.PI * 34;
            const svg = document.createElementNS(NSs, 'svg'); svg.setAttribute('viewBox', '0 0 80 80'); svg.style.cssText = 'width:84px;height:84px;transform:rotate(-90deg)';
            const mk = (s, w) => { const c = document.createElementNS(NSs, 'circle'); c.setAttribute('cx', 40); c.setAttribute('cy', 40); c.setAttribute('r', 34); c.setAttribute('fill', 'none'); c.setAttribute('stroke', s); c.setAttribute('stroke-width', 8); c.setAttribute('stroke-linecap', 'round'); return c; };
            const bg = mk('rgba(128,128,160,.25)'), fg = mk('#4ade80'); fg.style.cssText = `stroke-dasharray:${C};stroke-dashoffset:${C * (1 - p)};transition:stroke-dashoffset .6s`;
            svg.append(bg, fg);
            ringBox.replaceChildren(svg, h('div', h('b', { style: { fontSize: '2rem' } }, Math.round(p * 100) + '%'), h('div', { style: { color: 'var(--mute)', fontSize: '.75rem', fontWeight: 700 } }, `${tasks.filter((t) => t.s === 'done').length} / ${tasks.length} 完了`)));
            if (p === 1 && tasks.length) celebrate();
          }
          function draw() {
            board.replaceChildren(...KB.map(([k, jp, c], ci) => {
              const items = tasks.filter((t) => t.s === k);
              const col = h('div', { class: 'tt-col', style: { '--cc': c } }, h('h4', h('span', jp), h('span', items.length)));
              col.addEventListener('dragover', (e) => { e.preventDefault(); col.classList.add('over'); });
              col.addEventListener('dragleave', () => col.classList.remove('over'));
              col.addEventListener('drop', (e) => { e.preventDefault(); col.classList.remove('over'); move(e.dataTransfer.getData('text/plain'), k); });
              items.forEach((t) => {
                const card = h('div', { class: 'tt-card', draggable: 'true' },
                  ci > 0 ? h('button', { title: '戻す', onclick: () => move(t.id, KB[ci - 1][0]) }, '◀') : null, h('span', t.t),
                  ci < 2 ? h('button', { title: '進める', onclick: () => move(t.id, KB[ci + 1][0]) }, '▶') : h('button', { title: '削除', onclick: () => { tasks = tasks.filter((x) => x !== t); save(); draw(); } }, '✕'));
                card.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', t.id); card.classList.add('dragging'); });
                card.addEventListener('dragend', () => card.classList.remove('dragging'));
                col.append(card);
              });
              if (k === 'doing' && items.length > 2) col.append(h('div', { class: 'tt-wip' }, '⚠️ 同時進行が多すぎ！ まず1つ完了させよう'));
              return col;
            }));
            ring();
          }
          el.append(h('div', { class: 'row', style: { marginBottom: '14px', justifyContent: 'space-between' } }, ringBox, h('div', { style: { flex: 1, minWidth: '220px' } }, inp)), board);
          draw();
        },
      },
      {
        t: '1日の流れ と Git', tag: 'FLOW', lead: '開発の基本の流れ。<b>branch → commit → push → PR</b>。「次へ」で1ステップずつ見よう。右上の <b>今日の習慣</b> アイコンにチェックリストがある。',
        why: {pv: {"k": "flow", "items": [{"i": "file-pen", "t": "main を直接", "c": "bad"}, {"i": "x", "t": "壊れた", "c": "bad"}, {"i": "search", "t": "誰が？", "c": "bad"}]}, iv: {"k": "flow", "items": ["git-branch|枝で分ける", "save|小さく保存", "git-pull-request|見てから合流"]}, av: {"k": "code", "lang": "sh", "text": "git switch -c feature/x\ngit commit\ngit push", "ok": [1, 2, 3]}, "problem": "main を直接書き換えて壊す。いつ誰が何を変えたか追えない", "idea": "main とは別の枝で作業する。小さく保存して、見てもらってから main に入れる。", "answer": "branch → commit → push → PR → merge", "when": [["新しい作業", "必ず新しい branch"], ["commit", "小さく・意味のある単位"], ["迷う変更", "PR で相談"]]},
        answer: { code: '# 朝：最新にして、作業用の枝を作る\ngit switch main && git pull\ngit switch -c feature/login\n\n# 作業のあと：小さく保存\ngit add .\ngit commit -m "ログイン画面を追加"\n\n# 夕方：送って、見てもらう\ngit push -u origin feature/login\n# → GitHub で Pull Request を作る', lang: 'sh', file: 'terminal' },
        ref: [{ title: '今日の習慣', icon: 'list-checks', node: () => checklist('tt.dev.daily', [['☀️', '朝会：今日やることを共有', null, { hint: ['今日やることを、チームに1分で話す。'], answer: '例：「今日は、ログイン画面を作ります」' }], ['🌿', 'ブランチを切ってから作業', null, { hint: ['main では作業しない。作業用の枝を作る。'], answer: { code: 'git switch -c feature/login', lang: 'sh', file: 'terminal' } }], ['💾', 'こまめに commit', null, { hint: ['区切りのいいところで、小さく保存する。'], answer: { code: 'git add .\ngit commit -m "ログイン画面を追加"', lang: 'sh', file: 'terminal' } }], ['🙌', '夕会：進捗と困りごとを共有', null, { hint: ['進んだことと、困っていることを話す。'], answer: '例：「画面は完成。バリデーションで困っています」' }], ['📝', 'PR の説明に「何を・なぜ・どう確かめたか」を書く', null, { opt: 1, hint: ['PR を見る人は、何も知らない。3つの見出しで説明しよう。', '「何を」「なぜ」「どう確かめたか」の順に書く。'], answer: { code: '## 何を\nログイン画面を追加した\n\n## なぜ\nユーザーがログインできるようにするため\n\n## どう確かめたか\nnpm run dev で、入力→ログインできることを確認', lang: 'text' } }]]) }],
        render(el) {
          const F = [['🌿', 'branch', 'git switch -c feature/login', '作業用の枝を作る。mainは触らない！'], ['💾', 'commit', 'git add .\ngit commit -m "ログイン画面を追加"', '小さく・意味のある単位で保存'], ['☁️', 'push', 'git push -u origin feature/login', 'GitHub にアップロード'], ['🔀', 'Pull Request', '# GitHub で "Compare & pull request"', 'チームにレビューをお願いする'], ['🎉', 'merge', 'git switch main && git pull', 'mainに取り込んで最新化']];
          const flow = h('div', { class: 'tt-flow' });
          F.forEach(([e, n], i) => { flow.append(h('div', { class: 'tt-fn', style: { '--c': 'var(--team)' } }, h('b', e), n)); if (i < F.length - 1) flow.append(h('span', { class: 'tt-ar' }, '➜')); });
          const cbox = h('div');
          el.append(stepper({
            color: 'var(--team)', interval: 2200,
            steps: F.map(([, n, , d]) => ({ say: `<b>${n}</b>：${d}` })),
            init(vis) { vis.style.minHeight = '120px'; vis.append(flow, cbox); },
            update(n, s, vis) {
              [...flow.querySelectorAll('.tt-fn')].forEach((f, i) => f.classList.toggle('on', i === n));
              [...flow.querySelectorAll('.tt-ar')].forEach((f, i) => f.classList.toggle('on', i < n));
              cbox.replaceChildren(h('div', { style: { marginTop: '12px' } }, code(F[n][2], 'sh', { color: 'var(--team)' })));
            },
          }));
        },
      },
      {
        t: '詰まったら？', tag: 'DEBUG', lead: '質問に答えて進もう。次にやることが見つかる。',
        why: {pv: {"k": "flow", "items": [{"i": "clock", "t": "何時間も悩む", "c": "bad"}, {"i": "message-circle-question", "t": "「動きません」だけ", "c": "bad"}]}, iv: {"k": "flow", "items": ["split|切り分ける", "timer|10分で相談"]}, av: {"k": "chips", "items": ["やったこと", "期待した結果", "実際の結果"]}, "problem": "1人で何時間も悩む。質問が「動きません」だけで伝わらない", "idea": "どこまで動くかを確かめる。10分悩んだら相談する。", "answer": "質問ツリーで原因を絞る。「やったこと・期待・実際」で相談する。", "when": [["10分悩んだ", "声をかける"], ["エラー文がある", "そのまま検索 / AI に"], ["値がおかしい", "console.log で遡る"]]},
        render(el) {
          const box = h('div', { class: 'tt-tree', style: { '--c': 'var(--team)' } });
          let path = [];
          function draw(k) {
            const n = DEBUG[k];
            box.replaceChildren(h('div', { class: 'tt-crumb' }, path.map((p) => h('span', DEBUG[p].q ? DEBUG[p].q.slice(0, 14) + '…' : ''))));
            if (n.q) {
              box.append(h('div', { class: 'tt-q' }, n.q), h('div', null, n.o.map(([a, nx]) => h('button', { class: 'tt-opt', onclick: () => { path.push(k); draw(nx); } }, a))));
            } else {
              box.append(h('div', { class: 'tt-leaf' }, h('h3', n.tip), h('ul', { html: n.items.map((i) => `<li>${i}</li>`).join('') })));
            }
            const row = h('div', { class: 'row' });
            if (path.length) row.append(h('button', { class: 'btn', onclick: () => draw(path.pop()) }, '← 戻る'));
            if (k !== 'start') row.append(h('button', { class: 'btn ghost', onclick: () => { path = []; draw('start'); } }, '⟲ 最初から'));
            box.append(row);
          }
          draw('start');
          el.append(box, h('div', { class: 'card', style: { marginTop: '18px' } }, quiz({ q: '10分考えても解決しない。次にやるべきことは？', options: ['もう1時間ひとりで粘る', '状況を整理して、チームや講師に相談する', '最初から全部書き直す'], answer: 1, why: '早めの相談はチームの武器！' })));
        },
      },
      quizScene('進め方の判断', 'THINK', '開発の「迷ったらどうする？」を3つ。<b>理由</b>まで読んで確認しよう。',
        { pv: {"k": "flow", "items": [{"i": "layers", "t": "抱え込む", "c": "bad"}, {"i": "git-merge", "t": "main を直接", "c": "bad"}, {"i": "clock", "t": "ひとりで悩む", "c": "bad"}]}, iv: {"k": "flow", "items": ["minimize-2|小さく", "git-branch|分けて", "share-2|早めに共有"]}, av: {"k": "chips", "items": ["WIP を絞る", "branch + PR", "10分で相談"]}, problem: '作業を抱え込む・main を直接触る・ひとりで悩む。どれもチームの流れを止める', idea: '作業は小さく。main とは別の枝で。早めに見せる。', answer: '同時進行（WIP）を減らす／branch + PR／10分で相談', when: [['Doing が増えた', '1つ完了してから次へ'], ['新しい作業', 'branch を切る'], ['10分悩んだ', '状況を整理して相談']] },
        [['Doing に5つ入っている。どうする？', ['全部少しずつ進める', '1つ完了させてから次に着手する', 'Todo に戻して忘れる'], 1, '同時進行が多いと、どれも終わらない。まず終わらせるのが最短。'],
          ['小さな修正だけど、main に直接 commit してよい？', ['小さければ OK', 'branch を切って PR にする', '誰にも見られなければ OK'], 1, '小さくても PR にすると、確認と記録が残る。'],
          ['15分悩んで解決しない。最初にやることは？', ['やったこと・期待・実際を整理して相談する', '諦める', '全部書き直す'], 0, '整理して伝えると、相談された側も早く答えられる。']]),
    ],
  });

  /* ================= prep ================= */
  K.reg({
    id: 'prep', track: 'team', title: '発表の準備', sub: '資料・リハーサル・最終確認', emoji: '📝',
    scenes: [
      {
        t: '資料の構成', tag: 'SLIDES', lead: '1枚で伝えることは1つ。この6枚を目安にそろえよう。',
        why: {pv: {"k": "flow", "items": [{"i": "files", "t": "情報を詰め込む", "c": "bad"}, {"i": "circle-help", "t": "何が大事？", "c": "bad"}]}, iv: {"k": "flow", "items": ["target|持ち帰る1文を決める", "layout-template|1枚1メッセージ"]}, av: {"k": "big", "i": "layout-template", "t": "1枚 = 1メッセージ"}, "problem": "情報を詰め込みすぎて、何が一番大事か伝わらない", "idea": "1枚で伝えることは1つだけ。持ち帰ってほしい1文を先に決める。", "answer": "6枚の構成テンプレート", "when": [["伝えたいことが多い", "1つに絞り、残りはデモで"], ["技術の説明が長い", "図1枚にまとめる"]]},
        answer: { html: '<p style="color:var(--mute);font-size:.875rem;margin-bottom:.6em">例：6枚の中身</p><ul><li><b>タイトル</b>：学習トラッカー／チーム A／3人</li><li><b>課題</b>：学んだことが続かない・見えない</li><li><b>解決策</b>：毎日の記録を、グラフで見せるアプリ（画面のスクショ）</li><li><b>デモ</b>：①入力 ②グラフが伸びる ③バッジがもらえる</li><li><b>技術と工夫</b>：TypeScript の型でバグを減らした／Vue で部品に分けた</li><li><b>学びと今後</b>：型が助けになった。次は通知機能を作りたい</li></ul>' },
        render(el) {
          el.append(checklist('tt.prep.slides', [['1️⃣', 'タイトル', 'アプリ名・チーム名・メンバー', { hint: ['アプリの名前と、チーム名、メンバーの名前を1枚にまとめる。'], answer: '例：学習トラッカー／チーム A／3人' }], ['2️⃣', '課題', '誰がどんなことに困っている？', { hint: ['「誰が」「何に困っているか」を1文で書く。'], answer: '例：新入社員は、学んだことが続かず困っている。' }], ['3️⃣', '解決策', 'アプリの一言説明とスクショ', { hint: ['アプリを一言で。画面のスクショを1枚のせる。'], answer: '例：毎日の記録を、グラフで見せるアプリ。' }], ['4️⃣', 'デモ', '見せる流れを3ステップに絞る', { hint: ['見せる流れを、3ステップに絞る。'], answer: '例：①入力 ②グラフが伸びる ③バッジがもらえる' }], ['5️⃣', '技術と工夫', 'TypeScript / Vue でやったこと', { hint: ['使った技術と、工夫したところを1〜2個。'], answer: '例：TypeScript の型でバグを減らした／Vue で部品に分けた' }], ['6️⃣', '学びと今後', 'ふりかえり・次にやりたいこと', { hint: ['やってみて分かったことと、次にやりたいこと。'], answer: '例：型が助けになった。次は通知機能を作りたい。' }], ['❓', '聞き手の質問を2つ予想して、答えを用意する', null, { opt: 1, hint: ['聞く人なら、何が気になる？ 「なぜ？」「次は？」を考えてみる。', '技術の選び方と、これから足したい機能は、よく聞かれる。'], answer: '例：「なぜ Vue を選んだ？」→「画面を部品に分けやすいから」／「次に何を足す？」→「通知機能」' }]], 'var(--team)'));
        },
      },
      {
        t: 'リハーサル・タイマー', tag: 'REHEARSAL', lead: 'スタートすると、パートごとの時間が順に塗られる。3分に収まるか試そう。',
        why: {pv: {"k": "flow", "items": [{"i": "timer", "t": "時間オーバー", "c": "bad"}, {"i": "shuffle", "t": "手順を忘れる", "c": "bad"}]}, iv: {"k": "flow", "items": ["chart-pie|時間を配分", "mic|声に出す", "gauge|実測して直す"]}, av: {"k": "meter", "items": [{"t": "課題", "v": 0.25, "c": "hi"}, {"t": "解決", "v": 0.25, "c": ""}, {"t": "デモ", "v": 0.33, "c": "ok"}, {"t": "学び", "v": 0.12, "c": ""}]}, "problem": "本番で時間オーバー。デモで焦って手順を忘れる", "idea": "パートごとに時間を決める。声に出して計って、直す。", "answer": "パートごとの持ち時間タイマー", "when": [["時間オーバー", "デモの見せ場を絞る"], ["時間が余る", "学びを厚くする"]]},
        render(el, ctx) {
          const S = [['導入・課題', 30, 'var(--pink)'], ['解決策', 45, 'var(--ts)'], ['デモ', 75, 'var(--vue)'], ['まとめ', 30, 'var(--team)']];
          const total = S.reduce((a, s) => a + s[1], 0);
          const bar = h('div', { class: 'tt-splits' }, S.map(([n, s, c]) => h('div', { style: { '--sc': c, flexGrow: s, flexBasis: 0 } }, h('i'), h('span', n + '\n' + s + '秒'))));
          bar.querySelectorAll('span').forEach((x) => (x.style.whiteSpace = 'pre'));
          const clock = h('div', { style: { font: '900 3rem var(--mono)', textAlign: 'center' } }, '00:00');
          const note = h('div', { class: 'tt-msg', style: { textAlign: 'center' } }, '押して開始 ▶');
          let t = 0, iv = null, run = false;
          const btn = h('button', { class: 'btn primary', onclick: () => { run = !run; btn.textContent = run ? '⏸ 停止' : '▶ 再開'; if (run) iv = setInterval(tick, 100); else clearInterval(iv); } }, '▶ スタート');
          function draw() {
            clock.textContent = mmss(t); let acc = 0, cur = -1;
            [...bar.children].forEach((d, i) => {
              const s = S[i][1], p = clamp((t - acc) / s, 0, 1); d.firstChild.style.transform = `scaleX(${p})`; d.classList.toggle('on', p > .5);
              if (t >= acc && t < acc + s) cur = i; acc += s;
            });
            note.textContent = t >= total ? (t > total ? '⚠️ 時間オーバー！削る部分を探そう' : '✨ ぴったり！') : cur >= 0 ? '今は「' + S[cur][0] + '」' : '';
            clock.style.color = t > total ? 'var(--bad)' : '';
          }
          function tick() { t += .1; draw(); if (Math.abs(t - total) < .06) celebrate(); }
          cl(ctx, () => clearInterval(iv));
          el.append(h('div', { class: 'card col' }, clock, bar, note, h('div', { class: 'row', style: { justifyContent: 'center' } }, btn, h('button', { class: 'btn ghost', onclick: () => { run = false; clearInterval(iv); t = 0; btn.textContent = '▶ スタート'; draw(); } }, '⟲ リセット'))));
          draw();
        },
      },
      {
        t: '本番前チェック', tag: 'DEMO DAY', lead: '当日に慌てないために。ひとつずつ確認してチェック。',
        why: {pv: {"k": "flow", "items": [{"i": "monitor-off", "t": "映らない", "c": "bad"}, {"i": "wifi-off", "t": "ネット切れ", "c": "bad"}, {"i": "bug", "t": "動かない", "c": "bad"}]}, iv: {"k": "flow", "items": ["list-checks|失敗を先に洗い出す", "shield-check|潰しておく"]}, av: {"k": "chips", "items": ["check|画面共有", "check|ネット", "check|録画バックアップ"]}, "problem": "当日、画面が映らない・デモが動かない・ネットが落ちる", "idea": "起こりそうな失敗を先に書き出す。チェックして、前もって防ぐ。", "answer": "本番前チェックリスト + バックアップ", "when": [["ネットが不安", "録画動画を用意"], ["ライブデモが不安", "スクショ・動画で代替"]]},
        answer: { html: '<p style="color:var(--mute);font-size:.875rem;margin-bottom:.6em">例：準備のしかた</p><ul><li>ネット：会場の Wi-Fi が不安なので、スマホのテザリングも用意</li><li>画面：<code>npm run dev</code> を先に起動しておき、タブは3つだけ</li><li>バックアップ：デモの画面録画（30秒）とスクショ3枚をデスクトップに置く</li><li>担当：話す人・操作する人・時間を見る人を決める</li></ul>' },
        render(el) {
          el.append(checklist('tt.prep.demoday', [['🌐', 'ネット接続・画面共有を確認', null, { hint: ['会場の Wi-Fi は動く？ 画面共有を先に試しておこう。'], answer: 'スマホのテザリングも用意しておく。' }], ['🖥️', 'アプリが起動する（npm run dev）', null, { hint: ['発表の前に、先に起動しておこう。', '不要なタブと通知は切る。文字は ⌘＋ で大きくする。'], answer: { code: 'npm run dev', lang: 'sh', file: 'terminal' } }], ['🛟', 'デモが失敗した時のスクショ／動画を用意', null, { hint: ['止まった時のための「予備」を作っておく。'], answer: 'デモの画面録画（30秒）と、スクショ3枚をデスクトップに置く。' }], ['🎤', '話す順番と担当を決めた', null, { hint: ['話す人・操作する人・時間を見る人を決めよう。'], answer: '例：話す＝A さん／操作＝B さん／時間＝C さん' }], ['⏱️', '本番どおりに通しで練習して、3分に収まった', null, { opt: 1, hint: ['タイマーを使って、話す・操作するを、本番と同じ順番でやってみる。', '3分を超えたら、デモの見せ場を1つ減らす。'], answer: '例：1回目 3分40秒 → デモを1つ減らす → 2回目 2分55秒' }]], 'var(--pink)'));
        },
      },
      quizScene('資料と本番の判断', 'THINK', '発表準備で起きがちな迷いを3つ。<b>聞き手の立場</b>で選ぼう。',
        { pv: {"k": "flow", "items": [{"i": "files", "t": "詰め込み", "c": "bad"}, {"i": "dices", "t": "ぶっつけ", "c": "bad"}, {"i": "timer", "t": "時間オーバー", "c": "bad"}]}, iv: {"k": "flow", "items": ["target|1つ持ち帰る", "shield|失敗を先に潰す"]}, av: {"k": "chips", "items": ["1枚1メッセージ", "録画バックアップ", "時間を実測"]}, problem: '詰め込み・ぶっつけ本番・時間オーバー。準備不足は本番で一気に出る', idea: '伝えることは1つに絞る。失敗は本番の前に防ぐ。', answer: '1枚1メッセージ／バックアップ／時間の実測', when: [['伝えたいことが多い', '1つに絞り、残りはデモで'], ['ライブが不安', '録画をバックアップに'], ['時間オーバー', '見せ場を絞る']] },
        [['スライドに機能を10個載せたい。', ['全部載せる', '一番伝えたい1つに絞り、残りはデモで見せる', '文字を小さくして載せる'], 1, '情報が多いほど、何も残らない。'],
          ['ライブデモが不安。', ['ぶっつけ本番', '録画した動画をバックアップに用意する', 'デモはやめる'], 1, '動かなくても、バックアップがあれば発表は止まらない。'],
          ['リハーサルで3分半かかった（持ち時間は3分）。', ['早口で話す', 'デモの見せ場を絞って削る', 'そのまま本番'], 1, '早口は伝わらない。内容を削るのが正解。']]),
    ],
  });

  /* ================= demo ================= */
  const AX = ['アイデア', '技術', 'デザイン', '発表'];
  K.reg({
    id: 'demo', track: 'team', title: '成果発表', sub: 'Demo Day', emoji: '🏆',
    scenes: [
      {
        t: '発表順ルーレット', tag: 'DRAW', lead: 'チーム名を入れて<b>抽選</b>しよう。発表の順番が決まる。',
        why: {pv: {"k": "flow", "items": [{"i": "users", "t": "順番で揉める", "c": "bad"}, {"i": "message-square", "t": "「最後は嫌」", "c": "bad"}]}, iv: {"k": "flow", "items": ["scale|公平なルール", "dices|ランダム"]}, av: {"k": "big", "i": "dices", "t": "抽選で決める"}, "problem": "発表順で揉める。「最後は嫌」という空気が生まれる", "idea": "順番はくじで決める。話し合わなくて済む。", "answer": "くじ引き（ランダム抽選）", "when": [["順番に理由が無い", "抽選"], ["デモの相性がある", "事前に調整"]]},
        render(el, ctx) {
          let teams = store.get('tt.demo.teams', []), order = store.get('tt.demo.order', []);
          const slot = h('div', { class: 'tt-slot' }, '🎲');
          const ord = h('div', { class: 'tt-order' });
          const chips = h('div', { class: 'row' });
          let spinning = false, timerId = null;
          const inp = h('input', { class: 'tt-in', placeholder: 'チーム名を入力 → Enter', onkeydown: (e) => { if (e.key === 'Enter') addT(); } });
          const addT = () => { const v = inp.value.trim(); if (v && !teams.includes(v)) { teams.push(v); inp.value = ''; save(); draw(); } };
          const save = () => { store.set('tt.demo.teams', teams); store.set('tt.demo.order', order); };
          function draw() {
            const left = teams.filter((t) => !order.includes(t));
            chips.replaceChildren(...left.map((t) => h('span', { class: 'chip', style: { '--c': 'var(--team)', cursor: 'pointer' }, title: 'クリックで削除', onclick: () => { teams = teams.filter((x) => x !== t); save(); draw(); } }, t + ' ✕')));
            ord.replaceChildren(...order.map((t) => h('div', t)));
            draw.btn.disabled = spinning || !left.length;
          }
          draw.btn = h('button', { class: 'btn primary', onclick: () => {
            const left = teams.filter((t) => !order.includes(t)); if (!left.length || spinning) return;
            spinning = true; draw(); slot.classList.add('spin');
            const win = left[Math.floor(Math.random() * left.length)]; let i = 0, delay = 50;
            const step = () => {
              if (delay > 420) { slot.textContent = '🎉 ' + win; slot.classList.remove('spin'); order.push(win); spinning = false; save(); draw(); celebrate(); return; }
              slot.textContent = left[i++ % left.length]; slot.animate([{ transform: 'translateY(-14px)', opacity: .3 }, { transform: 'none', opacity: 1 }], { duration: delay });
              delay *= 1.14; timerId = setTimeout(step, delay);
            };
            step();
          } }, '🎰 抽選！');
          cl(ctx, () => clearTimeout(timerId));
          el.append(h('div', { class: 'split' }, h('div', { class: 'col' }, h('div', { class: 'row' }, h('div', { style: { flex: 1 } }, inp), h('button', { class: 'btn', onclick: addT }, '＋ 追加')), chips, slot,
            h('div', { class: 'row' }, draw.btn, h('button', { class: 'btn ghost', onclick: () => { order = []; save(); slot.textContent = '🎲'; draw(); } }, '⟲ 順番リセット'))),
            h('div', null, lbl('発表順'), ord)));
          draw();
        },
      },
      {
        t: '発表タイマー', tag: 'LIVE', lead: '大きなタイマーで持ち時間を見せる。「次のチーム」で進める。',
        why: {pv: {"k": "flow", "items": [{"i": "clock", "t": "持ち時間がバラバラ", "c": "bad"}, {"i": "triangle-alert", "t": "進行が崩れる", "c": "bad"}]}, iv: {"k": "flow", "items": ["eye|時間を見える化", "shield|守る仕組み"]}, av: {"k": "big", "i": "timer", "t": "大きなタイマー"}, "problem": "持ち時間がバラバラで、進行が崩れる", "idea": "残り時間を全員に見せる。みんなで時間を守れる。", "answer": "大きなタイマー + 次のチームへ", "when": [["残り少ない", "話をまとめに入る"], ["時間切れ", "続きは質疑で"]]},
        render(el, ctx) {
          const order = store.get('tt.demo.order', []);
          const names = order.length ? order : ['Team A', 'Team B', 'Team C'];
          let cur = 0;
          const list = h('div', { class: 'tt-order' });
          const title = h('h2', { style: { fontSize: '2rem', fontWeight: 900, textAlign: 'center' } });
          const T = timer(ctx, { secs: 300, presets: [3, 5, 7], big: true, color: 'var(--pink)', warn: 30, label: '', onEnd: () => {} });
          const next = h('button', { class: 'btn primary', onclick: () => { if (cur < names.length - 1) { cur++; T.reset(); draw(); } else { celebrate(); title.textContent = '🎉 全チーム発表おつかれさま！'; } } }, '次のチーム ➜');
          function draw() { title.textContent = '🎤 ' + names[cur]; list.replaceChildren(...names.map((n, i) => h('div', { class: i === cur ? 'cur' : i < cur ? 'past' : '' }, n))); next.textContent = cur < names.length - 1 ? '次のチーム ➜' : '🏁 終了'; }
          draw();
          el.append(h('div', { class: 'split wide-l' }, h('div', { class: 'col' }, title, T, h('div', { class: 'row', style: { justifyContent: 'center' } }, next)), h('div', null, lbl('順番'), list)));
        },
      },
      {
        t: 'フィードバック', tag: 'VOTE', lead: '4つの観点を⭐で評価しよう。平均がすぐ変わる。最後に結果発表。',
        why: {pv: {"k": "flow", "items": [{"i": "message-square", "t": "「良かったです」", "c": "bad"}, {"i": "circle-help", "t": "次に何を直す？", "c": "bad"}]}, iv: {"k": "flow", "items": ["layout-grid|観点を分ける", "message-square-text|理由を一言"]}, av: {"k": "chips", "items": ["アイデア ★", "技術 ★", "デザイン ★", "発表 ★"]}, "problem": "「良かったです」だけで終わり、次に活かせない", "idea": "4つの観点ごとに点を付ける。理由も一言そえる。", "answer": "4つの軸で星評価 + コメント", "when": [["良かった点", "具体的に理由を書く"], ["改善点", "次の提案とセットで"]]},
        render(el) {
          const teams = (store.get('tt.demo.order', []).length ? store.get('tt.demo.order', []) : store.get('tt.demo.teams', []));
          const names = teams.length ? teams : ['Team A', 'Team B', 'Team C'];
          let votes = store.get('tt.demo.votes', []), team = names[0];
          const cur = [3, 3, 3, 3];
          const rate = AX.map((a, i) => { const s = stars(3, (v) => { cur[i] = v; }); return { a, s }; });
          const sel = h('select', { class: 'tt-in', onchange: (e) => { team = e.target.value; draw(); } }, names.map((n) => h('option', n)));
          const agg = h('div'); const rank = h('div', { class: 'tt-order', style: { marginTop: '12px' } });
          function avg(t) { const v = votes.filter((x) => x.t === t); return { n: v.length, s: AX.map((_, i) => (v.length ? v.reduce((a, x) => a + x.s[i], 0) / v.length : 0)) }; }
          function draw() {
            const r = avg(team);
            agg.replaceChildren(h('b', `${team} の平均（${r.n}票）`), ...AX.map((a, i) => h('div', { class: 'tt-ax' }, h('span', a), h('div', { class: 'tt-bar', style: { '--c': 'var(--team)' } }, h('i', { style: { width: (r.s[i] / 5) * 100 + '%' } })), h('b', r.n ? r.s[i].toFixed(1) : '–'))));
          }
          const send = h('button', { class: 'btn primary', onclick: () => { votes.push({ t: team, s: [...cur] }); store.set('tt.demo.votes', votes); draw(); send.animate([{ transform: 'scale(1.2)' }, { transform: 'none' }], { duration: 300 }); } }, '📮 送信');
          const final = h('button', { class: 'btn', onclick: () => {
            const rk = names.map((t) => ({ t, a: avg(t) })).map((x) => ({ ...x, m: x.a.n ? x.a.s.reduce((a, b) => a + b, 0) / 4 : 0 })).sort((a, b) => b.m - a.m);
            rank.replaceChildren(...rk.map((x, i) => h('div', { style: { animationDelay: i * .2 + 's' } }, (i === 0 ? '🏆 ' : '') + x.t + '　', h('b', x.m.toFixed(2) + ' ★')))); celebrate();
          } }, '🏆 結果発表');
          el.append(h('div', { class: 'split' }, h('div', { class: 'card col' }, lbl('評価する'), sel, rate.map(({ a, s }) => h('div', { class: 'tt-ax', style: { gridTemplateColumns: '90px 1fr' } }, h('span', a), s)), h('div', { class: 'row' }, send, h('button', { class: 'btn ghost', onclick: () => { votes = []; store.set('tt.demo.votes', votes); rank.replaceChildren(); draw(); } }, '🗑 票をリセット'))),
            h('div', { class: 'card' }, lbl('集計'), agg, h('div', { style: { marginTop: '12px' } }, final), rank)));
          draw();
        },
      },
      quizScene('発表を聞く側の判断', 'THINK', '発表は<b>聞く側</b>にも役割がある。良いフィードバックとは？',
        { pv: {"k": "flow", "items": [{"i": "message-square", "t": "「良かったです」", "c": "bad"}, {"i": "circle-help", "t": "次の一歩が不明", "c": "bad"}]}, iv: {"k": "flow", "items": ["eye|事実", "lightbulb|理由", "arrow-right|提案"]}, av: {"k": "chips", "items": ["事実 + 理由 + 提案"]}, problem: '「良かったです」で終わる感想は、発表者の次の一歩になりにくい', idea: '「見たこと」「そう思った理由」「こうするともっと良い」をセットで伝える。', answer: '4つの軸で評価し、一言コメントを添える', when: [['良かった点', '具体的に・理由つきで'], ['改善点', '提案とセットで'], ['進行が押している', '質疑を短くして時間を守る']] },
        [['フィードバックの書き方は？', ['「良かったです」', '良かった点 + 具体的な理由 + 次への提案', '悪い点だけ書く'], 1, '具体的で前向きなコメントが、発表者の次の行動につながる。'],
          ['進行が押している。', ['そのまま続ける', '質疑を短くして時間を守る', 'タイマーを止める'], 1, '時間を守るのも、全チームへの公平さ。']]),
    ],
  });

  /* ================= qa ================= */
  const FAQ = [
    ['HTML：タグが効かない／表示が崩れる', '閉じタグ忘れ、<>の打ち間違い、ファイル保存忘れをまず確認。開発者ツール（F12）の Elements でDOMを見ると原因が分かります。'],
    ['CSS：スタイルが当たらない', 'セレクタが合っているか、より強いルールに上書きされていないか（開発者ツールの Styles）を確認。クラス名のスペルも要注意。'],
    ['TypeScript：型エラーが読めない', '赤線にカーソルを乗せて<b>1行目</b>だけ読む。「AをBに代入できません」＝型の食い違いです。'],
    ['TypeScript：any を使っていい？', '最後の手段。まず union や interface で表せないか考えよう。any は型チェックを諦めることです。'],
    ['Vue：ref の値が更新されない', 'script内では <code class="i">count.value</code> と書く。templateでは .value 不要です。'],
    ['Vue：v-if と v-show の違いは？', 'v-if は要素ごと作る/消す。v-show は display:none で隠すだけ。頻繁に切り替えるなら v-show。'],
  ];
  K.reg({
    id: 'qa', track: 'vue', title: 'Q&A', sub: '質問ボード', emoji: '🙋',
    scenes: [
      {
        t: '質問ボード', tag: 'Q&A', lead: '気軽に質問しよう。<b>👍</b>は「私も知りたい」。答えが出たら✓を付ける。',
        why: {pv: {"k": "flow", "items": [{"i": "message-circle", "t": "同じ質問が何度も", "c": "bad"}, {"i": "eye-off", "t": "聞けない人もいる", "c": "bad"}]}, iv: {"k": "flow", "items": ["book-open|みんなの財産", "heart|「私も」を見える化"]}, av: {"k": "chips", "items": ["plus|投稿", "thumbs-up|投票", "check|回答済み"]}, "problem": "同じ質問が何度も出る。恥ずかしくて聞けない人もいる", "idea": "質問を1か所に集める。👍で「私も知りたい」を伝える。", "answer": "質問ボード（投稿・投票・回答済み）", "when": [["同じ質問がある", "👍を押す"], ["新しい疑問", "投稿する"]]},
        render(el) {
          let qs = store.get('tt.qa.q', [{ id: uid(), q: 'ref と reactive はどう使い分けますか？', v: 3, done: false }, { id: uid(), q: 'interface と type の違いは？', v: 2, done: true }]);
          let filter = 'all';
          const save = () => store.set('tt.qa.q', qs);
          const list = h('div', { class: 'col' });
          const inp = h('input', { class: 'tt-in', placeholder: '質問を書いて Enter', onkeydown: (e) => { if (e.key === 'Enter') post(); } });
          const post = () => { const q = inp.value.trim(); if (!q) return; qs.unshift({ id: uid(), q, v: 0, done: false }); inp.value = ''; save(); draw(); };
          const fb = [['all', 'すべて'], ['open', '未回答'], ['done', '回答済み']].map(([k, jp]) => h('button', { class: 'tt-cat' + (k === 'all' ? ' on' : ''), style: { '--cc': 'var(--vue)' }, onclick: () => { filter = k; fb.forEach((b, i) => b.classList.toggle('on', ['all', 'open', 'done'][i] === k)); draw(); } }, jp));
          function draw() {
            const v = qs.filter((q) => filter === 'all' || (filter === 'done' ? q.done : !q.done)).sort((a, b) => a.done - b.done || b.v - a.v);
            list.replaceChildren(...(v.length ? v.map((q) => h('div', { class: 'tt-q' + (q.done ? ' done' : '') },
              h('button', { class: 'tt-up', onclick: () => { q.v++; save(); draw(); } }, '👍', h('br'), q.v), h('div', { class: 'qt' }, q.q),
              h('button', { class: 'btn ghost', title: '回答済み', onclick: () => { q.done = !q.done; save(); draw(); if (q.done) celebrate(); } }, q.done ? '↩' : '✓'),
              h('button', { class: 'btn ghost', title: '削除', onclick: () => { qs = qs.filter((x) => x !== q); save(); draw(); } }, '✕'))) : [h('div', { style: { color: 'var(--mute)', textAlign: 'center', padding: '24px' } }, '🌱 まだ質問はありません')]));
          }
          el.append(h('div', { class: 'col' }, h('div', { class: 'row' }, h('div', { style: { flex: 1, minWidth: '220px' } }, inp), h('button', { class: 'btn primary', style: { '--c': 'var(--vue)' }, onclick: post }, '✉️ 投稿')), h('div', { class: 'tt-cats' }, fb), list));
          draw();
        },
      },
      {
        t: 'よくある質問', tag: 'FAQ', lead: 'つまずきやすいポイントをまとめました。タップで開きます。',
        why: {pv: {"k": "flow", "items": [{"i": "clock", "t": "同じつまずきで時間が溶ける", "c": "bad"}]}, iv: {"k": "flow", "items": ["book|先回りして知る"]}, av: {"k": "big", "i": "circle-help", "t": "FAQ を先に見る"}, "problem": "同じつまずきで毎回時間が溶ける", "idea": "よくあるつまずきを、先に知っておく。", "answer": "FAQ（よくある質問）を先に読む", "when": [["まず", "FAQ を見る"], ["載っていない", "質問ボードへ"]]},
        render(el) {
          el.append(h('div', null, FAQ.map(([q, a]) => {
            const acc = h('div', { class: 'tt-acc' }, h('button', { onclick: () => acc.classList.toggle('open') }, q), h('div', { class: 'bd' }, h('div', h('p', { html: a }))));
            return acc;
          })));
        },
      },
      quizScene('質問の仕方', 'THINK', '良い質問は<b>答えやすい</b>質問。3点セットを意識しよう。',
        { pv: {"k": "flow", "items": [{"i": "message-square", "t": "「動きません」", "c": "bad"}, {"i": "message-circle-question", "t": "聞き返しで時間が溶ける", "c": "bad"}]}, iv: {"k": "flow", "items": ["eye|相手が見なくても分かる"]}, av: {"k": "chips", "items": ["やったこと", "期待", "実際"]}, problem: '「動きません」だけの質問は、答える側が状況を聞き返すだけで時間がかかる', idea: '相手が画面を見なくても分かるように書く。', answer: 'やったこと・期待した結果・実際の結果', when: [['同じ質問が既にある', '👍で「私も」'], ['新しい疑問', '3点セットで投稿'], ['急ぎ・詰まっている', '直接声をかける']] },
        [['良い質問の3点セットは？', ['やったこと・期待・実際', '急いでます・助けて・なぜ', 'エラーです・動きません・直して'], 0, '3点あれば、答える側がすぐ原因に近づける。'],
          ['質問ボードに同じ質問がすでにある。', ['新しく投稿する', '👍を押して「私も」を伝える', '諦める'], 1, '👍が多い質問は、みんなの関心事として優先的に扱える。']]),
    ],
  });
})();
