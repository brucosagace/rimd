var DEBUG = true;

(function(){
	"use strict";

	if(DEBUG) {
		var 
			options = {
				path: 'resimagecrop.php?image={path}&w={width}',
				reloadOnResize: true,
				lazyload: true,
				widths: [100, 200, 300, 400, 500, 600, 700, 800]
			},
			rimd;

		rimd = new Rimd(options);
	}
})();