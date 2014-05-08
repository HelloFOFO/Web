/**
 * Created by zzy on 3/26/14.
 */
var HttpClient = require('./../../tools/HttpClient.js');
var Config = require('./../../tools/Config');
var _ = require('underscore');

exports.cityBox = function(request,response){
    var httpClient = new HttpClient({
        'host':Config.inf.host,
        'port':Config.inf.port,
        'path':'/city/list',
        'method':"GET"
    });
    httpClient.getReq(function(err,res){
        if(err){
            response.send(404,'404');
        } else {
            response.render('web/template/cityBox',{'cities':res.data});
        }
    });
};

exports.home = function(request,response){
    console.info('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    response.render('web/home');
};

var truncProductName = function(productName){
    return productName.length>7?productName.substr(0,7)+'...':productName;
};

exports.hotProduct = function(req,res){
    try{
        var city  = req.query.cityID;
        if(_.isEmpty(city)){
            city='5343757bd8d3efb068465b1f';
        }
        var httpClient = new HttpClient({
            'host':Config.inf.host,
            'port':Config.inf.port,
            'path':'/product/webList/'+city+'?hot=true',
            'method':"GET"
        });
        console.log('/product/webList/'+city+'?hot=true');
        httpClient.getReq(function(err,data){
            if(err){
                res.json({error:1,errorMsg: err});
            } else {
                console.log(data.data);
                //只取第一张图片(这个逻辑可以更改)
                data.data.forEach(function(data){
                    data.shortName = truncProductName(data.name);
                    data.image = data.image[0];
                    data.image.url=   'http://dd885.b0.upaiyun.com/'+data.image.url+"!hotProductList";
                });
                res.json(data);
            }
        });
    }catch(e){
        res.json({error:1,errorMsg: e.message});
    }
};

exports.getCityDetail = function(req,res){
    try{
        var city = req.query.city;
        if(_.isEmpty(city)){
            city = "5343757bd8d3efb068465b1f";
        }
        var httpClient = new HttpClient({
            'host':Config.inf.host,
            'port':Config.inf.port,
            'path':"/city/detail/"+city ,
            'method':"GET"
        });
        httpClient.getReq(function(error,result){
            if(error || result.error != 0){
                res.json({error:0,errorMsg:error});
            }else{
                if(_.isArray(result.data.image)){
//                    console.log('aaaaaaaaa',result);
                    var newImage=[];
                    result.data.image.forEach(function(i){
                        var tmpURL = i.url;
                        i.url = Config.inf.imageHost+ tmpURL;
                        i.wapURL = Config.inf.imageHost+ tmpURL;
//                        newImage.push({url:Config.inf.imageHost+ i.url});
//                        console.log(Config.inf.imageHost,newImage.url);
                    });
//                    result.image=newImage;
                }else{
                    console.log(Config.inf.imageHost);
                    result.image=[];
                }
                res.json(result);
            }
        });

    }catch(e){
        res.json({error:3,errorMsg: e.message});
    }


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