<?php
include 'libs/autoloader.php';

use \Pstenstrm\RessImage;

// Collect parameters
$img = getParam('image');
$x = intval(getParam('x'));
$y = intval(getParam('y'));
$w = intval(getParam('w'));
$h = intval(getParam('h'));
$sc = getParam('sc');

$ri = new RessImage($img, $x, $y, $w, $h, $sc);

// Extracts parameters
function getParam($name) {
	if (isset($_GET[$name])) return htmlspecialchars($_GET[$name]);
	return '';
}