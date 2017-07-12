define(function (require) {
    var tpl = require('text!overview.html');
    var mustache = require('mustache');
    require('dep/icheck-1.x/icheck.min');
    require('css!dep/icheck-1.x/skins/polaris/polaris');
    require('colResizable');
    require('table');
    require('css!table');
    require('util_b');
    require('selectric');
    require('css!selectric');
    var getUrlSearchQuerys = RsCore.assist.getUrlSearchQuerys;
    var params2str = RsCore.assist.params2str;
    var str2json = RsCore.assist.str2json;
    var op = {
        tempParams: {},
        init: function (container, paramStr) {
            op.tempParams = {};
            this.container = container;
            var view = $(container);
            if (paramStr) {
                var params = str2json(paramStr);
                util_b.blackShow(params['g']);
                if (params['c']) {
                    var gid = params['g'];
                    var cid = params['c'];
                    var name = '';
                    var html = '';
                    RsCore.ajax('ep/getep', {
                        sguid: cid
                    }, function (data) {
                        var groupType = false;
                        if (RsCore.cache.group.list[gid]) {
                            groupType = RsCore.cache.group.list[gid].type == '2' ? true : false;
                        }
                        if (gid == -1) {
                            groupType = true;
                        }
                        var classTxt = util_b.getSys_Overview(data);
                        if (data.onlinestate == 0) {
                            data.onlineTxt = '离线';
                            data.onlineClass = 'offline ' + classTxt;
                        }
                        if (data.onlinestate == 1) {
                            data.onlineTxt = '在线';
                            data.onlineClass = 'online ' + classTxt;
                        }
                        if (data.onlinestate == 2) {
                            data.onlineTxt = '卸载';
                            data.onlineClass = 'drop ' + classTxt;
                        }
                        if (data.joingroupdate) {
                            data.joingroupTime = util_b.milsFormatTime(data.joingroupdate * 1000);
                        }
                        var prods = data.productinfo;
                        data.productList = [];
                        for (var i = 0; i < prods.length; i++) {
                            var n = Math.floor(i / 2),
                                m = i % 2,
                                prod = {},
                                _prods = prods[i];
                            if (m == 0) {
                                prod = {
                                    name: _prods.name,
                                    codename: _prods.codename,
                                    version: _prods.version
                                };
                                data.productList[n] = prod;
                            } else {
                                prod = {
                                    name2: _prods.name,
                                    codename2: _prods.codename,
                                    version2: _prods.version
                                };
                                data.productList[n] = $.extend(data.productList[n], prod);
                            }
                        }
                        html = mustache.render(tpl, {
                            groupId: gid || '',
                            groupName: name,
                            virus: true,
                            client: data,
                            type: groupType
                        });
                        view.append(html);
                        $('.client-view').slimscroll({
                            height: $('.c-page-content').height() - $('#custom-toolbar').outerHeight() - 65,
                            alwaysVisible: false,
                            size: '4px'
                        });
                        op.initEvent2(view);
                    });

                    if (RsCore.cache.groupClient.length == 0) {
                        RsCore.ajax('Xavlog/getClientsOverview', {
                            objId: gid == 0 ? RsCore.cache.group.eid : gid,
                            limit: 0
                        }, function (data) {
                            RsCore.cache.groupClient = data.rows;
                            $('.client-list').trigger('getGroupClient', [true]);

                        });
                    }
                } else {
                    var id = params['g'];
                    var name = '';
                    var html = '';
                    if (id == 0) {
                        name = "全网计算机";
                        html = mustache.render(tpl, {
                            groupId: '',
                            groupName: name,
                            virus: true,
                            group: true
                        });
                        view.append(html);
                    } else {
                        name = RsCore.cache.group.list[id].groupname;
                        if (name) {
                            var groupType = false;
                            if (RsCore.cache.group.list[id]) {
                                groupType = RsCore.cache.group.list[id].type == '2' ? true : false;
                            }
                            if (id == -1) {
                                groupType = true;
                            }
                            html = mustache.render(tpl, {
                                groupId: id,
                                groupName: name,
                                virus: true,
                                group: true,
                                type: groupType
                            });
                            view.append(html);
                        }
                    }
                    var _params = getUrlSearchQuerys();
                    this.set_view(_params, view);
                    this.initTable(view, id, _params);
                    this.initEvent(view);
                }
            } else {
                return false;
            }
        },
        initTable: function (view, id, params) {
            var height = $('.overview-content').height();
            view.find('#tbClient').bootstrapTable({
                url: RsCore.ajaxPath + 'Xavlog/getClientsOverview',
                method: 'post',
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                queryParams: function (params) {
                    $.extend(params, {
                        objId: id == 0 ? RsCore.cache.group.eid : id,
                        limit: 0,
                        onlinestate: -1
                    });
                    return params;
                },
                responseHandler: function (res) {
                    util_b.islogin(res);
                    var _res = res.data || {
                        //total: 0,
                        rows: []
                    };
                    // RsCore.cache.groupClient = _res.rows;
                    // $('.client-list').trigger('getGroupClient',[true]);
                    return _res.rows || [];
                },
                //striped: true,
                columns: [{
                    field: 'state',
                    checkbox: true
                }, {
                    field: 'computername',
                    title: '终端名称',
                    align: 'left',
                    sortable: true,
                    formatter: function (value, row, index) {
                        return util_b.getCName(row);
                    }
                }, {
                    field: 'ip',
                    title: 'IP地址',
                    align: 'center',
                    sortable: true,
                    sorter: util_b.ipSort,
                    formatter: function (value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }, {
                    field: 'vlibver',
                    title: '病毒库版本',
                    align: 'center',
                    sortable: true,
                    formatter: function (value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }, {
                    field: 'filemon',
                    title: '文件监控',
                    align: 'center',
                    sortable: true,
                    formatter: function (value, row, index) {
                        switch ('' + value) {
                            case '-1':
                                return '<span class="tb_status_c01">不限</span>';
                            case '0':
                                return '<span class="tb_status_c04">已关闭</span>';
                            case '1':
                                return '<span class="tb_status_c02">已开启</span>';
                        }
                        return '';
                    }
                }, {
                    field: 'mailmon',
                    title: '邮件监控',
                    align: 'center',
                    sortable: true,
                    formatter: function (value, row, index) {
                        switch ('' + value) {
                            case '-1':
                                return '<span class="tb_status_c01">不限</span>';
                            case '0':
                                return '<span class="tb_status_c04">已关闭</span>';
                            case '1':
                                return '<span class="tb_status_c02">已开启</span>';
                        }
                        return '';
                    }
                }, {
                    field: 'sysmon',
                    title: '系统加固',
                    align: 'center',
                    sortable: true,
                    formatter: function (value, row, index) {
                        switch ('' + value) {
                            case '-1':
                                return '<span class="tb_status_c01">不限</span>';
                            case '0':
                                return '<span class="tb_status_c04">已关闭</span>';
                            case '1':
                                return '<span class="tb_status_c02">已开启</span>';
                        }
                        return '';
                    }
                }, {
                    field: 'virusaction',
                    title: '应用加固',
                    align: 'center',
                    sortable: true,
                    formatter: function (value, row, index) {
                        switch ('' + value) {
                            case '-1':
                                return '<span class="tb_status_c01">不限</span>';
                            case '0':
                                return '<span class="tb_status_c04">已关闭</span>';
                            case '1':
                                return '<span class="tb_status_c02">已开启</span>';
                        }
                        return '';
                    }
                }],
                cache: false,
                search: false,
                countCheck: true,
                //showToggle: true,
                showRefresh: true,
                showColumns: true,
                pagination: true,
                // pageSize:4,
                countCheck: true,
                height: height,
                showHeader: true,
                sidePagination: 'client',
                showCustomSearch: true,
                customSearchBox: '#customSearchBox',
                showPaginationSwitch: false,
                clickToSelect: false,
                useIcheck: true,
                customSearchBoxOpen: params['vopen'] == '1' ? true : false,
                onLoadError: function (status) {
                    RsCore.reqTableError(status);
                },
                onLoadSuccess: function () {
                    op.resizeTable(view);
                    $('#tbClient').on('click', 'tbody a', function () {
                        var clientId = $(this).attr('da-toggle').substring(1);
                        var path = window.location.hash;
                        var hash = path.split('?')[0];
                        var clientLeft = $('.group-client a');
                        path = path.slice(path.indexOf('g=')) + '&c=' + clientId;
                        window.location.hash = hash + '?' + path;
                        $('.group-client').find('li').removeClass('on');
                        clientLeft.each(function () {
                            var solideSelect = $(this).attr('da-toggle').substring(1);
                            if (solideSelect == clientId) {
                                $(this).parent().addClass('on');
                            }
                        });
                    });
                }
            });
        },
        resizeTable: function (view) {
            var height = $('.overview-content').height();
            view.find('#tbClient').bootstrapTable('changeHeight', height);
        },
        initEvent: function (view) {
            $(window).on('resize.virus', function () {
                console.log('resize.virus');
                op.resizeTable(view);
                view.find('#tbClient').trigger('refresh');
                $('.client-view').length && $('.client-view').slimscroll({
                    height: $('.c-page-content').height() - $('#custom-toolbar').outerHeight() - 65,
                    alwaysVisible: false,
                    size: '4px'
                });

            });

            // 下拉列表美化
            view.find('select').selectric({
                inheritOriginalWidth: true
            });

            view.on('click', '[name=customSearch]', function () {
                var params = getUrlSearchQuerys();
                var path = window.location.hash.split('?')[0];
                if (view.find('.custom-table-search:visible').length) {
                    params['vopen'] = 1;
                } else {
                    params['vopen'] = 0;
                }
                window.location.hash = path + '?' + params2str(params);
                op.resizeTable(view);
            });

            /*查询*/
            view.on('click', '#customSearchBox a', function () {

                var that = $(this);
                that.closest('.controls').find('a').removeClass('active');
                that.addClass('active');

                op['get_view'](view);
                view.find('#tbClient').bootstrapTable('chOffset', 0);
                view.find('#tbClient').bootstrapTable('refresh', {
                    query: op.tempParams
                });
            });

            view.on('click', '.js_btn_search', function () {
                op['get_view'](view);
                view.find('#tbClient').bootstrapTable('chOffset', 0);
                view.find('#tbClient').bootstrapTable('refresh', {
                    query: op.tempParams
                });
            });
        },
        initEvent2: function (view) {
            $(window).on('resize.virus', function () {
                console.log('resize.virus');
                $('.client-view').slimscroll({
                    height: $('.c-page-content').height() - $('#custom-toolbar').outerHeight() - 65,
                    alwaysVisible: false,
                    size: '4px'
                });

            });
        },
        get_view: function (view) {
            op.tempParams = {};
            var params = {};
            params['o_online'] = view.find('.js_act a.active').attr('val');
            op.tempParams['onlinestate'] = params['o_online'];
            var searchKey = view.find('.js_searchType').val();
            var searchTxt = view.find('.js_searchKey').val();
            params['o_stype'] = searchKey;
            params['o_stxt'] = searchTxt;
            var file = view.find('.js_filemon a.active').attr('val');
            params['o_file'] = file;
            op.tempParams['filemon'] = file;
            var mail = view.find('.js_mailmon a.active').attr('val');
            params['o_mail'] = mail;
            op.tempParams['mailmon'] = mail;
            var sys = view.find('.js_sysmon a.active').attr('val');
            params['o_sys'] = sys;
            op.tempParams['sysmon'] = sys;
            var app = view.find('.js_VirusAction a.active').attr('val');
            params['o_app'] = app;
            op.tempParams['VirusAction'] = app;
            op.tempParams[searchKey] = searchTxt;
            op.set_parmas(params);
        },
        set_parmas: function (params) {
            var _params = $.extend({}, getUrlSearchQuerys(), params);
            var path = window.location.hash.split('?')[0];
            window.location.hash = path + '?' + params2str(_params);
        },
        set_view: function (params, view) {
            if (params['o_online'] && (params['o_online'] + '')) {
                view.find('.js_act a').removeClass('active');
                view.find('.js_act a[val=' + params['o_online'] + ']').addClass('active');
                op.tempParams['onlinestate'] = params['o_online'];
            }
            if (params['o_stype']) {
                view.find('.js_searchType option[value=' + params['o_stype'] + ']').prop('selected', true);
                op.tempParams[params['o_stype']] = params['o_stxt'];
            }
            if (params['o_stxt']) {
                view.find('.js_searchKey').val(params['o_stxt']);
            }
            if (params['o_file']) {
                view.find('.js_filemon a').removeClass('active');
                view.find('.js_filemon [val=' + params['o_file'] + ']').addClass('active');
                op.tempParams['filemon'] = params['o_file'];
            }
            if (params['o_mail']) {
                view.find('.js_mailmon a').removeClass('active');
                view.find('.js_mailmon [val=' + params['o_mail'] + ']').addClass('active');
                op.tempParams['mailmon'] = params['o_mail'];
            }
            if (params['o_sys']) {
                view.find('.js_sysmon a').removeClass('active');
                view.find('.js_sysmon [val=' + params['o_sys'] + ']').addClass('active');
                op.tempParams['sysmon'] = params['o_sys'];
            }
            if (params['o_app']) {
                view.find('.js_VirusAction a').removeClass('active');
                view.find('.js_VirusAction [val=' + params['o_app'] + ']').addClass('active');
                op.tempParams['VirusAction'] = params['o_app'];
            }
        },
        destroyHash: function () {
            var params = getUrlSearchQuerys();
            var _params = {};
            for (var key in params) {
                if (key.indexOf('o_') > -1) {
                    continue;
                }
                _params[key] = params[key];
            }

            var path = window.location.hash.split('?')[0];
            window.location.hash = path + '?' + params2str(_params);
        }

    };
    return {
        container: '.c-page-content',
        render: function (container, paramStr) {
            document.title = "病毒查杀-概览";
            op.init(container, paramStr);
        },
        destroy: function () {
            $(window).off('resize.virus');
            $(this.container).find('#tbClient').colResizable({
                'disable': true
            });
            $(this.container).find('.client-view').slimscroll({
                destroy: true
            });
            $(this.container).off().empty();
            op.destroyHash();
        }
    };
});