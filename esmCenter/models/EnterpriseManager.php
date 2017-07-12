<?php
use \Lib\Store\Redis;
use \Lib\Store\Mysql as ESM;
use \Lib\Store\LogsMysql as logsDB;
use \Lib\Util\logs;
use \Lib\Model\AutoGroup;
use Lib\Util\rc4;
use \Lib\Model\RedisDataManager;

class EnterpriseManagerModel
{
    public function eidAlreadyIn($eid){
        $sql = "SELECT EID FROM esm_user WHERE EID='eid'";
        return ESM::getCell($sql);
        
    }

     public function createUserOrgInfo($params){
         $sql = "INSERT INTO esm_organization (OName,CreateTime,EID) VALUES ('".$params['OName']."','".$params['CreateTime']."','".$params['EID']."')";
         return ESM::exec( $sql );
    }

    public function createUserInfo($params_org){
        $sql = "INSERT INTO esm_user (EID,UserName,EMail,PhoneNO,PWD,Salt,Status,Level,CreatedTime) VALUES ('".$params_org['EID']."','".$params_org['UserName']."','".$params_org['EMail']."','".$params_org['PhoneNO']."','".$params_org['PWD']."','".$params_org['Salt']."','".$params_org['Status']."','".$params_org['Level']."','".$params_org['CreateTime']."')";
       
        $userid = ESM::exec( $sql );
        if (!$userid) {
            return false;
        }
        return true;
    }

    public function activeUser($eid) {
        logsDB::exec("CALL create_neweid_tables('$eid');");
       
        $tb = "RFW_UrlInterceptLog_$eid";
        $r = logsDB::getCell("select table_name from information_schema.tables where table_name='$tb'");
        if(!$r){
            logs::logError("ERROR_ACTIVE ['db process error']");
            return false;
        }
        //创建组
        $groupModel = new GroupModel();
       
        $defaultGroup = $groupModel->AddGroup('默认分组', '默认分组', $eid, 0);
        if (is_bool($defaultGroup) && !$defaultGroup) {
            logs::logError("ERROR_ACTIVE ['add group error 0']");
            return false;
        }

        $blackGroup = $groupModel->AddGroup('黑名单', '黑名单', $eid, 2);
        if (is_bool($blackGroup) && !$blackGroup) {
            logs::logError("ERROR_ACTIVE ['add group error 3']");
            return false;
        }
       

        $serverGroup = $groupModel->AddGroup('服务器', '服务器', $eid, 1);
        if (is_bool($serverGroup) && !$serverGroup) {
            logs::logError("ERROR_ACTIVE ['add group error 1']");
            return false;
        }
       
        
        //添加自动入组策略
        $autoGroup = new AutoGroup();
        $rules = [
            ['groupid' => $serverGroup['id'], 'rule' => [['type' => 'os', 'symbol' => 'has', 'value' => 'server']]],
            ['groupid' => $serverGroup['id'], 'rule' => [['type' => 'os', 'symbol' => 'has', 'value' => 'linux']]],
        ];
        
        $ok = $autoGroup->updateRules($eid, $rules);
        
        if (!(is_bool($ok) && $ok)) {
            logs::logError("ERROR_ACTIVE ['update auto group error']");
            return false;
        }
        
        //初始化redis
        RedisDataManager::initByEID($eid);

        return true;
    }

    public function getAuthNum(){
        $sql = 'SELECT orgcount,notBefore,notAfter FROM auth_grant';
        return ESM::getAll($sql);
    }

    public function getUsersNum(){
        $sql = 'SELECT SUM(CASE WHEN Status=0 THEN 1 ELSE 0 END) as notAuth,SUM(CASE WHEN Status=1 THEN 1 ELSE 0 END) as auth FROM esm_user WHERE Level=0';
        return ESM::getRow( $sql );
    }

    public function getSoonExpireNum( $today,$nextMonth ){
        $sql = "SELECT COUNT(ID) FROM (SELECT ID FROM org_auth_product WHERE endTime>='$today' AND endTime <='$nextMonth' GROUP BY EID)tt";
        $num = ESM::getCell($sql);
        return $num>0?$num:0;
    }

    public function getEnterpriseList( $aParams ){
        $WHERE = ' WHERE 1=1 AND Level=0';
        if($aParams['UserName']){
            $WHERE .= " AND UserName LIKE '%".$aParams['UserName']."%'";
        }
        if($aParams['OName']){
            $WHERE .= " AND OName LIKE '%".$aParams['OName']."%'";
        }
        if($aParams['createStartTime']){
            $WHERE .= " AND esm_user.CreatedTime>'".$aParams['createStartTime']."' AND user.CreatedTime < '".$aParams['createEndTime']."'";
        }
        if( $aParams['Status'] != '' ){
            if( $aParams['Status'] <2){
                $WHERE .= ' AND Status='.$aParams['Status'];
            }else{
                $WHERE .= ' AND Status=1';
            }
        }

        if( $aParams['sort'] ){
            intval($aParams['order'])>0? $desc = 'DESC':$desc = 'ASC';
            $WHERE .= ' ORDER BY '.$aParams['sort'] .' '.$desc;
        }

        if($aParams['limit']){
            $limit = ' LIMIT '.$aParams['offset'] .','.$aParams['limit'];
        }

        $sql = "SELECT esm_organization.EID,OName,esm_user.CreatedTime,Status,UserName,EMail,PhoneNo,LastLoginTime FROM  esm_user LEFT JOIN esm_organization ON esm_organization.EID=esm_user.EID $WHERE $limit";
        $sql2 = "SELECT count(*) as num FROM  esm_user LEFT JOIN esm_organization ON esm_organization.EID=esm_user.EID $WHERE ";
        $aRes['row'] = ESM::getAll($sql);
        $aRes['total'] = ESM::getCell($sql2);
        return $aRes;
    }

    public function getProduct( $EID ){
        $sql = "SELECT EID,productGuid,startTime,endTime,accreditCount,authAmount  FROM org_auth_product WHERE EID='$EID' GROUP BY productGuid";
        return ESM::getAll($sql);
    }

    public function getProductList( $EID ){
        $sql = "SELECT EID,productGuid,startTime,endTIme,accreditCount,authAmount,name FROM org_auth_product LEFT JOIN auth_product ON org_auth_product.productGuid=auth_product.proGuid WHERE EID='$EID'";
        return ESM::getAll($sql);
    }

    public function issetUserName($str,$eid=''){
        $where = " WHERE 1=1 AND UserName='$str'";
        if(!empty($eid)){
            $where .= " AND EID != '$eid'";
        }
        $sql = "SELECT UserID FROM esm_user $where";
        $result = ESM::getCell($sql);
        if ($result) {
            return true;
        } else {
            return false;
        }
    }

    public function issetOName($str,$eid=''){
        $where = " WHERE 1=1 AND OName='$str'";
        if(!empty($eid)){
            $where .= " AND EID != '$eid'";
        }
        $sql = "SELECT OID FROM esm_organization $where";
        $result = ESM::getCell($sql);
        if ($result) {
            return true;
        } else {
            return false;
        }
    }


    public function updateUser( $aUser ){
        return ESM::exec( 'UPDATE esm_user SET UserName=?,Email=?,PhoneNo=?,modifiedTime=? WHERE EID=?',$aUser );
    }

    public function updateOrganization( $aParam ){
       return ESM::exec('UPDATE esm_organization SET OName=?,modifiedTime=? WHERE EID=?',$aParam);
    }

    public function updateEntPwd( $aParams ){
        return ESM::exec( 'UPDATE esm_user SET PWD=?,Salt=? WHERE EID=?',$aParams );
    }

    public function getLogsSet( $eid ){
        return logsDB::getAll('SELECT * FROM log_clean_'.$eid);
    }

    public function modifyLogSet( $aParams ,$eid ){
        return logsDB::exec('UPDATE log_clean_'.$eid.' SET cleantype=1,days=?,nums=? WHERE tablename=?',$aParams);
    }

    public function modifyLogSetDays( $aParams ,$eid ){
        return logsDB::exec('UPDATE log_clean_'.$eid.' SET days=? WHERE tablename=?',$aParams);
    }

    public function getNameByEid( $eid ){
        return ESM::getCell('SELECT OName FROM esm_organization WHERE eid=?',[$eid]);
    }

}