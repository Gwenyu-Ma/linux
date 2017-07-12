<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * rc4加密算法
 *
 * @author guolei
 */
/*
 * rc4加密算法
 * $pwd 密钥
 * $data 要加密的数据
 */
class rc4
{
    //private $headkey = $headkey;
    /*
     * rc4加密算法经过base64编码
     * $pwd 密钥
     * $data 要加密的数据
     */
    public function encrypt($data,$pwd='12345678'){
        return base64_encode($this->ex($data,$pwd));
    }
    
    /*
     * rc4解密算法经过base64编码
     * $pwd 密钥
     * $data 要加密的数据
     */
    public function decrypt($data,$pwd='12345678'){
        return $this->ex(base64_decode($data),$pwd);
    }
    
    /*
     * rc4加密算法
     * $pwd 密钥
     * $data 要加密的数据
     */
    public function ex($data,$pwd='12345678'){
        $key[] ="";
        $box[] ="";
        $cipher="";

        $pwd_length = strlen($pwd);
        $data_length = strlen($data);

        for ($i = 0; $i < 256; $i++)
        {
            $key[$i] = ord($pwd[$i % $pwd_length]);
            $box[$i] = $i;
        }

        for ($j = $i = 0; $i < 256; $i++)
        {
            $j = ($j + $box[$i] + $key[$i]) % 256;
            $tmp = $box[$i];
            $box[$i] = $box[$j];
            $box[$j] = $tmp;
        }

        for ($a = $j = $i = 0; $i < $data_length; $i++)
        {
            $a = ($a + 1) % 256;
            $j = ($j + $box[$a]) % 256;

            $tmp = $box[$a];
            $box[$a] = $box[$j];
            $box[$j] = $tmp;

            $k = $box[(($box[$a] + $box[$j]) % 256)];
            $cipher .= chr(ord($data[$i]) ^ $k);
        }

        return $cipher;
    }
}
