<?php
use Lib\Store\Mysql;

class UserModel
{
    /*
     * 用户登录
     *
     * @param [string] $uName 用户名
     * @param [string] $uPwd 密码
     * @param [function($userInfo){}] $cb 登录成功后回调函数
     * @return bool/array   成功：true，失败：['msg'=>'错误信息']
     */
    public static function login($uName, $uPwd, $cb)
    {
        $user=Mysql::getRow('select ID,userName,passwd,salt from auth_manager where userName=?',[$uName]);
        if(empty($user))
        {
            return ['msg'=>'用户不存在'];
        }
        if(strcasecmp(Common::passMd5($uPwd,  $user['salt']),$user['passwd'])!=0)
        {
            return ['msg'=>'用户名密码错误'];
        }
        $cb([
            'id'=>$user["ID"],
            'name'=>$user['userName']
        ]);
        return true;
    }

    /*
     * 判断用户是否存在
     *
     * @param [type] $uName
     * @return void
     */
    private static function isExistsUser($uName)
    {
        $where='';
        $pamras=[];
        if(!empty($uName)){
            $where=' where userName=?';
            $pamras[]=$uName;
        }
        return Mysql::getCell('select count(*) from auth_manager'.$where,$pamras)>0;
    }

    public static function regUser($uName, $pwd)
    {
        //检查用户是否存在
        if (self::isExistsUser($uName)) {
            return ['msg'=>'此用户已经存在'];
        }

        $salt = Common::saltMd5();
        $pwdMD5=Common::passMd5($pwd, $salt);
        //添加新用户
        $count=Mysql::exec('insert into auth_manager(userName,passwd,salt,createTime) values(?,?,?,?)', [
            $uName,
            $pwdMD5,
            $salt,
            date('Y-m-d H:m:s', time())
        ]);

        if ($count>0) {
            return true;
        }
        return [
            'msg'=>'注册失败'
        ];
    }

    //修改密码
    public static function modifyPwd($uName, $pwd)
    {
        //检查用户是否存在
        if (!self::isExistsUser($uName)) {
            return ['msg'=>'此用户不存在'];
        }
        $salt=Common::saltMd5();
        $pwdMD5=Common::passMd5($pwd, $salt);

        $where='';
        $pamras=[
            $pwdMD5,
            $salt,
            date('Y-m-d H:m:s', time())
        ];
        if(!empty($uName)){
            $where=' where userName=?';
            $pamras[]=$uName;
        }
        $id=Mysql::exec('update auth_manager set passwd=?,salt=?,modifiedTime=?'.$where, $pamras);
        if ($id>0) {
            return true;
        }
        return [
            'msg'=>'修改密码失败'
        ];
    }

    /**
     * 检查是否存在用户
     *
     * @return bool
     */
    public static function existsUser()
    {
        return Mysql::getCell('select count(*) from auth_manager')>0;
    }
}
