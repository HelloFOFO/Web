/**
 * Created by zzy on 3/26/14.
 */

var HomePageAction = require('./../action/wap/HomePageAction');
var ProductPageAction = require('./../action/wap/ProductPageAction');
var ProductPageActionWeb = require('./../action/web/ProductPageAction');
var MemberPageAction = require('./../action/wap/MemberPageAction');
var AlipayWapAction = require('./../action/wap/AlipayWapAction');
var OrderAction = require('./../action/wap/OrderAction');
var UserAuth = require('./../tools/UserAuth.js');

var us = require('underscore');
module.exports = function(app){

    app.all('/wap/*',function(request,response,next){
        response.charset = 'utf-8';
        if(request.session && request.cookies){
            //如果session超时了，但是cookie里还有东西，则帮用户重新登录
            if( request.session.autoLogin && !request.session.user && request.cookies.m && request.cookies.p ){
                console.log('---------------autoLogin--------------------');
                MemberPageAction.autoLogin(request,function(){
                    console.log('---------------autoLogin end--------------------');
                    next();
                });
            } else {
                next();
            }
        }else{
            next();
        }
    });

//    app.all('/wap/*',function(request,response,next){
//        if(us.isEmpty(request.session.user) && 0>request.url.indexOf('login') && 0>request.url.indexOf('doLogin') && 0>request.url.indexOf('forget')&&0 >request.url.indexOf('doForget') && 0>request.url.indexOf('register') && 0>request.url.indexOf('doRegister') && 0>request.url.indexOf('notify')){
//            //如果被访问的页面需要登录，但是现在还没有登录，则跳登录页面，跳登录页的时候把前序页面记录下来，并传给登录页action
//            console.log('your request page need a login %s',request.url);
//            HomePageAction.toLogin(request,response);
//        } else {
//            next();
//        }
//    });
<<<<<<< HEAD

=======
>>>>>>> 08bad628f51d65c66aef701a6d8a485ff9d95c55
    //home go
    app.get('/wap/',HomePageAction.getHomePage);
    app.all('/wap/login',HomePageAction.toLogin);
    app.get('/wap/about',HomePageAction.aboutUs);
    app.get('/wap/register',HomePageAction.register);
    app.get('/wap/forget',HomePageAction.forget);
    app.get('/wap/logout',HomePageAction.logOut);





    app.get('/wap/errorPage',function(req,res){res.render('wap/errorPage')});

    //需要做验证的页面
    app.get('/wap/orderDetail/:id' , UserAuth.WapAuth , OrderAction.detail);//订单详情页
    app.get('/wap/orders/:type', UserAuth.WapAuth , OrderAction.orders);//订单列表页，分已付款和未付款列表
    app.get('/wap/userInfo', UserAuth.WapAuth , MemberPageAction.renderUserInfo);//查看修改用户信息
    app.get('/wap/subOrder', UserAuth.WapAuth , ProductPageAction.toSubOrder);//订单填写页
    app.get('/wap/order/confirm/:id', UserAuth.WapAuth , ProductPageAction.renderConfirm);//订单确认页，最后会去跳付款

    //member
    app.all('/wap/doLogin',MemberPageAction.doLogin);


    app.post('/wap/doRegister',MemberPageAction.doRegister);
    app.post('/wap/doForget',MemberPageAction.forgetPasswd);

    app.get('/wap/updateUser',MemberPageAction.updateUser);
    //products
    app.get('/wap/products/:id',ProductPageAction.getProducts);
    //微信专用
    app.get('/wap/productList/:type',ProductPageAction.getProductList);
    app.get('/wap/productDetail/:id/:type',ProductPageAction.getDetail);

    app.get('/wap/productDetails/:id',ProductPageAction.productDetail);


    app.post('/wap/order/submit',ProductPageActionWeb.saveOrderAction);

//    app.post('/wap/confirm',ProductPageAction.saveOrder);
    app.get('/wap/productDetailInfo',ProductPageAction.detailInfo);
    app.get('/wap/calendar/:id',ProductPageAction.productCalendar);
    //order



    //ajax
    app.get('/wap/ajax/cityList',HomePageAction.cityList);

    app.get('/wap/ajax/hotProduct',HomePageAction.hotProduct);

    //alipay for wap
    app.get('/wap/reqTrade/:_id/:oid',AlipayWapAction.getReqTrade);
    app.post('/wap/reqTrade',AlipayWapAction.getReqTrade);
    app.post('/wap/notify/:id',AlipayWapAction.notify);
    app.get('/wap/callback/:id',AlipayWapAction.callBack);
};