<?php if (!defined('DATATABLES')) exit(); // Ensure being used in DataTables env.

include_once ("../../db/db.php");


/*
 * DB connection script for Editor
 * Created by http://editor.datatables.net/generator
 */

// Enable error reporting for debugging (remove for production)
error_reporting(E_ALL);
ini_set('display_errors', '1');

/*
 * Edit the following with your database connection options
 */
$sql_details = array(
	"type" => "Mysql",
	"user" => $conf['mysqlUser'],
	"pass" => $conf['mysqlPwd'],
	"host" => $conf['mysqlHost'],
	"port" => "",
	"db"   => $conf['mysqlDB'],
	"dsn"  => "charset=". $conf['mysqlCharset']
);
