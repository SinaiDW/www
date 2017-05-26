
/*
 * Editor client script for DB table worksheets
 * Created by http://editor.datatables.net/generator
 */

(function($){

$(document).ready(function() {
	var editor = new $.fn.dataTable.Editor( {
		ajax: { "url" : 'admin/php/table.worksheets.php',
				"data" : { 'id' : getCurrentPageData()['id'] }
		},
		table: '#worksheets',
		fields: [
			{
				"label": "name:",
				"name": "name"
			},
			{
				"label": "data_source_id:",
				"name": "data_source_id"
			},
			{
				"label": "workbook_id:",
				"name": "workbook_id"
			},
			{
				"label": "options:",
				"name": "options",
				"type": "textarea"
			}
		]
	} );

	var table = $('#worksheets').DataTable( {
		dom: 'Bfrtip',
		ajax: { "url" : 'admin/php/table.worksheets.php',
				"data" : { 'id' : getCurrentPageData()['id'] }
		},
		columns: [
			{
				"data": "name"
			},
			{
				"data": "data_source_id"
			},
			{
				"data": "workbook_id"
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

