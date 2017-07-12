<?php
require __DIR__ . '/../../vendor/autoload.php';

use Respect\Validation\Validator as v;
use Tx\Response; // 返回结构参照了 http://json-rpc.org/wiki/specification 的error和result
use Lib\Util\Api;
use Message\Model\Distrib;

// 检查参数
$ok = v::keySet(
    v::key('time', v::stringType()), // time是API必传参数
    v::key('sign', v::stringType()), // sign是API必传参数

    v::key('subscriber', v::stringType()), // 接口定义参数
    v::key('type', v::stringType()), // 接口定义参数
    v::key('search', v::stringType()), // 接口定义参数
    v::key('lastid', v::stringType()), // 接口定义参数
    v::key('count', v::intVal()) // 接口定义参数
)->validate($_GET); // 如果结构是POST传参数, 则传入 $_POST
if(!$ok){
    Response::error('参数错误'); // Response方法内有exit, 如果后期不想exit可以自己包一层
}

// 检查安全
if(!(new Api())->verify($_GET)){ // 如果结构是POST传参数, 则传入 $_POST
    Response::error('签名错误或请求过期');
}

if($_GET['lastid'] === ''){
    $lid = null;
}else{
    try{
        $lid = new \MongoId($_GET['lastid']);
    }catch(\Exception $e){
        Response::error($e->getMessage());
    }
}

$data = (new Distrib())->getmsg($_GET['subscriber'], $_GET['type'], $_GET['search'], $lid, $_GET['count']);
Response::ok($data);