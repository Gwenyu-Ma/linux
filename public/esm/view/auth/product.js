define(function (require) {
    var tpl = require('text!auth/product.html');
    var mustache = require('mustache');
    require('colResizable');
    require('table');
    require('css!table');
    require('util_b');
    require('selectric');
    require('css!selectric');
    require('datetimepicker');
    require('css!datetimepicker');

    var getUrlSearchQuerys = RsCore.assist.getUrlSearchQuerys;
    var params2str = RsCore.assist.params2str;
    var op = {
        query: {
            'product': {
                objtype: '', //组织范围 0:eid,1:groupid,2:sguid
                objid: '', //企业id或组id或客户端id 
                queryconditions: { //查询条件

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
            'product': [{
                field: 'name',
                title: '授权产品',
                align: 'left',
                sortable: true,
                formatter: function (value, row, index) {
                    if (value == undefined) {
                        return '';
                    }
                    return '<div>' + value + '</div>';
                }
            }, {
                field: 'codeName',
                title: '产品代码',
                align: 'center',
                sortable: true,
                formatter: function (value, row, index) {
                    if (value == undefined) {
                        return '';
                    }
                    return '<div>' + value + '</div>';
                }
            }, {
                field: 'accreditCount',
                title: '授权终端台数',
                align: 'center',
                sortable: true,
                formatter: function (value, row, index) {
                    if (value == undefined) {
                        return '';
                    }
                    return '<div>' + value + '</div>';
                }
            }, {
                field: 'currentLinkNum',
                title: '已使用终端数',
                align: 'center',
                sortable: false,
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
            op.tempParams = null;
            var view = $(container);
            var html = '';
            var params = getUrlSearchQuerys();
            op._type = 'product';
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
            this.initModal(view);
        },
        getParams: function (view, type, params) {

        },
        setParams: function (view, type, params) {
            var _params = {};
            if (type == 'product') {
                // todo
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
        get_product: function (params, view) {

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
            var height = $('.overview-content').height();
            var customSearchBoxOpen = showSearch || false;
            var urls = {
                'product': 'Authproduct/getProductAccredit'
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
                showRefresh: false,
                pageSize: 20,
                pageNumber: first && _params['l_offset'] ? (_params['l_offset'] / 10) + 1 : 1,
                showPaginL: false,
                showColumns: false,
                height: height,
                showHeader: true,
                //showExport: true,               
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

                    $('.tod_term_info .black').text(res.total);
                }
            });
            first = false;
        },
        initEchar: function (res) {
            var chartObj = $('#customEcharBox')[0];
            var chart = echarts.init(chartObj);
            var opts = myEchartSet.initHisSevenDay();
            chart.setOption(opts);
        },
        resizeTable: function (view) {
            var height = $('.overview-content').height();
            view.find('#tbClient').bootstrapTable('changeHeight', height);
        },
        initModal: function (view) {
            RsCore.ajax(
                'Authproduct/productDetail',
                function (data) {
                    var _view = {};
                    for (var i = 0; i < data.length; i++) {
                        var da = data[i];
                        if (_view[da['seriaNO']]) {
                            _view[da['seriaNO']].push({
                                name: da['name'],
                                codeName: da['codeName'],
                                isOverdue: da['isOverdue'],
                                sysType: da['sysType'] == 1 ? 'Windows' : 'Linux',
                                accreditCount: da['accreditCount'],
                                time: da['startTime'] + '至' + da['endTime']
                            })
                        } else {
                            _view[da['seriaNO']] = [];
                            _view[da['seriaNO']].push({
                                name: da['name'],
                                codeName: da['codeName'],
                                isOverdue: da['isOverdue'],
                                sysType: da['sysType'] == 1 ? 'Windows' : 'Linux',
                                accreditCount: da['accreditCount'],
                                time: da['startTime'] + '至' + da['endTime']
                            })
                        }
                    }
                    var dom = [];
                    dom.push('<tr>');
                    //dom.push('<th>授权号</th>');
                    dom.push('<th>产品</th>');
                    dom.push('<th>系统类型</th>');
                    dom.push('<th>授权终端数</th>');
                    dom.push('<th>授权有效期</th>');
                    dom.push('</tr>');
                    for (var i in _view) {
                        var _d = _view[i];
                        for (var k = 0; k < _d.length; k++) {
                            var d = _d[k];
                            var _class = d['isOverdue'] == 1 ? 'outDate' : ''
                            if (k == 0) {
                                dom.push('<tr class="' + _class + '">')
                                //dom.push('<td class="first" rowspan="' + _d.length + '">' + i + '</td>');
                                dom.push('<td>' + d['name'] + '</td>');
                                dom.push('<td>' + d['sysType'] + '</td>');
                                dom.push('<td>' + d['accreditCount'] + '</td>');
                                dom.push('<td>' + d['time'] + '</td>');
                                dom.push('</tr>');
                            } else {
                                dom.push('<tr class="' + _class + '">')
                                // dom.push('<td></td>');
                                dom.push('<td>' + d['name'] + '</td>');
                                dom.push('<td>' + d['sysType'] + '</td>');
                                dom.push('<td>' + d['accreditCount'] + '</td>');
                                dom.push('<td>' + d['time'] + '</td>');
                                dom.push('</tr>');
                            }
                        }
                    }
                    $('#sqInfo').html(dom.join(''));
                }
            )

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

            /*日志查询*/

            $(window).on('resize.log', function () {
                op.resizeTable(view);
            });

            view.on('click', '.js_sq_info_modal', function () {
                $('.js_sq_info_box').modal();
            });

            /* 导入授权 */



        }
    };
    return {
        container: '.c-page-content',
        render: function (container) {
            document.title = '授权管理-产品授权';
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