<?php

use \Lib\Store\Redis as rds;
use \Lib\Util\Common as UCommon;
/**
 * 全网命令的操作类
 *
 */
class Command
{
    private $redis;
    private $header;

    public function __construct($header)
    {
        $this->header = $header;

//		$redisobj = new Redis();
//		$redisobj->connect(SGUID_REDIS_HOST, SGUID_REDIS_PORT);
//		$redisobj->select(SGUID_REDIS_DB);
//		$this->redis = $redisobj;
    }

    /**
     * 获取客户端已分组或入组时间流水号时间信息
     */
    public function getVer()
    {
        $cmd_ver = "";
        $sguid = $this->header->sguid;
        $eid = $this->header->eid;
        if (rds::hExists(CACHE_REDIS_EP_PRE .$eid. $sguid, 'c_ver')) {
            $cmd_ver = rds::hGet(CACHE_REDIS_EP_PRE .$eid. $sguid, 'c_ver');
        } else {
            $cmd_ver = $this->getClientVer();
        }
        return $cmd_ver;
    }

    public function getClientVer()
    {
        if (!isset($this->header->cstamp) || $this->header->cstamp == "") {
            $ncstamp = "0";
        } else {
            $ncstamp = $this->header->cstamp;
        }
        return $ncstamp;
    }

    /**
     * 获取全网命令
     */
    public function getAllCommand()
    {
        $allcmd = array();
        $sguid = $this->header->sguid;
        $eid = $this->header->eid;

//		//判断key是否存在
//		if (!rds::exists(CACHE_REDIS_EP_CMD_PRE . $sguid)) {
//			return null;
//		}

        $lsize = rds::lLen(CACHE_REDIS_EP_CMD_PRE . $eid . $sguid);
        if ($lsize < 1) {
            return null;
        }

        $cmd_ver = $this->getVer();
        $ncstamp = $this->getClientVer();

        if ($cmd_ver == $ncstamp) {
            return $allcmd;
        }

        while (rds::lLen(CACHE_REDIS_EP_CMD_PRE . $eid . $sguid) > 0) {
            $cmd = rds::rPop(CACHE_REDIS_EP_CMD_PRE . $eid . $sguid);
            if (!rds::exists($cmd)) {
                //unset($allcmdids[$i]);
                continue;
            }

            array_push($allcmd, json_decode(rds::get($cmd)));

            $cmdid = str_replace(CACHE_REDIS_CMD_PRE.$eid,'',$cmd);
            $this->updateCmdState($eid,$sguid,$cmdid);
        }

        return $allcmd;
    }

    private function updateCmdState($eid,$sguid,$cmdid){
        UCommon::writeKafka($eid, [
            'eid' => $eid,
            'sguid' => $sguid,
            'cmdid'=>$cmdid,
            'state'=>1,
            'edate'=>date("Y-m-d H:i:s"),
            'logtype' => 'CMDIssuedState',
            'optype' => 'u'
        ]);
    }
//	public function getAllCommand()
//	{
//		$allcmd = array();
//		$sguid = $this->header->sguid;
//		//$eid = $this->header->eid;
//
////		//判断key是否存在
////		if (!rds::exists(CACHE_REDIS_EP_CMD_PRE . $sguid)) {
////			return null;
////		}
//
//		$lsize = rds::lLen(CACHE_REDIS_EP_CMD_PRE . $sguid);
//		if ($lsize < 1) {
//			return null;
//		}
//
//		$cmd_ver = $this->getVer();
//		$ncstamp = $this->getClientVer();
//
//		$allcmdids = rds::lRange(CACHE_REDIS_EP_CMD_PRE . $sguid, 0, $lsize - 1);
//
//		foreach ($allcmdids as $i => $value) {
//
//			if (!rds::exists($allcmdids[$i])) {
//				//unset($allcmdids[$i]);
//				continue;
//			}
//
//			if ($cmd_ver <= $ncstamp) {
//				continue;
//			}
//
//			$allcmd[] = json_decode(rds::get($allcmdids[$i]));
//		}
//		//清除List中所有数据
//		rds::del(CACHE_REDIS_EP_CMD_PRE . $sguid);
//		return $allcmd;
//	}
}

