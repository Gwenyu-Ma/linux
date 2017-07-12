define(function(require) {
    var tpl = require('text!remark.html');
    var op = {
        init: function(container) {
            $('.c-page-nav a[href$="remark"]').parent().addClass('active').siblings().removeClass('active');
            $(container).append(tpl);
        }
    };
    return {
        render: function(container) {
            op.init(container);
        }
    };
});