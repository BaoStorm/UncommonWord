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

export default{
  getLexer
}
