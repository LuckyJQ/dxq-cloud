let md5 = require('./md5.js')
let app_id = '2124093159'
let app_key = 'xlKswRKKpUsBVdZs'
// let url = 'https://api.ai.qq.com/fcgi-bin/ocr/ocr_generalocr'
// let url = 'https://api.ai.qq.com/fcgi-bin/ptu/ptu_facesticker'
let url = 'https://api.ai.qq.com/fcgi-bin/face/face_detectface'

let ocrRequest = (base64Img, callback) => {
  let params = {
    app_id: app_id,
    mode: 0,
    image: base64Img,
    nonce_str: Math.random().toString(36).substr(2),
    time_stamp: parseInt(new Date().getTime() / 1000).toString()
  }
  params['sign'] = _genRequestSign(params)
  wx.request({
    url: url,
    data: params,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
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
  console.log('ocr原始数据', res)
  let format = {}
  let item_list = res.data.item_list
  if (res.ret == 0 && res.data && res.data.face_list) {
    format['image_height'] = res.data.image_height
    format['image_width'] = res.data.image_width
    format['code'] = 10000
    format['msg'] = '检测成功'

    let face_pos_list = []
    for (let i = 0; i < res.data.face_list.length; i++) {
      face_pos_list.push({
        face_id: res.data.face_list[i].face_id,
        x: res.data.face_list[i].x,
        y: res.data.face_list[i].y,
        width: res.data.face_list[i].width,
        height: res.data.face_list[i].height,
      })
    }
    format['face_pos_list'] = face_pos_list
    return format
  } else if (res.msg.indexOf('busy') != -1) {
    return {
      code: 10001,
      msg: '系统繁忙'
    }
  } else {
    return {
      code: 10002,
      msg: '未检测到人脸'
    }
  }
}

module.exports = {
  ocrRequest: ocrRequest
}