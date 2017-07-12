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


var RsCore = (function () {
    var core = {
        cache: {},
        ajaxPath: '/index.php/',
        load: {
            show: function () {
                var loading = $('.page-load'),
                    masklayer = $('.page-masklayer');
                loading.show();
                masklayer.show();
            },
            hide: function () {
                var loading = $('.page-load'),
                    masklayer = $('.page-masklayer');
                loading.hide();
                masklayer.hide();
            }
        },
        config: {
            home: {
                nav: [{
                    value: 'overview',
                    name: '企业管理'
                },
                {
                    value: 'auth',
                    name: '产品授权'
                }
                ]
            },
            sys: {
                nav: [{
                    value: 'overview',
                    name: '企业信息'
                }]
            },
            bag: {
                nav: [{
                    value: 'overview',
                    name: '上传安装包'
                },
                {
                    value: 'list',
                    name: '企业列表'
                },
                {
                    value: 'upload',
                    name: '上传升级包'
                }
                ]
            }
        },
        // 消息提示框
        msg: {
            warn: function (title, content) {
                if (arguments.length == 1) {
                    content = title;
                    title = undefined;
                }
                this.run('error', title, content);
            },
            notice: function (title, content) {
                if (arguments.length == 1) {
                    content = title;
                    title = undefined;
                }
                this.run('info', title, content);
            },
            success: function (title, content) {
                if (arguments.length == 1) {
                    content = title;
                    title = undefined;
                }
                this.run('success', title, content);
            },
            run: function (type, title, content) {
                var arr = [];
                arr.push('<div class="mask"></div>');
                arr.push('<div class="alert alert-' + type + '" style="display:none">');
                //arr.push('<button type="button" class="close" data-dismiss="alert">&times;</button>');
                //title && arr.push('<h4>' + core.assist.escapeHtml(title) + '</h4>');
                arr.push('<span class="">');
                arr.push(core.assist.escapeHtml(content));
                arr.push('</span>');
                arr.push('</div>');
                var msgbox = $('div.msg-box');
                msgbox.empty();
                msgbox.append(arr.join(''));
                var w = (msgbox.width() + 8) / 2;
                msgbox.css('margin-left', '-' + w + 'px');
                msgbox.children().last().slideDown().delay(1000).slideUp(300, function () {
                    $(this).closest('.msg-box').html('');
                });
            }
        },
        ajax: function (params) {
            var pars = {
                url: '',
                type: 'POST',
                dataType: 'json',
                async: true,
                data: null,
                timeout: 30000,
                success: null,
                complete: null,
                error: null
            }
            params = $.extend(pars, params);
            $.ajax({
                url: core.ajaxPath + params.url,
                type: params.type,
                dataType: params.dataType,
                async: params.async,
                data: params.data,
                success: function (json) {
                    if (json && json.r) {
                        var r = json.r;
                        switch (r.code) {
                            case 1:
                                alert(r.msg)
                                break;
                            case 0:
                                params.success && params.success(json.data, r.code, r.msg)
                                break;
                            case 401:
                                if (!core.cache.bootbox) {
                                    core.cache.bootbox = true;
                                    bootbox.alert('登录过期', function () {
                                        core.cache.bootbox = false;
                                        window.location.href = '/Center';
                                    });
                                    return false;
                                }
                                break;
                            default:
                                alert(r.msg);
                        }
                    } else {
                        alert('ajax error:', json);
                    }
                },
                complete: function (req, status) {
                    params.complete && params.complete();
                },
                error: function (req, status) {
                    if (params.error) {
                        params.error();
                    } else {
                        alert('ajax error:req:', req, ',status:', status);
                    }
                }
            })
        },
        reqTableError: function (status) {
            if (status == 501) {
                if (!core.cache.bootbox) {
                    core.cache.bootbox = true;
                    bootbox.alert('查询数据参数错误 !', function () {
                        core.cache.bootbox = false;
                    });
                }
            } else if (status == 510) {
                if (!core.cache.bootbox) {
                    core.cache.bootbox = true;
                    bootbox.alert('系统超时,请重新登录...', function () {
                        //window.location.href = '/index.php?m=home&c=Index&a=loginpage';
                        //window.location.href = '/index.php';
                        core.cache.bootbox = false;
                    });
                }
            } else {
                if (!core.cache.bootbox) {
                    core.cache.bootbox = true;
                    bootbox.alert('系统异常 , 请稍后再试 !', function () {
                        core.cache.bootbox = false;
                    });
                }
            }
        },
        //获取当前页面路径
        getCurrentPath: function () {
            var currentHash = window.location.hash,
                index = currentHash.indexOf('?');
            if (index > 1) {
                return currentHash.substring(0, index);
            } else if (index == -1) {
                return currentHash;
            } else {
                return false;
            }
        },
        assist: {
            // html文本转义
            entityMap: {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
                '/': '&#x2F;'
            },
            escapeHtml: function (str) {
                return String(str).replace(/[&<>"'\/]/g, function (s) {
                    return core.assist.entityMap[s];
                });
            },
            // 时间戳转换日期
            unixToDate: function (unixTime, format) {
                return new Date(unixTime * 1000).Format(format);
            },
            // 获取URL参数
            getQueryString: function (name) {
                var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
                var r = window.location.search.substr(1).match(reg);
                if (r != null) {
                    return unescape(r[2]);
                }
                return null;
            },
            // 获取URL search 的参数 （json）格式
            str2json: function (str) {
                if (str) {
                    var result = {},
                        arr = str.split('&');
                    for (var i = 0; i < arr.length; i++) {
                        var res = arr[i].split('=');
                        result[res[0]] = res[1] || '';
                    }
                    return result;
                }
                return {};
            },
            isEmptyObject: function (obj) {
                for (var key in obj) {
                    return false;
                }
                return true;
            },
            getUrlSearchQuerys: function () {
                var hash = window.location.hash.substring(1),
                    idx = hash.indexOf('?'),
                    querys = {};
                if (idx > 0) {
                    querys = core.assist.str2json(hash.substring(idx + 1));
                    return querys;
                } else {
                    return {};
                }

                //console.error('getUrlSearchQuerys error');
            },
            params2str: function (obj) {
                var arr = [];
                for (var key in obj) {
                    arr.push(key + '=' + obj[key]);
                }
                return arr.join('&');
            }
        },
        stringify: (function () {
            var escapeMap = {
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"': '\\"',
                '\\': '\\\\'
            },
                /**
                 * 字符串序列化
                 * @private
                 */
                encodeString = function (source) {
                    if (/["\\\x00-\x1f]/.test(source)) {
                        source = source.replace(
                            /["\\\x00-\x1f]/g,
                            function (match) {
                                var c = escapeMap[match];
                                if (c) {
                                    return c;
                                }
                                c = match.charCodeAt();
                                return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
                            });
                    }
                    return '"' + source + '"';
                },
                /**
                 * 数组序列化
                 * @private
                 */
                encodeArray = function (source) {
                    var result = ['['],
                        l = source.length,
                        preComma, i, item;

                    for (i = 0; i < l; i++) {
                        item = source[i];

                        switch (typeof item) {
                            case 'undefined':
                            case 'function':
                            case 'unknown':
                                break;
                            default:
                                if (preComma) {
                                    result.push(',');
                                }
                                result.push($.stringify(item));
                                preComma = 1;
                        }
                    }
                    result.push(']');
                    return result.join('');
                },
                /**
                 * 处理日期序列化时的补零
                 * @private
                 */
                pad = function (source) {
                    return source < 10 ? '0' + source : source;
                },
                /**
                 * 日期序列化
                 * @private
                 */
                encodeDate = function (source) {
                    return '"' + source.getFullYear() + '-' + pad(source.getMonth() + 1) + '-' + pad(source.getDate()) + 'T' + pad(source.getHours()) + ':' + pad(source.getMinutes()) + ':' + pad(source.getSeconds()) + '"';
                };
            //返回一个处理函数
            return function (value) {
                switch (typeof value) {
                    case 'undefined':
                        return 'undefined';
                    case 'number':
                        return isFinite(value) ? String(value) : 'null';
                    case 'string':
                        return encodeString(value);
                    case 'boolean':
                        return String(value);
                    default:
                        if (value === null) {
                            return 'null';
                        } else if (value instanceof Array) {
                            return encodeArray(value);
                        } else if (value instanceof Date) {
                            return encodeDate(value);
                        } else {
                            var result = ['{'],
                                encode = core.stringify,
                                preComma,
                                item;

                            for (var key in value) {
                                if (Object.prototype.hasOwnProperty.call(value, key)) {
                                    item = value[key];
                                    switch (typeof item) {
                                        case 'undefined':
                                        case 'unknown':
                                        case 'function':
                                            break;
                                        default:
                                            if (preComma) {
                                                result.push(',');
                                            }
                                            preComma = 1;
                                            result.push(encode(key) + ':' + encode(item));
                                    }
                                }
                            }
                            result.push('}');
                            return result.join('');
                        }
                }
            };
            //over
        })()
    }

    return core;
}());


var assist = {
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
            arr.push(assist.escapeHtml(opt.content));
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



$.validator && $.validator.setDefaults({
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