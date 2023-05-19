# yahoo-realtime-search-scraper

## コード概要

- YAHOOリアルタイム検索の取得結果のコンテンツ一覧を抽出するコード

## ファイル構成

### extract_contents.js

- 上記の抽出処理コード

### sample.html

- 以下の取得結果を格納したサンプルHTMLファイル
  - `https://search.yahoo.co.jp/realtime/search?p=テストテスト`

## コード処理概要

- 以下のタグに囲まれた文字列の一覧を抽出している

```html
<p class="Tweet_body__XtDoj"></p>
```
