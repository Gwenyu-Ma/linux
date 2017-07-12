<?php
require __DIR__ . '/../../vendor/autoload.php';

use Message\Model\MsgManager;
use Tx\Response;

$eid=$_POST['eid'];
$type=$_POST['type'];
$title=$_POST['title'];
$pageIndex=$_POST['pageIndex'];
$pageSize=$_POST['pageSize'];
$data = MsgManager::getMsgList($eid,$type,$title,$pageIndex,$pageSize);
Response::ok($data);