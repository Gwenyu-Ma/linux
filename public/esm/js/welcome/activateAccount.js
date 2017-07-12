$(function() {
    var imgUrl = $('#imgCode').attr('src');
    $('#imgCode').on('click', function() {
        this.src = imgUrl + '?rnd=' + Math.random();
    });

    $(':radio[name=radRegType]').on('change', function() {
        var domName = $('#txtCompanyName').parent().parent().find('>label');
        if ($(this).val() == 1) {
            domName.text('企业名称');
        } else {
            domName.text('昵称');
        }
    });

    $('#btnActivate').on('click', function() {
        $.ajax({
            url: '/index.php/Index/regOther',
            type: "POST",
            dataType: "json",
            async: true,
            data: {
                str: $('#str').val(),
                type: $(':radio[name=radRegType]:checked').val(),
                companyName: $('#txtCompanyName').val(),
                code: $('#txtCode').val()
            },
            success: function(data) {
                var r = data.r;
                switch (r.code) {
                    case 0:
                        window.location.href = '../../public/pages/activateSuccess.html';
                        break;
                    default:
                        alert(r.msg);
                        break;
                }
            },
            error: function(req) {
                alert('系统异常:' + req.status);
            }
        });
    });
});