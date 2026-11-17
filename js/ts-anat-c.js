/* 解剖図：ユニットテスト / as const・ユーティリティ型 / 命名 */
(function () {
  const K = window.KENSHU;
  if (!K || !K.tsAnat) return;
  const C = { kw: 'var(--pink)', name: 'var(--ts)', type: 'var(--basic)', val: 'var(--team)', sym: 'var(--mute)', v: 'var(--violet)', ok: 'var(--ok)', bad: 'var(--bad)' };

  K.tsAnat('なぜテストを書くの？', {
    title: '🔍 テストの解剖：expect(add(1, 2)).toBe(3);',
    tokens: [['expect', ['expect']], ['(', []], ['add', ['call']], ['(1, 2)', ['call']], [')', []], ['.', []], ['toBe', ['matcher']], ['(', []], ['3', ['want']], [')', []], [';', []]],
    parts: {
      expect: ['expect', C.kw, '「この結果を確かめるよ」と宣言する関数'],
      call: ['対象の呼び出し（add(1, 2)）', C.name, '確かめたい関数を、実際に動かして結果を得る'],
      matcher: ['マッチャー（toBe）', C.v, '結果と期待が同じかを比べる判定の種類'],
      want: ['期待する答え（3）', C.val, 'こうなるはず、という正解。違うとテストが失敗'],
    },
  });

  K.tsAnat('テストの種類', {
    title: '🔍 ユニットテストの解剖：it("税込を計算する", () => { … })',
    tokens: [['it', ['it']], ['(', []], ['"税込を計算する"', ['title']], [', ', []], ['() => {', ['body']], [' ', []], ['expect(taxIn(100)).toBe(110);', ['check']], [' ', []], ['}', ['body']], [');', []]],
    parts: {
      it: ['it', C.kw, '1つのテストを書く関数。小さな部品を1つだけ確かめる'],
      title: ['テスト名', C.val, '何を確かめるかを日本語で書く。失敗時に表示される'],
      body: ['テスト本体（() => { })', C.type, 'このテストで動かす処理をまとめた関数'],
      check: ['確認（expect…toBe）', C.ok, '結果が正しいかを判定する1行'],
    },
  });

  K.tsAnat('ユニットテストの流れ', {
    title: '🔍 テストの解剖：it("合計を出す", () => { expect(total(…)).toBe(300); })',
    tokens: [['it', ['it']], ['("合計を出す", ', ['name']], ['() => {', ['body']], ['\n  ', []], ['expect', ['expect']], ['(', []], ['total([100, 200])', ['run']], [')', []], ['.toBe', ['matcher']], ['(', []], ['300', ['want']], [');', []], ['\n}', ['body']], [');', []]],
    parts: {
      it: ['it', C.kw, '設計したテストケース1件を書き出す関数'],
      name: ['テスト名', C.val, '「何ができれば合格か」を言葉にしたもの'],
      body: ['テスト本体', C.type, '実行される中身。ここでコードを動かして確かめる'],
      expect: ['expect', C.name, '実行結果を受け取って、確かめる準備をする'],
      run: ['実行（total(…)）', C.bad, 'テスト対象の関数を動かす。ここが「実行」'],
      matcher: ['マッチャー（toBe）', C.v, '結果と期待が同じかを比べる'],
      want: ['期待値（300）', C.ok, '合格となる正解の値'],
    },
  });

  K.tsAnat('Vitest をセットアップ', {
    title: '🔍 コマンドの解剖：npm install -D vitest',
    tokens: [['npm', ['cmd']], [' ', []], ['install', ['sub']], [' ', []], ['-D', ['opt']], [' ', []], ['vitest', ['pkg']]],
    parts: {
      cmd: ['コマンド（npm）', C.kw, 'パッケージを管理するツールを呼び出す'],
      sub: ['サブコマンド（install）', C.type, 'npm に「追加してね」とお願いする動詞'],
      opt: ['オプション（-D）', C.v, '開発中だけ使う道具として入れる指定'],
      pkg: ['パッケージ名（vitest）', C.val, '入れたいテスト用ツールの名前'],
    },
  });

  K.tsAnat('TDD：赤 → 緑 → 赤 → 緑', {
    title: '🔍 テストの解剖：it("2 の 2 乗は 4", …)',
    tokens: [['it', ['it']], ['(', []], ['"2 の 2 乗は 4"', ['name']], [', () => {\n  ', []], ['expect', ['expect']], ['(', []], ['square(2)', ['call']], [')', []], ['.toBe', ['matcher']], ['(', []], ['4', ['want']], [');\n}', []], [');', []]],
    parts: {
      it: ['it', C.kw, '先に書く「こうなってほしい」という約束'],
      name: ['テスト名', C.val, 'やりたいことを一文で書いたもの'],
      expect: ['expect', C.name, '結果を確かめる準備をする'],
      call: ['実行（square(2)）', C.bad, 'まだ未実装なら失敗（赤）、作れば成功（緑）'],
      matcher: ['マッチャー（toBe）', C.v, '結果が期待と同じかを比べる'],
      want: ['期待値（4）', C.ok, '先に決めておく正解。ここを変えると再び赤'],
    },
  });

  /* ⟦キー|文字⟧ で光らせる範囲を指定（全文のコードをそのまま書く） */
  const tk = (src) => { const out = []; let last = 0; src.replace(/⟦([^|⟧]*)\|([^⟧]*)⟧/g, (m, k, x, i) => { if (i > last) out.push([src.slice(last, i), []]); out.push([x, k.split(',').map((y) => y.trim()).filter(Boolean)]); last = i + m.length; return m; }); if (last < src.length) out.push([src.slice(last), []]); return out; };

  K.tsAnat('テストの型：Arrange → Act → Assert', {
    title: '🔍 AAA の解剖：calcTotal.test.ts まるごと',
    split: true,
    tokens: tk(`import { ⟦imp|it, expect⟧ } from "vitest";
import { ⟦tgt|calcTotal⟧ } from "./calcTotal";

⟦it|it⟧(⟦name|"商品2点の合計が出る"⟧, () => {
  ⟦arr|// ① 準備（Arrange）
  const items = [{ price: 100, qty: 1 }, { price: 200, qty: 1 }];⟧

  ⟦act|// ② 実行（Act）
  const total = calcTotal(items);⟧

  ⟦ast|// ③ 確認（Assert）
  expect(total)⟧⟦ast,mat|.toBe(⟧⟦ast,exp|300⟧⟦ast,mat|)⟧⟦ast|;⟧
});
`),
    parts: {
      it: ['it（1件のテスト）', C.kw, 'テストを1件書く関数。中に 準備 → 実行 → 確認 を入れる'],
      name: ['テスト名', C.val, '「何を確かめるか」を日本語で。失敗したとき一番に目に入る'],
      arr: ['① 準備（Arrange）', C.type, '使うデータを用意する。ここでは商品2点（100円・200円）'],
      act: ['② 実行（Act）', C.bad, 'テストしたい関数を、1回だけ動かす。結果を total に受け取る'],
      ast: ['③ 確認（Assert）', C.ok, '結果が期待どおりかを判定する。expect(結果)'],
      mat: ['マッチャー（toBe）', C.v, '「同じ値か」の比べ方。期待値を () の中に入れる'],
      exp: ['期待値（300）', C.val, '100 + 200 ＝ 300 になるはず、と先に決めておく答え'],
      tgt: ['テスト対象', C.name, 'テストしたい関数。別ファイルから import して使う'],
      imp: ['道具（it / expect）', C.sym, 'vitest から、テストを書く道具を借りる'],
    },
    flow: { title: '3つの段階は、データでつながる', nodes: [['arr', '🧺', '① 準備', 'items（データ）を作る'], ['act', '⚙️', '② 実行', 'calcTotal(items) → total'], ['ast', '✅', '③ 確認', 'total が 300 か？']], edges: ['items を渡す', 'total（結果）を渡す'], order: '順番は必ず 準備 → 実行 → 確認。実行は1テストにつき1回だけ' },
  });

  K.tsAnat('ミニテストランナー', {
    title: '🔍 例外テストの解剖：expect(() => deposit(0)).toThrow()',
    tokens: [['it', ['it']], ['(', []], ['"0円は拒否"', ['name']], [', () => {\n  ', []], ['expect', ['expect']], ['(', []], ['() => deposit(0)', ['wrap']], [')', []], ['.toThrow', ['matcher']], ['()', []], [';\n}', []], [');', []]],
    parts: {
      it: ['it', C.kw, '1つのテストケースを書く関数'],
      name: ['テスト名', C.val, '「0円の入金は断る」という期待を言葉にする'],
      expect: ['expect', C.name, '結果を確かめる準備をする'],
      wrap: ['関数で包む（() => …）', C.bad, 'エラーを expect が受け止められるよう関数に包む'],
      matcher: ['マッチャー（toThrow）', C.v, 'エラーが投げられたら合格、と判定する'],
    },
  });

  K.tsAnat('describe / it / expect 早見表', {
    title: '🔍 テストの全体像：describe → it → expect',
    tokens: [['describe', ['describe']], ['("Cart", ', ['group']], ['() => {\n  ', []], ['it', ['it']], ['("合計が出る", ', ['name']], ['() => {\n    ', []], ['expect', ['expect']], ['(1)', ['actual']], ['.toBe', ['matcher']], ['(1)', ['actual']], [';\n  });\n}', []], [');', []]],
    parts: {
      describe: ['describe', C.kw, '関連するテストを1つのグループにまとめる'],
      group: ['グループ名', C.sym, '何についてのテスト群かを示す名前'],
      it: ['it', C.name, '1件のテストケース。describe の中に並べる'],
      name: ['テスト名', C.val, 'そのテストで何を確かめるかの説明'],
      expect: ['expect', C.type, '確かめたい値を受け取る関数'],
      matcher: ['マッチャー（toBe）', C.v, '値が同じかを比べる判定'],
      actual: ['値（1）', C.ok, 'expect に渡す値と、期待する値'],
    },
  });

  K.tsAnat('as const：値をそのまま型に', {
    title: '🔍 as const の解剖：const PLANS = { … } as const;',
    tokens: [['const', ['decl']], [' ', []], ['PLANS', ['name']], [' = ', []], ['{ ', ['obj']], ['free', ['key']], [': ', ['obj']], ['0', ['val']], [', ', ['obj']], ['pro', ['key']], [': ', ['obj']], ['980', ['val']], [' }', ['obj']], [' ', []], ['as const', ['asc']], [';', []]],
    parts: {
      decl: ['宣言（const）', C.kw, '変数を作る合図。あとから代入し直せない'],
      name: ['名前（PLANS）', C.name, '固定値のセットの名前。大文字で定数らしく'],
      obj: ['オブジェクト', C.sym, '名前と値のペアをまとめた入れ物'],
      key: ['キー（free / pro）', C.type, '値を取り出すときの名前。typo は型エラーに'],
      val: ['値（0 / 980）', C.val, 'as const で「number」でなく 0 や 980 そのものになる'],
      asc: ['as const', C.v, '値を書き換え不可にして、型もそのままに固定する'],
    },
  });

  K.tsAnat('ユーティリティ型', {
    title: '🔍 ユーティリティ型の解剖：type Draft = Partial<Consultation>;',
    tokens: [['type', ['kw']], [' ', []], ['Draft', ['newname']], [' = ', []], ['Partial', ['util']], ['<', ['gen']], ['Consultation', ['base']], ['>', ['gen']], [';', []]],
    parts: {
      kw: ['type', C.kw, '型に別名をつける合図'],
      newname: ['新しい型名（Draft）', C.name, '変形してできた型につける名前'],
      util: ['ユーティリティ型（Partial）', C.v, '全項目を「あってもなくてもよい」に変える道具'],
      gen: ['山かっこ（< >）', C.sym, '道具に「元にする型」を渡す入口と出口'],
      base: ['元の型（Consultation）', C.type, '変形のもとになる型'],
    },
  });

  K.tsAnat('組み合わせ：権限チェック', {
    title: '🔍 Record の解剖：Record<Role, Action[]>',
    tokens: [['const', ['decl']], [' ', []], ['PERMS', ['name']], [': ', []], ['Record', ['rec']], ['<', []], ['Role', ['rolet']], [', ', []], ['Action[]', ['actt']], ['>', []], [' = { ', []], ['admin', ['rolet']], [': ', []], ['["read", "write"]', ['actt']], [', ', []], ['user', ['rolet']], [': ', []], ['["read"]', ['actt']], [' };', []]],
    parts: {
      decl: ['宣言（const）', C.kw, '変数を作る合図'],
      name: ['名前（PERMS）', C.name, '権限の一覧表の名前'],
      rec: ['Record', C.v, '「キーの型 → 値の型」の対応表を作る道具'],
      rolet: ['キー（Role）', C.type, '役割の名前。足りない役割や typo は型エラー'],
      actt: ['値（Action[]）', C.val, 'その役割に許す操作のリスト'],
    },
  });

  K.tsAnat('4つの書き方', {
    title: '🔍 命名の解剖：const MAX_RETRIES = 3;',
    tokens: [['const', ['decl']], [' ', []], ['MAX', ['name']], ['_', ['name']], ['RETRIES', ['name']], [' = ', []], ['3', ['val']], [';', []]],
    parts: {
      decl: ['定数（const）', C.kw, '変わらない値を作る合図'],
      name: ['名前（UPPER_SNAKE_CASE）', C.name, '大文字を _ でつなぐ書き方。定数に使う'],
      val: ['値（3）', C.val, 'ずっと変わらない決まった数'],
    },
  });

  K.tsAnat('名前をつけよう', {
    title: '🔍 命名の解剖：const isLoggedIn = checkLogin(user);',
    tokens: [['const', ['decl']], [' ', []], ['isLoggedIn', ['bool']], [' = ', []], ['checkLogin', ['fn']], ['(', []], ['user', ['arg']], [')', []], [';', []]],
    parts: {
      decl: ['宣言（const）', C.kw, '結果を入れる箱を作る合図'],
      bool: ['真偽値の名前（isLoggedIn）', C.ok, 'is で始めると「はい／いいえ」の値だと分かる'],
      fn: ['関数名（checkLogin）', C.name, '動詞＋目的語で、何をする関数か伝える'],
      arg: ['引数（user）', C.val, '関数に渡す材料。名詞で書く'],
    },
  });
})();
