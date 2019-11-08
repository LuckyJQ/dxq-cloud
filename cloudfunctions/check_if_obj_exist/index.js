// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  // 搜索没有下架的，以及发布类型是捡到的
  if(event.kw){
    return {
      check_result: await db.collection('publish_collection').where({
        school_id: event.school_id,
        card_name: event.kw,
        publish_type: 0,
        del_status: false,
      }).orderBy('publish_time', 'desc').get()
    }
  }else{
    return {
      check_result: await db.collection('publish_collection').where({
        school_id: event.school_id,
        card_number: event.cardnum,
        publish_type: 0,
        del_status: false,
      }).orderBy('publish_time', 'desc').get()
    }
  }
}