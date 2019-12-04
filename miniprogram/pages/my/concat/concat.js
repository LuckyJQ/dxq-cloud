const app = getApp()
Page({
  
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    email: 'dxq_2019@outlook.com'
  },

  copyText() {
    wx.setClipboardData({
      data: this.data.email,
      success(res) {
        wx.getClipboardData({
          success(res) {
            wx.showToast({
              title: '邮箱复制成功'
            })
          }
        })
      }
    })
  }
})