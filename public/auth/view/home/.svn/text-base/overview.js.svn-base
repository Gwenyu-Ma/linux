define(function (require) {
    var tpl = require('text!home/overview.html');
    var mustache = require('mustache');
    var echarts = require('echarts3');
    var myEchartSet = require('./myEchartSet');
    require('slimscroll');
    var common = require('common');
    var getUrlSearchQuerys = RsCore.assist.getUrlSearchQuerys;
    var escapeHtml = RsCore.assist.escapeHtml;
    var params2str = RsCore.assist.params2str;
    var str2json = RsCore.assist.str2json;
    var op = {
        echartObj: [],
        init: function (container, paramStr) {
            common.correctNavTab();
            var view = $(container);
            var html = mustache.render(tpl, {});
            view.html(tpl);

            //今日授权,未授权点击页面跳转
            $('.today_num').click(function () {
                location.href = '/index/home#home/term?topen=1&l_act=1';
            })
            $('.unauth_num').click(function () {
                location.href = '/index/home#home/term?topen=1&l_act=2';
            })

            //显示浮层
            $('.pop_img').find('.detail_img').mouseenter(function () {
                $(this).next('.pop_info').css('display', 'block');
            })
            $('.pop_img').find('.detail_img').mouseleave(function () {
                $(this).next('.pop_info').css('display', 'none');
            })

            op.resizeContent();
            op.initEvent(view);


            //授权是否过期 今日授权：未授权：历史授权总数：
            RsCore.ajax({
                url: 'Authhome/index',
                type: 'get',
                dataType: "json",
                success: function (data) {
                    //console.log(result.data);
                    var totalAccredit = $('.font_info').find('span');
                    var num = $('.content_3').find('li').eq(0).find('span');
                    var notNum = $('.content_3').find('li').eq(1).find('span');
                    var historyTotal = $('.content_3').find('li').eq(2).find('span');
                    var onOff = data.isOverdue;

                    totalAccredit.text(Number(data.windowsTotalNum) + Number(data.linuxTotalNum));
                    num.text(Number(data.linuxNum) + Number(data.windowsNum));
                    notNum.text(Number(data.linuxNotNum) + Number(data.windowsNotNum));
                    historyTotal.text(data.historyTotal || 0);

                    op.initChar(data);

                    if (onOff == 0) {
                        $('.content_1').css('display', 'block');
                        $('.content_1_soon').css('display', 'none');
                        $('.content_1_overdue').css('display', 'none');
                    }
                    if (onOff == 1) {
                        $('.content_1').css('display', 'none');
                        $('.content_1_soon').css('display', 'block');
                        $('.content_1_overdue').css('display', 'none');
                    }
                    if (onOff == 2) {
                        $('.content_1').css('display', 'none');
                        $('.content_1_soon').css('display', 'none');
                        $('.content_1_overdue').css('display', 'block');
                    }

                    if (Number(data.linuxNotNum) + Number(data.windowsNotNum) != 0) {
                        $('.expan_toggle').css('display', 'inline-block');
                    }
                    if (Number(data.linuxNotNum) + Number(data.windowsNotNum) == 0) {
                        $('.expan_toggle').css('display', 'none');
                    }

                    if (Number(data.windowsTotalNum) == 0 && Number(data.linuxTotalNum) != 0) {
                        $('.echart_box1').css('display', 'none');
                        $('.echart_box2').css('position', 'absolute');
                        $('.echart_box2').css('left', '20%');
                    }
                    if (Number(data.linuxTotalNum) == 0 && Number(data.windowsTotalNum) != 0) {
                        $('.echart_box2').css('display', 'none');
                        $('.echart_box1').css('position', 'absolute');
                        $('.echart_box1').css('left', '20%');
                    }
                    if (Number(data.windowsTotalNum) == 0 && Number(data.linuxTotalNum) == 0) {
                        $('.echart_box2').css('display', 'none');
                        $('.echart_box1').css('position', 'absolute');
                        $('.echart_box1').css('left', '20%');
                    }
                }
            });


        },
        resizeContent: function () {
            var H = $('.c-page-container').height();
            if ($('.rs-page-nav').length) {
                $('.c-page-content > .slimScrollDiv >  .home_info,.c-page-content > .home_info').slimscroll({
                    height: H,
                    size: '4px',
                    alwaysVisible: true
                });
            }

            for (var i = 0; i < op.echartObj.length; i++) {
                op.echartObj[i].resize();
            }
        },
        initEvent: function (view) {

            $(window).on('resize.home', function () {
                op.resizeContent();
            })
        },
        initChar: function (data) {
            op.initCharWindow(data);
            op.initCharLinux(data);
            op.initCharHistory();
            op.initHisTerm();
        },
        initCharHistory: function (data) {
            var chartObj = $('.echart_box3')[0];
            var chart = echarts.init(chartObj);
            op.echartObj.push(chart);
            chart.showLoading();
            /* 测试用 start*/

            /* 测试用 end*/
            RsCore.ajax({
                url: 'Authhome/historySevenDay',
                success: function (data) {
                    console.log(data);
                    chart.hideLoading();
                    if (data) {
                        var opts = myEchartSet.initHisSevenDay(data);
                        chart.setOption(opts);
                    } else {
                        chart.setOption({
                            graphic: {
                                elements: [{
                                    type: 'text',
                                    left: 'center',
                                    top: '10%',
                                    style: {
                                        text: '当前没有数据',
                                        stroke: '#ddd',
                                        font: '16px "微软雅黑"'
                                    }
                                }]
                            }
                        });
                    }

                }
            })

        },
        initCharWindow: function (data) {
            var chartObj = $('.echart_box1_wrap')[0];
            var chart = echarts.init(chartObj);
            op.echartObj.push(chart);
            chart.showLoading();
            /* 测试用 start*/
            var opts = myEchartSet.initTDWindow(data);
            chart.hideLoading();
            chart.setOption(opts);
            /* 测试用 end*/

            $('.echart_box1').find('em').text(Number(data['windowsTotalNum']));

        },
        initCharLinux: function (data) {
            var chartObj = $('.echart_box2_wrap')[0];
            var chart = echarts.init(chartObj);
            op.echartObj.push(chart);
            chart.showLoading();
            /* 测试用 start*/
            var opts = myEchartSet.initTDLinux(data);
            console.log('opts', opts);
            chart.hideLoading();
            chart.setOption(opts);
            /* 测试用 end*/

            $('.echart_box2').find('em').text(Number(data['linuxTotalNum']));
        },
        initHisTerm: function () {
            var html = [];
            html.push('<tr>');
            html.push('	<td><i class="{{osTypeClass}}"></i>{{computerName}}</td>');
            html.push('<td>{{IP}}</td>');
            html.push('<td>{{mac}}</td>');
            html.push('<td>{{time}}</td>');
            html.push('</tr>');
            RsCore.ajax({
                url: 'Authhome/newAccredit',
                success: function (data) {
                    var da = data.rows;
                    var _html = [];
                    if (da.length == 0) {
                        return false;
                    }
                    for (var i = 0; i < da.length; i++) {
                        var _da = da[i];
                        _da['osTypeClass'] = _da['sysType'] == '1' ? 'table_windows' : 'table_android';
                        _da['time'] = _da['linkTime'].split(' ')[1];
                        _html.push(mustache.render(html.join(''), _da))
                    }

                    $('.view_table tbody').html(_html.join(''));
                }
            })
        }

    };
    return {
        container: '.c-page-content',
        render: function (container, paramStr) {
            op.init(container, paramStr);
        },
        destroy: function () {
            $(this.container).off().empty();
        }
    };
});