/* Supplement lessons (補足) — basic track extras: terminal, VS Code, DevTools, BEM, CSS+, a11y */
(function () {
  'use strict';
  const K = window.KENSHU, { h, code, stepper, playground, quiz, lbl, style, sleep, esc, icon, store, celebrate } = K.W;
  const kbd = (t) => h('kbd', t);
  const card = (...k) => h('div', { class: 'card' }, ...k);
  const quizScene = (t, tag, lead, why, Q) => ({
    t, tag, lead, why,
    render(el) { el.append(h('div', { class: 'xb-qz' }, Q.map(([q, o, a, w]) => card(quiz({ q, options: o, answer: a, why: w }))))); },
  });
  style('xb-q', `
  .xb-st .stepper{align-content:start}
  .xb-qz{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;align-items:start}
  @media(max-width:900px){.xb-qz{grid-template-columns:1fr}}
  .xb-log{height:250px;overflow:auto;font:.8rem/1.75 var(--mono);background:var(--code);border-radius:8px;padding:8px;border:1px solid var(--line)}
  .xb-ll{padding:0 8px;border-radius:4px;color:#9aa3c7;white-space:pre;transition:background .15s}
  .xb-ll.cur{background:#2f4a7a;color:#fff}.xb-ll.hit{background:color-mix(in srgb,var(--bad) 28%,transparent);color:#ffb3bc}
  .xb-big{font:900 2.5rem/1 var(--mono);color:var(--c,var(--ts))}
  .xb-race{display:flex;gap:10px;align-items:baseline;margin-top:10px}.xb-race small{color:var(--mute);font-weight:700}
  .xb-scale{display:grid;gap:6px;margin-top:14px}
  .xb-scale .r{display:grid;grid-template-columns:110px 1fr 1fr;gap:10px;align-items:center;font-size:.85rem;font-weight:700}
  .xb-scale .b{height:22px;border-radius:5px;display:flex;align-items:center;padding:0 8px;font:800 .75rem var(--mono);color:#06101f;min-width:46px;white-space:nowrap}
  `);
  const chips = (arr, on, cb, color) => {
    const box = h('div', { class: 'xb-seg' });
    if (color) box.style.setProperty('--c', color);
    const btns = arr.map(([v, label]) => h('button', { class: 'xb-sg' + (v === on ? ' on' : ''), onclick: () => { btns.forEach((x) => x.classList.toggle('on', x === btns.find((y) => y.dataset.v === String(v)))); cb(v); }, 'data-v': v }, label));
    box.append(...btns);
    return box;
  };

  style('xb-a', `
  .xb-seg{display:flex;gap:6px;flex-wrap:wrap}
  .xb-sg{all:unset;cursor:pointer;padding:.3em .9em;border-radius:6px;border:1px solid var(--line);background:var(--card);font-weight:800;font-size:.875rem;transition:.2s}
  .xb-sg:hover{background:var(--card2);transform:translateY(-1px)}
  .xb-sg.on{background:var(--c,var(--ts));color:#06101f;border-color:transparent;box-shadow:0 6px 16px -8px var(--c,var(--ts))}
  .xb-term{background:var(--code);color:#d8dcff;border-radius:8px;border:1px solid var(--line);font:.875rem/1.7 var(--mono);min-height:290px;display:flex;flex-direction:column;overflow:hidden}
  .xb-term .bar{display:flex;gap:6px;align-items:center;padding:10px 14px;border-bottom:1px solid rgba(255,255,255,.08);color:#8e97c4;font-size:.75rem}
  .xb-term .bar i{width:10px;height:10px;border-radius:50%;background:#ff5f57}.xb-term .bar i:nth-child(2){background:#febc2e}.xb-term .bar i:nth-child(3){background:#28c840}
  .xb-term .bar .k{margin-left:auto;min-width:80px;text-align:right}
  .xb-term .scr{padding:12px 16px;flex:1;white-space:pre-wrap;word-break:break-all}
  .xb-term .p{color:#6fdc7c}.xb-term .o{color:#9aa3c7}
  .xb-cur{display:inline-block;width:.6em;height:1.15em;background:#d8dcff;vertical-align:-.2em;animation:xbblink 1s steps(1) infinite}
  @keyframes xbblink{50%{opacity:0}}
  .xb-cuts{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
  .xb-cut{all:unset;cursor:pointer;display:grid;gap:2px;padding:12px 14px;border-radius:8px;background:var(--card);border:1px solid var(--line);transition:.22s;position:relative;overflow:hidden}
  .xb-cut:hover{transform:translateY(-3px);border-color:var(--c);background:var(--card2)}
  .xb-cut.on{border-color:var(--c);background:color-mix(in srgb,var(--c) 18%,var(--card));box-shadow:0 10px 24px -14px var(--c)}
  .xb-cut b{font:800 1rem var(--mono);color:var(--c)}.xb-cut small{color:var(--mute);font-weight:700;font-size:.75rem}
  .xb-pipe{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:8px;align-items:start}
  .xb-stg{border-radius:8px;border:1px solid var(--line);background:var(--card);padding:8px;min-height:230px;opacity:.28;transform:scale(.95);transition:.5s;display:grid;gap:4px;align-content:start}
  .xb-stg.on{opacity:1;transform:none}.xb-stg.cur{border-color:var(--c);box-shadow:0 12px 26px -14px var(--c);background:color-mix(in srgb,var(--c) 12%,var(--card))}
  .xb-stg h5{font:800 .75rem var(--mono);color:var(--c);padding-bottom:6px;border-bottom:1px dashed var(--line);margin-bottom:2px;word-break:break-all}
  .xb-row{font:700 .75rem var(--mono);padding:.15em .6em;border-radius:8px;background:var(--card2);animation:pop .4s both}
  .xb-stg.file{display:grid;place-items:center;text-align:center;align-content:center}
  .xb-line{font:700 clamp(.8rem,1.5vw,1.02rem) var(--mono);background:var(--code);color:#d8dcff;padding:14px 16px;border-radius:8px;display:flex;flex-wrap:wrap;gap:4px;align-items:center;margin-bottom:12px}
  .xb-line span{padding:2px 8px;border-radius:8px;transition:.3s;border-bottom:2px solid transparent;opacity:.5}
  .xb-line span.cur{opacity:1;background:color-mix(in srgb,var(--c) 28%,transparent);border-color:var(--c);transform:translateY(-3px)}
  .xb-line span.done{opacity:.9}.xb-line em{font-style:normal;color:var(--pink);opacity:1}
  .xb-file{border-radius:8px;background:var(--code);color:#d8dcff;font:.875rem/1.6 var(--mono);overflow:hidden;border:1px solid var(--line)}
  .xb-file h6{font:700 .75rem var(--mono);padding:6px 12px;background:rgba(255,255,255,.06);display:flex;gap:6px;align-items:center;color:#9aa3c7}
  .xb-file div{padding:6px 12px;min-height:2.4em}.xb-file div p{animation:pop .4s both}.xb-file .e{color:#ff8f9a}
  .xb-gr mark{background:color-mix(in srgb,var(--c) 45%,transparent);color:inherit;border-radius:4px;padding:0 2px}
  .xb-gr .nn{color:#6fdc7c;margin-right:.6em}
  .xb-cmd{font:700 .875rem var(--mono);background:var(--code);color:#d8dcff;padding:.5em .9em;border-radius:6px;margin-bottom:10px;word-break:break-all}
  .xb-bar2{height:14px;border-radius:6px;background:var(--code);overflow:hidden}.xb-bar2 i{display:block;height:100%;border-radius:6px;transition:width .7s cubic-bezier(.2,.9,.3,1)}
  .xb-ali{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
  .xb-ali button{all:unset;cursor:pointer;padding:.5em .7em;border-radius:8px;background:var(--card);border:1px solid var(--line);font:800 .875rem var(--mono);text-align:center;transition:.2s;color:var(--c)}
  .xb-ali button:hover{transform:translateY(-2px);background:var(--card2)}.xb-ali button.on{background:var(--c);color:#06101f}
  `);

  /* ================= x-terminal ================= */
  function termBox(initial) {
    const scr = h('div', { class: 'scr' });
    const key = h('span', { class: 'k' });
    const box = h('div', { class: 'xb-term' }, h('div', { class: 'bar' }, h('i'), h('i'), h('i'), h('span', '~/kenshu — zsh'), key), scr);
    let token = 0;
    function draw(f) {
      scr.replaceChildren();
      (f.hist || []).forEach((l) => scr.append(h('div', { class: l.startsWith('$ ') ? '' : 'o' }, l.startsWith('$ ') ? [h('span', { class: 'p' }, '$ '), l.slice(2)] : l)));
      if (f.line != null) {
        const [a, b = ''] = f.line.split('‸');
        const ln = h('div', null, h('span', { class: 'p' }, f.noPrompt ? '' : '$ '), a, h('span', { class: 'xb-cur' }), b);
        scr.append(ln);
      }
      key.innerHTML = '';
      if (f.key) { const k = kbd(f.key); k.style.animation = 'pop .3s both'; key.append(k); }
    }
    box.play = async (frames) => {
      const t = ++token;
      for (const f of frames) { if (t !== token) return; draw(f); await sleep(f.ms || 750); }
    };
    box.stop = () => { token++; };
    box.draw = draw;
    draw(initial || { line: '‸' });
    return box;
  }

  const SHORTCUTS = [
    ['↑ / ↓', '履歴をさかのぼる', 'var(--ts)', [
      { hist: ['$ ls', '$ cd docs', '$ git status'], line: '‸', ms: 600 },
      { hist: ['$ ls', '$ cd docs', '$ git status'], line: 'git status‸', key: '↑' },
      { hist: ['$ ls', '$ cd docs', '$ git status'], line: 'cd docs‸', key: '↑' },
      { hist: ['$ ls', '$ cd docs', '$ git status'], line: 'ls‸', key: '↑' },
      { hist: ['$ ls', '$ cd docs', '$ git status'], line: 'cd docs‸', key: '↓' },
    ]],
    ['Tab', '名前を自動補完', 'var(--basic)', [
      { line: 'cd Doc‸', ms: 900 }, { line: 'cd Doc‸', key: 'Tab', ms: 300 }, { line: 'cd Documents/‸', key: 'Tab', ms: 900 },
      { line: 'cd Documents/ki‸', ms: 700 }, { line: 'cd Documents/kenshu/‸', key: 'Tab', ms: 900 },
    ]],
    ['Ctrl + R', '過去のコマンドを検索', 'var(--pink)', [
      { line: '‸', ms: 500 }, { line: 'bck-i-search: ‸', noPrompt: 1, key: 'Ctrl+R' }, { hist: ['git commit -m "fix header"'], line: 'bck-i-search: com‸', noPrompt: 1, ms: 1100 },
      { line: 'git commit -m "fix header"‸', key: 'Enter', ms: 1000 },
    ]],
    ['Ctrl + C', '実行中のものを止める', 'var(--team)', [
      { hist: ['$ ping example.com', '64 bytes ... time=12ms'], line: '', ms: 700 }, { hist: ['$ ping example.com', '64 bytes ... time=12ms', '64 bytes ... time=11ms'], line: '', ms: 700 },
      { hist: ['$ ping example.com', '64 bytes ... time=12ms', '64 bytes ... time=11ms', '^C'], line: '‸', key: 'Ctrl+C', ms: 1000 },
    ]],
    ['Ctrl + A / E', '行頭 / 行末へジャンプ', 'var(--violet)', [
      { line: 'echo hello world‸', ms: 700 }, { line: '‸echo hello world', key: 'Ctrl+A', ms: 900 }, { line: 'echo hello world‸', key: 'Ctrl+E', ms: 900 }, { line: 'echo hello ‸world', key: 'Opt+←', ms: 800 },
    ]],
    ['Ctrl + L', '画面をきれいにする', 'var(--vue)', [
      { hist: ['$ ls', 'a.txt  b.txt', '$ git status', 'On branch main', '$ npm run dev'], line: '‸', ms: 900 }, { line: '‸', key: 'Ctrl+L', ms: 900 },
    ]],
  ];

  const ALIAS = [
    ['gst', 'git status'], ['ga', 'git add'], ['gaa', 'git add --all'], ['gcmsg', 'git commit -m'], ['gp', 'git push'], ['gl', 'git pull'], ['gco', 'git checkout'], ['gb', 'git branch'], ['glog', 'git log --oneline --decorate --graph'],
  ];

  K.reg({
    id: 'x-terminal', track: 'extra', title: 'ターミナル便利技', sub: '履歴・パイプ・grep・alias', emoji: '⌨️',
    gh: [{ label: 'cli/command.sh', path: 'cli/command.sh' }, { label: 'git/bonus.md（oh-my-zsh）', path: 'git/bonus.md' }],
    meta: { cat: 'basic', day: '16日(月)', when: 'CUI・Vim の直後、余った5〜10分', mins: 10, order: 10, level: '入門', after: 'cuivim', why: '同じ操作が3倍速くなる。コマンドを“つなげる”発想はプログラミングの基本' },
    scenes: [
      {
        t: '困った：手作業の限界', tag: 'PROBLEM', lead: '「ログに <b>ERROR</b> は何行ある？」目で数える？ コマンドで数える？ <b>レース</b>で比べてみよう。',
        why: { pv: {"k": "flow", "items": [{"i": "search", "t": "40000行を目で探す", "c": "bad"}, {"i": "clock", "t": "何時間も", "c": "bad"}]}, iv: {"k": "flow", "items": ["terminal|命令を書く", "cpu|機械に任せる"]}, av: {"k": "code", "lang": "sh", "text": "grep -c ERROR app.log", "ok": [1]}, problem: 'ログが増えるほど、目で探す・数えるのが現実的でなくなる', idea: '何度もやる作業は、命令にして機械にやらせる。', answer: 'ターミナルのコマンド（grep・パイプ・リダイレクト）', when: [['1回きり・数行', '目で見ても OK'], ['何度もやる・行数が多い', 'コマンドにする'], ['毎日やる', 'スクリプトにして自動化']] },
        hint: '<code>grep -c</code> の <b>c</b> は count（数える）。条件に合う行の数だけを返す。行数が増えても、書く命令は同じ。',
        render(el, ctx) {
          const N = 40, ERR = new Set([3, 9, 14, 22, 31, 37]);
          const lines = Array.from({ length: N }, (_, i) => `${String(9 + Math.floor(i / 8)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}  ${ERR.has(i) ? 'ERROR' : 'INFO '}  ${ERR.has(i) ? 'DB timeout' : 'request ok'}`);
          const rows = lines.map((l, i) => h('div', { class: 'xb-ll' }, l));
          const log = h('div', { class: 'xb-log' }, rows);
          const cnt = h('b', { class: 'xb-big', style: { '--c': 'var(--pink)' } }, '0'), tm = h('small', '0.0 秒');
          const cmd = h('div', { class: 'xb-cmd', style: { minHeight: '2.4em' } }, '$ ');
          const res = h('b', { class: 'xb-big', style: { '--c': 'var(--basic)', opacity: 0.15 } }, '?'), tm2 = h('small', '—');
          const scale = h('div', { class: 'xb-scale', style: { display: 'none' } });
          const SC = [['40 行', '約 12 秒', '0.01 秒', 8, 2], ['4,000 行', '約 20 分', '0.02 秒', 55, 2], ['400,000 行', '約 33 時間', '0.5 秒', 100, 3]];
          SC.forEach(([n, a, b, wa, wb]) => scale.append(h('div', { class: 'r' }, h('span', n), h('div', { class: 'b', style: { width: wa + '%', background: 'var(--pink)' } }, a), h('div', { class: 'b', style: { width: wb + '%', background: 'var(--basic)' } }, b))));
          scale.prepend(h('div', { class: 'r' }, h('span'), h('b', { style: { color: 'var(--pink)' } }, '手で数える'), h('b', { style: { color: 'var(--basic)' } }, 'コマンド')));
          let tok = 0;
          const btn = h('button', { class: 'btn primary', onclick: () => race() }, icon('play'), 'レース開始');
          async function race() {
            const t = ++tok; btn.disabled = true; scale.style.display = 'none';
            rows.forEach((r) => (r.className = 'xb-ll')); log.scrollTop = 0; cnt.textContent = '0'; tm.textContent = '0.0 秒';
            cmd.textContent = '$ '; res.style.opacity = 0.15; res.textContent = '?'; tm2.textContent = '—';
            const manual = (async () => {
              let c = 0;
              for (let i = 0; i < N; i++) {
                if (t !== tok) return;
                rows[i].classList.add('cur'); log.scrollTop = Math.max(0, i * 22 - 100);
                await sleep(130);
                rows[i].classList.remove('cur'); if (ERR.has(i)) { rows[i].classList.add('hit'); c++; cnt.textContent = c; }
                tm.textContent = ((i + 1) * 0.3).toFixed(1) + ' 秒（目安）';
              }
            })();
            const auto = (async () => {
              for (const ch of 'grep -c ERROR app.log') { if (t !== tok) return; cmd.textContent += ch; await sleep(45); }
              await sleep(200); if (t !== tok) return;
              res.textContent = ERR.size; res.style.opacity = 1; tm2.textContent = '0.01 秒'; res.animate([{ transform: 'scale(1.4)' }, { transform: 'none' }], { duration: 300 });
            })();
            await Promise.all([manual, auto]);
            if (t === tok) { btn.disabled = false; btn.replaceChildren(icon('rotate-ccw'), 'もう一度'); scale.style.display = 'grid'; scale.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 400 }); }
          }
          ctx.cleanups.push(() => { tok++; });
          el.append(h('div', { class: 'split' },
            card(lbl('① 目で数える'), log, h('div', { class: 'xb-race' }, cnt, h('span', '行 ERROR'), tm)),
            card(lbl('② コマンドで数える'), cmd, h('div', { class: 'xb-race', style: { marginTop: '14px' } }, res, h('span', '行 ERROR'), tm2))),
            h('div', { style: { marginTop: '12px' } }, btn), scale);
        },
      },
      {
        t: 'キーボード便利技', tag: 'SHORTCUT', lead: 'カードを押すと、ターミナルでキー操作が再生される。',
        why: {pv: {"k": "flow", "items": [{"i": "keyboard", "t": "長い命令を打つ", "c": "bad"}, {"i": "x", "t": "打ち間違い", "c": "bad"}, {"i": "rotate-ccw", "t": "また最初から", "c": "bad"}]}, iv: {"k": "flow", "items": ["history|呼び出す", "move-horizontal|移動する", "undo-2|やり直す"], "cap": "打たずに 呼ぶ・動く・戻す"}, av: {"k": "chips", "items": ["↑ 履歴", "Tab 補完", "Ctrl+R 検索", "Ctrl+A / E 行頭・行末"]}, "problem": "長いコマンドを毎回ぜんぶ打ち直す。矢印キーを連打して履歴を探す", "idea": "打つ回数を減らす。「呼ぶ・動く・戻す」で済ませる。", "answer": "↑ 履歴 / Tab 補完 / Ctrl+R 履歴検索 / Ctrl+A・E 行頭行末", "when": [["直前のコマンドをもう一度", "↑ か <code>!!</code>"], ["昔打ったコマンドを探す", "Ctrl+R で検索"], ["長いパス名", "Tab 補完"]]},
        render(el, ctx) {
          const term = termBox();
          const cards = h('div', { class: 'xb-cuts' }, SHORTCUTS.map(([k, d, c, fr]) => {
            const b = h('button', { class: 'xb-cut', style: { '--c': c }, onclick: () => { cards.querySelectorAll('.xb-cut').forEach((x) => x.classList.toggle('on', x === b)); term.play(fr); } }, h('b', k), h('small', d));
            return b;
          }));
          ctx.cleanups.push(() => term.stop());
          el.append(h('div', { class: 'split' }, cards, term));
          cards.firstChild.click();
        },
      },
      {
        t: 'パイプ ( | )：コマンドをつなぐ', tag: 'PIPE', lead: '左のコマンドの<b>出力</b>が、右のコマンドの<b>入力</b>になる。「次へ」で、データが変わる様子を1つずつ見よう。',
        why: {pv: {"k": "flow", "items": [{"i": "file-text", "t": "fruits.txt"}, {"i": "circle-help", "t": "一番多いのは？", "c": "warn"}], "cap": "専用コマンドは無い"}, iv: {"k": "flow", "items": ["package|小さな部品", "link|つなぐ", "target|目的を作る"]}, av: {"k": "code", "lang": "sh", "text": "cat fruits.txt\n  | sort | uniq -c\n  | sort -rn | head -2", "ok": [1]}, "problem": "「一番多い果物は？」を知りたい。でも専用コマンドは無い", "idea": "小さなコマンドを順につなぐ。前の出力が、次の入力になる。", "answer": "<code>|</code> パイプで cat → sort → uniq → head をつなぐ", "when": [["結果をさらに加工したい", "| でつなぐ"], ["結果を残したい", "> でファイルへ"], ["1つのコマンドで足りる", "パイプ不要"]]},
        render(el) {
          const DATA = ['cherry', 'apple', 'banana', 'cherry', 'banana', 'cherry'];
          const st = [
            ['cat fruits.txt', DATA, '<b>cat</b>：ファイルの中身を1行ずつ流し込む', 'var(--ts)'],
            ['sort', [...DATA].sort(), '<b>sort</b>：アルファベット順に並べ替え。同じ行が隣り合う', 'var(--basic)'],
            ['uniq -c', ['1 apple', '2 banana', '3 cherry'], '<b>uniq -c</b>：隣り合う重複をまとめて、回数を数える', 'var(--vue)'],
            ['sort -rn', ['3 cherry', '2 banana', '1 apple'], '<b>sort -rn</b>：数字 (n) の大きい順 (r) に並べ替え', 'var(--team)'],
            ['head -2', ['3 cherry', '2 banana'], '<b>head -2</b>：先頭の2行だけ取り出す', 'var(--pink)'],
            ['> top.txt', null, '<b>&gt;</b>：画面ではなく <b>top.txt</b> に保存。ランキングの完成！', 'var(--violet)'],
          ];
          const line = h('div', { class: 'xb-line' });
          const spans = st.map(([c], i) => h('span', c));
          spans.forEach((s, i) => { if (i) line.append(h('em', i === 5 ? '' : '|')); line.append(s); });
          const grid = h('div', { class: 'xb-pipe' }, st.map(([c, rows, , col]) => {
            const g = h('div', { class: 'xb-stg' + (rows ? '' : ' file'), style: { '--c': col } }, h('h5', c));
            if (rows) rows.forEach((r, i) => g.append(h('div', { class: 'xb-row', style: { animationDelay: i * 70 + 'ms' } }, r)));
            else g.append(h('div', { style: { fontSize: '2rem', color: col } }, icon('file-text', { size: '2.2rem' })), h('b', { style: { fontFamily: 'var(--mono)' } }, 'top.txt'), h('div', { class: 'xb-row' }, '3 cherry'), h('div', { class: 'xb-row' }, '2 banana'));
            return g;
          }));
          el.append(stepper({
            color: 'var(--ts)', interval: 2300,
            steps: st.map((s) => ({ say: s[2] })),
            init(vis) { vis.append(line, grid); },
            update(n) {
              [...grid.children].forEach((g, i) => { g.classList.toggle('on', i <= n); g.classList.toggle('cur', i === n); if (i === n) g.querySelectorAll('.xb-row').forEach((r) => { r.style.animation = 'none'; void r.offsetWidth; r.style.animation = ''; }); });
              spans.forEach((s, i) => { s.classList.toggle('cur', i === n); s.classList.toggle('done', i < n); s.style.setProperty('--c', st[i][3]); });
            },
          }));
        },
      },
      {
        t: 'リダイレクト と grep', tag: '> >> grep', lead: '結果を<b>ファイルに保存</b>する。ファイルから<b>探す</b>。ボタンを押して違いを見よう。',
        why: {pv: {"k": "flow", "items": [{"i": "monitor", "t": "画面に出る", "c": "bad"}, {"i": "eraser", "t": "流れて消える", "c": "bad"}, {"i": "search", "t": "目で探す", "c": "bad"}], "cap": "ログが増えるほど無理"}, iv: {"k": "flow", "items": ["arrow-right-from-line|出力の行き先を変える", "filter|条件で絞る"]}, av: {"k": "code", "lang": "sh", "text": "echo hi > a.txt\ngrep -i error app.log\nls x 2> err.log", "ok": [1, 2, 3]}, "problem": "画面に出た結果は消える。大量のログから必要な1行を目で探すのは無理", "idea": "結果を画面ではなくファイルに送る。必要な行だけ取り出す。", "answer": "<code>&gt;</code> <code>&gt;&gt;</code> <code>2&gt;</code> と <code>grep</code>", "when": [["前の内容は要らない", "> で上書き"], ["記録を足していく", ">> で追記"], ["エラーだけ残す", "2> error.log"], ["特定の文字を含む行だけ", "grep"]]},
        render(el) {
          /* redirect */
          let out = [], err = [];
          const fo = h('div'), fe = h('div');
          const cmd = h('div', { class: 'xb-cmd' }, '$ ');
          const paint = (hot) => {
            fo.replaceChildren(...out.map((l, i) => h('p', { style: { animationDelay: '0ms', animation: i >= hot ? 'pop .4s both' : 'none' } }, l)));
            fe.replaceChildren(...err.map((l) => h('p', { class: 'e' }, l)));
          };
          const R = [
            ['echo "[v1] Hello" > sample.txt', '上書き', 'var(--ts)', () => { out = ['[v1] Hello']; return 0; }],
            ['echo "[v2] Hello" > sample.txt', '上書き（v1は消える）', 'var(--pink)', () => { out = ['[v2] Hello']; return 0; }],
            ['echo "[v3] Hello" >> sample.txt', '末尾に追加', 'var(--basic)', () => { out = [...out, '[v3] Hello']; return out.length - 1; }],
            ['ls no_such_dir 2> error.log', 'エラーだけ保存', 'var(--team)', () => { err = ['ls: no_such_dir: No such file or directory']; return 99; }],
          ];
          const rb = h('div', { class: 'col' }, R.map(([c, d, col, fn]) => h('button', { class: 'xb-cut', style: { '--c': col }, onclick: () => { cmd.textContent = '$ ' + c; paint(fn()); } }, h('b', { style: { fontSize: '.75rem' } }, c), h('small', d))));
          const left = card(lbl('リダイレクト'), rb, cmd, h('div', { class: 'xb-file' }, h('h6', icon('file-text'), 'sample.txt'), fo), h('div', { class: 'xb-file', style: { marginTop: '8px' } }, h('h6', icon('file-text'), 'error.log'), fe));

          /* grep */
          const TXT = ['apple pie', 'Apple juice', 'pineapple', 'banana split', 'green apple', 'cherry tart', 'APPLE'];
          const fl = { i: false, n: false, w: false, v: false };
          let pat = 'apple';
          const res = h('div', { class: 'xb-file xb-gr', style: { '--c': 'var(--pink)' } });
          const gcmd = h('div', { class: 'xb-cmd' });
          const input = h('input', { value: pat, style: { font: '700 .9rem var(--mono)', padding: '.4em .8em', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--code)', color: '#d8dcff', width: '100%', outline: 'none' }, oninput: (e) => { pat = e.target.value; run(); } });
          function run() {
            gcmd.textContent = ['grep', ...Object.entries(fl).filter(([, v]) => v).map(([k]) => '-' + k), `"${pat}"`, 'sample.txt'].join(' ');
            let rx = null;
            try { rx = pat ? new RegExp((fl.w ? '\\b' : '') + pat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + (fl.w ? '\\b' : ''), fl.i ? 'gi' : 'g') : null; } catch { }
            res.replaceChildren(h('h6', icon('file-text'), 'sample.txt'));
            const body = h('div');
            TXT.forEach((l, i) => {
              const m = rx ? new RegExp(rx.source, rx.flags.replace('g', '')).test(l) : false;
              if (m === !fl.v) {
                const p = h('p', { style: { animationDelay: i * 40 + 'ms' } });
                if (fl.n) p.append(h('span', { class: 'nn' }, i + 1 + ':'));
                p.insertAdjacentHTML('beforeend', fl.v || !rx ? esc(l) : esc(l).replace(new RegExp(rx.source, rx.flags), (x) => `<mark>${x}</mark>`));
                body.append(p);
              }
            });
            if (!body.children.length) body.append(h('p', { class: 'o', style: { color: '#9aa3c7' } }, '（一致なし）'));
            res.append(body);
          }
          const tg = h('div', { class: 'row' }, [['i', '大文字小文字を無視'], ['n', '行番号'], ['w', '単語まるごと'], ['v', '一致しない行']].map(([k, d]) => {
            const b = h('button', { class: 'xb-sg', style: { '--c': 'var(--pink)' }, onclick: () => { fl[k] = !fl[k]; b.classList.toggle('on', fl[k]); run(); } }, h('b', { style: { fontFamily: 'var(--mono)' } }, '-' + k), ' ', d);
            return b;
          }));
          const right = card(lbl('grep：探す'), input, h('div', { style: { height: '8px' } }), tg, h('div', { style: { height: '10px' } }), gcmd, res);
          el.append(h('div', { class: 'split xb-st' }, left, right));
          paint(99); run();
        },
      },
      {
        t: 'oh-my-zsh：短縮 alias', tag: 'alias', lead: '長いコマンドは<b>短い名前</b>で呼べる。押して、打つ文字数の差を見よう。',
        why: {pv: {"k": "code", "lang": "sh", "text": "git status\ngit status\ngit status\n…", "err": [1, 2, 3], "cap": "1日に何十回も"}, iv: {"k": "flow", "items": ["repeat|何度もやる", "tag|短い名前を付ける"]}, av: {"k": "code", "lang": "sh", "text": "alias gst='git status'\ngst", "ok": [1, 2]}, "problem": "<code>git status</code> を1日に何十回も打つ", "idea": "何度も打つコマンドに、短いあだ名を付ける。", "answer": "alias（oh-my-zsh の git プラグインで100個超）", "when": [["毎日使う長いコマンド", "alias にする"], ["たまにしか使わない", "alias 不要（覚える負担が増える）"], ["引数や分岐が必要", "関数・スクリプトにする"]]},
        ref: [{ title: 'oh-my-zsh のインストール', icon: 'terminal', node: () => code('# oh-my-zsh のインストール\nsh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"\n\n# ~/.zshrc\nplugins=(git)', 'sh', { file: 'terminal', color: 'var(--basic)' }) }],
        hint: 'git プラグインを有効にすると、<b>100 個以上の alias</b> が使えるようになる。まずは <code>gst</code>（git status）と <code>gco</code>（git checkout）から。',
        render(el) {
          const out = h('div', { class: 'xb-cmd', style: { minHeight: '3.6em', fontSize: '1rem' } }, '$ ');
          const a = h('div', { class: 'xb-bar2' }, h('i', { style: { width: '0%', background: 'var(--pink)' } }));
          const b = h('div', { class: 'xb-bar2' }, h('i', { style: { width: '0%', background: 'var(--basic)' } }));
          const la = h('small', { style: { color: 'var(--mute)', fontWeight: 700 } }), lb = h('small', { style: { color: 'var(--mute)', fontWeight: 700 } });
          let busy = 0;
          const grid = h('div', { class: 'xb-ali' }, ALIAS.map(([s, f]) => {
            const btn = h('button', { style: { '--c': 'var(--basic)' }, onclick: async () => {
              grid.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === btn));
              const t = ++busy; out.textContent = '$ ';
              for (const ch of s) { if (t !== busy) return; out.textContent += ch; await sleep(120); }
              await sleep(350); if (t !== busy) return;
              out.innerHTML = `<span style="color:var(--basic)">$ </span><span style="opacity:.35;text-decoration:line-through">${esc(s)}</span> <span style="color:var(--pink)">→</span> ${esc(f)}`;
              out.animate([{ transform: 'scale(1.03)' }, { transform: 'none' }], { duration: 250 });
              a.firstChild.style.width = Math.min(100, f.length * 4) + '%'; b.firstChild.style.width = Math.min(100, s.length * 4) + '%';
              la.textContent = `そのまま：${f.length} 文字`; lb.textContent = `alias：${s.length} 文字（${Math.round((1 - s.length / f.length) * 100)}% 短縮）`;
            } }, s);
            return btn;
          }));
          el.append(h('div', { class: 'split xb-st' },
            card(lbl('alias を選ぶ'), grid),
            card(lbl('展開される'), out, h('div', { style: { height: '12px' } }), lbl('入力する文字数'), la, a, h('div', { style: { height: '8px' } }), lb, b)));
          grid.firstChild.click();
        },
      },
      quizScene('どれを使う？：ターミナル編', 'CHOOSE', '似た記号やコマンドは<b>目的</b>で選び分ける。答えを選んで、理由まで確認しよう。',
        { pv: {"k": "flow", "items": [{"i": "circle-help", "t": "違いが曖昧", "c": "bad"}, {"i": "trash-2", "t": "結果を消した", "c": "bad"}]}, iv: {"k": "flow", "items": ["target|したいこと", "search|から逆引き"]}, av: {"k": "chips", "items": ["grep：絞る", "|：つなぐ", ">：上書き", ">>：足す"]}, problem: '似た記号（| と > と >>）の違いが曖昧で、結果を消したり上書きしたりする', idea: '「何をしたいか」から選ぶ。絞る・つなぐ・残す・足す。', answer: 'grep（絞る）・|（つなぐ）・>（残す）・>>（足す）', when: [['条件で絞る', 'grep'], ['次のコマンドへ渡す', '|'], ['ファイルに保存（上書き）', '>'], ['ファイルの末尾に追加', '>>']] },
        [['ログ全体から「ERROR」を含む行だけ見たい。', ['grep ERROR app.log', 'sort app.log', 'cat app.log &gt; ERROR'], 0, 'grep は条件で行を絞る。'],
          ['ls の結果を files.txt に保存したい。', ['ls | files.txt', 'ls &gt; files.txt', 'ls &lt; files.txt'], 1, '> は出力の行き先をファイルに変える。| は「次のコマンドへ」渡す記号。'],
          ['前回のログを消さずに、今日の分を末尾に足したい。', ['&gt;', '&gt;&gt;', '2&gt;'], 1, '&gt;&gt; は追記。&gt; だと前の内容が消える。'],
          ['先月打った長い git コマンドをもう一度使いたい。', ['↑ を100回押す', 'Ctrl+R で検索', '全部打ち直す'], 1, 'Ctrl+R は履歴の途中の文字から検索できる。']]),
      {
        t: '実践：ログから ERROR を探そう', tag: 'PRACTICE', lead: 'ミニ・ターミナルで3つのミッション。コマンドを打って <b>Enter</b>。わからなければ下の例を押すと入力欄に入る。（約5分）',
        hint: '<b>もっとやりたい人へ</b><ul><li>次の例で、エラーの種類ごとの件数を多い順に出せる：<br><code>sort codes.txt | uniq -c | sort -rn | head -2</code></li><li><code>cat app.log | grep ERROR</code> のように、<code>|</code> でつないでもOK。</li></ul>',
        answer: { code: 'grep ERROR app.log\ngrep -c ERROR app.log\ngrep ERROR app.log > errors.txt', lang: 'sh', file: 'terminal' },
        render(el, ctx) {
          const LOG = '09:00 INFO  start\n09:01 ERROR db timeout\n09:02 INFO  request ok\n09:03 ERROR db timeout\n09:04 WARN  slow query\n09:05 ERROR disk full\n09:06 INFO  request ok\n09:07 ERROR db timeout\n09:08 ERROR auth failed\n09:09 INFO  request ok\n';
          const ERRS = LOG.split('\n').filter((l) => l.includes('ERROR'));
          const INIT = () => ({ 'app.log': LOG, 'codes.txt': 'timeout\nauth\ntimeout\ndisk\ntimeout\nauth\n' });
          let fs = INIT(); let ran = []; let doneFired = false;
          const rows = (t) => (t === '' || t == null ? [] : t.replace(/\n$/, '').split('\n'));
          const strip = (s) => s.replace(/^["']|["']$/g, '');
          function exec(argv, input) {
            const [c, ...a] = argv; const flags = a.filter((x) => /^-[a-zA-Z0-9]+$/.test(x)); const args = a.filter((x) => !flags.includes(x));
            const has = (f) => flags.some((x) => x.slice(1).includes(f));
            const read = (i) => { if (args[i] == null) return input == null ? '' : input; if (fs[args[i]] == null) throw new Error(`${c}: ${args[i]}: No such file or directory`); return fs[args[i]]; };
            const J = (arr) => (arr.length ? arr.join('\n') + '\n' : '');
            switch (c) {
              case 'ls': return Object.keys(fs).join('  ') + '\n';
              case 'cat': return args.map((_, i) => read(i)).join('') || (args.length ? '' : (input || ''));
              case 'echo': return args.map(strip).join(' ') + '\n';
              case 'grep': { const pat = strip(args[0] || ''); const text = args[1] != null || input == null ? read(1) : input; let m = rows(text).filter((l) => (has('i') ? l.toLowerCase().includes(pat.toLowerCase()) : l.includes(pat))); if (has('v')) m = rows(text).filter((l) => !m.includes(l)); if (has('c')) return m.length + '\n'; return J(has('n') ? m.map((l) => rows(text).indexOf(l) + 1 + ':' + l) : m); }
              case 'sort': { let r = rows(read(0)).sort((x, y) => (has('n') ? parseFloat(x) - parseFloat(y) || (x < y ? -1 : 1) : x < y ? -1 : x > y ? 1 : 0)); if (has('r')) r.reverse(); return J(r); }
              case 'uniq': { const r = rows(read(0)), out = []; r.forEach((l) => { const p = out[out.length - 1]; if (p && p.l === l) p.n++; else out.push({ l, n: 1 }); }); return J(out.map((o) => (has('c') ? String(o.n).padStart(4) + ' ' + o.l : o.l))); }
              case 'head': { const m = flags.map((f) => /^-(\d+)$/.exec(f)).find(Boolean); const nI = a.indexOf('-n'); const n = m ? +m[1] : nI >= 0 ? +a[nI + 1] : 10; const f2 = args.filter((x) => !/^\d+$/.test(x)); const text = f2[0] != null ? (fs[f2[0]] != null ? fs[f2[0]] : (() => { throw new Error(`head: ${f2[0]}: No such file or directory`); })()) : input || ''; return J(rows(text).slice(0, n)); }
              case 'wc': return rows(read(0)).length + '\n';
              case 'rm': args.forEach((f) => delete fs[f]); return '';
              default: throw new Error(`zsh: command not found: ${c}`);
            }
          }
          function run(line) {
            const toks = (line.replace(/(>>?)/g, ' $1 ').match(/"[^"]*"|'[^']*'|\S+/g) || []);
            if (!toks.length) return { out: '', redirected: false };
            let ri = toks.findIndex((x) => x === '>' || x === '>>'); let target = null, append = false;
            if (ri >= 0) { target = toks[ri + 1]; append = toks[ri] === '>>'; toks.splice(ri); if (!target) throw new Error('zsh: parse error near `\\n\''); }
            const segs = []; let cur = []; toks.forEach((x) => { if (x === '|') { segs.push(cur); cur = []; } else cur.push(x); }); segs.push(cur);
            let data = null; segs.forEach((s) => { data = exec(s.map((x) => x), data); });
            if (target) { fs[target] = append && fs[target] ? fs[target] + data : data; return { out: '', redirected: true }; }
            return { out: data, redirected: false };
          }
          const hist = h('div', { class: 'xb-tshell-h' });
          const inp = h('input', { class: 'xb-tshell-in', placeholder: 'コマンドを入力して Enter', spellcheck: 'false', autocomplete: 'off', onkeydown: (e) => { if (e.key === 'Enter') { go(inp.value); inp.value = ''; } } });
          const tasks = h('div', { class: 'tasks' });
          function go(line) {
            if (!line.trim()) return;
            const row = h('div', null, h('span', { style: { color: 'var(--basic)' } }, '$ '), line); hist.append(row);
            try { const r = run(line); ran.push({ line, out: r.out, redirected: r.redirected }); if (r.out) hist.append(h('pre', { style: { margin: 0, color: '#cfd5ff', font: 'inherit' } }, r.out.replace(/\n$/, ''))); }
            catch (e) { hist.append(h('div', { class: 'e' }, e.message)); }
            hist.scrollTop = 9e4; check();
          }
          function check() {
            const res = [
              { label: 'ERROR の行だけを画面に出す', ok: ran.some((r) => !r.redirected && JSON.stringify(rows(r.out)) === JSON.stringify(ERRS)), hint: ['ファイルから、決まった文字がある行だけ取り出すコマンドは <code>grep</code>。', '<code>grep ERROR app.log</code>（探す文字、ファイル名の順）'], answer: { code: 'grep ERROR app.log', lang: 'sh', file: 'terminal' } },
              { label: 'ERROR が何行あるか数える（答えは 5）', ok: ran.some((r) => !r.redirected && r.out.trim() === '5'), hint: ['<code>grep</code> に「数える」オプション <code>-c</code> を付けると、行数だけ出る。', '<code>grep -c ERROR app.log</code>'], answer: { code: 'grep -c ERROR app.log', lang: 'sh', file: 'terminal' } },
              { label: 'ERROR の行を <code>errors.txt</code> に保存する', ok: fs['errors.txt'] != null && JSON.stringify(rows(fs['errors.txt'])) === JSON.stringify(ERRS), hint: ['画面に出す代わりに、<code>&gt;</code> でファイルに送れる。', '<code>grep ERROR app.log &gt; errors.txt</code>'], answer: { code: 'grep ERROR app.log > errors.txt', lang: 'sh', file: 'terminal' } },
              { optional: true, label: '<b>任意：</b>エラーの種類（<code>codes.txt</code>）を、多い順に2つ <code>top.txt</code> に保存する', ok: fs['top.txt'] != null && JSON.stringify(rows(fs['top.txt']).map((x) => x.trim())) === JSON.stringify(['3 timeout', '2 auth']), hint: ['数えるには <code>sort</code> のあと <code>uniq -c</code>。多い順は <code>sort -rn</code>。', '<code>sort codes.txt | uniq -c | sort -rn | head -2</code> の最後に <code>&gt; top.txt</code> を付ける。'], answer: { code: 'sort codes.txt | uniq -c | sort -rn | head -2 > top.txt', lang: 'sh', file: 'terminal' } },
            ];
            const req = res.filter((t) => !t.optional), opt = res.filter((t) => t.optional);
            const nOk = req.filter((t) => t.ok).length;
            const row = (t) => h('div', { class: 'task' + (t.ok ? ' ok' : '') + (t.optional ? ' opt' : '') }, h('i', t.ok ? '✓' : ''), h('span', { class: 'task-l', html: t.label }), K.W.hintButton(t, { use: (tt) => { inp.value = tt.answer.code; inp.focus(); } }));
            tasks.replaceChildren(h('div', { class: 'mission-head' }, icon('list-checks'), h('b', 'ミッション'), h('span', { class: 'mission-n' }, nOk + ' / ' + req.length), h('i', { class: 'mission-bar' }, h('u', { style: { width: (nOk / req.length) * 100 + '%' } }))), ...req.map(row),
              ...(opt.length ? [h('div', { class: 'mission-opt-head' }, h('span', { class: 'opt-badge' }, '任意'), h('b', 'チャレンジ'), h('small', 'もっと挑戦したい人だけ。やらなくても OK')), ...opt.map(row)] : []));
            if (nOk === req.length && !doneFired) { doneFired = true; celebrate(); }
          }
          const EX = ['ls', 'cat app.log', 'grep ERROR app.log', 'grep -c ERROR app.log', 'grep ERROR app.log > errors.txt', 'cat errors.txt'];
          const exs = h('div', { class: 'row' }, EX.map((x) => h('button', { class: 'xb-sg', style: { fontFamily: 'var(--mono)', fontSize: '.75rem' }, onclick: () => { inp.value = x; inp.focus(); } }, x)));
          const reset = h('button', { class: 'btn ghost', onclick: () => { fs = INIT(); ran = []; doneFired = false; hist.replaceChildren(h('div', { style: { color: '#9aa3c7' } }, '（リセットしました。app.log があります）')); check(); } }, icon('rotate-ccw'), 'リセット');
          hist.append(h('div', { style: { color: '#9aa3c7' } }, 'app.log と codes.txt があります。ls で見てみよう。'));
          el.append(h('div', { class: 'pg' }, h('div', { class: 'pg-head' }, h('div', { class: 'dots3' }, h('i'), h('i'), h('i')), h('span', { class: 'chip' }, '~/log — zsh'), h('div', { style: { flex: 1 } }), reset), h('div', { class: 'xb-tshell' }, hist, h('div', { class: 'row', style: { flexWrap: 'nowrap', padding: '8px 12px', borderTop: '1px solid var(--line)', background: 'var(--code)' } }, h('span', { style: { color: 'var(--basic)', fontFamily: 'var(--mono)' } }, '$'), inp)), h('div', { style: { padding: '10px 12px', borderTop: '1px solid var(--line)' } }, lbl('入力の例（押すと入力欄に入る）'), exs), tasks));
          style('xb-tsh', `.xb-tshell{background:var(--code);color:#d8dcff;font:.85rem/1.6 var(--mono)}.xb-tshell-h{height:230px;overflow:auto;padding:10px 14px;white-space:pre-wrap}.xb-tshell-h .e{color:#ff8f9a}.xb-tshell-in{flex:1;background:transparent;border:0;outline:0;color:#fff;font:inherit;font-size:.875rem}`);
          check(); setTimeout(() => inp.focus(), 50);
        },
      },
    ],
  });
  style('xb-b', `
  .xb-st{align-items:stretch}.xb-st>*{display:flex;flex-direction:column;justify-content:flex-start;gap:10px;min-width:0}.xb-st .grow{flex:1}
  .xb-in{font:800 1.25rem var(--mono);padding:.6em .9em;border-radius:8px;border:2px solid var(--line);background:var(--code);color:#d8dcff;outline:none;width:100%;transition:.2s}
  .xb-in:focus{border-color:var(--c,var(--ts));box-shadow:0 0 0 4px color-mix(in srgb,var(--c,var(--ts)) 25%,transparent)}
  .xb-tab{all:unset;cursor:pointer;padding:.45em 1.1em;border-radius:8px;background:var(--c,var(--ts));color:#06101f;font-weight:900;font-family:var(--mono);transition:.2s;white-space:nowrap}
  .xb-tab:active{transform:scale(.92)}.xb-tab.hit{animation:pop .3s both}
  .xb-stage{background:#fff;color:#222;border-radius:8px;padding:14px;min-height:150px;font-family:var(--font);border:1px solid var(--line)}
  .xb-stage *{outline:1px dashed #5b9dff66;outline-offset:1px;margin:3px 0}.xb-stage div{min-height:22px;padding:4px 6px}.xb-stage ul,.xb-stage ol{padding-left:1.4em}.xb-stage table{border-collapse:collapse}.xb-stage td,.xb-stage th{border:1px solid #bbb;padding:.2em .7em}
  .xb-stale{opacity:.35;filter:saturate(.3);transition:.3s}
  .xb-keys{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
  .xb-k{all:unset;cursor:pointer;display:grid;gap:4px;padding:10px 12px;border-radius:8px;border:1px solid var(--line);background:var(--card);transition:.2s;position:relative}
  .xb-k:hover{transform:translateY(-2px);border-color:var(--c)}.xb-k small{color:var(--mute);font-weight:700;font-size:.75rem}
  .xb-k.ok{background:color-mix(in srgb,var(--ok) 14%,var(--card));border-color:var(--ok)}.xb-k.ok::after{content:"✓";position:absolute;right:10px;top:8px;color:var(--ok);font-weight:900}
  .xb-sel{background:color-mix(in srgb,var(--pink) 45%,transparent);border-radius:3px;box-shadow:0 0 0 1px var(--pink);transition:.3s}
  .xb-brw{border-radius:8px;overflow:hidden;background:#fff;color:#222;border:1px solid var(--line);box-shadow:var(--shadow);display:flex;flex-direction:column}
  .xb-brw .u{display:flex;gap:8px;align-items:center;padding:8px 12px;background:#eceef6;font:.75rem var(--mono);color:#777}
  .xb-brw .u i{width:9px;height:9px;border-radius:50%;background:#ff5f57}.xb-brw .u i+i{background:#febc2e}.xb-brw .u i+i+i{background:#28c840}
  .xb-brw .u b{flex:1;background:#fff;border-radius:6px;padding:1px 10px;font-weight:500}
  .xb-brw .pg{padding:18px;min-height:130px;font-family:var(--font);transition:.4s}
  .xb-spin{display:inline-block;width:14px;height:14px;border:2px solid #5b9dff;border-top-color:transparent;border-radius:50%;animation:spin 0.7s linear infinite}
  @keyframes spin{to{transform:rotate(360deg)}}
  .xb-unsaved::before{content:"●";color:#ffc94d;margin-right:.4em}
  .xb-dt{background:#1c1f2b;color:#d8dcff;border-radius:8px;overflow:hidden;border:1px solid var(--line);font:.75rem/1.6 var(--mono);display:flex;flex-direction:column;min-height:330px}
  .xb-dt .tabs{display:flex;background:#252938;gap:0;overflow:auto}.xb-dt .tabs button{all:unset;cursor:pointer;padding:.5em 1em;color:#9aa3c7;font-weight:700;border-bottom:2px solid transparent;white-space:nowrap}
  .xb-dt .tabs button.on{color:#fff;border-color:#5b9dff;background:#1c1f2b}.xb-dt .tabs button:hover{color:#fff}
  .xb-dt .pn{padding:10px 12px;flex:1;overflow:auto}
  .xb-node{padding:1px 8px;border-radius:6px;cursor:pointer;white-space:pre;transition:.15s}.xb-node:hover{background:#2c3247}.xb-node.on{background:#2f4a7a}
  .xb-node .t{color:#ff8f7a}.xb-node .a{color:#ffd37a}
  .xb-decl{display:flex;gap:6px;align-items:center;padding:1px 4px;border-radius:6px}.xb-decl:hover{background:#2c3247}
  .xb-decl input[type=text]{all:unset;color:#7fd8ff;border-bottom:1px dashed #5b6390;min-width:60px;padding:0 4px}.xb-decl input[type=text]:focus{background:#2f4a7a}
  .xb-decl .p{color:#ffd37a}.xb-decl.off{opacity:.45;text-decoration:line-through}
  .xb-con{display:grid;gap:3px;margin-bottom:8px;max-height:150px;overflow:auto}.xb-con .i{color:#9aa3c7}.xb-con .r{color:#b7f5c3}.xb-con .e{color:#ff8f9a}
  .xb-net{width:100%;border-collapse:collapse}.xb-net th{text-align:left;color:#9aa3c7;font-weight:700;padding:3px 6px;border-bottom:1px solid #2c3247}
  .xb-net td{padding:4px 6px;border-bottom:1px solid #252938;cursor:pointer}.xb-net tr:hover td{background:#2c3247}.xb-net tr.on td{background:#2f4a7a}.xb-net .bad td{color:#ff8f9a}
  .xb-wf{height:8px;border-radius:4px;background:#5b9dff;width:0;transition:width .6s;position:relative}.xb-net .bad .xb-wf{background:#ff6b7a}.xb-net .c .xb-wf{background:#6fdc7c}
  .xb-dev{margin:0 auto;border-radius:8px;border:3px solid #2a2f48;background:#fff;color:#222;overflow:hidden;transition:width .6s cubic-bezier(.2,.9,.3,1);container-type:inline-size;max-width:100%}
  .xb-dev .pg{padding:14px;font-family:var(--font)}
  .xb-dev nav{display:flex;gap:10px;align-items:center;margin-bottom:10px;font-weight:800}.xb-dev nav .m{display:none;margin-left:auto;font-size:1.25rem}.xb-dev nav .l{display:flex;gap:10px;margin-left:auto;font-weight:500;font-size:.875rem;color:#666}
  .xb-dev .gd{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.xb-dev .gd div{background:linear-gradient(135deg,#dbe8ff,#ffe1ef);border-radius:6px;padding:18px 6px;text-align:center;font-weight:800;color:#445}
  @container (max-width:560px){.xb-dev .gd{grid-template-columns:repeat(2,1fr)}.xb-dev nav .l{display:none}.xb-dev nav .m{display:block}}
  @container (max-width:380px){.xb-dev .gd{grid-template-columns:1fr}}
  `);

  /* tiny Emmet */
  function emmet(src) {
    src = src.trim(); if (!src) return '';
    if (src === '!') return '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Document</title>\n</head>\n<body>\n  \n</body>\n</html>';
    let i = 0; const VOID = ['img', 'input', 'br', 'hr', 'meta', 'link'];
    const rest = () => src.slice(i);
    function item() {
      const m = /^[a-zA-Z][\w-]*/.exec(rest()); let tag = ''; if (m) { tag = m[0]; i += tag.length; }
      const n = { tag, id: '', cls: [], text: '', mul: 1, kids: [] }; let any = !!tag;
      for (; ;) {
        const c = src[i]; let mm;
        if (c === '.' && (mm = /^\.([\w$-]+)/.exec(rest()))) { n.cls.push(mm[1]); i += mm[0].length; any = true; }
        else if (c === '#' && (mm = /^#([\w$-]+)/.exec(rest()))) { n.id = mm[1]; i += mm[0].length; any = true; }
        else if (c === '{' && src.indexOf('}', i) > 0) { const j = src.indexOf('}', i); n.text = src.slice(i + 1, j); i = j + 1; any = true; }
        else if (c === '*' && (mm = /^\*(\d+)/.exec(rest()))) { n.mul = Math.min(+mm[1], 12); i += mm[0].length; }
        else break;
      }
      return any ? n : null;
    }
    function seq() {
      const out = [];
      for (; ;) {
        const it = item(); if (!it) break;
        if (src[i] === '>') { i++; it.kids = seq(); }
        out.push(it);
        if (src[i] === '+') { i++; continue; }
        break;
      }
      return out;
    }
    const sub = (s, k) => s.replace(/\$/g, k);
    function render(nodes, d) {
      let out = '';
      for (const n of nodes) for (let k = 1; k <= n.mul; k++) {
        const tag = n.tag || 'div', pad = '  '.repeat(d), text = sub(n.text, k);
        const attrs = ({ a: ' href=""', img: ' src="" alt=""', input: ' type="text"', link: ' rel="stylesheet" href=""' }[tag] || '') + (n.id ? ` id="${sub(n.id, k)}"` : '') + (n.cls.length ? ` class="${n.cls.map((c) => sub(c, k)).join(' ')}"` : '');
        if (VOID.includes(tag)) { out += `${pad}<${tag}${attrs}>\n`; continue; }
        if (n.kids.length) out += `${pad}<${tag}${attrs}>${text}\n${render(n.kids, d + 1)}${pad}</${tag}>\n`;
        else out += `${pad}<${tag}${attrs}>${text}</${tag}>\n`;
      }
      return out;
    }
    return render(seq(), 0).trimEnd();
  }

  /* ================= x-vscode ================= */
  /* ショートカット一覧（モーダル用） */
  function vscKeys() {
    const K8 = [['⌘ P', 'ファイルを素早く開く', 'var(--ts)'], ['⌘ ⇧ P', 'コマンドパレット', 'var(--violet)'], ['⌘ D', '次の同じ単語を選択', 'var(--pink)'], ['⌥ ↑ ↓', '行を上下に移動', 'var(--basic)'], ['⌥ ⇧ ↓', '行を複製', 'var(--team)'], ['⌘ /', 'コメントON/OFF', 'var(--vue)'], ['⌘ B', 'サイドバー開閉', 'var(--ts)'], ['⌃ `', 'ターミナル開閉', 'var(--basic)']];
    const saved = store.get('xb.vsc', {});
    return h('div', null, h('p', { style: { color: 'var(--mute)', fontSize: '.875rem', marginBottom: '.8em' } }, '覚えたらタップで ✓。'), h('div', { class: 'xb-keys' }, K8.map(([k, d, c], i) => {
      const b = h('button', { class: 'xb-k' + (saved[i] ? ' ok' : ''), style: { '--c': c }, onclick: () => { saved[i] = !saved[i]; b.classList.toggle('ok', !!saved[i]); store.set('xb.vsc', saved); } }, h('span', null, ...k.split(' ').map((x) => kbd(x)).flatMap((x) => [x, ' '])), h('small', d));
      return b;
    })));
  }

  K.reg({
    id: 'x-vscode', track: 'extra', title: 'VS Code 便利技', sub: 'Emmet・マルチカーソル・保存で整形', emoji: '🧰',
    gh: [{ label: 'vuejs/99_bonus/prettier.md', path: 'vuejs/99_bonus/prettier.md' }, { label: 'typescript/prettier.json', path: 'typescript/prettier.json' }],
    meta: { cat: 'basic', day: '16日(月)', when: 'HTML 実習の前（コードを書き始める直前）', mins: 10, order: 11, level: '入門', after: 'html', why: 'タイピング量が半分になり、整ったコードがチームの当たり前になる' },
    scenes: [
      {
        t: 'Emmet：略語を Tab で展開', tag: 'Emmet', lead: '短い<b>略語</b>を打って <b>Tab</b> を押すと、HTML が一瞬でできる。略語を変えて試そう。',
        why: {pv: {"k": "code", "lang": "html", "text": "<ul>\n  <li></li>\n  <li></li>\n  <li></li>\n</ul>", "err": [2, 3, 4], "cap": "閉じタグも全部手打ち"}, iv: {"k": "flow", "items": ["pen-line|略語を書く", "sparkles|機械が展開", "pencil|人は中身だけ"]}, av: {"k": "code", "lang": "html", "text": "ul>li*3", "ok": [1], "cap": "Tab で展開"}, "problem": "<code>&lt;ul&gt;&lt;li&gt;…</code> を毎回ぜんぶ手で打つ。閉じタグの打ち忘れも起きる", "idea": "決まった形は機械に書かせる。人は中身だけ書く。", "answer": "Emmet：略語 + Tab（<code>ul&gt;li*3</code>）", "when": [["タグの入れ子・繰り返し", "Emmet"], ["自分用の決まり文句", "ユーザースニペット"], ["ロジックのひな形", "AI 補完"]]},
        render(el) {
          const ex = ['ul>li*3', 'div.card>h2+p', 'ul>li.item$*3', 'table>tr*2>td*3', 'nav>a{ホーム}+a{概要}', '!'];
          const inp = h('input', { class: 'xb-in', value: ex[0], spellcheck: 'false', 'aria-label': 'Emmet 略語' });
          const tab = h('button', { class: 'xb-tab' }, 'Tab ⇥');
          const out = h('div', { class: 'grow' });
          const stage = h('div', { class: 'xb-stage grow' });
          let expanded = '';
          const cap = h('div', { class: 'st-cap', style: { marginTop: '0' } });
          function expand() {
            expanded = emmet(inp.value);
            out.replaceChildren(code(expanded || '<!-- 略語を入力 -->', 'html', { file: 'index.html', color: 'var(--ts)' }));
            const first = out.querySelector('pre'); first.style.height = '100%'; first.style.margin = 0;
            stage.innerHTML = /<html/.test(expanded) ? '<em style="color:#888">（HTMLのひな形ができる）</em>' : expanded.replace(/<(li|a|p|h[1-6]|td|th|button)([^>]*)><\/\1>/g, '<$1$2>テキスト</$1>');
            tab.classList.remove('hit'); void tab.offsetWidth; tab.classList.add('hit');
            out.classList.remove('xb-stale'); stage.classList.remove('xb-stale');
            cap.innerHTML = '展開完了！ <b>' + inp.value.length + ' 文字</b>の入力が <b>' + expanded.length + ' 文字</b>のHTMLに。';
          }
          inp.addEventListener('input', () => { out.classList.add('xb-stale'); stage.classList.add('xb-stale'); cap.innerHTML = '👆 <b>Tab</b> を押すと展開されます'; });
          inp.addEventListener('keydown', (e) => { if (e.key === 'Tab' || e.key === 'Enter') { e.preventDefault(); expand(); } });
          tab.onclick = expand;
          const pre = h('div', { class: 'row' }, ex.map((x) => h('button', { class: 'xb-sg', onclick: () => { inp.value = x; expand(); } }, x)));
          el.append(h('div', { class: 'split xb-st' },
            h('div', null, lbl('略語を入力'), h('div', { class: 'row', style: { flexWrap: 'nowrap' } }, inp, tab), pre, out),
            h('div', null, lbl('ブラウザでの見え方'), stage, cap)));
          expand();
          cap.innerHTML = '<b>ul>li*3</b> の読み方：<code class="i">&gt;</code> は「中に入れる」、<code class="i">*3</code> は「3つ作る」、<code class="i">+</code> は「となりに並べる」。';
        },
      },
      {
        t: 'マルチカーソル & ショートカット', tag: 'Cmd+D', lead: '同じ単語を<b>一度に</b>書き換える。「次へ」で操作を追おう。ショートカット一覧は、タイトル横の <b>キーボードのアイコン</b>。',
        why: {pv: {"k": "code", "lang": "ts", "text": "const price = 100\nconst tax = price * 0.1\nconst total = price + tax", "err": [2, 3], "cap": "1つずつ直すと見落とす"}, iv: {"k": "flow", "items": ["mouse-pointer-click|同じ操作は", "layers|まとめて", "keyboard|キーで"]}, av: {"k": "big", "i": "text-cursor-input", "t": "⌘ D で カーソルを増やす"}, "problem": "変数名を変えたい。4か所を1つずつ直すと見落とす", "idea": "同じ直しは、一度にまとめてやる。", "answer": "⌘D でマルチカーソル、ショートカットを覚える", "when": [["同じ単語を数か所だけ", "⌘D（マルチカーソル）"], ["プロジェクト全体の名前変更", "F2 リネーム（参照も追従）"], ["行の移動・複製", "⌥↑↓ / ⌥⇧↓"]]},
        ref: [{ title: 'ショートカット一覧', icon: 'keyboard', node: () => vscKeys() }],
        render(el) {
          const L = ['const price = 100', 'const tax = price * 0.1', 'const total = price + tax', 'console.log(price, total)'];
          const pre = h('pre', { class: 'code', style: { '--c': 'var(--pink)' } });
          function draw(k, word) {
            pre.replaceChildren(...L.map((ln, li) => {
              const parts = ln.split(/(price)/); let html = ''; let idx = L.slice(0, li).join('\n').split('price').length - 1;
              parts.forEach((p) => { if (p === 'price') { html += idx < k ? `<span class="xb-sel">${word || 'price'}</span>` : 'price'; idx++; } else html += esc(p); });
              return h('span', { class: 'ln', html });
            }));
          }
          const st = stepper({
            color: 'var(--pink)',
            steps: [
              { say: '変数名 <b>price</b> を <b>cost</b> に変えたい。4か所をひとつずつ？ 面倒…' },
              { say: '<b>price</b> を選んで <kbd>⌘</kbd><kbd>D</kbd>。1つ目が選択される。' },
              { say: 'もう一度 <kbd>⌘</kbd><kbd>D</kbd>。2つ目も選択（カーソルが2本に）。' },
              { say: 'さらに <kbd>⌘</kbd><kbd>D</kbd> を2回。4か所すべてにカーソル！' },
              { say: '<b>cost</b> と打つだけで、4か所が同時に書き換わる 🎉' },
            ],
            init(vis) { vis.append(pre); },
            update(n) { draw([0, 1, 2, 4, 4][n], n === 4 ? 'cost' : null); pre.setHi && 0; },
          });
          el.append(st);
        },
      },
      {
        t: '保存するだけで整う', tag: 'Prettier', lead: '<kbd>⌘</kbd><kbd>S</kbd> で保存すると、コードが<b>自動で整う</b>。<b>Live Server</b> がブラウザも更新する。',
        why: {pv: {"k": "code", "lang": "ts", "text": "const  a='x'\nfunction f( ){\nreturn 1}", "err": [1, 2, 3], "cap": "人ごとにバラバラ"}, iv: {"k": "flow", "items": ["save|保存", "sparkles|ツールが整える", "git-pull-request|レビューは中身だけ"]}, av: {"k": "code", "lang": "json", "text": "\"editor.formatOnSave\": true", "ok": [1]}, "problem": "メンバーごとに書式が違い、レビューが「見た目の指摘」だらけ", "idea": "見た目のルールはツールに任せる。保存するだけで揃う。", "answer": "Prettier + formatOnSave（設定ファイルをリポジトリで共有）", "when": [["見た目の統一", "Prettier"], ["バグの予防（未使用変数など）", "ESLint"], ["ブラウザ確認の手間", "Live Server"]]},
        ref: [{ title: '設定ファイル（コピペ用）', icon: 'file-cog', node: () => { const p = code('// .vscode/settings.json\n{\n  "editor.defaultFormatter": "esbenp.prettier-vscode",\n  "editor.formatOnSave": true\n}\n\n// .prettierrc\n{ "semi": false, "singleQuote": true }', 'ts', { color: 'var(--pink)' }); p.setHi([4]); return p; } }],
        render(el) {
          const messy = "const  name='太郎'\nfunction greet( ){\nconsole.log( \"Hello, \"+name )}\ngreet( )";
          const neat = "const name = '太郎'\nfunction greet() {\n  console.log('Hello, ' + name)\n}\ngreet()";
          const edBox = h('div'); const fileTab = h('div', { class: 'label' }, h('span', { class: 'xb-unsaved' }, 'main.js'));
          const brw = h('div', { class: 'xb-brw' }, h('div', { class: 'u' }, h('i'), h('i'), h('i'), h('b', '127.0.0.1:5500'), h('span', { class: 'rl' })), h('div', { class: 'pg' }, h('h3', 'Hello, 太郎'), h('p', { style: { color: '#888' } }, '読み込み: 12:00:00')));
          const rl = brw.querySelector('.rl'), pg = brw.querySelector('.pg');
          const setEd = (txt, hi) => { const p = code(txt, 'ts', { file: 'main.js', color: 'var(--ts)', hi }); edBox.replaceChildren(p); };
          el.append(stepper({
            color: 'var(--ts)',
            steps: [
              { say: 'インデントも空白もバラバラ。このまま保存すると…？' },
              { say: '<kbd>⌘</kbd><kbd>S</kbd>！ <b>Prettier</b> が保存と同時にコードを整える。' },
              { say: '<b>Live Server</b> が変更を検知 → ブラウザも自動リロード ↻' },
            ],
            init(vis) { vis.append(h('div', { class: 'split xb-st' }, h('div', null, fileTab, edBox), h('div', null, lbl('ブラウザ'), brw))); },
            async update(n) {
              fileTab.firstChild.classList.toggle('xb-unsaved', n === 0);
              setEd(n === 0 ? messy : neat, n === 1 ? [1, 2, 3, 4, 5] : []);
              if (n === 1) { const lines = edBox.querySelectorAll('.ln'); lines.forEach((l, i) => l.animate([{ background: 'color-mix(in srgb,var(--pink) 40%,transparent)' }, { background: 'transparent' }], { duration: 900, delay: i * 120 })); }
              if (n === 2) { rl.innerHTML = '<span class="xb-spin"></span>'; await sleep(700); rl.textContent = ''; pg.querySelector('p').textContent = '読み込み: 12:00:03 ✓ 自動更新'; pg.animate([{ background: '#dff7e6' }, { background: '#fff' }], { duration: 900 }); } else { pg.querySelector('p').textContent = '読み込み: 12:00:00'; rl.textContent = ''; }
            },
          }));
        },
      },
      quizScene('どのツールを使う？', 'CHOOSE', '似た機能は<b>守備範囲</b>が違う。目的から選ぼう。',
        { pv: {"k": "flow", "items": [{"i": "search", "t": "置換で全部変更", "c": "bad"}, {"i": "bug", "t": "別の変数まで壊れた", "c": "bad"}]}, iv: {"k": "flow", "items": ["target|範囲と目的で選ぶ"]}, av: {"k": "chips", "items": ["Emmet", "⌘D", "F2", "Prettier", "ESLint"]}, problem: '便利機能が多すぎて、どれを使えば安全か迷う（名前変更を検索置換で壊す、など）', idea: '「何を直したいか」で選ぶ。文字をまとめて変えるのか、名前を安全に変えるのか。', answer: 'Emmet / ⌘D / F2 / Prettier / ESLint の使い分け', when: [['タグを素早く書く', 'Emmet'], ['数か所の同じ文字', '⌘D'], ['変数名を安全に全体変更', 'F2'], ['見た目の統一', 'Prettier'], ['バグの予防', 'ESLint']] },
        [['HTML のリストを素早く書きたい。', ['Emmet（ul>li*3 + Tab）', '全部手打ち', 'コピペして書き換え'], 0, 'お決まりの入れ子は Emmet が最速。'],
          ['変数名をプロジェクト全体で安全に変更したい。', ['⌘D のマルチカーソル', 'F2（名前の変更）', '検索置換で全置換'], 1, 'F2 は参照関係を理解して変更する。⌘D や置換は同じ文字列を全部選ぶだけで、別物まで巻き込む。'],
          ['コードのスタイル統一と、バグの早期発見。担当は？', ['どちらも Prettier', '整形 = Prettier、バグ予防 = ESLint', 'どちらも Live Server'], 1, 'Prettier は見た目、ESLint は問題のあるコードを指摘する。']]),
    ],
  });

  /* ================= x-devtools ================= */
  function miniPage() {
    const root = h('div', { class: 'xb-brw' }, h('div', { class: 'u' }, h('i'), h('i'), h('i'), h('b', 'localhost:5173')), h('div', { class: 'pg' }, h('h1', { style: { fontSize: '2rem', color: '#1a1e3a' } }, 'ようこそ'), h('p', { style: { color: '#555' } }, '研修サイトです。'), h('button', { style: { background: '#5b9dff', color: '#fff', border: 0, borderRadius: '6px', padding: '.4em 1.2em', fontWeight: 800, font: 'inherit' } }, '登録する')));
    return root;
  }
  const NET = [['index.html', 200, 'document', '1.2 kB', 40, 0], ['style.css', 200, 'stylesheet', '3.4 kB', 55, 12], ['app.js', 200, 'script', '18 kB', 120, 12], ['logo.png', 304, 'png', '0.2 kB', 8, 30], ['/api/users', 404, 'fetch', '0.3 kB', 90, 55], ['font.woff2', 200, 'font', '22 kB', 140, 40]];
  const STAT = { 200: ['200 OK', '成功。ちゃんと届いた。', 'c'], 304: ['304 Not Modified', '前と同じ → キャッシュを再利用（速い）。', 'c'], 404: ['404 Not Found', 'URL が違う / ファイルが無い。画像が出ない時はまずここ！', 'bad'] };

  K.reg({
    id: 'x-devtools', track: 'extra', title: 'Chrome DevTools', sub: 'F12 で見える化する', emoji: '🔍',
    gh: [{ label: 'html/（HTMLサンプル）', path: 'html' }, { label: 'html/03_display', path: 'html/03_display' }],
    meta: { cat: 'basic', day: '16日(月)', when: 'CSS の途中（見た目が思い通りにならない場面で）', mins: 10, order: 12, level: '入門', after: 'css', why: '「なぜこう表示される？」を自力で調べられる。現場で一番使う道具' },
    scenes: [
      {
        t: 'Elements：その場で書き換える', tag: 'F12', lead: '右の<b>DevTools</b>で要素を選び、☑ を外したり値を変えたりしてみよう。左のページがすぐ変わる。リロードで元に戻る。',
        why: {pv: {"k": "flow", "items": ["pencil|CSS を直す", "save|保存", "refresh-cw|リロード", "eye|確認"], "loop": "何度も繰り返す"}, iv: {"k": "flow", "items": ["eye|見る", "wrench|その場で直す", "flask-conical|試す"]}, av: {"k": "big", "i": "inspect", "t": "F12 → Elements"}, "problem": "「なんかズレてる」。CSS を直して保存してリロード…を何度も繰り返す", "idea": "想像しない。ブラウザの中身を見て、その場で直して試す。", "answer": "Elements パネル：選択 → スタイル編集 → 即反映", "when": [["見た目の原因を探す", "Elements"], ["エラーを見る", "Console"], ["画像・API が来ない", "Network"], ["スマホ表示の確認", "Device mode"]]},
        hint: 'DevTools の開き方：ページ上で右クリック →「検証」／ <kbd>F12</kbd> ／ <kbd>⌘</kbd><kbd>⌥</kbd><kbd>I</kbd>',
        render(el) {
          const page = miniPage(); const pg = page.querySelector('.pg');
          const nodes = [['div', 'class="pg"', 0, pg], ['h1', '', 1, pg.children[0]], ['p', '', 1, pg.children[1]], ['button', '', 1, pg.children[2]]];
          const DEC = {
            h1: [['color', '#1a1e3a'], ['font-size', '1.8rem'], ['letter-spacing', '0']],
            p: [['color', '#555'], ['font-size', '1rem'], ['text-decoration', 'underline']],
            button: [['background', '#5b9dff'], ['border-radius', '99px'], ['padding', '.4em 1.2em'], ['font-size', '1rem']],
            div: [['background', '#ffffff'], ['padding', '18px']],
          };
          const on = {};
          const tree = h('div'), styles = h('div');
          let sel = 'h1';
          const DOM = { div: pg, h1: pg.children[0], p: pg.children[1], button: pg.children[2] };
          function apply(tag, prop, val, enabled) { DOM[tag].style.setProperty(prop, enabled ? val : ''); if (!enabled && tag === 'p' && prop === 'text-decoration') DOM[tag].style.textDecoration = 'none'; }
          function drawStyles() {
            styles.replaceChildren(h('div', { style: { color: '#9aa3c7', margin: '6px 0 2px' } }, 'Styles — ' + sel + ' {'));
            DEC[sel].forEach(([p, v]) => {
              const key = sel + p; if (on[key] == null) on[key] = sel === 'p' && p === 'text-decoration' ? false : true;
              const cb = h('input', { type: 'checkbox' }); cb.checked = on[key];
              const val = h('input', { type: 'text', value: v, size: Math.max(6, v.length) });
              const row = h('div', { class: 'xb-decl' + (on[key] ? '' : ' off') }, cb, h('span', { class: 'p' }, p + ':'), val, ';');
              cb.onchange = () => { on[key] = cb.checked; row.classList.toggle('off', !cb.checked); apply(sel, p, val.value, cb.checked); };
              val.oninput = () => { val.size = Math.max(6, val.value.length); if (cb.checked) apply(sel, p, val.value, true); };
              styles.append(row);
            });
            styles.append(h('div', { style: { color: '#9aa3c7' } }, '}'));
          }
          function drawTree() {
            tree.replaceChildren(...nodes.map(([t, a, d]) => h('div', { class: 'xb-node' + (t === sel ? ' on' : ''), style: { paddingLeft: 8 + d * 16 + 'px' }, onclick: () => { sel = t; drawTree(); drawStyles(); Object.values(DOM).forEach((n) => (n.style.outline = '')); DOM[t].style.outline = '2px solid #ff6b9d'; } }, h('span', { class: 't' }, '<' + t), a ? [' ', h('span', { class: 'a' }, a)] : '', h('span', { class: 't' }, '>'))));
          }
          const dt = h('div', { class: 'xb-dt' }, h('div', { class: 'tabs' }, h('button', { class: 'on' }, 'Elements'), h('button', 'Console'), h('button', 'Network'), h('button', 'Sources')), h('div', { class: 'pn' }, tree, h('hr', { style: { border: 0, borderTop: '1px solid #2c3247', margin: '8px 0' } }), styles));
          drawTree(); drawStyles(); DOM.h1.style.outline = '2px solid #ff6b9d';
          const edit = h('input', { class: 'xb-in', value: 'ようこそ', style: { fontSize: '1rem' }, oninput: (e) => (DOM.h1.textContent = e.target.value) });
          el.append(h('div', { class: 'split xb-st' }, h('div', null, lbl('ページ（<h1> のテキストも書き換え可）'), page, edit, ), h('div', null, lbl('DevTools'), dt)));
        },
      },
      {
        t: 'Console と Network', tag: 'DEBUG', lead: 'エラーは <b>Console</b>、通信は <b>Network</b> で見る。タブを切り替えて、例や行を押してみよう。',
        why: {pv: {"k": "big", "i": "circle-help", "t": "動かない… 原因は？"}, iv: {"k": "flow", "items": ["clipboard-list|ブラウザが記録", "search|証拠を見る", "wrench|直す"]}, av: {"k": "chips", "items": ["terminal|Console：エラーと値", "network|Network：通信の成否"]}, "problem": "画面が動かない・画像が出ない。コードを眺めても原因が分からない", "idea": "起きたことは、ブラウザが記録している。まずそれを見る。", "answer": "Console（エラーと値）と Network（通信の成否）", "when": [["赤いエラー文", "Console"], ["404 / 500 / 遅い", "Network"], ["変数の中身を確認", "console.log か debugger"]]},
        hint: 'Console に書いた命令は、このページの <b>DOM を直接</b>書き換える（リロードで元に戻る）。',
        render(el, ctx) {
          const page = miniPage(); const pg = page.querySelector('.pg');
          const shim = { querySelector: (s) => pg.querySelector(s), querySelectorAll: (s) => pg.querySelectorAll(s), body: pg };
          const log = h('div', { class: 'xb-con' });
          const add = (c, t) => { log.append(h('div', { class: c }, t)); log.scrollTop = 9e4; };
          const fmt = (v) => (v instanceof Element ? '<' + v.tagName.toLowerCase() + '>' : v instanceof NodeList ? `NodeList(${v.length})` : v === undefined ? 'undefined' : typeof v === 'string' ? `"${v}"` : String(v));
          function run(src) {
            if (!src.trim()) return;
            add('i', '› ' + src);
            const con = { log: (...a) => add('r', a.join(' ')), error: (...a) => add('e', a.join(' ')) };
            try { let r; try { r = new Function('document', 'console', 'return (' + src + ')')(shim, con); } catch (e) { if (e instanceof SyntaxError) r = new Function('document', 'console', src)(shim, con); else throw e; } if (r !== undefined) add('r', '← ' + fmt(r)); } catch (e) { add('e', '✖ ' + e.message); }
          }
          const inp = h('input', { class: 'xb-in', placeholder: 'コードを入力して Enter', style: { fontSize: '.875rem', padding: '.4em .7em' }, onkeydown: (e) => { if (e.key === 'Enter') { run(inp.value); inp.value = ''; } } });
          const ex = ["document.querySelector('h1').textContent = 'こんにちは！'", "document.querySelectorAll('p').length", "document.body.style.background = '#fff6d6'", "console.log('動いた！')", 'document.querySelector("h2").textContent'];
          const exs = h('div', { class: 'row', style: { marginTop: '8px' } }, ex.map((x) => h('button', { class: 'xb-sg', style: { fontFamily: 'var(--mono)', fontSize: '.75rem' }, onclick: () => run(x) }, x.length > 34 ? x.slice(0, 32) + '…' : x)));
          const consoleP = h('div', null, log, inp, exs);
          const detail = h('div', { class: 'st-cap', style: { marginTop: '8px', color: '#d8dcff', background: '#252938', border: '1px solid #2c3247' } }, '行をクリックすると意味が表示されます');
          const tbody = h('tbody');
          const rows = NET.map((r, i) => { const [n, s, ty, sz, ms] = r; const tr = h('tr', { class: STAT[s][2], onclick: () => { rows.forEach((x) => x.classList.toggle('on', x === tr)); detail.innerHTML = `<b>${STAT[s][0]}</b> — ${STAT[s][1]}`; } }, h('td', n), h('td', String(s)), h('td', ty), h('td', sz), h('td', ms + ' ms'), h('td', { style: { width: '30%' } }, h('div', { class: 'xb-wf', style: { marginLeft: r[5] + '%' } }))); return tr; });
          tbody.append(...rows);
          const reload = () => { rows.forEach((tr, i) => { const w = tr.querySelector('.xb-wf'); w.style.transition = 'none'; w.style.width = '0'; void w.offsetWidth; w.style.transition = 'width .6s ' + i * 0.12 + 's'; w.style.width = Math.max(4, NET[i][4] / 4) * (1) + '%'; }); };
          const netP = h('div', null, h('button', { class: 'xb-sg', onclick: reload }, '↻ リロード'), h('table', { class: 'xb-net', style: { marginTop: '6px' } }, h('thead', h('tr', ['Name', 'Status', 'Type', 'Size', 'Time', 'Waterfall'].map((x) => h('th', x)))), tbody), detail);
          const pn = h('div', { class: 'pn' });
          const tabs = ['Console', 'Network'].map((t, i) => h('button', { class: i ? '' : 'on', onclick: () => { tabs.forEach((x) => x.classList.toggle('on', x.textContent === t)); pn.replaceChildren(i ? netP : consoleP); if (i) setTimeout(reload, 50); } }, t));
          const dt = h('div', { class: 'xb-dt' }, h('div', { class: 'tabs' }, h('button', 'Elements'), ...tabs, h('button', 'Sources')), pn);
          pn.append(consoleP);
          add('e', '✖ Failed to load resource: /api/users (404)'); add('i', '› 下のボタンを押して実行 ↓');
          el.append(h('div', { class: 'split xb-st' }, h('div', null, lbl('ページ'), page, ), h('div', null, lbl('DevTools'), dt)));
        },
      },
      {
        t: 'Device mode：スマホで見る', tag: 'RESPONSIVE', lead: '<kbd>⌘</kbd><kbd>⇧</kbd><kbd>M</kbd> でスマホ表示にできる。幅を切り替えて、レイアウトの変化を見よう。右のクイズで「どのパネル？」を試そう。',
        why: {pv: {"k": "flow", "items": [{"i": "monitor", "t": "PC では綺麗", "c": "bad"}, {"i": "smartphone", "t": "スマホで崩れる", "c": "bad"}]}, iv: {"k": "flow", "items": ["ruler|幅を変える", "eye|見え方を確かめる"]}, av: {"k": "big", "i": "smartphone", "t": "⌘⇧M で端末を切り替え"}, "problem": "PC では綺麗なのに、スマホで見ると崩れていた（実機が手元に無い）", "idea": "画面の幅を変えて見え方を確かめる。実機が無くてもできる。", "answer": "Device mode（⌘⇧M）で幅・端末を切り替え", "when": [["レイアウトの崩れ確認", "Device mode"], ["タッチ操作・実際の速度", "実機で最終確認"]]},
        render(el) {
          const dev = h('div', { class: 'xb-dev', style: { width: '100%' } }, h('div', { class: 'pg' }, h('nav', h('span', 'MyApp'), h('span', { class: 'l' }, h('span', 'ホーム'), h('span', '概要'), h('span', '連絡')), h('span', { class: 'm' }, '☰')), h('div', { class: 'gd' }, ['A', 'B', 'C', 'D', 'E', 'F'].map((x) => h('div', x)))));
          const width = h('b', { style: { fontFamily: 'var(--mono)' } }, '100%');
          const setW = (v) => { dev.style.width = v === 'pc' ? '100%' : v + 'px'; width.textContent = v === 'pc' ? 'PC（全幅）' : v + ' px'; };
          const seg = chips([['pc', 'PC'], ['768', 'iPad 768'], ['390', 'iPhone 390'], ['320', 'Small 320']], 'pc', setW, 'var(--ts)');
          const Q = [
            ['ボタンを押しても何も起きない。<b>エラー内容</b>を見たい', ['Elements', 'Console', 'Network'], 1, 'エラーは Console に赤字で出ます。'],
            ['画像が表示されない。<b>404 かも？</b>', ['Network', 'Elements', 'Sources'], 0, 'Status 404 の行が赤く出ます。'],
            ['文字の<b>色をその場で試したい</b>', ['Console', 'Elements', 'Network'], 1, 'Styles で値を書き換えて確認。'],
          ];
          el.append(h('div', { class: 'split xb-st' }, h('div', null, lbl('Device mode'), seg, h('div', { class: 'grow', style: { display: 'grid', placeItems: 'start center', padding: '6px', background: 'var(--card)', borderRadius: '8px', border: '1px solid var(--line)' } }, dev), h('div', { style: { color: 'var(--mute)', fontSize: '.875rem' } }, '表示幅：', width)),
            h('div', null, lbl('どのパネルを開く？'), ...Q.map(([q, o, a, w]) => card(quiz({ q, options: o, answer: a, why: w }))))));
        },
      },
    ],
  });
  style('xb-c', `
  .xb-bm{border-radius:8px;background:#fff;color:#222;padding:14px;display:grid;gap:10px;max-width:340px;margin:0 auto;box-shadow:var(--shadow);font-family:var(--font)}
  .xb-bm [data-c]{outline:2px dashed transparent;outline-offset:3px;border-radius:6px;transition:.2s;position:relative}
  .xb-bm [data-c].hit{outline-color:var(--hc);background-color:color-mix(in srgb,var(--hc) 16%,transparent)}
  .xb-bm [data-c].hit::after{content:attr(data-c);position:absolute;right:-4px;top:-12px;font:800 .62rem var(--mono);background:var(--hc);color:#06101f;padding:0 .5em;border-radius:6px}
  .xb-bm .im{height:78px;border-radius:6px;background:linear-gradient(135deg,#ff6b9d,#5b9dff);display:grid;place-items:center;color:#fff;font-size:1.5rem}
  .xb-bm .ti{margin:0;font-size:1rem}.xb-bm .ti.l{font-size:1.5rem}
  .xb-bm .bt{border:0;border-radius:6px;padding:.5em 1.2em;font:800 .875rem var(--font);background:#e5e8f4;color:#334}.xb-bm .bt.p{background:#5b9dff;color:#fff}
  .xb-bt{font:800 clamp(1rem,2.6vw,1.7rem) var(--mono);display:flex;flex-wrap:wrap;gap:0;padding:18px 14px;background:var(--code);border-radius:8px;color:#d8dcff;justify-content:center;margin-bottom:10px}
  .xb-bt span{padding:2px 2px;border-radius:8px;transition:.25s;opacity:.35;border-bottom:3px solid transparent}.xb-bt span.on{opacity:1;background:color-mix(in srgb,var(--pc) 26%,transparent);border-color:var(--pc);transform:translateY(-4px)}
  .xb-bl{display:grid;gap:6px}.xb-bl button{all:unset;cursor:pointer;padding:.5em .8em;border-radius:8px;background:var(--card);border:1px solid var(--line);transition:.2s;display:grid;gap:1px}
  .xb-bl button:hover,.xb-bl button.on{border-color:var(--pc);background:color-mix(in srgb,var(--pc) 14%,var(--card));transform:translateX(4px)}
  .xb-bl button b{font:800 .875rem var(--mono);color:var(--pc)}.xb-bl button small{color:var(--mute);font-weight:700;font-size:.75rem}
  .xb-ui{border-radius:8px;padding:16px;display:grid;gap:10px;transition:background .4s,color .4s;border:1px solid var(--line);background:var(--bgc,#fff);color:var(--fgc,#222)}
  .xb-ui .bt{border:0;color:#fff;background:var(--brand);border-radius:var(--rad);padding:.55em 1.3em;font:800 1rem var(--font);transition:.3s;justify-self:start}
  .xb-ui .bd{display:inline-block;padding:.1em .8em;border-radius:6px;background:color-mix(in srgb,var(--brand) 22%,transparent);color:var(--brand);font-weight:800;font-size:.75rem;justify-self:start}
  .xb-ui .lk{color:var(--brand);font-weight:800;text-decoration:underline}.xb-ui .bx{border:2px solid var(--brand);border-radius:var(--rad);padding:10px 12px;font-size:.875rem}
  .xb-rng{display:grid;grid-template-columns:90px 1fr 56px;gap:8px;align-items:center;font:700 .875rem var(--mono)}
  .xb-rng input{accent-color:var(--c,var(--ts));width:100%}
  .xb-rzw{position:relative;max-width:100%;padding-right:18px}
  .xb-rz{container-type:inline-size;background:var(--card);border:1px dashed var(--line);border-radius:8px;padding:10px;overflow:hidden}
  .xb-gr3{display:grid;grid-template-columns:1fr;gap:8px}
  @container (min-width:480px){.xb-gr3{grid-template-columns:repeat(2,1fr)}}
  @container (min-width:720px){.xb-gr3{grid-template-columns:repeat(3,1fr)}}
  .xb-fx{display:flex;flex-wrap:wrap;gap:8px}.xb-fx>*{flex:1 1 150px}
  .xb-gr3>div,.xb-fx>div{padding:16px 6px;border-radius:8px;text-align:center;font-weight:900;color:#06101f;background:var(--c1)}
  .xb-hd{position:absolute;right:0;top:0;bottom:0;width:16px;display:grid;place-items:center;cursor:ew-resize;touch-action:none;color:var(--mute)}
  .xb-hd::before{content:"";width:5px;height:46px;border-radius:6px;background:var(--line);transition:.2s}.xb-hd:hover::before,.xb-hd.dr::before{background:var(--ts);height:70px}
  .xb-hv{padding:24px;border-radius:8px;background:linear-gradient(135deg,#5b9dff,#a98bff);color:#fff;font-weight:900;text-align:center;box-shadow:0 8px 20px -10px #5b9dff;cursor:pointer;transition:transform var(--d) var(--ease),box-shadow var(--d) var(--ease)}
  .xb-hv:hover,.xb-hv.hov{transform:translateY(var(--ty)) scale(var(--s)) rotate(var(--r));box-shadow:0 22px 34px -12px #5b9dff}
  .xb-zs{position:relative;height:150px}.xb-zs button{all:unset;cursor:pointer;position:absolute;width:96px;height:96px;border-radius:8px;display:grid;place-items:center;font:900 1.5rem var(--mono);color:#06101f;box-shadow:0 10px 22px -10px #000;transition:transform .25s,z-index 0s}
  .xb-zs button small{display:block;font-size:.65rem;font-weight:700}.xb-zs button:hover{transform:translateY(-6px)}
  .xb-sx{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .xb-sr{background:#10131f;border-radius:8px;padding:12px;display:grid;gap:5px;font:.875rem/1.5 var(--mono);color:#d8dcff;border:1px solid var(--line)}
  .xb-sr div{display:flex;gap:8px;align-items:baseline;padding:3px 8px;border-radius:8px;transition:.25s;opacity:.55}.xb-sr div.on{opacity:1;background:color-mix(in srgb,var(--pink) 30%,transparent);transform:translateX(6px)}
  .xb-sr b{color:#7fd8ff;min-width:7.5em;font-size:.75rem}.xb-sr .w{color:#ffd37a}.xb-sr i{font-style:normal;color:#ff8f9a;margin-left:auto;font-size:.75rem}
  .xa-pg{background:#fff;color:#222;border-radius:8px;overflow:hidden;font-family:var(--font);border:1px solid var(--line)}
  .xa-pg .h{background:#1a1e3a;color:#fff;padding:10px 14px;font-weight:900}.xa-pg .n{display:flex;gap:14px;padding:8px 14px;background:#eef1fb;color:#445;font-weight:700;font-size:.875rem}
  .xa-pg .m{padding:14px}.xa-pg .t{font-size:1.5rem;font-weight:900;margin-bottom:8px}.xa-pg .b{display:inline-block;background:#5b9dff;color:#fff;border:0;border-radius:6px;padding:.5em 1.2em;font:800 .875rem var(--font)}
  .xa-pg .f{padding:8px 14px;background:#eef1fb;color:#667;font-size:.75rem}
  .xa-ratio{font:900 2.4rem var(--mono);line-height:1}.xa-bd{display:inline-flex;gap:4px;align-items:center;padding:.15em .8em;border-radius:6px;font-weight:800;font-size:.75rem;border:1px solid var(--line)}.xa-bd.ok{background:color-mix(in srgb,var(--ok) 22%,transparent);border-color:var(--ok);color:var(--ok)}.xa-bd.ng{background:color-mix(in srgb,var(--bad) 22%,transparent);border-color:var(--bad);color:var(--bad)}
  .xa-kb{position:relative;display:grid;gap:12px;padding:16px;border-radius:8px;background:#fff;color:#222;border:1px solid var(--line);font-family:var(--font)}
  .xa-kb .it{display:flex;align-items:center;gap:10px;position:relative}.xa-kb .it>span.no{position:absolute;left:-6px;top:-8px;font:900 .65rem var(--mono);background:var(--pink);color:#fff;border-radius:6px;padding:0 .5em;opacity:0;transform:scale(.4);transition:.3s;z-index:2}.xa-kb .it.vis>span.no{opacity:1;transform:none}
  .xa-kb .ctl{padding:.5em 1.1em;border-radius:6px;border:2px solid #cfd5ee;background:#f4f6fd;font:800 .875rem var(--font);color:#334}.xa-kb input.ctl{border-radius:6px;min-width:160px;font-weight:500}
  .xa-kb .bad{display:none;color:#e0455a;font:800 .75rem var(--mono)}.xa-kb .it.skip .bad{display:inline}
  .xa-ring{position:absolute;border:3px solid var(--pink);border-radius:8px;box-shadow:0 0 0 5px color-mix(in srgb,var(--pink) 25%,transparent);pointer-events:none;transition:all .35s cubic-bezier(.2,.9,.3,1);opacity:0}
  `);

  /* ================= x-bem ================= */
  const BEMI = [['.card', 'card', '', '', 'ブロック：部品そのもの', 'card'], ['.card__image', 'card', '__image', '', 'エレメント：部品の中のパーツ', 'card__image'], ['.card__title', 'card', '__title', '', 'エレメント：見出し', 'card__title'], ['.card__title--large', 'card', '__title', '--large', 'モディファイア：見た目の違い（大）', 'card__title--large'], ['.card__button--primary', 'card', '__button', '--primary', 'モディファイア：主役ボタン', 'card__button--primary']];
  K.reg({
    id: 'x-bem', track: 'extra', title: 'CSS 命名規則 BEM', sub: '壊れにくいクラス名の付け方', emoji: '🏷️',
    gh: [{ label: 'html/05_css_naming_conversation', path: 'html/05_css_naming_conversation' }],
    meta: { cat: 'basic', day: '16日(月)', when: 'CSS 実習のまとめ（クラス名を付け始める前）', mins: 10, order: 13, level: '入門', after: 'css', why: 'チーム開発で「どのCSSがどこに効く？」を迷わなくなる' },
    scenes: [
      {
        t: 'Block · Element · Modifier', tag: 'BEM', lead: '<b>ブロック__エレメント--モディファイア</b>。クラス名にカーソルを乗せると、カードの該当部分が光る。',
        why: {pv: {"k": "code", "lang": "css", "text": ".box { }\n.title { }\n.red { }", "err": [1, 2, 3], "cap": "どこの？ 何の？"}, iv: {"k": "flow", "items": ["box|部品", "puzzle|中身", "sliders-horizontal|状態"], "cap": "block / __element / --modifier"}, av: {"k": "code", "lang": "css", "text": ".card__title--large { }", "ok": [1]}, "problem": "クラス名が <code>.box</code> <code>.title</code> <code>.red</code>。どこで効いているか分からない", "idea": "クラス名に「どの部品の、どの部分か」を入れる。名前を見るだけで分かる。", "answer": "BEM：<code>block__element--modifier</code>", "when": [["独立した部品", "Block（.card）"], ["部品の中の一部", "Element（.card__title）"], ["色・サイズ・状態の違い", "Modifier（.card--large）"]]},
        hint: '<b>block</b>（部品）＋ <b>__element</b>（部品の中身）＋ <b>--modifier</b>（見た目・状態の違い）。ハイフンとアンダースコアの数で役割が決まる。',
        render(el) {
          const COL = { b: 'var(--ts)', e: 'var(--basic)', m: 'var(--pink)' };
          const tok = h('div', { class: 'xb-bt' }); let cur = 0;
          const card = h('div', { class: 'xb-bm' },
            h('div', { class: 'im', 'data-c': '.card__image' }, icon('image', { size: '1.6rem' })),
            h('h3', { class: 'ti l', 'data-c': '.card__title--large' }, 'BEM でいこう'),
            h('p', { style: { margin: 0, color: '#667', fontSize: '.875rem' } }, 'クラス名だけで役割が分かる'),
            h('button', { class: 'bt p', 'data-c': '.card__button--primary' }, 'はじめる'));
          card.setAttribute('data-c', '.card');
          const list = h('div', { class: 'xb-bl' });
          const items = BEMI.map(([cls, b, e, m, d], i) => h('button', { style: { '--pc': m ? COL.m : e ? COL.e : COL.b }, onmouseenter: () => sel(i), onfocus: () => sel(i), onclick: () => sel(i) }, h('b', cls), h('small', d)));
          list.append(...items);
          function sel(i) {
            cur = i; const [cls, b, e, m] = BEMI[i];
            tok.replaceChildren(h('span', { class: 'on', style: { '--pc': COL.b } }, b), e && h('span', { class: 'on', style: { '--pc': COL.e } }, e), m && h('span', { class: 'on', style: { '--pc': COL.m } }, m));
            items.forEach((x, k) => x.classList.toggle('on', k === i));
            card.querySelectorAll('[data-c]').forEach((n) => { n.classList.remove('hit'); }); card.classList.remove('hit');
            const target = cls === '.card' ? card : card.querySelector(`[data-c="${cls}"]`) || card.querySelector(`[data-c="${cls === '.card__title' ? '.card__title--large' : cls}"]`);
            if (target) { target.classList.add('hit'); target.style.setProperty('--hc', m ? COL.m : e ? COL.e : COL.b); }
          }
          card.querySelectorAll('[data-c]').forEach((n) => n.addEventListener('mouseenter', () => { const i = BEMI.findIndex((x) => x[0] === n.dataset.c); if (i >= 0) sel(i); }));
          el.append(h('div', { class: 'split xb-st' }, h('div', null, lbl('クラス名の分解'), tok, list), h('div', { class: 'grow', style: { display: 'grid', alignContent: 'center', background: 'var(--card)', borderRadius: '8px', border: '1px solid var(--line)', padding: '18px' } }, card)));
          sel(3);
        },
      },
      {
        t: '置き場所を変えても崩れない', tag: 'WHY', lead: '子孫セレクタ（<code>.main .box</code>）だと、HTML の場所を変えたとたんに崩れる。切り替えて、「サイドバーへ移動」を押してみよう。',
        why: {pv: {"k": "code", "lang": "css", "text": ".main .title { color: red }", "err": [1], "cap": "main の外に出すと効かない"}, iv: {"k": "flow", "items": ["tag|自分に付ける", "move|どこでも同じ"]}, av: {"k": "code", "lang": "css", "text": ".card__title { color: red }", "ok": [1]}, "problem": "HTML の位置を変えたら、スタイルが当たらず崩れた（子孫セレクタに頼っている）", "idea": "スタイルは、その要素のクラスに付ける。置く場所が変わっても効く。", "answer": "1つのクラスに1つの役目。BEM のクラス名で書く。", "when": [["部品を再利用したい", "BEM のクラス"], ["親の文脈で変えたい", "Modifier か専用クラス"]]},
        render(el) {
          const CSS = {
            messy: '.main .box { border: 2px solid #5b9dff;\n  padding: 12px; border-radius: 8px; }\n.main .box h2 { color: #1a1e3a;\n  font-size: 22px; }\n.main .box a { background: #5b9dff;\n  color: #fff; padding: 6px 14px;\n  border-radius: 6px; }',
            bem: '.card { border: 2px solid #5b9dff;\n  padding: 12px; border-radius: 8px; }\n.card__title { color: #1a1e3a;\n  font-size: 22px; }\n.card__link { background: #5b9dff;\n  color: #fff; padding: 6px 14px;\n  border-radius: 6px; }',
          };
          let mode = 'messy', moved = false;
          const frame = h('iframe', { style: { width: '100%', height: '250px', border: '1px solid var(--line)', borderRadius: '8px', background: '#fff' }, sandbox: '' });
          const cdBox = h('div'); const verdict = h('div', { class: 'st-cap', style: { marginTop: 'auto' } });
          const mv = h('button', { class: 'btn primary', onclick: () => { moved = !moved; draw(); } });
          function draw() {
            const box = mode === 'messy' ? '<div class="box"><h2>BEM を学ぶ</h2><a href="#">詳しく</a></div>' : '<div class="card"><h2 class="card__title">BEM を学ぶ</h2><a class="card__link" href="#">詳しく</a></div>';
            frame.srcdoc = `<style>body{font-family:sans-serif;margin:8px;display:grid;grid-template-columns:2fr 1fr;gap:10px}.main,.side{border:1px dashed #aaa;border-radius:6px;padding:8px;min-height:190px}.side{background:#f3f4fa}small{color:#888}a{text-decoration:none;display:inline-block}${CSS[mode]}</style><div class="main"><small>.main</small>${moved ? '' : box}</div><div class="side"><small>.side</small>${moved ? box : ''}</div>`;
            cdBox.replaceChildren(code(CSS[mode], 'css', { file: 'style.css', color: mode === 'messy' ? 'var(--bad)' : 'var(--ok)', hi: mode === 'messy' ? [1, 3, 5] : [1, 3, 5] }));
            mv.textContent = moved ? '← メインへ戻す' : '→ サイドバーへ移動';
            verdict.innerHTML = mode === 'messy' ? (moved ? '❌ <b>崩れた！</b> .main の中でしか効かないCSSだった' : '見た目OK。でも <b>.main に頼っている</b>…') : (moved ? '✅ <b>どこへ置いても同じ</b>。クラス名が自分で自分を説明している' : '✅ 部品が<b>自立</b>している（.card だけで完結）');
          }
          const seg = chips([['messy', '子孫セレクタ（.main .box h2）'], ['bem', 'BEM（.card__title）']], 'messy', (v) => { mode = v; draw(); }, 'var(--ts)');
          el.append(h('div', { class: 'split xb-st' }, h('div', null, seg, cdBox, mv), h('div', null, lbl('プレビュー'), frame, verdict)));
          draw();
        },
      },
      quizScene('命名の使い分け', 'CHOOSE', '名前は<b>未来の自分とチーム</b>への説明書。どれが読みやすい？',
        { pv: {"k": "flow", "items": [{"i": "tags", "t": "同じ部品が別の名前", "c": "bad"}, {"i": "circle-help", "t": "どれが何？", "c": "bad"}]}, iv: {"k": "flow", "items": ["box|部品", "puzzle|中身", "sliders-horizontal|状態"]}, av: {"k": "code", "lang": "css", "text": ".card__title--large", "ok": [1]}, problem: '名前の付け方が人それぞれで、同じ部品が違う名前になる', idea: '「部品」「中身」「状態」を、名前の形で見分けられるようにする。', answer: 'BEM（部品）+ 必要ならユーティリティ（微調整）', when: [['部品の意味を表したい', 'BEM'], ['余白など微調整', 'ユーティリティ（.mt-4）'], ['親の位置に頼る', '避ける']] },
        [['カードのタイトル部分のクラス名は？', ['.title', '.card .title（子孫セレクタ）', '.card__title'], 2, '.card__title は「card の title」と名前だけで分かり、場所にも頼らない。'],
          ['「大きいカード」という見た目違いは？', ['.card--large', '.large-card-big', '#card2'], 0, '状態・種類の違いは Modifier（--）。'],
          ['BEM とユーティリティクラス（.mt-4 など）の関係は？', ['部品は BEM、細かい余白の微調整はユーティリティ（併用が普通）', '全部ユーティリティで書く', '全部 !important で上書き'], 0, '部品の構造は BEM、微調整だけユーティリティで足すのが定番。']]),
      {
        t: '実践：BEM に直そう', tag: 'PRACTICE', lead: '見出しと文章のクラス名を <b>BEM</b> に直そう。HTML と CSS の<b>両方</b>を直すのがコツ。（約5分）',
        hint: '<b>もっとやりたい人へ</b><ul><li>ボタンのクラスを <code>card__button</code> と <code>card__button--primary</code> に分けてみよう。</li><li>クラス名は、ぜんぶ小文字。単語の区切りは <code>-</code>。</li></ul>',
        render(el) {
          const HTML0 = '<div class="card">\n  <h2 class="Title">BEM を使おう</h2>      <!-- ① card__title にしよう -->\n  <p class="text_1">クラス名を直そう</p>     <!-- ② card__text にしよう -->\n  <button class="card__button card__button--primary">はじめる</button>\n</div>\n';
          const CSS0 = '/* ③ HTML のクラス名を直したら、ここも同じ名前に直そう */\n.card { border: 2px solid #5b9dff; padding: 14px; border-radius: 8px; max-width: 320px; }\n.Title { color: #1a1e3a; margin: 0 0 6px; }\n.text_1 { color: #667; }\n.card__button { border: 0; border-radius: 99px; padding: .5em 1.2em; }\n.card__button--primary { background: #5b9dff; color: #fff; }\n.card__button--large { font-size: 1.25rem; }\n.card__button--danger { background: #e0455a; color: #fff; }\n';
          const HM1 = HTML0.replace('class="Title">BEM を使おう</h2>      <!-- ① card__title にしよう -->', 'class="card__title">BEM を使おう</h2>');
          const HM2 = HM1.replace('class="text_1">クラス名を直そう</p>     <!-- ② card__text にしよう -->', 'class="card__text">クラス名を直そう</p>');
          const HM3 = HM2.replace(/<\/div>\n$/, '  <button class="card__button card__button--large card__button--danger">削除する</button>\n</div>\n');
          const HTML1 = HM3;
          const CSS1 = CSS0.replace('/* ③ HTML のクラス名を直したら、ここも同じ名前に直そう */\n', '').replace('.Title {', '.card__title {').replace('.text_1 {', '.card__text {');
          el.append(playground({
            title: 'BEM', mode: 'web',
            files: [{ name: 'index.html', lang: 'html', code: HTML0 }, { name: 'style.css', lang: 'css', code: CSS0 }],
            solution: { 'index.html': HTML1, 'style.css': CSS1 },
            tasks: (v, c) => {
              const d = c.doc && c.doc(); const q = (s) => (d ? d.querySelectorAll(s).length : 0);
              const t = d && d.querySelector('.card__title');
              return [
                { label: '見出しのクラスを <code>card__title</code> にする', ok: q('h2.card__title') >= 1, hint: ['見出し（<code>h2</code>）の <code>class="…"</code> を見てみよう。', '<code>Title</code> を <code>card__title</code> に書き換える。'], answer: { code: HM1, lang: 'html', mode: 'replace' } },
                { label: '文章のクラスを <code>card__text</code> にする', ok: q('p.card__text') >= 1, hint: ['文章（<code>p</code>）のクラスも、同じように直す。', '<code>text_1</code> を <code>card__text</code> にする。'], answer: { code: HM2, lang: 'html', mode: 'replace' } },
                { label: 'CSS の名前も直して、見出しの色が今まで通り（紺色）', ok: !!t && getComputedStyle(t).color === 'rgb(26, 30, 58)', hint: ['HTML を直すと、CSS の <code>.Title</code> が効かなくなる。', 'CSS の <code>.Title</code> を <code>.card__title</code> に、<code>.text_1</code> を <code>.card__text</code> に直す。'], answer: { code: CSS1, lang: 'css', mode: 'replace' } },
                { optional: true, label: '<b>任意：</b>ボタンをもう1つ。<code>--large</code> と <code>--danger</code> を<b>両方</b>使って、大きくて赤いボタンにする', ok: !!d && [...d.querySelectorAll('button.card__button--large.card__button--danger')].some((bt) => { const cs = getComputedStyle(bt); return parseFloat(cs.fontSize) >= 18 && cs.backgroundColor === 'rgb(224, 69, 90)'; }), hint: ['modifier（<code>--</code>）は、いくつでも重ねて付けられる。CSS は書き済み。', '<code>&lt;button class="card__button card__button--large card__button--danger"&gt;削除する&lt;/button&gt;</code> を足す。'], answer: { code: HM3, lang: 'html', mode: 'replace' } },
              ];
            },
          }));
        },
      },
    ],
  });

  /* ================= x-css-plus ================= */
  function sass(src) {
    const vars = {}, mixins = {};
    src = src.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
    let i = 0;
    const decl = (s) => {
      s = s.trim(); let m;
      if ((m = /^\$([\w-]+)\s*:\s*([\s\S]+)$/.exec(s))) { vars[m[1]] = m[2].trim(); return null; }
      if ((m = /^@include\s+([\w-]+)/.exec(s))) return { inc: m[1] };
      const k = s.indexOf(':'); if (k < 0) throw new Error('宣言が不正: ' + s.slice(0, 24));
      return { p: s.slice(0, k).trim(), v: s.slice(k + 1).trim() };
    };
    function block() {
      const items = []; let buf = '';
      while (i < src.length) {
        const c = src[i];
        if (c === '{') { const head = buf.trim(); buf = ''; i++; const inner = block(); if (head.startsWith('@mixin')) mixins[head.slice(6).trim()] = inner; else items.push({ sel: head, items: inner }); }
        else if (c === '}') { i++; if (buf.trim()) { const d = decl(buf); d && items.push(d); } return items; }
        else if (c === ';') { i++; if (buf.trim()) { const d = decl(buf); d && items.push(d); } buf = ''; }
        else { buf += c; i++; }
      }
      if (buf.trim()) { const d = decl(buf); d && items.push(d); }
      return items;
    }
    const tree = block();
    const sub = (v) => v.replace(/\$([\w-]+)/g, (m, n) => (vars[n] != null ? vars[n] : m));
    function emit(items, sel, out) {
      const decls = [], kids = [];
      for (const it of items) { if (it.p) decls.push(it); else if (it.inc) (mixins[it.inc] || []).forEach((m) => m.p && decls.push(m)); else if (it.items) kids.push(it); }
      if (sel && decls.length) out.push(sel + ' {\n' + decls.map((d) => `  ${d.p}: ${sub(d.v)};`).join('\n') + '\n}');
      for (const k of kids) {
        if (k.sel.startsWith('@media')) { const inner = []; emit(k.items, sel, inner); out.push(k.sel + ' {\n' + inner.join('\n').replace(/^/gm, '  ') + '\n}'); }
        else { const parts = k.sel.split(',').map((s) => s.trim()); const ns = parts.map((p) => (sel ? (p.includes('&') ? p.replace(/&/g, sel) : sel + ' ' + p) : p)).join(', '); emit(k.items, ns, out); }
      }
    }
    const out = []; emit(tree, '', out); return out.join('\n');
  }
  const SCSS = {
    var: '$brand: #5b9dff;\n$radius: 12px;\n\n.btn {\n  background: $brand;\n  border-radius: $radius;\n}\n.badge {\n  color: $brand;\n}',
    nest: '.nav {\n  display: flex;\n  a {\n    color: #334;\n    &:hover { color: #5b9dff; }\n  }\n  .active { font-weight: 800; }\n}',
    mixin: '$brand: #5b9dff;\n@mixin pill {\n  border-radius: 6px;\n  padding: 6px 16px;\n}\n\n.btn {\n  background: $brand;\n  @include pill;\n  &:hover { opacity: .8; }\n}\n.tag { @include pill; }',
  };

  K.reg({
    id: 'x-css-plus', track: 'extra', title: 'CSS プラスα', sub: '変数・Sass・レスポンシブ・動き', emoji: '🎨',
    gh: [{ label: 'html/03_display（flex）', path: 'html/03_display' }, { label: 'html/04_position', path: 'html/04_position' }, { label: 'html/02.2_box_model', path: 'html/02.2_box_model' }],
    meta: { cat: 'basic', day: '16日(月)', when: 'CSS が早く終わった時・Vue のスタイル前の寄り道', mins: 15, order: 14, level: '応用', after: 'css', why: 'スライド目次の「プラスα Sass」を補完。実務の CSS はほぼ変数・レスポンシブ・アニメを使う' },
    scenes: [
      {
        t: 'CSS 変数 var()', tag: '--custom', lead: '値を<b>1か所</b>で決めて、あちこちで使う。スライダーを動かすと、全部が一緒に変わる。',
        why: {pv: {"k": "code", "lang": "css", "text": "a { color: #5b9dff }\nb { border: #5b9dff }\nc { fill: #5b9dff }\n…", "err": [1, 2, 3], "cap": "50か所にコピペ"}, iv: {"k": "flow", "items": ["pin|1か所で決める", "link|参照する"]}, av: {"k": "code", "lang": "css", "text": ":root { --main: #5b9dff }\na { color: var(--main) }", "ok": [1, 2]}, "problem": "ブランドカラーを変えたい。<code>#5b9dff</code> が50か所にコピペされている", "idea": "色などの値は1か所に書く。ほかの場所はそれを呼び出す。", "answer": "<code>--main: #5b9dff</code> と <code>var(--main)</code>", "when": [["色・余白・フォントの共通値", "CSS 変数"], ["JS で変えたい・ダークモード", "CSS 変数（実行時に変えられる）"], ["ループや計算が複雑", "Sass"]]},
        render(el) {
          const S = { hue: 215, rad: 12, dark: false };
          const ui = h('div', { class: 'xb-ui' }, h('span', { class: 'bd' }, 'NEW'), h('h3', { style: { margin: 0 } }, 'ブランドカラーを変える'), h('div', { class: 'bx' }, '枠線も var(--brand)'), h('a', { class: 'lk' }, 'リンクも var(--brand)'), h('button', { class: 'bt' }, 'ボタン'));
          const cd = h('div');
          const row = (label, key, min, max, unit, c) => { const v = h('b'); const r = h('input', { type: 'range', min, max, value: S[key], oninput: (e) => { S[key] = +e.target.value; upd(); } }); return [h('div', { class: 'xb-rng', style: { '--c': c } }, h('span', label), r, v), v, unit]; };
          const rows = [row('--brand', 'hue', 0, 360, 'deg', 'var(--pink)'), row('--radius', 'rad', 0, 32, 'px', 'var(--ts)')];
          const dk = h('button', { class: 'xb-sg', style: { '--c': 'var(--violet)' }, onclick: () => { S.dark = !S.dark; dk.classList.toggle('on', S.dark); upd(); } }, icon('moon'), ' ダークモード');
          function upd() {
            const brand = `hsl(${S.hue} 85% ${S.dark ? 68 : 52}%)`;
            ui.style.setProperty('--brand', brand); ui.style.setProperty('--rad', S.rad + 'px'); ui.style.setProperty('--bgc', S.dark ? '#171a2c' : '#fff'); ui.style.setProperty('--fgc', S.dark ? '#eef0ff' : '#222');
            rows[0][1].textContent = S.hue + 'deg'; rows[1][1].textContent = S.rad + 'px';
            cd.replaceChildren(code(`:root {\n  --brand: ${brand};\n  --radius: ${S.rad}px;\n}${S.dark ? '\n.dark {\n  --bg: #171a2c;  /* ダーク用の値で上書き */\n}' : ''}\n.btn  { background: var(--brand);\n        border-radius: var(--radius); }\n.link { color: var(--brand); }\n.box  { border: 2px solid var(--brand); }`, 'css', { file: 'style.css', color: 'var(--pink)', hi: [2, 3] }));
          }
          el.append(h('div', { class: 'split xb-st' }, h('div', null, lbl('変数を変える'), ...rows.map((r) => r[0]), dk, h('div', { class: 'grow' }, cd)), h('div', null, lbl('プレビュー'), h('div', { class: 'grow', style: { display: 'grid', alignContent: 'center' } }, ui))));
          upd();
        },
      },
      {
        t: 'Sass(SCSS)：書き方 → CSS', tag: 'SASS', lead: 'ブラウザは SCSS を読めない。だから<b>CSS に変換（コンパイル）</b>して使う。左を書き換えると、右が変わる。',
        why: {pv: {"k": "code", "lang": "css", "text": ".nav ul li a { }\n.nav ul li a:hover { }\n.nav ul li a:focus { }", "err": [1, 2, 3], "cap": "長くて同じ繰り返し"}, iv: {"k": "flow", "items": ["pen-line|書きやすく書く", "cog|変換する", "send|CSS を配る"]}, av: {"k": "code", "lang": "css", "text": ".nav { a { &:hover { } } }", "ok": [1]}, "problem": "同じ記述の繰り返しと長いセレクタ。素の CSS だけだと整理しづらい", "idea": "書きやすい書き方で書いて、最後に CSS に変換する。", "answer": "Sass：入れ子・変数・mixin → コンパイル", "when": [["入れ子や mixin で整理したい", "Sass"], ["値の共有だけ", "CSS 変数で十分"], ["ビルド環境が無い", "素の CSS"]]},
        render(el) {
          const out = h('div', { class: 'grow' });
          const ed = K.W.codeEditor(SCSS.nest, 'css', run); ed.style.borderRadius = '14px'; ed.style.minHeight = '270px';
          function run(v) {
            let res; try { res = sass(v); } catch (e) { res = '/* ⚠ ' + e.message + ' */'; }
            const p = code(res || '/* ここに結果 */', 'css', { file: 'style.css (出力)', color: 'var(--ok)' }); p.style.height = '100%'; p.style.margin = 0; out.replaceChildren(p);
          }
          const seg = chips([['var', '変数 $'], ['nest', 'ネスト & &'], ['mixin', 'mixin']], 'nest', (k) => { ed.set(SCSS[k]); }, 'var(--pink)');
          el.append(h('div', { class: 'split xb-st' }, h('div', null, lbl('SCSS（編集OK）'), seg, ed), h('div', null, lbl('コンパイル結果 CSS'), out)));
          run(SCSS.nest);
        },
      },
      {
        t: 'レスポンシブ：幅で変わる', tag: 'RESPONSIVE', lead: '右端の<b>つまみをドラッグ</b>して幅を変えよう。幅に合わせて列の数が変わり、コードの該当行が光る。Flex と Grid も比べてみよう。',
        why: {pv: {"k": "flow", "items": [{"i": "monitor", "t": "PC 幅で作る", "c": "bad"}, {"i": "smartphone", "t": "スマホではみ出す", "c": "bad"}]}, iv: {"k": "flow", "items": ["ruler|幅を測る", "git-branch|ルールを切り替える"]}, av: {"k": "code", "lang": "css", "text": "@media (max-width: 600px) {\n  .grid { grid-template-columns: 1fr }\n}", "ok": [2]}, "problem": "PC 幅で作ったら、スマホで横にはみ出す・文字が小さい", "idea": "画面の幅によって、使うルールを切り替える。", "answer": "<code>@media</code> と、Flex / Grid の折り返し", "when": [["1方向に並べる", "Flex"], ["行と列の格子", "Grid"], ["幅で見た目を切り替える", "メディアクエリ"]]},
        hint: 'このデモは、<b>枠の幅</b>で切り替わる <code>@container</code> を使っている。ふつうは<b>画面の幅</b>で切り替わる <code>@media</code> を使う。書き方はほとんど同じ。',
        render(el, ctx) {
          const mk = (n) => h('div', { style: { '--c1': `hsl(${200 + n * 28} 85% 78%)` } }, 'Card ' + n);
          let mode = 'grid';
          const grid = h('div', { class: 'xb-gr3' }, [1, 2, 3, 4, 5].map(mk));
          const wrap = h('div', { class: 'xb-rz' }, grid);
          const outer = h('div', { class: 'xb-rzw', style: { width: '700px' } }, wrap);
          const hd = h('div', { class: 'xb-hd', title: 'ドラッグで幅を変更' }); outer.append(hd);
          const wl = h('b', { style: { fontFamily: 'var(--mono)' } });
          const cdBox = h('div');
          const GCODE = '.cards { display: grid; gap: 8px;\n  grid-template-columns: 1fr; }          /* スマホ */\n@media (min-width: 480px) {\n  .cards { grid-template-columns: repeat(2, 1fr); } }\n@media (min-width: 720px) {\n  .cards { grid-template-columns: repeat(3, 1fr); } }';
          const FCODE = '.cards { display: flex; flex-wrap: wrap;\n  gap: 8px; }\n.cards > * { flex: 1 1 150px; }\n\n/* 入りきらなければ自動で折り返し。\n   最後の段は広がる */';
          let cw = 700;
          function draw() { const p = code(mode === 'grid' ? GCODE : FCODE, 'css', { file: 'style.css', color: 'var(--ts)' }); p.style.margin = 0; p.style.height = '100%'; cdBox.style.height = '100%'; cdBox.replaceChildren(p); hi(); }
          function hi() { const p = cdBox.firstChild; if (!p || mode !== 'grid') return; const w = grid.clientWidth; p.setHi(w >= 720 ? [5, 6] : w >= 480 ? [3, 4] : [1, 2]); }
          const apply = (px) => { cw = Math.max(260, Math.min(outer.parentElement.clientWidth - 4, px)); outer.style.width = cw + 'px'; wl.textContent = Math.round(grid.clientWidth) + ' px'; hi(); };
          hd.addEventListener('pointerdown', (e) => { hd.setPointerCapture(e.pointerId); hd.classList.add('dr'); const x0 = e.clientX, w0 = outer.offsetWidth; const mv = (ev) => apply(w0 + ev.clientX - x0); const up = () => { hd.classList.remove('dr'); hd.removeEventListener('pointermove', mv); hd.removeEventListener('pointerup', up); }; hd.addEventListener('pointermove', mv); hd.addEventListener('pointerup', up); });
          const seg = chips([['grid', 'Grid（2次元・列を決める）'], ['flex', 'Flex（1次元・折り返す）']], 'grid', (v) => { mode = v; grid.className = v === 'grid' ? 'xb-gr3' : 'xb-fx'; draw(); }, 'var(--ts)');
          const ro = new ResizeObserver(() => { wl.textContent = Math.round(grid.clientWidth) + ' px'; hi(); }); ro.observe(wrap); ctx.cleanups.push(() => ro.disconnect());
          el.append(h('div', { class: 'split xb-st' }, h('div', null, lbl('幅をドラッグ'), seg, h('div', { class: 'grow', style: { overflow: 'hidden' } }, outer), h('div', { style: { color: 'var(--mute)', fontSize: '.875rem' } }, '現在の幅：', wl)), h('div', null, lbl('CSS'), h('div', { class: 'grow' }, cdBox))));
          draw(); setTimeout(() => apply(Math.min(700, outer.parentElement.clientWidth - 4)), 30);
        },
      },
      {
        t: '動きと重なり', tag: 'transition · z-index', lead: 'カードにカーソルを乗せて動きを見よう。スライダーで CSS が変わる。右は重なり順（<b>z-index</b>）。押すと一番手前に来る。',
        why: {pv: {"k": "flow", "items": [{"i": "zap", "t": "いきなり変わる", "c": "bad"}, {"i": "layers", "t": "前後が分からない", "c": "bad"}]}, iv: {"k": "flow", "items": ["timer|短く連続的に", "layers|順序を書く"]}, av: {"k": "code", "lang": "css", "text": ".card { transition: .3s }\n.modal { z-index: 10 }", "ok": [1, 2]}, "problem": "状態が急に変わると目が追えない。要素が他に隠れて見えない", "idea": "変化は短く滑らかに。重なりは z-index の数字で決める。", "answer": "transition / transform と z-index", "when": [["ホバーなど軽い動き", "transition"], ["複雑な連続アニメ", "animation"], ["前後関係を決める", "z-index（position を指定した要素に）"]]},
        render(el) {
          const S = { d: .3, s: 1.08, r: -3, ty: -8, ease: 'ease' };
          const hv = h('div', { class: 'xb-hv' }, 'ホバーしてね'); const cd = h('div');
          const demo = h('button', { class: 'xb-sg', style: { '--c': 'var(--pink)' }, onclick: () => { hv.classList.toggle('hov'); demo.classList.toggle('on', hv.classList.contains('hov')); } }, icon('play', { f: 1 }), ' 自動でホバー');
          const sl = (label, key, min, max, step, u) => { const v = h('b'); const r = h('input', { type: 'range', min, max, step, value: S[key], oninput: (e) => { S[key] = +e.target.value; upd(); } }); return { box: h('div', { class: 'xb-rng', style: { '--c': 'var(--ts)' } }, h('span', label), r, v), v, u, key }; };
          const sls = [sl('duration', 'd', .1, 1.2, .05, 's'), sl('scale', 's', 1, 1.4, .02, ''), sl('rotate', 'r', -15, 15, 1, 'deg'), sl('translateY', 'ty', -24, 0, 1, 'px')];
          const seg = chips([['ease', 'ease'], ['linear', 'linear'], ['cubic-bezier(.3,1.6,.5,1)', 'bounce']], 'ease', (v) => { S.ease = v; upd(); }, 'var(--ts)');
          function upd() {
            hv.style.setProperty('--d', S.d + 's'); hv.style.setProperty('--s', S.s); hv.style.setProperty('--r', S.r + 'deg'); hv.style.setProperty('--ty', S.ty + 'px'); hv.style.setProperty('--ease', S.ease);
            sls.forEach((x) => (x.v.textContent = S[x.key] + x.u));
            cd.replaceChildren(code(`.card {\n  transition: transform ${S.d}s ${S.ease};\n}\n.card:hover {\n  transform: translateY(${S.ty}px)\n             scale(${S.s}) rotate(${S.r}deg);\n}`, 'css', { file: 'style.css', color: 'var(--ts)', hi: [2, 5, 6] }));
          }
          /* z-index */
          const Z = [['A', 'var(--ts)', 10, 0, 0], ['B', 'var(--pink)', 20, 50, 30], ['C', 'var(--basic)', 30, 100, 10]];
          const zs = h('div', { class: 'xb-zs' }); const zc = h('div');
          const zb = Z.map(([n, c, z, l, t]) => { const b = h('button', { style: { background: c, left: l + 'px', top: t + 'px', zIndex: z }, onclick: () => { const mx = Math.max(...Z.map((q) => q[2])); if (z !== mx) { Z.find((q) => q[0] === n)[2] = mx + 10; zdraw(); } } }, h('span', n, h('small', 'z-index:' + z))); return b; });
          zs.append(...zb);
          function zdraw() { Z.forEach((q, i) => { zb[i].style.zIndex = q[2]; zb[i].querySelector('small').textContent = 'z-index:' + q[2]; zb[i].animate([{ transform: 'scale(1.12)' }, { transform: 'none' }], { duration: 250 }); }); zc.replaceChildren(code(Z.map((q) => `.${q[0].toLowerCase()} { z-index: ${q[2]}; }`).join('\n'), 'css', { color: 'var(--pink)' })); }
          const c1 = h('div', { class: 'col' }, lbl('transition / transform'), hv, h('div', { class: 'row' }, demo, seg), ...sls.map((x) => x.box), cd);
          const c2 = h('div', { class: 'col' }, lbl('z-index：重なり順'), zs, zc, h('div', { class: 'st-cap', html: '数字が大きいほど手前に出る。ふつうは <b>position を指定した要素</b>に効く（Flex / Grid の子は position なしでも効く）。' }));
          el.append(h('div', { class: 'split xb-st' }, h('div', null, c1), h('div', null, c2)));
          upd(); zdraw();
        },
      },
      quizScene('どれを選ぶ？：CSS 編', 'CHOOSE', 'Flex か Grid か、px か rem か。<b>目的</b>から選ぼう。',
        { pv: {"k": "flow", "items": [{"i": "circle-help", "t": "動けばいいで選ぶ", "c": "bad"}, {"i": "smartphone", "t": "幅が変わると崩れる", "c": "bad"}]}, iv: {"k": "flow", "items": ["ruler|何に合わせる？", "wrench|道具を選ぶ"]}, av: {"k": "chips", "items": ["Flex", "Grid", "rem", "%", "var()"]}, problem: '「動けばいい」で選ぶと、画面幅や文字サイズの変更で崩れる', idea: '「何に合わせたいか」で選ぶ。1列か格子か、固定か画面に合わせるか。', answer: 'Flex / Grid、px / rem / %、CSS 変数', when: [['1方向に並べる', 'Flex'], ['行も列も揃える', 'Grid'], ['ユーザーの文字設定に合わせる', 'rem'], ['親の幅に合わせる', '%'], ['値を1か所で管理', 'CSS 変数']] },
        [['ヘッダーのロゴとメニューを左右に並べたい（1方向）。', ['Flex', 'Grid', 'position:absolute'], 0, '1方向に並べるなら Flex が簡単。'],
          ['商品カードを、行も列も揃った格子で並べたい。', ['Flex', 'Grid', 'table'], 1, '2方向の格子は Grid の得意分野。'],
          ['文字サイズを、ユーザーのブラウザ設定に合わせて拡大縮小させたい。', ['px', 'rem', 'vh'], 1, 'rem は基準の文字サイズに連動。px は固定。'],
          ['親の幅の半分にしたい。', ['50%', '50px', '50vh'], 0, '% は親要素が基準。']]),
      {
        t: '実践：変数とレスポンシブ', tag: 'PRACTICE', lead: '色を<b>変数</b>にまとめて、スマホ幅では<b>1列</b>にしよう。足りないところを3か所だけ書く。（約5分）',
        hint: '<b>もっとやりたい人へ</b><ul><li><code>--radius</code> も変数にして、ボタンの角丸に使ってみよう。</li><li><code>.dark { --brand: ... }</code> でダークモード風にできる。</li></ul>',
        render(el) {
          const HTML = '<h1>お知らせ</h1>\n<button class="btn">見る</button>\n<div class="grid">\n  <div>1</div><div>2</div><div>3</div>\n</div>\n';
          const CSS0 = ':root {\n  /* ① --brand に色を決めよう（例: #5b9dff） */\n}\nh1 { color: #5b9dff; }        /* ② var(--brand) にしよう */\n.btn { background: #5b9dff; color: #fff; border: 0; padding: .5em 1.2em; border-radius: 6px; }   /* ② ここも */\n.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 12px; }\n.grid div { background: #eef3ff; padding: 12px; text-align: center; }\n/* ③ 幅が 600px 以下のとき 1列にしよう（@media） */\n';
          const CM1 = CSS0.replace('  /* ① --brand に色を決めよう（例: #5b9dff） */\n', '  --brand: #5b9dff;\n');
          const CM2 = CM1.replace('h1 { color: #5b9dff; }        /* ② var(--brand) にしよう */', 'h1 { color: var(--brand); }').replace('.btn { background: #5b9dff; color: #fff; border: 0; padding: .5em 1.2em; border-radius: 6px; }   /* ② ここも */', '.btn { background: var(--brand); color: #fff; border: 0; padding: .5em 1.2em; border-radius: 6px; }');
          const CSS1 = ':root {\n  --brand: #5b9dff;\n}\nh1 { color: var(--brand); }\n.btn { background: var(--brand); color: #fff; border: 0; padding: .5em 1.2em; border-radius: 6px; }\n.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 12px; }\n.grid div { background: #eef3ff; padding: 12px; text-align: center; }\n@media (max-width: 600px) {\n  .grid { grid-template-columns: 1fr; }\n}\n.dark { --brand: #8ec5ff; }\n';
          el.append(playground({
            title: 'CSS', mode: 'web',
            files: [{ name: 'index.html', lang: 'html', code: HTML }, { name: 'style.css', lang: 'css', code: CSS0 }],
            solution: { 'style.css': CSS1 },
            tasks: (v, c) => {
              const d = c.doc && c.doc();
              const css = (v['style.css'] || '').replace(/\/\*[\s\S]*?\*\//g, '');
              return [
                { label: '<code>:root</code> に <code>--brand</code> の色を決める', ok: /:root\s*\{[^}]*--brand\s*:\s*[^;}\s][^;}]*/.test(css), hint: ['変数は <code>--名前: 値;</code> の形で、<code>:root { }</code> の中に書く。', '<code>--brand: #5b9dff;</code> を <code>:root</code> の中に入れる。'], answer: { code: CM1, lang: 'css', mode: 'replace' } },
                { label: '見出しとボタンの色を <code>var(--brand)</code> にする', ok: /h1\s*\{[^}]*var\(\s*--brand/.test(css) && /\.btn\s*\{[^}]*var\(\s*--brand/.test(css), hint: ['変数を使うときは <code>var(--名前)</code>。<code>#5b9dff</code> と書いてある所を置き換える。', '<code>h1 { color: var(--brand); }</code> と <code>.btn { background: var(--brand); … }</code>'], answer: { code: CM2, lang: 'css', mode: 'replace' } },
                { label: '幅が狭いとき（<code>@media</code>）、<code>.grid</code> を1列にする', ok: /@media[^{]*max-width[^{]*\{\s*\.grid\s*\{[^}]*grid-template-columns\s*:\s*(1fr|repeat\(\s*1\s*,\s*1fr\s*\)|100%|none)/.test(css), hint: ['「幅が 600px 以下のとき」は <code>@media (max-width: 600px) { … }</code>。', '中に <code>.grid { grid-template-columns: 1fr; }</code> を書く。'], answer: { code: CSS1, lang: 'css', mode: 'replace' } },
              { optional: true, label: '<b>任意：</b><code>.dark</code> クラスのとき <code>--brand</code> が別の色になるようにする（ダークモード）', ok: (() => { const b = d && d.body; if (!b) return false; const before = getComputedStyle(b).getPropertyValue('--brand').trim(); b.classList.add('dark'); const after = getComputedStyle(b).getPropertyValue('--brand').trim(); b.classList.remove('dark'); return !!after && after !== before; })(), hint: ['変数は、あとから書いた <code>.dark { … }</code> の中で上書きできる。', '<code>.dark { --brand: #8ec5ff; }</code> を CSS の最後に足す。'], answer: { code: '.dark { --brand: #8ec5ff; }', lang: 'css', mode: 'append' } },
              ];
            },
          }));
        },
      },
    ],
  });

  /* ================= x-a11y ================= */
  const SR = {
    div: [['text', 'My Shop', ''], ['text', 'ホーム', ''], ['text', '商品', ''], ['text', '春のセール', '見出しと分からない'], ['text', 'カートに入れる', 'ボタンと分からない'], ['text', '© 2026', '']],
    sem: [['banner', 'My Shop', ''], ['navigation', '2個のリンク', ''], ['link', 'ホーム', ''], ['link', '商品', ''], ['main', '', ''], ['heading 1', '春のセール', ''], ['button', 'カートに入れる', ''], ['contentinfo', '© 2026', '']],
  };
  const SRCODE = {
    div: '<div class="header">My Shop</div>\n<div class="nav">\n  <div>ホーム</div><div>商品</div>\n</div>\n<div class="main">\n  <div class="title">春のセール</div>\n  <div class="btn">カートに入れる</div>\n</div>\n<div class="footer">© 2026</div>',
    sem: '<header>My Shop</header>\n<nav>\n  <a href="/">ホーム</a><a href="/p">商品</a>\n</nav>\n<main>\n  <h1>春のセール</h1>\n  <button>カートに入れる</button>\n</main>\n<footer>© 2026</footer>',
  };
  function a11yPage() {
    return h('div', { class: 'xa-pg' }, h('div', { class: 'h' }, 'My Shop'), h('div', { class: 'n' }, h('span', 'ホーム'), h('span', '商品')), h('div', { class: 'm' }, h('div', { class: 't' }, '春のセール'), h('span', { class: 'b' }, 'カートに入れる')), h('div', { class: 'f' }, '© 2026'));
  }
  const CB = { none: '', protan: 'url(#xa-p)', deutan: 'url(#xa-d)', tritan: 'url(#xa-t)', gray: 'grayscale(1)' };
  const lum = (hex) => { const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4))); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

  K.reg({
    id: 'x-a11y', track: 'extra', title: 'アクセシビリティ入門', sub: '誰にでも使えるWebへ', emoji: '🛡️',
    gh: [{ label: 'html/（HTMLサンプル）', path: 'html' }, { label: 'html/02_heading_tag.html', path: 'html/02_heading_tag.html' }],
    meta: { cat: 'basic', day: '16日(月)', when: 'HTML 実習の仕上げ（タグ選びの“なぜ”を伝える時）', mins: 10, order: 15, level: '応用', after: 'html', why: 'タグを意味で選ぶ理由が分かる。SEO・読み上げ・キーボード操作すべてに効く' },
    scenes: [
      {
        t: 'セマンティックHTML：読み上げ視点', tag: 'SEMANTIC', lead: '見た目が同じでも、<b>タグが違う</b>と、読み上げソフトの伝え方が変わる。「読み上げ」を押そう。',
        why: {pv: {"k": "code", "lang": "html", "text": "<div class=\"title\">見出し</div>\n<div onclick=\"\">送信</div>", "err": [1, 2], "cap": "読み上げではただの文字"}, iv: {"k": "flow", "items": ["eye|見た目", "brain|意味", "tag|タグで伝える"]}, av: {"k": "code", "lang": "html", "text": "<h1>見出し</h1>\n<button>送信</button>", "ok": [1, 2]}, "problem": "見た目は同じでも、読み上げでは「ただの文字」。見出しやボタンと伝わらない", "idea": "見た目が同じでも、意味は別。意味はタグで伝える。", "answer": "<code>&lt;h1&gt; &lt;nav&gt; &lt;button&gt;</code> など意味のあるタグ", "when": [["押すと動作する", "button"], ["別ページへ移動", "a"], ["見出し", "h1〜h6"], ["意味の無い枠", "div / span"]]},
        render(el, ctx) {
          let v = 'sem', view = 'sr', t = 0;
          const page = a11yPage(); const srBox = h('div', { class: 'xb-sr' }); const cd = h('div'); const holder = h('div');
          function draw() {
            cd.replaceChildren(code(SRCODE[v], 'html', { file: v === 'sem' ? 'セマンティック版' : 'div だけ版', color: v === 'sem' ? 'var(--ok)' : 'var(--bad)' }));
            srBox.replaceChildren(...SR[v].map(([role, txt, warn]) => h('div', null, h('b', role), h('span', txt), warn ? h('i', '⚠ ' + warn) : null)));
            holder.replaceChildren(view === 'sr' ? srBox : page);
          }
          const play = h('button', { class: 'btn primary', onclick: async () => { view = 'sr'; viewSeg.querySelectorAll('.xb-sg').forEach((b) => b.classList.toggle('on', b.dataset.v === 'sr')); draw(); const my = ++t; const rows = [...srBox.children]; for (const r of rows) { if (my !== t) return; rows.forEach((x) => x.classList.toggle('on', x === r)); await sleep(650); } rows.forEach((x) => x.classList.remove('on')); } }, icon('play', { f: 1 }), ' 読み上げ');
          const seg = chips([['div', 'div だけ'], ['sem', 'セマンティック']], 'sem', (x) => { v = x; t++; draw(); }, 'var(--pink)');
          const viewSeg = chips([['vis', '見た目'], ['sr', 'スクリーンリーダー視点']], 'sr', (x) => { view = x; t++; draw(); }, 'var(--ts)');
          ctx.cleanups.push(() => t++);
          el.append(h('div', { class: 'split xb-st' }, h('div', null, seg, cd), h('div', null, viewSeg, h('div', { class: 'grow' }, holder), play)));
          draw();
        },
      },
      {
        t: 'コントラストと色覚', tag: 'CONTRAST', lead: '色を選んで<b>コントラスト比</b>（文字と背景の明るさの差）を測る。通常の文字は 4.5 以上が目安。色の見え方の違いも試そう。',
        why: {pv: {"k": "meter", "items": [{"t": "読みやすさ", "v": 0.2, "c": "bad"}], "cap": "薄いグレーの文字"}, iv: {"k": "flow", "items": ["ruler|数字で測る", "palette|色だけに頼らない"]}, av: {"k": "chips", "items": ["4.5:1 以上", "色 + アイコン + 文言"]}, "problem": "薄いグレーの文字が読めない。赤と緑だけで状態を分けると伝わらない人がいる", "idea": "色だけで伝えない。読みやすさは数字で確かめる。", "answer": "コントラスト比 4.5:1 以上 + 色以外の手がかり（アイコン・文言）", "when": [["通常の文字", "4.5:1 以上"], ["大きい文字", "3:1 以上"], ["状態の表示", "色 + アイコン + 文言"]]},
        render(el) {
          const S = { fg: '#7b86b8', bg: '#ffffff', cb: 'none' };
          const fg = h('input', { type: 'color', value: S.fg, oninput: (e) => { S.fg = e.target.value; upd(); } }), bg = h('input', { type: 'color', value: S.bg, oninput: (e) => { S.bg = e.target.value; upd(); } });
          [fg, bg].forEach((i) => Object.assign(i.style, { width: '56px', height: '38px', border: 0, background: 'none', cursor: 'pointer' }));
          const rt = h('div', { class: 'xa-ratio' }), badges = h('div', { class: 'row' }), sample = h('div', { style: { borderRadius: '8px', padding: '16px', transition: '.3s' } }, h('div', { style: { fontWeight: 900, fontSize: '1.25rem' } }, '春のセール開催中'), h('div', { style: { fontSize: '1rem' } }, 'この文字は読みやすいですか？ 小さな文字ほど差が必要です。'));
          const PR = [['薄いグレー', '#9aa3c7', '#ffffff'], ['良い例', '#1a1e3a', '#ffffff'], ['黄×白', '#e6c200', '#ffffff'], ['白×青', '#ffffff', '#2563eb']];
          const prs = h('div', { class: 'row' }, PR.map(([n, f, b]) => h('button', { class: 'xb-sg', onclick: () => { S.fg = f; S.bg = b; fg.value = f; bg.value = b; upd(); } }, n)));
          const st = h('div', { class: 'xb-sx' }, [['色だけ', false], ['色＋アイコン＋文言', true]].map(([t, rich]) => h('div', { style: { display: 'grid', gap: '6px', background: '#fff', color: '#222', borderRadius: '8px', padding: '10px', fontWeight: 800, fontSize: '.875rem' } }, h('small', { style: { color: '#888' } }, t), h('span', { style: { background: '#2fa84f', color: '#fff', borderRadius: '8px', padding: '.2em .7em' } }, rich ? '✔ 成功' : '成功'), h('span', { style: { background: '#e0455a', color: '#fff', borderRadius: '8px', padding: '.2em .7em' } }, rich ? '✖ 失敗' : '失敗'))));
          const wrapCB = h('div', { style: { display: 'grid', gap: '10px', transition: '.3s' } }, sample, st);
          const defs = h('div', { style: { height: 0, overflow: 'hidden' }, html: '<svg width="0" height="0"><defs><filter id="xa-p"><feColorMatrix type="matrix" values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0"/></filter><filter id="xa-d"><feColorMatrix type="matrix" values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0"/></filter><filter id="xa-t"><feColorMatrix type="matrix" values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0"/></filter></defs></svg>' });
          const cbSeg = chips([['none', '通常'], ['protan', '赤が見えにくい'], ['deutan', '緑が見えにくい'], ['tritan', '青が見えにくい'], ['gray', 'グレースケール']], 'none', (v) => { S.cb = v; upd(); }, 'var(--violet)');
          function upd() {
            const r = ratio(S.fg, S.bg); sample.style.background = S.bg; sample.style.color = S.fg; wrapCB.style.filter = CB[S.cb] || 'none';
            rt.textContent = r.toFixed(2) + ' : 1'; rt.style.color = r >= 4.5 ? 'var(--ok)' : 'var(--bad)';
            badges.replaceChildren(...[['AA 通常文字', 4.5], ['AA 大きい文字', 3], ['AAA', 7]].map(([n, th]) => h('span', { class: 'xa-bd ' + (r >= th ? 'ok' : 'ng') }, r >= th ? '✓ ' : '✖ ', n + ' ≥ ' + th)));
          }
          el.append(defs, h('div', { class: 'split xb-st' }, h('div', null, lbl('文字色 / 背景色'), h('div', { class: 'row' }, fg, '文字', bg, '背景'), prs, rt, badges), h('div', null, lbl('色覚シミュレーター'), cbSeg, h('div', { class: 'grow' }, wrapCB))));
          upd();
        },
      },
      {
        t: 'キーボードだけで操作', tag: 'KEYBOARD', lead: '<kbd>Tab</kbd> で次へ、<kbd>Enter</kbd> で実行。<b>div で作ったボタン</b>には、Tab で止まれない。切り替えて比べよう。',
        why: {pv: {"k": "flow", "items": [{"i": "mouse-off", "t": "マウス無し", "c": "bad"}, {"i": "x", "t": "div は届かない", "c": "bad"}]}, iv: {"k": "flow", "items": ["package-check|標準の部品は", "keyboard|最初から対応済み"]}, av: {"k": "code", "lang": "html", "text": "<button>送信</button>", "ok": [1]}, "problem": "マウスが使えない人は、div で作ったボタンを押せない", "idea": "<code>&lt;button&gt;</code> や <code>&lt;a&gt;</code> は、最初からキーで使える。自作せず、これを使う。", "answer": "button / a を使う。フォーカスが見えること", "when": [["クリックできる要素", "button / a を使う"], ["div を使うしかない", "role・tabindex・キー操作を全部自前（非推奨）"]]},
        render(el) {
          let mode = 'div', idx = -1;
          const mk = () => {
            const bt = mode === 'div' ? h('div', { class: 'ctl', 'data-f': '0', style: { cursor: 'pointer' } }, '送信 (div)') : h('button', { class: 'ctl', 'data-f': '1' }, '送信 (button)');
            return [h('a', { class: 'ctl', href: '#', 'data-f': '1', onclick: (e) => e.preventDefault() }, 'ホーム'), h('input', { class: 'ctl', placeholder: '検索…', 'data-f': '1' }), bt, h('a', { class: 'ctl', href: '#', 'data-f': '1', onclick: (e) => e.preventDefault() }, 'お問い合わせ')];
          };
          const box = h('div', { class: 'xa-kb' }); const ring = h('div', { class: 'xa-ring' }); const log = h('div', { class: 'st-cap', style: { marginTop: '0' } }, '「Tab ⇥」を押して順番に進もう');
          let items = [];
          function build() {
            box.replaceChildren(ring); idx = -1; ring.style.opacity = 0;
            items = mk().map((n, i) => { const w = h('div', { class: 'it' }, h('span', { class: 'no' }, ''), n, h('span', { class: 'bad' }, '✖ Tab が届かない')); box.append(w); return { w, n, f: n.dataset.f === '1' }; });
            let k = 0; items.forEach((x) => { if (x.f) { x.no = ++k; x.w.querySelector('.no').textContent = x.no; } else x.w.classList.add('skip'); });
            log.innerHTML = '「Tab ⇥」を押して順番に進もう';
          }
          function focusAt(i) {
            idx = i; const it = items[i]; const r = it.n.getBoundingClientRect(), b = box.getBoundingClientRect();
            Object.assign(ring.style, { left: r.left - b.left - 5 + 'px', top: r.top - b.top - 5 + 'px', width: r.width + 10 + 'px', height: r.height + 10 + 'px', opacity: 1 });
            it.w.classList.add('vis'); log.innerHTML = `フォーカス：<b>${it.n.textContent}</b>（${it.no} 番目）`;
          }
          const move = (d) => { const fo = items.map((x, i) => (x.f ? i : -1)).filter((i) => i >= 0); const cur = fo.indexOf(idx); let nx = cur + d; if (cur < 0) nx = d > 0 ? 0 : fo.length - 1; nx = (nx + fo.length) % fo.length; focusAt(fo[nx]);
            const skipped = items.findIndex((x, i) => !x.f); if (mode === 'div' && fo[nx] > skipped && nx > 0 && fo[nx - 1] < skipped) { items[skipped].w.classList.add('vis'); log.innerHTML += '<br>⚠ <b>送信 (div)</b> を飛ばした！ キーボード利用者は押せない'; } };
          const enter = () => { if (idx < 0) return; const it = items[idx]; log.innerHTML = it.n.tagName === 'INPUT' ? '入力欄：文字を入力できる' : `<b>${it.n.textContent}</b> を実行 ✓`; };
          const seg = chips([['div', '<div> で作った'], ['button', '<button> で作った']], 'div', (v) => { mode = v; build(); }, 'var(--pink)');
          const keys = h('div', { class: 'row' }, h('button', { class: 'btn', onclick: () => move(-1) }, 'Shift + Tab'), h('button', { class: 'btn primary', style: { '--c': 'var(--pink)' }, onclick: () => move(1) }, 'Tab ⇥'), h('button', { class: 'btn', onclick: enter }, 'Enter ⏎'));
          el.append(h('div', { class: 'split xb-st' }, h('div', null, lbl('作り方を選ぶ'), seg, keys, log, code('<!-- ✖ Tab が届かない -->\n<div class="btn" onclick="send()">送信</div>\n\n<!-- ✔ 標準で Tab・Enter・Space に対応 -->\n<button onclick="send()">送信</button>', 'html', { color: 'var(--pink)', hi: [2, 5] })), h('div', null, lbl('操作してみる'), h('div', { class: 'grow', style: { display: 'flex' } }, box))));
          box.style.flex = '1'; box.style.alignContent = 'center';
          build();
        },
      },
      quizScene('どれが正しい？', 'CHOOSE', '同じ見た目でも<b>伝わり方</b>が違う。正しい書き方を選ぼう。',
        { pv: {"k": "flow", "items": [{"i": "monitor", "t": "見た目だけ整える", "c": "bad"}, {"i": "user-x", "t": "使えない人が出る", "c": "bad"}]}, iv: {"k": "flow", "items": ["tag|意味", "contrast|コントラスト", "keyboard|操作"]}, av: {"k": "chips", "items": ["button / a", "4.5:1", "色 + アイコン"]}, problem: '見た目だけ整えると、使えない人が出る（ボタンに見えるが押せない、など）', idea: '「意味・色の読みやすさ・キー操作」の3つを確かめる。', answer: '意味のあるタグ、4.5:1 以上、色以外の手がかり', when: [['操作できる要素', 'button / a'], ['文字の色', 'コントラスト比を測る'], ['エラー表示', '色 + アイコン + 文言']] },
        [['「送信」ボタンを作る。正しいのは？', ['&lt;div onclick&gt;送信&lt;/div&gt;', '&lt;button&gt;送信&lt;/button&gt;', '&lt;span class="btn"&gt;送信&lt;/span&gt;'], 1, 'button はキーボード・読み上げ・フォーカスを最初から備えている。'],
          ['白背景に薄いグレー (#aaa) の文字を使いたい。どうする？', ['このまま使う', 'コントラスト比を測って 4.5:1 以上にする', '太字にすれば OK'], 1, '#aaa は約 2.3:1 で不足。測れば分かる。'],
          ['入力エラーを赤い枠だけで表示している。改善は？', ['もっと濃い赤にする', 'アイコンと「入力が必要です」の文言を足す', '点滅させる'], 1, '色が見分けにくい人にも伝わるよう、文言とアイコンを併用する。']]),
      {
        t: '実践：アクセシブルに直そう', tag: 'PRACTICE', lead: 'div で作った見出しとボタンを、<b>意味のあるタグ</b>に直そう。画像には説明も付ける。（約5分）',
        hint: '<b>もっとやりたい人へ</b><ul><li>リンクの一覧は <code>&lt;nav&gt;</code> の中に <code>&lt;ul&gt;&lt;li&gt;&lt;a&gt;</code> で書いてみよう。</li><li>文字と背景の色は、コントラスト比 4.5 以上かな？</li></ul>',
        render(el) {
          const H0 = '<header>My Shop</header>\n<nav><a href="#">ホーム</a></nav>\n<main>\n  <div class="title">春のセール</div>          <!-- ① h1 にしよう -->\n  <img src="logo.png">                         <!-- ② alt で画像の説明を付けよう -->\n  <div class="btn" onclick="alert(\'登録\')">登録する</div>   <!-- ③ button にしよう -->\n  <p class="note" style="color:#aaa">5,000円以上で送料無料</p>   <!-- （任意）読みやすい色にしよう -->\n</main>\n';
          const HA1 = H0.replace('<div class="title">春のセール</div>          <!-- ① h1 にしよう -->', '<h1>春のセール</h1>');
          const HA2 = HA1.replace('<img src="logo.png">                         <!-- ② alt で画像の説明を付けよう -->', '<img src="logo.png" alt="My Shop のロゴ（桜の花びらのマーク）">');
          const H1 = '<header>My Shop</header>\n<nav><a href="#">ホーム</a></nav>\n<main>\n  <h1>春のセール</h1>\n  <img src="logo.png" alt="My Shop のロゴ（桜の花びらのマーク）">\n  <button type="button" onclick="alert(\'登録\')">登録する</button>\n  <p class="note" style="color:#555">5,000円以上で送料無料</p>\n</main>\n';
          el.append(playground({
            title: 'a11y', mode: 'web',
            files: [{ name: 'index.html', lang: 'html', code: H0 }],
            solution: H1,
            tasks: (v, c) => {
              const d = c.doc && c.doc(); const q = (s) => (d ? d.querySelectorAll(s).length : 0);
              return [
                { label: '「春のセール」を <code>&lt;h1&gt;</code> にする', ok: q('h1') >= 1, hint: ['「見出し」を表すタグは <code>h1</code>〜<code>h6</code>。いちばん大きい見出しは <code>h1</code>。', '<code>&lt;div class="title"&gt;</code> を <code>&lt;h1&gt;</code> に、閉じタグも <code>&lt;/h1&gt;</code> にする。'], answer: { code: HA1, lang: 'html', mode: 'replace' } },
                { label: '画像に <code>alt</code>（説明の文）を付ける', ok: !!d && [...d.querySelectorAll('img')].some((i) => (i.getAttribute('alt') || '').trim().length > 1), hint: ['画像が見えない人には、<code>alt</code> の文が読み上げられる。', '<code>&lt;img src="logo.png" alt="ここに説明"&gt;</code> のように書く。'], answer: { code: HA2, lang: 'html', mode: 'replace' } },
                { label: '「登録する」を <code>&lt;button&gt;</code> にする', ok: q('button') >= 1 && q('div[onclick]') === 0, hint: ['押すと動くものは <code>button</code>。<code>div</code> のままだと、キーボードで押せない。', '<code>&lt;div class="btn" onclick=…&gt;</code> を <code>&lt;button onclick=…&gt;</code> に。閉じタグも直す。'], answer: { code: H1, lang: 'html', mode: 'replace' } },
                { optional: true, label: '<b>任意：</b>「5,000円以上で送料無料」の文字を、読みやすい色にする（コントラスト比 4.5 以上）', ok: (() => { const n = d && d.querySelector('.note'); if (!n) return false; const c = (getComputedStyle(n).color.match(/\d+/g) || []).slice(0, 3).map(Number); if (c.length < 3) return false; const hex = '#' + c.map((x) => x.toString(16).padStart(2, '0')).join(''); return ratio(hex, '#ffffff') >= 4.5; })(), hint: ['<code>#aaa</code> は白い背景だと薄すぎて読みにくい（比は約 2.3）。もっと濃い灰色にしよう。', '<code>color:#555</code> にすると、比は約 7 になる。'], answer: { code: H1, lang: 'html', mode: 'replace' } },
              ];
            },
          }));
        },
      },
    ],
  });
})();
