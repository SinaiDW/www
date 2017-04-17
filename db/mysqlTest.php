<?php

include_once("db.php");

$version = phpversion();
echo $version;

$res = getConnector('Sinai Central');
   
echo json_encode([ 'result' => 'OK', 'data' => $res ]);    

?>