import drawQrcode from "weapp.qrcode.js";
var qrLink;
// index.js
Page({
    data: {
      text: 'This is page data.'
    },
    onLoad(options) {
      // Do some initialize when page load.
        qrLink="https://itongchuanbao.com/wx/?id="+options.id;
        this.setData({
            text: qrLink
        });
    },
    onReady() {
      // Do something when page ready.
      drawQrcode({
        width: 200,
        height: 200,
        canvasId: 'myQrcode',
        text: qrLink,
        image:{
            imageResource:'logo.png',
            dx: 70,
            dy: 70,
            dWidth: 60,
            dHeight: 60
        }
      });
    },
    onShow() {
      // Do something when page show.
    },
    onHide() {
      // Do something when page hide.
    },
    onUnload() {
      // Do something when page close.
    },
    onPullDownRefresh() {
      // Do something when pull down.
    },
    onReachBottom() {
      // Do something when page reach bottom.
    },
    onShareAppMessage() {
      // return custom share data when user share.
    },
    onPageScroll() {
      // Do something when page scroll
    },
    onResize() {
      // Do something when page resize
    },
    onTabItemTap(item) {
      console.log(item.index)
      console.log(item.pagePath)
      console.log(item.text)
    },
    // Event handler.
    viewTap() {
      this.setData({
        text: 'Set some data for updating view.'
      }, function () {
        // this is setData callback
      })
    },
    customData: {
      hi: 'MINA'
    }
  })

