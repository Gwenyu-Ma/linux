<?php
namespace Lib\Store;

// Example:
//
// use \Lib\Store\Mysql;
// Mysql::getAll('select SQL');
// Mysql::getRow('select SQL');
// Mysql::exec('insert sql OR update SQL');
//
// more help: https://github.com/txthinking/DB/blob/master/tests/DBTest.php

use Tx\DB;
use \RedBeanPHP\R;

class LogsMysql extends DB
{
    private static $_mcs;
    private static $_scs;
    private static $_inited = false;
    private static $_writeConnected = false;
    private static $_readConnected = false;
    private static $_last;
    const DB_KEY = 99;

    public static function conf()
    {
        return require(__DIR__ . '/../../config/logs_mysql.php');
         
    }

    public static function init(){
         if(self::$_inited){
            return;
        }
        
        $c = self::conf();
        
        self::$_mcs = $c['write'];
        self::$_scs = $c['read'];
        
        foreach(self::$_mcs as $i=>$c){
            R::addDatabase('write:'.self::DB_KEY, sprintf('mysql:host=%s;port=%d;dbname=%s', $c['host'], $c['port'], $c['dbname']), $c['username'], $c['password']);
        }
        foreach(self::$_scs as $i=>$c){
            R::addDatabase('read:'.self::DB_KEY, sprintf('mysql:host=%s;port=%d;dbname=%s', $c['host'], $c['port'], $c['dbname']), $c['username'], $c['password']);
        }
        self::$_inited = true;
    }

     protected static function select($a){
        self::init();
        if($a === 'write'){
            if(self::$_writeConnected && self::$_last==='write'){
                return;
            }
            foreach(self::$_mcs as $i=>$c){
                R::selectDatabase('write:'.self::DB_KEY);
                if(R::testConnection()){
                    R::freeze(true);
                    self::$_writeConnected = true;
                    self::$_last = 'write';
                    return;
                }
            }
            throw new \Exception('Master DB have down');
        }
        if($a === 'read'){
            if(self::$_readConnected && self::$_last==='read'){
                return;
            }
            foreach(self::$_scs as $i=>$c){
                R::selectDatabase('read:'.self::DB_KEY);
                if(R::testConnection()){
                    R::freeze(true);
                    self::$_readConnected = true;
                    self::$_last = 'read';
                    return;
                }
            }
            throw new \Exception('Slave and master DB have down');
        }
     }

     public static function __callStatic($name, array $args){
        if(in_array($name, array(
            'load',
            'loadAll',
            'findAll',
            'getAll',
            'getRow',
            'getCol',
            'getCell',
            'getAssoc',
            ))){
            self::select('read');
            return call_user_func_array("\\RedBeanPHP\\R::$name", $args);
        }
        self::select('write');
        return call_user_func_array("\\RedBeanPHP\\R::$name", $args);
    }
}