var app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
  }
})