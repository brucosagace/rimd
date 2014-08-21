/*!
 * 
 */

(function(){
	var
		win = window;
		doc = document;

	"use strict";

	var Rimd = function(params) {
		var 
			options = {},
			defaults = {
				className:      'rimd_img',
				widths:         ['320', '600', '1024'],
				heights:        ['320', '600', '1024'],
				path:           'resimagecrop.php?image={path}&w={width}&h={height}&r={retina}',
				reloadOnResize: false,
				lazyload:       false
			},
			test;

		options = extend(defaults, params);

		doImages();

		function doImages() {
			var 
				paths = [],
				images = getElementByClass(options.className),
				attr = getImageAttributes(images),
				resizeHandler, i;

			for (i in images) {
				if(images.hasOwnProperty(i) && i !== 'length') {
					parseImage(images[i], attr[i]);
				}
			}

			if(options.reloadOnResize) {
				resizeHandler = throttle(function () {
					var
						newAttr = getImageAttributes(images),
						i;

					for (i in images) {
						if(images.hasOwnProperty(i) && i !== 'length') {
							if(attr[i].path !== getImagePath(newAttr[i])) {
								parseImage(images[i], newAttr[i]);
							}
						}
					}

					attr = newAttr;
				});

				win.addEventListener('resize', resizeHandler);
			}
		}

		

		function parseImage(image, attr) {
			var 
				img = image.getElementsByTagName('img'),
				newImage;

			if(!attr.src || !attr.src[1]) return;

			if(img.length) {
				img[0].parentNode.removeChild(img[0]);
			}

			newImage = createNewImage(attr);

			if(!options.lazyload || isElementInViewport(image)) {
				image.appendChild(newImage);
			} else {
				lazyloadImage(image, newImage);
			}
		}

		function lazyloadImage (image, newImage) {
			var
				scrollHandler = throttle(function() {
					if(isElementInViewport(image)) {
						image.appendChild(newImage);

						win.removeEventListener('scroll', scrollHandler);
						win.removeEventListener('resize', resizeHandler);
					}
				}),
				resizeHandler = throttle(function() {
					image.dataset.top = image.getBoundingClientRect().top;
					scrollHandler();
				});

			win.addEventListener('scroll', scrollHandler); 
			win.addEventListener('resize', resizeHandler);
		}

		function createNewImage(attr) {
			var 
				img = doc.createElement('img');

			img.src = attr.path;

			if(attr.alt) img.alt = attr.alt;
			if(attr.title) img.title = attr.title;

			return img;
		}

		function getImagePath(attr) {
			return options.path.replace(/\{width\}|\{path\}|\{retina\}|\{height\}/g, function(match, tag, cha){
				return pathReplace(attr, match, tag, cha);
			});
		}

		function pathReplace(attr, match) {
			var
				devicePixelRatio = win.devicePixelRatio,
				multiplier = (devicePixelRatio > 1) ? 2 : 1;

			switch (match) {
				case '{path}':
					return attr.src;
				case '{width}':
					return getClosestValues(options.widths, attr.offsetWidth) * multiplier;
				case '{height}':
					return getClosestValues(options.heights, attr.offsetHeight) * multiplier;
				case '{retina}':
					return (devicePixelRatio > 1) ? 1 : 0;
			}
		}

		function getImageAttributes(images) {
			var 
				attr = {},
				data, key, i;

			for (i in images) {
				if(images.hasOwnProperty(i) && i !== 'length') {
					attr[i] = {};

					attr[i].offsetWidth = images[i].offsetWidth;
					attr[i].offsetHeight = images[i].offsetHeight;
					
					data = images[i].children[0].dataset;

					for(key in data) {
						if(data.hasOwnProperty(key)) {
							attr[i][key] = data[key];
						}
					}

					attr[i].path = getImagePath(attr[i]);
				}
			}

			return attr;
		}

		function getElementByClass(selector) {
			var 
				result = [];

			selector = selector.replace(/[.]/, '');

			if(doc.querySelectorAll) {
				result = doc.querySelectorAll('.' + selector);
			} else {
				result = legacyGetElementByClass(selector);
			}

			return result;
    }

    function legacyGetElementByClass(selector) {
			var 
				result = [],
				elems = doc.getElementsByTagName('*'),
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

		function throttle(fn, threshhold, context) {
			var 
				last, deferTimer;

			threshhold || (threshhold = 17); // ~ 1000 / 60

			return function() {
				var
					now = +new Date,
					args = arguments;

				context || (context = this);

				if (last && now < last + threshhold) {
					// hold on to it
					clearTimeout(deferTimer);
					deferTimer = setTimeout(function() {
						last = now;
						fn.apply(context, args);
					}, threshhold);
				} else {
					last = now;
					fn.apply(context, args);
				}
			};
		}

		function getClosestValues(stack, needle) {
			var
				i = 0,
				len, lowDiff, diff, result;

			if(!stack) return needle;

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

		function isElementInViewport(el) {
			var 
				top = el.dataset.top || el.getBoundingClientRect().top,
				docEl = doc.documentElement,
				isInViewport = top <= (win.pageYOffset || docEl.scrollTop)  - (docEl.clientTop || 0) + (win.innerHeight || docEl.clientHeight);

			if(!isInViewport && !el.dataset.top) {
				el.dataset.top = top;
			}

			return isInViewport;
		}

		// UglifyJS will discard any code within an if (DEBUG) clause
		if (DEBUG) {
			test = {
				// Expose private methods to QUnit
				'getClosestValues': getClosestValues,
				'extend': extend,
				'legacyGetElementByClass': legacyGetElementByClass,
				'getImageAttributes': getImageAttributes
			};
		}

		return {
			options: options,
			t: test
		};
	};

	win.Rimd = Rimd;
})();
