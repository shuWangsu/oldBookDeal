Page({
  data: {
    logs: [],
    images: []
  },
  onLoad: function() {
    var _this = this
    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      _this.setData({
        images: data.data
      })
    })
  }
})