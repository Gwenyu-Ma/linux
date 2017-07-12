<?php
use \Lib\Store\Redis;
use Lib\Util\Common as UCommon;
use Lib\Store\LogsMysql as LogsDB;
use Lib\Util\logs;
use Lib\Model\RedisDataManager;

class GroupModel
{
    /**
     * 添加一个组
     * @param $name 组名称
     * @param $desp 组描述
     * @return bool
     */
    public function insertGroup($eid, $name, $desp)
    {
        $ok = $this->AddGroup($name, $desp, $eid, 1);
        $isOk =is_bool($ok) && $ok;
        return $isOk ? ['msg' => '失败']:true;
    }

    /**
     * @param $id
     * @param $name
     * @param string $desp
     * @return bool
     */
    public function editGroup($eid, $id, $name, $desp = '')
    {
        //修改组名称
        $edate =date('Y-m-d H:m:s',time());
        $sql = "UPDATE groupinfo_$eid SET groupname='$name',description='$desp',edate='$edate' WHERE id=$id";
        LogsDB::exec($sql);
        logs::logInfo('编辑组'.$res['groupname']."为$name成功");

        //写mq
        $data = [
            'eid' => $eid,
            'id' => intval($id),
            'groupname' => $name,
            'description' => $desp,
            'edate' => time(),
        ];
        $data['logtype'] = 'groupinfo';
        //"optype"的值可以为"i"代表插入，"u"代表修改,"d"代表删除
        $data['optype'] = 'i';
        UCommon::writeRabbitMq($data);

        //修改客户端信息中的组名称
        $update_sql = "UPDATE epinfo_$eid SET groupname='$name' WHERE groupid=$id";
        LogsDB::exec($update_sql);

        //写mq
        $select_sql = "SELECT sguid FROM epinfo_$eid WHERE groupid=$id";
        $result = LogsDB::getAll($select_sql);
        foreach ($result as $client) {
            $data = [
                'eid' => $eid,
                'sguid' => $client['sguid'],
                'groupname' => $name,
            ];
            $data['logtype'] = 'epinfo';
            $data['optype'] = 'u';
            UCommon::writeRabbitMq($data);
        }
        return true;

    }

    /**
     * 删除组
     * 前提：默认组不能被删除
     *
     * 1.将该组下所有客户端移动到默认组下，并更新客户端策略版本
     * 2.删除该组
     * 3.删除该组的策略
     * 4.更新redis
     *
     * @param string $groupId 组id
     * @param string $eid 企业id
     * @param string $gName 组名称
     * @return true [msg=>'']
     **/
    public function DelGroup($groupId, $eid,$gName)
    {
        $obj=json_encode(['group'=>[['guid'=>$groupId,'name'=>$gName]]]);
        $desc=sprintf('删除组%s',$gName);
        //系统默认组不可删除
        $groupType = $this->getGroupType($eid, $groupId);
        if ($groupType != 1) {
            logs::logError('系统默认组不可删除'.$desc.'失败');
            return ['msg' => '系统默认组不可删除'];
        }

        //获取默认组
        $defaultGroup = $this->getDefaultGroupName($eid);
        if (empty($defaultGroup)) {
            logs::logError('找不到默认组'.$desc.'失败');
            return ['msg' => '找不到默认组'];
        }

        //移动客户端到默认组
        $result = $this->MoveComputerByGroupId($groupId, $defaultGroup['id'], $defaultGroup['groupname'], $eid);
        if (is_array($result)) {
            logs::logError('删除组失败，移动客户端到默认组时发生错误。'.$desc.'失败');
            return ['msg' => '删除组失败，移动客户端到默认组时发生错误。'];
        }
        //删除组
        if (!($this->deleteGroup($eid, $groupId))) {
            logs::logError("客户端已移动到【" . $defaultGroup['groupname'] . "】，删除组时发生错误".$desc.'失败');
            return ['msg' => "客户端已移动到【" . $defaultGroup['groupname'] . "】，删除组时发生错误"];

        }
        logs::logInfo('成功'.$desc.'失败');
        //删除组策略
        if ((new PolicyModel())->removePolicys([$groupId], 1, $eid)) {
            //清理缓存策略
            //RedisDataManager::initPolicy($eid, $groupId, 1);
        }
        return true;
    }

    /**
     * @param $clients 客户端 $clients[]
     * @param $groupId 目标组
     * @param $eid   eid
     * @return bool
     */
    public function MoveComputer($clients, $groupId, $eid,$objects)
    {
        $group = $this->getGroupName($groupId, $eid);
        $msg = '成功';
        $desc=sprintf('移动终端到%s',$group['groupname']);
        $isOk = true;
        if (empty($group)) {
            $msg = '目标组不存在';
            logs::logError($group['groupname'].$msg.$desc.'失败');
            return ['msg' => $msg];
        }
        $pstamp = Common::getMicroTime();
        $groupid = intval($groupId);
        $groupname = $group['groupname'];
        $sql = "UPDATE epinfo_$eid SET groupid=$groupid,pstamp=$pstamp,groupname='$groupname' WHERE eid=$eid AND sguid in($clients)";
        $result = LogsDB::exec($sql);
        if (!(is_array($result) && $result['ok'] == 1)) {
            $msg = '移动客户端是发生错误。';
            $isOk = false;
        }
        logs::logInfo($group['groupname'].$msg.$desc.'成功');
        if (!$isOk) return ['msg' => $msg];
        $isBlackGroup = strcasecmp($groupId, $this->getBlackGroupID($eid)) == 0;

        foreach ($clients as $sguid) {
            //RedisDataManager::initEPInfo($eid, $groupId, $sguid);
            //写mq
            UCommon::writeRabbitMq([
                'eid' => $eid,
                'sguid' => $sguid,
                'groupid' => intval($groupId),
                //'pstamp' => Common::getMicroTime(),
                'groupname' => $group['groupname'],
                'logtype' => 'epinfo',
                'optype' => 'u',
            ]);
            if ($isBlackGroup) {
                UCommon::writeRabbitMq([
                    'eid' => $eid,
                    'sguid' => $sguid,
                    'logtype' => 'epinfo',
                    'optype' => 'd',
                ]);
            }
        }
        return true;
    }

    /**
     * 根据组移动客户端
     * @param [int] $sgroupId [源组]
     * @param [int] $ogroupId [目标组]
     * @param [string] $eid   [企业id]
     * @return  [bool/array]  [<description>]
     */
    private function MoveComputerByGroupId($sgroupId, $ogroupId, $ogroupName, $eid)
    {
        //获取要删除的组
        $group = $this->getGroupName($sgroupId, $eid);
        if (empty($group)) {
            return ['msg' => '源组不存在。'];
        }

        if (strcasecmp($sgroupId, $ogroupId) == 0) {
            return true;
        }

        $sgroupId = intval($sgroupId);
        $select_sql = "SELECT sguid FROM epinfo_$eid WHERE groupid=$sgroupId ";
        $clientArr =LogsDB::getAll($select_sql);

        $pstamp = Common::getMicroTime();
        $update_sql = "UPDATE epinfo_$eid SET groupid=$sgroupId,pstamp='$pstamp',groupname='$ogroupName' where groupid=$ogroupId";
        $result = LogsDB::exec( $update_sql );


        //RedisDataManager::updateClientCMDVer($eid, $ogroupId, 2);
        //写mq
        foreach ($clientArr as $client) {
            UCommon::writeRabbitMq([
                'eid' => $eid,
                'sguid' => $client['sguid'],
                'groupid' => intval($ogroupId),
                //'pstamp' => Common::getMicroTime(),
                'groupname' => $ogroupName,
                'logtype' => 'epinfo',
                'optype' => 'u',
            ]);
        }
        return true;
    }

    /*
     *判断组名是否存在
     */
    public function IsAlreadySet($str_name, $eid)
    {

        $sql = "SELECT id FROM groupinfo_$eid WHERE eid='$eid' AND groupname='$str_name'";
        $group = LogsDB::getCell($sql);
        return !empty($group);
    }

    /**
     * 获取组名称
     * @param  [int] $groupId [组id]
     * @param  [string] $eid     [企业id]
     * @return [array]          [组名称和id]
     */
    public function getGroupName($groupId, $eid)
    {
       $id = intval($groupId);
       $sql = "SELECT id,groupname FROM groupinfo_$eid WHERE id=$id ";
       return LogsDB::getRow($sql);
    }

    /*
     *获取一个组的信息
     */
    public function GetGroup($id, $eid)
    {
        $id = intval($id);
        $sql = "SELECT id,groupname,description,edate,type FROM groupinfo_$eid WHERE eid=$eid AND id=$id ";
        $result =LogsDB::getRow($sql);
        return $result;
    }

    /*
     *添加组
     */
    public function AddGroup($name, $desp, $eid, $type = 1)
    {
        //检查组名称
        $isExists = $this->IsAlreadySet($name, $eid);
        if ($isExists) {
            return false;
        }

        $id = intval(Common::getMicroTime());
        $desc=sprintf('添加组"%s"',$name);

        $obj=json_encode(['group'=>[['guid'=>$id,'name'=>$name]]]);
        $edate = date('Y-m-d H:i:s');
        $content = array(
            'eid' => $eid,
            'id' => $id,
            'groupname' => $name, //remove_xss($name),
            'description' => $desp, //remove_xss($desp),
            'edate' => $edate,
            'type' => $type,
        );

        $sql = "INSERT INTO groupinfo_$eid (eid,id,groupname,description,edate,type) VALUES ('".$eid."',$id,'".$name."','".$desp."','".$edate."',$type)";

        $okResult = LogsDB::exec( $sql );
        if (!$okResult) {
            logs::logError($desc.'失败');
            return false;
        }
        logs::logInfo($desc.'成功');

        //写mq
        $data = $content;
        $data['logtype'] = 'groupinfo';
        //"optype"的值可以为"i"代表插入，"u"代表修改,"d"代表删除
        $data['optype'] = 'i';

       //UCommon::writeRabbitMq($data);

        //policy
        $policy_model = new PolicyModel();

        switch ($type) {
            case 0: //默认组
                $bool_result = $policy_model->addDefaultGroupPolicy($eid, $id);
                break;
            case 2: //黑名单
                return $content;
            default:
                $bool_result = $policy_model->addDefaultPolicys($eid, $id);
                break;
        }

        if (!$bool_result) {
            return false;
        }

        return $content;
    }

    /**
     * @param $groupid init
     * @param $args array
     * @param $eid
     * @return array|bool|null
     */
    public function GetGroupComputer($groupid, $args, $eid)
    {
        $clients = $this->getGroupComputers($eid, $groupid, $args);

        $rows = array_map(function ($client) {
            $client['mac'] = UCommon::mac($client['mac']);
            $client['os'] = UCommon::os($client['os']);
            //onlinestate  -1:查询所有，0：离线，1：在线，2：卸载  onlinestate只取redis中的，先判断unset值
            $client['onlinestate'] = $client['unset'] == 1 ? 2 : $this->getClientOnlineState($client['eid'], $client['sguid'], $client['systype']);
            return $client;
        }, $clients);
        return [
            'total' => count($clients),
            'rows' => $rows,
        ];
    }

    /**
     * 获取客户端在线状态
     * @param  [string] $eid     [企业id]
     * @param  [string] $sguid   [客户端id]
     * @param  [string] $systype [客户端系统类型，可为空，为空时则安装sguid查询]
     * @return [int]          [0：离线；1：在线]
     */
    public function getClientOnlineState($eid, $sguid, $systype = null, $unset = null)
    {
        if (empty($systype) || empty($unset)) {
            $sql="select systype,unset from epinfo_$eid where eid=? and sguid=?";
            $client=LogsDB::getRow($sql,[$eid,$sguid]);

            $systype = empty($client) ? '' : $client['systype'];
            $unset = empty($client) ? '' : $client['unset'];
        }
        $lastTime = RedisDataManager::getEpLastlogintime($eid, $systype, $sguid);

        return $unset == 1 ? 2 : (!empty($lastTime) && $lastTime >= time() ? 1 : 0);
    }

    /**获取客户端名称
     * @param $sguid
     * @param $eid
     * @return array|bool|string
     */
    public function GetComputerNameinfo($sguid, $eid)
    {

        $res = Common::mongoResultToArray($this->epinfo->find(array('eid' => $eid, 'sguid' => $sguid)));
        $result = Common::formDate($res);
        return $result;
    }

    /*
     * sort: 用哪个字段排序
     * order: asc 正序 desc 倒序
     *offset 偏移量
     * limit 要查多少条
     */

    public function GroupList($args, $eid)
    {
        //添加分页
        $sort = !empty($args['sort']) ? $args['sort'] : null;
        $order = (!empty($args['order']) && $args['order'] === 'desc') ? -1 : 1;
        $offset = !empty($args['offset']) ? intval($args['offset']) : 0;
        $limit = !empty($args['limit']) ? intval($args['limit']) : 0;

        $data = [];
        $itrt = $this->groupinfo->find(array('eid' => $eid));
        $total = $itrt->count();
        if ($total === 0) {
            return null;
        }
        $data['total'] = $total;

        if (!empty($sort)) {
            $itrt->sort([$sort => $order]);
        }
        if ($limit > 0) {
            $itrt = $itrt->skip($offset)->limit($limit);
        }

        $result = array_values((iterator_to_array($itrt)));
        $data['rows'] = $result;
        return $data;
    }

    /**
     * @param $eid
     * @return array|null
     * 左侧组列表内容
     */
    public function GroupListAll($eid,$productIds)
    {
        $data = [];

        $where=['eid'=>$eid];
        $groups=LogsDB::getAll("select * from groupinfo_$eid");
        $total = count($groups);
        if ($total === 0) {
            return [];
        }
        $data['total'] = $total;

        foreach ($groups as $group) {
            $group = array_merge($group, $this->getClinetOnlineStateOneGroup($eid, $group['id'],$productIds));
            $data['rows'][] = $group;
        }
        $data['rows'][] = array_merge(['id' => -1], $this->getClinetOnlineStateOneGroup($eid, -1,$productIds));

        return $data;
    }

    /**
     *
     * 删除组信息
     */
    public function deleteGroup($eid, $id)
    {
        $sql="delete from groupinfo_$eid where id=?";
        LogsDB::exec($sql,[$id]);
        return true;
        UCommon::writeRabbitMq($eid, [
                'eid' => $eid,
                'id' => intval($id),
                'logtype' => 'groupinfo',
                'optype' => 'd',
            ]);
        return true;
    }

    /**
     * 获取默认组名称
     * @param  [string] $eid [企业id]
     * @return [array]      [默认组名称和id]
     */
    public function getDefaultGroupName($eid)
    {
        $sql = "SELECT id,groupname FROM groupinfo_$eid WHERE eid='$eid' AND groupname='默认分组' AND type=0";
        return LogsDB::getRow( $sql );
    }

    /**
     * 获取组类型
     * @param  [string] $eid [企业id]
     * @param  [string] $id  [组id]
     * @return [int]      [组类型]
     */
    private function getGroupType($eid, $id)
    {
        $sql = "SELECT type FROM groupinfo_$eid WHERE eid='$eid' AND id=$id";
        $result = LogsDB::getRow( $sql );
        return empty($result) ? 0 : intval($result['type']);
    }

    /**
     * 获取全网计算机组的id
     * @param $eid
     * @return int
     */
    public function getGlocbalGroupID($eid)
    {
        if (empty($eid)) {
            return 0;
        }
        $globalComputer = Common::mongoResultToArray($this->groupinfo->find(array('groupname' => '全网计算机', 'eid' => $eid)));
        if (!empty($globalComputer)) {
            foreach ($globalComputer as $k) {
                if (isset($k['id'])) {
                    return $k['id'];
                }
            }
        }
        return 0;
    }

    /**
     * @param $eid
     * @return array|bool
     */
    public function GetGroupInfo($eid)
    {
        if (empty($eid)) {
            return '';
        }
        $groupInfo = Common::mongoResultToArray($this->groupinfo->find(array('eid' => $eid)));
        return $groupInfo;
    }

    /**
     * @param $sguid 客户端id
     * @param $eid  eid
     * @return string 返回客户端string
     */
    public function getEpInfo($sguid, $eid)
    {
        $epinfoCollection = select_manage_collection('epinfo');
        $result = Common::mongoResultToArray($epinfoCollection->find(array('sguid' => $sguid, 'eid' => $eid)));
        if (!empty($result)) {
            foreach ($result as $k => $v) {
                unset($v["_id"]);
                return json_encode($v);
            }
        }
    }

    /**
     * 删除客户端
     * @param  [string] $clientId [客户端id]
     * @param  [string] $eid      [企业id]
     * @return [bool/array]       [description]
     */
    public function delClient($clients, $eid)
    {
        $result = $this->epinfo->remove(array('sguid' => ['$in' => $clients], 'eid' => $eid), ['justOne' => false]);
        if (is_array($result) && $result['ok'] == 1) {
            foreach ($clients as $sguid) {
                UCommon::writeKafka($eid, [
                    'eid' => $eid,
                    'sguid' => $sguid,
                    'logtype' => 'epinfo',
                    'optype' => 'd',
                ]);
            }
            return true;
        }
        return false;
    }

    /**
     * 获取客户基本信息
     * @param [string] $eid       [企业id]
     * @param [string] $objId     [企业/组/客户端 id]
     * @param [string] $groupType [企业:0/组:1/客户端:2]
     * @return   [MongoCursor] [客户端集合]
     */
    public function GetClientCursor($sql, $fields,$whereParams=[])
    {
        $columns=join(',',$fields);
        return LogsDB::getAll($sql,$whereParams);
    }

    /**
     * 根据条件查询epstate状态
     * @param $eid 企业id
     * @param $clients 客户端sguid列表，没有key值
     * @param $kvs key、vlue键值对，需要key
     * @return array|bool
     */
    public function getEpState($eid, $clients, $kvs)
    {
        $parms = array(
            'eid' => $eid,
            'sguid' => ['$in' => $clients],

        );
        //      print_r($kvs);
        if (!empty($kvs)) {
            foreach ($kvs as $k => $v) {
                $parms["kvs." . $k] = $v;
            }
        }
//        print_r($kvs);
//        print_r($parms);
        //print_r(json_encode($parms, true));

        $epstateCollection = select_log_collection('EpState');
        $result = Common::mongoResultToArray($epstateCollection->find($parms, array('eid' => true, 'sguid' => true, 'kvs' => true)));
        //var_dump($result);
        //print_r($result);
        if (!empty($result)) {
            return $result;
        } else {
            null;
        }
    }

    /**
     * [获取各个组的客户端在线情况统计]
     * @param  [string] $eid [企业id]
     * @return [type]      [description]
     */
    public function getClientOnlineStateByGroup($eid, $groupIds = null)
    {
        if (empty($groupIds)) {
            $groupArr = $this->groupinfo->find(['eid' => $eid], ['_id' => false, 'id' => true]);
            $groupIds = array_column(iterator_to_array($groupArr), 'id');
        }
        return $this->getClinetOnlineStateMultipleGroup($eid, $groupIds);
    }

    /**
     * 返回指定组的客户端在线统计
     * @param  [string] $eid      [企业id]
     * @param  [string] $groupIds [组id集合]
     * @return [array]           [每个组对应的客户端在线数和总数集合]
     */
    private function getClinetOnlineStateMultipleGroup($eid, $groupIds)
    {
        $result = [];
        foreach ($groupIds as $groupId) {
            if (!array_key_exists($groupId, $result)) {
                $result[$groupId] = $this->getClinetOnlineStateOneGroup($eid, $groupId);
            }
        }
        return $result;
    }

    /**
     * 返回单个指定组的客户端在线数统计
     * @param  [string] $eid     [企业id]
     * @param  [string] $groupId [组id]
     * @return [array]          ['online'=>0,'total'=>0]
     */
    private function getClinetOnlineStateOneGroup($eid, $groupId,$productIds)
    {
        $where = [
            'eid' => $eid,
        ];
        $where='where 1=1 ';
        $whereParams=[];
        $isUnsetGroup = -1 == intval($groupId);
        if ($isUnsetGroup) {
            $where .=' and unset =1 ';
        } else {
            $where.=' and unset <> 1 and groupid=?';
            $whereParams[] = intval($groupId);
        }
        if (!empty($productIds)) {

            $pguids=join('\',\'', $productIds);
            $where.=" and prodguid in ('$pguids')";
        }

        $sql="select distinct e.sguid,systype,unset from epinfo_$eid e inner join epproductinfo_$eid p on e.sguid=p.sguid $where";

        $clientArr = LogsDB::getAll($sql,$whereParams);
        $total = count($clientArr);
        $online = 0;
        if (!$isUnsetGroup) {
            foreach ($clientArr as $client) {
                $lastTime = RedisDataManager::getEpLastlogintime($eid, $client['systype'], $client['sguid']);
                $online += !empty($lastTime) && $lastTime >= time();
            }
        }
        return ['online' => $online, 'total' => $total];
    }

    public function getBlackGroupID($eid)
    {
        $group=LogsDB::getRow("select id from groupinfo_$eid where type=?",[2]);
        return empty($group) ? '' : $group['id'];
    }

    /**
     * 根据条件查询客户端信息
     * 当组ID==eid时，查询当前企业的所有客户端信息
     * @param $groupid 组id
     * @param $args 查询条件
     * @param $eid 企业ID
     * @return mixed 返回mongo对象
     */
    private function getGroupComputers($eid, $groupid, $args)
    {
        $sort = !empty($args['sort']) ? $args['sort'] : 'computername';
        $order = (!empty($args['order']) && $args['order'] === 'desc') ? 'desc' : 'asc';
        $orderBy= " order by $sort $order";

        $offset = !empty($args['offset']) ? intval($args['offset']) : 0;
        $limit = !empty($args['limit']) ? intval($args['limit']) : 0;

        $limitStr=" limit $offset,$limit";

        $where = ' where 1=1';
        $whereParams=[];
        $blackGID = $this->getBlackGroupID($eid);

        //如果查询全网计算机，调用本方法时，只需要指定groupid=0
        if ($groupid == -1) {
            $where.=' and unset=1';
        } else if ($groupid == -2) {
            $where .=' and (unset=1 or groupid=?)';
            $whereParams[]=$blackGID;
        } else if ($groupid == 0 || strcasecmp($eid, $groupid) == 0) {
            $where .=' and unset <>1 and groupid <> ?';
            $whereParams[]=$blackGID;
        } else if (strcasecmp($groupid, $blackGID) == 0) {
            $where.=' and groupid=?';
            $whereParams[] = intval($groupid);
        } else {
            $where .=' and unset <> 1 and groupid=?';
            $whereParams[] = intval($groupid);
        }
        if (isset($args['onlinestate']) && $args['onlinestate'] != -1) {
            //在线状态过滤
            $columns=join(',',[ 'sguid' , 'systype']);
            $clientArr = LogsDB::getAll("select $columns from epinfo_$eid" , $whereParams);
            $sguidArr = RedisDataManager::getEpOnline($eid);
            $onlinesguids = [];
            $offlinesguids = [];
            foreach ($clientArr as $client) {
                $key = $client['systype'] . ':' . $client['sguid'];
                $lastTime = $sguidArr[$key];
                if (!empty($lastTime) && $lastTime >= time()) {
                    $onlinesguids[] = $client['sguid'];
                } else {
                    $offlinesguids[] = $client['sguid'];
                }
            }
//            print_r($clientArr);
//            print_r($offlinesguids);
            $sguidStr=join('','',$args['onlinestate'] == 1 ? $onlinesguids : $offlinesguids);
            $where .= " and sguid in ('$sguidStr')";
        }
        //var_dump($where);
        if (!empty($args['name'])) {
            $where .=' and computername like ?';
            $whereParams[]='%'.$args['name'].'%';
        }

        if (!empty($args['ip'])) {
            $where .=' and ip like ?';
            $whereParams[]='%'.$args['ip'].'%';
        }
        if (!empty($args['mac'])) {
            $where .=' and mac like ?';
            $whereParams[]='%'.$args['mac'].'%';

        }
        if (!empty($args['sys'])) {
            $where .=' and systype like ?';
            $whereParams[]='%'.$args['sys'].'%';
        }
        if (!empty($args['version'])) {
            $where .=' and version like ?';
            $whereParams[]='%'.$args['version'].'%';
        }
        $join='';
        if (!empty($args['productIds'])) {
            $join=" inner join epproductinfo_$eid p on e.sguid=p.sguid";
            $pguids=join("','",$args['productIds']);
            $where .=" and prodguid in ('$pguids')";
        }
        $columns=join(',',[
            'distinct e.sguid',
            'e.eid',
            'groupid',
            'ip',
            'e.version',
            'os',
            'computername',
            'username',
            'memo',
            'groupname',
            'unset',
            'mac',
            'systype',
            'edate',
        ]);

        $sql ="select $columns from epinfo_$eid e $join $where $orderBy";
        return LogsDB::getAll($sql, $whereParams);
    }

    /**
     * 根据eid，groupid，客户端参数、状态参数 查询客户端和状态的结果集
     * @param $eid 企业ID
     * @param $args 客户端参数
     * @param $groupid 组ID
     * @param $kvs 状态参数
     */
    public function getComputersEpState($eid, $groupid, $args, $kvs, $columns)
    {
        //客户端结果集
        $clients = $this->getGroupComputers($eid, $groupid, $args);

        if (empty($clients)) {
            return null;
        }

        $sguids = array();
        foreach ($clients as $client) {
            array_push($sguids, $client['sguid']);
        }
        //根据客户端sguid查询状态结果集
        $epStates = $this->getEpState($eid, $sguids, $kvs);

        //返回合并后的结果集
        return $this->mergeComputersEpState($clients, $epStates, $columns);
    }

    /**
     * 合并客户端和状态结果集
     * @param $clients
     * @param $epStates
     * @return mixed
     */
    private function mergeComputersEpState($clients, $epStates, $columns)
    {
        //$columns = array('engver', 'sysmon', 'filemon', 'rfwurlmailscan', 'rfwurlxss');
        if (empty($clients) || empty($epStates)) {
            return null;
        }
        //print_r($epStates);

        foreach ($clients as $cKey => &$client) {
            //格式化mac
            $client['mac'] = UCommon::mac($client['mac']);
            $client['os'] = UCommon::os($client['os']);
            //添加客户端在线状态
            $client['onlinestate'] = $client['unset'] == 1 ? 2 : $this->getClientOnlineState($client['eid'], $client['sguid'], $client['systype']);

            $isExists = false;
            foreach ($epStates as $key => $ep) {
                if ($ep['eid'] === $client['eid'] && $ep['sguid'] === $client['sguid']) {
                    $isExists = true;
                    if (!empty($ep['kvs'])) {
                        //print_r($ep['kvs']);
                        foreach ($ep['kvs'] as $kvsvalue) {
                            foreach ($kvsvalue as $k => $v) {
                                $k = strtolower($k);
                                if (in_array($k, $columns)) {
                                    $client[$k] = $v;
                                }
                            }
                        }
                    }
                    unset($epStates[$key]);
                    break;
                }
            }
            if (!$isExists) {
                unset($clients[$cKey]);
            }
        }

        return array(
            "rows" => array_values($clients),
            "total" => count($clients),
        );
    }

    public static function getClientSGuidArr($eid, $objId, $groupType)
    {
        switch ($groupType) {
            case 0:
                $where = array(
                    'eid' => $objId,
                );
                break;
            case 1:
                $where = array(
                    'eid' => $eid,
                    'groupid' => intval($objId),
                );
                break;
            case 2:
                $where = array(
                    'eid' => $eid,
                    'sguid' => $objId,
                );
                break;
            default:
                return false;
        }
        $where['unset'] = ['$ne' => 1];

        $clientColl = select_manage_collection('epinfo')->find($where, array(
            'sguid' => true
        ));
        $clientArr = [];
        foreach ($clientColl as $client) {
            $clientArr[] = $client['sguid'];
        }
        return array_values($clientArr);
    }
}
