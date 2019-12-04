App({
  onLaunch: function() {

    // 获取设备尺寸，生成自适应顶部导航栏
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })

    // 初始化云开发能力
    wx.cloud.init({
      env: 'dxq-i6tin',
      traceUser: true
    })

    // 获取openid并写入缓存
    wx.cloud.callFunction({
      name: 'login',
      success: function(res) {
        let openid = wx.getStorageSync('openid')
        console.log(openid)
        if (!openid) {
          wx.setStorageSync('openid', res.result.openid)
        }
      },
      fail: console.error
    })

    Date.prototype.format = function(fmt) {
      var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
      }
      return fmt;
    }
  },
  globalData: {
    _publishModal: false
  },

  // 进入后检测学校是否已经选择
  checkIfSelectedSchool() {
    let school_info = wx.getStorageSync('school_info')
    if (!school_info) {
      wx.showModal({
        title: '警告',
        content: '请先选择你的学校',
        confirmColor: '#AE81F7',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/index/school/school'
            })
          } else if (res.cancel) {
            console.log('取消')
          }
        }
      })
    }
    return
  }
})