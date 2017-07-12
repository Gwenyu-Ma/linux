$(function() {

    $('#btnSet').on('click', function(e) {
        e.preventDefault();
        $('.verify-faild').remove();
        if (!($('#pwd').val() && $('#rpwd').val())) {
            assist.showMsg($('#rpwd'), '请填写密码');
            return;
        }
        if ($('#pwd').val() == $('#rpwd').val()) {
            var url = this.href;
            var btn = $(this).button('loading');
            $.ajax({
                url: '/index.php/Index/configPwd',
                type: "POST",
                dataType: "json",
                async: true,
                data: {
                    str: $('#str').val(),
                    pwd: $('#pwd').val()
                },
                success: function(data) {
                    var r = data.r;
                    switch (r.code) {
                        case 0:
                            window.location.href = url;
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
            assist.showMsg($('#rpwd'), '两次输入的密码不一致');
        }
    });
});