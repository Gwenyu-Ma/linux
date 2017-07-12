define(function(require) {
    var tpl = require('text!report/report.html');
    var mustache = require('mustache');
    require('colResizable');
    require('table');
    require('css!table');
    require('util_b');
    require('datetimepicker');
    require('css!datetimepicker');
    require('selectric');
    require('css!selectric');
    var getUrlSearchQuerys = RsCore.assist.getUrlSearchQuerys;
    var params2str = RsCore.assist.params2str;
    // 'rwarning/add' 添加预警规则 （暂时不做）
    // 'rwarning/del?wsids=1,2' 删除预警规则 （暂时不做）
    var op = {
        query: {
            warn: {
                viewtype: '', //视图类型   xav,ep,detail
                queryconditions: { //查询条件
                    begintime: '',
                    endtime: '',
                    searchkey: '',
                    searchtype: ''
                },
                paging: { //分页信息
                    sort: 'edate',
                    order: 1,
                    offset: 0,
                    limit: 20
                }
            }
        },
        columns: {
            warn: [{
                field: 'state',
                title: '序号',
                width: 80,
                align: 'center',
                formatter: function(value, row, index) {
                    return (index + 1);
                }
            }, {
                field: 'wsname',
                title: '名称',
                align: 'left',
                sortable: true,
                formatter: function(value, row, index) {
                    if (value == undefined) {
                        return '';
                    }
                    return '<div>' + value + '</div>';
                }
            }, {
                field: 'wsclass',
                title: '类型',
                align: 'center',
                sortable: true,
                formatter: function(value, row, index) {
                    if (value == undefined) {
                        return '';
                    }
                    var type = {
                        'clearfailure':'清理失败',
                        'warningburst':'病毒爆发',
                        'warningontagion':'病毒传染'
                    }
                    return '<div>' + type[value] + '</div>';
                }
            }, {
                field: 'username',
                title: '创建者',
                align: 'center',
                sortable: true,
                formatter: function(value, row, index) {
                    if (value == undefined) {
                        return '厂商';
                    }
                    return '<div>' + value + '</div>';
                }
            }, {
                field: 'edate',
                title: '创建时间',
                align: 'center',
                sortable: true,
                formatter: function(value, row, index) {
                    if (value == undefined) {
                        return '';
                    }
                    return '<div>' + value + '</div>';
                }
            }, {
                field: 'enable',
                title: '操作',
                align: 'center',
                sortable: true,
                formatter: function(value, row, index) {
                    var Nclass = value == 0 ? '' : 'on';
                    return '<div><a href="javascript:void(0)" wsid="' + row.wsid + '" class="js_switch warn-switch ' + Nclass +
                        '">&nbsp;</a></div>';
                }
            }]
        },
        tempParams: null,
        /*暂存查询条件*/
        _type: '',
        /*暂存查询日志类型*/
        init: function(container, type, first) {
            op.tempParams = null;
            var view = $(container);
            var html = '';
            var params = getUrlSearchQuerys();

            op._type = type || params['l_xavType'] || 'warn';

            html = mustache.render(tpl, {});
            view.html(html);


            var showSearch = params['topen'] && params['topen'] == 1 ? true : false;
            op.tempParams = op.query[op._type];
            //op.tempParams['objtype'] = params['c'] ? '2' : params['g'] && params['g'] == '0' ? '0' : params['g'] && params['g'] == '-1' ? '-1' : '1';
            //op.tempParams['objid'] = params['c'] ? params['c'] : params['g'] && params['g'] != '0' ? params['g'] : RsCore.cache.group.eid;


            /*参数*/

            if (first) {
                this.getParams(view, op._type, params);
            }
            this['get_' + op._type](op.tempParams, view);
            this.initTable(view, op.columns[op._type], showSearch, first);
            this.initEvent(view);
        },
        getParams: function(view, type, params) {
            // if (type == 'warn') {
            //     if (params['l_time']) {
            //         view.find('.js_date a').removeClass('active');
            //         view.find('.js_date [val=' + params['l_time'] + ']').addClass('active');
            //         if (params['l_time'] == 'special') {
            //             params['l_startTime'] && view.find('#timeStart').val(params['l_startTime']).prop('disabled', false);
            //             params['l_endTime'] && view.find('#timeEnd').val(params['l_endTime']).prop('disabled', false);
            //         }
            //     }
            // }

            // if (params['l_stype']) {
            //     view.find('.js_searchType option[value=' + params['l_stype'] + ']').prop('selected', true);
            // }
            // if (params['l_stxt']) {
            //     view.find('.js_searchKey').val(params['l_stxt']);
            // }
        },
        setParams: function(view, type, params) {
            // var _params = {};
            // if (type == 'warn') {
            //     _params['l_startTime'] = params.queryconditions.begintime;
            //     _params['l_endTime'] = params.queryconditions.endtime;
            // }


            // _params['l_time'] = view.find('.js_date a.active').attr('val');

            // _params['l_stype'] = params.queryconditions.searchtype;
            // _params['l_stxt'] = params.queryconditions.searchkey;

            // _params['l_limit'] = params.paging.limit;
            // _params['l_offset'] = params.paging.offset;
            // _params['l_order'] = params.paging.order;
            // _params['l_sort'] = params.paging.sort;

            // _params['l_xavType'] = type;

            // _params = $.extend({}, getUrlSearchQuerys(), _params);
            // var path = window.location.hash.split('?')[0];
            // window.location.hash = path + '?' + params2str(_params);

        },
        get_warn: function(params, view) {
            var time = this.getDate(view);
            params.queryconditions.begintime = time.begintime;
            params.queryconditions.endtime = time.endtime;
            params.queryconditions.searchkey = view.find('.js_searchKey').val();
            params.queryconditions.searchtype = view.find('.js_searchType').val();

            return params;
        },
        getDate: function(view) {
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
        getFullDate: function(time /*毫秒数*/ ) {
            var now = new Date(time);
            var year = now.getFullYear(),
                month = now.getMonth() + 1,
                day = now.getDate();
            month = ('' + month).length == 1 ? '0' + month : month;
            day = ('' + day).length == 1 ? '0' + day : day;
            return [year, month, day].join('-');
        },
        initTable: function(view, columns, showSearch, first) {
            var customSearchBoxOpen = showSearch || false;
            var url = 'rwarning/part';
            var _params = getUrlSearchQuerys();
            var height = $('.c-page-wrap').height();
            view.find('#tbClient').bootstrapTable({
                url: RsCore.ajaxPath + url,
                method: 'post',
                contentType: 'application/json; charset=UTF-8',
                dataType: 'json',
                queryParams: function(params) {
                    _params = getUrlSearchQuerys();
                    // if (first) {
                    //     _params['l_sort'] && (params.sort = _params['l_sort']);
                    //     _params['l_order'] && (params.order = _params['l_order'] == 0 ? 'asc' : 'desc');
                    //     _params['l_limit'] && (params.limit = _params['l_limit']);
                    //     _params['l_offset'] && (params.offset = _params['l_offset']);
                    // }

                    if (params.sort) {
                        op.tempParams.paging.sort = params.sort;
                    }
                    op.tempParams.paging.order = params.order == 'asc' ? 0 : 1;
                    op.tempParams.paging.limit = params.limit;
                    op.tempParams.paging.offset = params.offset;

                    op.setParams(view, op._type, op.tempParams);

                    var pm = $.extend(true,{},op.tempParams);

                    if (pm.queryconditions.endtime) {
                        var da = new Date(pm.queryconditions.endtime).getTime();
                        da += 24 * 60 * 60 * 1000;
                        pm.queryconditions.endtime = op.getFullDate(da);
                    }

                    return RsCore.stringify(pm);
                },
                responseHandler: function(res) {
                    util_b.islogin(res);
                    if (res.data && res.data.rows) {
                        return res.data;
                    } else {
                        return {
                            rows: [],
                            total: 0
                        };
                    }

                    // return {
                    //     rows: [{
                    //         wsid: 1,
                    //         wsname: 1,
                    //         wsclass: 1,
                    //         username: 1,
                    //         edate: '1970',
                    //         enable: 1
                    //     }, {
                    //         wsid: 2,
                    //         wsname: 2,
                    //         wsclass: 3,
                    //         username: 2,
                    //         edate: '1970',
                    //         enable: 0
                    //     }, {
                    //         wsid: 3,
                    //         wsname: 3,
                    //         wsclass: 3,
                    //         username: 3,
                    //         edate: '1970',
                    //         enable: 1
                    //     }],
                    //     total: 3
                    // };
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
                //showExport: true,
                //showCustomSearch: true,
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
                onLoadError: function(status) {
                    RsCore.reqTableError(status);
                },
                onLoadSuccess: function() {
                    op.resizeTable(view);
                    /*时间范围*/
                    $('#timeStart').datetimepicker({
                        format: 'Y-m-d',
                        onShow: function(ct) {
                            this.setOptions({
                                maxDate: $('#timeEnd').val() ? $('#timeEnd').val().replace(/[-]/g, '/') : false
                            });
                        },
                        timepicker: false,
                        closeOnDateSelect: true
                    });

                    $('#timeEnd').datetimepicker({
                        format: 'Y-m-d',
                        onShow: function(ct) {
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
        resizeTable: function(view) {
            var height = $('.c-page-wrap').height();
            view.find('#tbClient').bootstrapTable('changeHeight', height);
        },
        destroyHash: function() {
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
        initEvent: function(view) {

            // 下拉列表美化
            view.find('select').selectric({
                inheritOriginalWidth: true
            });



            /*日志查询*/
            view.on('click', '#customSearchBox a', function() {
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
                view.find('#tbClient').bootstrapTable('refresh', { query: op.tempParams });
            });
            view.on('change', '#timeStart,#timeEnd', function() {
                op['get_' + op._type](op.tempParams, view);
                view.find('#tbClient').bootstrapTable('chOffset', 0);
                view.find('#tbClient').bootstrapTable('refresh', { query: op.tempParams });
            });
            view.on('click', '.js_btn_search', function() {
                op['get_' + op._type](op.tempParams, view);
                view.find('#tbClient').bootstrapTable('chOffset', 0);
                view.find('#tbClient').bootstrapTable('refresh', { query: op.tempParams });
            });


            $(window).on('resize.log', function() {
                op.resizeTable(view);
            });

            view.on('click', '[name=customSearch]', function() {
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

            view.on('click', '.js_switch', function() {
                var self = $(this);
                var id = self.attr('wsid'),
                    on = self.hasClass('on');
                if (on) {
                    self.removeClass('on');
                    op.switch_enable(0, id, view);
                } else {
                    self.addClass('on');
                    op.switch_enable(1, id, view);
                }
            });
        },
        switch_enable: function(bool, id, view) {
            RsCore.ajax(
                'rwarning/update', { wsid: id, enable: bool },
                null,null,function(){
                    if(bool == 1){
                        view.find('a[wsid='+id+']').removeClass('on');
                    }else{
                        view.find('a[wsid='+id+']').addClass('on');
                    }                    
                }
            );
        }
    };
    return {
        container: '.rs-page-container',
        render: function(container, paramStr) {
            document.title = '报告预警-预警规则';
            op.init(container, null, true);
        },
        destroy: function() {
            op.destroyHash();
            $(this.container).find('#tbClient').colResizable({ 'disable': true });
            $(window).off('resize.log');
            $(this.container).off().empty();
        }
    };
});