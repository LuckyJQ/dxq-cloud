import { participle} from '../../utils/participle.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  divideWords(){
    let that = this
    let url = 'https://www.mhyang.cn/ai/wordpos?word=';
    wx.request({
      url: url +"在食堂丢失一部黑色iphone手机，在食堂丢失一部黑色iphone手机",
      success(res){
        console.log(res.data.data)
        let data = res.data.data.mix_tokens
        let kw_arr = []
        for(let i =0; i < data.length;i++){
          if (data[i].pos_code == 1 || data[i].pos_code == 16){
            kw_arr.push(data[i].word)
          }
        }
        kw_arr = Array.from(new Set(kw_arr))
        console.log(kw_arr)
        that.getPossible(kw_arr)
      },
      fail(err){
        console.log(err)
      }
    })
  },


  getPossible(kw_arr){
    wx.cloud.callFunction({
      name: 'get_search_admin',
      data: {
        kw_arr,
        school_id: wx.getStorageSync('school_info').school_id,
        del_status: false
      },
      success(res){
        console.log(res)
      },
      fail(err){
        console.log(err)
      }
    })
  }
  
})