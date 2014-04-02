/**
 * Created by cloudbian on 14-3-19.
 */
var httpClient = require('./../tools/HttpClient.js');
var async = require('async');
var config = require('./../tools/Config.js');
exports.viewProviderMemberManager = function(req,res){
        async.waterfall([
            //get list
            function(cb){
                var opt = {
                    hostname:config.inf.host,
                    port:config.inf.port,
                    path:"/ent/provider/member/list?page=0",
                    method:"GET"
                };
                new httpClient(opt).getReq(function(err,result){
                    if(result.error===0){
                        result.currentPage = 1;
                        if(result.totalPage===0){
                            result.totalPage++;
                        }
                        cb(err,result);
                    }else{
                        throw "error,pls contact admin!";
                    }

                });
            },
            //get short providers name list
            function(r,cb){
                var opt = {
                    hostname:config.inf.host,
                    port:config.inf.port,
                    path:"/provider/shortList",
                    method:"GET"
                };
                new httpClient(opt).getReq(function(err,result){
                    if(result.error===0){
                        r.user={};
                        r.user.mobile=req.session.user.mobile;
                        r.user._id=req.session.user._id;
                        r.userModules = req.session.user.modules;
                        r.providerNames = result.data;
                        r.proName = "供应商";
                        r.modName = "供应商账号管理";
                        cb(err,result);
                        res.render("providerMemberManagement",r);
                    }else{
                        throw "error,pls contact admin!";
                    }

                });
            }
        ],function(error,errMsg){
            if(null!=error){
                console.log(error+","+errMsg);
            }
        });
};

exports.addPMember = function(req,res){
    var params = req.body;
    var opt = {
        hostname:config.inf.host,
        port:config.inf.port,
        path:"/ent/provider/member/create",
        method:"POST"
    };
    try{
        new httpClient(opt).postReq(params,function(err,response){
//                    console.log("save provider Member finish..."+err+","+response);
            res.json({error:response.error,errMsg:response.errorMsg});
        });
    } catch(e){
        console.log(e.message);
        res.json({error:1,errMsg: e.message});
    }
};

exports.updatePMember = function(req,res){
    var params = req.body;
    var opt = {
        hostname:config.inf.host,
        port:config.inf.port,
        path:"/ent/provider/member/update/"+req.params.id,
        method:"POST"
    };
    try{
        var http = new httpClient(opt);
        http.postReq(params,function(err,result){
            res.json(result);
        });
    } catch(e){
        console.log(e.message);
        res.json({error:1,errMsg: e.message});
    }
};

exports.getProviderMember = function(req,res){
    var opt = {
        hostname:config.inf.host,
        port:config.inf.port,
        path:"/ent/provider/member/detail/"+req.body.id,
        method:"GET"
    };
    try{
        var http = new httpClient(opt);
        http.getReq(function(err,result){
            res.json(result);
        });
    } catch(e){
        console.log(e.message);
        res.json({error:1,errMsg: e.message});
    }
};

exports.getProviderMembersList = function(req,res){
    var params;
    var page = 0;
    if(req.body.current&&req.body.current>0){
        page = req.body.current-1;
    }
    params = "page="+page;
    //check
    if(req.body.searchMobile&&null!==req.body.searchMobile&&""!==req.body.searchMobile){
        params += "&mobile="+req.body.searchMobile;
    }
    if(req.body.searchName&&null!==req.body.searchName&&""!==req.body.searchName){
        params += "&name="+req.body.searchName;
    }
    if(req.body.searchEmail&&null!==req.body.searchEmail&&""!==req.body.searchEmail){
        params += "&email="+req.body.searchEmail;
    }
    if(req.body.searchProvider&&null!==req.body.searchProvider&&""!==req.body.searchProvider){
        params += "&provider="+req.body.searchProvider;
    }
    if(req.body.searchisEnable&&null!==req.body.searchisEnable&&""!==req.body.searchisEnable){
        params += "&isEnable="+req.body.searchisEnable;
    }
    //req
    var opt = {
        hostname:config.inf.host,
        port:config.inf.port,
        path:"/ent/provider/member/list?"+params,
        method:"GET"
    };
    console.log(params);
    var ret = {};
    try{
        new httpClient(opt).getReq(function(err,result){
            ret = result;
            ret.currentPage = page+1;
            if(result.totalPage===0){
                ret.totalPage++;
            }
            res.json(ret);
        });
    } catch(e){
        ret.error = 1;
        ret.errMsg = e.message+"，请联系管理员！";
        res.json(ret);
    }

};