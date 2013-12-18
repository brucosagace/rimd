PHP Rimd
============

PHP Rimd Lib 0.0.5 - 12 Nov 2013

extens PHP Markdown Lib 1.3 - 11 Apr 2013  
by Michel Fortin  
<http://michelf.ca/>


Bild på Pirru 
![Pirru](images/IMGP1463.jpg)

Introduction
------------

PHP Markdown is a port to PHP of the original Markdown program by 
John Gruber.

This is an extension of that library to allow for responsive iamges. It uses the standard Markdown syntax for images.

Full documentation of Markdown's syntax is available on John's 
Markdown page: <http://daringfireball.net/projects/markdown/>

Usage
-----

### Options

<table>
	<thead>
		<tr>
			<th>Setting</th>
			<th>Values</th>
			<th>Default</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>className</td>
			<td>string</td>
			<td>rimd_img</td>
			<td>Image class. The class name of the Rimd image wrapper.</td>
		</tr>
		<tr>
			<td>path</td>
			<td>url template</td>
			<td>resimagecrop.php?image={path}&w={width}&r={retina}</td>
			<td>Image path. How to format the img src attribute</td>
		</tr>
		<tr>
			<td>widths</td>
			<td>Array(int, int, int)</td>
			<td>[320, 600, 1024]</td>
			<td>Image widths. The closest value to the images parent elements width will be set as {width}. More values will result in more images cached on the server.</th>
		</tr>
		<tr>
			<td>retina</td>
			<td>boolean</td>
			<td>
				1 for retina devices
				0 for non-retina devices
			</td>
			<td>Load retina image. This value will be set as {retina}. Set this value to force retina/non-retina images for all devices. This will halve the amount of images that needs to be cached.</td>
		</tr>
	</tbody>
</table>