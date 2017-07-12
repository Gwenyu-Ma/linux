<?php
namespace Lib\Util;
include('KLogger.php');
class logs {
    static function _init( $param ){
        $logPath = realpath(dirname(__FILE__).'/../../logs/');
        $logPath1 = $logPath.'/'.date('Y');
        if(!file_exists($logPath1)){
            mkdir($logPath1,0777);
        }
        $logPath2 = $logPath1.'/'.date('m');
        if(!file_exists($logPath2)){
            mkdir($logPath2,0777);
        }
        switch( $param ){
            case 'info':
                return new KLogger($logPath2,KLogger::INFO); 
            case 'notice':
                return new KLogger($logPath2,KLogger::NOTICE); 
            case 'warn':
                return new KLogger($logPath2,KLogger::WARN); 
            case 'error':
                return new KLogger($logPath2,KLogger::ERR); 
            case 'debug':
                return new KLogger($logPath2,KLogger::DEBUG);
            case 'alert':
                return new KLogger($logPath2,KLogger::ALERT);
            default :
                break;  
        }
    }

    static function logInfo( $context ){
        $obj = self::_init( 'info' );
        $obj->logInfo( $context );
    }

    static function logNotice( $context ){
        $obj = self::_init( 'notice' );
        $obj->logNotice( $context );
    }

    static function logWarn( $context ){
        $obj = self::_init( 'warn' );
        $obj->logWarn( $context );
    }

    static function logError( $context ){
        $obj = self::_init( 'error' );
        $obj->logError( $context );
    }

    static function logDebug( $context ){
        $obj = self::_init( 'debug' );
        $obj->logDebug( $context );
    }
 
    static function logAlert( $context ){
        $obj = self::_init( 'alert' );
        $obj->logAlert( $context );
    }
}