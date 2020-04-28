// pages/myshoppingcar/myshoppingcar.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shoppingcarList: {},
    shoppingcarArr: [],
    bookPrice: [],
    // 使用data数据对象设置样式名  
    minusStatus: 'disabled',
    carts: [], //购物车列表,
    selectAllStatus: false, //全选标志
    totalPrice: 0, //总价
    buyList:[], //购买列表
    public_openid:[], //发布人的openid
    bookprice1:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this
    var arr = []
    var arr1 = []
    var carts = []
    var buyList = []
    var public_openid = []
    var bookprice1 = []
    wx.request({
      url: app.globalData.baseURL + 'myshoppingcar',
      data: {
        openid: wx.getStorageSync('login').openid
      },
      success: function(res) {
        for (var i = 0; i < res.data.result1.length; i++) {
          var price = res.data.result1[i][0].bookprice * res.data.result2[i].order_num
          carts.push(false)
          buyList.push(0)
          public_openid.push(0)
          arr1.push(price)
          arr.push(i)
          bookprice1.push(0)
        }
        _this.setData({
          shoppingcarList: res.data,
          shoppingcarArr: arr,
          bookPrice: arr1,
          carts,
          buyList,
          public_openid,
          bookprice1
        })
        console.log(res.data)
      },
      fail: function(err) {

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

  },
  /* 点击减号 */
  bindMinus: function(e) {
    var index = e.currentTarget.dataset.index
    var num = this.data.shoppingcarList.result2[index].order_num;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    var price = this.data.shoppingcarList.result1[index][0].bookprice * num
    // 将数值与状态写回  
    this.setData({
      [`shoppingcarList.result2[${index}].order_num`]: num,
      minusStatus: minusStatus,
      [`bookPrice[${index}]`]: price
    })
    this.getTotalPrice()
  },
  /* 点击加号 */
  bindPlus: function(e) {
    var index = e.currentTarget.dataset.index
    var num = this.data.shoppingcarList.result2[index].order_num;
    if (num < this.data.shoppingcarList.result1[index][0].booknum) {
      // 不作过多考虑自增1  
      num++;
      // 只有大于一件的时候，才能normal状态，否则disable状态  
      var minusStatus = num < 1 ? 'disabled' : 'normal';
      var price = this.data.shoppingcarList.result1[index][0].bookprice * num
      // 将数值与状态写回  
      this.setData({
        [`shoppingcarList.result2[${index}].order_num`]: num,
        minusStatus: minusStatus,
        [`bookPrice[${index}]`]: price
      });
    } else {
      // 将数值与状态写回  
      this.setData({
        [`shoppingcarList.result2[${index}].order_num`]: num,
      });
      wx.showToast({
        title: '超出该书籍的数量',
        icon: "none"
      })
    }
    this.getTotalPrice()
  },
  /* 输入框事件 */
  bindManual: function(e) {
    var num = e.detail.value;
    // 将数值与状态写回  
    this.setData({
      num: num
    });
  },
  // 选择书本
  selectList: function(e) {
    var index = e.currentTarget.dataset.index
    var _this = this
    let carts = _this.data.carts // 获取购物车列表
    const selected = carts[index]
    var selectAllStatus = _this.data.selectAllStatus
    carts[index] = !selected // 改变状态
    _this.setData({
      carts: carts
    })
    if(carts[index] == true) {
      _this.data.buyList[index]=_this.data.shoppingcarList.result2[index]
      _this.data.public_openid[index] = _this.data.shoppingcarList.result1[index][0].openid
      _this.data.bookprice1[index] = _this.data.bookPrice[index]
    }
    if (carts[index] == false) {
      _this.data.buyList[index] = 0
      _this.data.public_openid[index]= 0
      _this.data.bookprice1[index] = 0
    }
    console.log(_this.data.buyList)
    var j = 0
    for (var i = 0; i < _this.data.shoppingcarArr.length; i++) {
      if (_this.data.carts[i] == true) {
        j++;
      }
    }
    if (j == _this.data.shoppingcarArr.length) {
      _this.setData({
        selectAllStatus: true,
      })
    } else {
      _this.setData({
        selectAllStatus: false,
      })
    }
    this.getTotalPrice()
  },
  // 全选
  selectAll: function() {
    var _this = this
    var carts = _this.data.carts
    var selectAllStatus = _this.data.selectAllStatus
    selectAllStatus = !selectAllStatus
    for (var i = 0; i < _this.data.shoppingcarArr.length; i++) {
      carts[i] = selectAllStatus
    }
    _this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    })
    if (selectAllStatus == true) {
      for(var i=0;i<_this.data.shoppingcarArr.length;i++){
        _this.data.buyList[i] = _this.data.shoppingcarList.result2[i]
        _this.data.public_openid[i] = _this.data.shoppingcarList.result1[i][0].openid
        _this.data.bookprice1[i] = _this.data.bookPrice[i]
      }
    }else {
      for (var i = 0; i < _this.data.shoppingcarArr.length; i++) {
        _this.data.buyList[i] = 0
        _this.data.public_openid[i] = 0
        _this.data.bookprice1[i] = 0
      }
    }
    console.log(_this.data.buyList)
    this.getTotalPrice()
  },
  // 算总的价格
  getTotalPrice() {
    let carts = this.data.carts; // 获取购物车列表
    let bookPrice = this.data.shoppingcarList.result1
    let num = this.data.shoppingcarList.result2
    let total = 0.00
    for (let i = 0; i < carts.length; i++) { // 循环列表得到每个数据
      if (carts[i] == true) { // 判断选中才会计算价格
        total += bookPrice[i][0].bookprice * num[i].order_num // 所有价格加起来
      }
    }
    this.setData({ // 最后赋值到data中渲染到页面
      totalPrice: total.toFixed(2) //保留小数后面2两位
    });
  },
  // 删除购物车里面的书
  deleteList: function(e) {
    var index = e.currentTarget.dataset.index
    var _this = this
    wx.showModal({
      title: '警告',
      content: '是否删除该书籍?',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.baseURL + 'removebook',
            data: {
              id: _this.data.shoppingcarList.result2[index].id
            },
            success: function(res) {
              if (res.data.status == 502) {
                wx.showToast({
                  title: '删除成功',
                  icon: "success",
                  duration: 1500,
                  mask: true
                })
                _this.onLoad()
              } else {
                wx.showToast({
                  title: '未知错误',
                  icon: "none",
                  duration: 1500,
                  mask: true
                })
              }
            },
            fail: function(err) {
              wx.showToast({
                title: err,
                icon: "none",
                duration: 1500,
                mask: true
              })
            }
          })
        }
        if (res.cancel) {

        }
      }
    })
  },
  // 前往书籍详情页面
  goBookInfo: function(e) {
    var index = e.currentTarget.dataset.index
    var _this = this
    wx.navigateTo({
      url: '../buybook/buybook',
      success: function(res) {
        console.log('跳转到购买页面')
        res.eventChannel.emit('acceptDataFromOpenerPage', _this.data.shoppingcarList.result1[index][0])
      }
    })
  },
  // 前往购买书籍
  toBuy:function() {
    var j=0
    var payData = {}
    for(var i=0;i<this.data.shoppingcarArr.length;i++) {
      if(this.data.carts[i] == false){
        j++;
      }
    }
    if (j == this.data.shoppingcarArr.length) {
      wx.showToast({
        title: '还未选择购买书籍',
        icon:"none",
        duration:1500,
        mask:true
      })
      return
    }
    payData.buyList = this.data.buyList
    payData.totalPrice = this.data.totalPrice
    payData.public_openid = this.data.public_openid
    payData.bookprice = this.data.bookPrice
    wx.navigateTo({
      url: '../payall/payall',
      success: function (res) {
        console.log('跳转到填写地址页面')
        res.eventChannel.emit('acceptDataFromOpenerPage', payData)
      }
    })
  }
})