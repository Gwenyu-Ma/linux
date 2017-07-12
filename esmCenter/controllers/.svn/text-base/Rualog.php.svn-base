<?php
class RualogController extends MyController
{
    private $input;
    public function init()
    {
        parent::init();
        $this->input = json_decode(file_get_contents('php://input'));
    }
    public function getRuaLogAction()
    {

        if (isset($this->input->objtype) && !in_array($this->input->objtype,[0,1,2])) {
            $this->notice('参数错误。', 1);
            return;
        }

        if (empty($this->input->objid)) {
            $this->notice('参数错误。', 1);
            return;
        }

        if (empty($this->input->paging)) {
            $this->notice('参数错误。', 1);
            return;
        }

        if (empty($this->input->queryconditions)) {
            $this->notice('参数错误。', 1);
            return;
        }

        if(empty($this->_eid)){
            $this->notice('登录过期。', 1);
            return;
        }
        $result=(new RuaLogModel($this->_eid))->getRuaLog($this->_eid,$this->input->objtype,$this->input->objid,$this->input->queryconditions,$this->input->paging);
        $this->ok($result);
    }
}

