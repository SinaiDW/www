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


// Build our Editor instance and process the data coming from _POST
Editor::inst( $db, 'projects', 'id' )
	->fields(
		Field::inst( 'sites.name' ),
		Field::inst( 'projects.site_id' ),
		Field::inst( 'projects.name' ),
		Field::inst( 'projects.description' )
	)
	->leftJoin('sites', 'sites.id', '=', 'projects.site_id')
	->where('site_id', getClientSiteId())
	->process( $_POST )
	->json();
