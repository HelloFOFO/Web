exports.getPageInfo = function(query,totalPage,module,otherParams){
    //首页 firstPage = "/__MODULE__?startPage=__PAGEINFO0__&current=1
    //末页 lastPage  = "/__MODULE__?startPage=__PAGEINFO0__&current=__PAGEINFO22_TOTALPAGE__
    //前一页  prePage  =   "/__MODULE__?startPage=__PAGEINFO0__&isPre=1&current=__PAGEINFO20__
    //后一页  nextPage =   "/__MODULE__?startPage=__PAGEINFO0__&isNext=1&current=__PAGEINFO21__
    //第一页  page1   = "/__MODULE__?startPage=__PAGEINFO0__&current=__PAGEINFO0__
    //第二页  page2   = "/__MODULE__?startPage=__PAGEINFO0__&current=__PAGEINFO1__
    //第三页  page3   = "/__MODULE__?startPage=__PAGEINFO0__&current=__PAGEINFO2__
    //第四页  page4   = "/__MODULE__?startPage=__PAGEINFO0__&current=__PAGEINFO3__
    //第五页  page5   = "/__MODULE__?startPage=__PAGEINFO0__&current=__PAGEINFO4__

    var budong = 'javascript:void(0)';
    var requestPage = query.current  > 0 ? parseInt(query.current)  : 1;
    var isPre       = query.isPre     > 0 ? parseInt(query.isPre)     : 0;
    var isNext      = query.isNext    > 0 ? parseInt(query.isNext)    : 0;
    var startPage   = query.startPage > 0 ? parseInt(query.startPage) : 1;
    var totalPage=parseInt(totalPage);
//    var otherParams = "pageSize=1";

//    console.log('Paging Step1',new Date(),startPage);
    var pageInfo={};
    pageInfo.pages=[];
    pageInfo.urls  ={};

    pageInfo.urls.firstPage = "/__MODULE__?startPage=__PAGEINFO0__&current=1&__OTHERPARAMS__".replace(/__MODULE__/,module).replace(/__OTHERPARAMS__/,otherParams);
    pageInfo.urls.lastPage  = "/__MODULE__?startPage=__PAGEINFO0__&current=__PAGEINFO22_TOTALPAGE__&__OTHERPARAMS__".replace(/__MODULE__/,module).replace(/__OTHERPARAMS__/,otherParams);
    pageInfo.urls.prePage   = "/__MODULE__?startPage=__PAGEINFO0__&isPre=1&current=__PAGEINFO20__&__OTHERPARAMS__".replace(/__MODULE__/,module).replace(/__OTHERPARAMS__/,otherParams);
    pageInfo.urls.nextPage  = "/__MODULE__?startPage=__PAGEINFO0__&isNext=1&current=__PAGEINFO21__&__OTHERPARAMS__".replace(/__MODULE__/,module).replace(/__OTHERPARAMS__/,otherParams);
    pageInfo.urls.pageStr1= "/__MODULE__?startPage=__PAGEINFO0__&current=__PAGEINFO0__&__OTHERPARAMS__".replace(/__MODULE__/,module).replace(/__OTHERPARAMS__/,otherParams);
    pageInfo.urls.pageStr2= "/__MODULE__?startPage=__PAGEINFO0__&current=__PAGEINFO1__&__OTHERPARAMS__".replace(/__MODULE__/,module).replace(/__OTHERPARAMS__/,otherParams);
    pageInfo.urls.pageStr3= "/__MODULE__?startPage=__PAGEINFO0__&current=__PAGEINFO2__&__OTHERPARAMS__".replace(/__MODULE__/,module).replace(/__OTHERPARAMS__/,otherParams);
    pageInfo.urls.pageStr4= "/__MODULE__?startPage=__PAGEINFO0__&current=__PAGEINFO3__&__OTHERPARAMS__".replace(/__MODULE__/,module).replace(/__OTHERPARAMS__/,otherParams);
    pageInfo.urls.pageStr5= "/__MODULE__?startPage=__PAGEINFO0__&current=__PAGEINFO4__&__OTHERPARAMS__".replace(/__MODULE__/,module).replace(/__OTHERPARAMS__/,otherParams);

    //如果传过来的是”下一页“，则开始页就从现在的开始页的下一页开始  startPage不可能退回到0
//    startPage =startPage+isNext-isPre<=0?1:

    if(startPage+isNext-isPre <= 0 || requestPage == 1){
        startPage = 1;
    }else if( startPage + 4 < requestPage){
        startPage = requestPage-4;
    }
    else{
        startPage = startPage+isNext-isPre;
    }

    for(var i=0;i<=4;i++){
        pageInfo.pages[i]={};
        pageInfo.pages[i].page  = startPage+i;
        //如果页数大于总页数,则标为disable
        if(startPage + i>totalPage){
            pageInfo.pages[i].class = "disabled";
            if(i==0){pageInfo.urls.pageStr1=budong;}
            if(i==1){pageInfo.urls.pageStr2=budong;}
            if(i==2){pageInfo.urls.pageStr3=budong;}
            if(i==3){pageInfo.urls.pageStr4=budong;}
            if(i==4){pageInfo.urls.pageStr5=budong;}
        }
        //如果页数等于当前页，则标为active
        if(startPage + i == requestPage){
            pageInfo.pages[i].class = "active";
        }
    }

if(pageInfo.urls.pageStr1!=budong){
    pageInfo.urls.pageStr1=pageInfo.urls.pageStr1.replace(/__PAGEINFO0__/g,pageInfo.pages[0].page);
}
if(pageInfo.urls.pageStr2!=budong){
    pageInfo.urls.pageStr2=pageInfo.urls.pageStr2.replace(/__PAGEINFO0__/g,pageInfo.pages[0].page).replace(/__PAGEINFO1__/g,pageInfo.pages[1].page);
}
if(pageInfo.urls.pageStr3!=budong){
    pageInfo.urls.pageStr3=pageInfo.urls.pageStr3.replace(/__PAGEINFO0__/g,pageInfo.pages[0].page).replace(/__PAGEINFO2__/g,pageInfo.pages[2].page);
}
if(pageInfo.urls.pageStr4!=budong){
    pageInfo.urls.pageStr4=pageInfo.urls.pageStr4.replace(/__PAGEINFO0__/g,pageInfo.pages[0].page).replace(/__PAGEINFO3__/g,pageInfo.pages[3].page);
}
if(pageInfo.urls.pageStr5!=budong){
    pageInfo.urls.pageStr5=pageInfo.urls.pageStr5.replace(/__PAGEINFO0__/g,pageInfo.pages[0].page).replace(/__PAGEINFO4__/g,pageInfo.pages[4].page);
}

    //前一页
    if(requestPage <= 1){
        pageInfo.pages[20] = {page:requestPage - 1,class:'disabled'};
        pageInfo.urls.prePage=budong;
    }else{
        pageInfo.pages[20] = {page:requestPage - 1,class:''};
    }

    if(pageInfo.urls.prePage!=budong){
        pageInfo.urls.prePage=pageInfo.urls.prePage.replace(/__PAGEINFO0__/g,pageInfo.pages[0].page).replace(/__PAGEINFO20__/g,pageInfo.pages[20].page);
    }

    //下一页
    if(requestPage + 1 > totalPage){
        pageInfo.pages[21] = {page:requestPage + 1,class:'disabled'};
        pageInfo.urls.nextPage=budong;
    }else{
        pageInfo.pages[21] = {page:requestPage + 1,class:''};
    }

    if(pageInfo.urls.nextPage!=budong){
        pageInfo.urls.nextPage=pageInfo.urls.nextPage.replace(/__PAGEINFO0__/g,pageInfo.pages[0].page).replace(/__PAGEINFO21__/g,pageInfo.pages[21].page);
    }

    //末尾页
   pageInfo.pages[22] = {totalPage:totalPage};

    pageInfo.urls.firstPage = pageInfo.urls.firstPage.replace(/__PAGEINFO0__/g,pageInfo.pages[0].page);
    pageInfo.urls.lastPage  = pageInfo.urls.lastPage.replace(/__PAGEINFO0__/g,pageInfo.pages[0].page).replace(/__PAGEINFO22_TOTALPAGE__/,pageInfo.pages[22].totalPage);

//   console.log(pageInfo);
    return pageInfo;
}
