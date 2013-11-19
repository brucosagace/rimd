<?php
// resimagecrop - version 0.0.2
// RESS based solution for cropping images for responsive design
// Most definitely a work in progress!

// Author - Ian Devlin
// Twitter - @iandevlin
// Web - iandevlin.com

// $image - the original image
// $x - the x position to begin the crop from (percentage)
// $y - the y position to begin the crop from (percentage)
// $w - the width of the amount to crop (pixels)
// $h - the height of the amount to crop (pixels)
// $sc - the scale factor (decimal)
//
// For example
// resimagecrop.php?image=img/image-to-use.jpg&x=15&y=20&w=550&h=450&sc=0.5
// begins the crop of img/image-to-use.jpg at 15% from the top and 20% from the left and will crop a width of 550x450 and then scale it by 0.5 (resulting image is 275x225)
//
namespace Pstenstrm;

class RessImage {
	private $cachefile;

	public function __construct($img, $x, $y, $w, $h, $sc) {
		
		if ($img) {
			// Do a little prep to find the filename of the resized and scaled file, so we can test if it's cached
			$w ? $width = '-' . $w : $width = '';
			$h ? $height = 'x' . $h : $height = '';
			$x ? $xcrop = '-' . $x : $xcrop = '';
			$y ? $ycrop = 'x' . $y : $ycrop = '';
			$sc ? $scale = '-' . $sc : $scale = '';
			$pi = pathinfo($img);

			// Define the cachefile
			$this->cachefile = 'temp/' . basename($img, '.' . $pi['extension']) . $width . $height . $xcrop . $ycrop . $scale . '.' . $pi['extension'];

			if (!file_exists($this->cachefile)) {
				if($w) {
					$this->scaleJpegByWidth($img, $w);
				}
			} else {
				if(!$this->isJpeg($this->cachefile)) $this->headerNotFound();
			}
		}

		// TODO: Set "last update" header for caching
		// Return file
		//header('Content-Disposition: attachment; filename=' . $img);
		
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

		$i = $ci;
		
		// Create cache file
		imagejpeg($i, $this->cachefile);
		// Tidy up
		if(isset($i)) imagedestroy($i);
	}

	private function getNewJpeg($img) {
		if(!file_exists($img) && !$this->isJpeg($img)) $this->headerNotFound();

		// Get a handle to the original image
		return imagecreatefromjpeg($img);  
	}

	private function isJpeg($img) {
		$ext = pathinfo($img, PATHINFO_EXTENSION);

		return ($ext == 'jpg');
	}

	private function headerNotFound() {
		header("HTTP/1.0 404 Not Found");
		exit;
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