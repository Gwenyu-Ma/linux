<?php namespace Tx;
//
// * select a db randomly
// * high available
// * if slace db all have down then read from master
// * seperate read and write
//
// Example:
// DB::getAll('select * from bd_baodian');
// DB::getRow('select * from bd_baodian limit 1');
// DB::getCol('select name from bd_baodian');
// DB::getCell('select name from bd_baodian limit 1');
// DB::exec('UPDATE page SET title="test" WHERE id=1');
//
// Author: cloud@txthinking.com
//

use \RedBeanPHP\R;

abstract class DB implements FacadeInterface{
    private static $_mcs;
    private static $_scs;
    private static $_inited = false;
    private static $_writeConnected = false;
    private static $_readConnected = false;
    private static $_last;

    private function __construct(){}

    public static function clean()
    {
        self::$_inited = false;
    }

    protected static function init() {
        if(self::$_inited){
            return;
        }
        $c = static::conf();
        shuffle($c['write']);
        shuffle($c['read']);
        self::$_mcs = $c['write'];
        self::$_scs = array_merge($c['read'], $c['write']);

        //R::setup();
        foreach(self::$_mcs as $i=>$c){
            R::addDatabase("write:$i", sprintf('mysql:host=%s;port=%d;dbname=%s', $c['host'], $c['port'], $c['dbname']), $c['username'], $c['password']);
        }
        foreach(self::$_scs as $i=>$c){
            R::addDatabase("read:$i", sprintf('mysql:host=%s;port=%d;dbname=%s', $c['host'], $c['port'], $c['dbname']), $c['username'], $c['password']);
        }
        self::$_inited = true;
    }

    // $a=read/write
    protected static function select($a){
        self::init();
        if($a === 'write'){
            if(self::$_writeConnected && self::$_last==='write'){
                return;
            }
            foreach(self::$_mcs as $i=>$c){
                R::selectDatabase("write:$i");
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
                R::selectDatabase("read:$i");
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
