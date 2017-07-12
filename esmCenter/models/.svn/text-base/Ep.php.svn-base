<?php
use Lib\Model\RedisDataManager;
use Lib\Util\Common as UCommon;
use Lib\Store\LogsMysql as LogsDB;

class EpModel
{
    public function __construct()
    {
    }

    public function getEP($eid, $sguid)
    {
        $sql="select * from epinfo_$eid where sguid=?";
        $ep=LogsDB::getRow($sql,[$sguid]);
        $model = new GroupModel();
        foreach ($ep['productinfo'] as &$v) {
            $pdt = $this->pdt->findOne(['guid' => $v['guid']]);
            $v['name'] = $pdt['name'];
            $v['codename'] = $pdt['codename'];
            $v['version'] = $pdt['version'];
        }
        $ep['onlinestate'] = $ep['unset'] == 1 ? 2 : $model->getClientOnlineState($eid, $sguid, $ep['systype']);
        return $ep;
    }

    public function setMemo($eid, $sguid, $memo, $oObj)
    {
        $sql="update epinfo_$eid set memo=? where sguid=?";
        $object=[ep=>[['guid'=>$oObj['guid'],'name'=>$oObj['cName']]]];
        $desc=sprintf('修改终端%s备注为%s', $oObj, $memo);
        try
        {
            LogsDB::exec($sql, [$memo,$sguid[0]]);
        }
        catch(\Exception $e)
        {
            add_oplog(2, 2007, $object, $oObj['oldMemo'], $memo, '失败', $desc.'失败');
            return false;
        }

        foreach ($sguid as $item) {
            RedisDataManager::updateEpMemo($eid, $item, $memo);
            UCommon::writeRabbitMq($eid, [
                'eid' => $eid,
                'sguid' => $item,
                'memo' => $memo,
                'logtype' => 'epinfo',
                'optype' => 'u',
            ]);
        }
        add_oplog(2, 2007, $object, $oObj['oldMemo'], $memo, '成功', $desc.'成功');
        return true;
    }

    /*
     * 获取客户端授权数
     * @param  [type] $eid [description]
     * @return [type]      [description]
     */
    public function clientAccreditStatus($eid)
    {

        $groupInfo   = LogsDB::getCell("SELECT id FROM groupinfo_$eid where type=2 and eid='$eid'");
        $NumCount = LogsDB::getRow("SELECT IFNULL(sum(case when systype='android' then 1   else 0 end), 0) as android,
                                    IFNULL(sum(case when systype='linux' then 1   else 0 end), 0) as linux,
                                    IFNULL(sum(case when systype='windows' then 1   else 0 end), 0) as windows
                                    FROM epinfo_$eid
                                    where unset = 0
                                    and eid='$eid'
                                    and groupid in (".$groupInfo.")");
        return [
            "total" => 0,//$linuxCount + $androidCount + $winCount,
            "useCount" => $NumCount['android'] + $NumCount['linux'] + $NumCount['windows'],
            "androidCount" => $NumCount['android'],
            "linuxCount" => $NumCount['linux'],
            "winCount" => $NumCount['windows'],
        ];
    }

    public function delEP($eid, $sguids)
    {
        $result = $this->ep->remove(['eid' => $eid, 'sguid' => ['$in' => $sguids]]);
        foreach ($sguids as $sguid) {
            UCommon::writeRabbitMq($eid, [
                'eid' => $eid,
                'sguid' => $sguid,
                'logtype' => 'epinfo',
                'optype' => 'd',
            ]);
        }

        return is_array($result) && $result['ok'] == 1;
    }

    //删除客户端
    public function removeEP($eid, $sguids)
    {
        //清理策略表
        (new PolicyModel())->removePolicys($sguids, 2, $eid);
        //清理命令表
        (new CmdModel())->removeCmds($sguids, 2, $eid);
        //清理redis缓存
        RedisDataManager::removeClient($sguids, $eid);
        //清理mysql
        foreach ($sguids as $sguid) {
            LogsDB:exec(sprintf("CALL drop_client_alldatas('%s','%s')", $eid, $sguid));
        }
        //清理epinfo表
        $this->delEP($eid, $sguids);
        return true;
    }

    public function getUnsetEPs()
    {
        $eps = $this->ep->find(['unset' => 1], ['eid'=>true,'sguid' => true]);
        //$eps = Common::mongoResultToArray($eps);
        //print_r($eps);
        foreach ($eps as $v) {
            $eid = $v['eid'];
            $sguid = $v['sguid'];
            LogsDB::exec("UPDATE epinfo_$eid SET unset=1 where eid='$eid' and sguid = '$sguid'");
        }
    }

    public function getEPVersionStatistics($eid)
    {
        $version = '';
        $result=array();
        $count=0;
        $sql="select version,sguid,systype,unset,eid from epinfo_$eid ORDER BY version DESC";
        $rows=LogsDB::getAll($sql);
        
        $group=new GroupModel();
        foreach ($rows as $row) {
            $version = $count>= 3 ? '其它' : $row['version'];
            @$result[$version]['count'] += $group->getClientOnlineState($row['eid'], $row['sguid'], $row['systype'], $row['unset'])==1 ? 1:0;
            @$result[$version]['total']+=1;
            $count=count($result);
        }
        return $result;
    }
}
