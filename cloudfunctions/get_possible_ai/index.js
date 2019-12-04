// 丢失者发布后，Ai分词寻找最匹配失物
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
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
        }
        ]).and([{
          del_status: event.del_status,
          school_id: event.school_id,
          publish_type: 0
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

  // 终于要返回查到的数据了
  let possible_res = []

  // 不返回多了，就返回三条把
  let possible_length = sort_id_arr.length > 3 ? 3 : sort_id_arr.length

  for (let i = 0; i < possible_length; i++) {
    for (let j = 0; j < res_arr.length; j++) {
      if (sort_id_arr[i] == res_arr[j]['_id']) {
        possible_res.push(res_arr[j])
        break
      }
    }
  }

  // 对res_arr进行数据删除，选出_id出现次数最多的三个进行返回
  return {
    //获取帖子详情
    search_result: possible_res
  }
}