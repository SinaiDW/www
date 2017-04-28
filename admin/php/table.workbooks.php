<?php

/*
 * Editor server script for DB table workbooks
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
Editor::inst( $db, 'workbooks', 'id' )
	->fields(
		Field::inst( 'workbooks.project_id' ),
		Field::inst( 'workbooks.name' ),
		Field::inst( 'projects.name' )
	)
	->leftJoin('projects', 'projects.id', '=', 'workbooks.project_id')
	->where('projects.site_id', getClientSiteId())
	->process( $_POST )
	->json();
