/* Lessons: cuivim (CUI・Vim) / git / css  — track basic */
(function () {
  'use strict';
  const K = window.KENSHU, { h, code, stepper, playground, quiz, lbl, style, esc, celebrate, icon } = K.W;
  const BASIC = 'var(--basic)', TS = 'var(--ts)', PINK = 'var(--pink)', TEAM = 'var(--team)', VIO = 'var(--violet)', VUE = 'var(--vue)';

  style('cg', `
  .cg-term{background:var(--code);border:1px solid var(--line);border-radius:8px;font:.875rem/1.6 var(--mono);color:#d8dcff;display:flex;flex-direction:column;height:330px;box-shadow:var(--shadow)}
  .cg-term .hd{display:flex;gap:6px;padding:8px 12px;border-bottom:1px solid rgba(255,255,255,.08)}
  .cg-term .hd i{width:10px;height:10px;border-radius:50%;background:#ff5f57}.cg-term .hd i:nth-child(2){background:#febc2e}.cg-term .hd i:nth-child(3){background:#28c840}
  .cg-out{flex:1;overflow:auto;padding:10px 14px;white-space:pre-wrap;word-break:break-all}
  .cg-out .cmd{color:#9be58b}.cg-out .err{color:#ff8f9a}.cg-out .dir{color:#7fd8ff;font-weight:700}.cg-out mark{background:#ffb45466;color:#fff;border-radius:3px}
  .cg-line{display:flex;gap:8px;padding:8px 14px;border-top:1px solid rgba(255,255,255,.08)}
  .cg-line span{color:#9be58b;white-space:nowrap}.cg-line input{flex:1;background:transparent;border:0;outline:0;color:#fff;font:inherit;min-width:0}
  .cg-tree{font:.875rem/1.5 var(--mono);background:var(--card);border:1px solid var(--line);border-radius:8px;padding:12px 14px;min-height:150px}
  .cg-tree ul{list-style:none;padding-left:18px;margin:0;border-left:1px dashed var(--line)}.cg-tree>ul{border:0;padding:0}
  .cg-tree li{padding:1px 0}.cg-tree .nm{padding:0 .4em;border-radius:6px}
  .cg-tree .cwd>.nm{background:color-mix(in srgb,var(--basic) 30%,transparent);outline:1px solid var(--basic)}
  .cg-tree .nw>.nm{animation:cgflash 1.3s}
  @keyframes cgflash{0%{background:var(--pink);transform:scale(1.4)}100%{background:transparent;transform:none}}
  .cg-chip{all:unset;cursor:pointer;font:700 .75rem var(--mono);padding:.25em .8em;border-radius:6px;border:1px solid var(--line);background:var(--card);transition:.2s}
  .cg-chip:hover{background:var(--basic);color:#06101f;transform:translateY(-2px)}
  .cg-vim{position:relative;background:var(--code);border:2px solid var(--line);border-radius:8px;font:.875rem/1.7 var(--mono);color:#d8dcff;outline:0;transition:.2s;overflow:hidden}
  .cg-vim:focus{border-color:var(--ts);box-shadow:0 0 0 4px color-mix(in srgb,var(--ts) 25%,transparent)}
  .cg-vim .bd{padding:10px 0;min-height:140px}.cg-vim .vl{padding:0 14px;white-space:pre;display:flex}.cg-vim .vl b{color:#5a6390;width:2.2em;font-weight:400;flex:none}
  .cg-vim .cur{background:#fff;color:#000;animation:cgblink 1s steps(2) infinite}.cg-vim.ins .cur{background:transparent;color:inherit;box-shadow:-2px 0 0 var(--basic);animation:none}
  @keyframes cgblink{50%{opacity:.55}}
  .cg-vim .st{display:flex;gap:10px;padding:4px 14px;font-weight:700;background:#1b2147;font-size:.75rem}
  .cg-vim .st .md{padding:0 .8em;border-radius:6px;background:var(--ts);color:#fff}.cg-vim.ins .st .md{background:var(--basic);color:#06101f}.cg-vim.cmd .st .md{background:var(--team);color:#06101f}
  .cg-vim .ov{position:absolute;inset:0;display:grid;place-items:center;background:rgba(8,11,23,.7);font:700 1rem var(--font);transition:.3s;pointer-events:none}.cg-vim:focus .ov{opacity:0}
  .cg-fsm text{font:800 14px var(--mono);fill:#fff;text-anchor:middle}.cg-fsm .lb{font:700 12px var(--mono);fill:var(--mute)}
  .cg-fsm .nd rect{fill:var(--card2);stroke:var(--line);stroke-width:2;transition:.3s}.cg-fsm .nd.on rect{stroke:var(--c);fill:color-mix(in srgb,var(--c) 35%,var(--bg2));filter:drop-shadow(0 0 10px var(--c))}
  .cg-fsm .nd text{fill:var(--text)}
  .cg-fsm path{fill:none;stroke:var(--line);stroke-width:2;transition:.3s}.cg-fsm path.on{stroke:var(--pink);stroke-width:4;stroke-dasharray:8 6;animation:cgdash .5s linear infinite}
  @keyframes cgdash{to{stroke-dashoffset:-14}}
  .cg-keys{display:flex;flex-wrap:wrap;gap:6px}.cg-keys button{all:unset;cursor:pointer;font:700 .75rem var(--mono);padding:.3em .7em;border-radius:6px;background:var(--card2);border:1px solid var(--line);border-bottom-width:3px;transition:.15s}
  .cg-keys button:active,.cg-keys button.hit{background:var(--ts);color:#fff;transform:translateY(2px)}
  .cg-zones{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
  .cg-zone{border:2px dashed var(--zc);border-radius:8px;padding:8px;min-height:190px;background:color-mix(in srgb,var(--zc) 8%,transparent);display:flex;flex-direction:column;gap:6px}
  .cg-zone h4{font-size:.875rem;color:var(--zc);text-align:center}.cg-zone h4 small{display:block;color:var(--mute);font-weight:500;font-size:.68rem}
  .cg-file{font:700 .75rem var(--mono);padding:.35em .6em;border-radius:6px;background:var(--zc2,var(--ts));color:#06101f;box-shadow:0 6px 14px -8px #000;display:flex;gap:.4em;align-items:center}
  .cg-file.cm{background:var(--card2);color:var(--text);border:2px solid var(--zc2,var(--ts))}
  .cg-cmd{font:700 .875rem var(--mono);background:var(--code);color:#9be58b;border-radius:8px;padding:.6em 1em;margin-bottom:10px;min-height:2.6em}
  .cg-svgwrap{overflow:auto;background:var(--card);border:1px solid var(--line);border-radius:8px}
  .cg-svgwrap svg text{font:700 11px var(--mono);fill:#fff}
  .cg-svgwrap .pill{cursor:pointer}.cg-svgwrap .pill rect{transition:.2s}.cg-svgwrap .pill:hover rect{filter:brightness(1.3)}
  .cg-svgwrap .nw{animation:cgpop .6s both;transform-box:fill-box;transform-origin:center}
  @keyframes cgpop{from{transform:scale(0)}60%{transform:scale(1.3)}}
  .cg-svgwrap line,.cg-svgwrap path.ed{stroke:var(--mute);stroke-width:3;fill:none}
  .cg-ctl{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:10px}
  .cg-ctl input,.cg-ctl select{font:inherit;font-size:.875rem;padding:.35em .7em;border-radius:6px;border:1px solid var(--line);background:var(--bg2);color:var(--text)}
  .cg-cf{font:.875rem/1.8 var(--mono);background:var(--code);border-radius:8px;padding:12px 0;color:#d8dcff;overflow:hidden}
  .cg-cf .r{padding:0 16px;max-height:3em;overflow:hidden;transition:max-height .6s,opacity .5s,padding .5s;white-space:pre}
  .cg-cf .r.mk{color:#8e97c4;background:rgba(255,255,255,.05)}.cg-cf .r.me{background:color-mix(in srgb,var(--basic) 22%,transparent);cursor:pointer}.cg-cf .r.th{background:color-mix(in srgb,var(--ts) 25%,transparent);cursor:pointer}
  .cg-cf .r.me:hover,.cg-cf .r.th:hover{filter:brightness(1.4)}.cg-cf .r.gone{max-height:0;opacity:0;padding:0}
  .cg-ssh{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:12% ;min-height:200px}
  .cg-ssh .bx{border:2px solid var(--line);border-radius:10px;padding:12px;background:var(--card);text-align:center;transition:.4s}
  .cg-ssh .bx.ok{border-color:var(--ok);box-shadow:0 0 30px -8px var(--ok)}.cg-ssh .bx big{font-size:2.2rem;display:block}
  .cg-ssh .bx .tag{display:inline-flex;align-items:center;gap:.4em;margin-top:10px;padding:.3em .9em;border-radius:6px;font-weight:800;font-size:.875rem;background:var(--card2);border:1px solid var(--line);transition:opacity .5s}
  .cg-ssh .k{position:absolute;top:96px;font-size:2rem;transition:left .9s cubic-bezier(.4,.1,.2,1),opacity .5s,top .5s;opacity:0}
  .cg-seq{display:flex;flex-wrap:wrap;gap:8px;min-height:46px;padding:8px;border:2px dashed var(--line);border-radius:8px;margin:8px 0}
  .cg-seq .cg-chip{background:color-mix(in srgb,var(--basic) 25%,transparent)}
  .cg-page{background:#fff;color:#222;border-radius:8px;padding:14px;font-family:var(--font);min-height:120px}
  .cg-tabs{display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap}.cg-tabs button{all:unset;cursor:pointer;padding:.35em 1em;border-radius:6px;border:1px solid var(--line);font-weight:800;font-size:.875rem;transition:.2s}
  .cg-tabs button.on{background:var(--basic);color:#06101f;border-color:var(--basic)}
  .cg-meter{height:10px;border-radius:6px;background:var(--line);overflow:hidden}.cg-meter i{display:block;height:100%;background:linear-gradient(90deg,var(--pink),var(--team),var(--basic));transition:width .6s}
  .cg-pk{display:inline-block;animation:cgfly 1s ease-in-out infinite}@keyframes cgfly{50%{transform:translateX(30px)}}
  .cg-sg .page{background:#fff;color:#222;border-radius:8px;padding:16px;font-family:var(--font);line-height:1.8}
  .cg-sg .page *{transition:outline-color .2s,background .2s}
  .cg-sg .page .hit{outline:3px solid var(--pink);outline-offset:2px;background:#fff0f6;border-radius:4px}
  .cg-sg .page .pick{cursor:pointer}
  .cg-rules{display:grid;gap:6px}.cg-rule{all:unset;cursor:pointer;display:grid;grid-template-columns:auto 1fr 70px;gap:10px;align-items:center;padding:.4em .8em;border-radius:8px;border:1px solid var(--line);background:var(--card);font:700 .875rem var(--mono);transition:.2s}
  .cg-rule:hover{background:var(--card2)}.cg-rule.on{border-color:var(--pink);background:color-mix(in srgb,var(--pink) 14%,var(--card))}.cg-rule.win{box-shadow:0 0 0 2px var(--team)}
  .cg-rule .sp{height:8px;border-radius:6px;background:var(--line);overflow:hidden}.cg-rule .sp i{display:block;height:100%;background:var(--ts);transition:width .5s}
  .cg-box{display:grid;place-items:center;padding:18px;background:var(--card);border:1px solid var(--line);border-radius:8px;min-height:360px;overflow:auto}
  .cg-box .lay{position:relative;display:flow-root}
  .cg-box .lay span.tg{position:absolute;font:700 .62rem var(--mono);top:1px;left:4px;opacity:.9}
  .cg-sl{display:grid;grid-template-columns:90px 1fr 50px;gap:10px;align-items:center;font:700 .875rem var(--mono)}.cg-sl input{accent-color:var(--c)}
  .cg-seg{display:flex;flex-wrap:wrap;gap:4px}.cg-seg button{all:unset;cursor:pointer;font:700 .75rem var(--mono);padding:.25em .65em;border-radius:6px;background:var(--card);border:1px solid var(--line);transition:.15s}.cg-seg button.on{background:var(--ts);color:#fff;border-color:var(--ts)}
  .cg-fx{display:flex;min-height:240px;background:repeating-linear-gradient(45deg,var(--card),var(--card) 8px,transparent 8px,transparent 16px);border:2px dashed var(--ts);border-radius:8px;padding:8px;transition:.3s}
  .cg-fx>div{min-width:44px;min-height:44px;border-radius:8px;display:grid;place-items:center;font:900 1rem var(--mono);color:#06101f;transition:all .45s cubic-bezier(.3,1.2,.4,1)}
  .cg-pos{position:relative;background:#fff;border-radius:8px;min-height:330px;padding:18px;color:#222;overflow:hidden;border:1px solid var(--line)}
  .cg-pos .par{border:2px dashed #8a8fb4;border-radius:8px;padding:14px;min-height:230px;margin-top:14px;position:relative}
  .cg-pos .par::before{content:attr(data-l);position:absolute;top:-1.1em;left:8px;font:700 .68rem var(--mono);color:#8a8fb4;background:#fff;padding:0 .4em}
  .cg-pos .b{width:96px;height:52px;border-radius:8px;display:grid;place-items:center;font:900 1rem var(--mono);color:#fff;margin-bottom:10px;transition:all .4s}
  .cg-pos .ghost{position:absolute;border:2px dashed #ff6b9d;border-radius:8px;pointer-events:none;transition:.3s}
  `);

  const btn = (t, f, c = '') => h('button', { class: 'btn ' + c, onclick: f }, t);
  const taskBox = () => h('div', { class: 'tasks', style: { borderRadius: '8px', border: '1px solid var(--line)', marginTop: '12px' } });
  function drawTasks(box, list, state) {
    const row = (t) => h('div', { class: 'task' + (t.ok ? ' ok' : '') + (t.optional ? ' opt' : '') }, h('i', t.ok ? '✓' : ''), h('span', { class: 'task-l' }, t.label), K.W.hintButton(t, {}));
    const req = list.filter((t) => !t.optional), opt = list.filter((t) => t.optional);
    box.replaceChildren(...req.map(row), ...(opt.length ? [h('div', { class: 'mission-opt-head' }, h('span', { class: 'opt-badge' }, '任意'), h('b', 'チャレンジ'), h('small', 'もっと挑戦したい人だけ。やらなくても OK')), ...opt.map(row)] : []));
    if (req.length && req.every((t) => t.ok) && !state.done) { state.done = true; celebrate(); }
  }
  function slider(label, min, max, val, unit, onchange, c) {
    const out = h('span', val + unit);
    const inp = h('input', { type: 'range', min, max, value: val, oninput: (e) => { out.textContent = e.target.value + unit; onchange(+e.target.value); } });
    return h('div', { class: 'cg-sl', style: { '--c': c || TS } }, h('span', label), inp, out);
  }
  function seg(opts, val, onpick) {
    const d = h('div', { class: 'cg-seg' });
    const draw = (v) => d.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.v === v));
    opts.forEach((o) => d.append(h('button', { 'data-v': o, onclick: () => { draw(o); onpick(o); } }, o)));
    draw(val);
    return d;
  }

  /* ============================================================
     CUI simulator
  ============================================================ */
  function makeTerm(onChange) {
    const fs = { t: 'd', c: { docs: { t: 'd', c: { 'memo.txt': { t: 'f', v: 'apple\nbanana\nApple pie\ngrape\n' } } }, 'sample.txt': { t: 'f', v: 'hello\nworld\n' } } };
    let cwd = [];
    const hist = [], ran = [];
    let hi = 0;
    const out = h('div', { class: 'cg-out' });
    const prompt = h('span');
    const input = h('input', { spellcheck: 'false', autocomplete: 'off', autocapitalize: 'off', placeholder: 'コマンドを入力…' });
    const el = h('div', { class: 'cg-term', onclick: () => input.focus() }, h('div', { class: 'hd' }, h('i'), h('i'), h('i')), out, h('div', { class: 'cg-line' }, prompt, input));
    const tree = h('div', { class: 'cg-tree' });
    const fresh = new Set();
    const nodeAt = (parts) => { let n = fs; for (const p of parts) { if (!n || n.t !== 'd') return null; n = n.c[p]; } return n || null; };
    const norm = (p) => {
      const parts = p.startsWith('/') || p.startsWith('~') ? [] : cwd.slice();
      for (const s of p.replace(/^~/, '').split('/').filter(Boolean)) { if (s === '.') continue; if (s === '..') parts.pop(); else parts.push(s); }
      return parts;
    };
    const get = (p) => nodeAt(norm(p));
    const split = (p) => { const parts = norm(p); const name = parts.pop(); return { dir: nodeAt(parts), name }; };
    const path = () => '~' + (cwd.length ? '/' + cwd.join('/') : '');
    const say = (html, cls) => { out.append(h('div', { class: cls || null, html })); out.scrollTop = out.scrollHeight; };
    const GL = [['No such file or directory', 'そんなファイル／フォルダは無い'], ['File exists', 'もう同じ名前がある'], ['Is a directory', 'フォルダなので不可'], ['is a directory', 'フォルダ。消すなら -r'], ['not a directory', 'フォルダではない'], ['command not found', 'そんなコマンドは無い'], ['no such file or directory', 'そんなファイル／フォルダは無い']];
    const err = (t) => { const g = GL.find(([k]) => t.includes(k)); say(esc(t) + (g ? ' <span style="opacity:.65">← ' + g[1] + '</span>' : ''), 'err'); };
    function drawTree() {
      const rec = (n, parts) => h('ul', Object.entries(n.c).sort((a, b) => (a[1].t === b[1].t ? a[0].localeCompare(b[0]) : a[1].t === 'd' ? -1 : 1)).map(([k, v]) => {
        const cur = v.t === 'd' && parts.concat(k).join('/') === cwd.join('/');
        return h('li', { class: (cur ? 'cwd ' : '') + (fresh.has(v) ? 'nw' : '') }, h('span', { class: 'nm' }, (v.t === 'd' ? '📁 ' : '📄 ') + k), v.t === 'd' ? rec(v, parts.concat(k)) : null);
      }));
      tree.replaceChildren(h('div', { class: cwd.length ? '' : 'cwd' }, h('span', { class: 'nm' }, '🏠 ~ (ホーム)')), rec(fs, []));
      fresh.clear();
    }
    function refresh() { prompt.textContent = 'kenshu@pc ' + path() + ' $'; drawTree(); onChange && onChange(api); }
    function exec(line) {
      const raw = line.match(/"[^"]*"|'[^']*'|>>|>|[^\s>]+/g) || [];
      let redir = null, args = [];
      for (let i = 0; i < raw.length; i++) {
        if (raw[i] === '>' || raw[i] === '>>') { redir = { mode: raw[i], file: (raw[i + 1] || '').replace(/^["']|["']$/g, '') }; break; }
        args.push(raw[i].replace(/^["']|["']$/g, ''));
      }
      const cmd = args.shift();
      if (!cmd) return;
      const flags = args.filter((a) => /^-\w+/.test(a)).join('');
      const a = args.filter((x) => !/^-\w+/.test(x));
      ran.push({ cmd, args: a, flags, line });
      switch (cmd) {
        case 'pwd': return say('/Users/kenshu' + (cwd.length ? '/' + cwd.join('/') : ''));
        case 'ls': {
          const d = a[0] ? get(a[0]) : nodeAt(cwd);
          if (!d) return err(`ls: ${a[0]}: No such file or directory`);
          if (d.t === 'f') return say(esc(a[0]));
          const names = Object.entries(d.c).map(([k, v]) => (v.t === 'd' ? `<span class="dir">${esc(k)}</span>` : esc(k)));
          return say(flags.includes('l') ? Object.entries(d.c).map(([k, v]) => `${v.t === 'd' ? 'drwxr-xr-x' : '-rw-r--r--'}  ${v.t === 'd' ? '<span class="dir">' + esc(k) + '</span>' : esc(k) + '  (' + v.v.length + 'B)'}`).join('\n') || '(空)' : names.join('  ') || '(空)');
        }
        case 'cd': {
          if (!a[0]) { cwd = []; return; }
          const p = norm(a[0]), n = nodeAt(p);
          if (!n) return err(`cd: no such file or directory: ${a[0]}`);
          if (n.t !== 'd') return err(`cd: not a directory: ${a[0]}`);
          cwd = p; return;
        }
        case 'mkdir': {
          if (!a[0]) return err('usage: mkdir [-p] directory ...');
          for (const x of a) {
            if (flags.includes('p')) { let n = nodeAt(x.startsWith('/') ? [] : cwd); for (const part of x.split('/').filter(Boolean)) { if (n.c[part] === undefined) fresh.add((n.c[part] = { t: 'd', c: {} })); n = n.c[part]; if (n.t !== 'd') break; } continue; }
            const { dir, name } = split(x);
            if (!dir || dir.t !== 'd') return err(`mkdir: ${x.split('/')[0]}: No such file or directory`);
            if (dir.c[name]) { err(`mkdir: ${x}: File exists`); continue; }
            fresh.add((dir.c[name] = { t: 'd', c: {} }));
          }
          return;
        }
        case 'touch': {
          for (const x of a) { const { dir, name } = split(x); if (!dir || dir.t !== 'd') return err(`touch: ${x}: No such file or directory`); if (!dir.c[name]) fresh.add((dir.c[name] = { t: 'f', v: '' })); }
          return;
        }
        case 'cat': {
          if (!a[0]) return say('（本物は入力待ちになります。Ctrl+C で止める）', 'err');
          const n = get(a[0]);
          if (!n) return err(`cat: ${a[0]}: No such file or directory`);
          if (n.t === 'd') return err(`cat: ${a[0]}: Is a directory`);
          return say(esc(n.v.replace(/\n$/, '')) || '(空)');
        }
        case 'echo': {
          const text = args.join(' ');
          if (!redir) return say(esc(text));
          const { dir, name } = split(redir.file);
          if (!dir || dir.t !== 'd' || !name) return err('echo: 書き込み先が不正です');
          if (!dir.c[name]) fresh.add((dir.c[name] = { t: 'f', v: '' }));
          if (dir.c[name].t === 'd') return err('echo: ディレクトリには書けません');
          dir.c[name].v = (redir.mode === '>>' ? dir.c[name].v : '') + text + '\n';
          return;
        }
        case 'rm': {
          if (!a[0]) return err('usage: rm [-f | -i] [-dIPRrvWx] file ...');
          const { dir, name } = split(a[0]);
          const n = dir && dir.c && dir.c[name];
          if (!n) return err(`rm: ${a[0]}: No such file or directory`);
          if (n.t === 'd' && !flags.includes('r')) return err(`rm: ${a[0]}: is a directory`);
          delete dir.c[name]; return;
        }
        case 'cp': case 'mv': {
          if (a.length < 2) return err(`usage: ${cmd} source target`);
          const s = get(a[0]); if (!s) return err(cmd === 'mv' ? `mv: rename ${a[0]} to ${a[1]}: No such file or directory` : `cp: ${a[0]}: No such file or directory`);
          if (cmd === 'cp' && s.t === 'd') return err(`cp: ${a[0]} is a directory (not copied).`);
          let { dir, name } = split(a[1]);
          const t = get(a[1]);
          if (t && t.t === 'd') { dir = t; name = norm(a[0]).pop(); }
          if (!dir || dir.t !== 'd') return err(`${cmd}: ${a[1]}: No such file or directory`);
          const copy = cmd === 'cp' ? { t: 'f', v: s.v } : s;
          if (cmd === 'mv') { const sp = split(a[0]); delete sp.dir.c[sp.name]; }
          dir.c[name] = copy; fresh.add(copy); return;
        }
        case 'grep': {
          if (a.length < 2) return err('usage: grep [-i] [-n] pattern file');
          const n = get(a[1]);
          if (!n) return err(`grep: ${a[1]}: No such file or directory`);
          if (n.t !== 'f') return err(`grep: ${a[1]}: Is a directory`);
          const ic = flags.includes('i'), rx = new RegExp(a[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), ic ? 'gi' : 'g');
          const hits = n.v.split('\n').map((l, i) => [l, i + 1]).filter(([l]) => l && (rx.lastIndex = 0, rx.test(l)));
          if (!hits.length) return say('<span style="opacity:.65">（何も表示されない ＝ 一致なし）</span>');
          ran[ran.length - 1].hits = hits.length;
          return say(hits.map(([l, i]) => (flags.includes('n') ? `<span class="dir">${i}</span>:` : '') + esc(l).replace(new RegExp(esc(a[0]).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), ic ? 'gi' : 'g'), (m) => `<mark>${m}</mark>`)).join('\n'));
        }
        case 'clear': out.replaceChildren(); return;
        case 'history': return say(hist.map((x, i) => `${i + 1}  ${esc(x)}`).join('\n'));
        case 'help': return say('pwd ls cd mkdir touch cat echo rm cp mv grep clear history\n例: echo "hi" > a.txt / grep -i apple docs/memo.txt');
        default: return err(`zsh: command not found: ${cmd}`);
      }
    }
    function run(line) {
      say('<span class="cmd">' + esc('kenshu@pc ' + path() + ' $ ') + '</span>' + esc(line));
      if (line.trim()) { hist.push(line); hi = hist.length; }
      try { exec(line); } catch (e) { err(String(e)); }
      refresh();
    }
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { const v = input.value; input.value = ''; run(v); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); if (hi > 0) input.value = hist[--hi]; }
      else if (e.key === 'ArrowDown') { e.preventDefault(); hi = Math.min(hist.length, hi + 1); input.value = hist[hi] || ''; }
    });
    const api = { el, tree, run, ran, hist, exists: (p) => get(p), cwd: () => cwd, input };
    say('ようこそ！ <span class="dir">help</span> でコマンド一覧。↑キーで履歴。');
    refresh();
    return api;
  }

  function chipRow(term, cmds) {
    const TIPS = { pwd: 'print working directory＝今いる場所（絶対パス）を表示', ls: 'list＝フォルダの中身を一覧表示', 'cd docs': 'change directory＝docs フォルダへ移動', 'cat memo.txt': 'concatenate＝ファイルの中身を表示', 'cd ..': '.. は「1つ上のフォルダ」', 'mkdir work': 'make directory＝フォルダを作る', 'touch work/a.txt': 'touch＝空のファイルを作る（触って更新日時を変える）', 'echo \"hello\" > work/a.txt': 'echo＝文字を出力。> でファイルに上書き保存', 'cat work/a.txt': 'さっき書いた内容を確認', 'grep -i apple docs/memo.txt': 'grep＝検索。-i は ignore case（大文字小文字を区別しない）', 'mv sample.txt work': 'move＝移動（名前変更にも使う）', 'rm -r work': 'remove -r(recursive)＝フォルダごと削除。戻せないので注意！' };
    return h('div', { class: 'row' }, cmds.map((c) => h('button', { class: 'cg-chip', 'data-tip': TIPS[c] || null, onclick: () => term.run(c) }, c)));
  }

  /* ============================================================
     Vim engine
  ============================================================ */
  function makeVim(onEvent) {
    let L = ['Vim は モード のある エディタ', 'i で挿入、Esc で戻る', 'apple banana cherry'];
    let r = 0, c = 0, mode = 'NORMAL', cmd = '', msg = 'クリックしてキーを押そう', reg = null, pend = '';
    const body = h('div', { class: 'bd' });
    const st = h('div', { class: 'st' });
    const el = h('div', { class: 'cg-vim', tabindex: '0' }, body, st, h('div', { class: 'ov' }, '👆 クリックして操作開始（キーボード入力）'));
    const ev = (n, from, to) => onEvent && onEvent(n, from, to);
    const maxc = () => Math.max(0, L[r].length - (mode === 'INSERT' ? 0 : 1));
    function draw() {
      el.classList.toggle('ins', mode === 'INSERT'); el.classList.toggle('cmd', mode === 'COMMAND');
      body.replaceChildren(...L.map((l, i) => {
        const line = h('div', { class: 'vl' }, h('b', i + 1));
        if (i !== r) { line.append(l || ' '); return line; }
        line.append(l.slice(0, c), h('span', { class: 'cur' }, l[c] || ' '), l.slice(c + 1));
        return line;
      }));
      st.replaceChildren(h('span', { class: 'md' }, mode === 'INSERT' ? '-- INSERT --' : mode === 'COMMAND' ? 'COMMAND' : 'NORMAL'), mode === 'COMMAND' ? h('span', ':' + cmd) : h('span', { style: { opacity: .8 } }, msg), h('span', { style: { marginLeft: 'auto', opacity: .6 } }, `${r + 1}:${c + 1}`));
    }
    const to = (m, name) => { const f = mode; mode = m; ev(name, f, m); };
    function wordFwd() { const s = L[r]; let i = c; while (i < s.length && /\S/.test(s[i])) i++; while (i < s.length && /\s/.test(s[i])) i++; if (i >= s.length) { if (r < L.length - 1) { r++; c = 0; } else c = Math.max(0, s.length - 1); } else c = i; }
    function wordBack() { const s = L[r]; let i = c - 1; while (i > 0 && /\s/.test(s[i])) i--; while (i > 0 && /\S/.test(s[i - 1])) i--; if (c === 0 && r > 0) { r--; c = 0; } else c = Math.max(0, i); }
    function key(k) {
      msg = '';
      if (mode === 'INSERT') {
        if (k === 'Escape') { to('NORMAL', 'Esc'); c = Math.max(0, c - 1); }
        else if (k === 'Enter') { const s = L[r]; L.splice(r, 1, s.slice(0, c), s.slice(c)); r++; c = 0; }
        else if (k === 'Backspace') { if (c > 0) { L[r] = L[r].slice(0, c - 1) + L[r].slice(c); c--; } else if (r > 0) { c = L[r - 1].length; L[r - 1] += L[r]; L.splice(r, 1); r--; } }
        else if (k.length === 1) { L[r] = L[r].slice(0, c) + k + L[r].slice(c); c++; ev('type'); }
        else if (k === 'ArrowLeft') c = Math.max(0, c - 1); else if (k === 'ArrowRight') c = Math.min(L[r].length, c + 1);
      } else if (mode === 'COMMAND') {
        if (k === 'Escape') { cmd = ''; to('NORMAL', 'Esc'); }
        else if (k === 'Enter') {
          const x = cmd.trim(); cmd = ''; to('NORMAL', 'Enter');
          if (x === 'w') { msg = '"practice.md" を保存しました'; ev('w'); }
          else if (x === 'wq' || x === 'x') { msg = '保存して終了！ (シミュレータなので続けて遊べます)'; ev('wq'); }
          else if (x === 'q') { msg = '終了（変更なし）'; ev('q'); }
          else if (x === 'q!') { msg = '保存せず強制終了'; ev('q!'); }
          else msg = 'E492: 知らないコマンド: ' + x;
        } else if (k === 'Backspace') { if (cmd) cmd = cmd.slice(0, -1); else to('NORMAL', 'Esc'); }
        else if (k.length === 1) cmd += k;
      } else {
        if (pend) {
          const p = pend; pend = '';
          if (p === 'd' && k === 'd') { reg = L[r]; L.splice(r, 1); if (!L.length) L = ['']; r = Math.min(r, L.length - 1); c = Math.min(c, maxc()); ev('dd'); draw(); return; }
          if (p === 'y' && k === 'y') { reg = L[r]; msg = '1行ヤンク（コピー）'; ev('yy'); draw(); return; }
          if (p === 'g' && k === 'g') { r = 0; c = 0; ev('gg'); draw(); return; }
        }
        if (k === 'd' || k === 'y' || k === 'g') { pend = k; msg = k + '…'; }
        else if (k === 'i') { to('INSERT', 'i'); }
        else if (k === 'a') { c = Math.min(L[r].length, c + 1); to('INSERT', 'i'); }
        else if (k === 'o') { L.splice(r + 1, 0, ''); r++; c = 0; to('INSERT', 'i'); ev('o'); }
        else if (k === ':') { cmd = ''; to('COMMAND', 'colon'); }
        else if (k === 'h' || k === 'ArrowLeft') { c = Math.max(0, c - 1); ev('h'); }
        else if (k === 'l' || k === 'ArrowRight') { c = Math.min(maxc(), c + 1); ev('l'); }
        else if (k === 'j' || k === 'ArrowDown') { r = Math.min(L.length - 1, r + 1); c = Math.min(c, maxc()); ev('j'); }
        else if (k === 'k' || k === 'ArrowUp') { r = Math.max(0, r - 1); c = Math.min(c, maxc()); ev('k'); }
        else if (k === 'w') { wordFwd(); ev('w-move'); } else if (k === 'b') { wordBack(); ev('b'); }
        else if (k === '0') { c = 0; ev('0'); } else if (k === '$') { c = maxc(); ev('$'); }
        else if (k === 'G') { r = L.length - 1; c = Math.min(c, maxc()); ev('G'); }
        else if (k === 'x') { L[r] = L[r].slice(0, c) + L[r].slice(c + 1); c = Math.min(c, maxc()); ev('x'); }
        else if (k === 'p') { if (reg != null) { L.splice(r + 1, 0, reg); r++; c = 0; ev('p'); } else msg = 'レジスタが空（dd か yy を先に）'; }
        else if (k === 'Escape') { pend = ''; }
      }
      draw();
    }
    el.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key.length === 1 || ['Escape', 'Enter', 'Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) { e.preventDefault(); e.stopPropagation(); key(e.key); }
    });
    draw();
    return { el, key, get mode() { return mode; }, feed(seq) { el.focus(); if (seq === 'Esc') return key('Escape'); if (seq[0] === ':' && seq.length > 1) { seq.split('').forEach(key); return key('Enter'); } seq.split('').forEach(key); } };
  }

  /* ---------- cuivim lesson ---------- */
  K.reg({
    id: 'cuivim', track: 'basic', title: 'CUI・Vim', sub: 'ターミナルとエディタ', emoji: '⌨️',
    scenes: [
      {
        t: 'ターミナルを触ってみよう', tag: 'CUI', lead: '文字だけでPCを操作するのが <b>CUI</b>。下のコマンドを<b>クリック</b>、または自分で入力。右の<b>フォルダ木</b>が一緒に変わるよ。',
        render(el) {
          const term = makeTerm();
          el.append(h('div', { class: 'split' }, term.el, h('div', { class: 'col' }, lbl('フォルダの様子（リアルタイム）'), term.tree)));
          el.append(h('div', { style: { marginTop: '14px' } }, lbl('これを押してみよう'), chipRow(term, ['pwd', 'ls', 'cd docs', 'cat memo.txt', 'cd ..', 'mkdir work', 'touch work/a.txt', 'echo "hello" > work/a.txt', 'cat work/a.txt', 'grep -i apple docs/memo.txt', 'mv sample.txt work', 'rm -r work'])));
          el.append(h('p', { class: 'lead', style: { marginTop: '12px' }, html: '💡 <code class="i">&gt;</code> は「上書き」、<code class="i">&gt;&gt;</code> は「追記」。<code class="i">cd ..</code> は 1つ上へ。' }));
        },
      },
      {
        t: 'Vim：3つのモード', tag: 'Vim', lead: 'Vim は<b>モード</b>で動きが変わるエディタ。まず右の図で「3つの部屋」を確認 → 下の<b>キー早見表</b>をクリックして動かそう。',
        render(el) {
          style('cgk', `
          .cgk-wrap{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:6px}.cgk-g.full{grid-column:1/-1}.cgk-g.full .cgk-grid{grid-template-columns:repeat(var(--cols,5),minmax(0,1fr))}@media(max-width:900px){.cgk-wrap{grid-template-columns:1fr}.cgk-g.full .cgk-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
          .cgk-g{background:var(--card);border:1px solid color-mix(in srgb,var(--c) 35%,var(--line));border-radius:10px;padding:14px 14px 12px;position:relative}
          .cgk-g::before{content:"";position:absolute;left:14px;right:14px;top:0;height:3px;border-radius:0 0 4px 4px;background:var(--c)}
          .cgk-g h4{font-size:1rem;font-weight:900;display:flex;align-items:baseline;gap:.6em;margin-bottom:10px;color:var(--c)}
          .cgk-g h4 small{font:700 .68rem var(--mono);color:var(--mute);letter-spacing:.04em}
          .cgk-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
          .cgk{all:unset;box-sizing:border-box;position:relative;cursor:pointer;display:grid;gap:3px;padding:9px 10px 9px;border-radius:8px;background:var(--card2);border:1px solid var(--line);transition:transform .18s,border-color .18s,background .18s,box-shadow .18s}
          .cgk:hover{transform:translateY(-3px);border-color:var(--c);box-shadow:0 10px 22px -12px var(--c)}
          .cgk:active,.cgk.hit{transform:translateY(1px);background:color-mix(in srgb,var(--c) 24%,var(--card2));border-color:var(--c)}
          .cgk .kc{display:flex;gap:4px;align-items:center;min-height:30px}
          .cgk .kc i{font:800 1rem var(--mono);font-style:normal;min-width:28px;height:28px;padding:0 .5em;display:grid;place-items:center;border-radius:8px;background:var(--bg2);color:var(--text);border:1px solid var(--line);border-bottom-width:3px}
          .cgk .kc .ic{width:15px;height:15px;color:var(--c);margin-left:2px}
          .cgk .en{font:600 .75rem var(--mono);color:var(--mute);letter-spacing:.01em}
          .cgk .en b{color:var(--c);font-weight:900;font-size:.95em;text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:2px}
          .cgk .jp{font-weight:800;font-size:.75rem;line-height:1.35}
          .cgk.dis{opacity:.45}
          .cgk-note{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:12px;padding:.7em 1em;border-radius:8px;background:color-mix(in srgb,var(--violet) 12%,transparent);border:1px dashed color-mix(in srgb,var(--violet) 40%,transparent);font-size:.875rem;font-weight:700}
          `);
          const modes = { NORMAL: ['NORMAL', 'ノーマル', TS], INSERT: ['INSERT', 'インサート', BASIC], COMMAND: ['COMMAND', 'コマンド', TEAM] };
          const NS = 'http://www.w3.org/2000/svg';
          const svg = h('div', { class: 'cg-fsm' });
          svg.innerHTML = `<svg viewBox="0 0 420 220" width="100%"><defs><marker id="cga" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#9aa3c7" stroke="none"/></marker></defs>
          <path id="e-ni" d="M140 94 Q200 40 280 34" marker-end="url(#cga)"/><path id="e-in" d="M280 52 Q220 92 140 104" marker-end="url(#cga)"/>
          <path id="e-nc" d="M140 120 Q215 176 280 168" marker-end="url(#cga)"/><path id="e-cn" d="M280 190 Q200 150 140 128" marker-end="url(#cga)"/>
          <text class="lb" x="200" y="38">i · a · o</text><text class="lb" x="232" y="100">Esc</text><text class="lb" x="204" y="176">:</text><text class="lb" x="196" y="154">Enter</text>
          <g class="nd" id="n-NORMAL" style="--c:var(--ts)"><rect x="20" y="88" width="120" height="44" rx="6"/><text x="80" y="115">NORMAL</text></g>
          <g class="nd" id="n-INSERT" style="--c:var(--basic)"><rect x="280" y="14" width="120" height="44" rx="6"/><text x="340" y="41">INSERT</text></g>
          <g class="nd" id="n-COMMAND" style="--c:var(--team)"><rect x="280" y="162" width="120" height="44" rx="6"/><text x="340" y="189">COMMAND</text></g></svg>`;
          const q = (id) => svg.querySelector('#' + id);
          const lit = (m) => Object.keys(modes).forEach((k) => q('n-' + k).classList.toggle('on', k === m));
          let eTimer;
          const flash = (id) => { const p = q(id); p.classList.add('on'); clearTimeout(eTimer); eTimer = setTimeout(() => p.classList.remove('on'), 900); };
          const done = { i: false, type: false, Esc: false, wq: false, dd: false, p: false };
          const tb = taskBox(); const stt = {};
          const draw = () => drawTasks(tb, [
            { label: 'i を押して INSERT モードに入り、何か文字を打つ', ok: done.i && done.type, hint: ['エディタをクリックして、まず <kbd>i</kbd> を押そう。表示が INSERT に変わる。', 'そのあと、好きな文字を打つ。'], answer: { code: 'i\n（好きな文字を打つ）', lang: 'text' } }, { label: 'Esc で NORMAL（ふつうの状態）に戻る', ok: done.Esc, hint: ['INSERT から戻るキーは <kbd>Esc</kbd>。'], answer: { code: 'Esc', lang: 'text' } }, { label: ':wq と Enter で保存して終了', ok: done.wq, hint: ['まず <kbd>:</kbd> を打つと、下にコマンドを書く欄が出る。', '<code>wq</code> と打って <kbd>Enter</kbd>。（w=保存、q=終了）'], answer: { code: ':wq  と Enter', lang: 'text' } }, { optional: true, label: 'dd で1行を消して、p で貼り付ける（カット＆ペースト）', ok: done.dd && done.p, hint: ['まず Esc でノーマルモードにして、<kbd>d</kbd> を2回（<kbd>dd</kbd>）。', 'そのあと <kbd>j</kbd> で下に動いて <kbd>p</kbd>。消した行が貼り付く。'], answer: { code: 'Esc\ndd\nj\np', lang: 'text' } }], stt);
          const cards = {};
          const hit = (id) => { const b = cards[id]; if (!b) return; b.classList.add('hit'); setTimeout(() => b.classList.remove('hit'), 380); };
          const vim = makeVim((n, f, t) => {
            if (n === 'i') { done.i = true; flash('e-ni'); } else if (n === 'Esc') { if (f === 'INSERT') { flash('e-in'); done.Esc = done.Esc || done.i; } else flash('e-cn'); }
            else if (n === 'colon') flash('e-nc'); else if (n === 'Enter') flash('e-cn');
            else if (n === 'type') done.type = true; else if (n === 'wq') done.wq = true; else if (n === 'dd') done.dd = true; else if (n === 'p' && done.dd) done.p = true;
            lit(t || vim.mode);
            hit({ 'w-move': 'w', w: ':w', q: ':q', 'q!': ':q!' }[n] || n);
            draw();
          });
          vim.el.addEventListener('keydown', (e) => hit(e.key === 'Escape' ? 'Esc' : e.key));
          lit('NORMAL'); draw();

          // ---- key reference: [caps, english(mnemonic, <b> = the letters you type), jp, tip, feed, needsNormal]
          const A = (n) => h('span', { class: 'ar' }, icon(n));
          const G = [
            { t: 'モードを切り替える', en: 'MODE', c: TS, keys: [
              { id: 'i', caps: ['i'], en: '<b>i</b>nsert', jp: '挿入モードへ', tip: 'insert＝差し込む。カーソルの「前」から入力できる', feed: 'i' },
              { id: 'a', caps: ['a'], en: '<b>a</b>ppend', jp: 'カーソルの後ろから入力', tip: 'append＝付け足す。カーソルの「後ろ」から入力できる', feed: 'a' },
              { id: 'o', caps: ['o'], en: '<b>o</b>pen a line', jp: '下に新しい行を作る', tip: 'open＝開く。下に空の行を開いて、そのまま入力', feed: 'o' },
              { id: 'Esc', caps: ['Esc'], en: '<b>Esc</b>ape', jp: 'ノーマルに戻る', tip: 'escape＝脱出。迷ったらとにかく Esc を連打！', feed: 'Esc', always: 1 },
            ] },
            { t: '編集する（ノーマルモードで）', en: 'EDIT', c: PINK, keys: [
              { id: 'x', caps: ['x'], en: '<b>x</b> = ×で消す', jp: '1文字削除', tip: '×印で消すイメージ。カーソル位置の1文字を消す', feed: 'x' },
              { id: 'dd', caps: ['d', 'd'], en: '<b>d</b>elete (行ごと)', jp: '1行削除', tip: 'delete＝削除。d を2回で「この行」。消した行は p で貼り付けられる（カット）', feed: 'dd' },
              { id: 'yy', caps: ['y', 'y'], en: '<b>y</b>ank (ぐいっと引く)', jp: '1行コピー', tip: 'yank＝ぐいっと引っ張る＝コピー。y を2回で「この行」', feed: 'yy' },
              { id: 'p', caps: ['p'], en: '<b>p</b>aste', jp: '下に貼り付け', tip: 'paste＝貼り付け。dd / yy した行がカーソルの下に入る', feed: 'p' },
            ] },
            { t: 'カーソルを動かす', en: 'MOVE', c: BASIC, full: 5, keys: [
              { id: 'h', caps: ['h', 'icon:arrow-left'], en: '<b>h</b> = 4つの左端', jp: '← 左へ', tip: 'h j k l は右手のホームポジションに並ぶ。h はその左端で、左へ1文字', feed: 'h' },
              { id: 'j', caps: ['j', 'icon:arrow-down'], en: '<b>j</b> = 下へ曲がる字', jp: '↓ 下へ', tip: 'j の字は下に曲がっている → 下へ1行', feed: 'j' },
              { id: 'k', caps: ['k', 'icon:arrow-up'], en: '<b>k</b> = j の反対', jp: '↑ 上へ', tip: 'j の隣のキー。j が下なので k は上へ1行', feed: 'k' },
              { id: 'l', caps: ['l', 'icon:arrow-right'], en: '<b>l</b> = 4つの右端', jp: '→ 右へ', tip: 'h j k l の右端で、右へ1文字。l は Left ではなく「右」なので注意', feed: 'l' },
              { id: 'w', caps: ['w'], en: '<b>w</b>ord', jp: '次の単語の先頭へ', tip: 'word＝単語。1単語ずつ進める', feed: 'w' },
              { id: 'b', caps: ['b'], en: '<b>b</b>ack', jp: '前の単語の先頭へ', tip: 'back＝戻る。w の逆方向', feed: 'b' },
              { id: '0', caps: ['0'], en: '<b>0</b> = ゼロ番目', jp: '行頭へ', tip: '0 文字目＝行のいちばん最初', feed: '0' },
              { id: '$', caps: ['$'], en: '<b>$</b> = 末尾 (正規表現と同じ)', jp: '行末へ', tip: '$ は「終わり」を表す記号。正規表現でも同じ意味', feed: '$' },
              { id: 'gg', caps: ['g', 'g'], en: '<b>g</b>o to top', jp: 'ファイルの先頭へ', tip: 'go＝行く。g を2回で1行目へ', feed: 'gg' },
              { id: 'G', caps: ['Shift', 'G'], en: '<b>G</b>o to bottom', jp: 'ファイルの末尾へ', tip: '大文字の G（Shift+g）。gg の逆＝最後の行へ', feed: 'G' },
            ] },
            { t: '保存・終了（:コマンド）', en: 'FILE', c: TEAM, full: 4, keys: [
              { id: ':w', caps: [':', 'w'], en: ':<b>w</b>rite', jp: '保存', tip: 'write＝書き込む。Enter までが1コマンド', feed: ':w' },
              { id: ':q', caps: [':', 'q'], en: ':<b>q</b>uit', jp: '終了', tip: 'quit＝やめる。変更があると終了できない', feed: ':q' },
              { id: 'wq', caps: [':', 'w', 'q'], en: ':<b>w</b>rite + <b>q</b>uit', jp: '保存して終了', tip: 'いちばんよく使う！ 大文字の ZZ でも保存して終了できる', feed: ':wq' },
              { id: ':q!', caps: [':', 'q', '!'], en: ':<b>q</b>uit <b>!</b> (強制)', jp: '保存せず終了', tip: '! は「強制」。変更を捨てて抜ける。ミスった時の脱出口', feed: ':q!' },
            ] },
          ];
          const kb = h('div', { class: 'cgk-wrap' }, G.map((g) => h('section', { class: 'cgk-g' + (g.full ? ' full' : ''), style: { '--c': g.c, '--cols': g.full || 2 } },
            h('h4', g.t, h('small', g.en)),
            h('div', { class: 'cgk-grid' }, g.keys.map((k) => {
              const b = h('button', { class: 'cgk', 'data-tip': k.tip, onclick: () => {
                vim.el.focus();
                if (!k.always && vim.mode !== 'NORMAL') vim.feed('Esc');
                vim.feed(k.feed);
              } },
              h('span', { class: 'kc' }, k.caps.map((c) => (c.startsWith('icon:') ? icon(c.slice(5)) : h('i', c)))),
              h('span', { class: 'en', html: k.en }), h('span', { class: 'jp' }, k.jp));
              cards[k.id] = b; if (k.id === ':w') cards['w-cmd'] = b;
              return b;
            })))));
          el.append(h('div', { class: 'split' }, h('div', { class: 'col' }, lbl('エディタ（クリックしてキー入力）'), vim.el, tb), h('div', { class: 'col' }, lbl('モードの移り変わり'), h('div', { class: 'card' }, svg))));
          el.append(h('div', { style: { marginTop: '18px' } }, lbl('キー早見表 — クリックで実行 / カーソルを乗せると由来を解説'), kb));
          el.append(h('div', { class: 'cgk-note' }, icon('lightbulb'), '英語の頭文字を覚えると忘れにくい。', h('span', { html: '下線の付いた文字が<b>実際に押すキー</b>。' }), icon('life-buoy'), '迷ったら ', h('kbd', 'Esc'), ' を連打！'));
        },
      },
      {
        t: '実践：ターミナルで作ってみよう', tag: 'PRACTICE', lead: '下のミッションを<b>3つ</b>✓にしよう（目安 5分）。迷ったら右上のヒントを見てね。',
        hint: '<p>使うのは3種類だけ。</p><ul style="line-height:1.9"><li>フォルダを作る：<code>mkdir フォルダ名</code></li><li>文字を書き込む：<code>echo "文字" &gt; フォルダ名/ファイル名</code></li><li>文字を探す：<code>grep 言葉 ファイル名</code></li></ul><p style="color:var(--mute);font-size:.875rem">もっと遊ぶなら：<code>&gt;&gt;</code> で追記、<code>mv</code> で移動、<code>rm -r</code> で消す。</p>',
        render(el) {
          const tb = taskBox(), stt = {};
          const term = makeTerm((t) => {
            const f = t.exists('/work/fruit.txt');
            drawTasks(tb, [
              { label: 'work フォルダを作る', ok: !!(t.exists('/work') && t.exists('/work').t === 'd'), hint: ['フォルダを作るコマンドは <code>mkdir</code>（make directory）。', '<code>mkdir</code> のあとに名前を書く。'], answer: { code: 'mkdir work', lang: 'sh' } },
              { label: 'work の中に fruit.txt を作り、apple と書く', ok: !!(f && f.t === 'f' && /apple/i.test(f.v)), hint: ['文字をファイルに書き込むのは <code>echo "文字" &gt; ファイル名</code>。', 'work の中に作るので、ファイル名は <code>work/fruit.txt</code>。'], answer: { code: 'echo "apple" > work/fruit.txt', lang: 'sh' } },
              { label: 'grep で apple を探して、見つける', ok: t.ran.some((r) => r.cmd === 'grep' && r.hits > 0), hint: ['探すコマンドは <code>grep</code>。<code>grep 言葉 ファイル名</code> の順に書く。', '探す言葉は apple、ファイルは work/fruit.txt。'], answer: { code: 'grep apple work/fruit.txt', lang: 'sh' } },
              { optional: true, label: 'fruit.txt に banana を追記して2行にし、sample.txt も work に移す', ok: !!(f && f.t === 'f' && f.v.split('\n').filter(Boolean).length >= 2 && t.exists('/work/sample.txt') && !t.exists('/sample.txt')), hint: ['追記は <code>&gt;&gt;</code>（<code>&gt;</code> は上書きなので注意）。', '移動は <code>mv 元 先</code>。先は <code>work</code> でOK。'], answer: { code: 'echo "banana" >> work/fruit.txt\nmv sample.txt work', lang: 'sh' } },
            ], stt);
          });
          term.el.style.height = 'auto'; term.el.style.minHeight = '330px';
          el.append(h('div', { class: 'split' }, term.el, h('div', { class: 'col' }, lbl('フォルダ'), term.tree, tb)));
        },
      },
    ],
  });

  /* ============================================================
     Git
  ============================================================ */
  function gitFlow() {
    const Z = {
      work: ['作業ディレクトリ', 'Working Dir', TEAM], stage: ['ステージング', 'Staging', PINK], local: ['ローカルリポジトリ', 'Local Repo', TS], remote: ['リモート', 'GitHub', BASIC],
    };
    const zl = {};
    const zones = h('div', { class: 'cg-zones' }, Object.entries(Z).map(([k, [jp, en, c]]) => h('div', { class: 'cg-zone', style: { '--zc': c } }, h('h4', jp, h('small', en)), zl[k] = h('div', { style: { display: 'grid', gap: '6px' } }))));
    const mkF = (t, c, cm) => h('div', { class: 'cg-file' + (cm ? ' cm' : ''), style: { '--zc2': c }, hidden: true }, t);
    const E = { f1: mkF('📄 index.html', TEAM), c1: mkF('● a1b2c3 初回', TS, 1), c1r: mkF('● a1b2c3 初回', BASIC, 1), c2: mkF('● d4e5f6 (同僚)', BASIC, 1), c2l: mkF('● d4e5f6 (同僚)', TS, 1) };
    Object.values(E).forEach((e) => zl.work.append(e));
    const pos = [{ f1: 'work' }, { f1: 'stage' }, { c1: 'local' }, { c1: 'local', c1r: 'remote' }, { c1: 'local', c1r: 'remote', c2: 'remote' }, { c1: 'local', c1r: 'remote', c2: 'remote', c2l: 'local' }];
    const src = { c1r: 'c1', c2l: 'c2' };
    const cmds = ['# index.html を編集した！', 'git add index.html', 'git commit -m "初回"', 'git push origin main', '# 同僚が push した…', 'git pull origin main'];
    const says = ['ファイルを<b>編集</b>。まだ「作業ディレクトリ」にいるだけで、履歴には載っていない。', '<b>git add</b>：「次のコミットに入れるよ」と<b>ステージ</b>に載せる。', '<b>git commit</b>：ステージの内容を<b>履歴（スナップショット）</b>として保存。まだ自分のPCの中だけ。', '<b>git push</b>：ローカルの履歴を<b>GitHub</b>に送る。チームに共有された！', '同僚がリモートに新しいコミットを push。ローカルはまだ知らない。', '<b>git pull</b>：リモートの最新をローカルに取り込む。これで全員同じ状態。'];
    const cmdBar = h('div', { class: 'cg-cmd' });
    function place(el, z, from) {
      const first = from || (el.isConnected && !el.hidden ? el.getBoundingClientRect() : null);
      const same = el.parentNode === zl[z] && !el.hidden;
      zl[z].append(el); el.hidden = false;
      if (same) return;
      if (first && first.width) {
        const l = el.getBoundingClientRect();
        el.animate([{ transform: `translate(${first.left - l.left}px,${first.top - l.top}px)` }, { transform: 'none' }], { duration: 650, easing: 'cubic-bezier(.3,1.1,.4,1)' });
      } else el.animate([{ transform: 'scale(0)', opacity: 0 }, { transform: 'scale(1.2)', opacity: 1, offset: .7 }, { transform: 'none' }], { duration: 500 });
    }
    return stepper({
      color: TS, steps: says.map((s) => ({ say: s })),
      init(vis) { vis.append(cmdBar, zones); },
      update(n) {
        cmdBar.textContent = '$ ' + cmds[n];
        Object.entries(E).forEach(([k, e]) => {
          const z = pos[n][k];
          if (!z) { e.hidden = true; return; }
          place(e, z, src[k] && e.hidden ? E[src[k]].getBoundingClientRect() : null);
        });
      },
    });
  }

  function commitGraph() {
    const COL = [TS, BASIC, PINK, TEAM, VIO];
    let commits, branches, lanes, head, n, log, msg = '';
    const reset = () => { commits = []; branches = {}; lanes = { main: 0 }; head = 'main'; n = 0; log = ['$ git init']; msg = '';
      const a = mk([], 0, '初期'), b = mk([a], 0, 'README'); branches.main = b; };
    function mk(par, lane, m) { const id = 'C' + n++; commits.push({ id, par, lane, m, x: 34 + commits.length * 60, y: 56 + lane * 62, nw: true }); return id; }
    const byId = (id) => commits.find((c) => c.id === id);
    const isAnc = (a, b) => { const s = [b], seen = new Set(); while (s.length) { const x = s.pop(); if (x === a) return true; if (seen.has(x)) continue; seen.add(x); s.push(...byId(x).par); } return false; };
    const wrap = h('div'), svgBox = h('div', { class: 'cg-svgwrap' }), ctl = h('div', { class: 'cg-ctl' }), logEl = h('div', { class: 'cg-cmd', style: { whiteSpace: 'pre', minHeight: '5em', marginTop: '10px' } });
    const nameIn = h('input', { value: 'feature', size: 10 });
    const act = {
      commit(m) { const id = mk([branches[head]], lanes[head], m); branches[head] = id; log.push(`$ git commit -m "${m || 'work'}"   → ${id}`); },
      branch(name) { let nm = (name || nameIn.value || 'feature').replace(/[^\w-]/g, ''); let i = 1, b = nm; while (branches[b]) b = nm + ++i; branches[b] = branches[head]; lanes[b] = Object.keys(lanes).length; head = b; log.push(`$ git switch -c ${b}`); },
      switch(b) { head = b; log.push(`$ git switch ${b}`); },
      merge(b) {
        const t = branches[b], cu = branches[head];
        if (isAnc(t, cu)) { msg = 'Already up to date.'; log.push(`$ git merge ${b}   → Already up to date`); return; }
        if (isAnc(cu, t)) { branches[head] = t; msg = 'Fast-forward!（ポインタが進むだけ）'; log.push(`$ git merge ${b}   → Fast-forward`); return; }
        const id = mk([cu, t], lanes[head], 'merge'); branches[head] = id; msg = 'マージコミットができた！'; log.push(`$ git merge ${b}   → ${id} (merge commit)`);
      },
    };
    function draw() {
      const W = Math.max(520, 60 + commits.length * 60), H = Math.max(190, 96 + Object.keys(lanes).length * 62);
      let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">`;
      commits.forEach((c) => c.par.forEach((p) => { const P = byId(p); s += P.y === c.y ? `<line x1="${P.x}" y1="${P.y}" x2="${c.x}" y2="${c.y}"/>` : `<path class="ed" d="M${P.x} ${P.y} C${P.x + 30} ${P.y} ${c.x - 30} ${c.y} ${c.x} ${c.y}"/>`; }));
      commits.forEach((c) => { s += `<g class="${c.nw ? 'nw' : ''}"><circle cx="${c.x}" cy="${c.y}" r="14" fill="${COL[c.lane % 5].replace('var(', 'var(')}" stroke="var(--bg)" stroke-width="3"/><text x="${c.x}" y="${c.y + 4}" text-anchor="middle">${c.id}</text>${c.m ? `<text class="mg" x="${c.x}" y="${c.y + 31}" text-anchor="middle">${esc(c.m.slice(0, 7))}</text>` : ''}</g>`; c.nw = false; });
      const tips = {};
      Object.entries(branches).forEach(([b, id]) => { const k = (tips[id] = (tips[id] || 0) + 1) - 1, c = byId(id), label = (b === head ? 'HEAD → ' : '') + b, w = label.length * 7 + 16; s += `<g class="pill" data-b="${b}"><rect x="${c.x - w / 2}" y="${c.y - 44 - k * 22}" width="${w}" height="19" rx="6" fill="${b === head ? 'var(--pink)' : 'var(--violet)'}"/><text x="${c.x}" y="${c.y - 30 - k * 22}" text-anchor="middle">${esc(label)}</text></g>`; });
      svgBox.innerHTML = s + '</svg>';
      svgBox.querySelectorAll('.pill').forEach((p) => p.addEventListener('click', () => { act.switch(p.dataset.b); draw(); }));
      const others = Object.keys(branches).filter((b) => b !== head);
      const sel = h('select', others.map((b) => h('option', { value: b }, b)));
      const sw = h('select', Object.keys(branches).map((b) => h('option', { value: b, selected: b === head }, b)));
      sw.onchange = () => { act.switch(sw.value); draw(); };
      ctl.replaceChildren(btn('➕ commit', () => { act.commit(); draw(); }, 'primary' + (commits.length >= 16 ? ' x' : '')), h('span', { style: { opacity: .4 } }, '|'), nameIn, btn('🌿 branch作成', () => { act.branch(); draw(); }), h('span', { style: { opacity: .4 } }, '|'), 'switch', sw, h('span', { style: { opacity: .4 } }, '|'), others.length ? [btn('🔀 merge', () => { act.merge(sel.value); draw(); }), sel, '→ ' + head] : h('small', { style: { color: 'var(--mute)' } }, '（ブランチを作ると merge できる）'), btn('⟲', () => { reset(); draw(); }, 'ghost'));
      if (commits.length >= 16) ctl.querySelector('.primary').disabled = true;
      logEl.textContent = log.slice(-5).join('\n') + (msg ? '\n# ' + msg : '');
      msg = '';
    }
    reset();
    wrap.append(ctl, svgBox, logEl); draw();
    wrap.api = { act, draw, reset, ctl, setLog: (t) => { log.push(t); } , get head() { return head; }, clearNew: () => commits.forEach((c) => (c.nw = false)) };
    return wrap;
  }

  K.reg({
    id: 'git', track: 'basic', title: 'Git', sub: '履歴を残して、みんなで共有', emoji: '🌿',
    scenes: [
      { t: '4つの場所とコマンド', tag: 'add → commit → push', lead: 'Git は「ファイルが<b>どの場所</b>にあるか」を意識するのがコツ。「次へ ▶」で、ファイルが旅をする様子を追おう。', render(el) { el.append(gitFlow()); } },
      { t: 'ブランチとマージ', tag: 'branch', lead: '迷ったら<b>シナリオ</b>を選んで「次へ」を押すだけ。コマンドと図が一緒に動きます。慣れたら「自由に試す」で自分の手で。',
        render(el) {
          style('cgs', `.cgs-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}.cgs-tab{all:unset;cursor:pointer;display:flex;align-items:center;gap:.5em;padding:.55em 1.1em;border-radius:8px;font-weight:800;font-size:.875rem;background:var(--card);border:1px solid var(--line);transition:.2s}.cgs-tab small{display:block;font-weight:600;color:var(--mute);font-size:.75rem}.cgs-tab:hover{transform:translateY(-2px)}.cgs-tab.on{background:color-mix(in srgb,var(--c) 22%,var(--card));border-color:var(--c);box-shadow:0 8px 20px -10px var(--c)}.cgs-tab .ic{color:var(--c)}.cg-svgwrap text.mg{font:700 10px var(--font);fill:var(--mute)}.cgs-goal{display:flex;gap:10px;align-items:center;padding:.6em 1em;border-radius:8px;background:color-mix(in srgb,var(--c) 12%,transparent);border:1px dashed color-mix(in srgb,var(--c) 45%,transparent);font-weight:700;font-size:.875rem;margin-bottom:12px}.cgs-goal .ic{color:var(--c);flex:none}`);
          const g = commitGraph(); const A = g.api;
          const SC = [
            { id: 'ff', c: TS, ic: 'git-branch', t: '機能を足して取り込む', sub: 'fast-forward', goal: 'ログイン機能を別の枝で作って、できたら main に取り込む',
              steps: [
                { say: 'いまの <b>main</b> には 2 つのコミット。ここに「ログイン機能」を足したい。まず<b>枝（branch）</b>を作ろう。', run() {} },
                { say: '<b>git switch -c feature</b>：作業用の枝を作って移動。<b>main はそのまま</b>なので、失敗しても安全！', run() { A.act.branch('feature'); } },
                { say: 'feature の上で <b>commit</b>。コミットは<b>今いる枝</b>にだけ積まれる（HEAD の場所）。', run() { A.act.commit('フォーム'); } },
                { say: 'もう1回 commit。main は<b>まだ</b>2つのまま。枝が伸びた！', run() { A.act.commit('検証'); } },
                { say: '完成。取り込み先の <b>main に戻る</b>（git switch main）。merge は「取り込む側」で実行するのがルール。', run() { A.act.switch('main'); } },
                { say: '<b>git merge feature</b>：main は何も変わっていないので、ポインタが前に進むだけ（<b>Fast-forward</b>）。', run() { A.act.merge('feature'); } },
              ] },
            { id: 'mg', c: PINK, ic: 'git-merge', t: '同時進行して合流', sub: 'マージコミット', goal: '自分と同僚が別々に進めた変更を、1つの履歴に合流させる',
              steps: [
                { say: 'main に 2 コミット。あなたは「ボタン」を、同僚は「バグ修正」を同時に進める想定。', run() {} },
                { say: '<b>git switch -c feature</b>：自分の作業用の枝を作る。', run() { A.act.branch('feature'); } },
                { say: 'feature に <b>commit</b>「ボタン」を追加。', run() { A.act.commit('ボタン'); } },
                { say: '一方その頃、同僚が <b>main</b> を更新する。まず main に切り替えて…', run() { A.act.switch('main'); } },
                { say: 'main に <b>commit</b>「修正」。→ 履歴が<b>二股</b>に分かれた！', run() { A.act.commit('修正'); } },
                { say: '<b>git merge feature</b>：もう一直線では繋げられないので、<b>親が2つ</b>の「マージコミット」で合流！', run() { A.act.merge('feature'); } },
              ] },
          ];
          const wrap = h('div'); const tabs = h('div', { class: 'cgs-tabs' }); const body = h('div');
          let stp = null, mode = null;
          const sel = (k) => {
            if (stp) stp.stop && stp.stop();
            mode = k; body.replaceChildren(); A.reset(); A.draw();
            tabs.querySelectorAll('.cgs-tab').forEach((t) => t.classList.toggle('on', t.dataset.k === k));
            const col = k === 'free' ? VIO : SC.find((x) => x.id === k).c;
            wrap.style.setProperty('--c', col);
            if (k === 'free') { A.ctl.style.display = ''; body.append(g); return; }
            const S = SC.find((x) => x.id === k);
            A.ctl.style.display = 'none';
            stp = stepper({
              color: S.c, interval: 2300, steps: S.steps.map((x) => ({ say: x.say })),
              init() {},
              update(n) {
                A.reset(); A.draw(); A.clearNew();
                for (let i = 0; i < n; i++) S.steps[i].run();
                A.draw(); A.clearNew();
                S.steps[n].run(); A.draw();
              },
            });
            body.append(g, h('div', { style: { height: '12px' } }), stp);
          };
          SC.forEach((x) => tabs.append(h('button', { class: 'cgs-tab', 'data-k': x.id, style: { '--c': x.c }, onclick: () => sel(x.id) }, icon(x.ic), h('div', x.t, h('small', x.sub)))));
          tabs.append(h('button', { class: 'cgs-tab', 'data-k': 'free', style: { '--c': VIO }, onclick: () => sel('free') }, icon('mouse-pointer-click'), h('div', '自由に試す', h('small', 'free play'))));
          wrap.append(tabs, body); el.append(wrap);
          sel('ff');
        },
      },
      { t: 'コンフリクトを解決しよう', tag: 'conflict', lead: '同じ行を<b>別々に編集</b>すると、Git は自分で決められず印を付けます。<b>緑（自分）</b> か <b>青（相手）</b> をクリックして選ぼう。',
        render(el) {
          const rows = [['', '<h1>'], ['mk', '<<<<<<< HEAD'], ['me', '  こんにちは main'], ['mk', '======='], ['th', '  こんにちは feature'], ['mk', '>>>>>>> feature'], ['', '</h1>']];
          const els = rows.map(([c, t]) => h('div', { class: 'r ' + c }, t));
          const box = h('div', { class: 'cg-cf' }, els);
          const out = h('div', { class: 'st-cap' }, '$ git merge feature　→ <b>CONFLICT (content)</b>: Merge conflict in index.html');
          out.innerHTML = '$ git merge feature　→ <b>CONFLICT</b>: Merge conflict in index.html';
          const nxt = h('div', { class: 'row', style: { marginTop: '12px', visibility: 'hidden' } }, ['git add index.html', 'git commit'].map((c, i) => h('span', { class: 'cg-chip', style: { animation: `pop .5s ${i * .3}s both` } }, c)));
          const sol = (w) => {
            [0, 1, 3, 5].forEach((i) => els[i === 0 ? 1 : i].classList.add('gone'));
            els[1].classList.add('gone'); els[3].classList.add('gone'); els[5].classList.add('gone');
            if (w === 'me') els[4].classList.add('gone'); if (w === 'th') els[2].classList.add('gone');
            out.innerHTML = '✅ 印（&lt;&lt;&lt; === &gt;&gt;&gt;）を消して、残したい形に整えたら…'; nxt.style.visibility = 'visible';
            if (!sol.done) { sol.done = 1; celebrate(); }
          };
          els[2].onclick = () => sol('me'); els[4].onclick = () => sol('th');
          const bar = h('div', { class: 'row', style: { marginTop: '12px' } }, btn('🟩 自分(HEAD)を採用', () => sol('me')), btn('🟦 相手(feature)を採用', () => sol('th')), btn('🟩+🟦 両方残す', () => sol('both')), btn('⟲ やり直す', () => { els.forEach((e) => e.classList.remove('gone')); nxt.style.visibility = 'hidden'; out.innerHTML = '$ git merge feature　→ <b>CONFLICT</b>'; sol.done = 0; }, 'ghost'));
          el.append(h('div', { class: 'split' }, h('div', null, lbl('index.html（コンフリクト中）'), box, bar), h('div', null, lbl('どうなってる？'), out, nxt, h('div', { class: 'card', style: { marginTop: '12px', fontSize: '.875rem' } }, h('b', '印の読み方'), h('br'), '<<<<<<< 〜 =======：自分の変更', h('br'), '======= 〜 >>>>>>>：相手の変更', h('br'), '→ 正しい形に直して、印を<b>全部消す</b>のがゴール'))));
        },
      },
      { t: 'GitHub と SSH でつなぐ', tag: 'SSH', lead: 'パスワードの代わりに<b>鍵のペア</b>で本人確認。<b>秘密鍵</b>はPCから出さず、<b>公開鍵</b>だけGitHubに渡します。',
        render(el) {
          const ssh = h('div', { class: 'cg-ssh' });
          const pc = h('div', { class: 'bx' }, h('big', '💻'), h('b', 'あなたのPC'), h('div', { class: 'tag', style: { opacity: 0 } }, '🔒 秘密鍵'));
          const gh = h('div', { class: 'bx' }, h('big', '🐙'), h('b', 'GitHub'), h('div', { class: 'tag', style: { opacity: 0 } }, '🗝️ 登録済み'));
          const pk = h('div', { class: 'k' }, '🗝️'), dice = h('div', { class: 'k', style: { top: '40px' } }, '🎲');
          ssh.append(pc, gh, pk, dice);
          const cmds = ['ssh-keygen -t ed25519 -C "you@example.com"', 'eval "$(ssh-agent -s)"\nssh-add --apple-use-keychain ~/.ssh/id_ed25519', 'pbcopy < ~/.ssh/id_ed25519.pub', 'GitHub → Settings → SSH and GPG keys → New SSH key → 貼り付け', 'ssh -T git@github.com'];
          const cb = h('div');
          el.append(stepper({
            color: BASIC, steps: [
              { say: '① 鍵のペアを<b>つくる</b>。PCに <b>秘密鍵 🔒</b> と 公開鍵 🗝️ ができる。' }, { say: '② <b>ssh-agent</b> に秘密鍵を預ける。Mac はキーチェーンにも保存できるので、毎回パスフレーズを打たなくて済む。' }, { say: '③ <b>公開鍵</b>をクリップボードにコピー。（秘密鍵は絶対に共有しない！）' },
              { say: '④ 公開鍵を <b>GitHub に登録</b>。鍵が旅立つ 🗝️→🐙' }, { say: '⑤ 接続テスト：GitHub が「本当に鍵の持ち主？」と確かめる。秘密鍵がある人だけが通れて、<b>本人確認OK</b>！' }],
            init(vis) { vis.append(ssh, cb); },
            update(i) {
              pc.lastChild.style.opacity = i >= 0 ? 1 : 0; pk.style.opacity = i >= 0 ? 1 : 0;
              pk.style.left = i >= 3 ? '62%' : i >= 2 ? '30%' : '12%'; pk.style.top = '96px';
              gh.lastChild.style.opacity = i >= 3 ? 1 : 0; gh.classList.toggle('ok', i >= 4);
              dice.style.opacity = i >= 4 ? 1 : 0; dice.style.left = i >= 4 ? '38%' : '60%';
              cb.replaceChildren(h('div', { style: { marginTop: '10px' } }, code(cmds[i], 'sh', { color: BASIC })));
              if (i === 4) { pc.classList.add('ok'); } else pc.classList.remove('ok');
            },
          }));
        },
      },
      { t: '実践：コマンドを組み立てよう', tag: 'PRACTICE', lead: '正しい順番にコマンドをクリックして並べよう。ダミーのコマンドも混ざっているよ。合っていれば、上のミッションに✓が付く。',
        render(el) {
          const Q = [
            { hint: ['最初に「どの変更を記録する？」を選ぶコマンド → <code>git add</code>。', '順番は add → commit → push（選ぶ → 記録する → 送る）。'], answer: { code: 'git add index.html\ngit commit -m "update"\ngit push', lang: 'sh' }, m: 'Q1：index.html を GitHub に届ける（3つ）', q: 'index.html を変更した → GitHub に届けたい', ans: ['git add index.html', 'git commit -m "update"', 'git push'], dummy: ['git pull', 'git clone', 'git branch'] },
            { hint: ['まず枝を作って、その枝に移る → <code>git switch -c</code>。', '枝の上で add → commit。それから main に戻って merge。'], answer: { code: 'git switch -c feature\ngit add .\ngit commit -m "feat"\ngit switch main\ngit merge feature', lang: 'sh' }, m: 'Q2：枝 feature で作業して main に取り込む（5つ）', q: '新しい枝 feature で作業して、main に取り込みたい', ans: ['git switch -c feature', 'git add .', 'git commit -m "feat"', 'git switch main', 'git merge feature'], dummy: ['git push --force', 'git init'] },
            { optional: true, hint: ['まず main に戻って、最新を取ってくる（pull）。', 'そのあと feature に戻って、main を取り込む（merge）。'], answer: { code: 'git switch main\ngit pull\ngit switch feature\ngit merge main', lang: 'sh' }, m: 'Q3：同僚が push した → main を最新にして feature に取り込む（4つ）', q: '同僚が main に push した。自分の feature にも取り込みたい', ans: ['git switch main', 'git pull', 'git switch feature', 'git merge main'], dummy: ['git push', 'git reset --hard'] },
          ];
          const tb = taskBox(), stt = {}; const okq = Q.map(() => false); let won = false;
          const upd = () => { drawTasks(tb, Q.map((q, i) => ({ label: q.m, ok: okq[i], hint: q.hint, answer: q.answer, optional: q.optional })), stt); if (!won && Q.every((q, i) => q.optional || okq[i])) { won = true; } };
          const wrap = h('div', { class: 'col' });
          Q.forEach((q, qi) => {
            const seq = [], slot = h('div', { class: 'cg-seq' }), res = h('div', { style: { fontWeight: 800, minHeight: '1.5em' } });
            const pool = h('div', { class: 'row' });
            const shuf = [...q.ans, ...q.dummy].sort(() => Math.random() - 0.5);
            const redraw = () => {
              slot.replaceChildren(...seq.map((c, i) => h('button', { class: 'cg-chip', title: 'クリックで外す', onclick: () => { seq.splice(i, 1); redraw(); } }, `${i + 1}. ${c}`)));
              okq[qi] = JSON.stringify(seq) === JSON.stringify(q.ans);
              res.textContent = okq[qi] ? '✓ 正解！' : '';
              res.style.color = 'var(--ok)'; upd();
            };
            shuf.forEach((c) => pool.append(h('button', { class: 'cg-chip', onclick: () => { if (!seq.includes(c)) { seq.push(c); redraw(); } } }, c)));
            const check = btn('ヒントをもらう', () => {
              if (okq[qi]) { res.textContent = '✓ もう正解！'; return; }
              const next = q.ans[seq.length] !== undefined && seq.every((c, i) => c === q.ans[i]) ? '次は「' + q.ans[seq.length].split(' ')[1] + '」の仲間だよ' : '並びか中身がちがうよ。クリックで外してやり直そう';
              res.textContent = next; res.style.color = 'var(--bad)'; slot.classList.remove('shake'); void slot.offsetWidth; slot.classList.add('shake');
            });
            wrap.append(h('div', { class: 'card' }, h('b', 'Q. ' + q.q), slot, pool, h('div', { class: 'row', style: { marginTop: '10px' } }, check, btn('やり直す', () => { seq.length = 0; redraw(); }, 'ghost'), res)));
          });
          el.append(tb, wrap); upd();
        },
        answer: { code: '# Q1\ngit add index.html\ngit commit -m "update"\ngit push\n\n# Q2\ngit switch -c feature\ngit add .\ngit commit -m "feat"\ngit switch main\ngit merge feature\n\n# Q3（任意）\ngit switch main\ngit pull\ngit switch feature\ngit merge main', lang: 'sh', file: 'answer.sh' },
      },
    ],
  });

  /* ============================================================
     CSS
  ============================================================ */
  function attachScene(el) {
    const modes = {
      inline: { n: '① style 属性', badge: '非推奨', meter: 15, html: '<p style="color: hotpink; font-weight: 900;">\n  こんにちは\n</p>\n<p style="color: hotpink; font-weight: 900;">\n  また書くの…？\n</p>', css: '', note: '要素ごとに書く＝同じ指定をコピペ地獄。' },
      tag: { n: '② <style> タグ', badge: '小規模なら', meter: 55, html: '<head>\n  <style>\n    p { color: hotpink;\n        font-weight: 900; }\n  </style>\n</head>\n<body>\n  <p>こんにちは</p>\n  <p>まとめて変わる！</p>\n</body>', css: '', note: '1ページ内でまとめて指定。他のページでは使い回せない。' },
      link: { n: '③ <link> で外部CSS', badge: '推奨 ✓', meter: 95, html: '<head>\n  <link rel="stylesheet"\n        href="style.css">\n</head>\n<body>\n  <p>こんにちは</p>\n  <p>全ページで共通！</p>\n</body>', css: 'p {\n  color: hotpink;\n  font-weight: 900;\n}', note: '役割が分かれて直しやすい。全ページで再利用できる。' },
    };
    const tabs = h('div', { class: 'cg-tabs' }), left = h('div'), right = h('div'), meter = h('i'), note = h('div', { class: 'st-cap' });
    const frame = h('iframe', { class: 'cg-page', sandbox: '', style: { width: '100%', height: '170px', border: 0 } });
    const pkt = h('div', { class: 'cg-pk', style: { fontSize: '1.5rem' } }, '📦');
    function show(k) {
      const m = modes[k];
      tabs.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.k === k));
      left.replaceChildren(code(m.html, 'html', { file: 'index.html', color: BASIC }), m.css ? h('div', { style: { marginTop: '10px', position: 'relative' } }, k === 'link' ? h('div', { style: { position: 'absolute', right: '10px', top: '-30px' } }, pkt) : null, code(m.css, 'css', { file: 'style.css', color: TS })) : null);
      meter.style.width = m.meter + '%';
      note.innerHTML = `<b>${m.badge}</b>　${m.note}`;
      frame.srcdoc = '<body style="font-family:sans-serif;margin:12px;line-height:1.8"><style>p{color:hotpink;font-weight:900}</style><p>こんにちは</p><p>' + (k === 'inline' ? 'また書くの…？' : k === 'tag' ? 'まとめて変わる！' : '全ページで共通！') + '</p>';
    }
    Object.entries(modes).forEach(([k, m]) => tabs.append(h('button', { 'data-k': k, onclick: () => show(k) }, m.n)));
    right.append(lbl('結果'), frame, lbl('直しやすさ'), h('div', { class: 'cg-meter' }, meter), h('div', { style: { height: '10px' } }), note);
    el.append(tabs, h('div', { class: 'split' }, left, right));
    show('inline');
  }

  function selectorScene(el) {
    const RULES = [['p', '#3b82f6'], ['.note', '#ef4444'], ['#main', '#16a34a'], ['p.note', '#a855f7'], ['div p', '#f59e0b'], ['*', '#64748b']];
    const spec = (s) => { const id = (s.match(/#[\w-]+/g) || []).length, cl = (s.match(/\.[\w-]+|\[[^\]]+\]|:[\w-]+/g) || []).length, tg = (s.replace(/#[\w-]+|\.[\w-]+|\[[^\]]+\]|:[\w-]+/g, ' ').match(/[a-z][\w-]*/gi) || []).length; return id * 100 + cl * 10 + tg; };
    const page = h('div', { class: 'page' });
    page.innerHTML = '<h1 id="main" class="pick">見出し h1#main</h1><p class="pick">ふつうの段落 p</p><p class="note pick">注意の段落 p.note</p><div class="pick" style="border:1px dashed #aaa;padding:6px;border-radius:8px"><p class="pick">div の中の p</p><p class="note pick">div の中の p.note</p></div>';
    const sty = h('style', RULES.map(([s, c]) => `.cg-sg .page ${s === '*' ? '*' : s.replace(/(^|\s)(\S)/g, (m, a, b) => a + b)}{color:${c}}`).join('\n'));
    // scoped version of rules; "*" would recolor children too, fine
    const scoped = RULES.map(([s, c]) => (s === '*' ? '.cg-sg .page *' : '.cg-sg .page ' + s) + `{color:${c}}`).join('\n');
    sty.textContent = scoped;
    const list = h('div', { class: 'cg-rules' }), info = h('div', { class: 'st-cap' });
    info.innerHTML = '👆 <b>ルール</b>を押すと対象が光る／<b>ページの要素</b>を押すと、当たっているルールと「勝者」が分かる';
    const ruleEls = RULES.map(([s, c], i) => h('button', { class: 'cg-rule', onclick: () => pickRule(i) }, h('span', { style: { color: c } }, '■ ' + s), h('span', { class: 'sp' }, h('i', { style: { width: Math.min(100, spec(s) / 1.2) + '%' } })), h('span', { style: { color: 'var(--mute)' } }, '強さ ' + spec(s))));
    list.append(...ruleEls);
    const clear = () => { page.querySelectorAll('.hit').forEach((e) => e.classList.remove('hit')); ruleEls.forEach((r) => r.classList.remove('on', 'win')); };
    function pickRule(i) {
      clear(); ruleEls[i].classList.add('on');
      const [s] = RULES[i], t = s === '*' ? [...page.querySelectorAll('*')] : [...page.querySelectorAll(s === '#main' ? '#main' : s)];
      t.forEach((e) => e.classList.add('hit'));
      info.innerHTML = `<code class="i">${esc(s)}</code> は <b>${t.length} 個</b>の要素に一致`;
    }
    page.addEventListener('click', (e) => {
      const t = e.target.closest('.pick'); if (!t) return;
      clear(); t.classList.add('hit');
      const m = RULES.map((r, i) => [r, i]).filter(([[s]]) => (s === '*' ? true : t.matches('.cg-sg .page ' + s) || (s === 'div p' && t.matches('div p')) ));
      const sel = m.filter(([[s]]) => s === '*' || t.matches(s === 'div p' ? 'div p' : s));
      sel.forEach(([, i]) => ruleEls[i].classList.add('on'));
      let win = null;
      sel.forEach(([r, i]) => { if (!win || spec(r[0]) >= spec(RULES[win][0])) win = i; });
      if (win != null) ruleEls[win].classList.add('win');
      info.innerHTML = win == null ? '一致するルールなし' : `一致 <b>${sel.length}</b> 件 → <b>強さが最大</b>の <code class="i">${esc(RULES[win][0])}</code> が勝って、色は <span style="color:${RULES[win][1]};font-weight:900">この色</span>（同じ強さなら後に書いた方）`;
    });
    el.append(h('div', { class: 'cg-sg' }, sty, h('div', { class: 'split' }, h('div', { class: 'col' }, lbl('ミニページ'), page), h('div', { class: 'col' }, lbl('CSSルール（強さ：#id=100 / .class=10 / タグ=1）'), list, info))));
    el.append(code('p      { color: blue }   /* 強さ 1  */\n.note  { color: red  }   /* 強さ 10 */\n#main  { color: green }  /* 強さ 100 */', 'css', { dim: true }));
  }

  function boxScene(el) {
    const S = { w: 160, p: 24, b: 8, m: 24, bb: false };
    const stage = h('div', { class: 'cg-box' }), codeBox = h('div'), tot = h('div', { class: 'st-cap' });
    function draw() {
      const outer = h('div', { class: 'lay', style: { background: 'color-mix(in srgb,var(--team) 28%,transparent)', padding: S.m + 'px', outline: '1px dashed var(--team)' } },
        h('span', { class: 'tg', style: { color: 'var(--team)' } }, 'margin'),
        h('div', { class: 'lay', style: { border: `${S.b}px solid var(--pink)`, background: 'color-mix(in srgb,var(--basic) 30%,transparent)', padding: S.p + 'px', boxSizing: S.bb ? 'border-box' : 'content-box', width: S.w + 'px', transition: 'all .25s' } },
          h('span', { class: 'tg', style: { color: 'var(--basic)', top: '-' + Math.max(0, S.b - 0) + 'px' } }, S.b > 0 ? '' : ''),
          h('div', { style: { background: 'var(--ts)', color: '#fff', padding: '10px', borderRadius: '6px', font: '700 .85rem var(--mono)', textAlign: 'center', minHeight: '40px', display: 'grid', placeItems: 'center' } }, 'content')));
      const labels = h('div', { class: 'row', style: { marginTop: '10px', justifyContent: 'center', font: '700 .72rem var(--mono)' } }, h('span', { style: { color: 'var(--team)' } }, '■ margin'), h('span', { style: { color: 'var(--pink)' } }, '■ border'), h('span', { style: { color: 'var(--basic)' } }, '■ padding'), h('span', { style: { color: 'var(--ts)' } }, '■ content'));
      stage.replaceChildren(h('div', null, outer, labels));
      codeBox.replaceChildren(code(`.box {\n  ${S.bb ? 'box-sizing: border-box;\n  ' : ''}width: ${S.w}px;\n  padding: ${S.p}px;\n  border: ${S.b}px solid #ff6b9d;\n  margin: ${S.m}px;\n}`, 'css', { file: 'style.css', color: TS }));
      const total = S.bb ? S.w : S.w + 2 * (S.p + S.b);
      tot.innerHTML = S.bb ? `<b>border-box</b>：width ${S.w} が「枠線まで含めた幅」→ 見た目の幅 = <b>${total}px</b>` : `<b>content-box</b>（初期値）：見た目の幅 = ${S.w} + padding ${S.p}×2 + border ${S.b}×2 = <b>${total}px</b>`;
    }
    const sl = [['width', 'w', 80, 200, TS], ['padding', 'p', 0, 50, BASIC], ['border', 'b', 0, 20, PINK], ['margin', 'm', 0, 50, TEAM]].map(([l, k, a, b, c]) => slider(l, a, b, S[k], 'px', (v) => { S[k] = v; draw(); }, c));
    const chk = h('label', { class: 'row', style: { cursor: 'pointer', fontWeight: 800 } }, h('input', { type: 'checkbox', onchange: (e) => { S.bb = e.target.checked; draw(); } }), h('span', 'box-sizing: border-box にする'));
    stage.style.flex = '1 1 auto';
    el.append(h('div', { class: 'split' }, h('div', { class: 'col' }, lbl('スライダーで動かす'), h('div', { class: 'card col' }, sl, chk), tot), h('div', { class: 'col' }, lbl('結果'), stage, codeBox)));
    draw();
  }

  function flexScene(el) {
    const S = { dir: 'row', jc: 'flex-start', ai: 'stretch', wrap: 'nowrap', gap: 10, n: 4 };
    const fx = h('div', { class: 'cg-fx' }), cb = h('div'), ax = h('div', { class: 'st-cap' });
    const cols = [BASIC, TS, PINK, TEAM, VIO, VUE, '#ff8a65', '#ffd54f'];
    function draw() {
      Object.assign(fx.style, { flexDirection: S.dir, justifyContent: S.jc, alignItems: S.ai, flexWrap: S.wrap, gap: S.gap + 'px' });
      const sizes = [[60, 50], [80, 90], [50, 70], [90, 60], [70, 80], [60, 60], [80, 50], [50, 90]];
      fx.replaceChildren(...Array.from({ length: S.n }, (_, i) => h('div', { style: { background: cols[i % 8], width: S.ai === 'stretch' && S.dir.startsWith('column') ? 'auto' : sizes[i][0] + 'px', height: S.ai === 'stretch' && S.dir.startsWith('row') ? 'auto' : sizes[i][1] + 'px', minHeight: S.ai === 'stretch' ? '0' : undefined } }, i + 1)));
      cb.replaceChildren(code(`.container {\n  display: flex;\n  flex-direction: ${S.dir};\n  justify-content: ${S.jc};\n  align-items: ${S.ai};\n  flex-wrap: ${S.wrap};\n  gap: ${S.gap}px;\n}`, 'css', { file: 'style.css', color: TS }));
      const row = S.dir.startsWith('row');
      ax.innerHTML = `主軸 ${row ? '➡ 横' : '⬇ 縦'}（<b>justify-content</b> が効く）／交差軸 ${row ? '⬇ 縦' : '➡ 横'}（<b>align-items</b> が効く）${S.dir.endsWith('reverse') ? '　※ reverse で順番が逆' : ''}`;
    }
    const mk = (l, opts, k) => h('div', null, h('div', { class: 'label' }, l), seg(opts, S[k], (v) => { S[k] = v; draw(); }));
    el.append(h('div', { class: 'split wide-l' }, h('div', { class: 'col' }, fx, ax, cb),
      h('div', { class: 'col card' }, mk('flex-direction', ['row', 'row-reverse', 'column', 'column-reverse'], 'dir'), mk('justify-content', ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'], 'jc'), mk('align-items', ['stretch', 'flex-start', 'center', 'flex-end'], 'ai'), mk('flex-wrap', ['nowrap', 'wrap'], 'wrap'),
        slider('gap', 0, 40, S.gap, 'px', (v) => { S.gap = v; draw(); }, PINK),
        h('div', { class: 'row' }, h('span', { style: { fontWeight: 800 } }, 'アイテム数'), btn('−', () => { S.n = Math.max(1, S.n - 1); draw(); }), btn('＋', () => { S.n = Math.min(8, S.n + 1); draw(); })))));
    draw();
  }

  function positionScene(el) {
    const S = { pos: 'static', top: 20, left: 40, par: false };
    const par = h('div', { class: 'par', 'data-l': '親 .parent' }), ghost = h('div', { class: 'ghost' }), cb = h('div'), note = h('div', { class: 'st-cap' });
    const stage = h('div', { class: 'cg-pos' }, h('b', { style: { font: '700 .72rem var(--mono)', color: '#8a8fb4' } }, 'ブラウザ画面 (body)'), par, ghost);
    const A = h('div', { class: 'b', style: { background: '#94a3b8' } }, 'A'), B = h('div', { class: 'b', style: { background: '#ff6b9d' } }, 'B'), C = h('div', { class: 'b', style: { background: '#5b9dff' } }, 'C');
    par.append(A, B, C);
    function draw() {
      par.style.position = S.par ? 'relative' : 'static';
      stage.style.position = 'relative';
      B.style.position = S.pos;
      B.style.top = S.pos === 'static' ? '' : S.top + 'px'; B.style.left = S.pos === 'static' ? '' : S.left + 'px';
      B.style.marginBottom = '10px';
      requestAnimationFrame(() => {
        const sr = stage.getBoundingClientRect();
        // ghost = the position B would occupy in normal flow (relative only)
        if (S.pos === 'relative') { const b = B.getBoundingClientRect(); Object.assign(ghost.style, { opacity: 1, left: b.left - sr.left - S.left + 'px', top: b.top - sr.top - S.top + 'px', width: b.width + 'px', height: b.height + 'px' }); } else ghost.style.opacity = 0;
      });
      cb.replaceChildren(code(`.parent { ${S.par ? 'position: relative;' : '/* position なし */'} }\n.b {\n  position: ${S.pos};${S.pos !== 'static' ? `\n  top: ${S.top}px;\n  left: ${S.left}px;` : ''}\n}`, 'css', { file: 'style.css', color: TS }));
      note.innerHTML = { static: '<b>static</b>：初期値。普通に上から並ぶ。top/left は効かない。', relative: '<b>relative</b>：元の場所(点線)を基準にずれる。<b>C は動かない</b>＝元の場所は空いたまま。', absolute: S.par ? '<b>absolute</b>：流れから外れる（C が上に詰まる）。基準は<b>親</b>（relative 付き）。' : '<b>absolute</b>：流れから外れる。親に position が無いので、基準は<b>画面側</b>まで遡る！', fixed: '' }[S.pos];
    }
    el.append(h('div', { class: 'split' }, h('div', { class: 'col' }, lbl('B にだけ position を付ける'), h('div', { class: 'card col' }, seg(['static', 'relative', 'absolute'], S.pos, (v) => { S.pos = v; draw(); }), slider('top', 0, 120, S.top, 'px', (v) => { S.top = v; draw(); }, PINK), slider('left', 0, 200, S.left, 'px', (v) => { S.left = v; draw(); }, TS),
      h('label', { class: 'row', style: { cursor: 'pointer', fontWeight: 800 } }, h('input', { type: 'checkbox', onchange: (e) => { S.par = e.target.checked; draw(); } }), '親に position: relative を付ける')), cb, note), stage));
    draw();
  }

  /* ===== gap-fill: font/text, display, sticky/fixed, z-index, Sass ===== */
  style('gap-css', `
  .split>.col{align-content:start}
  .gap-prev{background:#fff;color:#222;border-radius:8px;padding:18px;border:1px solid var(--line);min-height:200px;overflow:hidden}
  .gap-ctl{display:grid;gap:10px;align-content:start}
  .gap-row{display:grid;grid-template-columns:104px 1fr 62px;gap:8px;align-items:center;font:700 .75rem var(--mono)}
  .gap-row input[type=range]{accent-color:var(--basic);width:100%}
  .gap-row output{color:var(--basic);text-align:right}
  .gap-chips{display:flex;gap:6px;flex-wrap:wrap}
  .gap-chip{all:unset;cursor:pointer;padding:.25em .8em;border-radius:6px;border:1px solid var(--line);background:var(--card);font:700 .75rem var(--mono);transition:.2s}
  .gap-chip:hover{transform:translateY(-2px)}
  .gap-chip.on{background:var(--basic);color:#06101f;border-color:transparent}
  .gap-scroll{position:relative;height:250px;overflow:auto;background:#fff;color:#333;border-radius:8px;border:1px solid var(--line);transform:translateZ(0)}
  .gap-scroll .banner{height:84px;display:grid;place-items:center;background:linear-gradient(135deg,#ffd3e4,#d6e4ff);font-weight:900;color:#556}
  .gap-scroll .hd{background:#5b9dff;color:#fff;padding:.5em 1em;font:800 .875rem var(--mono);left:0;right:0;z-index:2;box-shadow:0 6px 14px -8px #0006}
  .gap-scroll p{padding:.3em 1em;margin:0;color:#667;font-size:.875rem}
  .gap-stack{display:grid;min-height:200px;padding:20px;background:var(--card);border:1px solid var(--line);border-radius:8px}
  .gap-stack .cd{grid-area:1/1;width:150px;height:110px;border-radius:8px;display:grid;place-items:center;font:900 1.25rem var(--mono);color:#06101f;cursor:pointer;transition:transform .25s,box-shadow .25s;box-shadow:0 10px 24px -10px #0008;user-select:none}
  .gap-stack .cd:hover{transform:translateY(-4px)}
  .gap-stack .cd small{display:block;font:700 .68rem var(--mono)}
  .gap-dsp{background:#fff;color:#222;border-radius:8px;padding:16px;line-height:2.2;border:1px solid var(--line);min-height:190px}
  .gap-dsp .x{background:var(--basic);color:#06101f;font-weight:800;padding:0 .5em;margin:4px;transition:all .35s;border-radius:6px;outline:2px dashed #0003}
  .gap-dsp .x.big{width:90px;height:50px;line-height:50px;text-align:center}
  .gap-dsp .x:nth-child(2){background:#ffb454}.gap-dsp .x:nth-child(3){background:#ff8fb7}
  .gap-note{padding:.6em 1em;border-radius:8px;background:color-mix(in srgb,var(--basic) 14%,var(--card));border:1px solid color-mix(in srgb,var(--basic) 40%,var(--line));font-weight:700;font-size:.875rem}
  `);

  function fontScene(el) {
    const S = { size: 22, fam: 'sans-serif', w: 400, lh: 1.6, deco: 'none', col: '#222222' };
    const prev = h('div', { class: 'gap-prev' }), codeBox = h('div');
    const draw = () => {
      prev.replaceChildren(h('p', { style: { margin: 0, fontSize: S.size + 'px', fontFamily: S.fam, fontWeight: S.w, lineHeight: S.lh, textDecoration: S.deco, color: S.col, transition: 'all .25s' } }, 'Webページの文字は CSS で自在に変わる。', h('br'), 'Hello, Font & Text!'));
      codeBox.replaceChildren(code(`p {\n  font-size: ${S.size}px;\n  font-family: ${S.fam};\n  font-weight: ${S.w};\n  line-height: ${S.lh};\n  text-decoration: ${S.deco};\n  color: ${S.col};\n}`, 'css', { file: 'style.css', color: BASIC }));
    };
    const slider = (label, key, min, max, step, unit = '') => { const o = h('output', S[key] + unit); return h('div', { class: 'gap-row' }, h('span', label), h('input', { type: 'range', min, max, step, value: S[key], oninput: (e) => { S[key] = +e.target.value; o.textContent = S[key] + unit; draw(); } }), o); };
    const chips = (label, key, vals) => { const box = h('div', { class: 'gap-chips' }); const rd = () => [...box.children].forEach((b) => b.classList.toggle('on', String(b.dataset.v) === String(S[key]))); vals.forEach(([v, t]) => box.append(h('button', { class: 'gap-chip', 'data-v': v, onclick: () => { S[key] = typeof S[key] === 'number' ? +v : v; rd(); draw(); } }, t || v))); rd(); return h('div', null, lbl(label), box); };
    const ctl = h('div', { class: 'gap-ctl' },
      slider('font-size', 'size', 12, 44, 1, 'px'), slider('line-height', 'lh', 1, 2.6, .1),
      chips('font-family', 'fam', [['sans-serif'], ['serif'], ['monospace']]), chips('font-weight', 'w', [[400, '400 normal'], [700, '700 bold'], [900, '900']]),
      chips('text-decoration', 'deco', [['none'], ['underline'], ['line-through']]), chips('color', 'col', [['#222222', 'black'], ['#e0245e', 'pink'], ['#2563eb', 'blue'], ['#15803d', 'green']]));
    Object.assign(prev.style, { flex: '1 1 auto', minHeight: '240px', display: 'grid', alignContent: 'center' });
    el.append(h('div', { class: 'split' }, h('div', { class: 'col' }, lbl('操作パネル'), ctl, codeBox), h('div', { class: 'col' }, lbl('結果'), prev)));
    draw();
  }

  function displayScene(el) {
    const S = { d: 'inline', big: false };
    const NOTE = { inline: ['inline：文章の流れに並ぶ。<b>width / height は効かない</b>。', 'ここは文字の幅だけ'], 'inline-block': ['inline-block：並ぶのに <b>width / height が効く</b>。いいとこ取り！', ''], block: ['block：<b>1行まるごと</b>使う。幅・高さも効く。', ''] };
    const spans = ['A', 'B', 'C'].map((t) => h('span', { class: 'x' }, t));
    const box = h('div', { class: 'gap-dsp' }, 'これは文章のなかに ', spans[0], ' と ', spans[1], ' と ', spans[2], ' が入っている例です。ブラウザは基本、文字を左から右へ並べます。');
    const note = h('div', { class: 'gap-note' }), codeBox = h('div');
    const draw = () => {
      spans.forEach((s) => { s.style.display = S.d; s.classList.toggle('big', S.big); });
      note.innerHTML = NOTE[S.d][0] + (S.big && S.d === 'inline' ? ' ← 90×50 を指定しても<b>変わらない</b>！' : '');
      codeBox.replaceChildren(code(`.x {\n  display: ${S.d};` + (S.big ? '\n  width: 90px;\n  height: 50px;' : '') + '\n}', 'css', { file: 'style.css', color: BASIC }));
      btns.forEach((b) => b.classList.toggle('on', b.dataset.v === S.d));
    };
    const btns = ['inline', 'inline-block', 'block'].map((v) => h('button', { class: 'gap-chip', 'data-v': v, onclick: () => { S.d = v; draw(); } }, v));
    const sw = h('label', { class: 'row', style: { cursor: 'pointer', fontWeight: 800 } }, h('input', { type: 'checkbox', onchange: (e) => { S.big = e.target.checked; draw(); } }), 'width: 90px / height: 50px を指定');
    el.append(h('div', { class: 'split' }, h('div', { class: 'col' }, lbl('display を選ぶ'), h('div', { class: 'gap-chips' }, btns), sw, note, codeBox), h('div', { class: 'col' }, lbl('結果（A・B・C が対象）'), box)));
    draw();
  }

  function stickyScene(el) {
    const MODES = { static: '標準：スクロールで一緒に流れて消える。', sticky: 'sticky：ふだんは流れる → <b>top:0 に来たらピタッと止まる</b>。', fixed: 'fixed：<b>画面に固定</b>。元の場所は空いて、下の内容が潜り込む。', absolute: 'absolute：親(relative)基準の位置に置かれ、親と一緒に流れる。' };
    let mode = 'static';
    const hd = h('div', { class: 'hd' }, 'ヘッダー（このバーに注目）');
    const sc = h('div', { class: 'gap-scroll' }, h('div', { class: 'banner' }, 'ロゴ領域'), hd, ...Array.from({ length: 22 }, (_, i) => h('p', `${i + 1}. スクロールしてね — 本文の行です。`)));
    const note = h('div', { class: 'gap-note' }), codeBox = h('div'), pos = h('span', { class: 'chip', style: { '--c': TEAM } }, 'scrollTop: 0');
    sc.addEventListener('scroll', () => { pos.textContent = 'scrollTop: ' + Math.round(sc.scrollTop); });
    const draw = () => {
      hd.style.position = mode; hd.style.top = mode === 'static' ? '' : '0';
      note.innerHTML = MODES[mode];
      codeBox.replaceChildren(code(`.header {\n  position: ${mode};` + (mode === 'static' ? '' : '\n  top: 0;') + '\n}', 'css', { file: 'style.css', color: BASIC }));
      btns.forEach((b) => b.classList.toggle('on', b.dataset.v === mode));
      sc.scrollTo({ top: 70, behavior: 'smooth' });
    };
    const btns = Object.keys(MODES).map((v) => h('button', { class: 'gap-chip', 'data-v': v, onclick: () => { mode = v; draw(); } }, v));
    el.append(h('div', { class: 'split' }, h('div', { class: 'col' }, lbl('position を選ぶ → 右をスクロール'), h('div', { class: 'gap-chips' }, btns), note, codeBox, h('div', null, pos)), h('div', { class: 'col' }, lbl('スクロール領域'), sc)));
    draw();
  }

  function zScene(el) {
    const C = [{ n: 'A', c: '#6fdc7c', z: 1, pos: true, dx: 0 }, { n: 'B', c: '#5b9dff', z: 2, pos: true, dx: 60 }, { n: 'C', c: '#ff8fb7', z: 3, pos: true, dx: 120 }];
    const stack = h('div', { class: 'gap-stack' }), list = h('div', { class: 'col' }), cds = C.map((o) => h('div', { class: 'cd', onclick: () => { o.z = Math.max(...C.map((x) => x.z)) + 1; draw(); } }));
    cds.forEach((e) => stack.append(e));
    const draw = () => {
      C.forEach((o, i) => {
        const e = cds[i]; e.style.background = o.c; e.style.marginLeft = o.dx + 'px'; e.style.marginTop = i * 26 + 'px';
        e.style.position = o.pos ? 'relative' : 'static'; e.style.zIndex = o.pos ? o.z : 'auto';
        e.replaceChildren(h('div', o.n, h('small', o.pos ? 'z-index: ' + o.z : 'static → 無視')));
      });
      const ord = C.map((o, i) => ({ ...o, i })).sort((a, b) => (b.pos ? b.z : -1) - (a.pos ? a.z : -1) || b.i - a.i);
      list.replaceChildren(lbl('前 → 奥の順番'), h('div', { class: 'row' }, ord.map((o, k) => h('span', { class: 'chip', style: { '--c': o.c, fontSize: '.875rem' } }, `${k + 1}. ${o.n}`))),
        code(C.map((o) => `.${o.n.toLowerCase()} {` + (o.pos ? ` position: relative; z-index: ${o.z}; ` : ' /* position なし */ ') + '}').join('\n'), 'css', { file: 'style.css', color: BASIC }));
    };
    const tog = h('button', { class: 'gap-chip', onclick: () => { C[2].pos = !C[2].pos; tog.classList.toggle('on', !C[2].pos); draw(); } }, 'C の position を外す');
    const rst = h('button', { class: 'gap-chip', onclick: () => { C.forEach((o, i) => { o.z = i + 1; o.pos = true; }); tog.classList.remove('on'); draw(); } }, 'リセット');
    el.append(h('div', { class: 'split' }, h('div', { class: 'col' }, lbl('カードをクリック → 最前面へ'), stack), h('div', { class: 'col' }, list, h('div', { class: 'row' }, tog, rst), h('div', { class: 'gap-note', html: '💡 z-index は <b>position を付けた要素</b>（と flex・grid の子）に効く。position を外すと効かなくなって、奥に潜るよ。' }))));
    draw();
  }

  function scssCompile(src) {
    const vars = {}, out = []; let i = 0;
    let s = src.replace(/\/\/.*$/gm, '');
    s = s.replace(/\$([\w-]+)\s*:\s*([^;]+);/g, (m, k, v) => { vars[k] = v.trim().replace(/\$([\w-]+)/g, (mm, kk) => vars[kk] ?? mm); return ''; });
    s = s.replace(/\$([\w-]+)/g, (m, k) => (vars[k] !== undefined ? vars[k] : m));
    function parse(sel) {
      const r = { sel, decl: [] }; if (sel != null) out.push(r);
      let buf = '';
      while (i < s.length) {
        const c = s[i++];
        if (c === '{') { const raw = buf.trim(); buf = ''; parse(sel == null ? raw : raw.includes('&') ? raw.replace(/&/g, sel) : sel + ' ' + raw); }
        else if (c === ';') { if (buf.trim()) r.decl.push(buf.trim() + ';'); buf = ''; }
        else if (c === '}') { if (buf.trim()) r.decl.push(buf.trim() + ';'); return; }
        else buf += c;
      }
    }
    parse(null);
    return out.filter((r) => r.decl.length).map((r) => r.sel + ' {\n' + r.decl.map((d) => '  ' + d).join('\n') + '\n}').join('\n\n');
  }

  function sassScene(el) {
    const init = '$main: #5b9dff;\n$gap: 14px;\n\n.card {\n  padding: $gap;\n  border: 2px solid $main;\n  border-radius: 8px;\n  h3 { color: $main; }\n  &:hover { background: #eef4ff; }\n  .btn { margin-top: $gap; }\n}\n';
    const out = h('div'), frame = h('iframe', { sandbox: '', style: { width: '100%', height: '150px', border: '1px solid var(--line)', borderRadius: '8px', background: '#fff' } });
    const draw = (v) => { let c; try { c = scssCompile(v); } catch (e) { c = '/* エラー */'; } out.replaceChildren(code(c || '/* ここに CSS が出る */', 'css', { file: '出力：style.css', color: TS })); frame.srcdoc = `<style>body{font-family:sans-serif;margin:12px}${c}</style><div class="card"><h3>カード</h3><button class="btn">ボタン</button></div>`; };
    const ed = K.W.codeEditor(init, 'css', draw); ed.style.borderRadius = '14px'; ed.style.minHeight = '440px';
    el.append(h('div', { class: 'split' }, h('div', { class: 'col' }, lbl('Sass / SCSS（編集OK）'), ed), h('div', { class: 'col' }, lbl('コンパイル結果 = ふつうの CSS'), out, frame)),
      h('div', { class: 'row', style: { marginTop: '12px' } }, h('span', { class: 'chip', style: { '--c': BASIC } }, '$変数：値を1か所で管理'), h('span', { class: 'chip', style: { '--c': TS } }, 'ネスト：親の中に子を書く'), h('span', { class: 'chip', style: { '--c': PINK } }, '&：親セレクタの別名')));
    draw(init);
  }

  K.reg({
    id: 'css', track: 'basic', title: 'CSS', sub: '見た目をつくる', emoji: '🎨',
    scenes: [
      { t: 'CSS の付け方 3 通り', lead: 'タブを切り替えて、<b>同じ見た目</b>でも書き方でどう違うか比べよう。', render: attachScene },
      { t: 'セレクタと強さ', tag: 'selector', lead: '「どの要素に？」を決めるのが<b>セレクタ</b>。ルール → 要素、要素 → ルール の両方向でクリックして確かめよう。', render: selectorScene },
      { t: '文字のスタイル', tag: 'font · text', lead: 'スライダーとボタンで <b>font / text のプロパティ</b>を動かそう。右のCSSが一緒に変わります。', render: fontScene },
      { t: 'ボックスモデル', tag: 'box model', lead: 'すべての要素は<b>4層の箱</b>。スライダーで動かして、幅の計算がどう変わるか見よう。', render: boxScene },
      { t: 'display：inline / block', tag: 'display', lead: '同じ要素でも <b>display</b> を変えると、並び方と「幅・高さが効くか」が変わる。', render: displayScene },
      { t: 'Flexbox で並べる', tag: 'display:flex', lead: 'ボタンを押すだけでレイアウトが変わる。<b>主軸と交差軸</b>の考え方がコツ。', render: flexScene },
      { t: 'position：重ねる・ずらす', tag: 'position', lead: 'B だけに position を付けて、<b>C がどう動くか</b>に注目！親の relative の有無も試そう。', render: positionScene },
      { t: 'fixed と sticky', tag: 'scroll', lead: 'position を切り替えて、右の枠を<b>スクロール</b>。ヘッダーの動きの違いを体感しよう。', render: stickyScene },
      { t: 'z-index：重なり順', tag: 'z-index', lead: 'カードを<b>クリック</b>すると最前面へ。数字（z-index）が大きいほど手前に来る。', render: zScene },
      { t: 'Sass（プラスα）', tag: 'SCSS', lead: 'CSS をもっと書きやすくする道具。左に書くと、右に<b>ふつうのCSS</b>へ変換されます。', render: sassScene },
      {
        t: '実践：中央ぞろえカード', tag: 'PRACTICE', lead: '<b>3行</b>書き足して、カードを画面の真ん中に置こう（目安 3分）。✓が3つ付いたらクリア！',
        hint: '<p>「並べ方」は親（今回は <code>body</code>）に書きます。</p><ul style="line-height:1.9"><li><code>display: flex;</code> … 中身を並べる状態にする</li><li><code>justify-content: center;</code> … <b>横</b>の真ん中</li><li><code>align-items: center;</code> … <b>縦</b>の真ん中</li></ul><p style="color:var(--mute);font-size:.875rem">grid と <code>place-items: center</code> でも OK。</p>',
        render(el) {
          el.append(playground({
            title: 'HTML + CSS', mode: 'web',
            solution: { 'style.css': 'body {\n  margin: 0;\n  min-height: 100vh;\n  display: flex;\n  justify-content: center; /* 横の真ん中 */\n  align-items: center;     /* 縦の真ん中 */\n}\n\n.card {\n  background: #eef4ff;\n  padding: 24px 32px;\n  border-radius: 16px;\n}\n' },
            files: [
              { name: 'index.html', lang: 'html', code: '<div class="card">\n  <h2>Hello CSS</h2>\n  <p>私は画面の真ん中に行きたい！</p>\n</div>\n' },
              { name: 'style.css', lang: 'css', code: 'body {\n  margin: 0;\n  min-height: 100vh;\n  /* ここに3行書く：flex にして、横・縦の真ん中にする */\n}\n\n.card {\n  background: #eef4ff;\n  padding: 24px 32px;\n  border-radius: 16px;\n}\n' },
            ],
            tasks: (v, c) => {
              const d = c.doc && c.doc();
              const labels = ['body を flex（か grid）にする', 'カードが横の真ん中にある', 'カードが縦の真ん中にある'];
              if (!d || !d.body || !d.defaultView) return labels.map((l) => ({ label: l, ok: false }));
              const CARD = '\n.card {\n  background: #eef4ff;\n  padding: 24px 32px;\n  border-radius: 16px;\n}\n', HEAD = 'body {\n  margin: 0;\n  min-height: 100vh;\n';
              const CSS1 = HEAD + '  display: flex;\n}\n' + CARD, CSS2 = HEAD + '  display: flex;\n  justify-content: center;\n}\n' + CARD, CSS3 = HEAD + '  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n' + CARD;
              const g = (e) => d.defaultView.getComputedStyle(e), card = d.querySelector('.card');
              if (!card) return labels.map((l) => ({ label: l, ok: false }));
              const r = card.getBoundingClientRect(), W = d.documentElement.clientWidth, H = d.documentElement.clientHeight;
              return [
                { label: labels[0], ok: /flex|grid/.test(g(d.body).display), hint: ['「並べ方」は親（body）に書く。<code>display</code> に何を入れる？', '<code>display: flex;</code> と書くと、中身を並べる状態になる。'], answer: { code: CSS1, lang: 'css', mode: 'replace' } },
                { label: labels[1], ok: r.width < W - 20 && Math.abs(r.left + r.width / 2 - W / 2) <= 3, hint: ['「横」の並び方は <code>justify-content</code> で決める。', 'body に <code>justify-content: center;</code> を足そう（flex にした後で）。'], answer: { code: CSS2, lang: 'css', mode: 'replace' } },
                { label: labels[2], ok: Math.abs(r.top + r.height / 2 - H / 2) <= 3, hint: ['「縦」の並び方は <code>align-items</code> で決める。', 'body に <code>align-items: center;</code> を足そう。縦が効くのは、body に高さ（<code>min-height: 100vh</code>）があるから。'], answer: { code: CSS3, lang: 'css', mode: 'replace' } },
                { optional: true, label: 'カードの幅を 360px までにして、文字も中央ぞろえにする', ok: r.width > 0 && r.width <= 361 && g(card).textAlign === 'center', hint: ['幅の上限は <code>max-width</code>、文字の寄せ方は <code>text-align</code>。', '<code>.card</code> に <code>max-width: 360px;</code> と <code>text-align: center;</code> を足す。'], answer: { code: CSS3.replace('  padding: 24px 32px;', '  max-width: 360px;\n  text-align: center;\n  padding: 24px 32px;'), lang: 'css', mode: 'replace' } },
              ];
            },
          }));
        },
      },
    ],
  });

  /* ============================================================
     Q1: 問題 → 考え方 → 解決 (why) / 使い分け quizzes / new "why" scenes
  ============================================================ */
  style('q1', `
  .cgw-p{justify-content:flex-start!important;background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:10px}
  .cgw-h{display:flex;align-items:center;gap:.5em;font-weight:900;font-size:.95rem}.cgw-h .ic{width:18px;height:18px}.cgw-h small{margin-left:auto;color:var(--mute);font-weight:700;font-size:.72rem}
  .cgw-g{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:5px}
  .cgw-f{font:600 .68rem var(--mono);padding:.35em .15em;border-radius:5px;background:var(--card2);border:1px solid var(--line);text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer;transition:.25s}
  .cgw-f.done{background:color-mix(in srgb,var(--ok) 20%,transparent);border-color:var(--ok);color:var(--ok)}
  .cgw-s{display:flex;gap:16px;align-items:baseline;font-size:.8rem;font-weight:700;color:var(--mute);flex-wrap:wrap}.cgw-s b{font:900 1.35rem var(--mono);color:var(--text)}
  .cgw-cmd{font:600 .78rem/1.6 var(--mono);background:var(--code);color:#9be58b;border-radius:8px;padding:.6em .9em;white-space:pre-wrap;word-break:break-all}
  .gw-man{display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:stretch}.gw-box{justify-content:flex-start!important;background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;min-height:250px;transition:.4s}
  .gw-box.dim{opacity:.35;filter:saturate(.3)}
  .gw-file{display:flex;align-items:center;gap:.5em;font:600 .8rem var(--mono);padding:.4em .7em;border-radius:6px;background:var(--card2);border:1px solid var(--line);animation:pop .4s both}
  .gw-file .q{margin-left:auto;color:var(--bad);font-weight:900}
  .gw-warn{margin-top:auto;padding:.5em .8em;border-radius:8px;font-weight:800;font-size:.85rem;background:color-mix(in srgb,var(--bad) 14%,transparent);border:1px solid var(--bad);color:var(--bad);display:flex;gap:.5em;align-items:center}
  .gw-ok{margin-top:auto;padding:.5em .8em;border-radius:8px;font-weight:800;font-size:.85rem;background:color-mix(in srgb,var(--ok) 14%,transparent);border:1px solid var(--ok);color:var(--ok);display:flex;gap:.5em;align-items:center}
  .gw-commit{display:flex;align-items:center;gap:.6em;font-size:.82rem;font-weight:700;padding:.35em .7em;border-radius:6px;background:var(--card2);border:1px solid var(--line);animation:pop .4s both}
  .gw-commit i{width:10px;height:10px;border-radius:50%;background:var(--ts);flex:none}.gw-commit small{margin-left:auto;color:var(--mute);font-family:var(--mono);font-size:.7rem}
  .gw-ppl{display:flex;gap:10px;align-items:center;justify-content:center;font-weight:800;font-size:.85rem;margin-top:4px}
  .gw-ppl span{display:inline-flex;gap:.35em;align-items:center;padding:.2em .7em;border-radius:6px;background:var(--card2);border:1px solid var(--line)}
  .q1-mq{display:grid;gap:12px;margin-top:18px}.q1-mq .card{display:grid;gap:10px}
  @media(max-width:900px){.gw-man{grid-template-columns:1fr}}
  `);

  /* --- helper: tiny "どっちを選ぶ？" quiz card --- */
  function pickQuiz(el, title, items) {
    const wrap = h('div', { class: 'q1-mq' }, lbl(title));
    items.forEach((it) => wrap.append(h('div', { class: 'card' }, quiz(it))));
    el.append(wrap);
  }

  /* --- new scene: なぜターミナル？ (GUI vs CUI) --- */
  const sceneWhyCui = {
    t: 'なぜターミナル？', tag: 'CUI',
    lead: '写真 <b>30枚</b>のファイル名に「trip_」を付けたい。<b>マウス（GUI）</b>と<b>文字の命令（CUI）</b>で、手間がどう違うか比べてみよう。',
    why: {
      problem: '30個のファイルを1つずつ改名… <b>クリック30回</b>、間違いもしやすい',
      idea: '手順を「文字の命令」にすれば、<b>機械が何度でも正確に</b>繰り返してくれる',
      answer: '<b>CUI（ターミナル）</b>：命令を1行書いて実行',
      when: [['同じ作業を何度も／大量にある', 'CUI'], ['色・配置を目で見て決める', 'GUI'], ['サーバー・開発ツール（画面が無い）', 'CUI']],
    },
    render(el) {
      const N = 30, names = Array.from({ length: N }, (_, i) => `photo${i + 1}.jpg`);
      const mkSide = () => {
        const tiles = names.map((n) => h('span', { class: 'cgw-f' }, n));
        return { tiles, grid: h('div', { class: 'cgw-g' }, tiles) };
      };
      const G = mkSide(), C = mkSide();
      let clicks = 0;
      const gStat = h('div', { class: 'cgw-s' }), cStat = h('div', { class: 'cgw-s' });
      const showG = () => { const d = G.tiles.filter((t) => t.classList.contains('done')).length; gStat.replaceChildren(h('span', '操作 ', h('b', clicks), ' 回'), h('span', '目安 ', h('b', clicks * 5), ' 秒'), h('span', '完了 ', h('b', d + '/' + N))); };
      const showC = (cmds, ms, done) => cStat.replaceChildren(h('span', '操作 ', h('b', cmds), ' 回'), h('span', '目安 ', h('b', ms), ' 秒'), h('span', '完了 ', h('b', done + '/' + N)));
      const ren = (t) => { if (t.classList.contains('done')) return; t.classList.add('done'); t.textContent = 'trip_' + t.textContent; };
      G.tiles.forEach((t) => t.addEventListener('click', () => { if (t.classList.contains('done')) return; clicks++; ren(t); showG(); }));
      let auto = null;
      const autoBtn = h('button', { class: 'btn', onclick: () => {
        if (auto) return;
        auto = setInterval(() => { const t = G.tiles.find((x) => !x.classList.contains('done')); if (!t) { clearInterval(auto); auto = null; return; } clicks++; ren(t); showG(); }, 70);
      } }, icon('fast-forward'), '早送りで全部やる');
      const run = h('button', { class: 'btn primary', style: { '--c': 'var(--ts)' }, onclick: () => {
        C.tiles.forEach((t, i) => setTimeout(() => ren(t), i * 12)); showC(1, 0.1, N);
      } }, icon('play'), '実行 (Enter)');
      const reset = h('button', { class: 'btn ghost', onclick: () => {
        clearInterval(auto); auto = null; clicks = 0;
        [G, C].forEach((s) => s.tiles.forEach((t, i) => { t.classList.remove('done'); t.textContent = names[i]; }));
        showG(); showC(0, 0, 0);
      } }, icon('rotate-ccw'), 'リセット');
      const guiP = h('div', { class: 'cgw-p' }, h('div', { class: 'cgw-h' }, icon('mouse-pointer-click'), 'GUI：1つずつクリックして改名', h('small', '← タイルをクリック')), G.grid, gStat, h('div', { class: 'row' }, autoBtn));
      const cuiP = h('div', { class: 'cgw-p' }, h('div', { class: 'cgw-h' }, icon('terminal'), 'CUI：1行の命令', h('small', '← 実行を押す')), C.grid, cStat,
        h('div', { class: 'cgw-cmd' }, 'for f in photo*.jpg; do\n  mv "$f" "trip_$f"\ndone'), h('div', { class: 'row' }, run));
      el.append(h('div', { class: 'split' }, guiP, cuiP), h('div', { class: 'row', style: { marginTop: '12px' } }, reset));
      showG(); showC(0, 0, 0);
      el.append(h('div', { class: 'card', style: { marginTop: '14px' } }, quiz({
        q: 'ログファイル（10万行）から <code class="i">ERROR</code> を含む行だけ探したい。どうする？',
        options: ['エディタで開いて、目で探す', '<code class="i">grep ERROR app.log</code> と打つ', '1行ずつコピーして確認'], answer: 1,
        why: '大量データの検索・繰り返しは CUI の得意分野。',
      })));
      return () => clearInterval(auto);
    },
  };

  /* --- new scene: なぜ Git？ (final_v2 problem) --- */
  const sceneWhyGit = {
    t: 'なぜ Git？', tag: 'why',
    lead: 'まず<b>困りごと</b>から。「次へ」で、ファイル名で管理する世界 → Git の世界へ進みます。',
    why: {
      problem: '<code>report_最終_本当_修正.html</code> … どれが最新？ 誰が直した？ 2人で上書き事故も',
      idea: 'ファイルは<b>1つのまま</b>。「変更の履歴（誰が・いつ・なぜ）」だけを積み重ねる',
      answer: '<b>Git</b>（履歴管理）＋ <b>GitHub</b>（共有）',
      when: [['1人・使い捨てのメモ', 'ファイル名管理でも可'], ['コード／2人以上／戻したい可能性あり', 'Git'], ['チームで共有・レビュー', 'Git + GitHub']],
    },
    render(el) {
      const LN = ['report.html', 'report_v2.html', 'report_最終.html', 'report_最終_本当.html', 'report_最終_本当_修正.html'];
      const left = h('div', { class: 'gw-box' }), right = h('div', { class: 'gw-box' });
      const head = (ic, t, c) => h('div', { class: 'cgw-h', style: { color: c } }, icon(ic), t);
      el.append(stepper({
        color: 'var(--ts)', interval: 2600,
        steps: [
          { say: 'レポートを直すたびに<b>「名前を付けて保存」</b>していませんか？ まだ1つだけ。' },
          { say: '1週間後…ファイルが増殖。<b>どれが最新？</b> どこが違う？ 自分にも分からない。' },
          { say: '2人が同じファイルを編集 → <b>片方が上書き</b>。相手の変更が消えた！' },
          { say: '<b>考え方を変える</b>：ファイルは1つ。変更を<b>履歴</b>として積む。誰が・いつ・なぜ、が残る。' },
          { say: '履歴があるので<b>どの時点にも戻せる</b>。GitHub に置けば全員が同じ履歴を共有できる。これが Git。' },
        ],
        init(vis) { vis.append(h('div', { class: 'gw-man' }, left, right)); },
        update(n) {
          const files = n === 0 ? LN.slice(0, 1) : LN;
          left.className = 'gw-box' + (n >= 3 ? ' dim' : '');
          left.replaceChildren(...[head('files', 'ファイル名で管理', 'var(--team)'),
            ...files.map((f, i) => h('div', { class: 'gw-file', style: { animationDelay: i * 60 + 'ms' } }, icon('file-text'), f, n >= 1 && n < 3 ? h('span', { class: 'q' }, '?') : null)),
            n === 1 ? h('div', { class: 'gw-warn' }, icon('circle-help'), 'どれが最新？ 何が違う？') : null,
            n === 2 ? h('div', { class: 'gw-ppl' }, h('span', icon('user'), 'A さん'), icon('arrow-right'), h('span', icon('file-text'), 'report.html'), icon('arrow-left'), h('span', icon('user'), 'B さん')) : null,
            n === 2 ? h('div', { class: 'gw-warn' }, icon('triangle-alert'), '上書き事故：B さんの変更が消えた') : null].filter(Boolean));
          const C = [['見出しを追加', 'Lam · 10:02'], ['画像を差し替え', 'Mai · 11:30'], ['誤字を修正', 'Lam · 13:15']];
          right.className = 'gw-box' + (n < 3 ? ' dim' : '');
          right.replaceChildren(...[head('git-branch', 'Git で管理', 'var(--ts)'),
            n < 3 ? h('div', { style: { color: 'var(--mute)', fontWeight: 700, fontSize: '.85rem' } }, '（まだ使っていない）')
              : h('div', { class: 'gw-file' }, icon('file-text'), 'report.html', h('span', { style: { marginLeft: 'auto', color: 'var(--ok)', fontSize: '.72rem' } }, 'ずっとこの1つ')),
            ...(n >= 3 ? C.map(([m, w], i) => h('div', { class: 'gw-commit', style: { animationDelay: i * 120 + 'ms' } }, h('i'), m, h('small', w))) : []),
            n === 3 ? h('div', { class: 'gw-ok' }, icon('history'), 'いつでも好きな時点に戻れる') : null,
            n === 4 ? h('div', { class: 'gw-ok' }, icon('users'), 'GitHub で全員が同じ履歴を共有') : null].filter(Boolean));
        },
      }));
    },
  };

  /* --- attach: scenes, why, extra quizzes ------------------------------------ */
  (function attach() {
    const L = K.lessons;
    const ins = (lid, scene, at) => { const a = L[lid].scenes; if (!a.some((s) => s.t === scene.t)) a.splice(at, 0, scene); };
    ins('cuivim', sceneWhyCui, 0);
    ins('git', sceneWhyGit, 0);

    const F = (items, loop, cap) => ({ k: 'flow', items, loop, cap });
    const C = (text, o = {}) => Object.assign({ k: 'code', lang: 'html', text }, o);
    const VS = (a, b, cap) => ({ k: 'vs', a, b, cap });
    const ST = (items, cap) => ({ k: 'stack', items, cap });
    const CH = (items, cap) => ({ k: 'chips', items, cap });
    const BG = (i, t, cap) => ({ k: 'big', i, t, cap });
    const ME = (items, cap) => ({ k: 'meter', items, cap });
    const bad = (i, t) => ({ i, t, c: 'bad' }), warn = (i, t) => ({ i, t, c: 'warn' }), ok = (i, t) => ({ i, t, c: 'ok' });
    const WHY = {
      cuivim: {
        'ターミナルを触ってみよう': {
          problem: '「今どこ？」「何がある？」… 画面が無いと<b>迷子</b>になる',
          idea: '「今いる場所」を基準に、<b>1コマンド＝1操作</b>で動く',
          answer: '<code>pwd</code> / <code>ls</code> / <code>cd</code> / <code>mkdir</code> …',
          when: [['今どこ？何がある？', 'pwd / ls'], ['別の場所へ行く', 'cd（.. は1つ上）'], ['作る・消す・動かす', 'mkdir touch / rm / mv'], ['中身を探す', 'cat / grep']],
          pv: F([bad('circle-help', '今どこ？'), bad('folder-search', '何がある？')], null, '目印がなくて迷子'),
          iv: F(['map-pin|今の場所', 'terminal|1命令＝1操作', 'footprints|1歩ずつ進む']),
          av: C('pwd      # 今どこ\nls       # 何がある\ncd docs  # 移動', { lang: 'sh', ok: [1, 2, 3] }),
        },
        'Vim：3つのモード': {
          problem: 'サーバーにはマウスも画面も無い。それでも<b>ファイルを直したい</b>',
          idea: 'キーを「文字を書く」と「命令」で<b>切り替えて使う（モード）</b>',
          answer: '<b>Normal / Insert / Command</b> の3つの部屋',
          when: [['動く・消す・コピーする', 'Normal（迷ったら Esc）'], ['文字を書く', 'Insert（i / a / o）'], ['保存・終了', 'Command（:wq）']],
          pv: F([bad('mouse-off', 'マウスなし'), warn('file-pen', 'でも直したい')]),
          iv: F(['keyboard|同じキーでも', 'toggle-left|モードで意味が変わる']),
          av: CH(['NORMAL 動く・消す', 'INSERT 書く', 'COMMAND 保存']),
        },
      },
      git: {
        '4つの場所とコマンド': {
          problem: '保存した途端、<b>作りかけまで全部</b>記録されると困る。共有もしたい',
          idea: '<b>記録したい変更だけ選び</b>（add）、<b>まとまりごと</b>に記録（commit）、最後に共有（push）',
          answer: '作業 → ステージ → ローカル → リモート の4か所',
          when: [['どの変更を記録する？', 'git add'], ['まとまりに名前を付けて保存', 'git commit'], ['チームに共有する', 'git push'], ['みんなの最新を取り込む', 'git pull']],
          pv: F([warn('pencil', '作りかけ'), bad('git-commit-horizontal', '全部記録'), bad('users', '全員に見える')]),
          iv: F(['mouse-pointer-click|選ぶ add', 'package|まとめる commit', 'send|共有 push']),
          av: C('git add a.html\ngit commit -m "見出し"\ngit push', { lang: 'sh', ok: [1, 2, 3] }),
        },
        'ブランチとマージ': {
          problem: '全員が main を直接いじると、<b>作りかけに全員が巻き込まれる</b>',
          idea: '<b>自分用の枝</b>で作って、できたら main に合流させる',
          answer: 'branch → commit → merge',
          when: [['main が進んでいない', 'Fast-forward（一直線）'], ['main も別に進んだ', 'マージコミット（合流）'], ['新機能・修正を始める', 'まず branch を切る']],
          pv: F([warn('users', 'みんなで main'), bad('bomb', '作りかけが全員に')]),
          iv: F(['git-branch|枝を作る', 'pencil|枝の上で作業', 'git-merge|できたら合流']),
          av: C('git switch -c feature\ngit commit -m "…"\ngit merge feature', { lang: 'sh', ok: [1, 2, 3] }),
        },
        'コンフリクトを解決しよう': {
          problem: '同じ行を2人が別々に変更 → Git は<b>どちらが正しいか決められない</b>',
          idea: '機械が決められない所だけ、<b>人が選ぶ</b>。印（&lt;&lt;&lt;&lt;&lt;&lt;&lt;）が目印',
          answer: '印を見て残す内容を決め、印を<b>全部消して</b> add → commit',
          when: [['自分の変更が正しい', 'HEAD 側を残す'], ['相手が正しい', '相手側を残す'], ['両方必要', '両方残して整える']],
          pv: F([warn('user', 'A が変更'), warn('user', 'B も同じ行'), bad('swords', 'どっち？')]),
          iv: F(['cpu|機械は決められない', 'user-check|人が選ぶ']),
          av: C('<<<<<<< 自分\n=======\n>>>>>>> 相手', { lang: 'text', ok: [1, 2, 3] }),
        },
        'GitHub と SSH でつなぐ': {
          problem: '毎回パスワード入力＋<b>漏れたら終わり</b>。安全に本人確認したい',
          idea: '<b>鍵のペア</b>：秘密鍵は手元に置き、公開鍵だけ相手に渡す',
          answer: 'SSH キー（<code>ssh-keygen</code> → GitHub に公開鍵を登録）',
          when: [['PCから絶対に出さない', '秘密鍵 id_ed25519'], ['GitHub に登録する', '公開鍵 .pub']],
          pv: F([warn('key-round', '毎回パスワード'), bad('eye', '漏れたら…')]),
          iv: VS({ i: 'lock', t: '秘密鍵', s: '手元だけ' }, { i: 'key', t: '公開鍵', s: '渡してOK' }),
          av: C('ssh-keygen -t ed25519\ncat ~/.ssh/id_ed25519.pub', { lang: 'sh', ok: [1, 2] }),
        },
      },
      css: {
        'CSS の付け方 3 通り': {
          problem: '見出し20個の色を変えたい… <b>20か所</b>直す？',
          idea: '見た目を<b>1か所にまとめて</b>、HTML と分ける',
          answer: '外部 CSS を <code>&lt;link&gt;</code> で読み込む',
          when: [['急ぎの試し書き', 'inline style（非推奨）'], ['1ページだけ', 'style タグ'], ['サイト全体・チーム開発', '外部 CSS（推奨）']],
          pv: F([warn('copy', '20か所に書く'), bad('pencil', '直すのも20か所')]),
          iv: F(['file-code|HTML', 'link|読み込む', 'file-type|style.css']),
          av: C('<link rel="stylesheet"\n      href="style.css">', { ok: [1, 2] }),
        },
        'セレクタと強さ': {
          problem: '同じ要素に<b>複数のルール</b>が当たったら、どれが効く？',
          idea: '「ねらいが細かいほど強い」。強さの数字で<b>どれが勝つか</b>が決まる',
          answer: '<code>#id</code>(100) &gt; <code>.class</code>(10) &gt; <code>タグ</code>(1)',
          when: [['全体の基本スタイル', 'タグ'], ['使い回す部品', '.class（基本はこれ）'], ['ページに1つだけ・JS用', '#id（CSS では控えめに）']],
          pv: C('p     { color: blue }\n.note { color: red }\n/* どっちの色？ */', { lang: 'css', err: [3] }),
          iv: ME([{ t: '#id', v: 1, c: 'hi' }, { t: '.class', v: 0.6, c: 'ok' }, { t: 'タグ', v: 0.2 }], 'ねらいが細かいほど強い'),
          av: C('p     { color: blue }   /* 1 */\n.note { color: red }    /* 10 */\n#main { color: green }  /* 100 */', { lang: 'css', ok: [3] }),
        },
        '文字のスタイル': {
          problem: '文字がぎっしりで、どこが大事か分からず<b>読みにくい</b>',
          idea: 'サイズ・太さ・行間で、<b>大事さの差</b>を見た目に出す',
          answer: '<code>font-size</code> / <code>font-weight</code> / <code>line-height</code>',
          when: [['見出しと本文に差を付ける', 'size + weight'], ['長文を読みやすく', 'line-height 1.6〜1.8'], ['強調したい', 'weight か color（多用しない）']],
          pv: F([bad('align-justify', '同じ大きさでぎっしり')], null, '読む気がしない'),
          iv: F(['heading|大きさ・太さ', 'rows-3|行間', 'star|強弱をつける']),
          av: C('h1 { font-size: 2rem; }\np  { line-height: 1.7; }', { lang: 'css', ok: [1, 2] }),
        },
        'ボックスモデル': {
          problem: '余白をあけたつもりが、<b>思った所があかない</b>（中？外？）',
          idea: 'すべての要素は<b>4層の箱</b>。どの層をいじるか選ぶ',
          answer: 'content / <b>padding</b> / border / <b>margin</b>',
          when: [['箱の中の余白（背景色も広がる）', 'padding'], ['箱と箱のすき間', 'margin'], ['枠線', 'border']],
          pv: F([warn('ruler', '余白をあけたのに'), bad('circle-help', '思った所があかない')]),
          iv: CH(['content', 'padding', 'border', 'margin'], '外から: margin → border → padding → 中身'),
          av: C('padding: 24px;  /* 中の余白 */\nmargin: 24px;  /* 外のすき間 */', { lang: 'css', ok: [1, 2] }),
        },
        'display：inline / block': {
          problem: '<code>width</code> を指定したのに<b>効かない</b>／勝手に横に並ぶ',
          idea: '要素には「行の中に並ぶ」か「1行を使う」かの<b>性質</b>がある',
          answer: '<code>display</code> で性質を切り替える',
          when: [['改行して全幅を使う', 'block'], ['文の中に並ぶ（幅・高さは効かない）', 'inline'], ['横に並べて幅も指定', 'inline-block / flex']],
          pv: C('span { width: 200px; }\n/* 幅が効かない！ */', { lang: 'css', err: [1] }),
          iv: VS({ i: 'text-cursor', t: 'inline', s: '文の流れ' }, { i: 'rectangle-horizontal', t: 'block', s: '1行まるごと' }),
          av: C('span {\n  display: inline-block;\n  width: 200px;\n}', { lang: 'css', ok: [2, 3] }),
        },
        'Flexbox で並べる': {
          problem: '横並び・中央寄せが<b>margin や float でぐちゃぐちゃ</b>',
          idea: '親に「並べ方」を指示する。軸（主軸・交差軸）で考える',
          answer: '<code>display: flex</code>',
          when: [['1方向（横一列／縦一列）', 'flex'], ['行×列の格子', 'grid'], ['ただ縦に積むだけ', 'block のままで OK']],
          pv: F([warn('move-horizontal', '横に並べたい'), bad('bug', 'float でずれる')]),
          iv: F(['box|親に指示', 'arrow-right-left|主軸', 'arrow-up-down|交差軸']),
          av: C('.box {\n  display: flex;\n  justify-content: center;\n}', { lang: 'css', ok: [2, 3] }),
        },
        'position：重ねる・ずらす': {
          problem: '要素を<b>決まった位置</b>に置きたい・<b>重ねたい</b>',
          idea: '<b>基準点</b>を決めてから、ずらす',
          answer: '<code>position</code> + top / left',
          when: [['少しずらす', 'relative'], ['親の中の好きな位置', '親 relative ＋ 子 absolute'], ['画面に固定', 'fixed'], ['スクロールで貼り付く', 'sticky']],
          pv: F([warn('move', '好きな位置に置きたい'), bad('ban', '動かない')]),
          iv: F(['anchor|基準を決める', 'move-diagonal|そこからずらす']),
          av: C('.parent { position: relative; }\n.badge  { position: absolute;\n  right: 0; top: 0; }', { lang: 'css', ok: [1, 2, 3] }),
        },
        'fixed と sticky': {
          problem: 'スクロールすると<b>ヘッダーが消えて</b>、メニューを探し直し',
          idea: '<b>スクロールしたときの動き</b>を指定する',
          answer: '<code>fixed</code> / <code>sticky</code>',
          when: [['常に画面の同じ位置', 'fixed'], ['ある位置まで来たら貼り付く', 'sticky'], ['ふつうに流す', 'static']],
          pv: F([warn('scroll-text', 'スクロール'), bad('eye-off', 'ヘッダーが消える')]),
          iv: F(['mouse-pointer|スクロール', 'pin|どう動く？']),
          av: C('header {\n  position: sticky;\n  top: 0;\n}', { lang: 'css', ok: [2, 3] }),
        },
        'z-index：重なり順': {
          problem: 'ポップアップを出したのに、<b>背面に隠れた</b>',
          idea: '重なりに<b>順位の数字</b>を付ける。大きいほど手前（position を付けた要素などで効く）',
          answer: '<code>z-index</code>',
          when: [['ふつうのページ', '指定しない'], ['ヘッダー・モーダル', '大きめの値を1か所で決める']],
          pv: F([warn('layers', 'ポップアップ'), bad('eye-off', '背面に隠れた')]),
          iv: F(['layers|重なりに', 'hash|数字が大きいほど手前']),
          av: C('.modal {\n  position: relative;\n  z-index: 100;\n}', { lang: 'css', ok: [2, 3] }),
        },
        'Sass（プラスα）': {
          problem: 'ブランドカラーを<b>30か所</b>に書いた。色を変えるとき地獄',
          idea: '変数・入れ子で<b>「1か所に書く」</b>。書いたら CSS に変換',
          answer: '<b>Sass / SCSS</b>（変換して CSS にする）',
          when: [['小規模', '素の CSS（--変数 でも可）'], ['大規模・チーム', 'Sass']],
          pv: C('a { color: #3b82f6 }\nb { color: #3b82f6 }\n/* …あと28か所 */', { lang: 'css', err: [1, 2] }),
          iv: F(['variable|変数にまとめる', 'file-cog|CSS に変換']),
          av: C('$brand: #3b82f6;\na { color: $brand; }\nb { color: $brand; }', { lang: 'css', ok: [1, 2, 3] }),
        },
      },
    };
    // the two new scenes carry their own why: add their illustrations
    Object.assign(sceneWhyCui.why, {
      pv: ST(['mouse-pointer-click|1枚目を改名', 'mouse-pointer-click|2枚目を改名', 'ellipsis|…30枚目まで'], '同じクリックを30回'),
      iv: F(['list|手順を言葉にする', 'terminal|命令にする', 'repeat|機械に任せる']),
      av: C('for f in photo*.jpg; do\n  mv "$f" "trip_$f"\ndone', { lang: 'sh', ok: [1, 2, 3] }),
    });
    Object.assign(sceneWhyGit.why, {
      pv: ST(['file|report.html', 'file|report_v2.html', 'file|report_最終_本当.html'], 'どれが最新？'),
      iv: F(['file|ファイルは1つ', 'history|変更を履歴で積む']),
      av: CH([ok('user', '誰が'), ok('clock', 'いつ'), ok('message-square', 'なぜ'), ok('undo-2', '戻せる')]),
    });
    Object.entries(WHY).forEach(([lid, m]) => L[lid].scenes.forEach((s) => { if (m[s.t]) s.why = m[s.t]; }));

    // clarity pass: short, concrete wording (overrides the earlier text)
    const TXT = {
      cuivim: {
        'なぜターミナル？': { idea: '手順を<b>1行の命令</b>にすれば、機械が何度でも間違えずに繰り返してくれる' },
        'ターミナルを触ってみよう': { idea: '<b>「今いる場所」</b>から、1つの命令で1つのことをする' },
        'Vim：3つのモード': { idea: '同じキーでも、<b>「文字を書く」ときと「命令する」ときで役目が変わる</b>（モード）' },
      },
      git: {
        'なぜ Git？': { lead: 'まず困りごとから。「次へ」で、ファイル名で整理するやり方 → Git のやり方へ進みます。', idea: 'ファイルは<b>1つのまま</b>。<b>「誰が・いつ・なぜ変えたか」</b>を記録していく' },
        '4つの場所とコマンド': { idea: '記録したい変更だけ<b>選び</b>（add）、<b>1まとまりずつ記録</b>して（commit）、最後に<b>送る</b>（push）' },
        'コンフリクトを解決しよう': { lead: 'Git は、同じ行を別々に変えられると決められなくて、印を付けます。<b>緑（自分）</b>か<b>青（相手）</b>をクリックして選ぼう。' },
      },
      css: {
        'Flexbox で並べる': { problem: '横並びや中央寄せが、<b><code>margin</code> や <code>float</code> でぐちゃぐちゃ</b>', idea: '親に<b>「どう並べるか」</b>を書く。「横」と「縦」の2つの向き（主軸・交差軸）で考える' },
        'fixed と sticky': { idea: 'スクロールしたとき、<b>どう動くか</b>を決める' },
        'z-index：重なり順': { idea: '重なりに<b>順位の数字</b>を付ける。大きいほど手前に出る（position を付けた要素で効く）' },
        'Sass（プラスα）': { idea: '変数や入れ子で<b>「1か所に書く」</b>。書いたあと、ふつうの CSS に変換する' },
      },
    };
    Object.entries(TXT).forEach(([lid, m]) => L[lid].scenes.forEach((s) => { const t = m[s.t]; if (!t) return; if (t.lead) s.lead = t.lead; ['problem', 'idea', 'answer'].forEach((k) => { if (t[k] && s.why) s.why[k] = t[k]; }); }));


    // secondary content lives in header-icon modals (ref), not in the page body
    const extra = (lid, title, fn) => { const s = L[lid].scenes.find((x) => x.t === title); if (!s) return; (s.ref = s.ref || []).push({ title: 'どっちを選ぶ？ クイズ', icon: 'list-checks', node: () => { const box = h('div'); fn(box); return box.firstChild || box; } }); };
    const pull = (lid, title, find, rtitle, ric) => {
      const s = L[lid].scenes.find((x) => x.t === title); if (!s) return;
      const holder = {}; (s.ref = s.ref || []).push({ title: rtitle, icon: ric, node: () => (holder.n ? holder.n.cloneNode(true) : h('div')) });
      const o = s.render; s.render = function (el, ctx) { const r = o.call(this, el, ctx); const n = find(el); if (n) { holder.n = n; n.remove(); } return r; };
    };
    pull('cuivim', 'ターミナルを触ってみよう', (el) => [...el.querySelectorAll('p.lead')].find((p) => /上書き/.test(p.textContent)), 'メモ：> と cd ..', 'sticky-note');
    pull('cuivim', 'Vim：3つのモード', (el) => el.querySelector('.cgk-note'), 'こつ：迷ったら Esc', 'life-buoy');
    pull('git', 'コンフリクトを解決しよう', (el) => [...el.querySelectorAll('.card')].find((c) => c.textContent.includes('印の読み方')), '印の読み方', 'book-open');
    extra('css', 'ボックスモデル', (el) => pickQuiz(el, 'どっちを使う？', [
      { q: 'カードの<b>内側</b>に余白をあけたい。背景色も広げたい', options: ['margin', 'padding'], answer: 1, why: '内側の余白＝padding。背景色は padding の部分にも広がる。' },
      { q: 'ボタンと隣のボタンの<b>すき間</b>をあけたい', options: ['margin', 'padding'], answer: 0, why: '箱と箱のすき間＝margin。' },
    ]));
    extra('css', 'display：inline / block', (el) => pickQuiz(el, 'どれにする？', [
      { q: '<code class="i">&lt;span&gt;</code> に <code class="i">width:200px</code> を指定したのに効かない。どうする？', options: ['position を付ける', 'display: inline-block にする', 'margin を増やす'], answer: 1, why: 'span は inline なので幅が効かない。inline-block か block にすれば効く。' },
    ]));
    extra('css', 'Flexbox で並べる', (el) => pickQuiz(el, 'flex？ grid？', [
      { q: 'ナビゲーションのリンクを<b>横一列</b>に並べたい', options: ['flex', 'grid'], answer: 0, why: '1方向（1次元）の並びは flex が得意。' },
      { q: '写真を<b>3列×3行の格子</b>に並べたい', options: ['flex', 'grid'], answer: 1, why: '行と列の2次元は grid が得意。' },
    ]));
    extra('css', 'position：重ねる・ずらす', (el) => pickQuiz(el, '基準はどれ？', [
      { q: '親の<b>右下の角</b>にバッジを置きたい。正しい組み合わせは？', options: ['親 relative ＋ バッジ absolute', '親 absolute ＋ バッジ relative', 'どちらも static'], answer: 0, why: 'absolute は「いちばん近い position 指定のある親」が基準。親を relative にしておく。' },
    ]));
    extra('css', 'CSS の付け方 3 通り', (el) => pickQuiz(el, '迷ったら？', [
      { q: '5ページあるサイトで、ボタンの色を<b>全ページ同時に</b>変えたい', options: ['各ページに inline style', '外部 CSS ファイル', 'style タグを各ページに'], answer: 1, why: '1か所を直せば全ページに反映される＝外部 CSS。' },
    ]));
    // SSH: show the ssh-agent step visually (step 2 had no visual change)
    const setAns = (lid, title, a) => { const sc = L[lid].scenes.find((x) => x.t === title); if (sc) sc.answer = a; };
    setAns('cuivim', '実践：ターミナルで作ってみよう', { code: 'mkdir work\necho "apple" > work/fruit.txt\ngrep apple work/fruit.txt', lang: 'sh', file: 'answer.sh' });
    setAns('cuivim', 'Vim：3つのモード', { code: 'i              ← 挿入モードへ\n（何か文字を打つ）\nEsc            ← ノーマルモードに戻る\n:wq と Enter   ← 保存して終了', lang: 'text', file: '手順' });
    const bm = L.git.scenes.find((s) => s.t === 'ブランチとマージ');
    if (bm) (bm.ref = bm.ref || []).push({ title: 'ゴールとチャレンジ', icon: 'target', html: '<p><b>シナリオ1</b>：ログイン機能を別の枝で作って、できたら main に取り込む（Fast-forward）。</p><p><b>シナリオ2</b>：自分と同僚が別々に進めた変更を、1つの履歴に合流させる（マージコミット）。</p><p><b>自由に試す</b>：① branch 作成 → ② commit を2回 → ③ main に switch → ④ main で commit → ⑤ merge。マージコミットができたらクリア。</p>' });
    const ssh = L.git.scenes.find((s) => s.t === 'GitHub と SSH でつなぐ');
    if (ssh) { const o = ssh.render; ssh.render = function (el, ctx) { const r = o.call(this, el, ctx); const st = ctx.steppers[ctx.steppers.length - 1]; if (st) { const pc = el.querySelector('.cg-ssh .bx'); const tag = h('div', { class: 'tag', style: { opacity: 0 } }, icon('shield'), 'ssh-agent に登録済み'); pc.append(tag); const upd = () => { tag.style.opacity = st.cur >= 1 ? 1 : 0; }; const g = st.go; st.go = (n) => { g(n); upd(); }; el.querySelectorAll('.st-bar button').forEach((b) => b.addEventListener('click', () => setTimeout(upd, 0))); upd(); } return r; }; }
  })();
})();
