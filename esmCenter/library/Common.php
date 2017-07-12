<?php

class Common
{
    public static function randStr($len = 6)
    {
        $chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        $len0 = strlen($chars);
        $randval = "";
        for ($i = 0; $i < $len; $i++) {
            $randval .= substr($chars, mt_rand(0, $len0 - 1), 1);
        }
        return $randval;
    }

    /**
     *
     * @param $str 原始字符串
     * @param $key 秘钥
     * @return string 加密后的字符串
     *         echo Common::encrypt("12345678","12345678")."<br />";
     */
    public static function encrypt($str, $key)
    {
        // 加密，返回大写十六进制字符串
        $td = mcrypt_module_open(MCRYPT_DES, '', MCRYPT_MODE_ECB, '');
        $iv = substr($key, 0, 16);
        mcrypt_generic_init($td, $key, $iv);
        $res = strtoupper(bin2hex(mcrypt_generic($td, $str)));
        mcrypt_generic_deinit($td);
        mcrypt_module_close($td);
        return $res;
    }

    /**
     *
     * @param $str 加密后的字符串
     * @param $key 秘钥
     * @return bool|string 解密后的字符串
     *         echo Common::decrypt("96D0028878D58C89","12345678");
     */
    public static function decrypt($str, $key)
    {
        $td = mcrypt_module_open(MCRYPT_DES, '', MCRYPT_MODE_ECB, '');
        $iv = substr($key, 0, 16);
        mcrypt_generic_init($td, $key, $iv);
        $strBin = hex2bin(strtolower($str));
        $res = trim(mdecrypt_generic($td, strtolower($str)));
        mcrypt_generic_deinit($td);
        mcrypt_module_close($td);
        return $res;
    }
    private static function hex2bin($hexData)
    {
        $binData = "";
        for ($i = 0; $i < strlen($hexData); $i += 2) {
            $binData .= chr(hexdec(substr($hexData, $i, 2)));
        }
        return $binData;
    }

    // 补齐几位字符串
    public static function strPad($id)
    {
        return str_pad($id, STR_PAD_LEN, "0", STR_PAD_LEFT);
    }
    public static function checkPhone($phone)
    {
        if (preg_match('/1[34578]{1}\d{9}$/', $phone)) {
            return true;
        }
        return false;
    }
    public static function saltMd5()
    {
        $time = time();
        $rising = "risingfuwuqimd5jiami";
        $rand = rand(10, 99);
        $salt = md5($time . $rising . $rand);
        return $salt;
    }
    public static function passMd5($pass, $salt, $encrypt = 'md5')
    {
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
    public static function checkEmail($email)
    {
        if (preg_match('/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/i', $email)) {
            return true;
        }
        return false;
    }

    /**
     * 获取客户端ip地址
     *
     * @return string
     */
    public static function getIP()
    {
        $ip = '';
        if (getenv("HTTP_CLIENT_IP")) {
            $ip = getenv("HTTP_CLIENT_IP");
        } else if (getenv("HTTP_X_FORWARDED_FOR")) {
            $ip = getenv("HTTP_X_FORWARDED_FOR");
        } else if (getenv("REMOTE_ADDR")) {
            $ip = getenv("REMOTE_ADDR");
        } else {
            $ip = "Unknow";
        }
        return $ip;
    }

    /**
     * urlencode加密
     *
     * @param string|array $value
     * @return string array
     */
    public static function url_encode($value)
    {
        if (empty($value)) {
            return $value;
        } else {
            return is_array($value) ? array_map(array(
                "self",
                "url_encode",
            ), $value) : urlencode($value);
        }
    }

    // 函数: ajax返回值格式化函数
    // 参数：code,action,msg,data
    // 参数说明：状态码(0:成功,1：失败,2：超时），客户端行为(0:提示,1:弹窗),返回客户端弹窗内容，响应数据
    public static function returnAjaxMsg($code = 1, $action = 0, $msg = '', $data = null)
    {
        $result = array(
            "r" => array(
                "code" => $code,
                "action" => $action,
                "msg" => $msg,
            ),
        );

        if ($data === null) {
            return $result;
        } else {
            $result["data"] = $data;
            return $result;
        }
    }

    // 函数json格式化串
    // 参数code,action,msg.data
    public static function showJsonMsg($code = 1, $action = 0, $msg = '', $data = null)
    {
        $result = null;
        if ($data == null) {
            $result = '{"r":{"code":' . $code . ',"action":' . $action . ',"msg":"' . $msg . '"}}';
        } elseif ($data == "") {
            $result = '{"r":{"code":' . $code . ',"action":' . $action . ',"msg":"' . $msg . '"},"data":""}';
        } else {
            $result = '{"r":{"code":' . $code . ',"action":' . $action . ',"msg":"' . $msg . '"},"data":' . json_encode($data) . '}';
        }
        return $result;
    }

    /**
     * 格式化输出
     *
     * @param $data 输出数据
     * @return boolean
     */
    public static function out($data)
    {
        if (is_array($data)) {
            echo json_encode($data);
        } else {
            echo self::json_filter($data);
        }
        exit();
    }

    /**
     * 过滤JSON字符
     *
     * @param $json string
     */
    public static function json_filter($json)
    {
        return str_replace(array(
            '"{',
            '}"',
            '\"',
            '\/',
            '\\\\',
            '"[',
            ']"',
            '#~',
        ), array(
            '{',
            '}',
            '"',
            '/',
            '',
            '[',
            ']',
            '\"',
        ), $json);
    }

    /**
     * global定义的配置文件的一维键值
     *
     * @param sting $key
     *            比如$config['province']
     * @return array
     */
    public static function getFormConfig($key)
    {
        include APP_PATH . "conf/form.php";
        $config_arr = array();

        if (!empty($config[$key])) {
            $config_arr = $config[$key];
        }

        return $config_arr;
    }

    /**
     * 校验表单数据的有效性，根据global里表单配置信息
     *
     * @param [type] $params
     *            页面传递参数及数据信息
     * @param [type] $form_arr
     *            配置文件里的表单配置
     * @param [type] $is_header
     *            true|false 异常返回写入header|以json返回指定格式
     * @return [type] [description]
     */
    public static function checkForm($params, $form_arr, $is_header = false)
    {
        if (empty($params) || empty($form_arr)) {
            if (!$is_header) {
                header('HTTP/1.1 501 Not Implemented');
                exit();
            } else {
                self::out(self::returnAjaxMsg(0, 1, '参数错误'));
            }
        }

        foreach ($form_arr as $key => $value) {
            $name = trim($value['desc']) != '' ? trim($value['desc']) : $key;
            if (isset($value['required']) && intval($value['required']) == 1) {
                // 验证参数信息存在与否且是否为空
                if (!isset($params[$key]) || $params[$key] == "") {
                    if (!$is_header) {
                        header('HTTP/1.1 501 Not Implemented');
                        exit();
                    } else {
                        self::out(self::returnAjaxMsg(0, 1, $name . "不能为空"));
                    }
                }
            }

            if (isset($params[$key]) && $params[$key] != "" && !empty($value['check_fun'])) {
                if (!empty($value['check_fun'])) {
                    foreach ($value['check_fun'] as $funName => $value) {
                        $bresult = true;
                        if (!empty($value)) {
                            $value_str = implode(",", $value);
                            if (!call_user_func_array('Common::checkUserName', array(
                                $params[$key],
                                $value_str,
                            ))) {
                                $bresult = false;
                            }
                        } else {
                            if (!call_user_func($funName, $params[$key])) {
                                $bresult = false;
                            }
                        }

                        if (!$bresult) {
                            if (!$is_header) {
                                header('HTTP/1.1 501 Not Implemented');
                                exit();
                            } else {
                                self::out(self::returnAjaxMsg(0, 1, $name . "不合法"));
                            }
                        }
                    }
                }
            }
        }
    }
    public static function checkUserName($str, $minLen = 6, $maxLen = 25)
    {
        if (preg_match('/^([0-9A-Za-z\\-_\\.]+)@([0-9a-z]+\\.[a-z]{2,3}(\\.[a-z]{2})?)$/i', $str) == 0 && preg_match('/1[3458]{1}\d{9}$/', $str) == 0) {
            return false;
        }

        if (strlen($str) < $minLen || strlen($str) > $maxLen) {
            return false;
        }

        return true;
    }

    /**
     * 判断当前注册账号为邮箱或手机号
     *
     * @param [type] $username
     *            账户名
     * @return [type] 1|2 邮箱|手机号
     */
    public static function checkUserNameType($username)
    {
        if (self::checkEmail($username)) {
            return 1;
        } elseif (self::checkPhone($username)) {
            return 2;
        } else {
            return false;
        }
    }
    public static function checkPwd($str)
    {
        if (preg_match('/{8,32}$/i', $str) == 0) {
            return false;
        }

        return true;
    }
    public static function checkNum($num)
    {
        if (preg_match('/^\d+$/i', $num) == 0) {
            return false;
        }

        return true;
    }

    /**
     * request web service
     *
     * @param array $config
     *            要请求的参数配置信息，url和fun 非必须传递 ，有特殊定义必须传递array('url' => 'xxx', 'fun' => 'funname', 'datainfo' = array())
     * @param string $ver
     *            接口版本信息 默认不传则为1
     * @return JSON $result_json 接口返回的json信息
     */
    public static function soapRequest($config, $ver = "1")
    {
        $client = new SoapClient(RISING_USER_INTERFACE_URL);
        $rs = new RsEncDec();

        if (!isset($config["fun"]) || $config["fun"] == "") {
            $fun = RISING_USER_INTERFACE_FUN;
        } else {
            $fun = trim($config["fun"]);
        }

        if (isset($config['datainfo']) && !empty($config['datainfo'])) {
            $json = json_encode($config['datainfo']);
            $params = $rs->rsencode($json);
            $result = $client->__soapCall($fun, array(
                "parameters" => array(
                    "ver" => $ver,
                    "datainfo" => $params,
                ),
            ));
        } else {
            $result = $client->__soapCall($fun, array(
                "",
            ));
        }

        $result_str = $fun . 'Result';
        if ($fun != "HelloWorld") {
            $result_json = $rs->rsdecode($result->$result_str);
        } else {
            $result_json = $result->$result_str;
        }

        return iconv("gbk", "UTF-8", $result_json);
    }

    /**
     * 注册用户邮件正文
     *
     * @param [type] $email_config
     *            array('flag','type','email','token','time')
     * @param
     *            [type] flag 1 系统用户
     * @param
     *            [type] type 邮件类型 1|2 注册用户邮件|找回密码邮件
     */
    public static function emailRegHtml($token)
    {
        $url = 'http://' . CURRENT_SERVER_IP . '/Index/active?token=' . $token;
        $html = "<html><head></head><body>";
        $html .= "<p>尊敬的用户，您好：</p>";
        $html .= "<b>欢迎您使用瑞星安全云服务：</b><br />您可以点击以下链接验证用户有效性并设置密钥：<br/><a href=\"$url\">$url</a><hr>";

        $html .= "如果以上链接无法点击，请将上面的地址复制到您的浏览器（如IE）的地址栏进入瑞星安全云服务---<br/>";
        $html .= "</body></html>";
        return $html;
    }

    /**
     * 找回密码邮件正文
     */
    public static function emailForgotPwdHtml($token)
    {
        $url = 'http://' . CURRENT_SERVER_IP . '/index.php/ForgotPwd/verifyMailLink?token=' . $token;
        $html = "<html><head></head><body>";
        $html .= "<p>尊敬的用户您好：</p>";
        $html .= "<b>欢迎您使用瑞星安全云服务：</b><br />您可以点击以下链接重设密钥：<br/><a href=\"$url\">$url</a> <hr>";

        $html .= "如果以上链接无法点击，请将上面的地址复制到您的浏览器（如IE）的地址栏进入瑞星安全云服务---<br/>";
        $html .= "以上链接24小时内有效，如果未及时重置密码，可重新发送邮件或联系系统管理员。";
        $html .= "</body></html>";
        return $html;
    }

    /**
     * 重设账号邮件正文
     */
    public static function emailUpdateNameHtml($token)
    {
        $url = 'http://' . CURRENT_SERVER_IP . '/index.php/mycenter/verifyMailLink?token=' . $token;
        $html = "<html><head></head><body>";
        $html .= "<p>尊敬的用户您好：</p>";
        $html .= "<b>欢迎您使用瑞星安全云服务：</b><br />您可以点击以下链接重设账号：<br/><a href=" . $url . '>'.$url.'</a><hr>';

        $html .= "如果以上链接无法点击，请将上面的地址复制到您的浏览器（如IE）的地址栏进入瑞星安全云服务---<br/>";
        $html .= "以上链接24小时内有效，如果未及时重置账号，可重新发送邮件或联系系统管理员。";
        $html .= "</body></html>";
        return $html;
    }

    /**
     * 发送手机短息接口
     *
     * @param [type] $phone
     *            11位手机号
     * @param [type] $message
     *            短信内容
     * @return [type] 0或其他错误码，0代表成功，其他均为发送短信失败
     */
    public static function esmSend($phone, $message)
    {
        $esm_config = array(
            'datainfo' => array(
                "msgtype" => 8001,
                "info" => array(
                    "phone" => $phone,
                    "smscontent" => $message,
                ),
            ),
        );

        $soap_result = self::soapRequest($esm_config);
        $soap_result = json_decode($soap_result);

        return $soap_result->result;
    }

    // 函数：获取mongodb 列表中注册最少的一个
    // 参数：空
    public static function getMongoDbHost()
    {
        include APP_PATH . "conf/config.php";
        $mongolist = $config['MONGODB_LIST'];
        $mongoindex = mt_rand(0, count($mongolist) - 1);
        return $mongolist[$mongoindex];
    }

    // 函数：设置redis里eid信息
    // 参数:企业唯一标识,用户名称，类型,mongodbhost,注册时间
    public static function createRedisEidInfo($eid, $username, $type, $mongodbhost, $regtime)
    {
        $redis = new Redis();
        $redis->connect(CACHE_REDIS_HOST, CACHE_REDIS_PORT);
        $redis->select(CACHE_REDIS_DB);
        $redis->hSet($eid, 'username', $username);
        $redis->hSet($eid, 'type', $type);
        $redis->hSet($eid, 'mongodbhost', $mongodbhost);
        $redis->hSet($eid, 'regtime', $regtime);

        $redis->hSet("MONGODB_LIST", $eid, $mongodbhost);
        $redis->close();

        return true;
    }

    /**
     * 构造时间检索条件
     *
     * @param int $flag
     *            0|1|2|3 本周|上周|本月|上月
     * @return array where条件
     */
    public static function getDateRange($flag)
    {
        switch ($flag) {
            case '0':
                $time_arr = self::getWeekRange(0);
                $startime = $time_arr[0];
                $endtime = $time_arr[1];
                break;
            case '1':
                $time_arr = self::getWeekRange(1);
                $startime = $time_arr[0];
                $endtime = $time_arr[1];
                break;
            case '2':
                $time_arr = self::getMonRange(0);
                $startime = $time_arr[0];
                $endtime = $time_arr[1];
                break;
            case '3':
                $time_arr = self::getMonRange(1);
                $startime = $time_arr[0];
                $endtime = $time_arr[1];
                break;
            default:
                // code...
                break;
        }

        $where = array(
            'time' => array(
                '$gte' => new MongoDate($startime),
                '$lt' => new MongoDate($endtime),
            ),
        );

        return $where;
    }

    /*
     * 获取一周的起始时间和结束时间戳
     * @params flag 0|1 自然周|非自然周 默认为自然周
     * return Array('起始时间戳', '结束时间戳')
     */
    public static function getWeekRange($flag)
    {
        if (!isset($flag) || $flag == 0) {
            $diff_day = date("w") - 1;
            $stweek = "-" . ($diff_day);
            $etweek = 0;
        } elseif ($flag == 1) {
            $stweek = -date("w") - 6;
            $etweek = -date("w");
        }

        $startdate = date("Y-m-d 00:00:00", strtotime($stweek . " day"));
        $enddate = date("Y-m-d 23:59:59", strtotime($etweek . " day"));
        $starttime = strtotime($startdate);
        $endtime = strtotime($enddate);
        return array(
            $starttime,
            $endtime,
        );
    }

    /*
     * 获取一月的起始时间和结束时间戳
     * @params flag 0|1 自然月|非自然月 默认为自然月
     * return Array('起始时间戳', '结束时间戳')
     */
    public static function getMonRange($flag = 0)
    {
        if (!isset($flag) || $flag == 0) {
            $stday = date("Y-m-d H:i:s", mktime(0, 0, 0, date("m"), 1, date("Y")));
            $etday = date("Y-m-d H:i:s", mktime(0, 0, 0, date("m") + 1, 1, date("Y")));
        } elseif ($flag == 1) {
            $stday = date("Y-m-d H:i:s", mktime(0, 0, 0, date("m") - 1, 1, date("Y")));
            $etday = date("Y-m-d H:i:s", mktime(0, 0, 0, date("m"), 1, date("Y")));
        }
        $starttime = strtotime($stday);
        $endtime = strtotime($etday);
        return array(
            $starttime,
            $endtime,
        );
    }

    // 转换MONGO 时间
    public static function MongoDateToDate($MongoDate)
    {
        return date('Y-m-d H:i:s', $MongoDate->sec);
    }

    // 转换MONGO 时间
    public static function SecToTime($time)
    {
        if (is_numeric($time)) {
            $value = array(
                "years" => 0,
                "days" => 0,
                "hours" => 0,
                "minutes" => 0,
                "seconds" => 0,
            );
            if ($time >= 31556926) {
                $value["years"] = floor($time / 31556926);
                $time = ($time % 31556926);
            }
            if ($time >= 86400) {
                $value["days"] = floor($time / 86400);
                $time = ($time % 86400);
            }
            if ($time >= 3600) {
                $value["hours"] = floor($time / 3600);
                $time = ($time % 3600);
            }
            if ($time >= 60) {
                $value["minutes"] = floor($time / 60);
                $time = ($time % 60);
            }
            $value["seconds"] = floor($time);
            if ($value["years"] != 0) {
                $y = $value["years"] . "年";
            }
            if ($value["days"] != 0) {
                $d = $value["days"] . "天";
            }
            $t = $y . $d . " " . $value["hours"] . "小时" . $value["minutes"] . "分" . $value["seconds"] . "秒";
            return $t;
        } else {
            return (bool) false;
        }
    }
    public static function checkLimit($val, $limit = 100)
    {
        if (isset($val) && intval($val) > $limit) {
            return false;
        }

        return true;
    }

    /**
     * Cookie 设置、获取、删除
     *
     * @param string $name
     *            cookie名称
     * @param mixed $value
     *            cookie值
     * @param mixed $option
     *            cookie参数
     * @return mixed
     */
    public static function cookie($name = '', $value = '', $option = null)
    {
        // 默认设置
        $config = array(
            'prefix' => COOKIE_PREFIX, // cookie 名称前缀
            'expire' => COOKIE_EXPIRE, // cookie 保存时间
            'path' => COOKIE_PATH, // cookie 保存路径
            'domain' => COOKIE_DOMAIN, // cookie 有效域名
            'secure' => COOKIE_SECURE, // cookie 启用安全传输
            'httponly' => COOKIE_HTTPONLY,
        ) // httponly设置
        ;
        // 参数设置(会覆盖黙认设置)
        if (!is_null($option)) {
            if (is_numeric($option)) {
                $option = array(
                    'expire' => $option,
                );
            } elseif (is_string($option)) {
                parse_str($option, $option);
            }

            $config = array_merge($config, array_change_key_case($option));
        }
        if (!empty($config['httponly'])) {
            ini_set("session.cookie_httponly", 1);
        }
        // 清除指定前缀的所有cookie
        if (is_null($name)) {
            if (empty($_COOKIE)) {
                return null;
            }

            // 要删除的cookie前缀，不指定则删除config设置的指定前缀
            $prefix = empty($value) ? $config['prefix'] : $value;
            if (!empty($prefix)) {
                // 如果前缀为空字符串将不作处理直接返回
                foreach ($_COOKIE as $key => $val) {
                    if (0 === stripos($key, $prefix)) {
                        setcookie($key, '', time() - 3600, $config['path'], $config['domain'], $config['secure'], $config['httponly']);
                        unset($_COOKIE[$key]);
                    }
                }
            }
            return null;
        } elseif ('' === $name) {
            // 获取全部的cookie
            return $_COOKIE;
        }
        $name = $config['prefix'] . str_replace('.', '_', $name);
        if ('' === $value) {
            if (isset($_COOKIE[$name])) {
                $value = $_COOKIE[$name];
                if (0 === strpos($value, 'think:')) {
                    $value = substr($value, 6);
                    return array_map('urldecode', json_decode(MAGIC_QUOTES_GPC ? stripslashes($value) : $value, true));
                } else {
                    return $value;
                }
            } else {
                return null;
            }
        } else {
            if (is_null($value)) {
                setcookie($name, '', time() - 3600, $config['path'], $config['domain'], $config['secure'], $config['httponly']);
                unset($_COOKIE[$name]); // 删除指定cookie
            } else {
                // 设置cookie
                if (is_array($value)) {
                    $value = 'think:' . json_encode(array_map('urlencode', $value));
                }
                $expire = !empty($config['expire']) ? time() + intval($config['expire']) : 0;
                setcookie($name, $value, $expire, $config['path'], $config['domain'], $config['secure'], $config['httponly']);
                $_COOKIE[$name] = $value;
            }
        }
        return null;
    }
    public static function checkUserUniqueNameType($str)
    {
        $type = self::checkUserNameType($str);
        if ($type) {
            $_SESSION['UserInfo']['UserNameType'] = $type;
            $_SESSION['UserInfo']['UserName'] = $str;
            return true;
        } else {
            return false;
        }
    }

    /**
     * array (
     * 'code' => $checkCode, //验证码
     * 'type' => $type //1注册验证 2找回密码
     * )
     */
    public static function phoneMsg($arr)
    {
        if ($arr['type'] == '1') {
            $msg = "您正在注册瑞星云安全中心，验证码：" . $arr['code'] . "。 【瑞星云安全中心】";
        } else {
            $msg = "您正在找回密码，验证码：" . $arr['code'] . "。 【瑞星云安全中心】";
        }
        return $msg;
    }
    public static function getMicroTime()
    {
        return microtime(true) * 100;
    }
    public static function formDate($res, $arr_result = array(), $str_result = '')
    {
        if ($res) {
            foreach ($res as $k) {
                if (is_array($k)) {
                    array_push($arr_result, $k);
                } elseif (is_string($k)) {
                    $str_result = $k;
                }
            }
            return !empty($arr_result) ? $arr_result : $str_result;
        } else {
            return false;
        }
    }
    public static function mongoResultToArray($date)
    {
        if ($date) {
            return iterator_to_array($date);
        } else {
            return false;
        }
    }
    public static function formTotalDate($arr_data)
    {
        if (is_array($arr_data)) {
            return array(
                'total' => count($arr_data),
                'rows' => $arr_data,
            );
        } else {
            return false;
        }
    }
    public static function pageTotalDate($arr_data, $total)
    {
        if (is_array($arr_data)) {
            return array(
                'total' => $total,
                'rows' => $arr_data,
            );
        } else {
            return false;
        }
    }
    public static function getNewGuid()
    {
        return strtoupper(md5(uniqid(mt_rand(), true)));
    }


    /**
     * 字符串中的所有字母变成数字，然后所有数字相加
     * @param $s
     * @return int
     */
    public static function getv($s)
    {
        $arr = str_split($s, 1);
        $v = 0;
        for ($i = 0; $i < strlen($s); $i++) {
            $v = $v + ord($arr[$i]);
        }
        return $v;
    }
}
