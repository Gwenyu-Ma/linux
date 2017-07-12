$(function(){

    $('#btnLogin').bind('click', function(){



        var useridname = $('#txtUName').val();
        var userpwd  = $('#txtPwd').val();
      //  var captcha  = $("#txtCode").val();

        $('#remind').css('display','none');
        var login_data = {};
        login_data.useridname = useridname;
        login_data.userpwd = userpwd;
        login_data.code = '';

        $.ajax({

            type: 'post',
            url:  "/index.php/Index/postlogin",
            data: login_data,
            dataType: "json"

        });


    });

});
//$(function(){
//  $('#txtUName,#txtPwd').placeholder();
//  var path = '';
//  var showVerification = false;
//  var imgUrl = path + '/index.php/Index/verify';
//  /*$.post(path+"index.php?m=home&c=Index&a=ShowVerify", function(r) {
//    if(r=="1") {
//      showVerification = true;
//      $('#txtPwd').after('<img id="imgCode" src="'+imgUrl+'" alt="验证码">验证码<input id="txtCode" type="text">');
//    } else {
//      showVerification = false;
//    }
//  });*/
//  var assist = {
//    verify: {
//      email: function(value) {
//        return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
//      },
//      phone: function(value) {
//        return /^[1][3-8]+\d{9}$/.test(value);
//      },
//      pwd: function(value) {
//        if($.trim(value)){
//          return true;
//        } else {
//          return false;
//        }
//      }
//    },
//    showMsg: function(dom, msg) {
//      dom.after('<p class="verify-faild">&bull; '+msg+'</p>');
//    }
//  };
//  /*$('form').on('click', '#imgCode', function() {
//    this.src = imgUrl + '&rnd=' + Math.random();
//  });*/
//  $('#btnLogin').on('click', function() {
//    var r = false;
//    $('.verify-faild').remove();
//    var uName = $('#txtUName').val();
//    var pwd = $('#txtPwd').val();
//    r = assist.verify.email(uName)||assist.verify.phone(uName);
//    r||assist.showMsg($('#txtUName'),'请填入正确的邮箱或手机 !');
//    if(!assist.verify.pwd(pwd)) {
//      assist.showMsg($('#txtPwd'), '请输入密码 !');
//      r = false;
//    }
//    //if(r&&showVerification!=undefined) {
//    if(r) {
//      var btn = $(this).button('loading');
//      //setTimeout(function () { btn.button('reset'); }, 2000);
//      var params = { name: uName, pwd: pwd };
//      showVerification&&(params.code=$('#txtCode').val());
//      $.post(
//        path+"/index.php/Index/login",
//        params,
//        function(data) {
//          var r = data.r;
//          switch(r.code) {
//            case 0:
//              window.location.href = path+'/index.php/Manage/index';
//              break;
//            case 4:
//              window.location.href = r.msg;
//              break;
//            case 6:
//              if(!showVerification) {
//                $('#txtPwd').after('<img id="imgCode" src="'+imgUrl+'" alt="验证码">验证码<input id="txtCode" type="text">');
//                $('#imgCode').on('click', function() {
//                  this.src = imgUrl + '?rnd=' + Math.random();
//                });
//                showVerification = true;
//              }
//              alert(r.msg);
//              break;
//            default:
//              alert(r.msg);
//              break;
//          };
//          btn.button('reset');
//        },
//        'json'
//      );
//    }
//  });
//});