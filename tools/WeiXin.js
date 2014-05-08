/**
 * @author zzy
 */
var httpsClient = require("./HttpsClient.js");
var config = require("./Config.js");
var us = require('underscore');
var parseString = require('xml2js').parseString;

var WeiXin = function(){};
WeiXin.token="RTACN";
WeiXin.ACCESS_TOKEN = "";
WeiXin.expressTime = 0;

WeiXin.check = function(signature,timestamp,nonce,echostr){
	var tmpArr = [WeiXin.token,timestamp,nonce];
//	console.log("Before Sort",tmpArr);
	tmpArr.sort();
//	console.log("After Sort",tmpArr);
	var str = tmpArr[0]+tmpArr[1]+tmpArr[2];
	var crypto = require('crypto');
	var shasum = crypto.createHash('sha1');
	shasum.update(str);
    var mySign = shasum.digest('hex');
	if(mySign===signature){
		return true;
	} else {
		return false;
	}
};

WeiXin.message = function(xml,cb){
	var parseString = require('xml2js').parseString;
	parseString(xml, function (err, result) {
		var msgType = result.xml.MsgType[0];
	    cb(err,WeiXin[msgType](result));
	});
};

WeiXin.text = function(xml){
	return "<xml>"+
			"<ToUserName><![CDATA["+xml.xml.FromUserName[0]+"]]></ToUserName>"+
			"<FromUserName><![CDATA["+xml.xml.ToUserName[0]+"]]></FromUserName>"+
			"<CreateTime>"+new Date().getTime()+"</CreateTime>"+
			"<MsgType><![CDATA[text]]></MsgType>"+
			"<Content><![CDATA[你好]]></Content>"+
			"</xml>";
};

WeiXin.image = function(xml){
	
};

WeiXin.voice = function(xml){
	
};

WeiXin.video = function(xml){
	
};

WeiXin.location = function(xml){
	
};

WeiXin.link = function(xml){
	
};

WeiXin.event = function(xml){
	return WeiXin.event[xml.xml.Event[0]](xml);
};

WeiXin.event.subscribe = function(xml){
	return "<xml>"+
	"<ToUserName><![CDATA["+xml.xml.FromUserName[0]+"]]></ToUserName>"+
	"<FromUserName><![CDATA["+xml.xml.ToUserName[0]+"]]></FromUserName>"+
	"<CreateTime>"+new Date().getTime()+"</CreateTime>"+
	"<MsgType><![CDATA[news]]></MsgType>"+
	"<ArticleCount>1</ArticleCount>"+
	"<Articles>"+
	"<item>"+
	"<Title><![CDATA[欢迎]]></Title>"+ 
	"<Description><![CDATA[欢迎来到喔猴]]></Description>"+
	"<PicUrl><![CDATA[http://www.wohoooo.com/images/home_12.png]]></PicUrl>"+
	"<Url><![CDATA[http://www.wohoooo.com/?token="+xml.xml.FromUserName[0]+"]]></Url>"+
	"</item>"+
	"</Articles>"+
	"</xml>"; 
};


WeiXin.event.unsubscribe = function(xml){
	return "<xml>"+
	"<ToUserName><![CDATA["+xml.xml.FromUserName[0]+"]]></ToUserName>"+
	"<FromUserName><![CDATA["+xml.xml.ToUserName[0]+"]]></FromUserName>"+
	"<CreateTime>"+new Date().getTime()+"</CreateTime>"+
	"<MsgType><![CDATA[news]]></MsgType>"+
	"<ArticleCount>1</ArticleCount>"+
	"<Articles>"+
	"<item>"+
	"<Title><![CDATA[欢迎]]></Title>"+ 
	"<Description><![CDATA[欢迎来到喔猴]]></Description>"+
	"<PicUrl><![CDATA[http://www.wohoooo.com/images/home_12.png]]></PicUrl>"+
	"<Url><![CDATA[http://www.wohoooo.com/?token="+xml.xml.FromUserName[0]+"]]></Url>"+
	"</item>"+
	"</Articles>"+
	"</xml>"; 
};

//get access token if express will request or not
WeiXin.getAT = function(fn){
    if(new Date().getTime()>this.expressTime){
        console.log("token need regenerate");
        var opt = {
            hostname:config.wx.wxhost,
            port:config.wx.wxport,
            path:"/cgi-bin/token?grant_type=client_credential&appid="+config.wx.appID+"&secret="+config.wx.appsecret,
            method:"GET"
        };
        new httpsClient(opt).getReq(function(err,response){
            console.log(response);
            if(response.access_token){
                WeiXin.ACCESS_TOKEN = response.access_token;
                WeiXin.expressTime = new Date().getTime()+response.expires_in*1000;
                fn();
            }
        });
    }else{
        fn();
    }
}
//menu
WeiXin.createMenu = function(fn){
    var params ={
        "button": [
            {
                "name": "预订",
                "sub_button": [
                    {
                        "type": "view",
                        "name": "门票",
                        "url": "http://cloud.bingdian.com/weixin/pay"
                    },
                    {
                        "type": "view",
                        "name": "联票",
                        "url": "http://cloud.bingdian.com/weixin/order?showwxpaytitle=1"
                    },
                    {
                        "type": "view",
                        "name": "自驾游套餐",
                        "url": "http://www.baidu.com"
                    },
                    {
                        "type": "view",
                        "name": "主题活动",
                        "url": "http://www.baidu.com"
                    }
                ]
            },
            {
                "name": "权威发布",
                "sub_button": [
                    {
                        "type": "view",
                        "name": "近期热点",
                        "url": "www.baidu.com"
                    },
                    {
                        "type": "view",
                        "name": "优秀目的地",
                        "url": "www.baidu.com"
                    },
                    {
                        "type": "view",
                        "name": "官方发布",
                        "url": "www.baidu.com"
                    }
                ]
            },
            {
                "name": "我的订单",
                "sub_button": [
                    {
                        "type": "click",
                        "name": "已购买订单",
                        "key": "PAY_ORDER"
                    },
                    {
                        "type": "click",
                        "name": "维权",
                        "key": "CUSTOM"
                    }
                ]
            }]};
    var opt = {
        hostname:config.wx.wxhost,
        port:config.wx.wxport,
        path:"/cgi-bin/menu/create?access_token="+WeiXin.ACCESS_TOKEN,
        method:"POST"
    };
    new httpsClient(opt).postReq(params,function(err,response){
        var errMsg = "";
        if(0!==response.errcode){
            errMsg = resonse.errmsg;
        }
        fn(errMsg);
    });
}

WeiXin.delMenu = function(fn){
    var opt = {
        hostname:config.wx.wxhost,
        port:config.wx.wxport,
        path:"/cgi-bin/menu/delete?access_token="+WeiXin.ACCESS_TOKEN,
        method:"GET"
    };
    new httpsClient(opt).getReq(function(err,response){
        console.log("dele menu is " + WeiXin.ACCESS_TOKEN);
        var errMsg = "";
        if(0!==response.errcode){
            errMsg = resonse.errmsg;
        }
        fn(errMsg);
    });
}

//customer
WeiXin.customer = function(cb){
    parseString(data, function (err, result) {
        type = result.xml.MsgType[0];
        if("request"===type){

        }else if("confirm"===type){

        }else if("reject"===type){

        }else{
            cb('error','没有这种类型的数据');
        }
    });
}
module.exports = WeiXin;