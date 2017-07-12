<?php
/**
 * @Author:   wangyl
 * @Company:  Rising
 * @DateTime: 2017-03-21T16:20:02+0800
 * @Softwara: Visual Studio Code
 * @Description: 系统设置Modle
 */

use \Lib\Store\Mysql;
use Intervention\Image\ImageManagerStatic as Image;

class SystemConfigModel
{
    public function getSystemInfo()
    {
        return Mysql::getRow("SELECT * FROM auth_base_info");
    }
    public function getOldPassWd($uName)
    {
        return Mysql::getRow("SELECT PWD,Salt FROM esm_user WHERE UserName = '$uName'");
    }
    public function modifyPassWd($uName, $newpwd1)
    {
        $salt    = Common::saltMd5();
        $pwdMD5  = Common::passMd5($newpwd1, $salt);
        $mixTime = date('Y-m-d H:i:s');
        $mixid   = Mysql::exec("UPDATE esm_user SET PWD='$pwdMD5',Salt='$salt',modifiedTime='$mixTime' WHERE UserName = '$uName'");
        if ($mixid > 0) {
            return true;
        } else {
            return ['msg' => '修改密码失败'];
        }
    }
    public function uploadLogo($filePath, $rect)
    {
        $img=Image::make($filePath);
        $x=0;
        $y=0;
        if ($rect['left']<0) {
            $w=$rect['width']-$rect['left'];
            $x=-$rect('left');
            $rect['left']=0;
        } else {
            $w=$img->height();
        }
        if ($rect['top'<0]) {
            $h=$rect['height']-$rect['top'];
            $y=-$rect['top'];
            $rect['top']=0;
        } else {
            $h=$img->width();
        }
        $bg=Image::canvas($w, $h);
        $bg->insert($img, 'top-left', $x, $y);
        $img->crop($rect['width'], $rect['height'], $rect['left'], $rect['top']);
        $data    = $img->encode('data-url');
        $mixTime = date('Y-m-d H:i:s');
        $result  = Mysql::exec("UPDATE auth_base_info SET logoImg='$data',modifiedTime='$mixTime'");
        if ($result > 0) {
            return true;
        } else {
            return ['msg' => '修改自定义logo失败'];
        }
    }
    public function getCompanyLogo()
    {
        $result = Mysql::getCell("SELECT logoImg FROM auth_base_info");
        if (!empty($result)) {
            return Image::make($result)->response();
        } else {
            $logoPath= __dir__.'/../../public/esm/uploads/logon.png';
            return Image::make($logoPath)->response();
        }
    }
    public function resetCompanyLogo()
    {
        $mixTime = date('Y-m-d H:i:s');
        $result  = Mysql::exec("UPDATE auth_base_info SET logoImg=null,modifiedTime='$mixTime'");
        if ($result > 0) {
            return true;
        } else {
            return ['msg' => '重置自定义logo失败'];
        }
    }
    public function modifySystemConfig($title, $subTitle,$domainUrl)
    {
        $mixTime = date('Y-m-d H:i:s');
        $mixid   = Mysql::exec("UPDATE auth_base_info SET title='$title',subTitle='$subTitle',domainUrl='$domainUrl',modifiedTime='$mixTime'");
        if ($mixid >= 0) {
            return true;
        } else {
            return ['msg' => '系统设置修改失败'];
        }
    }
}
