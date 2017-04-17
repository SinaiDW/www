<?php

include("read_db_pwd.php");
$pwd = getRootPWD($s);

$db = new PDO('mysql:host=localhost;dbname=dw_admin;charset=utf8', 'root', $pwd);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

function sql($p) {
	global $db;
//	echo $p['query'] ."\n";
	$stmt = $db->prepare($p["query"]);
	if(isset($p['params']) && count($p['params']) > 0) {
		foreach($p['params'] as $val) {
			$stmt->bindValue($val["name"], $val["val"], $val["type"]);
		}
	}
	$stmt->execute();
	
	$rec = $stmt->fetchAll(PDO::PARAM_STR);
	if(isset($p['data'])) {
	    if($p['data']== 'single') {
		    if(count($rec) > 0) return $rec[0];
	     	else return null;
	    } else if($p['data'] == 'set') {
			return $rec;
		}
	} 
};

function createExcel() {
	
}

function getMySites() {
	$res = sql([
		'query' => "select * from sites",
		"data" => 'set'
	]);	
	return $res;
}

function getConnector($name) {
	$res = sql([
		'query' => "select * from db_connectors where name = :name",
		"params" => array(
			array(
				"name" =>	':name',
				"val" => $name,
				"type" => PDO::PARAM_STR)
		),
		"data" => 'single'
	]);	
	return $res;
};   

function getProjects($options) {
	$res = sql([
		'query' => "select * from projects where site_id = :siteId order by upper(name)",		
		"params" => [
			[	"name" => ":siteId",
				"val" => $options["siteId"],
				"type" => PDO::PARAM_INT
			]
		],
		"data" => 'set'
	]);	
	return $res;	
}

function getWorkbooks($options) {
	$res = sql([
		'query' => "select * from workbooks where project_id = :id order by upper(name)",		
		"params" => array(
			array(
				"name" => ":id",
				"val" => $options['id'],
				"type" => PDO::PARAM_INT
			)
		),
		"data" => 'set'
	]);	
	return $res;	
}

function getUser($options) {
	$res = sql([
		'query' => 'select * from users where id = :id',
		"params" => array(
			array(
				"name" => ":id",
				"val" => $options['id'],
				"type" => PDO::PARAM_INT
			)
		),
		"data" => 'single'
	]);
	return $res;
}

function getLocalAuth($options) {
	$res = sql([
		'query' => 'select * from local_auth where user_id = :user_id',
		"params" => array(
			array(
				"name" => ":user_id",
				"val" => $options['user_id'],
				"type" => PDO::PARAM_INT
			)
		),
		"data" => 'single'
	]);
	return $res;
}

/*
function hello() {}
	if(isset($_COOKIE['sessionKey'])) {
		$session = checkSession($_COOKIE['sessionKey']);
		if(isset($session)) {
			global $currentUser;
			$currentUser = getUserInfo($session['userid']);
		} else {
			setcookie($_COOKIE['sessionKey'], "", time() - 3600);
		}
	}
}*/

function getSession($params)  {
	if($params['sessionKey']) {
		$res = sql([
			"query" => "select s.user_id, s.session_start, s.status, u.name, u.status as user_status from sessions s " .
				"join users u on s.user_id = u.id where s.session_key = :sessionKey",
			"params" => [
				[ 	"name" => ":sessionKey",
					"val" => $params['sessionKey'],
					"type" => PDO::PARAM_STR
				]
			],
			"data" => "single"
		]);
		if($res && $res['status'] == 'Active' && $res['user_status'] == 'Active' ) {
			return $res;
		}
	}
}

function hasValidSession() {
	
}

function jsonError($error) {
	echo json_encode([ "result" => "error", "error" => $error]);
}

?>