<?php
namespace Lib\Model;

use Lib\Store\Mysql as M;
use Lib\Store\LogsMysql as LogsM;
use DL\Model\Eid;
use Lib\Store\Redis;

class Clean
{
    static public function cleanOrNot($uname)
    {
        $eid = M::getCell('select eid from esm_user where UserName=? and Status=0 limit 1', [$uname]);
        if(empty($eid)){
            return;
        }
        M::exec('delete from esm_user where EID=?', [$eid]);
        M::exec('delete from esm_organization where EID=?', [$eid]);
    }

    static public function cleanByEid( $eid ){
        M::exec('delete from esm_user where EID=?', [$eid]);
        M::exec('delete from esm_organization where EID=?', [$eid]);
        LogsM::exec("CALL del_log_table ('$eid');");

        Clean::cleanInitRedit( $eid );
        Clean::cleanInitMongo( $eid );
    }

    /*
    *func:注册激活失败后,删除创建的一些表和记录
     */
    static public function cleanRubbishInfo( $eid ){
        M::exec('DELETE FROM esm_user WHERE EID=?', [$eid]);
    }

    /*
    @func:删除用户时，清除用户初始化的Redis数据
    */
   static private function cleanInitRedit( $eid ){
        $eids = new Eid();
        $eids->del($eid);

        Redis::HDEL (CACHE_REDIS_ONLINESTATE_PRE . $eid, $eid);
        Redis::HDEL(CACHE_REDIS_ORG_PRE . $eid, 'p_global');
        Redis::HDEL(CACHE_REDIS_ORG_PRE . $eid, 'p_group_'.$eid);
        Redis::HDEL(REDIS_AUTH_EP_QUEUE.$eid);
   }

   /*
    @func:删除用户时，清除用户初始化的Mongodb数据
    */
   static private function cleanInitMongo( $eid ){
        $objAutoGroupInfo = select_manage_collection( 'autogroup' );
        $objPolicyInfo = select_manage_collection('policyinfo');
        $objPolicyInfo->remove(array('eid' => $eid));
        $objAutoGroupInfo->remove(array('eid' => $eid));
   }

}