var model = require("../../model/model.js");
var util = require("md5.js");

var show = false;
var item = {};
var citynum = -1;

var id;
Page({
  data: {
    showTopTips: false,
    Toptip: " ",

    isAgree: false,
    files: [],
    item: {
      show: show
    },
    cityItems: []
  },
  onReady: function (e) {
    var that = this;
    //请求数据
    model.updateAreaData(that, 0, e);
  },
  //点击选择城市按钮显示picker-view
  translate: function (e) {
    model.animationEvents(this, 0, true, 400);
    var cityItems = this.data.cityItems;
    item = this.data.item;
    citynum = cityItems.length;
    if (citynum == 0) cityItems = new Array();
    var obj = {
      id: citynum,
      province: item.provinces[item.value[0]].name,
      city: item.citys[item.value[1]].name,
      county: item.countys[item.value[2]].name
    };
    cityItems.push(obj);
    this.setData({
      cityItems
    });
  },
  //隐藏picker-view
  hiddenFloatView: function (e) {
    if (e.currentTarget.dataset.id == 444 || e.currentTarget.dataset.id == 555) {
      var cityItems = this.data.cityItems;
      cityItems.pop();
      this.setData({
        cityItems
      });
    }

    model.animationEvents(this, 200, false, 400);
  },
  //滑动事件
  bindChange: function (e) {
    model.updateAreaData(this, 1, e);
    item = this.data.item;
    let cityItems = this.data.cityItems;
    console.log(cityItems);
    console.log(citynum);
    cityItems[citynum].province = item.provinces[item.value[0]].name;
    cityItems[citynum].city = item.citys[item.value[1]].name;
    cityItems[citynum].county = item.countys[item.value[2]].name;
    console.log(cityItems);
    this.setData({
      province: item.provinces[item.value[0]].name,
      city: item.citys[item.value[1]].name,
      county: item.countys[item.value[2]].name,
      cityItems
    });
  },
  onReachBottom: function () {},
  nono: function () {},
  showTopTips: function () {
    var that = this;
    this.setData({
      showTopTips: true
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },
  checkboxChange: function (e) {
    console.log("checkbox发生change事件，携带value值为：", e.detail.value);

    var checkboxItems = this.data.checkboxItems,
      values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }

    this.setData({
      checkboxItems: checkboxItems
    });
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    });
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    });
  },
  bindCountryCodeChange: function (e) {
    console.log("picker country code 发生选择改变，携带值为", e.detail.value);

    this.setData({
      countryCodeIndex: e.detail.value
    });
  },
  bindCountryChange: function (e) {
    console.log("picker country 发生选择改变，携带值为", e.detail.value);

    this.setData({
      countryIndex: e.detail.value
    });
  },
  bindAccountChange: function (e) {
    console.log("picker account 发生选择改变，携带值为", e.detail.value);

    this.setData({
      accountIndex: e.detail.value
    });
  },
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  },
  chooseImage: function (e) {
    var that = this;
    if (that.data.files.length >= 10) {
      that.setData({
        showTopTips: 1,
        Toptip: "最多只能上传10张图片"
      });
      setTimeout(function () {
        that.setData({
          showTopTips: false
        });
      }, 3000);
      return;
    }
    wx.chooseImage({
      sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    });
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    });
  },
  deleteImage: function (e) {
    var that = this;
    var files = that.data.files;
    var index = files.indexOf(e.currentTarget.id);
    //console.log(files);
    files.splice(index, 1);
    //console.log(files);
    this.setData({
      files: files
    });
  },
  deletecity: function (e) {
    //console.log(e);
    let cityItems = this.data.cityItems;
    var newcityItems = new Array();
    var i,
      num = 0;
    for (i = 0; i < cityItems.length; i++, num++) {
      if (i == e.currentTarget.id) {
        num--;
        continue;
      }
      newcityItems[num] = cityItems[i];
      newcityItems[num].id = num;
    }
    this.setData({
      cityItems: newcityItems
    });
  },
  formSubmit: function (e) {
    console.log("submit", e.detail.value);
    var that = this;
    var files = that.data.files;
    var city = that.data.cityItems;
    console.log(that.data.files);
    console.log(that.data.cityItems);
    var fee = e.detail.value.bagmoney;

    if(!e.detail.value.hasOwnProperty("name") || e.detail.value.name == "")
    {
      that.setData({
        showTopTips: 1,
        Toptip: "请填写推广名"
      });
      setTimeout(function () {
        that.setData({
          showTopTips: false
        });
      }, 3000);
      return;
    }
    if(that.data.files.length == 0)
    {
      that.setData({
        showTopTips: 1,
        Toptip: "请添加推广图片内容"
      });
      setTimeout(function () {
        that.setData({
          showTopTips: false
        });
      }, 3000);
      return;
    }

    if(!e.detail.value.hasOwnProperty("bagmoney") || e.detail.value.bagmoney == "")
    {
      that.setData({
        showTopTips: 1,
        Toptip: "请填写红包金额"
      });
      setTimeout(function () {
        that.setData({
          showTopTips: false
        });
      }, 3000);
      return;
    }
    if(!e.detail.value.hasOwnProperty("bagnum") || e.detail.value.bagnum == "")
    {
      that.setData({
        showTopTips: 1,
        Toptip: "请填写红包数量"
      });
      setTimeout(function () {
        that.setData({
          showTopTips: false
        });
      }, 3000);
      return;
    }
    if(that.data.cityItems.length == 0)
    {
      that.setData({
        showTopTips: 1,
        Toptip: "请添加可以领取红包的地区"
      });
      setTimeout(function () {
        that.setData({
          showTopTips: false
        });
      }, 3000);
      return;
    }
    
    if(fee < 0.01)
    {
      that.setData({
        showTopTips: 1,
        Toptip: "红包金额最小为0.01元"
      });
      setTimeout(function () {
        that.setData({
          showTopTips: false
        });
      }, 3000);
      return;
    }

    newPayRequest(fee * 100, this, e, files, city);
  },

});

function upload(id, that) {
  var i;
  var files = that.data.files;
  for (i = 0; i < files.length; i++) {
    wx.uploadFile({
      url: 'https://itongchuanbao.com/wx/upload.php', 
      filePath: files[i],
      name: 'file',
      formData: {
        'id': id
      },
      success: function (res) {
        var data = res.data;
        
        that.setData({
          showTopTips: 1,
          Toptip: "上传成功"
        });
        setTimeout(function () {
          that.setData({
            showTopTips: false
          });
        }, 3000);
        
        wx.navigateTo({
          url: '../qrcode/index?id='+id//实际路径要写全
        })

      },
      fail: function (e) {
        that.setData({
          showTopTips: 1,
          Toptip: "生成广告失败，无法上传图片"
        });
        setTimeout(function () {
          that.setData({
            showTopTips: false
          });
        }, 3000);
      }
    })
  }
}

var openId;

function newPayRequest(fee, that, e, files, city) {

  wx.request({
    url: 'https://itongchuanbao.com/wx/api/newOrder.php', //改成你自己的链接
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      'fee': fee,
      'openid':openId
    },
    method: 'GET',
    success: function (res) {

      console.log(res.data);
      console.log('调起支付');
      
      var timeStamp = Date.parse(new Date()) / 1000;
      var sign = util.hexMD5("appId=wx75a0a6c57d683d7c&nonceStr="+res.data.nonce_str.toUpperCase()+"&package=prepay_id="+res.data.prepay_id+"&signType=MD5&timeStamp="+timeStamp.toString()+"&key=tongchuanbao420835192tj314159235")
      
      console.log("appId=wx75a0a6c57d683d7c&nonceStr="+res.data.nonce_str.toUpperCase()+"&package=prepay_id="+res.data.prepay_id+"&signType=MD5&timeStamp="+timeStamp.toString()+"&key=tongchuanbao420835192tj314159235");
      console.log(sign.toUpperCase());
      console.log('timeStamp:'+timeStamp.toString())
      console.log('nonceStr:'+res.data.nonce_str.toUpperCase())
      console.log('package:'+ "prepay_id=" + res.data.prepay_id)
      console.log('signType:'+'MD5')
      console.log('paySign:'+ sign.toUpperCase())
      
      wx.requestPayment({
        'timeStamp': timeStamp.toString(),
        'nonceStr': res.data.nonce_str.toUpperCase(),
        'package': "prepay_id=" + res.data.prepay_id,
        'signType': 'MD5',
        'paySign': sign.toUpperCase(),
        'success': function (res) {
            console.log('支付成功');
            that.setData({
              showTopTips: 1,
              Toptip: "支付成功"
            });
            setTimeout(function () {
              that.setData({
                showTopTips: false
              });
            }, 3000);

            wx.request({
              url: 'https://itongchuanbao.com/wx/data.php',
              data: {
                name: e.detail.value.name,
                bagmoney: e.detail.value.bagmoney,
                bagnum: e.detail.value.bagnum,
                files: files.join(" "),
                city: JSON.stringify(city)
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {
                console.log(res.data);
                id = res.data;
                upload(id, that);
              },
              fail: function (e) {
                that.setData({
                  showTopTips: 1,
                  Toptip: "生成广告失败，无法上传数据"
                });
                setTimeout(function () {
                  that.setData({
                    showTopTips: false
                  });
                }, 3000);
              }
            });
        },
        'fail': function (res) {
          console.log('fail');
          console.log(res);

          console.log('支付失败');
            that.setData({
              showTopTips: 1,
              Toptip: "支付失败"
            });
            setTimeout(function () {
              that.setData({
                showTopTips: false
              });
            }, 3000);
        },
        'complete': function (res) {
          console.log('complete');
          console.log(res)
        }
      });
    },
    fail: function (res) {
      console.log(res.data)
    }
  });

}


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
