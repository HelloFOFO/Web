/**
 * Created by zzy on 3/26/14.
 */
var HttpClient = require('./../../tools/HttpClient.js');
var Config = require('./../../tools/Config');

exports.cityBox = function(request,response){
    var httpClient = new HttpClient({
        'host':Config.inf.host,
        'port':Config.inf.port,
        'path':'/web/city/list',
        'method':"GET"
    });
    httpClient.getReq(function(err,res){
        if(err){
            response.send(404,'fuck 404');
        } else {
            response.render('web/template/cityBox',{'cities':res.data});
        }
    });
};

exports.home = function(request,response){
    response.render('web/home');
};


//exports.hotProduct = function(request,response){
//    var city = request.query.city;
//    var httpClient = new HttpClient({
//        'host':Config.inf.host,
//        'port':Config.inf.port,
//        'path':'/wap/product/hotList/'+city+'?hot=true',
//        'method':"GET"
//    });
//    httpClient.getReq(function(err,res){
//        response.json(res);
//    });
//};