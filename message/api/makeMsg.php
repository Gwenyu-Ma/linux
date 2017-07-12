<?php
require __DIR__ . '/../../vendor/autoload.php';

use Lib\Util\Api;
use Message\Model\MsgManager;
use Respect\Validation\Validator as v;
use Tx\Response;
//use \Lib\Util\Log;

//Log::add("InsertMongo333330",array('timeSpan'=>time()));
$ok = v::keySet(
    v::key('time', v::stringType()), // time是API必传参数
    v::key('sign', v::stringType()), // sign是API必传参数
    v::key('types', v::stringType()->notEmpty()),
    v::key('context', v::stringType()->notEmpty()),
    v::key('title', v::stringType())
    // v::key('file', v::stringType())
)->validate($_POST);
if (!$ok) {
    Response::error('参数错误');
}

if (!(new Api())->verify($_POST)) {
    Response::error('签名错误或请求过期');
}
$ok = MsgManager::makeMsg([
    'types' => json_decode($_POST['types']),
    'context' => $_POST['context'],
    'title' => $_POST['title'],
]);
$ok ? Response::ok('成功') : Response::error('生成消息错误');
