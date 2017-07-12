<?php
use \Tx\Http;
class HttpTest extends TestCase{
    public function testGet(){
        $r = Http::get('http://httpbin.org/get?id=1');
        $this->assertTrue(is_array($r));
    }

    public function testPost(){
        $r = Http::post('http://httpbin.org/post', [], array('id'=>1));
        $this->assertTrue(is_array($r));
    }
}

