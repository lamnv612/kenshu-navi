/* 解剖図 a：環境準備〜interface/extends */
(function () {
  const K = window.KENSHU;
  if (!K || !K.tsAnat) return;
  const C = { kw: 'var(--pink)', name: 'var(--ts)', type: 'var(--basic)', val: 'var(--team)', sym: 'var(--mute)', vi: 'var(--violet)', ok: 'var(--ok)', bad: 'var(--bad)' };

  K.tsAnat('環境準備：TypeScript を動かす', {
    title: '🔍 コマンドの解剖：npm install -g typescript',
    tokens: [['npm', ['cmd']], [' ', []], ['install', ['sub']], [' ', []], ['-g', ['opt']], [' ', []], ['typescript', ['pkg']]],
    parts: {
      cmd: ['コマンド（npm）', C.kw, 'パッケージを管理する道具の名前。最初に書く'],
      sub: ['サブコマンド（install）', C.type, 'その道具に頼む「やること」。入れてね、という意味'],
      opt: ['オプション（-g）', C.vi, 'やり方の指定。-g は「どこからでも使えるように」'],
      pkg: ['パッケージ名（typescript）', C.val, '入れたいものの名前。ここでは TypeScript 本体'],
    },
  });

  K.tsAnat('そのバグ、どこで見つかる？', {
    title: '🔍 型つき関数の解剖：function add(a: number, b: number)',
    tokens: [['function', ['kw']], [' ', []], ['add', ['name']], ['(', []], ['a', ['arg']], [': number', ['type']], [', ', []], ['b', ['arg']], [': number', ['type']], [') { ', []], ['return', ['ret']], [' a + b;', ['ret']], [' }', []]],
    parts: {
      kw: ['function', C.kw, '「関数を作るよ」の合図'],
      name: ['関数名（add）', C.name, '関数の名前。呼ぶときにこの名前を使う'],
      arg: ['引数（a, b）', C.val, '関数に渡す材料を受け取る箱'],
      type: ['型（: number）', C.type, '「数字だけ」という約束。文字を渡すと実行前に赤線'],
      ret: ['return', C.ok, '結果を呼び出し元に返す。ここで計算した答えが出る'],
    },
  });

  K.tsAnat('TS は JS に変換される', {
    title: '🔍 変換の解剖：const n: number = 5;  → const n = 5;',
    tokens: [['const', ['kw']], [' ', []], ['n', ['name']], [': number', ['type']], [' = ', []], ['5', ['val']], [';', []]],
    parts: {
      kw: ['const', C.kw, 'JS にもある書き方。そのまま残る'],
      name: ['名前（n）', C.name, '変数の名前。これも JS にそのまま残る'],
      type: ['型（: number）', C.type, 'TS だけの部分。tsc が JS に変換するとき消える'],
      val: ['値（5）', C.val, '中身。JS になっても同じ値が残る'],
    },
  });

  K.tsAnat('基礎文法の公式', {
    title: '🔍 関数の公式：function 名前(引数: 型): 戻り値の型 { 中身 }',
    tokens: [['function', ['kw']], [' ', []], ['greet', ['name']], ['(', []], ['name', ['arg']], [': string', ['atype']], [')', []], [': string', ['rtype']], [' { ', []], ['return "こんにちは、" + name;', ['body']], [' }', []]],
    parts: {
      kw: ['function', C.kw, '「関数を作るよ」の合図'],
      name: ['名前（greet）', C.name, 'この関数を呼ぶときの名前'],
      arg: ['引数（name）', C.val, '入口。呼ぶときに渡される値の名前'],
      atype: ['引数の型（: string）', C.type, '入口に入れていい種類。ここでは文字だけ'],
      rtype: ['戻り値の型（: string）', C.bad, '出口。この関数が返す値の種類'],
      body: ['中身', C.ok, '実際に動く処理。結果は return で返す'],
    },
  });

  K.tsAnat('型の箱に値を入れよう', {
    title: '🔍 型の箱の解剖：const peopleText: string = "3";',
    tokens: [['const', ['kw']], [' ', []], ['peopleText', ['name']], [':', ['colon']], [' ', []], ['string', ['type']], [' = ', []], ['"3"', ['val']], [';', []]],
    parts: {
      kw: ['宣言（const）', C.kw, '「箱を作るよ」の合図。あとで入れ替えないなら const'],
      name: ['名前（peopleText）', C.name, '箱の名前。あとでこの名前で中身を使う'],
      colon: ['コロン（:）', C.vi, 'ここから先に型を書く、という区切り'],
      type: ['型（string）', C.type, '文字の箱。数字を入れようとすると赤線'],
      val: ['値（"3"）', C.val, '引用符で囲むと文字。見た目が数字でも number ではない'],
    },
  });

  K.tsAnat('const / let と型推論', {
    title: '🔍 型推論の解剖：const TAX_RATE = 0.1;',
    tokens: [['const', ['kw']], [' ', []], ['TAX_RATE', ['name']], [' ', []], ['= ', []], ['0.1', ['val', 'infer']], [';', []]],
    parts: {
      kw: ['const', C.kw, '入れ直しできない箱。税率や設定値に向く'],
      name: ['名前（TAX_RATE）', C.name, '変わらない値は大文字で書くのが慣習'],
      val: ['値（0.1）', C.val, '最初に入れる中身。あとから変えられない'],
      infer: ['型は自動で決まる', C.type, '型を書かなくても 0.1 を見て number だと分かる'],
    },
  });

  K.tsAnat('型推論：どこまで書く？', {
    title: '🔍 型を書く場所：function subtotal(price: number, qty: number): number',
    tokens: [['function', ['kw']], [' ', []], ['subtotal', ['name']], ['(', []], ['price', ['arg']], [': number', ['in']], [', ', []], ['qty', ['arg']], [': number', ['in']], [')', []], [': number', ['out']], [' {', []]],
    parts: {
      kw: ['function', C.kw, '「関数を作るよ」の合図'],
      name: ['関数名（subtotal）', C.name, '小計を出す関数の名前'],
      arg: ['引数の名前', C.val, '呼ぶときに渡される値を入れる箱'],
      in: ['入口（引数の型）', C.type, '推論できないので必ず書く。ここが一番大事'],
      out: ['出口（戻り値の型）', C.ok, '書くと「この関数は数字を返す」と約束できる'],
    },
  });

  K.tsAnat('配列・タプル・オブジェクト', {
    title: '🔍 配列の解剖：const names: string[] = ["田中", "山本"];',
    tokens: [['const', ['kw']], [' ', []], ['names', ['name']], [': ', []], ['string', ['elem', 'arr']], ['[]', ['arr']], [' = ', []], ['[', ['lit']], ['"田中", "山本"', ['items']], [']', ['lit']], [';', []]],
    parts: {
      kw: ['const', C.kw, '箱を作る合図。配列の中身は足したり変えたりできる'],
      name: ['名前（names）', C.name, '配列全体につける名前'],
      elem: ['要素の型（string）', C.type, '中に入れる1つ分の型。ここでは文字'],
      arr: ['配列の型（[]）', C.bad, '型の後ろの [] は「それが並んだ配列」という意味'],
      lit: ['角括弧（[ ]）', C.vi, '値の側の [ ] で、中身を並べて配列を作る'],
      items: ['要素', C.val, 'カンマで区切って並べる。順番に 0 番目、1 番目'],
    },
  });

  K.tsAnat('any と unknown', {
    title: '🔍 unknown の解剖：const res: unknown = JSON.parse(text);',
    tokens: [['const', ['kw']], [' ', []], ['res', ['name']], [': ', []], ['unknown', ['type']], [' = ', []], ['JSON.parse', ['call']], ['(', []], ['text', ['src']], [')', []], [';', []]],
    parts: {
      kw: ['const', C.kw, '入れ直さない箱を作る合図'],
      name: ['名前（res）', C.name, '外から来た値を受け取る箱'],
      type: ['型（unknown）', C.ok, '何でも入るが、確認するまで使えない安全な型'],
      call: ['JSON.parse', C.val, '文字を JS の値に直す。何が出るかは相手次第'],
      src: ['元の文字（text）', C.sym, '外から届いた JSON の文字列'],
    },
  });

  K.tsAnat('値がない型：void / undefined / null', {
    title: '🔍 「値がない」の型：function findName(id: number): string | null',
    tokens: [['function', ['kw']], [' ', []], ['findName', ['name']], ['(id: number)', ['arg']], [': ', []], ['string', ['type']], [' | ', ['bar']], ['null', ['null']], [' { return null; }', []]],
    parts: {
      kw: ['function', C.kw, '「関数を作るよ」の合図'],
      name: ['関数名（findName）', C.name, '名前を探す関数。見つからないこともある'],
      arg: ['引数（id: number）', C.val, '探すための番号を受け取る'],
      type: ['型（string）', C.type, '見つかったときに返る、文字の型'],
      bar: ['縦線（|）', C.vi, '「または」。左か右のどちらかが入る'],
      null: ['null', C.bad, '「見つからない」を表す値。使う前にチェックが必要'],
    },
  });

  K.tsAnat('Union：どれか1つ', {
    title: '🔍 Union の解剖：let id: number | string;',
    tokens: [['let', ['kw']], [' ', []], ['id', ['name']], [': ', []], ['number', ['t1']], [' | ', ['bar']], ['string', ['t2']], [';', []]],
    parts: {
      kw: ['let', C.kw, '入れ直せる箱を作る合図'],
      name: ['名前（id）', C.name, '箱の名前。番号でも文字でもよい ID'],
      t1: ['1つ目の型（number）', C.type, '選べる候補の1つ目。数字が入る'],
      bar: ['縦線（|）', C.vi, '「または」。候補を並べるための記号'],
      t2: ['2つ目の型（string）', C.val, '候補の2つ目。文字も入る'],
    },
  });

  K.tsAnat('Enum：名前の付いた定数', {
    title: '🔍 Enum の解剖：enum Status { Received, Reviewing, Done }',
    tokens: [['enum', ['kw']], [' ', []], ['Status', ['ename']], [' { ', []], ['Received', ['member']], [', ', []], ['Reviewing', ['member']], [', ', []], ['Done', ['member']], [' }', []]],
    parts: {
      kw: ['enum', C.kw, '「名前つき定数のセットを作るよ」の合図'],
      ename: ['Enum 名（Status）', C.name, 'セット全体の名前。Status.Done のように使う'],
      member: ['メンバー', C.val, '選べる名前。自動で 0, 1, 2 と番号が付く'],
    },
  });

  K.tsAnat('interface：形チェッカー', {
    title: '🔍 interface の解剖：項目の名前と型で「形」を決める',
    tokens: [
      ['interface', ['kw']], [' ', []], ['Consultation', ['iname']], [' {\n  ', []], ['id', ['prop']], [': ', []], ['number', ['type']], [';\n  ', []], ['title', ['prop']], [': string;\n  ', ['type']], ['fee', ['prop']], ['?', ['opt']], [': number;\n}', ['type']],
    ],
    parts: {
      kw: ['interface', C.kw, '「オブジェクトの形を決めるよ」の合図'],
      iname: ['名前（Consultation）', C.name, '形につける名前。大文字で始める'],
      prop: ['プロパティ名', C.val, 'オブジェクトが持つ項目の名前'],
      type: ['型', C.type, '各項目に入れていい種類。違うと赤線'],
      opt: ['オプション（?）', C.bad, 'つけた項目は省略してもよい'],
    },
  });

  K.tsAnat('extends と merge', {
    title: '🔍 extends の解剖：interface Booking extends Consultation',
    tokens: [['interface', ['kw']], [' ', []], ['Booking', ['child']], [' ', []], ['extends', ['ext']], [' ', []], ['Consultation', ['parent']], [' { ', []], ['time: string;', ['add']], [' }', []]],
    parts: {
      kw: ['interface', C.kw, '形を決める合図'],
      child: ['子（Booking）', C.name, '新しく作る形。親の項目も全部持つ'],
      ext: ['extends', C.vi, '「引き継ぐ」。親の項目をコピペせずに使える'],
      parent: ['親（Consultation）', C.ok, '引き継ぎ元の形。ここに足すと子にも反映される'],
      add: ['足す項目', C.val, '子だけが追加で持つ項目。差分だけ書く'],
    },
  });
})();
