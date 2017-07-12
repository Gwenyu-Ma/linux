<?php
namespace DL\Model;

use Lib\Store\Redis as Redis;

class Upgrade 
{
    public function get($key)
    {
        return Redis::get($key);
    }

    public function set($produce,$version)
    {
        Redis::set(DL_RDS_UPGRADE_LINUX . $produce.'_uploadtime', date('Y-m-d H:i:s')); 
        Redis::set(DL_RDS_UPGRADE_LINUX . $produce.'_version', $version);
    }

    public function getBase($produce)
    {
        $uploadtime = Redis::get(DL_RDS_UPGRADE_LINUX . $produce.'_uploadtime');
        $updatetime = empty($updatetime) ? '无':$updatetime;
        $version = Redis::get(DL_RDS_UPGRADE_LINUX . $produce.'_version');
        $version = empty($version)?'无':$version;
        return array(
            'uploadtime' => $uploadtime,
            'version' => $version
        );
    }

    public function getAll()
    {
        $aProduce = Redis::SMEMBERS(DL_RDS_UPGRADE_LINUX_PRO);
        if(is_array($aProduce) && !empty($aProduce)){
            foreach( $aProduce as $produce){
                $bases[] = array_merge( ['platform'=>'linux_'.$produce], (array)$this->getBase($produce) );
            }
        }
        return $bases;
    }

    public function addProduce( $produce ){
        Redis::SADD(DL_RDS_UPGRADE_LINUX_PRO,$produce);
    }

}

