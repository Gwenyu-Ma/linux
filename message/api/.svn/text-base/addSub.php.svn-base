<?php
require __DIR__ . '/../../vendor/autoload.php';

use Message\Model\MsgManager;
use Tx\Response;

$subser= $_POST['subscriber'];
if(empty($subser)){
    Response::error('订阅者不可为空');
}

$type = $_POST['type'];
if(empty($type)){ 
    Response::error('消息类型不能为空');
}
$types=explode("\n",$type);
$types=array_unique($types);
$types=array_filter($types,function($item){
    return strcasecmp($item,'')!=0;
});
if(empty($types)){
    Response::error('消息类型不能为空');
}

$ok = MsgManager::addSubscriber([
    'subscriber' =>$subser,
    'types' => array_values($types),
]);
$ok ? Response::ok('成功') : Response::error('添加订阅失败');