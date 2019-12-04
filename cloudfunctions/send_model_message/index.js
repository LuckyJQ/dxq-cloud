// 发送模板消息
const cloud = require('wx-server-sdk')
cloud.init()

exports.main = async (event, context) => {
  console.log(event)
  return sendTemplateMessage(event)
}

//小程序模版消息推送
async function sendTemplateMessage(event) {

  let item = event.findersData
  const sendResult = await cloud.openapi.templateMessage.send({
    touser: event.toLoster.openId,
    templateId: 'wk3HNitMbdhcxSPLDIqstF0gvZeME_cgDr4-qVxfS7w',
    formId: event.formId,
    page: 'pages/index/index',
    data: {
      keyword1: {
        value: item.name ? item.name : item.card_name,
      },
      keyword2: {
        value: item.description,
      },
      keyword3: {
        value: item.concat,
      }
    }
  })

  return sendResult
}