/**
 * Created by zzy on 4/11/14.
 */
var HttpClient = require('./../../tools/HttpClient.js');
var Config = require('./../../tools/Config');
var async = require('async');
var timeZone = ' 00:00:00 +08:00';
var us = require('underscore');
var querystring = require('querystring');
exports.orders = function(request,response){
    var orders = {};
    orders.list = [];
    if(request.session && !us.isEmpty(request.session.user) && !us.isEmpty(request.session.user._id)){
        var httpClient = new HttpClient({
            'host':Config.inf.host,
            'port':Config.inf.port,
            'path':'/order/list?pageSize=99999&member='+ request.session.user._id,
            'method':"GET"
        });
        console.log('/order/list?member='+ request.session.user._id);
        httpClient.getReq(function(err,res){
                if(!err || 0===res.error){
                    res.data.forEach(function(o){
                        var order = {};
                        order.name = o.product.name;
                        order.quantity = o.quantity;
                        order.totalPrice = o.totalPrice;
                        order.status = getStsName(o.status);
                        order._id = o._id;
                        order.oid = o.orderID;
                        orders.list.push(order);
                    });
                    response.render('web/myOrder',{orders:orders});
                }else{
                    response.redirect('/errorPage');
                }
        });
    }else{
        response.redirect('/');
    }
};

exports.detail = function(request,response){
    var httpClient = new HttpClient({
        'host':Config.inf.host,
        'port':Config.inf.port,
        'path':'/order/detail/'+request.params.id,
        'method':"GET"
    });
    httpClient.getReq(function(err,res){
        if(err){
            response.send(404,err);
        }else{
            if(0===res.error){
                var hc = new HttpClient({
                    'host':Config.inf.host,
                    'port':Config.inf.port,
                    'path':'/product/ticket/detail/'+res.data.product._id,
                    'method':"GET"
                });
                hc.getReq(function(e,r){
                    if(e){
                        response.send(404,e);
                    }else{
                        if(0===r.error){
                            var order = {};
                            order.status = getStsName(res.data.status);
                            order.pType = res.data.product.type;
                            order._id = res.data._id;
                            order.oid = res.data.orderID;
                            order.name = res.data.product.name;
                            order.person = res.data.liveName;
                            order.mobile = res.data.contactPhone;
                            order.totalPrice = res.data.totalPrice;
                            order.quantity = res.data.quantity;
                            if(4===order.pType){
                                var time = new Date(res.data.startDate);
                                order.date = time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate();
                            }else{
                                var time = new Date(res.data.startDate);
                                var sd = time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate();
                                time = new Date(res.data.endDate);
                                var ed = time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate();
                                order.date = sd + '~' + ed;
                                if(res.data.isWeekend){
                                    order.date+="(周末票)";
                                }else{
                                    order.date+="(平日票)";
                                }
                            }
                            var od = new Date(res.data.orderDate);
                            order.orderDate = od.getFullYear()+"-"+(od.getMonth()+1)+"-"+od.getDate();
                            if(!us.isEmpty(res.data.invoice) && !us.isEmpty(res.data.invoice.types)){
                                order.type = res.data.invoice.types=='p'?"个人":"公司";
                                order.title = res.data.invoice.title;
                                order.address = res.data.invoice.address;
                            }
                            order.content = r.data.content;
                            order.bookRule = r.data.bookRule;
                            order.useRule = r.data.useRule;
                            order.cancelRule = r.data.cancelRule;
                            response.render('web/orderDetail',{order:order});
                        }else{
                            response.redirect("/errorPage");
                        }
                    }
                });
            }else{
                response.redirect("/errorPage");
            }
        }
    });
};

function getStsName(status){
    switch (status){
        case 0:
            return "未支付";break;
        case 1:
            return "已支付";break;
        case 2:
            return "已确认";break;
        case 3:
            return "已取消";break;
        case 4:
            return "已退款";break;
    }
};


var sendOrderSMSFn = function(mobile,orderID,memberID,cb){
    try{
        var params = querystring.stringify({mobile:mobile,orderID:orderID,member:memberID});
        var opt = {
            'host':Config.inf.host,
            'port':Config.inf.port,
            'path':'/order/sms?'+params,
            'method':"GET"
        };
        console.debug(opt.path);
        var http = new HttpClient(opt);
        http.getReq(function(err,result){
            if(err){
                console.error('bbb',new Error('订单信息发送失败！'));
                cb('订单信息发送失败！',null);
            }else{
                cb(null,result);
            }
        });
    }catch(e){
        console.error( 'aaa',new Error(e.message));
        cb('订单信息发送失败！',null);
    }
};

exports.sendOrderSMS = function(req,res){
    try{
        var params = querystring.stringify({mobile:req.query.mobile,orderID:req.query.orderID,member:req.session.user._id});
        sendOrderSMSFn(req.query.mobile,req.query.orderID,req.session.user._id,function(err,result){
            if(err){
                res.json({error:11,errorMsg:err});
            }else{
                res.json(result);
            }
        });

    }catch(e){
        console.error(e.message,new Error());
        res.json({error:111,errorMsg:"订单信息发送失败"});
    }
};