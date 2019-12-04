// 发布帖子
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    return await db.collection('publish_collection').add({
      data: {
        ...event,
        del_status: false,
        publish_time: Date.now(),
        update_time: Date.now()
      }
    })
  } catch (e) {
    console.error(e)
  }
}