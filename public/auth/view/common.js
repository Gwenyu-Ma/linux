define(function (require) {

    var getUrlSearchQuerys = RsCore.assist.getUrlSearchQuerys,
        params2str = RsCore.assist.params2str,
        mustache = require('mustache');
    var op = {
        init: function () {

            RsCore.ajax({
                url: 'Systemconfig/getSystenInfo',
                success: function (data) {
                    var tit = data['title'];
                    var subTit = data['subTitle'];

                    $('.js_mainTitle').text(tit);
                    $('.js_subTitle').text(subTit);
                    $('.js_username').text(data['loginName']);
                }
            })
            op.initEvent();
            op.correctNavTab();
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
        initEvent: function () {
            var view = $(document);
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
                    window.location.hash = tag;
                }
                that
                    .parent()
                    .addClass('active')
                    .siblings()
                    .removeClass('active');
            });

        }
    };
    return {
        init: op.init,
        correctNavTab: op.correctNavTab
    }
})