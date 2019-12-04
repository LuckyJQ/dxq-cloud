const app = getApp()
Page({
  
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    school: '未选择',
    notice:'丢小墙上线啦，欢迎使用👏~遇到BUG记得联系我们哦💗～'
  },

  onShow: function() {
    let school_info = wx.getStorageSync('school_info')
    if (school_info) {
      this.setData({
        school: school_info.school
      })
    }
  },

  // 轮播图，后续封装成独立接口，并支持每个高校自定义配置
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },

  // 我丢了，跳转前检测是否选择了学校
  toLost() {
    app.checkIfSelectedSchool()
    if (wx.getStorageSync('school_info')){
      wx.navigateTo({
        url: '/pages/index/lost/lost',
      })
    }
  },

  // 我捡到，跳转前检测是否选择了学校
  toFind() {
    app.checkIfSelectedSchool()
    if (wx.getStorageSync('school_info')){
      wx.navigateTo({
        url: '/pages/index/find/find',
      })
    }
  },

  // 选择学校跳转
  selectSchool() {
    wx.navigateTo({
      url: '/pages/index/school/school',
    })
  }
})