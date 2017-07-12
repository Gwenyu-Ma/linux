<?php
define('APP_PATH',dirname(dirname(__FILE__)));
define('DS',DIRECTORY_SEPARATOR);
define('API_PATH',APP_PATH.DS);
define('API_FILE_EXT','.class.php');


define("protocol", "1.0");//通讯协议版本

define("API_I_HEAD_ERROR", 1); //Header头未传递I及V信息
define("API_I_HEADNULL_ERROR", 2);//Header头传递I信息为空
define("API_I_EID_ERROR", 3);//Header头信息eid参数缺失
define("API_I_GUID_ERROR", 4);//Header头信息guid参数缺失
define("API_BODY_ERROR", 5);//HTTP内容信息格式错误
define("API_I_HEADER_ERROR", 6);//Header头信息参数错误

