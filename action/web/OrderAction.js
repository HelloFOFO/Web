/**
 * Created by zzy on 4/11/14.
 */
var HttpClient = require('./../../tools/HttpClient.js');
var Config = require('./../../tools/Config');
var async = require('async');
var timeZone = ' 00:00:00 +08:00';
exports.order = function(request,response){
    var product = request.body.product;
    var startDate = request.body.startDate;
    var date = new Date(startDate+timeZone);
    ///web/product/price/:id/:date
    console.log('/web/product/price/'+product+'/'+date.getTime());
    var httpClient = new HttpClient({
        'host':Config.inf.host,
        'port':Config.inf.port,
        'path':'/web/product/price/'+product+'/'+date.getTime(),
        'method':"GET"
    });
    httpClient.getReq(function(err,res){
        if(err){
            response.send(404,'fuck 404');
        } else {
            if(res.error==1){
                response.send(404,'fuck 404');
            } else {
                response.render('web/defaultOrder',{'product':res.data[0],'price':res.data[1]});
            }
        }
    });
};