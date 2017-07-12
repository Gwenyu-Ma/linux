define(function (require) {
    var tpl = require('text!home.html');
    var mustache = require('mustache');
    require('dep/dragsort/jquery.dragsort-0.5.2');
    require('dep/jquery.cookie');
    require('slimscroll');
    var echarts = require('echarts3');
    var myEchartSet = require('./myEchartSet');
    var defaultSettingData = {
        order: [
            'threaten',
            'os',
            'virCount',
            'virKill',
            /*'flow',*/
            'network',
            /*'interception',*/
            'location',
            'maliciousUrl'
        ],
        threaten: {
            moduleName: 'threaten',
            width: 2,
            isShow: 1
        },
        os: {
            os: 'os',
            width: 1,
            isShow: 1
        },
        virCount: {
            moduleName: 'virCount',
            width: 2,
            isShow: 1
        },
        virKill: {
            moduleName: 'virKill',
            width: 2,
            isShow: 1
        },
        flow: {
            moduleName: 'flow',
            width: 1,
            isShow: 0
        },
        network: {
            moduleName: 'network',
            width: 1,
            isShow: 1
        },
        interception: {
            moduleName: 'interception',
            width: 1,
            isShow: 0
        },
        location: {
            moduleName: 'location',
            width: 2,
            isShow: 0
        },
        maliciousUrl: {
            moduleName: 'maliciousUrl',
            width: 1,
            isShow: 1
        }
    };
    var op = {
        resizeTick: 0,
        resizeTickObj: null,
        echartsObj: [],
        init: function (view) { },
        /**
         * [resizeSilderNav 终端分组模拟滚动条]
         * @return {[type]} [description]
         */
        resizeSilderNav: function () {
            var H = $('.rs-page').height() - 159;
            if ($('.rs-page-nav').length) {
                $('.rs-page-nav > .slimScrollDiv >  ul,.rs-page-nav > ul').slimscroll({ height: H, size: '4px', alwaysVisible: true });
            }
        },
        initEchart: function (container) {
            var view = $(container);
            var self = this;
            var isSetting = false;
            var settingData = {};

            //获取自定义数据
            RsCore.ajax('user/getusersetting', function (data, code, msg) {
                if (data == '') {
                    isSetting = false;
                } else {
                    isSetting = true;
                    settingData = $.parseJSON(data);
                }

                if (isSetting) {
                    self.customModule(settingData, view);
                } else if ($.cookie('customModule')) {
                    self.customModule($.parseJSON($.cookie('customModule')), view);
                } else {
                    self.customModule(defaultSettingData, view);
                }
            });

            RsCore.ajax('Sys/getEpOnlineStatistics', function (data) {
                var total = 0;
                total = Number(data['woff']) + Number(data['won']);
                view
                    .find('.home-client .home-tit h3')
                    .text('终端部署情况(共' + total + '台)');

                view
                    .find('.client-info .online')
                    .find('em').text(data['won'] + '台在线').end()
                    .find('span').text('占全网' + (((data['won'] / total) * 100) || 0) + '%');
                view
                    .find('.client-info .offline')
                    .find('em').text(data['woff'] + '台在线').end()
                    .find('span').text('占全网' + (((data['woff'] / total) * 100) || 0) + '%');
            });
            RsCore.ajax('ep/getEPVersionStatistics', function (data) {
                var html = [];
                for (var i = 0; i < data.length; i++) {
                    var da = data[i];
                    var _ht = '<li>' +
                        '<span class="vers">' + i + '</span >' +
                        '<div class="process">' +
                        '<div style="width:' + ((da.count / da.total) * 100) + '%"></div>' +
                        '</div>' +
                        '<em><i>' + da.count + '</i>/' + da.total + '</em>' +
                        '</li> ';
                    html.push(_ht);
                }
                view.find('.vers-info ul').html(html.join(''));
            });

            /*安卓二维码*/
            //op.getAndroidQr(3, view);

        },
        getAndroidQr: function (getQrTime, view) {
            $.get('/index.php/index/package', {
                platform: 'android'
            }, function (json) {
                json = $.parseJSON(json);
                if (json && json.r) {
                    var r = json.r;
                    switch (r.code) {
                        case 1: //失败
                            if (getQrTime > 0) {
                                getQrTime--;
                                setTimeout(function () {
                                    op.getAndroidQr(getQrTime, view);
                                }, 60000);
                            }

                            break;
                        case 0: //成功
                            //window.open(json.data.dist.link);
                            view
                                .find('.down-rwm img:eq(0)')
                                .prop('src', json.data.dist.qr);
                            $('.js_reload_rwm').removeClass('js_reload_rwm');
                            break;
                        case 401:
                            if (!RsCore.cache.bootbox) {
                                RsCore.cache.bootbox = true;
                                bootbox.alert('登录过期', function () {
                                    RsCore.cache.bootbox = false;
                                    window.location.href = '/index';
                                });
                                return false;
                            }
                            break;
                        default:
                            RsCore
                                .msg
                                .warn('错误', r.msg);
                            break;
                    }
                }
            });
        },
        initEvent: function (container) {
            //window.echa = op.echartsObj;
            var view = $(container);

            view.on('mouseenter', '.js_reload_rwm', function () {
                $(this)
                    .find('img:eq(0)')
                    .hide()
                    .end()
                    .find('img:eq(1)')
                    .show();
            })
                .on('mouseleave', '.js_reload_rwm', function () {
                    $(this)
                        .find('img:eq(1)')
                        .hide()
                        .end()
                        .find('img:eq(0)')
                        .show();
                })
                .on('click', '.js_reload_rwm', function () {
                    op.getAndroidQr(3, view);
                });

            view.on('click', '.down-sys a', function () {
                var me = $(this);
                var type = me.attr('downType');
                if (type == 'linux') {
                    RsCore
                        .msg
                        .warn('尚未支持，敬请期待！');
                    return false;
                }
                if (me.hasClass('process')) {
                    return false;
                }

                var down_html = [];
                var $downBox = $('.down-sys');
                $('.down-box').remove();
                down_html.push('<div class="down-box" style="width:' + ($downBox.width() - 10) + 'px;">');
                down_html.push('<i class="down-box-arr"></i>');
                down_html.push('<div class="down-box-tit">');
                down_html.push('<span class="down-box-close"></span>');
                down_html.push('<h3>安装包正在加载...</h3>');
                down_html.push('</div><div class="down-box-bod">');
                down_html.push('<span class="down-box-load"></span>');
                down_html.push('</div></div>');
                $downBox.append(down_html.join(''));

                $('.down-box-close').on('click', function () {
                    $(this)
                        .closest('.down-box')
                        .remove();
                });

                //RsCore.msg.warn('正在准备下载文件，请稍等！');
                me.addClass('process');
                $.get('/index.php/index/package', {
                    platform: type
                }, function (json) {
                    json = $.parseJSON(json);
                    me.removeClass('process');
                    if (json && json.r) {
                        var r = json.r;
                        switch (r.code) {
                            case 1: //失败
                                $('.down-box').remove();
                                switch (r.action) {
                                    case 0: //提示
                                        RsCore
                                            .msg
                                            .warn(r.msg);
                                        break;
                                    case 1: //弹窗
                                        if (!RsCore.cache.bootbox) {
                                            RsCore.cache.bootbox = true;
                                            bootbox.alert(r.msg, function () {
                                                RsCore.cache.bootbox = false;
                                            });
                                        }
                                        break;
                                }
                                break;
                            case 0: //成功
                                //window.open(json.data.dist.link);
                                $downBox
                                    .find('.down-box-bod')
                                    .html(json.data.dist.link);
                                $downBox
                                    .find('.down-box-tit h3')
                                    .text('安装包下载地址');
                                op.downloadFile(json.data.dist.name, json.data.dist.link);
                                break;
                            case 401:
                                $('.down-box').remove();
                                if (!RsCore.cache.bootbox) {
                                    RsCore.cache.bootbox = true;
                                    bootbox.alert('登录过期', function () {
                                        RsCore.cache.bootbox = false;
                                        window.location.href = '/index';
                                    });
                                    return false;
                                }
                                break;
                            default:
                                $('.down-box').remove();
                                RsCore
                                    .msg
                                    .warn('错误', r.msg);
                                break;
                        }
                    } else {
                        $('.down-box').remove();
                        //错误处理
                        RsCore
                            .msg
                            .warn('系统异常', '获取数据格式异常');
                    }
                });

            });

            $(window).on('resize.home', function () {
                if (op.resizeTick !== 0 || op.resizeTickObj) {
                    return false;
                }

                if (!op.resizeTickObj) {
                    op.resizeTick = 500;
                    op.resizeTickObj = setInterval(function () {
                        if (op.resizeTick === 0) {
                            clearInterval(op.resizeTickObj);
                            op.resizeTickObj = null;
                            homeResize();
                        } else {
                            op.resizeTick -= 100;
                        }
                    }, 100);
                }
                var as = view.find('.home-msg .opts a span');
                if (view.find('.home-msg').width() < 652) {
                    as.hide();
                } else {
                    as.show();
                }
            }).trigger('resize.home');

            function homeResize() {
                view
                    .find('.home-wrap')
                    .slimScroll({
                        height: view.height(),
                        size: '4px',
                        distance: '5px',
                        alwaysVisible: true
                    });

                var patch_wrap_w = $('.patch_wrap').width(),
                    w1 = ~~((patch_wrap_w) / 3),
                    w2 = w1 * 2 + 1;
                $('.echarts-w1').width(w1);
                $('.echarts-w2').width(w2);

                for (var i = 0; i < op.echartsObj.length; i++) {
                    op
                        .echartsObj[i]
                        .resize();
                }

                //op.resizeSilderNav();

            }

        },
        createEchart: {
            threaten: function () {
                /*威胁终端*/
                var view = $('.rs-page-container');
                var threat_Obj = view.find('#threat')[0];
                var threat_Chart = echarts.init(threat_Obj);
                threat_Chart.showLoading();
                // require(['../test-data/threat'], function(setting) {
                // threat_Chart.hideLoading();     threat_Chart.setOption(setting); });
                op
                    .echartsObj
                    .push(threat_Chart);

                RsCore.ajax('Xavlog/getclientperilstatistics', function (data) {
                    var Hour = '' + new Date().getHours();
                    Hour = Hour.length == 1
                        ? '0' + Hour
                        : Hour;
                    var Minute = '' + new Date().getMinutes();
                    Minute = Minute.length == 1
                        ? '0' + Minute
                        : Minute;

                    var now = Hour + ':' + Minute;
                    var transfData = myEchartSet.initThreat(data);
                    threat_Chart.hideLoading();
                    console.log('threat_Chart', transfData.setting);
                    threat_Chart.setOption(transfData.setting);
                    var info = $('.threat-box').find('.echart_info');
                    var avg = Number(transfData.average);
                    avg = (avg > 0 && avg < 1)
                        ? '小于1'
                        : avg.toFixed(0);
                    var _tpl = '<em>今日' + transfData.total + '台</em><span>' + now + '</span><span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>日平均：' + avg + '台';
                    info.html(_tpl);
                    threat_Chart.on('click', function (params) {
                        var name = params['name'],
                            xavType = params['seriesName'],
                            idx1 = name.indexOf('月'),
                            idx2 = name.indexOf('日'),
                            time;
                        idx1 = idx1 < 0
                            ? 0
                            : (idx1 + 1);
                        time = name.substr(idx1, idx2);
                        var now = new Date(),
                            year = now.getFullYear(),
                            day = now.getDate(),
                            month = now.getMonth() + 1,
                            startTime = '';
                        if (time > day) {
                            if (month == 1) {
                                year--;
                                month = 12;
                            } else {
                                month--;
                            }
                        }
                        startTime = [year, month, time].join('-');
                        if (xavType == '病毒') {
                            window.location.hash = 'virus/log?g=0&vopen=1&l_xavType=xav_virus&l_view=1&topen=1&l_time=special&l_star' +
                                'tTime=' + startTime + '&l_endTime=' + startTime;
                        }
                        if (xavType == '网址') {
                            window.location.hash = 'protection/log?g=0&vopen=1&l_rfwType=rfw_url&l_view=1&topen=1&l_time=special&l_s' +
                                'tartTime=' + startTime + '&l_endTime=' + startTime;
                        }
                        if (xavType == '骚扰') {
                            window.location.hash = 'mobile/log?g=0&vopen=1&l_xavType=mb_msg&l_view=1&topen=1&l_time=special&l_startT' +
                                'ime=' + startTime + '&l_endTime=' + startTime;
                        }
                        if (xavType == '联网') {
                            window.location.hash = 'protection/log?g=0&vopen=1&l_rfwType=rfw_brow&l_view=1&topen=1&l_time=special&l_' +
                                'startTime=' + startTime + '&l_endTime=' + startTime;
                        }

                    });
                });

            },
            os: function () {
                /*操作系统分布*/
                var view = $('.rs-page-container');
                var system_Obj = view.find('#system')[0];
                var system_Chart = echarts.init(system_Obj);
                system_Chart.showLoading();
                // require(['../test-data/system'], function(setting) {
                // system_Chart.hideLoading();     system_Chart.setOption(setting); });
                op
                    .echartsObj
                    .push(system_Chart);

                RsCore.ajax('Sys/getOSStatistics', function (data) {
                    system_Chart.hideLoading();
                    system_Chart.setOption(myEchartSet.initSys(data));
                    system_Chart.on('click', function (params) {
                        window.location.hash = 'sys/overview?g=0&vopen=1&o_stype=sys&o_stxt=' + params['name'].replace('Win', 'Windows ');
                    });
                });

            },
            virCount: function () {
                /*病毒数量*/
                var view = $('.rs-page-container');
                var virus_Obj = view.find('#virus')[0];
                var virus_Chart = echarts.init(virus_Obj);
                virus_Chart.showLoading();
                // require(['../test-data/virus'], function(setting) {
                // virus_Chart.hideLoading();     virus_Chart.setOption(setting); });
                op
                    .echartsObj
                    .push(virus_Chart);
                RsCore.ajax('Xavlog/getXavStatistics', function (data) {
                    console.log(data);
                    var Hour = '' + new Date().getHours();
                    Hour = Hour.length == 1
                        ? '0' + Hour
                        : Hour;
                    var Minute = '' + new Date().getMinutes();
                    Minute = Minute.length == 1
                        ? '0' + Minute
                        : Minute;

                    var now = Hour + ':' + Minute;
                    /*事件*/
                    $(virus_Obj)
                        .closest('.virus-box')
                        .off('click')
                        .on('click', '.echart_opt li', function () {
                            var that = $(this),
                                type = that.attr('data-type'),
                                info = that
                                    .closest('.virus-box')
                                    .find('.echart_info');
                            that
                                .addClass('active')
                                .siblings()
                                .removeClass('active');
                            var transfData = myEchartSet.initVirus(data, type);
                            virus_Chart.hideLoading();
                            console.log('virus', transfData.setting);
                            virus_Chart.setOption(transfData.setting);
                            var _tpl = '<em>今日' + transfData.total + '个</em><span>' + now + '</span><span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>日平均：' + transfData.average + '个';
                            info.html(_tpl);
                        })
                        .find('.echart_opt li:eq(0)')
                        .trigger('click');
                    virus_Chart.on('click', function (params) {
                        var name = params['name'],
                            idx1 = name.indexOf('月'),
                            idx2 = name.indexOf('日'),
                            time;
                        idx1 = idx1 < 0
                            ? 0
                            : (idx1 + 1);
                        time = name.substr(idx1, idx2);
                        var now = new Date(),
                            year = now.getFullYear(),
                            day = now.getDate(),
                            month = now.getMonth() + 1,
                            startTime = '';
                        if (time > day) {
                            if (month == 1) {
                                year--;
                                month = 12;
                            } else {
                                month--;
                            }
                        }
                        startTime = [year, month, time].join('-');

                        window.location.hash = 'virus/log?g=0&vopen=1&l_xavType=xav_virus&l_view=0&topen=1&l_time=special&l_star' +
                            'tTime=' + startTime + '&l_endTime=' + startTime;
                    });
                });
            },
            virKill: function () {
                /*病毒查杀*/
                var view = $('.rs-page-container');
                var virus2_Obj = view.find('#virus2')[0];
                var virus2_Chart = echarts.init(virus2_Obj);
                virus2_Chart.showLoading();
                // require(['../test-data/virus2'], function(setting) {
                // virus2_Chart.hideLoading();     virus2_Chart.setOption(setting); });
                op
                    .echartsObj
                    .push(virus2_Chart);

                RsCore.ajax('Xavlog/getXavStatistics', function (data) {
                    var Hour = '' + new Date().getHours();
                    Hour = Hour.length == 1
                        ? '0' + Hour
                        : Hour;
                    var Minute = '' + new Date().getMinutes();
                    Minute = Minute.length == 1
                        ? '0' + Minute
                        : Minute;

                    var now = Hour + ':' + Minute;
                    /*事件*/
                    $(virus2_Obj)
                        .closest('.virus2-box')
                        .off('click')
                        .on('click', '.echart_opt li', function () {
                            var that = $(this),
                                type = that.attr('data-type'),
                                info = that
                                    .closest('.virus2-box')
                                    .find('.echart_info');
                            that
                                .addClass('active')
                                .siblings()
                                .removeClass('active');
                            var transfData = myEchartSet.initVirus2(data, type);
                            virus2_Chart.hideLoading();
                            virus2_Chart.setOption(transfData.setting);
                            var _tpl = '<em>今日' + transfData.total + '个</em><span>' + now + '</span><span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>日平均：' + transfData.average + '个';
                            info.html(_tpl);
                        })
                        .find('.echart_opt li:eq(0)')
                        .trigger('click');
                    virus2_Chart.on('click', function (params) {
                        var name = params['name'],
                            idx1 = name.indexOf('月'),
                            idx2 = name.indexOf('日'),
                            time;
                        idx1 = idx1 < 0
                            ? 0
                            : (idx1 + 1);
                        time = name.substr(idx1, idx2);
                        var now = new Date(),
                            year = now.getFullYear(),
                            day = now.getDate(),
                            month = now.getMonth() + 1,
                            startTime = '';
                        if (time > day) {
                            if (month == 1) {
                                year--;
                                month = 12;
                            } else {
                                month--;
                            }
                        }
                        startTime = [year, month, time].join('-');

                        window.location.hash = 'virus/log?g=0&vopen=1&l_xavType=xav_virus&l_view=2&topen=1&l_time=special&l_star' +
                            'tTime=' + startTime + '&l_endTime=' + startTime;
                    });
                });
            },
            flow: function () {
                /*当日流量排行*/
                var view = $('.rs-page-container');
                var flow_Obj = view.find('#flow');
                // var flow_Chart = echarts.init(flow_Obj); flow_Chart.showLoading();
                // require(['../test-data/flow'], function(setting) { flow_Chart.hideLoading();
                // flow_Chart.setOption(setting); }); op.echartsObj.push(flow_Chart); var html
                // = '<div id="home-flow">A</div>'; flow_Chart.on('mouseover', function(params)
                // {   console.log(params); }); flow_Chart.on('mouseout', function() {
                // $('#home-flow').remove(); });
                function formatDiskSize(num) {
                    num = Number(num);
                    var sizeType = [
                        'KB',
                        'MB',
                        'GB',
                        'TB',
                        'PB',
                        'EB'
                    ];
                    var idx = 0;
                    num /= 1024;
                    while (num >= 1000) {
                        idx++;
                        num /= 1024;
                    }

                    return num.toFixed(1) + sizeType[idx];
                }

                var html_temp = '<div class="home-flow"><span class="num">{{num}}</span><div class="home-flow-box' +
                    '" style="width:{{w}}%"><div><i class="home-flow-box-left"></i><i class="home-flo' +
                    'w-box-right"></i>{{name}}</div><span class="flow-up" style="width:{{upw}}%"><i>{' +
                    '{up}}</i></span><span class="flow-down"><i>{{down}}</i></span></div></div>';
                var html_arr = [];
                RsCore.ajax('rfwlog/getFlowAudit', function (datas) {
                    var sf = datas.sf;
                    var num = 1;
                    var obj = [];
                    var total = 0;
                    for (var key in sf) {
                        var k = sf[key];
                        var t = Number(k['total']);
                        total = total > t
                            ? total
                            : t;
                        obj.push({
                            num: num,
                            name: key,
                            up: formatDiskSize(k['up']),
                            down: formatDiskSize((k['total'] - k['up'])),
                            upw: (k['up'] / k['total']) * 100,
                            total: k['total']
                        });
                        num++;
                    }
                    for (var i = 0; i < obj.length; i++) {
                        html_arr.push(mustache.render(html_temp, $.extend(obj[i], {
                            w: (obj[i]['total'] / total) * 100
                        })));
                    }
                    var _html = '';
                    if (num == 1) {
                        _html = '<div class="flow-nodata">暂无数据</div>';
                    } else {
                        _html = html_arr
                            .slice(0, 6)
                            .join('');
                    }
                    _html = '<div class="flow-sort-box">' + _html + '</div>';
                    _html += '<div class="flow-fotter"><span class="flow-foter-up">上行流量</span><span class="flo' +
                        'w-foter-down">下行流量</span></div>';
                    flow_Obj.html(_html);
                    view
                        .find('.home-flow:eq(0)')
                        .addClass('active');
                    view
                        .find('.home-flow')
                        .on('mouseover', function () {
                            view
                                .find('.home-flow')
                                .removeClass('active');
                        });
                });

            },
            network: function () {
                /*违规联网*/
                var view = $('.rs-page-container');
                var network_Obj = view.find('#network')[0];
                var network_Chart = echarts.init(network_Obj);
                network_Chart.showLoading();
                RsCore.ajax('rfwlog/getURLAudit', function (data) {
                    var transfData = myEchartSet.initNetwork(data);
                    network_Chart.hideLoading();
                    network_Chart.setOption(transfData);

                    network_Chart.on('click', function (params) {
                        var name = params['name'],
                            Type = params['seriesName'],
                            idx1 = name.indexOf('月'),
                            idx2 = name.indexOf('日'),
                            time;
                        idx1 = idx1 < 0
                            ? 0
                            : (idx1 + 1);
                        time = name.substr(idx1, idx2);
                        var now = new Date(),
                            year = now.getFullYear(),
                            day = now.getDate(),
                            month = now.getMonth() + 1,
                            startTime = '';
                        if (time > day) {
                            if (month == 1) {
                                year--;
                                month = 12;
                            } else {
                                month--;
                            }
                        }
                        startTime = [year, month, time].join('-');

                        if (Type == '禁止网址') {
                            window.location.hash = 'protection/log?g=0&vopen=1&l_rfwType=rfw_brow&l_view=1&topen=1&l_time=special&l_' +
                                'startTime=' + startTime + '&l_endTime=' + startTime;
                        } else if (Type == '程序联网') {
                            window.location.hash = 'protection/log?g=0&vopen=1&l_rfwType=rfw_net&l_view=1&topen=1&l_time=special&l_s' +
                                'tartTime=' + startTime + '&l_endTime=' + startTime;
                        } else if (Type == '共享访问') {
                            window.location.hash = 'protection/log?g=0&vopen=1&l_rfwType=rfw_share&l_view=1&topen=1&l_time=special&l' +
                                '_startTime=' + startTime + '&l_endTime=' + startTime;
                        }

                    });
                });
                // require(['../test-data/network'], function(setting) {
                // network_Chart.hideLoading();     network_Chart.setOption(setting); });
                op
                    .echartsObj
                    .push(network_Chart);
            },
            interception: function () {
                /*骚扰拦截*/
                var view = $('.rs-page-container');
                var interception_Obj = view.find('#interception')[0];
                var interception_Chart = echarts.init(interception_Obj);
                interception_Chart.showLoading();

                RsCore.ajax('phonelog/getPhoneSpam', function (data) {
                    var setting = myEchartSet.initInterception(data);
                    interception_Chart.hideLoading();
                    interception_Chart.setOption(setting);
                });
                // require(['../test-data/interception'], function(setting) {
                // interception_Chart.hideLoading();     interception_Chart.setOption(setting);
                // });
                op
                    .echartsObj
                    .push(interception_Chart);
            },
            location: function () {
                /*终端定位*/
                require(['../test-data/map'], function (fn) {
                    fn.init('map');
                });
            },
            maliciousUrl: function () {
                /*恶意网址拦截*/
                var view = $('.rs-page-container');
                var site_Obj = view.find('#site')[0];
                var site_Chart = echarts.init(site_Obj);
                site_Chart.showLoading();
                RsCore.ajax('rfwlog/getUrlIntercept', function (data) {
                    var setting = myEchartSet.initSite(data);
                    site_Chart.hideLoading();
                    site_Chart.setOption(setting);
                });
                // require(['../test-data/site'], function(setting) { site_Chart.hideLoading();
                // site_Chart.setOption(setting); });
                op
                    .echartsObj
                    .push(site_Chart);
            }
        },
        DownloadEvt: null,
        downloadFile: function (filename, url) {
            var ua = window.navigator.userAgent;
            if (ua.indexOf('MSIE') > 0 || !!ua.match(/Trident.*rv\:11\./)) {
                var frame = document.createElement('iframe');

                if (frame) {
                    frame.setAttribute('style', 'display:none');
                    frame.src = url;
                    document
                        .body
                        .appendChild(frame);
                    // frame.contentWindow.document.execCommand("SaveAs", false, filename);
                    // document.body.removeChild(frame);
                }
            } else {
                var DownloadLink = document.createElement('a');

                if (DownloadLink) {
                    DownloadLink.style.display = 'none';
                    DownloadLink.download = filename;

                    DownloadLink.href = url;

                    document
                        .body
                        .appendChild(DownloadLink);

                    if (document.createEvent) {
                        if (op.DownloadEvt == null) {
                            op.DownloadEvt = document.createEvent('MouseEvents');
                        }

                        op
                            .DownloadEvt
                            .initEvent('click', true, false);
                        DownloadLink.dispatchEvent(op.DownloadEvt);
                    } else if (document.createEventObject)
                        DownloadLink.fireEvent('onclick');
                    else if (typeof DownloadLink.onclick == 'function')
                        DownloadLink.onclick();

                    document
                        .body
                        .removeChild(DownloadLink);
                    op.DownloadEvt = null;
                }
            }
        },
        customModule: function (opt, view) {
            var initStr = '';
            var $customShowBtn = $('.custom-mod');
            var $customModBox = $('.custom-mod-box');
            var $li = $customModBox.find('li');
            var $echLi = $('.echarts-list>li');
            var data = opt;
            var self = this;

            $('.customModeEmpty').empty();
            applyDragData();

            //初始化自定义box
            $li.each(function (index) {
                var $module = $li.eq(index);
                var moduleName = $module.data('module');
                var $width = $module.find('b');
                var $isShow = $module.find('a');
                $width.removeClass('active');
                $isShow.removeClass('focus');

                if (data[moduleName].width == 1) {
                    $width
                        .eq(0)
                        .addClass('active');
                } else {
                    $width
                        .eq(1)
                        .addClass('active');
                }

                if (data[moduleName].isShow != 0) {
                    $isShow.addClass('focus');
                }
            });

            //初始化自定义图表
            $echLi.each(function (index) {
                var $module = $echLi.eq(index);
                var moduleName = $module.data('mod');
                var $width = $module.find('b');
                var wrapWidth = $('.patch_wrap').width();
                var filter = ['threaten', 'virCount'];

                if (filter.indexOf(moduleName) == -1) {
                    if (data[moduleName].width == 1) {
                        $echLi
                            .eq(index)
                            .removeClass('echarts-w2')
                            .addClass('echarts-w1');
                        $echLi
                            .eq(index)
                            .removeAttr('style');
                        $width
                            .eq(0)
                            .addClass('active');
                    } else {
                        $echLi
                            .eq(index)
                            .removeAttr('style');
                        $echLi
                            .eq(index)
                            .removeClass('echarts-w1')
                            .addClass('echarts-w2');
                        $width
                            .eq(1)
                            .addClass('active');
                    }
                }

                if (data[moduleName].isShow == 1) {
                    $module.removeClass('hide');
                    self.createEchart[moduleName]();
                } else {
                    $module.addClass('hide');
                }

                //先隐去病毒查杀
                if (moduleName == 'virKill') {
                    $module.addClass('hide');
                }
                initStr = $customModBox.html();
            });

            //设置图表可拖拽
            $('.echarts-list').dragsort({ dragSelector: '.echarts-list h3', itemSelector: '.echarts-list > li', dragBetween: true, dragEnd: saveOrder, placeHolderTemplate: '<li class="placeDrag"></li>' });

            view
                .off('click', '.custom-mod')
                .on('click', '.custom-mod', function (e) {
                    $(this).addClass('click');
                    $customModBox.fadeIn(500);
                    view.on('click', '.custom-mod-box', function (e) {
                        var target = e.target;
                        var tagName = target
                            .tagName
                            .toLowerCase();
                        var targetClass = target.className;
                        var closeBtn = ['close', 'default', 'apply'];
                        var locationModule = $(target)
                            .parents('li')
                            .data('module');
                        var filter = ['threaten', 'virCount', 'virKill'];

                        if (typeof locationModule != 'undefined') {
                            data[locationModule].moduleName = locationModule;
                            if (tagName == 'b') {
                                if (filter.indexOf(locationModule) == -1) {
                                    $(target)
                                        .siblings()
                                        .removeClass('active');
                                    $(target).addClass('active');
                                    data[locationModule].width = $(target).data('width');
                                }
                            } else if (tagName == 'i') {
                                if (targetClass == 'left') {
                                    $(target)
                                        .parent()
                                        .removeClass('focus');
                                } else {
                                    $(target)
                                        .parent()
                                        .addClass('focus');
                                }
                                data[locationModule].isShow = $(target).data('show');
                            }
                        }

                        if (closeBtn.indexOf(targetClass) != -1) {
                            closeModuleBox(targetClass, data);
                        }
                    });
                });

            //保存拖拽后的顺序
            function saveOrder() {
                var $li = $('.echarts-list>li');
                data.order = [];
                $li.each(function (index) {
                    data
                        .order
                        .push($li.eq(index).data('mod'));
                });
                $.cookie('customModule', JSON.stringify(data));
            }

            //应该拖拽后数据
            function applyDragData() {
                var arr = data.order;
                var len = arr.length;
                var i = 0;
                for (; i < len; i++) {
                    $('.echarts-list').append($('.echarts-list>li[data-mod="' + arr[i] + '"]'));
                }
            }

            //关闭自定义模块框
            function closeModuleBox(type, data) {
                switch (type) {
                    case 'close':
                        $customShowBtn.removeClass('click');
                        $customModBox.hide();
                        $customModBox.html(initStr);
                        break;
                    case 'default':
                        defaultSetting(opt);
                        break;
                    case 'apply':
                        applySetting(data);
                        break;
                }
            }

            //应用自定义模块设置
            function applySetting(opt) {
                $.cookie('customModule', JSON.stringify(opt));
                RsCore.ajax('/user/setusersetting', {
                    setStr: JSON.stringify(opt)
                }, function (data, code, msg) { });
                $customModBox.hide();
                self.customModule(opt, view);
                $customShowBtn.removeClass('click');
            }

            //恢复默认值
            function defaultSetting() {
                $customShowBtn.removeClass('click');
                $customModBox.hide();
                RsCore.ajax('/user/setusersetting', {
                    setStr: JSON.stringify(defaultSettingData)
                }, function (data, code, msg) { });
                $.cookie('customModule', JSON.stringify(defaultSettingData));
                self.customModule($.parseJSON($.cookie('customModule')), view);
            }
        },
        messageCenter: function (view) {
            var getYmdTime = function (time) {
                if (time > 0) {
                    var dateStr = new Date(time);
                    var y = dateStr.getFullYear() - 1;
                    var m = (Number(dateStr.getMonth()) + 1);
                    var d = dateStr.getDate();
                    var h = dateStr.getHours();
                    var min = dateStr.getMinutes();
                    var s = dateStr.getSeconds();
                    m = m < 9
                        ? '0' + m
                        : m;
                    d = d < 9
                        ? '0' + d
                        : d;
                    h = h < 9
                        ? '0' + h
                        : h;
                    min = min < 9
                        ? '0' + min
                        : min;
                    s = s < 9
                        ? '0' + s
                        : s;
                    return y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + s;
                } else {
                    return '末知时间';
                }
            };

            renderHTML();

            //渲染消息
            function renderHTML(keyword) {
                var userInfo = $.parseJSON($('.userInfo').text());
                var lastid = '';
                var msgObj = {};
                var resTransform = [];
                var result = null;
                var data = {
                    subscriber: userInfo.EID + '+' + userInfo.UserID,
                    lastid: lastid,
                    count: 10
                };
                var allTpl = '';
                var sysTpl = '';
                var secTpl = '';
                var logTpl = '';
                var facTpl = '';
                var html = '';
                var syshtml = null;
                var sechtml = null;
                var loghtml = null;
                var fachtml = null;
                var sysType = [];
                var secType = [];
                var logType = [];
                var facType = [];
                var isClick = false;
                var tdid = '';

                if (typeof keyword != 'undefined') {
                    data.search = keyword;
                }

                RsCore
                    .ajax('message/getmsg', data, function (data) {
                        var html = '';
                        var type = ['rs', 'pf', 'am', 'rp', 'b'];
                        if (typeof keyword != 'undefined') {
                            if (!data.messages.length) {
                                html = '<div class="home-msg-nomatch"><p>抱歉，关键词“<span>' + keyword + '</span>”未搜到内容，请尝试其他关键字~ </p><a href="/Manage/index#settings/message?g=0">查看更多</a' +
                                    '></div>';
                                $('.home-msg>.home-bod>div').html(html);
                                return;
                            }
                        } else {
                            if (!data.messages.length) {
                                html = '<div class="home-msg-nomatch"><p>暂无内容~ </p><a href="/Manage/index#settings/messa' +
                                    'ge?g=0">查看更多</a></div>';
                                $('.home-msg>.home-bod>div').html(html);
                                return;
                            }
                        }

                        for (var i in data.messages) {
                            if (data.messages.hasOwnProperty(i)) {
                                resTransform.push(data.messages[i]);
                                msgObj[data.messages[i]._id.$id] = data.messages[i];
                            }
                        }

                        // resTransform.reverse(); 假数据
                        for (var j = 0; j < resTransform.length; j++) {
                            var rtype = resTransform[j]
                                .types[0]
                                .split(':')[0];
                            if (rtype == 'pf' || rtype == 'auth' || rtype == 'user' || rtype == 'ep' || rtype == 'new' || rtype == 'uninst') {
                                resTransform[j].types[0] = 'ico-sys-min';
                                resTransform[j].type = '系统类';
                                if (resTransform[j].isread) {
                                    resTransform[j].isread = false;
                                } else {
                                    resTransform[j].isread = true;
                                }
                            } else if (rtype == 'am' || rtype == 'threat' || rtype == 'virus' || rtype == 'fw' || rtype == 'om') {
                                resTransform[j].types[0] = 'ico-safe-min';
                                resTransform[j].type = '安全类';
                                if (resTransform[j].isread) {
                                    resTransform[j].isread = false;
                                } else {
                                    resTransform[j].isread = true;
                                }
                            } else if (rtype == 'rp') {
                                resTransform[j].types[0] = 'ico-log-min';
                                resTransform[j].type = '日志类';
                                if (resTransform[j].isread) {
                                    resTransform[j].isread = false;
                                } else {
                                    resTransform[j].isread = true;
                                }
                            } else if (rtype == 'rs') {
                                resTransform[j].types[0] = 'ico-firm-min';
                                resTransform[j].type = '厂商类';
                                if (resTransform[j].isread) {
                                    resTransform[j].isread = false;
                                } else {
                                    resTransform[j].isread = true;
                                }
                            } else {
                                resTransform[j].types[0] = 'ico-sys-min';
                                resTransform[j].type = '系统类';
                                if (resTransform[j].isread) {
                                    resTransform[j].isread = false;
                                } else {
                                    resTransform[j].isread = true;
                                }
                            }
                        }

                        for (var j = 0; j < resTransform.length; j++) {
                            resTransform[j].outtime = getYmdTime(resTransform[j].outtime * 1000);
                        }

                        for (var k = 0; k < resTransform.length; k++) {
                            if (resTransform[k].types[0] == 'ico-sys-min') {
                                sysType.push(resTransform[k]);
                            } else if (resTransform[k].types[0] == 'ico-safe-min') {
                                secType.push(resTransform[k]);
                            } else if (resTransform[k].types[0] == 'ico-log-min') {
                                logType.push(resTransform[k]);
                            } else if (resTransform[k].types[0] == 'ico-firm-min') {
                                facType.push(resTransform[k]);
                            }
                        }

                        if (sysType.length != 0) {
                            sysTpl = '<ul class="msg-list">{{#item}}<li><i class="{{types}}">&nbsp;</i><div class="msg' +
                                '-list-txt"><div><a data-id="{{_id.$id}}"  data-did="{{did.$id}}">{{msgtitle}}{{#' +
                                'isread}}<i class="new">新</i>{{/isread}}</a></div><span>{{outtime}}</span><i clas' +
                                's="msgdel" data-id="{{did.$id}}"></i></div></li>{{/item}}</ul><a href="/Manage/i' +
                                'ndex#settings/message?g=00">查看更多</a>';
                        } else {
                            sysTpl = '<div class="home-msg-nomatch"><p>暂无内容~ </p><a href="/Manage/index#settings/messa' +
                                'ge?g=0">查看更多</a></div>';
                        }
                        if (secType.length != 0) {
                            secTpl = '<ul class="msg-list">{{#item}}<li><i class="{{types}}">&nbsp;</i><div class="msg' +
                                '-list-txt"><div><a data-id="{{_id.$id}}"  data-did="{{did.$id}}">{{msgtitle}}{{#' +
                                'isread}}<i class="new">新</i>{{/isread}}</a></div><span>{{outtime}}</span><i clas' +
                                's="msgdel" data-id="{{did.$id}}"></i></div></li>{{/item}}</ul><a href="/Manage/i' +
                                'ndex#settings/message?g=00">查看更多</a>';
                        } else {
                            secTpl = '<div class="home-msg-nomatch"><p>暂无内容~ </p><a href="/Manage/index#settings/messa' +
                                'ge?g=0">查看更多</a></div>';
                        }
                        if (logType.length != 0) {
                            logTpl = '<ul class="msg-list">{{#item}}<li><i class="{{types}}">&nbsp;</i><div class="msg' +
                                '-list-txt"><div><a data-id="{{_id.$id}}"  data-did="{{did.$id}}">{{msgtitle}}{{#' +
                                'isread}}<i class="new">新</i>{{/isread}}</a></div><span>{{outtime}}</span><i clas' +
                                's="msgdel" data-id="{{did.$id}}"></i></div></li>{{/item}}</ul><a href="/Manage/i' +
                                'ndex#settings/message?g=00">查看更多</a>';
                        } else {
                            logTpl = '<div class="home-msg-nomatch"><p>暂无内容~ </p><a href="/Manage/index#settings/messa' +
                                'ge?g=0">查看更多</a></div>';
                        }
                        if (facType.length != 0) {
                            facTpl = '<ul class="msg-list">{{#item}}<li><i class="{{types}}">&nbsp;</i><div class="msg' +
                                '-list-txt"><div><a data-id="{{_id.$id}}"  data-did="{{did.$id}}">{{msgtitle}}{{#' +
                                'isread}}<i class="new">新</i>{{/isread}}</a></div><span>{{outtime}}</span><i clas' +
                                's="msgdel" data-id="{{did.$id}}"></i></div></li>{{/item}}</ul><a href="/Manage/i' +
                                'ndex#settings/message?g=00">查看更多</a>';
                        } else {
                            facTpl = '<div class="home-msg-nomatch"><p>暂无内容~ </p><a href="/Manage/index#settings/messa' +
                                'ge?g=0">查看更多</a></div>';
                        }

                        if (resTransform.length != 0) {
                            allTpl = '<ul class="msg-list">{{#item}}<li><i class="{{types}}">&nbsp;</i><div class="msg' +
                                '-list-txt"><div><a data-id="{{_id.$id}}"  data-did="{{did.$id}}">{{msgtitle}}{{#' +
                                'isread}}<i class="new">新</i>{{/isread}}</a></div><span>{{outtime}}</span><i clas' +
                                's="msgdel" data-id="{{did.$id}}"></i></div></li>{{/item}}</ul><a href="/Manage/i' +
                                'ndex#settings/message?g=0">查看更多</a>';
                        } else {
                            allTpl = '<div class="home-msg-nomatch"><p>暂无内容~ </p><a href="/Manage/index#settings/messa' +
                                'ge?g=0">查看更多</a></div>';
                        }

                        html = mustache.render(allTpl, { item: resTransform });

                        syshtml = mustache.render(sysTpl, { item: sysType });

                        sechtml = mustache.render(secTpl, { item: secType });

                        loghtml = mustache.render(logTpl, { item: logType });

                        fachtml = mustache.render(facTpl, { item: facType });

                        $('#home-msg-all').html(html);
                        $('#home-msg-sys').html(syshtml);
                        $('#home-msg-safe').html(sechtml);
                        $('#home-msg-log').html(loghtml);
                        $('#home-msg-firm').html(fachtml);
                    });

                //读取消息
                function readMessage(url, ele, id) {
                    $(ele).removeClass('hide');
                    $(ele)
                        .find('h1')
                        .text(msgObj[id].msgtitle);
                    $(ele)
                        .find('.type')
                        .text(msgObj[id].type);
                    $(ele)
                        .find('.time')
                        .text(msgObj[id].outtime);
                    $(ele)
                        .find('.content')
                        .html(msgObj[id].msgcontext);
                    $(ele)
                        .find('.close')
                        .on('click', function () {
                            $(ele).addClass('hide');
                        });
                    RsCore.ajax('message/readmsg', {
                        did: tdid
                    }, function (data, code, msg) { });
                }

                //删除消息
                view
                    .off('click', '.msgdel')
                    .on('click', '.msgdel', function () {
                        var self = this;
                        var did = $(this).data('id');
                        bootbox.confirm('删除此消息', function (ok) {
                            if (ok) {
                                RsCore
                                    .ajax('message/delmsg', {
                                        did: did
                                    }, function (data, code, msg) {
                                        if (code == 0) {
                                            RsCore
                                                .msg
                                                .success('删除成功');
                                            $(self)
                                                .parents('li')
                                                .remove();
                                            var ul = $(self).closest('ul');
                                            if (!ul.find('li').length) {
                                                ul
                                                    .parent()
                                                    .html('<div class="home-msg-nomatch"><p>暂无内容~ </p><a href="/Manage/index#settings/messa' +
                                                    'ge?g=0">查看更多</a></div>');
                                            }
                                        }
                                    });
                            }
                        });
                    });

                //分享
                view.on('click', '.msgshare', function () {
                    isClick = !isClick;
                    if (isClick) {
                        $(this)
                            .find('div')
                            .show();
                    } else {
                        $(this)
                            .find('div')
                            .hide();
                    }
                });

                //点击消息
                view.on('click', '.msg-list-txt>div>a', function () {
                    var id = $(this).data('id');
                    tdid = $(this).data('did');
                    readMessage('', '.messageBox', id);
                    $(this)
                        .find('.new')
                        .remove();
                });
            }

            //搜索事件
            view
                .on('click', '.search-btn', function () {
                    var val = $.trim($(this).prev().val());
                    if (val == '') {
                        RsCore
                            .msg
                            .warn('搜索内容不能为空');
                        return;
                    }
                    renderHTML(val);
                });

            view.on('click', '.home-msg .opts a', function () {
                var that = $(this);
                var tag = that.attr('da-toggle');
                renderHTML();
                that
                    .parent()
                    .addClass('active')
                    .siblings()
                    .removeClass('active');
                that
                    .closest('.home-msg')
                    .find(tag)
                    .show()
                    .siblings()
                    .hide();
            });

            view.on('click', '.js_updateVersion', function () {
                var data = {
                    objids: ['0'],
                    grouptype: 0,
                    cmdid: 'update',
                    objects: {
                        group: [
                            {
                                guid: 0,
                                name: '全网升级'
                            }
                        ]
                    }
                };
                RsCore
                    .ajax('Cmd/editCmd', data, function (r) {
                        RsCore.msg.warn('消息发送成功');
                    }, function () {
                        that.removeClass('process');
                    });
            });
        }

    };
    return {
        container: '.rs-page-container',
        render: function (container) {
            document.title = '安全中心';
            this.container = container;
            var view = $(container);

            var html = mustache.render(tpl, { 'static_path': static_path });
            view.append(html);
            RsCore
                .load
                .hide();
            //op.init(view);

            op.initEchart(container);
            op.initEvent(container);
            op.messageCenter(view);
            view
                .find('.home-wrap')
                .slimScroll({
                    height: view.outerHeight(),
                    size: '4px',
                    distance: '5px',
                    alwaysVisible: true
                });

            view
                .find('[downtype="windows"]')
                .tooltip({
                    html: true,
                    title: '<span style="white-space:nowrap;">Windows版下载</span>',
                    placement: 'top',
                    delay: {
                        show: 0,
                        hide: 0
                    }
                });
            view
                .find('[downtype="linux"]')
                .tooltip({
                    html: true,
                    title: '<span style="white-space:nowrap;">Linux版尚未支持，敬请期待</span>',
                    placement: 'top',
                    delay: {
                        show: 0,
                        hide: 0
                    }
                });
            view
                .find('[downtype="android"]')
                .tooltip({
                    html: true,
                    title: '<span style="white-space:nowrap;">Android版下载</span>',
                    placement: 'top',
                    delay: {
                        show: 0,
                        hide: 0
                    }
                });
            view
                .find('.down-rwm')
                .tooltip({
                    html: true,
                    title: '<span style="white-space:nowrap;">扫描二维码下载</span>',
                    placement: 'top',
                    delay: {
                        show: 0,
                        hide: 0
                    }
                });



        },
        destroy: function () {
            $(window).off('resize.home');
            $.each(op.echartsObj, function (idx, obj) {
                obj.clear();
            });
            op.echartsObj = [];
            $(this.container)
                .off()
                .empty();
            RsCore
                .load
                .show();
        }
    };
});