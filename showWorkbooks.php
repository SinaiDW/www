<?php

include_once("/db/db.php");

$workbooks = getWorkBooks($_GET);

echo '<h3>Project:  <b>'. $_GET['name'].'</b></h3>';

foreach($workbooks as $rec) {
	echo '<div class="col-lg-3 col-sm-6 col-xs-12 workbookBox" onclick="showWorksheets(\''.
	$rec['name'] . '\', ' . $rec['id'] .
	')"><h4>'.  $rec['name']."</h4></div>";
}


?>