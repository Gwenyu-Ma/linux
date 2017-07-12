<?php
switch(get_cfg_var('env')){
case 'develop':
    return [
        '127.0.0.1:27017',
    ];
case 'testing':
    return [
        '193.168.10.101:50000',
        '193.168.10.102:50000',
        '193.168.10.103:50000',
    ];
case 'production':
    return [
        '127.0.0.1:27017',
    ];
}

