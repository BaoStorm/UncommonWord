let url = require('url')
let dealFn = require('./dealfn.js')
var iconv = require('iconv-lite')
var https = require('http')
var qs = require('querystring')
var cheerio = require('cheerio')
var superagent = require('superagent')
var pinyin = require('pinyin')
var AipNlpClient = require('baidu-aip-sdk').nlp

var APP_ID = '11530639'
var API_KEY = 'fzR5D1L7UHwC1zad7qUw9aUg'
var SECRET_KEY = 'r9IriCpK69xImXNywoCqfeP9q6mVZfSu'

// 新建一个对象，建议只保存一个对象调用服务接口
var client = new AipNlpClient(APP_ID, API_KEY, SECRET_KEY)

exports.lexer = (req, res) => {
  var text = req.query.text
  // 调用词法分析
  lexer(text)
    .then(data => {
      console.log(data)
      res.send(JSON.stringify(data))
    }).catch(function (err) {
      // 如果发生网络错误
      console.log(err)
    })
}

const lexer = function (text) {
  return new Promise(function (resolve, reject) {
    client.lexer(text).then(function (result) {
      var promises = []
      result.items.forEach(n => {
        promises.push(citiao(n.item))
      })
      Promise.all(promises)
        .then(results => {
          resolve(results)
        })
    }).catch(function (err) {
    // 如果发生网络错误
      console.log(err)
    })
  })
}

const citiao = function (text) {
  return new Promise(function (resolve, reject) {
    // resolve({text: text,
    //   pinyins: pinyin(text, {
    //     heteronym: true, // 启用多音字模式
    //     segment: true // 启用分词，以解决多音字问题。
    //   })})
    superagent
      .get(`http://hanyu.baidu.com/s`)
      .query({wd: text})
      .query({ptype: 'zici'})
      .end(function (err, data) {
        if (err == null) {
          var $ = cheerio.load(data.text)
          var pinyins = []
          if (text.length > 1) {
            var pinyin = $('#pinyin h2 span b').html().replace('[ ', '').replace(' ]', '').replace('[', '').replace(']', '')
            pinyins = pinyin.split(' ')
          } else {
            pinyins.push($('#pinyin span b').html())
          }
          resolve({text: text, pinyins: pinyins})
        }
      })
  })
}
