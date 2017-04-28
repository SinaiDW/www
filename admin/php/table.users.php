<?php

/*
 * Editor server script for DB table sites
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

// Build our Editor instance and process the data coming from _POST
Editor::inst( $db, 'users', 'id' )
	->fields(
		Field::inst( 'name' ),
		Field::inst( 'status' ),
		Field::inst( 'employee_id' ),
		Field::inst( 'email' )
	)
	->process( $_POST )
	->json();
