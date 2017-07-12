<?php

use DL\Model\Base;
use DL\Model\Upgrade;
use Respect\Validation\Validator as v;
use Upload\File;
use Upload\Storage\FileSystem;
use DL\Model\Queue;
use DL\Model\Task;
use DL\Model\Eid;
use DL\Model\Path;
use Lib\Store\Redis as Redis;

class PackagesController extends MyController
{
    public function init(){
        parent::init();
    }


    public function getPackagesAction(){
        $this->ok( (new Base())->getAll() );
    }

    public function uploadPackagesAction(){
        $aPlatform = array('linux', 'windows');
        $platform = $this->param("platform", null);
    
        if(!in_array($platform,$aPlatform)){
            $this->notice("平台参数错误！");
            return false;
        }

        $file = new File('base', new FileSystem("dl/file/$platform/base"));
        $name = $file->getNameWithExtension();
        $exptend =  $this->get_extension($name);
        if( $platform === 'windows'){
            if( $exptend !== 'exe'){
                $this->notice('windows包必须是exe可执行文件!');
                return false;
            }
        }else if( $platform === 'linux' ){
            if( $exptend !== 'tgz'){
                $this->notice('Linux包格式错误!');
                return false;
            }
        }

        $file->addValidations(array(new \Upload\Validation\Size('500M')));
        try {
            $path = "dl/file/$platform/base/" . $name;
            if(is_file($path)){
                unlink($path);
            }
            $file->upload();
        } catch (\Exception $e) {
            $this->notice($e->getMessage());
            return false;
        }

        $base = new Base();
        $produce = '';
        if($platform == 'linux'){
            $basedir = "dl/file/$platform/base";
            if(is_dir("$basedir/temp/")){
                exec("rm -rf $basedir/temp/");
            }
            mkdir("$basedir/temp/");
            exec("cd $basedir && tar  -zxvf  $name  -C temp/"); //解压到dl/file/linux/base/tmp
            $aIni = parse_ini_file("$basedir/temp/produce.ini");
            $pro = $aIni['produce'];
            if( $pro ){
                $produce = '_'.$pro;
                copy($basedir.'/'.$name,'dl/file/'.$platform.$produce.'/base/'.$name);
                $base->addProduce( $pro );
            }
            
        }
        $platform .= $produce;
         
        
        if($name === $base->get($platform)){
            $this->notice('此包和当前包重复!');
            return false;
        }

        $base->set($platform, $name);
        Queue::push(Task::newPackage($platform, $name));
        $this->ok(true);
    }

    public function getEidsListAction(){
        //$page = $this->param("page", null);
        //$count = 10;
        $obj = new EnterpriseManagerModel();
        $eids = new Eid();
        //$data = $eids->part(intval($page), $count);
        $data = $eids->part();
        
        if(!$data){
            $this->notice('没有了');
            return false;
        }
        foreach($data as &$v){
            if(!empty($v['linux_name'])){
                $v['linux_link'] = Path::distLink('windows', $v['eid'], $v['linux_name']);
            }
            if(!empty($v['windows_name'])){
                $v['windows_link'] = Path::distLink('windows', $v['eid'], $v['windows_name']);
            }
            $v['updated_at'] = date('Y-m-d H:i:s', $v['updated_at']);
        }
        foreach( $data as $key => $val){
            $data[$key]['username'] = $obj->getNameByEid($val['eid']);
        }
        $this->ok( $data );
    }

    private  function get_extension($file){
        return pathinfo($file, PATHINFO_EXTENSION);
    }

    //上传升级包
    public function upgradeAction(){
        $aPlatform = array('linux', 'windows');
        $platform = $this->param("platform", null);
    
        if(!in_array($platform,$aPlatform)){
            $this->notice("平台参数错误！");
            return false;
        }

        if($platform == 'linux'){
            $upgrade_root = 'ruc/esm/linux';
        }else{
            $upgrade_root = 'ruc/esm/windows';
        }
        $file = new File('base', new FileSystem("$upgrade_root"));
        
        $name = $file->getNameWithExtension();
        $exptend =  $this->get_extension($name);
        if( $platform === 'windows'){
            if( $exptend !== 'exe'){
                $this->notice('windows升级包必须是exe可执行文件!');
                return false;
            }
        }else if( $platform === 'linux' ){
            if( $exptend !== 'zip'){
                $this->notice('Linux升级包格式错误!');
                return false;
            }
        }

        $file->addValidations(array(new \Upload\Validation\Size('500M')));
        try {
            $path = "$upgrade_root/$name";
            if(is_file($path)){
                unlink($path);
            }
            $file->upload();
        } catch (\Exception $e) {
            $this->notice($e->getMessage());
            return false;
        }

        if($platform == 'linux'){
            $this->linuxUpgradeAction( $upgrade_root,$name);
        }else{
            $this->windowsUpgradeAction( $upgrade_root,$name);
        }
        
    }

    //上传Linux升级包
    private function linuxUpgradeAction( $rootPath ,$name){
        mkdir("$rootPath/tmp");
        exec("cd $rootPath && unzip $name -d tmp");
        $aIni = parse_ini_file("$rootPath/tmp/produce.ini");
        if(is_array($aIni) && $aIni['produce']){
            $produce = $aIni['produce'];
            $version = $aIni['version'];
            $objUpgrade = new Upgrade();
            $oldVersion = $objUpgrade->get(DL_RDS_UPGRADE_LINUX . $produce.'_version');
            if( $oldVersion == $version){
                $this->notice('此包和当前包重复!');
                return false;
            }
            if(is_dir("$rootPath/$produce")){
                exec("rm -rf $rootPath/$produce");
            }
            exec("cd $rootPath && mv tmp $produce");
            $objUpgrade->addProduce( $produce );
            $objUpgrade->set($produce,$version);
        }else{
            return false;
        }
        $this->ok(true);
    }

    //上传windows升级包
    private function windowsUpgradeAction( $rootPath ,$name ){
        echo 'Rising';
    }

    public function getUpgradeInfoAction(){
        $this->ok( (new Upgrade())->getAll() );
    }

}