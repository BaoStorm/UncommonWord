// import qs from 'querystring'

const uploadFile = (filePath) => {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: `${process.env.api_url}/upload`,
      filePath: filePath,
      name: 'file',
      success: function (res) {
        resolve(res)
      }
    })
  })
}

export default{
  uploadFile
}
