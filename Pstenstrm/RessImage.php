<?php
// Based on
// resimagecrop - version 0.0.2
// By Ian Devlin
// Twitter - @iandevlin
// Web - iandevlin.com

namespace Pstenstrm;

class RessImage {
	private $cachefile;

	public function __construct($img, $x, $y, $w, $h, $sc) {
		date_default_timezone_set('GMT');

		if ($img) {
			// Do a little prep to find the filename of the resized and scaled file, so we can test if it's cached
			$w ? $width = '-' . $w : $width = '';
			$h ? $height = 'x' . $h : $height = '';
			$x ? $xcrop = '-' . $x : $xcrop = '';
			$y ? $ycrop = 'x' . $y : $ycrop = '';
			$sc ? $scale = '-' . $sc : $scale = '';
			$pi = pathinfo($img);

			// Define the cachefile name
			$this->cachefile = 'temp/' . basename($img, '.' . $pi['extension']) . $width . $height . $xcrop . $ycrop . $scale . '.' . $pi['extension'];

			// Only accept jpg files
			$validMimeType = false;
			if(file_exists($this->cachefile)) {
				$validMimeType = ($this->getMimeType($this->cachefile) === 'image/jpeg');
			}

			if($validMimeType && $this->validateHeaders()) {
				
				// Browser cached file
				header('Last-Modified: ' . gmdate('D, d M Y H:i:s', filemtime($this->cachefile)) . ' GMT', true, 304);
				exit;

			} else if (!file_exists($this->cachefile)) {
				if($w) {
					$this->scaleJpegByWidth($img, $w);
				}
			}
		} else $this->headerNotFound();

		/*echo '<pre>';
		print_r(session_cache_limiter());
		echo "</pre><pre>";
    print_r(apache_request_headers());
    die('</pre>');*/

    // Return file
    session_cache_limiter('public');
		header('Last-Modified: '.gmdate('D, d M Y H:i:s', filemtime($this->cachefile)).' GMT', true, 200);
		header('Content-Type: image/jpg');
		readfile($this->cachefile);
	}

	private function scaleJpegByWidth($img, $w) {
		$i = $this->getNewJpeg($img);      
		// Get the dimensions of the original image
		$size = getimagesize($img);
		$origWidth = intval($size[0]);
		$origHeight = intval($size[1]);

		// If x, y, w, and h parameters have been passed...
		$h = $w * ($origHeight / $origWidth);
		$h = ~~$h; // Round down

		$ci = imagecreatetruecolor($w, $h);

		imagecopyresampled($ci, $i, 0, 0, 0, 0, $w, $h, $origWidth, $origHeight);
		
		// Create cache file
		imagejpeg($ci, $this->cachefile);
		// Tidy up
		imagedestroy($ci);
	}

	private function getNewJpeg($img) {
		if(!file_exists($img) || $this->getMimeType($img) !== 'image/jpeg') $this->headerNotFound();

		// Get a handle to the original image
		return imagecreatefromjpeg($img);  
	}

	private function headerNotFound() {
		header("HTTP/1.0 404 Not Found");
		exit;
	}

	private function validateHeaders() {
		// Getting headers sent by the client.
    $headers = apache_request_headers();

    return isset($headers['If-Modified-Since']) && (strtotime($headers['If-Modified-Since']) == filemtime($this->cachefile));
	}

	private function getMimeType($filename) {
		$finfo = new \finfo(FILEINFO_MIME_TYPE);
		$fileContents = file_get_contents($filename);
		$mimeType = $finfo->buffer($fileContents);

		return $mimeType;
	}

	public function __destruct() {}
}

/*else if ($x && $y && $w && $h) {
// Work out the x and y co-ordinates of the original image where the crop is to begin
$cx = ($origWidth * $x) / 100;
$cy = ($origHeight * $y) / 100;
// Create a new image with the required width and height
$ci = imagecreatetruecolor($w, $h);
// Crop the image
imagecopy($ci, $i, 0, 0, $cx, $cy, $origWidth, $origHeight);
$i = $ci;
}*/
// If scaling is required...
/*if ($sc) {
if (!$w) $w = $origWidth;
if (!$h) $h = $origHeight;
// Define the width and height of the new scaled image
$scw = $w * $sc;
$sch = $h * $sc;
// Scale the image
$sci = imagecreatetruecolor($scw, $sch);
imagecopyresampled($sci, isset($ci) ? $ci : $i, 0, 0, 0, 0, $scw, $sch, $w, $h);
$i = $sci;
}*/