// pages/buyrecords/buyrecords.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    records: [],
    arr: [],
    dingdanList: [],
    bottom_flag:true,
    bottom_flag1:false,
    bottom_flag2:false
  },
  // 异步函数
  asyncFunc: function(i) {
    var _this = this
    return new Promise(function(resolve, reject) {
      wx.request({
        url: app.globalData.baseURL + 'findbookbybookid',
        method: "post",
        data: {
          bookid: _this.data.records[i].bookid
        },
        success: function(res) {
          resolve(res)
        },
        fail: function(err) {
          reject(err)
        }
      })
    })
  },
  asyncDeal: async function() {
    var arr2 = []
    for (var i = 0; i < this.data.records.length; i++) {
      let res = await this.asyncFunc(i)
      arr2.push(res.data)
    }
    this.setData({
      arr: arr2
    })
  },
  // 删除购买列表
  deleteList: function(e) {
    var index = e.currentTarget.dataset.index
    var bookNumber = this.data.records[index].orderNumber
    var _this = this
    wx.request({
      url: app.globalData.baseURL + 'delbuyhistory',
      data: {
        bookNumber
      },
      success: function(res) {
        var records1 = []
        var arr3 = []
        var arr4 = []
        for (var i = 0; i < _this.data.records.length; i++) {
          if (index !== i) {
            records1.push(_this.data.records[i])
            arr3.push(_this.data.arr[i])
          }
        }
        for (var i = 0; i < _this.data.records.length-1; i++) {
          arr4.push(i)
        }
        _this.setData({
          records: records1,
          arr: arr3,
          dingdanList:arr4
        })
      },
      fail: function(err) {
        wx.showToast({
          title: '网络错误',
          icon:"none"
        })
      }
    })
  },

  // 查看未发货的书籍列表
  noGoods:function() {
    var _this = this
    _this.setData({
      bottom_flag:true,
      bottom_flag1:false,
      bottom_flag2:false
    })
  },

  // 查看已经发货的书籍列表
  onSent: function () {
    var _this = this
    _this.setData({
      bottom_flag: false,
      bottom_flag1: true,
      bottom_flag2:false
    })
  },

  // 查看卖家拒绝发货的书籍
  refuseSent:function() {
    var _this = this
    _this.setData({
      bottom_flag: false,
      bottom_flag1: false,
      bottom_flag2:true
    })
  },

  // 弹出等待卖家发货的消息
  waitFaHuo:function() {
    wx.showToast({
      title: '等待卖家发货中。。。',
      icon:"none",
      duration:1500,
      mask:true
    })
  },
  // 赋值卖家联系方式
  copyText:function(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '联系方式已复制,快添加吧',
              icon: 'none',
              duration:1500,
              mask:true
            })
          }
        })
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
        records: data
      })
      console.log(data)
    })
    this.asyncDeal()
    var arr1 = []
    for (var i = 0; i < this.data.records.length; i++) {
      arr1.push(i)
    }
    this.setData({
      dingdanList: arr1
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