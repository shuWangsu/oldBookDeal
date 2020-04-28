// pages/bookmsg/bookmsg.js
import WxValidate from "../../utils/WxValidate";
import util from "../../utils/util.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookmsg: {}, //书籍信息
    buttons: [{
      id: 1,
      name: '垃圾成色'
    }, {
      id: 2,
      name: '五成新'
    }, {
      id: 3,
      name: '七成新'
    }, {
      id: 4,
      name: '九成新'
    }],
    images: [], //上传的图片地址
    dizhi: [],
    openid: '',
    buttonid: 3, //书籍成色
    selectArray: [], // 种类信息 用于给 select 组件传值  
    bookclass: '', //书籍种类,
    book_edit: {} //从发布页面到编辑页面
  },
  // 输入数量控制
  handleInput(e) {
    let value = this.validateNumber(e.detail.value)
    this.setData({
      value
    })
  },
  validateNumber(val) {
    return val.replace(/\D/g, '')
  },
  // 获取选择的是哪个按钮
  radioButtonTap: function(e) {
    let id = e.currentTarget.dataset.id
    console.log(id)
    for (let i = 0; i < this.data.buttons.length; i++) {
      if (this.data.buttons[i].id == id) {
        //当前点击的位置为true即选中
        this.data.buttons[i].checked = true;
      } else {
        //其他的位置为false
        this.data.buttons[i].checked = false;
      }
    }
    this.setData({
      buttons: this.data.buttons,
      buttonid: id
    })
  },
  getKind: function(e) {
    this.setData({
      bookclass: e.detail.classId
    })
  },
  // 添加图片
  chooseImage(e) {
    // console.log('被点击啦')
    wx.chooseImage({
      sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 1000,
          success: function(ress) {
            console.log('成功加载动画');
          }
        })
        const images = this.data.images.concat(res.tempFilePaths)
        // 限制最多只能留下3张照片
        const images1 = images.length <= 3 ? images : images.slice(0, 3)
        this.setData({
          images: images1
        })
      }
    })
  },
  // 移除图片
  removeImage(e) {
    var that = this;
    var images = that.data.images;
    // 获取要删除的第几张图片的下标
    const idx = e.currentTarget.dataset.idx
    // splice  第一个参数是下表值  第二个参数是删除的数量
    images.splice(idx, 1)
    this.setData({
      images: images
    })
  },
  // 图片预览
  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images
    wx.previewImage({
      current: images[idx], //当前预览的图片
      urls: images, //所有要预览的图片
    })
  },
  // form表单提交
  formSubmit: function(e) {
    var _this = this
    const date = new Date()
    if (!_this.data.book_edit.pageName) {
      if (_this.data.bookmsg.data.pageName === 'sell') {
        e.detail.value.book_author = this.data.bookmsg.data.author
        e.detail.value.book_name = this.data.bookmsg.data.title
        e.detail.value.imgurl = this.data.bookmsg.data.pic
        e.detail.value.pageName = this.data.bookmsg.data.pageName
        e.detail.value.originalprice = this.data.bookmsg.data.price
        e.detail.value.publisher = this.data.bookmsg.data.publisher
      }
      e.detail.value.pageName = this.data.bookmsg.data.pageName
    }
    if (_this.data.book_edit.pageName) {
      e.detail.value.pageName = _this.data.book_edit.pageName
    }
    let params = e.detail.value;
    e.detail.value.openid = app.globalData.openid
    e.detail.value.buttonid = this.data.buttonid
    e.detail.value.uptime = util.formatTime(date)
    e.detail.value.bookclass = this.data.bookclass
    if (!this.WxValidate.checkForm(params)) {
      //表单元素验证不通过，此处给出相应提示
      let error = this.WxValidate.errorList[0];
      switch (error.param) {
        case "book_name":
          //TODO
          wx.showToast({
            title: this.WxValidate.errorList[0].msg,
            icon: 'none',
            duration: 1000
          })
          break;
        case "book_author":
          //TODO
          wx.showToast({
            title: this.WxValidate.errorList[0].msg,
            icon: 'none',
            duration: 1000
          })
          break;
        case "book_price":
          //TODO
          wx.showToast({
            title: this.WxValidate.errorList[0].msg,
            icon: 'none',
            duration: 1000
          })
          break;
        case "user_tel":
          //TODO
          wx.showToast({
            title: this.WxValidate.errorList[0].msg,
            icon: 'none',
            duration: 1000
          })
          break;
        case "book_num":
          wx.showToast({
            title: this.WxValidate.errorList[0].msg,
            icon: 'none',
            duration: 1000
          })
          break;
      }
      // console.log(this.WxValidate.errorList[0].msg)
      return false
    }
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    // console.log(this.data.images)
    if (!_this.data.book_edit.pageName) {
      if (this.data.images.length == 0) {
        wx.showToast({
          title: '需要添加图片',
          icon: 'none',
          duration: 1000
        })
        return false
      } else if (this.data.bookclass == '') {
        wx.showToast({
          title: '请选择书籍种类',
          icon: 'none',
          duration: 1000
        })
        return false
      } else {
        wx.request({
          url: app.globalData.baseURL + 'submitform',
          method: 'post',
          data: {
            bookdetail: e.detail.value
          },
          success: function(res) {
            console.log('执行了上传表单操作')
            for (var i = 0; i < _this.data.images.length; i++) {
              wx.uploadFile({
                url: app.globalData.baseURL + 'weixin/wx_upload.do',
                filePath: _this.data.images[i],
                name: 'file',
                formData: {
                  'openid': app.globalData.openid
                },
                success: function(res1) {
                  wx.switchTab({
                    url:'../sell/sell'
                  })
                  wx.showToast({
                    title: '发布成功',
                    duration: 1500,
                    mask: true
                  })
                },
                fail: function(res1) {
                  wx.showToast({
                    title: '服务器忙',
                    image: '/images/error.png',
                    duration: 1000,
                    mask: true
                  })
                }
              })
            }
          },
          fail: function(res) {
            wx.showToast({
              title: '服务器忙',
              image: '/images/error.png',
              duration: 1000,
              mask: true
            })
          }
        })
      }
    } else {
      if (this.data.bookclass == '') {
        wx.showToast({
          title: '请选择书籍种类',
          icon: 'none',
          duration: 1000
        })
        return
      } else {
        wx.request({
          url: app.globalData.baseURL + 'submitform',
          method: 'post',
          data: {
            bookdetail: e.detail.value,
            bookid:_this.data.book_edit.bookmsg.bookid
          },
          success: function(res) {
            console.log('执行了上传表单操作', res)
            wx.navigateBack({
              delta: 1
            })
            wx.showToast({
              title: '编辑成功',
              duration: 1500,
              mask: true
            })
          },
          fail: function(res) {
            wx.showToast({
              title: '服务器忙',
              image: '/images/error.png',
              duration: 1000,
              mask: true
            })
          }
        })
      }
    }
    // console.log(e.detail.value)
  },
  initValidate: function() {
    let rules = {
      book_name: {
        required: true
      },
      book_author: {
        required: true
      },
      book_num: {
        required: true
      },
      book_price: {
        required: true
      },
      user_tel: {
        required: true
      }
    }

    let message = {
      book_name: {
        required: '请输入书名'
      },
      book_author: {
        required: '请输入作者'
      },
      book_num: {
        required: '请输入数量'
      },
      book_price: {
        required: '请输入价格'
      },
      user_tel: {
        required: '请输入联系方式'
      }
    }
    //实例化当前的验证规则和提示消息
    this.WxValidate = new WxValidate(rules, message);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option) {
    var _this = this
    this.initValidate();
    this.data.buttons[2].checked = true;
    this.setData({
      buttons: this.data.buttons,
      openid: app.globalData.openid,
      selectArray: wx.getStorageSync("bookclass")
    })
    console.log(this.data.selectArray)
    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      if (data.pageName === 'mysubmit') {
        _this.setData({
          book_edit: data
        })
      } else {
        // 将sell页面传递过来的数据赋值给本页面
        _this.setData({
          bookmsg: data
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