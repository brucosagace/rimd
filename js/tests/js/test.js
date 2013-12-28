var DEBUG = true;

(function(){
	var rimd, $rimd;

	module('Load image', {
		setup: function () {
			rimd = new Rimd({
				className: '.rimd',
				path: '/rimd/resimagecrop.php?image={path}&w={width}'
			});
			$rimd = $('#loadImage').find('.rimd');
		}
	});

	asyncTest('Asynchronous test: Holistic test', function(){
		expect(1);

		setTimeout(function() {
			ok($rimd.children('img').length, 'Image is loaded');

			start();
		}, 1000);
	});
})();

(function(){
	var rimd, destination, source, extended;

	module('Test methods', {
		setup: function () {
			rimd = new Rimd({
				className: 'rimd2',
				path: '/rimd/resimagecrop.php?image={path}&w={width}',
				widths: [-450, 300, 500, 505]
			});

			destination = {a:1,b:2,c:3};
			source      = {a:5,d:4};
			extended    = {a:5,b:2,c:3,d:4};
		}
	});

	test('getClosestValues', function(){
		equal(rimd.t.getClosestValues(rimd.options.widths, 435), 500);
	});

	test('extend', function(){
		deepEqual(rimd.t.extend(destination, source), extended);
	});

	test('legacyGetElementByClass', function(){
		equal(rimd.t.legacyGetElementByClass('legacyGetElementByClass').length, 1);
	});
})();

(function(){
	var rimd, attr;

	module('Test methods', {
		setup: function () {
			rimd = new Rimd({
				className: 'rimd3',
				path: ''
			});

			attr = {'src': 'path/to/img.jpg', 'alt': 'alt', 'title': 'title'};

		}
	});


	test('getImageAttributes', function(){
		var elem = rimd.t.legacyGetElementByClass('getImageAttributes');

		deepEqual(rimd.t.getImageAttributes(elem[0]), attr);
	});
})();