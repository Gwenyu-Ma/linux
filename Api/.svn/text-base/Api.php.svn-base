<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/4/17
 * Time: 13:38
 */
require_once __DIR__ . '/../vendor/autoload.php';

ini_set("display_errors", "on");

require_once dirname(__FILE__) . '/Common/constant.php';
require_once dirname(__FILE__) . '/Common/rsfunc.php';

use \Lib\Store\Redis as rds;
use \Lib\Util\Common as UCommon;
use \Lib\Util\rc4;
use \Lib\Util\Log;

use \Lib\Util\Ioa;

class Api
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
            //::add("Api Error", array('ErrorMessage' => $e->getMessage(), 'ip' => getIP()));
        }
    }

    /**
     * 加载类文件
     *
     * @param  $classname String 加载类的文件名
     * @return void
     */
    public function load($classname = '', $isLib = FALSE)
    {
        $file = '';
        if ($isLib) {
            $file = API_PATH . 'Library' . DS . $classname . API_FILE_EXT;
        } else {
            if ($classname) {
                $file = API_PATH . 'I' . strtolower($classname) . DS . $classname . API_FILE_EXT;
            } else {
                $file = API_PATH . $this->_api_dir . DS . strtolower($this->_api_name) . API_FILE_EXT;
            }
        }

        if (file_exists($file)) {
            include $file;
        } else {
            raiseError("文件加载失败");
        }
    }

    /**
     * 验证请求的URL
     */
    private function _validateUrl($uri)
    {
        if (preg_match('/^Api/Api\.php$/', $uri)) {
            return TRUE;
        } else {
            return FALSE;
        }
    }

    private function setPstamp($cache_pstamp)
    {
        if (isset($cache_pstamp)) {
            $this->header->pstamp = $cache_pstamp;
        }
    }

    private function setCstamp($cache_cstamp)
    {
        if (isset($cache_cstamp)) {
            $this->header->cstamp = $cache_cstamp;
        }
    }

    /**
     * 处理URI
     */
    private function _parseUri()
    {
        if (!isset($_SERVER['HTTP_I']) && !isset($_SERVER['HTTP_V'])) {
            echo "error:" . API_I_HEAD_ERROR;
            exit;
        }

        $http_i = $_SERVER['HTTP_I'];
        $http_v = $_SERVER['HTTP_V'];
        $head = $this->_rc4_obj->decrypt($http_i);
        $head_arr = json_decode($head);


        if ($head_arr == null || empty($head_arr)) {
            echo "error:" . API_I_HEADNULL_ERROR;
            exit;
        }

        if (!isset($head_arr->guid) || $head_arr->guid == "") {
            echo 'error:' . API_I_GUID_ERROR;
            exit();
        }

        if (!isset($head_arr->systype) || $head_arr->systype == "") {
            echo 'error:' . API_I_GUID_ERROR;
            exit();
        }

        return $head_arr;
    }

    private function outHeader($header)
    {
        header("Content-Type:text/html; charset=utf-8");
        header("i:" . $header);
        header("v:" . protocol);
    }

    /**
     * 获取要下发的策略及命令信息
     * @param  obj $redis
     * @return array
     */
    private function getContent()
    {
        $r = array();
        $allcmd = array();
        $policyver = '';//要返回header的策略版本号
        $cmdver = '';//要返回header的命令版本号

        //策略
        $this->load("Policy", false);
        $policy_obj = new Policy($this->header);
        $policy_arr = $policy_obj->getAllPolicy();//获取全部策略
        $policyver = $policy_obj->getVer();//要返回header的策略版本号
        $is_delete_policy = $policy_obj->isDeletedPolicy();//是否要下发清除策略

        //命令
        $this->load("Command", false);
        $command_obj = new Command($this->header);
        $allcmd = $command_obj->getAllCommand();//获取全部命令
        $cmdver = $command_obj->getVer();//要返回header的命令版本号

        $info_arr = array(
            'policy' => $policy_arr,
            'cmd' => $allcmd
        );

        include API_PATH . 'Common' . DS . 'config.php';
        $r = constructInfoNew($config, $info_arr);

        if ($is_delete_policy) {
            $policy = $config['policy'];
            array_push($r, $policy);
        }

        $r['pstamp'] = $policyver;
        $r['cstamp'] = $cmdver;
        return $r;
    }

    /**
     * 检查、重组vinfo
     */
    private function checkVinfo()
    {
        if (isset($this->header->vinfo) && $this->header->vinfo != "") {
            unset($this->header->vinfo);
        }

        $this->header->stime = time();//服务器端时间戳
        $this->header->lrtype = 4;//测试代码，正式上线后要删掉这句
        $this->header->tespan = 5;//测试代码，正式上线后要删掉这句

        $this->header->vinfo = $this->_rc4_obj->encrypt(json_encode($this->header));
    }

    /**
     * 根据上报计算机信息去数据库中检查，
     * 如果上报计算机的sguid与数据库中的sguid不一致，
     * 则，以数据库的为准（更新客户端sguid），
     * @param $content
     */
    private function checkSGUID($content)
    {
        $cnt = count($content);
        if ($cnt < 1) {
            return;
        }

        $epifo = array();
        foreach ($content as $key => $value) {
            switch (intval($value['cmsgtype'])) {
                case 2001:
                    $epifo = $value['content'];
                    break;
                default:
                    # code...
                    break;
            }
        }

        if (!empty(rds::hGet(CACHE_REDIS_EP_PRE . $this->header->eid . $this->header->sguid, 'ep_info'))) {
            return;
        }

        //根据mac地址
        $clct = select_manage_collection('epinfo');
        $data = $clct->findOne(array('eid' => $this->header->eid, 'mac' => $epifo['computerinfo']['mac']), array('sguid' => 1));

        if ($data['sguid'] !== null && $this->header->sguid !== $data['sguid']) {
            $this->header->sguid = $data['sguid'];
        }
    }

    /**
     * Epinfo按照指定格式保存到Kafka中
     * @param $content
     */
    private function saveEpinfoToMQ($content)
    {
        $contentmsg = $content['msg'];

        foreach ($contentmsg as $submsg) {

            if (!isset($submsg['cmsgtype']) || empty($submsg['cmsgtype'])) {
                echo 'error:' . API_BODY_ERROR;
                exit();
            }

            if (!isset($submsg['content']) || empty($submsg['content'])) {
                echo 'error:' . API_BODY_ERROR;
                exit();
            }

            if (!isset($submsg['content']['computerinfo']) || empty($submsg['content']['computerinfo'])) {
                echo 'error:' . API_BODY_ERROR;
                exit();
            }

            if ($submsg['cmsgtype'] !== "2001") {
                continue;
            }

            $epinfo = $submsg['content']['computerinfo'];
            $epinfo['logtype'] = 'epinfo';
            $epinfo['eid'] = $content['eid'];
            $epinfo['guid'] = $content['guid'];
            $epinfo['sguid'] = $content['sguid'];
            $epinfo['systype'] = $content['systype'];
            $epinfo['onlinestate'] = 1;//在线状态 0：不在线 1：在线 2 客户端已主动卸载
            $epinfo['unset'] = 0;//在线状态 0：未卸载 1：已卸载

            $epinfo['rip'] = $content['rip'];
            $epinfo['edate'] = $content['edate'];
            $epinfo['createtime'] = $content['edate'];
            if (!empty($submsg['content']['moduleinfo'])) {
                $epinfo['productinfo'] = $submsg['content']['moduleinfo'];
            }

//            $partCount = RdKFK::getPartitionsCount();
//            $partitions = $this->getv($content['eid']) % $partCount;
//            //Log::add("API Epinfo Kafka", array('log' => json_encode($epinfo, JSON_UNESCAPED_UNICODE)));
//            RdKFK::getInstance()->produce($partitions, 0, json_encode($epinfo, JSON_UNESCAPED_UNICODE));
            //echo json_encode($epinfo, JSON_UNESCAPED_UNICODE);
            UCommon::writeRabbitMq($epinfo);

        }
    }

    /**
     * 日志数据按照指定格式保存到Kafka中
     * @param $content
     */
    private function saveLogToMQ($content)
    {
        $contentmsg = $content['msg'];

        foreach ($contentmsg as $submsg) {

            if (!isset($submsg['cmsgtype']) || empty($submsg['cmsgtype'])) {
                echo 'error:' . API_BODY_ERROR;
                exit();
            }

            if (!isset($submsg['content']) || empty($submsg['content'])) {
                echo 'error:' . API_BODY_ERROR;
                exit();
            }

            if (!isset($submsg['content']['reportcontent']) || empty($submsg['content']['reportcontent'])) {
                echo 'error:' . API_BODY_ERROR;
                exit();
            }

            if ($submsg['cmsgtype'] !== "2002") {
                continue;
            }

            $reportcontent = $submsg['content']['reportcontent'];
            foreach ($reportcontent as $log) {
                $log['eid'] = $content['eid'];
                $log['sguid'] = $content['sguid'];
                $log['systype'] = $content['systype'];
                $log['edate'] = $content['edate'];
                //echo json_encode($log);
                UCommon::writeRabbitMq($log);
            }
        }
    }

    /**
     * 检查授权
     * @param $content
     */
    private function checkAuth($content)
    {
        //根据系统类型判断客户端授权信息，
        //任一子产品获得授权，则认为该客户端以获得授权；
        //反之，认为该客户端没有获得授权
        //0:未授权 1：已授权
        $sysAu = 0;
        $eid = $content['eid'];//eid
        $epguid = $content['sguid'];//客户端sguid
        $result = array('msg' => array());

        $contentrows = $content['msg'];
        for ($i = 0; $i < count($content['msg']); $i++) {
            array_push($result['msg'], array('cmsgtype' => $contentrows[$i]['cmsgtype'], 'content' => array()));
            if (!isset($content['msg'][$i]['content']['moduleinfo'])) {
                continue;
            }

            $result['msg'][$i]['tespan'] = AUTH_TIMESPAN;
            $moduels = $content['msg'][$i]['content']['moduleinfo'];

            for ($j = 0; $j < count($moduels); $j++) {
                $auth = array();
                $proGuid = $moduels[$j]['guid'];//产品guid

                $auth = json_decode(rds::hGet(REDIS_AUTH_PRODUCT.UNDERLINE.$eid, $proGuid), true);
                $authCount = $auth['count'];//产品授权数量
                //echo '产品授权数量'.$auth.'</ br>';
                //echo '产品guid'.$proGuid.'</ br>';
                //已经授权数量，如果不存在此授权，当0处理
                $authedCount = rds::sCard(REDIS_AUTH_EP_QUEUE .$eid. UNDERLINE.$proGuid .UNDERLINE. date('Ymd', time()));

                if ($authCount > $authedCount) {
                    //客户端guid如果不在已授权列表存中，则加入列表
                    if (!rds::sIsMember(REDIS_AUTH_EP_QUEUE .$eid. UNDERLINE.$proGuid.UNDERLINE.date('Ymd', time()), $epguid)) {
                        rds::sAdd(REDIS_AUTH_EP_QUEUE . $eid. UNDERLINE.$proGuid .UNDERLINE. date('Ymd', time()), $epguid);
                    }

                    //客户端此时已加入授权列表，则需从未授权列表中移除
                    if (rds::sIsMember(REDIS_NAUTH_EP_QUEUE .$eid. UNDERLINE.$proGuid. UNDERLINE.date('Ymd', time()), $epguid)) {
                        //移除
                        rds::sRem(REDIS_NAUTH_EP_QUEUE .$eid. UNDERLINE.$proGuid .UNDERLINE. date('Ymd', time()), $epguid);
                    }

                    $result['msg'][$i]['content'][$proGuid] = 1;
                    $sysAu = 1;//任一子产品获得授权，则认为该客户端以获得授权；
                } else {
                    //客户端guid如果在已授权列表存中，则返回已授权
                    if (rds::sIsMember(REDIS_AUTH_EP_QUEUE . $eid. UNDERLINE.$proGuid .UNDERLINE. date('Ymd', time()), $epguid)) {

                        //客户端此时已加入授权列表，则需从未授权列表中移除
                        if (rds::sIsMember(REDIS_NAUTH_EP_QUEUE . $eid. UNDERLINE.$proGuid .UNDERLINE. date('Ymd', time()), $epguid)) {
                            //移除
                            rds::sRem(REDIS_NAUTH_EP_QUEUE . $eid. UNDERLINE.$proGuid .UNDERLINE. date('Ymd', time()), $epguid);
                        }

                        $result['msg'][$i]['content'][$proGuid] = 1;
                        $sysAu = 1;//任一子产品获得授权，则认为该客户端以获得授权
                    }
                    else{
                        if (!rds::sIsMember(REDIS_NAUTH_EP_QUEUE . $eid. UNDERLINE.$proGuid .UNDERLINE. date('Ymd', time()), $epguid)) {
                            rds::sAdd(REDIS_NAUTH_EP_QUEUE . $eid. UNDERLINE.$proGuid .UNDERLINE. date('Ymd', time()), $epguid);
                        }
                        $result['msg'][$i]['content'][$proGuid] = 0;
                    }
                }
            }


            $auSets = REDIS_AUTH_WEP_QUEUE;
            $nauSets = REDIS_NAUTH_WEP_QUEUE;
            if ($this->header->systype == 'windows') {
                $auSets = REDIS_AUTH_WEP_QUEUE;
                $nauSets = REDIS_NAUTH_WEP_QUEUE;
            } elseif ($this->header->systype == 'linux') {
                $auSets = REDIS_AUTH_LEP_QUEUE;
                $nauSets = REDIS_NAUTH_LEP_QUEUE;
            }


            if ($sysAu === 1) {
                if (!rds::sIsMember($auSets . $eid. UNDERLINE. date('Ymd', time()), $epguid)) {
                    rds::sAdd($auSets. $eid. UNDERLINE . date('Ymd', time()), $epguid);
                }
                //客户端此时已加入授权列表，则需从未授权列表中移除
                if (rds::sIsMember($nauSets . $eid. UNDERLINE. date('Ymd', time()), $epguid)) {
                    //移除
                    rds::sRem($nauSets . $eid. UNDERLINE. date('Ymd', time()), $epguid);
                }
            } else {
                if (!rds::sIsMember($nauSets . $eid. UNDERLINE. date('Ymd', time()), $epguid)) {
                    rds::sAdd($nauSets . $eid. UNDERLINE. date('Ymd', time()), $epguid);
                }
            }

            $this->checkVinfo();

            //构造header
            $head = $this->_rc4_obj->encrypt(json_encode($this->header));
            $this->outHeader($head);

            echo $this->_rc4_obj->ex(json_encode($result));

            $result['eid'] = $eid;
            $result['guid'] = $epguid;
            $result['date'] = $content['edate'];
            $result['logtype'] = 'auth_today_link';

            //echo json_encode($result);
            UCommon::writeRabbitMq($result);
            //rds::lPush(REDIS_AURESULTS_QUEUE, json_encode($result));
        }
        exit();
    }

    /**
     * @param $result
     * @param $content
     */
    private function receiveBodyInfo($content, $cache, &$result)
    {
        if (empty($content)) {
            return;
        }

        $content = json_decode($content, true);
        if (json_last_error() != JSON_ERROR_NONE) {
            //Log::add("jsonlasterrormsg", array("arr" => json_last_error_msg()));
            echo 'error:' . API_BODY_ERROR;
            exit();
        }
        if (!isset($content['msg']) || empty($content['msg'])) {
            echo 'error:' . API_BODY_ERROR;
            exit();
        }

        $logType = 'log';//epinfo:终端信息； log日志信息
        if (isset($this->header->cmsgtypelist) && !empty($this->header->cmsgtypelist)) {
            //如果cmsgtypelist中包含上传计算机标识，则需要解包判断，该计算机信息是否为重装的情况
            //如果是重装的情况，需要把原sguid返回给客户端，用于更正当前的sguid
            foreach ($this->header->cmsgtypelist as $cmsType) {
                if ($cmsType == '2001') {
                    $logType = 'epinfo';
                    //$this->checkSGUID($content['msg']);
                }
                elseif($cmsType == '1001'){
                    $logType = 'authinfo';
                }
                break;
            }
        }

        $contentrows = $content['msg'];
        for ($i = 0; $i < count($content['msg']); $i++) {
            array_push($result['msg'], array('cmsgtype' => $contentrows[$i]['cmsgtype'], 'content' => 0));
        }

        $rip = getIP();
        $edate = date("Y-m-d H:i:s");
        $content['pstamp'] = $cache['pstamp'];
        $content['cstamp'] = $cache['cstamp'];
        $content['eid'] = $this->header->eid;
        $content['sguid'] = $this->header->sguid;
        $content['guid'] = $this->header->guid;
        if (empty($this->header->tespan)) {
            $this->header->tespan = 300;
        }
        $content['tespan'] = $this->header->tespan;

        if (!empty($this->header->systype)) {
            $content['systype'] = $this->header->systype;
        } else {
            $content['systype'] = "";
        }

        $content['rip'] = $rip;
        $content['edate'] = $edate;

        switch ($logType) {
            case 'epinfo':
                $this->saveEpinfoToMQ($content);
                break;
            case 'log':
                $this->saveLogToMQ($content);
                break;
            case 'authinfo':
                $this->checkAuth($content);
                break;
        }
    }

    /**
     * @param $eid
     * @param $sguid
     * @return bool true:已在黑名单中
     */
    private function checkBlackMenu($eid, $sguid)
    {
        if (rds::hGet(CACHE_REDIS_EP_PRE . $eid . $sguid, 'inblackmenu') == '1') {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 更新客户端在线状态
     * 当前时间+心跳周期=过期时间
     */
    private function setOffLineTime()
    {
        if (!empty(rds::hGet(CACHE_REDIS_EP_PRE . $this->header->eid . $this->header->sguid, 'ep_info'))) {

            $tespan = !empty($this->header->tespan) ? $this->header->tespan : 300;
            $tespan = $tespan * 2;
            if ($tespan < 70) {
                $tespan = 70;
            }
            $edate = time() + $tespan;
            //$edate = strtotime(date("Y-m-d H:i:s", strtotime("+" . $tespan . " seconds")));

            //更新客户端在线状态
            //当前时间+心跳周期=过期时间
            rds::hSet(CACHE_REDIS_ONLINESTATE_PRE . $this->header->eid,
                $this->header->systype . ':' . $this->header->sguid,
                $edate);
        }
    }

    /**
     * 检查EID合法性
     */
    private function checkEID()
    {
        $tmpEID = rds::hGet(CACHE_REDIS_ONLINESTATE_PRE . $this->header->eid, $this->header->eid);

        if ($this->header->eid === $tmpEID) {
            return true;
        } else {
            //Log::add("checkEID", array('EIDeidfalse' => $tmpEID . '&' . $this->header->eid));
            return false;
        }
    }

    /**
     * 解析path路径
     */
    private function _dispatcher()
    {
        $head_params = $this->_parseUri();

        $this->header = $head_params;
        $pstamp = isset($this->header->pstamp) ? $this->header->pstamp : "";
        $cstamp = isset($this->header->cstamp) ? $this->header->cstamp : "";
        $result = array('msg' => array());
        $eid = isset($this->header->eid) ? $this->header->eid : "";

        if (!$this->checkEID()) {
            echo 'error:' . API_I_EID_ERROR;
            exit();
        }
        $vinfo = array();

        //vinfo信息提取
        if (isset($this->header->vinfo) && !empty($this->header->vinfo)) {
            $vinfo = json_decode($this->_rc4_obj->decrypt($this->header->vinfo), true);
        }

        //只有地第一次访问服务器时sguid允许为空，其他情况sguid为空均视为不合法
        //“第一次”，有两种情况，
        //1、完全是新用户第一次访问服务器（数据库中不存在mac地址或guid、手机唯一标记等信息）
        //2、客户端重装，记录信息全部丢失（数据库中存在mac地址或guid、手机唯一标记等信息）
        //
        if (isset($this->header->sguid) && !empty($this->header->sguid)) {
//1、如果某台机器安装了终端，并且已经拥有sguid，此时sguid已经写在客户端的注册表中，如果卸载掉，但是注册表不删
//2、又重现安装终端，会读取注册表，获取老的sguid，但是产生的header，不会有vinfo
//3、所有取消此判断
//			if (empty($vinfo)) {//为空，视为恶意篡改信息
//				echo "error:" . API_I_HEADER_ERROR;
//				exit();
//			}

            if ($this->checkBlackMenu($eid, $this->header->sguid)) {
                //构造header
                $head = $this->_rc4_obj->encrypt(json_encode($this->header));
                $this->outHeader($head);

                array_push($result['msg'], array('cmsgtype' => '3002'));
                echo $this->_rc4_obj->ex(json_encode($result));
                exit();
            }

            //设置在线时间
            $this->setOffLineTime();

            //更新队列信息标识
            $is_push = false;

            //获取策略命令
            $cache = $this->getContent();

            //接收body，包括epinfo和log
            $content = $this->_rc4_obj->ex(file_get_contents('php://input'));
            if (!empty($content)) {
                $this->receiveBodyInfo($content, $cache, $result);
            } else {
                if (!empty($this->header->cmsgtypelist)) {

                    foreach ($this->header->cmsgtypelist as $cmsType) {
                        if ($cmsType == '2004' || $cmsType == '2005') {
                            //客户端退出2004 (下线)消息，客户端卸载，也要做下线处理
                            //将过期时间设为当前，即，代表离线
                            rds::hSet(CACHE_REDIS_ONLINESTATE_PRE . $this->header->eid,
                                $this->header->systype . ':' . $this->header->sguid,
                                time());
                        }

                        if ($cmsType == '2005') {
                            //客户端卸载消息2005

                            rds::lPush(REDIS_EPUNSET_QUEUE, json_encode(array(
                                'eid' => $this->header->eid,
                                'sguid' => $this->header->sguid,
                                'unset' => 1
                            )));

                            UCommon::writeRabbitMq([
                                'logtype' => 'epinfo',
                                'eid' => $eid,
                                'sguid' => $this->header->sguid,
                                'unset' => 1,
                                'optype' => 'd'
                            ]);

                            $epinfo = rds::hGet(CACHE_REDIS_EP_PRE . $this->header->eid . $this->header->sguid, 'ep_info');
                            $epinfo = json_decode($epinfo);

                            $computerName = !empty($epinfo->computername) ? $epinfo->computername : "";

                            $msg = sprintf('b:%s:pf:ep:uninst', $eid);
                            $title = '终端' . $computerName . '已卸载';
                            $body = <<<BODY
        终端被卸载 <br />
        终端名称：%s <br />
        卸载时间：%s <br />
BODY;
                            $body = sprintf($body,
                                $computerName,
                                date("Y-m-d H:i:s")
                            );
                            $ok = \Lib\Util\Common::makeMsg(json_encode([$msg]), $body, $title);
                            if (is_string($ok)) {
                                //Log::add('ERROR', ['response' => $ok]);
                            }

                            $rualog = '{ "logtype":"rua_log", "dwith":"0", "eid":"%s", "sguid":"%s", "data":[ { "time":"%s", "eventtype":0, "eventlevel":0, "eventsource":"", "category":0, "username":"", "description":"unset", "flowid":%s, "source":1, "action":3, "role":1, "oldver":"", "newver":"", "needreboot":0, "afterreboot":0, "info":"" } ] }';
                            $rualog = sprintf($rualog, $eid, $this->header->sguid, date("Y-m-d H:i:s"), time());

                            UCommon::writeRabbitMq($rualog);
                            break;
                        }
                        break;
                    }
                }
            }

            //构造header并输出
            $this->setPstamp($cache['pstamp']);
            $this->setCstamp($cache['cstamp']);
            $this->checkVinfo();

            //构造header
            $head = $this->_rc4_obj->encrypt(json_encode($this->header));
            $this->outHeader($head);

//exit();
            //当客户端时间戳与服务器端时间戳不一致，下发内容策略信息
            $is_out_body = false;

            unset($cache['pstamp']);
            unset($cache['cstamp']);
            if (!empty($cache)) {
                $is_out_body = true;
                for ($i = 0; $i < count($cache); $i++) {
                    array_push($result['msg'], $cache[$i]);
                }
            }

            if ((isset($content) && !empty($content)) || $is_out_body) {
                echo $this->_rc4_obj->ex(json_encode($result));
            }
            exit();
        } else {

            //vinfo只有服务器产生，客户端只是记录和传输，不做修改，
            if (!empty($vinfo)) {//不为空，说明不是第一次访问服务器，视为恶意篡改信息
                echo "error:" . API_I_HEADER_ERROR;
                exit();
            }

            $sguid = createGuid();
            $this->header->sguid = $sguid;
            $this->header->pstamp = 0;
            $this->header->cstamp = 0;

            $this->header->tespan = 300;
            $this->header->lrtype = 1;
            $this->header->lrsize = 0;

            $this->checkVinfo();

            //echo json_encode($this->header);
            //var_dump($this->header);
            $head = $this->_rc4_obj->encrypt(json_encode($this->header));

            //Log::add("API Create Sguid Header: ", json_decode(json_encode($this->header), true));

            $this->outHeader($head);
        }
    }
}

Api::getContext()->run();