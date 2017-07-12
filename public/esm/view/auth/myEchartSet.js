define(function (require) {

    function initHisSevenDay(data) {
        var _time_sort = [];
        var _data = [];

        if (data) {
            var da = data.rows;
            for (var i = 0; i < da.length; i++) {
                _time_sort.push(da[i]['historyDate'])
                _data.push(da[i]['authNum'])
            }
        }

        var options = {
            tooltip: {
                trigger: 'axis'
                /*,
                formatter: function (params, ticket, callback) {
                    // var html = [];
                    // var title = '' + params[0]['name'];
                    // var time = new Date();
                    // var month = time.getMonth() + 1;
                    // var data = time.getDate();
                    // if (title.indexOf('日') < 0) {
                    //     if (data < title) {
                    //         month--;
                    //     }
                    //     title = month + '月' + title + '日';
                    // }
                    // html.push(title + '<br/>');
                    // for (var i = 0; i < params.length; i++) {
                    //     var pa = params[i];
                    //     html.push('<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + pa['color'] + '"></span>' + pa['seriesName'] + ':' + pa['value'] + '<br/>');
                    // }
                    return '显示多少个';
                }*/
            },
            grid: {
                top: '3%',
                left: '3%',
                right: '6%',
                bottom: '3%',
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
                }
            },
            series: [{
                name: '',
                type: 'line',
                data: _data,
                lineStyle: {
                    normal: {
                        color: '#6a73ac'
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#656ea9'
                    }
                }
            }]
        }

        return options;
    }

    function initHisDay(data) {
        var _time_sort = [];
        var _data = [];

        if (data) {
            var da = data.rows;
            for (var i = 0; i < da.length; i++) {
                _time_sort.push(da[i]['historyDate'])
                _data.push(Number(da[i]['authNum']));
            }
        }

        var options = {
            tooltip: {
                trigger: 'axis'
                /*,
                formatter: function (params, ticket, callback) {
                    // var html = [];
                    // var title = '' + params[0]['name'];
                    // var time = new Date();
                    // var month = time.getMonth() + 1;
                    // var data = time.getDate();
                    // if (title.indexOf('日') < 0) {
                    //     if (data < title) {
                    //         month--;
                    //     }
                    //     title = month + '月' + title + '日';
                    // }
                    // html.push(title + '<br/>');
                    // for (var i = 0; i < params.length; i++) {
                    //     var pa = params[i];
                    //     html.push('<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + pa['color'] + '"></span>' + pa['seriesName'] + ':' + pa['value'] + '<br/>');
                    // }
                    return '显示多少个';
                }*/
            },
            grid: {
                top: '4%',
                left: '3%',
                right: '4%',
                bottom: '3%',
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
                }
            },
            series: [{
                name: '',
                type: 'line',
                data: _data,
                lineStyle: {
                    normal: {
                        color: '#6a73ac'
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#656ea9'
                    },
                    emphasis:{
                    	color : '#eaeaea',
                    	opacity: '1'
                    }
                }
            }]
        }

        return options;
    }

    function initTDWindow(data) {
        var on = data['windowsNum'] || 0,
            off = (data['windowsTotalNum'] - data['windowsNum']) || 0;

        //处理两个都为0时的情况
        if (on == 0 && off == 0) {
            on = 0;
            off = 1;
        }

        var info = {
            online: on,
            offline: off
        };
        var setting = {
            startAngle: 90,
            series: [{
                name: 'pc',
                type: 'pie',
                radius: ['65%', '75%'],
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
                        },
                        'emphasis':{
                        	'color' : '#29bcef',
                        	'opacity': '1'
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
                            'color': '#eaeaea'
                        },
                        'emphasis':{
                        	'color' : '#eaeaea',
                        	'opacity': '1'
                        }
                    },
                    hoverAnimation: false
                }],
                markPoint: {
                    symbol: 'image://../public/auth/img/icon/chart_windows_icon.png',
                    symbolSize: 130,
                    label: {
                        normal: {
                            show: true,
                            formatter: '{b}',
                            textStyle: {
                                color: '#29bcef',
                                fontSize: 36,
                                fontWeight: 'lighter'
                            }
                        }
                    },
                    data: [{
                        name: '' + info.online + '台',
                        x: '50%',
                        y: '55%'
                    }]
                }
            }]
        };

        return setting;
    }

    function initTDLinux(data) {
        var on = data['linuxNum'] || 0,
            off = (data['linuxTotalNum'] - data['linuxNum']) || 0;

        //处理两个都为0时的情况
        if (on == 0 && off == 0) {
            on = 0;
            off = 1;
        }
        var info = {
            online: on,
            offline: off
        };
        var setting = {
            startAngle: 90,
            series: [{
                name: 'pc',
                type: 'pie',
                radius: ['65%', '75%'],
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
                            'color': '#7db53a'
                        },
                        'emphasis':{
                        	'color' : '#7db53a',
                        	'opacity': '1'
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
                            'color': '#eaeaea'
                        },
                        'emphasis':{
                        	'color' : '#eaeaea',
                        	'opacity': '1'
                        }
                    },
                    hoverAnimation: false
                }],
                markPoint: {
                    symbol: 'image://../public/auth/img/icon/chart_linux_icon.png',
                    symbolSize: 130,
                    label: {
                        normal: {
                            show: true,
                            formatter: '{b}',
                            textStyle: {
                                color: '#7db53a',
                                fontSize: 36,
                                fontWeight: 'lighter'
                            }
                        }
                    },
                    data: [{
                        name: '' + info.online + '台',
                        x: '50%',
                        y: '55%'
                    }]
                }
            }]
        };

        return setting;
    }
    return {
        initHisSevenDay: initHisSevenDay,
        initTDWindow: initTDWindow,
        initTDLinux: initTDLinux,
        initHisDay: initHisDay
    }
})