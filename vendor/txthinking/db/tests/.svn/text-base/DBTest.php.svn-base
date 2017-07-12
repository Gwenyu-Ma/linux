<?php
// create table fuck(id int(10) auto_increment, name varchar(100), primary key(id));

use \Tx\DB as ADB;
class DBTest extends TestCase{

    // curd
    public function testC(){
        $fuck = DB::dispense('fuck');
        $fuck->name = 'Learn to Program';
        $id = DB::store( $fuck );
        $this->assertTrue((bool)($id)===true);
    }
    public function testUR(){
         $fuck = DB::load( 'fuck', 1 );
         $fuck->name = 'Learn to fly';
         DB::store( $fuck );
    }
    public function testD(){
         $fuck = DB::load( 'fuck', 1 );
         DB::trash( $fuck );
         //DB::wipe( 'fuck' );
    }

    // query
    public function testInsert(){
        $r = DB::exec('insert into fuck values(null, "fuck" )');
        $id = DB::getInsertID();
        $this->assertTrue((bool)$r===true);
        $this->assertTrue((bool)$id===true);
    }
    public function testGetAll(){
        $r = DB::getAll('select * from fuck');
        $this->assertTrue((bool)$r===true);
    }
    public function testGetRow(){
        $r = DB::getRow('select * from fuck limit 1');
        $this->assertTrue((bool)$r===true);
    }
    public function testGetCol(){
        $r = DB::getCol('select name from fuck');
        $this->assertTrue((bool)($r)===true);
    }
    public function testGetCell(){
        $r = DB::getCell('select name from fuck limit 1');
        $this->assertTrue((bool)($r)===true);
    }
    public function testUpdate(){
        $r = DB::exec('UPDATE fuck SET name="'.time().'" WHERE id=2');
        $this->assertTrue((bool)($r)===true);
    }
    public function testGetAssoc(){
        $r = DB::getAssoc('select id,name from fuck limit 4');
        $this->assertTrue((bool)($r)===true);
    }

    // transaction
    public function testTransaction(){
        $fuck = DB::dispense('fuck');
        $fuck->name = 'Learn to Program';
        $id = DB::store( $fuck );

        DB::begin();
        try{
            $fuck = DB::load( 'fuck', $id );
            $fuck->name = 'miss';
            DB::store( $fuck );

            throw new Exception('');

            DB::commit();
        }catch(Exception $e){
            DB::rollback();
        }
    }
}

class DB extends ADB{
    public static function conf(){
        return array (
            'write' => array (
                array (
                    'host' => '192.168.59.103',
                    'port' => '3306',
                    'username' => 'root',
                    'password' => '111111',
                    'dbname' => 'test',
                ),
            ),
            'read' => array (
                array (
                    'host' => '192.168.59.103',
                    'port' => '3306',
                    'username' => 'root',
                    'password' => '111111',
                    'dbname' => 'test',
                ),
            ),
        );
    }
}
