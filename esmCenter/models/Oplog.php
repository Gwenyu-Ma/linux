<?php

use \Lib\Model\RedisDataManager;
use Lib\Util\Common as UCommon;
use Lib\Store\LogsMysql as MC;
use Lib\Model\Cmd;
use ChromePhp as Console;
class OplogModel
{
    public static function add($eid, $username, $resource, $action, $desc)
    {
        $log = select_manage_collection('manage_log');
        return $log->insert([
            'eid' => $eid,
            'username'=>$username,
            'resource'=>$resource,
            'action'=>$action,
            'desc'=>$desc,
            'time'=>time(),
        ]);
    }

    public function part($eid, $query)
    {
        //MC::$eid = $eid;
        //for($i=0;$i<60;$i++){
            //MC::exec("insert into $tb values('2016-01-01 01:01:$i','$eid','$i','$i','2016-01-01 01:01:$i','$i','$i','$i','$i','$i','$i','$i','$i','$i','$i','$i','$i')");
        //}
        //MC::$eid = $eid;
        $wh = '1=1';
        $ere = [];
        $orderby = '';
        $sort = '';
        $offset = 0;
        $limit = 10;
        foreach($query as $k=>$v){
            if($k === 'view'){
                continue;
            }
            if($k === 'orderby'){
                $orderby = "order by $v";
                continue;
            }
            if($k === 'sort'){
                if(!in_array($v, ['asc','desc'])){
                    $v = 'asc';
                }
                $sort = $v;
                continue;
            }
            if($k === 'offset'){
                $offset = intval($v);
                continue;
            }
            if($k === 'limit'){
                $limit = intval($v);
                continue;
            }

            if($k === 'stime'){
                $wh .= " and time>= ?";
                $ere[] = $v;
                continue;
            }
            if($k === 'etime'){
                $wh .= " and time< ?";
                $ere[] = $v;
                continue;
            }
            if($k === 'result'){
                if($v==='success'){
                    $v == 0;
                }else{
                    $v == 1;
                }
                continue;
            }
            if ($k === 'funcs') {
                $wh .= " and funcs in ($v)";
                continue;
            }
            $wh .= " and $k=?";
            $ere[] = $v;
        }
        if(empty($sort) || empty($orderby)){
            $orderby = '';
            $sort = '';
        }

        $sql = <<<SQL
select * from AuditLog_$eid
where $wh $orderby $sort limit $offset,$limit
SQL;
        Console::log($sql, $ere);
        $sql1 = <<<SQL
select count(1) from AuditLog_$eid
where $wh
SQL;

        return array(
             'rows' => MC::getAll($sql, $ere),
             'total' => MC::getCell($sql1, $ere),
        );
    }

    public function del($eid, $ids)
    {
        $n = count(explode(',', $ids));
        add_oplog('删除','9003',null,"$n",null,null, "删除$n条审计日志成功");
        MC::$eid=$eid;
        return MC::exec("delete from AuditLog_$eid where id in ($ids)");
    }

    public function clean($eid)
    {
        add_oplog('删除','9003',null,null,null,null,"删除ALL条审计日志成功");
        MC::$eid=$eid;
        return MC::exec("delete from AuditLog_$eid");
    }


}

