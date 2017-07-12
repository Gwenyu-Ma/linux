$(function () {
    /*兼容placeholder*/
    $('input[type=text],input[type=password]').placeholder({
        isUseSpan: true
    });

    var param = window.location.hash.slice(1).split('&');
    var hashObj = {};
    for (var i = 0; i < param.length; i++) {
        var _pa = param[i].split('=');
        hashObj[_pa[0]] = _pa[1];
    }
    if (hashObj['username']) {
        $('#txtName').focus().val(hashObj['username']);
        $('#txtPwd').focus();
    } else {
        $('#txtName').focus();
    }


    /*验证码*/
    var codeSrc = $('#codeImg').attr('src');
    $('form').on('click', '#verify_btn', function () {
        $('#codeImg')[0].src = codeSrc + '?rdm=' + Math.floor(Math.random() * 10000);
        return false;
    });


    /*验证*/
    var formValidate = $('form').validate({
        rules: {
            txtName: {
                required: true
            },
            txtPwd: {
                required: true
            },
            txtCode: {
                required: true
            }
        },
        messages: {
            txtName: {
                required: "请输入账号"
            },
            txtPwd: {
                required: "请输入密码"
            },
            txtCode: {
                required: "请输入验证码"
            }
        },
        errorPlacement: function (error, ele) {
            error.appendTo(ele.parent());
        }
    });

    /*提交*/
    $(document).on('keyup', function (e) {
        var e = window.event || e;
        var keycode = e.keyCode || e.which || e.charCode;
        if (keycode == 13) {
            $('.js_submit').trigger('click');
        }
    });
    $('.js_submit').on('click', function () {
        var that = $(this);
        if (that.hasClass('disabled')) {
            return false;
        }
        if (!formValidate.form()) {
            return false;
        }
        var params = {
            name: $.trim($('#txtName').val()),
            pwd: $.trim($('#txtPwd').val()),
            code: $.trim($('#txtCode').val())
        };
        $.ajax({
            url: '/index.php/Index/login',
            type: "POST",
            dataType: "json",
            data: params,
            beforeSend: function () {
                that.addClass('disabled');
                $('.js_submit').button('loading');
            },
            success: loginAct,
            error: function (data) {
                //                console.log(e);
                var da = data.r;
                $('.js_submit').button('reset');
                assist.dialog({
                    title: '提示',
                    content: '系统异常:' + da.msg
                });
            },
            complete: function () {
                that.removeClass('disabled');

            }
        });
    });

    /*登录事件*/
    function loginAct(data) {
        var d = data.r;
        switch (d.code) {
            case 0: //成功   
                $('.log_box form')[0].reset();
                window.location.href = data.data;
                break;
            case 2: //验证码
                $('.js_submit').button('reset');
                showErrLabel(formValidate, 'txtCode', '验证码错误');
                $('#verify_btn').trigger('click');
                break;
            case 3: //用户名密码错误
            case 4:
                $('.js_submit').button('reset');
                showErrLabel(formValidate, 'txtName', '');
                showErrLabel(formValidate, 'txtPwd', '用户名密码错误');
                $('#verify_btn').trigger('click');
                break;
            default:
                $('.js_submit').button('reset');
                assist.dialog({
                    title: '提示',
                    content: d.msg
                });
                $('#verify_btn').trigger('click');
                break;
        }
    }
});