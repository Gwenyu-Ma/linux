<?php
use \Lib\Store\Redis;
use \Lib\Store\Mysql as ESM;
use \Lib\Store\LogsMysql as logsDB;
use \Lib\Util\logs;
use \Lib\Model\AutoGroup;
use Lib\Util\rc4;

class AuthManagerModel
{
    
    public function getAuthList(){
        $datetime = date('Y-m-d H:i:s');
        $sql = "SELECT productGuid,sum(accreditCount) AS accreditCount,min(startTime) AS startTime,max(endTime) AS endTime,sum(authAmount) AS authAmount,name,codeName FROM auth_product_list  LEFT JOIN auth_product ON auth_product_list.productGuid= auth_product.proGuid WHERE starttime<='$datetime' AND endtime>='$datetime' AND proType=1 GROUP BY productGuid";
        return ESM::getAll($sql);
    }

    public function getProductAmount( $proGuid ){
        $usedAmount = ESM::getCell('SELECT SUM(authAmount) as usedAmount FROM org_auth_product WHERE productGuid=?',[$proGuid]);
        return $usedAmount>0?$usedAmount:0;
    }

    public function insertAuth( $params ){
        $sql = "INSERT INTO org_auth_product (EID,productGuid,jsonValue,createTime,startTime,endTime,accreditCount) VALUES ('".$params['EID']."','".$params['productGuid']."','".$params['jsonValue']."','".$params['createTime']."','".$params['startTime']."','".$params['endTime']."',".$params['accreditCount'].")";
        return ESM::exec($sql);
    }

    public function changeStatus($EID){
        $sql = "UPDATE esm_user SET Status=1 WHERE EID='$EID'";
        return ESM::exec($sql);
    }

    public function getGrant(){
       return ESM::getAll('SELECT orgcount,importTime,notBefore,notAfter FROM auth_grant ORDER BY importTime desc');
    }

    public function getProductNum(){
        return ESM::getCell('SELECT COUNT(*) AS num  FROM (SELECT productGuid FROM auth_product_list GROUP BY productGuid) as tt1');
    }

    public function getProductDetails(){
        return ESM::getAll('SELECT SUM(accreditCount) AS accreditCount, SUM(authAmount) as authAmount,productGuid,name,codeName FROM auth_product_list left join auth_product on auth_product_list.productGuid=auth_product.proGuid  where proType=1 GROUP BY productGuid');
    }

    public function productUsedAmount( $proGuid ){
        return ESM::getCell('SELECT SUM(authAmount) as amount FROM org_auth_product WHERE productGuid=?',[$proGuid]);
    }

    public function getProductName( $proGuid ){
        return ESM::getCell('SELECT name FROM auth_product WHERE proGuid=?',[$proGuid]);
    }

    public function getCodeName( $proGuid ){
         return ESM::getCell('SELECT codeName FROM auth_product WHERE proGuid=?',[$proGuid]);       
    }

    public function getSysType( $proGuid ){
        return ESM::getCell('SELECT sysType FROM auth_product WHERE proGuid=?',[$proGuid]);
    }

    public static function getAllAccreditList( $serialNO ){
        return ESM::getAll('SELECT productGuid,accreditCount,startTime,endTime,name,codeName,sysType FROM  auth_product_list LEFT JOIN auth_product ON auth_product_list.productGuid=auth_product.proGuid WHERE serialNO=? AND proType=1',[$serialNO]);
    }

    public static function getSerialON(){
        return ESM::getAll('SELECT serialNO FROM auth_product_list GROUP BY serialNO');
    }
    
}