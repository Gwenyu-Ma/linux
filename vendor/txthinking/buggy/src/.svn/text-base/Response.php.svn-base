<?php namespace Tx;
/**
 * @file Response.php
 * @brief response and exit
 * @author cloud@txthinking.com
 * @version 0.0.1
 * @date 2015-06-13
 */

class Response{

    protected static $_codes = array(
        100   =>      'Continue',
        101   =>      'Switching Protocols',

        200   =>      'OK',
        201   =>      'Created',
        202   =>      'Accepted',
        203   =>      'Non Authoritative Info',
        204   =>      'No Content',
        205   =>      'Reset Content',
        206   =>      'Partial Content',

        300   =>      'Multiple Choices',
        301   =>      'Moved Permanently',
        302   =>      'Found',
        303   =>      'See Other',
        304   =>      'Not Modified',
        305   =>      'Use Proxy',
        307   =>      'Temporary Redirect',

        400   =>      'Bad Request',
        401   =>      'Unauthorized',
        402   =>      'Payment Required',
        403   =>      'Forbidden',
        404   =>      'Not Found',
        405   =>      'Method Not Allowed',
        406   =>      'Not Acceptable',
        407   =>      'Proxy Auth Required',
        408   =>      'Request Timeout',
        409   =>      'Conflict',
        410   =>      'Gone',
        411   =>      'Length Required',
        412   =>      'Precondition Failed',
        413   =>      'Request Entity TooLarge',
        414   =>      'Request URI TooLong',
        415   =>      'Unsupported Media Type',
        416   =>      'Requested Range Not Satisfiable',
        417   =>      'Expectation Failed',
        418   =>      'Teapot',

        500   =>      'Internal Server Error',
        501   =>      'Not Implemented',
        502   =>      'Bad Gateway',
        503   =>      'Service Unavailable',
        504   =>      'Gateway Timeout',
        505   =>      'HTTP Version Not Supported',
    );

    /**
     * @brief status
     *
     * @param $code
     * @param $headers
     * @param $code
     *
     * @return
     */
    public static function raw($code, $headers=array(), $body=null){
        if(!isset(self::$_codes[$code])){
            throw new \Exception('Unknown HTTP status code:' . $code);
        }
        header(sprintf('HTTP/1.1 %d %s', $code, self::$_codes[$code]));
        if(!empty($headers)){
            foreach($headers as $k=>$v){
                header(sprintf('%s: %s', $k, $v));
            }
        }
        if(is_string($body)){
            echo $body;
        }
        exit;
    }

    /**
     * @brief text
     *
     * @param $code
     * @param $message string | null
     *
     * @return
     */
    public static function text($message=null, $code=200){
        $headers = array();
        if(is_string($message)){
            $headers['Content-Type'] = 'text/plain; charset=utf-8';
        }
        self::raw($code, $headers, $message);
    }

    /**
     * @brief json jsonrpc format
     *
     * @param $code int
     * @param $data array | object | null
     *
     * @return
     */
    public static function json($data=null, $code=200){
        $headers = array();
        $body = null;
        if(is_array($data) || is_object($data)){
            $headers['Content-Type'] = 'application/json';
            $body = json_encode($data);
        }
        self::raw($code, $headers, $body);
    }

    /**
     * @brief ok
     *
     * @param $data
     * @param $code
     *
     * @return
     */
    public static function ok($data=null, $code=200){
        self::_struct($data, null, $code);
    }

    /**
     * @brief error
     *
     * @param $error
     * @param $code
     *
     * @return
     */
    public static function error($error, $code=200){
        self::_struct(null, $error, $code);
    }

    /**
     * @brief _return
     *
     * @param $result
     * @param $error
     *
     * @return
     */
    protected static function _struct($result, $error = null, $code=200){
        self::json(array(
            'result' => $result,
            'error' => $error,
        ), $code);
    }
}

