<?php
require_once __DIR__ . '/../vendor/autoload.php';

header("Content-Type: text/html;charset=utf-8");

require_once dirname(__FILE__) . "/Library/rc4.class.php";
require_once dirname(__FILE__) . '/Common/constant.php';

use \Lib\Store\Redis as reds;
use \Lib\Util\Log;

/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/1/11
 * Time: 16:05
 */
class ClientReg
{
    private $_rc4_obj = '';
    private $header = '';

    static $context = NULL;
    static $cache = NULL;

    /**
     * 构造方法
     */
    public function __construct()
    {
        self::$context = $this;
        $this->_rc4_obj = new rc4();
    }

    /**
     * 获取执行上下文
     * @return  返回context
     */
    public static function getContext()
    {
        if (self::$context)
            return self::$context;
        else
            return self::$context = new self;
    }

    /**
     * 处理请求
     */
    public function run()
    {
        call_user_func_array(array($this, 'service'), $_REQUEST);
    }

    /**
     * 服务接口
     */
    public function  service()
    {
        try {
            $this->_dispatcher();
        } catch (\Exception $e) {
            Log::add("ClientReg Error", array('ErrorMessage' => $e->getMessage()));
        }
    }

    /**
     * 解析path路径
     */
    private function _dispatcher()
    {
        $result = array('msg' => array());
        $content = $this->_rc4_obj->ex(file_get_contents('php://input'));

        if (!isset($content) && $content == "") {
            echo 'error:' . API_BODY_ERROR;
            exit();
        }

        $content = json_decode($content, true);
        if (json_last_error() != JSON_ERROR_NONE) {
            echo 'error:' . API_BODY_ERROR;
            exit();
        }

        if (!isset($content['msg']) || empty($content['msg'])) {
            echo 'error:' . API_BODY_ERROR;
            exit();
        }

        $contentrows = $content['msg'];
        $cmsgtype = $contentrows['cmsgtype'];

        if ($cmsgtype != "2000") {
            echo 'error:' . API_BODY_ERROR;
            exit();
        }

        //有user信息，说明是注册请求
        //有eid信息，说明是获取企业信息请求
        if (!isset($contentrows['user']) || empty($contentrows['user'])) {
            $this->getOrgInfo($contentrows);
        } else {
            $this->regEP($contentrows);
        }
    }

    public static function conf()
    {
        return require(__DIR__ . '/../config/mysql.php');
    }

    public function connect()
    {
        $mysql = self::conf();
        $c = $mysql['read'];
        $dsn = "mysql:host=" . $c[0]['host'].';port='.$c[0]['port'].";dbname=" . $c[0]['dbname'];
        //$dsn = "mysql:host=127.0.0.1;dbname=rs_esm_soho";
        $pdo = null;
        try {
            $pdo = new PDO($dsn, $c[0]['username'], $c[0]['password'], array(PDO::MYSQL_ATTR_INIT_COMMAND => "set names utf8"));
            //$pdo = new PDO($dsn, 'root', 'rising', array(PDO::MYSQL_ATTR_INIT_COMMAND => "set names utf8"));
        } catch (PDOException $e) {
            echo 'Connection failed: ' . $e->getMessage();
            return null;
        }
        return $pdo;
    }

    /**
     * 根据user查询企业信息
     * @param $user
     * @return null|void
     */
    private function getOInfo($user)
    {
        $sql = "SELECT U.EID,O.OName,O.Addr,O.PWD FROM esm_user U
	INNER JOIN esm_organization O ON U.EID = O.EID
	WHERE U.`Status`=1 AND (U.`Level`=0 OR U.`Level`=2)
	AND (U.EMail=:user OR U.UserName = :user OR U.PhoneNO=:user) LIMIT 1 ";

        $pdo = $this->connect();
        if (empty($pdo)) {
            return null;
        }


        $sth = $pdo->prepare($sql);
        $sth->execute(array(':user' => $user));

        $results = $sth->fetchAll();
        if (!is_array($results) || empty($results)) {
            return null;
        } else {
            return $results[0];
        }
    }

    /**
     * @param $eid
     * @param $sguid
     * @return bool true:已在黑名单中
     */
    private function checkBlackMenu($eid,$sguid)
    {
        if (reds::hGet(CACHE_REDIS_EP_PRE . $eid . $sguid, 'inblackmenu') == '1') {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 客户端向服务器端注册
     * @param $contentrows 客户端上传的信息
     */
    private function regEP($contentrows)
    {
        $user = $contentrows['user'];

        $pwd = "";
        //$hpwd = false;//请求时，json中是否含有pwd字段，默认没有 false，有 true

        if (isset($contentrows['pwd']) && !empty($contentrows['pwd'])) {
            $pwd = $contentrows['pwd'];
            //$hpwd = true;
        }

        //pwd为可选项
        //不带pwd本意是用作查询用，不过为了优化，当实际后台没有设置密码时，会一并把eid返回，以方便可以做到一次交互

        $oinfo = null;

//        if (!empty($pwd)) {
//            $oinfo = $this->getOInfoWithPwd($user, $pwd);
//        } else {
//            $oinfo = $this->getOInfo($user);
//        }

        $oinfo = $this->getOInfo($user);
        if($oinfo==null||(!empty($pwd)&&strcasecmp(md5($oinfo['PWD']),$pwd)!==0)){
            $result['msg'] = array('cmsgtype' => $contentrows['cmsgtype'], 'returncode' => '1');
        }
        else{
            if(!empty($contentrows['sguid'])&&!empty($oinfo['EID']))
            {
                if($this->checkBlackMenu($oinfo['EID'],$contentrows['sguid']))
                {
                    $result['msg'] = array('cmsgtype' => $contentrows['cmsgtype'], 'returncode' => '3');
                    echo $this->_rc4_obj->ex(json_encode($result));
                    exit();
                }
            }
            $bpwd = isset($oinfo['PWD']) && !empty($oinfo['PWD']) ? '1' : '0';//有密码1；没密码0
            $result['msg'] = array(
                'cmsgtype' => $contentrows['cmsgtype'],
                'returncode' => '0',
                'content' => array(
                    'user' => $user,
                    'pwd' => $bpwd,//有密码1；没密码0
                    'oname' => $oinfo['OName'] == null ? "" : $oinfo['OName'],
                    'oddr' => $oinfo['Addr'] == null ? "" : $oinfo['Addr']
                )
            );

            if ($pwd != "" || $bpwd == '0') {
                $result['msg']['content']['eid'] = $oinfo['EID'];
            }
        }

        echo $this->_rc4_obj->ex(json_encode($result));
        exit();
    }

    /**
     * 获取EID
     * {
     * "msg": {
     * "cmsgtype": "2000",
     * "content": {
     * "user": "13312345678",
     * "pwd": "md5（pwd）"
     * }
     * }
     * }
     */
    private function getOInfoWithPwd($user, $pwd)
    {
        $sql = "SELECT U.EID,O.OName,O.Addr,O.PWD FROM esm_user U
	INNER JOIN esm_organization O ON U.EID = O.EID
	WHERE U.`Status`=1 AND (U.`Level`=0 OR U.`Level`=2)
	AND (U.EMail=:user OR U.UserName = :user) AND IFNULL(O.PWD,'') =:pwd LIMIT 1 ";

        $pdo = $this->connect();
        if (empty($pdo)) {
            return null;
        }

        $sth = $pdo->prepare($sql);
        $sth->execute(array(':user' => $user, ':pwd' => $pwd));

        $results = $sth->fetchAll();
        if (!is_array($results) || empty($results)) {
            return null;
        } else {
            return $results[0];
        }
    }

    /**
     * 根据企业ID获取客户端信息
     * @param $contentrows 客户端上传的信息
     */
    private function getOrgInfo($contentrows)
    {
        if (!isset($contentrows['eid']) || empty($contentrows['eid'])) {
            echo 'error:' . API_BODY_ERROR;
            exit();
        }
        $eid = $contentrows['eid'];
        $oinfo = null;
        if (!empty($eid)) {
            $oinfo = $this->getOInfoByEID($eid);
        }

        if ($oinfo == null) {
            $result['msg'] = array('cmsgtype' => $contentrows['cmsgtype'], 'returncode' => '1');
        } else {
            //eid,oname,otype, istrial, contact,tel,addr,zipcode,createtime
            //EID,OName,OType, IsTrial, Contact,Tel,Addr,ZipCode,CreateTime
            $result['msg'] = array(
                'cmsgtype' => $contentrows['cmsgtype'],
                'returncode' => '0',
                'content' => array(
                    'eid' => $eid,
                    'oname' => empty($oinfo['OName']) ? "" : $oinfo['OName'],
                    'otype' => empty($oinfo['OType']) ? "" : $oinfo['OType'],
                    'istrial' => empty($oinfo['IsTrial']) ? "" : $oinfo['IsTrial'],
                    'contact' => empty($oinfo['Contact']) ? "" : $oinfo['Contact'],
                    'tel' => empty($oinfo['Tel']) ? "" : $oinfo['Tel'],
                    'addr' => empty($oinfo['Addr']) ? "" : $oinfo['Addr'],
                    'zipcode' => empty($oinfo['ZipCode']) ? "" : $oinfo['ZipCode'],
                    'createtime' => empty($oinfo['CreateTime']) ? "" : $oinfo['CreateTime'],
                    'username' => empty($oinfo['UserName']) ? "" : $oinfo['UserName'],
                )
            );
        }

        echo $this->_rc4_obj->ex(json_encode($result));
        exit();
    }

    /**
     * 根据EID
     * {
     * "msg": {
     * "cmsgtype": "2000",
     * "content": {
     * "eid":"eid"
     * }
     * }
     * }
     */
    private function getOInfoByEID($eid)
    {
        $sql = " SELECT O.EID,O.OName, 1 as OType,2 as IsTrial,O.Contact,O.Tel,O.Addr,O.ZipCode,O.CreateTime, U.UserName
FROM esm_user U INNER JOIN esm_organization O ON U.EID = O.EID WHERE O.EID=:eid LIMIT 1 ";

        $pdo = $this->connect();
        if (empty($pdo)) {
            return null;
        }

        $sth = $pdo->prepare($sql);
        $sth->execute(array(':eid' => $eid));

        $results = $sth->fetchAll();

        if (!is_array($results) || empty($results)) {
            return null;
        } else {
            return $results[0];
        }
    }
}


ClientReg::getContext()->run();