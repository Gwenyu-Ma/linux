define(function(require) {
    var tpl = require('text!virus/policy.html');
    var getUrlSearchQuerys = RsCore.assist.getUrlSearchQuerys;
    require('selectric');
    require('css!selectric');
    require('datetimepicker');
    require('css!datetimepicker');
    require('slimscroll');

    var op = {
        view: null,
        init: function(container, policy) {
            // 绑定事件
            this.view = container;
            this.bindEvent(container);
            this.validationEvent(container);
            // 初始化策略内容
            if (policy['D49170C0-B076-4795-B079-0F97560485AF_1']) {
                // 策略初始化赋值
                //console.log(policy);
                this.toHtml(container, policy['D49170C0-B076-4795-B079-0F97560485AF_1']);
            }
            if (policy['A40D11F7-63D2-469d-BC9C-E10EB5EF32DB_1']) {
                // 策略初始化赋值
                //console.log(policy);
                this.toHtml2(container, policy['A40D11F7-63D2-469d-BC9C-E10EB5EF32DB_1']);
            }

            // 下拉列表美化
            container.find('select').selectric({
                inheritOriginalWidth: true
            });

            container.find(':radio:checked').each(function(i, item) {
                $(item).closest('label').css('color', '#29bcef');
            });
        },
        bindEvent: function(container) {
            // 锁定图标
            container.on('click', 'i.lock', function() {
                $(this).toggleClass('enableLock');
                return false;
            });

            container.on('click', ':radio', function() {
                var that = $(this),
                    name = that.attr('name');
                container.find(':radio[name=' + name + ']').each(function(i, item) {
                    $(item).closest('label').css('color', '#444');
                });
                that.closest('label').css('color', '#29bcef');
            });

            //week 事件
            container.on('click', '.policy-week label', function() {
                var check = $(this).find('input');
                if (check.prop('checked')) {
                    $(this).addClass('active');
                } else {
                    $(this).removeClass('active');
                }
            });
            // 验证提示
            container.find('#pub_txtCloudCount').tooltip();

            $('.js_white_wrap').slimscroll({
                height: 88,
                size: '4px'
            });

            /* begin 公共设置 */
            // 白名单、排除列表
            container.on('click', '#pub_btnAddWhiteList', function() {
                var exist = false;
                var type = container.find('#pub_selFileType').val();
                var title = container.find('#pub_txtFile').val();
                var listType = ['文件','仅本目录','本目录+子目录','仅子目录','文件哈希'];
                if (title) {
                    container.find('#pub_tbWhiteList tr').find('>td:first').each(function() {
                        if ($(this).attr('title') == title) {
                            container.find('#pub_txtFile').tooltip({
                                title: '已存在',
                                trigger: 'manual'
                            }).tooltip('show');
                            exist = true;
                            return false;
                        }
                    });
                    !exist && container.find('#pub_tbWhiteList').prepend('<tr><td style="width:300px;" filetype="' + type + '" title="' + title + '">' + title + '<td style="width:80px;">'+listType[type]+'</td><td ><i class="pub_btnRemove del">&nbsp;</i></td></tr>');
                    container.find('#pub_tbWhiteList tr.blank:first').remove();
                } else {
                    container.find('#pub_txtFile').tooltip({
                        title: '不允许为空',
                        trigger: 'manual'
                    }).tooltip('show');
                }
            });
            container.on('blur', '#pub_btnAddWhiteList', function() {
                container.find('#pub_txtFile').tooltip('destroy');
            });
            container.on('keyup', '#pub_txtFile', function() {
                container.find('#pub_txtFile').tooltip('destroy');
            });
            container.on('click', '.pub_btnRemove', function() {
                $(this).closest('tr').remove();
                return false;
            });

            //黑名单
            container.on('click', '#pub_btnAddBlackList', function() {
                var exist = false;
                var type = container.find('#pub_selFileTypeBlack').val();
                var title = container.find('#pub_txtFileBlack').val();
                var listType = ['文件','仅本目录','本目录+子目录','仅子目录','文件哈希'];
                if (title) {
                    container.find('#pub_tbBlackList tr').find('>td:first').each(function() {
                        if ($(this).attr('title') == title) {
                            container.find('#pub_txtFileBlack').tooltip({
                                title: '已存在',
                                trigger: 'manual'
                            }).tooltip('show');
                            exist = true;
                            return false;
                        }
                    });
                    !exist && container.find('#pub_tbBlackList').prepend('<tr><td style="width:300px;" filetype="' + type + '" title="' + title + '">' + title + '<td style="width:80px;">'+listType[type]+'</td><td ><i class="pub_btnRemove del">&nbsp;</i></td></tr>');
                    container.find('#pub_tbBlackList tr.blank:first').remove();
                } else {
                    container.find('#pub_txtFileBlack').tooltip({
                        title: '不允许为空',
                        trigger: 'manual'
                    }).tooltip('show');
                }
            });
            container.on('blur', '#pub_btnAddBlackList', function() {
                container.find('#pub_txtFileBlack').tooltip('destroy');
            });
            container.on('keyup', '#pub_txtFileBlack', function() {
                container.find('#pub_txtFileBlack').tooltip('destroy');
            });
            // 启用公有云
            container.on('change', '#publicCloudEnable', function() {
                var inputs = $(this).closest('dt').siblings('dd').find('input');
                if ($(this).prop('checked')) {
                    inputs.prop('disabled', false);
                } else {
                    inputs.prop('disabled', true);
                }
            });

            container.on('click', '.js_addcloud', function() {
                var obj = container.find('#privateCloudTmpl');
                obj.find('[name=privateCloudMode]').attr('name','privateCloudMode_'+new Date().getTime());
                var $html = $('<dd style="display:none">' + obj.html() + '</dd>');
                obj.before($html);
                $html.fadeIn();

            });

            container.on('click', '.js_delcloud', function() {
                var target = $(this).closest('dl').parent();
                target.fadeOut(400, function() {
                    target.remove();
                });
            });
            /* end 公共设置 */

            /* begin 扫描设置 */
            container.on('change', '#scan_chkAllscanEnable,#scan_chkQuickscanEnable', function() {
                if ($(this).prop('checked')) {
                    $(this).closest('label').next('dl').find('input').prop('disabled', false);
                } else {
                    $(this).closest('label').next('dl').find('input').prop('disabled', true);
                }
            });
            /* end 扫描设置 */

            /* begin 文件监控设置 */
            /* end 文件监控设置 */

            /* begin 邮件监控设置 */
            var mail_num = 0;
            container.on('click', '.mail_btnAddPort', function() {
                var _html = '<tr>' +
                    '<td style="width:20px;"><i name="mail_lockMailPortBox" class="lock"></i></td>' +
                    '<td style="width:120px;">' +
                    '<input type="text" value="" style="width:50px;" name="mail_txtMailPort" validation="intNum">' +
                    '</td>' +
                    '<td style="width:265px;">' +
                    '<label class="radio inline">' +
                    '<input name="mail_radMailPort0" type="radio" value="0" checked>SMTP' +
                    '</label>' +
                    '<label class="radio inline">' +
                    '<input name="mail_radMailPort0" type="radio" value="1">POP3' +
                    '</label>' +
                    '</td>' +
                    '<td style="width:40px;">' +
                    '<a href="#" class="mail_btnRemovePort">&nbsp;</a>' +
                    '</td>' +
                    '</tr>';
                var num = $('.mailPortPanel tbody tr').length;
                if (mail_num < num) {
                    mail_num = num;
                }
                mail_num++;
                var mailTpl = _html.replace(new RegExp('mail_radMailPort0', 'g'), ('mail_radMailPort' + mail_num));
                //$(this).closest('dd').after(mailTpl);
                $('.mailPortPanel tbody').prepend(mailTpl);
                $('.mailPortPanel tbody').find('.blank:first').remove();
                return false;
            });
            container.on('click', '.mail_btnRemovePort', function() {
                $(this).closest('tr').remove();
                return false;
            });
            /* end 邮件监控设置 */

            /* begin 应用加固设置 */
            container.on('change', '#app_chkAllaptEnable', function() {
                var inputs = $(this).closest('dl').find('dd input');
                if ($(this).prop('checked')) {
                    inputs.prop('disabled', false);
                } else {
                    inputs.prop('disabled', true);
                }
                $('#app_chkAllaptEnable').prop('disabled', false);
            });
            /* end 应用加固设置 */

            /* begin 系统加固设置 */
            container.on('change', '#sys_chkAllsysdefEnable', function() {
                var inputs = $(this).closest('dl').find('dd input');
                if ($(this).prop('checked')) {
                    inputs.prop('disabled', false);
                } else {
                    inputs.prop('disabled', true);
                }
                $('#sys_chkAllsysdefEnable').prop('disabled', false);
            });
            /* end 系统加固设置 */

            /*时间控件*/
            container.find('.js_time').datetimepicker({
                datepicker: false,
                format: 'H:i',
                step: 1
            });




            /*linux防病毒*/
            /*初始化时间空间*/
            container.find('#scanT').datetimepicker({
                datepicker: false,
                format: 'H:i',
                step: 1
            });

            container.on('click', '#add_ignPath', function() {
                var _val = container.find('.ignPathVal').val();
                if ($.trim(_val) == '') {
                    container.find('.ignPathVal').tooltip({
                        title: '不允许为空',
                        trigger: 'manual'
                    }).tooltip('show');
                    return false;
                }

                var _html = '<tr><td style="width:380px;"><span class="ignPaths">' + _val + '</span></td><td><i class="ignPathsDel del">&nbsp;</i></td></tr>';
                container.find('.li_ignPaths .li_ignPaths_bod').prepend(_html).find('input:firsit').focus();
                container.find('.li_ignPaths .li_ignPaths_bod .blank:first').remove();
                container.find('.ignPathsDel').show();
            });

            container.on('blur', '#add_ignPath', function() {
                container.find('.ignPathVal').tooltip('destroy');
            });

            container.on('keyup', '.ignPathVal', function() {
                container.find('.ignPathVal').tooltip('destroy');
            });

            container.on('click', '.ignPathsDel', function() {
                var _html = '<tr class="blank"><td style="width:380px;"></td><td></td></tr>';
                $(this).closest('tr').remove();
                if (container.find('.li_ignPaths .li_ignPaths_bod tr').length < 3) {
                    container.find('.li_ignPaths .li_ignPaths_bod').append(_html);
                }

            });

            container.on('change', '#setTimeViru', function() {
                if ($(this).prop('checked')) {
                    container.find('[name=scanTime],#scanT').prop('disabled', false);
                } else {
                    container.find('[name=scanTime],#scanT').prop('disabled', true);
                }
            });

            container.on('change', '#keepDayAble', function() {
                var checked = $(this).prop('checked');
                if (checked) {
                    container.find('#keepDay').prop('disabled', false);
                } else {
                    container.find('#keepDay').prop('disabled', true);
                }
            });

            container.on('change', '#compsAble', function() {
                var checked = $(this).prop('checked');
                if (checked) {
                    container.find('#compress').prop('disabled', false);
                } else {
                    container.find('#compress').prop('disabled', true);
                }
            });

            // container.on('change', '[name=ignPath]', function() {
            //     var checked = $(this).prop('checked');
            //     if (checked) {
            //         container.find('.li_ignPaths input').prop('disabled', false);
            //         var dels = container.find('.li_ignPaths .ignPathsDel');
            //         if (dels.length > 1) {
            //             dels.show();
            //         }
            //         container.find('#add_ignPath').prop('disabled', false);
            //     } else {
            //         container.find('.li_ignPaths input').prop('disabled', true);
            //         container.find('.li_ignPaths .ignPathsDel').hide();
            //         container.find('#add_ignPath').prop('disabled', true);
            //     }
            // })



            /*策略保存*/
            container.on('click', '#policy-save', function() {
                var params = getUrlSearchQuerys();
                if (!op.valida()) {
                    RsCore.msg.warn('组策略设置', '数据错误');
                    return false;
                }
                $(this).button('loading');
                var json = op.toJson(container.find('#policyContent')),
                    json2 = op.toJson2(container.find('#policyContent')),
                    policys = RsCore.config.virus.policy,
                    eid = RsCore.cache.group.eid,
                    gid = params['g'] /*view.find('.client-list li.active a').attr('da-toggle').substring(1)*/ ,
                    cid = params['c'] || '';
                // var _type;
                // var _policy = container.find('#policy-product .active a').attr('da-toggle').substring(1);
                // if (globalPolicy.indexOf(_policy) >= 0) {
                //     _type = 1;
                // } else {
                //     _type = 0;
                //     if (!gid && !cid && !eid) return;
                // }
                var tickDone = 0,
                    tickCom = 0;

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
                }, function(data) {
                    tickDone++;

                }, function() {
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
                    'policyinfo': JSON.stringify(json2),
                    'type': 0
                }, function(data) {
                    tickDone++;
                }, function() {
                    tickCom++;
                    ajaxTick();
                });

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


                //console.log(JSON.stringify(json));
                //$('#txtJSONTest').val(JSON.stringify(json));
            });



            var navTick = false;
            /*导航*/
            container.on('click', '#policyTab a', function() {
                navTick = true;
                var tag = $(this).attr('da-toggle');
                var wrapTop = $('.c-moudle-wrap').offset().top;
                var wrapScroolTop = $('.c-moudle-wrap').scrollTop();
                var objTop = container.find(tag).offset().top;
                var top = wrapScroolTop + objTop - wrapTop;
                $('.c-moudle-wrap').trigger('goTo', { top: top });
                $('.policy-bod').removeClass('active');

                $(this).parent().addClass('active').siblings().removeClass('active');
                $(tag).find('> .policy-bod').addClass('active');
            });

            $(window).on('resize.policy', function() {
                $('.c-moudle-wrap').slimscroll({
                    height: $('.c-page-content').height() - $('.c-moudle-nav').outerHeight() - 45,
                    alwaysVisible: true,
                    size: '4px'
                });
            }).trigger('resize.policy');



            var objs = [];
            $('#policyTab a').each(function(i, item) {
                var obj = $(item),
                    tag = obj.attr('da-toggle'),
                    top = $(tag).offset().top;
                objs.push({
                    tag: tag,
                    obj: obj,
                    top: top
                });
            });
            $('.c-moudle-wrap').on('scroll', function(e) {
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
        valida: function() {
            op.view.find('[validation]').trigger('blur');
            if (op.view.find('.error').length) {
                return false;
            }
            return true;
        },
        validationEvent: function(container) {
            /*错误验证事件*/
            var rule = {
                Num: function(obj) {
                    var val = obj.val();
                    return /^[-]?\d+$/.test(val);
                },
                intNum: function(obj) {
                    var val = obj.val();
                    return /^\d+$/.test(val);
                },
                ip: function(obj) {
                    var val = obj.val();
                    return /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i.test(val);
                },
                require: function(obj) {
                    return obj.val().length > 0;
                },
                gte: function(obj) {
                    var val = Number($(obj).val()),
                        _val = Number($(obj).attr('valid_gte'));
                    return val >= _val;
                },
                lte: function(obj) {
                    var val = Number($(obj).val()),
                        _val = Number($(obj).attr('valid_lte'));
                    return val <= _val;
                }
            };

            container.on('blur', '[validation]', function() {
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
        toJson: function(container) {
            var root = {};
            /* begin 公共设置 */
            root.pub = {};
            root.pub.whitelist = {};
            root.pub.whitelist.admin = {};
            root.pub.whitelist.admin["@attributes"] = {
                admin: 1
            };
            root.pub.whitelist.admin.file = {};
            var arrWhiteList = container.find('#pub_tbWhiteList tr').find('>td:first');
            if (arrWhiteList.length > 0) {
                root.pub.whitelist.admin.file.item = [];
                for (var i = 0; i < arrWhiteList.length; i++) {
                    var white_obj = arrWhiteList[i];
                    if (!$(white_obj).attr('filetype')) {
                        continue;
                    }
                    var item = {};
                    item["@attributes"] = {
                        path: $(white_obj).attr('filetype')
                    };
                    item["@value"] = $(white_obj).attr('title');
                    root.pub.whitelist.admin.file.item.push(item);
                }
            }
            root.pub.whitelist.admin.ext = {};
            root.pub.whitelist.admin.ext["@value"] = container.find('#pub_txtExt').val();

            root.pub.blacklist = {};
            root.pub.blacklist.admin = {};
            root.pub.blacklist.admin["@attributes"] ={
                admin:1
            };
            root.pub.blacklist.admin.file = {};
            root.pub.blacklist.admin.hash = {};
            var arrBlackList = container.find('#pub_tbBlackList tr').find('>td:first');
            if (arrBlackList.length > 0) {
                root.pub.blacklist.admin.file.item = [];
                root.pub.blacklist.admin.hash.item = [];
                for (var i = 0; i < arrBlackList.length; i++) {
                    var white_obj = arrBlackList[i];
                    if (!$(white_obj).attr('filetype')) {
                        continue;
                    }
                    var item = {};
                    var type = $(white_obj).attr('filetype'); 
                    if(Number(type)<4){
                        item["@attributes"] = {
                            path: $(white_obj).attr('filetype')
                        };
                        item["@value"] = $(white_obj).attr('title');
                        root.pub.blacklist.admin.file.item.push(item);
                    }else{
                        item["@value"] = $(white_obj).attr('title');
                        root.pub.blacklist.admin.hash.item.push(item);
                    }
                }
            }
        

            root.pub.cloud = {};
            root.pub.cloud.cpuradio = {};
            root.pub.cloud.cpuradio["@attributes"] = { admin: 1 };
            root.pub.cloud.cpuradio["@value"] = container.find('#cpuradio').val();
            root.pub.cloud.connrate = {};
            root.pub.cloud.connrate["@attributes"] = { admin: 1 };
            root.pub.cloud.connrate["@value"] = container.find('#connrate').val();
            root.pub.cloud.servers = {};
            root.pub.cloud.servers.csrv = [];
            var cloud = {};
            cloud["@attributes"] = { private: 0, lock: Number(container.find('#publicCloudLock').hasClass('enableLock')) };
            cloud.enable = {};
            cloud.enable["@value"] = Number(container.find('#publicCloudEnable').prop('checked'));
            cloud.addr = {};
            cloud.addr["@value"] = 'rscloud.rising.net.cn';
            cloud.port = {};
            cloud.port["@value"] = 80;
            cloud.mode = {};
            cloud.mode["@value"] = container.find('.js_cloud:eq(0) [name=publicCloudMode]:checked').val();
            cloud.count = {};
            cloud.count["@value"] = container.find('#publicCloudCount').val() || 0;
            cloud.name = {};
            cloud.name["@value"] = container.find('#publicCloudName').val() || '';
            root.pub.cloud.servers.csrv.push(cloud);
            container.find('.js_cloud:gt(0)').each(function(i, item) {
                var target = $(item);
                if (!(target.parent().attr('id') == 'privateCloudTmpl')) {
                    var cloud = {};
                    cloud["@attributes"] = { private: 1, lock: Number(target.find('.privateCloudLock').hasClass('enableLock')) };
                    cloud.enable = {};
                    cloud.enable["@value"] = Number(container.find('.privateCloudEnable').prop('checked'));
                    cloud.addr = {};
                    cloud.addr["@value"] = target.find('.privateCloudAddr').val();
                    cloud.port = {};
                    cloud.port["@value"] = target.find('.privateCloudPort').val();
                    cloud.mode = {};
                    cloud.mode["@value"] = target.find('[name^=privateCloudMode]:checked').val();
                    cloud.count = {};
                    cloud.count["@value"] = target.find('.privateCloudCount').val() || 0;
                    cloud.name = {};
                    cloud.name["@value"] = target.find('.privateCloudName').val() || '';
                    root.pub.cloud.servers.csrv.push(cloud);
                }
            });


            root.pub.vstore = {};
            root.pub.vstore.nospace = {};
            root.pub.vstore.nospace["@attributes"] = {
                lock: Number(container.find('#pub_lockNospace').hasClass('enableLock'))
            };
            root.pub.vstore.nospace["@value"] = container.find(':radio[name="pub_radNospace"]:checked').val();
            root.pub.vstore.storefailed = {};
            root.pub.vstore.storefailed["@attributes"] = {
                lock: Number(container.find('#pub_lockStorefailed').hasClass('enableLock'))
            };
            root.pub.vstore.storefailed["@value"] = container.find(':radio[name=pub_radStorefailed]:checked').val();
            root.pub.vstore.bigfile = {};
            root.pub.vstore.bigfile["@attributes"] = {
                lock: Number(container.find('#pub_lockBigfile').hasClass('enableLock'))
            };
            root.pub.vstore.bigfile["@value"] = container.find(':radio[name=pub_radBigfile]:checked').val();
            root.pub.vstore.nobackup = {};
            root.pub.vstore.nobackup["@attributes"] = {
                lock: Number(container.find('#pub_lockNobackup').hasClass('enableLock'))
            };
            root.pub.vstore.nobackup["@value"] = Number(!container.find('#pub_chkNobackup').prop('checked'));

            root.pub.vtrack = {};
            root.pub.vtrack["@attributes"] = {
                lock: Number(container.find('#pub_lockVtrack').hasClass('enableLock'))
            };
            root.pub.vtrack["@value"] = Number(container.find('#pub_chkVtrack').prop('checked'));
            //udiskmon 废弃
            // root.pub.udiskmon = {};
            // root.pub.udiskmon["@attributes"] = {
            //     lock: Number(container.find('#pub_lockUdiskmon').hasClass('enableLock'))
            // };
            // root.pub.udiskmon["@value"] = Number(container.find('#pub_chkUdiskmon').prop('checked'));

            // root.pub.memlib = {};
            // root.pub.memlib["@attributes"] = {
            //     lock: Number(container.find('#pub_lockMemlib').hasClass('enableLock'))
            // };
            // root.pub.memlib["@value"] = Number(container.find('#pub_chkMemlib').prop('checked'));

            // root.pub.trolib = {};
            // root.pub.trolib["@attributes"] = {
            //     lock: Number(container.find('#pub_lockTrolib').hasClass('enableLock'))
            // };
            // root.pub.trolib["@value"] = Number(container.find('#pub_chkTrolib').prop('checked'));

            root.pub.writelog = {};
            root.pub.writelog["@attributes"] = {
                lock: Number(container.find('#pub_lockWritelog').hasClass('enableLock'))
            };
            root.pub.writelog["@value"] = Number(container.find('#pub_chkWritelog').prop('checked'));
            root.pub.smartcpu = {};
            root.pub.smartcpu.type = {};
            root.pub.smartcpu.type["@attributes"] = {
                lock: 0
            };
            root.pub.smartcpu.type["@value"] = 1;
            root.pub.smartcpu.level = {};
            root.pub.smartcpu.level["@attributes"] = {
                lock: Number(container.find('#pub_lockSmartcpuLevel').hasClass('enableLock'))
            };
            root.pub.smartcpu.level["@value"] = container.find(':radio[name=pub_radSmartcpuLevel]:checked').val();
            root.pub.worm08067 = {};
            root.pub.worm08067['@attributes'] = { lock: Number(container.find('#pub_lockWorm08067').hasClass('enableLock')) };
            root.pub.worm08067['@value'] = Number(container.find('#pub_worm08067').prop('checked'));
            root.pub.yunyu = {};
            root.pub.yunyu['@attributes'] = { lock: Number(container.find('#pub_lockYunyu').hasClass('enableLock')) };
            root.pub.yunyu['@value'] = Number(container.find('#pub_yunyu').prop('checked'));
            root.pub.lpktool = {};
            root.pub.lpktool['@attributes'] = { lock: Number(container.find('#pub_lockLpktool').hasClass('enableLock')) };
            root.pub.lpktool['@value'] = Number(container.find('#pub_lpktool').prop('checked'));
            root.pub.virut = {};
            root.pub.virut['@attributes'] = { lock: Number(container.find('#pub_lockVirut').hasClass('enableLock')) };
            root.pub.virut['@value'] = Number(container.find('#pub_virut').prop('checked'));
            root.pub.kvengine = {};
            root.pub.kvengine['@value'] = 'rego';
            root.pub.closerfm = {};
            root.pub.closerfm['@attributes'] = { lock: Number(container.find('#pub_lockCloserfm').hasClass('enableLock')) };
            root.pub.closerfm['@value'] = Number(!container.find('#pub_closerfm').prop('checked'));
            root.pub.InnerWhiteList = {};
            root.pub.InnerWhiteList['@attributes'] = { lock: Number(container.find('#pub_lockInnerWhiteList').hasClass('enableLock')) };
            root.pub.InnerWhiteList['@value'] = Number(container.find('#pub_InnerWhiteList').prop('checked'));
            /* end 公共设置 */

            /* begin 扫描设置 */
            root.scan = {};
            root.scan.efficient = {};
            root.scan.efficient["@attributes"] = {
                admin: 1
            };
            root.scan.efficient["@value"] = '';
            root.scan.timerscan = {};
            // root.scan.timerscan["@attributes"] = {
            //     admin: 1
            // };
            root.scan.timerscan.allscan = {};
            root.scan.timerscan.allscan["@attributes"] = {
                lock: Number($('#scan_chkAllscanEnableLock').hasClass('enableLock'))
            };
            root.scan.timerscan.allscan.enable = {};
            root.scan.timerscan.allscan.enable["@value"] = Number(container.find('#scan_chkAllscanEnable').prop('checked'));
            root.scan.timerscan.allscan.RsTimer = {};
            root.scan.timerscan.allscan.RsTimer.Task = {};
            root.scan.timerscan.allscan.RsTimer.Task["@attributes"] = {
                id: '{51ECB824-C7CF-BD11-042C-2B06746A4A7F}',
                kind: 1,
                type: container.find(':radio[name=scan_radAllscanTime]:checked').val(),
                msgid: '0x06B0000100000001'
            };
            root.scan.timerscan.allscan.RsTimer.Task.Time = {};
            root.scan.timerscan.allscan.RsTimer.Task.Time["@attributes"] = {
                startdate: '2010-1-1'
            };

            switch (container.find(':radio[name=scan_radAllscanTime]:checked').val()) {
                case "2": //开机
                    root.scan.timerscan.allscan.RsTimer.Task.Time.AfterBoot = {};
                    root.scan.timerscan.allscan.RsTimer.Task.Time.AfterBoot["@attributes"] = {
                        minutes: 5
                    };
                    root.scan.timerscan.allscan.RsTimer.Task.Time.AfterBoot["@value"] = '';
                    break;
                case "6": //每天
                    var arr = container.find('#scan_txtAllscanEveryDay').val().split(':');
                    root.scan.timerscan.allscan.RsTimer.Task.Time.EveryDay = {};
                    root.scan.timerscan.allscan.RsTimer.Task.Time.EveryDay["@attributes"] = {
                        hour: arr[0],
                        minute: arr[1],
                        number: 1
                    };
                    root.scan.timerscan.allscan.RsTimer.Task.Time.EveryDay["@value"] = '';
                    break;
                case "5": //每周
                    var arr = container.find('#scan_txtAllscanEveryWeek').val().split(':');
                    var bitOr = 0;
                    container.find(':checkbox[name=scan_chkAllscanEveryWeek]:checked').each(function(i, item) {
                        bitOr = bitOr | item.value;
                    });
                    root.scan.timerscan.allscan.RsTimer.Task.Time.EveryWeek = {};
                    root.scan.timerscan.allscan.RsTimer.Task.Time.EveryWeek["@attributes"] = {
                        number: 1,
                        hour: arr[0],
                        minute: arr[1],
                        weekmark: bitOr
                    };
                    //root.scan.timerscan.allscan.RsTimer.Task.Time.EveryWeek["@value"] = '';
                    break;
            }
            root.scan.timerscan.quickscan = {};
            root.scan.timerscan.quickscan["@attributes"] = {
                lock: Number(container.find('#scan_chkQuickscanEnableLock').hasClass('enableLock'))
            };
            root.scan.timerscan.quickscan.enable = {};

            root.scan.timerscan.quickscan.enable["@value"] = Number(container.find('#scan_chkQuickscanEnable').prop('checked'));
            root.scan.timerscan.quickscan.RsTimer = {};
            root.scan.timerscan.quickscan.RsTimer.Task = {};
            root.scan.timerscan.quickscan.RsTimer.Task["@attributes"] = {
                id: '{DFBAC594-02FD-565B-1496-8F657E91FF95}',
                kind: 1,
                type: container.find(':radio[name=scan_radQuickscanTime]:checked').val(),
                msgid: '0x06B0000100000002'
            };
            root.scan.timerscan.quickscan.RsTimer.Task.Time = {};
            root.scan.timerscan.quickscan.RsTimer.Task.Time["@attributes"] = {
                startdate: '2010-1-1'
            };
            switch (container.find(':radio[name=scan_radQuickscanTime]:checked').val()) {
                case "2": //开机
                    root.scan.timerscan.quickscan.RsTimer.Task.Time.AfterBoot = {};
                    root.scan.timerscan.quickscan.RsTimer.Task.Time.AfterBoot["@attributes"] = {
                        minutes: 5
                    };
                    root.scan.timerscan.quickscan.RsTimer.Task.Time.AfterBoot["@value"] = '';
                    root.scan.quickscanAfterBoot = true;
                    break;
                case "6": //每天
                    var arr = container.find('#scan_txtQuickscanEveryDay').val().split(':');
                    root.scan.timerscan.quickscan.RsTimer.Task.Time.EveryDay = {};
                    root.scan.timerscan.quickscan.RsTimer.Task.Time.EveryDay["@attributes"] = {
                        hour: arr[0],
                        minute: arr[1],
                        number: 1
                    };
                    root.scan.timerscan.quickscan.RsTimer.Task.Time.EveryDay["@value"] = '';
                    break;
                case "5": //每周
                    var arr = container.find('#scan_txtQuickscanEveryWeek').val().split(':');
                    var bitOr = 0;
                    container.find(':checkbox[name=scan_chkQuickscanEveryWeek]:checked').each(function(i, item) {
                        bitOr = bitOr | item.value;
                    });
                    root.scan.timerscan.quickscan.RsTimer.Task.Time.EveryWeek = {};
                    root.scan.timerscan.quickscan.RsTimer.Task.Time.EveryWeek["@attributes"] = {
                        number: 1,
                        hour: arr[0],
                        minute: arr[1],
                        weekmark: bitOr
                    };
                    root.scan.timerscan.quickscan.RsTimer.Task.Time.EveryWeek["@value"] = '';
                    break;
            }
            root.scan.engine = {};
            root.scan.engine.pub = {};
            root.scan.engine.pub.filetype = {};
            root.scan.engine.pub.filetype["@attributes"] = {
                lock: Number(container.find('#scan_lockFiletype').hasClass('enableLock'))
            };
            root.scan.engine.pub.filetype["@value"] = container.find(':radio[name=scan_radFiletype]:checked').val();
            root.scan.engine.id = [];
            root.scan.engine.id[0] = {};
            root.scan.engine.id[0]['@attributes'] = {
                name: 1
            };
            root.scan.engine.id[0].engid = {};
            root.scan.engine.id[0].engid["@value"] = 1;
            root.scan.engine.id[0].enable = {};
            root.scan.engine.id[0].enable["@value"] = 1;
            root.scan.engine.id[0].cfg = {};
            root.scan.engine.id[0].cfg.heuristic = {};
            root.scan.engine.id[0].cfg.heuristic["@attributes"] = {
                lock: Number(container.find('#scan_lockHeuristic').hasClass('enableLock'))
            };
            root.scan.engine.id[0].cfg.heuristic["@value"] = Number($('#scan_chkHeuristic').prop('checked'));
            root.scan.engine.id[0].cfg.popvirus = {};
            root.scan.engine.id[0].cfg.popvirus["@attributes"] = {
                lock: Number(container.find('#scan_lockPopvirus').hasClass('enableLock'))
            };
            root.scan.engine.id[0].cfg.popvirus["@value"] = Number($('#scan_chkPopvirus').prop('checked'));
            root.scan.engine.id[0].cfg.zip = {};
            root.scan.engine.id[0].cfg.zip.scanzip = {};
            root.scan.engine.id[0].cfg.zip.scanzip["@attributes"] = {
                lock: Number(container.find('#scan_lockScanzip').hasClass('enableLock'))
            };
            root.scan.engine.id[0].cfg.zip.scanzip["@value"] = Number($('#scan_chkScanzip').prop('checked'));
            root.scan.engine.id[0].cfg.zip.filesize = {};
            root.scan.engine.id[0].cfg.zip.filesize["@attributes"] = {
                lock: Number(container.find('#scan_lockFilesize').hasClass('enableLock'))
            };
            root.scan.engine.id[0].cfg.zip.filesize["@value"] = container.find('#scan_txtFilesize').val();
            root.scan.engine.id[1] = {};
            root.scan.engine.id[1]['@attributes'] = {
                name: 2
            };
            root.scan.engine.id[1].engid = {};
            root.scan.engine.id[1].engid["@value"] = 2;
            root.scan.engine.id[1].enable = {};
            root.scan.engine.id[1].enable["@attributes"] = {
                lock: Number(container.find('#scan_lockCloudScan').hasClass('enableLock'))
            };
            root.scan.engine.id[1].enable["@value"] = Number($('#scan_chkCloudScan').prop('checked'));
            root.scan.findvirus = {};
            root.scan.findvirus["@attributes"] = {
                lock: Number(container.find('#scan_lockfindvirus').hasClass('enableLock'))
            };
            root.scan.findvirus["@value"] = container.find(':radio[name=scan_radFindvirus]:checked').val();
            root.scan.killfailed = {};
            root.scan.killfailed["@value"] = 0;
            root.scan.adminscanoper = {};
            root.scan.adminscanoper["@attributes"] = {
                admin: 1
            };
            root.scan.adminscanoper['@value'] = container.find(':radio[name=scan_radAdminscanoper]:checked').val();
            /* end 扫描设置 */

            /* begin 文件监控设置 */
            root.filemon = {};
            root.filemon.rundisable = {};
            root.filemon.rundisable["@attributes"] = {
                lock: Number(container.find('#file_chkRundisableLock').hasClass('enableLock'))
            };
            root.filemon.rundisable["@value"] = Number(!$('#file_chkRundisable').prop('checked'));
            root.filemon.smartblack = {};
            root.filemon.smartblack["@attributes"] = {
                lock: Number(container.find('#file_smartblackLock').hasClass('enableLock'))
            };
            root.filemon.smartblack["@value"] = Number(!$('#file_smartblack').prop('checked'));
            root.filemon.runmode = {};
            root.filemon.runmode["@attributes"] = {
                admin: 1
            };
            root.filemon.runmode["@value"] = '';
            root.filemon.lockclose = {};
            root.filemon.lockclose["@attributes"] = {
                admin: 1
            };
            root.filemon.lockclose["@value"] = Number($('#file_chkLockclose').prop('checked'));
            root.filemon.monmode = {};
            root.filemon.monmode["@attributes"] = {
                lock: Number(container.find('#file_lockMonmode').hasClass('enableLock'))
            };
            root.filemon.monmode["@value"] = Number($('#file_chkMonmode').prop('checked'));
            root.filemon.enablekernel = {};
            root.filemon.enablekernel["@attributes"] = {
                lock: Number(container.find('#file_lockCore').hasClass('enableLock'))
            };
            root.filemon.enablekernel["@value"] = Number($('#file_chkCoreMonitor').prop('checked'));
            root.filemon.reportresult = {};
            root.filemon.reportresult["@attributes"] = {
                lock: Number(container.find('#file_lockReportresult').hasClass('enableLock'))
            };
            root.filemon.reportresult["@value"] = Number($('#file_chkReportresult').prop('checked'));
            root.filemon.engine = {};
            root.filemon.engine.pub = {};
            root.filemon.engine.pub.filetype = {};
            root.filemon.engine.pub.filetype["@attributes"] = {
                lock: Number(container.find('#file_lockFiletype2').hasClass('enableLock'))
            };
            root.filemon.engine.pub.filetype["@value"] = container.find(':radio[name=file_radFiletype2]:checked').val();
            root.filemon.engine.id = [];
            root.filemon.engine.id[0] = {};
            root.filemon.engine.id[0]['@attributes'] = {
                name: 1
            };
            root.filemon.engine.id[0].engid = {};
            root.filemon.engine.id[0].engid["@value"] = 1;
            root.filemon.engine.id[0].enable = {};
            root.filemon.engine.id[0].enable["@value"] = 1;
            root.filemon.engine.id[0].cfg = {};
            root.filemon.engine.id[0].cfg.heuristic = {};
            root.filemon.engine.id[0].cfg.heuristic["@attributes"] = {
                lock: Number(container.find('#file_lockHeuristic2').hasClass('enableLock'))
            };
            root.filemon.engine.id[0].cfg.heuristic["@value"] = Number($('#file_chkHeuristic2').prop('checked'));
            root.filemon.engine.id[0].cfg.popvirus = {};
            root.filemon.engine.id[0].cfg.popvirus["@attributes"] = {
                lock: Number(container.find('#file_lockPopvirus2').hasClass('enableLock'))
            };
            root.filemon.engine.id[0].cfg.popvirus["@value"] = Number($('#file_chkPopvirus2').prop('checked'));
            root.filemon.engine.id[0].cfg.zip = {};
            root.filemon.engine.id[0].cfg.zip.scanzip = {};
            root.filemon.engine.id[0].cfg.zip.scanzip["@attributes"] = {
                lock: Number(container.find('#file_lockScanzip2').hasClass('enableLock'))
            };
            root.filemon.engine.id[0].cfg.zip.scanzip["@value"] = Number($('#file_chkScanzip2').prop('checked'));
            root.filemon.engine.id[0].cfg.zip.filesize = {};
            root.filemon.engine.id[0].cfg.zip.filesize["@attributes"] = {
                lock: Number(container.find('#file_lockFilesize2').hasClass('enableLock'))
            };
            root.filemon.engine.id[0].cfg.zip.filesize["@value"] = container.find('#file_txtFilesize2').val();
            root.filemon.engine.id[1] = {};
            root.filemon.engine.id[1]['@attributes'] = {
                name: 2
            };
            root.filemon.engine.id[1].engid = {};
            root.filemon.engine.id[1].engid["@value"] = 2;
            root.filemon.engine.id[1].enable = {};
            root.filemon.engine.id[1].enable["@attributes"] = {
                lock: Number(container.find('#file_lockCloudScan2').hasClass('enableLock'))
            };
            root.filemon.engine.id[1].enable["@value"] = Number($('#file_chkCloudScan2').prop('checked'));
            root.filemon.findvirus = {};
            root.filemon.findvirus["@attributes"] = {
                lock: Number(container.find('#file_lockFindvirus2').hasClass('enableLock'))
            };
            root.filemon.findvirus["@value"] = container.find(':radio[name=file_radFindvirus2]:checked').val();
            root.filemon.sigsource = {};
            root.filemon.sigsource["@attributes"] = {
                lock: Number(container.find('#lockSigsource').hasClass('enableLock'))
            };
            root.filemon.sigsource["@value"] = Number($('#sigsource').prop('checked'));
            root.filemon.killfailed = {};
            root.filemon.killfailed["@value"] = 0;
            root.filemon.ole = {};
            root.filemon.ole['@attributes'] = { lock: Number(container.find('#ole_Lock').hasClass('enableLock')) };
            root.filemon.ole['@value'] = Number($('#ole').prop('checked'));
            /* end 文件监控设置 */

            /* begin 邮件监控设置 */
            root.mailmon = {};
            root.mailmon.rundisable = {};
            root.mailmon.rundisable["@attributes"] = {
                lock: Number(container.find('#mail_chkRundisable2Lock').hasClass('enableLock'))
            };
            root.mailmon.rundisable["@value"] = Number(!$('#mail_chkRundisable2').prop('checked'));
            root.mailmon.lockclose = {};
            root.mailmon.lockclose["@attributes"] = {
                admin: 1
            };
            root.mailmon.lockclose["@value"] = Number($('#mail_chkLockclose2').prop('checked'));
            root.mailmon.reportresult = {};
            root.mailmon.reportresult["@attributes"] = {
                lock: Number(container.find('#mail_lockReportresult2').hasClass('enableLock'))
            };
            root.mailmon.reportresult["@value"] = container.find(':radio[name=mail_radReportresult2]:checked').val();
            root.mailmon.engine = {};
            root.mailmon.engine.pub = {};
            root.mailmon.engine.pub.filetype = {};
            root.mailmon.engine.pub.filetype["@attributes"] = {
                lock: Number(container.find('#mail_lockFiletype3').hasClass('enableLock'))
            };
            root.mailmon.engine.pub.filetype["@value"] = container.find(':radio[name=mail_radFiletype3]:checked').val();
            root.mailmon.engine.id = [];
            root.mailmon.engine.id[0] = {};
            root.mailmon.engine.id[0]['@attributes'] = {
                name: 1
            };
            root.mailmon.engine.id[0].engid = {};
            root.mailmon.engine.id[0].engid["@value"] = 1;
            root.mailmon.engine.id[0].enable = {};
            root.mailmon.engine.id[0].enable["@value"] = 1;
            root.mailmon.engine.id[0].cfg = {};
            root.mailmon.engine.id[0].cfg.heuristic = {};
            root.mailmon.engine.id[0].cfg.heuristic["@attributes"] = {
                lock: Number(container.find('#mail_lockHeuristic3').hasClass('enableLock'))
            };
            root.mailmon.engine.id[0].cfg.heuristic["@value"] = Number($('#mail_chkHeuristic3').prop('checked'));
            root.mailmon.engine.id[0].cfg.popvirus = {};
            root.mailmon.engine.id[0].cfg.popvirus["@attributes"] = {
                lock: Number(container.find('#mail_lockPopvirus3Lock').hasClass('enableLock'))
            };
            root.mailmon.engine.id[0].cfg.popvirus["@value"] = Number($('#mail_chkPopvirus3').prop('checked'));
            root.mailmon.engine.id[0].cfg.zip = {};
            root.mailmon.engine.id[0].cfg.zip.scanzip = {};
            root.mailmon.engine.id[0].cfg.zip.scanzip["@attributes"] = {
                lock: Number(container.find('#mail_lockScanzip3').hasClass('enableLock'))
            };
            root.mailmon.engine.id[0].cfg.zip.scanzip["@value"] = Number($('#mail_chkScanzip3').prop('checked'));
            root.mailmon.engine.id[0].cfg.zip.filesize = {};
            root.mailmon.engine.id[0].cfg.zip.filesize["@attributes"] = {
                lock: Number(container.find('#mail_lockFilesize3').hasClass('enableLock'))
            };
            root.mailmon.engine.id[0].cfg.zip.filesize["@value"] = container.find('#mail_txtFilesize3').val();
            root.mailmon.engine.id[1] = {};
            root.mailmon.engine.id[1]['@attributes'] = {
                name: 2
            };
            root.mailmon.engine.id[1].engid = {};
            root.mailmon.engine.id[1].engid["@value"] = 2;
            root.mailmon.engine.id[1].enable = {};
            root.mailmon.engine.id[1].enable["@attributes"] = {
                lock: Number(container.find('#mail_lockCloudScan3').hasClass('enableLock'))
            };
            root.mailmon.engine.id[1].enable["@value"] = Number($('#mail_chkCloudScan3').prop('checked'));
            root.mailmon.engine.portstrategy = {};
            root.mailmon.engine.portstrategy["@attributes"] = {
                lock: Number(container.find('#mail_lockPolicyWrap').hasClass('enableLock'))
            };
            var arrMailPorts = container.find('.mailPortPanel tbody tr');
            if (arrMailPorts.length > 0) {
                root.mailmon.engine.portstrategy.item = [];
                for (var i = 0; i < arrMailPorts.length; i++) {
                    var el = arrMailPorts[i];
                    if (!$(el).find(':text[name=mail_txtMailPort]').length || $(el).find(':text[name=mail_txtMailPort]').val() == '') {
                        continue;
                    }
                    var item = {};
                    item.port = {};
                    item.port["@value"] = $(el).find(':text[name=mail_txtMailPort]').val() || '';
                    item.protocol = {};
                    item.protocol["@value"] = $(el).find(':radio[name^=mail_radMailPort]:checked').val();
                    item["@attributes"] = {
                        lock: +$(el).find('i[name=mail_lockMailPortBox]').hasClass('enableLock'),
                        name: (item.protocol["@value"] == '0' ? 'smtp' : 'pop3') + '.' + item.port["@value"]
                    };
                    root.mailmon.engine.portstrategy.item.push(item);
                }

            }
            root.mailmon.findvirus = {};
            root.mailmon.findvirus["@attributes"] = {
                lock: Number(container.find('#mail_lockFindvirus3').hasClass('enableLock'))
            };
            root.mailmon.findvirus["@value"] = container.find(':radio[name=mail_radFindvirus3]:checked').val();
            /* end 邮件监控设置 */

            /* begin 安全监控设置 */
            root.sharemon = {};
            root.sharemon.rundisable = {};
            root.sharemon.rundisable["@attributes"] = {
                lock: Number(container.find('#share_RundisableLock').hasClass('enableLock'))
            };
            root.sharemon.rundisable["@value"] = Number(!$('share_Rundisable').prop('checked'));
            root.sharemon.reportresult = {};
            root.sharemon.reportresult["@attributes"] = {
                lock: Number(container.find('#share_lockReportresult').hasClass('enableLock'))
            };
            root.sharemon.reportresult["@value"] = container.find(':radio[name=share_radReportresult]:checked').val();
            root.sharemon.engine = {};
            root.sharemon.engine.pub = {};
            root.sharemon.engine.pub.filetype = {};
            root.sharemon.engine.pub.filetype["@attributes"] = {
                lock: Number(container.find('#share_lockFiletype').hasClass('enableLock'))
            };
            root.sharemon.engine.pub.filetype["@value"] = container.find(':radio[name=share_radFiletype]:checked').val();
            root.sharemon.engine.id = [];
            root.sharemon.engine.id[0] = {};
            root.sharemon.engine.id[0]['@attributes'] = {
                name: 1
            };
            root.sharemon.engine.id[0].engid = {};
            root.sharemon.engine.id[0].engid["@value"] = 1;
            root.sharemon.engine.id[0].enable = {};
            root.sharemon.engine.id[0].enable["@value"] = 1;
            root.sharemon.engine.id[0].cfg = {};
            root.sharemon.engine.id[0].cfg.heuristic = {};
            root.sharemon.engine.id[0].cfg.heuristic["@attributes"] = {
                lock: Number(container.find('share_lockHeuristic').hasClass('enableLock'))
            };
            root.sharemon.engine.id[0].cfg.heuristic["@value"] = Number($('#share_chkHeuristic').prop('checked'));
            root.sharemon.engine.id[0].cfg.popvirus = {};
            root.sharemon.engine.id[0].cfg.popvirus["@attributes"] = {
                lock: Number(container.find('#share_PopvirusLock').hasClass('enableLock'))
            };
            root.sharemon.engine.id[0].cfg.popvirus["@value"] = Number($('#share_Popvirus').prop('checked'));
            root.sharemon.engine.id[0].cfg.zip = {};
            root.sharemon.engine.id[0].cfg.zip.scanzip = {};
            root.sharemon.engine.id[0].cfg.zip.scanzip["@attributes"] = {
                lock: Number(container.find('#share_lockScanzip').hasClass('enableLock'))
            };
            root.sharemon.engine.id[0].cfg.zip.scanzip["@value"] = Number($('#share_chkScanzip').prop('checked'));
            root.sharemon.engine.id[0].cfg.zip.filesize = {};
            root.sharemon.engine.id[0].cfg.zip.filesize["@attributes"] = {
                lock: Number(container.find('#share_lockFilesize').hasClass('enableLock'))
            };
            root.sharemon.engine.id[0].cfg.zip.filesize["@value"] = container.find('#share_txtFilesize').val();
            root.sharemon.engine.id[1] = {};
            root.sharemon.engine.id[1]['@attributes'] = {
                name: 2
            };
            root.sharemon.engine.id[1].engid = {};
            root.sharemon.engine.id[1].engid["@value"] = 2;
            root.sharemon.engine.id[1].enable = {};
            root.sharemon.engine.id[1].enable["@attributes"] = {
                lock: Number(container.find('#share_lockCloudScan').hasClass('enableLock'))
            };
            root.sharemon.engine.id[1].enable["@value"] = Number($('#share_chkCloudScan').prop('checked'));

            root.sharemon.findvirus = {};
            root.sharemon.findvirus["@attributes"] = {
                lock: Number(container.find('#share_lockFindvirus').hasClass('enableLock'))
            };
            root.sharemon.findvirus["@value"] = container.find(':radio[name=share_radFindvirus]:checked').val();
            /* end 安全监控设置 */

            /* begin 系统加固设置 */
            root.defmon = {};
            root.defmon.sysdef = {};
            root.defmon.sysdef.enable = {};
            root.defmon.sysdef.enable["@attributes"] = {
                lock: Number($('#sys_chkAllsysdefEnableLock').hasClass('enableLock'))
            };
            root.defmon.sysdef.enable["@value"] = Number($('#sys_chkAllsysdefEnable').prop('checked'));
            root.defmon.sysdef.notify = {};
            root.defmon.sysdef.notify["@attributes"] = {
                lock: Number(container.find('#sys_lockSysdefnotify').hasClass('enableLock'))
            };
            root.defmon.sysdef.notify["@value"] = container.find(':radio[name=sys_radSysdefnotify]:checked').val();
            root.defmon.sysdef.needlog = {};
            root.defmon.sysdef.needlog["@attributes"] = {
                lock: Number(container.find('#sys_lockSysdefneedlog').hasClass('enableLock'))
            };
            root.defmon.sysdef.needlog["@value"] = Number(container.find('[name=sys_radSysdefneedlog]').prop('checked'));
            root.defmon.sysdef.level = {};
            root.defmon.sysdef.level["@attributes"] = {
                lock: Number(container.find('#sys_lockSysdeflevel').hasClass('enableLock'))
            };
            root.defmon.sysdef.level["@value"] = container.find(':radio[name=sys_radSysdeflevel]:checked').val();
            root.defmon.sysdef.auditmode = {};
            root.defmon.sysdef.auditmode["@attributes"] = {
                lock: Number(container.find('#sys_lockSysdefauditmode').hasClass('enableLock'))
            };
            root.defmon.sysdef.auditmode["@value"] = Number($('#app_chkSysdefauditmode').prop('checked'));
            root.defmon.sysdef.digitalsignature = {};
            root.defmon.sysdef.digitalsignature["@attributes"] = {
                lock: Number(container.find('#sys_lockSysdefdigitalsignature').hasClass('enableLock'))
            };
            root.defmon.sysdef.digitalsignature["@value"] = Number(container.find('[name=sys_radSysdefdigitalsignature]').prop('checked'));
            /* end 系统加固设置 */

            /* begin 应用加固设置 */
            root.actanalyze = {};
            root.actanalyze.apt = {};
            root.actanalyze.apt.status = {};
            root.actanalyze.apt.status["@attributes"] = {
                lock: Number(container.find('#app_chkAllaptEnableLock').hasClass('enableLock'))
            };
            root.actanalyze.apt.status["@value"] = Number($('#app_chkAllaptEnable').prop('checked'));
            root.actanalyze.apt.deal = {};
            root.actanalyze.apt.deal["@attributes"] = {
                lock: Number(container.find('#app_lockAptdeal').hasClass('enableLock'))
            };
            root.actanalyze.apt.deal["@value"] = container.find(':radio[name=app_radAptdeal]:checked').val();
            root.actanalyze.apt.notify = {};
            root.actanalyze.apt.notify["@attributes"] = {
                lock: Number(container.find('#app_lockAptnotify').hasClass('enableLock'))
            };
            root.actanalyze.apt.notify["@value"] = container.find(':radio[name=app_radAptnotify]:checked').val();
            root.actanalyze.apt.log = {};
            root.actanalyze.apt.log["@attributes"] = {
                lock: Number(container.find('#app_lockAptlog').hasClass('enableLock'))
            };
            root.actanalyze.apt.log["@value"] = Number(container.find('[name=app_radAptlog]').prop('checked'));
            root.actanalyze.apt.starttip = {};
            root.actanalyze.apt.starttip["@attributes"] = {
                lock: Number(container.find('#app_lockAptstarttip').hasClass('enableLock'))
            };
            root.actanalyze.apt.starttip["@value"] = Number(container.find('[name=app_radAptstarttip]').prop('checked'));
            /* end 应用加固设置 */

            /* start 设备监控 U盘*/
            root.devmon = {};
            root.devmon.usbmon = {};
            root.devmon.usbmon.scanlevel = {};
            root.devmon.usbmon.scanlevel['@attributes'] = {
                lock: Number($('#pub_udiskmonLevelLock').hasClass('enableLock'))
            };
            root.devmon.usbmon.scanlevel['@value'] = container.find('#pub_udiskmonLevel').val() || 2;
            root.devmon.usbmon.enable = {};
            root.devmon.usbmon.enable['@attributes'] = {
                lock: Number(container.find('#pub_chkUdiskmonLock').hasClass('enableLock'))
            };
            root.devmon.usbmon.askuser = {};
            root.devmon.usbmon.askuser['@attributes'] = {
                lock: Number($('#pub_udiskmonAskLock').hasClass('enableLock'))
            };
            root.devmon.usbmon.askuser['@value'] = container.find('[name=pub_udiskAsk]:checked').val();
            root.devmon.usbmon.enable['@value'] = Number(container.find('#pub_chkUdiskmon').prop('checked'));
            /* end 设备监控 U盘*/

            var json = {
                root: root
            };
            return json;
        },
        toJson2: function(container) {
            function setDetialWek(obj) {
                var arr = [];
                for (var i = 0; i < obj.length; i++) {
                    if (obj[i].checked) {
                        arr.push('1');
                    } else {
                        arr.push('0');
                    }
                }
                var str = arr.reverse().join('');
                return parseInt(str, 2);
            }
            var viruscan = {};
            viruscan.scanpath = {};
            viruscan.scanpath['@value'] = $.trim(container.find('#scanPath').val());

            viruscan.excludepath = {};
            viruscan.excludepath.enable = {};
            viruscan.excludepath.enable['@value'] = Number(container.find('[name=ignPath]').prop('checked'));
            viruscan.excludepath.excludelist = [];
            var excludelists = container.find('.ignPaths');
            for (var i = 0, len = excludelists.length; i < len; i++) {
                if ($(excludelists[i]).text() == '') {
                    continue;
                }
                var exclude = {};
                exclude['@value'] = $.trim($(excludelists[i]).text());
                viruscan.excludepath.excludelist.push(exclude);
            }

            viruscan.scanpolicy = {};
            viruscan.scanpolicy.keepday = {};
            viruscan.scanpolicy.keepday.enable = {};
            viruscan.scanpolicy.keepday.enable['@value'] = Number(container.find('#keepDayAble').prop('checked'));
            viruscan.scanpolicy.keepday.keep = {};
            viruscan.scanpolicy.keepday.keep['@value'] = container.find('#keepDay').val();
            viruscan.scanpolicy.compressfile = {};
            viruscan.scanpolicy.compressfile.enable = {};
            viruscan.scanpolicy.compressfile.enable['@value'] = Number(container.find('#compsAble').prop('checked'));
            viruscan.scanpolicy.compressfile.compressfilesize = {};
            viruscan.scanpolicy.compressfile.compressfilesize = container.find('#compress').val();

            viruscan.scanpolicy.procmod = {};
            viruscan.scanpolicy.procmod['@value'] = container.find('[name=findViru]:checked').val() || '';

            viruscan.scanpolicy.deletefailmode = {};
            viruscan.scanpolicy.deletefailmode['@value'] = container.find('[name=clearViru]:checked').val() || '';

            viruscan.scanpolicy.backup = {};
            viruscan.scanpolicy.backup.backupenable = {};
            viruscan.scanpolicy.backup.backupenable['@value'] = container.find('[name=viruFail]:checked').length;
            viruscan.scanpolicy.backup.backupfailmode = {};
            viruscan.scanpolicy.backup.backupfailmode['@value'] = container.find('[name=viruFail]:checked').val() || '';

            viruscan.scanpolicy.TimerScan = {};
            viruscan.scanpolicy.TimerScan.enable = {};
            viruscan.scanpolicy.TimerScan.enable['@value'] = Number(container.find('#setTimeViru').prop('checked'));
            viruscan.scanpolicy.TimerScan.everyweek = {};
            viruscan.scanpolicy.TimerScan.everyweek.weekmark = {};
            viruscan.scanpolicy.TimerScan.everyweek.weekmark['@value'] = setDetialWek($('[name=scanTime]'));
            viruscan.scanpolicy.TimerScan.everyweek.hour = {};
            viruscan.scanpolicy.TimerScan.everyweek.hour['@value'] = container.find('#scanT').val().split(':')[0] || '';
            viruscan.scanpolicy.TimerScan.everyweek.min = {};
            viruscan.scanpolicy.TimerScan.everyweek.min['@value'] = container.find('#scanT').val().split(':')[1] || '';

            var json = {
                viruscan: viruscan
            };
            return json;

        },
        /*toXml: function(json) {
      var xml = mustache.render(xmlTpl, json);
      return xml;
    },*/
        toHtml: function(container, json) {
            /* begin 通用函数 */
            var opLock = function(id, status) {
                if (status == 1) {
                    container.find(id).addClass('enableLock');
                } else {
                    container.find(id).removeClass('enableLock');
                }
            };
            var opSelect = function(id, value) {
                container.find(id + ' option[value=' + value + ']').prop('selected', true);
            };
            var opRadio = function(name, value) {
                container.find(':radio[name=' + name + '][value=' + value + ']').prop('checked', true);
            };
            var opCheck = function(id, status) {
                if (status == 1) {
                    return container.find(id).prop('checked', true);
                } else {
                    return container.find(id).prop('checked', false);
                }
            };
            /* end 通用函数 */

            var root = json.root;
            if (!root) {
                return;
            }

            /* begin 公共设置 */
            var pub = root.pub;
            //console.log(pub.file);
            var listType = ['文件','仅本目录','本目录+子目录','仅子目录','文件哈希'];
            if (pub.whitelist.admin.file.item) {
                container.find('#pub_tbWhiteList').empty();
                $(pub.whitelist.admin.file.item).each(function(i, item) {
                    container.find('#pub_tbWhiteList').append('<tr><td style="width:300px;" filetype="' + item["@attributes"].path + '" title="' + item["@value"] + '">' + item["@value"] + '<td>'+listType[item["@attributes"].path]+'</td><td width="50"><i class="pub_btnRemove del"></i></td></tr>');
                });
            }
            container.find('#pub_txtExt').val(pub.whitelist.admin.ext["@value"]);

            if(pub.blacklist){
                container.find('#pub_tbBlackList').empty();
                if (pub.blacklist.admin.file.item) {                    
                    $(pub.blacklist.admin.file.item).each(function(i, item) {
                        container.find('#pub_tbBlackList').append('<tr><td style="width:300px;" filetype="' + item["@attributes"].path + '" title="' + item["@value"] + '">' + item["@value"] + '<td>'+listType[item["@attributes"].path]+'</td><td width="50"><i class="pub_btnRemove del"></i></td></tr>');
                    });
                }
                if (pub.blacklist.admin.hash.item) {
                    $(pub.blacklist.admin.hash.item).each(function(i, item) {
                        container.find('#pub_tbBlackList').append('<tr><td style="width:300px;" title="' + item["@value"] + '">' + item["@value"] + '<td>文件哈希</td><td width="50"><i class="pub_btnRemove del"></i></td></tr>');
                    });
                }
            }
            
            
            opLock('#pub_lockNobackup', pub.vstore.nobackup["@attributes"].lock);
            opCheck('#pub_chkNobackup', !Number(pub.vstore.nobackup["@value"]));
            opLock('#pub_lockNospace', pub.vstore.nospace["@attributes"].lock);
            opRadio('pub_radNospace', pub.vstore.nospace["@value"]);
            opLock('#pub_lockStorefailed', pub.vstore.storefailed["@attributes"].lock);
            opRadio('pub_radStorefailed', pub.vstore.storefailed["@value"]);
            opLock('#pub_lockBigfile', pub.vstore.bigfile["@attributes"].lock);
            opRadio('pub_radBigfile', pub.vstore.bigfile["@value"]);
            opLock('#pub_lockVtrack', pub.vtrack["@attributes"].lock);
            opCheck('#pub_chkVtrack', pub.vtrack["@value"]);
            // opLock('#pub_lockMemlib', pub.memlib["@attributes"].lock);
            // opCheck('#pub_chkMemlib', pub.memlib["@value"]);
            // opLock('#pub_lockTrolib', pub.trolib["@attributes"].lock);
            // opCheck('#pub_chkTrolib', pub.trolib["@value"]);
            opLock('#pub_lockWritelog', pub.writelog["@attributes"].lock);
            opCheck('#pub_chkWritelog', pub.writelog["@value"]);
            opLock('#pub_lockSmartcpuLevel', pub.smartcpu.level["@attributes"].lock);
            opRadio('pub_radSmartcpuLevel', pub.smartcpu.level["@value"]);

            opLock('#pub_lockWorm08067', pub.worm08067["@attributes"].lock);
            opCheck('#pub_worm08067', pub.worm08067["@value"]);
            opLock('#pub_lockYunyu', pub.yunyu["@attributes"].lock);
            opCheck('#pub_yunyu', pub.yunyu["@value"]);
            opLock('#pub_lockVirut', pub.virut["@attributes"].lock);
            opCheck('#pub_virut', pub.virut["@value"]);
            opLock('#pub_lockLpktool', pub.lpktool["@attributes"].lock);
            opCheck('#pub_lpktool', pub.lpktool["@value"]);
            opLock('#pub_lockCloserfm', pub.closerfm["@attributes"].lock);
            opCheck('#pub_closerfm', !Number(pub.closerfm["@value"]));
            opLock('#pub_lockInnerWhiteList', pub.InnerWhiteList["@attributes"].lock);
            opCheck('#pub_InnerWhiteList', pub.InnerWhiteList["@value"]);


            var cloud = pub.cloud;
            opSelect('#cpuradio', cloud.cpuradio['@value']);
            opSelect('#connrate', cloud.connrate['@value']);
            var csrv = cloud.servers.csrv;
            $(csrv).each(function(i, item) {
                if (item['@attributes'].private == 0) {
                    //公有云
                    opLock('#publicCloudLock', item["@attributes"].lock);
                    opCheck('#publicCloudEnable', item.enable["@value"]);
                    container.find('.js_cloud:eq(0) [name=publicCloudMode] [value=' + item.mode['@value'] + ']').prop('checked', true);
                    container.find('#publicCloudCount').val(item.count['@value']);
                    container.find('#publicCloudName').val(item.name['@value']);
                } else {
                    //私有云
                    var target = container.find('#privateCloudTmpl');
                    target.find('[name=privateCloudMode]').attr('name','privateCloudMode'+i);
                    var $html = $('<dd>' + target.html() + '</dd>');
                    item['@attributes'].lock == 1 ? $html.find('.privateCloudLock').addClass('enableLock') : $html.find('.privateCloudLock').removeClass('enableLock');
                    $html.find('.privateCloudEnable').prop('checked', item.enable['@value'] == 1);
                    $html.find('.privateCloudAddr').val(item.addr['@value']);
                    $html.find('.privateCloudPort').val(item.port['@value']);
                    $html.find('[name=privateCloudMode'+i+'][value=' + item.mode['@value'] + ']').prop('checked', true);
                    $html.find('.privateCloudCount').val(item.count['@value']);
                    $html.find('.privateCloudName').val(item.name['@value']);
                    target.before($html);

                }
            });

            /* end 公共设置 */

            /* begin 扫描设置 */
            var scan = root.scan;
            opCheck('#scan_chkAllscanEnable', scan.timerscan.allscan.enable["@value"]);
            opLock('#scan_chkAllscanEnableLock', scan.timerscan.allscan["@attributes"] ? scan.timerscan.allscan["@attributes"].lock : 0);
            container.find('#scan_chkAllscanEnable').trigger('change');
            if (scan.timerscan.allscan.RsTimer.Task.Time.AfterBoot) {
                opRadio('scan_radAllscanTime', '2');
            } else if (scan.timerscan.allscan.RsTimer.Task.Time.EveryDay) {
                opRadio('scan_radAllscanTime', '6');
                container.find('#scan_txtAllscanEveryDay').val(scan.timerscan.allscan.RsTimer.Task.Time.EveryDay["@attributes"].hour + ':' + scan.timerscan.allscan.RsTimer.Task.Time.EveryDay["@attributes"].minute);
            } else if (scan.timerscan.allscan.RsTimer.Task.Time.EveryWeek) {
                opRadio('scan_radAllscanTime', '5');
                container.find(':checkbox[name=scan_chkAllscanEveryWeek]').each(function(i, item) {
                    if ((item.value | scan.timerscan.allscan.RsTimer.Task.Time.EveryWeek["@attributes"].weekmark) == scan.timerscan.allscan.RsTimer.Task.Time.EveryWeek["@attributes"].weekmark) {
                        item.checked = true;
                        $(item).parent().addClass('active');
                    } else {
                        item.checked = false;
                    }
                });
                container.find('#scan_txtAllscanEveryWeek').val(scan.timerscan.allscan.RsTimer.Task.Time.EveryWeek["@attributes"].hour + ':' + scan.timerscan.allscan.RsTimer.Task.Time.EveryWeek["@attributes"].minute);
            }
            opCheck('#scan_chkQuickscanEnable', scan.timerscan.quickscan.enable["@value"]);
            $('#scan_chkQuickscanEnable').trigger('change');
            if (scan.timerscan.quickscan.RsTimer.Task.Time.AfterBoot) {
                opRadio('scan_radQuickscanTime', '2');
            } else if (scan.timerscan.quickscan.RsTimer.Task.Time.EveryDay) {
                opRadio('scan_radQuickscanTime', '6');
                container.find('#scan_txtQuickscanEveryDay').val(scan.timerscan.quickscan.RsTimer.Task.Time.EveryDay["@attributes"].hour + ':' + scan.timerscan.quickscan.RsTimer.Task.Time.EveryDay["@attributes"].minute);
            } else if (scan.timerscan.quickscan.RsTimer.Task.Time.EveryWeek) {
                opRadio('scan_radQuickscanTime', '5');
                container.find(':checkbox[name=scan_chkQuickscanEveryWeek]').each(function(i, item) {
                    if ((item.value | scan.timerscan.quickscan.RsTimer.Task.Time.EveryWeek["@attributes"].weekmark) == scan.timerscan.quickscan.RsTimer.Task.Time.EveryWeek["@attributes"].weekmark) {
                        item.checked = true;
                        $(item).parent().addClass('active');
                    } else {
                        item.checked = false;
                    }
                });
                container.find('#scan_txtQuickscanEveryWeek').val(scan.timerscan.quickscan.RsTimer.Task.Time.EveryWeek["@attributes"].hour + ':' + scan.timerscan.quickscan.RsTimer.Task.Time.EveryWeek["@attributes"].minute);
            }
            opLock('#scan_lockFiletype', scan.engine.pub.filetype["@attributes"].lock);
            opRadio('scan_radFiletype', scan.engine.pub.filetype["@value"]);
            opLock('#scan_lockHeuristic', scan.engine.id[0].cfg.heuristic["@attributes"].lock);
            opCheck('#scan_chkHeuristic', scan.engine.id[0].cfg.heuristic["@value"]);
            opLock('#scan_lockPopvirus', scan.engine.id[0].cfg.popvirus["@attributes"].lock);
            opCheck('#scan_chkPopvirus', scan.engine.id[0].cfg.popvirus["@value"]);
            opLock('#scan_lockScanzip', scan.engine.id[0].cfg.zip.scanzip["@attributes"].lock);
            opCheck('#scan_chkScanzip', scan.engine.id[0].cfg.zip.scanzip["@value"]);
            opLock('#scan_lockFilesize', scan.engine.id[0].cfg.zip.filesize["@attributes"].lock);
            container.find('#scan_txtFilesize').val(scan.engine.id[0].cfg.zip.filesize["@value"]);
            opLock('#scan_lockCloudScan', scan.engine.id[1].enable["@attributes"].lock);
            opCheck('#scan_chkCloudScan', scan.engine.id[1].enable["@value"]);
            opLock('#scan_lockfindvirus', scan.findvirus["@attributes"].lock);
            opRadio('scan_radFindvirus', scan.findvirus["@value"]);
            opRadio('scan_radAdminscanoper', scan.adminscanoper["@value"]);
            /* end 扫描设置 */

            /* begin 文件监控设置 */
            var file = root.filemon;
            opLock('#file_chkRundisableLock', file.rundisable["@attributes"].lock);
            opCheck('#file_chkRundisable', !Number(file.rundisable["@value"]));
            opLock('#file_smartblackLock', file.smartblack["@attributes"].lock);
            opCheck('#file_smartblack', !Number(file.smartblack["@value"]));
            opCheck('#file_chkLockclose', file.lockclose["@value"]);
            opLock('#file_lockMonmode', file.monmode["@attributes"].lock);
            opCheck('#file_chkMonmode', file.monmode["@value"]);
            opLock('#file_lockCore', file.enablekernel["@attributes"].lock);
            opCheck('#file_chkCoreMonitor', file.enablekernel["@value"]);
            opLock('#file_lockReportresult', file.reportresult["@attributes"].lock);
            opCheck('#file_chkReportresult', file.reportresult["@value"]);
            opLock('#file_lockFiletype2', file.engine.pub.filetype["@attributes"].lock);
            opRadio('file_radFiletype2', file.engine.pub.filetype["@value"]);
            opLock('#file_lockHeuristic2', file.engine.id[0].cfg.heuristic["@attributes"].lock);
            opCheck('#file_chkHeuristic2', file.engine.id[0].cfg.heuristic["@value"]);
            opLock('#file_lockPopvirus2', file.engine.id[0].cfg.popvirus["@attributes"].lock);
            opCheck('#file_chkPopvirus2', file.engine.id[0].cfg.popvirus["@value"]);
            opLock('#file_lockScanzip2', file.engine.id[0].cfg.zip.scanzip["@attributes"].lock);
            opCheck('#file_chkScanzip2', file.engine.id[0].cfg.zip.scanzip["@value"]);
            opLock('#file_lockFilesize2', file.engine.id[0].cfg.zip.filesize["@attributes"].lock);
            container.find('#file_txtFilesize2').val(file.engine.id[0].cfg.zip.filesize["@value"]);
            opLock('#file_lockCloudScan2', file.engine.id[1].enable["@attributes"].lock);
            opCheck('#file_chkCloudScan2', file.engine.id[1].enable["@value"]);
            opLock('#file_lockFindvirus2', file.findvirus["@attributes"].lock);
            opRadio('file_radFindvirus2', file.findvirus["@value"]);
            opLock('#lockSigsource', file.sigsource["@attributes"].lock);
            opCheck('#sigsource', file.sigsource["@value"]);
            opLock('#ole_Lock', file.ole["@attributes"].lock);
            opCheck('#ole', file.ole["@value"]);
            /* end 文件监控设置 */

            /* begin 邮件监控设置 */
            var mail = root.mailmon;
            opLock('#mail_chkRundisable2Lock', mail.rundisable["@attributes"].lock);
            opCheck('#mail_chkRundisable2', !Number(mail.rundisable["@value"]));
            opCheck('#mail_chkLockclose2', mail.lockclose["@value"]);
            opLock('#mail_lockReportresult2', mail.reportresult["@attributes"].lock);
            opRadio('mail_radReportresult2', mail.reportresult["@value"]);
            opLock('#mail_lockFiletype3', mail.engine.pub.filetype["@attributes"].lock);
            opRadio('mail_radFiletype3', mail.engine.pub.filetype["@value"]);
            opLock('#mail_lockHeuristic3', mail.engine.id[0].cfg.heuristic["@attributes"].lock);
            opCheck('#mail_chkHeuristic3', mail.engine.id[0].cfg.heuristic["@value"]);
            opLock('#mail_lockPopvirus3Lock', mail.engine.id[0].cfg.popvirus["@attributes"].lock);
            opCheck('#mail_chkPopvirus3', mail.engine.id[0].cfg.popvirus["@value"]);
            opLock('#mail_lockScanzip3', mail.engine.id[0].cfg.zip.scanzip["@attributes"].lock);
            opCheck('#mail_chkScanzip3', mail.engine.id[0].cfg.zip.scanzip["@value"]);
            opLock('#mail_lockFilesize3', mail.engine.id[0].cfg.zip.filesize["@attributes"].lock);
            container.find('#mail_txtFilesize3').val(mail.engine.id[0].cfg.zip.filesize["@value"]);
            opLock('#mail_lockCloudScan3', mail.engine.id[1].enable["@attributes"].lock);
            opCheck('#mail_chkCloudScan3', mail.engine.id[1].enable["@value"]);
            opLock('#mail_lockFindvirus3', mail.findvirus["@attributes"].lock);
            opRadio('mail_radFindvirus3', mail.findvirus["@value"]);
            opLock('#mail_lockPolicyWrap', mail.engine.portstrategy["@attributes"].lock);
            var mailPolicy = container.find('.mailPortPanel tbody');
            if (mail.engine.portstrategy.item) {
                mailPolicy.empty();
                var arrHtml = [];
                $.each(mail.engine.portstrategy.item, function(i, item) {
                    arrHtml.push('<tr><td style="width:20px;"><i name="mail_lockMailPortBox" class="lock ' + (item["@attributes"].lock ? ' enableLock' : '') + '"></i></td>');
                    arrHtml.push('<td style="width:120px;"><input type="text" value="' + item.port["@value"] + '" style="width:50px;" name="mail_txtMailPort" validation="intNum"></td>');
                    arrHtml.push('<td style="width:265px;">');
                    arrHtml.push('<label class="radio inline"><input name="mail_radMailPort' + i + '" type="radio" value="0" ' + (item.protocol["@value"] == 0 ? ' checked' : '') + '>SMTP</label>');
                    arrHtml.push('<label class="radio inline"><input name="mail_radMailPort' + i + '" type="radio" value="1" ' + (item.protocol["@value"] == 1 ? ' checked' : '') + '>POP3</label>');
                    arrHtml.push('</td>');
                    arrHtml.push('<td style="width:40px;"><a href="#" class="mail_btnRemovePort">&nbsp;</a></td></tr>');
                });
                mailPolicy.append(arrHtml.join(''));
            } else {
                //mailPolicy.append('<dl class="mailNoRecordPanel"><span>当前没有任何规则</span> <a href="#" id="mail_btnAddRecord">增加</a></dl>');
            }
            /* end 邮件监控设置 */

            /*begin 共享监控设置*/
            var share = root.sharemon;
            opLock('#share_RundisableLock', share.rundisable["@attributes"].lock);
            opCheck('#share_Rundisable', !Number(share.rundisable["@value"]));
            //opCheck('#share_Lockclose', share.lockclose["@value"]);
            opLock('#share_lockReportresult', share.reportresult["@attributes"].lock);
            opRadio('share_radReportresult', share.reportresult["@value"]);
            opLock('#share_lockFiletype', share.engine.pub.filetype["@attributes"].lock);
            opRadio('share_radFiletype', share.engine.pub.filetype["@value"]);
            opLock('#share_lockHeuristic', share.engine.id[0].cfg.heuristic["@attributes"].lock);
            opCheck('#share_chkHeuristic', share.engine.id[0].cfg.heuristic["@value"]);
            opLock('#share_PopvirusLock', share.engine.id[0].cfg.popvirus["@attributes"].lock);
            opCheck('#share_Popvirus', share.engine.id[0].cfg.popvirus["@value"]);
            opLock('#share_lockScanzip', share.engine.id[0].cfg.zip.scanzip["@attributes"].lock);
            opCheck('#share_chkScanzip', share.engine.id[0].cfg.zip.scanzip["@value"]);
            opLock('#share_lockFilesize', share.engine.id[0].cfg.zip.filesize["@attributes"].lock);
            container.find('#share_txtFilesize').val(share.engine.id[0].cfg.zip.filesize["@value"]);
            opLock('#share_lockCloudScan', share.engine.id[1].enable["@attributes"].lock);
            opCheck('#share_CloudScan', share.engine.id[1].enable["@value"]);
            opLock('#share_lockFindvirus', share.findvirus["@attributes"].lock);
            opRadio('share_radFindvirus', share.findvirus["@value"]);
            /*end 共享监控设置*/

            /* begin 应用加固设置 */
            var app = root.actanalyze.apt;
            opLock('#app_chkAllaptEnableLock', app.status["@attributes"].lock);
            opCheck('#app_chkAllaptEnable', app.status["@value"]);
            container.find('#app_chkAllaptEnable').trigger('change');
            opLock('#app_lockAptdeal', app.deal["@attributes"].lock);
            opRadio('app_radAptdeal', app.deal["@value"]);
            opLock('#app_lockAptnotify', app.notify["@attributes"].lock);
            opRadio('app_radAptnotify', app.notify["@value"]);
            opLock('#app_lockAptlog', app.log["@attributes"].lock);
            opCheck('[name=app_radAptlog]', app.log["@value"]);
            opLock('#app_lockAptstarttip', app.starttip["@attributes"].lock);
            opCheck('[name=app_radAptstarttip]', app.starttip["@value"]);
            /* end 应用加固设置 */

            /* begin 系统加固设置 */
            var sys = root.defmon.sysdef;
            opLock('#sys_chkAllsysdefEnableLock', sys.enable["@attributes"].lock);
            opCheck('#sys_chkAllsysdefEnable', sys.enable["@value"]);
            container.find('#sys_chkAllsysdefEnable').trigger('change');
            opLock('#sys_lockSysdefnotify', sys.notify["@attributes"].lock);
            opRadio('sys_radSysdefnotify', sys.notify["@value"]);
            opLock('#sys_lockSysdefneedlog', sys.needlog["@attributes"].lock);
            opCheck('[name=sys_radSysdefneedlog]', sys.needlog["@value"]);
            opLock('#sys_lockSysdeflevel', sys.level["@attributes"].lock);
            opRadio('sys_radSysdeflevel', sys.level["@value"]);
            opLock('#sys_lockSysdefauditmode', sys.auditmode["@attributes"].lock);
            opCheck('#app_chkSysdefauditmode', sys.auditmode["@value"]);
            opLock('#sys_lockSysdefdigitalsignature', sys.digitalsignature["@attributes"].lock);
            opCheck('[name=sys_radSysdefdigitalsignature]', sys.digitalsignature["@value"]);
            /* end 系统加固设置 */

            /* start 设备监控*/
            var usbmon = root.devmon.usbmon;
            opCheck('#pub_chkUdiskmon', usbmon.enable["@value"]);
            opLock('#pub_chkUdiskmonLock', usbmon.enable["@attributes"] ? usbmon.enable["@attributes"].lock : 0);
            container.find('#pub_udiskmonLevel').val(usbmon.scanlevel['@value']);
            opLock('#pub_udiskmonLevelLock', usbmon.scanlevel["@attributes"] ? usbmon.scanlevel["@attributes"].lock : 0);
            opLock('#pub_udiskmonAskLock', usbmon['askuser'] ? usbmon.askuser['@attributes'].lock : 0);
            opRadio('pub_udiskAsk', usbmon['askuser'] ? usbmon.askuser["@value"] : 1);
            /* end 设备监控 */
        },
        toHtml2: function(container, json) {
            var opRadio = function(name, value) {
                container.find(':radio[name=' + name + '][value=' + value + ']').prop('checked', true);
            };
            var opCheck = function(id, status) {
                if (status == 1) {
                    return container.find(id).prop('checked', true);
                } else {
                    return container.find(id).prop('checked', false);
                }
            };

            function getDetialWek(str) {
                var num = parseInt(str).toString(2);
                var num_len = num.length;
                num = '0000000'.slice(num_len) + num;
                var arr = [0, 0, 0, 0, 0, 0, 0];
                var len = arr.length - 1;
                for (var i = 0; i < num.length; i++) {
                    arr[len - i] = num[i];
                }
                return arr;
            }

            var viruscan = json.viruscan;
            if (!viruscan) {
                return;
            }

            container.find('#scanPath').val(viruscan.scanpath['@value']);

            var excludepath = viruscan.excludepath;
            if (excludepath.enable['@value'] == 1) {
                container.find('[name=ignPath]').prop('checked', true).trigger('change');
            } else {
                container.find('[name=ignPath]').prop('checked', false).trigger('change');
            }

            var excludelist = excludepath.excludelist;
            var ignPaths = container.find('.ignPaths');
            if (excludelist.length) {
                container.find('.li_ignPaths .li_ignPaths_bod').empty();
                for (var i = 0; i < excludelist.length; i++) {
                    var _html = '<tr><td style="width:380px;"><span class="ignPaths" >' + excludelist[i]['@value'] + '</span></td><td><i class="ignPathsDel del">&nbsp;</a></td></td>';
                    container.find('.li_ignPaths .li_ignPaths_bod').append(_html);
                }
            } else {
                // var _html = '<tr><td style="width:280px;"><input type="text" class="ignPaths" value="" placeholder="请填写忽略路径" disabled></td><td ><i class="ignPathsDel del">&nbsp;</a></td></td>';
                // container.find('.li_ignPaths .li_ignPaths_bod').append(_html);
            }

            var scanpolicy = viruscan.scanpolicy;
            var keepday = scanpolicy.keepday;
            opCheck('#keepDayAble', keepday.enable['@value']);
            container.find('#keepDayAble').trigger('change');
            container.find('#keepDay').val(keepday.keep['@value']);

            var compressfile = scanpolicy.compressfile;
            opCheck('#compsAble', compressfile.enable['@value']);
            container.find('#compsAble').trigger('change');
            container.find('#compress').val(keepday.keep['@value']);

            var procmod = scanpolicy.procmod;
            opRadio('findViru', procmod['@value']);

            var deletefailmode = scanpolicy.deletefailmode;
            opRadio('clearViru', deletefailmode['@value']);

            var backupfailmode = scanpolicy.backup.backupfailmode;
            opRadio('viruFail', backupfailmode['@value']);

            var TimerScan = scanpolicy.TimerScan;
            opCheck('#setTimeViru', TimerScan.enable['@value']);
            container.find('#setTimeViru').trigger('change');


            var everyweek = TimerScan.everyweek;
            var everymark = everyweek.weekmark;
            var weekArr = getDetialWek(everymark['@value']);
            var weekmark = container.find('[name=scanTime]');
            for (var i = 0; i < weekArr.length; i++) {
                if (weekArr[i] == '1') {
                    $(weekmark[i]).prop('checked', true).parent().addClass('active');

                } else {
                    $(weekmark[i]).prop('checked', false);
                }
            }

            var time = '';
            if (everyweek.hour['@value'] && everyweek.min['@value']) {
                time = everyweek.hour['@value'] + ':' + everyweek.min['@value'];
            }

            container.find('#scanT').val(time);
        }
    };

    return {
        container: '.c-page-content',
        render: function(container) {
            document.title = "病毒查杀-设置";
            var policys = RsCore.config.virus.policy,
                path = window.location.hash.split('?')[0],
                params = getUrlSearchQuerys(),
                groupId = params['g'],
                policyJSON = {};

            if (RsCore.cache.group.list[groupId]) {
                if (RsCore.cache.group.list[groupId].type == 2) {
                    $('.c-page-nav .nav li:eq(0) a').trigger('click');
                    return false;
                }
                if (groupId == '-1') {
                    $('.c-page-nav .nav li:eq(0) a').trigger('click');
                    return;
                }
            }
            if (groupId == '0' && !params['c']) {
                $(container).append('<div  class="no-setting"><div></div><span>“已加入终端”无设置，请查看具体分组设置</span></div>');
                return false;
            }


            $(container).append(tpl);
            var tick = 0;

            RsCore.ajax('Policy/getPolicy', {
                grouptype: params['c'] ? 2 : 1,
                objid: params['c'] || params['g'],
                productid: policys[0].value.split('_')[0],
                eid: RsCore.cache.group.eid,
                policytype: policys[0].value.split('_')[1]
            }, function(result) {
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
            }, function(result) {
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



        },
        destroy: function() {
            $(window).off('resize.policy');
            $('.c-moudle-wrap').off('scroll');
            $(this.container).find('.js_white_wrap,.c-moudle-wrap').slimscroll({ destroy: true });
            $(this.container).off().empty();
        }
    };
});