/* ジェネリクスの「< >」の読み方（右の「このシーンの用語」パネル用）
   [用語, 読み, やさしい説明, 現場では] */
(function () {
  var K = window.KENSHU;
  if (!K) return;
  K.sceneTerms = K.sceneTerms || {};
  var L = [
    ['< >（山かっこ）', 'やまかっこ', '型を「引数みたいに」渡す入れ物。関数の ( ) が「値」を渡すのに対し、< > は「型」を渡す。', '読み方：identity<T> は「アイデンティティ・オブ・T」または「ティー型の identity」。Box<string> は「ボックス・オブ・ストリング」。'],
    ['<T>（型パラメータ）', 'ティー', '「あとで決める型」の名前（仮の名前）。T は Type の頭文字。呼ぶときに本物の型が入る。', '複数あるときは <T, U>。意味が分かる名前なら <TItem> や <TKey> も OK。'],
    ['型引数', 'かたひきすう', '呼び出す側が < > に書く本物の型。identity<string>("a") の string。省略すると TypeScript が推論する。', 'ref<number>(0) の number も型引数。Vue / Promise<T> / Array<T> で毎日見る。'],
    ['Array<T>', 'アレイ・オブ・ティー', '「T の配列」。string[] と同じ意味。Array<string> は「文字列の配列」と読む。', 'どちらでも同じ。人気は string[]。入り組んだ型のときだけ Array<> を使う。'],
    ['Promise<T>', 'プロミス・オブ・ティー', '「あとで T が届く約束」。Promise<User> は「あとで User が来る」と読む。', 'async 関数の戻り値は必ず Promise<…>。API の結果型を < > に書く。'],
    ['extends（制約）', 'エクステンズ', '<T extends { id: number }> は「T は id を持つ型だけ OK」という条件。', '何でも入る T だと中身を触れない。条件を付けて、安全に .id などを使えるようにする。'],
    ['型推論', 'かたすいろん', '< > を書かなくても、渡した値から T を TypeScript が自動で当てること。', 'identity("a") だけで T=string になる。迷ったらまず書かずに、ホバーして確認。'],
    ['any との違い', 'エニー', 'any は「型を捨てる」。ジェネリクスは「型を覚えたまま通す」。', 'any で返すと戻り値の型が消える。<T> なら入れた型がそのまま出てくる。'],
  ];
  ['Box<T> マシン', 'identity<T>：入れた型が出てくる', '実践：any を T に置き換えよう'].forEach(function (t) {
    K.sceneTerms[t] = (K.sceneTerms[t] || []).concat(L.map(function (x) { return { k: x[0], y: x[1], m: x[2], r: x[3] }; }));
  });
  if (K.glossAdd) K.glossAdd(L.map(function (x) { return { k: x[0], kind: 'word', m: x[2], r: x[3], y: x[1], t: '用語' }; }));
})();
