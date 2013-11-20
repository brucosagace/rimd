var DEBUG = true;

(function(){
	var rimd, $wrapper, $rimd;

	module('Load image', {
		setup: function () {
			rimd = new Rimd({
				className: '.rimd',
				path: '/rimd/resimagecrop.php?image={path}&w={width}'
			});
			$wrapper = $('#loadImage');
			$rimd = $wrapper.find('.rimd');
		}
	});

	test('is loaded', function(){
		equal($rimd.children('img').length, 1, 'Image is loaded');
	});
})();