<?php
require __DIR__ . '/../../vendor/autoload.php';

$cert = __DIR__ . '/../ca.pfx';

exec("osslsigncode sign -pkcs12 $cert -pass rising -in -out ", $outputs, $result);

#var_dump($outputs, $result);

