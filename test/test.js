/**
 * Created by zzy on 3/3/14.
 */
var HttpClient = require('./../tools/HttpClient');

//var client = new HttpClient({
//    hostname:'172.16.0.15',
//    port:3000,
//    path:'/ent/provider/list',
//    method:'GET'
//});
//
//client.getRes(function(err,res){
//    console.log(err,res);
//})


var async =require('async');

async.waterfall([
    function(cb){
        var client = new HttpClient({
            hostname:'172.16.0.15',
            port:3000,
            path:'/ent/provider/create',
            method:'POST'
        });

        client.postRes({'name':'123123'},function(err,res){
            console.log(err,res);
            cb(err,res);
        })
    },
    function (r,cb){
        var client = new HttpClient({
            hostname:'172.16.0.15',
            port:3000,
            path:'/ent/provider/list',
            method:'GET'
        });

        client.getRes(function(err,res){
            console.log(err,res);
            cb(err,res);
        })
    }
],function(err,res){
    console.log('end');
})