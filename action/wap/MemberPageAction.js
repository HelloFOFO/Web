/**
 * Created by zzy on 3/27/14.
 */
var HttpClient = require('./../../tools/HttpClient.js');
var Config = require('./../../tools/Config');

exports.doLogin = function(request,response){
    var mobile = request.body.mobile?request.body.mobile:request.cookies.m;
    var passwd = request.body.passwd?request.body.passwd:request.cookies.p;
    var autoLogin = request.body.autoLogin==='true';
    if(autoLogin){
        response.cookie('m',mobile,{'maxAge':7*24*3600*1000});
        response.cookie('p',passwd,{'maxAge':7*24*3600*1000});
    }
    var httpClient = new HttpClient({
        'host':Config.inf.host,
        'port':Config.inf.port,
        'path':'/member/login',
        'method':"POST"
    });
    httpClient.postReq({'mobile':mobile,'passwd':passwd},function(err,res){
        if(err){
            response.send('系统异常，请重试!');
        } else {
            if(res.data){
                request.session.user=res.data;
                if(autoLogin){
                    request.session.autoLogin = true;
                }
                response.send('success');
            } else {
                response.send('failed');
            }

        }
    });
};

exports.autoLogin = function(request,fn){
    var mobile = request.cookies.m;
    var passwd = request.cookies.p;
    var httpClient = new HttpClient({
        'host':Config.inf.host,
        'port':Config.inf.port,
        'path':'/member/login',
        'method':"POST"
    });
    httpClient.postReq({'mobile':mobile,'passwd':passwd},function(err,res){
        if(!err){
            request.session.user=res.data;
            request.session.autoLogin=true;
        }
        fn();
    });
};

exports.doRegister = function(request,response){
    var mobile =request.body.mobile;
    var passwd = request.body.passwd;
    var httpClient = new HttpClient({
        'host':Config.inf.host,
        'port':Config.inf.port,
        'path':'/member/wap/register',
        'method':"POST"
    });
    httpClient.postReq({'mobile':mobile,'passwd':passwd},function(err,res){
        if(!err){
            if(0===res.error){
                request.session.user = res.data;
                request.session.autoLogin = true;
                response.cookie('m',mobile,{'maxAge':7*24*3600*1000});
                response.cookie('p',passwd,{'maxAge':7*24*3600*1000});
                response.send('success');
            }else{
                response.send(res.errorMsg);
            }
        }else{
            response.send('系统异常，请重试!');
        }
    });
};

//forget
exports.forgetPasswd = function(request,response){
    var mobile = request.body.mobile;
    var passwd = request.body.passwd;
    var code = request.body.code;
    console.log(mobile,passwd,code);
    var httpClient = new HttpClient({
        'host':Config.inf.host,
        'port':Config.inf.port,
        'path':'/member/password/change',
        'method':"POST"
    });
    httpClient.postReq({'mobile':mobile,'passwd':passwd},function(err,res){
        if(err){
            response.send('系统异常，请重试!');
        } else {
            if(res.error==0){
                request.session.user=res.data;
                request.session.autoLogin = true;
                response.cookie('m',mobile,{'maxAge':7*24*3600*1000});
                response.cookie('p',passwd,{'maxAge':7*24*3600*1000});
                response.send('success');
            } else {
                response.send(res.errorMsg);
            }
        }
    });
};

exports.userInfo = function(request,response){
    var id = "";
    if(request.session.user){
        id = request.session.user._id;
        var httpClient = new HttpClient({
            'host':Config.inf.host,
            'port':Config.inf.port,
            'path':'/ent/agent/member/detail/'+id,
            'method':"GET"
        });
        httpClient.getReq(function(err,res){
            if(err){
                response.send(404,err);
            } else {
                if(0===res.error){
                    response.render('wap/userInfo',{titleName:'个人信息','u':res.data});
                }else{
                    response.send(404,res.errorMsg);
                }
            }
        });
    }else{
        response.render('wap/login',{titleName:'登录'});
    }
}

exports.updateUser = function(request,response){
    response.send('/wap/');
}