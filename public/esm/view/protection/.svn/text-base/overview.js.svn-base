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
                var name = '';
                var html = '';
                if (params['c']) {
                    var gid = params['g'];
                    var cid = params['c'];
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
                            protection: true,
                            client: data,
                            type: groupType
                        });
                        view.append(html);
                    });
                    if (RsCore.cache.groupClient.length == 0) {
                        RsCore.ajax('Rfwlog/getRfwOverview', {
                            objId: gid,
                            limit: 0
                        }, function (data) {
                            RsCore.cache.groupClient = data.rows;
                            $('.client-list').trigger('getGroupClient', [true]);
                        });
                    }
                } else {
                    var id = params['g'];
                    if (id == 0) {
                        name = '全网计算机';
                        html = mustache.render(tpl, {
                            groupId: '',
                            groupName: name,
                            protection: true,
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
                                protection: true,
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
                url: RsCore.ajaxPath + 'Rfwlog/getRfwOverview',
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
                    field: 'rfwurlaudit',
                    title: '网址访问',
                    align: 'center',
                    sortable: true,
                    formatter: function (value, row, index) {
                        switch (value) {
                            case '-1':
                                return '<span class="tb_status_c01">不限</span>';
                            case '1':
                                return '<span class="tb_status_c02">已开启</span>';
                            case '0':
                                return '<span class="tb_status_c04">已关闭</span>';

                        }
                        return '';
                    }
                }, {
                    field: 'rfwiprulers',
                    title: '黑客攻击',
                    align: 'center',
                    sortable: true,
                    formatter: function (value, row, index) {
                        switch (value) {
                            case '-1':
                                return '<span class="tb_status_c01">不限</span>';
                            case '1':
                                return '<span class="tb_status_c02">已开启</span>';
                            case '0':
                                return '<span class="tb_status_c04">已关闭</span>';

                        }
                        return '';
                    }
                }, {
                    field: 'rfwtdi',
                    title: '联网程序',
                    align: 'center',
                    sortable: true,
                    formatter: function (value, row, index) {
                        switch (value) {
                            case '-1':
                                return '<span class="tb_status_c01">不限</span>';
                            case '1':
                                return '<span class="tb_status_c02">已开启</span>';
                            case '0':
                                return '<span class="tb_status_c04">已关闭</span>';

                        }
                        return '';
                    }
                }, {
                    field: 'rfwflux',
                    title: '流量管理',
                    align: 'center',
                    sortable: true,
                    formatter: function (value, row, index) {
                        switch (value) {
                            case '-1':
                                return '<span class="tb_status_c01">不限</span>';
                            case '1':
                                return '<span class="tb_status_c02">已开启</span>';
                            case '0':
                                return '<span class="tb_status_c04">已关闭</span>';

                        }
                        return '';
                    }
                }, {
                    field: 'rfwshare',
                    title: '共享管理',
                    align: 'center',
                    sortable: true,
                    formatter: function (value, row, index) {
                        switch (value) {
                            case '-1':
                                return '<span class="tb_status_c01">不限</span>';
                            case '1':
                                return '<span class="tb_status_c02">已开启</span>';
                            case '0':
                                return '<span class="tb_status_c04">已关闭</span>';

                        }
                        return '';
                    }
                }],
                cache: false,
                search: false,
                //showToggle: true,
                showRefresh: true,
                showColumns: true,
                pagination: true,
                // pageSize:4,
                countCheck: true,
                sidePagination: 'client',
                showPaginationSwitch: false,
                clickToSelect: false,
                useIcheck: true,
                height: height,
                showCustomSearch: true,
                customSearchBox: '#customSearchBox',
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
            $(window).on('resize.protection', function () {
                op.resizeTable(view);
                view.find('#tbClient').trigger('refresh');
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
        get_view: function (view) {
            op.tempParams = {};
            var params = {};
            params['o_online'] = view.find('.js_act a.active').attr('val');
            op.tempParams['onlinestate'] = params['o_online'];
            var searchKey = view.find('.js_searchType').val();
            var searchTxt = view.find('.js_searchKey').val();
            params['o_stype'] = searchKey;
            params['o_stxt'] = searchTxt;
            var rfwurl = view.find('.js_rfwurlaudit a.active').attr('val');
            params['o_rfwurl'] = rfwurl;
            op.tempParams['rfwurlaudit'] = rfwurl;
            var ip = view.find('.js_rfwiprulers a.active').attr('val');
            params['o_ip'] = ip;
            op.tempParams['rfwiprulers'] = ip;
            var rfwtdi = view.find('.js_rfwtdi a.active').attr('val');
            params['o_rfwtdi'] = rfwtdi;
            op.tempParams['rfwtdi'] = rfwtdi;
            var rfwflux = view.find('.js_rfwflux a.active').attr('val');
            params['o_rfwflux'] = rfwflux;
            op.tempParams['rfwflux'] = rfwflux;
            var rfwshare = view.find('.js_rfwshare a.active').attr('val');
            params['o_rfwshare'] = rfwshare;
            op.tempParams['rfwshare'] = rfwshare;
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
            if (params['o_rfwurl']) {
                view.find('.js_rfwurlaudit a').removeClass('active');
                view.find('.js_rfwurlaudit [val=' + params['o_rfwurl'] + ']').addClass('active');
                op.tempParams['rfwurlaudit'] = params['o_rfwurl'];
            }
            if (params['o_ip']) {
                view.find('.js_rfwiprulers a').removeClass('active');
                view.find('.js_rfwiprulers [val=' + params['o_ip'] + ']').addClass('active');
                op.tempParams['rfwiprulers'] = params['o_ip'];
            }
            if (params['o_rfwtdi']) {
                view.find('.js_rfwtdi a').removeClass('active');
                view.find('.js_rfwtdi [val=' + params['o_rfwtdi'] + ']').addClass('active');
                op.tempParams['rfwtdi'] = params['o_rfwtdi'];
            }
            if (params['o_rfwflux']) {
                view.find('.js_rfwflux a').removeClass('active');
                view.find('.js_rfwflux [val=' + params['o_rfwflux'] + ']').addClass('active');
                op.tempParams['rfwflux'] = params['o_rfwflux'];
            }
            if (params['o_rfwshare']) {
                view.find('.js_rfwshare a').removeClass('active');
                view.find('.js_rfwshare [val=' + params['o_rfwshare'] + ']').addClass('active');
                op.tempParams['rfwshare'] = params['o_rfwshare'];
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
            op.init(container, paramStr);
        },
        destroy: function () {
            $(window).on('resize.protection');
            $(this.container).find('#tbClient').colResizable({
                'disable': true
            });
            $(this.container).off().empty();
            op.destroyHash();
        }
    };
});