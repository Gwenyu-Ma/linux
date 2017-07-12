$(function() {
    var op = {
        cache: {},
        init: function() {
            this.searchBar.init();
            this.traceGraph.init();
        },
        searchBar: {
            init: function() {
                $('.bar-search select').selectric({
                    inheritOriginalWidth: false
                });
                this.bindEvent();
            },
            bindEvent: function() {
                var dateInit = false;
                $('#selTime').on('change', function() {
                    if (this.value == 4) {
                        if (!dateInit) {
                            $('#date_timepicker_start,#date_timepicker_end').datetimepicker({
                                format: 'Y-m-d H:i',
                                timepicker: true
                            });
                            dateInit = true;
                        }
                        $('#panelDate').css('display', '');
                    } else {
                        $('#panelDate').css('display', 'none');
                    }
                });
            }
        },
        traceGraph: {
            init: function() {
                /*var data = [
          [{
            name: 'root', 
            value: {num: 0, desp: 'this is root'},
            children: [
              {
                name: 'client1', 
                value: {num: 01, desp: 'this is virus client1'},
                children: [
                  {
                    name: 'client1', 
                    value: {num: 01, desp: 'this is virus client1'}
                  }, {
                    name: 'client2', 
                    value: {num: 02, desp: 'this is virus client2'}
                  }
                ]
              }, {
                name: 'client2', 
                value: {num: '02', desp: 'this is virus client2'},
                children: [
                  {
                    name: 'client1', 
                    value: {num:'01', desp: 'this is virus client1'}
                  }, {
                    name: 'client2', 
                    value: {num: 02, desp: 'this is virus client2'},
                    children: [
                      {
                        name: 'client1', 
                        value: {num: 01, desp: 'this is virus client1'}
                      }, {
                        name: 'client2', 
                        value: {num: 02, desp: 'this is virus client2'}
                      }
                    ]
                  }
                ]
              }
            ]
          }],
          [{
            name: 'root', 
            value: {num: 00, desp: 'this is root!'},
            children: [
              {
                name: 'client11', 
                value: {num: 011, desp: 'this is virus client11'},
                children: [
                  {
                    name: 'client11', 
                    value: {num: 011, desp: 'this is virus client11'}
                  }, {
                    name: 'client22', 
                    value: {num: 022, desp: 'this is virus client22'}
                  }
                ]
              }, {
                name: 'client22', 
                value: {num: '022', desp: 'this is virus client22'}
              }
            ]
          }]
        ];
        this.draw(data)*/

                var that = this;
                RsCore.ajax('index.php/XAVLog/getVirusTrace', function(data) {
                    that.draw(data);
                });

            },
            draw: function(data) {
                require(
                    [
                        'echarts',
                        'echarts/chart/tree'
                    ],
                    function(ec) {
                        //var chart = ec.init(document.getElementById('chart'));
                        var option = {
                            title: {
                                text: '病毒传播图',
                                subtext: '树形结构'
                            },
                            tooltip: {
                                //showDelay: 200,
                                trigger: 'item',
                                //formatter: "{b}: {c}"
                                formatter: function(params, ticket, callback) {
                                    var _html = ['<b style="color:red">value中的值:</b><br/>'];
                                    $.each(params.value, function(k, v) {
                                        _html.push(k + ': ' + v + '<br/>');
                                    });
                                    return _html.join('');
                                    /*var name = params.name,info = params.value;
                  return name+'<br/>'+info.num+'<br/>'+info.desp;*/
                                }
                            },
                            calculable: false,
                            series: [{
                                type: 'tree',
                                roam: true,
                                orient: 'horizontal', // vertical horizontal
                                rootLocation: {
                                    x: 50,
                                    //y: '60%'
                                }, // 根节点位置  {x: 'center',y: 10}
                                layerPadding: 72,
                                nodePadding: 50,
                                //symbol: 'circle',
                                symbol: 'image://public/img/computer1.gif',
                                symbolSize: [31, 28],
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: true,
                                            //position: 'inside',
                                            position: 'bottom',
                                            textStyle: {
                                                /*color: '#cc9999',
                        fontSize: 15,
                        fontWeight: 'bolder'*/
                                                color: '#000'
                                            }
                                        },
                                        lineStyle: {
                                            color: 'red',
                                            width: 1,
                                            type: 'curve' // 'curve'|'broken'|'solid'|'dotted'|'dashed'
                                        }
                                    },
                                    emphasis: {
                                        label: {
                                            show: true
                                        }
                                    }
                                },
                                //data: data
                            }]
                        };

                        for (var i = 0, len = data.length; i < len; i++) {
                            option.series[0].data = data[i];
                            //var chart = ec.init($('<div id="chart'+i+'" style="height:300px"></div>').appendTo('.canvas')[0]);
                            var chart = ec.init($('<div class="chart" style="height:400px"></div>').appendTo('.canvas')[0]);
                            chart.setOption(option);
                        }

                        /*var ecConfig = require('echarts/config');
            chart.on(ecConfig.EVENT.CLICK, eConsole);
            function eConsole(param) {
              console.log(param);
            };*/

                    });
            }
        }
    };

    op.init();
});