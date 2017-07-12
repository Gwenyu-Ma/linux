<?php
use \Lib\Store\Redis;
use \Lib\Store\Mysql;
class AuthHomeModel
{
    
    public function getWindowsSysMaxNum(){
        $date = date('Y-m-d H:i:s');
        $sql = "SELECT MAX(accreditCount) as num FROM (SELECT SUM(accreditCount) as accreditCount FROM auth_product_list LEFT JOIN auth_product ON auth_product_list.productGuid = auth_product.proGuid WHERE auth_product.sysType=1 AND endTime >='$date'  GROUP BY productGuid ORDER BY endTime DESC) AS tt1";
        return Mysql::getCell( $sql );
    }

    public function getLinuxSum(){
        $date = date('Y-m-d H:i:s');
        $sql = "SELECT sum(accreditCount) as num FROM auth_product_list LEFT JOIN auth_product ON auth_product_list.productGuid = auth_product.proGuid WHERE auth_product.sysType=2 AND endTime >='$date' ORDER BY endTime DESC";
        return Mysql::getCell( $sql );
    }

    public function isAccreditOverdue( $nextMonth ){
        return Mysql::getCell("SELECT ID FROM auth_product_list WHERE endTime<= '$nextMonth'");
    }

    public function overDue(){
        $date = date('Y-m-d H:i:s');
        return Mysql::getCell("SELECT ID FROM auth_product_list WHERE endTime<='$date'");
    }

    public function noOverdue(){
        $date = date('Y-m-d H:i:s');
        return Mysql::getCell("SELECT ID FROM auth_product_list WHERE endTime>='$date'");
    }

    public function getAgentCount(){
        $sql = 'SELECT ID as num FROM auth_grant  GROUP BY serialNo';
        $res = Mysql::getAll( $sql );
        return count($res);
    }

    public function getAccreditNum(){
        $date = date('Ymd');
        $windowsNum = Redis::SCARD(REDIS_AUTH_WEP_QUEUE.$date); //windows授权
        $windowsNotNum = Redis::SCARD(REDIS_NAUTH_WEP_QUEUE.$date); //windows没有授权
        $linuxNum = Redis::SCARD(REDIS_AUTH_LEP_QUEUE.$date); //linux授权
        $linuxNotNum = Redis::SCARD(REDIS_NAUTH_LEP_QUEUE.$date); //linux没有授权
        $historyTotal = Redis::HLEN ('hep'); //历史授权总端数

        $windowsNum>0?$windowsNum=$windowsNum:$windowsNum=0;
        $windowsNotNum>0?$windowsNotNum=$windowsNotNum:$windowsNotNum=0;
        $linuxNum>0?$linuxNum=$linuxNum:$linuxNum=0;
        $linuxNotNum>0?$linuxNotNum=$linuxNotNum:$linuxNotNum=0;
        
        return array('windowsNum' => $windowsNum,'windowsNotNum'=>$windowsNotNum,'linuxNum'=>$linuxNum,'linuxNotNum'=>$linuxNotNum,'historyTotal'=>$historyTotal);
    }

    public function getHistorySevenDay(){
        return Mysql::getAll('SELECT * FROM (SELECT historyDate,authNum FROM auth_history_links ORDER BY ID DESC LIMIT 7) AS sevenDay ORDER BY historyDate ASC ');
    }


   public function todayAccredit( $isLimit,$params=array() ){
       $order = 'ORDER BY linkTime DESC';
       $strLimit = '';
       $where = ' WHERE 1=1';
       if($isLimit){
           $date = date('Y-m-d');
           $where .= " AND linkStatus=1 AND linkTime>'$date'  $order LIMIT 5";
       }else{
            if($params['ip']){
                $where .= " AND IP LIKE '%".$params['ip']."%'";
            }
            if($params['mac']){
                $where .= " AND mac LIKE '%".$params['mac']."%'";
            }
            if($params['isAccredit']){
                $where .= " AND linkStatus='".$params['isAccredit']."'";
            }
            if($params['sort']){
                $params['order']>0? $desc = 'DESC':$desc = 'ASC';
                $where .= ' ORDER BY '.$params['sort'] .' '.$desc;
            }else{
                 $where .= $order;
            }

            if($params['offset']){
                $where .= ' LIMIT '.$params['offset'] .' '.$params['limit'];
            }
            
       }
       $sql = "SELECT auth_today_link.guid,IP,mac,computerName,sysType,auth_today_link.linkTime  FROM auth_today_link LEFT JOIN auth_client_info ON auth_today_link.guid=auth_client_info.guid $where";
       return  Mysql::getAll( $sql );
   }

}