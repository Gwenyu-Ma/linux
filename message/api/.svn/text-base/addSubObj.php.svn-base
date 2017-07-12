<?php
require __DIR__ . '/../../vendor/autoload.php';

use Message\Model\MsgManager;
use Tx\Response;

$subser= $_POST['subscriber'];
if(empty($subser)){
    Response::error('订阅者不可为空');
}
$ok = MsgManager::addSubscriberObj($subser);
$ok ? Response::ok('成功') : Response::error('添加订阅者对象失败');