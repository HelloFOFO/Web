/**
 * Created by cloudbian on 14-3-19.
 */
var httpClient = require('./../tools/HttpClient.js');
var config = require('./../tools/Config.js');
var underscore = require('underscore');
exports.updateStatus = function(req,res){
    var flag = true;
    if(underscore.isEmpty(req.params.type)){
        flag = false;
    }
    if(underscore.isEmpty(req.body._id)){
        flag = false;
    }
    if(underscore.isEmpty(req.body.status)){
        flag = false;
    }
    if(underscore.isEmpty(req.body.operator)){
        flag = false;
    }
    if(flag){
        var opt = {
            hostname:config.inf.host,
            port:config.inf.port,
            path:"/product/"+req.params.type+"/price/audit/"+req.body._id,
            method:"POST"
        };
        try{
            new httpClient(opt).postReq({status:req.body.status,operator:req.body.operator},function(err,response){
//                    console.log("status finish..."+err,response);
                res.json({error:response.error,errMsg:response.errorMsg});
            });

        } catch(e){
            console.log(e.message);
            res.json({error:1,errMsg: e.message});
        }
    }else{
        res.json({error:1,errMsg: "参数不能为空"});
    }
};