<?php

/*
 * Editor server script for DB table projects
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

// Build our Editor instance and process the data coming from _POST
Editor::inst( $db, 'user_groups', 'id' )
	->fields(
		Field::inst( 'sites.name' ),
		Field::inst( 'user_groups.site_id' ),
		Field::inst( 'user_groups.name' ),
		Field::inst( 'user_groups.description' )
	)
	->leftJoin('sites', 'sites.id', '=', 'user_groups.site_id')
	->process( $_POST )
	->json();
