/**
 * Created by cloudbian on 14-4-21.
 */
var WeiXinAction = require('./../action/weixin/WeiXinAction');
module.exports = function(app){
    //msg notify
    app.all('/weixin',WeiXinAction.notify);
    //menu
    app.get('/weixin/menu',WeiXinAction.createMenu);
    app.get('/weixin/delMenu',WeiXinAction.delMenu);
    //pay
    app.get('/weixin/order',WeiXinAction.order);
    app.post('/weixin/paynotify',WeiXinAction.payNotify);
    //customer
    app.post('weixin/customer',WeiXinAction.customerNotify);
};