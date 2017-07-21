<?php

include_once("../../db/db.php");


$workbook = getById('workbooks', $_GET['id']);
json_data('Workbook retrieved', $workbook);

?>

