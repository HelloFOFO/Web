/**
 * Created by cloudbian on 14-4-21.
 */
var weixin = require('./../../tools/WeiXin');
var config = require('./../../tools/Config');
var HttpClient = require('./../../tools/HttpClient');
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
    var ip = req.ip;
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
        wx.ip = ip;
        res.render('weixin/test',{wx:wx});
//        res.render('weixin/demo');
    }else{
        res.send(msg);
    }
};

//payNotify
exports.payNotify = function(req,res){
    var _data = "";
    req.on('data',function(chunk){
        _data+=chunk;
    });
    req.on('end',function(){
        weixin.payNotify(_data,function(err,result){
            if(err){
                console.log("weixin pay notify is error:"+err);
                res.send("fail");
            }else{
                var httpClient = new HttpClient({
                    'host':config.inf.host,
                    'port':config.inf.port,
                    'path':'/order/detail/'+req.params.id,
                    'method':"GET"
                });
                try{
                    httpClient.getReq(function(e,r){
                        if(e){
                            console.log("weixin pay notify while get order detail is error:"+e);
                            res.send("fail");
                        }else{
                            if(0===r.error){
                                if(0===r.data.status){
                                    if("0"===req.query.trade_state){
                                        var hc = new HttpClient({
                                            'host':config.inf.host,
                                            'port':config.inf.port,
                                            'path':'/order/update/'+req.params.id,
                                            'method':"POST"
                                        });
                                        hc.postReq({status:1,operator:'5320ffb06532aa00951ff5e1',transID:req.query.transaction_id},function(er,rs){
                                            if(er){
                                                console.log("weixin pay notify update order status is error:"+er);
                                                res.send("fail");
                                            }else{
                                                if(0===rs.error){
                                                    console.log("orderID:"+r.data.orderID+" weixin pay notify is success");
                                                    res.send("success");
                                                    //send sms
                                                    sendOrderSMSFn(r.data.contactPhone,r.data.orderID,r.data.member._id,function(error,ret){
                                                        if(error){
                                                            console.log("mobile:"+r.data.contactPhone+",orderID:"+r.data.orderID+",memberId:"+r.data.member._id+" send pay success sms is failed,reason is "+ret);
                                                        }else{
                                                            console.log("mobile:"+r.data.contactPhone+",orderID:"+r.data.orderID+",memberId:"+r.data.member._id+" send pay success sms is success");
                                                        }
                                                    });
                                                    //deliver
                                                    weixin.getAT(function(){
                                                        weixin.deliver(result,req.query.transaction_id,req.query.out_trade_no,function(error,ret){
                                                            if(error){
                                                                console.log(req.query.out_trade_no+" deliver is failed:"+ret);
                                                            }else{
                                                                console.log(req.query.out_trade_no+" deliver is success");
                                                            }
                                                        });
                                                    });
                                                }else{
                                                    console.log("weixin pay notify is error:"+ rs.errorMsg);
                                                    res.send("fail");
                                                }
                                            }
                                        });
                                    }
                                }else{
                                    console.log("orderID:"+r.data.orderID+" weixin pay notify is success,but this order status has been changed to"+ r.data.status);
                                    res.send("success");
                                }
                            }else{
                                console.log("weixin pay notify is error:"+ r.errorMsg);
                                res.send("fail");
                            }
                        }
                    });
                }catch(e){
                    console.log("weixin pay notify is error:"+e.message);
                    res.send("fail");
                }
            }
        });
    });
}

//deliver
exports.deliver = function(req,res){
    var response = {};
    var openid = req.query.openid;
    var transid = req.query.transid;
    var out_trade_no = req.query.out_trade_no;
    weixin.getAT(function(){
        weixin.deliver(openid,transid,out_trade_no,function(e,r){
            if(e){
                response.error = 1;
                response.errorMsg = r;
            }else{
                response.error = 0;
                response.errorMsg = r;
            }
            res.send(response);
        });
    });
}

//customer
exports.customerNotify = function(req,res){
    var _data = "";
    req.on('data',function(chunk){
        _data+=chunk;
    });
    req.on('end',function(){
        weixin.customer(_data,function(err,result){
            if(err){
                console.log("customer is error:",err,result);
            }
            res.send("success");
        });
    });
}

exports.feedback = function(req,res){
    var response = {};
    var openid = req.query.openid;
    var feedbackid = req.query.feedbackid;
    weixin.getAT(function(){
        weixin.feedback(openid,feedbackid,function(err,result){
            if(err){
                response.error = 1;
                response.errorMsg = err;
            }else{
                response.error = 0;
                response.errorMsg = result;
            }
            res.send(response);
        });
    });
}

//warn
exports.warn = function(req,res){
    res.send("success");
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


//send SMS
function sendOrderSMSFn(mobile,orderID,memberID,cb){
    try{
        var querystring = require('querystring');
        var params = querystring.stringify({mobile:mobile,orderID:orderID,member:memberID});
        var opt = {
            'host':config.inf.host,
            'port':config.inf.port,
            'path':'/order/sms?'+params,
            'method':"GET"
        };

        var http = new HttpClient(opt);
        http.getReq(function(err,result){
            if(err){
                cb('error',err);
            }else{
                cb(null,result);
            }
        });

    }catch(e){
        cb('error', e.message);
    }
}