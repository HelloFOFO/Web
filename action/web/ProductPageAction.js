/**
 * Created by zzy on 3/26/14.
 */
var HttpClient = require('./../../tools/HttpClient.js');
var Config = require('./../../tools/Config');
var async = require('async');
var us = require('underscore');
var timeZone = ' 00:00:00 +08:00';
exports.getProducts = function(request,response){
    var city = request.params.id;
    async.series([
        function(cb){
            var httpClient = new HttpClient({
                'host':Config.inf.host,
                'port':Config.inf.port,
                'path':'/wap/city/name/'+city,
                'method':"GET"
            });
            httpClient.getReq(function(err,res){
                if(err){
                    cb(err,null);
                } else {
                    cb(null,res.data);
                }
            });
        },
        function(cb){
            var httpClient = new HttpClient({
                'host':Config.inf.host,
                'port':Config.inf.port,
                'path':'/web/product/webList/'+city,
                'method':"GET"
            });
            httpClient.getReq(function(err,res){
                if(err){
                    cb(err,null);
                } else {
                    cb(null,res.data);
                }
            });
        }
    ],function(err,res){
        response.render('web/products',{'products':res[1],'city':{'name':res[0].name}});
    });
};

exports.getDetail = function(request,response){
    var id = request.params.id;

//    response.send(id);
    var httpClient = new HttpClient({
        'host':Config.inf.host,
        'port':Config.inf.port,
        'path':'/web/product/detail/'+id,
        'method':"GET"
    });
    httpClient.getReq(function(err,res){
        if(err){
            response.send(404,err);
        } else {
            if(res.error==0){
                var level;
                var product = res.data;
                if(product.type==1){
                    switch(product.level){
                        case 1:
                            level='1A景区'
                            break;
                        case 2:
                            level='2A景区'
                            break;
                        case 3:
                            level='3A景区'
                            break;
                        case 4:
                            level='4A景区'
                            break;
                        case 5:
                            level='5A景区'
                            break;
                    }
                } else if(product.type==2) {
                    switch(product.level){
                        case 1:
                            level='经济型酒店'
                            break;
                        case 2:
                            level='经济型酒店'
                            break;
                        case 3:
                            level='三星级酒店'
                            break;
                        case 4:
                            level='四星级酒店'
                            break;
                        case 5:
                            level='五星级酒店'
                            break;
                    }
                }
                product.level=level;
                if(product.type==4){
                    //get price list
                    response.render('web/packageDetail',{'product':product});
                } else {
                    //get price log list
                    var hc = new HttpClient({
                        'host':Config.inf.host,
                        'port':Config.inf.port,
                        'path':'/product/ticket/priceLog/list?product='+ product._id + "&status=2",
                        'method':"GET"
                    });
                    hc.getReq(function(e,r){
                        if(e){
                            response.send(404,e);
                        }else{
                            if(0===r.error){
                                var pls = [];
                                r.data.forEach(function(obj){
                                    var pl = {};
                                    var time = new Date(obj.startDate);
                                    var sd = time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate();
                                    time = new Date(obj.endDate);
                                    var ed = time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate();
                                    pl.name = sd + '~' + ed;
                                    pl._id = obj._id;
                                    pl.price = obj.price;
                                    pl.priceWeekend = obj.priceWeekend;
                                    pls.push(pl);
                                });
                                product.pls = pls;
                                response.render('web/ticketDetail',{'product':product});
                            }else{
                                response.send(404, r.errMsg);
                            }
                        }
                    });
                }
            } else {
                response.send(404,'fuck 404');
            }
        }
    });
};

//get price list
exports.getPrices = function(productId,path,cb){
    var httpClient = new HttpClient({
        'host':Config.inf.host,
        'port':Config.inf.port,
        'path':path+productId,
        'method':"GET"
    });
    httpClient.getReq(function(err,res){
        cb(err,res);
    });
}

//go to fill package order
exports.toPkgOrder = function(request,response){
    //todo get calendar time and get price
    var time = "2014-04-18";
    var price = 200;
    var id = request.body.product;
    var httpClient = new HttpClient({
        'host':Config.inf.host,
        'port':Config.inf.port,
        'path':'/web/product/detail/'+id,
        'method':"GET"
    });
    httpClient.getReq(function(err,res){
        if(err){
            response.send(404,'error is '+err);
        }else{
            if(0===res.error){
                var ret = {};
                ret.id = id;
                ret.name = res.data.name;
                ret.content = res.data.content;
                ret.bookRule = res.data.bookRule;
                ret.useRule = res.data.useRule;
                ret.cancelRule = res.data.cancelRule;
                ret.time = time;
                ret.price = price;
                response.render('web/packageSubOrder',{product:ret});
            }else{
                response.send(404,'error message is '+res.errorMsg);
            }
        }
    });
};

//go to confirm page and save order
exports.toConfirm = function(request,response){
    var data = {};
    var flag = true;
    var errMsg = "";
    var id = "";
    data.source = "534de2e3309199c11f233cf4";
    data.payWay = "1";
    data.remark = "";
    if(!us.isEmpty(request.session.user._id)){
        data.member = request.session.user._id;
    }else{
        errMsg = "请先登录";
        flag = false;
    }
    if(!us.isEmpty(request.body.pid)){
        data.product = request.body.pid;
    }else{
        errMsg = "产品ID为空";
        flag = false;
    }
    if(!us.isEmpty(request.body.orderType)){
        var orderType = request.body.orderType;
        if("p"===orderType){
            data.startDate = new Date(request.body.time+timeZone).getTime();
        }else{
            var arrays = request.body.time.split('~');
            data.startDate = new Date(arrays[0]+timeZone).getTime();
            data.endDate = new Date(arrays[1]+timeZone).getTime();
            if(!us.isEmpty(request.body.isWeekend)){
                data.priceLogisWeeknd = "y"===request.body.isWeekend?true:false;
            }else{
                errMsg = "是否周末不能为空";
                flag = false;
            }
            if(!us.isEmpty(request.body.lid)){
                data.priceLog = request.body.lid;
            }else{
                errMsg = "是否周末不能为空";
                flag = false;
            }
        }
    }else{
        errMsg = "订单类型为空";
        flag = false;
    }
    if(!us.isEmpty(request.body.num)){
        data.quantity = request.body.num;
    }else{
        errMsg = "产品数量不能为空或为0";
        flag = false;
    }
    if(!us.isEmpty(request.body.person)){
        data.liveName = request.body.person;
    }else{
        errMsg = "入住人姓名不能为空";
        flag = false;
    }
    if(!us.isEmpty(request.body.mobile)){
        data.contactPhone = request.body.mobile;
    }else{
        errMsg = "联系手机号不能为空";
        flag = false;
    }
    if(!us.isEmpty(request.body.isNeed)&&"y"===request.body.isNeed){
        if(!us.isEmpty(request.body.invoiceType)){
            data.invoiceType = request.body.invoiceType;
        }else{
            errMsg = "发票类型不能为空";
            flag = false;
        }
        if(!us.isEmpty(request.body.invoiceTitle)){
            data.invoiceTitle = request.body.invoiceTitle;
        }else{
            errMsg = "发票抬头不能为空";
            flag = false;
        }
        if(!us.isEmpty(request.body.invoiceAdd)){
            data.invoiceAdd = request.body.invoiceAdd;
        }else{
            errMsg = "发票地址不能为空";
            flag = false;
        }
    }
    if(flag){
        var httpClient = new HttpClient({
            'host':Config.inf.host,
            'port':Config.inf.port,
            'path':'/order/save',
            'method':"POST"
        });
        httpClient.postReq(data,function(err,result){
            if(err){
                response.send(404,err);
            }else{
                if(0===result.error){
                    var res = {};
                    res.name = request.body.pName;
                    res.orderType = request.body.orderType;
                    res._id = result.data._id;
                    res.oid = result.data.orderID;
                    if("p"===request.body.orderType){
                        var time = new Date(result.data.startDate);
                        res.time = time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate();
                    }else{
                        var time = new Date(result.data.startDate);
                        var sd = time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate();
                        time = new Date(result.data.endDate);
                        var ed = time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate();
                        res.time = sd + '~' + ed;
                    }
                    res.num = result.data.quantity;
                    res.total = result.data.totalPrice;
                    res.person = result.data.liveName;
                    res.mobile = result.data.contactPhone;
                    if(!us.isEmpty(result.data.invoice.types)){
                        res.isNeed = "y";
                        res.invoiceType = result.data.invoice.types;
                        res.invoiceTitle = result.data.invoice.title;
                        res.invoiceAdd = result.data.invoice.address;
                    }else{
                        res.isNeed = "n";
                    }
                    response.render('web/orderConfirm',{info:res});
                }else{
                    console.log(result.errMsg);
                    response.send(404,result.errMsg);
                }
            }
        });

    }else{
        console.log(errMsg);
        response.send(404,errMsg);
    }
};

//go to fill ticket order
exports.toTktOrder = function(request,response){
    var time = request.body.exDate;
    var price = request.body.sPrice;
    var lid = request.body.lid;
    var isWeekend = request.body.isWeekend;
    var id = request.body.product;
    if(us.isEmpty(time)||us.isEmpty(price)||us.isEmpty(id)||us.isEmpty(isWeekend)||us.isEmpty(lid)){
        response.send(404,'传入参数不正确!');
    }else{
        var httpClient = new HttpClient({
            'host':Config.inf.host,
            'port':Config.inf.port,
            'path':'/web/product/detail/'+id,
            'method':"GET"
        });
        httpClient.getReq(function(err,res){
            if(err){
                response.send(404,'error is '+err);
            }else{
                if(0===res.error){
                    var ret = {};
                    ret.id = id;
                    ret.name = res.data.name;
                    ret.content = res.data.content;
                    ret.bookRule = res.data.bookRule;
                    ret.useRule = res.data.useRule;
                    ret.cancelRule = res.data.cancelRule;
                    ret.time = time;
                    ret.price = price;
                    ret.isWeekend = isWeekend;
                    ret.lid = lid;
                    response.render('web/ticketSubOrder',{product:ret});
                }else{
                    response.send(404,'error message is '+res.errorMsg);
                }
            }
        });
    }
};