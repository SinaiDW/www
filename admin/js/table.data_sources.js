
/*
 * Editor client script for DB table data_sources
 * Created by http://editor.datatables.net/generator
 */

(function($){

$(document).ready(function() {
	$.ajax(
	{	'url' : '/admin/php/table.db_connectors.php',
		'dataType' :'json',
		'type' : 'GET'
	}).success(function(json) {
		if(json.error) {
			errorMSG(json.error);
			setPage(json.error);
			return false;
		}
		var editor = new $.fn.dataTable.Editor( {
		ajax: 'admin/php/table.data_sources.php',
		table: '#data_sources',
		fields: [
			{
				"label": "Name:",
				"name": "data_sources.name"
			},
			{
				"label": "Type:",
				"name": "data_sources.type",
				"type": "select",
				"options" : ['Query']
			},		
			{
				"label": "db_connector_id:",
				"name": "data_sources.db_connector_id",
				"type" : "select",
				"options": parseJSONToOptions(json, 'name')				
			},
			{
				"label": "sql:",
				"name": "data_sources.sql",
				"type": "textarea"
			},
			{
				"label": "options:",
				"name": "data_sources.options",
				"type": "textarea"
			},
			{			
				"name": "data_sources.site_id",
				"type": "hidden",
				"default" : getCookie('siteId')
			}
		]
	} );

	$.fn.dataTable.ext.errMode = 'none';	

	var table = $('#data_sources')
		.on('error.dt', function(e, settings, techNote, message) {
			var msg = message.split('-')[1];
			errorMSG(msg);
			setPage(msg);
		})
		.DataTable( {
		dom: 'Bfrtip',
		ajax: 'admin/php/table.data_sources.php',
		columns: [
			{
				"data": "data_sources.name"
			},
			{
				"data": "data_sources.type"
			},
			{
				"data": "db_connectors.name"
			},
			{
				"data": "data_sources.sql"
			},
			{
				"data": "data_sources.options"
			},
			{
				"data": "data_sources.site_id",
				"visible" : false
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
	});
} );

}(jQuery));

