<?php
require __DIR__ . '/../../vendor/autoload.php';


use Message\Model\MsgManager;
use Tx\Response;
$ok = MsgManager::getSubscriberObjs($_POST['scriber']);
//ok ? Response::ok($ok) : Response::error('生成消息错误');
Response::ok($ok);
