<?php

include_once("/db/db.php");

$worksheets = getWorkSheets($_GET);

echo '<h3>Workbook:  <b>'. $_GET['name'].'</b></h3>';

echo '<div class="col-xs-12"><ul class="nav nav-tabs">';

$s = '';

$i = 0;
foreach($worksheets as $rec) {
	echo '<li '. ($i == 0 ? 'class="active"' : ''). '><a data-toggle="tab" href="#" onclick="loadPane('.
		$rec['id'] .
		')">'. $rec['name']. '</a></li>';	
	$i++;
	$s .= '<div class="worksheetPane" id="pane' . $rec['id'] .'">Hello '. $rec['name'] . '</div>';
}

echo '</ul><br>'. $s . '</div>';


?>

<script>

function loadSheet(id) {
	$.ajax({
		'url' : 'db/loadSheet.php',
		'data' : { 'id' : id },
		'type' : 'GET',
		'dataType' : 'json'
	}).success(function(json) {
		if(json.result == 'OK') {
		    if(json.html) {
				$('#pane' + id).html(json.html);
			}
		} else {
			errorMSG(json.error)
		}
	});
}

function loadPane(id) {
	$('.worksheetPane').each(function() {
		$(this).css({ 'display' : 'none' })
	});
	$('#pane' + id).html('<i class="fa fa-spinner fa-pulse"></i> Loading data ...');
	$('#pane' + id).css({ 'display' : 'block' });
	loadSheet(id);
}

$(document).ready(function() {
	$('.active').find('a').click();
});

</script>
