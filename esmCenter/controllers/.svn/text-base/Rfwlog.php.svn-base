<?php

use ChromePhp as Console;
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016-04-18
 * Time: 15:28
 */
class RfwlogController extends MyController
{

    /**
     * 上网防护概览
     * rfwurl.audit   ----------违规上网 1/2/3
     * rfwiprule.rs      ----------黑客攻击 1/2/3
     * rfwtdi            --------- 违规程序 1/2/3
     * rfwflux           ----------流量管理 1/2/3
     * rfwshare          ----------共享管理 1/2/3
     */
    public function getRfwOverviewAction()
    {
        $objId = $this->param('objId', '');

        if (empty($objId)) {
            $this->notice('参数错误。', 1);
            return;
        }
        $argArr = ['objId' => $objId];
        $argArr['name'] = $this->param('name', '');
        $argArr['ip'] = $this->param('ip', '');
        $argArr['mac'] = $this->param('mac', '');
        $argArr['sys'] = $this->param('sys', '');
        $argArr['os'] = $this->param('os', '');

        $argArr['rfwurlaudit'] = $this->param('rfwurlaudit', -1);
        $argArr['rfwiprulers'] = $this->param('rfwiprulers', -1);
        $argArr['rfwtdi'] = $this->param('rfwtdi', -1);
        $argArr['rfwflux'] = $this->param('rfwflux', -1);
        $argArr['rfwshare'] = $this->param('rfwshare', -1);
        $argArr['productIds'] = ['53246C2F-F2EA-4208-9C6C-8954ECF2FA27'];
        $argArr['onlinestate']=$this->param('onlinestate',-1);
        $columns = array('rfwurlaudit', 'rfwiprulers', 'rfwtdi', 'rfwflux', 'rfwshare');
        $rfwLog = new RfwLogModel();

        $result = $rfwLog->GetRFWOverview($this->_eid, $argArr, $columns);

        $this->ok($result, '成功。');
    }

    public function testGetClientsOverviewAction()
    {
        $_REQUEST = [
            'objId' => 'CF4D7CC776882208',
            'rfwurlaudit' => '1',
            'rfwiprulers' => '1',
            'rfwtdi' => '1',
            'rfwflux' => '1',
            'rfwshare' => '1',
        ];

        $this->_eid = 'CF4D7CC776882208';
        $this->groupid = 'CF4D7CC776882208';
        $this->getRfwOverviewAction();
    }

    public function browsingAction()
    {
        $data = (new RfwLogModel())->browsing($this->_eid, $this->makeParams());
        if(is_string($data)){
            $this->alert($data);
            return;
        }
        $groupModel = new GroupModel();
        $data['rows'] = array_map(function($item)use($groupModel){
            $item['onlinestate'] = $groupModel->getClientOnlineState($item['eid'],$item['sguid']);
            return $item;
        }, $data['rows']);
        $this->ok($data);
    }

    public function ipaccessAction()
    {
        $data = (new RfwLogModel())->ipaccess($this->_eid, $this->makeParams());
        if(is_string($data)){
            $this->alert($data);
            return;
        }
        $groupModel = new GroupModel();
        $data['rows'] = array_map(function($item)use($groupModel){
            $item['onlinestate'] = $groupModel->getClientOnlineState($item['eid'],$item['sguid']);
            return $item;
        }, $data['rows']);
        $this->ok($data);
    }

    public function netprocAction()
    {
        $data = (new RfwLogModel())->netproc($this->_eid, $this->makeParams());
        if(is_string($data)){
            $this->alert($data);
            return;
        }
        $groupModel = new GroupModel();
        $data['rows'] = array_map(function($item)use($groupModel){
            $item['onlinestate'] = $groupModel->getClientOnlineState($item['eid'],$item['sguid']);
            return $item;
        }, $data['rows']);
        $this->ok($data);
    }

    public function sharedresaccessAction()
    {
        $data = (new RfwLogModel())->sharedresaccess($this->_eid, $this->makeParams());
        if(is_string($data)){
            $this->alert($data);
            return;
        }
        $groupModel = new GroupModel();
        $data['rows'] = array_map(function($item)use($groupModel){
            $item['onlinestate'] = $groupModel->getClientOnlineState($item['eid'],$item['sguid']);
            return $item;
        }, $data['rows']);
        $this->ok($data);
    }

    public function sharedreslistAction()
    {
        $data = (new RfwLogModel())->urlintercept11($this->_eid, $this->makeParams());
        if(is_string($data)){
            $this->alert($data);
            return;
        }
        $groupModel = new GroupModel();
        $data['rows'] = array_map(function($item)use($groupModel){
            $item['onlinestate'] = $groupModel->getClientOnlineState($item['eid'],$item['sguid']);
            return $item;
        }, $data['rows']);
        $this->ok($data);
    }
    public function newsharedreslistAction()
    {
        $ps = $this->makeParams();
        $later = [];
        $order = [];
        if(isset($ps['sharemode'])){
            $later['sharemode'] = $ps['sharemode'];
            unset($ps['sharemode']);
        }
        if(isset($ps['name'])){
            $later['name'] = $ps['name'];
            unset($ps['name']);
        }
        if(isset($ps['path'])){
            $later['path'] = $ps['path'];
            unset($ps['path']);
        }
        if(isset($ps['orderby'])){
            $order['orderby'] = $ps['orderby'];
            unset($ps['orderby']);
        }
        if(isset($ps['sort'])){
            $order['sort'] = $ps['sort'];
            unset($ps['sort']);
        }
        $data = (new RfwLogModel())->sharedreslist($this->_eid, $ps);
        if(is_string($data)){
            $this->alert($data);
            return;
        }
        $groupModel = new GroupModel();
        $data['rows'] = array_map(function($item)use($groupModel){
            $item['onlinestate'] = $groupModel->getClientOnlineState($item['eid'],$item['sguid']);
            return $item;
        }, $data['rows']);

        /*$rfw = new RfwLogModel();
        foreach($data['rows'] as &$v){
            $later['name'] = $v['name'];
            $v['_access'] = $rfw->getSharedresaccess($this->_eid, $later, $order);
        }*/

        $aNewData = array();
        $aNewData['total'] = $data['total'];
        $aNewData['rows'] = '';
        if(is_array($data['rows']) && !empty($data['rows'])){
            $rowNum = count( $data['rows'] );
            $out = 0;
            for($rowI = 0;$rowI<$rowNum; $rowI++){
                $in=0;
                if( empty($data['rows'][$rowI]) ){
                    continue;
                }
                $aNewData['rows'][$out] = $data['rows'][$rowI];
                $aNewData['rows'][$out]['_access'][$in] = $data['rows'][$rowI];
                for($rowJ=$rowI+1;$rowJ<$rowNum;$rowJ++){
                    if($data['rows'][$rowI]['sguid'] == $data['rows'][$rowJ]['sguid']){
                        $in++;
                        $aNewData['rows'][$out]['_access'][$in] = $data['rows'][$rowJ];
                        unset($data['rows'][$rowJ]);
                    }
                }
                $out++;
            }

        }
        $this->ok($aNewData);
    }

    public function terminalflowAction()
    {
        $data = (new RfwLogModel())->terminalflow($this->_eid, $this->makeParams());
        if(is_string($data)){
            $this->alert($data);
            return;
        }
        $groupModel = new GroupModel();
        $data['rows'] = array_map(function($item)use($groupModel){
            $item['onlinestate'] = $groupModel->getClientOnlineState($item['eid'],$item['sguid']);
            return $item;
        }, $data['rows']);
        $this->ok($data);
    }

    public function urlinterceptAction()
    {
        Console::log($this->_eid);
        $data = (new RfwLogModel())->urlintercept($this->_eid, $this->makeParams());
        if(is_string($data)){
            $this->alert($data);
            return;
        }
        $groupModel = new GroupModel();
        $data['rows'] = array_map(function($item)use($groupModel){
            $item['onlinestate'] = $groupModel->getClientOnlineState($item['eid'],$item['sguid']);
            return $item;
        }, $data['rows']);
        $this->ok($data);
    }

    public function makeParams()
    {
        $args = [];
        $in = json_decode(file_get_contents('php://input'));
        $args['view'] = $in->viewtype;
        if($in->objtype == 1){
            $args['groupid'] = $in->objid;
        }
        if(!empty($in->paging->sort)){
            $args['orderby'] = $in->paging->sort;
        }
        if(!empty($in->paging->order)){
            $args['sort'] = 'desc';
        }else{
            $args['sort'] = 'asc';
        }
        if(!empty($in->paging->offset)){
            $args['offset'] = $in->paging->offset;
        }
        if(!empty($in->paging->limit)){
            $args['limit'] = $in->paging->limit;
        }
        foreach($in->queryconditions as $k=>$v){
            if($v === ''){
                continue;
            }
            if($k=='begintime'){
                $args['stime'] = $v;
            }elseif($k=='endtime'){
                $args['etime'] = $v;
            }elseif($k=='searchtype'){
                if(!empty($in->queryconditions->searchkey)){
                    $args[$v] = $in->queryconditions->searchkey;
                }
            }elseif($k=='searchkey'){
            }else{
                $args[$k] = $v;
            }
        }
        Console::log($args);
        return $args;
    }

    public function getURLAuditAction()
    {
        $model = new RfwLogModel();
        $data = $model->getURLAudit($this->_eid);

        $this->ok($data);
    }

    public function getFlowAuditAction()
    {
        $model = new RfwLogModel();
        $data = $model->getFlowAudit($this->_eid);

        $this->ok($data);
    }

    public function getUrlInterceptAction()
    {
        $model = new RfwLogModel();
        $data = $model->getUrlIntercept($this->_eid);

        $this->ok($data);
    }
}
