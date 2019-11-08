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

  // let item = res.data[0]
  // var openId
  // if (item) {
  //   openId = item.userInfo.openId
  //   // return openId
  // } else {
  //   return 0
  // }

  // const sendResult = await cloud.openapi.templateMessage.send({
  //   touser: openId,
  //   templateId: 'QaJQKWA8zF_7InjOqVsMHWa-k_ADLgI8PVcGMvUm5Sw',
  //   formId: event.formId,
  //   page: 'pages/index/index',
  //   data: {
  //     keyword1: {
  //       value: item.name ? item.name : item.card_name + '的卡',
  //     },
  //     keyword2: {
  //       value: item.description,
  //     },
  //     keyword3: {
  //       value: item.concat,
  //     },
  //     keyword4: {
  //       value: item.lost_or_find_place,
  //     },
  //     keyword5: {
  //       value: item.lost_or_find_time,
  //     }
  //   }
  // })

  // return sendResult
}