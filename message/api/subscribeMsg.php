<?php
require __DIR__ . '/../../vendor/autoload.php';

use Lib\Util\Api;
use Message\Model\MsgManager as MsgManager;
use Respect\Validation\Validator as v;
use Tx\Response;

$ok = v::keySet(
    v::key('time', v::stringType()), // time是API必传参数
    v::key('sign', v::stringType()), // sign是API必传参数
    v::key('subUser', v::stringType()->notEmpty()),
    v::key('oldSubUser', v::stringType()),
    v::key('types', v::stringType()->notEmpty())
)->validate($_POST);
if (!$ok) {
    Response::error('参数错误');
}
if (!(new Api())->verify($_POST)) {
    Response::error('签名错误或请求过期');
}
$ok = MsgManager::subscribeMsg([
    'subscriber' => $_POST['subUser'],
    'oldSubUser' => $_POST['oldSubUser'],
    'types' => json_decode($_POST['types']),
]);
$ok ? Response::ok('成功') : Response::error('订阅消息错误');
