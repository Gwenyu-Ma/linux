<?php
use \Tx\Is;
class IsTest extends TestCase{
    public function testBankCard(){
        $r =  Is::bankCard(6228480031561499810);
        $this->assertTrue($r===true);
        $r =  Is::bankCard(6228480031561499811);
        $this->assertTrue($r===false);
    }

    public function testChineseID(){
        $r =  Is::chineseID("140622198609202912");
        $this->assertTrue($r===true);
        $r =  Is::chineseID("140622190609202912");
        $this->assertTrue($r===false);
    }

    public function testEmail(){
        $r =  Is::email("a@a.com");
        $this->assertTrue($r===true);
        $r =  Is::email("aa.com");
        $this->assertTrue($r===false);
    }

    public function testChineseWords(){
        $r =  Is::chineseWords("丑小鸭");
        $this->assertTrue($r===true);
        $r =  Is::chineseWords("hi");
        $this->assertTrue($r===false);
    }
}

