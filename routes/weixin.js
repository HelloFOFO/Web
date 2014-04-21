/**
 * Created by cloudbian on 14-4-21.
 */
var WeiXinAction = require('./../action/weixin/WeiXinAction');
module.exports = function(app){
    app.all('/weixin/*',function(request,response,next){
        response.charset = 'utf-8';
        next();
    })
    app.get('/weixin/verify',WeiXinAction.verify);
    app.post('/weixin/verify',WeiXinAction.verify);
};