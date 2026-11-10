/* コース紹介の先頭に「全体像」の3シーンを足す: Webアプリの地図 / 開発の流れ / 当てはめクイズ */
(function () {
  'use strict';
  const K = window.KENSHU, { h, code, stepper, lbl, style } = K.W, I = K.W.icon;
  const L = K.lessons.intro;
  if (!L) return;

  style('intro-map', `
  .im{display:grid;gap:16px}
  .im-map{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:0;align-items:stretch;position:relative}
  .im-z{position:relative;margin:0 14px;padding:14px 8px 12px;border-radius:10px;background:var(--card);border:1px solid var(--line);cursor:pointer;text-align:center;display:flex;flex-direction:column;align-items:center;gap:6px;transition:transform .2s,border-color .2s,box-shadow .3s}
  .im-z:hover{transform:translateY(-3px);border-color:var(--c)}
  .im-z .ic{width:30px;height:30px;color:var(--c)}
  .im-z b{font-size:1rem;font-weight:900}.im-z small{color:var(--mute);font-weight:700;font-size:.75rem;line-height:1.3}
  .im-z.sel{border-color:var(--c);box-shadow:0 0 0 2px var(--c) inset}
  .im-z.now{border-color:var(--c);box-shadow:0 0 26px -2px var(--c);transform:translateY(-4px)}
  .im-z.mine::after{content:"この研修の主役";position:absolute;top:-11px;left:50%;transform:translateX(-50%);padding:.1em .7em;border-radius:8px;background:var(--c);color:#06210f;font-size:.68rem;font-weight:900;white-space:nowrap}
  .im-z.far{border-style:dashed;opacity:.85}
  .im-z.far::after{content:"使う側として学ぶ";position:absolute;top:-11px;left:50%;transform:translateX(-50%);padding:.1em .7em;border-radius:8px;background:var(--card2);border:1px solid var(--line);color:var(--mute);font-size:.68rem;font-weight:900;white-space:nowrap}
  .im-ar{position:absolute;top:50%;width:28px;height:28px;margin:-14px 0 0 -14px;display:grid;place-items:center;color:var(--mute);z-index:2}
  .im-ar .ic{width:20px;height:20px}
  .im-stack{display:grid;grid-template-columns:1fr 1fr;gap:4px;width:100%;margin-top:2px}
  .im-stack span{font:800 .68rem var(--mono);padding:.2em 0;border-radius:6px;background:color-mix(in srgb,var(--k) 20%,transparent);color:var(--k);border:1px solid color-mix(in srgb,var(--k) 40%,transparent)}
  .im-pkt{position:absolute;top:-16px;left:0;width:32px;height:32px;border-radius:50%;display:grid;place-items:center;background:var(--violet);color:#fff;box-shadow:0 0 22px var(--violet);transition:left .9s cubic-bezier(.5,.1,.2,1),background .3s;z-index:4;pointer-events:none}
  .im-pkt .ic{width:16px;height:16px}
  .im-lane{position:relative}
  .im-det{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:18px;padding:18px;border-radius:10px;background:var(--card);border:1px solid var(--c,var(--line));animation:pop .4s both}
  .im-det h3{display:flex;align-items:center;gap:.5em;font-size:1.25rem;font-weight:900}.im-det h3 .ic{color:var(--c)}
  .im-det p{color:var(--mute);font-weight:700;margin:.3em 0 .8em}
  .im-chips{display:flex;flex-wrap:wrap;gap:8px}
  .im-chip{display:inline-flex;align-items:center;gap:.4em;padding:.35em .8em;border-radius:8px;background:var(--card2);border:1px solid var(--line);color:var(--text);text-decoration:none;font-size:.85rem;font-weight:800}
  .im-chip:hover{border-color:var(--c,var(--ts))}.im-chip small{color:var(--mute);font-weight:700}.im-chip .ic{width:14px;height:14px;color:var(--c,var(--mute))}
  .im-chip.off{opacity:.55;border-style:dashed;pointer-events:none}
  .im-flow{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:8px;position:relative;padding-bottom:36px}
  .im-p{display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 4px;border-radius:10px;background:var(--card);border:1px solid var(--line);cursor:pointer;text-align:center;position:relative;transition:transform .2s,border-color .2s}
  .im-p:hover{transform:translateY(-3px);border-color:var(--c)}
  .im-p .ic{width:26px;height:26px;color:var(--c)}.im-p b{font-size:.9rem;font-weight:900}.im-p small{font-size:.68rem;color:var(--mute);font-weight:700}
  .im-p.sel{border-color:var(--c);box-shadow:0 0 0 2px var(--c) inset;background:color-mix(in srgb,var(--c) 10%,var(--card))}
  .im-p:not(:nth-child(7))::after{content:"";position:absolute;right:-9px;top:50%;width:10px;height:10px;border-top:3px solid var(--mute);border-right:3px solid var(--mute);transform:translateY(-50%) rotate(45deg);opacity:.6}
  .im-loop{position:absolute;left:6%;right:6%;bottom:0;height:30px;border:3px dashed var(--mute);border-top:0;border-radius:0 0 18px 18px;opacity:.55}
  .im-loop span{position:absolute;left:50%;bottom:-12px;transform:translateX(-50%);padding:0 .8em;background:var(--bg);font-size:.75rem;font-weight:900;color:var(--mute);white-space:nowrap}
  .im-q{display:grid;gap:14px}
  .im-qc{padding:26px;border-radius:10px;background:var(--card);border:1px solid var(--line);text-align:center;display:grid;gap:14px;justify-items:center}
  .im-qc .big{font:900 2.2rem var(--mono)}
  .im-opts{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}
  .im-opts .btn.ok{border-color:var(--ok);background:color-mix(in srgb,var(--ok) 20%,transparent)}.im-opts .btn.bad{border-color:var(--bad);background:color-mix(in srgb,var(--bad) 18%,transparent)}
  .im-fb{min-height:1.5em;font-weight:800}
  .im-dots{display:flex;gap:6px;justify-content:center}.im-dots i{width:10px;height:10px;border-radius:50%;background:var(--card2)}.im-dots i.ok{background:var(--ok)}.im-dots i.bad{background:var(--bad)}.im-dots i.cur{outline:2px solid var(--text)}
  @media(max-width:900px){
    .im-map{grid-template-columns:1fr;gap:26px}.im-z{margin:0}.im-ar{display:none}.im-pkt{display:none}
    .im-det{grid-template-columns:1fr}
    .im-flow{grid-template-columns:repeat(2,minmax(0,1fr))}.im-p::after{display:none!important}.im-loop{display:none}.im-flow{padding-bottom:0}
  }`);

  const chip = (icon, label, id, sub, c) => h('a', { class: 'im-chip', href: '#/lesson/' + id, style: { '--c': c || 'var(--ts)' } }, I(icon), label, sub ? h('small', sub) : null);

  /* ============ 1. Webアプリの地図 ============ */
  function mapScene(el) {
    const Z = [
      { id: 'user', ic: 'user', n: 'ユーザー', s: 'ブラウザで見る人', c: 'var(--pink)', role: 'ページを見て、ボタンを押す。', lang: 'sh', text: 'https://todo.example.com/\n→ ページが開く', chips: [['chrome', 'Chrome', null, '見る道具']] },
      { id: 'front', ic: 'monitor', n: '画面', s: 'フロントエンド', c: 'var(--vue)', mine: true, role: '見える部分と、押したときの動き。ブラウザの中で動く。',
        lang: 'html', text: '<button @click="load">\n  読み込む\n</button>\n<li v-for="t in todos">{{ t.title }}</li>', stack: [['HTML', 'var(--basic)'], ['CSS', 'var(--pink)'], ['TS', 'var(--ts)'], ['Vue', 'var(--vue)']],
        chips: [['layout', 'HTML', 'html', '骨組み', 'var(--basic)'], ['palette', 'CSS', 'css', '見た目', 'var(--pink)'], ['shield-check', 'TypeScript', 'ts-intro', '型で安全', 'var(--ts)'], ['layout-template', 'Vue.js', 'vue-intro', '動く部品', 'var(--vue)']] },
      { id: 'net', ic: 'arrow-left-right', n: '通信', s: 'URL・HTTP・JSON', c: 'var(--team)', role: '画面とサーバーの会話。「ください」と「どうぞ」。',
        lang: 'sh', text: 'GET /api/todos\n← 200 OK\n[{"id":1,"title":"買い物"}]', chips: [['globe', 'API を呼ぶ', 'vue-life', 'fetch', 'var(--team)']] },
      { id: 'server', ic: 'server', n: 'サーバー', s: 'API・ルール', c: 'var(--basic)', far: true, role: '受け取って、ルールどおりに処理する。ログインの確認もここ。',
        lang: 'ts', text: "app.get('/api/todos', (req, res) => {\n  res.json(db.todos)\n})", chips: [['wrench', 'Node.js など', null, '今回は作らない']] },
      { id: 'db', ic: 'database', n: 'データ', s: '保存する場所', c: 'var(--ts)', far: true, role: 'ToDo やユーザー情報をしまっておく倉庫。',
        lang: 'sh', text: 'SELECT * FROM todos;\n→ id | title\n   1  | 買い物', chips: [['table', 'SQL', null, '今回は作らない']] },
    ];
    const map = h('div', { class: 'im-map' });
    const pkt = h('div', { class: 'im-pkt' }, I('mail'));
    const zs = Z.map((z, i) => {
      const e = h('div', { class: 'im-z' + (z.mine ? ' mine' : '') + (z.far ? ' far' : ''), style: { '--c': z.c }, onclick: () => show(i) }, I(z.ic), h('b', z.n), h('small', z.s),
        z.stack ? h('div', { class: 'im-stack' }, z.stack.map(([t, c]) => h('span', { style: { '--k': c } }, t))) : null);
      return e;
    });
    zs.forEach((e, i) => { map.append(e); if (i < zs.length - 1) { const a = h('span', { class: 'im-ar', style: { left: ((i + 1) * 20) + '%' } }, I('chevrons-right')); map.append(a); } });
    const lane = h('div', { class: 'im-lane' }, map, pkt);
    const det = h('div');
    function show(i) {
      zs.forEach((e, k) => e.classList.toggle('sel', k === i));
      const z = Z[i];
      det.replaceChildren(h('div', { class: 'im-det', style: { '--c': z.c } },
        h('div', null, h('h3', I(z.ic), z.n), h('p', z.role), h('div', { class: 'im-chips' }, z.chips.map(([ic, lb, id, sub, c]) => id ? chip(ic, lb, id, sub, c) : h('span', { class: 'im-chip off' }, I(ic), lb, sub ? h('small', sub) : null)))),
        code(z.text, z.lang)));
    }
    show(1);
    const steps = [
      ['ユーザーが<b>ボタンをクリック</b>', 0, 'mouse-pointer-click'], ['<b>Vue</b> が動いて、データを取りに行く（fetch）', 1, 'zap'], ['<b>HTTP</b> で「ToDo をください」と送る', 2, 'send'],
      ['<b>サーバー</b>が受け取って、データに聞く', 3, 'server'], ['<b>データ</b>から取り出す', 4, 'database'], ['<b>JSON</b> になって、サーバー → 通信 → 画面へ戻る', 2, 'mail'], ['<b>画面</b>が書き換わる。ユーザーに見える', 0, 'eye']];
    el.append(h('div', { class: 'im' }, stepper({
      color: 'var(--vue)', interval: 2400, steps: steps.map((s) => ({ say: s[0] })),
      init(vis) { vis.append(lane); },
      update(n) { const [, zi, ic] = steps[n]; zs.forEach((e, k) => e.classList.toggle('now', k === zi)); pkt.style.left = `calc(${zi * 20 + 10}% - 16px)`; pkt.replaceChildren(I(ic)); pkt.style.background = Z[zi].c; },
    }), lbl('気になる場所をタップ'), det));
    window.setTimeout(() => zs[1].classList.add('now'), 0);
  }

  /* ============ 2. 開発の流れ ============ */
  function flowScene(el) {
    const P = [
      { n: '企画', s: '何を作る？', ic: 'lightbulb', c: 'var(--team)', role: '誰の、どんな困りごとを解決するかを決める。', lang: 'sh', text: '困りごと: 予定が見つからない\n解決: 1画面で一覧にする',
        chips: [['lightbulb', 'アイデア発想', 'idea', 'チーム開発']] },
      { n: '設計', s: '形を決める', ic: 'pencil-ruler', c: 'var(--ts)', role: '画面を部品に分けて、データの形を先に決める。', lang: 'ts', text: 'interface Todo {\n  id: number\n  title: string\n  done: boolean\n}',
        chips: [['shield-check', '型を決める', 'ts-types', 'TypeScript'], ['layout-template', '部品に分ける', 'vue-comp', 'Vue.js']] },
      { n: '実装', s: '書く', ic: 'code-xml', c: 'var(--basic)', role: 'エディタで書く。コマンドで動かす。', lang: 'sh', text: '$ vim App.vue\n$ npm run dev\n→ localhost:5173',
        chips: [['terminal', 'CUI・Vim', 'cuivim', '基礎'], ['layout', 'HTML', 'html', '基礎'], ['palette', 'CSS', 'css', '基礎'], ['braces', 'TypeScript', 'ts-basic', 'TypeScript'], ['layout-template', 'Vue 基礎', 'vue-basics', 'Vue.js']] },
      { n: '確認', s: '試す', ic: 'flask-conical', c: 'var(--pink)', role: '動くか、壊れていないかを機械にも確かめさせる。', lang: 'sh', text: '$ npm run test\n ✓ Todo を追加できる\n ✓ 空文字は追加しない\n 2 passed',
        chips: [['flask-conical', '単体テスト', 'ts-test', 'TypeScript'], ['flask-conical', 'Vue のテスト', 'vue-test', 'Vue.js']] },
      { n: '共有', s: 'みんなで', ic: 'git-pull-request', c: 'var(--vue)', role: '変更を履歴に残し、仲間に見てもらう。', lang: 'sh', text: '$ git switch -c feat/todo\n$ git commit -m "ToDo を追加"\n$ git push -u origin HEAD\n→ Pull Request を作る',
        chips: [['git-branch', 'Git・GitHub', 'git', '基礎']] },
      { n: '公開', s: '届ける', ic: 'rocket', c: 'var(--basic)', role: 'ファイルをまとめて、誰でも見られる場所に置く。', lang: 'sh', text: '$ npm run build\n→ dist/ ができる\n→ サーバーに置く',
        chips: [['trophy', '成果発表', 'demo', 'チーム開発']] },
      { n: '改善', s: 'また次へ', ic: 'refresh-cw', c: 'var(--team)', role: '使った人の声を聞いて、最初に戻る。', lang: 'sh', text: 'Issue #12\n「ボタンが小さくて押しにくい」\n→ 次の企画へ',
        chips: [['messages-square', 'Q&A', 'qa', '質問しよう']] },
    ];
    const flow = h('div', { class: 'im-flow' });
    const det = h('div');
    const ps = P.map((p, i) => { const e = h('div', { class: 'im-p', style: { '--c': p.c }, onclick: () => show(i) }, I(p.ic), h('b', p.n), h('small', p.s)); flow.append(e); return e; });
    flow.append(h('div', { class: 'im-loop' }, h('span', '↻ ぐるぐる繰り返す')));
    function show(i) {
      ps.forEach((e, k) => e.classList.toggle('sel', k === i));
      const p = P[i];
      det.replaceChildren(h('div', { class: 'im-det', style: { '--c': p.c } },
        h('div', null, h('h3', I(p.ic), p.n), h('p', p.role), lbl('この研修では'), h('div', { class: 'im-chips' }, p.chips.map(([ic, lb, id, sub]) => chip(ic, lb, id, sub, p.c)))),
        code(p.text, p.lang)));
    }
    show(2);
    el.append(h('div', { class: 'im' }, flow, det));
  }

  /* ============ 3. 当てはめクイズ ============ */
  function quizScene(el) {
    const ZN = ['画面（ブラウザ）', 'サーバー・データ', '開発の道具'];
    const Q = [
      ['HTML', 0, 'ページの骨組み。ブラウザが読む。'], ['Git', 2, '履歴を残す道具。ページには出ない。'], ['SQL', 1, 'データベースに聞く言葉。'], ['CSS', 0, 'ブラウザで見た目を決める。'],
      ['Vim', 2, 'コードを書くエディタ。'], ['Vue.js', 0, 'ブラウザで動く部品の仕組み。'], ['API サーバー', 1, 'データを渡す係。画面の裏にいる。'], ['単体テスト', 2, '書いたコードを確かめる道具。']];
    let i = 0, score = 0; const res = [];
    const box = h('div', { class: 'im-q' });
    function draw() {
      if (i >= Q.length) {
        box.replaceChildren(h('div', { class: 'im-qc' }, h('div', { class: 'big' }, `${score} / ${Q.length}`), h('b', score >= 7 ? '地図はばっちり！' : score >= 5 ? 'いい感じ。もう一回やってみよう' : 'もう一度、地図を見直そう'),
          h('div', { class: 'row' }, h('button', { class: 'btn primary', onclick: () => { i = 0; score = 0; res.length = 0; draw(); } }, I('rotate-ccw'), 'もう一回'))));
        if (score === Q.length) try { K.W.celebrate && K.W.celebrate(); } catch {}
        return;
      }
      const [name, ans, why] = Q[i]; const fb = h('div', { class: 'im-fb' });
      const opts = ZN.map((z, k) => h('button', { class: 'btn ghost', onclick: () => {
        if (opts.some((o) => o.disabled)) return;
        opts.forEach((o) => (o.disabled = true));
        const ok = k === ans; if (ok) score++; res[i] = ok ? 'ok' : 'bad';
        opts[k].classList.add(ok ? 'ok' : 'bad'); if (!ok) opts[ans].classList.add('ok');
        fb.textContent = (ok ? '正解！ ' : 'ざんねん… ') + why; fb.style.color = ok ? 'var(--ok)' : 'var(--bad)';
        setTimeout(() => { i++; draw(); }, 1600);
      } }, z));
      box.replaceChildren(h('div', { class: 'im-qc' }, lbl(`${i + 1} / ${Q.length}　どこで使う？`), h('div', { class: 'big' }, name), h('div', { class: 'im-opts' }, opts), fb),
        h('div', { class: 'im-dots' }, Q.map((_, k) => h('i', { class: (res[k] || '') + (k === i ? ' cur' : '') }))));
    }
    draw(); el.append(box);
  }

  L.scenes.unshift(
    { t: 'Webアプリの地図', tag: '全体像', lead: 'ボタンを1回押すと、何が起きる？ <b>▶ で旅を見て</b>、気になる場所を<b>タップ</b>しよう。', render: mapScene },
    { t: '開発の流れ', tag: 'プロセス', lead: 'アプリは「作って終わり」じゃない。<b>7つの段階</b>をぐるぐる回る。各段階をタップすると、使う道具が出ます。', render: flowScene },
    { t: '地図に当てはめよう', tag: 'QUIZ', lead: '8つの名前を、<b>どこで使うか</b>に仕分けしよう。', render: quizScene });
})();
