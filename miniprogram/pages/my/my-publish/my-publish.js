const app = getApp()
Page({

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

  onLoad: function(options) {
    let that = this
    this.setData({
      loading: true
    })
    let user_id = wx.getStorageSync('openid')
    let school_id = wx.getStorageSync('school_info').school_id
    this._getPublish(user_id, school_id)
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

  getTop(e) {
    console.log('置顶')
    console.log(e.target.dataset.id)
  },

  getDetail(e) {
    console.log('this.data.modalName', this.data.modalName)
    if (!this.data.modalName) {
      let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/square/detail/detail?id=' + id,
      })
    }
  },

  getDel(e) {
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

  // 获取发布
  _getPublish(user_id, school_id) {
    let that = this
    wx.cloud.callFunction({
      name: 'get_my_publish',
      data: {
        user_id,
        school_id
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

  // 删除发布
  _delPublish(id) {
    let that = this
    wx.cloud.callFunction({
      name: 'del_my_publish',
      data: {
        id: id
      },
      success: (res) => {

        let data = that.data.my_publish
        data.forEach((item, index) => {
          if (item._id === id) {
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
      fail: (err) => {
        console.log(err)
      }
    })
  }
})