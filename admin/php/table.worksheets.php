<?php

/*
 * Editor server script for DB table worksheets
 * Created by http://editor.datatables.net/generator
 */

include_once("../../db/db.php");
checkSiteAdmin(); 
 
// DataTables PHP library and database connection
include( "lib/DataTables.php" );

// Alias Editor classes so they are easy to use
use
	DataTables\Editor,
	DataTables\Editor\Field,
	DataTables\Editor\Format,
	DataTables\Editor\Mjoin,
	DataTables\Editor\Options,
	DataTables\Editor\Upload,
	DataTables\Editor\Validate;

// The following statement can be removed after the first run (i.e. the database
// table has been created). It is a good idea to do this to help improve
// performance.
$db->sql( "CREATE TABLE IF NOT EXISTS `worksheets` (
	`id` int(10) NOT NULL auto_increment,
	`name` varchar(255),
	`data_source_id` numeric(9,2),
	`workbook_id` numeric(9,2),
	`options` text,
	PRIMARY KEY( `id` )
);" );

// Build our Editor instance and process the data coming from _POST
Editor::inst( $db, 'worksheets', 'worksheets.id' )
	->fields(
		Field::inst( 'worksheets.name' ),
		Field::inst( 'data_sources.name' ),
		Field::inst( 'worksheets.workbook_id' ),
		Field::inst( 'worksheets.data_source_id' ),
		Field::inst( 'worksheets.options' )
	)
	->leftJoin('data_sources', 'data_sources.id', '=', 'worksheets.data_source_id')
	->where('worksheets.workbook_id', $_GET['id'])
	->process( $_POST )
	->json();
