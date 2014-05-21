/**
 * Created by zzy on 4/14/14.
 */
var clicked = false;
(function($){
//    var today = new Date();
//    var currMonth = today.getMonth();
//    var $cal;
//    var $opts;

    $.fn.calender = function(options){
        var $opts = $.extend({}, $.fn.calender.defaults, options);
        var $this = $(this);
        if($opts.url){
            $.ajax({'url':$opts.url,'type':'GET'})
                .done(function(data){
                    $opts.onData(data);
                    if( data.error ==0 ){
                        $opts.data = data.data;
                        var cal = new Calender($opts,$this);
                        cal.init();
                        $('#'+$opts.target).focus(function(){
//                            console.log('focus');
                            $this.show();
                        }).blur(function(event){
//                                console.log('blur',clicked);
                                if(clicked){
                                    clicked = false;
                                } else {
                                    $this.hide();
                                }
                            });
                    }
                });
        } else {
            var cal = new Calender($opts,$this);
            cal.init();
            $('#'+$opts.target).focus(function(){
//                console.log('focus');
                $this.show();
            }).blur(function(event){
//                    console.log('blur',clicked);
                    if(clicked){
                        clicked = false;
                    } else {
                        $this.hide();
                    }
                });
        }
    };

    $.fn.calender.defaults = {
    };

    var Calender = function($opts,$this){
        //that is Calender instance
        //$this is Calender Div
        var that = this;
        this.today = new Date();
        this.minMonth = new Date(this.today.getFullYear(),this.today.getMonth(),1);
        this.maxMonth = new Date(this.today.getFullYear(),this.today.getMonth(),1);
        this.maxMonth.setMonth(this.maxMonth.getMonth()+2);
        this.currMonth = new Date(this.today.getFullYear(),this.today.getMonth(),1);
        this.target = $opts.target;
        this.onSelect = $opts.onSelect;
        this.defaultOnSelect = function(el){
            $('#'+that.target).val($(el).data('dfm'));
            $this.hide();
        }

        $this.addClass("calendarbox");

        this.cleanDiv = function(){
            $this.html('');
        };

        this.init = function(){
            var table = $("<table class='table-calendar' width='100%'></table>");
            var body = $("<tbody></tbody>");
            var header = $("<thead>" +
                "<tr>" +
                "<th class='prev' style='visibility: visible;'>" +
                "<i class='arrow-left'></i>" +
                "</th>" +
                "<th colspan='5' id='calendarMonth'>"+this.currMonth.Format('yyyy-MM')+"</th>" +
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
                "</thead>");
            var footer = $("<tfoot><tr><th colspan='7' class='today' style='display: none;'>Today</th></tr></tfoot>");
            $this.append(table);
            var tr=$("<tr></tr>");
            var month = new Date(this.currMonth.getFullYear(),this.currMonth.getMonth(),1);
            var currDay = month.getDay();
            for(var i=0;i<currDay;i++){
                tr.append("<td class='day old'></td>");
            }
            while(this.currMonth.getMonth()==month.getMonth()){
                if(month.getDay()<currDay){
                    body.append(tr);
                    tr=$("<tr></tr>");
                }
                if(month.getDate()==this.today.getDate()&&month.getMonth()==this.today.getMonth()&&month.getFullYear()==this.today.getFullYear()){
                    if($opts.data[month.Format('yyyy-MM-dd')]){
                        var td = $("<td class='day today'><i>"+month.getDate()+"</i><br></td>");
                        td.data('dfm',month.Format('yyyy-MM-dd'));
                        var span = $("<span>￥"+$opts.data[month.Format('yyyy-MM-dd')]+"</span>");
                        td.data('price',$opts.data[month.Format('yyyy-MM-dd')]);
                        td.append(span);
                    } else {
                        var td = $("<td class='day today'><i>"+month.getDate()+"</i><br></td>");
                        td.data('dfm',month.Format('yyyy-MM-dd'));
                        var span = $("<span>&nbsp;</span>");
                        td.data('disable',true);
                        td.append(span);
                    }
                    td.click(function(){
                        if($(this).data('disable')){
                            return;
                        }
                        that.defaultOnSelect(this);
                        that.onSelect({
                            'date':$(this).data('dfm'),
                            'price':$(this).data('price')
                        });
                    });
                    tr.append(td);
                } else {
                    if($opts.data[month.Format('yyyy-MM-dd')]){
                        var td = $("<td class='day onday'><i>"+month.getDate()+"</i><br></td>");
                        td.data('dfm',month.Format('yyyy-MM-dd'));
                        var span = $("<span>￥"+$opts.data[month.Format('yyyy-MM-dd')]+"</span>");
                        td.data('price',$opts.data[month.Format('yyyy-MM-dd')]);
                        td.append(span);
                    } else {
                        var td = $("<td class='day disabledday'><i>"+month.getDate()+"</i><br></td>");
                        td.data('dfm',month.Format('yyyy-MM-dd'));
                        var span = $("<span>&nbsp;</span>");
                        td.data('disable',true);
                        td.append(span);
                    }
                    td.click(function(){
//                        console.log($(this).data);
                        if($(this).data('disable')){
                            $('#'+that.target).focus();
                            return;
                        }
                        that.defaultOnSelect(this);
                        that.onSelect({
                            'date':$(this).data('dfm'),
                            'price':$(this).data('price')
                        });
                    });
                    td.mousedown(function(){
                        clicked = true;
                    });
                    tr.append(td);
                }
                currDay=month.getDay();
                month.setDate(month.getDate()+1);
            }
            body.append(tr);

            table.append(header);
            table.append(body);
            table.append(footer);

            $('.prev').click(function(){
                that.prevClick();
                $('#'+that.target).focus();
            }).mousedown(function(){
                    clicked=true;
                });

            $('.next').click(function(){
//                console.log('click');
                that.nextClick();
                $('#'+that.target).focus();
            }).mousedown(function(){
//                    console.log('mousedown',clicked);
                 clicked=true;
                });
        };

        this.prevClick = function(){
            this.currMonth.setMonth(this.currMonth.getMonth()-1);
            if(this.currMonth.getTime()<this.minMonth.getTime()){
                this.currMonth.setMonth(this.currMonth.getMonth()+1);
                return;
            }
            this.cleanDiv();
            this.init();
        };

        this.nextClick = function(){
            this.currMonth.setMonth(this.currMonth.getMonth()+1);
            if(this.currMonth.getTime()>this.maxMonth.getTime()){
                this.currMonth.setMonth(this.currMonth.getMonth()-1);
                return;
            }
            this.cleanDiv();
            this.init();
        };
    }

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