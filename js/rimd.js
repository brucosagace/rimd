/*!
 * 
 */

(function(win, doc) {
	"use strict";

	var
		Rimd,
		singleImage;

	/* window.addEventListener polyfill */
	!win.addEventListener && (function (WindowPrototype, DocumentPrototype, ElementPrototype, addEventListener, removeEventListener, dispatchEvent, registry) {
		WindowPrototype[addEventListener] = DocumentPrototype[addEventListener] = ElementPrototype[addEventListener] = function (type, listener) {
			var 
				target = this;

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
				var 
					index = 0,
					register;

			for (index; register == registry[index]; ++index) {
				if (register[0] == this && register[1] == type && register[2] == listener) {
					return this.detachEvent("on" + type, registry.splice(index, 1)[0][3]);
				}
			}
		};

		WindowPrototype[dispatchEvent] = DocumentPrototype[dispatchEvent] = ElementPrototype[dispatchEvent] = function (eventObject) {
			return this.fireEvent("on" + eventObject.type, eventObject);
		};
	})(Window.prototype, HTMLDocument.prototype, Element.prototype, "addEventListener", "removeEventListener", "dispatchEvent", []);

	singleImage = function(elem, attr, lazyload, centerImage) {
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

			if(centerImage) {
				if(attr.width) {
					img.style.left = "50%";
					img.style.marginLeft = -attr.width / 2 + "px";
				}

				if(attr.height) {
					img.style.top = "50%";
					img.style.marginTop = -attr.height / 2 + "px";
				}
			}

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

		function destruct () {
			removeListeners();

			if(img && img.parentNode) {
				img.parentNode.removeChild(img);
			}

			img = null;
		}

		return {
			removeListeners: removeListeners,
			updateImage: updateImage,
			destruct: destruct
		};
	};

	Rimd = function(params) {
		var 
			options = {},
			defaults = {
				nodeList:       [],
				className:      'rimd_img',
				widths:         ['320', '600', '1024'],
				heights:        ['320', '600', '1024'],
				path:           'resimagecrop.php?image={path}&w={width}&h={height}&r={retina}',
				reloadOnResize: false,
				lazyload:       false,
				closestAbove:   false,
				centerImage:    false
			},
			images = [],
			elems = [],
			attr = [],
			nodeList, resizeHandler, test;

		options = extend(defaults, params);
		options.pathHasGet = options.path.split('?').length > 1;

		if(options.nodeList.length) {
			nodeList = options.nodeList;
		} else {
			nodeList = getElementByClass(options.className);
		}
		
		addImages(nodeList);
		nodeList = null;

		if(options.reloadOnResize) {
			resizeHandler = throttle(function () {
				var
					newAttr = getImageAttributes(elems),
					i = 0,
					len = elems.length;

				for (; i < len; i++) {
					if(attr[i].path !== getImagePath(newAttr[i])) {
						images[i].updateImage(newAttr[i]);
					}
				}

				attr = newAttr;
			});

			win.addEventListener('resize', resizeHandler);
		}

		function addImages(nodeList) {
			var
				attributes = getImageAttributes(nodeList),
				len = nodeList.length,
				i = 0;

			for (;i < len; i++) {
				images.push(singleImage(nodeList[i], attributes[i], options.lazyload, options.centerImage));
				elems.push(nodeList[i]);
				attr.push(attributes[i]);
			}
		}

		function getImagePath(attr) {
			var 
				parts = attr.src.split('?'),
				get = parts[1],
				newPath;

			attr.path = parts[0];

			newPath = options.path.replace(/\{width\}|\{path\}|\{retina\}|\{height\}/g, function(match, tag, cha){
				return pathReplace(attr, match, tag, cha);
			});

			if(get) {
				if(options.pathHasGet) {
					newPath += '&' + get;
				} else {
					newPath += '?' + get;
				}
			}

			attr.path = newPath;
			return newPath;
		}

		function pathReplace(attr, match) {
			var
				tmp;

			switch (match) {
				case '{path}':
					return attr.path;
				case '{width}':
					tmp = getClosestValues(options.widths, attr.offsetWidth) * ((win.devicePixelRatio > 1) ? 2 : 1);

					attr.width = tmp;

					return tmp;
				case '{height}':
					tmp = getClosestValues(options.heights, attr.offsetHeight) * ((win.devicePixelRatio > 1) ? 2 : 1);

					attr.height = tmp;

					return tmp;
				case '{retina}':
					return (win.devicePixelRatio > 1) ? 1 : 0;
			}
		}

		function getImageAttributes(images) {
			var 
				attr = [],
				len = images.length,
				i = 0,
				data = {},
				noscript,
				key;

			for (; i < len; i++) {
				attr[i] = {};

				attr[i].offsetWidth = images[i].offsetWidth;
				attr[i].offsetHeight = images[i].offsetHeight;

				noscript = images[i].getElementsByTagName('noscript')[0];

				data = (noscript.dataset) ? noscript.dataset : getDataAttr(noscript);

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
				attr,
				len, 
				key;

			if(typeof el === 'undefined' || !('attributes' in el)) return data;

			attr = el.attributes;
			len = attr.length;
			
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
			result = stack[len - 1];

			for (; i < len; i++) {
				diff = stack[i] - needle;
				// Turn all values positive
				if(!options.closestAbove) {
					diff = (diff < 0) ? ~diff : diff;
				} else if (diff < 0) continue;

				if(lowDiff === undefined || lowDiff > diff) {
					lowDiff = diff;
					result = stack[i];
				}
			}

			return result;
		}

		function destruct () {
			var
				i = 0,
				len = images.length;

			if(options.reloadOnResize) {
				win.removeEventListener('resize', resizeHandler);
			}

			for (;i < len; i++) {
				images[i].destruct();
			}

			images = null;
			elems = null;
			attr = null;
		}

		test = {
			getClosestValues: getClosestValues,
			getImageAttributes: getImageAttributes,
			legacyGetElementByClass: legacyGetElementByClass,
			extend: extend
		};

		return {
			destruct: destruct,
			options: options,
			update: resizeHandler,
			addImages: addImages,
			t: test
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
