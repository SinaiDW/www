<?php

include_once("db.php");
include_once("oracledb.php");

echo "Hello";
$t = time();

$sc = getConnector('Sinai Central');
$conn = openConnection($sc);

echo '<br>'. (time() - $t);

$t = time();

$res =  pivotRSET(sqlToJSON($conn, "SELECT * FROM hr.user_tab where fname = 'HARRY'", []));

echo '<br>'. (time() - $t);
$t = time();

echo json_encode($res);

echo '<br>'. (time() - $t);

closeConnection($conn);


?>
