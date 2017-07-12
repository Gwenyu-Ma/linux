<?php

use \Lib\Util\Common as UCommon;
use Gregwar\Captcha\CaptchaBuilder;
use Lib\Model\RedisDataManager;

class IndexController extends MyController
{
    public $collection;
    public function init()
    {
        parent::init();
    }

    public function indexAction()
    {
        $_SESSION['UserInfo']=null;
        session_destroy();
        if(UserModel::existsOneUser()){
            $this->disply('auth/Index/login');
            return;
        }else if( UserModel::existsMoreUser() ){
            $this->disply('esm/Index/login');
            return;
        }else{
            $this->disply('auth/Index/index');
        }
        /*if (UserModel::existsUser()) {
            $this->disply('esm/Index/login');
            return;
        }
        $this->disply('auth/Index/index');*/
    }

    /*
     * 登录
     * @param [string] name 用户名
     * @param [string] pwd 密码
     * @param [string] code 验证码
     *
     * @return $this->ok()/$this->notice()
     */
    public function loginAction()
    {
        $uName=$this->param("name", null);
        $uPwd=$this->param("pwd", null);
        $vCode=$this->param("code", null);
        $level=$this->param('level',0);
        if (empty($uName)||empty($uPwd)) {
            $this->notice('用户名/密码不能为空', 1);
            return;
        }

        if (empty($vCode) || strtolower($vCode) !== strtolower(@$_SESSION['login_code'])) {
             $this->notice('验证码错误', 2);
             return;
        }

        //验证码只能使用一次
        unset($_SESSION['login_code']);
        $result=UserModel::login($uName, $uPwd, function ($user) {
            $_SESSION['UserInfo']=$user;
        });
        if (is_array($result)) {
             $this->notice($result['msg'], 3);
            return;
        }
        $uLevel=$_SESSION['UserInfo']['level'];

        if( ($level==1&&$uLevel==0)||($level==0&&$uLevel==1)){
            $this->notice("用户名/密码错误！",4);
            return;
        }
        if( $uLevel == 2){
            $level = $uLevel;
        }

        $model=new UserModel();
        $model->afterLogin($_SESSION['UserInfo']['eid'],$_SESSION['UserInfo']['id']);
        RedisDataManager::setEPOffLineTime($_SESSION['UserInfo']['eid'],$_SESSION['UserInfo']['eid'],$_SESSION['UserInfo']['eid']);
        $this->ok($level==1? 'Index/homeAuth':'Index/home', '登录成功');
        return;
    }

    public function homeAuthAction()
    {
        $this->disply('auth/Home/index', '.php');
    }

    public function homeAction()
    {

        $this->disply('esm/Manage/index2','.php');
    }

    public function fpwdAction()
    {
        $this->disply('auth/Index/forgetpwd');
    }

    /**
     * 生成验证码
     */
    public function verifyAction()
    {
        $builder = new CaptchaBuilder;
        $builder->setDistortion(false);
        $builder->setIgnoreAllEffects(true);
        $builder->setMaxBehindLines(0);
        $builder->setMaxFrontLines(0);

        $builder->build();
        //$builder->build($width = 160, $height = 60, $font = null);

        //验证码字符串放入session
        $_SESSION['login_code'] = $builder->getPhrase();
        header('Content-Type: image/jpeg');
        $builder->output();
    }

     public function packageAction()
    {
        $eid = isset($this->_eid) ? $this->_eid : '';
        if(!$eid){
            $this->notice("未登录", 401);
            return;
        }
        $ptf = $this->param('platform', '');
        $urls = require(__DIR__ . '/../../config/urls.php');
        $dlurl = sprintf('%s/index/dl?platform=%s&eid=%s', $urls['platform'], $ptf, $eid);
        $result = (new DownloadModel())->getLanPackage($eid, $ptf);
        if(!is_array($result)){
            $this->notice($result, 1);
            return;
        }
        if($result['error']){
            $this->notice($result['error'], 1);
            return;
        }
        if(!empty($result['result']['base']['link'])){
            $result['result']['base']['qr'] = '/index/qr?url=' . urlencode($dlurl);
        }
        if(!empty($result['result']['dist']['link'])){
            $result['result']['dist']['qr'] = '/index/qr?url=' . urlencode($dlurl);
        }
        $this->ok($result['result']);
    }

    /**
     * 退出
     */
    public function logOutAction()
    {
        $_SESSION['UserInfo'] = null;
        header('Location: /');
    }
}