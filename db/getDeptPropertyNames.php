<?php

include_once("oracledb.php");

$data = getRSET([ 
		"c" => "SC", 
		"sql" => "select distinct name from hris_data.department_properties"
	]);
	
//var_dump($data);	

json_data("Department Properties", 
	pivotRSET($data)
	);

?>