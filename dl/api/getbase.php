<?php
require __DIR__ . '/../../vendor/autoload.php';

use Tx\Response;
use DL\Model\Auth;
use DL\Model\Base;

if(!Auth::check()){
    Response::error('未认证', 401);
}

Response::ok((new Base())->getAll());