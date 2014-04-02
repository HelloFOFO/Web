/**
 * Created by zzy on 3/26/14.
 */
var HttpClient = require('./../../tools/HttpClient.js');
var Config = require('./../../tools/Config');

exports.getHomePage = function(request,response){
    response.render('wap/index',{'city':{'name':'上海','_id':'5326a195b8d99d2f7b504229','images':[]}});
};

exports.cityList = function(request,response){
    var key = request.query.key;
    var httpClient = new HttpClient({
        'host':Config.inf.host,
        'port':Config.inf.port,
        'path':key?'/wap/city/list?key='+key:'/wap/city/list',
        'method':"GET"
    });
    httpClient.getReq(function(err,res){
        response.json(res);
    });
};

exports.hotProduct = function(request,response){
    var city = request.query.city;
    var httpClient = new HttpClient({
        'host':Config.inf.host,
        'port':Config.inf.port,
        'path':'/wap/product/hotList/'+city+'?hot=true',
        'method':"GET"
    });
    httpClient.getReq(function(err,res){
        response.json(res);
    });
};