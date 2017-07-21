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

$insSql = "insert into hris_data.department_properties 
	(id, department_id, name, val) values ((select max(id) + 1 from hris_data.department_properties),
	(select objid from web.departments_tab where deptcode = :dept), :name, :val)
";

$conn = openSC();

//var_dump ($dn);	

if(count($dn) > 0) {
	$res = sqlToJSON($conn, "select deptcode from web.departments_tab where department_number in (".
		getInStr($dn) .")", []);
	var_dump($res);
	$ar = array_merge($ar, $res['DEPTCODE']);		
}

foreach($ar as $v) {
	dml($conn, $delSql, [ "vals" => [ "dept" => $v]]);
	// echo $v . ' ' . $_POST["name"]. ' ' . $_POST["val"]. "\n <br>";
	dml($conn, $insSql, 
	 [ "vals" => [ "dept" => $v, "name" => $_POST["name"], "val" => $_POST["val"] ]]); 
}

commit($conn);

closeConnection($conn);

echo json_encode([ "result" => "OK", "message" => "Departments added."]);

?>