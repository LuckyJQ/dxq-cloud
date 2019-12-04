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

  // 进入详情页时候下载发布对应的图片
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

    // 获取详情
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

  // canvas绘制分享图
  onImgOK(e) {
    this.imagePath = e.detail.path;
    this.setData({
      img: this.imagePath
    })
    wx.hideLoading()
    console.log(this.imagePath);
  },

  // 保存canvas绘制
  saveImage() {
    wx.saveImageToPhotosAlbum({
      filePath: this.imagePath
    })
  },

  // 下载生成用户分享图的头像
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

  // 分享按钮，转发或者生成朋友圈分享图
  onShare() {
    let that = this
    wx.showActionSheet({
      itemList: ['发送给好友', '生成分享图'],
      success(res) {
        if (res.tapIndex === 0) {
          wx.showModal({
            title: '分享提醒',
            content: '点击右上角按钮进行分享',
            confirmColor: "#AE81F7",
            confirmColor: "#AE81F7",
            showCancel: false
          })
        }
        if (res.tapIndex === 1) {
          // 生成分享图需要用户的头像，昵称，这个需要用户授权，提示跳转授权
          let userInfo = wx.getStorageSync('user_info')
          if (!userInfo) {
            wx.showModal({
              title: '授权提示',
              content: '生成分享图需要您授权\r\n是否跳转授权？',
              confirmColor: "#AE81F7",
              success(res) {
                if (res.confirm) {
                  wx.switchTab({
                    url: '/pages/my/my',
                  })
                }
              }
            })
          } else {
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

  // 复制联系方式到剪贴板
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