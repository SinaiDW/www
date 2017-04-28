<?php

include_once( "./db.php");

sql([
	'query' => 'insert into group_members (user_id, group_id) values (:user_id, :group_id)',
	'params' => [
		[ 	'name' => ':user_id',
			'val' => $_POST['user_id'],
			'type' => PDO::PARAM_INT
		],
		[ 	'name' => ':group_id',
			'val' => $_POST['group_id'],
			'type' => PDO::PARAM_INT
		]
	],
	"data" => 'dml'
]);

echo json_encode([ "result" => "OK", "message" => "Group added"]);

?>
