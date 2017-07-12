<?php

use Lib\Model\AutoGroup;
use Lib\Util\Common;

class GroupController extends MyController
{
    public function init()
    {
        parent::init();
        Yaf_Dispatcher::getInstance()->disableView();
    }

    public function indexAction()
    {
        $this->notice("参数错误",1);
    }

    /**
     * 编辑和新建组
     */
    public function editgroupAction()
    {
        $str_id = $this->param('id', '');
        $str_name = $this->param('name', '');
        $str_desp = $this->param('desp', '');
        $groupModel = new GroupModel();
        if (empty($str_name) || mb_strlen($str_name) > 20) {
            $this->notice("组名称不符合要求",1);
            return ;
        }
        if (mb_ereg_match('[<>]', $str_name)){
            $this->notice('组名称不能包含‘<’‘>’字符',1);
            return;
        }

        //添加
        if (empty($str_id)) {
            $result = $groupModel->insertGroup($this->_eid, $str_name, $str_desp);

            if (is_array($result)) {
                $this->notice($result['msg'], 4);
                return;
            }
            $this->ok(null,"添加组成功。");
            return;
        }
        //修改
        $globalGroupID = $_SESSION['GroupInfo']['GlobalGroupID'];

        if (strcasecmp($str_id, $globalGroupID) == 0) {
            $this->notice("默认分组不能编辑。", 3);
            return;
        }
        $result = $groupModel->editGroup($this->_eid, $str_id, $str_name, $str_desp);
        if (is_array($result)) {
            $this->notice($result['msg'], 2);
            return;
        }
        $this->ok(null,'修改组成功。');
    }

    /**
     * MoveComputer    redis重新检测和测试
     *
     */
    public function moveComputerAction()
    {
        $clients = $this->param('clients', array());
        $group = $this->param('group', '');
        $objects=$this->param('objects','');
        if (empty($clients) || empty($this->_eid) || empty($group)) {
            $this->notice("参数错误",1);
        }
        $eid = $this->_eid;
        $model = new GroupModel();
        $result = $model->MoveComputer($clients, intval($group), $eid,$objects);
        if (is_array($result)) {
             $this->notice($result['msg'],2);
        }
        $this->ok(null,'成功');
    }

    /**
     * 获取组的客户端列表
     */
    public function getGroupComputerAction()
    {
        $groupid = isset($_POST['groupid']) ? intval($_POST['groupid']) : '';
        $limit = isset($_POST['limit']) ? $_POST['limit'] : '';
        $offset = isset($_POST['offset']) ? $_POST['offset'] : '';
        $order = isset($_POST['order']) ? $_POST['order'] : '';
        $sort = isset($_POST['sort']) ? $_POST['sort'] : '';
        $name = isset($_POST['name']) ? $_POST['name'] : '';
        $ip = isset($_POST['ip']) ? $_POST['ip'] : '';
        $mac = isset($_POST['mac']) ? $_POST['mac'] : '';
        $sys = isset($_POST['sys']) ? $_POST['sys'] : '';
        $version = isset($_POST['version']) ? $_POST['version'] : '';
        $onlinestate = $this->param('onlinestate', -1);
        $argc = array(
            'limit' => $limit,
            'offset' => $offset,
            'order' => $order,
            'sort' => $sort,
            'name' => $name,
            'ip' => $ip,
            'mac' => $mac,
            'sys' => $sys,
            'version' => $version,
            'onlinestate' => $onlinestate
        );

        $eid = $this->_eid;
        $groupid = empty($groupid) ? $eid : $groupid;
        $model = new GroupModel();
        $result = $model->GetGroupComputer($groupid, $argc, $eid);
        if ($result) {
            $this->ok($result);
        } else {
            $this->notice("数据不存在");
        }

    }

    /**
     * 获取组信息通过组id
     */
    public function getGroupAction()
    {
        $id = !empty($_POST['id']) ? intval($_POST['id']) : 0; //整型化参数
        if (!empty($id)) {
            $eid = $this->_eid;
            $model = new GroupModel();
            $result = $model->GetGroup($id, $eid);
            if ($result) {
                $this->ok($result);
            } else {
                $this->notice("操作异常。",1);
            }

        } else {
            $this->notice("参数错误。",2);
        }
    }

    /**
     * 获取客户端的信息
     */
    public function getComputerinfoAction()
    {
        $sguid = isset($_POST['sguid']) ? $_POST['sguid'] : '';

        if (!empty($sguid)) {
            $eid = $this->_eid;
            $model = new GroupModel();
            $result = $model->GetComputerinfo($sguid, $eid);
            if ($result) {
                $this->ok($result);
            } else {
                $this->notice("数据不存在",1);
            }

        } else {
            $this->notice("参数不正确。",2);
        }
    }

    /**GetComputerNameInfo
     * 获取客户端名称信息
     */
    public function getComputerNameinfoAction()
    {
        $sguid = isset($_POST['sguid']) ? $_POST['sguid'] : '';
        if (!empty($sguid)) {
            $eid = $this->_eid;
            $model = new GroupModel();
            $result = $model->GetComputerNameinfo($sguid, $eid);
            if ($result) {
                $this->ok($result);
            } else {
                $this->notice("数据不存在",1);
            }

        } else {
            $this->notice("参数错误。",2);
        }

    }

    /**
     * 删除组
     */
    public function delGroupAction()
    {

        $id = $this->param('id', '');
        $gName=$this->param('gName','');
        if (empty($id)) {
            $this->notice("参数错误。", 1);
            return;
        }
        $id = intval($id);

        $eid = $this->_eid;
        $model = new GroupModel();
        $result = $model->DelGroup($id, $eid,$gName);
        if (is_array($result)) {
            $this->notice($result['msg'], 2);
            return;
        }
        $this->notice("删除成功", 0);

    }

    /**
     * 获取组列表
     */
    public function groupListAction()
    {
        $limit = isset($_POST['limit']) ? $_POST['limit'] : 10;
        $offset = isset($_POST['offset']) ? $_POST['offset'] : '';
        $order = isset($_POST['order']) ? $_POST['order'] : '';
        $sort = isset($_POST['sort']) ? $_POST['sort'] : '';
        $argc = array(
            'limit' => $limit,
            'offset' => $offset,
            'order' => $order,
            'sort' => $sort,
        );
        $eid = $this->_eid;
        $model = new GroupModel();
        $result = $model->GroupList($argc, $eid);
        if ($result) {
           $this->ok($result);
        } else {
            $this->notice("暂无分组",1);
        }
    }

    public function testgroupListAllAction()
    {
        $this->_eid='D11FB2C040669210';
        $_REQUEST=['productIds'=>[
            '74F2C5FD-2F95-46be-B67C-FFA200D69012'
        ]];
        $this->groupListAllAction();
    }

    public function groupListAllAction()
    {
        $eid = $this->_eid;
        $productIds=$this->param('productIds',[]);
        $model = new GroupModel();
        $result = $model->GroupListAll($eid,$productIds);
        if ($result) {
            $this->ok($result);
        } else {
            $this->notice("暂无分组",1);
        }
    }

    public function autoAGroupAction()
    {
        $ok = (new AutoGroup())->makeGroupAutoInGroup($this->_eid, intval($this->param('groupid', 0)));
        if (!is_bool($ok)) {
            add_oplog('执行','AutoGroup\makeGroupAutoInGroup',null,null,null,$ok);
            $this->ok($ok);
            return;
        }
        add_oplog('执行','AutoGroup\makeGroupAutoInGroup',null,null,null,'OK');
        OplogModel::add($_SESSION['UserInfo']['EID'], $_SESSION['UserInfo']['UserName'], '组', '更新', '重新自动入组');
        $this->ok(null,'操作成功');
    }

    public function autoAllAction()
    {
        $ok = (new AutoGroup())->makeAllAutoInGroup($this->_eid);
        if (!is_bool($ok)) {
            add_oplog('执行','AutoGroup\makeGroupAutoInGroup',null,null,null,$ok);
            $this->ok($ok);
            return;
        }
        add_oplog('执行','AutoGroup\makeGroupAutoInGroup',null,null,null,'OK');
        OplogModel::add($_SESSION['UserInfo']['EID'], $_SESSION['UserInfo']['UserName'], '组', '更新', '全部重新自动入组');
        $this->ok(null,'操作成功');
    }

    /**
     * 删除客户但
     */
    public function delClientAction()
    {
        $clients = $this->param('clients', []);
        if (empty($clients)) {
            $this->notice('参数错误。', 1);
            return;
        }
        $groupModel = new GroupModel();
        $result = $groupModel->delClient($clients, $this->_eid);
        if (is_bool($result) && $result) {
            $this->ok(null, '成功。');
            return;
        }
        $this->notice($result['msg'], 2);
    }

    public function rfwMgrAction()
    {
        $eid = '6B784CA159279518';
        $groupid = '6B784CA159279518';
        //$groupid = isset($_POST['groupid']) ? intval($_POST['groupid']) : '';

        $order = 'name';
        $sort = 'asc';
        $name = '';
        $ip = '';
        $mac = '';
        $sys = '';
        $version = '';
        $argc = array(
            'order' => $order,
            'sort' => $sort,
            'name' => $name,
            'ip' => $ip,
            'mac' => $mac,
            'sys' => $sys,
            'version' => $version,
        );

        $groupModel = new GroupModel();
        $groupModel->getComputersEpState($eid, $groupid, $argc, array(
            array('key' => 'rfwurl.audit'),
            array('key' => 'rfwiprule.rs'),
            array('key' => 'rfwtdi'),
            array('key' => 'rfwflux'),
            array('key' => 'rfwshare'),
        ));

    }

    /**
     * 获取企业中每个组的客户端在线情况
     * @return [type] [description]
     */
    public function getClientStateAction()
    {
        $groupIds = $this->param('groupIds', null);
        if (!empty($groupIds)) {
            $groupIds = json_decode($groupIds);
        }
        $result = (new GroupModel())->getClientOnlineStateByGroup($this->_eid, $groupIds);
        $this->ok($result, '成功。');
    }

    public function testGetClientStateAction()
    {
        var_dump((new GroupModel())->getClientOnlineStateByGroup($this->_eid));
    }
}
