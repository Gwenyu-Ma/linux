require.config({
    urlArgs: 'ver=' + (new Date()).getTime(),
    baseUrl: '/public/view',
    paths: {
        js: '../js',
        text: '../dep/require/text',
        css: '../dep/require/css',
        mustache: '../dep/mustache/mustache',
        hashchange: '../dep/hashchange/hashchange',
        slimscroll: '../dep/slimscroll/jquery.slimscroll',
        table: '../dep/table/bootstrap-table',
        selectric: '../dep/selectric/jquery.selectric',
        select: '../dep/bootstrap-select/bootstrap-select',
        sidemenu: '../js/plugin/sidemenu/sidemenu',
        echarts: '../dep/echarts',
        echartsExtend: '../js/plugin/echartsExtend/echartsExtend',
        echarts3: '../dep/echarts3/echarts',
        form: '../../dep/jquery.form',
        jqueryForm: '../../dep/upload/jquery.form',
        validation: '../../dep/jquery-validation/jquery.validate',
        datetimepicker: '../dep/datetimepicker/jquery.datetimepicker',
        dep: '../dep'
    },
    shim: {},
    waitSeconds: 0
});
require(['js/router', 'js/index'], function(router, index) {
    // 设置路由映射
    router.map({
        '': {
            container: '.rs-page-container',
            defaultPage: 'home'
        },
        'home': {
            view: 'home'
        },
        'homeTest': {
            view: 'homeTest'
        },
        'homeDemo': {
            view: 'homeDemo'
        },
        'enterprise': {
            view: 'enterprise'
        },
        'manage': {
            view: 'manage',
            container: '#c-manage'
        },
        'manage/client': {
            view: 'manage-client'
        },
        'manage/group': {
            view: 'manage-group'
        },
        'manage/groupPolicy': {
            view: 'manage-groupPolicy'
        },
        'manage/clientPolicy': {
            view: 'manage-clientPolicy'
        },
        'manage/policy': {
            view: 'manage-policy'
        },
        'manage/groupCmd': {
            view: 'manage-groupCmd'
        },
        'manage/clientCmd': {
            view: 'manage-clientCmd'
        },
        'manage/clientDetail': {
            view: 'manage-clientDetail'
        },
        'manage/policyTest': {
            view: 'manage-policyTest',
            container: '#c-manage-policyTest'
        },
        'manage/policyTest/zdsj': {
            view: 'manage-policyTest-zdsj'
        },
        'log': {
            view: 'log',
            container: '#c-log'
        },
        'log/pf_bus': {
            view: 'log/pf_bus'
        },
        'log/XAV_VirusLogSearch': {
            view: 'log/XAV_VirusLogSearch'
        },
        'log/XAV_VirusScanLogSearch': {
            view: 'log/XAV_VirusScanLogSearch'
        },
        'log/SystemStrengthened': {
            view: 'log/SystemStrengthened'
        },
        'log/ApplyStrengthened': {
            view: 'log/ApplyStrengthened'
        },
        'log/VirusInfo': {
            view: 'log/VirusInfo'
        },
        'report': {
            view: 'report',
            container: '#c-report'
        },
        'report/XAV_VirusStatistics': {
            view: 'report/XAV_VirusStatistics'
        }
    });
    // 解决IE不开调试工具, 报console未定义的问题
    if (!window.console) {
        window.console = {
            log: $.noop
        };
    }
    // 启动路由
    router.start();
    // 初始化
    index.init();
});