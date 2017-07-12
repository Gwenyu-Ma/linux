<?php
namespace Lib\Model;
use Lib\Util\Common as UCommon;

class Oplog
{
    public static function add($eid, $username, $ip, $action, $funcs, $objects, $source, $target, $result,$memo,$description)
    {
        if(!is_int($action)){
            if($action === '执行'){
                $action = 1;
            }elseif($action === '添加'){
                $action = 2;
            }elseif($action === '更新'){
                $action = 3;
            }elseif($action === '删除'){
                $action = 4;
            }else{
                $action = 0;
            }
        }
        UCommon::writeRabbitMq([
            'logtype' => 'AuditLog',
            'dwith' => 0,
            'eid' => $eid,
            'data' => [
                [
                    'time'=>date("Y-m-d H:i:s"),
                    'username' => $username,
                    'ip' => $ip,
                    'action' => $action,
                    'funcs' => $funcs,
                    'objects' => $objects,
                    'source' => $source,
                    'target' => $target,
                    'result' =>$result,
                    'memo'=> $memo,
                    'description'=>$description
                ]
            ]
        ]);
    }
}

