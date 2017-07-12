define(function(require) {
    var tpl = require('text!virus/log.html');
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
            xav_virus: {
                viewtype: '', //视图类型   xav,ep,detail
                objtype: '', //组织范围 0:eid,1:groupid,2:sguid
                objid: '', //企业id或组id或客户端id 
                queryconditions: { //查询条件
                    begintime: '',
                    endtime: '',
                    searchkey: '',
                    searchtype: '',
                    state: '',
                    treatmethod: '',
                    taskname: ''
                },
                paging: { //分页信息
                    sort: 'virusCount',
                    order: 1,
                    offset: 0,
                    limit: 20
                }
            },
            xav_scanevent: {
                viewtype: '', //视图类型   xav,ep,detail
                objtype: '', //组织范围 0:eid,1:groupid,2:sguid
                objid: '', //企业id或组id或客户端id 
                queryconditions: { //查询条件
                    begintime: '',
                    endtime: '',
                    searchkey: '',
                    searchtype: '',
                    state: '',
                    taskname: ''
                },
                paging: { //分页信息
                    sort: 'starttime',
                    order: 1,
                    offset: 0,
                    limit: 20
                }
            },
            xav_sysdef: {
                viewtype: '', //视图类型   xav,ep,detail
                objtype: '', //组织范围 0:eid,1:groupid,2:sguid
                objid: '', //企业id或组id或客户端id 
                queryconditions: { //查询条件
                    begintime: '',
                    endtime: '',
                    searchkey: '',
                    searchtype: '',
                    deftype: '',
                    result: ''
                },
                paging: { //分页信息
                    sort: 'time',
                    order: 1,
                    offset: 0,
                    limit: 20
                }
            },
            xav_botauditlog: {
                viewtype: '', //视图类型   xav,ep,detail
                objtype: '', //组织范围 0:eid,1:groupid,2:sguid
                objid: '', //企业id或组id或客户端id 
                queryconditions: { //查询条件
                    begintime: '',
                    endtime: '',
                    searchkey: '',
                    searchtype: '',
                    type: ''
                },
                paging: { //分页信息
                    sort: 'time',
                    order: 1,
                    offset: 0,
                    limit: 20
                }
            }
        },
        virusclass: ['可疑', '病毒', '蠕虫', 'rookit', '广告', '木马', '后门', '壳'],
        tasknames: {
            'quickscan': '快速查杀',
            'allscan': '全盘查杀',
            'customscan': '自定义',
            'filemon': '文件监控',
            'mailmon': '邮件监控'
        },
        treatmethod: {
            '0': '暂未处理',
            '1': '忽略',
            '2': '删除',
            '16': '清除',
            '32': '信任',
            '64': '上报'
        },
        state: ['未处理', '成功', '处理失败', '备份失败', '处理中'],
        scanevent_state: ['空闲', '启动中', '运行中', '已暂停', '停止中', '扫描被终止', '扫描完成', '扫描结束'],
        columns: {
            xav_virus: {
                '0': [{
                    field: 'virusname',
                    title: '病毒名称',
                    align: 'left',
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }, {
                    field: 'virusclass',
                    title: '病毒分类',
                    align: 'center',
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<di>' + op.virusclass[value] + '</div>';
                    }
                }, {
                    field: 'virusCount',
                    title: '病毒数',
                    align: 'center',
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }, {
                    field: 'ClientCount',
                    title: '染毒客户端',
                    align: 'center',
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }],
                '1': [{
                    field: 'computername',
                    title: '终端名称',
                    align: 'left',
                    sortable: true,
                    formatter: function(value, row, index) {
                        var name = util_b.getComputerName_Overview(row);
                        var osType = util_b.getSys_Overview(row);
                        var state = util_b.getOnlineState_Overview(row);
                        var title = state == "drop" ? "已卸载" : "";
                        return '<a class="overview-ico" href="javascript:;" da-toggle="#' + row.sguid + '"><em class="' + osType + ' ' + state + '" title="' + title + '">&nbsp;</em>' + (name ? name : '未知') + '</a>';
                    }
                }, {
                    field: 'ip',
                    title: 'IP地址',
                    align: 'center',
                    sortable: true,
                    sorter: util_b.ipSort,
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }, {
                    field: 'virusCount',
                    title: '病毒数',
                    align: 'center',
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }],
                '2': [{
                    field: 'findtime',
                    title: '时间',
                    align: 'left',
                    sortable: true,
                    width: '140px',
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }, {
                    field: 'computername',
                    title: '终端名称',
                    align: 'left',
                    sortable: true,
                    formatter: function(value, row, index) {
                        var name = util_b.getComputerName_Overview(row);
                        var osType = util_b.getSys_Overview(row);
                        var state = util_b.getOnlineState_Overview(row);
                        var title = state == "drop" ? "已卸载" : "";
                        return '<a class="overview-ico" href="javascript:;" da-toggle="#' + row.sguid + '"><em class="' + osType + ' ' + state + '" title="' + title + '">&nbsp;</em>' + (name ? name : '未知') + '</a>';
                    }
                }, {
                    field: 'ip',
                    title: 'IP地址',
                    align: 'center',
                    sortable: true,
                    sorter: util_b.ipSort,
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }, {
                    field: 'filepath',
                    title: '染毒文件',
                    align: 'left',
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }, {
                    field: 'virusclass',
                    title: '威胁类型',
                    align: 'center',
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + op.virusclass[value] + '</div>';
                    }
                }, {
                    field: 'virusname',
                    title: '病毒名',
                    align: 'left',
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }, {
                    field: 'taskname',
                    title: '来源',
                    align: 'center',
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + op.tasknames[value] + '</div>';
                    }
                }, {
                    field: 'treatmethod',
                    title: '状态',
                    align: 'center',
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (row.state == '0') {
                            return '<div>未处理</div>';
                        }
                        if (row.state == '1') { //成功
                            if (row.treatmethod == '1') {
                                return '<div>忽略成功</div>';
                            }
                            if (row.treatmethod == '2') {
                                return '<div>删除成功</div>';
                            }
                            if (row.treatmethod == '16') {
                                return '<div>清除成功</div>';
                            }
                            if (row.treatmethod == '32') {
                                return '<div>信任成功</div>';
                            }

                        }
                        if (row.state == '2') { //处理失败
                            if (row.treatmethod == '1') {
                                return '<div>忽略失败</div>';
                            }
                            if (row.treatmethod == '2') {
                                return '<div>删除失败</div>';
                            }
                            if (row.treatmethod == '16') {
                                return '<div>清除失败</div>';
                            }
                            if (row.treatmethod == '32') {
                                return '<div>信任失败</div>';
                            }

                        }
                        if (row.state == '3') {
                            return '<div>备份失败</div>';
                        }
                        if (row.state == '4') { //处理中
                            return '<div>处理中</div>';
                        }

                    }
                }]
            },
            xav_scanevent: {
                '0': [{
                    field: 'computername',
                    title: '终端名称',
                    align: 'left',
                    sortable: true,
                    formatter: function(value, row, index) {
                        var name = util_b.getComputerName_Overview(row);
                        var osType = util_b.getSys_Overview(row);
                        var state = util_b.getOnlineState_Overview(row);
                        var title = state == "drop" ? "已卸载" : "";
                        return '<a class="overview-ico" href="javascript:;" da-toggle="#' + row.sguid + '"><em class="' + osType + ' ' + state + '" title="' + title + '">&nbsp;</em>' + (name ? name : '未知') + '</a>';
                    }
                }, {
                    field: 'ip',
                    title: 'IP地址',
                    align: 'center',
                    sortable: true,
                    sorter: util_b.ipSort,
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }, {
                    field: 'starttime',
                    title: '开始时间',
                    align: 'center',
                    sortable: true,
                    width: '140px',
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }, {
                    field: 'appid',
                    title: '事件来源',
                    align: 'center',
                    sortable: true,
                    width: '140px',
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        var type = ['用户发起', '管理员命令', '定时器发起'];
                        return '<div>' + type[value] + '</div>';
                    }
                }, {
                    field: 'taskname',
                    title: '扫描类型',
                    align: 'center',
                    sortable: true,
                    formatter: function(value, row, idx) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + op.tasknames[value] + '</div>';
                    }
                }, {
                    field: 'state',
                    title: '状态',
                    align: 'center',
                    sortable: true,
                    formatter: function(value, row, idx) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + op.scanevent_state[value] + '</div>';
                    }
                }, {
                    field: 'scancount',
                    title: '共扫描',
                    align: 'center',
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }, {
                    field: 'viruscount',
                    title: '发现威胁',
                    align: 'center',
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }, {
                    field: 'treatedcount',
                    title: '已处理',
                    align: 'center',
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }, {
                    field: 'runtime',
                    title: '扫描用时',
                    align: 'center',
                    sortable: true,
                    width: '140px',
                    formatter: function(value, row, idx) {
                        var num = Number(value);
                        var H = ~~(num / (60 * 60));
                        H = ('' + H).length == 1 ? '0' + H : H;
                        num = num % (60 * 60);
                        var M = ~~(num / 60);
                        M = ('' + M).length == 1 ? '0' + M : M;
                        var S = num % 60;
                        S = ('' + S).length == 1 ? '0' + S : S;
                        return '<div>' + [H, M, S].join(':') + '</div>';
                    }
                }]
            },
            xav_sysdef: {
                '0': [{
                    field: 'computername',
                    title: '终端名称',
                    align: 'left',
                    sortable: true,
                    formatter: function(value, row, index) {
                        var name = util_b.getComputerName_Overview(row);
                        var osType = util_b.getSys_Overview(row);
                        var state = util_b.getOnlineState_Overview(row);
                        var title = state == "drop" ? "已卸载" : "";
                        return '<a class="overview-ico" href="javascript:;" da-toggle="#' + row.sguid + '"><em class="' + osType + ' ' + state + '" title="' + title + '">&nbsp;</em>' + (name ? name : '未知') + '</a>';
                    }
                }, {
                    field: 'ip',
                    title: 'IP地址',
                    align: 'center',
                    sortable: true,
                    sorter: util_b.ipSort,
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }, {
                    field: 'fxno',
                    title: '拦截风险数',
                    align: 'center',
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }, {
                    field: 'time',
                    title: '最近发生时间',
                    align: 'center',
                    sortable: true,
                    width: '140px',
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }],
                '1': [{
                    field: 'description',
                    title: '项目名称',
                    align: 'left',
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }, {
                    field: 'fxno',
                    title: '风险数',
                    align: 'center',
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }, {
                    field: 'sno',
                    title: '影响客户端数',
                    align: 'center',
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }, {
                    field: 'time',
                    title: '最近发生时间',
                    align: 'center',
                    sortable: true,
                    width: '140px',
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }],
                '2': [{
                    field: 'computername',
                    title: '终端名称',
                    align: 'left',
                    sortable: true,
                    formatter: function(value, row, index) {
                        var name = util_b.getComputerName_Overview(row);
                        var osType = util_b.getSys_Overview(row);
                        var state = util_b.getOnlineState_Overview(row);
                        var title = state == "drop" ? "已卸载" : "";
                        return '<a class="overview-ico" href="javascript:;" da-toggle="#' + row.sguid + '"><em class="' + osType + ' ' + state + '" title="' + title + '">&nbsp;</em>' + (name ? name : '未知') + '</a>';
                    }
                }, {
                    field: 'ip',
                    title: 'IP地址',
                    align: 'center',
                    sortable: true,
                    sorter: util_b.ipSort,
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }, {
                    field: 'time',
                    title: '拦截时间',
                    align: 'left',
                    sortable: true,
                    width: '140px',
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }, {
                    field: 'result',
                    title: '处理结果',
                    align: 'left',
                    sortable: true,
                    formatter: function(value, row, index) {
                        var result = ['', '允许', '阻止', '永久允许', '永久阻止', '允许一次', '阻止一次'];
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + result[value] + '</div>';
                    }
                }, {
                    field: 'deftype',
                    title: '防护类型',
                    align: 'left',
                    sortable: true,
                    formatter: function(value, row, index) {
                        var deftype = ['', '文件防护', '注册表防护', '进程防护', '系统防护', '系统防护'];
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + deftype[value] + '</div>';
                    }
                }, {
                    field: 'source',
                    title: '攻击来源',
                    align: 'left',
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }, {
                    field: 'target',
                    title: '攻击目标',
                    align: 'left',
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }, {
                    field: 'action',
                    title: '攻击动作',
                    align: 'left',
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }, {
                    field: 'oldvalue',
                    title: '更改前值',
                    align: 'left',
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }, {
                    field: 'newvalue',
                    title: '更改后值',
                    align: 'left',
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }]
            },
            xav_botauditlog: {
                '0': [{
                    field: 'computername',
                    title: '终端名称',
                    align: 'left',
                    sortable: true,
                    formatter: function(value, row, index) {
                        var name = util_b.getComputerName_Overview(row);
                        var osType = util_b.getSys_Overview(row);
                        var state = util_b.getOnlineState_Overview(row);
                        var title = state == "drop" ? "已卸载" : "";
                        return '<a class="overview-ico" href="javascript:;" da-toggle="#' + row.sguid + '"><em class="' + osType + ' ' + state + '" title="' + title + '">&nbsp;</em>' + (name ? name : '未知') + '</a>';
                    }
                }, {
                    field: 'ip',
                    title: 'IP地址',
                    align: 'center',
                    sortable: true,
                    sorter: util_b.ipSort,
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }, {
                    field: 'fxno',
                    title: '风险数',
                    align: 'center',
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }, {
                    field: 'time',
                    title: '最近发生时间',
                    align: 'center',
                    sortable: true,
                    width: '140px',
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }],
                '1': [{
                    field: 'description',
                    title: '风险操作',
                    align: 'left',
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }, {
                    field: 'fxno',
                    title: '发生次数',
                    align: 'center',
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }, {
                    field: 'sno',
                    title: '涉及终端数',
                    align: 'center',
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }, {
                    field: 'time',
                    title: '最近发生时间',
                    align: 'center',
                    sortable: true,
                    width: '140px',
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }],
                '2': [{
                    field: 'computername',
                    title: '终端名称',
                    align: 'left',
                    sortable: true,
                    formatter: function(value, row, index) {
                        var name = util_b.getComputerName_Overview(row);
                        var osType = util_b.getSys_Overview(row);
                        var state = util_b.getOnlineState_Overview(row);
                        var title = state == "drop" ? "已卸载" : "";
                        return '<a class="overview-ico" href="javascript:;" da-toggle="#' + row.sguid + '"><em class="' + osType + ' ' + state + '" title="' + title + '">&nbsp;</em>' + (name ? name : '未知') + '</a>';
                    }
                }, {
                    field: 'ip',
                    title: 'IP地址',
                    align: 'center',
                    sortable: true,
                    sorter: util_b.ipSort,
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }, {
                    field: 'time',
                    title: '拦截时间',
                    align: 'left',
                    sortable: true,
                    width: '140px',
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }, {
                    field: 'type',
                    title: '防护类型',
                    align: 'left',
                    sortable: true,
                    formatter: function(value, row, index) {
                        var type = ['IE浏览器', '办公软件'];
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + type[value] + '</div>';
                    }
                }, {
                    field: 'srcprocpath',
                    title: '攻击来源',
                    align: 'left',
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }, {
                    field: 'target',
                    title: '攻击目标',
                    align: 'left',
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }, {
                    field: 'operation',
                    title: '攻击动作',
                    align: 'left',
                    sortable: true,
                    formatter: function(value, row, index) {
                        var operation = ['运行自释放文件', '运行受限程序', '篡改他进程的内存', '在其他进程中启动线程', '改写自启动项目', '以写方式打开系统可执行文件', '释放驱动程序', '注册系统服务,误报太多去掉', '加载自释放动态库'];
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + operation[value] + '</div>';
                    }
                }, {
                    field: 'extInfo',
                    title: '补充信息',
                    align: 'left',
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (value == undefined) {
                            return '';
                        }
                        return '<div>' + value + '</div>';
                    }
                }]
            }
        },
        tempParams: null,
        /*暂存查询条件*/
        _type: '',
        /*暂存查询日志类型*/
        init: function(container, type, first) {
            op.tempParams = null;
            var view = $(container);
            var html = '';
            var params = getUrlSearchQuerys();

            util_b.blackShow(params['g']);

            op._type = type || params['l_xavType'] || 'xav_virus';
            var dataobj = {};
            dataobj[op._type] = true;
            html = mustache.render(tpl, dataobj);
            view.html(html);


            var showSearch = params['topen'] && params['topen'] == 1 ? true : false;
            var idx = params['l_view'] ? params['l_view'] : '0';
            op.tempParams = op.query[op._type];
            op.tempParams['viewtype'] = $('#custom-type a[data-type=' + idx + ']').attr('val');
            $('#custom-type a[data-type=' + idx + ']').addClass('active').siblings().removeClass('active');
            op.tempParams['objtype'] = params['c'] ? '2' : params['g'] && params['g'] == '0' ? '0' : params['g'] && params['g'] == '-1' ? '-1' : '1';
            op.tempParams['objid'] = params['c'] ? params['c'] : params['g'] && params['g'] != '0' ? params['g'] : RsCore.cache.group.eid;


            /*参数*/

            if (first) {
                this.getParams(view, op._type, params);
            }
            this['get_' + op._type](op.tempParams, view);

            this.initTable(view, op.columns[op._type][idx], showSearch, first);
            this.initEvent(view);
        },
        getParams: function(view, type, params) {
            if (type == 'xav_virus') {
                if (params['l_time']) {
                    view.find('.js_date a').removeClass('active');
                    view.find('.js_date [val=' + params['l_time'] + ']').addClass('active');
                    if (params['l_time'] == 'special') {
                        params['l_startTime'] && view.find('#timeStart').val(params['l_startTime']).prop('disabled', false);
                        params['l_endTime'] && view.find('#timeEnd').val(params['l_endTime']).prop('disabled', false);
                    }
                }

                if (params['l_task']) {
                    view.find('.js_task a').removeClass('active');
                    view.find('.js_task [val=' + params['l_task'] + ']').addClass('active');
                }

                if (params['l_treatmethod']) {
                    view.find('.js_state a').removeClass('active');
                    view.find('.js_state [val=' + params['l_treatmethod'] + ']').addClass('active');
                }

            }
            if (type == 'xav_scanevent') {
                if (params['l_time']) {
                    view.find('.js_date a').removeClass('active');
                    view.find('.js_date [val=' + params['l_time'] + ']').addClass('active');
                    if (params['l_time'] == 'special') {
                        params['l_startTime'] && view.find('#timeStart').val(params['l_startTime']).prop('disabled', false);
                        params['l_endTime'] && view.find('#timeEnd').val(params['l_endTime']).prop('disabled', false);
                    }
                }

                if (params['l_task']) {
                    view.find('.js_task a').removeClass('active');
                    view.find('.js_task [val=' + params['l_task'] + ']').addClass('active');
                }

                if (params['l_state']) {
                    view.find('.js_state a').removeClass('active');
                    view.find('.js_state [val=' + params['l_state'] + ']').addClass('active');
                }

            }
            if (type == 'xav_sysdef') {
                if (params['l_time']) {
                    view.find('.js_date a').removeClass('active');
                    view.find('.js_date [val=' + params['l_time'] + ']').addClass('active');
                    if (params['l_time'] == 'special') {
                        params['l_startTime'] && view.find('#timeStart').val(params['l_startTime']).prop('disabled', false);
                        params['l_endTime'] && view.find('#timeEnd').val(params['l_endTime']).prop('disabled', false);
                    }
                }

                if (params['l_def']) {
                    view.find('.js_def a').removeClass('active');
                    view.find('.js_def [val=' + params['l_def'] + ']').addClass('active');
                }

                if (params['l_resulte']) {
                    view.find('.js_result a').removeClass('active');
                    view.find('.js_result [val=' + params['l_resulte'] + ']').addClass('active');
                }

            }
            if (type == 'xav_botauditlog') {
                if (params['l_time']) {
                    view.find('.js_date a').removeClass('active');
                    view.find('.js_date [val=' + params['l_time'] + ']').addClass('active');
                    if (params['l_time'] == 'special') {
                        params['l_startTime'] && view.find('#timeStart').val(params['l_startTime']).prop('disabled', false);
                        params['l_endTime'] && view.find('#timeEnd').val(params['l_endTime']).prop('disabled', false);
                    }
                }

                if (params['l_type']) {
                    view.find('.js_type a').removeClass('active');
                    view.find('.js_type [val=' + params['l_type'] + ']').addClass('active');
                }

            }

            if (params['l_stype']) {
                view.find('.js_searchType option[value=' + params['l_stype'] + ']').prop('selected', true);
            }
            if (params['l_stxt']) {
                view.find('.js_searchKey').val(params['l_stxt']);
            }
        },
        setParams: function(view, type, params) {
            var _params = {};
            if (type == "xav_virus") {
                _params['l_startTime'] = params.queryconditions.begintime;
                _params['l_endTime'] = params.queryconditions.endtime;
                _params['l_task'] = params.queryconditions.taskname;
                _params['l_state'] = params.queryconditions.state;
                _params['l_treatmethod'] = params.queryconditions.treatmethod;
            }
            if (type == "xav_scanevent") {
                _params['l_startTime'] = params.queryconditions.begintime;
                _params['l_endTime'] = params.queryconditions.endtime;
                _params['l_task'] = params.queryconditions.taskname;
                _params['l_state'] = params.queryconditions.state;
            }
            if (type == "xav_sysdef") {
                _params['l_startTime'] = params.queryconditions.begintime;
                _params['l_endTime'] = params.queryconditions.endtime;
                _params['l_def'] = params.queryconditions.deftype;
                _params['l_resulte'] = params.queryconditions.resulte;
            }
            if (type == "xav_botauditlog") {
                _params['l_startTime'] = params.queryconditions.begintime;
                _params['l_endTime'] = params.queryconditions.endtime;
                _params['l_type'] = params.queryconditions.type;
            }

            _params['l_time'] = view.find('.js_date a.active').attr('val');

            _params['l_stype'] = params.queryconditions.searchtype;
            _params['l_stxt'] = params.queryconditions.searchkey;

            _params['l_limit'] = params.paging.limit;
            _params['l_offset'] = params.paging.offset;
            _params['l_order'] = params.paging.order;
            _params['l_sort'] = params.paging.sort;

            _params['l_xavType'] = type;

            var _params = $.extend({}, getUrlSearchQuerys(), _params);
            var path = window.location.hash.split('?')[0];
            window.location.hash = path + '?' + params2str(_params);

        },
        get_xav_virus: function(params, view) {
            var time = this.getDate(view);
            params.queryconditions.begintime = time.begintime;
            params.queryconditions.endtime = time.endtime;
            params.queryconditions.searchkey = view.find('.js_searchKey').val();
            params.queryconditions.searchtype = view.find('.js_searchType').val();
            var val = view.find('.js_state .active').attr('val');
            if (val == 4) {
                params.queryconditions.state = 4;
                params.queryconditions.treatmethod = -1;
            } else {
                params.queryconditions.state = -1;
                params.queryconditions.treatmethod = val;
            }
            params.queryconditions.taskname = view.find('.js_task .active').attr('val');
            return params;
        },
        get_xav_scanevent: function(params, view) {
            var time = this.getDate(view);
            params.queryconditions.begintime = time.begintime;
            params.queryconditions.endtime = time.endtime;
            params.queryconditions.searchkey = view.find('.js_searchKey').val();
            params.queryconditions.searchtype = view.find('.js_searchType').val();
            params.queryconditions.state = view.find('.js_state .active').attr('val');
            params.queryconditions.taskname = view.find('.js_task .active').attr('val');
            return params;
        },
        get_xav_sysdef: function(params, view) {
            var time = this.getDate(view);
            params.queryconditions.begintime = time.begintime;
            params.queryconditions.endtime = time.endtime;
            params.queryconditions.searchkey = view.find('.js_searchKey').val();
            params.queryconditions.searchtype = view.find('.js_searchType').val();
            params.queryconditions.deftype = view.find('.js_def .active').attr('val');
            params.queryconditions.result = view.find('.js_result .active').attr('val');
            return params;
        },
        get_xav_botauditlog: function(params, view) {
            var time = this.getDate(view);
            params.queryconditions.begintime = time.begintime;
            params.queryconditions.endtime = time.endtime;
            params.queryconditions.searchkey = view.find('.js_searchKey').val();
            params.queryconditions.searchtype = view.find('.js_searchType').val();
            params.queryconditions.type = view.find('.js_type .active').attr('val');
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
            var customSearchBoxOpen = showSearch || false;
            var urls = {
                'xav_virus': 'Xavlog/getVirusList',
                'xav_scanevent': 'Xavlog/getVirusScan',
                'xav_sysdef': 'Xavlog/sysdef',
                'xav_botauditlog': 'Xavlog/botauditlog'
            };
            var _params = getUrlSearchQuerys();
            var height = $('.log-content').height();
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
                    op.tempParams.paging.order = params.order == "asc" ? 0 : 1;
                    op.tempParams.paging.limit = params.limit;
                    op.tempParams.paging.offset = params.offset;

                    op.setParams(view, op._type, op.tempParams);

                    var pm = $.extend(true,{},op.tempParams);

                    if (pm.queryconditions.endtime) {
                        var da = new Date(pm.queryconditions.endtime).getTime();
                        da += 24 * 60 * 60 * 1000;
                        pm.queryconditions.endtime = op.getFullDate(da);
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
                //showExport: true,
                showCustomSearch: true,
                customSearchBoxOpen: customSearchBoxOpen,
                customType: '#custom-type',
                customSearchBox: '#customSearchBox',
                pagination: true,
                sidePagination: 'server',
                showPaginationSwitch: false,
                clickToSelect: false,
                height: height,
                showHeader: true,
                sortOrder: 'desc',
                onLoadError: function(status) {
                    RsCore.reqTableError(status);
                },
                onLoadSuccess: function() {
                    op.resizeTable(view);
                    /*时间范围*/
                    $('#timeStart').datetimepicker({
                        format: "Y-m-d",
                        onShow: function(ct) {
                            this.setOptions({
                                maxDate: $('#timeEnd').val() ? $('#timeEnd').val().replace(/[-]/g, '/') : false
                            });
                        },
                        timepicker: false,
                        closeOnDateSelect: true
                    });

                    $('#timeEnd').datetimepicker({
                        format: "Y-m-d",
                        onShow: function(ct) {
                            this.setOptions({
                                minDate: $('#timeStart').val() ? $('#timeStart').val().replace(/[-]/g, '/') : false
                            });
                        },
                        timepicker: false,
                        closeOnDateSelect: true
                    });
                }
            });
            first = false;

        },
        resizeTable: function(view) {
            var height = $('.log-content').height();
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


            /*视图切换*/
            view.on('click', '#custom-type a', function() {
                var that = $(this);
                that.addClass('active').siblings().removeClass('active');
                var type = that.attr('data-type');
                view.find('#tbClient').bootstrapTable('destroy');
                var params = getUrlSearchQuerys();
                var showSearch = params['topen'] && params['topen'] == 1 ? true : false;
                var logType = $('#custom-toolbar .active a').attr('da-toggle');
                var viewType = that.attr('val');
                op.tempParams.viewtype = viewType;
                if (logType == 'xav_virus') {
                    if (viewType == 'detail') {
                        op.query[logType].paging.sort = 'findtime';
                        op.query[logType].paging.order = 1;
                    }
                    if (viewType == 'ep') {
                        op.query[logType].paging.sort = 'virusCount';
                        op.query[logType].paging.order = 1;
                    }
                    if (viewType == 'xav') {
                        op.query[logType].paging.sort = 'virusCount';
                        op.query[logType].paging.order = 1;
                    }
                }
                if (logType == 'xav_sysdef') {
                    op.query[logType].paging.sort = 'time';
                    op.query[logType].paging.order = 1;
                }
                if (logType == 'xav_botauditlog') {
                    op.query[logType].paging.sort = 'time';
                    op.query[logType].paging.order = 1;
                }
                op.initTable(view, op.columns[logType][type], showSearch);
                var path = window.location.hash.split('?')[0];
                params['l_view'] = type;
                window.location.hash = path + '?' + params2str(params);
            });

            /*日志类型切换*/
            view.on('click', '#custom-toolbar .nav li', function() {
                var that = $(this);
                that.addClass('active').siblings().removeClass('active');
                var type = that.find('a').attr('da-toggle');

                view.find('#tbClient').trigger('destroy');
                $(window).off('resize.log');

                op.destroyHash();
                view.off().empty();
                op.init(view, type);
                // that.addClass('active').siblings().removeClass('active');
                // view.find('#tbClient').bootstrapTable('destroy');
                // op.initTable(view, op.columns[type][0])
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

                op['get_' + op._type](op.tempParams, view);
                view.find('#tbClient').bootstrapTable('chOffset', 0);
                view.find('#tbClient').bootstrapTable('refresh', { query: op.tempParams });
            });
            view.on('change', '#timeStart,#timeEnd', function() {
                op['get_' + op._type](op.tempParams, view);
                view.find('#tbClient').bootstrapTable('chOffset', 0);
                view.find('#tbClient').bootstrapTable('refresh', { query: op.tempParams });
            });
            view.on('click', '.js_btn_search', function() {
                op['get_' + op._type](op.tempParams, view);
                view.find('#tbClient').bootstrapTable('chOffset', 0);
                view.find('#tbClient').bootstrapTable('refresh', { query: op.tempParams });
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
        render: function(container, paramStr) {
            document.title = "病毒查杀-日志";
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