const app = getApp()
Page({
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

  // 初始化检测学校
  onLoad: function(options) {
    app.checkIfSelectedSchool()
    this._getPublishList(0)
  },

  // 搜索接口
  onSearch(e) {
    app.checkIfSelectedSchool()
    if (wx.getStorageSync('school_info')) {
      let kw = e.detail.value
      wx.navigateTo({
        url: '/pages/square/search/search?kw=' + kw,
      })
    }
  },

  // 获取某个大类和小类下的发布
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

  // 切换捡到大类
  changeTypeFind(e) {
    this.setData({
      publish_list: []
    })
    if(!this.data.isFind){
      let publish_type = parseInt(e.currentTarget.dataset.publish_type)
      this.setData({
        isFind: true,
        publish_type,
        active: 0
      })
      this._getPublishList(publish_type)
    }
  },

  // 切换丢失大类
  changeTypeLost(e) {
    if(this.data.isFind){
      let publish_type = parseInt(e.currentTarget.dataset.publish_type)
      this.setData({
        isFind: false,
        publish_type,
        active: 0
      })
      this._getPublishList(publish_type)
    }
  },

  // 切换小类tab
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

  // 跳转详情页
  getDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/square/detail/detail?id=' + id,
    })
  }
})