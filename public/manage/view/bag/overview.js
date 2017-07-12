define(function (require) {
    var tpl = require('text!bag/overview.html');
    var mustache = require('mustache');
    require('colResizable');
    require('table');
    require('css!table');
    require('util_b');
    require('selectric');
    require('css!selectric');
    var common = require('common');
    var getUrlSearchQuerys = RsCore.assist.getUrlSearchQuerys;
    var params2str = RsCore.assist.params2str;
    var op = {

        init: function (container, type, first) {
            var view = $(container);
            var html = '';
            var dataobj = {};
            dataobj[op._type] = true;
            html = mustache.render(tpl, dataobj);
            view.html(html);
            op.initHisTerm();

            $('.upload_btn').on("click",op.initEvent);
            
            view.on('change', '.packages_file input', function () {
                var val = $(this).val();
                $(this).closest('.plat_form').find('.js_seriseFile').val(val);
            })
        },
        initEvent: function () {
            var form = $('.up_packages').find('form');
            var platform = $('#platform').val();
            var base = $('#base').val();
            var platFormValue = form.serialize();
            form.ajaxSubmit({
                url: 'Packages/uploadPackages',
                dataType:"json",
                type: "post",
                data: platFormValue,
                beforeSend: function(){
                    // if($.trim(platform) == ''){
                    //     alert('请选择系统')
                    // }
                    if($.trim(base) == ''){
                        alert('请上传文件')
                    }
                    $('.upload_btn').addClass('process');
                    $('.upload_btn').html('<i class="mr5"></i>上传中...');
                    $('.upload_btn').off("click",op.initEvent);
                },
                success: function (data, textStatus) {
                    if(data.r.msg){
                        alert(data.r.msg);
                    }else{
                        alert("上传成功！");
                    }
                    op.initHisTerm();
                },
                complete: function () {
                    $('.upload_btn').removeClass('process');
                    $('.upload_btn').html('上传');
                    $('.upload_btn').on("click",op.initEvent);
                },
                error: function () {
                    alert('上传错误');
                }
            });
            return false;
        },
        initHisTerm: function () {
            var html = [];
            html.push('<tr>');
            html.push('<td>{{platform}}</td>');
            html.push('<td>{{name}}</td>');
            html.push('<td>{{uploadtime}}</td>');
            html.push('</tr>');
            RsCore.ajax({
                url: 'Packages/getPackages',
                type: 'get',
                dataType: "json",
                success: function (data) {
                    var da = data;
                    var _html = [];
                    if (da.length == 0) {
                        return false;
                    }
                    for (var i = 0; i < da.length; i++) {
                        var _da = da[i];
                        _da['name'] = _da['name'] == null ? '无' : _da['name'];
                        _da['uploadtime'] = _da['uploadtime'] == false ? '无' : _da['uploadtime'];
                        _html.push(mustache.render(html.join(''), _da))
                    }

                    $('.packages_now tbody').html(_html.join(''));
                }
            })
        }
    };
    return {
        container: '.c-page-content',
        render: function (container) {
            document.title = '包管理-上传安装包';
            op.init(container, null, true);

        },
        destroy: function () {
            $(this.container).find('#tbClient').colResizable({
                'disable': true
            });
            $(window).off('resize.log');
            $(this.container).off().empty();
        }
    };
});