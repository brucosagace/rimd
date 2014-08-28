module.exports = {
	name: 'path.replace',
	tests: {
		'([\s\S]+?)': function() {
			var path = 'resimagecrop.php?image={path}&w={width}&h={height}&r={retina}&fx={fx}',
			rex = /\{([\s\S]+?)\}/g;

			path.replace(rex, function(match, tag, cha){});
		},
		'\{width\}': function() {
			var path = 'resimagecrop.php?image={path}&w={width}&h={height}&r={retina}&fx={fx}',
			rex = /\{width\}|\{path\}|\{retina\}|\{height\}|\{fx\}/g;

			path.replace(rex, function(match, tag, cha){});
		}
	}
}