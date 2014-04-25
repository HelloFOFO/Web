/**
 * Created by zzy on 3/26/14.
 */
var HttpClient = require('./../../tools/HttpClient.js');
var Config = require('./../../tools/Config');
var async = require('async');
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
                    console.log(JSON.stringify(res.data));
                    cb(null,res.data);
                }
            });
        }
    ],function(err,res){
        response.render('wap/products',{'titleName':'商品列表','products':res[1],'city':{'name':res[0].name}});
    });
};

exports.getDetail = function(request,response){
    var id = request.params.id;
    var type = request.params.type;
    var httpClient = new HttpClient({
        'host':Config.inf.host,
        'port':Config.inf.port,
        'path':'/web/product/detail/'+id,
        'method':"GET"
    });
    httpClient.getReq(function(err,res){
        if(err){
            response.send(404,err);
        }else{
            if(0===res.error){
                console.log(res.data);
                var product = res.data;
                var level = "";
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
                response.render('wap/productDetail',{'titleName':'商品详情',product:product});
            }else{
                response.send(res.errorMsg);
            }
        }
    });
};

exports.toSubOrder = function(request,response){
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
                ret.type = res.data.type;
                ret.time = time;
                ret.price = price;
                response.render('wap/subOrder',{titleName:'填写订单',product:ret});
            }else{
                response.send(404,'error message is '+res.errorMsg);
            }
        }
    });
}

exports.saveOrder = function(request,response){
    var us = require('underscore');
    var data = {};
    var flag = true;
    var errorMsg = "";
    var id = "";
    data.source = "534de2e3309199c11f233cf4";
    data.payWay = "1";
    data.remark = "";
    if(!us.isEmpty(request.session.user)){
        data.member = request.session.user._id;
    }else{
        errorMsg = "请先登录";
        flag = false;
    }
    if(!us.isEmpty(request.body.pid)){
        data.product = request.body.pid;
    }else{
        errorMsg = "产品ID为空";
        flag = false;
    }
    if(!us.isEmpty(request.body.type)){
        var orderType = request.body.type;
        if(4===parseInt(orderType)){
            data.startDate = new Date(request.body.time+timeZone).getTime();
        }else{
            var arrays = request.body.time.split('~');
            data.startDate = new Date(arrays[0]+timeZone).getTime();
            data.endDate = new Date(arrays[1]+timeZone).getTime();
            if(!us.isEmpty(request.body.isWeekend)){
                data.priceLogisWeeknd = "y"===request.body.isWeekend?true:false;
            }else{
                errorMsg = "是否周末不能为空";
                flag = false;
            }
            if(!us.isEmpty(request.body.lid)){
                data.priceLog = request.body.lid;
            }else{
                errorMsg = "是否周末不能为空";
                flag = false;
            }
        }
    }else{
        errorMsg = "订单类型为空";
        flag = false;
    }
    if(!us.isEmpty(request.body.num)){
        data.quantity = request.body.num;
    }else{
        errorMsg = "产品数量不能为空或为0";
        flag = false;
    }
    if(!us.isEmpty(request.body.name)){
        data.liveName = request.body.name;
    }else{
        errorMsg = "姓名不能为空";
        flag = false;
    }
    if(!us.isEmpty(request.body.mobile)){
        data.contactPhone = request.body.mobile;
    }else{
        errorMsg = "联系手机号不能为空";
        flag = false;
    }
    if(!us.isEmpty(request.body.isNeed)&&"y"===request.body.isNeed){
        if(!us.isEmpty(request.body.inType)){
            data.invoiceType = request.body.inType;
        }else{
            errorMsg = "发票类型不能为空";
            flag = false;
        }
        if(!us.isEmpty(request.body.title)){
            data.invoiceTitle = request.body.title;
        }else{
            errorMsg = "发票抬头不能为空";
            flag = false;
        }
        if(!us.isEmpty(request.body.address)){
            data.invoiceAdd = request.body.address;
        }else{
            errorMsg = "发票地址不能为空";
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
                    res.orderType = request.body.type;
                    res._id = result.data._id;
                    res.oid = result.data.orderID;
                    if(4===parseInt(request.body.type)){
                        res.time = new Date(result.data.startDate).Format("yyyy-MM-dd");
                    }else{
                        var sd = new Date(result.data.startDate).Format("yyyy-MM-dd");
                        var ed = new Date(result.data.endDate).Format("yyyy-MM-dd");
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
                    response.render('wap/orderConfirm',{titleName:'支付订单',info:res});
                }else{
                    console.log(result.errorMsg);
                    response.send(404,result.errorMsg);
                }
            }
        });

    }else{
        console.log(errorMsg);
        response.send(404,errorMsg);
    }
}