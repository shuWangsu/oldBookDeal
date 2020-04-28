// pages/center/center.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    newsflag:0
  },

  // 点击查看自己发布的内容
  mySubmit:function() {
    var openid = wx.getStorageSync('login').openid
    var _this = this
    if (wx.getStorageSync('status').status !== 0) {
      wx.showModal({
        title: '警告',
        content: '你的账号已被封禁，请联系管理员',
        success: function (res) {
        }
      })
      return
    }
    wx.navigateTo({
      url: '../mysubmit/mysubmit',
      success: function (res) {
        console.log('跳转到查看我的发布页面')
        res.eventChannel.emit('acceptDataFromOpenerPage', 'center')
      }
    })
  },
  // 点击查看购物车
  myShoppingCar:function() {
    if (wx.getStorageSync('status').status !== 0) {
      wx.showModal({
        title: '警告',
        content: '你的账号已被封禁，请联系管理员',
        success: function (res) {
        }
      })
      return
    }
    wx.navigateTo({
      url: '../myshoppingcar/myshoppingcar',
      success: function (res) {
        console.log('跳转到查看我的购物车页面')
        res.eventChannel.emit('acceptDataFromOpenerPage', 'center')
      }
    })
  },
  // 点击查看购买记录
  buyList:function() {
    if (wx.getStorageSync('status').status !== 0) {
      wx.showModal({
        title: '警告',
        content: '你的账号已被封禁，请联系管理员',
        success: function (res) {
        }
      })
      return
    }
    wx.request({
      url: app.globalData.baseURL+'buyhistory',
      method:"post",
      data:{
        openid:wx.getStorageSync('login').openid
      },
      success:function(res) {
        wx.navigateTo({
          url: '../buyrecords/buyrecords',
          success: function (res1) {
            console.log('跳转到查看购买记录页面')
            res1.eventChannel.emit('acceptDataFromOpenerPage', res.data)
          }
        })
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
  },
  // 点击查看关于我们
  aboutUs:function() {
    wx.navigateTo({
      url: '../aboutus/aboutus',
      success: function (res) {
        console.log('跳转到查看关于我们页面')
        res.eventChannel.emit('acceptDataFromOpenerPage', 'aboutus')
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
   if(app.globalData.newsflag === 0) {
     wx.hideTabBarRedDot({
       index: 2
     })
   }
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          //  没有授权，跳转到授权页面
          wx.navigateTo({
            url: '../button/button',
            success: function (res) {
              console.log('跳转到授权页面')
              res.eventChannel.emit('acceptDataFromOpenerPage', 'center')
            }
          })
        } else {
          _this.setData({
            userInfo: app.globalData.userInfo,
            newsflag: app.globalData.newsflag
          })
        }
      }
    })
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
    this.onLoad()
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

  }
})