(function(){
	"use strict";

	var Rimd = function(params){
		var options = {};

		init(params);

		function init(params){
			var defaults = {
				className: 'rimd_img',
				widths:    ['320', '600', '1024'],
				path:      'resize.php/{path}/{src}?width={width}'
			};

			options = extend(defaults, params);
		}

		function extend(destination, source) {
			for (var property in source) {
				destination[property] = source[property];
			}

			return destination;
		}

		return {
			options: options,
		};
	};

	window.Rimd = Rimd;
})();