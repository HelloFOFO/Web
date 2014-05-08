/**
 * Created by cloudbian on 14-4-3.
 */
var alipay = require('./../../tools/Alipay.js');
var Config = require('./../../tools/Config.js');
var HttpClient = require('./../../tools/HttpClient.js');
//请求交易
exports.getReqTrade = function(req,res){
    //todo 参数取值
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
//                total_fee = result.data.totalPrice+"";
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
                                var hc = new HttpClient({
                                    'host':Config.inf.host,
                                    'port':Config.inf.port,
                                    'path':'/order/update/'+req.params.id,
                                    'method':"POST"
                                });
                                hc.postReq({status:1,operator:'5320ffb06532aa00951ff5e1'},function(e,r){
                                    if(e){
                                        res.send(404, e);
                                    }else{
                                        if(0===r.error){
                                            console.log("order "+req.query.out_trade_no+" is update status success");
                                        }else{
                                            res.send(404, r.errorMsg);
                                        }
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
                            res.writeHead(200, {"Content-Type": "text/html"});
                            res.write("fail");
                            res.end();
                        }else{
                            if(0===result.error){
                                if(0===result.data.status){
                                    var status = "";
                                    parseString(req.body.notify_data, function (er, rlt) {
                                        status = rlt.notify.trade_status[0];
                                    });
                                    if("TRADE_FINISHED"===status||"TRADE_SUCCESS"===status){
                                        var hc = new HttpClient({
                                            'host':Config.inf.host,
                                            'port':Config.inf.port,
                                            'path':'/order/update/'+req.params.id,
                                            'method':"POST"
                                        });
                                        hc.postReq({status:1,operator:'5320ffb06532aa00951ff5e1'},function(e,r){
                                            if(e){
                                                console.log("e",e);
                                                res.writeHead(200, {"Content-Type": "text/html"});
                                                res.write("fail");
                                                res.end();
                                            }else{
                                                if(0===r.error){
                                                    res.writeHead(200, {"Content-Type": "text/html"});
                                                    res.write("success");
                                                    res.end();
                                                }else{
                                                    console.log("r.error", r.errorMsg);
                                                    res.writeHead(200, {"Content-Type": "text/html"});
                                                    res.write("fail");
                                                    res.end();
                                                }
                                            }
                                        });
                                    }
                                }
                            }else{
                                console.log("notify verify fail");
                                res.writeHead(200, {"Content-Type": "text/html"});
                                res.write("fail");
                                res.end();
                            }
                        }
                    });
                }catch(e){
                    console.log(e.message);
                    res.writeHead(200, {"Content-Type": "text/html"});
                    res.write("fail");
                    res.end();
                }
            }else{
                res.writeHead(200, {"Content-Type": "text/html"});
                res.write("fail");
                res.end();
            }
        }
    });
}
