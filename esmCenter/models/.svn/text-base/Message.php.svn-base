<?php

use Lib\Util\Api;

class MessageModel
{
    public $api;
    //public $st;
    public function __construct()
    {
        //$this->st = select_manage_collection('setting');
        $this->api = new Api();
        $this->api->baseURL = $this->getURL();
        if(!$this->api->baseURL){
            throw new \Exception('未配置Message平台地址');
        }
    }

    public function setURL($url)
    {
    }

    public function getURL()
    {
        $urls = require(__DIR__ . '/../../config/urls.php');
        return $urls['message'];
    }

    public function getMsg($subscriber, $type, $search, $lastid, $count)
    {
        $args['subscriber'] = $subscriber;
        $args['type'] = $type;
        $args['search'] = $search;
        $args['lastid'] = $lastid;
        $args['count'] = $count;
        
        return $this->api->get('/api/getMsg.php', $args);
    }

    public function readMsg($did)
    {
        $args['did'] = $did;
        return $this->api->get('/api/readMsg.php', $args);
    }

    public function delMsg($did)
    {
        $args['did'] = $did;
        return $this->api->get('/api/delMsg.php', $args);
    }

    public function makeMsg($types, $context, $title)
    {
        $args['types'] = $types;
        $args['context'] = $context;
        $args['title'] = $title;
        // $args['file'] = $file;
        return $this->api->post('/api/makeMsg.php', $args);
    }

    public function addSubscriber($subscriber, $types)
    {
        $args['subscriber'] = $subscriber;
        $args['types'] = $types;
        return $this->api->post('/api/addSubscriber.php', $args);
    }

    public function delSubscriber($subscriber)
    {
        $args['subscriber'] = $subscriber;
        return $this->api->post('/api/delSubscriber.php', $args);
    }

    public function addSubscriberObj($subscriber)
    {
        $args['subscriber'] = $subscriber;
        return $this->api->post('/api/addSubscriberObj.php', $args);
    }

    public function delSubscriberObj($subscriber)
    {
        $args['subscriber'] = $subscriber;

        return $this->api->post('/api/delSubscriberObj.php', $args);
    }

    public function getSubscriberObjs($subscriber)
    {
        $args['subscriber'] = $subscriber;

        return $this->api->post('/api/getSubscriberObjs.php', $args);
    }
}
