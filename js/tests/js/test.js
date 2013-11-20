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