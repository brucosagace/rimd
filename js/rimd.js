(function(){
	"use strict";

	var Rimd = function(params){
		var test, options = {};

		init(params);

		function init(params){
			var defaults = {
				className: 'rimd_img',
				widths:    ['320', '600', '1024'],
				path:      'resimagecrop.php?image={path}&w={width}&dpi={dpi}'
			};

			options = extend(defaults, params);

			doImages();
		}

		function doImages() {
			var i, images = getElementByClass(options.className);

			// Batch width checks to minimize the impact of forced reflow
			options.windowWidth = window.innerWidth;
			for (i in images) {
				if(images.hasOwnProperty(i) && i !== 'length')
					images[i].tmpWidth = images[i].offsetWidth;
			}

			i = null;

			for (i in images) {
				if(images.hasOwnProperty(i) && i !== 'length') parseImage(images[i]);
			}
		}

		function parseImage(image) {
			var attr = getImageAttributes(image),
			    newImage, width;
			
			if(!attr.src || !attr.src[1]) return;

			attr.offsetWidth = image.tmpWidth;

			newImage = createNewImage(attr);

			image.appendChild(newImage);
		}

		function createNewImage(attr) {
			var img = document.createElement('img');

			img.src = options.path.replace(/\{width\}|\{path\}|\{dpi\}/g, function(match, tag, cha){
				return pathReplace(attr, match, tag, cha);
			});

			if(attr.alt && attr.alt[1]) img.alt = attr.alt[1];
			if(attr.title && attr.title[1]) img.title = attr.title[1];

			return img;
		}

		function pathReplace(attr, match) {

			switch (match) {
				case '{path}':
					return attr.src[1];
				case '{width}':
					return getClosestValues(options.widths, attr.offsetWidth);
				case '{dpi}':
					return getDpi();
			}
		}

		function getImageAttributes(image) {
			var noscript = image.children[0],
			    content  = noscript.textContent || noscript.innerHTML,
			    srcRex   = /<img[^>]+src="([^">]+)/g,
			    altRex   = /<img[^>]+alt="([^">]+)/g,
			    titleRex = /<img[^>]+title="([^">]+)/g,
			    result   = {};
			
			result.src = srcRex.exec(content);
			result.alt = altRex.exec(content);
			result.title = titleRex.exec(content);

			return result;
		}

		function getElementByClass(selector) {
			var result = [];

			selector = selector.replace(/[.]/, '');

			if(document.querySelectorAll) {
				result = document.querySelectorAll('.' + selector);
			} else {
				result = legacyGetElementByClass(selector);
			}

			return result;
		}

		function legacyGetElementByClass(selector) {
			var result = [],
			    elems = document.getElementsByTagName('*'),
			    i;

			for (i in elems) {
				if((' ' + elems[i].className + ' ').indexOf(' ' + selector + ' ') > -1) {
					result.push(elems[i]);
				}
			}

			return result;
		}

		function extend(destination, source) {
			for (var property in source) {
				if(source.hasOwnProperty(property)) destination[property] = source[property];
			}

			return destination;
		}

		function getClosestValues (stack, needle) {
			var lowDiff, diff, result,
			    i   = 0,
			    len = stack.length;

			for (; i < len; i++) {
				diff = stack[i] - needle;
				// Turn all values positive
				diff = (diff < 0) ? ~diff : diff;
				if(lowDiff === undefined || lowDiff > diff) {
					lowDiff = diff;
					result = stack[i];
				}
			}

			return result;
		}

		function getDpi() {
			
		}

		// UglifyJS will discard any code within an if (DEBUG) clause
		if (DEBUG) {
			test = {
				// Expose private methods to QUnit
				'getClosestValues': getClosestValues
			};
		}

		return {
			options: options,
			t: test
		};
	};

	window.Rimd = Rimd;
})();
