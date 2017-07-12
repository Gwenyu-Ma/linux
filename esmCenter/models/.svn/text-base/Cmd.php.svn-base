<?php
use \Lib\Model\RedisDataManager;
use Lib\Util\Common as UCommon;
use Lib\Store\LogsMysql as MC;
use Lib\Model\Cmd;
use ChromePhp as Console;

class CmdModel
{
    private $_eid;

    public function __construct()
    {
        $this->cmdinfo = select_manage_collection('cmdinfo');
        $this->epinfo = select_manage_collection('epinfo');
    }

    public function __destruct()
    {
    }

    private $logDict = [
        'quickscanstart' => 3002,
        'quickscanstop' => 3002,
        'allscanstart' => 3003,
        'allscanstop' => 3003,
        'filemonopen' => 3001,
        'filemonclose' => 3001,
        'mailmon:open' => 3001,
        'mailmon:close' => 3001,
        '0x4001' => 5001,
        'update' => 2001,
        'repair' => 2001,
        'msg' => 2002,
        'rfwurl.virus:open' => 4001,
        'rfwurl.virus:close' => 4001,
        'rfwurl.antifish:open' => 4001,
        'rfwurl.antifish:close' => 4001,
        'rfwurl.evildown:open' => 4001,
        'rfwurl.evildown:close' => 4001,
        'rfwurl.xss:open' => 4001,
        'rfwurl.xss:close' => 4001,
        'rfwurl.search:open' => 4001,
        'rfwurl.search:close' => 4001,
        'rfwiprule.rs:open' => 4001,
        'rfwiprule.rs:close' => 4001,
        'rfwurl.adfilter:open' => 4001,
        'rfwurl.adfilter:close' => 4001,
        'rfwsharmon:open'=>4001,
        'rfwsharmon:close'=>4001,
    ];

    /**
     * *
     *
     * @param $param_data $grouptype
     *            0|全网命令 1|组命令 2|客户端命令
     */
    public function editCmd($param_data, $eid)
    {
        $grouptype = intval($param_data['grouptype']);
        $objIds = [];
        $groupId = '';
        switch ($grouptype) {
            case 0:
                $objIds[$eid] = GroupModel::getClientSGuidArr($eid, $eid, 0);
                break;
            case 1:

                foreach ($param_data['objIds'] as $objId) {
                    $groupId = $objId;
                    $objIds[$objId] = GroupModel::getClientSGuidArr($eid, $objId, 1);
                }
                break;
            case 2:
                foreach ($param_data['objIds'] as $objId) {
                    $objIds[$objId] = [$objId];
                }
                break;
            default:
                break;
        }
        $uid = $param_data['uid'];
        $userName = $param_data['userName'];
        $cmdid = $param_data['cmdid'];

        $cmdArr = $this->getCmdInfo($cmdid, $param_data['cmdData']);
        if (!$cmdArr) {
            return ['msg' => '无效命令'];
        }

        $c_ver = Common::getMicroTime();

        $edate = date("Y-m-d H:i:s");

        $content = array(
            'id' => '',
            'eid' => $eid,
            'productid' => $cmdArr['productId'], //$productid,
            'grouptype' => $grouptype,
            'cmdobject' => '',
            'cmdid' => $cmdid,
            'cmdjson' => $cmdArr['cmdStr'],
            'edate' => $edate,
            'c_ver' => $c_ver,
            'uid' => $uid,
            'userName' => $userName,
        );

        if (count($objIds) <= 0) {
            return true;
        }
        MC::begin();
        $errorMsg = '成功';
        $isSuccess='成功';
        try {
            $content['grouptype'] = $grouptype;
            $content['id'] = Common::getNewGuid();
            $content['cmdobject'] = $groupId;
            $this->insertToCMDInfo($eid, $content);
            foreach ($objIds as $key => $value) {
                foreach ($value as $sguid) {
                    $content['grouptype'] = 2;
                    $content['cmdobject'] = $sguid;

                    $this->insertToCMDIssuedState($eid, $content);
                    RedisDataManager::addCMD($content);
                    //更新客户端表命令版本
                    $this->updateClientCMDVer($eid, $sguid, 2, $c_ver);
                }
            }
            MC::commit();
        } catch (Exception $ex) {
            $isSuccess='失败';
            $errorMsg = $ex->getMessage();
            MC::rollback();
            return ['msg'=>'发送消息失败'];
        } finally {
            add_oplog(1, $this->logDict[$cmdid], json_encode($param_data['objects']), strcasecmp($cmdid, 'msg') == 0 ? $param_data['cmdData'] :  $cmdArr['cmdStr'], null, $errorMsg,$cmdArr['desc'].$isSuccess);
        }
        return true;
    }


    /**
     * 更新客户端表命令版本
     */
    private function updateClientCMDVer($eid, $objId, $grouptype, $c_ver)
    {
        $where = [];
        switch ($grouptype) {
            case 0:
                $where = array(
                    'eid' => $eid,
                );
                break;
            case 1:
                $where = array(
                    'eid' => $eid,
                    'groupid' => intval($objId),
                );
                break;
            case 2:
                $where = ['eid' => $eid, 'sguid' => $objId];
                break;
            default:
                break;
        }
        $result = $this->epinfo->update($where, ['$set' => ['cstamp' => $c_ver]], ['multiple' => true]);
        if (is_array($result) && $result['ok'] == 1) {
            // $clientArr=$this->epinfo->find($where,['sguid'=>true]);
            // foreach ($clientArr as $client) {
            //     UCommon::writeKafka($eid,[
            //         'eid'=>$eid,
            //         'sguid'=>$client['sguid'],
            //         'cstamp'=>$c_ver,
            //         'logtype'=>'epinfo',
            //         'optype'=>'u'
            //     ]);
            // }
            return true;
        }
        return false;
    }

    public function getCmdType($str)
    {
        $arr = array(
            'quickscan',
            'allscan',
            'filemon',
            'mailmon',
        );
        for ($i = 0; $i < count($arr); $i++) {
            $res = strpos($str, $arr[$i]);
            if ($res) {
                $num = $i;
            }
        }
        if ($num >= 2) {
            return 4;
        } else {
            return 1;
        }
    }

    public function removeCmds($objIds, $groupType, $eid)
    {
        $objIds = array_map(function ($item) {
            return strval($item);
        }, $objIds);
        $result = $this->cmdinfo->remove(array(
            'eid' => $eid,
            'cmdobject' => ['$in' => $objIds],
            'grouptype' => intval($groupType),
        ));
        return is_array($result) && $result['ok'] == 1;
    }

    /**
     * 获取指定命令对应的命令信息
     * @param  [int] $cmdId [命令id]
     * @return [false/array] bool:false/['cmdType'=>int,'cmdJson'=>'string']       [description]
     */
    private function getCmdInfo($cmdId, $cmdData = null)
    {
        if (empty($cmdId)) {
            return false;
        }
        $cmdInfo = Cmd::$CmdDict[$cmdId];
        if (strcasecmp($cmdId, 'msg') == 0) {
            $cmdInfo['cmdStr'] = sprintf($cmdInfo['cmdStr'], $cmdData);
        }
        return $cmdInfo;
    }

    private function insertToCMDInfo($eid, $cmdObj)
    {
        $tb = 'CMDInfo_' . $eid;
        $sql = 'insert into ' . $tb . ' values(:cmdid,:eid,:pid,:uid,:uname,:ugtype,:cobj,:cjson,:ac,:edate)';
        MC::exec($sql, [
            ':cmdid' => $cmdObj['id'],
            ':eid' => $cmdObj['eid'],
            ':pid' => $cmdObj['productid'],
            ':uid' => $cmdObj['uid'],
            ':uname' => $cmdObj['userName'],
            ':ugtype' => $cmdObj['grouptype'],
            ':cobj' => $cmdObj['cmdobject'],
            ':cjson' => $cmdObj['cmdjson'],
            ':ac' => $cmdObj['cmdid'],
            ':edate' => $cmdObj['edate']
        ]);
    }

    private function insertToCMDIssuedState($eid, $cmdObj)
    {
        $tb = 'CMDIssuedState_' . $eid;
        MC::exec('insert into ' . $tb . ' (cmdid,eid,sguid,state,result,edate) values(:cmdid,:eid,:sguid,:state,:result,:edate)', [
            ':cmdid' => $cmdObj['id'],
            ':eid' => $cmdObj['eid'],
            ':sguid' => $cmdObj['cmdobject'],
            ':state' => 0,
            ':result' => 0,
            ':edate' => $cmdObj['edate']
        ]);
    }

    public function part($eid, $query)
    {
        $wh = '1=1';
        $ere = [];
        $wh1 = '1=1';
        $orderby = '';
        $sort = '';
        $offset = 0;
        $limit = 10;
        foreach ($query as $k => $v) {
            if ($k === 'view') {
                continue;
            }
            if ($k === 'orderby') {
                $orderby = "order by $v";
                continue;
            }
            if ($k === 'sort') {
                if (!in_array($v, ['asc', 'desc'])) {
                    $v = 'asc';
                }
                $sort = $v;
                continue;
            }
            if ($k === 'offset') {
                $offset = intval($v);
                continue;
            }
            if ($k === 'limit') {
                $limit = intval($v);
                continue;
            }

            if ($k === 'stime') {
                $wh .= " and edate>= ?";
                $ere[] = $v;
                continue;
            }
            if ($k === 'etime') {
                $wh .= " and edate< ?";
                $ere[] = $v;
                continue;
            }
            if ($k === 'action') {
                $wh .= " and action in ($v)";
                continue;
            }
            if (in_array($k, ['yixiafa', 'daixiafa', 'chaoshi', 'zhixingchenggong', 'zhixingshibai', 'weizhixing',])) {
                $wh1 .= " and $k$v";
                continue;
            }

            $wh .= " and $k=?";
            $ere[] = $v;
        }
        if (empty($sort) || empty($orderby)) {
            $orderby = '';
            $sort = '';
        }

        $sql = <<<SQL
select * from
    (select cmdid,edate,action,grouptype,cmdobject,cmdjson,groupname,computername,memo,
    sum(case when state=0 then 1 else 0 end) as daixiafa,
    sum(case when state=1 then 1 else 0 end) as yixiafa,
    sum(case when state=2 then 1 else 0 end) as chaoshi,
    sum(case when result=0 then 1 else 0 end) as weizhixing,
    sum(case when result=1 then 1 else 0 end) as zhixingchenggong,
    sum(case when result=2 then 1 else 0 end) as zhixingshibai
    from
        (select t.*,e.groupid,e.groupname,e.ip,e.computername,e.memo from epinfo_$eid as e right join
            (select b.cmdid,b.edate,b.action,b.grouptype,b.cmdobject,b.cmdjson,a.state,a.result,a.sguid from CMDIssuedState_$eid as a left join CMDInfo_$eid as b on a.cmdid=b.cmdid
            ) as t
        on e.sguid=t.sguid
        ) as t
    where $wh group by cmdid
    ) as t
where $wh1 $orderby $sort limit $offset,$limit
SQL;
        Console::log($sql, $ere);
        $sql1 = <<<SQL
select count(1) from
    (select cmdid,edate,action,grouptype,cmdobject,cmdjson,groupname,computername,
    sum(case when state=0 then 1 else 0 end) as daixiafa,
    sum(case when state=1 then 1 else 0 end) as yixiafa,
    sum(case when state=2 then 1 else 0 end) as chaoshi,
    sum(case when result=0 then 1 else 0 end) as weizhixing,
    sum(case when result=1 then 1 else 0 end) as zhixingchenggong,
    sum(case when result=2 then 1 else 0 end) as zhixingshibai
    from
        (select t.*,e.groupid,e.groupname,e.ip,e.computername from epinfo_$eid as e right join
            (select b.cmdid,b.edate,b.action,b.grouptype,b.cmdobject,b.cmdjson,a.state,a.result,a.sguid from CMDIssuedState_$eid as a left join CMDInfo_$eid as b on a.cmdid=b.cmdid
            ) as t
        on e.sguid=t.sguid
        ) as t
    where $wh group by cmdid
    ) as t
where $wh1
SQL;

        return array(
            'rows' => MC::getAll($sql, $ere),
            'total' => MC::getCell($sql1, $ere),
        );
    }

    public function expand($eid, $query)
    {
        //MC::$eid = $eid;
        //for($i=0;$i<60;$i++){
        //MC::exec("insert into $tb values('2016-01-01 01:01:$i','$eid','$i','$i','2016-01-01 01:01:$i','$i','$i','$i','$i','$i','$i','$i','$i','$i','$i','$i','$i')");
        //}

        $wh = '1=1';
        $ere = [];
        $orderby = '';
        $sort = '';
        $offset = 0;
        $limit = 10;
        foreach ($query as $k => $v) {
            if ($k === 'view') {
                continue;
            }
            if ($k === 'orderby') {
                $orderby = "order by $v";
                continue;
            }
            if ($k === 'sort') {
                if (!in_array($v, ['asc', 'desc'])) {
                    $v = 'asc';
                }
                $sort = $v;
                continue;
            }
            if ($k === 'offset') {
                $offset = intval($v);
                continue;
            }
            if ($k === 'limit') {
                $limit = intval($v);
                continue;
            }

            if ($k === 'stime') {
                $wh .= " and edate>= ?";
                $ere[] = $v;
                continue;
            }
            if ($k === 'etime') {
                $wh .= " and edate<= ?";
                $ere[] = $v;
                continue;
            }
            $wh .= " and $k=?";
            $ere[] = $v;
        }
        if (empty($sort) || empty($orderby)) {
            $orderby = '';
            $sort = '';
        }

        $sql = <<<SQL
select * from
    (select e.groupid,e.groupname,e.ip,e.computername,e.memo,a.* from CMDIssuedState_$eid as a left join epinfo_$eid as e on a.sguid=e.sguid
    ) as t
where $wh $orderby $sort limit $offset,$limit
SQL;
        Console::log($sql, $ere);
        $sql1 = <<<SQL
select count(1) from
    (select e.groupid,e.groupname,e.ip,e.computername,a.* from CMDIssuedState_$eid as a left join epinfo_$eid as e on a.sguid=e.sguid
    ) as t
where $wh
SQL;

        return array(
            'rows' => MC::getAll($sql, $ere),
            'total' => MC::getCell($sql1, $ere),
        );
    }
}
