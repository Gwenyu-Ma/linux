define(function (require) {
    var tpl = require('text!bag/list.html');
    var mustache = require('mustache');
    require('colResizable');
    require('table');
    require('css!table');
    require('util_b');
    require('selectric');
    require('css!selectric');
    var common = require('common');
    var getUrlSearchQuerys = RsCore.assist.getUrlSearchQuerys;
    var params2str = RsCore.assist.params2str;
    var op = {

        init: function (container, type, first) {
            var view = $(container);
            var html = '';
            var dataobj = {};
            dataobj[op._type] = true;
            html = mustache.render(tpl, dataobj);
            view.html(html);
            op.initHisTerm();
            op.resizeContent();
            op.initEvent(view);
        },
        initHisTerm: function () {
            var html = [];
            html.push('<tr>');
            html.push('<td>{{len}}</td>');
            html.push('<td>{{username}}</td>');
            html.push('<td>{{eid}}</td>');
            html.push('<td>{{linux_L27I_name}}</td>');
            html.push('<td>{{linux_L25I_name}}</td>');
            html.push('<td>{{linux_LMIPS_name}}</td>');
            html.push('<td>{{windows_name}}</td>');
            html.push('<td>{{updated_at}}</td>');
            html.push('</tr>');
            RsCore.ajax({
                url: 'Packages/getEidsList',
                type: 'get',
                dataType: "json",
                success: function (data) {
                    var da = data;
                    var _html = [];
                    if (da == null) {
                        return false;
                    }
                    if (da.length == 0) {
                        return false;
                    }
                    for (var i = 0; i < da.length; i++) {
                        var _da = da[i];
                        _da['len'] = i+1;
                        _da['linux_name'] = _da['linux_name'] == '' ? '无' : _da['linux_name'];
                        _da['windows_name'] = _da['windows_name'] == '' ? '无' : _da['windows_name'];
                        _html.push(mustache.render(html.join(''), _da))
                    }

                    $('.packages-content tbody').html(_html.join(''));
                }
            })
        },
        resizeContent: function () {
            var H = $('.c-page-container').height();
            if ($('.rs-page-nav').length) {
                $('.c-page-content > .slimScrollDiv > .packages-content,.c-page-content > .packages-content').slimscroll({
                    height: H,
                    size: '0px',
                    alwaysVisible: false
                });
            }
            $('.packages-content').css("overflow","auto")
        },
        initEvent: function (view) {

            $(window).on('resize.home', function () {
                op.resizeContent();
            })
        }
    };
    return {
        container: '.c-page-content',
        render: function (container) {
            document.title = '包管理-企业列表';
            op.init(container, null, true);

        },
        destroy: function () {
            $(this.container).find('#tbClient').colResizable({
                'disable': true
            });
            $(window).off('resize.log');
            $(this.container).off().empty();
        }
    };
});