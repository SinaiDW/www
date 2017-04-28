<?php

/*
 * Editor server script for DB table db_sources
 * Created by http://editor.datatables.net/generator
 */

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
$db->sql( "CREATE TABLE IF NOT EXISTS `db_sources` (
	`id` int(10) NOT NULL auto_increment,
	`site_id` numeric(9),
	`db_connector_id` numeric(9),
	`sql` text,
	`options` text,
	PRIMARY KEY( `id` )
);" );

// Build our Editor instance and process the data coming from _POST
Editor::inst( $db, 'db_sources', 'id' )
	->fields(
		Field::inst( 'db_connector_id' ),
		Field::inst( 'sql' ),
		Field::inst( 'options' )
	)
	->process( $_POST )
	->json();
