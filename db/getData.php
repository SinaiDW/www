<?php

include_once("db.php");

$id = $_GET['id'];
$res = getDataSource($id);

if($res['dbc_type'] == 'Oracle') {
	include_once("oracledb.php");
	$res = pivotRSET(getRSET($res));
	$res['id'] = $id;
	echo json_encode([ "result" => "OK", "data" => $res ]);
}


?>