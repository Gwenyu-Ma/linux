<?php
require __DIR__ . '/../../vendor/autoload.php';

use Tx\Response; // 返回结构参照了 http://json-rpc.org/wiki/specification 的error和result
use Message\Model\Distrib;
use ChromePhp as Console;

if(!@$_GET['lastid']){
    $lid = null;
}else{
    try{
        $lid = new \MongoId($_GET['lastid']);
    }catch(\Exception $e){
        Response::error($e->getMessage());
    }
}

if(!@$_GET['subscribers']){
    Response::error('empty');
}else{
    $subers = preg_split('/\s+/', trim($_GET['subscribers']));
}

Console::log($subers);

$data = (new Distrib())->getmsg($subers, null, null, $lid, $_GET['count']);
Response::ok($data);

