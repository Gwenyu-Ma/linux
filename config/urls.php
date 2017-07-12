<?php
require __DIR__ . '/../vendor/autoload.php';
use Lib\Store\Mysql;

$domain = Mysql::getCell('SELECT domainUrl FROM auth_base_info');
empty($domain )?$domain = require('domain.php'):$domain = $domain;

switch(get_cfg_var('env')){
case 'develop':
    return array(
        'exe' => 'http://192.168.20.90/rsv16/sohover.xml',
        'dl' => $domain.'/dl',
        'dl_lan'=>$domain.'/dl',
        'message' => $domain.'/message',
        'platform' => $domain,
        'sign' => $domain.'/sign',
    );
case 'testing':
    return array(
        'exe' => 'http://192.168.20.90/rsv16/sohover.xml',
        'dl' => $domain.'/dl',
        'dl_lan'=>$domain.'/dl',
        'message' => $domain.'/message',
        'platform' =>$domain ,
        'sign' => $domain.'/sign',
    );
case 'production':
    return array(
        'exe' => 'http://rsup16.rising.com.cn/rsv16/tsohover.xml',
        'dl' => $domain.'/dl',
        'dl_lan'=>$domain.'/dl',
        'message' => $domain.'/message',
        'platform' =>$domain ,
        'sign' => $domain.'/sign',
    );
}

