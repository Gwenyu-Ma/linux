<?php
require_once __DIR__ . '/../vendor/autoload.php';

ini_set("display_errors", "on");

require_once dirname(__FILE__) . '/Common/constant.php';
use \Lib\Store\Redis as rds;
use \Lib\Util\rc4;


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

    private function test()
    {

        //echo date('Ymd h:i:s');
        // echo time();
        //exit();
    }

    /**
     * 服务接口
     */
    public function  service()
    {
        try {
            $this->test();
            $this->_dispatcher();
        } catch (\Exception $e) {
            //Log::add("Api Error", array('ErrorMessage' => $e->getMessage(), 'ip' => getIP()));
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
     * 检查、重组vinfo
     */
    private function checkVinfo()
    {
        if (isset($this->header->vinfo) && $this->header->vinfo != "") {
            unset($this->header->vinfo);
        }

        $this->header->stime = time();//服务器端时间戳
        $this->header->lrtype = 4;//测试代码，正式上线后要删掉这句
        $this->header->tespan = 300;//测试代码，正式上线后要删掉这句

        $this->header->vinfo = $this->_rc4_obj->encrypt(json_encode($this->header));
    }


    /**
     * @param $result
     * @param $content
     */
    private function checkAuth($content, &$result)
    {
        //根据系统类型判断客户端授权信息，
        //任一子产品获得授权，则认为该客户端以获得授权；
        //反之，认为该客户端没有获得授权
        //0:未授权 1：已授权
        $sysAu = 0;
        $epguid = $content['guid'];//客户端guid

        $contentrows = $result['msg'];
        for ($i = 0; $i < count($contentrows); $i++) {
            $result['msg'][$i]['tespan'] = AUTH_TIMESPAN;
            $guids = $result['msg'][$i]['content'];
            foreach ($guids as $guid => $vaue) {
                $auth = array();
                $auth = json_decode(rds::hGet(REDIS_AUTH_PRODUCT, $guid), true);
                $authCount = $auth['count'];//产品授权数量
                //判断今天是否在期限内
                //检查白名单数量，白名单多于当前授权数的情况要考虑好，等于时，直接拒绝非白名单成员
                //检查当前以授权队列客户端数量

                //已经授权数量，如果不存在此授权，当0处理
                $authedCount = rds::sCard(REDIS_AUTH_EP_QUEUE . $guid .UNDERLINE.  date('Ymd', time()));

                if ($authCount > $authedCount) {
                    //客户端guid如果不在已授权列表存中，则加入列表
                    if (!rds::sIsMember(REDIS_AUTH_EP_QUEUE . $guid .UNDERLINE.  date('Ymd', time()), $epguid)) {
                        rds::sAdd(REDIS_AUTH_EP_QUEUE . $guid . UNDERLINE. date('Ymd', time()), $epguid);
                    }

                    //客户端此时已加入授权列表，则需从未授权列表中移除
                    if (rds::sIsMember(REDIS_NAUTH_EP_QUEUE . $guid . UNDERLINE. date('Ymd', time()), $epguid)) {
                        //移除
                        rds::sRem(REDIS_NAUTH_EP_QUEUE . $guid . UNDERLINE. date('Ymd', time()), $epguid);
                    }

                    $result['msg'][$i]['content'][$guid] = 1;
                    $sysAu = 1;//任一子产品获得授权，则认为该客户端以获得授权；
                } else {
                    //客户端guid如果在已授权列表存中，则返回已授权
                    if (rds::sIsMember(REDIS_AUTH_EP_QUEUE . $guid .UNDERLINE.  date('Ymd', time()), $epguid)) {

                        //客户端此时已加入授权列表，则需从未授权列表中移除
                        if (rds::sIsMember(REDIS_NAUTH_EP_QUEUE . $guid .UNDERLINE.  date('Ymd', time()), $epguid)) {
                            //移除
                            rds::sRem(REDIS_NAUTH_EP_QUEUE . $guid .UNDERLINE.  date('Ymd', time()), $epguid);
                        }

                        $result['msg'][$i]['content'][$guid] = 1;
                        $sysAu = 1;//任一子产品获得授权，则认为该客户端以获得授权
                    }
                    else{
                        if (!rds::sIsMember(REDIS_NAUTH_EP_QUEUE . $guid . UNDERLINE. date('Ymd', time()), $epguid)) {
                            rds::sAdd(REDIS_NAUTH_EP_QUEUE . $guid .UNDERLINE.  date('Ymd', time()), $epguid);
                        }
                        $result['msg'][$i]['content'][$guid] = 0;
                    }
                }
            }
        }

        if ($this->header->systype == 'windows') {
            $auSets = REDIS_AUTH_WEP_QUEUE;
            $nauSets = REDIS_NAUTH_WEP_QUEUE;
        } elseif ($this->header->systype == 'linux') {
            $auSets = REDIS_AUTH_LEP_QUEUE;
            $nauSets = REDIS_NAUTH_LEP_QUEUE;
        }

        if ($sysAu === 1) {
            if (!rds::sIsMember($auSets . date('Ymd', time()), $epguid)) {
                rds::sAdd($auSets . date('Ymd', time()), $epguid);
            }
            //客户端此时已加入授权列表，则需从未授权列表中移除
            if (rds::sIsMember($nauSets . date('Ymd', time()), $epguid)) {
                //移除
                rds::sRem($nauSets . date('Ymd', time()), $epguid);
            }
        } else {
            if (!rds::sIsMember($nauSets . date('Ymd', time()), $epguid)) {
                rds::sAdd($nauSets . date('Ymd', time()), $epguid);
            }
        }

        $result['guid'] = $epguid;
        $result['date'] = $content['edate'];
        rds::lPush(REDIS_AURESULTS_QUEUE, json_encode($result));
    }

    /**
     * @param $result
     * @param $content
     */
    private function receiveBodyInfo($content, &$result)
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
            //如果cmsgtypelist中包含上传计算机标识，则需要解包判断
            foreach ($this->header->cmsgtypelist as $cmsType) {
                if ($cmsType == '1001') {
                    $logType = 'epinfo';
                }
                break;
            }
        }

        if ($logType !== 'epinfo') {
            echo 'error:' . API_BODY_ERROR;
            exit();
        }

        //$rip = getIP();
        $edate = date("Y-m-d H:i:s");
        $content['guid'] = $this->header->guid;
        $content['systype'] = $this->header->systype;
        $content['edate'] = $edate;
        rds::lPush(REDIS_EPINFO_QUEUE, json_encode($content, JSON_UNESCAPED_UNICODE));
        $contentrows = $content['msg'];
        for ($i = 0; $i < count($content['msg']); $i++) {
            array_push($result['msg'], array('cmsgtype' => $contentrows[$i]['cmsgtype'], 'content' => array()));
            if (!isset($content['msg'][$i]['content']['moduleinfo'])) {
                continue;
            }

            $moduels = $content['msg'][$i]['content']['moduleinfo'];

            for ($j = 0; $j < count($moduels); $j++) {
                $result['msg'][$i]['content'][$moduels[$j]['guid']] = 0;
            }
        }

        $this->checkAuth($content, $result);
    }

    /**
     * @param $eid
     * @param $sguid
     * @return bool true:已在黑名单中
     */
    private function checkWhiteMenu($eid, $sguid)
    {

    }

    /**
     * 解析path路径
     */
    private function _dispatcher()
    {
        //解析header，校验参数
        $head_params = $this->_parseUri();

        $this->header = $head_params;
        $result = array('msg' => array());

        $vinfo = array();

        //vinfo信息提取
        if (isset($this->header->vinfo) && !empty($this->header->vinfo)) {
            $vinfo = json_decode($this->_rc4_obj->decrypt($this->header->vinfo), true);
        }

//        if (!isset($this->header->guid) && empty($this->header->guid)) {
//            echo 'error:' . API_I_GUID_ERROR;
//            exit();
//        }

        //接收body， epinfo
        $content = $this->_rc4_obj->ex(file_get_contents('php://input'));
        if (empty($content)) {
            echo 'error:' . API_BODY_ERROR;
            exit();
        }
        $this->receiveBodyInfo($content, $result);

        //构造header并输出
        $this->checkVinfo();
        //构造header
        $head = $this->_rc4_obj->encrypt(json_encode($this->header));
        $this->outHeader($head);
        unset($result['guid']);
        unset($result['date']);
        echo $this->_rc4_obj->ex(json_encode($result));
        exit();
    }
}

Api::getContext()->run();