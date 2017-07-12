var RsCore = (function ($) {
    var core = {
        //ajaxPath: 'http://192.168.70.44:806/index.php?',
        ajaxPath: '/index.php/',
        // 全局缓存
        cache: {
            //组信息
            group: {},
            groupClient: [],
            showGroupClient: false,
            //页面传参
            params: {},
            bootbox: false // 标记bootbox提示窗是否弹出,防止ajax回调弹出多个bootbox造成浏览器崩溃... 
        },
        ajaxList: [],
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
            sys: {
                nav: [
                    { value: 'overview', name: '概览' },
                    { value: 'log', name: '日志' },
                    { value: 'policy', name: '设置' },
                    { value: 'remark', name: '备注' },
                    { value: 'msg', name: '历史消息' },
                    { value: 'cmd', name: '命令跟踪' }
                ],
                policy: [
                    { value: '50BAC747-7D02-4969-AF79-45EE47365C81_1', name: '终端升级' },
                    { value: 'EB8AFFA5-0710-47E6-8F53-55CAE55E1915_1', name: '终端设置' },
                    { value: 'autoGroup_1', name: '自动入组' },
                    { value: 'log', name: '日志保留' }
                ]
            },
            virus: {
                nav: [
                    { value: 'overview', name: '概览' },
                    { value: 'log', name: '日志' },
                    { value: 'policy', name: '设置' }
                ],
                policy: [
                    { value: 'D49170C0-B076-4795-B079-0F97560485AF_1', name: 'Windows防病毒' },
                    { value: 'A40D11F7-63D2-469d-BC9C-E10EB5EF32DB_1', name: 'Linux防病毒' }
                ]
            },
            protection: {
                nav: [
                    { value: 'overview', name: '概览' },
                    { value: 'log', name: '日志' },
                    { value: 'policy', name: '设置' },
                    { value: 'share', name: '安全共享' }
                ],
                policy: [
                    { value: '53246C2F-F2EA-4208-9C6C-8954ECF2FA27_1', name: 'IP管理' },
                    { value: '53246C2F-F2EA-4208-9C6C-8954ECF2FA27_2', name: '审计管理' }
                ]
            },
            netdisk: {
                nav: [
                    { value: 'overview', name: '网盘文件' },
                    { value: 'option', name: '访问控制' }
                ]
            },
            report: {
                nav: [
                    { value: 'overview', name: '预警规则' },
                    { value: 'warning', name: '预警记录' }
                ]
            },
            mobile: {
                nav: [
                    { value: 'overview', name: '概览' },
                    { value: 'log', name: '日志' },
                    { value: 'policy', name: '设置' },
                    // { value: 'loca', name: '手机定位' },
                    { value: 'local', name: '手机定位' }
                ],
                policy: [
                    { value: '74F2C5FD-2F95-46be-B67C-FFA200D69012_1', name: '安卓管理' },
                ]
            },
            setting: {
                nav: [
                    { value: 'overview', name: '账户信息' },
                    { value: 'message', name: '我的消息' },
                    { value: 'log', name: '审计日志' }
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
        // ajax封装
        ajax: function (url, param, callback, complete, error) {
            if (arguments.length == 2 && typeof (param) == 'function') {
                callback = param;
                param = undefined;
            }
            var $ajax = $.ajax({
                url: core.ajaxPath + url,
                type: 'POST',
                dataType: 'json',
                async: true,
                data: param,
                timeout: 30000,
                success: function (json) {
                    if (json && json.r) {
                        var r = json.r;
                        switch (r.code) {
                            case 1: //失败
                                error && error(json.data, r.code, r.msg);
                                switch (r.action) {
                                    case 0: //提示
                                        core.msg.warn('系统异常', r.msg);
                                        break;
                                    case 1: //弹窗
                                        if (!core.cache.bootbox) {
                                            core.cache.bootbox = true;
                                            bootbox.alert(r.msg, function () {
                                                core.cache.bootbox = false;
                                            });
                                        }
                                        break;
                                }
                                break;
                            case 0: //成功                                
                                callback && callback(json.data, r.code, r.msg);
                                break;
                            case 401:
                                if (!core.cache.bootbox) {
                                    core.cache.bootbox = true;
                                    bootbox.alert('登录过期', function () {
                                        core.cache.bootbox = false;
                                        window.location.href = '/';
                                    });
                                    return false;
                                }
                                break;
                            default:
                                core.msg.warn('错误', r.msg);
                                break;
                        }
                    } else {
                        //错误处理
                        core.msg.warn('系统异常', '获取数据格式异常');
                    }
                },
                error: function (req) {
                    //Core.Helper.Warn("系统出错 : 错误码[" + req.status + "]");
                    //bootbox.alert("系统出错 : 错误码[" + req.status + "]", '确定');//.css({width: 'auto'});

                    if (req.status == 510) {
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
                            bootbox.alert('系统异常', function () {
                                core.cache.bootbox = false;
                            });
                        }
                    }
                },
                complete: function (req, status) {
                    if (status == 'timeout') {
                        bootbox.alert('请求超时，请重新操作', function () {
                            core.cache.bootbox = false;
                        });
                    }
                    complete && complete(req);
                }
            });
            core.ajaxList.push($ajax);
        },
        ajaxSync: function (url, param, callback) {
            if (arguments.length == 2 && typeof (param) == 'function') {
                callback = param;
                param = undefined;
            }
            $.ajax({
                url: core.ajaxPath + url,
                type: 'POST',
                dataType: 'json',
                async: false,
                data: param,
                timeout: 30000,
                success: function (json) {
                    if (json && json.r) {
                        var r = json.r;
                        switch (r.code) {
                            case 1: //失败
                                switch (r.action) {
                                    case 0: //提示
                                        core.msg.warn('系统异常', r.msg);
                                        break;
                                    case 1: //弹窗
                                        if (!core.cache.bootbox) {
                                            core.cache.bootbox = true;
                                            bootbox.alert(r.msg, function () {
                                                core.cache.bootbox = false;
                                            });
                                        }
                                        break;
                                }
                                break;
                            case 0: //成功
                                if (r.action == 401) {
                                    bootbox.alert('登录过期', function () {
                                        core.cache.bootbox = false;
                                        window.location.href = '/';
                                    });
                                }
                                callback && callback(json.data);
                                break;
                            case 401:
                                if (!core.cache.bootbox) {
                                    core.cache.bootbox = true;
                                    bootbox.alert('登录过期', function () {
                                        core.cache.bootbox = false;
                                        window.location.href = '/';
                                    });
                                    return false;
                                }
                                break;
                            default:
                                core.msg.warn('错误', r.msg);
                                break;
                        }
                    } else {
                        //错误处理
                        core.msg.warn('系统异常');
                    }
                },
                error: function (req) {
                    //Core.Helper.Warn("系统出错 : 错误码[" + req.status + "]");
                    //bootbox.alert("系统出错 : 错误码[" + req.status + "]", '确定');//.css({width: 'auto'});

                    if (req.status == 510) {
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
                            bootbox.alert('系统异常', function () {
                                core.cache.bootbox = false;
                            });
                        }
                    }
                }
            });
        },
        // 表格数据请求失败处理
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
    };

    return core;

})(jQuery);

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        'M+': this.getMonth() + 1, //月份 
        'd+': this.getDate(), //日 
        'h+': this.getHours(), //小时 
        'm+': this.getMinutes(), //分 
        's+': this.getSeconds(), //秒 
        'q+': Math.floor((this.getMonth() + 3) / 3), //季度 
        'S': this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    return fmt;
};