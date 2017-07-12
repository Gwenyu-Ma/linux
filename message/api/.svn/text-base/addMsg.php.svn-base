<?php
require __DIR__ . '/../../vendor/autoload.php';

use Message\Model\MsgManager;
use Tx\Response;

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

$title = $_POST['title'];
if(empty($title)){
    Response::error('消息标题不可为空');
}
$context = $_POST['context'];
if(empty($context)){
    Response::error('消息内容不可为空');
}
$isRepeat = $_POST['isRepeat'];
$times = $_POST['times'];
$titleInc = $_POST['titleInc'];
$index = 1;
while ($index <= $times) {
    MsgManager::makeMsg([
        'types' =>array_values($types),
        'context' => $context,
        'title' => $titleInc ? $title . $index : $title,
    ]);
    $index = $isRepeat ? ++$index : $tiems;
}
Response::ok("成功");
