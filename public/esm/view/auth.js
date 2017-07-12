define(function(require) {
    var mustache = require('mustache');
    var module = require('moudleComm');
    // var getUrlSearchQuerys = RsCore.assist.getUrlSearchQuerys,
    //     params2str = RsCore.assist.params2str;
    var op = {
        init: function(container, paramStr) {
            this.initEvent(container);
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