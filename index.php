<?php
	include 'libs/autoloader.php';

	# Get modified Markdown
	use \Pstenstrm\Markdown;

	# Read file and pass content through the Markdown praser
	$text = file_get_contents('Readme.md');
	$html = Markdown::defaultTransform($text);
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
	<script type="text/javascript" src="js/example.js"></script>
</body>
</html>