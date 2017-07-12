<?php
/**
 * Created by PhpStorm.
 * User: xujy
 * Date: 2017/3/22
 * Time: 10:29
 */
use \Lib\Store\Mysql;
use \Lib\Store\Redis;
class AuthProductModel
{
    public function historyAccredit( $params ){
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
        $sql = "SELECT historyDate,authNum,notAuthNum FROM auth_history_links $where $limit";
        $sql2 = "SELECT count(*) as num FROM auth_history_links $where";
        $aRes['row'] = Mysql::getAll($sql);
        $aRes['total'] = Mysql::getCell($sql2);
        return $aRes;
    }



    public function productAccredit( $params ){
        if($params['sort']){
            intval($params['order'])>0? $desc = 'DESC':$desc = 'ASC';
            $where .= 'ORDER BY '.$params['sort'] .' '.$desc;
        }
        $datetime = date("Y-m-d H:i:s");
        
        return Mysql::getAll("SELECT proGuid,name,codeName, sum(accreditCount) as  accreditCount FROM auth_product_list LEFT JOIN auth_product ON auth_product.proGuid=auth_product_list.productGuid WHERE  endTime>='$datetime' GROUP BY productGuid $where");
    }

    public function getProCurrentLinksNum( $guid ){
        $date = date('Ymd');
        $currentLinkNum = Redis::SCARD(REDIS_AUTH_EP_QUEUE."$guid_$date"); //当前每个子产品的已经授权数
        return $currentLinkNum;
    }

    public function getProductDetail(){
        return Mysql::getAll("SELECT seriaNO,productGuid,accreditCount,DATE_FORMAT(startTime,'%Y-%m-%d') as startTime,DATE_FORMAT(endTime,'%Y-%m-%d') as endTime,sysType,name,codeName FROM auth_product_list LEFT JOIN auth_product ON auth_product_list.productGuid=auth_product.proGuid");
    }


}