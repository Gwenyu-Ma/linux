$(function () {
    /*浏览器特性判断*/
    var supports = (function () {
        var div = document.createElement('div'),
            vendors = 'Khtml Ms O Moz Webkit'.split(' '),
            len = vendors.length;

        return function (prop) {
            if (prop in div.style)
                return true;

            prop = prop.replace(/^[a-z]/, function (val) {
                return val.toUpperCase();
            });

            while (len--) {
                if (vendors[len] + prop in div.style) {
                    // browser supports box-shadow. Do what you need. Or use a bang (!) to test if
                    // the browser doesn't.
                    return true;
                }
            }
            return false;
        };
    })();

    /*动画类*/
    /*页面局部动画*/
    var page_animate = {
        currentCon: 'content1',
        activeStatus: {},
        content1: {
            list1: function () {
                var time = 400;
                $('.content1 .list1 li').each(function () {
                    $(this).animate({
                        'margin-left': 0
                    }, time, 'linear');
                    time += 50;
                });
                $('.content1 .list1 .pic').animate({
                    'right': 0
                }, 500, 'linear');
            },
            list2: function () {
                $('.content1 .list2 .txt').animate({
                    'left': 0
                }, 800, 'linear');
            },
            list3: function () {
                $('.content1 .list3 .txt').animate({
                    'right': 0
                }, 400, 'linear');

                $('.content1 .list3 .pic').animate({
                    'margin-left': '82px'
                }, 600, 'linear', function () {
                    $('.content1 .list3 .pic span').addClass('active');
                });
            },
            list4: function () {
                $('.content1 .list4 .txt').animate({
                    'left': 0
                }, 400, 'linear');

                $('.content1 .list4 .pic').animate({
                    'right': 0
                }, 600, 'linear', function () {
                    $('.content1 .list4 .pic .pic01')
                        .css({
                            'visibility': 'visible'
                        })
                        .find('img')
                        .animate({
                            'width': '100%',
                            'height': '100%'
                        }, 600);
                });
            }
        },
        content2: {
            list1: function () {
                var time = 600;
                $('.content2 .list1 li').each(function () {
                    $(this).animate({
                        'margin-top': 0
                    }, time, 'linear');
                    time += 50;
                });
                $('.content2 .list1 .pic').animate({
                    'right': 0
                }, 500, 'linear');
            },
            list2: function () {
                $('.content2 .list2 .txt').animate({
                    'left': '0'
                }, 800, 'linear');
                $('.content2 .list2 .pic').animate({
                    'right': 0
                }, 500, 'linear');
            },
            list3: function () {
                $('.content2 .list3 .txt').animate({
                    'right': 0
                }, 400, 'linear');
                $('.content2 .list3 .pic').animate({
                    'left': 0
                }, 500, 'linear');
            },
            list4: function () {
                $('.content2 .list4 .txt').animate({
                    'left': 0
                }, 400, 'linear');
                $('.content2 .list4 .pic').animate({
                    'right': 0
                }, 500, 'linear');
            },
            list5: function () {
                $('.content2 .list5 .txt').animate({
                    'right': 0
                }, 400, 'linear');
                $('.content2 .list5 .pic').animate({
                    'left': 0
                }, 500, 'linear');
            }
        }
    };

    var ieMov = {
        tick: [
            10,
            10,
            10,
            10,
            10,
            10,
            10,
            5,
            10,
            10,
            10
        ],
        span1: function () {
            var target = $('.animat1');
            var me = this;
            me.tick[0]--;
            target.animate({
                'top': '140px',
                'left': '340px'
            }, 200, function () {
                target
                    .animate({
                        'top': '150px',
                        'left': '350px'
                    }, 500, function () {
                        target
                            .animate({
                                'top': '146px',
                                'left': '346px'
                            }, 200, function () {
                                if (me.tick[0] > 0) {
                                    me.span1();
                                }
                            });
                    });
            });
        },
        span2: function () {
            var target = $('.animat2');
            var me = this;
            me.tick[1]--;
            target.animate({
                'top': '230px',
                'left': '25px'
            }, 400, function () {
                target
                    .animate({
                        'top': '220px',
                        'left': '0px'
                    }, 400, function () {
                        if (me.tick[1] > 0) {
                            me.span2();
                        }
                    });
            });
        },
        span3: function () {
            var target = $('.animat3');
            var me = this;
            me.tick[2]--;
            target.animate({
                'top': '377px',
                'left': '378px'
            }, 600, function () {
                target
                    .animate({
                        'top': '392px',
                        'left': '400px'
                    }, 600, function () {
                        if (me.tick[2] > 0) {
                            me.span3();
                        }
                    });
            });
        },
        span4: function () {
            var target = $('.animat4');
            var me = this;
            me.tick[3]--;
            target.animate({
                'top': '25px',
                'left': '294px'
            }, 400, function () {
                target
                    .animate({
                        'top': '85px',
                        'left': '274px'
                    }, 500, function () {
                        if (me.tick[3] > 0) {
                            me.span4();
                        }
                    });
            });
        },
        span5: function () {
            var target = $('.animat5');
            var me = this;
            me.tick[4]--;
            target.animate({
                'top': '386px',
                'left': '0px'
            }, 400, function () {
                target
                    .animate({
                        'top': '356px',
                        'left': '25px'
                    }, 400, function () {
                        if (me.tick[4] > 0) {
                            me.span5();
                        }
                    });
            });
        },
        span6: function () {
            var target = $('.animat6');
            var me = this;
            me.tick[5]--;
            target.animate({
                'top': '190px',
                'left': '40px'
            }, 800, function () {
                target
                    .animate({
                        'top': '196px',
                        'left': '47px'
                    }, 800, function () {
                        if (me.tick[5] > 0) {
                            me.span6();
                        }
                    });
            });
        },
        span7: function () {
            var target = $('.animat7');
            var me = this;
            me.tick[6]--;
            target.animate({
                'top': '468px',
                'left': '304px'
            }, 200, function () {
                target
                    .animate({
                        'top': '448px',
                        'left': '299px'
                    }, 200, function () {
                        if (me.tick[6] > 0) {
                            me.span7();
                        }
                    });
            });
        },
        span8: function () {
            var target = $('.animat8');
            var me = this;
            me.tick[7]--;
            target.animate({
                'top': '151px',
                'left': '353px'
            }, 1000, function () {
                target
                    .animate({
                        'top': '111px',
                        'left': '393px'
                    }, 1000, function () {
                        if (me.tick[7] > 0) {
                            me.span8();
                        }
                    });
            });
        },
        span9: function () {
            var target = $('.animat9');
            var me = this;
            me.tick[8]--;
            target.animate({
                'top': '450px',
                'left': '120px'
            }, 150, function () {
                target
                    .animate({
                        'top': '470px',
                        'left': '115px'
                    }, 150, function () {
                        if (me.tick[8] > 0) {
                            me.span9();
                        }
                    });
            });
        },
        span10: function () {
            var target = $('.animat10');
            var me = this;
            me.tick[9]--;
            target.animate({
                'top': '243px',
                'left': '400px'
            }, 300, function () {
                target
                    .animate({
                        'top': '238px',
                        'left': '430px'
                    }, 400, function () {
                        if (me.tick[9] > 0) {
                            me.span10();
                        }
                    });
            });
        },
        span11: function () {
            var target = $('.animat11');
            var me = this;
            me.tick[10]--;
            target.animate({
                'top': '125px',
                'left': '73px'
            }, 500, function () {
                target
                    .animate({
                        'top': '110px',
                        'left': '68px'
                    }, 600, function () {
                        if (me.tick[10] > 0) {
                            me.span11();
                        }
                    });
            });
        }
    };
    if (!supports('animation')) {
        for (var act in ieMov) {
            if (act.indexOf('span') >= 0) {
                ieMov[act]();
            }
        }

    }
    //ieMov.span1();
    /*windwo.scroll调用页面动画*/
    var headerH = $('.header').height();
    $(window).on('scroll', function () {
        wSroll();
    });

    function wSroll() {
        var h = $(window).scrollTop() + $(window).height() - 600;
        var idx = Math.floor(((h + 200) / 600));
        if (idx > 0) {
            (page_animate[page_animate.currentCon]['list' + idx]) && (page_animate[page_animate.currentCon]['list' + idx])();
        }
    }(function initPageAnima() {
        var h = $(window).scrollTop() + $(window).height() - 600;
        var idx = Math.floor(((h + 300) / 600));
        for (var i = 0; i < idx; i++) {
            (page_animate[page_animate.currentCon]['list' + i]) && (page_animate[page_animate.currentCon]['list' + i])();
        }
    })();

    $('.header_txt').addClass('active');
    setTimeout(function () {
        $('.header_reg_btn')
            .animate({
                'margin-top': '78px'
            }, 800, 'easeOutQuint', function () {
                $('.header_down').show();
                header_down_animate();
            });
    }, 1000);

    $('.header_down').on('click', function () {
        $('body,html').animate({
            'scrollTop': '730px'
        }, 500, 'easeOutQuart');
    });
    var header_down_frame = 21,
        header_down_time = 100,
        header_down_width = 36,
        start_fram = 0;

    function header_down_animate() {
        if (start_fram < header_down_frame) {
            var left = start_fram * header_down_width
            $('.header_down').css('background-position', -left + 'px 0');
            start_fram++;
            setTimeout(header_down_animate, header_down_time);
        } else {
            start_fram = 0;
            setTimeout(header_down_animate, 1000);
        }

    }

    $('.header_nav li')
        .on('click', function () {
            var self = $(this);
            var idx = self.index();
            var num = idx + 1;
            $('.bg:eq(' + idx + ')')
                .addClass('active')
                .siblings()
                .removeClass('active');
            page_animate.currentCon = idx == 0 ?
                'content1' :
                'content2';
            if (idx == 0) {
                $('.header_reg_btn').attr('href', '/register.html');
                $('.js_slogan1').show();
                $('.js_slogan2').hide();
            } else {
                $('.header_reg_btn').attr('href', '/register.html#family');
                $('.js_slogan2').show();
                $('.js_slogan1').hide();
            }
            self
                .addClass('active')
                .siblings()
                .removeClass('active');
            $('.content' + num).show();
            $('.content' + (3 - num)).hide();
            $(window).trigger('scroll');
            return false;
        });

    /*goTop*/
    (function () {
        var $topHtml = $('<a href="#" class="goTop">&nbsp;</a>');
        $('body').append($topHtml);
        $(window).on('scroll', function () {
            if ($(window).scrollTop() > 200) {
                $topHtml.show();
            } else {
                $topHtml.hide();
            }
        });
        $topHtml.on('click', function () {
            $('body,html').animate({
                'scrollTop': 0
            }, 1000, 'easeOutQuart');
            return false;
        });
    })();

    var _supperCanvas = document
        .createElement('canvas')
        .getContext ?
        true :
        false;
    if (!_supperCanvas) {
        return false;
    }

    function createScript(src) {
        var _script = $('<script>');
        _script.attr('src', src);
        $('body').append(_script);
    }

    for (var i = 0; i < srcArrs.length; i++) {
        createScript(srcArrs[i]);
    }

});