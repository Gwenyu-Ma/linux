$(function(){
    /*兼容placeholder*/
    $('input[type=text],input[type=password]').placeholder({isUseSpan:true});

    var sw = new Swiper('.swiper-container',{
                loop : true,
                autoplay:2000,
                pagination:'.swiper-pagination',
                paginationClickable :true,
                autoplayDisableOnInteraction:false
            });
    $('.swiper-container').hover(function(){
        sw.stopAutoplay();
    },function(){
        sw.startAutoplay();
    });

       

    /*密码强度*/
    var pwdStrong = {
        minLen:8,
        level:['low','middle','high'],
        chars:['低','中','高'],
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
        setHtml:function(val){
            $pwd=$('.pwdStrong');
            if(val.length==0){
                $pwd.addClass('hidden');
                return false;
            }
            var idx = pwdStrong.getLevel(val);
            $pwd.removeClass('hidden low high middle').addClass(pwdStrong.level[idx]).find('i').text(pwdStrong.chars[idx]);

        }
    };
    $('#txtPwd').on('keyup',function(){
        pwdStrong.setHtml($(this).val());
    });

    var formValidate = $('form').validate({
        rules: {            
            txtPwd: {
                required: true,
                minlength:8,
                passwordStr:true,
                nospace:true
            },
            txtRPwd: {
                required: true,
                equalTo:'#txtPwd',
                minlength:8
            }
        },
        messages: {
            txtPwd: {
                required: "请输入密码",
                minlength: "密码长度不小于8位",
                passwordStr: "密码强度过低,由字母(区分大小写),数字,符号组成",
                nospace:"密码不能有空格"
            },
            txtRPwd: {
                required: "请输入密码",
                equalTo: "两次输入的密码不同",
                minlength: "密码长度不小于8位"
            }
        },
        errorPlacement: function(error, ele) {
            error.appendTo(ele.parent());
        }
    });

    /*提交*/
    $(document).on('keyup',function(e){
        var e = window.event || e;
        var keycode = e.keyCode||e.which||e.charCode;
        if(keycode==13){
            $('.js_submit').trigger('click');
        }
    });
    $('.js_submit').on('click', function() {
        if (!formValidate.form()) {
            return false;
        }
        var params={
            pwd1:$('[name=txtPwd]').val(),
            pwd2:$('[name=txtRPwd]').val()
        };
        $.ajax({
            url: '/index.php/forgotpwd/resetPwd',
            type: "POST",
            dataType: "json",
            data: params,
            success: resetPwdAct,
            error: function(e) {
                assist.dialog({
                    title:'提示',
                    content:'系统异常:'+e.status
                });
            }
        });
    });
    function resetPwdAct(data){
        var d = data.r;        
        switch (d.code) {
            //成功
            case 0:
                /*
                assist.dialog({
                    title:'成功',
                    content:d.msg
                });
                */
                var urls = data.data.location;
                var locations = [urls.m,urls.a];
                setTimeout(function(){
                    window.location.href = '/'+locations.join('/')+window.location.hash;
                },0);
                break;
                //失败
            case 1:
                //超时
            case 2:
            case 11:
            case 12:
            case 10:
            case 13:
                assist.dialog({
                    title:'提示',
                    content:d.msg
                });
                break;
            default:
                assist.dialog({
                    title:'提示',
                    content:d.msg
                });
                break;
        }
    }
});