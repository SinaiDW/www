
/*
 * Editor client script for DB table db_connectors
 * Created by http://editor.datatables.net/generator
 */

(function($){

$(document).ready(function() {
	var editor = new $.fn.dataTable.Editor( {
		ajax: '/admin/php/table.db_connectors.php',
		table: '#db_connectors',
		fields: [
			{
				"label": "Name:",
				"name": "name"
			},
			{
				"label": "Type:",
				"name": "type",
				"type": "select",
				"options": ['Oracle', 'SQL Server', 'MySQL', 'PostGres']
			},
			{
				"label": "Username:",
				"name": "username"
			},
			{
				"label": "Password:",
				"name": "password",
				"type": "password"
				
			},
			{
				"label": "Connect string:",
				"name": "connect_string"
			},
			{
				"label": "Character set:",
				"name": "character_set"
			},
			{
				"label": "Session mode:",
				"name": "session_mode"
			}
		]
	} );

	var table = $('#db_connectors').DataTable( {
		dom: 'Bfrtip',
		ajax: '/admin/php/table.db_connectors.php',
		columns: [
			{
				"data": "name"
			},
			{
				"data": "type"
			},
			{
				"data": "username"
			},
			{
				"data": "password",
				"render": function(data) { return "***********************************".substring(0, data.length) }
			},
			{
				"data": "connect_string"
			},
			{
				"data": "character_set"
			},
			{
				"data": "session_mode"
			}
		],
		select: true,
		lengthChange: false,
		buttons: [
			{ extend: 'create', editor: editor },
			{ extend: 'edit',   editor: editor },
			{ extend: 'remove', editor: editor }
		]
	} );
} );

}(jQuery));

