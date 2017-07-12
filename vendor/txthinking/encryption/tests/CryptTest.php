<?php
use \Tx\CryptProvider;
use \Tx\Crypt as TxCrypt;

class CryptTest extends TestCase{
    public function testCrypt(){
        $crypt = (new CryptProvider([
            'key' => 'abcdefghijhlmnopqrsduvqxyzaaaaaa',
            'cipher' => 'AES-256-CBC',
        ]))->getInstance();
        $r = $crypt->encrypt('who am i');
        var_dump($crypt->decrypt($r));
    }

    public function testFacade(){
        $r = Crypt::encrypt(['aa'=>'bb']);
        var_dump(Crypt::decrypt($r));
    }

}

class Crypt extends TxCrypt{
    public static function conf(){
        return [
            'key' => 'abcdefghijhlmnopqrsduvqxyzaaaaaa',
            'cipher' => 'AES-256-CBC',
        ];
    }
}

