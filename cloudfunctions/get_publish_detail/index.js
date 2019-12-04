// 获取帖子详情
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  return {
    publish_detail: await db.collection('publish_collection').where({
      _id: event.id
    }).get(),
  }
}