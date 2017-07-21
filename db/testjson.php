<?php

$conn = oci_connect('harry', 'squonk', 'fin1_prod80');
if (!$conn) {
	$e = oci_error();
	errorMSG($e['message']);
	die();
}

$t1 = time();

$stid = oci_parse($conn, "select * from user_tab where lname like '%'");
oci_execute($stid);
$out = array();
oci_fetch_all($stid, $out);


echo json_encode($out);

echo time() - $t1;



?>