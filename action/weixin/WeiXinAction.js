/**
 * Created by cloudbian on 14-4-21.
 */
var weixin = require('./../../tools/WeiXin');
exports.notify = function(req,res){
//    var signature = req.query.signature;
//    var ts = req.query.timestamp;
//    var nonce = req.query.nonce;
    var echostr = req.query.echostr;
//    if(weixin.check(signature,ts,nonce,echostr)){
//        if(null==echostr){
//
//        }else{
            res.send(echostr);
//        }
//    }else{
//        res.send('error');
//    }
};