/**
 * Created by cloudbian on 14-3-19.
 */
//search list
$('#query').click(function(event){
    $('#query').button("loading");
    $.ajax({
        type: "post",
        url: "/ticketPriceInput/list",
        cache:false,
//            dataType:"json",
        data:{product:$('#productId').val(),startDate:$('#sDate').val(),endDate:$('#eDate').val(),operator:$('#searchOperator').val(),provider:$('#searchProvider').val(),status:$('#searchStatus').val()},
        success: function(data, textStatus){
            if(data.error!==0){
                alert("查询出错！");
            }else{
                var html = new EJS({url:"../template/temp_ticketPriceAudit.ejs"}).render(data);
                $('#tblcontent').html(html);
                refreshPaginator(data.data.currentPage,data.data.totalPage);
            }
        },
        complete: function(XMLHttpRequest, textStatus){
            //HideLoading();
            $('#query').button("reset");
        },
        error: function(){
            //请求出错处理
            alert("网络异常，请重试！");
        }
    });
});

//autocomplete for product name
$('#searchProduct').autocomplete({
    source:function(req,res){
        $.ajax({
            type: "get",
            url: "/getProductNames/ticket/",
            cache:false,
//            dataType:"json",
            data:{city:$('#searchCity').val(),name:req.term},
            success: function(data, textStatus){
               res(data);
            },
            complete: function(XMLHttpRequest, textStatus){
                //HideLoading();
            },
            error: function(){
                //请求出错处理
                alert("网络异常，请重试！");
            }
        });
    },
    select:function( event, ui ){
        event.preventDefault();
        $('#searchProduct').text(ui.item.label);
        $('#productId').val(ui.item.value);
    },
    max:10,
    minLength:2
//    width:$(this).width(),
});

//refresh paginator
function refreshPaginator(currentPage,totalPage){
    var opt = {
        //paginator
        bootstrapMajorVersion:3,
        currentPage:currentPage,
        totalPages:totalPage,
        size:"normal",
        alignment:"left",
        onPageClicked:function(event, originalEvent, type, page){
            refreshTable(page);
        }
    };
    $('#pageDiv').bootstrapPaginator(opt);
}

//refresh table and paginator
function refreshTable(currentPage){
    //refresh table
    $.ajax({
        type: "post",
        url: "/ticketPriceInput/list",
        cache:false,
//            dataType:"json",
        data:{current:currentPage,product:$('#productId').val(),startDate:$('#sDate').val(),endDate:$('#eDate').val(),operator:$('#searchOperator').val(),provider:$('#searchProvider').val(),status:$('#searchStatus').val()},
        success: function(data, textStatus){
            var html = new EJS({url:"../template/temp_ticketPriceAudit.ejs"}).render(data);
            $('#tblcontent').html(html);
            refreshPaginator(data.currentPage,data.totalPage);
        },
        complete: function(XMLHttpRequest, textStatus){
            //HideLoading();
        },
        error: function(e){
            //请求出错处理
            alert("网络异常，请重试！");
        }
    });
}

//format date to yyyy-MM-dd
function formatDate(time){
    return time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate();
}
//log pass
function passAudit(id){
    audit(id,2);
}

//log refuse
function refuseAudit(id){
    audit(id,0);
}

//log disable
function disableAudit(id){
    audit(id,3);
}

//log audit submit
function audit(id,status){
    $.ajax({
        type: "post",
        url: "/priceAudit/ticket",
        cache:false,
//            dataType:"json",
        data:{_id:id,status:status,operator:$('#operator').val()},
        success: function(data, textStatus){
            if(data.error!==0){
                alert(data.errMsg);
            }else{
                refreshTable(1);
            }
        },
        complete: function(XMLHttpRequest, textStatus){
            //HideLoading();
        },
        error: function(e){
            //请求出错处理
            alert("网络异常，请重试！");
        }
    });
}