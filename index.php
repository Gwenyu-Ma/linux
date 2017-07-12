<?php
require(__DIR__ . '/vendor/autoload.php');
error_reporting(E_ERROR);
define("DS", '/');
define("APP_PATH", dirname(__FILE__).DS.'esmCenter'.DS);
$app = new Yaf_Application(APP_PATH."conf/application.ini");
Yaf_Dispatcher::getInstance()->catchException(true);
$app->bootstrap()->run();