var model = require("../../model/model.js");
var cities;
var cityNow;
var openId;
var moneyBagId;

Page({
  data: {
    showMessage: false,
    message: "",
    verifyPass: false,
    showOverLay: false,
    btnShow: true
  },
  onLoad(options) {
    console.log(options);
    
    if (options.hasOwnProperty("id")) {
      moneyBagId = options.id;
      
    } 
    else if (options.hasOwnProperty("q"))
    {
      var url = decodeURIComponent(options.q);
      moneyBagId = url.split("id=")[1];
      
    }
    else
    {
      console.log("id未指定");
      this.setData({
        showMessage: true,
        message: "id未指定"
      });
      return
    }
    var that = this;

    var query = wx.createSelectorQuery();
    //选择id

    query.select('.container').boundingClientRect(function (rect) {
      // console.log(rect.width)
      that.setData({
        overLayHeight: rect.width + 'px'
      })
    }).exec();



    var failed = 0;
    wx.request({
      url: 'https://itongchuanbao.com/wx/getpic.php?id=' + moneyBagId, // 仅为示例，并非真实的接口地址
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data);
        that.setData({
          "picUrlArray": res.data
        });
      },
      fail(res) {
        that.setData({
          showMessage: true,
          message: "获取广告图片失败，请刷新重试"
        });
        failed = 1;
      }
    });
    if (failed == 1)
      return;

    wx.request({
      url: 'https://itongchuanbao.com/wx/getcities_noCallBack.php?id=' + moneyBagId, // 仅为示例，并非真实的接口地址
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data);
        console.log(res.data.city);

        cities = JSON.parse(res.data.city);
        console.log(cities);
        for (var item in cities) {
          if (cities[item].city == "市辖区")
            cities[item].city = cities[item].province;
        }
        console.log(cities);
        that.setData({
          cities: cities
        })
      },
      fail(res) {
        that.setData({
          showMessage: true,
          message: "获取红包地理限制信息失败，请刷新重试"
        });
        failed = 1;
      }
    })
    if (failed == 1)
      return;

    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        wx.request({
          url: 'https://itongchuanbao.com/wx/geoLocation2cityName.php',
          method: 'GET',
          data: {
            latitude: latitude,
            longitude: longitude,
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res.data);
            var cityNowArray = new Array();
            cityNow = {
              "province": res.data.result.addressComponent.province,
              "city": res.data.result.addressComponent.city,
              "county": res.data.result.addressComponent.district
            }
            cityNowArray.push({
              "province": res.data.result.addressComponent.province,
              "city": res.data.result.addressComponent.city,
              "county": res.data.result.addressComponent.district
            });
            that.setData({
              cityNow: cityNowArray

            });

            for (var item in cities) {
              if (cities[item].province == cityNow.province && cities[item].city == cityNow.city && cities[item].county == cityNow.county) {
                console.log("验证通过");
                that.setData({
                  verifyPass: true
                })
              }
            }

          },
          fail(res) {
            that.setData({
              showMessage: true,
              message: "转换用户地理位置到城市失败，请刷新重试"
            });
            failed = 1;
          }
        })
      },
      fail(res) {
        that.setData({
          showMessage: true,
          message: "获取用户地理位置信息失败，请刷新重试"
        });
        failed = 1;
      }
    })
    if (failed == 1)
      return;


    // Do some initialize when page load.
  },
  onReady() {
    // Do something when page ready.

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
  },
  getMoneyBag: function (e) {
    var that = this;
    sendMoneyBag(that);
    
  }
})

function getOpenId() {
  wx.login({
    success: function (loginCode) {
      var appid = 'wx75a0a6c57d683d7c'; //填写微信小程序appid  
      var secret = 'b596cff64f8520ce8dffb71ffc54a8b5'; //填写微信小程序secret  

      //调用request请求api转换登录凭证  
      wx.request({
        url: 'https://itongchuanbao.com/wx/api/getOpenId.php?appid=' + appid + '&secret=' + secret + '&grant_type=authorization_code&js_code=' + loginCode.code,
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data.openid) //获取openid  
          openId = res.data.openid
        }
      })
    }
  })

}

getOpenId();


function showMoneyBag(money, that) {
  var query = wx.createSelectorQuery();
  //选择id

  query.select('.container').boundingClientRect(function (rect) {
    // console.log(rect.width)
    that.setData({
      overLayHeight: rect.height + 'px',
      showOverLay: true,
      btnShow: false
    })
  }).exec();
  if(money == 0)
  {
    that.setData({
      message:"抱歉，红包已经领完了，下次来早一点哦。"
    })
  }
  else if(money == -1)
  {
    that.setData({
      message:"抱歉，您已经领过这个推广红包了，可以找找别的推广红包哦。"
    })
  }
  else
  {
    
    that.setData({
      message:"您获得了"+ money + "元的红包，系统已将金额转入您的余额，请查收。"
    })
  }
  
}

function sendMoneyBag(that){
  wx.request({
    url: 'https://itongchuanbao.com/wx/wxmoneybag.php',
    data: {
      openid: openId,
      id: moneyBagId,

    },
    header: {
      'content-type': 'application/json'
    },
    success(res) {
      console.log(res.data);
      var money = res.data.money;
      showMoneyBag(money, that);

    },
    fail(res){

    }
  });

  // wx.sendBizRedPacket({
  //   timeStamp: 1,
  //   nonceStr: 1 ,
  //   package: 1,
  //   signType: 1,
  //   paySign: 1,
  //   success: function (res) {
  //    console.log('红包success')
  //    let url = config.HTTP_Prize_URL + '/v1/sign_tmp/sendSuccess.do';
  //    let data = {
  //     minipid: that.data.minipid,
  //     date: that.data.date
  //    }
  //    console.log('红包成功以后接口请求参数数据:' + JSON.stringify(data))
  //    util.request(url, 'post', data, '正在加载数据', function (res) {
  //     console.log('红包成功以后接口返回结果:' + JSON.stringify(res.data))
  //    })
  //    wx.reLaunch({
  //     url: '../my_prize/my_prize_2?reward=' + res.data.body.reward,
  //    })
  //   },
  //   fail: function (res) {
  //    console.log(res)
  //   },
  //   complete: function (res) {
  //    console.log('红包complete')
  //    // wx.showModal({
  //    //  title: '红包complete',
  //    //  content: '红包complete',
  //    // })
  //   }
  //  })
}

