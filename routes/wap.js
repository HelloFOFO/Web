/**
 * Created by zzy on 3/26/14.
 */

var HomePageAction = require('./../action/wap/HomePageAction');
var ProductPageAction = require('./../action/wap/ProductPageAction');
var MemberPageAction = require('./../action/wap/MemberPageAction');
var AlipayWapAction = require('./../action/wap/AlipayWapAction');
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
//    app.all('/wap/*',function(request,response,next){
//        if(request.session.user==null){
//            response.render('wap/login');
//        } else {
//            next();
//        }
//    });
    //home go
    app.get('/wap/',HomePageAction.getHomePage);
    app.all('/wap/login',HomePageAction.toLogin);
    app.get('/wap/about',HomePageAction.aboutUs);
    app.get('/wap/register',HomePageAction.register);
    app.get('/wap/forget',HomePageAction.forget);
    //member
    app.all('/wap/doLogin',MemberPageAction.doLogin);
    app.post('/wap/doRegister',MemberPageAction.doRegister);
    app.post('/wap/doForget',MemberPageAction.forgetPasswd);

    app.get('/wap/products/:id',ProductPageAction.getProducts);
    app.get('/wap/productDetail/:id',ProductPageAction.getDetail);


    //ajax
    app.get('/wap/ajax/cityList',HomePageAction.cityList);

    app.get('/wap/ajax/hotProduct',HomePageAction.hotProduct);
    //alipay for web
//    app.get('/wap/reqTrade/:_id/:oid',AlipayWapAction.getReqTrade);
//    app.post('/wap/reqTrade',AlipayWapAction.reqTrade);
    app.get('/wap/reqTrade',AlipayWapAction.getReqTrade);
    app.post('/wap/notify/:id',AlipayWapAction.notify);
    app.get('/wap/callback/:id',AlipayWapAction.callBack);
};