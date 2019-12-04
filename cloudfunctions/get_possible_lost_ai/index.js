// 捡到者发布后，Ai分词寻找最匹配失物，存在发送模板消息给对应人
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async(event, context) => {
  // 所有要查询的关键词
  let kw_arr = event.kw_arr
  // 匹配的数据
  let res_arr = []
  if (kw_arr.length > 0) {
    for (let i = 0; i < kw_arr.length; i++) {
      let res = await db.collection('publish_collection').where(
        _.or([{
            card_name: db.RegExp({
              regexp: '.*' + kw_arr[i] + '.*'
            })
          },
          {
            card_number: db.RegExp({
              regexp: '.*' + kw_arr[i] + '.*'
            })
          },
          {
            description: db.RegExp({
              regexp: '.*' + kw_arr[i] + '.*'
            })
          },
          {
            name: db.RegExp({
              regexp: '.*' + kw_arr[i] + '.*'
            })
          },
          {
            lost_or_find_place: db.RegExp({
              regexp: '.*' + kw_arr[i] + '.*'
            })
          }
        ]).and([{
          del_status: event.del_status,
          school_id: event.school_id,
          publish_type: 1
        }])
      ).orderBy('publish_time', 'desc').get()
      res_arr.push(...res.data)
    }
  }

  // 字典统计每个id数量
  let obj = {}
  for (let i = 0; i < res_arr.length; i++) {
    if (!obj[res_arr[i]['_id']]) {
      obj[res_arr[i]['_id']] = 1
    } else {
      obj[res_arr[i]['_id']] = obj[res_arr[i]['_id']] + 1
    }
  }

  // 对id进行排序
  let sort_id_arr = Object.keys(obj).sort((a, b) => {
    return obj[b] - obj[a];
  })

  // 如果最匹配的，有三个关键词都匹配了，那么这条的概率很大了，发送模板消息
  if (obj[sort_id_arr[0]] >= 3){
    for (let i = 0; i < res_arr.length;i++){
      if (res_arr[i]._id == sort_id_arr[0]){
        return {
          ...res_arr[i],
          code: 1000
        }
      }
    }
  }else {
    return {
      code: 1001
    }
  }
}