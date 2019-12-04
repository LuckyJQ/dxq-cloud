// 我的发布
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  return {
    my_publish: await db.collection('publish_collection').where({
      del_status: false,
      user_id: event.user_id,
      school_id: event.school_id
    }).orderBy('publish_time', 'desc').get(),
  }
}