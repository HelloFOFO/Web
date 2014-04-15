/**
 * Created by zzy on 4/14/14.
 */
(function($){
//    var today = new Date();
//    var currMonth = today.getMonth();
//    var $cal;
//    var $opts;

    $.fn.calender = function(options){
        var $opts = $.extend({}, $.fn.calender.defaults, options);
        var cal = new Calender($opts,$(this));
        cal.init();
//        $cal=$(this);
//        $(this).addClass("calendarbox");
//        $('#'+$opts.target).focus(function(){
//            $cal.show();
//        });
//        _init();
    };

    $.fn.calender.defaults = {
    };

    var Calender = function($opts,$this){
        var that = this;
        $this.addClass("calendarbox");
        $this.append(Calender.template.table);

        this.today = new Date();
        this.currMonth = this.today.getMonth();
        this.target = $opts.target;
        this.onSelect = $opts.onSelect;
        this.defaultOnSelect = function(el){
            $('#'+that.target).val($(el).data('dfm'));
            $this.hide();
        }
        this.init = function(){
            var tr=$("<tr></tr>");
            var month = new Date(this.today.getFullYear(),this.today.getMonth(),1);
;            var currDay = month.getDay();
            for(var i=0;i<currDay;i++){
                tr.append("<td class='day old'></td>");
            }
            while(this.currMonth==month.getMonth()){

                if(month.getDay()<currDay){
                    Calender.template.body.append(tr);
                    tr=$("<tr></tr>");
                }
                if(month.getDate()==this.today.getDate()){
                    var td = $("<td class='day today'><i>"+month.getDate()+"</i><br></td>");
                    td.data('dfm',month.Format('yyyy-MM-dd'));
                    if($opts.data[month.Format('yyyy-MM-dd')]){
                        var span = $("<span>￥"+$opts.data[month.Format('yyyy-MM-dd')]+"</span>");
                        td.append(span);
                    }
                    td.click(function(){
                        that.defaultOnSelect(this);
                    });
                    tr.append(td);
                } else {
                    var td = $("<td class='day onday'><i>"+month.getDate()+"</i><br></td>");
                    td.data('dfm',month.Format('yyyy-MM-dd'));
                    if($opts.data[month.Format('yyyy-MM-dd')]){
                        var span = $("<span>￥"+$opts.data[month.Format('yyyy-MM-dd')]+"</span>");
                        td.append(span);
                    }
                    td.click(function(){
                        that.defaultOnSelect(this);
                    });
                    tr.append(td);
                }
                currDay=month.getDay();
                month.setDate(month.getDate()+1);
            }
            Calender.template.body.append(tr);

            Calender.template.table.append(Calender.template.header);
            Calender.template.table.append(Calender.template.body);
            Calender.template.table.append(Calender.template.footer);

            $('#'+that.target).focus(function(){
                $this.show();
            });
        }
    }

    Calender.template={
        "table":$("<table class='table-calendar' width='100%'></table>"),
        "header" : $("<thead>" +
            "<tr>" +
            "<th class='prev' style='visibility: hidden;'>" +
            "<i class='arrow-left'></i>" +
            "</th>" +
            "<th colspan='5' id='calendarMonth'><!--month--></th>" +
            "<th class='next' style='visibility: visible;'>" +
            "<i class='arrow-right'></i>" +
            "</th>" +
            "</tr>" +
            "<tr>" +
            "<th class='dow'>S</th>" +
            "<th class='dow'>M</th>" +
            "<th class='dow'>T</th>" +
            "<th class='dow'>W</th>" +
            "<th class='dow'>T</th>" +
            "<th class='dow'>F</th>" +
            "<th class='dow'>S</th>" +
            "</tr>" +
            "</thead>"),
        'body':$("<tbody></tbody>"),
        'footer':$("<tfoot><tr><th colspan='7' class='today' style='display: none;'>Today</th></tr></tfoot>")
    };

//    function _init(){
//        var table = $("<table class='table-calendar' width='100%'></table>");
//        $cal.append(table);
//
//        var thead = $(
//            "<thead>" +
//                "<tr>" +
//                "<th class='prev' style='visibility: hidden;'>" +
//                "<i class='arrow-left'></i>" +
//                "</th>" +
//                "<th colspan='5' id='calendarMonth'>"+today.getFullYear()+"年"+(today.getMonth()+1)+"月"+"</th>" +
//                "<th class='next' style='visibility: visible;'>" +
//                "<i class='arrow-right'></i>" +
//                "</th>" +
//                "</tr>" +
//                "<tr>" +
//                "<th class='dow'>S</th>" +
//                "<th class='dow'>M</th>" +
//                "<th class='dow'>T</th>" +
//                "<th class='dow'>W</th>" +
//                "<th class='dow'>T</th>" +
//                "<th class='dow'>F</th>" +
//                "<th class='dow'>S</th>" +
//                "</tr>" +
//                "</thead>"
//        );
//        var tbody = $("<tbody></tbody>");
//        var tfoot = $("<tfoot><tr><th colspan='7' class='today' style='display: none;'>Today</th></tr></tfoot>");
//
//        var tr=$("<tr></tr>");
//        var month = new Date(today.getFullYear(),today.getMonth(),1);
//        var currDay = month.getDay();
//        for(var i=0;i<currDay;i++){
//            tr.append("<td class='day old'></td>");
//        }
//        while(currMonth==month.getMonth()){
//            if(month.getDay()<currDay){
//                tbody.append(tr);
//                tr=$("<tr></tr>");
//            }
//            if(month.getDate()==today.getDate()){
//                var td = $("<td class='day today'><i>"+month.getDate()+"</i><br></td>");
//                td.data('dfm',month.Format('yyyy-MM-dd'));
//                if($opts.data[month.Format('yyyy-MM-dd')]){
//                    var span = $("<span>￥"+$opts.data[month.Format('yyyy-MM-dd')]+"</span>");
//                    td.append(span);
//                }
//                td.click($opts.onSelect);
//                tr.append(td);
//            } else {
//                var td = $("<td class='day onday'><i>"+month.getDate()+"</i><br></td>");
//                td.data('dfm',month.Format('yyyy-MM-dd'));
//                if($opts.data[month.Format('yyyy-MM-dd')]){
//                    var span = $("<span>￥"+$opts.data[month.Format('yyyy-MM-dd')]+"</span>");
//                    td.append(span);
//                }
//                td.click($opts.onSelect);
//                tr.append(td);
//            }
//            currDay=month.getDay();
//            month.setDate(month.getDate()+1);
//        }
//        tbody.append(tr);
//
//        table.append(thead);
//        table.append(tbody);
//        table.append(tfoot);
//    }

    Date.prototype.Format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };
})(jQuery);