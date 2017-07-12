<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" > </meta>
    <title>注册</title>
    <link rel="stylesheet" href="{$pub}/dep/bootstrap/css/bootstrap.css">
    <link rel="stylesheet" href="{$pub}/dep/swiper/css/swiper.css">
    <link rel="stylesheet" href="{$css}/base.css">
    <link rel="stylesheet" href="{$css}/register.css">
  </head>
  <body>
    <div class="bg" bgImg="{$pub}/img/banner_3.jpg"><!--<img src="{$pub}/img/banner_3.png">--></div>
    <div class="navbar navbar-static-top">
      <div class="navbar-inner">
        <div class="container-fluid">
          <a href="/" class="logo"><img src="{$img}/logo2.png"><img src="{$img}/nav_txt.png"></a>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="left_side">
        <div class="slide swiper-container  js_slide_scroll1">
          <div class="swiper-wrapper">
            <div class="swiper-slide"><img src="{$img}/side01.png"></div>
            <div class="swiper-slide"><img src="{$img}/side02.png"></div>
            <div class="swiper-slide"><img src="{$img}/side03.png"></div>
          </div>
          <div class="swiper-pagination"></div>
        </div>
        <div class="slide swiper-container  js_slide_scroll2">
          <div class="swiper-wrapper">
            <div class="swiper-slide"><img src="{$img}/side11.png"></div>
            <div class="swiper-slide"><img src="{$img}/side12.png"></div>
            <div class="swiper-slide"><img src="{$img}/side13.png"></div>
            <div class="swiper-slide"><img src="{$img}/side14.png"></div>
          </div>
          <div class="swiper-pagination"></div>
        </div>
      </div>
      <div class="reg_box">
        <div class="row">
          <h1 class="logo-title">用户注册</h1>
        </div>
        <div>
          <div class="wrong ml120 mt50">
            <h4>{$content}</h4>
            <div>{$email}</div>
          </div>
          <div class="gray_deep auto w250">账户的基本信息，可以登录系统后详细设置。</div>
          <a href="{$url}" target="_blank" class="btn btn-large btn-block btn-purple  w250 auto mt25">{$btnTxt}</a>
        </div>
      </div> 
    </div>
    <div class="footer">
      <div>
        <span>地址：北京市中关村大街22号  中科大厦1305室</span>&nbsp;
        <span>邮编：100190</span>&nbsp;
        <span>总机：(010)82678866</span>
      </div>
      <div>
        <span>版权所有 北京瑞星信息技术股份有限公司</span>&nbsp;
        <span>许可证号：京ICP证080383号 京ICP备08104897</span>&nbsp;
        <span>总机：(010)82678866</span>
      </div>
      <div>
        <span>备案编号：京ICP备08104897号-9</span>&nbsp;
        <span>京网文[2011]0121-043号</span>
      </div>
    </div>
    <script src="{$pub}/dep/jquery.js"></script>
    <script src="{$pub}/dep/bootstrap/js/bootstrap.js"></script>
    <script src="{$pub}/dep/jquery-placeholder/jquery.enplaceholder.js"></script>
    <script src="{$pub}/dep/bootbox/bootbox.js"></script>
    <script src="{$pub}/dep/jquery-validation/jquery.validate.js"></script>
    <script src="{$pub}/dep/swiper/js/swiper.js"></script>
    <script src="{$js}/plugin/assist.js"></script>
    <script src="{$js}/plugin/fixbg.js"></script>
    <script>
      $(function(){
        var sw1 = new Swiper('.js_slide_scroll1',{
                loop : true,
                autoplay:2000,
                pagination:'.js_slide_scroll1 .swiper-pagination',
                paginationClickable :true,
                autoplayDisableOnInteraction:false
            });
        var sw2 = new Swiper('.js_slide_scroll2',{
                loop : true,
                autoplay:2000,
                pagination:'.js_slide_scroll2 .swiper-pagination',
                paginationClickable :true,
                autoplayDisableOnInteraction:false
            });

        $('.js_slide_scroll1').show();
            $('.js_slide_scroll2').hide();
            sw2.stopAutoplay();
            sw1.startAutoplay();
        if({$oType}==2){
            $('.js_slide_scroll1').hide();
            $('.js_slide_scroll2').show();
            sw1.stopAutoplay();
            sw2.startAutoplay();
        }
      })
    </script>
  </body>
</html>