/**
 * Created by zzy on 4/3/14.
 */
var HttpClient = require('./../../tools/HttpClient.js');
var Config = require('./../../tools/Config');

exports.saveUserInfo = function(request,response){
    response.redirect('/');
};

exports.userInfo = function(request,response){
    var id = request.params.id;
    var httpClient = new HttpClient({
        'host':Config.inf.host,
        'port':Config.inf.port,
        'path':'/ent/agent/member/detail/'+id,
        'method':"GET"
    });
    httpClient.getReq(function(err,res){
        if(err){
            response.send(404,'fuck 404');
        } else {
            response.render('web/userInfo',{'u':res.data});
        }
    });
}

exports.userOrder = function(request,response){
    var id = request.params.id;
    response.render('web/myOrder');
}

exports.logout = function(request,response){
    var url = require('url');
    request.session.user=null;
    request.session.autoLogin = false;
    var referer = url.parse(request.get('Referer'));
    response.redirect(referer.pathname);
};

exports.autoLogin = function(request,fn){
    var mobile = request.body.mobile?request.body.mobile:request.cookies.m;
    var passwd = request.body.passwd?request.body.passwd:request.cookies.p;
    var httpClient = new HttpClient({
        'host':Config.inf.host,
        'port':Config.inf.port,
        'path':'/member/login',
        'method':"POST"
    });
    httpClient.postReq({'mobile':mobile,'passwd':passwd},function(err,res){
        if(!err){
            request.session.user=res.data;
        }
        fn();
    });
};

exports.login = function(request,response){
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
            response.send(404,'fuck 404');
        } else {
            if(res.data){
                request.session.user=res.data;
                request.session.autoLogin = true;
                response.send('success');
            } else {
                response.send('failed');
            }

        }
    });
};


exports.register = function(request,response){
    var mobile = request.body.mobile;
    var passwd = request.body.passwd;
    var code = request.body.code;
    var httpClient = new HttpClient({
        'host':Config.inf.host,
        'port':Config.inf.port,
        'path':'/member/web/register',
        'method':"POST"
    });
    httpClient.postReq({'mobile':mobile,'passwd':passwd},function(err,res){
        if(err){
            response.send(404,'fuck 404');
        } else {
            if(res.error==0){
                request.session.user=res.data;
                request.session.autoLogin = true;
                response.send('success');
            } else {
                response.send(res.errorMsg);
            }

        }
    });
};

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
            response.send(404,'fuck 404');
        } else {
            if(res.error==0){
                request.session.user=res.data;
                request.session.autoLogin = true;
                response.send('success');
            } else {
                response.send(res.errorMsg);
            }
        }
    });
};

