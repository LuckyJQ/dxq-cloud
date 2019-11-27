import WxValidate from '../../../utils/validate.js'
import Toast from '../../../miniprogram_npm/vant-weapp/toast/toast'
import {
  ocrRequest
} from '../../../utils/face_ocr.js'
import {
  debounce
} from '../../../utils/debounce.js'

const app = getApp()
var type1_validate, type2_validate

function initValidate() {
  // 创建实例对象
  type1_validate = new WxValidate({
    card_name: {
      required: true,
      maxlength: 10
    },
    card_number: {
      required: true
    },
    lost_or_find_place: {
      required: true
    },
    concat: {
      required: true,
      // tel: true
    }
  }, {
      card_name: {
        required: '请输入持卡人姓名!',
        maxlength: '姓名不得超过10字!'
      },
      card_number: {
        required: '请输入持卡人卡号'
      },
      lost_or_find_place: {
        required: '请输入捡到的地点'
      },
      concat: {
        required: '请输入联系方式',
        // tel: '手机号格式错误'
      }
    })

  type2_validate = new WxValidate({
    name: {
      required: true,
      maxlength: 12
    },
    lost_or_find_place: {
      required: true
    },
    concat: {
      required: true,
      // tel: true
    }
  }, {
      name: {
        required: '请输入物品名称!',
        maxlength: '物品名称不得超过12字!'
      },
      lost_or_find_place: {
        required: '请输入捡到的地点'
      },
      concat: {
        required: '请输入联系方式',
        // tel: '手机号格式错误'
      }
    })
}

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
  onLoad: function (options) {
    app.checkIfSelectedSchool()
    initValidate()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
        wx.getFileSystemManager().readFile({
          filePath: filePath,
          encoding: 'base64',
          success(res) {
            console.log(res)
            wx.showLoading({
              title: 'AI检测中',
            })
            // 拿到上传图片的base64编码
            let base64ImgData = res.data
            ocrRequest(base64ImgData, {
              success(res) {
                console.log(res)
                if (res.code == 10000) {
                  wx.hideLoading()
                  wx.showModal({
                    title: 'AI检测提示',
                    content: 'Ai检测到图片中有人脸 \r\n建议打码后再上传',
                    confirmColor: "#AE81F7",
                    confirmText: '去打码',
                    cancelText: '不打码',
                    success(res) {
                      if (res.confirm) {
                        console.log('去手动打马了')
                      } else if (res.cancel) {
                        console.log('开始上传图片')
                        let index = filePath.lastIndexOf("/");
                        let fileName = filePath.substr(index + 1)
                        that.upload(fileName, filePath)
                      }
                    },
                    fail() {

                    }
                  })
                } else {
                  wx.hideLoading()
                  let index = filePath.lastIndexOf("/");
                  let fileName = filePath.substr(index + 1)
                  that.upload(fileName, filePath)
                }
              },
              fail(err) {
                console.log(err)
              }
            })
          },
          fail(err) {
            console.log('发生错误了', err)
          }
        })
      },
      fail(e) {
        console.error(e)
      }
    })
  },

  //上传图片
  upload(fileName, img_url) {
    console.log('fileName', fileName)
    wx.showLoading({
      title: '图片上传中',
    })
    let that = this
    wx.cloud.uploadFile({
      cloudPath: 'dxq/' + fileName,
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

  formSubmit: debounce(
    function (e) {
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

      if (post_detail.first_type === 0) {
        if (!type1_validate.checkForm(post_detail)) {
          const error = type1_validate.errorList[0]
          wx.hideLoading()
          Toast(error.msg);
          return
        }
      } else {
        if (!type2_validate.checkForm(post_detail)) {
          const error = type2_validate.errorList[0]
          wx.hideLoading()
          Toast(error.msg);
          return
        }
      }

      wx.showLoading({
        title: '发布中'
      })

      // 发送存储请求
      wx.cloud.callFunction({
        name: 'publish',
        data: {
          ...that.data.postData,
          img: that.data.img,
          user_id: wx.getStorageSync('openid'),
          school_id: wx.getStorageSync('school_info').school_id
        },
        success: function (res) {
          wx.hideLoading()
          that.sendMsg()
          wx.showToast({
            title: '发布成功',
            duration: 1500,
            success: () => {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 1500)
            }
          })
        },
        fail: console.error
      })

    }, 1000),

  // 发送模板消息
  sendMsg() {
    let that = this
    console.log('this.postData', that.data.postData)
    wx.cloud.callFunction({
      name: 'push0524',
      data: {
        lost_or_find_name: that.data.postData.lost_or_find_name ? that.data.postData.lost_or_find_name : '',
        card_name: that.data.postData.card_name,
        card_number: that.data.postData.card_number,
        school_id: wx.getStorageSync('school_info').school_id
      },
      success(res) {
        console.log('推送成功', res)
        if (res.result.data[0]) {
          wx.cloud.callFunction({
            name: 'send_model_message',
            data: {
              formId: res.result.data[0].form_id,
              // receive_obj: res.result.data[0],
              findersData: that.data.postData,
              toLoster: res.result.data[0].userInfo
            },
            success(res) {
              console.log('模版消息', res)
            },
            fail(e) {
              console.log('模版消息失败', e)
            }
          })
        }
      },
      fail(res) {
        console.log('推送失败', res)
      }
    })
  }
})