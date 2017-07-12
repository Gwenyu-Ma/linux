<?php
namespace DL\Model;

use Lib\Store\Redis as Redis;

class Base 
{
    public function get($platform)
    {
        return Redis::get(DL_PFX . $platform);
    }

    public function set($platform, $package)
    {
        Redis::set(DL_PFX . $platform.'_uploadtime', date('Y-m-d H:i:s')); 
        Redis::set(DL_PFX . $platform, $package);
        Redis::set(DL_PFX . $platform . "_md5", md5_file("dl/file/$platform/base/".$package));
    }


    // 获取基础包名及md5
    public function getBase($platform)
    {
        $name = Redis::get(DL_PFX . $platform);
        $md5 = Redis::get(DL_PFX . $platform . "_md5");
        $uploadtime = Redis::get(DL_PFX . $platform . "_uploadtime");
        empty($updatetime) ? $updatetime = '无':$updatetime=$updatetime;
        if(!$name){
            return null;
        }
        return array(
            'name' => $name,
            'md5' => $md5,
            'uploadtime' => $uploadtime
        );
    }

    public function getAll()
    {
        $aProduce = Redis::SMEMBERS(DL_RDS_PKG_LINUX_PRO);
        if(is_array($aProduce) && !empty($aProduce)){
            foreach( $aProduce as $produce){
                $bases[] = array_merge( ['platform'=>'linux_'.$produce], (array)$this->getBase('linux_'.$produce) );
            }
        }
        $bases[] = array_merge(['platform'=>'windows'], (array)$this->getBase('windows'));
        return $bases;
    }

    public function addProduce( $produce ){
        Redis::SADD(DL_RDS_PKG_LINUX_PRO,$produce);
    }

}

