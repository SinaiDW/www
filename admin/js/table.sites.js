
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
			}
		]
	} );

	var table = $('#sites').DataTable( {
		dom: 'Bfrtip',
		ajax: '/admin/php/table.sites.php',
		columns: [
			{
				"data": "name"
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

