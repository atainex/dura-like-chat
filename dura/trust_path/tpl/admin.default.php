	<div data-role="page" id="page_admin" data-theme="a">
		<div data-role="header">
			<h1>Admin</h1>
		</div>
		<div data-role="content">
			<form method="post" action="">
				<fieldset data-role="controlgroup">
					<label for="name"><?php e(t("Admin ID")) ?></label>
					<input name="name" placeholder="<?php e(t("Admin ID")) ?>" value="" type="text" />
				</fieldset>
				<fieldset data-role="controlgroup">
					<label for="pass"><?php e(t("Password")) ?></label>
					<input name="pass" type="password" />
				</fieldset>
				<fieldset data-role="fieldcontain">
					<input name="login" value="<?php e(t("ENTER")) ?>" type="submit" />
				</fieldset>
				<input type="hidden" name="token" value="<?php echo $dura['token'] ?>" />
			</form>
		</div>
	</div>