<?php

include_once("db.php");

$user = getUser($_GET);

$pwd = getLocalAuth([ 'user_id' => $_GET['id']]);


?>

<h6>Reset Password</h6>

<h4><?php echo $user['name'] ?></h4>

<div class="col-xs-12">
<form>
<input type="hidden" name="user_id" value="<?php echo $user['id']; ?>" model="reset">
<div class="form-group row">
	<label for="usernameInput">Username:</label>
	<div class="col-xs-12">
	<input type="text" name="username" model="reset" id="usernameInput" maxlength="30" placeholder="Username" 
	value="<?php if(! is_null($pwd)) { echo $pwd['username']; } ?>">
	</div>
</div>
<div class="form-group row">
	<label for="passwordInput">Password:</label>
	<div class="col-xs-12">
	<input type="password" name="password" model="reset" id="passwordInput" maxlength="30">
	</div>
</div>
<div class="form-group row">
	<label for="passwordInput2">Re-enter password:</label>	
	<div class="col-xs-12">
	<input type="password" name="password2" model="reset" id="passwordInput2" maxlength="30">
	</div>
</div>
<div class="form-group row">
	<label for="changePasswordInput">Make user reset password:</label>	
	<input type="checkbox" name="change_password" model="reset" id="changePasswordInput" checked value="Y">
</div>

<div class="form-group row">
	<div class="col-xs-12">
	<button onclick="changePassword()"><i class="fa fa-check"></i>  Reset</button>
	</div>
</div>
</form>	
</div>

<script>

function changePassword() {
	var data = getInputValues('reset');;
	alert(JSON.stringify(data));
	$.ajax({
		'url' : 'db/changePassword.php',
		'data' : data,
		'type' : 'POST',
		'dataType' : 'json'
	}).success(function(json) {
		
	});
}

</script>