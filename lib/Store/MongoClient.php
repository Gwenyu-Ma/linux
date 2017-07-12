<?php
//
// list methods: https://secure.php.net/manual/zh/class.mongoclient.php
//
namespace Lib\Store;

use MongoClient as Client;

class MongoClient
{
    protected static $instance;
    protected static $restrict = array('dropDB');

    private function __construct(){}

    protected static function _init()
    {
        if(self::$instance !== null){
            return;
        }
        $config = require(__DIR__.'/../../config/mongo.php');
        self::$instance = new Client('mongodb://'. implode(',',$config));
    }

    public static function __callStatic($name, array $args)
    {
        self::_init();
        if(in_array($name, self::$restrict)){
            throw new \Exception(__CLASS__ . ': Restricting Method');
        }
        if($name === 'selectDB'){
            return self::getDBInstance($args);
        }
        if($name === 'selectCollection'){
            return self::getCollectionInstance($args);
        }
        return call_user_func_array([self::$instance, $name], $args);
    }

    public static function getInstance(){
        self::_init();
        return self::$instance;
    }

    protected static function getDBInstance($args)
    {
        $db = call_user_func_array([self::$instance, 'selectDB'], $args);
        return new MongoDB($db);
    }

    protected static function getCollectionInstance($args)
    {
        $collection = call_user_func_array([self::$instance, 'selectCollection'], $args);
        return new MongoCollection($collection);
    }

}


