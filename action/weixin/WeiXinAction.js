/**
 * Created by cloudbian on 14-4-21.
 */
var weixin = require('./../../tools/WeiXin');
var config = require('./../../tools/Config');
//msg
exports.notify = function(req,res){
    if(!req.query.echostr){
        console.log("notify=========="+JSON.stringify(req.query));
    }else{
        var signature = req.query.signature;
        var ts = req.query.timestamp;
        var nonce = req.query.nonce;
        var echostr = req.query.echostr;
        if(weixin.check(signature,ts,nonce,echostr)){
            if(null==echostr){
                res.send('error');
            }else{
                res.send(echostr);
            }
        }else{
            res.send('error');
        }
    }
};

//pay
exports.order = function(req,res){
    var msg = "";
    var useragent = req.headers['user-agent'];
    if(useragent.indexOf('MicroMessenger')<0){
        msg = '不支持微信以外的游览器';
    }
    var wxVer = parseInt(useragent.substr(useragent.lastIndexOf('/')+1,1));
    if(wxVer<=4&&""===msg){
        msg = '微信版本过低，无法支付，请升级';
    }
    if(""===msg){
        var wx = {};
        wx.appId = config.wx.appID;
        wx.partnerId = config.wx.partnerId;
        wx.key = config.wx.paySignKey;
        wx.partnerKey = config.wx.partnerKey;
        res.render('weixin/test',{wx:wx});
//        res.render('weixin/demo');
    }else{
        res.send(msg);
    }
};

exports.payNotify = function(req,res){
    console.log("===================",JSON.stringify(req.body));
    res.send("success");
}

//customer
exports.customerNotify = function(req,res){
    var data = req.body.postData;
    if(us.isEmpty(data)){
        res.send(404,'没有返回数据');
    }else{
        weixin.customer(function(err,result){

        });
    }
}
//menu
exports.createMenu = function(req,res){
    weixin.getAT(function(){
        weixin.createMenu(function(errMsg){
            if(""!==errMsg){
                res.send('fail:'+errMsg);
            }else{
                res.send('OK');
            }
        });
    });
}

exports.delMenu = function(req,res){
    weixin.getAT(function(){
        weixin.delMenu(function(errMsg){
            if(""!==errMsg){
                res.send('fail:'+errMsg);
            }else{
                res.send('OK');
            }
        });
    });
}