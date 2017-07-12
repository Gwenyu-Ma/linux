define(function(require) {
    var tpl = require('text!layout.html');
    var mustache = require('mustache');
    var module = require('moudleComm');
    var nav = RsCore.config.sys.nav;
    var op = {
        init: function(container, paramStr) {
            var $view = $(container);
            var param = RsCore.assist.str2json(paramStr);
            var html = '';
            html = mustache.render(tpl, { 'tag': 'sys', 'sys': true, 'nav': nav });
            $view.html(html);
            module.init();
            module.refreshClient();
        },

        initEvent: function(container) {

        }
    };
    return {
        container: '.rs-page-container',
        render: function(container, paramStr) {
            RsCore.load.hide();
            op.init(container, paramStr);
        },
        destroy: function() {
            $(this.container).off().empty();
            RsCore.load.show();
        }
    };
});