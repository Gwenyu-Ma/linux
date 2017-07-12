var assist = {
    verify: {
        email: function (value) {
            return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
        },
        phone: function (value) {
            return /^[1][3-8]+\d{9}$/.test(value);
        },
        pwd: function (value) {
            if ($.trim(value)) {
                return true;
            } else {
                return false;
            }
        }
    },
    entityMap: {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        // '"': '&quot;',
        // "'": '&#39;',
        '/': '&#x2F;'
    },
    escapeHtml: function (str) {
        return String(str).replace(/[&<>\/]/g, function (s) {
            return assist.entityMap[s];
        });
    },
    showMsg: function (dom, msg) {
        dom.after('<p class="verify-faild">&bull; ' + msg + '</p>');
    },
    dialog: function (opt, setting) {
        var defOpt = {
            type: 'info',
            /*info,error,danger,success*/
            title: '提示',
            content: ''
        };
        opt = $.extend(defOpt, opt);
        var _setting = {
            autoclose: true,
            escapContent: true
        };
        setting = $.extend(_setting, setting);
        var arr = [];
        arr.push('<div class="msg-box"><div class="mask"></div><div class="alert alert-' + opt.type + '" >');
        if (!setting.autoclose) {
            arr.push('<button type="button" class="close" data-dismiss="msg-box">&times;</button>');
        }

        //opt.title && arr.push('<h4>' + this.escapeHtml(opt.title) + '</h4>');
        arr.push('<span>');
        if (setting.escapContent) {
            arr.push(this.escapeHtml(opt.content));
        } else {
            arr.push(opt.content);
        }
        arr.push('</span></div></div>');
        var box = $(arr.join(''));
        $('body').append(box);
        box.css({
            'margin-left': -Math.floor((box.outerWidth()) / 2) + 'px'
        });


        if (setting.autoclose) {
            box.show().delay(3000).hide(function () {
                $(this).remove();
            });
        } else {
            box.show();
            box.on('click', '.close', function () {
                box.remove();
            });
        }
        return box;

    },
    getQueryString: function (name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }
};
/*设置全局验证*/

$.validator.setDefaults({
    focusCleanup: true,
    onfocusin: function (element) {
        this.lastActive = element;

        // Hide error label and remove error class on focus if enabled
        if (this.settings.focusCleanup) {
            if (this.settings.unhighlight) {
                this.settings.unhighlight.call(this, element, this.settings.errorClass, this.settings.validClass);
            }
            this.hideThese(this.errorsFor(element));
        }
        //$(element).closest('.error').removeClass('error');
    },
    onkeyup: function (element, event) {
        // Avoid revalidate the field when pressing one of the following keys
        // Shift       => 16
        // Ctrl        => 17
        // Alt         => 18
        // Caps lock   => 20
        // End         => 35
        // Home        => 36
        // Left arrow  => 37
        // Up arrow    => 38
        // Right arrow => 39
        // Down arrow  => 40
        // Insert      => 45
        // Num lock    => 144
        // AltGr key   => 225
        var excludedKeys = [
            16, 17, 18, 20, 35, 36, 37,
            38, 39, 40, 45, 144, 225
        ];

        if (event.which === 9 && this.elementValue(element) === '' || $.inArray(event.keyCode, excludedKeys) !== -1) {
            return;
        } else {
            var id = $(element).attr('id');
            //this.element( element );
            $(id + '-error').text('');
        }
    },
    highlight: function (element, errorClass, validClass) {
        if (element.type === 'radio') {
            this.findByName(element.name).addClass(errorClass).removeClass(validClass);
        } else {
            $(element).addClass(errorClass).removeClass(validClass);
            var groupLabel = $(element).closest('.control-group');
            if (!groupLabel.hasClass('vali_noError')) {
                groupLabel.addClass('error');
            }

        }
    },
    unhighlight: function (element, errorClass, validClass) {
        if (element.type === 'radio') {
            this.findByName(element.name).removeClass(errorClass).addClass(validClass);
        } else {
            $(element).removeClass(errorClass).addClass(validClass);
            $(element).closest('.control-group').removeClass('error');
        }
    }
});

/*手动验证*/
function showErrLabel(validator, name, message) {
    var element = $('[name=' + name + ']')[0];
    validator.showLabel(element, message);
    $('#' + name + '-error').show().closest('.control-group').addClass('error');

}

/*浏览器特性判断*/
var supports = (function () {
    var div = document.createElement('div'),
        vendors = 'Khtml Ms O Moz Webkit'.split(' '),
        len = vendors.length;

    return function (prop) {
        if (prop in div.style) return true;

        prop = prop.replace(/^[a-z]/, function (val) {
            return val.toUpperCase();
        });

        while (len--) {
            if (vendors[len] + prop in div.style) {
                // browser supports box-shadow. Do what you need.
                // Or use a bang (!) to test if the browser doesn't.
                return true;
            }
        }
        return false;
    };
})();