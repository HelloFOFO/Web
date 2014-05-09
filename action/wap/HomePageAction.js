/**
 * Created by zzy on 3/26/14.
 */
var HttpClient = require('./../../tools/HttpClient.js');
var Config = require('./../../tools/Config');
var async = require('async');
var action = this;
exports.getHomePage = function(request,response){
    async.waterfall([
        function(cb){
            var httpClient = new HttpClient({
                'host':Config.inf.host,
                'port':Config.inf.port,
                'path':'/city/default',
                'method':"GET"
            });
            httpClient.getReq(function(err,res){
                if(err){
                    cb('error',err);
                }else{
                    if(0===res.error){
                        cb(null,res.data);
                    }else{
                        cb('error',res.errorMsg);
                    }
                }
            });
        },
        function(pre,cb){
            action.getRelateHotProducts(pre._id,function(err,res){
                res.default = pre;
                cb(err,res);
            });
        },
        function(pre,cb){
            var key = request.query.key;
            var httpClient = new HttpClient({
                'host':Config.inf.host,
                'port':Config.inf.port,
                'path':key?'/city/list?key='+key:'/city/list',
                'method':"GET"
            });
            httpClient.getReq(function(err,res){
                if(err){
                    cb('error',err);
                }else{
                    if(0===res.error){
                        res.default = pre.default;
                        res.relate = pre.data;
                        cb(null,res);
                    }else{
                        cb('error',res.errorMsg);
                    }
                }
            });
        }
    ],function(e,r){
        if(e){
            response.send(r);
        }else{
//            console.log(r);
            response.render('wap/home',{titleName:'首页',data: r});
        }
    });
};

//get city relate hot products list
this.getRelateHotProducts = function(cityId,fn){
    var httpClient = new HttpClient({
        'host':Config.inf.host,
        'port':Config.inf.port,
        'path':'/product/webList/'+cityId+'?isHot=true',
        'method':"GET"
    });
    httpClient.getReq(function(err,res){
        if(err){
            fn('error',err);
        }else{
            if(0===res.error){
                fn(null,res);
            }else{
                fn('error',res.errorMsg);
            }
        }
    });
}

exports.cityList = function(request,response){
    var key = request.query.key;
    var httpClient = new HttpClient({
        'host':Config.inf.host,
        'port':Config.inf.port,
        'path':key?'/city/list?key='+key:'/city/list',
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
        //如果没登录过，而又进了登录页，要先看看他是不是主动进的登录页，如果不是，则把前序页面传过去,否则传空，然后前端会去做判断
        console.debug('login redirect url %s',request.url);
        if(request.url!="/wap/login"){
            response.render('wap/login',{titleName:'登录',prePage:request.url});
        }else{
            response.render('wap/login',{titleName:'登录',prePage:""});
        }

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