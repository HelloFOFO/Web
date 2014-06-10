/**
 * Created by zzy on 6/10/14.
 */
var HttpClient = require('./../../tools/HttpClient.js');
var Config = require('./../../tools/Config');
var _ = require('underscore')._;
exports.myCoupons = function(request,response){
    var httpClient = new HttpClient({
        'host':Config.inf.host,
        'port':Config.inf.port,
        'path':'/coupon/list/538409ad8cd2f52e1bc65496',
        'method':"GET"
    });
    httpClient.getReq(function(err,res){
        if( err || res.error != 0 ){
            console.error(__dirname,err,res);
            response.redirect('/errorPage');
        } else {
            var data = res.data;
            var unuse = _.filter(data,function(c){
                return c.status == 0 && c.expiryDate>Date.now();
            });
            var used = _.filter(data, function(c){
                return c.status == 1;
            });
            var expired = _.filter(data,function(c){
                return c.status == 0 && c.expiryDate<Date.now();
            });
            response.render('web/myCoupons',{'unuse':unuse,'used':used,'expired':expired});
        }

    });

};