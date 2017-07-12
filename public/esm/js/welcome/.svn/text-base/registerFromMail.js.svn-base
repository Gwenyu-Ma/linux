$(function() {


    var str = $('#str').val();
    if (str) {
        $('#btnResendEmail').on('click', function(e) {
            e.preventDefault();
            if ($(this).hasClass('disabled')) {
                return;
            }
            var btn = $(this).button('loading');
            $.ajax({
                url: '/index.php/Index/reSendMail',
                type: "POST",
                dataType: "json",
                async: true,
                data: {
                    str: str,
                    type: 1
                },
                success: function(data) {
                    alert(data.r.msg);
                    btn.button('reset');
                },
                error: function(req) {
                    alert('系统异常:' + req.status);
                    btn.button('reset');
                }
            });
        });
    } else {
        alert('参数错误');
    }

    $('#btnSubmit').on('click', function(e) {
        e.preventDefault();
        //var url = this.href;
        $('.verify-faild').remove();
        if ($('#scode').val()) {
            var btn = $(this).button('loading');
            $.ajax({
                url: '/index.php/Index/configCode',
                type: "POST",
                dataType: "json",
                async: true,
                data: {
                    str: $('#str').val(),
                    type: 1,
                    code: $('#scode').val()
                },
                success: function(data) {
                    var r = data.r;
                    switch (r.code) {
                        case 0:
                            window.location.href = r.msg;
                            break;
                        default:
                            alert(r.msg);
                            break;
                    }
                    btn.button('reset');
                },
                error: function(req) {
                    alert('系统异常:' + req.status);
                    btn.button('reset');
                }
            });
        } else {
            assist.showMsg($('#scode'), '请输入邮件中的验证码');
        }

    });
});