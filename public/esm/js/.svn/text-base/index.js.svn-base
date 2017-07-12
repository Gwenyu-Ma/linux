define(function(require) {
    // 设置弹出框为中文
    bootbox.setLocale('zh_CN');
    require('slimscroll');
    return {
        init: function() {
            // 首页导航选中
            $(window).on('PageLoad.nav', function(e, current, previous) {
                if (!previous || previous[0] != current[0]) {
                    previous && $('#page-nav>li>a[href^="#' + previous[0] + '"]').parent().removeClass('active');
                    $('#page-nav>li>a[href^="#' + current[0] + '"]').parent().addClass('active');
                }
            });

            function join(obj) {
                var arr = [];
                for (var key in obj) {
                    arr.push(key + '=' + obj[key]);
                }
                return arr.join('&');
            }
            $('#page-nav>li>a').on('click', function(e) {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    window.event.returnValue = false;
                }

                var hash = window.location.hash.substring(1),
                    tag = $(this).attr('href'),
                    idx1 = hash.indexOf('/'),
                    params = RsCore.assist.getUrlSearchQuerys();

                var nodrict = [];
                if (nodrict.indexOf(tag) > -1) {
                    return false;
                }
                $(this).closest('li').addClass('active').siblings().removeClass('active');

                if (tag == '#home') {
                    window.location.href = tag + '?' + join(params);
                } else if (idx1 > 0) {
                    if (tag == '#settings') {
                        window.location.href = tag + '/overview?' + join(params);
                    } else {
                        window.location.href = tag + '/' + hash.substring(idx1 + 1);
                    }
                } else {
                    if (!params['g']) {
                        params['g'] = 0;
                    }
                    window.location.href = tag + '/overview?' + join(params);
                }
            });

            /*页面右上角设置 等同系统设置*/
            $(document).on('click', '.rs-page-user .options', function() {
                $('#page-nav a[href="#settings"]').trigger('click');
                return false;
            });



            /*开发中提示*/
            $('.rs-page-nav li.noactive').tooltip({
                html: true,
                title: '<span style="white-space:nowrap;">开发中，敬请期待</span>',
                placement: 'bottom',
                delay: {
                    show: 0,
                    hide: 0
                }
            });
        }
    };
});