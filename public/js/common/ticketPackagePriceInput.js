/**
 * Created by cloudbian on 14-3-19.
 */
//search list
$('#query').click(function(event){
    $('#query').button("loading");
    $.ajax({
        type: "post",
        url: "/ticketPackagePriceInput/list",
        cache:false,
//            dataType:"json",
        data:{product:$('#productId').val(),startDate:$('#sDate').val(),endDate:$('#eDate').val(),operator:$('#searchOperator').val(),provider:$('#searchProvider').val(),status:$('#searchStatus').val()},
        success: function(data, textStatus){
            if(data.error!==0){
                console.log(data);
                alert("查询出错！");
            }else{
                var html = new EJS({url:"../template/temp_ticketPackagePriceInput.ejs"}).render(data);
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
            url: "/getProductNames/ticketPackage/",
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

//auto print value for addHotelPriceModal
$('#cost').keyup(function(){
    if(""!==$('#cost').val().trim()){
        $('#costWeekend').val($('#cost').val());
    }
});

$('#price').keyup(function(){
    if(""!==$('#price').val().trim()){
        $('#priceWeekend').val($('#price').val());
        $('#packagePrice').val($('#price').val());
        $('#packagePriceWeekend').val($('#price').val());
        $('#marketPrice').val($('#price').val());
        $('#marketPriceWeekend').val($('#price').val());

    }
});

$('#packagePrice').keyup(function(){
    if(""!==$('#packagePrice').val().trim()){
        $('#packagePriceWeekend').val($('#packagePrice').val());
    }
});

$('#marketPrice').keyup(function(){
    if(""!==$('#marketPrice').val().trim()){
        $('#marketPriceWeekend').val($('#marketPrice').val());
    }
});

$('#inventory').keyup(function(){
    if(""!==$('#inventory').val().trim()){
        $('#inventoryWeekend').val($('#inventory').val());
    }
});

//isShow inventoryWeekend
$('#inventoryType').change(function(){
    if("0"===$('#inventoryType').val()){
        $('#inventoryWeekend').show();
    }else{
        $('#inventoryWeekend').hide();
    }
});

//auto list productNames
$('#addCity').change(function(){
    $('#product').html("");
    $.ajax({
        type: "get",
        url: "/getProductNames/ticketPackage/",
        cache:false,
//            dataType:"json",
        data:{city:$('#addCity').val()},
        success: function(data, textStatus){
            var html = "";
           data.forEach(function(obj){
               html +="<option value="+obj.value+">"+obj.label+"</option>"
           });
            $('#product').append(html);
        },
        complete: function(XMLHttpRequest, textStatus){
            //HideLoading();
        },
        error: function(){
            //请求出错处理
            alert("网络异常，请重试！");
        }
    });
});

//save log
$('#addForm').submit(function(event){
    $('#createVoture').button("loading");
    var weeks = 0;
    $('input[name="weekend"]:checked').each(function(){
        weeks++;
    });
    if(weeks<=0){
        alert("请选择周末定义！！！");
        $('#createVoture').button("reset");
        return false;
    }
    if($('#startDate').val()===""){
        alert("请选择开始日期");
        $('#createVoture').button("reset");
        return false;
    }
    if($('#endDate').val()===""){
        alert("请选择结束日期");
        $('#createVoture').button("reset");
        return false;
    }
    $.ajax({
        type: "post",
        url: "/ticketPackagePriceInput/add",
        cache:false,
//            dataType:"json",
        data:$('#addForm').serialize(),
        success: function(data, textStatus){
            if(data.error!==0){
                alert("保存记录错误："+data.errMsg);
            }else{
                refreshTable(1);
            }
        },
        complete: function(XMLHttpRequest, textStatus){
            //HideLoading();
            $('#createVoture').button("reset");
            $('#addHotelPriceModal').modal("toggle");
        },
        error: function(){
            //请求出错处理
            alert("网络异常，请重试！");
        }
    });
    event.preventDefault();
});

//show create dailog
$('#showAdd').click(function(e){
    $('#addForm')[0].reset();
    if("0"===$('#inventoryType').val()){
        $('#inventoryWeekend').show();
    }
    $('#operatorName').val($('#uName').val());
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
        url: "/ticketPackagePriceInput/list",
        cache:false,
//            dataType:"json",
        data:{current:currentPage,product:$('#productId').val(),startDate:$('#sDate').val(),endDate:$('#eDate').val(),operator:$('#searchOperator').val(),provider:$('#searchProvider').val(),status:$('#searchStatus').val()},
        success: function(data, textStatus){
            var html = new EJS({url:"../template/temp_ticketPackagePriceInput.ejs"}).render(data);
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