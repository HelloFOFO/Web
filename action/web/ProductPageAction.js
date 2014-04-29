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
                'path':'/city/name/'+city,
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
                'path':'/product/webList/'+city,
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

var productLevelConvert = function(productLevel,productType){
    if(productType==1){
       return productLevel.toString()+'A级景区';
    }
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

                if(!us.isEmpty(product.relatedProductID)){
                    product.relatedProductID.forEach(function(p){
                        product.image.push(p.product.image[0]);
                        product.image.push(p.product.image[1]);
                    });
                }
                product.level=productLevelConvert(product.level,product.type);
                if(parseInt(product.type)==4){
                    //get price list
                    //get server now time
                    var now = new Date();
                    var sd = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate()+timeZone;
                    now.setMonth(now.getMonth()+3);
                    var ed = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate()+timeZone;
                    var opt = {
                        'host':Config.inf.host,
                        'port':Config.inf.port,
                        'path':'/product/package/price/list/'+ product._id + '?effectDate='+new Date(sd).getTime() + '&expiryDate='+new Date(ed).getTime(),
                        'method':"GET"
                    };
                    var hc = new HttpClient(opt);
                    hc.getReq(function(e,r){
                        if(e){
                            response.send(404,e);
                        }else{
                            if(0===r.error){
                                var prices = {};
                                r.data.forEach(function(p){
                                    var now = new Date(p.date).Format("yyyy-MM-dd");
                                    prices[now] = p.packagePrice;
                                });
                                product.prices = JSON.stringify(prices);
                                response.render('web/packageDetail',{'product':product});
                            }else{
                                response.send(404,r.errorMsg);
                            }
                        }
                    });
                } else {
                    //get price log list
                    var o = {
                        'host':Config.inf.host,
                        'port':Config.inf.port,
                        'method':"GET"
                    };
                    if(product.type==1){
                        o.path='/product/ticket/priceLog/list?product='+ product._id + "&status=2";
                    }else{
                        o.path='/product/ticketPackage/priceLog/list?product='+ product._id + "&status=2";
                    }
                    var hc = new HttpClient(o);

                    hc.getReq(function(e,r){
                        if(e){
                            response.send(404,e);
                        }else{
                            if(0===r.error){
                                var pls = [];
                                r.data.forEach(function(obj){
                                    var pl = {};
                                    var sd = new Date(obj.startDate).Format("yyyy-MM-dd");
                                    var ed = new Date(obj.endDate).Format("yyyy-MM-dd");
                                    pl.name = sd + '~' + ed;
                                    pl._id = obj._id;
                                    pl.price = obj.price;
                                    pl.priceWeekend = obj.priceWeekend;
                                    pls.push(pl);
                                });
                                product.pls = pls;
                                console.log(product);
                                response.render('web/ticketDetail',{'product':product});

                            }else{
                                response.send(404, r.errorMsg);
                            }
                        }
                    });
                }
            } else {
                response.send(404,res.errorMsg);
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
    var time = request.body.selDate;
    var price = request.body.price;
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
    var errorMsg = "";
    var id = "";
    data.source = "534de2e3309199c11f233cf4";
    data.payWay = "1";
    data.remark = "";
    if(!us.isEmpty(request.session.user._id)){
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
    if(!us.isEmpty(request.body.person)){
        data.liveName = request.body.person;
    }else{
        errorMsg = "入住人姓名不能为空";
        flag = false;
    }
    if(!us.isEmpty(request.body.mobile)){
        data.contactPhone = request.body.mobile;
    }else{
        errorMsg = "联系手机号不能为空";
        flag = false;
    }
    if(!us.isEmpty(request.body.isNeed)&&"y"===request.body.isNeed){
        if(!us.isEmpty(request.body.invoiceType)){
            data.invoiceType = request.body.invoiceType;
        }else{
            errorMsg = "发票类型不能为空";
            flag = false;
        }
        if(!us.isEmpty(request.body.invoiceTitle)){
            data.invoiceTitle = request.body.invoiceTitle;
        }else{
            errorMsg = "发票抬头不能为空";
            flag = false;
        }
        if(!us.isEmpty(request.body.invoiceAdd)){
            data.invoiceAdd = request.body.invoiceAdd;
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
                    res.orderType = request.body.orderType;
                    res._id = result.data._id;
                    res.oid = result.data.orderID;
                    if("p"===request.body.orderType){
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
                    response.render('web/orderConfirm',{info:res});
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


var truncProductName = function(productName){
    return productName.length>7?productName.substr(0,7)+'...':productName;
};

exports.getRelevanceProduct = function(req,res){
    try{
        var opt={
            'host':Config.inf.host,
            'port':Config.inf.port,
            'path':'/product/relevance/'+req.params.productID,
            'method':"GET"
        };
        console.log(opt.path);
        var http = new HttpClient(opt);
        http.getReq(function(error,result){
            if(error){
                res.json({error:1,errorMsg: error,data:[]});
            }else{
                if(result.error==0){
                    result.data.forEach(function(d){
                        d.image= d.image[0];
                        d.image.url=   'http://dd885.b0.upaiyun.com/'+d.image.url+"!productListPreview";
                        d.shortName= truncProductName(d.name);
                    });
                    res.json(result);
                }else{
                    res.json({error:1,errorMsg: error,data:[]});
                }
            }
        });
    }catch(e){
        res.json({error:1,errorMsg: e.message});
    }
};