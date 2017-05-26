
/*
 * Editor client script for DB table workbooks
 * Created by http://editor.datatables.net/generator
 */

(function($){

$(document).ready(function() {
	$.ajax(
	{	'url' : '/admin/php/table.projects.php',
		'dataType' :'json',
		'type' : 'GET'
	}	
	).success(function(json) {
		if(json.error) {
			errorMSG(json.error);
			setPage(json.error);	
			return false;
		}
	var editor = new $.fn.dataTable.Editor( {
		ajax: '/admin/php/table.workbooks.php',
		table: '#workbooks',
		fields: [
			{
				"label": "Project name:",
				"name": "workbooks.project_id",
				"type": "select",
				"options": parseJSONToOptions(json, 'projects.name')
			},
			{
				"label": "name:",
				"name": "workbooks.name"
			}
		]
	} );
	
	$.fn.dataTable.ext.errMode = 'none';

	var table = $('#workbooks')
		.on('error.dt', function(e, settings, techNote, message) {
			var msg = message.split('-')[1];
			errorMSG(msg);
			setPage(msg);
		})
		.DataTable( {
		dom: 'Bfrtip',
		ajax: '/admin/php/table.workbooks.php',
		columns: [
			{
				"data": "workbooks.name"
			},
			{
				"data": "projects.name"
			},
			{
				'data' : null,
				'orderable' : false,
				'render' : function(data, type, row) { 
					return '<button onclick="editWorkBook(\'' + row['DT_RowId'] + '\')">Build</button>'; 
				}
			}
		],
		select: true,
		lengthChange: false,
		buttons: [
			{ extend: 'create', editor: editor },
			{ extend: 'edit',   editor: editor },
			{ extend: 'remove', editor: editor },
			'excel'
		]
	} ) });
} );

}(jQuery));

function editWorkBook(row) {
	loadPage("admin/worksheets.html", { 'id': row.replace('row_', '') });
}

