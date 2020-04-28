// pages/mysubmit/mysubmit.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    submitList: [],
    bottom_flag: true,
    bottom_flag1: false,
    bottom_flag2: false,
    bottom_flag3:false,
    bookdata: {},
    fahuolist: {},
    fahuoarr: []
  },
  //点击正在出售按钮
  onSale: function() {
    this.setData({
      bottom_flag: true,
      bottom_flag1: false,
      bottom_flag2: false,
      bottom_flag3: false
    })
  },
  // 点击已经售罄按钮
  offSale: function() {
    this.setData({
      bottom_flag1: true,
      bottom_flag: false,
      bottom_flag2: false,
      bottom_flag3: false,
      red_flag:false
    })
  },
  // 点击查看发货提醒
  saleRemind: function() {
    this.setData({
      bottom_flag: false,
      bottom_flag1: false,
      bottom_flag2: true,
      bottom_flag3: false
    })
    var _this = this
    var arr = []
    wx.request({
      url: app.globalData.baseURL + 'remindfahuo',
      data: {
        openid: wx.getStorageSync('login').openid
      },
      success: function(res) {
        for (var i = 0; i < res.data.result1.length; i++) {
          arr.push(i)
        }
        _this.setData({
          fahuolist: res.data,
          fahuoarr: arr
        })
        console.log('11111',res.data)

      },
      fail: function(err) {

      }
    })
  },
  // 点击查看发货详情
  deliveryDetails:function() {
    this.setData({
      bottom_flag: false,
      bottom_flag1: false,
      bottom_flag2: false,
      bottom_flag3: true
    })
    var _this = this
    var arr = []
    wx.request({
      url: app.globalData.baseURL + 'deliveryDetails',
      data: {
        openid: wx.getStorageSync('login').openid
      },
      success: function (res) {
        for (var i = 0; i < res.data.result1.length; i++) {
          arr.push(i)
        }
        _this.setData({
          fahuolist: res.data,
          fahuoarr: arr
        })

      },
      fail: function (err) {

      }
    })
  },
  // 取消发货
  cancelFaHuo: function(e) {
    var index = e.currentTarget.dataset.index
    var _this = this
    var arr = []
    var arr1 = []
    var arr2 = []
    wx.showModal({
      title: '警告',
      content: '我们将通知购买者，是否取消发货？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.baseURL + 'cancelfahuo',
            method: "post",
            data: {
              buyBookNum: _this.data.fahuolist.result2[index].buyBookNum,
              orderNumber: _this.data.fahuolist.result2[index].orderNumber,
              bookid: _this.data.fahuolist.result2[index].bookid
            },
            success: function(res) {
              if (res.data.status === 502) {
                for (var i = 0; i < _this.data.fahuolist.result2.length; i++) {
                  if (index !== i) {
                    arr.push(_this.data.fahuolist.result2[i])
                    arr1.push(_this.data.fahuolist.result1[i])
                  }
                }
                for (var j = 0; j < _this.data.fahuolist.result2.length - 1; j++) {
                  arr2.push(j)
                }
                _this.setData({
                  'fahuolist.result1': arr1,
                  'fahuolist.result2': arr,
                  fahuoarr: arr2,
                  // 'app.globalData.newsflag': app.globalData.newsflag - 1
                })
                app.globalData.newsflag = app.globalData.newsflag - 1
                if (_this.data.fahuolist.result1.length == 0) {
                  _this.setData({
                    red_flag: false
                  })
                }
                wx.showToast({
                  title: '取消发货成功',
                  duration:1500,
                  mask:true
                })
              }
            },
            fail: function(err) {
              wx.showToast({
                title: '未知错误',
                icon:"none",
                duration:1500,
                mask:true
              })
            }
          })
        }
        if (res.cancel) {
          
        }
      }
    })
  },
  // 确定发货
  confirmFaHuo: function(e) {
    var index = e.currentTarget.dataset.index
    var _this = this
    var arr = []
    var arr1 = []
    var arr2 = []
    wx.showModal({
      title: '警告',
      content: '我们将通知购买者，是否发货？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.baseURL + 'confirmfahuo',
            method: "post",
            data: {
              orderNumber: _this.data.fahuolist.result2[index].orderNumber,
              bookid: _this.data.fahuolist.result2[index].bookid
            },
            success: function (res) {
              if (res.data.status === 502) {
                for (var i = 0; i < _this.data.fahuolist.result2.length; i++) {
                  if (index !== i) {
                    arr.push(_this.data.fahuolist.result2[i])
                    arr1.push(_this.data.fahuolist.result1[i])
                  }
                }
                for (var j = 0; j < _this.data.fahuolist.result2.length - 1; j++) {
                  arr2.push(j)
                }
                _this.setData({
                  'fahuolist.result1': arr1,
                  'fahuolist.result2': arr,
                  fahuoarr: arr2,
                  // 'app.globalData.newsflag': app.globalData.newsflag - 1
                })
                app.globalData.newsflag = app.globalData.newsflag -1
                if(_this.data.fahuolist.result1.length == 0) {
                  _this.setData({
                    red_flag:false
                  })
                }
                wx.showToast({
                  title: '确认发货成功',
                  duration: 1500,
                  mask: true
                })
              }
            },
            fail: function (err) {
              wx.showToast({
                title: '未知错误',
                icon: "none",
                duration: 1500,
                mask: true
              })
            }
          })
        }
        if (res.cancel) {
          console.log('没有')
        }
      }
    })
  },
  // 查看购买人的地址信息等
  checkCustomer: function(e) {
    var index = e.currentTarget.dataset.index
    var _this = this
    wx.navigateTo({
      url: '../customermsg/customermsg',
      success: function(res) {
        console.log('跳转到查看购买者的信息页面')
        res.eventChannel.emit('acceptDataFromOpenerPage', _this.data.fahuolist.result2[index])
      }
    })
  },
  // 下架发布的书籍
  deleteList: function(e) {
    var _this = this
    var index = e.currentTarget.dataset.index
    var subList = []
    wx.showModal({
      title: '警告',
      content: '是否下架该书籍?',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.baseURL + 'deletesubmitbook',
            data: {
              bookid: _this.data.submitList[index].bookid
            },
            success: function(res) {
              for (var i = 0; i < _this.data.submitList.length; i++) {
                if (index !== i) {
                  subList.push(_this.data.submitList[i])
                }
              }
              _this.setData({
                submitList: subList
              })
            },
            fail: function(err) {

            }
          })
        } else if (res.cancel) {

        }
      }
    })
  },

  // 编辑发布的书籍
  edit: function(e) {
    var _this = this
    var index = e.currentTarget.dataset.index
    this.setData({
      'bookdata.pageName': 'mysubmit',
      'bookdata.bookmsg': this.data.submitList[index]
    })
    wx.navigateTo({
      url: '../bookmsg/bookmsg',
      success: function(res) {
        console.log('跳转到编辑页面')
        res.eventChannel.emit('acceptDataFromOpenerPage', _this.data.bookdata)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var openid = wx.getStorageSync('login').openid
    var _this = this
    if (app.globalData.newsflag !== 0) {
      _this.setData({
        red_flag:true
      })
    }
    console.log(app.globalData.newsflag)
    wx.request({
      url: app.globalData.baseURL + 'mysubmit',
      data: {
        openid
      },
      success: function(res) {
        _this.setData({
          submitList: res.data
        })
      },
      fail: function(err) {
        wx.showToast({
          title: '网络错误',
          icon: "none",
          duration: 1500,
          mask: true
        })
      }
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
    this.onLoad()
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