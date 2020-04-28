//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    // 被点击首页导航菜单栏的索引
    currentIndexNav: 0,
    // 书籍类别
    book_class: [],
    // 书籍信息
    bookInfo: [],
    // 搜索框输入的内容
    inputVal: ''
  },
  // 顶部滑动条内容的点击事件
  clickitem: function(e) {
    // console.log('点击了' + (e.currentTarget.dataset.index))
    var _this = this
    this.setData({
      currentIndexNav: e.currentTarget.dataset.index
    })
    if (e.currentTarget.dataset.index !== 0) {
      wx.showLoading({
        title: '加载中',
        success: function() {
          wx.request({
            url: app.globalData.baseURL + 'changeclass',
            method: 'post',
            data: {
              bookclass: e.currentTarget.dataset.index + 1
            },
            success: function(res) {
              _this.setData({
                bookInfo: res.data.result1
              })
            },
            fail: function(res) {
              wx.showToast({
                title: '服务器忙',
                image: '/images/error.png',
                duration: 1000,
                mask: true
              })
            },
            complete: function() {
              wx.hideLoading()
            }
          })
        }
      })
    } else {
      this.onLoad()
    }
  },
  // 获取搜索栏中的内容
  getsearchvalue: function(e) {
    this.setData({
      inputVal: e.detail.value
    })
  },
  // 执行搜索操作
  gosearch: function() {
    var searchcontent = this.data.inputVal
    var _this = this
    if (searchcontent === '') {
      return
    }
    wx.request({
      url: app.globalData.baseURL + 'index/search',
      data: {
        content: searchcontent
      },
      success: function(res) {
        if (res.data.result1.length == 0) {
          wx.showToast({
            title: '找不到您想要的书籍',
            icon: 'none',
            duration: 1000,
            mask: true
          })
          return
        }
        _this.setData({
          bookInfo: res.data.result1
        })
      },
      fail: function(err) {
        wx.showToast({
          title: '服务器忙',
          image: '/images/error.png',
          duration: 1000,
          mask: true
        })
      }
    })
  },
  //点击进入购买的页面
  goBuyBook: function(e) {
    // var buyId = e.currentTarget.dataset.index
    var buyId = e.currentTarget.dataset.index
    var _this = this
    wx.getSetting({
      success: res => {
        if (wx.getStorageSync('status').status !== 0) {
          wx.showModal({
            title: '警告',
            content: '你的账号已被封禁，请联系管理员',
            success:function(res) {
            }
          })
          return
        }
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
            url: '../buybook/buybook',
            success: function (res) {
              console.log('跳转到购买页面')
              res.eventChannel.emit('acceptDataFromOpenerPage', _this.data.bookInfo[buyId])
            }
          })
        }
      }
    })

  },
  onLoad: function() {
    // console.log(app.globalData.userInfo)
    var _this = this
    wx.request({
      url: app.globalData.baseURL + 'index',
      success: function(res) {
        _this.setData({
          book_class: res.data.result2,
          bookInfo: res.data.result1,
          currentIndexNav: 0
        })
        var classArr = res.data.result2.slice(1)
        wx.setStorageSync("bookclass", classArr)
        app.globalData.newsflag=0
        for (var i = 0; i < res.data.result1.length; i++) {
          if (res.data.result1[i].openid === wx.getStorageSync('login').openid){
            app.globalData.newsflag += res.data.result1[i].newsflag
          }
        }
        if (app.globalData.newsflag !== 0){
          wx.showTabBarRedDot({
            index:2
          })
        }
        console.log(res.data)
      }
    })
    var asyncFunc = function (openid) {
      return new Promise(function (resolve) {
        wx.request({
          url: app.globalData.baseURL + 'getstatus',
          data:{openid},
          success:function(res){
            resolve(res)
          }
        })
      })
    }
    const asyncDeal = async function () {
      const openid = wx.getStorageSync('login').openid
      const res = await asyncFunc(openid)
      wx.setStorageSync('status', res.data[0])
    }
    asyncDeal()
  },
  onShow: function() {
    this.onLoad()
    console.log('刷新页面')
  },
  // 下拉刷新
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onLoad()
    setTimeout(function() {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000)
  }
})