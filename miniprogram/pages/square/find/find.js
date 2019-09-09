const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    hideAdd: false,
    date: new Date().format("yyyy-MM-dd"),
    // end_time: new Date().toLocaleString().split(' ')[0].split('/').join('-'),
    end_time: new Date().format("yyyy-MM-dd"),
    img: null,
    multiIndex: [0, 0],
    multiArray: [
      ['卡证类', '非卡证类'],
      ['一卡通', '身份证', '学生证', '其他']
    ],
    postData: {
      first_type: null,
      second_type: null,
      name: null,
      description: null,
      thanks: null,
      lost_or_find_name: null,
      lost_or_find_place: null,
      lost_or_find_time: null,
      concat: null,
      card_number: null,
      card_name: null,
      // user_id: null,
      // school_id: null,
      publish_type: 0,
      isrich: false,
      istop: false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // wx.cloud.callFunction({
    //   name: 'get_class_list',
    //   success: function (res) {
    //     let class_list = res.result.class_list.data
    //     let card = []
    //     let nocard = []
    //     class_list.forEach((item,index)=>{
    //       if(item.first_type === 0){
    //         card.push(item.name)
    //       }
    //       if(item.first_type === 1){
    //         nocard.push(item.name)
    //       }
    //     })

    //     console.log('card',card)
    //     console.log('nocard', nocard)
    //   },
    //   fail: console.error
    // })
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
  uploadImg: function() {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
      success: function(res) {
        console.log(res)
        let img_url = res.tempFilePaths[0]
        let index = img_url.lastIndexOf("/");
        let fileName = img_url.substr(index + 1)
        that.upload(fileName, img_url)
      }
    })
  },

  //上传图片
  upload(fileName, img_url) {
    console.log('fileName', fileName)
    let that = this
    wx.cloud.uploadFile({
      cloudPath: 'dxq/' + fileName,
      filePath: img_url,
      success: res => {
        console.log(res)
        that.setData({
          hideAdd: true,
          img: res.fileID
        })
      },
      fail: err => {
        console.log('图片上传失败: ' + err.errMsg)
      }
    })
  },

  removeImg() {
    let that = this
    wx.showModal({
      title: '删除警告',
      content: '你确定要删除该图片吗',
      confirmColor: "#AE81F7",
      success(res) {
        if (res.confirm) {
          that.setData({
            hideAdd: false,
            img: null
          })
        } else if (res.cancel) {
          console.log('取消删除')
        }
      }
    })
  },

  MultiChange(e) {
    this.setData({
      multiIndex: e.detail.value
    })
  },
  MultiColumnChange(e) {
    console.log('e.detail.value', e.detail.value)
    let data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['一卡通', '身份证', '学生证', '其他'];
            break;
          case 1:
            data.multiArray[1] = ['电子', '书本', '生活', '其他'];
            break;
        }
        data.multiIndex[1] = 0;
        break;
    }
    this.setData(data);
  },
  DateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  formSubmit(e) {
    let that = this
    let post_detail = e.detail.value
    console.log('post_detail', post_detail)
    let type_class = {
      first_type: post_detail.type_class[0],
      second_type: post_detail.type_class[1],
    }
    Object.assign(post_detail, type_class)
    // console.log(post_detail)
    this.setData({
      postData: Object.assign(this.data.postData, post_detail)
    })


    //发送存储请求
    wx.cloud.callFunction({
      name: 'publish',
      data: {
        ...that.data.postData,
        img: that.data.img,
        user_id: wx.getStorageSync('openid'),
        school_id: wx.getStorageSync('school_info').school_id
      },
      success: function(res) {
        console.log(res)
      },
      fail: console.error
    })
  }
})