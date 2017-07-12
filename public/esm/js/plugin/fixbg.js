$(function(){
    if(!supports('background-size')){
        var $bgObj = $('.bg');
        var bgImg = $bgObj.attr('bgImg');
        $bgObj.css('background-image','url()').append($('<img src="'+bgImg+'">'));
    }

    /*一屏页面内容高屏居中*/
    if($('div.bg').length){
        resetContent();
        $(window).resize();
    }
    function resetContent(){
        var docH = $(document).height();
        var visulH = $(window).height();
        var minH = 800;
        if(visulH>minH){
            $('.content').css('margin-top',40+(visulH-minH)/2+'px');
        }
    }
});