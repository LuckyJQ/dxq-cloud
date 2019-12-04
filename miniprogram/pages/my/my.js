const app = getApp()
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    authorized: false,
    userInfo: ""
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

  // 跳转admin入口前需要做权限判断
  goAdminEntrance() {
    let openid = wx.getStorageSync('openid')
    let school_id = wx.getStorageSync('school_info').school_id
    wx.cloud.callFunction({
      name: 'judge_if_admin',
      data: {
        openid,
        school_id
      },
      success(res) {
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