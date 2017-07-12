define(function(require) {
    require('async!baiduMap');
    require('TextIconOverlay');
    require('MarkerClusterer');
    require('slimscroll');
    var locationOp = null;
    /*
    百度地图自定义控件 
    */
    var gc = null;

    function cusEvent(type, target) {
        this.type = type;
        this.returnValue = true;
        this.target = target || null;
        this.currentTarget = null;
    }


    //用户列表
    function AreaListControl(option) {
        var opts = option || {};
        this.callback = null;
        this.map = null;
        this.markers = null;
        this.html = opts.html;
        this.container = document.createElement('div');
        this.container.innerHTML = this.html;
        this.defaultAnchor = opts.anchor || BMAP_ANCHOR_TOP_LEFT;
        this.defaultOffset = opts.offset || new BMap.Size(10, 10);
    }
    AreaListControl.prototype = new BMap.Control();
    AreaListControl.prototype.initialize = function(map) {
        this.map = map;
        this.container.className = 'BM_areaList';
        map.getContainer().appendChild(this.container);
        var $dom = $(this.container);
        var self = this;

        $dom.on('click', '.BM_backView', function() {
            self.backView();
        });

        $dom.on('click', '.BM_toggle', function() {
            self.toggle();
        });

        $dom.on('mouseover', function() {
            self.map.disableScrollWheelZoom();
        });
        $dom.on('mouseout', function() {
            self.map.enableScrollWheelZoom();
        });


        $dom.find('.BM_list').slimscroll({
            height: '275px',
            size: '4px',
            alwaysVisible: true
        });

        $dom.on('click', '.BM_list li', function() {
            var idx = $(this).index();
            var markers = self.markers;
            for (var i = 0; i < markers.length; i++) {
                var marker = markers[i];
                $(marker.container).removeClass('active');
            }
            var mark = markers[idx];
            $(mark.container).addClass('active');
            $(this).addClass('active').siblings().removeClass('active');
            self.BM_panTo(idx);
        });

        return this.container;
    };
    AreaListControl.prototype.backView = function() {
        var center = this.map.getCenter();
        var markers = this.markers;
        var bounds = new BMap.Bounds(center, center);
        for (var i = 0; i < markers.length; i++) {
            var marker = markers[i];
            bounds.extend(marker.getPosition());
        }
        this.map.setViewport(bounds);
        //this.map.setZoom(this.viewLevel);
    };
    AreaListControl.prototype.toggle = function() {
        var container = $(this.container);

        if (container.hasClass('open')) {
            container.removeClass('open');
        } else {
            container.addClass('open');
        }
    };
    AreaListControl.prototype.setMarkers = function(markers) {
        this.markers = markers;
    };
    AreaListControl.prototype.BM_panTo = function(idx) {
        var self = this;
        var maxZoom = this.map.getZoom();
        var maxLev = this.map.highResolutionEnabled() ? 18 : 19;
        if (this.markers[idx].isVisible()) {
            this.map.panTo(this.markers[idx].position);
        } else {
            if (maxZoom < maxLev) {
                this.map.zoomIn();
                setTimeout(function() {
                    self.BM_panTo(idx);
                }, 0);
            } else {
                this.map.panTo(this.markers[idx].position);
            }
        }
    };
    AreaListControl.prototype.destroy = function() {
        var $dom = $(this.container);
        $dom.off();
        $dom.remove();
    };

    function LocalListControl(option) {
        var opts = option || {};
        this.callback = null;
        this.map = null;
        this.markers = null;
        this.paths = opts.path;
        this.html = opts.html;
        this.container = document.createElement('div');
        this.container.innerHTML = this.html;
        this.defaultAnchor = opts.anchor || BMAP_ANCHOR_TOP_LEFT;
        this.defaultOffset = opts.offset || new BMap.Size(10, 10);
    }
    LocalListControl.prototype = new BMap.Control();
    LocalListControl.prototype.initialize = function(map) {
        this.map = map;
        this.container.className = 'BM_localList';
        map.getContainer().appendChild(this.container);
        var $dom = $(this.container);
        var self = this;

        $dom.on('click', '.BM_backView', function() {
            self.backView();
        });

        $dom.on('click', '.BM_toggle', function() {
            self.toggle();
        });

        $dom.on('mouseover', function() {
            self.map.disableScrollWheelZoom();
        });
        $dom.on('mouseout', function() {
            self.map.enableScrollWheelZoom();
        });


        $dom.find('.BM_list').slimscroll({
            height: '275px',
            size: '4px',
            alwaysVisible: true
        });

        $dom.on('click', '.BM_list li', function() {
            var idx = $(this).index();
            self.map.clearOverlays();
            var points_path = [];
            var paths = self.paths[idx];
            var len = paths.length;
            var mk = null;
            //var icon = null;
            var bound = new BMap.Bounds(paths[0], paths[0]);
            for (var i = len - 1; i >= 0; i--) {
                var p = paths[i];
                var point = new BMap.Point(p[0], p[1]);
                if (i == 0) {
                    //icon = new BMap.Icon(static_path + '/img/local/ico23.png', new BMap.Size(24, 24));
                    mk = new LocalMarker(point, {
                        type: 'endP',
                        text: idx + 1,
                        time: p[2]
                    });
                } else {
                    mk = new LocalMarker(point, {
                        time: p[2]
                    });
                    // icon = new BMap.Icon(static_path + '/img/local/ico22.png', new BMap.Size(21, 21));
                }
                self.map.addOverlay(mk);
                points_path.push(point);
                bound.extend(point);
            }
            var line = new BMap.Polyline(points_path, {
                strokeWeight: 3,
                strokeColor: '#f54336',
                strokeOpacity: 1,
                strokeStyle: 'dashed'
            });
            window.line = line;
            self.map.addOverlay(line);
            self.map.setViewport(bound);
            self.map.zoomOut();
            $(this).addClass('active').siblings().removeClass('active');
        });

        return this.container;
    };
    LocalListControl.prototype.backView = function() {
        var bounds = new BMap.Bounds();
        for (var i = 0; i < this.markers.length; i++) {
            bounds.extend(this.markers[i]);
        }
        this.map.setViewport(bounds);
        //this.map.setZoom(this.viewLevel);
    };
    LocalListControl.prototype.toggle = function() {
        var container = $(this.container);

        if (container.hasClass('open')) {
            container.removeClass('open');
        } else {
            container.addClass('open');
        }
    };
    LocalListControl.prototype.setMarkers = function(markers) {
        this.markers = markers;
    };
    LocalListControl.prototype.BM_panTo = function(idx) {
        var self = this;
        var maxZoom = this.map.getZoom();
        var maxLev = this.map.highResolutionEnabled() ? 18 : 19;
        if (this.markers[idx].isVisible()) {
            this.map.panTo(this.markers[idx].position);
        } else {
            if (maxZoom < maxLev) {
                this.map.zoomIn();
                setTimeout(function() {
                    self.BM_panTo(idx);
                }, 0);
            } else {
                this.map.panTo(this.markers[idx].position);
            }
        }
    };
    LocalListControl.prototype.destroy = function() {
        var $dom = $(this.container);
        $dom.off();
        $dom.remove();
    };

    //地图缩放
    function MapScale(option) {
        var opts = option || {};
        this.callback = null;
        this.map = null;
        this.html = opts.html;
        this.container = document.createElement('div');
        this.container.innerHTML = this.html;
        this.minZoom = null;
        this.maxZoom = null;
        this.defaultAnchor = opts.anchor || BMAP_ANCHOR_BOTTOM_RIGHT;
        this.defaultOffset = opts.offset || new BMap.Size(10, 90);
    }
    MapScale.prototype = new BMap.Control();
    MapScale.prototype.initialize = function(map) {
        this.map = map;
        this.container.className = 'BM_mapScale';
        map.getContainer().appendChild(this.container);
        this.minZoom = map.minZoom;
        this.maxZoom = map.maxZoom;

        var $dom = $(this.container);
        var self = this;
        $dom.on('click', '.BM_zoomIn', function() {
            self.in();
        });
        $dom.on('click', '.BM_zoomOut', function() {
            self.out();
        });
        return this.container;
    };
    MapScale.prototype.in = function() {
        this.map.zoomIn();
    };
    MapScale.prototype.out = function() {
        this.map.zoomOut();
    };

    //地图类型
    function MapType(option) {
        var opts = option || {};
        this.map = null;
        this.callback = null;
        this.html = opts.html;
        this.container = document.createElement('div');
        this.container.innerHTML = this.html;
        this.defaultAnchor = opts.anchor || BMAP_ANCHOR_BOTTOM_RIGHT;
        this.defaultOffset = opts.offset || new BMap.Size(0, 0);
    }
    MapType.prototype = new BMap.Control();
    MapType.prototype.initialize = function(map) {
        this.map = map;
        this.container.className = 'BM_MapType';
        map.getContainer().appendChild(this.container);

        var $dom = $(this.container);
        var self = this;
        $dom.on('click', 'li[map-type]', function() {
            var type = $(this).attr('map-type');
            if (type == 'normal') {
                self.setNormal();
            } else if (type == 'hybrid') {
                self.setHybrid();
            }
            $(this).addClass('active').siblings().removeClass('active');
        });
        return this.container;
    };
    MapType.prototype.setNormal = function() {
        this.map.setMapType(BMAP_NORMAL_MAP);
    };
    MapType.prototype.setHybrid = function() {
        this.map.setMapType(BMAP_HYBRID_MAP);
    };

    /**
     *自定义infoWindow 
     * 
     * @param {any} position
     * @param {any} option
     */
    function infoBox() {
        this.map = null;
        this.point = null;
        this.container = document.createElement('div');
        this.container.className = 'BM_infoBox_lay';
    }
    infoBox.prototype = new BMap.Overlay();
    infoBox.prototype.initialize = function(map) {
        this.map = map;
        this.map.getPanes().floatPane.appendChild(this.container);
        return this.container;
    };
    infoBox.prototype.draw = function() {
        var pt = this.map.getCenter();
        this.updatePosition(this.point || pt);
    };
    infoBox.prototype.update = function(option) {
        var opts = option || {};
        this.html = opts.html || '';
        //this.enableAutoPan = (opts.enableAutoPan == undefined || opts.enableAutoPan) ? true : false;
        this.offset = opts.offset;
        this.point = opts.point;
        this.idx = opts.idx;

        this.initHtml();
        this._getInfoBoxSize();
        this.updatePosition(this.point);
        this.bindEvent();
    };
    infoBox.prototype.initHtml = function() {
        var html = [];
        html.push('<div class="BM_infoBox">');
        html.push('<span class="BM_infoBox_close"></span>');
        html.push(this.html);
        html.push('<div class="BM_infoBox_arrow"></div>');
        html.push('<div class="BM_infoBox_shadow"></div>');
        html.push('</div>');
        this.container.innerHTML = html.join('');
    };

    infoBox.prototype.updatePosition = function(point) {
        var pixel = this._getPointPosition(point);
        this.container.style.left = pixel.x - this._boxWidth / 2 + 'px';
        this.container.style.top = pixel.y - this._boxHeight - 60 + 'px';
    };

    infoBox.prototype.bindEvent = function() {
        var $dom = $(this.container),
            self = this;
        $dom.on('click', '.BM_infoBox_close', function() {
            $dom.css('display', 'none');
        });
        $dom.on('click', '.bm_go_hs', function() {
            $('#custom-toolbar li:eq(1)').addClass('active').siblings().removeClass('active');
            locationOp.initMapHs(null, locationOp.map, self.idx - 1);
        });
        this.map.addEventListener('zoomend', function() {
            self.point && self.updatePosition(self.point);
        });
    };

    infoBox.prototype.open = function(option) {
        this.update(option);
        this._panBox();
        this.container.style.display = 'block';
        return;
    };
    infoBox.prototype.close = function() {
        this.container.style.display = 'none';
        return false;
    };
    infoBox.prototype.show = function() {
        this.container.style.display = 'block';
    };
    infoBox.prototype.hide = function() {
        this.container.style.display = 'none';
    };
    infoBox.prototype._panBox = function() {
        // if (!this.enableAutoPan) {
        //     return;
        // }
        var mapH = parseInt(this.map.getContainer().offsetHeight, 10),
            mapW = parseInt(this.map.getContainer().offsetWidth, 10),
            boxH = this._boxHeight + 70,
            boxW = this._boxWidth;

        if (boxH >= mapH || boxW >= mapW) {
            return;
        }

        if (!this.map.getBounds().containsPoint(this.point)) {
            this.map.setCenter(this.point);
        }

        var anchorPos = this.map.pointToPixel(this.point),
            panY, panX,
            panLeft = anchorPos.x - (boxW / 2),
            panRight = mapW - (boxW / 2 + anchorPos.x),
            panTop = anchorPos.y - boxH,
            panBottom = mapH - anchorPos.y;

        if (panLeft < 0) {
            panX = -panLeft;
        } else if (panRight < 0) {
            panX = panRight - 30;
        } else {
            panX = 0;
        }

        if (panTop < 0) {
            panY = -panTop;
        } else if (panBottom < 0) {
            panY = panBottom;
        } else {
            panY = 0;
        }

        this.map.panBy(panX, panY);
    };
    infoBox.prototype._getPointPosition = function(point) {
        this.pointPosition = this.map.pointToOverlayPixel(point);
        return this.pointPosition;
    };

    infoBox.prototype._dispatchEvent = function(instance, type, opts) {
        type.indexOf('on') != 0 && (type = 'on' + type);
        var event = new cusEvent(type);
        if (!!opts) {
            for (var p in opts) {
                event[p] = opts[p];
            }
        }
        instance.dispatchEvent(event);
    };

    infoBox.prototype._removeMarkerEvt = function() {
        this._markerDragend && this._marker.removeEventListener('dragend', this._markerDragend);
        this._markerDragging && this._marker.removeEventListener('dragging', this._markerDragging);
        this._markerDragend = this._markerDragging = null;
    };

    infoBox.prototype._getInfoBoxSize = function() {
        //this._boxWidth = parseInt(this.container.offsetWidth, 10);
        //this._boxHeight = parseInt(this.container.offsetHeight, 10);
        this._boxWidth = 258;
        this._boxHeight = 134;
    };
    infoBox.prototype.destroy = function() {
        var $dom = $(this.container);
        $dom.off().remove();
    };

    /**
     * 单个标注物
     * 
     * @param {any} dom
     * @returns
     */
    function PosMarker(position, option) {
        var opts = option || {};
        this.map = null;
        this.container = document.createElement('div');
        //this.container.className = 'BM_posMk';
        this.position = position;
        this.online = opts.online || 0;
        this.text = opts.text || '';
        this.time = opts.time || '';
        this.mobName = opts.mobName || '';
        this.ip = opts.ip || '';
        this.pos = opts.pos || '';
        this.version = opts.version || '';
        this.localStr = opts.localStr || '...';
        this.container.className = (this.online === 1 ? 'BM_posMk online' : 'BM_posMk offline');
    }

    PosMarker.prototype = new BMap.Overlay();

    PosMarker.prototype.initialize = function(map) {
        this.map = map;
        this.updateText();
        this.updatePosition();
        this.map.getPanes().markerMouseTarget.appendChild(this.container);
        var $dom = $(this.container);
        var self = this;
        $dom.on('mouseover', function() {
            self.setTop(true);
        });
        $dom.on('mouseout', function() {
            self.setTop(false);
        });

        $dom.on('click', function(e) {
            if (e && e.stopPropagation) {
                e.stopPropagation();
            } else {
                window.event.cancelBubble = true;
            }
            gc.getLocation(self.position, function(rs) {
                var infoHtml = [];
                infoHtml.push('<div class="BM_info">');
                infoHtml.push('<dl><dt class="' + (self.online == 1 ? 'online' : 'offline') + '">' + self.mobName + '</dt>');
                infoHtml.push('<dd>IP地址：' + self.ip + '</dd>');
                infoHtml.push('<dd>上报时间：' + self.time + '</dd>');
                // infoHtml.push('<dd>终端版本：' + this.version + '</dd>');
                infoHtml.push('<dd><a href="javascript:void(0);" class="bm_go_hs"></a><p>当前位置：' + rs.address + '</p></dd></dl></div>');
                var infoOpt = {
                    html: infoHtml.join(''),
                    enableMessage: false,
                    offset: new BMap.Size(0, 10),
                    point: self.getPosition(),
                    idx: self.text
                };
                self.map.infoBox.open(infoOpt);
                if (!self.map.infoBox.isExit) {
                    self.map.infoBox.isExit = true;
                    self.map.addOverlay(self.map.infoBox);
                }
            });
        });
        return this.container;
    };
    PosMarker.prototype.draw = function() {
        this.map && this.updatePosition();
    };
    PosMarker.prototype.updateText = function() {
        this.container.innerHTML = this.text +
            '<div class="BM_posMk_info"><div class="time">' +
            this.time +
            '</div><div class="name">' +
            this.mobName +
            '</div></div>';
    };
    PosMarker.prototype.getPosition = function() {
        return this.position;
    };
    PosMarker.prototype.setPosition = function(position) {
        if (position && (!this.position || !this.position.equals(position))) {
            this.position = position;
            this.updatePosition();
        }
    };
    PosMarker.prototype.getMap = function() {
        return this.map;
    };
    PosMarker.prototype.updatePosition = function() {
        if (this.container && this.position) {
            var $dom = $(this.container);
            var pixelPosition = this.map.pointToOverlayPixel(this.position);
            pixelPosition.x -= Math.ceil(parseInt($dom.width()) / 2);
            pixelPosition.y -= Math.ceil(parseInt($dom.height()) / 2);
            $dom.css({
                'left': pixelPosition.x + 'px',
                'top': pixelPosition.y + 'px'
            });
        }
    };
    PosMarker.prototype.setTop = function(bool) {
        var fa = $(this.container);
        var preIdx = fa.attr('preIdx');
        var idx = fa.css('z-index');
        var max = this.map.getOverlays().length;
        if (bool) {
            if (preIdx) {
                return;
            }
            fa.attr(idx);
            fa.css('z-index', max + 99);
        } else {
            if (preIdx) {
                fa.css('z-index', preIdx);
            }
        }
    };
    PosMarker.prototype.openInfoWindow = function(infoW) {
        var point = new BMap.Point(this.getPosition().lng, this.getPosition().lat);
        this.map.openInfoWindow(infoW, point);
    };
    PosMarker.prototype.closeInfoWindow = function() {
        this.map.closeInfoWindow();
    };
    PosMarker.prototype.destroy = function() {
        var $dom = $(this.container);
        $dom.off().remove();
        // this.infoWindow.destroy();
        // this.infoWindow = null;
    };

    /**
     * 多用户单标注（当多个节点在同一个经纬度上时使用）
     * 
     * @param {any} dom
     * @returns
     */
    function MuliMarker(position, option) {
        var opts = option || {};
        this.map = null;
        this.container = document.createElement('div');
        this.container.className = 'BM_mulMk';
        this.html = null;
        this.position = position;
        this.list = opts.list;
        this.text = opts.text;
        this.onlineNum = 0;
        this.offlineNum = 0;
    }
    MuliMarker.prototype = new BMap.Overlay();
    MuliMarker.prototype.initialize = function(map) {
        this.map = map;
        this.onlineNum = this.getOnlineLen();
        this.offlineNum = this.getOfflineLen();
        this.updateHtml();
        this.updatePosition();
        this.bindEvent();
        this.map.getPanes().markerMouseTarget.appendChild(this.container);
        return this.container;
    };
    MuliMarker.prototype.draw = function() {
        this.map && this.updatePosition();
        $(this.container).off();
        this.bindEvent();
    };
    MuliMarker.prototype.getMap = function() {
        return this.map;
    };
    MuliMarker.prototype.updateHtml = function() {
        var html = [];
        html.push('<span>人群' + this.text + '</span>');
        html.push('<div class="BM_mulMk_list_box">');
        html.push('<div class="BM_mulMk_iist_box_head"><i class="arrow"></i><i class="BM_mulMk_list_toggle"></i>');
        html.push('<h2>当前人群内在线<em class="red">' + this.onlineNum + '</em>，离线<em class="gray">' + this.offlineNum + '</em></h2></div>');
        html.push('<div class="BM_mulMk_list">');
        html.push('<ul>');
        for (var i = 0; i < this.list.length; i++) {
            var li = this.list[i];
            html.push('<li><dl>');
            html.push('<dt class="' + (li.online == 1 ? 'online' : 'offline') + '">' + li.name + '</dt>');
            html.push('<dd>IP地址:' + li.ip + '终端版本:' + li.version + '</dd>');
            html.push('<dd>上报时间:' + li.nearTime + '</dd>');
            html.push('<dd>当前位置:' + li.pos + '</dd>');
            html.push('</dl></li>');
        }
        html.push('</ul></div>');
        html.push('</div>');
        this.container.innerHTML = html.join('');
    };
    MuliMarker.prototype.updatePosition = function() {
        if (this.container && this.position) {
            var $dom = $(this.container);
            var pixelPosition = this.map.pointToOverlayPixel(this.position);
            pixelPosition.x -= Math.ceil(parseInt($dom.width()) / 2);
            pixelPosition.y -= Math.ceil(parseInt($dom.height()) / 2);
            $dom.css({
                'left': pixelPosition.x + 'px',
                'top': pixelPosition.y + 'px'
            });
        }
    };
    MuliMarker.prototype.getPosition = function() {
        return this.position;
    };
    MuliMarker.prototype.setPosition = function(position) {
        if (position && (!this.position || !this.position.equals(position))) {
            this.position = position;
            this.updatePosition();
        }
    };
    MuliMarker.prototype.bindEvent = function() {
        var self = this;
        var $dom = $(this.container);
        $dom.on('click', '.BM_mulMk_list_toggle', function(e) {
            var $obj = $dom.find('.BM_mulMk_list_box');
            if ($obj.hasClass('open')) {
                $obj.removeClass('open');
            } else {
                $obj.addClass('open');
            }
        });

        $dom.on('mouseover', '.BM_mulMk_list_box', function() {
            self.map.disableScrollWheelZoom();
            self.map.disableDoubleClickZoom();
        });
        $dom.on('mouseout', '.BM_mulMk_list_box', function() {
            self.map.enableScrollWheelZoom();
            self.map.enableDoubleClickZoom();
        });
        $dom.find('.BM_mulMk_list ul').slimscroll({
            height: '182px',
            size: '4px',
            alwaysVisible: true
        });
    };
    MuliMarker.prototype.getOnlineLen = function() {
        var num = 0,
            list = this.list,
            li = null;
        for (var i = 0; i < list.length; i++) {
            li = list[i];
            if (li.online == 1) {
                num++;
            }
        }
        return num;
    };
    MuliMarker.prototype.getOfflineLen = function() {
        var num = 0,
            list = this.list,
            li = null;
        for (var i = 0; i < list.length; i++) {
            li = list[i];
            if (li.online == 0) {
                num++;
            }
        }
        return num;
    };

    function LocalMarker(position, option) {
        var opts = option || {};
        this.map = null;
        this.container = document.createElement('div');
        this.type = opts.type || 'normal';
        this.container.className = 'BM_localMk ' + this.type;
        this.position = position;
        this.text = option.text || '';
        this.time = option.time || '';
    }
    LocalMarker.prototype = new BMap.Overlay();
    LocalMarker.prototype.initialize = function(map) {
        this.map = map;
        this.initHtml();
        this.updatePosition();
        this.bindEvent();
        this.map.getPanes().markerMouseTarget.appendChild(this.container);
        return this.container;
    };
    LocalMarker.prototype.draw = function() {
        this.map && this.updatePosition();
    };
    LocalMarker.prototype.getPosition = function() {
        return this.position;
    };
    LocalMarker.prototype.setPosition = function(position) {
        this.position = position;
    };
    LocalMarker.prototype.initHtml = function() {
        var pt = this.getPosition();
        var self = this;
        gc.getLocation(pt, function(rs) {
            var addComp = rs.addressComponents;
            var str = [addComp.province, addComp.city, addComp.district, addComp.street, addComp.streetNumber].join('');
            var html = [];
            var className = self.type;
            var w = str.length * 14;
            html.push('<span class="' + className + '">' + self.text + '</span>');
            html.push('<div class="BM_localMk_info" style="width:' + w + 'px;left:-' + ((w / 2) - 10) + 'px;"><div class="time">' + self.time + '</div><div>' + /*this.local*/ str + '</div></div>');
            self.container.innerHTML = html.join('');
        });

    };
    LocalMarker.prototype.bindEvent = function() {
        var $dom = $(this.container);
        var self = this;
        $dom.on('mouseover', function() {
            $(this).find('.BM_localMk_info').show();
        });

        $dom.on('mouseout', function() {
            $(this).find('.BM_localMk_info').hide();
        });
    };
    LocalMarker.prototype.updatePosition = function() {
        if (this.container && this.position) {
            var $dom = $(this.container);
            var pixelPosition = this.map.pointToOverlayPixel(this.position);
            pixelPosition.x -= Math.ceil(parseInt($dom.width()) / 2);
            pixelPosition.y -= Math.ceil(parseInt($dom.height()) / 2);
            $dom.css({
                'left': pixelPosition.x + 'px',
                'top': pixelPosition.y + 'px'
            });
        }
    };

    /*
     具体返回方法
     */
    function initMap(dom, op) {
        var map = new BMap.Map(dom, { enableMapClick: false });
        var point = new BMap.Point(116.404, 39.915);
        gc = new BMap.Geocoder();
        map.centerAndZoom(point, 15);
        map.enableScrollWheelZoom();
        map.infoBox = new infoBox();
        map.addOverlay(map.infoBox);
        locationOp = op;
        window.map = map;
        return map;
    }

    function initList(map, opt) {
        if (map.infoBox && map.infoBox.isExit) {
            self.map.infoBox.isExit = false;
        }
        var bm_list = new AreaListControl(opt);
        map.addControl(bm_list);
        return bm_list;
    }

    function initHsList(map, opt) {
        //map.infoBox.isExit = false;
        var bm_list = new LocalListControl(opt);
        map.addControl(bm_list);
        return bm_list;
    }

    function initMapType(map, opt) {
        var maptype = new MapType(opt);
        map.addControl(maptype);
    }

    function initMapScale(map, opt) {
        var scale = new MapScale(opt);
        map.addControl(scale);
    }

    function initMapPos(map, list, listObj) {
        //var newmk = getNewMarkers(50);
        var newmk = getMarkers(list, listObj);
        if (list.length <= 0) {
            return false;
        }
        var mkClusterer = new BMapLib.MarkerClusterer(map, { markers: newmk });

        var myStyles = [{
            size: new BMap.Size(46, 46),
            opt_anchor: [46, 46],
            textColor: '#fff',
            opt_textSize: 14
        }];
        mkClusterer.setStyles(myStyles);
        return mkClusterer;
    }

    /**
     * 处理获取的数据
     * 输出BMap.marker
     * @param {any} list
     * @returns
     */
    function getMarkers(arr, listObj) {
        var list = handleListData(arr);
        var newMarkers = [];
        var newmk = [];
        var mulit = 1;
        var text = '';
        var opt = null;
        for (var lis in list) {
            var obj = list[lis];
            var li = obj[0];
            var pt = new BMap.Point(li.local[0], li.local[1]);
            if (obj.length > 1) {
                text = mulit++;
                opt = {
                    text: text,
                    list: obj
                };
                var Muli = new MuliMarker(pt, opt);
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
                    version: li.version
                };
                var pos = new PosMarker(pt, opt);
                newmk[li['cusIdx']] = pos;
                newMarkers.push(pos);
            }
        }
        listObj.setMarkers(newmk);
        var bounds = new BMap.Bounds();
        for (var i = 0; i < newmk.length; i++) {
            bounds.extend(newmk[i].getPosition());
        }
        listObj.map.setViewport(bounds);
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

    /**
     * 得到一个随机的marker数组 （测试用）
     * 
     * @param {any} MAX
     */
    function getNewMarkers(MAX) {

        var newMarkers = [];
        for (var i = 0; i < MAX; i++) {
            var pt = new BMap.Point(Math.random() * 0.01 + 116.404, Math.random() * 0.01 + 39.915);
            newMarkers.push(new BMap.Marker(pt, { icon: myIconOn }));
        }
        return newMarkers;
    }

    function getLocal(pos, idx, obj, fn) {
        var pt = new BMap.Point(pos[0], pos[1]);
        gc.getLocation(pt, function(rs) {
            console.log(rs);
            // var addComp = rs.addressComponents;
            // var str = [addComp.province, addComp.city, addComp.district, addComp.street, addComp.streetNumber].join(',');
            var str = rs.address;
            obj[idx].localStr = str;
            fn && fn('当前位置：' + str, idx);
        });
    }


    return {
        initMap: initMap,
        initList: initList,
        initHsList: initHsList,
        initMapType: initMapType,
        initMapScale: initMapScale,
        initMapPos: initMapPos,
        getLocal: getLocal
    };
});