const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  onAdd(e) {
    let index = e.detail
    switch (index) {
      case '1':
        wx.navigateTo({
          url: '/pages/square/help/help',
        })
        break;
      case '2':
        wx.navigateTo({
          url: '/pages/square/lost/lost',
        })
        break;
      case '3':
        wx.navigateTo({
          url: '/pages/square/find/find',
        })
        break;
    }
  },
  getDetail(){
    wx.navigateTo({
      url: '/pages/square/detail/detail',
    })
  }
})