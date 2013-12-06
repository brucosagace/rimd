<?php
include 'Pstenstrm/RessImage.php';

use \Pstenstrm\RessImage;

// Collect parameters
$img = getParam('image');
$x = intval(getParam('x'));
$y = intval(getParam('y'));
$w = intval(getParam('w'));
$h = intval(getParam('h'));
$sc = getParam('sc');
$dpi = getParam('dpi');

$ri = new RessImage($img, $x, $y, $w, $h, $sc, $dpi);

// Extracts parameters
function getParam($name) {
	if (isset($_GET[$name])) return htmlspecialchars($_GET[$name], ENT_QUOTES, 'UTF-8');
	return '';
}