// 获取分类，目前在小程序写死了，以后用
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  return {
    class_list: await db.collection('class_collection').get()
  }
}