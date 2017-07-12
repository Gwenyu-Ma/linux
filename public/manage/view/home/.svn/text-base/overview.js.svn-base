define(function (require) {
    var tpl = require('text!home/overview.html');
    var mustache = require('mustache');
    require('colResizable');
    require('table');
    require('css!table');
    require('util_b');
    require('selectric');
    require('css!selectric');
    require('datetimepicker');
    require('css!datetimepicker');
    require('validation');
    require('customMethods');
    require('../../../dep/icheck-1.x/icheck.min');
    require('css!../../../dep/icheck-1.x/skins/polaris/polaris');

    var common = require('common');
    var getUrlSearchQuerys = RsCore.assist.getUrlSearchQuerys;
    var params2str = RsCore.assist.params2str;
    var op = {
        query: {
            'product': {
                objtype: '', //组织范围 0:eid,1:groupid,2:sguid
                objid: '', //企业id或组id或客户端id 
                queryconditions: { //查询条件
                    UserName: '',
                    OName: '',
                    createStartTime: '',
                    createEndTime: '',
                    status: ''
                },
                paging: { //分页信息
                    sort: '',
                    order: 1,
                    offset: 0,
                    limit: 20
                }
            }
        },
        columns: {
            'product': [{
                field: 'OName',
                title: '企业名称',
                align: 'center',
                sortable: true,
                formatter: function (value, row, index) {
                    if (value == undefined) {
                        return '';
                    }
                    return '<div style="color:#58606f;">' + value + '</div>';
                }
            }, {
                field: 'UserName',
                title: '用户名',
                align: 'center',
                sortable: true,
                formatter: function (value, row, index) {
                    if (value == undefined) {
                        return '';
                    }
                    return '<div style="color:#79808c;">' + value + '</div>';
                }
            }, {
                field: 'CreatedTime',
                title: '创建时间',
                align: 'center',
                sortable: true,
                formatter: function (value, row, index) {
                    if (value == undefined) {
                        return '';
                    }
                    return '<div style="color:#79808c;">' + value + '</div>';
                }
            }, {
                field: 'productNum',
                title: '授权子产品',
                align: 'center',
                formatter: function (value, row, index) {
                    if (value == undefined) {
                        return '';
                    }
                    if (value > 0) {
                        return '<div username="' + row.UserName + '" oname="' + row.OName + '" eid="' + row.EID + '" class="js_subproduct" style="color:#37c0f0;cursor:pointer;position:relative;">' + value + '</div>';
                    }
                    return '<div class="">' + value + '</div>';
                },
                events: {
                    'click .js_subproduct': function () {
                        var self = $(this);
                        console.log(self.offset());
                        if (self.parents('table').find('.manage_sub_info').length) {
                            return false;
                        }
                        var eid = self.attr('eid'),
                            username = self.attr('username'),
                            oname = self.attr('oname');
                        RsCore.ajax({
                            url: 'Enterprisemanager/productList',
                            data: { EID: eid },
                            success: function (json) {

                                var html = op.getSubInfoHtml(oname, username, json, self.offset());
                                self.parent().append(html);
                            }
                        })
                    }
                }
            }, {
                field: 'accreditEndTime',
                title: '授权截止日期',
                align: 'center',
                formatter: function (value, row, index) {
                    if (value == undefined) {
                        return '';
                    }
                    return '<div style="color:#79808c;">' + value.split(' ')[0] + '</div>';
                }
            }, {
                field: 'Status',
                title: '授权状态',
                align: 'center',
                formatter: function (value, row, index) {
                    if (value == undefined) {
                        return '';
                    }
                    var style = ['#b3b6bc', '#23a61c', '#f49e3b', '#f54336'];
                    var arr = ['未授权', '正常', '即将到期', '过期'];
                    return '<div style="color:' + style[value] + '">' + arr[value] + '</div>';
                }
            }, {
                field: 'LastLoginTime',
                title: '上次登录时间',
                align: 'center',
                sortable: true,
                formatter: function (value, row, index) {
                    if (value == undefined) {
                        return '--';
                    }
                    return '<div>' + value + '</div>';
                }
            }, {
                field: 'PhoneNo',
                title: '联系方式',
                align: 'center',
                sortable: true,
                formatter: function (value, row, index) {
                    if (value == undefined) {
                        return '';
                    }
                    return '<div>' + value + '</div>';
                }
            }, {
                field: 'key10',
                title: '操作',
                align: 'left',
                width: 190,
                formatter: function (value, row, index) {
                    var html = [];
                    html.push('<div class="manage_opt"><a href="javascript: void (0);" class="js_detail">详情</a>');
                    //if (row.Status == 0 || row.Status == 3 || row.Status == 2) {
                    html.push('<a href="javascript: void (0); " class="js_auth">授权</a>');
                    //}
                    if (row.Status == 0) {
                        html.push('<a href="javascript: void (0); " class="js_del">删除</a>');
                    }
                    html.push('<a href="javascript: void (0); " class="js_modify">修改密码</a></div>');
                    return html.join('');
                },
                events: {
                    'click .js_detail': function (e, value, row, index) {
                        console.log('detail', e, value, row, index);
                        $('#userInfo_table').html("");
                        var userInfo = $('.js_userInfo');
                        userInfo.attr('eid', row.EID);
                        userInfo.attr('UserName', row.UserName);
                        userInfo.attr('EMail', row.EMail);
                        userInfo.attr('PhoneNo', row.PhoneNo);
                        userInfo.attr('OName', row.OName);
                        userInfo.find('[name=UserName]').val(row.UserName);
                        userInfo.find('[name=EMail]').val(row.EMail);
                        userInfo.find('[name=PhoneNo]').val(row.PhoneNo);
                        userInfo.find('[name=OName]').val(row.OName);
                        RsCore.ajax({
                            url: 'Enterprisemanager/productList',
                            data: { EID: row.EID },
                            success: function (json) {
                                var html = op.getSubInfoHtml2(json);
                                userInfo.find('table tbody').append(html);
                            }
                        });
                        userInfo.modal();
                        $('#userInfo_tab a:first').tab('show');
                    },
                    'click .js_auth': function (e, value, row, index) {
                        console.log('auth', e, value, row, index)
                        var box = $('.js_sq_info_box');
                        if (box.find('.step02 .js_submit').hasClass('process')) {
                            RsCore.msg.warn('操作太频繁，请稍等');
                            return false;
                        }
                        box.find('.modal-body>div').addClass('hide');
                        box.find('.manage_step').addClass('hide');
                        box.css({ 'height': '460px' });
                        box.attr('auth', 'true');
                        box.attr('EID', row.EID);
                        box.attr('username', row.UserName);
                        box.attr('oname', row.OName);
                        box.find('.step02 .js_submit').trigger('click');
                        box.modal();
                    },
                    'click .js_del': function (e, value, row, index) {
                        console.log('del', e, value, row, index)
                        $('.js_del_enter').attr('eid', row.EID);
                        $('.js_del_enter .modal-body>div').text('确定删除' + row.OName + '(' + row.UserName + ')');
                        $('.js_del_enter').modal();
                    },
                    'click .js_modify': function (e, value, row, index) {
                        console.log('modify', e, value, row, index)
                        $('.js_modify_pwds').attr('eid', row.EID);
                        $('.js_modify_pwds form')[0].reset();
                        $('.js_modify_pwds').modal();
                    }
                }
            }]
        },
        tempParams: null,
        view: null,
        /*暂存查询条件*/
        _type: '',
        /*暂存查询日志类型*/
        init: function (container, type, first) {
            common.correctNavTab();
            op.tempParams = null;
            var view = $(container);
            op.view = view;
            var html = '';
            var params = getUrlSearchQuerys();
            op._type = 'product';
            var dataobj = {};
            dataobj[op._type] = true;
            html = mustache.render(tpl, dataobj);
            view.html(html);


            var showSearch = params['topen'] && params['topen'] == 1 ? true : false;
            op.tempParams = op.query[op._type];


            /*参数*/

            if (first) {
                this.getParams(view, op._type, params);
            }
            this['get_' + op._type](op.tempParams, view);
            this.initTable(view, op.columns[op._type], showSearch, first);
            this.initEvent(view);
            this.initModal(view);
        },
        getParams: function (view, type, params) {
            if (type == 'product') {
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

                if (params['l_stype']) {
                    view.find('.js_searchType option[value=' + params['l_stype'] + ']').prop('selected', true);
                }
                if (params['l_stxt']) {
                    view.find('.js_searchKey').val(params['l_stxt']);
                }

            }
        },
        setParams: function (view, type, params) {
            var _params = {};
            if (type == 'product') {
                _params['l_startTime'] = params.queryconditions.createStartTime;
                _params['l_endTime'] = params.queryconditions.createEndTime;
                _params['l_act'] = params.queryconditions.status;
                if (params.queryconditions.OName !== '') {
                    _params['l_stype'] = 'OName';
                    _params['l_stxt'] = params.queryconditions.OName;
                } else {
                    _params['l_stype'] = 'UserName';
                    _params['l_stxt'] = params.queryconditions.UserName;
                }


            }


            _params['l_limit'] = params.paging.limit;
            _params['l_offset'] = params.paging.offset;
            _params['l_order'] = params.paging.order;
            _params['l_sort'] = params.paging.sort;

            _params['l_xavType'] = type;

            var _params = $.extend({}, getUrlSearchQuerys(), _params);
            var path = window.location.hash.split('?')[0];
            window.location.hash = path + '?' + params2str(_params);

        },
        get_product: function (params, view) {

            var time = this.getDate(view);
            params.queryconditions.createStartTime = time.begintime;
            params.queryconditions.createEndTime = time.endtime;
            params.queryconditions.status = view.find('.js_act .active').attr('val');
            if (view.find('.js_searchType').val() === 'OName') {
                params.queryconditions.OName = view.find('.js_searchKey').val();
                params.queryconditions.UserName = '';
            } else {
                params.queryconditions.UserName = view.find('.js_searchKey').val();
                params.queryconditions.OName = '';
            }

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
            var height = $('.overview-content').height();
            var customSearchBoxOpen = showSearch || false;
            var urls = {
                'product': 'Enterprisemanager/enterpriseList'
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

                    var pm = $.extend(true, {}, op.tempParams);

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
                showRefresh: true,
                pageSize: 20,
                pageNumber: first && _params['l_offset'] ? (_params['l_offset'] / 10) + 1 : 1,
                showColumns: true,
                height: height,
                showHeader: true,
                showCustomSearch: true,
                customSearchBox: '#customSearchBox',
                customBox: '#enterAuth',
                customSearchBoxOpen: customSearchBoxOpen,
                customBoxOpen: true,
                customType: '#custom-type',
                pagination: true,
                sidePagination: 'server',
                showPaginationSwitch: false,
                clickToSelect: false,
                sortOrder: 'desc',
                onLoadError: function (status) {
                    RsCore.reqTableError(status);
                },
                onLoadSuccess: function (res) {
                    op.resizeTable(view);
                    /*时间范围*/
                    $('#timeStart').datetimepicker({
                        format: 'Y-m-d',
                        onShow: function (ct) {
                            this.setOptions({
                                maxDate: $('#timeEnd').val() ? $('#timeEnd').val().replace(/[-]/g, '/') : false
                            });
                        },
                        timepicker: false,
                        closeOnDateSelect: true
                    });

                    $('#timeEnd').datetimepicker({
                        format: 'Y-m-d',
                        onShow: function (ct) {
                            this.setOptions({
                                minDate: $('#timeStart').val() ? $('#timeStart').val().replace(/[-]/g, '/') : false
                            });
                        },
                        timepicker: false,
                        closeOnDateSelect: true
                    });

                    $('.tod_term_info .black').text(res.total);
                }
            });
            first = false;
        },
        initEchar: function (res) {
            var chartObj = $('#customEcharBox')[0];
            var chart = echarts.init(chartObj);
            var opts = myEchartSet.initHisSevenDay();
            chart.setOption(opts);
        },
        resizeTable: function (view) {
            var height = $('.overview-content').height();
            view.find('#tbClient').bootstrapTable('changeHeight', height);
        },
        checkPrevPage: function (len) {
            var offset = op.tempParams.paging.offset,
                limit = op.tempParams.paging.limit,
                pageNum = offset / limit;
            if (len == 1) {
                $('#tbClient').bootstrapTable('chOffset', pageNum > 0 ? (pageNum - 1) : 0);
            }
        },
        referData: function () {
            var len = $('#tbClient tbody tr:not(.no-records-found)').length;
            op.checkPrevPage(len);
            var query = $.extend({}, op.tempParams);
            $('#tbClient').bootstrapTable('refresh', { query: query });
            op.getAuthDetail();
        },
        getEndDate: function (now, monthNum) {
            var year = now.getFullYear(),
                month = now.getMonth() + 1,
                day = now.getDate(),
                _month = month + Number(monthNum);
            if (_month >= 12) {
                year++;
                month = _month - 12;
            } else {
                month = _month;
            }
            if (month < 10) {
                month = '0' + month;
            }
            return [year, month, day].join('-');
        },
        changeMaxValue: function (alldayNum) {
            var inputs = $('.manage_auth_box ul .product_auth_num');
            inputs.each(function (idx, ele) {
                var ipt = $(ele);
                var val = Math.ceil((ipt.attr('authMax') - ipt.attr('authMin')) / alldayNum);
                $(ele).attr('maxvalue', val);
                $(ele).prop('placeholder', '最多' + val + '点');
            });
        },
        initModal: function (view) {
            var alldayNum = 1;

            view.find('.product_date_mode select').selectric({
                inheritOriginalWidth: true,
                maxHeight: 187,
                isAbove: false
            }).on('change', function () {
                view.find('.product_date_option .' + $(this).val()).show().siblings().hide();
                if ($(this).val() == 'default') {
                    var now = new Date($('#product_auth1_start').val().replace(/[-]/g, '/'));
                    var monthChecked = $('[name=product_data]:checked').val();
                    var start = now.getTime(),
                        end = new Date(op.getEndDate(now, monthChecked).replace(/[-]/g, '/')).getTime();
                    alldayNum = Math.ceil(end - start) / (24 * 60 * 60 * 1000) + 1;
                    op.changeMaxValue(alldayNum);
                } else {
                    var start = new Date($('#product_auth2_start').val().replace(/[-]/g, '/')).getTime(),
                        end = new Date($('#product_auth2_end').val().replace(/[-]/g, '/')).getTime();
                    alldayNum = Math.ceil(end - start) / (24 * 60 * 60 * 1000) + 1;
                    op.changeMaxValue(alldayNum);
                }
            });

            view.on('change', '#product_auth1_start,#product_auth2_start,#product_auth2_end', function () {
                var obj = $('.product_date_mode select');
                if (obj.val() == 'default') {
                    var now = new Date($('#product_auth1_start').val().replace(/[-]/g, '/'));
                    var monthChecked = $('[name=product_data]:checked').val();
                    var start = now.getTime(),
                        end = new Date(op.getEndDate(now, monthChecked).replace(/[-]/g, '/')).getTime();
                    alldayNum = Math.ceil(end - start) / (24 * 60 * 60 * 1000) + 1;
                    op.changeMaxValue(alldayNum);
                } else {
                    var start = new Date($('#product_auth2_start').val().replace(/[-]/g, '/')).getTime(),
                        end = new Date($('#product_auth2_end').val().replace(/[-]/g, '/')).getTime();
                    alldayNum = Math.ceil(end - start) / (24 * 60 * 60 * 1000) + 1;
                    op.changeMaxValue(alldayNum);
                }
            })

            var box = $('.js_sq_info_box');
            view.on('click', '.js_sq_info_box_show', function () {
                if ($(this).hasClass('disabled')) {
                    return false;
                }
                box.removeAttr('auth');
                box.removeAttr('EID');
                box.removeAttr('username');
                box.removeAttr('oname');
                box.css({ 'height': 'auto' });
                box.find('form:eq(0)')[0].reset();
                box.find('.modal-body>div').addClass('hide').eq(0).removeClass('hide');
                box.find('.manage_step').removeClass('hide');
                box.modal();
            });

            view.on('click', '.js_edit_date', function () {
                box.find('.step04')
                    .addClass('hide').end()
                    .find('.step03').removeClass('hide');
            })

            view.on('click', '.js_edit_modify', function () {
                box.find('.step05')
                    .addClass('hide').end()
                    .find('.step04').removeClass('hide');
            });

            box.find('form:eq(0)').validate({
                rules: {
                    UserName: { required: true, checkName: true, nospace: true },
                    PWD: { required: true, minlength: 6, passwordStr: true, nospace: true },
                    OName: { required: true, checkOName: true, nospace: true },
                    PhoneNo: { required: true, phone: true },
                    EMail: { email: true }
                },
                messages: {
                    UserName: { required: '请输入用户名', checkName: '用户名为数字、字母、下划线且长度为3~16位', nospace: '不能包含空格' },
                    PWD: { required: '请设置密码', minlength: '长度最少6位', passwordStr: '密码强度低，(大小写字母，数字，特殊符号)', nospace: '不能包含空格' },
                    OName: { required: '请输入企业名称', checkOName: '企业名为数字、字母、下划线且长度为3~20位', nospace: '不能包含空格' },
                    PhoneNo: { required: '请输入联系电话', phone: '电话号码格式错误' },
                    EMail: { email: '邮箱格式错误' }
                },
                errorElement: 'span',
                errorPlacement: function (error, element) {
                    var errLabel = element.closest('.step_form');
                    errLabel.append(error);
                }
            })
            view.on('click', '.step01 .js_submit', function () {
                var self = $(this);
                if (self.hasClass('process')) {
                    return false;
                }
                var form = box.find('form:eq(0)');
                if (!form.valid()) {
                    return false;
                }
                self.button('loading');
                self.addClass('process');
                RsCore.ajax({
                    url: 'Enterprisemanager/enterpriseAdd',
                    data: {
                        UserName: form.find('[name=UserName]').val(),
                        PWD: form.find('[name=PWD]').val(),
                        OName: form.find('[name=OName]').val(),
                        PhoneNo: form.find('[name=PhoneNo]').val(),
                        EMail: form.find('[name=EMail]').val()
                    },
                    success: function (data) {
                        box.attr('EID', data.eid);
                        box.attr('username', form.find('[name=UserName]').val());
                        box.attr('oname', form.find('[name=OName]').val());
                        box.find('.step01')
                            .addClass('hide').end()
                            .find('.step02').removeClass('hide')
                            .find('.js_manage_name').text(form.find('[name=UserName]').val());
                    },
                    complete: function () {
                        self.button('reset');
                        self.removeClass('process');
                    }
                })
            })

            view.on('click', '.js_noauth', function () {
                box.modal('hide');
                op.referData();
            })

            box.on('hidden', function () {
                op.referData();
            })

            var codeNameNum = {
                'XAV': '01',
                'RBA': '05',
                'L27I': '08',
                'RLS': '02',
                'RXP': '04',
                'RSM': '06',
                'LMIPS': '08',
                'L25I': '08',
                'RAM': '03',
                'RIM': '07'
            };

            view.on('click', '.manage_auth_box li', function () {
                var self = $(this),
                    checked = self.find('.product_icon'),
                    input = self.find('.product_auth_num');
                if (checked.hasClass('checked')) {
                    checked.removeClass('checked');
                    input.addClass('hide');
                } else {
                    checked.addClass('checked');
                    if (!input.hasClass('unused')) {
                        input.removeClass('hide');
                    }
                }
            })

            view.on('click', '.product_auth_num', function () {
                return false;
            })


            $('.product_date_option input[type=radio]').iCheck({
                checkboxClass: 'icheckbox_polaris',
                radioClass: 'iradio_polaris',
                increaseArea: '-10%' // optional
            }).on('ifChanged', function () {
                var obj = $('.product_date_mode select');
                if (obj.val() == 'default') {
                    var now = new Date($('#product_auth1_start').val().replace(/[-]/g, '/'));
                    var monthChecked = $('[name=product_data]:checked').val();
                    var start = now.getTime(),
                        end = new Date(op.getEndDate(now, monthChecked).replace(/[-]/g, '/')).getTime();
                    alldayNum = Math.ceil(end - start) / (24 * 60 * 60 * 1000) + 1;
                    op.changeMaxValue(alldayNum);
                } else {
                    var start = new Date($('#product_auth2_start').val().replace(/[-]/g, '/')).getTime(),
                        end = new Date($('#product_auth2_end').val().replace(/[-]/g, '/')).getTime();
                    alldayNum = Math.ceil(end - start) / (24 * 60 * 60 * 1000) + 1;
                    op.changeMaxValue(alldayNum);
                }
            })



            view.on('keyup', '.product_auth_num', function () {
                var self = $(this);
                var val = self.val();
                var text = '';
                if (!/\d/.test(val)) {
                    self.addClass('error');
                    text = '数据格式错误';
                } else if (Number(val) > Number(self.attr('maxvalue'))) {
                    self.addClass('error');
                    text = '超出最大授权数量';
                } else if (Number(val) <= 0) {
                    self.addClass('error');
                    text = '最小授权数量为1';
                } else {
                    self.removeClass('error');
                    text = '=' + $(this).val() * alldayNum + '(点&middot天)';
                }
                self.tooltip({
                    html: true,
                    title: function () {
                        return text;
                    },
                    placement: 'top',
                    delay: {
                        show: 0,
                        hide: 0
                    }
                }).tooltip('show');

            })


            var temp = '<li pGuid="{{productGuid}}">' +
                '<i class="product_icon product_auth{{codeNameNum}}"></i>' +
                '<div class="product_detail">' +
                '<em class="js_auth_name">{{name}}</em>' +
                '<div class="product_process"><i class="{{color}}" style="width:{{process}}%;"></i></div>' +
                '<div class="product_auth_detail"><strong  class="{{color}}">{{usedAmount}}</strong>/{{authAmount}}(点&middot;天)</div>' +
                '</div>' +
                '<input type="text" value="" placeholder="{{placeholder}}" maxvalue="{{accreditCount}}" authMin={{usedAmount}} authMax={{authAmount}} class="product_auth_num {{unUsed}} hide">' +
                '</li>';

            view.on('click', '.step02 .js_submit', function () {
                var self = $(this);
                if (self.hasClass('process')) {
                    return false;
                }
                self.button('loading');
                self.addClass('process');
                RsCore.ajax({
                    url: 'Authmanager/authList',
                    success: function (data) {
                        var html = [];
                        var startDate = data[0]['startTime'].split(' ')[0],
                            endDate = data[0]['endTime'].split(' ')[0];
                        var day = Math.ceil((new Date(endDate.replace(/[-]/g, '/')).getTime() - new Date(startDate.replace(/[-]/g, '/')).getTime()) / (24 * 60 * 60 * 1000));
                        for (var i = 0; i < data.length; i++) {
                            var da = data[i];
                            da['unUsed'] = '';
                            da['process'] = (da['usedAmount'] / da['authAmount']) * 100 || 0;
                            da['codeNameNum'] = codeNameNum[da['codeName']] || '01';
                            da['maxValue'] = Math.floor((da['authAmount'] - da['usedAmount']) / day);
                            da['placeholder'] = '最多' + da['maxValue'] + '点';
                            if (da['process'] >= 100) {
                                da['color'] = 'red';
                                da['unUsed'] = 'unused';
                            } else if (da['process'] >= 80) {
                                da['color'] = 'yellow';
                            } else {
                                da['color'] = 'green';
                            }
                            html.push(mustache.render(temp, da))
                        }
                        html.push('<li class="clear"></li>');
                        box.find('.manage_auth_box ul').html(html.join(''));
                        box.find('.step02')
                            .addClass('hide').end()
                            .find('.step03').removeClass('hide')
                        var today = new Date();
                        /*时间范围*/
                        $('#product_auth1_start').datetimepicker({
                            onGenerate: function () {
                                $(this).css({ 'z-index': 99999 });
                            },
                            format: 'Y-m-d',
                            value: [today.getFullYear(), today.getMonth() + 1, today.getDate()].join('-'),
                            onShow: function (ct) {
                                this.setOptions({
                                    minDate: startDate.replace(/[-]/g, '/'),
                                    maxDate: endDate.replace(/[-]/g, '/')
                                });
                            },
                            timepicker: false,
                            closeOnDateSelect: true
                        });

                        $('#product_auth2_start').datetimepicker({
                            onGenerate: function () {
                                $(this).css({ 'z-index': 99999 });
                            },
                            value: startDate,
                            format: 'Y-m-d',
                            onShow: function (ct) {
                                this.setOptions({
                                    minDate: startDate.replace(/[-]/g, '/'),
                                    maxDate: $('#product_auth2_end').val() ? $('#product_auth2_end').val().replace(/[-]/g, '/') : endDate.replace(/[-]/g, '/')
                                });
                            },
                            timepicker: false,
                            closeOnDateSelect: true
                        });

                        $('#product_auth2_end').datetimepicker({
                            onGenerate: function () {
                                $(this).css({ 'z-index': 99999 });
                            },
                            value: endDate,
                            format: 'Y-m-d',
                            onShow: function (ct) {
                                this.setOptions({
                                    minDate: $('#product_auth2_start').val() ? $('#product_auth2_start').val().replace(/[-]/g, '/') : startDate.replace(/[-]/g, '/'),
                                    maxDate: endDate.replace(/[-]/g, '/')
                                });
                            },
                            timepicker: false,
                            closeOnDateSelect: true
                        });
                        view.find('[name=product_data]:eq(0)').iCheck('check');
                        view.find('.product_date_mode select option:eq(0)').prop('selected', true);
                        view.find('.product_date_mode select').selectric('refresh').trigger('change');

                    },
                    complete: function () {
                        self.button('reset');
                        self.removeClass('process');
                    }
                })

            })

            var strJson = [];
            view.on('click', '.step03 .js_submit', function () {
                box.find('.step03')
                    .addClass('hide').end()
                    .find('.step04').removeClass('hide')
            });
            view.on('click', '.step04 .js_edit_date', function () {
                box.find('.step04')
                    .addClass('hide').end()
                    .find('.step03').removeClass('hide')
                $('.manage_auth_box .error').removeClass('error');
                $('.manage_auth_box .product_auth_num').val('');
                $('.manage_auth_box .product_icon').removeClass('checked');
            })
            view.on('click', '.step04 .js_submit', function () {
                if ($('.manage_auth_box .error').length > 0) {
                    return false;
                }
                strJson = [];
                var html = [];
                var eid = box.attr('EID'),
                    starttime = '',
                    endtime = '';
                var obj = $('.product_date_mode select');
                if (obj.val() == 'default') {
                    starttime = $('#product_auth1_start').val()
                    var now = new Date($('#product_auth1_start').val().replace(/[-]/g, '/'));
                    var monthChecked = $('[name=product_data]:checked').val(),
                        endtime = op.getEndDate(now, monthChecked);
                } else {
                    starttime = $('#product_auth2_start').val(),
                        endtime = $('#product_auth2_end').val();
                }
                var checkObj = $('.product_icon.checked');
                for (var i = 0; i < checkObj.length; i++) {
                    var ele = checkObj[i];
                    var _li = $(ele).closest('li');
                    var accreditCount = _li.find('.product_auth_num').val();
                    if (!Number(accreditCount)) {
                        continue;
                    }
                    var authAmount = accreditCount * alldayNum;
                    var obj = {
                        EID: eid,
                        productGuid: _li.attr('pGuid'),
                        starttime: starttime,
                        endtime: endtime,
                        accreditCount: accreditCount,
                        authAmount: authAmount
                    }
                    var _html = '<tr><td>' +
                        _li.find('.js_auth_name').text() +
                        '</td><td>' +
                        accreditCount +
                        '</td><td>' +
                        authAmount +
                        '</td></tr>';
                    strJson.push(obj);
                    html.push(_html);
                }
                if (!html.length) {
                    return false;
                }
                $('.js_auth_table tbody').html(html);
                $('.manage_auth_detail_obj').html('授权对象：<em>' + box.attr('oname') + '(' + box.attr('username') + ')</em>');
                $('.manage_auth_detail_date').html('有效期：(' + starttime + '至' + endtime + ') ' + alldayNum + '天');
                box.find('.step04')
                    .addClass('hide').end()
                    .find('.step05').removeClass('hide')
            })

            view.on('click', '.step05 .js_submit', function () {
                var self = $(this);
                if (self.hasClass('process')) {
                    return false;
                }
                self.button('loading');
                self.addClass('process');
                RsCore.ajax({
                    url: 'Authmanager/writeAuth',
                    data: { 'strJson': JSON.stringify(strJson) },
                    success: function () {
                        $('.step06 .manage_succ_msg').html('<p>恭喜您，企业“' + box.attr('oname') + '” <br/>产品授权成功！</p>');
                        box.find('.step05')
                            .addClass('hide').end()
                            .find('.step06').removeClass('hide');
                    },
                    complete: function () {
                        self.button('reset');
                        self.removeClass('process');
                        if (box.attr('auth') === 'true') {
                            box.find('.step06 .js_submit').val('完成')
                        } else {
                            box.find('.step06 .js_submit').val('继续创建用户')
                        }
                    }
                })
            })

            view.on('click', '.step06 .js_submit', function () {
                box.removeAttr('EID');
                box.removeAttr('username');
                box.removeAttr('oname');
                box.find('form:eq(0)')[0].reset();
                if (box.attr('auth') === 'true') {
                    box.modal('hide');
                } else {
                    box.find('.modal-body>div').addClass('hide').end().find('.step01').removeClass('hide');
                }
                box.removeAttr('auth');
                op.referData();
            })


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
        getAuthDetail: function () {
            RsCore.ajax({
                url: 'Enterprisemanager/getTotalNum',
                success: function (json) {
                    console.log(json);
                    $('.manage_auth')
                        .find('em:eq(0)').text(json['usersNum'])
                        .end().find('em:eq(1)').text(json['authNum'])
                        .end().find('em:eq(2)').text(json['notAuthNum'])
                        .end().find('em:eq(3)').text(json['soonExpireNum']);

                    $('.manage_info')
                        .find('em').text(json['authTotal'] - json['usersNum'])
                        .end().find('span').text(json['authTotal']);

                    if (json['authTotal'] <= json['usersNum']) {
                        $('.js_sq_info_box_show').addClass('disabled');
                    }
                }
            })
        },
        getSubInfoHtml: function (oname, username, json, offset) {
            var _cls = '', top;
            var table = $('.fixed-table-container');
            var tableH = table.height();
            var winH = $(window).height();
            var clientH = tableH / 2 > 310 ? 310 : tableH / 2;
            if (offset.top + clientH + 34 > winH) {
                _cls = 'up';
                top = offset.top - table.offset().top - clientH;
            } else {
                top = offset.top - table.offset().top + 34;
            }
            var html = [];
            html.push('<div class="manage_sub_info ' + _cls + '" style="top:' + top + 'px;height:' + clientH + 'px!important;"><i class="arrow"></i><span class="close"></span>');
            html.push('<div class="manage_sub_info_enter">' + oname + '(' + username + ')</div>');
            html.push('<div class="manage_sub_info_table"><table>');
            html.push('<tr><th style="border-left:0;">授权产品</th><th>授权点数</th><th>授权量(点&middot;天)</th><th>授权有效期</th></tr>');
            var result = {};
            for (var i = 0; i < json.length; i++) {
                var _da = json[i];
                var key = _da['startTime'] + '-' + _da['endTIme'];
                if (!result[key]) {
                    result[key] = [];
                }
                result[key].push(_da);
            }
            for (var i in result) {
                var res = result[i];
                var len = res.length;
                for (var j = 0; j < len; j++) {
                    var rs = res[j];
                    if (j === 0) {
                        var _time = rs['startTime'].split(' ')[0] + '至' + rs['endTIme'].split(' ')[0];
                        html.push('<tr><td>' + rs['name'] + '</td><td>' + rs['accreditCount'] + '</td><td>' + rs['authAmount'] + '</td><td style="border-left:1px solid #e0e0e0;" rowspan="' + len + '">' + _time + '</td></tr>');
                    } else {
                        html.push('<tr><td>' + rs['name'] + '</td><td>' + rs['accreditCount'] + '</td><td>' + rs['authAmount'] + '</td></tr>');
                    }
                }
            }
            html.push('</table></div>');
            html.push('</div>');
            return html.join('');
        },
        getSubInfoHtml2: function (json) {
            var html = [];
            var result = {};
            for (var i = 0; i < json.length; i++) {
                var _da = json[i];
                var key = _da['startTime'] + '-' + _da['endTIme'];
                if (!result[key]) {
                    result[key] = [];
                }
                result[key].push(_da);
            }
            for (var i in result) {
                var res = result[i];
                var len = res.length;
                for (var j = 0; j < len; j++) {
                    var rs = res[j];
                    if (j === 0) {
                        var _time = rs['startTime'].split(' ')[0] + '至' + rs['endTIme'].split(' ')[0];
                        html.push('<tr><td>' + rs['name'] + '</td><td>' + rs['accreditCount'] + '</td><td>' + rs['authAmount'] + '</td><td style="border-left:1px solid #e0e0e0;" rowspan="' + len + '">' + _time + '</td></tr>');
                    } else {
                        html.push('<tr><td>' + rs['name'] + '</td><td>' + rs['accreditCount'] + '</td><td>' + rs['authAmount'] + '</td></tr>');
                    }
                }
            }
            return html.join('');
        },
        initEvent: function (view) {

            /*日志查询*/

            $(window).on('resize.log', function () {
                op.resizeTable(view);
            });

            op.getAuthDetail();


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
                view.find('#tbClient').bootstrapTable('refresh', { query: op.tempParams });
            });

            view.on('click', '.js_btn_search', function () {
                op['get_' + op._type](op.tempParams, view);
                view.find('#tbClient').bootstrapTable('chOffset', 0);
                view.find('#tbClient').bootstrapTable('refresh', { query: op.tempParams });
            });

            view.on('change', '#timeStart,#timeEnd', function () {
                op['get_' + op._type](op.tempParams, view);
                view.find('#tbClient').bootstrapTable('chOffset', 0);
                view.find('#tbClient').bootstrapTable('refresh', { query: op.tempParams });
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

            view.on('click', '.manage_sub_info .close', function () {
                $(this).closest('.manage_sub_info').remove();
            })

            view.on('blur', '.js_userInfo_input', function () {
                var userInfo = $('.js_userInfo');
                var form = view.find('.js_userInfo form');
                var userName = form.find('#UserName');
                var oName = form.find('#OName');
                var phoneNo = form.find('#PhoneNo');
                var email = form.find('#EMail');
                if (userName != userInfo.attr('UserName') | oName != userInfo.attr('OName') |
                    phoneNo != userInfo.attr('PhoneNo') | email != userInfo.attr('EMail')) {
                    document.getElementById("save_userInfo").disabled = false;

                } else {
                    document.getElementById("save_userInfo").disabled = true;
                }

            });

            view.find('.js_userInfo form:eq(0)').validate({
                rules: {
                    UserName: { required: true, checkName: true, nospace: true },
                    OName: { required: true, checkOName: true, nospace: true },
                    PhoneNo: { required: true, phone: true },
                    EMail: { email: true }
                },
                messages: {
                    UserName: { required: '请输入用户名', checkName: '用户名为数字、字母、下划线且长度为3~16位', nospace: '不能包含空格' },
                    OName: { required: '请输入企业名称', checkOName: '企业名为数字、字母、汉字下划线且长度为3~20位', nospace: '不能包含空格' },
                    PhoneNo: { required: '请输入联系电话', phone: '手机号或座机号格式错误' },
                    EMail: { email: '邮箱格式错误' }
                },

                errorElement: 'span',
                errorPlacement: function (error, element) {
                    var errLabel = element.closest('.step_form');
                    errLabel.append(error);
                }
            })

            view.on('click', '#save_userInfo', function () {
                var userInfo = $('.js_userInfo');
                var form = userInfo.find('form:eq(0)');
                if (!form.valid()) {
                    return false;
                }
                var self = $(this);
                if (self.hasClass('process')) {
                    return false;
                } else {
                    self.addClass('process');
                    self.button('loading');
                }
                RsCore.ajax({
                    url: 'Enterprisemanager/editErprise',
                    data: {
                        EID: userInfo.attr('eid'),
                        UserName: userInfo.find('[name=UserName]').val(),
                        EMail: userInfo.find('[name=EMail]').val(),
                        PhoneNo: userInfo.find('[name=PhoneNo]').val(),
                        OName: userInfo.find('[name=OName]').val()
                    },
                    success: function (json) {
                        $('.js_userInfo').modal('hide');
                        RsCore.msg.warn('修改成功');
                        op.referData();
                    },
                    complete: function () {
                        self.removeClass('process');
                        self.button('reset');
                    }
                });
            });

            view.on('click', '#del_enter', function () {
                var self = $(this);
                if (self.hasClass('process')) {
                    return false;
                } else {
                    self.addClass('process');
                    self.button('loading');
                }
                var eid = $('.js_del_enter').attr('eid');
                RsCore.ajax({
                    url: 'Enterprisemanager/delEnterprise',
                    data: { EID: eid },
                    success: function (json) {
                        $('.js_del_enter').modal('hide');
                        RsCore.msg.warn('删除成功');
                        op.referData();
                    }
                })
            })

            view.find('.js_modify_pwds form').validate({
                rules: {
                    pwd: { required: true, minlength: 6, passwordStr: true, nospace: true },
                    rpwd: { required: true, minlength: 6, equalTo: '#modiy_pwd' },
                },
                messages: {
                    pwd: { required: '请设置密码', minlength: '长度最少6位', passwordStr: '密码强度低，(大小写字母，数字，特殊符号)', nospace: '不能包含空格' },
                    rpwd: { required: '请再次输入密码', minlength: '长度最少6位', equalTo: '两次密码不一样' },
                },
                errorElement: 'span',
                errorPlacement: function (error, element) {
                    var errLabel = element.closest('.step_form');
                    errLabel.append(error);
                }
            })

            view.on('click', '#modify_pwd', function () {
                var form = view.find('.js_modify_pwds form');
                if (!form.valid()) {
                    return false;
                }
                var eid = $('.js_modify_pwds').attr('eid');
                RsCore.ajax({
                    url: 'Enterprisemanager/passEdit',
                    data: {
                        EID: eid,
                        passwd: form.find('[name=pwd]').val(),
                        repasswd: form.find('[name=rpwd]').val()
                    },
                    success: function (json) {
                        $('.js_modify_pwds').modal('hide');
                        RsCore.msg.warn('密码修改成功');
                    }
                })
            })
        }

    };
    return {
        container: '.c-page-content',
        render: function (container) {
            document.title = '授权管理-产品授权';
            op.init(container, null, true);

        },
        destroy: function () {
            op.destroyHash();
            $(this.container).find('#tbClient').colResizable({
                'disable': true
            });
            $(window).off('resize.log');
            $(this.container).off().empty();
        }
    };
});