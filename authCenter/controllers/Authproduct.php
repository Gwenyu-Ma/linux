<?php
/**
 * Created by PhpStorm.
 * User: xujy
 * Date: 2017/3/22
 * Time: 10:28
 */
class AuthproductController extends MyController
{
    public function init()
    {
        parent::init();
    }

    //子产品授权信息
    public function getProductAccreditAction(){
        $in = json_decode(file_get_contents('php://input'));
        $params['limit'] = $in->paging->limit;
        $params['offset'] = $in->paging->offset;
        $params['order'] = $in->paging->order;
        $params['sort'] = $in->paging->sort;
        $objModel = new AuthProductModel();
        $aRes = $objModel->productAccredit( $params );
        foreach( $aRes as $key => $val){
            $guid = $val['proGuid'];
            $aRes[$key]['currentLinkNum'] = $objModel->getProCurrentLinksNum($guid);
        }
        $aProduct['rows'] = $aRes;
        $aProduct['total'] = count( $aRes );
        $this->ok($aProduct);
    }


    //历史授权终端列表
    public function historyAccreditAction(){
        $params = array();
        $in = json_decode(file_get_contents('php://input'));
        $params['limit'] = $in->paging->limit;
        $params['offset'] = $in->paging->offset;
        $params['order'] = $in->paging->order;
        $params['sort'] = $in->paging->sort;
        $params['startDate'] = $in->queryconditions->startDate;
        $params['endDate'] = $in->queryconditions->endDate;

        $objModel = new AuthProductModel();
        $aEP = $objModel->historyAccredit( $params );
        $aRes['rows'] = $aEP['row'];
        $aRes['total'] = $aEP['total'];
        $this->ok($aRes);
    }

    //子产品详情
    public function productDetailAction(){
        $nextMonth = date("Y-m-d",strtotime("+1 month"));
        $objModel = new AuthProductModel();
        $aRes = $objModel->getProductDetail();
        foreach( $aRes as $key => $val){
            if($val['endTime'] < $nextMonth){
                $aRes[$key]['isOverdue'] = 1;
            }else{
                $aRes[$key]['isOverdue'] = 0;
            }
        }
        $this->ok($aRes);
    }


}