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
			var images = getElementByClass(options.className);

			images = images;
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

			console.log(result);
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