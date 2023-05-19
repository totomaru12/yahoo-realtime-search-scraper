// テスト実行
const contents = extractRawContents(testSourceString())
console.log(contents)

// Yahooリアルタイム検索結果から結果一覧を取得する
function extractRawContents (html) {
    const rawContents = extractRawContents(html)
    const contents = removeTags(rawContents)
    return contents
}

// 目的のタグ内のコンテンツを取り出し、コンテンツ文字列の配列を返す
function extractRawContents (html) {
    const result = html.match(/(?<=<p class="Tweet_body__XtDoj">).*?(?=<\/p>)/g)
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

// テスト用コンテンツ文字列を返す
function testSourceString () {
    let src = '<p class="Tweet_body__XtDoj"><em>テスト</em>、<em>テスト</em></p>'
    src += '<p class="Tweet_body__XtDoj">来月も<em>テストテストテストテスト</em></p>'
    src += '<p class="Tweet_body__XtDoj"><span class="Tweet__reply">返信先:<a href="https://twitter.com/sOcha_yu_" target="_blank" data-cl-params="_cl_link:twlat;_cl_position:9;twid:1659471045227868160;twuid:1476769555783745537">@<!-- -->sOcha_yu_</a></span>そうだ！いつ行く👣？ ｱｰｱｰｯｼｬｺﾗｱｰｱｰｱｰﾃﾒｪｸｿｺﾗｱｰｱｰ<em>ﾃｽﾄﾃｽﾄ</em></p>'
    return src    
}