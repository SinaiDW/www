
/*
 * Editor client script for DB table db_connectors
 * Created by http://editor.datatables.net/generator
 */

(function($){

$(document).ready(function() {
	var editor = new $.fn.dataTable.Editor( {
		ajax: 'php/table.db_connectors.php',
		table: '#db_connectors',
		fields: [
			{
				"label": "username:",
				"name": "username"
			},
			{
				"label": "password:",
				"name": "password",
				"type": "password"
			},
			{
				"label": "connect_string:",
				"name": "connect_string"
			},
			{
				"label": "character_set:",
				"name": "character_set"
			},
			{
				"label": "session_mode:",
				"name": "session_mode"
			}
		]
	} );

	var table = $('#db_connectors').DataTable( {
		dom: 'Bfrtip',
		ajax: 'php/table.db_connectors.php',
		columns: [
			{
				"data": "username"
			},
			{
				"data": "password"
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

