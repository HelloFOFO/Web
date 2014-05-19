/**
 * Created by zzy on 3/28/14.
 */
var HttpClient = require('./../../tools/HttpClient.js');
var Config = require('./../../tools/Config');

exports.noticeList = function(request,response){
    var httpClient = new HttpClient({
        'host':Config.inf.host,
        'port':Config.inf.port,
        'path':'/news/shortList',
        'method':"GET"
    });
    httpClient.getReq(function(err,res){
        response.render('wap/goverNotice',{titleName:'公告','newses':res.data});
    });
};

exports.detail = function(request,response){
    var httpClient = new HttpClient({
        'host':Config.inf.host,
        'port':Config.inf.port,
        'path':'/news/detail/'+request.params.id,
        'method':"GET"
    });
    httpClient.getReq(function(err,res){
        response.render('wap/goverdetail',{titleName:'公告详情','news':res.data});
    });
};