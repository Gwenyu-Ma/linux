<?php
require __DIR__ . '/../../vendor/autoload.php';

use Message\Model\Test;

$data = (new Test())->getData();
var_dump($data);

