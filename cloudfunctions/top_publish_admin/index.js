const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()


// 云函数入口函数
exports.main = async (event, context) => {
  //更新帖子浏览数
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