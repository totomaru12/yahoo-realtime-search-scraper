# yahoo-realtime-search-scraper

## コード概要

- YAHOOリアルタイム検索の取得結果のコンテンツ一覧を抽出するコード

## ファイル構成

### extract_contents.js

- 上記の抽出処理コード

### yahoo_realtime_scraper.gs

- 検索結果の差分を抽出するGASコード
- GASで定期実行設定をしておけば、通知ツールとして使える
- A2-A6に検索キーワードを設定しておく
- B列-F列はそれに対応する結果が記録される

### sample.html

- 以下の取得結果を格納したサンプルHTMLファイル
  - `https://search.yahoo.co.jp/realtime/search?p=テストテスト`

## スクレイプコード処理の概要

- 以下のタグに囲まれた文字列の一覧を抽出している

```html
// ツイート内容
<p class="Tweet_body__XtDoj"></p>

// アカウント名
<span class="Tweet_authorName__V3waK"></span>

// アカウントURL
<a class="Tweet_authorID__B1U8c">
```
