
/*
 * Editor client script for DB table sites
 * Created by http://editor.datatables.net/generator
 */

(function($){

$(document).ready(function() {
	var editor = new $.fn.dataTable.Editor( {
		ajax: '/admin/php/table.sites.php',
		table: '#sites',
		fields: [
			{
				"label": "name:",
				"name": "name"
			},
			{
				"label": "Access:",
				"name": "access",
				"type": "select",
				"options": ['Private', 'Public']
			}
		]
	} );
	
	$.fn.dataTable.ext.errMode = 'none';

	var table = $('#sites')
		.on('error.dt', function(e, settings, techNote, message) {
			var msg = message.split('-')[1];
			errorMSG(msg);
			setPage(msg);
		})
		.DataTable( {
		buttons: [
			'excel'
		],
		dom: 'Bfrtip',
		ajax: '/admin/php/table.sites.php',
		columns: [
			{
				"data": "name"
			},
			{
				"data": "access"
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
	} );
} );

}(jQuery));

