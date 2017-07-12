<?php

class EpController extends MyController
{
    public function init()
    {
        parent::init();
        Yaf_Dispatcher::getInstance()->disableView();
        $this->ep = new EpModel();
    }

    public function getepAction()
    {
        $sguid = $this->param('sguid', '');
        $row = $this->ep->getEP($this->_eid, $sguid);
        if (!$row) {
            $this->notice('没有此终端信息');
            return;
        }
        $this->ok($row);
        return;
    }

    public function setmemoAction()
    {
        $sguid = $this->param('sguid', '');
        $sguid = explode(':', $sguid);
        $memo = $this->param('memo', '');
        $oObj = $this->params('oObj', ['cName' => '', 'oldMemo' => '']);
        $ok = $this->ep->setMemo($this->_eid, $sguid, $memo,$oObj);
        if (!$ok) {
            $this->notice('操作失败',1);
            return;
        }
        $this->ok(null);
    }

    public function removeepAction()
    {
        $sguids = $this->param('sguids', []);
        (new EpModel())->removeEP($this->_eid, $sguids);
        $this->ok(null, '成功');
    }

    public function testremoveepAction()
    {
        $_REQUEST = ['sguids' => ['3C2072C53F14ABADCF80823A2C893BF9']];
        $this->removeepAction();
    }

    /**
     * 客户端版本统计
     * @return void
     */
    public function getEPVersionStatisticsAction()
    {
        $this->ok((new EpModel())->getEPVersionStatistics($this->_eid));
    }
}

