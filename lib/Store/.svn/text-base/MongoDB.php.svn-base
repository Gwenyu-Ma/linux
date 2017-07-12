<?php
// list methods: https://secure.php.net/manual/zh/class.mongodb.php
namespace Lib\Store;

use \MongoDB as DB;

class MongoDB
{
    protected $instance;
    protected $restrict = array('drop', 'dropColletion');

    public function __construct(DB $db)
    {
        $this->instance = $db;
    }

    public function __call($name, array $args)
    {
        if(in_array($name, $this->restrict)){
            throw \Exception(__CLASS__ . ': Restricting Method');
        }
        if($name === 'selectCollection'){
            return $this->getCollectionInstance($args);
        }
        if($name === 'createCollection'){
            return $this->createCollectionAndReturnInstance($args);
        }
        return call_user_func_array([$this->instance, $name], $args);
    }

    protected function getCollectionInstance($args)
    {
        $collection = call_user_func_array([$this->instance, 'selectCollection'], $args);
        return new MongoCollection($collection);
    }

    protected function createCollectionAndReturnInstance($args)
    {
        $collection = call_user_func_array([$this->instance, 'createCollection'], $args);
        return new MongoCollection($collection);
    }

}



