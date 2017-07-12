<?php namespace Tx;

abstract class Crypt implements FacadeInterface{
    protected static $provider;

    private function __construct(){}

    protected static function init(){
        if(self::$provider !== null){
            return;
        }
        self::$provider = new CryptProvider(static::conf());
    }

    public static function __callStatic($name, array $args){
        self::init();
        return call_user_func_array([self::$provider->getInstance(), $name], $args);
    }
}


