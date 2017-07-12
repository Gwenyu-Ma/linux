<?php
namespace Lib;

use Lib\Util\DateTimeFormatter;

class Authorization
{
    public static function checkAuth($sn, $fPath = APP_PATH.'../auth/auth.lic', $tPath = APP_PATH.'../auth/temp/')
    {
        //解压授权文件
        $ok=self::unZip($fPath, $tPath);
        if (is_array($ok)) {
            return $ok;
        }
        $isFailed=rising_cert_decrypt($sn,$tPath);
        if($isFailed){
        	return ['msg'=>'授权解析失败'];
        }
        return true;
    }

    public static function getAuth($sn, $fPath = APP_PATH.'../auth/auth.lic', $tPath = APP_PATH.'../auth/temp/')
    {
        $checkArr=self::checkAuth($sn);
        if(is_array($checkArr)){
            return false;
        }
        if (!file_exists($tPath.'license.dat.xml')) {
            return false;
        }

        //解析license.dat
        $dom = simplexml_load_string(file_get_contents($tPath.'license.dat.xml'));
        $mt=((array)$dom->MT);
        $title=((array)$dom->TITLE);
        $bSn=((array)$dom->BASESN);
        $orgCount=((array )$dom->ORGCOUNT);
        $result=[
            'bSn'=>$bSn[0],
            'mt'=>empty($mt[0])? "瑞星企业终端安全管理系统":$mt[0],
            'title'=>$title[0],
            'orgCount'=>empty($orgCount)? 1:intval($orgCount[0])
        ];
        foreach ($dom->ITEMS->ITEM as $item) {
            $sn= (array)$item->SN;
            $fName=(array)$item->FILENAME;
            $x509Path=$tPath.$fName[0].'.xml';
            if(!file_exists($x509Path)){
                continue;
            }

            //解析时间
            $x509Dom=simplexml_load_file($x509Path);
            $bDateArr=(array)$x509Dom->notbefore;
            $eDateArr=(array)$x509Dom->notafter;

            $bDate='20'.str_replace('Z', '', $bDateArr[0]);
            $eDate='20'.str_replace('Z', '', $eDateArr[0]);
            $fPath=$tPath.str_replace('.p12', '', $fName[0]).'.bin.xml';
            //echo $fPath;
            if (file_exists($fPath)) {
                $result['items'][]=[
                    'sn'=>$sn[0],
                    'context'=>file_get_contents($fPath),
                    'bDate'=>strtotime(DateTimeFormatter::formatStrToDateAndTime($bDate)),
                    'eDate'=>strtotime(DateTimeFormatter::formatStrToDateAndTime($eDate)),
                ];
            }
        }
        self::delDir($tPath);
        return $result;
    }

    /*
     * 清楚临时文件
     *
     * @param [string] $tPath
     * @return void
     */
    static function delDir($tPath)
    {

        try{
            unlink($tPath.'../auth.lic');
            if($openDir = opendir($tPath))
            {
                while($readDir = @readdir($openDir))
                {
                    if($readDir != "." && $readDir != "..")
                    {

                        if(is_dir($tPath."".$readDir))
                        {
                            continue;
                        }
                        else
                        {
                            unlink($tPath.$readDir);
                        }
                    }
                }
            }
        }catch(\Exception $ex){

        }finally{
            closedir($tPath);
        }
    }

    public static function unZip($fPath = APP_PATH.'../auth/auth.lic', $tPath = APP_PATH.'../auth/temp/')
    {
        $zip=new \ZipArchive;
        if ($zip->open($fPath)===true) {
            $zip->extractTo($tPath);
            $zip->close();
            exec('chmod -R 777 '.$tPath);
            return true;
        }
        return ['msg'=>'授权文件无法打开'];
    }
}
