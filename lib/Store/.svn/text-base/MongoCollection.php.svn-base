<?php
// list methods : https://secure.php.net/manual/zh/class.mongocollection.php
namespace Lib\Store;

use \MongoCollection as Collection;

class MongoCollection
{
    protected $instance;
    protected $restrict = array('drop');

    public function __construct(Collection $clct)
    {
        $this->instance = $clct;
    }

    public function __call($name, array $args)
    {
        if(in_array($name, $this->restrict)){
            throw new \Exception(__CLASS__ . ': Restricting Method');
        }
        
        return call_user_func_array([$this->instance, $name], $args);
    }

}



