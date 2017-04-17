<?php


include_once("db.php");

$network = $_POST['network'];

if(is_null($_POST['network'])) {
	die("No Network. Not good.");
}

function createSession($user_id) {
	$charSet = '0123456789abcdefghijklmnopqrstuvwxABCDEFGHIJKLMNOPQRSTUVWX';
	# create a random string
	$s = '';
	for($i=0; $i<30; $i++) {
		$s .= substr($charSet, rand(0, strlen($charSet)-1), 1);
	}
	sql([
		'query' => 'insert into sessions (user_id, session_key) values (:user_id, :session_key)',
		"params" => array(
			array(
				"name" => ":user_id",
				"val" => $user_id,
				"type" => PDO::PARAM_INT
			),
			array(
				"name" => ":session_key",
				"val" => $s,
				"type" => PDO::PARAM_STR
			)
		),
		"data" => 'set'
	]);
	return $s;
}

$server = 'ldap://ad.mountsinai.org';
$dn = 'dc=msnyuhealth,dc=org';
$domain = 'ad.mountsinai.org';
if( $network == 'local' ) {
	$res = sql([
		'query' => 'select * from local_auth where username = :username',
		"params" => array(
			array(
				"name" => ":username",
				"val" => $_POST['username'],
				"type" => PDO::PARAM_STR
			)
		),
		"data" => 'single'
	]);
	if(! is_null($res)  && $res['password'] == md5($_POST['password'])) {
		
		echo json_encode([ 'result' => 'OK', 'message' => 'Login OK', 'sessionKey' => createSession($res['user_id']) ]);
	} else {
		echo json_encode([ 'result' => 'error', 'error' => 'Username or password incorrect']);
	}
	exit();
} else if( $network == 'mssm') {
	$server = 'ldap://ad.mssm.edu';
	$dn = 'dc=mssmcampus,dc=mssm,dc=edu';
} else if( $network == 'bislw') {
	$server = 'ldap://ad.chpnet.org';
	$dn = 'dc=ad,dc=chpnet,dc=org';	
} else if( $network == 'nyee') {
	$server = 'ldap://ad-nyee.mountsinai.org';
	$dn = 'dc=nyee,dc=edu';		
}

$ldap = ldap_connect($server);
if($ldap) {
	ldap_set_option($ldap, LDAP_OPT_PROTOCOL_VERSION, 3);
	ldap_set_option($ldap, LDAP_OPT_REFERRALS, 0);
	//ldap_get_option($ldap, LDAP_OPT_DIAGNOSTIC_MESSAGE, $extended_error);
	$u = 'CN='. $_POST['username'].','.$dn;
	echo $server . ' - ' . $u ."\n";
	if ($bind = ldap_bind($ldap, $_POST['username'], $_POST['password'])) {
		echo 'success';
	} else {
		echo 'Not good';
	}
} else {
	echo "No server! \n";	
}	

?>