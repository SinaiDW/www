
/*
 * Editor client script for DB table projects
 * Created by http://editor.datatables.net/generator
 */

(function($){

$(document).ready(function() {
	$.ajax({
		'url' : '/admin/php/table.sites.php',
		'dataType' : 'json',
		'type' : 'GET'
	}).success(function(json) {
	var editor = new $.fn.dataTable.Editor( {
		ajax: '/admin/php/table.projects.php',
		table: '#projects',
		fields: [
			{
				"label": "Site",				
				"name": "projects.site_id",
				"type": "select",
				"options": parseJSONToOptions(json, 'name')
			},
			{
				"label": "Project name:",
				"name": "projects.name"
			},
			{
				"name": "projects.description",
				"label": "Description"
			}
		]
	} );

	$.fn.dataTable.ext.errMode = 'none';
	
	var table = $('#projects')
		.on('error.dt', function(e, settings, techNote, message) {
			var msg = message.split('-')[1];
			errorMSG(msg);
			setPage(msg);
		})
		.DataTable( {
		dom: 'Bfrtip',
		ajax: '/admin/php/table.projects.php',
		columns: [
			{
				"data": "sites.name",
				"label": "Site"
			},		
			{
				"data": "projects.name",
				"label": "Project Name"
			},
			{
				"data": "projects.description",
				"label": "Description"
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
} )
});

}(jQuery));

