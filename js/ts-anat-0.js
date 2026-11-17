/* 見本：解剖図（クラス / 型アノテーション） */
(function () {
  const K = window.KENSHU;
  if (!K || !K.tsAnat) return;
  const C = { kw: 'var(--pink)', name: 'var(--ts)', type: 'var(--basic)', val: 'var(--team)', sym: 'var(--mute)' };

  K.tsAnat('型アノテーションの読み方', {
    title: '🔍 型アノテーションの解剖：let age: number = 20;',
    tokens: [['let', ['decl']], [' ', []], ['age', ['name']], [':', ['colon']], [' ', []], ['number', ['type']], [' ', []], ['=', ['eq']], [' ', []], ['20', ['val']], [';', []]],
    parts: {
      decl: ['宣言（let）', C.kw, '「箱を作るよ」の合図。変えないなら const'],
      name: ['名前（age）', C.name, '箱の名前。あとでこの名前で中身を使う'],
      colon: ['コロン（:）', 'var(--violet)', 'ここから先は「型」を書く、という区切り'],
      type: ['型（number）', C.type, '箱に入れていい種類。数字だけ入る'],
      eq: ['イコール（=）', C.sym, '右の値を、左の箱に入れる'],
      val: ['値（20）', C.val, '最初に入れる中身。型に合っていないと赤線'],
    },
  });

  K.tsAnat('クラス = 設計図、new = スタンプ', {
    title: '🔍 クラスの解剖：class Booking { … } と new Booking(…)',
    tokens: [
      ['class', ['kw']], [' ', []], ['Booking', ['cname']], [' {\n  ', []], ['name', ['prop']], [': string;\n  ', ['prop']], ['constructor', ['ctor']], ['(name: string)', ['ctor']], [' {\n    ', []], ['this', ['this']], ['.name = name;\n  }\n\n  ', []], ['cancel', ['method']], ['() { … }\n}\n\n', []],
      ['const', []], [' b1 ', ['inst']], ['= ', []], ['new', ['new']], [' Booking', ['cname']], ['("田中")', []], [';', []],
    ],
    parts: {
      kw: ['class', C.kw, '「設計図を書くよ」の合図'],
      cname: ['クラス名（Booking）', C.name, '設計図の名前。大文字で始める（PascalCase）'],
      prop: ['プロパティ（name）', C.type, '1件ごとに持つ「項目」（データ）'],
      ctor: ['constructor', 'var(--violet)', 'new した時に1回だけ動く「準備」の関数'],
      this: ['this', 'var(--pink)', '「いま作っているこの実体自身」。b1 なら b1'],
      method: ['メソッド（cancel）', 'var(--basic)', 'その実体にできる「操作」（関数）'],
      new: ['new', 'var(--team)', '設計図からスタンプを押して、実体（インスタンス）を作る'],
      inst: ['インスタンス（b1）', 'var(--ts)', 'new で作られた実物。1件ごとに中身が違う'],
    },
  });
})();
