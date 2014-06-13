/**
 * Created by cloudbian on 14-4-8.
 */
var alipay = require('./../../tools/Alipay.js');
var HttpClient = require('./../../tools/HttpClient.js');
var Config = require('./../../tools/Config.js');
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
                total_fee = result.data.payValue+"";
                res.send(alipay.web.reqTrade(_id,tradeNo,subject,total_fee));
            }
        });
    }catch(e){
        res.redirect("/errorPage");
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
                                if("TRADE_SUCCESS"===req.query.trade_status){
                                    updateOrder(req.params.id,function(e,r){
                                        if(e){
                                            res.send(404, r.errorMsg);
                                        }else{
                                            var order = {};
                                            order.oid = req.query.out_trade_no;
                                            order._id = req.params.id;
                                            order.pName = req.query.subject;
                                            order.total = req.query.total_fee;
                                            //send sms
                                            sendOrderSMSFn(result.data.contactPhone,order.oid,result.data.member._id,function(er,rs){
                                                if(er){
                                                    console.log("mobile:"+result.data.contactPhone+",orderID:"+order.oid+",memberId:"+result.data.member._id+" send pay success sms is failed,reason is "+rs);
                                                }else{
                                                    console.log("mobile:"+result.data.contactPhone+",orderID:"+order.oid+",memberId:"+result.data.member._id+" send pay success sms is success");
                                                }
                                            });
                                            res.render('web/trade_success',{order:order});
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
                            res.send(404,result.errorMsg);
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
                        res.send("fail");
                    }else{
                        if(0===result.error){
                            if(0===result.data.status){
                                console.log('notify status ok');
                                if("TRADE_SUCCESS"===req.body.trade_status){
                                    updateOrder(req.params.id,function(e,r){
                                        if(e){
                                            console.log("orderID:"+result.data.orderID+"update status is failed,reason is "+r);
                                            res.send("fail");
                                        }else{
                                            res.send("success");
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
                console.log("notify verify fail");
                res.send("fail");
            }
        }else{
            console.log("notify verify fail");
            res.writeHead(200, {"Content-Type": "text/html"});
            res.write("fail");
            res.end();
        }
    });
};

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
                cb('error',r.errorMsg);
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

////trade request
//exports.reqTrade = function(req,res){
//    //for Test
//    var _id = req.body._id;
//    var tradeNo = req.body.oid;
//    var total_fee = "0.01";
//    var httpClient = new HttpClient({
//        'host':Config.inf.host,
//        'port':Config.inf.port,
//        'path':'/order/detail/'+_id,
//        'method':"GET"
//    });
//    try{
//        httpClient.getReq(function(err,result){
//            if(err){
//                res.send(404,"error is "+err);
//            }else{
//                var subject = result.data.product.name;
////                total_fee = result.data.totalPrice+"";
//                res.send(alipay.web.reqTrade(_id,tradeNo,subject,total_fee));
//            }
//        });
//    }catch(e){
//        res.send(404,"error is "+ e.message);
//    }
//};