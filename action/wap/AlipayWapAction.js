/**
 * Created by cloudbian on 14-4-3.
 */
var alipay = require('./../../tools/Alipay.js');

//请求交易
exports.getReqTrade = function(req,res){
    //todo 参数取值
    var tradeNo = 100038;
    var subject = 'test';
    var total_fee = "0.01";
    alipay.wap.reqAuth(tradeNo,subject,total_fee,function(error,token){
        if(""===token){
            res.send(404,'token is null');
        }else{
            res.send(alipay.wap.reqTrade(token));
        }
    });
}

//同步回调
exports.callBack = function(req,res){
    //verify
    var params = [
        {
            key : "sign",
            value : req.query.sign
        },{
            key : "result",
            value: req.query.result
        },{
            key : "out_trade_no",
            value : req.query.out_trade_no
        },{
            key : "trade_no",
            value : req.query.trade_no
        },{
            key : "request_token",
            value : req.query.request_token
        }
    ];
    var result = alipay.wap.verify(params,req.query.sign);
    if(result){
        res.send('success');
    }else{
        res.send('failed');
    }
};

//异步回调
exports.notify = function(req,res){
    alipay.wap.verify_notify(req.body.service,req.body.v,req.body.sec_id,req.body.notify_data,req.body.sign,function(err,result){
        var parseString = require('xml2js').parseString;
        if(err){
            res.send("fail"+err);
        }else{
            if(result){
                var status = "";
                parseString(req.body.notify_data, function (err, result) {
                    status = result.notify.trade_status[0];
                });
                if("TRADE_FINISHED"===status||"TRADE_SUCCESS"===status){

                }
                res.send("success");
            }else{
                res.send("fail");
            }
        }
    });
}
