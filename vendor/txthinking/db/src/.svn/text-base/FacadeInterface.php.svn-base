<?php namespace Tx;

interface FacadeInterface{
    // conf return config like this:
    /*
    array (
        'write' => array (
            array (
                'host' => '9.9.9.9',
                'port' => '3306',
                'username' => 'root',
                'password' => '111111',
                'dbname' => 'test',
            ),
        ),
        'read' => array (
            array (
                'host' => '9.9.9.9',
                'port' => '3306',
                'username' => 'root',
                'password' => '111111',
                'dbname' => 'test',
            ),
        ),
    )
    //*/

    public static function conf();
    public static function __callStatic($name, array $args);
}
