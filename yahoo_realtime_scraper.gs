// 最大キーワード数
const KEYWORD_COUNT_MAX = 5

// 最大直近検索結果記憶数
const LATEST_RECORD_COUNT_MAX = 256

// 直近検索結果保存行番号
const LATEST_RECORD_START_ROW = 2

// 検索定義開始行番号
const SEARCH_KEYWORD_START_ROW = 2

// 本スクリプトを実行する
function appScript() {
  console.log('appScript: start')

  // 指定キーワード分のスクレイプを繰り返す
  for (let keywordRow = SEARCH_KEYWORD_START_ROW; keywordRow < SEARCH_KEYWORD_START_ROW + KEYWORD_COUNT_MAX; keywordRow++) {
    const thisResults = scrapeByKeyword(keywordRow)
    if (0 < thisResults.length) {
      const newResults = getNewSearchResults(keywordRow, thisResults)
      saveSearchResults (keywordRow, thisResults)
      noticeNewResults (newResults)
    }
  }
  
  console.log('appScript: end')
}

// 新しい検索結果を通知する
function noticeNewResults (newResults) {
  console.log(`noticeNewResults: start`)
  newResults.forEach((v) => {
    // TODO: 通知処理を実装する
    console.log(`notice > ${v}`)
  })
}

// 新しい検索結果一覧を取得する
function getNewSearchResults (keywordRow, thisResults) {
  console.log(`get new search results start: keywordRow=${keywordRow}`)
  const recordColumn = keywordRow

  console.log('get sheet instance')
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getActiveSheet()

  console.log('get latest search result')
  const latestRecordMap = {}
  for (let i = LATEST_RECORD_START_ROW; i < LATEST_RECORD_START_ROW + LATEST_RECORD_COUNT_MAX; i++) {
    const record = sheet.getRange(i, recordColumn).getValue()
    if (!record) {
      break
    }
    latestRecordMap[record] = true
  }

  console.log('get new result')
  const newResults = []
  thisResults.forEach((v) => {
    if (!latestRecordMap[v]) {
      console.log(`new result: ${v}`)
      newResults.push(v)
    }
  })

  console.log(`get new search results end: keywordRow=${keywordRow}`)
  return newResults
}

// 今回の検索結果を保存する
function saveSearchResults (keywordRow, thisResults) {
  console.log(`save search results start: keywordRow=${keywordRow}`)
  const recordColumn = keywordRow

  console.log('get sheet instance')
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getActiveSheet()

  console.log('start write result')
  thisResults.forEach((v, i) => {
    const recordRow = `${LATEST_RECORD_START_ROW + i}`
    sheet.getRange(recordRow, recordColumn).setValue(v)
    // console.log(`wrote: [${recordRow}, ${recordColumn}]: ${v}`)
  })
  console.log('end write result')
  
  console.log(`save search results end: keywordRow=${keywordRow}`)
}

// 指定行番号の検索ワードをスクレイプする
function scrapeByKeyword(keywordRow) {
  console.log(`scrape start: keywordRow=${keywordRow}`)

  console.log('get sheet instance')
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getActiveSheet()

  console.log('start get keyword')
  const keyword = sheet.getRange(keywordRow, '1').getValue()
  console.log('end get keyword')

  console.log('check if keyword defines')
  if (!keyword) {
    console.log(`skip search: keywordRow=${keywordRow}`)
    return []
  }

  console.log('start fetch')
  const response = UrlFetchApp.fetch(`https://search.yahoo.co.jp/realtime/search?p=${keyword}`)
  console.log('end fetch')

  console.log('start parse')
  const body = response.getContentText("utf-8")
  const results = extractContentsByYahooRealtimeSearch(body)
  console.log('end parse')

  console.log(`scrape end: keywordRow=${keywordRow}`)

  return results
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
