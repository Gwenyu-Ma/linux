<?php
use Lib\Model\AutoGroup;

class PolicyController extends MyController
{
    private $_rc4;
    public function init()
    {
        parent::init();
        Yaf_Dispatcher::getInstance()->disableView();
    }

    // /测试编辑策略
    public function editPolicyTestAction()
    {
        $_POST = array(
            'eid' => 'BB8A7644925C2E62',
            'objid' => 11111111,
            'productid' => 'D49170C0-B076-4795-B079-0F97560485AF',
            'productname' => '杀毒',
            'grouptype' => 1,
            'policytype' => 1,
            'desp' => 'desp',
            'policyinfo' => '{"a":1,"b":2,"c":3,"d":4,"e":5,"f":6}',
        );
        $this->editPolicyAction();
    }
    public function addAutoGroup()
    {
        $rules = json_decode($this->param('policyinfo'), true);

        $rst = (new AutoGroup())->updateRules($this->userinfo['EID'], $rules);
        if (is_string($rst)) {
            add_oplog('修改','2007',null,$this->param('oldpolicyinfo'),$this->param('policyinfo'),1, '编辑入组规则失败');
            $this->notice($rst,1);
            return;
        }
        if (is_bool($rst) && !$rst) {
            add_oplog('修改','2007',null,$this->param('oldpolicyinfo'),$this->param('policyinfo'),1, '编辑入组规则失败');
            $this->notice('添加失败, 请稍候再试.',1);
            return;
        }
        add_oplog('修改','2007',null,$this->param('oldpolicyinfo'),$this->param('policyinfo'),0, '编辑入组规则成功');
        $this->ok(null,'添加成功');
        return;
    }
    public function getAutoGroupAction()
    {
        $rules = (new AutoGroup())->getRules($this->_eid);
        if (!is_array($rules)) {
            $rules = [];
        }
        $this->ok($rules);
    }
    public function testGetDisplayProductAction()
    {
        $_POST = array(
            'eid' => 'BB8A7644925C2E62',
            'objid' => '1458552718',
            'groupType' => 1,
        );
        $policyModel = new PolicyModel();

        $result = $policyModel->getDisplayProduct($_POST['eid'], $_POST['objid'], $_POST['groupType']);
        Common::out(Common::returnAjaxMsg(0, 0, "成功！", $result));
    }

    /**
     * 获取可添加策略的产品
     */
    public function getDisplayProductAction()
    {
        $eid = $this->param('eid', '');
        $objId = $this->param('objid', '');
        $groupType = $this->param('groupType', '');

        if (empty($objId) || empty($eid) || empty($groupType)) {
            Common::out(Common::returnAjaxMsg(1, 0, "请选定定企业和组！"));
        }
        $policyModel = new PolicyModel();

        $result = $policyModel->getDisplayProduct($eid, $objId, $groupType);

        if (is_bool($result)) {
            Common::out(Common::returnAjaxMsg(2, 0, "错误！"));
            return;
        }
        Common::out(Common::returnAjaxMsg(0, 0, "成功！", $result));
    }
    public function editPolicyAction()
    {

        switch ($this->param('type', 0)) {
            case 1:
                $this->addAutoGroup();
                break;
            default:
                $this->editPolicy();
                break;

        }
    }

    /**
     * 编辑策略
     */
    public function editPolicy()
    {
        if (!(isset($_POST['grouptype'])) || empty($_POST['productid']) || empty($_POST['grouptype']) || empty($_POST['eid']) || empty($_POST['eid']) || empty($_POST['objid']) || empty($_POST['policyinfo'])) {
            Common::out(Common::returnAjaxMsg(1, 0, "参数错误。"));
        }
        $productname = isset($_POST['productname']) ? $_POST['productname'] : '';

        $productid = $_POST['productid'];
        $eid = $_POST['eid'];

        $grouptype = intval($_POST['grouptype']);

        $objid = $_POST['objid'];

        $desp = $_POST['desp'];

        $policytype = intval($_POST['policytype']);
        $json = htmlspecialchars_decode($_POST['policyinfo']); // html格式转化json化，重要
        $model = new PolicyModel();
        $param_data = array(
            'eid' => $eid,
            'objid' => $objid,
            'productid' => $productid,
            'productname' => $productname,
            'grouptype' => $grouptype,
            'policytype' => $policytype,
            'desp' => $desp,
            'policyjson' => $json,
        );
        $result = $model->editPolicy($param_data);
        if (is_bool($result) && $result) {
            $this->ok(null,'成功');
            return;
        }
        $this->notice($result['msg'],$result['eCode']);
    }
    public function testGetPolicyAction()
    {
        $_POST = array(
            'eid' => 'BB8A7644925C2E62',
            'objid' => 1111115,
            'productid' => 'D49170C0-B076-4795-B079-0F97560485AF',
            'grouptype' => 1,
            'policytype' => 1,
        );
        $this->getPolicyAction();
    }

    /**
     * 获取策略
     */
    public function getPolicyAction()
    {
        if (!(isset($_POST['grouptype'])) || empty($_POST['productid']) || empty($_POST['grouptype']) || empty($_POST['policytype']) || empty($_POST['eid']) || empty($_POST['objid'])) {
            Common::out(Common::returnAjaxMsg(1, 0, "参数错误。"));
        }

        $model = new PolicyModel();
        $result = $model->getPolicy($_POST['eid'], $_POST['objid'], $_POST['productid'], intval($_POST['grouptype']), intval($_POST['policytype']));

        Common::out(Common::returnAjaxMsg(0, 0, "成功。", $result));
    }
    public function testDelPolicyAction()
    {
        $_POST['id'] = '56e0e11945df618e520847c0';
        $_POST['eid'] = 'BB8A7644925C2E62';
        $this->delPolicyAction();
    }

    /**
     * 删除策略
     *
     * @param
     *            id 策略编号
     */
    public function delPolicyAction()
    {
        $id = isset($_POST['id']) ? $_POST['id'] : '';
        $eid = isset($_POST['eid']) ? $_POST['eid'] : '';

        if (empty($id) || empty($eid)) {
            Common::out(Common::returnAjaxMsg(1, 0, "参数错误。"));
        }
        $model = new PolicyModel();
        $result = $model->delPolicy($eid, $id);
        if (is_bool($result) && $result) {
            Common::out(Common::returnAjaxMsg(0, 0, "成功。"));
            return;
        }
        Command::out(Common::returnAjaxMsg($result['eCode'], 0, $result['msg']));
    }

    /**
     * 获取指定组策略 cx
     */
    public function haspolicyAction()
    {
        $groupid = isset($_POST['groupid']) ? $_POST['groupid'] : '';
        $sguid = isset($_POST['sguid']) ? $_POST['sguid'] : '';
        $eid = $this->_eid;
        $model = new PolicyModel();
        $row = $model->hasPolicy($groupid, $sguid, $eid);
        Common::out(Common::returnAjaxMsg(0, 0, "", $row));
    }

    /**
     * 策略列表
     */
    public function getPolicyListAction()
    {
        $groupid = isset($_POST['groupid']) ? intval($_POST['groupid']) : ''; //
        $sguid = isset($_POST['sguid']) ? $_POST['sguid'] : '';
        $limit = isset($_POST['limit']) ? $_POST['limit'] : ''; //
        $offset = isset($_POST['offset']) ? $_POST['offset'] : ''; //
        $sort = isset($_POST['sort']) ? $_POST['sort'] : '';
        $order = isset($_POST['order']) ? $_POST['order'] : ''; //

        $policyobject = !empty($groupid) ? $groupid : $sguid;
        $argc = array(
            'limit' => $limit,
            'offset' => $offset,
            'order' => $order,
            'sort' => $sort,
            'policyobject' => $policyobject,
        );
        $eid = $this->_eid;
        $model = new PolicyModel();
        $result = $model->getPolicyList($argc, $eid);
        if ($result) {
            Common::out(Common::returnAjaxMsg(0, 0, "", $result));
        } else {
            Common::out(Common::returnAjaxMsg(0, 0, "暂无策略"));
        }
    }

    /**
     * 测试添加默认策略
     */
    public function addDefaultPolicyTestAction()
    {
        $policyCollection = select_manage_collection("policyinfo");
        $pgid = 1458041741;
        $eid = 'BB8A7644925C2E62';
        $cgid = 1111113;
        $policyArr = $policyCollection->find(array(
            'policyobject' => strval($pgid),
            'eid' => $eid,
            'grouptype' => 1,
        ), array(
            "eid",
            "policyjson",
            "policyobject",
            "grouptype",
        ));
        foreach ($policyArr as $policyItem) {
            // unset($policyItem["policyjson"]);
            var_dump($policyItem);
        }
        exit();
        $policy = new PolicyModel();
        $result = $policy->addDefaultPolicys($eid, $pgid, $cgid);
        var_dump($result);
    }

    /**
     * redis 初始化测试方法
     */
    public function testInitRedisAction()
    {
        var_dump(microtime(true));
        var_dump(Common::getMicroTime());
        //var_dump(microtime(true));
        //RedisDataManager::initByEID('BB8A7644925C2E62');
        //RedisDataManager::initByClientID('BB8A7644925C2E62', 1458032905, '51BEFE80-3B57-014E-2583-56D7Ddfvdf1');
    }
    public function testadddefaultpolicyAction()
    {
        (new PolicyModel())->addDefaultGroupPolicy($this->_eid,1);
    }

}
