/**
 * Created by zzy on 3/19/14.
 */
var HttpClient = require('./../tools/HttpClient.js');
var async = require('async');
var config = require('./../tools/Config.js');
exports.login = function(request,response){
    async.waterfall([
        function(cb){
            var client = new HttpClient({
                hostname:config.inf.host,
                port:config.inf.port,
                path:'/member/login',
                method:'POST'
            });
            client.postReq({
                'mobile':request.body.mobile,
                'passwd':request.body.passwd
            },function(error,result){
                cb(error,result);
            });
        },
        function(member,cb){
            var client = new HttpClient({
                hostname:config.inf.host,
                port:config.inf.port,
                path:'/module/shortList',
                method:'GET'
            });
            client.getReq(function(err,res){
                if(member.data!=null&&res.data!=null){
                    request.session.user = member.data;
                    cb(null,res);
                } else {
                    cb('用户名或密码错误！',null)
                }
            });
        }
    ],function(err,res){
        if(err){
            response.render('index',{});
        } else {
//            if(request.session.user!=null){
                var result = {};
                var cat;
                for(var i in res.data){
                    if(cat!==res.data[i].cat){
                        cat = res.data[i].cat;
                        result[res.data[i].cat]=[];
                    }
                    result[res.data[i].cat].push(res.data[i]);
                }
                request.session.user.modules = result;
                console.log(request.session.user);
//            }
//            console.log(result);
            response.render('welcome',{userModules:request.session.user.modules});
        }
    });
};