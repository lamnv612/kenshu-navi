/* 補足レッスン「Vue 単体テスト：コマンドの使い方」（x-vue-test-cmd）の用語。
   [用語, 読み, ひとこと説明, 現場では] */
(function () {
  var K = window.KENSHU;
  if (!K) return;
  K.sceneTerms = K.sceneTerms || {};
  var seen = {}, add = [];
  function S(title, list) {
    K.sceneTerms[title] = (K.sceneTerms[title] || []).concat(list.map(function (x) {
      if (!seen[x[0]]) { seen[x[0]] = 1; add.push({ k: x[0], kind: 'word', m: x[2], r: x[3], y: x[1], t: '用語' }); }
      return { k: x[0], y: x[1], m: x[2], r: x[3] };
    }));
  }

  S('描く：mount と shallowMount', [
    ['Vitest', 'ヴィーテスト', 'Vite と相性のよいテストランナー。テストを探して実行し、結果を出す。', '「Vitest で回す」。describe・it・expect もここの道具。'],
    ['Vue Test Utils', 'テストユーティルズ', 'Vue の部品をテストするための公式ライブラリ。VTU と略す。', '「VTU の mount で出す」。'],
    ['mount', 'マウント', '部品を作って、子も含めて本当に描く。wrapper を返す。', '「まず mount して」。テストの最初の 1 行。'],
    ['shallowMount', 'シャローマウント', '子コンポーネントをスタブにして、その部品だけを描く。', '「子が重いから shallowMount で」。'],
    ['wrapper', 'ラッパー', 'mount の戻り値。以降の操作・確認の入り口。', '「wrapper から find して」。'],
    ['stub', 'スタブ', '本物の代わりに置く、中身のない代役。', '「子をスタブにする」。タグは case-card-stub のようになる。'],
    ['slots', 'スロッツ', 'mount のオプション。<slot> に入れる中身を渡す。', '「slots で文言を差し替える」。'],
    ['global', 'グローバル', 'mount のオプション。plugins・stubs・provide など、アプリ全体の設定。', '「router は global.plugins で入れる」。'],
    ['attachTo', 'アタッチトゥー', '部品を本物の DOM に付けるオプション。', '「フォーカスの確認だけ attachTo」。使ったら unmount。'],
  ]);

  S('探す：find と get', [
    ['find', 'ファインド', 'セレクターで要素を 1 つ探す。無くても例外にならない。', '「find して exists() で確認」。'],
    ['findAll', 'ファインドオール', '一致する全部を配列で返す。', '「findAll の件数を見る」。'],
    ['get', 'ゲット', 'find と同じだが、無いと例外を投げる。', '「あるはずなら get」。タイプミスに気づける。'],
    ['findComponent', 'ファインドコンポ', '子コンポーネントを、部品そのものを渡して探す。', '「findComponent(CaseCard) で props を見る」。'],
    ['exists', 'イグジスツ', '要素が存在するかを true / false で返す。', '「バッジは exists() が false」。'],
    ['セレクター', 'セレクター', '要素を指す CSS の書き方。タグ・class・属性など。', '「セレクターが合ってない」。'],
    ['data-test', 'データ・テスト', 'テストが探すための目印の属性。見た目が変わっても壊れにくい。', '「data-test を付けておいて」。data-testid でも同じ。'],
    ['例外', 'れいがい', '処理が続けられないときに投げる、エラーの合図。', '「get は例外を投げる」。テストがそこで止まる。'],
  ]);

  S('操作する：trigger と setValue', [
    ['trigger', 'トリガー', 'click などのイベントを起こす。', "「trigger('click') で押す」。"],
    ['setValue', 'セットバリュー', '入力欄に値を打ち込む。', '「setValue で氏名を入力」。'],
    ['setProps', 'セットプロップス', 'mount したあとで、親から渡す値を変える。', '「setProps で残り枠を 5 に」。'],
    ['setData', 'セットデータ', 'Options API の data を直接変える。script setup では使えない。', '「setData は古い書き方向け」。'],
    ['await', 'アウェイト', '非同期の処理が終わるまで待つ。', '「trigger には await」。'],
    ['nextTick', 'ネクストティック', '次の画面更新まで待つ関数。', '「nextTick で待ってから確認」。'],
    ['flushPromises', 'フラッシュ', '終わっていない Promise を流し切って、画面に反映させる。', '「API の返事は flushPromises で待つ」。'],
    ['非同期', 'ひどうき', '結果がすぐ返らず、あとから届く処理。', '「DOM の更新は非同期」。'],
    ['イベント', 'イベント', 'クリックや入力など、利用者の操作で起きる出来事。', '「イベントを起こして確かめる」。'],
  ]);

  S('確かめる：expect と matcher', [
    ['expect', 'エクスペクト', '「この値は〜のはず」と期待を書く関数。', '「expect を 1 つは入れて」。'],
    ['matcher', 'マッチャー', 'expect のあとに付けて、値を比べるメソッド。toBe・toEqual など。', '「その matcher だと比べられない」。'],
    ['toBe', 'トゥービー', '文字・数・真偽を、ぴったり同じか比べる。', "「toBe('予約する')」。"],
    ['toEqual', 'トゥーイコール', 'オブジェクトや配列を、中身で比べる。', '「オブジェクトは toEqual」。'],
    ['toContain', 'トゥーコンテイン', '文字や配列に含まれるかを確かめる。', '「text() に toContain」。'],
    ['toHaveLength', 'ハブレングス', '配列や文字の長さを確かめる。', '「li が 3 つ、toHaveLength(3)」。'],
    ['emitted', 'エミッテッド', 'emit された記録。回数ぶんの配列で、中身は引数の配列。', "「emitted('cancel')?.[0] が [7]」。"],
    ['isVisible', 'イズビジブル', '表示されているかを返す。', '「v-show の確認は isVisible」。'],
    ['AssertionError', 'アサートエラー', 'expect が成り立たなかったときのエラー。expected と received が出る。', '「AssertionError が出た」。値を見比べる。'],
  ]);

  S('にせものを使う：vi.fn と vi.mock', [
    ['モック', 'モック', '本物の代わりに使う、にせものの部品や関数。', '「API はモックして」。'],
    ['mock', 'モック', 'Vitest で本物をにせものに替えること。vi.mock など。', '「その import は vi.mock で」。'],
    ['vi.fn', 'ブイアイ・エフ', '呼ばれた回数と引数を覚える、にせものの関数。', '「onSelect を vi.fn にする」。'],
    ['spy', 'スパイ', '呼ばれ方を見張るもの。vi.fn や vi.spyOn で作る。', '「呼ばれたかを spy で見る」。'],
    ['mockResolvedValue', 'リゾルブド', 'await すると指定の値が返る、にせもの。', '「mockResolvedValue で一覧を返す」。'],
    ['mockRejectedValue', 'リジェクテッド', 'わざと失敗（エラー）させる、にせもの。', '「失敗時の画面は mockRejectedValue で」。'],
    ['toHaveBeenCalledWith', 'コールドウィズ', 'この引数で呼ばれたかを確かめる。', '「日付つきで呼ばれた？」'],
    ['useFakeTimers', 'フェイクタイマー', '時計をにせものにして、待たずに時間を進める。', '「タイマーは fake で進める」。'],
    ['決定的', 'けっていてき', '何回やっても同じ結果になること。', '「通信を外して決定的にする」。'],
  ]);

  S('テストの骨組み：describe と it', [
    ['describe', 'ディスクライブ', '1 つの部品のテストをまとめる箱。', '「describe の中に it」。'],
    ['it', 'イット', '1 つの確認。「それは〜する」と読む。test でも同じ。', '「it の名前は日本語で」。'],
    ['beforeEach', 'ビフォーイーチ', '各テストの前に毎回やる準備。', '「モックのリセットは beforeEach」。'],
    ['import', 'インポート', '別のファイルから道具を取り込む。', '「vitest から import」。'],
    ['.test.ts', 'テストティーエス', 'テストファイルの名前の形。.spec.ts も同じ。', '「名前に .test. が無いと動かない」。'],
    ['__tests__', 'ダンダーテスツ', 'テストをまとめて置くフォルダの名前。', '「__tests__ に置く方式」。'],
    ['監視モード', 'かんしモード', '保存するたびに、自動でテストを再実行するモード。', '「npx vitest は監視モード」。'],
    ['CI', 'シーアイ', '自動でテストやビルドを回す仕組み。', '「CI では vitest run」。'],
    ['終了コード', 'しゅうりょうコード', 'コマンドの成功・失敗を伝える数字。0 が成功。', '「失敗すると終了コード 1」。'],
  ]);

  S('実践：1本のテストを組み立てる', [
    ['AAA', 'トリプルエー', 'Arrange・Act・Assert の頭文字。テストの 3 段の型。', '「AAA の順で書いて」。'],
    ['Arrange', 'アレンジ', '準備。mount して、確かめたい状態を作る。', '「Arrange は mount と props」。'],
    ['Act', 'アクト', '操作。クリックや入力など、利用者と同じことをする。', '「Act は trigger」。'],
    ['Assert', 'アサート', '確認。expect で結果を確かめる。', '「Assert は 1 つの振る舞い」。'],
    ['passed', 'パスト', 'テストが成功したこと。緑で出る。', '「全部 passed」。'],
    ['failed', 'フェイルド', 'テストが失敗したこと。赤で出る。', '「1 件 failed」。'],
    ['Expected / Received', 'エクスペクテッド', '失敗時に出る「期待した値」と「実際の値」。', '「Expected と Received を見比べる」。'],
    ['リファクタ', 'リファクタ', '動きを変えずに、中身を整理すること。', '「リファクタしてもテストは緑のまま」。'],
  ]);

  if (K.glossAdd) {
    add = add.filter(function (e) { return !(K.glossEntry && K.glossEntry(e.k, 'word')); });
    K.glossAdd(add);
  }
})();
