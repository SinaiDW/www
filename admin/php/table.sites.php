<?php

/*
 * Editor server script for DB table sites
 * Created by http://editor.datatables.net/generator
 */

// DataTables PHP library and database connection
include_once("../../db/db.php");

if(hasValidSession()) {
	if(! isMemberOf(getSiteId('System'), getCurrentUserId(), 'Admin')){
		echo errorMSG("No access.", [ "data" => [] ]);
		die();
	} 
} else {
	echo errorMSG("No valid session", [ "data" => [] ]);
	die();
}


// Alias Editor classes so they are easy to use
include( "lib/DataTables.php" );
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
Editor::inst( $db, 'sites', 'id' )
	->fields(
		Field::inst( 'name' ),
		Field::inst( 'access' )
	)
	->process( $_POST )
	->json();
