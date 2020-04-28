// pages/sell/sell.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // bookMsg为书籍信息
    bookMsg: {},
    // qRCodeMsg为isbn编号
    qRCodeMsg: ''
  },
  // 扫码获取数据
  btnSaoma: function() {
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
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          //  没有授权，跳转到授权页面
          wx.navigateTo({
            url: '../button/button',
            success: function(res) {
              console.log('跳转到授权页面')
              res.eventChannel.emit('acceptDataFromOpenerPage', 'index')
            }
          })
        } else {
          wx.scanCode({ //扫描API
            success: function(res) {
              //console.log(res);    //输出回调信息
              _this.setData({
                qRCodeMsg: res.result
              });
              wx.request({
                url: 'https://api.jisuapi.com/isbn/query?appkey=0334b2c4abe9cb36&isbn=' + _this.data.qRCodeMsg,
                success: function(response) {
                  _this.setData({
                    bookMsg: response.data.result
                  });
                  _this.data.bookMsg.pageName = 'sell'
                  console.log(_this.data.bookMsg)
                  //  console.log(response.data.result)
                  wx.navigateTo({
                    url: '../bookmsg/bookmsg',
                    success: function(res1) {
                      // 通过eventChannel向被打开页面传送数据
                      res1.eventChannel.emit('acceptDataFromOpenerPage', {
                        data: _this.data.bookMsg
                      })
                    }
                  })
                }
              })
              wx.showToast({
                title: '成功',
                duration: 2000
              })
            },
            fail: function() {
              console.log('扫码失败 ')
            }
          })
        }
      }
    })
  },
  // 手动添加书籍信息
  btnAuto: function() {
    // console.log('手动添加')
    var _this = this;
    this.data.bookMsg.pageName = 'handAuto'
    if (wx.getStorageSync('status').status !== 0) {
      wx.showModal({
        title: '警告',
        content: '你的账号已被封禁，请联系管理员',
        success: function (res) {
        }
      })
      return
    }
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          //  没有授权，跳转到授权页面
          wx.navigateTo({
            url: '../button/button',
            success: function (res) {
              console.log('跳转到授权页面')
              res.eventChannel.emit('acceptDataFromOpenerPage', 'index')
            }
          })
        } else {
          wx.navigateTo({
            url: '../bookmsg/bookmsg',
            success: function (res) {
              // 通过eventChannel向被打开页面传送数据
              res.eventChannel.emit('acceptDataFromOpenerPage', {
                data: _this.data.bookMsg
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