<?php
namespace Lib\Model;

use Lib\Authorization;

class Auth
{
    private $_sn='a';
    private $_isTimeout=true;
    private $_auth=[];
    private $_authDict=[];

    function __construct($sn)
    {
        $this->_sn=$sn;
        $this->_initAuth();
    }

    private function _initAuth()
    {
        $result = Authorization::getAuth($this->_sn);
        if(is_bool($result)&&!$result){
           throw new \Exception('导入授权失败', 1);
        }
        $time=time();
        foreach ($result['items'] as $authItem) {
            $sn=$authItem['sn'];
            $pDom=simplexml_load_string($authItem['context']);
            $month=(array)$pDom->Month;
            $bTime=$authItem['bDate'];
            $eTime=strtotime(date('Y-m-d',$authItem['bDate'])." + $month[0] month +1 day");

            foreach ($pDom->Items->Item as $item) {
                $pGuid=(array)$item->Func;
                $count=(array)$item->Cnt;
                $this->_authDict[$sn][]=[
                    'pguid'=>$pGuid[0],
                    'count'=>$count[0],
                    'bDate'=>$bTime,    // date('YmdHis',$bTime),
                    'eDate'=>$eTime     //date('YmdHis',$eTime)
                ];

            }
            if($this->_isTimeout && $eTime>=$time){
                $this->_isTimeout=false;
            }
        }
        $this->_auth=$result;
    }

    public function getAuths()
    {
        return $this->_auth;
    }

    public function checkAuth()
    {
        return !empty($this->_auth);
    }

    public function getAuthDict()
    {
        return $this->_authDict;
    }

    public function authIsTimeout()
    {
        return $this->_isTimeout;
    }

    public function getValidAuthByProduct()
    {
        $time=time();
        $productAuths=[];
        foreach ($this->_authDict as $key => $items) {
            foreach ($items as $value) {
                $bDate=$value['bDate'];
                $eDate=$value['eDate'];
                $pGuid=$value['pguid'];
                if(array_key_exists($pGuid,$productAuths)){
                    $pAuth=$productAuths[$pGuid];
                }else{
                    $pAuth=[
                        count=>0,
                        bDate=>0,
                        eDate=>0
                    ];
                }
                if($bDate<=$time && $eDate>=$time){

                    $pAuth['bDate']=$pAuth['bDate']==0? $bDate:($pAuth['bDate']>$bDate? $bDate:$pAuth['bDate']);
                    $pAuth['eDate']=$pAuth['eDate']==0? $eDate:($pAuth['eDate']<$eDate? $eDate:$pAuth['eDate']);
                    $pAuth['count']+=$value['count'];
                    $productAuths[$pGuid]=$pAuth;
                }
            }
        }
        return $productAuths;
    }
}