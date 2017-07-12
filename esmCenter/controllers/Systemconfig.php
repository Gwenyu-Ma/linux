<?php
use Intervention\Image\ImageManagerStatic as Image;
/**
 * @Author:   wangyl
 * @Company:  Rising
 * @DateTime: 2017-03-21T16:20:02+0800
 * @Softwara: Visual Studio Code
 * @Description: 系统设置Controller
 */
class SystemConfigController extends MyController
{
    public function init()
    {
        parent::init();
    }
    /**
     * 获取系统设置信息
     */
    public function getSystenInfoAction()
    {
        $loginName = $this->_userName;
        $objModel  = new SystemConfigModel();
        $baseInfo  = $objModel->getSystemInfo();
        $pwdInfo   = $objModel->getOldPassWd($loginName);
        $data = [
            'loginName' => $loginName,
            'title'     => $baseInfo['title'],
            'subTitle'  => $baseInfo['subTitle'],
            'logoImg'   => '/Systemconfig/getLogo',
            'loginPwd'  => $pwdInfo['PWD'],
            'domainUrl' => $baseInfo['domainUrl'],
            'islogo'    => $baseInfo['logoImg']
        ];
        $this->ok($data,'成功');
    }
    /**
     * 修改密码
     */
    public function modifyPassWdAction()
    {
        $loginName = $this->_userName;
        $pwd1      = $this->param('pwd1', '');
        $newpwd1   = $this->param('newpwd1', '');
        $newpwd2   = $this->param('newpwd2', '');

        $objModel = new SystemConfigModel();
        $oldInfo  = $objModel->getOldPassWd( $loginName );
        //当前输入的原密码
        $oldPwdMD5 = Common::passMd5($pwd1, $oldInfo['Salt']);
        //当前输入原密码和数据库对比
        if ($oldPwdMD5 != $oldInfo['PWD']) {
            $this->notice("旧密码输入错误。", 1);
            return;
        }
        if (strlen($pwd1)<8 || strlen($newpwd1)<8 || strlen($newpwd2)<8) {
            $this->notice("密码格式错误，请重新输入。", 2);
            return;
        }
        if (empty($pwd1) || empty($newpwd1) || empty($newpwd2)) {
            $this->notice('密码不可为空', 3);
            return;
        }
        if ($newpwd1 != $newpwd2) {
            return $this->notice('两次输入密码不一致', 4);
        }
        $returninfo = $objModel->modifyPassWd($loginName,$newpwd1);
        if(is_array($returninfo)){
            return $this->notice($returninfo['msg'],5);
        }
        return $this->ok(null,'密码修改成功');
    }
    /**
     * 上传自定义logo
     */
    public function uploadLogoAction()
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
            $this->notice('logo上传过程中生错误，请重试！', 3);
            return;
        }
        $filePath = $logoFile['tmp_name'];
        $orgModel = new SystemConfigModel();
        $result = $orgModel->uploadLogo($filePath, ['left' => $left, 'top' => $top, 'width' => $width, 'height' => $height]);
        if (is_bool($result) && $result) {
            $this->ok(null, '成功');
            return;
        }
        $this->notice($result['msg'], 4);
    }
    /**
     * 获取自定义logo
     */
    public function getLogoAction()
    {
        $objModel = new SystemConfigModel();
        echo $objModel->getCompanyLogo();
    }
    /**
     * 上传自定义logo预览
     */
    public function uploadLogoPreviewAction()
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
    /**
     * 获取自定义logo预览
     */
    public function getLogoPreviewAction()
    {
        $logoData = $_SESSION['logo'];
        echo Image::make('data:' . $logoData)->response();
    }
    /**
     * 重置自定义logo
     */
    public function resetLogoAction()
    {
        $objModel = new SystemConfigModel();
        $result   = $objModel->resetCompanyLogo();
        if (is_bool($result) && $result) {
            $this->ok(null, '成功');
            return;
        }
        $this->notice($result['msg'], 1);
    }
    /**
     * 提交更新系统设置
     */
    public function updateSystemConfigAction()
    {
        $title       = $this->param('title', '');
        $subTitle    = $this->param('subTitle', '');
        $domainUrl   = $this->param('domainUrl', '');
        if (mb_strlen($title) > 20 || mb_strlen($subTitle) > 20) {
            $this->notice('标题名称太长', 1);
            return;
        }
        if(mb_ereg_match('[<>]',$title)||mb_ereg_match('[<>]',$subTitle)){
            $this->notice('主标题、副标题不能包含‘<’和‘>’字符',2);
            return;
        }
        if (empty($title)) {
            $this->notice('主标题不能为空', 3);
            return;
        }
        if (empty($domainUrl)) {
            $this->notice('域名不能为空', 4);
            return;
        }
        if($this->isUrl($domainUrl) == false){
            $this->notice('域名格式错误', 5);
            return;
        }
        $objModel = new SystemConfigModel();
        $result = $objModel->modifySystemConfig($title,$subTitle,$domainUrl);

        if (is_bool($result) && $result) {
            $this->ok(null, '修改成功');
            return;
        }
        $this->notice($result['msg'], 6);
    }

    public function isUrl($url)  {  
        $pattern =  '/^http[s]?:\/\/'.  
                    '(([0-9]{1,3}\.){3}[0-9]{1,3}'. // IP形式的URL- 199.194.52.184  
                    '|'. // 允许IP和DOMAIN（域名）  
                    '([0-9a-z_!~*\'()-]+\.)*'. // 域名- www.  
                    '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.'. // 二级域名  
                    '[a-z]{2,6})'.  // first level domain- .com or .museum  
                    '(:[0-9]{1,4})?'.  // 端口- :80  
                    '((\/\?)|'.  // a slash isn't required if there is no file name  
                    '(\/[0-9a-zA-Z_!~\'\(\)\[\]\.;\?:@&=\+\$,%#-\/^\*\|]*)?)$/';  
        if(!preg_match($pattern,$url)){
            return false;
        }else{
            return true;
        }
    }     
}
