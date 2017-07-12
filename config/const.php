<?php
// 此文件内常量可以直接使用，不用require

define('MONGO_MANAGE_DB', 'rs_esm_mongo');
define('MONGO_LOG_DB', 'rs_esm_log');

define('REDIS_CMD_OUTTIME',1800);//redis超时时间


define('REDIS_EPINFO_QUEUE', 'lep');//客户端队列，接收所有客户端放到此队列后逐条入库
define('REDIS_AURESULTS_QUEUE', 'lre');//服务器对客户端授权结果队列，逐条入库
define('REDIS_WHITE_MENU', 'swep_');//白名单子产品队列，每个子产品一个队列 swep_guid

//一天内，获得当前子产品授权的客户端列表（有效期一天，一天后自动过期）
//每个子产品一个队列，队列数量由已授权子产品数量决定
//lau_guid_date : sau_子产品guid_20170323
define('REDIS_AUTH_EP_QUEUE', 'sau_');

//一天内，未获得当前子产品授权的客户端列表
//lnau_guid_date : snau_子产品guid_20170323
define('REDIS_NAUTH_EP_QUEUE', 'snau_');

//例：lauw_
define('REDIS_AUTH_WEP_QUEUE', 'sauw_');//Windows系统所有获得授权的客户端列表（guid）（有效期一天）
define('REDIS_NAUTH_WEP_QUEUE', 'snauw_');//Windows系统所有未获得授权的客户端列表（guid）（有效期一天）
define('REDIS_AUTH_LEP_QUEUE', 'saul_');//Linux系统所有获得授权的客户端列表（guid）（有效期一天）
define('REDIS_NAUTH_LEP_QUEUE', 'snaul_');//Linux系统所有未获得授权的客户端列表（guid）（有效期一天）
define('REDIS_AUTH_PRODUCT', 'hau');//子产品授权详情

define("UNDERLINE", "_");//hash类型，用于存储组信息、客户端策略、版本信息
//redis缓存前缀
define("CACHE_REDIS_EP_PRE", "hep_");//hash类型，用于存储组信息、客户端策略、版本信息
define("CACHE_REDIS_ORG_PRE", "heid_");//hash类型，用于存储全网策略、组策略等内容
define("CACHE_REDIS_EP_CMD_PRE", "lcmd_");//list类型，客户端命令列表
define("CACHE_REDIS_CMD_PRE", "strcmd_");//string类型，用于存储命令内容
define("CACHE_REDIS_ONLINESTATE_PRE", "heidos_");//hash类型，用于存储企业所有客户端的心跳信息

//首页统计数据
define("CACHE_REDIS_OSSTAT_PRE", "hosstat:");//hash类型，首页操作系统类型统计数据
define("CACHE_REDIS_XAVCOUNT_PRE", "hxavcount:");//hash类型，首页操作系统类型统计数据

define("AUTH_TIMESPAN", 300);//获取授权时间间隔

define('DL_PFX', 'dl_');
//define('DL_RDS_PKG_ANDROID', DL_PFX . 'android');
define('DL_RDS_PKG_LINUX', DL_PFX . 'linux');
define('DL_RDS_PKG_WINDOWS', DL_PFX . 'windows');
define('DL_RDS_EIDS', DL_PFX . 'eids');
define('DL_RDS_TASKS', DL_PFX . 'tasks');
define('DL_API_KEY', 'yiquganchangduan');
define('DL_RDS_PKG_LINUX_PRO',DL_PFX.'_linux_pro');

//升级包
define('DL_RDS_UPGRADE','dl_upgrade');
define('DL_RDS_UPGRADE_LINUX',DL_RDS_UPGRADE.'_linux');
define('DL_RDS_UPGRADE_LINUX_PRO',DL_RDS_UPGRADE.'_linux_pro');//linux版本集合 L25I  L27I 