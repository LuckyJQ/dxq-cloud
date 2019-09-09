const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    publish_detail: {},
    imgUrl: '',
    loading: false,
    typeArray: [
      ['一卡通', '身份证', '学生证', '其他'],
      ['电子', '书本', '生活', '其他']
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      loading: true
    })
    let that = this
    wx.cloud.callFunction({
      name: 'get_publish_detail',
      data: {
        id: options.id
      },
      success: res => {
        console.log('publish_detail', res.result.publish_detail.data[0])
        let publish_detail = res.result.publish_detail.data[0]
        that.setData({
          publish_detail
        })
        if (publish_detail.img){
          that.downloadImg(publish_detail.img)
        } else {
          that.setData({
            loading: false
          })
        }
      },
      fail: err => {
        console.log(err)
      },
    })
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

  downloadImg(imgUrl) {
    let that = this
    wx.cloud.downloadFile({
      fileID: imgUrl,
      success: res => {
        console.log('img url is', res.tempFilePath)
        that.setData({
          imgUrl: res.tempFilePath
        })
        that.setData({
          loading: false
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  }
})