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
                'path':'/web/product/webList/'+city,
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
        console.log(err,res);
        response.render('web/products',{'products':res[1],'city':{'name':res[0].name}});
    });
};

exports.getDetail = function(request,response){
    var id = request.params.id;

//    response.send(id);
    var httpClient = new HttpClient({
        'host':Config.inf.host,
        'port':Config.inf.port,
        'path':'/web/product/detail/'+id,
        'method':"GET"
    });
    httpClient.getReq(function(err,res){
        if(err){
            response.send(404,'fuck 404');
        } else {
            if(res.error==0){
                var level;
                var product = res.data;
                if(product.type==1){
                    switch(product.level){
                        case 1:
                            level='1A景区'
                            break;
                        case 2:
                            level='2A景区'
                            break;
                        case 3:
                            level='3A景区'
                            break;
                        case 4:
                            level='4A景区'
                            break;
                        case 5:
                            level='5A景区'
                            break;
                    }
                } else if(product.type==2) {
                    switch(product.level){
                        case 1:
                            level='经济型酒店'
                            break;
                        case 2:
                            level='经济型酒店'
                            break;
                        case 3:
                            level='三星级酒店'
                            break;
                        case 4:
                            level='四星级酒店'
                            break;
                        case 5:
                            level='五星级酒店'
                            break;
                    }
                }
                product.level=level;
                response.render('web/packageDetail',{'product':product});
            } else {
                response.send(404,'fuck 404');
            }
        }
    });
};