<?php
use Gregwar\Captcha\CaptchaBuilder;

class IndexController extends MyController
{
    public function init()
    {
        parent::init();
    }

    public function indexAction()
    {
        $_SESSION['UserInfo']=null;
        session_destroy();
        if (UserModel::existsUser()) {
            $this->disply('Index/login');
            return;
        }
        $this->disply('Index/index');
    }

    public function testloginAction()
    {
        $_SESSION['login_code']='1234';
        $_REQUEST=[
            'name'=>'guodf',
            'pwd'=>'rising123',
            'code'=>'1234'
        ];
        $this->loginAction();
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
        if (empty($uName)||empty($uPwd)) {
            return $this->notice('用户名/密码不能为空', 1);
        }

        if (empty($vCode) || strtolower($vCode) !== strtolower(@$_SESSION['login_code'])) {
            return $this->notice('验证码错误', 2);
        }
        //验证码只能使用一次
        unset($_SESSION['login_code']);

        $result=UserModel::login($uName, $uPwd, function ($user) {
            $_SESSION['UserInfo']=$user;
        });
        if (is_array($result)) {
            return $this->notice($result['msg'], 3);
        }
        return $this->ok('Index/home', '登录成功');
    }

    public function homeAction()
    {
        return $this->disply('Home/index', '.php');
    }

    public function fpwdAction()
    {
        return $this->disply('Index/forgetpwd');
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
}
