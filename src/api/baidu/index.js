// import qs from 'querystring'

const getLexer = text => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${process.env.api_url}/baidu/lexer?text=${text}`,
      method: 'GET',
      success: function (res) {
        resolve(res)
      }
    })
  })
}

const ocr = (filePath) => {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: `${process.env.api_url}/baidu/ocr`,
      filePath: filePath,
      name: 'file',
      success: function (res) {
        resolve(res)
      }
    })
  })
}
export default{
  getLexer,
  ocr
}
