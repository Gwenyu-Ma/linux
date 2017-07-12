<?php
use \Lib\Store\Mysql;

class MyController extends Yaf_Controller_Abstract
{
    public $_global_config = array();
    protected $_form_config = array();
    protected $userinfo;
    protected $request;
    protected $_eid;
    protected $_uid;
    protected $_userName;
    protected $_level;
    protected $authAction;
    public function init()
    {
        Yaf_Dispatcher::getInstance()->disableView();
        $this->request = Yaf_Dispatcher::getInstance()->getRequest();
        if (!empty($_SESSION['UserInfo'])) {
            $this->userinfo = $_SESSION['UserInfo'];
            $this->_eid = $this->userinfo['eid'];
            $this->_uid = $this->userinfo['id'];
            $this->_userName = $this->userinfo['name'];
            $this->_level=intval($this->userinfo['level']);

            Yaf_Loader::import(APP_PATH . "conf/access.php");
            $this->authAction = $access_control;
            $cName=$this->request->getControllerName();
            $aName=strtolower($this->request->getActionName());
            //判断用户类型
            if($this->_level == 1){
                if(!(array_key_exists($cName,$this->authAction)) ){
                    //session_destroy();
                    //$_SESSION['UserInfo']=null;
                    $this->notice('其它账号已经在本机登录,请重新登陆!', 401);
                    exit;
                }
            }else if($this->_level == 0){
                if(array_key_exists($cName,$this->authAction) && in_array($aName,$this->authAction[$cName])){
                    //session_destroy();
                    //$_SESSION['UserInfo']=null;
                    $this->notice('其它账号已经在本机登录,请重新登陆!', 401);
                    exit;
                }
            }
            return;
        }
       
        
       
        $aAuth = array('Authmanager','Enterprisemanager','SystemConfig','Packages');
        if (!in_array($this->request->getControllerName(), ['Index','Center', 'Error','Auth','User'])) {
            if ($this->request->isXmlHttpRequest()) {
                $this->notice("未登录", 401);
            } else {
                if (in_array($this->request->getControllerName(), $aAuth)) {
                    header('Location: /Center');
                } else {
                    header('Location: /');
                }
            }
            exit;
        }

    }

    public function param($name, $default = null)
    {
        $params = $this->request->getRequest();
        if (!isset($params[$name])) {
            return $default;
        }
        return $params[$name];
    }
    public function params()
    {
        return $this->request->getRequest();
    }

    // ok, here your data
    public function ok($data, $message = '')
    {
        $this->response(0, 0, $message, $data);
    }
    // notice
    public function notice($msg, $code = 0)
    {
        $this->response($code, 0, $msg, null);
    }
    // :(
    public function alert($msg, $code = 0)
    {
        $this->response($code, 1, $msg, null);
    }
    // 参数说明：状态码(0:成功,1：失败,2：超时），客户端行为(0:提示,1:弹窗),返回客户端弹窗内容，响应数据
    public function response($code, $action, $msg, $data)
    {
        $result = array(
            "r" => array(
                "code" => $code,
                "action" => $action,
                "msg" => $msg,
            ),
            'data' => $data,
        );
        echo json_encode($result);
    }

    //获取当前控制器下表单配置信息
    public function includeFormConfig()
    {
        Yaf_Loader::import(APP_PATH . "conf/form.php");
        $current_controller = $this->getRequest()->getControllerName();
        $this->_form_config = $form[strtolower($current_controller)];
    }


    //获取当前控制器下表单配置信息
    public function includeGlobalConfig()
    {
        require APP_PATH . "conf/config.php";
        $this->_global_config = $config;
    }

    public function assign($tpl_var, $val = null)
    {
        $this->_view->assign($tpl_var, $val);
    }

    public function getTitle()
    {
        return Mysql::getCell('SELECT title FROM auth_base_info');
    }

    public function disply($html, $suffix = '.html', $message = '')
    {
        $URL = '/';
        $this->_view->assign("pub", $URL . "public/");

        $this->_view->assign("pubAuth", $URL . "public/manage");
        $this->_view->assign("jsAuth", $URL . "public/manage/js");
        $this->_view->assign("cssAuth", $URL . "public/manage/css");
        $this->_view->assign("imgAuth", $URL . "public/manage/img");

        $this->_view->assign("pubEsm", $URL . "public/esm");
        $this->_view->assign("jsEsm", $URL . "public/esm/js");
        $this->_view->assign("cssEsm", $URL . "public/esm/css");
        $this->_view->assign("imgEsm", $URL . "public/esm/img");

        $title = $this->getTitle();
        empty($title)?$title = '瑞星终端安全管理':$title=$title;
        $this->_view->assign("title", $title);

        $this->_view->assign('user', json_encode($this->userinfo));
        echo $this->_view->render($html . $suffix, $message);
    }
}
