Rimd
============

Rimd 0.1.0 - 9 Nov 2014

Introduction
------------

Usage
-----

Works with IE8+

### Markup

```html
<div class="rimd">
	<noscript data-src="path/to/image.jpg" data-alt="">
		<img src="path/to/image.jpg" alt="">
	</noscript>
</div>
```

### Options

```javascript
defaults = {

	/**
	 * className, classname of the rimd element
	 * @type {String}
	 */
	className:      'rimd',

	/**
	 * nodeList, list of rimd elements to load, takes presedence over className if not empty
	 * @type {Array}
	 */
	nodeList:       [],
	
	/**
	 * [widths description]
	 * @type {Array}
	 */
	widths:         ['320', '600', '1024'],

	/**
	 * [heights description]
	 * @type {Array}
	 */
	heights:        ['320', '600', '1024'],

	/**
	 * Path pattern of the image storage
	 * @type {String}
	 */
	path:           'resimage/?image={path}&w={width}&w={width}&r={retina}',

	/**
	 * Re-evaluate the image on window resize. If a breakpoint is passed the new image will load
	 * @type {Boolean}
	 */
	reloadOnResize: false,

	/**
	 * Lazyload images when scrolled in to view
	 * @type {Boolean}
	 */
	lazyload:       false,

	/**
	 * [closestAbove description]
	 * @type {Boolean}
	 */
	closestAbove:   false,

	/**
	 * [centerImage description]
	 * @type {Boolean}
	 */
	centerImage:    false
};
```

### options.path

Meaning of the path `resimage/?image={path}&w={width}&w={width}&r={retina}`

```
// The src of the original image
{path}

// The calculated width
{width}

// The calculated height
{height}

// If the device has a retina display: 1 for true, 0 for false
{retina}
```

### Methods

```javascript
update();
addImages(nodeList);
destruct();
```

Contribute
----------

Install dependencies:

```bash
$ npm install
```

Run jshint file watcher:

```bash
$ gulp
```

Build `rimd.min.js`:

```bash
$ gulp build
```

Make sure tests are passing:

```bash
$ npm test
```