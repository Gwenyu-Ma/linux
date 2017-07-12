<?php
/**
 * Created by PhpStorm.
 * User: xujy
 * Date: 2017/3/20
 * Time: 13:21
 */
use \Lib\Store\Mysql;
class AuthWhiteListModel
{
    public function getWhiteList(){
        return Mysql::getAll('SELECT auth_white_list.guid,count(proGuid) as proNum,IP,mack,computerName,addTime FROM auth_white_list LEFT JOIN auth_client_info ON auth_white_list.guid=auth_client_info.guid GROUP BY guid ORDER BY auth_client_info.ID DESC');
    }

    public function addWhiteList(  $guid,$proGuid ){
        return Mysql::exec("INSERT INTO auth_white_list(guid,proGuid) VALUES ('$guid','$proGuid')");
    }

    public function delWhiteList( $guid ){
        return Mysql::exec("DELETE FROM auth_white_list WHERE guid='$guid'");
    }
}