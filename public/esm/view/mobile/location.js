define(function (require) {
    var tpl = require('text!mobile/location.html');
    var mapTool = require('mapTool');
    var mustache = require('mustache');
    require('datetimepicker');
    require('css!datetimepicker');
    require('selectric');
    require('css!selectric');
    var getUrlSearchQuerys = RsCore.assist.getUrlSearchQuerys;
    var params2str = RsCore.assist.params2str;
    var op = {
        map: null,
        data: null,
        areaList: null,
        hsList: null,
        culmks: null,
        hspath: [],
        query: {
            viewtype: 'local',
            objtype: '',
            objid: '',
            queryconditions: {
                begintime: '',
                endtime: '',
                searchkey: '',
                searchtype: ''
            },
            paging: {
                sort: '',
                order: 1,
                offset: 0,
                limit: 0
            }
        },
        tempParams: null,
        init: function (container) {
            var view = $(container);
            var html = mustache.render(tpl, {
                'local_pos': true,
                'local_hs': false
            });
            view.append(html);
            this.map = mapTool.initMap('map', this);
            var params = getUrlSearchQuerys();
            op.query['objtype'] = params['c']
                ? '2'
                : params['g'] && params['g'] == '0'
                    ? '0'
                    : params['g'] && params['g'] == '-1'
                        ? '-1'
                        : '1';
            op.query['objid'] = params['c']
                ? params['c']
                : params['g'] && params['g'] !== '0'
                    ? params['g']
                    : RsCore.cache.group.eid;
            op.tempParams = $.extend(true, {}, op.query);
            op.ajax(function (data, code, msg) {
                var da = (data && data.rows)
                    ? data.rows
                    : [];
                op.handleDate(view, da);
                op.initMap(view, op.map);
                op.bindEvent(view);
            });
        },
        initMap: function (view, map) {
            this.viewControl(map, op.data);
        },
        bindEvent: function (view) {

            // 下拉列表美化
            view
                .find('select')
                .selectric({ inheritOriginalWidth: true });

            $('#timeStart').datetimepicker({
                format: 'Y-m-d',
                onShow: function (ct) {
                    this.setOptions({
                        maxDate: $('#timeEnd').val()
                            ? $('#timeEnd')
                                .val()
                                .replace(/[-]/g, '/')
                            : false
                    });
                },
                timepicker: false,
                closeOnDateSelect: true
            });

            $('#timeEnd').datetimepicker({
                format: 'Y-m-d',
                onShow: function (ct) {
                    this.setOptions({
                        minDate: $('#timeStart').val()
                            ? $('#timeStart')
                                .val()
                                .replace(/[-]/g, '/')
                            : false
                    });
                },
                timepicker: false,
                closeOnDateSelect: true
            });
            var self = this;
            view.on('click', '#custom-toolbar a ', function () {
                $(this)
                    .parent()
                    .addClass('active')
                    .siblings()
                    .removeClass('active');
                var flag = $(this).attr('da-toggle');
                if (flag == 'local_pos') {
                    self.initMap(view, self.map);
                }
                if (flag == 'local_hs') {
                    self.initMapHs(view, self.map);
                }
            });

            view.on('click', '.map_search_btn', function () {
                var $dom = view.find('.map_search_box');
                if ($dom.css('display') == 'none') {
                    $dom.show();
                } else {
                    $dom.hide();
                }
            });

            view.on('click', '.map_search_box a', function () {
                var that = $(this);
                that
                    .closest('.controls')
                    .find('a')
                    .removeClass('active');
                that.addClass('active');

                if (that.parent().hasClass('date')) {
                    var now = new Date(),
                        day = [
                            now.getFullYear(),
                            now.getMonth(),
                            now.getDate()
                        ].join('-');
                    that
                        .parent()
                        .find('input')
                        .removeProp('disabled'); //.val(day);
                } else {
                    that
                        .parent()
                        .find('.date input')
                        .prop('disabled', true);
                }
                op.tick2Data(view);
            });

            view.on('click', '.js_btn_search', function () {
                op.tick2Data(view);
            });
            view.on('change', '#timeStart,#timeEnd', function () {
                op.tick2Data(view);
            });

        },
        tick2Data: function (view) {
            op['get_params'](op.tempParams, view.find('.map_search_box'));
            op.ajax(function (data, code, msg) {
                var flag = view
                    .find('#custom-toolbar .nav .active a')
                    .attr('da-toggle');
                var da = (data && data.rows)
                    ? data.rows
                    : [];
                if (flag == 'local_pos') {
                    op.handleDate(view, da);
                    op.initMap(view, op.map);
                }
                if (flag == 'local_hs') {
                    op.handleDate(view, da);
                    op.initMapHs(view, op.map);
                }
            });
        },
        initlist: function (map, datas) {
            var list_data = datas;
            var num_online = 0;
            var temp_html = [];
            var list_html = [];
            for (var i = 0; i < list_data.length; i++) {
                var _list = list_data[i];
                var num = i + 1;
                var clasN = '';
                if (_list.online == 1) {
                    clasN = 'online';
                    num_online++;
                } else {
                    clasN = 'offline';
                }
                list_html.push('<li class="' + clasN + '"><span>' + num + '</span><div>' + _list['name'] + '</div><p title="' + (_list['localStr'] || '') + '">当前位置：' + _list['localStr'] || '...</p></li>');
            }
            temp_html.push('<div class="BM_box">');
            temp_html.push('<div class="BM_header">');
            temp_html.push('<i class="BM_backView"></i><i class="BM_toggle"></i>');
            temp_html.push('<h3>当前区域内在线<em class="red">' + num_online + '</em>人，离线<em class="gray">' + (list_data.length - num_online) + '</em>人</h3></div>');
            temp_html.push('<div class="BM_list_box"><ul class="BM_list">');
            temp_html.push(list_html.join(''));
            temp_html.push('</ul></div></div>');
            var opt = {
                html: temp_html.join('')
            };
            return mapTool.initList(map, opt);
        },
        scaleControl: function (map) {
            var temp_html = [];
            temp_html.push('<ul>');
            temp_html.push('<li class="BM_zoomIn"></li>');
            temp_html.push('<li class="BM_zoomOut"></li>');
            temp_html.push('</ul>');
            var opt = {
                html: temp_html.join('')
            };
            mapTool.initMapScale(map, opt);
        },
        initMapType: function (map) {
            var temp_html = [];
            temp_html.push('<ul>');
            temp_html.push('<li class="BM_mapType_1 active" map-type="normal"></li>');
            temp_html.push('<li class="BM_mapType_2" map-type="hybrid"></li>');
            temp_html.push('</ul>');
            var opt = {
                html: temp_html.join('')
            };
            mapTool.initMapType(map, opt);
        },
        initMapPos: function (map, datas, listObj) {
            this.culmks = mapTool.initMapPos(map, datas, listObj);
        },
        viewControl: function (map, datas) {
            op.clearHs(map);
            op.clearRead(map);
            this.areaList = this.initlist(map, datas);
            this.scaleControl(map);
            this.initMapType(map);
            this.initMapPos(map, datas, this.areaList);
        },
        initMapHs: function (view, map, num) {
            num = num || 0;
            op.clearRead(map);
            op.clearHs(map);
            this.initHs(map, num);
        },
        initHs: function (map, num) {
            this.hsList = this.initHslist(map, op.data);
            $(this.hsList.container)
                .find('.BM_list li:eq(' + num + ')')
                .trigger('click');
        },
        initHslist: function (map, datas) {
            var list_data = datas;
            var temp_html = [];
            var list_html = [];
            var paths = [];
            var num_online = 0;
            for (var i = 0; i < list_data.length; i++) {
                var _list = list_data[i];
                var num = i + 1;
                var clasN = '';
                if (_list.online == 1) {
                    clasN = 'online';
                    num_online++;
                } else {
                    clasN = 'offline';
                }
                var pathNum = _list.path.length;
                list_html.push('<li class="' + clasN + '"><i>足迹' + pathNum + '</i><span>' + num + '</span><div>' + _list['name'] + '</div><p>' + _list.ip + '</p></li>');
                paths.push(_list['path']);
            }

            temp_html.push('<div class="BM_box">');
            temp_html.push('<div class="BM_header">');
            temp_html.push('<i class="BM_backView"></i><i class="BM_toggle"></i>');
            temp_html.push('<h3>发现<em class="blue">' + list_data.length + '</em>人定位轨迹,<em class="red">' + num_online + '</em>人在线,<em class="gray">' + (list_data.length - num_online) + '</em>人离线</h3></div>');
            temp_html.push('<div class="BM_list_box" style="max-height:300px;">');
            temp_html.push('<div class="BM_list_tip">为足迹终点</div>');
            temp_html.push('<ul class="BM_list">');
            temp_html.push(list_html.join(''));
            temp_html.push('</ul></div></div>');
            var opt = {
                html: temp_html.join(''),
                path: paths
            };
            return mapTool.initHsList(map, opt);
        },
        clearRead: function (map) {
            if (this.areaList) {
                this
                    .areaList
                    .destroy();
            }
            var overlays = map.getOverlays();
            for (var i in overlays) {
                map.removeOverlay(overlays[i]);
            }
            map.clearOverlays();
            this.culmks && this
                .culmks
                .destroy();
            this.culmks = null;
        },
        clearHs: function (map) {
            if (this.hsList) {
                this
                    .hsList
                    .destroy();
            }
            map.clearOverlays();
        },
        ajax: function (callback) {
            $.ajax({
                url: RsCore.ajaxPath + '/phonelog/getPhonelocal',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                async: false,
                data: JSON.stringify(op.tempParams),
                timeout: 30000,
                success: function (json) {
                    if (json && json.r) {
                        var r = json.r;
                        switch (r.code) {
                            case 1: //失败
                                switch (r.action) {
                                    case 0: //提示
                                        RsCore
                                            .msg
                                            .warn('系统异常', r.msg);
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
                                if (r.action == 401) {
                                    bootbox
                                        .alert('登录过期', function () {
                                            RsCore.cache.bootbox = false;
                                            window.location.href = '/';
                                        });
                                }
                                callback && callback(json.data);
                                break;
                            case 401:
                                if (!RsCore.cache.bootbox) {
                                    RsCore.cache.bootbox = true;
                                    bootbox.alert('登录过期', function () {
                                        RsCore.cache.bootbox = false;
                                        window.location.href = '/';
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
                    } else {
                        //错误处理
                        RsCore
                            .msg
                            .warn('系统异常');
                    }
                },
                error: function (req) {
                    if (req.status == 510) {
                        if (!RsCore.cache.bootbox) {
                            RsCore.cache.bootbox = true;
                            bootbox.alert('系统超时,请重新登录...', function () {
                                RsCore.cache.bootbox = false;
                            });
                        }
                    } else {
                        if (!RsCore.cache.bootbox) {
                            RsCore.cache.bootbox = true;
                            bootbox.alert('系统异常', function () {
                                RsCore.cache.bootbox = false;
                            });
                        }
                    }
                }
            });
        },
        handleDate: function (view, data) {
            var len = data.length;
            op.data = data;
            var now = new Date();
            for (var i = 0; i < len; i++) {
                (function () {
                    var da = data[i];
                    op.data[i].local = da['path'][0];
                    op.data[i].nearTime = op.nearTime(now, da['date']);
                    mapTool.getLocal(da['path'][0], i, op.data, function (str, idx) {
                        view
                            .find('.BM_list_box li:eq(' + idx + ') p')
                            .text(str)
                            .attr('title', str);
                    });
                })(i);
            }
        },
        nearTime: function (now, str) {
            var time = new Date(str.replace(/-/g, '/')).getTime();
            now = now.getTime();
            var dis = now - time;
            /*5分钟内*/
            if (dis < 1000 * 60 * 5) {
                return '5分钟内';
            }
            /*1小时内*/
            if (dis < 1000 * 60 * 60) {
                return '1小时内';
            }
            /*3小时内*/
            if (dis < 1000 * 60 * 60 * 3) {
                return '3小时内';
            }

            /*1天内*/
            // if (dis < 1000 * 60 * 5) {     return '1天内'; }

            /*具体日期*/

            return str.split(' ')[0];
        },
        getFullDate: function (time/*毫秒数*/) {
            var now = new Date(time);
            var year = now.getFullYear(),
                month = now.getMonth() + 1,
                day = now.getDate();
            month = ('' + month).length == 1
                ? '0' + month
                : month;
            day = ('' + day).length == 1
                ? '0' + day
                : day;
            return [year, month, day].join('-');
        },
        getDate: function (view) {
            var obj = view.find('.js_date a.active'),
                type = obj.attr('val'),
                now = new Date(),
                nowTime = now.getTime(),
                result = {
                    begintime: '',
                    endtime: ''
                },
                preTime,
                nextTime,
                month = [
                    1,
                    3,
                    5,
                    7,
                    8,
                    10,
                    12
                ],
                _TIMES = 24 * 60 * 60 * 1000;
            if (type == 'nolimt') { }
            if (type == 'week') {
                //preTime = nowTime - 7 * 24 * 60 * 60 * 1000;

                var weekIdx = now.getDay() - 1;
                preTime = nowTime - weekIdx * _TIMES;
                nextTime = nowTime + (6 - weekIdx) * _TIMES;

                result.begintime = this.getFullDate(preTime);
                result.endtime = this.getFullDate(nextTime);

            }
            if (type == 'month') {

                //preTime = nowTime - 30 * 24 * 60 * 60 * 1000;
                var monthIdx = now.getDate(),
                    _month = now.getMonth() + 1,
                    year = now.getFullYear();

                var totalDay = 30;
                if (month.indexOf(_month) > -1) {
                    totalDay = 31;
                }

                if (month == 2) {
                    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
                        totalDay = 29;
                    } else {
                        totalDay = 28;
                    }
                }
                preTime = nowTime - (monthIdx - 1) * _TIMES;
                nextTime = nowTime + (totalDay - monthIdx) * _TIMES;
                result.begintime = this.getFullDate(preTime);
                result.endtime = this.getFullDate(nextTime);
            }
            if (type == 'lastMonth') {
                // nowTime = nowTime - 30 * 24 * 60 * 60 * 1000; preTime = nowTime - 30 * 24 *
                // 60 * 60 * 1000;
                var _month = now.getMonth(),
                    _year = now.getFullYear();
                if (_month == 0) {
                    _year--;
                }
                var totalDay = 30;
                if (month.indexOf(_month) > -1) {
                    totalDay = 31;
                }
                if (_month == 2) {
                    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
                        totalDay = 29;
                    } else {
                        totalDay = 28;
                    }
                }
                result.begintime = [_year, _month, 1].join('-');
                result.endtime = [_year, _month, totalDay].join('-');
            }
            if (type == 'special') {
                result.begintime = $('#timeStart').val();
                result.endtime = $('#timeEnd').val();
            }

            return result;

        },
        get_params: function (params, view) {
            var time = this.getDate(view);
            params.queryconditions.begintime = time.begintime;
            params.queryconditions.endtime = time.endtime;
            params.queryconditions.searchtype = view
                .find('.js_searchType')
                .val();
            params.queryconditions.searchkey = view
                .find('.js_searchKey')
                .val();
            return params;
        }

    };
    return {
        container: '.c-page-content',
        render: function (container) {
            document.title = '移动安全-定位';
            op.init(container);
        },
        destroy: function () {
            $(this.container)
                .off()
                .empty();
        }
    };
});