<?php

namespace Lib\Model;

use Lib\Store\Redis;
use Lib\Util\XMLProcess;
use Lib\Store\Mysql as MC;
use Lib\Store\LogsMysql as MCREAD;
use Lib\Util\Log;

class RedisDataManager
{
    private static $BlackGUID = '';

    public static function init()
    {
        Redis::del('initComplete');
        // 不存在或为0则重新初始化
        if (!(Redis::exists("initComplete") && Redis::get("initComplete") != 0)) {
            try {
                self::initEid();
                self::initClientInfo();
                self::initAllPolicy();
            } catch (Exception $e) {
                print $e;
                exit();
            }
            Redis::set("initComplete", 2);
        }
    }

    public static function initEid()
    {
        MC::clean();
        $rows = MC::getAll('select  EID from esm_organization');
        foreach ($rows as $row) {
            //var_dump($row);
            self::setEPOffLineTime($row['EID'], $row['EID'], $row['EID']);
            self::initCMD($row['EID']);
            self::initIoa($row['EID']);
        }
    }


    /**
     * 判断是否位黑名单组
     * @param  [string]  $eid     [企业id]
     * @param  [int]  $groupId [组id]
     * @return boolean          [是/否]
     */
    public static function isBlackGroup($eid, $groupId)
    {
        $groupId = intval($groupId);
        /*$group = select_manage_collection('groupinfo')->findOne(array(
            'eid' => $eid,
            'id' => $groupId,
        ), array(
            'type',
        ));*/
       $group =  MCREAD::getAll("SELECT type FROM groupinfo_$eid WHERE eid=? AND id=?",[$eid,$groupId]);


        self::$BlackGUID = empty(self::$BlackGUID) && !empty($group) && $group['type'] == 2 ? $groupId : self::$BlackGUID;
        //var_dump([2, self::$BlackGUID, $groupId]);
        return !empty($groupId) && $groupId == self::$BlackGUID;
    }

    /**
     * 根据eid初始化
     *
     * @param string $eid
     *            企业id
     */
    public static function initByEID($eid)
    {
        self::setEPOffLineTime($eid, $eid, $eid);
        // 初始化全局策略
        //self::initPolicy($eid, $eid, 0);
        // 循环初始化组策略和命令
        /*$groupArr = select_manage_collection('groupinfo')->find(array(
            'eid' => $eid,
        ), array(
            'id',
            'type',
        ));*/
        $groupArr =  MCREAD::getAll("SELECT id,type FROM groupinfo_$eid WHERE eid=?",[$eid]);
        foreach ($groupArr as $group) {
            // 初始化组策略和命令
            self::initByGroupID($eid, $group['id']);
        }
    }

    /**
     * 根据eid，groupid初始化
     *
     * @param string $eid
     *            企业id
     * @param string $groupId
     *            组id
     */
    public static function initByGroupID($eid, $groupId)
    {
        // 初始化组策略
        self::initPolicy($eid, $groupId, 1);
        $clients = self::getClientSGuidArr($eid, $groupId, 1);
        foreach ($clients as $client) {

            // 初始化客户端信息
            self::initByClientID($eid, $groupId, $client['sguid']);
        }
    }

    /**
     * 初始化客户端（客户端基本信息，客户端策略，客户端命令）
     *
     * @param string $eid
     *            企业id
     * @param string $groupid
     *            组id
     * @param string $clientId
     *            客户端id
     */
    public static function initByClientID($eid, $groupId, $clientId)
    {
        // 初始化客户端信息
        self::initEPInfo($eid, $groupId, $clientId);
        // 初始化k客户端策略
        self::initPolicy($eid, $clientId, 2);
        // 初始化客户端命令
        self::initClientCMD($eid, $groupId, $clientId);
    }

    /**
     * 初始化客户端（客户端基本信息）
     *
     * @param string $eid
     * @param string $groupId
     * @param string $clientId
     */
    public static function initEPInfo($eid, $groupId, $clientId)
    {
        $key = CACHE_REDIS_EP_PRE . $eid . $clientId;
        if (self::isBlackGroup($eid, $groupId)) {
            Redis::hDel($key);
            Redis::hSet($key, 'inblackmenu', 1);
            self::initClientCMD($eid, $groupId, $clientId);
            return;
        }
       /* $clientCollection = select_manage_collection("epinfo");
        $client = $clientCollection->findOne(array(
            'eid' => $eid,
            'groupid' => $groupId,
            'sguid' => $clientId,
        ));*/
        $client = MCREAD::getRow("SELECT * FROM epinfo_$eid WHERE eid=? AND groupid=? AND sguid=?",[$eid,$groupId,$clientId]);
        if (!is_null($client)) {
            $eid = $client["eid"];
            $sguid = $client["sguid"];
            $groupid = $client["groupid"];
            $p_ver = isset($client["pstamp"]) ? $client["pstamp"] : 0;
            $c_ver = isset($client["cstamp"]) ? $client["cstamp"] : 0;
            $clientCache = array(
                'g_info' => $groupid,
                'p_ver' => $p_ver,
                'c_ver' => $c_ver,
                'ep_info' => json_encode($client),
                'inblackmenu' => 0,
            );
            Redis::hMSet($key, $clientCache);
        }
    }

    /**
     * 初始化企业所有客户端命令
     *
     * @param string $eid
     *            企业id
     */
    public static function initClientCMDByEID($eid)
    {
        // 循环初始化组策略和命令
        /*$grouparr = select_manage_collection('groupinfo')->find(array(
            'eid' => $eid,
        ), array(
            'id',
        ));*/
       $grouparr = MCREAD::getRow("SELECT id FROM groupinfo_$eid WHERE eid=?",[$eid]);
        
        foreach ($grouparr as $group) {
            // 初始化组策略和命令
            self::initClientCMDByGroupId($eid, $group['id']);
        }
        //$clients = self::getClientSGuidArr($eid, $eid, 0);

        //foreach ($clients as $client) {
        //    self::initClientCMD($eid, $groupId, $client['sguid']);
        //}
    }

    /**
     * 初始化组下所有客户端命令
     *
     * @param string $eid
     *            企业id
     * @param string $groupId
     *            组id
     */
    public static function initClientCMDByGroupId($eid, $groupId)
    {
        if (self::isBlackGroup($eid, $groupId)) {
            return;
        }
        $clients = self::getClientSGuidArr($eid, $groupId, 1);

        foreach ($clients as $client) {
            self::initClientCMD($eid, $groupId, $client['sguid']);
        }
    }

    /**
     * 初始化客户端命令
     *
     * @param string $eid
     *            企业id
     * @param string $groupId
     *            组id
     * @param string $clientId
     *            客户端id
     */
    public static function initClientCMD($eid, $groupId, $clientId)
    {
        if (self::isBlackGroup($eid, $groupId)) {
            return;
        }
        $sguid = $clientId;

        $sql = sprintf('SELECT cmdInfo.cmdid as id,productid,action as cmdid,cmdjson,sguid,cmdInfo.eid,cmdInfo.edate FROM CMDInfo_%s cmdInfo LEFT JOIN CMDIssuedState_%s cmdState
  ON cmdInfo.cmdid=cmdState.cmdid
WHERE  state=0 AND sguid=:sguid AND cmdInfo.edate>:edate', $eid,$eid);
        MCREAD::clean();
        MCREAD::$eid=$eid;
        $cmdArr = MCREAD::getAll($sql, [
            ':edate' => date('Y-m-d H:i:s', strtotime(-REDIS_CMD_OUTTIME . ' second')),
            ':sguid' => $sguid
        ]);

        foreach ($cmdArr as $cmd) {
            $eid = $cmd["eid"];
            $cmdToken = $cmd["id"];
            $cmdId = $cmd['cmdid'];
            $cmdjson = json_encode(array(
                'productid' => Cmd::$CmdDict[$cmdId]['productId'],
                'id' => $cmd['id'],
                'type' => Cmd::$CmdDict[$cmdId]['type'],
                'cmdtype' => Cmd::$CmdDict[$cmdId]['cmdType'],
                'cmdver' => strtotime($cmd['edate']),
                'cmdid' => Cmd::$CmdDict[$cmdId]['cmdId'],
                'cmdcontentbuf' => base64_encode(XMLProcess::Json2XML(($cmd["cmdjson"]))),
            ));
            $cmdKey = CACHE_REDIS_CMD_PRE . $eid . $cmdToken;

            Redis::lRem(CACHE_REDIS_EP_CMD_PRE . $eid . $sguid, $cmdKey, 0);
            Redis::rPush(CACHE_REDIS_EP_CMD_PRE . $eid . $sguid, $cmdKey);
            Redis::setNx($cmdKey, $cmdjson);
            Redis::expire($cmdKey, REDIS_CMD_OUTTIME);
        }
    }

    /**
     * 生成新命令
     */
    public static function addCMD($cmdObj)
    {
        $eid = $cmdObj["eid"];
        $sguid = $cmdObj['cmdobject'];
        $cmdToken = $cmdObj["id"];
        $cmdId = $cmdObj['cmdid'];
        $c_ver=$cmdObj['c_ver'];
        $cmdjson = json_encode(array(
            'productid' => Cmd::$CmdDict[$cmdId]['productId'],
            'id' => $cmdObj['id'],
            'type' => Cmd::$CmdDict[$cmdId]['type'],
            'cmdtype' => Cmd::$CmdDict[$cmdId]['cmdType'],
            'cmdver' => $c_ver,
            'cmdid' => Cmd::$CmdDict[$cmdId]['cmdId'],
            'cmdcontentbuf' => base64_encode($cmdObj["cmdjson"]),
        ));
        $cmdKey = CACHE_REDIS_CMD_PRE . $eid . $cmdToken;
        Redis::setNx($cmdKey, $cmdjson);
        Redis::expire($cmdKey, REDIS_CMD_OUTTIME);

        Redis::lRem(CACHE_REDIS_EP_CMD_PRE . $eid . $sguid, $cmdKey, 0);
        Redis::rPush(CACHE_REDIS_EP_CMD_PRE . $eid . $sguid, $cmdKey);
        Redis::hSet(CACHE_REDIS_EP_PRE . $eid . $sguid, 'c_ver', $c_ver);
        //print_r(Redis::r);
        // print_r(Redis::get($cmdKey));
        // echo Redis::hGet(CACHE_REDIS_EP_PRE . $eid . $sguid, 'c_ver');
    }

    /**
     * 初始化策略
     *
     * @param string $eid
     *            企业id
     * @param string $objId
     *            企业|组|客户端
     * @param string $groupType
     *            0：企业|1：组|2：客户端
     */
    public static function initPolicy($eid, $objId, $groupType)
    {
        switch ($groupType) {
            case 0: // 初始化全局策略
                $key = CACHE_REDIS_ORG_PRE . $eid;
                $hashKey = 'p_global';
                break;
            case 1: // 初始化组策略
                $key = CACHE_REDIS_ORG_PRE . $eid;
                $hashKey = "p_group_$objId";
                $objId = strval($objId);
                break;
            case 2: // 初始化客户端策略
                $key = CACHE_REDIS_EP_PRE . $eid . $objId;
                $hashKey = 'p_info';
                break;
            default:
                break;
        }

        $policyArr = select_manage_collection('policyinfo')->find(array(
            'eid' => $eid,
            'policyobject' => $objId,
            'grouptype' => $groupType,
        ), array(
            'eid',
            'productid',
            'productname',
            "grouptype",
            'policyobject',
            'policytype',
            'policyjson',
            'policyver',
        ));
        $policyList = array();

        foreach ($policyArr as $policy) {
            array_push($policyList, array(
                'policyproductid' => $policy['productid'],
                'grouptype' => $policy['grouptype'],
                'policytype' => $policy['policytype'],
                'policyver' => $policy['policyver'],
                'policymaincontent' => base64_encode(XMLProcess::Json2XML(($policy['policyjson']))),
            ));
        }
        Redis::hDel($key, $hashKey);
        //如果不存在策略，则清理缓存
        if (empty($policyList)) {
            return;
        }
        Redis::hSet($key, $hashKey, json_encode($policyList));
    }

    /**
     * **
     * 初始化客户端信息（g_info,p_ver,c_ver,ep_info,p_info）
     */
    private static function initClientInfo()
    {
        Redis::del('tmp_*');
        $clientCollection = select_manage_collection("epinfo");
        $clientArr = $clientCollection->find();

        foreach ($clientArr as $client) {
            $eid = $client["eid"];
            $groupid = empty($client["groupid"]) ? '' : $client['groupid'];
            if (self::isBlackGroup($eid, $groupid) || empty($groupid)) {
                continue;
            }
            $sguid = $client["sguid"];
            $p_ver = empty($client["pstamp"]) ? 0 : $client['pstamp'];
            $c_ver = empty($client["cstamp"]) ? 0 : $client['cstamp'];
            $clientCache = array(
                'g_info' => $groupid,
                'p_ver' => $p_ver,
                'c_ver' => $c_ver,
                'ep_info' => json_encode($client),
            );
            Redis::del(CACHE_REDIS_EP_PRE . $eid . $sguid);
            Redis::hMSet(CACHE_REDIS_EP_PRE . $eid . $sguid, $clientCache);
            self::initPolicy($eid, $sguid, 2);
            Redis::sAdd("tmp_$groupid", $sguid);
            Redis::sAdd("tmp_$eid", $sguid);
            Redis::sAdd('tmp_eid', $eid);
        }
    }

    /**
     * **
     * 初始化策略(p_global,p_group_groupid)
     */
    private static function initAllPolicy()
    {

        // 遍历eid
        while (Redis::sCard("tmp_eid") > 0) {

            $eid = Redis::sPop('tmp_eid');

            // 初始化全局策略
            self::initPolicy($eid, $eid, 0);
            // 获取组
            $groupArr = select_manage_collection('groupinfo')->find(array(
                'eid' => $eid,
            ), array(
                'id',
            ));

            // 初始化组策略
            foreach ($groupArr as $group) {
                self::initPolicy($eid, $group['id'], 1);
            }
        }
    }

    /**
     * **
     * 初始化命令
     */
    public static function initCMD($eid)
    {
        $sql = sprintf('SELECT cmdInfo.cmdid as id,productid,action as cmdid,cmdjson,sguid,cmdInfo.eid,cmdInfo.edate FROM CMDInfo_%s cmdInfo LEFT JOIN CMDIssuedState_%s cmdState
  ON cmdInfo.cmdid=cmdState.cmdid
WHERE  state=0 and cmdInfo.edate>:edate', $eid,$eid);
        MCREAD::clean();
        MCREAD::$eid=$eid;
        $cmdArr = MCREAD::getAll($sql, [':edate' => date('Y-m-d H:i:s', strtotime(-REDIS_CMD_OUTTIME . ' second'))]);
        foreach ($cmdArr as $cmd) {
            $eid = $cmd["eid"];
            $cmdToken = $cmd["id"];
            $cmdId=$cmd['cmdid'];
            $cmdjson = json_encode(array(
                'productid' => Cmd::$CmdDict[$cmdId]['productId'],
                'id' => $cmd['id'],
                'type' => Cmd::$CmdDict[$cmdId]['type'],
                'cmdtype' => Cmd::$CmdDict[$cmdId]['cmdType'],
                'cmdver' => strtotime($cmd['edate']),
                'cmdid' => Cmd::$CmdDict[$cmdId]['cmdId'],
                'cmdcontentbuf' => base64_encode(XMLProcess::Json2XML(($cmd["cmdjson"]))),
            ));
            $sguid = $cmd['sguid'];
            $cmdKey = CACHE_REDIS_CMD_PRE . $eid . $cmdToken;
            Redis::lRem(CACHE_REDIS_EP_CMD_PRE . $eid . $sguid, $cmdKey, 0);
            Redis::rPush(CACHE_REDIS_EP_CMD_PRE . $eid . $sguid, $cmdKey);

            Redis::setNx($cmdKey, $cmdjson);
            Redis::expire($cmdKey, REDIS_CMD_OUTTIME);
        }
    }

    /**
     * 修改客户端命令全局版本（c_ver）
     *
     * @param string $eid
     *            企业id
     * @param string $objId
     *            企业|组|客户端
     * @param string $groupType
     *            0：企业|1：组|2：客户端
     * @param string $pVer
     *            命令版本
     */
    public static function updateClientCMDVer($eid, $objId, $groupType, $cVer = null)
    {
        $clients = self::getClientSGuidArr($eid, $objId, $groupType);

        foreach ($clients as $client) {
            $cVer = empty($cVer) ? intval($client['cstamp']) : $cVer;
            Redis::hSet(CACHE_REDIS_EP_PRE . $eid . $client['sguid'], 'c_ver', $cVer);
        }
    }

    /**
     * 修改客户端策略全局版本(p_ver)
     *
     * @param string $eid
     *            企业id
     * @param string $objId
     *            企业|组|客户端
     * @param string $groupType
     *            0：企业|1：组|2：客户端
     * @param string $pVer
     *            策略版本
     */
    public static function updateClientPolicyVer($eid, $objid, $groupType, $pVer)
    {
        $clients = self::getClientSGuidArr($eid, $objid, $groupType);
        foreach ($clients as $client) {
            $pVer = empty($pVer) ? intval($client['pstamp']) : $pVer;
            Redis::hSet(CACHE_REDIS_EP_PRE . $eid . $client['sguid'], 'p_ver', $pVer);
        }
    }

    /**
     * 获取客户端信息
     *
     * @param string $eid
     *            企业id
     * @param string $objId
     *            企业|组|客户端
     * @param string $groupType
     *            0：企业|1：组|2：客户端
     * @return array 客户端集合
     */
    private static function getClientSGuidArr($eid, $objId, $groupType)
    {
        switch ($groupType) {
            case 0:
                /*$where = array(
                    'eid' => $objId,
                );*/
                $sql = "SELECT sguid,pstamp,cstamp FROM epinfo_$eid WHERE eid='$eid' and  unset !=1";
                break;
            case 1:
                /*$where = array(
                    'eid' => $eid,
                    'groupid' => intval($objId),
                );*/
                $sql = "SELECT sguid,pstamp,cstamp FROM epinfo_$eid WHERE eid='$eid' and groupid=$objId and unset !=1";
                break;
            case 2:
               /* $where = array(
                    'eid' => $eid,
                    'sguid' => $objId,
                );*/
                $sql = "SELECT sguid,pstamp,cstamp FROM epinfo_$eid WHERE eid='$eid' and sguid=$objId　and  unset !=1";
                break;
            default:
                return false;
        }
        return MCREAD::getAll( $sql );
        /*$where['unset'] = ['$ne' => 1];
        return select_manage_collection('epinfo')->find($where, array(
            'sguid' => true,
            'pstamp' => true,
            'cstamp' => true,
        ));*/
    }

    /**
     * 更新或插入客户端信息，到redis中
     * @param $sguid
     * @param $epinfo
     */
    public static function updateEPInfo($eid, $sguid, $epinfo)
    {
        $epinfo0 = Redis::hGet(CACHE_REDIS_EP_PRE . $eid . $sguid, 'ep_info');
        $epinfo0 = json_decode($epinfo0, true);
        if(!empty($epinfo0)&&!empty($epinfo0['memo'])){
            $epinfo['memo'] = $epinfo0['memo'];
        }

        if(!empty($epinfo0)&&!empty($epinfo0['createtime'])){
            $epinfo['createtime'] = $epinfo0['createtime'];
        }
        Redis::hSet(CACHE_REDIS_EP_PRE . $eid . $sguid, 'ep_info', json_encode($epinfo));
    }

    //把爱办公的userid存入到redis中
    public static function saveIoaUserid($eid, $sguid, $userid)
    {
        Redis::hSet(CACHE_REDIS_IOA_PRE . $eid . $sguid, 'ioauserid', $userid);
    }

    //从redis中获取爱办公的userid
    public static function getIoaUserid($eid, $sguid)
    {
        Redis::hGet(CACHE_REDIS_IOA_PRE . $eid . $sguid, 'ioauserid');
    }

    public static function setIoaorgid($eid,$orgid){
        Redis::hSet(CACHE_REDIS_IOA_PRE . $eid , 'ioaorgid', $orgid);
    }

    public static function getIoaorgid($eid){
        Redis::hGet(CACHE_REDIS_IOA_PRE . $eid , 'ioaorgid');
    }

    public static function setIoaCenterDisk($eid,$val){
        Redis::hSet(CACHE_REDIS_ORG_PRE . $eid , 'disk_set', $val);
    }

    public static function getIoaCenterDisk($eid){
        Redis::hGet(CACHE_REDIS_ORG_PRE . $eid , 'disk_set');
    }

    public static function setSguidMapEidUserid( $sguid,$eid,$userid ){
        Redis::hSet(CACHE_REDIS_IOA_PRE . $sguid , 'ioaeiduserid', $eid.':'.$userid);
    }

    public static function getSguidMapEidUserid( $sguid ){
        Redis::hGet(CACHE_REDIS_IOA_PRE . $sguid , 'ioaeiduserid');
    }

    public static function updateEpMemo($eid, $sguid, $memo)
    {
        $epinfo = Redis::hGet(CACHE_REDIS_EP_PRE . $eid . $sguid, 'ep_info');
        $epinfo = json_decode($epinfo, true);
        $epinfo['memo'] = $memo;
        Redis::hSet(CACHE_REDIS_EP_PRE . $eid . $sguid, 'ep_info', json_encode($epinfo));
    }
    public static function getOSStatistics($eid)
    {
        return Redis::hGetAll(CACHE_REDIS_OSSTAT_PRE . $eid);
    }

    public static function getXavStatistics($eid)
    {
        return Redis::hGetAll(CACHE_REDIS_XAVCOUNT_PRE . $eid);
    }

    public static function getEpOnline($eid)
    {
        return Redis::hGetAll(CACHE_REDIS_ONLINESTATE_PRE . $eid);
    }

    public static function getEpLastlogintime($eid, $systype, $sguid)
    {
        return Redis::hGet(CACHE_REDIS_ONLINESTATE_PRE . $eid, $systype . ':' . $sguid);
    }

    /**
     * 更新客户端在线状态
     * 当前时间+心跳周期=过期时间
     */
    public static function setEPOffLineTime($eid, $field, $value)
    {
        Redis::hSet(CACHE_REDIS_ONLINESTATE_PRE . $eid, $field, $value);
    }

    public static function getClientPerilStatistics($type, $eid, $date)
    {
        return Redis::sCard($type . ':' . $eid . ':' . $date);
    }

    public static function removeClient($sguids, $eid)
    {
        foreach ($sguids as $sguid) {
            $epKey = CACHE_REDIS_EP_PRE . $eid . $sguid;
            Redis::del($epKey);
            $cmdKey = CACHE_REDIS_EP_CMD_PRE . $eid . $sguid;
            Redis::del($cmdKey);
        }
    }

    public static function getRfwValue($type,$eid,$date)
    {
        ///echo '=='.$type .':' . $eid.':'.$date;
        return Redis::hGet($type .':' . $eid.':'.$date,$type);
    }

    public static function getFlowValue($key,$field)
    {
        return Redis::hGet($key,$field);
    }

    public static function getFlowTopRange($key,$start,$length)
    {
        return Redis::zRevRange($key,$start,$length,true);
    }

    public static function getEpName($eid, $sguid)
    {
        $epinfo = Redis::hGet(CACHE_REDIS_EP_PRE . $eid . $sguid, 'ep_info');
        $epinfo = json_decode($epinfo, true);
        $memo =$epinfo['memo'];
        if(isset($memo)){
            return $memo;
        }
        $computerName = $epinfo['computername'];
        if(isset($computerName)){
            return $computerName;
        }
        return $sguid;
    }

    //操作系统对应的客户端数量
    public static function addClientCountByOs($eid,$filed,$count)
    {
        Redis::hIncrBy(CACHE_REDIS_OSSTAT_PRE.$eid,$filed,$count);
    }

    //添加客户端操作系统类型
    public static function addClientOs($eid,$score,$sguid)
    {
        Redis::zAdd('Ostype:'.$eid,$score,$sguid);
    }
    //删除操作系统对应的客户端数量和客户端数
    public static function delClient_hosstat_os($eid)
    {
        Redis::del(CACHE_REDIS_OSSTAT_PRE.$eid);
    }

    //添加客户端位置
    public static function addClientLoc($eid,$sguid,$lng,$lat,$date)
    {
       // Redis::hSet('EplastLocate:'.$eid,$sguid,'ps:'.$lng.':'.$lat.'pe:'.$date);
    }

    //威胁终端企业对应的sguid
    public static function addClientWSguids($eid,$type,$date,$sguid,$overTime)
    {
        Redis::sAdd($type . ':' . $eid . ':' . $date,$sguid);
        Redis::expire($type . ':' . $eid . ':' . $date,$overTime);
    }
    //删除终端威胁统计结果
    public static function delClientW($eid,$date)
    {
        foreach(['wv','wu','wh','wn'] as $type){
            Redis::del($type . ':' . $eid . ':' . $date);
        }
    }

    //病毒次数统计
    public static function addXavTimes($eid,$virusclass,$date,$count,$overTime)
    {
        $key=CACHE_REDIS_XAVCOUNT_PRE.$eid;
        $filed='v'.$virusclass.':'.$date;
        Redis::hIncrBy($key,$filed,$count);
        Redis::expire($key,$filed,$overTime);
    }

    //病毒文件统计
    public  static function addXavFileCount($eid,$virusclass,$date,$count,$overTime)
    {
        $key=CACHE_REDIS_XAVCOUNT_PRE.$eid;
        $filed='v:'.$virusclass.':'.$date;
        Redis::hIncrBy($key,$filed,$count);
        Redis::expire($key,$filed,$overTime);
    }

    //删除病毒统计
    public static function delXav($eid)
    {
        $key=CACHE_REDIS_XAVCOUNT_PRE.$eid;
        Redis::del($key);

    }


    //恶意网址分类数量统计
    public static function addRfwUrlByResult($eid,$result,$date,$count,$overTime)
    {
        $key='ui:'.$eid.':'.$date;
        Redis::hIncrBy($key,$result,$count);
        Redis::expire($key,$overTime);
    }
    //删除恶意网址分类数量统计结果
    public static function delRfwUrlByResult($eid,$date)
    {
        Redis::del('ui:'.$eid.':'.$date);
    }

    //今日流量eid=>[sguid1,sguid2]
    public static function addRfwTFASguid($eid,$sguid,$date,$score,$overTime)
    {
        Redis::zIncrBy('sf:'.$eid.':'.$date,$score,$sguid);
        Redis::expire('sf:'.$eid.':'.$date,$overTime);
    }

    //骚扰拦截
    public function addPhoneSpam($eid,$type,$date,$count,$overTime)
    {
        $key=$type .':' . $eid.':'.$date;
        Redis::hIncrBy($key,$type,$count);
        //self::getRfwValue($type,$eid,$date);
        Redis::expire($key,$overTime);
    }
    //删除骚扰拦截
    public function delPhoneSpam($eid,$type,$date)
    {
        Redis::del($type .':' . $eid.':'.$date);
    }

    //违规联网
    public function addRfwBNS($eid,$type,$date,$count,$overTime)
    {
        $key=$type .':' . $eid.':'.$date;
        Redis::hIncrBy($key,$type,$count);
        Redis::expire($key,$overTime);
    }
    public function delRfwBNS($eid,$type,$date)
    {
        Redis::del($type .':' . $eid.':'.$date);
    }

    //今日流量sguid=>流量数
    public static function addRfwTFABySguid($eid,$sguid,$upOrdown,$date,$count,$overTime)
    {
        Redis::hincrByFloat('sf:'.$eid.':'.$date.$upOrdown,$sguid.$upOrdown,$count);
        //print_r(Redis::hGetAll('sf:'.$eid.':'.$date.$upOrdown));
        Redis::expire('sf:'.$eid.':'.$date.$upOrdown,$overTime);
    }

    //删除今日流量
    public static function delRfwTFA($key)
    {
        Redis::del($key);
    }

    //获取指定企业的客户端数量
    public static function getClientCountByEID($eid)
    {
        $key=CACHE_REDIS_EP_PRE . $eid.'*';
        $keys=Redis::keys($key);
        return count($keys);
    }

    //获取指定企业在线客户端数
    public static function getClientOnlineCountByEID($eid)
    {
        $onlineCount=0;
        $eps = RedisDataManager::getEpOnline($eid);
        foreach($eps as $os=>$time){
            if(mb_strlen($os)>20){
                $onlineCount+=($time >= time());
            }
        }
        return $onlineCount;
    }

    //根据系统类型获取客户端数
    public static function getSguidCountByOSType($ostypeKey)
    {
        $result=Redis::zRange($ostypeKey, 0, -1, true);
        return array_sum($result);
    }
}
