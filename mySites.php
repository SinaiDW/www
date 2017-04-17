<?php

include_once("db/db.php");

$res = getMySites();

foreach($res as $rec) {
	echo '<div class="col-lg-3 col-sm-6 col-xs-12 siteBox clickable" onclick="setSite('. $rec['id'] . ', \'' .
		$rec['name'].'\')"><h4>'.  $rec['name'].'</h4></div>';
}

?>

