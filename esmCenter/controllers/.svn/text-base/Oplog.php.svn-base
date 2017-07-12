<?php
use ChromePhp as Console;
class OplogController extends MyController
{
    public function init()
    {
        parent::init();
        Yaf_Dispatcher::getInstance()->disableView();
    }

    public function makeParams()
    {
        $args = [];
        $in = json_decode(file_get_contents('php://input'));
        if($in->objtype == 1){
            $args['groupid'] = $in->objid;
        }
        if(!empty($in->paging->sort)){
            $args['orderby'] = $in->paging->sort;
        }
        if(!empty($in->paging->order)){
            $args['sort'] = 'desc';
        }else{
            $args['sort'] = 'asc';
        }
        if(!empty($in->paging->offset)){
            $args['offset'] = $in->paging->offset;
        }
        if(!empty($in->paging->limit)){
            $args['limit'] = $in->paging->limit;
        }
        foreach($in->queryconditions as $k=>$v){
            if($v === ''){
                continue;
            }
            if($k=='begintime'){
                $args['stime'] = $v;
            }elseif($k=='endtime'){
                $args['etime'] = $v;
            }elseif($k=='searchtype'){
                if(!empty($in->queryconditions->searchkey)){
                    $args[$v] = $in->queryconditions->searchkey;
                }
            }elseif($k=='searchkey'){
            }else{
                $args[$k] = $v;
            }
        }
        //Console::log($args);
        //$args = array(
            //'cmdid' => '1',
        //);
        return $args;
    }

    public function partAction()
    {
        $pm = $this->makeParams();
        unset($pm['groupid']);
        $data = (new OplogModel())->part($this->_eid, $pm);
        if(is_string($data)){
            $this->alert($data);
            return;
        }
        $this->ok($data);
    }

    public function delAction()
    {
        $ids = $this->param('ids');
        $r = (new OplogModel())->del($this->_eid, $ids);
        $this->ok($r);
    }

    public function cleanAction()
    {
        $r = (new OplogModel())->clean($this->_eid);
        $this->ok($r);
    }
}
