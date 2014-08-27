/*!
 * 
 */

(function(win, doc) {
	"use strict";

	var
		Rimd,
		Img;

	/* window.addEventListener polyfill */
	!win.addEventListener && (function (WindowPrototype, DocumentPrototype, ElementPrototype, addEventListener, removeEventListener, dispatchEvent, registry) {
		WindowPrototype[addEventListener] = DocumentPrototype[addEventListener] = ElementPrototype[addEventListener] = function (type, listener) {
			var target = this;

			registry.unshift([target, type, listener, function (event) {
				event.currentTarget = target;
				event.preventDefault = function () { event.returnValue = false; };
				event.stopPropagation = function () { event.cancelBubble = true; };
				event.target = event.srcElement || target;

				listener.call(target, event);
			}]);

			this.attachEvent("on" + type, registry[0][3]);
		};

		WindowPrototype[removeEventListener] = DocumentPrototype[removeEventListener] = ElementPrototype[removeEventListener] = function (type, listener) {
			for (var index = 0, register; register = registry[index]; ++index) {
				if (register[0] == this && register[1] == type && register[2] == listener) {
					return this.detachEvent("on" + type, registry.splice(index, 1)[0][3]);
				}
			}
		};

		WindowPrototype[dispatchEvent] = DocumentPrototype[dispatchEvent] = ElementPrototype[dispatchEvent] = function (eventObject) {
			return this.fireEvent("on" + eventObject.type, eventObject);
		};
	})(Window.prototype, HTMLDocument.prototype, Element.prototype, "addEventListener", "removeEventListener", "dispatchEvent", []);

	Img = function(elem, attr, lazyload) {
		var
			scrollHandler = throttle(function() {
				if(isElementInViewport(elem)) {
					elem.appendChild(img);

					removeListeners();
				}
			}),
			resizeHandler = throttle(function() {
				if(typeof elem.dataset !== 'undefined') {
					elem.dataset.top = elem.getBoundingClientRect().top;
				}

				scrollHandler();
			}),
			img;

		updateImage(attr);

		function updateImage(attr) {
			if(!attr.path) return;

			if(img && img.parentNode) {
				img.parentNode.removeChild(img);
			}

			img = doc.createElement('img');

			img.src = attr.path;
			if(attr.alt) img.alt = attr.alt;
			if(attr.title) img.title = attr.title;

			if(!lazyload || isElementInViewport(elem)) {
				elem.appendChild(img);
			} else {
				removeListeners();
				win.addEventListener('scroll', scrollHandler); 
				win.addEventListener('resize', resizeHandler);
			}
		}

		function isElementInViewport(el) {
			var 
				top = (el.dataset && el.dataset.top) ? el.dataset.top : el.getBoundingClientRect().top,
				docEl = doc.documentElement,
				isInViewport = top <= (win.pageYOffset || docEl.scrollTop)  - (docEl.clientTop || 0) + (win.innerHeight || docEl.clientHeight);

			if(!isInViewport && el.dataset && !el.dataset.top) {
				el.dataset.top = top;
			}

			return isInViewport;
		}

		function removeListeners() {
			win.removeEventListener('scroll', scrollHandler);
			win.removeEventListener('resize', resizeHandler);
		}

		return {
			'removeListeners': removeListeners,
			'updateImage': updateImage
		};
	};

	Rimd = function(params) {
		var 
			options = {},
			defaults = {
				className:      'rimd_img',
				widths:         ['320', '600', '1024'],
				heights:        ['320', '600', '1024'],
				path:           'resimagecrop.php?image={path}&w={width}&h={height}&r={retina}&fx={fx}',
				reloadOnResize: false,
				lazyload:       false,
				closestAbove:   false
			},
			images = [],
			i = 0,
			elems, attr, resizeHandler, len;

		options = extend(defaults, params);

		elems = getElementByClass(options.className),
		attr = getImageAttributes(elems);

		len = elems.length;
		for (;i < len; i++) {
			images.push(new Img(elems[i], attr[i], options.lazyload));
		}

		if(options.reloadOnResize) {
			resizeHandler = throttle(function () {
				var
					newAttr = getImageAttributes(elems),
					i = 0;

				for (; i < len; i++) {
					if(attr[i].path !== getImagePath(newAttr[i])) {
						images[i].updateImage(newAttr[i]);
					}
				}

				attr = newAttr;
			});

			win.addEventListener('resize', resizeHandler);
		}

		function getImagePath(attr) {
			return options.path.replace(/\{width\}|\{path\}|\{retina\}|\{height\}|\{fx\}/g, function(match, tag, cha){
				return pathReplace(attr, match, tag, cha);
			});
		}

		function pathReplace(attr, match) {
			switch (match) {
				case '{path}':
					return attr.src;
				case '{fx}':
					return attr.fx;
				case '{width}':
					return getClosestValues(options.widths, attr.offsetWidth) * ((win.devicePixelRatio > 1) ? 2 : 1);
				case '{height}':
					return getClosestValues(options.heights, attr.offsetHeight) * ((win.devicePixelRatio > 1) ? 2 : 1);
				case '{retina}':
					return (win.devicePixelRatio > 1) ? 1 : 0;
			}
		}

		function getImageAttributes(images) {
			var 
				attr = {},
				len = images.length,
				i = 0,
				data = {},
				key;

			for (; i < len; i++) {
				attr[i] = {};

				attr[i].offsetWidth = images[i].offsetWidth;
				attr[i].offsetHeight = images[i].offsetHeight;

				data = images[i].children[0].dataset || getDataAttr(images[i].children[0]);

				for(key in data) {
					/* Android DOMStringMap has no method "hasOwnProperty()" */
					attr[i][key] = data[key];
				}

				attr[i].path = getImagePath(attr[i]);
			}

			return attr;
		}

		/*
		 * el.dataset fallback for IE8
		 */
		function getDataAttr(el) {
			var 
				data = {},
				i = 0,
				attr = el.attributes,
				len = attr.length, 
				key;
			
			for(; i < len; i++) {
				if (/^data-/.test(attr[i].name)) {
						key = attr[i].name.substr(5).replace(/-(.)/g);
					data[key] = attr[i].value;
				}
			}

			return data;
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

		function getClosestValues(stack, needle) {
			var
				i = 0,
				len, lowDiff, diff, result;

			if(!stack) return needle;

			len = stack.length;

			for (; i < len; i++) {
				diff = stack[i] - needle;
				
				if(!options.closestAbove) {
					// Turn all values positive
					diff = (diff < 0) ? ~diff : diff;
				} else if (diff < 0) continue;

				if(lowDiff === undefined || lowDiff > diff) {
					lowDiff = diff;
					result = stack[i];
				}
			}

			return result;
		}

		return {
			options: options
		};
	};

	function extend(destination, source) {
		for (var property in source) {
			if(source.hasOwnProperty(property)) destination[property] = source[property];
		}

		return destination;
	}

	function throttle(fn, threshhold, context) {
		var 
			last, deferTimer;

		threshhold = threshhold || 17; // ~ 1000 / 60

		return function() {
			var
				now = new Date(),
				args = arguments;

			context = context || this;

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

	win.Rimd = Rimd;
})(this, this.document);
