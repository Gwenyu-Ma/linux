<?php

use \Lib\Store\Redis as rds;

/**
 * 策略的获取
 */
Class Policy
{
    private $header;
    private $is_delete_policy = false;//是否要下发清除策略
    private $policy_arr;

    public function __construct($header)
    {
        $this->header = $header;
    }

    /**
     * 获取服务器端对已分组或客户端应该设置策略流水号信息
     */
    public function getVer()
    {
        $policy_ver = "";
        $sguid = $this->header->sguid;
        $eid = $this->header->eid;
        if (rds::hExists(CACHE_REDIS_EP_PRE . $eid . $sguid, 'p_ver')) {
            $policy_ver = rds::hGet(CACHE_REDIS_EP_PRE . $eid . $sguid, 'p_ver');
        } else {
            $policy_ver = $this->getClientVer();
        }

        return $policy_ver;
    }

    /**
     * 获取客户端上报的策略流水号
     * @return string
     */
    public function getClientVer()
    {
        if (!isset($this->header->pstamp) || $this->header->pstamp == "") {
            $npstamp = "0";
        } else {
            $npstamp = $this->header->pstamp;
        }
        return $npstamp;
    }

    /**
     * 查找全网策略
     * @return [type] [description]
     */
    public function getAllNetPolicy()
    {
        $allNetPolicy = array();
        $eid = $this->header->eid;
        if (rds::hExists(CACHE_REDIS_ORG_PRE . $eid, 'p_global')) {
            $allNetPolicy = json_decode(rds::hGet(CACHE_REDIS_ORG_PRE . $eid, 'p_global'), true);
        }
        return $allNetPolicy;
    }

    /**
     * 查找组策略
     * @return array
     */
    public function getGroupPolicy()
    {
        $eid = $this->header->eid;
        $sguid = $this->header->sguid;

        $groupPolicy = array();
        //查询组guid，如果没有组guid返回空
        $goupid = "";
        if (rds::hExists(CACHE_REDIS_EP_PRE . $eid . $sguid, 'g_info')) {
            $goupid = rds::hGet(CACHE_REDIS_EP_PRE . $eid . $sguid, 'g_info');
        } else {
            return $groupPolicy;
        }

        if (rds::hExists(CACHE_REDIS_ORG_PRE . $eid, "p_group_" . $goupid)) {
            $groupPolicy = json_decode(rds::hGet(CACHE_REDIS_ORG_PRE . $eid, "p_group_" . $goupid), true);
        }

        return $groupPolicy;
    }

    /**
     * 查找客户端策略
     * @return array
     */
    public function getClientPolicy()
    {
        $sguid = $this->header->sguid;
        $eid = $this->header->eid;
        $clientPolicy = array();
        if (rds::hExists(CACHE_REDIS_EP_PRE . $eid . $sguid, 'p_info')) {
            $clientPolicy = json_decode(rds::hGet(CACHE_REDIS_EP_PRE . $eid . $sguid, 'p_info'), true);
        }
        return $clientPolicy;
    }

    /**
     * 获取全网策略、组策略及客户端策略
     * @return array
     */
    public function getPolicyInfo()
    {
        $policy_arr = $allpolicy = $allpolicy = $allpolicy = array();
        $allpolicy = $this->getAllNetPolicy();
        $grouppolicy = $this->getGroupPolicy();
        $clientpolicy = $this->getClientPolicy();
        $policy_arr = array(
            'allpolicy' => $allpolicy,
            'grouppolicy' => $grouppolicy,
            'clientpolicy' => $clientpolicy
        );

        return $policy_arr;
    }

    /**
     * 获取所有策略
     * @return array
     */
    public function getAllPolicy()
    {
        $policy_ver = $this->getVer();//服务器端，对已分组或客户端应该设置策略流水号信息
        $npstamp = $this->getClientVer();//客户端上报的客户端策略流水号
        $this->policy_arr = array();
        if (!empty($policy_ver)) {
            //查找策略缓存
            if (floatval($policy_ver) != floatval($npstamp)) {
                $this->policy_arr = $this->getPolicyInfo();
            }
        }
        return $this->policy_arr;
    }

    /**
     * 是否清除客户端所有策略
     * @return bool
     */
    public function isDeletedPolicy()
    {
        if (!empty($this->policy_arr)) {
            $allpolicy = $this->policy_arr['allpolicy'];
            $grouppolicy = $this->policy_arr['grouppolicy'];
            $clientpolicy = $this->policy_arr['clientpolicy'];
            if (empty($allpolicy) && empty($grouppolicy) && empty($clientpolicy)) {
                $this->is_delete_policy = true;
            }
        }
        return $this->is_delete_policy;
    }
}