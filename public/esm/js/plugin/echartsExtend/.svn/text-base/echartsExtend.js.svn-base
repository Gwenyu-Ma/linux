define(['echarts/echarts.amd'], function() {
    var charts = {
        //数据格式化
        DataFormate: {
            /*
             * 这种格式的数据,多用于饼图/单一的柱形图的数据源
             * data的格式如上的Result1
             */
            NOGroupData: function(data) {
                var categories = [];
                var datas = [];
                for (var i = 0; i < data.length; i++) {
                    categories.push(data[i].name || '');
                    datas.push({
                        name: data[i].name,
                        value: data[i].value || 0
                    });
                }
                return {
                    category: categories,
                    data: datas
                };
            },
            /*
             * 这种格式的数据多用于展示多条折线图、分组的柱图
             * data: 格式如上的Result2
             * type: 渲染的图表类型 [line,bar]
             * is_stack表示为是否是堆积图
             */
            GroupData: function(data, type, is_stack) {
                var chart_type = 'line';
                if (type) chart_type = type || 'line';
                var xAxis = [],
                    group = [],
                    series = [];
                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; j < xAxis.length && xAxis[j] != data[i].name; j++);
                    if (j == xAxis.length) xAxis.push(data[i].name);
                    for (var k = 0; k < group.length && group[k] != data[i].group; k++);
                    if (k == group.length) group.push(data[i].group);
                }
                for (var i = 0; i < group.length; i++) {
                    var temp = [];
                    for (var j = 0; j < data.length; j++) {
                        if (group[i] == data[j].group) {
                            if (type == 'map')
                                temp.push({
                                    name: data[j].name,
                                    value: data[i].value
                                });
                            else
                                temp.push(data[j].value);
                        }
                    }
                    switch (type) {
                        case 'bar':
                            var series_temp = {
                                name: group[i],
                                data: temp,
                                type: chart_type
                            };
                            if (is_stack)
                                series_temp = $.extend({}, {
                                    stack: 'stack'
                                }, series_temp);
                            break;
                            /*case 'map':
                              var series_temp = {
                                name: group[i], type: chart_type, mapType: 'china', selectedMode: 'single',
                                itemStyle: {
                                  normal: { label: { show: true} },
                                  emphasis: { label: { show: true} }
                                },
                                data: temp
                              };
                              break;
                            */
                        case 'line':
                            var series_temp = {
                                name: group[i],
                                data: temp,
                                type: chart_type
                            };
                            if (is_stack)
                                series_temp = $.extend({}, {
                                    stack: 'stack'
                                }, series_temp);
                            break;
                        default:
                            var series_temp = {
                                name: group[i],
                                data: temp,
                                type: chart_type
                            };
                    }

                    series.push(series_temp);
                }

                return {
                    category: group,
                    xAxis: xAxis,
                    series: series
                };
            },
            /*
             * 地图数据源
             * data的格式如上的Result3
             */
            MapData: function(data) {
                var categories = [];
                var series = [];
                var temp = {
                    name: '',
                    type: 'map',
                    mapType: 'china',
                    itemStyle: {
                        normal: {
                            label: {
                                show: true
                            }
                        },
                        emphasis: {
                            label: {
                                show: true
                            }
                        }
                    },
                    data: []
                };
                var items = [];
                var arr = data.map;
                //BUG! echarts 地图legend全部隐藏，会找不到series数据
                //解决: 添加默认地图series数据
                items.push({
                    type: 'map',
                    mapType: 'china',
                    roam: true, //开启地图缩放
                    itemStyle: {
                        normal: {
                            label: {
                                show: true
                            }
                        },
                        emphasis: {
                            label: {
                                show: true
                            }
                        }
                    },
                    data: []
                });
                for (var i = 0, len = arr.length; i < len; i++) {
                    categories.push(arr[i].group || '');
                    items.push($.extend({}, temp, {
                        name: arr[i].group || '',
                        data: arr[i].data
                    }));
                }
                if (data.max != '' && data.min != '')
                    return {
                        category: categories,
                        series: items,
                        max: data.max,
                        min: data.min
                    };
                else
                    return {
                        category: categories,
                        series: items
                    };
            },
            MixData: function(data) {
                var legends = [],
                    xAxis = [],
                    yAxis = [],
                    series = [],
                    arr = data.chart,
                    flag = true;
                for (var i = 0, iMax = arr.length; i < iMax; i++) {
                    legends.push(arr[i].group);
                    var arrData = arr[i].data;
                    var sItem = {
                        name: arr[i].group,
                        type: arr[i].type,
                        data: []
                    };
                    if (arr[i].yIndex == 1) sItem.yAxisIndex = 1;
                    for (var j = 0, jMax = arrData.length; j < jMax; j++) {
                        if (flag) xAxis.push(arrData[j].name);
                        sItem.data.push(arrData[j].value);
                    }
                    series.push(sItem);
                    flag = false;
                }
                for (var k = 0, kMax = data.yAxis.length; k < kMax; k++) {
                    var yItem = {
                        type: 'value',
                        name: data.yAxis[k].name
                    };
                    if (data.yAxis[k].unit != '') {
                        yItem.axisLabel = {
                            formatter: '{value} ' + data.yAxis[k].unit
                        };
                    }
                    yAxis.push(yItem);
                }
                return {
                    legendData: legends,
                    xAxisData: xAxis,
                    yAxis: yAxis,
                    series: series
                };
            }
        },
        // 统计图配置
        options: {
            //通用的图表基本配置
            CommonOption: {
                tooltip: {
                    //tooltip触发方式:axis以X轴线触发,item以每一个数据项触发
                    trigger: 'axis'
                },
                toolbox: {
                    //是否显示工具栏
                    show: true,
                    feature: {
                        mark: {
                            show: true
                        },
                        //数据预览
                        dataView: {
                            show: true,
                            readOnly: false
                        },
                        //复原
                        restore: {
                            show: true
                        },
                        //是否保存图片
                        saveAsImage: {
                            show: true
                        }
                    }
                }
            },
            //通用的折线图表的基本配置
            CommonLineOption: {
                tooltip: {
                    trigger: 'axis'
                },
                toolbox: {
                    show: true,
                    x: 'right',
                    y: 'bottom',
                    feature: {
                        mark: {
                            show: true
                        },
                        //数据预览
                        dataView: {
                            show: true,
                            readOnly: false
                        },
                        //复原
                        restore: {
                            show: true
                        },
                        //是否保存图片
                        saveAsImage: {
                            show: true
                        },
                        //支持柱形图和折线图的切换
                        magicType: {
                            show: true,
                            type: ['line', 'bar']
                        }
                    }
                }
            },
            //地图的基本配置
            MapOption: {
                tooltip: {
                    trigger: 'item'
                },
                toolbox: {
                    show: true,
                    orient: 'vertical',
                    x: 'right',
                    y: 'center',
                    feature: {
                        mark: {
                            show: true
                        },
                        dataView: {
                            show: true,
                            readOnly: false
                        },
                        restore: {
                            show: true
                        },
                        saveAsImage: {
                            show: true
                        }
                    }
                }
            },
            MixOption: {
                tooltip: {
                    trigger: 'axis'
                },
                toolbox: {
                    show: true,
                    x: 'right',
                    y: 'bottom',
                    feature: {
                        mark: {
                            show: true
                        },
                        dataView: {
                            show: true,
                            readOnly: false
                        },
                        magicType: {
                            show: true,
                            type: ['line', 'bar']
                        },
                        restore: {
                            show: true
                        },
                        saveAsImage: {
                            show: true
                        }
                    }
                }
            },
            //data:数据格式：{name：xxx,value:xxx}...
            Pie: function(data, name) {
                var pie_datas = charts.DataFormate.NOGroupData(data);
                var option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: name ? '{a} <br/>{b} : {c} ({d}/%)' : '{b} : {c} ({d}/%)',
                        show: true
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data: pie_datas.category
                    },
                    series: [{
                        name: name || '',
                        type: 'pie',
                        /*radius: '55%',
                        center: ['50%', '60%'],
                        clockWise: false,
                        startAngle: 90,*/
                        data: pie_datas.data
                    }]
                };

                return $.extend({}, this.CommonOption, option);
            },
            //data:数据格式：{name：xxx,group:xxx,value:xxx}...
            Lines: function(data, name, is_stack) {
                var stackline_datas = charts.DataFormate.GroupData(data, 'line', is_stack);
                var option = {
                    legend: {
                        data: stackline_datas.category
                    },
                    xAxis: [{
                        //X轴均为category，Y轴均为value
                        type: 'category',
                        data: stackline_datas.xAxis,
                        //数值轴两端的空白策略
                        boundaryGap: false
                    }],
                    yAxis: [{
                        name: name || '',
                        type: 'value',
                        splitArea: {
                            show: true
                        }
                    }],

                    series: stackline_datas.series
                };

                return $.extend({}, this.CommonLineOption, option);
            },
            //data:数据格式：{name：xxx,group:xxx,value:xxx}...
            Bars: function(data, name, is_stack) {
                var bars_dates = charts.DataFormate.GroupData(data, 'bar', is_stack);
                //console.log(bars_dates.category);
                var option = {
                    //legend: bars_dates.category,
                    legend: {
                        data: bars_dates.category
                    },
                    xAxis: [{
                        type: 'category',
                        data: bars_dates.xAxis,
                        axisLabel: {
                            show: true,
                            interval: 'auto',
                            rotate: 0,
                            margion: 8
                        }
                    }],
                    yAxis: [{
                        type: 'value',
                        name: name || '',
                        splitArea: {
                            show: true
                        }
                    }],

                    series: bars_dates.series
                };

                return $.extend({}, this.CommonLineOption, option);
            },
            //data:数据格式: [{group:xxx,data:[{name:xxx,value:xxx},{name:xxx,value:xxx}]}...]
            Map: function(data) {
                var map_datas = charts.DataFormate.MapData(data);
                var option = {
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data: map_datas.category
                    },
                    series: map_datas.series
                };
                if (data.max !== '' && data.min !== '') {
                    option.dataRange = {
                        min: data.min,
                        max: data.max,
                        x: 'left',
                        y: 'bottom',
                        text: ['高', '低'],
                        calculable: true
                    };
                }
                return $.extend({}, this.MapOption, option);
            },
            Mix: function(data) {
                var mix_datas = charts.DataFormate.MixData(data);
                var option = {
                    legend: {
                        data: mix_datas.legendData
                    },
                    xAxis: [{
                        type: 'category',
                        data: mix_datas.xAxisData
                    }],
                    yAxis: mix_datas.yAxis,
                    series: mix_datas.series
                };

                return $.extend({}, this.MixOption, option);
            }
        },
        // 统计图渲染
        render: function(container, echarts, option) {
            //charts.auto_resize();
            var chart = echarts.init(container, 'macarons');
            // 为echarts对象加载数据 
            chart.setOption(option);
            //$(container).closest('.panel').find('a.panel-max').data('chart', chart);
            return chart;
        },
        //刷新数据
        refresh_data: function(chart, options) {
            chart.setOption(options, true); //第二个参数: [notMerge:是否不合并数据] 默认:false 合并数据
        }
    };

    return {
        Options: charts.options,
        // EChart渲染函数
        Render: charts.render,
        RefreshData: charts.refresh_data
    };

});