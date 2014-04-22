/**
 * Created by wucho on 14-3-19.
 */

exports.inf = {
    host:'localhost'
//    host:'172.16.0.15'
    ,port:3333
    ,pageSize:10
};

exports.errorPage= {
    page:'error'
}


exports.alipay = {
    partner : "2088601326477978",
    seller : "hj_ct@126.com",
    sign_type : "MD5",
    key : "4i9tfj0cmbfq8a3c8vgr4tv0m6cx2wwc",
    input_charset : "utf-8",
    format : "xml",
    v : "2.0",
    alipay_gateway : "wappaygw.alipay.com",
    port : 80,
    path : "/service/rest.htm?",
    https_verify_url : "mapi.alipay.com",
    https_verify_path : "/gateway.do?",
    https_port : 443,
    notify_url : "http://cloud.bingdian.com/wap/notify/xxx",
    call_back_url : "http://cloud.bingdian.com/wap/callback/xxx",
//    notify_url : "http://sh.dd885.com/wap/notify",
//    call_back_url : "http://sh.dd885.com/wap/callback",
    merchant_url : "",
    authSrv : "alipay.wap.trade.create.direct",
    tradSrv : "alipay.wap.auth.authAndExecute",
    dirctSrv : "create_direct_pay_by_user",
    payment_type : "1",
//    direct_notify_url : "http://sh.dd885.com/web/notify",
//    direct_return_url : "http://sh.dd885.com/web/callback"
    //Test
    direct_notify_url : "http://cloud.bingdian.com/web/notify/",
    direct_return_url : "http://cloud.bingdian.com/web/callback/"
};