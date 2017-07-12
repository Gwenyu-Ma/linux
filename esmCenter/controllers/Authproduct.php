<?php
class AuthproductController extends MyController
{
    public function init()
    {
        parent::init();
    }

    //产品授权信息
    public function getProductAccreditAction(){
        $eid = $this->_eid ;
        $in = json_decode(file_get_contents('php://input'));
        $params['limit'] = $in->paging->limit;
        $params['offset'] = $in->paging->offset;
        $params['order'] = $in->paging->order;
        $params['sort'] = $in->paging->sort;
        $objModel = new AuthProductModel();
        $level = $this->_level;
        if($level == 2){//单用户模式
           $aRes = $objModel->showAccredit( $params ); 
        }else{
            $aRes = $objModel->productAccredit( $eid,$params );
            
        }
        foreach( $aRes as $key => $val){
            $aRes[$key]['currentLinkNum'] = $objModel->getProCurrentLinksNum( $eid,$val['productGuid'] );
        }
        
        $aProduct['rows'] = $aRes;
        $aProduct['total'] = count( $aRes );
        $this->ok($aProduct);
    }


    //产品详情
    public function productDetailAction(){
        $eid = $this->_eid ;
        $nextMonth = date("Y-m-d",strtotime("+1 month"));
        $objModel = new AuthProductModel();
        $level = $this->_level;
        if($level == 2){//单用户模式
            $aRes = $objModel->showProductDetail();
        }else{
            $aRes = $objModel->getProductDetail( $eid );
        }
        foreach( $aRes as $key => $val){
            if($val['endTime'] < $nextMonth){
                $aRes[$key]['isOverdue'] = 1;
            }else{
                $aRes[$key]['isOverdue'] = 0;
            }
        }
        $this->ok($aRes);
    }

    //历史授权终端列表
    public function historyAccreditAction(){
        $eid = $this->_eid;
        $params = array();
        $in = json_decode(file_get_contents('php://input'));
        $params['limit'] = $in->paging->limit;
        $params['offset'] = $in->paging->offset;
        $params['order'] = $in->paging->order;
        $params['sort'] = $in->paging->sort;
        $params['startDate'] = $in->queryconditions->startDate;
        $params['endDate'] = $in->queryconditions->endDate;
        $objModel = new AuthProductModel();
        $aEP = $objModel->historyAccredit( $eid,$params );
        
        $aRes['rows'] = $aEP['row'];
        $aRes['total'] = $aEP['total'];
        $this->ok($aRes);
    }

    //当天所有授权终端信息
    public function getTodayAccreditAction(){
        $eid = $this->_eid;
        $params = array();
        $in = json_decode(file_get_contents('php://input'));
        $params['limit'] = $in->paging->limit;
        $params['offset'] = $in->paging->offset;
        $params['order'] = $in->paging->order;
        $params['sort'] = $in->paging->sort;
        $params['ip'] = $in->queryconditions->IP;
        $params['mac'] = $in->queryconditions->mac;
        $params['isAccredit'] = $in->queryconditions->isAccredit;

        $objModel = new AuthProductModel();
        $aEP = $objModel->todayAccredit($eid,$params);
        
        $aRes['rows'] = $aEP;
        $aRes['total'] = count($aEP);
        $this->ok($aRes);
    }


}