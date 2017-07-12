<?php
class Bootstrap extends Yaf_Bootstrap_Abstract{
    private $_config;

    public function _initBootstrap(){
        $this->_config = Yaf_Application::app()->getConfig();
        session_start();
    }

    public function _initIncludePath(){
        set_include_path(get_include_path().PATH_SEPARATOR.$this->_config->application->library);
    }

    public function _initSmarty(Yaf_Dispatcher $dispatcher) {
        $smarty = new SmartyAdapter(null, require(APP_PATH .'/conf/smarty.php'));
        Yaf_Dispatcher::getInstance()->setView($smarty);
    }

}
