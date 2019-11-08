// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()


// 云函数入口函数
exports.main = async (event, context) => {

  return {
    //获取帖子详情
    my_publish: await db.collection('publish_collection').where({
      del_status: false,
      user_id: event.user_id
    }).orderBy('publish_time', 'desc').get(),
  }
}