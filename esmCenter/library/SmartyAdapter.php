<?php
/**
 * 视图引擎定义
 * 作者：邰利龙 2012年10月30日
 * 学习点：使用了arrayObject的方法，可以让smarty assign更好用，省代码 o(∩_∩)o 哈哈
 */
class SmartyAdapter implements Yaf_View_Interface {

    /**
     * Smarty object
     * @var Smarty
     */
    public $_smarty;
    public $vvar;
    /**
     * Constructor
     *
     * @param string $tmplPath
     * @param array $extraParams
     * @return void
     */
    public function __construct($tmplPath = null, $extraParams = array()) {
        $this->_smarty = new Smarty;

        if (null !== $tmplPath) {
            $this->setScriptPath($tmplPath);
        }
        if(!is_dir($extraParams['compile_dir'])){
            mkdir($extraParams['compile_dir']);
        }
        foreach ($extraParams as $key => $value) {
            $this->_smarty->$key = $value;
        }
        $this->vvar=new \ArrayObject(array(),\ArrayObject::ARRAY_AS_PROPS);//可以更方便的设置模版变量
    }

   /**
     * Return the template engine object
     *
     */
    public function getEngine() {
        return $this->_smarty;
    }

    public function setScriptPath($path)
    {
        if (is_readable($path)) {
            $this->_smarty->template_dir = $path;
            return;
        }

        throw new Exception('Invalid path provided');
    }

    public function getScriptPath()
    {
        return $this->_smarty->template_dir;
    }

    public function setBasePath($path, $prefix = 'Zend_View')
    {
        return $this->setScriptPath($path);
    }

    public function addBasePath($path, $prefix = 'Zend_View')
    {
        return $this->setScriptPath($path);
    }

    public function __set($key, $val)
    {
        $this->_smarty->assign($key, $val);
    }

    public function __isset($key)
    {
        return (null !== $this->_smarty->get_template_vars($key));
    }

    public function __unset($key)
    {
        $this->_smarty->clear_assign($key);
    }

    public function assign($spec, $value = null) {
        if (is_array($spec)) {
            $this->_smarty->assign($spec);
            return;
        }

        $this->_smarty->assign($spec, $value);
    }

    public function clearVars() {
        $this->_smarty->clear_all_assign();
    }

    public function render($name, $value = NULL) {
        return $this->_smarty->fetch($name);
    }

    public function display($name, $value = NULL) {
        $arr=  $this->vvar->getArrayCopy();
        $this->_smarty->assign($arr);//此处不明白display的调用，去掉了$this->_smarty->display($name);
    }

}

?>
