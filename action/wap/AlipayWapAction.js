/**
 * Created by cloudbian on 14-4-3.
 */
var alipay = require('./../../tools/Alipay.js');
var Config = require('./../../tools/Config.js');
var HttpClient = require('./../../tools/HttpClient.js');
//请求交易
exports.getReqTrade = function(req,res){
//    console.log(Config.alipay);
    var _id = req.body._id?req.body._id:req.params._id;
    var tradeNo = req.body.oid?req.body.oid:req.params.oid;
    var total_fee = "0.01";
    var httpClient = new HttpClient({
        'host':Config.inf.host,
        'port':Config.inf.port,
        'path':'/order/detail/'+_id,
        'method':"GET"
    });
//    console.log('/order/detail/'+_id);
    try{
        httpClient.getReq(function(err,result){
            if( err || result.error != 0 ){
                console.log("/wap getReq",err,result);
                res.redirect("/wap/errorPage");
            }else{
                var subject = result.data.product.name;
                //正式上线的时候取消这个注释 把上面的0.01注释掉！
                total_fee = result.data.payValue + "";
                alipay.wap.reqAuth(_id,tradeNo,subject,total_fee,function(error,token){
                    if(""===token){
                        res.send(404,'token is null');
                    }else{
                        res.send(alipay.wap.reqTrade(token));
                    }
                });
            }
        });
    }catch(e){
        res.send(404,"error is "+ e.message);
    }
}

//同步回调
exports.callBack = function(req,res){
    //verify
    var params = [
        {
            key : "sign",
            value : req.query.sign
        },{
            key : "result",
            value: req.query.result
        },{
            key : "out_trade_no",
            value : req.query.out_trade_no
        },{
            key : "trade_no",
            value : req.query.trade_no
        },{
            key : "request_token",
            value : req.query.request_token
        }
    ];
    var isSuccess = alipay.wap.verify(params,req.query.sign);
    if(isSuccess){
        var httpClient = new HttpClient({
            'host':Config.inf.host,
            'port':Config.inf.port,
            'path':'/order/detail/'+req.params.id,
            'method':"GET"
        });
        try{
            httpClient.getReq(function(err,result){
                if(err){
                    res.send(404,err);
                }else{
                    if(0===result.error){
                        if(0===result.data.status){
                            if("success"===req.query.result){
                                updateOrder(req.params.id,function(e,r){
                                    if(e){
                                        console.log("orderID:"+result.data.orderID+" update status is failed,reason is "+r);
                                    }else{
                                        console.log("orderID:"+result.data.orderID+" update status is success");
                                        sendOrderSMSFn(result.data.contactPhone,result.data.orderID,result.data.member._id,function(er,rs){
                                            if(er){
                                                console.log("mobile:"+result.data.contactPhone+",orderID:"+result.data.orderID+",memberId:"+result.data.member._id+" send pay success sms is failed,reason is "+rs);
                                            }else{
                                                console.log("mobile:"+result.data.contactPhone+",orderID:"+result.data.orderID+",memberId:"+result.data.member._id+" send pay success sms is success");
                                            }
                                        });
                                    }
                                });
                            }
                        }
                        var order = {};
                        order.oid = result.data.orderID;
                        order._id = result.data._id;
                        order.pName = result.data.product.name;
                        order.total = result.data.totalPrice;
                        res.render('wap/trade_success',{titleName:'交易成功',order:order});
                    }else{
                        res.send(404,result.errorMsg);
                    }
                }
            });

        }catch(e){
            res.send(404, e.message);
        }
    }else{
        res.send(404,'验证错误');
    }
};

//异步回调
exports.notify = function(req,res){
    console.log("notify success");
    alipay.wap.verify_notify(req.body.service,req.body.v,req.body.sec_id,req.body.notify_data,req.body.sign,function(error,isSuccess){
        var parseString = require('xml2js').parseString;
        if(error){
            res.send("fail"+error);
        }else{
            if(isSuccess){
                var httpClient = new HttpClient({
                    'host':Config.inf.host,
                    'port':Config.inf.port,
                    'path':'/order/detail/'+req.params.id,
                    'method':"GET"
                });
                try{
                    httpClient.getReq(function(err,result){
                        if(err){
                            console.log("notify verify fail",err);
                            res.send("fail");
                        }else{
                            if(0===result.error){
                                if(0===result.data.status){
                                    var status = "";
                                    parseString(req.body.notify_data, function (er, rlt) {
                                        status = rlt.notify.trade_status[0];
                                    });
                                    if("TRADE_SUCCESS"===status){
                                        updateOrder(req.params.id,function(e,r){
                                            if(e){
                                                console.log("orderID:"+result.data.orderID+" update status is failed,reason is "+r);
                                                res.send("fail");
                                            }else{
                                                console.log("orderID:"+result.data.orderID+" update status is success");
                                                sendOrderSMSFn(result.data.contactPhone,result.data.orderID,result.data.member._id,function(er,rs){
                                                    if(er){
                                                        console.log("mobile:"+result.data.contactPhone+",orderID:"+result.data.orderID+",memberId:"+result.data.member._id+" send pay success sms is failed,reason is "+rs);
                                                    }else{
                                                        console.log("mobile:"+result.data.contactPhone+",orderID:"+result.data.orderID+",memberId:"+result.data.member._id+" send pay success sms is success");
                                                    }
                                                });
                                                res.send("success");
                                            }
                                        });
                                    }
                                }else{
                                    res.send("success");
                                }
                            }else{
                                console.log("notify verify fail");
                                res.send("fail");
                            }
                        }
                    });
                }catch(e){
                    console.log(e.message);
                    res.send("fail");
                }
            }else{
                res.send("fail");
            }
        }
    });
}

//update order status
function updateOrder(id,cb){
    var hc = new HttpClient({
        'host':Config.inf.host,
        'port':Config.inf.port,
        'path':'/order/update/'+id,
        'method':"POST"
    });
    hc.postReq({status:1,operator:'5320ffb06532aa00951ff5e1'},function(e,r){
        if(e){
            cb('error',e);
        }else{
            if(0===r.error){
              cb(null,"success");
            }else{
               cb('error', r.errorMsg);
            }
        }
    });
}

//send SMS
function sendOrderSMSFn(mobile,orderID,memberID,cb){
    try{
        var querystring = require('querystring');
        var params = querystring.stringify({mobile:mobile,orderID:orderID,member:memberID});
        var opt = {
            'host':Config.inf.host,
            'port':Config.inf.port,
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
