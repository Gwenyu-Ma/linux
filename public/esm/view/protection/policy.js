define(function (require) {
    var tpl = require('text!protection/policy.html');
    var getUrlSearchQuerys = RsCore.assist.getUrlSearchQuerys;
    require('selectric');
    require('css!selectric');
    require('datetimepicker');
    require('css!datetimepicker');
    require('slimscroll');
    require('dep/jquery.md5');
    require('dep/jquery.fix.clone');

    var op = {
        view: null,
        ruleList: [{
            'ID': '{057F52B5-3E20-41C3-9E01-97CA75B4A006}',
            'Name': 'Adobe Flash Player远程代码执行漏洞',
            'bInuse': '1'
        }, {
            'ID': '{47B91BDA-4F47-4D50-873D-51A24FD8F488}',
            'Name': '浏览器攻击：Windows ANI动态光标远程代码执行漏洞',
            'bInuse': '1'
        }, {
            'ID': '{CC3F625B-8163-4179-8DC5-36D1F0964FDF}',
            'Name': '浏览器攻击：Microsoft Office 远程代码执行漏洞 II',
            'bInuse': '1'
        }, {
            'ID': '{02D5F181-C256-4DF5-85FF-D4BE047871FB}',
            'Name': '浏览器攻击：RealPlayer远程代码执行漏洞',
            'bInuse': '1'
        }, {
            'ID': '{0045B70F-A1B8-44BF-BC1A-0F363AF310DA}',
            'Name': '浏览器攻击：RealPlayer 远程执行代码漏洞-变种II',
            'bInuse': '1'
        }, {
            'ID': '{FAD02235-563A-4AF2-B78F-6B7F9D70A6A3}',
            'Name': '浏览器攻击：暴风影音II ActiveX远程代码执行漏洞',
            'bInuse': '1'
        }, {
            'ID': '{B38C7840-7082-46C6-B39A-59AB98A4CFAC}',
            'Name': '浏览器攻击：迅雷看看 ActiveX远程代码执行漏洞',
            'bInuse': '1'
        }, {
            'ID': '{69858E60-400A-4C94-8A79-4E49EB198CF9}',
            'Name': '浏览器攻击：联众世界ActiveX 远程代码执行漏洞',
            'bInuse': '1'
        }, {
            'ID': '{680A81EE-CBEA-4613-B2A5-7A0FBB2BF619}',
            'Name': '浏览器攻击：Microsoft MDAC 远程代码执行漏洞',
            'bInuse': '1'
        }, {
            'ID': '{BE70EAA7-5CFF-4B0B-9A52-8523F11F0E7A}',
            'Name': '浏览器攻击：Microsoft MDAC 远程代码执行漏洞 -变种II',
            'bInuse': '1'
        }, {
            'ID': '{93D67BC9-4D16-453B-97FB-C540E72A957E}',
            'Name': '浏览器攻击：新浪ActiveX远程执行代码漏洞',
            'bInuse': '1'
        }, {
            'ID': '{8E1F9884-6179-4F27-AB9E-9868C925952D}',
            'Name': '浏览器攻击：PPLIVE ActiveX远程执行代码漏洞',
            'bInuse': '1'
        }, {
            'ID': '{44CE7DAC-0199-49BC-A6C3-9D10C7343597}',
            'Name': '浏览器攻击：百度搜霸ActiveX 远程执行代码漏洞',
            'bInuse': '1'
        }, {
            'ID': '{ADE3EEC5-8BC3-4EE6-9980-0D32BC2060E9}',
            'Name': '浏览器攻击：Qvod播放器 ActiveX 远处代码执行漏洞',
            'bInuse': '1'
        }, {
            'ID': '{F6222637-5A1D-4CB8-B14B-37F5BD1DACB7}',
            'Name': '浏览器攻击：Opera浏览器远程执行代码漏洞',
            'bInuse': '1'
        }, {
            'ID': '{D56CD9C0-DD56-41ED-93EB-3EB217E63CBB}',
            'Name': '浏览器攻击：JetAudio播发器ActiveX远处代码执行漏洞',
            'bInuse': '1'
        }, {
            'ID': '{C72A0D37-F7DD-4C9A-A342-CD5A3601BA8E}',
            'Name': '浏览器攻击：Windows  Media Player远程代码执行漏洞',
            'bInuse': '1'
        }, {
            'ID': '{F3E4CE22-17F4-4661-8658-ED73A756CD01}',
            'Name': '浏览器攻击：微软Works 文件转换器远程代码执行漏洞',
            'bInuse': '1'
        }, {
            'ID': '{50293A8A-6F33-4302-A726-E1ECF3A2F371}',
            'Name': '浏览器攻击：MPEG-2视频远程代码执行漏洞III',
            'bInuse': '1'
        }, {
            'ID': '{03750E7C-563B-4113-ACD8-35686D4AE980}',
            'Name': '浏览器攻击：Yahoo! ActiveX远程执行代码漏洞',
            'bInuse': '1'
        }, {
            'ID': '{825C33FD-6AA7-4BDC-8CC4-953A73E40914}',
            'Name': '浏览器攻击：超星阅读器ActiveX远程代码执行漏洞',
            'bInuse': '1'
        }, {
            'ID': '{CDC1FE21-9476-4D91-9C1C-0BE9E79A1B3A}',
            'Name': '浏览器攻击：Windows Media Encoder 9 ActiveX远程执行代码漏洞',
            'bInuse': '1'
        }, {
            'ID': '{00D5DAD8-3401-48E9-BE34-0A76DC64F1B2}',
            'Name': '浏览器攻击：Windows Media Encoder 9 ActiveX远程执行代码漏洞  变种II',
            'bInuse': '1'
        }, {
            'ID': '{5D9417F9-03A1-4C86-A59F-6B613D927B4B}',
            'Name': '浏览器攻击：Windows Media Encoder 9 ActiveX远程执行代码漏洞  变种III',
            'bInuse': '1'
        }, {
            'ID': '{4DBCB58F-134F-47D1-A95F-74615F76E638}',
            'Name': '浏览器攻击：JPEG图片 (GDI+)远程代码执行漏洞',
            'bInuse': '1'
        }, {
            'ID': '{B058A9F3-4ED0-4473-99BA-8DC6D3DE02F1}',
            'Name': '浏览器攻击：大规模爆发性网马群 I',
            'bInuse': '1'
        }, {
            'ID': '{BA4FAF06-41FB-41F1-80AB-7F1A9B343E85}',
            'Name': '浏览器攻击：大规模爆发性网马群 II',
            'bInuse': '1'
        }, {
            'ID': '{1CC54BAC-3442-4916-9A7A-0159A6A73E2A}',
            'Name': '浏览器攻击：大规模爆发性网马群 III',
            'bInuse': '1'
        }, {
            'ID': '{57ED89C9-A7FF-4C47-A33F-DFE2B824114B}',
            'Name': '浏览器攻击：大规模爆发性网马群 IV',
            'bInuse': '1'
        }, {
            'ID': '{EE69C949-A190-4EB3-A8C3-CD4B99666626}',
            'Name': '浏览器攻击：大规模爆发性网马群 V',
            'bInuse': '1'
        }, {
            'ID': '{FBCF3330-F1EE-4742-A470-D882B11D6139}',
            'Name': '浏览器攻击：大规模爆发性网马群 VI',
            'bInuse': '1'
        }, {
            'ID': '{3A8111C1-289D-4CA4-8F67-A3B6C3F73F73}',
            'Name': '浏览器攻击：大规模爆发性网马群 VII',
            'bInuse': '1'
        }, {
            'ID': '{CCBF3CEB-51A8-4370-9B24-C309EBE9BA27}',
            'Name': '浏览器攻击：大规模爆发性网马群 VIII',
            'bInuse': '1'
        }, {
            'ID': '{A77A2012-FABE-4666-AACB-AE783A85424A}',
            'Name': '浏览器攻击：大规模爆发性网马群 IX',
            'bInuse': '1'
        }, {
            'ID': '{7FCB67BF-AF21-4581-95B7-1570571C42DA}',
            'Name': '浏览器攻击：大规模爆发性网马群 X',
            'bInuse': '1'
        }, {
            'ID': '{9DF441DA-672A-4D04-BA00-2114E93F21EA}',
            'Name': '浏览器攻击：大规模爆发性网马群 XI',
            'bInuse': '1'
        }, {
            'ID': '{D7488E68-76F5-4FE6-8BCA-179A71983EF7}',
            'Name': '浏览器攻击：大规模爆发性网马群 XII',
            'bInuse': '1'
        }, {
            'ID': '{45763441-A05C-403C-B910-DF8DAFF5DAF2}',
            'Name': '浏览器攻击：大规模爆发性网马群 XIII',
            'bInuse': '1'
        }, {
            'ID': '{6E3BE8E6-6C28-41AB-A78A-8447BC27A5A8}',
            'Name': '浏览器攻击：微软GDI+远程代码执行漏洞(MS08-052)',
            'bInuse': '1'
        }, {
            'ID': '{0ACBA7DD-AA40-46A8-9E7A-532C5818BF4A}',
            'Name': '浏览器攻击：微软GDI+远程代码执行漏洞(MS08-021)',
            'bInuse': '1'
        }, {
            'ID': '{077F4889-B77F-45A5-AEEE-6562EC7B4BCA}',
            'Name': '浏览器攻击：Adobe Flash Player远程代码执行漏洞-变种II',
            'bInuse': '1'
        }, {
            'ID': '{4E2B5E16-5A71-4DAD-8CDC-9F9ACF71846C}',
            'Name': '浏览器攻击：IE7.0 初始化内存远程执行代码漏洞(MS09-002)',
            'bInuse': '1'
        }, {
            'ID': '{997CB239-ABE9-4F57-848F-8F10F3C33877}',
            'Name': '浏览器攻击：DirectShow 远程代码执行漏洞',
            'bInuse': '1'
        }, {
            'ID': '{D8F77733-8684-4723-9D0C-4D6177153688}',
            'Name': '浏览器攻击：MPEG-2视频远程代码执行漏洞',
            'bInuse': '1'
        }, {
            'ID': '{7994A783-1CBB-48C2-9928-0EDAD45913BD}',
            'Name': '浏览器攻击：MPEG-2视频远程代码执行漏洞II',
            'bInuse': '1'
        }, {
            'ID': '{95D87BDA-F0E1-4E9B-9BD3-E546D03430DA}',
            'Name': '远程溢出：SMB共享服务攻击',
            'bInuse': '1'
        }, {
            'ID': '{E5D4F304-B4BB-4A89-B88D-42D378B9D6BD}',
            'Name': '远程溢出： Serv-U SITE CHMOD 命令超长文件名漏洞攻击',
            'bInuse': '1'
        }, {
            'ID': '{C5959B23-FFC9-4AB5-9821-5290D236904E}',
            'Name': '远程溢出：Serv-U MDTM 命令漏洞攻击',
            'bInuse': '1'
        }, {
            'ID': '{1929AC3F-6F95-4E97-87AB-2F8D12D0335F}',
            'Name': '远程溢出：Microsoft IIS .IDA / .IDQ ISAPI漏洞攻击',
            'bInuse': '1'
        }, {
            'ID': '{D88A09AB-D097-4EBD-87FB-058D7E0D1221}',
            'Name': '远程溢出：Real Server 漏洞攻击',
            'bInuse': '1'
        }, {
            'ID': '{51BEA12A-94D9-4196-9DB6-1EAC9C441D4F}',
            'Name': '远程溢出：IIS 5.0 .printer 漏洞攻击',
            'bInuse': '1'
        }, {
            'ID': '{D20E1C54-BF48-44B4-9346-80399C74F48B}',
            'Name': '远程溢出：Flashget FTP PWD漏洞攻击',
            'bInuse': '1'
        }, {
            'ID': '{E8DD8333-49E1-46CF-8E2D-CFE3696403A5}',
            'Name': '远程溢出：Apache Tomcat Unicode目录遍历漏洞攻击',
            'bInuse': '1'
        }, {
            'ID': '{04900DAF-F3DB-4DF4-B9DB-2BD66E639E9B}',
            'Name': '远程溢出：TFTP Server for Windows ST 漏洞攻击',
            'bInuse': '1'
        }, {
            'ID': '{E84AD5B3-E1D4-43AF-B1AE-1C8EA71B2BFC}',
            'Name': '远程溢出：RPC消息队列服务漏洞攻击',
            'bInuse': '1'
        }, {
            'ID': '{8A4CECCC-EAA1-4FCA-9D3C-080A85B9EDDD}',
            'Name': '远程溢出：Windows LSA服务漏洞攻击',
            'bInuse': '1'
        }, {
            'ID': '{93781480-58A9-4C0B-92C8-1834726C5F13}',
            'Name': '远程溢出：Workstation服务漏洞攻击',
            'bInuse': '1'
        }, {
            'ID': '{501A1990-FCA1-4D72-8E7D-308DD38A88D9}',
            'Name': '远程溢出：Quick TFTP漏洞攻击',
            'bInuse': '1'
        }, {
            'ID': '{3941A4DA-1D82-44A8-B2EB-7EEB6F519BC9}',
            'Name': '远程溢出：Quicktime 播放器漏洞攻击',
            'bInuse': '1'
        }, {
            'ID': '{7DF03D54-7681-439B-BDEB-458EAFAA2F08}',
            'Name': '远程溢出：IIS 网站内容进行访问绕过漏洞',
            'bInuse': '1'
        }, {
            'ID': '{0A96642E-3373-4EFE-8EFB-FD045F83F001}',
            'Name': '远程溢出：SMB共享服务攻击（MS08-067）',
            'bInuse': '1'
        }, {
            'ID': '{3051AE79-38D2-4B9C-8A6F-76F3C68248A4}',
            'Name': '远程溢出：微软RPC DCOM接口超长主机名漏洞',
            'bInuse': '1'
        }, {
            'ID': '{ADE353C6-64D6-4831-A15C-FE59BBA27365}',
            'Name': '远程溢出：SMB共享服务攻击（MS08-067）变种',
            'bInuse': '1'
        }, {
            'ID': '{8BA3EEAB-73EE-4AF7-A3F4-C02BD7CFEEFB}',
            'Name': '远程溢出：Microsoft IIS FTP漏洞攻击',
            'bInuse': '1'
        }, {
            'ID': '{3B56DCA3-7514-493D-8DC1-BF48F07E948A}',
            'Name': '蠕虫传播：2003蠕虫王攻击',
            'bInuse': '1'
        }, {
            'ID': '{47024A38-AE7F-4E95-A39F-6148DA854F87}',
            'Name': '蠕虫传播：Master Paradise 蠕虫木马(默认端口)',
            'bInuse': '1'
        }, {
            'ID': '{AA507606-BE58-48DE-A339-D1E60D986698}',
            'Name': '蠕虫传播：红色代码蠕虫攻击',
            'bInuse': '1'
        }, {
            'ID': '{576E189A-3CA7-4DBF-9665-9ABCF8DA182D}',
            'Name': '僵尸网络：傀儡僵尸',
            'bInuse': '1'
        }, {
            'ID': '{036384A5-E8EF-47BD-A6F5-8F314623A8AA}',
            'Name': '僵尸网络：Netbot Attacker',
            'bInuse': '1'
        }, {
            'ID': '{722D0477-A045-4900-8A9E-E3410BA8B635}',
            'Name': '僵尸网络：风云压力测试',
            'bInuse': '1'
        }, {
            'ID': '{D3A16FE9-56D0-4462-A5FF-F6626227E49A}',
            'Name': '木马后门：灰鸽子(命令者)',
            'bInuse': '1'
        }, {
            'ID': '{16DF145A-7108-40EE-BFB1-77EABE13E3EA}',
            'Name': '木马后门：灰鸽子(凤凰ABC)',
            'bInuse': '1'
        }, {
            'ID': '{7B1B6886-DCA1-45C7-BACB-726ABC6208B5}',
            'Name': '木马后门：PCSHARE2008',
            'bInuse': '1'
        }, {
            'ID': '{0A1BF819-C266-4E18-8BFD-7345B17BFE77}',
            'Name': '木马后门：幻影远程控制',
            'bInuse': '1'
        }, {
            'ID': '{70F0F07B-239F-4E6B-A553-7365909CEFCF}',
            'Name': '木马后门：黑洞远程控制',
            'bInuse': '1'
        }, {
            'ID': '{031513DC-4E28-4377-8F97-17D6A2ABA944}',
            'Name': '木马后门：灰鸽子',
            'bInuse': '1'
        }, {
            'ID': '{A948935B-60CF-45FC-8525-80E692CF8A5E}',
            'Name': '浏览器攻击：Real Player远程代码执行漏洞',
            'bInuse': '1'
        }, {
            'ID': '{4698CC40-F0C9-4439-930A-7D1518652D94}',
            'Name': '浏览器攻击：中国游戏中心游戏大厅ActiveX 远程执行代码漏洞',
            'bInuse': '1'
        }, {
            'ID': '{53F163D7-2291-471B-80AD-5311DCCF982C}',
            'Name': '浏览器攻击：Microsoft Office 远程代码执行漏洞',
            'bInuse': '1'
        }, {
            'ID': '{76BB5E58-A146-4276-A93E-B9C9117E4933}',
            'Name': '浏览器攻击：大规模爆发性网马群 XI',
            'bInuse': '1'
        }, {
            'ID': '{9D22EEBF-E190-45E4-86F7-67E5879FFCE1}',
            'Name': '木马后门：黑鹰远控',
            'bInuse': '1'
        }, {
            'ID': '{CB04C38B-877D-48B3-B7CF-038932199101}',
            'Name': '木马后门：Gh0st RAT远程控制',
            'bInuse': '1'
        }, {
            'ID': '{455C86F0-154A-452F-B548-949732C46047}',
            'Name': '木马后门：SRAT远程控制',
            'bInuse': '1'
        }, {
            'ID': '{07A0736B-51E7-4322-84D4-3824F6B8B85A}',
            'Name': '木马后门：上兴远程控制',
            'bInuse': '1'
        }, {
            'ID': '{2162A6BD-38F5-451B-81E1-993EE5552177}',
            'Name': '木马后门：DRAT远程控制',
            'bInuse': '1'
        }, {
            'ID': '{68C740F1-D6B1-4590-9BB2-D95A4B5D9411}',
            'Name': '远程溢出：WINS 漏洞攻击',
            'bInuse': '1'
        }, {
            'ID': '{036C845E-1800-40B4-A5C0-1AD7A023E693}',
            'Name': '远程溢出：SMB 漏洞攻击',
            'bInuse': '1'
        }, {
            'ID': '{48B41BF4-375B-4056-8188-B808B9999AB5}',
            'Name': '远程溢出：SMB 漏洞攻击II',
            'bInuse': '1'
        }, {
            'ID': '{CDDB05C0-ACA7-4269-9553-19EA7A68B1B7}',
            'Name': 'IIS WebDAV buffer overflow: CVE-2017-7269 通过内存溢出方式实现命令执行',
            'bInuse': '1'
        }, {
            "ID": "{4128dba1-f8ce-47c5-9dfa-8e65a1142919}",
            "Name": "勒索软件：永恒之石",
            "bInuse": "1"
        }],
        init: function (container, policy) {
            // 绑定事件
            this.view = container;
            this.bindEvent(container);
            this.validationEvent(container);
            // 初始化策略内容
            if (policy['53246C2F-F2EA-4208-9C6C-8954ECF2FA27_1']) {
                this.toHtml(container, policy['53246C2F-F2EA-4208-9C6C-8954ECF2FA27_1']);
            } else {
                this._initRsIpTable(container);
            }

            if (policy['53246C2F-F2EA-4208-9C6C-8954ECF2FA27_2']) {
                this.toHtml2(container, policy['53246C2F-F2EA-4208-9C6C-8954ECF2FA27_2']);
            } else {
                this.initTime(container);
                this.initNetPro(container);
            }

            // 下拉列表美化
            container.find('select').selectric({
                inheritOriginalWidth: true,
                maxHeight: 150
            });

            $('.js_white_wrap').slimscroll({
                height: 88,
                size: '4px'
            });

            container.find(':radio:checked').each(function (i, item) {
                $(item).closest('label').css('color', '#29bcef');
            });


        },
        bindEvent: function (container) {
            // 锁定图标
            container.on('click', 'i.lock', function () {
                $(this).toggleClass('enableLock');
                return false;
            });

            container.on('click', ':radio', function () {
                var that = $(this),
                    name = that.attr('name');
                container.find(':radio[name=' + name + ']').each(function (i, item) {
                    $(item).closest('label').css('color', '#444');
                });
                that.closest('label').css('color', '#29bcef');
            });

            //week 事件
            container.on('click', '.policy-week label', function () {
                var check = $(this).find('input');
                if (check.prop('checked')) {
                    $(this).addClass('active');
                } else {
                    $(this).removeClass('active');
                }
            });


            //防黑客攻击
            container.on('click', '#RsIpRuleList :checkbox', function () {
                var len = $('#RsIpRuleList :checked').length;
                $('#js_totle_RsIpRuleList').text(len);
                $('#js_RsIpRuleList_noOpen').text(op.ruleList.length - len);
            });

            //添加白名单
            container.on('click', '#whiteList_add', function () {
                var txtObj = container.find('#whiteList_txt');
                var url = txtObj.val();
                var exist = false;
                if ($.trim(url) == '') {
                    txtObj.tooltip({
                        title: '内容不能为空',
                        trigger: 'manual'
                    }).tooltip('show');
                    return false;
                } else {
                    txtObj.tooltip('hide');
                }
                container.find('#WhiteUrlList tr').find('>td:first').each(function () {
                    if ($(this).attr('title') == url) {
                        exist = true;
                        txtObj.tooltip({
                            title: '已存在',
                            trigger: 'manual'
                        }).tooltip('show');
                    }
                });
                if (!exist) {
                    txtObj.val('');
                    container.find('#WhiteUrlList').prepend('<tr><td style="width:380px;" title="' + url + '">' + url + '<td width="50"><a href="javascript:;" class="policyDel whiteList_btnRemove">&nbsp;</a>');
                    container.find('#adUrlList .blank:first').remove();
                }
            });
            //添加广告规则
            container.on('click', '#adUrlList_add', function () {
                var txtObj = container.find('#adUrlList_txt');
                var url = txtObj.val();
                var exist = false;
                if ($.trim(url) == '') {
                    txtObj.tooltip({
                        title: '内容不能为空',
                        trigger: 'manual'
                    }).tooltip('show');
                    return false;
                } else {
                    txtObj.tooltip('hide');
                }
                container.find('#adUrlList tr').find('>td:first').each(function () {
                    if ($(this).attr('title') == url) {
                        exist = true;
                        txtObj.tooltip({
                            title: '已存在',
                            trigger: 'manual'
                        }).tooltip('show');
                    }
                });
                if (!exist) {
                    txtObj.val('');
                    container.find('#adUrlList').prepend('<tr><td style="width:380px;" title="' + url + '">' + url + '<td width="50"><a href="javascript:;" class="policyDel whiteList_btnRemove">&nbsp;</a>');
                    container.find('#adUrlList .blank:first').remove();
                }
            });

            //删除白名单
            container.on('click', '.whiteList_btnRemove', function () {
                if (!$(this).prop('disabled')) {
                    $(this).closest('tr').remove();
                }
                var list = $(this).closest('table');
                if (list.find('tr').length < 3) {
                    list.append('<tr class="blank"><td style="width:380px;"></td><td></td></tr>');
                }
            });

            //是否开启白名单
            container.on('change', '#whiteList_WhiteUrlStatus', function () {
                var that = $(this);
                var dd = that.closest('dt').next('dd');
                if (that.prop('checked')) {
                    dd.find('input,button,.whiteList_btnRemove').prop('disabled', false);
                    dd.find('.whiteList_btnRemove').css('visibility', 'visible');
                } else {
                    dd.find('input,button,.whiteList_btnRemove').prop('disabled', true);
                    dd.find('.whiteList_btnRemove').css('visibility', 'hidden');
                }
            });


            /******************************************************************/
            container.on('change', '.js_time_mode', function () {
                var that = $(this);
                var val = that.val();
                that.closest('dl').find('.js_time' + val).show().siblings('div').hide();
            });

            var urls_html = '<tr>' +
                '<td style="width:300px;"><input type="text" style="width:293px;" class="input-large" name="urls" validation="noequal require" targets=".js_urls"></td>' +
                '<td><label class="checkbox inline"><input type="checkbox" value="" name="alert">提示</label>' +
                '<label class="checkbox inline"><input type="checkbox" value="" name="control">拦截</label></td>' +
                '<tr>';
            container.on('click', '.add_urls', function () {
                $(this).closest('dl').find('.js_urls').prepend(urls_html);
            });

            var rule_html = '<div class="policy-bod"><dl class="policy-rule-tpl">' +
                '<dd>' +
                '<span class="inblock" style="width:97px;margin-left:-17px;"><i name="TimeRule_lock" class="lock"></i>受限时间：</span>' +
                '<label class="mb5 inblock">' +
                '<select class="input-small js_time_mode" style="width:120px;">' +
                '<option value="0">每天</option>' +
                '<option value="1">每周</option>' +
                '<option value="2">时间段</option>' +
                '</select>' +
                '</label>' +
                '</dd>' +
                '<dd>' +
                '<div class="js_time0">' +
                '<input type="text" value="" class="input-mini js_time" name="start_time" validation="require">' +
                '<span>至</span>' +
                '<input type="text" value="" class="input-mini js_time" name="end_time" validation="require">' +
                '<span class="help-inline">(例 00:00 ~ 23:59)</span>' +
                '</div>' +
                '<div class="hide js_time1 policy-week">' +
                '<label class="checkbox"><input type="checkbox" name="week">一</label>' +
                '<label class="checkbox"><input type="checkbox" name="week">二</label>' +
                '<label class="checkbox"><input type="checkbox" name="week">三</label>' +
                '<label class="checkbox"><input type="checkbox" name="week">四</label>' +
                '<label class="checkbox"><input type="checkbox" name="week">五</label>' +
                '<label class="checkbox"><input type="checkbox" name="week">六</label>' +
                '<label class="checkbox"><input type="checkbox" name="week">日</label>' +
                '<input type="text" value="" class="input-mini js_time ml10" name="start_time">' +
                '<span>至</span>' +
                '<input type="text" value="" class="input-mini js_time" name="end_time"  validation="require">' +
                '<span class="help-inline">(例 00:00 ~ 23:59)</span>' +
                '</div>' +
                '<div class="hide js_time2">' +
                '<span>日期</span>' +
                '<input type="text" value="" class="input-medium js_date" name="start_date" validation="require">' +
                '<span>至</span>' +
                '<input type="text" value="" class="input-medium js_date"  name="end_date" validation="require">' +
                '</div>' +
                '</dd>' +
                '<dd>' +
                '<span class="inblock" style="width:80px;">受限网址：</span>' +
                '<button class="btn btn-small ml10 add_urls btn-add" >&nbsp;</button>' +
                '</dd>' +
                '<dd class="" style="width:440px">' +
                '<table class="whiteListBoxTit">' +
                '<tr>' +
                '<td style="width:300px;">受限网址</td>' +
                '<td>操作</td>' +
                '</tr>' +
                '</table>' +
                '<div class="whiteList">' +
                '<div class="js_white_wrap">' +
                '<table class="js_urls">' +
                '<tr class="blank">' +
                '<td style="width:300px;"></td>' +
                '<td></td>' +
                '</tr>' +
                '</table>' +
                '</div>' +
                '</div>' +
                '</dd>' +
                '<dd>注：https或指定端口网址仅按域名匹配进行拦截！</dd>' +
                '<dd>' +
                '<span class="inblock"  style="width:80px;">强制跳转：</span>' +
                '<label class="inblock"><input type="text" value="" class="input-large redirect" validation="require"></label>' +
                '</dd>' +
                '</dl></div>';
            container.on('click', '#add_rules', function () {
                container.find('.js_dialog_box .modal-body').html(rule_html);
                /*时间控件*/
                op.initTime(container.find('.js_dialog_box .modal-body'));
                container.find('.js_dialog_box .modal-body select').selectric({
                    inheritOriginalWidth: true,
                    maxHeight: 150
                });
                !container.find('.js_dialog_box .slimScrollDiv').length &&
                    container.find('.js_dialog_box .js_white_wrap').slimscroll({
                        height: 88,
                        size: '4px'
                    });
                $('.js_dialog_box').modal();
            });

            container.on('click', '.js_dialog_box .js_sure', function () {
                var tpl = $(this).closest('.js_dialog_box').find('.modal-body');

                tpl.find('[validation]').trigger('blur');
                if (tpl.find('.error').length) {
                    return false;
                }

                var tpl_time = '',
                    tpl_num = 0,
                    tpl_week = [],
                    tpl_urls = tpl.find('[name=urls]'),
                    tpl_time_type = tpl.find('.js_time_mode').val();
                if (tpl_time_type == 0) {
                    tpl_time = '每天：' + tpl.find('.js_time0 [name=start_time]').val() + '--' + tpl.find('.js_time0 [name=end_time]').val();
                }

                if (tpl_time_type == 1) {
                    tpl.find('.js_time1 [name=week]').each(function () {
                        $(this).prop('checked') && tpl_week.push($(this).closest('label').text());
                    });
                    if (tpl_week.length) {
                        tpl_week = '周' + tpl_week.join('、');
                    }
                    tpl_time = '每周：' + tpl_week + '  ' + tpl.find('.js_time1 [name=start_time]').val() + '--' + tpl.find('.js_time1 [name=end_time]').val();
                }

                if (tpl_time_type == 2) {
                    tpl_time = '从' + tpl.find('.js_time2 [name=start_date]').val() + '--' + tpl.find('.js_time2 [name=end_date]').val();
                }
                tpl_urls.each(function () {
                    if ($(this).val() !== '') {
                        tpl_num++;
                    }
                });


                op.destroyTime(container.find('.js_dialog_box .modal-body'));
                container.find('.js_dialog_box .modal-body select').selectric('destroy');

                var html = $('<tr><td style="width:300px;">' + tpl_time + '</td><td style="width:80px">' + tpl_num + '</td><td style="text-align:center;"><i class="edit">&nbsp;</i><i class="del">&nbsp;</i></td></tr>');
                html[0]['tpl_data'] = tpl.find('.policy-bod').clone();
                var tr = $('.js_dialog_box')[0]['edit'];
                if (tr) {
                    $(tr).replaceWith(html);
                } else {
                    $('#browserList').prepend(html);
                    container.find('#browserList .blank:first').remove();
                }

                $('.js_dialog_box')[0]['edit'] = null;
                $('.js_dialog_box').modal('hide').find('.modal-body').html('');
            });

            container.on('click', '.js_dialog_box .js_cancel', function () {
                op.destroyTime(container.find('.js_dialog_box .modal-body'));
                container.find('.js_dialog_box .modal-body select').selectric('destroy');
                $('.js_dialog_box').modal('hide').find('.modal-body').html('');
            });

            container.on('click', '#browserList .edit', function () {
                var tr = $(this).closest('tr')[0];
                var rule_html = tr['tpl_data'];
                container.find('.js_dialog_box .modal-body').html($(rule_html).clone());
                /*时间控件*/
                op.initTime(container.find('.js_dialog_box .modal-body'));
                container.find('.js_dialog_box .modal-body select').selectric({
                    inheritOriginalWidth: true
                });
                !container.find('.js_dialog_box .slimScrollDiv').length &&
                    container.find('.js_dialog_box .js_white_wrap').slimscroll({
                        height: 88,
                        size: '4px'
                    });
                $('.js_dialog_box').modal();
                $('.js_dialog_box')[0]['edit'] = tr;
            });

            container.on('click', '#browserList .del', function () {
                $(this).closest('tr').remove();
                if ($('#browserList tr').length < 3) {
                    $('#browserList').append($('<tr class="blank"><td style="width:300px;"></td><td style="width:80px"></td><td></td></tr>'));
                }
            });


            /*联网管理*/
            //this.initNetPro(container);
            var ModalTarget = null;
            container.on('click', '.net_add_pro', function () {
                $('.js_dialog_net_pro select').selectric('refresh');
                $('.js_dialog_net_pro').modal();
                ModalTarget = $(this).closest('dl');
            });
            container.on('click', '.js_dialog_net_pro .js_sure', function () {
                var fa = $(this).closest('.js_dialog_net_pro').find('.tab-pane.active');
                var val = '';
                var softType = '';
                if (fa.attr('id') == 'tab1') {
                    //自定义软件
                    val = container.find('#js_sys_macro').val() + container.find('#js_sys_path').val();
                    softType = 2;
                } else {
                    //服务名
                    val = container.find('#js_server_name').val();
                    softType = 3;
                }
                if (val) {
                    var data = {
                        Name: val,
                        md5: 0,
                        listen: 0,
                        outside: 0,
                        type: softType
                    };
                    var _table = ModalTarget.find('.net_pros');
                    var arrVals = [];
                    var trs = _table.find('tbody tr');
                    for (var i = 0; i < trs.length; i++) {
                        var txt = $(trs[i]).find('td:eq(0) span').text();
                        arrVals.push(txt);
                        if (arrVals.indexOf(val) > -1) {
                            container.find('#js_sys_path,#js_server_name').addClass('error');
                            return false;
                        }
                    }

                    container.find('#js_sys_path,#js_server_name').removeClass('error');
                    // _table.bootstrapTable('append', data);
                    var html = '<tr><td style="width:250px;"><span _type="' + data.type + '">' + data.Name + '</span></td>' +
                        '<td style="width:60px;text-align:center;"><input type="checkbox" name="md5" ></td>' +
                        '<td style="width:70px;text-align:center;"><input type="checkbox" name="listen"></td>' +
                        '<td style="width:70px;text-align:center;"><input type="checkbox" name="outside"></td></tr>';
                    $('.js_dialog_box2 .net_pros').prepend(html);
                    container.find('#js_server_name,#js_sys_path').val('');
                    container.find('#js_sys_macro option:eq(0)')[0].selected = true;
                    $('.js_dialog_net_pro').modal('hide');
                }

            });
            container.on('click', '.js_dialog_net_pro .js_cancel', function () {
                $('.js_dialog_net_pro').modal('hide');
                container.find('#js_server_name,#js_sys_path').val('');
                container.find('#js_sys_macro option:eq(0)')[0].selected = true;
            });
            var net_rules_html = '<div class="policy-bod"><dl class="policy-rule-tpl">' +
                '<dd>' +
                '<span class="inblock" style="width:97px;margin-left:-17px;"><i name="TimeRule_lock" class="lock"></i>受限时间</span>' +
                '<label class="mb5 inblock">' +
                '<select class="input-small js_time_mode" style="width:120px;">' +
                '<option value="0">每天</option>' +
                '<option value="1">每周</option>' +
                '<option value="2">时间段</option>' +
                '</select>' +
                '</label>' +
                '</dd>' +
                '<dd>' +
                '<div class="js_time0">' +
                '<input type="text" value="" class="input-mini js_time" name="start_time" validation="require">' +
                '<span>至</span>' +
                '<input type="text" value="" class="input-mini js_time" name="end_time" validation="require">' +
                '<span class="help-inline">(例 00:00 ~ 23:59)</span>' +
                '</div>' +
                '<div class="hide js_time1 policy-week">' +
                '<label class="checkbox inline"><input type="checkbox" name="week">日</label>' +
                '<label class="checkbox inline"><input type="checkbox" name="week">一</label>' +
                '<label class="checkbox inline"><input type="checkbox" name="week">二</label>' +
                '<label class="checkbox inline"><input type="checkbox" name="week">三</label>' +
                '<label class="checkbox inline"><input type="checkbox" name="week">四</label>' +
                '<label class="checkbox inline"><input type="checkbox" name="week">五</label>' +
                '<label class="checkbox inline"><input type="checkbox" name="week">六</label>' +
                '<input type="text" value="" class="input-mini ml10 js_time" name="start_time">' +
                '<span>至</span>' +
                '<input type="text" value="" class="input-mini js_time" name="end_time" validation="require">' +
                '<span class="help-inline">(例 00:00 ~ 23:59)</span>' +
                '</div>' +
                '<div class="hide js_time2">' +
                '<span>日期</span>' +
                '<input type="text" value="" class="input-medium js_date" name="start_date" validation="require">' +
                '<span>至</span>' +
                '<input type="text" value="" class="input-medium js_date"  name="end_date" validation="require">' +
                '</div>' +
                '</dd>' +
                '<dd>' +
                '<span>受限程序</span>' +
                '<button  class="btn btn-small ml10 net_add_pro btn-add" >&nbsp;</button>' +
                '</dd>' +
                '<dd>' +
                '<dd class="" style="width:500px;">' +
                '<table class="whiteListBoxTit">' +
                '<tr>' +
                '<td style="width:250px;">受限程序</td>' +
                '<td style="width:60px;">防篡改</td>' +
                '<td style="width:70px;">禁止监听</td>' +
                '<td style="width:70px;">禁止联网</td>' +
                '</tr>' +
                '</table>' +
                '<div class="whiteList">' +
                '<div class="js_white_wrap">' +
                '<table class="net_pros"></table>' +
                '</div>' +
                '</div>' +
                '</dd>' +
                '</dd>' +
                '</dl>' +
                '</div>';

            container.on('click', '#net_add_rules', function () {
                // container.find('.netlist').append(net_rules_html);
                // op.initNetPro(container.find('.netlist dl:last'));
                /*时间控件*/
                // op.initTime(container.find('.netlist dl:last'));  

                container.find('.js_dialog_box2 .modal-body').html(net_rules_html);
                /*时间控件*/
                op.initTime(container.find('.js_dialog_box2 .modal-body'));
                container.find('.js_dialog_box2 .modal-body select').selectric({
                    inheritOriginalWidth: true,
                    maxHeight: 150
                });
                !container.find('.js_dialog_box2 .slimScrollDiv').length &&
                    container.find('.js_dialog_box2 .js_white_wrap').slimscroll({
                        height: 88,
                        size: '4px'
                    });
                $('.js_dialog_box2').modal();
            });

            container.on('click', '.js_dialog_box2 .js_sure', function () {
                var tpl = $(this).closest('.js_dialog_box2').find('.modal-body');

                tpl.find('[validation]').trigger('blur');
                if (tpl.find('.error').length) {
                    return false;
                }

                var tpl_time = '',
                    tpl_num = tpl.find('.net_pros tr').length,
                    tpl_week = [],
                    tpl_time_type = tpl.find('.js_time_mode').val();
                if (tpl_time_type == 0) {
                    tpl_time = '每天：' + tpl.find('.js_time0 [name=start_time]').val() + '--' + tpl.find('.js_time0 [name=end_time]').val();
                }

                if (tpl_time_type == 1) {
                    tpl.find('.js_time1 [name=week]').each(function () {
                        $(this).prop('checked') && tpl_week.push($(this).closest('label').text());
                    });
                    if (tpl_week.length) {
                        tpl_week = '周' + tpl_week.join('、');
                    }
                    tpl_time = '每周：' + tpl_week + '  ' + tpl.find('.js_time1 [name=start_time]').val() + '--' + tpl.find('.js_time1 [name=end_time]').val();
                }

                if (tpl_time_type == 2) {
                    tpl_time = '从' + tpl.find('.js_time2 [name=start_date]').val() + '--' + tpl.find('.js_time2 [name=end_date]').val();
                }



                op.destroyTime(container.find('.js_dialog_box2 .modal-body'));
                container.find('.js_dialog_box2 .modal-body select').selectric('destroy');

                var html = $('<tr><td style="width:300px;">' + tpl_time + '</td><td style="width:80px">' + tpl_num + '</td><td style="text-align:center;"><i class="edit">&nbsp;</i><i class="del">&nbsp;</i></td></tr>');
                html[0]['tpl_data'] = tpl.find('.policy-bod').clone();
                var tr = $('.js_dialog_box2')[0]['edit'];
                if (tr) {
                    $(tr).replaceWith(html);
                } else {
                    $('#netList').prepend(html);
                    container.find('#netList .blank:first').remove();
                }

                $('.js_dialog_box2')[0]['edit'] = null;
                $('.js_dialog_box2').modal('hide').find('.modal-body').html('');
            });

            container.on('click', '.js_dialog_box2 .js_cancel', function () {
                op.destroyTime(container.find('.js_dialog_box2 .modal-body'));
                container.find('.js_dialog_box2.modal-body select').selectric('destroy');
                $('.js_dialog_box2').modal('hide').find('.modal-body').html('');
            });

            container.on('click', '#netList .edit', function () {
                var tr = $(this).closest('tr')[0];
                var rule_html = tr['tpl_data'];
                container.find('.js_dialog_box2 .modal-body').html($(rule_html).clone());
                /*时间控件*/
                op.initTime(container.find('.js_dialog_box2 .modal-body'));
                container.find('.js_dialog_box2 .modal-body select').selectric({
                    inheritOriginalWidth: true,
                    maxHeight: 150
                });
                !container.find('.js_dialog_box2 .slimScrollDiv').length &&
                    container.find('.js_dialog_box2 .js_white_wrap').slimscroll({
                        height: 88,
                        size: '4px'
                    });
                $('.js_dialog_box2').modal();
                $('.js_dialog_box2')[0]['edit'] = tr;
            });

            container.on('click', '#netList .del', function () {
                $(this).closest('tr').remove();
                if ($('#netList tr').length < 3) {
                    $('#netList').append('<tr class="blank"><td style="width:300px;"></td><td style="width:80px"></td><td></td></tr>');
                }
            });


            //IP控制列表
            container.on('change', '[name=ip_select]', function () {
                var val = $(this).val();
                if (val == 1) {
                    container.find('.js_ip_select_target').removeClass('hide');
                } else {
                    container.find('.js_ip_select_target').addClass('hide');
                }
            });

            container.on('click', '#list_add', function () {
                var type = container.find('[name=ip_select]').val();
                var startIp = container.find('.start_ip'),
                    endIp = container.find('.end_ip'),
                    flag = false;
                if (type == 0) {
                    if (!startIp.val()) {
                        startIp.tooltip({
                            title: '内容不能为空',
                            trigger: 'manual'
                        }).tooltip('show');
                        flag = true;
                    } else {
                        startIp.tooltip('hide');
                    }
                } else {
                    if (!startIp.val()) {
                        startIp.tooltip({
                            title: '内容不能为空',
                            trigger: 'manual'
                        }).tooltip('show');
                        flag = true;
                    } else {
                        startIp.tooltip('hide');
                    }
                    if (!endIp.val()) {
                        endIp.tooltip({
                            title: '内容不能为空',
                            trigger: 'manual'
                        }).tooltip('show');
                        flag = true;
                    } else {
                        endIp.tooltip('hide');
                    }
                }
                if (flag) {
                    return false;
                }
                var arr = [];
                arr.push(type);
                arr.push(startIp.val());
                if (type == 1) {
                    arr.push(endIp.val());
                }
                startIp.val('');
                endIp.val('');
                var html = '<tr><td style="width:290px" val="' + arr.join('|') + '">' + arr.slice(1).join('--') + '</td>' +
                    '<td style="width:90px;"><label><input type="radio" name="js_ban" value="0">禁止</label><label><input type="radio" name="js_ban" value="1" checked>允许</label></td>' +
                    '<td style="text-align:center;"><i class="del js_remove">&nbsp;</i></td></tr>';
                container.find('#ip_list').append(html);
            });

            container.on('keyup', '.start_ip,.end_ip', function () {
                if ($(this).val()) {
                    $(this).tooltip('hide');
                }
            });

            container.on('click', '#ip_list .js_remove', function () {
                $(this).closest('tr').remove();
            });

            /**********************************************************************/
            /*策略保存*/
            container.on('click', '#policy-save', function () {
                var params = getUrlSearchQuerys();
                if (!op.valida()) {
                    RsCore.msg.warn('组策略设置', '数据错误');
                    return false;
                }
                $(this).button('loading');
                var json = op.toJson(container.find('#policyContent')),
                    json2 = op.toJson2(container.find('#policyContent')),
                    policys = RsCore.config.protection.policy,
                    eid = RsCore.cache.group.eid,
                    gid = params['g'] /*view.find('.client-list li.active a').attr('da-toggle').substring(1)*/,
                    cid = params['c'] || '';
                // var _type;
                // var _policy = container.find('#policy-product .active a').attr('da-toggle').substring(1);
                // if (globalPolicy.indexOf(_policy) >= 0) {
                //     _type = 1;
                // } else {
                //     _type = 0;
                //     if (!gid && !cid && !eid) return;
                // }
                var tickDone = 0;

                RsCore.ajax('Policy/editPolicy', {
                    'eid': eid ? eid : '', //企业id
                    'objid': cid ? cid : (gid ? gid : (eid ? eid : '')), //企业id/组id/终端sguid
                    'productid': policys[0].value.split('_')[0], //产品id
                    'productname': policys[0].name, //产品名称
                    'grouptype': cid ? 2 : 1, //组类型(策略类型)
                    'policytype': policys[0].value.split('_')[1], //策略小类型
                    'desp': '', //描述
                    'policyinfo': JSON.stringify(json),
                    'type': 0
                }, function (data) {
                    tickDone++;
                    ajaxTick();
                });

                RsCore.ajax('Policy/editPolicy', {
                    'eid': eid ? eid : '', //企业id
                    'objid': cid ? cid : (gid ? gid : (eid ? eid : '')), //企业id/组id/终端sguid
                    'productid': policys[1].value.split('_')[0], //产品id
                    'productname': policys[1].name, //产品名称
                    'grouptype': cid ? 2 : 1, //组类型(策略类型)
                    'policytype': policys[1].value.split('_')[1], //策略小类型
                    'desp': '', //描述
                    'policyinfo': JSON.stringify(json2),
                    'type': 0
                }, function (data) {
                    tickDone++;
                    ajaxTick();
                });

                function ajaxTick() {
                    if (tickDone != 2) {
                        return false;
                    }
                    if (tickDone == 2) {
                        container.find('#policy-save').button('reset');
                        RsCore.msg.success('策略保存成功 !');
                    }
                }


                //console.log(JSON.stringify(json));
                //$('#txtJSONTest').val(JSON.stringify(json));
            });




            /*导航*/
            var navTick = false;
            /*导航*/
            container.on('click', '#policyTab a', function () {
                navTick = true;
                var tag = $(this).attr('da-toggle');
                var wrapTop = $('.c-moudle-wrap').offset().top;
                var wrapScroolTop = $('.c-moudle-wrap').scrollTop();
                var objTop = container.find(tag).offset().top;
                var top = wrapScroolTop + objTop - wrapTop;
                $('.c-moudle-wrap').trigger('goTo', {
                    top: top
                });
                $('.policy-bod').removeClass('active');

                $(this).parent().addClass('active').siblings().removeClass('active');
                $(tag).find('> .policy-bod').addClass('active');
            });

            $(window).on('resize.policy', function () {
                $('.c-moudle-wrap').slimscroll({
                    height: $('.c-page-content').height() - $('.c-moudle-nav').outerHeight() - 45,
                    alwaysVisible: true
                });
            }).trigger('resize.policy');


            var objs = [];
            $('#policyTab a').each(function (i, item) {
                var obj = $(item),
                    tag = obj.attr('da-toggle'),
                    top = $(tag).offset().top;
                objs.push({
                    tag: tag,
                    obj: obj,
                    top: top
                });
            });
            $('.c-moudle-wrap').on('scroll', function (e) {
                if (navTick) {
                    navTick = false;
                    return false;
                }
                var that = $(this),
                    objtop = that.scrollTop() + that.offset().top;
                for (var i = objs.length - 1; i >= 0; i--) {
                    //console.log(objs[i].top,objtop)
                    if (objs[i].top <= objtop) {
                        objs[i].obj.parent().addClass('active').siblings().removeClass('active');
                        $('.policy-bod').removeClass('active');
                        $(objs[i].tag).find('.policy-bod').addClass('active');
                        return false;
                    }
                }

            });

        },
        valida: function () {
            op.view.find('[validation]:visible').trigger('blur');
            if (op.view.find('.error').length) {
                return false;
            }
            return true;
        },
        validationEvent: function (container) {
            /*错误验证事件*/
            var rule = {
                require: function (obj) {
                    return obj.val().length > 0;
                },
                intNum: function (obj) {
                    var val = obj.val();
                    if (/^\d+$/.test(val)) {
                        obj.val(Number(val));
                    }
                    return /^\d+$/.test(val);
                },
                ip: function (obj) {
                    var val = obj.val();
                    return /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i.test(val);
                },
                noequal: function (obj) {
                    var val = obj.val(),
                        targets = obj.attr('targets'),
                        tag = obj.closest(targets).find('[validation=noequal]'),
                        vals = [];
                    for (var i = 0; i < tag.length; i++) {
                        var tg = $(tag[i]),
                            v = tg.val();
                        if (tg.val() != '') {
                            var idx = vals.indexOf(v);
                            if (idx > -1) {
                                $(tag).eq(idx).addClass('error');
                                obj.addClass('error');
                                return false;
                            }
                        }
                        vals.push(v);
                    }
                    tag.removeClass('error');
                    return true;
                },
                gte: function (obj) {
                    var val = Number(obj.val()),
                        _val = Number(obj.attr('valid_gte'));
                    return (val >= _val);

                }
            };

            container.on('blur', '[validation]:visible', function () {
                var that = $(this),
                    funcs = that.attr('validation').split(/\s+/),
                    len = funcs.length,
                    num = 0;
                if ((funcs.indexOf('require') < 0) && that.val() == '') {
                    that.removeClass('error');
                    return true;
                }
                for (var i = 0; i < len; i++) {
                    if (rule[funcs[i]].call(null, that)) {
                        num++;
                    } else {
                        break;
                    }
                }
                if (num == len) {
                    that.removeClass('error');
                } else {
                    that.addClass('error');
                }

            });
        },
        _initRsIpTable: function (container, data) {
            //防黑客攻击
            var data = data || this.ruleList;
            var total_RsIpRule = data.length,
                RsIpRule_noOpen = 0,
                htmls = [];

            for (var i = 0; i < data.length; i++) {
                var da = data[i];
                var check = '';
                if (da['bInuse'] == 1) {
                    check = 'checked';
                } else {
                    RsIpRule_noOpen++;
                }
                var html = '<tr><td style="width:420px;"><div>' + da['Name'] + '</div></td><td style="text-align:center;"><input type="checkbox" objid="' + da.ID + '" objname="' + da.Name + '" ' + check + '></td></tr>';
                htmls.push(html);
            }
            container.find('#RsIpRuleList').html(htmls.join(''));

            container.find('#js_totle_RsIpRuleList').text(total_RsIpRule - RsIpRule_noOpen);
            container.find('#js_RsIpRuleList_noOpen').text(RsIpRule_noOpen);
        },
        initTime: function (container) {
            container.find('.js_time[name=start_time]').datetimepicker({
                datepicker: false,
                format: 'H:i',
                step: 1,
                style: 'z-index:99999',
                onShow: function (ct, target) {
                    this.setOptions({
                        maxTime: $(target).parent().find('[name=end_time]').val() ? $(target).parent().find('[name=end_time]').val() : false
                    });
                }
            });
            container.find('.js_time[name=end_time]').datetimepicker({
                datepicker: false,
                format: 'H:i',
                step: 1,
                style: 'z-index:99999',
                onShow: function (ct, target) {
                    this.setOptions({
                        minTime: $(target).parent().find('[name=start_time]').val() ? $(target).parent().find('[name=start_time]').val().replace(/[-]/g, '/') : false
                    });
                }
            });
            container.find('.js_date[name=start_date]').datetimepicker({
                format: 'Y-m-d H:i',
                step: 1,
                style: 'z-index:99999',
                onShow: function (ct, target) {
                    this.setOptions({
                        maxDate: $(target).parent().find('[name=end_date]').val() ? $(target).parent().find('[name=end_date]').val().replace(/[-]/g, '/').split(' ')[0] : false
                    });
                }
            });
            container.find('.js_date[name=end_date]').datetimepicker({
                format: 'Y-m-d H:i',
                step: 1,
                style: 'z-index:99999',
                onShow: function (ct, target) {
                    this.setOptions({
                        minDate: $(target).parent().find('[name=start_date]').val() ? $(target).parent().find('[name=start_date]').val().replace(/[-]/g, '/').split(' ')[0] : false
                    });
                }
            });
        },
        destroyTime: function (container) {
            container.find('.js_time[name=start_time]').datetimepicker('destroy');
            container.find('.js_time[name=end_time]').datetimepicker('destroy');
            container.find('.js_date[name=start_date]').datetimepicker('destroy');
            container.find('.js_date[name=end_date]').datetimepicker('destroy');
        },
        initNetPro2: function (temp, data) {
            data = data || [];
            var htmls = [];
            for (var i = 0; i < data.length; i++) {
                var da = data[i];
                var html = '<tr><td style="width:250px;"><span _type="' + da.type + '">' + da.Name + '</span></td>' +
                    '<td style="width:60px;text-align:center;"><input type="checkbox" name="md5" ' + (da.md5 ? 'checked' : '') + '></td>' +
                    '<td style="width:70px;text-align:center;"><input type="checkbox" name="listen" ' + (da.listen ? 'checked' : '') + '></td>' +
                    '<td style="width:70px;text-align:center;"><input type="checkbox" name="outside" ' + (da.outside ? 'checked' : '') + '></td></tr>';
                htmls.push(html);
            }
            temp.find('.net_pros').prepend(htmls.join(''));
        },
        initNetPro: function (container, data) {
            data = data || [];
            var htmls = [];
            for (var i = 0; i < data.length; i++) {
                var da = data[i];
                var html = '<tr><td style="width:250px;"><span _type="' + da.type + '">' + da.Name + '</span></td>' +
                    '<td style="width:60px;text-align:center;"><input type="checkbox" name="md5" ' + (da.md5 ? 'checked' : '') + '></td>' +
                    '<td style="width:70px;text-align:center;"><input type="checkbox" name="listen" ' + (da.listen ? 'checked' : '') + '></td>' +
                    '<td style="width:70px;text-align:center;"><input type="checkbox" name="outside" ' + (da.outside ? 'checked' : '') + '></td></tr>';
                htmls.push(html);
            }

            $('.js_dialog_box2 .net_pros').prepend(htmls.join(''));
            // data = data || [];
            // container.find('.net_pros').bootstrapTable({
            //     columns: [{
            //         field: 'Name',
            //         title: '受限程序',
            //         align: 'left',
            //         sortable: false,
            //         formatter: function(value, row, index) {
            //             var html = '<span _type="' + row.type + '">' + row.Name + '</span>';
            //             return html;
            //         }
            //     }, {
            //         field: 'md5',
            //         title: '防篡改',
            //         align: 'center',
            //         width: '60px',
            //         sortable: false,
            //         formatter: function(value, row, index) {
            //             var checked = row.md5 ? 'checked' : '';
            //             var html = '<input type="checkbox" name="md5" ' + checked + '>';
            //             return html;
            //         }
            //     }, {
            //         field: 'listen',
            //         title: '监控',
            //         align: 'center',
            //         width: '60px',
            //         sortable: false,
            //         formatter: function(value, row, index) {
            //             var checked = row.md5 ? 'checked' : '';
            //             var html = '<input type="checkbox" name="listen" ' + checked + '>';
            //             return html;
            //         }
            //     }, {
            //         field: 'outside',
            //         title: '联网',
            //         align: 'center',
            //         width: '60px',
            //         sortable: false,
            //         formatter: function(value, row, index) {
            //             var checked = row.md5 ? 'checked' : '';
            //             var html = '<input type="checkbox" name="outside" ' + checked + '>';
            //             return html;
            //         }
            //     }, {
            //         field: 'op',
            //         title: '操作',
            //         align: 'center',
            //         width: '120px',
            //         sortable: false,
            //         formatter: function(value, row, index) {
            //             var html = '<a class="remove" href="javascript:void(0)" title="Remove">删除</a>';
            //             return html;
            //         },
            //         events: {
            //             'click .remove': function(e, value, row, index) {
            //                 $(e.target).closest('tr').remove();
            //                 if ($('#net_pros tbody tr').length < 1) {
            //                     container.find('#net_pros').bootstrapTable('load', []);
            //                 }
            //             }
            //         }
            //     }],
            //     data: data,
            //     height: 200,
            //     formatNoMatches: function() {
            //         return '当前没有受限程序';
            //     }
            // });
        },
        toJson: function (container) {
            var product = {};

            product.NetProtect = {};

            /*公共设置 start*/
            product.NetProtect.FwStatus = {};
            product.NetProtect.FwStatus['@attributes'] = {
                lock: Number(container.find('#FwStatus_lock').hasClass('enableLock'))
            };
            product.NetProtect.FwStatus['@value'] = Number(container.find('#pub_FwStatus').prop('checked'));

            product.NetProtect.WhiteUrlStatus = {};
            product.NetProtect.WhiteUrlStatus['@attributes'] = {
                lock: Number(container.find('#whiteList_lock').hasClass('enableLock'))
            };
            product.NetProtect.WhiteUrlStatus['@value'] = Number(container.find('#whiteList_WhiteUrlStatus').prop('checked'));

            product.NetProtect.AntiEvilUrl = {};
            // product.NetProtect.AntiEvilUrl['@attributes'] = {
            //     lock: Number(container.find('#AntiEvilUrl_lock').hasClass('enableLock'))
            // };
            product.NetProtect.AntiEvilUrl.MonStatus = {};
            product.NetProtect.AntiEvilUrl.MonStatus['@attributes'] = {
                lock: Number(container.find('#AntiEvilUrl_lock_MonStatus').hasClass('enableLock'))
            };
            product.NetProtect.AntiEvilUrl.MonStatus['@value'] = Number(container.find('#AntiEvilUrl_MonStatus').prop('checked'));
            product.NetProtect.AntiEvilUrl.LogStatus = {};
            product.NetProtect.AntiEvilUrl.LogStatus['@attributes'] = {
                lock: Number(container.find('#AntiEvilUrl_lock_LogStatus').hasClass('enableLock'))
            };
            product.NetProtect.AntiEvilUrl.LogStatus['@value'] = Number(container.find('#AntiEvilUrl_LogStatus').prop('checked'));

            product.NetProtect.AntiFishUrl = {};
            // product.NetProtect.AntiFishUrl['@attributes'] = {
            //     lock: Number(container.find('#AntiFishUrl_lock').hasClass('enableLock'))
            // };
            product.NetProtect.AntiFishUrl.MonStatus = {};
            product.NetProtect.AntiFishUrl.MonStatus['@attributes'] = {
                lock: Number(container.find('#AntiFishUrl_lock_MonStatus').hasClass('enableLock'))
            };
            product.NetProtect.AntiFishUrl.MonStatus['@value'] = Number(container.find('#AntiFishUrl_MonStatus').prop('checked'));
            product.NetProtect.AntiFishUrl.LogStatus = {};
            product.NetProtect.AntiFishUrl.LogStatus['@attributes'] = {
                lock: Number(container.find('#AntiFishUrl_lock_LogStatus').hasClass('enableLock'))
            };
            product.NetProtect.AntiFishUrl.LogStatus['@value'] = Number(container.find('#AntiFishUrl_LogStatus').prop('checked'));

            product.NetProtect.AntiEvilDown = {};
            // product.NetProtect.AntiEvilDown['@attributes'] = {
            //     lock: Number(container.find('#AntiEvilDown_lock').hasClass('enableLock'))
            // };
            product.NetProtect.AntiEvilDown.MonStatus = {};
            product.NetProtect.AntiEvilDown.MonStatus['@attributes'] = {
                lock: Number(container.find('#AntiEvilDown_lock_MonStatus').hasClass('enableLock'))
            };
            product.NetProtect.AntiEvilDown.MonStatus['@value'] = Number(container.find('#AntiEvilDown_MonStatus').prop('checked'));
            product.NetProtect.AntiEvilDown.LogStatus = {};
            product.NetProtect.AntiEvilDown.LogStatus['@attributes'] = {
                lock: Number(container.find('#AntiEvilDown_lock_LogStatus').hasClass('enableLock'))
            };
            product.NetProtect.AntiEvilDown.LogStatus['@value'] = Number(container.find('#AntiEvilDown_LogStatus').prop('checked'));

            product.NetProtect.SearchUrlProtect = {};
            // product.NetProtect.SearchUrlProtect['@attributes'] = {
            //     lock: Number(container.find('#SearchUrlProtect_lock').hasClass('enableLock'))
            // };
            product.NetProtect.SearchUrlProtect.MonStatus = {};
            product.NetProtect.SearchUrlProtect.MonStatus['@attributes'] = {
                lock: Number(container.find('#SearchUrlProtect_lock_MonStatus').hasClass('enableLock'))
            };
            product.NetProtect.SearchUrlProtect.MonStatus['@value'] = Number(container.find('#SearchUrlProtect_MonStatus').prop('checked'));
            product.NetProtect.SearchUrlProtect.LogStatus = {};
            product.NetProtect.SearchUrlProtect.LogStatus['@attributes'] = {
                lock: Number(container.find('#SearchUrlProtect_lock_LogStatus').hasClass('enableLock'))
            };
            product.NetProtect.SearchUrlProtect.LogStatus['@value'] = Number(container.find('#SearchUrlProtect_LogStatus').prop('checked'));

            product.NetProtect.AntiXss = {};
            // product.NetProtect.AntiXss['@attributes'] = {
            //     lock: Number(container.find('#AntiXss_lock').hasClass('enableLock'))
            // };
            product.NetProtect.AntiXss.MonStatus = {};
            product.NetProtect.AntiXss.MonStatus['@attributes'] = {
                lock: Number(container.find('#AntiXss_lock_MonStatus').hasClass('enableLock'))
            };
            product.NetProtect.AntiXss.MonStatus['@value'] = Number(container.find('#AntiXss_MonStatus').prop('checked'));
            product.NetProtect.AntiXss.LogStatus = {};
            product.NetProtect.AntiXss.LogStatus['@attributes'] = {
                lock: Number(container.find('#AntiXss_lock_LogStatus').hasClass('enableLock'))
            };
            product.NetProtect.AntiXss.LogStatus['@value'] = Number(container.find('#AntiXss_LogStatus').prop('checked'));

            product.NetProtect.AdFilter = {};
            // product.NetProtect.AdFilter['@attributes'] = {
            //     lock: Number(container.find('#AdFilter_lock').hasClass('enableLock'))
            // };
            product.NetProtect.AdFilter.MonStatus = {};
            product.NetProtect.AdFilter.MonStatus['@attributes'] = {
                lock: Number(container.find('#AdFilter_lock_MonStatus').hasClass('enableLock'))
            };
            product.NetProtect.AdFilter.MonStatus['@value'] = Number(container.find('#AdFilter_MonStatus').prop('checked'));
            product.NetProtect.AdFilter.LogStatus = {};
            product.NetProtect.AdFilter.LogStatus['@attributes'] = {
                lock: Number(container.find('#AdFilter_lock_logStatus').hasClass('enableLock'))
            };
            product.NetProtect.AdFilter.LogStatus['@value'] = Number(container.find('#AdFilter_LogStatus').prop('checked'));
            product.NetProtect.AdFilter.RuleList = {};
            product.NetProtect.AdFilter.RuleList['@attributes'] = {
                lock: Number(container.find('#adUrlList_lock').hasClass('enableLock'))
            };
            product.NetProtect.AdFilter.RuleList.Rule = [];
            container.find('#adUrlList tbody tr').each(function (i, item) {
                var Rule = {};
                var td = $(item).find('td:eq(0)').attr('title');
                if (td) {
                    Rule['@attributes'] = {
                        lock: 1
                    };
                    Rule['@value'] = td;
                    product.NetProtect.AdFilter.RuleList.Rule.push(Rule);
                }
            });

            product.NetProtect.RsIpRule = {};
            // product.NetProtect.RsIpRule['@attributes'] = {
            //     lock: Number(container.find('#rsIpList_lock').hasClass('enableLock'))
            // };
            product.NetProtect.RsIpRule.MonStatus = {};
            product.NetProtect.RsIpRule.MonStatus['@attributes'] = {
                lock: Number(container.find('#rsIpList_lock_MonStatus').hasClass('enableLock'))
            };
            product.NetProtect.RsIpRule.MonStatus['@value'] = Number(container.find('#rsIpList_MonStatus').prop('checked'));
            product.NetProtect.RsIpRule.LogStatus = {};
            product.NetProtect.RsIpRule.LogStatus['@attributes'] = {
                lock: Number(container.find('#rsIpList_lock_LogStatus').hasClass('enableLock'))
            };
            product.NetProtect.RsIpRule.LogStatus['@value'] = Number(container.find('#rsIpList_LogStatus').prop('checked'));
            product.NetProtect.RsIpRule.AlertStatus = {};
            product.NetProtect.RsIpRule.AlertStatus['@attributes'] = {
                lock: Number(container.find('#rsIpList_lock_AlertStatus').hasClass('enableLock'))
            };
            product.NetProtect.RsIpRule.AlertStatus['@value'] = Number(container.find('#rsIpList_AlertStatus').prop('checked'));
            product.NetProtect.RsIpRule.BreakTimes = {};
            product.NetProtect.RsIpRule.BreakTimes['@attributes'] = {
                lock: Number(container.find('#rsIpList_lock_BreakTimes').hasClass('enableLock'))
            };
            product.NetProtect.RsIpRule.BreakTimes['@value'] = container.find('#rsIpList_BreakTimes').val();
            /*公共设置 end*/

            /*白名单 start*/
            product.WhiteUrlList = {};
            product.WhiteUrlList['@attributes'] = {
                lock: 0
            };
            product.WhiteUrlList.Rule = [];
            var WhiteUrlList = container.find('#WhiteUrlList tr').find('>td:first');
            for (var i = 0; i < WhiteUrlList.length; i++) {
                if ($(WhiteUrlList[i]).attr('title')) {
                    var Rule = {};
                    Rule['@attributes'] = {
                        id: $(WhiteUrlList[i]).attr('title')
                    };
                    product.WhiteUrlList.Rule.push(Rule);
                }
            }
            /*白名单 end*/

            /*防黑客攻击 start*/
            product.RsIpRuleList = {};
            product.RsIpRuleList['@attributes'] = {
                lock: 0
            };
            product.RsIpRuleList.Rule = [];
            var RsIpRuleList = container.find('#RsIpRuleList input[type=checkbox]');
            for (var i = 0; i < RsIpRuleList.length; i++) {
                var Rule = {};
                Rule['@attributes'] = {
                    id: $(RsIpRuleList[i]).attr('objid'),
                    lock: 0
                };
                Rule.Status = {};
                Rule.Status['@value'] = Number($(RsIpRuleList[i]).prop('checked'));
                Rule.Name = {};
                Rule.Name['@value'] = $(RsIpRuleList[i]).attr('objname');
                product.RsIpRuleList.Rule.push(Rule);
            }
            /*防黑客攻击 end*/
            var json = {
                product: product
            };
            return json;
        },
        toJson2: function (container) {
            function getRule(dl) {
                var TimeRule = {};
                var timeTxt = getTime(dl);
                TimeRule['@attributes'] = {
                    lock: Number(dl.find('[name=TimeRuleList_lock_TimeRule]').hasClass('enableLock')),
                    id: timeTxt
                };
                TimeRule.ValidTime = {};
                TimeRule.ValidTime['@value'] = timeTxt;
                TimeRule.RuleList = {};
                TimeRule.RuleList.Rule = [];
                var Rules = dl.find('.js_urls tr');
                var _Redirect = dl.find('.redirect').val();
                for (var i = 0; i < Rules.length; i++) {
                    var R = $(Rules[i]);
                    var V = R.find('[name=urls]').val();
                    if (!V) {
                        continue;
                    }
                    var Rule = {};
                    Rule['@attributes'] = {
                        id: $.md5(V)
                    };
                    Rule.Url = {};
                    Rule.Url['@value'] = V;
                    Rule.ControlMode = {};
                    Rule.ControlMode['@value'] = R.find('[name=control]').prop('checked') ? 1 : 2;
                    Rule.Alert = {};
                    Rule.Alert['@value'] = Number(R.find('[name=alert]').prop('checked'));
                    Rule.Redirect = {};
                    Rule.Redirect['@value'] = _Redirect;
                    TimeRule.RuleList.Rule.push(Rule);
                }

                return TimeRule;
            }

            function getRule2(dl) {
                var TimeRule = {};
                var timeTxt = getTime(dl);
                TimeRule['@attributes'] = {
                    lock: Number(dl.find('[name=TimeRule_lock]').hasClass('enableLock')),
                    id: timeTxt
                };
                TimeRule.ValidTime = {};
                TimeRule.ValidTime['@value'] = timeTxt;
                TimeRule.RuleList = {};
                TimeRule.RuleList.Rule = [];
                var Rules = dl.find('.net_pros tbody tr:not(.blank)');
                for (var i = 0; i < Rules.length; i++) {
                    var R = $(Rules[i]);
                    var Name = R.find('td:eq(0) span').text();
                    var Rule = {};
                    Rule['@attributes'] = {
                        id: Name
                    };
                    Rule.CheckMd5 = {};
                    Rule.CheckMd5['@value'] = Number(R.find('[name=md5]').prop('checked'));
                    Rule.AllowListen = {};
                    Rule.AllowListen['@value'] = Number(R.find('[name=listen]').prop('checked'));
                    Rule.AllowOutside = {};
                    Rule.AllowOutside['@value'] = Number(R.find('[name=outside]').prop('checked'));
                    Rule.SoftType = {};
                    Rule.SoftType['@value'] = R.find('td:eq(0) span').attr('_type');
                    Rule.SoftId = {};
                    Rule.SoftId['@value'] = Name;
                    TimeRule.RuleList.Rule.push(Rule);
                }

                return TimeRule;
            }

            function getTime(dl) {
                var time_mode = dl.find('.js_time_mode');
                var time_mode_val = time_mode.val();
                var targetTime = dl.find('.js_time' + time_mode_val);
                var arr = [];
                arr.push(time_mode_val);
                if (time_mode_val == 0) {
                    arr.push(targetTime.find('[name=start_time]').val());
                    arr.push(targetTime.find('[name=end_time]').val());
                } else if (time_mode_val == 1) {
                    arr.push(setDetialWek(targetTime.find('[name=week]')));
                    arr.push(targetTime.find('[name=start_time]').val());
                    arr.push(targetTime.find('[name=end_time]').val());
                } else {
                    //日期格式2015-9-7 00:00
                    arr.push(targetTime.find('[name=start_date]').val());
                    arr.push(targetTime.find('[name=end_date]').val());
                }
                return arr.join('|');

            }

            function setDetialWek(obj) {
                var arr = [];
                for (var i = 0; i < obj.length; i++) {
                    if (obj[i].checked) {
                        arr.push('1');
                    } else {
                        arr.push('0');
                    }
                }
                var str = arr.reverse().join('');
                return parseInt(str, 2);
            }

            var product = {};

            /*网址访问 start*/
            product.BrowserAudit = {};
            product.BrowserAudit['@attributes'] = {
                lock: Number(container.find('#BrowserAudit_lock').hasClass('enableLock'))
            };
            product.BrowserAudit.MonStatus = {};
            product.BrowserAudit.MonStatus['@attributes'] = {
                lock: Number(container.find('#BrowserAudit_lock_MonStatus').hasClass('enableLock'))
            };
            product.BrowserAudit.MonStatus['@value'] = Number(container.find('#BrowserAudit_MonStatus').prop('checked'));
            /*
            product.BrowserAudit.LogStatus = {};
            product.BrowserAudit.LogStatus['@attributes'] = {
                lock: Number(container.find('#BrowserAudit_lock_LogStatus').hasClass('enableLock'))
            };
            product.BrowserAudit.LogStatus['@value'] = Number(container.find('#BrowserAudit_LogStatus').prop('checked'));
            */
            product.BrowserAudit.LogAllWeb = {};
            product.BrowserAudit.LogAllWeb['@attributes'] = {
                lock: Number(container.find('#BrowserAudit_lock_LogAllWeb').hasClass('enableLock'))
            };
            product.BrowserAudit.LogAllWeb['@value'] = container.find('[name=BrowserAudit_LogAllWeb]:checked').val();
            product.BrowserAudit.TimeRuleList = {};
            product.BrowserAudit.TimeRuleList['@attributes'] = {
                lock: Number(container.find('#TimeRule_lock').hasClass('enableLock'))
            };
            product.BrowserAudit.TimeRuleList.TimeRule = [];
            var dls = container.find('#browserList tr:not(.blank)');
            for (var i = 0; i < dls.length; i++) {
                var dl = $(dls[i]['tpl_data']);
                var TimeRule = getRule(dl);
                product.BrowserAudit.TimeRuleList.TimeRule.push(TimeRule);
            }
            /*网址访问 end*/

            /*联网程序 start*/
            product.NetProcAudit = {};
            product.NetProcAudit['@attributes'] = {
                lock: Number(container.find('#NetProcAudit_lock').hasClass('enableLock'))
            };
            product.NetProcAudit.MonStatus = {};
            product.NetProcAudit.MonStatus['@attributes'] = {
                lock: Number(container.find('#NetProcAudit_lock_MonStatus').hasClass('enableLock'))
            };
            product.NetProcAudit.MonStatus['@value'] = Number(container.find('#NetProcAudit_MonStatus').prop('checked'));
            product.NetProcAudit.LogStatus = {};
            product.NetProcAudit.LogStatus['@attributes'] = {
                lock: Number(container.find('#NetProcAudit_lock_LogStatus').hasClass('enableLock'))
            };
            product.NetProcAudit.LogStatus['@value'] = Number(container.find('#NetProcAudit_LogStatus').prop('checked'));
            product.NetProcAudit.CheckRsSign = {};
            product.NetProcAudit.CheckRsSign['@attributes'] = {
                lock: Number(container.find('#NetProcAudit_lock_CheckRsSign').hasClass('enableLock'))
            };
            product.NetProcAudit.CheckRsSign['@value'] = Number(container.find('#NetProcAudit_CheckRsSign').prop('checked'));
            product.NetProcAudit.CheckModule = {};
            product.NetProcAudit.CheckModule['@attributes'] = {
                lock: Number(container.find('#NetProcAudit_lock_CheckModule').hasClass('enableLock'))
            };
            product.NetProcAudit.CheckModule['@value'] = Number(container.find('#NetProcAudit_CheckModule').prop('checked'));
            product.NetProcAudit.UnknowAction = {};
            product.NetProcAudit.UnknowAction['@attributes'] = {
                lock: Number(container.find('#NetProcAudit_lock_UnknowAction').hasClass('enableLock'))
            };
            product.NetProcAudit.UnknowAction['@value'] = container.find('[name=NetProcAudit_UnknownAction]:checked').val();
            product.NetProcAudit.TimeRuleList = {};
            product.NetProcAudit.TimeRuleList['@attributes'] = {
                lock: Number(container.find('#NetProcAudit_lock_TimeRuleList').hasClass('enableLock'))
            };
            product.NetProcAudit.TimeRuleList.TimeRule = [];
            var net_dls = container.find('#netList tr:not(.blank)');
            for (var i = 0; i < net_dls.length; i++) {
                var net_dl = $(net_dls[i]['tpl_data']);
                var TimeRule = getRule2(net_dl);
                product.NetProcAudit.TimeRuleList.TimeRule.push(TimeRule);
            }
            /*联网程序 end*/

            /*流量管理 start*/
            product.FluxMgr = {};
            product.FluxMgr['@attributes'] = {
                lock: Number(container.find('#FluxMgr_lock').hasClass('enableLock'))
            };
            product.FluxMgr.MonStatus = {};
            product.FluxMgr.MonStatus['@attributes'] = {
                lock: Number(container.find('#FluxMgr_lock_MonStatus').hasClass('enableLock'))
            };
            product.FluxMgr.MonStatus['@value'] = Number(container.find('#FluxMgr_MonStatus').prop('checked'));
            product.FluxMgr.LogTimer = {};
            product.FluxMgr.LogTimer['@attributes'] = {
                lock: Number(container.find('#FluxMgr_lock_MonStatus').hasClass('enableLock'))
            };
            product.FluxMgr.LogTimer['@value'] = container.find('#FluxMgr_LogTimer').val();
            /*流量管理 end*/

            /*adsl start*/
            product.AdslShare = {};
            // product.AdslShare['@attributes'] = {
            //     lock: Number(container.find('#AdslShare_lock').hasClass('enableLock'))
            // };
            product.AdslShare.MonStatus = {};
            product.AdslShare.MonStatus['@attributes'] = {
                lock: Number(container.find('#AdslShare_lock_MonStatus').hasClass('enableLock'))
            };
            product.AdslShare.MonStatus['@value'] = Number(container.find('#AdslShare_MonStatus').prop('checked'));
            product.AdslShare.TotalWidth = {};
            product.AdslShare.TotalWidth['@attributes'] = {
                lock: Number(container.find('#AdslShare_lock_TotalWidth').hasClass('enableLock'))
            };
            product.AdslShare.TotalWidth['@value'] = Number(container.find('#AdslShare_TotalWidth').val());
            /*adsl end*/

            /*共享管理 start*/
            product.ShareMgr = {};
            product.ShareMgr['@attributes'] = {
                lock: Number(container.find('#ShareMgr_lock').hasClass('enableLock'))
            };
            product.ShareMgr.FileLogStatus = {};
            product.ShareMgr.FileLogStatus['@attributes'] = {
                lock: Number(container.find('#ShareMgr_lock_FileLogStatus').hasClass('enableLock'))
            };
            product.ShareMgr.FileLogStatus['@value'] = Number(container.find('#ShareMgr_FileLogStatus').prop('checked'));
            product.ShareMgr.AccessLogStatus = {};
            product.ShareMgr.AccessLogStatus['@attributes'] = {
                lock: Number(container.find('#ShareMgr_lock_AccessLogStatus').hasClass('enableLock'))
            };
            product.ShareMgr.AccessLogStatus['@value'] = Number(container.find('#ShareMgr_AccessLogStatus').prop('checked'));
            product.ShareMgr.DisableDefaultShare = {};
            product.ShareMgr.DisableDefaultShare['@attributes'] = {
                lock: Number(container.find('#DisableDefaultShare_lock').hasClass('enableLock'))
            };
            var disable1 = container.find('#DisableDefaultShare_status1').prop('checked') ? 1 : 0;
            var disable2 = container.find('#DisableDefaultShare_status2').prop('checked') ? 4 : 0;
            var disable_value = disable1 + disable2;
            product.ShareMgr.DisableDefaultShare['@value'] = disable_value;

            product.ShareMgr.AccessControl = {};
            product.ShareMgr.AccessControl['@attributes'] = {
                lock: Number(container.find('#AccessControl_lock').hasClass('enableLock'))
            };
            product.ShareMgr.AccessControl.MonStatus = {};
            product.ShareMgr.AccessControl.MonStatus['@attributes'] = {
                lock: Number(container.find('#AccessControl_lock_MonStatus').hasClass('enableLock'))
            };
            product.ShareMgr.AccessControl.MonStatus['@value'] = Number(container.find('#AccessControl_MonStatus').prop('checked'));
            product.ShareMgr.AccessControl.AlertStatus = {};
            product.ShareMgr.AccessControl.AlertStatus['@attributes'] = {
                lock: Number(container.find('#AccessControl_lock_AlertStatus').hasClass('enableLock'))
            };
            product.ShareMgr.AccessControl.AlertStatus['@value'] = Number(container.find('#AccessControl_AlertStatus').prop('checked'));
            product.ShareMgr.AccessControl.ControlCode = {};
            product.ShareMgr.AccessControl.ControlCode['@attributes'] = {
                lock: Number(container.find('#AccessControl_lock_ControlCode').hasClass('enableLock'))
            };
            product.ShareMgr.AccessControl.ControlCode['@value'] = Number(container.find('[name=AccessControl_ControlCode]:checked').val());
            product.ShareMgr.AccessControl.RuleList = {};
            product.ShareMgr.AccessControl.RuleList['@attributes'] = {
                lock: Number(container.find('#AccessControl_lock_RuleList').hasClass('enableLock'))
            };
            product.ShareMgr.AccessControl.RuleList.Admin = {};
            var _ips = container.find('#ip_list tr:not(.blank)');
            _ips.length && (product.ShareMgr.AccessControl.RuleList.Admin.Rule = []);
            for (var i = 0; i < _ips.length; i++) {
                var ip = $(_ips[i]);
                var Rule = {};
                var ips = ip.find('td:eq(0)').attr('val'),
                    isIPs = ips.indexOf('|') > -1 ? 1 : 0,
                    isBan = ip.find('[name=js_ban]:checked').val();
                Rule['@value'] = [isBan, isIPs, ips].join('|');
                product.ShareMgr.AccessControl.RuleList.Admin.Rule.push(Rule);
            }
            /*共享管理 end*/

            var json = {
                product: product
            };
            return json;

        },
        /*toXml: function(json) {
      var xml = mustache.render(xmlTpl, json);
      return xml;
    },*/
        toHtml: function (container, json) {
            var opRadio = function (name, value) {
                container.find(':radio[name=' + name + '][value=' + value + ']').prop('checked', true);
            };
            var opCheck = function (id, status) {
                if (status == 1) {
                    return container.find(id).prop('checked', true);
                } else {
                    return container.find(id).prop('checked', false);
                }
            };
            var opLock = function (id, status) {
                if (status == 1) {
                    container.find(id).addClass('enableLock');
                } else {
                    container.find(id).removeClass('enableLock');
                }
            };



            var product = json.product;
            if (!product) {
                this._initRsIpTable(container);
                return false;
            }

            var NetProtect = product.NetProtect;
            var FwStatus = NetProtect.FwStatus;
            opLock('#FwStatus_lock', FwStatus['@attributes'].lock);
            opCheck('#pub_FwStatus', FwStatus['@value']);

            var WhiteUrlStatus = NetProtect.WhiteUrlStatus;
            opLock('#whiteList_lock', WhiteUrlStatus['@attributes'].lock);
            opCheck('#whiteList_WhiteUrlStatus', WhiteUrlStatus['@value']);

            var AntiEvilUrl = NetProtect.AntiEvilUrl;
            // opLock('#AntiEvilUrl_lock', AntiEvilUrl['@attributes'].lock);
            opLock('#AntiEvilUrl_lock_MonStatus', AntiEvilUrl.MonStatus['@attributes'].lock);
            opCheck('#AntiEvilUrl_MonStatus', AntiEvilUrl.MonStatus['@value']);
            opLock('#AntiEvilUrl_lock_LogStatus', AntiEvilUrl.LogStatus['@attributes'].lock);
            opCheck('#AntiEvilUrl_LogStatus', AntiEvilUrl.LogStatus['@value']);

            var AntiFishUrl = NetProtect.AntiFishUrl;
            // opLock('#AntiFishUrl_lock', AntiFishUrl['@attributes'].lock);
            opLock('#AntiFishUrl_lock_MonStatus', AntiFishUrl.MonStatus['@attributes'].lock);
            opCheck('#AntiFishUrl_MonStatus', AntiFishUrl.MonStatus['@value']);
            opLock('#AntiFishUrl_lock_LogStatus', AntiFishUrl.LogStatus['@attributes'].lock);
            opCheck('#AntiFishUrl_LogStatus', AntiFishUrl.LogStatus['@value']);

            var AntiEvilDown = NetProtect.AntiEvilDown;
            // opLock('#AntiEvilDown_lock', AntiEvilDown['@attributes'].lock);
            opLock('#AntiEvilDown_lock_MonStatus', AntiEvilDown.MonStatus['@attributes'].lock);
            opCheck('#AntiEvilDown_MonStatus', AntiEvilDown.MonStatus['@value']);
            opLock('#AntiEvilDown_lock_LogStatus', AntiEvilDown.LogStatus['@attributes'].lock);
            opCheck('#AntiEvilDown_LogStatus', AntiEvilDown.LogStatus['@value']);

            var SearchUrlProtect = NetProtect.SearchUrlProtect;
            // opLock('#SearchUrlProtect_lock', SearchUrlProtect['@attributes'].lock);
            opLock('#SearchUrlProtect_lock_MonStatus', SearchUrlProtect.MonStatus['@attributes'].lock);
            opCheck('#SearchUrlProtect_MonStatus', SearchUrlProtect.MonStatus['@value']);
            opLock('#SearchUrlProtect_lock_LogStatus', SearchUrlProtect.LogStatus['@attributes'].lock);
            opCheck('#SearchUrlProtect_LogStatus', SearchUrlProtect.LogStatus['@value']);

            var AntiXss = NetProtect.AntiXss;
            // opLock('#AntiXss_lock', AntiXss['@attributes'].lock);
            opLock('#AntiXss_lock_MonStatus', AntiXss.MonStatus['@attributes'].lock);
            opCheck('#AntiXss_MonStatus', AntiXss.MonStatus['@value']);
            opLock('#AntiXss_lock_LogStatus', AntiXss.LogStatus['@attributes'].lock);
            opCheck('#AntiXss_LogStatus', AntiXss.LogStatus['@value']);

            var AdFilter = NetProtect.AdFilter;
            // opLock('#AdFilter_lock', AdFilter['@attributes'].lock);
            opLock('#AdFilter_lock_MonStatus', AdFilter.MonStatus['@attributes'].lock);
            opCheck('#AdFilter_MonStatus', AdFilter.MonStatus['@value']);
            opLock('#AdFilter_lock_logStatus', AdFilter.LogStatus['@attributes'].lock);
            opCheck('#AdFilter_LogStatus', AdFilter.LogStatus['@value']);
            opLock('#adUrlList_lock', AdFilter.RuleList['@attributes'].lock);
            var AdRules = AdFilter.RuleList.Rule;
            $(AdRules).each(function (i, item) {
                $('#adUrlList').prepend('<tr><td style="width:380px;" title="' + item['@value'] + '">' + item['@value'] + '<td width="50"><a href="javascript:;" class="policyDel whiteList_btnRemove">&nbsp;</a>');
            });

            var RsIpRule = NetProtect.RsIpRule;
            // opLock('#rsIpList_lock', RsIpRule['@attributes'].lock);
            opLock('#rsIpList_lock_MonStatus', RsIpRule.MonStatus['@attributes'].lock);
            opCheck('#rsIpList_MonStatus', RsIpRule.MonStatus['@value']);
            opLock('#rsIpList_lock_LogStatus', RsIpRule.LogStatus['@attributes'].lock);
            opCheck('#rsIpList_LogStatus', RsIpRule.LogStatus['@value']);
            opLock('#rsIpList_lock_AlertStatus', RsIpRule.AlertStatus['@attributes'].lock);
            opCheck('#rsIpList_AlertStatus', RsIpRule.AlertStatus['@value']);
            opLock('#rsIpList_lock_BreakTimes', RsIpRule.BreakTimes['@attributes'].lock);
            container.find('#rsIpList_BreakTimes').val(RsIpRule.BreakTimes['@value']);

            var WhiteUrlList = product.WhiteUrlList;
            var WhiteUrlList_rule = WhiteUrlList.Rule;
            for (var i = 0; i < WhiteUrlList_rule.length; i++) {
                var url = WhiteUrlList_rule[i]['@attributes'].id;
                container.find('#WhiteUrlList').append('<tr><td style="width:380px;" title="' + url + '">' + url + '<td width="50"><a href="javascript:;" class="policyDel whiteList_btnRemove">&nbsp;</a>');
            }

            var RsIpRuleList = product.RsIpRuleList;
            var RsIpRuleList_rule = RsIpRuleList.Rule;
            var RsIpdata = [];
            for (var i = 0; i < RsIpRuleList_rule.length; i++) {
                var RsIps = RsIpRuleList_rule[i];
                RsIpdata.push({
                    'ID': RsIps['@attributes']['id'],
                    'Name': RsIps.Name['@value'],
                    'bInuse': RsIps.Status['@value']
                });
            }
            this._initRsIpTable(container, RsIpdata);
            container.find('#whiteList_WhiteUrlStatus').trigger('change');
        },
        toHtml2: function (container, json) {
            var opRadio = function (name, value) {
                container.find(':radio[name=' + name + '][value=' + value + ']').prop('checked', true);
            };
            var opCheck = function (id, status) {
                if (status == 1) {
                    return container.find(id).prop('checked', true);
                } else {
                    return container.find(id).prop('checked', false);
                }
            };
            var opLock = function (id, status) {
                if (status == 1) {
                    container.find(id).addClass('enableLock');
                } else {
                    container.find(id).removeClass('enableLock');
                }
            };

            function getDetialWek(str) {
                var num = parseInt(str).toString(2);
                var num_len = num.length;
                num = '0000000'.slice(num_len) + num;
                var arr = [0, 0, 0, 0, 0, 0, 0];
                var len = arr.length - 1;
                for (var i = 0; i < num.length; i++) {
                    arr[len - i] = num[i];
                }
                return arr;
            }
            /*BrowserAudit TimeRuleList*/
            function setTimeRule2HTML(TimeRule, target, temp_html) {
                TimeRule['@attributes'].lock == '1' && temp_html.find('[name=TimeRuleList_lock_TimeRule]').addClass('enableLock');
                var validTime = TimeRule.ValidTime['@value'].split('|');
                var tpl_time = '';
                var tpl_week = [];
                if (validTime[0] == 0) {
                    temp_html.find('.js_time_mode option:eq(0)').prop('selected', true);
                    temp_html.find('.js_time0').removeClass('hide').end().find('.js_time1,.js_time2').addClass('hide');
                    temp_html.find('.js_time0 [name=start_time]').val(validTime[1]);
                    temp_html.find('.js_time0 [name=end_time]').val(validTime[2]);

                    tpl_time = '每天：' + temp_html.find('.js_time0 [name=start_time]').val() + '--' + temp_html.find('.js_time0 [name=end_time]').val();
                } else if (validTime[0] == 1) {
                    temp_html.find('.js_time_mode option:eq(1)').prop('selected', true);
                    temp_html.find('.js_time1').removeClass('hide').end().find('.js_time0,.js_time2').addClass('hide');
                    var weekArr = getDetialWek(validTime[1]);
                    var weekmark = temp_html.find('[name=week]');
                    for (var i = 0; i < weekArr.length; i++) {
                        if (weekArr[i] == '1') {
                            $(weekmark[i]).attr('checked', 'checked').parent().addClass('active');
                        } else {
                            $(weekmark[i]).removeAttr('checked').parent().removeClass('active');
                        }
                    }
                    temp_html.find('.js_time1 [name=start_time]').val(validTime[2]);
                    temp_html.find('.js_time1 [name=end_time]').val(validTime[3]);

                    temp_html.find('.js_time1 [name=week]').each(function () {
                        $(this).prop('checked') && tpl_week.push($(this).closest('label').text());
                    });
                    if (tpl_week.length) {
                        tpl_week = '周' + tpl_week.join('、');
                    }
                    tpl_time = '每周：' + tpl_week + '  ' + temp_html.find('.js_time1 [name=start_time]').val() + '--' + temp_html.find('.js_time1 [name=end_time]').val();

                } else if (validTime[0] == 2) {
                    temp_html.find('.js_time_mode option:eq(2)').prop('selected', true);
                    temp_html.find('.js_time2').removeClass('hide').end().find('.js_time1,.js_time0').addClass('hide');
                    temp_html.find('.js_time2 [name=start_date]').val(validTime[1]);
                    temp_html.find('.js_time2 [name=end_date]').val(validTime[2]);

                    tpl_time = '从' + temp_html.find('.js_time2 [name=start_date]').val() + '--' + temp_html.find('.js_time2 [name=end_date]').val();
                }
                var RuleList = TimeRule.RuleList;
                var RuleList_Rule = RuleList.Rule;
                var jsUrls = temp_html.find('.js_urls');
                var temp = '<tr>' +
                    '<td style="width:300px;"><input type="text" style="width:293px;" class="input-large" name="urls" validation="noequal require" targets=".js_urls"></td>' +
                    '<td>' +
                    '<label class="checkbox inline"><input type="checkbox" value="" name="alert">提示</label>' +
                    '<label class="checkbox inline"><input type="checkbox" value="" name="control">拦截</label>' +
                    '</td></tr>';
                jsUrls.html('<tr class="blank"><td style="width:300px;"></td><td></td></tr>');
                for (var i = 0; i < RuleList_Rule.length; i++) {
                    var Rule = RuleList_Rule[i];
                    setRuleList2HTML(Rule, jsUrls, $(temp));
                    temp_html.find('.redirect').val(Rule.Redirect['@value']);
                }


                var tr = $('<tr><td style="width:300px;">' + tpl_time + '</td><td style="width:80px">' + RuleList_Rule.length + '</td><td style="text-align:center;"><i class="edit">&nbsp;</i><i class="del">&nbsp;</i></td></tr>');
                tr[0]['tpl_data'] = temp_html;
                target.append(tr);

            }
            /*BrowserAudit RuleList*/
            function setRuleList2HTML(Rule, jsUrls, temp_html) {
                temp_html.find('[name=urls]').val(Rule.Url['@value']);
                temp_html.find('[name=alert]').prop('checked', Rule.Alert['@value'] == 1 ? true : false);
                temp_html.find('[name=control]').prop('checked', Rule.ControlMode['@value'] == 1 ? true : false);
                jsUrls.prepend(temp_html);
            }

            function setTimeRule2HTML4Net(TimeRule, target, temp_html) {
                TimeRule['@attributes'].lock == '1' && temp_html.find('[name=TimeRule_lock]').addClass('enableLock');
                var tpl_time = '';
                var tpl_week = [];
                var validTime = TimeRule.ValidTime['@value'].split('|');
                if (validTime[0] == 0) {
                    temp_html.find('.js_time_mode option:eq(0)').prop('selected', true);
                    temp_html.find('.js_time0').removeClass('hide').end().find('.js_time1,.js_time2').addClass('hide');
                    temp_html.find('.js_time0 [name=start_time]').val(validTime[1]);
                    temp_html.find('.js_time0 [name=end_time]').val(validTime[2]);

                    tpl_time = '每天：' + temp_html.find('.js_time0 [name=start_time]').val() + '--' + temp_html.find('.js_time0 [name=end_time]').val();
                } else if (validTime[0] == 1) {
                    temp_html.find('.js_time_mode option:eq(1)').prop('selected', true);
                    temp_html.find('.js_time1').removeClass('hide').end().find('.js_time0,.js_time2').addClass('hide');
                    var weekArr = getDetialWek(validTime[1]);
                    var weekmark = temp_html.find('[name=week]');
                    for (var i = 0; i < weekArr.length; i++) {
                        if (weekArr[i] == '1') {
                            $(weekmark[i]).attr('checked', 'checked').parent().addClass('active');
                        } else {
                            $(weekmark[i]).removeAttr('checked').parent().removeClass('active');
                        }
                    }
                    temp_html.find('.js_time1 [name=start_time]').val(validTime[2]);
                    temp_html.find('.js_time1 [name=end_time]').val(validTime[3]);

                    temp_html.find('.js_time1 [name=week]').each(function () {
                        $(this).prop('checked') && tpl_week.push($(this).closest('label').text());
                    });
                    if (tpl_week.length) {
                        tpl_week = '周' + tpl_week.join('、');
                    }
                    tpl_time = '每周：' + tpl_week + '  ' + temp_html.find('.js_time1 [name=start_time]').val() + '--' + temp_html.find('.js_time1 [name=end_time]').val();
                } else if (validTime[0] == 2) {
                    temp_html.find('.js_time_mode option:eq(2)').prop('selected', true);
                    temp_html.find('.js_time2').removeClass('hide').end().find('.js_time1,.js_time0').addClass('hide');
                    temp_html.find('.js_time2 [name=start_date]').val(validTime[1]);
                    temp_html.find('.js_time2 [name=end_date]').val(validTime[2]);

                    tpl_time = '从' + temp_html.find('.js_time2 [name=start_date]').val() + '--' + temp_html.find('.js_time2 [name=end_date]').val();
                }
                var RuleList = TimeRule.RuleList;
                var RuleList_Rule = RuleList.Rule;
                var jsUrls = temp_html.find('#net_pros');
                var tableData = [];
                for (var i = 0; i < RuleList_Rule.length; i++) {
                    var Rule = RuleList_Rule[i];
                    var da = {
                        Name: Rule.SoftId['@value'],
                        md5: Rule.CheckMd5['@value'],
                        listen: Rule.AllowListen['@value'],
                        outside: Rule.AllowOutside['@value'],
                        type: Rule.SoftType['@value']
                    };
                    tableData.push(da);
                }
                op.initNetPro2(temp_html, tableData);
                var tr = $('<tr><td style="width:300px;">' + tpl_time + '</td><td style="width:80px">' + RuleList_Rule.length + '</td><td style="text-align:center;"><i class="edit">&nbsp;</i><i class="del">&nbsp;</i></td></tr>');
                tr[0]['tpl_data'] = temp_html;
                target.append(tr);
            }

            var product = json.product;
            if (!product) {
                /*时间控件*/
                this.initTime(container);
                this.initNetPro(container);
                return;
            }

            var BrowserAudit = product.BrowserAudit;
            opLock('#BrowserAudit_lock', BrowserAudit['@attributes'].lock);
            opLock('#BrowserAudit_lock_MonStatus', BrowserAudit.MonStatus['@attributes'].lock);
            opCheck('#BrowserAudit_MonStatus', BrowserAudit.MonStatus['@value']);
            // opLock('#BrowserAudit_lock_LogStatus', BrowserAudit.LogStatus['@attributes'].lock);
            // opCheck('#BrowserAudit_LogStatus', BrowserAudit.LogStatus['@value']);
            opLock('#BrowserAudit_lock_LogAllWeb', BrowserAudit.LogAllWeb['@attributes'].lock);
            opRadio('BrowserAudit_LogAllWeb', BrowserAudit.LogAllWeb['@value']);

            var brow_TimeRuleList = BrowserAudit.TimeRuleList;
            opLock('#TimeRule_lock', brow_TimeRuleList['@attributes'].lock);
            var brow_TimeRuleList_target = $('#browserList');
            var temp_html = '<div class="policy-bod"><dl class="policy-rule-tpl">' +
                '<dd>' +
                '<span class="inblock" style="width:97px;margin-left:-17px;"><i name="TimeRule_lock" class="lock"></i>受限时间：</span>' +
                '<label class="mb5 inblock">' +
                '<select class="input-small js_time_mode" style="width:120px;">' +
                '<option value="0">每天</option>' +
                '<option value="1">每周</option>' +
                '<option value="2">时间段</option>' +
                '</select>' +
                '</label>' +
                '</dd>' +
                '<dd>' +
                '<div class="js_time0">' +
                '<input type="text" value="" class="input-mini js_time" name="start_time" validation="require">' +
                '<span>至</span>' +
                '<input type="text" value="" class="input-mini js_time" name="end_time" validation="require">' +
                '<span class="help-inline">(例 00:00 ~ 23:59)</span>' +
                '</div>' +
                '<div class="hide js_time1 policy-week">' +
                '<label class="checkbox"><input type="checkbox" name="week">一</label>' +
                '<label class="checkbox"><input type="checkbox" name="week">二</label>' +
                '<label class="checkbox"><input type="checkbox" name="week">三</label>' +
                '<label class="checkbox"><input type="checkbox" name="week">四</label>' +
                '<label class="checkbox"><input type="checkbox" name="week">五</label>' +
                '<label class="checkbox"><input type="checkbox" name="week">六</label>' +
                '<label class="checkbox"><input type="checkbox" name="week">日</label>' +
                '<input type="text" value="" class="input-mini js_time ml10" name="start_time">' +
                '<span>至</span>' +
                '<input type="text" value="" class="input-mini js_time" name="end_time"  validation="require">' +
                '<span class="help-inline">(例 00:00 ~ 23:59)</span>' +
                '</div>' +
                '<div class="hide js_time2">' +
                '<span>日期</span>' +
                '<input type="text" value="" class="input-medium js_date" name="start_date" validation="require">' +
                '<span>至</span>' +
                '<input type="text" value="" class="input-medium js_date"  name="end_date" validation="require">' +
                '</div>' +
                '</dd>' +
                '<dd>' +
                '<span class="inblock" style="width:80px;">受限网址：</span>' +
                '<button class="btn btn-small ml10 add_urls btn-add" >&nbsp;</button>' +
                '</dd>' +
                '<dd class="" style="width:440px">' +
                '<table class="whiteListBoxTit">' +
                '<tr>' +
                '<td style="width:300px;">受限网址</td>' +
                '<td>操作</td>' +
                '</tr>' +
                '</table>' +
                '<div class="whiteList">' +
                '<div class="js_white_wrap">' +
                '<table class="js_urls"></table>' +
                '</div>' +
                '</div>' +
                '</dd>' +
                '<dd>注：https或指定端口网址仅按域名匹配进行拦截！</dd>' +
                '<dd>' +
                '<span class="inblock"  style="width:80px;">强制跳转：</span>' +
                '<label class="inblock"><input type="text" value="" class="input-large redirect" validation="require"></label>' +
                '</dd>' +
                '</dl></div>';
            var brow_TimeRuleList_TimeRule = brow_TimeRuleList.TimeRule;
            if (brow_TimeRuleList_TimeRule.length) {
                brow_TimeRuleList_target.html('');
                for (var i = 0; i < brow_TimeRuleList_TimeRule.length; i++) {
                    var TimeRule = brow_TimeRuleList_TimeRule[i];
                    var target = $('#browserList');
                    setTimeRule2HTML(TimeRule, target, $(temp_html).clone());
                }
            }

            var NetProcAudit = product.NetProcAudit;
            opLock('#NetProcAudit_lock', NetProcAudit['@attributes'].lock);
            opLock('#NetProcAudit_lock_MonStatus', NetProcAudit.MonStatus['@attributes'].lock);
            opCheck('#NetProcAudit_MonStatus', NetProcAudit.MonStatus['@value']);
            opLock('#NetProcAudit_lock_LogStatus', NetProcAudit.LogStatus['@attributes'].lock);
            opCheck('#NetProcAudit_LogStatus', NetProcAudit.LogStatus['@value']);
            opLock('#NetProcAudit_lock_CheckModule', NetProcAudit.CheckModule['@attributes'].lock);
            opCheck('#NetProcAudit_CheckModule', NetProcAudit.CheckModule['@value']);
            opLock('#NetProcAudit_lock_CheckRsSign', NetProcAudit.CheckRsSign['@attributes'].lock);
            opCheck('#NetProcAudit_CheckRsSign', NetProcAudit.CheckRsSign['@value']);
            opLock('#NetProcAudit_lock_UnknowAction', NetProcAudit.UnknowAction['@attributes'].lock);
            opRadio('NetProcAudit_UnknownAction', NetProcAudit.UnknowAction['@value']);
            var Net_TimeRuleList = NetProcAudit.TimeRuleList;
            opLock('#NetProcAudit_lock_TimeRuleList', Net_TimeRuleList['@attributes'].lock);
            var target = container.find('#netList');
            var temp_html = '<div class="policy-bod"><dl class="policy-rule-tpl">' +
                '<dd>' +
                '<span class="inblock" style="width:97px;margin-left:-17px;"><i name="TimeRule_lock" class="lock"></i>受限时间</span>' +
                '<label class="mb5 inblock">' +
                '<select class="input-small js_time_mode" style="width:120px;">' +
                '<option value="0">每天</option>' +
                '<option value="1">每周</option>' +
                '<option value="2">时间段</option>' +
                '</select>' +
                '</label>' +
                '</dd>' +
                '<dd>' +
                '<div class="js_time0">' +
                '<input type="text" value="" class="input-mini js_time" name="start_time" validation="require">' +
                '<span>至</span>' +
                '<input type="text" value="" class="input-mini js_time" name="end_time" validation="require">' +
                '<span class="help-inline">(例 00:00 ~ 23:59)</span>' +
                '</div>' +
                '<div class="hide js_time1 policy-week">' +
                '<label class="checkbox inline"><input type="checkbox" name="week">日</label>' +
                '<label class="checkbox inline"><input type="checkbox" name="week">一</label>' +
                '<label class="checkbox inline"><input type="checkbox" name="week">二</label>' +
                '<label class="checkbox inline"><input type="checkbox" name="week">三</label>' +
                '<label class="checkbox inline"><input type="checkbox" name="week">四</label>' +
                '<label class="checkbox inline"><input type="checkbox" name="week">五</label>' +
                '<label class="checkbox inline"><input type="checkbox" name="week">六</label>' +
                '<input type="text" value="" class="input-mini ml10 js_time" name="start_time">' +
                '<span>至</span>' +
                '<input type="text" value="" class="input-mini js_time" name="end_time" validation="require">' +
                '<span class="help-inline">(例 00:00 ~ 23:59)</span>' +
                '</div>' +
                '<div class="hide js_time2">' +
                '<span>日期</span>' +
                '<input type="text" value="" class="input-medium js_date" name="start_date" validation="require">' +
                '<span>至</span>' +
                '<input type="text" value="" class="input-medium js_date"  name="end_date"> validation="require">' +
                '</div>' +
                '</dd>' +
                '<dd>' +
                '<span>受限程序</span>' +
                '<button  class="btn btn-small ml10 net_add_pro btn-add" >&nbsp;</button>' +
                '</dd>' +
                '<dd>' +
                '<dd class="" style="width:500px;">' +
                '<table class="whiteListBoxTit">' +
                '<tr>' +
                '<td style="width:250px;">受限程序</td>' +
                '<td style="width:60px;">防篡改</td>' +
                '<td style="width:70px;">禁止监听</td>' +
                '<td style="width:70px;">禁止联网</td>' +
                '</tr>' +
                '</table>' +
                '<div class="whiteList">' +
                '<div class="js_white_wrap">' +
                '<table class="net_pros"></table>' +
                '</div>' +
                '</div>' +
                '</dd>' +
                '</dd>' +
                '</dl>' +
                '</div>';
            var Net_TimeRuleList_TimeRule = NetProcAudit.TimeRuleList.TimeRule;
            if (Net_TimeRuleList_TimeRule.length) {
                target.html('');
                for (var i = 0; i < Net_TimeRuleList_TimeRule.length; i++) {
                    var TimeRule = Net_TimeRuleList_TimeRule[i];
                    setTimeRule2HTML4Net(TimeRule, target, $(temp_html));
                }
            }

            var FluxMgr = product.FluxMgr;
            opLock('#FluxMgr_lock', FluxMgr['@attributes'].lock);
            opLock('#FluxMgr_lock_MonStatus', FluxMgr.MonStatus['@attributes'].lock);
            opCheck('#FluxMgr_MonStatus', FluxMgr.MonStatus['@value']);
            opLock('#FluxMgr_lock_LogTimer', FluxMgr.LogTimer['@attributes'].lock);
            container.find('#FluxMgr_LogTimer').val(FluxMgr.LogTimer['@value']);

            var AdslShare = product.AdslShare;
            // opLock('#AdslShare_lock', AdslShare['@attributes'].lock);
            // opLock('#AdslShare_lock_MonStatus', AdslShare.MonStatus['@attributes'].lock);
            opCheck('#AdslShare_MonStatus', AdslShare.MonStatus['@value']);
            opLock('#AdslShare_lock_TotalWidth', AdslShare.TotalWidth['@attributes'].lock);
            container.find('#AdslShare_TotalWidth').val(AdslShare.TotalWidth['@value']);

            var ShareMgr = product.ShareMgr;
            opLock('#ShareMgr_lock', ShareMgr['@attributes'].lock);
            opLock('#ShareMgr_lock_FileLogStatus', ShareMgr.FileLogStatus['@attributes'].lock);
            opCheck('#ShareMgr_FileLogStatus', ShareMgr.FileLogStatus['@value']);
            opLock('#ShareMgr_lock_AccessLogStatus', ShareMgr.AccessLogStatus['@attributes'].lock);
            opCheck('#ShareMgr_AccessLogStatus', ShareMgr.AccessLogStatus['@value']);
            opLock('#DisableDefaultShare_lock', ShareMgr.DisableDefaultShare['@attributes'].lock);
            switch (ShareMgr.DisableDefaultShare['@value']) {
                case 0:
                    container.find('#DisableDefaultShare_status1').prop('checked', false);
                    container.find('#DisableDefaultShare_status2').prop('checked', false);
                    break;
                case 1:
                    container.find('#DisableDefaultShare_status1').prop('checked', true);
                    container.find('#DisableDefaultShare_status2').prop('checked', false);
                    break;
                case 4:
                    container.find('#DisableDefaultShare_status1').prop('checked', false);
                    container.find('#DisableDefaultShare_status2').prop('checked', true);
                    break;
                case 5:
                    container.find('#DisableDefaultShare_status1').prop('checked', true);
                    container.find('#DisableDefaultShare_status2').prop('checked', true);
                    break;
            }
            var AccessControl = ShareMgr.AccessControl;
            opLock('#AccessControl_lock', AccessControl['@attributes'].lock);
            opLock('#AccessControl_lock_MonStatus', AccessControl.MonStatus['@attributes'].lock);
            opCheck('#AccessControl_MonStatus', AccessControl.MonStatus['@value']);
            opLock('#AccessControl_lock_LogStatus', AccessControl.MonStatus['@attributes'].lock);
            opCheck('#AccessControl_LogStatus', AccessControl.MonStatus['@value']);
            opLock('#AccessControl_lock_AlertStatus', AccessControl.MonStatus['@attributes'].lock);
            opCheck('#AccessControl_AlertStatus', AccessControl.MonStatus['@value']);
            opLock('#AccessControl_lock_ControlCode', AccessControl.MonStatus['@attributes'].lock);
            opRadio('AccessControl_ControlCode', AccessControl.MonStatus['@value']);

            var RuleLists = AccessControl.RuleList.Admin;
            opLock('#AccessControl_lock_RuleList', AccessControl.MonStatus['@attributes'].lock);
            var RuleLists_Rule = RuleLists ? RuleLists.Rule : [];

            for (var i = 0; i < RuleLists_Rule.length; i++) {
                var rule = RuleLists_Rule[i];
                var arr = rule['@value'].split('|');
                var isBan = arr[0],
                    isIPs = arr[1],
                    ips = '';
                if (arr[4]) {
                    ips = arr[3] + '--' + arr[4];
                } else {
                    ips = arr[3];
                }
                var html = '<tr><td style="width:290px" val="' + ips + '">' + ips + '</td>' +
                    '<td style="width:90px;"><label><input type="radio" name="js_ban" value="1" ' + (isBan == 1 ? 'checked' : '') + '>禁止</label>' +
                    '<label><input type="radio" name="js_ban" value="0"' + (isBan == 0 ? 'checked' : '') + '>允许</label></td>' +
                    '<td style="text-align:center;"><i class="del js_remove">&nbsp;</i></td></tr>';
                container.find('#ip_list').append(html);
            }
            /*时间控件*/
            this.initTime(container);

        }
    };

    return {
        container: '.c-page-content',
        render: function (container) {
            var policys = RsCore.config.protection.policy,
                path = window.location.hash.split('?')[0],
                params = getUrlSearchQuerys(),
                groupId = params['g'],
                policyJSON = {};
            if (RsCore.cache.group.list[groupId]) {
                if (RsCore.cache.group.list[groupId].type == 2) {
                    $('.c-page-nav .nav li:eq(0) a').trigger('click');
                    return;
                }
                if (groupId == '-1') {
                    $('.c-page-nav .nav li:eq(0) a').trigger('click');
                    return;
                }
            }
            if (groupId == '0' && !params['c']) {
                $(container).append('<div  class="no-setting"><div></div><span>“已加入终端”无设置，请查看具体分组设置</span></div>');
                return false;
            }
            $(container).append(tpl);
            var tick = 0;

            RsCore.ajax('Policy/getPolicy', {
                grouptype: params['c'] ? 2 : 1,
                objid: params['c'] || params['g'],
                productid: policys[0].value.split('_')[0],
                eid: RsCore.cache.group.eid,
                policytype: policys[0].value.split('_')[1]
            }, function (result) {
                if (result) {
                    policyJSON[policys[0].value] = $.parseJSON(result.policyjson);
                } else {
                    policyJSON[policys[0].value] = null;
                }
                tick++;
                if (tick == 2) {
                    op.init($(container), policyJSON);
                }
            });
            RsCore.ajax('Policy/getPolicy', {
                grouptype: params['c'] ? 2 : 1,
                objid: params['c'] || params['g'],
                productid: policys[1].value.split('_')[0],
                eid: RsCore.cache.group.eid,
                policytype: policys[1].value.split('_')[1]
            }, function (result) {
                if (result) {
                    policyJSON[policys[1].value] = $.parseJSON(result.policyjson);
                } else {
                    policyJSON[policys[1].value] = null;
                }
                tick++;
                if (tick == 2) {
                    op.init($(container), policyJSON);
                }
            });



        },
        destroy: function () {
            $(window).off('resize.policy');
            $(this.container).off().empty();
        }
    };
});