<?php
use \Lib\Store\LogsMysql as MC;
class RWarningModel
{
    public static function getWarning($eid,$objId, $objType, $paging, $query)
    {
        $where='';
        $params=[];

        if(!empty($query['wsclass'])){
            $where .=' AND ws.wsclass in (:wsclass)';

            $params[':wsclass']= "'".join("','",$query['wsclass'])."''";
        }
        if(!empty($query['begintime'])){
            $where .=' AND w.edate >= :beginTime';
            $params[':beginTime']=$query['begintime'];
        }
        if(!empty($query['endtime'])){
            $where .=' AND w.edate <= :endTime';
            $params[':endTime']=$query['endtime'];
        }
        $offset=empty($paging['offset'])? 0:intval($paging['offset']);
        $limit=empty($paging['limit'])? 20:intval($paging['limit']);
        $sort=empty($paging['sort'])? 'edate':$paging['sort'];
        $order=empty($paging['order']) ?'asc':'desc';
        $sql = sprintf("SELECT ws.wsName,ws.memo,ws.wsclass,w.logid,w.caption,w.content,w.edate FROM  WarningLog_%s w LEFT JOIN WarningSetting_%s ws
  ON w.wsid=ws.wsid
WHERE 1=1 $where order by $sort $order limit $offset,$limit",$eid,$eid);
        $sqlTotal=sprintf("SELECT count(1) FROM  WarningLog_%s w LEFT JOIN WarningSetting_%s ws
  ON w.wsid=ws.wsid
WHERE 1=1 $where",$eid,$eid);

        return array(
            'rows' => MC::getAll($sql,$params),
            'total' => MC::getCell($sqlTotal,$params),
        );
    }

    public static function delWarning($eid,$ids)
    {
        if(empty($ids)){
            return;
        }
        $where =' and logid in (:ids)';
        $params[':ids']="'".join("','",$ids)."''";
        $sql=sprintf("select * from WarningLog_%s where 1=1 $where",$eid);
        MC::exec($sql,$params);
        return;
    }

    public  function add($eid, $data)
    {
        $sql = "insert into WarningSetting_$eid values(null,:wsName,:memo,:username,:enable,:level,:target,:notify,:wsclass,:filter,:wstemplate,:edate)";
        $data['username'] = $_SESSION['UserInfo']['UserName'];
        $data['edate'] = date('Y-m-d H:i:s');
        return MC::exec($sql, $data);
    }

    public  function update($eid, $data)
    {
        $sql = "update WarningSetting_$eid set";
        if(isset($data['wsName'])){
            $sql .= " wsName=:wsName,";
        }
        if(isset($data['memo'])){
            $sql .= " memo=:memo,";
        }
        if(isset($data['enable'])){
            $sql .= " enable=:enable,";
        }
        if(isset($data['level'])){
            $sql .= " level=:level,";
        }
        if(isset($data['target'])){
            $sql .= " target=:target,";
        }
        if(isset($data['notify'])){
            $sql .= " notify=:notify,";
        }
        if(isset($data['wsclass'])){
            $sql .= " wsclass=:wsclass,";
        }
        if(isset($data['filter'])){
            $sql .= " filter=:filter,";
        }
        if(isset($data['wstemplate'])){
            $sql .= " wstemplate=:wstemplate,";
        }
        $sql .= " edate=:edate";
        $data['edate'] = date('Y-m-d H:i:s');

        if(!isset($data['wsid'])){
            $data['wsid'] = 0;
        }
        $sql .= " where wsid=:wsid";
        return MC::exec($sql, $data);
    }

    public  function del($eid, $wsids)
    {
        $n = count(explode(',', $wsids));
        return MC::exec("delete from WarningSetting_$eid where wsid in ($wsids)");
    }

    public function part($eid, $query)
    {
        $wh = '1=1';
        $ere = [];
        $orderby = '';
        $sort = '';
        $offset = 0;
        $limit = 10;
        foreach($query as $k=>$v){
            if($k === 'view'){
                continue;
            }
            if($k === 'orderby'){
                $orderby = "order by $v";
                continue;
            }
            if($k === 'sort'){
                if(!in_array($v, ['asc','desc'])){
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
                $wh .= " and edate>= ?";
                $ere[] = $v;
                continue;
            }
            if($k === 'etime'){
                $wh .= " and edate<= ?";
                $ere[] = $v;
                continue;
            }
            $ere[] = $v;
        }
        if(empty($sort) || empty($orderby)){
            $orderby = '';
            $sort = '';
        }

        $sql = <<<SQL
select * from WarningSetting_$eid
where $wh $orderby $sort limit $offset,$limit
SQL;

        $sql1 = <<<SQL
select count(1) from  WarningSetting_$eid
where $wh
SQL;

        return array(
             'rows' => MC::getAll($sql, $ere),
             'total' => MC::getCell($sql1, $ere),
        );
    }


}