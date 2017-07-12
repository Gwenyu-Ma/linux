$(document).ready(function () {

    //二级菜单展开
    $(".list_1").click(function(){
        if($(this).find("img").attr('src')=='../img/close.png')
        {
            $(this).find("img").attr('src','../img/open.png');
        }else{
            $(this).find("img").attr('src','../img/close.png');
        }
        $(this).next().toggle();
    });

	//菜单栏滚动条
    $(".menu").slimScroll({
        height: '',
        distance: '1px',
        size: '0'
    });
    //内容区滚动条
    /*$(".content").slimScroll({
        height: '',
        distance: '1px'
    });*/

	//菜单栏高度自适应
    $('.menu').css('height',$(window).height()-66);
    $(window).resize(function(){
        $('.menu').css('height',$(window).height()-66);
    });
    //内容区高度自适应
    $('.content').css('height',$(window).height()-84);
    $(window).resize(function(){
        $('.content').css('height',$(window).height()-84);
    });


    //锚点导航
    $('#nav').onePageNav();
});