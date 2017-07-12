define(function (require) {
    var tpl = require('text!sys/overview.html');
    var mustache = require('mustache');
    require('jqueryForm');
    require('cropper');
    require('css!cropper');
    require('slimscroll');
    require('selectric');
    require('customMethods');
    require('css!selectric');
    require('zclip');
    var phone = /^1[3|4|5|7|8][0-9]{9}$/;
    var email = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    var tel = /^[0-9][0-9-]{6,16}$/;
    var zcode = /^[1-9][0-9]{5}$/;
    var $view = null;
    var isSubmit = [true, true, true, true, true, true];
    var icount = 0;
    var oType = 1;
    var jcrop_api = null;
    var rand = Math.floor(Math.random() * (9999999 - 1111111 + 1) + 1111111);
    var iscurrent = 0;
    var logoIsSubmit = false;
    var avtImgIsSubmit = false;
    var userInfoDetail = {} //$.parseJSON($(".userInfo").text());
    var hasTerm = false;

    var op = {
        nowUseInfo: null,
        invite_down_info: null,
        init: function (container, paramStr) {
            var param = RsCore.assist.str2json(paramStr);
            var self = this;
            var html = '';
            $view = $(container);
            html = mustache.render(tpl, {
                static_path: static_path,
                invite_text: '马上邀请同事加入'
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
                window.location.href = 'index#settings/' + $(this).data('current') + '?' + join(params);
            });

            $view.find('.userCenter').slimScroll({
                height: $view.height(),
                size: '4px',
                alwaysVisible: true
            });

            this.userInfo('Systemconfig/getSystenInfo');
            //this.authInfo('mycenter/accreditinfo');
            //this.clientAuthInfo('mycenter/clientaccreditstatus');
            //this.storeInfo('mycenter/usedspace');
            this.initEvent();
        },


        //图片上传
        webUpload: function (opt) {
            if (opt.form == '#logoForm') {
                if (!fileType($(opt.logo).val())) {
                    return;
                }
                $(opt.form).attr('action', '/Systemconfig/uploadlogopreview');
                $(opt.form).off('submit').submit(function () {
                    $(this).ajaxSubmit({
                        type: 'post',
                        dataType: 'json',
                        url: '/Systemconfig/uploadlogopreview',
                        success: function (data) {
                            var options = null;
                            if (data.r.msg == '成功') {
                                $(opt.container).removeClass('hide');
                                $('.loadding').removeClass('hide');
                                $('#target').attr('src', '/Systemconfig/getlogopreview?' + new Date().getTime());
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
                            RsCore.msg.warn('上传失败');
                        }
                    });
                    return false;
                });
                $(opt.form).trigger('submit');
            } else {
                if (!fileType($(opt.logo).val())) {
                    return;
                }
                $(opt.form).attr('action', '/Systemconfig/uploadlogopreview');
                $(opt.form).off('submit').submit(function () {
                    $(this).ajaxSubmit({
                        type: 'post',
                        dataType: 'json',
                        url: '/Systemconfig/uploadlogopreview',
                        success: function (data) {
                            var options = null;
                            if (data.r.msg == '成功') {
                                $(opt.container).removeClass('hide');
                                $('.loadding').removeClass('hide');
                                $('.shadowPopBox').removeClass('hide');
                                $('#atarget').attr('src', '/Systemconfig/getlogopreview?' + new Date().getTime());
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
                            RsCore.msg.warn('上传失败');
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
                        $('#ulogo img').attr('src', '/Systemconfig/getlogo?' + new Date().getTime());
                        $('#logo').replaceWith('<input type="file" value="" accept=".jpg,.gif,.png" capture="camera" name="logo" id = "logo" class="webuploader-element-invisible" multiple="multiple">');
                    } else if (opt.targetImg == '#atarget') {
                        avtImgIsSubmit = false;
                        $('#avtForm')[0].reset();
                        $('#avtor img').removeAttr('style');
                        $('#avtor img').attr('src', '/Systemconfig/getuserlogo?' + new Date().getTime());
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
                        $('.saveBtn').addClass('saveButten');
                    } else if (opt.targetImg == '#atarget') {
                        avtImgIsSubmit = true;
                        $('.saveBtn').removeClass('disabledSubmit');
                        $('.saveBtn').addClass('saveButten');
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

            var strCheckUrl = '^((https|http)?://)'
                + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184 
                + '|' // 允许IP和DOMAIN（域名） 
                + '([0-9a-z_!~*\'()-]+\.)*'// 域名- www 
                + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名 
                + '[a-z]{2,6})' // first level domain- .com or .museum 
                + '(:[0-9]{1,4})?' // 端口- :80 
                + '((\/\?)|'
                + '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$';
            var checkUrl = new RegExp(strCheckUrl);
            var checkTitle = /^[a-zA-Z0-9\u4e00-\u9fa5]{3,20}$/;
            var checkSubTitle = /^[a-zA-Z0-9\u4e00-\u9fa5]{0,20}$/;
            var title = $.trim($('#title').val());
            var subTitle = $.trim($('#subTitle').val());
            var domainUrl = $.trim($('#domainUrl').val())
            if (!checkTitle.test(title)) {
                $('#title').siblings('.errorTip').text('主标题由数字、字母、汉字组成且长度为3~20位');
                return;
            } else {
                $('#title').siblings('.errorTip').text('');
            }
            if (!checkSubTitle.test(subTitle)) {
                $('#subTitle').siblings('.errorTip').text('副标题由数字、字母、汉字组成且长度为0~20位');
                return;
            } else {
                $('#subTitle').siblings('.errorTip').text('');
            }
            if (!checkUrl.test(domainUrl)) {
                $('#domainUrl').siblings('.formTip').text('');
                $('#domainUrl').siblings('.errorTip').text('域名格式错误，格式:http://xxx.xxx.xxx.xxx或https://xxx.xxx.xxx.xxx');
                return;
            } else {
                $('#domainUrl').siblings('.formTip').text('格式:http://xxx.xxx.xxx.xxx或https://xxx.xxx.xxx.xxx');
                $('#domainUrl').siblings('.errorTip').text('');

            }



            data = {
                title: title,
                subTitle: subTitle,
                domainUrl: domainUrl,
            };

            // if ($.trim($('#title').val()).length == 0) {
            //     $('#company').addClass('error').siblings('.errorTip').html('主标题不能为空').addClass('red');
            // } else {
            //     $('#company').removeClass('error').siblings('.errorTip').html('').removeClass('red');
            uplogo(function () {
                RsCore.ajax({
                    url: url,
                    data: data,
                    success: function (data, code, msg) {
                        if (msg == '修改成功') {
                            $('.rs-page-header h1').text($('#title').val());
                            $('.rs-page-header h5').text($('#subTitle').val());
                            icount++;
                            $('.saveBtn').addClass('disabledSubmit');
                            $('.saveBtn').removeClass('saveButten');

                            $('.iknow').parent().hide();

                            $('.disabledEdit').removeClass('hide');
                            self.userInfo('Systemconfig/getSystenInfo');
                            RsCore.msg.warn('修改成功');
                        }
                    }
                })
            });

            // }




            function uplogo(fn) {
                if ($('#ulogo img').attr('src').indexOf('logon.png') != -1 && iscurrent == 0) {
                    RsCore.ajax({
                        url: 'Systemconfig/resetLogo',
                        success: function (data, r, msg) {
                            if (msg == '成功') {
                                $('.rs-page-logo img').attr('src', '/Systemconfig/getlogo?' + new Date().getTime());
                                $('.restoreDefault').addClass('hide');
                            }
                        },
                        complete: function () {
                            fn && fn();
                        }
                    });
                } else {
                    $('#logoForm').attr('action', '/Systemconfig/uploadlogo');
                    rand++;
                    if (logoIsSubmit) {
                        $('#logoForm').ajaxSubmit({
                            success: function () {
                                $('#logoForm')[0].reset();
                                $('#logo').replaceWith('<input type="file" value="" accept=".jpg,.gif,.png" capture="camera" name="logo" id = "logo" class="webuploader-element-invisible" multiple="multiple">');
                                $('#ulogo img').attr('src', '/Systemconfig/getlogo?' + rand);
                                $('<img/>').attr('src', '/Systemconfig/getlogo?' + rand).load(function () {
                                    $('.rs-page-logo img').attr('src', '/Systemconfig/getlogo?' + rand);
                                });
                                $('#ulogo img').removeAttr('style');
                                logoIsSubmit = false;
                            }, complete: function () {
                                fn && fn();
                            }
                        });
                    } else {
                        fn && fn();
                    }
                }
            }
        },

        //修改密码
        midPwd: function (url, ele, closeBtn, cancelBtn) {
            var aid = ['oldPwd', 'newPwd', 'confirmPwd'];
            var tip = ['密码不能为空', '两次密码不一致', '密码长度不小于6位'];
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
                minLen: 6,
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
                        url: 'Systemconfig/modifyPassWd',
                        data: {
                            pwd1: oldpwd,
                            newpwd1: newPwd,
                            newpwd2: newPwd,
                        },
                        type: 'post',
                        success: function (data) {
                            data = JSON.parse(data);
                            if (data.r.code == 0) {
                                RsCore.msg.success('修改密码成功');
                                $(ele).eq(0).addClass('hide');
                                $('.shadowPopBox').addClass('hide');
                            } else if (data.r.code == 1) {
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

                    if (isLow && newPwd.length >= 6) {
                        $('#newPwd').siblings('.tip').text('密码强度过低,由字母(区分大小写),数字,符号组成');
                        $('#newPwd').addClass('error');
                    } else if (isLow && newPwd.length < 6) {
                        $('#newPwd').siblings('.tip').text(tip[2]);
                        $('#newPwd').addClass('error');
                    } else if (newPwd.length < 6) {
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
                        if (newPwd.length >= 6 && confirmPwd.length >= 6) {
                            isEq = isEqual(newPwd, confirmPwd);
                        } else {
                            isEmpty(newPwd);
                        }

                        break;
                    case aid[2]:
                        confirmPwd = $.trim(e.target.value);
                        if (confirmPwd.length >= 6 && newPwd.length >= 6) {
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
                        if (val.length < 6) {
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
                    if (val1 != '' && val2 != '' && val2.length >= 6 && val1.length >= 6) {
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
                    if (val.length >= 6) {
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
            //RsCore.ajax(url, function (data) {
            RsCore.ajax({
                url: url,
                success: function (data) {

                    op.nowUseInfo = data;
                    oType = data.oType;

                    //$('.disabledEdit').addClass('hide');
                    for (var i in data) {
                        if (i == 'logoImg')
                            continue;

                        if (i == 'islogo') {
                            if (!(data[i] == '' || data[i] == null)) {
                                $('.restoreDefault').removeClass('hide');
                                $view.on('click', '.restoreDefault', function () {
                                    $('#ulogo img').removeAttr('style');
                                    $('.saveBtn').removeClass('disabledSubmit');
                                    $('.saveBtn').addClass('saveButten');
                                    $('#ulogo img').attr('src', '/public/auth/uploads/logon.png');
                                    $('.restoreDefault').addClass('hide');
                                    iscurrent = 0;
                                });
                            }
                            continue;
                        }

                        if (i == 'domainUrl') {
                            $('#' + i).val(data[i]);
                            $('#' + i).parents('li').find('.disabledEdit').html(data[i] + '<i class="edit"></i>');
                        }


                        if (data[i] == null) {
                            $('#' + i).val(data[i]);
                            $('#' + i).parents('li').find('.disabledEdit').html('' + '<i class="edit"></i>');
                        } else {
                            $('#' + i).val(data[i]);
                            $('#' + i).parents('li').find('.disabledEdit').html(data[i] + '<i class="edit"></i>');
                        }

                    }



                    $view.off('click', '.saveButten').on('click', '.saveButten', function () {
                        self.submitUserInfo('Systemconfig/updateSystemConfig');
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

                    $view.on('click', '.edit', function () {
                        $('.saveBtn').removeClass('disabledSubmit');
                        $('.saveBtn').addClass('saveButten');
                        $(this).parent().siblings('input,select').removeClass('disabled').removeAttr('disabled');
                        $(this).siblings('input,select').removeClass('disabled').removeAttr('disabled');
                        $(this).parents('.disabledEdit').addClass('hide');
                        $(this).addClass('hide');
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
                }
            });
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
                    url: '/Systemconfig/uploadlogo',
                    form: '#logoForm',
                });
            });


            $view.on('click', '.midPassword', function () {
                self.midPwd('Systemconfig/modifypwd', '.uc-mid-pwd', '.uc-mid-pwd .cancelBtn', '.uc-mid-pwd .close');
            });

            $view.on('click', '.js_invite_step01 input', function () {
                $('.js_invite_step02').show();
                $('.js_invite_step01').hide();
            })
        }

    };
    return {
        container: '.rs-page-container',
        render: function (container, paramStr) {
            document.title = '系统设置-账号信息';
            op.init(container, paramStr);
        },
        destroy: function () {
            $(this.container).off().empty();
        }
    };
});