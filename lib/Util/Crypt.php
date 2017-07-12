<?php
namespace Lib\Util;

use \Tx\Crypt as TxCrypt;

class Crypt extends TxCrypt
{
    public static function conf(){
        return [
            'key' => 'rscdefghijhlmnopqrsduvqxyzaaaaaa',
            'cipher' => 'AES-256-CBC',
        ];
    }
}

