/**
 * Created by zzy on 3/27/14.
 */
var HttpClient = require('./../../tools/HttpClient.js');
var Config = require('./../../tools/Config');

exports.login = function(request,response){
    var mobile =request.body.mobile;
    var passwd = request.body.passwd;
    var httpClient = new HttpClient({
        'host':Config.inf.host,
        'port':Config.inf.port,
        'path':'/member/login',
        'method':"POST"
    });
    httpClient.postReq({'mobile':mobile,'passwd':passwd},function(err,res){
        if(!err){
            if(res.data!=null){
                request.session.user = res.data;
            }
        }
        response.redirect('/wap/');
    });
};

exports.register = function(request,response){
    response.render('wap/register');
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
        console.log(err,res);
        if(!err){
            if(res.data!=null){
                request.session.user = res.data;
            }
        }
        response.redirect('/wap/');
    });
};