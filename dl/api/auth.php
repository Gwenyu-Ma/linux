<?php
require __DIR__ . '/../../vendor/autoload.php';

use Respect\Validation\Validator as v;
use Tx\Response;
use Lib\Util\Crypt;

$ok = v::keySet(
    v::key('username', v::equals('rising')),
    v::key('password', v::equals('rising'))
)->validate($_POST);
if(!$ok){
    Response::error('用户名或密码错误');
}

$token = Crypt::encrypt($_POST['username']);
setcookie('token', $token);
Response::ok();

