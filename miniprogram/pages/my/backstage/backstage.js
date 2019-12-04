const app = getApp()
Page({

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

  onLoad: function(options) {
    this.setData({
      loading: true
    })
    let that = this
    this.setData({
      school_id: options.school_id
    })
    wx.cloud.callFunction({
      name: 'get_publish_list_admin',
      data: {
        school_id: that.data.school_id,
        del_status: false
      },
      success(res) {
        console.log(res)
        let publish_list = res.result.publish_list.data
        that.setData({
          publish_list,
          loading: false
        })
      },
      fail(err) {
        console.log(err)
      }
    })
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

  // 管理员置顶
  setPublishTop(e) {
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

  // 管理员删帖
  delPublish(e) {
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

  // 管理员搜索
  getInput(e) {
    this.setData({
      loading: true
    })
    let that = this
    let kw = e.detail.value
    wx.cloud.callFunction({
      name: 'get_search_admin',
      data: {
        kw,
        school_id: that.data.school_id,
        del_status: false,
      },
      success(res) {
        console.log(res)
        let publish_list = res.result.search_result.data
        that.setData({
          publish_list,
          loading: false
        })
      },
      fail(err) {
        console.log(err)
      }
    })
  }
})