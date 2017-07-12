<?php
require __DIR__ . '/../../vendor/autoload.php';

use Message\Model\MsgManager;
use Tx\Response;

$ids = $_POST['ids'];

if(empty($ids)){ 
    Response::error('没有选择订阅者对象');
}
$ids=array_unique($ids);
$ids=array_filter($ids,function($item){
    return strcasecmp($item,'')!=0;
});
if(empty($ids)){
    Response::error('没有选择订阅者对象');
}
MsgManager::delSubObjById($ids)? Response::ok("成功"):Response::error("删除失败");