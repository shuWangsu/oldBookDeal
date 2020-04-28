//app.js
App({

  globalData: {
    userInfo: null,
    baseURL:'http://127.0.0.1:3000/',
    openid:'',
    newsflag:0,
    status:true
  },
  onLaunch: function () {
    var _this = this
    // 登录 
    wx.login({
      success(res) {
        // console.log(res.code)
        if (res.code) {
          //发起网络请求
          wx.request({
            url: _this.globalData.baseURL+'login',
            data: {
              code: res.code
            },
            success: function (res) {
              _this.globalData.openid=res.data.openid
              wx.setStorageSync('login', res.data)
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        // console.log(1)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          // console.log(res)
          // console.log(2)
          wx.getUserInfo({
            success: res => {
              // console.log(res)
              // 可以将 res 发送给后台解码出 unionId
              // console.log(3)
              _this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (_this.userInfoReadyCallback) {
                _this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  }
})