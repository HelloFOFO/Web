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
        if(request.session.autoLogin&&!request.session.user&&request.cookies.m&&request.cookies.p){
            console.log('---------------autoLogin--------------------');
            MemberPageAction.autoLogin(request,function(){
                console.log(request.session.user);
                console.log('---------------autoLogin end--------------------');
                next()
            });
        } else {
            next();
        }
    })
    app.all('/wap/*',function(request,response,next){
        if(us.isEmpty(request.session.user)&&0>request.url.indexOf('login')&&0>request.url.indexOf('doLogin')&&0>request.url.indexOf('forget')&&0>request.url.indexOf('doForget')&&0>request.url.indexOf('register')&&0>request.url.indexOf('doRegister')&&0>request.url.indexOf('notify')){
            response.redirect('/wap/login');
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
    //member
    app.all('/wap/doLogin',MemberPageAction.doLogin);
    app.post('/wap/doRegister',MemberPageAction.doRegister);
    app.post('/wap/doForget',MemberPageAction.forgetPasswd);
    app.get('/wap/userInfo',MemberPageAction.userInfo);
    app.get('/wap/updateUser',MemberPageAction.updateUser);
    //products
    app.get('/wap/products/:id',ProductPageAction.getProducts);
    app.get('/wap/productDetail/:id/:type',ProductPageAction.getDetail);
    app.post('/wap/subOrder',ProductPageAction.toSubOrder);
    app.post('/wap/confirm',ProductPageAction.saveOrder);
    app.get('/wap/productDetailInfo',ProductPageAction.detailInfo);
    app.get('/wap/calendar/:id',ProductPageAction.productCalendar);
    //order
    app.get('/wap/orderDetail/:id',OrderAction.detail);
    //ajax
    app.get('/wap/ajax/cityList',HomePageAction.cityList);

    app.get('/wap/ajax/hotProduct',HomePageAction.hotProduct);
    //alipay for wap
    app.get('/wap/reqTrade/:id/:orderID',AlipayWapAction.getReqTrade);
    app.post('/wap/reqTrade',AlipayWapAction.getReqTrade);
    app.post('/wap/notify/:id',AlipayWapAction.notify);
    app.get('/wap/callback/:id',AlipayWapAction.callBack);
};