define(function (require) {
    var tpl = require('text!settings/settings.html');
    var mustache = require('mustache');
    require('jqueryForm');
    require('cropper');
    require('css!cropper');
    require('slimscroll');
    require('selectric');
    require('css!selectric');
    require('zclip');
    var phone = /^1[3|4|5|7|8][0-9]{9}$/;
    var email = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    var tel = /^[0-9][0-9-]{6,16}$/;
    var zcode = /^[1-9][0-9]{5}$/;
    var $view = null;
    var isFirst = true;
    var isSubmit = [true, true, true, true, true, true];
    var icount = 0;
    var oType = 1;
    var jcrop_api = null;
    var rand = Math.floor(Math.random() * (9999999 - 1111111 + 1) + 1111111);
    var iscurrent = 0;
    var userData = {
        userName: '',
        nickName: '',
        phone: '',
        email: ''
    };
    var logoIsSubmit = false;
    var avtImgIsSubmit = false;
    var userInfoDetail = $.parseJSON($(".userInfo").text());
    var hasTerm = false;

    var op = {
        nowUseInfo: null,
        invite_down_info: null,
        init: function (container, paramStr) {
            var param = RsCore.assist.str2json(paramStr);
            var self = this;
            var html = '';

            $('.rs-page-container').html('');
            $view = $(container);
            html = mustache.render(tpl, {
                static_path: static_path,
                invite_text: userInfoDetail.UType == 1 ? '马上邀请同事加入' : '马上邀请家人加入'
            });
            $view.append(html);

            function join(obj) {
                var arr = [];
                for (var key in obj) {
                    arr.push(key + '=' + obj[key]);
                }
                return arr.join('&');
            }

            $('.userCenter>ul>li').on('click', function (e) {
                var params = RsCore.assist.getUrlSearchQuerys();
                window.location.hash = '#settings/' + $(this).data('current') + '?' + join(params);
            });

            $view.find('.userCenter').slimScroll({
                height: $view.height(),
                size: '4px',
                alwaysVisible: true
            });

            this.userInfo('mycenter/myinfo');
            this.authInfo('mycenter/accreditinfo');
            this.clientAuthInfo('mycenter/clientaccreditstatus');
            this.storeInfo('mycenter/usedspace');
            this.initEvent();
        },


        //图片上传
        webUpload: function (opt) {
            if (opt.form == '#logoForm') {
                if (!fileType($(opt.logo).val())) {
                    return;
                }
                $(opt.form).attr('action', '/mycenter/uploadlogopreview');
                $(opt.form).off('submit').submit(function () {
                    $(this).ajaxSubmit({
                        type: 'post',
                        dataType: 'json',
                        url: '/mycenter/uploadlogopreview',
                        success: function (data) {
                            var options = null;
                            if (data.r.msg == '成功') {
                                $(opt.container).removeClass('hide');
                                $('.loadding').removeClass('hide');
                                $('.shadowPopBox').removeClass('hide');
                                $('#target').attr('src', '/mycenter/getlogopreview?' + new Date().getTime());
                                options = {
                                    aspectRatio: 18 / 7,
                                    resizable: false,
                                    viewMode: 0,
                                    preview: '.logopreview',
                                    crop: function (e) {
                                        $('#txtX1').val(Math.floor(e.y * e.scaleY));
                                        $('#txtY1').val(Math.floor(e.x * e.scaleX));
                                        $('#txtW').val(Math.floor(e.width * e.scaleX));
                                        $('#txtH').val(Math.floor(e.height * e.scaleY));
                                        $('.loadding').addClass('hide');
                                    }
                                };
                                $(opt.targetImg).cropper('destroy').cropper(options);
                                bindEvent();
                            } else {
                                RsCore.msg.warn(data.r.msg);
                            }
                        },
                        error: function (data) {
                            RsCore.msg.warn('图片超过1M');
                        }
                    });
                    return false;
                });
                $(opt.form).trigger('submit');
            } else {
                if (!fileType($(opt.logo).val())) {
                    return;
                }
                $(opt.form).attr('action', '/mycenter/uploadlogopreview');
                $(opt.form).off('submit').submit(function () {
                    $(this).ajaxSubmit({
                        type: 'post',
                        dataType: 'json',
                        url: '/mycenter/uploadlogopreview',
                        success: function (data) {
                            var options = null;
                            if (data.r.msg == '成功') {
                                $(opt.container).removeClass('hide');
                                $('.loadding').removeClass('hide');
                                $('.shadowPopBox').removeClass('hide');
                                $('#atarget').attr('src', '/mycenter/getlogopreview?' + new Date().getTime());
                                options = {
                                    aspectRatio: 1 / 1,
                                    resizable: false,
                                    viewMode: 0,
                                    preview: '.avtpreview',
                                    crop: function (e) {
                                        $('#atxtX1').val(Math.floor(e.y * e.scaleY));
                                        $('#atxtY1').val(Math.floor(e.x * e.scaleX));
                                        $('#atxtW').val(Math.floor(e.width * e.scaleX));
                                        $('#atxtH').val(Math.floor(e.height * e.scaleY));
                                        $('.loadding').addClass('hide');
                                    }
                                };
                                $(opt.targetImg).cropper('destroy').cropper(options);
                                bindEvent();
                            } else {
                                RsCore.msg.warn(data.r.msg);
                            }
                        },
                        error: function (data) {
                            RsCore.msg.warn('图片超过1M');
                        }
                    });
                    return false;
                });
                $(opt.form).trigger('submit');
            }

            //绑定确定，取消，关闭事件
            function bindEvent() {
                $(opt.closeBtn).off('click').on('click', function () {
                    if (opt.targetImg == '#target') {
                        logoIsSubmit = false;
                        $('#logoForm')[0].reset();
                        $('#ulogo img').removeAttr('style');
                        $('#ulogo img').attr('src', '/mycenter/getlogo?' + new Date().getTime());
                        $('#logo').replaceWith('<input type="file" value="" accept=".jpg,.gif,.png" capture="camera" name="logo" id = "logo" class="webuploader-element-invisible" multiple="multiple">');
                    } else if (opt.targetImg == '#atarget') {
                        avtImgIsSubmit = false;
                        $('#avtForm')[0].reset();
                        $('#avtor img').removeAttr('style');
                        $('#avtor img').attr('src', '/mycenter/getuserlogo?' + new Date().getTime());
                        $('#avtLogo').replaceWith('<input type="file" accept=".jpg,.gif,.png" capture="camera" name="logo" id = "avtLogo" class="webuploader-element-invisible" multiple="multiple">');
                    }
                    $('.shadowPopBox').addClass('hide');
                    $(opt.container).addClass('hide');
                });

                $(opt.upBtn).off('click').on('click', function () {
                    if (opt.targetImg == '#target') {
                        iscurrent = 1;
                        logoIsSubmit = true;
                        $('.saveBtn').removeClass('disabledSubmit');
                    } else if (opt.targetImg == '#atarget') {
                        avtImgIsSubmit = true;
                        $('.saveBtn').removeClass('disabledSubmit');
                    }
                    $('.shadowPopBox').addClass('hide');
                    $(opt.container).addClass('hide');
                });
            }

            //判断文件类型
            function fileType(val) {
                if (!/\.(gif|GIF|jpg|JPG|png|PNG)$/.test(val)) {
                    RsCore.msg.warn('图片类型必须是gif,jpg,png中的一种');
                    return false;
                }
                return true;
            }
        },
        //提交用户信息
        submitUserInfo: function (url, type) {
            var data = null;
            var self = this;
            if (type == 0) {
                data = {
                    centerPass: $.trim($('#centerPass').val()),
                    company: $.trim($('#company').val()),
                    industry: $.trim($('#industry').val()),
                    companySize: $.trim($('#companySize').val()),
                    tel: $.trim($('#tel').val()),
                    addr: $('#addr').val(),
                    zcode: $.trim($('#zcode').val()),
                    nickName: $.trim($('#nickName').val()),
                    oldOrg: op.nowUseInfo
                };

                if (!$('#isOpenCenterPass').hasClass('checked')) {
                    //     delete data.centerPass;
                    //     // data.centerPass = "";
                    // }else{
                    //     if($.trim($("#centerPass").val()).length){
                    //         data.centerPass = $.trim($("#centerPass").val());
                    //     }else{
                    //         delete data.centerPass;
                    //     }
                    data.centerPass = '';
                } else {
                    data.centerPass = $.trim($('#centerPass').val());
                    if (data.centerPass.length > 30) {
                        $('#centerPass').addClass('error');
                        $('.openPwd').siblings('.errorTip').removeClass('hide').text('中心密码不能大于30位');
                        return;
                    } else {
                        $('#centerPass').removeClass('error');
                        $('.openPwd').siblings('.errorTip').addClass('hide').text('');
                    }
                }

                if (isSubmit[0] && isSubmit[1] && isSubmit[2] && isSubmit[3] && isSubmit[4] && oType == '1') {
                    if ($.trim($('#company').val()).length == 0) {
                        $('#company').addClass('error').siblings('.errorTip').html('企业名称不能为空').addClass('red');
                    } else {
                        $('#company').removeClass('error').siblings('.errorTip').html('').removeClass('red');
                        uplogo();
                        RsCore.ajax(url, data, function (data, code, msg) {
                            var nickName = $.trim($('#nickName').val());
                            var userName = $('#ruserName').text();

                            if (msg == '修改成功') {
                                $('.rs-page-header h1').text($('#company').val() + ' ─ 安全云中心');
                                icount++;
                                $('.saveBtn').addClass('disabledSubmit');

                                $('.iknow').parent().hide();
                                if (nickName != '' && nickName != null) {
                                    $('.userName').text(nickName + '，');
                                } else {
                                    $('.userName').text(userName + '，');
                                }
                                $('.disabledEdit').removeClass('hide');
                                self.userInfo('mycenter/myinfo');
                            }
                        });
                    }
                } else if (isSubmit[0] && isSubmit[1] && isSubmit[2] && isSubmit[3] && isSubmit[4] && oType == '2') {
                    if ($.trim($('#company').val()).length == 0) {
                        $('#company').addClass('error').siblings('.errorTip').html('家庭名称不能为空').addClass('red');
                        return;
                    } else {
                        $('#company').removeClass('error').siblings('.errorTip').html('').removeClass('red');
                    }

                    delete data.industry;
                    delete data.companySize;
                    uplogo();
                    RsCore.ajax(url, data, function (data, code, msg) {
                        var nickName = $.trim($('#nickName').val());
                        var userName = $('#ruserName').text();

                        if (msg == '修改成功') {
                            icount++;
                            $('.rs-page-header h1').text($('#company').val() + ' ─ 安全云中心');
                            $('.saveBtn').addClass('disabledSubmit');
                            $('.iknow').parent().hide();
                            if (nickName != '' && nickName != null) {
                                $('.userName').text(nickName + '，');
                            } else {
                                $('.userName').text(userName + '，');
                            }
                            $('.disabledEdit').removeClass('hide');
                            self.userInfo('mycenter/myinfo');
                        }
                    });
                }

            } else if (type == 1) {
                data = {
                    company: $.trim($('#company').val()),
                    nickName: $.trim($('#nickName').val())
                };
                if ($.trim($('#nickName').val()) == '' || $.trim($('#nickName').val()).length <= 20) {
                    if (data.company == '') {
                        data.company = ' ';
                    }
                    uplogo();
                    RsCore.ajax(url, data, function (data, code, msg) {
                        var nickName = $.trim($('#nickName').val());
                        var userName = $('#ruserName').text();
                        if (msg == '修改成功') {
                            icount++;
                            $('.iknow').parent().hide();
                            $('.saveBtn').addClass('disabledSubmit');
                            if (nickName != '' && nickName != null) {
                                $('.userName').text(nickName + '，');
                            } else {
                                $('.userName').text(userName + '，');
                            }
                            $('.disabledEdit').removeClass('hide');
                            self.userInfo('mycenter/myinfo');
                        }
                    });
                }
                //else{
                //     RsCore.msg.warn("昵称不能为空");
                // }
            }

            function uplogo() {
                if ($('#ulogo img').attr('src').indexOf('logon.png') != -1 && iscurrent == 0) {
                    RsCore.ajax('/mycenter/resetlogo', function (data, r, msg) {
                        if (msg == '成功') {
                            $('.rs-page-logo img').attr('src', '/mycenter/getlogo?' + new Date().getTime());
                            $('.restoreDefault').addClass('hide');
                        }
                    });
                } else {
                    $('#avtForm').attr('action', '/mycenter/uploaduserlogo');
                    $('#logoForm').attr('action', '/mycenter/uploadlogo');
                    rand++;
                    if (logoIsSubmit) {
                        data.addr = $.trim($('#addr').val()) + ' ';
                        $('#logoForm').ajaxSubmit(function () {
                            $('#logoForm')[0].reset();
                            $('#logo').replaceWith('<input type="file" value="" accept=".jpg,.gif,.png" capture="camera" name="logo" id = "logo" class="webuploader-element-invisible" multiple="multiple">');
                            $('#ulogo img').attr('src', '/mycenter/getlogo?' + rand);
                            $('<img/>').attr('src', '/mycenter/getlogo?' + rand).load(function () {
                                $('.rs-page-logo img').attr('src', '/mycenter/getlogo?' + rand);
                            });
                            $('#ulogo img').removeAttr('style');
                            logoIsSubmit = false;
                        });
                    }
                    if (avtImgIsSubmit) {
                        $('#avtForm').ajaxSubmit(function () {
                            $('#avtForm')[0].reset();
                            $('#avtLogo').replaceWith('<input type="file" accept=".jpg,.gif,.png" capture="camera" name="logo" id = "avtLogo" class="webuploader-element-invisible" multiple="multiple">');
                            $('#avtor img').attr('src', '/mycenter/getuserlogo?' + rand);
                            $('<img/>').attr('src', '/mycenter/getuserlogo?' + rand).load(function () {
                                $('.rs-page-user img').attr('src', '/mycenter/getuserlogo?' + rand);
                            });
                            $('#avtor img').removeAttr('style');
                            logoIsSubmit = false;
                        });
                    }
                }
            }
        },

        //重新绑定账号
        reBindAccount: function (eleEvent, popBox) {
            var $input = null;
            var time = 60;
            var timer = null;
            var isPhone = '';
            var userName = '';

            $view.on('click', eleEvent, function () {
                var data = {
                    userName: '',
                    pwd: '',
                    checkCode: ''
                };
                var $img = '';
                isPhone = '';
                time = 60;
                $(popBox).find('.initAccount').text($('#ruserName').text());
                $(popBox).find('li').addClass('hide');
                $(popBox).find('li').slice(0, 3).removeClass('hide');
                $(popBox).find('.uc-btn').removeClass('hide');
                $(popBox).find('.bindPhone').addClass('hide');
                $(popBox).find('.bindLogin').addClass('hide');
                $(popBox).removeClass('hide');
                $(popBox).find('input').removeClass('error');
                $(popBox).find('input').eq(0).focus();
                $(popBox).find('.reTime').addClass('hide').find('i').text('60');
                $(popBox).find('input').val('');
                $(popBox).find('.tip').text('');
                $('.shadowPopBox').removeClass('hide');
                clearInterval(timer);
                $img = $('.getCode').find('img');
                var src = $img.attr('src').split('=')[0];
                var random = Math.random(100, 999);
                $img.attr('src', src + '=' + random);
                $(popBox).off('keyup', 'input').on('keyup', 'input', function (e) {
                    if (e.keyCode != 6) {
                        $(this).removeClass('error').siblings('.tip').text('');
                    }
                });
                $(popBox).off('blur', 'input').on('blur', 'input', function (e) {
                    var id = e.target.id;
                    var val = $.trim($(this).val());
                    if (id == 'roldPwd') {
                        if (val == '') {
                            $(this).addClass('error');
                            $(this).siblings('.tip').removeClass('hide').text('密码不能为空');
                        } else {
                            $(this).removeClass('error');
                            $(this).siblings('.tip').removeClass('hide').text('');
                        }
                    }
                    if (id == 'newAccount') {
                        if (phone.test(val)) {
                            data.userName = val;
                            data.phone = val;
                            isPhone = 'phone';
                            $(this).removeClass('error');
                            $(this).siblings('.tip').addClass('hide').text('');
                        } else if (email.test(val)) {
                            isPhone = 'email';
                            data.userName = val;
                            data.email = val;
                            $(this).removeClass('error');
                            $(this).siblings('.tip').addClass('hide').text('');
                        } else {
                            isPhone = '';
                            if (val == '') {
                                $(this).addClass('error');
                                $(this).siblings('.tip').removeClass('hide').text('账号不能为空');
                            } else {
                                $(this).addClass('error');
                                $(this).siblings('.tip').removeClass('hide').text('账号格式不对');
                            }

                            data.userName = '';
                        }
                    }
                });

                $(popBox).off('keyup', '#newAccount').on('keyup', '#newAccount', function (e) {
                    var val = $.trim($(this).val());
                    if (email.test(val)) {
                        setTimeout(function () {
                            $('.code').eq(0).parents('li').addClass('hide');
                            $('.code').eq(1).parents('li').removeClass('hide');
                        }, 500);
                        $(this).removeClass('error');
                        $(this).siblings('.tip').addClass('hide').text('');
                        time = 60;
                        clearInterval(timer);
                        $(popBox).find('.reTime').addClass('hide').find('i').text('60');
                        $view.off('click', '.reBindPho');
                        isPhone = 'email';
                    } else if (phone.test(val)) {
                        $('.code').eq(0).parents('li').removeClass('hide');
                        $('.code').eq(1).parents('li').addClass('hide');
                        $(this).removeClass('error');
                        $(this).siblings('.tip').addClass('hide').text('');
                        time = 60;
                        clearInterval(timer);
                        $view.off('click', '.reBindPho').on('click', '.reBindPho', getCode);
                        isPhone = 'phone';
                    } else {
                        $('.code').eq(0).parents('li').addClass('hide');
                        $('.code').eq(1).parents('li').addClass('hide');
                        time = 60;
                        clearInterval(timer);
                        $(popBox).find('.reTime').addClass('hide').find('i').text('60');
                        $view.off('click', '.reBindPho');
                        $('.getCode').removeClass('discode');
                        isPhone = '';
                    }
                });

                $(popBox).off('click').on('click', function (e) {
                    var className = e.target.className;

                    if (className == 'close' || className == 'cancelBtn') {
                        $(this).addClass('hide');
                        $('.getCode').removeClass('discode');
                        $('.reTime').addClass('hide');
                        time = 60;
                        clearInterval(timer);
                        $('.shadowPopBox').addClass('hide');
                        $(popBox).find('.reTime').addClass('hide').find('i').text('60');
                        $view.off('click', '.reBindPho').on('click', '.reBindPho', getCode);
                        clearInterval(timer);
                        time = 60;
                    } else if (className == 'nextBtn') {
                        $input = $(this).find('input');
                        $input.each(function (index) {
                            var id = $(this).attr('id');
                            var val = $.trim($(this).val());
                            switch (id) {
                                case 'roldPwd':
                                    data.pwd = val;
                                    break;
                                case 'newAccount':
                                    if (email.test(val)) {
                                        data.userName = val;
                                        data.email = val;
                                        delete data.phone;
                                        $(this).removeClass('error');
                                        $(this).siblings('.tip').addClass('hide').text('');
                                    } else if (phone.test(val)) {
                                        data.userName = val;
                                        data.phone = val;
                                        delete data.email;
                                        $(this).removeClass('error');
                                        $(this).siblings('.tip').addClass('hide').text('');
                                    } else {
                                        if (val != '') {
                                            $(this).addClass('error');
                                            $(this).siblings('.tip').removeClass('hide').text('账号格式不对');
                                        } else {
                                            $(this).addClass('error');
                                            $(this).siblings('.tip').removeClass('hide').text('账号不能为空');
                                        }
                                        data.userName = '';
                                    }
                            }
                        });

                        if (isPhone == 'phone') {
                            data.checkCode = $('#code').val();
                        } else {
                            data.checkCode = $('#icode').val();
                        }

                        if (data.userName != '' && data.pwd != '' && data.checkCode != '') {
                            userName = data.userName;
                            $.ajax({
                                url: '/mycenter/updateusername',
                                data: data,
                                type: 'post',
                                success: function (data) {
                                    data = JSON.parse(data);
                                    // console.log(data);
                                    if (data.r.msg == '成功') {
                                        RsCore.msg.success('修改成功');
                                        var a1 = $('.bindLogin').eq(1).find('a');
                                        var a0 = $('.bindLogin').eq(0).find('a');
                                        if (isPhone == 'email') {
                                            var href = 'http://mail.' + userName.slice(userName.indexOf('@') + 1);
                                            $(popBox).find('li').slice(0, 6).addClass('hide');
                                            $(popBox).find('.uc-btn').addClass('hide');
                                            $(popBox).find('.bindPhone').eq(1).removeClass('hide');
                                            $(popBox).find('.bindLogin').eq(1).removeClass('hide');
                                            $('.baccount').eq(1).text(userName);
                                            time = 60;
                                            clearInterval(timer);
                                            $(popBox).find('.reTime').addClass('hide').find('i').text('60');
                                            a1.on('click', function () {
                                                $(popBox).addClass('hide');
                                                $('.shadowPopBox').addClass('hide');
                                            });
                                            $view.off('click', '.reBindPho').on('click', '.reBindPho', getCode);
                                            //a1.attr("href",href);
                                        } else if (isPhone == 'phone') {
                                            $(popBox).find('li').slice(0, 5).addClass('hide');
                                            $(popBox).find('.uc-btn').addClass('hide');
                                            $(popBox).find('.bindPhone').eq(0).removeClass('hide');
                                            $(popBox).find('.bindLogin').eq(0).removeClass('hide');
                                            $('.baccount').eq(0).text(userName);
                                            time = 60;
                                            clearInterval(timer);
                                            $(popBox).find('.reTime').addClass('hide').find('i').text('60');
                                            $view.off('click', '.reBindPho').on('click', '.reBindPho', getCode);
                                            a0.on('click', function () {
                                                $('.shadowPopBox').addClass('hide');
                                                $(popBox).addClass('hide');
                                            });
                                        }
                                    } else {
                                        if (data.r.msg == '验证码错误！') {
                                            if (isPhone == 'phone') {
                                                $('#code').addClass('error').siblings('.tip').removeClass('hide').text(data.r.msg);
                                            } else {
                                                $('#icode').addClass('error').siblings('.tip').removeClass('hide').text(data.r.msg);
                                            }
                                        } else if (data.r.msg == '验证码错误') {
                                            if (isPhone == 'phone') {
                                                $('#code').addClass('error').siblings('.tip').removeClass('hide').text(data.r.msg);
                                            } else {
                                                $('#icode').addClass('error').siblings('.tip').removeClass('hide').text(data.r.msg);
                                            }
                                        } else if (data.r.msg == '手机号已被注册') {
                                            $('#newAccount').addClass('error').siblings('.tip').removeClass('hide').text(data.r.msg);
                                        } else if (data.r.msg == '密码错误') {
                                            $('#roldPwd').addClass('error').siblings('.tip').removeClass('hide').text(data.r.msg);
                                        } else {
                                            RsCore.msg.success(data.r.msg);
                                        }
                                    }
                                }
                            });
                        } else {
                            if (data.pwd == '' && isPhone != '') {
                                $('#roldPwd').addClass('error').siblings('.tip').removeClass('hide').text('密码不能为空');
                            } else if (data.checkCode == '' && isPhone != '') {
                                if (isPhone == 'phone') {
                                    $('#code').addClass('error').siblings('.tip').removeClass('hide').text('请输入验证码');
                                } else {
                                    $('#icode').addClass('error').siblings('.tip').removeClass('hide').text('请输入验证码');
                                }
                            }
                        }
                    }
                });

                //刷新验证码
                $view.off('click', '.reBindPho').on('click', '.reBindPho', getCode);
                $view.on('click', '.reBindEmail', getCode);
            });

            //获取验证码
            function getCode() {
                var $img = '';
                var src = '';
                var random = '';

                if (isPhone == 'email') {
                    $img = $('.getCode').find('img');
                    src = $img.attr('src').split('=')[0];
                    random = Math.random(100, 999);
                    $img.attr('src', src + '=' + random);
                } else if (isPhone == 'phone') {
                    //获取手机验证码
                    $('.getCode').addClass('discode');
                    $('.reTime').removeClass('hide');
                    RsCore.ajax('/mycenter/getPhoneCode', {
                        phoneNo: $.trim($('#newAccount').val())
                    }, function (data) { });
                    $view.off('click', '.reBindPho');
                    timer = setInterval(function () {
                        if (time > 0) {
                            time--;
                            $view.off('click', '.reBindPho');
                            $('.reTime').find('i').text(time);
                        } else {
                            time = 60;
                            $(popBox).find('.reTime').addClass('hide').find('i').text('60');
                            $view.off('click', '.reBindPho').on('click', '.reBindPho', getCode);
                            $('.reTime').find('i').text(time);
                            $('.reTime').addClass('hide');
                            $('.getCode').removeClass('discode');
                            clearInterval(timer);
                        }
                    }, 1000);
                } else {
                    $('#newAccount').siblings('.tip').removeClass('hide').text('账号格式不对');
                }
            }
        },

        //修改密码
        midPwd: function (url, ele, closeBtn, cancelBtn) {
            var aid = ['oldPwd', 'newPwd', 'confirmPwd'];
            var tip = ['密码不能为空', '两次密码不一致', '密码长度不小于8位'];
            var $tip = $('.uc-mpwd').find('.tip');
            var oldpwd = '';
            var newPwd = '';
            var confirmPwd = '';
            var isEq = false;
            var oisRight = false;
            var risRight = false;
            var oisEmpty = false;

            /*密码强度*/
            var pwdStrong = {
                minLen: 8,
                level: ['low', 'middle', 'high'],
                chars: ['低', '中', '高'],
                fn: ['matchAZ', 'matchaz', 'matchNum', 'matchSign'],
                matchAZ: function (val) {
                    return val.match(/[A-Z]+/);
                },
                matchaz: function (val) {
                    return val.match(/[a-z]+/);
                },
                matchNum: function (val) {
                    return val.match(/[0-9]/);
                },
                matchSign: function (val) {
                    return val.match(/[~!@#$%^&*(),./?<>;:'"]+/);
                },
                getLevel: function (val) {
                    var num = -2;
                    var fn = pwdStrong.fn;
                    for (var i = 0; i < fn.length; i++) {
                        pwdStrong[fn[i]](val) && num++;
                    }
                    return num = (num < 0 ? 0 : num);
                },
                setHtml: function (val) {
                    var $pwd = $('.pwdStrong');
                    if (val.length == 0) {
                        $pwd.addClass('hide');
                        return false;
                    }
                    var idx = pwdStrong.getLevel(val);
                    $pwd.removeClass('hide low high middle').addClass(pwdStrong.level[idx]).find('i').text(pwdStrong.chars[idx]);

                }
            };


            $('.pwdStrong').addClass('hide');
            $('.shadowPopBox').removeClass('hide');
            $(ele).find('input').val('').removeClass('error');
            $(ele).eq(0).removeClass('hide');
            $(ele).eq(0).find('.tip').text('');
            $('#oldPwd').focus();
            $view.on('click', closeBtn + ',' + cancelBtn, function () {
                $(ele).eq(0).addClass('hide');
                $('.shadowPopBox').addClass('hide');
            });

            $view.off('click', '.uc-mpwd .uploadBtn').on('click', '.uc-mpwd .uploadBtn', function () {

                newPwd = $.trim($('#newPwd').val());
                confirmPwd = $.trim($('#confirmPwd').val());
                oisRight = isRight(newPwd, '#newPwd');
                risRight = isRight(confirmPwd, '#confirmPwd');
                var isLow = pwdStrong.getLevel(newPwd) == 0;

                function isRight(val, ele) {
                    if (val.length >= 8) {
                        return true;
                    } else {
                        return false;
                    }
                }

                if (oisEmpty && isEq && oisRight && risRight && !isLow) {
                    $.ajax({
                        url: '/mycenter/modifypwd',
                        data: {
                            oldPwd: oldpwd,
                            newPwd: newPwd
                        },
                        type: 'post',
                        success: function (data) {
                            data = JSON.parse(data);
                            if (data.r.msg == '修改密码成功') {
                                RsCore.msg.success('修改密码成功');
                                $(ele).eq(0).addClass('hide');
                                $('.shadowPopBox').addClass('hide');
                            } else if (data.r.msg == '密码错误') {
                                $('#oldPwd').addClass('error').siblings('.tip').text(data.r.msg);
                            } else {
                                RsCore.msg.warn(data.r.msg);
                            }
                        }
                    });
                } else {
                    if (oldpwd == '') {
                        $('#oldpwd').addClass('error');
                        $tip.eq(0).text(tip[0]);
                    }

                    if (isLow && newPwd.length >= 8) {
                        $('#newPwd').siblings('.tip').text('密码强度过低,由字母(区分大小写),数字,符号组成');
                        $('#newPwd').addClass('error');
                    } else if (isLow && newPwd.length < 8) {
                        $('#newPwd').siblings('.tip').text(tip[2]);
                        $('#newPwd').addClass('error');
                    } else if (newPwd.length < 8) {
                        $('#newPwd').siblings('.tip').text(tip[2]);
                        $('#newPwd').addClass('error');
                    } else {
                        $('#newPwd').removeClass('error');
                        $('#newPwd').siblings('.tip').text('');
                    }

                    if (newPwd == '') {
                        $('#newPwd').addClass('error');
                        $tip.eq(1).text(tip[0]);
                    } else {
                        if (newPwd == confirmPwd) {
                            if (!oisRight) {
                                $('#newPwd').addClass('error');
                                $tip.eq(1).text(tip[2]);
                            }
                        }
                    }

                    if (confirmPwd == '') {
                        $('#confirmPwd').addClass('error');
                        $tip.eq(2).text(tip[0]);
                    } else {
                        if (newPwd == confirmPwd) {
                            if (!risRight) {
                                $('#confirmPwd').addClass('error');
                                $tip.eq(2).text(tip[2]);
                            }
                        }
                    }
                }
            });

            $view.on('keyup', '.uc-mpwd input', function (e) {

                if ($(this).attr('id') == 'newPwd') {
                    pwdStrong.setHtml($(this).val());
                }

                if (e.keyCode != 6) {
                    $(this).removeClass('error').siblings('.tip').text('');
                }
            });

            $view.on('blur', '.uc-mpwd', function (e) {
                var id = e.target.id;
                var isLow = $('.pwdStrong').hasClass('low');

                switch (id) {
                    case aid[0]:
                        oldpwd = $.trim(e.target.value);
                        oisEmpty = isEmpty(oldpwd);
                        break;
                    case aid[1]:
                        newPwd = $.trim(e.target.value);
                        if (newPwd.length >= 8 && confirmPwd.length >= 8) {
                            isEq = isEqual(newPwd, confirmPwd);
                        } else {
                            isEmpty(newPwd);
                        }

                        break;
                    case aid[2]:
                        confirmPwd = $.trim(e.target.value);
                        if (confirmPwd.length >= 8 && newPwd.length >= 8) {
                            isEq = isEqual(newPwd, confirmPwd);
                        } else {
                            isEmpty(confirmPwd);
                        }
                        break;
                }

                function isEmpty(val) {
                    if (!val) {
                        $(e.target).addClass('error');
                        $(e.target).siblings('.tip').text(tip[0]);
                        return false;
                    } else {
                        if (val.length < 8) {
                            $(e.target).addClass('error');
                            $(e.target).siblings('.tip').text(tip[2]);
                            return false;
                        } else {
                            $(e.target).removeClass('error');
                            $(e.target).siblings('.tip').text('');
                            if (isLow && id == aid[1]) {
                                $('#newPwd').addClass('error');
                                $('#newPwd').siblings('.tip').text('密码强度过低,由字母(区分大小写),数字,符号组成');
                                return false;
                            } else if (id == aid[1]) {
                                $('#newPwd').removeClass('error');
                                $('#newPwd').siblings('.tip').text('');
                            }
                        }
                        return true;
                    }
                }

                function isEqual(val1, val2) {
                    if (val1 != '' && val2 != '' && val2.length >= 8 && val1.length >= 8) {
                        if (val1 == val2) {
                            if (isLow) {
                                $('#newPwd').addClass('error');
                                $('#newPwd').siblings('.tip').text('密码强度过低,由字母(区分大小写),数字,符号组成');
                                return false;
                            } else {
                                $('#newPwd').removeClass('error');
                                $('#newPwd').siblings('.tip').text('');
                            }
                            $tip.eq(2).text('');
                            $('#confirmPwd').removeClass('error');
                            return true;
                        } else {
                            if (isLow) {
                                $('#newPwd').addClass('error');
                                $('#newPwd').siblings('.tip').text('密码强度过低,由字母(区分大小写),数字,符号组成');
                            } else {
                                $('#newPwd').removeClass('error');
                                $('#newPwd').siblings('.tip').text('');
                            }
                            $tip.eq(2).text('');
                            $('#confirmPwd').addClass('error');
                            $('#confirmPwd').siblings('.tip').text(tip[1]);
                            return false;
                        }
                    }
                }

                function isRight(val) {
                    if (val.length >= 8) {
                        $(e.target).removeClass('error');
                        $(e.target).siblings('.tip').text('');
                        return true;
                    } else {
                        $(e.target).addClass('error');
                        $(e.target).siblings('.tip').text(tip[2]);
                        return false;
                    }
                }
            });
        },

        //获取用户信息
        userInfo: function (url) {
            var self = this;
            $view.on('click', '.uc-content-left .iknow', function () {
                $(this).parent().addClass('hide');
            });
            if (icount) {
                $('.iknow').parent().hide();
            }
            RsCore.ajax(url, function (data) {
                op.nowUseInfo = data;
                oType = data.oType;
                if (oType == '2') {
                    $('.uc-cl-1 h3').eq(0).find('span:eq(0)').text('家庭信息');
                    $('#company').siblings('label').text('家庭名称');
                    $('#industry,#companySize').parents('li').addClass('hide');
                    $('#fillPinfo span').text('家庭');
                } else {
                    $('#fillPinfo span').text('企业');
                }
                $('#industry,#companySize,#ulogo').parents('li').remove();
                if (data.hasOwnProperty('isOpenCenterPass')) {
                    if (data.company == '' || data.company == null) {
                        $('.edit').remove();
                        $('.disabledEdit').addClass('hide');
                        $('.uc-cl-1 h3 p').removeClass('hide');
                        $('input,select').removeClass('disabled').removeAttr('disabled');
                        $('#email,#phone').addClass('disabled').attr('disabled', 'disabled');
                        $('#fillPinfo').removeClass('hide');
                        $('.shadowPopBox').removeClass('hide');
                        $('.shadowPopBox').attr('style', 'opacity:0.5;filter:alpha(opacity=50);background-color:#000');
                        for (var i in data) {
                            if (i == 'userName') {
                                $('#ruserName').text(data.userName);
                            } else if (i == 'isOpenCenterPass') {
                                if (data.isOpenCenterPass) {
                                    $('#isOpenCenterPass').addClass('checked');
                                    $('#centerPass').removeClass('hide').siblings('i').addClass('hide');
                                    $('#centerPass').val(data.centerPass);
                                } else {
                                    $('#isOpenCenterPass').removeClass('checked');
                                    $('#centerPass').addClass('hide');
                                    $('#centerPass').siblings('.disabledEdit').addClass('hide');
                                    $('#centerPass').siblings('i').eq(0).removeClass('hide');
                                }

                                $view.off('click', '#isOpenCenterPass').on('click', '#isOpenCenterPass', function () {
                                    if ($('#isOpenCenterPass').hasClass('checked')) {
                                        $('.saveBtn').removeClass('disabledSubmit');
                                        $('#isOpenCenterPass').removeClass('checked');
                                        $('#centerPass').addClass('hide');
                                        $('#centerPass').siblings('.disabledEdit').addClass('hide');
                                        $('#centerPass').siblings('i').eq(0).removeClass('hide');
                                    } else {
                                        $('#isOpenCenterPass').addClass('checked');
                                        $('.saveBtn').removeClass('disabledSubmit');
                                        $('#centerPass').removeClass('hide');
                                        $('#centerPass').siblings('.disabledEdit').addClass('hide');
                                        $('#centerPass').siblings('i').eq(0).addClass('hide');
                                    }
                                });

                            } else if (i == 'industry') {
                                // $('#industry option').each(function () {
                                //     if ($(this).val() == data.industry) {
                                //         $(this).attr('selected', 'selected');
                                //         $(this).parents('li').find('.disabledEdit').html('' + '<i class="edit"></i>').addClass('hide');
                                //     } else {
                                //         $('#industry option').eq(0).attr('selected', 'selected');
                                //         $(this).parents('li').find('.disabledEdit').html('' + '<i class="edit"></i>').addClass('hide');
                                //     }
                                // });
                            } else if (i == 'companySize') {
                                // $('#companySize option').eq(data.companySize).attr('selected', 'selected');
                                // $('#companySize').parents('li').find('.disabledEdit').html('' + '<i class="edit"></i>').addClass('hide');
                            } else if (i == 'logo') {
                                if (data.logo) {
                                    //$("#ulogo img").removeAttr("style");
                                    // $("#ulogo img").attr("src","/mycenter/getlogo")
                                }
                            } else if (i == 'avtor') {
                                if (data.avtor) {
                                    //$("#avtor img").removeAttr("style");
                                    // $("#avtor img").attr("src","/mycenter/getuserlogo");
                                }
                            } else {
                                if (data[i] == null) {
                                    $('#' + i).val('');
                                } else {
                                    $('#' + i).val(data[i]);
                                }
                            }
                        }
                    } else {
                        for (var i in data) {
                            if (i == 'userName') {
                                $('#ruserName').text(data.userName);
                            } else if (i == 'isOpenCenterPass') {
                                if (data.isOpenCenterPass) {
                                    $('#isOpenCenterPass').addClass('checked');
                                    $('#centerPass').val(data.centerPass);
                                    $('#centerPass').addClass('disabled').attr('disabled', 'disabled');
                                    $('#centerPass').removeClass('hide').siblings('i').addClass('hide');
                                    $('#centerPass').siblings('.edit').addClass('hide');
                                } else {
                                    $('#isOpenCenterPass').removeClass('checked');
                                    $('#centerPass').addClass('hide');
                                    $('#centerPass').siblings('.disabledEdit').addClass('hide');
                                    $('#centerPass').siblings('i').eq(0).removeClass('hide');
                                }

                                $view.off('click', '#isOpenCenterPass').on('click', '#isOpenCenterPass', function () {
                                    if ($('#isOpenCenterPass').hasClass('checked')) {
                                        $('.saveBtn').removeClass('disabledSubmit');
                                        $('#isOpenCenterPass').removeClass('checked');
                                        $('#centerPass').addClass('hide');
                                        $('#centerPass').siblings('.disabledEdit').addClass('hide');
                                        $('#centerPass').siblings('i').eq(0).removeClass('hide');
                                        $('#centerPass').siblings('.edit').addClass('hide');
                                    } else {
                                        $('.saveBtn').removeClass('disabledSubmit');
                                        $('#isOpenCenterPass').addClass('checked');
                                        $('#centerPass').siblings('.disabledEdit').addClass('hide');
                                        $('#centerPass').removeClass('hide').removeClass('disabled').removeAttr('disabled');
                                        $('#centerPass').siblings('i').eq(0).addClass('hide');
                                        $('#centerPass').siblings('.edit').addClass('hide');
                                    }
                                });

                            } else if (i == 'industry') {
                                $('#industry option').each(function () {
                                    if ($(this).val() == data.industry) {
                                        $(this).attr('selected', 'selected');
                                        $(this).parents('li').find('.disabledEdit').html(data.industry + '<i class="edit"></i>');
                                        if (data.industry == '') {
                                            $(this).parents('li').find('.disabledEdit').html('请选择所属行业' + '<i class="edit"></i>');
                                        }
                                    } else {
                                        if (data.industry == '' || data.industry == null) {
                                            $('#industry option').eq(0).attr('selected', 'selected');
                                            $(this).parents('li').find('.disabledEdit').html('请选择所属行业' + '<i class="edit"></i>');
                                        }
                                    }
                                });
                            } else if (i == 'companySize') {
                                $('#companySize option').eq(data.companySize).attr('selected', 'selected');
                                $('#companySize').parents('li').find('.disabledEdit').html($('#companySize option').eq(data.companySize).text() + '<i class="edit"></i>');
                            } else if (i == 'logo') {
                                if (data.logo) {
                                    //$('#ulogo img').removeAttr('style');
                                    // $('#ulogo img').attr('src','/mycenter/getlogo')
                                }
                            } else if (i == 'avtor') {
                                if (data.avtor) {
                                    //$('#avtor img').removeAttr('style');
                                    // $('#avtor img').attr('src','/mycenter/getuserlogo')
                                }
                            } else {
                                if (data[i] == null) {
                                    $('#' + i).val(data[i]);
                                    $('#' + i).parents('li').find('.disabledEdit').html('' + '<i class="edit"></i>');
                                } else {
                                    $('#' + i).val(data[i]);
                                    $('#' + i).parents('li').find('.disabledEdit').html(data[i] + '<i class="edit"></i>');
                                }
                            }
                        }
                        if (data.addr == ' ' || data.addr.slice(data.addr.length - 1) == ' ') {
                            $('.restoreDefault').removeClass('hide');
                            $view.on('click', '.restoreDefault', function () {
                                $('#ulogo img').removeAttr('style');
                                $('.saveBtn').removeClass('disabledSubmit');
                                $('#ulogo img').attr('src', '/public/img/logon.png');
                                $('#addr').val($.trim($('#addr').val()));
                                iscurrent = 0;
                            });
                        }
                    }

                    $view.off('click', '.saveBtn').on('click', '.saveBtn', function () {
                        if (!$(this).hasClass('disabledSubmit')) {
                            self.submitUserInfo('mycenter/updatemyinfo', 0);
                        }
                    });

                    $view.on('click', '.edit', function () {
                        $('.saveBtn').removeClass('disabledSubmit');
                        $(this).parent().siblings('input,select').removeClass('disabled').removeAttr('disabled');
                        $(this).siblings('input,select').removeClass('disabled').removeAttr('disabled');
                        $(this).parents('.disabledEdit').addClass('hide');
                        $(this).addClass('hide');
                    });
                } else {
                    if (data.company == '' || data.company == null) {
                        $('.disabledEdit').addClass('hide');
                        $('.uc-cl-1 h3 p').removeClass('hide');
                        $('#fillPinfo').removeClass('hide');
                        $('.shadowPopBox').removeClass('hide');
                        $('.shadowPopBox').attr('style', 'opacity:0.5;filter:alpha(opacity=50);background-color:#000');
                        $('#nickName').removeClass('disabled').removeAttr('disabled');
                        $('.reBind').text('');
                        $('#industry,#companySize,#ulogo').parents('li').remove();
                        for (var i in data) {
                            if (i == 'userName') {
                                if (data.phone) {
                                    $('#ruserName').text(data.phone);
                                } else {
                                    $('#ruserName').text(data.email);
                                }
                                var str = '<li class="userName1"><p class="first"><label>用户名：</label><input type="text" class="disabled" disabled value="' + data.userName + '" class="ustInfo" id="userName"></p></li>';
                                if ($('.userName1').length > 0) {
                                    $('.userName1').remove();
                                }
                                $('#nickName').parents('li').before(str);
                            } else if (i == 'isOpenCenterPass') {
                                $('#centerPass').siblings('.edit').addClass('hide');
                            }
                            if (i == 'company') {
                                $('#company').val(data.company);
                                $('#company').addClass('disabled').attr('disabled', 'disabled');
                            } else if (i == 'avtor') {
                                if (data.avtor) {
                                    //$('#avtor img').attr('src','/mycenter/getuserlogo')
                                }
                            } else {
                                if (data[i] == null) {
                                    $('#' + i).val('');
                                } else {
                                    $('#' + i).val(data[i]);
                                }
                            }
                        }
                    } else {
                        $('.reBind').text('');
                        $('.disabledEdit').addClass('hide');
                        $('#nickName').siblings('.disabledEdit').removeClass('hide');
                        $('#isOpenCenterPass').css('cursor', 'default');
                        $('#industry,#companySize,#ulogo').parents('li').remove();
                        $('#centerPass,#tel,#addr,#zcode,#company').siblings('.disabledEdit').find('.edit').remove();
                        for (var i in data) {
                            if (i == 'userName') {
                                $('#ruserName').text(data.userName);
                                var str = '<li class="userName1"><p class="first"><label>用户名：</label><input type="text" class="disabled" disabled value="' + data.userName + '" class="ustInfo" id="userName"></p></li>';
                                if ($('.userName1').length > 0) {
                                    $('.userName1').remove();
                                }
                                $('#nickName').parents('li').before(str);
                            } else if (i == 'isOpenCenterPass') {
                                $('#centerPass').siblings('.edit').addClass('hide');
                            }
                            if (i == 'company') {
                                $('#company').val(data.company);
                                $('#company').siblings('.edit').addClass('hide');
                                $('#company').addClass('disabled').attr('disabled', 'disabled');
                            } else if (i == 'avtor') {
                                if (data.avtor) {
                                    //$('#avtor img').attr('src','/mycenter/getuserlogo')
                                }
                            } else {
                                if (data[i] == null) {
                                    $('#' + i).val(data[i]);
                                    $('#' + i).parents('li').find('.disabledEdit').html('' + '<i class="edit"></i>');
                                } else {
                                    $('#' + i).val(data[i]);
                                    $('#' + i).parents('li').find('.disabledEdit').html(data[i] + '<i class="edit"></i>');
                                }
                            }
                        }
                    }

                    $('#nickName').siblings('.disabledEdit').find('.edit').on('click', function () {
                        $(this).parent().siblings('input,select').removeClass('disabled').removeAttr('disabled');
                        $(this).siblings('input,select').removeClass('disabled').removeAttr('disabled');
                        $(this).parents('.disabledEdit').addClass('hide');
                        $(this).remove();
                    });

                    $view.off('click', '.saveBtn').on('click', '.saveBtn', function () {
                        self.submitUserInfo('mycenter/updatemyinfo', 1);
                    });
                }
                self.reBindAccount('.reBind', '.reBindPhone');
                $view.find('select').selectric({
                    inheritOriginalWidth: true,
                    maxHeight: 187,
                    isAbove: false
                });

                $('#industry').selectric().on('change', function () {
                    $('.saveBtn').removeClass('disabledSubmit');
                });

                $('#companySize').selectric().on('change', function () {
                    $('.saveBtn').removeClass('disabledSubmit');
                });

                $view.on('blur', 'input', function (e) {
                    var id = e.target.id;
                    switch (id) {
                        case 'company':
                            var vcompany = '';
                            if (oType == '1') {
                                vcompany = $.trim($(this).val());
                                if (vcompany.length > 20) {
                                    isSubmit[0] = false;
                                    $(this).addClass('error').siblings('.errorTip').html('企业名称不能超过20个字符').addClass('red');
                                } else {
                                    if (vcompany.length == 0) {
                                        isSubmit[0] = false;
                                        $(this).addClass('error').siblings('.errorTip').html('企业名称不能为空').addClass('red');
                                    } else {
                                        isSubmit[0] = true;
                                        $('.saveBtn').removeClass('disabledSubmit');
                                        $(this).removeClass('error').siblings('.errorTip').html('').removeClass('red');
                                    }
                                }
                            } else if (oType == '2') {
                                vcompany = $.trim($(this).val());
                                if (vcompany.length > 20) {
                                    isSubmit[0] = false;
                                    $(this).addClass('error').siblings('.errorTip').html('家庭名称不能超过20个字符').addClass('red');
                                } else {
                                    if (vcompany.length == 0) {
                                        isSubmit[0] = false;
                                        $(this).addClass('error').siblings('.errorTip').html('家庭名称不能为空').addClass('red');
                                    } else {
                                        isSubmit[0] = true;
                                        $('.saveBtn').removeClass('disabledSubmit');
                                        $(this).removeClass('error').siblings('.errorTip').html('').removeClass('red');
                                    }
                                }
                            }
                            break;
                        case 'nickName':
                            var vnickName = $.trim($(this).val());
                            if (vnickName.length > 20) {
                                isSubmit[1] = false;
                                $(this).addClass('error').siblings('.errorTip').html('昵称不能超过20个字符').addClass('red');
                            } else {
                                isSubmit[1] = true;
                                $('.saveBtn').removeClass('disabledSubmit');
                                $(this).removeClass('error').siblings('.errorTip').html('').removeClass('red');
                            }
                            break;
                        case 'tel':
                            var vtel = $.trim($(this).val());
                            if (vtel.length > 0) {
                                if (!tel.test(vtel)) {
                                    isSubmit[2] = false;
                                    $(this).addClass('error').siblings('.errorTip').html('电话号码不正确').addClass('red');
                                } else {
                                    isSubmit[2] = true;
                                    $('.saveBtn').removeClass('disabledSubmit');
                                    $(this).removeClass('error').siblings('.errorTip').html('').removeClass('red');
                                }
                            } else {
                                isSubmit[2] = true;
                                $('.saveBtn').removeClass('disabledSubmit');
                                $(this).removeClass('error').siblings('.errorTip').html('').removeClass('red');
                            }
                            break;
                        case 'addr':
                            var vaddr = $.trim($(this).val());
                            if (vaddr.length > 50) {
                                isSubmit[3] = false;
                                $(this).addClass('error').siblings('.errorTip').html('地址不能超过50个字符').addClass('red');
                            } else {
                                isSubmit[3] = true;
                                $('.saveBtn').removeClass('disabledSubmit');
                                $(this).removeClass('error').siblings('.errorTip').html('').removeClass('red');
                            }
                            break;
                        case 'zcode':
                            var vzcode = $.trim($(this).val());
                            if (vzcode.length > 0) {
                                if (!zcode.test(vzcode)) {
                                    isSubmit[4] = false;
                                    $(this).addClass('error').siblings('.errorTip').html('邮编不正确').addClass('red');
                                } else {
                                    isSubmit[4] = true;
                                    $('.saveBtn').removeClass('disabledSubmit');
                                    $(this).removeClass('error').siblings('.errorTip').html('').removeClass('red');
                                }
                            } else {
                                isSubmit[4] = true;
                                $('.saveBtn').removeClass('disabledSubmit');
                                $(this).removeClass('error').siblings('.errorTip').html('').removeClass('red');
                            }
                            break;
                        case 'centerPass':
                            if ($.trim($(this).val()).length > 30) {
                                $('#centerPass').addClass('error');
                                $('.openPwd').siblings('.errorTip').removeClass('hide').text('中心密码不能大于30位');
                                return;
                            } else {
                                $('#centerPass').removeClass('error');
                                $('.saveBtn').removeClass('disabledSubmit');
                                $('.openPwd').siblings('.errorTip').addClass('hide').text('');
                            }
                            break;
                    }
                });

                $('.disabledEdit').hover(function () {
                    $(this).find('.edit').css('display', 'inline-block');
                }, function () {
                    $(this).find('.edit').css('display', 'none');
                });

                $('.openPwd').hover(function () {
                    if ($(this).find('b').hasClass('checked') && $(this).find('input').hasClass('disabled')) {
                        $(this).find('.edit').removeClass('hide');
                    } else {
                        $(this).find('.edit').addClass('hide');
                    }
                }, function () {
                    if ($(this).find('b').hasClass('checked')) {
                        $(this).find('.edit').addClass('hide');
                    }
                });

                function resize() {
                    if ($('.uc-cl-1').width() <= 720) {
                        $('.openPwd').css('display', 'block');
                    } else {
                        $('.openPwd').css('display', 'inline-block');
                    }
                    $view.find('.userCenter').slimScroll({
                        height: $view.height(),
                        size: '4px',
                        alwaysVisible: true
                    });
                }

                $(window).on('resize', resize);
                resize();
            });
        },

        //授权信息
        authInfo: function (url) {
            RsCore.ajax(url, function (data) {
                var $soreInfo = $('.soreInfo');
                var regTime = '<li><span>注册时间:</span><span>' + data.registerTime + '</span></li>';
                var authStatus = '<li><span>授权状态:</span><span class="';
                var authType = '';
                var expireTime = '<li><span>授权截至:</span><span>' + data.expireTime + '</span></li>';

                if (data.accreditState == '正常') {
                    authType = 'black';
                } else if (data.accreditState == '试用') {
                    authType = 'blue';
                } else if (data.accreditState == '即将到期') {
                    authType = 'orange';
                } else {
                    authType = 'red';
                }

                $soreInfo.html(regTime + authStatus + authType + '" >' + data.accreditState + '</span></li>' + expireTime);
            });
        },

        //客户端授权信息
        clientAuthInfo: function (url) {
            var self = this;
            RsCore.ajax(url, function (data) {
                var $grantPic = $('.uc-grant-pic').find('span');
                var $grantTit = $('.uc-grant-tit').find('i');
                if (data.total && data.total > 0) {
                    hasTerm = true;
                    $('#authDev').text(data.total).parent().show();
                    $('#useDev').text(data.useCount);
                } else {
                    $('#useDev').parent().html('当前共有<i id="useDev"></i>台');
                    $('#useDev').text(data.useCount);
                }

                $grantPic.eq(0).css('width', self.percent(data.winCount, data.useCount) + '%');
                $grantPic.eq(1).css('width', self.percent(data.linuxCount, data.useCount) + '%');
                $grantPic.eq(2).css('width', self.percent(data.androidCount, data.useCount) + '%');
                $grantTit.eq(0).text(data.winCount);
                $grantTit.eq(1).text(data.linuxCount);
                $grantTit.eq(2).text(data.androidCount);
            });
        },

        //云中心存储信息概况
        storeInfo: function (url) {
            var self = this;
            RsCore.ajax(url, function (data) {
                var $storage = $('.uc-storage ul');
                var bit2Mb = 1048576;
                var totalMen = 500; //(Mb)
                var vir_val = op.formatDiskSize(data.virsize),
                    def_val = op.formatDiskSize(data.defsize),
                    ndef_val = op.formatDiskSize(data.ndefsize),
                    nmgr_val = op.formatDiskSize(data.nmgrsize),
                    avir_val = op.formatDiskSize(data.avirsize),
                    aspam_val = op.formatDiskSize(data.aspamsize),
                    apoint_val = op.formatDiskSize(data.apointsize);
                var vir = '<li><p>病毒查杀<span>(<i>' + data.vircount + '</i>条/约<i>' + vir_val + '</i>)</span></p><p class="percentage"><span style="width:' + self.percent(data.virsize / bit2Mb, totalMen) + '%"></span><p></li>';
                var def = '<li><p>主机防御<span>(<i>' + data.defcount + '</i>条/约<i>' + def_val + '</i>)</span></p><p class="percentage"><span style="width:' + self.percent(data.defsize / bit2Mb, totalMen) + '%"></span><p></li>';
                var ndef = '<li><p>网络防护<span>(<i>' + data.ndefcount + '</i>条/约<i>' + ndef_val + '</i>)</span></p><p class="percentage"><span style="width:' + self.percent(data.ndefsize / bit2Mb, totalMen) + '%"></span><p></li>';
                var nmgr = '<li><p>上网管理<span>(<i>' + data.nmgrcount + '</i>条/约<i>' + nmgr_val + '</i>)</span></p><p class="percentage"><span style="width:' + self.percent(data.nmgrsize / bit2Mb, totalMen) + '%"></span><p></li>';
                // var avir = '<li><p>手机安全<span>(<i>' + data.avircount + '</i>条/约<i>' + avir_val + '</i>M)</span></p><p class="percentage"><span style="width:' + self.percent(data.avirsize/bit2Mb,totalMen) + '%"></span><p></li>';
                // var aspam = '<li><p>手机拦截<span>(<i>' + data.aspamcount + '</i>条/约<i>' + aspam_val + '</i>M)</span></p><p class="percentage"><span style="width:' + self.percent(data.aspamsize/bit2Mb,totalMen) + '%"></span><p></li>';
                // var apoint = '<li><p>位置信息<span>(<i>' + data.apointcount + '</i>条/约<i>' + apoint_val + '</i>M)</span></p><p class="percentage"><span style="width:' + self.percent(data.apointsize/bit2Mb,totalMen) + '%"></span><p></li>';
                $storage.html(vir + def + ndef + nmgr);
                //$storage.html(vir + def + ndef + nmgr + avir + aspam + apoint);
            });
        },
        formatDiskSize: function (num) {
            num = Number(num);
            var sizeType = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
            var idx = 0;
            num /= 1024;
            while (num >= 1000) {
                idx++;
                num /= 1024;
            }

            return num.toFixed(1) + sizeType[idx];
        },

        //计算百分比
        percent: function (divide, divisor) {
            if (divide == 0) {
                return 0;
            }
            var per = (divide / divisor).toFixed(4) * 100;
            if (per < 1) {
                return 1;
            }
            return per;
        },

        initEvent: function (container) {
            var self = this;
            $view.off('click', '#logo').on('click', '#logo', function () {
                $('#logoForm')[0].reset();
                $('#logo').attr('value', '');
            });

            $view.off('change', '#logo').on('change', '#logo', function () {
                self.webUpload({
                    selectBtn: '#ulogo',
                    logo: '#logo',
                    container: '#uplogo',
                    targetImg: '#target',
                    upBtn: '#uplogo .uploadBtn',
                    closeBtn: '#uplogo .cancelBtn,#uplogo .close',
                    url: '/mycenter/uploadlogo',
                    form: '#logoForm',
                });
            });

            $view.off('click', '#avtLogo').on('click', '#avtLogo', function () {
                $('#avtForm')[0].reset();
                $('#avtLogo').attr('value', '');
            });

            $view.off('change', '#avtLogo').on('change', '#avtLogo', function () {
                self.webUpload({
                    selectBtn: '#avtor',
                    logo: '#avtLogo',
                    container: '#auplogo',
                    targetImg: '#atarget',
                    upBtn: '#auplogo .uploadBtn',
                    closeBtn: '#auplogo .cancelBtn,#auplogo .close',
                    url: '/mycenter/uploaduserlogo',
                    form: '#avtForm',
                });
            });

            // $view.on('click', '.midPassword', function () {
            //     self.midPwd('mycenter/modifypwd', '.uc-mid-pwd', '.uc-mid-pwd .cancelBtn', '.uc-mid-pwd .close');
            // });

            $('#fillPinfo .uploadBtn,#fillPinfo .close').on('click', function () {
                $('.shadowPopBox').addClass('hide');
                $('#fillPinfo').addClass('hide');
                $('#company').focus();
                $('.saveBtn').removeClass('disabledSubmit');
                $('.shadowPopBox').attr('style', 'opacity:0;filter:alpha(opacity=0);background-color:#fff');
                if (!hasTerm) {
                    self.showInvite();
                }
            });

            $view.on('click', '.js_invite', function () {
                self.showInvite();
            })

            $view.on('click', '.invite_product li', function () {
                var me = $(this);
                var idx = me.index();
                var ostype = ['windows', 'android'][idx];
                me.addClass('active').siblings().removeClass('active');
                if (op.invite_down_info) {
                    var url = op.invite_down_info[ostype]['url'];
                    $('.invite_down').attr('src', url).text(url);
                    if (ostype == 'windows') {
                        $('.invite_wx_qr .win').show();
                        $('.invite_wx_qr .and').hide();
                    } else {
                        $('.invite_wx_qr .win').hide();
                        $('.invite_wx_qr .and').show();
                    }
                }
            })

            $view.on('click', '.invite_icon', function () {
                if ($(this).hasClass('.disable')) {
                    return false;
                }
                var me = $(this);
                var idx = me.index('.invite_icon');
                var ostype = ['windows', 'android'][$('.invite_product li.active').index()];
                me.addClass('active').siblings().removeClass('active');
                if (idx == 0) {
                    op.getInviteQQ(ostype);
                }
                if (idx == 1) {
                    op.getInviteWX(ostype);
                }
                if (idx == 2) {
                    op.getInviteMail();
                }
            })

            $view.on('click', '.invite_mail_btn', function () {
                var me = $(this);
                if (me.hasClass('disable') || me.hasClass('disabled') || me.hasClass('process')) {
                    return false;
                }
                me.addClass('process');
                RsCore.ajax('Mycenter/sendShareEmail', {
                    emails: $('.invite_mail_txt').val(),
                    ostype: ['windows', 'android'][$('.invite_product li.active').index()]
                }, function (data) {
                    $('.invite_mail_msg .succ').show();
                }, function () {
                    me.removeClass('process');
                }, function (data, code, msg) {
                    $('.invite_mail_msg .err').text(msg).show();
                });
            })

            $view.on('keyup', '.invite_mail_txt', function () {
                if ($(this).val().length == 0) {
                    $('.invite_mail_btn').addClass('disabled')
                } else {
                    $('.invite_mail_btn').removeClass('disabled')
                }
            })

            $view.on('click', '.js_invite_step01 input', function () {
                $('.js_invite_step02').show();
                $('.js_invite_step01').hide();
            })

        },
        OPenWindow: function (URL) {
            var openUrl = URL; //弹出窗口的url
            var iWidth = 630; //弹出窗口的宽度;
            var iHeight = 580; //弹出窗口的高度;
            var iTop = (window.screen.availHeight - 30 - iHeight) / 2; //获得窗口的垂直位置;
            var iLeft = (window.screen.availWidth - 10 - iWidth) / 2; //获得窗口的水平位置;
            window.open(openUrl, "", "height=" + iHeight + ", width=" + iWidth + ", top=" + iTop + ", left=" + iLeft + "" + ",toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
            //window.open('page.html', 'newwindow', 'height=580, width=650, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
        },
        getInviteQQ: function (ostype) {
            $('.invite_wx_qr').hide();
            $('.invite_mail_msg').hide();
            $('.invite_wx_qr .win').hide();
            $('.invite_wx_qr .and').hide();
            var tqq = 'http://share.v.t.qq.com/index.php?c=share&a=index&url={url}&title={title}&appkey=801cf76d3cfc44ada52ec13114e84a96';
            this.OPenWindow(tqq.replace('{url}', this.invite_down_info[ostype]['url']).replace('{title}', '瑞信安全云客户端下载'));
        },
        getInviteWX: function (ostype) {
            $('.invite_wx_qr').show();
            $('.invite_mail_msg').hide();
            if (ostype == 'windows') {
                $('.invite_wx_qr .win').show();
                $('.invite_wx_qr .and').hide();
            } else {
                $('.invite_wx_qr .win').hide();
                $('.invite_wx_qr .and').show();
            }
        },
        getInviteMail: function () {
            $('.invite_wx_qr').hide();
            $('.invite_wx_qr .win').hide();
            $('.invite_wx_qr .and').hide();
            $('.invite_mail_msg').show();
        },
        showInvite: function () {
            $('.js_invite_box').modal('show');
            this.getInviteInfo();
            $('.invite_copy').zclip({
                path: static_path + '../dep/zclip/ZeroClipboard.swf',
                copy: function () {
                    return $('.invite_down').attr('src');
                }
            })
        },
        getInviteInfo: function () {
            // 获取下载信息
            var self = this;
            RsCore.ajax('Mycenter/getDownloadUrl', function (data) {
                if (data) {
                    self.invite_down_info = data;
                    self.getWXpic();
                    self.getDownUrl();
                    $('.invite_step02_wrap .disable').removeClass('disable');
                }
            });
        },
        getWXpic: function () {
            var self = this;
            var tempURL = 'http://qr.liantu.com/api.php?text={url}';
            $('.invite_wx_qr .win').attr('src', tempURL.replace('{url}', self.invite_down_info['windows']['url']));
            $('.invite_wx_qr .and').attr('src', tempURL.replace('{url}', self.invite_down_info['android']['url']));
        },
        getDownUrl: function () {
            var ostype = ['windows', 'android'][$('.invite_product li.active').index()];
            var url = op.invite_down_info[ostype]['url'];
            $('.invite_down').attr('src', url).text(url);
        }

    };
    return {
        container: '.rs-page-container',
        render: function (container, paramStr) {
            document.title = '我的中心-账户信息';
            op.init(container, paramStr);
        },
        destroy: function () {
            $(this.container).off().empty();
        }
    };
});