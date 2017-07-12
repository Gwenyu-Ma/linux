<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" >
    <meta name="format-detection" content="telephone=no"/>
    <title>瑞星安全云</title>
    <link rel="stylesheet" href="{$pub}/dep/bootstrap/css/bootstrap.css">
    <link rel="stylesheet" href="{$pub}/dep/fontawesome/css/font-awesome.min.css">
    <link rel="stylesheet" href="{$cssEsm}/index.css">

</head>

<body>
    <div class="userInfo">{$user}</div>
	<!--[if lt IE 8]>
		<div class="lowTip">
			<h3>瑞星安全云</h3>
            <p><span>浏览器版本过低，建议你对浏览器进行升级，以便获取最好的用户体验。</span></p>
            <p class="lowTipGood">────────推荐以下浏览器或版本──────────</p>
            <div class="explorerIcon">
                <a class="chrome" href="http://www.google.cn/chrome/browser/" target="_block"></a>
                <a class="firefox" href="http://www.firefox.com.cn/download/" target="_block"></a>
                <a class="ie" href="http://windows.microsoft.com/zh-cn/internet-explorer/download-ie" target="_block"></a>
            </div>
		</div>
	<![endif]-->

	<!--[if (gte IE 8)|!(IE)]><!-->
    <div class="rs-page">
        <div class="rs-page-silder">
            <div class="rs-page-logo">
                <img src="/index.php/mycenter/getlogo">
                <!-- <img src="../public/img/logon.png"> -->
            </div>
            <div class="rs-page-nav">
                <ul class="nav nav-list" id="page-nav">
                    <li>
                        <a href="#home"><span class="ico-home">&nbsp;</span>安全中心</a>
                    </li>
                    <li>
                        <a href="#sys"><span class="ico-sys">&nbsp;</span>全网终端</a>
                    </li>
                    <li>
                        <a href="#virus"><span class="ico-virus">&nbsp;</span>病毒查杀</a>
                    </li>
                    <!--<li>
                        <a href="#protection" ><span class="ico-protection">&nbsp;</span>上网防护</a>
                    </li>                    
                    <li>
                        <a href="#mobile" ><span class="ico-mobile">&nbsp;</span>移动安全</a>
                    </li>
                    {if $showNet eq 1}                
                    <li>
                        <a href="#netdisk" ><span class="ico-netdisk">&nbsp;</span>安全网盘</a>
                    </li>
                    {/if}-->
                    <li>
                        <a href="#report" ><span class="ico-report">&nbsp;</span>报告预警</a>
                    </li>
                    <li>
                        <a href="#auth" ><span class="ico-auth">&nbsp;</span>授权管理</a>
                    </li>
                    <li class="level_contr">
                        <a href="#package" ><span class="ico-package">&nbsp;</span>包管理</a>
                    </li>
                    <li>
                        <a href="#settings"><span class="ico-setting">&nbsp;</span>我的中心</a>
                    </li>

                </ul>
            </div>
            <div class="rs-page-footer">
                <p>北京瑞星</p>
                <p>信息技术股份有限公司</p>
                <p>版权所有</p>
            </div>
        </div>
        <div class="rs-page-wrap">
            <div class="rs-page-wauto">
                <div class="rs-page-header">
                    <div class="aqy-tyb"><h1></h1><h5></h5></div>
                    <span class="rs-page-user">
                        <ul class="nav pull-right">
							<li class="freeUserTip">
								<span>试用版，剩余<i class="red"></i>天</span>
								<a href="">升级为正式用户</a>
							</li>
                            <li class="dropdown">
                                <a href="#" class="dropdown-toggle" data-toggle="dropdown"><span class="userName"></span>您好！<!-- <img src="../public/img/user.png" class="img-circle"> --><img src="/index.php/mycenter/getuserlogo" class="img-circle"><i class="down_up"></i></a>
                                <div class="dropdown-menu">
                                    <span class="dropdown-menu-arrow">&nbsp;</span>
                                    <ul>
                                        <li>
                                            <a href="/index.php/Index/logOut">退出</a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li class="bord">
                                <a href="#settings" class="options" title="设置">&nbsp;&nbsp;</a>
                            </li>
                            <li class="bord" style="margin-left:-10px;">
                                <a href="{$pubEsm}/view2/instruction.html" class="help-link" title="帮助" target="_blank">&nbsp;&nbsp;</a>
                            </li>
                        </ul>
                    </span>
                </div>
                <div class="rs-page-container">

                </div>
            </div>
        </div>
    </div>
    <div class="page-masklayer"></div>
    <div class="page-load">
        <img src="{$imgEsm}/icon/Loading.gif">
        <div><img src="{$imgEsm}/icon/loading_txt.png"></div>
    </div>
    <div class="msg-box"></div>
    <!-- Modal -->
    <div id="mConfig" class="modal hide fade" tabindex="-1">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
            <h3>设置</h3>
        </div>
        <div class="modal-body">
            <label>自定义标题名称</label>
            <input id="txtWebSiteName" type="text">
        </div>
        <div class="modal-footer">
            <button class="btn" data-dismiss="modal">取消</button>
            <button id="btnSaveConfig" class="btn btn-primary">确定</button>
        </div>
    </div>
    <script src="{$pub}/dep/jquery.js"></script>
    <script src="{$pub}/dep/bootbox/bootbox.js"></script>
    <script src="{$pub}/dep/es5-shim/es5-shim.js"></script>
    <script src="{$pub}/dep/es5-shim/es5-sham.js"></script>
    <script src="{$jsEsm}/core.js"></script>
    <script src="{$pub}/dep/bootstrap/js/bootstrap.js"></script>
    <script src="{$pub}/dep/require/require.source.js" data-main="{$jsEsm}/main2"></script>
	<script type="text/javascript">
		$(function(){
			var userInfo = $.parseJSON($(".userInfo").text());
			var $userName = $(".rs-page-user .userName");

            RsCore.ajax('mycenter/myinfo', function(data) {
                // if(data.title == "" || data.title == null){
                //     $(".rs-page-header h1").text("安全云中心");
                //     $(".rs-page-header h5").text("");
                //     window.location = '/Manage/index#settings/overview?g=0';
                // }else{
                //     $(".rs-page-header h1").text(data.company );
                //     $(".rs-page-header h1").text(data.company );
                // }
                $(".rs-page-header h1").text(data.title||'安全云中心' );
                $(".rs-page-header h5").text(data.subTitle||'' );
            });
            
            if(userInfo.UType == "2"){
                $("body").addClass("homeVersion");
            }
            if(userInfo.name && userInfo.name != ''){
                $(".userName").text(userInfo.name + "，");
            }else{
                if(userInfo.name && userInfo.name!=''){
                    $(".userName").text(userInfo.name + "，");
                }else{
                    $(".userName").text('');
                }
            }
            //单用户隐藏显示
            if(userInfo.level == 1){
                $('.level_contr').css('display','block');
            }
		});
        window.static_path = '{$pub}';
	</script>
	<!--<![endif]-->
</body>

</html>
