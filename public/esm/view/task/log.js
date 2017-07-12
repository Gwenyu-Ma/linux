define(function(require) {
    var tpl = require('text!log.html');
    var op = {
        init: function(container) {
            $(container).append(tpl);
        }
    };
    return {
        container: '.c-page-content',
        render: function(container) {
            op.init(container);
        },
        destroy: function() {
            $(this.container).off().empty();
        }
    };
});