let url = require('url')
var fs = require('fs')
let dealFn = require('./dealfn.js')
var iconv = require('iconv-lite')
var https = require('http')
var qs = require('querystring')
var path = require('path')
var formidable = require('formidable')
var cheerio = require('cheerio')
var request = require('superagent')
var superagent = require('superagent-charset')(request)
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
      let lexer = []
      data.forEach(n => {
        for (var i = 0; i < n.text.length; i++) {
          lexer.push({text: n.text[i], pinyin: n.pinyins[i]})
        }
      })
      res.send(JSON.stringify(lexer))
    }).catch(function (err) {
      // 如果发生网络错误
      console.log(err)
    })
}

exports.lexerStr = (req, res) => {
  var text = req.query.text

  // 调用词法分析
  lexer(text)
    .then(data => {
      console.log(data)
      var text = ''
      var pinyin = ''
      data.forEach(n => {
        text = text + n.text
        pinyin = pinyin + ' ' + n.pinyins.join(',')
      })

      res.send(`${text}<br/>${pinyin}`)
    }).catch(function (err) {
      // 如果发生网络错误
      console.log(err)
    })
}

exports.ocr = (req, res) => {
  // var file = req.file

  // console.log('文件类型：%s', file.mimetype)
  // console.log('原始文件名：%s', file.originalname)
  // console.log('文件大小：%s', file.size)
  // console.log('文件保存路径：%s', file.path)
  // // console.log(file.path)
  // var image = fs.readFileSync(file.path).toString('base64')

  // var options = {}
  // options['language_type'] = 'CHN_ENG'
  // options['detect_direction'] = 'true'
  // options['detect_language'] = 'true'
  // options['probability'] = 'true'
  // console.log(options)
  // // 带参数调用通用文字识别, 图片参数为本地图片
  // client.generalBasicUrl('https://www.baidu.com/img/bd_logo1.png', options).then(function (result) {
  //   console.log(JSON.stringify(result))
  //   res.send(JSON.stringify(result))
  // }).catch(function (err) {
  //   // 如果发生网络错误
  //   console.log(1)
  //   console.log(err)
  // })
  res.send('ok')
  // var form = new formidable.IncomingForm()
  // form.encoding = 'utf-8'
  // form.uploadDir = path.join(__dirname, '/../upload')
  // console.log(form.uploadDir)
  // form.keepExtensions = true // 保留后缀
  // form.maxFieldsSize = 2 * 1024 * 1024
  // form.parse(req, function (err, fields, files) {
  //   console.log(err, fields, files)
  //   var image = fs.readFileSync(files.the_file.path).toString('base64')

  //   var options = {}
  //   options['language_type'] = 'CHN_ENG'
  //   options['detect_direction'] = 'true'
  //   options['detect_language'] = 'true'
  //   options['probability'] = 'true'

  //   // 带参数调用通用文字识别, 图片参数为本地图片
  //   client.generalBasic(image, options).then(function (result) {
  //     res.send(JSON.stringify(result))
  //   }).catch(function (err) {
  //   // 如果发生网络错误
  //     console.log(err)
  //   })
  // })
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
      .charset()
      .end(function (err, data) {
        if (err == null) {
          var $ = cheerio.load(data.text)

          var pinyins = []
          if ($('#pinyin').html() != null) {
            if (text.length > 1) {
              if ($('#pinyin h2 span b').html() != null) {
                var pinyinStr = $('#pinyin h2 span b').html().replace('[ ', '').replace(' ]', '').replace('[', '').replace(']', '')
                pinyinStr = unUnicode(pinyinStr)
                pinyins = pinyinStr.split(' ')
              }
            } else {
              if ($('#pinyin span b').html() != null) {
                pinyinStr = $('#pinyin span b').html()
                pinyinStr = unUnicode(pinyinStr)
                pinyins.push(pinyinStr)
              }
            }
          } else {
            pinyins = pinyin(text, {
              // heteronym: true, // 启用多音字模式
              // segment: true // 启用分词，以解决多音字问题。
            })
          }
          if (pinyins.length === 0) {
            pinyins = pinyin(text, {
              // heteronym: true, // 启用多音字模式
              // segment: true // 启用分词，以解决多音字问题。
            })
          }
          if (pinyins.length > 0 && pinyins[0].constructor === Array) {
            var newPinyins = []
            pinyins.forEach(n => {
              newPinyins.push(n[0])
            })
            pinyins = newPinyins
          }
          if (pinyins.length > 0 && pinyins[0] === '[]') {
            pinyins = []
          }
          resolve({text: text, pinyins: pinyins})
        }
      })
  })
}

const unUnicode = function (str) {
  var patt = /&#x\w{2,3};/g
  var fields = str.match(patt)
  if (fields) {
    fields.forEach(function (item) {
      var newValue = item.replace('&#x', '').replace(';', '')
      for (var i = 0; i <= 4 - newValue.length; i++) {
        newValue = '0' + newValue
      }
      newValue = '\\u' + newValue
      str = str.replace(item, newValue.toLowerCase())
    })
    return unescape(str.replace(/\\/g, '%'))
  }
  return str
}
