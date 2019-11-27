const app = getApp()
import WxValidate from '../../../utils/validate.js'
import Toast from '../../../miniprogram_npm/vant-weapp/toast/toast'

var admin_validate;
function initValidate() {
  // 创建实例对象
  admin_validate = new WxValidate({
    wechat: {
      required: true
    },
    phone: {
      required: true,
      tel: true
    }
  }, {
      wechat: {
        required: '请输入微信号!'
      },
      phone: {
        required: '请输入电话号码!',
        tel: '手机号格式错误!'
      }
    })
}




Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    wechat: '',
    phone: '',
    school_info: {},
    openid: '',
    student_card: '',
    img: null,
    hideAdd: false
  },
  onLoad: function(options) {
    initValidate()
    let openid = wx.getStorageSync('openid')
    let school_info = wx.getStorageSync('school_info')
    this.setData({
      openid,
      school_info
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

  uploadImg: function () {
    // 上传图片后先进行ai检测，如果有人脸提醒用户进行ai打马或者手动打马
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: function (res) {
        console.log(res.tempFilePaths[0])
        let filePath = res.tempFilePaths[0]
        let index = filePath.lastIndexOf("/");
        let fileName = filePath.substr(index + 1)
        that.upload(fileName, filePath)
      },
      fail(e) {
        console.error(e)
      }
    })
  },
  
  upload(fileName, img_url) {
    console.log('fileName', fileName)
    wx.showLoading({
      title: '图片上传中',
    })
    let that = this
    wx.cloud.uploadFile({
      cloudPath: 'admin/' + fileName,
      filePath: img_url,
      success: res => {
        wx.hideLoading()
        that.setData({
          hideAdd: true,
          img: res.fileID
        })
        wx.showToast({
          title: '上传成功',
          icon: 'success',
          duration: 1000
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

  formSubmit(e) {
    let data = e.detail.value
    console.log(data)

    if (!admin_validate.checkForm(data)) {
      const error = admin_validate.errorList[0]
      Toast(error.msg);
      return
    }
    if (!admin_validate.checkForm(data)) {
      const error = admin_validate.errorList[0]
      Toast(error.msg);
      return
    }

    this.setData({
      phone: data.phone,
      wechat: data.wechat
    })
    let postData = {
      wechat: this.data.wechat,
      phone: this.data.phone,
      openid: this.data.openid,
      student_card: this.data.student_card,
      img: this.data.img,
      ...this.data.school_info
    }

    console.log('postData', postData)
    wx.cloud.callFunction({
      name: 'admin_request',
      data: postData,
      success(res) {
        console.log(res)
        wx.showToast({
          title: '提交成功',
        })
      },
      fail(err) {
        console.log(err)
      }
    })
  }
})