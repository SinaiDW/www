<?php

include_once("db.php");

$user = getUser([ "id" => $_POST["user_id"]]);

if(! is_null($user)) {
	$pwd = getLocalAuth($_POST);
	if(is_null($pwd)) {
		sql([
			"query" => "insert into local_auth (username, password, change_password, user_id) values (:username, :password, :change_password, :user_id)",
			"params" => [[
					"name" => "username",
					"val" => $_POST['username'],
					"type" => PDO::PARAM_STR
				],
				[
					"name" => "password",
					"val" => md5($_POST['password']),
					"type" => PDO::PARAM_STR
				],
				[
					"name" => "change_password",
					"val" => $_POST['change_password'],
					"type" => PDO::PARAM_STR
				],
				[
					"name" => "user_id",
					"val" => $_POST['user_id'],
					"type" => PDO::PARAM_INT
				]
			],
			"type" => 'dml'
		]);
		echo json_encode([ "result" => "OK", "message" => "Password updated."]);
	} else {
		sql([
			"query" => "update local_auth set username = :username, password = :password, change_password = :change_password, last_reset = now() where user_id = :user_id",
			"params" => [[
					"name" => "username",
					"val" => $_POST['username'],
					"type" => PDO::PARAM_STR
				],
				[
					"name" => "password",
					"val" => md5($_POST['password']),
					"type" => PDO::PARAM_STR
				],
				[
					"name" => "change_password",
					"val" => $_POST['change_password'],
					"type" => PDO::PARAM_STR
				],
				[
					"name" => "user_id",
					"val" => $_POST['user_id'],
					"type" => PDO::PARAM_INT
				]
			],
			"type" => 'dml'
		]);
		echo json_encode([ "result" => "OK", "message" => "Password updated."]);
	}
} else {
	echo json_encode([ "result" => "ERROR", "error" => "User does not exist."]);
}

?>
