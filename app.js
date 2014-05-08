/**
 * Module dependencies.
 */

var express = require('express');
var wap = require('./routes/wap');
var web = require('./routes/web');
var weixin = require('./routes/weixin');
var http = require('http');
var path = require('path');
var log4js = require('log4js');
var RedisStore = require('connect-redis')(express);

var store = new RedisStore({
    host: process.env.REDISSEVER||'172.16.0.15',
    port: process.env.REDISPORT||6379,
    db: 1,
    pass: process.env.REDISPASS||'rtadd885'
});

//log4js config
log4js.configure({
    appenders : [ {
        type : 'console'
    }
//        , {
//        type : 'file',
//        filename : 'logs/access.log',
//        maxLogSize : 1024,
//        backups : 4,
//        category : 'normal'
//    } 
    ],
    replaceConsole : true
});
var logger = log4js.getLogger('normal');
logger.setLevel('INFO');

var app = express();
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.enable('trust proxy');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser({
    uploadDir : './uploads'
}));
app.use(express.methodOverride());
app.use(express.cookieParser('rta'))
app.use(express.session({
    secret : 'rta',
    store : store,
    cookie : {
        maxAge : 60*60*1000
    }
}));
app.use(log4js.connectLogger(logger, {
    level : log4js.levels.INFO
}));

app.use(function(request,response,next){
    if(request.session){
        response.locals.user = request.session.user;
    }
    next();
});

//app.use(function(request,response,next){
//    if(request.session.user){
//        app.locals.user = request.session.user;
//        app.locals.userModules = request.session.user.modules;
//        console.log(app.locals.userModules);
//    }
//    next();
//});
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);





// development only
//if ('development' == app.get('env')) {
//  app.use(express.errorHandler());
//}

wap(app);
web(app);
weixin(app);

app.get('*',function(request,response){
    response.redirect("/errorPage");
});



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

Date.prototype.Format = function (fmt) { //author: wucho
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
