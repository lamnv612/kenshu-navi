// 研修ナビ 進捗の受け取り用 Google Apps Script
// 1) スプレッドシートを新規作成 → 拡張機能 → Apps Script に貼り付け
// 2) 下の KEY を、管理画面に入るときのパスワードと同じ文字列に書き換える（この公開ファイルには書かない）
// 3) デプロイ → 新しいデプロイ → ウェブアプリ（実行: 自分 / アクセス: 全員）→ URL を js/config.js の syncUrl に貼る
const KEY = 'ここを管理者パスワードに書き換える';

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName('progress');
  if (!sh) { sh = ss.insertSheet('progress'); sh.appendRow(['ニックネーム', '更新', '完了シーン数', 'データ']); }
  return sh;
}
function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

function doPost(e) {
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const b = JSON.parse(e.postData.contents);
    const n = String(b.n || '').slice(0, 40);
    if (!n || n.charAt(0) === '@') return out_({ error: 'name' });
    const s = (b.s && typeof b.s === 'object') ? b.s : {};
    const done = Object.keys(s).reduce((a, k) => a + (Array.isArray(s[k]) ? new Set(s[k]).size : 0), 0);
    const row = [n, new Date(b.t || Date.now()), done, JSON.stringify(s)];
    const sh = sheet_(), vals = sh.getDataRange().getValues();
    for (let i = 1; i < vals.length; i++) if (vals[i][0] === n) { sh.getRange(i + 1, 1, 1, 4).setValues([row]); return out_({ ok: 1 }); }
    sh.appendRow(row);
    return out_({ ok: 1 });
  } finally { lock.releaseLock(); }
}

function doGet(e) {
  if ((e.parameter.key || '') !== KEY) return out_({ error: 'key' });
  const vals = sheet_().getDataRange().getValues();
  const users = [];
  for (let i = 1; i < vals.length; i++) { let s = {}; try { s = JSON.parse(vals[i][3]); } catch (x) {} users.push({ n: vals[i][0], t: new Date(vals[i][1]).getTime(), s: s }); }
  return out_({ users: users });
}
