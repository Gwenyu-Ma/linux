<?php
class IndexModel{
    protected $rising;
    public function __construct()
    {
        $this->rising = select_manage_collection('rising');
    }

    public function insertMongo(){
        $content = array(
            'id' => time(),
            'groupname' => '全网计算机',
            'description' => '全网计算机',
            'edate' => time()
        );
        $result = $this->rising->insert($content);
        if ($result) {
            return true;
        } else {
            return false;
        }
    }

}