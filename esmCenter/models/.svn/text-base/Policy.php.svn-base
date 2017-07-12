<?php
use Lib\Model\RedisDataManager;
use Respect\Validation\Rules\IntVal;
use \Lib\Store\Redis;
use \Lib\Util\XMLProcess;
use Lib\Util\Common as UCommon;
use \Lib\Util\rc4;

class PolicyModel
{
    private $_redis;
    public function __construct()
    {
        $this->_rc4 = new rc4();
        $this->_redis = Redis::getInstance();
        $this->policyinfo = select_manage_collection("policyinfo");
        //$this->epinfo=select_manage_collection('epinfo');
    }

    /**
     * 编辑策略,1、更新policyinfo 2、更新策略缓存 3、更新策略流水号信息
     * grouptype 0|1|2 全网策略|组策略（包括未分组策略)| 客户端策略,p_group_1|p_group_2|sguid | p_sguid
     *
     * @param [array] $data
     *            策略信息
     *            'eid'=>$eid,
     *            'objid' => $objid,
     *            'grouptype' => $grouptype,
     *            'desp' => $desp,
     *            'policyjson' => $json
     */
    public function editPolicy($data)
    {
        $eid = $data['eid'];
        $objId = $data['objid'];
        $productId = $data['productid'];
        $productName = $data['productname'];
        $groupType = $data['grouptype'];
        $policyType = $data['policytype'];
        $policyJson = $data['policyjson'];
        $desp = $data['desp'];
        $pVer = Common::getMicroTime();
        $content = array(
            'eid' => $eid,
            'policyobject' => $objId,
            'productid' => $productId,
            'productname' => $productName,
            'grouptype' => $groupType,
            'policytype' => $policyType,
            'policyver' => $pVer,
            'policyjson' => $policyJson,
            'description' => $desp,
            'edata' => time(),
        );
        // 更新mongo库
        $policyCollection = select_manage_collection("policyinfo");
        $policy = $policyCollection->findAndModify(array(
            'eid' => $eid,
            'policyobject' => $objId,
            'productid' => $productId,
            'grouptype' => $groupType,
            'policytype' => $policyType,
        ), array(
            '$set' => $content,
        ), array(
            'eid' => true,
            'policyobject' => true,
            'grouptype' => true,
            'policyver' => true,
        ), array(
            'new' => true,
            'upsert' => true,
        ));

        $pwd='';
        if(strcasecmp('EB8AFFA5-0710-47E6-8F53-55CAE55E1915',$productId)==0&&$policyType==1) {
            $key='@value';
            $pwd=json_decode($policyJson)->epmsg->s->k->$key;
        }
        // 更新客户端策略版本
        if (!$this->updateClientPolicyVer($policy['eid'], $policy['policyobject'], $policy['grouptype'], $pVer)) {
            add_oplog(3,2011,null,null,$pwd,'修改管理员密码失败','修改管理员密码失败');
            add_oplog(3,2010,$objId,$policyType,null,'编辑“全网终端”设置'.'失败');
            return array(
                'msg' => '更新客户端策略版本失败',
                'eCode' => 2,
            );
        }

        // 更新缓存
        RedisDataManager::initPolicy($policy['eid'], $policy['policyobject'], $policy['grouptype']);
        add_oplog(3,2011,'','',$pwd,'成功','修改管理员密码成功');
        add_oplog(3,2010,$objId,$policyType,null,'成功','编辑“全网终端”设置'.'成功');

        return true;
    }
    /**
     * 更新客户端版本和缓存
     *
     * @param string $eid
     * @param string $objid
     * @param string $grouptype
     * @param string $pVer
     * @return boolean
     */
    private function updateClientPolicyVer($eid, $objid, $grouptype, $pVer)
    {
        switch ($grouptype) {
            case 0:
                $where = array(
                    'eid' => $eid,
                );
                break;
            case 1:
                $where = array(
                    'eid' => $eid,
                    'groupid' => IntVal($objid),
                );
                break;
            case 2:
                $where = array(
                    'eid' => $eid,
                    'sguid' => $objid,
                );
                break;
            default:
                return false;
        }

        // 更新客户端策略版本
        $epCollection = select_manage_collection('epinfo');

        $okResult = $epCollection->update($where, array(
            '$set' => array(
                'pstamp' => $pVer,
            ),
        ), array(
            'multiple' => true,
            'upsert' => false,
        ));



        if(is_array($okResult) && isset($okResult['ok']) && $okResult['ok'] == 1)
        {
            // 更新缓存
            RedisDataManager::updateClientPolicyVer($eid, $objid, $grouptype, $pVer);
            // $clientArr=$this->epinfo->find($where,['sguid'=>true]);
            // foreach ($clientArr as $client) {
            //     UCommon::writeKafka($eid,[
            //         'eid'=>$eid,
            //         'sguid'=>$client['sguid'],
            //         'pstamp'=>$pVer,
            //         'logtype'=>'epinfo',
            //         'optype'=>'u'
            //     ]);
            // }
            return true;
        }
        return false;
    }

    /**
     * 获取策略详细信息
     *
     * @param string $eid
     * @param string $objId
     * @param string $productId
     * @param string $groupType
     * @param string $policyType
     * @return Array
     */
    public function getPolicy($eid, $objId, $productId, $groupType, $policyType)
    {
        $where = array(
            'eid' => $eid,
            'policyobject' => strval($objId),
            'productid' => $productId,
            'grouptype' => $groupType,
            'policytype' => $policyType,
        );
        $result = select_manage_collection('policyinfo')->findOne($where, array(
            'eid' => true,
            'policyobject' => true,
            'productid' => true,
            'grouptype' => true,
            'policytype' => true,
            'productname' => true,
            'description' => true,
            'edata' => true,
            'policyjson' => true,
        ));

        if (!is_null($result) && is_array($result)) {
            $id = $result['_id']->{'$id'};
            unset($result['_id']);
            $result['id'] = $id;
        }
        return $result;
    }

    /**
     * 删除策略；1.获取policyinfo中信息，根据策略类型判断其为全网、组还是客户端策略，删除db中该记录
     * 2.查找computerubf中信息，根据1中策略组类型，决定删除缓存redis中策略信息$policyCollection->remove(array (
     * 'eid' => $eid,
     * 'grouptype' => 1,
     * 'policyobject' => $groupId
     * ));
     * 3.判断各个客户端的策略版本
     *
     * @param [type] $id
     *            [description]
     */
    public function delPolicy($eid, $id)
    {
        $where = array(
            '_id' => new MongoId($id),
            'eid' => $eid,
        );
        $policyCollection = select_manage_collection('policyinfo');
        $policy = $policyCollection->findOne($where, array(
            '_id' => false,
            'eid' => true,
            'policyobject' => true,
            'grouptype' => true,
        ));

        if (is_null($policy)) {
            return true;
        }

        $removeResult = $policyCollection->remove($where);
        if (!(is_array($removeResult) && isset($removeResult['ok']) && $removeResult['ok'] == 1)) {
            return array(
                'msg' => '删除策略失败',
                'eCode' => 2,
            );
        }
        RedisDataManager::updateClientPolicyVer($policy['eid'], $policy['policyobject'], $policy['grouptype'], Common::getMicroTime());
        RedisDataManager::initPolicy($policy['eid'], $policy['policyobject'], $policy['grouptype']);
        return true;
    }

    /**
     * 删除指定对象的策略
     * @param  [string] $objId  全网/组/客户端
     * @param  [int] $groupType 0:全网，1:组，2:客户端
     * @param  [string] $eid    企业id
     * @return [bool]
     */
    public function removePolicys($objIds, $groupType, $eid)
    {
        $objIds=array_map(function($item){
            return strval($item);
        }, $objIds);
        $result = select_manage_collection('policyinfo')->remove(array(
            'eid' => $eid,
            'policyobject' => ['$in'=>$objIds],
            'grouptype' => intval($groupType),
        ));
        return is_array($result) && $result['ok'] == 1;
    }

    /**
     * [为默认组添加策略]
     * @param [string] $eid     [企业id]
     * @param [string] $groupId [默认组id]
     */
    public function addDefaultGroupPolicy($eid, $groupId)
    {
        $groupId = strval($groupId);
        $initPolicyArr=require(__DIR__.'/../../config/policy.php');

        $policyArr[] = [
            'eid' => $eid,
            'productid' => 'D49170C0-B076-4795-B079-0F97560485AF',
            'productname' => 'Window防病毒',
            'grouptype' => 1,
            'policytype' => 1,
            'policyobject' => $groupId,
            'policyver' => Common::getMicroTime(),
            'policyjson' =>  htmlspecialchars_decode($initPolicyArr['D49170C0-B076-4795-B079-0F97560485AF']),
            'edata' => time(),
        ];
        $policyArr[] = [
            'eid' => $eid,
            'productid' => 'A40D11F7-63D2-469d-BC9C-E10EB5EF32DB',
            'productname' => 'Linux防病毒',
            'grouptype' => 1,
            'policytype' => 1,
            'policyobject' => $groupId,
            'policyver' => Common::getMicroTime(),
            'policyjson' =>  htmlspecialchars_decode($initPolicyArr['A40D11F7-63D2-469d-BC9C-E10EB5EF32DB']),
            'edata' => time(),
        ];

        $policyCollection = select_manage_collection('policyinfo');
        foreach ($policyArr as $policy) {
            $okResult = $policyCollection->update(array(
                'eid' => $eid,
                'grouptype' => $policy['grouptype'],
                'policytype' => $policy['policytype'],
                'productid' => $policy['productid'],
                'policyobject' => $groupId,
            ), array(
                '$set' => $policy,
            ), array(
                'upsert' => true,
            ));
            if (!(is_array($okResult) && isset($okResult['ok']) && $okResult['ok'] == 1)) {
                $policyCollection->remove(array(
                    'eid' => $eid,
                    'grouptype' => $policy['grouptype'],
                    'policyobject' => $groupId,
                ));
                return false;
            }
        }
        return true;
    }
    /**
     * 创建组的默认策略
     *
     * @param
     *            string 企业id
     * @param
     *            string 子组id
     * @return bool
     */
    public function addDefaultPolicys($eid, $groupId)
    {
        $groupId = strval($groupId);
        //获取默认组
        $defaultGroup = (new GroupModel())->getDefaultGroupName($eid);
        if (empty($defaultGroup)) {
            return true;
        }
        $pgid = strval($defaultGroup['id']);
        $policyCollection = select_manage_collection('policyinfo');
        // 获取$pgid的策略
        $policyArr = $policyCollection->find(array(
            'eid' => $eid,
            'policyobject' => $pgid,
            'grouptype' => 1,
        ));

        // 写入mongodb
        $pVer = Common::getMicroTime();
        foreach ($policyArr as $policy) {

            unset($policy['_id']);
            $policy['policyobject'] = $groupId;
            $policy['policyver'] = $pVer;
            $policy['edata'] = time();
            $okResult = $policyCollection->update(array(
                'eid' => $eid,
                'grouptype' => 1,
                'policytype' => $policy['policytype'],
                'productid' => $policy['productid'],
                'policyobject' => $groupId,
            ), array(
                '$set' => $policy,
            ), array(
                'upsert' => true,
            ));

            if (!(is_array($okResult) && isset($okResult['ok']) && $okResult['ok'] == 1)) {
                $policyCollection->remove(array(
                    'eid' => $eid,
                    'grouptype' => 1,
                    'policyobject' => $groupId,
                ));
                return false;
            }
        }

        RedisDataManager::initPolicy($eid, $groupId, 1);
        return true;
    }

    /**
     *
     * @param $groupid 组id
     * @param $sguid 客户端id
     * @param $eid eid
     * @return bool
     */
    public function hasPolicy($groupid, $sguid, $eid)
    {
        $policyobject = !empty($groupid) ? $groupid : $sguid;
        if (empty($policyobject)) {
            return false;
        }
        $result = $this->policyinfo->find(array(
            'eid' => $eid,
            'policyobject' => $policyobject,
        ));
        $total = $result->count();
        return $total;
    }

    /**
     *
     * @param $args 参数
     *            $argc = array(
     *            'limit'=>$limit,
     *            'offset'=>$offset,
     *            'order'=>$order,
     *            'sort'=>$sort,
     *            'policyobject'=>$policyobject,
     *            );
     *
     * @param $eid eid
     * @return array|bool|null
     */
    public function getPolicyList($args, $eid)
    {
        $sort = !empty($args['sort']) ? $args['sort'] : null;
        $order = (!empty($args['order']) && $args['order'] === 'desc') ? -1 : 1;
        $offset = !empty($args['offset']) ? intval($args['offset']) : 0;
        $limit = !empty($args['limit']) ? intval($args['limit']) : 10;
        $policyobject = !empty($args['policyobject']) ? $args['policyobject'] : '';

        $where = array(
            'eid' => $eid,
            'policyobject' => strval($policyobject),
        );
        $itrt = $this->policyinfo->find($where);
        $total = $itrt->count();
        if ($total === 0) {
            return null;
        }
        if (!empty($sort)) {
            $itrt->sort([
                $sort => $order,
            ]);
        }
        $itrt = $itrt->skip($offset)->limit($limit);
        $result = array_values((iterator_to_array($itrt)));
        $result = Common::pageTotalDate($result, $total);
        return $result;
    }

    /**
     *
     * @param
     *            $objId
     * @param
     *            $eid
     * @param $pVer 策略变更时间
     * @return bool
     */
    public function updateGroupPver($objId, $eid, $pVer)
    {
        $epinfoCollection = select_manage_collection('epinfo');
        $res = $epinfoCollection->update(array(
            'groupid' => $objId,
            'eid' => $eid,
        ), array(
            '$set' => array(
                'pstamp' => $pVer,
            ),
        ), array(
            'multiple' => true,
        ));
        if (isset($res) && $res['ok'] == 1) {
            return true;
        }
        return false;
    }

    /**
     *
     * @param $sguid 客户端id
     * @param $eid eid
     * @return string 返回客户端string
     */
    public function getEpInfo($sguid, $eid)
    {
        $epinfoCollection = select_manage_collection('epinfo');
        $result = Common::mongoResultToArray($epinfoCollection->find(array(
            'sguid' => $sguid,
            'eid' => $eid,
        )));
        if (!empty($result)) {
            foreach ($result as $k => $v) {
                return json_encode($v);
            }
        }
    }

    /**
     * 获取可添加策略的产品信息
     *
     * @param string $eid
     * @param string $groupId
     */
    public function getDisplayProduct($eid, $objId, $groupType)
    {
        $policyCollection = select_manage_collection('policyinfo');

        $policyArr = iterator_to_array($policyCollection->find(array(
            'eid' => $eid,
            'policyobject' => strval($objId),
            'grouptype' => intval($groupType),
        ), array(
            'productid' => true,
            'policytype' => true,
        )));

        // require __DIR__ . '/../conf/config.php';
        // $result = $config['PRODUCT_GUID_INFO'];
        $resultColl = select_manage_collection("productpolicy")->find([
            'type' => 1,
        ], [
            '_id' => false,
            'guid' => true,
            'type' => true,
            'name' => true,
        ]);
        $result = [];
        foreach ($resultColl as $item) {
            $result[$item['guid'] . "_" . $item['type']] = [
                "NAME" => $item['name'],
                "MEMO" => $item['name'],
            ];
        }
        // var_dump($result);
        foreach ($policyArr as $policy) {
            $key = $policy['productid'] . "_" . $policy['policytype'];
            if (array_key_exists($key, $result)) {
                unset($result[$key]);
            }
        }

        return $result;
    }
}
