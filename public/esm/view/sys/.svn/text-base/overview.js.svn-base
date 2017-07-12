define(function (require) {
    var tpl = require('text!overview.html');
    var mustache = require('mustache');
    require('dep/icheck-1.x/icheck.min');
    require('css!dep/icheck-1.x/skins/polaris/polaris');
    require('colResizable');
    require('table');
    require('css!table');
    require('selectric');
    require('css!selectric');
    require('util_b');
    require('slimscroll');
    var getUrlSearchQuerys = RsCore.assist.getUrlSearchQuerys;
    var escapeHtml = RsCore.assist.escapeHtml;
    var params2str = RsCore.assist.params2str;
    var str2json = RsCore.assist.str2json;
    var common = require('moudleComm');
    var op = {
        clientDetail: null,
        tempParams: {},
        init: function (container, paramStr) {
            op.tempParams = {};
            var view = $(container);
            if (paramStr) {
                var params = str2json(paramStr);
                util_b.blackShow(params['g']);
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
                        if (gid == -2) {
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
                            remove: true,
                            sys: true,
                            client: data,
                            type: groupType,
                            unIns: (gid == '-1' || gid == '-2')
                        });
                        op.clientDetail = data;
                        view.append(html);
                        if (data.systype == 'android') {
                            $('.js_no_mobi').hide();
                        }

                        $('.client-view').slimscroll({
                            height: $('.c-page-content').height() - $('#custom-toolbar').outerHeight() - 65,
                            alwaysVisible: false,
                            size: '4px'
                        });
                    });
                    if (RsCore.cache.groupClient.length == 0) {
                        RsCore.ajax('Group/getgroupComputer', {
                            objId: gid == 0 ? RsCore.cache.group.eid : gid,
                            limit: 0
                        }, function (data) {
                            RsCore.cache.groupClient = data.rows;
                            $('.client-list').trigger('getGroupClient', [true]);
                        });
                    }

                } else {
                    var id = params['g'];
                    if (id == 0) {
                        name = '已加入终端';
                        html = mustache.render(tpl, {
                            groupId: '',
                            groupName: name,
                            sys: true,
                            group: true
                        });
                        view.append(html);
                    } else if (id == -2) {
                        name = '无效终端';
                        html = mustache.render(tpl, {
                            groupId: id,
                            groupName: name,
                            remove: true,
                            sys: true,
                            group: true,
                            type: true,
                            unIns: true
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
                                remove: true,
                                sys: true,
                                group: true,
                                type: groupType,
                                unIns: id == '-1'
                            });
                            view.append(html);
                        }
                    }
                    var _params = getUrlSearchQuerys();
                    this.set_view(_params, view);
                    this.initTable(view, id, _params);
                }
                this.initEvent(container, paramStr);
            } else {
                return false;
            }

        },
        initTable: function (view, id, params) {
            var height = $('.overview-content').height();
            var columns = [{
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
                width: '120px',
                sorter: util_b.ipSort,
                formatter: function (value, row, index) {
                    if (value == undefined) {
                        return '';
                    }
                    return '<div>' + value + '</div>';
                }
            }, {
                field: 'mac',
                title: 'MAC',
                align: 'center',
                sortable: true,
                width: '140px',
                formatter: function (value, row, index) {
                    if (value == undefined) {
                        return '';
                    }
                    return '<div>' + value + '</div>';
                }
            }, {
                field: 'version',
                title: '版本',
                align: 'center',
                sortable: true,
                width: '80px',
                formatter: function (value, row, index) {
                    if (value == undefined) {
                        return '';
                    }
                    return '<div>' + value + '</div>';
                }
            }, {
                field: 'os',
                title: '操作系统',
                align: 'left',
                sortable: true,
                formatter: function (value, row, index) {
                    if (!value) {
                        return '未知';
                    } else {
                        return '<div>' + value + '</div>';
                    }

                }
            }];

            if (id == '-1') {
                columns.push({
                    field: 'edate',
                    title: '卸载时间',
                    align: 'center',
                    sortable: true,
                    width: '140px',
                    formatter: function (value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                });
            } else if (id == -2) {
                columns.push({
                    field: 'groupname',
                    title: '分组名称',
                    align: 'center',
                    sortable: true,
                    width: '100px',
                    formatter: function (value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        if (value == '黑名单') {
                            return '<div>' + value + '</div>';
                        } else {
                            return '<div>已卸载</div>';
                        }

                    }
                });
            } else if (id != 0 && RsCore.cache.group.list[id].type == '2') {
                columns.push({
                    field: 'edate',
                    title: '加黑时间',
                    align: 'center',
                    sortable: true,
                    width: '140px',
                    formatter: function (value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                });
            } else {
                columns.push({
                    field: 'groupname',
                    title: '分组名称',
                    align: 'center',
                    sortable: true,
                    formatter: function (value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                });
            }
            view.find('#tbClient').bootstrapTable({
                url: RsCore.ajaxPath + 'Group/getgroupComputer',
                method: 'post',
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                queryParams: function (params) {
                    $.extend(params, {
                        groupid: id,
                        limit: 0,
                        onlinestate: -1
                    }, op.tempParams);
                    return params;
                },
                responseHandler: function (res) {
                    util_b.islogin(res);
                    var _res = res.data || {
                        //total: 0,
                        rows: []
                    };
                    // _res.rows[0]['os'] = '哈哈我我是测试程序片段 哈哈哈哈哈哈哈哈哈哈啊哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈';
                    // for(var i=0;i<100;i++){
                    //     _res.rows.push(_res.rows[0]);
                    // }
                    // RsCore.cache.groupClient = _res.rows;
                    // $('.client-list').trigger('getGroupClient',[true]);
                    return _res.rows || [];
                },
                //striped: true,
                columns: columns,
                cache: false,
                search: false,
                // showToggle: false,
                showRefresh: true,
                // pageSize:4,
                countCheck: true,
                showColumns: true,
                //showExport: true,
                showCustomSearch: true,
                customSearchBox: '#customSearchBox',
                pagination: true,
                sidePagination: 'client',
                showPaginationSwitch: false,
                clickToSelect: false,
                useIcheck: true,
                height: height,
                customSearchBoxOpen: params['vopen'] == '1' ? true : false,
                onLoadError: function (status) {
                    RsCore.reqTableError(status);
                },
                onLoadSuccess: function () {
                    op.resizeTable(view);
                    view.on('click', '#tbClient tbody a', function () {
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
        initEvent: function (container, paramStr) {

            var view = $(container);
            // 下拉列表美化
            view.find('select').selectric({
                inheritOriginalWidth: true
            });


            /*黑名单删除端*/
            view.on('click', '#btnCliDel', function () {
                var clients = [],
                    params = str2json(paramStr),
                    ids = [];
                if (params['c']) {
                    clients.push(op.clientDetail.computername);
                    ids.push(params['c']);
                    if (ids.length == 0) {
                        RsCore.msg.warn('请先选择要删除终端!');
                        return false;
                    }
                    bootbox.confirm('确定删除此终端', function (ok) {
                        if (ok) {
                            RsCore.ajax('ep/removeep', {
                                'sguids': ids
                            }, function (date) {
                                RsCore.msg.success('删除成功!');
                                $(container).find('#tbClient').bootstrapTable('refresh');
                                common.refreshClient();
                            });
                        }
                    });
                } else {
                    $(view.find('#tbClient').bootstrapTable('getSelections')).each(function (i, item) {
                        clients.push(item.computername);
                        ids.push(item.sguid);
                    });
                    if (ids.length == 0) {
                        RsCore.msg.warn('请先选择要删除终端!');
                        return false;
                    }
                    bootbox.confirm('确定删除此终端', function (ok) {
                        if (ok) {
                            RsCore.ajax('ep/removeep', {
                                'sguids': ids
                            }, function (date) {
                                RsCore.msg.success('删除成功!');
                                $(container).find('#tbClient').bootstrapTable('refresh');
                                common.refreshClient();
                            });
                        }
                    });
                }



            });

            /*移动组*/
            view.on('click', '#btnMoveTo', function () {
                var clients = [],
                    params = str2json(paramStr),
                    groupid = [],
                    groupName = [],
                    ids = [];
                if (params['c']) {
                    clients.push(op.clientDetail.computername);
                    ids.push(params['c']);
                    groupid.push(view.find('.js_group_info').attr('groupid'));
                    groupName.push(view.find('.js_group_info').text());
                } else {
                    $(view.find('#tbClient').bootstrapTable('getSelections')).each(function (i, item) {
                        clients.push(item.computername);
                        ids.push(item.sguid);
                        groupid.push(item.groupid);
                        groupName.push(item.groupname);
                    });
                }

                if (ids.length == 0) {
                    RsCore.msg.warn('请先选择要移动的终端 !');
                    return false;
                }
                view.find('#txtClient').val(clients.join(', '));
                view.find('#btnSaveMoveTo').data({
                    'ids': ids,
                    'groupids': groupid,
                    'groupnames': groupName,
                    'clients': clients
                });
                RsCore.ajax('Group/groupListAll', {
                    t: 1
                }, function (groups) {
                    var html = [];
                    var rows = groups.rows;
                    var blackRow = null;
                    $(rows).each(function (i, row) {
                        if (row.id == '-1') {
                            return;
                        }
                        if (row.type == 2) {
                            blackRow = row;
                            return;
                        }
                        html.push('<label class="radio"><input type="radio" name="radioGroup" value="' + row.id + '">' + escapeHtml(row.groupname) + '</label>');
                    });
                    if (blackRow) {
                        html.push('<label class="radio"><input type="radio" name="radioGroup" value="' + blackRow.id + '">' + escapeHtml(blackRow.groupname) + '</label>');
                    }
                    view.find('#targetGroup').html(html.join(''));
                });
                $('#mMoveTo').modal();
            });
            /*
            view.on('click', '#btnRemove', function() {
                var clients = view.find('#tbClient').bootstrapTable('getSelections');
                if (clients.length == 0) {
                    bootbox.alert('请先选择要移除的终端 !')
                    return false;
                }
                var arr = [];
                $.each(clients, function(i, item) {
                    arr.push(item.sguid);
                });
                //var ids = arr.join(',');
                RsCore.ajax('Group/delClient', {
                    clients: arr,
                    group: RsCore.cache.group.nogroup
                }, function() {
                    RsCore.msg.success('终端移除成功 !');
                    $(container).find('#tbClient').bootstrapTable('refresh');
                });
            });
            */
            view.on('click', '#btnSaveMoveTo', function () {
                //var ids = $(this).data('ids').join(','),
                var self = $(this);
                var groupId = $(container).find(':radio[name=radioGroup]:checked').val();
                var ids = self.data('ids'),
                    groupids = self.data('groupids'),
                    groupnames = self.data('groupnames'),
                    clients = self.data('clients');
                var _obj = {
                    ep: []
                };
                if (groupId) {
                    $.each(ids, function (idx, val) {
                        _obj.ep.push({
                            guid: val,
                            name: clients[idx],
                            gguid: groupids[idx],
                            gname: groupnames[idx]
                        });
                    });
                    RsCore.ajax('Group/moveComputer', {
                        clients: ids,
                        group: groupId,
                        objects: _obj
                    }, function () {
                        RsCore.msg.success('终端移动成功 !');
                        $(container).find('#tbClient').bootstrapTable('refresh');
                        common.refreshClient();
                        $('#mMoveTo').modal('hide');
                    });
                } else {
                    RsCore.msg.warn('请先选择目标组 !');
                }
            });

            view.on('click', '#btnSearch', function () {
                var params = {
                    name: view.find('#search_name').val() || '',
                    ip: view.find('#search_ip').val() || '',
                    mac: view.find('#search_mac').val() || '',
                    sys: view.find('#search_sys').val() || '',
                    version: view.find('#search_ver').val() || ''
                };
                view.find('#tbClient').bootstrapTable('chOffset', 0);
                $('#tbClient').bootstrapTable('refresh', {
                    query: params
                });
            });

            $(window).on('resize.sys', function () {
                console.log('resize.sys');
                op.resizeTable(view);
                view.find('#tbClient').trigger('refresh');
                $('.client-view').slimscroll({
                    height: $('.c-page-content').height() - $('#custom-toolbar').outerHeight() - 65,
                    alwaysVisible: false,
                    size: '4px'
                });
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
            op.tempParams[searchKey] = searchTxt;
            op.tempParams['onlinestate'] = params['o_online'];
            op.set_parmas(params);
        },
        set_parmas: function (params) {
            var _params = $.extend({}, getUrlSearchQuerys(), params);
            var path = window.location.hash.split('?')[0];
            window.location.hash = path + '?' + params2str(_params);
        },
        set_view: function (params, view) {
            if (params['o_online']) {
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
            document.title = '全网终端-概览';
            op.init(container, paramStr);
        },
        destroy: function () {
            op.destroyHash();
            $(window).off('resize.sys');
            $(this.container).find('#tbClient').colResizable({
                'disable': true
            });
            $(this.container).find('.client-view').slimscroll({
                destroy: true
            });
            $(this.container).off().empty();
        }
    };
});