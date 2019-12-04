const app = getApp()
Page({

  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    search_result: [],
    loading: false,
    typeArray: [
      ['一卡通', '身份证', '学生证', '其他'],
      ['电子', '书本', '生活', '其他']
    ]
  },

  onLoad: function(options) {
    this.getSearch(options.kw)
    this.setData({
      loading: true
    })
  },

  // 搜索
  getSearch(kw) {
    let that = this
    wx.cloud.callFunction({
      name: 'get_search',
      data: {
        kw,
        school_id: wx.getStorageSync('school_info').school_id
      },
      success: (res) => {
        console.log(res)
        let search_result = res.result.search_result.data
        that.setData({
          search_result,
          loading: false
        })
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },

  getDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/square/detail/detail?id=' + id,
    })
  }
})