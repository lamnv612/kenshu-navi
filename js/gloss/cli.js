/* 用語集（ターミナル / Vim / Git / DevTools / VS Code）。意味 = やさしい言葉、c = 例、r = 現場での使いどころ */
(function () {
  var K = window.KENSHU;
  if (!K || !K.glossAdd) return;
  var L = [];
  var W = function (k, m, c, r) { L.push({ k: k, kind: 'word', m: m, c: c, r: r }); };

  /* ===== ターミナル：場所 ===== */
  W('pwd', '「いま、どのフォルダにいるか」を表示する。', 'pwd\n/Users/kenshu/work', '迷子になったら最初に打つ。ファイルを消す前の場所確認にも使う。');
  W('ls', 'フォルダの中にあるファイルとフォルダを一覧にする。', 'ls docs\nmemo.txt  notes.md', '「ここに何がある？」を確かめる、いちばん使うコマンド。');
  W('ls -l', '種類・サイズ・更新日つきの、詳しい一覧にする。', 'ls -l\n-rw-r--r--  1 kenshu  4.2K  app.log', '設定ファイルがいつ更新されたか、権限（rwx）が合っているかを見る。');
  W('ls -a', '. で始まる「隠しファイル」も出す。', 'ls -a\n.env  .gitignore  src', '.gitignore や .env が置いてあるか確認するとき。');
  W('ls -la', '隠しファイルも含めて、詳しく一覧にする。', 'ls -la', '「あるはずのファイルが見えない」ときの確認に。');
  W('cd', 'フォルダを移動する。移動した先が「いまの場所」になる。', 'cd docs', '作業の最初に、プロジェクトのフォルダへ cd する。');
  W('cd ..', '1つ上のフォルダへ戻る。', 'cd ..', '深く入りすぎたとき、ひとつずつ戻る。');
  W('cd ~', '自分のホームフォルダへ一気に戻る。cd だけでも同じ。', 'cd ~', '迷ったら cd ~ で、いつもの出発点に戻れる。');
  W('cd -', '直前にいたフォルダへ戻る。', 'cd /var/log\ncd -', '2つの場所を行ったり来たりするときに便利。');
  W('mkdir', '新しいフォルダを作る。', 'mkdir work', '案件ごとの作業フォルダを用意する。');
  W('mkdir -p', '途中のフォルダもまとめて作る。すでにあってもエラーにならない。', 'mkdir -p src/components/form', '新しい階層をコマンド1回で用意できる。');
  W('touch', '空のファイルを作る（あれば更新日時だけ更新）。', 'touch .env', '設定ファイルの入れ物を先に用意するとき。');

  /* ===== ターミナル：見る・探す ===== */
  W('cat', 'ファイルの中身を、そのまま表示する。', 'cat package.json', '短い設定ファイルを軽く確認する。長いものは head / tail を使う。');
  W('head -n', 'ファイルの「最初の n 行」だけ表示する。', 'head -n 3 users.csv\nid,name,plan', '巨大な CSV を開かずに、列名だけ確認する。');
  W('tail', 'ファイルの「最後の数行」を表示する（初期値は10行）。', 'tail app.log', 'ログは新しい行ほど下に書かれるので、最新の状況を見るときに使う。');
  W('tail -n', 'ファイルの「最後の n 行」だけ表示する。', 'tail -n 20 app.log', '直前に起きたエラーの前後だけを確認する。');
  W('tail -f', 'ファイルの末尾を「見張り続ける」。新しい行が増えるとすぐ表示される。止めるのは Ctrl+C。', 'tail -f app.log', '画面を操作しながらログを見て、エラーが出た瞬間の行を捕まえる。');
  W('wc -l', 'ファイルの行数を数える。', 'wc -l access.log\n1284 access.log', 'ログの行数でアクセスやエラーの件数の目安をつかむ。');
  W('grep', 'ファイルの中から、指定した文字を含む「行」だけを表示する。', 'grep "ERROR" app.log', '何千行ものログから、エラーコードの行だけを抜き出す。');
  W('grep -i', '大文字と小文字を区別せずに探す。', 'grep -i apple memo.txt', 'Error / error / ERROR の書き方がバラバラなログを、まとめて探す。');
  W('grep -n', '見つかった行の「行番号」も表示する。', 'grep -n TODO app.ts', '見つけた場所をエディタで開き直すとき、行番号がそのまま使える。');
  W('grep -r', 'フォルダの中のファイルを、まとめて探す。', 'grep -r "userId" src', '「この関数、どこで使っている？」を調べる。');
  W('grep -v', '指定した文字を「含まない」行だけを表示する。', 'grep -v "DEBUG" app.log', 'ノイズ（DEBUG ログ）を除いて、本当に見たい行だけ残す。');
  W('grep -c', '一致した行が「何行あるか」だけ数える。', 'grep -c "ERROR" app.log\n12', '「今日のエラーは何件？」を1コマンドで答える。');
  W('| grep', '左のコマンドの結果を、grep に渡して絞り込む（パイプ）。', 'ls -l | grep ".log"', '出力が多いコマンドの結果から、必要な行だけ取り出す。');
  W('| wc -l', '左の結果を、行数として数える（パイプ）。', 'grep "ERROR" app.log | wc -l', '「エラーの行は何本？」と、探して数えるを1行で。');
  W('| sort', '左の結果を、並べ替える（パイプ）。', 'cat names.txt | sort', '一覧を並べ替えてから、重複を見つける準備に。');
  W('| uniq', '左の結果から、連続する重複を1つにまとめる（パイプ）。sort のあとに使う。', 'cat ips.txt | sort | uniq', 'ログにあるアクセス元 IP の重複を除いて、種類を数える。');
  W('| head', '左の結果の、最初の数行だけ見る（パイプ）。', 'ls -l | head', '長い一覧の「先頭だけ」で十分なとき。');
  W('| less', '左の結果を、ページ送りで読む（パイプ）。q で終了。', 'cat app.log | less', '長い出力を、上下にスクロールしながら読む。');

  /* ===== ターミナル：コピー・移動・消す・書く ===== */
  W('cp', 'ファイルをコピーする。元のファイルは残る。', 'cp config.json config.bak.json', '設定を書き換える前に、バックアップを取っておく。');
  W('cp -r', 'フォルダを、中身ごとコピーする。', 'cp -r src src-backup', '大きな変更の前に、フォルダごと退避する。');
  W('mv', 'ファイルを移動する。同じフォルダの中なら「名前の変更」になる。', 'mv draft.txt final.txt', 'ファイル名の付け間違いを直す。フォルダの整理にも。');
  W('rm', 'ファイルを削除する。ゴミ箱はなく、元に戻せない。', 'rm tmp.txt', '打つ前に、もう一度ファイル名を目で確認する習慣をつける。');
  W('rm -r', 'フォルダを、中身ごと削除する。', 'rm -r work', '不要になった作業フォルダを片付ける。対象を間違えると全部消える。');
  W('rm -rf', '確認なしで、フォルダを中身ごと強制削除する。いちばん危険なコマンドのひとつ。', 'rm -rf node_modules', 'node_modules の作り直しなど、消えてよいものに限って使う。パスの打ち間違いに注意。');
  W('echo', '文字をそのまま表示する。> を付けるとファイルに書き込める。', 'echo "hello"', '設定値の確認や、簡単なメモ書きファイルの作成に。');
  W('>>', 'ファイルの「末尾に追記」する。今ある中身は消えない（> は上書き）。', 'echo "2行目" >> log.txt', 'ログやメモを、前の内容を残したまま足していく。');

  /* ===== ターミナル：便利 ===== */
  W('clear', '画面の文字を消して、すっきりさせる。ファイルや履歴は消えない。', 'clear', 'コマンドの結果が溜まって見づらいときに。Ctrl+L でも同じ。');
  W('Tab', '名前の続きを、自動で補完する。', 'cd Doc[Tab] → cd Documents/', 'タイプ量とタイプミスが減る。ファイル名は全部打たず、Tab を使う。');
  W('Ctrl+C', '実行中のコマンドを、途中で止める。', 'tail -f app.log\n(Ctrl+C で止める)', '終わらないコマンドや、間違えて始めた処理を止める非常ボタン。');
  W('Ctrl+R', '過去に打ったコマンドを、文字で検索して呼び出す。', 'Ctrl+R → "ssh" と打つ', '長い ssh コマンドを、先頭を思い出せなくても呼び戻せる。');
  W('Ctrl+L', '画面をきれいにする（clear と同じ）。', 'Ctrl+L', '手が止まらない人のための、キーボードだけの clear。');
  W('Ctrl+A', 'コマンド入力中に、行の先頭へカーソルを動かす。', 'Ctrl+A', '長いコマンドの先頭だけを直したいとき。');
  W('Ctrl+E', 'コマンド入力中に、行の末尾へカーソルを動かす。', 'Ctrl+E', '先頭に飛んだあと、末尾へ戻るとき。');
  W('Ctrl+D', 'ターミナルを終了する（入力の終わりを伝える）。', 'Ctrl+D', 'ssh 接続を終えて、手元の PC に戻るときに。VS Code の Cmd+D とは別物。');
  W('man', 'コマンドの説明書（マニュアル）を開く。q で閉じる。', 'man grep', '使い方を忘れたとき、ネットを検索する前にまず見る。');
  W('sudo', '管理者の権限で、コマンドを実行する。', 'sudo nginx -s reload', '影響が大きい操作に必要。よく分からないまま付けない。');
  W('chmod +x', 'ファイルに「実行してよい」という許可を付ける。', 'chmod +x deploy.sh', '手元のシェルスクリプトを、./deploy.sh で動かせるようにする。');
  W('curl', 'ターミナルから、URL にアクセスして結果を表示する。', 'curl https://example.com/api/health', 'API が動いているかを、ブラウザなしで確かめる。');
  W('ssh', '別のコンピューター（サーバー）に、安全につなぐ。', 'ssh user@server', 'サーバーのログを見たり、設定ファイルを直したりする入口。');
  W('ssh-keygen', 'つなぐための「鍵のペア（秘密鍵と公開鍵）」を作る。', 'ssh-keygen -t ed25519', 'パスワードの代わりに、鍵で GitHub やサーバーにログインする準備。');
  W('ssh-add', '秘密鍵を ssh-agent に預ける。以降はパスフレーズを毎回打たなくてよい。', 'ssh-add ~/.ssh/id_ed25519', '何度も git push する人の手間を減らす。');
  W('ssh-agent', '秘密鍵を一時的に預かってくれる、見張り番のプログラム。', 'eval "$(ssh-agent -s)"', 'ssh-add とセットで使う。');
  W('ssh -T', '接続のテストだけして、すぐ終わる。', 'ssh -T git@github.com', 'GitHub に鍵が登録できたかを確認する。');
  W('npm install', '必要なパッケージ（部品）をまとめてダウンロードする。', 'npm install', 'プロジェクトを clone した直後に、まず1回やる。');
  W('npm run dev', '開発用サーバーを起動する。ファイルを保存すると、画面が自動で更新される。', 'npm run dev\nLocal: http://localhost:5173/', '画面を見ながら作る毎日の作業の起点。');
  W('npm run build', '本番に出すための、最適化したファイルを作る。', 'npm run build', 'リリース前に、ビルドでエラーが出ないか確認する。');
  W('npm run test', 'テストをまとめて実行する。', 'npm run test', 'push する前に流して、壊していないことを確認する。');
  W('npm run lint', 'コードの書き方のルール違反（ESLint）を調べる。', 'npm run lint', 'PR を出す前に実行して、レビューでの指摘を減らす。');
  W('npm create vue@latest', 'Vue の新しいプロジェクトを、対話形式で作る。', 'npm create vue@latest', '新規開発の最初の1コマンド。');
  W('npx', 'パッケージをインストールせずに、その場で実行する。', 'npx prettier --write .', '一度だけ使いたいツールを、手軽に試す。');
  W('npm', 'JavaScript のパッケージ（部品）を管理するツール。', 'npm install vue', '部品の追加・更新・実行コマンドの入り口。');

  /* ===== Vim ===== */
  W('Esc', 'ノーマルモードに戻る。迷ったら、とにかく Esc。', 'iで入力 → Esc で戻る', 'サーバーで設定ファイルを直す前後に、何度も押すことになる。');
  W(':wq', '保存して（write）終了する（quit）。いちばんよく使う。', ':wq', 'サーバー上の設定を直して、保存して抜ける。');
  W(':q!', '保存せずに、強制的に終了する。', ':q!', '間違えて書き換えてしまったとき、変更を捨てて逃げる出口。');
  W(':w', '保存する（終了はしない）。', ':w', '作業の途中で、こまめに保存する。');
  W(':q', 'Vim を終了する。変更が残っていると終了できない。', ':q', '変更していなければ、これだけで抜けられる。');
  W('dd', '今いる行を、まるごと削除（カット）する。p で貼り付けられる。', 'dd', '設定ファイルの不要な1行を、サッと消す。');
  W('yy', '今いる行を、コピーする。p で貼り付けられる。', 'yy → p', '似た設定行を複製して、値だけ書き換える。');
  W('gg', 'ファイルの先頭へ移動する。', 'gg', '長い設定ファイルを、頭から読み直すとき。');

  /* ===== Git：基本 ===== */
  W('git init', 'いまのフォルダを、Git で管理し始める。', 'git init', '新しいプロジェクトを、履歴つきで作り始める。');
  W('git clone', 'GitHub にあるリポジトリを、自分の PC にコピーする。', 'git clone git@github.com:team/app.git', '新しい案件に入った初日に、最初にやること。');
  W('git status', '変更されたファイルと、いまの状況を確認する。', 'git status\nmodified: index.html', 'コマンドの前後に何度でも打つ。「いま何が起きている？」の確認。');
  W('git add', '次のコミットに入れるファイルを選ぶ（ステージに載せる）。', 'git add index.html', '関係ない変更を混ぜずに、コミットを1つの目的にまとめる。');
  W('git add -A', '削除も含めて、すべての変更をステージに載せる。', 'git add -A', '変更が多いときにまとめて載せる。ただし関係ない変更も入るので git status で確認。');
  W('git commit', 'ステージした変更を、履歴として記録する。', 'git commit', '作業の区切りごとに記録して、あとから戻れるようにする。');
  W('git commit -m', 'メッセージをその場で付けて、コミットする。', 'git commit -m "feat: 予約フォームを追加"', '「何を・なぜ」が分かる短いメッセージを付ける。feat: / fix: が定番。');
  W('git commit --amend', '直前のコミットを、やり直して上書きする。', 'git commit --amend -m "fix: 誤字を修正"', 'メッセージの誤字や、入れ忘れたファイルを直す。push 済みには使わない。');
  W('git commit -a', '変更済みのファイルを add せずに、まとめてコミットする。', 'git commit -a -m "fix: 文言修正"', '新しいファイルは含まれない。慣れるまでは add を使うほうが安全。');
  W('git log', 'コミットの履歴を、新しい順に表示する。', 'git log', '「誰が・いつ・何を変えた？」を調べる。');
  W('git log --oneline', '履歴を、1コミット1行で短く表示する。', 'git log --oneline\na1b2c3 feat: 予約フォーム', '全体の流れをざっと見たいとき。戻したいコミットを探すときにも。');
  W('git diff', '変更の中身（どこをどう変えたか）を表示する。', 'git diff', 'コミットの前に、意図しない変更が混ざっていないか確認する。');
  W('git show', '1つのコミットの内容を表示する。', 'git show a1b2c3', '「このコミット、何を変えたんだっけ？」を確かめる。');
  W('git blame', '各行を「最後に変えた人とコミット」つきで表示する。', 'git blame src/price.ts', '「この行、なぜこうなってる？」を、書いた人とコミットから調べる。人を責めるためではなく、経緯を知るため。');
  W('git tag', 'コミットに、バージョン名などの目印を付ける。', 'git tag v1.2.0', 'リリースした時点を印にして、戻りたいときにすぐ指せるようにする。');
  W('git rm --cached', 'ファイルをファイル自体は残したまま、Git の管理から外す。', 'git rm --cached .env', '誤って commit した .env を、手元に残して管理だけ外す（鍵の再発行が先）。');

  /* ===== Git：ブランチ・共有 ===== */
  W('git branch', 'ブランチの一覧を見る。名前を付けると作れる。', 'git branch', 'いまどのブランチにいるかを確認する。');
  W('git branch -d', 'マージ済みのブランチを削除する。', 'git branch -d feature/login', 'PR が merge されたあと、作業ブランチを片付ける。');
  W('git branch -D', 'マージされていなくても、ブランチを強制的に削除する。', 'git branch -D feature/old', '捨てると決めた試作ブランチを消す。中の変更は失われる。');
  W('git checkout', 'ブランチを切り替える。（新しい書き方は git switch だが、どちらも同じ意味）', 'git checkout main', 'main に戻って、最新を pull するときに使う。');
  W('git checkout -b', 'ブランチを作って、そのまま移動する。', 'git checkout -b feature/login', '作業の最初に、main から作業用ブランチを切る。main に直接書かない。');
  W('git checkout --', '変更を捨てて、ファイルを最後のコミットの状態に戻す。', 'git checkout -- index.html', '試しに書き換えたファイルを、元に戻す（新しい書き方は git restore）。');
  W('git merge', '別のブランチの変更を、いまのブランチに取り込む。', 'git checkout feature/login\ngit merge main', '作業中のブランチに、main の最新を取り込んで衝突を予防する。ふだん main への取り込みは PR で行う。');
  W('git pull', 'GitHub の最新を取ってきて、いまのブランチに取り込む。', 'git checkout main\ngit pull', '作業を始める前と、PR が merge されたあとに、必ず main を最新にする。');
  W('git fetch', 'GitHub の最新情報を取ってくるだけ。自分のブランチはまだ変わらない。', 'git fetch', '取り込む前に、何が変わったかだけ確かめたいとき。');
  W('git push', '自分のコミットを GitHub に送る。', 'git push', 'チームに共有する、PR を出すための最初の一歩。');
  W('git push -u', '送るのと同時に、「このブランチの送り先」を覚えさせる。2回目以降は git push だけでよい。', 'git push -u origin feature/login', '新しいブランチを初めて送るときに、1回だけ付ける。');
  W('git push --set-upstream', 'git push -u と同じ。送り先を覚えさせる。', 'git push --set-upstream origin feature/login', 'エラーメッセージに出てきたら、これを実行すればよい。');
  W('git push --force', '履歴を無理やり上書きして送る。他の人の変更を消す危険がある。', 'git push --force', '共有ブランチ（main / develop）には絶対に使わない。使うなら自分だけのブランチで。');
  W('git push -f', 'git push --force の短い書き方。履歴を上書きするので危険。', 'git push -f', '迷ったら使わない。先輩に相談する。');
  W('git remote -v', '送り先（リモート）の名前と URL を表示する。', 'git remote -v\norigin  git@github.com:team/app.git', 'push 先を間違えていないか確認する。');
  W('git stash', '作業中の変更を、いったん「脇に退避」して、きれいな状態に戻す。', 'git stash', '作業の途中で急ぎの依頼が来たとき、別ブランチで対応するために。');
  W('git stash pop', '退避した変更を、元に戻す。', 'git stash pop', '急ぎの対応が終わったら、止めていた作業を再開する。');
  W('git restore', '変更を捨てて、ファイルを最後のコミットの状態に戻す。', 'git restore index.html', '試しに書き換えたファイルを、元に戻す。捨てた変更は戻せない。');
  W('git restore --staged', 'ステージ（add）を取り消す。ファイルの中身はそのまま。', 'git restore --staged index.html', '関係ないファイルまで add してしまったとき。');
  W('git reset --soft', '直前のコミットだけ取り消す。変更はステージに残る。', 'git reset --soft HEAD~1', 'push 前に、コミットのまとめ方をやり直す。');
  W('git reset --hard', 'コミットも変更もすべて、指定した時点まで巻き戻す。変更が消える。', 'git reset --hard HEAD~1', 'ローカルの失敗作を、完全に捨てたいときだけ。');
  W('git revert', '「取り消す内容の新しいコミット」を作って、履歴を残したまま打ち消す。', 'git revert a1b2c3', 'push 済みのコミットを取り消すときの、安全なやり方（reset は使わない）。');
  W('git cherry-pick', '別のブランチの、特定のコミットだけを持ってくる。', 'git cherry-pick a1b2c3', '本番の修正（hotfix）を、develop にも同じように反映する。');
  W('git rebase', 'ブランチの土台を付け替えて、履歴を一直線にする。（この研修では merge を使う）', 'git rebase main', 'チームのルールによって使う。共有済みのブランチには使わない。');

  /* ===== Git：言葉 ===== */
  W('.gitignore', 'Git の管理に入れないファイルを書いておく設定ファイル。', 'node_modules/\n.env', '鍵やパスワードが入った .env を、間違って commit しないための守り。');
  W('HEAD', '「いま自分がいる場所（ブランチの先頭）」を指す印。', 'HEAD → feature/login', '図で HEAD がどこを指すかを見ると、いまのブランチが分かる。');
  W('origin', 'GitHub 上のリポジトリの、標準の呼び名。', 'git push origin feature/login', 'push / pull の送り先・取得元を表す。');
  W('origin/main', 'GitHub 上の main ブランチ（のコピー）。', 'origin/main', '自分の main が、GitHub より遅れていないかを比べる目安。');
  W('develop', '開発環境（dev）に対応するブランチ。確認用に、先にここへ取り込む。', 'feature → develop → main', '本番（main）に出す前に、develop で動作確認する運用で使う。');
  W('hotfix', '本番の不具合を、急いで直すためのブランチ。', 'git checkout -b hotfix/price-bug', '本番でトラブルが起きたときに、main から切って最短で直す。');
  W('feature branch', '1つの機能のために作る、作業用のブランチ。', 'feature/login', 'main を汚さず、機能ごとに安全に作業するための基本の形。');
  W('Pull Request', '「この変更を取り込んでください」と、チームにお願いする仕組み（PR）。レビューの場になる。', 'feature/login → main', 'いきなり main に入れず、人の目と自動テストを通してから取り込む。');
  W('PR', 'Pull Request の略。変更を取り込んでもらうためのお願い。', 'feat: ログイン画面を追加', 'タイトルと説明に、何を・なぜ・確認方法を書く。');
  W('fast-forward', '分岐していないとき、ブランチの印を前に進めるだけで取り込むこと。', 'Fast-forward', 'main に誰も新しい変更を入れていなければ、これで済む。');
  W('Fast-forward', '分岐していないとき、ブランチの印を前に進めるだけで取り込むこと。', 'Fast-forward', '誰も main に変更を入れていないときに出る。');
  W('CONFLICT', '同じ場所を別々に変えたため、Git が自動で決められない状態。人が選ぶ。', 'CONFLICT (content): Merge conflict in index.html', '慌てずに、ファイルを開いて印を探し、どちらを残すか決める。');
  W('<<<<<<<', 'コンフリクトの印の開始。ここから下が「自分の変更」。', '<<<<<<< HEAD\n自分の行\n=======\n相手の行\n>>>>>>> main', '印の3種類（<<<<<<< ======= >>>>>>>）は、直したら必ずすべて消す。');
  W('=======', 'コンフリクトの印の区切り。上が「自分」、下が「相手」。', '<<<<<<< HEAD\n自分の行\n=======\n相手の行\n>>>>>>> main', '印を残したまま commit しない。');
  W('>>>>>>>', 'コンフリクトの印の終わり。ここまでが「相手の変更」。', '<<<<<<< HEAD\n自分の行\n=======\n相手の行\n>>>>>>> main', '印がファイルに残っていないか、add の前に検索で確認する。');
  W('.env', 'パスワードや API キーなど、外に出してはいけない設定を書くファイル。', 'API_KEY=xxxxx', '.gitignore に入れて、GitHub に絶対に上げない。上げたらキーを再発行する。');

  /* ===== DevTools ===== */
  W('Elements', 'いま表示しているページの HTML と CSS を見て、その場で書き換えられるタブ。', '要素を選択 → Styles で色を変える', '「どの CSS が効いているか」「なぜ崩れるか」を調べる。');
  W('Console', 'エラーや console.log の出力を見る、JavaScript を試せるタブ。', 'console.log(user)', '画面が動かないとき、まず赤いエラーが出ていないか見る。');
  W('Network', 'ページが行った通信（API・画像など）の一覧と、その結果を見るタブ。', 'api/users → 404', 'API が 404 か 500 か、返ってきた中身は何かを確かめる。');
  W('Sources', 'JavaScript のコードを見て、止めながら動きを追えるタブ。', 'ブレークポイントを置く', '「この変数、ここでは何が入っている？」を確かめる。');
  W('Device Toolbar', 'スマホやタブレットの画面サイズで、ページを確認する機能。', 'Cmd+Shift+M', 'スマホで崩れていないかを、実機がなくても確認する。');

  /* ===== VS Code ===== */
  W('Prettier', 'コードの見た目（インデント・引用符など）を、自動でそろえる整形ツール。', 'npx prettier --write .', 'チーム全員の書き方がそろい、PR の差分に「書式だけの変更」が出なくなる。');
  W('ESLint', 'コードの書き方のルール違反や、バグになりやすい書き方を教えてくれるツール。', 'npm run lint', '使っていない変数や、書き忘れを、レビュー前に見つける。');
  W('Format on Save', '保存したときに、自動で整形する VS Code の設定。', '保存 → Prettier が走る', '整形を意識しなくてよくなる。');
  W('Cmd+D', '選んでいる文字と同じものを、次々に選択する（マルチカーソル）。', 'Cmd+D を3回', '同じ変数名を30か所いっぺんに書き換える。');
  W('Cmd+P', 'ファイル名を打って、すぐ開く。', 'Cmd+P → "price"', 'フォルダをたどらず、目的のファイルへ一瞬で行ける。');
  W('Cmd+B', 'サイドバーを開閉する。', 'Cmd+B', '画面を広く使いたいとき。');
  W('マルチカーソル', 'カーソルを複数置いて、同時に入力する機能。', 'Cmd+D / Option+クリック', '同じ修正を、何か所もまとめて行う。');

  /* ===== VS Code：拡張機能 ===== */
  W('--install-extension', 'VS Code の拡張機能を、ターミナルから入れるときのオプション。', 'code --install-extension esbenp.prettier-vscode', 'セットアップ手順をコマンドで書いておけば、新しい PC でもコピペで同じ環境が作れる。');
  W('extensions.json', '「このプロジェクトでは、この拡張機能がおすすめ」を書くファイル（.vscode フォルダに置く）。', '{ "recommendations": ["esbenp.prettier-vscode"] }', 'Git に入れておくと、開いた人に「おすすめをインストールしますか？」と通知が出る。');
  W('recommendations', 'extensions.json の中で、おすすめの拡張機能の ID を並べる配列。', '"recommendations": ["Vue.volar"]', 'チーム全員が同じ道具で始められる。最後の項目のあとには , を付けない。');
  W('editor.formatOnSave', '保存したときに、自動で整形する VS Code の設定。', '"editor.formatOnSave": true', 'Prettier と一緒に使うと、書式の違いが PR に出なくなる。');
  W('editor.defaultFormatter', '保存や整形のときに使う、既定の整形ツールを決める設定。', '"editor.defaultFormatter": "esbenp.prettier-vscode"', 'これを書かないと、整形ツールを選ぶ画面が出たり、別のツールで整形されたりする。');
  W('editor.bracketPairColorization.enabled', '対になる括弧を、同じ色で塗り分ける設定（標準で ON）。', '"editor.bracketPairColorization.enabled": true', '括弧の閉じ忘れが、赤い括弧としてすぐ見つかる。');
  W('editor.guides.bracketPairs', '対になる括弧を、縦の線でつなぐ設定。', '"editor.guides.bracketPairs": true', '入れ子の深いコードで、どこからどこまでかが線で見える。');
  W('editor.codeActionsOnSave', '保存したときに、自動で実行する修正（コードアクション）を決める設定。', '"editor.codeActionsOnSave": { "source.fixAll.eslint": "explicit" }', 'ESLint が直せる指摘を、保存するだけで直してくれる。');
  W('source.fixAll.eslint', '「ESLint で直せるものを全部直す」というコードアクションの名前。', '"source.fixAll.eslint": "explicit"', 'codeActionsOnSave に書くと、保存のたびに var → const のような修正が自動で入る。');
  W('GitLens', '行の横に「誰が・いつ・なぜ変えたか」を出す拡張機能。', 'eamodio.gitlens', '壊れた行の持ち主と理由が、git blame を打たなくても分かる。');
  W('Error Lens', 'エラーの文章を、その行の横に直接出す拡張機能。', 'usernamehw.errorlens', 'マウスを乗せたり、問題パネルを開いたりせずに、エラーの理由が読める。');
  W('Live Server', '保存するたびに、ブラウザを自動で再読み込みする拡張機能。', 'ritwickdey.LiveServer', 'HTML / CSS を作るときの、F5 を押す手間がなくなる。');
  W('Auto Rename Tag', '開始タグを書き換えると、終了タグも一緒に直る拡張機能。', 'formulahendry.auto-rename-tag', 'div を section に変えたとき、閉じタグの直し忘れで画面が崩れるのを防ぐ。');
  W('Path Intellisense', 'ファイルのパスを、候補から選んで入力できる拡張機能。', 'christian-kohler.path-intellisense', 'import や src のパスの打ち間違いが、実行前になくなる。');
  W('Code Spell Checker', '英単語のスペルミスに、波線を出す拡張機能。', 'streetsidesoftware.code-spell-checker', 'recieve のような変数名のミスを、書いた瞬間に直せる。');
  W('Markdown All in One', 'Markdown の目次づくりや、書式のショートカットを足す拡張機能。', 'yzhang.markdown-all-in-one', 'README や PR の説明を書くとき、目次が自動で作れる。');
  W('Material Icon Theme', 'ファイルの種類ごとにアイコンを変える拡張機能。', 'PKief.material-icon-theme', 'ファイルが多いプロジェクトで、絵で目的のファイルを探せる。');
  W('indent-rainbow', 'インデントの深さを色で見せる拡張機能。', 'oderwat.indent-rainbow', '入れ子が深いコードや YAML で、どの階層かが分かる。');
  W('Japanese Language Pack', 'VS Code のメニューを日本語にする拡張機能。', 'MS-CEINTL.vscode-language-pack-ja', '入れたあと、Cmd+Shift+P の「Configure Display Language」で ja を選ぶ。');
  W('Vue - Official', 'Vue の .vue ファイルの色分けと、テンプレートの型チェックをする拡張機能（旧 Volar）。', 'Vue.volar', 'テンプレートの item.prise のような打ち間違いを、書いた瞬間に教えてくれる。');
  W('GitHub Copilot', 'AI がコードの続きを提案してくれる拡張機能。', 'GitHub.copilot', '下書きは速くなる。ただし提案は必ず読み、秘密情報は入力しない。会社のルールを先に確認する。');
  W('Rainbow Brackets', '括弧を色分けする、以前よく使われた拡張機能。', 'bracketPairColorization（標準機能）', 'いまの VS Code は標準機能で色分けできるので、通常は入れなくてよい。');
  W('esbenp.prettier-vscode', 'Prettier（コードの整形ツール）の拡張機能の ID。', 'code --install-extension esbenp.prettier-vscode', 'ID は「発行元.名前」。画面で探すより、ID で入れるほうが確実。');
  W('dbaeumer.vscode-eslint', 'ESLint の拡張機能の ID。', 'code --install-extension dbaeumer.vscode-eslint', '書き間違いやバグになりやすい書き方を、エディタの中で指摘する。');

  K.glossAdd(L);

  /* 既に data-tip のツールチップがある場所（カード・チップ）では、用語集を重ねて出さない */
  var orig = K.glossify;
  K.glossify = function (root) {
    orig(root);
    if (!root || !root.querySelectorAll) return;
    root.querySelectorAll('[data-gk]').forEach(function (el) {
      if (!el.closest('[data-tip]')) return;
      var bare = el.tagName === 'SPAN' && el.className === 'gl' && !el.getAttribute('style') && !el.id && !el.children.length;
      if (bare) { el.replaceWith(document.createTextNode(el.textContent)); return; }   /* 自動で作った包み span は外す（入れ子を防ぐ） */
      el.removeAttribute('data-gk'); el.removeAttribute('data-gt'); el.classList.remove('gl');
    });
  };
})();
