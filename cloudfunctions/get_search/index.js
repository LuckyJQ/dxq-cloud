// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async(event, context) => {
  return {
    //获取帖子详情
    search_result: await db.collection('publish_collection').where(
      _.or([{
          card_name: db.RegExp({
            regexp: '.*' + event.kw + '.*'
          })
        },
        {
          card_number: db.RegExp({
            regexp: '.*' + event.kw + '.*'
          })
        },
        {
          description: db.RegExp({
            regexp: '.*' + event.kw + '.*'
          })
        },
        {
          name: db.RegExp({
            regexp: '.*' + event.kw + '.*'
          })
        }
      ]).and([{
        del_status: false,
        school_id: event.school_id
      }])
    ).orderBy('publish_time', 'desc').get()
  }
}