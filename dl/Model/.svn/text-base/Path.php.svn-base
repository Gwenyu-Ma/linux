<?php
namespace DL\Model;

class Path
{
    public static function base($platform, $base)
    {
        return realpath(__DIR__ . "/../file/$platform/base/" . $base);
    }

    public static function dist($platform, $eid, $dist)
    {
        $dir = realpath(__DIR__ . "/../file/$platform/dist/") . '/';
        $dir = $dir . base_convert(bin2hex($eid), 16, 10)%25 . '/';
        if(is_dir($dir)){
            return $dir . $dist;
        }
        mkdir($dir);
        return $dir . $dist;
    }

    public static function baseLink($platform, $base)
    {
        $urls = require(__DIR__ . '/../../config/urls.php');
        $webroot = realpath(__DIR__ . '/../') . '/';
        return str_replace($webroot, $urls['dl'].'/', self::base($platform, $base));
    }

    public static function distLink($platform, $eid, $dist)
    {
        $urls = require(__DIR__ . '/../../config/urls.php');
        $webroot = realpath(__DIR__ . '/../') . '/';
        return str_replace($webroot,  $urls['dl'].'/', self::dist($platform, $eid, $dist));
    }

}

