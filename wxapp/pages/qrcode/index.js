import drawQrcode from "weapp.qrcode.js";
var qrLink;
var accessToken;
var id;
// index.js
Page({
    data: {
      text: 'This is page data.'
    },
    onLoad(options) {
      // Do some initialize when page load.
      id = options.id;
        qrLink="https://itongchuanbao.com/openApp?id="+options.id;
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
      getAccessCode();
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

function getAccessCode(){
  wx.request({
    url: 'https://itongchuanbao.com/wx/api/getAccessCode.php', 
    data: {
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success(res) {
      console.log(res.data);
      accessToken = res.data.access_token;
      getQrcode(accessToken);
    }
  })
}

function getQrcode(accessToken){
  wx.request({
    url: 'https://itongchuanbao.com/wx/api/getQrcode.php',
    data: {
      accessToken: accessToken,
      scene: id,
      page: 'pages/showAdv/index',
      width: 200,
      
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success(res) {
      console.log(res.data)
    }
  })
}