<?php
use \Lib\Model\RedisDataManager;
use \Lib\Util\rc4;
use Lib\Store\LogsMysql as MC;

class XAVLogModel
{
    private $_rc4;
    private $_eid;

    public function __construct($eid)
    {
        $this->_rc4 = new rc4();
        //MC::$eid = $eid;
    }

    public function __destruct()
    {

    }

    /**
     * 根据查询条件，获取所有sguid，
     * @param $eid
     * @param $objtype
     * @param $objId
     * @param $qc 查询条件
     * @return mixed sguid数组
     */
    public function getSguids($eid,$objtype,$objId,$qc)
    {
        $sqlEpinfo = "select sguid from epinfo_$eid where eid='$eid' ";
        $sqlParams = array();
        if($objtype == '0'){
            $sqlEpinfo = $sqlEpinfo . " and unset =0 ";
            $group = new GroupModel();
            $bID = $group->getBlackGroupID($eid);
            if(!empty($bID)){
                $sqlEpinfo = $sqlEpinfo . " and ifnull(groupid,'') <> '$bID'";
            }
        }elseif($objtype == '1'){
            $sqlEpinfo = $sqlEpinfo . " and groupid =? and unset =0 ";
            array_push($sqlParams, $objId);
        }elseif($objtype == '2'){
            $sqlEpinfo = $sqlEpinfo . " and sguid =? and unset =0 ";
            array_push($sqlParams, $objId);
        }elseif($objtype == '-1'){
            $sqlEpinfo = $sqlEpinfo . " and unset =1 ";
        }
        // filter sguid
        $sids = [];
        if(!empty($qc->searchkey)&&!empty($qc->searchtype)&&($qc->searchtype=='computername' || $qc->searchtype=='ip')){
            if($qc->searchtype=='computername'){
                $sqlEpinfo .= " and (computername like ? OR memo like ?) ";
                array_push($sqlParams, '%'.$qc->searchkey.'%');
                array_push($sqlParams, '%'.$qc->searchkey.'%');
            }
            else{
                $sqlEpinfo .= " and $qc->searchtype like ? ";
                array_push($sqlParams, '%'.$qc->searchkey.'%');
            }
        }

        $sids = MC::getCol($sqlEpinfo,$sqlParams);

        return $sids;
    }

    private function formatXavQC($qc,&$sqlParams)
    {
        $and = "";
        if(empty($qc)){return "";}

        if(!empty($qc->begintime)){
            $and .= " and findtime >= ?";
            array_push($sqlParams, $qc->begintime);
        }
        if(!empty($qc->endtime)){
            $and .= " and findtime <= ? ";
            array_push($sqlParams, $qc->endtime);
        }

        if(!empty($qc->taskname)&&$qc->taskname!='all'){
            $and .= " and taskname like ? ";
            array_push($sqlParams, '%'.$qc->taskname.'%');
        }

        if(isset($qc->treatmethod)&&$qc->treatmethod!='-1'){
            $and .= " and treatmethod = ? ";
            array_push($sqlParams, $qc->treatmethod);
        }

        if(isset($qc->state)&&$qc->state!='-1'){
            $and .= " and state = ? ";
            array_push($sqlParams, $qc->state);
        }

        if(!empty($qc->searchkey)&&!empty($qc->searchtype)&&$qc->searchtype=='virusname'){
            $and .= " and $qc->searchtype like ? ";
            array_push($sqlParams, '%'.$qc->searchkey.'%');
        }

        return $and;
    }

    /**
     * 按病毒分组显示病毒数据
     * @param $eid
     * @param $objtype
     * @param $objId
     * @param $qc
     * @param $paging
     */
    public function getXavByVirus($eid,$objtype,$objId,$qc,$paging)
    {
        $sids = $this->getSguids($eid,$objtype,$objId,$qc);
        if(!$sids){
            return null;
        }

        $sqlParams = array();

        // where

        $and  = sprintf(" and sguid in ('%s')", implode("','", $sids));
        $and .= $this->formatXavQC($qc,$sqlParams);

        // order
        if(!empty($paging->sort)){
            $order = $paging->sort;
        }else{
            $order = 'virusname';
        }
        if(isset($paging->order) && $paging->order===0){
            $sort = 'asc';
        }else{
            $sort = 'desc';
        }

        if(isset($paging->offset)){
            $offset = $paging->offset;
        }else{
            $offset = 0;
        }
        if(isset($paging->limit)){
            $limit = $paging->limit;
        }else{
            $limit = 10;
        }

        $sql = <<<SQL
SELECT virusname,MAX(virusclass) virusclass,count(DISTINCT sguid) AS ClientCount, count(virusname) AS virusCount
FROM  XAV_Virus_%s where 1=1 %s
group by virusname
order by %s %s limit %s,%s
SQL;

        $sql = sprintf($sql,
            $eid,
            $and,
            $order,
            $sort,
            $offset,
            $limit
        );

        $rows = MC::getAll($sql,$sqlParams);

        $sql = <<<SQL
SELECT count(DISTINCT virusname) as count
FROM  XAV_Virus_%s where 1=1 %s
SQL;

        $sql = sprintf($sql,
            $eid,
            $and
        );

        $total = MC::getCell($sql,$sqlParams);
        $data = array(
            'rows'=>$rows,
            'total'=>$total
        );
        return $data;
    }

    public function setOnlinestate($eid,$data)
    {
        if(empty($data)){
           return null;
        }
        foreach($data as &$row){
            $offLineTime = RedisDataManager::getEpLastlogintime($eid,$row['systype'],$row['sguid']);
            $row['onlinestate'] = 0;
            if ($offLineTime >= time()) {
                $row['onlinestate'] = 1;
            }
            if($row['unset']=='1'){
                $row['onlinestate'] = 2;
            }
            if(!empty($row['computername'])&&!empty($row['memo'])){
                $row['computername'] = $row['memo'];
            }
        }

        return $data;
    }

    /**
     * 按客户端分组显示病毒数据
     * @param $eid
     * @param $objtype
     * @param $objId
     * @param $qc
     * @param $paging
     * @return mixed
     */
    public function getXavByEP($eid,$objtype,$objId,$qc,$paging)
    {
        $sids = $this->getSguids($eid,$objtype,$objId,$qc);
        if(!$sids){
            return null;
        }

        $sqlParams = array();

        // where

        $and  = sprintf(" and ep.sguid in ('%s')", implode("','", $sids));

        $and .= $this->formatXavQC($qc,$sqlParams);

        // order
        if(isset($paging->sort)){
            $order = $paging->sort;
        }else{
            $order = 'computername';
        }
        if(isset($paging->order) && $paging->order===0){
            $sort = 'asc';
        }else{
            $sort = 'desc';
        }

        if(isset($paging->offset)){
            $offset = $paging->offset;
        }else{
            $offset = 0;
        }
        if(isset($paging->limit)){
            $limit = $paging->limit;
        }else{
            $limit = 10;
        }
        /*
"SELECT
xav.findtime,
ep.sguid, computername,memo,ip,
xav.taskname,-- 快速查杀 全盘查杀
xav.filepath,-- 染毒文件路径
xav.virusclass,  -- 病毒类型
xav.virusname,  -- 病毒名称
xav.treatmethod, -- { 0, "暂未处理" }, { 1, "忽略" }, { 2, "删除" }, { 16, "清除" }, { 32, "信任" }, { 64, "上报" }
xav.state
FROM
epinfo ep
INNER JOIN
XAV_Virus xav
ON ep.sguid=xav.sguid
where ep.sguid in ('E637440B-8D1A-AF36-E11A-06946D9C0102','E637440B-8D1A-AF36-E11A-06946D9C0101','')";
*/

        $sql = <<<SQL
SELECT MAX(ep.sguid) sguid,computername,'0' AS onlinestate,MAX(ep.systype) AS systype,MAX(ep.unset) AS unset, MAX(ep.ip) ip,MAX(ep.memo) memo,COUNT(virusname) virusCount
FROM epinfo_%s ep
INNER JOIN
XAV_Virus_%s xav
ON ep.sguid=xav.sguid where 1=1 %s
group by computername
order by %s %s limit %s,%s
SQL;

        $sql = sprintf($sql,
            $eid,
            $eid,
            $and,
            $order,
            $sort,
            $offset,
            $limit
        );
//echo $sql;
        $rows = MC::getAll($sql,$sqlParams);

        $rows = $this->setOnlinestate($eid,$rows);

        $sql = <<<SQL
SELECT count(DISTINCT computername) as count
FROM epinfo_%s ep
INNER JOIN
XAV_Virus_%s xav
ON ep.sguid=xav.sguid where 1=1 %s
SQL;

        $sql = sprintf($sql,
            $eid,
            $eid,
            $and
        );

        $total = MC::getCell($sql,$sqlParams);
        $data = array(
            'rows'=>$rows,
            'total'=>$total
        );
        return $data;
    }

    /**
     * 获取病毒详情
     * @param $eid
     * @param $objtype
     * @param $objId
     * @param $qc
     * @param $paging
     * @return mixed
     */
    public function getXavDetails($eid,$objtype,$objId,$qc,$paging)
    {
        $sids = $this->getSguids($eid,$objtype,$objId,$qc);
        if(!$sids){
            return null;
        }

        $sqlParams = array();

        // where
        $and  = sprintf(" and ep.sguid in ('%s')", implode("','", $sids));
        $and .= $this->formatXavQC($qc,$sqlParams);

        // order
        if(isset($paging->sort)){
            $order = $paging->sort;
        }else{
            $order = 'computername';
        }
        if(isset($paging->order) && $paging->order===0){
            $sort = 'asc';
        }else{
            $sort = 'desc';
        }

        if(isset($paging->offset)){
            $offset = $paging->offset;
        }else{
            $offset = 0;
        }
        if(isset($paging->limit)){
            $limit = $paging->limit;
        }else{
            $limit = 10;
        }
        $sql = <<<SQL
SELECT xav.findtime,ep.sguid, computername,memo,'0' AS onlinestate,ep.systype,ep.unset,ip,xav.taskname,xav.filepath,xav.virusclass,xav.virusname,
xav.treatmethod,xav.state FROM epinfo_%s ep
INNER JOIN XAV_Virus_%s xav
ON ep.sguid=xav.sguid where 1=1 %s
order by %s %s limit %s,%s
SQL;
        $sql = sprintf($sql,
            $eid,
            $eid,
            $and,
            $order,
            $sort,
            $offset,
            $limit
        );

        $rows = MC::getAll($sql,$sqlParams);
        $rows = $this->setOnlinestate($eid,$rows);

        $sql = <<<SQL
SELECT count(computername) as count FROM epinfo_%s ep
INNER JOIN XAV_Virus_%s xav
ON ep.sguid=xav.sguid where 1=1 %s
SQL;

        $sql = sprintf($sql,
            $eid,
            $eid,
            $and
        );

        $total = MC::getCell($sql,$sqlParams);
        $data = array(
            'rows'=>$rows,
            'total'=>$total
        );
        return $data;
    }

    /**
     *
     * @param $eid
     * @param $objtype
     * @param $objId
     * @param $qc
     * @param $paging
     * @return mixed
     */
    public function getXavScanDetails($eid,$objtype,$objId,$qc,$paging)
    {
        $sids = $this->getSguids($eid,$objtype,$objId,$qc);
        if(!$sids){
            return null;
        }

        $sqlParams = array();

        // where
        $and  = sprintf(" and ep.sguid in ('%s')", implode("','", $sids));
        if(!empty($qc->begintime)){
            $and .= " and starttime >= ?";
            array_push($sqlParams, $qc->begintime);
        }
        if(!empty($qc->endtime)){
            $and .= " and starttime <= ? ";
            array_push($sqlParams, $qc->endtime);
        }

        if(!empty($qc->taskname)&&$qc->taskname!='all'){
            $and .= " and taskname like ? ";
            array_push($sqlParams, '%'.$qc->taskname.'%');
        }

        if(!empty($qc->state)&&$qc->state!='-1'){
            if($qc->state==4){
                $and .= " and state >= 0 and state <= 4 ";
            }elseif($qc->state==7){
                $and .= " and state >= 5 and state <= 7 ";
            }
        }

        // order
        if(isset($paging->sort)){
            $order = $paging->sort;
        }else{
            $order = 'computername';
        }
        if(isset($paging->order) && $paging->order===0){
            $sort = 'asc';
        }else{
            $sort = 'desc';
        }

        if(isset($paging->offset)){
            $offset = $paging->offset;
        }else{
            $offset = 0;
        }
        if(isset($paging->limit)){
            $limit = $paging->limit;
        }else{
            $limit = 10;
        }

        $sql = <<<SQL
SELECT starttime,ep.eid,ep.sguid,ep.computername,ep.ip,ep.memo,'0' AS onlinestate,ep.systype,ep.unset,taskname,state,scancount,runtime,xav.appid,viruscount,treatedcount
FROM epinfo_%s ep
INNER JOIN
XAV_ScanEvent_%s xav
ON ep.sguid=xav.sguid where 1=1 %s
order by %s %s limit %s,%s
SQL;
        $sql = sprintf($sql,
            $eid,
            $eid,
            $and,
            $order,
            $sort,
            $offset,
            $limit
        );
        $rows = MC::getAll($sql,$sqlParams);
        $rows = $this->setOnlinestate($eid,$rows);

        $sql = <<<SQL
SELECT count(computername) as count
FROM epinfo_%s ep
INNER JOIN
XAV_ScanEvent_%s xav
ON ep.sguid=xav.sguid where 1=1 %s
SQL;

        $sql = sprintf($sql,
            $eid,
            $eid,
            $and
        );

        $total = MC::getCell($sql,$sqlParams);
        $data = array(
            'rows'=>$rows,
            'total'=>$total
        );

        return $data;
    }
    /*
     * 获取客户端概览
     * @param $eid    [企业id]
     * @param  $argArr [过滤条件]
     * @return [客户端列表]
     */
    public function GetClientsOverview($eid, $argArr, $columns)
    {

        $groupId = $argArr['objId'];
        $clientWhere = [];
        if (!empty($argArr['name'])) {
            $clientWhere['name'] = $argArr['name'];
        }
        if (!empty($argArr['ip'])) {
            $clientWhere['ip'] = $argArr['ip'];
        }
        if (!empty($argArr['mac'])) {
            $clientWhere['mac'] = $argArr['mac'];
        }
        if (!empty($argArr['sys'])) {
            $clientWhere['sys'] = $argArr['sys'];
        }
        if (!empty($argArr['os'])) {
            $clientWhere['os'] = $argArr['os'];
        }
        if(!empty($argArr['productIds'])){
            $clientWhere['productIds']=$argArr['productIds'];
        }
        $clientWhere['onlinestate']=$argArr['onlinestate'];

        $epWhere = [];

        if (!empty($argArr['vlibver'])) {
            $preg = "/" . $argArr['vlibver'] . "/i";
            $regexObj = new MongoRegex($preg);
            $epWhere['vlibver'] = $regexObj;

        }

        if (intval($argArr['filemon']) >= 0) {

            $epWhere['filemon'] = strval($argArr['filemon']);
        }

        if (intval($argArr['mailmon']) >= 0) {

            $epWhere['mailmon'] = strval($argArr['mailmon']);
        }

        if (intval($argArr['sysmon']) >= 0) {
            $epWhere['sysmon'] = strval($argArr['sysmon']);
        }

        if (intval($argArr['VirusAction']) >= 0) {

            $epWhere['virusaction'] = strval($argArr['VirusAction']);
        }

        $group = new GroupModel();
        return $clientStateArr = $group->getComputersEpState($eid, $groupId, $clientWhere, $epWhere, $columns);
    }

    public function getXavStatistics($eid)
    {
        if (empty($eid)) {
            return null;
        }
        return RedisDataManager::getXavStatistics($eid);
    }

    public function sysdef($eid, $sids, $viewtype, $queryconditions, $paging)
    {
        // where
        $and = '';
        $query = [];
        if($sids){
            $and .= sprintf(" and sguid in ('%s')", implode("','", $sids));
        }
        if(!empty($queryconditions->begintime)){
            $and .= sprintf(" and time >= ?");
            $query[] = $queryconditions->begintime;
        }
        if(!empty($queryconditions->endtime)){
            $and .= sprintf(" and time < ?");
            $query[] = $queryconditions->endtime;
        }
        if(!empty($queryconditions->deftype)){
            $and .= sprintf(" and deftype = ?");
            $query[] = $queryconditions->deftype;
        }
        // order
        if(!empty($paging->sort)){
            $order = $paging->sort;
        }else{
            $order = 'time';
        }
        if(empty($paging->order)){
            $sort = 'asc';
        }else{
            $sort = 'desc';
        }

        if(!empty($paging->offset)){
            $offset = $paging->offset;
        }else{
            $offset = 0;
        }
        if(!empty($paging->limit)){
            $limit = $paging->limit;
        }else{
            $limit = 10;
        }

        // data
        $sql = '';
        if($viewtype === 'ep'){
            $sql = <<<SQL
select * from
    (select e.computername,e.ip,e.sguid,e.systype,e.eid,e.unset,xs.fxno,xs.time from epinfo_%s as e right join
        (select sguid,count(time) as fxno,max(time) as time from XAV_SysDef_%s
        where 1=1 %s
        group by sguid
        ) as xs
    on e.sguid=xs.sguid) as r
order by %s %s limit %s,%s
SQL;
            $sql = sprintf($sql,
                $eid,
                $eid,
                $and,
                $order,
                $sort,
                $offset,
                $limit
            );
            $sql1 = <<<SQL
select count(1) from
    (select e.computername,e.ip,e.sguid,e.systype,e.eid,e.unset,xs.fxno,xs.time from epinfo_%s as e right join
        (select sguid,count(time) as fxno,max(time) as time from XAV_SysDef_%s
        where 1=1 %s
        group by sguid
        ) as xs
    on e.sguid=xs.sguid) as r
SQL;
            $sql1 = sprintf($sql1,
                $eid,
                $eid,
                $and
            );
        }

        if($viewtype === 'xav'){
            $sql = <<<SQL
select description,count(time)as fxno, count(distinct sguid) as sno, max(time) as time
from XAV_SysDef_%s where 1=1 %s
group by description
order by %s %s limit %s,%s
SQL;
            $sql = sprintf($sql,
                $eid,
                $and,
                $order,
                $sort,
                $offset,
                $limit
            );
            $sql1 = <<<SQL
select count(1) from
    (select description,count(time)as fxno, count(distinct sguid) as sno, max(time) as time
    from XAV_SysDef_%s where 1=1 %s
    group by description) as r
SQL;
            $sql1 = sprintf($sql1,
                $eid,
                $and
            );
        }

        if($viewtype === 'detail'){
            $sql = <<<SQL
select * from
    (select e.computername,e.ip,e.unset,xs.* from epinfo_%s as e right join
        (select * from XAV_SysDef_%s
        where 1=1 %s
        ) as xs
    on e.sguid=xs.sguid) as r
order by %s %s limit %s,%s
SQL;
            $sql = sprintf($sql,
                $eid,
                $eid,
                $and,
                $order,
                $sort,
                $offset,
                $limit
            );

            $sql1 = <<<SQL
select count(1) from
    (select e.computername,e.ip,e.unset,xs.* from epinfo_%s as e right join
        (select * from XAV_SysDef_%s
        where 1=1 %s
        ) as xs
    on e.sguid=xs.sguid) as r
SQL;
            $sql1 = sprintf($sql1,
                $eid,
                $eid,
                $and
            );
        }
        if(!$sql)return [];

        return array(
             'total' => MC::getCell($sql1, $query),
             'rows' => MC::getAll($sql, $query),
        );
    }

    public function balog($eid, $sids, $viewtype, $queryconditions, $paging)
    {
        $and = '';
        $query = [];
        if($sids){
            $and .= sprintf(" and sguid in ('%s')", implode("','", $sids));
        }
        if(!empty($queryconditions->begintime)){
            $and .= sprintf(" and time >= ?");
            $query[] = $queryconditions->begintime;
        }
        if(!empty($queryconditions->endtime)){
            $and .= sprintf(" and time < ?");
            $query[] = $queryconditions->endtime;
        }
        if(!empty($queryconditions->type)){
            $and .= sprintf(" and `type` = ?");
            $query[] = $queryconditions->type;
        }
        // order
        if(!empty($paging->sort)){
            $order = $paging->sort;
        }else{
            $order = 'time';
        }
        if(empty($paging->order)){
            $sort = 'asc';
        }else{
            $sort = 'desc';
        }
        if(!empty($paging->offset)){
            $offset = $paging->offset;
        }else{
            $offset = 0;
        }
        if(!empty($paging->limit)){
            $limit = $paging->limit;
        }else{
            $limit = 10;
        }

        $sql = "";
        // data
        if($viewtype === 'ep'){
            $sql = <<<SQL
select * from
    (select e.computername,e.ip,e.sguid,e.systype,e.eid,e.unset,xs.fxno,xs.time from epinfo_%s as e right join
        (select sguid,count(time) as fxno,max(time) as time from XAV_BoTAuditLog_%s
        where 1=1 %s
        group by sguid
        ) as xs
    on e.sguid=xs.sguid) as r
order by %s %s limit %s,%s
SQL;
            $sql = sprintf($sql,
                $eid,
                $eid,
                $and,
                $order,
                $sort,
                $offset,
                $limit
            );
            $sql1 = <<<SQL
select count(1)as total from
    (select e.computername,e.ip,e.sguid,e.systype,e.eid,e.unset,xs.fxno,xs.time from epinfo_%s as e right join
        (select sguid,count(time) as fxno,max(time) as time from XAV_BoTAuditLog_%s
        where 1=1 %s
        group by sguid
        ) as xs
    on e.sguid=xs.sguid) as r
SQL;
            $sql1 = sprintf($sql1,
                $eid,
                $eid,
                $and
            );
        }

        if($viewtype === 'xav'){
            $sql = <<<SQL
select description,count(time)as fxno, count(distinct sguid) as sno, max(time) as time
from XAV_BoTAuditLog_%s where 1=1 %s
group by description
order by %s %s limit %s,%s
SQL;
            $sql = sprintf($sql,
                $eid,
                $and,
                $order,
                $sort,
                $offset,
                $limit
            );
            $sql1 = <<<SQL
select count(1) as total from
    (select description,count(time)as fxno, count(distinct sguid) as sno, max(time) as time
    from XAV_BoTAuditLog_%s where 1=1 %s
    group by description) as r
SQL;
            $sql1 = sprintf($sql1,
                $eid,
                $and
            );
        }

        if($viewtype === 'detail'){
            $sql = <<<SQL
select * from
    (select e.computername,e.ip,e.unset,xs.* from epinfo_%s as e right join
        (select * from XAV_BoTAuditLog_%s
        where 1=1 %
        ) as xs
    on e.sguid=xs.sguid) as r
order by %s %s limit %s,%s
SQL;
            $sql = sprintf($sql,
                $eid,
                $eid,
                $and,
                $order,
                $sort,
                $offset,
                $limit
            );
            $sql1 = <<<SQL
select count(1)as total from
    (select e.computername,e.ip,e.unset,xs.* from epinfo_%s as e right join
        (select * from XAV_BoTAuditLog_%s
        where 1=1 %
        ) as xs
    on e.sguid=xs.sguid) as r
SQL;
            $sql1 = sprintf($sql1,
                $eid,
                $eid,
                $and
            );
        }
        if(!$sql)return [];

        return array(
             'total' => MC::getCell($sql1, $query),
             'rows' => MC::getAll($sql, $query),
        );
    }

    public function getClientPerilStatistics($eid)
    {
        if (empty($eid)) {
            return null;
        }
        $result=[
            'wv'=>[],
            'wu'=>[],
            'wh'=>[],
            'wn'=>[],
            'wt'=>[]
        ];
        $days=6;
        while ($days >= 0) {
            $date=date('Ymd',strtotime(-$days.' day'));
            foreach ($result as $key => $value) {
                $result[$key][date('Y-m-d',strtotime(-$days.' day'))]=RedisDataManager::getClientPerilStatistics($key,$eid,$date);
            }
            $days--;
        }
        return $result;
    }

}

