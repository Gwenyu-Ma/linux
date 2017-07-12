define(function (require) {
    var tpl = require('text!netdisk/overview.html');
    var mustache = require('mustache');
    require('dep/jquery.cookie');
    var op = {
        isVerify: false,
        init: function (container, paramStr) {
            this.container = container;
            var view = $(container);
            console.log(static_path);
            var html = mustache.render(tpl, {
                path: static_path + '/view2/netdisk/netdisk.html'
            });
            view.append(html);
            RsCore.frameDataLoad = this.getVerfiy;
            this.getVerfiy();
            if (!$.cookie('netdiskwarn')) {
                $('#netdiskwarn').modal();
                $.cookie('netdiskwarn', '1', {
                    expires: 365
                })
            } else {
                $.cookie('netdiskwarn', '1', {
                    expires: 365
                })
            }
            $('#netParent').load(function () {
                $(this).trigger('resize');
            })
        },
        getVerfiy: function () {
            if (op.isVerify) {
                return false;
            }
            op.isVerify = true;
            RsCore.ajax(
                'index/getSign',
                function (data) {
                    var iform = $('#ioaForm');
                    for (var name in data) {
                        if (name == 'url') {
                            iform.attr('action', data[name]);
                        } else {
                            iform.find('[name=' + name + ']').val(data[name]);
                        }
                    }
                    iform.submit();
                }
            )
        }
    };
    return {
        container: '.rs-page-container',
        container: '.rs-page-container',
        render: function (container, paramStr) {
            document.title = '安全网盘-网盘文件';
            op.init(container, null, true);
        },
        destroy: function () {
            $(this.container).off().empty();
            op.isVerify = false;
            delete RsCore.frameDataLoad;
        }
    };
});