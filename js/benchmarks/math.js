module.exports = {
	name: 'Math floor',
	tests: {
		'withMath': function() {
			var i = 1.12;

			i = Math.floor(i);
		},
		'withoutMath': function() {
			var i = 1.12;

			i = ~~1.12;
		}
	}
}