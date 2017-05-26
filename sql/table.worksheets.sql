-- 
-- Editor SQL for DB table worksheets
-- Created by http://editor.datatables.net/generator
-- 

CREATE TABLE IF NOT EXISTS `worksheets` (
	`id` int(10) NOT NULL auto_increment,
	`name` varchar(255),
	`data_source_id` numeric(9,2),
	`workbook_id` numeric(9,2),
	`options` text,
	PRIMARY KEY( `id` )
);