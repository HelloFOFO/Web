/**
 * Created by zzy on 3/26/14.
 */

var HomePageAction = require('./../action/web/HomePageAction');
var ProductPageAction = require('./../action/web/ProductPageAction');
var NoticeAction = require('./../action/web/NoticeAction');
var MemberAction = require('./../action/web/MemberAction');
var OrderAction = require('./../action/web/OrderAction');
var AlipayWebAction = require('./../action/web/AlipayWebAction');
module.exports = function(app){
    app.post('/login',MemberAction.login);
    app.all('/*',function(request,response,next){
        response.charset = 'utf-8';
        if(request.session.autoLogin&&!request.session.user&&request.cookies.m&&request.cookies.p){
            console.log('---------------listen--------------------');
            MemberAction.autoLogin(request,function(){
                console.log(request.session.user);
                console.log('---------------listen end--------------------');
                next()
            });
        } else {
            next();
        }
    });

//    app.get('/web/register',MemberPageAction.register);
//    app.post('/web/login',MemberPageAction.login);
//    app.post('/web/doRegister',MemberPageAction.doRegister);
//    app.all('/web/*',function(request,response,next){
//        if(request.session.user==null){
//            response.render('wap/login')
//        } else {
//            next();
//        }
//    })
//    app.get('/web/',HomePageAction.getHomePage);

    app.get('/',HomePageAction.home);
    app.post('/register',MemberAction.register);
    app.post('/forgetPasswd',MemberAction.forgetPasswd);
    app.post('/logout',MemberAction.logout);
    app.get('/aboutUs',function(request,response){
        response.render('web/aboutUs');
    });
    app.get('/hotProductListByCity',HomePageAction.hotProduct);

    app.get('/userInfo/:id',MemberAction.userInfo);
    app.get('/products/:id',ProductPageAction.getProducts);
    app.get('/productDetail/:id',ProductPageAction.getDetail);
    app.get('/product/relevance/:productID',ProductPageAction.getRelevanceProduct);

    app.post('/package/fill',ProductPageAction.toPkgOrder);
    app.post('/package/submitOrder',ProductPageAction.toConfirm);
    app.post('/ticket/fill',ProductPageAction.toTktOrder);
    app.post('/ticket/submitOrder',ProductPageAction.toConfirm);

    app.get('/govNotice',NoticeAction.noticeList);
    app.get('/noticeDetail/:id',NoticeAction.detail);
    app.post('/saveUserInfo',MemberAction.saveUserInfo);
    app.get('/orders',OrderAction.orders);
    app.get('/orderDetail/:id',OrderAction.detail);

    //alipay for web
    app.get('/web/reqTrade/:_id/:oid',AlipayWebAction.getReqTrade);
    app.post('/web/reqTrade',AlipayWebAction.reqTrade);
    app.post('/web/notify/:id',AlipayWebAction.notify);
    app.get('/web/callback/:id',AlipayWebAction.callBack);

    //ajax
    app.get('/ajax/cityBox',HomePageAction.cityBox);
//    app.get('/web/ajax/cityList',HomePageAction.cityList);
//
//    app.get('/web/ajax/hotProduct',HomePageAction.hotProduct);
};