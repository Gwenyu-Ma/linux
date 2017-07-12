<?php
require __DIR__ . '/../../vendor/autoload.php';

use Message\Model\MsgManager;
use Tx\Response;

$eid=$_POST['eid'];
$scriber=$_POST['scriber'];
$type=$_POST['type'];
$pageIndex=$_POST['pageIndex'];
$pageSize=$_POST['pageSize'];
$data = MsgManager::getSubscriberList($eid,$scriber,$type,$pageIndex,$pageSize);
Response::ok($data);