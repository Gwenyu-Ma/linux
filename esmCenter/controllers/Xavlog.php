<?php
class XAVLogController extends MyController
{
    //初始化
    private $_dbhost;
    private $_dbname;
    public $input;

    public function init()
    {
        parent::init();

        $this->input = json_decode(file_get_contents('php://input'));
    }

    #region xav概览
    /**
     * 获取病毒防护客户端概览
     */
    public function getClientsOverviewAction()
    {
        $objId = $this->param('objId', '');

        if (empty($objId)) {
            $this->notice('参数错误。', 1);
            return;
        }
        $argArr                = ['objId' => $objId];
        $argArr['name']        = $this->param('name', '');
        $argArr['ip']          = $this->param('ip', '');
        $argArr['mac']         = $this->param('mac', '');
        $argArr['sys']         = $this->param('sys', '');
        $argArr['os']          = $this->param('os', '');
        $argArr['vlibver']     = $this->param('vlibver', '');
        $argArr['filemon']     = $this->param('filemon', -1);
        $argArr['mailmon']     = $this->param('mailmon', -1);
        $argArr['sysmon']      = $this->param('sysmon', -1);
        $argArr['VirusAction'] = $this->param('VirusAction', -1);
        $argArr['onlinestate'] = $this->param('onlinestate', -1);
        $argArr['productIds']  = ['D49170C0-B076-4795-B079-0F97560485AF', 'A40D11F7-63D2-469d-BC9C-E10EB5EF32DB'];
        $columns = array('filemon', 'mailmon', 'sysmon', 'virusaction', 'vlibver');

        $xavLog = new XAVLogModel($this->_eid);
        $result = $xavLog->GetClientsOverview($this->_eid, $argArr, $columns);
        $this->ok($result, '成功。');
    }

    public function testGetClientsOverviewAction()
    {
        $_REQUEST         =  [
            'objId'       => '084627F653912335',
            'name'        => 'hello',
            'ip'          => '192.168.20.171',
            'mac'         => '123-123-456',
            'sys'         => '12',
            'os'          => 'os',
            'vlibver'     => '123.123',
            'filemon'     => '1',
            'mailemon'    => '1',
            'sysmon'      => '1',
            'virusaction' => '1',
        ];

        $this->_eid = '084627F653912335';
        $this->groupid = '084627F653912335';
        $this->getClientsOverviewAction();
    }

    public function getXavStatisticsAction()
    {
        $model = new XAVLogModel($this->_eid);
        $data = $model->getXavStatistics($this->_eid);

        $this->ok($data);
    }
    #endregion

    #region 病毒日志

    /**
     * 日志：病毒详情
     */
    public function getVirusListAction()
    {
        if (empty($this->input->viewtype)) {
            $this->notice('参数错误。', 1);
            return;
        }

        if (!isset($this->input->objtype)) {
            $this->notice('参数错误。', 2);
            return;
        }

        if (empty($this->input->objid)) {
            $this->notice('参数错误。', 3);
            return;
        }

        if (empty($this->input->paging)) {
            $this->notice('参数错误。', 4);
            return;
        }

        if (empty($this->input->queryconditions)) {
            $this->notice('参数错误。', 5);
            return;
        }

        if (empty($this->_eid)) {
            $this->notice('登录过期。', 6);
            return;
        }
        $eid = $this->_eid;
        $data = null;
        $model = new XAVLogModel($eid);
        $viewType = $this->input->viewtype;

        if ($viewType==='xav') {
            $data = $model->getXavByVirus(
                $eid,
                $this->input->objtype,
                $this->input->objid,
                $this->input->queryconditions,
                $this->input->paging
                );
        } elseif ($viewType==='ep') {
            $data = $model->getXavByEP(
                $eid,
                $this->input->objtype,
                $this->input->objid,
                $this->input->queryconditions,
                $this->input->paging
                );
        } elseif ($viewType==='detail') {
            $data = $model->getXavDetails(
                $eid,
                $this->input->objtype,
                $this->input->objid,
                $this->input->queryconditions,
                $this->input->paging
                );
        }
        $this->ok($data);
    }

    public function testgetXavScanListAction()
    {
        $query ='{
            "viewtype"       : "xav",
            "objtype"        : "0",
            "objid"          : "084627F653912335",
            "queryconditions": {
                "begintime"  : "",
                "endtime"    : "",
                "searchkey"  : "",
                "searchtype" : "virusname",
                "state"      : -1,
                "treatmethod": "-1",
                "taskname"   : "all"
            },
            "paging"         : {
                "sort"       : "virusCount",
                "order"      : 1,
                "offset"     : 0,
                "limit"      : 20
                }
            }';
        $_REQUEST = json_decode($query, true);
        $this->getVirusListAction();
    }

    /**
     * 日志：扫描事件
     */
    public function getVirusScanAction()
    {
        if (empty($this->input->viewtype)) {
            $this->notice('参数错误。', 1);
            return;
        }

        if (!isset($this->input->objtype)) {
            $this->notice('参数错误。', 1);
            return;
        }

        if (empty($this->input->objid)) {
            $this->notice('参数错误。', 1);
            return;
        }

        if (empty($this->input->paging)) {
            $this->notice('参数错误。', 1);
            return;
        }

        if (empty($this->input->queryconditions)) {
            $this->notice('参数错误。', 1);
            return;
        }

        if(empty($this->_eid)){
            $this->notice('登录过期。', 1);
            return;
        }
        $eid = $this->_eid;
        $data = null;
        $model = new XAVLogModel($eid);
        $viewType = $this->input->viewtype;

        if($viewType==='ep')
        {
            $data = $model->getXavScanDetails($eid,$this->input->objtype,$this->input->objid,$this->input->queryconditions,$this->input->paging);
        }

        $this->ok($data);
    }

    /**
     * 日志：系统加固
     */
    public function sysdefAction()
    {
        $xav = new XAVLogModel($this->_eid);
        $sids = $xav->getSguids(
            $this->_eid,
            @$this->input->objtype ?: new stdclass,
            @$this->input->objid ?: new stdclass,
            @$this->input->queryconditions ?: new stdclass
        );
        if (!$sids) {
            $this->ok([]);
            return;
        }
        $data = $xav->sysdef(
            $this->_eid,
            $sids,
            @$this->input->viewtype ?: 'ep',
            @$this->input->queryconditions ?: new stdclass,
            @$this->input->paging ?: new stdclass
        );
        $groupModel = new GroupModel();
        $data['rows'] = array_map(function ($item) use ($groupModel) {
            $item['onlinestate'] = $groupModel->getClientOnlineState($item['eid'], $item['sguid'], $item['systype'], $item['unset']);
            return $item;
        }, $data['rows']);
        $this->ok($data);
    }

    /**
     * 日志：应用加固
     */
    public function botauditlogAction()
    {
        $xav = new XAVLogModel($this->_eid);
        $sids = $xav->getSguids(
            $this->_eid,
            @$this->input->objtype ?: new stdclass,
            @$this->input->objid ?: new stdclass,
            @$this->input->queryconditions ?: new stdclass
        );
        if (!$sids) {
            $this->ok([]);
            return;
        }
        $data = $xav->balog(
            $this->_eid,
            $sids,
            @$this->input->viewtype ?: 'ep',
            @$this->input->queryconditions ?: new stdclass,
            @$this->input->paging ?: new stdclass
        );
        $groupModel = new GroupModel();
        $data['rows'] = array_map(function ($item) use ($groupModel) {
            $item['onlinestate'] = $groupModel->getClientOnlineState($item['eid'], $item['sguid'], $item['systype'], $item['unset']);
            return $item;
        }, $data['rows']);
        $this->ok($data);
    }
    #endregion
    public function getclientperilstatisticsAction()
    {
        $model = new XAVLogModel($this->_eid);
        $data = $model->getClientPerilStatistics($this->_eid);

        $this->ok($data);
    }
}
