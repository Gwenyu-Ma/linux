define(function(require){
    var tpl = require('text!blank.html');
    var mustache = require('mustache');
    var op = {
        init:function(container, paramStr){
            var $view = $(container);
            var param = RsCore.assist.str2json(paramStr);
            var html = '';
            html = mustache.render(tpl);
            $view.append(html);
        },
        
        initEvent:function(container){
            
        }
    };
    return {
        container:'.rs-page-container',
        render:function(container, paramStr){
            op.init(container, paramStr);
        },
        destroy:function(){
            $(this.container).off().empty();
        }
    };
});