define(function(require) {
    var tpl = require('text!sys/track.html');
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
    var op = {
        query: {
            'msg': {
                objtype: '', //组织范围 0:eid,1:groupid,2:sguid
                objid: '', //企业id或组id或客户端id 
                queryconditions: { //查询条件
                    begintime: '',
                    endtime: '',
                    action: 'msg',
                    state: ''
                },
                paging: { //分页信息
                    sort: 'edate',
                    order: 1,
                    offset: 0,
                    limit: 20
                }
            },
            'md': {
                objtype: '', //组织范围 0:eid,1:groupid,2:sguid
                objid: '', //企业id或组id或客户端id 
                queryconditions: { //查询条件
                    state: '',
                    result: '',
                    cmdid: '',
                    searchkey: '',
                    searchtype: ''
                },
                paging: { //分页信息
                    sort: 'edate',
                    order: 1,
                    offset: 0,
                    limit: 0
                }
            }
        },
        columns: {
            'msg': [{
                field: 'edate',
                title: '发起时间',
                align: 'center',
                sortable: true,
                width: 150,
                formatter: function(value, row, index) {
                    if (value == undefined) {
                        return '';
                    }
                    return '<div>' + value + '</div>';
                }
            }, {
                field: 'grouptype',
                title: '消息对象',
                align: 'center',
                sortable: true,
                formatter: function(value, row, index) {
                    var total = Number(row.daixiafa) + Number(row.yixiafa) + Number(row.chaoshi);
                    var str = '';
                    if (value == undefined) {
                        return '';
                    }
                    if (value == 0) {
                        return '<div class="track_obj" cmdid="' + row.cmdid + '">全网终端</div>';
                    }
                    if (value == 1) {
                        str = total > 0 ? '(' + total + '台)' : '';
                        return '<div class="track_obj" cmdid="' + row.cmdid + '">' + row.groupname + str + '</div>';
                    }
                    if (value == 2) {
                        str = total > 1 ? '等(' + total + '台)' : '';
                        return '<div class="track_obj" cmdid="' + row.cmdid + '">' + util_b.getName(row) + str + '</div>';
                    }

                }
            }, {
                field: 'cmdjson',
                title: '消息内容',
                align: 'center',
                formatter: function(value, row, index) {
                    if (value == undefined) {
                        return '';
                    }
                    return '<div>' + value + '</div>';
                }
            }, {
                field: 'yixiafa',
                title: '下发状态',
                align: 'center',
                formatter: function(value, row, index) {
                    var obj = {
                        done: row.yixiafa,
                        wait: row.daixiafa,
                        fail: row.chaoshi
                    };
                    return op.stateDom(obj, 1);
                }
            }]
        },
        stateDom: function(data, type) {
            var state = '未完成',
                done = Number(data.done),
                wait = Number(data.wait),
                fail = Number(data.fail);
            if (wait == 0) {
                state = '已完成';
            }
            var total = done + wait + fail;
            var pre_done = (done / total) * 100,
                pre_wait = (wait / total) * 100,
                pre_fail = 100 - pre_done - pre_wait; //(fail / total) * 100;
            var info = '';
            if (type == 1) {
                info = '<div class="track_dom">已下发:<span class="track_state_c1">' + done + '</span>待下发:<span class="track_state_c2">' + wait + '</span>超时:<span class="track_state_c3">' + fail + '</span></div>';
            } else if (type == 2) {
                info = '<div class="track_dom">成功:<span class="track_state_c1">' + done + '</span>未执行:<span class="track_state_c2">' + wait + '</span>失败:<span class="track_state_c3">' + fail + '</span></div>';
            }
            var html = '<div class="track_state"><span>' + state + '</span>' + '<ul><li class="done" style="width:' + pre_done +
                '%;"></li><li class="wait" style="width:' + pre_wait +
                '%;"></li><li class="fail" style="width:' + pre_fail +
                '%;"></li></ul>' + info + '</div>';

            return html;
        },
        tempParams: null,
        md_params: null,
        /*暂存查询条件*/
        _type: '',
        /*暂存查询日志类型*/
        init: function(container, type, first) {
            op.tempParams = null;
            var view = $(container);
            var html = '';
            var params = getUrlSearchQuerys();
            util_b.blackShow(params['g']);
            op._type = 'msg';
            var dataobj = {};
            dataobj[op._type] = true;
            html = mustache.render(tpl, dataobj);
            view.html(html);


            var showSearch = params['topen'] && params['topen'] == 1 ? true : false;
            op.tempParams = op.query[op._type];
            op.tempParams['objtype'] = params['c'] ? '2' : params['g'] && params['g'] == '0' ? '0' : params['g'] && params['g'] == '-1' ? '-1' : '1';
            op.tempParams['objid'] = params['c'] ? params['c'] : params['g'] && params['g'] !== '0' ? params['g'] : RsCore.cache.group.eid;


            /*参数*/

            if (first) {
                this.getParams(view, op._type, params);
            }
            this['get_' + op._type](op.tempParams, view);
            this.initTable(view, op.columns[op._type], showSearch, first);
            this.initEvent(view);
        },
        getParams: function(view, type, params) {
            if (params['l_time']) {
                view.find('.js_date a').removeClass('active');
                view.find('.js_date [val=' + params['l_time'] + ']').addClass('active');
                if (params['l_time'] == 'special') {
                    params['l_startTime'] && view.find('#timeStart').val(params['l_startTime']).prop('disabled', false);
                    params['l_endTime'] && view.find('#timeEnd').val(params['l_endTime']).prop('disabled', false);
                }
            }

            if (params['l_state']) {
                view.find('.js_state a').removeClass('active');
                view.find('.js_state [val=' + params['l_state'] + ']').addClass('active');
            }


        },
        setParams: function(view, type, params) {
            var _params = {};
            if (type == 'msg') {
                _params['l_startTime'] = params.queryconditions.begintime;
                _params['l_endTime'] = params.queryconditions.endtime;
                _params['l_state'] = params.queryconditions.state;
            }


            _params['l_limit'] = params.paging.limit;
            _params['l_offset'] = params.paging.offset;
            _params['l_order'] = params.paging.order;
            _params['l_sort'] = params.paging.sort;

            _params['l_xavType'] = type;

            _params['l_time'] = view.find('.js_date a.active').attr('val');

            var _params = $.extend({}, getUrlSearchQuerys(), _params);
            var path = window.location.hash.split('?')[0];
            window.location.hash = path + '?' + params2str(_params);
        },
        get_msg: function(params, view) {
            var time = this.getDate(view);
            params.queryconditions.begintime = time.begintime;
            params.queryconditions.endtime = time.endtime;
            params.queryconditions.state = view.find('.js_state .active').attr('val');
            return params;
        },
        get_md_msg: function(params, view) {
            params.queryconditions.state = view.find('.js_md_state .active').attr('val');
            params.queryconditions.searchkey = view.find('.js_md_searchKey').val();
            params.queryconditions.searchtype = view.find('.js_md_searchType').val();
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
            var height = $('.track-content').height();
            var customSearchBoxOpen = showSearch || false;
            var urls = {
                'msg': 'Cmd/part'
            };
            var _params = getUrlSearchQuerys();
            view.find('#tbClient').bootstrapTable({
                url: RsCore.ajaxPath + urls[op._type],
                method: 'post',
                contentType: 'application/json; charset=UTF-8',
                dataType: 'json',
                queryParams: function(params) {
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

                    
                    var pm = {};
                    $.extend(true, pm, op.tempParams);
                    if (pm.queryconditions.endtime) {
                        var da = new Date(pm.queryconditions.endtime).getTime();
                        da += 24 * 60 * 60 * 1000;
                        pm.queryconditions.endtime = op.getFullDate(da);
                    }
                    pm.queryconditions.action = '\'msg\'';
                    delete pm.queryconditions.daixiafa;
                    delete pm.queryconditions.yixiafa;
                    delete pm.queryconditions.chaoshi;
                    delete pm.queryconditions.weizhixing;
                    delete pm.queryconditions.zhixingchenggong;
                    delete pm.queryconditions.zhixingshibai;

                    if (pm.queryconditions.state == '-1') {
                        delete pm.queryconditions.state;
                    }
                    if (pm.queryconditions.state == '0') {
                        delete pm.queryconditions.state;
                        pm.queryconditions.daixiafa = '=0';
                    }
                    if (pm.queryconditions.state == '1') {
                        delete pm.queryconditions.state;
                        pm.queryconditions.daixiafa = '>0';
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
                    //         edate: '2016/9/23 9:33:22',
                    //         action: '升级',
                    //         cmdobject: '销售部',
                    //         yixiafa: 40,
                    //         daixiafa: 10,
                    //         chaoshi: 5,
                    //         zhixingchenggong: 20,
                    //         weizhixing: 10,
                    //         zhixingshibai: 5
                    //     }, {
                    //         edate: '2016/9/23 9:33:22',
                    //         action: '升级',
                    //         cmdobject: '市场部',
                    //         yixiafa: 40,
                    //         daixiafa: 15,
                    //         chaoshi: 5,
                    //         zhixingchenggong: 30,
                    //         weizhixing: 10,
                    //         zhixingshibai: 5
                    //     }],
                    //     total: 2
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
                height: height,
                showHeader: true,
                //showExport: true,
                showCustomSearch: true,
                customSearchBoxOpen: customSearchBoxOpen,
                customType: '#custom-type',
                customSearchBox: '#customSearchBox',
                pagination: true,
                sidePagination: 'server',
                showPaginationSwitch: false,
                clickToSelect: false,
                sortOrder: 'desc',
                onLoadError: function(status) {
                    RsCore.reqTableError(status);
                },
                onLoadSuccess: function() {
                    op.resizeTable(view);

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
                    /*时间范围*/
                    $('.track_state').hover(function() {
                        var self = $(this);
                        var w = (self.outerWidth() - 220) / 2;
                        var top = self.offset().top + 34;
                        var left = self.offset().left + w + 25;
                        var html = '<div class="track_state_info" style="left:' + left + 'px;top:' + top + 'px;"><i></i>' + self.find('.track_dom').html() + '</div>';
                        $('body').append(html);
                    }, function() {
                        $('.track_state_info').remove();
                    });

                    $('.track_obj').off().click(function() {
                        $('#track_info').modal();
                        var params = getUrlSearchQuerys();
                        op.md_params = op.query['md'];
                        op.md_params['objtype'] = params['c'] ? '2' : params['g'] && params['g'] == '0' ? '0' : params['g'] && params['g'] == '-1' ? '-1' : '1';
                        op.md_params['objid'] = params['c'] ? params['c'] : params['g'] && params['g'] !== '0' ? params['g'] : RsCore.cache.group.eid;
                        op.md_params['queryconditions']['cmdid'] = $(this).attr('cmdid');
                        view.find('#tbMdClient').bootstrapTable({
                            url: RsCore.ajaxPath + 'Cmd/expand',
                            method: 'post',
                            contentType: 'application/json; charset=UTF-8',
                            dataType: 'json',
                            columns: [{
                                field: 'computername',
                                title: '终端名称',
                                align: 'center',
                                sortable: true,
                                width: 100,
                                formatter: function(value, row, index) {
                                    if (value == undefined) {
                                        return '';
                                    }
                                    return '<div>' + util_b.getName(row) + '</div>';
                                }
                            }, {
                                field: 'ip',
                                title: 'IP地址',
                                align: 'center',
                                sortable: true,
                                width: 100,
                                formatter: function(value, row, index) {
                                    if (value == undefined) {
                                        return '';
                                    }
                                    return '<div>' + value + '</div>';
                                }
                            }, {
                                field: 'state',
                                title: '下发状态',
                                align: 'center',
                                sortable: true,
                                width: 80,
                                formatter: function(value, row, index) {
                                    var txt = '';
                                    if (value == 0) {
                                        txt = '待下发';
                                    }
                                    if (value == 1) {
                                        txt = '已下发';
                                    }
                                    if (value == 2) {
                                        txt = '超时';
                                    }
                                    return '<div>' + txt + '</div>';
                                }
                            }],
                            cache: false,
                            search: false,
                            height: 350,
                            sidePagination: 'server',
                            queryParams: function(params) {
                                if (params.sort) {
                                    op.md_params.paging.sort = params.sort;
                                }
                                op.md_params.paging.order = params.order == 'asc' ? 0 : 1;
                                op.md_params.paging.limit = 0;
                                op.tempParams.paging.offset = 0;

                                delete op.md_params.queryconditions.daixiafa;
                                delete op.md_params.queryconditions.yixiafa;
                                delete op.md_params.queryconditions.chaoshi;
                                delete op.md_params.queryconditions.weizhixing;
                                delete op.md_params.queryconditions.zhixingchenggong;
                                delete op.md_params.queryconditions.zhixingshibai;
                                delete op.md_params.queryconditions.result;

                                // if (op.md_params.queryconditions.state == '-1') {
                                //     delete op.md_params.queryconditions.state;
                                // }
                                // if (op.md_params.queryconditions.state == '0') {
                                //     delete op.md_params.queryconditions.state;
                                //     op.md_params.queryconditions.yixiafa = '>0';
                                // }
                                // if (op.md_params.queryconditions.state == '1') {
                                //     delete op.md_params.queryconditions.state;
                                //     op.md_params.queryconditions.daixiafa = '>0';
                                // }
                                // if (op.md_params.queryconditions.state == '1') {
                                //     delete op.md_params.queryconditions.state;
                                //     op.md_params.queryconditions.chaoshi = '>0';
                                // }

                                return RsCore.stringify(op.md_params);
                            },
                            responseHandler: function(res) {
                                if (res.data && res.data.rows) {
                                    return res.data;
                                } else {
                                    return {
                                        rows: [],
                                        total: 0
                                    };
                                }
                            }
                        });
                    });

                    $('#track_info').on('hide.bs.modal', function() {
                        view.find('#tbMdClient').bootstrapTable('destroy');
                    });
                }
            });
            first = false;
        },
        resizeTable: function(view) {
            var height = $('.track-content').height();
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

                op['get_' + op._type](op.tempParams, view.find('#customSearchBox'));
                view.find('#tbClient').bootstrapTable('chOffset', 0);
                view.find('#tbClient').bootstrapTable('refresh', { query: op.tempParams });
            });

            view.on('click', '.js_btn_search', function() {
                op['get_' + op._type](op.tempParams, view.find('#customSearchBox'));
                view.find('#tbClient').bootstrapTable('chOffset', 0);
                view.find('#tbClient').bootstrapTable('refresh', { query: op.tempParams });
            });

            view.on('change', '#timeStart,#timeEnd', function() {
                op['get_' + op._type](op.tempParams, view.find('#customSearchBox'));
                view.find('#tbClient').bootstrapTable('chOffset', 0);
                view.find('#tbClient').bootstrapTable('refresh', { query: op.tempParams });
            });

            /*弹框日志查询*/
            view.on('click', '#md-custom-toolbar a', function() {
                var that = $(this);
                that.closest('.controls').find('a').removeClass('active');
                that.addClass('active');
                op['get_md_msg'](op.md_params, view.find('#md-custom-toolbar'));
                view.find('#tbMdClient').bootstrapTable('refresh', { query: op.md_params });
            });

            view.on('click', '.js_md_btn_search', function() {
                op['get_md_msg'](op.md_params, view.find('#md-custom-toolbar'));
                view.find('#tbMdClient').bootstrapTable('refresh', { query: op.md_params });
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

        }
    };
    return {
        container: '.c-page-content',
        render: function(container) {
            document.title = '全网终端-消息跟踪';
            $('.c-page-nav li[da-type=' + 'msg' + ']').addClass('active').siblings().removeClass('active');
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