// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()


// 云函数入口函数
exports.main = async (event, context) => {

  return {
    //获取当前用户是不是该区域的admin
    admin_judge: await db.collection('admin_request').where({
      openid: event.openid,
      school_id: event.school_id,
      is_admin: true
    }).get(),
  }
}