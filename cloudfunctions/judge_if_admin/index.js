// 区域管理员权限检测
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  return {
    admin_judge: await db.collection('admin_request').where({
      openid: event.openid,
      school_id: event.school_id,
      is_admin: true
    }).get(),
  }
}