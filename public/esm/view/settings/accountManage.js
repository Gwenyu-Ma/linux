define(function (require) {
    var tpl = require('text!settings/accountManage.html');
    var mustache = require('mustache');
    require('table');
    require('css!table');
    require('resiableCol');
    require('css!resiableCol');
    require('util_b');
    var getUrlSearchQuerys = RsCore.assist.getUrlSearchQuerys,
        params2str = RsCore.assist.params2str;
    // require('dep/icheck-1.x/icheck.min');
    // require('css!dep/icheck-1.x/skins/polaris/polaris');
    var str2json = RsCore.assist.str2json;
    var common = require('moudleComm');
    var op = {
        init: function (container, paramStr) {
            this.container = container;
            var view = $(container);
            view.empty();
            var html = mustache.render(tpl);
            view.append(html);
            $('#addAccount').on('click', function () {
                $('.addAccountShadow').removeClass('hide');
                $('.addAccount').removeClass('hide');
            });
            $('.addAccount .close,.addAccount .cancelBtn').on('click', function () {
                $('.addAccountShadow').addClass('hide');
                $('.addAccount').addClass('hide');
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
            this.initTable(view, 0);
        },
        initTable: function (view, id) {
            view.find('#tbClient').bootstrapTable({
                url: RsCore.ajaxPath + 'Group/getgroupComputer',
                method: 'post',
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                queryParams: function (params) {
                    $.extend(params, {
                        groupid: id,
                        limit: 0
                    });
                    return params;
                },
                responseHandler: function (res) {
                    // var _res = res.data || {
                    //     //total: 0,
                    //     rows: []
                    // };
                    // RsCore.cache.groupClient = _res.rows;
                    // $('.client-list').trigger('getGroupClient',[true]);
                    // return [];
                    util_b.islogin(res);
                    var _res = [{
                        systype: 'test',
                        userName: '12345',
                        nickName: '小小小',
                        tel: '13461325628',
                        email: '228412@qq.com',
                        ctime: '2014-05-12',
                        lastLogin: '2016-06-15'
                    }];
                    return _res;
                },
                //striped: true,
                columns: [{
                    field: 'userName',
                    title: '用户名',
                    align: 'left',
                    sortable: true,
                    formatter: function (value, row, index) {
                        var name = util_b.getComputerName_Overview(row);
                        var osType = util_b.getSys_Overview(row);
                        var state = util_b.getOnlineState_Overview(row);
                        return '<a class="overview-ico" href="javascript:;" da-toggle="#' + row.sguid + '"><em class="userImg">&nbsp;</em>' + value + '</a>';
                    }
                }, {
                    field: 'nickName',
                    title: '昵称',
                    align: 'center',
                    sortable: true,
                    formatter: function (value, row, index) {
                        return '<div>' + value + '</div>';
                    }
                }, {
                    field: 'tel',
                    title: '手机号码',
                    align: 'center',
                    sortable: true,
                    formatter: function (value, row, index) {
                        return '<div>' + value + '</div>';
                    }
                }, {
                    field: 'email',
                    title: '邮箱地址',
                    align: 'center',
                    sortable: true,
                    formatter: function (value, row, index) {
                        if (!value) {
                            return '未知';
                        } else {
                            return '<div>' + value + '</div>';
                        }

                    }
                }, {
                    field: 'ctime',
                    title: '创建日期',
                    align: 'center',
                    sortable: true,
                    formatter: function (value, row, index) {
                        return '<div>' + value + '</div>';
                    }
                }, {
                    field: 'lastLogin',
                    title: '最后登录',
                    align: 'center',
                    sortable: true,
                    formatter: function (value, row, index) {
                        return '<div>' + value + '</div>';
                    }
                }, {
                    width: '20%',
                    align: 'center',
                    formatter: function (value, row, index) {
                        return '<a class="mid">修改</a><a class="del">删除</a><a class="lock">锁定</a>';
                    }
                }],
                cache: false,
                search: false,
                showToggle: false,
                showRefresh: true,
                // pageSize:4,
                countCheck: true,
                showColumns: true,
                showExport: true,
                showCustomSearch: true,
                customSearchBox: '#customSearchBox',
                pagination: true,
                sidePagination: 'client',
                showPaginationSwitch: false,
                clickToSelect: false,
                onLoadError: function (status) {
                    RsCore.reqTableError(status);
                },
                onLoadSuccess: function () {
                    view.find('#tbClient').resizableColumns();
                    op.resizeTable(view);
                    // $("#tbClient").on("click","tbody a",function(){
                    //     var clientId = $(this).attr('da-toggle').substring(1);
                    //     var path = window.location.hash; 
                    //     var hash =path.split('?')[0];
                    //     var clientLeft = $(".group-client a");
                    //         path = path.slice(path.indexOf("g=")) + "&c=" + clientId;
                    //         window.location.hash = hash + "?" + path;
                    //         $(".group-client").find("li").removeClass("on");
                    //         clientLeft.each(function(){
                    //             var solideSelect = $(this).attr('da-toggle').substring(1);
                    //             if(solideSelect == clientId){
                    //                 $(this).parent().addClass("on");
                    //             }
                    //         });
                    // });
                    // $('input[type=radio],input[type=checkbox]').iCheck({
                    //     checkboxClass: 'icheckbox_polaris',
                    //     radioClass: 'iradio_polaris',
                    //     increaseArea: '-10%' // optional
                    // }); 
                },
                onColumnSwitch: function () {
                    view.find('#tbClient').trigger('refresh');
                }
            });

        },
        resizeTable: function (view) {
            var objTable = view.find('.bootstrap-table');
            var table_height = objTable.height();
            var custom_height = objTable.find('.custom-table-search:visible').height();
            var table_fotter_height = objTable.find('.fixed-table-pagination').height();
            objTable.find('.fixed-table-container').height(table_height - 42 - custom_height - table_fotter_height);
        }
    };
    return {
        container: '.rs-page-container',
        render: function (container, paramStr) {
            op.init(container, paramStr);
        },
        destroy: function () {
            $(this.container).off().empty();
        }
    };
});