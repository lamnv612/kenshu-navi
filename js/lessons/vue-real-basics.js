/* vue-basics：実例シーン（動く小さなUIウィジェット3つ × 本物のSFC。操作すると「走った行」だけが光る） */
(function () {
  'use strict';
  const K = window.KENSHU;
  let tries = 0;
  (function wait() {
    if (K && K.lessons && K.lessons['vue-basics'] && K.W) return install();
    if (++tries < 100) setTimeout(wait, 100);
  })();

  function install() {
    const L = K.lessons['vue-basics'];
    if (L.scenes.some((s) => s.t === '実例：動くウィジェット3つ')) return;
    const { h, code, style, sleep } = K.W;
    const C = 'var(--vue)';

    style('vrB', `
    .vrB-wrap{display:grid;gap:12px}
    .vrB-live{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:14px;display:grid;gap:10px;align-content:start;min-width:0}
    .vrB-code{min-width:0}.vrB-code pre.code{margin:0;max-width:100%;overflow-x:auto}
    .vrB-fl{animation:vrBfl .9s ease-out}
    @keyframes vrBfl{0%{box-shadow:0 0 0 0 var(--vue);background-color:color-mix(in srgb,var(--vue) 35%,transparent)}60%{box-shadow:0 0 0 6px transparent}100%{box-shadow:0 0 0 0 transparent}}
    .vrB-tip{font:800 .72rem var(--font);color:var(--vue);display:flex;gap:6px;align-items:center}
    .vrB-box{background:#fff;color:#223;border-radius:10px;padding:12px;display:grid;gap:8px;border:2px solid #d6dbe8}
    .vrB-box textarea{width:100%;box-sizing:border-box;min-height:84px;padding:8px;border:2px solid #b9c0d4;border-radius:8px;font:500 .9rem var(--font);resize:vertical;color:#223;background:#fff}
    .vrB-cnt{justify-self:end;font:900 .95rem var(--mono);padding:.1em .6em;border-radius:6px;color:#2a7;transition:color .2s}
    .vrB-cnt.over{color:#d33;background:#fde8e8}
    .vrB-send{justify-self:end;padding:.45em 1.4em;border-radius:8px;border:0;font:800 .85rem var(--font);background:#2a6df4;color:#fff;cursor:pointer}
    .vrB-send:disabled{background:#c5cad6;cursor:not-allowed}
    .vrB-bar{display:flex;align-items:center;justify-content:space-between;gap:8px}
    .vrB-bell{position:relative;font-size:1.7rem;line-height:1;padding:4px 8px;border-radius:10px}
    .vrB-badge{position:absolute;top:-4px;right:-6px;min-width:20px;height:20px;border-radius:10px;background:#e33;color:#fff;font:900 .72rem/20px var(--mono);text-align:center;padding:0 5px}
    .vrB-n{display:flex;gap:8px;align-items:center;padding:8px 10px;border-radius:8px;border:2px solid #d6dbe8;font-weight:700;font-size:.85rem;cursor:pointer;background:#fff;color:#223;transition:.25s}
    .vrB-n.unread{border-color:#2a6df4;background:#eaf1ff;font-weight:900}
    .vrB-n i{width:8px;height:8px;border-radius:50%;background:#2a6df4;flex:none}.vrB-n:not(.unread) i{background:transparent}
    .vrB-lw{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;border:2px solid #d6dbe8;background:#fff;color:#223;font-weight:800;font-size:.88rem}
    .vrB-lw span{flex:1}.vrB-lw small{color:#678;font-weight:700}
    .vrB-star{border:0;background:none;font-size:1.5rem;line-height:1;cursor:pointer;color:#c3c8d6;transition:transform .2s,color .2s;padding:0 4px}
    .vrB-star.on{color:#f5a623;transform:scale(1.15)}
    .vrB-star:hover{transform:scale(1.3)}
    .vrB-foot{font:800 .85rem var(--font);color:#223;padding:.2em .5em;border-radius:6px;justify-self:start}
    .vrB-act{display:flex;gap:8px;flex-wrap:wrap}
    .vrB-reg{border:2px dashed #b9c0d4;border-radius:10px;padding:10px 12px;background:#fff;color:#223;cursor:pointer;display:flex;gap:10px;align-items:center;font-weight:800;transition:.2s}
    .vrB-reg:hover{border-color:var(--vue);background:#f0f8f4}
    .vrB-reg.ok{border:2px solid var(--ok)}.vrB-reg.no{border:2px solid var(--bad)}
    .vrB-reg small{color:#678;font:700 .72rem var(--mono);margin-left:auto}
    .vrB-q{font:800 1rem var(--mono);padding:.6em .9em;border-radius:10px;background:var(--card2);border:2px solid var(--vue);color:var(--vue)}
    .vrB-sc{font:900 .85rem var(--font);color:var(--mute)}
    .vrB-tag{padding:.1em .7em;border-radius:99px;font:800 .78rem var(--font);color:#fff;background:#8895b3;transition:background .25s}
    .vrB-tag.doing{background:#e8890c}.vrB-tag.done{background:#2a9d6a}
    `);

    const lns = (src, keys) => { const o = []; src.split('\n').forEach((l, i) => { if (keys.some((k) => l.includes(k))) o.push(i + 1); }); return o; };
    const flash = (el) => { if (!el) return; el.classList.remove('vrB-fl'); void el.offsetWidth; el.classList.add('vrB-fl'); };
    const tab = (list, cur, on) => h('div', { class: 'vi-row' }, ...list.map((t, i) => h('span', { class: 'vi-chip' + (i === cur ? '' : ' off'), style: { '--cc': C }, onclick: () => on(i) }, t)));

    /* ===== ウィジェットの定義 ===== */
    const SRC = {
      counter: "<script setup lang=\"ts\">\nimport { computed, ref } from 'vue'\n\nconst MAX = 40\nconst body = ref<string>('')\nconst remain = computed(() => MAX - body.value.length)\nconst over = computed(() => remain.value < 0)\n</script>\n\n<template>\n  <form @submit.prevent>\n    <textarea v-model=\"body\" placeholder=\"ご相談内容\" />\n    <p :class=\"{ over }\">{{ remain }}</p>\n    <button :disabled=\"over || !body\">送信</button>\n  </form>\n</template>",
      bell: "<script setup lang=\"ts\">\nimport { computed, ref } from 'vue'\nimport type { Notice } from '@/types/notice'\n\nconst notices = ref<Notice[]>([\n  { id: 1, text: '山田様から新着メッセージ', read: false },\n  { id: 2, text: '面談の日程が確定しました', read: false },\n])\nconst unread = computed(() => notices.value.filter((n) => !n.read).length)\n\nfunction receive(text: string) {\n  notices.value.unshift({ id: Date.now(), text, read: false })\n}\nfunction open(n: Notice) {\n  n.read = true\n}\n</script>\n\n<template>\n  <span class=\"bell\">🔔\n    <b v-if=\"unread > 0\">{{ unread }}</b>\n  </span>\n  <ul>\n    <li\n      v-for=\"n in notices\"\n      :key=\"n.id\"\n      :class=\"{ unread: !n.read }\"\n      @click=\"open(n)\"\n    >{{ n.text }}</li>\n  </ul>\n</template>",
      fav: "<script setup lang=\"ts\">\nimport { ref } from 'vue'\nimport { lawyers } from '@/data/lawyers'\nconst favs = ref<number[]>([2])\n\nfunction toggle(id: number) {\n  favs.value = favs.value.includes(id)\n    ? favs.value.filter((x) => x !== id)\n    : [...favs.value, id]\n}\n</script>\n\n<template>\n  <div v-for=\"l in lawyers\" :key=\"l.id\">\n    {{ l.name }}\n    <button\n      :class=\"{ on: favs.includes(l.id) }\"\n      @click=\"toggle(l.id)\"\n    >★</button>\n  </div>\n  <p>お気に入り {{ favs.length }} 件</p>\n</template>"
    };

    function widgetCounter(pre) {
      const S = SRC.counter, MAX = 40;
      let hiT; const hi = (keys) => { pre.setHi(lns(S, keys)); clearTimeout(hiT); hiT = setTimeout(() => pre.setHi([]), 6000); };
      const ta = h('textarea', { placeholder: 'ご相談内容を入力…', maxlength: 200 });
      const cnt = h('div', { class: 'vrB-cnt' }), send = h('button', { class: 'vrB-send' }, '送信');
      let wasOver = null;
      const upd = () => {
        const remain = MAX - ta.value.length, over = remain < 0;
        cnt.textContent = remain; cnt.classList.toggle('over', over);
        send.disabled = over || !ta.value;
        flash(cnt);
        if (over !== wasOver) { flash(send); flash(ta); }
        hi(over !== wasOver ? ['v-model="body"', 'const remain', 'const over', '{{ remain }}', ':class="{ over }"', ':disabled'] : ['v-model="body"', 'const remain', '{{ remain }}']);
        wasOver = over;
      };
      ta.addEventListener('input', upd);
      ta.value = '相続の件で相談したいのですが'; upd(); pre.setHi([]);
      const el = h('div', { class: 'vrB-box' }, ta, cnt, send);
      return h('div', { class: 'vrB-live' }, h('div', { class: 'vrB-tip' }, '✍️ 40文字を超えて打ってみよう'), el);
    }

    function widgetBell(pre) {
      const S = SRC.bell;
      let hiT; const hi = (keys) => { pre.setHi(lns(S, keys)); clearTimeout(hiT); hiT = setTimeout(() => pre.setHi([]), 6000); };
      let items = [{ id: 1, text: '山田様から新着メッセージ', read: false }, { id: 2, text: '面談の日程が確定しました', read: false }];
      let seq = 10;
      const bell = h('div', { class: 'vrB-bell' }, '🔔'), list = h('div', { style: { display: 'grid', gap: '6px' } });
      let badge = null;
      const NEW = ['鈴木様から書類が届きました', '相談の回答期限が近づいています', '新しい相談が1件あります'];
      const paint = (what) => {
        const u = items.filter((n) => !n.read).length;
        if (u > 0) { if (!badge) { badge = h('span', { class: 'vrB-badge' }); bell.append(badge); flash(badge); } badge.textContent = u; if (what !== 'open' || true) flash(badge); }
        else if (badge) { badge.remove(); badge = null; flash(bell); }
        list.replaceChildren(...items.map((n) => { const li = h('div', { class: 'vrB-n' + (n.read ? '' : ' unread'), onclick: () => { if (n.read) return; n.read = true; paint('open'); const t = list.children[items.indexOf(n)]; flash(t); hi(['function open', 'n.read = true', 'const unread', ':class="{ unread', '@click="open', '<b v-if', '{{ unread }}']); } }, h('i'), n.text); if (what === 'receive' && n === items[0]) flash(li); return li; }));
      };
      paint();
      const add = h('button', { class: 'btn primary', style: { '--c': C }, onclick: () => { items.unshift({ id: ++seq, text: NEW[seq % NEW.length], read: false }); paint('receive'); hi(['function receive', 'notices.value.unshift', 'const unread', 'v-for="n in notices"', '<b v-if', '{{ unread }}']); } }, '📩 新着を受信');
      const all = h('button', { class: 'btn', onclick: () => { items.forEach((n) => { n.read = true; }); paint('open'); flash(list); hi(['n.read = true', 'const unread', '<b v-if', ':class="{ unread']); } }, '✓ すべて既読');
      return h('div', { class: 'vrB-live' }, h('div', { class: 'vrB-tip' }, '🔔 通知をクリック / 新着を受信'), h('div', { class: 'vrB-bar' }, h('b', { style: { fontSize: '.9rem' } }, '相談ナビ'), bell), list, h('div', { class: 'vrB-act' }, add, all));
    }

    function widgetFav(pre) {
      const S = SRC.fav;
      let hiT; const hi = (keys) => { pre.setHi(lns(S, keys)); clearTimeout(hiT); hiT = setTimeout(() => pre.setHi([]), 6000); };
      const LW = [{ id: 1, name: '佐藤 弁護士', field: '離婚' }, { id: 2, name: '鈴木 弁護士', field: '相続' }, { id: 3, name: '高橋 弁護士', field: '労働' }];
      let favs = [2];
      const foot = h('div', { class: 'vrB-foot' });
      const stars = {};
      const rows = LW.map((l) => { const b = h('button', { class: 'vrB-star', title: 'お気に入り', onclick: () => {
        const had = favs.includes(l.id);
        favs = had ? favs.filter((x) => x !== l.id) : [...favs, l.id];
        paint(); flash(b); flash(foot);
        hi(['favs.value = favs', had ? 'favs.value.filter' : '[...favs.value', 'favs.value.includes(id)', ':class="{ on', '@click="toggle', '{{ favs.length }}']);
      } }, '★'); stars[l.id] = b; return h('div', { class: 'vrB-lw' }, h('span', l.name), h('small', l.field), b); });
      const paint = () => { LW.forEach((l) => stars[l.id].classList.toggle('on', favs.includes(l.id))); foot.textContent = 'お気に入り ' + favs.length + ' 件'; };
      paint();
      return h('div', { class: 'vrB-live' }, h('div', { class: 'vrB-tip' }, '★ をクリックして切り替え'), h('div', { class: 'vrB-box', style: { gap: '6px' } }, ...rows, foot));
    }

    /* ============ シーン1：3つのウィジェット ============ */
    function scene1(el) {
      const defs = [
        ['✍️ 文字数カウンタ', 'ConsultForm.vue', SRC.counter, widgetCounter],
        ['🔔 通知ベル', 'NoticeBell.vue', SRC.bell, widgetBell],
        ['★ お気に入り', 'LawyerList.vue', SRC.fav, widgetFav]
      ];
      let cur = 0;
      const host = h('div', { class: 'vi-eq' });
      const tabs = tab(defs.map((d) => d[0]), 0, (i) => { cur = i; draw(); });
      const draw = () => {
        tabs.querySelectorAll('.vi-chip').forEach((c, i) => c.classList.toggle('off', i !== cur));
        const d = defs[cur];
        const pre = code(d[2], 'vue', { color: C, file: d[1], dim: true });
        host.replaceChildren(d[3](pre), h('div', { class: 'vrB-code' }, pre));
      };
      draw();
      el.append(h('div', { class: 'vrB-wrap' }, tabs, host));
    }

    /* ============ シーン2：画面の変化を見張れ ============ */
    function scene2(el) {
      const S = "<script setup lang=\"ts\">\nimport { ref } from 'vue'\n\nconst name = ref('山田 太郎')\nconst unread = ref(3)\nconst status = ref<'new' | 'doing' | 'done'>('new')\nconst memo = ref('折り返し希望')\nconst LABEL = { new: '新規', doing: '対応中', done: '完了' }\n</script>\n\n<template>\n  <h3>{{ name }}</h3>\n  <b v-if=\"unread > 0\">{{ unread }}</b>\n  <span :class=\"status\">{{ LABEL[status] }}</span>\n</template>";
      const pre = code(S, 'vue', { color: C, file: 'CaseRow.vue', dim: true });
      const LABEL = { new: '新規', doing: '対応中', done: '完了' };
      const st = { name: '山田 太郎', unread: 3, status: 'new', memo: '折り返し希望' };
      const R = [
        { q: "name.value = '山田 花子'", key: 'name', set: () => { st.name = '山田 花子'; }, hi: ["const name", '{{ name }}'] },
        { q: 'unread.value = 0', key: 'unread', set: () => { st.unread = 0; }, hi: ['const unread', 'v-if="unread'] },
        { q: "status.value = 'doing'", key: 'status', set: () => { st.status = 'doing'; }, hi: ['const status', ':class="status"'] },
        { q: "memo.value = '電話は不要'", key: 'none', set: () => { st.memo = '電話は不要'; }, hi: ['const memo'] }
      ];
      let n = 0, score = 0, locked = false;
      const nm = h('h3', { style: { margin: 0, fontSize: '1rem' } }), bd = h('span', { style: { marginLeft: 'auto' } }), tg = h('span', { class: 'vrB-tag' });
      const mkReg = (k, label, node) => h('div', { class: 'vrB-reg', onclick: () => pick(k, ev) }, label, node);
      const paint = () => { nm.textContent = st.name; bd.replaceChildren(...(st.unread > 0 ? [h('span', { class: 'vrB-badge', style: { position: 'static', display: 'inline-block' } }, st.unread)] : [h('small', { style: { color: '#99a' } }, '（バッジなし）')])); tg.textContent = LABEL[st.status]; tg.className = 'vrB-tag ' + st.status; };
      paint();
      const regs = { name: mkReg('name', '名前', nm), unread: mkReg('unread', 'バッジ', bd), status: mkReg('status', '状態', tg) };
      const none = h('div', { class: 'vrB-reg', style: { justifyContent: 'center' }, onclick: () => pick('none') }, '🙅 画面は変わらない');
      const q = h('div', { class: 'vrB-q' }), res = h('div', { class: 'vrB-sc' }), next = h('button', { class: 'btn primary', style: { '--c': C, display: 'none' }, onclick: () => { n++; round(); } }, '次へ ▶');
      const ev = null;
      function round() {
        if (n >= R.length) { q.textContent = '🎉 ' + score + ' / ' + R.length + ' 正解'; res.textContent = '画面に使っている ref だけが再描画される'; next.style.display = 'none'; pre.setHi([]); Object.values(regs).forEach((r) => r.classList.remove('ok', 'no')); none.classList.remove('ok', 'no'); return; }
        locked = false; q.textContent = R[n].q; res.textContent = '第 ' + (n + 1) + ' 問：画面のどこが変わる？ クリックで予想'; next.style.display = 'none';
        Object.values(regs).forEach((r) => r.classList.remove('ok', 'no')); none.classList.remove('ok', 'no');
        pre.setHi([]);
      }
      function pick(k) {
        if (locked || n >= R.length) return; locked = true;
        const r = R[n], right = k === r.key; if (right) score++;
        r.set(); paint(); pre.setHi(lns(S, r.hi));
        const node = regs[r.key]; if (node) flash(node);
        (k === 'none' ? none : regs[k]).classList.add(right ? 'ok' : 'no');
        if (!right) (r.key === 'none' ? none : regs[r.key]).classList.add('ok');
        res.textContent = right ? '✓ 正解！' + (r.key === 'none' ? ' template で使っていないので再描画なし' : '') : '✖ 惜しい。光った行を見よう';
        next.style.display = ''; next.textContent = n === R.length - 1 ? '結果を見る ▶' : '次へ ▶';
      }
      round();
      const live = h('div', { class: 'vrB-live' }, q, h('div', { style: { display: 'grid', gap: '8px', background: '#f4f6fb', padding: '10px', borderRadius: '10px' } }, regs.name, regs.unread, regs.status, none), res, h('div', { class: 'vrB-act' }, next, h('button', { class: 'btn', onclick: () => { Object.assign(st, { name: '山田 太郎', unread: 3, status: 'new', memo: '折り返し希望' }); n = 0; score = 0; paint(); round(); } }, '↺ 最初から')));
      el.append(h('div', { class: 'vi-eq' }, live, h('div', { class: 'vrB-code' }, pre)));
    }

    const idx = L.scenes.findIndex((s) => s.t === '実践：ミニTodo');
    const add = [
      { t: '実例：動くウィジェット3つ', tag: '実例', lead: '触ると、<b>走った行だけ</b>が光る。', render: scene1 },
      { t: '実例：画面の変化を見張れ', tag: '実例', lead: 'ref を書き換えたら、<b>画面のどこ</b>が変わる？', render: scene2 }
    ];
    L.scenes.splice(idx >= 0 ? idx : L.scenes.length, 0, ...add);
  }
})();
