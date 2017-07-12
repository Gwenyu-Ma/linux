<?php

/**
 * 出错处理
 */
function  raiseError($errorArr)
{
    echo json_encode($errorArr, JSON_UNESCAPED_UNICODE);
    exit();
}

//object=>array
function object_array($array)
{
    if (is_object($array)) {
        $array = (array)$array;
    }
    if (is_array($array)) {
        foreach ($array as $key => $value) {
            $array[$key] = object_array($value);
        }
    }
    return $array;
}

function constructInfoNew($config, $data)
{
    $policy = $config['policy'];
    $cmd = $config['cmd'];
    $r = array();

    $hasPolicy = false;
    if (isset($data['policy']['allpolicy']) && count($data['policy']['allpolicy']) > 0) {
        foreach ($data['policy']['allpolicy'] as $apolicy) {
            array_push($policy['content']['policycontent'], $apolicy);
        }
        $hasPolicy = true;
    }

    if (isset($data['policy']['grouppolicy']) && count($data['policy']['grouppolicy']) > 0) {
        foreach ($data['policy']['grouppolicy'] as $gpolicy) {
            array_push($policy['content']['policycontent'], $gpolicy);
        }
        $hasPolicy = true;
    }

    if (isset($data['policy']['clientpolicy']) && count($data['policy']['clientpolicy']) > 0) {
        foreach ($data['policy']['clientpolicy'] as $cpolicy) {
            array_push($policy['content']['policycontent'], $cpolicy);
        }
        $hasPolicy = true;
    }

    if ($hasPolicy) {
        array_push($r, $policy);
    }

    $allcmd = $data['cmd'];
    if (count($allcmd) > 0) {
        //array_push($cmd['content']['cmdcontent'], $allcmd);
        $cmd['content']['cmdcontent'] = $allcmd;
        array_push($r, $cmd);
    }
    return $r;
}

function getIP()
{
    if (@$_SERVER["HTTP_X_FORWARDED_FOR"])
        $ip = $_SERVER["HTTP_X_FORWARDED_FOR"];
    else if (@$_SERVER["HTTP_CLIENT_IP"])
        $ip = $_SERVER["HTTP_CLIENT_IP"];
    else if (@$_SERVER["REMOTE_ADDR"])
        $ip = $_SERVER["REMOTE_ADDR"];
    else if (@getenv("HTTP_X_FORWARDED_FOR"))
        $ip = getenv("HTTP_X_FORWARDED_FOR");
    else if (@getenv("HTTP_CLIENT_IP"))
        $ip = getenv("HTTP_CLIENT_IP");
    else if (@getenv("REMOTE_ADDR"))
        $ip = getenv("REMOTE_ADDR");
    else
        $ip = "Unknown";
    return $ip;
}


/**
 * 创建GUID
 * @return string
 */
function createGuid()
{
    $charid = strtoupper(md5(uniqid(mt_rand(), true)));
    $hyphen = '';//chr(45);// "-"
    $uuid = //chr(123)．// "{"
        substr($charid, 0, 8) . $hyphen
        . substr($charid, 8, 4) . $hyphen
        . substr($charid, 12, 4) . $hyphen
        . substr($charid, 16, 4) . $hyphen
        . substr($charid, 20, 12);
    //.chr(125);// "}"
    return $uuid;
}

/**
 * 获取毫秒级时间戳
 * @return int
 */
//function getTimestamp()
//{
//    list($ms, $sec) = explode(' ', microtime());
//    $msec = intval((floatval($sec) + floatval($ms)) * 1000);
//    return $msec;
//}