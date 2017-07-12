$(function() {
    /*兼容placeholder*/
    $('input[type=text],input[type=password]').placeholder({ isUseSpan: true });
    $('input[type=radio],input[type=checkbox]').iCheck({
        checkboxClass: 'icheckbox_polaris',
        radioClass: 'iradio_polaris',
        increaseArea: '-10%' // optional
    });
    $('input[type=text]:visible:first').focus();
    var sw1 = new Swiper('.js_slide_scroll1', {
        loop: true,
        autoplay: 2000,
        pagination: '.js_slide_scroll1 .swiper-pagination',
        paginationClickable: true,
        autoplayDisableOnInteraction: false
    });
    var sw2 = new Swiper('.js_slide_scroll2', {
        loop: true,
        autoplay: 2000,
        pagination: '.js_slide_scroll2 .swiper-pagination',
        paginationClickable: true,
        autoplayDisableOnInteraction: false
    });
    /*切换左侧轮播图*/
    $('[name=radRegType]').on('ifClicked', function() {
        var type = $(this).val();
        if (type == 1) {
            $('.js_slide_scroll1').show();
            $('.js_slide_scroll2').hide();
            sw2.stopAutoplay();
            sw1.startAutoplay();
        } else {
            $('.js_slide_scroll1').hide();
            $('.js_slide_scroll2').show();
            sw1.stopAutoplay();
            sw2.startAutoplay();
        }
    });
    /*验证码*/
    var codeSrc = $('#codeImg').attr('src');
    $('form').on('click', '#verify_btn', function() {
        $('#codeImg')[0].src = codeSrc + '?rdm=' + Math.floor(Math.random() * 10000);
        return false;
    });

    /*验证*/
    var formValidate = $('form').validate({
        rules: {
            txtUName: {
                required: true,
                phoneOremail: true
            },
            txtPwd: {
                required: true,
                minlength: 8,
                passwordStr: true,
                nospace: true
            },
            txtRPwd: {
                required: true,
                equalTo: '#txtPwd',
                minlength: 8
            },
            txtCode: {
                required: true
            },
            agree: {
                required: true
            }
        },
        messages: {
            txtUName: {
                required: "请输入账号",
                phoneOremail: "账号格式错误"
            },
            txtPwd: {
                required: "请输入密码",
                minlength: "密码长度不小于8位",
                passwordStr: "不允许低密码强度注册,由字母(区分大小写),数字,符号组成",
                nospace: "密码不能有空格"
            },
            txtRPwd: {
                required: "请输入密码",
                equalTo: "两次输入的密码不同",
                minlength: "密码长度不小于8位"
            },
            txtCode: {
                required: "请输入验证码"
            },
            agree: {
                required: "请勾选协议"
            }
        },
        errorPlacement: function(error, ele) {
            if (ele.attr('name') == 'agree') {
                ele.focus();
                ele.closest('.ichecbox').addClass('error');
            } else {
                error.appendTo(ele.parent());
            }
        },
        ignore: ':disabled',
        success: function(label) {
            var name = label.attr('for');
            if (name == 'agree') {
                $('[name=' + name + ']').closest('.ichecbox').removeClass('error');
            }
        }
    });
    /*密码强度*/
    var pwdStrong = {
        minLen: 8,
        level: ['low', 'middle', 'high'],
        chars: ['低', '中', '高'],
        fn: ['matchAZ', 'matchaz', 'matchNum', 'matchSign'],
        matchAZ: function(val) {
            return val.match(/[A-Z]+/);
        },
        matchaz: function(val) {
            return val.match(/[a-z]+/);
        },
        matchNum: function(val) {
            return val.match(/[0-9]/);
        },
        matchSign: function(val) {
            return val.match(/[~!@#$%^&*(),./?<>;:'"]+/);
        },
        getLevel: function(val) {
            var num = -2;
            var fn = pwdStrong.fn;
            for (var i = 0; i < fn.length; i++) {
                pwdStrong[fn[i]](val) && num++;
            }
            return num = (num < 0 ? 0 : num);
        },
        setHtml: function(val) {
            $pwd = $('.pwdStrong');
            if (val.length == 0) {
                $pwd.addClass('hidden');
                return false;
            }
            var idx = pwdStrong.getLevel(val);
            $pwd.removeClass('hidden low high middle').addClass(pwdStrong.level[idx]).find('i').text(pwdStrong.chars[idx]);

        }
    };

    $('#txtPwd').on('keyup', function() {
        pwdStrong.setHtml($(this).val());
    });


    /*初始化事件*/
    var hash = window.location.hash;
    if (hash && hash == '#family') {
        $('[name=radRegType]:eq(1)').iCheck('check').trigger('ifClicked');
    }

    $('#txtUName').on('blur', function() {
        var value = $(this).val();
        if (/^1\d{10}$/.test(value)) {
            $('#txtCode').attr('disabled', 'disabled').closest('.control-group').addClass('hidden');
            $('#txtCode2').removeAttr('disabled').closest('.control-group').removeClass('hidden');
            $('#txtCode').rules('remove', 'required');
            $('#txtCode2').rules('add', {
                required: true,
                messages: {
                    required: '请输入校验码'
                }
            });
            if (!$('.js_getCode').attr('getCode')) {
                $('.js_getCode').removeAttr('disabled');
            }
        } else {
            $('#txtCode').removeAttr('disabled').closest('.control-group').removeClass('hidden');
            $('#txtCode2').attr('disabled', 'disabled').closest('.control-group').addClass('hidden');
            $('#txtCode2').rules('remove', 'required');
            $('#txtCode').rules('add', {
                required: true,
                messages: {
                    required: '请输入验证码'
                }
            });
        }
    });

    /*提交*/
    $(document).on('keyup', function(e) {
        var e = window.event || e;
        var keycode = e.keyCode || e.which || e.charCode;
        if (keycode == 13) {
            if (!$('.js_submit').prop('disabled')) {
                $('.js_submit').trigger('click');
            }

        }
    });
    $('.js_submit').on('click', function() {
        if (!formValidate.form()) {
            return false;
        }

        var code = '';
        // if($('.pwdStrong').hasClass('low')){
        //     showErrLabel(formValidate,'txtPwd','密码强度太低');
        //     return false;
        // }

        if ($('.reg_box_in:last').hasClass('hidden')) {
            code = $('#txtCode').val();
        } else {
            code = $('#txtCode2').val();
        }

        var params = {
            useridname: $.trim($('#txtUName').val()),
            type: $('[name=radRegType]:checked').val(),
            userpwd: $.trim($('#txtPwd').val()),
            userrpwd: $.trim($('#txtRPwd').val()),
            code: $.trim(code)
        };
        $('.js_submit').button('loading');
        $.ajax({
            url: '/index.php/Index/reg',
            type: "POST",
            dataType: "json",
            data: params,
            success: regAct,
            error: function(data) {
                var da = data.r;
                $('.js_submit').button('reset');
                assist.dialog({
                    title: '提示',
                    content: '系统异常:' + da.msg
                });
            },
            complete: function() {
                $('.js_submit').button('reset');
            }
        });
    });

    /*重置form*/
    $('.js_reset').on('click', function() {
        formValidate.resetForm();
        $('.control-group').removeClass('error');
        $('.pwdStrong').addClass('hidden');
        $('[name=agree]').iCheck('update');        
        $('.js_getCode').val('获取校验码');
        $('.js_submit').val('立即注册').prop('disabled',true);
    });

    $('.js_getCode').on('click', function() {
        $('#txtCode2').focus();
        getCode($(this));
    });

    /*注册事件*/
    function regAct(data) {
        var d = data.r;
        switch (d.code) {
            //成功
            case 0:

                assist.dialog({
                    type: 'success',
                    title: '注册成功',
                    content: '恭喜您注册成功，正在跳转请稍等'
                });

                var urls = data.data.location;
                var locations = [urls.m, urls.a];
                var local = '';
                if (urls.email) {
                    local = '/' + locations.join('/') + '#email=' + urls.email + '&oType=' + urls.oType;
                } else {
                    local = '/' + locations.join('/') + '#username=' + $('#txtUName').val() + '&oType=' + urls.oType;
                }
                setTimeout(function() {
                    window.location.href = local;
                }, 1000);
                break;
                //失败
            case 1:
                //超时                
            case 2:
                assist.dialog({
                    title: '提示',
                    content: d.msg
                });
                $('#verify_btn').trigger('click');
                break;
            case 11:
                showErrLabel(formValidate, 'txtPwd', '密码错误');
                $('#verify_btn').trigger('click');
                break;
            case 12:
                showErrLabel(formValidate, 'txtRPwd', '密码错误');
                $('#verify_btn').trigger('click');
                break;
            case 10:
                showErrLabel(formValidate, 'txtUName', d.msg);
                $('#verify_btn').trigger('click');
                break;
            case 13:
                if ($('.reg_box_in:last').hasClass('hidden')) {
                    showErrLabel(formValidate, 'txtCode', d.msg);
                } else {
                    showErrLabel(formValidate, 'txtCode2', d.msg);
                }
                $('#verify_btn').trigger('click');
                break;
            case 14:
                assist.dialog({
                    title: '提示',
                    content: d.msg
                });
                $('#verify_btn').trigger('click');
                break;
            case 3:
                $('#txtCode').parents('.control-group').removeClass('hidden');
                break;
            default:
                assist.dialog({
                    title: '提示',
                    content: d.msg
                });
                $('#verify_btn').trigger('click');
                break;
        }
    }

    function getCode(obj) {
        if (obj.hasClass('disabled')) {
            return false;
        }
        obj.val('重新获取校验码');
        $('#txtCode2').focus().val('');
        var phoneNum = $('#txtUName').val();
        if (phoneNum == "") {
            showErrLabel(formValidate, 'txtUName', '手机号不能为空');
            return false;
        }
        if (!(/^1\d{10}$/.test(phoneNum))) {
            showErrLabel(formValidate, 'txtUName', '手机号格式不对');
            return false;
        }
        obj.addClass('disabled').attr('getCode', true);
        $.ajax({
            url: '/index.php/Index/getphonebyuser',
            type: 'POST', //"POST",
            dataType: "json",
            data: { 'phoneNum': phoneNum },
            success: function(data) {
                var d = data.r;
                switch (d.code) {
                    case 0: //成功
                        showCodeStu();
                        break;
                    case 1: //用户名重复
                        showErrLabel(formValidate, 'txtUName', d.msg);
                        $('.js_getCode').removeClass('disabled').removeAttr('getCode');
                        break;
                    case 2: //超时
                    case 3: //失败
                    default:
                        assist.dialog({
                            title: '提示',
                            content: d.msg
                        });
                        hideCodeStu();
                        $('.js_getCode').removeClass('disabled').removeAttr('getCode');
                        break;
                }
            },
            error: function(e) {
                assist.dialog({
                    title: '提示',
                    content: '系统异常:' + e.status
                });
                $('.js_getCode').removeClass('disabled').removeAttr('getCode');
            }
        });
    }

    function showCodeStu() {
        $('#txtCode').removeAttr('disabled');
        $('#phoneCodeMsg').removeClass('hidden');
        $('.js_warn').removeClass('hidden');
        countDown();

    }

    function hideCodeStu() {
        $('#txtCode').attr('disabled', 'disabled');
        $('#phoneCodeMsg').addClass('hidden').find('i').text('60');
        $('.js_warn').addClass('hidden');
        $('.js_getCode').removeClass('disabled').removeAttr('getCode');
    }

    function countDown() {
        var MaxTime = 60;
        var tick = setInterval(function() {
            if (MaxTime == 0) {
                clearInterval(tick);
                hideCodeStu();
                return false;
            }
            $('#phoneCodeMsg i').text(MaxTime--);
        }, 1000);
    }

    /*agree事件*/
    // $('[name=agree]').on('ifChecked',function(){
    //     $(this).closest('.ichecbox').removeClass('error');
    //     $('.js_submit').prop('disabled',false);
    // })

    // $('[name=agree]').on('ifUnchecked',function(){
    //     $('.js_submit').prop('disabled',true);
    // })


    $('[name=agree]').on('ifChanged', function() {
        checkBtn();
    });

    $('#txtUName,#txtPwd,#txtRPwd,#txtCode,#txtCode2').on('keyup', function() {
        checkBtn();
        $(this).focus();
    });


    function checkValid() {
        if (/^1\d{10}$/.test($('#txtUName').val())) {
            return $('#txtUName').val() &&
                $('#txtUName').valid() &&
                $('#txtPwd').val() &&
                $('#txtPwd').valid() &&
                $('#txtRPwd').val() &&
                $('#txtRPwd').valid() &&
                $('#txtCode2').val() &&
                $('#txtCode2').valid() &&
                $('[name=agree]').prop('checked');
        } else {
            return $('#txtUName').val() &&
                $('#txtUName').valid() &&
                $('#txtPwd').val() &&
                $('#txtPwd').valid() &&
                $('#txtRPwd').val() &&
                $('#txtRPwd').valid() &&
                $('#txtCode').val() &&
                $('#txtCode').valid() &&
                $('[name=agree]').prop('checked');
        }
    }

    function checkBtn() {
        if (checkValid()) {
            $('.js_submit').prop('disabled', false);
        } else {
            $('.js_submit').prop('disabled', true);
        }
    }


});