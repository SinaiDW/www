<?php

include_once("oracledb.php");

$depts = preg_split("/[\s,;]/", $_POST['depts']);

$ar = [];
$dn = [];

foreach($depts as $v) {
	if(strlen($v) == 3) {
		array_push($ar, $v);
	}	
	if(strlen($v) == 4) {
		if(substr($v, 0, 1) == 'Q') {			
			array_push($ar, $v);
		} else {
			array_push($dn, $v);
		}
	}
}

$delSql = "delete from hris_data.department_properties
	where department_id = (select objid from web.departments_tab where deptcode = :dept)
";

$conn = openSC();

if(count($dn) > 0) {
	$res = sqlToJSON($conn, "select deptcode from web.departments_tab where department_number in (".
		getInStr($dn) .")", []);
	var_dump($res);
	$ar = array_merge($ar, $res['DEPTCODE']);		
}


$conn = openSC();

foreach($depts as $v) {
	dml($conn, $delSql, [ "vals" => [ "dept" => $v]]);
}

commit($conn);

closeConnection($conn);

echo json_encode([ "result" => "OK", "message" => "Departments deleted."]);

?>