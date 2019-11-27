const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    school_id: '',
    publish_list: [],
    loading: true,
    typeArray: [
      ['一卡通', '身份证', '学生证', '其他'],
      ['电子', '书本', '生活', '其他']
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      loading: true
    })
    let that = this
    this.setData({
      school_id: options.school_id
    })
    wx.cloud.callFunction({
      name:'get_publish_list_admin',
      data:{
        school_id: that.data.school_id,
        del_status: false
      },
      success(res){
        console.log(res)
        let publish_list = res.result.publish_list.data
        that.setData({
          publish_list,
          loading: false
        })
      },
      fail(err){
        console.log(err)
      }
    })
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

  setPublishTop(e){
    console.log('top')
    let that = this
    let id = e.currentTarget.dataset.id
    wx.cloud.callFunction({
      name: 'top_publish_admin',
      data: {
        id,
        school_id: that.data.school_id,
        del_status: false,
      },
      success(res) {
        console.log(res)
        wx.showToast({
          title: '置顶成功',
        })
      },
      fail(err) {
        console.log(err)
      }
    })
  },

  delPublish(e){
    console.log(e)
    let id = e.currentTarget.dataset.id
    wx.showModal({
      title: '删除警告',
      content: '你确定要删除该发布吗',
      confirmColor: "#AE81F7",
      success(res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'del_publish_admin',
            data: {
              id
            },
            success(res) {
              wx.showToast({
                title: '删除成功',
              })
            },
            fail(err) {
              console.log(err)
            }
          })

        } else if (res.cancel) {
          console.log('取消删除')
        }
      }
    })
  },

  getInput(e){
    this.setData({
      loading: true
    })
    let that = this
    let kw = e.detail.value
    wx.cloud.callFunction({
      name: 'get_search_admin',
      data:{
        kw,
        school_id: that.data.school_id,
        del_status: false,
      },
      success(res){
        console.log(res)
        let publish_list = res.result.search_result.data
        that.setData({
          publish_list,
          loading: false
        })
      },
      fail(err){
        console.log(err)
      }
    })
  }
})