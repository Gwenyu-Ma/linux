<?php

namespace Message\Model;

use \MongoId;

//use \Lib\Util\Log;
class MsgManager
{
    /**
     * 消息过期时间
     */
    public static $EFFECTIVELENGTH = 3600 * 24 * 365;

    /**
     * 制作产生消息
     * @param [array] $msgInfo [消息参数]
     * @return [bool]
     */
    public static function makeMsg($msgInfo)
    {
        //Log::add("InsertMongo33333",array('timeSpan'=>time()));
        $id = new MongoId();
        //Log::add("InsertMongo3333330",array('timeSpan'=>time()));
        $msg = [
            '_id' => $id,
            'noeid' => true,
            'isdel' => 0,
            'candel' => 0,
            'outtime' => time() + self::$EFFECTIVELENGTH,
            'types' => $msgInfo['types'],
            'msgtitle' => $msgInfo['title'],
            // 'msgfile' => $msgInfo['file'],
            'msgcontext' => $msgInfo['context'],
        ];

        //Log::add("InsertMongo3333331",array('timeSpan'=>time()));
        $result = select_manage_collection('msgcustomizable')->insert($msg);

        //Log::add("InsertMongo333333",array('timeSpan'=>time()));
        if (is_array($result) && $result['ok'] == 1) {
            (new Distrib())->addmsg($id);
            return true;
        }

        //Log::add("InsertMongo3333333",array('timeSpan'=>time()));
        return false;
    }

    // //添加多条消息
    // public static function makeMsgMult($msgType,$msgTitle,$msgContext,$isRepeat,$times,$titleInc)
    // {

    // }

    //获取消息列表
    public static function getMsgList($eid, $msgType, $msgTitle,$pageIndex=0,$pageSize=100)
    {
        $where = [];
        if($eid){
            $where['$and'][]=['types'=>new \MongoRegex(sprintf("/%s/", $eid))];
        }
        if ($msgType) {
            if (substr($msgType, -1) === ":") {
                $where['$and'][]=['types'=> new \MongoRegex(sprintf("/^%s/", $msgType))];
            } else {
                $where['$and'][] =['types'=> $msgType];
            }
        }
        if ($msgTitle) {
            $where['msgtitle'] = new \MongoRegex(sprintf("/%s/", $msgTitle));
        }
        //var_dump($where);
        $result = select_manage_collection('msgcustomizable')->find($where);
        $total=$result->count();
        if($pageIndex>=0 && $pageSize>=0){
            $result=$result->skip($pageIndex*$pageSize)->limit($pageSize);
        }
        
        return [
            'total' => $total,
            'rows' => iterator_to_array($result),
        ];
    }

    //删除消息
    public static function delMsg($ids)
    {
        $ids=array_map(function($id){
            return new MongoId($id);
        },$ids);
  
        $result = select_manage_collection('msgcustomizable')->remove(['_id'=>['$in'=>array_values($ids)],'noeid' => true]);
        return is_array($result) && $result['ok'] == 1;
    }

    /**
     * 添加订阅
     * @param [type] $scriberObj [订阅者]
     * @return [bool]
     */
    public static function addSubscriber($scriberObj)
    {
        $user = [
            'subscriber' => $scriberObj['subscriber'],

            'time' => time(),
        ];
        $result = select_manage_collection("msgsubscribers")->findAndModify([
            'noeid' => true,
            'subscriber' => $scriberObj['subscriber'],
        ], [
            '$set' => $user,
            '$addToSet' => ['types' => ['$each' => $scriberObj['types']]],
        ], [
            '_id' => true,
        ], [
            'new' => true,
            'upsert' => true,
        ]);
        //var_dump($result);
        if (is_array($result) && !empty($result['_id'])) {
            (new Distrib())->sub($result['_id']);
            return true;
        }
        return false;
    }

    //获取订阅者列表
    public static function getSubscriberList($eid, $scriber, $msgType,$pageIndex=0,$pageSize=100)
    {
        $where = [];
        if($eid){
            $where['$and'][]=['subscriber'=>new \MongoRegex(sprintf("/%s/", $eid))];
        }
        if ($msgType) {
            if (substr($msgType, -1) === ":") {
                $where['types'] = new \MongoRegex(sprintf("/^%s/", $msgType));
            } else {
                $where['types']=$msgType;
            }
        }
        if ($scriber) {            
            $where['$and'][] =['subscriber'=>substr($scriber, -1) === ":"? new \MongoRegex(sprintf("/^%s/", $scriber)):$scriber];
        }
        //var_dump($where);
        $result = select_manage_collection('msgsubscribers')->find($where);
        $total=$result->count();
        if($pageIndex>=0&&$pageSize>=0){
            $result=$result->skip($pageIndex*$pageSize)->limit($pageSize);
        }
        return [
            'total' => $total,
            'rows' => iterator_to_array($result),
        ];
    }

    /**
     * 删除订阅者
     * @param  [type] $scriber [description]
     * @return [type]          [description]
     */
    public static function delSubscriber($subscriber)
    {
        $ok = select_manage_collection('msgsubscribers')->remove([
            'subscriber' => $subscriber,
            'noeid' => true,
        ]);
        return is_array($ok) && $ok['ok'] == 1;
    }

    //删除订阅者
    public static function delSubById($ids)
    {
        $ids=array_map(function($id){
            return new MongoId($id);
        },$ids);
        $ok = select_manage_collection('msgsubscribers')->remove([
            '_id' => ['$in'=>array_values($ids)],
            'noeid' => true,
        ]);
        return is_array($ok) && $ok['ok'] == 1;
    }

    /**
     * 添加订阅者对象
     * @param [type] $scriber [description]
     */
    public static function addSubscriberObj($subscriber)
    {
        $result = select_manage_collection('msgsubscriberelation')->findAndModify([
            'noeid' => true,
            'subscriber' => $subscriber,
        ], [
            '$set' => ['subscriber' => $subscriber,'time'=>time()],
        ], [
            '_id' => true,
            'subscriber' => true,
            'time'=>true
        ], [
            'new' => true,
            'upsert' => true,
        ]);
        // var_dump($result);
        if (is_array($result) && !empty($result['_id'])) {
            (new Distrib())->justaddasuber($subscriber);
            return true;
        }
        return false;
    }

    /**
     * 删除订阅者对象
     * @param  [type] $scriber [description]
     * @return [type]          [description]
     */
    public static function delSubscriberObj($subscriber)
    {
        $ok = select_manage_collection('msgsubscriberelation')->remove([
            'noeid' => true,
            'subscriber' => $subscriber,
        ]);
        return is_array($ok) && $ok['ok'] == 1;
    }

    public static function delSubObjById($ids)
    {
        $ids=array_map(function($id){
            return new MongoId($id);
        },$ids);
        $ok = select_manage_collection('msgsubscriberelation')->remove([
            '_id' => ['$in'=>array_values($ids)],
            'noeid' => true,
        ]);
        return is_array($ok) && $ok['ok'] == 1;
    }

    /**
     * 获取订阅者对象
     * @param $eid
     * @param $subscriber
     * @return array [type]    [description]
     * @internal param $ [type] $subscriber [description]
     */
    public static function getSubscriberObjs($eid,$subscriber,$pageIndex=0,$pageSize=100)
    {
        $where=[];
        if($eid){
            $where['$and'][]=['subscriber'=>new \MongoRegex(sprintf("/%s/", $eid))];
        }
        if($subscriber){
            $where['$and'][]=['subscriber'=>new \MongoRegex(sprintf("/^%s/",$subscriber))];
        }
        $result = select_manage_collection('msgsubscriberelation')->find($where);
        // var_dump($scriber);
        $total=$result->count();
        if($pageIndex>=0&&$pageSize>=0){
            $result=$result->skip($pageIndex*$pageSize)->limit($pageSize);
        }
        return [
            'total' => $total,
            'rows' => iterator_to_array($result)
        ];
    }
}
