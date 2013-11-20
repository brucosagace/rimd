PHP Rimd
============

PHP Rimd Lib 0.0.4 - 12 Nov 2013

extens PHP Markdown Lib 1.3 - 11 Apr 2013  
by Michel Fortin  
<http://michelf.ca/>


Bild på Pirru 
![Pirru](images/IMGP1463.jpg)

Introduction
------------

This is a library package that includes the PHP Markdown parser and its 
sibling PHP Markdown Extra which additional features.

Markdown is a text-to-HTML conversion tool for web writers. Markdown
allows you to write using an easy-to-read, easy-to-write plain text
format, then convert it to structurally valid XHTML (or HTML).

"Markdown" is two things: a plain text markup syntax, and a software 
tool, written in Perl, that converts the plain text markup to HTML. 
PHP Markdown is a port to PHP of the original Markdown program by 
John Gruber.

Full documentation of Markdown's syntax is available on John's 
Markdown page: <http://daringfireball.net/projects/markdown/>


Requirement
-----------

This library package requires PHP 5.3 or later.

This library requires but does not include PHP Markdown Lib 1.3 by Michel Fortin. 


Usage
-----

This library package is meant to be used with class autoloading. For autoloading 
to work, your project needs have setup a PSR-0-compatible autoloader. See the 
included Readme.php file for a minimal autoloader setup. (If you don't want to 
use autoloading you can do a classic `require_once` to manually include the 
files prior use instead.)

With class autoloading in place, putting the 'Michelf' folder in your 
include path should be enough for this to work:

	use \Michelf\Markdown;
	$my_html = Markdown::defaultTransform($my_text);

Markdown Extra syntax is also available the same way:

	use \Michelf\MarkdownExtra;
	$my_html = MarkdownExtra::defaultTransform($my_text);

If you wish to use PHP Markdown with another text filter function 
built to parse HTML, you should filter the text *after* the `transform`
function call. This is an example with [PHP SmartyPants][psp]:

	use \Michelf\Markdown, \Michelf\SmartyPants;
	$my_html = Markdown::defaultTransform($my_text);
	$my_html = SmartyPants::defaultTransform($my_html);

All these examples are using the static `defaultTransform` static function 
found inside the parser class. If you want to customize the parser 
configuration, you can also instantiate it directly and change some 
configuration variables:

	use \Michelf\MarkdownExtra;
	$parser = new MarkdownExtra;
	$parser->fn_id_prefix = "post22-";
	$my_html = $parser->transform($my_text);

To learn more, see the full list of [configuration variables].

 [configuration variables]: http://michelf.ca/projects/php-markdown/configuration/


Copyright and License
---------------------

Copyright (c) 2013 Per Stenström  
All rights reserved.

Extends PHP Markdown Lib  
Copyright (c) 2004-2013 Michel Fortin  
http://michelf.ca/  
All rights reserved.

Based on Markdown  
Copyright (c) 2003-2005 John Gruber  
http://daringfireball.net/  
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

3. Neither the name "Markdown" nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.