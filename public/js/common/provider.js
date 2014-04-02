/**
 * Created by cloudbian on 14-3-14.
 */
//save or update provider
    $('#providerForm').submit(function(event){
        var url;
        $('#createProvider').button("loading");
        if("save"===$('#tabActive').val()){
            url = "/provider/add";
        }else{
            url =  "/provider/update/"+$('#selectedId').val();
        }
        $.ajax({
            type: "post",
            url: url,
            cache:false,
//            dataType:"json",
            data:$('#providerForm').serialize(),
            success: function(data, textStatus){
                if(data.error!==0){
                    alert("保存供应商错误："+data.errMsg);
                }else{
                    refreshTable(1);
                }
            },
            complete: function(XMLHttpRequest, textStatus){
                //HideLoading();
                $('#createProvider').button("reset");
                $('#createProviderModal').modal("toggle");
            },
            error: function(){
                //请求出错处理
                alert("网络异常，请重试！");
            }
        });
        event.preventDefault();
});

//show create dailog
$('#showCreate').click(function(e){
    $('#tabActive').val("save");
    $('#modalTilte').val("新建供应商");
    $('#providerForm')[0].reset();
    $('#operatorName').val($('#uName').val());
//    $('#isEnable').bootstrapSwitch('state',true);
});

//show edit dailog
$('#showEdit').click(function(e){
    $('#tabActive').val("update");
    $('#modalTilte').val("编辑供应商");
    $(this).button("loading");
    $('#createProviderModal').modal("hide");
    var _id = $('#selectedId').val();
    if(""===_id||undefined===_id||_id.length<=0){
        alert("请选择需要编辑的供应商！");
        $('#showEdit').button("reset");
    }else{
        $.ajax({
            type: "post",
            url: "/provider/detail",
            cache:false,
//            dataType:"json",
            data:{id:_id},
            success: function(data, textStatus){
                if(data.error===0){
                    $('#name').val(data.data.name);
                    $('#contactName').val(data.data.contactName);
                    $('#contactEmail').val(data.data.contactEmail);
                    $('#contactPhone').val(data.data.contactPhone);
                    $('#proCode').val(data.data.proCode);
                    $('#balanceType').val(data.data.balanceType);
                    $('#returnType').val(data.data.returnType);
                    $('#remark').val(data.data.remark);
                    $('#isEnable').val(data.data.isEnable);
                    $('#operatorName').val($('#uName').val());
                }else{
                    alert("获取详情出错："+data.errMsg);
                }
            },
            complete: function(XMLHttpRequest, textStatus){
                //HideLoading();
                $('#createProviderModal').modal("show");
                $('#showEdit').button("reset");
            },
            error: function(){
                //请求出错处理
                alert("网络异常，请重试！");
            }
        });
    }

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
        url: "/provider/list",
        cache:false,
//            dataType:"json",
        data:{current:currentPage},
        success: function(data, textStatus){
            var html = new EJS({url:"./template/temp_provider.ejs"}).render(data);
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