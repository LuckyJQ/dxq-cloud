const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  console.log('event',event)

  // return {
  //   school_detail: await db.collection('school_collection').where({
  //     school_name: event.kw
  //   }).get(),
  // }

  return {
    //获取帖子详情
    school_detail: await db.collection('school_collection').where({
      school_name: db.RegExp({
        regexp: '.*' + event.kw + '.*'
      })
    }).get(),
  }

}