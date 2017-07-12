<?php
require __DIR__ . '/../../vendor/autoload.php';

use Lib\Util\Api;
use Message\Model\MsgManager;
use Respect\Validation\Validator as v;
use Tx\Response;

$ok = v::keySet(
    v::key('time', v::stringType()), // time是API必传参数
    v::key('sign', v::stringType()), // sign是API必传参数
    v::key('subscriber', v::stringType()->notEmpty())
)->validate($_POST);
if (!$ok) {
    Response::error('参数错误');
}

if (!(new Api())->verify($_POST)) {
    Response::error('签名错误或请求过期');
}
$ok = MsgManager::delSubscriberObj($_POST['subscriber']);
$ok ? Response::ok('成功') : Response::error('删除订阅者对象失败');
