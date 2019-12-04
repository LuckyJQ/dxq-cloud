// 管理员置顶
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  await db.collection('publish_collection').where({
    _id: event.id,
    school_id: event.school_id,
    del_status: event.del_status
  }).update({
    data: {
      istop: true
    }
  })
}