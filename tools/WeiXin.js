/**
 * @author zzy
 */
var WeiXin = function(){};
WeiXin.token="wohoooo";

WeiXin.check = function(signature,timestamp,nonce,echostr){
	var tmpArr = [WeiXin.token,timestamp,nonce];
	console.log("Before Sort",tmpArr);
	tmpArr.sort();
	console.log("After Sort",tmpArr);
	var str = tmpArr.join();
	var crypto = require('crypto');
	var shasum = crypto.createHash('sha1');
	shasum.update(str);
	if(shasum.digest('hex')==signature){
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


module.exports = WeiXin;