/**
 * Created by zzy on 4/3/14.
 */
var HttpClient = require('./../../tools/HttpClient.js');
var Config = require('./../../tools/Config');
var async = require('async');
var _ = require('underscore');

exports.saveUserInfo = function(request,response){
    try{
        var memberId = request.session.user._id;
        console.log(request.session.user);
        var httpClient = new HttpClient({
            'host':Config.inf.host,
            'port':Config.inf.port,
            'path':'/ent/agent/member/update/'+memberId,
            'method':"POST"
        });

        httpClient.postReq(request.body,function(err,result){
            console.debug('saveUserInfos post data is:',request.body);
            if(err || result.error != 0){
                console.error("saveUserInfo Error",err,result);
            }
            //如果有前置页面，则跳转到前置页面，否则跳转到首页,因为是共享wap和web，所以判断一下如果是wap过来的跳转到wap首页
            if( request.body.prePage != "" ){
                console.debug("userInfo page's referer is:",request.body.prePage);
                response.redirect( request.body.prePage );
            }else{
                if(/wap\//.test(request.url)){
                    response.redirect('/wap/');
                }else{
                    response.redirect('/');
                }
            }
        });
    }catch(e){
        console.log("saveUserInfo Error2", e.message);
        if(/wap\//.test(request.url)){
            response.redirect('/wap/');
        }else{
            response.redirect('/');
        }
    }
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
        if( err || res.error != 0 ){
            console.error(__dirname,err,res);
            response.redirect('/errorPage');
        } else {
            var prePage = request.headers['referer'];
            if(!prePage || /userInfo/.test(prePage)){
                //如果前置页面是自己，则传空，否则使用前置页面
                prePage = "";
            }
            response.render('web/userInfo',{'u':res.data,prePage:prePage});
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
    var type   = req.body.type;
    async.waterfall([function(cb){
        var mobile = req.body.mobile;
        console.debug('mobile is '+mobile);
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
        var http = new HttpClient({
            'host':Config.inf.host,
            'port':Config.inf.port,
            'path':'/member/code',
            'method':"POST"
        });
        //string:'register | forget '
        type = type=='register'?0:1;
        http.postReq({mobile:result.mobile,ip:req.ip,type:type},function(error,data){
            if(error || data.error != 0 ){
                console.error("获取验证码失败,请求验证码的手机为%s,请求验证码的ip为%s,返回的错误数据为%s",result.mobile,req.ip,error,data);
                cb('getCodeError',null);
            }else{
                console.debug('debug /member/code',data);
                cb(null,data);
            }
        });
    }],function(error,result){
            console.log("verify code return result is",result);
            var result={error:0,errorMsg:""};
            if(error){
                switch (error){
                    case "mobileError":          result = {error:1,errorMsg:"手机号格式错误！"};break;
                    case "typeError":            result = {error:2,errorMsg:"异常！"};break;
                    case "doubleRegisterError": result = {error:3,errorMsg:"此号码已经注册！"};break;
                    case "noRegisterError":     result = {error:4,errorMsg:"此号码尚未注册！"};break;
                    case "getCodeError":        result = {error:5,errorMsg:"获取验证码异常！"};break;
                    default :result = result;
                }
            }
            res.json(result);
    });
};
