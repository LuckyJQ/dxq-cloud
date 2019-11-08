// pages/authorize/authorize.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('user_info')){
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindGetUserInfo: function (e) {
    console.log(e)
    if (e.detail.userInfo) {//用户按了允许授权按钮

      console.log(e.detail.userInfo)
      wx.setStorage({
        key: 'user_info',
        data: e.detail.userInfo
      })

      // wx.switchTab({
      //   url: '/pages/index/index',
      // })

      wx.navigateTo({
        url: '/pages/index/school/school',
      })

    } else {//用户按了拒绝按钮
    }
  }
})