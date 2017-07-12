<?php
class RsEncDec{
    private $book="welcome Rising*youarelawless!y2a3n4g5Y6U7q8i@S9I0N#A.C%O(M-)<>ABI993JIEM,;'{jkliewaqlsiqomv.z^iwaql}-_=+)_(l;2j2f90aslkjflkasjas32092JKLSJFbASAUI/Z/A[/,./|@~`FS'.Z,MF920SDLAFJKAL9320QFFMmlajfl,.<>//|348q9729|fjlail3jo798,ksafa302-s;akfa;=_++-0-_))0-0-p23is";

    function rsencode($source)
    {
         if(strlen($source)<=0) return "";
        //mb_split()
        try{
            $array_source = str_split($source);
            for($i=0; $i<count($array_source); $i++){
                $array_source[$i]=ord($array_source[$i]);
            }

            $array_book = str_split($this->book);
            for($i=0; $i<count($array_book); $i++) {
                $array_book[$i]=ord($array_book[$i]);
            }

            $encode = array();
            $pXY = 0;
            for($i=0;$i<6;$i++)
            {
                $encode[]= rand(0, 255);
            }
            for($i=6; $i<count($array_source)+6; $i++){
                $encode[$i] = $array_source[$i-6] ^ $array_book[$encode[$i%6]];
                $pXY += $array_source[$i-6];
                $pXY &= 0xff;
            }

            $encode[count($encode)] = $pXY ^ $array_book[$encode[(count($encode))%6]];
            for($i=0; $i<count($encode);$i++)
            {
                $encode[$i]=chr($encode[$i]);
            }
            $rtnString = implode('',$encode);
            $rtnString = base64_encode($rtnString);
            $rtnString = str_replace("+","-",$rtnString);
            return $rtnString;
        }
        catch(Exception $e){
            return "";
        }
    }

    function rsdecode($source){
        if(strlen($source)<=0) return "";

        $source=str_replace("-","+",$source);
        try{
            $decString = base64_decode($source);
            $array_decode = str_split($decString);
            for($i=0; $i<count($array_decode); $i++)
            {
                $array_decode[$i]=ord($array_decode[$i]);    //bytes ==$array_decode
            }

            $array_book = str_split($this->book);
            for($i=0; $i<count($array_book); $i++)
            {
                $array_book[$i]=ord($array_book[$i]);
            }
            $ArryRnd = array();
            $Arry2 = array();
            $pXY=0;
            $pCRC=0;
            $array_decode_length=count($array_decode);

            for($i=0; $i<6; $i++){
                $ArryRnd[$i] = @$array_decode[$i];
            }
            for($i=6; $i<$array_decode_length-1; $i++)
            {
                $Arry2[$i-6]= $array_decode[$i] ^ $array_book[$ArryRnd[$i%6]];
                $pXY+=$Arry2[$i-6];
                $pXY&= 0xff;
                $Arry2[$i-6]=chr($Arry2[$i-6]);
            }
            $pCRC=$array_decode[$array_decode_length-1] ^ $array_book[$ArryRnd[($array_decode_length-1)%6]];
            if($pXY == $pCRC){
                $deString = implode('',$Arry2);
                return $deString;
            }
             else
                return "";
        }
        catch(Exception $e){
            return "";
        }
    }
}
?>