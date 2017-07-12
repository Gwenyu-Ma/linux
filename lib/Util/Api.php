<?php
namespace Lib\Util;

use Tx\Http;

class Api
{
    public $key = DL_API_KEY;
    public $baseURL = "";
    public $expire = 24*60*60;

    public function __construct(){
    }

    public function verify(array $args)
    {
        if(empty($args['sign']) || empty($args['time'])){
            return false;
        }
        ksort($args);
        $s = '';
        foreach($args as $k=>$v){
            if($k !== 'sign'){
                $s .= "$k=$v&";
            }
        }
        $s .= $this->key;
        if(md5($s) !== $args['sign']){
            return false;
        }
        if(time() - $args['time'] > $this->expire){
            return false;
        }
        return true;
    }

    public function args(array $args)
    {
        $args['time'] = time();
        ksort($args);
        $s = '';
        foreach($args as $k=>$v){
            $s .= "$k=$v&";
        }
        $s .= $this->key;
        $args['sign'] = md5($s);
        return $args;
    }

    // array || string(error)
    public function get($url, $args)
    {
        return Http::get($this->baseURL . $url, [], $this->args($args));
    }

    public function getLan($url, $args)
    {
        $urls = require(__DIR__ . '/../../config/urls.php');
        $this->baseURL = $urls['dl_lan'];
        return Http::get($this->baseURL . $url, [], $this->args($args));
    }

    public function post($url, $args)
    {
        return Http::post($this->baseURL . $url, [], $this->args($args));
    }

}

