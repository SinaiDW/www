<div class="col-xs-12">
<?php

include_once( "./db.php");

if(! isset($_COOKIE) && ! isset($_COOKIE['siteId'])) {
	echo '<div class="col-xs-12">Please select a site</div>';
	die ();	
}

$user = getUser([ 'id' => $_GET['id'] ]);

echo '<div>' . $user['name'] . '</div>';
echo '<div>' . $user['status'] . '</div>';
echo '<div>' . $user['email'] . '</div>';

$membership = sql(
	[ 	'query' => 'select user_groups.name, group_members.id from `group_members` join `user_groups` on group_members.group_id = user_groups.id where group_members.user_id = :id and user_groups.site_id = :siteId',
		'params' => [
			[	'name' => ':id',
				'val' => $_GET['id'],
				'type' => PDO::PARAM_INT
			],
			[	'name' => ':siteId',
				'val' => $_COOKIE['siteId'],
				'type' => PDO::PARAM_INT
			]
		],
		'data' => 'set'
	]
);

$newGroup = sql(
	[ 	'query' => 'select name, id from user_groups where site_id = :siteId and id not in '.
			'(select group_id from group_members where user_id = :id)',
		'params' => [
			[	'name' => ':id',
				'val' => $_GET['id'],
				'type' => PDO::PARAM_INT
			],
			[	'name' => ':siteId',
				'val' => $_COOKIE['siteId'],
				'type' => PDO::PARAM_INT
			]
		],
		'data' => 'set'
	]
);

?>
	<hr>
	<div><h4>Current Groups for site: <?php echo $_COOKIE['siteName'] ?></h4>
		<table>
		<?php 
			foreach($membership as $rec) {
				echo '<tr><td>' . $rec['name'] . ' <td><td style="padding-left:10px;"> <i class="fa fa-trash" onclick="removeGroup('. $rec['id'].
				')"></i> </td></tr>';
			}			
		?>
		</table>
	</div>
	<div><h4>Add group</h4>
		<input type="hidden" name="user_id" value="<?php echo $_GET['id']; ?>" model="group">
		<select name="group_id" model="group">
		<?php 		
			foreach($newGroup as $rec) {
				echo '<option value="' . $rec['id'] . '">'. $rec['name']. '</option>';
			}
		?>			
		</select> <button onclick="addGroup()">Add</button>
	</div>

</div>
</div>

<script>

function addGroup() {
	var data = getInputValues('group');
	$.ajax({
		'url' : 'db/addGroupToUser.php',
		'dataType' : 'json',
		'data' : data,
		'type' : 'POST'
	}).success(function(json) {
		if(json.result== 'OK') {
			loadPage('db/setGroupsForUser.php?id=' +  <?php echo $_GET['id'] ?>);
		} else {
			errorMSG(json.error)
		}
	});
}

</script>
