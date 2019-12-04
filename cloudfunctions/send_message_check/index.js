// 发送模板消息前的校验，当finder发布一条信息后，去数据库查询
// 如果有对应loster，返回loster信息，用于后续给loster发布模板消息

const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async(event, context) => {
  console.log(event)
  return sendTemplateMessage(event)
}


//小程序模版消息推送
async function sendTemplateMessage(event) {

  const res = await db.collection('publish_collection').where(
    _.or([{
        card_name: event.card_name
      },
      {
        card_number: event.card_number
      },
      {
        lost_or_find_name: event.lost_or_find_name
      }
    ]).and([{
      del_status: false
    }, {
      school_id: event.school_id
    },{
      publish_type: 1
    }])
  ).orderBy('publish_time', 'desc').get()

  return res
}