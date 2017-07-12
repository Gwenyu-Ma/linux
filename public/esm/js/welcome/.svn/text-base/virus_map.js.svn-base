$(function() {

    var homeMap = $('#ec_homeMap')[0];

    var _echart = echarts.init(homeMap);

    var convertData = function(data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
            var dataItem = data[i];
            var fromCoord = geoCoordMap[dataItem[1].name];
            var toCoord = geoCoordMap[dataItem[0].name];
            if (fromCoord && toCoord) {
                res.push({
                    fromName: dataItem[0].name,
                    toName: dataItem[1].name,
                    coords: [fromCoord, toCoord]
                });
            }
        }
        return res;
    };

    _echart.on('click',function(){
        window.open('http://rspub.rising.com.cn/rsapp/public/rtsn/');
    })

    function table_gongji_list(data) {
        $("#gongji_list").html("");
        var html = "<ul>";
        for (var i = 0; i < data.length; i++) {

            var item = data[i];
            if (item.vname != "Unknown") {


                html += " <li style=\"height:25px;\">";
                var s_info = "" + item.type + "，从" + item.src.city + "到" + item.dest.city + "，威胁名称为：" + item.vname + "";
                var show_info = "<div title=\"" + s_info + "\">" + item.type + "，从" + item.src.city + "到" + item.dest.city + "，威胁名称为：" + item.vname + "</div>";
                //html += "     <div class=\"gongji_info\"><a title=\"" + item.url + "\"><span> " + item.type + "</span>->11111113333333333333333333333333333<span>" + item.vname + "</span><span>(" + item.src.city + "->" + item.dest.city + ")</span></a></div>";
                //html += "     <div class=\"gongji_info\"><a title=\"" + item.url + "\"><span>" + show_info + "</span></a></div>";
                html += show_info;
                html += " </li>";
            }

        }
        html += "</ul>";
        $("#gongji_list").html(html);
    }

    function set_vTicker(id, item_count) {
        $(id).vTicker({
            speed: 500, //每次滚动持续时间，单位为毫秒
            pause: 1000, //滚动间隔，单位为毫秒
            animation: 'fade', //    滚动动画，默认为空，可选 ‘fade’，既滚动时首位淡入淡出
            mousePause: true, //鼠标悬停是否停止滚动
            showItems: item_count, //显示多少行
            direction: 'down', //滚动方向，可选 ‘up’ / ‘down’
            isPaused: false, //默认是否暂停
            height: 0 //容器高度，默认为 0，即根据 showItems 个数自动计算
        });
    }

    var geoCoordMap = {
        '上海': [121.4648, 31.2891],
        '东莞': [113.8953, 22.901],
        '东营': [118.7073, 37.5513],
        '中山': [113.4229, 22.478],
        '临汾': [111.4783, 36.1615],
        '临沂': [118.3118, 35.2936],
        '丹东': [124.541, 40.4242],
        '丽水': [119.5642, 28.1854],
        '乌鲁木齐': [87.9236, 43.5883],
        '佛山': [112.8955, 23.1097],
        '保定': [115.0488, 39.0948],
        '兰州': [103.5901, 36.3043],
        '包头': [110.3467, 41.4899],
        '北京': [116.4551, 40.2539],
        '北海': [109.314, 21.6211],
        '南京': [118.8062, 31.9208],
        '南宁': [108.479, 23.1152],
        '南昌': [116.0046, 28.6633],
        '南通': [121.1023, 32.1625],
        '厦门': [118.1689, 24.6478],
        '台州': [121.1353, 28.6688],
        '合肥': [117.29, 32.0581],
        '呼和浩特': [111.4124, 40.4901],
        '咸阳': [108.4131, 34.8706],
        '哈尔滨': [127.9688, 45.368],
        '唐山': [118.4766, 39.6826],
        '嘉兴': [120.9155, 30.6354],
        '大同': [113.7854, 39.8035],
        '大连': [122.2229, 39.4409],
        '天津': [117.4219, 39.4189],
        '太原': [112.3352, 37.9413],
        '威海': [121.9482, 37.1393],
        '宁波': [121.5967, 29.6466],
        '宝鸡': [107.1826, 34.3433],
        '宿迁': [118.5535, 33.7775],
        '常州': [119.4543, 31.5582],
        '广州': [113.5107, 23.2196],
        '廊坊': [116.521, 39.0509],
        '延安': [109.1052, 36.4252],
        '张家口': [115.1477, 40.8527],
        '徐州': [117.5208, 34.3268],
        '德州': [116.6858, 37.2107],
        '惠州': [114.6204, 23.1647],
        '成都': [103.9526, 30.7617],
        '扬州': [119.4653, 32.8162],
        '承德': [117.5757, 41.4075],
        '拉萨': [91.1865, 30.1465],
        '无锡': [120.3442, 31.5527],
        '日照': [119.2786, 35.5023],
        '昆明': [102.9199, 25.4663],
        '杭州': [119.5313, 29.8773],
        '枣庄': [117.323, 34.8926],
        '柳州': [109.3799, 24.9774],
        '株洲': [113.5327, 27.0319],
        '武汉': [114.3896, 30.6628],
        '汕头': [117.1692, 23.3405],
        '江门': [112.6318, 22.1484],
        '沈阳': [123.1238, 42.1216],
        '沧州': [116.8286, 38.2104],
        '河源': [114.917, 23.9722],
        '泉州': [118.3228, 25.1147],
        '泰安': [117.0264, 36.0516],
        '泰州': [120.0586, 32.5525],
        '济南': [117.1582, 36.8701],
        '济宁': [116.8286, 35.3375],
        '海口': [110.3893, 19.8516],
        '淄博': [118.0371, 36.6064],
        '淮安': [118.927, 33.4039],
        '深圳': [114.5435, 22.5439],
        '清远': [112.9175, 24.3292],
        '温州': [120.498, 27.8119],
        '渭南': [109.7864, 35.0299],
        '湖州': [119.8608, 30.7782],
        '湘潭': [112.5439, 27.7075],
        '滨州': [117.8174, 37.4963],
        '潍坊': [119.0918, 36.524],
        '烟台': [120.7397, 37.5128],
        '玉溪': [101.9312, 23.8898],
        '珠海': [113.7305, 22.1155],
        '盐城': [120.2234, 33.5577],
        '盘锦': [121.9482, 41.0449],
        '石家庄': [114.4995, 38.1006],
        '福州': [119.4543, 25.9222],
        '秦皇岛': [119.2126, 40.0232],
        '绍兴': [120.564, 29.7565],
        '聊城': [115.9167, 36.4032],
        '肇庆': [112.1265, 23.5822],
        '舟山': [122.2559, 30.2234],
        '苏州': [120.6519, 31.3989],
        '莱芜': [117.6526, 36.2714],
        '菏泽': [115.6201, 35.2057],
        '营口': [122.4316, 40.4297],
        '葫芦岛': [120.1575, 40.578],
        '衡水': [115.8838, 37.7161],
        '衢州': [118.6853, 28.8666],
        '西宁': [101.4038, 36.8207],
        '西安': [109.1162, 34.2004],
        '贵阳': [106.6992, 26.7682],
        '连云港': [119.1248, 34.552],
        '邢台': [114.8071, 37.2821],
        '邯郸': [114.4775, 36.535],
        '郑州': [113.4668, 34.6234],
        '鄂尔多斯': [108.9734, 39.2487],
        '重庆': [107.7539, 30.1904],
        '金华': [120.0037, 29.1028],
        '铜川': [109.0393, 35.1947],
        '银川': [106.3586, 38.1775],
        '镇江': [119.4763, 31.9702],
        '长春': [125.8154, 44.2584],
        '长沙': [113.0823, 28.2568],
        '长治': [112.8625, 36.4746],
        '阳泉': [113.4778, 38.0951],
        '青岛': [120.4651, 36.3373],
        '韶关': [113.7964, 24.7028]
    };

    // var series = [
    //     {
    //         /*动画*/
    //         name: '北京',
    //         type: 'lines',
    //         zlevel: 1,
    //         effect: {
    //             show: true,
    //             period: 6,
    //             trailLength: 0.7,
    //             color: '#fff',
    //             symbolSize: 3
    //         },
    //         lineStyle: {
    //             normal: {
    //                 color: '#a6c84c',
    //                 width: 0,
    //                 curveness: 0.2
    //             }
    //         },
    //         data: convertData([[{name:'北京'},{name:'上海'}],[{name:'北京'},{name:'广州'}]])
    //     },
    //     {
    //         /*地点*/
    //         name: '北京',
    //         type: 'effectScatter',
    //         coordinateSystem: 'geo',
    //         zlevel: 2,
    //         rippleEffect: {
    //             brushType: 'stroke'
    //         },
    //         label: {
    //             normal: {
    //                 show: true,
    //                 position: 'right',
    //                 formatter: '{b}'
    //             }
    //         },
    //         symbolSize: 10,
    //         itemStyle: {
    //             normal: {
    //                 color: '#a6c84c'
    //             }
    //         },
    //         data: [{
    //                 name: '上海',
    //                 value: geoCoordMap['上海'].concat([90])
    //         }]

    //     },
    //     {
    //         /*地点*/
    //         name: '北京',
    //         type: 'effectScatter',
    //         coordinateSystem: 'geo',
    //         zlevel: 2,
    //         rippleEffect: {
    //             brushType: 'stroke'
    //         },
    //         label: {
    //             normal: {
    //                 show: true,
    //                 position: 'right',
    //                 formatter: '{b}'
    //             }
    //         },
    //         symbolSize: 10,
    //         itemStyle: {
    //             normal: {
    //                 color: '#a6c84c'
    //             }
    //         },
    //         data: [{
    //                 name: '北京',
    //                 value: geoCoordMap['北京']
    //         }]

    //     }
    // ];
    var bgColor = new Image();
    bgColor.src = '/public/img/china_map.png';
    bgColor.onload = function() {
        var es_config = {
            backgroundColor: { image: bgColor, repeat: 'no-repeat' },
            title: {
                text: '网络威胁实况',
                subtext: '',
                left: 'center',
                top: 20,
                textStyle: {
                    color: '#fff'
                }
            },
            tooltip: {
                trigger: 'item'
            },
            geo: {
                map: 'china',
                label: {
                    emphasis: {
                        show: false
                    }
                },
                top: 27,
                left: 27,
                right: 27,
                roam: false,
                itemStyle: {
                    normal: {
                        areaColor: 'rgba(0,0,0,0)',
                        borderColor: 'rgba(0,0,0,0)'
                    },
                    emphasis: {
                        areaColor: 'rgba(0,0,0,0)'
                    }
                }
            },
            series: []
        };
        _echart.setOption(es_config);

        var is_one = true;

        $.getJSON('/public/js/welcome/es-data.json', function(data) {

            /*获取所有城市*/
            var chart41 = data.chart41;
            var _data = setCity(chart41);

            _echart.setOption({
                legend: {
                    show: false,
                    orient: 'vertical',
                    top: 'bottom',
                    left: 'right',
                    data: _data.city,
                    textStyle: {
                        color: '#fff'
                    },
                    selectedMode: 'single'
                },
                series: _data.list
            });

            var num = 1,
                len = _data.city.length;
            setInterval(function() {
                _echart.dispatchAction({
                    type: 'legendSelect',
                    name: _data.city[num]
                });
                if (num < len) {
                    num++;
                } else {
                    num = 0;
                }
            }, 20000);


            /*攻击list*/
            var gongji_list = data.chart42;
            if (is_one) {
                table_gongji_list(gongji_list);
                set_vTicker('#gongji_list', 3);
                is_one = false;
            }

        });

    };



    function setCity(data) {
        var res = {
            list: [],
            city: []
        };
        var das = _.map(data, function(item, idx, list) {
            if (item['group_data'].length) {
                item['value'] = _.reduce(item['group_data'], function(prev, cur) {
                    if (cur[1]) {
                        var num = cur[1]['value'] || 0;
                        return Number(num) + prev;
                    } else {
                        return 0 + prev;
                    }

                }, 0);
            }
            return item;
        });
        console.log(das);
        for (var i = 0; i < das.length; i++) {
            var da = das[i];
            if (geoCoordMap[da['group_name']] && da['group_data'].length > 0) {
                res.city.push(da['group_name']);
                res.list.push({
                    name: da['group_name'],
                    type: 'lines',
                    zlevel: 1,
                    effect: {
                        show: true,
                        period: 6,
                        trailLength: 0.8,
                        color: '#fff',
                        symbolSize: 2
                    },
                    lineStyle: {
                        normal: {
                            color: '#a6c84c',
                            width: 0,
                            curveness: 0.2
                        }
                    },
                    data: convertData(da['group_data'])
                }, {
                    name: da['group_name'],
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    zlevel: 2,
                    rippleEffect: {
                        // scale:1,
                        brushType: 'stroke'
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'right',
                            formatter: '{b}',
                            textStyle: {
                                color: '#fff'
                            }
                        }
                    },
                    symbolSize: function(val) {
                        if (val) {
                            var v = val[2] / 4;
                            return v > 10 ? 10 : v < 1 ? 1 : v;
                        }
                        return 5;
                    },
                    itemStyle: {
                        normal: {
                            color: '#ff5700'
                        }
                    },
                    data: [{
                        name: da['group_name'],
                        value: geoCoordMap[da['group_name']].concat([da['value']])
                    }]
                }, {
                    name: da['group_name'],
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    zlevel: 3,
                    rippleEffect: {
                        // scale:1,
                        brushType: 'stroke'
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'right',
                            formatter: '{b}',
                            textStyle: {
                                color: '#fff'
                            }
                        }
                    },
                    symbolSize: 5,
                    itemStyle: {
                        normal: {
                            color: '#f49e38'
                        }
                    },
                    data: _.map(da['group_data'], function(dataItem) {
                        if (geoCoordMap[dataItem[1].name]) {
                            return {
                                name: dataItem[1].name,
                                value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                            };
                        } else {
                            return {};
                        }
                    })
                });
            }
        }

        // var city_map = [];
        // city_map = res.city.map(function(item){
        //                 return {
        //                     name:item,
        //                     value:geoCoordMap[item]
        //                 }
        //             })
        // for(var i=0;i<res.city.length;i++){
        //     var _name = res.city[i];
        //     res.list.push({

        //             name: _name,
        //             type: 'effectScatter',
        //             coordinateSystem: 'geo',
        //             zlevel: 1,
        //             rippleEffect: {
        //                 brushType: 'stroke'
        //             },
        //             label: {
        //                 normal: {
        //                     show: false,
        //                     position: 'right',
        //                     formatter: '{b}'
        //                 }
        //             },
        //             symbolSize: 1,
        //             itemStyle: {
        //                 normal: {
        //                     color: 'yellow'
        //                 }
        //             },
        //             data:city_map

        //     })
        // }
        // console.log(res);
        return res;
    }






});