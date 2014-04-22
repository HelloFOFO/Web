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
        next();
    })
//    app.all('/wap/*',function(request,response,next){
//        if(request.session.user==null){
//            response.render('wap/login');
//        } else {
//            next();
//        }
//    });

    app.get('/wap/',HomePageAction.getHomePage);
    app.all('/wap/login',HomePageAction.toLogin);
    app.get('/wap/about',HomePageAction.aboutUs);

    //member
    app.get('/wap/register',HomePageAction.register);
    app.all('/wap/doLogin',MemberPageAction.login);
    app.post('/wap/doRegister',MemberPageAction.doRegister);

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