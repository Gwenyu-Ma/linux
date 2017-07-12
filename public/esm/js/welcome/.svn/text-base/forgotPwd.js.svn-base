$(function() {

    $('#username').on('blur', function() {
        $('.verify-faild').remove();
        if (this.value == '') {
            assist.showMsg($(this), '请输入要找回的账号 !');
        } else if (!assist.verify.email(this.value)) {
            assist.showMsg($(this), '邮箱格式错误 !');
        }
    });

    $('#btnGo').on('click', function(e) {
        e.preventDefault();
        var url = this.href;
        if (assist.verify.email($('#username').val())) {
            var btn = $(this).button('loading');
            $.ajax({
                url: '/index.php/Forgotpwd/verifyAccount',
                type: "POST",
                dataType: "json",
                async: true,
                data: {
                    name: $('#username').val()
                },
                success: function(data) {
                    var r = data.r;
                    switch (r.code) {
                        case 0:
                            window.location.href = url + '&name=' + r.msg;
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
            alert('邮箱格式错误 !');
        }
    });
});