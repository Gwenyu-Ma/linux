<?php
require __DIR__ . '/../../vendor/autoload.php';

use Respect\Validation\Validator as v;
use Tx\Response;
use DL\Model\Eid;
use ChromePhp as Console;
use DL\Model\Auth;
use DL\Model\Path;

if(!Auth::check()){
    Response::error('未认证', 401);
}

$ok = v::keySet(
    v::key('page', v::intVal())
)->validate($_GET);
if(!$ok){
    Response::error('参数错误');
}

$page = $_GET['page'];
$count = 10;

$eids = new Eid();
$data = $eids->part(intval($page), $count);
if(!$data){
    Response::error('没有了');
}
foreach($data as &$v){
    if(!empty($v['android_name']))
    $v['android_link'] = Path::distLink('android', $v['eid'], $v['android_name']);
    if(!empty($v['linux_name']))
    $v['linux_link'] = Path::distLink('windows', $v['eid'], $v['linux_name']);
    if(!empty($v['windows_name']))
    $v['windows_link'] = Path::distLink('windows', $v['eid'], $v['windows_name']);
    $v['updated_at'] = date('Y-m-d H:i:s', $v['updated_at']);
}
Response::ok($data);

