const app = getApp()
import WxValidate from '../../../utils/validate.js'
import Toast from '../../../miniprogram_npm/vant-weapp/toast/toast'

// 表单验证对象
var admin_validate;

function initValidate() {
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

  // 上传学生证
  uploadImg() {
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: function(res) {
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