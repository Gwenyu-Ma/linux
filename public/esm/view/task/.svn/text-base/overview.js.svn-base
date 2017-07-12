define(function(require) {
    var tpl = require('text!blank.html');
    var mustache = require('mustache');
    var op = {
        init: function(container, paramStr) {
            this.container = container;
            var view = $(container);
            var html = mustache.render(tpl);
            view.append(html);
        }
    };
    return {
        container: '.rs-page-container',
        render: function(container, paramStr) {
            op.init(container, paramStr);
        },
        destroy: function() {
            $(this.container).off().empty();
        }
    };
});