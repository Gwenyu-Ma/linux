<?php
require __DIR__ . '/../../vendor/autoload.php';

use Lib\Util\Api;

$api = new Api();

$r = $api->get('http://192.168.20.171:8003/message/api/getMsg.php', array(
    'subscriber' => 'user2',
    'lastid' => '573d618d51dacd035e3961d6',
    'count' => 2,
));

if(!is_array($r)){
    echo "服务器死了: $r";
    exit;
}
if($r['error'] !== null){
    echo "API Error: " . $r['error'];
    exit;
}
var_dump($r['result']);

