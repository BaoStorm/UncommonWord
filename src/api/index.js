import promise from 'es6-promise'
import axios from 'axios'

// 解决浏览器不兼容promise的问题
promise.polyfill()

// axios 配置
axios.defaults.timeout = 60000
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
axios.defaults.headers.post['Cache-Control'] = 'no-cache'
axios.defaults.withCredentials = true

// http request 拦截器
axios.interceptors.request.use(
  config => {
    console.debug(config)
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    return Promise.reject(error)
  }
)

export default axios
