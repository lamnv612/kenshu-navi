/* Supplement lessons (補足) — basic track extras: terminal, VS Code, DevTools, BEM, CSS+, a11y */
(function () {
  'use strict';
  const K = window.KENSHU, { h, code, stepper, playground, quiz, lbl, style, sleep, esc, icon, store, celebrate } = K.W;
  const kbd = (t) => h('kbd', t);
  const card = (...k) => h('div', { class: 'card' }, ...k);
  const quizScene = (t, tag, lead, why, Q) => ({
    t, tag, lead, why,
    render(el) { el.append(h('div', { class: 'xb-qz fo4-q' + Q.length }, Q.map(([q, o, a, w]) => card(quiz({ q, options: o, answer: a, why: w }))))); },
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
  .xb-pipe{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:8px;align-items:start}
  .xb-stg{border-radius:8px;border:1px solid var(--line);background:var(--card);padding:8px;min-height:230px;opacity:.28;transform:scale(.95);transition:.5s;display:grid;gap:4px;align-content:start}
  .xb-stg.on{opacity:1;transform:none}.xb-stg.cur{border-color:var(--c);box-shadow:0 12px 26px -14px var(--c);background:color-mix(in srgb,var(--c) 12%,var(--card))}
  .xb-stg h5{font:800 .75rem var(--mono);color:var(--c);padding-bottom:6px;border-bottom:1px dashed var(--line);margin-bottom:2px;word-break:break-all}
  .xb-prd{margin-top:12px;border:1px solid var(--line);border-radius:8px;background:var(--card);overflow:hidden}.xb-prd .h{display:flex;gap:.5em;align-items:center;padding:.5em .9em;font-weight:800;font-size:.875rem;border-bottom:1px solid var(--line);color:var(--mute)}.xb-prd .h .ic{width:16px;height:16px}.xb-prd .r{display:flex;gap:12px;align-items:center;padding:.7em .9em;font-size:.875rem}.xb-prd .r b{font:800 .875rem var(--mono);padding:.15em .6em;border-radius:6px;border:1px solid currentColor}.xb-prd .r.bad{color:var(--bad)}.xb-prd .r.ok{color:var(--ok)}.xb-prd .r span{color:var(--text)}
  .xb-stat{margin:8px 0;padding:.6em .9em;border-radius:8px;font-size:.875rem;font-weight:700;line-height:1.6;border:1px solid var(--line)}.xb-stat.bad{color:var(--bad);border-color:color-mix(in srgb,var(--bad) 50%,var(--line))}.xb-stat.ok{color:var(--ok);border-color:var(--ok)}
  .xb-row{word-break:break-all;font:700 .75rem var(--mono);padding:.15em .6em;border-radius:8px;background:var(--card2);animation:pop .4s both}
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
    meta: { cat: 'basic', day: '1日目', when: 'CUI・Vim の直後、余った5〜10分', mins: 10, order: 10, level: '入門', after: 'cuivim', why: '同じ操作が3倍速くなる。コマンドを“つなげる”発想はプログラミングの基本' },
    scenes: [
      {
        t: '困った：手作業の限界', tag: 'PROBLEM', lead: '「ログに <b>ERROR</b> は何行ある？」目で数える？ コマンドで数える？ <b>レース</b>で比べてみよう。',
        why: {pv: {"k": "code", "file": "app.log", "lang": "txt", "text": "10:00:01 INFO  start\n10:00:02 ERROR timeout\n…（40000 行）\nERROR は何件？ → 目で数える", "err": [3, 4], "keys": {"4": "cmd"}}, iv: {"k": "code", "file": "比べる", "lang": "txt", "text": "手作業: 数時間\n命令  : grep -c ERROR app.log\n結果  : 0.1秒で 128", "idea": [2], "keys": {"2": "cmd"}}, av: {"k": "code", "file": "terminal", "lang": "sh", "text": "$ grep -c ERROR app.log\n128", "ok": [1], "keys": {"1": "cmd"}}, problem: "ログが増えると目で探せない", idea: "何度もやる作業は命令にする", answer: "コマンドで一瞬。grep・パイプ・>", when: [['1回きり・数行', '目で見ても OK'], ['何度もやる・行数が多い', 'コマンドにする'], ['毎日やる', 'スクリプトにして自動化']]},
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
          el.append(h('div', { class: 'split fo4-top' },
            card(lbl('① 目で数える'), log, h('div', { class: 'xb-race' }, cnt, h('span', '行 ERROR'), tm)),
            card(lbl('② コマンドで数える'), cmd, h('div', { class: 'xb-race', style: { marginTop: '14px' } }, res, h('span', '行 ERROR'), tm2))),
            h('div', { style: { marginTop: '12px' } }, btn), scale);
        },
      },
      {
        t: 'キーボード便利技', tag: 'SHORTCUT', lead: 'カードを押すと、ターミナルでキー操作が再生される。',
        why: {pv: {"k": "code", "file": "terminal", "lang": "sh", "text": "$ cd ~/projects/kenshu/src/compo\n$ cd ~/projects/kenshu/src/compo\n# 打ち間違い → 最初から", "err": [1, 2, 3], "keys": {"3": "keys"}}, iv: {"k": "code", "file": "keys", "lang": "txt", "text": "↑      前のコマンド\nTab    名前を補完\nCtrl+R 履歴を検索\nCtrl+A 行頭へ / Ctrl+E 行末へ", "idea": [2], "keys": {"2": "keys"}}, av: {"k": "chips", "items": ["arrow-up|↑ 履歴", "corner-down-right|Tab 補完|keys", "search|Ctrl+R", "move-horizontal|Ctrl+A / E"]}, problem: "長いコマンドを毎回打ち直す", idea: "打たずに、呼ぶ・動く・戻す", answer: "↑ 履歴 / Tab 補完 / Ctrl+R", "when": [["直前のコマンドをもう一度", "↑ か <code>!!</code>"], ["昔打ったコマンドを探す", "Ctrl+R で検索"], ["長いパス名", "Tab 補完"]]},
        render(el, ctx) {
          const term = termBox();
          const cards = h('div', { class: 'xb-cuts' }, SHORTCUTS.map(([k, d, c, fr]) => {
            const b = h('button', { class: 'xb-cut', style: { '--c': c }, onclick: () => { cards.querySelectorAll('.xb-cut').forEach((x) => x.classList.toggle('on', x === b)); term.play(fr); } }, h('b', k), h('small', d));
            return b;
          }));
          ctx.cleanups.push(() => term.stop());
          el.append(h('div', { class: 'split fo4-top' }, cards, term));
          cards.firstChild.click();
        },
      },
      {
        t: 'パイプ ( | )：コマンドをつなぐ', tag: 'PIPE', lead: '障害対応の場面。アクセスログ（8000行）から「<b>どの画面がエラーを一番出しているか</b>」を、パイプだけで出す。「次へ」で、データが絞られていく様子を見よう。',
        why: {pv: {"k": "code", "file": "terminal", "lang": "sh", "text": "$ cat access.log\n/consults 200\n/reserve 500\n…（8000行）\n# どの画面が一番エラー？", "err": [3], "keys": {"3": "pipe"}}, iv: {"k": "code", "file": "パイプ", "lang": "sh", "text": "cat access.log   → 全部出す\n | grep \" 500\"   → エラーだけ\n | sort | uniq -c → 数える\n | sort -rn      → 多い順", "idea": [2, 3, 4], "keys": {"2": "pipe"}}, av: {"k": "code", "file": "terminal", "lang": "sh", "text": "$ grep \" 500\" access.log | cut -d' ' -f2 |\n  sort | uniq -c | sort -rn\n      3 /reserve", "ok": [1, 2], "keys": {"1": "pipe"}}, problem: "本番のエラー（500）が、どの画面で一番多いか知りたい（ログは8000行）", idea: "前の出力が、次の入力になる。小さな道具をつなげば、専用ツールなしで集計できる", answer: "<code>|</code> で小さな命令をつなぐ（grep → cut → sort → uniq -c → sort -rn）", "when": [["結果をさらに加工したい", "| でつなぐ"], ["結果を残したい", "> でファイルへ"], ["1つのコマンドで足りる", "パイプ不要"]]},
        render(el) {
          const DATA = ['/consults 200', '/reserve 500', '/consults 500', '/top 200', '/reserve 500', '/login 404', '/consults 500', '/reserve 500'];
          const E5 = DATA.filter((x) => / 500$/.test(x)), PATHS = E5.map((x) => x.split(' ')[0]);
          const st = [
            ['cat access.log', DATA, '<b>cat</b>：アクセスログを1行ずつ流し込む（本物は8000行。ここでは8行）', 'var(--ts)'],
            ['grep " 500"', E5, '<b>grep " 500"</b>：<b>エラー（500）の行だけ</b>に絞る。8行 → 5行', 'var(--basic)'],
            ['cut -d" " -f1', PATHS, '<b>cut -d" " -f1</b>：スペース区切りの<b>1つ目（URL）</b>だけ取り出す', 'var(--vue)'],
            ['sort', [...PATHS].sort(), '<b>sort</b>：並べ替える。同じ URL が隣り合う', 'var(--team)'],
            ['uniq -c', ['2 /consults', '3 /reserve'], '<b>uniq -c</b>：隣り合う同じ行をまとめて、<b>回数</b>を付ける', 'var(--pink)'],
            ['sort -rn', ['3 /reserve', '2 /consults'], '<b>sort -rn</b>：回数の<b>多い順</b>に。1位は <b>/reserve</b>。原因調査はここから！', 'var(--violet)'],
            ['> worst.txt', null, '<b>&gt;</b>：結果をファイルに保存。報告にそのまま貼れる', 'var(--ts)'],
          ];
          const line = h('div', { class: 'xb-line' });
          const spans = st.map(([c], i) => h('span', c));
          spans.forEach((s, i) => { if (i) line.append(h('em', i === 6 ? '' : '|')); line.append(s); });
          const grid = h('div', { class: 'xb-pipe' }, st.map(([c, rows, , col]) => {
            const g = h('div', { class: 'xb-stg' + (rows ? '' : ' file'), style: { '--c': col } }, h('h5', c));
            if (rows) rows.forEach((r, i) => g.append(h('div', { class: 'xb-row', style: { animationDelay: i * 70 + 'ms' } }, r)));
            else g.append(h('div', { style: { fontSize: '2rem', color: col } }, icon('file-text', { size: '2.2rem' })), h('b', { style: { fontFamily: 'var(--mono)' } }, 'worst.txt'), h('div', { class: 'xb-row' }, '3 /reserve'), h('div', { class: 'xb-row' }, '2 /consults'));
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
        t: 'リダイレクト と grep', tag: '> >> grep', lead: '障害対応中。作業のメモを<b>ファイルに残し</b>、本番ログから<b>原因の行だけ探す</b>。ボタンを押して違いを見よう（小文字の error も拾うには？）。',
        why: {pv: {"k": "code", "file": "terminal", "lang": "sh", "text": "$ ls -l\n（画面に出て、流れて消える）\n$ cat app.log\n（1万行… エラーはどこ？）", "err": [2, 4], "keys": {"4": "redir"}}, iv: {"k": "code", "file": "記号", "lang": "txt", "text": ">   上書きで保存\n>>  追記で保存\n2>  エラーだけ保存\ngrep  条件に合う行だけ", "idea": [1], "keys": {"1": "redir"}}, av: {"k": "code", "file": "terminal", "lang": "sh", "text": "$ ls -l > files.txt\n$ grep -i error app.log\nERROR timeout", "ok": [1, 2], "keys": {"1": "redir"}}, problem: "結果は画面で消え、探せない", idea: "ファイルに送り、絞り込む", answer: "<code>&gt;</code> <code>&gt;&gt;</code> <code>2&gt;</code> と grep", "when": [["前の内容は要らない", "> で上書き"], ["記録を足していく", ">> で追記"], ["エラーだけ残す", "2> error.log"], ["特定の文字を含む行だけ", "grep"]]},
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
            ['echo "12:00 デプロイ開始" > memo.txt', '上書き（作業メモの1行目）', 'var(--ts)', () => { out = ['12:00 デプロイ開始']; return 0; }],
            ['echo "12:30 ロールバック" > memo.txt', '上書き（さっきの行は消える！）', 'var(--pink)', () => { out = ['12:30 ロールバック']; return 0; }],
            ['echo "13:00 原因を調査" >> memo.txt', '末尾に追加（ログ・メモはこれ）', 'var(--basic)', () => { out = [...out, '13:00 原因を調査']; return out.length - 1; }],
            ['ls no_such_dir 2> error.log', 'エラーだけ保存', 'var(--team)', () => { err = ['ls: no_such_dir: No such file or directory']; return 99; }],
          ];
          const rb = h('div', { class: 'col' }, R.map(([c, d, col, fn]) => h('button', { class: 'xb-cut', style: { '--c': col }, onclick: () => { cmd.textContent = '$ ' + c; paint(fn()); } }, h('b', { style: { fontSize: '.75rem' } }, c), h('small', d))));
          const left = card(lbl('リダイレクト'), rb, cmd, h('div', { class: 'xb-file' }, h('h6', icon('file-text'), 'memo.txt'), fo), h('div', { class: 'xb-file', style: { marginTop: '8px' } }, h('h6', icon('file-text'), 'error.log'), fe));

          /* grep */
          const TXT = ['10:01 INFO  予約を受け付けました', '10:02 ERROR 決済に失敗 (code=E402)', '10:03 INFO  ログイン成功', '10:04 WARN  応答が遅い (3200ms)', '10:05 error 通知メールの送信に失敗', '10:06 INFO  相談一覧を表示', '10:07 ERROR タイムアウト (code=E504)'];
          const fl = { i: false, n: false, w: false, v: false };
          let pat = 'ERROR';
          const res = h('div', { class: 'xb-file xb-gr', style: { '--c': 'var(--pink)' } });
          const gcmd = h('div', { class: 'xb-cmd' });
          const input = h('input', { value: pat, style: { font: '700 .9rem var(--mono)', padding: '.4em .8em', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--code)', color: '#d8dcff', width: '100%', outline: 'none' }, oninput: (e) => { pat = e.target.value; run(); } });
          function run() {
            gcmd.textContent = ['grep', ...Object.entries(fl).filter(([, v]) => v).map(([k]) => '-' + k), `"${pat}"`, 'app.log'].join(' ');
            let rx = null;
            try { rx = pat ? new RegExp((fl.w ? '\\b' : '') + pat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + (fl.w ? '\\b' : ''), fl.i ? 'gi' : 'g') : null; } catch { }
            res.replaceChildren(h('h6', icon('file-text'), 'app.log（本番ログ）'));
            const body = h('div');
            TXT.forEach((l, i) => {
              const m = rx ? new RegExp(rx.source, rx.flags.replace('g', '')).test(l) : true;
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
          el.append(h('div', { class: 'split xb-st fo4-top' }, left, right));
          paint(99); run();
        },
      },
      {
        t: 'oh-my-zsh：短縮 alias', tag: 'alias', lead: '長いコマンドは<b>短い名前</b>で呼べる。押して、打つ文字数の差を見よう。',
        why: {pv: {"k": "code", "file": "terminal", "lang": "sh", "text": "$ git status\n$ git status\n$ git checkout main\n$ git status   # 1日に何十回", "err": [1, 2, 4], "keys": {"1": "alias"}}, iv: {"k": "code", "file": "~/.zshrc", "lang": "sh", "text": "# ~/.zshrc\nalias gst='git status'\nalias gco='git checkout'", "idea": [2], "keys": {"2": "alias"}}, av: {"k": "code", "file": "terminal", "lang": "sh", "text": "$ gst        # = git status\n$ gco main   # = git checkout", "ok": [1, 2], "keys": {"1": "alias"}}, problem: "同じ長い命令を毎日何十回も", idea: "短いあだ名を付ける", answer: "alias（oh-my-zsh で100個超）", "when": [["毎日使う長いコマンド", "alias にする"], ["たまにしか使わない", "alias 不要（覚える負担が増える）"], ["引数や分岐が必要", "関数・スクリプトにする"]]},
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
          el.append(h('div', { class: 'split xb-st fo4-top' },
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
              { optional: true, level: 1, label: 'ERROR の行を、<b>行番号つき</b>で画面に出す（例：2:09:01 ERROR …）', ok: ran.some((r) => !r.redirected && rows(r.out).length === ERRS.length && rows(r.out).every((l, i) => /^\d+:/.test(l) && l.replace(/^\d+:/, '') === ERRS[i])), hint: ['<code>grep</code> に「行番号を付ける」オプション <code>-n</code> がある。', '<code>grep -n ERROR app.log</code>'], answer: { code: 'grep -n ERROR app.log', lang: 'sh', file: 'terminal' } },
              { optional: true, level: 2, label: 'エラーの種類（<code>codes.txt</code>）を、多い順に2つ <code>top.txt</code> に保存する', ok: fs['top.txt'] != null && JSON.stringify(rows(fs['top.txt']).map((x) => x.trim())) === JSON.stringify(['3 timeout', '2 auth']), hint: ['数えるには <code>sort</code> のあと <code>uniq -c</code>。多い順は <code>sort -rn</code>。', '<code>sort codes.txt | uniq -c | sort -rn | head -2</code> の最後に <code>&gt; top.txt</code> を付ける。'], answer: { code: 'sort codes.txt | uniq -c | sort -rn | head -2 > top.txt', lang: 'sh', file: 'terminal' } },
              { optional: true, level: 3, label: 'INFO <b>以外</b>の行を <code>notice.txt</code> に保存し、そのあと最後に ERROR の件数（5）を<b>追記</b>する', ok: fs['notice.txt'] != null && JSON.stringify(rows(fs['notice.txt'])) === JSON.stringify([...LOG.split('\n').filter((l) => l && !l.includes('INFO')), '5']), hint: ['<code>grep -v</code> は「一致しない行」を出す。<code>&gt;</code> で保存して、<code>&gt;&gt;</code> で追記する。', '1つ目：<code>grep -v INFO app.log &gt; notice.txt</code>。2つ目は ERROR の数を <code>-c</code> で数えて <code>&gt;&gt; notice.txt</code>。'], answer: { code: 'grep -v INFO app.log > notice.txt\ngrep -c ERROR app.log >> notice.txt', lang: 'sh', file: 'terminal' } },
            ];
            const req = res.filter((t) => !t.optional), opt = res.filter((t) => t.optional);
            const nOk = req.filter((t) => t.ok).length;
            const LV = ['初級', '中級', '上級'];
            const lvChip = (t) => { const n = Math.min(3, Math.max(1, t.level || 1)); return h('span', { class: 'lv lv' + n, title: 'チャレンジ ' + LV[n - 1] }, Array.from({ length: n }, () => icon('star')), LV[n - 1]); };
            const row = (t) => h('div', { class: 'task' + (t.ok ? ' ok' : '') + (t.optional ? ' opt' : '') }, h('i', t.ok ? '✓' : ''), h('span', { class: 'task-l' }, t.optional && opt.length > 1 ? lvChip(t) : null, h('span', { html: t.label })), K.W.hintButton(t, { use: (tt) => { const ls = tt.answer.code.split('\n'); if (ls.length > 1) ls.forEach(go); else { inp.value = tt.answer.code; inp.focus(); } } }));
            tasks.replaceChildren(h('div', { class: 'mission-head' }, icon('list-checks'), h('b', 'ミッション'), h('span', { class: 'mission-n' }, nOk + ' / ' + req.length), h('i', { class: 'mission-bar' }, h('u', { style: { width: (nOk / req.length) * 100 + '%' } }))), ...req.map(row),
              ...(opt.length ? [h('div', { class: 'mission-opt-head' }, h('span', { class: 'opt-badge' }, '任意'), h('b', 'チャレンジ'), h('small', 'もっと挑戦したい人だけ。やらなくても OK')), ...opt.slice().sort((x, y) => (x.level || 1) - (y.level || 1)).map(row)] : []));
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
  .xb-unsaved::before{content:"";display:inline-block;width:.55em;height:.55em;border-radius:50%;background:#ffc94d;margin-right:.5em;vertical-align:.05em}
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

  const hl = K.W.hl;
  /* ================= x-vscode：拡張機能 ================= */
  const XV_EXT = [
    { id: 'esbenp.prettier-vscode', n: 'Prettier - Code formatter', d: '保存すると、コードの見た目を自動でそろえる', w: '最初に入れる', lv: '必須' },
    { id: 'dbaeumer.vscode-eslint', n: 'ESLint', d: '書き間違いやバグになりやすい書き方を、その場で教える', w: 'JS / TS / Vue を書くとき', lv: '必須' },
    { id: 'Vue.volar', n: 'Vue - Official', d: '.vue ファイルの色分けと、テンプレートの型チェック', w: 'Vue を書くとき', lv: '必須' },
    { id: 'eamodio.gitlens', n: 'GitLens', d: 'この行を、いつ・誰が・なぜ変えたかを行の横に出す', w: 'Git を使うとき', lv: 'おすすめ' },
    { id: 'usernamehw.errorlens', n: 'Error Lens', d: 'エラーのメッセージを、その行の横に直接出す', w: 'エラーに気づきたいとき', lv: 'おすすめ' },
    { id: 'yzhang.markdown-all-in-one', n: 'Markdown All in One', d: 'Markdown の目次づくりや書式のショートカット', w: 'README や PR の説明を書くとき', lv: 'おすすめ' },
    { id: 'streetsidesoftware.code-spell-checker', n: 'Code Spell Checker', d: '英単語のスペルミスに波線を出す', w: '変数名・コメントを書くとき', lv: 'おすすめ' },
    { id: 'formulahendry.auto-rename-tag', n: 'Auto Rename Tag', d: '開始タグを直すと、終了タグも一緒に直る', w: 'HTML / Vue を書くとき', lv: '場面別' },
    { id: 'christian-kohler.path-intellisense', n: 'Path Intellisense', d: 'ファイルのパスを、候補から選んで入力できる', w: 'import や src を書くとき', lv: '場面別' },
    { id: 'ritwickdey.LiveServer', n: 'Live Server', d: '保存するたびに、ブラウザを自動で再読み込みする', w: 'HTML / CSS を作るとき', lv: '場面別' },
    { id: 'oderwat.indent-rainbow', n: 'indent-rainbow', d: 'インデントの深さを色で見せる', w: '入れ子が深いコードを読むとき', lv: '場面別' },
    { id: 'PKief.material-icon-theme', n: 'Material Icon Theme', d: 'ファイルの種類ごとにアイコンの絵が変わる', w: 'ファイルを探しやすくしたいとき', lv: '場面別' },
    { id: 'MS-CEINTL.vscode-language-pack-ja', n: 'Japanese Language Pack', d: 'VS Code のメニューを日本語にする', w: '英語のメニューが読みにくいとき', lv: '場面別' },
    { id: 'GitHub.copilot', n: 'GitHub Copilot', d: 'AI がコードの続きを提案する（有料プランあり）', w: '会社のルールで許可されているとき', lv: '場面別' },
  ];
  const xvExt = (id) => XV_EXT.find((e) => e.id === id);

  style('xe', `
  .xe-bar{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}
  .xe-win{border:1px solid var(--line);border-radius:10px;overflow:hidden;background:var(--code);font:.8125rem/1.75 var(--mono);color:#d8dcff}
  .xe-win .tb{display:flex;align-items:center;gap:6px;padding:7px 12px;background:#161b3a;border-bottom:1px solid rgba(255,255,255,.08);font:700 .75rem var(--font);color:#9aa3c7}
  .xe-win .tb i{width:10px;height:10px;border-radius:50%;background:#ff5f57}.xe-win .tb i:nth-child(2){background:#febc2e}.xe-win .tb i:nth-child(3){background:#28c840}.xe-win .tb span{margin-left:6px}
  .xe-win .bd{padding:8px 0;overflow:auto}
  .xe-ln{display:flex;align-items:center;gap:10px;padding:0 12px;white-space:pre;min-height:1.75em;border-left:3px solid transparent;transition:background .2s}
  .xe-ln>b{width:1.8em;flex:none;color:#5a6390;font-weight:400;text-align:right}
  .xe-ln.act{background:rgba(255,255,255,.06);border-left-color:var(--ts);cursor:default}
  .xe-ln.clk{cursor:pointer}.xe-ln.clk:hover{background:rgba(255,255,255,.05)}
  .xe-sw{all:unset;cursor:pointer;display:inline-flex;align-items:center;gap:.6em;padding:.35em .9em .35em .5em;border-radius:999px;border:1px solid var(--line);background:var(--card);font-weight:800;font-size:.8125rem;transition:.2s}
  .xe-sw i{width:34px;height:20px;border-radius:999px;background:var(--line);position:relative;transition:.2s}
  .xe-sw i::after{content:"";position:absolute;top:3px;left:3px;width:14px;height:14px;border-radius:50%;background:#fff;transition:.2s}
  .xe-sw.on{border-color:var(--c,var(--ts))}.xe-sw.on i{background:var(--c,var(--ts))}.xe-sw.on i::after{left:17px}
  .xe-note{margin-top:10px;padding:.7em 1em;border-radius:8px;border:1px solid var(--line);background:var(--card);font-size:.875rem;line-height:1.7}
  .xe-note b{color:var(--c,var(--ts))}.xe-note.bad{border-color:color-mix(in srgb,var(--bad) 55%,var(--line))}.xe-note.ok{border-color:color-mix(in srgb,var(--ok) 55%,var(--line))}
  .xe-split{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px;align-items:start}
  @media(max-width:900px){.xe-split{grid-template-columns:1fr}}
  .xe-ctl{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:10px 0}
  /* extensions panel */
  .xe-ext{border:1px solid var(--line);border-radius:10px;overflow:hidden;background:var(--card)}
  .xe-ext .lst{max-height:420px;overflow:auto}
  .xe-ext .it{display:grid;grid-template-columns:34px minmax(0,1fr) auto;gap:10px;align-items:center;padding:.6em .8em;border-top:1px solid var(--line);cursor:pointer;transition:background .15s}
  .xe-ext .it:first-child{border-top:0}.xe-ext .it:hover,.xe-ext .it.sel{background:var(--card2)}
  .xe-ext .ic{width:34px;height:34px;border-radius:8px;display:grid;place-items:center;background:color-mix(in srgb,var(--violet) 18%,transparent);color:var(--violet)}.xe-ext .ic .ic{width:18px;height:18px;background:none}
  .xe-ext b{display:block;font-size:.875rem}.xe-ext small{display:block;color:var(--mute);font-size:.75rem;line-height:1.5}
  .xe-ext code.id{font:.6875rem var(--mono);color:var(--ts)}
  .xe-ins{all:unset;cursor:pointer;padding:.25em .9em;border-radius:6px;background:var(--ts);color:#06101f;font-weight:800;font-size:.75rem;white-space:nowrap}
  .xe-ins.busy{opacity:.6;pointer-events:none}.xe-ins.done{background:transparent;color:var(--ok);border:1px solid var(--ok);pointer-events:none}
  .xe-q{width:100%;box-sizing:border-box;padding:.55em .8em;border:0;border-bottom:1px solid var(--line);background:var(--card2);color:var(--text);font:inherit;outline:0}
  .xe-det{padding:14px;border:1px solid var(--line);border-radius:10px;background:var(--card);display:grid;gap:10px}
  .xe-steps{display:grid;gap:8px;margin:0;padding:0;list-style:none}.xe-steps li{display:flex;gap:10px;align-items:flex-start;font-size:.875rem}.xe-steps li>b{flex:none;width:22px;height:22px;border-radius:50%;display:grid;place-items:center;background:var(--ts);color:#06101f;font-size:.75rem}
  /* markdown */
  .xe-ta{width:100%;box-sizing:border-box;min-height:300px;resize:vertical;padding:10px 12px;border:1px solid var(--line);border-radius:10px;background:var(--code);color:#d8dcff;font:.8125rem/1.7 var(--mono);outline:0}
  .xe-md{background:#fff;color:#1a1e3a;border-radius:10px;padding:14px 18px;min-height:300px;line-height:1.7;font-size:.9rem;overflow:auto}
  .xe-md h1{font-size:1.4rem;margin:.2em 0 .4em;border-bottom:1px solid #ddd;padding-bottom:.2em}.xe-md h2{font-size:1.15rem;margin:.9em 0 .3em}.xe-md h3{font-size:1rem}
  .xe-md ul{padding-left:1.4em;margin:.3em 0}.xe-md ul.tl{list-style:none;padding-left:.2em}.xe-md code{background:#eef;padding:0 .35em;border-radius:4px;font-family:var(--mono)}
  .xe-md table{border-collapse:collapse;margin:.5em 0}.xe-md th,.xe-md td{border:1px solid #ccd;padding:.25em .8em}.xe-md th{background:#eef}
  .xe-md pre{background:#10142e;color:#d8dcff;padding:.6em .8em;border-radius:6px;overflow:auto}
  .xe-md p{margin:.4em 0}.xe-closed{display:grid;place-items:center;min-height:300px;border:1px dashed var(--line);border-radius:10px;color:var(--mute);text-align:center;padding:14px;line-height:1.8}
  /* brackets */
  .xe-b0{color:#ffd700}.xe-b1{color:#da70d6}.xe-b2{color:#179fff}.xe-b3{color:#6fdc7c}
  .xe-bad{color:#fff;background:var(--bad);border-radius:3px}
  /* error lens / blame */
  .xe-sq{text-decoration:underline wavy var(--bad);text-underline-offset:3px}
  .xe-lens{margin-left:1.2em;padding:0 .7em;border-radius:4px;background:color-mix(in srgb,var(--bad) 22%,transparent);color:#ffb3bc;font-size:.75rem}
  .xe-blame{margin-left:1.4em;color:#6d779f;font:italic .75rem var(--mono)}
  .xe-gut{width:4px;align-self:stretch;flex:none;margin:0 -4px 0 -6px}
  .xe-card{border:1px solid var(--line);border-radius:10px;background:var(--card);padding:12px 14px;display:grid;gap:8px;align-content:start}
  .xe-card h4{display:flex;align-items:center;gap:.5em;font-size:.9375rem}.xe-card h4 .ic{width:18px;height:18px;color:var(--ts)}
  .xe-menu{display:flex;gap:4px;flex-wrap:wrap;padding:.4em;border-radius:8px;background:var(--code);color:#d8dcff;font:.8125rem var(--font)}.xe-menu span{padding:.1em .6em;border-radius:4px}.xe-menu span:hover{background:rgba(255,255,255,.1)}
  .xe-tree{background:var(--code);color:#d8dcff;border-radius:8px;padding:.5em .7em;font:.8125rem/1.9 var(--mono)}.xe-tree div{display:flex;align-items:center;gap:.5em}.xe-tree .ic{width:15px;height:15px}.xe-tree .in{padding-left:1.2em}
  .xe-chk{display:flex;gap:.6em;align-items:flex-start;padding:.3em .2em;font-size:.875rem;cursor:pointer;line-height:1.6}.xe-chk i{flex:none;width:18px;height:18px;border-radius:5px;border:1.5px solid var(--mute);display:grid;place-items:center;margin-top:2px}.xe-chk.on i{background:var(--ok);border-color:var(--ok);color:#06101f}.xe-chk i .ic{width:12px;height:12px;opacity:0}.xe-chk.on i .ic{opacity:1}
  .xe-tbl{width:100%;border-collapse:collapse;font-size:.8125rem}.xe-tbl th,.xe-tbl td{padding:.45em .6em;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}.xe-tbl th{color:var(--mute);font-size:.6875rem;letter-spacing:.06em}.xe-tbl code{font:.6875rem var(--mono);color:var(--ts)}
  .xe-lv{font:800 .625rem var(--font);padding:.1em .6em;border-radius:6px;border:1px solid var(--line);white-space:nowrap}.xe-lv.m{color:var(--bad);border-color:var(--bad)}.xe-lv.r{color:var(--ts);border-color:var(--ts)}.xe-lv.s{color:var(--mute)}
  .xe-brw{border:1px solid var(--line);border-radius:10px;overflow:hidden;background:#fff;color:#1a1e3a}.xe-brw .u{display:flex;align-items:center;gap:6px;padding:6px 10px;background:#eef;font:.6875rem var(--mono);color:#555}.xe-brw .pg{padding:14px 16px;min-height:90px}
  .xe-pop{margin:6px 0 0 3.2em;display:inline-grid;border:1px solid var(--line);border-radius:6px;background:#1b2147;font:.75rem var(--mono)}.xe-pop button{all:unset;cursor:pointer;padding:.25em .8em;color:#d8dcff}.xe-pop button:hover{background:var(--ts);color:#06101f}
  .xe-stat{margin-left:auto;display:inline-flex;align-items:center;gap:.5em;font:700 .6875rem var(--font);padding:.1em .7em;border-radius:6px;background:#2b3a7a;color:#fff;cursor:pointer}.xe-stat.on{background:#2e7d4f}
  `);

  const xvTabs = (items) => {
    const root = h('div'), bar = h('div', { class: 'xe-bar' }), pane = h('div');
    const btns = items.map(([label, build], i) => h('button', { class: 'xb-sg' + (i === 0 ? ' on' : ''), onclick: () => go(i) }, label));
    function go(i) { btns.forEach((b, k) => b.classList.toggle('on', k === i)); pane.replaceChildren(items[i][1]()); }
    bar.append(...btns); root.append(bar, pane); go(0);
    return root;
  };
  const xvWin = (file, ...body) => h('div', { class: 'xe-win' }, h('div', { class: 'tb' }, h('i'), h('i'), h('i'), h('span', file)), h('div', { class: 'bd' }, ...body));
  const xvLn = (n, html, cls) => h('div', { class: 'xe-ln' + (cls ? ' ' + cls : '') }, h('b', String(n)), h('span', { html }));
  const xvSw = (label, on, cb, color) => {
    const b = h('button', { class: 'xe-sw' + (on ? ' on' : ''), role: 'switch', 'aria-checked': String(!!on), onclick: () => { on = !on; b.classList.toggle('on', on); b.setAttribute('aria-checked', String(on)); cb(on); } }, h('i'), h('span', label));
    if (color) b.style.setProperty('--c', color);
    return b;
  };
  const xvNote = (html, cls) => h('div', { class: 'xe-note' + (cls ? ' ' + cls : ''), html });
  const XV_IC = { ts: ['file-code', '#5b9dff'], vue: ['file-code', '#2fd4a4'], json: ['file-json', '#ffd37a'], md: ['file-text', '#9aa3c7'], html: ['file-code', '#ff8f7a'], css: ['palette', '#a98bff'], dir: ['folder', '#ffb454'] };

  /* ---------- Markdown の簡易レンダラ ---------- */
  function xvMdInline(s) {
    return esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" onclick="return false">$1</a>');
  }
  function xvMd(src) {
    const L = src.split('\n'); let out = '', i = 0, ul = '';
    const close = () => { if (ul) { out += '</ul>'; ul = ''; } };
    const SEP = /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$/;
    const cells = (l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
    while (i < L.length) {
      const l = L[i]; let m;
      if ((m = l.match(/^(#{1,3})\s+(.*)$/))) { close(); out += '<h' + m[1].length + '>' + xvMdInline(m[2]) + '</h' + m[1].length + '>'; i++; continue; }
      if ((m = l.match(/^[-*]\s+\[( |x)\]\s+(.*)$/))) { if (ul !== 'tl') { close(); out += '<ul class="tl">'; ul = 'tl'; } out += '<li><input type="checkbox" data-ln="' + i + '"' + (m[1] === 'x' ? ' checked' : '') + '> ' + xvMdInline(m[2]) + '</li>'; i++; continue; }
      if ((m = l.match(/^[-*]\s+(.*)$/))) { if (ul !== 'ul') { close(); out += '<ul>'; ul = 'ul'; } out += '<li>' + xvMdInline(m[1]) + '</li>'; i++; continue; }
      if (/^\|.*\|\s*$/.test(l) && i + 1 < L.length && SEP.test(L[i + 1].trim())) {
        close(); out += '<table><thead><tr>' + cells(l).map((c) => '<th>' + xvMdInline(c) + '</th>').join('') + '</tr></thead><tbody>'; i += 2;
        while (i < L.length && /^\|.*\|\s*$/.test(L[i])) { out += '<tr>' + cells(L[i]).map((c) => '<td>' + xvMdInline(c) + '</td>').join('') + '</tr>'; i++; }
        out += '</tbody></table>'; continue;
      }
      if (/^```/.test(l)) { close(); const b = []; i++; while (i < L.length && !/^```/.test(L[i])) { b.push(L[i]); i++; } i++; out += '<pre>' + esc(b.join('\n')) + '</pre>'; continue; }
      if (!l.trim()) { close(); i++; continue; }
      close(); out += '<p>' + xvMdInline(l) + '</p>'; i++;
    }
    close(); return out;
  }

  /* ---------- 括弧の色分け ---------- */
  function xvBrackets(src, on) {
    const info = new Array(src.length).fill(null), st = [];
    for (let i = 0; i < src.length; i++) {
      const c = src[i];
      if ('([{'.includes(c)) { st.push(i); info[i] = { d: st.length - 1 }; }
      else if (')]}'.includes(c)) { const j = st[st.length - 1]; if (j != null && '([{'.indexOf(src[j]) === ')]}'.indexOf(c)) { st.pop(); info[i] = info[j]; } else info[i] = { bad: true }; }
    }
    st.forEach((j) => { info[j] = { bad: true }; });
    let bad = 0, html = '';
    for (let i = 0; i < src.length; i++) {
      const c = src[i], x = info[i];
      if (!x) html += esc(c);
      else if (x.bad) { bad++; html += on ? '<span class="xe-bad">' + esc(c) + '</span>' : esc(c); }
      else html += on ? '<span class="xe-b' + (x.d % 4) + '">' + esc(c) + '</span>' : esc(c);
    }
    return { html, bad };
  }

  const XV_NEW = [
    /* ---------------- 1. 拡張機能を入れよう ---------------- */
    {
      t: '拡張機能を入れよう', tag: 'Extensions', lead: 'VS Code は<b>あとから道具を足せる</b>。<kbd>⌘</kbd><kbd>⇧</kbd><kbd>X</kbd>（Windows は <kbd>Ctrl</kbd><kbd>⇧</kbd><kbd>X</kbd>）で、拡張機能の画面が開く。探して <b>Install</b> を押すだけ。',
      why: { pv: { k: 'code', file: 'VS Code（標準のまま）', lang: 'text', text: '括弧がどれと対か分からない\nエラーは波線だけ\n誰が変えた行か分からない', err: [1, 2, 3] }, iv: { k: 'flow', items: ['search|⌘⇧X で開く', 'puzzle|名前で探す', 'download|Install'] }, av: { k: 'code', file: 'terminal', lang: 'sh', text: 'code --install-extension esbenp.prettier-vscode', ok: [1] }, problem: 'VS Code だけでは足りない。便利な道具の探し方・入れ方が分からない', idea: '拡張機能の画面で探して Install。ターミナルのコマンドでも入れられる', answer: '⌘⇧X → 検索 → Install（または code --install-extension）' },
      render(el) {
        const inst = Object.assign({}, store.get('xv.inst', {}));
        let sel = XV_EXT[0].id;
        const q = h('input', { class: 'xe-q', placeholder: '拡張機能を検索（例：prettier）', 'aria-label': '拡張機能を検索', spellcheck: 'false' });
        const list = h('div', { class: 'lst' }), det = h('div', { class: 'xe-det' }), cnt = h('div', { style: { color: 'var(--mute)', fontSize: '.8125rem', margin: '8px 2px 0' } });
        function drawDet() {
          const e = xvExt(sel);
          det.replaceChildren(
            h('div', null, h('b', { style: { fontSize: '1rem' } }, e.n), h('div', { style: { color: 'var(--mute)', fontSize: '.8125rem', marginTop: '2px' } }, e.d)),
            lbl('ターミナルで入れるとき'),
            code('code --install-extension ' + e.id, 'sh', { color: 'var(--ts)' }),
            h('div', { style: { fontSize: '.8125rem', color: 'var(--mute)' } }, 'いつ使う：' + e.w));
        }
        function draw() {
          const k = q.value.trim().toLowerCase();
          const rows = XV_EXT.filter((e) => !k || (e.n + e.id + e.d).toLowerCase().includes(k));
          list.replaceChildren(...(rows.length ? rows.map((e) => {
            const b = h('button', { class: 'xe-ins' + (inst[e.id] ? ' done' : ''), onclick: (ev) => {
              ev.stopPropagation(); b.classList.add('busy'); b.textContent = 'インストール中…';
              setTimeout(() => { inst[e.id] = 1; store.set('xv.inst', inst); draw(); }, 650);
            } }, inst[e.id] ? 'インストール済み' : 'Install');
            return h('div', { class: 'it' + (sel === e.id ? ' sel' : ''), onclick: () => { sel = e.id; draw(); drawDet(); } },
              h('div', { class: 'ic' }, icon('puzzle')), h('div', null, h('b', e.n), h('small', e.d), h('code', { class: 'id' }, e.id)), b);
          }) : [h('div', { style: { padding: '14px', color: 'var(--mute)' } }, '見つかりません。名前を変えて探してみよう。')]));
          cnt.textContent = 'インストール済み ' + Object.keys(inst).length + ' / ' + XV_EXT.length;
        }
        q.addEventListener('input', draw);
        el.append(h('div', { class: 'xe-split' },
          h('div', null, lbl('拡張機能（⌘⇧X で開く画面）'), h('div', { class: 'xe-ext' }, q, list), cnt),
          h('div', null, lbl('入れ方は 3 ステップ'),
            h('ul', { class: 'xe-steps', style: { marginBottom: '12px' } },
              h('li', null, h('b', '1'), h('span', { html: '<kbd>⌘</kbd><kbd>⇧</kbd><kbd>X</kbd> で拡張機能の画面を開く' })),
              h('li', null, h('b', '2'), h('span', '上の検索欄に、名前を入れて探す')),
              h('li', null, h('b', '3'), h('span', { html: '<b>Install</b> を押す。再起動は、たいてい要らない' }))),
            det)));
        draw(); drawDet();
      },
    },
    /* ---------------- 2. Markdown プレビュー ---------------- */
    {
      t: 'Markdown プレビュー', tag: 'Markdown', lead: 'README や PR の説明は <b>Markdown</b> で書く。<kbd>⌘</kbd><kbd>⇧</kbd><kbd>V</kbd> で<b>仕上がりをその場で見られる</b>（標準機能）。表が崩れているのも、出す前に気づける。',
      why: { pv: { k: 'code', file: 'README.md', lang: 'text', text: '| プラン | 料金 |\n| 初回 | 0円 |\n| 通常 | 5,500円 |', err: [1, 2, 3] }, iv: { k: 'flow', items: ['file-text|書く', 'eye|⌘⇧V で見る', 'check|直す'] }, av: { k: 'code', file: 'README.md', lang: 'text', text: '| プラン | 料金 |\n|---|---|\n| 初回 | 0円 |', ok: [1, 2, 3] }, problem: '書いただけでは、表や箇条書きが崩れているか分からない（PR に出してから気づく）', idea: '書きながら横でプレビューを見る。Markdown All in One で目次や書式も楽に', answer: '⌘⇧V でプレビュー ＋ Markdown All in One' },
      render(el) {
        let src = '# 相談予約アプリ\n\n初回 30分は **無料**。詳しくは [料金](https://example.com) を見てください。\n\n## 使い方\n- 日時を選ぶ\n- 内容を書く\n- [ ] 確認メールを見る\n\n## 料金\n| プラン | 時間 | 料金 |\n| 初回 | 30分 | 0円 |\n| 通常 | 30分 | 5,500円 |\n';
        let open = false;
        const ta = h('textarea', { class: 'xe-ta', spellcheck: 'false', 'aria-label': 'Markdown' });
        ta.value = src;
        const pv = h('div');
        const hint = h('div', { class: 'xe-note', html: '' });
        function draw() {
          src = ta.value;
          pv.replaceChildren(open ? h('div', { class: 'xe-md', html: xvMd(src) }) : h('div', { class: 'xe-closed' }, h('div', { html: 'プレビューは閉じています。<br>上の <b>プレビューを開く</b>（<kbd>⌘</kbd><kbd>⇧</kbd><kbd>V</kbd>）を押そう。' })));
          const broken = /\n\|[^\n]*\|\s*\n\|[^\n]*\|/.test(src) && !/\n\|?\s*:?-{3,}/.test(src);
          hint.className = 'xe-note' + (open ? (broken ? ' bad' : ' ok') : '');
          hint.innerHTML = !open ? '<b>書いているだけ</b>では、仕上がりが分からない。' : broken ? '<b>表が表になっていない</b>（| が並んで見える）。見出しの下に <code class="i">|---|---|---|</code> の行が要る。下の「直す」を押してみよう。' : '表も、リストも、チェックボックスも、見たとおりに出来上がった。';
        }
        ta.addEventListener('input', draw);
        pv.addEventListener('change', (e) => { const c = e.target; if (c.dataset && c.dataset.ln != null) { const L = ta.value.split('\n'); const n = +c.dataset.ln; L[n] = L[n].replace(/\[( |x)\]/, c.checked ? '[x]' : '[ ]'); ta.value = L.join('\n'); draw(); } });
        const fix = () => { const L = ta.value.split('\n'); for (let i = 0; i < L.length - 1; i++) { if (/^\|.*\|\s*$/.test(L[i]) && /^\|.*\|\s*$/.test(L[i + 1]) && !/^\|?\s*:?-{3,}/.test(L[i + 1].trim()) && !/^\|?\s*:?-{3,}/.test(L[i].trim())) { const n = L[i].split('|').length - 2; L.splice(i + 1, 0, '|' + Array(n).fill('---').join('|') + '|'); break; } } ta.value = L.join('\n'); draw(); };
        const toc = () => { const hs = ta.value.split('\n').filter((l) => /^##\s+/.test(l)).map((l) => '- ' + l.replace(/^##\s+/, '')); const L = ta.value.split('\n'); const at = L.findIndex((l) => /^##\s+/.test(l)); if (!hs.length || ta.value.includes('## 目次')) return; L.splice(at < 0 ? 1 : at, 0, '## 目次', ...hs, ''); ta.value = L.join('\n'); draw(); };
        el.append(h('div', { class: 'xe-ctl' },
          xvSw('プレビューを開く（⌘⇧V）', false, (on) => { open = on; draw(); }),
          h('button', { class: 'btn', onclick: fix }, icon('table-2'), 'ヘッダーの下に区切り行を足す'),
          h('button', { class: 'btn', onclick: toc }, icon('list-tree'), '目次を作る（Markdown All in One）')),
          h('div', { class: 'xe-split' }, h('div', null, lbl('README.md（編集できる）'), ta), h('div', null, lbl('プレビュー'), pv)), hint);
        draw();
      },
    },
    /* ---------------- 3. 括弧の色分け ---------------- */
    {
      t: '括弧の色分け：Rainbow', tag: 'Bracket', lead: '括弧が深く入れ子になると、<b>どれとどれが対か</b>分からなくなる。VS Code は括弧を<b>色分け</b>できる（標準機能）。閉じ忘れは<b>赤</b>で教えてくれる。',
      why: { pv: { k: 'code', file: 'price.ts', lang: 'ts', text: 'const sum = items.map((i) => (\n  i.qty * (i.price + tax(i.price))\n)\nconsole.log(sum)', err: [1, 2, 3] }, iv: { k: 'code', file: 'settings.json', lang: 'json', text: '{\n  "editor.bracketPairColorization.enabled": true\n}', idea: [2] }, av: { k: 'flow', items: ['brackets|対の括弧が同じ色', 'triangle-alert|閉じ忘れは赤'] }, problem: '括弧を1つ閉じ忘れただけなのに、エラーは何行も下に出る。どこが原因か探すのに時間がかかる', idea: '括弧を深さごとに色分けすると、対の相手がひと目で分かる', answer: 'editor.bracketPairColorization.enabled を true（標準で ON）' },
      render(el) {
        const GOOD = 'function calcTotal(items, tax) {\n  return items\n    .filter((i) => (i.qty > 0 && (i.price > 0)))\n    .map((i) => ({ name: i.name, sum: i.qty * (i.price + tax(i.price)) }))\n    .reduce((a, b) => a + b.sum, 0)\n}';
        const BAD = GOOD.replace('(i.price > 0)))', '(i.price > 0))');
        let on = true, broken = false;
        const box = h('div'), note = h('div');
        function draw() {
          const src = broken ? BAD : GOOD, r = xvBrackets(src, on);
          box.replaceChildren(xvWin('price.ts', ...r.html.split('\n').map((l, i) => xvLn(i + 1, l))));
          note.className = 'xe-note' + (r.bad ? ' bad' : ' ok');
          note.innerHTML = !broken ? (on ? '対の括弧が<b>同じ色</b>。入れ子の深さが色で分かる。' : '色が無いと、どの <code class="i">(</code> と <code class="i">)</code> が対か、目で追うしかない。')
            : on ? '<b>赤くなった括弧</b>が、対応する相手のいない括弧。ここから探せばいい。' : '色分けが OFF だと、閉じ忘れに気づけない。<b>実行してエラーが出る</b>まで分からない。';
        }
        el.append(h('div', { class: 'xe-ctl' },
          xvSw('括弧の色分け（bracketPairColorization）', true, (v) => { on = v; draw(); }, 'var(--pink)'),
          xvSw('閉じ括弧を1つ消す（うっかりミス）', false, (v) => { broken = v; draw(); }, 'var(--bad)')),
          box, note,
          h('div', { style: { marginTop: '12px' } }, lbl('設定（settings.json）'), code('{\n  "editor.bracketPairColorization.enabled": true,\n  "editor.guides.bracketPairs": true\n}', 'json', { color: 'var(--pink)' })),
          xvNote('古い VS Code では、拡張機能の <b>Rainbow Brackets</b> を入れていた。いまは標準機能で足りる。インデントの深さを色で見たいときは <b>indent-rainbow</b>（<code class="i">oderwat.indent-rainbow</code>）。'));
        draw();
      },
    },
    /* ---------------- 4. Error Lens と GitLens ---------------- */
    {
      t: 'エラーと履歴を見える化', tag: 'Error Lens · GitLens', lead: '<b>Error Lens</b> はエラーの文を<b>その行の横</b>に出す。<b>GitLens</b> は「この行を、誰が・いつ・なぜ変えたか」を出す。どちらも、調べる手間をなくす道具。',
      why: { pv: { k: 'code', file: 'main.ts', lang: 'ts', text: 'const total = fee * count\nconsole.log(totl)\n// 波線だけ。理由は？ 誰が書いた？', err: [2, 3] }, iv: { k: 'flow', items: ['triangle-alert|Error Lens：理由が行の横に', 'history|GitLens：誰がいつなぜ'] }, av: { k: 'chips', items: ['usernamehw.errorlens', 'eamodio.gitlens'] }, problem: '波線は出ても理由が見えない。壊れた行を誰がなぜ変えたかも、調べないと分からない', idea: '調べる前に、行の横に答えを出しておく', answer: 'Error Lens ＋ GitLens' },
      render(el) {
        const lensTab = () => {
          const rows = [['const fee = 3300', null], ['const count: number = <u class="xe-sq">"2"</u>', 'Type \'string\' is not assignable to type \'number\'.'], ['const total = fee * count', null], ['console.log(<u class="xe-sq">totl</u>)', 'Cannot find name \'totl\'. Did you mean \'total\'?']];
          let on = false; const box = h('div'), note = h('div');
          const draw = () => {
            box.replaceChildren(xvWin('main.ts', ...rows.map(([c, m], i) => { const r = xvLn(i + 1, c.replace(/<u class="xe-sq">/g, '<span class="xe-sq">').replace(/<\/u>/g, '</span>')); if (m && on) r.append(h('span', { class: 'xe-lens' }, m)); return r; })));
            note.className = 'xe-note' + (on ? ' ok' : '');
            note.innerHTML = on ? 'エラーの<b>理由が、その行の横に</b>出ている。マウスを乗せる必要はない。' : '波線だけ。理由を見るには<b>マウスを乗せる</b>か、下の「問題」パネルを開く（行ごとに繰り返し）。';
          };
          draw();
          return h('div', null, h('div', { class: 'xe-ctl' }, xvSw('Error Lens（usernamehw.errorlens）', false, (v) => { on = v; draw(); }, 'var(--bad)')), box, note);
        };
        const gitTab = () => {
          const rows = [['export const TAX = 0.1', '田中', '3か月前', 'feat: 料金計算を追加', 'a1b2c3d'], ['export function calcTotal(fee, n) {', '田中', '3か月前', 'feat: 料金計算を追加', 'a1b2c3d'], ['  return Math.round(fee * n * (1 + TAX))', '佐藤', '2日前', 'fix: 端数を四捨五入にする（請求が1円ずれた）', 'e4f5a6b'], ['}', '田中', '3か月前', 'feat: 料金計算を追加', 'a1b2c3d']];
          let cur = 2; const box = h('div'), card = h('div', { class: 'xe-card' });
          const col = { 田中: '#5b9dff', 佐藤: '#ff6b9d' };
          const draw = () => {
            box.replaceChildren(xvWin('src/price.ts', ...rows.map(([c, a, t, m], i) => { const r = xvLn(i + 1, esc(c), 'clk' + (i === cur ? ' act' : '')); r.prepend(h('i', { class: 'xe-gut', style: { background: col[a] } })); if (i === cur) r.append(h('span', { class: 'xe-blame' }, a + '、' + t + ' • ' + m)); r.onclick = () => { cur = i; draw(); }; return r; })));
            const [, a, t, m, hs] = rows[cur];
            card.replaceChildren(h('h4', null, icon('git-commit-horizontal'), hs + '　' + a + '（' + t + '）'), h('div', null, m), h('div', { style: { color: 'var(--mute)', fontSize: '.8125rem' } }, '同じことを、ターミナルでは ', h('code', { class: 'i' }, 'git blame -L ' + (cur + 1) + ',' + (cur + 1) + ' src/price.ts'), ' で調べる。'), h('a', { class: 'btn', href: '#/lesson/x-git-scenarios/4' }, icon('history'), '「履歴を調べる」のシーンへ'));
          };
          draw();
          return h('div', null, h('div', { style: { color: 'var(--mute)', fontSize: '.875rem', marginBottom: '8px' } }, '行をクリックすると、その行の持ち主が横に出る（GitLens の inline blame）。'), box, card);
        };
        el.append(xvTabs([['Error Lens：エラーを行の横に', lensTab], ['GitLens：誰がいつ変えた？', gitTab]]));
      },
    },
    /* ---------------- 5. 小さな事故を減らす拡張 ---------------- */
    {
      t: '小さな事故を減らす拡張', tag: 'Live Server など', lead: '<b>タグの閉じ忘れ・パスの打ち間違い・スペルミス・再読み込みし忘れ</b>。地味だけど毎日起きる事故を、4つの拡張機能が先回りして防ぐ。',
      why: { pv: { k: 'code', file: 'Card.vue', lang: 'html', text: '<section class="card">\n  <h2>相談する</h2>\n</div>', err: [3] }, iv: { k: 'flow', items: ['wifi|Live Server', 'code|Auto Rename Tag', 'folder|Path Intellisense', 'spell-check|Code Spell Checker'] }, av: { k: 'chips', items: ['ritwickdey.LiveServer', 'formulahendry.auto-rename-tag', 'christian-kohler.path-intellisense', 'streetsidesoftware.code-spell-checker'] }, problem: '閉じタグがずれる、パスを間違える、スペルを間違える、保存したのにブラウザが古いまま', idea: '人が気をつけるより、道具に先回りしてもらう', answer: '4つの小さな拡張機能で、毎日の小さな事故を減らす' },
      render(el) {
        const live = () => {
          let went = false, saved = 'こんにちは', draft = 'こんにちは', shown = 'こんにちは', busy = false;
          const ed = h('div'), pg = h('div', { class: 'pg' }), url = h('span'), msg = h('div');
          const drawEd = () => ed.replaceChildren(xvWin('index.html' + (draft !== saved ? '  ●' : ''), xvLn(1, '&lt;h1&gt;' + esc(draft) + '&lt;/h1&gt;'), xvLn(2, '&lt;p&gt;初回 30分は無料です&lt;/p&gt;')));
          const drawBr = () => { url.textContent = went ? '127.0.0.1:5500' : 'file:///index.html'; pg.replaceChildren(h('h3', { style: { margin: 0 } }, shown), h('p', { style: { margin: '.4em 0 0', color: '#555', fontSize: '.85rem' } }, '初回 30分は無料です')); };
          const say = (t, c) => { msg.className = 'xe-note' + (c ? ' ' + c : ''); msg.innerHTML = t; };
          const save = async () => {
            if (busy) return; busy = true; saved = draft; drawEd();
            if (went) { await sleep(600); shown = saved; drawBr(); pg.animate([{ background: '#dff7e6' }, { background: '#fff' }], { duration: 900 }); say('保存した<b>だけ</b>で、ブラウザが<b>自動で更新</b>された。', 'ok'); }
            else say('保存したのに、ブラウザは<b>古いまま</b>。「手動で更新（F5）」を押さないと変わらない。', 'bad');
            busy = false;
          };
          const toggle = () => { draft = draft === 'こんにちは' ? '相談を予約する' : 'こんにちは'; drawEd(); };
          const stat = h('span', { class: 'xe-stat', onclick: () => { went = !went; stat.classList.toggle('on', went); stat.textContent = went ? 'Port: 5500（停止する）' : 'Go Live'; drawBr(); } }, 'Go Live');
          drawEd(); drawBr(); say('まず右下の <b>Go Live</b> を押して、サーバーを起動しよう。');
          return h('div', null, h('div', { class: 'xe-split' }, h('div', null, lbl('エディタ'), ed, h('div', { style: { marginTop: '6px', textAlign: 'right' } }, stat)), h('div', null, lbl('ブラウザ'), h('div', { class: 'xe-brw' }, h('div', { class: 'u' }, url), pg))),
            h('div', { class: 'xe-ctl' }, h('button', { class: 'btn', onclick: toggle }, icon('pencil-line'), 'タイトルを書き換える'), h('button', { class: 'btn primary', onclick: save }, icon('save'), kbd('⌘'), kbd('S'), ' 保存'), h('button', { class: 'btn ghost', onclick: () => { shown = saved; drawBr(); say('手で更新した。毎回これをやるのは面倒。'); } }, icon('refresh-cw'), '手動で更新（F5）')), msg);
        };
        const rename = () => {
          let on = true, tag = 'section'; const box = h('div'), note = h('div');
          const draw = () => {
            const close = on ? tag : 'div', bad = close !== tag;
            box.replaceChildren(xvWin('Card.vue', xvLn(1, '&lt;' + tag + ' class="card"&gt;'), xvLn(2, '  &lt;h2&gt;相談する&lt;/h2&gt;'), xvLn(3, '&lt;/' + close + '&gt;', bad ? 'act' : '')));
            note.className = 'xe-note' + (bad ? ' bad' : ' ok');
            note.innerHTML = bad ? '開始は <code class="i">' + tag + '</code>、終了は <code class="i">div</code>。<b>タグが合っていない</b>ので、画面が崩れる。' : '開始タグを直すと、<b>終了タグも一緒に</b>直った。';
          };
          draw();
          return h('div', null, h('div', { class: 'xe-ctl' }, xvSw('Auto Rename Tag', true, (v) => { on = v; draw(); }), h('span', { style: { color: 'var(--mute)', fontSize: '.8125rem' } }, '開始タグを変えてみよう →'), ...['div', 'section', 'article'].map((t) => h('button', { class: 'btn', onclick: () => { tag = t; draw(); } }, '<' + t + '>'))), box, note);
        };
        const path = () => {
          let on = true, typo = true; const box = h('div'), note = h('div');
          const FILES = ['price.ts', 'format.ts', 'tax.ts'];
          const draw = () => {
            const p = './utils/' + (typo ? 'prise' : 'price');
            const row = xvLn(1, 'import { calcTotal } from <span class="' + (typo ? 'xe-sq' : '') + '">"' + p + '"</span>');
            const win = xvWin('Cart.vue', row);
            if (on && typo) win.querySelector('.bd').append(h('div', { class: 'xe-pop' }, ...FILES.map((f) => h('button', { onclick: () => { typo = f !== 'price.ts'; draw(); } }, f))));
            box.replaceChildren(win);
            note.className = 'xe-note' + (typo ? ' bad' : ' ok');
            note.innerHTML = typo ? (on ? '<code class="i">./utils/</code> の中の<b>ファイルが候補で出る</b>。打つ代わりに選べば、打ち間違いは起きない。' : '<code class="i">prise</code> は打ち間違い。<b>実行して初めて</b> Cannot find module のエラーが出る。') : '候補から選んだので、パスは<b>正しい</b>。';
          };
          draw();
          return h('div', null, h('div', { class: 'xe-ctl' }, xvSw('Path Intellisense', true, (v) => { on = v; draw(); }), h('button', { class: 'btn ghost', onclick: () => { typo = true; draw(); } }, icon('rotate-ccw'), 'もどす')), box, note);
        };
        const spell = () => {
          const T = [['// customer recieve the mail', 'recieve', 'receive'], ['const adress = user.adress', 'adress', 'address']];
          let on = true; const fixed = {}; const box = h('div'), note = h('div'); let pop = null;
          const draw = () => {
            box.replaceChildren(xvWin('mail.ts', ...T.map(([line, w, ok], i) => {
              const done = fixed[i]; const html = esc(line).split(w).join(done ? ok : '<span class="' + (on ? 'xe-sq' : '') + '" data-w="' + i + '" style="' + (on ? 'text-decoration-color:#5b9dff;cursor:pointer' : '') + '">' + w + '</span>');
              const r = xvLn(i + 1, html); if (pop === i && on && !done) r.append(h('span', { class: 'xe-pop', style: { margin: '0 0 0 1em' } }, h('button', { onclick: () => { fixed[i] = 1; pop = null; draw(); } }, 'Fix: ' + ok)));
              r.addEventListener('click', (e) => { if (e.target.dataset && e.target.dataset.w != null) { pop = +e.target.dataset.w; draw(); } });
              return r;
            })));
            const left = T.length - Object.keys(fixed).length;
            note.className = 'xe-note' + (left ? '' : ' ok');
            note.innerHTML = !on ? 'OFF だと、スペルミスの変数名（adress）が<b>そのまま全体に広がる</b>。直すときは全部探して直すことになる。' : left ? '波線の単語をクリックすると、<b>正しいスペルの候補</b>が出る（残り ' + left + ' か所）。' : '2か所とも直った。変数名のミスは、<b>書いた瞬間</b>に直すのがいちばん安い。';
          };
          draw();
          return h('div', null, h('div', { class: 'xe-ctl' }, xvSw('Code Spell Checker', true, (v) => { on = v; draw(); }, 'var(--ts)')), box, note);
        };
        el.append(xvTabs([['Live Server：自動で再読み込み', live], ['Auto Rename Tag：タグが一緒に直る', rename], ['Path Intellisense：パスを選ぶ', path], ['Code Spell Checker：スペルミス', spell]]));
      },
    },
    /* ---------------- 6. Vue・TypeScript・ESLint ---------------- */
    {
      t: 'Vue・TypeScript・ESLint', tag: 'Vue Official · ESLint', lead: 'Vue を書くなら <b>Vue - Official</b>（旧 Volar）が必須。テンプレートの中まで<b>色と型が効く</b>。<b>ESLint</b> は保存で自動修正までしてくれる。',
      why: { pv: { k: 'code', file: 'CaseCard.vue', lang: 'html', text: '<template>\n  <p>{{ item.prise }}</p>\n</template>', err: [2] }, iv: { k: 'flow', items: ['puzzle|Vue - Official', 'shield-alert|ESLint'] }, av: { k: 'code', file: 'settings.json', lang: 'json', text: '{\n  "editor.codeActionsOnSave": {\n    "source.fixAll.eslint": "explicit"\n  }\n}', ok: [2, 3, 4] }, problem: 'テンプレートの打ち間違い（prise）は、画面が空になるまで気づけない。書き方のルール違反も毎回手で直している', idea: '型の知識を持った拡張機能に、書いている最中に見張ってもらう', answer: 'Vue - Official ＋ ESLint（保存で自動修正）' },
      render(el) {
        const vueTab = () => {
          const src = '<script setup lang="ts">\nconst item = { title: \'離婚の相談\', price: 5500 }\n</script>\n\n<template>\n  <h3>{{ item.title }}</h3>\n  <p>{{ item.prise }} 円</p>\n</template>';
          let on = true, fixed = false; const box = h('div'), note = h('div');
          const draw = () => {
            const s = fixed ? src.replace('prise', 'price') : src; const lines = s.split('\n');
            box.replaceChildren(xvWin('CaseCard.vue', ...lines.map((l, i) => {
              let html = on ? hl(l, i < 3 ? 'ts' : 'html') : esc(l);
              if (on && /prise/.test(l)) html = html.replace(/prise/, '<span class="xe-sq">prise</span>');
              const r = xvLn(i + 1, html);
              if (on && /prise/.test(l)) r.append(h('span', { class: 'xe-lens' }, "Property 'prise' does not exist. Did you mean 'price'?"));
              return r;
            })));
            note.className = 'xe-note' + (on && !fixed ? ' bad' : fixed ? ' ok' : '');
            note.innerHTML = !on ? '拡張機能が無いと、<b>色も付かず</b>、テンプレートの中の打ち間違いにも気づけない。画面が<b>空になってから</b>探すことになる。' : fixed ? 'テンプレートの中でも、<b>型の候補が出て</b>、打ち間違いが直った。' : 'テンプレートの中の <code class="i">item.prise</code> を、<b>書いた瞬間</b>に見つけてくれる。';
          };
          draw();
          return h('div', null, h('div', { class: 'xe-ctl' }, xvSw('Vue - Official（Vue.volar）', true, (v) => { on = v; draw(); }, 'var(--vue)'), h('button', { class: 'btn', onclick: () => { fixed = true; draw(); } }, icon('check'), 'prise → price に直す'), h('button', { class: 'btn ghost', onclick: () => { fixed = false; draw(); } }, icon('rotate-ccw'), 'もどす')), box, note);
        };
        const lintTab = () => {
          const BEFORE = ['var fee = 3300', 'if (fee == 0) {', '  console.log("無料")', '}', 'const unused = 1'];
          let auto = false, saved = false; const box = h('div'), note = h('div');
          const AFTER = ['const fee = 3300', 'if (fee === 0) {', '  console.log("無料")', '}', 'const unused = 1'];
          const MSG = [['no-var / prefer-const', 'var は const に（自動修正できる）'], ['eqeqeq', '== は === に（自動修正できる）'], null, null, ['no-unused-vars', '使っていない変数（自分で消す）']];
          const draw = () => {
            const L = saved ? AFTER : BEFORE;
            box.replaceChildren(xvWin('app.js', ...L.map((l, i) => { const r = xvLn(i + 1, hl(l, 'ts')); const m = MSG[i]; const fixedNow = saved && i < 2; if (m && !fixedNow) r.append(h('span', { class: 'xe-lens', style: i < 2 ? '' : 'background:color-mix(in srgb,#ffb454 22%,transparent);color:#ffd9a0' }, m[0] + '：' + m[1])); return r; })));
            note.className = 'xe-note' + (saved ? (auto ? ' ok' : '') : '');
            note.innerHTML = !saved ? '保存してみよう。問題は <b>3つ</b>（うち 2つは自動で直せる）。' : auto ? '保存の瞬間に <b>2か所が自動で直った</b>。残った <code class="i">unused</code> は、人が判断して消す。' : '自動修正が OFF だと、<b>何も直らない</b>。毎回、手で直す。';
          };
          draw();
          return h('div', null, h('div', { class: 'xe-ctl' }, xvSw('保存で自動修正（codeActionsOnSave）', false, (v) => { auto = v; saved = false; draw(); }, 'var(--ts)'), h('button', { class: 'btn primary', onclick: () => { saved = true; draw(); } }, icon('save'), kbd('⌘'), kbd('S'), ' 保存'), h('button', { class: 'btn ghost', onclick: () => { saved = false; draw(); } }, icon('rotate-ccw'), 'もどす')), box, note,
            h('div', { style: { marginTop: '12px' } }, lbl('settings.json'), code('{\n  "editor.formatOnSave": true,\n  "editor.codeActionsOnSave": {\n    "source.fixAll.eslint": "explicit"\n  }\n}', 'json', { color: 'var(--ts)' })));
        };
        el.append(xvTabs([['Vue - Official：テンプレートに型', vueTab], ['ESLint：保存で自動修正', lintTab]]));
      },
    },
    /* ---------------- 7. 快適にする拡張と AI ---------------- */
    {
      t: '快適にする拡張と AI', tag: 'Icon · 日本語 · Copilot', lead: '仕事の<b>快適さ</b>を上げる拡張と、<b>AI アシスタント</b>の付き合い方。AI の提案は<b>便利だけれど間違える</b>。必ず自分の目で確かめる。',
      why: { pv: { k: 'code', file: 'suggest.ts', lang: 'ts', text: 'const API_KEY = "sk-live-1234"\nconst tax = 0.08\nfetch(url, { mode: "no-cors" })', err: [1, 2, 3] }, iv: { k: 'flow', items: ['eye|全部読む', 'shield-alert|秘密を貼らない', 'check|テストで確かめる'] }, av: { k: 'chips', items: ['読む', '秘密を貼らない', 'テストする'] }, problem: 'AI の提案をそのまま貼ったら、秘密のキーや古い税率が混ざっていた', idea: 'AI は下書き係。採用するかを決めるのは自分', answer: '提案は必ず読む・秘密情報は入れない・テストで確かめる' },
      render(el) {
        const lang = h('div', { class: 'xe-card' });
        let ja = false;
        const menuEN = ['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Help'], menuJA = ['ファイル', '編集', '選択', '表示', '移動', '実行', 'ターミナル', 'ヘルプ'];
        const drawLang = () => lang.replaceChildren(h('h4', null, icon('languages'), 'Japanese Language Pack'), h('div', { class: 'xe-menu' }, ...(ja ? menuJA : menuEN).map((m) => h('span', m))),
          xvSw('日本語にする', ja, (v) => { ja = v; drawLang(); }), h('div', { style: { fontSize: '.8125rem', color: 'var(--mute)' }, html: '入れたあと <kbd>⌘</kbd><kbd>⇧</kbd><kbd>P</kbd> → <b>Configure Display Language</b> → ja。エラーの調べ物は英語のほうが見つかりやすいので、慣れたら戻してもよい。' }));
        const icn = h('div', { class: 'xe-card' });
        let themed = false;
        const FILES = [['dir', 'src', 0], ['vue', 'App.vue', 1], ['ts', 'price.ts', 1], ['css', 'style.css', 1], ['json', 'package.json', 0], ['md', 'README.md', 0]];
        const drawIcn = () => icn.replaceChildren(h('h4', null, icon('palette'), 'Material Icon Theme'),
          h('div', { class: 'xe-tree' }, ...FILES.map(([k, n, ind]) => h('div', { class: ind ? 'in' : '' }, (() => { const ic = icon(themed ? XV_IC[k][0] : 'file'); if (themed) ic.style.color = XV_IC[k][1]; else ic.style.color = '#8e97c4'; return ic; })(), n))),
          xvSw('アイコンを種類ごとにする', themed, (v) => { themed = v; drawIcn(); }, 'var(--violet)'), h('div', { style: { fontSize: '.8125rem', color: 'var(--mute)' } }, 'ファイルが多いほど、絵で探せる。'));
        const ai = h('div', { class: 'xe-card', style: { gridColumn: '1 / -1' } });
        const found = {};
        const SUG = [['const API_KEY = "sk-live-1234"', 'パスワードやキーを、コードに直接書いている。秘密情報はコードに入れない'], ['const tax = 0.08', '税率が古い。提案は最新とは限らない。自分で確かめる'], ['fetch(url, { mode: "no-cors" })', '理由が分からないまま入れている。意味が分からない提案は採用しない']];
        const drawAi = () => {
          const n = Object.keys(found).length;
          ai.replaceChildren(...[h('h4', null, icon('bot'), 'GitHub Copilot などの AI アシスタント'),
            h('div', { style: { fontSize: '.8125rem', color: 'var(--mute)' } }, 'AI が出した提案です。問題のある行を、3つ探してクリックしよう（' + n + ' / 3）。'),
            xvWin('suggestion.ts', ...SUG.map(([c, why], i) => { const r = xvLn(i + 1, hl(c, 'ts'), 'clk' + (found[i] ? ' act' : '')); r.onclick = () => { found[i] = 1; drawAi(); }; if (found[i]) r.append(h('span', { class: 'xe-lens' }, why)); return r; })),
            n === 3 ? xvNote('<b>全部の行に、確認が要った。</b>AI は下書き係。ルール：<b>① 提案は全部読む ② 秘密情報・個人情報を入力しない ③ 会社のルールを守る ④ テストで確かめる</b>', 'ok') : null].filter(Boolean));
        };
        drawLang(); drawIcn(); drawAi();
        el.append(h('div', { class: 'xe-split' }, lang, icn), h('div', { style: { marginTop: '14px' } }, ai));
      },
    },
    /* ---------------- 8. おすすめ拡張機能一覧 ---------------- */
    {
      t: 'おすすめ拡張機能一覧', tag: 'extensions.json', lead: '入れる拡張機能を<b>チームで共有</b>しておくと、新しく入った人も同じ道具で始められる。一覧から選ぶと、<b>共有ファイルとインストールのコマンド</b>が出来上がる。',
      why: { pv: { k: 'code', file: 'チャット', lang: 'text', text: '「どの拡張機能入れてますか？」\n「人によってバラバラ」\n「整形が人ごとに違う」', err: [1, 2, 3] }, iv: { k: 'code', file: '.vscode/extensions.json', lang: 'json', text: '{\n  "recommendations": [\n    "esbenp.prettier-vscode"\n  ]\n}', idea: [2, 3, 4] }, av: { k: 'flow', items: ['users|全員に推奨が出る', 'check|同じ道具で始まる'] }, problem: '拡張機能が人によってバラバラで、整形や警告の出方が違う', idea: 'おすすめの一覧をファイルにして、リポジトリに入れる', answer: '.vscode/extensions.json の recommendations' },
      render(el) {
        const pick = {}; XV_EXT.forEach((e) => { if (e.lv === '必須') pick[e.id] = 1; });
        let flt = 'すべて';
        const tbl = h('div'), out1 = h('div'), out2 = h('div');
        const LV = { 必須: 'm', おすすめ: 'r', 場面別: 's' };
        function draw() {
          tbl.replaceChildren(h('table', { class: 'xe-tbl' }, h('thead', null, h('tr', null, h('th', ''), h('th', '名前'), h('th', 'できること'), h('th', 'いつ要る？'))),
            h('tbody', null, XV_EXT.filter((e) => flt === 'すべて' || e.lv === flt).map((e) => h('tr', null,
              h('td', null, h('button', { class: 'xe-chk' + (pick[e.id] ? ' on' : ''), 'aria-label': e.n + ' を選ぶ', style: { all: 'unset', cursor: 'pointer' }, onclick: () => { if (pick[e.id]) delete pick[e.id]; else pick[e.id] = 1; draw(); } }, h('i', { style: { display: 'grid', placeItems: 'center', width: '18px', height: '18px', borderRadius: '5px', border: '1.5px solid ' + (pick[e.id] ? 'var(--ok)' : 'var(--mute)'), background: pick[e.id] ? 'var(--ok)' : 'transparent', color: '#06101f' } }, pick[e.id] ? icon('check', { size: '12px' }) : null))),
              h('td', null, h('b', e.n), h('div', null, h('code', e.id)), h('span', { class: 'xe-lv ' + LV[e.lv] }, e.lv)), h('td', e.d), h('td', e.w))))));
          const ids = XV_EXT.filter((e) => pick[e.id]).map((e) => e.id);
          out1.replaceChildren(code('// .vscode/extensions.json\n' + JSON.stringify({ recommendations: ids }, null, 2), 'json', { file: '.vscode/extensions.json', color: 'var(--ts)' }));
          out2.replaceChildren(code(ids.length ? ids.map((i) => 'code --install-extension ' + i).join('\n') : '# 上の表から選ぼう', 'sh', { file: 'terminal', color: 'var(--basic)' }));
        }
        el.append(h('div', { class: 'xe-ctl' }, ...['すべて', '必須', 'おすすめ', '場面別'].map((f) => h('button', { class: 'xb-sg' + (f === flt ? ' on' : ''), onclick: (ev) => { flt = f; ev.currentTarget.parentNode.querySelectorAll('.xb-sg').forEach((b) => b.classList.toggle('on', b === ev.currentTarget)); draw(); } }, f))),
          tbl,
          h('div', { class: 'xe-split', style: { marginTop: '14px' } }, h('div', null, lbl('チームで共有するファイル'), out1), h('div', null, lbl('ターミナルで一括インストール'), out2)),
          xvNote('<b>.vscode/extensions.json</b> を Git に入れておくと、プロジェクトを開いた人に「おすすめの拡張機能をインストールしますか？」と<b>通知が出る</b>。'));
        draw();
      },
    },
  ];

  K.reg({
    id: 'x-vscode', track: 'extra', title: 'VS Code 便利技', sub: 'マルチカーソル・保存で整形・拡張機能', emoji: '🧰',
    gh: [{ label: 'vuejs/99_bonus/prettier.md', path: 'vuejs/99_bonus/prettier.md' }, { label: 'typescript/prettier.json', path: 'typescript/prettier.json' }],
    meta: { cat: 'basic', day: '1日目', when: 'HTML 実習の前（コードを書き始める直前）。拡張機能の回は、余った時間に', mins: 30, order: 11, level: '入門', after: 'html', why: '同じ操作が速くなり、整ったコードがチームの当たり前になる。拡張機能で、エラーや履歴まで見えるようになる' },
    scenes: [
      {
        t: 'マルチカーソル & ショートカット', tag: 'Cmd+D', lead: '同じ単語を<b>一度に</b>書き換える。「次へ」で操作を追おう。ショートカット一覧は、タイトル横の <b>キーボードのアイコン</b>。',
        why: {pv: {"k": "code", "file": "price.ts", "lang": "ts", "text": "const price = 100\nconst tax = price * 0.1\nconst total = price + tax\n// price → cost（3か所）", "err": [1, 2, 3], "keys": {"4": "multi"}}, iv: {"k": "code", "file": "⌘D", "lang": "txt", "text": "⌘D   次の同じ単語を選ぶ\n⌘D   さらに次を選ぶ\n→ カーソル3つで同時に入力", "idea": [3], "keys": {"3": "multi"}}, av: {"k": "code", "file": "price.ts", "lang": "ts", "text": "const cost = 100\nconst tax = cost * 0.1\nconst total = cost + tax", "ok": [1, 2, 3], "keys": {"1": "multi"}}, problem: "1つずつ直すと見落とす", idea: "同じ直しは、一度にまとめて", answer: "⌘D でカーソルを増やす", "when": [["同じ単語を数か所だけ", "⌘D（マルチカーソル）"], ["プロジェクト全体の名前変更", "F2 リネーム（参照も追従）"], ["行の移動・複製", "⌥↑↓ / ⌥⇧↓"]]},
        ref: [{ title: 'ショートカット一覧', icon: 'keyboard', node: () => vscKeys() }],
        render(el, ctx) {
          const L = ['const price = 100', 'const tax = price * 0.1', 'const total = price + tax', 'console.log(price, total)'];
          const pre = h('pre', { class: 'code dim', style: { '--c': 'var(--pink)' } });
          const draw = (k, word) => {
            let seen = 0;
            pre.replaceChildren(...L.map((ln) => {
              let html = '', hit = false;
              ln.split(/(price)/).forEach((p) => { if (p === 'price') { if (seen < k) { html += `<span class="xb-sel">${word || 'price'}</span>`; hit = true; } else html += 'price'; seen++; } else html += esc(p); });
              return h('span', { class: 'ln' + (hit ? ' on' : ''), html });
            }));
          };
          const cur = h('div', { class: 'fo4-cur' }, [0, 1, 2, 3].map(() => h('i')));
          const note = h('div', { class: 'fo4-note' });
          const cmp = h('div', { style: { color: 'var(--mute)', fontWeight: 700, fontSize: '.8rem', minHeight: '1.4em' } });
          let api = null;
          const kd = h('button', { class: 'btn primary', style: { '--c': 'var(--pink)' }, onclick: () => api && api.go(Math.min(api.cur + 1, 4)) }, kbd('⌘'), kbd('D'), ' を押す');
          const ty = h('button', { class: 'btn', onclick: () => api && api.go(5) }, icon('keyboard'), '「cost」と打つ');
          const rs = h('button', { class: 'btn ghost', onclick: () => api && api.go(0) }, icon('rotate-ccw'), 'もどす');
          const dead = () => ctx && ctx.dead;
          let busy = false;
          async function play() {
            if (busy) return; busy = true;
            for (let i = 0; i <= 5 && !dead(); i++) { api.go(i); await sleep(i === 0 ? 500 : 900); }
            busy = false;
          }
          const st = stepper({
            color: 'var(--pink)',
            steps: [
              { say: '変数名 <b>price</b> を <b>cost</b> に変えたい。4か所をひとつずつ？ 面倒…' },
              { say: '<b>price</b> を選んで <kbd>⌘</kbd><kbd>D</kbd>。1つ目が選択される。' },
              { say: 'もう一度 <kbd>⌘</kbd><kbd>D</kbd>。2つ目も選択（カーソルが2本に）。' },
              { say: 'さらに <kbd>⌘</kbd><kbd>D</kbd>。3つ目も選択。' },
              { say: 'もう一度。4か所すべてにカーソル！' },
              { say: '<b>cost</b> と打つだけで、4か所が同時に書き換わる。' },
            ],
            init(vis, a) {
              api = a;
              vis.append(h('div', { class: 'fo4-split' },
                h('div', { class: 'fo4-col' }, lbl('エディタ'), pre),
                h('div', { class: 'fo4-col' }, lbl('出力：カーソルの数'), cur, note, cmp)),
              h('div', { class: 'fo4-ctl fo4-c', style: { marginTop: '12px' } }, kd, ty, rs));
            },
            update(n) {
              const k = Math.min(n, 4), typed = n === 5;
              draw(k, typed ? 'cost' : null);
              [...cur.children].forEach((c, i) => c.classList.toggle('on', i < k));
              note.textContent = typed ? '4か所が同時に cost になった' : k ? `${k}か所を選択中` : '何も選んでいない';
              cmp.textContent = typed ? '手で直す：4回 → マルチカーソル：1回で完了' : '';
              kd.disabled = n >= 4; ty.disabled = n !== 4; rs.disabled = n === 0;
            },
          });
          el.append(st);
          el.append(h('div', { class: 'fo4-ctl fo4-c', style: { marginTop: '12px' } }, h('button', { class: 'btn primary', style: { '--c': 'var(--pink)' }, onclick: play }, icon('play'), '操作を通して再生')));
          ctx && ctx.cleanups && ctx.cleanups.push(() => { ctx.dead = true; });
        },
      },
      {
        t: '保存するだけで整う', tag: 'Prettier', lead: '<kbd>⌘</kbd><kbd>S</kbd> で保存すると、コードが<b>自動で整う</b>。<b>Live Server</b> がブラウザも更新する。',
        why: {pv: {"k": "code", "file": "app.ts", "lang": "ts", "text": "const  a='x'\nfunction f( ){\nreturn 1}", "err": [1, 2, 3], "keys": {"2": "fmt"}}, iv: {"k": "code", "file": ".vscode/settings.json", "lang": "json", "text": "{\n  \"editor.formatOnSave\": true\n}", "idea": [2], "keys": {"2": "fmt"}}, av: {"k": "code", "file": "app.ts", "lang": "ts", "text": "const a = 'x'\nfunction f() {\n  return 1\n}", "ok": [1, 2, 3, 4], "keys": {"2": "fmt"}}, problem: "書式がバラバラでレビューが荒れる", idea: "見た目はツールに任せる", answer: "Prettier + formatOnSave", "when": [["見た目の統一", "Prettier"], ["バグの予防（未使用変数など）", "ESLint"], ["ブラウザ確認の手間", "Live Server"]]},
        ref: [{ title: '設定ファイル（コピペ用）', icon: 'file-cog', node: () => { const p = code('// .vscode/settings.json\n{\n  "editor.defaultFormatter": "esbenp.prettier-vscode",\n  "editor.formatOnSave": true\n}\n\n// .prettierrc\n{ "semi": false, "singleQuote": true }', 'ts', { color: 'var(--pink)' }); p.setHi([4]); return p; } }],
        render(el, ctx) {
          let api = null, busy = false;
          const messy = "const  fee=3300\nfunction calcTotal( n ){\nreturn fee*n+tax(n)}\ncalcTotal( 2 )";
          const neat = "const fee = 3300\nfunction calcTotal(n) {\n  return fee * n + tax(n)\n}\ncalcTotal(2)";
          const diffBox = h('div', { class: 'xb-prd' });
          const prd = (n) => diffBox.replaceChildren(h('div', { class: 'h' }, icon('git-pull-request'), 'PR の差分（レビューする人の画面）'),
            n === 2 ? h('div', { class: 'r ok' }, h('b', '+1 −1'), h('span', '変更は料金の計算の 1 行だけ。レビューは 10 秒で終わる'))
              : h('div', { class: 'r bad' }, h('b', '+5 −5'), h('span', 'うち 4 行は「空白とクォートの違い」だけ。本当の変更（料金）が埋もれて、見落とす')));
          const edBox = h('div'); const fileTab = h('div', { class: 'label' }, h('span', { class: 'xb-unsaved' }, 'main.js'));
          const brw = h('div', { class: 'xb-brw' }, h('div', { class: 'u' }, h('i'), h('i'), h('i'), h('b', '127.0.0.1:5500'), h('span', { class: 'rl' })), h('div', { class: 'pg' }, h('h3', '合計 ¥6,600'), h('p', { style: { color: '#888' } }, '読み込み: 12:00:00')));
          const rl = brw.querySelector('.rl'), pg = brw.querySelector('.pg');
          const setEd = (txt, hi) => { const p = code(txt, 'ts', { file: 'main.js', color: 'var(--ts)', hi }); edBox.replaceChildren(p); };
          el.append(stepper({
            color: 'var(--ts)',
            steps: [
              { say: '人によって空白もクォートもバラバラ。このまま PR を出すと、<b>書式の違いまで差分</b>に出てしまう。' },
              { say: '<kbd>⌘</kbd><kbd>S</kbd>！ <b>Prettier</b> が保存と同時に整える。チーム全員が同じ書式になる。' },
              { say: '<b>Live Server</b> がブラウザも更新。PR の差分は<b>本当の変更だけ</b>になった。' },
            ],
            init(vis, a) { api = a; vis.append(h('div', { class: 'split xb-st fo4-top' }, h('div', null, fileTab, edBox), h('div', null, lbl('ブラウザ'), brw)), diffBox); prd(0); },
            async update(n) {
              fileTab.firstChild.classList.toggle('xb-unsaved', n === 0); prd(n);
              setEd(n === 0 ? messy : neat, n === 1 ? [1, 2, 3, 4, 5] : []);
              if (n === 1) { const lines = edBox.querySelectorAll('.ln'); lines.forEach((l, i) => l.animate([{ background: 'color-mix(in srgb,var(--pink) 40%,transparent)' }, { background: 'transparent' }], { duration: 900, delay: i * 120 })); }
              if (n === 2) { rl.innerHTML = '<span class="xb-spin"></span>'; await sleep(700); rl.textContent = ''; pg.querySelector('p').textContent = '読み込み: 12:00:03 ✓ 自動更新'; pg.animate([{ background: '#dff7e6' }, { background: '#fff' }], { duration: 900 }); } else { pg.querySelector('p').textContent = '読み込み: 12:00:00'; rl.textContent = ''; }
            },
          }));
          const save = async () => {
            if (busy) return; busy = true;
            api.go(0); await sleep(450);
            if (!(ctx && ctx.dead)) { api.go(1); await sleep(1500); }
            if (!(ctx && ctx.dead)) api.go(2);
            busy = false;
          };
          el.append(h('div', { class: 'fo4-ctl fo4-c', style: { marginTop: '12px' } }, h('button', { class: 'btn primary', style: { '--c': 'var(--ts)' }, onclick: save }, icon('save'), kbd('⌘'), kbd('S'), ' を押して保存')));
          ctx && ctx.cleanups && ctx.cleanups.push(() => { ctx.dead = true; });
        },
      },
      ...XV_NEW,
    ],
  });

  /* ================= x-devtools ================= */
  function miniPage() {
    const root = h('div', { class: 'xb-brw' }, h('div', { class: 'u' }, h('i'), h('i'), h('i'), h('b', 'localhost:5173')), h('div', { class: 'pg' }, h('h1', { style: { fontSize: '2rem', color: '#1a1e3a' } }, '相談を予約する'), h('p', { style: { color: '#555' } }, '30分・オンライン・初回無料'), h('button', { style: { background: '#5b9dff', color: '#fff', border: 0, borderRadius: '6px', padding: '.4em 1.2em', fontWeight: 800, font: 'inherit' } }, '予約する')));
    return root;
  }
  const DT_INFO = { Elements: ['HTML と CSS を見る・書き換える', '部品を選ぶと、Styles の値をその場で変えられる。'], Console: ['エラーと console.log が出る', 'JavaScript を1行ずつ試せる。'], Network: ['通信の一覧', '画像や API の取得が成功したか、404 かが分かる。'], Sources: ['JavaScript を途中で止めて見る', '行に印（ブレークポイント）を付けると、そこで止まって変数の中身が見える。'] };
  const dtInfo = (n) => h('div', null, h('div', { class: 'fo4-note' }, n + '：' + DT_INFO[n][0]), h('p', { style: { color: '#9aa3c7', marginTop: '8px', fontSize: '.8rem' } }, DT_INFO[n][1] + ' この場面では Elements と Console、Network を使う。'));
  const NET = [['index.html', 200, 'document', '1.2 kB', 40, 0], ['style.css', 200, 'stylesheet', '3.4 kB', 55, 12], ['app.js', 200, 'script', '18 kB', 120, 12], ['logo.png', 304, 'png', '0.2 kB', 8, 30], ['/api/users', 404, 'fetch', '0.3 kB', 90, 55], ['font.woff2', 200, 'font', '22 kB', 140, 40]];
  const STAT = { 200: ['200 OK', '成功。ちゃんと届いた。', 'c'], 304: ['304 Not Modified', '前と同じ → キャッシュを再利用（速い）。', 'c'], 404: ['404 Not Found', 'URL が違う / ファイルが無い。画像が出ない時はまずここ！', 'bad'] };

  K.reg({
    id: 'x-devtools', track: 'extra', title: 'Chrome DevTools', sub: 'F12 で見える化する', emoji: '🔍',
    gh: [{ label: 'html/（HTMLサンプル）', path: 'html' }, { label: 'html/03_display', path: 'html/03_display' }],
    meta: { cat: 'basic', day: '1日目', when: 'CSS の途中（見た目が思い通りにならない場面で）', mins: 10, order: 12, level: '入門', after: 'css', why: '「なぜこう表示される？」を自力で調べられる。現場で一番使う道具' },
    scenes: [
      {
        t: 'Elements：その場で書き換える', tag: 'F12', lead: '「<b>予約ボタンが押せない</b>」。右の <b>DevTools</b> でページの上をクリックして要素を選び、原因を見つけよう。☑ を外すと、左のページがすぐ変わる（リロードで元に戻る）。',
        why: {pv: {"k": "code", "file": "style.css", "lang": "css", "text": ".card { margin: 8px }  /* 保存 */\n→ リロード → まだズレてる\n.card { margin: 12px } /* 保存 */\n→ リロード → また違う", "err": [2, 4], "keys": {"4": "live"}}, iv: {"k": "code", "file": "DevTools › Elements", "lang": "txt", "text": "<div class=\"card\">  ← 選ぶ\nStyles\n  margin: 8px → 12px  ← 編集\n→ 画面がすぐ変わる", "idea": [3], "keys": {"3": "live"}}, av: {"k": "code", "file": "F12", "lang": "txt", "text": "F12 → Elements\n選ぶ → 直す → 即反映", "ok": [2], "keys": {"2": "live"}}, problem: "直して保存してリロードの繰り返し", idea: "ブラウザの中で直して試す", answer: "Elements：選択 → 編集 → 即反映", "when": [["見た目の原因を探す", "Elements"], ["エラーを見る", "Console"], ["画像・API が来ない", "Network"], ["スマホ表示の確認", "Device mode"]]},
        hint: 'DevTools の開き方：ページ上で右クリック →「検証」／ <kbd>F12</kbd> ／ <kbd>⌘</kbd><kbd>⌥</kbd><kbd>I</kbd>',
        render(el) {
          const page = miniPage(); const pg = page.querySelector('.pg');
          pg.style.position = 'relative';
          const ov = h('div', { class: 'xb-ov', title: '' });
          ov.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;z-index:5;background:transparent';
          pg.append(ov);
          const status = h('div', { class: 'xb-stat bad' }, '状況：お客様から「予約ボタンが押せない」と連絡が来た。ボタンを押してみよう。');
          const nodes = [['div', 'class="pg"', 0, pg], ['h1', '', 1, pg.children[0]], ['p', '', 1, pg.children[1]], ['button', '', 1, pg.children[2]], ['div.ov', 'class="ov"', 1, ov]];
          const DEC = {
            h1: [['color', '#1a1e3a'], ['font-size', '1.8rem'], ['letter-spacing', '0']],
            p: [['color', '#555'], ['font-size', '1rem'], ['text-decoration', 'underline']],
            button: [['background', '#5b9dff'], ['border-radius', '99px'], ['padding', '.4em 1.2em'], ['font-size', '1rem']],
            div: [['background', '#ffffff'], ['padding', '18px']],
            'div.ov': [['position', 'absolute'], ['z-index', '5'], ['top', '0'], ['bottom', '0']],
          };
          const on = {};
          const tree = h('div'), styles = h('div');
          let sel = 'h1';
          const DOM = { div: pg, h1: pg.children[0], p: pg.children[1], button: pg.children[2], 'div.ov': ov };
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
          const elP = [tree, h('hr', { style: { border: 0, borderTop: '1px solid #2c3247', margin: '8px 0' } }), styles];
          const pn0 = h('div', { class: 'pn' }, ...elP);
          const tabs0 = ['Elements', 'Console', 'Network', 'Sources'].map((t, i) => h('button', { class: i ? '' : 'on', onclick: () => { tabs0.forEach((x, k) => x.classList.toggle('on', k === i)); pn0.replaceChildren(...(i ? [dtInfo(t)] : elP)); } }, t));
          const dt = h('div', { class: 'xb-dt' }, h('div', { class: 'tabs' }, ...tabs0), pn0);
          drawTree(); drawStyles(); DOM.h1.style.outline = '2px solid #ff6b9d';
          const pick = (t) => { sel = t; drawTree(); drawStyles(); Object.values(DOM).forEach((n) => (n.style.outline = '')); DOM[t].style.outline = '2px solid #ff6b9d'; tabs0[0].click(); };
          ['h1', 'p', 'button'].forEach((t) => { DOM[t].style.cursor = 'pointer'; DOM[t].addEventListener('click', (e) => { e.stopPropagation(); pick(t); if (t === 'button') { status.className = 'xb-stat ok'; status.textContent = '押せた！ 予約が受け付けられた。原因は「ボタンの上にかぶさった透明な要素」だった。'; } }); });
          ov.addEventListener('click', (e) => { e.stopPropagation(); pick('div.ov'); status.className = 'xb-stat bad'; status.textContent = 'ボタンではなく、<div class="ov"> をクリックしている。Elements でこの要素を選んだ → Styles の position を外してみよう。'; });
          const edit = h('input', { class: 'xb-in', value: '相談を予約する', style: { fontSize: '1rem' }, oninput: (e) => (DOM.h1.textContent = e.target.value) });
          el.append(h('div', { class: 'split xb-st fo4-top' }, h('div', null, lbl('お客様が見ているページ'), page, status, edit, ), h('div', null, lbl('DevTools'), dt)));
        },
      },
      {
        t: 'Console と Network', tag: 'DEBUG', lead: 'エラーは <b>Console</b>、通信は <b>Network</b> で見る。タブを切り替えて、例や行を押してみよう。',
        why: {pv: {"k": "code", "file": "ブラウザ", "lang": "txt", "text": "（画面が真っ白）\n（画像が出ない）\nコードを眺める … 原因不明", "err": [1, 2, 3], "keys": {"1": "log", "2": "net"}}, iv: {"k": "code", "file": "DevTools", "lang": "txt", "text": "Console: Uncaught TypeError\nNetwork: GET /img/a.png 404\n→ 証拠はもう記録されている", "idea": [1, 2], "keys": {"1": "log", "2": "net"}}, av: {"k": "chips", "items": [{"i": "terminal", "t": "Console：エラー", "key": "log"}, {"i": "network", "t": "Network：404", "key": "net"}]}, problem: "原因が分からず眺めるだけ", idea: "起きたことは記録されている", answer: "Console（エラー）と Network（通信）", "when": [["赤いエラー文", "Console"], ["404 / 500 / 遅い", "Network"], ["変数の中身を確認", "console.log か debugger"]]},
        hint: 'Console に書いた命令は、このページの <b>DOM を直接</b>書き換える（リロードで元に戻る）。',
        render(el, ctx) {
          const page = miniPage(); const pg = page.querySelector('.pg');
          const shim = { querySelector: (s) => pg.querySelector(s), querySelectorAll: (s) => pg.querySelectorAll(s), getElementById: (id) => pg.querySelector('#' + String(id).replace(/[^\w-]/g, '')), body: pg };
          const log = h('div', { class: 'xb-con' });
          const add = (c, t) => { log.append(h('div', { class: c }, t)); log.scrollTop = 9e4; };
          const fmt = (v) => (v instanceof Element ? '<' + v.tagName.toLowerCase() + '>' : v instanceof NodeList ? `NodeList(${v.length})` : v === undefined ? 'undefined' : typeof v === 'string' ? `"${v}"` : String(v));
          function run(src) {
            if (!src.trim()) return;
            add('i', '› ' + src);
            const con = { log: (...a) => add('r', a.join(' ')), error: (...a) => add('e', a.join(' ')) };
            try { let r; try { r = new Function('document', 'console', 'return (' + src + ')')(shim, con); } catch (e) { if (e instanceof SyntaxError) r = new Function('document', 'console', src)(shim, con); else throw e; } add('r', '← ' + fmt(r)); } catch (e) { add('e', '✖ ' + e.message); }
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
          const pane = { Console: consoleP, Network: netP };
          const tabs = ['Elements', 'Console', 'Network', 'Sources'].map((t) => h('button', { class: t === 'Console' ? 'on' : '', onclick: () => { tabs.forEach((x) => x.classList.toggle('on', x.textContent === t)); pn.replaceChildren(pane[t] || dtInfo(t)); if (t === 'Network') setTimeout(reload, 50); } }, t));
          const dt = h('div', { class: 'xb-dt' }, h('div', { class: 'tabs' }, ...tabs), pn);
          const regBtn = page.querySelector('button');
          if (regBtn) regBtn.addEventListener('click', () => { tabs[1].click(); add('i', '› 「予約する」をクリック'); add('e', "✖ Uncaught TypeError: Cannot read properties of null (reading 'value')"); add('r', '    at register (app.js:12)'); });
          pn.append(consoleP);
          add('e', '✖ Failed to load resource: /api/users (404)'); add('i', '› 下のボタンを押して実行 ↓');
          el.append(h('div', { class: 'split xb-st fo4-top' }, h('div', null, lbl('ページ'), page, ), h('div', null, lbl('DevTools'), dt)));
        },
      },
      {
        t: 'Device mode：スマホで見る', tag: 'RESPONSIVE', lead: '<kbd>⌘</kbd><kbd>⇧</kbd><kbd>M</kbd> でスマホ表示にできる。幅を切り替えて、相談分野の一覧とメニューがどう変わるか見よう。',
        why: {pv: {"k": "code", "file": "hero.css", "lang": "css", "text": ".hero { width: 1200px }\n/* PC では綺麗 */\n/* スマホ: 横にはみ出す */", "err": [1, 3], "keys": {"3": "dev"}}, iv: {"k": "code", "file": "DevTools", "lang": "txt", "text": "⌘⇧M で Device mode\n幅 375 × 812  (iPhone)\n幅 768         (タブレット)", "idea": [2], "keys": {"2": "dev"}}, av: {"k": "chips", "items": [{"i": "smartphone", "t": "375px", "key": "dev"}, {"i": "tablet", "t": "768px"}, {"i": "monitor", "t": "1280px"}]}, problem: "PC では綺麗でスマホで崩れる", idea: "画面の幅を変えて確かめる", answer: "Device mode（⌘⇧M）で切り替え", "when": [["レイアウトの崩れ確認", "Device mode"], ["タッチ操作・実際の速度", "実機で最終確認"]]},
        render(el) {
          const dev = h('div', { class: 'xb-dev', style: { width: '100%' } }, h('div', { class: 'pg' }, h('nav', h('span', 'ご相談受付'), h('span', { class: 'l' }, h('span', 'ホーム'), h('span', '料金'), h('span', '連絡')), h('span', { class: 'm' }, '☰')), h('div', { class: 'gd' }, ['離婚', '相続', '債務', '労働', '交通', 'その他'].map((x) => h('div', x)))));
          const width = h('b', { style: { fontFamily: 'var(--mono)' } }, '100%');
          const setW = (v) => { dev.style.width = v === 'pc' ? '100%' : v + 'px'; width.textContent = v === 'pc' ? 'PC（全幅）' : v + ' px'; };
          const seg = chips([['pc', 'PC'], ['768', 'iPad 768'], ['390', 'iPhone 390'], ['320', 'Small 320']], 'pc', setW, 'var(--ts)');
          const Q = [
            ['ボタンを押しても何も起きない。<b>エラー内容</b>を見たい', ['Elements', 'Console', 'Network'], 1, 'エラーは Console に赤字で出ます。'],
            ['画像が表示されない。<b>404 かも？</b>', ['Network', 'Elements', 'Sources'], 0, 'Status 404 の行が赤く出ます。'],
            ['文字の<b>色をその場で試したい</b>', ['Console', 'Elements', 'Network'], 1, 'Styles で値を書き換えて確認。'],
          ];
          el.append(h('div', { class: 'fo4-stack' }, h('div', null, lbl('Device mode'), seg, h('div', { class: 'grow', style: { display: 'grid', placeItems: 'start center', padding: '6px', background: 'var(--card)', borderRadius: '8px', border: '1px solid var(--line)' } }, dev), h('div', { style: { color: 'var(--mute)', fontSize: '.875rem' } }, '表示幅：', width)),
            h('div', null, lbl('どのパネルを開く？'), h('div', { class: 'xb-qz fo4-q3' }, Q.map(([q, o, a, w]) => card(quiz({ q, options: o, answer: a, why: w })))))));
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
  .xb-ib{all:unset;display:grid;place-items:center;width:30px;height:30px;border-radius:6px;background:rgba(255,255,255,.14);color:#fff}.xb-ib .ic{width:18px;height:18px}.xb-ch{background:#f4f6fd;border-radius:8px;padding:8px;max-width:260px}
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
    meta: { cat: 'basic', day: '1日目', when: 'CSS 実習のまとめ（クラス名を付け始める前）', mins: 10, order: 13, level: '入門', after: 'css', why: 'チーム開発で「どのCSSがどこに効く？」を迷わなくなる' },
    scenes: [
      {
        t: 'Block · Element · Modifier', tag: 'BEM', lead: '<b>ブロック__エレメント--モディファイア</b>。クラス名にカーソルを乗せると、カードの該当部分が光る。',
        why: {pv: {"k": "code", "file": "style.css", "lang": "css", "text": ".box { }\n.title { }\n.red { }", "err": [1, 2, 3], "keys": {"3": "bem"}}, iv: {"k": "code", "file": "BEM", "lang": "css", "text": ".card           /* block */\n.card__title    /* element */\n.card--large    /* modifier */", "idea": [2], "keys": {"2": "bem"}}, av: {"k": "code", "file": "style.css", "lang": "css", "text": ".card__title--large { }", "ok": [1], "keys": {"1": "bem"}}, problem: "名前から、どこの何か分からない", idea: "部品・中身・状態を名前に入れる", answer: "<code>block__element--modifier</code>", "when": [["独立した部品", "Block（.card）"], ["部品の中の一部", "Element（.card__title）"], ["色・サイズ・状態の違い", "Modifier（.card--large）"]]},
        hint: '<b>block</b>（部品）＋ <b>__element</b>（部品の中身）＋ <b>--modifier</b>（見た目・状態の違い）。ハイフンとアンダースコアの数で役割が決まる。',
        render(el) {
          const COL = { b: 'var(--ts)', e: 'var(--basic)', m: 'var(--pink)' };
          const tok = h('div', { class: 'xb-bt' }); let cur = 0;
          const card = h('div', { class: 'xb-bm' },
            h('div', { class: 'im', 'data-c': '.card__image' }, icon('image', { size: '1.6rem' })),
            h('h3', { class: 'ti l', 'data-c': '.card__title--large' }, '離婚の相談'),
            h('p', { style: { margin: 0, color: '#667', fontSize: '.875rem' } }, '初回30分は無料です'),
            h('button', { class: 'bt p', 'data-c': '.card__button--primary' }, '予約する'));
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
          /* 困りごと：2人が同じクラス名 .title を使うと… */
          const BCSS = {
            a: '/* A さん：相談カード */\n.title { font-size: 18px; color: #1a1e3a; }',
            clash: '/* A さん：相談カード */\n.title { font-size: 18px; color: #1a1e3a; }\n/* B さん：料金プランを追加（同じ .title） */\n.title { font-size: 28px; color: #e0455a; }',
            bem: '.consult-card__title { font-size: 18px; color: #1a1e3a; }\n.plan-card__title { font-size: 28px; color: #e0455a; }',
          };
          const BMSG = {
            a: ['ok', 'A さんの<b>相談カード</b>。題名は紺色の 18px で、ちょうどいい。'],
            clash: ['bad', '<b>相談カードの題名まで、赤くて大きくなった！</b> B さんは自分の部品だけ直したつもりなのに、同じ <code>.title</code> が両方に効いた。'],
            bem: ['ok', '<b>それぞれの部品の中だけ</b>に効く。誰がいつ部品を足しても、ぶつからない。'],
          };
          let bMode = 'clash';
          const bFrame = h('iframe', { style: { width: '100%', height: '150px', border: '1px solid var(--line)', borderRadius: '8px', background: '#fff' }, sandbox: '', title: '相談カードと料金プラン' });
          const bCode = h('div'), bVerdict = h('div', { class: 'xb-stat' });
          function bDraw() {
            const m = bMode, c1 = m === 'bem' ? 'consult-card' : 'card', t1 = m === 'bem' ? 'consult-card__title' : 'title', c2 = m === 'bem' ? 'plan-card' : 'card', t2 = m === 'bem' ? 'plan-card__title' : 'title';
            const one = `<div class="${c1}"><h3 class="${t1}">離婚の相談</h3><p>初回30分は無料です</p></div>`;
            const two = m === 'a' ? '<div class="empty">（料金プランは、まだ無い）</div>' : `<div class="${c2}"><h3 class="${t2}">料金プラン</h3><p>30分 5,500円</p></div>`;
            bFrame.srcdoc = `<style>body{font-family:sans-serif;margin:8px;display:grid;grid-template-columns:1fr 1fr;gap:10px}.card,.consult-card,.plan-card{border:2px solid #5b9dff;border-radius:8px;padding:10px;background:#fff}h3{margin:0 0 4px}p{margin:0;color:#667;font-size:13px}.empty{border:2px dashed #bbb;border-radius:8px;display:grid;place-items:center;color:#999;font-size:12px}${m === 'bem' ? BCSS.bem : m === 'a' ? BCSS.a : BCSS.clash}</style>${one}${two}`;
            bCode.replaceChildren(code(BCSS[m], 'css', { file: 'style.css', color: m === 'clash' ? 'var(--bad)' : 'var(--ok)', hi: m === 'clash' ? [4] : m === 'bem' ? [1, 2] : [2] }));
            bVerdict.className = 'xb-stat ' + BMSG[m][0]; bVerdict.innerHTML = BMSG[m][1];
          }
          const bSeg = chips([['a', 'A さん：相談カードを作る'], ['clash', 'B さん：料金プランを足す（同じ .title）'], ['bem', 'BEM：名前で分ける']], 'clash', (v) => { bMode = v; bDraw(); }, 'var(--pink)');
          el.append(h('div', { style: { marginBottom: '22px' } }, lbl('困りごと：2人が同じクラス名を使うと…'), bSeg, h('div', { class: 'split', style: { marginTop: '10px' } }, h('div', null, bCode, bVerdict), bFrame)));
          bDraw();
          el.append(h('div', { class: 'split xb-st fo4-top' }, h('div', null, lbl('クラス名の分解（相談カードの例）'), tok, list), h('div', { class: 'grow', style: { display: 'grid', placeItems: 'center', background: 'var(--card)', borderRadius: '8px', border: '1px solid var(--line)', padding: '18px' } }, card)));
          sel(3);
        },
      },
      {
        t: '置き場所を変えても崩れない', tag: 'WHY', lead: '子孫セレクタ（<code>.main .box</code>）だと、HTML の場所を変えたとたんに崩れる。切り替えて、「サイドバーへ移動」を押してみよう。',
        why: {pv: {"k": "code", "file": "style.css", "lang": "css", "text": ".main .title { color: red }\n/* HTML を .side に移すと */\n/* .main の外 → 効かない */", "err": [1, 3], "keys": {"1": "cls"}}, iv: {"k": "code", "file": "style.css", "lang": "css", "text": "/* 場所に頼らない */\n.card__title { color: red }", "idea": [2], "keys": {"2": "cls"}}, av: {"k": "code", "file": "style.css", "lang": "css", "text": "<h2 class=\"card__title\">\n.card__title { color: red }", "ok": [1, 2], "keys": {"2": "cls"}}, problem: "HTML を動かしたら崩れた", idea: "スタイルは要素のクラスに付ける", answer: "1クラス1役目（BEM の名前）", "when": [["部品を再利用したい", "BEM のクラス"], ["親の文脈で変えたい", "Modifier か専用クラス"]]},
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
            const box = mode === 'messy' ? '<div class="box"><h2>離婚の相談</h2><a>予約する</a></div>' : '<div class="card"><h2 class="card__title">離婚の相談</h2><a class="card__link">予約する</a></div>';
            frame.srcdoc = `<style>body{font-family:sans-serif;margin:8px;display:grid;grid-template-columns:2fr 1fr;gap:10px}.main,.side{border:1px dashed #aaa;border-radius:6px;padding:8px;min-height:190px}.side{background:#f3f4fa}small{color:#888}a{text-decoration:none;display:inline-block}${CSS[mode]}</style><div class="main"><small>.main</small>${moved ? '' : box}</div><div class="side"><small>.side</small>${moved ? box : ''}</div>`;
            cdBox.replaceChildren(code(CSS[mode], 'css', { file: 'style.css', color: mode === 'messy' ? 'var(--bad)' : 'var(--ok)', hi: mode === 'messy' ? [1, 3, 5] : [1, 3, 5] }));
            mv.textContent = moved ? '← メインへ戻す' : '→ サイドバーへ移動';
            verdict.innerHTML = mode === 'messy' ? (moved ? '❌ <b>崩れた！</b> .main の中でしか効かないCSSだった' : '見た目OK。でも <b>.main に頼っている</b>…') : (moved ? '✅ <b>どこへ置いても同じ</b>。クラス名が自分で自分を説明している' : '✅ 部品が<b>自立</b>している（.card だけで完結）');
          }
          const seg = chips([['messy', '子孫セレクタ（.main .box h2）'], ['bem', 'BEM（.card__title）']], 'messy', (v) => { mode = v; draw(); }, 'var(--ts)');
          el.append(h('div', { class: 'split xb-st fo4-top' }, h('div', null, seg, cdBox, mv), h('div', null, lbl('プレビュー'), frame, verdict)));
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
          const CSS0 = '/* ③ HTML のクラス名を直したら、ここも同じ名前に直そう */\n.card { border: 2px solid #5b9dff; padding: 14px; border-radius: 8px; max-width: 320px; }\n.Title { color: #1a1e3a; margin: 0 0 6px; }\n.text_1 { color: #667; }\n.card__button { border: 0; border-radius: 99px; padding: .5em 1.2em; }\n.card__button--primary { background: #5b9dff; color: #fff; }\n.card__button--large { font-size: 1.25rem; }\n.card__button--danger { background: #e0455a; color: #fff; }\n/* 任意チャレンジ用（書き済み） */\n.card--dark { background: #1a1e3a; border-color: #a98bff; color: #fff; }\n.card__badge { display: inline-block; background: #ffe066; color: #3b2f00; border-radius: 99px; padding: 0 .7em; font-size: .8rem; }\n.card__badge-icon { margin-left: .3em; }\n';
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
                { label: '見出しのクラスを「card__title」にする', ok: q('h2.card__title') >= 1, hint: ['見出し（<code>h2</code>）の <code>class="…"</code> を見てみよう。', '<code>Title</code> を <code>card__title</code> に書き換える。'], answer: { code: HM1, lang: 'html', mode: 'replace' } },
                { label: '文章のクラスを「card__text」にする', ok: q('p.card__text') >= 1, hint: ['文章（<code>p</code>）のクラスも、同じように直す。', '<code>text_1</code> を <code>card__text</code> にする。'], answer: { code: HM2, lang: 'html', mode: 'replace' } },
                { label: 'CSS の名前も直して、見出しの色が今まで通り（紺色）にする', ok: !!t && getComputedStyle(t).color === 'rgb(26, 30, 58)', hint: ['HTML を直すと、CSS の <code>.Title</code> が効かなくなる。', 'CSS の <code>.Title</code> を <code>.card__title</code> に、<code>.text_1</code> を <code>.card__text</code> に直す。'], answer: { code: CSS1, lang: 'css', mode: 'replace' } },
                { optional: true, level: 1, label: 'ボタンをもう1つ。「--large」と「--danger」を両方使って、大きくて赤いボタンにする', ok: !!d && [...d.querySelectorAll('button.card__button--large.card__button--danger')].some((bt) => { const cs = getComputedStyle(bt); return parseFloat(cs.fontSize) >= 18 && cs.backgroundColor === 'rgb(224, 69, 90)'; }), hint: ['modifier（<code>--</code>）は、いくつでも重ねて付けられる。CSS は書き済み。', '<code>&lt;button class="card__button card__button--large card__button--danger"&gt;削除する&lt;/button&gt;</code> を足す。'], answer: { code: HM3, lang: 'html', mode: 'replace' } },
                { optional: true, level: 2, label: '暗いカードを1枚足す。「card」に modifier「card--dark」を重ねて付ける（背景は CSS に書き済み）', ok: !!d && [...d.querySelectorAll('.card.card--dark')].some((x) => getComputedStyle(x).backgroundColor === 'rgb(26, 30, 58)'), hint: ['modifier（<code>--</code>）は、元のクラスに<b>足して</b>使う。<code>class="card card--dark"</code> のように2つ並べる。', '<code>&lt;div class="card card--dark"&gt;…&lt;/div&gt;</code> を HTML の最後に足す。<code>card--dark</code> だけだと、枠や余白が付かない。'], answer: { code: '<div class="card card--dark">\n  <p>夜のカード</p>\n</div>\n', lang: 'html', mode: 'append' } },
                { optional: true, level: 3, label: 'カードに「card__badge」を作り、中にアイコン「card__badge-icon」を入れる。名前を「__」で2回つなげない', ok: !!d && !!d.querySelector('.card__badge .card__badge-icon') && !/class\s*=\s*"[^"]*__[\w-]+__/.test(v['index.html'] || ''), hint: ['BEM では、エレメントの中のエレメントも、ブロックの子として<b>1段</b>で名前を付ける。<code>card__badge__icon</code> のように繋げない。', 'バッジの中のアイコンは <code>card__badge-icon</code>（ハイフンでつなぐ）。<code>&lt;span class="card__badge"&gt;NEW&lt;i class="card__badge-icon"&gt;★&lt;/i&gt;&lt;/span&gt;</code> を HTML の最後に足す。'], answer: { code: '<span class="card__badge">NEW<i class="card__badge-icon">★</i></span>\n', lang: 'html', mode: 'append' } },
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
    meta: { cat: 'basic', day: '1日目', when: 'CSS が早く終わった時・Vue のスタイル前の寄り道', mins: 15, order: 14, level: '応用', after: 'css', why: 'スライド目次の「プラスα Sass」を補完。実務の CSS はほぼ変数・レスポンシブ・アニメを使う' },
    scenes: [
      {
        t: 'CSS 変数 var()', tag: '--custom', lead: '「ブランドカラーが変わりました」と言われたら？ 色を<b>1か所</b>で決めておけば、直すのも1か所。上のボタンで「直接書いた場合」と比べよう。',
        why: {pv: {"k": "code", "file": "style.css", "lang": "css", "text": "a { color: #5b9dff }\nb { border: #5b9dff }\nc { fill: #5b9dff }\n/* …あと47か所 */", "err": [1, 2, 3], "keys": {"1": "var"}}, iv: {"k": "code", "file": "style.css", "lang": "css", "text": ":root { --main: #5b9dff }\n/* 1か所で決める */", "idea": [1], "keys": {"1": "var"}}, av: {"k": "code", "file": "style.css", "lang": "css", "text": "a { color: var(--main) }\nb { border: var(--main) }", "ok": [1, 2], "keys": {"1": "var"}}, problem: "同じ色が50か所にコピペ", idea: "値は1か所に書いて呼び出す", answer: "<code>--main</code> と <code>var(--main)</code>", "when": [["色・余白・フォントの共通値", "CSS 変数"], ["JS で変えたい・ダークモード", "CSS 変数（実行時に変えられる）"], ["ループや計算が複雑", "Sass"]]},
        render(el) {
          const S = { hue: 215, rad: 12, dark: false, mode: 'var' };
          const ui = h('div', { class: 'xb-ui' }, h('span', { class: 'bd' }, '受付中'), h('h3', { style: { margin: 0 } }, '相談予約フォーム'), h('div', { class: 'bx' }, 'ご希望の日時（枠線の色）'), h('a', { class: 'lk' }, 'お問い合わせはこちら（リンクの色）'), h('button', { class: 'bt' }, '予約する'));
          const brandMsg = h('div', { class: 'xb-stat ok', style: { marginTop: '10px' } });
          const modeSeg = chips([['var', '変数にした（直す所は1か所）'], ['hard', '色を直接書いた（直す所が4か所）']], 'var', (v) => { S.mode = v; upd(); }, 'var(--pink)');
          const cd = h('div');
          const row = (label, key, min, max, unit, c) => { const v = h('b'); const r = h('input', { type: 'range', min, max, value: S[key], oninput: (e) => { S[key] = +e.target.value; upd(); } }); return [h('div', { class: 'xb-rng', style: { '--c': c } }, h('span', label), r, v), v, unit]; };
          const rows = [row('--brand', 'hue', 0, 360, 'deg', 'var(--pink)'), row('--radius', 'rad', 0, 32, 'px', 'var(--ts)')];
          const dk = h('button', { class: 'xb-sg', style: { '--c': 'var(--violet)' }, onclick: () => { S.dark = !S.dark; dk.classList.toggle('on', S.dark); upd(); } }, icon('moon'), ' ダークモード');
          function upd() {
            const brand = `hsl(${S.hue} 85% ${S.dark ? 68 : 52}%)`;
            ui.style.setProperty('--brand', brand); ui.style.setProperty('--rad', S.rad + 'px'); ui.style.setProperty('--bgc', S.dark ? '#171a2c' : '#fff'); ui.style.setProperty('--fgc', S.dark ? '#eef0ff' : '#222');
            rows[0][1].textContent = S.hue + 'deg'; rows[1][1].textContent = S.rad + 'px';
            const lkEl = ui.querySelector('.lk'); if (lkEl) lkEl.style.color = S.mode === 'hard' ? '#5b9dff' : '';
            brandMsg.className = 'xb-stat ' + (S.mode === 'hard' ? 'bad' : 'ok');
            brandMsg.innerHTML = S.mode === 'hard' ? '<b>リンクだけ、昔の青のまま！</b> 4か所のうち1か所を直し忘れた。サイトが増えるほど、見つけにくくなる。' : '<b>1か所を直しただけで、全部そろって変わる。</b> 直し忘れが起きない。';
            if (S.mode === 'hard') { cd.replaceChildren(code(`.btn   { background: ${brand}; }\n.badge { color: ${brand}; }\n.box   { border: 2px solid ${brand}; }\n.link  { color: #5b9dff; }   /* ← 直し忘れ！ */`, 'css', { file: 'style.css', color: 'var(--bad)', hi: [4] })); return; }
            cd.replaceChildren(code(`:root {\n  --brand: ${brand};\n  --radius: ${S.rad}px;\n}${S.dark ? '\n.dark {\n  --bg: #171a2c;  /* ダーク用の値で上書き */\n}' : ''}\n.btn  { background: var(--brand);\n        border-radius: var(--radius); }\n.link { color: var(--brand); }\n.box  { border: 2px solid var(--brand); }`, 'css', { file: 'style.css', color: 'var(--pink)', hi: [2, 3] }));
          }
          el.append(h('div', { class: 'split xb-st fo4-top' }, h('div', null, lbl('ブランドカラーが変わった！'), modeSeg, ...rows.map((r) => r[0]), dk, h('div', { class: 'grow' }, cd)), h('div', null, lbl('プレビュー'), h('div', { class: 'grow', style: { display: 'grid', alignContent: 'center' } }, ui), brandMsg)));
          upd();
        },
      },
      {
        t: 'Sass(SCSS)：書き方 → CSS', tag: 'SASS', lead: 'ブラウザは SCSS を読めない。だから<b>CSS に変換（コンパイル）</b>して使う。左を書き換えると、右が変わる。',
        why: {pv: {"k": "code", "file": "style.css", "lang": "css", "text": ".nav ul li a { }\n.nav ul li a:hover { }\n.nav ul li a:focus { }", "err": [1, 2, 3], "keys": {"1": "nest"}}, iv: {"k": "code", "file": "style.scss", "lang": "scss", "text": ".nav {\n  a {\n    &:hover { }\n  }\n}", "idea": [2, 3], "keys": {"2": "nest"}}, av: {"k": "code", "file": "terminal", "lang": "sh", "text": "$ sass style.scss style.css\n.nav a { }\n.nav a:hover { }", "ok": [2, 3], "keys": {"2": "nest"}}, problem: "長いセレクタと同じ繰り返し", idea: "書きやすく書いて、CSS に変換", answer: "Sass：入れ子・変数 → コンパイル", "when": [["入れ子や mixin で整理したい", "Sass"], ["値の共有だけ", "CSS 変数で十分"], ["ビルド環境が無い", "素の CSS"]]},
        render(el) {
          const out = h('div', { class: 'grow' });
          const ed = K.W.codeEditor(SCSS.nest, 'css', run); ed.style.borderRadius = '14px'; ed.style.minHeight = '270px';
          function run(v) {
            let res; try { res = sass(v); } catch (e) { res = '/* ⚠ ' + e.message + ' */'; }
            const p = code(res || '/* ここに結果 */', 'css', { file: 'style.css (出力)', color: 'var(--ok)' }); p.style.height = '100%'; p.style.margin = 0; out.replaceChildren(p);
          }
          const seg = chips([['var', '変数 $'], ['nest', 'ネスト & &'], ['mixin', 'mixin']], 'nest', (k) => { ed.set(SCSS[k]); }, 'var(--pink)');
          el.append(h('div', { class: 'split xb-st fo4-top' }, h('div', null, lbl('SCSS（編集OK）'), seg, ed), h('div', null, lbl('コンパイル結果 CSS'), out)));
          run(SCSS.nest);
        },
      },
      {
        t: 'レスポンシブ：幅で変わる', tag: 'RESPONSIVE', lead: '料金プランのカードを、スマホでも読めるように。右端の<b>つまみをドラッグ</b>して幅を変えよう。幅に合わせて列の数が変わり、コードの該当行が光る。',
        why: {pv: {"k": "code", "file": "grid.css", "lang": "css", "text": ".grid {\n  display: flex; width: 1200px;\n}\n/* スマホ: 横にはみ出す */", "err": [2, 4], "keys": {"4": "mq"}}, iv: {"k": "code", "file": "grid.css", "lang": "css", "text": "@media (max-width: 600px) {\n  /* 600px 以下だけ適用 */\n}", "idea": [1], "keys": {"1": "mq"}}, av: {"k": "code", "file": "grid.css", "lang": "css", "text": "@media (max-width: 600px) {\n  .grid { width: auto }\n}", "ok": [1, 2], "keys": {"1": "mq"}}, problem: "PC 幅で作るとスマホではみ出す", idea: "幅によってルールを切り替える", answer: "<code>@media</code> と折り返し", "when": [["1方向に並べる", "Flex"], ["行と列の格子", "Grid"], ["幅で見た目を切り替える", "メディアクエリ"]]},
        hint: 'このデモは、<b>枠の幅</b>で切り替わる <code>@container</code> を使っている。ふつうは<b>画面の幅</b>で切り替わる <code>@media</code> を使う。書き方はほとんど同じ。',
        render(el, ctx) {
          const PLAN = [['相談 30分', '5,500円'], ['書類チェック', '11,000円'], ['継続サポート', '月 22,000円'], ['顧問契約', '月 33,000円'], ['セミナー', '無料']];
          const mk = (n) => h('div', { style: { '--c1': `hsl(${200 + n * 28} 85% 78%)` } }, h('b', PLAN[n - 1][0]), h('br'), PLAN[n - 1][1]);
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
          el.append(h('div', { class: 'split xb-st fo4-top' }, h('div', null, lbl('幅をドラッグ'), seg, h('div', { class: 'grow', style: { overflow: 'hidden' } }, outer), h('div', { style: { color: 'var(--mute)', fontSize: '.875rem' } }, '現在の幅：', wl)), h('div', null, lbl('CSS'), h('div', { class: 'grow' }, cdBox))));
          draw(); setTimeout(() => apply(Math.min(700, outer.parentElement.clientWidth - 4)), 30);
        },
      },
      {
        t: '動きと重なり', tag: 'transition · z-index', lead: 'カードにカーソルを乗せて動きを見よう。スライダーで CSS が変わる。右は重なり順（<b>z-index</b>）。押すと一番手前に来る。',
        why: {pv: {"k": "code", "file": "style.css", "lang": "css", "text": ".card:hover { top: -4px }\n/* いきなりガクッと動く */\n.modal { }\n/* 他の要素の下に隠れる */", "err": [2, 4], "keys": {"2": "tr", "4": "z"}}, iv: {"k": "code", "file": "style.css", "lang": "css", "text": "transition: .3s  → 0.3秒で変化\nz-index: 10      → 大きいほど前", "idea": [1, 2], "keys": {"1": "tr", "2": "z"}}, av: {"k": "code", "file": "style.css", "lang": "css", "text": ".card { transition: .3s }\n.modal { z-index: 10 }", "ok": [1, 2], "keys": {"1": "tr", "2": "z"}}, problem: "急に動く・他の要素に隠れる", idea: "短く滑らかに。重なりは数字で", answer: "transition と z-index", "when": [["ホバーなど軽い動き", "transition"], ["複雑な連続アニメ", "animation"], ["前後関係を決める", "z-index（position を指定した要素に）"]]},
        render(el) {
          const S = { d: .3, s: 1.08, r: -3, ty: -8, ease: 'ease' };
          const hv = h('div', { class: 'xb-hv' }, '相談カード：予約する'); const cd = h('div');
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
          const Z = [['header', 'var(--ts)', 10, 0, 0], ['modal', 'var(--pink)', 20, 50, 30], ['toast', 'var(--basic)', 30, 100, 10]];
          const zs = h('div', { class: 'xb-zs' }); const zc = h('div');
          const zb = Z.map(([n, c, z, l, t]) => { const b = h('button', { style: { background: c, left: l + 'px', top: t + 'px', zIndex: z }, onclick: () => { const mx = Math.max(...Z.map((q) => q[2])); if (z !== mx) { Z.find((q) => q[0] === n)[2] = mx + 10; zdraw(); } } }, h('span', { style: { font: '800 .85rem var(--mono)' } }, n, h('small', 'z-index:' + z))); return b; });
          zs.append(...zb);
          function zdraw() { Z.forEach((q, i) => { zb[i].style.zIndex = q[2]; zb[i].querySelector('small').textContent = 'z-index:' + q[2]; zb[i].animate([{ transform: 'scale(1.12)' }, { transform: 'none' }], { duration: 250 }); }); zc.replaceChildren(code(Z.map((q) => `.${q[0].toLowerCase()} { z-index: ${q[2]}; }`).join('\n'), 'css', { color: 'var(--pink)' })); }
          const c1 = h('div', { class: 'col' }, lbl('transition / transform'), hv, h('div', { class: 'row' }, demo, seg), ...sls.map((x) => x.box), cd);
          const c2 = h('div', { class: 'col' }, lbl('z-index：重なり順（押すと一番手前）'), zs, zc, h('div', { class: 'st-cap', html: '「モーダルがヘッダーの下に隠れた」は、数字の大小で直す。数字が大きいほど手前に出る。ふつうは <b>position を指定した要素</b>に効く（Flex / Grid の子は position なしでも効く）。' }));
          el.append(h('div', { class: 'split xb-st fo4-top' }, h('div', null, c1), h('div', null, c2)));
          upd(); zdraw();
        },
      },
      {
        t: 'はみ出しと高さをそろえる', tag: 'OVERFLOW', lead: '案件カードの一覧。題名が長いとはみ出す・高さと「詳しく」ボタンがバラバラ・画像の形がそろわない。3つのスイッチで<b>ひとつずつ直そう</b>。',
        why: {pv: {"k": "code", "file": "style.css", "lang": "css", "text": ".title { }\n/* 長い題名がカードからはみ出す */\n.card { }\n/* 高さもボタンの位置もバラバラ */", "err": [2, 4]}, iv: {"k": "code", "file": "style.css", "lang": "css", "text": ".title { -webkit-line-clamp: 2 }\n.list { display: grid }\n.thumb { aspect-ratio: 16 / 9 }", "idea": [1, 2, 3]}, av: {"k": "code", "file": "style.css", "lang": "css", "text": ".title { -webkit-line-clamp: 2; }\n.list { display: grid; }\n.thumb { aspect-ratio: 16 / 9; }", "ok": [1, 2, 3]}, problem: '案件カードの題名が長いとはみ出す。高さもボタンの位置もバラバラで、読みにくい', idea: '中身の長さに合わせず、<b>ルールで形をそろえる</b>（省略・格子・比率）', answer: 'line-clamp・grid・aspect-ratio'},
        hint: '<b>覚えるのは3つ</b><ul><li>長い文字：<code>-webkit-line-clamp</code> で行数を決めて省略（<code>overflow: hidden</code> とセット）</li><li>高さをそろえる：<code>display: grid</code>、ボタンは <code>margin-top: auto</code> で下に</li><li>画像の形：<code>aspect-ratio: 16 / 9</code></li></ul>',
        render(el) {
          const ON = { clamp: false, grid: false, ratio: false };
          const CARDS = [['【至急】取引先からの契約解除通知の内容確認と、今後の対応方針について', 'contract_termination_notice_final_v2.pdf', 50], ['離婚の相談', '養育費の取り決め', 100], ['相続手続きの進め方', '遺産分割協議書の書き方と、必要な書類を教えてください。', 70]];
          const frame = h('iframe', { style: { width: '100%', height: '360px', border: '1px solid var(--line)', borderRadius: '8px', background: '#fff' }, sandbox: '', title: '案件カードの一覧' });
          const cdBox = h('div'), sym = h('div', { class: 'xb-stat bad' }), sw = {};
          const BASE = '.list{display:flex;gap:10px;align-items:flex-start}.card{width:33%;border:2px solid #5b9dff;border-radius:8px;padding:8px;background:#fff;box-sizing:border-box}.thumb{height:var(--h);background:#cfe0ff;border-radius:6px;margin-bottom:6px}.title{margin:0 0 4px;font-size:14px}.body{font-size:12px;color:#556;margin:0}.btn{display:block;margin-top:8px;padding:5px;border-radius:6px;background:#5b9dff;color:#fff;text-align:center;font-size:12px}';
          const FIX = {
            clamp: ['/* 長い題名は2行で省略 */\n.title {\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n.body { overflow-wrap: anywhere; }', '.title{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.body{overflow-wrap:anywhere}'],
            grid: ['/* 高さをそろえ、ボタンを下に */\n.list { display: grid;\n  grid-template-columns: repeat(3, 1fr); }\n.card { display: flex; flex-direction: column; }\n.btn { margin-top: auto; }', '.list{display:grid;grid-template-columns:repeat(3,1fr);align-items:stretch}.card{width:auto;display:flex;flex-direction:column}.btn{margin-top:auto}'],
            ratio: ['/* 画像の形をそろえる */\n.thumb { height: auto;\n  aspect-ratio: 16 / 9; }', '.thumb{height:auto;aspect-ratio:16/9}'],
          };
          const NAME = { clamp: '長い題名がはみ出す', grid: '高さとボタンの位置がバラバラ', ratio: '画像の形がそろわない' };
          function draw() {
            const css = BASE + Object.keys(ON).filter((k) => ON[k]).map((k) => FIX[k][1]).join('');
            const html = CARDS.map(([t, b, hh]) => `<div class="card"><div class="thumb" style="--h:${hh}px"></div><h3 class="title">${t}</h3><p class="body">${b}</p><a class="btn">詳しく見る</a></div>`).join('');
            frame.srcdoc = `<style>body{font-family:sans-serif;margin:8px}${css}</style><div class="list">${html}</div>`;
            const on = Object.keys(ON).filter((k) => ON[k]);
            cdBox.replaceChildren(code(on.length ? on.map((k) => FIX[k][0]).join('\n\n') : '/* まだ何も直していない */', 'css', { file: 'style.css', color: on.length ? 'var(--ok)' : 'var(--bad)' }));
            const left = Object.keys(ON).filter((k) => !ON[k]);
            sym.className = 'xb-stat ' + (left.length ? 'bad' : 'ok');
            sym.innerHTML = left.length ? `<b>あと ${left.length} つ</b>：` + left.map((k) => NAME[k]).join(' / ') : '<b>全部直った！</b> 題名の長さや画像が変わっても、形がそろう。';
          }
          const tg = (k, label) => (sw[k] = h('button', { class: 'xb-sg', style: { '--c': 'var(--ok)' }, onclick: () => { ON[k] = !ON[k]; sw[k].classList.toggle('on', ON[k]); draw(); } }, label));
          el.append(h('div', { class: 'split xb-st fo4-top' },
            h('div', null, lbl('直すスイッチ'), h('div', { class: 'xb-seg' }, tg('clamp', '① 長い題名を省略'), tg('grid', '② 高さをそろえる'), tg('ratio', '③ 画像の比率')), sym, cdBox),
            h('div', null, lbl('案件カードの一覧（実際の見え方）'), frame)));
          draw();
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
          const CSS2 = CSS1.replace(':root {\n  --brand: #5b9dff;\n}', ':root {\n  --brand: #5b9dff;\n  --radius: 12px;\n}').replace('border: 0; padding: .5em 1.2em; border-radius: 6px; }', 'border: 0; padding: .5em 1.2em; border-radius: var(--radius); }').replace('.grid div { background: #eef3ff; padding: 12px; text-align: center; }', '.grid div { background: #eef3ff; padding: 12px; text-align: center; border-radius: var(--radius); }');
          el.append(playground({
            title: 'CSS', mode: 'web',
            files: [{ name: 'index.html', lang: 'html', code: HTML }, { name: 'style.css', lang: 'css', code: CSS0 }],
            solution: { 'style.css': CSS1 },
            tasks: (v, c) => {
              const d = c.doc && c.doc();
              const css = (v['style.css'] || '').replace(/\/\*[\s\S]*?\*\//g, '');
              return [
                { label: ':root に --brand の色を決める', ok: /:root\s*\{[^}]*--brand\s*:\s*[^;}\s][^;}]*/.test(css), hint: ['変数は <code>--名前: 値;</code> の形で、<code>:root { }</code> の中に書く。', '<code>--brand: #5b9dff;</code> を <code>:root</code> の中に入れる。'], answer: { code: CM1, lang: 'css', mode: 'replace' } },
                { label: '見出しとボタンの色を var(--brand) にする', ok: /h1\s*\{[^}]*var\(\s*--brand/.test(css) && /\.btn\s*\{[^}]*var\(\s*--brand/.test(css), hint: ['変数を使うときは <code>var(--名前)</code>。<code>#5b9dff</code> と書いてある所を置き換える。', '<code>h1 { color: var(--brand); }</code> と <code>.btn { background: var(--brand); … }</code>'], answer: { code: CM2, lang: 'css', mode: 'replace' } },
                { label: '幅が狭いとき（@media）、.grid を1列にする', ok: /@media[^{]*max-width[^{]*\{\s*\.grid\s*\{[^}]*grid-template-columns\s*:\s*(1fr|repeat\(\s*1\s*,\s*1fr\s*\)|100%|none)/.test(css), hint: ['「幅が 600px 以下のとき」は <code>@media (max-width: 600px) { … }</code>。', '中に <code>.grid { grid-template-columns: 1fr; }</code> を書く。'], answer: { code: CSS1, lang: 'css', mode: 'replace' } },
              { optional: true, level: 1, label: '「.dark」クラスのとき --brand が別の色になるようにする（ダークモード）', ok: (() => { const b = d && d.body; if (!b) return false; const before = getComputedStyle(b).getPropertyValue('--brand').trim(); b.classList.add('dark'); const after = getComputedStyle(b).getPropertyValue('--brand').trim(); b.classList.remove('dark'); return !!after && after !== before; })(), hint: ['変数は、あとから書いた <code>.dark { … }</code> の中で上書きできる。', '<code>.dark { --brand: #8ec5ff; }</code> を CSS の最後に足す。'], answer: { code: '.dark { --brand: #8ec5ff; }', lang: 'css', mode: 'append' } },
              { optional: true, level: 2, label: '角丸も変数にする。:root に --radius を決めて、.btn と「.grid div」の border-radius で使う', ok: /:root\s*\{[^}]*--radius\s*:\s*[^;}\s]/.test(css) && /\.btn\s*\{[^}]*border-radius\s*:\s*var\(\s*--radius/.test(css) && /\.grid\s+div\s*\{[^}]*border-radius\s*:\s*var\(\s*--radius/.test(css), hint: ['色と同じ要領で、<code>:root</code> に <code>--radius: 12px;</code> を決めて、使う所に <code>var(--radius)</code> と書く。', '<code>.btn</code> の <code>border-radius: 6px</code> を <code>var(--radius)</code> に。<code>.grid div</code> にも <code>border-radius: var(--radius);</code> を足す。'], answer: { code: CSS2, lang: 'css', mode: 'replace' } },
              { optional: true, level: 3, label: 'OS がダークモードのとき自動で暗くする。@media (prefers-color-scheme: dark) の中で、body の background と color を決める', ok: (() => { const re = /@media\s*\(\s*prefers-color-scheme\s*:\s*dark\s*\)\s*\{/g; let m; while ((m = re.exec(css))) { const i0 = m.index + m[0].length - 1; let dep = 0, j = i0; for (; j < css.length; j++) { if (css[j] === '{') dep++; else if (css[j] === '}') { dep--; if (!dep) break; } } const inner = css.slice(i0 + 1, j); if (/body\s*\{[^}]*background(-color)?\s*:\s*[^;}\s]/.test(inner) && /(^|[;{\s])color\s*:\s*[^;}\s]/.test(inner)) return true; } return false; })(), hint: ['「OS の設定がダーク」は <code>@media (prefers-color-scheme: dark) { … }</code> で書ける。', '中に <code>body { background: #14172b; color: #eef0ff; }</code> を書く。'], answer: { code: '@media (prefers-color-scheme: dark) {\n  body { background: #14172b; color: #eef0ff; }\n  h1 { color: var(--brand); }\n}', lang: 'css', mode: 'append' } },
              ];
            },
          }));
        },
      },
    ],
  });

  /* ================= x-a11y ================= */
  const SR = {
    div: [['text', 'ご相談受付', ''], ['text', 'ホーム', ''], ['text', '料金', ''], ['text', 'オンライン相談を予約', '見出しと分からない'], ['text', '予約する', 'ボタンと分からない'], ['text', '© ご相談受付', '']],
    sem: [['banner', 'ご相談受付', ''], ['navigation', '2個のリンク', ''], ['link', 'ホーム', ''], ['link', '料金', ''], ['main', '', ''], ['heading 1', 'オンライン相談を予約', ''], ['button', '予約する', ''], ['contentinfo', '© ご相談受付', '']],
  };
  const SRCODE = {
    div: '<div class="header">ご相談受付</div>\n<div class="nav">\n  <div>ホーム</div><div>料金</div>\n</div>\n<div class="main">\n  <div class="title">オンライン相談を予約</div>\n  <div class="btn">予約する</div>\n</div>\n<div class="footer">© ご相談受付</div>',
    sem: '<header>ご相談受付</header>\n<nav>\n  <a href="/">ホーム</a><a href="/price">料金</a>\n</nav>\n<main>\n  <h1>オンライン相談を予約</h1>\n  <button>予約する</button>\n</main>\n<footer>© ご相談受付</footer>',
  };
  function a11yPage() {
    return h('div', { class: 'xa-pg' }, h('div', { class: 'h' }, 'ご相談受付'), h('div', { class: 'n' }, h('span', 'ホーム'), h('span', '料金')), h('div', { class: 'm' }, h('div', { class: 't' }, 'オンライン相談を予約'), h('span', { class: 'b' }, '予約する')), h('div', { class: 'f' }, '© ご相談受付'));
  }
  const CB = { none: '', protan: 'url(#xa-p)', deutan: 'url(#xa-d)', tritan: 'url(#xa-t)', gray: 'grayscale(1)' };
  const lum = (hex) => { const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4))); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

  K.reg({
    id: 'x-a11y', track: 'extra', title: 'アクセシビリティ入門', sub: '誰にでも使えるWebへ', emoji: '🛡️',
    gh: [{ label: 'html/（HTMLサンプル）', path: 'html' }, { label: 'html/02_heading_tag.html', path: 'html/02_heading_tag.html' }],
    meta: { cat: 'basic', day: '1日目', when: 'HTML 実習の仕上げ（タグ選びの“なぜ”を伝える時）', mins: 10, order: 15, level: '応用', after: 'html', why: 'タグを意味で選ぶ理由が分かる。SEO・読み上げ・キーボード操作すべてに効く' },
    scenes: [
      {
        t: 'セマンティックHTML：読み上げ視点', tag: 'SEMANTIC', lead: '見た目が同じでも、<b>タグが違う</b>と、読み上げソフトの伝え方が変わる。「読み上げ」を押そう。',
        why: {pv: {"k": "code", "file": "index.html", "lang": "html", "text": "<div class=\"title\">見出し</div>\n<div onclick=\"\">送信</div>\n<!-- 読み上げ: 文字 文字 -->", "err": [1, 2], "keys": {"2": "tag"}}, iv: {"k": "code", "file": "読み上げ", "lang": "txt", "text": "div    → ただの枠（意味なし）\nh1     → 「見出し1」\nbutton → 「ボタン」Enter で押せる", "idea": [3], "keys": {"3": "tag"}}, av: {"k": "code", "file": "index.html", "lang": "html", "text": "<h1>見出し</h1>\n<button>送信</button>", "ok": [1, 2], "keys": {"2": "tag"}}, problem: "見た目は同じでも意味が伝わらない", idea: "意味はタグで伝える", answer: "<code>h1 nav button</code> など意味のあるタグ", "when": [["押すと動作する", "button"], ["別ページへ移動", "a"], ["見出し", "h1〜h6"], ["意味の無い枠", "div / span"]]},
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
          el.append(h('div', { class: 'split xb-st fo4-top' }, h('div', null, seg, cd), h('div', null, viewSeg, h('div', { class: 'grow' }, holder), play)));
          draw();
        },
      },
      {
        t: 'コントラストと色覚', tag: 'CONTRAST', lead: '色を選んで<b>コントラスト比</b>（文字と背景の明るさの差）を測る。通常の文字は 4.5 以上が目安。色の見え方の違いも試そう。',
        why: {pv: {"k": "code", "file": "style.css", "lang": "css", "text": ".text { color: #ccc }\n.bg   { background: #fff }\n/* コントラスト比 1.6 : 1 */", "err": [1, 3], "keys": {"3": "ratio"}}, iv: {"k": "code", "file": "チェック", "lang": "txt", "text": "文字 #767676 / 背景 #fff\n→ コントラスト比 4.5 : 1\n→ 通常の文字はここから OK", "idea": [2], "keys": {"2": "ratio"}}, av: {"k": "chips", "items": [{"i": "ruler", "t": "4.5:1 以上", "key": "ratio"}, "palette|色 + アイコン", "message-square|色 + 文言"]}, problem: "薄い文字が読めない", idea: "読みやすさは数字で確かめる", answer: "4.5:1 以上 + 色以外の手がかり", "when": [["通常の文字", "4.5:1 以上"], ["大きい文字", "3:1 以上"], ["状態の表示", "色 + アイコン + 文言"]]},
        render(el) {
          const S = { fg: '#7b86b8', bg: '#ffffff', cb: 'none' };
          const fg = h('input', { type: 'color', value: S.fg, oninput: (e) => { S.fg = e.target.value; upd(); } }), bg = h('input', { type: 'color', value: S.bg, oninput: (e) => { S.bg = e.target.value; upd(); } });
          [fg, bg].forEach((i) => Object.assign(i.style, { width: '56px', height: '38px', border: 0, background: 'none', cursor: 'pointer' }));
          const rt = h('div', { class: 'xa-ratio' }), badges = h('div', { class: 'row' }), sample = h('div', { style: { borderRadius: '8px', padding: '16px', transition: '.3s' } }, h('div', { style: { fontWeight: 900, fontSize: '1.25rem' } }, '初回相談は無料です'), h('div', { style: { fontSize: '1rem' } }, '受付は平日 10:00〜18:00。お電話でもご予約いただけます。'));
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
          el.append(defs, h('div', { class: 'split xb-st fo4-top' }, h('div', null, lbl('文字色 / 背景色'), h('div', { class: 'row' }, fg, '文字', bg, '背景'), prs, rt, badges), h('div', null, lbl('色覚シミュレーター'), cbSeg, h('div', { class: 'grow' }, wrapCB))));
          upd();
        },
      },
      {
        t: 'キーボードだけで操作', tag: 'KEYBOARD', lead: '予約フォームをキーボードだけで操作してみる。<kbd>Tab</kbd> で次へ、<kbd>Enter</kbd> で実行。<b>div で作ったボタン</b>には Tab で止まれず、予約が完了できない。切り替えて比べよう。',
        why: {pv: {"k": "code", "file": "index.html", "lang": "html", "text": "<div class=\"btn\" onclick=\"send()\">\n  送信\n</div>\n<!-- Tab を押しても届かない -->", "err": [1, 4], "keys": {"1": "btn"}}, iv: {"k": "code", "file": "Tab の動き", "lang": "txt", "text": "<button>  Tab で届く\n<a href>  Tab で届く\n          Enter / Space で押せる\n<div>     届かない", "idea": [1, 2], "keys": {"1": "btn"}}, av: {"k": "code", "file": "index.html", "lang": "html", "text": "<button onclick=\"send()\">\n  送信\n</button>", "ok": [1, 3], "keys": {"1": "btn"}}, problem: "マウス無しでは押せない", idea: "標準の部品は最初からキー対応", answer: "button / a を使う", "when": [["クリックできる要素", "button / a を使う"], ["div を使うしかない", "role・tabindex・キー操作を全部自前（非推奨）"]]},
        render(el) {
          let mode = 'div', idx = -1;
          const mk = () => {
            const bt = mode === 'div' ? h('div', { class: 'ctl', 'data-f': '0', style: { cursor: 'pointer' } }, '予約する (div)') : h('button', { class: 'ctl', 'data-f': '1' }, '予約する (button)');
            return [h('a', { class: 'ctl', href: '#', 'data-f': '1', onclick: (e) => e.preventDefault() }, 'ホーム'), h('input', { class: 'ctl', placeholder: 'お名前', 'data-f': '1' }), h('input', { class: 'ctl', placeholder: 'メールアドレス', 'data-f': '1' }), bt, h('a', { class: 'ctl', href: '#', 'data-f': '1', onclick: (e) => e.preventDefault() }, 'お問い合わせ')];
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
            const skipped = items.findIndex((x, i) => !x.f); if (mode === 'div' && fo[nx] > skipped && nx > 0 && fo[nx - 1] < skipped) { items[skipped].w.classList.add('vis'); log.innerHTML += '<br>⚠ <b>予約する (div)</b> を飛ばした！ キーボード利用者は予約できない'; } };
          const enter = () => { if (idx < 0) return; const it = items[idx]; log.innerHTML = it.n.tagName === 'INPUT' ? '入力欄：文字を入力できる' : `<b>${it.n.textContent}</b> を実行 ✓`; };
          const seg = chips([['div', '<div> で作った'], ['button', '<button> で作った']], 'div', (v) => { mode = v; build(); }, 'var(--pink)');
          const keys = h('div', { class: 'row' }, h('button', { class: 'btn', onclick: () => move(-1) }, 'Shift + Tab'), h('button', { class: 'btn primary', style: { '--c': 'var(--pink)' }, onclick: () => move(1) }, 'Tab ⇥'), h('button', { class: 'btn', onclick: enter }, 'Enter ⏎'));
          el.append(h('div', { class: 'split xb-st fo4-top' }, h('div', null, lbl('作り方を選ぶ'), seg, keys, log, code('<!-- ✖ Tab が届かない -->\n<div class="btn" onclick="send()">予約する</div>\n\n<!-- ✔ 標準で Tab・Enter・Space に対応 -->\n<button onclick="send()">予約する</button>', 'html', { color: 'var(--pink)', hi: [2, 5] })), h('div', null, lbl('操作してみる'), h('div', { class: 'grow', style: { display: 'flex' } }, box))));
          box.style.flex = '1'; box.style.alignContent = 'center';
          build();
        },
      },
      {
        t: 'アイコンボタンと代替テキスト', tag: 'ALT', lead: '虫めがねだけのボタンと、説明のないグラフ画像。見える人には分かるのに、<b>読み上げでは何か分からない</b>。切り替えて「読み上げ」を押そう。',
        why: {pv: {"k": "code", "file": "index.html", "lang": "html", "text": "<button><svg>…</svg></button>\n<img src=\"chart_final_v2.png\">\n<!-- 読み上げ: ボタン / image chart_final_v2.png -->", "err": [1, 2, 3]}, iv: {"k": "code", "file": "index.html", "lang": "html", "text": "<button aria-label=\"検索\">…</button>\n<img alt=\"4月120件 → 6月210件\">", "idea": [1, 2]}, av: {"k": "code", "file": "index.html", "lang": "html", "text": "<button aria-label=\"検索\">\n  <svg aria-hidden=\"true\">\n</button>\n<img alt=\"4月120→6月210件\">", "ok": [1, 4]}, problem: 'アイコンだけのボタンと、説明のないグラフは、読み上げで何なのか分からない', idea: '見えない人にも<b>名前（aria-label）と要点（alt）</b>を渡す', answer: 'aria-label と alt'},
        hint: '<b>アイコンだけのボタン</b>は <code>aria-label="検索"</code> で名前を付ける。<b>グラフや写真</b>は、見た目の説明ではなく<b>言いたい結論</b>を alt に書く。飾りだけの画像は <code>alt=""</code>（空）で読み飛ばす。',
        render(el, ctx) {
          let v = 'bad', t = 0;
          const SRA = {
            bad: [['button', '（名前がない）', '何のボタンか分からない'], ['button', '（名前がない）', '何のボタンか分からない'], ['button', '（名前がない）', '何のボタンか分からない'], ['image', 'chart_final_v2.png', '何のグラフか分からない']],
            good: [['button', '検索', ''], ['button', 'メニューを開く', ''], ['button', '閉じる', ''], ['image', '相談件数のグラフ。4月120件、5月160件、6月210件と増えている', '']],
          };
          const CODE = {
            bad: '<button><svg>…虫めがね…</svg></button>\n<button><svg>…三本線…</svg></button>\n<button><svg>…×…</svg></button>\n\n<img src="chart_final_v2.png">',
            good: '<button aria-label="検索"><svg aria-hidden="true">…</svg></button>\n<button aria-label="メニューを開く"><svg aria-hidden="true">…</svg></button>\n<button aria-label="閉じる"><svg aria-hidden="true">…</svg></button>\n\n<img src="chart.png"\n  alt="相談件数のグラフ。4月120件、5月160件、6月210件と増えている">',
          };
          const icb = (n) => h('button', { class: 'xb-ib', tabindex: '-1' }, icon(n, { size: '1.1rem' }));
          const bar = (x, hh, c) => `<rect x="${x}" y="${70 - hh}" width="26" height="${hh}" rx="3" fill="${c}"/>`;
          const chart = h('div', { class: 'xb-ch', html: `<svg viewBox="0 0 160 84" width="100%" height="84" role="img" aria-hidden="true">${bar(14, 30, '#9db8f2')}${bar(60, 40, '#6f98ee')}${bar(106, 58, '#2f6bea')}<text x="27" y="82" font-size="9" fill="#667" text-anchor="middle">4月</text><text x="73" y="82" font-size="9" fill="#667" text-anchor="middle">5月</text><text x="119" y="82" font-size="9" fill="#667" text-anchor="middle">6月</text></svg>` });
          const page = h('div', { class: 'xa-pg' }, h('div', { class: 'h', style: { display: 'flex', alignItems: 'center', gap: '8px' } }, 'ご相談受付', h('span', { style: { marginLeft: 'auto', display: 'flex', gap: '6px' } }, icb('search'), icb('menu'), icb('x'))), h('div', { class: 'm' }, h('div', { style: { fontWeight: 900, marginBottom: '6px' } }, '相談件数'), chart));
          const srBox = h('div', { class: 'xb-sr' }), cd = h('div');
          function draw() {
            cd.replaceChildren(code(CODE[v], 'html', { file: v === 'bad' ? '名前なし・altなし' : 'aria-label と alt あり', color: v === 'bad' ? 'var(--bad)' : 'var(--ok)', hi: v === 'bad' ? [1, 2, 3, 5] : [1, 2, 3, 5, 6] }));
            srBox.replaceChildren(...SRA[v].map(([role, txt, warn]) => h('div', null, h('b', role), h('span', txt), warn ? h('i', '⚠ ' + warn) : null)));
          }
          const play = h('button', { class: 'btn primary', onclick: async () => { const my = ++t; const rows = [...srBox.children]; for (const r of rows) { if (my !== t) return; rows.forEach((x) => x.classList.remove('on')); r.classList.add('on'); await new Promise((rs) => setTimeout(rs, 900)); } if (my === t) rows.forEach((x) => x.classList.remove('on')); } }, icon('volume-2'), ' 読み上げ');
          const seg = chips([['bad', 'アイコンだけ・alt なし'], ['good', 'aria-label と alt あり']], 'bad', (x) => { v = x; t++; draw(); }, 'var(--pink)');
          ctx.cleanups.push(() => t++);
          el.append(h('div', { class: 'split xb-st fo4-top' }, h('div', null, seg, cd), h('div', null, lbl('見た目（どちらも同じ）'), page, lbl('スクリーンリーダーの読み上げ'), srBox, h('div', { style: { marginTop: '10px' } }, play))));
          draw();
        },
      },
      quizScene('どれが正しい？', 'CHOOSE', '同じ見た目でも<b>伝わり方</b>が違う。正しい書き方を選ぼう。',
        { pv: {"k": "flow", "items": [{"i": "monitor", "t": "見た目だけ整える", "c": "bad"}, {"i": "user-x", "t": "使えない人が出る", "c": "bad"}]}, iv: {"k": "flow", "items": ["tag|意味", "contrast|コントラスト", "keyboard|操作"]}, av: {"k": "chips", "items": ["button / a", "4.5:1", "色 + アイコン"]}, problem: '見た目だけ整えると、使えない人が出る（ボタンに見えるが押せない、など）', idea: '「意味・色の読みやすさ・キー操作」の3つを確かめる。', answer: '意味のあるタグ、4.5:1 以上、色以外の手がかり', when: [['操作できる要素', 'button / a'], ['文字の色', 'コントラスト比を測る'], ['エラー表示', '色 + アイコン + 文言']] },
        [['「送信」ボタンを作る。正しいのは？', ['&lt;div onclick&gt;送信&lt;/div&gt;', '&lt;button&gt;送信&lt;/button&gt;', '&lt;span class="btn"&gt;送信&lt;/span&gt;'], 1, 'button はキーボード・読み上げ・フォーカスを最初から備えている。'],
          ['白背景に薄いグレー (#aaa) の文字を使いたい。どうする？', ['このまま使う', 'コントラスト比を測って 4.5:1 以上にする', '太字にすれば OK'], 1, '#aaa は約 2.3:1 で不足。測れば分かる。'],
          ['入力エラーを赤い枠だけで表示している。改善は？', ['もっと濃い赤にする', 'アイコンと「入力が必要です」の文言を足す', '点滅させる'], 1, '色が見分けにくい人にも伝わるよう、文言とアイコンを併用する。']]),
      {
        t: '実践：アクセシブルに直そう', tag: 'PRACTICE', lead: 'div で作った見出しとボタンを、<b>意味のあるタグ</b>に直そう。画像には説明も付ける。（約5分）',
        hint: '<b>もっとやりたい人へ</b><ul><li>リンクの一覧は <code>&lt;nav&gt;</code> の中に <code>&lt;ul&gt;&lt;li&gt;&lt;a&gt;</code> で書いてみよう。</li></ul>',
        render(el) {
          const H0 = '<header>My Shop</header>\n<nav><a href="#">ホーム</a></nav>\n<main>\n  <div class="title">春のセール</div>          <!-- ① h1 にしよう -->\n  <img src="logo.png">                         <!-- ② alt で画像の説明を付けよう -->\n  <div class="btn" onclick="alert(\'登録\')">登録する</div>   <!-- ③ button にしよう -->\n  <p class="note" style="color:#aaa">5,000円以上で送料無料</p>\n</main>\n';
          const HA1 = H0.replace('<div class="title">春のセール</div>          <!-- ① h1 にしよう -->', '<h1>春のセール</h1>');
          const HA2 = HA1.replace('<img src="logo.png">                         <!-- ② alt で画像の説明を付けよう -->', '<img src="logo.png" alt="My Shop のロゴ（桜の花びらのマーク）">');
          const H1 = '<header>My Shop</header>\n<nav><a href="#">ホーム</a></nav>\n<main>\n  <h1>春のセール</h1>\n  <img src="logo.png" alt="My Shop のロゴ（桜の花びらのマーク）">\n  <button type="button" onclick="alert(\'登録\')">登録する</button>\n  <p class="note" style="color:#555">5,000円以上で送料無料</p>\n</main>\n';
          const H2 = H1.replace('<nav><a href="#">ホーム</a></nav>', '<nav>\n  <ul>\n    <li><a href="#">ホーム</a></li>\n    <li><a href="#">商品</a></li>\n  </ul>\n</nav>');
          el.append(playground({
            title: 'a11y', mode: 'web',
            files: [{ name: 'index.html', lang: 'html', code: H0 }],
            solution: H1,
            tasks: (v, c) => {
              const d = c.doc && c.doc(); const q = (s) => (d ? d.querySelectorAll(s).length : 0);
              return [
                { label: '「春のセール」を h1 タグにする', ok: q('h1') >= 1, hint: ['「見出し」を表すタグは <code>h1</code>〜<code>h6</code>。いちばん大きい見出しは <code>h1</code>。', '<code>&lt;div class="title"&gt;</code> を <code>&lt;h1&gt;</code> に、閉じタグも <code>&lt;/h1&gt;</code> にする。'], answer: { code: HA1, lang: 'html', mode: 'replace' } },
                { label: '画像に alt（説明の文）を付ける', ok: !!d && [...d.querySelectorAll('img')].some((i) => (i.getAttribute('alt') || '').trim().length > 1), hint: ['画像が見えない人には、<code>alt</code> の文が読み上げられる。', '<code>&lt;img src="logo.png" alt="ここに説明"&gt;</code> のように書く。'], answer: { code: HA2, lang: 'html', mode: 'replace' } },
                { label: '「登録する」を button タグにする', ok: q('button') >= 1 && q('div[onclick]') === 0, hint: ['押すと動くものは <code>button</code>。<code>div</code> のままだと、キーボードで押せない。', '<code>&lt;div class="btn" onclick=…&gt;</code> を <code>&lt;button onclick=…&gt;</code> に。閉じタグも直す。'], answer: { code: H1, lang: 'html', mode: 'replace' } },
                { optional: true, level: 1, label: 'ナビのリンクを、nav の中の ul / li のリストにして、リンクを2つ以上にする', ok: !!d && d.querySelectorAll('nav ul > li > a').length >= 2, hint: ['リンクの「一覧」は、リスト（<code>ul</code> と <code>li</code>）で書くと、読み上げで「リスト 2項目」と伝わる。', '<code>&lt;nav&gt;&lt;ul&gt;&lt;li&gt;&lt;a href="#"&gt;ホーム&lt;/a&gt;&lt;/li&gt;&lt;li&gt;&lt;a href="#"&gt;商品&lt;/a&gt;&lt;/li&gt;&lt;/ul&gt;&lt;/nav&gt;</code> の形にする。'], answer: { code: H2, lang: 'html', mode: 'replace' } },
                { optional: true, level: 2, label: '検索フォームを足す。入力欄に label を結びつけ、補足の説明（aria-describedby）も付ける', ok: !!d && [...d.querySelectorAll('input[id]')].some((i) => { const lab = d.querySelector('label[for="' + i.id + '"]'); const ds = (i.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean); return !!lab && lab.textContent.trim().length > 0 && ds.some((id) => { const e = d.getElementById(id); return !!e && e.textContent.trim().length > 0; }); }), hint: ['入力欄には、見える文字のラベルが要る。<code>&lt;label for="x"&gt;</code> と、入力欄の <code>id="x"</code> を同じにして結びつける。', '補足の説明は、別の要素に <code>id</code> を付けて、入力欄に <code>aria-describedby="その id"</code> と書く。HTML の最後に足せばよい。'], answer: { code: '<form>\n  <label for="email">メールアドレス</label>\n  <input id="email" type="email" required aria-describedby="email-help">\n  <small id="email-help">半角で入力してください</small>\n</form>\n', lang: 'html', mode: 'append' } },
              ];
            },
          }));
        },
      },
    ],
  });
})();
