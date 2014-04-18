/**
 * Created by cloudbian on 14-4-3.
 */
var alipay = require('./../../tools/Alipay.js');

//请求交易
exports.reqTrade = function(req,res){
    //todo 参数取值
    var token = alipay.wap.reqAuth(tradeNo,subject,total_fee);
    res.send(alipay.wap.reqTrade(token));
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
            value : request_token
        }
    ];
    var result = alipay.verify(params,req.query.sign);
    console.log(result);
    if(result){

    }else{

    }
};

//异步回调
exports.notify = function(req,res){
    var isPass = alipay.wap.verify_notify(req.query.service,req.query.v,req.query.sec_id,req.query.notify_data,req.query.sign);
    var parseString = require('xml2js').parseString;
    if(isPass){
        var status = "";
        parseString(req.query.notify_data, function (err, result) {
            status = result.notify.trade_status[0];
        });
        if("TRADE_FINISHED"===status||"TRADE_SUCCESS"===status){

        }
        res.send("success");
    }else{
        res.send("fail");
    }
}
