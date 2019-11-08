Page({

  getFormid(e){
    console.log('formid', e.detail.formId)
    this.setData({
      formid: e.detail.formId
    })
  },

  sendMsg(){
    let formid = this.data.formid
    wx.cloud.callFunction({
      name: 'push0524',
      data: {
        lost_or_find_name: '沈健祺',
        card_name: '沈健祺',
        card_number: '19151213530',
        school_id: wx.getStorageSync('school_info').school_id
      },
      success(res){
        console.log('推送成功', res)
        wx.cloud.callFunction({
          name: 'send_model_message',
          data: {
            formId: formid,
            receive_obj: res.result.data[0]
          },
          success(res){
            console.log('模版消息',res)
          },
          fail(e){
            console.log('模版消息失败',e)
          }
        })
      },
      fail(res) {
        console.log('推送失败',res)
      }
    })
  }
})