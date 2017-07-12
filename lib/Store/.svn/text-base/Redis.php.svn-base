<?php
namespace Lib\Store;

// list methods: https://github.com/phpredis/phpredis

use Redis as Rds;

class Redis
{
    protected static $instance;

    private function __construct(){}

    protected static function _init()
    {
        if(self::$instance !== null){
            return;
        }
        $config = require(__DIR__.'/../../config/redis.php');
        self::$instance = new Rds();
        self::$instance->connect($config['host'], $config['port']);
        self::$instance->setOption(Rds::OPT_SERIALIZER, Rds::SERIALIZER_NONE);
    }

    public static function __callStatic($name, array $args)
    {
        self::_init();
        return call_user_func_array([self::$instance, $name], $args);
    }

    public static function getInstance()
    {
        self::_init();
        return self::$instance;
    }

}

