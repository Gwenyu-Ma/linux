<?php

class SysController extends MyController
{
    public function initAction()
    {
        parent::init();
    }
    //编辑标题
    public function sysEditAction()
    {
        $websiteName = isset($_POST['websiteName'])? $_POST['websiteName']:'';
        if(empty($websiteName)){
            Common::out(Common::returnAjaxMsg(1, 0, "网站名称不能是空。", ""));
        }
        $model = new SysModel();
        if ($model->SysEdit(trim($websiteName), $this->_eid)){
            Common::out(Common::returnAjaxMsg(0, 0, "设置成功。", $websiteName));
        }
            Common::out(Common::returnAjaxMsg(1, 0, "保存失败。", ""));
    }

    //获取标题
    public function getSysAction()
    {
        $model = new SysModel();
        $data = $model->GetSys($this->_eid);
        if ($data) {
            Common::out(Common::returnAjaxMsg(0, 0, "", $data));
        } else {
            Common::out(Common::returnAjaxMsg(0, 0, "", ""));
        }
    }

    //获取标题
    public function getSysTitleAction()
    {
        $model = new SysModel();
        $data = $model->GetSys($this->_eid);
        if (count($data) > 0) {
            Common::out(Common::returnAjaxMsg(0, 0, "", $data));
        } else {
            Common::out(Common::returnAjaxMsg(0, 0, "", ""));
        }
    }

    public function getOSStatisticsAction()
    {
        $model = new SysModel();

        $data = $model->getOSStatistics($this->_eid);

        $this->ok($data);
    }

    public function getEpOnlineStatisticsAction()
    {
        $model = new SysModel();
        $data = $model->getEpOnlineStatistics($this->_eid);

        $this->ok($data);
    }
}
