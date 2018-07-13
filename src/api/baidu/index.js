import axios from '@/api'
import qs from 'querystring'

const getToken = function () {
  const param = qs.stringify({
    'grant_type': 'client_credentials',
    'client_id': process.env.baidu_apiKey,
    'client_secret': process.env.baidu_secretKey
  })
  console.log(`${process.env.baidu_hostname}/oauth/2.0/token?${param}`)
  return axios.get(`${process.env.baidu_hostname}/oauth/2.0/token?${param}`)
}

export default{
  getToken
}
