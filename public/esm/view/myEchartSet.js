define(function (require) {
    require('dep/underscore');
    var echarts = require('echarts3');
    var initPc, //客户端详情PC
        initMob, //客户端详情moblie
        initThreat, //威胁终端
        initSys, //操作系统分布
        initVirus, //病毒数量
        initVirus2, //病毒查杀
        initNetwork, //违规联网
        initFlow, //当日流量排行
        initInterception, //骚扰拦截 
        initMap, //终端定位 
        initSite; //恶意网址拦截 
    /**
     * 内置方法
     */
    var virus_file_date_tranfs, //病毒数据转换
        findXavByType_Id, //按病毒类型找到所有病毒数据
        findXavByType, //按类型找出所有数据
        getDatasTime, //获取数据时间间隔(一种数据时)
        getDatasTimeByKey, //获取时间间隔(多种数据时  按key查找)
        getVirusByType, //按类型(个数，文件)获取病毒数
        splitN, //获取应该分隔个数
        getPreDate, //获取7天时间日期(处理过，展示用)
        getDate; //获取7天时间日期

    initPc = function (datas) {
        //datas = {won:900000,woff:1};
        var info = {
            online: datas.won,
            offline: datas.woff
        };
        var on = info.online,
            off = info.offline;

        //处理两个都为0时的情况
        if (on == 0 && off == 0) {
            on = 0;
            off = 1;
        }
        var setting = {
            legend: {
                data: ['在线 ' + info.online, '离线 ' + info.offline],
                y: 'bottom',
                itemWidth: 5,
                itemHeight: 12,
                formatter: '{name}',
                selectedMode: false
            },
            startAngle: 90,
            series: [{
                name: 'pc',
                type: 'pie',
                radius: ['38%', '45%'],
                xAxis: [0],
                yAxis: [0],
                label: {
                    normal: {
                        show: false,
                        formatter: function (params) {
                            var on = info.online,
                                off = info.offline,
                                total = on + off,
                                percent = 0;
                            if (on == 0) {
                                percent = 0;
                                return percent + '%';
                            }
                            if (off == 0) {
                                percent = 100;
                                return percent + '%';
                            }
                            var per = (on / total) * 100;
                            if (per > 0 && per < 0.1) {
                                percent = 0.1;
                                return percent + '%';
                            }
                            if (per < 100 && per > 99.9) {
                                percent = 99.9;
                                return percent + '%';
                            }
                            return per.toFixed(1) + '%';
                        }
                    }
                },
                data: [{
                    'value': '' + on,
                    'name': '在线 ' + info.online,
                    'itemStyle': {
                        'normal': {
                            'color': '#29bcef'
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'outside'
                        },
                        emphasis: {
                            show: true,
                            position: 'outside'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: true,
                            length: 6,
                            length2: 5
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    hoverAnimation: false
                }, {
                    'value': '' + off,
                    'name': '离线 ' + info.offline,
                    'itemStyle': {
                        'normal': {
                            'color': '#ccc'
                        }
                    },
                    hoverAnimation: false
                }],
                markPoint: {
                    symbol: 'image://../public/esm/img/icon/client-center.png',
                    symbolSize: 50,
                    label: {
                        normal: {
                            show: true,
                            formatter: '{b}',
                            textStyle: {
                                color: '#29bcef'
                            }
                        }
                    },
                    data: [{
                        name: '' + (info.online + info.offline),
                        x: '50%',
                        y: '55%'
                    }]
                }
            }]
        };

        return setting;
    };

    initMob = function (datas) {
        var info = {
            online: datas.anon,
            offline: datas.anoff
        };
        var on = info.online,
            off = info.offline;
        //处理两个都为0时的情况
        if (on == 0 && off == 0) {
            on = 0;
            off = 1;
        }
        var setting = {
            legend: {
                data: ['在线 ' + info.online, '离线 ' + info.offline],
                y: 'bottom',
                itemWidth: 5,
                itemHeight: 12,
                formatter: '{name}',
                selectedMode: false
            },
            startAngle: 90,
            series: [{
                name: 'pc',
                type: 'pie',
                radius: ['38%', '45%'],
                xAxis: [0],
                yAxis: [0],
                label: {
                    normal: {
                        show: false,
                        formatter: function (params) {
                            var on = info.online,
                                off = info.offline,
                                total = on + off,
                                percent = 0;
                            if (on == 0) {
                                percent = 0;
                                return percent + '%';
                            }
                            if (off == 0) {
                                percent = 100;
                                return percent + '%';
                            }
                            var per = (on / total) * 100;
                            if (per > 0 && per < 0.1) {
                                percent = 0.1;
                                return percent + '%';
                            }
                            if (per < 100 && per > 99.9) {
                                percent = 99.9;
                                return percent + '%';
                            }
                            return per.toFixed(1) + '%';
                        }
                    }
                },
                data: [{
                    value: '' + on,
                    name: '在线 ' + info.online,
                    itemStyle: {
                        normal: {
                            color: '#7db53a'
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'outside'
                        },
                        emphasis: {
                            show: true,
                            position: 'outside'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: true,
                            length: 6,
                            length2: 5
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    hoverAnimation: false
                }, {
                    value: '' + off,
                    name: '离线 ' + info.offline,
                    itemStyle: {
                        normal: {
                            color: '#ccc'
                        }
                    },
                    hoverAnimation: false
                }],
                markPoint: {
                    symbol: 'image://../public/esm/img/icon/mobile-center.png',
                    symbolSize: 50,
                    label: {
                        normal: {
                            show: true,
                            formatter: '{b}',
                            textStyle: {
                                color: '#7db53a'
                            }
                        }
                    },
                    data: [{
                        name: '' + (info.online + info.offline),
                        x: '50%',
                        y: '55%'
                    }]

                }

            }]
        };
        return setting;
    };

    initSys = function (datas) {
        // datas = {'Win7':"2","Win10":"8"};
        var _datas = {};
        _.each(datas, function (val, key, obj) {
            if (val == 0) {
                return;
            } else {
                _datas[key] = val;
            }
        });
        var os_type = _.map(_datas, function (val, key, obj) {
            var k = key.split(' ');
            return _.map(k, function (ele, idx, arr) {
                return ele[0].toUpperCase() + ele.substring(1);
            }).join(' ');
        });
        var num_sys = _.map(_datas, function (val, key, obj) {
            return val;
        });

        for (var i = os_type.length; i < 7; i++) {
            os_type.push('');
            num_sys.push('');
        }
        var max = +Math.max.apply(null, num_sys);
        var splitNumber = splitN(max, 5);

        max = max + (max / splitNumber);

        var setting = {
            tooltip: {
                show: true,
                showContent: true //,
                // trigger: "axis",
                // axisPointer: {
                //     type: "shadow",
                //     shadowStyle:{
                //         opacity:0
                //     }
                // },
                // formatter:function(params){
                //     if(params['value']){
                //         return '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'+params['color']+'"></span>'+params['seriesName']+':'+params['value']+'<br/>'
                //     }else{
                //         return '';
                //     }

                // }
            },
            xAxis: [{
                type: 'category',
                nameLocation: 'middle',
                splitArea: {
                    show: false,
                    areaStyle: {
                        color: ['#eee']
                    },
                    shadowBlur: 0
                },
                data: os_type,
                axisLabel: {
                    interval: 0,
                    textStyle: {
                        color: '#ccc'
                    },
                    formatter: function (value) {
                        if (value.length > 7) {
                            return $.trim(value.substring(0, 7)) + '\n' + $.trim(value.substring(7));
                        } else {
                            return value;
                        }
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            }],
            yAxis: [{
                type: 'value',
                minInterval: 1,
                min: 0,
                max: max.toFixed(0),
                splitNumber: splitNumber,
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#ccc'
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            }],
            grid: {
                containLabel: true,
                top: '3%',
                left: '3%',
                right: '3%',
                bottom: '5%'
            },
            series: [{
                name: '总数',
                type: 'bar',
                data: num_sys,
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        textStyle: {
                            color: '#000'
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#616ba7'
                    }
                }
            }]
        };
        return setting;

    };

    initThreat = function (datas) {
        var
            _da,
            _time,
            _virus,
            _malice,
            _harass,
            _connect,
            _time_sort = getPreDate();
        var type = 'num';

        /*virus*/
        if (datas['wv'].length == 0) {
            _virus = [0, 0, 0, 0, 0, 0, 0];
        } else {
            _virus = [];
            _.each(datas['wv'], function (value, key, list) {
                _virus.push(value);
            });
        }
        /*malice*/
        if (datas['wu'].length == 0) {
            _malice = [0, 0, 0, 0, 0, 0, 0];
        } else {
            _malice = [];
            _.each(datas['wu'], function (value, key, list) {
                _malice.push(value);
            });
        }
        /*harass*/
        if (datas['wh'].length == 0) {
            _harass = [0, 0, 0, 0, 0, 0, 0];
        } else {
            _harass = [];
            _.each(datas['wh'], function (value, key, list) {
                _harass.push(value);
            });
        }
        /*connect*/
        if (datas['wn'].length == 0) {
            _connect = [0, 0, 0, 0, 0, 0, 0];
        } else {
            _connect = [];
            _.each(datas['wn'], function (value, key, list) {
                _connect.push(value);
            });
        }

        var total = _.reduce([].concat(_virus, _malice, _harass, _connect), function (prev, curr) {
            return prev + Number(curr);
        }, 0);
        var todayNum = _virus[_virus.length - 1];
        var average = (total / _time_sort.length).toFixed(1) || 0;

        var max = +Math.max.apply(null, [].concat(_virus, _malice, _harass, _connect, 0)) + 1;

        var splitNumber = splitN(max, 5);


        var setting = {
            tooltip: {
                trigger: 'axis',
                formatter: function (params, ticket, callback) {
                    var html = [];
                    var _colors = {
                        '病毒': '#e47470',
                        '网址': '#29bcef',
                        '骚扰': '#616ba7',
                        '联网': '#7db53a'
                    };
                    var title = '' + params[0]['name'];
                    var time = new Date();
                    var month = time.getMonth() + 1;
                    var data = time.getDate();
                    if (title.indexOf('日') < 0) {
                        if (data < title) {
                            month--;
                        }
                        title = month + '月' + title + '日';
                    }
                    html.push(title + '<br/>');
                    for (var i = 0; i < params.length; i++) {
                        var pa = params[i];
                        html.push('<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + _colors[pa.seriesName] + '"></span>' + pa['seriesName'] + ':' + pa['value'] + '<br/>');
                    }
                    return html.join('');
                }
            },
            legend: {
                data: [{
                    name: '病毒',
                    icon: 'image://../public/esm/img/echarts/threat-ico01.png'
                }, {
                    name: '网址',
                    icon: 'image://../public/esm/img/echarts/threat-ico02.png'
                }, {
                    name: '骚扰',
                    icon: 'image://../public/esm/img/echarts/threat-ico03.png'
                }, {
                    name: '联网',
                    icon: 'image://../public/esm/img/echarts/threat-ico04.png'
                }],
                bottom: 10,
                itemHeight: 15,
                itemWidth: 12,
                itemGap: 20
            },
            grid: {
                top: '3%',
                left: '3%',
                right: '4%',
                bottom: '50',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: _time_sort,
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#ccc'
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#ccc'
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                max: max,
                splitNumber: splitNumber
            },
            series: [{
                name: '病毒',
                type: 'line',
                data: _virus,
                symbolSize: 5,
                lineStyle: {
                    normal: {
                        color: '#e47470',
                        width: 1
                    }
                }
            }, {
                name: '网址',
                type: 'line',
                data: _malice,
                symbolSize: 5,
                lineStyle: {
                    normal: {
                        color: '#29bcef',
                        width: 1
                    }
                }
            }, {
                name: '骚扰',
                type: 'line',
                data: _harass,
                symbolSize: 5,
                lineStyle: {
                    normal: {
                        color: '#616ba7',
                        width: 1
                    }
                }
            }, {
                name: '联网',
                type: 'line',
                data: _connect,
                symbolSize: 5,
                lineStyle: {
                    normal: {
                        color: '#7db53a',
                        width: 1
                    }
                }
            }]
        };

        return {
            setting: setting,
            total: todayNum,
            average: average
        };
    };

    initNetwork = function (datas) {

        // datas = {"nb":{"2016-12-20":false,"2016-12-21":false,"2016-12-22":false,"2016-12-23":false,"2016-12-24":"3","2016-12-25":false,"2016-12-26":"1"},"nn":{"2016-12-20":false,"2016-12-21":false,"2016-12-22":false,"2016-12-23":false,"2016-12-24":"1386","2016-12-25":false,"2016-12-26":"2099"},"ns":{"2016-12-20":false,"2016-12-21":false,"2016-12-22":false,"2016-12-23":false,"2016-12-24":"53","2016-12-25":false,"2016-12-26":"39"}};

        var type = {
            'nb': '禁止网址',
            'nn': '程序联网',
            'ns': '共享访问'
        };
        var nb = [],
            nn = [],
            ns = [],
            _totalArr = [];
        var time = getDate();
        var _time_sort = getPreDate();

        _.each(time, function (ele, idx, arr) {
            var _ele = ele.replace(/\//g, '-');
            nb[idx] = datas['nb'][_ele] || 0;
            nn[idx] = datas['nn'][_ele] || 0;
            ns[idx] = datas['ns'][_ele] || 0;
        });
        _totalArr = [].concat(nb, nn, ns);
        var max = +Math.max.apply(null, _totalArr.concat(0)) + 1;
        var splitNumber = splitN(max, 5);

        var settings = {
            tooltip: {
                trigger: 'axis',
                formatter: function (params, ticket, callback) {
                    var html = [];
                    var title = '' + params[0]['name'];
                    var time = new Date();
                    var month = time.getMonth() + 1;
                    var data = time.getDate();
                    if (title.indexOf('日') < 0) {
                        if (data < title) {
                            month--;
                        }
                        title = month + '月' + title + '日';
                    }
                    html.push(title + '<br/>');
                    for (var i = 0; i < params.length; i++) {
                        var pa = params[i];
                        html.push('<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + pa['color'] + '"></span>' + pa['seriesName'] + ':' + pa['value'] + '<br/>');
                    }
                    return html.join('');
                }
            },
            legend: {
                data: [{
                    name: '禁止网址',
                    icon: 'image://../public/esm/img/echarts/threat-ico01.png'
                }, {
                    name: '程序联网',
                    icon: 'image://../public/esm/img/echarts/threat-ico02.png'
                }, {
                    name: '共享访问',
                    icon: 'image://../public/esm/img/echarts/threat-ico03.png'
                }],
                bottom: 10,
                itemHeight: 15,
                itemWidth: 10
            },
            grid: {
                top: '3%',
                left: '3%',
                right: '4%',
                bottom: '50',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: _time_sort,
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#ccc'
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                max: max,
                splitNumber: splitNumber,
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#ccc'
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            },
            series: [{
                name: '禁止网址',
                type: 'line',
                data: nb,
                lineStyle: {
                    normal: {
                        color: '#e47470'
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#e47470'
                    }
                }
            },
            {
                name: '程序联网',
                type: 'line',
                data: nn,
                lineStyle: {
                    normal: {
                        color: '#29bcef'
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#29bcef'
                    }
                }
            },
            {
                name: '共享访问',
                type: 'line',
                data: ns,
                lineStyle: {
                    normal: {
                        color: '#616ba7'
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#616ba7'
                    }
                }
            }
            ]
        };
        return settings;
    };

    initInterception = function (datas) {

        var phoneNum = _.reduce(datas['hp'], function (memo, val, key, list) {
            return memo + val;
        }, 0);
        var msgNum = _.reduce(datas['hm'], function (memo, val, key, list) {
            return memo + val;
        }, 0);
        var da = [];
        if (phoneNum != 0 && msgNum != 0) {
            da.push({
                value: phoneNum,
                name: '电话',
                itemStyle: {
                    normal: {
                        color: '#e47470'
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'outside'
                    },
                    emphasis: {
                        show: true,
                        position: 'outside'
                    }
                },
                labelLine: {
                    normal: {
                        show: true,
                        length: 10,
                        length2: 8
                    },
                    emphasis: {
                        show: true
                    }
                },
                hoverAnimation: false
            }, {
                    value: msgNum,
                    name: '短信',
                    itemStyle: {
                        normal: {
                            color: '#616ba7'
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'outside'
                        },
                        emphasis: {
                            show: true,
                            position: 'outside'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: true,
                            length: 10,
                            length2: 8
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    hoverAnimation: false
                });
        } else {
            da.push({
                value: 0,
                name: '电话',
                itemStyle: {
                    normal: {
                        color: '#ddd'
                    },
                    emphasis: {
                        color: '#ddd'
                    }
                },
                label: {
                    normal: {
                        show: false
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                hoverAnimation: false
            }, {
                    value: 0,
                    name: '短信',
                    itemStyle: {
                        normal: {
                            color: '#ddd'
                        },
                        emphasis: {
                            color: '#ddd'
                        }
                    },
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    hoverAnimation: false
                });
        }

        var setting = {
            legend: {
                data: [{
                    name: '电话',
                    textStyle: '#e47470'
                }, {
                    name: '短信',
                    textStyle: '#616ba7'
                }],
                y: 'bottom',
                itemWidth: 5,
                itemHeight: 12,
                bottom: 30,
                height: 20,
                formatter: '{name}'
            },
            startAngle: 90,
            grid: {
                top: '3%',
                left: '3%',
                right: '4%',
                bottom: '80',
                containLabel: true
            },
            series: [{
                name: '手机',
                type: 'pie',
                radius: ['50%', '65%'],
                center: ['50%', '45%'],
                xAxis: [0],
                yAxis: [0],
                label: {
                    normal: {
                        show: false,
                        formatter: function (params) {
                            return params.percent + '%';
                        }
                    }
                },
                data: da

            }]
        };
        return setting;
    };

    initSite = function (datas) {

        // datas = {
        //     "ui":{"2016-12-20":{"\u6076\u610f\u7f51\u5740\u5e93":false,"XSS\u5e93":false,"\u9493\u9c7c":false,"\u6076\u610f\u4e0b\u8f7d":false,"\u5e7f\u544a\u8fc7\u6ee4":false,"\u641c\u7d22\u4fdd\u62a4":false},"2016-12-21":{"\u6076\u610f\u7f51\u5740\u5e93":false,"XSS\u5e93":false,"\u9493\u9c7c":false,"\u6076\u610f\u4e0b\u8f7d":false,"\u5e7f\u544a\u8fc7\u6ee4":false,"\u641c\u7d22\u4fdd\u62a4":false},"2016-12-22":{"\u6076\u610f\u7f51\u5740\u5e93":false,"XSS\u5e93":false,"\u9493\u9c7c":false,"\u6076\u610f\u4e0b\u8f7d":false,"\u5e7f\u544a\u8fc7\u6ee4":false,"\u641c\u7d22\u4fdd\u62a4":false},"2016-12-23":{"\u6076\u610f\u7f51\u5740\u5e93":false,"XSS\u5e93":false,"\u9493\u9c7c":false,"\u6076\u610f\u4e0b\u8f7d":false,"\u5e7f\u544a\u8fc7\u6ee4":false,"\u641c\u7d22\u4fdd\u62a4":false},"2016-12-24":{"\u6076\u610f\u7f51\u5740\u5e93":false,"XSS\u5e93":false,"\u9493\u9c7c":"2","\u6076\u610f\u4e0b\u8f7d":false,"\u5e7f\u544a\u8fc7\u6ee4":false,"\u641c\u7d22\u4fdd\u62a4":false},"2016-12-25":{"\u6076\u610f\u7f51\u5740\u5e93":false,"XSS\u5e93":false,"\u9493\u9c7c":false,"\u6076\u610f\u4e0b\u8f7d":false,"\u5e7f\u544a\u8fc7\u6ee4":false,"\u641c\u7d22\u4fdd\u62a4":false},"2016-12-26":{"\u6076\u610f\u7f51\u5740\u5e93":false,"XSS\u5e93":false,"\u9493\u9c7c":false,"\u6076\u610f\u4e0b\u8f7d":false,"\u5e7f\u544a\u8fc7\u6ee4":false,"\u641c\u7d22\u4fdd\u62a4":false}}
        // }

        var da = {};
        var _ui = datas['ui'];
        for (var key in _ui) {
            var _obj = _ui[key];
            for (var _k in _obj) {
                if (da[_k]) {
                    da[_k] += Number(_obj[_k]);
                } else {
                    da[_k] = Number(_obj[_k]);
                }
            }
        }

        // _.each(datas['ui'], function(val, key, list) {
        //     for (var v in val) {
        //         if (da[v]) {
        //             var _val = val || 0;
        //             da[v] += _val;
        //         } else {
        //             da[v] = 0;
        //         }
        //     }
        // });
        var max = 1,
            indicator = [],
            totalVal = [];
        for (var i in da) {
            if (max < da[i]) {
                max = da[i];
            }
        }
        _.each(da, function (val, key, list) {
            indicator.push({
                name: key,
                max: max
            });
            totalVal.push(val);
        });



        var setting = {
            radar: {
                indicator: indicator,
                center: ['50%', '50%'],
                radius: 50
            },
            tooltip: {},
            legend: {
                data: ['恶意网址库', 'XSS库', '钓鱼', '恶意下载', '广告过滤', '搜索保护']
            },
            series: [{
                name: '数据',
                type: 'radar',
                itemStyle: {
                    normal: {
                        color: '#6e77ae',
                        areaStyle: {
                            color: '#d1d9fa'
                        }
                    }
                },
                // areaStyle: {normal: {}},
                data: [{
                    value: totalVal
                }]
            }]
        };

        return setting;
    };

    initVirus = function (datas, type) {
        var dataType = ['病毒', '蠕虫', 'rookit', '广告', '木马', '后门']; //, '可疑'
        //处理数据返回echart格式数据    
        var transf_data = virus_file_date_tranfs(datas, dataType);
        var today = type == 'file' ? transf_data.todaybyFile : transf_data.todaybyNum;
        var total = type == 'file' ? transf_data.totalbyFile : transf_data.totalbyNum;
        var average = Math.floor(total / transf_data['time'].length) || 0;

        var max = (type == 'file' ? (+transf_data['maxbyFile']) : (+transf_data['maxbyNum'])) + 1;

        var splitNumber = splitN(max, 5);

        var setting = {
            legend: {
                data: dataType,
                y: 'bottom',
                itemWidth: 12,
                itemHeight: 6,
                formatter: '{name}'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function (params, ticket, callback) {
                    var html = [];
                    var title = '' + params[0]['name'];
                    var time = new Date();
                    var month = time.getMonth() + 1;
                    var data = time.getDate();
                    if (title.indexOf('日') < 0) {
                        if (data < title) {
                            month--;
                        }
                        title = month + '月' + title + '日';
                    }
                    html.push(title + '<br/>');
                    for (var i = 0; i < params.length; i++) {
                        var pa = params[i];
                        html.push('<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + pa['color'] + '"></span>' + pa['seriesName'] + ':' + pa['value'] + '<br/>');
                    }
                    return html.join('');
                }
            },
            xAxis: [{
                type: 'category',
                nameLocation: 'middle',
                data: transf_data.time,
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#ccc'
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            }],
            yAxis: [{
                type: 'value',
                max: max,
                splitNumber: splitNumber,
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#ccc'
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            }],
            grid: {
                containLabel: true,
                top: '3%',
                left: '3%',
                right: '3%',
                bottom: '30'
            },
            series: transf_data[type]
        };

        return {
            setting: setting,
            total: today,
            average: average
        };
    };
    //病毒查杀
    initVirus2 = function (datas, type) {
        var _da, _time, _time_sort, _virus;
        _time_sort = getPreDate();
        if (datas.length == 0) {
            _virus = [0, 0, 0, 0, 0, 0, 0];
        } else {
            _da = findXavByType_Id(datas, 'v', 1);
            // _time = getDatasTimeByKey(_da, type, 1);
            // _time_sort = _.sortBy(_time, function(num) {
            //     return new Date(num).getTime();
            // })
            _time = getDate();
            _virus = getVirusByType(_da, type, _time);
        }

        var todayNum = _virus[_virus.length - 1];
        var total = _.reduce(_virus, function (prev, curr) {
            return prev + Number(curr);
        }, 0);
        var average = Math.floor(total / _time_sort.length) || 0;

        var max = +Math.max.apply(null, _virus.concat(0)) + 1;

        var splitNumber = splitN(max, 5);


        var setting = {
            tooltip: {
                trigger: 'axis',
                formatter: function (params, ticket, callback) {
                    var html = [];
                    var title = '' + params[0]['name'];
                    var time = new Date();
                    var month = time.getMonth() + 1;
                    var data = time.getDate();
                    if (title.indexOf('日') < 0) {
                        if (data < title) {
                            month--;
                        }
                        title = month + '月' + title + '日';
                    }
                    html.push(title + '<br/>');
                    for (var i = 0; i < params.length; i++) {
                        var pa = params[i];
                        html.push('<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + pa['color'] + '"></span>' + pa['seriesName'] + ':' + pa['value'] + '<br/>');
                    }
                    return html.join('');
                }
            },
            grid: {
                top: '4%',
                left: '3%',
                right: '6%',
                bottom: '5',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: _time_sort,
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#ccc'
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                max: max,
                splitNumber: splitNumber,
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#ccc'
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            },
            series: [{
                name: '病毒',
                type: 'line',
                data: _virus,
                symbolSize: 5,
                lineStyle: {
                    normal: {
                        color: '#6d77ae',
                        width: 1
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [{
                            offset: 0,
                            color: '#b6bde8'
                        }, {
                            offset: 1,
                            color: '#f7f8ff'
                        }])
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#6d77ae'
                    }
                }
            }]
        };
        return {
            setting: setting,
            total: todayNum,
            average: average
        };
    };



    /*内置方法实现*/
    virus_file_date_tranfs = function (datas, dataType) {
        var VirusByFile = [],
            VirusByNum = [],
            color = ['#e47470', '#84cae3', '#ade488', '#616ba7', '#daba63', '#23d4b9', '#333'];

        if (datas.length == 0) {
            var model_data = _.map(dataType, function (ele, idx) {
                return {
                    name: dataType[idx],
                    type: 'bar',
                    stack: 'a',
                    data: [0, 0, 0, 0, 0, 0, 0],
                    barGap: '60%',
                    barCategoryGap: '50%',
                    itemStyle: {
                        normal: {
                            color: color[idx]
                        }
                    }
                };
            });
            return {
                time: getPreDate(),
                file: model_data,
                num: model_data,
                totalbyFile: 0,
                totalbyNum: 0,
                todaybyFile: 0,
                todaybyNum: 0,
                maxbyFile: 0,
                maxbyNum: 0
            };
        }


        /**
         *把数据分成按文件(VirusByFile)和按数量(VirusByNum)
         * File v1:2016-05-20:"4"
         * Num v:1:2016-05-20:"5"
         */

        _.mapObject(datas, function (val, key, obj) {
            var vals = key.split(':');
            var num = vals.length;
            var _obj = {};
            if (num == 2) {
                _obj['key'] = key;
                _obj['type'] = vals[0].substring(1);
                _obj['date'] = vals[1];
                _obj['val'] = val;
                VirusByFile.push(_obj);
            } else if (num == 3) {
                _obj['key'] = key;
                _obj['type'] = vals[1];
                _obj['date'] = vals[2];
                _obj['val'] = val;
                VirusByNum.push(_obj);
            }
        });



        /**
         * 时间排序
         */
        var real_dataTime = getDate();
        var todayTime = real_dataTime[real_dataTime.length - 1];


        var todaybyFile = _.reduce(VirusByFile, function (prev, cur) {
            var num = 0;
            if (cur['date'] == todayTime.replace(/\//g, '-')) {
                num = Number(cur['val']);
            }
            return prev + num;
        }, 0);
        var todaybyNum = _.reduce(VirusByNum, function (prev, cur) {
            var num = 0;
            if (cur['date'] == todayTime.replace(/\//g, '-')) {
                num = Number(cur['val']);
            }
            return prev + num;
        }, 0);
        var totalbyFile = _.reduce(VirusByFile, function (prev, cur) {
            var num = Number(cur['val']);
            return prev + num;
        }, 0);
        var totalbyNum = _.reduce(VirusByNum, function (prev, cur) {
            var num = Number(cur['val']);
            return prev + num;
        }, 0);


        var _maxbyFile = {};
        _.each(VirusByFile, function (cur, idx) {
            var key = cur['date'];
            var has = real_dataTime.indexOf(key.replace(/-/g, '/'));
            if (has < 0) {
                return;
            }
            if (_maxbyFile[key]) {
                _maxbyFile[key] += Number(cur['val']);
            } else {
                _maxbyFile[key] = Number(cur['val']);
            }
        });
        var maxbyFile = Math.max.apply(null, _.map(_maxbyFile, function (val, key) {
            return val;
        }).concat(0));

        var _maxbyNum = {};
        _.each(VirusByNum, function (cur, idx) {
            var key = cur['date'];
            var has = real_dataTime.indexOf(key.replace(/-/g, '/'));
            if (has < 0) {
                return;
            }
            if (_maxbyNum[key]) {
                _maxbyNum[key] += Number(cur['val']);
            } else {
                _maxbyNum[key] = Number(cur['val']);
            }
        });
        var maxbyNum = Math.max.apply(null, _.map(_maxbyNum, function (val, key) {
            return val;
        }).concat(0));

        /**
         * 加工数据符合echart数据格式
         */

        var _VirusByFile = {};
        var _VirusByNum = {};
        _.each([1, 2, 3, 4, 5, 6], function (type) {
            _VirusByFile[type] = {
                name: dataType[type - 1],
                type: 'bar',
                stack: 'a',
                data: [0, 0, 0, 0, 0, 0, 0],
                barGap: '60%',
                barCategoryGap: '50%',
                itemStyle: {
                    normal: {
                        color: color[type - 1]
                    }
                }
            };
            _VirusByNum[type] = {
                name: dataType[type - 1],
                type: 'bar',
                stack: 'a',
                data: [0, 0, 0, 0, 0, 0, 0],
                barGap: '60%',
                barCategoryGap: '50%',
                itemStyle: {
                    normal: {
                        color: color[type - 1]
                    }
                }
            };

        });

        //加工文件分类数据格式
        _.each(VirusByFile, function (ele, idx, list) {
            var type = ele['type'],
                _idx = real_dataTime.indexOf(ele['date'].replace(/-/g, '/'));
            if (_idx > -1) {
                _VirusByFile[type]['data'][_idx] = ele['val'];
            }
        });

        //加工数量分类数据格式
        _.each(VirusByNum, function (ele, idx, list) {
            var type = ele['type'],
                _idx = real_dataTime.indexOf(ele['date'].replace(/-/g, '/'));
            if (_idx > -1) {
                _VirusByNum[type]['data'][_idx] = ele['val'];
            }
        });
        var transf_ByFile = _.map(_VirusByFile, function (ele) {
            return ele;
        });
        var transf_ByNum = _.map(_VirusByNum, function (ele) {
            return ele;
        });
        var transf_time = _.map(real_dataTime, function (ele, idx) {
            var _ele = ele.split('/');
            if (idx == 0) {
                return [_ele[1], '月', _ele[2], '日'].join('');
            } else {
                return _ele[2];
            }
        });

        return {
            time: getPreDate(),
            file: transf_ByFile,
            num: transf_ByNum,
            totalbyFile: totalbyFile,
            totalbyNum: totalbyNum,
            todaybyFile: todaybyFile,
            todaybyNum: todaybyNum,
            maxbyFile: maxbyFile,
            maxbyNum: maxbyNum
        };
    };

    findXavByType_Id = function (datas, type, num) {
        var allTypesData = [];
        _.each(datas, function (val, key, list) {
            var vals = key.split(':');
            var obj;
            if (vals[0] == (type + num) && vals.length == 2) {
                obj = {
                    key: vals[0].substring(1),
                    type: 'num',
                    date: vals[1],
                    val: val
                };
                allTypesData.push(obj);
            }
            if (vals.length == 3 && vals[0] == type && vals[1] == num) {
                obj = {
                    key: vals[1],
                    type: 'file',
                    date: vals[2],
                    val: val
                };
                allTypesData.push(obj);
            }

        });
        return allTypesData;
    };

    findXavByType = function (datas, type) {
        var allTypesData = [];
        _.each(datas, function (val, key, list) {
            var vals = key.split(':');
            var obj;
            if (vals.length == 2) {
                obj = {
                    key: vals[0].substring(1),
                    type: 'num',
                    date: vals[1],
                    val: val
                };
                allTypesData.push(obj);
            }
            if (vals.length == 3) {
                obj = {
                    key: vals[1],
                    type: 'file',
                    date: vals[2],
                    val: val
                };
                allTypesData.push(obj);
            }

        });
        return allTypesData;
    };

    getDatasTime = function (datas, type /*按数量 num  按文件 file*/) {
        var dataTime = [];
        _.each(datas, function (ele, idx, list) {
            if (ele['type'] == type) {
                dataTime.push(ele['date'].replace(/-/g, '/'));
            }
        });
        return dataTime;
    };

    getDatasTimeByKey = function (datas, type /*按数量 num  按文件 file*/, key) {
        var dataTime = [];
        _.each(datas, function (ele, idx, list) {
            if (ele['type'] == type && ele['key'] == key) {
                dataTime.push(ele['date'].replace(/-/g, '/'));
            }
        });
        return dataTime;
    };

    getVirusByType = function (datas, type /*按数量 num  按文件 file*/, time) {
        var virus = [0, 0, 0, 0, 0, 0, 0];
        _.each(datas, function (ele, idx, list) {
            if (ele['type'] == type) {
                var num = time.indexOf(ele['date'].replace(/-/g, '/'));
                if (num > -1) {
                    virus[num] = ele['val'];
                }
            }
        });
        return virus;
    };

    splitN = function (num, N) {
        if (num == 0) {
            return 1;
        }
        if ((num / N) >= 1) {
            return N;
        } else {
            return splitN(num, --N);
        }
    };

    getPreDate = function () {
        var prevDayArr = [];
        var now = new Date().getTime();
        var dayTime = 24 * 60 * 60 * 1000;
        for (var i = 0; i < 7; i++) {
            prevDayArr.push(now - dayTime * i);
        }
        prevDayArr.reverse();
        return _.map(prevDayArr, function (ele, idx) {
            var da = new Date(ele);
            if (idx == 0) {
                return [da.getMonth() + 1, '月', da.getDate(), '日'].join('');
            } else {
                return da.getDate() + '日';
            }
        });
    };

    getDate = function () {
        var prevDayArr = [];
        var now = new Date().getTime();
        var dayTime = 24 * 60 * 60 * 1000;
        for (var i = 0; i < 7; i++) {
            prevDayArr.push(now - dayTime * i);
        }
        prevDayArr.reverse();
        return _.map(prevDayArr, function (ele, idx) {
            var da = new Date(ele);
            var year = da.getFullYear();
            var month = '' + (da.getMonth() + 1);
            month = month.length == 1 ? '0' + month : month;
            var day = '' + da.getDate();
            day = day.length == 1 ? '0' + day : day;
            return [year, month, day].join('/');
        });
    };

    return {
        initPc: initPc,
        initMob: initMob,
        initThreat: initThreat,
        initSys: initSys,
        initVirus: initVirus,
        initVirus2: initVirus2,
        initNetwork: initNetwork,
        initFlow: initFlow,
        initInterception: initInterception,
        initMap: initMap,
        initSite: initSite
    };
});