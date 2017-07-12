define(function (require) {
    var tpl = require('text!home/auth.html');
    var mustache = require('mustache');
    require('colResizable');
    require('table');
    require('css!table');
    require('util_b');
    require('selectric');
    require('css!selectric');
    var common = require('common');
    var getUrlSearchQuerys = RsCore.assist.getUrlSearchQuerys;
    var params2str = RsCore.assist.params2str;
    var op = {
        init: function (container, type, first) {
            common.correctNavTab();
            op.tempParams = null;
            var view = $(container);
            var html = '';
            var params = getUrlSearchQuerys();
            op._type = 'term';
            var dataobj = {};
            dataobj[op._type] = true;
            html = mustache.render(tpl, dataobj);
            view.html(html);

            op.resizeContent();
            op.initEvent(view);
            op.initProductAuth();
            op.initGetNum();
            op.initProductDetails();
        },
        destroyHash: function () {
            var params = getUrlSearchQuerys();
            var _params = {};
            for (var key in params) {
                if (key.indexOf('l_') > -1) {
                    continue;
                }
                _params[key] = params[key];
            }

            var path = window.location.hash.split('?')[0];
            window.location.hash = path + '?' + params2str(_params);
        },
        resizeContent: function () {
            var H = $('.c-page-container').height();
            if ($('.rs-page-nav').length) {
                $('.c-page-content > .slimScrollDiv >  .log-content,.c-page-content > .log-content').slimscroll({
                    height: H,
                    size: '4px',
                    alwaysVisible: true
                });
            }
        },
        initEvent: function (view) {

            $(window).on('resize.home', function () {
                op.resizeContent();
            });

            $('.import-num').click(function(){
                $('.sq_histroy').modal();
                op.initAuthPopup();
            });  

            
        },
        //左侧授权信息
        initProductAuth: function () {
            RsCore.ajax({
                url: '/Authmanager/productAuth',
                success: function(data){
                    var authName = $('.auth-name');
                    var authStartTime =$('.auth-start-time');
                    var authEndTime =$('.auth-end-time');
                    var authStatus = $('.auth-status');
                    var userNum = $('.user-num');
                    var productNum = $('.product-num');
                    var importNum = $('.import-num');
                    var lastImportTime = $('.auth-last');
                    var remarks = $('.spe-remarks');
                    var remainingD =  $('.remainD');
                    var remainingY =  $('.remainY');

                    var Y = data.authEndTime.substring(0,4) - data.authStartTime.substring(0,4);
                    var M = data.authEndTime.substring(4,6) - data.authStartTime.substring(4,6);
                    var D = data.authEndTime.substring(6,8) - data.authStartTime.substring(6,8);
                    var date = Y*365+M*12+D*1;
                    var remainY =  Math.floor(date/365);
                    var remainD =  Math.floor(date);

                    remainingD.text(remainD+'天');
                    if(remainY>=1){
                        remainingY.text(remainY+'年');
                    }
                    authStartTime.text(data.authStartTime.substring(0,4)+'-'+data.authStartTime.substring(4,6)+'-'+data.authStartTime.substring(6,8));
                    authEndTime.text(data.authEndTime.substring(0,4)+'-'+data.authEndTime.substring(4,6)+'-'+data.authEndTime.substring(6,8));

                    if(data.authStatus == '失效'){
                        authStatus.addClass('font_red');
                        authStatus.text(data.authStatus);
                    }else{
                        authStatus.addClass('font_green');
                        authStatus.text(data.authStatus);
                    }

                    userNum.text(Number(data.userNum));
                    productNum.text(Number(data.productNum));
                    importNum.text(Number(data.importNum));
                    if(data.lastImportTime == null){
                        data.lastImportTime = '无';
                    }
                    lastImportTime.text(data.lastImportTime);
                }
            })
        },
        //授权用户使用情况
        initGetNum: function () {
            RsCore.ajax({
                url: 'Enterprisemanager/getTotalNum',
                success: function(data){
                    var authTotal = $('.auth-total');
                    var usersNum = $('.users-num');
                    var authNum = $('.auth-num');
                    var notAuthNum = $('.not-auth-num');
                    var H = (Number(data.usersNum)/Number(data.authTotal));
                    var W = (Number(data.authNum)/Number(data.usersNum));
                    
                    authTotal.text(Number(data.authTotal));
                    usersNum.text(Number(data.usersNum));
                    authNum.text(Number(data.authNum));
                    notAuthNum.text(Number(data.notAuthNum));

                    if( H>=0.8 && H<1 ){
                        $('.bar_on_01').css("background","#f49e38");
                        $('.auth_amount').addClass('font_orange');
                    }
                    if( W>=0.8 && W<1 ){
                        $('.bar_on_02').css("background","#f49e38");
                        $('.creat_amount').addClass('font_orange');
                    }
                    if( H >= 1 ){
                        $('.bar_on_01').css("background","red");
                        $('.auth_amount').addClass('font_red');
                        H = 1
                    }
                    if( W >= 1 ){
                        $('.bar_on_02').css("background","red");
                        $('.creat_amount').addClass('font_red');
                        w = 1
                    }
                    $('.bar_on_01').css("width",H*100+'%');
                    $('.bar_on_02').css("width",W*100+'%');
                }
            })
        },
        //子产品授权使用情况
        initProductDetails: function(){
            RsCore.ajax({
                url: '/Authmanager/productDetails',
                success: function(data){
                    var client_list = '';
                    if(data != ''){
                        for(var i=0;i<data.length;i++){
                            var percent = ((data[i].usedAmount/data[i].authAmount)*100);
                            var H = 'green';
                            var status_font = '';
                            if(percent>=80&&percent<100){
                                H = 'orange';
                                status_font = '即将用完';
                            }
                            if(percent>=100){
                                H = 'red';
                                status_font = '已用完';
                                percent = 100;
                            }
                            if(data[i].usedAmount == null){
                                data[i].usedAmount = '0';
                            }
                            client_list += '<li><i class="sub_pro_'+data[i].codeName+'"></i><div class="sub_pro_info"><div class="sub_pro_tit"><span class="sub_pro_name">'+data[i].name+'</span><span class="sub_pro_point">'+data[i].accreditCount+'点</span></div><div class="sub_pro_bar"><div style="width:'+percent+'%'+'" class="sub_pro_on bg_'+H+'"></div></div><div><span class="sub_pro_num font_'+H+'">'+data[i].usedAmount+'</span>/'+data[i].authAmount+'(点·天)</div></div><p class="sub_pro_msg font_'+H+'">'+status_font+'</p></li>';
                        }
                    }else{
                        client_list += '<li style="text-align:center;">无记录!</li>';
                    }
                    $("#client_list").html( client_list );
                }
            })
        },
        initAuthPopup: function(){
            var html = [];
            html.push('<tr>');
            html.push('{{#first}}<td rowspan="{{rowspan}}">{{cdkey}}</td>{{/first}}');
            html.push('<td>{{name}}</td>');
            html.push('<td>{{codeName}}</td>');
            html.push('<td>{{sysType}}</td>');
            html.push('<td>{{accreditCount}}</td>');
            html.push('<td>{{startTime}}&nbsp;至&nbsp;{{endTime}}</td>');
            html.push('</tr>');
            RsCore.ajax({
                url: 'Authmanager/historyAccredit',
                type: 'get',
                dataType: "json",
                success: function (data) {
                    var da = data;
                    var _html = [];
                    if (da.length == 0) {
                        return false;
                    }
                    for(var i in da){
                        var _da = da[i];
                        var len = _da.length;
                        for (var j = 0; j <len; j++) {
                            var _d = _da[j];
                            _d ['sysType'] = _d ['sysType'] == 1 ? 'windows' : 'linux';
                            _d ['first'] = (j==0?true:false);
                            _d ['rowspan'] =len;
                            _d ['cdkey'] = i;
                            _d ['startTime'] = _d.startTime.substring(0,10);
                            _d ['endTime'] = _d.endTime.substring(0,10);
                            _html.push(mustache.render(html.join(''), _d ))
                        }
                    }
                    $('.auth_popup tbody').html(_html.join(''));
                }
            })
        }

    };
    return {
        container: '.c-page-content',
        render: function (container) {
            document.title = '授权管理-今日授权终端';
            op.init(container, null, true);

        },
        destroy: function () {
            op.destroyHash();
            $(this.container).find('#tbClient').colResizable({
                'disable': true
            });
            $(window).off('resize.log');
            $(this.container).off().empty();
        }
    };
});