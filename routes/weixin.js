/**
 * Created by cloudbian on 14-4-21.
 */
var WeiXinAction = require('./../action/weixin/WeiXinAction');
module.exports = function(app){
    //msg notify
    app.get('/weixin',WeiXinAction.notify);
    app.post('/weixin',WeiXinAction.msgNotify);
    //menu
    app.get('/weixin/menu',WeiXinAction.createMenu);
    app.get('/weixin/delMenu',WeiXinAction.delMenu);
    //pay
    app.all('/weixin/order',WeiXinAction.order);
    app.all('/weixin/paynotify',WeiXinAction.payNotify);
    //customer
    app.post('weixin/customer',WeiXinAction.customerNotify);
};