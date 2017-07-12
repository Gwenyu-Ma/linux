$(function(){
    $('#btnReg').bind('click', function(){

        var useridname = $('#txtUName').val();
        var usertype = $(":radio").val();
        var username  = $("#txtCompanyName").val();
        var userpwd  = '111111';
        var userRpwd  = '111111';
        var captcha  = $("#txtCode").val();

        $('#remind').css('display','none');
        var login_data = {};
        login_data.useridname = useridname;
        login_data.type = usertype;
        login_data.code = captcha;
        login_data.userpwd = userpwd;
        login_data.userRpwd = userRpwd;


        $.ajax({
            type: 'post',
            url:  "/index.php/Index/Reg",
            data: login_data,
            dataType: "json",
//            success: function(responce)
//            {
//                if(responce)
//                {
//                    location.href="/index.php/Index/Login";
//                }
//                else
//                {
//
//                }
//            }
        });
       // $.post("test.php", $("#testform").serialize());
//        var login_data = {};
//        login_data.username = username;
//        login_data.userpwd = userpwd;
//        login_data.usertype = usertype;
//        login_data.captcha = captcha;
//        $.post("/index.php/Index/Reg",
//
//            $("#testform").serialize()
//            {
//                username: username,
//                userpwd: userpwd,
//                usertype: usertype,
//                captcha: captcha
//            },
//
//            function(data){
//           // console.log(data);
//             alert("Data Loaded: " + data);
//             }

//        )

    });




});

//
//$(function(){
//  var path = '';
//  var verify = false;
//  var assist = {
//    verify: {
//      email: function(value) {
//        return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
//      },
//      phone: function(value) {
//        return /^[1][3-8]+\d{9}$/.test(value);
//      }/*,
//      pwd: function(value) {
//        if($.trim(value)){
//          return true;
//        } else {
//          return false;
//        }
//      }*/
//    },
//    showMsg: function(dom, msg) {
//      dom.after('<p class="verify-faild">&bull; '+msg+'</p>');
//    }
//  };
//  var imgUrl=$('#imgCode').attr('src');
//  $('#imgCode').on('click', function() {
//    this.src = imgUrl + '?rnd=' + Math.random();
//  });
//  $('#txtUName').on('blur', function() {
//    var dom = $(this);
//    if(assist.verify.email(this.value)) {
//      $.ajax({
//        url: '/index.php/Index/checkEmail',
//        type: "POST",
//        dataType: "json",
//        async: true,
//        data: {email: this.value},
//        success: function(data) {
//          var r = data.r;
//          if(r.code == 0) {
//            verify = true;
//            dom.next('.verify-faild').remove();
//          } else {
//            verify = false;
//            dom.next('.verify-faild').remove();
//            assist.showMsg(dom, r.msg);
//          }
//        },
//        error: function(req) {
//          alert('系统异常:'+req.status);
//        }
//      });
//    } else {
//      dom.next('.verify-faild').remove();
//      assist.showMsg(dom,'请填入正确的邮箱地址 !');
//    }
//  });
//  $(':radio[name=radRegType]').on('change', function() {
//    var domName = $('#txtCompanyName').parent().parent().find('>label');
//    if($(this).val()==1) {
//      //$('.extendItem').css('display','block');
//      domName.text('企业名称');
//    } else {
//      //$('.extendItem').css('display','none');
//      domName.text('昵称');
//    }
//  });
//  $('#btnReg').on('click', function() {
//    if(!verify) { return; }
//
//    $('.verify-faild').remove();
//    var uName = $('#txtUName').val();
//    //var pwd = $('#txtPwd').val();
//    verify = assist.verify.email(uName);//||assist.verify.phone(uName);
//    verify||assist.showMsg($('#txtUName'),'请填入正确的邮箱地址 !');//请填入正确的邮箱或手机
//
//    if(!$('#chkAgree').prop('checked')) {
//      assist.showMsg($('#chkAgree').parent(), '如果您拒绝接受用户协议，将无法继续注册。');
//      verify=false;
//    }
//
//    if(verify) {
//      var btn = $(this).button('loading');
//      //setTimeout(function () { btn.button('reset'); }, 2000);
//      var postData = (function() {
//        var type = $(':radio[name=radRegType]:checked').val();
//        //var json = { name: uName, pwd: pwd, type: type, code: $('#txtCode').val() }
//        var json = { name: uName, type: type, companyName: $('#txtCompanyName').val(), code: $('#txtCode').val() }
//        /*if(type==1) {
//          json.companyName = $('#txtCompanyName').val();
//        }*/
//        return json;
//      })();
//      $.post(
//        path+"/index.php/Index/Reg",
//        postData,
//        function(data) {
//          var r = data.r;
//          switch(r.code) {
//            case 0:
//              window.location.href = '/public/pages/regSuccess.html';
//              break;
//            case 3:
//              alert('验证码错误');
//              break;
//            case 4:
//              alert('邮箱账号已存在');
//              break;
//            default:
//              $('#imgCode').attr('src', path+'/index.php/Index/verify' + '?rnd=' + Math.random());
//              $('#txtCode').val('');
//              alert(r.msg);
//              break;
//          }
//          /*if(r.code==0) {
//            //window.location.href = path+'index.php?m=home&c=Manage&a=index';
//            window.location.href = '../Public/pages/success.html';
//          } else {
//            $('#imgCode').attr('src', path+'index.php?m=home&c=Index&a=verify' + '&rnd=' + Math.random());
//            $('#txtCode').val('');
//            alert(r.msg);
//          }*/
//          btn.button('reset');
//        },
//        "json"
//      );
//    }
//  });
//});