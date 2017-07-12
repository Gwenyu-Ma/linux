<?php
use Lib\Store\Mysql;
use Lib\Util\Common;
use Lib\Model\AutoGroup;
use Lib\Model\RedisDataManager;
use \Lib\Store\MysqlWriteCluster as MW;
use \Lib\Util\logs;
use \Lib\Util\Crypt;
use \Lib\Util\EmailQueue;
use Intervention\Image\ImageManagerStatic as Image;

class UserModel
{

    protected $db_obj;
    protected $redis;
    public $_global_config = array();
    private $prefilx = "locate_";
    private $field = "";
    private $dbname = "db";
    private $USER_NAME_TYPE = array(
        1 => "EMail",
        2 => "PhoneNO",
    );
    public $collection;
    public function __construct()
    {
        $this->collection = select_manage_collection('groupinfo');
        //$this->redis = Redis::getInstance();
    }

    /*
     * 用户登录
     *
     * @param [string] $uName 用户名
     * @param [string] $uPwd 密码
     * @param [function($userInfo){}] $cb 登录成功后回调函数
     * @return bool/array   成功：true，失败：['msg'=>'错误信息']
     */
    public static function login($uName, $uPwd, $cb)
    {
        $user=Mysql::getRow('select EID,UserId,UserName,PWD,Salt,Level from esm_user where userName=?',[$uName]);

        if(empty($user))
        {
            add_oplog('执行','1001',$uName,null,null,1, '登录失败,用户不存在');
            return ['msg'=>'用户名/密码错误'];
        }

        if(strcasecmp(Common::passMd5($uPwd,  $user['Salt']),$user['PWD'])!=0)
        {
            add_oplog('执行','1001',$uName,null,null,1, '登录失败,密码错误');
            return ['msg'=>'用户名/密码错误'];
        }

        Mysql::exec('update esm_user set LastLoginTime=? where UserId=?',[date('Y-m-d H:i:s'),$user['UserId']]);
        logs::logError('执行'.$uName.'登录失败,密码错误！');
        $cb([
            'eid'=>$user['EID'],
            'id'=>$user["UserId"],
            'name'=>$user['UserName'],
            'level'=>$user['Level']
        ]);
        return true;
    }

    /*
     * 判断用户是否存在
     *
     * @param [type] $uName
     * @return void
     */
    private static function isExistsUser($uName)
    {
        $where='';
        $pamras=[];
        if(!empty($uName)){
            $where=' where UserName=?';
            $pamras[]=$uName;
        }
        return Mysql::getCell('select count(*) from esm_user '.$where,$pamras)>0;
    }

    public static function regUser($uName, $pwd,$orgCount)
    {
        //检查用户是否存在
        if (self::isExistsUser($uName)) {
            return ['msg'=>'此用户已经存在'];
        }

        $salt = Common::saltMd5();
        $pwdMD5=Common::passMd5($pwd, $salt);
        $ini_org_eid=self::generEid();
        if(empty($ini_org_eid)){
            return ['msg'=>'注册失败，无可用企业ID'];
        }
        //添加新用户
        $count=Mysql::exec('insert into esm_user(UserName,EID,PWD,Salt,Level,CreatedTime,LastLoginTime) values(?,?,?,?,?,?,?)', [
            $uName,
            $ini_org_eid,
            $pwdMD5,
            $salt,
            $orgCount==1? 2:1,
            date('Y-m-d H:m:s', time()),
            date('Y-m-d H:m:s', time())
        ]);

        Mysql::exec('insert into esm_organization(EID,CreateTime) values(?,?)',[$ini_org_eid, date('Y-m-d H:m:s', time())]);

        if ($count>0) {
            return true;
        }
        return [
            'msg'=>'注册失败'
        ];
    }

    //修改密码
    public static function modifyPwd($uName, $pwd)
    {
        //检查用户是否存在
        if (!self::isExistsUser($uName)) {
            return ['msg'=>'此用户不存在'];
        }
        $salt=Common::saltMd5();
        $pwdMD5=Common::passMd5($pwd, $salt);

        $where='';
        $pamras=[
            $pwdMD5,
            $salt
        ];
        if(!empty($uName)){
            $where=' where userName=?';
            $pamras[]=$uName;
        }
        $id=Mysql::exec('update esm_user set PWD=?,Salt=?'.$where, $pamras);
        if ($id>0) {
            return true;
        }
        return [
            'msg'=>'修改密码失败'
        ];
    }

    /**
     * 检查是否存在用户
     *
     * @return bool
     */
    public static function existsUser()
    {
        return Mysql::getCell('select count(*) from esm_user where Level=1 or Level=2')>0;
    }

    public static function existsOneUser(){
        return Mysql::getCell('select count(*) from esm_user where Level=2')>0;
    }

    public static function existsMoreUser(){
        return Mysql::getCell('select count(*) from esm_user where Level=1 ')>0;
    }

    /**
     * 生成EID
     *
     * @return void
     */
    public static function generEID()
    {
        $i=0;
        $ini_org_eid='';
        do{
            $ini_org_eid = strtoupper(substr(str_replace(".", "", uniqid("", true)), -16));
            $i++;
        }
        while( $i<10  && self::existsEID($ini_org_eid));
        return $ini_org_eid;
    }

    /**
     * EID是否存在
     *
     *  [string]  $eid
     *  void
     */
    public static function existsEID($eid)
    {
        return Mysql::getCell('select count(*) from esm_organization where EID=?',[$eid])>0;
    }

    public function getUserSetting($eid,$uid)
    {
        $userSetting=select_manage_collection('usersetting');
        $result=$userSetting->findOne(['eid'=>$eid,'uid'=>$uid],['setStr'=>true]);
        return empty($result['setStr'])? '':$result['setStr'];
    }

    public function setUserSetting($eid,$uid,$setStr)
    {
        $userSetting=select_manage_collection('usersetting');
        $okResult=$userSetting->update([
                'eid'=>$eid,
                'uid'=>$uid
            ],[
                '$set'=>[
                    'eid'=>$eid,
                    'uid'=>$uid,
                    'setStr'=>$setStr
                ]
            ],[
                'upsert' => true,
            ]);
        return is_array($okResult) && isset($okResult['ok']) && $okResult['ok'] == 1;
    }

    /**
     * 根据id获取用户信息
     *
     * @param string $eid
     * @param string $id
     */
    public function getUserByID($eid, $id)
    {
         $sql = "SELECT
                EID,
                UserName,
                EMail,
                PhoneNO,
                PWD,
                Salt,
                Status,
                Level,
                CreatedTime,
                LastLoginTime,
                modifiedTime
                FROM esm_user where EID='".$eid."' and UserId='".$id."'";
        return Mysql::getRow($sql);
    }

    public function getLogo($eid,$uid)
    {
        $result = Mysql::getCell("SELECT imageinfo FROM esm_user where EID='$eid' and UserId=$uid");
        if (!empty($result)) {
            return Image::make($result['imageinfo'])->response();
        } else {
            $logoPath= __dir__.'/../../public/esm/img/user.png';
            return Image::make($logoPath)->response();
        }
    }

  /**
     *
     * @param
     *            $str
     * @return array
     *         用过用户名称找到用户id
     */
    public function getUserIDByName($str)
    {
        $this->field = $this->prefilx . 'UserName';
        return $this->db_obj->getListOne("esm_user", array(
            "UserID",
        ), array(
            $this->field => $str,
        ));
    }

    /**
     *
     * @param
     *            $str
     * @return array cx
     *         用过用户id找到用户名称
     */
    public function getUserNameByID($int)
    {
        $this->field = $this->prefilx . 'UserID';
        return $this->db_obj->getListOne("esm_user", array(
            "UserName",
        ), array(
            $this->field => $int,
        ));
    }

    /**
     *
     * @param
     *            $params_org
     * @return bool cx
     *         org创建成功，创建用户信息
     */

    public function createUserInfo($params_org)
    {
        $createTime = $params_org['CreateTime'];
        $userid = $this->db_obj->insertTab('esm_user', $params_org);
        if (!$userid) {
            return false;
        }
        return true;
    }

    public function activeUser($eid)
    {
        $row = $GLOBALS['DB']->fetchRow('select Status from esm_user where EID=?', [$eid]);
        if(intval($row['Status']) === 1){
            Log::error("ERROR_ACTIVE", ['actived']);
            return false;
        }
        //RedisDataManager::setEPOffLineTime($eid,$eid,$eid);

        MW::setEID($eid);
        MW::exec("CALL create_neweid_tables('$eid');");
        $tb = "RFW_UrlInterceptLog_$eid";
        $r = MW::getCell("select table_name from information_schema.tables where table_name='$tb'");
        if(!$r){
            Log::error("ERROR_ACTIVE", ['db process error']);
            return false;
        }

        //创建组
        $groupModel = new GroupModel();
        $defaultGroup = $groupModel->AddGroup('默认分组', '默认分组', $eid, 0);

        if (is_bool($defaultGroup) && !$defaultGroup) {
            Log::error("ERROR_ACTIVE", ['add group error 0']);
            return false;
        }

        $serverGroup = $groupModel->AddGroup('服务器', '服务器', $eid, 1);
        if (is_bool($serverGroup) && !$serverGroup) {
            Log::error("ERROR_ACTIVE", ['add group error 1']);
            return false;
        }
        $androidGroup = $groupModel->AddGroup('安卓手机', '安卓手机', $eid, 1);
        if (is_bool($androidGroup) && !$androidGroup) {
            Log::error("ERROR_ACTIVE", ['add group error 2']);
            return false;
        }
        $blackGroup = $groupModel->AddGroup('黑名单', '黑名单', $eid, 2);
        if (is_bool($blackGroup) && !$blackGroup) {
            Log::error("ERROR_ACTIVE", ['add group error 3']);
            return false;
        }
        //添加自动入组策略
        $autoGroup = new AutoGroup();
        $rules = [
            ['groupid' => $serverGroup['id'], 'rule' => [['type' => 'os', 'symbol' => 'has', 'value' => 'server']]],
            ['groupid' => $serverGroup['id'], 'rule' => [['type' => 'os', 'symbol' => 'has', 'value' => 'linux']]],
            ['groupid' => $androidGroup['id'], 'rule' => [['type' => 'os', 'symbol' => 'has', 'value' => 'android']]],
        ];
        //var_dump($rules);
        $ok = $autoGroup->updateRules($eid, $rules);
        //var_dump('ok:', $ok);
        if (!(is_bool($ok) && $ok)) {
            Log::error("ERROR_ACTIVE", ['update auto group error']);
            return false;
        }
        $result = $GLOBALS['DB']->update('esm_user', ['Status' => 1], "EID = '$eid'");

        if (!$result) {
            Log::error("ERROR_ACTIVE", ['update esm_user error']);
            return false;
        }
        //初始化redis
        RedisDataManager::initByEID($eid);

        return true;
    }


    public function checkPhoneCode($phone, $code, $type)
    {
        $result = $this->db_obj->getListOne("esm_phonemsg", array('CheckCode', "SendTime"), array("locate_PhoneNO" => $phone, "locate_MsgType" => $type), "SendTime", "DESC");
        if (empty($result)) {
            return false;
        }

        //var_dump($phone, $code, $result);

        if ($result['CheckCode'] == $code && time() - strtotime($result['SendTime']) <= EXPERIOD_CODE_TIME) {
            return true;
        }
        return false;
    }

    /**
     *
     * @param
     *            $params_org
     * @return int|string cx
     *         新用户注册 创建org信息 cx
     */
    public function createUserOrgInfo($params_org)
    {
        return $this->db_obj->insertTab('rs_esm_soho.esm_organization', $params_org);
    }

    /**
     *
     * @param
     *            $orgEID
     * @param
     *            $crateOrgInfoID
     * @return bool cx
     *         创建企业EID
     */
    public function createOrgEID($orgEID, $crateOrgInfoID)
    {
        $result = $this->db_obj->updateTab('esm_organization', array(
            "EID" => $orgEID,
        ), array(
            "locate_OID" => $crateOrgInfoID,
        ));
        if ($result) {
            return true;
        } else {
            false;
        }
    }

    /**
     *
     * @param
     *            $orgID
     * @return int cx
     *         创建用户失败删除org信息
     */
    public function deleteOrgEID($orgID)
    {
        $this->field = $this->prefilx . 'OID';
        return $this->db_obj->deleteTab('esm_organization', array(
            $this->field => $orgID,
        ));
    }

    /**
     *
     * @param
     *            $str
     * @param
     *            $type
     * @return bool cx
     *         判断新用户名称是否存在数据库
     *
     */
    public function issetUserName($str, $type)
    {
        $this->field = $this->prefilx . $this->USER_NAME_TYPE[$type];
        $result = $this->db_obj->getListOne("esm_user", "UserID", array(
            $this->field => $str,
        ));
        if ($result) {
            return true;
        } else {
            return false;
        }
    }

    /**
     *
     * @param
     *            $str
     * @param
     *            $type
     * @return array cx
     */
    public function getUserNameInfo($str_user_name, $type)
    {
        $this->field = $this->prefilx . $this->USER_NAME_TYPE[$type];
        $result = $this->db_obj->getListOne("esm_user",
            array(
                'UserID',
                "UserName",
                "EID",
                "PhoneNO",
                "Status",
                "EMail",
                "PWD",
                "UType",
                "Level",
                "LockState",
                "CreateTime",
                "NickName",
                "Salt"),
            array(
                $this->field => $str_user_name,
            ));
        return $result;
    }

    /**
     *
     * @param
     *            $str_user_pass
     * @param
     *            $type
     * @param
     *            $str_user_name
     * @return int cx
     */
    public function updateUserPass($str_user_pass, $type, $str_user_name)
    {
        $this->field = $this->prefilx . $this->USER_NAME_TYPE[$type];
        return $this->db_obj->updateTab("esm_user", array(
            "PWD" => $str_user_pass,
        ), array(
            $this->field => $str_user_name,
        ));
    }

    // 获取指定条件下的校验信息
    public function getUserActivate($params)
    {
        $where = array();
        if ($params['email'] != '') {
            $where['locate_EMail'] = $params['email'];
        }

        if ($params['token'] != '') {
            $where['locate_Token'] = $params['token'];
        }

        if ($params['type'] != '') {
            $where['locate_EType'] = $params['type'];
        }

        return $this->db_obj->getListOne("esm_emailsend", array(
            'UserID',
        ), $where);
    }

    /**
     *
     * @param
     *            $init_uaid
     * @return array cx true 对
     */
    public function getActivationByUaid($init_uaid)
    {
        $this->field = $this->prefilx . 'UAID';
        $result = $this->db_obj->getList("esm_emailsend", array(
            'Token',
            'CreateTime',
            'EMail',
        ), array(
            $this->field => $init_uaid,
        ));
        return $result;
    }

    /**
     *
     * @param
     *            $init_status
     * @param
     *            $str_user_id
     * @return bool cx
     */
    public function updateUserStatus($init_status, $str_user_id)
    {
        $this->field = $this->prefilx . 'UserID';
        $result = $this->db_obj->updateTab('esm_user', array(
            "Status" => $init_status,
        ), array(
            $this->field => $str_user_id,
        ));
        if ($result) {
            return true;
        } else {
            false;
        }
    }
    public function updateEmailAsync($id)
    {
        $this->field = $this->prefilx . 'UAID';
        $result = $this->db_obj->updateTab('esm_emailsend', array(
            "SendState" => 1,
        ), array(
            $this->field => $id,
        ));
        if ($result) {
            return true;
        } else {
            false;
        }
    }

    /**
     * 获取指定邮箱的账户信息
     *
     * @param string $email
     * @return userInfo
     */
    public function getUserInfoByEmail($email)
    {
        return $this->db_obj->getListOne("esm_user", array(
            "UserID",
            "UserName",
            "EMail",
            "Status",
        ), array(
            "locate_EMail" => $email,
        ));
    }

    /**
     *
     * @param string $phone
     * @return userInfo
     */
    public function getUserInfoByPhone($phone)
    {
        return $GLOBALS['DB']->fetchRow('select u.EID,u.Status,u.UserID,u.UserName,u.PhoneNO,o.OType from esm_user u left join esm_organization o on u.EID=o.EID  where u.PhoneNO=?', $phone);
        // return $this->db_obj->getListOne("esm_user", array(
        //     "UserID",
        //     "UserName",
        //     "PhoneNO",
        //     "Status",
        // ), array(
        //     "locate_PhoneNO" => $phone,
        // ));
    }

    /**
     * 重置密码
     */
    public function resetPwd($userID, $pwd)
    {
        $salt = Common::saltMd5();
        $pass = Common::passMd5($pwd, $salt);
        $userData = array(
            'PWD' => $pass,
            'Salt' => $salt,
        );
        $this->db_obj->updateTab("esm_user", $userData, array(
            "locate_UserID" => $userID,
        ));
        return true;
    }

    /**
     *
     * @param
     *            $eid
     * @return array cx
     */
    public function eidAlreadyIn($eid)
    {
        $this->field = $this->prefilx . 'EID';
        return $this->db_obj->getListOne("esm_user", 'EID', array(
            $this->field => $eid,
        ));
    }

    /**
     *
     * @param $type 发短信类型
     *            1注册验证 2找回密码
     * @param $phoneNo 手机号码
     *            11位
     * @return int 0成功 1失败
     */
    public function smsVerify($type, $phoneNo)
    {
        $result = 1; // 0成功 1失败

        // 检查参数
        if (!isset($type) || !isset($phoneNo)) {
            return $result;
        }

        if (!is_int($type)) {
            return $result;
        }

        // 校验手机号码合法性
        if (!Common::checkPhone($phoneNo)) {
            return $result;
        }

        // 生成验证码
        $checkCode = mt_rand(100000, 999999);

        $msg = Common::phoneMsg(array(
            'code' => $checkCode,
            'type' => $type,
        ));

        $insertData = array(
            'CheckCode' => $checkCode,
            'Message' => $msg,
            'MsgType' => $type,
            'PhoneNO' => $phoneNo,
            'SendTime' => date("Y-m-d H:i:s"),
        );

        $model = new PhoneMsgModel();
        $rowCount = $model->addPhoneMsg($insertData);
        if ($rowCount < 1) {
            // Common::out(Common::showJsonMsg($result, 0, "数据库插入失败！"));
            return $result;
        }

        $result = Common::esmSend($phoneNo, $msg) ? 1 : 0;
        return $result;
    }
    public function getUEidByUID($int)
    {
        $this->field = $this->prefilx . 'UserID';
        return $this->db_obj->getListOne("esm_user", array(
            "EID",
        ), array(
            $this->field => $int,
        ));
    }

    // 激活是创建mongo数据库信息
    public function createMongoTable($str_user_eid)
    {
        $content = array(
            'id' => time(),
            'groupname' => '全网计算机',
            'description' => '全网计算机',
            'edate' => time(),
        );
        $result = $this->collection()->insert($content);
        // 维护的eid数量
        if ($result) {
            return true;
        } else {
            return false;
        }
    }

    /**
     *
     * @return string 获取可负载的mongo数据库信息和库名
     */
    public function getAbleMongoDB()
    {
        $result = $this->db_obj->getList("esm_mongodb_info");

        if ($result) {
            foreach ($result as $k) {
                $able[$k['Host'] . '/' . $k['DbName']] = $k['MaxEidCnt'] - $k['CurrentEidCnt'];
            }
            $str_able_mongo_path = array_keys($able, max($able))[0];
            $path_chunk = explode('/', $str_able_mongo_path);
            $db_name = $path_chunk[1];
            $arr_path = array(
                'cnt' => 1, // 可修改
                'host' => $path_chunk[0], // array('host' => $path_chunk[0]),
                'manage_db' => $db_name,
                'log_db' => str_replace('manage', 'log', $db_name),
            );
        }
        $result = json_encode($arr_path);
        return json_encode(str_replace('"', "'", $result));
    }

    public function getUserByEmail($email)
    {
        if(!$email){
            return null;
        }
        return $GLOBALS['DB']->fetchRow('select u.EID,u.Status,u.UserID,u.UserName,o.OType from esm_user u left join esm_organization o on u.EID=o.EID  where u.Email=?', $email);
    }



    /**
     * 修改用户信息
     * @param 用户信息 $params
     * @return boolean
     */
    public function updateUser($eid, $uid, $params,$oldOrg)
    {
        $data = [];
        $source=[];
        if (isset($params['userName'])) {
            $data['UserName'] = $params['userName'];
            $source[]='用户名';
        }
        if (isset($params['nickName'])) {
            $data['NickName'] = $params['nickName'];
            $source[]='昵称';
        }
        if (isset($params['eMail'])) {
            $data['EMail'] = $params['eMail'];
            $source[]='邮箱';
        }
        if (isset($params['phoneNo'])) {
            $data['PhoneNo'] = $params['phoneNo'];
            $source[]='联系电话';
        }
        if (isset($params['uType'])) {
            $data['UType'] = $params['uType'];
        }
        if (isset($params['level'])) {
            $data['level'] = $params['level'];
        }

        $where = array(
            'locate_EID' => $eid,
            'locate_UserId' => $uid,
        );
        //var_dump([$data,$where]);
        $result = $this->db_obj->updateTab("esm_user", $data, $where);
        //var_dump($result);
        if ($result >= 0) {
            add_oplog(3,9001,'编辑账户',$oldOrg,json_encode($params),'成功','编辑账户信息成功');
            return true;
        }
        add_oplog(3,9001,'编辑账户',$oldOrg,json_encode($params),'修改用户信息时发生错误','编辑账户信息失败');
        return ['msg' => '修改用户信息时发生错误'];
    }

    public function uploadLogo($eid,$uid,$filePath,$rect)
    {
        //imageinfo
        $img=Image::make($filePath);
        $img->crop($rect['width'],$rect['height'],$rect['left'],$rect['top']);
        //$img->resize(35,35);
        $data=$img->encode('data-url');
        $where = array(
            'locate_EID' => $eid,
            'locate_UserId' => $uid,
        );
        $result = $this->db_obj->updateTab('esm_user', [
            'imageinfo'=>$data
        ], $where);

        if($result>=0){
            add_oplog(3,9001,'头像',null,null,'成功');
            return true;
        }
        add_oplog(3,9001,'头像',null,null,'修改头像失败');
        return ['msg'=>'修改头像失败'];
    }

    public function resetLogo($eid,$uid)
    {
        $where = array(
            'locate_EID' => $eid,
            'locate_UserId' => $uid,
        );
        $result = $this->db_obj->updateTab('esm_user', [
            'imageinfo'=>null
        ], $where);
        return $result>=0;
    }



    //根据手机重设账号
    public function updateUserNameByPhone($eid,$uid,$userName,$pwd,$phone,$checkCode)
    {
        $phoneModel = new PhoneMsgModel();
        $phoneMsg = $phoneModel->getPhoneMsg($phone, 3);
        //var_dump($phoneMsg);
        if(strcasecmp($phoneMsg["CheckCode"], $checkCode)!=0){
            return ['msg'=>'验证码错误'];
        }
      //验证原始密码
        $user = $this->db_obj->getlistOne('esm_user', array(
            "PWD",
            "Salt",
        ), array(
            'locate_EID' => $eid,
            'locate_UserId' => $uid,
        ));
        //var_dump($user);
        if (strcasecmp($user['PWD'], Common::passMd5($pwd, $user['Salt']))!=0) {
            return [
                'msg' => '密码错误',
            ];
        }
        return $this->updateUser($eid,$uid,['userName'=>$userName,'phoneNo'=>$userName,'eMail'=>'']);
    }
    //根据邮箱重设账号
    public function updateUserNameByEmail($eid,$uid,$userName,$pwd,$email)
    {
        //验证原始密码
        $user = $this->db_obj->getlistOne('esm_user', array(
            "PWD",
            "Salt",
        ), array(
            'locate_EID' => $eid,
            'locate_UserId' => $uid,
        ));
        if (strcasecmp($user['PWD'], Common::passMd5($pwd, $user['Salt']))!=0) {
            return [
                'msg' => '密码错误',
            ];
        }

        $data = array(
            'eid'=>$eid,
            'for' => 'updateName',
            'uid' => $uid,
            'userName'=>$userName,
            'time' => time(),
        );
        $token = Crypt::encrypt($data);
        EmailQueue::push([['name'=>$email, 'email'=>$email,]],
            '重置账号',
            Common::emailUpdateNameHtml($token)
        );
        return true;
    }

    public function isFirstLogin($uid)
    {
        return Mysql::getCell('select LastLoginTime from esm_user where UserID=?', [$uid]);
    }

    public function afterLogin($eid, $uid)
    {
       // if(!Mysql::getCell('select LastLoginTime from esm_user where UserID=?', [$uid])){
            $msg = new MessageModel();
            $ok = $msg->addSubscriber("b:$eid:admins:$uid", json_encode([
                "rs:welcome:$eid:admins:$uid",
                "b:$eid:pf:ep:new",
                "b:$eid:pf:ep:uninst",
            ]));
            if(is_string($ok)){
                Log::add('ERROR', ['response'=>$ok]);
            }

            $ok = $msg->makeMsg(json_encode(["rs:welcome:$eid:admins:$uid"]), '       欢迎加入瑞星安全云大家庭，瑞星安全云是全新一代SaaS模式管理、服务中心，使用专属于您的云中心，可以集中管理Windows、Linux、手机等各种平台的终端，并享受瑞星专家服务，帮您更好的防范、发现、解决安全问题，信息安全，一切尽在掌握。<br/><br/>添加新终端：<br/>直接下载“安全中心\终端部署情况”下专属于您中心的终端安装包并安装，安装后即可自动加入您的中心，接受您的管理。', '欢迎使用瑞星安全云');
            if(is_string($ok)){
                Log::add('ERROR', ['response'=>$ok]);
            }
        //}
        Mysql::exec(sprintf("update esm_user set LastLoginTime='%s' where UserID=?", date('Y-m-d H:i:s', time())), [$uid]);
    }



    public function logout()
    {
        add_oplog('执行','1002',null,null,null,0, '注销成功');
        $_SESSION['UserInfo'] = null;
        $_SESSION['GroupInfo'] = null;
    }

}
