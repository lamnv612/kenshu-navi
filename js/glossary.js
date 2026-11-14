/* CSS プロパティの用語集。コード・ラベルに乗せる（タップ）と、日本語の説明を出す */
(function () {
  const K = window.KENSHU;
  const G = {
    /* 文字 */
    'font-size': '文字の大きさ。例: 16px / 1.25rem。本文は 16px 前後が基本。',
    'font-family': '文字の種類（書体）。例: sans-serif（ゴシック）/ serif（明朝）/ monospace（等幅）。',
    'font-weight': '文字の太さ。400 = ふつう、700 = 太字（bold）。',
    'font-style': '文字のスタイル。italic = 斜体。',
    'line-height': '行の高さ（行間）。1.6 のように数字だけ書くと、文字サイズの 1.6 倍。読みやすさに直結する。',
    'letter-spacing': '文字と文字のすき間。見出しを少し広げると上品に見える。',
    'text-align': '文字の横の揃え。left / center / right。',
    'text-decoration': '下線や取り消し線。underline / line-through / none（リンクの下線を消すときも使う）。',
    'text-transform': '大文字・小文字の変換。uppercase = すべて大文字。',
    'text-overflow': 'はみ出した文字の見せ方。ellipsis = 「…」で省略（white-space: nowrap と overflow: hidden とセット）。',
    'white-space': '改行や空白の扱い。nowrap = 折り返さない。',
    'word-break': '長い単語の折り返し。break-all で強制的に折り返す。',
    'overflow-wrap': '長い文字列を折り返すか。anywhere / break-word で、はみ出しを防ぐ。',
    'color': '文字の色。例: #222 / rgb(0 0 0) / red。',
    'vertical-align': '文字や画像の縦位置の揃え。インライン要素・表のセルで使う。',
    /* 色・背景 */
    'background': '背景をまとめて指定。色・画像・位置などを一度に書ける。',
    'background-color': '背景の色。',
    'background-image': '背景の画像やグラデーション。',
    'background-size': '背景画像の大きさ。cover = 余白なく全体を覆う / contain = 全体を収める。',
    'background-position': '背景画像の位置。center など。',
    'background-repeat': '背景画像の繰り返し。no-repeat = 1枚だけ。',
    'opacity': '透明度。1 = 不透明、0 = 完全に透明。',
    /* ボックス */
    'width': '横幅。',
    'height': '高さ。',
    'min-width': '最小の横幅。これより小さくならない。',
    'max-width': '最大の横幅。これより広がらない（読みやすい行の長さを保つときに便利）。',
    'min-height': '最小の高さ。中身が増えたら伸びる。',
    'max-height': '最大の高さ。',
    'margin': '外側の余白（他の要素との距離）。',
    'margin-top': '上の外側の余白。', 'margin-bottom': '下の外側の余白。', 'margin-left': '左の外側の余白。', 'margin-right': '右の外側の余白。',
    'padding': '内側の余白（枠線と中身の距離）。ボタンのクリックしやすさにも効く。',
    'padding-top': '上の内側の余白。', 'padding-bottom': '下の内側の余白。', 'padding-left': '左の内側の余白。', 'padding-right': '右の内側の余白。',
    'border': '枠線。太さ・種類・色をまとめて書く。例: 1px solid #ccc。',
    'border-radius': '角の丸み。50% で円になる。',
    'border-color': '枠線の色。', 'border-width': '枠線の太さ。', 'border-style': '枠線の種類。solid（実線）/ dashed（破線）。',
    'border-bottom': '下の枠線だけ。', 'border-top': '上の枠線だけ。',
    'box-shadow': '要素の影。例: 0 2px 8px rgba(0,0,0,.2)。カードを浮かせて見せる。',
    'box-sizing': '幅の数え方。border-box にすると、padding と border を含めた幅で指定できる。',
    'outline': '外側の線（レイアウトに影響しない）。フォーカスの目印に使う。',
    'overflow': 'はみ出した中身の扱い。hidden = 隠す / auto = 必要ならスクロール。',
    'overflow-x': '横方向のはみ出しの扱い。', 'overflow-y': '縦方向のはみ出しの扱い。',
    /* 表示・配置 */
    'display': '要素の表示のしかた。block / inline / flex / grid / none（非表示）。',
    'visibility': '見え方。hidden = 見えないが場所は残る。',
    'position': '配置の基準。static（ふつう）/ relative / absolute / fixed / sticky。',
    'top': '上からの距離（position を指定した要素で効く）。',
    'right': '右からの距離（position を指定した要素で効く）。',
    'bottom': '下からの距離（position を指定した要素で効く）。',
    'left': '左からの距離（position を指定した要素で効く）。',
    'inset': 'top・right・bottom・left をまとめて指定。inset: 0 で親いっぱいに広げる。',
    'z-index': '重なり順。数字が大きいほど手前に出る（position を指定した要素で効く）。',
    'float': '要素を左右に寄せて、文字を回り込ませる。昔のレイアウト手法。今は flex / grid を使う。',
    'cursor': 'マウスを乗せたときのカーソル。pointer = 指の形（クリックできる合図）。',
    'pointer-events': 'クリックなどを受け取るか。none = 素通りさせる。',
    'transform': '移動・拡大・回転。例: translateY(-4px) scale(1.05)。',
    'transition': 'スタイルの変化をなめらかにする。例: all .2s ease。',
    'animation': 'キーフレームを使ったアニメーション。',
    'object-fit': '画像を枠にどう収めるか。cover = 縦横比を保って枠いっぱい。',
    'aspect-ratio': '縦横比。例: 16 / 9。画像の読み込み前にも場所が確保できる。',
    'content': '::before / ::after で表示する中身。',
    /* flex / grid */
    'flex': 'flex の伸び縮みをまとめて指定。flex: 1 で余ったスペースを均等に使う。',
    'flex-direction': '並ぶ向き。row = 横 / column = 縦。',
    'flex-wrap': '入りきらないときの折り返し。wrap = 次の行へ。',
    'flex-grow': '余ったスペースをどれだけ受け取るか。',
    'flex-shrink': '足りないとき、どれだけ縮むか。',
    'flex-basis': '伸び縮みする前の基準の大きさ。',
    'justify-content': '主軸（並ぶ向き）方向の揃え。center / space-between など。',
    'align-items': '交差軸（並びと直角の向き）方向の揃え。center で縦中央（横並びのとき）。',
    'align-self': '1つの子だけ、交差軸方向の揃えを変える。',
    'align-content': '折り返した複数行全体の揃え。',
    'gap': '子どうしのすき間。margin を子に付けなくてよい。',
    'row-gap': '行どうしのすき間。', 'column-gap': '列どうしのすき間。',
    'order': '並び順を変える（HTML の順番はそのまま）。',
    'grid-template-columns': 'グリッドの列の幅。例: repeat(3, 1fr) = 3 等分。',
    'grid-template-rows': 'グリッドの行の高さ。',
    'grid-column': '子が使う列の範囲。', 'grid-row': '子が使う行の範囲。',
    'place-items': 'align-items と justify-items をまとめて指定。place-items: center で中央ぞろえ。',
    'place-content': 'align-content と justify-content をまとめて指定。',
    /* リスト・表・その他 */
    'list-style': 'リストの点や番号。none で消せる（ナビゲーションで使う）。',
    'table-layout': '表の列幅の決め方。', 'border-collapse': '表の枠線をくっつけるか。collapse = くっつける。',
    'scroll-behavior': 'アンカーリンクなどのスクロールをなめらかにする。smooth。',
    'filter': 'ぼかしや明るさなどの効果。', 'backdrop-filter': '要素の後ろをぼかす。',
    'resize': 'ユーザーが大きさを変えられるか。', 'user-select': '文字を選択できるか。', 'appearance': 'ブラウザ標準の見た目を消す。',
    'will-change': 'これから変わる予定をブラウザに伝える。',
    'font-variant': '小さな大文字などの文字の変形。', 'text-indent': '1行目の字下げ。', 'text-shadow': '文字の影。',
    'line-clamp': '指定した行数で省略する。', '-webkit-line-clamp': '指定した行数で「…」省略する（display: -webkit-box とセット）。',
    /* SCSS / 変数 */
    '--brand': 'カスタムプロパティ（CSS 変数）。1か所で決めて var(--brand) で使い回す。',
  };
  /* 追加用 API: K.glossAdd([{ k:'v-if', kind:'word'|'css'|'tag'|'attr', m:'意味（やさしい言葉）', c:'例コード', r:'現場ではこう使う' }]) */
  const L = [];
  let dirty = true;
  K.glossAdd = function (list) { list.forEach((e) => { const i = L.findIndex((x) => x.k === e.k && x.kind === e.kind); if (i >= 0) L[i] = Object.assign(L[i], e); else L.push(e); }); dirty = true; };
  K.glossAdd(Object.entries(G).map(([k, m]) => ({ k, kind: 'css', m })));
  K.gloss = G;

  /* ---- ツールチップ（クリップされないよう fixed で出す） ---- */
  let tip = null, cur = null;
  const find = (k, kind) => L.find((x) => x.k === k && (!kind || x.kind === kind));
  function show(el) {
    const e = find(el.getAttribute('data-gk'), el.getAttribute('data-gt'));
    if (!e) return;
    if (!tip) { tip = document.createElement('div'); tip.className = 'gl-tip'; tip.setAttribute('role', 'tooltip'); document.body.append(tip); }
    tip.replaceChildren();
    const KIND = { css: ['CSS プロパティ', 'k-css'], tag: ['HTML タグ', 'k-tag'], attr: ['HTML 属性', 'k-attr'], word: ['用語', 'k-word'] }[e.kind || 'word'] || ['用語', 'k-word'];
    tip.className = 'gl-tip ' + KIND[1];
    const add = (par, tag, cls, txt) => { const d = document.createElement(tag); if (cls) d.className = cls; if (txt != null) d.textContent = txt; par.append(d); return d; };
    const head = add(tip, 'div', 'gl-h');
    add(head, 'b', 'gl-k', e.k);
    add(head, 'span', 'gl-kind', e.t || KIND[0]);
    const sec = (label, cls) => { const d = add(tip, 'div', 'gl-s ' + cls); add(d, 'small', 'gl-l', label); return d; };
    add(sec('意味', 'gl-sm'), 'div', 'gl-m', e.m);
    if (e.c) {
      const d = sec('例', 'gl-sc');
      const lang = e.lang || (e.kind === 'css' ? 'css' : e.kind === 'tag' || e.kind === 'attr' ? 'html' : /^\s*(\$|git |npm |cd |ls |grep |cat |mkdir |rm |mv |cp |tail |head )/.test(e.c) ? 'sh' : /<[a-z]|v-|@click|:key/.test(e.c) ? 'html' : /\{[^}]*:\s*[^}]*;/.test(e.c) ? 'css' : 'ts');
      const pre = add(d, 'pre', 'gl-c'); pre.innerHTML = (K.W && K.W.hl ? K.W.hl(e.c, lang) : e.c.replace(/</g, '&lt;'));
    }
    if (e.r) { const d = sec('現場では', 'gl-sr'); add(d, 'div', 'gl-rt', e.r); }
    tip.style.display = 'block';
    const r = el.getBoundingClientRect();
    tip.style.maxWidth = Math.min(340, innerWidth - 16) + 'px';
    const th = tip.offsetHeight, tw = tip.offsetWidth;
    const x = Math.max(8, Math.min(innerWidth - tw - 8, r.left + r.width / 2 - tw / 2));
    let y = r.top - th - 10; if (y < 8) y = r.bottom + 10;
    tip.style.left = x + 'px'; tip.style.top = y + 'px';
    cur = el;
  }
  function hide() { if (tip) tip.style.display = 'none'; cur = null; }
  document.addEventListener('mouseover', (e) => { const el = e.target.closest && e.target.closest('[data-gk]'); if (el) show(el); else if (cur) hide(); });
  document.addEventListener('focusin', (e) => { const el = e.target.closest && e.target.closest('[data-gk]'); if (el) show(el); });
  document.addEventListener('click', (e) => { const el = e.target.closest && e.target.closest('[data-gk]'); if (el && matchMedia('(hover:none)').matches) { cur === el ? hide() : show(el); } else if (cur) hide(); });
  window.addEventListener('scroll', hide, true);
  window.addEventListener('hashchange', hide);

  /* ---- コード・ラベルの中の用語に説明を付ける ---- */
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const SKIP = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'OPTION', 'SVG', 'IFRAME']);
  const CODEISH = 'code,pre,kbd,.ln,.cg-chip,.cgk,.vref td,.kc,.cg-cmd,.cg-out,.cgx-term,.fo4-term,.xb-term,.xb-line,.xb-cmd,.task-l,.st-cap';
  let RX = null;
  function build() {
    const by = { css: [], tag: [], attr: [], word: [], abool: [] };
    L.forEach((e) => by[e.kind === 'attr' && e.bool ? 'abool' : (e.kind || 'word')].push(e.k));
    const alt = (a) => a.sort((x, y) => y.length - x.length).map(esc).join('|');
    RX = {
      css: by.css.length ? new RegExp('(?<![\\w-])(' + alt(by.css) + ')(?=\\s*:)', 'g') : null,
      tag: by.tag.length ? new RegExp('(?<=&lt;|<)\\/?(' + alt(by.tag) + ')(?=[\\s>\\/]|$)', 'g') : null,
      attr: by.attr.length ? new RegExp('(?<=\\s)(' + alt(by.attr) + ')(?==)', 'g') : null,
      abool: by.abool.length ? new RegExp('(?<=<[A-Za-z][^<>]*\\s)(' + alt(by.abool) + ')(?=[\\s>\\/]|$)', 'g') : null,
      word: by.word.length ? new RegExp('(?<![\\w@:#.-])(' + alt(by.word) + ')(?![\\w-])', 'g') : null,
    };
    dirty = false;
  }
  function mark(el, k, kind) { if (el.hasAttribute('data-gk')) return; el.setAttribute('data-gk', k); el.setAttribute('data-gt', kind); el.classList.add('gl'); if (el.tabIndex < 0) el.tabIndex = 0; }
  K.glossMark = mark;   /* 自動で拾えない場所に、手動で付けるとき用 */
  K.glossify = function (root) {
    if (!root || !root.querySelectorAll) return;
    if (dirty || !RX) build();
    /* 1) 中身が用語だけの要素（ラベル・見出し・表のセル） */
    root.querySelectorAll('span,label,b,strong,small,div,h4,h5,td,th,code,i,em,kbd').forEach((el) => {
      if (el.children.length || el.closest('[data-gk],textarea,.modal-x,.ln')) return;
      const raw = el.textContent.trim(), t = raw.toLowerCase();
      if (!t || t.length > 32) return;
      const e = L.find((x) => (x.kind === 'css' ? x.k === t : x.kind === 'word' && x.k === raw));
      if (e) mark(el, e.k, e.kind || 'word');
    });
    /* 2) コードの中 */
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode(n) {
      const v = n.nodeValue; if (!v || v.length < 2) return NodeFilter.FILTER_REJECT;
      const pe = n.parentElement; if (!pe || !(pe.closest(CODEISH) || /^\s*<\/?[a-z][\w-]*>?\s*$/.test(v))) return NodeFilter.FILTER_REJECT;
      for (let p = pe; p && p !== root; p = p.parentElement) { if (SKIP.has(p.tagName) || p.hasAttribute('data-gk')) return NodeFilter.FILTER_REJECT; }
      return NodeFilter.FILTER_ACCEPT;
    } });
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((n) => {
      const s = n.nodeValue, hits = [];
      const blk = n.parentElement.closest('pre[data-lang]'), lg = blk && blk.getAttribute('data-lang');
      const pre0 = n.parentElement.closest('pre');
      const noCss = lg ? !/^(css|scss|sass|html|vue|text)$/.test(lg) : !!pre0 && /\b(function|const|let|interface|import|export|class|enum)\b|=>/.test(pre0.textContent);   // TS/JS/シェルの中の「color:」などは CSS として扱わない
      ['css', 'tag', 'attr', 'abool', 'word'].forEach((kind) => { if (kind === 'css' && noCss) return; const rx = RX[kind]; if (!rx) return; rx.lastIndex = 0; let m; while ((m = rx.exec(s))) { const k = m[1]; hits.push({ k, kind: kind === 'abool' ? 'attr' : kind, st: m[0].indexOf(k) + m.index, en: m[0].indexOf(k) + m.index + k.length }); } });
      if (!hits.length) {
        /* ハイライト済みコード: プロパティ名だけの<span>の直後に「:」が続く形 */
        const t = s.trim(), pe = n.parentElement, nx = pe && pe.nextSibling;
        const e = !noCss && t && L.find((x) => x.kind === 'css' && x.k === t);
        if (e && pe !== root && pe.children.length === 0 && nx && /^\s*:/.test(nx.textContent || '') && pe.closest('.ln,pre,code')) mark(pe, e.k, 'css');
        /* ハイライト済み HTML: 属性名だけの<span>の直後に「=」が続く形 */
        const ea = t && L.find((x) => x.kind === 'attr' && x.k === t);
        if (ea && !ea.bool && pe !== root && pe.children.length === 0 && nx && /^=/.test(nx.textContent || '') && pe.closest('.ln,pre,code')) mark(pe, ea.k, 'attr');
        /* ハイライト済み HTML: 値なし属性（required など）が、タグの終わり「>」の前に並ぶ形 */
        const nxe = n.nextSibling;
        if (t && nxe && nxe.nodeType === 1 && /^\s*\/?>/.test(nxe.textContent || '') && pe.closest('.ln,pre,code')) {
          const parts = s.split(/(\s+)/);
          if (parts.some((w) => w.trim() && L.some((x) => x.kind === 'attr' && x.bool && x.k === w.trim()))) {
            const fr = document.createDocumentFragment();
            parts.forEach((w) => { const bk = w.trim() && L.find((x) => x.kind === 'attr' && x.bool && x.k === w.trim()); if (bk) { const sp = document.createElement('span'); sp.textContent = w; mark(sp, bk.k, 'attr'); fr.append(sp); } else fr.append(document.createTextNode(w)); });
            n.replaceWith(fr);
          }
        }
        return;
      }
      hits.sort((a, b) => a.st - b.st || b.en - a.en);
      const frag = document.createDocumentFragment(); let last = 0;
      hits.forEach((x) => { if (x.st < last) return; frag.append(document.createTextNode(s.slice(last, x.st))); const sp = document.createElement('span'); sp.textContent = s.slice(x.st, x.en); mark(sp, x.k, x.kind); frag.append(sp); last = x.en; });
      frag.append(document.createTextNode(s.slice(last))); n.replaceWith(frag);
    });
  };
  /* ステッパーやデモで中身が書き換わっても、用語に説明を付け直す */
  K.glossWatch = function (root) {
    if (!root || !window.MutationObserver) return;
    let t = 0;
    const mo = new MutationObserver(() => { cancelAnimationFrame(t); t = requestAnimationFrame(() => { mo.disconnect(); K.glossify(root); mo.observe(root, { childList: true, subtree: true, characterData: true }); }); });
    mo.observe(root, { childList: true, subtree: true, characterData: true });
    (K.ctx && K.ctx.cleanups ? K.ctx.cleanups : (K._glw = K._glw || [])).push(() => mo.disconnect());
  };
})();
