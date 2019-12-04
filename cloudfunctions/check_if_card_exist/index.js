// 云函数入口文件
// 检测卡证类卡号是否存在
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  return {
    check_result: await db.collection('publish_collection').where({
      school_id: event.school_id,
      card_number: event.numKw,
      publish_type: 0,
      del_status: false,
    }).orderBy('publish_time', 'desc').get()
  }
}