/**
 * Created by cloudbian on 14-4-21.
 */
var weixin = require('./../../tools/WeiXin');
var config = require('./../../tools/Config');
//verify
exports.notify = function(req,res){
    var signature = req.query.signature;
    var ts = req.query.timestamp;
    var nonce = req.query.nonce;
    var echostr = req.query.echostr;
    if(weixin.check(signature,ts,nonce)){
        if(null==echostr){
            res.send('error');
        }else{
            res.send(echostr);
        }
    }else{
        res.send('error');
    }
};

//get msg
exports.msgNotify = function(req,res){
    res.set('Content-Type', 'text/xml');
    //check
    var signature = req.query.signature;
    var ts = req.query.timestamp;
    var nonce = req.query.nonce;
    console.log(signature,ts,nonce);
    if(weixin.check(signature,ts,nonce)){
        var _data = "";
        req.on('data',function(chunk){
            _data+=chunk;
        });
        req.on('end',function(){
            weixin.message(_data,function(err,result){
                console.log(result);
                res.send(result);
            });
        });
    }else{
        res.send('无效信息!');
    }
}

//pay
exports.order = function(req,res){
    var msg = "";
    var useragent = req.headers['user-agent'];
//    if(useragent.indexOf('MicroMessenger')<0){
//        msg = '不支持微信以外的游览器';
//    }
//    var wxVer = parseInt(useragent.substr(useragent.lastIndexOf('/')+1,1));
//    if(wxVer<=4&&""===msg){
//        msg = '微信版本过低，无法支付，请升级';
//    }
    if(""===msg){
        var wx = {};
        wx.appId = config.wx.appID;
        wx.partnerId = config.wx.partnerId;
        wx.key = config.wx.paySignKey;
        wx.partnerKey = config.wx.partnerKey;
        console.log("coming");
        res.render('weixin/test',{wx:wx});
//        res.render('weixin/demo');
    }else{
        res.send(msg);
    }
};

exports.payNotify = function(req,res){
    console.log("===================",JSON.stringify(req.body));
//    res.send("success");
}

//customer
exports.customerNotify = function(req,res){
    var _data = "";
    req.on('data',function(chunk){
        _data+=chunk;
    });
    req.on('end',function(){
        weixin.message(_data,function(err,result){
            console.log(result);
            res.send(result);
        });
    });
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