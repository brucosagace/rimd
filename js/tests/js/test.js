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

	test('is loaded', function(){
		equal($rimd.children('img').length, 1, 'Image is loaded');
	});
})();

(function(){
	var rimd;

	module('Test methods', {
		setup: function () {
			rimd = new Rimd({
				className: 'rimd2',
				path: '/rimd/resimagecrop.php?image={path}&w={width}',
				widths: [500]
			});
		}
	});

	test('getClosestValues', function(){
		equal(rimd.q.getClosestValues(rimd.options.widths, 123), 500);
	});
})();