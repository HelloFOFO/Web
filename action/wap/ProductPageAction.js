/**
 * Created by zzy on 3/26/14.
 */
var HttpClient = require('./../../tools/HttpClient.js');
var Config = require('./../../tools/Config');
var async = require('async');

exports.getProducts = function(request,response){
    var city = request.params.id;
    async.series([
        function(cb){
            var httpClient = new HttpClient({
                'host':Config.inf.host,
                'port':Config.inf.port,
                'path':'/wap/city/name/'+city,
                'method':"GET"
            });
            httpClient.getReq(function(err,res){
                if(err){
                    cb(err,null);
                } else {
                    cb(null,res.data);
                }
            });
        },
        function(cb){
            var httpClient = new HttpClient({
                'host':Config.inf.host,
                'port':Config.inf.port,
                'path':'/wap/product/webList/'+city,
                'method':"GET"
            });
            httpClient.getReq(function(err,res){
                if(err){
                    cb(err,null);
                } else {
                    cb(null,res.data);
                }
            });
        }
    ],function(err,res){
        response.render('wap/products',{'products':res[1],'city':{'name':res[0].name}});
    });
};

exports.getDetail = function(request,response){
    var id = request.params.id;
    response.send(id);
//    var httpClient = new HttpClient({
//        'host':Config.inf.host,
//        'port':Config.inf.port,
//        'path':'/wap/product/hotList',
//        'method':"GET"
//    });
//    httpClient.getReq(function(err,res){
//        response.render('wap/products',{'products':res.data,'city':{'name':request.query.cityName}});
//    });
};