define(function (require) {
    var tpl = require('text!mobile/policy.html');
    var getUrlSearchQuerys = RsCore.assist.getUrlSearchQuerys;
    require('selectric');
    require('css!selectric');
    require('datetimepicker');
    require('css!datetimepicker');
    require('slimscroll');

    var op = {
        view: null,
        init: function (container, policy) {
            // 绑定事件
            this.view = container;
            this.bindEvent(container);
            this.validationEvent(container);
            // 初始化策略内容
            if (policy['74F2C5FD-2F95-46be-B67C-FFA200D69012_1']) {
                // 策略初始化赋值 console.log(policy);
                this.toHtml(container, policy['74F2C5FD-2F95-46be-B67C-FFA200D69012_1']);
            }

            // 下拉列表美化
            container
                .find('select')
                .selectric({inheritOriginalWidth: true});

            $(window).on('resize.policy', function () {
                $('.c-moudle-wrap').slimscroll({
                    height: $('.c-page-content').height() - $('.c-moudle-nav').outerHeight() - 45,
                    alwaysVisible: true
                });
            }).trigger('resize.policy');
        },
        bindEvent: function (container) {

            // 锁定图标
            container
                .on('click', 'i.lock', function () {
                    $(this).toggleClass('enableLock');
                    return false;
                });
            /*初始化时间空间*/
            container.on('change', '.js_switch', function () {
                var checked = $(this).prop('checked');
                var dd = $(this)
                    .closest('dt')
                    .next('dd');
                if (checked) {
                    dd
                        .find('input')
                        .prop('disabled', false);
                    var switchs = dd.find('.js_switch');
                    for (var i = 0; i < switchs.length; i++) {
                        if ($(switchs[i]).prop('checked')) {
                            $(switchs[i])
                                .closest('dt')
                                .next('dd')
                                .find('input')
                                .prop('disabled', false);
                        } else {
                            $(switchs[i])
                                .closest('dt')
                                .next('dd')
                                .find('input')
                                .prop('disabled', true);
                        }
                    }
                } else {
                    dd
                        .find('input')
                        .prop('disabled', true);
                }
            });

            /*时间控件*/
            container
                .find('.js_time')
                .datetimepicker({datepicker: false, format: 'H:i', step: 1});

            /*策略保存*/
            container.on('click', '#policy-save', function () {
                var params = getUrlSearchQuerys();
                if (!op.valida()) {
                    RsCore
                        .msg
                        .warn('组策略设置', '数据错误');
                    return false;
                }
                $(this).button('loading');
                var json = op.toJson(container.find('#policyContent')),
                    policys = RsCore.config.mobile.policy,
                    eid = RsCore.cache.group.eid,
                    gid = params['g'],
                    /*view.find('.client-list li.active a').attr('da-toggle').substring(1)*/
                    cid = params['c'] || '';
                // var _type; var _policy = container.find('#policy-product .active
                // a').attr('da-toggle').substring(1); if (globalPolicy.indexOf(_policy) >= 0) {
                //     _type = 1; } else {     _type = 0;     if (!gid && !cid && !eid) return;
                // }
                var tickDone = 0;

                RsCore.ajax('Policy/editPolicy', {
                    'eid': eid
                        ? eid
                        : '', //企业id
                    'objid': cid
                        ? cid
                        : (gid
                            ? gid
                            : (eid
                                ? eid
                                : '')), //企业id/组id/终端sguid
                    'productid': policys[0]
                        .value
                        .split('_')[0], //产品id
                    'productname': policys[0].name, //产品名称
                    'grouptype': cid
                        ? 2
                        : 1, //组类型(策略类型)
                    'policytype': policys[0]
                        .value
                        .split('_')[1], //策略小类型
                    'desp': '', //描述
                    'policyinfo': JSON.stringify(json),
                    'type': 0
                }, function (data) {
                    container
                        .find('#policy-save')
                        .button('reset');
                    RsCore
                        .msg
                        .success('策略保存成功 !');
                }, function () {
                    container
                        .find('#policy-save')
                        .button('reset');
                });

            });

            /*导航*/
            container.on('click', '#policyTab a', function () {
                var tag = $(this).attr('da-toggle');
                var wrapTop = $('.c-moudle-wrap')
                    .offset()
                    .top;
                var wrapScroolTop = $('.c-moudle-wrap').scrollTop();
                var objTop = container
                    .find(tag)
                    .offset()
                    .top;
                var top = wrapScroolTop + objTop - wrapTop;
                $('.c-moudle-wrap').trigger('goTo', {top: top});
                $('.policy-bod').removeClass('active');

                $(this)
                    .parent()
                    .addClass('active')
                    .siblings()
                    .removeClass('active');
                //$(tag).find('> .policy-bod').addClass('active');
            });

        },
        valida: function () {
            op
                .view
                .find('[validation]')
                .trigger('blur');
            if (op.view.find('.error').length) {
                return false;
            }
            return true;
        },
        validationEvent: function (container) {
            /*错误验证事件*/
            var rule = {
                intNum: function (obj) {
                    var val = obj.val();
                    return /^\d+$/.test(val);
                },
                ip: function (obj) {
                    var val = obj.val();
                    return /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i.test(val);
                }
            };

            container.on('blur', '[validation]', function () {
                var that = $(this),
                    funcs = that
                        .attr('validation')
                        .split(/\s+/),
                    len = funcs.length,
                    num = 0;
                if ((funcs.indexOf('require') < 0) && that.val() == '') {
                    that.removeClass('error');
                    return true;
                }
                for (var i = 0; i < len; i++) {
                    if (rule[funcs[i]].call(null, that)) {
                        num++;
                    } else {
                        break;
                    }
                }
                if (num == len) {
                    that.removeClass('error');
                } else {
                    that.addClass('error');
                }

            });
        },
        toJson: function (container) {
            var root = {};

            root.public = {};
            root.public.statebar = {};
            root.public.statebar['@attributes'] = {
                lock: Number(container.find('#pub_stateBar_lock').hasClass('enableLock'))
            };
            root.public.statebar['@value'] = container
                .find('[name=pub_stateBar]:checked')
                .val();

            root.virusscan = {};
            root.virusscan.scan_mode = {};
            root.virusscan.scan_mode['@attributes'] = {
                lock: Number(container.find('#viru_scanMode_lock').hasClass('enableLock'))
            };
            root.virusscan.scan_mode['@value'] = container
                .find('[name=viru_scanMode]:checked')
                .val();
            root.virusscan.deal_mode = {};
            root.virusscan.deal_mode['@attributes'] = {
                lock: Number(container.find('#viru_dealMode_lock').hasClass('enableLock'))
            };
            root.virusscan.deal_mode['@value'] = container
                .find('[name=viru_dealMode]:checked')
                .val();
            root.virusscan.update_mode = {};
            root.virusscan.update_mode['@attributes'] = {
                lock: Number(container.find('#viru_updateMode_lock').hasClass('enableLock'))
            };
            root.virusscan.update_mode['@value'] = container
                .find('[name=viru_updateMode]:checked')
                .val();

            root.harass = {};
            root.harass['switch'] = {};
            root.harass['switch']['@attributes'] = {
                lock: Number(container.find('#harass_switch_lock').hasClass('enableLock'))
            };
            root.harass['switch']['@value'] = Number(container.find('#harass_switch').prop('checked'));
            root.harass.spam_mode = {};
            root.harass.spam_mode['@attributes'] = {
                lock: Number(container.find('#harass_viru_spamMode_lock').hasClass('enableLock'))
            };
            root.harass.spam_mode['@value'] = container
                .find('[name=viru_spamMode]:checked')
                .val();
            root.harass.timespan = {};
            root.harass.timespan['switch'] = {};
            root.harass.timespan['switch']['@attributes'] = {
                lock: Number(container.find('#harass_viru_timespanswitch_lock').hasClass('enableLock'))
            };
            root.harass.timespan['switch']['@value'] = Number(container.find('#viru_timespanswitch').prop('checked'));
            root.harass.timespan.Time_SPAN_MODE = {};
            root.harass.timespan.Time_SPAN_MODE['@attributes'] = {
                lock: Number(container.find('#harass_viru_timeSpamMode_lock').hasClass('enableLock'))
            };
            root.harass.timespan.Time_SPAN_MODE['@value'] = container
                .find('[name=viru_timeSpamMode]:checked')
                .val();
            root.harass.timespan.start_time = {};
            root.harass.timespan.start_time['@attributes'] = {
                lock: Number(container.find('#start_time_lock').hasClass('enableLock'))
            };
            root.harass.timespan.start_time['@value'] = container
                .find('#start_time')
                .val()
                .split(':')
                .join('');
            root.harass.timespan.end_time = {};
            root.harass.timespan.end_time['@attributes'] = {
                lock: Number(container.find('#end_time_lock').hasClass('enableLock'))
            };
            root.harass.timespan.end_time['@value'] = container
                .find('#end_time')
                .val()
                .split(':')
                .join('');
            root.harass.call_reject_mode = {};
            root.harass.call_reject_mode['@attributes'] = {
                lock: Number(container.find('#viru_rejectMode_lock').hasClass('enableLock'))
            };
            root.harass.call_reject_mode['@value'] = container
                .find('[name=viru_rejectMode]:checked')
                .val();
            root.harass.auto_blacklist = {};
            root.harass.auto_blacklist['@attributes'] = {
                lock: Number(container.find('#viru_autoUnknown_lock').hasClass('enableLock'))
            };
            root.harass.auto_blacklist['@value'] = Number(container.find('#viru_autoUnknown').prop('checked'));
            root.harass.call_unknown = {};
            root.harass.call_unknown['@attributes'] = {
                lock: Number(container.find('#viru_callUnknown_lock').hasClass('enableLock'))
            };
            root.harass.call_unknown['@value'] = Number(container.find('#viru_callUnknown').prop('checked'));
            root.harass.intelligentfilter = {};
            root.harass.intelligentfilter['@attributes'] = {
                lock: Number(container.find('#viru_intelligentfilter_lock').hasClass('enableLock'))
            };
            root.harass.intelligentfilter['@value'] = Number(container.find('#viru_intelligentfilter').prop('checked'));

            root.location = {};
            root.location['switch'] = {};
            root.location['switch']['@attributes'] = {
                lock: Number(container.find('#local_switch_lock').hasClass('enableLock'))
            };
            root.location['switch']['@value'] = Number(container.find('#local_switch').prop('checked'));

            root.location.report_timer = {};
            root.location.report_timer['@attributes'] = {
                lock: Number(container.find('#local_reportTime_lock').hasClass('enableLock'))
            };
            root.location.report_timer['@value'] = container
                .find('#local_reportTime')
                .val();
            root.location.report_distance = {};
            root.location.report_distance['@attributes'] = {
                lock: Number(container.find('#local_reportDistance_lock').hasClass('enableLock'))
            };
            root.location.report_distance['@value'] = container
                .find('#local_reportDistance')
                .val();

            var json = {
                root: root
            };
            return json;
        },

        /*toXml: function(json) {
      var xml = mustache.render(xmlTpl, json);
      return xml;
    },*/
        toHtml: function (container, json) {
            var opRadio = function (name, value) {
                container
                    .find(':radio[name=' + name + '][value=' + value + ']')
                    .prop('checked', true);
            };
            var opCheck = function (id, status) {
                if (status == 1) {
                    return container
                        .find(id)
                        .prop('checked', true);
                } else {
                    return container
                        .find(id)
                        .prop('checked', false);
                }
            };
            var opLock = function (id, status) {
                if (status == 1) {
                    container
                        .find(id)
                        .addClass('enableLock');
                } else {
                    container
                        .find(id)
                        .removeClass('enableLock');
                }
            };

            var root = json.root;
            if (!root) {
                return;
            }

            var pub = root.public;
            opLock('#pub_stateBar_lock', pub.statebar['@attributes'].lock);
            opRadio('pub_stateBar', pub.statebar['@value']);

            var scan = root.virusscan;
            opLock('#viru_scanMode_lock', scan.scan_mode['@attributes'].lock);
            opRadio('viru_scanMode', scan.scan_mode['@value']);
            opLock('#viru_dealMode_lock', scan.deal_mode['@attributes'].lock);
            opRadio('viru_dealMode', scan.deal_mode['@value']);
            opLock('#viru_updateMode_lock', scan.update_mode['@attributes'].lock);
            opRadio('viru_updateMode', scan.update_mode['@value']);

            var harass = root.harass;
            opLock('#harass_switch_lock', harass['switch']['@attributes'].lock);
            opCheck('#harass_switch', harass['switch']['@value']);
            opLock('#harass_viru_spamMode_lock', harass.spam_mode['@attributes'].lock);
            opRadio('viru_spamMode', harass.spam_mode['@value']);
            var timespan = harass.timespan;
            opLock('#harass_viru_timespanswitch_lock', timespan['switch']['@attributes'].lock);
            opCheck('#viru_timespanswitch', timespan['switch']['@value']);
            container
                .find('#viru_timespanswitch')
                .trigger('change');
            opLock('#harass_viru_timeSpamMode_lock', timespan.Time_SPAN_MODE['@attributes'].lock);
            opRadio('viru_timeSpamMode', timespan.Time_SPAN_MODE['@value']);
            opLock('#start_time_lock', timespan.start_time['@attributes'].lock);
            var _start_time = '';
            if (timespan.start_time['@value']) {
                _start_time = timespan
                    .start_time['@value']
                    .slice(0, 2) + ':' + timespan
                    .start_time['@value']
                    .slice(2);
            }
            container
                .find('#start_time')
                .val(_start_time);
            opLock('#end_time_lock', timespan.end_time['@attributes'].lock);
            var _end_time = '';
            if (timespan.end_time['@value']) {
                _end_time = timespan
                    .end_time['@value']
                    .slice(0, 2) + ':' + timespan
                    .end_time['@value']
                    .slice(2);
            }
            container
                .find('#end_time')
                .val(_end_time);

            opLock('#viru_rejectMode_lock', harass.call_reject_mode['@attributes'].lock);
            opRadio('viru_rejectMode', harass.call_reject_mode['@value']);
            opLock('#viru_autoUnknown_lock', harass.auto_blacklist['@attributes'].lock);
            opCheck('#viru_autoUnknown', harass.auto_blacklist['@value']);
            opLock('#viru_callUnknown_lock', harass.call_unknown['@attributes'].lock);
            opCheck('#viru_callUnknown', harass.call_unknown['@value']);
            opLock('#viru_intelligentfilter_lock', harass.intelligentfilter['@attributes'].lock);
            opCheck('#viru_intelligentfilter', harass.intelligentfilter['@value']);

            var local = root.location;
            opLock('#local_switch_lock', local['switch']['@attributes'].lock);
            opCheck('#local_switch', local['switch']['@value']);
            container
                .find('#local_switch')
                .trigger('change');
            opLock('#local_reportTime_lock', local.report_timer['@attributes'].lock);
            container
                .find('#local_reportTime')
                .val(local.report_timer['@value']);
            opLock('#local_reportDistance_lock', local.report_distance['@attributes'].lock);
            container
                .find('#local_reportDistance')
                .val(local.report_distance['@value']);

        }
    };

    return {
        container: '.c-page-content',
        render: function (container) {
            document.title = '瑞星安全云-移动安全-策略';
            var policys = RsCore.config.mobile.policy,
                path = window
                    .location
                    .hash
                    .split('?')[0],
                params = getUrlSearchQuerys(),
                groupId = params['g'],
                policyJSON = {};
            if (groupId == '0' && !params['c']) {
                $(container).append('<div  class="no-setting"><div></div><span>“已加入终端”无设置，请查看具体分组设置</span></div>');
                return false;
            }
            $(container).append(tpl);
            RsCore.ajax('Policy/getPolicy', {
                grouptype: params['c']
                    ? 2
                    : 1,
                objid: params['c'] || params['g'],
                productid: policys[0]
                    .value
                    .split('_')[0],
                eid: RsCore.cache.group.eid,
                policytype: policys[0]
                    .value
                    .split('_')[1]
            }, function (result) {
                if (result) {
                    policyJSON[policys[0].value] = $.parseJSON(result.policyjson);
                } else {
                    policyJSON[policys[0].value] = null;
                }

                op.init($(container), policyJSON);

            });

        },
        destroy: function () {
            $(window).off('resize.policy');
            $(this.container)
                .off()
                .empty();
        }
    };
});
