require.config({
    urlArgs: 'ver=' + (new Date()).getTime(),
    baseUrl: '/public/esm/view',
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
        sidemenu: '../js/plugin/sidemenu/sidemenu',
        util_b: '../js/plugin/util_b',
        echarts: '../../dep/echarts',
        echartsExtend: '../js/plugin/echartsExtend/echartsExtend',
        echarts3: '../../dep/echarts3/echarts.min',
        datetimepicker: '../../dep/datetimepicker/jquery.datetimepicker',
        resiableCol: '../../dep/resizableColumns/jquery.resizableColumns',
        colResizable: '../../dep/colResizable/colResizable-1.6',
        promise: '../../dep/promise-polyfill/promise.min',
        //webuploader:'../dep/upload/webuploader',
        cropper: '../../dep/upload/cropper',
        jqueryForm: '../../dep/upload/jquery.form',
        // jqueryColor:'../dep/upload/jquery.color',
        // jqueryJcrop:'../dep/upload/jquery.Jcrop',
        jquery: '../../dep/jquery',
        dep: '../../dep',
        baiduMap: 'https://api.map.baidu.com/api?v=2.0&ak=NdzV7ygTcAus7xFq5h7a2Q1muREvLhju&s=1',
        gdMap: 'https://webapi.amap.com/maps?v=1.3&key=c4ad0e84287c5146e854c44fc90be1c9&plugin=AMap.Geocoder,AMap.MarkerClusterer',
        baiduTool: '../../dep/baidumap',
        TextIconOverlay: '../../dep/baidumap/TextIconOverlay',
        MarkerClusterer: '../../dep/baidumap/MarkerClusterer',
        zclip: '../../dep/zclip/jquery.zclip'
    },
    shim: {
        'TextIconOverlay': ['async!baiduMap'],
        'MarkerClusterer': ['async!baiduMap']
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
        /*安全中心 -- 首页*/
        'home': {
            view: 'home'
        },
        /*系统管理*/
        'sys': {
            view: 'sys',
            container: '.c-page-content',
            defaultPage: 'overview'
        },
        'sys/overview': {
            view: 'sys/overview'
        },
        'sys/policy': {
            view: 'sys/policy'
        },
        'sys/log': {
            view: 'sys/log'
        },
        'sys/remark': {
            view: 'sys/remark'
        },
        'sys/cmd': {
            view: 'sys/cmd'
        },
        'sys/msg': {
            view: 'sys/msg'
        },
        /*病毒查杀*/
        'virus': {
            view: 'virus',
            container: '.c-page-content',
            defaultPage: 'overview'
        },
        'virus/overview': {
            view: 'virus/overview'
        },
        'virus/policy': {
            view: 'virus/policy'
        },
        'virus/log': {
            view: 'virus/log'
        },

        /*上网防护*/
        'protection': {
            view: 'protection',
            container: '.c-page-content',
            defaultPage: 'overview'
        },
        'protection/overview': {
            view: 'protection/overview'
        },
        'protection/policy': {
            view: 'protection/policy'
        },
        'protection/log': {
            view: 'protection/log'
        },
        'protection/share': {
            view: 'protection/share'
        },
        'protection/remark': {
            view: 'protection/remark'
        },
        /*安全手机*/
        'mobile': {
            view: 'mobile',
            container: '.c-page-content',
            defaultPage: 'overview'
        },
        'mobile/overview': {
            view: 'mobile/overview'
        },
        'mobile/policy': {
            view: 'mobile/policy'
        },
        'mobile/log': {
            view: 'mobile/log'
        },
        'mobile/loca': {
            view: 'mobile/location'
        },
        'mobile/local': {
            view: 'mobile/location_gd'
        },

        /*系统设置*/
        'settings': {
            view: 'settings',
            container: '.rs-page-container',
            defaultPage: 'overview'
        },
        'settings/overview': {
            view: 'settings/overview'
        },
        'settings/operlog': {
            view: 'settings/operlog'
        },
        'settings/accountManage': {
            view: 'settings/accountManage'
        },
        'settings/message': {
            view: 'settings/message'
        },
        'settings/log': {
            view: 'settings/log'
        },
        'settings/company': {
            view: 'settings/company'
        },
        /*报告预警*/
        'report': {
            view: 'report',
            container: '.rs-page-container',
            defaultPage: 'overview'
        },
        'report/overview': {
            view: 'report/overview'
        },
        'report/warning': {
            view: 'report/warning'
        },
        /*任务管理*/
        'task': {
            view: 'task',
            container: '.rs-page-container',
            defaultPage: 'overview'
        },
        'task/overview': {
            view: 'task/overview'
        },
        'task/policy': {
            view: 'task/policy'
        },
        'task/log': {
            view: 'task/log'
        },
        /*安全网盘*/
        'netdisk': {
            view: 'netdisk',
            container: '.rs-page-container',
            defaultPage: 'overview'
        },
        'netdisk/overview': {
            view: 'netdisk/overview'
        },
        'netdisk/option': {
            view: 'netdisk/option'
        },
        /*授权管理*/
        'auth': {
            view: 'auth',
            container: '.rs-page-container',
            defaultPage: 'overview'
        },
        'auth/overview': {
            view: 'auth/overview'
        },
        'auth/history': {
            view: 'auth/history'
        },
        'auth/product': {
            view: 'auth/product'
        },
        /*包管理*/
        'package': {
            view: 'package',
            container: '.rs-page-container',
            defaultPage: 'overview'
        },
        'package/overview': {
            view: 'package/overview'
        },
        'package/upload': {
            view: 'package/upload'
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