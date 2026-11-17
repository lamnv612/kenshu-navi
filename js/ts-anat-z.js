/* 後から足す解剖図（タブで切り替え）。a/b/c の後・apply の前に読み込む */
(function () {
  const K = window.KENSHU;
  if (!K || !K.tsAnatSpecs) return;
  const fn = K.tsAnatSpecs['基礎文法の公式'];
  if (!fn) return;
  const v = {
    tab: '変数を宣言する',
    title: '🔍 変数の公式：let 名前: 型 = 値;',
    tokens: [['let', ['decl']], [' ', []], ['age', ['name']], [':', ['colon']], [' ', []], ['number', ['type']], [' ', []], ['=', ['eq']], [' ', []], ['20', ['val']], [';', []]],
    parts: {
      decl: ['宣言（let / const）', 'var(--pink)', '箱を作る合図。変えないなら const'],
      name: ['名前（age）', 'var(--ts)', '箱の名前。あとでこの名前で中身を使う'],
      colon: ['コロン（:）', 'var(--violet)', 'ここから先は「型」を書く、という区切り'],
      type: ['型（number）', 'var(--basic)', '箱に入れていい種類。数字だけ入る'],
      eq: ['イコール（=）', 'var(--mute)', '右の値を、左の箱に入れる'],
      val: ['値（20）', 'var(--team)', '最初に入れる中身。型に合わないと赤線'],
    },
  };
  const f = Object.assign({}, fn, { tab: '関数を宣言する' });
  delete f.more;
  K.tsAnatSpecs['基礎文法の公式'] = Object.assign({}, v, { more: [f] });
})();
