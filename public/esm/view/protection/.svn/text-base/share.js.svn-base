define(function (require) {
    var tpl = require('text!protection/share.html');
    var mustache = require('mustache');
    require('colResizable');
    require('table');
    require('css!table');
    require('dep/table/bootstrap-table-protection-sort');
    require('util_b');
    require('datetimepicker');
    require('css!datetimepicker');
    require('selectric');
    require('css!selectric');
    var getUrlSearchQuerys = RsCore.assist.getUrlSearchQuerys;
    var params2str = RsCore.assist.params2str;
    var op = {
        query: {
            share: {
                viewtype: 'detail', //视图类型   xav,ep,detail
                objtype: '', //组织范围 0:eid,1:groupid,2:sguid
                objid: '', //企业id或组id或客户端id 
                queryconditions: { //查询条件
                    begintime: '',
                    endtime: '',
                    searchkey: '',
                    searchtype: '',
                    sharemode: '',
                    ip: '',
                    computername: ''
                },
                paging: { //分页信息
                    sort: 'sharemode',
                    order: 1,
                    offset: 0,
                    limit: 20
                }
            }
        },
        columns: {
            share: {
                '0': [{
                    field: 'name',
                    title: '共享名称',
                    align: 'left',
                    colspan: 3,
                    width: 250,
                    formatter: function (value, row, index) {
                        var name = util_b.getComputerName_Overview(row);
                        var osType = util_b.getSys_Overview(row);
                        var state = util_b.getOnlineState_Overview(row);
                        var title = state == 'drop' ? '已卸载' : '';
                        var ip = row.ip || '-';
                        var num = row._access.length || 0;
                        return '<a class="overview-ico" href="javascript:;" da-toggle="#' + row.sguid + '"><em class="' + osType + ' ' + state + '" title="' + title + '">&nbsp;</em>' + (name ? name : '未知') + '  (' + ip + ') <span>(' + num + ')</span>' + '</a>';
                    }
                }, {
                    field: 'path',
                    title: '物理路径',
                    align: 'left',
                    formatter: function (value, row, index) {
                        return '';
                    }
                }, {
                    field: 'sharemode',
                    title: '权限',
                    align: 'left',
                    sortable: true,
                    width: 150,
                    formatter: function (value, row, index) {
                        return '';
                    }
                }]
            }
        },
        tempParams: null,
        _type: '',
        init: function (container, type, first) {
            op.tempParams = null;
            var view = $(container);
            var html = '';
            var params = getUrlSearchQuerys();

            util_b.blackShow(params['g']);

            op._type = type || params['l_rfwType'] || 'share';
            var dataobj = {};
            dataobj[op._type] = true;
            html = mustache.render(tpl, dataobj);
            view.html(html);


            var showSearch = params['topen'] && params['topen'] == 1 ? true : false;
            // var idx = params['l_view'] ? params['l_view'] : '0';
            op.tempParams = op.query[op._type];
            // op.tempParams['viewtype'] = $('#custom-type a[data-type=' + idx + ']').attr('val');
            // $('#custom-type a[data-type=' + idx + ']').addClass('active').siblings().removeClass('active');
            op.tempParams['objtype'] = params['c'] ? '2' : params['g'] && params['g'] == '0' ? '0' : params['g'] && params['g'] == '-1' ? '-1' : '1';
            op.tempParams['objid'] = params['c'] ? params['c'] : params['g'] && params['g'] != '0' ? params['g'] : RsCore.cache.group.eid;


            /*参数*/

            if (first) {
                this.getParams(view, op._type, params);
            }
            this['get_' + op._type](op.tempParams, view);
            this.initTable(view, op.columns[op._type][0], showSearch, first);
            this.initEvent(view);
        },
        getParams: function (view, type, params) {
            if (type == 'share') {
                if (params['l_time']) {
                    view.find('.js_date a').removeClass('active');
                    view.find('.js_date [val=' + params['l_time'] + ']').addClass('active');
                    if (params['l_time'] == 'special') {
                        params['l_startTime'] && view.find('#timeStart').val(params['l_startTime']).prop('disabled', false);
                        params['l_endTime'] && view.find('#timeEnd').val(params['l_endTime']).prop('disabled', false);
                    }
                }

                if (params['l_task']) {
                    view.find('.js_task a').removeClass('active');
                    view.find('.js_task [val=' + params['l_task'] + ']').addClass('active');
                }

                if (params['l_name']) {
                    view.find('.js_computername').val(params['l_name']);
                }
                if (params['l_ip']) {
                    view.find('.js_ip').val(params['l_ip']);
                }

                if (params['l_stype']) {
                    view.find('.js_searchType option[value=' + params['l_stype'] + ']').prop('selected', true);
                }
                if (params['l_stxt']) {
                    view.find('.js_searchKey').val(params['l_stxt']);
                }
            }
        },
        setParams: function (view, type, params) {
            var _params = {};
            if (type == 'share') {
                _params['l_startTime'] = params.queryconditions.begintime;
                _params['l_endTime'] = params.queryconditions.endtime;
                _params['l_task'] = params.queryconditions.sharemode;
                _params['l_stype'] = params.queryconditions.searchtype;
                _params['l_stxt'] = params.queryconditions.searchkey;
                _params['l_name'] = params.queryconditions.computername;
                _params['l_ip'] = params.queryconditions.ip;
            }

            _params['l_time'] = view.find('.js_date a.active').attr('val');

            _params['l_limit'] = params.paging.limit;
            _params['l_offset'] = params.paging.offset;
            _params['l_order'] = params.paging.order;
            _params['l_sort'] = params.paging.sort;

            _params['l_rfwType'] = type;

            _params = $.extend({}, getUrlSearchQuerys(), _params);
            var path = window.location.hash.split('?')[0];
            window.location.hash = path + '?' + params2str(_params);

        },
        get_share: function (params, view) {
            var time = this.getDate(view);
            params.queryconditions.begintime = time.begintime;
            params.queryconditions.endtime = time.endtime;
            params.queryconditions.searchkey = view.find('.js_searchKey').val();
            params.queryconditions.searchtype = view.find('.js_searchType').val();
            params.queryconditions.sharemode = view.find('.js_task .active').attr('val');
            params.queryconditions.computername = view.find('.js_computername').val();
            params.queryconditions.ip = view.find('.js_ip').val();
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
        getFullDate: function (time /*毫秒数*/ ) {
            var now = new Date(time);
            var year = now.getFullYear(),
                month = now.getMonth() + 1,
                day = now.getDate();
            month = ('' + month).length == 1 ? '0' + month : month;
            day = ('' + day).length == 1 ? '0' + day : day;
            return [year, month, day].join('-');
        },
        initTable: function (view, columns, showSearch, first) {
            var customSearchBoxOpen = showSearch || false;
            var urls = {
                'share': 'rfwlog/newsharedreslist'
            };
            var _params = getUrlSearchQuerys();
            var height = $('.log-content').height();
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

                    if (pm.queryconditions.endtime) {
                        var da = new Date(pm.queryconditions.endtime).getTime();
                        da += 24 * 60 * 60 * 1000;
                        pm.queryconditions.endtime = op.getFullDate(da);
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
                detailView: true,
                cache: false,
                search: false,
                showToggle: false,
                showRefresh: true,
                pageSize: 20,
                pageNumber: first && _params['l_offset'] ? (_params['l_offset'] / 10) + 1 : 1,
                countCheck: true,
                showPaginL: false,
                showColumns: true,
                showCustomSearch: true,
                customSearchBoxOpen: customSearchBoxOpen,
                customType: '#custom-type',
                customSearchBox: '#customSearchBox',
                pagination: true,
                sidePagination: 'server',
                showPaginationSwitch: false,
                clickToSelect: false,
                height: height,
                showHeader: true,
                sortOrder: 'desc',
                sortable: true,
                protection_sort: true,
                // detailFormatter:function(idx,row,ele){
                //     console.log('idx',idx,'row',row,'ele',ele);
                //     return '<div>'+row+'</div>';
                // },
                onExpandRow: function (idx, row, $d) {
                    if (row._access.length) {
                        op.createSubTb($d, row._access);
                    }
                },
                onLoadError: function (status) {
                    RsCore.reqTableError(status);
                },
                onLoadSuccess: function () {
                    op.resizeTable(view);
                    /*时间范围*/
                    $('#timeStart').datetimepicker({
                        format: 'Y-m-d',
                        onShow: function (ct) {
                            this.setOptions({
                                maxDate: $('#timeEnd').val() ? $('#timeEnd').val().replace(/[-]/g, '/') : false
                            });
                        },
                        timepicker: false,
                        closeOnDateSelect: true
                    });

                    $('#timeEnd').datetimepicker({
                        format: 'Y-m-d',
                        onShow: function (ct) {
                            this.setOptions({
                                minDate: $('#timeStart').val() ? $('#timeStart').val().replace(/[-]/g, '/') : false
                            });
                        },
                        timepicker: false,
                        closeOnDateSelect: true
                    });
                }
            });
            first = false;

        },
        createSubTb: function (dom, data) {
            var html = [];
            var table = dom.closest('table');
            var thead = table.find('thead').clone().html();
            html.push('<table style="table-layout:fixed;margin-top:-24px;">');
            html.push('<thead>' + thead + '</thead><tbody>');
            var opt = ['只读', '读写'];
            $.each(data, function (i, ele) {
                var sharemode = ele['sharemode'] || 0;
                var classStr = 'file-type-ico ' + (sharemode == 0 ? 'readOnly' : '');
                html.push('<tr>');
                html.push('<td></td>');
                html.push('<td><span class="' + classStr + '"><em>&nbsp;</em>' + ele['name'] + '</span></td>');
                html.push('<td>' + ele['path'] + '</td>');
                html.push('<td>' + (opt[sharemode] || '') + '</td>');
                html.push('</tr>');
            });
            html.push('</tbody></table>');
            dom.html(html.join(''));
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

                op['get_' + op._type](op.tempParams, view);
                view.find('#tbClient').bootstrapTable('chOffset', 0);
                view.find('#tbClient').bootstrapTable('refresh', {
                    query: op.tempParams
                });
            });
            view.on('change', '#timeStart,#timeEnd', function () {
                op['get_' + op._type](op.tempParams, view);
                view.find('#tbClient').bootstrapTable('chOffset', 0);
                view.find('#tbClient').bootstrapTable('refresh', {
                    query: op.tempParams
                });
            });
            view.on('click', '.js_btn_search', function () {
                op['get_' + op._type](op.tempParams, view);
                view.find('#tbClient').bootstrapTable('chOffset', 0);
                view.find('#tbClient').bootstrapTable('refresh', {
                    query: op.tempParams
                });
            });



            $(window).on('resize.share', function () {
                op.resizeTable(view);
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
            document.title = '上网防护-安全共享';
            op.init(container, null, true);
        },
        destroy: function () {
            $(window).off('resize.share');
            $(this.container).find('#tbClient').colResizable({
                'disable': true
            });
            op.destroyHash();
            $(this.container).off().empty();
        }
    };
});