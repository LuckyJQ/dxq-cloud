// 管理员删帖
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  await db.collection('publish_collection').where({
    _id: event.id
  }).update({
    data: {
      del_status: true
    }
  })
}