<?php
namespace Lib\Util;

class DateTimeFormatter
{
    /*
     * 格式化为短日期
     *
     * @param [string] $dtStr //20170401160300
     * @return 2017-04-01
     */
    public static function formatStrToDate($dtStr)
    {
        $yyyy=substr($dtStr,0,4);
        $MM=substr($dtStr,4,2);
        $dd=substr($dtStr,6,2);
        return $yyyy.'-'.$MM.'-'.$dd;
    }
    /*
     * 格式化为短日期
     *
     * @param [string] $dtStr //20170401160300
     * @return 2017年04月01日
     */
    public static function formatStrToLocalDate($dtStr)
    {
        //echo $dtStr;
        $yyyy = substr($dtStr,0,4);
        $MM=substr($dtStr,4,2);
        $dd=substr($dtStr,6,2);
        //echo $yyyy;
        return $yyyy."年".$MM."月".$dd."日";
    }

    /*
     * 格式化为短日期
     *
     * @param [string] $dtStr //20170401160300
     * @return 2017-04-01 16:03:00
     */
    public static function formatStrToDateAndTime($dtStr)
    {
        $yyyy=substr($dtStr,0,4);
        $MM=substr($dtStr,4,2);
        $dd=substr($dtStr,6,2);
        $hh=substr($dtStr,8,2);
        $mm=substr($dtStr,10,2);
        $ss=substr($dtStr,12,2);
        return $yyyy.'-'.$MM.'-'.$dd.' '.$hh.':'.$mm.':'.$ss;
    }
}