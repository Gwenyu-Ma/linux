define(function(require){
    var mustache = require('mustache');
    var module = require('moudleComm');
    var op = {
        init:function(container, paramStr){
            module.init();
        },
        
        initEvent:function(container){
            
        }
    };
    return {
        container:'.rs-page-container',
        render:function(container, paramStr){
            RsCore.load.hide();
            op.init(container, paramStr);
        },
        destroy:function(){            
            $(this.container).off().empty();
            RsCore.load.show();
        }
    };
});