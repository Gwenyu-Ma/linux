<?php
require __DIR__ . '/../../vendor/autoload.php';

use Respect\Validation\Validator as v;
use Tx\Response;
use DL\Model\Eid;
use DL\Model\Check;
use DL\Model\Queue;
use DL\Model\Task;
use Lib\Util\Api;
use DL\Model\Auth;

if(!Auth::check()){
    Response::error('未认证', 401);
}

$ok = v::keySet(
    v::key('eid', v::stringType())
)->validate($_GET);
if(!$ok){
    Response::error('参数错误');
}

$eid = $_GET['eid'];
$eids = new Eid();
$eids->add($eid);
Queue::push(Task::newEID($eid), true);
Response::ok();

