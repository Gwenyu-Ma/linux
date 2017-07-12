<?php

use \Lib\Model\RedisDataManager;
use Lib\Store\MysqlCluster as MC;
use ChromePhp as Console;
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016-04-18
 * Time: 15:29
 */
class RfwLogModel
{

    /**
     * 获取客户端概览
     * @param [string] $eid    [企业id]
     * @param [array] $argArr [过滤条件]
     * @return [array] [客户端列表]
     *
     */
    public function GetRFWOverview($eid, $argArr,$columns)
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

        if (intval($argArr['rfwurlaudit']) >= 0) {

            $epWhere['rfwurlaudit'] = strval($argArr['rfwurlaudit']);
        }

        if (intval($argArr['rfwiprulers']) >= 0) {

            $epWhere['rfwiprulers'] = strval($argArr['rfwiprulers']);
        }

        if (intval($argArr['rfwtdi']) >= 0) {
            $epWhere['rfwtdi'] = strval($argArr['rfwtdi']);
        }

        if (intval($argArr['rfwflux']) >= 0) {

            $epWhere['rfwflux'] = strval($argArr['rfwflux']);
        }

        if (intval($argArr['rfwshare']) >= 0) {

            $epWhere['rfwshare'] = strval($argArr['rfwshare']);
        }

        $group = new GroupModel();
        //$clientStateArr = $group->getComputersEpState($eid, $groupId, $clientWhere, $epWhere);
        return  $group->getComputersEpState($eid, $groupId, $clientWhere, $epWhere,$columns);
    }

    public function browsing($eid, $query)
    {
        $tb = "RFW_BrowsingAuditLog_$eid";
        //MC::$eid = $eid;
        //for($i=0;$i<60;$i++){
            //MC::exec("insert into $tb values('2016-01-01 01:01:$i','$eid','$i','$i','2016-01-01 01:01:$i','$i','$i','$i','$i','$i','$i','$i','$i','$i','$i','$i','$i')");
        //}
        MC::$eid = $eid;
        $db = MC::getCell('select database()');
        $sql = "select COLUMN_NAME from information_schema.COLUMNS where table_name = '$tb' and table_schema = '$db'";
        $lfields = MC::getCol($sql);
        $epfields = ['computername','ip','unset','groupid'];

        if(!empty($query['view'])){
            $view = $query['view'];
        }else{
            $view = 'detail';
        }

        if($view == 'detail'){
            $fields = array_merge($lfields, $epfields);
        }elseif($view == 'ep'){
            $fields = $epfields;
        }else{
            //return '非法请求';
            $fields = array_merge($lfields, $epfields);
        }

        $wh = 'eid=?';
        $ere = [$eid];
        $orderby = '';
        $sort = '';
        $offset = 0;
        $limit = 10;
        foreach($query as $k=>$v){
            if($k === 'view'){
                continue;
            }
            if($k === 'orderby'){
                if($view === 'detail'){
                    if(!in_array($v, $fields)){
                        $v = $fields[0];
                        //return '非法请求';
                    }
                }
                if($view === 'ep'){
                    if(!in_array($v, array_merge($fields, ['lcount']))){
                        $v = $fields[0];
                        //return '非法请求';
                    }
                }
                $orderby = "order by $v";
                continue;
            }
            if($k === 'sort'){
                if(!in_array($v, ['asc','desc'])){
                    $v = 'asc';
                    //return '非法请求';
                }
                $sort = $v;
                continue;
            }
            if($k === 'offset'){
                $offset = intval($v);
                continue;
            }
            if($k === 'limit'){
                $limit = intval($v);
                continue;
            }

            if($k === 'stime'){
                $wh .= ' and time>= ?';
                $ere[] = $v;
                continue;
            }
            if($k === 'etime'){
                $wh .= ' and time< ?';
                $ere[] = $v;
                continue;
            }
            if(!in_array($k, $fields)){
                continue;
                //return '非法请求';
            }
            $wh .= " and $k=?";
            $ere[] = $v;
        }
        if(empty($sort) || empty($orderby)){
            $orderby = '';
            $sort = '';
        }

        if( $orderby === 'order by computername'){
            $orderby = "order by memo $sort,computername ";
        }

        if($view == 'detail'){
            $sql1 = <<<SQL
select count(1) from
    (select l.*,e.computername,e.ip,e.unset,e.groupid from $tb as l
    left join epinfo_$eid as e on l.sguid=e.sguid
    )as x
where $wh
SQL;
            $sql = <<<SQL
select * from
    (select l.*,e.computername,e.memo,e.ip,e.unset,e.groupid from $tb as l
    left join epinfo_$eid as e on l.sguid=e.sguid
    )as x
where $wh $orderby $sort limit $offset,$limit
SQL;
        }

        if($view == 'ep'){
            $sql1 = <<<SQL
select count(1) from
    (select eid,sguid,computername,ip,unset,groupid,count(1) as lcount from
        (select l.*,e.computername,e.ip,e.unset,e.groupid from $tb as l
        left join epinfo_$eid as e on l.sguid=e.sguid
        )as x
    where $wh group by computername,ip,unset,groupid) as x
SQL;
            $sql = <<<SQL
select eid,sguid,memo,computername,ip,unset,groupid,count(1) as lcount from
    (select l.*,e.computername,e.memo,e.ip,e.unset,e.groupid from $tb as l
    left join epinfo_$eid as e on l.sguid=e.sguid
    )as x
where $wh group by computername,ip,unset,groupid $orderby $sort limit $offset,$limit
SQL;
        }

        return array(
             'total' => MC::getCell($sql1, $ere),
             'rows' => MC::getAll($sql, $ere),
        );
    }

    public function ipaccess($eid, $query)
    {
        $tb = "RFW_IPAccessAuditLog_$eid";
        //MC::$eid = $eid;
        //for($i=0;$i<60;$i++){
            //MC::exec("insert into $tb values('2016-01-01 01:01:$i','$eid','$i','$i','2016-01-01 01:01:$i','$i','$i','$i','$i','$i','$i','$i','$i','$i','$i','$i','$i','$i','$i','$i')");
        //}
        MC::$eid = $eid;
        $db = MC::getCell('select database()');
        $sql = "select COLUMN_NAME from information_schema.COLUMNS where table_name = '$tb' and table_schema = '$db'";
        $lfields = MC::getCol($sql);
        $epfields = ['computername','ip','unset','groupid'];

        if(!empty($query['view'])){
            $view = $query['view'];
        }else{
            $view = 'detail';
        }

        if($view == 'detail'){
            $fields = array_merge($lfields, $epfields);
        }elseif($view == 'ep'){
            $fields = $epfields;
        }else{
            //return '非法请求';
            $fields = array_merge($lfields, $epfields);
        }

        $wh = 'eid=?';
        $ere = [$eid];
        $orderby = '';
        $sort = '';
        $offset = 0;
        $limit = 10;
        foreach($query as $k=>$v){
            if($k === 'view'){
                continue;
            }
            if($k === 'orderby'){
                if($view === 'detail'){
                    if(!in_array($v, $fields)){
                        $v = $fields[0];
                        //return '非法请求';
                    }
                }
                if($view === 'ep'){
                    if(!in_array($v, array_merge($fields, ['lcount']))){
                        //return '非法请求';
                        $v = $fields[0];
                    }
                }
                $orderby = "order by $v";
                continue;
            }
            if($k === 'sort'){
                if(!in_array($v, ['asc','desc'])){
                    //return '非法请求';
                    $v = 'asc';
                }
                $sort = $v;
                continue;
            }
            if($k === 'offset'){
                $offset = intval($v);
                continue;
            }
            if($k === 'limit'){
                $limit = intval($v);
                continue;
            }

            if($k === 'stime'){
                $wh .= ' and time>= ?';
                $ere[] = $v;
                continue;
            }
            if($k === 'etime'){
                $wh .= ' and time< ?';
                $ere[] = $v;
                continue;
            }
            if(!in_array($k, $fields)){
                //return '非法请求';
                continue;
            }
            $wh .= " and $k=?";
            $ere[] = $v;
        }
        if(empty($sort) || empty($orderby)){
            $orderby = '';
            $sort = '';
        }
        if( $orderby === 'order by computername'){
            $orderby = "order by memo $sort,computername ";
        }

        if($view == 'detail'){
            $sql1 = <<<SQL
select count(1) from
    (select l.*,e.computername,e.ip,e.unset,e.groupid from $tb as l
    left join epinfo_$eid as e on l.sguid=e.sguid
    )as x
where $wh
SQL;
            $sql = <<<SQL
select * from
    (select l.*,e.computername,e.memo,e.ip,e.unset,e.groupid from $tb as l
    left join epinfo_$eid as e on l.sguid=e.sguid
    )as x
where $wh $orderby $sort limit $offset,$limit
SQL;
        }

        if($view == 'ep'){
            $sql1 = <<<SQL
select count(1) from
    (select eid,sguid,computername,ip,unset,count(1) as lcount from
        (select l.*,e.computername,e.ip,e.unset,e.groupid from $tb as l
        left join epinfo_$eid as e on l.sguid=e.sguid
        )as x
    where $wh group by computername,ip,unset,groupid) as x
SQL;
            $sql = <<<SQL
select memo,eid,sguid,computername,ip,unset,count(1) as lcount from
    (select l.*,e.computername,e.memo,e.ip,e.unset,e.groupid from $tb as l
    left join epinfo_$eid as e on l.sguid=e.sguid
    )as x
where $wh group by computername,ip,unset,groupid $orderby $sort limit $offset,$limit
SQL;
        }

        return array(
             'total' => MC::getCell($sql1, $ere),
             'rows' => MC::getAll($sql, $ere),
        );
    }

    public function netproc($eid, $query)
    {
        $tb = "RFW_NetProcAuditLog_$eid";
        //MC::$eid = $eid;
        //for($i=0;$i<60;$i++){
            //MC::exec("insert into $tb values('2016-01-01 01:01:$i','$eid','$i','$i','2016-01-01 01:01:$i','$i','$i','$i','$i','$i','$i','$i','$i','$i','$i','$i','$i','$i','$i','$i','$i','$i','$i','$i','$i','$i')");
        //}
        MC::$eid = $eid;
        $db = MC::getCell('select database()');
        $sql = "select COLUMN_NAME from information_schema.COLUMNS where table_name = '$tb' and table_schema = '$db'";
        $lfields = MC::getCol($sql);
        $epfields = ['computername','ip','unset','groupid'];

        if(!empty($query['view'])){
            $view = $query['view'];
        }else{
            $view = 'detail';
        }

        if($view == 'detail'){
            $fields = array_merge($lfields, $epfields);
        }elseif($view == 'ep'){
            $fields = $epfields;
        }else{
            //return '非法请求';
            $fields = array_merge($lfields, $epfields);
        }

        $wh = 'eid=?';
        $ere = [$eid];
        $orderby = '';
        $sort = '';
        $offset = 0;
        $limit = 10;
        foreach($query as $k=>$v){
            if($k === 'view'){
                continue;
            }
            if($k === 'orderby'){
                if($view === 'detail'){
                    if(!in_array($v, $fields)){
                        //return '非法请求';
                        $v = $fields[0];
                    }
                }
                if($view === 'ep'){
                    if(!in_array($v, array_merge($fields, ['lcount']))){
                        //return '非法请求';
                        $v = $fields[0];
                    }
                }
                $orderby = "order by $v";
                continue;
            }
            if($k === 'sort'){
                if(!in_array($v, ['asc','desc'])){
                    //return '非法请求';
                    $v = 'asc';
                }
                $sort = $v;
                continue;
            }
            if($k === 'offset'){
                $offset = intval($v);
                continue;
            }
            if($k === 'limit'){
                $limit = intval($v);
                continue;
            }

            if($k === 'stime'){
                $wh .= ' and time>= ?';
                $ere[] = $v;
                continue;
            }
            if($k === 'etime'){
                $wh .= ' and time< ?';
                $ere[] = $v;
                continue;
            }
            if($k==='action'&& strlen($value)>0){
                $wh .=' and action=?';
                $ere[]=$v;
                continue;
            }
            if($k==='result'&& strlen($value)>0){
                $wh .=' and result=?';
                $ere[]=$v;
                continue;
            }
            if(!in_array($k, $fields)){
                //return '非法请求';
                continue;
            }

            $wh .= " and $k=?";
            $ere[] = $v;
        }
        if(empty($sort) || empty($orderby)){
            $orderby = '';
            $sort = '';
        }
        if( $orderby === 'order by computername'){
            $orderby = "order by memo $sort,computername ";
        }

        if($view == 'detail'){
            $sql1 = <<<SQL
select count(1) from
    (select l.*,e.computername,e.ip,e.unset,e.groupid from $tb as l
    left join epinfo_$eid as e on l.sguid=e.sguid
    )as x
where $wh
SQL;
            $sql = <<<SQL
select * from
    (select l.*,e.computername,e.memo,e.ip,e.unset,e.groupid from $tb as l
    left join epinfo_$eid as e on l.sguid=e.sguid
    )as x
where $wh $orderby $sort limit $offset,$limit
SQL;
        }

        if($view == 'ep'){
            $sql1 = <<<SQL
select count(1) from
    (select eid,sguid,computername,ip,unset,count(1) as lcount from
        (select l.*,e.computername,e.ip,e.unset,e.groupid from $tb as l
        left join epinfo_$eid as e on l.sguid=e.sguid
        )as x
    where $wh group by computername,ip,unset,groupid) as x
SQL;
            $sql = <<<SQL
select eid,memo,sguid,computername,ip,unset,count(1) as lcount from
    (select l.*,e.computername,e.memo,e.ip,e.unset,e.groupid from $tb as l
    left join epinfo_$eid as e on l.sguid=e.sguid
    )as x
where $wh group by computername,ip,unset,groupid $orderby $sort limit $offset,$limit
SQL;
        }

        return array(
             'total' => MC::getCell($sql1, $ere),
             'rows' => MC::getAll($sql, $ere),
        );
    }

    public function sharedresaccess($eid, $query)
    {
        $tb = "RFW_SharedResAccessAuditLog_$eid";
        //MC::$eid = $eid;
        //for($i=0;$i<60;$i++){
            //MC::exec("insert into $tb values('2016-01-01 01:01:$i','$eid','$i','$i','2016-01-01 01:01:$i','$i','$i','$i','$i','$i','$i','$i','$i','$i','$i','$i','$i')");
        //}
        MC::$eid = $eid;
        $db = MC::getCell('select database()');
        $sql = "select COLUMN_NAME from information_schema.COLUMNS where table_name = '$tb' and table_schema = '$db'";
        $lfields = MC::getCol($sql);
        $epfields = ['computername','ip','unset','groupid'];

        if(!empty($query['view'])){
            $view = $query['view'];
        }else{
            $view = 'detail';
        }

        if($view == 'detail'){
            $fields = array_merge($lfields, $epfields);
        }elseif($view == 'ep'){
            $fields = array_merge($epfields,['action']);
        }else{
            //return '非法请求';
            $fields = array_merge($lfields, $epfields);
        }

        $wh = 'eid=?';
        $ere = [$eid];
        $orderby = '';
        $sort = '';
        $offset = 0;
        $limit = 10;
        foreach($query as $k=>$v){
            if($k === 'view'){
                continue;
            }
            if($k === 'orderby'){
                if($view === 'detail'){
                    if(!in_array($v, $fields)){
                        //return '非法请求';
                        $v = $fields[0];
                    }
                }
                if($view === 'ep'){
                    if(!in_array($v, array_merge($fields, ['lcount']))){
                        //return '非法请求';
                        $v = $fields[0];
                    }
                }
                $orderby = "order by $v";
                continue;
            }
            if($k === 'sort'){
                if(!in_array($v, ['asc','desc'])){
                    //return '非法请求';
                    $v = 'asc';
                }
                $sort = $v;
                continue;
            }
            if($k === 'offset'){
                $offset = intval($v);
                continue;
            }
            if($k === 'limit'){
                $limit = intval($v);
                continue;
            }

            if($k === 'stime'){
                $wh .= ' and time>= ?';
                $ere[] = $v;
                continue;
            }
            if($k === 'etime'){
                $wh .= ' and time< ?';
                $ere[] = $v;
                continue;
            }
            if(!in_array($k, $fields)){
                //return '非法请求';
                continue;
            }

            $wh .= " and $k=?";
            $ere[] = $v;
        }
        if(empty($sort) || empty($orderby)){
            $orderby = '';
            $sort = '';
        }
        if( $orderby === 'order by computername'){
            $orderby = "order by memo $sort,computername ";
        }

        if($view == 'detail'){
            $sql1 = <<<SQL
select count(1) from
    (select l.*,e.computername,e.ip,e.unset,e.groupid from $tb as l
    left join epinfo_$eid as e on l.sguid=e.sguid
    )as x
where $wh
SQL;
            $sql = <<<SQL
select * from
    (select l.*,e.computername,e.memo,e.ip,e.unset,e.groupid from $tb as l
    left join epinfo_$eid as e on l.sguid=e.sguid
    )as x
where $wh $orderby $sort limit $offset,$limit
SQL;
        }

        if($view == 'ep'){
            $sql1 = <<<SQL
select count(1) from
    (select eid,sguid,computername,ip,unset,count(1) as lcount from
        (select l.*,e.computername,e.ip,e.unset,e.groupid from $tb as l
        left join epinfo_$eid as e on l.sguid=e.sguid
        )as x
    where $wh group by computername,ip,unset,groupid) as x
SQL;
            $sql = <<<SQL
select eid,sguid,memo,computername,ip,unset,count(1) as lcount from
    (select l.*,e.computername,e.memo,e.ip,e.unset,e.groupid from $tb as l
    left join epinfo_$eid as e on l.sguid=e.sguid
    )as x
where $wh group by computername,ip,unset,groupid $orderby $sort limit $offset,$limit
SQL;
        }
        return array(
             'total' => MC::getCell($sql1, $ere),
             'rows' => MC::getAll($sql, $ere),
        );
    }

    public function sharedreslist($eid, $query)
    {
        $tb = "RFW_SharedResListLog_$eid";
        //MC::$eid = $eid;
        //for($i=0;$i<60;$i++){
            //MC::exec("insert into $tb values('2016-01-01 01:01:$i','$eid','$i','$i','2016-01-01 01:01:$i','$i','$i','$i','$i','$i','$i','$i','$i','$i','$i','$i')");
        //}
        MC::$eid = $eid;
        $db = MC::getCell('select database()');
        $sql = "select COLUMN_NAME from information_schema.COLUMNS where table_name = '$tb' and table_schema = '$db'";
        $lfields = MC::getCol($sql);
        $epfields = ['computername','ip','unset','groupid'];

        if(!empty($query['view'])){
            $view = $query['view'];
        }else{
            $view = 'detail';
        }

        if($view == 'detail'){
            $fields = array_merge($lfields, $epfields);
        }elseif($view == 'ep'){
            $fields = $epfields;
        }else{
            //return '非法请求';
            $fields = array_merge($lfields, $epfields);
        }

        $wh = 'eid=?';
        $ere = [$eid];
        $orderby = '';
        $sort = '';
        $offset = 0;
        $limit = 10;
        foreach($query as $k=>$v){
            if($k === 'view'){
                continue;
            }
            if($k === 'orderby'){
                if($view === 'detail'){
                    if(!in_array($v, $fields)){
                        //return '非法请求';
                        $v = $fields[0];
                    }
                }
                if($view === 'ep'){
                    if(!in_array($v, array_merge($fields, ['lcount']))){
                        //return '非法请求';
                        $v = $fields[0];
                    }
                }
                $orderby = "order by $v";
                continue;
            }
            if($k === 'sort'){
                if(!in_array($v, ['asc','desc'])){
                    //return '非法请求';
                    $v = 'asc';
                }
                $sort = $v;
                continue;
            }
            if($k === 'offset'){
                $offset = intval($v);
                continue;
            }
            if($k === 'limit'){
                $limit = intval($v);
                continue;
            }

            if($k === 'stime'){
                $wh .= ' and time>= ?';
                $ere[] = $v;
                continue;
            }
            if($k === 'etime'){
                $wh .= ' and time< ?';
                $ere[] = $v;
                continue;
            }
            if(!in_array($k, $fields)){
                //return '非法请求';
                continue;
            }
            $wh .= " and $k=?";
            $ere[] = $v;
        }
        if(empty($sort) || empty($orderby)){
            $orderby = '';
            $sort = '';
        }
        if( $orderby === 'order by computername'){
            $orderby = "order by memo $sort,computername ";
        }

        if($view == 'detail'){
            $sql1 = <<<SQL
select count(1) from
    (select l.*,e.computername,e.ip,e.unset,e.groupid from $tb as l
    left join epinfo_$eid as e on l.sguid=e.sguid
    )as x
where $wh
SQL;
            $sql = <<<SQL
select * from
    (select l.*,e.computername,e.memo,e.ip,e.unset,e.groupid from $tb as l
    left join epinfo_$eid as e on l.sguid=e.sguid
    )as x
where $wh $orderby $sort limit $offset,$limit
SQL;
        }

        if($view == 'ep'){
            $sql1 = <<<SQL
select count(1) from
    (select eid,sguid,computername,ip,unset,count(1) as lcount from
        (select l.*,e.computername,e.ip,e.unset,e.groupid from $tb as l
        left join epinfo_$eid as e on l.sguid=e.sguid
        )as x
    where $wh group by computername,ip,unset,groupid) as x
SQL;
            $sql = <<<SQL
select eid,sguid,memo,computername,ip,unset,count(1) as lcount from
    (select l.*,e.memo,e.computername,e.ip,e.unset,e.groupid from $tb as l
    left join epinfo_$eid as e on l.sguid=e.sguid
    )as x
where $wh group by computername,ip,unset,groupid $orderby $sort limit $offset,$limit
SQL;
        }

        return array(
             'total' => MC::getCell($sql1, $ere),
             'rows' => MC::getAll($sql, $ere),
        );
    }
    public function getSharedresaccess($eid, $where, $order){
        MC::$eid = $eid;
        $sql = "select * from RFW_SharedResAccessAuditLog_$eid where 1=1";
        foreach($where as $k=>$v){
            $sql .= " and $k=:$k";
        }
        if(empty($order['orderby'])){
            $sql .= " order by name";
        }else{
            $sql .= " order by ".$order['orderby'];
        }
        if(empty($order['sort'])){
            $sql .= " asc";
        }else{
            $sql .= " ".$order['sort'];
        }
        return MC::getAll($sql, $where);
    }

    public function terminalflow($eid, $query)
    {
        $tb = "RFW_TerminalFlowAuditLog_$eid";
        //MC::$eid = $eid;
        //for($i=0;$i<60;$i++){
            //MC::exec("insert into $tb values('2016-01-01 01:01:$i','$eid','$i','$i','2016-01-01 01:01:$i','$i','$i','$i','$i','$i','$i','2016-01-01 01:01:$i','2016-01-01 01:01:$i','$i','$i','$i','$i')");
        //}
        MC::$eid = $eid;
        $db = MC::getCell('select database()');
        $sql = "select COLUMN_NAME from information_schema.COLUMNS where table_name = '$tb' and table_schema = '$db'";
        $lfields = MC::getCol($sql);
        $epfields = ['computername','ip','unset','groupid'];

        if(!empty($query['view'])){
            $view = $query['view'];
        }else{
            $view = 'detail';
        }

        if($view == 'detail'){
            $fields = array_merge($lfields, $epfields);
        }elseif($view == 'ep'){
            $fields = $epfields;
        }else{
            //return '非法请求';
            $fields = array_merge($lfields, $epfields);
        }

        $wh = 'eid=?';
        $ere = [$eid];
        $orderby = '';
        $sort = '';
        $offset = 0;
        $limit = 10;
        foreach($query as $k=>$v){
            if($k === 'view'){
                continue;
            }
            if($k === 'orderby'){
                if($view === 'detail'){
                    if(!in_array($v, $fields)){
                        //return '非法请求';
                        $v = $fields[0];
                    }
                }
                if($view === 'ep'){
                    if(!in_array($v, array_merge($fields, ['lcount']))){
                        //return '非法请求';
                        $v = $fields[0];
                    }
                }
                $orderby = "order by $v";
                continue;
            }
            if($k === 'sort'){
                if(!in_array($v, ['asc','desc'])){
                    //return '非法请求';
                    $v = 'asc';
                }
                $sort = $v;
                continue;
            }
            if($k === 'offset'){
                $offset = intval($v);
                continue;
            }
            if($k === 'limit'){
                $limit = intval($v);
                continue;
            }

            if($k === 'stime'){
                $wh .= ' and time>= ?';
                $ere[] = $v;
                continue;
            }
            if($k === 'etime'){
                $wh .= ' and time< ?';
                $ere[] = $v;
                continue;
            }
            if(!in_array($k, $fields)){
                //return '非法请求';
                continue;
            }
            $wh .= " and $k=?";
            $ere[] = $v;
        }
        if(empty($sort) || empty($orderby)){
            $orderby = '';
            $sort = '';
        }
        if( $orderby === 'order by computername'){
            $orderby = "order by memo $sort,computername ";
        }

        if($view == 'detail'){
            $sql1 = <<<SQL
select count(1) from
    (select l.*,e.computername,e.ip,e.unset,e.groupid from $tb as l
    left join epinfo_$eid as e on l.sguid=e.sguid
    )as x
where $wh
SQL;
            $sql = <<<SQL
select * from
    (select l.*,e.memo,e.computername,e.ip,e.unset,e.groupid from $tb as l
    left join epinfo_$eid as e on l.sguid=e.sguid
    )as x
where $wh $orderby $sort limit $offset,$limit
SQL;
        }

        if($view == 'ep'){
            $sql1 = <<<SQL
select count(1) from
    (select eid,sguid,computername,ip,unset,count(1) as lcount from
        (select l.*,e.computername,e.ip,e.unset,e.groupid from $tb as l
        left join epinfo_$eid as e on l.sguid=e.sguid
        )as x
    where $wh group by computername,ip,unset,groupid) as x
SQL;
            $sql = <<<SQL
select eid,memo,sguid,computername,ip,unset,sum(x.updateflow) as updateflow,sum(x.downloadflow) as downloadflow from
    (select l.*,e.memo,e.computername,e.ip,e.unset,e.groupid from $tb as l
    left join epinfo_$eid as e on l.sguid=e.sguid
    )as x
where $wh group by computername,ip,unset,groupid $orderby $sort limit $offset,$limit
SQL;
        }

        return  array(
             'total' => MC::getCell($sql1, $ere),
             'rows' => MC::getAll($sql, $ere),
        );

    }

    public function urlintercept($eid, $query)
    {
        $tb = "RFW_UrlInterceptLog_$eid";
        //MC::$eid = $eid;
        //for($i=0;$i<60;$i++){
            //MC::exec("insert into $tb values('2016-01-01 01:01:$i','$eid','$i','$i','2016-01-01 01:01:$i','$i','$i','$i','$i','$i','$i','$i','$i','$i','$i','$i')");
        //}
        MC::$eid = $eid;
        $db = MC::getCell('select database()');
        $sql = "select COLUMN_NAME from information_schema.COLUMNS where table_name = '$tb' and table_schema = '$db'";
        $lfields = MC::getCol($sql);
        $epfields = ['computername','ip','unset','groupid'];

        if(!empty($query['view'])){
            $view = $query['view'];
        }else{
            $view = 'detail';
        }

        if($view == 'detail'){
            $fields = array_merge($lfields, $epfields);
        }elseif($view == 'ep'){
            $fields = $epfields;
        }else{
            //return '非法请求';
            $fields = array_merge($lfields, $epfields);
        }

        $wh = 'eid=?';
        $ere = [$eid];
        $wh .= 'and result!=11';
        $orderby = '';
        $sort = '';
        $offset = 0;
        $limit = 10;
        foreach($query as $k=>$v){
            if($k === 'view'){
                continue;
            }
            if($k === 'orderby'){
                if($view === 'detail'){
                    if(!in_array($v, $fields)){
                        //return '非法请求';
                        $v = $fields[0];
                    }
                }
                if($view === 'ep'){
                    if(!in_array($v, array_merge($fields, ['lcount']))){
                        //return '非法请求';
                        $v = $fields[0];
                    }
                }
                $orderby = "order by $v";
                continue;
            }
            if($k === 'sort'){
                if(!in_array($v, ['asc','desc'])){
                    //return '非法请求';
                    $v = 'asc';
                }
                $sort = $v;
                continue;
            }
            if($k === 'offset'){
                $offset = intval($v);
                continue;
            }
            if($k === 'limit'){
                $limit = intval($v);
                continue;
            }

            if($k === 'stime'){
                $wh .= ' and time>= ?';
                $ere[] = $v;
                continue;
            }
            if($k === 'etime'){
                $wh .= ' and time< ?';
                $ere[] = $v;
                continue;
            }
            if(!in_array($k, $fields)){
                //return '非法请求';
                continue;
            }
            $wh .= " and $k=?";
            $ere[] = $v;
        }
        if(empty($sort) || empty($orderby)){
            $orderby = '';
            $sort = '';
        }
        if( $orderby === 'order by computername'){
            $orderby = "order by memo $sort,computername ";
        }

        if($view == 'detail'){
            $sql1 = <<<SQL
select count(1) from
    (select l.*,e.computername,e.ip,e.unset,e.groupid from $tb as l
    left join epinfo_$eid as e on l.sguid=e.sguid
    )as x
where $wh
SQL;
            $sql = <<<SQL
select * from
    (select l.*,e.memo,e.computername,e.ip,e.unset,e.groupid from $tb as l
    left join epinfo_$eid as e on l.sguid=e.sguid
    )as x
where $wh $orderby $sort limit $offset,$limit
SQL;
        }

        if($view == 'ep'){
            $sql1 = <<<SQL
select count(1) from
    (select eid,sguid,computername,ip,unset,count(1) as lcount from
        (select l.*,e.computername,e.ip,e.unset,e.groupid from $tb as l
        left join epinfo_$eid as e on l.sguid=e.sguid
        )as x
    where $wh group by computername,ip,unset,groupid) as x
SQL;
            $sql = <<<SQL
select eid,memo,sguid,computername,ip,unset,count(1) as lcount from
    (select l.*,e.memo,e.computername,e.ip,e.unset,e.groupid from $tb as l
    left join epinfo_$eid as e on l.sguid=e.sguid
    )as x
where $wh group by computername,ip,unset,groupid $orderby $sort limit $offset,$limit
SQL;
        }

        return array(
             'total' => MC::getCell($sql1, $ere),
             'rows' => MC::getAll($sql, $ere),
        );
    }

    public function urlintercept11($eid, $query)
    {
        $tb = "RFW_UrlInterceptLog_$eid";
        //MC::$eid = $eid;
        //for($i=0;$i<60;$i++){
            //MC::exec("insert into $tb values('2016-01-01 01:01:$i','$eid','$i','$i','2016-01-01 01:01:$i','$i','$i','$i','$i','$i','$i','$i','$i','$i','$i','$i')");
        //}
        MC::$eid = $eid;
        $db = MC::getCell('select database()');
        $sql = "select COLUMN_NAME from information_schema.COLUMNS where table_name = '$tb' and table_schema = '$db'";
        $lfields = MC::getCol($sql);
        $epfields = ['computername','ip','unset','groupid'];

        if(!empty($query['view'])){
            $view = $query['view'];
        }else{
            $view = 'detail';
        }

        if($view == 'detail'){
            $fields = array_merge($lfields, $epfields);
        }elseif($view == 'ep'){
            $fields = $epfields;
        }else{
            //return '非法请求';
            $fields = array_merge($lfields, $epfields);
        }

        $wh = 'eid=?';
        $ere = [$eid];
        $wh .= 'and result=11';
        $orderby = '';
        $sort = '';
        $offset = 0;
        $limit = 10;
        foreach($query as $k=>$v){
            if($k === 'view'){
                continue;
            }
            if($k === 'orderby'){
                if($view === 'detail'){
                    if(!in_array($v, $fields)){
                        //return '非法请求';
                        $v = $fields[0];
                    }
                }
                if($view === 'ep'){
                    if(!in_array($v, array_merge($fields, ['lcount']))){
                        //return '非法请求';
                        $v = $fields[0];
                    }
                }
                $orderby = "order by $v";
                continue;
            }
            if($k === 'sort'){
                if(!in_array($v, ['asc','desc'])){
                    //return '非法请求';
                    $v = 'asc';
                }
                $sort = $v;
                continue;
            }
            if($k === 'offset'){
                $offset = intval($v);
                continue;
            }
            if($k === 'limit'){
                $limit = intval($v);
                continue;
            }

            if($k === 'stime'){
                $wh .= ' and time>= ?';
                $ere[] = $v;
                continue;
            }
            if($k === 'etime'){
                $wh .= ' and time< ?';
                $ere[] = $v;
                continue;
            }
            if(!in_array($k, $fields)){
                //return '非法请求';
                continue;
            }
            $wh .= " and $k=?";
            $ere[] = $v;
        }
        if(empty($sort) || empty($orderby)){
            $orderby = '';
            $sort = '';
        }
        if( $orderby === 'order by computername'){
            $orderby = "order by memo $sort,computername ";
        }

        if($view == 'detail'){
            $sql1 = <<<SQL
select count(1) from
    (select l.*,e.computername,e.ip,e.unset,e.groupid from $tb as l
    left join epinfo_$eid as e on l.sguid=e.sguid
    )as x
where $wh
SQL;
            $sql = <<<SQL
select * from
    (select l.*,e.computername,e.memo,e.ip,e.unset,e.groupid from $tb as l
    left join epinfo_$eid as e on l.sguid=e.sguid
    )as x
where $wh $orderby $sort limit $offset,$limit
SQL;
        }

        if($view == 'ep'){
            $sql1 = <<<SQL
select count(1) from
    (select eid,sguid,computername,ip,unset,count(1) as lcount from
        (select l.*,e.computername,e.ip,e.unset,e.groupid from $tb as l
        left join epinfo_$eid as e on l.sguid=e.sguid
        )as x
    where $wh group by computername,ip,unset,groupid ) as x
SQL;
            $sql = <<<SQL
select eid,sguid,memo,computername,ip,unset,count(1) as lcount from
    (select l.*,e.computername,e.memo,e.ip,e.unset,e.groupid from $tb as l
    left join epinfo_$eid as e on l.sguid=e.sguid
    )as x
where $wh group by computername,ip,unset,groupid $orderby $sort limit $offset,$limit
SQL;
        }

        return array(
             'total' => MC::getCell($sql1, $ere),
             'rows' => MC::getAll($sql, $ere),
        );
    }

    public function getURLAudit($eid)
    {
        if (empty($eid)) {
            return null;
        }

        $result=[
            'nb'=>[],
            'nn'=>[],
            'ns'=>[]
        ];
        $days=6;
        while ($days >= 0) {
            $date=date('Ymd',strtotime(-$days.' day'));
            foreach ($result as $key => $value) {
                $result[$key][date('Y-m-d',strtotime(-$days.' day'))]=RedisDataManager::getRfwValue($key,$eid,$date);
            }
            $days--;
        }
        return $result;
    }


    public function getFlowAudit($eid)
    {
        if (empty($eid)) {
            return null;
        }

        $result=[
            'sf'=>[],
        ];

        $date=date('Ymd');
        //按总量排序，取前n名，然后根据sguid在hash分别取下行流量
        $key = 'sf:'.$eid.':'.$date;
        $totalTop6 = RedisDataManager::getFlowTopRange($key,0,6);
        foreach($totalTop6 as $k=>$value){
            $computerName = RedisDataManager::getEpName($eid,$k);
            $result['sf'][$computerName]['total']=$value;
            $result['sf'][$computerName]['up']=RedisDataManager::getFlowValue($key.'1',$k.'1');
            $result['sf'][$computerName]['down']=RedisDataManager::getFlowValue($key.'2',$k.'2');
        }

        return $result;
    }

    public function getUrlIntercept($eid)
    {
        if (empty($eid)) {
            return null;
        }

        $result=[
            'ui'=>[]
        ];
        $days=6;
        while ($days >= 0) {
            $date=date('Ymd',strtotime(-$days.' day'));
            $rkey = 'ui:'.$eid.':'.$date;
            foreach ($result as $key => $value) {
                $result[$key][date('Y-m-d',strtotime(-$days.' day'))]['恶意网址库']=RedisDataManager::getFlowValue($rkey,"1");
                $result[$key][date('Y-m-d',strtotime(-$days.' day'))]['XSS库']=RedisDataManager::getFlowValue($rkey,"4");
                $result[$key][date('Y-m-d',strtotime(-$days.' day'))]['钓鱼']=RedisDataManager::getFlowValue($rkey,"8");
                $result[$key][date('Y-m-d',strtotime(-$days.' day'))]['恶意下载']=RedisDataManager::getFlowValue($rkey,"10");
                $result[$key][date('Y-m-d',strtotime(-$days.' day'))]['广告过滤']=RedisDataManager::getFlowValue($rkey,"11");
                $result[$key][date('Y-m-d',strtotime(-$days.' day'))]['搜索保护']=RedisDataManager::getFlowValue($rkey,"13");
            }
            $days--;
        }
        return $result;
    }
}
