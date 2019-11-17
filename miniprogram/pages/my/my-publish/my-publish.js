const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    loading: false,
    my_publish: [],
    typeArray: [
      ['一卡通', '身份证', '学生证', '其他'],
      ['电子', '书本', '生活', '其他']
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    this.setData({
      loading: true
    })

    let user_id = wx.getStorageSync('openid')
    this._getPublish(user_id)
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

  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },

  getTop(e){
    console.log('置顶')
    console.log(e.target.dataset.id)
  },

  getDetail(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/square/detail/detail?id=' + id,
    })
  },

  getDel(e){
    let that = this
    let id = e.target.dataset.id
    wx.showModal({
      title: '删除警告',
      content: '你确定要删除该发布吗',
      confirmColor: "#AE81F7",
      success(res) {
        if (res.confirm) {
          that._delPublish(id)
        } else if (res.cancel) {
          console.log('取消删除')
        }
      }
    })
  },

  _getPublish(user_id){
    let that = this
    wx.cloud.callFunction({
      name: 'get_my_publish',
      data: {
        user_id
      },
      success: (res) => {
        let my_publish = res.result.my_publish.data
        that.setData({
          my_publish,
          loading: false
        })
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },

  _delPublish(id){
    let that = this
    wx.cloud.callFunction({
      name: 'del_my_publish',
      data: {
        id: id
      },
      success: (res)=>{
        
        let data = that.data.my_publish
        data.forEach((item,index)=>{
          if(item._id === id){
            data.splice(index, 1)
            that.setData({
              my_publish: data
            })
          }
        })
        wx.showToast({
          title: '删除成功'
        })
      },
      fail: (err)=>{
        console.log(err)
      }
    })
  }
})