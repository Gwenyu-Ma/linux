/*
浏览器端通用函数
 */


var util_b = {
    /*获取终端名称*/
    getComputerName_Overview: function (row) {
        return (row['memo'] && row['memo'] !== '') ? row['memo'] : row['computerName'];
    },
    getName: function (row) {
        return (row['memo'] && row['memo'] !== '') ? row['memo'] : (row['computerName'] || '');
    },
    /*获取操作系统*/
    getSys_Overview: function (row) {
        var os = row.sysType || '',
            osType = 'ico_pc';
        if (os) {
            os = os.toLowerCase();
        }
        if (os.indexOf('windows') > -1) {
            osType = 'ico_pc';
        } else if (os.indexOf('linux') > -1) {
            osType = 'ico_pc';
        } else if (os.indexOf('android') > -1) {
            osType = 'ico_moblic';
        }
        return osType;
    },
    /*获取在线状态*/
    getOnlineState_Overview: function (row) {
        var online = row.onlinestate,
            state = 'offline';
        if (online == 0) {
            state = 'offline';
        }
        if (online == 1) {
            state = 'online';
        }
        if (online == 2) {
            state = 'drop';
        }
        return state;
    },
    /*URL参数操作*/
    urlParmas: function (name, value) {
        var hash = window.location.hash.substring(1),
            path = hash.split('?')[0],
            idx = hash.indexOf('?'),
            querys = {};
        if (idx > 0) {
            querys = this.str2json(hash.substring(idx + 1));
        } else {
            querys = {};
        }


        if (value) {
            querys[name] = value;
            window.location.hash = path + '?' + params2str(params);
        } else {
            return querys[name];
        }
    },
    params2str: function (obj) {
        var arr = [];
        for (var key in obj) {
            arr.push(key + '=' + obj[key]);
        }
        return arr.join('&');
    },
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
    /*table 判断是否登录*/
    islogin: function (data) {
        if (data && data.r) {
            if (data.r.code == 401) {
                if (!RsCore.cache.bootbox) {
                    RsCore.cache.bootbox = true;
                    bootbox.alert('登录过期', function () {
                        RsCore.cache.bootbox = false;
                        window.location.href = '/';
                    });
                    return false;
                }
            }
        }
    },
    /*黑名单无策略*/
    blackShow: function (id) {
        if ((id && id == -1) || (id && id == -2)) {
            $('.c-page-nav .nav li[da-type=policy]').hide();
            $('.group-cmd').hide();
        } else if (id && RsCore.cache.group.list[id]) {
            if (RsCore.cache.group.list[id].type == 2) {
                $('.c-page-nav .nav li[da-type=policy]').hide();
                $('.group-cmd').hide();
            } else {
                $('.c-page-nav .nav li[da-type=policy]').show();
                $('.group-cmd').show();
            }
        } else {
            $('.c-page-nav .nav li[da-type=policy]').show();
            $('.group-cmd').show();
        }
    },
    ipSort: function (prev, next) {
        var prev_arr = prev.indexOf('.') >= 0 ? prev.split('.') : prev.split(':'),
            next_arr = next.indexOf('.') >= 0 ? next.split('.') : next.split(':'),
            prev_len = prev_arr.length,
            next_len = next_arr.length,
            len = 0,
            falg = 0;
        if (prev_len > next_len) {
            len = prev_len;
        } else {
            len = next_len;
        }
        for (var i = 0; i < len; i++) {
            var prev_num = parseInt(prev_arr[i] || '0', 16),
                next_num = parseInt(next_arr[i] || '0', 16);
            if (prev_num == next_num) {
                continue;
            } else {
                return prev_num - next_num;
            }
        }
    },
    getCName: function (row) {
        var name = util_b.getComputerName_Overview(row);
        var osType = util_b.getSys_Overview(row);
        var state = util_b.getOnlineState_Overview(row);
        var title = state == 'drop' ? '已卸载' : '';
        return '<a class="overview-ico" href="javascript:;" da-toggle="#' + row.sguid + '"><em class="' + osType + ' ' + state + '" title="' + title + '">&nbsp;</em>' + (name ? name : '未知') + '</a>';
    },
    /*毫秒转时间*/
    milsFormatTime: function (num) {
        var date = new Date(num);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();

        var h = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();

        return [year, month, day].join('-') + ' ' + [h, m, s].join(':');
    },
    secFormatTime: function (arr) {
        var arrIdx = [60, 60, 24],
            len = arr.length,
            num = arrIdx[len];
        if (len == 3) {
            return [arr[0], '时', arr[1], '分', arr[2], '秒'].join('');
        } else {
            if (arr[0] >= num) {
                var tmp = arr[0];
                arr[0] = tmp % num;
                arr.unshift(parseInt(tmp / num));
                return this.secFormatTime(arr);
            } else {
                if (len == 2) {
                    return [arr[0], '分', arr[1], '秒'].join('');
                }
                if (len == 1) {
                    return [arr[0], '秒'].join('');
                }
            }
        }
    }
};