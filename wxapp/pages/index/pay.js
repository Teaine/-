
function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 31; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }

function prePay(){
}

function newPayRequest(fee){
    var timeStamp = + new Date();
    var nonceStr = makeid();
    
    wx.request({
        url: 'https://itongchuanbao.com/wx/api/newOrder.php',//改成你自己的链接
        header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'fee':fee
        },
        method:'POST',
        success: function(res) {
            jsondata = eval(res.data);
            console.log(res.data);
            console.log('调起支付');
            wx.requestPayment({
                'timeStamp': res.data.timeStamp,
                'nonceStr': res.data.nonceStr,
                'package': res.data.package,
                'signType': 'MD5',
                'paySign': res.data.paySign,
                'success':function(res){
                    console.log('success');
                    wx.showToast({
                        title: '支付成功',
                        icon: 'success',
                        duration: 3000
                    });
                },
                'fail':function(res){
                    console.log('fail');
                },
                'complete':function(res){
                    console.log('complete');
                }
            });
        },
        fail:function(res){
            console.log(res.data)
        }
    });

}