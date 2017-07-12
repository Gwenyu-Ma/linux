define(function (require) {
    require('hashchange');
    var router = {
        _map: {},
        _previousView: undefined,
        _currentView: undefined,
        map: function (config) {
            $.extend(this._map, config);
        },
        _switchPage: function (hash) {
            //console.log('_previousView :::::::');
            //console.log(this._previousView);
            //console.log('_currentView :::::::');
            //console.log(this._currentView);

            //$('body>.page-masklayer').addClass('switch');
            var path = this._getLoadPath(this._currentView, hash);
            //console.log(path);

            if (path.destroy.length > 0) {
                this._destoryPage(path);
            } else {
                this._loadPage(path);
            }
            //$('body>.page-masklayer').removeClass('switch');


        },
        _loadPage: function (path) {
            var loadLen = path.load.length,
                offset = path.next.length - loadLen,
                loadLastPath = path.load[loadLen - 1],
                loadParams = undefined;
            if (loadLen > 0) {
                if (loadLastPath.indexOf('?') > 0) {
                    path.load[loadLen - 1] = loadLastPath.substring(0, loadLastPath.indexOf('?'));
                    loadParams = loadLastPath.substring(loadLastPath.indexOf('?') + 1);
                }
                require(path.load, function () {

                    for (var i = 0, len = arguments.length; i < len; i++) {
                        if (i == (len - 1) && loadParams) {
                            arguments[i].render(router._getContainer(path.next[i + offset]), loadParams);
                        } else {
                            arguments[i].render(router._getContainer(path.next[i + offset]));
                        }
                    }
                    router._previousView = router._currentView;
                    router._currentView = path.next;
                    $(window).trigger('PageLoad', [router._currentView, router._previousView]);
                    //$('body>.page-masklayer').removeClass('switch');
                });
            } else {
                router._previousView = router._currentView;
                router._currentView = path.next;
            }
        },
        _destoryPage: function (path) {
            var destroyLen = path.destroy.length,
                destroyLastPath = path.destroy[destroyLen - 1];
            if (destroyLen > 0) {
                if (destroyLastPath.indexOf('?') > 0) {
                    path.destroy[destroyLen - 1] = destroyLastPath.substring(0, destroyLastPath.indexOf('?'));
                }
                require(path.destroy, function () {
                    //console.log('destroy: ' + path.destroy);
                    //console.log(arguments);
                    for (var i = arguments.length - 1; i >= 0; i--) {
                        arguments[i].destroy && arguments[i].destroy();
                    }
                    router._loadPage(path);
                });
            }
        },
        _getLoadPath: function (current, hash) {
            var next,
                load = [],
                destroy = [],
                currentIndex,
                compare;
            //console.log('next: ' + hash.value);
            next = hash.path.split('/');
            for (var i = 0, len = next.length; i < len; i++) {
                if (i > 0) {
                    next[i] = next[i - 1] + '/' + next[i];
                }
            }
            if (hash.params && next.length > 1) {
                next[next.length - 1] += ('?' + hash.params);
            }
            if (current) {
                // 对比
                currentIndex = current.length - 1;
                compare = true;
                for (var i = 0, len = next.length; i < len; i++) {
                    if (compare) {
                        if (i > currentIndex) {
                            //load.push(next[i]);
                            load.push(this._toFilePath(next[i]));
                            compare = false;
                        } else {
                            if (next[i] != current[i]) {
                                //load.push(next[i]);
                                load.push(this._toFilePath(next[i]));
                                //destroy.push(current[i]);
                                destroy.push(this._toFilePath(current[i]));
                                compare = false;
                            }
                        }
                    } else {
                        //current[i]&&destroy.push(current[i]);
                        current[i] && destroy.push(this._toFilePath(current[i]));
                        //load.push(next[i]);
                        load.push(this._toFilePath(next[i]));
                    }
                }
                var num = next.length - current.length;
                if (num < 0) {
                    //destroy = destroy.concat(current.slice(num));
                    var arr = current.slice(num);
                    for (var i = 0, len = arr.length; i < len; i++) {
                        destroy.push(this._toFilePath(arr[i]));
                    }
                }
            } else {
                //load = next;
                for (var i = 0, len = next.length; i < len; i++) {
                    load.push(this._toFilePath(next[i]));
                }
            }
            return {
                destroy: destroy,
                load: load,
                next: next
            };
        },
        _toFilePath: function (path) {
            var index = path.indexOf('?');
            if (index < 0) {
                return this._map[path].view;
            } else {
                return this._map[path.substring(0, index)].view + '?' + path.substring(index + 1);
            }
        },
        _getContainer: function (path) {
            /*if(path.indexOf('-')<0) {
        return this._map[''].container;
      }
      else {
        return this._map[path.substring(0, path.lastIndexOf('-')).replace('-','/')].container;
      }*/
            if (path.indexOf('/') < 0) {
                return this._map[''].container;
            } else {
                var index = path.indexOf('?');
                if (index < 0) {
                    return this._map[path.substring(0, path.lastIndexOf('/'))].container;
                } else {
                    path = path.substring(0, index);
                    return this._map[path.substring(0, path.lastIndexOf('/'))].container;
                }
            }

        },
        start: function (default_url) {
            default_url ? this._defaultUrl = default_url : this._defaultUrl = router._map[''].defaultPage;
            if (!this._defaultUrl) {
                alert('未设置起始页');
                return false;
            }
            $(window).on('hashchange', function () {
                var hash = router.getHash(),
                    map = router._map[hash.path],
                    prev = router._hash;
                if (!router.compareHash(prev, hash)) {
                    router._hash = hash;
                    if (map) {
                        if (!router._currentView || (router._currentView[router._currentView.length - 1] != hash.value)) {
                            router._switchPage(hash);
                        }
                    } else {
                        var paths = hash.path.split('/');
                        if (paths[1]) {
                            if (router._map[paths[0]].defaultPage) {
                                window.location.hash = '#' + paths[0] + '/' + router._map[paths[0]].defaultPage + '?' + hash.params;
                            } else {
                                window.location.hash = '#' + paths[0] + '?' + hash.params;
                            }

                        } else {
                            console.log('页面不存在');
                        }

                    }
                } else {
                    console.log('hash no change', router._hash, hash);
                }

            }); //.trigger('hashchange');
            // 页面首次加载执行
            //if(this._map[this.getHash().split('?')[0]]) {
            if (this._map[this.getHash().path]) {
                $(window).trigger('hashchange');
            } else {
                // 跳转到默认页
                this.matchPath(this.getHash().path);
            }
        },
        _hash: null,
        ignoreParmas: ['open', 'off', 'copen', 'topen', 'vopen',
            'l_time', 'l_startTime', 'l_endTime', 'l_task', 'l_state', 'l_def', 'l_resulte',
            'l_type', 'l_stype', 'l_stxt', 'l_treatmethod', 'l_xavType', 'l_limit', 'l_offset',
            'l_order', 'l_sort', 'l_act', 'l_role', 'l_rfwType', 'l_view', 'l_name', 'l_ip', 'l_mac',
            'o_online', 'o_stype', 'o_stxt', 'o_file', 'o_mail', 'o_sys', 'o_app', 'o_rfwurl',
            'o_ip', 'o_rfwtdi', 'o_rfwflux', 'o_rfwshare', 'o_spam', 'o_loc', 'o_timespam'
        ],
        compareHash: function (prev, curr) {
            if (!prev) {
                return false;
            }
            var prev_params = this.str2jsonIgn(prev.params),
                curr_params = this.str2jsonIgn(curr.params),
                prev_length = this.getLen(prev_params),
                curr_length = this.getLen(curr_params);
            if (prev.path != curr.path) {
                return false;
            }
            if (prev_length != curr_length) {
                return false;
            } else {
                for (var key in curr_params) {
                    var idx = this.ignoreParmas.indexOf(key);
                    if (idx > -1) {
                        continue;
                    }
                    if (curr_params[key] != prev_params[key]) {
                        return false;
                    }
                }
            }
            return true;
        },
        getLen: function (obj) {
            var num = 0;
            for (var key in obj) {
                num++;
            }
            return num;
        },
        str2json: function (str) {
            if (str) {
                var obj = {},
                    arr = str.split('&');
                for (var i = 0; i < arr.length; i++) {
                    var ar = arr[i].split('=');
                    obj[ar[0]] = ar[1];
                }
                return obj;
            } else {
                return {};
            }

        },
        str2jsonIgn: function (str) {
            if (str) {
                var obj = {},
                    arr = str.split('&');
                for (var i = 0; i < arr.length; i++) {
                    var ar = arr[i].split('=');
                    if (this.ignoreParmas.indexOf(ar[0]) > -1) {
                        continue;
                    }
                    obj[ar[0]] = ar[1];
                }
                return obj;
            } else {
                return {};
            }
        },
        matchPath: function (path) {

            this.to(this._defaultUrl);
        },
        _defaultUrl: undefined,
        to: function (hash) {
            document.location.hash = hash;
        },
        getHash: function () {
            //var hash = document.location.hash.replace('#','');
            var hash = document.location.hash.substring(1),
                hashObj = {},
                index = hash.indexOf('?');
            if (index > 0) {
                hashObj.path = hash.substring(0, index);
                hashObj.params = hash.substring(index + 1);
                hashObj.value = hash;
            } else if (index < 0) {
                hashObj.path = hash;
                hashObj.value = hash;
            }
            if (!hashObj.path) {
                hashObj.path = hashObj.value = this._defaultUrl;
            }
            //console.log('hashObj:');
            //console.log(hashObj);
            return hashObj;
        }
    };
    return router;
});