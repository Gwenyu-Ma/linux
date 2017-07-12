<?php

use Lib\Store\Redis;
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/5/18
 * Time: 13:33
 */
class TestController extends MyController
{
    public function init()
    {
        parent::init();
    }
    public function getuserredisAction()
    {
        $eid = "4199333836215171";

        echo '全网策略<br />';
        var_dump(Redis::hGetAll(CACHE_REDIS_ORG_PRE . $eid));
        echo '<br />eid缓存<br />';
        echo Redis::hGet(CACHE_REDIS_ONLINESTATE_PRE . $eid,$eid );

        echo '<br />企业授权<br />';
        var_dump(Redis::hGetAll(REDIS_AUTH_PRODUCT.'_' . $eid));
        //print_r(Redis::hGetAll(CACHE_REDIS_ONLINESTATE_PRE . $eid ));

        echo '<br />产品授权<br />';
        var_dump(Redis::hGetAll(REDIS_AUTH_PRODUCT));
        //print_r(Redis::hGetAll(CACHE_REDIS_ONLINESTATE_PRE . $eid ));

        echo '授权结果';
        var_dump(Redis::LRange(REDIS_AURESULTS_QUEUE,0,-1));
        echo '<br />';
        echo date('Y-m-d H:i:s', time()).'<br />';

        echo date('Y-m-d', '2018-4-5').'<br />';

    }

    public function getepredisAction()
    {
        $eid = "4199333836215171";
        $sguid = "29F2C7032539438D92A40386EBE25F2A";//$_GET['sguid']; //"51BEFE80-3B57-014E-2583-56D7DA734Bx";
        $groupid = "14950759123849";                        //$_GET['groupid']; //"1458475376";
        $systype = "windows";

        echo '命令版本号c_ver'.'<br />';
        echo CACHE_REDIS_EP_PRE .$eid. $sguid.'<br />';
        $cver = Redis::hGet(CACHE_REDIS_EP_PRE .$eid. $sguid, 'c_ver');
        echo '<br />客户端组g_info';
        var_dump(Redis::hGet(CACHE_REDIS_EP_PRE .$eid . $sguid, 'g_info'));
        echo '<br />客户端策略p_info';
        var_dump(Redis::hGet(CACHE_REDIS_EP_PRE .$eid . $sguid, 'p_info'));
        echo '<br />客户端策略版本号p_ver';
        var_dump(Redis::hGet(CACHE_REDIS_EP_PRE .$eid . $sguid, 'p_ver'));
        echo '<br />客户端命令版本号c_ver';
        var_dump(Redis::hGet(CACHE_REDIS_EP_PRE  .$eid. $sguid, 'c_ver'));
        echo '<br />客户端信息ep_info';
        var_dump(Redis::hGet(CACHE_REDIS_EP_PRE  .$eid. $sguid, 'ep_info'));
        echo Redis::hGet(CACHE_REDIS_EP_PRE  .$eid. $sguid, 'ep_info');
        echo '<pre>';
        echo '<br />全网策略';
        var_dump(Redis::hGet(CACHE_REDIS_ORG_PRE . $eid, 'p_global'));
        echo '<br />组侧策略';
        var_dump(Redis::hGet(CACHE_REDIS_ORG_PRE . $eid, 'p_group_' . $groupid));
        echo '<br />命令';
        var_dump(Redis::LRange(CACHE_REDIS_EP_CMD_PRE  .$eid. $sguid,0,-1));
        $cmds = Redis::LRange(CACHE_REDIS_EP_CMD_PRE  .$eid. $sguid,0,-1);
        foreach($cmds as $cmd){
            echo Redis::get($cmd).'<br />';
        }
        echo '<br />eid缓存<br />';
        echo Redis::hGet(CACHE_REDIS_ONLINESTATE_PRE . $eid,$eid );

        echo '<br />';
        echo date('Y-m-d H:i:s', Redis::hGet(CACHE_REDIS_ONLINESTATE_PRE.$eid,$systype. ':' .$sguid)).'<br />';
        echo date('Y/m/d H:i:s', time()).'<br />';
        echo date('Y-m-d H:i:s', strtotime(date('Y/m/d H:i:s', time()))).'<br />';;
        echo date('Y-m-d H:i:s', strtotime('2017/05/19'));

    }

}