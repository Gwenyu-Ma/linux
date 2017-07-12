<?php
use \Lib\Util\Common;
use \Lib\Util\logs;
use Lib\Util\rc4;
use \Lib\Store\Redis;

class AuthmanagerController extends MyController
{
    public function init()
    {
        parent::init();
    }
    public function testauthListAction(){
        $this->authListAction();
    }

    //给新添加企业显示授权子产品列表
    public function authListAction(){
        $obj = new AuthManagerModel();
        $aRes = $obj->getAuthList();
        foreach( $aRes as $key => $val){
            $aRes[$key]['usedAmount'] = $obj->getProductAmount($val['productGuid']);
        }
        $this->ok($aRes);
    }

    public function testwriteAuthAction(){
        $aParams = [
            [
               'EID' => 'B5665B1332892456',
               'productGuid' => 'D49170C0-B076-4795-B079-0F97560485AF',
               'starttime' =>'2017-04-28 00:10:20',
               'endtime' =>'2017-07-28 00:10:20',
               'accreditCount' => 2
            ],
            [
               'EID' => 'B5665B1332892456',
               'productGuid' => 'F1A05321-8959-48C7-8182-04A8DB6EEBF0',
               'starttime' =>'2017-04-28 00:10:20',
               'endtime' =>'2017-07-28 00:10:20',
               'accreditCount' => 1
            ]
        ];
        $_REQUEST = [
            'strJson' => json_encode($aParams,true)
        ];

        print_r($_REQUEST);
        exit();

        $this->writeAuthAction();
    }

    //给新企业分配授权
    public function writeAuthAction(){
        $currentTime = date('Y-m-d H:i:s');
        $EID = '';
        $strJson = $this->param('strJson',null);
        $aParams = json_decode( $strJson );
        $obj = new AuthManagerModel();
        $rc4 = new rc4();

        foreach( $aParams as $val ){
            $days = Common::timeToDay($val->starttime,$val->endtime);
            $amount =($days+1) * $val->accreditCount;
            $jsonValue = array(
                'startTime' => $val->starttime,
                'endTime' => $val->endtime,
                'authAmount' => $amount,
                'accreditCount' => $val->accreditCount
            );
            $strJson = $rc4->encrypt( json_encode($jsonValue) );
            $EID = $val->EID;
            $authParams = array(
                'EID' => $val->EID,
                'productGuid'=> $val->productGuid,
                'jsonValue' => $strJson,
                'startTime' => $val->starttime,
                'endTime' => $val->endtime,
                'accreditCount' =>$val->accreditCount,
                'createTime' => $currentTime
            );

            $strAuth = Redis::HGET(REDIS_AUTH_PRODUCT.UNDERLINE.$val->EID,$val->productGuid);
            if($strAuth){
                $objAuth = json_decode( $strAuth );
                if(($currentTime > $val->starttime) && ($currentTime < $val->endtime)){
                    $insertAccreditCount = $objAuth->count + $val->accreditCount;
                    $insertStart = ($objAuth->start > $val->starttime)?$val->starttime: $objAuth->start;
                    $insertEnd = ($objAuth->end > $val->endtime)? $objAuth->end: $val->endtime;
                }else{
                    $insertAccreditCount = $val->accreditCount;
                    $insertStart = $val->starttime;
                    $insertEnd = $val->endtime; 
                }
            }else{
                $insertAccreditCount = $val->accreditCount;
                $insertStart = $val->starttime;
                $insertEnd = $val->endtime;
            }
            $os = $obj->getSysType( $val->productGuid );
            empty($os)?$os = 1:$os = $os;
            $aAuth = array(
                'count' => $insertAccreditCount,
                'start' => $insertStart,
                'end' => $insertEnd,
                'os' =>$os
            );
            
            $strAuth = json_encode( $aAuth );
            Redis::HSET(REDIS_AUTH_PRODUCT.UNDERLINE.$val->EID,$val->productGuid,$strAuth);
            $obj->insertAuth( $authParams );
        }

        if(!empty($EID)){
            $obj->changeStatus($EID);
            $this->ok('','给企业授权成功!');
            return ;
        }else{
            $this->notice('企业ID不能为空,写入授权失败！');
            return ;
        }
    }

    public function testproductAuthAction(){
        $this->productAuthAction();
    }

    //产品授权
    public function productAuthAction(){
         $aRes = array();
         $obj = new AuthManagerModel();
         $rc4 = new rc4();

         $aGrant = $obj->getGrant();
         $aRes['userNum'] = 0; //授权用户数
         $aRes['importNum'] = count( $aGrant ); //导入授权次数
         $aRes['authStartTime'] = date('Y-m-d H:i:s'); //授权开始日期
         $aRes['authEndTime'] = date('Y-m-d H:i:s'); //授权结束日期
         $aRes['lastImportTime'] = $aGrant[0]['importTime']; //最后一次导入时间
         $aRes['authStatus'] = '失效';
         foreach( $aGrant as $grant ){
            $start = $rc4->decrypt($grant['notBefore']);
            $end = $rc4->decrypt($grant['notAfter']);
            if( strtotime($start) < strtotime($aRes['authStartTime'])){
                $aRes['authStartTime'] = $start;
            }
            if( strtotime($end)  > strtotime($aRes['authEndTime']) ){
                $aRes['authEndTime'] = $end;
                $aRes['authStatus'] = '正常';
            }
            $aRes['userNum'] = $aRes['userNum'] + $grant['orgcount'];

         }
         $aRes['productNum'] = $obj->getProductNum(); //授权子产品数

         $this->ok( $aRes );

    }

    //产品授权  各个子产品点.天使用情况
    public function productDetailsAction(){
        $obj = new AuthManagerModel();
        $aProduct = $obj->getProductDetails();
        foreach( $aProduct as $key => $aAmount){
            $aProduct[$key]['usedAmount'] = $obj->productUsedAmount( $aAmount['productGuid'] );
        }
        $this->ok($aProduct);
    }

    public function historyAccreditAction(){
        $aSerial = AuthManagerModel::getSerialON();
        foreach( $aSerial as  $val){
                $key = $val['serialNO'];
                $aRes[$key] = AuthManagerModel::getAllAccreditList( $key );
        }

        $this->ok( $aRes );
    }

    //退出
    public function loginOutAction(){
        $_SESSION['UserInfo'] = null;
        session_destroy();
        header('Location: /Center');
    }


}