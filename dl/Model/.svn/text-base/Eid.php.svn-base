<?php
namespace DL\Model;

use Lib\Store\Redis as Redis;

class Eid 
{
    public function add($eid)
    {
        Redis::zAdd(DL_RDS_EIDS, time(), $eid);
        Redis::hSetNx(DL_PFX . $eid, 'updated_at', time());
        Redis::hSetNx(DL_PFX . $eid, 'android_name', '');
        Redis::hSetNx(DL_PFX . $eid, 'android_md5', '');
        Redis::hSetNx(DL_PFX . $eid, 'linux_name', '');
        Redis::hSetNx(DL_PFX . $eid, 'linux_md5', '');
        Redis::hSetNx(DL_PFX . $eid, 'windows_name', '');
        Redis::hSetNx(DL_PFX . $eid, 'windows_md5', '');
    }

    public function del($eid)
    {
        Redis::zRem(DL_RDS_EIDS, $eid);
        $dist = Redis::hGet(DL_PFX . $eid, "android_name");
        if($dist){
            unlink(Path::dist('android', $eid, $dist));
        }
        $dist = Redis::hGet(DL_PFX . $eid, "linux_name");
        if($dist){
            unlink(Path::dist('linux', $eid, $dist));
        }
        $dist = Redis::hGet(DL_PFX . $eid, "windows_name");
        if($dist){
            unlink(Path::dist('windows', $eid, $dist));
        }
        Redis::del(DL_PFX . $eid);
    }

    public function getDist($eid, $platform)
    {
        $name = Redis::hGet(DL_PFX . $eid, "${platform}_name");
        $md5 = Redis::hGet(DL_PFX . $eid, "${platform}_md5");
        if(!$name){
            return null;
        }
        return array(
            'name' => $name,
            'md5' => $md5,
        );
    }

    // 更新最后活跃时间
    public function touch($eid)
    {
        Redis::zAdd(DL_RDS_EIDS, time(), $eid);
        Redis::hSet(DL_PFX . $eid, 'updated_at', time());
    }

    public function part($page=1, $count=1)
    {
       // $start = ($page-1)*$count;
       // $end = $start+$count;
       $start = 0;
       $end = -1;
        $eids = Redis::zRevRange(DL_RDS_EIDS, $start, $end);
        if(!$eids){
            return [];
        }
        $data = [];
        foreach($eids as $v){
            $row = Redis::hGetAll(DL_PFX . $v);
            $row['eid'] = $v;
            $data[] = $row;
        }
        return $data;
    }

}


