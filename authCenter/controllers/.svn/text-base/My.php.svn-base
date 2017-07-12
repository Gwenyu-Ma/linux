<?php
use \Lib\Store\Mysql;
class MyController extends Yaf_Controller_Abstract
{

    public function init()
    {
        Yaf_Dispatcher::getInstance()->disableView();
        $this->request = Yaf_Dispatcher::getInstance()->getRequest();
        if (!in_array($this->request->getControllerName(), ['Index','Auth', 'Error','User'])) {
            if (!$_SESSION['UserInfo']['name']) {
                if ($this->request->isXmlHttpRequest()) {
                    $this->notice('未登录', 401);
                    exit();
                } else {
                    header('Location: /');
                }
            }
        }
    }

    public function getTitle(){
        return Mysql::getCell('SELECT title FROM auth_base_info');
    }

    /**
     * 判断是否登录
     *
     * @return bool
     */
    public function IsLogin()
    {
        return !empty($_SESSION['UserInfo']);
    }

    /*
     * 获取登录名称
     *
     * @return [string] 用户名
     */
    public function getLoginUserName()
    {
        return $_SESSION['UserInfo']['name'];
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

    public function assign($tpl_var, $val = null)
    {
        $this->_view->assign($tpl_var, $val);
    }

    public function disply($html, $suffix = '.html', $message = '')
    {
        $URL = '/';
        $this->_view->assign("pub", $URL . "public");
        
        $title = $this->getTitle();
        empty($title)?$title = '瑞星产品授权':$title=$title;
        $this->_view->assign("title", $title);
        $this->_view->assign("pubAuth", $URL . "public/auth");
        $this->_view->assign("jsAuth", $URL . "public/auth/js");
        $this->_view->assign("cssAuth", $URL . "public/auth/css");
        $this->_view->assign("imgAuth", $URL . "public/auth/img");

        echo $this->_view->render($html . $suffix, $message);
    }
}
