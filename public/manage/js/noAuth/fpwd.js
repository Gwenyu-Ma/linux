$(function () {
    /*验证添加*/
    $.validator.addMethod("passwordStr", function (value, element) {
        var num = 0;

        function matchAZ(val) {
            return val.match(/[A-Z]+/);
        }

        function matchaz(val) {
            return val.match(/[a-z]+/);
        }

        function matchnum(val) {
            return val.match(/[0-9]+/);
        }

        function matchSign(val) {
            return val.match(/[~!@#$%^&*(),./?<>;:'"]+/);
        }
        matchAZ(value) && num++;
        matchaz(value) && num++;
        matchnum(value) && num++;
        matchSign(value) && num++;
        return this.optional(element) || num > 2;
    })
    $.validator.addMethod('nospace', function (value, element) {
        return this.optional(element) || /^[^\s]*$/.test(value);
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

                
                
                view.on('click', '.js_step01', function () {
                    var me = $(this);
                    var flag = view.find('form').valid();
                    var form = view.find('form');
                    if (true && !me.hasClass('process')) {
                        me.addClass('process');
                        me.html('<i class="mr5"></i>正在验证，请稍等');
                        view.find('form').ajaxSubmit({
                            url: '/index.php/Auth/checkAuth',
                            success: function (json) {
                                json = JSON.parse(json);
                                if (json && json.r) {
                                    var r = json.r;
                                    switch (r.code) {
                                        case 0:
                                            me.removeClass('process');
                                            me.html('验证授权');
                                            form.find('.js_sq_mask').remove();
                                            page.action.destroy()
                                            page.action.page2();
                                            break;
                                        case 3:
                                        	 me.removeClass('process');
                                             me.html('验证授权');
                                             form.find('.js_sq_mask').remove();    
                                             showErrLabel($('form').validate(), 'seriseFile', r.msg);
                                        default:
                                            me.removeClass('process');
                                            me.html('验证授权');
                                            form.find('.js_sq_mask').remove();                                            
                                            /*assist.dialog({
                                                title: '提示',
                                                content: r.msg
                                            });*/
                                            break;
                                    }
                                } else {
                                    alert('ajax error:', json);
                                }
                            },
                            error: function () {
                                me.removeClass('process');
                                me.html('验证授权');
                                form.find('.js_sq_mask').remove();
                            }
                        })
                        form.find('.step_file').append('<div class="js_sq_mask" style="position:absolute;width:100%;height:100%;left:0;top:0;z-index:5"></div>');
                    }
                })

                view.on('change', '.step_file input', function () {
                    var val = $(this).val();
                    $(this).closest('.step_form').find('.js_seriseFile').val(val);
                })

            },
            page2: function () {
                var view = $('.step_box:eq(1)');
                page.currentPage = view;
                page.method.show(1);

                view.find('form').validate({
                    rules: {
                        txtCode: 'required',
                        txtPwd: {
                            required: true,
                            minlength: 6,
                            passwordStr: true,
                            nospace: true
                        },
                        rtxtPwd: {
                            required: true,
                            minlength: 6,
                            equalTo: '#txtPwd'
                        }
                    },
                    messages: {
                        txtCode: '请输入验证码',
                        txtPwd: {
                            required: '请输入密码',
                            minlength: "密码长度不小于6位",
                            passwordStr: "不允许低密码强度注册,由字母(区分大小写),数字,符号组成",
                            nospace: "密码不能有空格"
                        },
                        rtxtPwd: {
                            required: '请输入密码',
                            minlength: "密码长度不小于8位",
                            equalTo: '两次输入的密码不一致'
                        }
                    },
                    errorElement: 'span',
                    errorPlacement: function (error, element) {
                        var errLabel = element.closest('.controls');
                        errLabel.append(error);
                    }
                })

                /*密码强度*/
                var pwdStrong = {
                    minLen: 6,
                    level: ['low', 'middle', 'high'],
                    chars: ['低', '中', '高'],
                    fn: ['matchAZ', 'matchaz', 'matchNum', 'matchSign'],
                    matchAZ: function (val) {
                        return val.match(/[A-Z]+/);
                    },
                    matchaz: function (val) {
                        return val.match(/[a-z]+/);
                    },
                    matchNum: function (val) {
                        return val.match(/[0-9]/);
                    },
                    matchSign: function (val) {
                        return val.match(/[~!@#$%^&*(),./?<>;:'"]+/);
                    },
                    getLevel: function (val) {
                        var num = -2;
                        var fn = pwdStrong.fn;
                        for (var i = 0; i < fn.length; i++) {
                            pwdStrong[fn[i]](val) && num++;
                        }
                        return num = (num < 0 ? 0 : num);
                    },
                    setHtml: function (val) {
                        $pwd = $('.pwdStrong');
                        if (val.length == 0) {
                            $pwd.addClass('hidden');
                            return false;
                        }
                        var idx = pwdStrong.getLevel(val);
                        $pwd.removeClass('hidden low high middle').addClass(pwdStrong.level[idx]).find('i').text(pwdStrong.chars[idx]);

                    }
                };

                $('#txtPwd').on('keyup', function () {
                    pwdStrong.setHtml($(this).val());
                });

                view.on('click', '.js_step02', function () {
                    $('#verify_btn').trigger('click');
                    var me = $(this);
                    var form = view.find('form');
                    var flag = form.valid();
                    if (flag) {
                        me.addClass('process');
                        RsCore.ajax({
                            url: 'User/modifyPwd',
                            data: {
                                pwd1: $('#txtPwd').val(),
                                pwd2: $('#rtxtPwd').val(),
                                code: $('#txtCode').val(),
                            },
                            success: function () {
                                page.action.destroy()
                                page.action.page3();
                            },
                            complete: function () {
                                me.removeClass('process');
                                page.event();
                            },
                            error: function () {
                                /* 测试用 */

                            }
                        })
                    }
                })

            },
            page3: function () {
                var view = $('.step_box:eq(2)');
                page.currentPage = view;
                page.method.show(2);
                view.on('click', '.js_step03', function () {
                    window.location.href = '/'
                })
            },
            destroy: function () {
                page.currentPage.off();
            }
        },
        event: function () {
            var codeSrc = $('#codeImg').attr('src');
            $('form').on('click', '#verify_btn', function () {
                $('#codeImg')[0].src = codeSrc + '?rdm=' + Math.floor(Math.random() * 10000);
                return false;
            });
        }
    }

    page.init();
})