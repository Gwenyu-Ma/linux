<?php
class UserController extends MyController
{
    public function init()
    {
        parent::init();
    }

    /**
     * Undocumented function
     *
     * @return void
     */
    public function testregUserAction()
    {
        echo date('Y-m-d H:m:s',time());
        $_REQUEST=[
            'name'=>'guodf',
            'pwd1'=>'rising123',
            'pwd2'=>'rising123'
        ];

        $this->regUserAction();
    }

    /**
     * Undocumented function
     *
     * @return void
     */
    public function regUserAction()
    {
        if(!isset($_SESSION['iAuth'])){
            $this->disply('auth/Index/index');
            return;
        }

        $uName=$this->param('name',null);
        $pwd1=$this->param('pwd1',null);
        $pwd2=$this->param('pwd2',null);
        if(!$uName || !$pwd1 || !$pwd2){
            return $this->notice('注册信息不完整',1);
        }

        if($pwd1!=$pwd2){
            return $this->notice('密码不一致',2);
        }

        $result=UserModel::regUser($uName,$pwd1,$_SESSION['orgCount']);
        if(is_array($result)){
            return $this->notice($result['msg'],3);
        }
        unset($_SESSION['iAuth']);
        $loginResult=UserModel::login($uName,$pwd1,function($user){
                $_SESSION['UserInfo']=$user;
        });
        if(is_array($loginResult)){
            return $this->notice($loginResult['msg'],4);
        }

        $this->ok('Index/homeAuth', '登录成功');
        return;
    }

    public function testmodifyPwdAction()
    {
        $_REQUEST=[
            'name'=>'guodf',
            'pwd1'=>'hello123',
            'pwd2'=>'hello123'
        ];

        $this->modifyPwdAction();
    }

    public function modifyPwdAction()
    {
        if(!isset($_SESSION['iAuth'])){
            $this->disply('auth/Index/index');
            return;
        }
        $vCode=$this->param('code',null);
        if(empty($vCode) || strtolower($vCode) !== strtolower(@$_SESSION['login_code'])){
            return $this->notice('验证码错误',1);
        }
        //验证码只能使用一次
        unset($_SESSION['login_code']);

        // $uName=$this->param('name',null);
        $pwd1=$this->param('pwd1',null);
        $pwd2=$this->param('pwd2',null);
        if( empty($pwd1) || empty($pwd2)){
            return $this->notice('请输入密码',2);
        }
        if($pwd1!=$pwd2){
            return $this->notice('密码不一致',3);
        }
        $result=UserModel::modifyPwd(null,$pwd1);
        if(is_array($result)){
            return $this->notice($result['msg'],4);
        }
        return $this->ok('密码修改成功');
    }

    /**
     * 根据id获取用户信息
     */
    public function getUserByIdAction()
    {
        if (empty($_POST['eid']) || empty($_POST['userId'])) {
            Common::out(Common::returnAjaxMsg(1, 0, "参数错误。"));
        }
        $userModel = new UserModel();
        if (is_null($user = $userModel->getUserByID($_POST['eid'], $_POST['userId']))) {
            Common::out(Common::returnAjaxMsg(2, 0, "用户信息不存在。"));
            return;
        }
        Common::out(Common::returnAjaxMsg(0, 0, "成功。", $user));
    }

    /**
     * 更新用户信息
     */
    public function updateUserAction()
    {
        if (empty($_POST['eid']) || empty($_POST['userId'])) {
            Common::out(Common::returnAjaxMsg(1, 0, "参数错误。"));
        }
        $userModel=new UserModel();
        if($userModel->updateUser($_POST)){
            Common::out(Common::returnAjaxMsg(0, 0, "更新用户信息成功。"));
            return;
        }
        Common::out(Common::returnAjaxMsg(2, 0, "更新用户信息失败。"));
    }

    public function getusersettingAction()
    {
        $userModel=new UserModel();
        $result=$userModel->getUserSetting($this->_eid,$this->_uid);
        $this->ok($result,'成功');
    }

    public function setusersettingAction()
    {
        $userModel=new UserModel();
        $ok=$userModel->setUserSetting($this->_eid,$this->_uid,$this->param('setStr',''));
        $ok? $this->ok(null,'成功'):$this->notice('修改设置失败',1);
    }
}