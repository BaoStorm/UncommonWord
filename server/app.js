
var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
let fs = require('fs')
var multer = require('multer')
var url = require('url')

var routes_baidu = require('./routes/baidu')

var app = express()

app.use(favicon(path.join(__dirname, 'favicon', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static('public'))
var upload = multer({ dest: 'public/uploads/' })

// 处理webpack服务请求
app.get('/__webpack_hmr', function (req, res) {
  res.send('')
})

app.get('/baidu/lexer', routes_baidu.lexer)
app.get('/baidu/lexerStr', routes_baidu.lexerStr)
app.post('/baidu/ocr', upload.single('file'), routes_baidu.ocr)

// 单图上传
app.post('/upload', upload.single('file'), function (req, res, next) {
  var file = req.file
  res.send({code: 0, size: file.size, path: file.path})
})

app.get('/form', function (req, res, next) {
  var form = fs.readFileSync('./form.html', {encoding: 'utf8'})
  res.send(form)
})

app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

module.exports = app
