/**
 * Created by zzy on 3/26/14.
 */

var HomePageAction = require('./../action/wap/HomePageAction');
var ProductPageAction = require('./../action/wap/ProductPageAction');
var MemberPageAction = require('./../action/wap/MemberPageAction');
module.exports = function(app){
    app.all('/wap/*',function(request,response,next){
        response.charset = 'utf-8';
        next();
    })

    app.get('/wap/register',MemberPageAction.register);
    app.all('/wap/login',MemberPageAction.login);
    app.post('/wap/doRegister',MemberPageAction.doRegister);

    app.all('/wap/*',function(request,response,next){
        if(request.session.user==null){
            response.render('wap/login');
        } else {
            next();
        }
    });

    app.get('/wap/',HomePageAction.getHomePage);
    app.get('/wap/products/:id',ProductPageAction.getProducts);
    app.get('/wap/productDetail/:id',ProductPageAction.getDetail);


    //ajax
    app.get('/wap/ajax/cityList',HomePageAction.cityList);

    app.get('/wap/ajax/hotProduct',HomePageAction.hotProduct);
};