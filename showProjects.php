<?php

include_once("/db/db.php");

if(isset($_GET) && isset($_GET["siteId"])) {
	$siteId = $_GET["siteId"];
} else if(isset($_COOKIE) && isset($_COOKIE['siteId'])) {
	$siteId = $_COOKIE["siteId"];
} else {
    loadPage('nosite.html');
	die;
}

$projects = getProjects([ "siteId" => $siteId ]);

foreach($projects as $rec) {
	echo '<div class="col-lg-3 col-sm-6 col-xs-12 projectBox clickable" onclick="getWorkbooks(\''. 
		$rec['name'].'\','.$rec['id'].')"><h4>'.  $rec['name'].'</h4><div class="description">'.$rec["description"]."</div></div>";
}


?>