<?php

$conf = parse_ini_file('c:\Bitnami\wampstack-5.6.30-1\apache2\config.ini');
// echo json_encode($conf);

$db = new PDO('mysql:host=' . $conf['mysqlHost'] . ';dbname=' . $conf['mysqlDB'] . 
';charset=' . $conf['mysqlCharset'], $conf['mysqlUser'], $conf['mysqlPwd']);

$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

function getClientSiteId() {
	if(isset($_COOKIE) && isset($_COOKIE['siteId'])) return $_COOKIE['siteId']; 
	else 
		return -1;
}


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

function getSiteId($name) {
	$res = sql(
		[	"query" => "select id from sites where name = :name", 
			"params" => [				
				[ 	"name" => "name",
					"val" => $name,
					"type" => PDO::PARAM_STR
				]
			],
			"data" => "single"
		]
	);
	if(isset($res['id'])) return $res['id'];
	return null;	
}

function isMemberOf($siteId, $userId, $name) {
	$res = sql(
		[	"query" => "select 'x' as cnt from user_groups g join group_members m on m.group_id = g.id " .
				" where m.user_id = :userid and g.site_id = :siteid and g.name = :name", 
			"params" => [
				[ 	"name" => ":siteid",
					"val" => $siteId,
					"type" => PDO::PARAM_INT
				],
				[ 	"name" => ":userid",
					"val" => $userId,
					"type" => PDO::PARAM_INT
				],
				[ 	"name" => ":name",
					"val" => $name,
					"type" => PDO::PARAM_STR
				]
			],
			"data" => "single"
		]
	);
	if(isset($res['cnt'])) return true;
	return false;
}


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
			"query" => "select s.user_id, s.session_start, s.status, u.name, u.status as user_status ".
				" from sessions s " .
				"join users u on s.user_id = u.id where s.session_key = :sessionKey and s.user_id = :userid ",
			"params" => [
				[ 	"name" => ":sessionKey",
					"val" => $params['sessionKey'],
					"type" => PDO::PARAM_STR
				],
				[ 	"name" => ":userid",
					"val" => $params['userid'],
					"type" => PDO::PARAM_INT
				]				
			],
			"data" => "single"
		]);
		if($res && $res['status'] == 'Active' && $res['user_status'] == 'Active' ) {
			return $res;
		}
	}
	return null;
}

function loadPage($page) {
	echo "<script> $(document).ready(function() {loadPage('" . $page . "'); }); </script>";
}

function checkSiteAdmin() {
	if(hasValidSession()) {
		if(! isMemberOf($_COOKIE['siteId'], getCurrentUserId(), 'Admin')){
			echo errorMSG("No access.  You need to contact the Admin for this site.", [ "data" => [] ]);
			die();
		} 
	} else {
		echo errorMSG("No valid session", [ "data" => [] ]);
		die();
	}
}

function hasValidSession() {
	if(isset($_COOKIE) && isset($_COOKIE['sessionKey'])) {
		$result = getSession([ 
			'sessionKey' => $_COOKIE['sessionKey'], 
			'userid' => $_COOKIE['userid']
		]);
		if(isset($result)) return true;
	} 
	return false;
}

function jsonError($error) {
	echo json_encode([ "result" => "error", "error" => $error]);
}

function errorMSG($msg, $data) {
	$r = [ "result" => "error", "error" => $msg ];
	if(isset($data)) {
		array_merge($r, $data);
	}
	echo json_encode($r);
}

function getCurrentUserId() {
	return $_COOKIE['userid'];
}

?>