<?php
use \Lib\Util\logs;

class AuthWhiteListController extends MyController
{
    public function init()
    {
       parent::init();
    }

    public function getWhiteListAction()
    {
        $objModel = new AuthWhiteListModel();
        $aWhiteList = $objModel->getWhiteList();
        $this->ok( $aWhiteList );

    }

    public function addWhiteListAction(){
        $guid    = $this->param('guid', '');
        $proGuid    = $this->param('proGuid', '');
        $objModel = new AuthWhiteListModel();
        $objModel->addWhiteList( $guid,$proGuid );

    }

    public function delWhiteListAction(){
        $guid    = $this->param('guid', '');
        $objModel = new AuthWhiteListModel();
        $objModel->delWhiteList( $guid );
    }


}
