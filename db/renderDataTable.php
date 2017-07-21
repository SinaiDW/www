<script>

$(document).ready(function() {	
	var table = 
	$('#tableOut').DataTable( {
		buttons: [
			'excel'
		],
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
			'excel'
		]
	} );
});

</script>
<div class="dataTables">
	<div class="container">
		<h3>
			Sites
		</h3>
		<table cellpadding="0" cellspacing="0" border="0" class="display" id="tableOut" width="100%">
			<thead>
				<tr>
					<th>Name</th>
				</tr>
			</thead>
		</table>
	</div>
</div>