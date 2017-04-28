
/*
 * Editor client script for DB table db_sources
 * Created by http://editor.datatables.net/generator
 */

(function($){

$(document).ready(function() {
	var editor = new $.fn.dataTable.Editor( {
		ajax: 'php/table.db_sources.php',
		table: '#db_sources',
		fields: [
			{
				"label": "db_connector_id:",
				"name": "db_connector_id"
			},
			{
				"label": "sql:",
				"name": "sql",
				"type": "textarea"
			},
			{
				"label": "options:",
				"name": "options",
				"type": "textarea"
			}
		]
	} );

	var table = $('#db_sources').DataTable( {
		dom: 'Bfrtip',
		ajax: 'php/table.db_sources.php',
		columns: [
			{
				"data": "db_connector_id"
			},
			{
				"data": "sql"
			},
			{
				"data": "options"
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

