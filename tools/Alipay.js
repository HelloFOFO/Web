/**
 * Created by cloudbian on 14-4-2.
 */
var httpClient = require('./HttpClient.js');
var httpsClient = require('./HttpsClient.js');
var underscore = require('underscore');
var config = require('./Config.js');
var crypto = require('crypto');
var qs = require('querystring');
var Alipay = function(){};
Alipay.wap = function(){};
Alipay.web = function(){};
//过滤值为空的对象，传入的arrays为JSON对象的数组，数组只有2个属性，key value,Key的值必须按照alipay文档上的参数名填写
Alipay.paramsFilter = function(arrays){
    var result = [];
    if(!underscore.isArray(arrays)||arrays.length<=0){
        return result;
    }
    arrays.forEach(function(obj){
        if(underscore.isEmpty(obj.value)||"sign"===obj.key||"sign_type"===obj.key){
            return;
        }
        result.push(obj);
    });
    return result;
};

//把所有元素进行排序按照GET请求的参数形式进行拼接
Alipay.createLinkString = function(arrays){
    arrays.sort(function(a,b){
        if(a.key> b.key){
            return 1;
        }else if(a.key< b.key){
            return -1;
        }else{
            return 0;
        }
    });
    var lnkStr = "";
    var isFirst = true;
    arrays.forEach(function(obj){
        if(isFirst){
            lnkStr = obj.key + "=" + obj.value;
            isFirst = false;
        }else{
            lnkStr = lnkStr + "&" + obj.key + "=" + obj.value;
        }
    });
    return lnkStr;
};

//固定参数排序并按照GET请求的参数形式进行拼接
Alipay.wap.createRegularLinkString = function(service,v,sec_id,notify_data){
    return "service="+service+"&v="+v+"&sec_id="+sec_id+"&notify_data="+notify_data;
};

//生成请求参数
Alipay.bulidReqParam = function(arrays){
    var newParam = Alipay.paramsFilter(arrays);
    var str = Alipay.createLinkString(newParam);
    newParam.push({
        key:"sign",
        value:Alipay.buildSign(str)
    });
    newParam.forEach(function(obj){
        if("service"===obj.key){
            if("alipay.wap.trade.create.direct"!==obj.value&&"alipay.wap.auth.authAndExecute"!==obj.value){
                newParam.push({
                    key:"sign_type",
                    value:config.alipay.sign_type
                });
            }
        }
    });
    return newParam;
};

//生成签名
Alipay.buildSign = function(s){
    var sign = "";
    if("MD5"===config.alipay.sign_type){
        var hasher = crypto.createHash("md5");
        hasher.update(s+config.alipay.key,"utf8");
        sign = hasher.digest("hex");
    }
    return sign;
};

//授权请求
//traderNo 订单号
//subject 订单名称
Alipay.wap.reqAuth = function(_id,tradeNo,subject,total_fee,cb){
    var returnResult = "";
    var req_id = new Date().getTime();
    var req_dataToken = "<direct_trade_create_req><notify_url>" + config.alipay.notify_url + _id
        + "</notify_url><call_back_url>" + config.alipay.call_back_url + _id
        + "</call_back_url><seller_account_name>"
        + config.alipay.seller + "</seller_account_name><out_trade_no>"
        + tradeNo + "</out_trade_no><subject>" + subject
        + "</subject><total_fee>" + total_fee + "</total_fee>"
        + "</direct_trade_create_req>";
    var reqParams = [
        {
            key:"service",
            value:config.alipay.authSrv
        },{
            key:"partner",
            value:config.alipay.partner
        },{
            key:"_input_charset",
            value:config.alipay.input_charset
        },{
            key:"sec_id",
            value:config.alipay.sign_type
        },{
            key:"format",
            value:config.alipay.format
        },{
            key:"v",
            value:config.alipay.v
        },{
            key:"req_id",
            value:req_id
        },{
            key:"req_data",
            value:req_dataToken
        }
    ];
    var newParams = Alipay.bulidReqParam(reqParams);
    var reqJson = {};
    newParams.forEach(function(param){
        reqJson[param.key] = param.value;
    });
    var opt = {
        hostname:config.alipay.alipay_gateway,
        port:config.alipay.port,
        path:config.alipay.path + "_input_charset="+config.alipay.input_charset,
        method:"POST"
    };
    try{
        new httpClient(opt).alipayPost(reqJson,function(err,res){
            if(err){
                console.log('wap alipay auth error '+err);
                cb(err, err);
            }else{
                var resData = qs.parse(qs.unescape(res));
                var parseString = require('xml2js').parseString;
                parseString(resData.res_data, function (err, result) {
                    returnResult = result.direct_trade_create_res.request_token[0];
                    cb(null,returnResult);
                });
            }
        });
    }catch(e){
        console.log(e.message);
        cb(e, e.message);
    }

};

//业务请求
Alipay.wap.reqTrade = function(reqToken){
    var reqParams = [
        {
            key:"service",
            value:config.alipay.tradSrv
        },{
            key:"partner",
            value:config.alipay.partner
        },{
            key:"_input_charset",
            value:config.alipay.input_charset
        },{
            key:"sec_id",
            value:config.alipay.sign_type
        },{
            key:"format",
            value:config.alipay.format
        },{
            key:"v",
            value:config.alipay.v
        },{
            key:"req_data",
            value:"<auth_and_execute_req><request_token>" + reqToken + "</request_token></auth_and_execute_req>"
        }
    ];
    var newParams = Alipay.bulidReqParam(reqParams);
    var html = "<form id=\"alipaysubmit\" name=\"alipaysubmit\" action=\"https:\/\/" + config.alipay.alipay_gateway
        + config.alipay.path + "_input_charset=" + config.alipay.input_charset + "\" method=\"GET\">";
    newParams.forEach(function(obj){
        html += "<input type=\"hidden\" name=\"" + obj.key + "\" value=\"" + obj.value + "\"/>";
    });
    html += "<input type=\"submit\" value=\"confirm\" style=\"display:none;\"></form>";
    html += "<script>document.forms['alipaysubmit'].submit();</script>";
    return html;
};

//wap 同步回调验证
Alipay.wap.verify = function(arrays,sign){
    var params = Alipay.paramsFilter(arrays);
    var str = Alipay.createLinkString(params);
    var bs = Alipay.buildSign(str);
    if(bs===sign){
        return true;
    }else{
        return false;
    }
}
//wap 异步回调验证
Alipay.wap.verify_notify = function(service,v,sec_id,notify_data,sign,cb){
    var str = Alipay.wap.createRegularLinkString(service,v,sec_id,notify_data);
    var bs = Alipay.buildSign(str);
    var isSign = false;
    if(sign===bs){
        isSign = true;
    }
    var verifyATN = false;
    var parseString = require('xml2js').parseString;
    try{
        parseString(notify_data, function (err, result) {
            var notifyId = result.notify.notify_id[0];
            Alipay.reqATN(notifyId,function(err,res){
                verifyATN = res;
                if(isSign&&verifyATN){
                    cb(null, true);
                }else{
                    cb('error', 'verify is error');
                }
            });
        });
    }catch(e){
        console.log("net work is wrong:" + e.message);
        cb(e, e.message);
    }
}

//request ATN
Alipay.reqATN = function(notifyId,cb){
    var opt = {
        hostname:config.alipay.https_verify_url,
        port:config.alipay.https_port,
        path:config.alipay.https_verify_path + "service=notify_verify&partner=" + config.alipay.partner + "&notify_id=" + notifyId,
        method:"GET"
    };
    try{
        new httpsClient(opt).getReq(function(err,res){
            cb(err,res);
        });
    }catch(e){
        console.log("exception:"+e.message);
        cb(null,false);
    }
}

//web 业务请求
Alipay.web.reqTrade = function(_id,tradeNo,subject,total_fee){
    var params = [
        {
            key : "service",
            value : config.alipay.dirctSrv
        },{
            key : "partner",
            value : config.alipay.partner
        },{
            key : "_input_charset",
            value : config.alipay.input_charset
        },{
            key : "payment_type",
            value : config.alipay.payment_type
        },{
            key : "notify_url",
            value : config.alipay.direct_notify_url + _id
        },{
            key : "return_url",
            value : config.alipay.direct_return_url + _id
        },{
            key : "seller_email",
            value : config.alipay.seller
        },{
            key : "out_trade_no",
            value : tradeNo
        },{
            key : "subject",
            value : subject
        },{
            key : "total_fee",
            value : total_fee
        }
    ];
    var p = Alipay.bulidReqParam(params);
    var html = "<form id=\"alipaysubmit\" name=\"alipaysubmit\" action=\"https:\/\/" + config.alipay.https_verify_url
        + config.alipay.https_verify_path
        + "_input_charset=" + config.alipay.input_charset + "\" method=\"GET\">";
    p.forEach(function(obj){
        html += "<input type=\"hidden\" name=\"" + obj.key + "\" value=\"" + obj.value + "\"/>";
    });
    html += "<input type=\"submit\" value=\"confirm\" style=\"display:none;\"></form>";
    html += "<script>document.forms['alipaysubmit'].submit();</script>";
    return html;
}

//web verify
Alipay.web.verify = function(notifyId,arrays,sign,cb){
    var verifyATN = false;
    Alipay.reqATN(notifyId,function(err,res){
        verifyATN = res;
        var isSign = Alipay.wap.verify(arrays,sign);
        if(verifyATN&&isSign){
            cb(null,true);
        }else{
            cb(null,false);
        }
    });
}
module.exports = Alipay;