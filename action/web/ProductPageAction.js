/**
 * Created by zzy on 3/26/14.
 */
var HttpClient = require('./../../tools/HttpClient.js');
var Config = require('./../../tools/Config');
var async = require('async');
var us = require('underscore');
var timeZone = ' 00:00:00 +08:00';



var productLevelConvert = function(productLevel,productType){
    if(productType==1){
        if(productLevel==0){
            return "";
        }else{
            return "<p>产品等级："+productLevel.toString()+'A级景区</p>';
        }

    }else if(productType == 2){
        if(productLevel<3){
            return "<p>酒店星级：经济型酒店</p>";
        }else{
            return "<p>酒店星级："+productLevel.toString()+'星级酒店</p>';
        }
    }
};

var truncProductName = function(productName){
    return productName.length>7?productName.substr(0,7)+'...':productName;
};

var formatProductDetailImage = function(imageArr){
    var returnImage = imageArr;
    if(us.isEmpty(returnImage) || !us.isArray(returnImage)){
        console.error('image data type error!',returnImage);
        return [{url:""},{url:""},{url:""},{url:""},{url:""}];
    }else{
//        console.log('imagelength',returnImage.length);
        if(returnImage.length>=5){
            //有五张图片最好
            return returnImage;
        }else if(returnImage.length == 4 ){
            //如果只有4张，则最后一张用第一张补
            returnImage[4]=returnImage[0];
            return returnImage;
        }else if(returnImage.length == 3){
            //如果只有三张，则第张用第二张补
            returnImage[4]=returnImage[0];
            returnImage[3]=returnImage[1];
            return returnImage;
        }else if(returnImage.length == 2){
            //如果只有三张，则第张用第二张补
            returnImage[4]=returnImage[0];
            returnImage[3]=returnImage[1];
            returnImage[2]=returnImage[0];
//            console.debug('here',returnImage);
            return returnImage;
        }
        else if(returnImage.length == 1){
            //如果只有三张，则第张用第二张补
            returnImage[4]=returnImage[0];
            returnImage[3]=returnImage[0];
            returnImage[2]=returnImage[0];
            returnImage[1]=returnImage[0];
            return returnImage;
        }else{
            return [{url:""},{url:""},{url:""},{url:""},{url:""}];
        }
    }
};


//渲染产品列表页
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
                if(err || res.error!=0){
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
                if(err||res.error!=0){
                    cb(err,null);
                } else {
                    var existImgPreview = {};
                    res.data.forEach(function(d){
                        for(var id in d.image){
                            if(existImgPreview[d.image[id].url]){
                                d.image.shift();
//                                        console.debug('d.image shifted',d.image)
                            }else{
                                existImgPreview[d.image[id].url]="new";
//                                        console.log('aaaa');
                                break;
                            }
                        }
                    });
                    cb(null,res.data);
                }
            });
        }
    ],function(err,res){
        if(err){
            response.redirect('/errorPage');
        }else{
            response.render('web/products',{'products':res[1],'city':{'name':res[0].name}});
        }
    });
};
//渲染产品详情页
exports.getDetail = function(request,response){
    var id = request.params.id; //this is productID
    var httpClient = new HttpClient({
        'host':Config.inf.host,
        'port':Config.inf.port,
        'path':'/product/ticket/detail/'+id,
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
                    //如果是套票或者是打包产品，则上面的大图每个产品取两张，实际上只能用到前三张
                    product.relatedProductID.forEach(function(p){
//                        console.debug('relateProduct', p.product.image);
                        //如果是打包产品或者是套票产品，则先把关联的产品图片格式化，然后再把关联产品的图片复制到大产品中
                        p.product.image = formatProductDetailImage(p.product.image);
                        if(!us.isEmpty(p.product.image[0])){
                            product.image.push(p.product.image[0]);
                        }
                        if(!us.isEmpty(p.product.image[1])){
                            product.image.push(p.product.image[1]);
                        }
                        //产品级别格式化，如果级别为0，则不显示，否则对酒店和门票的级别进行格式化
                        p.product.level = productLevelConvert(p.product.level,p.product.type);
                    });
                }

                //处理图片 如果是门票产品，这里才需要进行formate,否则仅仅会用到product.image中的前三张图片
                product.image = formatProductDetailImage(product.image);
                product.level = productLevelConvert(product.level,product.type);
//                console.debug('debug processed image',product.image);
//                console.debug("level........",product.level);
//                if(parseInt(product.type)==4){
//                    response.render('web/packageDetail',{'product':product});
//                } else {
//                    response.render('web/ticketDetail',{'product':product});
//                }
                response.render('web/productDetail',{'product':product});
            } else {
                response.send(404,res.errorMsg);
            }
        }
    });
};
//ajax 获取打包产品价格日历控件所需要的数据
exports.getPackagePrice = function(req,res){
    try{
        var productID = req.params.productID;
        //获取打包产品的价格数据
        //get server now time
        var now = new Date();
        var sd = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate()+timeZone;
        now.setMonth(now.getMonth()+3);
        var ed = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate()+timeZone;
        var opt = {
            'host':Config.inf.host,
            'port':Config.inf.port,
            'path':'/product/package/price/list/'+ productID + '?effectDate='+new Date(sd).getTime() + '&expiryDate='+new Date(ed).getTime(),
            'method':"GET"
        };
        var http = new HttpClient(opt);
        http.getReq(function(e,r){
            if(e){
                res.json({error:1,errorMsg: e});
            }else{
                if(0===r.error){
                    var prices = {};
                    r.data.forEach(function(p){
                        if(p.inventory>0){
                            var now = new Date(p.date).Format("yyyy-MM-dd");
                            //注意：打包产品的价格后来是他们自己录，展示价格应当是price
                            prices[now] = p.price;
                        }
                    });
                    res.json({error:0,data:prices});
                }else{
                    res.json({error:1,errorMsg: "接口出错！"});
                }
            }
        });
    }catch(e){
            res.json({error:1,errorMsg: e.message});
    }
};
//ajax 获取门票 套票价格有效期数据
exports.getPriceLog = function(req,res){
    try{
        var productID = req.params.productID;
        //如果是套票或者是门票则组织有效期数据
        var o = {
            'host':Config.inf.host,
            'port':Config.inf.port,
            'method':"GET"
        };
        if(parseInt(req.query.productType)==1){
            o.path='/product/ticket/priceLog/list?product='+ productID + "&status=2";
        }else{
            o.path='/product/ticketPackage/priceLog/list?product='+ productID + "&status=2";
        }

//        if(product.type==1){
//            o.path='/product/ticket/priceLog/list?product='+ productID + "&status=2";
//        }else{
//            o.path='/product/ticketPackage/priceLog/list?product='+ productID + "&status=2";
//        }
//        console.error('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',o.path);
        var hc = new HttpClient(o);
        hc.getReq(function(e,r){
            if(e){
                response.send(404,e);
            }else{
                if(0==r.error){
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
                    res.json({error:0,data:pls});
                }else{
                    res.json({error:1,errorMsg: e});
                }
            }
        });
    }catch(e){
           res.json({error:1,errorMsg: e.message});
    }
};

//渲染打包产品订单填写（确认）页
exports.toPkgOrder = function(request,response){
    //todo get calendar time and get price
    var time = request.query.selDate;
    var price = request.query.price;
    var id = request.query.product;
    var httpClient = new HttpClient({
        'host':Config.inf.host,
        'port':Config.inf.port,
        'path':'/product/ticket/detail/'+id,
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
//渲染门票产品订单填写（确认）页
exports.toTktOrder = function(request,response){
    var time = request.query.exDate;
    var price = request.query.sPrice;
    var lid = request.query.lid;
    var isWeekend = request.query.isWeekend;
    var id = request.query.product;
    if(us.isEmpty(time)||us.isEmpty(price)||us.isEmpty(id)||us.isEmpty(isWeekend)||us.isEmpty(lid)){
        response.send(404,'传入参数不正确!');
    }else{
        var httpClient = new HttpClient({
            'host':Config.inf.host,
            'port':Config.inf.port,
            'path':'/product/ticket/detail/'+id,
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
                    console.debug('ticket product detail package render',ret);
                    response.render('web/ticketSubOrder',{product:ret});
                }else{
                    response.send(404,'error message is '+res.errorMsg);
                }
            }
        });
    }
};
//ajax 保存订单 在渲染订单支付页面之前做
exports.saveOrderAction = function(request,response){
    var data = {};
    if(us.isEmpty(request.session) || us.isEmpty(request.session.user) || us.isEmpty(request.session.user._id)){
        //to do: do login errorMsg = "请先登录";        flag = false;
        console.error('save order and go to confirm error',"未登录");
        response.json({error:10010,errorMsg:""});
    }else if(us.isEmpty(request.body.orderPayValue)){
        console.error('save order and go to confirm error',"应付金额错误！");
        response.json({error:10010,errorMsg:"payValue is null"});
    }else if(us.isEmpty(request.body.pid)){
        //to do:产品ID为空
        console.error('save order and go to confirm error',"产品id为空");
        response.json({error:111,errorMsg:"订单异常，请重试!"});
    }else if(us.isEmpty(request.body.orderType)){
        //to do:订单类型为空
        console.error('save order and go to confirm error',"订单类型为空");
        response.json({error:111,errorMsg:"订单异常，请重试!"});
    }else if(us.isEmpty(request.body.num)){
        //to do:产品数量为空
        console.error('save order and go to confirm error',"产品数量为空");
        response.json({error:111,errorMsg:"订单异常，请重试!"});
    }else if(us.isEmpty(request.body.person)){
        //to do:入住人为空
        console.error('save order and go to confirm error',"入住人为空");
        response.json({error:111,errorMsg:"入住人信息填写有误，请重新填写！"});
    }else if(us.isEmpty(request.body.mobile)){
        //to do:联系人手机为空
        console.error('save order and go to confirm error',"联系人手机为空");
        response.json({error:111,errorMsg:"联系人手机填写有误，请重新填写！"});
    }else if( "p" != request.body.orderType && us.isEmpty(request.body.isWeekend)){
        //如果是非套餐(门票、套票)而又没有选择周中周末 则报错
        console.error('save order and go to confirm error',"（门票、套票)而又没有选择周中周末");
        response.json({error:111,errorMsg:"订单异常，请重试!"});
    }else if( "p" != request.body.orderType && us.isEmpty(request.body.lid)){
        //如果是非套餐(门票、套票)而又没有LogID则报错
        console.error('save order and go to confirm error',"(门票、套票)而又没有LogID");
        response.json({error:111,errorMsg:"订单异常，请重试!"});
    }else if((!us.isEmpty(request.body.isNeed) &&  "y"===request.body.isNeed) && (us.isEmpty(request.body.invoiceType)||us.isEmpty(request.body.invoiceTitle)||us.isEmpty(request.body.invoiceAdd))){
        //发票信息不全
        console.error('save order and go to confirm error',"发票信息不全");
        response.json({error:111,errorMsg:"发票信息不全，请重新填写"});
    }else{
        //才开始做真正的逻辑
        data.product        = request.body.pid;
        data.member         = request.session.user._id;
        if((!us.isEmpty(request.body.isNeed) &&  "y"===request.body.isNeed)){
            //如果填了发票才传发票信息
            data.invoiceType    = request.body.invoiceType;
            data.invoiceTitle   = request.body.invoiceTitle;
            data.invoiceAdd     = request.body.invoiceAdd;
        }
        if(!us.isEmpty(request.body.orderCoupon) ){
            data.coupon = request.body.orderCoupon;
        }
        data.payValue        = request.body.orderPayValue;
        data.liveName        = request.body.person;
        data.contactPhone    = request.body.mobile;
        var orderType         = request.body.orderType;
        data.quantity        = request.body.num;
        data.source = "534de2e3309199c11f233cf4";
        if(request.params.source){
            data.source = request.params.source;
        }
        data.payWay = "1";
        data.remark = "";
        if("p"===orderType){
            data.startDate = new Date(request.body.time+timeZone).getTime();
        }else{
            //如果是套票、门票，则需要拆有效期
            var arrays = request.body.time.split('~');
            data.startDate = new Date(arrays[0]+timeZone).getTime();
            data.endDate = new Date(arrays[1]+timeZone).getTime();
            data.isWeekend = "y"===request.body.isWeekend?true:false;
            data.priceLog = request.body.lid;
        }
        var httpClient = new HttpClient({
            'host':Config.inf.host,
            'port':Config.inf.port,
            'path':'/order/save',
            'method':"POST"
        });
        console.debug('save order action data',data);
        httpClient.postReq(data,function(err,result){
            if(err || result.error != 0){
                if(result.error == 502){
                    response.json({error:111,errorMsg:"未支付订单超过10张，暂不允许下单！"});
                }else{
                    response.json({error:111,errorMsg:"产品已售完！"});
                }
            }else{
                response.json( { error:0,_id:result.data._id } );
            }
        });
    }
};
//渲染订单支付页面
exports.renderConfirm = function(req,res){
    var viewData = {};
    if(us.isEmpty(req.params.id)){
        console.error("orderid is empty!",req.params.id);
        res.redirect('/errorPage');
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
                res.redirect('/errorPage');
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
                viewData.payValue = result.payValue;
                viewData.couponValue = result.totalPrice - result.payValue;
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
                res.render('web/orderConfirm',{info:viewData});
            }
        });
    }
};
//ajax 获取关联产品数据
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

