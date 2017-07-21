<?php

include_once("oracledb.php");

$data = getRSET([ 
		"c" => "SC", 
		"sql" => "select p.id, deptcode, deptname, d.department_number, val from hris_data.department_properties p 
		join web.departments_tab d on d.objid = p.department_id where p.name = :name",
		"vals" => ["name" => $_GET["name"] ]
	]);
	
//var_dump($data);	

json_data("Department Properties", 
	pivotRSET($data)
	);

?>