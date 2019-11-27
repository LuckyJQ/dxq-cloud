let md5 = require('./md5.js')
let app_id = '2124093159'
let app_key = 'xlKswRKKpUsBVdZs'
let url = 'https://api.ai.qq.com/fcgi-bin/nlp/nlp_wordpos'

let participle = (text, callback) => {
  let params = {
    app_id: app_id,
    text: text,
    nonce_str: Math.random().toString(36).substr(2),
    time_stamp: parseInt(new Date().getTime() / 1000).toString()
  }
  params['sign'] = _genRequestSign(params)
  wx.request({
    url: url,
    data: params,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    success: function (res) {
      let formatRes = _formatResult(res.data)
      if (formatRes) {
        if (callback.success)
          callback.success(formatRes)
      } else {
        if (callback.fail)
          callback.fail()
      }
    },
    fail: function (res) {
      if (callback.fail)
        callback.fail()
    }
  })
}

let _genRequestSign = (params) => {
  // 1. 对请求参数按字典升序排序
  params = _sortObject(params)
  // 2. 拼接键值对，value部分进行URL编码
  let paramStr = ''
  let keys = Object.keys(params)
  for (let idx in keys) {
    let key = keys[idx]
    paramStr += key + '=' + encodeURIComponent(params[key]) + '&'
  }
  // 3. 拼接key
  paramStr += 'app_key=' + app_key
  // 4. md5
  return md5.hexMD5(paramStr).toUpperCase()
}

let _sortObject = (obj) => {
  var keys = Object.keys(obj).sort()
  var newObj = {}
  for (var i = 0; i < keys.length; i++) {
    newObj[keys[i]] = obj[keys[i]]
  }
  return newObj
}

let _formatResult = (res) => {
  console.log('分词原始数据', res)
  return {}
}

module.exports = {
  participle: participle
}