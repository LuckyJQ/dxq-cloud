// 云函数入口文件
const cloud = require('wx-server-sdk')
const iconv = require('iconv')

cloud.init()


// 云函数入口函数
exports.main = async (event, context) => {
  var biz_content = "欢迎关注！";
  var gbkBytes = iconv.encode(biz_content, 'gbk');

  return {
    data: gbkBytes
  }
}