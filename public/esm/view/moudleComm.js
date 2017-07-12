define(function (require) {
    var isEmptyObject = RsCore.assist.isEmptyObject,
        pushClient = [],
        editTermArr = [],
        isClickShow = false,
        getUrlSearchQuerys = RsCore.assist.getUrlSearchQuerys,
        params2str = RsCore.assist.params2str,
        mustache = require('mustache');
    require('slimscroll');
    var globalPolicy = ['EB8AFFA5-0710-47e6-8F53-55CAE55E1915_1'];
    var op = {
        initStat: false,
        init: function () {
            // if(op.initStat){     return; } op.initStat = true;
            op.correctNavTab();
            if (isEmptyObject(RsCore.cache.group)) {
                op.refreshClientSync();
                op.initEvent();
            } else {
                op.createClient();
            }
            op.initGroupCmd();
            op.resizeClientH();
            op.resizeSilderNav();
            op.silderNavStatus();
            op.showGroupClient();
            var params = getUrlSearchQuerys();
            if (params['copen'] == 0) {
                $('.client-list').addClass('inrm');
            } else {
                $('.client-list').removeClass('inrm');
            }
        },
        group4product: function () {
            var hash = window.location.hash.split('/')[0];
            var product = [];
            if (hash === '#virus') {
                product = ['D49170C0-B076-4795-B079-0F97560485AF', 'A40D11F7-63D2-469d-BC9C-E10EB5EF32DB'];
            }
            if (hash === '#protection') {
                product = ['53246C2F-F2EA-4208-9C6C-8954ECF2FA27'];
            }
            if (hash === '#mobile') {
                product = ['74F2C5FD-2F95-46be-B67C-FFA200D69012'];
            }

            return product;
        },
        /*获取终端列表*/
        refreshClientSync: function () {
            var params = {
                productIds: op.group4product()
            };
            RsCore
                .ajaxSync('Group/groupListAll', params, function (data) {
                    op.createClient(data);
                });
        },
        /*刷新终端分组列表*/
        refreshClient: function () {
            var params = {
                productIds: op.group4product()
            };
            RsCore
                .ajax('Group/groupListAll', params, function (data) {
                    isClickShow = true;
                    op.createClient(data);
                    $('.client-list .active a').trigger('click');
                });
        },
        /**
         * [createClient 创建终端分组列表]
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        createClient: function (data) {
            $('.client-list ul').empty();
            var params = getUrlSearchQuerys();
            var list = [],
                lastList = [],
                sortData = [],
                _online = 0,
                _total = 0,
                blackTotal = 0,
                unInsTotal = 0;

            if (data) {
                RsCore.cache.group = {};
                //全网ID
                RsCore.cache.group.all = data.rows[0].id; //data[0].id;
                RsCore.cache.group.eid = data.rows[0].eid;
                RsCore.cache.group.list = {};
                RsCore.cache.group.list['-1'] = {
                    groupname: '已卸载',
                    online: 0,
                    total: 0
                };
                $(data.rows).each(function (i, group) {
                    if (group.type == 2) {
                        sortData.push(group);
                        blackTotal = group.total;
                        return;
                    }
                    if (group.type == 0) {
                        _online += group.online;
                        _total += group.total;
                        sortData.unshift(group);
                        return;
                    }
                    if (group['id'] == -1) {
                        $.extend(RsCore.cache.group.list[-1], group);
                        unInsTotal = group.total;
                        return;
                    }
                    RsCore.cache.group.list[group.id] = group;
                    _online += group.online;
                    _total += group.total;
                    group['hasNode'] = Number(group.total) > 0 ?
                        'hasNode' :
                        '';
                    list.push(mustache.render('<li><i class="isShowSubTerm"></i><a href="javascript:;" da-toggle="#{{id}}" da-t' +
                        'ype="group"  title="{{groupname}}" class="{{hasNode}}"><div class="num"><span>{{' +
                        'online}}</span>/{{total}}</div><i class="del pull-right"></i> <i class="edit pul' +
                        'l-right"></i><span>{{groupname}}</span></a><b class="hide ok">确定</b><b class="hi' +
                        'de cancel">取消</b><input type="text" class="hide"/></li>',
                        group));

                });
                $(sortData).each(function (i, group) {
                    RsCore.cache.group.list[group.id] = group;
                    // _online += group.online; _total += group.total;
                    group['hasNode'] = Number(group.total) > 0 ?
                        'hasNode' :
                        '';
                    if (group.type == 0) {
                        list.unshift(mustache.render('<li><i class="isShowSubTerm"></i><a href="javascript:;" da-toggle="#{{id}}" da-t' +
                            'ype="group" title="{{groupname}}" class="{{hasNode}}"><div class="num"><span>{{o' +
                            'nline}}</span>/{{total}}</div><span>{{groupname}}</span></a></li>',
                            group));
                    }
                    if (group.type == 2) {
                        lastList.push(mustache.render('<li><i class="isShowSubTerm"></i><a href="javascript:;" da-toggle="#{{id}}" da-t' +
                            'ype="group" title="{{groupname}}" class="{{hasNode}}"><div class="num">{{total}}' +
                            '</div><span>{{groupname}}</span></a></li>',
                            group));
                    }
                });
            } else {
                var groups = RsCore.cache.group.list;
                var num = 0;
                for (var i in groups) {
                    var group = groups[i];
                    if (group['id'] == -1) {
                        unInsTotal = group.total;
                        continue;
                    }
                    if (group.type == 0) {
                        _online += group.online;
                        _total += group.total;
                        group['hasNode'] = Number(group.total) > 0 ?
                            'hasNode' :
                            '';
                        list.unshift(mustache.render('<li><i class="isShowSubTerm"></i><a href="javascript:;" da-toggle="#{{id}}" da-t' +
                            'ype="group"  title="{{groupname}}" class="{{hasNode}}"><div class="num"><span>{{' +
                            'online}}</span>/{{total}}</div><span>{{groupname}}</span></a></li>',
                            group));
                    }
                    if (group.type == 1) {
                        _online += group.online;
                        _total += group.total;
                        group['hasNode'] = Number(group.total) > 0 ?
                            'hasNode' :
                            '';
                        list.push(mustache.render('<li><i class="isShowSubTerm"></i><a href="javascript:;" da-toggle="#{{id}}" da-t' +
                            'ype="group"  title="{{groupname}}" class="{{hasNode}}"><div class="num"><span>{{' +
                            'online}}</span>/{{total}}</div><i class="del pull-right"></i> <i class="edit pul' +
                            'l-right"></i><span>{{groupname}}</span></a><b class="hide ok">确定</b><b class="hi' +
                            'de cancel">取消</b><input type="text" class="hide"/></li>',
                            group));
                    }
                    if (group.type == 2) {
                        blackTotal = group.total;
                        lastList.push(mustache.render('<li><i class="isShowSubTerm"></i><a href="javascript:;" da-toggle="#{{id}}" da-t' +
                            'ype="group"  title="{{groupname}}" class="{{hasNode}}"><div class="num">{{total}' +
                            '}</div><span>{{groupname}}</span></a></li>',
                            group));
                    }
                    num++;
                }
            }

            // list.push('<li><a href="javascript:;" class="group-add"><i class="fa
            // fa-plus-square ml15"></i> 添加组</a></li>');
            list.unshift('<li class="client-class"><a href="javascript:;" da-toggle="#0" da-type="group" t' +
                'itle="已加入终端"><div class="num"><span>' + _online + '</span>/' + _total + '</div>已加入终端</a></li>');

            lastList.unshift('<li><i class="isShowSubTerm"></i><a  href="javascript:;" da-toggle="#-1" da-type' +
                '="group" title="已卸载" class="' + (RsCore.cache.group.list['-1'].total > 0 ?
                    'hasNode' :
                    '') + '"><div class="num">' + RsCore.cache.group.list['-1'].total + '</div><span>已卸载</span></a></li>');

            lastList.unshift('<li class="client-class noactive"><a  href="javascript:;" da-toggle="#-2" da-typ' +
                'e="group"  title="无效终端"><div class="num">' + (blackTotal + unInsTotal) + '</div>无效终端</a></li>');
            if (location.hash.indexOf('sys/') >= 0) {
                list = list.concat(lastList);
            }
            $('.client-list ul').html(list.join(''));
            var selecTxt = '#' + params['g'] || 0;
            var choiceDom = $('.client-list a[da-toggle="' + selecTxt + '"]');
            if (choiceDom.length < 1) {
                $('.client-list a[da-toggle="#0"]').trigger('click');
            }
            var slideTitle = '';
            slideTitle = choiceDom.length && choiceDom
                .attr('title')
                .slice(0, 16)
                .split('');
            var slideTitleLen = slideTitle.length;
            var tSlideTitle = [];
            var k = 0;
            for (k; k < slideTitleLen; k++) {
                if (slideTitle[k].charCodeAt(0) > 255) {
                    tSlideTitle.push('<span>' + slideTitle[k] + '</span>');
                } else {
                    tSlideTitle.push('<i>' + slideTitle[k] + '</i>');
                }
            }
            choiceDom
                .parent()
                .addClass('active')
                .siblings()
                .removeClass('active');
            $('#choice-client').html(tSlideTitle.join(''));
        },
        /**
         * [resizeClientH 终端分组高度]
         * @return {[type]} [description]
         */
        resizeClientH: function () {
            var H = $('.c-page-wrap').height();
            var cmdH = $('#groupCmd').height();
            var _H = H - 50 - cmdH;
            if ($('.client-list').length) {
                $('.client-list ul:first').slimScroll({
                    height: _H,
                    size: '4px'
                });
            }
        },
        /**
         * [resizePolicyH 设置页高度控制]
         * @return {[type]} [description]
         */
        resizePolicyH: function () {
            var H = $('.c-page-wrap').height() - 150;
            if ($('#policyContent').length) {
                $('.tab-pane > .slimScrollDiv > dl,.tab-pane > dl').slimScroll({
                    height: H,
                    size: '4px'
                });
            }
        },
        /**
         * [resizeSilderNav 终端分组模拟滚动条]
         * @return {[type]} [description]
         */
        resizeSilderNav: function () {
            var H = $('.rs-page').height() - 159;
            if ($('.rs-page-nav').length) {
                $('.rs-page-nav > .slimScrollDiv >  ul,.rs-page-nav > ul').slimscroll({
                    height: H,
                    size: '4px'
                });
            }
        },
        /**
         * [silderNavStatus 终端分组栏 显示隐藏]
         * @return {[type]} [description]
         */

        silderNavStatus: function () {
            var view = $(document);
            var params = getUrlSearchQuerys();

            function _showLock() {
                view
                    .find('.client-list-header .client-lock')
                    .tooltip('destroy')
                    .tooltip({
                        html: true,
                        title: '<span style="white-space:nowrap;">固定</span>',
                        placement: 'bottom',
                        delay: {
                            show: 0,
                            hide: 0
                        }
                    });
            }

            function _hideLock() {
                view
                    .find('.client-list-header .client-lock')
                    .tooltip('destroy')
                    .tooltip({
                        html: true,
                        title: '<span style="white-space:nowrap;">隐藏</span>',
                        placement: 'bottom',
                        delay: {
                            show: 0,
                            hide: 0
                        }
                    });
            }
            if (params['off'] && params['off'] == 1) {
                view
                    .find('.c-page-wrap')
                    .addClass('off');
                _showLock();
            } else {
                _hideLock();
            }

            view
                .off('click', '.client-list-header .client-lock')
                .on('click', '.client-list-header .client-lock', function () {
                    var that = $(this),
                        target = that.closest('.c-page-silder'),
                        otarget = view.find('.c-page-container'),
                        wrap = view.find('.c-page-silder-wrap'),
                        parent = that.closest('.c-page-wrap'),
                        params = getUrlSearchQuerys(),
                        hash = window
                        .location
                        .hash
                        .split('?')[0];
                    if (parent.hasClass('off')) {
                        target.css({
                            width: '250px'
                        });
                        wrap.css({
                            'right': 0
                        });
                        otarget.css({
                            'margin-left': '250px'
                        });
                        parent.removeClass('off');
                        params['off'] = 0;
                        _hideLock();
                    } else {
                        target.animate({
                            width: '30px'
                        });
                        wrap.css({
                            'z-index': 1
                        });
                        otarget.animate({
                            'margin-left': '30px'
                        }, function () {
                            parent.addClass('off');
                        });
                        params['off'] = 1;
                        _showLock();
                    }

                    setTimeout(function () {
                        //view.find('#tbClient').bootstrapTable('referCol');
                        view
                            .find('#tbClient')
                            .trigger('resize.refreCol');
                    }, 1000);
                    window.location.hash = hash + '?' + params2str(params);
                });
            view
                .off('mouseenter', '.c-page-silder-hidden')
                .on('mouseenter', '.c-page-silder-hidden', function () {
                    var that = $(this),
                        parents = that.parents('.c-page-wrap'),
                        target = that
                        .parent()
                        .find('.c-page-silder-wrap');
                    if (parents.hasClass('off')) {

                        target.css({
                            'z-index': 99,
                            'right': '-221px'
                        });
                    }
                });
            view
                .off('mouseleave', '.c-page-silder')
                .on('mouseleave', '.c-page-silder', function () {
                    var that = $(this).find('.c-page-silder-wrap');
                    that
                        .stop()
                        .animate({
                            right: '0'
                        }, function () {
                            that.css({
                                'z-index': 1
                            });
                        });
                });

        },
        initialEdit: function (ele, type) {
            ele
                .find('b')
                .addClass('hide');
            ele
                .find('input')
                .addClass('hide');
            ele
                .find('span')
                .removeClass('hide');
            ele
                .find('i')
                .removeClass('hide');
            if (type == 'term') {
                ele
                    .find('.num')
                    .removeClass('hide');
            }
        },
        /**
         * [showGroupClient 终端分组栏是否显示组下终端]
         * @return {[type]} [description]
         */
        showGroupClient: function () {
            var view = $(document);
            var sgSelf = this;
            var params = getUrlSearchQuerys(),
                path = window
                .location
                .hash
                .split('?')[0];

            function _showClient() {
                view
                    .find('.client-list-header .client-show')
                    .tooltip('destroy')
                    .tooltip({
                        title: '显示终端',
                        placement: 'bottom',
                        delay: {
                            show: 0,
                            hide: 0
                        }
                    });
            }

            function _hideClient() {
                view
                    .find('.client-list-header .client-show')
                    .tooltip('destroy')
                    .tooltip({
                        title: '隐藏终端',
                        placement: 'bottom',
                        delay: {
                            show: 0,
                            hide: 0
                        }
                    });
            }

            if (params['copen'] == 0) {
                $('.client-list').addClass('inrm');
                _showClient();
            } else {
                $('.client-list').removeClass('inrm');
                _hideClient();
            }

            view
                .off('click', '.client-list-header .client-show')
                .on('click', '.client-list-header .client-show', function () {
                    var params = getUrlSearchQuerys(),
                        path = window
                        .location
                        .hash
                        .split('?')[0];
                    if (RsCore.cache.showGroupClient) {
                        RsCore.cache.showGroupClient = false;
                        params['copen'] = 0;
                        $('.client-list').removeClass('angleUp');
                        $('.active')
                            .find('input')
                            .removeClass('edit');
                        $('.client-list').removeClass('angLeft');
                        $('.client-list').addClass('inrm');
                        $('.c-page-wrap').removeClass('showClient');
                        $('.client-list .nav ul').remove();
                        _showClient();
                    } else {
                        RsCore.cache.showGroupClient = true;
                        params['copen'] = 1;
                        isClickShow = true;
                        $('.active')
                            .removeClass('angLeft')
                            .find('input')
                            .addClass('edit');
                        $('.client-list').removeClass('inrm');
                        $('.client-list').addClass('angLeft');
                        $('.c-page-wrap').addClass('showClient');
                        $('.client-list').trigger('getGroupClient');
                        _hideClient();
                    }
                    window.location.hash = path + '?' + params2str(params);
                });

            view
                .off('getGroupClient', '.client-list')
                .on('getGroupClient', '.client-list', function (event, flag) {
                    sgSelf.initialEdit($(this).find('.nav-list'), 'term');
                    var tpl = '<li><a href="javascript:;" da-toggle="#{{sguid}}" da-type="client"><i class="sed' +
                        'it pull-right"></i><span>{{name}}</span></a><b class="hide ok">确定</b><b class="h' +
                        'ide cancel">取消</b><input type="text" class="hide"/></li>';
                    var html = [];
                    var params = getUrlSearchQuerys();
                    var tag = $('.client-list .nav > .active');
                    $('.group-client').remove();
                    if (tag.find(' > a').attr('da-toggle') == '#0') {
                        return false;
                    }
                    if (params['copen'] == 0) {
                        return false;
                    }
                    var clients = RsCore.cache.groupClient;

                    if (!flag) {
                        var hash = window
                            .location
                            .hash
                            .split('/')[0]
                            .substring(1),
                            getUrl = '',
                            getDataParams;
                        if (hash == 'sys') {
                            getUrl = 'Group/getgroupComputer';
                            getDataParams = {
                                groupid: params['g'],
                                limit: 0
                            };
                        } else if (hash == 'virus') {
                            getUrl = 'Xavlog/getClientsOverview';
                            getDataParams = {
                                objId: params['g'],
                                limit: 0
                            };
                        } else if (hash == 'protection') {
                            getUrl = 'Rfwlog/getRfwOverview';
                            getDataParams = {
                                objId: params['g'],
                                limit: 0
                            };
                        } else if (hash == 'mobile') {
                            getUrl = 'PhoneLog/getClientsOverview';
                            getDataParams = {
                                objId: params['g'],
                                limit: 0
                            };
                        }
                        RsCore
                            .ajax(getUrl, getDataParams, function (data) {
                                if (!data) {
                                    return false;
                                }
                                var cls = data.rows;
                                RsCore.cache.groupClient = cls;
                                if (cls.length) {
                                    tag.addClass('angLeft');
                                    for (var i = 0; i < cls.length; i++) {
                                        var client = cls[i];
                                        client['name'] = (client['memo'] && client['memo'] !== '') ?
                                            client['memo'] :
                                            client['computername'];
                                        html.push(mustache.render(tpl, client));
                                    }
                                    var viewDom = $('<ul class="group-client">').append(html.join(''));
                                    if (tag.has($('.group-client'))) {
                                        $('.group-client').remove();
                                    }
                                    tag.append(viewDom);
                                    tag
                                        .find('input')
                                        .eq(0)
                                        .addClass('active')
                                        .removeClass('edit');
                                    if (params['c']) {
                                        var $c_obj = $('.client-list a[da-toggle="#' + params['c'] + '"]');
                                        if ($c_obj.length) {
                                            $c_obj
                                                .closest('li')
                                                .addClass('on');
                                        } else {
                                            delete params['c'];
                                            window.location.hash = path + '?' + params2str(params);
                                        }
                                    }
                                }
                            });
                    } else if (clients.length) {
                        tag.addClass('angLeft');
                        for (var i = 0; i < clients.length; i++) {
                            var client = clients[i];
                            client['name'] = (client['memo'] && client['memo'] !== '') ?
                                client['memo'] :
                                client['computername'];
                            html.push(mustache.render(tpl, client));
                        }
                        var viewDom = $('<ul class="group-client">').append(html.join(''));
                        if (tag.has($('.group-client'))) {
                            $('.group-client').remove();
                        }
                        tag.append(viewDom);
                        tag
                            .find('input')
                            .eq(0)
                            .addClass('active')
                            .removeClass('edit');
                        if (params['c']) {
                            var $c_obj = $('.client-list a[da-toggle="#' + params['c'] + '"]');
                            if ($c_obj.length) {
                                $c_obj
                                    .closest('li')
                                    .addClass('on');
                            } else {
                                delete params['c'];
                                window.location.hash = path + '?' + params2str(params);
                            }
                        }
                    }

                });

            if (!params['copen']) {
                params['copen'] = 0;
                RsCore.cache.showGroupClient = false;
                window.location.hash = path + '?' + params2str(params);
            } else if (params['copen'] == 0) {
                RsCore.cache.showGroupClient = false;
            } else if (params['copen'] == 1) {
                RsCore.cache.showGroupClient = false;
                $('.c-page-wrap').addClass('showClient');
                $('.client-list').trigger('getGroupClient');
            }

        },
        initEvent: function () {
            var view = $(document);
            var sgSelf = this;
            /*终端管理*/
            view.on('click', '.client-list a[da-toggle]', function (e) {
                var that = $(this);
                var params = getUrlSearchQuerys();
                var slideTitle,
                    slideTitleLen,
                    tSlideTitle = [],
                    i;
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    window.event.returnValue = false;
                }
                if (!that.attr('da-toggle')) {
                    return false;
                }
                var groupId,
                    clientId;
                var path = window
                    .location
                    .hash
                    .split('?')[0];
                pushClient.push(that.parent().index());
                var clickPushLen = pushClient.length;
                that
                    .parent()
                    .find('li')
                    .removeClass('on');
                if (that.attr('da-type') == 'group') {
                    groupId = that
                        .attr('da-toggle')
                        .substring(1);
                    params['g'] = groupId;
                    if (RsCore.cache.group.list[params['g']]) {
                        if (RsCore.cache.group.list[params['g']].type == 2) {
                            $('.c-page-nav .nav li[da-type=policy]').hide();
                        } else {
                            $('.c-page-nav .nav li[da-type=policy]').show();
                        }
                    }
                    delete params['c'];
                    if (groupId != null) {
                        sgSelf.initialEdit(that.parents('.nav-list'));
                        if (that.parent().hasClass('active') && !isClickShow) {
                            window.location.hash = path + '?' + params2str(params);
                            return;
                        } else {
                            isClickShow = false;
                            $('.client-list').removeClass('angleUp');
                            window.location.hash = path + '?' + params2str(params);
                            $('.active').removeClass('angLeft');
                            that
                                .closest('.client-list')
                                .find('.active')
                                .removeClass('active')
                                .end()
                                .find('.group-client')
                                .remove();
                            that
                                .parent()
                                .addClass('active');
                            slideTitle = that
                                .attr('title')
                                .slice(0, 16)
                                .split('');
                            slideTitleLen = slideTitle.length;
                            tSlideTitle = [];
                            i = 0;
                            for (i; i < slideTitleLen; i++) {
                                if (slideTitle[i].charCodeAt(0) > 255) {
                                    tSlideTitle.push('<span>' + slideTitle[i] + '</span>');
                                } else {
                                    tSlideTitle.push('<i>' + slideTitle[i] + '</i>');
                                }
                            }
                            $('#choice-client').html(tSlideTitle.join(''));
                            if (RsCore.cache.showGroupClient) {
                                $('.client-list').trigger('getGroupClient', [false]);
                            }
                        }

                    }
                } else if (that.attr('da-type') == 'client') {
                    groupId = that
                        .closest('.active')
                        .find('> a')
                        .attr('da-toggle')
                        .substring(1);
                    clientId = that
                        .attr('da-toggle')
                        .substring(1);
                    params['g'] = groupId;
                    params['c'] = clientId;
                    if (RsCore.cache.group.list[params['g']]) {
                        if (RsCore.cache.group.list[params['g']].type == 2) {
                            $('.c-page-nav .nav li[da-type=policy]').hide();
                        } else {
                            $('.c-page-nav .nav li[da-type=policy]').show();
                        }
                    }
                    if (groupId != null && clientId != null) {
                        window.location.hash = path + '?' + params2str(params);
                        that
                            .closest('ul')
                            .find('.on')
                            .removeClass('on');
                        that
                            .parent()
                            .addClass('on');
                        sgSelf.initialEdit(that.parents('.nav-list'));
                    }
                }

            });

            /*终端展开折叠*/
            view.on('click', '.isShowSubTerm', function (e) {
                var $parent = $(this).parent();
                var $term = $parent.find('a');
                var isTerm = $term.hasClass('hasNode');
                var isTermCont = $parent
                    .has('.group-client')
                    .length;
                if (isTerm && isTermCont) {
                    $('.group-client').remove();
                    isClickShow = true;
                    $('.client-list').addClass('angleUp');
                } else if (isTerm) {
                    isClickShow = true;
                    $term.trigger('click');
                    $('.client-list').removeClass('angleUp');
                }
            });

            /*页面导航*/
            view.on('click', '.c-page-nav > ul > li a', function (e) {
                var that = $(this);
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    window.event.returnValue = false;
                }
                var tag = that.attr('da-toggle'),
                    hash = window
                    .location
                    .hash
                    .substring(1),
                    idx = hash.indexOf('?'),
                    params = getUrlSearchQuerys();
                if (idx > 0) {
                    window.location.hash = tag + '?' + params2str(params);
                } else {
                    window.location.hash = tag + '?g=0';
                }
                that
                    .parent()
                    .addClass('active')
                    .siblings()
                    .removeClass('active');
            });

            // /*策略内容导航*/ var policyop = null; view.on('click', '.c-moudle-nav li',
            // function(e) {     if (e.preventDefault) {         e.preventDefault();     }
            // else {         window.event.returnValue = false;     }     var that =
            // $(this),         policy = that.find('a').attr('da-toggle').substring(1),
            //    path = window.location.hash.split('?')[0],         params =
            // getUrlSearchQuerys(),         groupId = params['g'],         html = '',
            //   tpl = '';     params['p'] = that.index();     window.location.hash = path +
            // '?' + params2str(params);
            // that.addClass('active').siblings().removeClass('active');     if (groupId ==
            // '0' && !params['c']) {         return false;     }     if (policy ==
            // 'EB8AFFA5-0710-47e6-8F53-55CAE55E1915_1') {
            // RsCore.ajax('/Policy/getAutoGroup', function(result) {             result =
            // result || [];             require(['policy/' + policy], function(_policy) {
            //               view.find('#policyContent').off().empty();
            // policyop = _policy.render(view.find('#policyContent'), result);
            // }, function(err) {                 //requirejs加载模块失败,删除模块加载标记
            // var failedId = err.requireModules && err.requireModules[0];
            // requirejs.undef(failedId);             });         })     } else {
            // RsCore.ajax('Policy/getPolicy', {             grouptype: params['c'] ? 2 : 1,
            //             objid: params['c']||params['g'],             productid:
            // policy.split('_')[0],             eid: RsCore.cache.group.eid,
            // policytype: policy.split('_')[1]         }, function(result) {
            // require(['policy/' + policy], function(data) {
            // view.find('#policyContent').off().empty();                 if (result) {
            //                policyop = data.render(view.find('#policyContent'),
            // $.parseJSON(result.policyjson));                 } else {
            // policyop = data.render(view.find('#policyContent'));                 }
            //          op.resizePolicyH();             }, function(err) {
            // //requirejs加载模块失败,删除模块加载标记                 var failedId = err.requireModules
            // && err.requireModules[0];                 requirejs.undef(failedId);
            //    });         });     } })

            /*组管理快捷命令*/
            view.on('click', '.groupCmdTit', function () {
                var that = $(this),
                    tag = that.find('.groupCmdToggle i'),
                    params = getUrlSearchQuerys(),
                    hash = window
                    .location
                    .hash
                    .split('?')[0];
                var status = that.hasClass('open');
                if (!status) {
                    view
                        .find('.groupCmdBod')
                        .slideDown(600, function () {
                            op.resizeClientH();
                        });
                    tag
                        .addClass('arrow-double-down')
                        .removeClass('arrow-double-up');
                    that.addClass('open');
                    params['open'] = 1;
                } else {
                    view
                        .find('.groupCmdBod')
                        .slideUp(600, function () {
                            op.resizeClientH();
                        });
                    tag
                        .removeClass('arrow-double-down')
                        .addClass('arrow-double-up');
                    that.removeClass('open');
                    params['open'] = 0;
                }
                window.location.hash = hash + '?' + params2str(params);
            });

            /*新加组*/
            //组操作绑定
            //
            view.on('keydown', '#mGroup', function (e) {
                if (e.keyCode == '13') {
                    $('#btnSaveGroup').trigger('click');
                }
            });

            // $('#mGroup').on("keydown",function(e){ 	if(e.keyCode == "13"){
            // 		$("#btnSaveGroup").trigger("click"); 	} });

            view.on('shown.mGroup', '#mGroup', function () {
                document
                    .activeElement
                    .blur();
                $('#mGroup #txtGroupName').focus();
            });
            // $('#mGroup').on('shown',function(){     $('#mGroup #txtGroupName').focus();
            // });

            $(document).on('click', '.client-list i.del', function (e) {
                    var atarget = $(this).parent();
                    var id = atarget
                        .attr('da-toggle')
                        .substring(1);
                    var gName = atarget
                        .find('span')
                        .text();
                    bootbox.confirm('是否删除 [' + RsCore.cache.group.list[id].groupname + '] 组', function (r) {
                        if (r) {
                            RsCore
                                .ajax('Group/delGroup', {
                                    id: id,
                                    gName: gName
                                }, function () {
                                    var params = getUrlSearchQuerys(),
                                        hash = window
                                        .location
                                        .hash
                                        .split('?')[0];
                                    if (id == params['g']) {
                                        op.refreshClientSync();
                                        $('.client-list li:first a').trigger('click');
                                    } else {
                                        op.refreshClient();
                                    }
                                });
                        }
                    });
                    return false;
                })
                .on('click', '.client-list i.edit', function (e) {
                    var $parents = $(this).parents('li');
                    sgSelf.initialEdit($parents.parent(), 'term');
                    var $a = $(this).parent();
                    var $num = $a.find('.num');
                    var $i = $a.find('i');
                    var $b = $a.siblings('b');
                    var $reNameEl = $a
                        .find('span')
                        .eq(1);
                    var $input = $a.siblings('input');
                    var $save = $b.eq(0);
                    var $cancel = $b.eq(1);
                    var reNameValue = $reNameEl.text();
                    $b.removeClass('hide');
                    $i.addClass('hide');
                    $num.addClass('hide');
                    $input
                        .removeClass('hide')
                        .val(reNameValue)[0]
                        .focus();
                    $reNameEl.addClass('hide');
                    var id = $a
                        .attr('da-toggle')
                        .slice(1);
                    var lastValue = '';

                    $input
                        .off('keyup')
                        .on('keyup', function (e) {
                            if (e.keyCode == 13) {
                                sure();
                            } else if (e.keyCode == 27) {
                                restore();
                            }
                        });

                    e.stopPropagation();
                    $save
                        .off('click')
                        .on('click', function () {
                            sure();
                        });

                    $cancel
                        .off('click')
                        .on('click', function () {
                            restore();
                        });

                    function sure() {
                        lastValue = $.trim($input.val());
                        var names = [];
                        $('.client-list .nav > li > a:not([da-toggle="#' + id + '"]) > span').each(function (i, item) {
                            names.push($(item).text());
                        });
                        if (reNameValue == lastValue) {
                            RsCore
                                .msg
                                .warn('未做修改');
                            restore();
                        } else if (getLen(lastValue) > 20) {
                            RsCore
                                .msg
                                .warn('名称超出限制，最多为10个中文或20个英文');
                            $input.focus();
                        } else if (getLen(lastValue) == 0) {
                            RsCore
                                .msg
                                .warn('名称不能为空');
                            $input.focus();
                        } else if (names.indexOf(lastValue) >= 0) {
                            RsCore
                                .msg
                                .warn('名称与当前现有组名重复');
                            $input.focus();
                        } else {
                            //预留接口
                            RsCore
                                .ajax('Group/editGroup', {
                                    id: id,
                                    name: lastValue
                                }, function (data, r) {
                                    if (!r) {
                                        //RsCore.msg.success("修改组成功");
                                        $reNameEl.text(lastValue);
                                        $input.blur();
                                        restore();
                                        op.refreshClient();
                                    } else {
                                        RsCore
                                            .msg
                                            .warn('修改组失败');
                                        restore();
                                    }
                                });
                        }
                    }

                    function restore() {
                        $b.addClass('hide');
                        $input.addClass('hide');
                        $reNameEl.removeClass('hide');
                        $i.removeClass('hide');
                        $parents
                            .parent()
                            .find('.num')
                            .removeClass('hide');
                    }
                })
                .on('click', 'span.group-add', function (e) {
                    $('#mGroup #btnSaveGroup').removeData('id');
                    $('#mGroup #mGroupTitle').text('添加新组');
                    $('#mGroup .modal-body #txtGroupName').val('');
                    $('#mGroup').modal();
                    return false;
                });

            //修改终端

            $(document).on('click', '.client-list i.sedit', function (e) {
                var $parents = $(this).parents('.group-client');
                sgSelf.initialEdit($parents.parents('.nav-list'), 'term');
                var $a = $(this).parent();
                var $i = $a.find('i');
                var $b = $a.siblings('b');
                var $reNameEl = $a.find('span');
                var $input = $a.siblings('input');
                var $save = $b.eq(0);
                var $cancel = $b.eq(1);
                var reNameValue = $reNameEl.text();
                $b.removeClass('hide');
                $i.addClass('hide');
                $input
                    .removeClass('hide')
                    .focus()
                    .val(reNameValue);
                $reNameEl.addClass('hide');
                var id = $a
                    .attr('da-toggle')
                    .slice(1);
                var lastValue = '';

                $input
                    .off('keyup')
                    .on('keyup', function (e) {
                        if (e.keyCode == 13) {
                            sure();
                        } else if (e.keyCode == 27) {
                            restore();
                        }
                    });

                e.stopPropagation();
                $save
                    .off('click')
                    .on('click', function () {
                        sure();
                    });

                $cancel
                    .off('click')
                    .on('click', function () {
                        restore();
                    });

                function sure() {
                    lastValue = $.trim($input.val());
                    if (reNameValue == lastValue) {
                        RsCore
                            .msg
                            .warn('未做修改');
                        restore();
                    } else if (getLen(lastValue) > 20) {
                        RsCore
                            .msg
                            .warn('名称超出限制，最多为10个中文或20个英文');
                        $input.focus();
                    } else if (getLen(lastValue) == 0) {
                        RsCore
                            .msg
                            .warn('名称不能为空');
                        $input.focus();
                    } else {
                        //预留接口
                        RsCore
                            .ajax('ep/setmemo', {
                                sguid: id,
                                memo: lastValue
                            }, function (data, r) {
                                if (!r) {
                                    RsCore
                                        .msg
                                        .success('修改成功');
                                    view
                                        .find('#tbClient')
                                        .bootstrapTable('refresh');
                                    $reNameEl.text(lastValue);
                                    restore();
                                } else {
                                    RsCore
                                        .msg
                                        .warn('修改失败');
                                    restore();
                                }
                            });
                    }
                }

                function restore() {
                    $b.addClass('hide');
                    $input.addClass('hide');
                    $reNameEl.removeClass('hide');
                    $i.removeClass('hide');
                }
            });

            function getLen(str) {
                return str
                    .replace(/[^\x00-\xff]/g, 'tt')
                    .length;
            }

            $(document)
                .on('click', '#mGroup #btnSaveGroup', function () {
                    var names = [],
                        txt = $.trim($('#mGroup #txtGroupName').val()),
                        id = $(this).data('id');
                    $('.client-list .nav > li > a:not([da-toggle="#' + id + '"]) > span').each(function (i, item) {
                        names.push($(item).text());
                    });

                    if (names.indexOf(txt) >= 0) {
                        RsCore
                            .msg
                            .warn('组名称与现有组重复！');
                        return false;
                    }

                    if (getLen(txt) > 20) {
                        RsCore
                            .msg
                            .warn('组名称超出限制，最多为10个中文或20个英文');
                        return false;
                    }

                    if (txt == '') {
                        RsCore
                            .msg
                            .warn('组名不能为空');
                        return false;
                    } else {
                        if (!(/[0-9a-zA-Z_-]+|[\u2E80-\u9FFF]+/.test(txt))) {
                            RsCore
                                .msg
                                .warn('组名由中文或英文组成');
                            return false;
                        }
                    }

                    //var id = $(this).data('id');
                    var info;
                    if (id) {
                        //编辑
                        info = {
                            id: id,
                            name: txt
                        };
                        RsCore.ajax('Group/editGroup', info, function () {
                            RsCore
                                .msg
                                .success('组信息修改成功');
                            $('#mGroup').modal('hide');
                            var currentPath = RsCore.getCurrentPath();
                            if (currentPath) {
                                if (/^#manage\/group$/.test(currentPath)) {
                                    $('#c-manage')
                                        .find('#tbGroup')
                                        .bootstrapTable('refresh');
                                }
                            }
                            op.refreshClient();
                        });
                    } else {
                        //新增
                        info = {
                            name: $('#mGroup #txtGroupName').val()
                        };
                        RsCore.ajax('Group/editGroup', info, function () {
                            RsCore
                                .msg
                                .success('新增分组成功');
                            $('#mGroup').modal('hide');
                            var currentPath = RsCore.getCurrentPath();
                            if (currentPath) {
                                if (/^#manage\/group$/.test(currentPath)) {
                                    $('#c-manage')
                                        .find('#tbGroup')
                                        .bootstrapTable('refresh');
                                }
                            }
                            op.refreshClient();
                        });
                    }
                });

            /*******************************************
             *
             * 命令
             *
             ******************************************/
            view.on('click', '.select-new-mode i', function () {
                var fa = $(this).closest('.select-new-mode');
                if (fa.hasClass('active')) {
                    fa.removeClass('active');
                } else {
                    fa.addClass('active');
                }
                return false;
            });

            view.on('click', '#groupCmd i', function () {
                var fa = $(this).closest('li');
                if (fa.hasClass('active')) {
                    fa.removeClass('active');
                } else {
                    fa.addClass('active');
                }
                return false;
            });
            $(document).on('click', function () {
                $('.select-new-mode').removeClass('active');
                $('#groupCmd li').removeClass('active');
            });

            /*发送组命令*/
            view.on('click', '.group-cmd a[data-cmdid]', function () {
                var that = $(this);
                sendCMD('group', that);
            });

            /*发送终端命令*/
            view.on('click', '.client-cmd [data-cmdid]', function () {
                var that = $(this);
                sendCMD('client', that);
            });

            /*发送命令*/
            function sendCMD(type, that) {
                if (that.hasClass('process')) {
                    return false;
                } else {
                    that.addClass('process');
                }
                var id = '';
                var grouptype = '';
                var $msgBox = $('#msGroup');
                var $msgInput = $('#txtsGroupName');
                var $sureBtn = $('#btnsSaveGroup');
                var $title = $('#msGroupTitle');
                var $cancelBtn = $('#btnsCloseGroup,#closeMs');
                var cmdid = that.data('cmdid');
                var data = null;
                var _objects = {};
                if (type == 'group') {
                    var $activeGroup = view.find('.client-list li.active a');
                    id = Number($activeGroup.attr('da-toggle').substring(1));
                    if (id == 0) {
                        grouptype = 0;
                        _objects = {
                            group: [{
                                guid: id,
                                name: $activeGroup.attr('title')
                            }]
                        };
                    } else {
                        grouptype = 1;
                        _objects = {
                            group: [{
                                guid: id,
                                name: $activeGroup.attr('title')
                            }]
                        };
                    }
                    data = {
                        objIds: [id],
                        grouptype: grouptype,
                        cmdid: cmdid,
                        objects: _objects
                    };
                    if (!('' + id)) {
                        RsCore
                            .msg
                            .notice('没有选中组');
                        that.removeClass('process');
                        return false;
                    }
                } else {
                    id = op.getClients($('.c-page-container'));
                    if (!id) {
                        that.removeClass('process');
                        return false;
                    }
                    _objects.ep = [];
                    $.each(id, function (idx, val) {
                        _objects
                            .ep
                            .push({
                                guid: val,
                                name: $('.overview-ico[da-toggle="#' + val + '"]').text()
                            });
                    });
                    data = {
                        objIds: id,
                        grouptype: 2,
                        cmdid: cmdid,
                        objects: _objects
                    };
                }

                if (cmdid == 'msg') {
                    if (data.objIds) {
                        $msgBox.removeClass('hide');
                        $title.text('发送消息');
                        $msgInput
                            .val('')
                            .focus();
                        $sureBtn
                            .off('click')
                            .on('click', function () {
                                var val = $.trim($msgInput.val());
                                if (val) {
                                    data.cmdData = val;
                                    sendMsg('msg');
                                    $msgBox.addClass('hide');
                                } else {
                                    RsCore
                                        .msg
                                        .warn('消息不能为空');
                                }
                            });
                        $cancelBtn
                            .off('click')
                            .on('click', function () {
                                that.removeClass('process');
                                $msgBox.addClass('hide');
                            });
                    } else {
                        sendMsg('msg');
                    }

                } else {
                    sendMsg();
                }

                function sendMsg(type) {
                    if ('' + id) {
                        RsCore
                            .ajax('Cmd/editCmd', data, function (r) {
                                if (type == 'msg') {
                                    $('#orderFlow2').modal();
                                } else {
                                    $('#orderFlow').modal();
                                }
                            }, function () {
                                that.removeClass('process');
                            });
                    } else {
                        that.removeClass('process');
                    }
                }
            }

            view
                .on('click', '#orderFlowGo', function () {
                    var params = getUrlSearchQuerys();
                    var href = $(this).attr('url-data');
                    window.location.hash = href + '?g=' + (params['g'] || 0);
                    $('#orderFlow').modal('hide');
                });

            view.on('click', '#orderFlowGo2', function () {
                var params = getUrlSearchQuerys();
                var href = $(this).attr('url-data');
                window.location.hash = href + '?g=' + (params['g'] || 0);
                $('#orderFlow2').modal('hide');
            });

            view.on('click', '.client-view-back', function () {
                $('.client-list .nav li.active a').trigger('click');
            });

            /********************
             *
             *window resize
             *
             *********************/
            $(window).on('resize', function () {
                op.resizeClientH();
                op.resizePolicyH();
                op.resizeSilderNav();
            });

        },
        getClients: function (view) {
            var arr = [];
            var params = getUrlSearchQuerys();
            if (params['c']) {
                arr.push(params['c']);
            } else {
                view
                    .find(':checkbox[name=btSelectItem]:checked')
                    .each(function () {
                        arr.push($(this).closest('tr').find('a').attr('da-toggle').substring(1));
                    });
            }

            if (arr.length == 0) {
                RsCore
                    .msg
                    .notice('请先选择要下发命令的终端 !');
                return false;
            }
            return arr;
        },
        correctNavTab: function () {
            var hash = window.location.hash,
                path = hash.split('?')[0],
                tabName = path.split('/')[1],
                target = $('.c-page-nav a[da-toggle$="' + tabName + '"]');
            if (target.length) {
                target
                    .parent()
                    .addClass('active')
                    .siblings()
                    .removeClass('active');
            } else {
                $('.c-page-nav a:eq(0)').trigger('click');
            }
        },
        initGroupCmd: function () {
            var params = getUrlSearchQuerys();
            var hash = window
                .location
                .hash
                .split('?')[0];
            if (!params['open']) {
                params['open'] = 1;
                window.location.hash = hash + '?' + params2str(params);
            }
            if (params['open'] == 1) {
                $('.groupCmdTit').addClass('open');
                $('.groupCmdBod').show();
                $('.groupCmdToggle i')
                    .removeClass('arrow-double-up')
                    .addClass('arrow-double-down');
            } else {
                $('.groupCmdTit').removeClass('open');
                $('.groupCmdBod').hide();
                $('.groupCmdToggle i')
                    .removeClass('arrow-double-down')
                    .addClass('arrow-double-up');
            }

        }

    };

    return {
        init: op.init,
        refreshClientSync: op.refreshClientSync,
        refreshClient: op.refreshClient
    };
});