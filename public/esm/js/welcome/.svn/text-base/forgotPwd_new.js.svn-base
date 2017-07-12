$(function () {
    /*兼容placeholder*/
    $('input[type=text],input[type=password]').placeholder({ isUseSpan: true });
    $('input[type=text]:visible:first').focus();
    var sw = new Swiper('.swiper-container', {
        loop: true,
        autoplay: 2000,
        pagination: '.swiper-pagination',
        paginationClickable: true,
        autoplayDisableOnInteraction: false
    });
    $('.swiper-container').hover(function () {
        sw.stopAutoplay();
    }, function () {
        sw.startAutoplay();
    });

    var pwd = {
        phone: {
            obj: null,
            valid: function (obj) {
                $.ajax({
                    url: '/index.php/Forgotpwd/validPhone',
                    type: 'POST', //"POST",
                    dataType: "json",
                    data: {
                        'phone': obj.val()
                    },
                    success: function (data) {
                        var d = data.r;
                        switch (d.code) {
                            case 0: //成功
                                var nameObj = $('[name=txtName]');
                                // if(!nameObj.parent().find('.checkR').length){
                                //     nameObj.after($('<span class="checkR" style="margin-left:-25px;">&nbsp;</span>'));
                                // }
                                if (!$('.js_getCode').attr('getCode')) {
                                    $('.js_getCode').removeClass('disabled');
                                }
                                pwd.phone.getCode($('.js_getCode'));
                                break;
                            case 1: //手机号为空
                            case 2: //手机号格式错误
                            case 3: //尚未注册
                            case 4: //未激活
                                showErrLabel(formValidate, 'txtName', d.msg);
                                $('.checkR').remove();
                                $('.js_getCode').addClass('disabled');
                                break;
                            default:
                                assist.dialog({
                                    title: '提示',
                                    content: d.msg
                                });
                                $('.checkR').remove();
                                $('.js_getCode').addClass('disabled');
                                break;
                        }
                    },
                    error: function (e) {
                        assist.dialog({
                            title: '提示',
                            content: '系统异常:' + e.status
                        });
                        pwd.phone.obj.removeClass('disabled');
                        $('.checkR').remove();
                        $('.js_getCode').addClass('hidden');
                    }
                });
            },
            getCode: function (obj) {
                if (obj.hasClass('disabled')) {
                    return false;
                }
                obj.val('重新获取校验码');
                obj.addClass('disabled').attr('getCode', 'true');
                pwd.phone.obj = obj;
                $.ajax({
                    url: '/index.php/Forgotpwd/getPhoneCode',
                    type: 'POST', //"POST",
                    dataType: "json",
                    success: function (data) {
                        var d = data.r;
                        switch (d.code) {
                            case 0: //成功                                        
                                pwd.phone.showCodeStu();
                                break;
                            case 2: //超时
                            case 3: //失败
                            default:
                                assist.dialog({
                                    title: '提示',
                                    content: d.msg
                                });
                                pwd.phone.hideCodeStu();
                                pwd.phone.obj.removeClass('disabled').removeAttr('getCode');
                                break;
                        }
                    },
                    error: function (e) {
                        assist.dialog({
                            title: '提示',
                            content: '系统异常:' + e.status
                        });
                        pwd.phone.obj.removeClass('disabled');
                    }
                });
            },
            showCodeStu: function () {
                $('#txtCode').removeAttr('disabled');
                $('#phoneCodeMsg').removeClass('hidden');
                $('.js_warn').removeClass('hidden');
                $('#txtCode').val('').focus();
                pwd.phone.countDown();

            },
            hideCodeStu: function () {
                $('#txtCode').attr('disabled', 'disabled');
                $('#phoneCodeMsg').addClass('hidden');
                $('.js_warn').addClass('hidden');
                pwd.phone.obj.removeClass('disabled');
            },
            countDown: function () {
                var MaxTime = 60;
                var tick = setInterval(function () {
                    if (MaxTime == 0) {
                        clearInterval(tick);
                        pwd.phone.hideCodeStu();
                        $('#phoneCodeMsg i').text('60');
                        return false;
                    }
                    $('#phoneCodeMsg i').text(MaxTime--);
                }, 1000);
            }
        },
        email: {
            valid: function (obj) {
                $.ajax({
                    url: '/index.php/Forgotpwd/validEmail',
                    type: 'POST', //"POST",
                    dataType: "json",
                    data: {
                        'email': obj.val()
                    },
                    success: function (data) {
                        var d = data.r;
                        switch (d.code) {
                            case 0: //成功
                                var nameObj = $('[name=txtName]');
                                if (!nameObj.parent().find('.checkR').length) {
                                    nameObj.after($('<span class="checkR" style="margin-left:-25px;">&nbsp;</span>'));
                                }
                                break;
                            case 1: //手机号为空
                            case 2: //手机号格式错误
                            case 3: //尚未注册
                            case 4: //未激活
                                showErrLabel(formValidate, 'txtName', d.msg);
                                $('.checkR').remove();
                                break;
                            default:
                                assist.dialog({
                                    title: '提示',
                                    content: d.msg
                                });
                                $('.checkR').remove();
                                break;
                        }
                    },
                    error: function (e) {
                        assist.dialog({
                            title: '提示',
                            content: '系统异常:' + e.status
                        });
                        pwd.phone.obj.removeClass('disabled');
                        $('.checkR').remove();
                        $('.js_getCode').addClass('hidden');
                    }
                });
            }
        }
    };
    /*验证*/
    var formValidate;
    var fgtType = null;
    if ($('#fgt_phone').length) {
        fgtType = 'phone';
    } else if ($('#fgt_email').length) {
        fgtType = 'email';
    }
    if (fgtType == 'phone') {
        formValidate = $('form').validate({
            rules: {
                txtName: {
                    required: true,
                    phone: true
                },
                txtCode: {
                    required: true
                }
            },
            messages: {
                txtName: {
                    required: "请输入手机号",
                    phone: "手机号格式错误"
                },
                txtCode: {
                    required: "请输入校验码"
                }
            },
            errorPlacement: function (error, ele) {
                error.appendTo(ele.parent());
            },
            ignore: ':hidden'
        });
        $('#txtName').on('keyup', function () {
            var that = $(this);
            if (that.val().length >= 11) {
                if (/^1\d{10}$/.test(that.val())) {
                    if (!$('.js_getCode').attr('getCode')) {
                        $('.js_getCode').removeClass('disabled');
                    }
                    //pwd.phone.valid(that)
                } else {
                    $('.checkR').remove();
                    $('.js_getCode').addClass('disabled');
                }
            }
        }).on('blur', function () {
            var that = $(this);
            if (/^1\d{10}$/.test(that.val())) {
                if (!$('.js_getCode').attr('getCode')) {
                    $('.js_getCode').removeClass('disabled');
                }
                //pwd.phone.valid(that)
            } else {
                $('.checkR').remove();
                $('.js_getCode').addClass('disabled');
            }
        });
        //手机校验码
        $('.js_getCode').on('click', function () {
            pwd.phone.valid($('#txtName'));
        });
    } else if (fgtType = 'email') {
        formValidate = $('form').validate({
            rules: {
                txtName: {
                    required: true,
                    email: true
                },
                txtCode: {
                    required: true
                }
            },
            messages: {
                txtName: {
                    required: "请输入邮箱",
                    email: "邮箱格式错误"
                },
                txtCode: {
                    required: "请输入验证码"
                }
            },
            errorPlacement: function (error, ele) {
                error.appendTo(ele.parent());
            }
        });
        $('#txtName').on('blur', function () {
            var that = $(this);
            if (/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(that.val())) {
                pwd.email.valid(that);
            } else {
                $('.checkR').remove();
            }
        });

        /*验证码*/
        var codeSrc = $('#codeImg').attr('src');
        $('form').on('click', '#verify_btn', function () {
            $('#codeImg')[0].src = codeSrc + '?rdm=' + Math.floor(Math.random() * 10000);
            return false;
        });
    }







    /*提交*/
    $(document).on('keyup', function (e) {
        var e = window.event || e;
        var keycode = e.keyCode || e.which || e.charCode;
        if (keycode == 13) {
            $('.js_submit').trigger('click');
        }
    });
    $('.js_submit').on('click', function () {
        if ($(this).hasClass('disabled')) {
            return false;
        }
        if (!formValidate.form()) {
            return false;
        }
        var params = {
            checkCode: $('#txtCode').val()
        };
        var url;
        if (fgtType == "phone") {
            url = '/index.php/Forgotpwd/resetPwdByPhone';
        } else if (fgtType == "email") {
            url = '/index.php/Forgotpwd/retrievePwdByEmail';
            params.email = $('#txtName').val();
        }
        var obj = $(this);
        $.ajax({
            url: url,
            type: 'POST', //"POST",
            dataType: "json",
            data: params,
            beforeSend: function () {
                obj.addClass('disabled');
            },
            success: rPwdAct,
            error: function (e) {
                assist.dialog({
                    title: '提示',
                    content: '系统异常:' + e.status
                });
            },
            complete: function () {
                obj.removeClass('disabled');
            }
        });
    });



    /*忘记密码事件*/
    function rPwdAct(data) {
        var d = data.r;
        if (fgtType == 'phone') {
            switch (d.code) {
                case 0: //成功

                    // assist.dialog({
                    //     title: '提示',
                    //     content: d.msg
                    // });

                    var urls = data.data.location;
                    var locations = [urls.m, urls.a];
                    setTimeout(function () {
                        window.location.href = '/' + locations.join('/') + '#username=' + urls.userName + '&oType=' + urls.oType;
                    }, 1000);
                    break;

                case 2: //请输入验证码
                case 3: //验证码错误
                case 4: //验证码过期
                    showErrLabel(formValidate, 'txtCode', d.msg);
                    break;
                case 1: //超时
                default:
                    assist.dialog({
                        title: '提示',
                        content: d.msg
                    });
                    break;
            }
        } else if (fgtType == 'email') {
            switch (d.code) {
                case 0:
                    assist.dialog({
                        title: '提示',
                        content: '重置邮件已发送成功！正跳转到登录页'
                    });
                    $('.js_warn').removeClass('hidden');
                    setTimeout(function () {
                        window.location.href = '/';
                    }, 1000);
                    break;
                case 1: //为空
                case 2: //格式错误
                case 3: //验证码错误
                    showErrLabel(formValidate, 'txtCode', d.msg);
                    break;
                case 4: //未激活
                    showErrLabel(formValidate, 'txtName', d.msg);
                    break;
                default:
                    assist.dialog({
                        title: '提示',
                        content: d.msg
                    });
                    break;
            }
        }

    }
});
