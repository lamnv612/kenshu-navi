/* 研修ナビ core — helpers + widgets. Plain script (no modules) so it works from file:// */
(function () {
  'use strict';
  const K = (window.KENSHU = { lessons: {}, reg(l) { this.lessons[l.id] = l; } });

  /* ---------- DOM helper ---------- */
  function add(e, kids) {
    for (const k of kids.flat(Infinity)) {
      if (k == null || k === false) continue;
      e.append(k instanceof Node ? k : document.createTextNode(String(k)));
    }
  }
  function h(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    if (attrs && typeof attrs === 'object' && !(attrs instanceof Node) && !Array.isArray(attrs)) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v == null || v === false) continue;
        if (k === 'class') e.className = v;
        else if (k === 'style' && typeof v === 'object') {
          for (const [p, val] of Object.entries(v)) p.startsWith('--') ? e.style.setProperty(p, val) : (e.style[p] = val);
        } else if (k === 'html') e.innerHTML = v;
        else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
        else e.setAttribute(k, v === true ? '' : v);
      }
    } else if (attrs != null) kids.unshift(attrs);
    add(e, kids);
    return e;
  }
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  /* ---------- tiny syntax highlighter ---------- */
  const TSKW = 'const|let|var|function|return|if|else|for|while|class|extends|implements|interface|type|enum|new|import|export|from|as|readonly|public|private|protected|static|abstract|async|await|this|super|void|null|undefined|true|false|in|of|typeof|keyof|default|constructor|get|set|declare|satisfies';
  const LANGS = {
    html: [['cm', /<!--[\s\S]*?-->/], ['tag', /<\/?[A-Za-z][\w-]*|\/?>/], ['str', /"[^"]*"|'[^']*'/], ['attr', /[\w:@.#-]+(?==)/]],
    css: [['cm', /\/\*[\s\S]*?\*\//], ['str', /"[^"]*"|'[^']*'/], ['num', /#[0-9a-fA-F]{3,8}\b/], ['attr', /[\w-]+(?=\s*:\s*[^;{}]*[;}\n])/], ['tag', /[.#][\w-]+|@[\w-]+/], ['num', /-?\d*\.?\d+(?:px|em|rem|%|vh|vw|s|ms|fr|deg)?\b/]],
    ts: [['cm', /\/\/.*|\/\*[\s\S]*?\*\//], ['str', /`[^`]*`|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/], ['kw', new RegExp('\\b(?:' + TSKW + ')\\b')], ['ty', /\b(?:number|string|boolean|any|unknown|never|object|[A-Z][A-Za-z0-9]*)\b/], ['num', /\b\d+(?:\.\d+)?\b/], ['fn', /\b[a-z_$][\w$]*(?=\()/]],
    sh: [['cm', /#.*/], ['str', /"[^"]*"|'[^']*'/], ['kw', /^[ \t]*(?:\$[ \t]*)?[A-Za-z][\w.-]*/], ['at', /(?<=\s)-{1,2}[\w-]+/]],
    json: [['str', /"(?:[^"\\]|\\.)*"/], ['num', /\b-?\d+(?:\.\d+)?\b/], ['kw', /\b(?:true|false|null)\b/]],
    text: [],
  };
  LANGS.js = LANGS.ts; LANGS.vue = LANGS.html; LANGS.bash = LANGS.sh; LANGS.git = LANGS.sh;
  const RX = {};
  function hl(code, lang) {
    const def = LANGS[lang] || [];
    if (!def.length) return esc(code);
    const rx = RX[lang] || (RX[lang] = new RegExp(def.map(([, r]) => '(' + r.source + ')').join('|'), 'gm'));
    rx.lastIndex = 0;
    let out = '', last = 0, m;
    while ((m = rx.exec(code))) {
      if (!m[0]) { rx.lastIndex++; continue; }
      const gi = m.slice(1).findIndex((x) => x !== undefined);
      out += esc(code.slice(last, m.index)) + '<span class="' + def[gi][0] + '">' + esc(m[0]) + '</span>';
      last = m.index + m[0].length;
    }
    return out + esc(code.slice(last));
  }

  /* line-addressable code block. opts: {file, hi:[lines(1-based)], dim, color} */
  function code(text, lang, opts = {}) {
    const pre = h('pre', { class: 'code' + (opts.dim ? ' dim' : ''), 'data-file': opts.file || null, 'data-lang': lang || null });
    if (opts.color) pre.style.setProperty('--c', opts.color);
    const lines = text.replace(/\n$/, '').split('\n').map((l) => h('span', { class: 'ln', html: hl(l, lang) || '&nbsp;' }));
    pre.append(...lines);
    pre.setHi = (arr = [], cls = 'on') => lines.forEach((el, i) => { el.classList.toggle(cls, arr.includes(i + 1)); });
    pre.lines = lines;
    if (opts.hi) pre.setHi(opts.hi);
    return pre;
  }

  /* ---------- stepper: click-through reasoning animation ---------- */
  function stepper(o) {
    const { steps, init, update, color } = o;
    const root = h('div', { class: 'stepper' });
    if (color) root.style.setProperty('--c', color);
    const vis = h('div', { class: 'st-vis' });
    const cap = h('div', { class: 'st-cap' });
    let cur = -1;
    const dots = steps.map((s, i) => h('button', { class: 'dot', title: s.title || 'step ' + (i + 1), onclick: () => go(i) }));
    const prev = h('button', { class: 'btn ghost', onclick: () => go(cur - 1), title: '前へ' }, icon('chevron-left'));
    const next = h('button', { class: 'btn primary', onclick: () => go(cur + 1) }, '次へ ▶');
    const reset = h('button', { class: 'btn ghost', title: '最初から', onclick: () => go(0) }, icon('rotate-ccw'));
    let timer = null;
    const setAuto = (on) => auto.replaceChildren(icon(on ? 'pause' : 'play'), on ? '停止' : '自動');
    const auto = h('button', { class: 'btn ghost', title: '自動再生', onclick: () => {
      if (timer) { clearInterval(timer); timer = null; setAuto(false); return; }
      setAuto(true);
      if (cur >= steps.length - 1) go(0);
      timer = setInterval(() => { if (cur >= steps.length - 1) { clearInterval(timer); timer = null; setAuto(false); } else go(cur + 1); }, o.interval || 1900);
    } });
    setAuto(false);
    const api = {
      el: root, vis, get cur() { return cur; }, go,
      get atEnd() { return cur >= steps.length - 1; },
      get atStart() { return cur <= 0; },
      stop() { if (timer) clearInterval(timer); },
    };
    function go(n) {
      n = clamp(n, 0, steps.length - 1);
      const changed = n !== cur;
      cur = n;
      dots.forEach((d, k) => { d.classList.toggle('on', k <= n); d.classList.toggle('cur', k === n); });
      if (changed) { cap.innerHTML = steps[n].say || ''; cap.style.animation = 'none'; void cap.offsetWidth; cap.style.animation = ''; }
      prev.disabled = n === 0;
      next.replaceChildren(...(n >= steps.length - 1 ? ['完了', icon('check')] : ['次へ', icon('chevron-right')]));
      next.disabled = n >= steps.length - 1;
      update && update(n, steps[n], vis, api);
    }
    init && init(vis, api);
    root.append(vis, cap, h('div', { class: 'st-bar' }, prev, h('div', { class: 'dots' }, dots), reset, auto, next));
    go(o.start || 0);
    if (K.ctx) K.ctx.steppers.push(api);
    return root;
  }

  /* ---------- code editor (textarea + highlight overlay) ---------- */
  function codeEditor(initial, lang, onchange) {
    const pre = h('pre');
    const ta = h('textarea', { spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off' });
    ta.value = initial;
    const root = h('div', { class: 'ed' }, pre, ta);
    let errLines = [];
    function paint() {
      const lines = ta.value.split('\n');
      pre.innerHTML = lines.map((l, i) => '<span class="ln' + (errLines.includes(i + 1) ? ' err' : '') + '">' + (hl(l, lang) || '&nbsp;') + '</span>').join('');
      pre.querySelectorAll('.ln').forEach((x) => (x.style.display = 'block'));
    }
    ta.addEventListener('input', () => { paint(); onchange && onchange(ta.value); });
    ta.addEventListener('scroll', () => { pre.scrollTop = ta.scrollTop; pre.scrollLeft = ta.scrollLeft; });
    ta.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const s = ta.selectionStart;
        ta.setRangeText('  ', s, ta.selectionEnd, 'end');
        ta.dispatchEvent(new Event('input'));
      }
    });
    root.get = () => ta.value;
    root.set = (v) => { ta.value = v; paint(); onchange && onchange(v); };
    root.mark = (arr) => { errLines = arr || []; paint(); };
    paint();
    return root;
  }

  /* ---------- TypeScript in the browser (type-check + run) ---------- */
  const TS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/typescript/5.4.5/typescript.min.js';
  const TS_LIB = `
interface Array<T>{length:number;push(...i:T[]):number;pop():T|undefined;map<U>(f:(v:T,i:number)=>U):U[];filter(f:(v:T,i:number)=>any):T[];forEach(f:(v:T,i:number)=>void):void;find(f:(v:T)=>any):T|undefined;reduce<U>(f:(a:U,v:T)=>U,init:U):U;includes(v:T):boolean;join(s?:string):string;slice(a?:number,b?:number):T[];sort(f?:(a:T,b:T)=>number):T[];[n:number]:T}
interface ReadonlyArray<T>{readonly length:number;map<U>(f:(v:T,i:number)=>U):U[];filter(f:(v:T)=>any):T[];forEach(f:(v:T)=>void):void;readonly [n:number]:T}
interface Boolean{} interface Function{} interface CallableFunction extends Function{} interface NewableFunction extends Function{} interface IArguments{} interface RegExp{test(s:string):boolean}
interface Number{toFixed(n?:number):string;toString():string} interface Object{toString():string}
interface String{length:number;toUpperCase():string;toLowerCase():string;repeat(n:number):string;split(s:string):string[];includes(s:string):boolean;trim():string;slice(a?:number,b?:number):string;charAt(i:number):string;[n:number]:string}
interface TemplateStringsArray extends ReadonlyArray<string>{}
interface Promise<T>{then<U>(f:(v:T)=>U|Promise<U>):Promise<U>;catch(f:(e:any)=>any):Promise<T>}
declare var Promise:{new<T>(ex:(res:(v:T)=>void,rej:(e?:any)=>void)=>void):Promise<T>;resolve<T>(v:T):Promise<T>};
interface Map<K,V>{get(k:K):V|undefined;set(k:K,v:V):Map<K,V>;has(k:K):boolean;delete(k:K):boolean;size:number;forEach(f:(v:V,k:K)=>void):void}
declare var Map:{new<K,V>():Map<K,V>};
interface Set<T>{add(v:T):Set<T>;has(v:T):boolean;delete(v:T):boolean;size:number}
declare var Set:{new<T>(i?:T[]):Set<T>};
interface Error{message:string;name:string} declare var Error:{new(m?:string):Error};
type Partial<T>={[P in keyof T]?:T[P]}; type Required<T>={[P in keyof T]-?:T[P]}; type Readonly<T>={readonly [P in keyof T]:T[P]}; type Record<K extends keyof any,T>={[P in K]:T[P] extends never?never:T}; type Pick<T,K extends keyof T>={[P in K]:T[P]}; type Omit<T,K extends keyof any>=Pick<T,Exclude<keyof T,K>>; type Exclude<T,U>=T extends U?never:T;
declare const console:{log(...a:any[]):void;error(...a:any[]):void};
declare const Math:{PI:number;max(...n:number[]):number;min(...n:number[]):number;round(n:number):number;floor(n:number):number;random():number;abs(n:number):number};
declare const JSON:{stringify(v:any,r?:any,s?:number):string;parse(s:string):any};
declare const Object:{keys(o:object):string[];values(o:any):any[];entries(o:any):[string,any][]};
declare function setTimeout(f:()=>void,ms?:number):number;
declare function parseInt(s:string,r?:number):number;
declare function parseFloat(s:string):number;
declare function Number(v:any):number;
declare function String(v:any):string;
declare function Boolean(v:any):boolean;
`;
  let tsPromise = null;
  function loadTS() {
    if (window.ts) return Promise.resolve(window.ts);
    return (tsPromise ||= new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = TS_URL; s.onload = () => res(window.ts); s.onerror = () => rej(new Error('TypeScript を読み込めません（オフライン？）'));
      document.head.append(s);
    }));
  }
  /** returns [{line,msg}] */
  function tsCheck(ts, src) {
    const files = { '/lib.d.ts': TS_LIB, '/main.ts': src };
    const opts = { strict: true, target: ts.ScriptTarget.ES2020, noLib: true, types: [], module: ts.ModuleKind.ESNext, noEmit: true };
    const host = {
      getSourceFile: (f, l) => (files[f] != null ? ts.createSourceFile(f, files[f], l) : undefined),
      getDefaultLibFileName: () => '/lib.d.ts', writeFile() {}, getCurrentDirectory: () => '/', getDirectories: () => [],
      fileExists: (f) => files[f] != null, readFile: (f) => files[f], getCanonicalFileName: (f) => f, useCaseSensitiveFileNames: () => true, getNewLine: () => '\n',
    };
    const p = ts.createProgram(['/lib.d.ts', '/main.ts'], opts, host);
    return ts.getPreEmitDiagnostics(p).filter((d) => d.file && d.file.fileName === '/main.ts').map((d) => ({
      line: d.file.getLineAndCharacterOfPosition(d.start).line + 1,
      msg: ts.flattenDiagnosticMessageText(d.messageText, '\n'),
    }));
  }
  function tsRun(ts, src) {
    const js = ts.transpileModule(src, { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.None } }).outputText;
    const logs = [];
    const fmt = (a) => a.map((x) => (typeof x === 'string' ? x : (() => { try { return JSON.stringify(x, null, 1); } catch { return String(x); } })())).join(' ');
    const con = { log: (...a) => logs.push({ k: 'l', t: fmt(a) }), error: (...a) => logs.push({ k: 'e', t: fmt(a) }) };
    try { new Function('console', js)(con); } catch (e) { logs.push({ k: 'e', t: String(e) }); }
    return logs;
  }

  /* ---------- playground ---------- */
  /*
    playground({
      title, mode:'web'|'ts', files:[{name,lang,code}], libs:[urls], tasks:(vals,ctx)=>[{label,ok}], height, onDone
    })
  */
  function celebrate() {
    const w = h('div', { class: 'win' });
    const cols = ['#6fdc7c', '#5b9dff', '#ff6b9d', '#ffb454', '#a98bff', '#2fd4a4'];
    for (let i = 0; i < 60; i++) {
      w.append(h('i', { style: { left: Math.random() * 100 + 'vw', background: cols[i % cols.length], '--dx': (Math.random() - .5) * 240 + 'px', '--rot': Math.random() * 900 + 'deg', animationDelay: Math.random() * .4 + 's' } }));
    }
    document.body.append(w);
    setTimeout(() => w.remove(), 2600);
  }

  function playground(o) {
    const mode = o.mode || 'web';
    const vals = {};
    o.files.forEach((f) => (vals[f.name] = f.code));
    const eds = {};
    let activeName = o.files[0].name;
    const body = h('div', { class: 'pg-body' });
    const edBox = h('div');
    const tabs = h('div', { class: 'tabs' });
    const tasksBox = h('div', { class: 'tasks' });
    const con = h('div', { class: mode === 'ts' ? 'diag' : 'con' });
    let iframe = null, outEl;
    let doneFired = false, timer = null;

    o.files.forEach((f) => {
      const ed = codeEditor(f.code, f.lang, (v) => { vals[f.name] = v; schedule(); });
      ed.style.display = f.name === activeName ? '' : 'none';
      eds[f.name] = ed; edBox.append(ed);
      tabs.append(h('button', { class: 'tab' + (f.name === activeName ? ' on' : ''), 'data-n': f.name, onclick: () => {
        activeName = f.name;
        tabs.querySelectorAll('.tab').forEach((t) => t.classList.toggle('on', t.dataset.n === f.name));
        Object.entries(eds).forEach(([n, e]) => (e.style.display = n === f.name ? '' : 'none'));
      } }, f.name));
    });

    const get = (n) => vals[n] ?? '';
    const byLang = (l) => (o.files.find((f) => f.lang === l) || {}).name;

    function buildDoc() {
      const html = get(byLang('html') || 'index.html'), css = get(byLang('css') || 'style.css'), js = get(byLang('js') || 'main.js');
      const libs = (o.libs || []).map((u) => `<script src="${u}"><\/script>`).join('');
      const bridge = `<script>(function(){var s=function(k,a){parent.postMessage({kenshu:1,k:k,t:[].slice.call(a).map(function(x){try{return typeof x==='string'?x:JSON.stringify(x)}catch(e){return String(x)}}).join(' ')},'*')};console.log=function(){s('l',arguments)};console.error=function(){s('e',arguments)};window.onerror=function(m){s('e',[m])}})()<\/script>`;
      const base = `<meta charset="utf-8"><style>body{font-family:system-ui,'Hiragino Sans',sans-serif;margin:14px;line-height:1.6}</style>`;
      return `<!doctype html><html><head>${base}${bridge}${libs}<style>${css}</style></head><body>${html}<script>${js}<\/script></body></html>`;
    }
    function runWeb() {
      con.innerHTML = '';
      if (!iframe) { evalTasks(); return; }
      iframe.srcdoc = buildDoc();
    }
    async function runTS(execute) {
      let ts;
      try { ts = await loadTS(); } catch (e) { con.innerHTML = `<div class="e">${esc(e.message)}</div>`; return; }
      const src = get(byLang('ts'));
      const errs = tsCheck(ts, src);
      eds[byLang('ts')].mark(errs.map((e) => e.line));
      let html = errs.length ? errs.map((e) => `<div class="e">✖ L${e.line}: ${esc(e.msg)}</div>`).join('') : '<div class="ok">✔ 型エラーなし</div>';
      let logs = [];
      if (execute) {
        logs = tsRun(ts, src);
        html += logs.map((l) => `<div class="${l.k === 'e' ? 'e' : 'l'}">${l.k === 'e' ? '' : '› '}${esc(l.t)}</div>`).join('');
      }
      con.innerHTML = html;
      ctx.errors = errs; ctx.logs = logs;
      evalTasks();
    }
    const ctx = { errors: [], logs: [], vals, doc: () => iframe && iframe.contentDocument };
    function evalTasks() {
      if (!o.tasks) return;
      let res = [];
      try { res = o.tasks(vals, ctx) || []; } catch (e) { res = []; }
      tasksBox.innerHTML = '';
      const req = res.filter((t) => !t.optional), opt = res.filter((t) => t.optional);
      const nOk = req.filter((t) => t.ok).length;
      tasksBox.append(h('div', { class: 'mission-head' }, icon('list-checks'), h('b', 'ミッション'), h('span', { class: 'mission-n' }, nOk + ' / ' + req.length), h('i', { class: 'mission-bar' }, h('u', { style: { width: (req.length ? (nOk / req.length) * 100 : 0) + '%' } }))));
      const hopt = { fallback: o.solution ? () => showSolution() : null, use: (tt) => { const f = o.files.find((x) => x.lang === (tt.answer.lang || x.lang)) || o.files[0]; if (tt.answer.mode === 'append') eds[f.name].set(eds[f.name].get() + '\n' + tt.answer.code); else eds[f.name].set(tt.answer.code); } };
      const LV = ['初級', '中級', '上級'];
      const lvChip = (t) => { const n = Math.min(3, Math.max(1, t.level || 1)); return h('span', { class: 'lv lv' + n, title: 'チャレンジ ' + LV[n - 1] }, Array.from({ length: n }, () => icon('star')), LV[n - 1]); };
      const row = (t) => h('div', { class: 'task' + (t.ok ? ' ok' : '') + (t.optional ? ' opt' : '') }, h('i', t.ok ? '✓' : ''), h('span', { class: 'task-l' }, t.level && (!t.optional || opt.length > 1) ? lvChip(t) : null, t.label), hintButton(t, hopt));
      req.forEach((t) => tasksBox.append(row(t)));
      if (opt.length) {
        tasksBox.append(h('div', { class: 'mission-opt-head' }, h('span', { class: 'opt-badge' }, '任意'), h('b', 'チャレンジ'), h('small', 'もっと挑戦したい人だけ。やらなくても OK')));
        opt.slice().sort((x, y) => (x.level || 1) - (y.level || 1)).forEach((t) => tasksBox.append(row(t)));
      }
      if (req.length && req.every((t) => t.ok) && !doneFired) { doneFired = true; celebrate(); o.onDone && o.onDone(); }
    }
    function schedule() {
      clearTimeout(timer);
      timer = setTimeout(() => { mode === 'ts' ? runTS(false) : mode === 'text' ? evalTasks() : runWeb(); }, mode === 'ts' ? 450 : 300);
    }
    function onMsg(e) {
      if (!e.data || !e.data.kenshu || !iframe || e.source !== iframe.contentWindow) return;
      con.append(h('div', { class: e.data.k }, (e.data.k === 'l' ? '› ' : '✖ ') + e.data.t));
    }
    if (mode === 'web') {
      window.addEventListener('message', onMsg);
      iframe = h('iframe', { sandbox: 'allow-scripts allow-same-origin', title: 'preview' });
      iframe.addEventListener('load', () => evalTasks());
      outEl = h('div', { class: 'out' }, iframe, con);
    } else if (mode === 'text') {
      outEl = h('div', { class: 'out term', style: { background: 'var(--code)' } }, h('div', { style: { padding: '14px 16px', fontSize: '.875rem', lineHeight: 1.8, flex: 1 }, html: o.note || '左のエディタに書くと、下のミッションが自動でチェックされます。' }));
    } else {
      outEl = h('div', { class: 'out term', style: { background: 'var(--code)' } },
        h('div', { style: { padding: '14px 16px', color: '#8e97c4', fontSize: '.875rem', flex: 1 } }, '💡 コードを書くと、型チェックが自動で走ります。', h('br'), '▶ 実行 で結果（console.log）を確認できます。'),
        con);
    }
    body.append(edBox, outEl);
    const runBtn = mode === 'text' ? null : h('button', { class: 'btn primary', onclick: () => (mode === 'ts' ? runTS(true) : runWeb()) }, '▶ 実行');
    const resetBtn = h('button', { class: 'btn ghost', onclick: () => { o.files.forEach((f) => eds[f.name].set(f.code)); doneFired = false; } }, '⟲ リセット');
    const solBtn = o.solution ? h('button', { class: 'btn ghost', title: 'まず自分で試してから見よう', onclick: () => showSolution() }, icon('key-round'), '答えを見る') : null;
    function showSolution() {
      const sol = typeof o.solution === 'string' ? { [o.files[0].name]: o.solution } : o.solution;
      const names = Object.keys(sol);
      const wrap = h('div');
      let cur = names[0];
      const blocks = h('div');
      const tabsEl = h('div', { class: 'tabs', style: { marginLeft: 0, marginBottom: '8px' } }, names.map((n) => h('button', { class: 'tab' + (n === cur ? ' on' : ''), onclick: (e) => { cur = n; draw(); tabsEl.querySelectorAll('.tab').forEach((t) => t.classList.toggle('on', t.textContent === n)); } }, n)));
      const draw = () => { const f = o.files.find((x) => x.name === cur) || o.files[0]; blocks.replaceChildren(code(sol[cur], f.lang, { file: cur })); };
      draw();
      const use = h('button', { class: 'btn primary', onclick: () => { names.forEach((n) => eds[n] && eds[n].set(sol[n])); m.close(); } }, icon('corner-down-left'), '自分のエディタに入れて動かす');
      wrap.append(h('p', { style: { color: 'var(--mute)', fontSize: '.875rem', marginBottom: '.8em' } }, '答えは1つとは限りません。まず自分のコードと見比べてみよう。'), names.length > 1 ? tabsEl : null, blocks, h('div', { class: 'row', style: { marginTop: '12px' } }, use));
      const m = modal({ title: '答え', icon: 'key-round', content: wrap });
    }
    const root = h('div', { class: 'pg' },
      h('div', { class: 'pg-head' }, h('div', { class: 'dots3' }, h('i'), h('i'), h('i')), tabs, h('div', { style: { flex: 1 } }), o.title && h('span', { class: 'chip' }, o.title), solBtn, resetBtn, runBtn),
      body, o.tasks ? tasksBox : null);
    if (o.height) edBox.firstChild.style.minHeight = o.height + 'px';
    root.cleanup = () => window.removeEventListener('message', onMsg);
    if (K.ctx) K.ctx.cleanups.push(root.cleanup);
    setTimeout(() => (mode === 'ts' ? runTS(false) : mode === 'text' ? evalTasks() : runWeb()), 30);
    evalTasks();
    return root;
  }

  /* ---------- quiz ---------- */
  function quiz({ q, options, answer, why, onAnswer }) {
    const box = h('div', { class: 'quiz' }, h('div', { style: { fontWeight: 800, marginBottom: '.3em' }, html: q }));
    let done = false;
    const note = h('div', { style: { color: 'var(--mute)', fontSize: '.875rem', minHeight: '1.4em' } });
    options.forEach((t, i) => box.append(h('button', { class: 'opt', onclick: (ev) => {
      if (done) return;
      const ok = i === answer;
      ev.currentTarget.classList.add(ok ? 'ok' : 'bad');
      if (ok) { done = true; note.innerHTML = '🎉 正解！ ' + (why || ''); box.querySelectorAll('.opt')[answer].classList.add('ok'); onAnswer && onAnswer(true); }
      else note.textContent = 'おしい！もう一度考えてみよう';
    }, html: t })));
    box.append(note);
    return box;
  }

  /* ---------- persistence ---------- */
  const KEY = 'kenshu.v1', UKEY = 'kenshu.user', TKEY = 'kenshu.theme';
  const lsGet = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch {} };
  const store = {
    user() { return lsGet(UKEY) || ''; },
    key(u) { u = u === undefined ? this.user() : u; return u ? KEY + '.u.' + u : KEY; },
    read(u) { try { return JSON.parse(lsGet(this.key(u))) || {}; } catch { return {}; } },
    write(d, u) { d._last = Date.now(); lsSet(this.key(u), JSON.stringify(d)); this.after && this.after(u); },
    seen(id, i) { const d = this.read(); (d.seen ||= {}); const a = (d.seen[id] ||= []); if (!a.includes(i)) { a.push(i); this.write(d); } },
    getSeen(id) { return (this.read().seen || {})[id] || []; },
    get(k, def) { if (k === 'theme') return lsGet(TKEY) || def; const v = this.read()[k]; return v === undefined ? def : v; },
    set(k, v) { if (k === 'theme') { lsSet(TKEY, v); return; } const d = this.read(); d[k] = v; this.write(d); },
  };

  /* ---------- scene helper: standard layout pieces ---------- */
  const lbl = (t) => h('div', { class: 'label' }, t);


  /* ---------- icons (Lucide, bundled) + emoji -> icon replacement ---------- */
  const SVGNS = 'http://www.w3.org/2000/svg';
  function icon(name, o = {}) {
    const body = (window.KENSHU_ICONS || {})[name] || '';
    const s = document.createElementNS(SVGNS, 'svg');
    s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('class', 'ic'); s.setAttribute('aria-hidden', 'true');
    s.innerHTML = body;
    if (o.c) s.style.color = o.c;
    if (o.f) s.style.fill = 'currentColor';
    if (o.size) { s.style.width = s.style.height = o.size; }
    return s;
  }
  const EMO = window.KENSHU_EMOJI || {};
  const EMO_RX = new RegExp('(' + Object.keys(EMO).sort((a, b) => b.length - a.length).map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')\\uFE0F?', 'gu');
  const SKIP = new Set('PRE,TEXTAREA,INPUT,SCRIPT,STYLE,CODE,IFRAME,SVG,OPTION,TITLE'.split(','));
  function iconifyNode(root) {
    if (!Object.keys(EMO).length) return;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode(n) {
      if (!n.nodeValue || !/[^\u0000- ]/.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
      for (let p = n.parentElement; p; p = p.parentElement) { if (SKIP.has(p.tagName) || (p.dataset && p.dataset.emoji != null)) return NodeFilter.FILTER_REJECT; }
      EMO_RX.lastIndex = 0;
      return EMO_RX.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    } });
    const list = []; while (w.nextNode()) list.push(w.currentNode);
    for (const n of list) {
      const frag = document.createDocumentFragment(); const t = n.nodeValue; let last = 0, m;
      EMO_RX.lastIndex = 0;
      while ((m = EMO_RX.exec(t))) {
        frag.append(t.slice(last, m.index));
        const [name, o] = EMO[m[1]]; frag.append(icon(name, o || {}));
        last = m.index + m[0].length;
      }
      frag.append(t.slice(last));
      n.replaceWith(frag);
    }
  }
  function watchIcons(el) {
    iconifyNode(el);
    new MutationObserver((ms) => {
      for (const m of ms) {
        if (m.type === 'characterData') { const p = m.target.parentElement; p && iconifyNode(p); }
        else m.addedNodes.forEach((n) => { if (n.nodeType === 1) iconifyNode(n); else if (n.nodeType === 3 && n.parentElement) iconifyNode(n.parentElement); });
      }
    }).observe(el, { childList: true, subtree: true, characterData: true });
  }


  /* ---------- mini illustrations (for why-cards, hints) ---------- */
  // spec: {k:'flow'|'code'|'vs'|'stack'|'chips'|'big'|'meter', ...}; items may be 'icon|label' strings or {i,t,c,s}
  function miniItem(x) {
    if (typeof x === 'string') { const [a, b, kk] = x.includes('|') ? x.split('|') : [null, x]; return { i: a, t: b, key: kk }; }
    return x;
  }
  function mini(spec) {
    if (!spec) return null;
    const k = spec.k || 'flow';
    const wrap = h('div', { class: 'mini mini-' + k });
    const node = (x, idx) => {
      x = miniItem(x);
      return h('div', { class: 'mn ' + (x.c || ''), 'data-key': x.key || null, style: { '--d': idx * 0.12 + 's' } }, x.i ? icon(x.i) : null, h('b', { html: x.t || '' }), x.s ? h('small', { html: x.s }) : null);
    };
    if (k === 'flow') {
      const row = h('div', { class: 'mf' });
      (spec.items || []).forEach((x, i) => { if (i) row.append(h('span', { class: 'ma', style: { '--d': i * 0.12 + 's' } }, icon(spec.dir === 'down' ? 'arrow-down' : 'arrow-right'))); row.append(node(x, i)); });
      if (spec.dir === 'down') row.classList.add('down');
      wrap.append(row);
      if (spec.loop) wrap.append(h('div', { class: 'mloop' }, icon('corner-down-left'), spec.loop === true ? '繰り返す' : spec.loop));
    } else if (k === 'code') {
      const pre = code(spec.text, spec.lang || 'ts');
      const er = spec.err || spec.del, on = spec.ok || spec.add || spec.idea;
      if (er) pre.setHi([].concat(er), 'err'); if (on) pre.setHi([].concat(on), 'on');
      Object.entries(spec.keys || {}).forEach(([ln, kk]) => { const el = pre.lines[ln - 1]; if (el) el.dataset.key = kk; });
      if (spec.file) wrap.append(h('div', { class: 'mtab' }, icon(/\.(vue|html|css|ts|js|json|sh)$/.test(spec.file) ? 'file-code' : 'terminal'), spec.file));
      wrap.append(pre);
    } else if (k === 'vs') {
      const box = (x, cls) => { x = miniItem(x); return h('div', { class: 'mv ' + cls, 'data-key': x.key || null }, h('span', { class: 'mvb' }, icon(cls === 'bad' ? 'x' : 'check')), x.i ? icon(x.i) : null, h('b', { html: x.t }), x.s ? h('small', { html: x.s }) : null); };
      wrap.append(box(spec.a, 'bad'), h('span', { class: 'ma' }, icon('arrow-right')), box(spec.b, 'ok'));
    } else if (k === 'stack') {
      wrap.append(...(spec.items || []).map((x, i) => { x = miniItem(x); return h('div', { class: 'ms', style: { '--r': ((i * 37) % 7 - 3) + 'deg', '--d': i * 0.1 + 's' } }, x.i ? icon(x.i) : null, x.t); }));
    } else if (k === 'chips') {
      wrap.append(...(spec.items || []).map((x, i) => { x = miniItem(x); return h('span', { class: 'mc ' + (x.c || ''), 'data-key': x.key || null, style: { '--d': i * 0.08 + 's' } }, x.i ? icon(x.i) : null, x.t); }));
    } else if (k === 'big') {
      wrap.append(h('div', { class: 'mbig' }, icon(spec.i || 'sparkles'), h('b', { html: spec.t || '' })));
    } else if (k === 'meter') {
      (spec.items || []).forEach((x, i) => wrap.append(h('div', { class: 'mm' }, h('span', { html: x.t }), h('i', h('u', { class: x.c || '', style: { '--w': Math.round((x.v || 0) * 100) + '%', '--d': i * 0.12 + 's' } })))));
    }
    if (spec.cap) wrap.append(h('div', { class: 'mcap', html: spec.cap }));
    return wrap;
  }

  /* ---------- modal ---------- */
  function modal(o) {
    const back = h('div', { class: 'modal-back', onclick: (e) => { if (e.target === back) close(); } });
    const body = h('div', { class: 'modal-body' });
    const c = typeof o.content === 'function' ? o.content() : o.content;
    if (typeof c === 'string') body.innerHTML = c; else if (c) body.append(c);
    const panel = h('div', { class: 'modal' + (o.narrow ? ' narrow' : '') + (o.wide ? ' wide' : ''), role: 'dialog', 'aria-modal': 'true' },
      h('div', { class: 'modal-head' }, o.icon ? icon(o.icon) : null, h('b', o.title || ''), h('button', { class: 'modal-x', title: '閉じる (Esc)', onclick: () => close() }, icon('x'))), body);
    back.append(panel); document.body.append(back);
    let gmo = null;
    if (K.glossify) { K.glossify(body); if (window.MutationObserver) { let gt = 0; gmo = new MutationObserver(() => { cancelAnimationFrame(gt); gt = requestAnimationFrame(() => { gmo.disconnect(); K.glossify(body); gmo.observe(body, { childList: true, subtree: true, characterData: true }); }); }); gmo.observe(body, { childList: true, subtree: true, characterData: true }); } }
    const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); close(); } };
    window.addEventListener('keydown', onKey, true);
    requestAnimationFrame(() => back.classList.add('in'));
    function close() { gmo && gmo.disconnect(); window.removeEventListener('keydown', onKey, true); back.classList.remove('in'); setTimeout(() => back.remove(), 200); }
    return { close, el: panel };
  }


  /* ---------- per-mission hint (ヒント → もう少し → 答え) ---------- */
  // task: {label, hint:'text'|['hint1','hint2'], answer:{code,lang,file}|'<html>'|()=>Node}; opts.fallback(): called when the task has no own answer
  function openHint(t, o = {}) {
    const hints = [].concat(t.hint || []);
    let shown = hints.length ? 1 : 0, answered = false;
    const body = h('div', { class: 'hint-wrap' });
    const draw = () => {
      body.replaceChildren();
      body.append(h('div', { class: 'hint-mission' }, icon('target'), t.label));
      if (!hints.length && !answered) body.append(h('p', { class: 'hint-none' }, 'この課題には、ヒントがまだありません。答えを見てみよう。'));
      hints.slice(0, shown).forEach((x, i) => body.append(h('div', { class: 'hint-card' }, h('span', { class: 'hint-n' }, 'ヒント' + (hints.length > 1 ? ' ' + (i + 1) : '')), h('p', { html: x }))));
      if (answered) {
        const a = t.answer;
        const ans = h('div', { class: 'hint-ans' }, h('div', { class: 'label' }, '答え'));
        if (a && typeof a === 'object' && a.code) ans.append(code(a.code, a.lang || 'ts', { file: a.file }));
        else if (typeof a === 'string') ans.append(h('div', { html: a }));
        else if (typeof a === 'function') ans.append(a());
        else ans.append(h('p', { class: 'hint-none' }, 'この課題だけの答えはありません。全体の答えを開きます。'));
        body.append(ans);
      }
      const row = h('div', { class: 'row', style: { marginTop: '6px' } });
      if (shown < hints.length) row.append(h('button', { class: 'btn', onclick: () => { shown++; draw(); } }, icon('lightbulb'), 'もう少しヒント'));
      if (!answered) row.append(h('button', { class: 'btn primary', onclick: () => { answered = true; draw(); if (!t.answer && o.fallback) { m.close(); o.fallback(); } } }, icon('key-round'), '答えを見る'));
      else if (o.use && t.answer) row.append(h('button', { class: 'btn primary', onclick: () => { o.use(t); m.close(); } }, icon('corner-down-left'), o.useLabel || 'エディタに入れる'));
      if (row.children.length) body.append(row);
    };
    draw();
    const m = modal({ title: 'ヒント', icon: 'lightbulb', narrow: true, content: body });
    return m;
  }
  function hintButton(t, o = {}) {
    if (!t.hint && !t.answer && !o.fallback) return null;
    return h('button', { class: 'task-hint', title: 'ヒント・答え', 'aria-label': 'ヒント', onclick: (e) => { e.stopPropagation(); openHint(t, o); } }, icon('lightbulb'));
  }

  /* 出力（ターミナル・プレビュー・図）を画面の上に固定して、下のボタンを押しても結果が見えるようにする。
     使い方: 親（ステージ）の最初の子に pinOutput(出力の要素) を置き、操作ボタンは同じ親の中の下に並べる。 */
  function pinOutput(node, o = {}) {
    const pin = h('div', { class: 'pin-out' }, o.label ? h('div', { class: 'pin-lb' }, icon('pin'), o.label) : null, node);
    if (o.height) pin.style.setProperty('--pin-h', o.height + 'px');
    if (o.mobileHeight) pin.style.setProperty('--pin-mh', o.mobileHeight + 'px');
    return pin;
  }
  /* スマホ用：操作したあとに、結果の要素が見えるところまでスクロール */
  function revealOutput(node) { if (node && matchMedia('(max-width:800px)').matches) node.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }

  const styled = {};
  function style(id, css) {
    if (styled[id]) return; styled[id] = 1;
    document.head.append(h('style', { 'data-l': id }, css));
  }

  K.W = { pinOutput, revealOutput, openHint, hintButton, mini, modal, icon, iconifyNode, watchIcons, style, h, esc, sleep, clamp, hl, code, stepper, codeEditor, playground, quiz, celebrate, lbl, store, loadTS, tsCheck };
})();
