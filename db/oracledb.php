<?php

include_once('db.php');

function openSC() {
	$sc = getConnector('Sinai Central');
	return openConnection($sc);
}


function openConnection($sc) {
	if(isset($sc['c']) && $sc['c'] == 'SC') {
		return openSC();
	} else {
		$conn = oci_connect($sc['username'], $sc['password'], $sc['connect_string']);
		if (!$conn) {
			$e = oci_error();
			trigger_error($e['message'], E_USER_ERROR);
		} 
		return $conn;
	}
}


function sqlToJSON($connection, $sql, $options) {
	$stid = oci_parse($connection, $sql);
	$rows = [];
	if(isset($options) && isset($options['vals'])) {
		foreach($options['vals'] as $p => $v) {
			oci_bind_by_name ($stid, ':'.$p, $v);
		}
	} 
	oci_execute($stid);
	oci_fetch_all($stid, $res);	
	oci_free_statement($stid);
	return $res;
}

function dml($connection, $sql, $options) {
	$stid = oci_parse($connection, $sql);
	if(isset($options) && isset($options['vals'])) {
		foreach($options['vals'] as $p => $v) {
			oci_bind_by_name ($stid, 
				':'. $p, 
				$options['vals'][$p], 
				strlen($options['vals'][$p]), 
				(gettype($v) == 'string' ? SQLT_CHR : SQLT_INT)
			);
		}
	} 
	oci_execute($stid);
	oci_free_statement($stid);
}

function getInStr($ar) {
	$s = '';
	foreach($ar as $v) {
		$s .= "'". $v . "',";
	}
	if(substr($s, strlen($s) -1, 1) == ',') $s = substr($s, 0, strlen($s) - 1);
	return $s;
}

function commit($conn) {
	oci_commit($conn);
}

function closeConnection($conn) {
	oci_close($conn);
}

function getRSET($options) {
	$conn = openConnection($options);
	$res = sqlToJSON($conn, $options['sql'], $options);
	closeConnection($conn);
	return $res;
}

?>