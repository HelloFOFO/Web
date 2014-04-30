/**
 * User: cloudbian
 * Date: 13-12-31
 * Time: 上午10:14
 * RoomQty Calendar is for calendar page
 * param :
 * nowTime :today
 * roomQty :room quality (default -1 nothing, 0 is noRoom, 1 is  less, 2 more) the first element is today's room quality
 */

(function($){
    $.fn.qc = function(options){
        var canvas ;
        var year = "";
        var month = "";
        var nowTime = new Date();
        var roomQty = [];
        return this.each(function(){
           var defaults = {
            nowTime : new Date(),
            roomQty : []
           };
           var settings = $.extend({},defaults,options);
           initPlugin(settings.nowTime,settings.roomQty,$(this));
        });
        function initPlugin(now,rqty,div){
            nowTime = now;
            roomQty = rqty;
            canvas = div;
            if(!(nowTime instanceof Date)){
                alert("[nowTime] need Date Object");
                return;
            }
            if(!(roomQty instanceof Array)){
                alert("[roomQty] need Array Object");
                return;
            }
            //draw the calendar in the page
            drawCurrMonth(roomQty);
            //bind click event
            bindClick();
        }

        function drawOtherMonth(year,month,qtys){
            //draw start
            var html = "";
            canvas.html("");
            var thisMonthDays = new Date(year, month+1, 0).getDate();
            /* -----------------------set header for calendar---------------------------------   **/
            html += getCalHeadModual(year,month);
            /* -----------------------set dates for calendar---------------------------------- **/
            var firstDay = new Date(year,month,1); //get first day of this month
            //set last month days
            html += "<tr>";
            for(var i=firstDay.getDay();i>0;i--){
                html += getPastDayModual(new Date(firstDay-i*86400000),false,-1);
            }
            var qtyCur = 0; //init cursor for the qtys
            for(var i=1;i<=thisMonthDays;i++){
                var dateObj = new Date(year,month,i);
                if(qtyCur<qtys.length&&0!==qtys.length){
                    html += getDayModual(dateObj,false,qtys[qtyCur]);
                    qtyCur++;
                }else{
                    html += getDayModual(dateObj,false,-1);
                }
            }
            //drawing
            canvas.append(html);
        }
        function drawCurrMonth(qtys){
            year = nowTime.getFullYear();
            month = nowTime.getMonth();
            var date = nowTime.getDate();
            var thisMonthDays =  new Date(year, month+1, 0).getDate();
//            if(qtys.length>thisMonthDays){
//                alert("[roomQty] length is more than days of this month");
//                return;
//            }
            //draw start
            var html = "";
            canvas.html("");
            /* -----------------------set header for calendar---------------------------------   **/
            html += getCalHeadModual(year,month);
            /* -----------------------set dates for calendar---------------------------------- **/
            var firstDay = new Date(year,month,1); //get first day of this month
            //set last month days
            html += "<tr>";
            for(var i=firstDay.getDay();i>0;i--){
                html += getDayModual(new Date(firstDay-i*86400000),false,-1);
            }
            //set the first day in the calendar
            var flag = false; // is get room Qty now (true or false)
            var qtyCur = 0; //init cursor for the qtys
            for(var i=1;i<=thisMonthDays;i++){
                var dateObj = new Date(year,month,i);
                if(date!=i){
                    if(flag&&qtyCur<qtys.length){
                        html += getDayModual(dateObj,false,qtys[qtyCur]);
                    }else{
                        html += getDayModual(dateObj,false,-1);
                    }
                }else{
                    flag = true;
                    html += getDayModual(dateObj,true,qtys[qtyCur]);  //begin get room quality start
                }
                if(flag){
                   qtyCur++;
                }
            }
            //drawing
            canvas.append(html);
        }
        //get calendar head of html
        function getCalHeadModual(year,month){
            var head = "<section class='hotelCalendar'>";
            head += "<input type='hidden' id='d_selected'/>";
            head += "<h2><button class='prevMonth'/>"+year+"年"+(month+1)+"月<button class='nextMonth''/></h2>";
            head +="<table width='100%' border='0' cellspacing='0' cellpadding='0' class='CalendarTable'>";
            head +="<tr>";
            head +="<th width='14%' height='40' align='center' valign='middle'>日</th>";
            head +="<th width='14%' align='center'' valign='middle'>一</th>";
            head +="<th width='14%' align='center'' valign='middle'>二</th>";
            head +="<th width='14%' align='center'' valign='middle'>三</th>";
            head +="<th width='14%' align='center'' valign='middle'>四</th>";
            head +="<th width='14%' align='center'' valign='middle'>五</th>";
            head +="<th width='14%' align='center'' valign='middle'>六</th>";
            head +="</tr>";
            return head;
        }
        //get past day modual of html
        function getPastDayModual(dateObj,isToDay,roomQty){
            if(d==0){
                text += "<tr>";
            }
            var text = "<td align='center' valign='middle'>";
            text += "<div class='CalendarTd "+getQualityCss(roomQty)+"' id='"+dateObj.getTime()+"'>";
            if(isToDay){
                text += "<p class='dateToday'>";
            }else{
                text += "<p>";
            }
            text += "</p>";
            text += getQualityText(roomQty);
            text += "</div>";
            text += "</td>";
            var d = dateObj.getDay();
            if(d==6){
                text += "</tr>";
            }
            return text;
        }
        //get day modual of html
        function getDayModual(dateObj,isToDay,roomQty){
            if(d==0){
                text += "<tr>";
            }
            var text = "<td align='center' valign='middle'>";
            text += "<div class='CalendarTd "+getQualityCss(roomQty)+"' id='"+dateObj.getTime()+"' rq='"+roomQty+"'>";
            if(isToDay){
                text += "<p class='dateToday'>";
            }else{
                text += "<p>";
            }
            text += dateObj.getDate()+"</p>";
            text += getQualityText(roomQty);
            text += "</div>";
            text += "</td>";
            var d = dateObj.getDay();
            if(d==6){
                text += "</tr>";
            }
            return text;
        }
        //get romm quality status
        function getQualityText(roomQty){
            var status = "";
            switch(roomQty){
                case -1:
                    status = "<p class='datefull'></p>";
                    break;
                case 0:
                    status = "<p class='datefull'>满</p>";
                    break;
                default :
                    status = "<p class='datefull'>"+roomQty+"</p>";
                    break;
            }
            return status;
        }
        //get romm quality css
        function getQualityCss(roomQty){
            var css = "";
            switch(roomQty){
                case -1:
                    css = "dateUnkown";
                    break;
                case 0:
                    css = "dateOut";
                    break;
                default :
                    css = "dateOrder";
                    break;
            }
            return css;
        }
        // bind click evnet
        function bindClick(){
            //select day click
            $(".datered").bind("click",function(event){
                selectDo(event.currentTarget);
            });
            $(".dateOrder").bind("click",function(event){
                selectDo(event.currentTarget);
            });
            //select month click
            $(".prevMonth").bind("click",function(event){
                selectMonth(-1);
            });
            $(".nextMonth").bind("click",function(event){
                selectMonth(1);
            });
        }

        //click
        function selectDo(e){
            document.location.href = '/wap/productDetail/'+$('#id').val()+'/4?price='+$(e).attr('rq')+'&date='+e.id;
        }

      //select month
      function selectMonth(goNumber){
        month = month + goNumber;
        if(month<0){
           year --;
           month = 12 + month;
        }else if(month>11){
           year ++;
           month = month - 12;
        }
        if(nowTime.getFullYear()==year&&nowTime.getMonth()==month){
            drawCurrMonth(roomQty);
        }else{
            var newQty = [];
            var diff = parseInt((new Date(year,month,1).getTime() - nowTime.getTime())/86400000)+1;
            if(diff>0&&diff<roomQty.length){
                var newQty = roomQty.slice(diff-1,roomQty.length);
            }
            drawOtherMonth(year,month,newQty);
        }
          bindClick();
      }
    }
})(jQuery);