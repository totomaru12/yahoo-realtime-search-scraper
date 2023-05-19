// 最大キーワード数
const KEYWORD_COUNT_MAX = 5

// 最大直近検索結果記憶数
const LATEST_RECORD_COUNT_MAX = 256

// 本スクリプトを実行する
function appScript() {
  console.log('appScript: start')

  // 指定キーワード分のスクレイプを繰り返す
  for (let i = 2; i < 2 + KEYWORD_COUNT_MAX; i++) {
    scrapeByKeyword(i)
  }
  
  console.log('appScript: end')
}

// 指定行番号の検索ワードをスクレイプする
function scrapeByKeyword(keywordRow) {
  console.log(`scrape start: keywordRow=${keywordRow}`)
  const recordColumn = keywordRow

  console.log('get sheet instance')
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getActiveSheet()

  console.log('get latest search result')
  const latestRecordMap = {}
  for (let i = 2; i < 2 + LATEST_RECORD_COUNT_MAX; i++) {
    const record = sheet.getRange(i, recordColumn).getValue()
    if (!record) {
      break
    }
    latestRecordMap[record] = true
  }

  console.log('start get keyword')
  const keyword = sheet.getRange(keywordRow, '1').getValue()
  console.log('end get keyword')

  console.log('check if keyword defines')
  if (!keyword) {
    console.log(`skip search: keywordRow=${keywordRow}`)
    return
  }

  console.log('start fetch')
  const response = UrlFetchApp.fetch(`https://search.yahoo.co.jp/realtime/search?p=${keyword}`)
  console.log('end fetch')

  console.log('start parse')
  const body = response.getContentText("utf-8")
  const contents = extractContentsByYahooRealtimeSearch(body)
  console.log('end parse')

  console.log('dump new result')
  contents.forEach((v) => {
    if (!latestRecordMap[v]) {
      console.log(`new result: ${v}`)
    }
  })

  console.log('start write result')
  contents.forEach((v, i) => {
    const recordRow = `${2 + i}`
    sheet.getRange(recordRow, recordColumn).setValue(v)
    // console.log(`wrote: [${recordRow}, ${recordColumn}]: ${v}`)
  })
  console.log('end write result')

  console.log(`scrape end: keywordRow=${keywordRow}`)
}

// Yahooリアルタイム検索結果から結果一覧を取得する
function extractContentsByYahooRealtimeSearch (html) {
    const rawContents = extractRawContents(html)
    const contents1 = removeTags(rawContents)
    const contents2 = removeSpaces(contents1)
    const contents3 = removeReturnCode(contents2)
    return contents3
}

// 目的のタグ内のコンテンツを取り出し、コンテンツ文字列の配列を返す
function extractRawContents (html) {
    const result = html.match(/(?<=<p class="Tweet_body__XtDoj">)[\s\S]*?(?=<\/p>)/g)
    if (!result) {
        return []
    }
    return result
}

// コンテンツ内のタグを全て削除する
function removeTags (contents) {
    const result = contents.map(v => {
        return v.replace(/(<([^>]+)>)/gi, '')
    })
    return result
}

// コンテンツ内の空白を全て削除する
function removeSpaces (contents) {
    const result = contents.map(v => {
        return v.replace(/ /gi, '')
    })
    return result
}

// コンテンツ内の改行コードを全て削除する
function removeReturnCode (contents) {
    const result = contents.map(v => {
        return v.replace(/\n/gi, '')
    })
    return result
}
