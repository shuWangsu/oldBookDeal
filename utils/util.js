const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/* 公共request 方法 */
const requestUrl = ({
  url,
  params,
  success,
  method = "post"
}) => {
  let server = 'http://127.0.0.1:3000/'; //测试域名
  let sessionId = wx.getStorageSync("sid"),
    that = this;
    var header = {
      'content-type': 'application/x-www-form-urlencoded'
    }
  return new Promise(function(resolve, reject) {
      wx.request({
        url: server + url,
        method: method,
        data: params,
        header: header,
        success: (res) => {
          resolve(res)
        },
        fail: function(res) {
          wx.showToast({
            title:'',
            icon: 'none',
            duration: 2000,
            mask: true
          })
          reject(res.data)
        },
        complete: function() {
          // wx.hideLoading()
        }
      })
    })
    .catch((res) => {})
}
/* 公共showTotast  loading 方法 */

module.exports = {
  formatTime: formatTime,
  requestUrl: requestUrl
}