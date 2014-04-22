/**
 * Created by zzy on 3/26/14.
 */
var HttpClient = require('./../../tools/HttpClient.js');
var Config = require('./../../tools/Config');

exports.getHomePage = function(request,response){
    response.render('wap/index',{'city':{'name':'上海','_id':'5326a195b8d99d2f7b504229','images':[]}});
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