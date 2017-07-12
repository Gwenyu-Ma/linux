<?php
namespace Message\Model;

class Distrib
{
    public $msg;
    public $sub;
    public $dst;

    public function __construct()
    {
        $this->msg = select_manage_collection("msgcustomizable");
        $this->sub = select_manage_collection("msgsubscribers");
        $this->dst = select_manage_collection("msgdistribution");
        $this->rlt = select_manage_collection("msgsubscriberelation");
    }

    public function getSubersBySubgrp($subgrp)
    {
        $rlts = $this->rlt->find(array(
            'subscriber' => new \MongoRegex(sprintf("/^%s.*/", $subgrp)),
        ));
        $subers = [];
        foreach($rlts as $v){
            $subers[] = $v['subscriber'];
        }
        return $subers;
    }

    public function getSubgrpsBySuber($suber)
    {
        $subgrps = [];
        $s = "";
        foreach(explode(':', $suber) as $v){
            $s .= $v . ':';
            $subgrps[] = $s;
        }
        array_pop($subgrps);
        return $subgrps;
    }

    public function getTypanysBySubanys($subanys)
    {
        $cdt = array(
            'subscriber' => ['$in' => $subanys],
        );
        $subs = $this->sub->find($cdt);
        $typanys = [];
        foreach($subs as $v){
            foreach($v['types'] as $vv){
                $typanys[] = $vv;
            }
        }
        return $typanys;
    }

    public function suberWantTypany($suber, $typany)
    {
        if(substr($typany, -1) === ":"){
            $types = new \MongoRegex(sprintf("/^%s/", $typany));
        }else{
            $types = $typany;
        }
        $msgs = $this->msg->find(array(
            'types'=>$types,
            'isdel'=>0,
            'outtime'=>['$gt'=>time()],
        ));
        foreach($msgs as $msg){
            if($this->dst->findOne(['subscriber'=>$suber, 'msgid'=>$msg['_id']])){
                continue;
            }
            $this->dst->insert([
                'noeid' => true,
                'subscriber' => $suber,
                'msgid' => $msg['_id'],
                'types' => $msg['types'],
                'msgtitle' => $msg['msgtitle'],
                'msgcontext' => $msg['msgcontext'],
                'isread' => 0,
                'isdel' => 0,
                'outtime' => $msg['outtime'],
                'createtime' => time(),
            ]);
        }
    }

    // on sub
    public function sub($subid)
    {
        $sub = $this->sub->findOne(['_id'=>$subid]);
        if(substr($sub['subscriber'], -1) === ":"){
            $subers = $this->getSubersBySubgrp($sub['subscriber']);
            foreach($subers as $v){
                foreach($sub['types'] as $vv){
                    $this->suberWantTypany($v, $vv);
                }
            }
        }else{
            foreach($sub['types'] as $vv){
                $this->suberWantTypany($sub['subscriber'], $vv);
            }
        }
    }

    // on add a suber
    public function justaddasuber($suber)
    {
        $subgrps = $this->getSubgrpsBySuber($suber);
        $typanys = $this->getTypanysBySubanys($subgrps);
        foreach($typanys as $v){
            $this->suberWantTypany($suber, $v);
        }
    }

    public function getTypanysByTyper($typer)
    {
        $typanys = [];
        $s = "";
        foreach(explode(':', $typer) as $v){
            $s .= $v . ':';
            $typanys[] = $s;
        }
        array_pop($typanys);
        $typanys[] = $typer;
        return $typanys;
    }

    // on add a msg
    public function addmsg($msgid)
    {
        $msg = $this->msg->findOne(['_id'=>$msgid]);
        $typanys = [];
        foreach($msg['types'] as $v){
            $typanys = array_merge($typanys, $this->getTypanysByTyper($v));
        }
        $typanys = array_unique($typanys);
        $subs = $this->sub->find(array(
            'types' => ['$in' => $typanys],
        ));
        $subers = [];
        foreach($subs as $v){
            if(substr($v['subscriber'], -1) === ":"){
                $subers = array_merge($subers, $this->getSubersBySubgrp($v['subscriber']));
            }else{
                $subers[] = $v['subscriber'];
            }
        }
        $subers = array_unique($subers);
        foreach($subers as $v){
            $this->dst->insert([
                'noeid' => true,
                'subscriber' => $v,
                'msgid' => $msg['_id'],
                'types' => $msg['types'],
                'msgtitle' => $msg['msgtitle'],
                'msgcontext' => $msg['msgcontext'],
                'isread' => 0,
                'isdel' => 0,
                'outtime' => $msg['outtime'],
                'createtime' => time(),
            ]);
        }
    }

    // on delete a msg
    public function delmsg($ids)
    {
        if(!is_array($ids)){
            $ids = [$ids];
        }
        $this->dst->update(['_id'=>['$in'=>$ids], 'noeid'=>true], ['$set'=>['isdel'=>1]], ['multiple'=>true]);
        $this->dst->update(['msgid'=>['$in'=>$ids], 'noeid'=>true], ['$set'=>['isdel'=>1]], ['multiple'=>true]);
    }

    public function getmsg($who, $typany, $search, $lastid, $limit)
    {
        $cdts = array(
            'subscriber'=> is_array($who) ? ['$in'=>$who] : $who,
            'isdel'=>0,
            'outtime'=>['$gt'=>time()],
        );
        if($typany){
            if(substr($typany, -1) === ":"){
                $types = new \MongoRegex(sprintf("/^%s/", $typany));
            }else{
                $types = $typany;
            }
            $cdts['types'] = $types;
        }
        if($search){
            $search = new \MongoRegex(sprintf("/%s/", $search));
            $cdts['$or'] = [['msgtitle' => $search], ['msgcontext' => $search]];
        }
        if($lastid){
            $cdts['_id'] = ['$lt'=>$lastid];
        }
        $dsts = $this->dst->find($cdts)->sort(['_id'=>-1])->limit($limit);
        $msgs = [];
        foreach($dsts as $v){
            $msg = $this->msg->findOne(['_id'=>$v['msgid']]);
            $msg['isread'] = $v['isread'];
            $msg['did'] = $v['_id'];
            $msgs[] = $msg;
            $lastid = $v['_id'];
        }
        return array(
            'lastid' => (string)$lastid,
            'messages' => $msgs,
        );
    }

    public function readmsg($ids)
    {
        if(!is_array($ids)){
            $ids = [$ids];
        }
        return $this->dst->update(['_id'=>['$in'=>$ids], 'noeid'=>true], ['$set'=>['isread'=>1]], ['multiple'=>true]);
    }

}

