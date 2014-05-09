/**
 * Created by zzy on 3/26/14.
 */

var HomePageAction = require('./../action/wap/HomePageAction');
var ProductPageAction = require('./../action/wap/ProductPageAction');
var MemberPageAction = require('./../action/wap/MemberPageAction');
var AlipayWapAction = require('./../action/wap/AlipayWapAction');
var OrderAction = require('./../action/wap/OrderAction');
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

    app.all('/wap/*',function(request,response,next){
        if(us.isEmpty(request.session.user) && 0>request.url.indexOf('login') && 0>request.url.indexOf('doLogin') && 0>request.url.indexOf('forget')&&0 >request.url.indexOf('doForget') && 0>request.url.indexOf('register') && 0>request.url.indexOf('doRegister') && 0>request.url.indexOf('notify')){
            //如果被访问的页面需要登录，但是现在还没有登录，则跳登录页面，跳登录页的时候把前序页面记录下来，并传给登录页action
            console.log('your request page need a login %s',request.url);
            HomePageAction.toLogin(request,response);
        } else {
            next();
        }
    });
    //home go
    app.get('/wap/',HomePageAction.getHomePage);
    app.all('/wap/login',HomePageAction.toLogin);
    app.get('/wap/about',HomePageAction.aboutUs);
    app.get('/wap/register',HomePageAction.register);
    app.get('/wap/forget',HomePageAction.forget);
    app.get('/wap/logout',HomePageAction.logOut);


    app.get('/wap/errorPage',function(req,res){res.render('wap/errorPage')});
    //member
    app.all('/wap/doLogin',MemberPageAction.doLogin);
    app.post('/wap/doRegister',MemberPageAction.doRegister);
    app.post('/wap/doForget',MemberPageAction.forgetPasswd);
    app.get('/wap/userInfo',MemberPageAction.userInfo);
    app.get('/wap/updateUser',MemberPageAction.updateUser);
    //products
    app.get('/wap/products/:id',ProductPageAction.getProducts);
    //微信专用
    app.get('/wap/productList/:type',ProductPageAction.getProductList);
    app.get('/wap/productDetail/:id/:type',ProductPageAction.getDetail);

    app.get('/wap/productDetails/:id',ProductPageAction.productDetail);

    app.post('/wap/subOrder',ProductPageAction.toSubOrder);
    app.post('/wap/confirm',ProductPageAction.saveOrder);
    app.get('/wap/productDetailInfo',ProductPageAction.detailInfo);
    app.get('/wap/calendar/:id',ProductPageAction.productCalendar);
    //order
    app.get('/wap/orderDetail/:id',OrderAction.detail);
    app.get('/wap/orders/:type',OrderAction.orders);//unpaid or all

    //ajax
    app.get('/wap/ajax/cityList',HomePageAction.cityList);

    app.get('/wap/ajax/hotProduct',HomePageAction.hotProduct);

    //alipay for wap
    app.get('/wap/reqTrade/:_id/:oid',AlipayWapAction.getReqTrade);
    app.post('/wap/reqTrade',AlipayWapAction.getReqTrade);
    app.post('/wap/notify/:id',AlipayWapAction.notify);
    app.get('/wap/callback/:id',AlipayWapAction.callBack);
};