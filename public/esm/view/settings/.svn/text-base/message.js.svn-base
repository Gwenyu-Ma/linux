define(function (require) {
    var tpl = require('text!settings/message.html');
    var mustache = require('mustache');
    require('dep/icheck-1.x/icheck.min');
    require('css!dep/icheck-1.x/skins/polaris/polaris');
    require('colResizable');
    require('table');
    require('css!table');
    require('util_b');
    var getUrlSearchQuerys = RsCore.assist.getUrlSearchQuerys;
    var params2str = RsCore.assist.params2str;
    var str2json = RsCore.assist.str2json;
    var common = require('moudleComm');
    var op = {
        init: function (container, paramStr) {
            this.container = container;
            var view = $(container);
            view.empty();
            var html = mustache.render(tpl);
            view.append(html);

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
            this.initEvent(view);
        },
        getYmdTime: function (time) {
            if (time > 0) {
                var dateStr = new Date(time);
                var y = dateStr.getFullYear() - 1;
                var m = (Number(dateStr.getMonth()) + 1);
                var d = dateStr.getDate();
                var h = dateStr.getHours();
                var min = dateStr.getMinutes();
                var s = dateStr.getSeconds();
                m = m < 9 ? '0' + m : m;
                d = d < 9 ? '0' + d : d;
                h = h < 9 ? '0' + h : h;
                min = min < 9 ? '0' + min : min;
                s = s < 9 ? '0' + s : s;
                return y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + s;
            } else {
                return '末知时间';
            }
        },
        initTable: function (view, id) {
            var self = this;
            var userInfo = $.parseJSON($('.userInfo').text());
            var lastid = '';
            var msgObj = {};
            var height = $('.c-page-container').height();
            view.find('#tbClient').bootstrapTable({
                url: RsCore.ajaxPath + 'message/getmsg',
                method: 'post',
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                queryParams: function (params) {
                    $.extend(params, {
                        subscriber: userInfo.EID + '+' + userInfo.UserID,
                        lastid: '',
                        count: 0
                    });
                    return params;
                },
                responseHandler: function (res) {
                    util_b.islogin(res);
                    var _res = res.data || {
                        rows: []
                    };
                    var _resTransform = [];
                    var type = ['rs', 'pf', 'am', 'rp', 'b'];
                    var rtype = '';
                    lastid = res.data.lastid;
                    for (var i in _res.messages) {
                        if (_res.messages.hasOwnProperty(i)) {
                            _resTransform.push(_res.messages[i]);
                            msgObj[_res.messages[i]._id.$id] = _res.messages[i];
                        }
                    }

                    //_resTransform.reverse()

                    //假数据
                    for (var j = 0; j < _resTransform.length; j++) {
                        rtype = _resTransform[j].types[0].split(':')[0];
                        if (rtype == 'pf' || rtype == 'auth' || rtype == 'user' || rtype == 'ep' || rtype == 'new' || rtype == 'uninst') {
                            _resTransform[j].types[0] = 'ico-sys-min';
                            _resTransform[j].type = '系统类';
                        } else if (rtype == 'am' || rtype == 'threat' || rtype == 'virus' || rtype == 'fw' || rtype == 'om') {
                            _resTransform[j].types[0] = 'ico-safe-min';
                            _resTransform[j].type = '安全类';
                        } else if (rtype == 'rp') {
                            _resTransform[j].types[0] = 'ico-log-min';
                            _resTransform[j].type = '日志类';
                        } else if (rtype == 'rs') {
                            _resTransform[j].types[0] = 'ico-firm-min';
                            _resTransform[j].type = '厂商类';
                        } else {
                            _resTransform[j].types[0] = 'ico-sys-min';
                            _resTransform[j].type = '系统类';
                        }
                    }

                    return _resTransform;

                },
                columns: [{
                    field: 'state',
                    checkbox: true
                }, {
                    field: 'msgtitle',
                    title: '消息内容',
                    width: '42%',
                    align: 'left',
                    sortable: true,
                    formatter: function (value, row, index) {
                        // var isNew = row.isread?"":'';
                        if (row.isread) {
                            return '<a class="overview-ico" data-id="' + row._id.$id + '"  data-did="' + row.did.$id + '" href="javascript:;"><i class="types ' + row.types[0] + '">&nbsp;</i>' + value + '</a>';
                        } else {
                            return '<a class="overview-ico" data-id="' + row._id.$id + '"  data-did="' + row.did.$id + '" href="javascript:;"><i class="types ' + row.types[0] + '">&nbsp;</i>' + value + '<i class="new">新</i></a>';
                        }
                    }
                }, {
                    field: 'type',
                    title: '类型',
                    align: 'center',
                    sortable: true,
                    formatter: function (value, row, index) {
                        return '<div>' + value + '</div>';
                    }
                }, {
                    field: 'outtime',
                    title: '时间',
                    align: 'center',
                    sortable: true,
                    width: '140px',
                    formatter: function (value, row, index) {
                        return '<div>' + self.getYmdTime(value * 1000) + '</div>';
                    }
                }, {
                    field: 'isread',
                    title: '状态',
                    align: 'center',
                    sortable: true,
                    formatter: function (value, row, index) {
                        var isRead = '未读';
                        if (value) {
                            isRead = '已读';
                        } else {
                            isRead = '未读';
                        }
                        return '<div>' + isRead + '</div>';
                    }
                }, {
                    title: '操作',
                    sortable: false,
                    align: 'center',
                    width: '140px',
                    formatter: function (value, row, index) {
                        if (!row.isread) {
                            return '<a class="already" data-id="' + row.did.$id + '">标为已读</a><a class="del" data-id="' + row.did.$id + '">删除</a>';
                        } else {
                            return '<a class="del" data-id="' + row.did.$id + '">删除</a>';
                        }

                    }
                }],
                cache: false,
                search: false,
                showToggle: false,
                showRefresh: true,
                countCheck: true,
                showColumns: true,
                showPaginL: false,
                //showExport: true,
                //showCustomSearch: true,
                //customSearchBox: '#customSearchBox',
                pagination: true,
                sidePagination: 'client',
                showPaginationSwitch: false,
                clickToSelect: false,
                useIcheck: true,
                height: height,
                showHeader: true,
                onLoadError: function (status) {
                    RsCore.reqTableError(status);
                },
                onLoadSuccess: function () {
                    op.resizeTable(view);
                    $('.myMessage .pagination-check').html('');
                    //删除选中按钮事件
                    view.off('click', '.bootstrap-table').on('click', '.bootstrap-table', function (e) {
                        var className = e.target.className;
                        var id = e.target.id;
                        var did = e.target.getAttribute('data-id');
                        var tdid = e.target.getAttribute('data-did');
                        var $id = $(e.target).data('id');
                        var checkArr = [];
                        var delId = '';
                        var $checkItem = $('#tbClient tbody .icheckbox_polaris');
                        var singId = $(this).parent().parent().find('a').eq(0).data('id');

                        if (id == 'btnDel') {
                            $checkItem.each(function () {
                                if ($(this).hasClass('checked')) {
                                    checkArr.push($(this).parents('tr').find('a').eq(0).data('did'));
                                }
                            });
                            if (checkArr.length) {
                                RsCore.ajax('message/delmsg', {
                                    did: checkArr.join(':')
                                }, function (data, code, msg) {
                                    if (code == 0) {
                                        $('button[name=refresh]').trigger('click');
                                    }
                                });
                            } else {
                                RsCore.msg.warn('请选择要删除的内容');
                            }

                        } else if (id == 'readmsga') {
                            $checkItem.each(function () {
                                if ($(this).hasClass('checked')) {
                                    checkArr.push($(this).parents('tr').find('a').eq(0).data('did'));
                                }
                            });
                            if (checkArr.length) {
                                RsCore.ajax('message/readmsg', {
                                    did: checkArr.join(':')
                                }, function (data, code, msg) {
                                    if (code == 0) {
                                        $('button[name=refresh]').trigger('click');
                                    }
                                });
                            } else {
                                RsCore.msg.warn('请选择要标记的内容');
                            }
                        } else if (className == 'already') {
                            RsCore.ajax('message/readmsg', {
                                did: did
                            }, function (data, code, msg) {
                                if (code == 0) {
                                    $('button[name=refresh]').trigger('click');
                                }
                            });
                        } else if (className == 'del') {
                            RsCore.ajax('message/delmsg', {
                                did: did
                            }, function (data, code, msg) {
                                if (code == 0) {
                                    $('button[name=refresh]').trigger('click');
                                }
                            });
                            // delMessage('/message/delmsg',checkArr);
                        } else if (className == 'overview-ico') {
                            readMessage('', '.messageBox', $id, tdid);
                        }

                    });

                    //读取消息
                    function readMessage(url, ele, id, tdid) {
                        $(ele).removeClass('hide');
                        $(ele).find('h1').text(msgObj[id].msgtitle);
                        $(ele).find('.type').text(msgObj[id].type);
                        $(ele).find('.time').text(self.getYmdTime(msgObj[id].outtime * 1000));
                        $(ele).find('.content').html(msgObj[id].msgcontext);
                        $(ele).find('.close').on('click', function () {
                            $(ele).addClass('hide');
                            console.log(tdid);
                            RsCore.ajax('message/readmsg', {
                                did: tdid
                            }, function (data, code, msg) {
                                if (code == 0) {
                                    $('button[name=refresh]').trigger('click');
                                }
                            });
                        });
                    }
                }
            });

        },
        resizeTable: function (view) {
            var height = $('.c-page-container').height();
            view.find('#tbClient').bootstrapTable('changeHeight', height);
        },
        initEvent: function (view) {
            $(window).on('resize.setting', function () {
                op.resizeTable(view);
                view.find('#tbClient').trigger('refresh');
            });
        }
    };
    return {
        container: '.rs-page-container',
        render: function (container, paramStr) {
            document.title = '我的中心-我的信息';
            op.init(container, paramStr);
        },
        destroy: function () {
            $(window).off('resize.setting');
            $(this.container).find('#tbClient').colResizable({
                'disable': true
            });
            $(this.container).off().empty();
        }
    };
});