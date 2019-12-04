// 获取高校信息
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  return {
    school_detail: await db.collection('school_collection').where({
      school_name: db.RegExp({
        regexp: '.*' + event.kw + '.*'
      })
    }).get(),
  }
}