var model = require("../../model/model.js");

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
  onReady: function(e) {
    var that = this;
    //请求数据
    model.updateAreaData(that, 0, e);
  },
  //点击选择城市按钮显示picker-view
  translate: function(e) {
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
  hiddenFloatView: function(e) {
    model.animationEvents(this, 200, false, 400);
  },
  //滑动事件
  bindChange: function(e) {
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
  onReachBottom: function() {},
  nono: function() {},
  showTopTips: function() {
    var that = this;
    this.setData({
      showTopTips: true
    });
    setTimeout(function() {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },
  checkboxChange: function(e) {
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
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    });
  },
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    });
  },
  bindCountryCodeChange: function(e) {
    console.log("picker country code 发生选择改变，携带值为", e.detail.value);

    this.setData({
      countryCodeIndex: e.detail.value
    });
  },
  bindCountryChange: function(e) {
    console.log("picker country 发生选择改变，携带值为", e.detail.value);

    this.setData({
      countryIndex: e.detail.value
    });
  },
  bindAccountChange: function(e) {
    console.log("picker account 发生选择改变，携带值为", e.detail.value);

    this.setData({
      accountIndex: e.detail.value
    });
  },
  bindAgreeChange: function(e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  },
  chooseImage: function(e) {
    var that = this;
    if (that.data.files.length >= 10) {
      that.setData({
        showTopTips: 1,
        Toptip: "最多只能上传10张图片"
      });
      setTimeout(function() {
        that.setData({
          showTopTips: false
        });
      }, 3000);
      return;
    }
    wx.chooseImage({
      sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    });
  },
  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    });
  },
  deleteImage: function(e) {
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
  deletecity: function(e) {
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
    this.setData({ cityItems: newcityItems });
  },
  formSubmit: function(e){
    console.log("submit",e.detail.value);
    var that=this; 
    var files = that.data.files;
    var city = that.data.cityItems;
    console.log(that.data.files);
    console.log(that.data.cityItems);

    wx.request({
      url: 'http://111.231.133.135/wx/data.php', //仅为示例，并非真实的接口地址
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
      success: function(res) {
        console.log(res.data);
        id = res.data;
      },
      fail: function(e){
        that.setData({
          showTopTips: 1,
          Toptip: "生成广告失败，无法上传数据"
        });
        setTimeout(function() {
          that.setData({
            showTopTips: false
          });
        }, 3000);
      }
    });
    var i;
    for(i=0;i<files.length;i++){
      wx.uploadFile({
        url: 'http://111.231.133.135/wx/upload.php', //仅为示例，非真实的接口地址
        filePath: files[i],
        name: 'file',
        formData:{
          'id': id
        },
        success: function(res){
          var data = res.data
          
        },
        fail: function(e){
          that.setData({
            showTopTips: 1,
            Toptip: "生成广告失败，无法上传图片"
          });
          setTimeout(function() {
            that.setData({
              showTopTips: false
            });
          }, 3000);
        }
      })
    }
  }
});
