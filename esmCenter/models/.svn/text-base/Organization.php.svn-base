<?php
use Intervention\Image\ImageManagerStatic as Image;
use Lib\Store\Mysql;
/**
 * 企业信息管理
 */
class OrganizationModel
{
    private $db_obj;

    public function __construct()
    {
        //$this->db_obj = new DbProcess();
    }
    /*
     * 获取企业信息
     * @param  [string] $eid [企业id]
     * @return [array]      [企业信息]
     */
    public function getOrganizationById($eid)
    {
        $sql = "SELECT 
                OID,
                EID,
                OName,
                OSize,
                Industry,
                PWD,
                Contact,
                Tel,
                CreateTime,
                Addr,
                ZipCode,
                modifiedTime
                FROM esm_organization where EID='".$eid."'";
        return Mysql::getRow($sql);
    }

    /**
     * 更新企业信息
     * [Array] $params [description]
     * [bool]         [description]
     */
    public function updateOrganization($eid, $org,$oldOrg)
    {
        $where = array(
            'locate_EID' => $eid,
        );
        $result = $this->db_obj->updateTab("esm_organization", $org, $where);
        $msg=$result>=0? '成功':'失败';
        add_oplog(3,9001,'编辑账户',$oldOrg,$org,$msg,'编辑账户信息'.$msg);
        return $result >= 0;
    }


    public function uploadLogo($eid,$filePath,$rect)
    {
        //imageinfo
        $img=Image::make($filePath);
        $x=0;
        $y=0;
        if($rect['left']<0){
            $w=$rect['width']-$rect['left'];
            $x=-$rect('left');
            $rect['left']=0;
        }else{
            $w=$img->height();
        }
        if($rect['top'<0]){
            $h=$rect['height']-$rect['top'];
            $y=-$rect['top'];
            $rect['top']=0;
        }else{
            $h=$img->width();
        }
        $bg=Image::canvas($w,$h);
        $bg->insert($img,'top-left',$x,$y);
        $img->crop($rect['width'],$rect['height'],$rect['left'],$rect['top']);
        //$img->resize(180,70);
        $data=$img->encode('data-url');
        $where = array(
            'locate_EID' => $eid,
        );
        $result = $this->db_obj->updateTab('esm_organization', [
            'imageinfo'=>$data
        ], $where);
        if($result>=0){
            add_oplog(3,9001,'自定义logo',null,null,'成功');
            return true;
        }
        add_oplog(3,9001,'自定义logo',null,null,'修改自定义logo失败');
        return ['msg'=>'修改自定义logo失败'];
    }

    public function getLogo($eid)
    {

        $result = Mysql::getCell("SELECT logoImg FROM auth_base_info");
        if (!empty($result)) {
            return Image::make($result)->response();
        } else {
            $logoPath= __dir__.'/../../public/esm/uploads/logon.png';
            return Image::make($logoPath)->response();
        }
    }

    public function upLoadLogoPreview($eid,$uid,$token,$imageinfo)
    {
        $logoPreview=select_manage_collection('logopreview');
        $okResult=$logoPreview->insert([
                'eid'=>$eid,
                'uid'=>$uid,
                'token'=>$token,
                'imageinfo'=>$imageinfo
            ]);
        return !(is_array($okResult) && isset($okResult['ok']) && $okResult['ok'] == 1);
    }

    public function getLogoPreview($eid,$uid,$token)
    {
        $logoPreview=select_manage_collection('logopreview');
        $result=$logoPreview->findOne([
                'eid'=>$eid,
                'uid'=>$uid,
                'token'=>$token,
            ],[
                'imageinfo'=>true
            ]);
        if(!empty($result)&&!empty($result['imageinfo'])){
            $result->remove([
                'eid'=>$eid,
                'uid'=>$uid,
                'token'=>$token,
            ]);
            return Image::make('data:'.$result['imageinfo'])->response();
        }
        return '';
    }


    public function resetLogo($eid)
    {
        $where = array(
            'locate_EID' => $eid,
        );
        $result = $this->db_obj->updateTab('esm_organization', [
            'imageinfo'=>null
        ], $where);
        return $result>=0;
    }
}
