/**
 * Created by zzy on 3/26/14.
 */
var HttpClient = require('./../../tools/HttpClient.js');
var Config = require('./../../tools/Config');

exports.getHomePage = function(request,response){
    var key = request.query.key;
    var httpClient = new HttpClient({
        'host':Config.inf.host,
        'port':Config.inf.port,
        'path':key?'/web/city/list?key='+key:'/web/city/list',
        'method':"GET"
    });
    httpClient.getReq(function(err,res){
        if(err){
            response.send(err);
        }else{
            if(0===res.error){
                response.render('wap/index',{titleName:'首页',city:res.data});
            }else{
                response.send(res.errorMsg);
            }
        }
    });

};

exports.cityList = function(request,response){
    var key = request.query.key;
    var httpClient = new HttpClient({
        'host':Config.inf.host,
        'port':Config.inf.port,
        'path':key?'/wap/city/list?key='+key:'/wap/city/list',
        'method':"GET"
    });
    httpClient.getReq(function(err,res){
        response.json(res);
    });
};

exports.hotProduct = function(request,response){
    var city = request.query.city;
    var httpClient = new HttpClient({
        'host':Config.inf.host,
        'port':Config.inf.port,
        'path':'/wap/product/hotList/'+city+'?hot=true',
        'method':"GET"
    });
    httpClient.getReq(function(err,res){
        response.json(res);
    });
};

//go to login
exports.toLogin =  function(request,response){
    if(request.session.user){
       response.redirect('/wap/');
    }else{
        response.render('wap/login',{titleName:'登录'});
    }
}

//go to register
exports.register = function(request,response){
    response.render('wap/register',{titleName:'注册'});
};

//go to aboutUs
exports.aboutUs = function(request,response){
    response.render('wap/aboutUs',{titleName:'关于我们'});
}

//go to forget
exports.forget = function(request,response){
    response.render('wap/forgetPw',{titleName:'忘记密码'});
}

//logout
exports.logOut = function(request,response){
    request.session.user=null;
    request.session.autoLogin = false;
    response.cookie('m',null);
    response.cookie('p',null);
    response.redirect('/wap/login');
}