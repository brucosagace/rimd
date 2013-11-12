(function(){
	"use strict";

	var Rimd = function(params){
		var options = {};

		init(params);

		function init(params){
			var defaults = {
				className: 'rimd_img',
				widths:    ['320', '600', '1024'],
				path:      'resize.php/{path}/{src}?width={width}'
			};

			options = extend(defaults, params);

			doImages();
		}

		function doImages() {
			var i, images = getElementByClass(options.className);

			for (i in images) {
				if(images.hasOwnProperty(i)) parseImage(images[i]);
			}
		}

		function parseImage(image) {
			var attr = getImageAttributes(image),
			    newImage;
			
			if(!attr.src || !attr.src[1]) return;
			
			newImage = createNewImage(attr);

			image.appendChild(newImage);
		}

		function createNewImage(attr) {
			var img = document.createElement('img');

			img.src = attr.src[1];

			if(attr.alt && attr.alt[1]) img.alt = attr.alt[1];
			if(attr.title && attr.title[1]) img.title = attr.title[1];

			return img;
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

		return {
			options: options
		};
	};

	window.Rimd = Rimd;
})();
