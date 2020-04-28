// pages/buybook/buybook.js
import util from "../../utils/util.js"
import address from "../../utils/city.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buyInfo: {},
    bookimg: [],
    saleimg: [],
    commentList: [],
    contents: '',
    showInput: false,
    inputVal: '',
    headerArr: [],
    pingLunMsg: [],
    // 显示购物车页面
    showAddCar: true,
    // 显示加购物车还是购买标志位
    btn_checked: true,
    // input默认是1  
    num: 1,
    // 使用data数据对象设置样式名  
    minusStatus: 'disabled',
    addressMenuIsShow: false,
    provinces: [],
    citys: [],
    areas: [],
    areaInfo: '',
    value: [0, 0, 0],
    animationAddressMenu: {},
    change_flag: true,
    // 输入详细地址的值
    inputVal: '',
    // 输入详细地址控制显示与否
    detail_flag: false,
    dizhi_flag: false,
    telephone: '',
    postname:''
  },
  // 图片预览
  handleImagePreview: function() {
    var _this = this
    var images = []
    images.push(this.data.buyInfo.imgurl)
    wx.previewImage({
      current: images[0], //当前预览的图片
      urls: images //所有要预览的图片
    })
  },
  ImagePreview: function(e) {
    const idx = e.target.dataset.idx
    var images = []
    for (var i = 0; i < this.data.bookimg.length; i++) {
      images.push(this.data.bookimg[i].imgURl)
    }
    console.log(images)
    wx.previewImage({
      current: images[idx], //当前预览的图片
      urls: images, //所有要预览的图片
    })
  },

  // 点击复制联系方式
  copyText: function(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            wx.showToast({
              title: '微信号已复制,快去添加吧',
              icon: 'none'
            })
          }
        })
      }
    })
  },

  // 点击评论
  callsell: function() {
    this.setData({
      showInput: true
    })
  },
  // 得到输入的内容
  bindInputMsg: function(e) {
    this.setData({
      inputVal: e.detail.value
    })
  },
  // 显示加入购物车页面
  addcar: function() {
    if (this.data.buyInfo.booknum == 0) {
      wx.showToast({
        title: '库存不足，请联系卖家',
        icon: "none",
        duration: 1500,
        mask: true
      })
      return
    }
    this.setData({
      showAddCar: false,
      btn_checked: true
    })
  },
  // 关闭加入购物车页面
  close_addcar: function() {
    this.setData({
      showAddCar: true,
      dizhi_flag: false,
      detail_flag: false,
      areaInfo: ''
    })
  },
  // 点击加入购物车
  goAddCar: function() {
    var ordernum = this.data.num
    var orderBookId = this.data.buyInfo.bookid
    var orderTime = util.formatTime(new Date())
    var openid = app.globalData.openid
    var _this = this
    wx.request({
      url: app.globalData.baseURL + 'addCar',
      method: "post",
      data: {
        ordernum,
        orderBookId,
        openid,
        orderTime
      },
      success: function(res) {
        if (res.data.status === 200) {
          wx.showToast({
            title: '加入购物车成功',
            icon: "success",
            duration: 1500,
            mask: true,
            success: function() {
              _this.setData({
                showAddCar: true
              })
            }
          })
        }
      }
    })
  },
  // 控制选择地址的显示,点击该区域，出现选择内容
  change_area: function() {
    // 初始化动画变量
    var animation = wx.createAnimation({
      duration: 500,
      transformOrigin: "50% 50%",
      timingFunction: 'ease',
    })
    this.animation = animation;
    // 默认联动显示北京
    var id = address.provinces[0].id
    this.setData({
      provinces: address.provinces,
      citys: address.citys[id],
      areas: address.areas[address.citys[id][0].id],
      change_flag: false
    })
    // 如果已经显示，不在执行显示动画
    if (this.data.addressMenuIsShow) {
      return
    }
    // 执行显示动画
    this.startAddressAnimation(true)
  },
  // 得到输入的详细地址的值
  getDetail_dizhi: function(e) {
    this.setData({
      inputVal: e.detail.value
    })
  },
  getDetail_tel: function(e) {
    this.setData({
      telephone: e.detail.value
    })
  },
  // 得到输入的收件人姓名
  getDetail_name:function(e) {
    this.setData({
      postname: e.detail.value
    })
  },
  // 显示购买页面
  buyCar: function() {
    if (this.data.buyInfo.booknum == 0) {
      wx.showToast({
        title: '数量不足，请联系卖家',
        icon: "none",
        duration: 1500,
        mask: true
      })
      return
    }
    this.setData({
      showAddCar: false,
      btn_checked: false,
      dizhi_flag: true
    })
  },
  // 直接购买
  goBuyBook: function() {
    var inputContent = this.data.inputVal
    var areaInfo = this.data.areaInfo
    var telephone = this.data.telephone
    var postname = this.data.postname
    var _this = this
    // _this.setData({
    //    dizhi_flag:false,
    //    detail_flag: false
    // })
    if (inputContent === '' || areaInfo === '') {
      wx.showToast({
        title: '您有地址未填写完整！！！',
        icon: "none",
        duration: 1500,
        mask: true
      })
      return
    }
    if (postname === '') {
      wx.showToast({
        title: '请填写收件人姓名！',
        icon: "none",
        duration: 1500,
        mask: true
      })
      return
    }
    if (!(/^1[3456789]\d{9}$/.test(telephone))) {
      wx.showToast({
        title: '请填写正确的电话号码！',
        icon: "none",
        duration: 1500,
        mask: true
      })
      return
    }
    var openid = app.globalData.openid
    var publish_openid = _this.data.buyInfo.openid
    var bookid = this.data.buyInfo.bookid
    var buyBookNum = this.data.num
    var buyTime = util.formatTime(new Date())
    var adress = areaInfo + inputContent
    var spendPrice = buyBookNum * this.data.buyInfo.bookprice
    wx.showModal({
      title: '此仅为模拟操作！',
      content: '是否购买？本次需付款' + spendPrice + '元',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.baseURL + 'buybook',
            method: "post",
            data: {
              openid,
              bookid,
              buyBookNum,
              spendPrice,
              buyTime,
              adress,
              telephone,
              postname,
              publish_openid
            },
            success: function(res) {
              if (res.data.status === 200) {
                _this.setData({
                  showAddCar: true,
                  'buyInfo.booknum': _this.data.buyInfo.booknum - buyBookNum
                })
                _this.onLoad()
                wx.showToast({
                  title: '购买成功',
                  icon: "success",
                  duration: 1500,
                  mask: true
                })
              }
            },
            fail: function() {
              wx.showToast({
                title: '网络错误,请稍后再试',
                icon: "none",
                duration: 1500,
                mask: true
              })
            }
          })

        } else {
          console.log('取消购买')
        }
      },
      fail: function() {
        wx.showToast({
          title: '网络错误,请稍后再试',
          icon: "none",
          duration: 1500,
          mask: true
        })
      }
    })
  },
  /* 点击减号 */
  bindMinus: function() {
    var num = this.data.num;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 点击加号 */
  bindPlus: function() {
    var num = this.data.num;
    if (num < this.data.buyInfo.booknum) {
      // 不作过多考虑自增1  
      num++;
      // 只有大于一件的时候，才能normal状态，否则disable状态  
      var minusStatus = num < 1 ? 'disabled' : 'normal';
      // 将数值与状态写回  
      this.setData({
        num: num,
        minusStatus: minusStatus
      });
    } else {
      // 将数值与状态写回  
      this.setData({
        num: num
      });
      wx.showToast({
        title: '超出该书籍的数量',
        icon: "none"
      })
    }
  },
  /* 输入框事件 */
  bindManual: function(e) {
    var num = e.detail.value;
    // 将数值与状态写回  
    this.setData({
      num: num
    });
  },
  // 对输入内容进行操作
  sendMsg: function() {
    var searchcontent = this.data.inputVal
    var _this = this
    if (searchcontent === '') {
      return
    }
    wx.request({
      url: app.globalData.baseURL + 'index/pinglun',
      method: "post",
      data: {
        content: searchcontent,
        bookid: _this.data.buyInfo.bookid,
        openid: app.globalData.openid,
        sendtime: util.formatTime(new Date())
      },
      success: function(res) {
        wx.showToast({
          title: '评论成功',
          icon: 'success'
        })
        _this.onLoad()
      },
      fail: function(err) {
        wx.showToast({
          title: '服务器忙',
          image: '/images/error.png',
          duration: 1000,
          mask: true
        })
      },
      complete: function() {
        _this.setData({
          showInput: false
        })
      }
    })
  },

  // 从后台得到评论内容和头像昵称等
  getCommentListByBookId(bookId) {
    var _this = this
    wx.request({
      url: app.globalData.baseURL + 'findByBookId',
      data: {
        bookId
      },
      success: res => {
        console.log('haha', res)
        var arr = []
        for (var i = 0; i < res.data.result1.length; i++) {
          arr.push(i)
        }
        _this.setData({
          commentList: arr,
          headerArr: res.data.result2,
          pingLunMsg: res.data.result1
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
        buyInfo: data,
        contents: data.usertel
      })
      console.log(data)
    })
    wx.request({
      url: app.globalData.baseURL + 'bookimg',
      data: {
        bookid: _this.data.buyInfo.bookid,
        openid: _this.data.buyInfo.openid
      },
      success: function(res) {
        console.log('收到结果', res.data)
        _this.setData({
          bookimg: res.data.bookimg,
          saleimg: res.data.saleimg
        })
        console.log(res.data.bookimg)
      }
    })
    this.getCommentListByBookId(_this.data.buyInfo.bookid)
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
  onShareAppMessage: function(res) {
    var _this = this
    var book_id = this.data.buyInfo.bookid
    var book_title = this.data.buyInfo.bookname //获取产品标题
    var book_img = this.data.buyInfo.imgurl //产品图片
    if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: '一起来买' + book_title,
        path: app.globalData.baseURL + 'bookimg?bookid=' + book_id,
        imageUrl: book_img //不设置则默认为当前页面的截图
      }
    }
  },

  /*
  选择地点，级联省市区
  */
  // 执行动画
  startAddressAnimation: function(isShow) {
    var that = this
    if (isShow) {
      // vh是用来表示尺寸的单位，高度全屏是100vh
      that.animation.translateY(0 + 'vh').step()
    } else {
      that.animation.translateY(40 + 'vh').step()
    }
    that.setData({
      animationAddressMenu: that.animation.export(),
      addressMenuIsShow: isShow,
    })
  },
  // 点击地区选择取消按钮
  cityCancel: function(e) {
    this.startAddressAnimation(false)
    this.setData({
      change_flag: true,
      areaInfo: '',
      addressMenuIsShow: false
    })
  },
  // 点击地区选择确定按钮
  citySure: function(e) {
    var that = this
    var city = that.data.city
    var value = that.data.value
    that.startAddressAnimation(false)
    // 将选择的城市信息显示到输入框
    var areaInfo = that.data.provinces[value[0]].name + that.data.citys[value[1]].name + that.data.areas[value[2]].name
    that.setData({
      areaInfo: areaInfo,
      change_flag: true,
      addressMenuIsShow: false,
      detail_flag: true
    })
  },
  // 点击蒙版时取消组件的显示
  hideCitySelected: function(e) {
    this.startAddressAnimation(false)
  },
  // 处理省市县联动逻辑
  cityChange: function(e) {
    var value = e.detail.value
    var provinces = this.data.provinces
    var citys = this.data.citys
    var areas = this.data.areas
    var provinceNum = value[0]
    var cityNum = value[1]
    var countyNum = value[2]
    // 如果省份选择项和之前不一样，表示滑动了省份，此时市默认是省的第一组数据，
    if (this.data.value[0] != provinceNum) {
      var id = provinces[provinceNum].id
      this.setData({
        value: [provinceNum, 0, 0],
        citys: address.citys[id],
        areas: address.areas[address.citys[id][0].id],
      })
    } else if (this.data.value[1] != cityNum) {
      // 滑动选择了第二项数据，即市，此时区显示省市对应的第一组数据
      var id = citys[cityNum].id
      this.setData({
        value: [provinceNum, cityNum, 0],
        areas: address.areas[citys[cityNum].id],
      })
    } else {
      // 滑动选择了区
      this.setData({
        value: [provinceNum, cityNum, countyNum]
      })
    }
    console.log(this.data)
  }

})