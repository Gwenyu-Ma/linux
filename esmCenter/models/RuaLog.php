<?php
use Lib\Store\LogsMysql as MC;

class RuaLogModel
{
    public function __construct()
    {

    }

    public function __destruct()
    {

    }
    public function getRuaLog($eid,$objtype,$objId,$params,$paging)
    {
        $xavModel= new XAVLogModel($eid);
        $sids = $xavModel->getSguids($eid,$objtype,$objId,$params);
        //var_dump($sids);
        if(!$sids){
            return null;
        }
        $where=sprintf(" and ep.sguid in ('%s')", implode("','", $sids));
        $sqlParams=[];
        if(!empty($params->begintime)){
            $where .= " and time >= ?";
            array_push($sqlParams, $params->begintime);
        }
        if(!empty($params->endtime)){
            $where .= " and time < ? ";
            array_push($sqlParams, $params->endtime);
        }

        //where
        if(isset($params->action) && $params->action>=0){
            $where.=' and action=?';
            $sqlParams[]=$params->action;
        }
        if(isset($params->role) && $params->role>0){
            $where.=' and role=?';
            $sqlParams[]=$params->role;
        }
       // order
        $order = !empty($paging->sort)? $paging->sort:'flowid';
        $sort=isset($paging->order) && $paging->order===0? 'asc' : 'desc';
        $offset =isset($paging->offset)? $paging->offset: 0;
        $limit = isset($paging->limit)? $paging->limit : 10;
        $sql = <<<SQL
SELECT count(DISTINCT flowid) as count
FROM  rua_log_%s ep where 1=1 %s
SQL;

        $sql = sprintf($sql,
            $eid,
            $where
        );

        $total = MC::getCell($sql,$sqlParams);
        $rows=[];
        if($total>0){
            $sql = <<<SQL
SELECT ep.eid,ep.sguid,computername,ip,memo,ep.systype systype,unset,time,flowid,source,action,role,oldver,newver,needreboot,afterreboot,info
FROM epinfo_%s ep
INNER JOIN
rua_log_%s rua
ON ep.sguid=rua.sguid where 1=1 %s
order by %s %s limit %s,%s
SQL;
            $sql = sprintf($sql,
                $eid,
                $eid,
                $where,
                $order,
                $sort,
                $offset,
                $limit
            );

            $rows = MC::getAll($sql,$sqlParams);

            $rows=array_map(function($item){
                $groupModel=new GroupModel();
                $item['onlinestate'] = $groupModel->getClientOnlineState($item['eid'],$item['sguid'],$item['systype'],$item['unset']);
                return $item;
            }, $rows);
        }

        $data = array(
            'rows'=>$rows,
            'total'=>$total
        );
        return $data;
    }
}