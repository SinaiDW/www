
/*
 * Editor client script for DB table workbooks
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
		ajax: '/admin/php/table.user_groups.php',
		table: '#user_groups',
		fields: [
			{
				"label": "Site",				
				"name": "user_groups.site_id",
				"type": "select",
				"options": parseJSONToOptions(json, 'name')
			},
			{
				"label": "Name",
				"name": "user_groups.name",
			}
		]
	} );
	$.fn.dataTable.ext.errMode = 'none';
	var table = $('#user_groups')
		.on('error.dt', function(e, settings, techNote, message){
			alert(e + settings + techNote + message);
		})
		.DataTable( {
		dom: 'Bfrtip',
		ajax: '/admin/php/table.user_groups.php',
		columns: [
			{
				"data": "sites.name"
			},
			{
				"data": "user_groups.name"
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
});	
}(jQuery));


