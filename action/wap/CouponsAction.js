/**
 * Created by zzy on 6/10/14.
 */
var HttpClient = require('./../../tools/HttpClient.js');
var Config = require('./../../tools/Config');
var _ = require('underscore')._;
var  querystring  = require('querystring');
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
            response.render('wap/myCoupons',{'titleName':'我的优惠券','unuse':unuse,'used':used,'expired':expired});
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
                result.data.forEach(function(d){
                    if(d.type==0){
                        d.payValue = totalPrice - d.value;
                    }else if( d.type == 1 ){
                        d.payValue = Math.round( totalPrice * ( 1 - d.value / 10 ) );
                    }else if( d.type == 3 ){
                        d.payValue = totalPrice;
                    }else if( d.type == 4 ){
                        d.payValue = 0.01;
                    }
                });
                fn(result);
            }
        });
    }  catch (e){
        fn({error:1});
    }
};

exports.getRelatedCoupon = function(req,res){
//    getRelatedCoupon('537f11b20b2f88b830e4d314',req.session.user._id,10000,function(result){
//        res.json(result);
//    });
    var param =  querystring.stringify(req.query);

    getRelatedCoupon('537f11b20b2f88b830e4d314',req.session.user._id,req.query.totalPrice,function(result){
        res.render( 'wap/couponSelect',{ titleName:"" , data:result.data ,param:param} );
    });
//    res.json(getRelatedCoupon(req.query.product,req.session.user._id,req.query.totalPrice));
};