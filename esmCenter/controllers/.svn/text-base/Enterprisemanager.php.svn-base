<?php
use \Lib\Util\Common;
use \Lib\Util\logs;
use Lib\Util\rc4;
use \Lib\Store\Redis;
use \Lib\Util\DateTimeFormatter;

class EnterprisemanagerController extends MyController
{
    public function init()
    {
        parent::init();
    }
     //测试添加企业管理员
    public function testenterpriseAddAction(){
        $param['UserName'] = 'hello';
        $param['EMail'] = '';
        $param['PhoneNo'] = '15910303731';
        $param['OName'] = 'Hello,World';
        $param['PWD'] = 'Rising123';
        $_REQUEST = $param;
        $this->enterpriseAddAction();
    }


    //企业账号创建（帐号名称、邮箱、手机、公司名称、规模、）
    public function enterpriseAddAction(){
        $UserName = $this->param('UserName',null);
        $EMail = $this->param('EMail','');
        $PhoneNo = $this->param('PhoneNo','');
        $OName = $this->param('OName',null);
        $str_user_pwd    = $this->param('PWD', '');

        $obj = new EnterpriseManagerModel();

        if( $obj->issetUserName($UserName) ) {
            $this->notice("用户名称已经被注册，请重新设置。", 10);
            return false;
        }

        $i=0;
        do{
            $ini_org_eid = strtoupper(substr(str_replace(".", "", uniqid("", true)), -16));
            $i++;
        }
        while( $i<10  && $obj->eidAlreadyIn($ini_org_eid) );
        if($i>=10){
            $this->notice("用户组织信息创建失败！");
            return false;
        }

        $str_create_time = date("Y-m-d H:i:s",time());

        $params_org = array(
            'OName'=> $OName,                      
            'CreateTime'=> $str_create_time,
            'EID' => $ini_org_eid,
        );
       
        $obj->createUserOrgInfo($params_org);
        
        $Salt     = Common::saltMd5();
        $str_user_pwd  = Common::passMd5($str_user_pwd, $Salt, $encrypt = 'md5');
        $para_arr = array(
            'EID'        =>strval($ini_org_eid),
            'UserName'   => $UserName,
            'EMail'      => $EMail ,
            'PhoneNO'     => $PhoneNo ,
            'PWD'        => $str_user_pwd,
            'Salt'       => $Salt,
            'Status'     => 0,
            'Level'      => 0,
            'CreateTime' => $str_create_time,
        );
    
        if( !$obj->createUserInfo($para_arr) ) {
            $this->notice("注册企业失败请重新注册。", 1);
        }
     
        $down = new DownloadModel();
        $down->addEID($para_arr['EID']);

        if(!$obj->activeUser($para_arr['EID'])){
            Lib\Model\Clean::cleanRubbishInfo( $para_arr['EID'] );
            logs::logError("$UserName激活失败");
            $this->notice("激活用户失败。", 1);
        }
        $this->ok( array('eid'=>$ini_org_eid),'创建企业成功!' );
    }

    //获取企业管理统计数据
    public function getTotalNumAction(){
        $aRes = array();
        $aRes['authTotal'] = $this->getAuthNum();
        $aAuth = $this->getUsersNum();
        $aRes['authNum'] = $aAuth['auth']>0?$aAuth['auth']:0;
        $aRes['notAuthNum'] = $aAuth['notAuth']>0?$aAuth['notAuth']:0;
        $aRes['usersNum'] = $aRes['authNum'] +$aRes['notAuthNum'];
        $aRes['soonExpireNum'] = $this->getSoonExpireNum();
       
        $this->ok( $aRes );
    }

    //授权总用户数
    private function getAuthNum(){
        $authNum = 0;
        $datetime = date('Y-m-d');
        $obj = new EnterpriseManagerModel();
        $rc4 = new rc4();
        $aAuth = $obj->getAuthNum();

        foreach( $aAuth as $auth ){
            $start = DateTimeFormatter::formatStrToDate($rc4->decrypt($auth['notBefore']));
            $end = DateTimeFormatter::formatStrToDate($rc4->decrypt( $auth['notAfter']));
            if($start <= $datetime && $end >= $datetime){
                $authNum = $authNum + $auth['orgcount'];
            }
        }
        return $authNum;
    }

    //创建的授权用户数和未授权用户数
    private function getUsersNum(){
        $obj = new EnterpriseManagerModel();
        return $obj->getUsersNum();
    }

    //统计即将过期的企业数
    private function getSoonExpireNum(){
        $arr = array();
        $nextMonth = date("Y-m-d",strtotime("+1 month"));
        $today = date('Y-m-d');
        $obj = new EnterpriseManagerModel();
        
        return $obj->getSoonExpireNum( $today,$nextMonth);
        
    }

    //企业账号列表
    public function enterpriseListAction(){
        $nextMonth = date("Y-m-d",strtotime("+1 month"));
        $today = date('Y-m-d');

        $in = json_decode(file_get_contents('php://input'));
        $limit = $in->paging->limit;
        $offset = $in->paging->offset;
        $order = $in->paging->order;
        $sort = $in->paging->sort;

        $UserName = $in->queryconditions->UserName;
        $OName = $in->queryconditions->OName;
        $createStartTime = $in->queryconditions->createStartTime;
        $createEndTime = $in->queryconditions->createEndTime;
        $status = intval($in->queryconditions->status);
        $aParams = array(
            'UserName' => $UserName,
            'OName' => $OName,
            'createStartTime' => $createStartTime,
            'createEndTime' => $createEndTime,
            'Status' =>$status,
            'limit' => $limit,
            'offset' => $offset,
            'sort' => $sort,
            'order' => $order
        );

        $obj = new EnterpriseManagerModel();

        $arr = $obj->getEnterpriseList( $aParams );
        $aEnterPries  = $arr['row'];
        foreach( $aEnterPries as $key => $val){
            $accreditEndTime = '';
            $aProduct = $obj->getProduct( $val['EID']);
            $aEnterPries[$key]['productNum'] = count( $aProduct );
            if( intval($val['Status']) == 1 ){
                foreach( $aProduct as $product ){
                   if($product['endTime'] >= $today && $product['endTime'] <= $nextMonth){
                       $aEnterPries[$key]['Status'] = 2; //即将到期
                       break;
                   }else if($product['endTime'] < $today && !$iStatus){
                       $aEnterPries[$key]['Status'] = 3;//过期
                   }else{
                       $iStatus = true;
                   }

                  if(strtotime($product['endTime']) > strtotime($accreditEndTime)){
                      $accreditEndTime = $product['endTime'];
                  }
                }
            }
            $aEnterPries[$key]['accreditEndTime'] = $accreditEndTime;
        }

        if(intval($status) > 0){//搜索即将到期和过期的企业
            $k = 0;
            $newarr = array();
            foreach( $aEnterPries as  $key => $value){
                if($value['Status'] == $status){
                    $newarr[$k] = $value;
                    $k++;
                }
            }
            //$newarr = list_sort_by( $newarr,'Status');
            $aRes['total'] = count( $newarr );
            $aRes['rows'] = $newarr;
            $this->ok( $aRes );
            return ;
        }
        //$aEnterPries = list_sort_by( $aEnterPries,'Status');
        $aRes['total'] = $arr['total'];
        $aRes['rows'] = $aEnterPries;
        $this->ok( $aRes );
    }


    public function testproductListAction(){
        $param['EID'] = 'B5665B1332892456';
        $_REQUEST = $param;
        $this->productListAction();
    }

    //企业子产品列表
    public function productListAction(){
        $EID = $this->param('EID',null);
        $obj = new EnterpriseManagerModel();
        $aRes = $obj->getProductList( $EID );
        $this->ok( $aRes );
    }

    public function testeditErpriseAction(){
        $param['EID'] = 'B5665B1332892456';
        $param['UserName'] = 'rising';
        $param['EMail'] = 'admin@rising.com.cn';
        $param['PhoneNo'] = '15910303731';
        $param['OName'] = 'hello';
        $_REQUEST = $param;
        $this->editErpriseAction();
    }

    //企业信息编辑
    public function editErpriseAction(){
        $EID = $this->param('EID',null);
        $UserName = $this->param('UserName',null);
        $EMail = $this->param('EMail',null);
        $PhoneNo = $this->param('PhoneNo',null);
        $OName = $this->param('OName',null);

        $obj = new EnterpriseManagerModel();
        if( $obj->issetUserName($UserName,$EID) ) {
            $this->notice("用户名称已经被注册，请重新设置。", 10);
            return false;
        }
        if($obj->issetOName($OName,$EID)){
            $this->notice("企业名称已经被存在，请重新设置。", 10);
            return false;
        }
        $time = date('Y-m-d H:i:s');

        $aUser = [
            $UserName,
            $EMail,
            $PhoneNo,
            $time,
            $EID,
            
        ];

        $aParam = [
            $OName,
            $time,
            $EID
        ];
        $boolUser = $obj->updateUser( $aUser);
        $boolOrg = $obj->updateOrganization( $aParam );
        if( $boolUser && $boolOrg){
            $this->ok('编辑企业信息成功!');
        }else{
            $this->notice('修改企业信息失败!');
        }
    }

     //删除没有授权的企业
    public function delEnterpriseAction(){
        $EID = $this->param('EID',null);
        if(empty($EID)){
            $this->notice("参数错误。", 10);
        }
        Lib\Model\Clean::cleanByEid( $EID );
        $this->ok('删除企业成功!');
    }

    public function testpassEditAction(){
        $param['EID'] = 'B5665B1332892456';
        $param['passwd'] = 'rising';
        $param['repasswd'] = 'rising';
        $_REQUEST = $param;
        $this->passEditAction();
    }

    //企业管理员密码重置提交
    public function passEditAction(){
        $EID = $this->param('EID',null);
        $passwd = $this->param('passwd',null);
        $repasswd = $this->param('repasswd',null);

        if( $passwd !== $repasswd ) {
            $this->notice("两次密码不一致。", 12);
        }
        $Salt     = Common::saltMd5();
        $password  = Common::passMd5($passwd, $Salt, $encrypt = 'md5');
        $aParams = [
            $password,
            $Salt,
            $EID
        ];
        $obj = new EnterpriseManagerModel();
        if($obj->updateEntPwd( $aParams )){
            $this->ok('修改企业密码成功!');
        }else{
            $this->notice("修改企业密码失败!");
        }
    }


    //获取保存日志
    public function getLogsSetAction(){
        $eid = $this->_eid;
        $obj = new EnterpriseManagerModel();
        $aRes = $obj->getLogsSet( $eid );
        $this->ok( $aRes);
    }

    public function testsetLogsSetAction(){
        $aParams = [
            [
               'tablename' => 'RFW_BrowsingAuditLog',
               'cleantype' => 1, 
               'days' =>90,
               'nums' =>1000
            ],
            [
               'tablename' => 'Eplog',
               'cleantype' => 1, 
               'days' =>10,
               'nums' =>2000
            ]
        ];
        $_REQUEST = [
            'strJson' => json_encode($aParams,true)
        ];
        
        $this->setLogsAction();
    }

    //保存日志设置配置
    public function setLogsAction(){
        $eid = $this->_eid;
        $strJson = $this->param('strJson',null);
        $aLogs = json_decode( $strJson );

        $obj = new EnterpriseManagerModel();

        foreach( $aLogs as $log){
            if( intval($log->nums) > 0){
                $aParams = [
                    $log->days,
                    $log->nums,
                    $log->tablename
                ];
                $obj->modifyLogSet( $aParams ,$eid );
            }else{
                $aParams = [
                    $log->days,
                    $log->tablename
                ];
                $obj->modifyLogSetDays( $aParams ,$eid );
            } 
        }
        $this->ok('日志保留设置成功!');
    }

}