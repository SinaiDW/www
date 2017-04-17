
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

	var table = $('#workbooks').DataTable( {
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
			{ extend: 'remove', editor: editor }
		]
	} ) });
} );

}(jQuery));

function editWorkBook(row) {
	alert(row);
}

