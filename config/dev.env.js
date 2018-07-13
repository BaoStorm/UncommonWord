var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  baidu_appId:'"11530639"',
  baidu_apiKey:'"fzR5D1L7UHwC1zad7qUw9aUg"',
  baidu_secretKey:'"r9IriCpK69xImXNywoCqfeP9q6mVZfSu"',
  baidu_hostname:'"https://aip.baidubce.com"'
})
