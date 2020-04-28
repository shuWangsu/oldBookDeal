// pages/payall/payall.js
import util from "../../utils/util.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shouJianInfo: {},
    buyBookList: {}
  },
  getReceiver: function(e) {
    this.setData({
      'shouJianInfo.shouName': e.detail.value
    })
  },
  getTelphone: function(e) {
    this.setData({
      'shouJianInfo.tel': e.detail.value
    })
  },
  getAdress: function(e) {
    this.setData({
      'shouJianInfo.adress': e.detail.value
    })
  },
  // 提交信息
  submit: function() {
    var _this = this
    var list = []
    var j = 0
    if (this.data.shouJianInfo.shouName == null) {
      wx.showToast({
        title: '收件人不能为空',
        icon: "none",
        duration: 1500,
        mask: true
      })
      return
    }
    if (this.data.shouJianInfo.tel == null) {
      wx.showToast({
        title: '联系方式不能为空',
        icon: "none",
        duration: 1500,
        mask: true
      })
      return
    } else if (!(/^1[3456789]\d{9}$/.test(this.data.shouJianInfo.tel))) {
      wx.showToast({
        title: '请输入正确的电话号码',
        icon: "none",
        duration: 1500,
        mask: true
      })
      return
    }
    if (this.data.shouJianInfo.adress == null) {
      wx.showToast({
        title: '收件地址不能为空',
        icon: "none",
        duration: 1500,
        mask: true
      })
      return
    }
    // wx.setStorageSync('receiveInfo', _this.data.shouJianInfo)
    for (var i = 0; i < _this.data.buyBookList.buyList.length; i++) {
      if (_this.data.buyBookList.buyList[i] !== 0) {
        list[j] = _this.data.buyBookList.buyList[i]
        list[j].bookprice = _this.data.buyBookList.bookprice[i]
        list[j].public_openid = this.data.buyBookList.public_openid[i]
        list[j].buytime = util.formatTime(new Date())
        list[j].shouJianInfo = _this.data.shouJianInfo
      }
      j++
    }
    wx.showModal({
      title: '警告',
      content: '需支付' + _this.data.buyBookList.totalPrice + '元',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.baseURL + 'buyallbook',
            method: "post",
            data: {
              list
            },
            success: function(res) {
              if (res.data.status === 502) {
                wx.showToast({
                  title: '购买成功',
                  icon: "success",
                  duration: 1500,
                  mask: true,
                  success:function(res){
                    wx.navigateBack({ delta: 1 })
                  }
                })
              }
            },
            fail:function(err) {
              wx.showToast({
                title: '网络错误',
                icon:"none",
                duration:1500,
                mask:true
              })
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this
    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      _this.setData({
        buyBookList: data,
      })
      console.log(data)
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

  }
})