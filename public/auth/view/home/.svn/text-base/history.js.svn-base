define(function (require) {
    var tpl = require('text!home/history.html');
    var mustache = require('mustache');
    require('colResizable');
    require('table');
    require('css!table');
    require('util_b');
    require('selectric');
    require('css!selectric');
    require('datetimepicker');
    require('css!datetimepicker');
    var common = require('common');
    var echarts = require('echarts3');
    var myEchartSet = require('./myEchartSet');
    var getUrlSearchQuerys = RsCore.assist.getUrlSearchQuerys;
    var params2str = RsCore.assist.params2str;
    var op = {
        echartObj: null,
        query: {
            'history': {
                objtype: '', //组织范围 0:eid,1:groupid,2:sguid
                objid: '', //企业id或组id或客户端id 
                queryconditions: { //查询条件
                    startDate: '',
                    endDate: ''
                },
                paging: { //分页信息
                    sort: '',
                    order: 1,
                    offset: 0,
                    limit: 20
                }
            }
        },
        columns: {
            'history': [{
                field: 'historyDate',
                title: '授权日期',
                align: 'center',
                sortable: true,
                formatter: function (value, row, index) {
                    if (value == undefined) {
                        return '';
                    }
                    return '<div>' + value + '</div>';
                }
            }, {
                field: 'authNum',
                title: '授权终端',
                align: 'center',
                sortable: true,
                formatter: function (value, row, index) {
                    if (value == undefined) {
                        return '';
                    }
                    return '<div>' + value + '</div>';
                }
            }]
        },
        tempParams: null,
        /*暂存查询条件*/
        _type: '',
        /*暂存查询日志类型*/
        init: function (container, type, first) {
            common.correctNavTab();
            op.tempParams = null;
            var view = $(container);
            var html = '';
            var params = getUrlSearchQuerys();
            op._type = 'history';
            var dataobj = {};
            dataobj[op._type] = true;
            html = mustache.render(tpl, dataobj);
            view.html(html);


            var showSearch = params['topen'] && params['topen'] == 1 ? true : false;
            op.tempParams = op.query[op._type];


            /*参数*/

            if (first) {
                this.getParams(view, op._type, params);
            }
            this['get_' + op._type](op.tempParams, view);
            this.initTable(view, op.columns[op._type], showSearch, first);
            this.initEvent(view);
        },
        getParams: function (view, type, params) {
            if (type == 'history') {

                if (params['l_time']) {
                    view.find('.js_date a').removeClass('active');
                    view.find('.js_date [val=' + params['l_time'] + ']').addClass('active');
                    if (params['l_time'] == 'special') {
                        params['l_startTime'] && view.find('#timeStart').val(params['l_startTime']).prop('disabled', false);
                        params['l_endTime'] && view.find('#timeEnd').val(params['l_endTime']).prop('disabled', false);
                    }
                }

            }
        },
        setParams: function (view, type, params) {
            var _params = {};
            if (type == 'history') {
                _params['l_startTime'] = params.queryconditions.startDate;
                _params['l_endTime'] = params.queryconditions.endDate;
            }


            _params['l_limit'] = params.paging.limit;
            _params['l_offset'] = params.paging.offset;
            _params['l_order'] = params.paging.order;
            _params['l_sort'] = params.paging.sort;

            _params['l_xavType'] = type;

            var _params = $.extend({}, getUrlSearchQuerys(), _params);
            var path = window.location.hash.split('?')[0];
            window.location.hash = path + '?' + params2str(_params);

        },
        get_history: function (params, view) {

            var time = this.getDate(view);
            params.queryconditions.startDate = time.begintime;
            params.queryconditions.endDate = time.endtime;

            return params;
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
                month = [1, 3, 5, 7, 8, 10, 12],
                _TIMES = 24 * 60 * 60 * 1000;
            if (type == 'nolimt') {

            }
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
                // nowTime = nowTime - 30 * 24 * 60 * 60 * 1000;
                // preTime = nowTime - 30 * 24 * 60 * 60 * 1000;
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
        getFullDate: function (time /*毫秒数*/) {
            var now = new Date(time);
            var year = now.getFullYear(),
                month = now.getMonth() + 1,
                day = now.getDate();
            month = ('' + month).length == 1 ? '0' + month : month;
            day = ('' + day).length == 1 ? '0' + day : day;
            return [year, month, day].join('-');
        },
        initTable: function (view, columns, showSearch, first) {
            var height = $('.log-content').height();
            var customSearchBoxOpen = showSearch || false;
            var urls = {
                'history': 'Authproduct/historyAccredit'
            };
            var _params = getUrlSearchQuerys();
            view.find('#tbClient').bootstrapTable({
                url: RsCore.ajaxPath + urls[op._type],
                method: 'post',
                contentType: 'application/json; charset=UTF-8',
                dataType: 'json',
                queryParams: function (params) {
                    _params = getUrlSearchQuerys();
                    if (first) {
                        _params['l_sort'] && (params.sort = _params['l_sort']);
                        _params['l_order'] && (params.order = _params['l_order'] == 0 ? 'asc' : 'desc');
                        _params['l_limit'] && (params.limit = _params['l_limit']);
                        _params['l_offset'] && (params.offset = _params['l_offset']);
                    }

                    if (params.sort) {
                        op.tempParams.paging.sort = params.sort;
                    }
                    op.tempParams.paging.order = params.order == 'asc' ? 0 : 1;
                    op.tempParams.paging.limit = params.limit;
                    op.tempParams.paging.offset = params.offset;


                    op.setParams(view, op._type, op.tempParams);

                    var pm = $.extend(true, {}, op.tempParams);

                    if (pm.queryconditions.endDate) {
                        var da = new Date(pm.queryconditions.endDate).getTime();
                        //da += 24 * 60 * 60 * 1000;
                        pm.queryconditions.endDate = op.getFullDate(da);
                    }

                    return RsCore.stringify(pm);
                },
                responseHandler: function (res) {
                    util_b.islogin(res);
                    if (res.data && res.data.rows) {
                        return res.data;
                    } else {
                        return {
                            rows: [],
                            total: 0
                        };
                    }
                },
                //striped: true,
                columns: columns,
                cache: false,
                search: false,
                showToggle: false,
                showRefresh: true,
                pageSize: 20,
                pageNumber: first && _params['l_offset'] ? (_params['l_offset'] / 10) + 1 : 1,
                countCheck: true,
                showPaginL: false,
                showColumns: true,
                height: height,
                showHeader: true,
                //showExport: true,
                showCustomSearch: true,
                showCustomEchar: true,
                customSearchBox: '#customSearchBox',
                customEcharBox: '#customEcharBox',
                customSearchBoxOpen: customSearchBoxOpen,
                customEcharBoxOpen: true,
                customType: '#custom-type',
                pagination: true,
                sidePagination: 'server',
                showPaginationSwitch: false,
                clickToSelect: false,
                sortOrder: 'desc',
                onLoadError: function (status) {
                    RsCore.reqTableError(status);
                },
                onLoadSuccess: function (res) {
                    op.resizeTable(view);
                    /*时间范围*/

                    var todayDate = new Date(),
                        today = [todayDate.getFullYear(), todayDate.getMonth() + 1, todayDate.getDate()].join('/');

                    $('#timeStart').datetimepicker({
                        format: 'Y-m-d',
                        onShow: function (ct) {
                            this.setOptions({
                                maxDate: $('#timeEnd').val() ? $('#timeEnd').val().replace(/[-]/g, '/') : today
                            });
                        },
                        timepicker: false,
                        closeOnDateSelect: true
                    });

                    $('#timeEnd').datetimepicker({
                        format: 'Y-m-d',
                        onShow: function (ct) {
                            this.setOptions({
                                minDate: $('#timeStart').val() ? $('#timeStart').val().replace(/[-]/g, '/') : false,
                                maxDate: today
                            });
                        },
                        timepicker: false,
                        closeOnDateSelect: true
                    });

                    op.initEchar(res);
                }
            });
            first = false;
        },
        initEchar: function (res) {
            var chartObj = $('#customEcharBox')[0];
            var chart = echarts.init(chartObj);
            op.echartObj = chart;
            var opts = myEchartSet.initHisDay(res);
            chart.setOption(opts);
        },
        resizeTable: function (view) {
            var height = $('.log-content').height();
            view.find('#tbClient').bootstrapTable('changeHeight', height);
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
        initEvent: function (view) {

            // 下拉列表美化
            view.find('select').selectric({
                inheritOriginalWidth: true
            });

            /*日志查询*/
            view.on('click', '#customSearchBox a', function () {

                var that = $(this);
                that.closest('.controls').find('a').removeClass('active');
                that.addClass('active');

                if (that.parent().hasClass('date')) {
                    var now = new Date(),
                        day = [now.getFullYear(), now.getMonth(), now.getDate()].join('-');
                    that.parent().find('input').removeProp('disabled'); //.val(day);
                } else {
                    that.parent().find('.date input').prop('disabled', true);
                }

                if ($('[val=week]').hasClass('active') || $('[val=month]').hasClass('active') || $('[val=lastMonth]').hasClass('active')) {
                    op['get_' + op._type](op.tempParams, view);
                    view.find('#tbClient').bootstrapTable('chOffset', 0);
                    view.find('#tbClient').bootstrapTable('refresh', {
                        query: op.tempParams
                    });
                }

            });

            view.on('click', '.js_btn_search', function () {
                if ($('[val=special]').hasClass('active')) {
                    if ($.trim($('#timeStart').val()) == '' || $.trim($('#timeEnd').val()) == '') {
                        RsCore.msg.notice('请输入日期');
                        return false;
                    }
                }
                op['get_' + op._type](op.tempParams, view);
                view.find('#tbClient').bootstrapTable('chOffset', 0);
                view.find('#tbClient').bootstrapTable('refresh', {
                    query: op.tempParams
                });
            });


            $(window).on('resize.log', function () {
                op.resizeTable(view);
                op.echartObj.resize();
            });

            view.on('click', '[name=customSearch]', function () {
                var params = getUrlSearchQuerys();
                var path = window.location.hash.split('?')[0];
                if (view.find('.custom-table-search:visible').length) {
                    params['topen'] = 1;
                } else {
                    params['topen'] = 0;
                }
                window.location.hash = path + '?' + params2str(params);
                op.resizeTable(view);
            });

        }
    };
    return {
        container: '.c-page-content',
        render: function (container) {
            document.title = '瑞星安全云-授权管理-今日授权终端';
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