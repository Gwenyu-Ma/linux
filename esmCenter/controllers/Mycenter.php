<?php
use \Lib\Util\Crypt;
use Intervention\Image\ImageManagerStatic as Image;
use Lib\Store\RedisCluster as Redis;
use Lib\Util\Ioa;
use Lib\Util\EmailQueue;

class MycenterController extends MyController
{
    public function init()
    {
        parent::init();
        Yaf_Dispatcher::getInstance()->disableView();
    }


    public function getDownloadUrlAction(){
        $eid = isset($this->_eid) ? $this->_eid : '';
        if(!$eid){
            $this->notice("未登录", 401);
            return;
        }
        $aRes['windows'] = '';
        $aRes['android'] = '';

        $window_ptf = 'windows';
        $urls = require(__DIR__ . '/../../config/urls.php');
        $dlurl = sprintf('%s/index/dl?platform=%s&eid=%s', $urls['platform'], $window_ptf, $eid);
        $result = (new DownloadModel())->getPackage($eid, $window_ptf);
        if(!empty($result['result']['dist']['link'])){
            $aRes['windows']['url'] = $result['result']['dist']['link'];
            $aRes['windows']['qr'] = '/index/qr?url=' . urlencode($dlurl);
        }

        $android_ptf = 'android';
        $result = (new DownloadModel())->getPackage($eid, $android_ptf);
        if(!empty($result['result']['dist']['link'])){
            $aRes['android']['url'] = $result['result']['dist']['link'];
            $aRes['android']['qr'] = '/index/qr?url=' . urlencode($dlurl);
        }
        $this->ok($aRes);
    }

    public function sendShareEmailAction(){
        $eid = isset($this->_eid) ? $this->_eid : '';
        if(!$eid){
            $this->notice("未登录", 401);
            return;
        }
        $emails = $this->param('emails', ''); //用冒号分割开的多个邮箱
        $ostype = $this->param('ostype', '');//windows ,android
        if($ostype !== 'windows' && $ostype !== 'android'){
            $this->notice("系统类型错误！");
        }
        if(empty($emails)){
            $this->notice("邮箱不能为空！");
        }

        $result = (new DownloadModel())->getPackage($eid, $ostype);
        if(!empty($result['result']['dist']['link'])){
            $packageDownloadUrl = $result['result']['dist']['link'];
        }

        $aEmail = explode(';',$emails);
        if(is_array( $aEmail ) && !empty($aEmail)){
            foreach($aEmail as $email){
                if(\Tx\Is::email($email)){
                    EmailQueue::push([['name'=>$email, 'email'=>$email,'oType'=>1]],
                        '瑞星安全云终端下载包地址',
                        Common::emailShareHtml($packageDownloadUrl)
                    );
                }
            }
            $this->ok('','分享成功');
        }

    }

     /*
     * 获取账号信息
     * @return [type] [description]
     */
    public function myinfoAction()
    {
        $org = (new OrganizationModel())->getOrganizationById($this->_eid);
        $user = (new UserModel())->getUserByID($this->_eid, $this->_uid);
        $baseinfo = (new SystemConfigModel())->getSystemInfo();

        $level = $this->_level;
        $data = $level == 1 ? [
            'userName'         => $user['UserName'],
            'title'            => $baseinfo['title'],   //主标题
            'subTitle'         => $baseinfo['subTitle'],//副标题
            'isOpenCenterPass' => !empty($org['PWD']), //是否启用中心密码  = >0不启用，1启用
            'centerPass'       => $org['PWD'],
            'company'          => $org['OName'],
            'industry'         => $org['Industry'],
            'companySize'      => $org['OSize'],
            'logo'             => '/mycenter/getlogo',
            'phone'            => $user['PhoneNO'],
            'email'            => $user['EMail'],
            'isFirstLogin'     => empty($user['LastLoginTime']) ? 0: 1, //0首次登陆，1后续登陆
            'avtor'            => '/mycenter/getlogo',
            'tel'              => $org['Tel'],
            'addr'             => $org['Addr'],
            'zcode'            => $org['ZipCode']

        ] : [
            'userName'         => $user['UserName'],
            'centerPass'       => $org['PWD'],
            'title'            => $baseinfo['title'],   //主标题
            'subTitle'         => $baseinfo['subTitle'],//副标题
            'company'          => $org['OName'],
            'tel'              => $org['Tel'],
            'addr'             => $org['Addr'],
            'zcode'            => $org['ZipCode'],
            'isFirstLogin'     => empty($user['LastLoginTime']) ? 0: 1, //0首次登陆，1后续登陆
            'isOpenCenterPass' => !empty($org['PWD']), //是否启用中心密码  = >false不启用，true启用
            'avtor'            => '/mycenter/getlogo'
        ];
        $_SESSION['company'] = $org['OName'];
        $this->ok($data, '成功');
    }

    /*
     * 授权信息
     * @return [type] [description]
     */
    public function accreditinfoAction()
    {
        $data = (new OrganizationModel())->getOrganizationById($this->_eid);

        if (empty($data)) {
            $this->notice('获取授权信息失败', 1);
            return;
        }
        $date = strtotime($data['CreateTime']);

        $this->ok([
            'registerTime' => date('Y-m-d', $date),
            'accreditState' => '正常',
            'expireTime' => date('Y-m-d', strtotime('+1 year', $date)),
        ], '成功');
    }

    /*
     * 客户端授权信息
     * @return [type] [description]
     */
    public function clientaccreditstatusAction()
    {
        $epModel = new EpModel();
        $result = $epModel->clientAccreditStatus($this->_eid);
        $this->ok($result, '成功');
    }

    /*
     * 云中心存储信息概况
     * @return [type] [description]
     */
    public function usedspaceAction()
    {
        $data = (new SysModel())->usedSpace($this->_eid);
        $this->ok($data, '成功');

    }

    /**
     * 修改密码
     */
    public function modifypwdAction()
    {
        $oldPwd = $this->param('oldPwd', '');
        $newPwd = $this->param('newPwd', '');
        if (empty($oldPwd) || empty($newPwd)) {
            $this->notice('密码不可为空', 1);
            return;
        }

        $userModel = new UserModel();
        $result = $userModel->modifyPwd($this->_eid, $this->_uid, $oldPwd, $newPwd);
        if (is_bool($result) && $result) {
            $this->ok(null, '修改密码成功');
            return;
        }
        $this->notice($result['msg'], 2);
    }


    /**
     * 修改账户信息
     */
    public function updatemyinfoAction()
    {
        $nickName = $this->param('nickName', '');
        $centerPass = $this->param('centerPass', '');
        $company = $this->param('company', '');
        $industry = $this->param('industry', '');
        $companySize = $this->param('companySize', 0);
        $tel = $this->param('tel', '');
        $addr = $this->param('addr', '');
        $zcode = $this->param('zcode', '');
        $oldOrg=$this->param('oldOrg','');
        if (mb_strlen($nickName) > 20 || mb_strlen($company) > 20) {
            $this->notice('企业名称或昵称太长', 1);
            return;
        }
        if(mb_ereg_match('[<>]',$nickName)||mb_ereg_match('[<>]',$company)||mb_ereg_match('[<>]',$industry)||mb_ereg_match('[<>]',$addr)){
            $this->notice('公司名称、昵称、所属行业、联系地址不能包含‘<’和‘>’字符',1);
            return;
        }
        //验证电话
        if(!empty($tel)&&!mb_ereg_match('^[0-9][0-9-]{6,16}$',$tel)){
            $this->notice('电话格式不正确',1);
            return;
        }
        //验证邮编
        if(!empty($zcode)&&!mb_ereg_match('^[1-9][0-9]{5}$',$zcode)){
            $this->notice('邮编格式错误',$zcode);
            return;
        }
        $level = $this->userinfo['Level'];
        $userModel = new UserModel();
        $result = $userModel->updateUser($this->_eid, $this->_uid, [
            'nickName' => $nickName,
        ],$oldOrg);

        $ok = is_bool($result) && $result;

        if ($level == 0) {
            $ok ? $this->ok(null, '成功') : $this->notice($result['msg'], 1);
            return;
        }
        if (empty($company)) {
            $this->notice('企业名称不能为空', 2);
            return;
        }
        if($company !== $_SESSION['company']){
            $objIoa = new IoaOrgidModel();
            $ioaOrgCode = $objIoa->getOrgidByEid( $this->_eid );

            /*
             * $ioaModel
             * stdClass Object
            (
                [status] => 1
                [msg] => 修改机构名称成功
                [resultCode] => 0000
                [data] => stdClass Object
                    (
                        [resultMsg] => 修改机构名称成功
                        [responseNo] => 8fdd303ded5d4a7c9547fdc0b9d22825
                        [platformNo] => rising
                        [resultCode] => 0000
                        [responseSign] => mnwncrkrwnjwcv7mrcOnWTTyoOcwu3vIRe5Vpnteaw/81wSMIHAPrTN9kQKAXELAOsiCSX6DdL64CLRUCgdLvVdZwcnTsWi3tYLWpbfCeuBYfxjnjtK3EwHlVaByQMdRrRvR9F8LT4HbtsM02j1SkGABOR/dvOS07+g9mFntCVs=
                    )

            )
             */

            $ioaModel = Ioa::changeIoaOrgName( $ioaOrgCode,$company );
            if( $ioaModel->data->resultCode !== '0000' ){
                Redis::lPush(REDIS_IOA_COMPANY_QUEUE, json_encode(array('eid'=>$this->_eid,'company'=>$company)));
            }

        }

        $org = [
            'PWD' => $centerPass,
            'OName' => $company,
            'Industry' => $industry,
            'OSize' => $companySize,
            'Tel' => $tel,
            'Addr' => $addr,
            'ZipCode' => $zcode
        ];
        $orgModel = new OrganizationModel();
        $result1 = $orgModel->updateOrganization($this->_eid, $org,$oldOrg);

        if (is_bool($result1) && $result1 && $ok) {
            $_SESSION['UserInfo']['NickName'] = $nickName;
            $this->ok(null, '修改成功');
            return;
        }
        $msg = is_array($result1) && !ok ? $result['msg'] . ',' . $result1['msg']
            : !ok ? $msg = $result['msg'] : $result1['msg'];
        $this->notice($msg, 1);
    }

    //上传logo
    public function uploadlogopreviewAction()
    {
        $_SESSION['logo'] = '';
        if (empty($_FILES['logo'])) {
            $this->notice('请选择图片', 1);
            return;
        }
        $exName = strtolower(pathinfo($_FILES['logo']['name'], PATHINFO_EXTENSION));
        if (!in_array($exName, ['gif', 'jpeg', 'jpg', 'bmp', 'png'])) {
            $this->notice('图片类型不支持', 2);
            return;
        }
        $logoFile = $_FILES['logo'];
        $logoSize = $logoFile['size'];
        if ($logoSize > 1024 * 1024) {
            $this->notice('图片超过1M', 3);
            return;
        }
        $logoPath = $logoFile['tmp_name'];
        $img = Image::make($logoPath);
        $data = substr($img->encode('data-url'), 5);
        $_SESSION['logo'] = $data;
        $this->ok([
            'size' => $logoSize,
            'height' => $img->height(),
            'width' => $img->width()
        ], '成功');
    }

    public function getlogopreviewAction()
    {
        $logoData = $_SESSION['logo'];
        echo Image::make('data:' . $logoData)->response();
    }

    /**
     * 上传公司logo
     */
    public function uploadlogoAction()
    {
        $_SESSION['logo'] = '';
        if (empty($_FILES['logo'])) {
            $this->notice('请选择图片', 1);
            return;
        }
        $exName = strtolower(pathinfo($_FILES['logo']['name'], PATHINFO_EXTENSION));
        if (!in_array($exName, ['gif', 'jpeg', 'jpg', 'bmp', 'png'])) {
            $this->notice('图片类型不支持', 2);
            return;
        }
        $left = $this->param('left', 0);
        $top = $this->param('top', 0);
        $width = $this->param('width', 100);
        $height = $this->param('height', 100);
        $logoFile = $_FILES['logo'];
        if ($logoFile['error'] != 0) {
            $this->notice('logo上传过程中生错误，请重试！', 2);
            return;
        }
        $filePath = $logoFile['tmp_name'];
        $orgModel = new OrganizationModel();
        $result = $orgModel->uploadLogo($this->_eid, $filePath, ['left' => $left, 'top' => $top, 'width' => $width, 'height' => $height]);
        if (is_bool($result) && $result) {
            $this->ok(null, '成功');
            return;
        }
        $this->notice($result['msg'], 3);
    }

    /*
     * 获取企业logo
     * @return [type] [description]
     */
    public function getlogoAction()
    {
        $orgModel = new OrganizationModel();
        echo $orgModel->getLogo($this->_eid);
    }

    /**
     * 上传用户图片
     */
    public function uploaduserlogoAction()
    {
        $_SESSION['logo'] = '';
        if (empty($_FILES['logo'])) {
            $this->notice('请选择图片', 1);
            return;
        }
        $exName = strtolower(pathinfo($_FILES['logo']['name'], PATHINFO_EXTENSION));
        if (!in_array($exName, ['gif', 'jpeg', 'jpg', 'bmp', 'png'])) {
            $this->notice('图片类型不支持', 2);
            return;
        }
        $left = $this->param('left', 0);
        $top = $this->param('top', 0);
        $width = $this->param('width', 100);
        $height = $this->param('height', 100);
        $logoFile = $_FILES['logo'];
        if ($logoFile['error'] != 0) {
            $this->notice('logo上传过程中生错误，请重试！', 2);
            return;
        }
        $filePath = $logoFile['tmp_name'];
        $userModel = new UserModel();
        $result = $userModel->uploadLogo($this->_eid, $this->_uid, $filePath, ['left' => $left, 'top' => $top, 'width' => $width, 'height' => $height]);
        if (is_bool($result) && $result) {
            $this->ok(null, '成功');
            return;
        }
        $this->notice($result['msg'], 3);
    }

    public function getuserlogoAction()
    {
        $userModel = new UserModel();
        echo $userModel->getLogo($this->_eid, $this->_uid);
    }

    public function resetlogoAction()
    {
        $orgModel = new OrganizationModel();
        $ok = $orgModel->resetLogo($this->_eid);
        $ok ? $this->ok(null, '成功') : $this->notice('重置logo失败', 1);
    }

    public function resetuserlogoAction()
    {
        $userModel = new UserModel();
        $ok = $userModel->resetLogo($this->_eid, $this->_uid);
        $ok ? $this->ok(null, '成功') : $this->notice('重置logo失败', 1);
    }

    //获取手机验证码
    public function getPhoneCodeAction()
    {
        if ($this->userinfo['Level'] == 0) {
            $this->notice('普通用户不能重新绑定账号', 1);
            return;
        }
        $phoneNo = $this->param('phoneNo', '');
        if (empty($phoneNo)) {
            $this->notice('请输入手机号', 2);
            return;
        }
        $userModel = new UserModel();
        $seccuss = $userModel->smsVerify(3, $phoneNo);
        if ($seccuss != 0) {
            Common::out(Common::returnAjaxMsg(2, 0, "获取验证码失败"));
        }
        Common::out(Common::returnAjaxMsg(0, 0, "验证码已发送，请查收"));
    }

    //重新绑定账号
    public function updateusernameAction()
    {
        if ($this->userinfo['Level'] == 0) {
            $this->notice('普通用户不能重新绑定账号', 1);
            return;
        }
        return empty($this->param('phone', '')) ? $this->updateUserNameByEmail() : $this->updateUserNameByPhone();
    }

    //通过手机绑定账号
    private function updateUserNameByPhone()
    {
        $userName = $this->param('userName', '');
        $pwd = $this->param('pwd', '');
        $phone = $this->param('phone', '');
        $checkCode = $this->param('checkCode', '');
        if (empty($userName) || empty($pwd) || empty($phone) || empty($checkCode)) {
            $this->notice('参数不可为空', 1);
            return;
        }
        if(!mb_ereg_match('^1[3|4|5|7|8][0-9]{9}$',$phone)){
            $this->notice('手机格式不正确', 1);
            return;
        }
        $userModel = new UserModel();
        if ($userModel->issetUserName($phone, 2)) {
            $this->notice('手机号已被注册', 2);
            return;
        }
        $result = $userModel->updateUserNameByPhone($this->_eid, $this->_uid, $userName, $pwd, $phone, $checkCode);
        if (is_array($result)) {
            $this->notice($result['msg'], 2);
            return;
        }
        $this->_updateAdminIoaInfo( $phone );
        $this->ok(null, '成功');
    }

    //通过邮箱找回手机号
    private function updateUserNameByEmail()
    {
        $userName = $this->param('userName', '');
        $pwd = $this->param('pwd', '');
        $email = $this->param('email', '');
        $code = $this->param('checkCode', '');

        if (empty($userName) || empty($pwd) || empty($email)) {
            $this->notice('参数不可为空', 1);
            return;
        }
        if(!mb_ereg_match('^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+',$email)){
            $this->notice('邮箱格式不正确', 1);
            return;
        }
        if (strcasecmp($code, @$_SESSION['captcha_keystring']) != 0) {
            $this->notice("验证码错误！", 3);
            return;
        }
        $userModel = new UserModel();

        if ($userModel->issetUserName($email, 1)) {
            $this->notice('此邮箱已被注册', 2);
            return;
        }
        $result = $userModel->updateUserNameByEmail($this->_eid, $this->_uid, $userName, $pwd, $email, $code);
        if (is_array($result)) {
            $this->notice($result['msg'], 2);
            return;
        }
        $this->_updateAdminIoaInfo( $email );
        $this->ok(null, '成功');
    }

    //通过手机号或者邮箱重新绑定账号时调用
    private  function _updateAdminIoaInfo( $newAdmin ){
        $eid = $this->_eid;
        $objIoa = new IoaOrgidModel();
        $aEid = $objIoa->getUseridAndOrgidByEid( $eid );
        if(empty($aEid )){
            Redis::lPush(REDIS_IOA_ADMIN_QUEUE, json_encode(array('eid'=>$this->_eid,'newAdmin'=>$newAdmin)));
            return;
        }

        $orgId = $aEid['orgid'];
        $userid = $aEid['userid'];
        /*
         * $aNewUser
         * stdClass Object
        (
            [status] => 1
            [msg] => 加入企业成功
            [resultCode] => 0000
            [data] => stdClass Object
                (
                    [resultMsg] => 加入企业成功
                    [responseNo] => b0554b2e87a842b7861a4cd562e290eb
                    [platformNo] => rising
                    [resultCode] => 0000
                    [responseSign] => DUeM+kNKHxrtr5UfeIefkSznDdMJ9sZC8pRrg0FIWdnp/d/7A7MVEJXoQtviN3Kd7NnzhZu++eXrqBOY/tsbUvfUIJpmpKW/UEuVRmo9USESHj9OZZp16fxJVOK/QIR3qxt1cz2Vsv9LT1U9ePuErx9rXQ9BGqPt9a2SBukCc1I=
                    [orgCode] => 5744d982be0e47679b4e7d4061e27c16
                    [userId] => d56e867c60e844d59809196505ccfb4f
                )

        )
         */
        $aNewUser = Ioa::addIoaOrgMember($orgId,$newAdmin);
        if( $aNewUser->resultCode !== '0000'){
            Redis::lPush(REDIS_IOA_ADMIN_QUEUE, json_encode(array('eid'=>$this->_eid,'newAdmin'=>$newAdmin)));
            return;
        }else{
            $newOrgCode = $aNewUser->data->orgCode;
            $newUserId = $aNewUser->data->userId;

            $resUpdate = $objIoa->updateDataByEid( $eid,$newOrgCode,$newUserId );
            if( !$resUpdate ){
                $this->notice('账号重新绑定失败', 1);
                return;
            }
            /*
         * $objModify
         * (stdClass)#31 (4) {
          ["status"]=>
          bool(true)
          ["msg"]=>
          string(27) "更换超级管理员成功"
          ["resultCode"]=>
          string(4) "0000"
          ["data"]=>
          object(stdClass)#44 (5) {
            ["resultMsg"]=>
            string(27) "更换超级管理员成功"
            ["responseNo"]=>
            string(32) "21ba716293154d3a861bc074fd964ce4"
            ["platformNo"]=>
            string(6) "rising"
            ["resultCode"]=>
            string(4) "0000"
            ["responseSign"]=>
            string(172) "nEXVgW8x1XafEFQJhhoOJj0S6BFDIrcJ5U55MWwYh8n/v6gMQeX5kGyXL+jXUI0AdopPCIEVZr0j1jP1ONA8V8nwRLvCsokR4aNtT0p48sjjxypKCRH9+QTGxoCBp4owh8dULhJphAKL0IOqAUubg5oBhSjJH+NWehsDMPqxLAY="
          }
        }
         */

            $objModify = Ioa::modifyIoaAdmin( $orgId, $userid, $newUserId );

            if(!$objModify->status){
                $this->notice('重新绑定管理员账号失败', 1);
                return;
            }
        }

    }

    //重设账号
    public function verifyMailLinkAction()
    {
        $token = $this->param('token', '');
        try {
            $data = Crypt::decrypt($token);
        } catch (\Exception $e) {
            $this->notice("非法请求", 1);
            return;
        }
        if ($data['for'] !== 'updateName' || time() - $data['time'] > 24 * 60 * 60) {
            $this->notice("非法请求", 1);
            return;
        }
        $userModel = new UserModel();

        $result = $userModel->updateUser($data['eid'], $data['uid'], ['userName' => $data['userName'], 'eMail' => $data['userName'], 'phoneNo' => '']);
        if (is_bool($result) && $result) {
            $this->ok(null, '修改成功');
            return;
        }
        $this->notice($result['msg'], 2);

    }

    public function testAction()
    {
        $this->_eid = '084627F653912335';
        $this->_uid = '084627F653912335';
        var_dump(['eid' => $this->_eid, 'UID' => $this->_uid]);
        echo '获取企业信息<br />';
        $this->eidinfoAction();
        echo '<br />';
        echo '获取用户信息<br />';
        $this->userinfoAction();
        echo '<br />';
        echo '获取授权信息<br />';
        $this->accreditinfoAction();
        echo '<br />';
        echo '获取客户端授权数<br />';
        $this->clientaccreditstatusAction();
        echo '<br />';
        echo '获取云中心存储信息概况<br />';
        $this->usedspaceAction();
        echo '<br />';
        echo '修改密码';
        $_REQUEST = [
            'oldPwd' => 'rising123',
            'newPwd' => 'rising111',
        ];
        $this->modifypwdAction();
        echo '<br />';
        echo '修改用户信息';
        $_REQUEST = [
            'userName' => 'guodf',
            'nickName' => 'guodf',
            'email' => 'guodf@rising.com.cn',
            'phone' => '15300318514',
        ];
        $this->updateuserAction();
        echo '<br />';
        echo '修改企业信息';
        $_REQUEST = [
            'centerPass' => '123456',
            'company' => '企业名称',
            'industry' => "所属行业",
            'companySize' => 1,
            'contact' => "联系人",
            'address' => "联系地址",
            'postCode' => "邮编",
            'tel' => "手机号码",
        ];
        $this->updateorgAction();
        echo '<br />';
        echo '<br />';
    }
}
