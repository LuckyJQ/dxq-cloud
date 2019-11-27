const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    authorized: false,
    userInfo: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.userAuthorized()
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

  //用户授权
  onGetUserInfo(e) {
    const userInfo = e.detail.userInfo
    if (userInfo) {
      console.log('userInfo', userInfo)
      this.setData({
        userInfo: userInfo,
        authorized: true
      })
      wx.setStorageSync('user_info', userInfo)
    }
  },

  //判断用户是否已经授权，已授权下次进来时可以直接调用
  userAuthorized() {
    wx.getSetting({
      success: data => {
        if (data.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: data => {
              this.setData({
                authorized: true,
                userInfo: data.userInfo
              })

              //保证永远是最新的个人信息
              wx.setStorageSync('user_info', data.userInfo)
            },
            fail: err => {
              wx.showToast({
                title: '授权已过期，请重新授权',
                duration: 1500
              })
            }
          })
        }
      }
    })
  },
  getPublish() {
    wx.navigateTo({
      url: '/pages/my/my-publish/my-publish',
    })
  },
  getHelp() {
    wx.navigateTo({
      url: '/pages/my/help/help',
    })
  },
  getConcat() {
    wx.navigateTo({
      url: '/pages/my/concat/concat',
    })
  },
  getAdmin() {
    wx.navigateTo({
      url: '/pages/my/admin/admin',
    })
  },
  goAdminEntrance() {
    // 跳转admin入口前需要做权限判断
    let openid = wx.getStorageSync('openid')
    let school_id = wx.getStorageSync('school_info').school_id
    wx.cloud.callFunction({
      name: 'judge_if_admin',
      data: {
        openid,
        school_id
      },
      success(res) {
        console.log(res)
        let flag = res.result.admin_judge.data.length
        if (!flag) {
          wx.showModal({
            title: '权限提醒',
            content: '你暂无管理员权限\r\n可以到【我的】页面进行申请',
            showCancel: false,
            confirmColor: "#AE81F7",
          })
        } else {
          wx.navigateTo({
            url: '/pages/my/backstage/backstage?school_id=' + school_id,
          })
        }
      },
      fail(err) {
        console.log(err)
      }
    })
  }
})