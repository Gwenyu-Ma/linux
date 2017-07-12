<?php
use ChromePhp as Console;
class CmdController extends MyController
{
    public function init()
    {
        parent::init();
        Yaf_Dispatcher::getInstance()->disableView();
    }
    public function editCmdAction()
    {
        $grouptype = $this->param('grouptype', '-1');
        $objIds = $this->param('objIds', []);
        $cmdid = $this->param('cmdid', '');
        $cmdData = $this->param('cmdData', '');
        $objects=$this->param('objects','');
        //$groupid = $this->param('groupid', '');
        $grouptype = intval($grouptype);
        if (!in_array($grouptype,[0, 1, 2]) || empty($cmdid) || !is_array($objIds)) {
            $this->notice('参数错误。', 1);
            return;
        }

        if ($grouptype != 0 && empty($objIds)) {
            $this->notice($grouptype == 1 ? '未选择任何组。' : '未选择客户端。', 1);
            return;
        }

        $param_data = array(
            'grouptype' => $grouptype,
            'objIds' => $objIds,
            'cmdid' => $cmdid,
            'cmdData' => $cmdData,
            'uid'=>$this->_uid,
            'userName'=>$this->_userName,
            'objects'=>$objects
        );
        $model = new CmdModel();
        $eid = $this->_eid;
        $result = $model->editCmd($param_data, $eid);
        if (is_bool($result) && $result) {
            $this->ok(null, '成功。');
            return;
        }
        $this->notice($result['msg'], 1);

    }

    public function makeParams()
    {
        $args = [];
        $in = json_decode(file_get_contents('php://input'));
        //$args['view'] = $in->viewtype;
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
        Console::log($args);
        //$args = array(
            //'cmdid' => '1',
        //);
        return $args;
    }

    public function partAction()
    {
        $data = (new CmdModel())->part($this->_eid, $this->makeParams());
        if(is_string($data)){
            $this->alert($data);
            return;
        }
        $this->ok($data);
    }

    public function expandAction()
    {
        $data = (new CmdModel())->expand($this->_eid, $this->makeParams());
        if(is_string($data)){
            $this->alert($data);
            return;
        }
        $this->ok($data);
    }
}
