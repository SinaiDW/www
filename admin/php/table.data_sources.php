<?php

/*
 * Editor server script for DB table data_sources
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
/* $db->sql( "CREATE TABLE IF NOT EXISTS `data_sources` (
	`id` int(10) NOT NULL auto_increment,
	`name` varchar(255),
	`type` varchar(255),
	`site_id` numeric(9,2),
	`db_connector_id` numeric(9,2),
	`sql` text,
	`options` text,
	PRIMARY KEY( `id` )
);" ); */

// Build our Editor instance and process the data coming from _POST
Editor::inst( $db, 'data_sources', 'data_sources.id' )
	->fields(
		Field::inst( 'data_sources.name' ),
		Field::inst( 'data_sources.type' ),
		Field::inst( 'db_connectors.name' ),
		Field::inst( 'data_sources.sql' ),
		Field::inst( 'data_sources.options' ),
		Field::inst( 'data_sources.site_id' )
	)
	->leftJoin('db_connectors', 'db_connectors.id', '=', 'data_sources.db_connector_id')
	->process( $_POST )
	->json();
