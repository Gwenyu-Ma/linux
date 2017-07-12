require.config({
    urlArgs: 'ver=' + (new Date()).getTime(),
    baseUrl: '/public/manage/view',
    //baseUrl: '/public/view2',
    paths: {
        js: '../js',
        text: '../../dep/require/text',
        css: '../../dep/require/css',
        'async': '../../dep/require/async',
        mustache: '../../dep/mustache/mustache',
        hashchange: '../../dep/hashchange/hashchange',
        slimscroll: '../../dep/slimscroll/jquery.slimscroll',
        table: '../../dep/table/bootstrap-table',
        selectric: '../../dep/selectric/jquery.selectric',
        select: '../../dep/bootstrap-select/bootstrap-select',
        resiableCol: '../../dep/resizableColumns/jquery.resizableColumns',
        colResizable: '../../dep/colResizable/colResizable-1.6',
        datetimepicker: '../../dep/datetimepicker/jquery.datetimepicker',
        jquery: '../../dep/jquery',
        dep: '../../dep',
        zclip: '../../dep/zclip/jquery.zclip',
        form: '../../dep/jquery.form',
        echarts3: '../../dep/echarts3/echarts_20170329.min',
        util_b: '../js/plugin/util_b',
        cropper: '../../dep/upload/cropper',
        jqueryForm: '../../dep/upload/jquery.form',
        validation: '../../dep/jquery-validation/jquery.validate',
        customMethods: '../../dep/jquery-validation/custom-methods'
    },
    shim: {
        customMethods: {
            deps: ['validation']
        }
    },
    waitSeconds: 0
});
require(['js/router', 'js/index'], function (router, index) {
    // 设置路由映射
    router.map({
        '': {
            container: '.rs-page-container',
            defaultPage: 'home'
        },
        /*系统管理*/
        'home': {
            view: 'home',
            container: '.c-page-content',
            defaultPage: 'overview'
        },
        'home/overview': {
            view: 'home/overview'
        },
        'home/auth': {
            view: 'home/auth'
        },
        /*病毒查杀*/
        'sys': {
            view: 'sys',
            container: '.c-page-content',
            defaultPage: 'overview'
        },
        'sys/overview': {
            view: 'sys/overview'
        },
        // 包管理
        'bag': {
            view: 'bag',
            container: '.c-page-content',
            defaultPage: 'overview'
        },
        'bag/overview': {
            view: 'bag/overview'
        },
        'bag/list': {
            view: 'bag/list'
        },
        'bag/upload': {
            view: 'bag/upload'
        },

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