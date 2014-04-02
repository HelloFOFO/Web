var httpClient = require('./../tools/HttpClient');
var Config     = require('./../tools/Config');
var DateTool   = require('./../tools/datetool');
var _          = require('underscore');


var propName     = "供应商"
var modName      = "供应商管理"
var productType  = 'ticket'
var template     = 'hotelPriceQuery'

//view
exports.list = function(req,res){
    //init 如果传过来的有page参数,则用page参数，如果传过来没有page参数,则默认为0
    var opt = {
        hostname:Config.inf.host,
        port:Config.inf.port
    };
    var viewData = {data:{priceData:[{yearMonth:'2013-01',shift:3,days:[{price:100},{price:100},{price:100}]}]}};
    if(req.params.id == undefined){

    }else{
        var effectDate = req.params.effectDate;
        var expiryDate = req.params.expiryDate;
        opt.path =  "/product/"+productType+"/price/list/";
        opt.path += req.params.id;
        opt.path += '&effectDate='+effectDate;
        opt.path += '&expiryDate='+expiryDate;
        opt.method="GET";
        try{
            var http = new httpClient(opt);
            http.getReq(function(err,result){
                var monthData={};
                var priceData = _.indexBy(result.data,'date');
                //计算查询的时间段里有多少个月 以便按照月份查询
                var monthDiff =  DateTool.DateDiff('m',effectDate,expiryDate);
                //第一层 按月循环
                for(var i=1;i<=monthDiff;i++){
                    //初始化月份数据
                    monthData={};
                    var dayPrices = [];
                    var currentYearMonth    = new Date(effectDate).Format("yyyy-MM-dd");
                    var currentMonth        = effectDate;
                    //获取本月第一天是周几，如果是周一 shift=0 如果是周二 shift=1
                    var weekOfMonthFirstDay = new Date(effectDate).getDay();//0 是周日 6是周六
                    //计算月份的第一天需要偏移多少个格子
                    var shift = DateTool.getShift(weekOfMonthFirstDay);
                    monthData.yearMonth  = currentYearMonth;
                    //计算本月有多少天
                    var daysOfCurrentMonth = (DateTool.DateAdd('m',1,currentMonth) - currentMonth) / 86400000;
                    //第二层 按天循环 从第一天循环到最后一天
                    for(var i=1 ; i<=daysOfCurrentMonth ; i++){
                        dayPrices.push(priceData[currentMonth + i - 1]);
                    }
                    //一个月的数据循环完毕后，把一个月的数据推送到priceDate数组中
                    viewData.data.priceDate.push(monthData);
                    //然后往后走一个月
                    currentMonth = DateTool.DateAdd('m',1,currentMonth);
                }
            });
            res.render(template,viewData);
        } catch(e){
            ret.error = 1;
            ret.errMsg = e.message+"，请联系管理员！";
            console.log("**********************************************");
            console.log(ret);
        }
    }



};