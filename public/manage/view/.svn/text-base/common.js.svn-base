define(function (require) {

    var getUrlSearchQuerys = RsCore.assist.getUrlSearchQuerys,
        params2str = RsCore.assist.params2str,
        mustache = require('mustache');
    require('validation');
    require('form');
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

            view.on('click', '.js_sq_box_show', function () {
                $('.js_sq_box form')[0].reset();
                $('.js_sq_box .step02').hide();
                $('.js_sq_box .step01').show();
                $('.js_sq_box').modal();
            })

            $.validator.addMethod('sn', function (value, element) {
                var arr = value.split('-');
                for (var i in arr) {
                    if (!/^[A-Z1-9]{5}$/.test(arr[i])) {
                        return false;
                    }
                }
                return this.optional(element) || (arr.length == 5 || arr.length == 4);
            })

            var form = view.find('.js_sq_box form');
            form.validate({
                rules: {
                    sn: {
                        required: true,
                        sn: true
                    },
                    auth: 'required'
                },
                messages: {
                    sn: {
                        required: '序列号不能为空',
                        sn: '序列号格式错误'
                    },
                    auth: '请上传授权文件'
                },
                errorElement: 'span',
                errorPlacement: function (error, element) {
                    var errLabel = element.closest('.step_form');
                    errLabel.append(error);
                }
            })

            view.on('click', '.js_sq_box .js_step01', function () {
                var me = $(this);
                var form = view.find('.js_sq_box form');
                var flag = form.valid();
                if (flag && !me.hasClass('process')) {
                    me.addClass('process');
                    me.html('<i class="mr5"></i>正在导入，请稍等');
                    form.find('.step_file').append('<div class="js_sq_mask" style="position:absolute;width:100%;height:100%;left:0;top:0;z-index:5"></div>');
                    view.find('form').ajaxSubmit({
                        url: '/index.php/Auth/importAuth',
                        success: function (json) {
                            me.removeClass('process');
                            me.html('立即授权');
                            json = JSON.parse(json);
                            if (json && json.r) {
                                var r = json.r;
                                switch (r.code) {
                                    case 0:
                                        $('.js_sq_box .step02').show();
                                        $('.js_sq_box .step01').hide();
                                        me.removeClass('process');
                                        me.html('立即导入授权');
                                        form[0].reset();
                                        form.find('.js_sq_mask').remove();
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
                                        me.removeClass('process');
                                        me.html('立即导入授权');
                                        form.find('.js_sq_mask').remove();
                                        RsCore.msg.warn(r.msg);
                                        break;
                                }
                            } else {
                                alert('ajax error:', json);
                            };
                            $(".step_form input").val('');
                        },
                        error: function () {
                            me.removeClass('process');
                            me.html('立即导入授权');
                            form.find('.js_sq_mask').remove();
                        },
                        complete: function () {
                            me.removeClass('process');
                            me.html('立即导入授权');
                            form.find('.js_sq_mask').remove();
                        }
                    })
                    form.find('.js_sq_mask').remove();
                }
            })

            view.on('click', '.js_sq_box .js_go_pruduct', function () {
                view.find('.js_sq_box').modal('hide');
                window.location.hash = 'home/product';
            })

            view.on('change', '.js_sq_box .step_file input', function () {
                var val = $(this).val();
                $(this).closest('.step_form').find('.js_seriseFile').val(val);
            })
        }
    };
    return {
        init: op.init,
        correctNavTab: op.correctNavTab
    }
})