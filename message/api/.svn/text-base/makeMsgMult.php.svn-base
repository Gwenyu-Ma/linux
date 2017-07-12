<?php
require __DIR__ . '/../../vendor/autoload.php';

use Message\Model\MsgManager;
use Tx\Response;

$type = $_POST['type'];
$title = $_POST['title'];
$context = $_POST['context'];
$isRepeat = $_POST['isRepeat'];
$times = $_POST['times'];
$titleInc = $_POST['titleInc'];
$index = 1;
while ($index <= $times) {
    MsgManager::makeMsg([
        'types' => [$type],
        'context' => $context,
        'title' => $titleInc ? $title . $index : $title,
    ]);
    $index = $isRepeat ? ++$index : $tiems;
}
Response::ok("成功");
