import Card from './palette';


const app = getApp()
Page({

  imagePath: '',

  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    show: false,
    publish_detail: {},
    imgUrl: '',
    loading: false,
    typeArray: [
      ['一卡通', '身份证', '学生证', '其他'],
      ['电子', '书本', '生活', '其他']
    ],


    template: {},
    img: '',
    avatar: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    wx.downloadFile({
      url: wx.getStorageSync('user_info').avatarUrl,
      success(res) {
        that.setData({
          avatar: res.tempFilePath
        })
      }
    })


    this.setData({
      loading: true
    })
    wx.cloud.callFunction({
      name: 'get_publish_detail',
      data: {
        id: options.id
      },
      success: res => {
        console.log('publish_detail', res.result.publish_detail.data[0])
        let publish_detail = res.result.publish_detail.data[0]
        that.setData({
          publish_detail
        })
        if (publish_detail.img) {
          that.downloadImg(publish_detail.img)
        } else {
          that.setData({
            loading: false
          })
        }
      },
      fail: err => {
        console.log(err)
      },
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

  onImgOK(e) {
    this.imagePath = e.detail.path;
    this.setData({
      img: this.imagePath
    })
    wx.hideLoading()
    console.log(this.imagePath);
  },

  saveImage() {
    wx.saveImageToPhotosAlbum({
      filePath: this.imagePath
    })
  },

  downloadImg(imgUrl) {
    let that = this
    wx.cloud.downloadFile({
      fileID: imgUrl,
      success: res => {
        console.log('img url is', res.tempFilePath)
        that.setData({
          imgUrl: res.tempFilePath
        })
        that.setData({
          loading: false
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  onShare() {
    let that = this
    wx.showActionSheet({
      itemList: ['发送给好友', '生成分享图'],
      success(res) {
        console.log(res.tapIndex)
        if (res.tapIndex === 1) {
          that.setData({
            show: true,
            template: new Card().palette({
              nickName: wx.getStorageSync('user_info').nickName,
              school_name: wx.getStorageSync('school_info').school,
              title: that.data.publish_detail.name ? that.data.publish_detail.name : that.data.publish_detail.card_name + '的卡',
              description: that.data.publish_detail.description,
              avatar: that.data.avatar ? that.data.avatar : ''
            })
          })

          wx.showLoading({
            title: '努力生成中..',
          })
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })

  },

  onClose() {
    this.setData({
      show: false
    });
  },

  copyPhone() {
    wx.setClipboardData({
      data: this.data.publish_detail.concat,
      success(res) {
        wx.getClipboardData({
          success(res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  }
})