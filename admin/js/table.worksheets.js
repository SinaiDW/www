
/*
 * Editor client script for DB table worksheets
 * Created by http://editor.datatables.net/generator
 */

(function($){

$(document).ready(function() {
	$.ajax({
		'url' : 'admin/php/getWorkbook.php',
		'data' : { 'id' : getCurrentPageData()['id']  },
		'type' : 'GET',
		'dataType' : 'JSON'
	}).success(function(json) {
		if(json.result == 'OK') {
			$('#workbookName').text(json.data.name);
		} else {
			errorMSG(JSON.error);
		}
	});
	
	$.ajax({
		'url' : 'admin/php/table.data_sources.php',
		'type' : 'GET',
		'dataType' : 'JSON'		
	}).success(function(json) {
		if(json.result == 'error'){
			errorMSG(json.error);
			setPage(json.error);
			return false;
		}
	var editor = new $.fn.dataTable.Editor( {
		ajax: { "url" : 'admin/php/table.worksheets.php',
				"data" : { 'id' : getCurrentPageData()['id'] }
		},
		table: '#worksheets',
		fields: [
			{
				"label": "Name:",
				"name": "worksheets.name"
			},
			{
				"label": "Data source:",
				"name": "worksheets.data_source_id",
				"type" : "select",
				"options" : parseJSONToOptions(json, 'data_sources.name')
			},
			{
				"label": "workbook_id:",
				"name": "worksheets.workbook_id",
				"type": "hidden",
				"default" : getCurrentPageData()['id'] 
			},
			{
				"label": "Options:",
				"name": "worksheets.options",
				"type": "textarea"
			},
			{ 	'name' : 'id',
				'type' : 'hidden',
				'default' : getCurrentPageData()['id'] 
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
				"data": "worksheets.name"
			},
			{
				"data": "data_sources.name"
			},
			{
				"data": "worksheets.options"
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
	} ); });
} );

}(jQuery));

