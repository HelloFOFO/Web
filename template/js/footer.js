//nav control
//$('.nav-container').on('click','ul > li > a',function(){
//     $(this).next().toggleClass('hide');
//});

$('table').on('click','tr',function(){
    var html = $(this).html();
    console.log(html);
});