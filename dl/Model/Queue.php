<?php
namespace DL\Model;

use Lib\Store\Redis as Redis;

class Queue
{
    public static function push(Task $task, $tail=false)
    {
        if(!$tail){
            Redis::lPush(DL_RDS_TASKS, json_encode($task));
            return;
        }
        Redis::rPush(DL_RDS_TASKS, json_encode($task));
    }

    public static function pop()
    {
        $task = Redis::rPop(DL_RDS_TASKS);
        if(!$task){
            return null;
        }
        return json_decode($task);
    }
}

