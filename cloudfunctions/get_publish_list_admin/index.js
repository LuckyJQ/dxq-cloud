// 管理员获取发布列表
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async(event, context) => {
  return {
    publish_list: await db.collection('publish_collection').where({
      school_id: event.school_id,
      del_status: event.del_status
    }).orderBy('publish_time', 'desc').get()
  }
}