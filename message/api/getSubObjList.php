<?php
require __DIR__ . '/../../vendor/autoload.php';


use Message\Model\MsgManager;
use Tx\Response;
$pageIndex=$_POST['pageIndex'];
$pageSize=$_POST['pageSize'];
$ok = MsgManager::getSubscriberObjs($_POST['eid'],$_POST['scriber'],$pageIndex,$pageSize);

//ok ? Response::ok($ok) : Response::error('生成消息错误');
Response::ok($ok);
