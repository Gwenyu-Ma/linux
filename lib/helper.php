<?php
use \Lib\Store\MongoClient;

function select_manage_collection($collection)
{
    return MongoClient::selectDB(MONGO_MANAGE_DB)->selectCollection($collection);
}

function select_log_collection($collection)
{
    return MongoClient::selectDB(MONGO_LOG_DB)->selectCollection($collection);
}

/*
@$list  排序的二维数组
@$field 排序列
@$sortby  排序顺序
*/
function list_sort_by($list, $field, $sortby = 'desc')
    {
        if (is_array($list))
        {
            $refer = $resultSet = array();
            foreach ($list as $i => $data)
            {
                @$refer[$i] = $data[$field];
            }
            switch ($sortby)
            {
                case 'asc': // 正向排序
                    asort($refer);
                    break;
                case 'desc': // 逆向排序
                    arsort($refer);
                    break;
                case 'nat': // 自然排序
                    natcasesort($refer);
                    break;
            }
            foreach ($refer as $key => $val)
            {
                $resultSet[] = &$list[$key];
            }
            return $resultSet;
        }
        return false;
    }

function add_oplog($action, $funcs,$objects,$source,$target,$result,$description=null)
{
    $eid = "";
    $username = "";
    $ip = $_SERVER['REMOTE_ADDR'];

    if(!empty($_SESSION['UserInfo'])){
        $eid = $_SESSION['UserInfo']['eid'];
        $username = $_SESSION['UserInfo']['name'];
    }else{
        // $log = select_manage_collection('manage_log');
        // $log->insert([
        //     'eid' => 'unknown',
        //     'username'=>'unknown',
        //     'resource'=>$objects,
        //     'action'=>'login',
        //     'desc'=>'login error',
        //     'time'=>time(),
        // ]);
        return;
        //throw new \Exception("need eid and username, so you must login first");
    }
    if(!empty($_SERVER['HTTP_X_FORWARDED_FOR'])){
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    }
    $memo=$result;
    $result=!empty($result)&&strcasecmp('成功',$result)!=0? 1:0;
    \Lib\Model\Oplog::add($eid, $username, $ip,$action, $funcs,$objects,$source,$target,$result,$memo,$description);
}