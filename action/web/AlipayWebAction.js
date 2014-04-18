/**
 * Created by cloudbian on 14-4-8.
 */
var alipay = require('./../../tools/Alipay.js');
var HttpClient = require('./../../tools/HttpClient.js');
var Config = require('./../../tools/Config.js');
//trade request
exports.reqTrade = function(req,res){
    //for Test
    var _id = req.body._id;
    var tradeNo = req.body.oid;
    var total_fee = "0.01";
    var httpClient = new HttpClient({
        'host':Config.inf.host,
        'port':Config.inf.port,
        'path':'/order/detail/'+_id,
        'method':"GET"
    });
    try{
        httpClient.getReq(function(err,result){
            if(err){
                res.send(404,"error is "+err);
            }else{
                var subject = result.data.product.name;
//                total_fee = result.data.totalPrice+"";
                res.send(alipay.web.reqTrade(_id,tradeNo,subject,total_fee));
            }
        });
    }catch(e){
        res.send(404,"error is "+ e.message);
    }
}

//get 交易请求
exports.getReqTrade = function(req,res){
    //for Test
    var _id = req.params._id;
    var tradeNo = req.params.oid;
    var total_fee = "0.01";
    var httpClient = new HttpClient({
        'host':Config.inf.host,
        'port':Config.inf.port,
        'path':'/order/detail/'+_id,
        'method':"GET"
    });
    try{
        httpClient.getReq(function(err,result){
            if(err){
                res.send(404,"error is "+err);
            }else{
                var subject = result.data.product.name;
//                total_fee = result.data.totalPrice+"";
                res.send(alipay.web.reqTrade(_id,tradeNo,subject,total_fee));
            }
        });
    }catch(e){
        res.send(404,"error is "+ e.message);
    }
}

//同步请求
exports.callBack = function(req,res){
    var params = [
        {
            key : "is_success",
            value : req.query.is_success
        },{
            key : "sign_type",
            value : req.query.sign_type
        },{
            key : "sign",
            value : req.query.sign
        },{
            key : "out_trade_no",
            value : req.query.out_trade_no
        },{
            key : "subject",
            value : req.query.subject
        },{
            key : "payment_type",
            value : req.query.payment_type
        },{
            key : "exterface",
            value : req.query.exterface
        },{
            key : "trade_no",
            value : req.query.trade_no
        },{
            key : "trade_status",
            value : req.query.trade_status
        },{
            key : "notify_id",
            value : req.query.notify_id
        },{
            key : "notify_time",
            value : req.query.notify_time
        },{
            key : "notify_type",
            value : req.query.notify_type
        },{
            key : "seller_email",
            value : req.query.seller_email
        },{
            key : "buyer_email",
            value : req.query.buyer_email
        },{
            key : "seller_id",
            value : req.query.seller_id
        },{
            key : "buyer_id",
            value : req.query.buyer_id
        },{
            key : "total_fee",
            value : req.query.total_fee
        },{
            key : "body",
            value : req.query.body
        },{
            key : "extra_common_param",
            value : req.query.extra_common_param
        },{
            key : "agent_user_id",
            value : req.query.agent_user_id
        }
    ];
    alipay.web.verify(req.query.notify_id,params,req.query.sign,function(errs,rlt){
        if(rlt){
            //success
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
                                if("TRADE_FINISHED"===req.query.trade_status||"TRADE_SUCCESS"===req.query.trade_status){
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
                                                var order = {};
                                                order.oid = req.query.out_trade_no;
                                                order._id = req.params.id;
                                                order.pName = req.query.subject;
                                                order.total = req.query.total_fee;
                                                res.render('web/trade_success',{order:order});
                                            }else{
                                                res.send(404, r.errMsg);
                                            }
                                        }
                                    });
                                }
                            }else{
                                var order = {};
                                order.oid = req.query.out_trade_no;
                                order._id = req.params.id;
                                order.pName = req.query.subject;
                                order.total = req.query.total_fee;
                                res.render('web/trade_success',{order:order});
                            }
                        }else{
                            res.send(404,result.errMsg);
                        }
                    }
                });

            }catch(e){
                console.log(e.message);
                res.send(404, e.message);
            }

        }else{
            //faild
           res.send(404,"alipay call back verify error");
        }
    });
};

//异步请求
exports.notify = function(req,res){
    var params = [
        {
            key : "notify_id",
            value : req.body.notify_id
        },{
            key : "notify_time",
            value : req.body.notify_time
        },{
            key : "notify_type",
            value : req.body.notify_type
        },{
            key : "sign_type",
            value : req.body.sign_type
        },{
            key : "sign",
            value : req.body.sign
        },{
            key : "out_trade_no",
            value : req.body.out_trade_no
        },{
            key : "subject",
            value : req.body.subject
        },{
            key : "payment_type",
            value : req.body.payment_type
        },{
            key : "trade_no",
            value : req.body.trade_no
        },{
            key : "trade_status",
            value : req.body.trade_status
        },{
            key : "gmt_create",
            value : req.body.gmt_create
        },{
            key : "gmt_payment",
            value : req.body.gmt_payment
        },{
            key : "gmt_close",
            value : req.body.gmt_close
        },{
            key : "refund_status",
            value : req.body.refund_status
        },{
            key : "gmt_refund",
            value : req.body.gmt_refund
        },{
            key : "seller_email",
            value : req.body.seller_email
        },{
            key : "buyer_email",
            value : req.body.buyer_email
        },{
            key : "seller_id",
            value : req.body.seller_id
        },{
            key : "buyer_id",
            value : req.body.buyer_id
        },{
            key : "price",
            value : req.body.price
        },{
            key : "total_fee",
            value : req.body.total_fee
        },{
            key : "quantity",
            value : req.body.quantity
        },{
            key : "body",
            value : req.body.body
        },{
            key : "discount",
            value : req.body.discount
        },{
            key : "is_total_fee_adjust",
            value : req.body.is_total_fee_adjust
        },{
            key : "use_coupon",
            value : req.body.use_coupon
        },{
            key : "extra_common_param",
            value : req.body.extra_common_param
        },{
            key : "out_channel_type",
            value : req.body.out_channel_type
        },{
            key : "out_channel_amount",
            value : req.body.out_channel_amount
        },{
            key : "out_channel_inst",
            value : req.body.out_channel_inst
        },{
            key : "business_scene",
            value : req.body.business_scene
        }
    ];
    alipay.web.verify(req.body.notify_id,params,req.body.sign,function(errs,rlt){
        if(rlt){
            //success
            var httpClient = new HttpClient({
                'host':Config.inf.host,
                'port':Config.inf.port,
                'path':'/order/detail/'+req.params.id,
                'method':"GET"
            });
            try{
                httpClient.getReq(function(err,result){
                    if(err){
                        console.log("notify verify fail");
                        res.writeHead(200, {"Content-Type": "text/html"});
                        res.write("fail");
                        res.end();
                    }else{
                        if(0===result.error){
                            if(0===result.data.status){
                                console.log('notify status ok');
                                if("TRADE_FINISHED"===req.body.trade_status||"TRADE_SUCCESS"===req.body.trade_status){
                                    var hc = new HttpClient({
                                        'host':Config.inf.host,
                                        'port':Config.inf.port,
                                        'path':'/order/update/'+req.params.id,
                                        'method':"POST"
                                    });
                                    hc.postReq({status:1,operator:'5320ffb06532aa00951ff5e1'},function(e,r){
                                        if(e){
                                            console.log("notify verify fail");
                                            res.writeHead(200, {"Content-Type": "text/html"});
                                            res.write("fail");
                                            res.end();
                                        }else{
                                            if(0===r.error){
                                                res.writeHead(200, {"Content-Type": "text/html"});
                                                res.write("success");
                                                res.end();
                                            }else{
                                                console.log("notify verify fail");
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
                console.log("notify verify fail");
                res.writeHead(200, {"Content-Type": "text/html"});
                res.write("fail");
                res.end();
            }
        }else{
            console.log("notify verify fail");
            res.writeHead(200, {"Content-Type": "text/html"});
            res.write("fail");
            res.end();
        }
    });
};