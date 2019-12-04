// 申请区域管理员
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    return await db.collection('admin_request').add({
      data: {
        ...event,
        is_admin: false,
        publish_time: Date.now(),
        update_time: Date.now()
      }
    })
  } catch (e) {
    console.error(e)
  }
}