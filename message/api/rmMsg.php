<?php
require __DIR__ . '/../../vendor/autoload.php';

use Message\Model\MsgManager;
use Tx\Response;

$ids = $_POST['ids'];

if(empty($ids)){ 
    Response::error('没有选择消息');
}
$ids=array_unique($ids);
$ids=array_filter($ids,function($item){
    return strcasecmp($item,'')!=0;
});
if(empty($ids)){
    Response::error('没有选择消息');
}
MsgManager::delMsg($ids)? Response::ok("成功"):Response::error("删除失败");