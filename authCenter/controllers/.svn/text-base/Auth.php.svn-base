<?php
use Lib\Util\DateTimeFormatter;

class AuthController extends MyController
{
    public function init()
    {
        parent::init();
    }
    public function testimportAuthAction()
    {
        $_SESSION['iAuth']='test';

        AuthModel::importAuth('',APP_PATH.'../auth/auth.lic');
    }

    public function importAuthAction()
    {
        if(empty($_FILES['auth'])){
            $this->notice('请选择授权文件',1);
            return;
        }
        $authFile=$_FILES['auth'];
        $fPath = $authFile['tmp_name'];
        $aPath=APP_PATH.'../auth';
        if(!file_exists($aPath)){
            $this->notice('上传授权文件失败',1);
        }
        $exName = strtolower(pathinfo($authFile['name'], PATHINFO_EXTENSION));
        if(strcasecmp($exName,'lic')!=0){
            $this->notice('授权文件格式错误，必须为lic格式',1);
            return ;
        }
        $isOk = copy($fPath,$fPath=APP_PATH.'../auth/auth.lic');
        if(!isOk){
            $this->notice('上传授权文件失败',2);
            return;
        }
        $sn=$this->param('sn',null);
        if(empty($sn)){
            $this->notice('请输入授权序列号',3);
            return;
        }
        $result=AuthModel::importAuth($sn,function($data){
            $data['bDate']=date('Y年m月d日',$data['bDate']);
            $data['eDate']=date('Y年m月d日',$data['eDate']);
            $this->ok($data,'导入授权成功');
        });
        if(is_array($result)){
            $this->notice($result['msg'],4);
            return;
        }
        $_SESSION['iAuth']=$sn;
        return;
    }

    public function testcheckAuthAction()
    {
        $_SESSION['iAuth']='test';
        echo $_SESSION['iAuth'];
        // AuthModel::checkAuth('',APP_PATH.'../auth/auth.lic');
        $this->checkAuthAction();
    }

    public function checkAuthAction()
    {
        if(empty($_FILES['auth'])){
            $this->notice('请选择授权文件',1);
            return;
        }
        $authFile=$_FILES['auth'];

        $exName = strtolower(pathinfo($authFile['name'], PATHINFO_EXTENSION));
        if(strcasecmp($exName,'lic')!=0){
            $this->notice('授权文件格式错误，必须为lic格式',1);
            return ;
        }
        $fPath = $authFile['tmp_name'];
        copy($fPath,$fPath=APP_PATH.'../auth/auth.lic');
        $sn=$this->param('sn',null);
        if(empty($sn)){
            $this->notice('请输入授权序列号',2);
            return;
        }
        $result=AuthModel::checkAuth($sn);
        if(is_array($result)){
            $this->notice($result['msg'],3);
            return;
        }
        $_SESSION['iAuth']=$sn;
        return $this->ok('导入授权成功');
    }
}