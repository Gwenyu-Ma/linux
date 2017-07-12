define(function(require) {
    var tpl = require('text!remark.html');
    var mustache = require('mustache');
    require('colResizable');
    require('table');
    require('css!table');
    require('util_b');
    var str2json = RsCore.assist.str2json;
    var op = {
        init: function(container, paramStr) {
            var params = str2json(paramStr),
                id = params['g'],
                cid = params['c'],
                ajaxUrl = cid ? 'ep/getep' : 'Group/getgroupComputer',
                list = 1,
                table = null;
            $(container).append(tpl);
            var height = $('.overview-content').height();
            $(container).find('#tbClient').bootstrapTable({
                url: RsCore.ajaxPath + ajaxUrl,
                method: 'post',
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                queryParams: function(params) {
                    if (cid) {
                        $.extend(params, {
                            sguid: cid
                        });
                    } else {
                        $.extend(params, {
                            groupid: id
                        });
                    }

                    return params;
                },
                responseHandler: function(res) {
                    var _res = {
                        total: 0,
                        rows: []
                    };
                    if (cid) {
                        $.extend(_res, {
                            total: 1,
                            rows: [res.data]
                        });
                    } else {
                        $.extend(_res, res.data);
                    }

                    // RsCore.cache.groupClient = _res.rows;
                    // $('.client-list').trigger('getGroupClient',[true]);
                    return _res;
                },
                columns: [{
                    field: 'number',
                    title: '序号',
                    align: 'center',
                    width: '80px',
                    formatter: function() {
                        return list++;
                    }
                }, {
                    field: 'ip',
                    title: 'IP地址',
                    align: 'center',
                    sorter: util_b.ipSort,
                    sortable: true
                }, {
                    field: 'computername',
                    title: '机器名',
                    align: 'center',
                    sortable: true
                }, {
                    field: 'mac',
                    title: 'MAC地址',
                    align: 'center',
                    sortable: true,
                }, {
                    field: 'memo',
                    title: '备注',
                    align: 'center',
                    sortable: true,
                    formatter: function(value, row) {
                        var val = (value ? value : '');
                        var cName = row.computername ? row.computername : '';
                        return '<input value="' + val + '" id="' + row.sguid + '" oldMemo="' + val + '" cName="' + cName + '"/>';
                    }
                }],
                cache: false,
                pagination: true,
                height: height,
                showHeader: true,
                showRefresh: true,
                showColumns: true,
                sidePagination: 'server',
                showPaginationSwitch: false,
                onLoadError: function(status) {
                    RsCore.reqTableError(status);
                },
                onLoadSuccess: function() {
                    op.resizeTable($(container));
                    var $editText = $(container).find('.remark-wrap td>input:text'),
                        reRemarkVal,
                        val,
                        id,
                        cName,
                        oldMemo;
                    $editText.on('focus', function() {
                        reRemarkVal = $.trim($(this).val());
                    });

                    $editText.off('keyup').on('keyup', function(e) {
                        val = $.trim($(this).val());
                        id = $(this).attr('id');
                        oldMemo = $(this).attr('oldMemo');
                        cName = $(this).attr('cName');
                        if (e.keyCode == 13) {
                            if (reRemarkVal != val) {
                                save();
                                reRemarkVal = val;
                            }
                        }
                    });


                    $editText.off('blur').on('blur', function() {
                        val = $.trim($(this).val());
                        id = $(this).attr('id');
                        oldMemo = $(this).attr('oldMemo');
                        cName = $(this).attr('cName');
                        if (reRemarkVal != val) {
                            save();
                            reRemarkVal = val;
                        }
                    });

                    list = 1;

                    function save() {
                        if (val != reRemarkVal) {
                            //预留接口
                            var param = {
                                sguid: id,
                                memo: val,
                                oObj: {
                                    cName: cName,
                                    oldMemo: oldMemo
                                }
                            };
                            RsCore.ajax('ep/setmemo', param, function(data, r) {
                                if (!r) {
                                    RsCore.msg.success('修改成功');
                                } else {
                                    RsCore.msg.warn('修改失败');
                                }
                            });
                        }
                    }
                }
            });
            op.initEvent($(container));
        },
        resizeTable: function(view) {
            var height = $('.overview-content').height();
            view.find('#tbClient').bootstrapTable('changeHeight', height);
        },
        initEvent: function(view) {
            $(window).on('resize.sys.remark', function() {
                console.log('resize.sys.remark');
                op.resizeTable(view);
            });
        }
    };
    return {
        container: '.c-page-content',
        render: function(container, paramStr) {
            document.title = '全网终端-备注';
            op.init(container, paramStr);
        },
        destroy: function() {
            $(window).off('resize.sys.remark');
            $(this.container).find('#tbClient').colResizable({ 'disable': true });
            $(this.container).off().empty();
        }
    };
});