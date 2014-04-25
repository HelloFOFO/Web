/**
 * Created by cloudbian on 14-4-21.
 */
var WeiXinAction = require('./../action/weixin/WeiXinAction');
module.exports = function(app){
    app.get('/weixin',WeiXinAction.notify);
    app.post('/weixin',WeiXinAction.notify);
};