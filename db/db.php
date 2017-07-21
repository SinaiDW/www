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
	$stmt = $db->prepare($p["query"]);
	if(isset($p['params']) && count($p['params']) > 0) {
		foreach($p['params'] as $val) {
			$stmt->bindValue($val["name"], $val["val"], $val["type"]);
		}
	}
	if(isset($p['vals'])) {
		foreach($p['vals'] as $p1 => $v) {
			if(is_string($v)) {
				$stmt->bindValue(':' . $p1, $v, PDO::PARAM_STR);
			} else if(is_integer($v)){
				$stmt->bindValue(':' . $p1, $v, PDO::PARAM_INT);
			} else if(is_numeric($v)) {
				$stmt->bindValue(':' . $p1, $v, PDO::PARAM_STR);
			}
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
			'vals' => [ 'name' => $name ],
			"data" => "single"
		]
	);
	if(isset($res['id'])) return $res['id'];
	return null;	
}

function isMemberOf($siteId, $userId, $name) {
	$res = sql(
		[	"query" => "select 'x' as cnt from user_groups g join group_members m on m.group_id = g.id " .
				" where m.user_id = :userid and g.site_id = :siteId and g.name = :name", 
			'vals' => [ 'siteId' => $siteId, 'userid' => $userId, 'name' => $name ],
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
		'vals' => [ 'name' => $name ],
		"data" => 'single'
	]);	
	return $res;
};   

function getProjects($options) {
	$res = sql([
		'query' => "select * from projects where site_id = :siteId order by upper(name)",	
		'vals' => ['siteId' => $options["siteId"] ],
		"data" => 'set'
	]);	
	return $res;	
}

function getById($tableName, $id) {
	return sql([
		'query' => 'select * from ' . $tableName . ' where id = :id',
		'vals' => [ 'id' => $id ],
		"data" => 'single'
	]);
}

function getWorkbooks($options) {
	$res = sql([
		'query' => "select * from workbooks where project_id = :id order by upper(name)",	
		'vals' => ['id' => $options['id'] ],
		"data" => 'set'
	]);	
	return $res;	
}

function getWorksheets($options) {
	$res = sql([
		'query' => "select * from worksheets where workbook_id = :id order by upper(name)",		
		'vals' => [ 'id' => $options['id'] ],
		"data" => 'set'
	]);	
	return $res;
}

function getUser($options) {
	$res = sql([
		'query' => 'select * from users where id = :id',
		'vals' => ['id' => $options['id'] ],
		"data" => 'single'
	]);
	return $res;
}

function getLocalAuth($options) {
	$res = sql([
		'query' => 'select * from local_auth where user_id = :user_id',
		'vals' => [ 'user_id' => $options['user_id'] ],
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
			"query" => "select s.user_id, s.session_start, s.status, u.name, u.status as user_status 
				 from sessions s 
				 join users u on s.user_id = u.id where s.session_key = :sessionKey and s.user_id = :userid ",
			'vals' => [ 'sessionKey' => 	$params['sessionKey'], 'userid' => $params['userid'] ],			
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
		if(! isset($_COOKIE) || ! isset($_COOKIE['siteId'])) {
			errorMSG("No access.  You need to select a site.", [ "data" => [] ]);
			die();
		}
		if(! isMemberOf($_COOKIE['siteId'], getCurrentUserId(), 'Admin')){
			errorMSG("No access.  You need to contact the Admin for this site.", [ "data" => [] ]);
			die();
		} 
	} else {
		errorMSG("No valid session", [ "data" => [] ]);
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

function errorMSG($msg, $data) {
	$r = [ "result" => "error", "error" => $msg ];
	if(isset($data)) {
		array_merge($r, $data);
	}
	echo json_encode($r);
}

function json_data($message, $data) {
	echo json_encode([ 'result' => 'OK', 'message' => $message, 'data' => $data]);
}

function getCurrentUserId() {
	return $_COOKIE['userid'];
}

function getColumnsFromRSET($res) {
	$o = [];	
	foreach($res as $p => $v) {
		array_push($o, $p);
	}
	return $o;
}

function pivotRSET($res) {
	$o = [];
	$o['columns'] = [];
	$o['data'] = [];
	$i = 0;
	foreach($res as $p => $v) {
		array_push($o['columns'], [ 'title' =>$p ]);
		$r = 0;
		foreach($v as $c) {
			if($i == 0) {
				array_push($o['data'], []);
			}
			array_push($o['data'][$r], $c);
			$r++;
		}		
		$i++;
	}
	return $o;
}

function getDataSource($id) {
	$res = sql([
		'query' => "select 
				c.type as dbc_type,
				c.username,
				c.password,
				c.connect_string,
				d.sql,
				d.options,
				d.type as source_type,
				w.id
			 from worksheets w join data_sources d on w.data_source_id = d.id 
			 left join db_connectors c on c.id = d.db_connector_id 
			 where w.id = :id",		
		'vals' => [ 'id' => $id ],
		"data" => 'single'
	]);	
	return $res;
}

?>