<?php
use \Lib\Model\RedisDataManager;
use \Lib\Store\LogsMysql as MC;

class SysModel
{
    private $db_obj;

    public function __construct()
    {
        $this->sysinfo = select_manage_collection('sysinfo');
    }

    public function SysEdit($websitename, $eid)
    {
        $rtnMsg = null;
        $date = time();
        $result = $this->sysinfo->update(
            array('eid' => $eid),
            array('$set' => array(
                'websitename' => $websitename,
                'edate' => $date,
                'ip' => '',

            )),
            array('upsert' => true)
        );
        if (isset($result) && $result['ok'] == 1) {
            return true;
        }
        return false;
    }

    public function GetSys($eid)
    {
        $res = Common::mongoResultToArray($this->sysinfo->find(array('eid' => $eid)));
        if (empty($res)) {
//            return  array(array('websitename' => DEFAULT_TITLE));
            return DEFAULT_TITLE;
        }
        foreach ($res as $k) {
            $websitename = $k['websitename'];
        }
        return array('websitename' => $websitename);
    }

    public function getOSStatistics($eid)
    {
        if (empty($eid)) {
            return null;
        }
        return RedisDataManager::getOSStatistics($eid);
    }

    public function getEpOnlineStatistics($eid)
    {
        $group = new GroupModel();
        $bID = $group->getBlackGroupID($eid);

        $epinfoCollection = select_manage_collection('epinfo');
        $rswtotal = $epinfoCollection->find(array('eid' => $eid, 'systype' => 'windows','unset'=>0,'groupid'=>['$ne' => $bID]), array('sguid' => 1))->count();
        $rsantotal = $epinfoCollection->find(array('eid' => $eid, 'systype' => 'android','unset'=>0,'groupid'=>['$ne' => $bID]), array('sguid' => 1))->count();
        $eps = RedisDataManager::getEpOnline($eid);

        $rswon = 0;
        $rsanon = 0;
        foreach ($eps as $epid => $epvalue) {
            $pos = strpos($epid, 'windows');
            if ($pos !== false) {
                if ($epvalue >= time()) {
                    $rswon = $rswon + 1;
                }
            } else {
                $pos = strpos($epid, 'android');
                if ($pos !== false) {
                    if ($epvalue >= time()) {
                        $rsanon = $rsanon + 1;
                    }
                }
            }
        }

        $rswoff = $rswtotal - $rswon;
        if($rswoff<0){
            $rswoff = 0;
        }

        $rsanoff = $rsantotal - $rsanon;
        if($rsanoff<0){
            $rsanoff = 0;
        }
        return array('won' => $rswon, 'woff' => $rswoff, 'anon' => $rsanon, 'anoff' => $rsanoff);
    }

    public function usedSpace($eid)
    {
        //MC::$eid = $eid;
        MC::getRow('CALL fn_get_all_size(\'' . $eid . '\',@virsize,@vircount,@defsize,@defcount,
    @ndefsize,@ndefcount,@nmgrsize,@nmgrcount,@avirsize,
    @avircount,@aspamsize,@aspamcount,@apointsize,@apointcount
)');
        $result = MC::getRow('select @virsize virsize,
                                    @vircount vircount,
                                    @defsize defsize,
                                    @defcount defcount,
                                    @ndefsize ndefsize,
                                    @ndefcount ndefcount,
                                    @nmgrsize nmgrsize,
                                    @nmgrcount nmgrcount,
                                    @avirsize avirsize,
                                    @avircount avircount,
                                    @aspamsize aspamsize,
                                    @aspamcount aspamcount,
                                    @apointsize apointsize,
                                    @apointcount apointcount');

        $result['virsize']=$result['vircount']==0? 0:$result['virsize'];
        $result['defsize']=$result['defcount']==0? 0:$result['defsize'];
        $result['ndefsize']=$result['ndefcount']==0? 0:$result['ndefsize'];
        $result['nmgrsize']=$result['nmgrcount']==0? 0:$result['nmgrsize'];
        $result['avirsize']=$result['avircount']==0? 0:$result['avirsize'];
        $result['aspamsize']=$result['aspamcount']==0? 0:$result['aspamsize'];
        $result['apointsize']=$result['apointcount']==0? 0:$result['apointsize'];
        return $result;
    }
}
