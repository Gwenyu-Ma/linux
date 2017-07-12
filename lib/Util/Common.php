<?php
namespace Lib\Util;

use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;
use \Lib\Store\Rabbitmq as MQ;

class Common
{
    public static function writeRabbitMq($data,$exchange='control_exchange_fanout'){
        if(empty($data)){
            return false;
        }else if(is_array($data)){
            $data = json_encode($data, JSON_UNESCAPED_UNICODE);
        }
        $instance = MQ::getInstance();
        $channel = $instance->channel();
        //$channel->queue_declare($queue, true, true, true, true);
        $channel->exchange_declare($exchange, 'fanout', true, true, true);
        //$channel->queue_bind($queue, $exchange);
        $toSend = new AMQPMessage($data, array('content_type' => 'text/plain', 'delivery_mode' => AMQPMessage::DELIVERY_MODE_PERSISTENT));
        $channel->basic_publish($toSend, $exchange);
        //echo " [x] Sent '$data!'\n";
        $channel->close();
        $instance->close();
        $instance = null;
    }

    public static function saltMd5(){
        $time = time();
        $rising = "risingfuwuqimd5jiami";
        $rand = rand(10, 99);
        $salt = md5($time . $rising . $rand);
        return $salt;
    }
    public static function passMd5($pass, $salt, $encrypt = 'md5'){
        $pow = pow(2, 18);
        $sign = $pass . $salt;
        $password = '';
        for ($i = 0; $i < $pow; $i++) {
            if ($encrypt == "md5") {
                $password = md5($sign);
            }
        }
        return $encrypt . "::" . $pow . "::" . $password;
    }

    private static function getURL()
    {
        $row = require('../../config/urls.php');
        if ($row) {
            return $row['message'];
        }
        return false;
    }

    public static function makeMsg($types, $context, $title)
    {
        $api = new Api();
        $api->baseURL = self::getURL();
        $args['types'] = $types;
        $args['context'] = $context;
        $args['title'] = $title;
        return $api->post('/api/makeMsg.php', $args);
    }

    public static function getMicroTime(){
        return microtime(true) * 10000;
    }

    //结束日期和开始日期相差的天数
    public static function timeToDay($starttime,$endtime){
        $start = strtotime($starttime);
        $end = strtotime($endtime);
        $Days = round(($end-$start)/3600/24);
        return $Days;
    }

    public static function os($os)
    {
        return preg_replace([
            '/Microsoft ?/i',
            '/Service\s*Pack\s/i',
            '/ ?\(build\s*\d+\),?/i',
            '/32-bit/i',
            '/64-bit/i',
        ], [
            '',
            'SP',
            '',
            '',
            'x64',
        ], $os);
    }

    public static function mac($mac)
    {
        return strtoupper(str_replace (':', '-', $mac));
    }
}