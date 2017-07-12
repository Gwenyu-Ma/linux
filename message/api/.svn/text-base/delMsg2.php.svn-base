<?php
require __DIR__ . '/../../vendor/autoload.php';

use Respect\Validation\Validator as v;
use Tx\Response; // 返回结构参照了 http://json-rpc.org/wiki/specification 的error和result
use Lib\Util\Api;
use Message\Model\Distrib;

$ids = [];
foreach(explode(':', @$_GET['did']) as $id){
    try{
        $ids[] = new \MongoId($id);
    }catch(\Exception $e){
        Response::error($e->getMessage());
    }
}

$data = (new Distrib())->delmsg($ids);
Response::ok($data);

