<?php

/*
 * Editor server script for DB table db_connectors
 * Created by http://editor.datatables.net/generator
 */

// DataTables PHP library and database connection
include( "lib/DataTables.php" );
include( "db/db.php");

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
$db->sql( "CREATE TABLE IF NOT EXISTS `db_connectors` (
	`id` int(10) NOT NULL auto_increment,
	`username` varchar(255),
	`password` varchar(255),
	`connect_string` varchar(255),
	`character_set` varchar(255),
	`session_mode` numeric(9,2),
	PRIMARY KEY( `id` )
);" );

// Build our Editor instance and process the data coming from _POST
Editor::inst( $db, 'db_connectors', 'id' )
	->fields(
		Field::inst( 'name' ),
		Field::inst( 'username' ),
		Field::inst( 'type' ),
		Field::inst( 'password' ),
		Field::inst( 'connect_string' ),
		Field::inst( 'character_set' ),
		Field::inst( 'session_mode' )
	)
	->process( $_POST )
	->json();
