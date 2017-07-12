<?php

namespace DL\Model;

use Lib\Util\Crypt;

class Auth 
{
    public static function check()
    {
        try {
            $username = Crypt::decrypt(@$_COOKIE['token']);
        } catch (\Exception $e){
            return false;
        }
        return true;
    }

}

