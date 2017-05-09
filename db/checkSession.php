<?php

include_once("db.php");

$res = hasValidSession();
echo json_encode ([ 'result' => 'OK', 'data' => [ 'hasSession' => $res]]);


?>