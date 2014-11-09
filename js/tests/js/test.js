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
	var rimd;

	module('Test methods', {
		setup: function () {
			rimd = new Rimd({
				className: 'rimd2',
				path: '/rimd/resimagecrop.php?image={path}&w={width}',
				widths: [-450, 300, 500, 505]
			});
		}
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

			attr = {0: {
				'src': '../../images/IMGP1463.jpg',
				'alt': 'Alt',
				'title': 'Title',
				'offsetHeight': 0,
				'offsetWidth': 0,
				'path': ''
			}};

		}
	});

	test('getImageAttributes', function(){
		var elem = rimd.t.legacyGetElementByClass('getImageAttributes');

		deepEqual(rimd.t.getImageAttributes(elem), attr);
	});
})();