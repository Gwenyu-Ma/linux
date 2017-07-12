$(function () {
    var page = {
        init: function () {
            this.action.page1();
            this.event();
        },
        currentPage: null,
        method: {
            show: function (idx) {
                $('.step_box').hide();
                $('.step_box:eq(' + idx + ')').show();
            },
            next: function () {}
        },
        action: {
            page1: function () {
                var view = $('.step_box:eq(0)');
                page.currentPage = view;
                page.method.show(0);
                view.find('form').validate({
                    rules: {
                        seriesNum: 'required',
                        seriseFile: 'required'
                    },
                    messages: {
                        seriesNum: '序列号不能为空',
                        seriseFile: '请上传授权文件'
                    },
                    errorElement: 'span',
                    errorPlacement: function (error, element) {
                        var errLabel = element.closest('.step_form');
                        errLabel.append(error);
                    }
                })

                view.on('click', '.js_step01', function () {
                    var me = $(this);
                    var flag = view.find('form').valid();
                    if (true) {
                        me.addClass('process');
                        me.html('<i class="mr5"></i>正在授权，请稍等');
                        RsCore.ajax({
                            url: '',
                            data: view.find('form').serialize(),
                            success: function () {
                                page.action.destroy()
                                page.action.page2();
                            },
                            complete: function () {
                                me.removeClass('process');
                                me.html('立即授权');
                            },
                            error: function () {
                                /* 测试用 */
                                page.action.destroy()
                                page.action.page2();
                            }
                        })
                    }
                })

                view.on('change', '.step_file input', function () {
                    var val = $(this).val();
                    $(this).closest('.step_form').find('input[name=seriseFile]').val(val);
                })

            },
            page2: function () {
                var view = $('.step_box:eq(1)');
                page.currentPage = view;
                page.method.show(1);
                view.on('click', '.js_step02', function () {
                    page.action.destroy()
                    page.action.page3();
                })
            },
            page3: function () {
                var view = $('.step_box:eq(2)');
                page.currentPage = view;
                page.method.show(2);

                view.find('form').validate({
                    rules: {
                        username: 'required',
                        pwd: {
                            required: true
                        },
                        rpwd: {
                            required: true,
                            equalTo: '#pwd'
                        }
                    },
                    messages: {
                        username: '请输入账号',
                        pwd: {
                            required: '请输入密码',
                        },
                        rpwd: {
                            required: '请输入密码',
                            equalTo: '两次输入的密码不一致'
                        }
                    },
                    errorElement: 'span',
                    errorPlacement: function (error, element) {
                        var errLabel = element.closest('.step_form');
                        errLabel.append(error);
                    }
                })

                view.on('click', '.js_step03', function () {
                    var me = $(this);
                    var flag = view.find('form').valid();
                    if (true) {
                        me.addClass('process');
                        RsCore.ajax({
                            url: '',
                            data: view.find('form').serialize(),
                            success: function () {
                                page.action.destroy()
                                page.action.page4();
                            },
                            complete: function () {
                                me.removeClass('process');
                            },
                            error: function () {
                                /* 测试用 */
                                page.action.destroy()
                                page.action.page4();
                            }
                        })
                    }
                })

            },
            page4: function () {
                page.method.show(3);
            },
            destroy: function () {
                page.currentPage.off();
            }
        },
        event: function () {

        }
    }

    page.init();
})