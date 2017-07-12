<?php
namespace Lib\Store;
use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;
use Rabbitmq as RMQ;

class Rabbitmq 
{
     protected static $instance;

     private function __construct(){}

     protected static function _init(){
        if(self::$instance !== null){
            return ;
        }
        $config = require(__DIR__.'/../../config/rabbitmq.php');
        self::$instance = new AMQPStreamConnection($config['HOST'], $config['PORT'], $config['USER'], $config['PASS'], $config['VHOST']); 
        
    }

     public static function __callStatic($name, array $args){
        self::_init();
        return call_user_func_array([self::$instance, $name], $args);
    }

     public static function getInstance(){
        self::_init();
        return self::$instance;
    }

}