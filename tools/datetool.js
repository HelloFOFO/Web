/**
 * Created by wucho on 14-3-26.
 */

exports.DateDiff = function (interval,date1,date2){
    var long = date2 - date1; //相差毫秒
    switch(interval.toLowerCase()){
        case "y": return parseInt(date2.getFullYear() - date1.getFullYear());
        case "m": return parseInt((date2.getFullYear() - date1.getFullYear())*12 + (date2.getMonth()-date1.getMonth()));
        case "d": return parseInt(long/1000/60/60/24);
        case "w": return parseInt(long/1000/60/60/24/7);
        case "h": return parseInt(long/1000/60/60);
        case "n": return parseInt(long/1000/60);
        case "s": return parseInt(long/1000);
        case "l": return parseInt(long);
    }
};

exports.DateAdd = function(interval,number,date){
    var date = new Date(date);
    switch(interval.toLowerCase()){
        case "y": return new Date(date.setFullYear(date.getFullYear()+number)).getTime();
        case "m": return new Date(date.setMonth(date.getMonth()+number)).getTime();
        case "d": return new Date(date.setDate(date.getDate()+number)).getTime();
        case "w": return new Date(date.setDate(date.getDate()+7*number)).getTime();
        case "h": return new Date(date.setHours(date.getHours()+number)).getTime();
        case "n": return new Date(date.setMinutes(date.getMinutes()+number)).getTime();
        case "s": return new Date(date.setSeconds(date.getSeconds()+number)).getTime();
        case "l": return new Date(date.setMilliseconds(date.getMilliseconds()+number)).getTime();
    }
};

exports.getShift = function(weekday){
    var weekday = parseInt(weekday);
    switch (weekday){
        case 1:return 0;
        case 2:return 1;
        case 3:return 2;
        case 4:return 3;
        case 5:return 4;
        case 6:return 5;
        case 0:return 6;
    }
}