<?php
/**
 * Created by IntelliJ IDEA.
 * User: guodf
 * Date: 16-10-10
 * Time: 上午11:21
 */

namespace Lib\Model;


class Cmd
{
    public static $CmdDict = [
        'quickscanstart' => [
            'type' => 1,
            'cmdType' => 1,
            'productId' => 'D49170C0-B076-4795-B079-0F97560485AF',
            'cmdId'=>'0x3000',
            'desc'=>'开始快速查杀',
            'cmdStr'=>'<scan><taskname>quickscan</taskname><control>1</control></scan>'
        ],
        'quickscanstop' => [
            'type' => 1,
            'cmdType' => 1,
            'productId' => 'D49170C0-B076-4795-B079-0F97560485AF',
            'cmdId'=>'0x3001',
            'desc'=>'停止快速查杀',
            'cmdStr'=>'<scan><taskname>quickscan</taskname><control>4</control></scan>'
        ],
        'allscanstart' => [
            'type' => 1,
            'cmdType' => 1,
            'productId' => 'D49170C0-B076-4795-B079-0F97560485AF',
            'cmdId'=>'0x3302',
            'desc'=>'开始全盘查杀',
            'cmdStr'=>'<scan><taskname>allscan</taskname><control>1</control></scan>'
        ],
        'allscanstop' => [
            'type' => 1,
            'cmdType' => 1,
            'productId' => 'D49170C0-B076-4795-B079-0F97560485AF',
            'cmdId'=>'0x3303',
            'desc'=>'停止全盘查杀',
            'cmdStr'=>'<scan><taskname>allscan</taskname><control>4</control></scan>'
        ],
        'filemonopen' => [
            'type' => 4,
            'cmdType' => 1,
            'productId' => 'D49170C0-B076-4795-B079-0F97560485AF',
            'cmdId'=>'0x3100',
            'desc'=>'开启文件监控',
            'cmdStr'=>'<monctrl>filemon:1</monctrl>'
        ],
        'filemonclose' => [
            'type' => 4,
            'cmdType' => 1,
            'productId' => 'D49170C0-B076-4795-B079-0F97560485AF',
            'cmdId'=>'0x3101',
            'desc'=>'关闭文件监控',
            'cmdStr'=>'<monctrl>filemon:0</monctrl>'
        ],
        'mailmon:open' => [
            'type' => 4,
            'cmdType' => 1,
            'productId' => 'D49170C0-B076-4795-B079-0F97560485AF',
            'cmdId'=>'0x3200',
            'desc'=>'开启邮件监控',
            'cmdStr'=>'<monctrl>mailmon:1</monctrl>'
        ],
        'mailmon:close' => [
            'type' => 4,
            'cmdType' => 1,
            'productId' => 'D49170C0-B076-4795-B079-0F97560485AF',
            'cmdId'=>'0x3201',
            'desc'=>'关闭邮件监控',
            'cmdStr'=>'<monctrl>mailmon:0</monctrl>'
        ],
        '0x4001' => [
            'type' => 1,
            'cmdType' => 1,
            'productId' => '74F2C5FD-2F95-46be-B67C-FFA200D69012',
            'cmdId'=>'0x4001',
            'desc'=>'立即上报位置',
            'cmdStr'=>'<type>1</type>'
        ],
        'update' => [
            'type' => 536870913,
            'cmdType' => 1,
            'productId' => '50BAC747-7D02-4969-AF79-45EE47365C81',
            'cmdId'=>'0x2000',
            'desc'=>'开始升级命令',
            'cmdStr'=>'<Admin>admin</Admin><OnlyVer>1</OnlyVer><MaxDelay>0</MaxDelay>'
        ],
        'repair' => [
            'type' => 536870914,
            'cmdType' => 1,
            'productId' => '50BAC747-7D02-4969-AF79-45EE47365C81',
            'cmdId'=>'0x2001',
            'desc'=>'立即修复',
            'cmdStr'=>'<Admin>admin</Admin><OnlyVer>1</OnlyVer><MaxDelay>0</MaxDelay>'
        ],
        'uninstall' => [
            'type' => 536870915,
            'cmdType' => 1,
            'productId' => '50BAC747-7D02-4969-AF79-45EE47365C81',
            'cmdId'=>'0x2002',
            'desc'=>'立即卸载',
            'cmdStr'=>'<Admin>admin</Admin><OnlyVer>1</OnlyVer><MaxDelay>0</MaxDelay>'
        ],
        'msg' => [
            'type' => 1,
            'cmdType' => 0,
            'productId' => 'EB8AFFA5-0710-47e6-8F53-55CAE55E1915',
            'cmdId'=>'0x1000',
            'desc'=>'发消息',
            'cmdStr'=>'<Field name="message">%s</Field>'
        ],
        'rfwurl.virus:open' => [
            'type' => '0x06B0000100000069',
            'cmdType' => 1,
            'productId' => '53246C2F-F2EA-4208-9C6C-8954ECF2FA27',
            'cmdId'=>'0x5000',
            'desc'=>'开启拦截木马网址',
            'cmdStr'=>'<monctrl>rfwurl.virus:1</monctrl>'
        ],
        'rfwurl.virus:close' => [
            'type' => '0x06B0000100000069',
            'cmdType' => 1,
            'productId' => '53246C2F-F2EA-4208-9C6C-8954ECF2FA27',
            'cmdId'=>'0x5000',
            'desc'=>'关闭拦截木马网址',
            'cmdStr'=>'<monctrl>rfwurl.virus:0</monctrl>'
        ],
        'rfwurl.antifish:open' => [
            'type' => '0x06B0000100000069',
            'cmdType' => 1,
            'productId' => '53246C2F-F2EA-4208-9C6C-8954ECF2FA27',
            'cmdId'=>'0x5100',
            'cmdStr'=>'<monctrl>rfwurl.antifish:1</monctrl>'
        ],
        'rfwurl.antifish:close' => [
            'type' => '0x06B0000100000069',
            'cmdType' => 1,
            'productId' => '53246C2F-F2EA-4208-9C6C-8954ECF2FA27',
            'cmdId'=>'0x5100',
            'desc'=>'关闭拦截钓鱼网址',
            'cmdStr'=>'<monctrl>rfwurl.antifish:0</monctrl>'
        ],
        'rfwurl.evildown:open' => [
            'type' => '0x06B0000100000069',
            'cmdType' => 1,
            'productId' => '53246C2F-F2EA-4208-9C6C-8954ECF2FA27',
            'cmdId'=>'0x5200',
            'desc'=>'开启拦截恶意下载',
            'cmdStr'=>'<monctrl>rfwurl.evildown:1</monctrl>'

        ],
        'rfwurl.evildown:close' => [
            'type' => '0x06B0000100000069',
            'cmdType' => 1,
            'productId' => '53246C2F-F2EA-4208-9C6C-8954ECF2FA27',
            'cmdId'=>'0x5200',
            'desc'=>'关闭拦截恶意下载',
            'cmdStr'=>'<monctrl>rfwurl.evildown:0</monctrl>'

        ],
        'rfwurl.xss:open' => [
            'type' => '0x06B0000100000069',
            'cmdType' => 1,
            'productId' => '53246C2F-F2EA-4208-9C6C-8954ECF2FA27',
            'cmdId'=>'0x5300',
            'desc'=>'开启拦截跨站攻击',
            'cmdStr'=>'<monctrl>rfwurl.xss:1</monctrl>'

        ],
        'rfwurl.xss:close' => [
            'type' => '0x06B0000100000069',
            'cmdType' => 1,
            'productId' => '53246C2F-F2EA-4208-9C6C-8954ECF2FA27',
            'cmdId'=>'0x5300',
            'desc'=>'关闭拦截跨站攻击',
            'cmdStr'=>'<monctrl>rfwurl.xss:0</monctrl>'

        ],
        'rfwurl.search:open' => [
            'type' => '0x06B0000100000069',
            'cmdType' => 1,
            'productId' => '53246C2F-F2EA-4208-9C6C-8954ECF2FA27',
            'cmdId'=>'0x5400',
            'desc'=>'开启搜索结果检查',
            'cmdStr'=>'<monctrl>rfwurl.search:1</monctrl>'

        ],
        'rfwurl.search:close' => [
            'type' => '0x06B0000100000069',
            'cmdType' => 1,
            'productId' => '53246C2F-F2EA-4208-9C6C-8954ECF2FA27',
            'cmdId'=>'0x5400',
            'desc'=>'关闭搜索结果检查',
            'cmdStr'=>'<monctrl>rfwurl.search:0</monctrl>'

        ],
        'rfwiprule.rs:open' => [
            'type' => '0x06B0000100000069',
            'cmdType' => 1,
            'productId' => '53246C2F-F2EA-4208-9C6C-8954ECF2FA27',
            'cmdId'=>'0x5500',
            'desc'=>'开启防黑客攻击',
            'cmdStr'=>'<monctrl>rfwiprule.rs:1</monctrl>'

        ],
        'rfwiprule.rs:close' => [
            'type' => '0x06B0000100000069',
            'cmdType' => 1,
            'productId' => '53246C2F-F2EA-4208-9C6C-8954ECF2FA27',
            'cmdId'=>'0x5500',
            'desc'=>'关闭防黑客攻击',
            'cmdStr'=>'<monctrl>rfwiprule.rs:0</monctrl>'

        ],
        'rfwurl.adfilter:open' => [
            'type' => '0x06B0000100000069',
            'cmdType' => 1,
            'productId' => '53246C2F-F2EA-4208-9C6C-8954ECF2FA27',
            'cmdId'=>'0x5600',
            'desc'=>'开启广告过滤',
            'cmdStr'=>'<monctrl>rfwurl.adfilter:1</monctrl>'

        ],
        'rfwurl.adfilter:close' => [
            'type' => '0x06B0000100000069',
            'cmdType' => 1,
            'productId' => '53246C2F-F2EA-4208-9C6C-8954ECF2FA27',
            'cmdId'=>'0x5600',
            'desc'=>'关闭广告过滤',
            'cmdStr'=>'<monctrl>rfwurl.adfilter:0</monctrl>'

        ],
        'rfwsharmon:open' => [
            'type' => '0x06B0000100000069',
            'cmdType' => 1,
            'productId' => '53246C2F-F2EA-4208-9C6C-8954ECF2FA27',
            'cmdId'=>'0x5700',
            'desc'=>'开启共享监控',
            'cmdStr'=>'<monctrl>rfwsharmon:1</monctrl>'

        ],
        'rfwsharmon:close' => [
            'type' => '0x06B0000100000069',
            'cmdType' => 1,
            'productId' => '53246C2F-F2EA-4208-9C6C-8954ECF2FA27',
            'cmdId'=>'0x5700',
            'desc'=>'关闭共享监控',
            'cmdStr'=>'<monctrl>rfwsharmon:0</monctrl>'

        ]
    ];
}