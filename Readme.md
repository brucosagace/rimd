Rimd
============

Rimd 0.1.0 - 9 Nov 2014

Introduction
------------

Usage
-----

### Options

```js
defaults = {
	nodeList:       [],
	className:      'rimd',
	widths:         ['320', '600', '1024'],
	heights:        ['320', '600', '1024'],
	path:           'resimage/?image={path}&w={width}',
	reloadOnResize: false,
	lazyload:       false,
	closestAbove:   false,
	centerImage:    false
};
```

Contribute
----------

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