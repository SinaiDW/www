<?php

include_once("/db/db.php");

$projects = getProjects([ "siteId" => $_GET["siteId"] ]);

foreach($projects as $rec) {
	echo '<div class="col-lg-3 col-sm-6 col-xs-12 projectBox clickable" onclick="getWorkbooks(\''. 
		$rec['name'].'\','.$rec['id'].')"><h4>'.  $rec['name'].'</h4><div class="description">'.$rec["description"]."</div></div>";
}


?>