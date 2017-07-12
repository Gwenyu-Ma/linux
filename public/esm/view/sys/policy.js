define(function (require) {
    var tpl = require('text!sys/policy.html');
    var getUrlSearchQuerys = RsCore.assist.getUrlSearchQuerys;
    var params2str = RsCore.assist.params2str;
    var mustache = require('mustache');
    require('selectric');
    require('css!selectric');
    require('datetimepicker');
    require('css!datetimepicker');
    require('slimscroll');
    require('dep/jquery.md5');
    require('dep/icheck-1.x/icheck.min');
    require('css!dep/icheck-1.x/skins/polaris/polaris');

    var op = {
        view: null,
        noGoble: false,
        origPassMd5: null,
        oldpolicyinfo: null,
        init: function (container, policy) {
            // 绑定事件
            this.view = container;
            this.bindEvent(container);
            this.validationEvent(container);
            // 初始化策略内容
            if (policy['50BAC747-7D02-4969-AF79-45EE47365C81_1']) {
                // 策略初始化赋值
                //console.log(policy);
                this.toHtml(container, policy['50BAC747-7D02-4969-AF79-45EE47365C81_1']);
            }

            if (policy['EB8AFFA5-0710-47E6-8F53-55CAE55E1915_1']) {
                // 策略初始化赋值
                //console.log(policy);
                this.toHtml3(container, policy['EB8AFFA5-0710-47E6-8F53-55CAE55E1915_1']);
            }

            if (policy['autoGroup_1']) {
                // 策略初始化赋值
                //console.log(policy);
                op.oldpolicyinfo = $.extend(true, [], policy['autoGroup_1']);
                this.toHtml2(container, policy['autoGroup_1']);

                this.toHtml4(container, policy['log']);
            }

            // 下拉列表美化
            container.find('select').selectric({
                inheritOriginalWidth: true
            });

            container.find(':radio:checked').each(function (i, item) {
                $(item).closest('label').css('color', '#29bcef');
            });

        },
        bindEvent: function (container) {

            // 锁定图标
            container.on('click', 'i.lock', function () {
                $(this).toggleClass('enableLock');
                return false;
            });

            container.on('change', '[name=Authentication]', function () {
                var that = $(this);
                var checked = that.prop('checked');
                var dl = that.closest('dl');
                if (checked) {
                    dl.find('[name=username],[name=password]').prop('disabled', false);
                } else {
                    dl.find('[name=username],[name=password]').prop('disabled', true);
                }

            });

            container.on('click', ':radio', function () {
                var that = $(this),
                    name = that.attr('name');
                container.find(':radio[name=' + name + ']').each(function (i, item) {
                    $(item).closest('label').css('color', '#444');
                });
                that.closest('label').css('color', '#29bcef');
            });

            //week 事件
            container.on('click', '.policy-week label', function () {
                var check = $(this).find('input');
                if (check.prop('checked')) {
                    $(this).addClass('active');
                } else {
                    $(this).removeClass('active');
                }
            });

            /*时间控件*/
            container.find('.js_time').datetimepicker({
                datepicker: false,
                format: 'H:i',
                step: 1
            });

            var pwd = container.find('#epmsg_admin_pwd'),
                show = container.find('#epmsg_admin_pwd_show');
            container.on('mousedown', '#showPWD', function () {
                pwd.hide();
                show.val(pwd.val()).show();
            }).on('mouseup', '#showPWD', function () {
                show.hide();
                pwd.show();
            });

            container.on('keyup', '#epmsg_admin_pwd', function () {
                container.find('#showPWD').removeClass('hide');
            });


            container.on('click', '.js_rule_del', function () {
                var obj = $(this).closest('.autoGroupRule');
                var fa = $(this).closest('.autoGroupRuleLi');
                obj.fadeOut(400, function () {
                    obj.remove();
                    fa.find('.js_and:eq(0)').css({
                        'visibility': 'hidden'
                    });
                });
            });

            container.on('click', '#autoGroup_addRule', function () {
                op.autoGroupList(container);
                container.find('#autoGroup_modal').modal();
            });

            container.on('click', '#autoGroup_reAuto', function () {
                RsCore.ajax('Group/autoAll', function (data) {
                    RsCore.msg.success('重新入组成功 !');
                });
            });

            container.on('click', '#autoGroup_chioce', function () {
                var obj = container.find('[name=autoGroupID]:checked');
                var id = obj.attr('id');
                var name = obj.attr('gName');
                if (obj.length) {
                    container.find('#autoGroup_modal').modal('hide');
                    op.ruleBox(id, name, null, true);
                    container.find('.js_no_data').hide();
                    container.find('.autoGroupRuleLi .autoGroup_opt a').removeClass('disabled');
                    container.find('.autoGroupRuleLi:first').find('.js_rules_up').addClass('disabled');
                    container.find('.autoGroupRuleLi:last').find('.js_rules_down').addClass('disabled');
                } else {
                    RsCore.msg.warn('请选择分组 !');
                }

            });

            container.on('click', '.js_rule_ip', function () {
                var obj = $(this).closest('.autoGroupRuleLi').find('.autoGroupBod');
                obj.append(op.ipRule());
            });
            container.on('click', '.js_rule_sys', function () {
                var obj = $(this).closest('.autoGroupRuleLi').find('.autoGroupBod');
                obj.append(op.osRule());
            });
            container.on('click', '.js_rule_name', function () {
                var obj = $(this).closest('.autoGroupRuleLi').find('.autoGroupBod');
                obj.append(op.computerRule());
            });

            container.on('click', '.js_rules_del', function () {
                var obj = $(this).closest('.autoGroupRuleLi');
                obj.fadeOut(400, function () {
                    obj.remove();
                    if (container.find('.autoGroupRuleLi').length < 1) {
                        container.find('.js_no_data').show();
                    }
                    container.find('.autoGroupRuleLi .autoGroup_opt a').removeClass('disabled');
                    container.find('.autoGroupRuleLi:first').find('.js_rules_up').addClass('disabled');
                    container.find('.autoGroupRuleLi:last').find('.js_rules_down').addClass('disabled');
                });
            });

            container.on('click', '.js_rules_up', function () {
                var obj = $(this).closest('.autoGroupRuleLi');
                var prev = obj.prev();
                if (prev.hasClass('autoGroupRuleLi')) {
                    obj.fadeOut(400, function () {
                        obj.remove();
                        prev.before(obj);
                        obj.fadeIn();
                        container.find('.autoGroupRuleLi .autoGroup_opt a').removeClass('disabled');
                        container.find('.autoGroupRuleLi:first').find('.js_rules_up').addClass('disabled');
                        container.find('.autoGroupRuleLi:last').find('.js_rules_down').addClass('disabled');
                    });
                }

            });

            container.on('click', '.js_rules_down', function () {
                var obj = $(this).closest('.autoGroupRuleLi');
                var next = obj.next();
                if (next.hasClass('autoGroupRuleLi')) {
                    obj.fadeOut(400, function () {
                        obj.remove();
                        next.after(obj);
                        obj.fadeIn();
                        container.find('.autoGroupRuleLi .autoGroup_opt a').removeClass('disabled');
                        container.find('.autoGroupRuleLi:first').find('.js_rules_up').addClass('disabled');
                        container.find('.autoGroupRuleLi:last').find('.js_rules_down').addClass('disabled');
                    });
                }

            });

            container.on('change', '.autoGroupRule[type=ip] select', function () {
                var that = $(this);
                if (that.val() > 1) {
                    that.closest('.autoGroupRule').find('.js_hide').removeClass('hide');
                } else {
                    that.closest('.autoGroupRule').find('.js_hide').addClass('hide');
                }
            });


            /*策略保存*/
            container.on('click', '#policy-save', function () {
                var params = getUrlSearchQuerys();
                if (!op.valida()) {
                    RsCore.msg.warn('组策略设置', '数据错误');
                    return false;
                }
                $(this).button('loading');

                var policys = RsCore.config.sys.policy,
                    eid = RsCore.cache.group.eid,
                    gid = params['g'] /*view.find('.client-list li.active a').attr('da-toggle').substring(1)*/,
                    cid = params['c'] || '';

                var tickDone = 0,
                    tickCom = 0;
                function ajaxTick() {
                    if (tickDone != 2) {
                        return false;
                    }
                    if (tickDone == 2) {
                        container.find('#policy-save').button('reset');
                        RsCore.msg.success('策略保存成功 !');
                    }
                    if (tickCom == 2 && tickDone != 2) {
                        container.find('#policy-save').button('reset');
                        RsCore.msg.success('策略保存失败 !');
                    }
                }
                if (op.noGoble) {

                    var json = op.toJson(container.find('#policyContent')),
                        json3 = op.toJson3(container.find('#policyContent'));
                    RsCore.ajax('Policy/editPolicy', {
                        'eid': eid ? eid : '', //企业id
                        'objid': cid ? cid : (gid ? gid : (eid ? eid : '')), //企业id/组id/终端sguid
                        'productid': policys[0].value.split('_')[0], //产品id
                        'productname': policys[0].name, //产品名称
                        'grouptype': cid ? 2 : 1, //组类型(策略类型)
                        'policytype': policys[0].value.split('_')[1], //策略小类型
                        'desp': '', //描述
                        'policyinfo': JSON.stringify(json),
                        'type': 0
                    }, function (data) {
                        tickDone++;
                    }, function () {
                        tickCom++;
                        ajaxTick();
                    });
                    RsCore.ajax('Policy/editPolicy', {
                        'eid': eid ? eid : '', //企业id
                        'objid': cid ? cid : (gid ? gid : (eid ? eid : '')), //企业id/组id/终端sguid
                        'productid': policys[1].value.split('_')[0], //产品id
                        'productname': policys[1].name, //产品名称
                        'grouptype': cid ? 2 : 1, //组类型(策略类型)
                        'policytype': policys[1].value.split('_')[1], //策略小类型
                        'desp': '', //描述
                        'policyinfo': JSON.stringify(json3),
                        'type': 0
                    }, function (data) {
                        tickDone++;
                    }, function () {
                        tickCom++;
                        ajaxTick();
                    });


                } else {
                    var tickDone = 0,
                        tickCom = 0;
                    var json2 = op.toJson2(container.find('#policyContent'));
                    var json4 = op.toJson4(container.find('#policyContent'));
                    RsCore.ajax('Policy/editPolicy', {
                        'eid': eid ? eid : '', //企业id
                        'objid': cid ? cid : (gid ? gid : (eid ? eid : '')), //企业id/组id/终端sguid
                        'productid': policys[2].value.split('_')[0], //产品id
                        'productname': policys[2].name, //产品名称
                        'grouptype': cid ? 2 : 1, //组类型(策略类型)
                        'policytype': policys[2].value.split('_')[1], //策略小类型
                        'desp': '', //描述
                        'policyinfo': JSON.stringify(json2),
                        'oldpolicyinfo': JSON.stringify(op.oldpolicyinfo),
                        'type': 1
                    }, function (data) {
                        tickDone++;
                    }, function () {
                        tickCom++;
                        ajaxTick();
                    });
                    RsCore.ajax('Enterprisemanager/setLogs', {
                        'strJson': JSON.stringify(json4)
                    }, function (data) {
                        tickDone++;
                    }, function () {
                        tickCom++;
                        ajaxTick();
                    });
                }





                //console.log(JSON.stringify(json));
                //$('#txtJSONTest').val(JSON.stringify(json));
            });



            var navTick = false;
            /*导航*/
            container.on('click', '#policyTab a', function () {
                if ($(this).attr('da-toggle') == 'tab-auto') {
                    return false;
                }
                navTick = true;
                var tag = $(this).attr('da-toggle');
                var wrapTop = $('.c-moudle-wrap').offset().top;
                var wrapScroolTop = $('.c-moudle-wrap').scrollTop();
                var objTop = container.find(tag).offset().top;
                var top = wrapScroolTop + objTop - wrapTop;
                $('.c-moudle-wrap').trigger('goTo', {
                    top: top
                });
                $('.policy-bod').removeClass('active');

                $(this).parent().addClass('active').siblings().removeClass('active');
                $(tag).find('> .policy-bod').addClass('active');
            });

            $(window).on('resize.policy', function () {
                $('.c-moudle-wrap').slimscroll({
                    height: $('.c-page-content').height() - $('.c-moudle-nav').outerHeight() - 45,
                    alwaysVisible: true,
                    size: '4px'
                });
            }).trigger('resize.policy');

            var objs = [];
            $('#policyTab a').each(function (i, item) {
                var obj = $(item),
                    tag = obj.attr('da-toggle'),
                    top = $(tag).offset().top;
                objs.push({
                    tag: tag,
                    obj: obj,
                    top: top
                });
            });
            $('.c-moudle-wrap').on('scroll', function (e) {
                if ($('[da-toggle="#tab-auto"]')) {
                    return false;
                }
                if (navTick) {
                    navTick = false;
                    return false;
                }
                var that = $(this),
                    objtop = that.scrollTop() + that.offset().top;
                for (var i = objs.length - 1; i >= 0; i--) {
                    //console.log(objs[i].top,objtop)
                    if (objs[i].top <= objtop) {
                        objs[i].obj.parent().addClass('active').siblings().removeClass('active');
                        $('.policy-bod').removeClass('active');
                        $(objs[i].tag).find('.policy-bod').addClass('active');
                        return false;
                    }
                }

            });

        },
        valida: function () {
            op.view.find('[validation]:visible').trigger('blur');
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
                },
                require: function (obj) {
                    return obj.val().length > 0;
                }
            };

            container.on('blur', '[validation]:visible', function () {
                var that = $(this),
                    funcs = that.attr('validation').split(/\s+/),
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

            var config = {};

            // config.subproductlist = {};
            // config.subproductlist.subproduct = [];
            // var subproducts = container.find('.subproduct dd');
            // for(var i =0;i<subproducts.length;i++){
            //     var subproduct = {};
            //     var sub_name = $(subproducts[i]).attr('id');
            //     var val = container.find('[name='+sub_name+']:checked').val();
            //     subproduct['@value'] = sub_name;
            //     subproduct['@attributes'] = { state : Number(val)};
            //     config.subproductlist.subproduct.push(subproduct);
            // }
            config.connect = {};
            config.connect.item = {};
            config.connect.item['@attributes'] = {
                name: 'rechttps'
            };
            config.connect.item.type = {};
            config.connect.item.type['@value'] = 'rshttp';
            config.connect.item.path = {};
            config.connect.item.path['@value'] = 'https://rsup16.rising.com.cn/rsv16/';

            config.netconfig = {};
            config.netconfig.nettype = {};
            config.netconfig.nettype['@attributes'] = {
                lock: Number($('#nettypeLock').hasClass('enableLock'))
            };
            config.netconfig.nettype['@value'] = Number(container.find('[name=nettype]:checked').val());

            config.netconfig.xfwurllib = {};
            config.netconfig.xfwurllib['@attributes'] = {
                lock: Number($('#xfwurllibLock').hasClass('enableLock'))
            };
            config.netconfig.xfwurllib['@value'] = Number(container.find('[name=xfwurllib]').prop('checked'));
            config.netconfig.proxy = {};
            config.netconfig.proxy.ip = {};
            config.netconfig.proxy.ip['@attributes'] = {
                lock: Number($('#nettypeLock').hasClass('enableLock'))
            };
            config.netconfig.proxy.ip['@value'] = container.find('[name=ip]').val();
            config.netconfig.proxy.port = {};
            config.netconfig.proxy.port['@attributes'] = {
                lock: Number($('#nettypeLock').hasClass('enableLock'))
            };
            config.netconfig.proxy.port['@value'] = container.find('[name=port]').val();
            config.netconfig.proxy.Authentication = {};
            config.netconfig.proxy.Authentication['@attributes'] = {
                lock: Number($('#nettypeLock').hasClass('enableLock'))
            };
            config.netconfig.proxy.Authentication['@value'] = Number(container.find('[name=Authentication]').prop('checked'));
            config.netconfig.proxy.username = {};
            config.netconfig.proxy.username['@attributes'] = {
                lock: Number($('#nettypeLock').hasClass('enableLock'))
            };
            config.netconfig.proxy.username['@value'] = container.find('[name=username]').val() || '';
            config.netconfig.proxy.password = {};
            config.netconfig.proxy.password['@attributes'] = {
                lock: Number($('#nettypeLock').hasClass('enableLock'))
            };
            config.netconfig.proxy.password['@value'] = container.find('[name=password]').val() || '';

            config.netconfig.update = {};
            switch (container.find(':radio[name=policy_time]:checked').val()) {
                case '2': //手动
                    config.netconfig.update['@attributes'] = {
                        time: '2',
                        lock: Number($('#policyLock').hasClass('enableLock'))
                    };
                    break;
                case '0': //每天
                    config.netconfig.update['@attributes'] = {
                        time: '0|' + container.find('[name=policy_timeTxt]').val(),
                        lock: Number($('#policyLock').hasClass('enableLock'))
                    };
                    break;
                case '1': //每周                    
                    var bitOr = 0;
                    container.find(':checkbox[name=policy_timeWeek]:checked').each(function (i, item) {
                        bitOr = bitOr | item.value;
                    });
                    config.netconfig.update['@attributes'] = {
                        time: '1|' + bitOr + '|' + container.find('[name=policy_timeTxt2]').val(),
                        lock: Number($('#policyLock').hasClass('enableLock'))
                    };
                    break;
            }

            config.netconfig.update.type = {};
            config.netconfig.update.type['@attributes'] = {
                lock: Number($('#upLock').hasClass('enableLock'))
            };
            config.netconfig.update.type['@value'] = container.find('[name=component]:checked').attr('libtype');
            config.netconfig.update.MaxDelay = {};
            config.netconfig.update.MaxDelay['@attributes'] = {
                admin: 1
            };
            config.netconfig.update.MaxDelay['@value'] = 0;
            config.netconfig.update.virslib = {};
            config.netconfig.update.virslib['@attributes'] = {
                admin: 1
            };
            config.netconfig.update.virslib['@value'] = 1;


            var json = {
                config: config
            };
            return json;

        },
        toJson2: function (container) {
            function getGroup(obj) {
                var target = obj.find('.autoGroupRule');
                var group = {};
                group.groupid = Number(obj.attr('id'));
                group.rule = [];
                for (var i = 0; i < target.length; i++) {
                    group.rule.push(getRule($(target[i])));
                }
                return group;
            }

            function getRule(obj) {
                var rule = {};
                rule.type = obj.attr('type');
                rule.symbol = getSymbol(rule.type, obj.find('select option:selected').val());
                var ipts = obj.find('input[type=text]');
                var value = [];
                for (var i = 0; i < ipts.length; i++) {
                    var val = $(ipts[i]).val();
                    val && value.push(val);
                }
                rule.value = value.join('-');
                return rule;
            }

            function getSymbol(type, val) {
                var symbol = ['equal', 'notequal', 'in', 'notin'],
                    symbol2 = ['has', 'nothas'];
                if (type == 'ip') {
                    return symbol[val];
                } else {
                    return symbol2[val];
                }

            }

            var lis = container.find('.autoGroupRuleLi');
            var result = [];
            for (var i = 0; i < lis.length; i++) {
                result.push(getGroup($(lis[i])));
            }

            return result;
        },

        toJson3: function (container) {
            var epmsg = {};
            epmsg.eptray = {};
            epmsg.eptray.Hide = {};
            epmsg.eptray.Hide['@attributes'] = {
                lock: Number(container.find('#eptrayLock').hasClass('enableLock'))
            };
            epmsg.eptray.Hide['@value'] = Number(container.find('#eptray_lock').prop('checked'));
            epmsg.s = {};
            epmsg.s.k = {};
            epmsg.s.k['@attributes'] = {
                lock: Number(container.find('#epmsg_admin_pwdLock').hasClass('enableLock'))
            };
            var pass = container.find('#epmsg_admin_pwd').val(),
                useold = pass === '******',
                password = (pass.length > 0 && !useold) ? $.md5(pass) : (useold ? this.origPassMd5 : '');
            epmsg.s.k['@value'] = ('' + password).toUpperCase();

            var json = {
                epmsg: epmsg
            };
            return json;
        },

        toJson4: function (container) {
            var aJson = [];
            $.each($('.group ul li.hasChange'), function (index, obj) {
                var $this = $(this);
                var obj = {
                    "tablename": $this.find('.Oparetor input').attr('name'),
                    "category": $this.find('.category').text(),
                    "days": $this.find('input[name="num1"]').val(),
                    "cleantype": Number($this.find('.Oparetor input').prop('checked')),
                    "nums": $this.find('input[name="num2"]').val()
                };
                aJson.push(obj);
            });
            return aJson;
        },
        /*toXml: function(json) {
        var xml = mustache.render(xmlTpl, json);
        return xml;
        },*/
        toHtml: function (container, json) {

            /* begin 通用函数 */
            var opLock = function (id, status) {
                if (status == 1) {
                    container.find(id).addClass('enableLock');
                } else {
                    container.find(id).removeClass('enableLock');
                }
            };
            var opSelect = function (id, value) {
                container.find(id + ' option[value=' + value + ']').prop('selected', true);
            };
            var opRadio = function (name, value) {
                container.find(':radio[name=' + name + '][value=' + value + ']').prop('checked', true);
            };
            var opCheck = function (id, status) {
                if (status == 1) {
                    return container.find(id).prop('checked', true);
                } else {
                    return container.find(id).prop('checked', false);
                }
            };

            var config = json.config;
            if (!config) {
                return;
            }

            // var subproductlist = config.subproductlist;
            // var subproduct = subproductlist.subproduct;
            // for(var i=0;i<subproduct.length;i++){
            //     var sub = subproduct[i];
            //     var $sub = container.find('.subproduct dd[id='+sub['@value']+']');
            //     $sub.find('[name='+sub['@value']+'][value='+sub['@attributes']['state']+']').prop('checked',true);
            // }

            var netconfig = config.netconfig;
            var nettype = netconfig.nettype;
            container.find('[name=nettype][value=' + nettype['@value'] + ']').prop('checked', true);
            opLock('#nettypeLock', nettype['@attributes'] ? nettype['@attributes'].lock : 0);
            var xfwurllib = netconfig.xfwurllib;
            if (xfwurllib) {
                opLock('#xfwurllibLock', xfwurllib['@attributes'].lock);
                opCheck('[name=xfwurllib]', xfwurllib['@value']);
            }

            var proxy = netconfig.proxy;
            container.find('[name=ip]').val(proxy.ip['@value']);
            container.find('[name=port]').val(proxy.port['@value']);
            container.find('[name=username]').val(proxy.username['@value']);
            container.find('[name=password]').val(proxy.password['@value']);
            var $auth = container.find('[name=Authentication]');
            if (proxy.Authentication['@value'] == 1) {
                $auth.prop('checked', true).trigger('change');
            } else {
                $auth.prop('checked', false).trigger('change');
            }

            var update = netconfig.update;
            var updateVal = update['@attributes']['time'].split('|');
            opLock('#policyLock', update['@attributes'].lock ? update['@attributes'].lock : 0);
            container.find('[name=policy_time][value=' + updateVal[0] + ']').prop('checked', true);
            switch (updateVal[0]) {
                case '0':
                    container.find('[name=policy_timeTxt]').val(updateVal[1]);
                    break;
                case '1':
                    container.find('[name=policy_timeWeek]').each(function (i, item) {
                        if ((item.value | Number(updateVal[1])) == Number(updateVal[1])) {
                            item.checked = true;
                            $(item).parent().addClass('active');
                        } else {
                            item.checked = false;
                        }
                    });
                    container.find('[name=policy_timeTxt2]').val(updateVal[2]);
                    break;
                case '2':
                    break;
            }
            container.find('[name=component][libtype=' + update.type['@value'] + ']').prop('checked', true);
            opLock('#upLock', update.type['@attributes'] ? update.type['@attributes'].lock : 0);

        },
        autoGroupList: function (container) {
            var list = RsCore.cache.group.list;
            if (list) {
                var _html = [];
                for (var i in list) {
                    if (list[i].id == '-1') {
                        continue;
                    }
                    _html.push('<li><label class="radio"><input type="radio" id="' + i + '" gName="' + list[i].groupname + '" name="autoGroupID">' + list[i].groupname + '</label></li>');
                }
                container.find('#autoGroup_list').html(_html.join(''));
            }
        },
        ipRule: function (opt) {
            var config = {
                symbol: 0,
                value: ''
            };
            config = $.extend(config, opt);
            var syb = config.symbol,
                val1 = config.value ? config.value.split('-')[0] : '',
                val2 = config.value && config.value.split('-')[1] || '';
            var html = '<div class="autoGroupRule" type="ip">' +
                '<a href="javascript:;" class="js_rule_del auto-del"></a>' +
                '<span class="js_and"> 且 </span>' +
                '<strong>IP匹配规则</strong>  ' +
                '<span><select name="" style="width:120px;">' +
                '<option value="0" ' + (syb == 0 ? 'selected' : '') + '>等于</option>' +
                '<option value="1" ' + (syb == 1 ? 'selected' : '') + '>不等于</option>' +
                '<option value="2" ' + (syb == 2 ? 'selected' : '') + '>包含于</option>' +
                '<option value="3" ' + (syb == 3 ? 'selected' : '') + '>不包含于</option>' +
                '</select></span>  ' +
                '<input type="text" class="input-medium" value="' + val1 + '" validation="ip require"/>' +
                '<span class="js_hide ' + (syb > 1 ? '' : 'hide') + '"> ~ <input type="text" class="input-medium" value="' + val2 + '" validation="ip require"></span>' +
                '</div>';
            var $html = $(html);
            $html.find('select').selectric({
                inheritOriginalWidth: true
            });
            return $html;
        },
        osRule: function (opt) {
            var config = {
                symbol: 0,
                value: ''
            };
            config = $.extend(config, opt);
            var syb = config.symbol,
                val1 = config.value ? config.value : '';
            var html = '<div class="autoGroupRule" type="os">' +
                '<a href="javascript:;" class="js_rule_del auto-del"></a>' +
                '<span class="js_and"> 且 </span>' +
                '<strong>操作系统规则</strong>  ' +
                '<span><select name="" style="width:120px;">' +
                '<option value="0" ' + (syb == 0 ? 'selected' : '') + '>包含</option>' +
                '<option value="1" ' + (syb == 1 ? 'selected' : '') + '>不包含于</option>' +
                '</select></span>  ' +
                '<input type="text" class="input-medium" value="' + val1 + '" validation="require"/>' +
                '</div>';
            var $html = $(html);
            $html.find('select').selectric({
                inheritOriginalWidth: true
            });
            return $html;
        },
        computerRule: function (opt) {
            var config = {
                symbol: 0,
                value: ''
            };
            config = $.extend(config, opt);
            var syb = config.symbol,
                val1 = config.value ? config.value : '';
            var html = '<div class="autoGroupRule" type="computername">' +
                '<a href="javascript:;" class="js_rule_del auto-del"></a>' +
                '<span class="js_and"> 且 </span>' +
                '<strong>计算机名称规则</strong>  ' +
                '<span><select name="" style="width:120px;">' +
                '<option value="0" ' + (syb == 0 ? 'selected' : '') + '>包含</option>' +
                '<option value="1" ' + (syb == 1 ? 'selected' : '') + '>不包含于</option>' +
                '</select></span>  ' +
                '<input type="text" class="input-medium" value="' + val1 + '" validation="require"/>' +
                '</div>';
            var $html = $(html);
            $html.find('select').selectric({
                inheritOriginalWidth: true
            });
            return $html;
        },
        ruleBox: function (id, name, _html, flag) {
            var html = '<li class="autoGroupRuleLi" id="' + id + '">' +
                '<div class="autoGroupTit">' +
                '<div class="autoGroup_opt">' +
                '<a href="javascript:;" class="js_rules_del auto-del"></a>  ' +
                '<a href="javascript:;" class="js_rules_up auto-up disabled"></a>  ' +
                '<a href="javascript:;" class="js_rules_down auto-down disabled"></a>  ' +
                '</div>' +
                '<h3 class="autoGroup_Name"><em>' + name + '</em>' +
                '<a href="javascript:;" class="js_rule_ip">IP匹配规则</a>' +
                '<a href="javascript:;" class="js_rule_sys">操作系统规则</a>' +
                '<a href="javascript:;" class="js_rule_name">计算机名称规则</a>' +
                '</h3>' +
                '</div>' +
                '<div class="autoGroupBod">' +
                '</div>' +
                '<div class="autoGroupFooter">' +
                '</div>' +
                '</li>';
            var $html = $(html);
            if (_html) {
                $html.find('.autoGroupBod').append(_html);
            } else {
                $html.find('.autoGroupBod').append(op.ipRule());
            }

            $html.find('.js_and:eq(0)').css({
                'visibility': 'hidden'
            });


            $('.autoGroupUL').append($html);
            if (flag) {
                $html.find('input[type=text]:eq(0)').focus();
            }

        },
        toHtml2: function (container, json) {
            var len = 0;
            var opt = {
                'ip': op.ipRule,
                'os': op.osRule,
                'computername': op.computerRule
            };
            var symbol = ['equal', 'notequal', 'in', 'notin'],
                symbol2 = ['has', 'nothas'];
            for (var i = 0; i < json.length; i++) {
                var group = json[i];
                var groupid = group.groupid;
                if (!RsCore.cache.group.list[groupid]) {
                    continue;
                }
                len++;
                var name = RsCore.cache.group.list[groupid].groupname;
                var rules = group.rule;
                var _html = [];
                for (var j = 0; j < rules.length; j++) {
                    var rule = rules[j];
                    if (rule.type == 'ip') {
                        rule.symbol = symbol.indexOf(rule.symbol);
                    } else {
                        rule.symbol = symbol2.indexOf(rule.symbol);
                    }
                    _html.push(opt[rule.type](rule));
                }
                op.ruleBox(groupid, name, _html);
            }
            if (len) {
                container.find('.js_no_data').hide();
                container.find('.autoGroupRuleLi .autoGroup_opt a').removeClass('disabled');
                container.find('.autoGroupRuleLi:first').find('.js_rules_up').addClass('disabled');
                container.find('.autoGroupRuleLi:last').find('.js_rules_down').addClass('disabled');
            } else {
                container.find('.js_no_data').show();
            }
        },
        toHtml3: function (container, json) {
            var epmsg = json.epmsg;
            if (!epmsg) {
                return;
            }

            /* begin 通用函数 */
            var opLock = function (id, status) {
                if (status == 1) {
                    container.find(id).addClass('enableLock');
                } else {
                    container.find(id).removeClass('enableLock');
                }
            };
            var opSelect = function (id, value) {
                container.find(id + ' option[value=' + value + ']').prop('selected', true);
            };
            var opRadio = function (name, value) {
                container.find(':radio[name=' + name + '][value=' + value + ']').prop('checked', true);
            };
            var opCheck = function (id, status) {
                if (status == 1) {
                    return container.find(id).prop('checked', true);
                } else {
                    return container.find(id).prop('checked', false);
                }
            };
            /* end 通用函数 */
            this.origPassMd5 = epmsg.s.k['@value'];
            opLock('#epmsg_admin_pwdLock', epmsg.s.k['@attributes'] && epmsg.s.k['@attributes'].lock);
            container.find('#epmsg_admin_pwd').val(this.origPassMd5 == '' ? '' : '******');
            opLock('#eptrayLock', epmsg.eptray.Hide['@attributes'] && epmsg.eptray.Hide['@attributes'].lock);
            opCheck('#eptray_lock', epmsg.eptray.Hide['@value']);
        },
        toHtml4: function (container, json) {
            var html = '<li>' +
                '<div class="category"></div>' +
                '<div class="shortDiv">保留</div>' +
                '<div class="num">' +
                '<input name="num1" type="text" value="" style="width:30px" />' +
                '</div>' +
                '<div class="timespace">' +
                '<span>天</span>' +
                '</div>' +
                '<div class="Oparetor">' +
                '<input type="checkbox" value="1"><label>或者</label>' +
                '</div>' +
                '<div class="shortDiv js_showOrHide">超过</div>' +
                '<div class="num js_showOrHide">' +
                '<input name="num2" type="text" value="" title="1000到100000" style="width:60px" />' +
                '</div>' +
                '<div class="spliter js_showOrHide">条记录</div>' +
                '</li>';

            var $html = $(html);

            //这里的数据从隐藏域中获得
            var aHtml = [];
            $.each(json, function (index, obj) {
                aHtml.push($html.clone().find('.category').text(obj.category)
                    .end().find('input[name="num1"]').val(obj.days)
                    .end().find('.Oparetor input').attr('name', obj.tablename)
                    .end().find('.Oparetor input').attr('checked', !!Number(obj.cleantype))
                    .end().find('input[name="num2"]').val(obj.nums)
                    .end().find('.js_showOrHide').css('display', !!Number(obj.cleantype) ? 'inline-block' : 'none')
                    .end());
            });
            $('.group ul').append(aHtml);

            //num1和num2只能输入数字
            container.find('input[name="num1"],input[name="num2"]').keydown(function (e) {
                var keyCode = e.which;

                if (keyCode != 8 && keyCode != 37 && keyCode != 39 && keyCode != 46 && (keyCode < 48 || keyCode > 57) && (keyCode < 96 || keyCode > 105)) {
                    return false;
                }
            }).blur(function () {
                $(this).val(function (index, value) {
                    //如果是num1则默认为0，num2可以为空
                    var res = 0;
                    if ($(this).attr('name') == 'num1') {
                        value = value == '' ? 0 : value;
                        res = parseInt(value, 10);
                    } else {
                        if (value == '') {
                            res = value;
                        } else {
                            res = parseInt(value, 10);

                            //数量在1000-100000之间
                            if (res < 1000 || res > 100000) {
                                res = '';
                            }
                        }
                    }

                    return res;
                });
            });

            //用于提交改变项的值
            container.find('.group ul li :input').change(function () {
                $(this).closest('li').addClass('hasChange');
            });

            container.find('.Oparetor input').change(function () {
                $(this).closest('li').find('.js_showOrHide').css('display', $(this)[0].checked ? 'inline-block' : 'none')
            });
        }
    };

    return {
        container: '.c-page-content',
        render: function (container) {
            document.title = '全网终端-设置';
            var policys = RsCore.config.sys.policy,
                path = window.location.hash.split('?')[0],
                params = getUrlSearchQuerys(),
                groupId = params['g'],
                policyJSON = {};

            if (RsCore.cache.group.list[groupId]) {
                if (RsCore.cache.group.list[groupId].type == 2) {
                    $('.c-page-nav .nav li:eq(0) a').trigger('click');
                    return;
                }
                if (groupId == '-1') {
                    $('.c-page-nav .nav li:eq(0) a').trigger('click');
                    return;
                }
            }
            if (!groupId && !params['c']) {
                $(container).append('<div  class="coming"></div>');
                return false;
            }
            var view = '';
            if (groupId != '0') {
                view = mustache.render(tpl, {
                    noGoble: true
                });
                op.noGoble = true;
            } else {
                view = mustache.render(tpl, {
                    noGoble: false
                });
                op.noGoble = false;
            }

            $(container).append(view);

            if (op.noGoble) {
                var tick = 0;
                RsCore.ajax('Policy/getPolicy', {
                    grouptype: params['c'] ? 2 : 1,
                    objid: params['c'] || params['g'],
                    productid: policys[0].value.split('_')[0],
                    eid: RsCore.cache.group.eid,
                    policytype: policys[0].value.split('_')[1]
                }, function (result) {
                    if (result) {
                        policyJSON[policys[0].value] = $.parseJSON(result.policyjson);
                    } else {
                        policyJSON[policys[0].value] = null;
                    }
                    tick++;
                    if (tick == 2) {
                        op.init($(container), policyJSON);
                    }

                });
                RsCore.ajax('Policy/getPolicy', {
                    grouptype: params['c'] ? 2 : 1,
                    objid: params['c'] || params['g'],
                    productid: policys[1].value.split('_')[0],
                    eid: RsCore.cache.group.eid,
                    policytype: policys[1].value.split('_')[1]
                }, function (result) {
                    if (result) {
                        policyJSON[policys[1].value] = $.parseJSON(result.policyjson);
                    } else {
                        policyJSON[policys[1].value] = null;
                    }
                    tick++;
                    if (tick == 2) {
                        op.init($(container), policyJSON);
                    }
                });
            } else {
                var tick = 0;
                RsCore.ajax('Policy/getAutoGroup', function (result) {
                    if (result) {
                        policyJSON[policys[2].value] = result;
                    } else {
                        policyJSON[policys[2].value] = null;
                    }
                    tick++;
                    if (tick == 2) {
                        op.init($(container), policyJSON);
                    }
                });

                RsCore.ajax('Enterprisemanager/getLogsSet', function (result) {
                    if (result) {
                        policyJSON[policys[3].value] = result;
                    } else {
                        policyJSON[policys[3].value] = null;
                    }
                    tick++;
                    if (tick == 2) {
                        op.init($(container), policyJSON);
                    }
                })
            }






        },
        destroy: function () {
            $(window).off('resize.policy');
            $('.c-moudle-wrap').off('scroll');
            $(this.container).find('.c-moudle-wrap').slimscroll({
                destroy: true
            });
            $(this.container).off().empty();
        }
    };
});