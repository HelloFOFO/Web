/**
 * Created by zzy on 6/10/14.
 */
var HttpClient = require('./../../tools/HttpClient.js');
var Config = require('./../../tools/Config');
var _ = require('underscore')._;
exports.myCoupons = function(request,response){
    var memberID = request.session.user._id;
    var httpClient = new HttpClient({
        'host':Config.inf.host,
        'port':Config.inf.port,
        'path':'/coupon/list/'+memberID,
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


var getRelatedCoupon = function(product,member,totalPrice,fn){
    try{
        var opt = {
            'host':Config.inf.host,
            'port':Config.inf.port,
            'path':'/coupon/'+product+'/'+member+'?totalPrice='+totalPrice,
            'method':"GET"
        };
        console.log(opt.path);
        var http = new HttpClient(opt);
        http.getReq(function(error,result){
            if(error || result.error!=0){
                fn({error:1});
            }else{
                fn(result);
            }
        });
    }  catch (e){
        fn({error:1});
    }
};

exports.getRelatedCoupon = function(req,res){
    var product = req.query.product;
    var totalPrice = req.query.totalPrice;
    getRelatedCoupon(product,req.session.user._id,totalPrice,function(result){
        res.json(result);
    });
//    res.json(getRelatedCoupon(req.query.product,req.session.user._id,req.query.totalPrice));
};