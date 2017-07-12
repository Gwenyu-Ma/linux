<?php
use \Lib\Store\Mysql;
use \Lib\Store\LogsMysql as LogsDB;
use \Lib\Store\Redis;
class AuthProductModel
{
    public function productAccredit( $eid,$params ){
        $where = '';
        $datetime = date("Y-m-d H:i:s");
         if($params['sort']){
            intval($params['order'])>0? $desc = 'DESC':$desc = 'ASC';
            $where .= 'ORDER BY '.$params['sort'] .' '.$desc;
        }
        $sql = "SELECT productGuid,name,codeName, sum(accreditCount) as  accreditCount FROM org_auth_product LEFT JOIN auth_product ON org_auth_product.productGuid=auth_product.proGuid WHERE  endTime>='$datetime' AND eid='$eid' GROUP BY productGuid $where";
        return Mysql::getAll($sql);
    }

    public function getProCurrentLinksNum( $eid,$proGuid ){
        $date = date('Ymd');
        $currentLinkNum = Redis::SCARD(REDIS_AUTH_EP_QUEUE.$eid.'_'.$proGuid.'_'.$date); //当前每个子产品的已经授权数
        return $currentLinkNum > 0 ?  $currentLinkNum:0;
    }

    public function getProductDetail( $eid ){
        return Mysql::getAll("SELECT serialNO,productGuid,accreditCount,DATE_FORMAT(startTime,'%Y-%m-%d') as startTime,DATE_FORMAT(endTime,'%Y-%m-%d') as endTime,sysType,name,codeName FROM org_auth_product LEFT JOIN auth_product ON org_auth_product.productGuid=auth_product.proGuid WHERE eid='$eid'");
    }

     public function historyAccredit( $eid, $params ){
        $where = ' WHERE 1=1';
        if($params['startDate']){
            $where .= " AND historyDate>='".$params['startDate']."'";
        }
        if($params['endDate']){
            $where .= " AND historyDate<='".$params['endDate']."'";
        }
       
        if($params['sort']){
            intval($params['order'])>0? $desc = 'DESC':$desc = 'ASC';
            $where .= ' ORDER BY '.$params['sort'] .' '.$desc;
        }
        if($params['limit']){
            $limit = ' LIMIT '.$params['offset'] .','.$params['limit'];
        }
        $sql = "SELECT historyDate,authNum,notAuthNum FROM auth_history_links_$eid $where $limit";
        $sql2 = "SELECT count(*) as num FROM auth_history_links_$eid $where";
        $aRes['row'] = LogsDB::getAll($sql);
        $aRes['total'] = LogsDB::getCell($sql2);
        return $aRes;
    }

    public function todayAccredit( $eid,$params=array() ){
       $order = ' ORDER BY linktime DESC';
       $strLimit = '';
       $where = ' WHERE 1=1';
       
        if($params['ip']){
            $where .= " AND ip LIKE '%".$params['ip']."%'";
        }
        if($params['mac']){
            $where .= " AND mac LIKE '%".$params['mac']."%'";
        }
        if($params['isAccredit']){
            $where .= " AND linkstatus='".$params['isAccredit']."'";
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
            
      
       $sql = "SELECT auth_today_link_$eid.sguid,ip,mac,computername,systype,auth_today_link_$eid.linktime  FROM auth_today_link_$eid LEFT JOIN epinfo_$eid ON auth_today_link_$eid.sguid=epinfo_$eid.sguid $where";
       return  LogsDB::getAll( $sql );
   }

   //以下是单用户模式调用方法
   public function showAccredit( $params ){
        if($params['sort']){
            intval($params['order'])>0? $desc = 'DESC':$desc = 'ASC';
            $where .= 'ORDER BY '.$params['sort'] .' '.$desc;
        }
        $datetime = date("Y-m-d H:i:s");
        
        return Mysql::getAll("SELECT proGuid,name,codeName, sum(accreditCount) as  accreditCount FROM auth_product_list LEFT JOIN auth_product ON auth_product.proGuid=auth_product_list.productGuid WHERE  endTime>='$datetime' GROUP BY productGuid $where");
   }

   public function showProductDetail(){
       return Mysql::getAll("SELECT seriaNO,productGuid,accreditCount,DATE_FORMAT(startTime,'%Y-%m-%d') as startTime,DATE_FORMAT(endTime,'%Y-%m-%d') as endTime,sysType,name,codeName FROM auth_product_list LEFT JOIN auth_product ON auth_product_list.productGuid=auth_product.proGuid");
   }

}