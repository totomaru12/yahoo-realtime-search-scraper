// Yahooリアルタイム検索結果から結果一覧を取得する
function extractContentsByYahooRealtimeSearch (html) {
    const tweetList = extractTweets(html)
    const accountNameList = extractTweetAccountNameList(html)
    const accountUrlList = extractTweetAccountUrlList(html)
    const results = []
    for (let i = 0; i < tweetList.length; i++) {
        results.push({
            tweet: tweetList[i],
            accountName: getValueSafely(accountNameList, i, 'accountNameList'),
            accountUrl: getValueSafely(accountUrlList, i, 'accountUrlList'),
        })
    }
    return results
}

// 配列データを安全に取得する
function getValueSafely (list, index, label) {
    if (index < 0 || list.length <= index) {
        console.error(`Tried access out of ${label}`)
        return ''
    }
    return list[index]
}

// ツイートアカウントURL一覧を取得
function extractTweetAccountUrlList (html) {
    const result = html.match(/(?<=class="Tweet_authorID__B1U8c"[\s\S]{0,128}href=").+?(?=")/g)
    if (!result) {
        return []
    }
    return result
}

// ツイートアカウント名一覧を取得
function extractTweetAccountNameList (html) {
    const result = html.match(/(?<=class="Tweet_authorName__V3waK">)[\s\S]*?(?=<\/span>)/g)
    if (!result) {
        return []
    }
    return result
}

// ツイートメッセージ一覧を取得
function extractTweets (html) {
    const rawContents = extractRawTweets(html)
    const contents1 = removeTags(rawContents)
    const contents2 = convertSpacesToOne(contents1)
    const contents3 = removeReturnCode(contents2)
    return contents3
}

// 目的のタグ内のコンテンツを取り出し、コンテンツ文字列の配列を返す
function extractRawTweets (html) {
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

// コンテンツ内の連続するスペースを１つにする
function convertSpacesToOne (contents) {
    const result = contents.map(v => {
        return v.replace(/ +/gi, ' ')
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

// テスト用コンテンツ文字列を返す (コード定義版)
function testStringFromCode () {
    let src = '<p class="Tweet_body__XtDoj"><em>テスト</em>、<em>テスト</em></p>'
    src += '<p class="Tweet_body__XtDoj">来月も<em>テストテストテストテスト</em></p>'
    src += '<p class="Tweet_body__XtDoj"><span class="Tweet__reply">返信先:<a href="https://twitter.com/sOcha_yu_" target="_blank" data-cl-params="_cl_link:twlat;_cl_position:9;twid:1659471045227868160;twuid:1476769555783745537">@<!-- -->sOcha_yu_</a></span>そうだ！いつ行く👣？ ｱｰｱｰｯｼｬｺﾗｱｰｱｰｱｰﾃﾒｪｸｿｺﾗｱｰｱｰ<em>ﾃｽﾄﾃｽﾄ</em></p>'
    return src    
}

// テスト用コンテンツ文字列を返す (ファイル定義版)
function testStringFromFile () {
    return require('fs').readFileSync('./sample.html', 'utf8')
}

// テスト実行: 埋め込み文字列ベース
function testByCode() {
    const html = testStringFromCode()
    const contents = extractContentsByYahooRealtimeSearch(html)
    console.log(contents)
}

// テスト実行: サンプルファイルベース
function testByFile() {
    const html = testStringFromFile()
    const contents = extractContentsByYahooRealtimeSearch(html)
    console.log(contents)
}

// テスト実行
testByCode()
testByFile()
