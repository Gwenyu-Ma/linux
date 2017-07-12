<?php
require __DIR__ . '/../../vendor/autoload.php';

use Lib\Util\Api;

$api = new Api();

function makeMsg()
{
    echo '定制消息<br/>';
    global $api;
    $r = $api->post('http://192.168.20.171:8005/message/api/makeMsg.php', [
        'types' => json_encode(['key1', 'key2', 'key3']),
        'context' => 'hello test1',
        'title' => 'hello',
    ]);

    if (!is_array($r)) {
        echo "服务器死了: $r";
    }
    if ($r['error'] !== null) {
        echo "API Error: " . $r['error'];
    }
}
function addScriber()
{
    echo '订阅消息<br/>';
    global $api;
    $r = $api->post('http://192.168.20.171:8005/message/api/addSubscriber.php', [
        'subscriber' => 'user0:',
        'types' => json_encode(['key1', 'key2', 'key3']),
    ]);

    if (!is_array($r)) {
        echo "服务器死了: $r";
    }
    if ($r['error'] !== null) {
        echo "API Error: " . $r['error'];
    }
}

function delScriber()
{
    echo '删除订阅<br/>';
    global $api;
    $r = $api->post('http://192.168.20.171:8005/message/api/delSubscriber.php', ['subscriber' => 'user0:']);
    if (!is_array($r)) {
        echo "服务器死了: $r";
    }
    if ($r['error'] !== null) {
        echo "API Error: " . $r['error'];
    }
}

function addScriberObj()
{
    echo '添加订阅者对象<br/>';
    global $api;
    $r = $api->post('http://192.168.20.171:8005/message/api/addSubscriberObj.php', ['subscriber' => 'user0:user1']);
    if (!is_array($r)) {
        echo "服务器死了: $r";
    }
    if ($r['error'] !== null) {
        echo "API Error: " . $r['error'];
    }
}

function delSubscriberObj()
{
    echo '添加订阅者对象<br/>';
    global $api;
    $r = $api->post('http://192.168.20.171:8005/message/api/delSubscriberObj.php', ['subscriber' => 'user0:']);
    if (!is_array($r)) {
        echo "服务器死了: $r";
    }
    if ($r['error'] !== null) {
        echo "API Error: " . $r['error'];
    }
}
function getScriberObjs()
{
    echo '获取订阅者对象<br/>';
    global $api;
    $r = $api->post('http://192.168.20.171:8005/message/api/getSubscriberObjs.php', ['subscriber' => 'user0:']);
    if (!is_array($r)) {
        echo "服务器死了: $r";
    }
    if ($r['error'] !== null) {
        echo "API Error: " . $r['error'];
    }
    var_dump($r);
}

makeMsg();
//addScriber();
//delScriber();
//addScriberObj();
//delSubscriberObj();
getScriberObjs();
