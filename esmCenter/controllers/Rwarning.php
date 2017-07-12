<?php
class RwarningController extends MyController
{
    public function init()
    {
        parent::init();
        Yaf_Dispatcher::getInstance()->disableView();
    }

    public function getWarningAction()
    {
        $in = json_decode(file_get_contents('php://input'),true);
        $objId='';
        $objType='';
        $paging=$in['paging'];
        $query=$in['queryconditions'];

        $ok=RWarningModel::getWarning($this->_eid,$objId,$objType,$paging,$query);

        $this->ok($ok);
    }

    public function delWarningAction()
    {
        $ids=$this->param('ids',[]);
        if(empty($ids)){
            $this->notice('请选择要删除的预警记录');
            return;
        }
        RWarningModel::delWarning($this->_eid,$ids);
        $this->ok(null);
    }

    public function testgetWarningAction()
    {
        $param = [
            'objid' => '',
            'objtype' => '',
            'paging' => [
                'limit' => 20,
                'offset' => 0,
                'order' => 1,
                'sort'=>edate
            ],
            'queryconditions' => [
                'begintime' => '',
                'endtime' => '',
                'wsclass' => []
            ]
        ];
        $_REQUEST=$param;
        $this->getWarningAction();
    }

    public function testdelWarningAction()
    {
        $_REQUEST=['ids'=>[1]];
        $this->delWarningAction();
    }

    public function addAction()
    {
        $r = (new RWarningModel())->add($this->_eid, $this->params());
        $this->ok($r);
    }

    public function updateAction()
    {
        $r = (new RWarningModel())->update($this->_eid, $this->params());
        $this->ok($r);
    }

    public function delAction()
    {
        $ids = $this->param('wsids');
        $r = (new RWarningModel())->del($this->_eid, $ids);
        $this->ok($r);
    }

    public function partAction()
    {
        $data = (new RWarningModel())->part($this->_eid, $this->makeParams());
        if(is_string($data)){
            $this->alert($data);
            return;
        }
        $this->ok($data);
    }

    public function makeParams()
    {
        $args = [];
        $in = json_decode(file_get_contents('php://input'));
        $args['view'] = $in->viewtype;
        // if($in->objtype == 1){
        //     $args['groupid'] = $in->objid;
        // }
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

}
