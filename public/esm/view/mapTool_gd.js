define(function(require) {
    require('gdMap');
    require('slimscroll');
    var view = null,
        gc = null,
        infoWindow = null,
        map = null,
        newMks,
        cluster,
        newmk = [];


    /**
     * 单个标注物
     * 
     * @param {any} dom
     * @returns
     */
    function PosMarker(position, option, map) {
        var opts = option || {};
        // this.map = map;
        // this.container.className = 'BM_posMk';
        // this.position = position;
        opts.online = opts.online || 0;
        opts.text = opts.text || '';
        opts.time = opts.time || '';
        opts.mobName = opts.mobName || '';
        opts.ip = opts.ip || '';
        opts.pos = opts.pos || '';
        opts.version = opts.version || '';
        opts.localStr = opts.localStr || '...';
        opts.className = (opts.online === 1 ? 'AM_posMk online' : 'AM_posMk offline');
        opts.local_pos = position;
        var html = [];
        html.push('<div class="' + opts.className + '" cusIdx="' + opts.cusIdx + '">');
        html.push(opts.text);
        html.push('<div class="BM_posMk_info"><div class="time">');
        html.push(opts.time);
        html.push('</div><div class="name">');
        html.push(opts.mobName);
        html.push('</div></div></div>');

        var mk = new AMap.Marker({
            map: map,
            position: position,
            content: html.join('')
        });

        mk.customOpt = opts;
        mk.on('click', posMarkerClick);
        return mk;
    }

    function posMarkerClick(e) {

        var self = e.target.customOpt;

        var pt = [Number(self.local_pos[0]), Number(self.local_pos[1])];
        gc.getAddress(pt, function(status, res) {
            if (status === 'complete' && res.info === 'OK') {
                self.localStr = res.regeocode.formattedAddress;
            } else {
                self.localStr = '...';
            }
            var html = updateInfoWindow(self);
            infoWindow.setContent(html.join(''));
            infoWindow.open(map, e.target.getPosition());
        });

        view.on('click.apMk', '.AM_infoBox_close', function() {
            map.clearInfoWindow();
        });

    }

    function updateInfoWindow(self) {
        var infoHtml = [];
        infoHtml.push('<div class="AM_info">');
        infoHtml.push('<dl><dt class="' + (self.online == 1 ? 'online' : 'offline') + '">' + self.mobName + '</dt>');
        infoHtml.push('<dd>IP地址：' + self.ip + '</dd>');
        infoHtml.push('<dd>上报时间：' + self.time + '</dd>');
        // infoHtml.push('<dd>终端版本：' + this.version + '</dd>');
        infoHtml.push('<dd><a href="javascript:void(0);" class="bm_go_hs" cusIdx="' + self.cusIdx + '"></a><p>当前位置：' + self.localStr + '</p></dd></dl></div>');

        var html = [];
        html.push('<div class="AM_infoBox_lay"><div class="AM_infoBox">');
        html.push('<span class="AM_infoBox_close"></span>');
        html.push(infoHtml.join(''));
        html.push('<div class="AM_infoBox_arrow"></div>');
        html.push('<div class="AM_infoBox_shadow"></div>');
        html.push('</div></div>');

        return html;

    }

    /**
     * 多用户单标注（当多个节点在同一个经纬度上时使用）
     * 
     * @param {any} dom
     * @returns
     */
    function MuliMarker(position, option, map) {
        var opts = option || {};
        // this.map = null;
        // this.container = document.createElement('div');
        // this.container.className = 'BM_mulMk';
        // this.html = null;
        // this.position = position;
        opts.list = opts.list;
        opts.text = opts.text;
        opts.onlineNum = 0;
        opts.offlineNum = 0;


        var html = [],
            su_html = [];
        for (var i = 0; i < opts.list.length; i++) {
            var li = opts.list[i];
            su_html.push('<li><dl>');
            su_html.push('<dt class="' + (li.online == 1 ? 'online' : 'offline') + '">' + li.name + '</dt>');
            // su_html.push('<dd>IP地址:' + li.ip + '终端版本:' + li.version + '</dd>');
            su_html.push('<dd>上报时间:' + li.nearTime + '</dd>');
            su_html.push('<dd>当前位置:' + li.pos + '<a href="javascript:void(0);" class="bm_go_hs" cusIdx="' + li.cusIdx + '"></a></dd>');
            su_html.push('</dl></li>');
            if (li.online == 1) {
                opts.onlineNum++;
            } else {
                opts.offlineNum++;
            }
        }
        html.push('<span>人群' + opts.text + '</span>');
        html.push('<div class="AM_mulMk_list_box">');
        html.push('<div class="AM_mulMk_iist_box_head"><i class="arrow"></i><i class="AM_mulMk_list_toggle"></i>');
        html.push('<h2>当前人群内在线<em class="red">' + opts.onlineNum + '</em>，离线<em class="gray">' + opts.offlineNum + '</em></h2></div>');
        html.push('<div class="AM_mulMk_list">');
        html.push('<ul>');
        html.push(su_html.join(''));
        html.push('</ul></div>');
        html.push('</div>');
        var mk = new AMap.Marker({
            map: map,
            position: position,
            content: '<div class="AM_mulMk">' + html.join('') + '</div>'
        });

        view.on('click.apMk', '.AM_mulMk_list_toggle', function() {
            var $obj = $(this).closest('.AM_mulMk_list_box');
            $obj.find('.AM_mulMk_list ul').slimscroll({
                height: '182px',
                size: '4px',
                alwaysVisible: true
            });
            if ($obj.hasClass('open')) {
                $obj.removeClass('open');
            } else {
                $obj.addClass('open');
            }
        });
        view.on('mouseover.apMk', '.AM_mulMk_list_box', function() {
            map.setStatus({
                scrollWheel: false
            });
        }).on('mouseout.apMk', '.AM_mulMk_list_box', function() {
            map.setStatus({
                scrollWheel: true
            });
        });

        return mk;
    }

    /*轨迹结点marker*/
    function LocalMarker(position, opt) {
        var html = [];
        opt.type = opt.type || 'normal';
        opt.text = opt.text || '';
        html.push('<div class="AM_localMk ' + opt.type + '">');
        html.push('<span class="' + opt.type + '">' + opt.text + '</span>');
        html.push('<div class="AM_localMk_info" style="width:150px;left:-70px;"><div class="time">' + opt.time + '</div><div>...</div></div>');
        html.push('</div>');
        var mk = new AMap.Marker({
            map: map,
            position: position,
            offset: new AMap.Pixel(-12, -12),
            content: html.join('')
        });
        var pt = [Number(position[0]), Number(position[1])];
        gc.getAddress(pt, function(status, res) {
            if (status === 'complete' && res.info === 'OK') {
                var str = res.regeocode.formattedAddress;
                var w = str.length * 14;
                var _html = [];
                _html.push('<div class="AM_localMk ' + opt.type + '">');
                _html.push('<span class="' + opt.type + '">' + opt.text + '</span>');
                _html.push('<div class="AM_localMk_info" style="width:' + w + 'px;left:-' + ((w / 2) - 10) + 'px;"><div class="time">' + opt.time + '</div><div>' + /*this.local*/ str + '</div></div>');
                _html.push('</div>');
                mk.setContent(_html.join(''));
            }
        });



        view.on('mouseover.apMk', '.AM_localMk', function() {
            $(this).find('.AM_localMk_info').show();
        });

        view.on('mouseout.apMk', '.AM_localMk', function() {
            $(this).find('.AM_localMk_info').hide();
        });
    }




    function initMap(dom, op) {
        view = $('.map-wrap');
        map = new AMap.Map(dom, {
            enableMapClick: false,
            resizeEnable: true
        });
        gc = new AMap.Geocoder({ radius: 1000, extensions: 'all' });

        infoWindow = new AMap.InfoWindow({
            isCustom: true,
            content: '',
            autoMove: true,
            offset: new AMap.Pixel(0, -60)
        });
        map.clearInfoWindow();

        map.setFitView();
        //locationOp = op;
        //map.setFitView();
        window.gdmap = map;
        return map;
    }

    function initList(map, temp_html) {
        temp_html = '<div class="AM_areaList">' + temp_html + '</div>';
        view.append(temp_html);
        view.find('.AM_list').slimscroll({
            height: '275px',
            size: '4px',
            alwaysVisible: true
        });
        view.on('click.apMk', '.AM_areaList .AM_backView', function() {
            map.setFitView();
        });

        view.on('click.apMk', '.AM_areaList .AM_toggle', function() {
            var dom = $(this).closest('.AM_areaList');
            if (dom.hasClass('open')) {
                dom.removeClass('open');
            } else {
                dom.addClass('open');
            }
        });

        view.on('click.apMk', '.AM_list li', function() {
            var idx = $(this).index();
            view.find('.AM_posMk,.AM_mulMk').removeClass('active');
            view.find('[cusIdx=' + idx + ']').addClass('active');
            var mk = newmk[idx];
            map.panTo(mk.getPosition());
            map.setFitView(mk);
        });


    }

    function initHsList(map, opt) {
        var temp_html = opt.html;
        var paths = opt.path;
        temp_html = '<div class="AM_localList">' + temp_html + '</div>';
        view.append(temp_html);
        view.find('.AM_list').slimscroll({
            height: '275px',
            size: '4px',
            alwaysVisible: true
        });
        view.on('click.apMk', '.AM_localList .AM_backView', function() {
            map.setFitView();
        });

        view.on('click.apMk', '.AM_localList .AM_toggle', function() {
            var dom = $(this).closest('.AM_localList');
            if (dom.hasClass('open')) {
                dom.removeClass('open');
            } else {
                dom.addClass('open');
            }
        });

        view.on('click.apMk', '.AM_list li', function() {
            var idx = $(this).index();
            map.clearMap();
            var _paths = paths[idx].slice(0);
            for (var i = 0; i < _paths.length; i++) {
                var p = _paths[i];
                var point = [Number(p[0]), Number(p[1])];
                if (i == 0) {
                    mk = LocalMarker(point, {
                        type: 'endP',
                        text: Number(idx) + 1,
                        time: p[2]
                    });
                } else {
                    mk = LocalMarker(point, {
                        time: p[2]
                    });
                }
            }
            new AMap.Polyline({
                map: map,
                path: _paths,
                strokeWeight: 3,
                strokeColor: '#f54336',
                strokeOpacity: 1,
                strokeStyle: 'dashed'
            });
            setTimeout(function() {
                map.setFitView();
            }, 0);
            $(this).addClass('active').siblings().removeClass('active');
        });
    }

    function initMapType(map) {
        var temp_html = [];
        temp_html.push('<div class="AM_MapType">');
        temp_html.push('<ul>');
        temp_html.push('<li class="AM_mapType_1 active" map-type="normal"></li>');
        temp_html.push('<li class="AM_mapType_2" map-type="hybrid"></li>');
        temp_html.push('</ul>');
        temp_html.push('</div>');
        view.append(temp_html.join(''));

        var satellite = new AMap.TileLayer.Satellite({
            zIndex: 10
        });
        satellite.setMap(map);
        satellite.hide();

        view.on('click', 'li[map-type]', function() {
            var type = $(this).attr('map-type');
            if (type == 'normal') {
                satellite.hide();
            } else if (type == 'hybrid') {
                satellite.show();;
            }
            $(this).addClass('active').siblings().removeClass('active');
        });
    }

    function initMapScale(map, temp_html) {
        var temp_html = [];
        temp_html.push('<ul class="AM_scale">');
        temp_html.push('<li class="AM_zoomIn"></li>');
        temp_html.push('<li class="AM_zoomOut"></li>');
        temp_html.push('</ul>');
        view.append(temp_html.join(''));
        view.on('click', '.AM_zoomIn', function() {
            map.zoomIn();
        });
        view.on('click', '.AM_zoomOut', function() {
            map.zoomOut();
        });
    }

    function initMapPos(map, list, listObj) {
        return getMarkers(list, listObj, map);
    }

    /**
     * 处理获取的数据
     * 输出BMap.marker
     * @param {any} list
     * @returns
     */
    function getMarkers(arr, listObj, map) {
        var list = handleListData(arr);
        var newMarkers = [];
        var mulit = 1;
        var text = '';
        var opt = null;
        for (var lis in list) {
            var obj = list[lis];
            var li = obj[0];
            var pt = [Number(li.local[0]), Number(li.local[1])];
            if (obj.length > 1) {
                text = mulit++;
                opt = {
                    text: text,
                    list: obj
                };
                var Muli = MuliMarker(pt, opt, map);
                for (var i = 0; i < obj.length; i++) {
                    newmk[obj[i]['cusIdx']] = Muli;
                }
                newMarkers.push(Muli);
            } else {
                text = li['cusIdx'] + 1;
                opt = {
                    text: text,
                    online: li.online,
                    time: li.nearTime,
                    mobName: li.name,
                    pos: li.pos,
                    ip: li.ip,
                    version: li.version,
                    cusIdx: li['cusIdx']
                };
                var pos = PosMarker(pt, opt, map);
                newmk[li['cusIdx']] = pos;
                newMarkers.push(pos);
            }
        }
        map.setFitView();
        newMks = newMarkers;
        addCluster(newMarkers);
        return newMarkers;
    }

    /**
     * 处理获取的数据 把local 相同的分为一组
     * 
     * @param {any} list
     * @returns object
     *
     */
    function handleListData(list) {
        var h_list = {};
        for (var i = 0; i < list.length; i++) {
            var li = list[i];
            li['cusIdx'] = i;
            var localHash = li.local[0] + '-' + li.local[1];
            if (!h_list[localHash]) {
                h_list[localHash] = [];
            }
            h_list[localHash].push(li);
        }
        return h_list;
    }

    /*添加点聚合*/
    function addCluster(markers) {
        if (cluster) {
            cluster.setMap(null);
        }

        var sts = [{
            url: static_path + "/img/local/ico09.png",
            size: new AMap.Size(46, 46),
            offset: new AMap.Pixel(-24, -45),
            textColor: '#fff'
        }];

        cluster = new AMap.MarkerClusterer(map, markers, {
            styles: sts
        });

        //console.log('cluster', cluster);
        window.cluster = cluster;
    }

    function getLocal(pos, idx, obj, fn) {
        var pt = [Number(pos[0]), Number(pos[1])];
        gc.getAddress(pt, function(status, res) {
            console.log('getlocation', status, res);
            if (status === 'complete' && res.info === 'OK') {
                var str = res.regeocode.formattedAddress;
                obj[idx].localStr = str;
                fn && fn('当前位置：' + str, idx);
            }
        });
    }

    function convertFromBd(arr, callback) {
        var pointArr = [];
        for(var i =0;i<arr.length;i++){
            var paths = arr[i].path;
            for(var j=0;j<paths.length;j++){
                pointArr.push([parseFloat(paths[j][0],10),parseFloat(paths[j][1],10)]);
            }
        }
        AMap.convertFrom(pointArr,'baidu',function(status,result){
            if(result.locations){
                var len =0;
                var _paths = result.locations;
                for(var i =0;i<arr.length;i++){
                    var paths = arr[i].path;
                    for(var j=0;j<paths.length;j++){
                        paths[j][0]=_paths[len]['lng'];
                        paths[j][1]=_paths[len]['lat'];
                        len++;
                    }
                }
                result.locations = arr;
            }
            
            callback&&callback(status,result);
        });
    }

    function clear(map) {
        map.clearMap();
        cluster && map.remove(cluster);
        map.remove(map.getAllOverlays());
        view.off('.apMk');
        view.find('.AM_areaList,.AM_localList').remove();
        newMks = [];
        cluster = null;
        newmk = [];
    }

    return {
        initMap: initMap,
        initList: initList,
        initHsList: initHsList,
        initMapType: initMapType,
        initMapScale: initMapScale,
        initMapPos: initMapPos,
        getLocal: getLocal,
        clear: clear,
        convertFromBd: convertFromBd
    };
});