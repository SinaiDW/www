<?php

$rootDir = "c:/bitnami/wampstack-5.6.30-1/apache2/";

function getRootPWD(&$rd) {
	global $rootDir;
	if(!isset($rd)) $rd = $rootDir;
	$myfile = fopen($rd . "db.pwd", "r") or die("Unable to open file!");
	$rec =  fread($myfile,filesize($rd . "db.pwd"));
	fclose($myfile);
	return $rec;
}

?>