// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()


// 云函数入口函数
exports.main = async (event, context) => {

  return {
    //获取帖子详情
    publish_detail: await db.collection('publish_collection').where({
      _id: event.id
    }).get(),
  }
}