<?php namespace Tx;
/**
 * @file Is.php
 * @brief
 * @author cloud@txthinking.com
 * @date 2015-03-30
 */
class Is{
    public static function bankCard($n){
        $n = s($n);
        $sum = 0;
        for($i=1; $i<strlen($n); $i++){
            $now = i($n[strlen($n)-1-$i]);
            if($i%2 === 0){
                $sum += $now;
                continue;
            }
            $_ = $now*2;
            if($_ >= 10){
                $_0 = s($_);
                $_ = i($_0[0]) + i($_0[1]);
            }
            $sum += $_;
        }
        if(($sum + i($n[strlen($n)-1]))%10 !== 0){
            return false;
        }
        return true;
    }

    public static function chineseID($id){
        $id = strrev($id);
        if(strlen($id) !== 18){
            return false;
        }
        $sum = 0;
        for($i=1; $i<strlen($id); $i++){
            $w = pow(2, $i+1-1)%11;
            $sum += i($id[$i]) * $w;
        }
        $v = (12-($sum%11))%11;
        if($v === 10){
            return strtolower(s($id[0])) === 'x';
        }
        return i($id[0]) === $v;
    }

    public static function email($email){
       $r =  preg_match('/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/', $email);
       return $r === 1;
    }

    public static function chineseWords($words){
       $r =  preg_match('/[\x{4e00}-\x{9fa5}]+/u', $words);
       return $r === 1;
    }

}
