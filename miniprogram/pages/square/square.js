const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    loading: false,
    isFind: true,
    publish_type: 0,
    publish_list: [],
    typeArray: [
      ['一卡通', '身份证', '学生证', '其他'],
      ['电子', '书本', '生活', '其他']
    ],
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._getPublishList(0)
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
    app.checkIfSelectedSchool()

    // 开启onShow时候强制刷新
    // this._getPublishList(0)
    // this.setData({
    //   isFind: true,
    //   active: 0
    // })
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

  onSearch(e) {
    app.checkIfSelectedSchool()

    if (wx.getStorageSync('school_info')) {
      let kw = e.detail.value
      wx.navigateTo({
        url: '/pages/square/search/search?kw=' + kw,
      })
    }
  },

  _getPublishList(publish_type, first_type, second_type) {
    let that = this
    let school_id = wx.getStorageSync('school_info').school_id
    this.setData({
      loading: true
    })
    wx.cloud.callFunction({
      name: 'get_publish_list',
      data: {
        school_id: school_id ? school_id : 'none',
        publish_type,
        first_type,
        second_type
      },
      success: res => {
        let publish_list = res.result.publish_list.data
        console.log('publish_list', publish_list)
        that.setData({
          publish_list,
          loading: false
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },

  changeType(e) {
    // console.log('e', e.currentTarget.dataset.publish_type)
    let publish_type = parseInt(e.currentTarget.dataset.publish_type)
    this.setData({
      isFind: !this.data.isFind,
      publish_type,
      active: 0
    })
    this._getPublishList(publish_type)
  },

  onTabChange(e) {
    console.log('index', e.detail.index)
    let index = e.detail.index
    switch (index) {
      case 0:
        this._getPublishList(this.data.publish_type)
        break;
      case 1:
        this._getPublishList(this.data.publish_type, 0)
        break;
      case 2:
        this._getPublishList(this.data.publish_type, 1, 0)
        break;
      case 3:
        this._getPublishList(this.data.publish_type, 1, 1)
        break;
      case 4:
        this._getPublishList(this.data.publish_type, 1, 2)
        break;
      case 5:
        this._getPublishList(this.data.publish_type, 1, 3)
        break;
    }
  },

  onAdd(e) {
    app.checkIfSelectedSchool()
    if (wx.getStorageSync('school_info')) {
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
    }
  },
  getDetail(e) {

    let id = e.currentTarget.dataset.id

    wx.navigateTo({
      url: '/pages/square/detail/detail?id=' + id,
    })
  }
})