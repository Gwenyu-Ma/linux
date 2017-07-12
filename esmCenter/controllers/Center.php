<?php

class CenterController extends MyController
{
    public function indexAction()
    {
        $_SESSION['UserInfo']=null;
        session_destroy();

        if (UserModel::existsUser()) {
            $this->disply('auth/Index/login');
            return;
        }
        $this->disply('auth/Index/index');
    }
}