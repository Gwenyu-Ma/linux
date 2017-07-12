<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>瑞星安全云</title>
  <link rel="stylesheet" href="{$pub}/dep/bootstrap/css/bootstrap.css">
  <link rel="stylesheet" href="{$pub}/dep/fontawesome/css/font-awesome.min.css">
  <!--[if IE 7]> 
    <link rel="stylesheet" href="{$pub}/dep/fontawesome/css/font-awesome-ie7.min.css">
    <script src="{$pub}/dep/json2.js"></script>
  <![endif]--> 
  <link rel="stylesheet" href="{$css}/index.css">
</head>
<body>
  
  <div class="rs-page">
    <div class="navbar navbar-fixed-top rs-page-header">
      <div class="navbar-inner">
        <div class="container-fluid">
          <a id="websiteName" class="brand" href="#"></a>
          <div class="nav-collapse collapse navbar-responsive-collapse">
            <ul class="nav">
              <li>
                <a href="#home">首页</a>
              </li>
              <li>
                <a href="#manage/client?0">管理</a>
              </li>
              <li>
                <a href="#log">日志</a>
              </li>
              <li>
                <a href="#report">报告</a>
              </li>
            </ul>
            <ul class="nav pull-right">
              <li>
                <a href="#"><i class="fa fa-bell"></i></a>
              </li>
              <!--<li class="divider-vertical"></li>-->
              <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                  <i class="fa fa-user"></i> 用户 <i class="fa fa-caret-down"></i>
                </a>
                <ul class="dropdown-menu">
                  <li>
                    <a href="#enterprise">
                      <i class="fa fa-pencil-square"></i> 资料
                    </a>
                  </li>
                  <li>
                    <a href="javascript:;" id="btnConfig">
                      <i class="fa fa-cog"></i> 设置
                    </a>
                  </li>
                  <li class="divider"></li>
                  <li>
                    <a href="/index.php/Index/logOut">
                      <i class="fa fa-sign-out"></i> 退出
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="rs-page-container">
    </div>
  </div>

  <!--<div class="page-load">
    <div class="load-layer">
      <img src="img/page-loading.gif">
      <p>页面加载中, 请稍后 ...</p>
    </div>
  </div>-->
  <div class="page-masklayer"></div>
  <div class="page-load">
    <img src="{$img}/page-loading.gif">
    <p>页面加载中, 请稍后 ...</p>
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
  <script src="{$js}/core.js"></script>
  <script src="{$pub}/dep/bootstrap/js/bootstrap.js"></script>
  <script src="{$pub}/dep/require/require.source.js" data-main="{$js}/main"></script>
</body>
</html>