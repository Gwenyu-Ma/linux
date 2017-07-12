define(function (require) {
    var tpl = require('text!settings/operlog.html');
    var mustache = require('mustache');
    require('dep/icheck-1.x/icheck.min');
    require('css!dep/icheck-1.x/skins/polaris/polaris');
    require('colResizable');
    require('table');
    require('css!table');
    require('util_b');
    require('datetimepicker');
    require('css!datetimepicker');
    require('selectric');
    require('css!selectric');
    require('dep/json2');
    var getUrlSearchQuerys = RsCore.assist.getUrlSearchQuerys;
    var params2str = RsCore.assist.params2str;
    var op = {
        query: {
            'log': {
                objtype: '', //组织范围 0:eid,1:groupid,2:sguid
                objid: '', //企业id或组id或客户端id 
                queryconditions: { //查询条件
                    begintime: '',
                    endtime: '',
                    action: '',
                    funcs: '0',
                    result: '',
                    searchkey: '',
                    searchtype: '',
                },
                paging: { //分页信息
                    sort: 'time',
                    order: 1,
                    offset: 0,
                    limit: 20
                }
            }
        },
        columns: {
            'log': [{
                field: 'state',
                checkbox: true
            }, {
                field: 'time',
                title: '时间',
                align: 'center',
                width: 150,
                sortable: true
            }, {
                field: 'username',
                title: '管理员',
                align: 'center',
                sortable: true,
                formatter: function (value, row, index) {
                    if (value == undefined) {
                        return '';
                    }
                    return '<div>' + value + '</div>';
                }
            }, {
                field: 'ip',
                title: '操作IP',
                align: 'center',
                sortable: util_b.ipSort,
                formatter: function (value, row, index) {
                    if (value == undefined) {
                        return '';
                    }
                    return '<div>' + value + '</div>';
                }
            }, {
                field: 'action',
                title: '动作',
                align: 'center',
                sortable: true,
                formatter: function (value, row, index) {
                    if (value == undefined) {
                        return '';
                    }
                    return '<div>' + op.num2act[value] + '</div>';
                }
            }, {
                field: 'funcs',
                title: '功能',
                align: 'center',
                sortable: true,
                formatter: function (value, row, index) {
                    if (value == undefined) {
                        return '';
                    }
                    return '<div>' + op.num2func[value] + '</div>';
                }
            }, {
                field: 'objects',
                title: '对象',
                align: 'left',
                sortable: true,
                formatter: function (value, row, index) {
                    if (value == undefined) {
                        return '';
                    }
                    var objinfo = null,
                        objs = [],
                        name = '',
                        len = 0,
                        str = '';
                    try {
                        objinfo = JSON.parse(value);
                    } catch (e) {
                        objinfo = value;
                    };
                    if (objinfo['group'] && objinfo['group'].length) {
                        name = objinfo['group'][0]['name'];
                        len = objinfo['group'].length;
                        $.each(objinfo['group'], function (idx, ele) {
                            objs.push(ele['name']);
                        });
                        if (len > 1) {
                            str = name + '等(' + len + '个组)';
                        } else {
                            str = name;
                        }
                    } else if (objinfo['ep'] && objinfo['ep'].length) {
                        name = objinfo['ep'][0]['name'];
                        len = objinfo['ep'].length;
                        $.each(objinfo['ep'], function (idx, ele) {
                            objs.push(ele['name']);
                        });
                        if (len > 1) {
                            str = name + '等(' + len + '个终端)';
                        } else {
                            str = name;
                        }
                    } else {
                        str = value;
                    }
                    return '<a href="javascript:void(0);" class="js_more_info" info="' + objs.join(',') + '">' + str + '</a>';
                }
            }, {
                field: 'description',
                title: '描述',
                align: 'left',
                sortable: true,
                formatter: function (value, row, index) {
                    if (value == undefined) {
                        return '';
                    }
                    return '<div>' + value + '</div>';
                }
            },
            /*{
                           field: 'target',
                           title: '操作目标',
                           align: 'center',
                           sortable: true,
                           formatter: function(value, row, index) {
                               if (value == undefined) {
                                   return '';
                               }
                               return '<div>' + value + '</div>';
                           }
                       }, */
            {
                field: 'result',
                title: '状态',
                align: 'center',
                sortable: true,
                formatter: function (value, row, index) {
                    if (value == undefined) {
                        return '';
                    }
                    var state = ['成功', '失败'];
                    return '<div>' + state[value] + '</div>';
                }
            }, {
                field: '',
                title: '操作',
                align: 'center',
                formatter: function (value, row, index) {
                    return '<a href="javascript:void(0)" opt-id="' + row.id + '" class="js_del_log">删除</a>';
                }
            }
            ]
        },
        num2act: {
            '1': '执行',
            '2': '添加',
            '3': '更新',
            '4': '删除'
        },
        funcsSearch: {
            '0': ['1001', '1002', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '3001', '3002', '3003', '3004', '4001', '4002', '5001', '5002', '9001', '9002', '9003'],
            '1': ['1001', '1002'],
            '2': ['2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011'],
            '3': ['3001', '3002', '3003', '3004'],
            '4': ['4001', '4002'],
            '5': ['5001', '5002'],
            '9': ['9001', '9002', '9003'],
        },
        num2func: {
            '1001': '登录',
            '1002': '注销',
            '2001': '全网终端-升级',
            '2002': '全网终端-发消息',
            '2003': '全网终端-移动到',
            '2004': '全网终端-添加组',
            '2005': '全网终端-编辑组',
            '2006': '全网终端-删除组',
            '2007': '全网终端-修改入组规则',
            '2008': '全网终端-重新入组',
            '2009': '全网终端-备注',
            '2010': '全网终端-设置',
            '2011': '管理员密码',
            '3001': '病毒查杀-监控',
            '3002': '病毒查杀-快速查杀',
            '3003': '病毒查杀-全盘查杀',
            '3004': '病毒查杀-设置',
            '4001': '防火墙-监控',
            '4002': '防火墙-设置',
            '5001': '安全手机-上报位置',
            '5002': '安全手机-设置',
            '9001': '我的中心-账户信息',
            '9002': '我的中心-删除我的消息',
            '9003': '我的中心-删除审计日志'
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
            op._type = 'log';
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
        getParams: function (view, type, params) {
            if (params['l_time']) {
                view.find('.js_date a').removeClass('active');
                view.find('.js_date [val=' + params['l_time'] + ']').addClass('active');
                if (params['l_time'] == 'special') {
                    params['l_startTime'] && view.find('#timeStart').val(params['l_startTime']).prop('disabled', false);
                    params['l_endTime'] && view.find('#timeEnd').val(params['l_endTime']).prop('disabled', false);
                }
            }

            if (params['l_act']) {
                view.find('.js_act a').removeClass('active');
                view.find('.js_act [val=' + params['l_act'] + ']').addClass('active');
            }

            if (params['l_resulte']) {
                view.find('.js_result a').removeClass('active');
                view.find('.js_result [val=' + params['l_resulte'] + ']').addClass('active');
            }

            if (params['l_state']) {
                view.find('.js_func a').removeClass('active');
                view.find('.js_func [val=' + params['l_state'] + ']').addClass('active');
            }
        },
        setParams: function (view, type, params) {
            var _params = {};
            if (type == 'log') {
                _params['l_startTime'] = params.queryconditions.begintime;
                _params['l_endTime'] = params.queryconditions.endtime;
                _params['l_act'] = params.queryconditions.action;
                _params['l_state'] = params.queryconditions.funcs;
                _params['l_resulte'] = params.queryconditions.result;
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
        get_log: function (params, view) {
            var time = this.getDate(view);
            params.queryconditions.begintime = time.begintime;
            params.queryconditions.endtime = time.endtime;
            params.queryconditions.action = view.find('.js_act .active').attr('val');
            params.queryconditions.result = view.find('.js_result .active').attr('val');
            params.queryconditions.funcs = view.find('.js_func .active').attr('val');
            params.queryconditions.searchtype = view.find('.js_searchType').val();
            params.queryconditions.searchkey = view.find('.js_searchKey').val();
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
            var height = $('.c-page-container').height();
            var customSearchBoxOpen = showSearch || false;
            var urls = {
                'log': 'oplog/part'
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


                    var pm = {};
                    $.extend(true, pm, op.tempParams);
                    var act = op.tempParams.queryconditions.funcs;
                    var arr = op.funcsSearch[act];
                    var str = '';
                    for (var i = 0; i < arr.length; i++) {
                        if (i == arr.length - 1) {
                            str += '\'' + arr[i] + '\'';
                        } else {
                            str += '\'' + arr[i] + '\',';
                        }
                    }
                    pm.queryconditions.funcs = str;

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
                useIcheck: true,
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
                onLoadError: function (status) {
                    RsCore.reqTableError(status);
                },
                onLoadSuccess: function () {
                    op.resizeTable(view);
                    /*时间范围*/
                }
            });
            first = false;
        },
        resizeTable: function (view) {
            var height = $('.c-page-container').height();
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

            view.on('click', '.js_btn_search', function () {
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


            $(window).on('resize.log', function () {
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

            function join(obj) {
                var arr = [];
                for (var key in obj) {
                    arr.push(key + '=' + obj[key]);
                }
                return arr.join('&');
            }

            $('.userCenter>ul>li').on('click', function (e) {
                var params = RsCore.assist.getUrlSearchQuerys();
                window.location.hash = '#settings/' + $(this).data('current') + '?' + join(params);
            });

            /*删除*/
            view.on('click', '.js_del_log', function () {
                var arr = [];
                arr.push($(this).attr('opt-id'));
                op.dellog(arr, view);
            });

            view.on('click', '#btnlogDel', function () {
                var arr = op.getAllCheckIds(view);
                op.dellog(arr, view);
            });

            view.on('click', '#btnlogDelAll', function () {
                op.dellog4Clean(view);
            });

            view.on('click', '.js_more_info', function () {
                var list = $(this).attr('info').split(',');
                if (list.length <= 1) {
                    return false;
                }
                var html = [],
                    _html = [];
                for (var i = 0; i < list.length; i++) {
                    html.push('<tr><td>' + list[i] + '</td></tr>');
                }
                // while (html.length) {
                //     if (html.length < 3) {
                //         var l = 3 - html.length;
                //         for (var i = 0; i < l; i++) {
                //             html.push('<td></td>');
                //         }

                //     }
                //     _html.push('<tr>' + html.splice(0, 3) + '</tr>');
                // }

                $('#log_info table').html(html.join(''));
                $('#log_info').modal();
            });

        },
        dellog: function (arr, view) {
            if (arr.length == 0) {
                RsCore.msg.warn('请选择要删除日志');
                return false;
            }
            var str = arr.join(',');
            bootbox.confirm('是否删除审计日志', function (r) {
                if (r) {
                    RsCore.ajax(
                        'oplog/del?ids=' + str,
                        function (data, code, msg) {
                            RsCore.msg.success('删除成功');
                            view.find('#tbClient').bootstrapTable('refresh');
                        }
                    );
                }
            });
        },
        dellog4Clean: function (view) {
            bootbox.confirm('确定删除所有审计日志', function (r) {
                if (r) {
                    RsCore.ajax(
                        'oplog/clean',
                        function (data, code, msg) {
                            RsCore.msg.success('清除成功');
                            view.find('#tbClient').bootstrapTable('refresh');
                        }
                    );
                }
            });
        },

        getAllCheckIds: function (view) {
            var arr = [];
            view.find(':checkbox[name=btSelectItem]:checked').each(function () {
                arr.push($(this).closest('tr').find('.js_del_log').attr('opt-id'));
            });
            return arr;
        }
    };
    return {
        container: '.rs-page-container',
        render: function (container, paramStr) {
            document.title = '我的中心-审计日志';
            op.init(container, paramStr);
        },
        destroy: function () {
            $(window).off('resize.log');
            $(this.container).find('#tbClient').colResizable({
                'disable': true
            });
            $(this.container).off().empty();
            op.destroyHash();
        }
    };
});