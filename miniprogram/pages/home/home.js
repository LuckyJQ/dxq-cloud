Page({
  // 下一次进来，如果选过学校了就直接进入首页
  onLoad(options) {
    if (wx.getStorageSync('school_info')){
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  },

  // 进入小程序，去选择学校
  getSchool(){
    wx.navigateTo({
      url: '/pages/index/school/school',
    })
  }
})