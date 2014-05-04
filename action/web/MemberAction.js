/**
 * Created by zzy on 4/3/14.
 */
var HttpClient = require('./../../tools/HttpClient.js');
var Config = require('./../../tools/Config');
var async = require('async');
var _ = require('underscore');

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
};

exports.userOrder = function(request,response){
    var id = request.params.id;
    response.render('web/myOrder');
}

exports.logout = function(request,response){
    request.session.user=null;
    request.session.autoLogin = false;
    response.redirect("/");
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
        'path':'/member/534de2e3309199c11f233cf4/register',
        'method':"POST"
    });
    httpClient.postReq({'mobile':mobile,'passwd':passwd,'code':code,'operator':"534f9b073b4fec3f208952e0"},function(err,res){
        if(err || res.error!=0 ){
            console.log(err,res);
            response.send('注册失败');
        } else {
            request.session.user=res.data;
            request.session.autoLogin = true;
            response.send('success');
        }
    });
};

exports.forgetPasswd = function(request,response){
    var mobile = request.body.mobile;
    var passwd = request.body.passwd;
    var code   = request.body.code;
    console.log(mobile,passwd,code);
    var httpClient = new HttpClient({
        'host':Config.inf.host,
        'port':Config.inf.port,
        'path':'/member/password/change',
        'method':"POST"
    });
    httpClient.postReq({'mobile':mobile,'passwd':passwd,'code':code},function(err,res){
            if(err || res.error!=0 ){
                console.log("修改密码错误！",res,err);
                response.send(res.errorMsg);
            } else {
                request.session.user=res.data;
                request.session.autoLogin = true;
                response.cookie('p',passwd,{'maxAge':7*24*3600*1000});
                response.send('success');
            }
    });
};


exports.getVerifyCode = function(req,res){
    async.waterfall([function(cb){
        var mobile = req.body.mobile;
        var type   = req.body.type;
//        console.log('1');
        if( _.isEmpty(mobile) || !/\d{11,11}/.test(mobile) || mobile.length!=11 ){
//            console.log('6');
            cb('mobileError',null);
        }else if(type!='register' && type != 'forget'){
//            console.log('5');
            cb('typeError',null);
        }else{
//            console.log('2');
            var http = new HttpClient({
                'host':Config.inf.host,
                'port':Config.inf.port,
                'path':"/member/exists/"+mobile,
                'method':"GET"
            });
            http.getReq(function(error,result){
                if(error || result.error != 0){
                    cb('other',null);
                }else{
                    if(type=="register" && result.data==true){
                         cb('doubleRegisterError',null);
                    }else if(type=="forget" && result.data==false){
                         cb('noRegisterError',null);
                    }else{
                        cb(null,{mobile:mobile});
                    }
                }
            });
        }
    },function(result,cb){
        console.log('3');
        var http = new HttpClient({
            'host':Config.inf.host,
            'port':Config.inf.port,
            'path':'/member/code',
            'method':"POST"
        });
        console.log({mobile:result.mobile,ip:""});
        http.postReq({mobile:result.mobile,ip:""},function(error,result){
            if(error || result.error != 0 ){
                console.log("获取验证码失败",error,result);
                cb('getCodeError',null);
            }else{
                console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',result);
                cb(null,result);
            }
        });
    }],function(error,result){
            console.log(result);
            var result={};
            if(error){
                switch (error){
                    case "mobileError":          result = {error:1,errorMsg:"手机号格式错误！"};break;
                    case "typeError":            result = {error:2,errorMsg:"异常！"};break;
                    case "doubleRegisterError": result = {error:3,errorMsg:"此号码已经注册！"};break;
                    case "noRegisterError":     result = {error:4,errorMsg:"此号码尚未注册！"};break;
                    case "getCodeError":        result = {error:5,errorMsg:"获取验证码异常！"};break;
                    default :result = error;
                }
            }
            res.json({error:0,errorMsg:""});
    });
};
