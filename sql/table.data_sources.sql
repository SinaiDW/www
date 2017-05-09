-- 
-- Editor SQL for DB table data_sources
-- Created by http://editor.datatables.net/generator
-- 

CREATE TABLE IF NOT EXISTS `data_sources` (
	`id` int(10) NOT NULL auto_increment,
	`name` varchar(255),
	`type` varchar(255),
	`site_id` numeric(9,2),
	`db_connector_id` numeric(9,2),
	`sql` text,
	`options` text,
	PRIMARY KEY( `id` )
);