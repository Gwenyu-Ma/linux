define(function (require) {
    var tpl = require('text!remark.html');
    var mustache = require('mustache');
    require('table');
    require('css!table');
    require('resiableCol');
    require('css!resiableCol');
    var str2json = RsCore.assist.str2json;
    var op = {
        init: function (container, paramStr) {
            var params = str2json(paramStr),
                id = params['g'],
                list = 1,
                table = null;
            $(container).append(tpl);
            $(container)
                .find('#tbClient')
                .bootstrapTable({
                    url: RsCore.ajaxPath + 'Group/getgroupComputer',
                    method: 'post',
                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                    queryParams: function (params) {
                        $.extend(params, {groupid: id});
                        return params;
                    },
                    responseHandler: function (res) {
                        var _res = res.data || {
                            total: 0,
                            rows: []
                        };
                        RsCore.cache.groupClient = _res.rows;
                        $('.client-list').trigger('getGroupClient', [true]);
                        return _res;
                    },
                    columns: [
                        {
                            field: 'number',
                            title: '序号',
                            align: 'center',
                            formatter: function () {
                                return list++;
                            }
                        }, {
                            field: 'ip',
                            title: 'IP地址',
                            align: 'center',
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
                            sortable: true
                        }, {
                            field: 'memo',
                            title: '备注',
                            align: 'center',
                            sortable: true,
                            formatter: function (value, row) {
                                return '<input value="' + (value
                                    ? value
                                    : '') + '" id="' + row.sguid + '"/>';
                            }
                        }
                    ],
                    cache: false,
                    pageSize: 4,
                    pagination: true,
                    sidePagination: 'server',
                    showPaginationSwitch: false,
                    onLoadError: function (status) {
                        RsCore.reqTableError(status);
                    },
                    onLoadSuccess: function () {
                        $(container)
                            .find('#tbClient')
                            .resizableColumns();
                        op.resizeTable($(container));
                        var $editText = $(container).find('.remark-wrap td>input:text'),
                            reRemarkVal,
                            val,
                            id;
                        $editText.on("focus", function () {
                            reRemarkVal = $(this).val();
                        });

                        $editText.on("keyup", function (e) {
                            val = $.trim($(this).val());
                            id = $(this).attr("id");
                            if (e.keyCode == 13) {
                                save();
                            }
                        });

                        $editText.on("blur", function () {
                            val = $.trim($(this).val());
                            id = $(this).attr("id");
                            save();
                        });

                        list = 1;

                        function save() {
                            if (val != reRemarkVal) {
                                //预留接口
                                RsCore
                                    .ajax('ep/setmemo', {
                                        sguid: id,
                                        memo: val
                                    }, function (data, r) {
                                        if (!r) {
                                            RsCore
                                                .msg
                                                .success("修改成功");
                                        } else {
                                            RsCore
                                                .msg
                                                .warn('修改失败');
                                        }
                                    });
                            }
                        }
                    },
                    onColumnSwitch: function () {
                        $(container)
                            .find('#tbClient')
                            .trigger('refresh');
                    }
                });
        },
        resizeTable: function (view) {
            var objTable = view.find('.bootstrap-table');
            var table_height = objTable.height();
            var custom_height = objTable
                .find('.custom-table-search:visible')
                .height();
            var table_fotter_height = objTable
                .find('.fixed-table-pagination')
                .height();
            objTable
                .find('.fixed-table-container')
                .height(table_height - custom_height - table_fotter_height);
        }
    }
    return {
        container: '.c-page-content',
        render: function (container, paramStr) {
            document.title = '移动安全-备注';
            op.init(container, paramStr);
        },
        destroy: function () {
            $(this.container)
                .off()
                .empty();
        }
    }
})
