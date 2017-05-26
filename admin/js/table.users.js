
/*
 * Editor client script for DB table workbooks
 * Created by http://editor.datatables.net/generator
 */

(function($){

$(document).ready(function() {
	var editor = new $.fn.dataTable.Editor( {
		ajax: '/admin/php/table.users.php',
		table: '#users',
		fields: [
			{
				"label": "Name",
				"name": "name"
			},
			{
				"label": "Status:",
				"name": "status",
				"type" : "select",
				"options": [ "Active", "Inactive" ]
			},
			{
				"label": "Employee ID",
				"name": "employee_id"
			},
			{
				"label": "e-mail",
				"name": "email"
			}			
		]
	} );

	var table = $('#users').DataTable( {
		dom: 'Bfrtip',
		ajax: '/admin/php/table.users.php',
		columns: [
			{
				"data": "name"
			},
			{
				"data": "status"
			},
			{
				"data": "employee_id"
			},
{
				"data": "email"
			},			
			{
				'data' : null,
				'orderable' : false,
				'render' : function(data, type, row) { 
					return '<button onclick="resetPassword(\'' + row['DT_RowId'] + '\')"><i class="fa fa-key" title="Reset password"></i></button>'; 
				}
			},
			{
				'data' : null,
				'orderable' : false,
				'render' : function(data, type, row) { 
					return '<button onclick="setGroups(\'' + row['DT_RowId'] + '\')"><i class="fa fa-group" title="Group membership"></i></button>'; 
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
}(jQuery));


