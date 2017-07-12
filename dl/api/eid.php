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

$ok = v::keySet(
    v::key('time', v::stringType()),
    v::key('sign', v::stringType()),
    v::key('eid', v::stringType()),
    v::key('op', v::in(['add', 'delete']))
)->validate($_GET);
if(!$ok){
    Response::error('参数错误');
}

if(!(new Api())->verify($_GET)){
    Response::error('签名错误或请求过期');
}

$op = $_GET['op'];
$eid = $_GET['eid'];
$eids = new Eid();
if($op === 'add'){
    $eids->add($eid);
    Queue::push(Task::newEID($eid), true);
}
if($op === 'delete'){
    $eids->del($eid);
}
Response::ok();