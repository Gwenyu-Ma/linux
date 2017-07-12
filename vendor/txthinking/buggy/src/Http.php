<?php namespace Tx;
/**
 * @file Http.php
 * @brief Quick , only method GET POST, data, for requrest json
 * @author cloud@txthinking.com
 * @version 0.0.1
 * @date 2015-03-30
 *
 * @example
 * use \Tx\Http;
 *
 * $r = Http::get('http://httpbin.org/get?id=1');
 * $r = Http::post('http://httpbin.org/post', [], array('id'=>'1'));
 *
 * success: $r is Array
 * failed:  $r is String
 *
 */
use Requests;

class Http{
    private function __construct(){}
    private static function request($method, $url, $headers = array(), $data = array(), $timeout=10){
        $r = Requests::request(
            $url,
            $headers,
            $data,
            strtoupper($method),
            array(
                'timeout' => $timeout,
            )
        );
        $result = json_decode($r->body, true);
        if(!$r->success || empty($result)){
            return $r->raw;
        }
        return $result;
    }

    public static function __callStatic($name, $args){
        array_unshift($args, $name);
        return call_user_func_array(array(__CLASS__, 'request'), $args);
    }
}

