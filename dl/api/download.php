<?php
require __DIR__ . '/../../vendor/autoload.php';

use Respect\Validation\Validator as v;
use Tx\Response;
use DL\Model\Eid;
use DL\Model\Base;
use DL\Model\Queue;
use DL\Model\Task;
use DL\Model\Path;
use Lib\Util\Api;

$ok = v::keySet(
    v::key('time', v::stringType()),
    v::key('sign', v::stringType()),
    v::key('eid', v::stringType()),
    v::key('platform', v::in(['android', 'linux', 'windows']))
)->validate($_GET);
if(!$ok){
    Response::error('参数错误');
}

if(!(new Api())->verify($_GET)){
    Response::error('签名错误或请求过期');
}

$platform = $_GET['platform'];
$eid = empty($_GET['eid']) ? "" : $_GET['eid'];

$base = (new Base())->getBase($platform);
if($base){
    $base['link'] = Path::baseLink($platform, $base['name']);
}
if(!$eid){
    Response::ok(array(
        'base' => $base,
    ));
}
$eids = new Eid();
$dist = $eids->getDist($eid, $platform);
if($dist){
    $dist['link'] = Path::distLink($platform, $eid, $dist['name']);
}else{
    Queue::push(Task::newPackage($platform, null, $eid), true);
    Response::error('包正在生成, 请稍候再试');
}
Response::ok(array(
    'base' => $base,
    'dist' => $dist,
));

