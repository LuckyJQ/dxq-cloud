import Card from './palette';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: true,
    template: {},

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.setData({
    //   template: new Card().palette({
    //     width: '700rpx',
    //     top: '101rpx'
    //   })
    // })

    let a = 100
    // 调用打马赛克
    this.setData({
      template: new Card().palette({
        imgWidth: a + 'rpx',
        imgHeight: '473rpx',
        bg: '/images/test.jpeg',
        width: '288rpx',
        height: '288rpx',
        left: '203rpx',
        top: '101rpx'
      })
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

  dM() {
    this.setData({
      show: false
    })
    let data = {
      code: 10000,
      face_pos_list: [{
        face_id: '13232323',
        height: 288,
        width: 288,
        x: 203,
        y: 101
      }],
      image_height: 473,
      image_width: 700
    }
  },


  onClose() {
    this.setData({
      show: false
    });
  },

  // 保存canvas绘制
  saveImage() {
    wx.saveImageToPhotosAlbum({
      filePath: this.imagePath
    })
  },

  onImgOK(e) {
    this.imagePath = e.detail.path;
    this.setData({
      img: this.imagePath
    })
    wx.hideLoading()
    console.log(this.imagePath);
  }
})