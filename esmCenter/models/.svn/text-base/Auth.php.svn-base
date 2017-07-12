<?php

use Lib\Store\Mysql;
use Lib\Authorization;
use Lib\Util\rc4;
use Lib\Store\Redis;
use Lib\Util\DateTimeFormatter;
use Lib\Model\Auth;

class AuthModel
{
    public static function checkAuth($sn)
    {
        $count=Mysql::getCell('select count(*) from auth_grant where baseSN=?',[$sn]);
        if($count<=0){
            return ['msg'=>'授权基本号不一致'];
        }
        //分析授权文件，获取授权信息
        $auth=new Auth($sn);
        if(is_array($auth->checkAuth())){
            return ['msg'=>'授权验证失败'];
        }
        return true;
    }

    /*
     * 导入授权
     *
     * @param [mixed] $sn
     * @param [mixed] $fPath
     * @return bool/Array
     */
    public static function importAuth($sn,$url,$cb)
    {
        $auth=new Auth($sn);
        if($auth->authIsTimeout()){
            return [msg=>'授权过期'];
        }

        $authResult=$auth->getAuths();
        $rc4=new rc4();
        $count=Mysql::getCell('select count(*) from auth_base_info');
        if($count<=0){
            $rCount=Mysql::exec('insert into auth_base_info (title,subTitle,createdTime,modifiedTime,domainUrl) values(?,?,?,?,?)',[$authResult['mt'],$authResult['title'],date('Y-m-d H:m:s',time()),date('Y-m-d H:m:s',time()),$url]);
            if($rCount<=0){
                return ['保存授权失败'];
            }
        }
        //删除授权表
        Mysql::exec("delete from auth_grant");
        foreach($authResult['items'] as $item){
            if(!empty($item['context'])){
                Mysql::exec('insert into auth_grant(serialNo,accreditXML,ImportTime,notBefore,notAfter,descript,baseSN,orgCount) values(?,?,?,?,?,?,?,?)',[
                    $item['sn'],
                    $rc4->encrypt($item['context']),
                    date('Y-m-d H:m:s',time()),
                    $rc4->encrypt(date('YmdHis',$item['bDate'])),
                    $rc4->encrypt(date('YmdHis',$item['eDate'])),
                    '',
                    $authResult['bSn'],
                    $authResult['orgCount']
                ]);
            }
        }

        //写授权子表
        Mysql::exec('delete from auth_product_list');
        $authDict=$auth->getAuthDict();

        foreach($authDict as $key=>$items){
            foreach ($items as $item) {
                Mysql::exec('insert into auth_product_list (serialNO,productGuid,accreditCount,startTime,endTime,createdTime,modifiedTime) values(?,?,?,?,?,?,?)',[
                    $key,
                    $item['pguid'],
                    $item['count'],
                    date('YmdHis',$item['bDate']),
                    date('YmdHis',$item['eDate']),
                    date('Y-m-d H:m:s',time()),
                    date('Y-m-d H:m:s',time()),
                ]);
            }
        }
        $winCount=0;
        $linuxCount=0;
        $linuxProducts=[
            '1AB67467-096C-4bea-B852-2CA73F6E854C',
            '30A1265A-7F60-4f4c-99B9-C15353253864',
            '87AFB259-7A18-438b-9A74-719E0CFF8395',
            'A40D11F7-63D2-469d-BC9C-E10EB5EF32DB'
        ];
        $bDate=time();
        $eDate=time()+24*3600;
        $authProdcuts=$auth->getValidAuthByProduct();

        foreach ($authProdcuts as $pguid => $value) {
            Redis::hSet(REDIS_AUTH_PRODUCT,$pguid,json_encode([
                'count'=>$value['count'],
                'os'=>1,
                'start'=>date('Y-m-d',$value['bDate']),
                'end'=>date('Y-m-d',$value['eDate']),
            ]));
            Redis::expire('hau', 7200);
            if(in_array($pguid,$linuxProducts,true)){
                $linuxCount+=$value['count'];
            }else{
                $winCount=$winCount>$value['count'] ? $winCount:$value['count'];
            }
            $bDate=$value['bDate'];
            $eDate=$value['eDate'];
        }
        $cb([
            total=>$winCount+$linuxCount,
            bDate=>$bDate,
            eDate=>$eDate
        ]);
        return true;
    }

    public static function existsAuth()
    {
        return Mysql::getCell('select count(*) from auth_grant')>0;
    }
}