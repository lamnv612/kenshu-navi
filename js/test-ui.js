/* 各レッスンの実践テスト（アイコンから開く）。
   データは js/tests/*.js → KENSHU.tests[lessonId] = { mode:'web'|'ts'|'text', files, libs, note, height, solution, tasks:(vals,ctx)=>[{label, ok, level:1|2|3, hint, answer}] } */
(function () {
  const K = window.KENSHU, W = K.W, h = W.h, I = W.icon;
  K.tests = K.tests || {};


  /* ---------- シミュレータ型の練習（kind: 'term' | 'git' | 'vim'） ----------
     本物のターミナル／Vim／Git 練習場を開き、「状態」でミッションを判定する（ファイルに文字を書くのではない）。
     spec = { kind, files?, seed?(sim), gh?:['merge:main','colleague:main'], lines?, file?, note, solution, tasks:(S)=>[{level,label,ok,hint,answer:{code}}] } */
  W.style('simdrill', `
  .sim-note{padding:.6em .9em;border-radius:8px;border:1px dashed var(--line);background:var(--card);font-size:.875rem;line-height:1.8;margin-bottom:10px}
  .sim-grid{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:12px;align-items:start}@media(max-width:820px){.sim-grid{grid-template-columns:1fr}}
  .sim-wrap .cg-term{height:290px}
  .sim-repo{border:1px solid var(--line);border-radius:10px;background:var(--card);padding:10px 12px;font-size:.8125rem;display:grid;gap:8px;max-height:290px;overflow:auto}
  .sim-repo h5{font-size:.6875rem;letter-spacing:.08em;color:var(--mute);margin:0 0 3px;font-weight:800;display:flex;align-items:center;gap:.4em}.sim-repo h5 .ic{width:13px;height:13px}
  .sim-repo .br{display:inline-flex;padding:.05em .6em;border-radius:6px;background:var(--pink);color:#fff;font:700 .75rem var(--mono)}
  .sim-repo ul{list-style:none;margin:0;padding:0;font:.75rem/1.65 var(--mono)}.sim-repo li{display:flex;gap:.5em;flex-wrap:wrap}.sim-repo li code{color:var(--mute)}
  .sim-repo .dc{color:var(--violet);font-weight:700}.sim-repo .none{color:var(--mute)}.sim-repo .tg{padding:0 .5em;border-radius:6px;border:1px dashed var(--basic);color:var(--basic);font:700 .6875rem var(--mono);margin-right:.4em}.sim-repo .tg.old{border-color:#ffb454;color:#ffb454}
  .sim-keys{border:1px solid var(--line);border-radius:10px;background:var(--card);padding:10px 12px;font-size:.8125rem;line-height:1.9}.sim-keys code{background:var(--code);color:#d8dcff;padding:.05em .45em;border-radius:5px}
  .sim-gh{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:8px;font-size:.875rem}.sim-msg{min-height:1.6em;font-size:.8125rem;color:var(--mute);margin-top:4px;line-height:1.6}
  .sim-ms .task .task-l{flex-wrap:wrap}.sim-bar{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
  `);
  const LVN = ['初級', '中級', '上級'];
  const lvChip = (n) => { n = Math.min(3, Math.max(1, n || 1)); return h('span', { class: 'lv lv' + n }, Array.from({ length: n }, () => I('star')), LVN[n - 1]); };
  function mkfs(files) {
    const root = { t: 'd', c: {} };
    Object.entries(files || {}).forEach(([p, v]) => { const ps = p.split('/'), name = ps.pop(); let n = root; ps.forEach((x) => { n.c[x] = n.c[x] || { t: 'd', c: {} }; n = n.c[x]; }); n.c[name] = { t: 'f', v }; });
    return root;
  }
  const codeLines = (t) => String(t || '').split('\n').map((x) => x.trim()).filter((x) => x && !x.startsWith('#'));
  function repoView(sim) {
    const sn = sim.snapshot(), c = sn.c;
    const ul = (arr, f) => (arr.length ? h('ul', arr.map(f)) : h('div', { class: 'none' }, 'なし'));
    return [
      h('div', null, h('h5', I('git-branch'), 'いまの枝'), h('span', { class: 'br' }, 'HEAD → ' + sn.head), sn.stash ? h('span', { class: 'dc', style: { marginLeft: '8px' } }, 'stash ' + sn.stash + ' 件') : null),
      h('div', null, h('h5', I('file-diff'), 'ファイルの状態'), c.staged.length || c.unstaged.length || c.untracked.length
        ? h('ul', [...c.staged.map(([k, p]) => h('li', h('span', { style: { color: 'var(--ok)' } }, 'ステージ済み'), h('span', k + '：' + p))), ...c.unstaged.map(([k, p]) => h('li', h('span', { style: { color: '#ffb454' } }, '変更あり（未 add）'), h('span', k + '：' + p))), ...c.untracked.map((p) => h('li', h('span', { style: { color: 'var(--bad)' } }, '未追跡'), h('span', p)))]) : h('div', { class: 'none' }, '変更なし（きれい）')),
      h('div', null, h('h5', I('history'), '履歴（新しい順）'), ul(sn.log, (x) => h('li', h('code', x.id), h('span', x.msg), x.d ? h('span', { class: 'dc' }, x.d.trim()) : null))),
      h('div', null, h('h5', I('github-mark'), 'GitHub（origin）の枝'), sn.rem.length ? h('div', sn.rem.map((r) => h('span', { class: 'tg' + (r.behind ? ' old' : ''), 'data-tip': r.behind ? '手元はまだ知らない更新がある（git pull で取り込む）' : null }, r.b + ' ' + r.id))) : h('div', { class: 'none' }, 'まだ何も送っていない')),
    ];
  }
  function buildSim(spec, onDone) {
    const SK = K.sim, wrap = h('div', { class: 'sim-wrap' }), box = h('div');
    wrap.append(box);
    let S = null, term = null, vim = null, sim = null, done = [], list = [], fired = false, ready = false, ghMsg = null, repo = null, msEl = null;
    const solText = () => String(typeof spec.solution === 'function' ? spec.solution(S) : spec.solution || '');
    function replay(text) {
      codeLines(text).forEach((ln) => {
        if (spec.kind === 'vim') { vim.feed(ln); return; }
        const v = term.vim && term.vim();
        if (v) { v.feed(ln); return; }
        const gm = ln.match(/^@(merge|colleague):(\S+)$/);
        if (gm && sim) { const r = gm[1] === 'merge' ? (sim.S.lastPush ? sim.ghMerge(sim.S.lastPush, gm[2]) : { msg: 'まず枝を push して GitHub に送ろう' }) : sim.ghColleague(gm[2]); if (ghMsg) ghMsg.textContent = r.msg; update(); return; }
        if (/<Tab>/.test(ln)) { term.typeTab(ln.replace('<Tab>', '')); return; }
        term.run(ln);
      });
    }
    const showCode = (t) => t.split('\n').map((x) => { const m = x.match(/^@(merge|colleague):(\S+)$/); return m ? (m[1] === 'merge' ? '# 上の「PR を Merge（→ ' + m[2] + '）」ボタンを押す' : '# 上の「同僚が ' + m[2] + ' を更新」ボタンを押す') : x; }).join('\n');
    function update() {
      let L = [];
      try { L = spec.tasks(S) || []; } catch (e) { L = list; }
      list = L;
      L.forEach((t, i) => { if (t.ok) done[i] = true; });
      const n = L.filter((t, i) => done[i]).length;
      if (repo && sim) repo.replaceChildren(...repoView(sim));
      msEl.replaceChildren(
        h('div', { class: 'mission-head' }, I('list-checks'), h('b', 'ミッション'), h('span', { class: 'mission-n' }, n + ' / ' + L.length), h('i', { class: 'mission-bar' }, h('u', { style: { width: (L.length ? (n / L.length) * 100 : 0) + '%' } }))),
        ...L.map((t, i) => h('div', { class: 'task' + (done[i] ? ' ok' : '') }, h('i', done[i] ? '✓' : ''), h('span', { class: 'task-l' }, t.level ? lvChip(t.level) : null, h('span', { html: t.label })),
          W.hintButton(Object.assign({}, t, { answer: t.answer && t.answer.code ? t.answer : undefined }), { use: (tt) => replay(tt.answer.code), useLabel: '操作に入れる', fallback: showSolution }))));
      if (L.length && n === L.length && !fired) { fired = true; W.celebrate(); onDone && onDone(); }
    }
    function showSolution() {
      const sol = solText();
      W.modal({ title: '答え（この順に打つ）', icon: 'key-round', narrow: true, content: () => h('div', null,
        h('p', { style: { color: 'var(--mute)', fontSize: '.875rem', marginBottom: '.8em' } }, '答えは1つとは限りません。まず自分で打ってから見よう。'),
        W.code(showCode(sol), spec.kind === 'vim' ? 'text' : 'sh', { file: spec.kind === 'vim' ? 'キーの順番' : '打つコマンド' }),
        h('div', { class: 'row', style: { marginTop: '12px' } }, h('button', { class: 'btn primary', onclick: (e) => { e.currentTarget.closest('.modal-back').querySelector('.modal-x').click(); replay(sol); } }, I('corner-down-left'), 'このまま実行する'))) });
    }
    function build() {
      fired = false; ready = false; done = []; list = [];
      let left, right;
      if (spec.kind === 'vim') {
        vim = SK.makeVim(() => { if (ready) update(); }, { lines: spec.lines, file: spec.file });
        S = { vim, get lines() { return vim.lines; }, get mode() { return vim.mode; }, hist: vim.hist, get dirty() { return vim.dirty; }, get text() { return vim.lines.join('\n'); } };
        left = vim.el;
        right = h('div', { class: 'sim-keys', html: spec.keys || '<b>まず Vim の中をクリック</b>してから、キーを打つ。<br><code>i</code> 書く ／ <code>Esc</code> 戻る ／ <code>x</code> 1文字消す ／ <code>dd</code> 行を消す ／ <code>p</code> 貼る<br><code>h j k l</code> 左下上右 ／ <code>w</code> 次の単語 ／ <code>:wq</code> 保存して終了' });
      } else {
        const root = spec.kind === 'git' ? mkfs(spec.files || {}) : (spec.files ? mkfs(spec.files) : undefined);
        if (spec.kind === 'git') { sim = SK.gitQ(SK.makeGitSim(root)); spec.seed && spec.seed(sim); sim.S.did = {}; sim.S.maxStash = 0; } else sim = null;
        term = SK.makeTerm(() => { if (ready) update(); }, { fs: root, git: sim || undefined });
        const file = (p) => { const n = term.exists(p); return n && n.t === 'f' ? n.v : null; };
        S = { term, sim, ran: term.ran, lines: term.hist, exists: term.exists, cwd: term.cwd, st: term.st, aliases: term.aliases, file, git: sim, did: sim ? sim.S.did : {}, S: sim && sim.S, q: sim && sim.q };
        left = h('div', null, term.el);
        if (spec.gh && spec.gh.length && sim) {
          ghMsg = h('div', { class: 'sim-msg' });
          const bar = h('div', { class: 'sim-gh' }, h('b', { style: { display: 'inline-flex', gap: '.3em', alignItems: 'center' } }, I('github-mark'), 'GitHub の操作'));
          spec.gh.forEach((g) => { const [k, dst] = g.split(':');
            bar.append(k === 'merge'
              ? h('button', { class: 'btn', onclick: () => { const src = sim.S.lastPush; const r = src ? sim.ghMerge(src, dst) : { ok: false, msg: 'まず枝を push して GitHub に送ろう' }; ghMsg.textContent = r.msg; update(); } }, I('git-pull-request'), 'PR を Merge（→ ' + dst + '）')
              : h('button', { class: 'btn', onclick: () => { const r = sim.ghColleague(dst); ghMsg.textContent = r.msg; update(); } }, I('user'), '同僚が ' + dst + ' を更新'));
          });
          left.append(bar, ghMsg);
        }
        if (sim) { repo = h('div', { class: 'sim-repo' }); right = repo; } else { repo = null; right = h('div', null, h('div', { class: 'label' }, 'フォルダの様子（リアルタイム）'), term.tree); }
      }
      msEl = h('div', { class: 'tasks sim-ms' });
      box.replaceChildren(
        spec.note ? h('div', { class: 'sim-note', html: spec.note }) : null,
        h('div', { class: 'sim-grid' }, left, right),
        h('div', { style: { height: '10px' } }), msEl,
        h('div', { class: 'sim-bar' }, h('button', { class: 'btn ghost', onclick: showSolution }, I('key-round'), '答えを見る'), h('button', { class: 'btn ghost', onclick: build }, I('rotate-ccw'), 'はじめから')));
      ready = true; update();
      if (spec.kind === 'vim') setTimeout(() => vim.el.focus(), 200); else setTimeout(() => term.input.focus(), 200);
    }
    build();
    window.__drillReplay = (text) => replay(text == null ? solText() : text);
    window.__drillState = () => S;
    return wrap;
  }
  const isSim = (s) => !!s && ['term', 'git', 'vim'].includes(s.kind);

  const done = (id) => ((W.store.get('tests', {}) || {})[id] || {}).d;
  function save(id) { const all = W.store.get('tests', {}) || {}; all[id] = { d: 1 }; W.store.set('tests', all); }
  K.testOf = (id) => (K.tests[id] && K.tests[id].tasks && !(K.lessons[id] && K.lessons[id].noTest) ? K.tests[id] : null);

  K.openTest = function (id) {
    const L = K.lessons[id], T = K.testOf(id);
    if (!L || !T) return null;
    const holder = { m: null };
    const onDone = () => { save(id); K.refreshTestBadges && K.refreshTestBadges(); };
    const pg = isSim(T) ? buildSim(T, onDone) : W.playground(Object.assign({}, T, { title: '最終チャレンジ', onDone }));
    holder.m = W.modal({ title: L.title + ' ・ 最終チャレンジ', icon: 'trophy', wide: true, content: pg });
    return holder.m;
  };

  /* シーンごとの練習: KENSHU.drills[lessonId][シーン名] = spec（tests と同じ形式） */
  K.drills = K.drills || {};
  const drillDone = (id, t) => (((W.store.get('drills', {}) || {})[id] || {})[t] || 0);
  K.drillOf = (id, t) => (K.drills[id] && K.drills[id][t] && K.drills[id][t].tasks) || null ? K.drills[id][t] : null;
  K.openDrill = function (id, t) {
    const L = K.lessons[id], D = K.drillOf(id, t);
    if (!L || !D) return null;
    const onDone = () => { const all = W.store.get('drills', {}) || {}; (all[id] ||= {})[t] = 1; W.store.set('drills', all); K.refreshTestBadges && K.refreshTestBadges(); };
    const pg = isSim(D) ? buildSim(D, onDone) : W.playground(Object.assign({}, D, { title: 'この回の練習', onDone }));
    return W.modal({ title: t + ' ・ 練習', icon: 'dumbbell', wide: true, content: pg });
  };
  K.drillButton = function (id, t) {
    if (!K.drillOf(id, t)) return null;
    const b = h('button', { class: 'tool-ico', 'data-tip': 'この回の練習（コードを書いて確かめる）', 'aria-label': 'この回の練習', onclick: () => K.openDrill(id, t) }, I('dumbbell'));
    const sync = () => b.classList.toggle('tst-done', !!drillDone(id, t));
    sync(); b.__sync = sync;
    return b;
  };

  /* アイコンボタン（最終チャレンジ） */
  K.testButton = function (id, cls) {
    if (!K.testOf(id)) return null;
    const b = h('button', { class: cls || 'tool-ico', 'data-tip': '最終チャレンジ（このレッスンの総まとめ）', 'aria-label': '最終チャレンジ', onclick: () => K.openTest(id) }, I('trophy'));
    const sync = () => b.classList.toggle('tst-done', !!done(id));
    sync(); b.__sync = sync;
    return b;
  };
  K.refreshTestBadges = () => document.querySelectorAll('[aria-label="最終チャレンジ"],[aria-label="この回の練習"]').forEach((b) => b.__sync && b.__sync());
})();
