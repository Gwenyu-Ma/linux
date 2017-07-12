<?php
    //$access_control = array('Index','Authmanager','Enterprisemanager','Systemconfig','Packages');
    $access_control =  array(
        'Index' => array('homeauth'),
        'Authmanager' =>array('authlist','writeauth','productauth','productdetails','historyaccredit','loginout'),
        'Enterprisemanager' => array('enterpriseadd','gettotalnum','enterpriselist','productlist','editerprise','delenterprise','passedit','getlogsset','setlogs'),
        'Systemconfig' => array('getsysteninfo','modifypasswd','uploadlogo','getlogo','uploadlogopreview','getlogopreview','resetlogo','updatesystemconfig'),
        'Packages' => array('getpackages','uploadpackages','geteidslist')
    );