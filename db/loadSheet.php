<?php

include_once("db.php");

$id = $_GET['id'];

$res = getDataSource($id);

if(isset($res)) {
	//echo json_encode($res) . ' '. $res['source_type'];
	if($res['source_type'] == 'Query') {
		if($res['dbc_type'] == 'Oracle') {
			$s = '<script>
				$(document).ready(function() {
					addDataTableFromID(' . $id . ' )
				});
			</script>
			<div class="DataTables">
			<table id="projects' . $id . '" class="table table-striped table-bordered" cellspacing="0" width="100%"></table>
			</div>
			';
			echo json_encode([ "result" => 'OK', "html" => $s ]);
		}
	} else if($res['source_type'] == 'Tableau') {
		$s = $res['sql'];
		echo json_encode([ "result" => 'OK', "html" => html_entity_decode($s)]);
	} else {
		errorMSG('Unknown type', []);
	}
} else {
	errorMSG('No sheet found or no access', []);
}
	
?>
