<?php
require __DIR__ . '/../../vendor/autoload.php';

use DL\Model\Queue;
use DL\Model\Sign;
use DL\Model\Base;
use DL\Model\Eid;

$queue = new Queue();
$sign = new Sign();
$base = new Base();
$eids = new Eid();

for(;$task=$queue->pop();){
    if($task->type === 'package'){
        if($task->eid){
            $sign->make($task->platform, $task->eid);
            $eids->touch($task->eid);
            continue;
        }
        if($task->filename !== $base->get($task->platform)){
            continue;
        }
        $sign->makeAll($task->platform);
        continue;
    }
    if($task->type === 'eid'){
        $sign->make('android', $task->eid);
        $sign->make('linux', $task->eid);
        $sign->make('windows', $task->eid);
        $eids->touch($task->eid);
    }
}

