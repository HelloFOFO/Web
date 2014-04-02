/**
 * Created by cloudbian on 14-3-19.
 */
var httpClient = require('./../tools/HttpClient.js');
var config = require('./../tools/Config.js');
var async = require('async');
var underscore = require('underscore');
var timeZone = ' 00:00:00 +08:00';
exports.viewTicketPriceInput = function(req,res){
    var ret;
        async.waterfall([
            //get list
            function(cb){
                var opt = {
                    hostname:config.inf.host,
                    port:config.inf.port,
                    path:"/product/ticket/priceLog/list?page=0&status=1",
                    method:"GET"
                };
                new httpClient(opt).getReq(function(err,result){
                    if(result.error===0){
                        ret = result;
                        ret.currentPage = 1;
                        if(result.totalPage===0){
                            ret.totalPage++;
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
                        ret.providerNames = result.data;
                        cb(err,result);
                    }else{
                        throw "error,pls contact admin!";
                    }
                });
            },
            //get short operator list
            function(r,cb){
                var opt = {
                    hostname:config.inf.host,
                    port:config.inf.port,
                    path:"/ent/provider/member/shortList?provider="+req.session.user.provider._id,
                    method:"GET"
                };
                new httpClient(opt).getReq(function(err,result){
                    console.log('-----------------------');
                    if(result.error===0){
                        ret.operators = result.data;
                        ret.userModules = req.session.user.modules;
                        ret.user={};
                        ret.user.mobile=req.session.user.mobile;
                        ret.user._id=req.session.user._id;
                        cb(err,result);
                    }else{
                        throw "error,pls contact admin!";
                    }
                });
            },
            //get city list
            function(r,cb){
                var opt = {
                    hostname:config.inf.host,
                    port:config.inf.port,
                    path:"/city/shortList",
                    method:"GET"
                };
                new httpClient(opt).getReq(function(err,result){
                    if(result.error===0){
                        ret.citys = result.data;
                        if("input"===req.params.category){
                            ret.proName = "票务";
                            ret.modName = "价格录入";
                            res.render("ticketPriceInput",ret);
                        }else{
                            ret.proName = "票务";
                            ret.modName = "价格审核";
                            res.render("ticketPriceAudit",ret);
                        }
                        cb(err,result);
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

exports.addInputLog = function(req,res){
    var params = req.body;
    params.startDate = new Date(params.startDate+timeZone).getTime();
    params.endDate = new Date(params.endDate+timeZone).getTime();
    delete params.addCity;
    if(!underscore.isArray(params.weekend)){
        params.weekend = [params.weekend];
    }
    params.status = 1;
    var opt = {
        hostname:config.inf.host,
        port:config.inf.port,
        path:"/product/ticket/price/create",
        method:"POST"
    };
    try{
        new httpClient(opt).postReq(params,function(err,response){
//                    console.log("save finish..."+err,response);
            res.json({error:response.error,errMsg:response.errorMsg});
        });

    } catch(e){
        console.log(e.message);
        res.json({error:1,errMsg: e.message});
    }
};


exports.getTicketPriceLogList = function(req,res){
    var params;
    var page = 0;
    if(req.body.current&&req.body.current>0){
        page = req.body.current-1;
    }
    params = "page="+page;
    //check
    if(!underscore.isEmpty(req.body.product)){
        params += "&product="+req.body.product;
    }
    if(!underscore.isEmpty(req.body.startDate)){
        params += "&startDate="+new Date(req.body.startDate).getTime();
    }
    if(!underscore.isEmpty(req.body.endDate)){
        params += "&endDate="+new Date(req.body.endDate).getTime();
    }
    if(!underscore.isEmpty(req.body.operator)){
        params += "&operator="+req.body.operator;
    }
    if(!underscore.isEmpty(req.body.provider)){
        params += "&provider="+req.body.provider;
    }
    if(!underscore.isEmpty(req.body.status)){
        params += "&status="+req.body.status;
    }
    //req
    var opt = {
        hostname:config.inf.host,
        port:config.inf.port,
        path:"/product/ticket/priceLog/list?"+params,
        method:"GET"
    };

    var ret = {};
    try{
        new httpClient(opt).getReq(function(err,result){
            console.log(result);
            if(result.error===0){
                ret = result;
                ret.currentPage = 1;
                if(result.totalPage===0){
                    ret.totalPage++;
                }
                res.json(ret);
            }else{
                throw "error,pls contact admin!";
            }

        });
    } catch(e){
        ret.error = 1;
        ret.errMsg = e.message+"，请联系管理员！";
        res.json(ret);
    }

};