import {
  throttle
} from '../../../utils/throttle.js'
const app = getApp()

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    schools: [{
      school_belong: "教育部",
      school_city: "西安市",
      school_id: "4161010701",
      school_name: "西安电子科技大学",
      school_type: "本科",
      _id: "sx4Q86EFArYIoVI3XHei7DW6jhcSItTVTl9d4mdOoPWANSUw"
    }, {
      school_belong: "教育部",
      school_city: "西安市",
      school_id: "4161010718",
      school_name: "陕西师范大学",
      school_type: "本科",
      _id: "kPzcNjGipaPEmNkkFAYkLbQsDsxx3HcMm7iUaTzQuX0q4lrn"
    }, {
      school_belong: "教育部",
      school_city: "西安市",
      school_id: "4161010698",
      school_name: "西安交通大学",
      school_type: "本科",
      _id: "vdP2imBO0Ns02mt6hmHo8MNG6t3sDO7SBXi0Z7fkL7YqAj9M"
    }],
    loading: false
  },

  onLoad: function(options) {

  },

  selectSchool(e) {
    let school_info = {
      school: e.currentTarget.dataset.school,
      school_id: e.currentTarget.dataset.school_id
    }

    wx.setStorageSync('school_info', school_info)
    wx.showToast({
      title: '选择成功',
      duration: 1000,
      success: function() {
        setTimeout(() => {
          // wx.navigateBack({})

          wx.switchTab({
            url: '/pages/index/index',
          })

        }, 1000)
      }
    })
  },

  onSearch: throttle(
    function(e) {
      const that = this
      let kw = e.detail.value
      wx.cloud.callFunction({
        name: 'get_school',
        data: {
          kw: kw
        },
        success: function(res) {
          console.log('res', res.result.school_detail.data)
          that.setData({
            schools: res.result.school_detail.data
          })
          that.setData({
            loading: false
          })
        }
      })
    }, 300)
})