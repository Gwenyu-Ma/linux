<?php

class MessageController extends MyController
{
    public $msg;
    public function init()
    {
        parent::init();
        $this->msg = new MessageModel();
    }


    public function getmsgAction()
    {
        $suber = sprintf("b:%s:admins:%s", $this->_eid, $this->_uid);
        $result = $this->msg->getMsg($suber, $this->param('type', ''), $this->param('search', ''), $this->param('lastid', ''), $this->param('count', 10));
    
        if (!is_array($result)) {
            $this->notice($result, 1);
            return;
        }
        if ($result['error']) {
            $this->notice($result['error'], 2);
            return;
        }
        $this->ok($result['result']);
    }

    public function readmsgAction()
    {
        //$this->param('subscriber', '')
        $result = $this->msg->readMsg($this->param('did', ''));
        if (!is_array($result)) {
            $this->notice($result, 1);
            return;
        }
        if ($result['error']) {
            $this->notice($result['error'], 1);
            return;
        }
        $this->ok($result['result']);
    }
    public function delmsgAction()
    {
        //$this->param('subscriber', '')
        $did = $this->param('did','');
        $n = count(explode(':', $did));
        $result = $this->msg->delMsg($did);
        if (!is_array($result)) {
            $this->notice($result, 1);
            add_oplog('删除','9002','删除我的消息',$n,null,1,  '删除'.$n.'条我的消息失败');
            return;
        }
        if ($result['error']) {
            $this->notice($result['error'], 1);
            add_oplog('删除','9002','删除我的消息',$n,null,1, '删除'.$n.'条我的消息失败');
            return;
        }
        add_oplog('删除','9002','删除我的消息',$n,null,0, '删除'.$n.'条我的消息成功');
        $this->ok($result['result']);
    }
    public function makemsgAction()
    {
        $types = $this->param('types', '');

        $result = $this->msg->makeMsg($types, $this->param('context'), $this->param('title', ''));
        // var_dump($result);
        if ($result['error']) {
            $this->notice($result['error'], 1);
            return;
        }
        $this->ok($result['result']);
    }

    public function addsubscriberAction()
    {
        $subscriber = $this->param('subscriber', '');
        $types = $this->param('types', '');
        $result = $this->msg->addSubscriber($subscriber, $types);
        //var_dump($result);
        if ($result['error']) {
            $this->notice($result['error'], 1);
            return;
        }
        $this->ok($result['result']);
    }

    public function delsubscriberAction()
    {
        $subscriber = $this->param('subscriber', '');
        $result = $this->msg->delSubscriber($subscriber);
        //var_dump($result);
        if ($result['error']) {
            $this->notice($result['error'], 1);
            return;
        }
        $this->ok($result['result']);
    }

    public function addsubscriberobjAction()
    {
        $subscriber = $this->param('subscriber', '');
        $result = $this->msg->addSubscriberObj($subscriber);
        //var_dump($result);
        if ($result['error']) {
            $this->notice($result['error'], 1);
            return;
        }
        $this->ok($result['result']);
    }

    public function delsubscriberobjAction()
    {
        $subscriber = $this->param('subscriber', '');
        $result = $this->msg->delSubscriberObj($subscriber);
        //var_dump($result);
        if ($result['error']) {
            $this->notice($result['error'], 1);
            return;
        }
        $this->ok($result['result']);
    }

    public function getsubscriberobjsAction()
    {
        $subscriber = $this->param('subscriber', '');
        $result = $this->msg->getSubscriberObjs($subscriber);
        //var_dump($result);
        if ($result['error']) {
            $this->notice($result['error'], 1);
            return;
        }
        $this->ok($result['result']);
    }

    public function testMsgAction()
    {
        $types = [];
        //----------
        echo '制作消息<br/>';

        $_REQUEST = [

            'types' => json_encode(['key1:key2', 'key3:key4']),
            'context' => 'hello test1',
            'title' => 'title1',
        ];
        $this->makemsgAction();

        echo "time: $count <br/>";
        //----------
        echo '添加订阅者<br />';
        $_REQUEST = [];
        $_REQUEST = [
            'subscriber' => 'user2',
            'types' => json_encode(['key3:key4', 'key1']),
        ];
        $this->addsubscriberAction();
        echo '<br/>';
        //----------
        echo '删除订阅者 <br />';
        $_REQUEST = [];
        $_REQUEST = [
            'subscriber' => 'user2',
        ];
        //$this->delsubscriberAction();
        echo '<br/>';
        //-----------
        echo '添加订阅者对象<br />';
        $_REQUEST = [];
        $_REQUEST = [
            'subscriber' => 'user2',
        ];
        $this->addsubscriberobjAction();
        echo '<br/>';
        //----------
        echo '删除订阅者对象<br />';

        $_REQUEST = [];
        $_REQUEST = [
            'subscriber' => 'user2',
        ];
        // $this->delsubscriberobjAction();
        echo '<br/>';
        //---------
        echo '获取订阅者对象<br />';

        $_REQUEST = [];
        $_REQUEST = [
            'subscriber' => 'user2',
        ];
        $this->getsubscriberobjsAction();
        echo '<br/>';
    }
}
