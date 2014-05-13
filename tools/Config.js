/**
 * Created by wucho on 14-3-19.
 */

exports.inf = {
//    host:'localhost'
     host:process.env.APISERVER||'172.16.0.15'
    ,port:process.env.APIPORT||3333
    ,pageSize:10
    ,imageHost:"http://dd885.b0.upaiyun.com/"
};

exports.errorPage= {
    page:'error'
};


exports.alipay = {
    partner : "2088601326477978",
    seller : "hj_ct@126.com",
    sign_type : "MD5",
    key : process.env.ALIPAYKEY,
    input_charset : "utf-8",
    format : "xml",
    v : "2.0",
    alipay_gateway : "wappaygw.alipay.com",
    port : 80,
    path : "/service/rest.htm?",
    https_verify_url : "mapi.alipay.com",
    https_verify_path : "/gateway.do?",
    https_port : 443,
    notify_url : process.env.ALIPAY_WAP_NOTIFY||"http://cloud.bingdian.com/wap/notify/",
    call_back_url : process.env.ALIPAY_WAP_CALLBACK||"http://cloud.bingdian.com/wap/callback/",
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
    direct_notify_url : process.env.ALIPAY_WEB_NOTIFY||"http://cloud.bingdian.com/web/notify/",
    direct_return_url : process.env.ALIPAY_WEB_CALLBACK||"http://cloud.bingdian.com/web/callback/"
};

exports.wx = {
    appID:"wxb26b4089c384c714",
    appsecret:"2b0bf7006c87f9f8655f242f34e28973",
    paySignKey:"R9oiKdUzuxTCvzHlFuKt3KbWifU9L3sNW81IOT1fOUzRlBc0rriYKDTJvVc9laXtXwFgzKKDx4TmDcsEfaMOA3Cwm6wOmobVfIMjzwyWf1gBY6Z4igkunjEHKUBnHcpD",
    partnerId:"1218852001",
    partnerKey:"fa909f07b280503e68c0231b358aa9b9",
    wxhost : "api.weixin.qq.com",
    wxport : 443
};