<?php
class AuthhomeController extends MyController
{
    public function init()
    {
        parent::init();
    }

    //判断是否有子产品还剩不到一个月到期的(单个授权文件的判断)
    protected  function isAccreditOverdueAction(){
        $nextMonth = date("Y-m-d",strtotime("+1 month"));
        $objModel = new AuthHomeModel();
        $bOverdue = $objModel->overDue();//是否有到期的子产品
        if($bOverdue){//有过期的子产品
            return 2;
        }
        $bIS = $objModel->isAccreditOverdue( $nextMonth );
        if( $bIS ){
            return 1; //有一个月内到期的子产品
        }
        return 0;//没有
    }

    //判断过期(多个授权文件的判断)
    protected  function isMoreOverdueAction(){
        $objModel = new AuthHomeModel();
        $bIS = $objModel->noOverdue();
        if( $bIS ){
            return 0; //有一个月内到期的子产品
        }
        return 2;//没有
    }

    protected  function getAgentNumAction(){
        $objModel = new AuthHomeModel();
        return $objModel->getAgentCount();
    }

    //获取总共多少台授权终端 = windows最大授权数 + linux授权总数
    public function getAccreditInfoAction(){
        $totalAccredit = 0;
        $objModel = new AuthHomeModel();
        $aRes['windowsTotalNum'] = intval($objModel->getWindowsSysMaxNum());
        $aRes['linuxTotalNum'] = intval($objModel->getLinuxSum());
        return $aRes;
    }

    //各系统获取授权数：windows，linux分别授权数,未授权数
    public function getAccreditNumAction(){
        $objModel = new AuthHomeModel();
        return  $objModel->getAccreditNum();
        
    }

    public function getTodayNumAction(){
        $aRes = $this->getAccreditNumAction();
        $this->ok( $aRes );
    }

 //首页统计数字
    public function indexAction(){
        $accreditNum = array();
        $accreditNum = $this->getAccreditNumAction();
        $totalNum = $this->getAccreditInfoAction();
        $agentNum = $this->getAgentNumAction();
    
        if($agentNum >1){
            $accreditNum['isOverdue'] = $this->isMoreOverdueAction();
        }else{
            $accreditNum['isOverdue'] = $this->isAccreditOverdueAction();
        }
        $accreditNum['windowsTotalNum'] = $totalNum['windowsTotalNum'];
        $accreditNum['linuxTotalNum'] = $totalNum['linuxTotalNum'];
        $this->ok( $accreditNum );
     }
     
    //最近7天授权数
    public function historySevenDayAction(){
        $objModel = new AuthHomeModel();
        $aRes = $objModel->getHistorySevenDay();
        $hAccredit['rows'] = $aRes;
        $hAccredit['total'] = count( $aRes );
        $this->ok($hAccredit);
    }

    //最新5条授权终端信息
    public function newAccreditAction(){

        $objModel = new AuthHomeModel();
        $aEP = $objModel->todayAccredit(true);
        $aRes['rows'] = $aEP;
        $this->ok($aRes);
    }

    //当天所有授权终端信息
    public function getTodayAccreditAction(){
        $params = array();
        $in = json_decode(file_get_contents('php://input'));
        $params['limit'] = $in->paging->limit;
        $params['offset'] = $in->paging->offset;
        $params['order'] = $in->paging->order;
        $params['sort'] = $in->paging->sort;
        $params['ip'] = $in->queryconditions->IP;
        $params['mac'] = $in->queryconditions->mac;
        $params['isAccredit'] = $in->queryconditions->isAccredit;

        $objModel = new AuthHomeModel();
        $aEP = $objModel->todayAccredit(false,$params);
        $aRes['rows'] = $aEP;
        $aRes['total'] = count($aEP);
        $this->ok($aRes);
    }

    //退出
    public function loginOutAction(){
        $_SESSION['UserInfo']=null;
        session_destroy();
        header('Location: /');
    }

}