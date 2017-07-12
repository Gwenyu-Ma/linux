<?php

//Linux消息队列类
class RsMQ {

    private $mqkey = 0x10111;
    private $mq;
    public $msgmaxsize = 655200;

    //private $querysize = 0;
    //private $querymaxsize = 524160000;
    //连接或并创建消息队列
    function __construct($inMqkey = 0x10111, $inPerms = 0666) {
        $this->mqkey = $inMqkey;
        $this->mq = msg_get_queue($this->mqkey, $inPerms);
    }

    function __destruct() {
        
    }

    //边接或并创建消息队列
    public function link($inMqkey = 0x10111, $inPerms = 0666) {
        $this->mqkey = $inMqkey;
        $this->mq = msg_get_queue($this->mqkey, $inPerms);
    }

    //删除消息队列
    public function remove() {
        if (msg_queue_exists($this->mqkey) == true) {
            return msg_remove_queue($this->mq);
        }
        else
            return true;
    }

    //录入消息队列
    public function push($inMessage) {
        if (strlen($inMessage) > ($this->msgmaxsize - 16))
            return false;
        //else $this->querysize += strlen($inMessage);
        return msg_send($this->mq, 1, $inMessage);
    }

    //读取消息队列
    public function pop(&$outMessage) {
        $tmpvalue = msg_receive($this->mq, 0, $messageType, $this->msgmaxsize, $outMessage, true, MSG_IPC_NOWAIT);
        //if($tmpvalue == true) $this->querysize -= strlen($outMessage);
        return $tmpvalue;
    }

    //读取队列状态
    public function status() {
        return msg_stat_queue($this->mq);
    }
}