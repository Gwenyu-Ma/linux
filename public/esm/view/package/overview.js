define(function (require) {
    var tpl = require('text!package/overview.html');
    var mustache = require('mustache');
    require('colResizable');
    require('table');
    require('jqueryForm');
    require('css!table');
    require('util_b');
    require('selectric');
    require('css!selectric');
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

            $('.upload_btn').on("click",function () {
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
                    },
                    success: function (data, textStatus) {
                        if(data.r.msg){
                            alert(data.r.msg);
                        }else{
                            alert("上传成功！");
                        }
                        op.initHisTerm();
                    }
                });
                return false;
            });
            view.on('change', '.packages_file input', function () {
                var val = $(this).val();
                $(this).closest('.plat_form').find('.js_seriseFile').val(val);
            })
        },
        initHisTerm: function () {
            var html = [];
            html.push('<tr>');
            html.push('<td>{{platform}}</td>');
            html.push('<td>{{name}}</td>');
            html.push('<td>{{uploadtime}}</td>');
            html.push('<td>{{sysname}}</td>');
            html.push('</tr>');
            RsCore.ajax('Packages/getPackages', function (data) {
                    var da = data;
                    var _html = [];
                    if (da.length == 0) {
                        return false;
                    }
                    // var platform = da.platform
                    // RsCore.ajax('Packages/getEidsList', function (data) {
                    //     if(platform == window){
                    //         _da['sysname'] = data[0].window_name;
                    //     }
                    //     if(platform == linux){
                    //         _da['sysname'] = data[0].linux_name;
                    //     }
                    // })
                    for (var i = 0; i < da.length; i++) {
                        var _da = da[i];
                        _da['name'] = _da['name'] == null ? '无' : _da['name'];
                        _da['uploadtime'] = _da['uploadtime'] == false ? '无' : _da['uploadtime'];
                        _da['sysname'] = _da['sysname'] == null ? '无' : _da['sysname'];
                        _html.push(mustache.render(html.join(''), _da))
                    }

                    $('.packages_now tbody').html(_html.join(''));
                }
            )
        }
    };
    return {
        container: '.c-page-content',
        render: function (container) {
            document.title = '包管理-上传新包';
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