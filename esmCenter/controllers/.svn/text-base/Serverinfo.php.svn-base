<?php
    class ServerinfoController extends MyController
{
    public function init() {
        parent::init();
    }

    public function getPerformanceAction(){
        $aRes = array();
        $aRes['cpu'] = $this->getCpuAction();
        $aRes['mem'] = $this->getMemAction();
        $aRes['disk'] = $this->getDiskAction();
        $aRes['time'] = date('Y-m-d H:i:s');
        $this->ok( $aRes );
    }

    private function getCpuAction(){
       exec('top -bn 1 |grep Cpu | cut -d "," -f 1 | cut -d ":" -f 2',$cpu,$resCode);
       $aCpu = explode(' ',$cpu[0]);
       return $aCpu[2].'%';
    }

    private function getMemAction(){
        exec('top -bn 1 |grep "Mem :" | cut -d "," -f 1 | cut -d ":" -f 2',$totalMem,$resCode);
        $aTotalMem = explode(' ',$totalMem[0]);
        exec('top -bn 1 |grep "Mem :" |cut -d "," -f 3',$usedMem,$resCode);
        $aUsedMem = explode(' ',$usedMem[0]);
        $iRes = ($aUsedMem[2]/$aTotalMem[1])*100;
        return  number_format($iRes,2).'%';
    }

    private function getDiskAction(){
        $iTotal = round(@disk_total_space(".") / (1024 * 1024 * 1024), 3); //总
        $iUsableness = round(@disk_free_space(".") / (1024 * 1024 * 1024), 3); //可用
        $iImpropriate = $iTotal - $iUsableness; //已用
        $iPercent = (floatval($iTotal) != 0) ? round($iImpropriate / $iTotal * 100, 2) : 0;
        $sDesc = '';
        if($iPercent>85){
            $sDesc ="<span style='color: #f40'>磁盘空间不多了，建议近期清理一下日志</span>";
        }
        if($iPercent>95){
            $sDesc ="<span style='color: #f40'>磁盘空间快满了，可能会影响审计系统正常使用，建议立即清理日志</span>";
        }
        /*
        return array(
            'iTotal' => $iTotal,  //总容量
            'iUsableness' => $iUsableness, //剩余容量
            'iImpropriate' => $iImpropriate, //已使用容量
            'iPercent' => $iPercent, //使用率
            'sDesc' => $sDesc,
        );*/
        return $iPercent.'%';
    }

    //以下方法不作为本次接口

    public function getCpuDataAction($speed = 0.5)
    {
 
        if (false === ($prevVal = @file("/proc/stat"))) return false;
        $prevVal = implode($prevVal, PHP_EOL);
        $prevArr = explode(' ', trim($prevVal));
        $prevTotal = $prevArr[2] + $prevArr[3] + $prevArr[4] + $prevArr[5];
        $prevIdle = $prevArr[5];
        usleep($speed * 1000000);
        $val = @file("/proc/stat");
        $val = implode($val, PHP_EOL);
        $arr = explode(' ', trim($val));
        $total = $arr[2] + $arr[3] + $arr[4] + $arr[5];
        $idle = $arr[5];
        $intervalTotal = intval($total - $prevTotal);
        echo  round(100 * (($intervalTotal - ($idle - $prevIdle)) / $intervalTotal),2);
    }


     /**
     * Cpu相关信息
     * @return array|bool
     */
    static public function getCpuInfoDataAction()
    {
        if (false === ($str = @file("/proc/cpuinfo"))) return false;
        $str = implode("", $str);
        @preg_match_all("/model\s+name\s{0,}\:+\s{0,}([\w\s\)\(\@.-]+)([\r\n]+)/s", $str, $model);
        @preg_match_all("/cpu\s+MHz\s{0,}\:+\s{0,}([\d\.]+)[\r\n]+/", $str, $mhz);
        @preg_match_all("/cache\s+size\s{0,}\:+\s{0,}([\d\.]+\s{0,}[A-Z]+[\r\n]+)/", $str, $cache);
        @preg_match_all("/bogomips\s{0,}\:+\s{0,}([\d\.]+)[\r\n]+/", $str, $bogomips);
        $res = array();
        if (false !== is_array($model[1])) {
            $res['cpu']['num'] = sizeof($model[1]);
            if ($res['cpu']['num'] == 1)
                $x1 = '';
            else
                $x1 = ' &times;' . $res['cpu']['num'];
            $res['cpu']['mhz'] = $mhz[1][0];
            $mhz[1][0] = ' <br />   频率:' . $mhz[1][0];
            $res['cpu']['cache'] = $cache[1][0];
            $cache[1][0] = ' <br />   二级缓存:' . $cache[1][0];
            $res['cpu']['bogomips'] = $bogomips[1][0];
            $bogomips[1][0] = ' <br />  Bogomips:' . $bogomips[1][0];
            $res['cpu']['model'][] = $model[1][0] . $mhz[1][0] . $cache[1][0] . $bogomips[1][0] . $x1;
            if (false !== is_array($res['cpu']['model'])) $res['cpu']['model'] = implode("<br />", $res['cpu']['model']);
            if (false !== is_array($res['cpu']['mhz'])) $res['cpu']['mhz'] = implode("<br />", $res['cpu']['mhz']);
            if (false !== is_array($res['cpu']['cache'])) $res['cpu']['cache'] = implode("<br />", $res['cpu']['cache']);
            if (false !== is_array($res['cpu']['bogomips'])) $res['cpu']['bogomips'] = implode("<br />", $res['cpu']['bogomips']);
        }
        print_r( $res );
    }


 
    /**
     * 内存相关数据
     * 单位为B
     * @return array|bool
     */
    static public function getMenDataAction()
    {
        if (false === ($str = @file("/proc/meminfo"))) return false;
        $str = implode("", $str);
        preg_match_all("/MemTotal\s{0,}\:+\s{0,}([\d\.]+).+?MemFree\s{0,}\:+\s{0,}([\d\.]+).+?Cached\s{0,}\:+\s{0,}([\d\.]+).+?SwapTotal\s{0,}\:+\s{0,}([\d\.]+).+?SwapFree\s{0,}\:+\s{0,}([\d\.]+)/s", $str, $buf);
        preg_match_all("/Buffers\s{0,}\:+\s{0,}([\d\.]+)/s", $str, $buffers);
        $res = array();
        $res['memTotal'] = round($buf[1][0] / 1024, 2);
        $res['memFree'] = round($buf[2][0] / 1024, 2);
        $res['memBuffers'] = round($buffers[1][0] / 1024, 2);
        $res['memCached'] = round($buf[3][0] / 1024, 2);
        $res['memUsed'] = $res['memTotal'] - $res['memFree'];
        $res['memPercent'] = (floatval($res['memTotal']) != 0) ? round($res['memUsed'] / $res['memTotal'] * 100, 2) : 0;
 
        $res['memRealUsed'] = $res['memTotal'] - $res['memFree'] - $res['memCached'] - $res['memBuffers']; //真实内存使用
        $res['memRealFree'] = $res['memTotal'] - $res['memRealUsed']; //真实空闲
        $res['memRealPercent'] = (floatval($res['memTotal']) != 0) ? round($res['memRealUsed'] / $res['memTotal'] * 100, 2) : 0; //真实内存使用率
 
        $res['memCachedPercent'] = (floatval($res['memCached']) != 0) ? round($res['memCached'] / $res['memTotal'] * 100, 2) : 0; //Cached内存使用率
 
        $res['swapTotal'] = round($buf[4][0] / 1024, 2);
        $res['swapFree'] = round($buf[5][0] / 1024, 2);
        $res['swapUsed'] = round($res['swapTotal'] - $res['swapFree'], 2);
        $res['swapPercent'] = (floatval($res['swapTotal']) != 0) ? round($res['swapUsed'] / $res['swapTotal'] * 100, 2) : 0;
 
        //判断内存如果小于1G，就显示M，否则显示G单位
        if ($res['memTotal'] < 1024) {
            $memTotal = $res['memTotal'] . " M";
            $mt = $res['memTotal'] . " M";
            $mu = $res['memUsed'] . " M";
            $mf = $res['memFree'] . " M";
            $mc = $res['memCached'] . " M"; //cache化内存
            $mb = $res['memBuffers'] . " M"; //缓冲
            $st = $res['swapTotal'] . " M";
            $su = $res['swapUsed'] . " M";
            $sf = $res['swapFree'] . " M";
            $swapPercent = $res['swapPercent'];
            $memRealUsed = $res['memRealUsed'] . " M"; //真实内存使用
            $memRealFree = $res['memRealFree'] . " M"; //真实内存空闲
            $memRealPercent = $res['memRealPercent']; //真实内存使用比率
            $memPercent = $res['memPercent']; //内存总使用率
            $memCachedPercent = $res['memCachedPercent']; //cache内存使用率
        } else {
            $memTotal = round($res['memTotal'] / 1024, 3) . " G";
            $mt = round($res['memTotal'] / 1024, 3) . " G";
            $mu = round($res['memUsed'] / 1024, 3) . " G";
            $mf = round($res['memFree'] / 1024, 3) . " G";
            $mc = round($res['memCached'] / 1024, 3) . " G";
            $mb = round($res['memBuffers'] / 1024, 3) . " G";
            $st = round($res['swapTotal'] / 1024, 3) . " G";
            $su = round($res['swapUsed'] / 1024, 3) . " G";
            $sf = round($res['swapFree'] / 1024, 3) . " G";
            $swapPercent = $res['swapPercent'];
            $memRealUsed = round($res['memRealUsed'] / 1024, 3) . " G"; //真实内存使用
            $memRealFree = round($res['memRealFree'] / 1024, 3) . " G"; //真实内存空闲
            $memRealPercent = $res['memRealPercent']; //真实内存使用比率
            $memPercent = $res['memPercent']; //内存总使用率
            $memCachedPercent = $res['memCachedPercent']; //cache内存使用率
        }
 
        $res['u_memTotal'] = $memTotal;
        $res['u_memTotal'] = $mt;
        $res['u_memUsed'] = $mu;
        $res['u_memFree'] = $mf;
        $res['u_memCached'] = $mc; //cache化内存
        $res['u_memBuffers'] = $mb; //缓冲
        $res['u_swapTotal'] = $st;
        $res['u_swapUsed'] = $su;
        $res['u_swapFree'] = $sf;
        $res['u_swapPercent'] = $swapPercent;
        $res['u_memRealUsed'] = $memRealUsed; //真实内存使用
        $res['u_memRealFree'] = $memRealFree; //真实内存空闲
        $res['u_memRealPercent'] = $memRealPercent; //真实内存使用比率
        $res['u_memPercent'] = $memPercent; //内存总使用率
        $res['u_memCachedPercent'] = $memCachedPercent; //cache内存使用率
        print_r( $res ) ;
    }

    /**
     * 网接相关流量信息
     */
    static public function getInterfaceDataAction()
    {
        //mii-tool
        $strs = @file("/proc/net/dev");
        for ($i = 2; $i < count($strs); $i++) {
            preg_match_all("/([^\s]+):[\s]{0,}(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/", $strs[$i], $info);
            $NetOutSpeed[$i] = $info[10][0]; //入网实时
            $NetInputSpeed[$i] = $info[2][0]; //出网实时
            $NetInput[$i] = self::formatsize($info[2][0]); //入网流量
            $NetOut[$i] = self::formatsize($info[10][0]); //出网流量
        }
    }

    /**
     * 单位自动转换
     * @param $size
     * @return string
     */
    static public function formatSize($size)
    {
        $danwei = array(' B ', ' K ', ' M ', ' G ', ' T ');
        $allsize = array();
        $i = 0;
        for ($i = 0; $i < 5; $i++) {
            if (floor($size / pow(1024, $i)) == 0) {
                break;
            }
        }
        $allsize1 = array();
        for ($l = $i - 1; $l >= 0; $l--) {
            $allsize1[$l] = floor($size / pow(1024, $l));
            if (isset($allsize1[$l + 1])) {
                $allsize[$l] = $allsize1[$l] - $allsize1[$l + 1] * 1024;
            }
        }
        $len = count($allsize);
        $fsize = "";
        for ($j = $len - 1; $j >= 0; $j--) {
            $fsize = $fsize . $allsize[$j] . $danwei[$j];
        }
        return $fsize;
    }

}