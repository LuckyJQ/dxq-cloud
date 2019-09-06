const app = getApp()
let timer

Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    schools: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

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
          wx.navigateBack({})
        }, 1000)
      }
    })
  },

  // 截流函数
  throttle(fn, wait) {
    return function(...args) {
      if (!timer) {
        timer = setTimeout(() => {
          timer = null
          fn.apply(this, args)
        }, wait)
      }
    }
  },
  onSearch(e) {
    this.throttle(this._onSearch.bind(this, e), 500)()
  },
  _onSearch(e) {
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
      }
    })
  }

})