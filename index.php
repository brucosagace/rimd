<?php
	# Install PSR-0-compatible class autoloader
	spl_autoload_register(function($class){
		require preg_replace('{\\\\|_(?!.*\\\\)}', DIRECTORY_SEPARATOR, ltrim($class, '\\')).'.php';
	});

	# Get Rimd class
	use \Per\Rimd;

	# Read file and pass content through the Markdown praser
	$text = file_get_contents('Readme.md');
	$html = Rimd::defaultTransform($text);
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Rimd</title>
	<link rel="stylesheet" type="text/css" href="css/rimd.css">
</head>
<body>
	<?php echo $html; ?>
	<script type="text/javascript" src="js/rimd.js"></script>
</body>
</html>