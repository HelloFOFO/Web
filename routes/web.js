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
    //获取手机验证码
    app.post('/getVerifyCode',MemberAction.getVerifyCode);
    app.post('/login',MemberAction.login);
    app.get('/errorPage',function(req,res){res.render('./web/errorPage')});

    app.all('/*',function(request,response,next){
        response.charset = 'utf-8';
        if(request.session && request.cookies){
            //如果session超时了，但是cookie里还有东西，则帮用户重新登录
            if(request.session.autoLogin && !request.session.user && request.cookies.m && request.cookies.p){
                MemberAction.autoLogin(request,function(){
                    console.log('---------------listen end--------------------');
                    next();
                });
            } else {
                next();
            }
        }else{
           next();
        }

    });

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
//订单相关
    app.get('/package/fill',ProductPageAction.toPkgOrder);
    app.get('/ticket/fill',ProductPageAction.toTktOrder);
    app.post('/order/submit',ProductPageAction.saveOrderAction);
    app.get('/order/confirm/:id',ProductPageAction.renderConfirm);


    app.get('/govNotice',NoticeAction.noticeList);
    app.get('/noticeDetail/:id',NoticeAction.detail);
    app.post('/saveUserInfo',MemberAction.saveUserInfo);
    app.get('/orders',OrderAction.orders);
    app.get('/orderDetail/:id',OrderAction.detail);

    //alipay for web
    app.get('/web/reqTrade/:_id/:oid',AlipayWebAction.getReqTrade);
//    app.post('/web/reqTrade',AlipayWebAction.reqTrade);
    app.post('/web/notify/:id',AlipayWebAction.notify);
    app.get('/web/callback/:id',AlipayWebAction.callBack);

    //ajax
    app.get('/ajax/cityBox',HomePageAction.cityBox);
    app.get('/getCityDetail',HomePageAction.getCityDetail);

    //静态公告
    app.get('/noticeDetailStatic/:id',function(req,res){
         console.log('aaaa');
        if(req.params.id=="201411"){
            res.render("web/noticeDetailStatic",{  title:"驾专委[2014]第011号",
                        createDate:"2014年03月28日16:25:55",
                        imageURL:"http://dd885.b0.upaiyun.com/9a1afe0002993639d7a34afe.jpg"});
        }else if(req.params.id=="201473"){
            res.render("web/noticeDetailStatic",{  title:"驾专委[2014]第073号",
                        createDate:"2014年03月28日16:25:55",
                        imageURL:"http://dd885.b0.upaiyun.com/8c71dc911d9d94266e6ddb99.jpg"});
        }else{
            res.render("web/noticeDetailStatic",{title:"",createDate:"",imageURL:""});
        }
    });
//    app.get('/web/ajax/cityList',HomePageAction.cityList);
//
//    app.get('/web/ajax/hotProduct',HomePageAction.hotProduct);
};