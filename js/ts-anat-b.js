/* 解剖図 b：type / クラス応用 / ジェネリクス / 絞り込み */
(function () {
  const K = window.KENSHU;
  if (!K || !K.tsAnat) return;
  const C = { kw: 'var(--pink)', name: 'var(--ts)', type: 'var(--basic)', val: 'var(--team)', sym: 'var(--mute)', v: 'var(--violet)' };

  K.tsAnat('type：型に名前をつける', {
    title: '🔍 type の解剖：type Status = "todo" | "doing" | "done";',
    tokens: [['type', ['kw']], [' ', []], ['Status', ['name']], [' ', []], ['=', ['eq']], [' ', []], ['"todo"', ['opt']], [' ', []], ['|', ['bar']], [' ', []], ['"doing"', ['opt']], [' ', []], ['|', ['bar']], [' ', []], ['"done"', ['opt']], [';', []]],
    parts: {
      kw: ['type', C.kw, '「型に名札を付けるよ」の合図'],
      name: ['型の名前（Status）', C.name, 'あとで型として使える名札。大文字で始める'],
      eq: ['イコール（=）', C.sym, '右の型に、左の名前を付ける'],
      opt: ['選択肢（"todo" など）', C.val, 'この文字だけが入れる。打ち間違いは赤線になる'],
      bar: ['縦線（|）', C.v, '「または」。どれか1つならOK'],
    },
  });

  K.tsAnat('interface vs type', {
    title: '🔍 type の解剖：type Id = number | string;（interface にはできない書き方）',
    tokens: [['type', ['kw']], [' ', []], ['Id', ['name']], [' ', []], ['=', ['eq']], [' ', []], ['number', ['t1']], [' ', []], ['|', ['bar']], [' ', []], ['string', ['t2']], [';', []]],
    parts: {
      kw: ['type', C.kw, 'type は object 以外の型にも名前を付けられる'],
      name: ['名前（Id）', C.name, 'この型を使い回すための名札'],
      eq: ['イコール（=）', C.sym, 'interface は = を書かないが、type は書く'],
      t1: ['型1（number）', C.type, '1つ目の候補。数字なら入れる'],
      bar: ['縦線（|）', C.v, '「または」。Union は type なら作れる'],
      t2: ['型2（string）', C.val, '2つ目の候補。文字でも入れる'],
    },
  });

  K.tsAnat('アクセス修飾子：誰が触れる？', {
    title: '🔍 アクセス修飾子の解剖：private balance: number = 10000;',
    tokens: [['private', ['mod']], [' ', []], ['balance', ['name']], [':', ['colon']], [' ', []], ['number', ['type']], [' ', []], ['=', []], [' ', []], ['10000', ['val']], [';', []]],
    parts: {
      mod: ['修飾子（private）', C.kw, 'このクラスの中からだけ触れる。外からは赤線'],
      name: ['プロパティ名（balance）', C.name, 'クラスが持つ項目。private なら外から見えない'],
      colon: ['コロン（:）', C.v, 'ここから先は型を書く区切り'],
      type: ['型（number）', C.type, '入れていいのは数字だけ'],
      val: ['初期値（10000）', C.val, '最初に入っている中身'],
    },
  });

  K.tsAnat('readonly：書き換え禁止', {
    title: '🔍 readonly の解剖：private readonly name: string;',
    tokens: [['private', ['acc']], [' ', []], ['readonly', ['ro']], [' ', []], ['name', ['name']], [':', ['colon']], [' ', []], ['string', ['type']], [';', []]],
    parts: {
      acc: ['修飾子（private）', C.kw, '誰が触れるかを決める。クラスの外からは見えない'],
      ro: ['readonly', 'var(--bad)', '読むだけ。constructor で入れたあとは書き換え禁止'],
      name: ['プロパティ名（name）', C.name, '予約者の名前などの項目'],
      colon: ['コロン（:）', C.v, 'ここから先は型を書く区切り'],
      type: ['型（string）', C.type, '入れていいのは文字だけ'],
    },
  });

  K.tsAnat('getter / setter：門番を置く', {
    title: '🔍 setter の解剖：set age(v) で値を検査してから入れる',
    tokens: [
      ['set', ['set']], [' ', []], ['age', ['name']], ['(', []], ['v', ['arg']], [': number', ['arg']], [') {\n  ', []],
      ['if (v < 0) throw new Error("不正");', ['guard']], ['\n  ', []], ['this', ['this']], ['._age = ', ['store']], ['v', ['arg']], [';\n}', []],
    ],
    parts: {
      set: ['set', C.kw, '値を入れる時に動く「門番」の合図'],
      name: ['名前（age）', C.name, '外からは普通のプロパティ obj.age = 20 のように使う'],
      arg: ['引数（v）', C.type, '入れようとしている値を受け取る箱'],
      guard: ['検査（if … throw）', 'var(--bad)', 'おかしい値ならここで止める。これが門番の仕事'],
      this: ['this', C.val, '「このインスタンス自身」。中身をしまう先'],
      store: ['保管（._age =）', C.v, '検査に通った値を、本当の入れ物 _age に入れる'],
    },
  });

  K.tsAnat('継承：親から子へ', {
    title: '🔍 継承の解剖：class Lawyer extends Person { license = "12345"; }',
    tokens: [['class', ['kw']], [' ', []], ['Lawyer', ['child']], [' ', []], ['extends', ['ext']], [' ', []], ['Person', ['parent']], [' { ', []], ['license', ['prop']], [' = ', []], ['"12345"', ['val']], ['; }', []]],
    parts: {
      kw: ['class', C.kw, '「設計図を書くよ」の合図'],
      child: ['子クラス（Lawyer）', C.name, '新しく作る設計図。親の機能をそのまま持つ'],
      ext: ['extends', C.v, '「〜を受け継ぐ」。親の項目と操作を丸ごと使える'],
      parent: ['親クラス（Person）', C.type, '受け継ぐ元の設計図'],
      prop: ['追加の項目（license）', C.val, '子だけが持つ、自分用のプロパティ'],
      val: ['初期値（"12345"）', 'var(--ok)', 'license に最初から入っている文字'],
    },
  });

  K.tsAnat('super()：親を呼ぶ', {
    title: '🔍 super() の解剖：子の constructor で、まず親を呼ぶ',
    tokens: [
      ['constructor', ['ctor']], ['(', []], ['name: string', ['own']], [', ', []], ['license: string', ['own']], [') {\n  ', []],
      ['super', ['sup']], ['(', ['sup']], ['name', ['pass']], [')', ['sup']], [';\n  ', []], ['this', ['this']], ['.license = license;\n}', ['own']],
    ],
    parts: {
      ctor: ['constructor', C.v, '子を new した時に1回だけ動く準備の関数'],
      own: ['子の項目（license）', C.val, '子だけが持つ値。引数で受け取って保存する'],
      sup: ['super( )', C.kw, '親の constructor を呼ぶ。必ず最初に書く'],
      pass: ['親に渡す値（name）', C.type, '親の準備に必要な値をそのまま渡す'],
      this: ['this', C.name, '作っている実体自身。super のあとで使える'],
    },
  });

  K.tsAnat('Box<T> マシン', {
    title: '🔍 ジェネリクスの解剖：interface ApiResult<T> と ApiResult<Fee>',
    tokens: [
      ['interface', ['kw']], [' ', []], ['ApiResult', ['name']], ['<T>', ['tp']], [' {\n  data: ', []], ['T', ['tp']], [';\n}\n\n', []],
      ['const', []], [' res: ', []], ['ApiResult', ['name']], ['<Fee>', ['arg']], [' = { data: 3000 };', []],
    ],
    parts: {
      kw: ['interface', C.kw, '「形に名前を付けるよ」の合図'],
      name: ['型の名前（ApiResult）', C.name, '中身の型を後で決められる、入れ物の型'],
      tp: ['型引数（T）', C.val, '「何の結果か」を後で決める穴。T は仮の名前'],
      arg: ['型を渡す（<Fee>）', C.type, '使う時に T を Fee に決める。data は Fee になる'],
    },
  });

  K.tsAnat('identity<T>：入れた型が出てくる', {
    title: '🔍 ジェネリック関数の解剖：function identity<T>(x: T): T { return x; }',
    tokens: [
      ['function', ['kw']], [' ', []], ['identity', ['name']], ['<T>', ['tp']], ['(', []], ['x', ['arg']], [': ', []], ['T', ['in']], [')', []], [': ', []], ['T', ['out']], [' { ', []], ['return x;', ['ret']], [' }', []],
    ],
    parts: {
      kw: ['function', C.kw, '「関数を作るよ」の合図'],
      name: ['関数名（identity）', C.name, '受け取った値をそのまま返す関数'],
      tp: ['型引数（<T>）', C.val, '呼ばれた時に決まる型の穴。ここで宣言する'],
      arg: ['引数（x）', C.type, '渡された値を受け取る箱'],
      in: ['入力の型（T）', C.v, 'x の型。42 を渡せば T は number'],
      out: ['戻り値の型（T）', 'var(--ok)', '入れた型と同じ型が出てくる。any と違い型が消えない'],
      ret: ['return x', C.sym, '受け取った値を、そのまま返す'],
    },
  });

  K.tsAnat('どの型に何が入る？', {
    title: '🔍 unknown の解剖：let v: unknown = "abc"; v.length（赤線）',
    tokens: [['let', ['decl']], [' v', ['name']], [': ', []], ['unknown', ['unk']], [' = ', []], ['"abc"', ['val']], [';\n', []], ['v', ['name']], ['.length', ['use']], [';', []]],
    parts: {
      decl: ['宣言（let）', C.kw, '箱を作る合図'],
      name: ['変数（v）', C.name, '箱の名前。使う時もこの名前'],
      unk: ['unknown', C.v, '何でも入るが、確かめるまで中身は使えない型'],
      val: ['値（"abc"）', C.val, '実際には文字が入っている'],
      use: ['使おうとした操作（.length）', 'var(--bad)', 'unknown のままだと赤線。any なら通ってしまう'],
    },
  });

  K.tsAnat('絞り込み（narrowing）', {
    title: '🔍 絞り込みの解剖：if (typeof id === "string") { id.toUpperCase(); }',
    tokens: [
      ['if', ['kw']], [' (', []], ['typeof', ['typeof']], [' ', []], ['id', ['name']], [' === ', []], ['"string"', ['cmp']], [') {\n  ', []], ['id', ['name']], ['.toUpperCase()', ['use']], [';\n}', ['blk']],
    ],
    parts: {
      kw: ['if', C.kw, '条件が true の時だけ { } の中を実行する'],
      typeof: ['typeof', C.v, '値の型を文字で教えてくれる演算子'],
      name: ['変数（id）', C.name, 'string か number かもしれない値'],
      cmp: ['比べる文字（"string"）', C.val, 'string と一致した時だけ true になる'],
      use: ['文字専用の操作', C.type, '{ } の中では id は string。安心して使える'],
      blk: ['閉じ括弧（}）', C.sym, 'ここまでが「string と分かった」範囲'],
    },
  });

  K.tsAnat('?. と ??', {
    title: '🔍 ?. と ?? の解剖：const city = user.address?.city ?? "未登録";',
    tokens: [['const', ['decl']], [' city ', []], ['= ', []], ['user', ['obj']], ['.address', ['obj']], ['?.', ['opt']], ['city', ['prop']], [' ', []], ['??', ['nc']], [' ', []], ['"未登録"', ['def']], [';', []]],
    parts: {
      decl: ['宣言（const）', C.kw, '結果を入れる箱を作る合図'],
      obj: ['無いかもしれない値（address）', C.name, 'まだ登録されていないかもしれない住所'],
      opt: ['?.（オプショナルチェーン）', C.v, 'address が無ければ止めて undefined にする。エラーにならない'],
      prop: ['取り出す項目（city）', C.type, 'address があれば、その中の city を読む'],
      nc: ['??（null 合体）', 'var(--bad)', '左が null か undefined の時だけ、右を使う'],
      def: ['代わりの値（"未登録"）', C.val, '値が無かった時の予備'],
    },
  });
})();
