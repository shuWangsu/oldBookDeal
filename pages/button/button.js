const app = getApp()
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: true
  },

  onLoad: function () {

  },

  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var _this = this;
      // 获取到用户的信息了，打印到控制台上看下
      // console.log("用户的信息如下：");
      console.log(e.detail.userInfo);
      app.globalData.userInfo = e.detail.userInfo
      var userinfo = e.detail.userInfo
      wx.showLoading({
        title: '登录中...',
        success:function(res) {
          wx.login({
            success(res) {
              if (res.code) {
                //发起网络请求
                wx.request({
                  url: app.globalData.baseURL + 'login',
                  data: {
                    code: res.code
                  },
                  success: function (res) {
                    app.globalData.openid = res.data.openid
                    wx.setStorageSync('login', res.data)
                    wx.request({
                      url: app.globalData.baseURL + 'authorization',
                      method: "post",
                      data: {
                        photo: userinfo.avatarUrl,
                        nickname: userinfo.nickName,
                        openid: res.data.openid,
                        gender: userinfo.gender
                      },
                      success: function (res) {
                        wx.showToast({
                          title: '登录成功',
                          duration:1500,
                          mask: true
                        })
                      },
                      fail:function(err) {
                        wx.showToast({
                          title: '登录失败',
                          duration: 1500,
                          mask: true
                        })
                      }
                    })
                  },
                  fail: function (err) {
                    wx.showToast({
                      title: '登录失败',
                      duration: 1500,
                      mask: true
                    })
                  }
                })
              } else {
                wx.showToast({
                  title: '登录失败',
                  duration: 1500,
                  mask: true
                })
              }
            },
            fail:function(err) {
              wx.showToast({
                title: '服务器忙',
                image: '/images/error.png',
                duration: 1000,
                mask: true
              })
            },
            complete:function(){
              wx.navigateBack({
                delta: 1 
              })
              wx.hideLoading()
            }
          })
        }
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，可能会对小程序的使用造成影响，请授权之后再进入',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  }
})