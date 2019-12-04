import WxValidate from '../../../utils/validate.js'
import Toast from '../../../miniprogram_npm/vant-weapp/toast/toast'
import {
  debounce
} from '../../../utils/debounce.js'
import {
  ocrRequest
} from '../../../utils/face_ocr.js'

const app = getApp()
var type1_validate, type2_validate

// 表单验证
function initValidate() {
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
      required: '请输入丢失的地点'
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
      required: '请输入丢失的地点'
    },
    concat: {
      required: '请输入联系方式',
      // tel: '手机号格式错误'
    }
  })
}

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    hideAdd: false,
    modalStatus: false,
    date: new Date().format("yyyy-MM-dd"),
    end_time: new Date().format("yyyy-MM-dd"),
    img: null,
    multiIndex: [0, 0],
    multiArray: [
      ['卡证类', '非卡证类'],
      ['一卡通', '身份证', '学生证', '其他']
    ],
    typeArray: [
      ['一卡通', '身份证', '学生证', '其他'],
      ['电子', '书本', '生活', '其他']
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
      publish_type: 1,
      isrich: false,
      istop: false
    },
    possibleData: []
  },

  // 生成表单验证对象，检查是否选择学校
  onLoad: function(options) {
    app.checkIfSelectedSchool()
    initValidate()
  },

  // 检查卡是不是已经存在了，卡号和姓名必须都匹配上
  checkIfCardExist(data) {
    wx.showLoading({
      title: '检测匹配物品',
    })
    let that = this
    console.log(data)
    wx.cloud.callFunction({
      name: 'check_if_card_exist',
      data: {
        ...data,
        school_id: wx.getStorageSync('school_info').school_id
      },
      success: res => {
        console.log('卡证类检测res', res)
        if (res.result.check_result.data.length) {
          wx.hideLoading()
          that.setData({
            modalStatus: true,
            possibleData: res.result.check_result.data
          })
        } else {
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  },

  // 上传图片后先进行ai检测，如果有人脸提醒用户进行ai打马或者手动打马
  uploadImg: function() {
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: function(res) {
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
                wx.hideLoading()
                wx.showModal({
                  title: 'Ai检测提醒',
                  content: '未知错误，请稍后再试',
                })
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

  // 正式上传图片
  upload(fileName, img_url) {
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

  // 删除已上传图片
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

  // 切换分类
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

  // 更改日期
  DateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },

  // 提交表单，ai分词内容并筛选最佳匹配，按钮要防抖一下
  formSubmit: debounce(
    function(e) {
      let that = this
      let post_detail = e.detail.value
      console.log('post_detail', post_detail)
      let type_class = {
        first_type: post_detail.type_class[0],
        second_type: post_detail.type_class[1],
      }
      Object.assign(post_detail, type_class)
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

      //发送存储请求
      wx.cloud.callFunction({
        name: 'publish',
        data: {
          ...that.data.postData,
          img: that.data.img,
          user_id: wx.getStorageSync('openid'),
          school_id: wx.getStorageSync('school_info').school_id,
          form_id: e.detail.formId
        },
        success: function(res) {
          console.log(res)
          wx.hideLoading()
          wx.showToast({
            title: '发布成功',
            duration: 1500,
            success: () => {

              // 如果是卡证类，不调用AI，直接使用姓名和卡号去查询
              if (that.data.postData.first_type == 0) {
                that.checkIfCardExist({
                  nameKw: that.data.postData.card_name,
                  numKw: that.data.postData.card_number,
                })
              } else {
                // 非卡证类，拿到详情描述请求AI接口分词，结合物品名称和详情进行数据库查询
                let words = that.data.postData.name + '，' + that.data.postData.description
                that.divideWords(words)
              }
            }
          })
        },
        fail: console.error
      })
    }, 1000),

  // AI分词
  // 分词接口是GBK的，很麻烦，会乱码。主要发过去的也要gbk，最后咩办法了，只能用自己Java后台转了一下
  divideWords(words) {
    let that = this
    let url = 'https://www.mhyang.cn/ai/wordpos?word=';
    wx.request({
      url: url + words,
      success(res) {
        console.log(res.data.data)
        let data = res.data.data.mix_tokens
        let kw_arr = []
        for (let i = 0; i < data.length; i++) {
          if (data[i].pos_code == 1 || data[i].pos_code == 16) {
            kw_arr.push(data[i].word)
          }
        }
        kw_arr = Array.from(new Set(kw_arr))
        console.log(kw_arr)
        that.getPossible.bind(that)(kw_arr)
      },
      fail(err) {
        console.log(err)
      }
    })
  },

  // 拿分词去查询数据库
  getPossible(kw_arr) {
    wx.showLoading({
      title: '检测匹配物品',
    })
    let that = this
    wx.cloud.callFunction({
      name: 'get_possible_ai',
      data: {
        kw_arr,
        school_id: wx.getStorageSync('school_info').school_id,
        del_status: false
      },
      success(res) {
        console.log(res)
        if (res.result.search_result.length) {
          wx.hideLoading()
          that.setData({
            modalStatus: true,
            possibleData: res.result.search_result
          })
        } else {
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        }
      },
      fail(err) {
        console.log(err)
      }
    })
  },

  // 跳转到可能是我丢了的失物
  goToPossible(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/square/detail/detail?id=' + id,
    })
  },

  // 可能的丢失物品modal
  closeModal() {
    this.setData({
      modalStatus: false
    })
  }

})