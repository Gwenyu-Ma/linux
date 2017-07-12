<?php
require __DIR__ . '/../../vendor/autoload.php';

use Respect\Validation\Validator as v;
use Tx\Response;
use Upload\File;
use Upload\Storage\FileSystem;
use DL\Model\Base;
use DL\Model\Queue;
use DL\Model\Auth;
use DL\Model\Task;

if(!Auth::check()){
    Response::error('未认证', 401);
}
function get_extension($file)
{
    return pathinfo($file, PATHINFO_EXTENSION);
}

$ok = v::keySet(
    v::key('platform', v::in(['android', 'linux', 'windows']))
)->validate($_POST);
if(!$ok){
    Response::error('平台参数错误');
}
$platform = $_POST['platform'];

$file = new File('base', new FileSystem(__DIR__ . "/../file/$platform/base"));
$name = $file->getNameWithExtension();
$exptend =  get_extension($name);

if( $platform === 'windows'){
    if( $exptend !== 'exe'){
        Response::error('windows包必须是exe可执行文件');
    }
}else if( $platform === 'android'){
    if( $exptend !== 'apk'){
        Response::error('android包必须是apk安装包');
    }
}

$base = new Base();
if($name === $base->get($platform)){
    Response::error('此包和当前包重复');
}

$file->addValidations(array(
    new \Upload\Validation\Size('100M'),
));
try {
    $path = __DIR__ . "/../file/$platform/base/" . $name;
    if(is_file($path)){
        unlink($path);
    }
    $file->upload();
} catch (\Exception $e) {
    Response::error($e->getMessage());
}

$base->set($platform, $name);
Queue::push(Task::newPackage($platform, $name));
Response::ok();
$array =debug_backtrace();
