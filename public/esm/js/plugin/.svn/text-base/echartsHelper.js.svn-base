define(['echarts3'], function(echart) {
    var init = function(obj, type, data, options) {
        var _chart = echart.init(obj);
        var opt = $.extend({}, options);
        opt.series = data;
        _chart.setOption(opt);
        return _chart;
    };
    return {
        init: init
    };
});