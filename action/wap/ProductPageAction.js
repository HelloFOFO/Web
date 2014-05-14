/**
 * Created by zzy on 3/26/14.
 */
var HttpClient = require('./../../tools/HttpClient.js');
var Config = require('./../../tools/Config');
var WeiXin = require('./../../tools/WeiXin');
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
        response.render('wap/products',{'titleName':'商品列表','products':res[1],'city':{'name':res[0].name}});
    });
};
//微信页面中需要用到的产品列表 传进来 ticket ticketPackage package三个字段
exports.getProductList = function(request,response){
    console.log("==============================="+request.query.code,request.query.state);
    async.waterfall([
       function(cb){
        //先做微信认证
        var code = request.query.code?request.query.code:"";
        WeiXin.oAuth(code,function(error,result){
            if(error){
                cb('auth error',null);
            }else{
                //如果微信认证成功，则把openID写到Session中
                request.session.openID = result;
                cb(null,result);
            }
        });
    },function(cb,result){
        //如果认证通过则查产品列表
            var productType = request.params.type;
            if( productType == 'ticket' || productType == 'ticketPackage' || productType == 'package三个字段'){
                try{
                    var httpClient = new HttpClient({
                        'host':Config.inf.host,
                        'port':Config.inf.port,
                        'path':'/product/'+productType+'/webList',
                        'method':"GET"
                    });
                    httpClient.getReq(function(err,res){
                        if(err || res.error != 0 ){
                            cb(res,null);
                        } else {
                            cb(null,{'titleName':'商品列表','products':res.data});
                        }
                    });
                }catch(e){
                    cb(e.message,null);
                }
            }else{
                cb('productType error',null);
            }
    }],function(err,result){
        if(err){
            console.err(err);
            response.redirect('wap/errorPage');
        }else{
            response.render('wap/productList',result);
        }
    });





};

var productLevelConvert = function(productLevel,productType){
    if( productType == 1 ){
        //门票
        if(productLevel==0){
            return "";
        }else{
            return "<p>产品等级："+productLevel.toString()+'A级景区'+"</p>";
        }

    }else if( productType == 2 ){
        //酒店
        if(productLevel<3){
            return "经济型酒店";
        }else{
            return productLevel.toString()+'星级酒店';
        }
    }else if(productType == 3){
        if(productLevel==0){
            return "";
        }else{
            return "<p>产品等级："+productLevel.toString()+'星推荐'+"</p>";
        }
    }else {
        return "";
    }
};

exports.getDetail = function(request,response){
    var id = request.params.id;
    var type = request.params.type;
    var path = "";
    path = "/product/ticket/detail/"+id;
    var httpClient = new HttpClient({
        'host':Config.inf.host,
        'port':Config.inf.port,
        'path':path,
        'method':"GET"
    });
    httpClient.getReq(function(err,res){
        if(err){
            response.send(404,err);
        }else{
            if(0===res.error){
                var product = res.data;
                if(!us.isEmpty(product.relatedProductID)){
                    product.image=[];
                    product.relatedProductID.forEach(function(p){
                        if(!us.isEmpty(p.product.image[0])){
                            product.image.push(p.product.image[0]);
                        }
                        if(!us.isEmpty(p.product.image[1])){
                            product.image.push(p.product.image[1]);
                        }
                        p.product.level = productLevelConvert(p.product.level,p.product.type);
                    });
                }
                product.level=productLevelConvert(product.level,product.type);

                if(4===product.type){
                    //if from productCalendar then can get select date and price
                    if(!us.isEmpty(request.query.date)){
                        product.date = request.query.date;
                    }
                    if(!us.isEmpty(request.query.price)){
                        product.price = request.query.price;
                    }
                    console.log(product);
                    response.render('wap/productDetail',{'titleName':'商品详情','product':product});
                }else{
                    var path="";
                    if( product.type == 1){
                        path='/product/ticket/priceLog/list?product='+ product._id + "&status=2";
                    }else if(product.type == 5){
                        path='/product/ticketPackage/priceLog/list?product='+ product._id + "&status=2";
                    }
                    //get price log list
                    var hc = new HttpClient({
                        'host':Config.inf.host,
                        'port':Config.inf.port,
                        'path':path,
                        'method':"GET"
                    });
                    console.log('pricelog----------',path);
                    hc.getReq(function(error,result){
                        if(error){
                            response.send(404,error);
                        }else{
                            console.log('pricelog-----',result);
                            if(0===result.error){
                                var pls = [];
                                result.data.forEach(function(obj){
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
//                                console.log(product);
                                response.render('wap/productDetail',{'titleName':'商品详情','product':product});
                            }else{
                                response.send(404,result.errorMsg);
                            }
                        }
                    });
                }
            }else{
                response.send(res.errorMsg);
            }
        }
    });
};

exports.productCalendar = function(request,response){
    //get price list
    var id = request.params.id;
    //get server now time
    var now = new Date();
    var sd = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate()+timeZone;
    now.setMonth(now.getMonth()+3);
    var ed = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate()+timeZone;
    var opt = {
        'host':Config.inf.host,
        'port':Config.inf.port,
        'path':'/product/package/price/list/'+ id + '?effectDate='+new Date(sd).getTime() + '&expiryDate='+new Date(ed).getTime(),
        'method':"GET"
    };
    var hc = new HttpClient(opt);
    hc.getReq(function(e,r){
        if(e){
            response.send(404,e);
        }else{
            console.log("bbbbb",r);
            if(0=== r.error){
                var prices = [];
                var priceHash = us.indexBy(r.data,'date');
                for(var today = new Date(sd).getTime();today <= new Date(ed).getTime();today += 86400000 ){
                    if( priceHash[today] && priceHash[today].inventory > 0){
                        prices.push(priceHash[today].price);
                    }   else{
                        prices.push(0);
                    }
                }
//                r.data.forEach(function(p){
//                    prices.push(p.packagePrice);
//                });
                var result = {};
                result.id = id;
                result.prices = prices;
                result.time = new Date(sd).getTime();
                response.render('wap/productCalendar',{'titleName':'选择日期','product':result});
            }else{
                response.send(404,r.errorMsg);
            }
        }
    });
}

exports.detailInfo = function(request,response){
    var flag = true;
    var type = request.query.type;
    var res = {};
    res.type = type;
    if("detail"===type){
        res.name = !us.isEmpty(request.query.name)?request.query.name:"";
        res.level = !us.isEmpty(request.query.level)?request.query.level:"";
        res.address = !us.isEmpty(request.query.address)?request.query.address:"";
        res.openTime = !us.isEmpty(request.query.openTime)?request.query.openTime:"";
        res.image = !us.isEmpty(request.query.image)?request.query.image:"";
        res.image2 = !us.isEmpty(request.query.image2)?request.query.image2:"";
        res.intro = !us.isEmpty(request.query.intro)?request.query.intro:"";
        response.render('wap/productSectionDetail',{titleName:'商品详情',info:res});
    }else if("relate"===type){
        var id = request.query._id;
        var hc = new HttpClient({
            'host':Config.inf.host,
            'port':Config.inf.port,
            'path':'/product/relevance/'+ id,
            'method':"GET"
        });
        hc.getReq(function(error,result){
            if(error){
                response.send(404,error);
            }else{
                if(0===result.error){
                    res.relate = result.data;
                    response.render('wap/productSectionDetail',{titleName:'相关商品',info:res});
                }else{
                    response.send(404,result.errorMsg);
                }
            }
        });
    }else if("notice"===type){
        res.bookRule = !us.isEmpty(request.query.bookRule)?request.query.bookRule:"";
        res.useRule = !us.isEmpty(request.query.useRule)?request.query.useRule:"";
        res.cancelRule = !us.isEmpty(request.query.cancelRule)?request.query.cancelRule:"";
        response.render('wap/productSectionDetail',{titleName:'预定须知',info:res});
    }else{
        response.send(404,"没有这种类型");
    }
};

exports.toSubOrder = function(request,response){
    var time = request.query.exDate;
    var price = request.query.sPrice;
    var type = request.query.type;
    var id = request.query.product;
    var path = "";
    var isWeekend = "n";
    var lid = "";
    if("4"===type){
        path = '/product/package/detail/'+id;
    }else{
        isWeekend = request.query.isWeekend;
        lid = request.query.lid;
        path = '/product/ticket/detail/'+id;
    }
    var httpClient = new HttpClient({
        'host':Config.inf.host,
        'port':Config.inf.port,
        'path':path,
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
                if(4!==type){
                    ret.isWeekend = isWeekend;
                    ret.lid = lid;
                }
                response.render('wap/subOrder',{titleName:'填写订单',product:ret});
            }else{
                response.send(404,'error message is '+res.errorMsg);
            }
        }
    });
};

var productLevelConvert = function(productLevel,productType){
    if(productType==1){
        if(productLevel==0){
            return "";
        }else{
            return "<p>产品等级："+productLevel.toString()+'A级景区'+"</p>";
        }

    }else if(productType == 2){
        if(productLevel<3){
            return "<p>产品等级："+"经济型酒店";
        }else{
            return "<p>产品等级："+productLevel.toString()+'星级酒店'+"</p>";
        }
    }
};

exports.productDetail = function(request,response){
    var id = request.params.id;
    var httpClient = new HttpClient({
        'host':Config.inf.host,
        'port':Config.inf.port,
        'path':'/product/ticket/detail/'+id,
        'method':"GET"
    });
    httpClient.getReq(function(err,res){
        if(err ||res.error != 0 ){
            console.log(err,res);
            response.redirect("/wap/errorPage",{});
        } else {
                var viewData={};
            viewData.products = [];
                var product = res.data;
                if( parseInt(product.type) == 1 || parseInt(product.type) == 2 || parseInt(product.type) == 3){
                    viewData.products.push({"product":product});
                }else{
                    viewData.products = product.relatedProductID;
                }
                if(!us.isEmpty(viewData.products)){
                    viewData.products.forEach(function(p){
                        p.product.level = productLevelConvert(p.product.level,p.product.type);
                        if(!us.isEmpty(p.product.image)){
                            p.product.image.forEach(function(i){
                                i.url = Config.inf.imageHost+ i.url;
                            });
                        }
                    });
                }
            viewData.titleName="商品详情";
            viewData.info={type:"detail"};
            response.render("wap/productSectionDetail",viewData);
        }
    });
};


exports.renderConfirm = function(req,res){
    var viewData = {};
    if(us.isEmpty(req.params.id)){
        console.error("orderid is empty!",req.params.id);
        res.redirect('/wap/errorPage');
    }else{
        var opt = {
            'host':Config.inf.host
            ,'port':Config.inf.port
            ,path:"/order/detail/"+req.params.id
            ,method:"GET"
        };
        var http = new HttpClient(opt);
        http.getReq(function(err,result){
            if(err || result.error != 0){
                res.redirect('/wap/errorPage');
            }else{
                result = result.data;
                viewData.name = result.product.name;
                viewData.orderType = result.product.type==4?'p':'t';
                viewData._id = req.params.id;
                viewData.oid = result.orderID;
                if(4==result.product.type){
                    viewData.time = new Date(result.startDate).Format("yyyy-MM-dd");
                }else{
                    var sd = new Date(result.startDate).Format("yyyy-MM-dd");
                    var ed = new Date(result.endDate).Format("yyyy-MM-dd");
                    viewData.time = sd + '~' + ed;
                }
                viewData.num = result.quantity;
                viewData.total = result.totalPrice;
                viewData.person = result.liveName;
                viewData.mobile = result.contactPhone;
                if(!us.isEmpty(result.invoice) && !us.isEmpty(result.invoice.types)){
                    viewData.isNeed = "y";
                    viewData.invoiceType = result.invoice.types;
                    viewData.invoiceTitle = result.invoice.title;
                    viewData.invoiceAdd = result.invoice.address;
                }else{
                    viewData.isNeed = "n";
                }
                res.render('wap/orderConfirm',{titleName:'支付订单',info:viewData});
            }
        });
    }
};



//exports.saveOrder = function(request,response){
//    var data = {};
//    var flag = true;
//    var errorMsg = "";
//    var id = "";
//    data.source = "534de2e3309199c11f233cf4";
//    data.payWay = "1";
//    data.remark = "";
//    if(!us.isEmpty(request.session.user)){
//        data.member = request.session.user._id;
//    }else{
//        errorMsg = "请先登录";
//        flag = false;
//    }
//    if(!us.isEmpty(request.body.pid)){
//        data.product = request.body.pid;
//    }else{
//        errorMsg = "产品ID为空";
//        flag = false;
//    }
//    if(!us.isEmpty(request.body.type)){
//        var orderType = request.body.type;
//        if(4===parseInt(orderType)){
//            data.startDate = new Date(request.body.time+timeZone).getTime();
//        }else{
//            var arrays = request.body.time.split('~');
//            data.startDate = new Date(arrays[0]+timeZone).getTime();
//            data.endDate = new Date(arrays[1]+timeZone).getTime();
//            if(!us.isEmpty(request.body.isWeekend)){
//                data.priceLogisWeeknd = "y"===request.body.isWeekend?true:false;
//            }else{
//                errorMsg = "是否周末不能为空";
//                flag = false;
//            }
//            if(!us.isEmpty(request.body.lid)){
//                data.priceLog = request.body.lid;
//            }else{
//                errorMsg = "是否周末不能为空";
//                flag = false;
//            }
//        }
//    }else{
//        errorMsg = "订单类型为空";
//        flag = false;
//    }
//    if(!us.isEmpty(request.body.num)){
//        data.quantity = request.body.num;
//    }else{
//        errorMsg = "产品数量不能为空或为0";
//        flag = false;
//    }
//    if(!us.isEmpty(request.body.name)){
//        data.liveName = request.body.name;
//    }else{
//        errorMsg = "姓名不能为空";
//        flag = false;
//    }
//    if(!us.isEmpty(request.body.mobile)){
//        data.contactPhone = request.body.mobile;
//    }else{
//        errorMsg = "联系手机号不能为空";
//        flag = false;
//    }
//    if(!us.isEmpty(request.body.isNeed)&&"y"===request.body.isNeed){
//        if(!us.isEmpty(request.body.inType)){
//            data.invoiceType = request.body.inType;
//        }else{
//            errorMsg = "发票类型不能为空";
//            flag = false;
//        }
//        if(!us.isEmpty(request.body.title)){
//            data.invoiceTitle = request.body.title;
//        }else{
//            errorMsg = "发票抬头不能为空";
//            flag = false;
//        }
//        if(!us.isEmpty(request.body.address)){
//            data.invoiceAdd = request.body.address;
//        }else{
//            errorMsg = "发票地址不能为空";
//            flag = false;
//        }
//    }
//    if(flag){
//        var httpClient = new HttpClient({
//            'host':Config.inf.host,
//            'port':Config.inf.port,
//            'path':'/order/save',
//            'method':"POST"
//        });
//        console.log(data);
//        httpClient.postReq(data,function(err,result){
//            if(err){
//                response.send(404,err);
//            }else{
//                if(0===result.error){
//                    var res = {};
//                    res.name = request.body.pName;
//                    res.orderType = request.body.type;
//                    res._id = result.data._id;
//                    res.oid = result.data.orderID;
//                    if(4===parseInt(request.body.type)){
//                        res.time = new Date(result.data.startDate).Format("yyyy-MM-dd");
//                    }else{
//                        var sd = new Date(result.data.startDate).Format("yyyy-MM-dd");
//                        var ed = new Date(result.data.endDate).Format("yyyy-MM-dd");
//                        res.time = sd + '~' + ed;
//                    }
//                    res.num = result.data.quantity;
//                    res.total = result.data.totalPrice;
//                    res.person = result.data.liveName;
//                    res.mobile = result.data.contactPhone;
//                    if(!us.isEmpty(result.data.invoice.types)){
//                        res.isNeed = "y";
//                        res.invoiceType = result.data.invoice.types;
//                        res.invoiceTitle = result.data.invoice.title;
//                        res.invoiceAdd = result.data.invoice.address;
//                    }else{
//                        res.isNeed = "n";
//                    }
//                    response.render('wap/orderConfirm',{titleName:'支付订单',info:res});
//                }else{
//                    response.send(404,result.errorMsg);
//                }
//            }
//        });
//
//    }else{
//        console.log(result);
//        response.send(404,errorMsg);
//    }
//};
