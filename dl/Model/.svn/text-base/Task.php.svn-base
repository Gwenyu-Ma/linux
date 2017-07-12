<?php

namespace DL\Model;

class Task
{
    public $type;
    public $platform;
    public $filename;
    public $eid;

    public static function newPackage($platform, $filename, $eid='')
    {
        $task = new self();
        $task->type = 'package';
        $task->platform = $platform;
        $task->filename = $filename;
        $task->eid = $eid;
        return $task;
    }

    public static function newEID($eid)
    {
        $task = new self();
        $task->type = 'eid';
        $task->eid = $eid;
        return $task;
    }
}

