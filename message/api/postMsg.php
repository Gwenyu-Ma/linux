<?php
require __DIR__ . '/../../vendor/autoload.php';

use Lib\Util\Api;
use Message\Model\MessageManager;
use Respect\Validation\Validator as v;
use Tx\Response;

$ok = v::keySet(
    v::key('time', v::stringType()), // time是API必传参数
    v::key('sign', v::stringType()), // sign是API必传参数
    v::key('user', v::stringType()->notEmpty()),
    v::key('types', v::stringType()->notEmpty()),
    v::key('context', v::stringType()->notEmpty()),
    v::key('title', v::stringType()),
    v::key('file', v::stringType())
)->validate($_POST);
if (!$ok) {
    Response::error('参数错误');
}

if (!(new Api())->verify($_POST)) {
    Response::error('签名错误或请求过期');
}
$ok = MessageManager::produceMessage([
    'producer' => $_POST['user'],
    'types' => json_decode($_POST['types']),
    'title' => $_POST['title'],
    'file' => $_POST['file'],
    'context' => $_POST['context'],
]);
$ok ? Response::ok('成功') : Response::error('生成消息错误');
