<?php

/*
 * Editor server script for DB table db_connectors
 * Created by http://editor.datatables.net/generator
 */

// DataTables PHP library and database connection
include( "lib/DataTables.php" );
include_once( "../../db/db.php");

// Alias Editor classes so they are easy to use
use
	DataTables\Editor,
	DataTables\Editor\Field,
	DataTables\Editor\Format,
	DataTables\Editor\Mjoin,
	DataTables\Editor\Options,
	DataTables\Editor\Upload,
	DataTables\Editor\Validate;
	
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
	->where('site_id', getClientSiteId())
	->process( $_POST )
	->json();
