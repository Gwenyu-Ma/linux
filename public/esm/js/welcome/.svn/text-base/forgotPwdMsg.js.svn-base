$(function() {

    var name = assist.getQueryString('name');
    if (name) {
        $('#btnResendEmail').on('click', function(e) {
            e.preventDefault();
            if ($(this).hasClass('disabled')) {
                return;
            }
            var btn = $(this).button('loading');
            $.ajax({
                url: '/index.php/Forgotpwd/againVerifyAccount',
                type: "POST",
                dataType: "json",
                async: true,
                data: {
                    name: name
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
            //alert('邮件已重新发送，请注意查收。');
        });
    } else {
        alert('参数错误');
    }
});