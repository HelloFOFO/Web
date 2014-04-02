/**
 * Created by zzy on 3/26/14.
 */

var HomePageAction = require('./../action/wap/HomePageAction');
var ProductPageAction = require('./../action/web/ProductPageAction');
var NoticeAction = require('./../action/web/NoticeAction');
var MemberPageAction = require('./../action/wap/MemberPageAction');
module.exports = function(app){
    app.all('/web/*',function(request,response,next){
        response.charset = 'utf-8';
        next();
    })

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
    app.get('/web/products/:id',ProductPageAction.getProducts);
    app.get('/web/productDetail/:id',ProductPageAction.getDetail);
    app.get('/web/govNotice',NoticeAction.noticeList);
    app.get('/web/noticeDetail/:id',NoticeAction.detail);

    //ajax
//    app.get('/web/ajax/cityList',HomePageAction.cityList);
//
//    app.get('/web/ajax/hotProduct',HomePageAction.hotProduct);
};